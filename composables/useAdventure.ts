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
 * ฐาน mock ด้วย "ลำดับ (order)" เท่านั้น (เรียง order น้อย -> มาก แล้ว zip เข้ากับ
 * BOARD_POSITION_ORDER ทีละตำแหน่งตามผังกระดานที่กำหนดตายตัว — ห้ามใช้ Type/ชื่อ
 * ฐานมาช่วยจัดลำดับเด็ดขาด) ดู BOARD_POSITION_ORDER + refreshStationsFromBackend()
 * ด้านล่าง ส่วนสถานะ "ผ่านฐานแล้วหรือยัง" +
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
 * - [Fix] totalPoint คำนวณจาก "ฐานที่ผ่านแล้วในรอบปัจจุบัน" (visitedIds ในเครื่อง)
 *   เพียงอย่างเดียวเสมอ (จำนวนฐานที่ผ่าน × คะแนนต่อฐานจริงของแต่ละฐาน) — ไม่ใช้
 *   คะแนนสะสมข้ามรอบจากชีต Score (TotalPoint) มาคำนวณอีกต่อไป เพราะเป็นคนละ
 *   ความหมายกัน (คะแนนสะสม ≠ คะแนนของรอบปัจจุบัน) ดู backendTotalPoint/totalPoint
 *   ด้านล่างสำหรับรายละเอียดเต็ม ๆ ของบั๊กเดิมและเหตุผลที่แก้แบบนี้
 * - toggleStation()/queueCheckin() (เรียกจาก pages/scan.vue) ยังคงบันทึก
 *   LocalStorage ก่อนเสมอเหมือนเดิม (Offline First) แล้วค่อย Sync ขึ้น Sheet
 *   ทีหลังผ่าน useOfflineSync.ts — composable นี้แค่เป็นฝ่าย "อ่าน" ข้อมูลที่
 *   ยืนยันแล้วกลับมาแสดงผลเท่านั้น
 */

const STORAGE_KEY = 'adventureVisitedStations'
/** [Fix] เก็บ roundId ที่ visitedIds ในเครื่องนี้ "เป็นของ" ไว้คู่กัน (ดูเหตุผลเต็ม ๆ
 * ที่ initAdventure()/refreshFromBackend() ด้านล่าง) — แก้บั๊ก "มือถือค้าง 1/4 แต่
 * คอมเป็น 0/4": คนละเครื่องมี LocalStorage แยกกัน ถ้าจบ Round ที่เครื่อง A (คอม)
 * เครื่อง B (มือถือ) จะไม่มีทางรู้เรื่องนี้เลยจนกว่าจะเช็คกับ backend เอง — ปัญหาเดิม
 * คือ refreshFromBackend() เช็ค backend ถูกต้องอยู่แล้วว่า Round ปัจจุบันคือ Round
 * ไหน แต่ตอน merge กลับ "รวม" (union) วิธีเก่าเข้ากับของที่ค้างในเครื่อง (เผื่อกรณี
 * เพิ่งสแกนแต่ยังไม่ทัน sync) โดยไม่เคย "ทิ้ง" ของเก่าที่ไม่ใช่ Round ปัจจุบันเลยแม้แต่
 * ครั้งเดียว ทำให้ฐานจาก Round ที่จบไปแล้วค้างอยู่ในเครื่องนั้นตลอดไป — คู่กับ Key นี้
 * ทำให้รู้ได้ว่า visitedIds ที่ค้างในเครื่องเป็นของ Round ไหน เทียบกับ Round Active
 * จริงจาก backend ได้ ถ้าไม่ตรงกัน (คนละ Round/ไม่มี Round Active เลย) ต้องล้างทิ้ง
 * ก่อนเสมอ ไม่ merge ของเก่าเข้ามาอีก */
const STORAGE_ROUND_KEY = 'adventureVisitedStations:roundId'

/** [แก้ไข — adventureInitialScore ไม่ใช่คะแนนสะสมจากหลังบ้านอีกต่อไป] เดิมเคย
 * ดึง getScore() (คะแนนสะสม "ข้ามทุกรอบ") มาใช้เป็นจุดเริ่มต้นของทุกรอบใหม่ —
 * ผิดตามสเปกจริง เพราะทำให้คะแนนรอบใหม่ไม่เริ่มจาก 0 (บวกคะแนนสะสมเก่าทับเข้าไป
 * ด้วย) และกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก" (resetJourney()) ก็ไม่
 * เคยล้างค่านี้เลย ทำให้ค้างข้ามรอบตลอดไป
 *
 * ตอนนี้ key เดิม (adventureInitialScore) เก็บแค่ "คะแนนของรอบปัจจุบันที่กำลัง
 * เล่นอยู่" เท่านั้น (คำนวณจากฐานที่สแกนผ่านแล้วในรอบนี้ — totalPoint computed
 * ด้านล่าง) sync ลง LocalStorage ทุกครั้งที่คะแนนเปลี่ยน (ดู watch(totalPoint, ...)
 * ด้านล่าง) เพื่อให้ refresh หน้ากลางรอบแล้วคะแนนไม่หาย และ "ถูกล้างทิ้งทันที"
 * ตอนกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก" (resetJourney() ด้านล่าง)
 * เหมือนกับ visitedIds ทุกประการ — ไม่มีการดึงคะแนนสะสมจาก Google Sheet มาบวกอีก
 * ต่อไป (ScoreService.gs/getScore ยังทำงานปกติ แค่ไม่ถูกใช้คำนวณค่านี้แล้ว) */
const INITIAL_SCORE_KEY = 'adventureInitialScore'
const INITIAL_SCORE_OWNER_KEY = 'adventureInitialScore:userId'

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
  /** ไฟล์ใหม่ (แก้บั๊ก QR Scan หา Station ไม่เจอ): id ของฐานจริงฝั่ง Backend (ชีต
   * "Stations") ที่ถูกจับคู่มาลงฐานกระดานเกมช่องนี้ตอน refreshStationsFromBackend()
   * — ไม่ว่าจะจับคู่ได้ด้วย Type/ชื่อ/หรือ fallback ตามลำดับก็ตาม (ดู 3 รอบการจับคู่
   * ด้านล่าง) ค่านี้ "การันตี" ว่าตรงกับแถวเดียวกันในชีต Stations เป๊ะ ๆ เสมอ ต่างจาก
   * การเทียบ Type/ชื่อตรง ๆ ที่ต้อง Admin ตั้งค่าให้ตรงกับกระดานก่อนถึงจะแม่นยำ
   * ใช้จับคู่ตอนสแกน QR (pages/scan.vue -> processScannedStationQr()) เพื่อรู้ว่า
   * Station ที่ backend ยืนยันมาจาก verifyStationQr คือฐานไหนบนกระดาน โดยไม่ต้อง
   * พึ่งพา Type ที่ Admin อาจยังไม่ได้ตั้งค่าเลย undefined = ยังไม่เคย sync สำเร็จ
   * (ออฟไลน์/ยังไม่มีฐานใน Backend ตรงกับช่องนี้) */
  backendId?: string
}

/** คะแนนต่อ 1 ฐานที่ผ่าน (Mockup) */
export const POINTS_PER_STATION = 250

/**
 * ฐานทั้ง 4 วางเป็นรูปสี่เหลี่ยม (Board Game Layout) ไม่ใช่เส้นตรง:
 *
 *   🌱 ดิน   ──────── 🐄 วัว
 *      │                    │
 *      │                    │
 *   🌽 ข้าวโพด ──────── 🥛 นม (ฐานสุดท้าย)
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

/**
 * ลำดับฐานบนกระดาน (ตำแหน่ง 1-4) เทียบกับ `order` จากฝั่ง Backend (ชีต
 * "Stations") ตามผังที่กำหนดตายตัว — index 0 ของ array นี้ = ฐาน backend ที่
 * order น้อยที่สุด (order = 1), index 1 = order 2, ฯลฯ:
 *
 *   2 (ซ้ายบน)  -------- 3 (ขวาบน)
 *   |                          |
 *   |                          |
 *   1 (ซ้ายล่าง) -------- 4 (ขวาล่าง)
 *
 * [แก้ไข] เดิมคอมเมนต์นี้อ้างอิงค่า x/y ตรง ๆ (ตอนวางเป็นรูปสี่เหลี่ยม 4 มุม) —
 * ตัดออกเพราะพื้นหลังเปลี่ยนเป็นภาพเกาะลอยแล้ว ตำแหน่งจริงไม่ใช่สี่เหลี่ยมอีก
 * ต่อไป (ดู ADVENTURE_STATION_POSITIONS ด้านล่าง) แต่ Array นี้ (BOARD_POSITION_ORDER)
 * ยังทำงานเหมือนเดิมทุกประการ เพราะจับคู่ด้วย "ลำดับ index ใน array" ล้วน ๆ
 * ไม่เคยอ้างอิงค่า x/y เลยสักบรรทัด — เปลี่ยนตำแหน่งแสดงผลได้อิสระโดยไม่กระทบ
 * Logic จับคู่ฐาน backend ตรงนี้เลย
 *
 * ใช้ "ลำดับ (order) เท่านั้น" ในการจับคู่ฐาน backend เข้ากับช่องบนกระดาน —
 * ห้ามใช้ type/name ของฝั่ง Backend มาช่วยจัดลำดับเด็ดขาด (ดู
 * refreshStationsFromBackend() ด้านล่าง) เพื่อไม่ให้ผลลัพธ์เปลี่ยนไปตามค่าที่
 * Admin อาจตั้ง Type/ชื่อไม่ตรงกับผังจริง
 */
const BOARD_POSITION_ORDER: string[] = ['corn', 'soil', 'cow', 'milk']

/**
 * ตำแหน่ง % (X-Y) ของฐานทั้ง 4 บนภาพพื้นหลังใหม่ (เกาะลอยฟาร์ม แบบมีตึก/หมุด/
 * ป้ายชื่อวาดอยู่ในภาพเลย — public/images/adventure-map-bg.jpg) — ใช้ร่วมกัน
 * ทั้งหน้า Map เต็มจอ (components/map/AdventureMap.vue) และ Mini Map บนหน้า
 * Home (components/map/MiniMap.vue) เพื่อไม่ต้อง hardcode พิกัดซ้ำ 2 ที่ เป็นแค่
 * Layout ของ UI ล้วน ๆ (ไม่ใช่ข้อมูลจาก Google Sheet/Admin จึงไม่ผิดกติกา
 * "ห้าม hardcode ข้อมูลใหม่")
 *
 * [แก้ไข — เปลี่ยนพื้นหลังเป็นภาพที่มีหมุด/ป้ายชื่ออยู่ในภาพเลย] เดิมพื้นหลัง
 * เป็นภาพเกาะลอยเปล่า ๆ แล้ววาดหมุด+ป้ายชื่อทับด้วย CSS/รูปแยก (บับเบิลกรอบแดง
 * เด้งได้) — ผู้ใช้ต้องการภาพที่มีหมุด/ตึก/ป้ายชื่อวาดอยู่ในพื้นหลังเลยแทน
 * (ยอมรับแล้วว่าหมุดจะเด้งไม่ได้ เพราะติดอยู่ในภาพนิ่งภาพเดียว) ค่าพิกัดนี้จึง
 * เหลือไว้ใช้แค่วางตำแหน่ง "ติ๊กถูกสีเขียว" ทับเมื่อผ่านฐานแล้วเท่านั้น (ดู
 * components/map/AdventureMap.vue, MiniMap.vue) ไม่ได้ใช้วาดหมุดเองอีกต่อไป —
 * ไม่กระทบ BOARD_POSITION_ORDER ด้านบนเลย (การจับคู่ฐาน backend ใช้ "ลำดับใน
 * array" ของ BOARD_POSITION_ORDER ล้วน ๆ ไม่ได้อ้างอิงค่า x/y ตรงนี้แต่อย่างใด)
 * ตัวเลขคำนวณจากตำแหน่งจริงที่ตัดรูปหมุดออกมา (พิกเซล -> % ของภาพ 1139x1437)
 */
export const ADVENTURE_STATION_POSITIONS: Record<string, { x: number; y: number }> = {
  corn: { x: 73, y: 33 },
  cow: { x: 29, y: 56 },
  soil: { x: 47, y: 67 },
  milk: { x: 47, y: 80 },
}

/**
 * [ใหม่] ตำแหน่ง % (X-Y) ของ "จุดเริ่มต้น" — จุดคงที่จุดเดียวบนภาพพื้นหลัง
 * เดียวกับ ADVENTURE_STATION_POSITIONS ด้านบน แสดงตลอดเวลาไม่ว่าจะผ่านฐานไหน
 * มาแล้วหรือยัง (ไม่ใช่ ✓ ที่โผล่ตามสถานะเหมือนฐาน) ใช้บอกผู้เล่นว่าเดินเริ่ม
 * จากจุดไหนของเกาะ — วางไว้บริเวณโซนคอกสัตว์/ทางเข้าด้านล่างซ้ายของภาพ ปรับ
 * พิกัดตรงนี้จุดเดียวได้เลยถ้าตำแหน่งจริงไม่ตรงกับจุดเริ่มบนพื้นที่จริง (ดู
 * components/map/AdventureMap.vue สำหรับส่วนที่ render จุดนี้)
 */
export const ADVENTURE_START_POINT: { x: number; y: number } = { x: 12, y: 90 }

/** ค่าตั้งต้นสำหรับ Demo Mockup: ผ่านฐานแรก (ข้าวโพด) แล้ว 1 ฐาน */
const DEFAULT_VISITED: string[] = []

export function useAdventure() {
  // Global reactive state (SSR-safe) — sync จาก LocalStorage ใน initAdventure()
  const visitedIds = useState<string[]>('adventure-visited-stations', () => [])
  const initialized = useState<boolean>('adventure-initialized', () => false)
  // [Fix] roundId ที่ visitedIds ปัจจุบัน (ในหน่วยความจำ + LocalStorage เครื่องนี้)
  // เป็นของ — null = ยังไม่เคยรู้/ไม่มี Round Active ผูกอยู่เลย (ดู STORAGE_ROUND_KEY
  // ด้านบนสำหรับเหตุผลเต็ม ๆ)
  const visitedRoundId = useState<string | null>('adventure-visited-round-id', () => null)
  // คะแนนสะสมจริง "ข้ามทุกรอบ" จากชีต "Score" (Google Sheet) — null = ยังไม่เคยดึงสำเร็จ
  // [Fix] เก็บไว้เผื่ออนาคตอยากโชว์ "คะแนนสะสมทั้งชีวิต" ที่หน้าอื่น (เช่น history.vue)
  // แต่ "ห้ามใช้ตัวนี้คำนวณ totalPoint ของรอบปัจจุบันอีกต่อไป" (ดู totalPoint computed
  // ด้านล่าง) เพราะเป็นคะแนนสะสมข้ามรอบ ไม่ใช่คะแนนของรอบที่กำลังเล่นอยู่
  const backendTotalPoint = useState<number | null>('adventure-backend-total-point', () => null)
  const isSyncingFromBackend = useState<boolean>('adventure-syncing-from-backend', () => false)
  /** [แก้ไข] คะแนนของ "รอบปัจจุบัน" ที่ sync ไว้ใน LocalStorage (key: adventureInitialScore)
   * — ไม่ใช่คะแนนสะสมจาก Backend อีกต่อไป (ดูคำอธิบายเต็ม ๆ ที่ INITIAL_SCORE_KEY
   * ด้านบนของไฟล์) แค่เป็นสำเนาสำรองของ roundEarned (คำนวณจาก visitedIds) กันไว้
   * เผื่อ refresh หน้ากลางรอบก่อนที่ stationsState จะโหลดคะแนนต่อฐานจาก backend
   * เสร็จ (ตอนนั้น roundEarned อาจคำนวณคลาดเคลื่อนชั่วคราวถ้าใช้ POINTS_PER_STATION
   * fallback ผิดจากที่ Admin ตั้งจริง) — ถูกล้างเป็น 0 ทุกครั้งที่จบรอบ (resetJourney())
   * เหมือนกับ visitedIds ทุกประการ ไม่ค้างข้ามรอบอีกต่อไป */
  const initialScore = useState<number | null>('adventure-initial-score', () => null)
  const initialScoreInitialized = useState<boolean>('adventure-initial-score-initialized', () => false)
  /** [Fix — root cause ของ "adventureVisitedStations เป็น [\"milk\"] หลัง reset"]
   * ตัวนับรุ่น (epoch) — resetJourney() บวกเลขนี้ทุกครั้งที่ล้างรอบ ส่วน
   * refreshFromBackend() จะจำเลขนี้ไว้ตอนเริ่มทำงาน (startEpoch) แล้วเช็คซ้ำก่อน
   * เขียน visitedIds/persist() ทุกจุด — เหตุผล: refreshFromBackend() ถูกเรียกจาก
   * runSync() แบบ async ที่เริ่มทำงาน "ตอนสแกนผ่านฐานนม" (ก่อนกด "จบเกม") แต่กว่าจะ
   * ได้ผลตอบกลับจาก getRound()/getJourney() (เครือข่ายมือถือช้า) ผู้เล่นอาจกด
   * "จบเกม" เสร็จไปแล้ว (endCurrentRound() + resetJourney() ทำงานเร็วกว่าเพราะเป็น
   * request คนละตัว) — พอ response ของ refreshFromBackend() ที่ "ยิงไปก่อน reset"
   * แต่ "ตอบกลับมาหลัง reset" (stale response) มาถึง มันจะเห็น Round เดิมเป็น
   * 'Started' อยู่ (เพราะ getRound() ของมันเองอาจ race แซง roundEnd() ที่ยังไม่ทัน
   * commit) แล้ว merge ฐานที่เพิ่ง sync สำเร็จ (เช่น "นม") กลับเข้า visitedIds ทับ
   * ค่าที่เพิ่ง resetJourney() ล้างไปแล้ว — แก้โดยให้ response ที่ "เก่ากว่า reset
   * ล่าสุด" (epoch ไม่ตรงกับตอนเริ่ม) ถูกทิ้งไปเฉย ๆ ไม่เขียนทับ state ปัจจุบันอีก
   * ไม่กระทบ Google Sheet เลย เพราะ checkin() (ที่บันทึกคะแนนขึ้นชีตจริง) เสร็จไป
   * ก่อนหน้า refreshFromBackend() ในลำดับของ syncNow() อยู่แล้ว — แก้แค่ "การเขียน
   * กลับเข้า visitedIds/localStorage ฝั่งเครื่องนี้" ที่มาช้าเกินไปเท่านั้น */
  const resetEpoch = useState<number>('adventure-reset-epoch', () => 0)

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
  /**
   * [แก้ไข — adventureInitialScore ต้องเป็นคะแนน "ของรอบปัจจุบัน" เท่านั้น]
   * totalPoint คำนวณจาก "ฐานที่ผ่านแล้วในรอบปัจจุบัน" (visitedIds ในเครื่อง ซึ่ง
   * ถูก resetJourney() ล้างเป็น [] ทุกครั้งที่จบรอบ) เพียงอย่างเดียวเสมอ — ไม่บวก
   * คะแนนสะสมจาก Backend (getScore()/backendTotalPoint) เข้ามาอีกต่อไป เพราะเป็น
   * คนละความหมายกัน (คะแนนสะสมข้ามรอบ ≠ คะแนนของรอบที่กำลังเล่นอยู่)
   *
   * initialScore (localStorage key: adventureInitialScore) เป็นแค่ "สำเนาสำรอง"
   * ของค่านี้ sync ให้ตรงกันเสมอผ่าน watch ด้านล่าง (ไม่ได้ถูกบวกเข้ากับ roundEarned
   * ซ้ำ — กันปัญหา Double Count) มีไว้เผื่อ refresh หน้ากลางรอบก่อน stationsState
   * จะโหลดคะแนนต่อฐานจาก backend เสร็จ (ช่วง window สั้น ๆ ตอนเปิดแอปใหม่)
   */
  const totalPoint = computed(() => {
    return visitedIds.value.reduce((sum, id) => {
      const station = stationsState.value.find((s) => s.id === id)
      return sum + (station?.points ?? POINTS_PER_STATION)
    }, 0)
  })
  const isComplete = computed(() => visitedCount.value >= totalStations.value)

  function isVisited(stationId: string): boolean {
    return visitedIds.value.includes(stationId)
  }

  /** อ่านคะแนน "ของรอบปัจจุบัน" ที่เคย sync ไว้ล่าสุดของ userId นี้ (เผื่อ refresh
   * หน้ากลางรอบ) — คนละ userId (หรือไม่มีเลย) คืนค่า null เพื่อให้เริ่มจาก 0 ปกติ */
  function getStoredInitialScore(userId: string): number | null {
    if (!import.meta.client) return null
    const owner = localStorage.getItem(INITIAL_SCORE_OWNER_KEY)
    if (owner !== userId) return null
    const raw = localStorage.getItem(INITIAL_SCORE_KEY)
    if (raw === null) return null
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : null
  }

  /** [แก้ไข] เขียนคะแนน "ของรอบปัจจุบัน" ลง LocalStorage คู่กับ owner (userId) — คนละ
   * userId ต้องไม่เห็นคะแนนของกันและกันถ้าเคย Login เครื่องเดียวกันมาก่อน */
  function persistInitialScore(userId: string, score: number): void {
    if (!import.meta.client) return
    localStorage.setItem(INITIAL_SCORE_KEY, String(score))
    localStorage.setItem(INITIAL_SCORE_OWNER_KEY, userId)
  }

  /** [แก้ไข] ล้างคะแนน "ของรอบปัจจุบัน" ที่ sync ไว้ทั้งหมด — เรียกคู่กับ resetJourney()
   * เสมอ (ตอนกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก") เพื่อไม่ให้คะแนนรอบ
   * ที่จบไปแล้วค้างข้ามมารอบใหม่ */
  function clearPersistedInitialScore(): void {
    if (!import.meta.client) return
    localStorage.removeItem(INITIAL_SCORE_KEY)
    localStorage.removeItem(INITIAL_SCORE_OWNER_KEY)
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

  /** [Fix] อ่าน roundId ที่ visitedIds ในเครื่องนี้ผูกอยู่ (คู่กับ STORAGE_ROUND_KEY) */
  function getStoredRoundId(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem(STORAGE_ROUND_KEY)
  }

  /** [Fix] เขียน visitedIds คู่กับ roundId ที่เป็นเจ้าของเสมอ (roundId ไม่ระบุ =
   * ไม่เปลี่ยนแท็ก Round เดิม เช่น toggleStation() ระหว่างเล่นรอบเดียวกัน) */
  function persist(next: string[], roundId?: string | null): void {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (roundId !== undefined) {
        if (roundId) localStorage.setItem(STORAGE_ROUND_KEY, roundId)
        else localStorage.removeItem(STORAGE_ROUND_KEY)
      }
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
   *
   * [Fix] `if (initialized.value) return` เดิมกันแค่ "เรียกซ้ำในเซสชันเดียวกัน"
   * (เช่น Home mount ซ้ำ) เท่านั้น ไม่ได้เป็นสาเหตุของบั๊กข้ามอุปกรณ์ (initialized
   * เป็นแค่ useState ในหน่วยความจำของแต่ละเครื่อง/แต่ละแท็บ รีเซ็ตเป็น false ทุกครั้ง
   * ที่โหลดหน้าใหม่อยู่แล้ว) — ของเดิม "ไม่เคยเช็ค" ว่า Round ที่ค้างอยู่ใน LocalStorage
   * เครื่องนี้ตรงกับ Round Active จริงจาก backend หรือไม่เลยต่างหาก จึง sync
   * visitedRoundId (แท็ก Round เจ้าของข้อมูลในเครื่องนี้) เข้ามาด้วยตรงนี้ ให้
   * refreshFromBackend() เอาไปเทียบกับ Round Active จริงได้ทันทีที่เรียก
   */
  /**
   * [แก้ไข — ไม่ fetch จาก Backend อีกต่อไป] เดิมฟังก์ชันนี้ยิง getScore() (คะแนน
   * สะสมข้ามรอบ) มาตั้งเป็นจุดเริ่มต้นของทุกรอบ ซึ่งผิดตามสเปกจริง (adventureInitialScore
   * ต้องเป็นคะแนนของรอบปัจจุบันเท่านั้น ไม่ใช่คะแนนสะสมจากหลังบ้าน) — ตอนนี้แค่
   * "restore" ค่าที่เคย sync ไว้ล่าสุดของ userId นี้กลับมา (เผื่อ refresh หน้ากลาง
   * รอบ) เท่านั้น ไม่มีการเรียก API ใด ๆ อีกต่อไป ไม่มีเลย -> เริ่มจาก 0 ตามปกติ
   * (totalPoint computed ด้านบนคำนวณจาก visitedIds สดอยู่แล้วเสมอ ค่านี้เป็นแค่
   * สำเนาสำรอง sync ตามผ่าน watch ด้านล่างเท่านั้น)
   */
  function restoreInitialScore(userId?: string): void {
    if (!import.meta.client || !userId) return
    if (initialScoreInitialized.value) return

    const stored = getStoredInitialScore(userId)
    initialScore.value = stored ?? 0
    initialScoreInitialized.value = true
  }

  // [แก้ไข] sync initialScore (สำเนาสำรองใน LocalStorage) ให้ตรงกับ totalPoint
  // (คะแนนของรอบปัจจุบัน คำนวณจาก visitedIds สด) ทุกครั้งที่เปลี่ยน — ไม่ได้ถูกบวก
  // เข้ากับ totalPoint ที่ไหนเลย (กัน Double Count) แค่เป็นสำเนาไว้ใช้ restore ตอน
  // refresh หน้ากลางรอบเท่านั้น เขียนเฉพาะตอนมี userId แล้ว (Login แล้ว) เท่านั้น
  watch(totalPoint, (score) => {
    if (!import.meta.client) return
    initialScore.value = score
    const userId = useProfile().profile.value?.memberId
    if (userId) persistInitialScore(userId, score)
  })

  async function initAdventure(userId?: string): Promise<void> {
    if (initialized.value) return
    const stored = getStoredVisited()
    visitedIds.value = stored ?? DEFAULT_VISITED
    visitedRoundId.value = getStoredRoundId()
    initialized.value = true
    restoreInitialScore(userId)

    await Promise.all([refreshFromBackend(userId), refreshStationsFromBackend()])
  }

  /**
   * ดึงรายชื่อฐานจากชีต "Stations" (จัดการผ่านหน้า Admin) มาแปะทับ
   * name/points/active/description/imageUrl/lat/lng ของฐาน mock 4 อันเดิม —
   * ต้อง "จับคู่" กับ MOCK_ADVENTURE_STATIONS ทีละฐานก่อนเสมอ (เกมนี้เป็น Board
   * Game ผังคงที่ 4 ฐาน — corn/cow/soil/milk — ผูกกับ QR Code/ปุ่ม Scan ตายตัว
   * ดู pages/scan.vue STATION_CODE_MAP + FINAL_STATION_ID จึงไม่เปลี่ยน "จำนวน/id"
   * ฐานตามอำเภอใจจาก Admin ได้ แต่ "ตำแหน่งบนแผนที่ (lat/lng)" ปรับได้จาก Admin
   * แล้วผ่านคอลัมน์ Lat/Lng ในชีต Stations)
   *
   * จับคู่ด้วย "ลำดับ (order)" เท่านั้น — ห้ามใช้ Type/ชื่อฐานมาช่วยจัดลำดับ
   * เด็ดขาด: เรียงฐาน Backend ตาม order น้อย -> มาก แล้ว zip เข้ากับ
   * BOARD_POSITION_ORDER ทีละตำแหน่ง (order 1 = ตำแหน่งแรกในผัง [ซ้ายล่าง],
   * order 2 = ตำแหน่งที่สอง [ซ้ายบน], ...) ดูผัง/คำอธิบายเต็มที่คอมเมนต์เหนือ
   * BOARD_POSITION_ORDER ด้านบน
   * lat/lng: ใช้ค่าจาก Admin ถ้าตั้งไว้ (ไม่ null ทั้งคู่) ไม่งั้น fallback ไปใช้
   * พิกัดตั้งต้นของ mock เหมือนเดิม (ทำให้ Admin ย้ายหมุดบนแผนที่ได้จริงโดยไม่ต้อง
   * แก้โค้ด frontend เลย)
   * ฐานที่ Admin ปิดไว้ (active:false) จะไม่ถูกนับ/แสดงในหน้าเกมเลย (ดู `stations`
   * computed ด้านบนที่กรอง active ออก) ดึงไม่สำเร็จ (ออฟไลน์/API ล่ม) -> เงียบไว้
   * ใช้ค่า mock/ค่าล่าสุดที่มีอยู่ต่อไป ไม่กระทบการใช้งานหน้าปัจจุบัน
   */
  async function refreshStationsFromBackend(): Promise<void> {
    if (stationsInitialized.value) return
    if (!import.meta.client) return
    if (isBrowserOffline()) return

    try {
      const { listStations } = useMemberApi()
      const res = await listStations()
      if (!res.success || !res.stations || res.stations.length === 0) return

      // เรียงตาม order เท่านั้น (น้อย -> มาก) — ไม่ใช้ Type/ชื่อฐานในการจัดลำดับเลย
      const sorted = [...res.stations].sort((a, b) => a.order - b.order)

      // zip ทีละตำแหน่ง: ฐาน backend ที่ order น้อยสุด (sorted[0]) -> ตำแหน่งแรกใน
      // BOARD_POSITION_ORDER (order 1 = ซ้ายล่าง), sorted[1] -> order 2 (ซ้ายบน) ฯลฯ
      const byBoardId = new Map<string, (typeof sorted)[number]>()
      BOARD_POSITION_ORDER.forEach((mockId, index) => {
        const admin = sorted[index]
        if (admin) byBoardId.set(mockId, admin)
      })

      stationsState.value = MOCK_ADVENTURE_STATIONS.map((mock) => {
        const admin = byBoardId.get(mock.id)
        if (!admin) return { ...mock, points: POINTS_PER_STATION, active: true }
        const hasCoords = admin.lat !== null && admin.lng !== null
        return {
          ...mock,
          name: admin.name || mock.name,
          points: admin.points || POINTS_PER_STATION,
          active: admin.active,
          description: admin.description || undefined,
          imageUrl: admin.imageUrl || undefined,
          lat: hasCoords ? (admin.lat as number) : mock.lat,
          lng: hasCoords ? (admin.lng as number) : mock.lng,
          // เก็บ id ฝั่ง Backend ของแถวที่จับคู่ได้ตามลำดับ (order) ไว้เสมอ ให้
          // pages/scan.vue ใช้จับคู่ผลลัพธ์จาก verifyStationQr กลับมาที่ฐานบน
          // กระดานได้แม่นยำ 100% (backendId การันตีตรงกับแถวเดียวกันในชีต Stations)
          backendId: admin.id,
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
   *
   * [Fix — root cause ของ "มือถือค้าง 1/4 แต่คอมเป็น 0/4"] LocalStorage แยกกันคนละ
   * เครื่อง — เครื่องที่กด "จบเกม" (เช่นคอม) จะ resetJourney() ล้าง visitedIds ของ
   * ตัวเองถูกต้อง แต่เครื่องอื่น (มือถือ) ที่ไม่ได้กดจบเกม ไม่มีทางรู้เรื่องนี้เลยจนกว่า
   * จะเปิดแอปมาเช็คกับ backend เอง — เดิมโค้ดตรงนี้เช็ค backend ถูกต้องอยู่แล้วว่า
   * Round ปัจจุบันคือ Round ไหน (currentRoundId ด้านล่าง) แต่ตอน merge journey กลับ
   * ใช้วิธี "union" (เอาของเก่าในเครื่อง + ของจาก backend มารวมกันเสมอ) โดยไม่เคย
   * เทียบว่าของเก่าที่ค้างอยู่ในเครื่องนั้น "เป็นของ Round ที่ยัง Active จริงหรือไม่"
   * เลยสักครั้ง ทำให้ฐานจาก Round ที่จบไปแล้ว (จบโดยเครื่องอื่น) ค้างอยู่ในเครื่องนี้
   * ตลอดไป ไม่มีทางถูกล้างออกเอง — แก้โดยเทียบ currentRoundId (Round Active จริงจาก
   * backend) กับ visitedRoundId (Round ที่ visitedIds ในเครื่องนี้เป็นเจ้าของอยู่ตอนนี้
   * — ดู STORAGE_ROUND_KEY ด้านบน) ก่อนเสมอ: ไม่ตรงกัน (คนละ Round หรือไม่มี Round
   * Active เลย) -> ล้าง visitedIds ในเครื่องนี้ทิ้งก่อน (ไม่ merge ของเก่าเข้ามาอีก)
   * แล้วค่อย merge journey ที่ backend ยืนยันแล้วของ Round Active จริงเข้าไปแทน (รองรับ
   * เคสอีกเครื่องสแกนฐานของ Round ใหม่ไปก่อนหน้านี้แล้วด้วย) ไม่มีการลบ/แก้ Journey/
   * Round ใน Database ใด ๆ ทั้งสิ้น แก้แค่ฝั่งอ่าน/แสดงผลของเครื่องนี้เท่านั้น
   */
  async function refreshFromBackend(userId?: string): Promise<void> {
    if (!import.meta.client || !userId) return
    if (isBrowserOffline()) return

    // [Fix] จำเลข epoch ตอนเริ่มเรียกไว้ก่อนเสมอ — ถ้า resetJourney() ทำงานแทรก
    // ระหว่างที่ฟังก์ชันนี้กำลังรอ network (epoch เปลี่ยนไปจากตอนเริ่ม) แปลว่าผลลัพธ์
    // ที่กำลังจะได้กลาย "เก่าเกินไป" แล้ว (เขียนทับรอบใหม่ที่เพิ่ง reset ไม่ได้อีกต่อไป)
    // ดูคำอธิบายเต็ม ๆ ที่ resetEpoch ด้านบน
    const startEpoch = resetEpoch.value

    isSyncingFromBackend.value = true
    try {
      const { getRound, getJourney, getScore } = useMemberApi()

      // ดึง Round ปัจจุบัน (สด ๆ จาก backend เหมือน pages/profile.vue ทำอยู่แล้ว)
      // มาก่อนเสมอ เพื่อใช้กรอง Journey ให้เหลือเฉพาะ "รอบปัจจุบัน" เท่านั้น ก่อนหน้านี้
      // getJourney(userId) คืนประวัติฐาน "ทุก Round ที่เคยเล่นมาทั้งหมด" มา merge ตรง ๆ
      // ทำให้หลังจบเกม+เริ่มรอบใหม่ (RoundId ใหม่) ฐานทั้ง 4 จะติดสถานะ "ผ่านแล้ว"
      // ค้างมาจากรอบก่อนทันที สแกนฐานในรอบใหม่ไม่ได้เลยสักฐาน — ไม่มีการลบ/แก้ Journey/
      // Round เก่าใน Database ใด ๆ ทั้งสิ้น แค่กรองฝั่งอ่านเท่านั้น
      const roundRes = await getRound(userId).catch(() => null)

      // [Fix] response ของ getRound() ใบนี้อาจ "ช้าเกินไป" แล้วก็ได้ (ผู้เล่นกด
      // "จบเกม" -> resetJourney() บวก epoch ไปแล้วระหว่างที่ await อยู่) — ถ้า epoch
      // เปลี่ยนไปจากตอนเริ่มฟังก์ชัน ห้ามเขียน visitedIds/persist() ทับ state ที่เพิ่ง
      // reset ใหม่เด็ดขาด ปล่อยผ่านเงียบ ๆ ไปเลย (ดู resetEpoch ด้านบนสำหรับเหตุผลเต็ม ๆ)
      if (resetEpoch.value !== startEpoch) return

      const currentRoundId =
        roundRes?.success && roundRes.round?.status === 'Started' ? roundRes.round.roundId : null

      // [Fix] เทียบ Round Active จริง (currentRoundId) กับ Round ที่ visitedIds ใน
      // เครื่องนี้เป็นเจ้าของอยู่ตอนนี้ (visitedRoundId) — ไม่ตรงกัน (รวมถึงกรณีไม่มี
      // Round Active เลย เช่น เพิ่งจบเกม ยังไม่ทันเริ่มรอบใหม่) แปลว่าของในเครื่องนี้
      // เป็นของ Round เก่าที่ไม่ใช่รอบปัจจุบันแล้ว ต้องล้างทิ้งก่อนเสมอ
      //
      // [Fix — บั๊กคะแนนฐานหายตอนถึงหน้าสรุปผล] เดิมเงื่อนไขนี้ล้าง visitedIds ทิ้ง
      // ทันทีทุกครั้งที่ไม่ตรงกัน "แม้ในเคสที่ visitedRoundId เป็น null เพราะแค่ยัง
      // ไม่เคยรู้ roundId จริง" (ensureRoundStarted() ตอนสแกนฐานแรกเจอเน็ตมือถือ
      // หลุด/ช้าจน resolve ไม่ทันตอนนั้น — toggleStation() เลย persist ด้วย roundId
      // เป็น null ไปก่อน) ซึ่ง "ไม่ใช่คนละรอบจริง ๆ" แค่ยังไม่รู้ roundId ตอนนั้นเอง
      // — ถ้าเข้าเงื่อนไขนี้พอดีก่อนสแกนฐานถัดไป จะล้างฐานที่ผ่านไปแล้วทิ้งหมด ทั้งที่
      // เป็นรอบเดียวกันอยู่ (นี่คือสาเหตุจริงที่คะแนนฐานก่อน ๆ "หาย" ไปก่อนถึงฐานนม)
      //
      // แก้โดยเพิ่มเงื่อนไขพิเศษ (เหมือนที่แก้ใน useQuestion.ts::initAnsweredState()
      // ระบบคู่ขนาน): ถ้า visitedRoundId เดิมเป็น null และ currentRoundId ที่เพิ่งรู้
      // "ไม่ใช่ null" -> ถือว่าเป็นรอบเดียวกัน (แค่เพิ่งรู้ roundId จริงช้า) -> ย้าย
      // แท็กมาเป็น roundId จริงแทน ไม่ล้าง visitedIds ที่มีอยู่ทิ้ง ส่วนกรณีอื่นทั้งหมด
      // (roundId จริงสองค่าต่างกัน, หรือไม่มี Round Active เลย) ยังคงล้างทิ้งเหมือนเดิม
      // ทุกประการ (พฤติกรรมเดิมไม่เปลี่ยนสำหรับกรณี "คนละรอบจริง ๆ")
      if (currentRoundId !== visitedRoundId.value) {
        if (visitedRoundId.value === null && currentRoundId !== null) {
          visitedRoundId.value = currentRoundId
          persist(visitedIds.value, currentRoundId)
        } else {
          visitedIds.value = []
          visitedRoundId.value = currentRoundId
          persist([], currentRoundId)
        }
      }

      const [journeyRes, scoreRes] = await Promise.all([
        getJourney(userId).catch(() => null),
        getScore(userId).catch(() => null),
      ])

      // [Fix] เช็คซ้ำอีกรอบหลัง await ก้อนที่ 2 (getJourney/getScore) — ผู้เล่นอาจกด
      // "จบเกม" แทรกเข้ามาระหว่างนี้พอดีก็ได้เช่นกัน (สอง await นี้ห่างกันพอสมควรบน
      // เครือข่ายมือถือ) ต้องกันการเขียนทับซ้ำอีกชั้นก่อนถึง merge ด้านล่าง
      if (resetEpoch.value !== startEpoch) return

      if (journeyRes?.success && journeyRes.journey) {
        // ไม่มี Round ที่ยัง Started อยู่เลย (เช่นเพิ่งกด "จบเกม" ไป ยังไม่ทัน
        // สร้าง Round ใหม่) -> ไม่ merge ฐานใด ๆ จาก backend เพิ่ม (currentRoundId
        // เป็น null จะกรองได้ array ว่างเสมอ เพราะ entry.roundId ไม่มีทาง === null)
        // ป้องกัน fallback แบบเดิมที่เอาประวัติทุก Round มา merge รวมกัน
        const scopedJourney = currentRoundId
          ? journeyRes.journey.filter((entry) => entry.roundId === currentRoundId)
          : []
        const backendVisited = scopedJourney.map((entry) => entry.stationId)
        // merge กับของเดิมในเครื่อง (ถ้าเพิ่งล้างไปด้านบนก็จะเป็น [] อยู่แล้ว) กันเคส
        // "เพิ่งสแกนฐานใหม่ของ Round เดียวกันแต่ queue ยังไม่ทัน sync" ปลอดภัยแล้วเพราะ
        // ผ่านการเช็ค currentRoundId === visitedRoundId ด้านบนมาก่อนแล้วเท่านั้น
        const merged = Array.from(new Set([...visitedIds.value, ...backendVisited]))
        visitedIds.value = merged
        visitedRoundId.value = currentRoundId
        persist(merged, currentRoundId)
      }

      if (scoreRes?.success && scoreRes.score) {
        backendTotalPoint.value = scoreRes.score.totalPoint
      }
    } finally {
      isSyncingFromBackend.value = false
    }
  }

  /**
   * แตะ Marker -> Toggle ผ่านฐาน/ยกเลิก พร้อมอัปเดต Point และ Polyline (ผ่าน computed)
   *
   * [Fix — บั๊กคะแนนฐานหายตอนถึงหน้าสรุปผล] เดิมฟังก์ชันนี้ไม่รับ/ไม่อัปเดต
   * visitedRoundId เลย — เรียก persist(next) โดยไม่ส่ง roundId ตามมาด้วย ทำให้
   * STORAGE_ROUND_KEY ใน LocalStorage "ไม่ถูกแตะเลย" ทุกครั้งที่สแกนฐาน ถ้า
   * ensureRoundStarted() (pages/scan.vue) เพิ่งได้ roundId จริงมาช้ากว่าการสแกน
   * ฐานแรก (เน็ตมือถือกลางแปลงหลุด/ช้า — เคสที่เกิดขึ้นได้จริงบ่อยกับเกมนี้)
   * visitedRoundId ในเครื่องจะค้างเป็นค่าเก่า/null ต่อไปเรื่อย ๆ ทั้งที่ visitedIds
   * มีฐานที่ผ่านจริงอยู่แล้ว — พอ refreshFromBackend() รอบถัดไป (เช่น เปลี่ยนหน้า
   * Scan -> Map) เทียบ currentRoundId (roundId จริงจาก backend) กับ visitedRoundId
   * เก่านี้แล้วเจอไม่ตรงกัน จะเข้าใจผิดว่า "เป็นข้อมูลของรอบเก่า" แล้วล้าง
   * visitedIds ทิ้งทั้งหมดทันที (ดู refreshFromBackend() ด้านบน) — นี่คือสาเหตุจริง
   * ที่คะแนนจากฐานที่สแกนไปแล้ว "หายไป" ก่อนถึงฐานสุดท้าย
   *
   * แก้โดยรับ roundId ที่ "สดจริง ๆ" จากผู้เรียก (pages/scan.vue ส่ง
   * currentRoundId.value ที่อ่านจาก useRound() ตรง ๆ ทุกครั้งที่ตอบ ไม่ใช่ค่า cache)
   * มาอัปเดต visitedRoundId.value ทันทีที่ toggleStation() ทำงาน — ทำให้ระบบ
   * "ซ่อมตัวเองได้" แม้ ensureRoundStarted() ครั้งแรกจะ resolve ช้า/ล้มเหลวชั่วคราว
   * ก็ตาม ไม่ส่ง roundId มา (undefined) = พฤติกรรมเดิมทุกประการ (ไม่แตะ
   * visitedRoundId/STORAGE_ROUND_KEY) เผื่อมีจุดเรียกอื่นที่ยังไม่พร้อมส่งค่านี้
   */
  function toggleStation(stationId: string, roundId?: string | null): void {
    const exists = visitedIds.value.includes(stationId)
    const next = exists
      ? visitedIds.value.filter((id) => id !== stationId)
      : [...visitedIds.value, stationId]
    visitedIds.value = next
    if (roundId !== undefined) visitedRoundId.value = roundId
    persist(next, roundId)
  }

  /**
   * [Fix] ตอนนี้เรียกจริงตอนกด "จบเกม" ที่ฐานนม (ดู pages/scan.vue ->
   * endGameAfterFinalStation) — เดิมฟังก์ชันนี้มีอยู่แล้วแต่ไม่เคยถูกเรียกใช้ที่ไหน
   * เลยสักจุด ทำให้ฐานที่ผ่านแล้ว/คะแนน ค้างอยู่ในเครื่องข้ามรอบ (Round เปลี่ยนไปแล้ว
   * แต่ Client state ไม่รีเซ็ต) เพิ่ม backendTotalPoint = null (เดิมไม่รีเซ็ต) ด้วย
   * เพื่อเคลียร์คะแนนที่ cache ไว้จากรอบก่อน ให้รอบใหม่คำนวณคะแนนใหม่ทั้งหมด
   * ไม่มีการลบ/แก้ข้อมูลใน Database ใด ๆ ทั้งสิ้น — ล้างแค่ LocalStorage/State ฝั่ง
   * เครื่องนี้เท่านั้น (Round/Journey/Score เก่าในชีตยังอยู่ครบเหมือนเดิม)
   *
   * [Fix] ล้าง visitedRoundId (แท็ก Round เจ้าของ visitedIds ในเครื่องนี้ — ดู
   * STORAGE_ROUND_KEY ด้านบน) ด้วย เพราะ Round ที่เพิ่งจบไปนี้ไม่ใช่ Round Active
   * แล้ว ให้ refreshFromBackend() ครั้งถัดไป (ตอนเริ่มรอบใหม่) รู้ว่าต้อง merge
   * journey ของ Round ใหม่จริง ๆ เท่านั้น ไม่ใช่ยึดแท็ก Round เก่าไว้เฉย ๆ
   *
   * [Debug — ชั่วคราว] log [ROUND RESET] เพื่อยืนยันว่าเครื่องนี้ reset จริงตอนกด
   * จบเกม (เทียบ previousVisited/previousScore ก่อน reset กับ resetVisited/
   * resetScore หลัง reset) — ลบออกได้เมื่อยืนยันบั๊กมือถือหายแล้ว
   *
   * [Fix — root cause ของ "adventureVisitedStations เป็น [\"milk\"] หลัง reset"]
   * บวก resetEpoch ทุกครั้งที่ reset — เพื่อบอก refreshFromBackend() ที่อาจกำลัง
   * รอ network ค้างอยู่ (ยิงไปตั้งแต่ตอนสแกนผ่านฐานนม ก่อนกด "จบเกม") ว่า response
   * ที่กำลังจะได้กลับมานั้น "เก่าเกินไป" แล้ว ห้ามเอามาเขียนทับ visitedIds ของรอบใหม่
   * ที่เพิ่ง reset นี้อีก (ดูคำอธิบายเต็ม ๆ ที่ resetEpoch ด้านบนของไฟล์)
   */
  function resetJourney(): void {
    const previousVisited = visitedIds.value
    const previousScore = totalPoint.value
    const previousRoundId = visitedRoundId.value

    resetEpoch.value += 1
    visitedIds.value = []
    visitedRoundId.value = null
    persist([], null)
    backendTotalPoint.value = null
    // [แก้ไข] ล้างคะแนน "ของรอบปัจจุบัน" (initialScore/adventureInitialScore ใน
    // LocalStorage) ทิ้งทันทีด้วย — เพราะเป็นแค่สำเนาสำรองของ totalPoint ของรอบ
    // ที่เพิ่งจบไปเท่านั้น (ไม่ใช่คะแนนสะสมจาก Backend อีกต่อไป — ดูคำอธิบายเต็ม ๆ
    // ที่ INITIAL_SCORE_KEY ด้านบนของไฟล์) ปล่อยค้างไว้จะทำให้รอบถัดไปเห็นคะแนนเก่า
    // โผล่มาจนกว่า watch(totalPoint, ...) จะ sync ทับ (มี window สั้น ๆ ที่ผิดได้)
    initialScore.value = 0
    clearPersistedInitialScore()

    if (import.meta.client) {
      // eslint-disable-next-line no-console
      console.log('[ROUND RESET]', {
        roundId: previousRoundId,
        previousVisited,
        previousScore,
        resetVisited: visitedIds.value,
        resetScore: 0,
      })
    }
  }

  return {
    stations,
    totalStations,
    visitedIds: readonly(visitedIds),
    visitedCount,
    totalPoint,
    initialScore: readonly(initialScore),
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
