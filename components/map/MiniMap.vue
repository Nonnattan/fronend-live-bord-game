<script setup lang="ts">
/**
 * components/map/MiniMap.vue
 * ---------------------------------------------------------------------------
 * Adventure Map แบบย่อสำหรับหน้า Home — สูงประมาณ 250px ใช้ OpenStreetMap
 * ผ่าน Leaflet จริง (ไม่ Zoom, ไม่ Pan) แสดงผังเดียวกับหน้า Map เต็ม: 4 ฐาน
 * วางเป็นรูปสี่เหลี่ยม (Board Game Layout) พร้อม Polyline รอบสี่เหลี่ยม
 * แสดงสถานะ "เข้าฐานแล้ว X/Y", "Point" และข้อความ "แตะเพื่อเปิดแผนที่เต็ม"
 *
 * เป็น Presentational component รับข้อมูลผ่าน props ทั้งหมด แล้ว emit "open"
 * ออกไปให้หน้า (page) เป็นผู้สั่ง navigateTo('/map') เอง (ไม่ผูก routing logic
 * ไว้ในนี้ตรง ๆ เพื่อให้ทดสอบ/ใช้ซ้ำที่อื่นได้ง่ายในอนาคต)
 */

import type { AdventureStation } from '~/composables/useAdventure'
import LeafletMap from './LeafletMap.vue'

defineProps<{
  stations: AdventureStation[]
  visitedIds: readonly string[]
  visitedCount: number
  totalStations: number
  totalPoint: number
}>()

const emit = defineEmits<{
  open: []
}>()
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
      <ClientOnly>
        <LeafletMap
          :stations="stations"
          :visited-ids="visitedIds"
          :interactive="false"
          height="250px"
        />
        <template #fallback>
          <div class="mini-map__loading">
            <UIcon name="i-lucide-loader-2" class="mini-map__loading-icon" />
          </div>
        </template>
      </ClientOnly>

      <!-- สรุปสถานะลอยมุมบนของ Mini Map -->
      <div class="mini-map__stats">
        <span class="mini-map__stat">
          <UIcon name="i-lucide-flag" class="mini-map__stat-icon" />
          เข้าฐานแล้ว {{ visitedCount }} / {{ totalStations }}
        </span>
        <span class="mini-map__stat">
          <UIcon name="i-lucide-sparkles" class="mini-map__stat-icon" />
          Point {{ totalPoint }}
        </span>
      </div>

      <!-- Overlay โปร่งใสไว้ดัก Pointer Event เพราะ Marker ของ Leaflet กันคลิกทะลุ -->
      <div class="mini-map__tap-overlay" />
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
}

.mini-map__loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--farm-cream-dark);
}

.mini-map__loading-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--farm-accent-dark);
  animation: mini-map-spin 1s linear infinite;
}

@keyframes mini-map-spin {
  to {
    transform: rotate(360deg);
  }
}

/* โปร่งใสเต็มพื้นที่แผนที่ ไว้ดักคลิกทั้งการ์ดให้ไปหน้า /map เสมอ (Leaflet ไม่ interactive อยู่แล้ว) */
.mini-map__tap-overlay {
  position: absolute;
  inset: 0;
  z-index: 400;
}

.mini-map__stats {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  right: 0.6rem;
  z-index: 500;
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  pointer-events: none;
}

.mini-map__stat {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 248, 230, 0.9);
  border: 1.5px solid var(--farm-wood);
  color: var(--farm-text-dark);
  font-size: 0.72rem;
  font-weight: 700;
}

.mini-map__stat-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
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
