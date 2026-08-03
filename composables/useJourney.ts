/**
 * composables/useJourney.ts
 * ---------------------------------------------------------------------------
 * State/Logic ของระบบ "Journey" บนหน้า Map — Mockup ล้วน ๆ
 *
 * - เก็บ "ลำดับ" การกดผ่านฐานไว้ใน reactive state (useState ของ Nuxt = อยู่ใน
 *   หน่วยความจำของ session เท่านั้น ไม่ใช่ LocalStorage, ไม่เขียนลง disk ใด ๆ)
 * - ไม่เชื่อม API / Google Sheet / ฐานข้อมูลใด ๆ ทั้งสิ้น
 * - แยกออกมาเป็น composable ต่างหากตั้งใจให้เป็น "จุดเดียว" ที่จะสลับจาก
 *   MOCK_STATIONS + useState ไปเป็นข้อมูลจริง (เช่น ผูกกับ Station จริง หรือ
 *   ผลการ Scan QR จริงในอนาคต) โดยที่ MapCanvas.vue / StationMarker.vue /
 *   pages/map.vue ไม่ต้องแก้ไขเลย เพราะรับ-ส่งกันผ่าน props/emit ปกติ
 */

export interface JourneyStation {
  id: string
  name: string
  /** ตำแหน่ง Mockup บนแผนที่ (หน่วย % ของ viewBox 0-100) */
  x: number
  y: number
}

/** ข้อมูลฐาน Mockup (ในอนาคตค่อยสลับมาดึงจากแหล่งข้อมูลจริงตรงนี้จุดเดียว) */
const MOCK_STATIONS: JourneyStation[] = [
  { id: 'a', name: 'ฐาน A', x: 20, y: 24 },
  { id: 'b', name: 'ฐาน B', x: 76, y: 18 },
  { id: 'c', name: 'ฐาน C', x: 24, y: 78 },
  { id: 'd', name: 'ฐาน D', x: 80, y: 74 },
]

export function useJourney() {
  // ลำดับ id ของฐานตามลำดับที่ผู้ใช้กด เช่น กด C -> A -> D ได้ ['c', 'a', 'd']
  // ใช้ useState (reactive state ของ Nuxt, in-memory) เพื่อให้ทุก component ที่
  // เรียก useJourney() ในหน้าเดียวกันเห็นค่าเดียวกัน โดยไม่ persist ที่ไหนเลย
  const journey = useState<string[]>('journey-order', () => [])

  const stations = MOCK_STATIONS
  const totalStations = stations.length

  const visitedCount = computed(() => journey.value.length)
  /** Point = จำนวนฐานที่ผ่านแล้ว x 100 */
  const totalPoint = computed(() => visitedCount.value * 100)

  function isVisited(id: string): boolean {
    return journey.value.includes(id)
  }

  /**
   * กดฐาน -> Toggle
   * - ยังไม่อยู่ใน Journey: เพิ่มต่อท้าย (บันทึกลำดับการเข้าฐาน)
   * - อยู่ใน Journey แล้ว (ยกเลิกฐานนั้น): ลบออกจาก Journey ทันที
   */
  function toggleStation(id: string): void {
    const exists = journey.value.includes(id)
    journey.value = exists
      ? journey.value.filter((stationId) => stationId !== id)
      : [...journey.value, id]
  }

  /** Reset Journey: ล้างลำดับฐานทั้งหมด -> Point และจำนวนฐานกลับเป็น 0 ไปโดยอัตโนมัติ (เป็น computed) */
  function resetJourney(): void {
    journey.value = []
  }

  return {
    stations,
    totalStations,
    journey: readonly(journey),
    isVisited,
    visitedCount,
    totalPoint,
    toggleStation,
    resetJourney,
  }
}
