<script setup lang="ts">
/**
 * components/station/StationSelectionCard.vue
 * ---------------------------------------------------------------------------
 * การ์ด 1 ใบในหน้า "เลือกฐาน" (pages/stations.vue) — 4 สถานะที่แสดงผล (มาจาก
 * StationCardState — ดู composables/useStationQuest.ts::getStationCardState):
 *   completed        ทำครบ 3/3 แล้ว — "✓ ทำครบแล้ว" กดเข้าดูซ้ำได้เสมอ
 *   accessible       ยังไม่ครบ แต่มีสิทธิ์จากการสแกนล่าสุด — "🔓 เข้าได้" กดเข้าได้
 *   needs-rescan     ยังไม่ครบ + เคยเล่นมาก่อน (มี Progress) แต่สิทธิ์หมดแล้ว —
 *                     "🔒" + คำแนะนำ "สแกน QR เพื่อเข้าเล่นต่อ" กดไม่ได้
 *   locked           ยังไม่ครบ + ไม่เคยเล่นเลย (0/3) — "🔒 ยังไม่ปลดล็อค" กดไม่ได้
 */
import type { StationType } from '~/composables/useAdventure'
import type { StationCardState } from '~/types/stationMission'

const props = defineProps<{
  station: { id: StationType; name: string; icon: string }
  cardState: StationCardState
}>()

const emit = defineEmits<{
  select: [stationId: StationType]
}>()

const variant = computed<'completed' | 'accessible' | 'needs-rescan' | 'locked'>(() => {
  if (props.cardState.isCompleted) return 'completed'
  if (props.cardState.isAccessible) return 'accessible'
  return props.cardState.completedMissions > 0 ? 'needs-rescan' : 'locked'
})

const isClickable = computed(() => props.cardState.isAccessible)

function handleClick(): void {
  if (!isClickable.value) return
  emit('select', props.station.id)
}
</script>

<template>
  <button
    type="button"
    class="station-card"
    :class="`station-card--${variant}`"
    :disabled="!isClickable"
    @click="handleClick"
  >
    <span class="station-card__icon">{{ station.icon }}</span>
    <span class="station-card__name">{{ station.name }}</span>
    <span class="station-card__progress">ภารกิจ {{ cardState.completedMissions }}/3</span>
    <span class="station-card__status">
      <template v-if="variant === 'completed'">✓ ทำครบแล้ว</template>
      <template v-else-if="variant === 'accessible'">🔓 เข้าได้</template>
      <template v-else>🔒 ยังไม่ปลดล็อค</template>
    </span>
    <span v-if="variant === 'needs-rescan'" class="station-card__hint">
      สแกน QR เพื่อเข้าเล่นต่อ
    </span>
  </button>
</template>

<style scoped>
.station-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  width: 100%;
  padding: 1.25rem 1rem;
  border-radius: 1.1rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream);
  text-align: center;
}

.station-card:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.station-card__icon {
  font-size: 2.5rem;
  line-height: 1;
}

.station-card__name {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.station-card__progress {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-text-muted);
}

.station-card__status {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--farm-text-muted);
}

.station-card__hint {
  font-size: 0.68rem;
  color: var(--farm-wood-dark);
}

.station-card--accessible {
  border-color: var(--farm-accent-dark);
}

.station-card--accessible .station-card__status {
  color: var(--farm-accent-dark);
}

.station-card--completed {
  border-color: #f2b134;
  background: var(--farm-cream-dark);
}

.station-card--completed .station-card__status {
  color: #b3841f;
}
</style>
