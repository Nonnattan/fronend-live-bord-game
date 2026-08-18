<script setup lang="ts">
/**
 * pages/station/[stationId].vue
 * ---------------------------------------------------------------------------
 * หน้าเต็ม "ภารกิจฐาน___" — เข้าได้เฉพาะฐานที่ทำครบ 3/3 แล้ว (ดูซ้ำได้เสมอ) หรือ
 * ฐานที่เพิ่งได้สิทธิ์จากการสแกน QR ล่าสุด (currentScanStationId ตรงกัน) เท่านั้น
 * (ดู composables/useStationQuest.ts::canEnterStation) — เข้าทางอื่น (พิมพ์ URL/
 * Bookmark/Back มาแบบไม่มีสิทธิ์) จะถูกเด้งกลับ /stations ทันทีใน onMounted
 *
 * ทันทีที่เข้าหน้านี้สำเร็จ สิทธิ์จากการสแกนล่าสุดจะถูก "ใช้ไป" ทันที (ดู
 * consumeScanAccess()) — กลับไปหน้า /stations แล้วฐานนี้จะกดเข้าไม่ได้อีกจนกว่า
 * จะสแกน QR ฐานนี้ใหม่ (Progress ที่ทำไปแล้วไม่หายไปไหน แค่ต้องสแกนใหม่ถึงจะ
 * เข้าเล่นต่อได้ — ตามสเปก "ต้อง Scan QR ใหม่ถึงจะกลับเข้า Base ได้")
 *
 * ฐาน "นม" (FINAL_STATION_ID) พิเศษ — แสดงปุ่มใหญ่ [จบเกม] เสมอไม่ว่า Progress
 * จะอยู่ 0/3-3/3 (แทนข้อความฉลองทั่วไป — ดู StationMissionList ที่ hideCelebration)
 * ส่วนปุ่ม [เล่นต่อ] โผล่มา "เพิ่ม" เฉพาะตอนทำครบ 3/3 แล้วเท่านั้น กด [จบเกม]
 * ไม่ว่า Progress เท่าไหร่ก็ตาม ต้องไม่แตะ missions/mockScore เลย (ดู
 * markGameCompleted() ใน composables/useStationQuest.ts)
 */
import { STATION_TYPE_META, type StationType } from "~/composables/useAdventure";
import type { MissionAnswerResult, MissionKind, MissionMockQuestion } from "~/types/stationMission";
import { getMissionQuestion } from "~/services/stationMissionMockData";
import StationMissionList from "~/components/station/StationMissionList.vue";
import StationMissionQuestion from "~/components/station/StationMissionQuestion.vue";
import StationMissionQr from "~/components/station/StationMissionQr.vue";

definePageMeta({ layout: "app" });
const { profile, isReady } = useRequireProfile();
const route = useRoute();

const VALID_STATION_IDS: StationType[] = ["corn", "cow", "soil", "milk"];
/** ฐานสุดท้ายของเส้นทาง — ทำครบ 3/3 แล้วเป็นจุดตัดสินใจ จบเกม/เล่นต่อ (เหมือน
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

const {
  canEnterStation,
  consumeScanAccess,
  getStationMissions,
  getMissionState,
  answerMission,
  completeQrMission,
  isStationMissionComplete,
  initStationQuest,
  markGameCompleted,
} = useStationQuest();
const { isOfflineMode, startRound } = useOfflineMode();
const { endCurrentRound } = useRound();
const { clearAllTimers } = useRoundTimer();

const canShowContent = ref(false);

/** ต้อง await initStationQuest() ก่อนเช็ค canEnterStation() เสมอ (แม้หน้าอื่นที่
 * มาก่อนหน้านี้น่าจะเรียกไปแล้วก็ตาม) — กันเคส Hard Refresh ตรงหน้านี้เลย (State
 * ยังไม่ถูกโหลดกลับมาจาก LocalStorage เลยสักครั้ง จะเห็นเป็นค่าว่างเปล่าเสมอ ดู
 * เหตุผลเต็ม ๆ ที่ composables/useStationQuest.ts::initStationQuest()) */
onMounted(async () => {
  await initStationQuest();
  if (!stationId.value || !canEnterStation(stationId.value)) {
    void navigateTo("/stations", { replace: true });
    return;
  }
  consumeScanAccess(stationId.value);
  canShowContent.value = true;
});

const missions = computed(() => (stationId.value ? getStationMissions(stationId.value) : null));
const isComplete = computed(() => (stationId.value ? isStationMissionComplete(stationId.value) : false));
const isFinalStation = computed(() => stationId.value === FINAL_STATION_ID);

const activeMissionKind = ref<MissionKind | null>(null);
const questionPopupOpen = ref(false);
const qrPopupOpen = ref(false);

const activeQuestion = computed<MissionMockQuestion | null>(() => {
  if (!stationId.value) return null;
  if (activeMissionKind.value !== "smell" && activeMissionKind.value !== "question") return null;
  return getMissionQuestion(stationId.value, activeMissionKind.value) ?? null;
});
const activeAnswer = computed<MissionAnswerResult | null>(() => {
  if (!stationId.value || activeMissionKind.value === null || activeMissionKind.value === "qr") return null;
  return getMissionState(stationId.value, activeMissionKind.value).answer;
});
const activeQrCompleted = computed(() =>
  stationId.value ? getMissionState(stationId.value, "qr").completed : false,
);

function openMission(kind: MissionKind): void {
  activeMissionKind.value = kind;
  if (kind === "qr") qrPopupOpen.value = true;
  else questionPopupOpen.value = true;
}

function closeMissionPopup(): void {
  questionPopupOpen.value = false;
  qrPopupOpen.value = false;
  activeMissionKind.value = null;
}

function handleAnswerSubmit(choiceId: string): void {
  if (!stationId.value || !activeQuestion.value) return;
  answerMission(stationId.value, activeQuestion.value, choiceId);
}

function handleQrConfirm(): void {
  if (!stationId.value) return;
  completeQrMission(stationId.value);
}

/** ปุ่ม "เล่นต่อ" — เริ่ม Round ใหม่โดยใช้ Round Flow เดิมของระบบทั้งหมด (ไม่
 * ประดิษฐ์ Logic เปิดรอบเอง): จบ Round เดิม (Online) หรือเริ่ม Round Data ใหม่
 * (Offline) เหมือน pages/round-summary.vue::confirmAndGoHome() ทุกประการ แล้ว
 * เคลียร์ Timer เดิม (clearAllTimers — ไม่งั้น hasActiveRoundTimer ยังเป็น true
 * ค้างอยู่ ทำให้ pages/starting.vue เห็นว่า "เปิดรอบไปแล้ว" แล้วข้ามการเปิดรอบใหม่
 * ไปเลย) ก่อนพาไปหน้า /starting เดิม (เปิดรอบใหม่ + เริ่ม Timer ใหม่ + พาไป /home
 * ให้อัตโนมัติ) — Progress ของ useStationQuest.ts รีเซ็ตเองอัตโนมัติทันทีที่
 * roundId เปลี่ยน (ดู effectiveRoundKey ในไฟล์นั้น) ไม่ต้องรีเซ็ตเองที่นี่ ไม่ลบ
 * ประวัติ Round เก่า/คะแนนสะสม/Journey เก่าใด ๆ ทั้งสิ้น (endCurrentRound แค่ปิด
 * Round เดิมเฉย ๆ ไม่ลบข้อมูล) */
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

/** ปุ่ม "จบเกม" — กดได้ทุก Progress (0/3-3/3) ไม่ใช่แค่ตอนครบ 3/3 เท่านั้น เปลี่ยน
 * แค่ gameCompleted เป็น true (ดู markGameCompleted()) ไม่แตะ missions/mockScore
 * เด็ดขาด (ไม่ใช่การทำภารกิจให้ครบ/ไม่ใช่การให้คะแนน) แล้วพาไปหน้าแบบประเมินเสมอ
 * (ไม่จบรอบ/ไม่เขียนอะไรอื่นที่นี่ — ดู pages/evaluation.vue ที่เป็นคนจบ Round
 * จริงหลังส่งแบบประเมินแล้วเท่านั้น) */
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
      <StationMissionList
        v-if="missions"
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
      v-if="activeQuestion"
      v-model:open="questionPopupOpen"
      :question="activeQuestion"
      :answer="activeAnswer"
      @submit="handleAnswerSubmit"
      @close="closeMissionPopup"
    />

    <StationMissionQr
      v-if="qrPopupOpen"
      v-model:open="qrPopupOpen"
      :completed="activeQrCompleted"
      @confirm="handleQrConfirm"
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

@keyframes station-page-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
