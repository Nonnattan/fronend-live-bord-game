<script setup lang="ts">
/**
 * pages/map.vue
 * ---------------------------------------------------------------------------
 * หน้า Map — Adventure Game Map แบบเต็ม ใช้ OpenStreetMap จริงผ่าน Leaflet
 * รองรับ Pan / Zoom เต็มรูปแบบ (ฐานที่ผ่านแล้ว + คะแนนสะสม ดึงจริงจาก Google
 * Sheet ผ่าน useAdventure().initAdventure(memberId) — ชื่อ/คะแนน/เปิดปิดฐาน
 * ดึงจากชีต Stations ฝั่ง Admin จริงแล้วเช่นกัน ส่วนตำแหน่ง (lat/lng) กับ
 * ไอคอน/สียังเป็นข้อมูลตั้งต้นคงที่ฝั่ง frontend เหมือนเดิม)
 *
 * โครงสร้าง (แยกไว้เพื่อสลับไปข้อมูลจริงได้ง่ายในอนาคต):
 * - composables/useAdventure.ts      -> state + logic ของ Journey ทั้งหมด
 * - components/map/AdventureMap.vue  -> โครง UI หน้า Map เต็มจอ (Presentational)
 * - components/map/LeafletMap.vue    -> วาดแผนที่ Leaflet/OSM + Marker/Polyline จริง
 * หน้านี้ทำหน้าที่แค่ "ประกอบร่าง" (orchestrate): ดึง state จาก useAdventure()
 * แล้วส่งต่อเป็น props ให้ AdventureMap / ฟัง event toggle แล้วสั่ง toggleStation()
 */

import AdventureMap from "~/components/map/AdventureMap.vue";
import { STATION_TYPE_META } from "~/composables/useAdventure";

definePageMeta({ layout: "app" });

const { profile, isReady } = useRequireProfile();

const {
  stations,
  totalStations,
  visitedIds,
  isVisited,
  visitedCount,
  totalPoint,
  toggleStation,
  resetJourney,
  initAdventure,
} = useAdventure();

// ส่ง memberId เข้าไปด้วย (ถ้ามี) เพื่อดึงฐานที่ผ่านจริง + คะแนนสะสมจริงจาก
// Google Sheet (getJourney/getScore) มาทับ LocalStorage — ดู useAdventure.ts
onMounted(() => {
  void initAdventure(profile.value?.memberId);
});
</script>

<template>
  <div class="page">
    <PageHeader title="Adventure Map" />

    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>

    <div v-else class="map-page">
      <!-- สรุปสถานะด้านบน: เข้าฐานแล้ว X/Y + Point + ปุ่ม Reset Journey -->
      <section class="stats-card">
        <div class="stats-card__row">
          <div class="stats-card__stat">
            <p class="stats-card__label">เข้าฐานแล้ว</p>
            <p class="stats-card__value">
              {{ visitedCount }} / {{ totalStations }}
            </p>
          </div>
          <div class="stats-card__divider" />
          <div class="stats-card__stat">
            <p class="stats-card__label">Point</p>
            <p class="stats-card__value">{{ totalPoint }}</p>
          </div>
        </div>

        <button type="button" class="reset-btn" @click="resetJourney">
          <UIcon name="i-lucide-rotate-ccw" class="reset-btn__icon" />
          Reset Journey
        </button>
      </section>

      <!-- Adventure Map เต็ม: Pan / Zoom / Reset View + แตะ Marker เพื่อ Toggle -->
      <AdventureMap
        :stations="stations"
        :visited-ids="visitedIds"
        @toggle="toggleStation"
      />

      <!-- รายการฐานทั้งหมด: แตะเพื่อ Toggle ผ่าน/ไม่ผ่าน (บันทึก/ลบออกจาก Journey) -->
      <section class="station-list">
        <button
          v-for="station in stations"
          :key="station.id"
          type="button"
          class="station-row"
          :class="{ 'station-row--visited': isVisited(station.id) }"
          @click="toggleStation(station.id)"
        >
          <span class="station-row__mark">{{
            isVisited(station.id) ? "✓" : STATION_TYPE_META[station.type].icon
          }}</span>
          <span class="station-row__name">{{ station.name }}</span>
          <span class="station-row__status">
            {{ isVisited(station.id) ? "ผ่านแล้ว" : "ยังไม่ผ่าน" }}
          </span>
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.page__spinner {
  width: 2rem;
  height: 2rem;
  color: var(--farm-accent-dark);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.map-page {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 1.1rem 1.25rem;
}

/* ----------------------------- Stats Card ------------------------------ */

.stats-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 1.25rem;
  background: linear-gradient(
    160deg,
    var(--farm-cream) 0%,
    var(--farm-cream-dark) 100%
  );
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 24px -16px rgba(74, 47, 24, 0.45);
}

.stats-card__row {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
}

.stats-card__stat {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.15rem;
}

.stats-card__divider {
  width: 1.5px;
  align-self: stretch;
  background: var(--farm-wood);
  opacity: 0.35;
  flex-shrink: 0;
}

.stats-card__label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--farm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.stats-card__value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
  margin: 0.2rem 0 0;
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 0.85rem;
  border: 1.5px solid var(--farm-wood);
  background: var(--farm-cream);
  color: var(--farm-text-dark);
  font: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.reset-btn:hover {
  background: var(--farm-wood);
  color: #fff;
}

.reset-btn:focus-visible {
  outline: 3px solid var(--farm-accent-dark);
  outline-offset: 2px;
}

.reset-btn__icon {
  width: 1rem;
  height: 1rem;
}

/* ----------------------------- Station List ----------------------------- */

.station-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.station-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.9rem;
  border: 1.5px dashed var(--farm-wood);
  background: rgba(255, 255, 255, 0.55);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.station-row:focus-visible {
  outline: 3px solid var(--farm-accent-dark);
  outline-offset: 2px;
}

.station-row--visited {
  border-style: solid;
  border-color: var(--farm-accent-dark);
  background: rgba(143, 199, 78, 0.22);
}

.station-row__mark {
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  color: var(--farm-text-muted);
  font-weight: 800;
  font-size: 0.95rem;
  transition:
    background-color 0.35s ease,
    color 0.35s ease;
}

.station-row--visited .station-row__mark {
  background: var(--farm-accent-dark);
  color: #fff;
}

.station-row__name {
  flex: 1;
  min-width: 0;
  font-weight: 700;
  color: var(--farm-text-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.station-row__status {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--farm-text-muted);
}

.station-row--visited .station-row__status {
  color: var(--farm-accent-dark);
}

@media (max-width: 360px) {
  .stats-card__value {
    font-size: 1.2rem;
  }

  .station-row__status {
    display: none;
  }
}
</style>
