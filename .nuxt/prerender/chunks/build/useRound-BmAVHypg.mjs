import { f as useState } from '../virtual/entry.mjs';
import { readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function useRound() {
  const currentRoundId = useState("round-current-id", () => null);
  const isRoundEnded = useState("round-current-ended", () => false);
  async function ensureRoundStarted(userId, firstName) {
  }
  async function endCurrentRound(userId) {
    return null;
  }
  function discardStaleRound() {
    isRoundEnded.value = false;
    currentRoundId.value = null;
  }
  return {
    currentRoundId: readonly(currentRoundId),
    isRoundEnded: readonly(isRoundEnded),
    ensureRoundStarted,
    endCurrentRound,
    discardStaleRound
  };
}

export { useRound as u };
//# sourceMappingURL=useRound-BmAVHypg.mjs.map
