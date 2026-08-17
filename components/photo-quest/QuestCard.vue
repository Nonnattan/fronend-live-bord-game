<script setup lang="ts">
/**
 * components/photo-quest/QuestCard.vue
 * ---------------------------------------------------------------------------
 * การ์ด 1 ใบ = 1 Photo Quest ใน pages/photo-quest.vue — แสดงชื่อ/คำอธิบาย/
 * คะแนน/สถานะ (ทำสำเร็จแล้ว/ยังไม่ทำ/ทำตอนออฟไลน์ไม่ได้) ไม่มี logic ตรวจจับ
 * ใด ๆ ในไฟล์นี้เลย เป็น presentational component ล้วน ๆ
 */

import type { PhotoQuest } from '~/types/photoQuest'

const props = defineProps<{
  quest: PhotoQuest
  completed: boolean
  offlineCapable: boolean
  isOnline: boolean
}>()

const emit = defineEmits<{ open: [] }>()

const disabled = computed(() => !props.isOnline && !props.offlineCapable)
</script>

<template>
  <button
    type="button"
    class="quest-card"
    :class="{ 'quest-card--done': completed, 'quest-card--disabled': disabled }"
    :disabled="disabled"
    @click="emit('open')"
  >
    <div class="quest-card__icon">
      <UIcon :name="completed ? 'i-lucide-check-circle-2' : 'i-lucide-camera'" class="quest-card__icon-svg" />
    </div>
    <div class="quest-card__body">
      <p class="quest-card__name">{{ quest.name }}</p>
      <p class="quest-card__desc">{{ quest.description }}</p>
      <p v-if="disabled" class="quest-card__offline-note">ต้องมีอินเทอร์เน็ตสำหรับเควสนี้</p>
    </div>
    <div class="quest-card__points">+{{ quest.points }}</div>
  </button>
</template>

<style scoped>
.quest-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
  text-align: left;
  cursor: pointer;
}

.quest-card--done {
  border-color: var(--farm-accent-dark);
  background: var(--farm-cream-dark);
}

.quest-card--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.quest-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--farm-grass);
  color: var(--farm-cream);
}

.quest-card--done .quest-card__icon {
  background: var(--farm-accent-dark);
}

.quest-card__icon-svg {
  width: 1.3rem;
  height: 1.3rem;
}

.quest-card__body {
  flex: 1;
  min-width: 0;
}

.quest-card__name {
  margin: 0;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.quest-card__desc {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: var(--farm-text-muted);
}

.quest-card__offline-note {
  margin: 0.25rem 0 0;
  font-size: 0.72rem;
  color: var(--farm-wood-dark);
}

.quest-card__points {
  flex-shrink: 0;
  font-weight: 800;
  color: var(--farm-accent-dark);
}
</style>
