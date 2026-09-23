import { f as useState, a as useOfflineMode } from '../virtual/entry.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { u as useStationMissions } from './useStationMissions-DyKPx7bx.mjs';
import { computed, watch } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function createEmptyProgress(roundKey) {
  return {
    roundKey,
    currentScanStationId: null,
    selectedFavoriteStationId: null,
    gameCompleted: false
  };
}
function clearStationQuestProgress() {
  const progress = useState("station-quest-progress", () => createEmptyProgress("no-round"));
  progress.value = createEmptyProgress("no-round");
}
function useStationQuest() {
  const progress = useState("station-quest-progress", () => createEmptyProgress("no-round"));
  const initialized = useState("station-quest-initialized", () => false);
  const { currentRoundId} = useRound();
  const { isOfflineMode, roundData } = useOfflineMode();
  const effectiveRoundKey = computed(() => {
    var _a;
    if (currentRoundId.value) return `online:${currentRoundId.value}`;
    if (isOfflineMode.value && ((_a = roundData.value) == null ? void 0 : _a.startedAt)) return `offline:${roundData.value.startedAt}`;
    return "no-round";
  });
  function resetForCurrentRound() {
    progress.value = createEmptyProgress(effectiveRoundKey.value);
    progress.value;
  }
  async function initStationQuest() {
  }
  watch(effectiveRoundKey, (next) => {
    if (!initialized.value || progress.value.roundKey === next) return;
    if (next === "no-round") return;
    resetForCurrentRound();
  });
  const currentScanStationId = computed(() => progress.value.currentScanStationId);
  const selectedFavoriteStationId = computed(() => progress.value.selectedFavoriteStationId);
  const gameCompleted = computed(() => progress.value.gameCompleted);
  function canEnterStation(stationId) {
    const { isStationMissionComplete } = useStationMissions();
    return isStationMissionComplete(stationId) || progress.value.currentScanStationId === stationId;
  }
  function getStationCardState(stationId) {
    const { getStationMissions, missionProgressCount, isStationMissionComplete } = useStationMissions();
    const totalMissions = getStationMissions(stationId).length;
    return {
      completedMissions: missionProgressCount(stationId),
      totalMissions,
      isCompleted: isStationMissionComplete(stationId),
      isAccessible: canEnterStation(stationId)
    };
  }
  function scanStation(stationId) {
    progress.value = {
      ...progress.value,
      currentScanStationId: stationId
    };
    progress.value;
  }
  function consumeScanAccess(stationId) {
    if (progress.value.currentScanStationId !== stationId) return;
    progress.value = {
      ...progress.value,
      currentScanStationId: null
    };
    progress.value;
  }
  function setFavoriteStation(stationId) {
    progress.value = {
      ...progress.value,
      selectedFavoriteStationId: stationId
    };
    progress.value;
  }
  function markGameCompleted() {
    progress.value = {
      ...progress.value,
      gameCompleted: true
    };
    progress.value;
  }
  return {
    currentScanStationId,
    selectedFavoriteStationId,
    gameCompleted,
    initStationQuest,
    canEnterStation,
    getStationCardState,
    scanStation,
    consumeScanAccess,
    setFavoriteStation,
    markGameCompleted
  };
}

export { clearStationQuestProgress as c, useStationQuest as u };
//# sourceMappingURL=useStationQuest-Bji0iII9.mjs.map
