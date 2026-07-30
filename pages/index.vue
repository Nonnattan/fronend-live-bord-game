<script setup lang="ts">
/**
 * pages/index.vue
 * ---------------------------------------------------------------------------
 * Controller ของ Step 1-2 (Login + กรอกโปรไฟล์): ตัดสินใจว่าจะแสดงหน้าไหนใน
 * 2 หน้าแรก แล้ว "เข้าสู่หน้า Map ทันที" (หน้าแรกของแอปหลัง Login ตามสเปกใหม่)
 * ด้วย navigateTo('/map') ทันทีที่มีโปรไฟล์ครบ — ตัวหน้า Map เองอยู่ที่
 * pages/map.vue แยกต่างหาก (ไม่มีหน้า Home อีกต่อไป)
 *
 * ลำดับการทำงานตอนเปิดเว็บ:
 * 1) initAuth()    -> เช็ค authData เดิม หรือเช็คว่าเพิ่งถูก LINE redirect กลับมา
 * 2) initProfile() -> โหลดโปรไฟล์เดิมจาก LocalStorage (ถ้ามี)
 * 3) มี userProfile ครบแล้ว          -> ข้ามทุกอย่าง เข้าหน้า Map ทันที
 * 4) ยังไม่มีโปรไฟล์ แต่มี authData   -> แสดง <ProfileForm /> (Step 2, บังคับกรอก)
 * 5) ยังไม่มีทั้งคู่                  -> แสดง <WelcomePage /> (Step 1)
 */

const { authData, hasAuth, isLineLoading, lineError, initAuth, loginWithLine, loginAsGuest } = useAuth()
const { hasProfile, initProfile } = useProfile()

// ใช้กันไม่ให้ flash เนื้อหาผิดจังหวะระหว่างที่ยังไม่ได้เช็ค LocalStorage/LIFF
const isReady = ref(false)

onMounted(async () => {
  await initAuth()
  initProfile()

  // ข้อ 2-5 ในสเปก: Login สำเร็จ + กรอกโปรไฟล์ครบแล้ว (ไม่ว่าสมาชิกใหม่หรือเดิม)
  // -> เข้าสู่หน้า Map ทันที (หน้าแรกของแอป)
  if (hasProfile.value) {
    await navigateTo('/map')
    return
  }
  isReady.value = true
})

function handleRegistered() {
  // ฟอร์มบันทึกโปรไฟล์ + sync กับ Google Sheet สำเร็จแล้ว -> เข้าหน้า Map ทันที
  navigateTo('/map')
}
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame">
      <!-- ยังไม่พร้อม (กำลังเช็ค LocalStorage / LIFF / กำลัง redirect ไป Home) -->
      <div v-if="!isReady" class="loading">
        <UIcon name="i-lucide-loader-2" class="loading__spinner" />
      </div>

      <!-- Step 1: ยังไม่เคยเลือกวิธีเข้าใช้งานเลย -->
      <WelcomePage
        v-else-if="!hasAuth"
        :line-loading="isLineLoading"
        :line-error="lineError"
        @select-line="loginWithLine"
        @select-guest="loginAsGuest"
      />

      <!-- Step 2: เลือกวิธีแล้ว (LINE หรือ Guest) แต่ยังกรอกโปรไฟล์ไม่ครบ -->
      <ProfileForm
        v-else-if="authData"
        :auth="authData"
        @registered="handleRegistered"
      />
    </div>
  </div>
</template>

<style scoped>
.phone-shell {
  min-height: 100dvh;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 0%, #0f2a1f 0%, #08110d 55%, #05080a 100%);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading__spinner {
  width: 2rem;
  height: 2rem;
  color: #06c755;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
