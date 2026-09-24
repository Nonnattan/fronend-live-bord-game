<script setup lang="ts">
/**
 * pages/station/[stationId].vue
 * ---------------------------------------------------------------------------
 * [แก้ไข] หน้าเต็ม "ภารกิจฐาน___" — เนื้อหา/คะแนนภารกิจทั้งหมดตอนนี้มาจาก
 * composables/useStationMissions.ts (เรียก server-gas/MissionsService.gs จริง)
 * แล้ว ไม่ใช่ Mock 3 ภารกิจตายตัวเดิม — จำนวน/ชนิดภารกิจไม่ hardcode (ดู
 * types/mission.ts) สิทธิ์เข้าฐาน (canEnterStation/consumeScanAccess) ยังคงอยู่
 * ที่ composables/useStationQuest.ts เหมือนเดิมทุกประการ (คนละความรับผิดชอบ —
 * หน้านี้เรียกทั้งสอง Composable คู่กัน)
 *
 * เข้าได้เฉพาะฐานที่ทำภารกิจครบแล้ว (ดูซ้ำได้เสมอ) หรือฐานที่เพิ่งได้สิทธิ์จาก
 * การสแกน QR ล่าสุด (currentScanStationId ตรงกัน) เท่านั้น — เข้าทางอื่น (พิมพ์
 * URL/Bookmark/Back มาแบบไม่มีสิทธิ์) จะถูกเด้งกลับ /stations ทันทีใน onMounted
 *
 * ทันทีที่เข้าหน้านี้สำเร็จ สิทธิ์จากการสแกนล่าสุดจะถูก "ใช้ไป" ทันที (ดู
 * consumeScanAccess()) — กลับไปหน้า /stations แล้วฐานนี้จะกดเข้าไม่ได้อีกจนกว่า
 * จะสแกน QR ฐานนี้ใหม่ (Progress ที่ทำไปแล้วไม่หายไปไหน แค่ต้องสแกนใหม่ถึงจะ
 * เข้าเล่นต่อได้ — ตามสเปก "ต้อง Scan QR ใหม่ถึงจะกลับเข้า Base ได้")
 *
 * ฐาน "นม" (FINAL_STATION_ID) พิเศษ — แสดงปุ่มใหญ่ [จบเกม] เสมอไม่ว่าทำภารกิจได้
 * กี่ใบก็ตาม (แทนข้อความฉลองทั่วไป — ดู StationMissionList ที่ hideCelebration)
 * ส่วนปุ่ม [เล่นต่อ] โผล่มา "เพิ่ม" เฉพาะตอนทำครบทุกภารกิจแล้วเท่านั้น กด [จบเกม]
 * ไม่ว่า Progress เท่าไหร่ก็ตาม ต้องไม่แตะภารกิจ/คะแนนเลย (ดู markGameCompleted()
 * ใน composables/useStationQuest.ts)
 */
import { STATION_TYPE_META, type StationType } from "~/composables/useAdventure";
import type { StationMission } from "~/types/mission";
import type { MissionQuestionResult } from "~/components/station/StationMissionQuestion.vue";
import StationMissionList from "~/components/station/StationMissionList.vue";
import StationMissionQuestion from "~/components/station/StationMissionQuestion.vue";
import StationMissionQr from "~/components/station/StationMissionQr.vue";

definePageMeta({ layout: "app" });
const { profile, isReady } = useRequireProfile();
const route = useRoute();

const VALID_STATION_IDS: StationType[] = ["corn", "cow", "soil", "milk"];
/** ฐานสุดท้ายของเส้นทาง — ทำภารกิจครบแล้วเป็นจุดตัดสินใจ จบเกม/เล่นต่อ (เหมือน
 * FINAL_STATION_ID เดิมใน pages/scan.vue แต่ระบบนี้แยกกันคนละ State ทั้งหมด) */
const FINAL_STATION_ID: StationType = "milk";

const rawId = computed(() => String(route.params.stationId ?? ""));
const stationId = computed<StationType | null>(() =>
  VALID_STATION_IDS.includes(rawId.value as StationType) ? (rawId.value as StationType) : null,
);

const { stations } = useAdventure();
const stationName = computed(() => {
  if (!stationId.value) return "";
  return stations.value.find((s) => s.id === stationId.value)?.name ?? STATION_TYPE_META[stationId.value].label;
});

const { canEnterStation, consumeScanAccess, markGameCompleted } = useStationQuest();
const {
  getStationMissions,
  isStationMissionComplete,
  loadStationMissions,
  submitSingleQuestion,
  submitMultiQuestion,
  verifyQrMission,
  loadError: missionsLoadError,
} = useStationMissions();
const { getQuestionsForMission, initAnsweredState } = useQuestion();
const { isOnline, initOfflineSync } = useOfflineSync();
const { syncNow: syncAnswersNow, initOfflineAnswerSync } = useOfflineAnswerSync();
const { syncNow: syncMissionAnswersNow, initOfflineMissionAnswerSync } = useOfflineMissionAnswerSync();
const { isOfflineMode, startRound } = useOfflineMode();
const { currentRoundId, endCurrentRound } = useRound();
const { clearAllTimers } = useRoundTimer();

const canShowContent = ref(false);
const loadingMissions = ref(false);

/** ต้อง await ให้สิทธิ์เข้าฐาน (useStationQuest) พร้อมก่อนเสมอ (กันเคส Hard
 * Refresh ตรงหน้านี้เอง) แล้วค่อยโหลดภารกิจจริงจาก Backend ต่อ (useStationMissions)
 * — initOfflineSync/initOfflineAnswerSync/initOfflineMissionAnswerSync ต้องเรียก
 * ก่อนตอบภารกิจใด ๆ เสมอ (โหลดคิว Offline ที่ค้างจาก LocalStorage) */
/** แยกออกมาให้ปุ่ม "ลองใหม่" (แสดงเมื่อโหลดภารกิจไม่สำเร็จ — เช่น ไม่มีเน็ต/
 * Backend ไม่ตอบสนอง) เรียกซ้ำได้โดยไม่ต้อง Refresh ทั้งหน้า */
async function loadMissionsForCurrentStation(): Promise<void> {
  if (!stationId.value) return;
  loadingMissions.value = true;
  await loadStationMissions(
    stationId.value,
    currentRoundId.value,
    profile.value?.memberId || profile.value?.uid,
  );
  loadingMissions.value = false;
}

onMounted(async () => {
  initOfflineSync();
  initOfflineAnswerSync();
  initOfflineMissionAnswerSync();

  if (!stationId.value || !canEnterStation(stationId.value)) {
    void navigateTo("/stations", { replace: true });
    return;
  }
  consumeScanAccess(stationId.value);
  canShowContent.value = true;

  initAnsweredState(currentRoundId.value);
  await loadMissionsForCurrentStation();
});

const missions = computed(() => (stationId.value ? getStationMissions(stationId.value) : []));
const isComplete = computed(() => (stationId.value ? isStationMissionComplete(stationId.value) : false));
const isFinalStation = computed(() => stationId.value === FINAL_STATION_ID);

const activeMission = ref<StationMission | null>(null);
const questionPopupOpen = ref(false);
const qrPopupOpen = ref(false);
const activeQuestionResult = ref<MissionQuestionResult | null>(null);
const qrVerifying = ref(false);
const qrError = ref("");

const activeQuestions = computed(() => {
  if (!activeMission.value?.questionIds) return [];
  return getQuestionsForMission(activeMission.value.questionIds);
});

function openMission(mission: StationMission): void {
  activeMission.value = mission;
  // ทำสำเร็จไปแล้ว (เช่น Refresh กลับมาเจอ) — listStationMissions ไม่ได้ส่ง
  // breakdown รายข้อกลับมา (ดู types/mission.ts) จึงโชว์ได้แค่คะแนนรวมที่ได้จริง
  // เท่านั้น ไม่ปะติดปะต่อ correctCount/totalCount ปลอม ๆ ขึ้นมาเอง
  activeQuestionResult.value = mission.completed
    ? { correctCount: 0, totalCount: 0, totalPoints: mission.pointsEarned }
    : null;
  qrError.value = "";
  if (mission.type === "QR_SCORE") {
    qrPopupOpen.value = true;
  } else {
    questionPopupOpen.value = true;
  }
}

function closeMissionPopup(): void {
  questionPopupOpen.value = false;
  qrPopupOpen.value = false;
  activeMission.value = null;
  activeQuestionResult.value = null;
  qrError.value = "";
}

function currentCtx() {
  return {
    userId: profile.value?.memberId || profile.value?.uid || "",
    firstName: profile.value?.firstName,
    roundId: currentRoundId.value,
  };
}

/** ผู้เล่นกดส่งคำตอบใน StationMissionQuestion — ตัดสินบนเครื่องทันที (Offline
 * First ผ่าน useStationMissions().submitSingleQuestion()/submitMultiQuestion())
 * แล้วอัปเดต activeQuestionResult ให้ Popup เปลี่ยนไปแสดงผลลัพธ์เอง มีเน็ตอยู่
 * แล้ว (และไม่ใช่ Offline Mode) ลอง Sync ทันทีแบบไม่บล็อก UI (เหมือนแนวทาง
 * Offline Queue อื่น ๆ ในโปรเจกต์นี้) */
function handleQuestionSubmit(answers: Array<{ questionId: string; answer: string }>): void {
  if (!stationId.value || !activeMission.value) return;
  const ctx = currentCtx();

  if (activeMission.value.type === "SINGLE_QUESTION") {
    const question = activeQuestions.value[0];
    if (!question) return;
    const result = submitSingleQuestion(
      stationId.value,
      activeMission.value,
      question,
      answers[0]?.answer ?? "",
      ctx,
    );
    activeQuestionResult.value = {
      correctCount: result.isCorrect ? 1 : 0,
      totalCount: 1,
      totalPoints: result.pointsEarned,
    };
    if (!isOfflineMode.value && isOnline.value && ctx.userId) {
      void syncAnswersNow(ctx.userId, ctx.firstName);
    }
  } else {
    const result = submitMultiQuestion(stationId.value, activeMission.value, answers, ctx);
    activeQuestionResult.value = {
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      totalPoints: result.totalPoints,
    };
    if (!isOfflineMode.value && isOnline.value) {
      void syncMissionAnswersNow();
    }
  }
}

/** ผู้เล่นสแกน QR ของภารกิจสำเร็จ (StationMissionQr ส่ง qrToken มาให้) — ต้อง
 * ออนไลน์เสมอ (ไม่มี Offline Fallback) ยิงไม่สำเร็จ (QR ผิด/ของฐานอื่น/หมดเน็ต)
 * -> แสดง error ให้สแกนใหม่ได้ ไม่ถือว่าสำเร็จ/ได้คะแนนก่อนได้รับคำตอบจริง */
async function handleQrScanned(qrToken: string): Promise<void> {
  if (!stationId.value || !activeMission.value || !currentRoundId.value) {
    qrError.value = "กรุณากดปุ่ม GO ที่หน้าหลักก่อนเริ่มเล่นครับ";
    return;
  }
  qrVerifying.value = true;
  qrError.value = "";
  try {
    const result = await verifyQrMission(stationId.value, activeMission.value, qrToken, {
      ...currentCtx(),
      roundId: currentRoundId.value,
    });
    if (!result.success) {
      qrError.value = result.error || "QR ภารกิจนี้ไม่ถูกต้อง กรุณาลองใหม่";
      return;
    }
    activeMission.value = {
      ...activeMission.value,
      completed: true,
      pointsEarned: result.pointsEarned,
    };
  } finally {
    qrVerifying.value = false;
  }
}

/** ปุ่ม "เล่นต่อ" — เริ่ม Round ใหม่โดยใช้ Round Flow เดิมของระบบทั้งหมด (ไม่
 * ประดิษฐ์ Logic เปิดรอบเอง): จบ Round เดิม (Online) หรือเริ่ม Round Data ใหม่
 * (Offline) เหมือน pages/round-summary.vue::confirmAndGoHome() ทุกประการ แล้ว
 * เคลียร์ Timer เดิม ก่อนพาไปหน้า /starting เดิม (เปิดรอบใหม่ + เริ่ม Timer ใหม่
 * + พาไป /home ให้อัตโนมัติ) — Progress ของ useStationMissions.ts รีเซ็ตเอง
 * อัตโนมัติทันทีที่ roundId เปลี่ยน ไม่ต้องรีเซ็ตเองที่นี่ */
const isStartingNewRound = ref(false);
async function handlePlayAgain(): Promise<void> {
  if (isStartingNewRound.value) return;
  isStartingNewRound.value = true;
  try {
    if (isOfflineMode.value) {
      startRound(profile.value?.uid ?? "");
    } else if (profile.value?.memberId) {
      await endCurrentRound(profile.value.memberId);
    }
    clearAllTimers();
    await navigateTo("/starting");
  } finally {
    isStartingNewRound.value = false;
  }
}

/** ปุ่ม "จบเกม" — กดได้ไม่ว่าทำภารกิจได้กี่ใบก็ตาม เปลี่ยนแค่ gameCompleted เป็น
 * true เท่านั้น (ดู markGameCompleted()) ไม่แตะภารกิจ/คะแนนเด็ดขาด แล้วพาไปหน้า
 * แบบประเมินเสมอ (ไม่จบรอบ/ไม่เขียนอะไรอื่นที่นี่ — ดู pages/evaluation.vue ที่
 * เป็นคนจบ Round จริงหลังส่งแบบประเมินแล้วเท่านั้น) */
function handleEndGame(): void {
  markGameCompleted();
  navigateTo("/evaluation");
}
</script>

<template>
  <div class="page">
    <PageHeader :title="stationId ? `ภารกิจ${stationName}` : 'ภารกิจฐาน'" back-to="/stations" />
    <div v-if="!isReady || !canShowContent" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__content">
      <div v-if="loadingMissions && missions.length === 0" class="page__loading">
        <UIcon name="i-lucide-loader-2" class="page__spinner" />
      </div>
      <div v-else-if="missionsLoadError && missions.length === 0" class="mission-error">
        <p class="mission-error__text">{{ missionsLoadError }}</p>
        <UButton
          block
          color="neutral"
          variant="soft"
          icon="i-lucide-rotate-cw"
          @click="loadMissionsForCurrentStation"
        >
          ลองใหม่
        </UButton>
      </div>
      <StationMissionList
        v-else
        :missions="missions"
        :hide-celebration="isFinalStation"
        @open-mission="openMission"
      />

      <div v-if="isFinalStation" class="endgame-cta">
        <p class="endgame-cta__title">
          {{ isComplete ? "ทำภารกิจฐานนมครบแล้ว!" : "ต้องการจบเกมตอนนี้เลยหรือไม่?" }}
        </p>
        <UButton
          block
          size="xl"
          color="neutral"
          variant="soft"
          :disabled="isStartingNewRound"
          @click="handleEndGame"
        >
          จบเกม
        </UButton>
        <UButton
          v-if="isComplete"
          block
          size="xl"
          color="primary"
          :loading="isStartingNewRound"
          :disabled="isStartingNewRound"
          @click="handlePlayAgain"
        >
          เล่นต่อ
        </UButton>
      </div>
    </div>

    <StationMissionQuestion
      v-if="activeMission && activeMission.type !== 'QR_SCORE'"
      v-model:open="questionPopupOpen"
      :questions="activeQuestions"
      :result="activeQuestionResult"
      @submit="handleQuestionSubmit"
      @close="closeMissionPopup"
    />

    <StationMissionQr
      v-if="activeMission && activeMission.type === 'QR_SCORE'"
      v-model:open="qrPopupOpen"
      :completed="activeMission.completed"
      :points-earned="activeMission.pointsEarned"
      :is-online="isOnline"
      :verifying="qrVerifying"
      :error-message="qrError"
      @scanned="handleQrScanned"
      @close="closeMissionPopup"
    />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page__spinner {
  width: 2.5rem;
  height: 2.5rem;
  animation: station-page-spin 1s linear infinite;
  color: var(--farm-accent-dark);
}

.page__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 1.1rem 2rem;
}

.endgame-cta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 1.1rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-accent-dark);
}

.endgame-cta__title {
  margin: 0 0 0.25rem;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.mission-error {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.1rem;
  border-radius: 1rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  text-align: center;
}

.mission-error__text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--farm-text-muted);
}

@keyframes station-page-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
