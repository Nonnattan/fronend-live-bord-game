/**
 * plugins/offline-sync.client.ts
 * ---------------------------------------------------------------------------
 * Retry sync เป็นระยะ (45 วินาที) กรณี Sync ล้มเหลวชั่วคราว
 * online/offline events ถูกจัดการโดย plugins/offline-mode.client.ts แล้ว
 */
const RETRY_INTERVAL_MS = 45_000

export default defineNuxtPlugin(() => {
  const { isOnline, hasPending, isSyncing, syncNow } = useOfflineSync()

  function trySyncSilently(): void {
    if (!isOnline.value || !hasPending.value || isSyncing.value) return
    syncNow().catch(() => {})
  }

  window.setInterval(trySyncSilently, RETRY_INTERVAL_MS)
})
