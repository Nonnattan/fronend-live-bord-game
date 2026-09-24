<script setup lang="ts">
/**
 * components/map/MapCanvas.vue
 * ---------------------------------------------------------------------------
 * วาดแผนที่ Mockup ทั้งหมดด้วย SVG: พื้นหลัง + เส้น Journey (Polyline ตามลำดับ
 * การกดผ่านฐานจริง ไม่ใช่ Route จริง) + Marker ของแต่ละฐาน (StationMarker.vue)
 *
 * เป็น "Presentational component" รับ stations (ฐานทั้งหมด) + journey (ลำดับ id
 * ที่กดผ่านแล้ว) ผ่าน props แล้ว emit toggle ออกไป ไม่ผูกกับ useJourney()
 * โดยตรง เพื่อให้ในอนาคตสลับแหล่งข้อมูลจริงได้ง่ายโดยไม่ต้องแก้ไฟล์นี้
 */

import type { JourneyStation } from "~/composables/useJourney";
import StationMarker from "./StationMarker.vue";

const props = defineProps<{
  stations: JourneyStation[];
  /** ลำดับ id ของฐานตามลำดับที่กดผ่าน เช่น ['c', 'a', 'd'] */
  journey: readonly string[];
}>();

const emit = defineEmits<{
  toggle: [id: string];
}>();

/** แปลงลำดับ id ใน journey ให้เป็นรายการ station เต็ม ๆ ตามลำดับเดิม สำหรับวาด Polyline */
const journeyStations = computed(() =>
  props.journey
    .map((id) => props.stations.find((s) => s.id === id))
    .filter((s): s is JourneyStation => Boolean(s))
);

const polylinePoints = computed(() =>
  journeyStations.value.map((s) => `${s.x},${s.y}`).join(" ")
);

function isVisited(id: string): boolean {
  return props.journey.includes(id);
}

/** ลำดับที่ผ่านฐานนี้ (1-based) หรือ null ถ้ายังไม่ผ่าน — ใช้แสดงตัวเลขบน Marker */
function orderOf(id: string): number | null {
  const idx = props.journey.indexOf(id);
  return idx === -1 ? null : idx + 1;
}

function handleToggle(id: string) {
  emit("toggle", id);
}

/**
 * Animation "ค่อย ๆ วาด" ของเส้น Journey — ใช้เทคนิค stroke-dasharray /
 * stroke-dashoffset ร่วมกับ CSS Transition เท่านั้น (ไม่ใช้ Library Animation
 * ใด ๆ) ทุกครั้งที่ journey เปลี่ยน (เพิ่ม/ลบฐาน) จะ replay การวาดใหม่แบบ real-time
 */
const polylineRef = ref<SVGPolylineElement | null>(null);

async function playDrawAnimation() {
  await nextTick();
  const el = polylineRef.value;
  if (!el) return;

  // น้อยกว่า 2 จุด = วาดเส้นไม่ได้ (ไม่มี segment) แค่เคลียร์ค่าไว้เฉย ๆ
  if (journeyStations.value.length < 2) {
    el.style.transition = "none";
    el.style.strokeDasharray = "0";
    el.style.strokeDashoffset = "0";
    return;
  }

  const length = el.getTotalLength();

  // ตั้งค่าจุดเริ่มต้น (เส้นถูกซ่อนทั้งเส้น) โดยไม่มี transition ก่อน
  el.style.transition = "none";
  el.style.strokeDasharray = `${length}`;
  el.style.strokeDashoffset = `${length}`;

  // บังคับ reflow เพื่อให้ browser รับค่าเริ่มต้นก่อนเริ่ม transition
  el.getBoundingClientRect();

  // จากนั้นค่อย ๆ เผยเส้นด้วย CSS Transition ล้วน ๆ
  el.style.transition = "stroke-dashoffset 0.6s ease";
  el.style.strokeDashoffset = "0";
}

watch(polylinePoints, playDrawAnimation, { immediate: true });
</script>

<template>
  <div class="map-canvas">
    <svg
      class="map-canvas__svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mapCanvasSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--farm-sky-top)" />
          <stop offset="55%" stop-color="var(--farm-sky-bottom)" />
          <stop offset="100%" stop-color="var(--farm-grass)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="100" fill="url(#mapCanvasSky)" />

      <!-- เส้นตารางพื้นหลัง (mockup ผืนดิน) -->
      <g
        class="map-canvas__grid"
        stroke="#ffffff"
        stroke-width="0.4"
        opacity="0.35"
      >
        <line
          v-for="n in 7"
          :key="'v' + n"
          :x1="n * 12.5"
          y1="0"
          :x2="n * 12.5"
          y2="100"
        />
        <line
          v-for="n in 3"
          :key="'h' + n"
          x1="0"
          :y1="n * 25"
          x2="100"
          :y2="n * 25"
        />
      </g>

      <!-- เส้น Journey: Polyline เดียว วาดตามลำดับฐานที่กดผ่านจริง (ไม่ใช่ route จริง) -->
      <polyline
        ref="polylineRef"
        :points="polylinePoints"
        class="map-canvas__journey-line"
        fill="none"
      />

      <!-- Marker แต่ละฐาน -->
      <StationMarker
        v-for="station in stations"
        :key="station.id"
        :station="station"
        :visited="isVisited(station.id)"
        :order="orderOf(station.id)"
        @toggle="handleToggle"
      />
    </svg>
  </div>
</template>

<style scoped>
.map-canvas {
  border-radius: 1.25rem;
  overflow: hidden;
  border: 3px solid var(--farm-wood);
  box-shadow: 0 14px 30px -14px rgba(74, 47, 24, 0.5);
}

.map-canvas__svg {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
}

.map-canvas__journey-line {
  stroke: var(--farm-accent-dark);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
