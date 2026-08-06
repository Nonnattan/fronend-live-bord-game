/**
 * plugins/offline-mode.client.ts
 * ---------------------------------------------------------------------------
 * เรียกตรวจสอบ Internet + ล็อก Offline Mode ทันทีตอนแอปเริ่มทำงาน (Nuxt
 * plugin ทำงานก่อนหน้าไหน ๆ จะ mount เสมอ) ตรงตามสเปกข้อ 1-3:
 * "เมื่อเข้าเว็บ ให้ตรวจสอบ Internet ทันที / ไม่มี Internet -> เข้า Offline
 * Mode / อยู่ Offline Mode แล้วห้ามสลับเป็น Online แม้ Internet จะกลับมา"
 *
 * ดู composables/useOfflineMode.ts สำหรับ Logic เต็ม — ไฟล์นี้แค่เรียกครั้งเดียว
 * ตอนเริ่มแอป ไม่ได้ผูก event listener ใด ๆ เพิ่ม (ไม่มีอะไรให้ฟังต่อ เพราะ
 * ตัดสินใจครั้งเดียวจบตาม sessionStorage/navigator.onLine ตอนนี้เท่านั้น)
 *
 * ไม่เกี่ยวข้อง/ไม่แตะ plugins/offline-sync.client.ts เดิม (คนละระบบกันคนละไฟล์)
 */
export default defineNuxtPlugin(() => {
  const { checkAndLockOfflineMode } = useOfflineMode()
  checkAndLockOfflineMode()
})
