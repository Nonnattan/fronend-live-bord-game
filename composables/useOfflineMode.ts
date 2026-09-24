/**
 * composables/useOfflineMode.ts
 * ---------------------------------------------------------------------------
 * ระบบ Offline Mode — ตรวจจับสถานะ Internet แบบ real-time (ตอนเปิดแอป +
 * online/offline events) แล้วสลับโหมดอัตโนมัติ:
 *   - ไม่มีเน็ต -> isOfflineMode = true ทันที (หยุด API, ใช้ LocalStorage เท่านั้น)
 *   - มีเน็ตกลับมา -> isOfflineMode = false + trigger auto-sync (plugins/offline-mode.client.ts)
 *
 * offlineGatePending = true เฉพาะตอนเปิดแอบครั้งแรกขณะ offline (แสดง OfflineGateScreen)
 * ถ้าเน็ตหลุดระหว่างใช้งาน -> เข้า Offline Mode ทันทีโดยไม่บล็อกหน้าจอ Gate ซ้ำ
 */

const GATE_DISMISSED_KEY = 'offlineMode:gateDismissed'
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
  startedAt?: number
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
    localStorage.removeItem(key)
    return null
  }
}

/** อ่านสถานะ offline จาก navigator — ใช้เป็นจุดเดียวทั้งโปรเจกต์
 * หมายเหตุ (บั๊กที่ทำให้ Online พัง): navigator.onLine บอกได้แค่ว่า network interface
 * (WiFi/มือถือ) ต่ออยู่หรือไม่ ไม่ได้การันตีว่าออกอินเทอร์เน็ตได้จริง และเป็นที่รู้กันดีว่า
 * รายงานผิดพลาด (false negative) ได้บ่อย โดยเฉพาะตอนโหลดหน้าแรกก่อน network stack
 * พร้อม หรือใน LINE in-app browser (LIFF) — ห้ามใช้ค่านี้เพียงอย่างเดียวมาตัดสินใจ
 * ล็อกทั้งแอปเข้า Offline Mode ทันที ต้องเช็คซ้ำด้วย verifyReallyOffline() ก่อนเสมอ
 * (ดูจุดเรียกใช้ใน syncConnectivityState) */
export function isBrowserOffline(): boolean {
  if (!import.meta.client) return false
  return !navigator.onLine
}

/**
 * เช็ค connectivity จริงด้วยการยิง request เบา ๆ ไปที่ API endpoint (Google Apps Script)
 * แทนที่จะเชื่อ navigator.onLine เพียงอย่างเดียว — ใช้ยืนยันอีกชั้นก่อนฟันธงว่า "ไม่มีเน็ตจริง ๆ"
 * เท่านั้น (ไม่ได้เรียกแทน callApi() ปกติ และไม่กระทบ error handling เดิมของ useMemberApi.ts)
 * คืนค่า true เฉพาะกรณีที่มั่นใจว่าออฟไลน์จริงเท่านั้น — ถ้าเช็คไม่ได้ผลชัดเจน (เช่น ยังไม่ได้
 * ตั้งค่า API_BASE_URL) จะไม่ฟันธงว่าออฟไลน์ เพื่อไม่ให้ผู้ใช้ที่มีเน็ตจริงถูกล็อกผิดพลาด
 */
async function verifyReallyOffline(): Promise<boolean> {
  if (!import.meta.client) return false
  if (navigator.onLine) return false // navigator.onLine บอกว่ามีเน็ตอยู่แล้ว ไม่ต้องเช็คซ้ำ

  const config = useRuntimeConfig()
  const probeUrl = config.public.apiBaseUrl
  if (!probeUrl) return true // ไม่มี endpoint ให้ยิงเช็ค ใช้ค่า navigator.onLine เดิมไปก่อน

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)
    // mode: 'no-cors' เพราะ GAS Web App ไม่รองรับ CORS preflight (เหมือนหมายเหตุใน useMemberApi.ts)
    // ไม่สนใจเนื้อหา response เลย แค่เช็คว่ายิง request ออกไปได้จริงหรือไม่ (ไม่ throw network error)
    await fetch(probeUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: controller.signal })
    clearTimeout(timeout)
    return false // ยิงผ่าน -> จริง ๆ มีเน็ต (navigator.onLine รายงานผิดพลาด)
  } catch {
    return true // ยิงไม่ผ่านจริง ๆ (timeout/network error) -> ยืนยันว่าไม่มีเน็ตจริง
  }
}

export function useOfflineMode() {
  const isOfflineMode = useState<boolean>('offline-mode-locked', () => false)
  const offlineGatePending = useState<boolean>('offline-mode-gate-pending', () => false)
  const roundData = useState<OfflineRoundData | null>('offline-mode-round-data', () => null)

  function loadRoundData(): void {
    roundData.value = readJson<OfflineRoundData>(ROUND_DATA_KEY)
  }

  /**
   * อัปเดต state จาก navigator.onLine (เช็คซ้ำด้วย verifyReallyOffline() ก่อนฟันธงเสมอ)
   * @param fromRuntimeEvent true = มาจาก offline/online event ระหว่างใช้งาน (ไม่แสดง Gate)
   */
  async function syncConnectivityState(fromRuntimeEvent = false): Promise<void> {
    if (!import.meta.client) return

    // เช็คซ้ำด้วย request จริงก่อนฟันธงว่าออฟไลน์ — กัน navigator.onLine รายงานผิดพลาดแล้ว
    // ไปล็อกทั้งแอป (รวม Online Login ด้วย <OfflineGateScreen /> ใน app.vue) ทั้งที่จริงมีเน็ต
    const offline = await verifyReallyOffline()
    isOfflineMode.value = offline

    if (offline) {
      loadRoundData()
      const gateDismissed = sessionStorage.getItem(GATE_DISMISSED_KEY) === '1'
      // แสดง Gate เฉพาะตอนเปิดแอปครั้งแรกขณะ offline — ไม่บล็อกซ้ำเมื่อเน็ตหลุดระหว่างเล่น
      offlineGatePending.value = !fromRuntimeEvent && !gateDismissed
    } else {
      offlineGatePending.value = false
      sessionStorage.removeItem(GATE_DISMISSED_KEY)
    }
  }

  /** เรียกครั้งเดียวจาก plugins/offline-mode.client.ts */
  function initConnectivityWatch(onBackOnline?: () => void): void {
    if (!import.meta.client) return

    syncConnectivityState(false)

    window.addEventListener('offline', () => {
      syncConnectivityState(true)
    })

    window.addEventListener('online', () => {
      syncConnectivityState(true)
      onBackOnline?.()
    })
  }

  /** กดปุ่ม "เข้าโหมด Offline" ที่ OfflineGateScreen */
  function confirmOfflineMode(): void {
    if (!import.meta.client) return
    sessionStorage.setItem(GATE_DISMISSED_KEY, '1')
    isOfflineMode.value = true
    offlineGatePending.value = false
    loadRoundData()
  }

  function persistRoundData(next: OfflineRoundData): void {
    if (import.meta.client) {
      localStorage.setItem(ROUND_DATA_KEY, JSON.stringify(next))
    }
    roundData.value = next
  }

  function startRound(uid: string): void {
    persistRoundData({ uid, startedAt: Date.now(), endedAt: undefined, stations: [] })
  }

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

  function endRound(): void {
    if (!roundData.value || roundData.value.endedAt) return
    persistRoundData({ ...roundData.value, endedAt: Date.now() })
  }

  /** [ใหม่] ล้างข้อมูลรอบ Offline ทิ้ง (LocalStorage + State) โดยไม่สร้างรอบใหม่ให้
   * ทันที — ใช้ตอน "จบเกมสำเร็จ" (pages/round-summary.vue::confirmAndGoHome()) แทน
   * การเรียก startRound() เดิมที่เผื่อเตรียมรอบถัดไปไว้ล่วงหน้าทันที (ขัดกับสเปกใหม่
   * "ห้ามเริ่ม Round ใหม่อัตโนมัติ" — รอบถัดไปจะถูกสร้างตอนกด GO ที่ pages/starting.vue
   * ตามปกติอยู่แล้ว) และตอน Session หมดอายุเกิน 24 ชม. (ดู composables/useSessionExpiry.ts) */
  function clearRoundData(): void {
    if (import.meta.client) {
      localStorage.removeItem(ROUND_DATA_KEY)
    }
    roundData.value = null
  }

  return {
    isOfflineMode: readonly(isOfflineMode),
    offlineGatePending: readonly(offlineGatePending),
    roundData: readonly(roundData),
    initConnectivityWatch,
    confirmOfflineMode,
    loadRoundData,
    startRound,
    logStationScan,
    endRound,
    clearRoundData,
  }
}
