<script setup lang="ts">
/**
 * components/station/StationMissionCard.vue
 * ---------------------------------------------------------------------------
 * [แก้ไข] การ์ด 1 ใบในลิสต์ภารกิจของฐาน — รับ StationMission จริงจาก Backend
 * (ไม่ใช่ icon/title/description แยกชิ้นแบบ Mock เดิมอีกต่อไป) กดเพื่อเปิดภารกิจ
 * นั้นต่อ ไอคอนเลือกจาก mission.type (SINGLE_QUESTION/MULTI_QUESTION/QR_SCORE —
 * ไม่ผูกกับ Mock 3 ชนิดตายตัวเดิมแล้ว)
 */
import type { StationMission } from "~/types/mission";

const props = defineProps<{ mission: StationMission }>();

const emit = defineEmits<{ open: [] }>();

const MISSION_TYPE_ICON: Record<StationMission["type"], string> = {
  SINGLE_QUESTION: "❓",
  MULTI_QUESTION: "📝",
  QR_SCORE: "📱",
};
const icon = computed(() => MISSION_TYPE_ICON[props.mission.type]);
const pointsLabel = computed(() =>
  props.mission.completed
    ? `+${props.mission.pointsEarned} คะแนน`
    : `${props.mission.points} คะแนน`,
);
</script>

<template>
  <button
    type="button"
    class="mission-card"
    :class="{ 'mission-card--completed': mission.completed }"
    @click="emit('open')"
  >
    <span class="mission-card__icon">{{ icon }}</span>
    <span class="mission-card__body">
      <span class="mission-card__title">{{ mission.title }}</span>
      <span class="mission-card__desc">{{ mission.description }}</span>
      <span class="mission-card__points">{{ pointsLabel }}</span>
    </span>
    <UIcon
      :name="mission.completed ? 'i-lucide-check-circle-2' : 'i-lucide-chevron-right'"
      class="mission-card__chevron"
      :class="{ 'mission-card__chevron--done': mission.completed }"
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

.mission-card__points {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
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
