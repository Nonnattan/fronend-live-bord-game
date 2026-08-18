/**
 * composables/useStationQuest.ts
 * ---------------------------------------------------------------------------
 * ระบบ "ปลดล็อคฐาน + ภารกิจ" เวอร์ชัน Mockup ล้วน ๆ (Frontend State only) —
 * แยกขาดจาก composables/useAdventure.ts (ระบบเช็คอินฐานจริงที่ผูกกับคะแนน/
 * Google Sheet) และ composables/useQuestion.ts (ระบบคำถามจริงต่อฐานที่ผูกกับ
 * submitAnswer() จริง) โดยตั้งใจ — ไฟล์นี้ "ห้ามเรียก" toggleStation/queueCheckin/
 * submitAnswer หรือ API ใด ๆ ที่ทำให้คะแนนจริงเปลี่ยนเด็ดขาด ตามสเปก Mockup
 *
 * [แก้ไข] กติกาการเข้าฐานใหม่ — "สิทธิ์เข้าฐานแบบใช้ครั้งเดียวจากการสแกนล่าสุด"
 * แทนที่ "ปลดล็อคแล้วค้างตลอดไป" เดิม:
 *   - scanStation(id): สแกน QR ฐานสำเร็จ -> ตั้ง currentScanStationId = id เสมอ
 *     (ทับค่าเดิมไม่ว่าจะเป็นฐานไหนก็ตาม — มีสิทธิ์เข้าได้แค่ "ฐานล่าสุดที่สแกน"
 *     ฐานเดียวเท่านั้น) ไม่เพิ่มคะแนน/ไม่แตะ missions ใด ๆ ทั้งสิ้น
 *   - consumeScanAccess(id): เรียกตอนผู้เล่น "กดเข้า" ฐานนั้นจริง ๆ (ดู
 *     pages/station/[stationId].vue) เคลียร์ currentScanStationId ทิ้งทันที
 *     ถ้าตรงกับฐานที่กำลังเข้า (ฐานอื่นที่ progress ค้างไว้จะกลับไปกดเข้าไม่ได้
 *     จนกว่าจะสแกน QR ฐานนั้นใหม่อีกครั้ง)
 *   - canEnterStation(id): true เฉพาะฐานที่ completedMissions ครบ 3 แล้ว (เข้าไป
 *     ดูซ้ำได้เสมอ ไม่เสี่ยงคะแนนซ้ำ) หรือฐานที่ currentScanStationId ตรงกันเท่านั้น
 * progress (missionProgressCount) เป็นคนละแกนกับสิทธิ์เข้าฐานเสมอ — ฐานที่เคย
 * เล่นค้าง 2/3 ไว้แล้วสิทธิ์หมด ยังคงเห็น 2/3 อยู่ (ไม่ Reset) แค่กดเข้าไม่ได้
 *
 * ผูกกับ Round เสมอ (อ่านจาก useRound().currentRoundId ฝั่ง Online หรือ
 * useOfflineMode().roundData ฝั่ง Offline — "อ่านอย่างเดียว" ไม่เรียกฟังก์ชันที่
 * เปิด/ปิด Round ใด ๆ จากที่นี่เลย) เปลี่ยนรอบเมื่อไหร่ ล้าง State ชุดนี้ทิ้งทันที
 * กันฐาน/ภารกิจ/สิทธิ์เข้าฐานของรอบก่อนหน้าปนกับรอบใหม่
 */

import type { StationType } from '~/composables/useAdventure'
import type {
  MissionAnswerResult,
  MissionKind,
  MissionMockQuestion,
  MissionState,
  StationCardState,
  StationMissionMap,
  StationQuestProgress,
} from '~/types/stationMission'

const STORAGE_KEY = 'stationQuestMock:progress'
const MISSION_KINDS: MissionKind[] = ['smell', 'question', 'qr']

function createEmptyMissionMap(): StationMissionMap {
  return {
    smell: { completed: false, answer: null },
    question: { completed: false, answer: null },
    qr: { completed: false, answer: null },
  }
}

function createEmptyProgress(roundKey: string): StationQuestProgress {
  return {
    roundKey,
    currentScanStationId: null,
    missions: {},
    mockScore: 0,
    selectedFavoriteStationId: null,
    gameCompleted: false,
  }
}

function readStoredProgress(): StationQuestProgress | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StationQuestProgress
  } catch {
    return null
  }
}

function persistProgress(progress: StationQuestProgress): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // เพิกเฉย (localStorage เต็ม/Private Browsing) — เป็นแค่ Mockup UI ทดลอง
    // ไม่ใช่ข้อมูลคะแนนจริง ไม่กระทบระบบเดิมใด ๆ
  }
}

export function useStationQuest() {
  const progress = useState<StationQuestProgress>('station-quest-progress', () =>
    createEmptyProgress('no-round'),
  )
  const initialized = useState('station-quest-initialized', () => false)

  const { currentRoundId, ensureRoundStarted } = useRound()
  const { isOfflineMode, roundData } = useOfflineMode()

  /** กุญแจของ "รอบปัจจุบัน" ไว้เทียบกันรอบเก่า/ใหม่ปนกัน — ผูกกับ Round Online
   * จริงถ้ามี, ผูกกับเวลาที่เริ่มรอบ Offline ถ้าอยู่ใน Offline Mode, หรือ 'no-round'
   * คงที่ถ้ายังไม่มีรอบเลย (เช่นเข้าหน้านี้ตรง ๆ โดยยังไม่ได้กด GO — ยังใช้ทดลอง
   * UI ได้ปกติ แค่ไม่ผูกกับรอบจริงเท่านั้น) */
  const effectiveRoundKey = computed<string>(() => {
    if (currentRoundId.value) return `online:${currentRoundId.value}`
    if (isOfflineMode.value && roundData.value?.startedAt) {
      return `offline:${roundData.value.startedAt}`
    }
    return 'no-round'
  })

  function resetForCurrentRound(): void {
    progress.value = createEmptyProgress(effectiveRoundKey.value)
    persistProgress(progress.value)
  }

  /**
   * [Fix — root cause ของ "Progress หายตอน Hard Reload หน้าที่เรียกฟังก์ชันนี้"]
   * useRound.ts::currentRoundId เป็นแค่ useState เปล่า ๆ ที่ "ไม่ auto-restore
   * จาก LocalStorage เอง" ตอน Hard Reload (ต้องรอเรียก ensureRoundStarted() ก่อน
   * เสมอ ถึงจะไปอ่าน localStorage['onlineRound:current'] มาเติมให้) — ถ้าฟังก์ชัน
   * นี้ประเมิน effectiveRoundKey ก่อนที่ currentRoundId จะถูกเติมค่าจริง จะเห็น
   * เป็น 'no-round' ชั่วคราวทั้งที่รอบเดิมยังไม่จบเลย แล้วเข้าใจผิดว่า "เปลี่ยนรอบ
   * ใหม่แล้ว" ล้าง Progress ที่เคยทำไว้ทิ้งอย่างผิดพลาด (เจอจริงตอนทดสอบ: สแกน
   * ฐานเดิมซ้ำหลัง Hard Refresh หน้า /scan แล้ว Progress ที่เคยทำไว้หายไปเฉย ๆ)
   *
   * แก้โดยรอให้ currentRoundId ถูกต้องก่อนเสมอ — เรียก ensureRoundStarted() เอง
   * ที่นี่ "เฉพาะกรณีเคยกด GO แล้วเท่านั้น" (hasActiveRoundTimer true) กันสร้าง
   * Round ใหม่โดยไม่ตั้งใจสำหรับผู้เล่นที่ยังไม่เคยกด GO เลย (ตรงกับกติกาเดิมที่
   * ห้าม ensureRoundStarted() ทำงานตอนแค่เข้าเพจเฉย ๆ — ดู useRequireProfile.ts)
   * ensureRoundStarted() เองก็ idempotent อยู่แล้ว เรียกซ้ำได้ปลอดภัยเสมอ
   *
   * [Fix 2 — root cause ของ "หน้าสรุปผล/Evaluation ยัง Reset Progress ทิ้งอยู่ดี
   * แม้จะแก้ Fix ด้านบนแล้ว"] useRoundTimer.ts::roundEndsAt ก็เป็น useState เปล่า ๆ
   * ที่ "ไม่ auto-restore จาก LocalStorage เอง" เหมือนกัน (ต้องเรียก initRoundTimer()
   * ก่อนเสมอ) — เดิมโค้ดตรงนี้อ่าน hasActiveRoundTimer ตรง ๆ โดยหวังว่าหน้าอื่นก่อน
   * หน้านี้ (Home/Map/Scan) จะเรียก initRoundTimer() ไปแล้วในเซสชันเดียวกัน ซึ่งจริง
   * สำหรับ Flow ปกติที่เดินผ่าน Home ก่อน แต่ Hard Reload ตรงหน้า /stations,
   * /station/[stationId], /evaluation เอง (เช่น Refresh เบราว์เซอร์กลางเกมบนมือถือ)
   * จะเห็น roundEndsAt เป็น null ทั้งที่ Timer จริงยังนับอยู่ ทำให้ hasActiveRoundTimer
   * เป็น false ผิดพลาด ข้าม ensureRoundStarted() ไปเลย แล้วเจอปัญหาเดิมซ้ำอีกชั้น
   * แก้โดยเรียก initRoundTimer() เองที่นี่ก่อนเช็คเสมอ (idempotent, แค่ re-sync จาก
   * LocalStorage เฉย ๆ ไม่มีผลข้างเคียงถ้าเรียกซ้ำ)
   */
  async function initStationQuest(): Promise<void> {
    if (!import.meta.client) return

    const { hasActiveRoundTimer, initRoundTimer } = useRoundTimer()
    initRoundTimer()
    if (!currentRoundId.value && !isOfflineMode.value && hasActiveRoundTimer.value) {
      const { profile } = useProfile()
      if (profile.value?.memberId) {
        await ensureRoundStarted(profile.value.memberId, profile.value.firstName)
      }
    }

    const stored = readStoredProgress()
    progress.value = stored && stored.roundKey === effectiveRoundKey.value
      ? stored
      : createEmptyProgress(effectiveRoundKey.value)
    if (!stored) persistProgress(progress.value)
    initialized.value = true
  }

  // เผื่อกรณี currentRoundId/roundData เพิ่ง resolve เสร็จ "หลัง" initStationQuest()
  // ทำงานไปแล้ว (pattern เดียวกับที่ useAdventure.ts/useQuestion.ts ใช้กันปัญหา
  // roundId มาช้า) — เฝ้าดูกุญแจรอบ เปลี่ยนเมื่อไหร่ค่อย sync ให้ตรงเสมอ
  watch(effectiveRoundKey, (next) => {
    if (!initialized.value || progress.value.roundKey === next) return
    resetForCurrentRound()
  })

  const currentScanStationId = computed(() => progress.value.currentScanStationId)
  const mockScore = computed(() => progress.value.mockScore)
  const selectedFavoriteStationId = computed(() => progress.value.selectedFavoriteStationId)
  const gameCompleted = computed(() => progress.value.gameCompleted)

  function getStationMissions(stationId: StationType): StationMissionMap {
    return progress.value.missions[stationId] ?? createEmptyMissionMap()
  }

  function getMissionState(stationId: StationType, kind: MissionKind): MissionState {
    return getStationMissions(stationId)[kind]
  }

  function missionProgressCount(stationId: StationType): number {
    const map = getStationMissions(stationId)
    return MISSION_KINDS.filter((kind) => map[kind].completed).length
  }

  function isStationMissionComplete(stationId: StationType): boolean {
    return missionProgressCount(stationId) === MISSION_KINDS.length
  }

  /** ฐานที่ทำครบ 3/3 แล้ว เข้าไปดูซ้ำได้เสมอ (ไม่เสี่ยงคะแนนซ้ำ เพราะ answerMission/
   * completeQrMission กันตอบซ้ำอยู่แล้ว) ฐานอื่นต้องมี currentScanStationId ตรงกัน
   * เท่านั้น (สิทธิ์จากการสแกนล่าสุด) */
  function canEnterStation(stationId: StationType): boolean {
    return isStationMissionComplete(stationId) || progress.value.currentScanStationId === stationId
  }

  /** รวมข้อมูลที่การ์ดฐานหน้า "เลือกฐาน" ต้องใช้แสดงผลไว้ในที่เดียว */
  function getStationCardState(stationId: StationType): StationCardState {
    const completedMissions = missionProgressCount(stationId)
    return {
      completedMissions,
      isCompleted: completedMissions === MISSION_KINDS.length,
      isAccessible: canEnterStation(stationId),
    }
  }

  /** สแกน QR ฐานสำเร็จ — ตั้งสิทธิ์เข้าฐาน "ล่าสุด" เป็นฐานนี้เสมอ (ทับสิทธิ์ฐาน
   * อื่นที่อาจค้างอยู่ก่อนหน้าไปเลย) ไม่เพิ่มคะแนน/ไม่แตะ missionCompleted ใด ๆ
   * ทั้งสิ้น เรียกซ้ำฐานเดิมได้อย่างปลอดภัย (no-op ด้าน missions ไม่กระทบ) */
  function scanStation(stationId: StationType): void {
    progress.value = {
      ...progress.value,
      currentScanStationId: stationId,
      missions: {
        ...progress.value.missions,
        [stationId]: progress.value.missions[stationId] ?? createEmptyMissionMap(),
      },
    }
    persistProgress(progress.value)
  }

  /** ผู้เล่นกด "เข้าฐาน" จริง ๆ (ดู pages/station/[stationId].vue::onMounted) —
   * ใช้สิทธิ์จากการสแกนล่าสุดไปทันที ถ้าตรงกับฐานที่กำลังเข้า (ฐานอื่นที่ progress
   * ค้างไว้จะไม่ถูกแตะ — ไม่ใช่ฐานที่กำลังเข้าอยู่) ต้องสแกน QR ฐานนี้ใหม่อีกครั้ง
   * ถึงจะกลับเข้าได้ (ไม่นับฐานที่ทำครบ 3/3 แล้ว — เข้าซ้ำได้เสมอไม่ต้องมีสิทธิ์นี้) */
  function consumeScanAccess(stationId: StationType): void {
    if (progress.value.currentScanStationId !== stationId) return
    progress.value = { ...progress.value, currentScanStationId: null }
    persistProgress(progress.value)
  }

  function updateMissionState(
    stationId: StationType,
    kind: MissionKind,
    next: MissionState,
    scoreDelta: number,
  ): void {
    const currentMap = getStationMissions(stationId)
    progress.value = {
      ...progress.value,
      missions: { ...progress.value.missions, [stationId]: { ...currentMap, [kind]: next } },
      mockScore: progress.value.mockScore + scoreDelta,
    }
    persistProgress(progress.value)
  }

  /** ตอบภารกิจ "ดมกลิ่น"/"ตอบคำถาม" — ตอบได้ครั้งเดียว (เหมือนกติการะบบคำถามจริง)
   * ตอบซ้ำคืนผลเดิมกลับไปเฉย ๆ ไม่ตัดสิน/ไม่บวกคะแนนซ้ำ ตอบถูก +points (Mock)
   * ตอบผิด +0 เสมอ — ไม่ว่าถูกหรือผิด Mission ถือว่า "completed" ทันที */
  function answerMission(
    stationId: StationType,
    question: MissionMockQuestion,
    choiceId: string,
  ): MissionAnswerResult {
    const existing = getMissionState(stationId, question.kind)
    if (existing.completed && existing.answer) return existing.answer

    const isCorrect = choiceId === question.correctChoiceId
    const result: MissionAnswerResult = {
      choiceId,
      isCorrect,
      pointsEarned: isCorrect ? question.points : 0,
      roundKey: progress.value.roundKey,
      answeredAt: Date.now(),
    }
    updateMissionState(stationId, question.kind, { completed: true, answer: result }, result.pointsEarned)
    return result
  }

  /** ภารกิจ "สแกน QR" — Mockup ให้กด "จำลองการสแกนสำเร็จ" ผ่านได้ทันที ไม่มี
   * คะแนนเสมอ (+0) ตามสเปก */
  function completeQrMission(stationId: StationType): void {
    const existing = getMissionState(stationId, 'qr')
    if (existing.completed) return
    updateMissionState(stationId, 'qr', { completed: true, answer: null }, 0)
  }

  /** ผู้เล่นเลือกฐานโปรดในหน้าแบบประเมิน (pages/evaluation.vue) — เลือกซ้ำได้
   * เรื่อย ๆ ก่อนกดส่ง (ยกเลิกตัวเดิมอัตโนมัติ) */
  function setFavoriteStation(stationId: StationType): void {
    progress.value = { ...progress.value, selectedFavoriteStationId: stationId }
    persistProgress(progress.value)
  }

  /** ปุ่ม "จบเกม" ที่ฐานนม (ดู pages/station/[stationId].vue::handleEndGame) — กด
   * ได้ทุก Progress (0/3-3/3) เปลี่ยนแค่ gameCompleted เป็น true เท่านั้น ห้ามแตะ
   * missions/mockScore เด็ดขาด (ไม่ใช่การทำภารกิจให้ครบ/ไม่ใช่การให้คะแนน) */
  function markGameCompleted(): void {
    progress.value = { ...progress.value, gameCompleted: true }
    persistProgress(progress.value)
  }

  return {
    currentScanStationId,
    mockScore,
    selectedFavoriteStationId,
    gameCompleted,
    initStationQuest,
    canEnterStation,
    isStationMissionComplete,
    missionProgressCount,
    getStationCardState,
    getStationMissions,
    getMissionState,
    scanStation,
    consumeScanAccess,
    answerMission,
    completeQrMission,
    setFavoriteStation,
    markGameCompleted,
  }
}
