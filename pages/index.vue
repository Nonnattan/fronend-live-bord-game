<script setup lang="ts">
/**
 * pages/index.vue
 * ---------------------------------------------------------------------------
 * Controller ของ Step 1-2 (Login + กรอกโปรไฟล์): ตัดสินใจว่าจะแสดงหน้าไหนใน
 * 2 หน้าแรก แล้ว "เข้าสู่หน้า Home ทันที" (หน้าแรกของแอปหลัง Login) ด้วย
 * navigateTo('/home') ทันทีที่มีโปรไฟล์ครบ — ตัวหน้า Home เองอยู่ที่
 * pages/home.vue แยกต่างหาก
 *
 * ลำดับการทำงานตอนเปิดเว็บ (แก้ไขลำดับข้อ 1-2 แล้ว — ดูเหตุผลเต็ม ๆ ที่ onMounted ด้านล่าง):
 * 1) initProfile() -> โหลดโปรไฟล์เดิมจาก LocalStorage ก่อนเสมอ (ไม่แตะเน็ตเวิร์กเลย)
 * 2) มี userProfile ครบแล้ว -> ข้ามทุกอย่างรวมถึง initAuth()/LIFF เข้าหน้า Home ทันที
 *    (Offline First: ผู้ใช้ที่เคย Login ค้างไว้แล้วเปิดแอปได้แม้ไม่มีอินเทอร์เน็ต)
 * 3) initAuth()    -> เช็ค authData เดิม หรือเช็คว่าเพิ่งถูก LINE redirect กลับมา
 *    (ทำเฉพาะกรณียังไม่มีโปรไฟล์เท่านั้น — ขั้นตอนนี้ต้องใช้เน็ตเวิร์กจริง ๆ)
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
 *
 * หมายเหตุ Offline First: ขั้นตอน 3-6 (initAuth/LIFF, loginByLine, ProfileForm,
 * MissingFieldsForm) ทั้งหมดเกิดขึ้นเฉพาะตอน "ยังไม่เคย Login ให้เสร็จสมบูรณ์"
 * เท่านั้น ซึ่งเป็นขั้นตอนยืนยันตัวตนครั้งแรกที่จำเป็นต้องใช้อินเทอร์เน็ตอยู่แล้ว
 * โดยธรรมชาติ (ไม่ว่าจะ Login ผ่าน LINE จริงหรือสร้างสมาชิกใหม่ผ่าน Google Sheet)
 * — เมื่อ Login สำเร็จครั้งแรกและมี userProfile ใน LocalStorage แล้ว (ข้อ 2)
 * การเปิดแอปครั้งต่อ ๆ ไปจะไม่แตะเน็ตเวิร์กจากไฟล์นี้อีกเลย
 */

import type { MemberRecord } from '~/composables/useMemberApi'

const { authData, hasAuth, isLineLoading, lineError, initAuth, loginWithLine, loginAsGuest } = useAuth()
const { profile, hasProfile, initProfile, loginFromMember } = useProfile()
const { loginByLine } = useMemberApi()
// Offline Mode (ใหม่): ล็อกไว้แล้วตั้งแต่ plugins/offline-mode.client.ts ถ้าเข้าเว็บ
// มาแบบไม่มี Internet — ใช้เช็คในหน้านี้เพื่อข้ามขั้นตอนที่ต้องพึ่งเน็ต (LIFF/LINE)
const { isOfflineMode, startRound } = useOfflineMode()

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
  // ---------------------------------------------------------------------
  // Offline First (แก้ไขจุดนี้): เช็คโปรไฟล์จาก LocalStorage (initProfile)
  // ก่อนเสมอ ถ้ามีโปรไฟล์ครบอยู่แล้ว (เคย Login สำเร็จมาก่อนหน้านี้) ให้เข้า
  // หน้า Home ทันที "โดยไม่ต้องเรียก initAuth() เลย"
  //
  // สาเหตุที่ต้องแก้: โค้ดเดิมเรียก `await initAuth()` แบบไม่มีเงื่อนไขก่อนเช็ค
  // hasProfile เสมอ ซึ่ง initAuth() จะไป `liff.init()` ที่คุยกับเซิร์ฟเวอร์ LINE
  // จริง ๆ (ต้องใช้เน็ตเวิร์ก) แม้ว่าจะมี userProfile ครบอยู่ใน LocalStorage
  // แล้วก็ตาม — ผลคือทุกครั้งที่เปิดแอปใหม่ตอนไม่มีอินเทอร์เน็ต ผู้ใช้ที่ Login
  // ค้างไว้แล้วจะต้องรอ Request ที่ล้มเหลว (เสียเวลา/ขึ้น error เงียบ ๆ ใน
  // background) ก่อนจะเข้าหน้า Home ได้ ไม่ตรงกับเป้าหมาย "เปิดแอปครั้งถัดไปได้
  // แม้ไม่มีอินเทอร์เน็ต" — ย้ายให้เช็ค hasProfile ก่อน แล้วค่อยเรียก initAuth()
  // เฉพาะตอนที่ยังไม่มีโปรไฟล์เท่านั้น (กรณีนี้จำเป็นต้องใช้เน็ตเวิร์กจริง ๆ เพื่อ
  // ยืนยันตัวตนครั้งแรก หรือดัก LINE redirect callback ตามปกติ) ไม่กระทบ Flow
  // เดิมของทั้ง 2 กรณีเลย
  // ---------------------------------------------------------------------
  initProfile()

  // ข้อ 3 ในสเปก: กรอกโปรไฟล์ครบแล้ว (ไม่ว่าสมาชิกใหม่หรือเดิม) -> เข้าหน้า Home ทันที
  if (hasProfile.value) {
    await navigateTo('/home')
    return
  }

  // -------------------------------------------------------------------
  // Offline Mode (ใหม่): ถ้า Session นี้ถูกล็อกเข้า Offline Mode แล้ว (ไม่มี
  // Internet ตอนเข้าเว็บ) ให้ข้าม initAuth()/resolveLineMember() ไปเลย —
  // ทั้งสองฟังก์ชันนี้คุยกับ LIFF/Google Sheet จริง ต้องใช้ Internet เสมอ
  // ข้ามไปแสดงหน้า Welcome ทันที ผู้ใช้กด "เข้าใช้งานโดยไม่เชื่อม LINE" (Guest)
  // ได้ตามปกติ (ไม่พึ่งเน็ตอยู่แล้วในโค้ดเดิม ดู useAuth.ts -> loginAsGuest())
  // -------------------------------------------------------------------
  if (!isOfflineMode.value) {
    await initAuth()

    // ข้อ 4: เพิ่งได้ authData แบบ LINE (จาก initAuth ที่เพิ่งถูก redirect กลับมา)
    // -> เช็ค lineUserId ก่อนเสมอ (นำทางไป /home เองถ้าครบแล้ว หรือตั้ง pendingMember
    // ถ้ายังขาด Birth Year/Gender)
    await resolveLineMember()
  }

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
  // ข้อ 6-7 (Offline Mode ใหม่): กรอก Registration Form เสร็จแล้ว (บันทึกลง
  // LocalStorage ผ่าน ProfileForm.vue เรียบร้อยแล้ว) -> เริ่มบันทึก
  // round_datetime.start ทันที ก่อนเข้าหน้า Home (เฉพาะ Offline Mode เท่านั้น
  // ไม่กระทบ Flow Online เดิมเลย)
  if (isOfflineMode.value && profile.value?.uid) {
    startRound(profile.value.uid)
  }
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
        :offline-mode="isOfflineMode"
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
