/**
 * composables/useOfflineMode.ts
 * ---------------------------------------------------------------------------
 * ระบบ "Offline Mode" ใหม่ (แยกขาดจาก composables/useOfflineSync.ts เดิม —
 * ไฟล์นั้นเป็นระบบ "เล่นออฟไลน์ได้ แล้ว sync ขึ้น Google Sheet อัตโนมัติทันทีที่
 * มีเน็ต" คนละแนวคิดกับที่นี่ และไฟล์นี้จะไม่เรียกใช้/ไม่แตะไฟล์นั้นเลย)
 *
 * หน้าที่ของไฟล์นี้:
 *
 * 1) ตรวจสอบ Internet ทันทีที่เข้าเว็บ (เรียกจาก plugins/offline-mode.client.ts
 *    ซึ่งเป็น Nuxt plugin ที่ทำงานก่อนหน้าไหน ๆ mount) ถ้าไม่มี Internet ->
 *    ล็อกเข้า Offline Mode ทันที และเก็บ flag ไว้ที่ sessionStorage (ผูกกับ
 *    Session ของแท็บ/เบราว์เซอร์ปัจจุบัน) เมื่อล็อกแล้ว ต่อให้ Internet กลับมา
 *    ระหว่างใช้งาน จะ "ไม่สลับกลับ Online" เพราะ checkAndLockOfflineMode()
 *    เช็ค sessionStorage flag ก่อนเสมอ ไม่ใช้ navigator.onLine สด ๆ มาตัดสิน
 *    โหมดซ้ำอีกครั้งในการเปิดหน้าถัดไป/รีเฟรชหน้าเดิมภายใน Session เดียวกัน
 *
 * 2) เก็บข้อมูล "รอบการเล่นแบบ Offline Mode" ลง LocalStorage (ถาวรจริง ข้าม
 *    การปิด/เปิดแอปใหม่ได้ ต่างจาก flag ล็อกโหมดในข้อ 1 ที่อยู่ sessionStorage)
 *    ใช้แสดงผลที่หน้า Profile (ดู components/OfflineSummaryCard.vue):
 *    - round_datetime.start / round_datetime.end
 *    - ฐานที่สแกน: stationId, stationName, scanTime, ลำดับฐาน
 *
 * ไม่แตะ/ไม่เรียกใช้ระบบ Online เดิมเลยสักจุด (useOfflineSync.ts,
 * useMemberApi.ts, server-gas/*) — Offline Mode ใหม่นี้ทำงานอิสระ 100%
 * ผ่าน LocalStorage เท่านั้น
 */

const SESSION_LOCK_KEY = 'offlineMode:sessionLocked'
const ROUND_DATA_KEY = 'offlineMode:roundData'

/** 1 ฐานที่สแกนสำเร็จระหว่างเล่นแบบ Offline Mode */
export interface OfflineStationLog {
  stationId: string
  stationName: string
  /** เวลาที่สแกนสำเร็จ (ms epoch) */
  scanTime: number
  /** ลำดับฐานที่ผู้เล่นสแกน (1 = ฐานแรกที่สแกนสำเร็จ, 2 = ฐานถัดไป, ...) */
  order: number
}

/** ข้อมูล 1 รอบการเล่นแบบ Offline Mode ของผู้เล่น 1 คน (uid) */
export interface OfflineRoundData {
  uid: string
  /** round_datetime.start (ms epoch) — บันทึกทันทีหลังกรอก Registration Form เสร็จ */
  startedAt?: number
  /** round_datetime.end (ms epoch) — บันทึกเมื่อจบเกม (ผ่านครบทุกฐานแล้ว) */
  endedAt?: number
  stations: OfflineStationLog[]
}

function readJson<T>(key: string): T | null {
  if (!import.meta.client) return null
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    // ข้อมูลเสีย -> ทิ้งไปเลย ดีกว่าแอปพังทั้งหน้า
    localStorage.removeItem(key)
    return null
  }
}

export function useOfflineMode() {
  // true ถ้า Session (แท็บ/เบราว์เซอร์ session ปัจจุบัน) นี้ถูกล็อกเข้า Offline Mode แล้ว
  const isOfflineMode = useState<boolean>('offline-mode-locked', () => false)
  // รอบการเล่นปัจจุบัน (โหลดจาก LocalStorage) — null = ยังไม่เคยมีรอบ Offline Mode เลย
  const roundData = useState<OfflineRoundData | null>('offline-mode-round-data', () => null)

  function loadRoundData(): void {
    roundData.value = readJson<OfflineRoundData>(ROUND_DATA_KEY)
  }

  /**
   * เรียกครั้งเดียวตอนแอปเริ่มทำงาน (plugins/offline-mode.client.ts)
   * 1) เคยล็อก Offline Mode ไว้แล้วใน Session นี้ (sessionStorage) -> ล็อกต่อ
   *    ทันที ไม่ต้องเช็ค navigator.onLine ซ้ำเลย (ตรงตามสเปก "ห้ามสลับเป็น
   *    Online แม้ Internet จะกลับมา")
   * 2) ยังไม่เคยล็อกใน Session นี้ -> เช็ค navigator.onLine สด ๆ ครั้งนี้ครั้งเดียว
   *    - ไม่มีเน็ต -> ล็อกเข้า Offline Mode ทันที + จำไว้ใน sessionStorage
   *    - มีเน็ต     -> ปล่อยผ่าน ใช้งาน Online ตามปกติ (ไม่แตะ Flow เดิมเลย)
   */
  function checkAndLockOfflineMode(): void {
    if (!import.meta.client) return

    if (sessionStorage.getItem(SESSION_LOCK_KEY) === '1') {
      isOfflineMode.value = true
      loadRoundData()
      return
    }

    if (!navigator.onLine) {
      sessionStorage.setItem(SESSION_LOCK_KEY, '1')
      isOfflineMode.value = true
      loadRoundData()
    }
  }

  function persistRoundData(next: OfflineRoundData): void {
    if (import.meta.client) {
      localStorage.setItem(ROUND_DATA_KEY, JSON.stringify(next))
    }
    roundData.value = next
  }

  /** เริ่มรอบเล่นใหม่ — เรียกทันทีหลังกรอก Registration Form (Offline Mode) เสร็จ */
  function startRound(uid: string): void {
    persistRoundData({ uid, startedAt: Date.now(), endedAt: undefined, stations: [] })
  }

  /** บันทึกฐานที่สแกนสำเร็จ (กันซ้ำในตัว — ฐานเดิมจะไม่ถูกบันทึกซ้ำ) */
  function logStationScan(stationId: string, stationName: string): void {
    const current = roundData.value ?? { uid: '', stations: [] }
    if (current.stations.some((s) => s.stationId === stationId)) return
    persistRoundData({
      ...current,
      stations: [
        ...current.stations,
        { stationId, stationName, scanTime: Date.now(), order: current.stations.length + 1 },
      ],
    })
  }

  /** จบเกม — บันทึก round_datetime.end (เรียกเมื่อผ่านครบทุกฐานแล้วเท่านั้น) */
  function endRound(): void {
    if (!roundData.value || roundData.value.endedAt) return
    persistRoundData({ ...roundData.value, endedAt: Date.now() })
  }

  return {
    isOfflineMode: readonly(isOfflineMode),
    roundData: readonly(roundData),
    checkAndLockOfflineMode,
    loadRoundData,
    startRound,
    logStationScan,
    endRound,
  }
}
