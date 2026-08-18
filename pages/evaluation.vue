<script setup lang="ts">
/**
 * pages/evaluation.vue
 * ---------------------------------------------------------------------------
 * หน้าแบบประเมิน "ท่านชอบฐานใดมากที่สุด?" — เลือกได้ 1 จาก 4 ฐาน (แสดงชื่อจริง
 * ไม่ใช้เลข) เข้ามาจากปุ่ม "จบเกม" ที่หน้า /station/milk (ดู
 * pages/station/[stationId].vue::handleEndGame()) กด "ส่งแบบประเมิน" แล้วพาไป
 * หน้าสรุปผล/รางวัลเดิมของโปรเจกต์ (pages/round-summary.vue — ดูเหตุผลที่ใช้หน้า
 * นี้แทนที่จะสร้างหน้า Reward ใหม่ ในคอมเมนต์ handleSubmit ด้านล่าง)
 *
 * ใช้ submitSurvey() จริงของระบบเดิม (server-gas/SurveyService.gs) เฉพาะฝั่ง
 * Online เท่านั้น (แปลงฐานที่เลือกเป็นค่า 1-4 ตาม mapping เดิมที่ระบบมีอยู่แล้ว —
 * corn=1/soil=2/cow=3/milk=4) ไม่ได้สร้าง API ใหม่ใด ๆ ฝั่ง Offline ไม่มี Round
 * ฝั่ง Backend ให้บันทึกอยู่แล้ว จึงเก็บแค่ในเครื่อง (เหมือนกติกาเดิมของแบบประเมิน
 * ในปุ่มฐานนมเก่า) ไม่ Submit ไม่สำเร็จก็ไม่บล็อกผู้เล่น (รอบนี้เป็น Feedback
 * เสริม ไม่ใช่เงื่อนไขบังคับแบบระบบเดิม)
 */
import { STATION_TYPE_META, type StationType } from "~/composables/useAdventure";

definePageMeta({ layout: "app" });
const { profile, isReady } = useRequireProfile();
const { stations } = useAdventure();
const { isOfflineMode, endRound } = useOfflineMode();
const { currentRoundId, endCurrentRound } = useRound();
const { submitSurvey } = useMemberApi();
const { saveRoundSummary } = useRoundSummary();
const {
  setFavoriteStation,
  mockScore,
  getStationMissions,
  isStationMissionComplete,
  initStationQuest,
} = useStationQuest();

/** เรียกซ้ำเพื่อความปลอดภัย (ปกติหน้า /station/milk ที่พามาถึงนี่โหลดไปแล้ว) —
 * กันเคส Hard Refresh ตรงหน้านี้เอง (ดู composables/useStationQuest.ts) */
onMounted(async () => {
  await initStationQuest();
});

const STATION_ORDER: StationType[] = ["corn", "cow", "soil", "milk"];
/** Mapping เดิมของระบบ (ดู server-gas/SurveyService.gs ผ่าน submitSurvey()) —
 * favoriteStationRating รับแค่ 1-5 เท่านั้น ใช้ mapping เดียวกับ Popup แบบประเมิน
 * เดิมใน pages/scan.vue เพื่อให้ข้อมูลย้อนหลังตีความสอดคล้องกัน */
const RATING_BY_STATION: Record<StationType, number> = { corn: 1, soil: 2, cow: 3, milk: 4 };

const stationChoices = computed(() =>
  STATION_ORDER.map((id) => ({
    id,
    name: stations.value.find((s) => s.id === id)?.name ?? STATION_TYPE_META[id].label,
    icon: STATION_TYPE_META[id].icon,
  })),
);

const selectedFavoriteStationId = ref<StationType | null>(null);
const submitting = ref(false);

function selectStation(id: StationType): void {
  if (submitting.value) return;
  selectedFavoriteStationId.value = id;
}

/**
 * กด "ส่งแบบประเมิน" — เก็บฐานที่เลือกไว้ในเครื่องเสมอ (setFavoriteStation) แล้ว
 * ปิด Round ตามช่องทางเดิมของระบบ (Online: submitSurvey() + endCurrentRound() /
 * Offline: endRound()) ก่อนเก็บสรุปผล "รอบนี้" ด้วยข้อมูล Mock (ฐานที่ทำครบ 3/3
 * + mockScore) ผ่าน useRoundSummary เดิม แล้วพาไป /round-summary
 *
 * [Fix — root cause ของ "หน้าสรุปผลขึ้น 0 คะแนน/ไม่มีฐานที่เล่นเลย ทั้งที่เพิ่งเล่น
 * ครบ 4 ฐาน"] เดิมอ่าน completedStations/mockScore "หลัง" เรียก endCurrentRound()
 * ไปแล้ว — endCurrentRound() เคลียร์ currentRoundId เป็น null ใน finally ของมันเอง
 * เสมอ ซึ่งเปลี่ยน effectiveRoundKey ใน useStationQuest.ts ทันที (จาก
 * "online:<roundId>" เป็น "no-round") ไป Trigger watch(effectiveRoundKey) ที่นั่น
 * ให้เข้าใจว่า "เปลี่ยนรอบใหม่แล้ว" แล้วล้าง Progress/mockScore ทั้งหมดทิ้งทันที
 * ก่อนที่โค้ดด้านล่างจะทันได้อ่านค่าจริงเสียอีก (อ่านได้ค่าว่างเปล่าเสมอ) แก้โดย
 * จับค่าสรุปผลทั้งหมด (completedStations/correctCount/mockScore) ไว้ "ก่อน" เรียก
 * endCurrentRound()/submitSurvey()/endRound() เสมอ — เหมือนที่ต้องจับ roundId ไว้
 * ก่อนด้วยเหตุผลเดียวกัน (ดู pages/scan.vue เดิม)
 */
async function handleSubmit(): Promise<void> {
  if (!selectedFavoriteStationId.value || submitting.value) return;
  submitting.value = true;
  try {
    setFavoriteStation(selectedFavoriteStationId.value);

    const roundIdForSummary = currentRoundId.value;
    const userIdForSummary = profile.value?.memberId || profile.value?.uid || null;
    let startTimeIso: string | null = null;
    let endTimeIso = new Date().toISOString();

    // [Fix] จับค่าสรุปผล Mock ทั้งหมดไว้ก่อนเสมอ ก่อนเรียกอะไรที่อาจทำให้ Round
    // เปลี่ยน/จบ (ดูคอมเมนต์ด้านบน)
    const completedStations = STATION_ORDER.filter((id) => isStationMissionComplete(id)).map((id) => ({
      name: stationChoices.value.find((s) => s.id === id)?.name ?? id,
      points: 0,
    }));
    const correctCount = STATION_ORDER.reduce((sum, id) => {
      const missions = getStationMissions(id);
      return sum + (["smell", "question"] as const).filter((k) => missions[k].answer?.isCorrect).length;
    }, 0);
    const mockScoreForSummary = mockScore.value;

    if (isOfflineMode.value) {
      endRound();
    } else if (profile.value?.memberId && roundIdForSummary) {
      try {
        await submitSurvey({
          roundId: roundIdForSummary,
          userId: profile.value.memberId,
          firstName: profile.value.firstName,
          favoriteStationRating: RATING_BY_STATION[selectedFavoriteStationId.value],
        });
      } catch (err) {
        console.error("[evaluation] submitSurvey failed", err);
      }
      const ended = await endCurrentRound(profile.value.memberId);
      if (ended) {
        startTimeIso = ended.startTime || null;
        endTimeIso = ended.endTime || endTimeIso;
      }
    }

    saveRoundSummary({
      mode: isOfflineMode.value ? "offline" : "online",
      startTime: startTimeIso,
      endTime: endTimeIso,
      stations: completedStations,
      totalPoint: 0,
      roundId: isOfflineMode.value ? null : roundIdForSummary,
      userId: userIdForSummary,
      questionPoints: mockScoreForSummary,
      questionCorrectCount: correctCount,
      endedReason: "manual",
    });
  } finally {
    submitting.value = false;
  }
  await navigateTo("/round-summary");
}
</script>

<template>
  <div class="page">
    <PageHeader title="แบบประเมิน" back-to="/stations" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__content">
      <p class="page__question">ท่านชอบฐานใดมากที่สุด?</p>

      <div class="choice-list">
        <button
          v-for="choice in stationChoices"
          :key="choice.id"
          type="button"
          class="choice"
          :class="{ 'choice--selected': selectedFavoriteStationId === choice.id }"
          @click="selectStation(choice.id)"
        >
          <span class="choice__icon">{{ choice.icon }}</span>
          <span class="choice__name">{{ choice.name }}</span>
        </button>
      </div>

      <UButton
        block
        size="xl"
        color="primary"
        :loading="submitting"
        :disabled="!selectedFavoriteStationId || submitting"
        @click="handleSubmit"
      >
        ส่งแบบประเมิน
      </UButton>
    </div>
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
  animation: evaluation-spin 1s linear infinite;
  color: var(--farm-accent-dark);
}

.page__content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 1.1rem 2rem;
}

.page__question {
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.choice-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.choice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
}

.choice__icon {
  font-size: 1.85rem;
  line-height: 1;
}

.choice__name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.choice--selected {
  border-color: var(--farm-accent-dark);
  background: var(--farm-accent);
}

.choice--selected .choice__name {
  color: var(--farm-cream);
}

@keyframes evaluation-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
