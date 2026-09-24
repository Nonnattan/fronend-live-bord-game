/**
 * services/detection/providers/objectDetectionProvider.ts
 * ---------------------------------------------------------------------------
 * Provider สำหรับ detectionType 'object', 'specific_object', 'person'
 *
 * *** Phase 1 (ตอนนี้): ยังไม่ผูก AI Model จริงตามสเปก ("ยังไม่ต้องสร้างหรือ
 * train AI Model จริง") — ไฟล์นี้แค่ "ลงทะเบียน" ไว้ล่วงหน้าเพื่อให้เห็น
 * โครงสร้าง extensible เต็มรูปแบบ (มี detectionType ที่ยังไม่มี provider
 * ทำงานจริงอยู่ในระบบได้ โดยไม่พังทั้งระบบ — engine จะคืน error state ที่สื่อ
 * ความหมายชัดเจนแทน ไม่ throw ทำให้แอปพัง)
 *
 * *** Phase 2 (ทำแล้ว): การตรวจจับจริงย้ายไปอยู่ที่ไฟล์ใหม่
 * `cocoSsdProvider.ts` (TensorFlow.js + COCO-SSD) ซึ่งถูกลงทะเบียน **ก่อน**
 * ไฟล์นี้ใน `detectionEngine.ts` -> PROVIDERS จึงถูกเลือกใช้แทนเสมอ —
 * เจตนาคงไฟล์นี้ไว้ตามเดิมทั้งไฟล์ (ไม่ลบ/ไม่แก้ logic) เพราะยังมีประโยชน์ 2 อย่าง:
 *   1) เป็นตัวอย่าง provider ที่สั้นที่สุดสำหรับคนที่จะเขียน provider ใหม่
 *   2) ใช้เป็น "สวิตช์ปิดการตรวจจับจริง" ได้โดยไม่ต้อง deploy โค้ดใหม่ — แค่ใส่
 *      `object-detection-stub-v1` ในคอลัมน์ Provider ของชีต PhotoQuests
 * โครงสร้างภายนอก (id/supports/isOfflineCapable/detect) เหมือนกันทุกประการกับ
 * ตัวจริง เพราะ detectionEngine.ts เรียกผ่าน interface เดียวกันเสมอ
 */

import type { DetectionProvider, DetectionInput } from '../types'
import type { DetectionResult } from '~/types/photoQuest'

export const objectDetectionProvider: DetectionProvider = {
  id: 'object-detection-stub-v1',
  supports: ['object', 'specific_object', 'person'],
  // ยังไม่มี model ผูกจริง — ตั้งเป็น false ไว้ก่อนเพื่อให้ Detection Engine รู้
  // ว่ายังใช้งานตอนออฟไลน์ไม่ได้จริง (กัน UI สัญญาว่า "ทำงานได้เสมอ" ทั้งที่ยังไม่มี)
  isOfflineCapable: false,
  async detect(_input: DetectionInput): Promise<DetectionResult> {
    return {
      passed: false,
      confidence: 0,
      reason:
        'Detection Type นี้ยังไม่เปิดใช้งานจริงในเวอร์ชันนี้ (รอ Phase 2 — ผูก TensorFlow.js/MediaPipe) กรุณาติดต่อเจ้าหน้าที่',
      providerId: 'object-detection-stub-v1',
    }
  },
}
