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
 * รายชื่อ/ตำแหน่ง/ลำดับฐาน (MOCK_ADVENTURE_STATIONS) — พิกัด lat/lng + ประเภทฐาน
 * (ไอคอน/สี) ยัง hardcode ไว้ฝั่ง frontend เหมือนเดิม (ชีต "Stations" ฝั่ง Admin
 * ยังไม่มีคอลัมน์พวกนี้ให้ใช้แทน) แต่ name/points/active/description/imageUrl
 * ดึงจากชีต "Stations" จริงแล้ว ผ่าน useMemberApi().listStations() — จับคู่กับ
 * ฐาน mock ด้วยลำดับ (Order ฝั่ง Admin เทียบ index ใน MOCK_ADVENTURE_STATIONS)
 * ดู refreshStationsFromBackend() ด้านล่าง ส่วนสถานะ "ผ่านฐานแล้วหรือยัง" +
 * "คะแนนสะสม" ผูกกับ Google Sheet จริงแล้วเช่นกัน ผ่าน server-gas (ดู
 * CheckinService.gs / JourneyService.gs / ScoreService.gs / StationsService.gs)
 * เรียกผ่าน useMemberApi().getJourney() / getScore() / listStations():
 *
 * - initAdventure(userId?) โหลด LocalStorage ก่อนเสมอ (Offline First ให้เปิดแอป
 *   ได้ทันทีแม้ไม่มีเน็ต) แล้วถ้ามี userId (memberId) + มีเน็ต จะดึงประวัติ
 *   ฐานที่ผ่านจริง (getJourney) และคะแนนสะสมที่ยืนยันแล้ว (getScore) จาก
 *   Google Sheet มา "merge" ทับ LocalStorage อีกที (backend ชนะเสมอถ้าดึงสำเร็จ
 *   ยกเว้นฐานที่เพิ่งสแกนในเครื่องแต่ยังไม่ทัน Sync ขึ้น Sheet — ฐานพวกนี้ยังคง
 *   ต้องติดสถานะ "ผ่านแล้ว" อยู่ ไม่ถูกเขี่ยทิ้งแม้ backend จะยังไม่มีก็ตาม)
 * - totalPoint ใช้คะแนนจริงจากชีต Score (TotalPoint) เป็นหลักถ้าดึงมาได้สำเร็จ
 *   ดึงไม่ได้ (ออฟไลน์/ยังไม่เคย sync เลย) -> fallback กลับไปคำนวณเองจาก
 *   จำนวนฐานที่ผ่าน × POINTS_PER_STATION เหมือนเดิม
 * - toggleStation()/queueCheckin() (เรียกจาก pages/scan.vue) ยังคงบันทึก
 *   LocalStorage ก่อนเสมอเหมือนเดิม (Offline First) แล้วค่อย Sync ขึ้น Sheet
 *   ทีหลังผ่าน useOfflineSync.ts — composable นี้แค่เป็นฝ่าย "อ่าน" ข้อมูลที่
 *   ยืนยันแล้วกลับมาแสดงผลเท่านั้น
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
  /** พิกัดภูมิศาสตร์จริงของฐาน ใช้วาง Marker บน Leaflet/OpenStreetMap — ยัง
   * hardcode ไว้ฝั่ง frontend เหมือนเดิม (ชีต "Stations" ฝั่ง Admin ยังไม่มี
   * คอลัมน์ lat/lng ให้ดึงมาแทนที่) */
  lat: number
  lng: number
  /** ฐานสุดท้ายของเส้นทาง (ใช้เน้น UI พิเศษ เช่น ป้าย "เข้าเส้นชัย") */
  isFinal?: boolean
  /** คะแนนที่ได้รับเมื่อผ่านฐานนี้ — ดึงจากชีต "Stations" (Admin) ถ้ามี ไม่มี ->
   * fallback เป็น POINTS_PER_STATION (ค่าคงที่เดิม) */
  points?: number
  /** ฐาน active:false (ปิดใช้งานจากหน้า Admin) จะไม่แสดงในรายการฐานที่เล่นได้เลย */
  active?: boolean
  description?: string
  imageUrl?: string
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
  // คะแนนสะสมจริงจากชีต "Score" (Google Sheet) — null = ยังไม่เคยดึงสำเร็จ
  // (ออฟไลน์ หรือยังไม่เคย sync ฐานไหนขึ้น Sheet เลย) ให้ fallback ไปคำนวณเอง
  const backendTotalPoint = useState<number | null>('adventure-backend-total-point', () => null)
  const isSyncingFromBackend = useState<boolean>('adventure-syncing-from-backend', () => false)

  // รายชื่อฐาน — เริ่มต้นด้วยค่า mock/hardcode (พิกัด+ไอคอนคงที่) แล้วให้
  // refreshStationsFromBackend() มา "แปะทับ" เฉพาะ name/points/active/
  // description/imageUrl จากชีต "Stations" (Admin) ทีหลัง จับคู่กันด้วยลำดับ
  // (Order ฝั่ง Admin เทียบกับลำดับใน MOCK_ADVENTURE_STATIONS index ต่อ index)
  // เพราะชีต Stations ยังไม่มีคอลัมน์ lat/lng/ประเภทฐานให้ใช้แทนของ mock ได้เลย
  const stationsState = useState<AdventureStation[]>('adventure-stations', () =>
    MOCK_ADVENTURE_STATIONS.map((s) => ({ ...s, points: POINTS_PER_STATION, active: true })),
  )
  const stationsInitialized = useState<boolean>('adventure-stations-initialized', () => false)

  // เฉพาะฐานที่ active (ไม่ถูกปิดจากหน้า Admin) เท่านั้นที่นับ/แสดงผลจริง
  const stations = computed(() => stationsState.value.filter((s) => s.active !== false))
  const totalStations = computed(() => stations.value.length)

  const visitedCount = computed(() => visitedIds.value.length)
  const totalPoint = computed(() => {
    if (backendTotalPoint.value !== null) return backendTotalPoint.value
    // Fallback (ออฟไลน์/ยังไม่เคย sync เลย): รวมคะแนนต่อฐานจริงของแต่ละฐานที่ผ่านแล้ว
    return visitedIds.value.reduce((sum, id) => {
      const station = stationsState.value.find((s) => s.id === id)
      return sum + (station?.points ?? POINTS_PER_STATION)
    }, 0)
  })
  const isComplete = computed(() => visitedCount.value >= totalStations.value)

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

  /**
   * เรียกตอน mounted ของหน้า Home/Map/Scan เพื่อโหลดค่าล่าสุด
   * 1) โหลดจาก LocalStorage ก่อนเสมอ (Offline First — ใช้งานได้ทันทีแม้ไม่มีเน็ต
   *    ครั้งแรกที่ไม่เคยมีข้อมูลเลยในเครื่อง ใช้ DEFAULT_VISITED เป็น Demo state)
   * 2) ถ้ามี userId (memberId ที่ Login แล้ว) และมีเน็ต -> ดึงประวัติฐานที่ผ่านจริง
   *    (getJourney) + คะแนนสะสมที่ยืนยันแล้ว (getScore) จาก Google Sheet มา merge
   *    ทับ (backend ชนะ ยกเว้นฐานที่เพิ่งสแกนในเครื่องแต่ยังไม่ทัน sync ขึ้น Sheet
   *    ซึ่งยังต้องคงสถานะ "ผ่านแล้ว" ไว้ ไม่ถูกเขี่ยทิ้ง)
   * ดึงจาก backend ไม่สำเร็จ (ออฟไลน์/API ล่ม) -> เงียบไว้ ใช้ค่า LocalStorage
   * ต่อไปได้เลย ไม่กระทบการใช้งานหน้าปัจจุบัน (เหมือน pattern เดียวกับ
   * useRequireProfile.ts)
   */
  async function initAdventure(userId?: string): Promise<void> {
    if (initialized.value) return
    const stored = getStoredVisited()
    visitedIds.value = stored ?? DEFAULT_VISITED
    initialized.value = true

    await Promise.all([refreshFromBackend(userId), refreshStationsFromBackend()])
  }

  /**
   * ดึงรายชื่อฐานจากชีต "Stations" (จัดการผ่านหน้า Admin) มาแปะทับเฉพาะ
   * name/points/active/description/imageUrl ของฐาน mock 4 อันเดิม — เพราะยังไม่มี
   * lat/lng/ประเภทฐานฝั่ง Admin ให้ใช้แทน จึงต้อง "จับคู่" กับ MOCK_ADVENTURE_STATIONS
   * ทีละฐาน โดยจับคู่แบบ 2 รอบเพื่อไม่ให้ผิดฐานง่าย ๆ ถ้า Admin สร้าง/ลบ/สลับ
   * ลำดับฐานไม่ตรงกับ mock เป๊ะ:
   *   รอบ 1) จับคู่ด้วย "ชื่อฐานตรงกันเป๊ะ" ก่อนเสมอ (ตัดช่องว่างหัว-ท้าย) — แม่นยำสุด
   *          ถ้า Admin ตั้งชื่อฐานตรงกับ mock อยู่แล้ว (เช่น "ฐานข้าวโพด")
   *   รอบ 2) ฐาน mock ที่ยังไม่เจอชื่อตรงกัน -> fallback ไปจับคู่ด้วยลำดับ (เรียง
   *          Order น้อย -> มาก) กับฐาน Admin ที่ "เหลือ" (ยังไม่ถูกจับคู่ไปในรอบ 1)
   *          เหมือนพฤติกรรมเดิม แต่กันไม่ให้ฐาน Admin ตัวเดียวถูกจับคู่ซ้ำ 2 ฐาน mock
   * ฐานที่ Admin ปิดไว้ (active:false) จะไม่ถูกนับ/แสดงในหน้าเกมเลย (ดู `stations`
   * computed ด้านบนที่กรอง active ออก) ดึงไม่สำเร็จ (ออฟไลน์/API ล่ม) -> เงียบไว้
   * ใช้ค่า mock/ค่าล่าสุดที่มีอยู่ต่อไป ไม่กระทบการใช้งานหน้าปัจจุบัน
   */
  async function refreshStationsFromBackend(): Promise<void> {
    if (stationsInitialized.value) return
    if (!import.meta.client) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return

    try {
      const { listStations } = useMemberApi()
      const res = await listStations()
      if (!res.success || !res.stations || res.stations.length === 0) return

      const sorted = [...res.stations].sort((a, b) => a.order - b.order)

      // รอบ 1: จับคู่ด้วยชื่อฐานตรงกันเป๊ะ
      const byName = new Map(sorted.map((s) => [s.name.trim(), s]))
      const usedAdminIds = new Set<string>()
      const matchedByName = MOCK_ADVENTURE_STATIONS.map((mock) => {
        const admin = byName.get(mock.name.trim())
        if (admin) usedAdminIds.add(admin.id)
        return admin ?? null
      })

      // รอบ 2: ฐาน mock ที่ชื่อไม่ตรง -> fallback จับคู่ด้วยลำดับกับฐาน Admin ที่เหลือ
      const remainingAdmin = sorted.filter((s) => !usedAdminIds.has(s.id))
      let remainingIndex = 0

      stationsState.value = MOCK_ADVENTURE_STATIONS.map((mock, index) => {
        const admin = matchedByName[index] ?? remainingAdmin[remainingIndex++]
        if (!admin) return { ...mock, points: POINTS_PER_STATION, active: true }
        return {
          ...mock,
          name: admin.name || mock.name,
          points: admin.points || POINTS_PER_STATION,
          active: admin.active,
          description: admin.description || undefined,
          imageUrl: admin.imageUrl || undefined,
        }
      })
      stationsInitialized.value = true
    } catch {
      // เงียบไว้ — ใช้ค่า mock/ค่าล่าสุดที่มีอยู่ต่อไป
    }
  }

  /**
   * ดึงฐานที่ผ่านจริง (getJourney) + คะแนนสะสมจริง (getScore) จาก Google Sheet
   * มา merge ทับ state ปัจจุบัน — แยกออกมาจาก initAdventure() เพื่อให้เรียกซ้ำ
   * ได้อีกครั้งหลัง Sync สำเร็จ (ดู useOfflineSync.ts -> syncNow()) โดยไม่ติด
   * เงื่อนไข "initialized ครั้งเดียว" ของ initAdventure()
   */
  async function refreshFromBackend(userId?: string): Promise<void> {
    if (!import.meta.client || !userId) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return

    isSyncingFromBackend.value = true
    try {
      const { getJourney, getScore } = useMemberApi()

      const [journeyRes, scoreRes] = await Promise.all([
        getJourney(userId).catch(() => null),
        getScore(userId).catch(() => null),
      ])

      if (journeyRes?.success && journeyRes.journey) {
        const backendVisited = journeyRes.journey.map((entry) => entry.stationId)
        // merge กับของเดิมในเครื่อง กันเคส "เพิ่งสแกนฐานใหม่แต่ queue ยังไม่ทัน sync"
        const merged = Array.from(new Set([...visitedIds.value, ...backendVisited]))
        visitedIds.value = merged
        persist(merged)
      }

      if (scoreRes?.success && scoreRes.score) {
        backendTotalPoint.value = scoreRes.score.totalPoint
      }
    } finally {
      isSyncingFromBackend.value = false
    }
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
    isSyncingFromBackend: readonly(isSyncingFromBackend),
    isVisited,
    initAdventure,
    refreshFromBackend,
    refreshStationsFromBackend,
    toggleStation,
    resetJourney,
  }
}
