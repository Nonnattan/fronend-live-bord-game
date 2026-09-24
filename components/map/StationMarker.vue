<script setup lang="ts">
/**
 * components/map/StationMarker.vue
 * ---------------------------------------------------------------------------
 * Marker ของฐานเดียวบน Adventure Map ต้อง render อยู่ภายใน <svg> ของ
 * AdventureMap.vue/MiniMap.vue (root เป็น <g>) — "Presentational component"
 * ล้วน ๆ รับข้อมูลผ่าน props แล้ว emit toggle ออกไป ไม่มี state ของตัวเองเลย
 *
 * - ยังไม่ผ่านฐาน: แสดง icon ของประเภทฐาน (🍀🏕️🏰🧭) พร้อม Animation
 *   Bounce + Pulse + Glow เบา ๆ เพื่อดึงดูดสายตา
 * - ผ่านฐานแล้ว: พื้นหลังเปลี่ยนเป็นสีเขียว แสดงเครื่องหมาย ✓ แทน icon
 * - interactive (แตะได้) ควบคุมด้วย prop `interactive` — MiniMap ใช้แบบ
 *   แสดงผลอย่างเดียว (ไม่รับแตะ) ส่วน AdventureMap เต็มแตะ Toggle ได้
 */

import type { AdventureStation } from '~/composables/useAdventure'
import { STATION_TYPE_META } from '~/composables/useAdventure'

const props = withDefaults(
  defineProps<{
    station: AdventureStation
    visited: boolean
    interactive?: boolean
  }>(),
  { interactive: true }
)

const emit = defineEmits<{
  toggle: [id: string]
}>()

const meta = computed(() => STATION_TYPE_META[props.station.type])

function handleToggle() {
  if (!props.interactive) return
  emit('toggle', props.station.id)
}
</script>

<template>
  <g
    class="station-marker"
    :class="{
      'station-marker--visited': visited,
      'station-marker--static': !interactive,
    }"
    :tabindex="interactive ? 0 : -1"
    :role="interactive ? 'button' : undefined"
    :aria-label="interactive ? `${station.name} — แตะเพื่อ Toggle ผ่าน/ไม่ผ่าน` : station.name"
    @click="handleToggle"
    @keydown.enter="handleToggle"
    @keydown.space.prevent="handleToggle"
  >
    <!-- วงแหวน Glow เบา ๆ รอบ Marker ที่ยังไม่ผ่าน -->
    <circle
      v-if="!visited"
      :cx="station.x"
      :cy="station.y"
      r="5.6"
      class="station-marker__glow"
      :style="{ fill: meta.color }"
    />

    <!-- กลุ่มที่ขยับ Bounce ทั้งก้อน (หมุด + ไอคอน) -->
    <g class="station-marker__bounce">
      <!-- ฐานหมุดรูปหยดน้ำ -->
      <path
        :transform="`translate(${station.x - 5.4}, ${station.y - 11.6})`"
        d="M5.4 0C2.4 0 0 2.5 0 5.6c0 4 5.4 9.2 5.4 9.2s5.4-5.2 5.4-9.2C10.8 2.5 8.4 0 5.4 0z"
        class="station-marker__pin"
        :style="{ fill: visited ? 'var(--farm-accent-dark, #457a26)' : meta.colorDark }"
      />
      <circle
        :cx="station.x"
        :cy="station.y - 6"
        r="4.3"
        class="station-marker__pin-face"
        :style="{ fill: visited ? '#5fb648' : meta.color }"
      />

      <text v-if="visited" :x="station.x" :y="station.y - 4.6" class="station-marker__check">✓</text>
      <text v-else :x="station.x" :y="station.y - 4.7" class="station-marker__icon">{{ meta.icon }}</text>
    </g>

    <text :x="station.x" :y="station.y + 3.6" class="station-marker__label">
      {{ station.name }}
    </text>
  </g>
</template>

<style scoped>
.station-marker {
  cursor: pointer;
}

.station-marker--static {
  cursor: default;
}

.station-marker__glow {
  opacity: 0.35;
  animation: marker-glow 1.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

.station-marker__bounce {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: marker-bounce 1.6s ease-in-out infinite;
}

.station-marker--visited .station-marker__bounce {
  animation: none;
}

.station-marker__pin {
  stroke: var(--farm-cream, #fff8e6);
  stroke-width: 0.6;
  transition: fill 0.35s ease;
}

.station-marker__pin-face {
  stroke: rgba(255, 255, 255, 0.7);
  stroke-width: 0.5;
  transition: fill 0.35s ease;
}

.station-marker__icon {
  font-size: 4.6px;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
}

.station-marker__check {
  font-size: 5px;
  font-weight: 800;
  fill: #fff;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
}

.station-marker__label {
  font-size: 3.4px;
  font-weight: 700;
  fill: var(--farm-text-dark, #4a2f18);
  text-anchor: middle;
  paint-order: stroke;
  stroke: var(--farm-cream, #fff8e6);
  stroke-width: 2px;
  stroke-linejoin: round;
  pointer-events: none;
  user-select: none;
}

@keyframes marker-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1.4px);
  }
}

@keyframes marker-glow {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.55;
    transform: scale(1.35);
  }
}

@media (prefers-reduced-motion: reduce) {
  .station-marker__bounce,
  .station-marker__glow {
    animation: none;
  }
}
</style>
