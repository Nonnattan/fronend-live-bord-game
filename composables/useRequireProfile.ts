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
  const { isOfflineMode } = useOfflineMode()

  const isReady = ref(false)

  onMounted(async () => {
    initProfile()

    if (!hasProfile.value) {
      await navigateTo('/')
      return
    }
    // isReady มาจาก LocalStorage ล้วน ๆ ตรงนี้แล้ว — ทุกหน้าที่ guard ด้วย composable
    // นี้ (Home/Map/Scan/History ฯลฯ) ใช้งานได้ทันทีแม้ไม่มีอินเทอร์เน็ตเลย ส่วนการ
    // รีเฟรชคะแนนจาก Google Sheet ด้านล่างเป็นแค่ของเสริมที่ไม่ block ตรงนี้อยู่แล้ว
    isReady.value = true

    // [Fix — root cause ของ "Login/เข้า Home ก็เปิด Round ทันที ทั้งที่ยังไม่ได้สแกน
    // ฐานไหนเลย"] เดิมที่นี่เรียก ensureRoundStarted() ทุกครั้งที่ "หน้าใดก็ได้" ที่มี
    // guard นี้ mount (Home/Map/Reservation/History/Profile/Info ด้วย ไม่ใช่แค่ Scan)
    // ทำให้ Round ถูกเปิดทันทีที่ Login เสร็จแล้วเด้งมาหน้า Home ก่อนสแกนฐานไหนเลยสัก
    // ฐาน — ผิดสเปก "Login ห้ามเปิด Round / Scan ฐานแรกเท่านั้นที่เปิด Round" นอกจากนี้
    // ยังทำให้หน้าต่าง (window) ของ race ระหว่าง "ปิด Round เดิม" กับ "เปิด Round ใหม่"
    // แคบมาก (แทบจะทันทีที่กลับมาหน้า Home) ซึ่งเป็นสาเหตุหลักที่ pendingCheckins ที่
    // sync ช้า/ค้างคิวจาก Round ที่เพิ่งจบ มีโอกาสไปผูกกับ Round ใหม่ผิดตัว (ดู
    // resolveCurrentRoundId_ ใน server-gas/CheckinService.gs) จนฐานของรอบเก่า (เช่น
    // "milk"/"corn") โผล่มาเป็นฐานที่ผ่านแล้วของรอบใหม่ที่ยังไม่ได้เล่นเลย
    //
    // ย้าย ensureRoundStarted() ไปเรียกที่ pages/scan.vue::completeStationVisit()
    // แทน — เรียกเฉพาะตอน "กำลังจะบันทึกฐานที่สแกนผ่านจริง" เท่านั้น (ฐานแรกของรอบ
    // เป็นตัวเปิด Round ตามสเปก ฐานถัดไปในรอบเดียวกัน ensureRoundStarted() ก็แค่
    // ข้ามเพราะมี currentRoundId อยู่แล้ว ไม่ยิงซ้ำ) หน้า Home/Map/Reservation/History/
    // Profile/Info ที่ใช้ guard นี้จึง "ไม่เปิด Round" อีกต่อไปไม่ว่าจะเข้ากี่ครั้งก็ตาม
    const memberId = profile.value?.memberId

    // Offline First (แก้ไขจุดนี้): เช็ค navigator.onLine ก่อนเสมอ ถ้ารู้อยู่แล้วว่า
    // ไม่มีอินเทอร์เน็ต ไม่ต้องยิง getMember() เลย (เดิมยิงไปเสมอไม่ว่าจะออนไลน์
    // หรือไม่ ทำให้ทุกครั้งที่เปิดหน้าที่มี guard นี้ตอนออฟไลน์ จะมี Request ที่
    // รู้อยู่แล้วว่าต้อง Fail แน่ ๆ ค้างอยู่เบื้องหลังโดยไม่จำเป็น) ถ้ามีเน็ตแต่
    // เรียกไม่สำเร็จ (เช่น API ล่มชั่วคราว) ยังคง try/catch เงียบ ๆ เหมือนเดิม
    // ใช้ค่าที่ cache ไว้ต่อไปได้เลย ไม่กระทบการใช้งานหน้าปัจจุบัน
    if (memberId && !isOfflineMode.value) {
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
