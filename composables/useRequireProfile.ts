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
  const { ensureRoundStarted } = useRound()

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

    // Online Round (ใหม่): จุดนี้คือ "หลัง Online Login สำเร็จ" ของทุกหน้าที่มี guard
    // นี้ (มี memberId แล้วแน่นอนเพราะผ่าน hasProfile.value ด้านบนมาแล้ว) — เรียกได้
    // ทุกครั้งที่หน้า mount (Refresh/เปลี่ยนหน้า/กลับหน้าเดิม) อย่างปลอดภัย เพราะ
    // ensureRoundStarted() เองมี logic กันเรียก roundStart() ซ้ำอยู่แล้ว (ดู
    // composables/useRound.ts) — ไม่เรียกตอน Offline Mode เหมือน getMember() ด้านล่าง
    const memberId = profile.value?.memberId
    if (memberId && !isOfflineMode.value) {
      void ensureRoundStarted(memberId, profile.value?.firstName)
    }

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
