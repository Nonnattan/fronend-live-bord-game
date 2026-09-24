/**
 * composables/useOfflinePhotoQuestSync.ts
 * ---------------------------------------------------------------------------
 * คิว Offline สำหรับผลลัพธ์ Photo Quest ที่ "ผ่านแล้ว" แต่ยังไม่ได้ยืนยันกับ
 * Google Sheet — เขียนตามแนวทางเดียวกับ composables/useOfflineSync.ts (ระบบ
 * Station เดิม) ทุกประการ แต่เป็นคิว/state แยกต่างหากคนละ LocalStorage key
 * คนละ useState namespace — ไม่แตะ/ไม่เรียกใช้ pendingCheckins ของระบบเดิมเลย
 *
 * เหตุผลที่แยกคิว: การตรวจจับภาพ (Detection) ทำบนเครื่องเสร็จสมบูรณ์แล้วตั้งแต่
 * ตอน attemptQuest() ใน usePhotoQuest.ts — สิ่งที่ค้างอยู่ในคิวนี้คือ "แจ้ง
 * Backend ว่าเควสนี้ทำสำเร็จแล้ว" เพียงอย่างเดียว (เพื่อบันทึกคะแนน/ประวัติ)
 * ไม่ใช่ตัว Detection เอง
 */

import type { PhotoQuestAttempt } from '~/types/photoQuest'

const PENDING_KEY = 'photoQuestSync:pendingAttempts'

function readJson<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  if (!import.meta.client) return
  localStorage.setItem(key, JSON.stringify(value))
}

export function useOfflinePhotoQuestSync() {
  const pendingAttempts = useState<PhotoQuestAttempt[]>('photo-quest-sync-pending', () => [])
  const initialized = useState<boolean>('photo-quest-sync-initialized', () => false)
  const isSyncing = useState<boolean>('photo-quest-sync-syncing', () => false)
  const lastMessage = useState<string>('photo-quest-sync-last-message', () => '')

  const pendingCount = computed(() => pendingAttempts.value.length)
  const hasPending = computed(() => pendingCount.value > 0)

  function initOfflinePhotoQuestSync(): void {
    if (initialized.value) return
    pendingAttempts.value = readJson<PhotoQuestAttempt[]>(PENDING_KEY, [])
    initialized.value = true
  }

  function persistQueue(next: PhotoQuestAttempt[]): void {
    pendingAttempts.value = next
    writeJson(PENDING_KEY, next)
  }

  /** เรียกจาก usePhotoQuest.ts ทันทีที่ตรวจจับผ่าน — เก็บลง LocalStorage ก่อน
   * เสมอ ไม่ยิง Backend ตรงนี้ */
  function queuePhotoQuestAttempt(attempt: PhotoQuestAttempt): void {
    if (pendingAttempts.value.some((item) => item.questId === attempt.questId)) return
    persistQueue([...pendingAttempts.value, attempt])
  }

  /** Sync ขึ้น Backend — เรียกตอนมีเน็ต (จากปุ่ม Sync เองในหน้า list หรือ auto
   * sync ตอนกลับมามีเน็ต ถ้าต้องการเพิ่ม plugin แยกภายหลังแบบ
   * plugins/offline-sync.client.ts ของเดิม) */
  async function syncNow(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    if (!import.meta.client || isSyncing.value) {
      return { success: false, syncedCount: 0, message: 'กำลัง Sync อยู่ หรือไม่ได้อยู่บน client' }
    }
    if (pendingAttempts.value.length === 0) {
      return { success: true, syncedCount: 0, message: 'ไม่มีข้อมูลที่ต้อง Sync' }
    }

    isSyncing.value = true
    try {
      const { profile } = useProfile()
      const memberId = profile.value?.memberId
      if (!memberId) {
        return { success: false, syncedCount: 0, message: 'ยังไม่มีข้อมูลสมาชิก กรุณาเข้าสู่ระบบให้เสร็จสมบูรณ์ก่อน' }
      }

      const { completePhotoQuest } = useMemberApi()
      const queue = [...pendingAttempts.value]
      const remaining: PhotoQuestAttempt[] = []
      let syncedCount = 0

      for (const attempt of queue) {
        try {
          const res = await completePhotoQuest({
            userId: memberId,
            questId: attempt.questId,
            points: attempt.points,
            confidence: attempt.result.confidence,
            clientId: attempt.clientId,
          })
          if (res.success) {
            syncedCount += 1
          } else {
            remaining.push(attempt)
          }
        } catch {
          remaining.push(attempt)
        }
      }

      persistQueue(remaining)
      const success = remaining.length === 0
      lastMessage.value = success
        ? `Sync สำเร็จ ${syncedCount} เควส`
        : `Sync สำเร็จ ${syncedCount} เควส เหลือ ${remaining.length} เควสที่ Sync ไม่สำเร็จ`

      return { success, syncedCount, message: lastMessage.value }
    } finally {
      isSyncing.value = false
    }
  }

  return {
    pendingAttempts: readonly(pendingAttempts),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastMessage: readonly(lastMessage),
    initOfflinePhotoQuestSync,
    queuePhotoQuestAttempt,
    syncNow,
  }
}
