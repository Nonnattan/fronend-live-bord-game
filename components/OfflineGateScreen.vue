<script setup lang="ts">
/**
 * components/OfflineGateScreen.vue
 * ---------------------------------------------------------------------------
 * หน้ายืนยันก่อนเข้า Offline Mode (ข้อ 2-5 ในสเปก) — แสดง "เพียงหน้านี้หน้า
 * เดียวเท่านั้น" (app.vue จะซ่อน <NuxtLayout>/<NuxtPage> ทั้งหมดตอนที่
 * offlineGatePending เป็น true) แจ้งผู้ใช้ชัดเจนว่ากำลังจะเข้าโหมด Offline
 * ข้อมูลเก็บไว้ในเครื่องเท่านั้น ยังไม่ส่งข้อมูล/คำนวณคะแนน และมีปุ่มเดียวคือ
 * "เข้าโหมด Offline" — กดแล้วเรียก useOfflineMode().confirmOfflineMode()
 * ซึ่งเป็นจุดเดียวที่ล็อก Session เข้า Offline Mode จริง (ห้ามสลับกลับ Online
 * ตลอด Session แม้ Internet จะกลับมา)
 *
 * ไม่ต่อ Layout 'app' เพื่อไม่ให้พึ่งพา Component/State อื่นของแอปหลัก (กันพัง
 * ซ้อนตอนออฟไลน์จริง ๆ เหมือนแนวทางเดียวกับ pages/offline.vue ที่มีอยู่แล้ว)
 * ใช้โทนสี/สไตล์ farm theme เดียวกับ components/WelcomePage.vue ทั้งหมด
 */

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <div class="offline-gate">
    <div class="offline-gate__card">
      <div class="offline-gate__icon-wrap">
        <UIcon name="i-lucide-wifi-off" class="offline-gate__icon" />
      </div>

      <h1 class="offline-gate__title">ขณะนี้คุณกำลังใช้งานในโหมด Offline</h1>

      <p class="offline-gate__desc">
        ตรวจไม่พบการเชื่อมต่ออินเทอร์เน็ต ระบบจะเก็บข้อมูลการเล่นทั้งหมดไว้
        ในเครื่องของคุณเท่านั้น (LocalStorage)
      </p>
      <p class="offline-gate__desc">
        ในโหมดนี้จะ<strong>ยังไม่มีการส่งข้อมูลขึ้นเซิร์ฟเวอร์ และยังไม่มีการ
        คำนวณคะแนน</strong>ใด ๆ จนกว่าจะกลับมาออนไลน์และเข้าสู่ระบบใหม่อีกครั้ง
      </p>
      <p class="offline-gate__hint">
        เมื่อกดเข้าสู่โหมด Offline แล้ว จะไม่สามารถสลับกลับเป็นโหมด Online
        ได้ตลอดการใช้งานครั้งนี้ แม้อินเทอร์เน็ตจะกลับมาระหว่างเล่นก็ตาม
      </p>

      <UButton
        block
        size="xl"
        color="warning"
        class="offline-gate__button"
        @click="emit('confirm')"
      >
        เข้าโหมด Offline
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.offline-gate {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(180deg, var(--farm-sky-top) 0%, var(--farm-sky-bottom) 55%, var(--farm-grass) 100%);
}

.offline-gate__card {
  width: 100%;
  max-width: 420px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--farm-cream);
  border: 3px solid var(--farm-wood);
  border-radius: 1.5rem;
  box-shadow: 0 12px 0 -4px var(--farm-wood-dark), 0 20px 32px -12px rgba(74, 47, 24, 0.35);
}

.offline-gate__icon-wrap {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #d98c3f 0%, #a8442b 100%);
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px -8px rgba(168, 68, 43, 0.6);
  border: 3px solid var(--farm-cream);
}

.offline-gate__icon {
  width: 2.1rem;
  height: 2.1rem;
  color: var(--farm-cream);
}

.offline-gate__title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--farm-text-dark);
  margin: 0 0 0.9rem;
}

.offline-gate__desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--farm-text-muted);
  margin: 0 0 0.6rem;
}

.offline-gate__desc strong {
  color: var(--farm-text-dark);
}

.offline-gate__hint {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--farm-text-muted);
  background: var(--farm-cream-dark);
  border: 1.5px solid var(--farm-wood);
  border-radius: 0.75rem;
  padding: 0.6rem 0.75rem;
  margin: 0.4rem 0 1.5rem;
}

.offline-gate__button {
  font-weight: 700;
}
</style>
