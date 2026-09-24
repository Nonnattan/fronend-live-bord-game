<script setup lang="ts">
/**
 * components/station/StationMissionQuestion.vue
 * ---------------------------------------------------------------------------
 * [แก้ไข] ป็อปอัพคำถาม ใช้ร่วมกันทั้งภารกิจ SINGLE_QUESTION (1 คำถาม) และ
 * MULTI_QUESTION (N คำถาม — ไม่ hardcode จำนวน) — รับคำถามจริงจาก Backend ผ่าน
 * useQuestion().getQuestionsForMission() (ตัวหน้าเต็มเป็นคนดึงมาให้ ไม่ดึงเอง
 * ที่นี่) เป็น Component เดียวไม่ต้องมี mode prop/สร้างคู่แฝง — ตัวหน้าเต็มเป็น
 * คนเลือกว่าจะเรียก useStationMissions().submitSingleQuestion()/
 * submitMultiQuestion() ตัวไหนตอน @submit ไม่ตัดสิน/คำนวณคะแนนเองที่นี่เลย
 * แค่รับ `result` กลับมาแสดงผล — ตอบได้ครั้งเดียว มี result แล้วจะ Lock เป็นหน้า
 * ผลลัพธ์ถาวร
 *
 * รองรับ answerType ทั้ง 3 แบบต่อคำถาม (choice/text/number — ดู
 * types/question.ts) ไม่ใช่แค่ตัวเลือกปรนัยแบบ Mock เดิมอีกต่อไป
 */
import type { StationQuestion } from "~/types/question";

export interface MissionQuestionResult {
  correctCount: number;
  totalCount: number;
  totalPoints: number;
}

const props = defineProps<{
  open: boolean;
  questions: StationQuestion[];
  result: MissionQuestionResult | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [answers: Array<{ questionId: string; answer: string }>];
  close: [];
}>();

const localAnswers = ref<Record<string, string>>({});

watch(
  () => props.questions.map((q) => q.id).join(","),
  () => {
    localAnswers.value = {};
  },
);

const hasResult = computed(() => !!props.result);
const isMulti = computed(() => props.questions.length > 1);
const allAnswered = computed(() =>
  props.questions.every((q) => (localAnswers.value[q.id] ?? "").trim() !== ""),
);

function selectChoice(questionId: string, choice: string): void {
  if (hasResult.value) return;
  localAnswers.value = { ...localAnswers.value, [questionId]: choice };
}

function handleSubmit(): void {
  if (hasResult.value || !allAnswered.value) return;
  emit(
    "submit",
    props.questions.map((q) => ({
      questionId: q.id,
      answer: localAnswers.value[q.id] ?? "",
    })),
  );
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
        <div
          v-for="(question, idx) in questions"
          :key="question.id"
          class="mission-question__item"
        >
          <p v-if="isMulti" class="mission-question__index">
            ข้อ {{ idx + 1 }} / {{ questions.length }}
          </p>
          <p class="mission-question__text">{{ question.question }}</p>

          <div v-if="question.answerType === 'choice'" class="mission-question__choices">
            <button
              v-for="c in question.choices"
              :key="c"
              type="button"
              class="mission-question__choice"
              :class="{ 'mission-question__choice--selected': localAnswers[question.id] === c }"
              @click="selectChoice(question.id, c)"
            >
              {{ c }}
            </button>
          </div>
          <input
            v-else
            v-model="localAnswers[question.id]"
            class="mission-question__input"
            :type="question.answerType === 'number' ? 'number' : 'text'"
            :placeholder="question.answerType === 'number' ? 'พิมพ์ตัวเลขคำตอบ' : 'พิมพ์คำตอบ'"
          />
        </div>
      </div>

      <div v-else class="mission-question__result">
        <UIcon
          v-if="result!.correctCount > 0"
          name="i-lucide-check-circle-2"
          class="mission-question__result-icon mission-question__result-icon--correct"
        />
        <p v-if="result!.totalCount > 1" class="mission-question__result-summary">
          ตอบถูก {{ result!.correctCount }} / {{ result!.totalCount }} ข้อ
        </p>
        <p
          v-if="result!.totalPoints > 0"
          class="mission-question__result-points"
        >
          +{{ result!.totalPoints }} คะแนน
        </p>
        <p v-else class="mission-question__result-points mission-question__result-points--wrong">
          0 คะแนน
        </p>
      </div>
    </template>

    <template #footer>
      <UButton
        v-if="!hasResult"
        block
        color="primary"
        :disabled="!allAnswered"
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
  gap: 1.1rem;
}

.mission-question__item {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.mission-question__index {
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--farm-text-muted);
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

.mission-question__input {
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
  color: var(--farm-text-dark);
  font-weight: 700;
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

.mission-question__result-summary {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.mission-question__result-points {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.mission-question__result-points--wrong {
  color: var(--farm-wood-dark);
}
</style>
