<script setup lang="ts">
/**
 * pages/offline.vue
 * ---------------------------------------------------------------------------
 * หน้า Fallback ที่ Service Worker จะเสิร์ฟให้ "เฉพาะตอน" เปิดหน้าที่ไม่เคยถูก
 * Cache ไว้มาก่อนและไม่มีอินเทอร์เน็ต (ดู service-worker/sw.ts -> NavigationRoute
 * + setCatchHandler) ไม่เกี่ยวกับ UI หลักของแอป ไม่ได้ต่อ Layout 'app' เพื่อให้
 * แสดงผลได้เองโดยไม่พึ่งพา Component/State อื่นใดเลย (กันพังซ้อนตอนออฟไลน์จริง ๆ)
 *
 * หมายเหตุ: หน้านี้ถูกตั้งให้ Prerender เป็นไฟล์ static ตอน build เสมอ
 * (ดู nuxt.config.ts -> nitro.prerender.routes) เพื่อให้ Service Worker
 * Precache เป็นไฟล์ HTML ล้วน ใช้เป็น navigateFallback ได้แน่นอน
 */

useHead({
  title: 'ออฟไลน์ | Register App',
})

function retry() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}
</script>

<template>
  <div class="offline-shell">
    <div class="offline-card">
      <div class="offline-icon">📡</div>
      <h1>ไม่มีการเชื่อมต่ออินเทอร์เน็ต</h1>
      <p>
        หน้านี้ยังไม่เคยถูกเปิดตอนออนไลน์ จึงยังไม่มีข้อมูล Cache ไว้ให้ใช้งาน
        กรุณาตรวจสอบสัญญาณอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง
      </p>
      <p class="offline-hint">
        หน้าที่เคยเปิดมาก่อนแล้ว (เช่น หน้าแรก/แผนที่/ประวัติ) ยังสามารถใช้งาน
        แบบออฟไลน์ได้ตามปกติ
      </p>
      <button type="button" class="offline-retry" @click="retry">
        ลองใหม่อีกครั้ง
      </button>
    </div>
  </div>
</template>

<style scoped>
.offline-shell {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(180deg, #bfe7f6 0%, #e7f6d8 40%, #fff8e6 75%);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

.offline-card {
  max-width: 380px;
  width: 100%;
  background: #fff8e6;
  border: 1px solid #f6e7bf;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(74, 47, 24, 0.12);
}

.offline-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.offline-card h1 {
  font-size: 1.15rem;
  color: #4a2f18;
  margin: 0 0 0.75rem;
}

.offline-card p {
  color: #8a7256;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 0.5rem;
}

.offline-hint {
  font-size: 0.8rem;
  opacity: 0.85;
}

.offline-retry {
  margin-top: 1.25rem;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.75rem;
  background: #5a9e33;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.offline-retry:active {
  background: #457a26;
}
</style>
