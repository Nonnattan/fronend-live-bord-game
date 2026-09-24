/**
 * composables/usePhotoQuest.ts
 * ---------------------------------------------------------------------------
 * Orchestrator ของระบบ Photo Detection Quest — ทำหน้าที่คล้าย useAdventure.ts/
 * useStations.ts (global state ผ่าน useState + localStorage) แต่แยกเป็นระบบ
 * ของตัวเองทั้งหมด ไม่แตะ/ไม่เรียกใช้ useAdventure, useOfflineSync, useRound
 * ของระบบ Station-QR เดิมเลยสักฟังก์ชัน — เป็นระบบขนานตามสถาปัตยกรรมที่ตกลงกันไว้
 *
 * หน้าที่:
 * 1) โหลดรายการ Photo Quest จาก Backend (listPhotoQuests) — ไม่ hard-code เควส
 *    ใด ๆ ไว้ในโค้ดเลย
 * 2) เก็บสถานะ "เควสไหนทำสำเร็จแล้วบ้างในรอบนี้" ไว้ที่ LocalStorage
 *    (Offline First เหมือนระบบเดิมทุกจุด)
 * 3) รับรูปที่ถ่ายมา -> ส่งเข้า Detection Engine -> ถ้าผ่าน บันทึกผล + คิวไว้ Sync
 */

import type { PhotoQuest, PhotoQuestAttempt, DetectionResult } from '~/types/photoQuest'
import { runDetection } from '~/services/detection/detectionEngine'
import { isDetectionAvailableOffline } from '~/services/detection/detectionEngine'
import { initDetectionCapabilities, preloadObjectDetectionModel } from '~/services/detection/detectionEngine'
import { MOCK_PHOTO_QUESTS } from '~/services/photoQuestMockData'

const STORAGE_KEY = 'photoQuestCompletedIds'

/** detectionType ที่ต้องใช้โมเดล AI (ต้องโหลดไฟล์โมเดลครั้งแรกตอนออนไลน์) —
 * ใช้ตัดสินใจว่าควร Preload โมเดลไว้ล่วงหน้าไหม ดู initPhotoQuest() */
const MODEL_BACKED_TYPES = new Set(['object', 'specific_object', 'person'])

export function usePhotoQuest() {
  const quests = useState<PhotoQuest[]>('photo-quest-list', () => [])
  const completedIds = useState<string[]>('photo-quest-completed', () => [])
  const isLoadingQuests = useState<boolean>('photo-quest-loading', () => false)
  const loadError = useState<string>('photo-quest-load-error', () => '')
  /** true = กำลังแสดงเควสตัวอย่าง (Mock) เพราะยังไม่มีข้อมูลจริงจากชีต
   * — หน้า UI เอาไปขึ้นป้ายเตือนได้ ไม่ให้เข้าใจผิดว่าเป็นเควสจริง */
  const usingMockData = useState<boolean>('photo-quest-using-mock', () => false)

  const completedCount = computed(() => completedIds.value.length)
  const totalQuests = computed(() => quests.value.filter((q) => q.active).length)

  function getStoredCompleted(): string[] {
    if (!import.meta.client) return []
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
  }

  function persistCompleted(next: string[]): void {
    completedIds.value = next
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }

  function isCompleted(questId: string): boolean {
    return completedIds.value.includes(questId)
  }

  /** เรียกตอน mounted ของหน้า list — โหลดทั้งสถานะที่ทำไปแล้ว (LocalStorage) และ
   * รายการเควสจาก Backend (ถ้ามีเน็ต) ไม่บล็อกกันเอง (โหลด LocalStorage ก่อนเสมอ
   * เพื่อให้หน้าเปิดใช้งานได้ทันทีแม้ไม่มีเน็ต) */
  async function initPhotoQuest(): Promise<void> {
    completedIds.value = getStoredCompleted()

    if (!import.meta.client) return
    isLoadingQuests.value = true
    loadError.value = ''
    try {
      const { listPhotoQuests } = useMemberApi()
      const res = await listPhotoQuests()
      if (res.success && res.quests) {
        quests.value = res.quests
      } else {
        loadError.value = res.error || 'โหลดรายการเควสไม่สำเร็จ'
      }
    } catch {
      // ไม่มีเน็ต/API ล่ม — ปล่อยให้ quests.value ว่างหรือใช้ค่าที่เคยโหลดไว้ก่อนหน้า
      // (ไม่ throw ทำหน้าพัง เหมือนระบบอื่นในแอปนี้ที่เป็น Offline First ทั้งหมด)
      loadError.value = 'ไม่สามารถโหลดรายการเควสได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
    } finally {
      isLoadingQuests.value = false
    }

    // ---- [ชั่วคราว — ช่วงพัฒนา] เควสตัวอย่างเมื่อยังไม่มีข้อมูลจริง ----
    // ลบทั้งบล็อกนี้ + ไฟล์ services/photoQuestMockData.ts ได้เลยเมื่อชีต
    // "PhotoQuests" มีข้อมูลจริงแล้ว (ไม่มีที่อื่นอ้างถึงอีก)
    applyMockFallback()

    // เช็คว่าไฟล์โมเดลอยู่ใน Cache แล้วหรือยัง เพื่อให้ canPlayOffline() ตอบตรงจริง
    await initDetectionCapabilities()

    // Preload โมเดลไว้ล่วงหน้าตอนที่ยัง "ออนไลน์" อยู่ (ไม่ await — ไม่บล็อกการ
    // แสดงผลหน้ารายการเควส) เพื่อให้ผู้เล่นไม่ต้องมานั่งรอโหลดโมเดล ~6 MB
    // ตอนกดถ่ายรูปจริงกลางแปลงที่สัญญาณอาจหายไปแล้ว — ทำเฉพาะเมื่อมีเควสที่
    // ต้องใช้โมเดลจริงเท่านั้น (เควส color/image_condition ไม่ต้องโหลดอะไรเลย)
    const needsModel = quests.value.some(
      (q) => q.active && MODEL_BACKED_TYPES.has(q.rule.detectionType),
    )
    if (needsModel && navigator.onLine) {
      void preloadObjectDetectionModel()
    }
  }

  /** ใช้เควสตัวอย่างก็ต่อเมื่อไม่ได้เควสจริงมาเลยสักตัว — ข้อมูลจริงชนะเสมอ */
  function applyMockFallback(): void {
    if (quests.value.length > 0) {
      usingMockData.value = false
      return
    }
    quests.value = MOCK_PHOTO_QUESTS
    usingMockData.value = true
    loadError.value = ''
  }

  function findQuest(questId: string): PhotoQuest | undefined {
    return quests.value.find((q) => q.id === questId)
  }

  /** true = เควสนี้ทำได้ตอนไม่มีเน็ต (ทั้งฝั่ง detection เองต้องทำ offline ได้
   * — การ "ยืนยันสำเร็จ" กับ Backend ค่อยไป sync ทีหลังผ่าน useOfflinePhotoQuestSync) */
  function canPlayOffline(quest: PhotoQuest): boolean {
    return isDetectionAvailableOffline(quest.rule.detectionType, quest.rule.provider)
  }

  /**
   * รับรูปที่ถ่ายมา (HTMLImageElement/ImageBitmap) ของเควสที่ระบุ -> ส่งเข้า
   * Detection Engine -> ถ้าผ่าน บันทึกลง LocalStorage + คิว sync ทันที
   * คืนค่า DetectionResult เสมอ (ไม่ throw) ให้หน้า UI ไปแสดงผล/ให้ถ่ายใหม่เอง
   */
  async function attemptQuest(
    quest: PhotoQuest,
    image: HTMLImageElement | ImageBitmap,
  ): Promise<DetectionResult> {
    const result = await runDetection({ image, rule: quest.rule })

    if (result.passed && !isCompleted(quest.id)) {
      persistCompleted([...completedIds.value, quest.id])

      const attempt: PhotoQuestAttempt = {
        clientId:
          import.meta.client && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        questId: quest.id,
        questName: quest.name,
        points: quest.points,
        result,
        attemptedAt: Date.now(),
        synced: false,
      }

      const { queuePhotoQuestAttempt } = useOfflinePhotoQuestSync()
      queuePhotoQuestAttempt(attempt)
    }

    return result
  }

  return {
    quests: readonly(quests),
    completedIds: readonly(completedIds),
    completedCount,
    totalQuests,
    isLoadingQuests: readonly(isLoadingQuests),
    loadError: readonly(loadError),
    usingMockData: readonly(usingMockData),
    initPhotoQuest,
    findQuest,
    isCompleted,
    canPlayOffline,
    attemptQuest,
  }
}
