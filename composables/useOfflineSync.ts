/**
 * composables/useOfflineSync.ts
 * ---------------------------------------------------------------------------
 * ระบบ "Offline First" สำหรับการเล่นเกม (Scan QR ฐาน) — เพิ่มเข้ามาใหม่ทั้งหมด
 * โดย "ไม่แก้" ระบบ Login เดิม (useAuth.ts / useProfile.ts / useMemberApi.ts
 * ของเดิมทุกฟังก์ชันยังทำงานเหมือนเดิมทุกประการ — ไฟล์นี้แค่เรียกใช้ฟังก์ชันที่
 * มีอยู่แล้วเท่านั้น)
 *
 * แนวคิดหลัก:
 * - LocalStorage คือฐานข้อมูลหลักระหว่างเล่นเกม (ผ่าน checkin ที่ยัง Sync
 *   ไม่สำเร็จ ("pending queue") — ดู useAdventure.ts สำหรับสถานะ "ผ่านฐานแล้ว
 *   หรือยัง" ซึ่งเป็น LocalStorage อยู่แล้วเดิม ไม่ได้แก้ตรงนี้)
 * - Google Sheet (ผ่าน Google Apps Script — composables/useMemberApi.ts) ใช้
 *   สำหรับ "Sync" ข้อมูลเท่านั้น ไม่ใช่จุดเดียวที่เก็บสถานะระหว่างเล่น
 * - ผู้ใช้เรียก Sync เองได้ 2 จังหวะตามสเปกเดิม: (1) ผ่านฐาน "นม" (ฐานสุดท้าย)
 *   สำเร็จ หรือ (2) กดปุ่ม "Sync ตอนนี้" เอง — ต้องมี Internet ด้วยเท่านั้น
 *   นอกจากนี้ระบบยัง Sync ให้อัตโนมัติเบื้องหลังอีก 3 จังหวะ (ดู
 *   plugins/offline-sync.client.ts): เปิดแอปมาแล้วมีเน็ตอยู่แล้ว + มีคิวค้าง,
 *   กลับมามีเน็ตระหว่างใช้งาน (event 'online'), และเช็คซ้ำเป็นระยะทุก 45 วินาที
 *   กันเหนียวกรณี Sync ครั้งก่อนล้มเหลวชั่วคราว — ถ้าไม่มีเน็ตเลย ข้อมูลจะค้างอยู่
 *   ใน queue (LocalStorage) ครบทุกรายการ ไม่มีการสูญหาย จนกว่าจะ Sync สำเร็จ
 *
 * ขั้นตอน Sync (flushQueue): Login LINE (ถ้ายังไม่ Login) -> Sync Members ->
 * Sync Journey (ส่งฐานที่ค้างอยู่ใน queue ทีละฐานผ่าน action 'checkin' ซึ่งฝั่ง
 * server-gas จะกันบันทึกซ้ำให้อีกชั้นหนึ่งเผื่อ Sync จากคนละเครื่อง) -> Sync
 * Score (ดึงคะแนนสะสมล่าสุดที่ Google Sheet ยืนยันแล้วกลับมาที่เครื่อง)
 */

import type { AdventureStation } from '~/composables/useAdventure'

const PENDING_KEY = 'offlineSync:pendingCheckins'
const LAST_SYNC_KEY = 'offlineSync:lastSyncAt'

/** 1 ฐานที่ผ่านสำเร็จแล้ว แต่ยังไม่ได้ Sync ขึ้น Google Sheet */
export interface PendingCheckin {
  /** รหัสอ้างอิงเฉพาะของรายการนี้ (client-generated) — ไว้ตรวจสอบ/debug ว่า
   * รายการไหน sync สำเร็จ/ไม่สำเร็จแล้วบ้าง เผื่อในอนาคตฝั่ง backend อยากใช้
   * เป็น idempotency key แทน/เสริมจาก userId+stationId ที่ใช้กันซ้ำอยู่แล้ว */
  uuid: string
  stationId: string
  stationName: string
  point: number
  /** เวลาที่ผ่านฐานสำเร็จ (ms epoch) — ไว้เรียงลำดับ Journey ตอน Sync */
  visitedAt: number
  /** [Fix] roundId ที่ Current Round ใน LocalStorage เป็นเจ้าของอยู่ ณ ตอนที่สแกน
   * ฐานนี้จริง (ดู composables/useRound.ts -> currentRoundId) — บันทึกไว้ตอน
   * queue เสมอ แล้วส่งแนบไปกับ action 'checkin' ตอน sync ด้วย (ดู syncNow()
   * ด้านล่าง) เพื่อไม่ให้ server-gas ต้องเดา Round ปัจจุบันเอาเองตอน sync
   * (ซึ่งอาจกลายเป็น Round ใหม่ที่เพิ่งเปิดไปแล้วถ้า sync มาช้า) — null ถ้า queue
   * ตอนยังไม่มี Round เปิดอยู่เลย (ไม่ควรเกิดขึ้นตาม flow ใหม่ที่ต้องเปิด Round
   * ก่อนบันทึกฐานแรกเสมอ แต่กันไว้เผื่อ edge case) */
  roundId: string | null
}

/** สร้าง UUID สำหรับ 1 รายการใน Queue — ใช้ crypto.randomUUID() ถ้ามี (เบราว์เซอร์ยุคใหม่/HTTPS)
 * ไม่มี (เช่น เบราว์เซอร์เก่า/เปิดผ่าน http บนเครื่อง LAN ตอน dev) -> fallback เป็นการสุ่มเองแทน */
function genUuid(): string {
  if (import.meta.client && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export type SyncResultReason =
  | 'offline'
  | 'already-syncing'
  | 'nothing-to-sync'
  | 'no-member'
  | 'done'

export interface SyncResult {
  success: boolean
  reason: SyncResultReason
  syncedCount: number
  remainingCount: number
  message: string
}

function readJson<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  if (!import.meta.client) return
  localStorage.setItem(key, JSON.stringify(value))
}

export function useOfflineSync() {
  // สถานะอินเทอร์เน็ต — sync ค่าจริงจาก navigator.onLine ที่ plugins/offline-sync.client.ts
  // (แยก plugin ต่างหากเพื่อผูก window 'online'/'offline' event แค่ครั้งเดียวทั้งแอป)
  const isOnline = useState<boolean>('offline-sync-is-online', () => true)

  // คิวฐานที่ผ่านสำเร็จแล้วแต่ยังไม่ได้ Sync ขึ้น Google Sheet (persist ใน LocalStorage)
  const pendingCheckins = useState<PendingCheckin[]>('offline-sync-pending', () => [])
  const initialized = useState<boolean>('offline-sync-initialized', () => false)
  const isSyncing = useState<boolean>('offline-sync-syncing', () => false)
  const lastSyncAt = useState<number | null>('offline-sync-last-at', () => null)
  const lastMessage = useState<string>('offline-sync-last-message', () => '')

  const pendingCount = computed(() => pendingCheckins.value.length)
  const hasPending = computed(() => pendingCount.value > 0)

  /** เรียกครั้งเดียวตอน mounted ของหน้า Scan เพื่อโหลด queue ล่าสุดจาก LocalStorage */
  function initOfflineSync(): void {
    if (initialized.value) return
    pendingCheckins.value = readJson<PendingCheckin[]>(PENDING_KEY, [])
    lastSyncAt.value = readJson<number | null>(LAST_SYNC_KEY, null)
    initialized.value = true
  }

  function persistQueue(next: PendingCheckin[]): void {
    pendingCheckins.value = next
    writeJson(PENDING_KEY, next)
  }

  function isQueued(stationId: string): boolean {
    return pendingCheckins.value.some((item) => item.stationId === stationId)
  }

  /**
   * บันทึกฐานที่ผ่านสำเร็จลง LocalStorage (ไม่ยิง Google Sheet ทันที)
   * ผู้เรียก (pages/scan.vue) ต้องเช็คเองก่อนแล้วว่ายังไม่เคยผ่านฐานนี้
   * (ดู useAdventure().isVisited) — ฟังก์ชันนี้กันซ้ำอีกชั้นในระดับ queue เอง
   */
  function queueCheckin(station: Pick<AdventureStation, 'id' | 'name'>, point: number): void {
    if (isQueued(station.id)) return
    // [Fix] จำ roundId ของ Current Round ที่กำลัง Active อยู่ ณ ตอนสแกนจริง ๆ ไว้คู่กับ
    // รายการนี้เสมอ (ดูเหตุผลเต็ม ๆ ที่ PendingCheckin.roundId ด้านบน)
    const { currentRoundId } = useRound()
    const next: PendingCheckin[] = [
      ...pendingCheckins.value,
      {
        uuid: genUuid(),
        stationId: station.id,
        stationName: station.name,
        point,
        visitedAt: Date.now(),
        roundId: currentRoundId.value,
      },
    ]
    persistQueue(next)
  }

  /**
   * Sync ขึ้น Google Sheet จริง — เรียกเฉพาะตอนผ่านฐาน "นม" หรือกดปุ่ม Sync เอง
   * ทำตามลำดับ: Login LINE (ถ้ายังไม่ Login) -> Sync Members -> Sync Journey ->
   * Sync Score หากไม่มี Internet จะคืนค่า reason: 'offline' ทันที ไม่แตะ queue เลย
   */
  async function syncNow(): Promise<SyncResult> {
    if (!import.meta.client || !isOnline.value || isBrowserOffline()) {
      return {
        success: false,
        reason: 'offline',
        syncedCount: 0,
        remainingCount: pendingCount.value,
        message: 'ไม่มีอินเทอร์เน็ต ข้อมูลจะ Sync อัตโนมัติเมื่อมีอินเทอร์เน็ต',
      }
    }

    if (isSyncing.value) {
      return {
        success: false,
        reason: 'already-syncing',
        syncedCount: 0,
        remainingCount: pendingCount.value,
        message: 'กำลัง Sync อยู่ กรุณารอสักครู่',
      }
    }

    if (pendingCheckins.value.length === 0) {
      return {
        success: true,
        reason: 'nothing-to-sync',
        syncedCount: 0,
        remainingCount: 0,
        message: 'ไม่มีข้อมูลที่ต้อง Sync',
      }
    }

    isSyncing.value = true

    try {
      const { authData, hasAuth, loginWithLine } = useAuth()
      const { profile, hasProfile, refreshFromMember } = useProfile()
      const { syncMember, checkin, getMember } = useMemberApi()

      // ------- Step 1: Login LINE (ถ้ายังไม่ได้ Login) -------
      // ระบบ Login เดิม (useAuth.ts) ไม่ถูกแก้ไข — ที่นี่แค่ "เรียกใช้" ฟังก์ชันเดิม
      // เผื่อกรณีเซสชัน LINE หลุดระหว่างเล่นแบบออฟไลน์นาน ๆ (ปกติจะ login อยู่แล้ว
      // เพราะทุกหน้าเกมถูก guard ด้วย useRequireProfile() มาก่อนหน้านี้)
      //
      // [Fix] เดิมเช็คแค่ !hasAuth.value (authData ใน useState — ตามสเปกของ
      // useAuth.ts เอง "ไม่ restore" ให้ผู้เล่น Guest ตอน Hard Refresh กลางเกม
      // เด็ดขาด มีแค่ LIFF session ของ LINE เท่านั้นที่ restore อัตโนมัติได้) เดิม
      // ทำให้ผู้เล่นที่เลือก "เข้าใช้งานโดยไม่เชื่อม LINE" ตั้งแต่ต้น แล้ว Hard
      // Refresh กลางเกม (เช่น มือถือ reload แท็บพื้นหลัง) พอฐานถูก Sync (ไม่ว่าจาก
      // Timer 45 วินาที/ปุ่ม Sync เอง/ผ่านฐานสุดท้าย) จะโดน liff.login() redirect
      // ทั้งหน้าออกไปที่ LINE ทันทีโดยไม่ได้ตั้งใจ — เช็คจาก profile.value.loginType
      // (ค่าจาก UserProfile ที่ persist ข้าม Reload จริง คนละก้อนกับ authData) แทน
      // บังคับ login LINE เฉพาะผู้เล่นที่เลือก login ด้วย LINE มาแต่แรกเท่านั้น
      if (!hasAuth.value && profile.value?.loginType === 'line') {
        await loginWithLine()
      }

      // ------- Step 2: Sync Members -------
      // โปรไฟล์ (ชื่อ/นามสกุล/เบอร์) ถูกบันทึกไว้ที่ Google Sheet ตั้งแต่ตอน
      // Login/สมัครสมาชิกแล้ว (ระบบเดิม) ปกติจะมี memberId ติดมาด้วยเสมอ
      // ถ้าไม่มี (เช่น สมัครค้างไว้ตอนไม่มีเน็ต) ให้ลองซิงค์สมาชิกใหม่อีกครั้งที่นี่
      let memberId = profile.value?.memberId
      if (!memberId && hasProfile.value && profile.value && authData.value) {
        try {
          const result = await syncMember(
            {
              firstName: profile.value.firstName,
              lastName: profile.value.lastName,
              phone: profile.value.phone,
              gender: profile.value.gender,
              birthYear: profile.value.birthYearRange,
            },
            authData.value,
          )
          if (result.success && result.member) {
            refreshFromMember(result.member)
            memberId = result.member.memberId
          }
        } catch {
          // เน็ตหลุดกลางคัน/API ล่ม — ปล่อยผ่าน ให้ตกไปเป็น 'no-member' ด้านล่าง
        }
      }

      if (!memberId) {
        isSyncing.value = false
        return {
          success: false,
          reason: 'no-member',
          syncedCount: 0,
          remainingCount: pendingCount.value,
          message: 'ยังไม่มีข้อมูลสมาชิกใน Google Sheet กรุณาเข้าสู่ระบบให้เสร็จสมบูรณ์ก่อน',
        }
      }

      // ------- Step 3: Sync Journey -------
      // ส่งฐานที่ค้างอยู่ใน queue ทีละฐานผ่าน action 'checkin' — ฝั่ง server-gas
      // จะกันบันทึกซ้ำให้อีกชั้น (alreadyVisited) เผื่อเคย Sync จากเครื่องอื่นมาก่อน
      // ใช้ profile.firstName ตรง ๆ (ฟิลด์บังคับกรอกของทุกคนเสมอ ไม่ว่าจะ Login ผ่าน
      // LINE หรือไม่) แทน displayName เดิม (LINE profile) ซึ่งผู้ใช้ที่ไม่ได้ Login
      // ผ่าน LINE ไม่มีค่าเลย
      const firstName = profile.value?.firstName ?? ''
      const queue = [...pendingCheckins.value]
      const remaining: PendingCheckin[] = []
      let syncedCount = 0

      for (const item of queue) {
        try {
          const res = await checkin({
            userId: memberId,
            firstName,
            stationId: item.stationId,
            stationName: item.stationName,
            point: item.point,
            clientId: item.uuid,
            // [Fix] ส่ง roundId ที่จำไว้ตอน queue เสมอ (undefined สำหรับรายการเก่าที่
            // queue ไว้ก่อนอัปเดตนี้ - server-gas จะ fallback ไปเดา Round ปัจจุบันเอง
            // เหมือน behavior เดิม เฉพาะรายการเก่านั้นเท่านั้น)
            roundId: item.roundId ?? undefined,
          })
          if (res.success) {
            syncedCount += 1
          } else {
            remaining.push(item)
          }
        } catch {
          remaining.push(item)
        }
      }
      persistQueue(remaining)

      // ------- Step 4: Sync Score -------
      // ดึงคะแนนสะสม/จำนวนครั้งที่เข้าใช้ล่าสุดที่ Google Sheet ยืนยันแล้วกลับมา
      // เก็บใน LocalStorage (profile) ทับค่าเดิม ให้ตรงกับฝั่ง Server เสมอหลัง Sync
      try {
        const memberRes = await getMember(memberId)
        if (memberRes.success && memberRes.member) {
          refreshFromMember(memberRes.member)
        }
      } catch {
        // ดึงคะแนนล่าสุดไม่สำเร็จ ไม่กระทบผลลัพธ์ Sync Journey ที่ทำสำเร็จไปแล้ว
      }

      // ดึงฐานที่ผ่านจริง + คะแนนสะสมจริงจากชีต "Journey"/"Score" (คนละชีตกับ
      // "Members" ด้านบน) มา refresh สถานะฐาน/Point ที่หน้า Home-Map ใช้แสดงผล
      // (useAdventure) ให้ตรงกับ Google Sheet เสมอทันทีหลัง Sync สำเร็จ
      try {
        const { refreshFromBackend } = useAdventure()
        await refreshFromBackend(memberId)
      } catch {
        // เงียบไว้ — ไม่กระทบผลลัพธ์ Sync Journey ที่ทำสำเร็จไปแล้วเช่นกัน
      }

      const now = Date.now()
      lastSyncAt.value = now
      writeJson(LAST_SYNC_KEY, now)

      const success = remaining.length === 0
      lastMessage.value = success
        ? `Sync สำเร็จ ${syncedCount} ฐาน`
        : `Sync สำเร็จ ${syncedCount} ฐาน เหลือ ${remaining.length} ฐานที่ Sync ไม่สำเร็จ`

      return {
        success,
        reason: 'done',
        syncedCount,
        remainingCount: remaining.length,
        message: lastMessage.value,
      }
    } finally {
      isSyncing.value = false
    }
  }

  return {
    isOnline,
    pendingCheckins: readonly(pendingCheckins),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastSyncAt: readonly(lastSyncAt),
    lastMessage: readonly(lastMessage),
    initOfflineSync,
    isQueued,
    queueCheckin,
    syncNow,
  }
}
