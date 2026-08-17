/**
 * composables/useQuestion.ts
 * ---------------------------------------------------------------------------
 * Orchestrator ของระบบ "ภารกิจ + คำถามประจำฐาน (เผ่า)" ตาม Flow ใหม่:
 *
 *   Scan QR เข้าฐาน -> แสดงภารกิจของฐานนั้น -> ลูกค้าปฏิบัติตามภารกิจ ->
 *   ตอบคำถามบนระบบ (1 คำถาม 1 คำตอบ) -> ถูก = ได้คะแนน / ผิด = ไม่ได้คะแนน
 *
 * เขียนตามแนวทางเดียวกับ composables/usePhotoQuest.ts ทุกประการ (global state
 * ผ่าน useState + LocalStorage, Offline First, mock fallback ตอนชีตยังว่าง)
 * แต่เป็นระบบขนานของตัวเอง — ไม่แตะ/ไม่เรียกใช้ useAdventure/useOfflineSync/
 * useRound ของระบบ Station-QR เดิมเลยสักฟังก์ชัน (อ่านค่าจากมันได้ แต่ไม่แก้)
 *
 * กติกาที่ตกลงกันไว้:
 * - คะแนนได้ "ทั้ง" ตอนสแกนเข้าฐาน (ระบบเดิม) "และ" ตอนตอบคำถามถูก (ระบบนี้)
 *   แยกกันคนละก้อน — ดู totalQuestionPoints ด้านล่าง ผู้เรียกใช้ (หน้า UI) เป็น
 *   คนรวมกับ useAdventure().totalPoint เอาเองตอนแสดงผล (ไม่ไปแก้ totalPoint
 *   เดิมใน useAdventure.ts เพื่อไม่ให้กระทบ logic ที่ละเอียดอ่อนมากอยู่แล้ว)
 * - ตอบได้ครั้งเดียวต่อ 1 คำถามต่อ 1 รอบ ผิดแล้วผิดเลย (ดู isStationAnswered)
 * - ตัดสินถูก/ผิด "บนเครื่อง" ทันที (Offline First) แล้วค่อย queue ไป sync จริง
 *   ผ่าน useOfflineAnswerSync.ts — server-gas ตัดสินซ้ำอีกครั้งจากเฉลยในชีตเสมอ
 *   (ไม่เชื่อค่าที่ client ส่งไปตรง ๆ) ดูเหตุผลเต็มที่ types/question.ts
 */

import type { StationQuestion, StationAnswer, AnswerType } from '~/types/question'
import { MOCK_STATION_QUESTIONS } from '~/services/questionMockData'

const ANSWERED_STORAGE_KEY = 'questionAnswered:byRound'

interface StoredAnswered {
  roundId: string | null
  answers: StationAnswer[]
}

function readStoredAnswered(): StoredAnswered | null {
  if (!import.meta.client) return null
  const raw = localStorage.getItem(ANSWERED_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.answers)) return parsed as StoredAnswered
    return null
  } catch {
    localStorage.removeItem(ANSWERED_STORAGE_KEY)
    return null
  }
}

function persistAnswered(data: StoredAnswered): void {
  if (import.meta.client) {
    localStorage.setItem(ANSWERED_STORAGE_KEY, JSON.stringify(data))
  }
}

function genClientId(): string {
  if (import.meta.client && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** ตัดสินถูก/ผิดบนเครื่อง — normalize ทั้งสองฝั่งก่อนเสมอ (ตัดช่องว่าง/ตัวพิมพ์
 * เล็กใหญ่) ให้ตรงกับ isAnswerCorrect_() ฝั่ง server-gas/QuestionService.gs
 * ทุกประการ (ผลลัพธ์ที่แสดงผลทันทีตอนออฟไลน์ต้องตรงกับที่ server จะตัดสินภายหลัง) */
function judgeAnswer(answerType: AnswerType, given: string, expected: string): boolean {
  const g = given.trim().toLowerCase()
  const e = expected.trim().toLowerCase()
  if (!e) return false

  if (answerType === 'number') {
    const gn = Number(g.replace(/[^\d.-]/g, ''))
    const en = Number(e.replace(/[^\d.-]/g, ''))
    if (Number.isNaN(gn) || Number.isNaN(en)) return false
    return gn === en
  }

  return g === e
}

export function useQuestion() {
  const questions = useState<StationQuestion[]>('question-list', () => [])
  const answeredList = useState<StationAnswer[]>('question-answered', () => [])
  const answeredRoundId = useState<string | null>('question-answered-round-id', () => null)
  const isLoadingQuestions = useState<boolean>('question-loading', () => false)
  const loadError = useState<string>('question-load-error', () => '')
  /** true = กำลังแสดงคำถามตัวอย่าง (Mock) เพราะยังไม่มีข้อมูลจริงจากชีต —
   * หน้า UI เอาไปขึ้นป้ายเตือนได้ (แนวทางเดียวกับ usePhotoQuest.ts) */
  const usingMockData = useState<boolean>('question-using-mock', () => false)

  const totalQuestionPoints = computed(() =>
    answeredList.value.reduce((sum, a) => sum + a.pointsEarned, 0),
  )
  const totalCorrect = computed(() => answeredList.value.filter((a) => a.isCorrect).length)

  /** เรียกตอน mounted ของหน้า Map/Scan (ครั้งเดียวพอ ก่อนเริ่มเดินเล่น) — โหลด
   * คำถามทั้งหมดของทุกฐานมา cache ไว้ล่วงหน้า เพื่อให้ตอบคำถามได้แม้สัญญาณหลุด
   * กลางแปลง (ไม่ต้องรอโหลดทีละฐานตอนสแกน) */
  async function initQuestions(): Promise<void> {
    if (!import.meta.client) return
    isLoadingQuestions.value = true
    loadError.value = ''
    try {
      const { listQuestions } = useMemberApi()
      const res = await listQuestions()
      if (res.success && res.questions) {
        questions.value = res.questions
      } else {
        loadError.value = res.error || 'โหลดรายการคำถามไม่สำเร็จ'
      }
    } catch {
      // ไม่มีเน็ต/API ล่ม — ปล่อยให้ questions.value ว่างหรือใช้ค่าที่เคยโหลดไว้ก่อนหน้า
      loadError.value = 'ไม่สามารถโหลดรายการคำถามได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
    } finally {
      isLoadingQuestions.value = false
    }

    // ---- [ชั่วคราว — ช่วงพัฒนา] คำถามตัวอย่างเมื่อยังไม่มีข้อมูลจริง ----
    // ลบทั้งบล็อกนี้ + ไฟล์ services/questionMockData.ts ได้เลยเมื่อชีต
    // "Questions" มีข้อมูลจริงแล้ว (ไม่มีที่อื่นอ้างถึงอีก)
    applyMockFallback()
  }

  /** ใช้คำถามตัวอย่างก็ต่อเมื่อไม่ได้คำถามจริงมาเลยสักข้อ — ข้อมูลจริงชนะเสมอ */
  function applyMockFallback(): void {
    if (questions.value.length > 0) {
      usingMockData.value = false
      return
    }
    questions.value = MOCK_STATION_QUESTIONS
    usingMockData.value = true
    loadError.value = ''
  }

  /**
   * โหลดสถานะ "ตอบไปแล้วบ้าง" ของรอบปัจจุบัน — เรียกคู่กับ initQuestions() เสมอ
   * ต้องรู้ roundId ก่อน (จาก useRound().currentRoundId) เพื่อเทียบว่าของที่ค้าง
   * อยู่ใน LocalStorage เป็นของรอบนี้จริงหรือของรอบเก่า (แนวทางเดียวกับ
   * useAdventure.ts::visitedRoundId — กันคำตอบรอบเก่าค้างข้ามมารอบใหม่)
   *
   * [Fix — บั๊กคะแนนคำถามหายตอนถึงหน้าสรุปผล] เดิม roundId ไม่ตรงกัน = ล้าง
   * answeredList ทิ้งทันทีเสมอ — แต่ถ้าฐานแรกของรอบถูกสแกนตอน ensureRoundStarted()
   * (pages/scan.vue) ยังไม่ resolve roundId จริง (เน็ตมือถือกลางแปลงหลุด/ช้า)
   * initAnsweredState(null) จะถูกเรียกก่อน แล้วคำตอบฐานแรกถูก persist ด้วย
   * roundId: null ไปก่อน — พอฐานถัดไปเรียกซ้ำด้วย roundId จริงที่เพิ่ง resolve ได้
   * (ไม่ใช่ null แล้ว) จะเจอว่า "ไม่ตรงกับที่เคย persist ไว้ (null)" ทั้งที่เป็นรอบ
   * เดียวกันอยู่ ทำให้คำตอบ/คะแนนของฐานแรกหายไปทันที
   *
   * แก้โดยเพิ่มเงื่อนไข: roundId เดิมที่เคย persist ไว้เป็น null แต่ roundId ใหม่ที่
   * ได้ตอนนี้ "ไม่ใช่ null" -> ถือว่าเป็นรอบเดียวกัน (แค่เพิ่งรู้ roundId จริงช้า) ->
   * ย้ายคำตอบเดิมมาผูกกับ roundId จริงแทน ไม่ทิ้ง — กรณีอื่น (roundId จริงสองค่า
   * ต่างกัน, หรือไม่เคยมีข้อมูลมาก่อนเลย) ยังคงล้างว่างใหม่เหมือนเดิมทุกประการ
   */
  function initAnsweredState(roundId: string | null): void {
    const stored = readStoredAnswered()
    if (stored) {
      if (stored.roundId === roundId) {
        answeredList.value = stored.answers
        answeredRoundId.value = roundId
        return
      }
      if (stored.roundId === null && roundId !== null) {
        answeredList.value = stored.answers
        answeredRoundId.value = roundId
        persistAnswered({ roundId, answers: stored.answers })
        return
      }
    }
    // คนละรอบจริง ๆ (หรือไม่เคยมีเลย) -> เริ่มว่างใหม่ ไม่ merge ของรอบเก่าเข้ามา
    answeredList.value = []
    answeredRoundId.value = roundId
    persistAnswered({ roundId, answers: [] })
  }

  /** เลือกคำถาม 1 ข้อของฐานที่ระบุ — คำถามแรก (order น้อยสุด) ที่ active เท่านั้น
   * ไม่มีคำถามของฐานนี้เลย -> คืน undefined (ฝั่ง UI ต้องข้ามขั้นตอนถามคำถามไป
   * เข้าฐานตามปกติ ไม่บังคับว่าทุกฐานต้องมีคำถาม) */
  function getQuestionForStation(stationId: string): StationQuestion | undefined {
    return questions.value
      .filter((q) => q.stationId === stationId && q.active)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
  }

  function findAnswered(questionId: string): StationAnswer | undefined {
    return answeredList.value.find((a) => a.questionId === questionId)
  }

  function isQuestionAnswered(questionId: string): boolean {
    return !!findAnswered(questionId)
  }

  /** ฐานนี้ "จบภารกิจคำถามแล้ว" หรือยัง — true ทั้งกรณีตอบแล้ว (ไม่ว่าถูกหรือผิด)
   * และกรณีฐานนี้ไม่มีคำถามเลย (ไม่บล็อกการเดินเรื่องต่อ) */
  function isStationQuestionDone(stationId: string): boolean {
    const q = getQuestionForStation(stationId)
    if (!q) return true
    return isQuestionAnswered(q.id)
  }

  /**
   * [Fix] เดิมใช้ answeredRoundId.value (ค่าที่ cache ไว้ตอน initAnsweredState()
   * ครั้งล่าสุด) เป็น roundId ตอนเขียนลง LocalStorage เสมอ — ถ้า initAnsweredState()
   * เคยถูกเรียกตอน currentRoundId ฝั่ง useRound.ts ยังไม่นิ่ง (เช่น เพิ่ง mount
   * หน้า Scan แล้ว ensureRoundStarted() ยังไม่ resolve) ค่านี้จะค้างเป็นค่าเก่า/null
   * ไปตลอด แม้ภายหลัง Round จะได้ roundId จริงมาแล้วก็ตาม ทำให้คำตอบที่ตอบไปถูก
   * บันทึกผูกกับ roundId ผิด (หรือ null) และ "หายไป" ตอนฐานถัดไปเรียก
   * initAnsweredState(roundId จริง) เพราะเทียบไม่ตรงกับที่เคย persist ไว้ ->
   * ตัดสินว่าเป็นคนละรอบ -> เคลียร์ answeredList ทิ้งทั้งหมด (นี่คือสาเหตุที่คะแนน
   * คำถามจากฐานก่อน ๆ "ดึงผิด"/หายไปตอนถึงหน้าสรุปผล)
   *
   * แก้โดยรับ roundId ที่ "สดจริง ๆ" จากผู้เรียก (submitAnswer() ส่ง ctx.roundId
   * ที่ผู้เรียกอ่านจาก useRound().currentRoundId ตรง ๆ ทุกครั้งที่ตอบ ไม่ใช่ค่า
   * cache) มาเขียนทับ answeredRoundId.value ทุกครั้งที่บันทึกคำตอบ — ทำให้ระบบ
   * "ซ่อมตัวเองได้" แม้ initAnsweredState() ครั้งแรกจะเจอ roundId ที่ยังไม่นิ่งก็ตาม
   */
  function persistAndSet(next: StationAnswer[], roundId: string | null): void {
    answeredList.value = next
    answeredRoundId.value = roundId
    persistAnswered({ roundId, answers: next })
  }

  /**
   * ตอบคำถาม 1 ข้อ — ตัดสินบนเครื่องทันที (Offline First) แล้ว queue ไป sync
   * ขึ้น Backend ต่อ คืนค่าผลลัพธ์เสมอ (ไม่ throw) ให้หน้า UI ไปแสดงผลต่อ
   *
   * "ตอบได้ครั้งเดียว ผิดแล้วผิดเลย": ถ้าข้อนี้เคยตอบไปแล้ว (ในรอบเดียวกัน)
   * จะคืนผลเดิมทันที ไม่ตัดสินซ้ำ ไม่บันทึกซ้ำ ไม่ว่าจะส่งคำตอบใหม่มาต่างจากเดิม
   * แค่ไหนก็ตาม (ป้องกันการยิงซ้ำจาก UI/double-submit)
   */
  function submitAnswer(
    question: StationQuestion,
    answerValue: string,
    ctx: { userId: string; firstName?: string; roundId: string | null },
  ): StationAnswer {
    const existing = findAnswered(question.id)
    if (existing) return existing

    const isCorrect = judgeAnswer(question.answerType, answerValue, question.correctAnswer)
    const pointsEarned = isCorrect ? question.points : 0

    const answer: StationAnswer = {
      clientId: genClientId(),
      questionId: question.id,
      stationId: question.stationId,
      roundId: ctx.roundId,
      answer: answerValue,
      isCorrect,
      pointsEarned,
      answeredAt: Date.now(),
      synced: false,
      locked: true,
    }

    persistAndSet([...answeredList.value, answer], ctx.roundId)

    const { queueAnswer } = useOfflineAnswerSync()
    queueAnswer(answer)

    return answer
  }

  /** ล้างสถานะ "ตอบไปแล้วบ้าง" ของรอบปัจจุบันทิ้งทั้งหมด — เรียกคู่กับ
   * useAdventure().resetJourney() เสมอ (ที่ pages/round-summary.vue::confirmAndGoHome
   * จุดเดียวที่ resetJourney() ถูกเรียก — ดูคอมเมนต์ในไฟล์นั้น) เพื่อไม่ให้คำตอบ
   * ของรอบที่จบไปแล้วค้างข้ามมารอบใหม่ ไม่แตะ useAdventure.ts เลยแม้แต่บรรทัดเดียว */
  function resetAnswered(): void {
    answeredList.value = []
    answeredRoundId.value = null
    if (import.meta.client) {
      localStorage.removeItem(ANSWERED_STORAGE_KEY)
    }
  }

  return {
    questions: readonly(questions),
    isLoadingQuestions: readonly(isLoadingQuestions),
    loadError: readonly(loadError),
    usingMockData: readonly(usingMockData),
    totalQuestionPoints,
    totalCorrect,
    initQuestions,
    initAnsweredState,
    getQuestionForStation,
    isQuestionAnswered,
    isStationQuestionDone,
    findAnswered,
    submitAnswer,
    resetAnswered,
  }
}
