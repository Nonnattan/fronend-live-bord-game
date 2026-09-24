<script setup lang="ts">
/**
 * components/mission/MissionQuestionPopup.vue
 * ---------------------------------------------------------------------------
 * Popup "ภารกิจ + คำถามประจำฐาน" ตาม Flow ใหม่ — เปิดทันทีหลังสแกน QR เข้าฐาน
 * สำเร็จ (ก่อนหน้า Popup "เข้าฐานสำเร็จ!" เดิม) แสดง:
 *   1) ข้อความภารกิจ (mission) ของฐานนั้น
 *   2) คำถามให้ตอบ (question) — เลือกได้ตามชนิด (choice/text/number)
 *   3) ผลลัพธ์หลังตอบ (ถูก = ได้คะแนน / ผิด = ไม่ได้คะแนน) + ปุ่ม "ไปต่อ"
 *
 * ใช้ UModal เหมือน Popup อื่น ๆ ในหน้า pages/scan.vue ทุกประการ (dismissible
 * false, close false — บังคับกดปุ่มในนี้เท่านั้น) แต่แยกเป็น component ของ
 * ตัวเองต่างหาก ไม่ยัดเข้าไปในไฟล์ scan.vue ที่ใหญ่และละเอียดอ่อนอยู่แล้ว —
 * scan.vue แค่ import มาวาง + ส่ง props/ฟัง event เท่านั้น (ดู pages/scan.vue
 * ส่วน "Popup ภารกิจ + คำถาม")
 *
 * Component นี้ "ไม่เรียก" useMemberApi()/API ใด ๆ เอง — รับ `question` +
 * `answered` (ผลที่ตอบไปแล้วถ้ามี) เป็น props แล้ว emit `submit` ให้ผู้เรียกใช้
 * (scan.vue) เป็นคนเรียก useQuestion().submitAnswer() เอง คล้ายรูปแบบ
 * CameraCapture.vue (emit เฉยๆ ไม่ยุ่งกับ business logic เอง)
 */

import type { StationQuestion, StationAnswer } from '~/types/question'

const props = defineProps<{
  open: boolean
  stationName: string
  question: StationQuestion
  /** ผลที่เคยตอบไปแล้ว (ถ้ามี) — มีค่า = แสดง "ผลลัพธ์" ทันทีแบบอ่านอย่างเดียว
   * ไม่เปิดให้แก้ไขคำตอบซ้ำ (กติกา "ตอบได้ครั้งเดียว ผิดแล้วผิดเลย") */
  answered?: StationAnswer | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  /** ผู้เล่นกดส่งคำตอบ — scan.vue เป็นคนเรียก useQuestion().submitAnswer() จริง
   * แล้ว "ต้อง" อัปเดต props.answered กลับมา (ผ่าน state ที่ผูกกับ questionId
   * เดียวกัน) ให้ popup นี้เปลี่ยนไปแสดงผลลัพธ์เอง (re-render ตาม answered) */
  submit: [value: string]
  /** กดปุ่ม "ไปต่อ" หลังเห็นผลลัพธ์แล้ว — ปิด popup + ไปทำ flow ต่อ (Popup
   * "เข้าฐานสำเร็จ" เดิม) */
  continue: []
}>()

const answerValue = ref('')
const submitting = ref(false)
const validationError = ref('')

// รีเซ็ตค่าที่กรอกทุกครั้งที่เปลี่ยนคำถาม (เผื่อ component ถูกใช้ซ้ำข้ามฐาน)
watch(
  () => props.question.id,
  () => {
    answerValue.value = ''
    validationError.value = ''
    submitting.value = false
  },
)

const hasResult = computed(() => !!props.answered)

function selectChoice(choice: string): void {
  if (hasResult.value) return
  answerValue.value = choice
  validationError.value = ''
}

async function handleSubmit(): Promise<void> {
  if (hasResult.value) return
  if (!answerValue.value.trim()) {
    validationError.value = 'กรุณาตอบคำถามก่อนกดยืนยัน'
    return
  }
  submitting.value = true
  try {
    emit('submit', answerValue.value.trim())
  } finally {
    // ปิด spinner ทันที — ผลลัพธ์จริงมาจาก props.answered ที่ scan.vue อัปเดตกลับ
    // (submitAnswer() ของ useQuestion.ts ตัดสินบนเครื่อง ไม่มีการรอ network เลย)
    submitting.value = false
  }
}

function handleContinue(): void {
  emit('continue')
}
</script>

<template>
  <UModal
    :open="open"
    :title="hasResult ? 'ผลคำตอบ' : `ภารกิจประจำ${stationName}`"
    :dismissible="false"
    :close="false"
    @update:open="(v) => emit('update:open', v)"
  >
    <template #body>
      <!-- ยังไม่ตอบ: แสดงภารกิจ + คำถาม -->
      <div v-if="!hasResult" class="mission-question">
        <div class="mission-question__mission">
          <UIcon name="i-lucide-map-pinned" class="mission-question__mission-icon" />
          <p class="mission-question__mission-text">{{ question.mission }}</p>
        </div>

        <p class="mission-question__question">{{ question.question }}</p>

        <!-- ปรนัย -->
        <div v-if="question.answerType === 'choice'" class="mission-question__choices">
          <button
            v-for="choice in question.choices"
            :key="choice"
            type="button"
            class="mission-question__choice"
            :class="{ 'mission-question__choice--selected': answerValue === choice }"
            @click="selectChoice(choice)"
          >
            {{ choice }}
          </button>
        </div>

        <!-- อัตนัย/ตัวเลข -->
        <UInput
          v-else
          v-model="answerValue"
          :type="question.answerType === 'number' ? 'number' : 'text'"
          size="xl"
          placeholder="พิมพ์คำตอบที่นี่"
          @keyup.enter="handleSubmit"
        />

        <p v-if="validationError" class="mission-question__error">{{ validationError }}</p>
      </div>

      <!-- ตอบแล้ว: แสดงผลลัพธ์ — ตั้งใจไม่บอกว่าถูก/ผิด บอกแค่ได้กี่คะแนน
           (0 คะแนน = ตอบผิด แต่ไม่ประกาศตรง ๆ ว่าผิด) -->
      <div v-else class="mission-question__result">
        <UIcon name="i-lucide-sparkles" class="mission-question__result-icon" />
        <p class="mission-question__result-answer">คำตอบของคุณ: {{ answered!.answer }}</p>
        <p class="mission-question__result-points">ได้ {{ answered!.pointsEarned }} คะแนน</p>
      </div>
    </template>

    <template #footer>
      <UButton v-if="!hasResult" block color="primary" :loading="submitting" @click="handleSubmit">
        ยืนยันคำตอบ
      </UButton>
      <UButton v-else block color="primary" @click="handleContinue"> เดินทางไปเผ่าต่อไป </UButton>
    </template>
  </UModal>
</template>

<style scoped>
.mission-question {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.mission-question__mission {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.65rem 0.8rem;
  background: var(--farm-cream-dark);
  border-radius: 0.75rem;
  border: 1.5px dashed var(--farm-wood);
}

.mission-question__mission-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.mission-question__mission-text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--farm-text-dark);
  font-weight: 600;
}

.mission-question__question {
  margin: 0;
  font-size: 1.05rem;
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

.mission-question__error {
  margin: 0;
  font-size: 0.8rem;
  color: var(--farm-wood-dark);
  text-align: center;
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
  color: var(--farm-accent-dark);
}

.mission-question__result-answer {
  margin: 0;
  font-size: 0.9rem;
  color: var(--farm-text-muted);
}

.mission-question__result-points {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}
</style>
