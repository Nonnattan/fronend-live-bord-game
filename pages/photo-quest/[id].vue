<script setup lang="ts">
/**
 * pages/photo-quest/[id].vue
 * ---------------------------------------------------------------------------
 * หน้าทำเควสถ่ายรูป 1 เควส: เปิดกล้อง (CameraCapture.vue) -> ถ่ายรูป -> ส่งเข้า
 * Detection Engine ผ่าน usePhotoQuest().attemptQuest() -> แสดงผล
 * (ResultFeedback.vue) — ผ่านแล้วกลับไปหน้ารายการ, ไม่ผ่านให้ถ่ายใหม่
 *
 * ไม่แตะ pages/scan.vue หรือ Logic กล้องของ QR Scanner เดิมเลย — ใช้
 * CameraCapture.vue ซึ่งเป็น <video>/getUserMedia อิสระของตัวเอง
 */

import CameraCapture from '~/components/photo-quest/CameraCapture.vue'
import ResultFeedback from '~/components/photo-quest/ResultFeedback.vue'
import type { DetectionResult } from '~/types/photoQuest'

definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

const route = useRoute()
const questId = route.params.id as string

const { quests, findQuest, initPhotoQuest, attemptQuest, isCompleted } = usePhotoQuest()

const isChecking = ref(false)
const result = ref<DetectionResult | null>(null)
const cameraRef = ref<InstanceType<typeof CameraCapture> | null>(null)

onMounted(async () => {
  if (quests.value.length === 0) {
    await initPhotoQuest()
  }
})

const quest = computed(() => findQuest(questId))
const alreadyCompleted = computed(() => (quest.value ? isCompleted(quest.value.id) : false))

async function handleCapture(image: HTMLImageElement) {
  if (!quest.value) return
  isChecking.value = true
  result.value = null
  try {
    result.value = await attemptQuest(quest.value, image)
  } finally {
    isChecking.value = false
  }
}

function retry() {
  result.value = null
  cameraRef.value?.startCamera()
}

function done() {
  navigateTo('/photo-quest')
}
</script>

<template>
  <div v-if="isReady" class="photo-quest-detail">
    <PageHeader :title="quest?.name ?? 'เควสถ่ายรูป'" back-to="/photo-quest" />

    <div v-if="!quest" class="photo-quest-detail__missing">ไม่พบเควสนี้</div>

    <div v-else class="photo-quest-detail__content">
      <p class="photo-quest-detail__desc">{{ quest.description }}</p>

      <img
        v-if="quest.exampleImageUrl"
        :src="quest.exampleImageUrl"
        alt="ตัวอย่างภาพที่ต้องถ่าย"
        class="photo-quest-detail__example"
      />

      <div v-if="alreadyCompleted && !result" class="photo-quest-detail__done">
        <UIcon name="i-lucide-check-circle-2" class="photo-quest-detail__done-icon" />
        <p>ทำเควสนี้สำเร็จแล้ว</p>
      </div>

      <template v-else-if="!result">
        <div v-if="isChecking" class="photo-quest-detail__checking">
          <UIcon name="i-lucide-loader-2" class="photo-quest-detail__spinner" />
          <p>กำลังตรวจสอบภาพ...</p>
        </div>
        <CameraCapture v-else ref="cameraRef" @capture="handleCapture" />
      </template>

      <ResultFeedback
        v-else
        :result="result"
        :points="quest.points"
        @retry="retry"
        @done="done"
      />
    </div>
  </div>
</template>

<style scoped>
.photo-quest-detail__content {
  padding: 0 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.photo-quest-detail__desc {
  color: var(--farm-text-muted);
  text-align: center;
  margin: 0;
}

.photo-quest-detail__example {
  width: 100%;
  max-width: 280px;
  border-radius: 0.75rem;
  border: 2px solid var(--farm-wood);
}

.photo-quest-detail__missing,
.photo-quest-detail__done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  color: var(--farm-text-muted);
  text-align: center;
}

.photo-quest-detail__done-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--farm-accent-dark);
}

.photo-quest-detail__checking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  color: var(--farm-text-muted);
}

.photo-quest-detail__spinner {
  width: 1.75rem;
  height: 1.75rem;
  animation: photo-quest-spin 1s linear infinite;
}

@keyframes photo-quest-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
