/**
 * plugins/persistent-storage.client.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ (แก้ไขจุดนี้ — Storage Eviction บน Android Chrome): เดิมไม่มีการขอ
 * Persistent Storage จากฝั่ง Client เลยแม้แต่จุดเดียว มีแค่ที่ลองขอใน
 * service-worker/sw.ts (activate event) เท่านั้น — เพิ่มจุดนี้เข้ามาเสริมอีกชั้น
 * เพราะสเปก Storage API แนะนำให้เรียก `navigator.storage.persist()` จาก
 * Document Context (หน้าเว็บจริง ที่มี Site Engagement Score ผูกอยู่) ด้วย
 * ไม่ใช่แค่จาก Service Worker เท่านั้น — เพิ่มโอกาสที่ Browser จะอนุมัติ
 * Persistent Storage ให้ Origin นี้มากที่สุด (ลดโอกาส Android ลบ Cache
 * Storage/Service Worker Registration ทิ้งเงียบ ๆ ตอนเครื่องขาดพื้นที่ ซึ่งเป็น
 * สาเหตุหลักที่ทำให้ "เปิดครั้งแรกใช้งานได้ปกติ แต่ปิดเน็ตแล้วเปิดใหม่กลับใช้
 * งานออฟไลน์ไม่ได้" ทั้งที่ Service Worker เคย Cache ไว้ครบแล้วจริง)
 *
 * Best-effort ล้วน ๆ — ไม่ Block อะไร ไม่มี UI ให้เห็น ถ้า Browser ไม่รองรับ/
 * ปฏิเสธก็แค่ข้ามไปเฉย ๆ ไม่กระทบการทำงานอื่นของแอปเลย
 */
export default defineNuxtPlugin(() => {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return

  navigator.storage
    .persist()
    .catch(() => {
      // ไม่รองรับ/ถูกปฏิเสธ — ไม่ใช่ Error ที่ต้องแจ้งผู้ใช้ ปล่อยผ่านเงียบ ๆ
    })
})
