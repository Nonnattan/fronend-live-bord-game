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

/** อ่านสถานะ offline จาก navigator — ใช้เป็นจุดเดียวทั้งโปรเจกต์ */
export function isBrowserOffline(): boolean {
  if (!import.meta.client) return false
  return !navigator.onLine
}

export function useOfflineMode() {
  const isOfflineMode = useState<boolean>('offline-mode-locked', () => false)
  const offlineGatePending = useState<boolean>('offline-mode-gate-pending', () => false)
  const roundData = useState<OfflineRoundData | null>('offline-mode-round-data', () => null)

  function loadRoundData(): void {
    roundData.value = readJson<OfflineRoundData>(ROUND_DATA_KEY)
  }

  /**
   * อัปเดต state จาก navigator.onLine
   * @param fromRuntimeEvent true = มาจาก offline/online event ระหว่างใช้งาน (ไม่แสดง Gate)
   */
  function syncConnectivityState(fromRuntimeEvent = false): void {
    if (!import.meta.client) return

    const offline = isBrowserOffline()
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
  }
}
