/**
 * composables/useRequireProfile.ts
 * ---------------------------------------------------------------------------
 * Guard ฝั่ง client สำหรับทุกหน้าในแอปที่ต้อง Login + กรอกโปรไฟล์ครบก่อนเท่านั้น
 * (Home, Map, Reservation, Scan QR, History, Profile, Info) — ถ้ายังไม่มีโปรไฟล์
 * ให้เด้งกลับไปหน้า "/" (Welcome/Login) ทันที
 *
 * ใช้ client-side check ล้วน ๆ (ไม่ใช่ Nuxt route middleware ทั่วไป) เพราะ
 * สถานะ Login ทั้งหมดอยู่ใน LocalStorage เท่านั้น (ไม่มี server session/cookie)
 * จึงต้องรอ onMounted ฝั่ง client ก่อนตัดสินใจเสมอ เหมือน pages/index.vue เดิม
 */
export function useRequireProfile() {
  const { profile, hasProfile, initProfile, refreshFromMember } = useProfile()
  const { getMember } = useMemberApi()

  const isReady = ref(false)

  onMounted(async () => {
    initProfile()

    if (!hasProfile.value) {
      await navigateTo('/')
      return
    }
    isReady.value = true

    // รีเฟรชข้อมูลล่าสุดจาก Google Sheet แบบเงียบ ๆ (คะแนนสะสม/จำนวนครั้งเข้าใช้)
    // ถ้าเรียกไม่สำเร็จ (เช่น ยังไม่ตั้งค่า API_BASE_URL หรือเน็ตหลุด) ใช้ค่าที่ cache ไว้ต่อไปได้เลย
    const memberId = profile.value?.memberId
    if (memberId) {
      try {
        const res = await getMember(memberId)
        if (res.success && res.member) {
          refreshFromMember(res.member)
        }
      } catch {
        // เงียบไว้ — ไม่ให้กระทบการใช้งานหน้า Home
      }
    }
  })

  return { profile, isReady }
}
