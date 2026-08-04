/**
 * plugins/offline-sync.client.ts
 * ---------------------------------------------------------------------------
 * ผูก window 'online'/'offline' event แค่ครั้งเดียวทั้งแอป (ไม่ผูกซ้ำทุกครั้งที่
 * หน้า Scan ถูก mount) แล้ว sync ค่าล่าสุดเข้า useOfflineSync().isOnline
 *
 * Auto-sync เกิดขึ้นอัตโนมัติ 3 จังหวะ (ไม่ต้องกดปุ่มเอง):
 *   1) เปิดแอปขึ้นมาแล้วมีเน็ตอยู่แล้วตั้งแต่แรก + มีข้อมูลค้างใน queue (เช่น
 *      ปิดแอประหว่างออฟไลน์ไว้ค้างคิว แล้วเปิดใหม่ตอนกลับมามีเน็ตแล้ว)
 *   2) กลับมามีอินเทอร์เน็ตอีกครั้งระหว่างใช้งาน (จาก offline -> online event)
 *   3) เน็ตไม่หลุดเลยแต่ Sync ครั้งก่อนล้มเหลวแบบชั่วคราว (เช่น Apps Script
 *      ตอบช้า/error ชั่วขณะ) -> เช็คซ้ำเป็นระยะทุก 45 วินาทีจนกว่า queue จะว่าง
 *      (ข้อ 3 นี้เป็นตัวกันเหนียวเพิ่มเติม เผื่อกรณีไม่มี online/offline event
 *      มาช่วยกระตุ้นให้ Sync ใหม่)
 * ทุกจังหวะเรียก syncNow() ตัวเดิม ไม่มีการยิง Google Sheet ซ้ำซ้อนกันเอง เพราะ
 * syncNow() กันตัวเองด้วย isSyncing อยู่แล้ว (ดู composables/useOfflineSync.ts)
 *
 * ไม่แก้ระบบ Login เดิมและไม่แตะ UI หลักใด ๆ — ทำงานเงียบ ๆ เบื้องหลังเท่านั้น
 */
const RETRY_INTERVAL_MS = 45_000

export default defineNuxtPlugin(() => {
  const { isOnline, hasPending, isSyncing, syncNow, initOfflineSync } = useOfflineSync()

  isOnline.value = navigator.onLine
  initOfflineSync()

  function trySyncSilently(): void {
    if (!isOnline.value || !hasPending.value || isSyncing.value) return
    // Sync แบบเงียบ ๆ เบื้องหลัง — หน้า Scan (ถ้าเปิดอยู่) จะเห็นผลลัพธ์ผ่าน
    // pendingCount/lastMessage ที่เป็น reactive state เดียวกันอยู่แล้ว
    syncNow().catch(() => {
      // เงียบไว้ — ถ้า Sync อัตโนมัติไม่สำเร็จ ข้อมูลยังอยู่ครบใน queue เหมือนเดิม
      // (ไม่มีการลบ/ทำลายข้อมูล) จะลองใหม่อัตโนมัติในรอบถัดไป (interval/online event)
      // หรือผู้ใช้กดปุ่ม "Sync ตอนนี้" เองก็ได้เช่นกัน
    })
  }

  // จังหวะที่ 1: เปิดแอปมาแล้วมีเน็ตอยู่แล้ว + มีข้อมูลค้างจากรอบก่อนหน้า
  trySyncSilently()

  // จังหวะที่ 2: กลับมามีเน็ตระหว่างใช้งาน
  window.addEventListener('online', () => {
    isOnline.value = true
    trySyncSilently()
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
  })

  // จังหวะที่ 3: กันเหนียว — เน็ตไม่เคยหลุดแต่ Sync ครั้งก่อนล้มเหลวชั่วคราว
  window.setInterval(trySyncSilently, RETRY_INTERVAL_MS)
})
