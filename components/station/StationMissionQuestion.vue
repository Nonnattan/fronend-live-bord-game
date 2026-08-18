<script setup lang="ts">
/**
 * components/station/StationMissionQuestion.vue
 * ---------------------------------------------------------------------------
 * ป็อปอัพคำถาม ใช้ร่วมกันทั้งภารกิจ "ดมกลิ่น" และ "ตอบคำถาม" (โครงเดียวกัน
 * ต่างกันแค่ชุดคำถาม/ไอคอนหัวข้อ) เป็น Mock ล้วน ๆ — ไม่เรียก useQuestion()/
 * submitAnswer() จริงใด ๆ ทั้งสิ้น (ผู้เรียกใช้เป็นคนตัดสิน/บันทึกผลผ่าน
 * useStationQuest().answerMission() แล้วส่ง `answer` กลับมาให้ popup นี้แสดงผล)
 * ตอบได้ครั้งเดียว — เมื่อมี `answer` แล้วจะ Lock เป็นหน้าผลลัพธ์ถาวร
 */
import type {
  MissionAnswerResult,
  MissionMockQuestion,
} from "~/types/stationMission";
import { MISSION_META } from "~/utils/stationMissionMeta";

const props = defineProps<{
  open: boolean;
  question: MissionMockQuestion;
  answer: MissionAnswerResult | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [choiceId: string];
  close: [];
}>();

const selectedChoiceId = ref("");

watch(
  () => props.question.questionId,
  () => {
    selectedChoiceId.value = "";
  },
);

const hasResult = computed(() => !!props.answer);
const meta = computed(() => MISSION_META[props.question.kind]);

function selectChoice(choiceId: string): void {
  if (hasResult.value) return;
  selectedChoiceId.value = choiceId;
}

function handleSubmit(): void {
  if (hasResult.value || !selectedChoiceId.value) return;
  emit("submit", selectedChoiceId.value);
}
</script>

<template>
  <UModal
    :open="open"
    :dismissible="false"
    :close="false"
    @update:open="(v) => emit('update:open', v)"
  >
    <template #body>
      <div v-if="!hasResult" class="mission-question">
        <p class="mission-question__text">{{ question.text }}</p>
        <div class="mission-question__choices">
          <button
            v-for="c in question.choices"
            :key="c.id"
            type="button"
            class="mission-question__choice"
            :class="{
              'mission-question__choice--selected': selectedChoiceId === c.id,
            }"
            @click="selectChoice(c.id)"
          >
            {{ c.label }}
          </button>
        </div>
      </div>

      <div v-else class="mission-question__result">
        <!-- แสดงไอคอนเฉพาะตอนที่ตอบถูกเท่านั้น -->
        <UIcon
          v-if="answer!.isCorrect"
          name="i-lucide-check-circle-2"
          class="mission-question__result-icon mission-question__result-icon--correct"
        />

        <!-- ใช้คลาสหลักเดียวกันเพื่อให้ขนาดตัวหนังสือเท่ากัน -->
        <p v-if="answer!.isCorrect" class="mission-question__result-points">
          +{{ answer!.pointsEarned }} คะแนน
        </p>
        <p
          v-else
          class="mission-question__result-points mission-question__result-points--wrong"
        >
          0 คะแนน
        </p>
      </div>
    </template>

    <template #footer>
      <UButton
        v-if="!hasResult"
        block
        color="primary"
        :disabled="!selectedChoiceId"
        @click="handleSubmit"
      >
        ยืนยันคำตอบ
      </UButton>
      <UButton v-else block color="primary" @click="emit('close')">ปิด</UButton>
    </template>
  </UModal>
</template>

<style scoped>
.mission-question {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.mission-question__text {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  text-align: center;
}

.mission-question__choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mission-question__choice {
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
  color: var(--farm-text-dark);
  font-weight: 700;
  text-align: left;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.mission-question__choice--selected {
  background: var(--farm-accent);
  border-color: var(--farm-accent-dark);
  color: var(--farm-cream);
}

.mission-question__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
  padding: 0.5rem 0 0.25rem;
}

.mission-question__result-icon {
  width: 3rem;
  height: 3rem;
}

.mission-question__result-icon--correct {
  color: var(--farm-accent-dark);
}

.mission-question__result-points {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

/* เพิ่ม class สำหรับเปลี่ยนสีข้อความ 0 คะแนน (ขนาดเท่ากัน) */
.mission-question__result-points--wrong {
  color: var(--farm-wood-dark);
}
</style>
