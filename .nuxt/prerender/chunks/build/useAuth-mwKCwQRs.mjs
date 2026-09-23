import { f as useState } from '../virtual/entry.mjs';
import { computed, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

function generateTemporaryUid() {
  return String(Math.floor(Date.now() / 1e3));
}
function useAuth() {
  const authData = useState("auth-data", () => null);
  const hasAuth = computed(() => !!authData.value);
  const isAnonymous = computed(() => {
    var _a;
    return ((_a = authData.value) == null ? void 0 : _a.loginType) === "guest";
  });
  const isLineLoading = useState("auth-line-loading", () => false);
  const lineError = useState("auth-line-error", () => "");
  function persistAuth(data) {
    authData.value = data;
  }
  async function initAuth() {
  }
  async function loginWithLine() {
  }
  function loginAsGuest() {
    persistAuth({
      loginType: "guest",
      uid: generateTemporaryUid()
    });
  }
  function resetAuth() {
    authData.value = null;
  }
  async function logoutLine() {
  }
  return {
    authData: readonly(authData),
    hasAuth,
    isAnonymous,
    isLineLoading: readonly(isLineLoading),
    lineError: readonly(lineError),
    initAuth,
    loginWithLine,
    loginAsGuest,
    resetAuth,
    logoutLine
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-mwKCwQRs.mjs.map
