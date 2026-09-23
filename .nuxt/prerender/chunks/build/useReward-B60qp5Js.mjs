import { f as useState } from '../virtual/entry.mjs';
import { readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function useReward() {
  const status = useState("reward-status", () => null);
  const isChecking = useState("reward-checking", () => false);
  const isConfirming = useState("reward-confirming", () => false);
  const error = useState("reward-error", () => "");
  async function checkRewardStatus(roundId, userId) {
    status.value = null;
    return null;
  }
  async function confirmRoundReceived(roundId, userId) {
    return false;
  }
  return {
    status: readonly(status),
    isChecking: readonly(isChecking),
    isConfirming: readonly(isConfirming),
    error: readonly(error),
    checkRewardStatus,
    confirmRoundReceived
  };
}

export { useReward as u };
//# sourceMappingURL=useReward-B60qp5Js.mjs.map
