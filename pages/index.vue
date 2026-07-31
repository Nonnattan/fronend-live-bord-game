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
 *      - พบ และมี Birth Year/Gender ครบแล้ว -> Login ทันที (loginFromMember) ข้ามฟอร์มไปเลย เข้าหน้า Home
 *      - พบ แต่ Birth Year/Gender ขาดอย่างใดอย่างหนึ่ง -> แสดง <MissingFieldsForm /> ให้กรอก
 *        เฉพาะฟิลด์ที่ขาด แล้วอัปเดตแถวเดิม (ห้ามสร้างแถวใหม่) ก่อนเข้าหน้า Home
 *      - ไม่พบ -> ปล่อยผ่านไปแสดง <ProfileForm /> (Step 2, สมัครสมาชิกใหม่)
 * 5) ยังไม่มีโปรไฟล์ แต่มี authData (Guest หรือ LINE ที่เช็คแล้วไม่พบ) -> แสดง <ProfileForm />
 * 6) ยังไม่มีทั้งคู่ -> แสดง <WelcomePage /> (Step 1)
 *
 * หมายเหตุ: ข้อ 4 กรณี "พบ และครบแล้ว" คือ Logic Login อัตโนมัติเดิมที่ทำงานถูกต้องอยู่แล้ว
 * ไม่ได้ถูกแก้ — เพิ่มแค่การเช็ค Birth Year/Gender ก่อนตัดสินใจนำทางไป /home เท่านั้น
 */

import type { MemberRecord } from '~/composables/useMemberApi'

const { authData, hasAuth, isLineLoading, lineError, initAuth, loginWithLine, loginAsGuest } = useAuth()
const { hasProfile, initProfile, loginFromMember } = useProfile()
const { loginByLine } = useMemberApi()

// ใช้กันไม่ให้ flash เนื้อหาผิดจังหวะระหว่างที่ยังไม่ได้เช็ค LocalStorage/LIFF/Google Sheet
const isReady = ref(false)

// สมาชิกที่พบจาก lineUserId เดิม แต่ Birth Year/Gender ยังขาดอย่างใดอย่างหนึ่ง -> ต้องกรอก
// เฉพาะฟิลด์ที่ขาดก่อน (ดู <MissingFieldsForm />) ค่านี้ไม่ว่างแปลว่ายังไม่ Login เสร็จ
const pendingMember = ref<MemberRecord | null>(null)

/** true ถ้าสมาชิกคนนี้ยังขาด Birth Year หรือ Gender อย่างใดอย่างหนึ่งใน Google Sheet */
function hasMissingFields(member: MemberRecord): boolean {
  return !member.birthYear || !member.gender
}

/**
 * ตรวจสอบ lineUserId กับ Google Sheet ก่อนเสมอเวลามี authData แบบ LINE ใหม่ ๆ
 * (สเปก: "Login ผ่าน LINE ให้ตรวจสอบ lineUserId ใน Google Sheet ก่อน พบ -> Login
 * ทันที ไม่พบ -> ไปหน้าสมัครสมาชิก") — ถ้าพบแต่ Birth Year/Gender ยังขาด จะพักไว้ที่
 * pendingMember แทนการนำทางไป /home ทันที (ให้ <MissingFieldsForm /> จัดการต่อ)
 */
async function resolveLineMember(): Promise<void> {
  if (authData.value?.loginType !== 'line' || hasProfile.value) return

  try {
    const result = await loginByLine(authData.value.uid)
    if (result.success && result.found && result.member) {
      if (hasMissingFields(result.member)) {
        pendingMember.value = result.member
        return
      }
      loginFromMember(result.member, authData.value)
      await navigateTo('/home')
    }
  } catch {
    // เช็คไม่สำเร็จ (เช่น เน็ตหลุด/ยังไม่ได้ตั้งค่า API_BASE_URL) -> ปล่อยผ่านไป
    // หน้ากรอกฟอร์มตามปกติ ไม่ block ผู้ใช้ไม่ให้สมัครสมาชิกต่อได้
  }
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
  // -> เช็ค lineUserId ก่อนเสมอ (นำทางไป /home เองถ้าครบแล้ว หรือตั้ง pendingMember
  // ถ้ายังขาด Birth Year/Gender)
  await resolveLineMember()

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

/** MissingFieldsForm อัปเดตแถวเดิมสำเร็จแล้ว (Birth Year/Gender ครบแล้ว) -> Login เข้าหน้า Home ทันที */
async function handleMissingFieldsCompleted(member: MemberRecord) {
  if (!authData.value) return
  loginFromMember(member, authData.value)
  pendingMember.value = null
  await navigateTo('/home')
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

      <!-- พบสมาชิกเดิมจาก lineUserId แล้ว แต่ Birth Year/Gender ในชีตยังขาด -> กรอกเฉพาะฟิลด์ที่ขาด -->
      <MissingFieldsForm
        v-else-if="pendingMember && authData"
        :member="pendingMember"
        :auth="authData"
        @completed="handleMissingFieldsCompleted"
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
  position: relative;
  overflow: hidden;
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
