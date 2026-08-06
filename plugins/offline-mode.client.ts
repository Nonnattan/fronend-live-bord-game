/**
 * plugins/offline-mode.client.ts
 * ---------------------------------------------------------------------------
 * ผูก online/offline events + sync สถานะเข้า useOfflineMode() ตั้งแต่แอปเริ่ม
 * เมื่อเน็ตกลับมา -> อัปเดต useOfflineSync().isOnline + auto-sync คิวที่ค้าง
 */
export default defineNuxtPlugin(() => {
  const { initConnectivityWatch } = useOfflineMode()
  const { isOnline, hasPending, isSyncing, syncNow, initOfflineSync } = useOfflineSync()

  initOfflineSync()

  function syncOnlineState(): void {
    isOnline.value = navigator.onLine
  }

  function trySyncSilently(): void {
    if (!isOnline.value || !hasPending.value || isSyncing.value) return
    syncNow().catch(() => {})
  }

  syncOnlineState()

  initConnectivityWatch(() => {
    syncOnlineState()
    trySyncSilently()
  })

  // เปิดแอปมาพร้อมเน็ต + มีคิวค้างจากรอบก่อน
  trySyncSilently()
})
