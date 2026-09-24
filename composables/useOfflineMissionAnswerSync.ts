/**
 * composables/useOfflineMissionAnswerSync.ts
 * ---------------------------------------------------------------------------
 * คิว Offline สำหรับคำตอบภารกิจ MULTI_QUESTION (ตอบหลายคำถามพร้อมกัน ส่งครั้ง
 * เดียวผ่าน action 'submitMissionAnswers') ที่ตัดสินบนเครื่องแล้ว แต่ยังไม่ได้
 * ยืนยันกับ Google Sheet — เขียนตามแนวทางเดียวกับ
 * composables/useOfflineAnswerSync.ts (คิวของภารกิจ SINGLE_QUESTION ผ่าน
 * 'submitAnswer') ทุกประการ แต่เป็นคิว/state แยกต่างหากคนละ LocalStorage key คนละ
 * useState namespace — ไม่แตะ/ไม่เรียกใช้คิวของระบบ Question เดิมเลย
 *
 * เหตุผลที่แยกคิว: การตัดสินถูก/ผิด (Judge) ของทุกคำถามในภารกิจนี้ทำบนเครื่องเสร็จ
 * สมบูรณ์แล้วตั้งแต่ตอน useStationMissions.ts::submitMultiQuestion() สิ่งที่ค้าง
 * อยู่ในคิวนี้คือ "แจ้ง Backend ว่าภารกิจนี้ตอบไปแล้วทั้งชุด คำตอบคืออะไรบ้าง"
 * เพียงอย่างเดียว (เพื่อบันทึกคะแนน/ประวัติจริงลงชีต "Answers" — ดู
 * server-gas/MissionsService.gs::actionSubmitMissionAnswers_ ซึ่งตัดสินถูก/ผิด
 * "ซ้ำอีกครั้ง" ฝั่ง server จากเฉลยในชีตเสมอ ไม่เชื่อค่าที่ค้างมาจากคิวนี้ตรง ๆ)
 */

export interface PendingMissionAnswerBatch {
  clientBatchId: string
  stationId: string
  missionId: string
  roundId: string | null
  userId: string
  firstName?: string
  answers: Array<{ questionId: string; answer: string; clientId?: string }>
  queuedAt: number
}

const PENDING_KEY = 'missionAnswerSync:pendingBatches'

function genUuid(): string {
  if (import.meta.client && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

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

export function useOfflineMissionAnswerSync() {
  const pendingBatches = useState<PendingMissionAnswerBatch[]>('mission-answer-sync-pending', () => [])
  const initialized = useState<boolean>('mission-answer-sync-initialized', () => false)
  const isSyncing = useState<boolean>('mission-answer-sync-syncing', () => false)
  const lastMessage = useState<string>('mission-answer-sync-last-message', () => '')

  const pendingCount = computed(() => pendingBatches.value.length)
  const hasPending = computed(() => pendingCount.value > 0)

  function initOfflineMissionAnswerSync(): void {
    if (initialized.value) return
    pendingBatches.value = readJson<PendingMissionAnswerBatch[]>(PENDING_KEY, [])
    initialized.value = true
  }

  function persistQueue(next: PendingMissionAnswerBatch[]): void {
    pendingBatches.value = next
    writeJson(PENDING_KEY, next)
  }

  /** เรียกจาก useStationMissions.ts::submitMultiQuestion() ทันทีที่ตัดสินคำตอบ
   * ทั้งชุดบนเครื่องเสร็จ — เก็บลง LocalStorage ก่อนเสมอ ไม่ยิง Backend ตรงนี้
   * (กันคิวซ้ำด้วย missionId+roundId — ภารกิจนี้ตอบได้ครั้งเดียวต่อรอบอยู่แล้ว) */
  function queueMissionAnswers(
    batch: Omit<PendingMissionAnswerBatch, 'clientBatchId' | 'queuedAt'>,
  ): void {
    if (
      pendingBatches.value.some(
        (item) => item.missionId === batch.missionId && item.roundId === batch.roundId,
      )
    ) {
      return
    }
    persistQueue([
      ...pendingBatches.value,
      { ...batch, clientBatchId: genUuid(), queuedAt: Date.now() },
    ])
  }

  /** Sync ขึ้น Google Sheet จริง — เรียกตอนมีเน็ต (ตอบเสร็จทันทีถ้ามีเน็ตอยู่แล้ว
   * หรือปุ่ม Sync มือ/auto sync ตอนกลับมามีเน็ตในอนาคต) */
  async function syncNow(): Promise<{ success: boolean; syncedCount: number; message: string }> {
    if (!import.meta.client || isSyncing.value) {
      return { success: false, syncedCount: 0, message: 'กำลัง Sync อยู่ หรือไม่ได้อยู่บน client' }
    }
    if (pendingBatches.value.length === 0) {
      return { success: true, syncedCount: 0, message: 'ไม่มีข้อมูลที่ต้อง Sync' }
    }

    isSyncing.value = true
    try {
      const { submitMissionAnswers } = useMemberApi()
      const queue = [...pendingBatches.value]
      const remaining: PendingMissionAnswerBatch[] = []
      let syncedCount = 0

      for (const batch of queue) {
        try {
          const res = await submitMissionAnswers({
            userId: batch.userId,
            firstName: batch.firstName,
            roundId: batch.roundId ?? undefined,
            stationId: batch.stationId,
            missionId: batch.missionId,
            answers: batch.answers,
          })
          if (res.success) {
            syncedCount += 1
          } else {
            remaining.push(batch)
          }
        } catch {
          remaining.push(batch)
        }
      }

      persistQueue(remaining)
      const success = remaining.length === 0
      lastMessage.value = success
        ? `Sync สำเร็จ ${syncedCount} ภารกิจ`
        : `Sync สำเร็จ ${syncedCount} ภารกิจ เหลือ ${remaining.length} ภารกิจที่ Sync ไม่สำเร็จ`

      return { success, syncedCount, message: lastMessage.value }
    } finally {
      isSyncing.value = false
    }
  }

  return {
    pendingBatches: readonly(pendingBatches),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastMessage: readonly(lastMessage),
    initOfflineMissionAnswerSync,
    queueMissionAnswers,
    syncNow,
  }
}
