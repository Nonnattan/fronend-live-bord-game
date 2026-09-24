<script setup lang="ts">
/**
 * components/OfflineSummaryCard.vue
 * ---------------------------------------------------------------------------
 * Card สรุปการเล่นแบบ Offline Mode (ข้อ 11 ในสเปก) — แสดงในหน้า Profile
 * ใต้ Profile Card เดิม (ดู pages/profile.vue) เป็น Presentational component
 * ล้วน ๆ รับข้อมูลทั้งหมดผ่าน props (อ่านจาก composables/useOfflineMode.ts)
 * ไม่มี Logic ของตัวเอง เพื่อให้ทดสอบ/ใช้ซ้ำได้ง่าย
 */

const props = defineProps<{
  uid: string
  startedAt?: number
  endedAt?: number
  /** รายชื่อฐานที่เล่นแล้ว เรียงตามลำดับที่สแกนสำเร็จ */
  playedStationNames: string[]
  /** รายชื่อฐานที่เหลือ (ยังไม่ได้เล่น) */
  remainingStationNames: string[]
}>()

function formatDateTime(ms?: number): string {
  if (!ms) return '-'
  return new Date(ms).toLocaleString('th-TH')
}
</script>

<template>
  <section class="offline-summary-card">
    <div class="offline-summary-card__header">
      <UIcon name="i-lucide-wifi-off" class="offline-summary-card__icon" />
      <div>
        <p class="offline-summary-card__title">สรุปการเล่นแบบออฟไลน์</p>
        <p class="offline-summary-card__subtitle">Offline Mode</p>
      </div>
    </div>

    <div class="offline-summary-card__rows">
      <div class="offline-summary-card__row">
        <span class="offline-summary-card__label">UID</span>
        <code class="offline-summary-card__value offline-summary-card__value--mono">{{ props.uid }}</code>
      </div>
      <div class="offline-summary-card__row">
        <span class="offline-summary-card__label">เวลาเริ่ม</span>
        <span class="offline-summary-card__value">{{ formatDateTime(props.startedAt) }}</span>
      </div>
      <div class="offline-summary-card__row">
        <span class="offline-summary-card__label">เวลาจบ</span>
        <span class="offline-summary-card__value">{{ formatDateTime(props.endedAt) }}</span>
      </div>
      <div class="offline-summary-card__row">
        <span class="offline-summary-card__label">จำนวนฐานที่เล่น</span>
        <span class="offline-summary-card__value">{{ props.playedStationNames.length }}</span>
      </div>
    </div>

    <div class="offline-summary-card__list">
      <p class="offline-summary-card__list-title">ฐานที่เล่นแล้ว</p>
      <p v-if="props.playedStationNames.length === 0" class="offline-summary-card__empty">
        ยังไม่ได้เล่นฐานใดเลย
      </p>
      <ul v-else class="offline-summary-card__chips">
        <li v-for="(name, index) in props.playedStationNames" :key="`${name}-${index}`" class="offline-summary-card__chip offline-summary-card__chip--done">
          {{ index + 1 }}. {{ name }}
        </li>
      </ul>
    </div>

    <div class="offline-summary-card__list">
      <p class="offline-summary-card__list-title">ฐานที่เหลือ</p>
      <p v-if="props.remainingStationNames.length === 0" class="offline-summary-card__empty">
        เล่นครบทุกฐานแล้ว
      </p>
      <ul v-else class="offline-summary-card__chips">
        <li v-for="name in props.remainingStationNames" :key="name" class="offline-summary-card__chip">
          {{ name }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.offline-summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.offline-summary-card__header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.offline-summary-card__icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #a8442b;
  flex-shrink: 0;
}

.offline-summary-card__title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0;
}

.offline-summary-card__subtitle {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}

.offline-summary-card__rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.offline-summary-card__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.offline-summary-card__label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--farm-text-muted);
  white-space: nowrap;
}

.offline-summary-card__value {
  font-size: 0.82rem;
  color: var(--farm-text-dark);
  text-align: right;
}

.offline-summary-card__value--mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  word-break: break-all;
}

.offline-summary-card__list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.offline-summary-card__list-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--farm-text-muted);
  margin: 0;
}

.offline-summary-card__empty {
  font-size: 0.78rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.offline-summary-card__chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
}

.offline-summary-card__chip {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  border: 1.5px solid var(--farm-wood);
  color: var(--farm-text-dark);
}

.offline-summary-card__chip--done {
  background: var(--farm-grass);
  border-color: var(--farm-accent-dark);
  color: #fff;
}
</style>
