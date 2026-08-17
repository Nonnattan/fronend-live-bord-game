<script setup lang="ts">
/**
 * components/map/MiniMap.vue
 * ---------------------------------------------------------------------------
 * Adventure Map แบบย่อสำหรับหน้า Home — สูงประมาณ 250px พื้นหลังเป็นภาพเกาะลอย
 * ฟาร์มที่มีตึก/หมุด/ป้ายชื่อฐานทั้ง 4 วาดอยู่ในภาพเลย เดียวกับหน้า Map เต็ม
 * (public/images/adventure-map-bg.jpg) ไม่ใช้ Leaflet/OpenStreetMap/GPS ใด ๆ
 *
 * เป็น "หน้าอ้างอิงตำแหน่งฐาน" ย่อ ๆ ที่รับ visitedIds จาก useAdventure()
 * ผ่าน props เดียวกับ Main Map เพื่อแสดง ✓ ที่จุดเดียวกันโดยไม่สร้าง scanned state
 * แยกเอง แล้ว emit "open" ออกไป
 * ให้หน้า (page) เป็นผู้สั่ง navigateTo('/map') เอง
 *
 * [แก้ไข — ตามที่แก้ใน AdventureMap.vue] พื้นหลังภาพเดียวมีครบทั้งตึก/หมุด/
 * ป้ายชื่อ/ไอคอนตกแต่งอยู่แล้ว ตัดการวาดหมุดทับ (บับเบิลกรอบแดง+เด้ง) ออกทั้งหมด
 * เหลือไว้แค่ "ติ๊กถูกสีเขียว" ทับตำแหน่งฐานที่ผ่านแล้วเท่านั้น
 */

import type { AdventureStation } from '~/composables/useAdventure'
import { ADVENTURE_STATION_POSITIONS } from '~/composables/useAdventure'

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
        src="/images/adventure-map-bg.jpg"
        alt="แผนที่ฟาร์ม Adventure"
        draggable="false"
      />

      <span
        v-for="station in props.stations"
        :key="station.id"
        class="mini-map__check-slot"
        :style="{ left: `${positionOf(station).x}%`, top: `${positionOf(station).y}%` }"
      >
        <span v-if="isVisited(station.id)" class="mini-map__check" :aria-label="`${station.name}: ผ่านแล้ว`">
          <UIcon name="i-lucide-check" class="mini-map__check-icon" />
        </span>
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

/* ติ๊กถูกสีเขียว — แสดงเฉพาะฐานที่ผ่านแล้วเท่านั้น (หมุด/ตึก/ป้ายชื่ออยู่ในภาพ
   พื้นหลังหมดแล้ว จุดนี้เป็นสิ่งเดียวที่ภาพนิ่งบอกไม่ได้เอง) — __check-slot
   เป็นตัวยึดตำแหน่ง (render เสมอ ไม่แสดงอะไรถ้ายังไม่ผ่าน) ส่วน __check คือ
   วงกลมจริงที่โผล่มาเฉพาะตอนผ่านฐานแล้ว (แยก v-if ออกจาก v-for ตามกติกา Vue 3) */
.mini-map__check-slot {
  position: absolute;
  transform: translate(-50%, -100%);
  z-index: 10;
  pointer-events: none;
}

.mini-map__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: #5fb648;
  border: 2px solid #fff8ec;
  box-shadow: 0 2px 4px rgba(74, 47, 24, 0.5);
}

.mini-map__check-icon {
  width: 0.65rem;
  height: 0.65rem;
  color: #fff;
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
