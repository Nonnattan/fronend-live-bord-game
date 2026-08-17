<script setup lang="ts">
/**
 * components/photo-quest/ResultFeedback.vue
 * ---------------------------------------------------------------------------
 * แสดงผลลัพธ์หลัง Detection Engine ตรวจภาพเสร็จ 1 ครั้ง — ผ่าน -> แสดงคะแนน +
 * ปุ่มกลับไปหน้ารายการเควส, ไม่ผ่าน -> แสดงเหตุผล + ปุ่มถ่ายใหม่ ตามสเปกข้อ
 * "ถ้าไม่ผ่าน → แจ้งเหตุผลและให้ถ่ายใหม่"
 */

import type { DetectionResult } from '~/types/photoQuest'

defineProps<{
  result: DetectionResult
  points: number
}>()

const emit = defineEmits<{ retry: []; done: [] }>()
</script>

<template>
  <div class="result-feedback" :class="result.passed ? 'result-feedback--pass' : 'result-feedback--fail'">
    <UIcon
      :name="result.passed ? 'i-lucide-party-popper' : 'i-lucide-circle-x'"
      class="result-feedback__icon"
    />
    <p class="result-feedback__title">
      {{ result.passed ? 'เควสสำเร็จ!' : 'ยังไม่ผ่านเงื่อนไข' }}
    </p>
    <p v-if="result.passed" class="result-feedback__points">+{{ points }} คะแนน</p>
    <p v-if="result.reason" class="result-feedback__reason">{{ result.reason }}</p>

    <UButton v-if="result.passed" size="lg" @click="emit('done')">กลับไปหน้าเควส</UButton>
    <UButton v-else size="lg" variant="outline" @click="emit('retry')">ถ่ายใหม่</UButton>
  </div>
</template>

<style scoped>
.result-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border-radius: 1rem;
  text-align: center;
}

.result-feedback--pass {
  background: var(--farm-cream-dark);
  border: 2px solid var(--farm-accent-dark);
}

.result-feedback--fail {
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.result-feedback__icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--farm-accent-dark);
}

.result-feedback--fail .result-feedback__icon {
  color: var(--farm-wood-dark);
}

.result-feedback__title {
  margin: 0;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--farm-text-dark);
}

.result-feedback__points {
  margin: 0;
  font-weight: 700;
  color: var(--farm-accent-dark);
}

.result-feedback__reason {
  margin: 0;
  font-size: 0.85rem;
  color: var(--farm-text-muted);
}
</style>
