/**
 * composables/useStations.ts
 * ---------------------------------------------------------------------------
 * ระบบนับ "ฐาน" (สถานี/checkpoint) ที่ผู้ใช้เข้าไปแล้ว สำหรับ Summary Card
 * บนหน้า Home ("เข้าฐานแล้ว X/4")
 *
 * หมายเหตุสำคัญ: ระบบฐาน/checkpoint ยังไม่มีอยู่จริงในแอปนี้เลย (ไม่มีคอลัมน์ใน
 * Google Sheet, หน้า Scan ก็ยังไม่ได้ผูกกับฐานใด ๆ) ฟังก์ชันนี้จึงเก็บสถานะ
 * "เข้าฐานแล้วหรือยัง" ไว้ที่ LocalStorage ของเครื่องผู้ใช้ก่อน (ค่าเริ่มต้น
 * ทุกคนคือ 0/4 เสมอ) แยกเป็น composable ต่างหากเพื่อให้ในอนาคตสลับไปผูกกับ
 * Google Sheet/Scan จริงได้ง่าย โดยหน้า Home ไม่ต้องแก้โครงสร้างอะไรเพิ่ม
 * (เรียก markVisited(stationId) ตอน Scan สำเร็จตรงกับฐานใดฐานหนึ่งได้เลยในอนาคต)
 */

const STORAGE_KEY = 'visitedStations'

export interface Station {
  id: string
  name: string
  description: string
  icon: string
  /** ตำแหน่งเปอร์เซ็นต์ (0-100) สำหรับวาดหมุดใน Map Preview บนหน้า Home */
  x: number
  y: number
}

/** รายชื่อฐานทั้ง 4 ฐาน (ข้อมูลตั้งต้น — แก้ชื่อ/ตำแหน่งจริงได้ทีหลังตอนผูกกับแผนที่จริง) */
export const STATIONS: Station[] = [
  { id: 'station-1', name: 'ฐานที่ 1', description: 'จุดเริ่มต้น', icon: 'i-lucide-flag', x: 22, y: 30 },
  { id: 'station-2', name: 'ฐานที่ 2', description: 'ทุ่งหญ้า', icon: 'i-lucide-trees', x: 68, y: 22 },
  { id: 'station-3', name: 'ฐานที่ 3', description: 'โรงนา', icon: 'i-lucide-warehouse', x: 30, y: 72 },
  { id: 'station-4', name: 'ฐานที่ 4', description: 'สวนผลไม้', icon: 'i-lucide-apple', x: 75, y: 68 },
]

export function useStations() {
  // Global reactive state (SSR-safe) — sync จาก LocalStorage ใน initStations()
  const visitedIds = useState<string[]>('visited-stations', () => [])

  const totalStations = STATIONS.length
  const visitedCount = computed(() => visitedIds.value.length)
  const isComplete = computed(() => visitedCount.value >= totalStations)

  function getStoredVisited(): string[] {
    if (!import.meta.client) return []
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
  }

  /** เรียกตอน mounted ของหน้า Home เพื่อโหลดค่าล่าสุดจาก LocalStorage */
  function initStations(): void {
    visitedIds.value = getStoredVisited()
  }

  function isVisited(stationId: string): boolean {
    return visitedIds.value.includes(stationId)
  }

  /** บันทึกว่าเข้าฐานนี้แล้ว (เผื่ออนาคตผูกกับผลลัพธ์การ Scan QR ที่ฐานจริง) */
  function markVisited(stationId: string): void {
    if (isVisited(stationId)) return
    const next = [...visitedIds.value, stationId]
    visitedIds.value = next
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }

  return {
    stations: STATIONS,
    totalStations,
    visitedIds: readonly(visitedIds),
    visitedCount,
    isComplete,
    initStations,
    isVisited,
    markVisited,
  }
}
