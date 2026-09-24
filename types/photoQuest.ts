/**
 * types/photoQuest.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Data Model ของระบบ "Photo Detection Quest"
 *
 * เจตนาออกแบบ: ยังไม่รู้ว่าในอนาคตจะตรวจจับอะไรบ้าง (ต้นไม้/ป้าย/สี/OCR ฯลฯ)
 * จึงห้ามผูก field ใด ๆ กับ target เฉพาะเจาะจง (เช่น 'tree') ตรง ๆ — ทุกอย่างที่
 * เป็น "เนื้อหาของเควส" (จะตรวจอะไร, target คืออะไร, threshold เท่าไหร่) ต้องมา
 * จากข้อมูล (Google Sheet "PhotoQuests" ผ่าน server-gas/PhotoQuestService.gs)
 * ไม่ hard-code ในโค้ด frontend เด็ดขาด — ดูสถาปัตยกรรมเต็ม ๆ ที่
 * services/detection/detectionEngine.ts
 */

/** ประเภทการตรวจจับที่ Detection Engine รองรับ — เพิ่มชนิดใหม่ในอนาคตได้โดย
 * ไม่ต้องแก้โครงสร้างหลัก (แค่เพิ่ม provider ใหม่ + ลงทะเบียนใน detectionEngine.ts) */
export type DetectionType =
  | 'object' // มีวัตถุประเภทกว้าง ๆ อยู่ในภาพไหม (ทั่วไป ไม่เจาะจงต้น/ตัวใดตัวหนึ่ง)
  | 'specific_object' // วัตถุเฉพาะเจาะจง (เทียบกับรูปอ้างอิง/label เฉพาะ)
  | 'ocr' // อ่านข้อความในภาพแล้วเทียบกับคำ/รูปแบบที่กำหนด
  | 'person' // ตรวจว่ามี/ไม่มีคนอยู่ในภาพ
  | 'color' // ตรวจสี/สัดส่วนสีเด่นในภาพ
  | 'image_condition' // เงื่อนไขทั่วไปของภาพ เช่น ความสว่าง/ความคมชัด

/** เงื่อนไขการตรวจจับ 1 ชุด — ผูกกับ 1 PhotoQuest เสมอ
 * target ความหมายขึ้นกับ detectionType (ดูตัวอย่างในแต่ละ provider):
 *   - object / specific_object: label หรือ id ของรูปอ้างอิง (เช่น 'tree', 'ref-image-01')
 *   - ocr: คำหรือ regex ที่ต้องเจอในข้อความที่อ่านได้
 *   - color: hex หรือชื่อสี (เช่น '#2e7d32', 'green')
 *   - person: ไม่ใช้ target ('any' หรือปล่อยว่างได้)
 *   - image_condition: ชื่อเงื่อนไข (เช่น 'min-brightness', 'outdoor')
 */
export interface DetectionRule {
  detectionType: DetectionType
  target: string
  /** threshold ความมั่นใจขั้นต่ำที่ถือว่า "ผ่าน" — 0 ถึง 1 */
  confidence: number
  /** บังคับเลือก provider เฉพาะ (ไม่ระบุ = engine เลือก provider เริ่มต้นของ
   * detectionType นี้ให้อัตโนมัติ) เผื่ออนาคตมีหลาย provider ต่อ 1 ประเภท */
  provider?: string
  /** พารามิเตอร์เสริมเฉพาะ provider นั้น ๆ (เช่น color provider อาจรับ
   * tolerance, ocr provider อาจรับ language) — เก็บแบบ loose ไว้ก่อนเพราะยัง
   * ไม่รู้ว่าแต่ละ provider ในอนาคตต้องการ config อะไรบ้าง */
  options?: Record<string, unknown>
}

/** 1 Photo Quest (ชีต "PhotoQuests" ฝั่ง server-gas) — ข้อมูลทั้งหมดมาจาก
 * Backend เท่านั้น ไม่มีส่วนไหน hard-code ไว้ฝั่ง frontend */
export interface PhotoQuest {
  id: string
  type: 'photo_detection'
  name: string
  description: string
  points: number
  active: boolean
  rule: DetectionRule
  /** รูปตัวอย่างให้ผู้เล่นดูก่อนถ่าย (ไม่ใช่รูปสำหรับเทียบ embedding เสมอไป) */
  exampleImageUrl?: string
  order?: number
  updatedAt?: string
}

/** ผลลัพธ์จาก Detection Engine หลังตรวจภาพ 1 ครั้ง */
export interface DetectionResult {
  passed: boolean
  confidence: number
  /** ข้อความอธิบายเหตุผล (ใช้แสดงตอนไม่ผ่าน เช่น "ตรวจไม่พบต้นไม้ในภาพ") */
  reason?: string
  /** provider ที่ใช้ตรวจจริง — ไว้ debug/analytics */
  providerId: string
}

/** 1 ครั้งที่ผู้เล่นถ่ายรูปทำเควส (เก็บใน LocalStorage ก่อนเสมอ — Offline First
 * เหมือน PendingCheckin ในระบบ Station เดิม) */
export interface PhotoQuestAttempt {
  /** uuid ฝั่ง client — ใช้กันซ้ำตอน sync เหมือน PendingCheckin.uuid เดิม */
  clientId: string
  questId: string
  questName: string
  points: number
  result: DetectionResult
  attemptedAt: number
  synced: boolean
}
