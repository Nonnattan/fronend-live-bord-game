<script setup lang="ts">
/**
 * components/station/StationMissionCard.vue
 * ---------------------------------------------------------------------------
 * การ์ด 1 ใบในลิสต์ภารกิจของฐาน (ดมกลิ่น / ตอบคำถาม / สแกน QR) — กดเพื่อเปิด
 * ป็อปอัพภารกิจนั้น ๆ ต่อ (ดู StationMissionQuestion.vue / StationMissionQr.vue)
 */
defineProps<{
  icon: string
  title: string
  description: string
  completed: boolean
}>()

const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <button type="button" class="mission-card" :class="{ 'mission-card--completed': completed }" @click="emit('open')">
    <span class="mission-card__icon">{{ icon }}</span>
    <span class="mission-card__body">
      <span class="mission-card__title">{{ title }}</span>
      <span class="mission-card__desc">{{ description }}</span>
    </span>
    <UIcon
      :name="completed ? 'i-lucide-check-circle-2' : 'i-lucide-chevron-right'"
      class="mission-card__chevron"
      :class="{ 'mission-card__chevron--done': completed }"
    />
  </button>
</template>

<style scoped>
.mission-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 0.9rem;
  border-radius: 0.9rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
  text-align: left;
}

.mission-card--completed {
  border-color: var(--farm-accent-dark);
  background: var(--farm-cream-dark);
}

.mission-card__icon {
  font-size: 1.75rem;
  line-height: 1;
  flex-shrink: 0;
}

.mission-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.mission-card__title {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.mission-card__desc {
  font-size: 0.75rem;
  color: var(--farm-text-muted);
}

.mission-card__chevron {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--farm-text-muted);
  flex-shrink: 0;
}

.mission-card__chevron--done {
  color: var(--farm-accent-dark);
}
</style>
