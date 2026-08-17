/**
 * services/detection/types.ts
 * ---------------------------------------------------------------------------
 * สัญญากลาง (contract) ที่ทุก Detection Provider ต้องทำตาม — ไฟล์นี้คือจุดที่
 * ทำให้ Detection Engine เป็น "extensible" จริง ๆ: detectionEngine.ts ไม่รู้จัก
 * รายละเอียดภายในของ provider แต่ละตัวเลย รู้แค่ว่าทุก provider มีหน้าตาแบบนี้
 */

import type { DetectionRule, DetectionResult } from '~/types/photoQuest'

/** Input ที่ส่งเข้า provider — ใช้ HTMLImageElement/ImageBitmap เป็นหลักเพราะ
 * ทุก provider (canvas heuristic, TFJS, ฯลฯ) แปลงมาจากตรงนี้ได้หมด */
export interface DetectionInput {
  image: HTMLImageElement | ImageBitmap
  rule: DetectionRule
}

export interface DetectionProvider {
  /** id เฉพาะของ provider นี้ — ใช้ตอนอ้างอิงใน DetectionRule.provider และใน
   * DetectionResult.providerId (เช่น 'canvas-color-v1', 'tfjs-coco-ssd-v1') */
  id: string
  /** detectionType ที่ provider นี้รองรับ (1 provider รองรับได้หลายประเภทถ้า
   * เหมาะสม แต่ปกติควรมี 1 provider ต่อ 1 ประเภทเพื่อความง่ายในการดูแล) */
  supports: string[]
  /** true = ทำงานได้บนเครื่องล้วน ๆ ไม่ต้องมี Internet (สำคัญมากสำหรับระบบ
   * Offline First ของแอปนี้ — engine ใช้ค่านี้ตัดสินใจว่าจะรันตอนไม่มีเน็ตได้ไหม) */
  isOfflineCapable: boolean
  /** ตรวจภาพ 1 รูปตามเงื่อนไข rule แล้วคืนผลลัพธ์ — ห้าม throw ถ้าตรวจไม่ผ่าน
   * (แค่คืน passed:false) ให้ throw เฉพาะกรณี provider ทำงานไม่ได้จริง ๆ
   * (เช่น model โหลดไม่สำเร็จ) engine จะดักและแปลงเป็น error state ให้เอง */
  detect(input: DetectionInput): Promise<DetectionResult>
}
