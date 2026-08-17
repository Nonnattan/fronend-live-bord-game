/**
 * composables/useOfflineAnswerSync.ts
 * ---------------------------------------------------------------------------
 * คิว Offline สำหรับคำตอบที่ตัดสินบนเครื่องแล้ว แต่ยังไม่ได้ยืนยันกับ
 * Google Sheet — เขียนตามแนวทางเดียวกับ composables/useOfflinePhotoQuestSync.ts
 * (ซึ่งก็อ้างอิงจาก composables/useOfflineSync.ts เดิมอีกที) ทุกประการ แต่เป็น
 * คิว/state แยกต่างหากคนละ LocalStorage key คนละ useState namespace — ไม่แตะ/
 * ไม่เรียกใช้คิวของระบบ Station หรือ Photo Quest เดิมเลย
 *
 * เหตุผลที่แยกคิว: การตัดสินถูก/ผิด (Judge) ทำบนเครื่องเสร็จสมบูรณ์แล้วตั้งแต่
 * ตอน submitAnswerLocal() ใน useQuestion.ts — สิ่งที่ค้างอยู่ในคิวนี้คือ "แจ้ง
 * Backend ว่าคำตอบนี้คืออะไร ถูกหรือผิด" เพียงอย่างเดียว (เพื่อบันทึกคะแนน/
 * ประวัติจริงลงชีต "Answers" — ดู server-gas/QuestionService.gs::actionSubmitAnswer_
 * ซึ่งตัดสินถูก/ผิด "ซ้ำอีกครั้ง" ฝั่ง server จากเฉลยในชีตเสมอ ไม่เชื่อค่าที่ค้างมา
 * จากคิวนี้ตรง ๆ — คิวนี้จึงปลอดภัยแม้ค่า isCorrect ที่เก็บไว้จะคลาดเคลื่อนไปบ้าง)
 */

import type { StationAnswer } from '~/types/question'

const PENDING_KEY = 'answerSync:pendingAnswers'

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

export function useOfflineAnswerSync() {
  const pendingAnswers = useState<StationAnswer[]>('answer-sync-pending', () => [])
  const initialized = useState<boolean>('answer-sync-initialized', () => false)
  const isSyncing = useState<boolean>('answer-sync-syncing', () => false)
  const lastMessage = useState<string>('answer-sync-last-message', () => '')

  const pendingCount = computed(() => pendingAnswers.value.length)
  const hasPending = computed(() => pendingCount.value > 0)

  function initOfflineAnswerSync(): void {
    if (initialized.value) return
    pendingAnswers.value = readJson<StationAnswer[]>(PENDING_KEY, [])
    initialized.value = true
  }

  function persistQueue(next: StationAnswer[]): void {
    pendingAnswers.value = next
    writeJson(PENDING_KEY, next)
  }

  /** เรียกจาก useQuestion.ts ทันทีที่ตัดสินคำตอบบนเครื่องเสร็จ — เก็บลง
   * LocalStorage ก่อนเสมอ ไม่ยิง Backend ตรงนี้ (กันซ้ำด้วย questionId+roundId) */
  function queueAnswer(answer: StationAnswer): void {
    if (
      pendingAnswers.value.some(
        (item) => item.questionId === answer.questionId && item.roundId === answer.roundId,
      )
    ) {
      return
    }
    persistQueue([...pendingAnswers.value, answer])
  }

  /** Sync ขึ้น Backend — เรียกตอนมีเน็ต (ตอนตอบเสร็จทันที ถ้ามีเน็ตอยู่แล้ว หรือ
   * ปุ่ม Sync มือ/auto sync ตอนกลับมามีเน็ตในอนาคต) */
  async function syncNow(userId: string, firstName?: string): Promise<{ success: boolean; syncedCount: number; message: string }> {
    if (!import.meta.client || isSyncing.value) {
      return { success: false, syncedCount: 0, message: 'กำลัง Sync อยู่ หรือไม่ได้อยู่บน client' }
    }
    if (pendingAnswers.value.length === 0) {
      return { success: true, syncedCount: 0, message: 'ไม่มีข้อมูลที่ต้อง Sync' }
    }
    if (!userId) {
      return { success: false, syncedCount: 0, message: 'ยังไม่มีข้อมูลสมาชิก กรุณาเข้าสู่ระบบให้เสร็จสมบูรณ์ก่อน' }
    }

    isSyncing.value = true
    try {
      const { submitAnswer } = useMemberApi()
      const queue = [...pendingAnswers.value]
      const remaining: StationAnswer[] = []
      let syncedCount = 0

      for (const answer of queue) {
        try {
          const res = await submitAnswer({
            userId,
            firstName,
            roundId: answer.roundId ?? undefined,
            stationId: answer.stationId,
            questionId: answer.questionId,
            answer: answer.answer,
            clientId: answer.clientId,
          })
          if (res.success) {
            syncedCount += 1
          } else {
            remaining.push(answer)
          }
        } catch {
          remaining.push(answer)
        }
      }

      persistQueue(remaining)
      const success = remaining.length === 0
      lastMessage.value = success
        ? `Sync สำเร็จ ${syncedCount} คำตอบ`
        : `Sync สำเร็จ ${syncedCount} คำตอบ เหลือ ${remaining.length} คำตอบที่ Sync ไม่สำเร็จ`

      return { success, syncedCount, message: lastMessage.value }
    } finally {
      isSyncing.value = false
    }
  }

  return {
    pendingAnswers: readonly(pendingAnswers),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastMessage: readonly(lastMessage),
    initOfflineAnswerSync,
    queueAnswer,
    syncNow,
  }
}
