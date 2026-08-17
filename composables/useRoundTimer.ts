/**
 * composables/useRoundTimer.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ตัวจับเวลาของ Flow ใหม่ 2 ชั้น (ระบบขนาน ไม่แตะ useAdventure/
 * useRound/useOfflineMode เดิมเลยสักฟังก์ชัน แค่ "นับเวลา + บอกว่าหมดหรือยัง"):
 *
 *   - "เวลารอบ" 2 ชั่วโมง — เริ่มนับตอนกดปุ่ม GO (ดู pages/home.vue)
 *   - "เวลาเผ่า" 30 นาที — เริ่มนับใหม่ทุกครั้งที่สแกน QR เข้าฐานใหม่สำเร็จ (ดู
 *     pages/scan.vue::completeStationVisit())
 *
 * ทั้งสองค่า "หมดเวลา = บังคับจบรอบ" ตามที่ตกลงกันไว้ — composable นี้ไม่รู้จัก/
 * ไม่เรียก Logic การจบรอบเอง (ดู composables/useForceEndRound.ts ที่เป็นคนเรียก
 * เมื่อเห็น isRoundExpired/isStationExpired เป็น true ผ่าน watch() ในแต่ละหน้า)
 *
 * เก็บเป็น "เวลาสิ้นสุด" (epoch ms) ใน LocalStorage แทนการเก็บ "เวลาเริ่ม" ตรง ๆ
 * เพื่อให้ Refresh หน้า/ปิดแอปแล้วเปิดใหม่ยังนับต่อจากเวลาจริงได้ถูกต้องเสมอ
 * (ไม่ต้องคำนวณ duration - elapsed เอง) เป็น global useState เดียวกันทั้งแอป
 * (Home/Map/Scan เห็นค่าเดียวกันเสมอ ไม่ว่าจะอยู่หน้าไหน)
 */

const ROUND_ENDS_AT_KEY = 'roundTimer:roundEndsAt'
const STATION_ENDS_AT_KEY = 'roundTimer:stationEndsAt'

/** 2 ชั่วโมง — เวลารวมของทั้งรอบ นับจากกดปุ่ม GO */
export const ROUND_DURATION_MS = 2 * 60 * 60 * 1000
/** 30 นาที — เวลาต่อ 1 ฐาน นับจากสแกน QR เข้าฐานสำเร็จ */
export const STATION_DURATION_MS = 30 * 60 * 1000

function readEndsAt(key: string): number | null {
  if (!import.meta.client) return null
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

function writeEndsAt(key: string, value: number | null): void {
  if (!import.meta.client) return
  if (value === null) localStorage.removeItem(key)
  else localStorage.setItem(key, String(value))
}

/** ตัวจับเวลาจริง (setInterval) — เก็บเป็นตัวแปรระดับ module (ไม่ใช่ useState)
 * เพราะเป็นแค่ Timer Handle ล้วน ๆ ไม่ใช่ State ที่ต้อง Reactive/Persist */
let intervalId: ReturnType<typeof setInterval> | null = null

export function useRoundTimer() {
  const roundEndsAt = useState<number | null>('round-timer-round-ends-at', () => null)
  const stationEndsAt = useState<number | null>('round-timer-station-ends-at', () => null)
  /** bump ทุกวินาทีผ่าน setInterval เพื่อบังคับให้ computed ด้านล่าง re-evaluate —
   * ตัวมันเองไม่มีความหมายอะไรนอกจากเป็น "ตัวกระตุ้น reactivity" ให้ countdown เดิน */
  const tick = useState<number>('round-timer-tick', () => Date.now())

  function ensureTicking(): void {
    if (!import.meta.client || intervalId) return
    intervalId = setInterval(() => {
      tick.value = Date.now()
    }, 1000)
  }

  /** เรียกตอน mounted ของหน้าที่ต้องแสดง/เช็ค Timer (Home/Map/Scan) — โหลดค่าที่
   * ค้างจาก LocalStorage กลับมา (เผื่อ Refresh หน้ากลางรอบ) แล้วเริ่ม tick */
  function initRoundTimer(): void {
    roundEndsAt.value = readEndsAt(ROUND_ENDS_AT_KEY)
    stationEndsAt.value = readEndsAt(STATION_ENDS_AT_KEY)
    tick.value = Date.now()
    ensureTicking()
  }

  /** เริ่มนับเวลารอบ 2 ชั่วโมงใหม่ — เรียกตอนกดปุ่ม GO เท่านั้น (ดู pages/home.vue) */
  function startRoundTimer(): void {
    const endsAt = Date.now() + ROUND_DURATION_MS
    roundEndsAt.value = endsAt
    writeEndsAt(ROUND_ENDS_AT_KEY, endsAt)
    ensureTicking()
  }

  /** เริ่มนับเวลาเผ่า 30 นาทีใหม่ — เรียกทุกครั้งที่สแกน QR เข้าฐานใหม่สำเร็จ
   * (ดู pages/scan.vue::completeStationVisit()) ทับค่าเดิมของฐานก่อนหน้าไปเลย */
  function startStationTimer(): void {
    const endsAt = Date.now() + STATION_DURATION_MS
    stationEndsAt.value = endsAt
    writeEndsAt(STATION_ENDS_AT_KEY, endsAt)
    ensureTicking()
  }

  /** เคลียร์ Timer เผ่า (ไม่แตะ Timer รอบ) — เรียกตอนทำภารกิจของฐานนั้นเสร็จแล้ว
   * (ตอบคำถามแล้ว/ไม่มีคำถามให้ตอบ) กันเวลานับต่อไปเรื่อย ๆ ทั้งที่ทำฐานนั้นเสร็จแล้ว */
  function clearStationTimer(): void {
    stationEndsAt.value = null
    writeEndsAt(STATION_ENDS_AT_KEY, null)
  }

  /** เคลียร์ทั้งคู่ — เรียกตอนจบรอบเสมอ (ไม่ว่าจะจบเองหรือหมดเวลา) */
  function clearAllTimers(): void {
    roundEndsAt.value = null
    stationEndsAt.value = null
    writeEndsAt(ROUND_ENDS_AT_KEY, null)
    writeEndsAt(STATION_ENDS_AT_KEY, null)
  }

  const roundRemainingMs = computed(() =>
    roundEndsAt.value === null ? null : Math.max(0, roundEndsAt.value - tick.value),
  )
  const stationRemainingMs = computed(() =>
    stationEndsAt.value === null ? null : Math.max(0, stationEndsAt.value - tick.value),
  )

  /** true ต่อเนื่องตราบใดที่ยังไม่ clearAllTimers() — ใช้แยกจาก "ยังไม่เคยกด GO
   * เลย" (roundEndsAt === null) ในหน้า Home ที่ต้องโชว์ปุ่ม GO เฉพาะกรณีหลังเท่านั้น */
  const hasActiveRoundTimer = computed(() => roundEndsAt.value !== null)

  const isRoundExpired = computed(() => roundRemainingMs.value !== null && roundRemainingMs.value <= 0)
  const isStationExpired = computed(
    () => stationRemainingMs.value !== null && stationRemainingMs.value <= 0,
  )

  /** แปลง ms -> "HH:MM:SS" (มีชั่วโมง) หรือ "MM:SS" (ไม่มี) สำหรับแสดงผล */
  function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
  }

  const roundRemainingLabel = computed(() =>
    roundRemainingMs.value === null ? null : formatDuration(roundRemainingMs.value),
  )
  const stationRemainingLabel = computed(() =>
    stationRemainingMs.value === null ? null : formatDuration(stationRemainingMs.value),
  )

  return {
    initRoundTimer,
    startRoundTimer,
    startStationTimer,
    clearStationTimer,
    clearAllTimers,
    roundRemainingMs,
    stationRemainingMs,
    roundRemainingLabel,
    stationRemainingLabel,
    hasActiveRoundTimer,
    isRoundExpired,
    isStationExpired,
  }
}
