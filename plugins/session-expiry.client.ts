/**
 * plugins/session-expiry.client.ts
 * ---------------------------------------------------------------------------
 * [ใหม่] ตรวจ "อายุ Session การเล่น" (สูงสุด 24 ชม.) ครั้งเดียวตอนแอปเริ่มทำงาน —
 * ก่อนหน้าไหนจะ mount เสร็จ (ดู composables/useSessionExpiry.ts) เกิน 24 ชม. จริง
 * -> ล้างเฉพาะข้อมูลเกม/Session ที่เกี่ยวข้อง (ไม่แตะ userProfile/authData) แล้ว
 * เด้งไปหน้า Login "/" ทันที ไม่มี Session ค้างอยู่เลย (ยังไม่เคยกด GO/เล่นจบไปแล้ว
 * ตามปกติ) -> ไม่ทำอะไรเลย ปล่อยให้ Flow เดิมทำงานตามปกติทุกประการ
 */
export default defineNuxtPlugin(async () => {
  const { checkAndClearIfExpired } = useSessionExpiry()
  await checkAndClearIfExpired()
})
