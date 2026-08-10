<script setup lang="ts">
/**
 * pages/map.vue
 * ---------------------------------------------------------------------------
 * หน้า Map — Adventure Game Map แบบเต็ม พื้นหลังเป็นภาพ PNG ล้วน ๆ (ไม่ใช้
 * Leaflet/OpenStreetMap/GPS ใด ๆ) 4 ฐานวางเป็นรูปสี่เหลี่ยมด้วยพิกัด % (X-Y)
 * (ชื่อ/คะแนน/เปิดปิดฐาน ดึงจากชีต "Stations" ฝั่ง Admin จริงเหมือนเดิม ผ่าน
 * useAdventure().refreshStationsFromBackend() — ตำแหน่งบนภาพ (%) กับไอคอน/สี
 * ยังเป็น Layout คงที่ฝั่ง frontend เหมือนเดิม ดู components/map/AdventureMap.vue)
 *
 * หน้านี้เป็นแค่ "หน้าอ้างอิงตำแหน่งฐาน" เท่านั้น ไม่แสดง Progress/สถานะผ่านฐาน
 * ใด ๆ (ไม่มี Checkmark ไม่มีคะแนนสะสม ไม่มีปุ่ม Toggle/Reset) — การบันทึกผ่าน
 * ฐานจริงทำผ่านการสแกน QR (ดู pages/scan.vue -> useOfflineSync.ts) เท่านั้น
 * ไม่แตะ/ไม่เกี่ยวข้องกับหน้านี้เลย
 *
 * โครงสร้าง (แยกไว้เพื่อสลับไปข้อมูลจริงได้ง่ายในอนาคต):
 * - composables/useAdventure.ts      -> รายชื่อฐาน (Stations) จริงจาก Google Sheet
 * - components/map/AdventureMap.vue  -> โครง UI หน้า Map เต็มจอ (PNG + Marker)
 * หน้านี้ทำหน้าที่แค่ "ประกอบร่าง" (orchestrate): ดึงรายชื่อฐานจาก useAdventure()
 * แล้วส่งต่อเป็น props ให้ AdventureMap เท่านั้น
 */

import AdventureMap from "~/components/map/AdventureMap.vue";

definePageMeta({ layout: "app" });

const { isReady } = useRequireProfile();

const { stations, refreshStationsFromBackend } = useAdventure();

onMounted(() => {
  void refreshStationsFromBackend();
});
</script>

<template>
  <div class="page">
    <PageHeader title="Adventure Map" />

    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>

    <div v-else class="map-page">
      <!-- Adventure Map เต็ม: แผนที่อ้างอิงตำแหน่งฐานล้วน ๆ ไม่มี Progress/สถานะผ่านฐาน -->
      <AdventureMap :stations="stations" />
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
</style>
