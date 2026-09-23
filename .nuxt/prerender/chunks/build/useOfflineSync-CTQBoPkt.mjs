import { f as useState } from '../virtual/entry.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { computed, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

var PENDING_KEY = "offlineSync:pendingCheckins";
var LAST_SYNC_KEY = "offlineSync:lastSyncAt";
function genUuid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function readJson(key, fallback) {
  return fallback;
}
function useOfflineSync() {
  const isOnline = useState("offline-sync-is-online", () => true);
  const pendingCheckins = useState("offline-sync-pending", () => []);
  const initialized = useState("offline-sync-initialized", () => false);
  const isSyncing = useState("offline-sync-syncing", () => false);
  const lastSyncAt = useState("offline-sync-last-at", () => null);
  const lastMessage = useState("offline-sync-last-message", () => "");
  const pendingCount = computed(() => pendingCheckins.value.length);
  const hasPending = computed(() => pendingCount.value > 0);
  function initOfflineSync() {
    if (initialized.value) return;
    pendingCheckins.value = readJson(PENDING_KEY, []);
    lastSyncAt.value = readJson(LAST_SYNC_KEY, null);
    initialized.value = true;
  }
  function persistQueue(next) {
    pendingCheckins.value = next;
  }
  function isQueued(stationId) {
    return pendingCheckins.value.some((item) => item.stationId === stationId);
  }
  function queueCheckin(station, point) {
    if (isQueued(station.id)) return;
    const { currentRoundId } = useRound();
    persistQueue([...pendingCheckins.value, {
      uuid: genUuid(),
      stationId: station.id,
      stationName: station.name,
      point,
      visitedAt: Date.now(),
      roundId: currentRoundId.value
    }]);
  }
  async function syncNow() {
    return {
      success: false,
      reason: "offline",
      syncedCount: 0,
      remainingCount: pendingCount.value,
      message: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E30 Sync \u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15"
    };
  }
  return {
    isOnline,
    pendingCheckins: readonly(pendingCheckins),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastSyncAt: readonly(lastSyncAt),
    lastMessage: readonly(lastMessage),
    initOfflineSync,
    isQueued,
    queueCheckin,
    syncNow
  };
}

export { useOfflineSync as u };
//# sourceMappingURL=useOfflineSync-CTQBoPkt.mjs.map
