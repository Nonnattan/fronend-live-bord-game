<script setup lang="ts">
/**
 * layouts/app.vue
 * ---------------------------------------------------------------------------
 * Layout กลางของทุกหน้าในแอปหลัง Login (Home, Reservation, Scan QR, History,
 * Profile) — คุม "phone frame" เดียวกับหน้า Welcome/ProfileForm ให้ดูเป็นแอป
 * เดียวกัน ต่างกันแค่หน้านี้มี Bottom Navigation ติดอยู่ด้านล่างเสมอ และพื้นที่
 * เนื้อหา (slot) เลื่อน (scroll) ได้อิสระด้านในกรอบ
 *
 * ใช้กับหน้าไหนก็ตั้ง `definePageMeta({ layout: 'app' })`
 */
</script>

<template>
  <div class="app-shell">
    <div class="app-frame">
      <main class="app-content">
        <slot />
      </main>
      <BottomNav />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
}

.app-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--farm-sky-top) 0%, var(--farm-sky-bottom) 40%, var(--farm-cream) 75%);
}

.app-content {
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 5.5rem;
}
</style>
