<script setup lang="ts">
/**
 * app.vue (root)
 * ---------------------------------------------------------------------------
 * โปรเจกต์นี้เดิมไม่มีไฟล์ app.vue ที่ root เลย (Nuxt ใช้ default ภายในให้เอง
 * โดยอัตโนมัติ เทียบเท่ากับ `<NuxtLayout><NuxtPage /></NuxtLayout>` ทุก
 * ประการ) — ไฟล์นี้เพิ่มเข้ามาเพื่อ "คงพฤติกรรมเดิมทุกอย่างไว้ครบ" แล้วแค่แทรก
 * <VitePwaManifest /> (Component จาก @vite-pwa/nuxt, Auto-import ให้แล้ว)
 * เพิ่มเข้ามาจุดเดียว เพื่อฝัง <link rel="manifest"> ของ Web App Manifest ลง
 * ใน <head> ของทุกหน้า (จำเป็นต้องมี Component นี้อยู่ในต้นไม้ของ App จริง ๆ
 * ถึงจะทำงาน — ตัว Module เองไม่ได้ฝังให้อัตโนมัติถ้าไม่มี Component นี้อยู่
 * ที่ไหนเลยในแอป) ไม่ได้แก้ไข Layout/UI ใด ๆ ทั้งสิ้น
 */
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <VitePwaManifest />
</template>
