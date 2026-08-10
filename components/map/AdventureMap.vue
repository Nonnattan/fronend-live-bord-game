<script setup lang="ts">
/**
 * components/map/AdventureMap.vue
 * ---------------------------------------------------------------------------
 * แผนที่ Adventure Map แบบเต็มจอ (ใช้ในหน้า /map เท่านั้น) — พื้นหลังเป็นภาพ
 * PNG ล้วน ๆ (ไม่ใช้ Leaflet/OpenStreetMap/GPS ใด ๆ) 4 ฐานวางเป็นรูปสี่เหลี่ยม
 * (Board Game Layout) ด้วยพิกัด % (X-Y) ทับบนภาพพื้นหลัง
 *
 * เป็น "Presentational component" ล้วน ๆ: รับ stations และ visitedIds จาก
 * useAdventure() ผ่าน props — ไม่มี state สแกนแยกของตัวเอง เพื่อให้เครื่องหมาย ✓
 * ซิงก์กับ MiniMap และหน้าสรุปตลอดเวลา การบันทึกผ่านฐานจริงยังทำผ่านการสแกน QR
 * (ดู pages/scan.vue) เท่านั้น ไม่ใช่จากหน้านี้
 *
 * ตำแหน่ง % ของฐานทั้ง 4 ใช้ค่าจาก useAdventure.ts (ADVENTURE_STATION_POSITIONS)
 * ร่วมกับ Mini Map บนหน้า Home (components/map/MiniMap.vue) จุดเดียว ไม่ hardcode ซ้ำ
 */

import type { AdventureStation } from "~/composables/useAdventure";
import { ADVENTURE_STATION_POSITIONS, STATION_TYPE_META } from "~/composables/useAdventure";

const props = defineProps<{
  stations: AdventureStation[];
  visitedIds: readonly string[];
}>();

function isVisited(stationId: string): boolean {
  return props.visitedIds.includes(stationId);
}

function positionOf(station: AdventureStation): { x: number; y: number } {
  return ADVENTURE_STATION_POSITIONS[station.id] ?? { x: 50, y: 50 };
}
</script>

<template>
  <div class="adventure-map">
    <img
      class="adventure-map__bg"
      src="/images/adventure-map-bg.png"
      alt="แผนที่ฟาร์ม Adventure"
      draggable="false"
    />

    <div
      v-for="station in props.stations"
      :key="station.id"
      class="station-pin"
      :class="{ 'station-pin--visited': isVisited(station.id) }"
      :style="{ left: `${positionOf(station).x}%`, top: `${positionOf(station).y}%` }"
      :aria-label="station.name"
    >
      <span
        class="station-pin__body"
        :style="{
          '--pin-color': STATION_TYPE_META[station.type].color,
          '--pin-color-dark': STATION_TYPE_META[station.type].colorDark,
        }"
      >
        <span class="station-pin__icon">{{ isVisited(station.id) ? '✓' : STATION_TYPE_META[station.type].icon }}</span>
      </span>
      <span class="station-pin__label">{{ station.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.adventure-map {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 3px solid var(--farm-wood);
  box-shadow: 0 14px 30px -14px rgba(74, 47, 24, 0.5);
  background: var(--farm-cream-dark);
}

.adventure-map__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

.station-pin {
  position: absolute;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  z-index: 10;
  pointer-events: none;
}

.station-pin__body {
  position: relative;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px 999px 999px 0;
  transform: rotate(45deg);
  background: var(--pin-color);
  border: 3px solid var(--pin-color-dark);
  box-shadow: 0 6px 14px -8px rgba(74, 47, 24, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.station-pin--visited .station-pin__body {
  --pin-color: #5fb648 !important;
  --pin-color-dark: #457a26 !important;
}

.station-pin__icon {
  transform: rotate(-45deg);
  font-size: 1.15rem;
  line-height: 1;
}

.station-pin__label {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  background: rgba(255, 248, 230, 0.9);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  white-space: nowrap;
}
</style>
