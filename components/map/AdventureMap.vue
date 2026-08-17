<script setup lang="ts">
/**
 * components/map/AdventureMap.vue
 * ---------------------------------------------------------------------------
 * แผนที่ Adventure Map แบบเต็มจอ (ใช้ในหน้า /map เท่านั้น) — พื้นหลังเป็นภาพ
 * เกาะลอยฟาร์มที่มีตึก/หมุด/ป้ายชื่อฐานทั้ง 4 วาดอยู่ในภาพเลย
 * (public/images/adventure-map-bg.jpg) ไม่ใช้ Leaflet/OpenStreetMap/GPS ใด ๆ
 *
 * เป็น "Presentational component" ล้วน ๆ: รับ stations และ visitedIds จาก
 * useAdventure() ผ่าน props — ไม่มี state สแกนแยกของตัวเอง เพื่อให้เครื่องหมาย ✓
 * ซิงก์กับ MiniMap และหน้าสรุปตลอดเวลา การบันทึกผ่านฐานจริงยังทำผ่านการสแกน QR
 * (ดู pages/scan.vue) เท่านั้น ไม่ใช่จากหน้านี้
 *
 * [แก้ไข — ผู้ใช้ยืนยันให้ใช้ภาพที่มีหมุด/ตึก/ป้ายชื่ออยู่ในภาพเลย] เดิมวาดหมุด
 * บับเบิลกรอบแดง (เด้งได้) + ไอคอนตกแต่งทับพื้นหลังเปล่าด้วย CSS/รูปแยก —
 * ตอนนี้พื้นหลังภาพเดียวมีครบทั้งตึก/หมุด/ป้ายชื่อ/ไอคอนตกแต่งอยู่แล้ว จึงตัด
 * ส่วนวาดทับทั้งหมดออก (รวมถึง Animation เด้ง — ทำกับรูปนิ่งภาพเดียวไม่ได้ ผู้ใช้
 * ยอมรับข้อจำกัดนี้แล้ว) เหลือไว้แค่ "ติ๊กถูกสีเขียว" ทับตำแหน่งฐานที่ผ่านแล้ว
 * เท่านั้น (ใช้ ADVENTURE_STATION_POSITIONS เดิมจาก useAdventure.ts บอกตำแหน่ง)
 * เพื่อให้ยังเห็นความคืบหน้าได้ — เป็นสิ่งเดียวที่รูปนิ่งทำเองไม่ได้
 */

import type { AdventureStation } from "~/composables/useAdventure";
import { ADVENTURE_STATION_POSITIONS } from "~/composables/useAdventure";

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
      src="/images/adventure-map-bg.jpg"
      alt="แผนที่ฟาร์ม Adventure"
      draggable="false"
    />

    <!-- ติ๊กถูกสีเขียว — แสดงเฉพาะฐานที่ผ่านแล้วเท่านั้น (สิ่งเดียวที่พื้นหลัง
         ภาพนิ่งบอกไม่ได้เอง) ทับตำแหน่งหมุดเดิมที่วาดอยู่ในภาพพอดี -->
    <div
      v-for="station in props.stations"
      :key="station.id"
      class="station-check-slot"
      :style="{ left: `${positionOf(station).x}%`, top: `${positionOf(station).y}%` }"
    >
      <span v-if="isVisited(station.id)" class="station-check" :aria-label="`${station.name}: ผ่านแล้ว`">
        <UIcon name="i-lucide-check" class="station-check__icon" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.adventure-map {
  position: relative;
  width: 100%;
  max-width: 100%;
  /* สัดส่วนจริงของภาพพื้นหลัง (1139x1437) กัน object-fit: cover ครอบตัดบน/ล่าง
     ทิ้งจนตำแหน่ง % ของติ๊กถูกคลาดเคลื่อนจากภาพจริง */
  aspect-ratio: 1139 / 1437;
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

/* จุดยึดตำแหน่ง — ตัวเปล่านี้ไม่แสดงอะไรเลยถ้ายังไม่ผ่านฐาน (หมุด/ตึก/ป้ายชื่อ
   ทั้งหมดอยู่ในภาพพื้นหลังแล้ว) จะเห็นแค่ติ๊กถูกโผล่มาตอนผ่านฐานแล้วเท่านั้น */
.station-check-slot {
  position: absolute;
  transform: translate(-50%, -100%);
  z-index: 10;
  pointer-events: none;
}

.station-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #5fb648;
  border: 2.5px solid #fff8ec;
  box-shadow: 0 3px 6px rgba(74, 47, 24, 0.5);
}

.station-check__icon {
  width: 0.9rem;
  height: 0.9rem;
  color: #fff;
}
</style>
