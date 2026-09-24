/**
 * composables/useStationQuest.ts
 * ---------------------------------------------------------------------------
 * [แก้ไข — ตัดส่วน "เนื้อหา/คะแนนภารกิจ" ออกทั้งหมด ย้ายไป composables/
 * useStationMissions.ts] ไฟล์นี้เคยเป็นทั้งระบบ Mock ภารกิจ (3 ภารกิจตายตัว
 * ตัดสินคะแนนเองฝั่ง Client + แอบยิง check-in จริงตอนทำครบ 3/3) และระบบสิทธิ์
 * เข้าฐานในตัวเดียวกัน — ตามสเปกใหม่ "ภารกิจต้องมาจาก Backend เท่านั้น ห้าม
 * Client ตัดสิน/คำนวณคะแนนเอง" ส่วนเนื้อหา/คะแนนภารกิจทั้งหมดถูกย้ายไปที่
 * composables/useStationMissions.ts (เรียก server-gas/MissionsService.gs จริง)
 * แล้ว — ไฟล์นี้เหลือแค่ความรับผิดชอบเดิมที่ "ไม่ใช่เรื่องคะแนน" เท่านั้น:
 *   - สิทธิ์เข้าฐาน "แบบใช้ครั้งเดียวจากการสแกนล่าสุด" (currentScanStationId/
 *     scanStation/consumeScanAccess/canEnterStation)
 *   - ฐานโปรดที่เลือกในหน้าแบบประเมิน (selectedFavoriteStationId)
 *   - ปุ่ม "จบเกม" ที่ฐานนม (gameCompleted/markGameCompleted)
 * หน้าที่ต้องใช้ทั้งสิทธิ์เข้าฐานและภารกิจ (pages/stations.vue,
 * pages/station/[stationId].vue) ต้องเรียกทั้ง useStationQuest() (สิทธิ์เข้าฐาน)
 * และ useStationMissions() (เนื้อหา/คะแนนภารกิจ) คู่กันเสมอ — คนละความรับผิดชอบ
 *
 * [แก้ไข] กติกาการเข้าฐาน — "สิทธิ์เข้าฐานแบบใช้ครั้งเดียวจากการสแกนล่าสุด":
 *   - scanStation(id): สแกน QR ฐานสำเร็จ -> ตั้ง currentScanStationId = id เสมอ
 *     (ทับค่าเดิมไม่ว่าจะเป็นฐานไหนก็ตาม — มีสิทธิ์เข้าได้แค่ "ฐานล่าสุดที่สแกน"
 *     ฐานเดียวเท่านั้น) ไม่เพิ่มคะแนน/ไม่แตะภารกิจใด ๆ ทั้งสิ้น
 *   - consumeScanAccess(id): เรียกตอนผู้เล่น "กดเข้า" ฐานนั้นจริง ๆ (ดู
 *     pages/station/[stationId].vue) เคลียร์ currentScanStationId ทิ้งทันที
 *     ถ้าตรงกับฐานที่กำลังเข้า (ฐานอื่นที่ progress ค้างไว้จะกลับไปกดเข้าไม่ได้
 *     จนกว่าจะสแกน QR ฐานนั้นใหม่อีกครั้ง)
 *   - canEnterStation(id): true เฉพาะฐานที่ useStationMissions().
 *     isStationMissionComplete(id) เป็น true แล้ว (เข้าไปดูซ้ำได้เสมอ ไม่เสี่ยง
 *     คะแนนซ้ำ เพราะ Backend กันตอบซ้ำอยู่แล้ว) หรือฐานที่ currentScanStationId
 *     ตรงกันเท่านั้น
 *
 * ผูกกับ Round เสมอ (อ่านจาก useRound().currentRoundId ฝั่ง Online หรือ
 * useOfflineMode().roundData ฝั่ง Offline — "อ่านอย่างเดียว" ไม่เรียกฟังก์ชันที่
 * เปิด/ปิด Round ใด ๆ จากที่นี่เลย) เปลี่ยนรอบเมื่อไหร่ ล้าง State ชุดนี้ทิ้งทันที
 * กันฐาน/สิทธิ์เข้าฐานของรอบก่อนหน้าปนกับรอบใหม่
 */

import type { StationType } from '~/composables/useAdventure'
import type { StationCardState, StationQuestProgress } from '~/types/stationMission'

const STORAGE_KEY = 'stationQuestMock:progress'

function createEmptyProgress(roundKey: string): StationQuestProgress {
  return {
    roundKey,
    currentScanStationId: null,
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
    // เพิกเฉย (localStorage เต็ม/Private Browsing) — ไม่กระทบระบบเดิมใด ๆ
  }
}

/**
 * [ใหม่] ล้าง Progress สิทธิ์เข้าฐาน/ฐานโปรด/สถานะจบเกมทิ้งทั้งหมด (LocalStorage +
 * State ในหน่วยความจำ) — ใช้เฉพาะ 2 กรณีเท่านั้น (คู่กับ composables/
 * useStationMissions.ts::clearStationMissionsProgress() เสมอทั้ง 2 จุด): (1)
 * ผู้เล่นกดยืนยันรับรางวัลสำเร็จจริงที่ pages/reward-received.vue::handleOk()
 * (ฝั่ง Online) หรือกด "ติดต่อเจ้าหน้าที่แล้ว" ที่ pages/round-summary.vue::
 * confirmAndGoHome() (ฝั่ง Offline) — จบเกม "สำเร็จ" ตาม Flow ครบแล้วเท่านั้น,
 * (2) Session หมดอายุเกิน 24 ชม. (ดู composables/useSessionExpiry.ts) ไม่ใช่การ
 * Reset ตามรอบปกติ (นั่นเป็นหน้าที่ของ resetForCurrentRound()/
 * watch(effectiveRoundKey) ด้านล่างอยู่แล้ว ซึ่งผูกกับ roundKey ปัจจุบันเสมอ) —
 * ที่นี่ล้างทิ้งตรง ๆ ไม่สนใจ roundKey ปัจจุบันเลย
 */
export function clearStationQuestProgress(): void {
  const progress = useState<StationQuestProgress>('station-quest-progress', () =>
    createEmptyProgress('no-round'),
  )
  progress.value = createEmptyProgress('no-round')
  if (import.meta.client) {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // เพิกเฉย (ดูเหตุผลเดียวกับ persistProgress ด้านบน)
    }
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
   * ใหม่แล้ว" ล้าง Progress ที่เคยทำไว้ทิ้งอย่างผิดพลาด
   *
   * แก้โดยรอให้ currentRoundId ถูกต้องก่อนเสมอ — เรียก ensureRoundStarted() เอง
   * ที่นี่ "เฉพาะกรณีเคยกด GO แล้วเท่านั้น" (hasActiveRoundTimer true) กันสร้าง
   * Round ใหม่โดยไม่ตั้งใจสำหรับผู้เล่นที่ยังไม่เคยกด GO เลย
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
  // roundId มาช้า) — ไม่รีเซ็ตตอนเปลี่ยนเป็น 'no-round' (รอบเพิ่งจบ ยังไม่มีรอบใหม่
  // เริ่ม) ด้วยเหตุผลเดียวกับที่ composables/useStationMissions.ts เขียนไว้
  watch(effectiveRoundKey, (next) => {
    if (!initialized.value || progress.value.roundKey === next) return
    if (next === 'no-round') return
    resetForCurrentRound()
  })

  const currentScanStationId = computed(() => progress.value.currentScanStationId)
  const selectedFavoriteStationId = computed(() => progress.value.selectedFavoriteStationId)
  const gameCompleted = computed(() => progress.value.gameCompleted)

  /** ฐานที่ทำภารกิจครบทุกใบแล้ว (ดูจาก composables/useStationMissions.ts — Backend
   * เป็นเจ้าของความจริงเรื่องนี้เพียงผู้เดียว) เข้าไปดูซ้ำได้เสมอ (ไม่เสี่ยงคะแนน
   * ซ้ำ เพราะ Backend กันตอบซ้ำ/สแกนซ้ำอยู่แล้ว) ฐานอื่นต้องมี currentScanStationId
   * ตรงกันเท่านั้น (สิทธิ์จากการสแกนล่าสุด) */
  function canEnterStation(stationId: StationType): boolean {
    const { isStationMissionComplete } = useStationMissions()
    return isStationMissionComplete(stationId) || progress.value.currentScanStationId === stationId
  }

  /** รวมข้อมูลที่การ์ดฐานหน้า "เลือกฐาน" ต้องใช้แสดงผลไว้ในที่เดียว — totalMissions
   * เป็น 0 ถ้ายังไม่เคยเข้าฐานนี้เลยในรอบนี้ (ยังไม่รู้จำนวนภารกิจจริงจาก Backend)
   * Component ต้องซ่อน Progress ตัวเลขไปก่อนในกรณีนั้น (ดู StationSelectionCard.vue) */
  function getStationCardState(stationId: StationType): StationCardState {
    const { getStationMissions, missionProgressCount, isStationMissionComplete } = useStationMissions()
    const totalMissions = getStationMissions(stationId).length
    return {
      completedMissions: missionProgressCount(stationId),
      totalMissions,
      isCompleted: isStationMissionComplete(stationId),
      isAccessible: canEnterStation(stationId),
    }
  }

  /** สแกน QR ฐานสำเร็จ — ตั้งสิทธิ์เข้าฐาน "ล่าสุด" เป็นฐานนี้เสมอ (ทับสิทธิ์ฐาน
   * อื่นที่อาจค้างอยู่ก่อนหน้าไปเลย) ไม่เพิ่มคะแนน/ไม่แตะภารกิจใด ๆ ทั้งสิ้น เรียก
   * ซ้ำฐานเดิมได้อย่างปลอดภัย (no-op) */
  function scanStation(stationId: StationType): void {
    progress.value = { ...progress.value, currentScanStationId: stationId }
    persistProgress(progress.value)
  }

  /** ผู้เล่นกด "เข้าฐาน" จริง ๆ (ดู pages/station/[stationId].vue::onMounted) —
   * ใช้สิทธิ์จากการสแกนล่าสุดไปทันที ถ้าตรงกับฐานที่กำลังเข้า (ฐานอื่นที่ progress
   * ค้างไว้จะไม่ถูกแตะ — ไม่ใช่ฐานที่กำลังเข้าอยู่) ต้องสแกน QR ฐานนี้ใหม่อีกครั้ง
   * ถึงจะกลับเข้าได้ (ไม่นับฐานที่ทำครบแล้ว — เข้าซ้ำได้เสมอไม่ต้องมีสิทธิ์นี้) */
  function consumeScanAccess(stationId: StationType): void {
    if (progress.value.currentScanStationId !== stationId) return
    progress.value = { ...progress.value, currentScanStationId: null }
    persistProgress(progress.value)
  }

  /** ผู้เล่นเลือกฐานโปรดในหน้าแบบประเมิน (pages/evaluation.vue) — เลือกซ้ำได้
   * เรื่อย ๆ ก่อนกดส่ง (ยกเลิกตัวเดิมอัตโนมัติ) */
  function setFavoriteStation(stationId: StationType): void {
    progress.value = { ...progress.value, selectedFavoriteStationId: stationId }
    persistProgress(progress.value)
  }

  /** ปุ่ม "จบเกม" ที่ฐานนม (ดู pages/station/[stationId].vue::handleEndGame) — กด
   * ได้ทุก Progress เปลี่ยนแค่ gameCompleted เป็น true เท่านั้น ห้ามแตะภารกิจ/
   * คะแนนใด ๆ เด็ดขาด (ไม่ใช่การทำภารกิจให้ครบ/ไม่ใช่การให้คะแนน) */
  function markGameCompleted(): void {
    progress.value = { ...progress.value, gameCompleted: true }
    persistProgress(progress.value)
  }

  return {
    currentScanStationId,
    selectedFavoriteStationId,
    gameCompleted,
    initStationQuest,
    canEnterStation,
    getStationCardState,
    scanStation,
    consumeScanAccess,
    setFavoriteStation,
    markGameCompleted,
  }
}
