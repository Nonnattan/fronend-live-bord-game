import { f as useState } from '../virtual/entry.mjs';
import { computed, watch, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

var STATION_TYPE_META = {
  corn: {
    icon: "\u{1F33D}",
    label: "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E32\u0E27\u0E42\u0E1E\u0E14",
    color: "#f2b134",
    colorDark: "#c98a12"
  },
  cow: {
    icon: "\u{1F404}",
    label: "\u0E10\u0E32\u0E19\u0E27\u0E31\u0E27",
    color: "#f6f1e7",
    colorDark: "#4a2f18"
  },
  soil: {
    icon: "\u{1F331}",
    label: "\u0E10\u0E32\u0E19\u0E14\u0E34\u0E19",
    color: "#8fc74e",
    colorDark: "#5a9e33"
  },
  milk: {
    icon: "\u{1F95B}",
    label: "\u0E10\u0E32\u0E19\u0E19\u0E21",
    color: "#eaf6ff",
    colorDark: "#5cb8e0"
  }
};
var MOCK_ADVENTURE_STATIONS = [
  {
    id: "corn",
    name: "\u0E10\u0E32\u0E19\u0E02\u0E49\u0E32\u0E27\u0E42\u0E1E\u0E14",
    type: "corn",
    lat: 14.647,
    lng: 101.121
  },
  {
    id: "cow",
    name: "\u0E10\u0E32\u0E19\u0E27\u0E31\u0E27",
    type: "cow",
    lat: 14.647,
    lng: 101.126
  },
  {
    id: "milk",
    name: "\u0E10\u0E32\u0E19\u0E19\u0E21",
    type: "milk",
    lat: 14.643,
    lng: 101.126,
    isFinal: true
  },
  {
    id: "soil",
    name: "\u0E10\u0E32\u0E19\u0E14\u0E34\u0E19",
    type: "soil",
    lat: 14.643,
    lng: 101.121
  }
];
var ADVENTURE_STATION_POSITIONS = {
  corn: {
    x: 73,
    y: 33
  },
  cow: {
    x: 29,
    y: 56
  },
  soil: {
    x: 47,
    y: 67
  },
  milk: {
    x: 47,
    y: 80
  }
};
var ADVENTURE_START_POINT = {
  x: 12,
  y: 90
};
var DEFAULT_VISITED = [];
function useAdventure() {
  const visitedIds = useState("adventure-visited-stations", () => []);
  const initialized = useState("adventure-initialized", () => false);
  const visitedRoundId = useState("adventure-visited-round-id", () => null);
  const backendTotalPoint = useState("adventure-backend-total-point", () => null);
  const isSyncingFromBackend = useState("adventure-syncing-from-backend", () => false);
  const initialScore = useState("adventure-initial-score", () => null);
  useState("adventure-initial-score-initialized", () => false);
  const resetEpoch = useState("adventure-reset-epoch", () => 0);
  const stationsState = useState("adventure-stations", () => MOCK_ADVENTURE_STATIONS.map((s) => ({
    ...s,
    points: 250,
    active: true
  })));
  const stationsInitialized = useState("adventure-stations-initialized", () => false);
  const stations = computed(() => stationsState.value.filter((s) => s.active !== false));
  const totalStations = computed(() => stations.value.length);
  const visitedCount = computed(() => visitedIds.value.length);
  const totalPoint = computed(() => {
    return visitedIds.value.reduce((sum, id) => {
      var _a, _b;
      return sum + ((_b = (_a = stationsState.value.find((s) => s.id === id)) == null ? void 0 : _a.points) != null ? _b : 250);
    }, 0);
  });
  const isComplete = computed(() => visitedCount.value >= totalStations.value);
  function isVisited(stationId) {
    return visitedIds.value.includes(stationId);
  }
  function getStoredRoundId() {
    return null;
  }
  watch(totalPoint, (score) => {
  });
  async function initAdventure(userId) {
    if (initialized.value) return;
    visitedIds.value = DEFAULT_VISITED;
    visitedRoundId.value = getStoredRoundId();
    initialized.value = true;
    await Promise.all([refreshFromBackend(), refreshStationsFromBackend()]);
  }
  async function refreshStationsFromBackend() {
    if (stationsInitialized.value) return;
  }
  async function refreshFromBackend(userId) {
  }
  function toggleStation(stationId, roundId) {
    const next = visitedIds.value.includes(stationId) ? visitedIds.value.filter((id) => id !== stationId) : [...visitedIds.value, stationId];
    visitedIds.value = next;
    if (roundId !== void 0) visitedRoundId.value = roundId;
  }
  function resetJourney() {
    visitedIds.value;
    totalPoint.value;
    visitedRoundId.value;
    resetEpoch.value += 1;
    visitedIds.value = [];
    visitedRoundId.value = null;
    backendTotalPoint.value = null;
    initialScore.value = 0;
  }
  return {
    stations,
    totalStations,
    visitedIds: readonly(visitedIds),
    visitedCount,
    totalPoint,
    initialScore: readonly(initialScore),
    isComplete,
    isSyncingFromBackend: readonly(isSyncingFromBackend),
    isVisited,
    initAdventure,
    refreshFromBackend,
    refreshStationsFromBackend,
    toggleStation,
    resetJourney
  };
}

export { ADVENTURE_STATION_POSITIONS as A, STATION_TYPE_META as S, ADVENTURE_START_POINT as a, useAdventure as u };
//# sourceMappingURL=useAdventure-oyoryhV9.mjs.map
