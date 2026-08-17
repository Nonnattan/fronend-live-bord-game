/**
 * services/photoQuestMockData.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ข้อมูลเควส **ตัวอย่าง (Mock)** สำหรับทดสอบระบบ Photo Detection
 * ก่อนที่ชีต "PhotoQuests" ฝั่ง Google Apps Script จะมีข้อมูลจริง
 *
 * *** ไฟล์นี้เป็นของชั่วคราวสำหรับช่วงพัฒนาเท่านั้น ***
 * `composables/usePhotoQuest.ts` จะใช้ข้อมูลชุดนี้ **ก็ต่อเมื่อ** โหลดจาก
 * Backend แล้วไม่ได้เควสจริงมาเลยสักตัว (API ล่ม / ยังไม่ deploy / ชีตว่าง)
 * เท่านั้น — ถ้าชีตมีข้อมูลแล้ว ข้อมูลจริงชนะเสมอ ไม่ต้องมาแก้โค้ดตรงนี้
 *
 * วิธีเอาออกเมื่อชีตพร้อมใช้งานจริง: ลบไฟล์นี้ + ลบบล็อก `applyMockFallback()`
 * ใน usePhotoQuest.ts (มีจุดเดียว มีคอมเมนต์กำกับไว้) ไม่มีที่อื่นอ้างถึงอีก
 *
 * ค่าที่ใส่ในแต่ละแถวตรงกับคอลัมน์ของชีตจริงทุกช่อง (Id | Name | Description |
 * Points | Active | DetectionType | Target | Confidence | Provider |
 * ExampleImageUrl) จึงคัดลอกไปวางในชีตเพื่อใช้งานจริงได้ทันที
 */

import type { PhotoQuest } from '~/types/photoQuest'

export const MOCK_PHOTO_QUESTS: PhotoQuest[] = [
  // --- ทำงานได้ออฟไลน์ 100% ตั้งแต่ครั้งแรก (Canvas ล้วน ไม่ต้องโหลดโมเดล) ---
  {
    id: 'PQ-MOCK-001',
    type: 'photo_detection',
    name: 'ท้องฟ้าสดใส',
    description: 'ถ่ายรูปท้องฟ้าให้เห็นสีฟ้าเต็มเฟรม (เงยกล้องขึ้นให้ติดฟ้าเยอะ ๆ)',
    points: 50,
    active: true,
    rule: { detectionType: 'color', target: '#4a90d9', confidence: 0.55 },
    order: 1,
  },
  {
    id: 'PQ-MOCK-002',
    type: 'photo_detection',
    name: 'แสงแดดยามเช้า',
    description: 'ถ่ายรูปกลางแจ้งที่มีแสงสว่างเพียงพอ (ทดสอบง่ายที่สุด ใช้เช็คว่ากล้องทำงานปกติ)',
    points: 30,
    active: true,
    rule: { detectionType: 'image_condition', target: 'min-brightness', confidence: 0.35 },
    order: 2,
  },

  // --- ใช้โมเดล COCO-SSD (ต้องมีเน็ตครั้งแรกครั้งเดียวเพื่อโหลดโมเดล) ---
  {
    id: 'PQ-MOCK-003',
    type: 'photo_detection',
    name: 'ทีมเวิร์กชาวไร่',
    description: 'ถ่ายรูปเพื่อนร่วมทีมให้เห็นตัวเต็ม ๆ อย่างน้อย 1 คน',
    points: 100,
    active: true,
    rule: { detectionType: 'person', target: 'any', confidence: 0.6 },
    order: 3,
  },
  {
    id: 'PQ-MOCK-004',
    type: 'photo_detection',
    name: 'ตามหาเพื่อนสี่ขา',
    description: 'ถ่ายรูปสัตว์ในฟาร์มตัวไหนก็ได้ (วัว แกะ ม้า นก หมา แมว)',
    points: 150,
    active: true,
    rule: { detectionType: 'object', target: 'สัตว์ในฟาร์ม', confidence: 0.5 },
    order: 4,
  },
  {
    id: 'PQ-MOCK-005',
    type: 'photo_detection',
    name: 'มุมสีเขียว',
    description: 'ถ่ายรูปต้นไม้ในกระถางให้เห็นชัด ๆ',
    points: 80,
    active: true,
    rule: { detectionType: 'specific_object', target: 'ต้นไม้', confidence: 0.5 },
    order: 5,
  },
  {
    id: 'PQ-MOCK-006',
    type: 'photo_detection',
    name: 'พกน้ำติดตัวเสมอ',
    description: 'ถ่ายรูปขวดน้ำของคุณ (เควสนี้ทดสอบในร่มได้ ไม่ต้องออกแดด)',
    points: 60,
    active: true,
    rule: { detectionType: 'specific_object', target: 'ขวดน้ำ', confidence: 0.55 },
    order: 6,
  },
]
