/**
 * services/detection/providers/cocoLabels.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ (Phase 2 — Object Detection จริง) — ตารางแปลง Label ของโมเดล
 * COCO-SSD (80 คลาส ชื่อเป็นภาษาอังกฤษล้วน) ให้ใช้งานกับข้อมูลเควสภาษาไทยได้
 *
 * ทำไมต้องแยกไฟล์: `cocoSsdProvider.ts` ควรมีแต่ Logic การตรวจจับล้วน ๆ ส่วน
 * "ตารางคำ" เป็นข้อมูลที่แก้บ่อยกว่ามาก (เพิ่มคำเรียกใหม่ที่คนหน้างานใช้จริง)
 * แยกออกมาให้แก้ได้โดยไม่ต้องอ่าน Logic เลย
 *
 * *** สำคัญ: ไฟล์นี้ "ไม่ใช่" การ hard-code เควส *** — เควสยังมาจากชีต
 * "PhotoQuests" เหมือนเดิมทุกประการ (ดู types/photoQuest.ts) ไฟล์นี้แค่ช่วยให้
 * คนกรอกชีตพิมพ์ target เป็นภาษาไทย ("วัว") แทนที่จะต้องจำ label อังกฤษของ
 * โมเดล ("cow") เท่านั้น — กรอกเป็นอังกฤษตรง ๆ ก็ยังใช้ได้เหมือนเดิม
 */

/** 80 คลาสของโมเดล COCO-SSD + ชื่อภาษาไทยสำหรับแสดงผลให้ผู้เล่นอ่าน */
export const COCO_LABEL_TH: Record<string, string> = {
  person: 'คน',
  bicycle: 'จักรยาน',
  car: 'รถยนต์',
  motorcycle: 'มอเตอร์ไซค์',
  airplane: 'เครื่องบิน',
  bus: 'รถบัส',
  train: 'รถไฟ',
  truck: 'รถบรรทุก',
  boat: 'เรือ',
  'traffic light': 'สัญญาณไฟจราจร',
  'fire hydrant': 'หัวจ่ายน้ำดับเพลิง',
  'stop sign': 'ป้ายหยุด',
  'parking meter': 'มิเตอร์จอดรถ',
  bench: 'ม้านั่ง',
  bird: 'นก',
  cat: 'แมว',
  dog: 'สุนัข',
  horse: 'ม้า',
  sheep: 'แกะ',
  cow: 'วัว',
  elephant: 'ช้าง',
  bear: 'หมี',
  zebra: 'ม้าลาย',
  giraffe: 'ยีราฟ',
  backpack: 'เป้สะพายหลัง',
  umbrella: 'ร่ม',
  handbag: 'กระเป๋าถือ',
  tie: 'เนกไท',
  suitcase: 'กระเป๋าเดินทาง',
  frisbee: 'จานร่อน',
  skis: 'สกี',
  snowboard: 'สโนว์บอร์ด',
  'sports ball': 'ลูกบอล',
  kite: 'ว่าว',
  'baseball bat': 'ไม้เบสบอล',
  'baseball glove': 'ถุงมือเบสบอล',
  skateboard: 'สเก็ตบอร์ด',
  surfboard: 'กระดานโต้คลื่น',
  'tennis racket': 'ไม้เทนนิส',
  bottle: 'ขวด',
  'wine glass': 'แก้วไวน์',
  cup: 'แก้วน้ำ',
  fork: 'ส้อม',
  knife: 'มีด',
  spoon: 'ช้อน',
  bowl: 'ชาม',
  banana: 'กล้วย',
  apple: 'แอปเปิล',
  sandwich: 'แซนด์วิช',
  orange: 'ส้ม',
  broccoli: 'บรอกโคลี',
  carrot: 'แครอท',
  'hot dog': 'ฮอทดอก',
  pizza: 'พิซซ่า',
  donut: 'โดนัท',
  cake: 'เค้ก',
  chair: 'เก้าอี้',
  couch: 'โซฟา',
  'potted plant': 'ต้นไม้ในกระถาง',
  bed: 'เตียง',
  'dining table': 'โต๊ะอาหาร',
  toilet: 'โถสุขภัณฑ์',
  tv: 'โทรทัศน์',
  laptop: 'โน้ตบุ๊ก',
  mouse: 'เมาส์',
  remote: 'รีโมต',
  keyboard: 'คีย์บอร์ด',
  'cell phone': 'โทรศัพท์มือถือ',
  microwave: 'ไมโครเวฟ',
  oven: 'เตาอบ',
  toaster: 'เครื่องปิ้งขนมปัง',
  sink: 'อ่างล้างมือ',
  refrigerator: 'ตู้เย็น',
  book: 'หนังสือ',
  clock: 'นาฬิกา',
  vase: 'แจกัน',
  scissors: 'กรรไกร',
  'teddy bear': 'ตุ๊กตาหมี',
  'hair drier': 'ไดร์เป่าผม',
  toothbrush: 'แปรงสีฟัน',
}

/** คำเรียกอื่น ๆ ที่คนกรอกชีตน่าจะพิมพ์จริง -> label ของโมเดล
 * (ชื่อไทยหลักจาก COCO_LABEL_TH ถูกเติมให้อัตโนมัติด้านล่าง ไม่ต้องซ้ำที่นี่) */
const EXTRA_ALIASES: Record<string, string> = {
  มนุษย์: 'person',
  บุคคล: 'person',
  ผู้คน: 'person',
  นักท่องเที่ยว: 'person',
  หมา: 'dog',
  หมาน้อย: 'dog',
  แมวเหมียว: 'cat',
  โค: 'cow',
  วัวควาย: 'cow',
  ควาย: 'cow',
  กระบือ: 'cow',
  ต้นไม้: 'potted plant',
  กระถางต้นไม้: 'potted plant',
  ไม้กระถาง: 'potted plant',
  พืช: 'potted plant',
  รถ: 'car',
  รถกระบะ: 'truck',
  จยย: 'motorcycle',
  มอไซค์: 'motorcycle',
  ขวดน้ำ: 'bottle',
  แก้ว: 'cup',
  มือถือ: 'cell phone',
  โทรศัพท์: 'cell phone',
  นาฬิกาแขวน: 'clock',
  หนังสือเล่ม: 'book',
}

/** กลุ่มหมวดหมู่กว้าง ๆ สำหรับ detectionType 'object' — ถ่ายอะไรก็ได้ที่อยู่ใน
 * กลุ่มนี้ก็ผ่าน (เช่นเควส "ถ่ายสัตว์ในฟาร์ม" ไม่ควรบังคับว่าต้องเป็นวัวเท่านั้น)
 * ค่าว่าง [] = ยอมรับทุก label ที่โมเดลตรวจเจอ */
export const COCO_LABEL_GROUPS: Record<string, string[]> = {
  any: [],
  ใดก็ได้: [],
  อะไรก็ได้: [],
  animal: ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'],
  สัตว์: ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'],
  'farm-animal': ['cow', 'sheep', 'horse', 'bird', 'dog', 'cat'],
  สัตว์ในฟาร์ม: ['cow', 'sheep', 'horse', 'bird', 'dog', 'cat'],
  vehicle: ['bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat'],
  ยานพาหนะ: ['bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat'],
  food: ['banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake'],
  อาหาร: ['banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake'],
  fruit: ['banana', 'apple', 'orange'],
  ผลไม้: ['banana', 'apple', 'orange'],
  vegetable: ['broccoli', 'carrot'],
  ผัก: ['broccoli', 'carrot'],
  plant: ['potted plant'],
  furniture: ['chair', 'couch', 'bed', 'dining table', 'bench'],
  เฟอร์นิเจอร์: ['chair', 'couch', 'bed', 'dining table', 'bench'],
}

/** ตารางค้นหารวม (ไทย + อังกฤษ + alias) -> label จริงของโมเดล
 * สร้างครั้งเดียวตอน import module ไม่ได้คำนวณซ้ำทุกครั้งที่ตรวจภาพ */
const LOOKUP: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const en of Object.keys(COCO_LABEL_TH)) {
    map[normalizeKey(en)] = en
    // ชื่อไทยหลักของแต่ละคลาส (เช่น 'วัว' -> 'cow')
    map[normalizeKey(COCO_LABEL_TH[en] as string)] = en
  }
  for (const [alias, en] of Object.entries(EXTRA_ALIASES)) {
    map[normalizeKey(alias)] = en
  }
  return map
})()

/** ตัดช่องว่าง/ขีด/ขีดล่างและแปลงเป็นตัวพิมพ์เล็ก เพื่อให้ "Potted Plant",
 * "potted_plant", "pottedplant" และ "ต้นไม้ ในกระถาง" ค้นเจอเหมือนกันหมด */
function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, '')
}

/**
 * แปลง `rule.target` จากชีต -> รายชื่อ label ของโมเดลที่ถือว่า "ผ่าน"
 *
 * รองรับ 3 รูปแบบในช่องเดียว (ผู้กรอกชีตเลือกใช้แบบไหนก็ได้):
 *   1) ชื่อคลาสเดี่ยว  — "cow" / "วัว" / "สุนัข"
 *   2) ชื่อกลุ่ม        — "animal" / "สัตว์ในฟาร์ม" / "any"
 *   3) หลายค่าคั่นด้วย , หรือ | — "cow,sheep" / "วัว|แกะ|ม้า"
 *
 * คืน `[]` = ยอมรับทุก label (กรณีกลุ่ม 'any' หรือ target ว่าง)
 * คืน `null` = แปลไม่ออกเลยสักค่า (ผู้กรอกชีตพิมพ์ผิด) ให้ provider แจ้ง error
 */
export function resolveTargetLabels(target: string): string[] | null {
  const raw = (target ?? '').trim()
  if (!raw) return []

  const group = COCO_LABEL_GROUPS[normalizeKey(raw)] ?? COCO_LABEL_GROUPS[raw.trim().toLowerCase()]
  if (group) return [...group]

  const parts = raw
    .split(/[,|]/)
    .map((p) => p.trim())
    .filter(Boolean)

  const labels: string[] = []
  for (const part of parts) {
    // แต่ละชิ้นที่คั่นมาก็ยังเป็นชื่อกลุ่มได้ เช่น "สัตว์|รถยนต์"
    const partGroup = COCO_LABEL_GROUPS[normalizeKey(part)]
    if (partGroup) {
      if (partGroup.length === 0) return [] // มี 'any' ปนมา = ยอมรับทุกอย่าง
      labels.push(...partGroup)
      continue
    }
    const label = LOOKUP[normalizeKey(part)]
    if (label) labels.push(label)
  }

  if (labels.length === 0) return null
  return [...new Set(labels)]
}

/** ชื่อไทยสำหรับแสดงผล (ไม่รู้จัก label ไหนก็คืนค่าเดิมไป ไม่ throw) */
export function toThaiLabel(label: string): string {
  return COCO_LABEL_TH[label] ?? label
}
