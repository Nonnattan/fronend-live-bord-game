/**
 * composables/useAdventure.ts
 * ---------------------------------------------------------------------------
 * แหล่งข้อมูลกลาง ("single source of truth") ของระบบ Adventure Game Map —
 * ใช้ร่วมกันทั้งหน้า Home (MiniMap) และหน้า Map (AdventureMap เต็มจอ) ผ่าน
 * useState() ของ Nuxt เพื่อให้ทั้งสองหน้าเห็น state เดียวกันแบบ reactive
 *
 * แผนที่จริงวาดด้วย Leaflet + OpenStreetMap (ดู components/map/LeafletMap.vue)
 * ตำแหน่งฐานจึงเป็นพิกัดภูมิศาสตร์จริง (lat/lng) แทนเปอร์เซ็นต์บน viewBox เดิม
 *
 * ตอนนี้ยังเป็น Mockup ล้วน ๆ:
 * - รายชื่อ/ตำแหน่ง/ลำดับฐาน เป็นข้อมูลตั้งต้นคงที่ (MOCK_ADVENTURE_STATIONS)
 * - สถานะ "ผ่านฐานแล้วหรือยัง" เก็บไว้ที่ LocalStorage ของเครื่องผู้ใช้ก่อน
 *
 * ออกแบบให้สลับไปใช้ข้อมูลจริงในอนาคตได้ง่าย โดยไม่ต้องแก้ Component ใด ๆ เลย:
 * - เปลี่ยนแค่ STATIONS ให้ดึงจาก API/Google Sheet แทน MOCK_ADVENTURE_STATIONS
 * - เปลี่ยนแค่ toggleStation()/initAdventure() ให้ยิง API แทน localStorage
 * ทุก Component (AdventureMap, MiniMap, LeafletMap) รับ-ส่งข้อมูลผ่าน
 * props/emit เท่านั้น ไม่ผูกกับ composable นี้ตรง ๆ
 */

const STORAGE_KEY = 'adventureVisitedStations'

/** ประเภทฐานทั้ง 4 แบบตามสเปก — แต่ละแบบมี icon/สีของตัวเองสำหรับ Marker */
export type StationType = 'corn' | 'cow' | 'soil' | 'milk'

export interface StationTypeMeta {
  icon: string
  label: string
  /** สีหลักของ Marker (วงกลมพื้นหลัง) ตอนยังไม่ผ่านฐาน */
  color: string
  colorDark: string
}

export const STATION_TYPE_META: Record<StationType, StationTypeMeta> = {
  corn: { icon: '🌽', label: 'ฐานข้าวโพด', color: '#f2b134', colorDark: '#c98a12' },
  cow: { icon: '🐄', label: 'ฐานวัว', color: '#f6f1e7', colorDark: '#4a2f18' },
  soil: { icon: '🌱', label: 'ฐานดิน', color: '#8fc74e', colorDark: '#5a9e33' },
  milk: { icon: '🥛', label: 'ฐานนม', color: '#eaf6ff', colorDark: '#5cb8e0' },
}

export interface AdventureStation {
  id: string
  name: string
  type: StationType
  /** พิกัดภูมิศาสตร์จริงของฐาน ใช้วาง Marker บน Leaflet/OpenStreetMap */
  lat: number
  lng: number
  /** ฐานสุดท้ายของเส้นทาง (ใช้เน้น UI พิเศษ เช่น ป้าย "เข้าเส้นชัย") */
  isFinal?: boolean
}

/** คะแนนต่อ 1 ฐานที่ผ่าน (Mockup) */
export const POINTS_PER_STATION = 250

/**
 * ฐานทั้ง 4 วางเป็นรูปสี่เหลี่ยม (Board Game Layout) ไม่ใช่เส้นตรง:
 *
 *   🌽 ข้าวโพด ──────── 🐄 วัว
 *      │                    │
 *      │                    │
 *   🌱 ดิน   ──────── 🥛 นม (ฐานสุดท้าย)
 *
 * เรียงลำดับใน array ตามเข็มนาฬิกา (ข้าวโพด -> วัว -> นม -> ดิน) เพื่อให้
 * LeafletMap.vue วาด Polyline วนรอบครบ 4 ด้านของสี่เหลี่ยมได้เลยแค่เชื่อม
 * ฐาน i กับฐาน i+1 แล้ววนกลับฐานแรก (ดู drawPolylines() ใน LeafletMap.vue)
 * ผู้เล่นกดฐานไหนก่อนก็ได้ ไม่บังคับลำดับ — สีเขียวจะขึ้นเฉพาะ "ด้าน" ของ
 * สี่เหลี่ยมที่ทั้งสองฐานปลายทางผ่านแล้วเท่านั้น
 *
 * พิกัดอยู่ในย่านฟาร์มโคนม อ.มวกเหล็ก จ.สระบุรี ให้สมจริงกับธีม Farm Adventure
 */
export const MOCK_ADVENTURE_STATIONS: AdventureStation[] = [
  { id: 'corn', name: 'ฐานข้าวโพด', type: 'corn', lat: 14.647, lng: 101.121 },
  { id: 'cow', name: 'ฐานวัว', type: 'cow', lat: 14.647, lng: 101.126 },
  { id: 'milk', name: 'ฐานนม', type: 'milk', lat: 14.643, lng: 101.126, isFinal: true },
  { id: 'soil', name: 'ฐานดิน', type: 'soil', lat: 14.643, lng: 101.121 },
]

/** ค่าตั้งต้นสำหรับ Demo Mockup: ผ่านฐานแรก (ข้าวโพด) แล้ว 1 ฐาน */
const DEFAULT_VISITED: string[] = ['corn']

export function useAdventure() {
  // Global reactive state (SSR-safe) — sync จาก LocalStorage ใน initAdventure()
  const visitedIds = useState<string[]>('adventure-visited-stations', () => [])
  const initialized = useState<boolean>('adventure-initialized', () => false)

  const stations = MOCK_ADVENTURE_STATIONS
  const totalStations = stations.length

  const visitedCount = computed(() => visitedIds.value.length)
  const totalPoint = computed(() => visitedCount.value * POINTS_PER_STATION)
  const isComplete = computed(() => visitedCount.value >= totalStations)

  function isVisited(stationId: string): boolean {
    return visitedIds.value.includes(stationId)
  }

  function getStoredVisited(): string[] | null {
    if (!import.meta.client) return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : null
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  }

  function persist(next: string[]): void {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }

  /** เรียกตอน mounted ของหน้า Home/Map เพื่อโหลดค่าล่าสุดจาก LocalStorage (ครั้งแรกใช้ Demo state) */
  function initAdventure(): void {
    if (initialized.value) return
    const stored = getStoredVisited()
    visitedIds.value = stored ?? DEFAULT_VISITED
    initialized.value = true
  }

  /** แตะ Marker -> Toggle ผ่านฐาน/ยกเลิก พร้อมอัปเดต Point และ Polyline (ผ่าน computed) */
  function toggleStation(stationId: string): void {
    const exists = visitedIds.value.includes(stationId)
    const next = exists
      ? visitedIds.value.filter((id) => id !== stationId)
      : [...visitedIds.value, stationId]
    visitedIds.value = next
    persist(next)
  }

  function resetJourney(): void {
    visitedIds.value = []
    persist([])
  }

  return {
    stations,
    totalStations,
    visitedIds: readonly(visitedIds),
    visitedCount,
    totalPoint,
    isComplete,
    isVisited,
    initAdventure,
    toggleStation,
    resetJourney,
  }
}
