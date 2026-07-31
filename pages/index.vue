<script setup lang="ts">
/**
 * pages/index.vue
 * ---------------------------------------------------------------------------
 * Controller ของ Step 1-2 (Login + กรอกโปรไฟล์): ตัดสินใจว่าจะแสดงหน้าไหนใน
 * 2 หน้าแรก แล้ว "เข้าสู่หน้า Home ทันที" (หน้าแรกของแอปหลัง Login) ด้วย
 * navigateTo('/home') ทันทีที่มีโปรไฟล์ครบ — ตัวหน้า Home เองอยู่ที่
 * pages/home.vue แยกต่างหาก
 *
 * ลำดับการทำงานตอนเปิดเว็บ:
 * 1) initAuth()    -> เช็ค authData เดิม หรือเช็คว่าเพิ่งถูก LINE redirect กลับมา
 * 2) initProfile() -> โหลดโปรไฟล์เดิมจาก LocalStorage (ถ้ามี)
 * 3) มี userProfile ครบแล้ว          -> ข้ามทุกอย่าง เข้าหน้า Home ทันที
 * 4) เพิ่งได้ authData แบบ LINE ใหม่ (ยังไม่มีโปรไฟล์) -> resolveLineMember():
 *    เช็ค lineUserId กับ Google Sheet ก่อนเสมอ (สเปกใหม่)
 *      - พบ    -> Login ทันที (loginFromMember) ข้ามฟอร์มไปเลย เข้าหน้า Home
 *      - ไม่พบ -> ปล่อยผ่านไปแสดง <ProfileForm /> (Step 2, สมัครสมาชิกใหม่)
 * 5) ยังไม่มีโปรไฟล์ แต่มี authData (Guest หรือ LINE ที่เช็คแล้วไม่พบ) -> แสดง <ProfileForm />
 * 6) ยังไม่มีทั้งคู่ -> แสดง <WelcomePage /> (Step 1)
 */

const { authData, hasAuth, isLineLoading, lineError, initAuth, loginWithLine, loginAsGuest } = useAuth()
const { hasProfile, initProfile, loginFromMember } = useProfile()
const { loginByLine } = useMemberApi()

// ใช้กันไม่ให้ flash เนื้อหาผิดจังหวะระหว่างที่ยังไม่ได้เช็ค LocalStorage/LIFF/Google Sheet
const isReady = ref(false)

/**
 * ตรวจสอบ lineUserId กับ Google Sheet ก่อนเสมอเวลามี authData แบบ LINE ใหม่ ๆ
 * (สเปก: "Login ผ่าน LINE ให้ตรวจสอบ lineUserId ใน Google Sheet ก่อน พบ -> Login
 * ทันที ไม่พบ -> ไปหน้าสมัครสมาชิก") คืนค่า true ถ้า login สำเร็จและนำทางไป
 * /home แล้ว (ผู้เรียกไม่ต้องทำอะไรต่อ)
 */
async function resolveLineMember(): Promise<boolean> {
  if (authData.value?.loginType !== 'line' || hasProfile.value) return false

  try {
    const result = await loginByLine(authData.value.uid)
    if (result.success && result.found && result.member) {
      loginFromMember(result.member, authData.value)
      await navigateTo('/home')
      return true
    }
  } catch {
    // เช็คไม่สำเร็จ (เช่น เน็ตหลุด/ยังไม่ได้ตั้งค่า API_BASE_URL) -> ปล่อยผ่านไป
    // หน้ากรอกฟอร์มตามปกติ ไม่ block ผู้ใช้ไม่ให้สมัครสมาชิกต่อได้
  }
  return false
}

onMounted(async () => {
  await initAuth()
  initProfile()

  // ข้อ 3 ในสเปก: กรอกโปรไฟล์ครบแล้ว (ไม่ว่าสมาชิกใหม่หรือเดิม) -> เข้าหน้า Home ทันที
  if (hasProfile.value) {
    await navigateTo('/home')
    return
  }

  // ข้อ 4: เพิ่งได้ authData แบบ LINE (จาก initAuth ที่เพิ่งถูก redirect กลับมา)
  // -> เช็ค lineUserId ก่อนเสมอ ถ้า login สำเร็จ resolveLineMember() นำทางไปแล้ว
  if (await resolveLineMember()) return

  isReady.value = true
})

/** Step 1: กด "เข้าสู่ระบบด้วย LINE" — ครอบ loginWithLine() เดิม แล้วเช็ค lineUserId ต่อทันที */
async function handleSelectLine() {
  await loginWithLine()
  // ถ้า liff.login() ต้อง redirect ออกไปจริง ฟังก์ชันนี้ก็จะ return โดยที่ authData
  // ยังไม่มีค่า (หน้าเว็บกำลังจะถูก redirect ออกไปอยู่แล้ว ไม่ต้องทำอะไรต่อ)
  // แต่ถ้า login อยู่แล้ว (เช่น เปิดผ่าน LINE app ที่ login ค้างไว้) จะได้ authData ทันที
  // โดยไม่มีการ redirect -> ต้องเช็ค lineUserId ต่อในจังหวะนี้เลย
  if (authData.value?.loginType === 'line' && !hasProfile.value) {
    isReady.value = false
    await resolveLineMember()
    isReady.value = true
  }
}

function handleRegistered() {
  // ฟอร์มบันทึกข้อมูล + sync กับ Google Sheet สำเร็จแล้ว (สมัครสมาชิกใหม่) -> เข้าหน้า Home ทันที
  navigateTo('/home')
}
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame">
      <!-- ยังไม่พร้อม (กำลังเช็ค LocalStorage / LIFF / กำลังเช็ค lineUserId กับ Google Sheet / กำลัง redirect ไป Home) -->
      <div v-if="!isReady" class="loading">
        <UIcon name="i-lucide-loader-2" class="loading__spinner" />
      </div>

      <!-- Step 1: ยังไม่เคยเลือกวิธีเข้าใช้งานเลย -->
      <WelcomePage
        v-else-if="!hasAuth"
        :line-loading="isLineLoading"
        :line-error="lineError"
        @select-line="handleSelectLine"
        @select-guest="loginAsGuest"
      />

      <!-- Step 2: เลือกวิธีแล้ว (LINE ที่เช็คแล้วไม่พบสมาชิกเดิม หรือ Guest) แต่ยังกรอกโปรไฟล์ไม่ครบ -->
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
