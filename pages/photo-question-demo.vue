<script setup lang="ts">
/**
 * pages/photo-question-demo.vue
 * ---------------------------------------------------------------------------
 * หน้าทดสอบชั่วคราวสำหรับระบบ "Photo Question" (mockup Phase 1 — UI/Flow
 * การถ่ายรูปเท่านั้น ยังไม่ผูกกับ Station/Question จริง ยังไม่มี AI Detection)
 *
 * ไม่ได้ผูกกับ Flow เกมจริงใด ๆ — สร้างขึ้นเพื่อให้ทดสอบบนมือถือได้ก่อนที่จะ
 * เชื่อมเข้ากับระบบ Station/Question จริงใน Phase ถัดไป ลบไฟล์นี้ทิ้งได้ทันที
 * ตอนเชื่อมระบบจริงเสร็จแล้ว (ไม่กระทบไฟล์อื่นใดในระบบเดิมเลย)
 */

import PhotoQuestion from '~/components/photo-question/PhotoQuestion.vue'
import type { PhotoQuestionConfirmedPayload } from '~/components/photo-question/PhotoQuestion.vue'

definePageMeta({ layout: 'app' })

// คำถามตัวอย่าง (mock) — รูปแบบเดียวกับที่ Station/Question ระบบจริงควรส่งมาให้
// ในอนาคต (questionId, question, points, config)
const mockQuestion = {
  questionId: 'demo-photo-q-1',
  question: 'ถ่ายรูปสัตว์เลี้ยงในฟาร์มที่คุณเห็น ณ ฐานนี้',
  points: 50,
  config: {
    hint: 'ถ่ายให้เห็นสัตว์ชัดเจนในกรอบภาพ',
  },
}

const lastConfirmed = ref<PhotoQuestionConfirmedPayload | null>(null)

function handleConfirmed(payload: PhotoQuestionConfirmedPayload) {
  lastConfirmed.value = payload
  // Phase ถัดไป: ส่ง payload.photoDataUrl เข้า Detection Engine ที่นี่
  // Phase นี้: เก็บไว้ดูผลลัพธ์เฉย ๆ เพื่อทดสอบ flow เท่านั้น
}
</script>

<template>
  <div class="photo-question-demo">
    <PageHeader title="ทดสอบ Photo Question" back-to="/home" />

    <div class="photo-question-demo__content">
      <p class="photo-question-demo__badge">🧪 หน้าทดสอบ — Phase 1 (UI/Flow เท่านั้น ยังไม่มี AI Detection)</p>

      <div class="photo-question-demo__card">
        <PhotoQuestion
          :question-id="mockQuestion.questionId"
          :question="mockQuestion.question"
          :points="mockQuestion.points"
          :config="mockQuestion.config"
          @confirmed="handleConfirmed"
        />
      </div>

      <div v-if="lastConfirmed" class="photo-question-demo__debug">
        <p class="photo-question-demo__debug-title">Payload ที่ emit ออกมา (สำหรับ Phase ถัดไป):</p>
        <pre>{{
          JSON.stringify(
            { questionId: lastConfirmed.questionId, capturedAt: lastConfirmed.capturedAt },
            null,
            2,
          )
        }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-question-demo__content {
  padding: 0 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.photo-question-demo__badge {
  font-size: 0.78rem;
  color: var(--farm-wood-dark);
  background: var(--farm-cream-dark);
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  margin: 0.25rem 0 0;
  text-align: center;
}

.photo-question-demo__card {
  width: 100%;
  max-width: 460px;
  border-radius: 1.25rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
  padding: 0.5rem;
}

.photo-question-demo__debug {
  width: 100%;
  max-width: 460px;
  font-size: 0.75rem;
  color: var(--farm-text-muted);
  background: var(--farm-cream-dark);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.photo-question-demo__debug-title {
  margin: 0 0 0.35rem;
  font-weight: 700;
}

.photo-question-demo__debug pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
