<script setup lang="ts">
/**
 * components/map/MapBackground.vue
 * ---------------------------------------------------------------------------
 * ภาพประกอบพื้นหลังของ Adventure Game Map — วาดด้วย SVG ล้วน ๆ (ไม่ใช้รูป
 * JPG/PNG ใด ๆ) สไตล์ Flat Design การ์ตูนสีสันสด องค์ประกอบครบตามสเปก:
 * ถนน, ทางเดิน, ต้นไม้, แม่น้ำ, สะพาน, ภูเขา, หญ้า, อาคาร, ป้ายไม้, ธง,
 * จุด Start, จุด Finish
 *
 * เป็น "Presentational component" ล้วน ๆ ไม่มี state/props ผูกกับข้อมูลฐานเลย
 * (แค่วาดฉากพื้นหลัง) ต้อง render อยู่ภายใน <svg viewBox="0 0 100 100"> เดียว
 * กับ JourneyPolyline / StationMarker เสมอ เพื่อให้พิกัด % ตรงกัน จึง export
 * เป็น <g> ไม่ใช่ <svg> ของตัวเอง
 */

/** ต้นไม้ตกแต่ง — ตำแหน่งคงที่ (Mockup) วางเลี่ยงเส้นทาง/ฐานทั้งหมด */
const trees = [
  { id: 1, x: 8, y: 34, s: 1 },
  { id: 2, x: 34, y: 44, s: 0.85 },
  { id: 3, x: 46, y: 60, s: 1.1 },
  { id: 4, x: 58, y: 88, s: 0.9 },
  { id: 5, x: 72, y: 34, s: 1 },
  { id: 6, x: 90, y: 64, s: 0.95 },
  { id: 7, x: 6, y: 62, s: 0.8 },
  { id: 8, x: 38, y: 14, s: 0.85 },
  { id: 9, x: 82, y: 90, s: 1 },
]
</script>

<template>
  <g class="map-bg">
    <defs>
      <linearGradient id="bgSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bdeaff" />
        <stop offset="60%" stop-color="#e7f8d8" />
        <stop offset="100%" stop-color="#bfe285" />
      </linearGradient>
      <linearGradient id="bgMountain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b9a7d6" />
        <stop offset="100%" stop-color="#8f78b8" />
      </linearGradient>
      <linearGradient id="bgRiver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7fd6f2" />
        <stop offset="100%" stop-color="#4fb6de" />
      </linearGradient>
    </defs>

    <!-- ท้องฟ้า -->
    <rect x="0" y="0" width="100" height="100" fill="url(#bgSky)" />

    <!-- ก้อนเมฆการ์ตูน -->
    <g class="map-bg__clouds" fill="#ffffff" opacity="0.85">
      <ellipse cx="14" cy="8" rx="6" ry="2.6" />
      <ellipse cx="19" cy="6.5" rx="4.4" ry="2.2" />
      <ellipse cx="70" cy="6" rx="5.5" ry="2.3" />
      <ellipse cx="76" cy="8" rx="4" ry="2" />
      <ellipse cx="46" cy="4" rx="4.5" ry="1.8" />
    </g>

    <!-- ภูเขาด้านหลัง -->
    <g class="map-bg__mountains">
      <polygon points="0,26 12,8 24,26" fill="url(#bgMountain)" />
      <polygon points="10,26 24,4 40,26" fill="url(#bgMountain)" />
      <polygon points="34,26 46,10 58,26" fill="url(#bgMountain)" opacity="0.9" />
      <polygon points="8,8 12,8 15,15 9,15" fill="#ffffff" opacity="0.8" />
      <polygon points="20,4 24,4 27,11 21,11" fill="#ffffff" opacity="0.8" />
      <polygon points="43,10 46,10 48.5,16 41.5,16" fill="#ffffff" opacity="0.8" />
    </g>

    <!-- พื้นหญ้า -->
    <path
      d="M0,32 C18,26 30,34 46,30 C64,26 80,34 100,28 L100,100 L0,100 Z"
      fill="#8fc74e"
    />
    <!-- ลายหญ้าเข้ม (texture) -->
    <g class="map-bg__grass-texture" fill="#5a9e33" opacity="0.35">
      <ellipse cx="8" cy="46" rx="7" ry="3" />
      <ellipse cx="90" cy="50" rx="8" ry="3.4" />
      <ellipse cx="52" cy="92" rx="10" ry="3.6" />
      <ellipse cx="12" cy="88" rx="7" ry="3" />
      <ellipse cx="95" cy="86" rx="6" ry="2.6" />
      <ellipse cx="36" cy="52" rx="6" ry="2.4" />
    </g>

    <!-- แม่น้ำคดเคี้ยว -->
    <path
      class="map-bg__river"
      d="M6,30 C10,40 24,38 26,48 C28,58 14,58 16,68 C18,78 32,74 36,84 C39,91 48,92 54,96"
      fill="none"
      stroke="url(#bgRiver)"
      stroke-width="6.5"
      stroke-linecap="round"
    />
    <path
      class="map-bg__river-highlight"
      d="M6,30 C10,40 24,38 26,48 C28,58 14,58 16,68 C18,78 32,74 36,84 C39,91 48,92 54,96"
      fill="none"
      stroke="#e0f7ff"
      stroke-width="1.6"
      stroke-linecap="round"
      opacity="0.6"
    />

    <!-- ถนนดิน/ทางเดินหลัก (ตกแต่ง แยกจากเส้น Journey) -->
    <path
      class="map-bg__road"
      d="M14,82 C20,72 26,66 26,52 C26,44 20,40 24,32 C28,24 40,26 42,18 C44,12 56,14 62,20 C70,28 68,42 78,50 C84,54 84,58 78,60 C70,64 66,68 66,76 C66,84 78,84 86,78"
      fill="none"
      stroke="#e0c496"
      stroke-width="4.4"
      stroke-linecap="round"
    />
    <path
      d="M14,82 C20,72 26,66 26,52 C26,44 20,40 24,32 C28,24 40,26 42,18 C44,12 56,14 62,20 C70,28 68,42 78,50 C84,54 84,58 78,60 C70,64 66,68 66,76 C66,84 78,84 86,78"
      fill="none"
      stroke="#b9793f"
      stroke-width="1"
      stroke-dasharray="2.2 2.6"
      stroke-linecap="round"
      opacity="0.7"
    />

    <!-- สะพานข้ามแม่น้ำ ใกล้ฐานที่ 3 -->
    <g class="map-bg__bridge" transform="translate(22,42) rotate(18)">
      <rect x="-8" y="-2.6" width="16" height="5.2" rx="1.4" fill="#c9915a" stroke="#7a4a24" stroke-width="0.6" />
      <line v-for="n in 6" :key="n" :x1="-7 + n * 2.3" y1="-2.6" :x2="-7 + n * 2.3" y2="2.6" stroke="#7a4a24" stroke-width="0.5" />
      <line x1="-8" y1="-2.9" x2="8" y2="-2.9" stroke="#7a4a24" stroke-width="0.8" />
      <line x1="-8" y1="2.9" x2="8" y2="2.9" stroke="#7a4a24" stroke-width="0.8" />
    </g>

    <!-- กลุ่มต้นไม้การ์ตูน -->
    <g class="map-bg__trees">
      <g v-for="tree in trees" :key="tree.id" :transform="`translate(${tree.x},${tree.y}) scale(${tree.s})`">
        <rect x="-0.6" y="0" width="1.2" height="3" rx="0.5" fill="#8a5a30" />
        <circle cx="0" cy="-1.4" r="3" fill="#6bb33e" />
        <circle cx="-2.1" cy="0" r="2.3" fill="#5a9e33" />
        <circle cx="2.1" cy="0" r="2.3" fill="#5a9e33" />
      </g>
    </g>

    <!-- อาคาร/กระท่อมไม้ตกแต่ง -->
    <g class="map-bg__building" transform="translate(50,86)">
      <rect x="-6" y="-4" width="12" height="8" rx="0.6" fill="#f6e7bf" stroke="#7a4a24" stroke-width="0.6" />
      <polygon points="-7,-4 0,-10 7,-4" fill="#c9573f" stroke="#7a4a24" stroke-width="0.6" />
      <rect x="-1.6" y="-0.2" width="3.2" height="4.2" rx="0.3" fill="#7a4a24" />
      <rect x="-4.6" y="-1.8" width="2.4" height="2.4" rx="0.3" fill="#7fd6f2" stroke="#7a4a24" stroke-width="0.4" />
      <rect x="2.2" y="-1.8" width="2.4" height="2.4" rx="0.3" fill="#7fd6f2" stroke="#7a4a24" stroke-width="0.4" />
    </g>

    <!-- จุด Start -->
    <g class="map-bg__start" transform="translate(6,90)">
      <rect x="-0.6" y="-2" width="1.2" height="10" fill="#7a4a24" />
      <path d="M0.6,-2 L7,0.4 L0.6,3 Z" fill="#f6f6f6" stroke="#4a2f18" stroke-width="0.5" />
      <path d="M0.6,-2 L3.8,-0.8 L0.6,0.7 Z" fill="#333" />
      <path d="M0.6,0.7 L3.8,1.4 L0.6,3 Z" fill="#333" />
      <g transform="translate(0,9.6)">
        <rect x="-6" y="-2.2" width="12" height="4.4" rx="0.6" fill="#e0c496" stroke="#7a4a24" stroke-width="0.5" />
        <text x="0" y="1" class="map-bg__sign-text">START</text>
      </g>
    </g>

    <!-- จุด Finish -->
    <g class="map-bg__finish" transform="translate(94,12)">
      <rect x="-0.6" y="-2" width="1.2" height="10" fill="#7a4a24" />
      <path d="M-6.6,-2 L-0.2,0.4 L-6.6,3 Z" fill="#ffffff" stroke="#4a2f18" stroke-width="0.5" />
      <path d="M-6.6,-2 L-3.4,-0.8 L-6.6,0.7 Z" fill="#333" />
      <path d="M-4,0.7 L-0.8,-0.7 L-0.2,0.4 Z" fill="#333" />
      <g transform="translate(0,9.6)">
        <rect x="-6" y="-2.2" width="12" height="4.4" rx="0.6" fill="#e0c496" stroke="#7a4a24" stroke-width="0.5" />
        <text x="0" y="1" class="map-bg__sign-text">FINISH</text>
      </g>
    </g>
  </g>
</template>

<style scoped>
.map-bg__river {
  filter: drop-shadow(0 0.6px 0 rgba(0, 0, 0, 0.08));
}

.map-bg__sign-text {
  font-size: 3px;
  font-weight: 800;
  fill: #4a2f18;
  text-anchor: middle;
  dominant-baseline: middle;
}

.map-bg__clouds ellipse {
  animation: cloud-drift 26s ease-in-out infinite;
}

.map-bg__clouds ellipse:nth-child(2n) {
  animation-duration: 32s;
  animation-delay: -6s;
}

@keyframes cloud-drift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2.5px);
  }
}
</style>
