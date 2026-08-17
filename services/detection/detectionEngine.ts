/**
 * services/detection/detectionEngine.ts
 * ---------------------------------------------------------------------------
 * จุดศูนย์กลางเดียวของระบบ Photo Detection — "ไม่รู้จัก" tree/flower/หรือ
 * detectionType เฉพาะเจาะจงใด ๆ เลย รู้แค่ว่ามี provider อะไรลงทะเบียนไว้บ้าง
 * แล้ว dispatch ไปตาม rule.detectionType (หรือ rule.provider ถ้าระบุมาตรง ๆ)
 *
 * เพิ่ม Detection Type ใหม่ในอนาคต = เขียน provider ใหม่ 1 ไฟล์ใน
 * services/detection/providers/ ที่ทำตาม DetectionProvider interface แล้ว
 * เพิ่มเข้า PROVIDERS ด้านล่าง 1 บรรทัด — ไม่ต้องแก้ไฟล์นี้ส่วนอื่นเลย ไม่ต้อง
 * แก้ usePhotoQuest.ts, ไม่ต้องแก้หน้า UI ใด ๆ ทั้งสิ้น
 */

import type { DetectionProvider, DetectionInput } from './types'
import type { DetectionResult } from '~/types/photoQuest'
import { colorProvider } from './providers/colorProvider'
import { cocoSsdProvider, preloadObjectDetectionModel, refreshOfflineCapability } from './providers/cocoSsdProvider'
import { objectDetectionProvider } from './providers/objectDetectionProvider'

/** รายชื่อ Provider ที่ระบบรู้จักทั้งหมด — เพิ่ม/เอาออกที่นี่จุดเดียว
 *
 * ลำดับมีความหมาย: `findProvider()` ใช้ตัวแรกที่ `supports` ตรงกับ detectionType
 * — `cocoSsdProvider` (Phase 2, ตรวจจับจริง) จึงต้องมาก่อน `objectDetectionProvider`
 * (stub เดิมของ Phase 1) เสมอ ส่วน stub ยังคงอยู่ในลิสต์เพื่อให้เรียกใช้ได้ถ้า
 * ระบุ `provider: 'object-detection-stub-v1'` ตรง ๆ ในชีต PhotoQuests
 * (เช่น อยากปิดการตรวจจับจริงชั่วคราวโดยไม่ต้อง deploy โค้ดใหม่) */
const PROVIDERS: DetectionProvider[] = [colorProvider, cocoSsdProvider, objectDetectionProvider]

/** โหลดโมเดล Object Detection ล่วงหน้าตอนที่ยังออนไลน์อยู่ — re-export ไว้ที่นี่
 * เพื่อให้ฝั่ง UI เรียกผ่าน Engine จุดเดียวเหมือนเดิม ไม่ต้อง import ทะลุถึง
 * provider ตรง ๆ (ถ้าอนาคตเปลี่ยนไปใช้ MediaPipe ก็แก้ที่ไฟล์นี้ไฟล์เดียว) */
export { preloadObjectDetectionModel }

/** เช็คสถานะ Cache ของโมเดลอีกครั้ง แล้วอัปเดตค่า isOfflineCapable ให้ตรงจริง —
 * เรียกตอน mounted ของหน้ารายการเควสก็พอ (ดู pages/photo-quest.vue) */
export async function initDetectionCapabilities(): Promise<void> {
  await refreshOfflineCapability()
}

function findProvider(detectionType: string, explicitProviderId?: string): DetectionProvider | null {
  if (explicitProviderId) {
    return PROVIDERS.find((p) => p.id === explicitProviderId) ?? null
  }
  return PROVIDERS.find((p) => p.supports.includes(detectionType)) ?? null
}

/** true = มี provider ที่รองรับ detectionType นี้ และ provider นั้นทำงาน
 * offline ได้ — ใช้ตัดสินใจฝั่ง UI ว่าควรอนุญาตให้ทำเควสนี้ตอนไม่มีเน็ตไหม */
export function isDetectionAvailableOffline(detectionType: string, providerId?: string): boolean {
  const provider = findProvider(detectionType, providerId)
  return !!provider && provider.isOfflineCapable
}

export function isDetectionTypeSupported(detectionType: string, providerId?: string): boolean {
  return !!findProvider(detectionType, providerId)
}

/**
 * รันการตรวจจับ 1 ครั้งตาม DetectionRule ที่ระบุ — ฟังก์ชันเดียวที่
 * composables/usePhotoQuest.ts ต้องรู้จัก ไม่ต้องรู้เรื่อง provider ภายในเลย
 */
export async function runDetection(input: DetectionInput): Promise<DetectionResult> {
  const provider = findProvider(input.rule.detectionType, input.rule.provider)

  if (!provider) {
    return {
      passed: false,
      confidence: 0,
      reason: `ไม่พบ Detection Provider ที่รองรับ detectionType="${input.rule.detectionType}"`,
      providerId: 'none',
    }
  }

  try {
    return await provider.detect(input)
  } catch (err) {
    return {
      passed: false,
      confidence: 0,
      reason: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดระหว่างตรวจสอบภาพ กรุณาลองใหม่อีกครั้ง',
      providerId: provider.id,
    }
  }
}
