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
 *
 * [ใหม่] ซ่อน Bottom Navigation ทั้งหมดตราบใดที่ยังไม่กดปุ่ม GO (ยังไม่มี Round
 * Timer เริ่ม — ดู composables/useRoundTimer.ts::hasActiveRoundTimer) ตามสเปก
 * "อยู่หน้า Go จะกดอะไรไม่ได้เลยนอกจาก Go" — ผู้เล่นจะสลับไปหน้าอื่น (แผนที่/
 * สแกน/โปรไฟล์) ผ่านปุ่มเมนูล่างไม่ได้จนกว่าจะกด GO เริ่มรอบก่อนเสมอ เช็คจาก
 * Layout ที่นี่จุดเดียว (ใช้ร่วมกันทุกหน้าที่ตั้ง layout: 'app') ไม่ต้องไปเพิ่ม
 * Logic ซ้ำในแต่ละหน้า — hasActiveRoundTimer เป็น useState กลาง เห็นค่าเดียวกัน
 * ทุกหน้าอยู่แล้ว ไม่กระทบการเช็ค isReady/useRequireProfile เดิมของแต่ละหน้าเลย
 */
const { hasActiveRoundTimer } = useRoundTimer()
</script>

<template>
  <div class="app-shell">
    <div class="app-frame">
      <main class="app-content" :class="{ 'app-content--no-nav': !hasActiveRoundTimer }">
        <slot />
      </main>
      <BottomNav v-if="hasActiveRoundTimer" />
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

/* ไม่มี BottomNav ลอยทับด้านล่าง (ยังไม่กด GO) -> ไม่ต้องเผื่อระยะห่างก้อนนี้ */
.app-content--no-nav {
  padding-bottom: 0;
}
</style>
