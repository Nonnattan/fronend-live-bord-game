/**
 * composables/useStationMissions.ts
 * ---------------------------------------------------------------------------
 * ระบบ "ภารกิจของฐาน" เวอร์ชันจริง — แทนที่ส่วนเนื้อหา/คะแนนของภารกิจที่เคยอยู่ใน
 * composables/useStationQuest.ts (Mock 3 ภารกิจตายตัว ตัดสินเองฝั่ง Client — ถูก
 * ลบไปแล้ว) ไฟล์นี้ไม่รู้จัก/ไม่แตะสิทธิ์เข้าฐาน (currentScanStationId/
 * canEnterStation/consumeScanAccess ยังอยู่ที่ useStationQuest.ts เหมือนเดิม —
 * คนละความรับผิดชอบกัน หน้าที่ต้องใช้ Mission ต้องเรียกทั้งสอง Composable คู่กัน)
 *
 * Flow: pages/station/[stationId].vue เข้าฐาน -> loadStationMissions(stationId,
 * roundId, userId) -> ได้ StationMission[] จริงจาก Backend (จำนวน/ชนิดไม่ตายตัว —
 * ดู types/mission.ts) พร้อม completed/pointsEarned ต่อภารกิจ -> ผู้เล่นทำภารกิจ ->
 * submitSingleQuestion()/submitMultiQuestion()/verifyQrMission() -> อัปเดต State
 * จาก response ของ Backend เท่านั้น (ไม่มีจุดไหนในไฟล์นี้ตัดสิน/คำนวณคะแนนเอง)
 *
 * เขียนตามแนวทางเดียวกับ composables/useQuestion.ts/useStationQuest.ts ทุก
 * ประการ (global state ผ่าน useState + LocalStorage cache ผูกกับ roundKey เสมอ —
 * เปลี่ยนรอบเมื่อไหร่ล้าง Cache ทิ้งหมด กันฐาน/ภารกิจของรอบก่อนปนรอบใหม่) รวมถึง
 * ต้องเรียก initStationMissions() ก่อนเสมอ (เหมือน initStationQuest()/
 * initAnsweredState()) ก่อนอ่าน/เขียนอะไรต่อ — กัน Hard Refresh เห็น Cache ว่างผิด ๆ
 *
 * Offline: ภารกิจ SINGLE_QUESTION/MULTI_QUESTION ยังตอบได้ตอนออฟไลน์ (ตัดสินบน
 * เครื่องก่อนด้วย useQuestion().judgeAnswer() แบบเดียวกับระบบเดิม แล้ว queue ผ่าน
 * composables/useOfflineMissionAnswerSync.ts ไป sync จริงทีหลัง — Backend ตัดสิน
 * ซ้ำอีกครั้งจากเฉลยในชีตเสมอ ไม่เชื่อค่าที่ค้างมาจากคิวตรง ๆ) ส่วนภารกิจ QR_SCORE
 * ต้องมีอินเทอร์เน็ตเสมอ (ไม่มี Offline Fallback — ตรงกับที่ verifyStationQr ก็ไม่มี
 * เหมือนกัน เพราะต้องตรวจสอบ+บันทึกคะแนนจริงกับ Backend ทันที)
 */

import type { StationMission } from '~/types/mission'

const STORAGE_KEY = 'stationMissions:byRound'

interface StoredMissions {
  roundKey: string
  byStation: Record<string, StationMission[]>
}

function readStored(): StoredMissions | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.roundKey === 'string' && parsed.byStation) {
      return parsed as StoredMissions
    }
    return null
  } catch {
    return null
  }
}

function persistStored(data: StoredMissions): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // เพิกเฉย (localStorage เต็ม/Private Browsing) — เหมือนแนวทางเดียวกับ
    // composables/useStationQuest.ts::persistProgress()
  }
}

/** [ใหม่] ล้าง Cache ภารกิจของฐานทั้งหมดทิ้ง (LocalStorage + State ในหน่วยความจำ)
 * — ใช้คู่กับ composables/useStationQuest.ts::clearStationQuestProgress() เสมอ
 * ที่ 2 จุดเดียวกัน: (1) ผู้เล่นกดยืนยันรับรางวัลสำเร็จจริง (pages/
 * reward-received.vue::handleOk()) หรือกด "ติดต่อเจ้าหน้าที่แล้ว" ฝั่ง Offline
 * (pages/round-summary.vue::confirmAndGoHome()), (2) Session หมดอายุเกิน 24 ชม.
 * (composables/useSessionExpiry.ts) ไม่ใช่การ Reset ตามรอบปกติ (นั่นเป็นหน้าที่
 * ของ resetForCurrentRound()/watch(effectiveRoundKey) ในไฟล์นี้อยู่แล้ว) */
export function clearStationMissionsProgress(): void {
  const byStation = useState<Record<string, StationMission[]>>(
    'station-missions-by-station',
    () => ({}),
  )
  const roundKey = useState<string>('station-missions-round-key', () => 'no-round')
  byStation.value = {}
  roundKey.value = 'no-round'
  if (import.meta.client) {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // เพิกเฉย (ดูเหตุผลเดียวกับ persistStored ด้านบน)
    }
  }
}

export function useStationMissions() {
  const byStation = useState<Record<string, StationMission[]>>(
    'station-missions-by-station',
    () => ({}),
  )
  const roundKey = useState<string>('station-missions-round-key', () => 'no-round')
  const initialized = useState<boolean>('station-missions-initialized', () => false)
  const isLoading = useState<boolean>('station-missions-loading', () => false)
  const loadError = useState<string>('station-missions-load-error', () => '')

  const { currentRoundId } = useRound()
  const { isOfflineMode, roundData } = useOfflineMode()

  /** กุญแจของ "รอบปัจจุบัน" — แนวทางเดียวกับ useStationQuest.ts::effectiveRoundKey
   * เป๊ะ ๆ (อ่านอย่างเดียว ไม่เรียกฟังก์ชันเปิด/ปิด Round ใด ๆ จากที่นี่เลย) */
  const effectiveRoundKey = computed<string>(() => {
    if (currentRoundId.value) return `online:${currentRoundId.value}`
    if (isOfflineMode.value && roundData.value?.startedAt) {
      return `offline:${roundData.value.startedAt}`
    }
    return 'no-round'
  })

  function resetForCurrentRound(): void {
    byStation.value = {}
    roundKey.value = effectiveRoundKey.value
    persistStored({ roundKey: roundKey.value, byStation: {} })
  }

  /** เรียกก่อนเสมอทุกหน้าที่ใช้ Mission (เหมือน useStationQuest.ts::
   * initStationQuest()/useQuestion.ts::initAnsweredState()) — restore Cache ของ
   * รอบปัจจุบันจาก LocalStorage (เผื่อ Hard Refresh) ก่อนจะไปเรียก
   * loadStationMissions() ของฐานใดฐานหนึ่งต่อ ไม่มีผลข้างเคียงถ้าเรียกซ้ำ */
  function initStationMissions(): void {
    if (!import.meta.client) return
    const stored = readStored()
    if (stored && stored.roundKey === effectiveRoundKey.value) {
      byStation.value = stored.byStation
    }
    roundKey.value = effectiveRoundKey.value
    initialized.value = true
  }

  // เผื่อกรณี currentRoundId/roundData เพิ่ง resolve เสร็จ "หลัง" initStationMissions()
  // ทำงานไปแล้ว (pattern เดียวกับ useStationQuest.ts/useQuestion.ts กันปัญหา
  // roundId มาช้า) — ไม่รีเซ็ตตอนเปลี่ยนเป็น 'no-round' (รอบเพิ่งจบ ยังไม่มีรอบใหม่
  // เริ่ม) ด้วยเหตุผลเดียวกับ useStationQuest.ts::watch(effectiveRoundKey)
  watch(effectiveRoundKey, (next) => {
    if (!initialized.value || roundKey.value === next) return
    if (next === 'no-round') return
    resetForCurrentRound()
  })

  function getStationMissions(stationId: string): StationMission[] {
    return byStation.value[stationId] ?? []
  }

  function missionProgressCount(stationId: string): number {
    return getStationMissions(stationId).filter((m) => m.completed).length
  }

  /** ฐานนี้ "ทำภารกิจครบทุกใบแล้ว" หรือยัง — false ถ้ายังไม่เคยโหลดภารกิจของฐานนี้
   * เลย (missions.length === 0) กันเข้าใจผิดว่า "ครบแล้ว" ทั้งที่ยังไม่รู้ว่ามี
   * ภารกิจอะไรบ้าง */
  function isStationMissionComplete(stationId: string): boolean {
    const missions = getStationMissions(stationId)
    return missions.length > 0 && missions.every((m) => m.completed)
  }

  /** คะแนนรวมที่ทำได้จริงข้ามทุกฐานที่เคยโหลดภารกิจมาแล้วในรอบนี้ — ใช้แสดงที่
   * pages/home.vue (แทน mockScore เดิม) เป็นผลรวมที่ค่อย ๆ โตขึ้นตามฐานที่ผู้เล่น
   * เข้าไปเล่นจริง (ไม่ต่างจาก mockScore เดิมที่โตขึ้นทีละฐานเหมือนกัน) */
  const totalPointsEarned = computed(() =>
    Object.values(byStation.value).reduce(
      (sum, missions) => sum + missions.reduce((s, m) => s + m.pointsEarned, 0),
      0,
    ),
  )

  function setStationMissions(stationId: string, missions: StationMission[]): void {
    byStation.value = { ...byStation.value, [stationId]: missions }
    persistStored({ roundKey: roundKey.value, byStation: byStation.value })
  }

  function updateMissionFromResult(
    stationId: string,
    missionId: string,
    patch: Partial<Pick<StationMission, 'completed' | 'pointsEarned'>>,
  ): void {
    const missions = getStationMissions(stationId)
    const next = missions.map((m) => (m.id === missionId ? { ...m, ...patch } : m))
    setStationMissions(stationId, next)
  }

  /**
   * โหลดภารกิจของฐานนี้จาก Backend (action 'listStationMissions') — ต้องมี
   * internet เสมอ (ไม่มี Offline Fallback ให้ดึงรายการภารกิจใหม่ — ตรงกับ
   * verifyStationQr/listQuestions ที่ก็ต้องออนไลน์เหมือนกันตอนโหลดครั้งแรก) ยิงไม่
   * สำเร็จ -> ใช้ Cache ล่าสุดที่มีอยู่ต่อไปได้ (คืน true ถ้ามี Cache ให้แสดงอยู่แล้ว)
   * ให้เล่นภารกิจ SINGLE_QUESTION/MULTI_QUESTION ต่อแบบ Offline First ได้ (ภารกิจ
   * QR_SCORE จะกันเองอีกชั้นที่ verifyQrMission เพราะต้องออนไลน์เสมอ)
   */
  async function loadStationMissions(
    stationId: string,
    roundId: string | null,
    userId: string | undefined,
  ): Promise<boolean> {
    if (!import.meta.client) return false

    const { questions, initQuestions } = useQuestion()
    if (questions.value.length === 0) {
      await initQuestions()
    }

    isLoading.value = true
    loadError.value = ''
    try {
      const { listStationMissions } = useMemberApi()
      const res = await listStationMissions(stationId, roundId ?? undefined, userId)
      if (res.success && res.missions) {
        setStationMissions(stationId, res.missions)
        return true
      }
      loadError.value = res.error || 'โหลดภารกิจของฐานนี้ไม่สำเร็จ'
      return getStationMissions(stationId).length > 0
    } catch {
      loadError.value =
        'ไม่สามารถโหลดภารกิจของฐานนี้ได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
      return getStationMissions(stationId).length > 0
    } finally {
      isLoading.value = false
    }
  }

  /** ภารกิจ SINGLE_QUESTION — ตอบ 1 คำถามผ่าน action 'submitAnswer' เดิม (reuse
   * ระบบคำถามจริงทั้งหมด — useQuestion().submitAnswer() ตัดสิน/บันทึก Offline
   * First แล้ว queue ไป sync จริงผ่าน useOfflineAnswerSync.ts อยู่แล้ว) แค่เอาผล
   * ลัพธ์มาอัปเดตสถานะภารกิจต่อ ไม่ตัดสิน/คำนวณคะแนนเองที่นี่เลย */
  function submitSingleQuestion(
    stationId: string,
    mission: StationMission,
    question: import('~/types/question').StationQuestion,
    answerValue: string,
    ctx: { userId: string; firstName?: string; roundId: string | null },
  ) {
    const { submitAnswer } = useQuestion()
    const result = submitAnswer(question, answerValue, ctx)
    updateMissionFromResult(stationId, mission.id, {
      completed: true,
      pointsEarned: result.pointsEarned,
    })
    return result
  }

  /**
   * ภารกิจ MULTI_QUESTION — ตอบหลายคำถามพร้อมกัน ส่งครั้งเดียว ตัดสินบนเครื่อง
   * ก่อนทันที (Offline First เหมือน SINGLE_QUESTION — ใช้ judgeAnswer() ตัวเดียว
   * กับที่ useQuestion.ts ใช้ตัดสิน SINGLE_QUESTION เพื่อให้ผลลัพธ์ตรงกับที่
   * Backend จะตัดสินภายหลังเป๊ะ ๆ) แล้ว queue ไป sync จริงผ่าน
   * useOfflineMissionAnswerSync.ts — คืนผลลัพธ์ (X/N ถูก + คะแนนรวม) ให้ Component
   * แสดงผลได้ทันทีไม่ต้องรอเน็ต
   */
  function submitMultiQuestion(
    stationId: string,
    mission: StationMission,
    answers: Array<{ questionId: string; answer: string }>,
    ctx: { userId: string; firstName?: string; roundId: string | null },
  ) {
    const { judgeAnswer, getQuestionsForMission } = useQuestion()
    const byId = new Map(
      getQuestionsForMission(mission.questionIds ?? []).map((q) => [q.id, q]),
    )

    let correctCount = 0
    let totalPoints = 0
    const perQuestion = answers.map(({ questionId, answer }) => {
      const question = byId.get(questionId)
      if (!question) {
        return { questionId, error: 'ไม่พบคำถามนี้ในเครื่อง กรุณาลองใหม่' }
      }
      const isCorrect = judgeAnswer(question.answerType, answer, question.correctAnswer)
      const pointsEarned = isCorrect ? question.points : 0
      if (isCorrect) correctCount += 1
      totalPoints += pointsEarned
      return { questionId, isCorrect, pointsEarned, alreadyAnswered: false }
    })

    updateMissionFromResult(stationId, mission.id, {
      completed: true,
      pointsEarned: totalPoints,
    })

    const { queueMissionAnswers } = useOfflineMissionAnswerSync()
    queueMissionAnswers({
      stationId,
      missionId: mission.id,
      roundId: ctx.roundId,
      userId: ctx.userId,
      firstName: ctx.firstName,
      answers: answers.map((a) => ({ ...a })),
    })

    return {
      missionId: mission.id,
      correctCount,
      totalCount: answers.length,
      totalPoints,
      perQuestion,
    }
  }

  /**
   * ภารกิจ QR_SCORE — ตรวจสอบ QR ของภารกิจ (คนละ QR/handler กับ verifyStationQr
   * เด็ดขาด — ดู types/mission.ts) ต้องมีอินเทอร์เน็ตเสมอ ไม่มี Offline Fallback
   * (เหมือน verifyStationQr) ผ่านแล้ว Backend ให้คะแนนจริงทันที — ที่นี่แค่รับผล
   * มาอัปเดตสถานะภารกิจต่อ ไม่ถือว่าสำเร็จ/ได้คะแนนเองก่อนได้รับคำตอบจาก Backend
   */
  async function verifyQrMission(
    stationId: string,
    mission: StationMission,
    qrToken: string,
    ctx: { userId: string; firstName?: string; roundId: string },
  ): Promise<{ success: boolean; pointsEarned: number; error?: string }> {
    const { verifyMissionQr } = useMemberApi()
    try {
      const res = await verifyMissionQr({
        qrToken,
        stationId,
        missionId: mission.id,
        roundId: ctx.roundId,
        userId: ctx.userId,
        firstName: ctx.firstName,
      })
      if (!res.success) {
        return { success: false, pointsEarned: 0, error: res.error || 'QR ภารกิจนี้ไม่ถูกต้อง' }
      }
      const pointsEarned = res.pointsEarned ?? 0
      updateMissionFromResult(stationId, mission.id, { completed: true, pointsEarned })
      return { success: true, pointsEarned }
    } catch (err) {
      return {
        success: false,
        pointsEarned: 0,
        error:
          err instanceof Error
            ? err.message
            : 'ตรวจสอบ QR กับระบบไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
      }
    }
  }

  return {
    isLoading: readonly(isLoading),
    loadError: readonly(loadError),
    totalPointsEarned,
    getStationMissions,
    missionProgressCount,
    isStationMissionComplete,
    initStationMissions,
    loadStationMissions,
    submitSingleQuestion,
    submitMultiQuestion,
    verifyQrMission,
  }
}
