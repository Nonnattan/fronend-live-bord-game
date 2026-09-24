<script setup lang="ts">
/**
 * components/photo-question/PhotoQuestion.vue
 * ---------------------------------------------------------------------------
 * Component หลักของระบบ "Photo Question" — รับคำถามที่ answerType === 'photo'
 * แล้วพา flow ทั้งหมด: idle (แสดงคำถาม) -> camera (เปิดกล้อง) -> preview
 * (ตรวจสอบรูป) -> confirmed (ยืนยันแล้ว) รวมถึง error state ระหว่างทาง
 *
 * Phase นี้ทำแค่ UI/Flow การถ่ายรูปเท่านั้น — "ยังไม่ต้องตรวจว่ารูปถูกหรือผิด"
 * ไม่มี AI Detection / ไม่ Train Model / ไม่เรียก AI API ใด ๆ ในไฟล์นี้
 *
 * เป็น component แยกอิสระจากระบบ Photo Quest เดิม (components/photo-quest/*)
 * โดยสมบูรณ์ — ไม่แชร์ state/logic กัน คนละ concept กัน:
 *   - photo-quest (เดิม)  = เควสถ่ายรูปแบบมีหน้าของตัวเอง + AI detection ทันที
 *   - photo-question (ใหม่, ไฟล์นี้) = คำถามชนิดหนึ่งภายในระบบ Question/Station
 *     (answerType: 'photo') ที่ยัง "ไม่" ตรวจอะไรทั้งสิ้นใน Phase นี้ — แค่เก็บ
 *     รูปที่ยืนยันแล้วไว้ใน State เตรียมส่งต่อให้ Detection Engine ใน Phase ถัดไป
 *
 * การเชื่อมกับระบบ Station/Question จริงจะทำใน Phase ถัดไป (ตอนนี้เป็น mockup —
 * ดู pages/photo-question-demo.vue สำหรับตัวอย่างการใช้งาน/ทดสอบบนมือถือ)
 */

export type PhotoQuestionState = 'idle' | 'camera' | 'preview' | 'confirmed' | 'error'

export interface PhotoQuestionConfig {
  /** ข้อความช่วยเหลือ/คำใบ้เพิ่มเติมใต้คำถาม (ไม่บังคับ) */
  hint?: string
  /** อนุญาตให้ถ่ายใหม่หลังยืนยันแล้วหรือไม่ (ค่าเริ่มต้น true) */
  allowRetakeAfterConfirm?: boolean
}

export interface PhotoQuestionConfirmedPayload {
  questionId: string
  photoDataUrl: string
  capturedAt: number
}

const props = withDefaults(
  defineProps<{
    questionId: string
    question: string
    points: number
    config?: PhotoQuestionConfig
  }>(),
  {
    config: () => ({}),
  },
)

const emit = defineEmits<{
  /** ผู้เล่นยืนยันรูปแล้ว — ส่งข้อมูลกลับให้หน้าที่เรียกใช้ (ระบบ Station/Question)
   * ไปเก็บใน State/LocalStorage ต่อ ตามความเหมาะสมของแต่ละหน้า (ไฟล์นี้ไม่ยุ่งกับ
   * การเก็บถาวรเอง เพื่อให้ Phase ถัดไปนำไปต่อ Detection Engine ได้อย่างอิสระ) */
  confirmed: [payload: PhotoQuestionConfirmedPayload]
}>()

const state = ref<PhotoQuestionState>('idle')
const capturedPhoto = ref<string | null>(null)
const cameraErrorMessage = ref('')

const { isOnline } = useOfflineSync()

const allowRetakeAfterConfirm = computed(() => props.config?.allowRetakeAfterConfirm ?? true)

function openCamera(): void {
  cameraErrorMessage.value = ''
  state.value = 'camera'
}

function handleCapture(photoDataUrl: string): void {
  capturedPhoto.value = photoDataUrl
  state.value = 'preview'
}

function handleCameraCancel(): void {
  state.value = 'idle'
}

function handleRetake(): void {
  capturedPhoto.value = null
  state.value = 'camera'
}

function handleConfirm(): void {
  if (!capturedPhoto.value) return
  state.value = 'confirmed'
  emit('confirmed', {
    questionId: props.questionId,
    photoDataUrl: capturedPhoto.value,
    capturedAt: Date.now(),
  })
}

function handleRetakeAfterConfirm(): void {
  capturedPhoto.value = null
  state.value = 'camera'
}
</script>

<template>
  <div class="photo-question">
    <!-- idle: แสดงคำถาม + ปุ่มถ่ายรูป -->
    <div v-if="state === 'idle'" class="photo-question__idle">
      <p class="photo-question__question">{{ question }}</p>
      <p v-if="config?.hint" class="photo-question__hint">{{ config.hint }}</p>

      <p v-if="!isOnline" class="photo-question__offline-note">
        <UIcon name="i-lucide-wifi-off" />
        ออฟไลน์อยู่ — ถ่ายรูปได้ตามปกติ ระบบจะเก็บไว้ก่อน
      </p>

      <UButton icon="i-lucide-camera" size="xl" @click="openCamera"> 📷 ถ่ายรูป </UButton>
    </div>

    <!-- camera: เปิดกล้อง -->
    <div v-else-if="state === 'camera'" class="photo-question__camera">
      <PhotoCamera @capture="handleCapture" @cancel="handleCameraCancel" />
    </div>

    <!-- preview: ตรวจสอบรูปก่อนยืนยัน -->
    <div v-else-if="state === 'preview' && capturedPhoto" class="photo-question__preview">
      <PhotoPreview :photo-data-url="capturedPhoto" @retake="handleRetake" @confirm="handleConfirm" />
    </div>

    <!-- confirmed: ยืนยันแล้ว -->
    <div v-else-if="state === 'confirmed'" class="photo-question__confirmed">
      <UIcon name="i-lucide-check-circle-2" class="photo-question__confirmed-icon" />
      <p class="photo-question__confirmed-title">ถ่ายรูปแล้ว</p>
      <p class="photo-question__confirmed-note">รอตรวจสอบในขั้นตอนถัดไป</p>

      <img v-if="capturedPhoto" :src="capturedPhoto" alt="รูปที่ยืนยันแล้ว" class="photo-question__confirmed-thumb" />

      <UButton v-if="allowRetakeAfterConfirm" variant="outline" size="sm" @click="handleRetakeAfterConfirm">
        ถ่ายใหม่อีกครั้ง
      </UButton>
    </div>

    <!-- error: กรณีอื่น ๆ ที่ยังไม่รู้จะจัดการยังไง (สำรองไว้เผื่ออนาคต) -->
    <div v-else-if="state === 'error'" class="photo-question__error">
      <UIcon name="i-lucide-triangle-alert" />
      <p>{{ cameraErrorMessage || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }}</p>
      <UButton variant="outline" @click="state = 'idle'">กลับ</UButton>
    </div>
  </div>
</template>

<style scoped>
.photo-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.photo-question__idle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 1.5rem 1rem;
  text-align: center;
  width: 100%;
}

.photo-question__question {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--farm-text-dark);
}

.photo-question__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--farm-text-muted);
}

.photo-question__offline-note {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.78rem;
  color: var(--farm-wood-dark);
  background: var(--farm-cream-dark);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
}

.photo-question__camera,
.photo-question__preview {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.photo-question__confirmed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  text-align: center;
}

.photo-question__confirmed-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--farm-accent-dark);
}

.photo-question__confirmed-title {
  margin: 0;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--farm-text-dark);
}

.photo-question__confirmed-note {
  margin: 0;
  font-size: 0.82rem;
  color: var(--farm-text-muted);
}

.photo-question__confirmed-thumb {
  width: 100%;
  max-width: 220px;
  border-radius: 0.75rem;
  border: 2px solid var(--farm-wood);
  margin: 0.5rem 0;
}

.photo-question__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  color: var(--farm-wood-dark);
  text-align: center;
}
</style>
