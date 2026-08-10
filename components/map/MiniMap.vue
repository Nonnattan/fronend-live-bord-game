<script setup lang="ts">
/**
 * components/map/MiniMap.vue
 * ---------------------------------------------------------------------------
 * Adventure Map แบบย่อสำหรับหน้า Home — สูงประมาณ 250px พื้นหลังเป็นภาพ PNG
 * เดียวกับหน้า Map เต็ม (ไม่ใช้ Leaflet/OpenStreetMap/GPS ใด ๆ) แสดงผังเดียวกับ
 * หน้า Map เต็ม: 4 ฐานวางเป็นรูปสี่เหลี่ยม (Board Game Layout) ด้วยพิกัด % (X-Y)
 * เดียวกับ components/map/AdventureMap.vue (ใช้ ADVENTURE_STATION_POSITIONS
 * จาก useAdventure.ts ร่วมกัน ไม่ hardcode ซ้ำ)
 *
 * เป็น "หน้าอ้างอิงตำแหน่งฐาน" ย่อ ๆ ที่รับ visitedIds จาก useAdventure()
 * ผ่าน props เดียวกับ Main Map เพื่อแสดง ✓ ที่จุดเดียวกันโดยไม่สร้าง scanned state
 * แยกเอง แล้ว emit "open" ออกไป
 * ให้หน้า (page) เป็นผู้สั่ง navigateTo('/map') เอง
 */

import type { AdventureStation } from '~/composables/useAdventure'
import { ADVENTURE_STATION_POSITIONS, STATION_TYPE_META } from '~/composables/useAdventure'

const props = defineProps<{
  stations: AdventureStation[]
  visitedIds: readonly string[]
}>()

function isVisited(stationId: string): boolean {
  return props.visitedIds.includes(stationId)
}

const emit = defineEmits<{
  open: []
}>()

function positionOf(station: AdventureStation): { x: number; y: number } {
  return ADVENTURE_STATION_POSITIONS[station.id] ?? { x: 50, y: 50 }
}
</script>

<template>
  <div
    class="mini-map"
    role="button"
    tabindex="0"
    aria-label="ดูแผนที่แบบเต็ม"
    @click="emit('open')"
    @keydown.enter="emit('open')"
    @keydown.space.prevent="emit('open')"
  >
    <div class="mini-map__canvas">
      <img
        class="mini-map__bg"
        src="/images/adventure-map-bg.png"
        alt="แผนที่ฟาร์ม Adventure"
        draggable="false"
      />

      <span
        v-for="station in props.stations"
        :key="station.id"
        class="mini-map__pin"
        :class="{ 'mini-map__pin--visited': isVisited(station.id) }"
        :style="{
          left: `${positionOf(station).x}%`,
          top: `${positionOf(station).y}%`,
          '--pin-color': STATION_TYPE_META[station.type].color,
          '--pin-color-dark': STATION_TYPE_META[station.type].colorDark,
        }"
        :aria-label="station.name"
      >
        {{ isVisited(station.id) ? '✓' : STATION_TYPE_META[station.type].icon }}
      </span>
    </div>

    <div class="mini-map__footer">
      <div class="mini-map__footer-text">
        <p class="mini-map__title">Adventure Map</p>
        <p class="mini-map__desc">แตะเพื่อเปิดแผนที่เต็ม</p>
      </div>
      <UIcon name="i-lucide-chevron-right" class="mini-map__chevron" />
    </div>
  </div>
</template>

<style scoped>
.mini-map {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 1.4rem;
  overflow: hidden;
  border: 3px solid var(--farm-wood);
  box-shadow: 0 14px 30px -14px rgba(74, 47, 24, 0.5);
  cursor: pointer;
}

.mini-map:focus-visible {
  outline: 3px solid var(--farm-accent-dark);
  outline-offset: 2px;
}

.mini-map__canvas {
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  height: 250px;
  overflow: hidden;
  background: var(--farm-cream-dark);
}

.mini-map__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

.mini-map__pin {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  background: var(--pin-color);
  border: 2.5px solid var(--pin-color-dark);
  box-shadow: 0 6px 14px -8px rgba(74, 47, 24, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  line-height: 1;
  pointer-events: none;
}

.mini-map__pin--visited {
  --pin-color: #5fb648 !important;
  --pin-color-dark: #457a26 !important;
  color: #fff;
  font-weight: 800;
}

.mini-map__footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 1.1rem;
  background: var(--farm-cream);
}

.mini-map__footer-text {
  flex: 1;
  min-width: 0;
}

.mini-map__title {
  font-weight: 800;
  font-size: 1rem;
  color: var(--farm-text-dark);
  margin: 0;
}

.mini-map__desc {
  font-size: 0.8rem;
  color: var(--farm-text-muted);
  margin: 0.15rem 0 0;
}

.mini-map__chevron {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}
</style>
