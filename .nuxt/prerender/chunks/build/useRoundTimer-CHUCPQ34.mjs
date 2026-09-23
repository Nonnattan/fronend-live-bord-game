import { f as useState } from '../virtual/entry.mjs';
import { computed } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

var ROUND_DURATION_MS = 72e5;
var STATION_DURATION_MS = 18e5;
function readEndsAt(key) {
  return null;
}
function useRoundTimer() {
  const roundEndsAt = useState("round-timer-round-ends-at", () => null);
  const stationEndsAt = useState("round-timer-station-ends-at", () => null);
  const tick = useState("round-timer-tick", () => Date.now());
  function initRoundTimer() {
    roundEndsAt.value = readEndsAt();
    stationEndsAt.value = readEndsAt();
    tick.value = Date.now();
  }
  function startRoundTimer() {
    const endsAt = Date.now() + ROUND_DURATION_MS;
    roundEndsAt.value = endsAt;
  }
  function startStationTimer() {
    const endsAt = Date.now() + STATION_DURATION_MS;
    stationEndsAt.value = endsAt;
  }
  function clearStationTimer() {
    stationEndsAt.value = null;
  }
  function clearAllTimers() {
    roundEndsAt.value = null;
    stationEndsAt.value = null;
  }
  const roundRemainingMs = computed(() => roundEndsAt.value === null ? null : Math.max(0, roundEndsAt.value - tick.value));
  const stationRemainingMs = computed(() => stationEndsAt.value === null ? null : Math.max(0, stationEndsAt.value - tick.value));
  const hasActiveRoundTimer = computed(() => roundEndsAt.value !== null);
  const isRoundExpired = computed(() => roundRemainingMs.value !== null && roundRemainingMs.value <= 0);
  const isStationExpired = computed(() => stationRemainingMs.value !== null && stationRemainingMs.value <= 0);
  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1e3);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor(totalSeconds % 3600 / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }
  return {
    initRoundTimer,
    startRoundTimer,
    startStationTimer,
    clearStationTimer,
    clearAllTimers,
    roundRemainingMs,
    stationRemainingMs,
    roundRemainingLabel: computed(() => roundRemainingMs.value === null ? null : formatDuration(roundRemainingMs.value)),
    stationRemainingLabel: computed(() => stationRemainingMs.value === null ? null : formatDuration(stationRemainingMs.value)),
    hasActiveRoundTimer,
    isRoundExpired,
    isStationExpired
  };
}

export { useRoundTimer as u };
//# sourceMappingURL=useRoundTimer-CHUCPQ34.mjs.map
