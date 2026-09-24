<script setup lang="ts">
/**
 * pages/station-quest.vue
 * ---------------------------------------------------------------------------
 * [แก้ไข] เดิมเป็นหน้าทดลอง UI ต้นแบบของ Flow "ปลดล็อคฐาน + ภารกิจ" (Mockup
 * ล้วน ๆ ก่อนจะย้ายมาเป็นหน้าเต็มจริงที่ pages/stations.vue +
 * pages/station/[stationId].vue) — nuxt.config.ts (nitro.prerender.routes)
 * บันทึกไว้แล้วว่าไฟล์นี้ "ถูกลบทิ้งแล้ว" ตั้งแต่ตอนย้าย Flow จริงเข้า /scan
 * (ดูคอมเมนต์ที่นั่น) แต่ไฟล์จริงยังไม่เคยถูกลบออกจากดิสก์ — ไม่มีที่ไหนใน
 * แอปลิงก์มาหน้านี้แล้ว (ตรวจสอบแล้ว) และยังอ้างอิง Mock Type/Composable API
 * รุ่นเก่าที่ถูกแทนที่ไปหมดแล้ว (types/stationMission.ts,
 * composables/useStationQuest.ts) จึงคงไว้แค่เป็นทางเผื่อ URL/Bookmark เก่าที่
 * อาจหลงเหลืออยู่ — พาไปหน้า "เลือกฐาน" จริงให้ทันที ไม่แสดง UI ต้นแบบเดิมอีก
 */
definePageMeta({ layout: "app" });

onMounted(() => {
  void navigateTo("/stations", { replace: true });
});
</script>

<template>
  <div />
</template>
