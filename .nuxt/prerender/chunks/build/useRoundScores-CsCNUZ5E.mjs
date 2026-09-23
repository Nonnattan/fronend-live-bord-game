import { f as useState } from '../virtual/entry.mjs';
import { readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function useRoundScores() {
  const stations = useState("round-scores-stations", () => []);
  const totalPoint = useState("round-scores-total-point", () => 0);
  const totalQuestionPoint = useState("round-scores-total-question-point", () => 0);
  const totalScore = useState("round-scores-total-score", () => 0);
  const isLoading = useState("round-scores-loading", () => false);
  const error = useState("round-scores-error", () => "");
  const loaded = useState("round-scores-loaded", () => false);
  async function fetchRoundScores(roundId, userId) {
    return false;
  }
  function resetRoundScores() {
    stations.value = [];
    totalPoint.value = 0;
    totalQuestionPoint.value = 0;
    totalScore.value = 0;
    loaded.value = false;
    error.value = "";
  }
  return {
    stations: readonly(stations),
    totalPoint: readonly(totalPoint),
    totalQuestionPoint: readonly(totalQuestionPoint),
    totalScore: readonly(totalScore),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loaded: readonly(loaded),
    fetchRoundScores,
    resetRoundScores
  };
}

export { useRoundScores as u };
//# sourceMappingURL=useRoundScores-CsCNUZ5E.mjs.map
