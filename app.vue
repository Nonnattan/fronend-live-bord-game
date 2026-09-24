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
 *
 * Offline Mode (ใหม่, ข้อ 2-5): เพิ่มการเช็ค offlineGatePending ที่จุดสูงสุด
 * ของแอป (เหนือทุก Route/Layout) — ถ้า plugins/offline-mode.client.ts ตรวจพบ
 * ว่าไม่มี Internet ตอนเข้าเว็บ ให้ "แสดงเฉพาะ <OfflineGateScreen />" แทน
 * <NuxtLayout>/<NuxtPage> ทั้งหมด (ตรงตามสเปกข้อ 2 "แสดงหน้าสำหรับ Offline
 * Mode เท่านั้น") ไม่ว่าผู้ใช้จะเปิด URL ไหนก็ตาม จนกว่าจะกดปุ่ม "เข้าโหมด
 * Offline" เรียก confirmOfflineMode() ซึ่งเป็นจุดเดียวที่ล็อก Session เข้า
 * Offline Mode จริง (ข้อ 5) จากนั้นจึงปล่อยให้ Flow เดิม (Login + Registration
 * Form ฯลฯ) ทำงานต่อตามปกติ (ข้อ 6) — ถ้ามี Internet ตอนเข้าเว็บ
 * offlineGatePending จะเป็น false เสมอ ไม่กระทบ Flow Online เดิมเลย
 */
const { offlineGatePending, confirmOfflineMode } = useOfflineMode()
</script>

<template>
  <OfflineGateScreen v-if="offlineGatePending" @confirm="confirmOfflineMode" />
  <template v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <VitePwaManifest />
  </template>
</template>
