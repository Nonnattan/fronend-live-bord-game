import { a as useOfflineMode, n as navigateTo } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { u as useProfile } from './useProfile-Di4CdYil.mjs';
import { u as useAdventure } from './useAdventure-oyoryhV9.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { u as useStationMissions } from './useStationMissions-DyKPx7bx.mjs';
import { u as useOfflineSync } from './useOfflineSync-CTQBoPkt.mjs';
import { ref, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function useForceEndRound() {
  const { stations } = useAdventure();
  const { isStationMissionComplete } = useStationMissions();
  const { isOnline, syncNow } = useOfflineSync();
  const { isOfflineMode, roundData, endRound } = useOfflineMode();
  const { endCurrentRound, currentRoundId } = useRound();
  const { saveRoundSummary } = useRoundSummary();
  const { clearAllTimers } = useRoundTimer();
  const { profile } = useProfile();
  const isForceEnding = ref(false);
  async function forceEndRoundDueToTimeout(reason) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (isForceEnding.value) return;
    isForceEnding.value = true;
    const endedReason = reason === "round" ? "round-timeout" : "station-timeout";
    try {
      const playedStations = stations.value.filter((s) => isStationMissionComplete(s.id)).map((s) => ({
        name: s.name,
        points: 0
      }));
      if (isOfflineMode.value) {
        endRound();
        saveRoundSummary({
          mode: "offline",
          startTime: ((_a = roundData.value) == null ? void 0 : _a.startedAt) ? new Date(roundData.value.startedAt).toISOString() : null,
          endTime: new Date((_c = (_b = roundData.value) == null ? void 0 : _b.endedAt) != null ? _c : Date.now()).toISOString(),
          stations: playedStations,
          totalPoint: null,
          roundId: null,
          userId: (_e = (_d = profile.value) == null ? void 0 : _d.uid) != null ? _e : null,
          endedReason
        });
      } else {
        const memberId = (_f = profile.value) == null ? void 0 : _f.memberId;
        const roundIdForSummary = currentRoundId.value;
        if (memberId && isOnline.value) await syncNow().catch(() => null);
        let startTimeIso = null;
        let endTimeIso = (/* @__PURE__ */ new Date()).toISOString();
        if (memberId) {
          const ended = await endCurrentRound(memberId).catch(() => null);
          if (ended) {
            startTimeIso = ended.startTime || null;
            endTimeIso = ended.endTime || endTimeIso;
          }
        }
        saveRoundSummary({
          mode: "online",
          startTime: startTimeIso,
          endTime: endTimeIso,
          stations: playedStations,
          totalPoint: null,
          roundId: roundIdForSummary,
          userId: memberId || ((_g = profile.value) == null ? void 0 : _g.uid) || null,
          endedReason
        });
      }
    } catch (err) {
      console.error("[forceEndRoundDueToTimeout] failed to build round summary", err);
    } finally {
      clearAllTimers();
      isForceEnding.value = false;
      await navigateTo("/round-summary");
    }
  }
  return {
    isForceEnding: readonly(isForceEnding),
    forceEndRoundDueToTimeout
  };
}

export { useForceEndRound as u };
//# sourceMappingURL=useForceEndRound-Dv22McEm.mjs.map
