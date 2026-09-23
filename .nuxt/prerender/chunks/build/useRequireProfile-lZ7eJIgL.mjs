import { a as useOfflineMode } from '../virtual/entry.mjs';
import { u as useProfile } from './useProfile-Di4CdYil.mjs';
import { ref } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function useRequireProfile() {
  const { profile} = useProfile();
  useOfflineMode();
  return {
    profile,
    isReady: ref(false)
  };
}

export { useRequireProfile as u };
//# sourceMappingURL=useRequireProfile-lZ7eJIgL.mjs.map
