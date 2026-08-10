/**
 * composables/useRound.ts
 * ---------------------------------------------------------------------------
 * จัดการ "รอบการเล่นปัจจุบัน" (Round) ฝั่ง ONLINE เท่านั้น — reuse
 * server-gas/RoundService.gs ที่มีอยู่แล้วทั้งหมด (roundStart/roundEnd/getRound
 * ผ่าน composables/useMemberApi.ts) ไฟล์นี้ไม่มี business logic ของ Round เอง
 * เลย แค่เป็นตัวคุมฝั่ง client ว่า "เมื่อไหร่ควรเรียก roundStart()" เท่านั้น
 *
 * กติกา:
 * - เรียก ensureRoundStarted(userId, firstName) ได้บ่อยเท่าไหร่ก็ได้ (เช่น ทุก
 *   ครั้งที่หน้า Home/Map/Scan mount ผ่าน useRequireProfile) แต่จะยิง roundStart()
 *   ขึ้น Google Sheet จริง ๆ "ครั้งเดียว" ต่อ 1 รอบเท่านั้น — ป้องกัน Refresh หน้า/
 *   เปลี่ยนหน้า/กลับหน้าเดิม สร้าง Round ซ้ำ ด้วย 3 ชั้น:
 *   1) เช็ค state ในหน่วยความจำก่อน (currentRoundId) ถ้ามีแล้วและยังไม่ Ended -> ข้ามเลย
 *   2) เช็ค LocalStorage (persist ข้าม Refresh/เปลี่ยนหน้า) ถ้าเจอ roundId ของ
 *      userId เดียวกัน -> ใช้ต่อเลย ไม่ยิง API ซ้ำ
 *   3) ไม่เจอทั้ง 2 ข้อบน -> ถาม backend ก่อนด้วย getRound() (reuse ของเดิม) ว่า
 *      มีรอบที่ยัง 'Started' ค้างอยู่ไหม (เช่น เปิดเครื่อง/เบราว์เซอร์ใหม่ที่ไม่มี
 *      LocalStorage เดิม) มี -> ใช้ roundId เดิมนั้น ไม่มี -> ค่อยสร้างรอบใหม่จริง ๆ
 *      ด้วย roundStart() (ซึ่งฝั่ง backend เองก็ idempotent ด้วย roundId อยู่แล้ว)
 * - มี in-flight lock กัน race condition ตอนหลายหน้า/หลาย component เรียกพร้อมกัน
 *   (เช่น Home + BottomNav mount พร้อมกัน) ไม่ให้ยิง roundStart()/getRound() ซ้อนกัน
 */

const ROUND_STORAGE_KEY = 'onlineRound:current'

interface StoredRound {
  roundId: string
  userId: string
}

function genRoundUuid(): string {
  if (import.meta.client && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function readStoredRound(): StoredRound | null {
  if (!import.meta.client) return null
  const raw = localStorage.getItem(ROUND_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.roundId === 'string' && typeof parsed.userId === 'string') {
      return parsed as StoredRound
    }
    return null
  } catch {
    localStorage.removeItem(ROUND_STORAGE_KEY)
    return null
  }
}

function persistStoredRound(data: StoredRound): void {
  if (import.meta.client) {
    localStorage.setItem(ROUND_STORAGE_KEY, JSON.stringify(data))
  }
}

function clearStoredRound(): void {
  if (import.meta.client) {
    localStorage.removeItem(ROUND_STORAGE_KEY)
  }
}

// in-flight lock ระดับ module — กัน ensureRoundStarted() หลายจุดเรียกพร้อมกันในแท็บ
// เดียวกัน (เช่น หลาย component mount พร้อมกัน) ไม่ให้ยิง roundStart()/getRound() ซ้อนกัน
let ensureInFlight: Promise<void> | null = null

export function useRound() {
  // Global reactive state (SSR-safe) — RoundId ของรอบปัจจุบัน ใช้ต่อใน Journey
  // (ดู pages/scan.vue -> useOfflineSync.ts -> checkin() -> server-gas/CheckinService.gs)
  const currentRoundId = useState<string | null>('round-current-id', () => null)
  const isRoundEnded = useState<boolean>('round-current-ended', () => false)

  /**
   * เรียกหลัง Online Login สำเร็จ (มี userId/memberId พร้อมแล้ว) — สร้าง Round ใหม่
   * และเรียก roundStart() "เพียง 1 ครั้ง" ต่อรอบตามสเปก เรียกซ้ำได้ปลอดภัยเสมอ
   * (Refresh หน้า/เปลี่ยนหน้า/กลับหน้าเดิม จะไม่สร้าง Round ใหม่)
   */
  async function ensureRoundStarted(userId: string, firstName?: string): Promise<void> {
    if (!import.meta.client || !userId) return

    // ชั้น 1: มี Round ในหน่วยความจำอยู่แล้วและยังไม่ End -> ไม่ต้องทำอะไรต่อ
    if (currentRoundId.value && !isRoundEnded.value) return

    // กันเรียกซ้อนกัน (เช่นหลาย component mount พร้อมกันตอนหน้าโหลดครั้งแรก)
    if (ensureInFlight) return ensureInFlight

    ensureInFlight = (async () => {
      try {
        // ชั้น 2: เคย persist RoundId ของ userId คนนี้ไว้ใน LocalStorage แล้ว (Refresh/
        // เปลี่ยนหน้า/กลับหน้าเดิม) -> ใช้ต่อเลย ไม่ยิง API ใด ๆ ทั้งสิ้น
        const stored = readStoredRound()
        if (stored && stored.userId === userId) {
          currentRoundId.value = stored.roundId
          isRoundEnded.value = false
          return
        }

        const { getRound, roundStart } = useMemberApi()

        // ชั้น 3: ไม่มีใน LocalStorage (เช่นเครื่อง/เบราว์เซอร์ใหม่) -> ถาม backend ก่อน
        // ว่ามีรอบที่ยัง 'Started' ค้างอยู่ไหม กันสร้างรอบใหม่ซ้ำโดยไม่จำเป็น
        const existing = await getRound(userId).catch(() => null)
        if (existing?.success && existing.round && existing.round.status === 'Started') {
          currentRoundId.value = existing.round.roundId
          isRoundEnded.value = false
          persistStoredRound({ roundId: existing.round.roundId, userId })
          return
        }

        // ไม่มี Round ที่ยัง Started เลย -> เริ่มรอบใหม่จริง ๆ (roundStart() เพียง 1 ครั้ง)
        const newRoundId = genRoundUuid()
        const started = await roundStart({ roundId: newRoundId, userId, firstName }).catch(() => null)
        if (started?.success) {
          const roundId = started.round?.roundId || newRoundId
          currentRoundId.value = roundId
          isRoundEnded.value = false
          persistStoredRound({ roundId, userId })
        }
        // ยิงไม่สำเร็จ (ออฟไลน์/API ล่ม) -> เงียบไว้ ครั้งถัดไปที่เรียก ensureRoundStarted()
        // (เช่น เปลี่ยนหน้า) จะลองใหม่เองอัตโนมัติ เพราะ currentRoundId ยังเป็น null อยู่
      } finally {
        ensureInFlight = null
      }
    })()

    return ensureInFlight
  }

  /**
   * เรียกเมื่อผู้เล่นกด "จบเกม" ที่ Popup ฐานนม (ฐานสุดท้าย) เท่านั้น — ปิด Round
   * เดิมด้วย roundId เดิม (บันทึก EndTime + เปลี่ยน Status เป็น 'Ended') กด "เล่นต่อ"
   * จะไม่เรียกฟังก์ชันนี้เลย (Round เดิมยังคง Started ต่อไป เล่นฐานต่อได้ตามสเปก)
   */
  async function endCurrentRound(userId: string): Promise<void> {
    if (!import.meta.client || !currentRoundId.value || !userId) return
    const { roundEnd } = useMemberApi()
    try {
      await roundEnd(currentRoundId.value, userId)
    } finally {
      // จบ Round แล้วไม่ว่าจะยิงสำเร็จหรือไม่ก็ตาม -> เคลียร์ค่าฝั่ง client เสมอ เพื่อให้
      // ensureRoundStarted() ครั้งถัดไป (รอบเล่นใหม่) เริ่ม Round ใหม่ให้อัตโนมัติ
      isRoundEnded.value = true
      currentRoundId.value = null
      clearStoredRound()
    }
  }

  return {
    currentRoundId: readonly(currentRoundId),
    isRoundEnded: readonly(isRoundEnded),
    ensureRoundStarted,
    endCurrentRound,
  }
}
