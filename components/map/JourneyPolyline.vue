<script setup lang="ts">
/**
 * components/map/JourneyPolyline.vue
 * ---------------------------------------------------------------------------
 * เส้นทางเชื่อมทุกฐานบน Adventure Map — รับ "segments" (คู่ฐานต้น-ปลาย +
 * สถานะผ่านแล้วหรือยัง) มาเป็น props ล้วน ๆ (Presentational, ไม่มี state เอง)
 * เพื่อให้สลับแหล่งข้อมูลจริงในอนาคตได้โดยไม่ต้องแก้ไฟล์นี้เลย
 *
 * - เส้นยังไม่ผ่าน: สีเทา
 * - เส้นที่เดินผ่านแล้ว: สีเขียว
 * - Animate ตอนกลายเป็น "ผ่านแล้ว" ด้วย stroke-dasharray/stroke-dashoffset
 *   (ใช้ pathLength="1" ทำให้ความยาวเส้นถูก normalize เป็น 1 เสมอ ไม่ต้องพึ่ง
 *   getTotalLength() ของ JS เลย เป็น CSS transition ล้วน ๆ)
 */

export interface PolylineSegment {
  key: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  passed: boolean
}

defineProps<{
  segments: PolylineSegment[]
}>()
</script>

<template>
  <g class="journey-polyline">
    <line
      v-for="segment in segments"
      :key="segment.key"
      :x1="segment.from.x"
      :y1="segment.from.y"
      :x2="segment.to.x"
      :y2="segment.to.y"
      path-length="1"
      class="journey-polyline__segment"
      :class="{ 'journey-polyline__segment--passed': segment.passed }"
    />
  </g>
</template>

<style scoped>
.journey-polyline__segment {
  stroke: #b7b0a3;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  opacity: 0.85;
  transition:
    stroke 0.4s ease,
    opacity 0.4s ease;
}

.journey-polyline__segment--passed {
  stroke: var(--farm-accent-dark, #457a26);
  opacity: 1;
  animation: draw-segment 0.7s ease forwards;
}

@keyframes draw-segment {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
