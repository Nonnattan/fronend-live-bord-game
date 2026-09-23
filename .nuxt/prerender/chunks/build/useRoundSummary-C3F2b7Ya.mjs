import { f as useState } from '../virtual/entry.mjs';
import { readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function useRoundSummary() {
  const roundSummary = useState("round-summary-last", () => null);
  function saveRoundSummary(data) {
    roundSummary.value = data;
  }
  function loadRoundSummary() {
    if (roundSummary.value) return roundSummary.value;
    return null;
  }
  function clearRoundSummary() {
    roundSummary.value = null;
  }
  return {
    roundSummary: readonly(roundSummary),
    saveRoundSummary,
    loadRoundSummary,
    clearRoundSummary
  };
}

export { useRoundSummary as u };
//# sourceMappingURL=useRoundSummary-C3F2b7Ya.mjs.map
