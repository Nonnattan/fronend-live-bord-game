import { $ as $fetch$2, I as useRuntimeConfig } from '../virtual/entry.mjs';

function buildLineFields(auth) {
  if (auth.loginType !== "line") return {};
  return {
    lineUserId: auth.uid,
    displayName: auth.displayName,
    pictureUrl: auth.pictureUrl
  };
}
function useMemberApi() {
  const config = useRuntimeConfig();
  async function callApi(action, payload) {
    const apiUrl = config.public.apiBaseUrl;
    if (!apiUrl) throw new Error("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 API_BASE_URL (Google Apps Script Web App URL) \u0E43\u0E19 .env");
    console.log("[API DEBUG] " + action + " URL =", apiUrl);
    const raw = await $fetch$2(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action,
        ...payload
      }),
      responseType: "text"
    });
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const preview = raw.slice(0, 200).replace(/\s+/g, " ").trim();
      throw new Error(`Google Apps Script \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A\u0E40\u0E1B\u0E47\u0E19 JSON (action: ${action}) \u2014 \u0E21\u0E31\u0E01\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01 Deployment \u0E15\u0E31\u0E49\u0E07 "Who has access" \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48 "Anyone" \u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 Deploy \u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 \u0E2B\u0E23\u0E37\u0E2D API_BASE_URL \u0E1C\u0E34\u0E14/\u0E40\u0E1B\u0E47\u0E19 URL /dev \u0E41\u0E17\u0E19 /exec \u0E14\u0E39 server-gas/README.md \u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D Deploy \u2014 \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 response \u0E17\u0E35\u0E48\u0E44\u0E14\u0E49\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32: "${preview}${raw.length > 200 ? "..." : ""}"`);
    }
    if (typeof parsed === "object" && parsed !== null && "status" in parsed && !("success" in parsed)) {
      const legacyMessage = parsed.message;
      throw new Error(`Google Apps Script \u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E40\u0E01\u0E48\u0E32 { status: "..." } \u0E41\u0E17\u0E19 { success: ... } (action: ${action}) \u2014 \u0E41\u0E1B\u0E25\u0E27\u0E48\u0E32 Deployment \u0E17\u0E35\u0E48 API_BASE_URL \u0E0A\u0E35\u0E49\u0E44\u0E1B\u0E2D\u0E22\u0E39\u0E48 \u0E22\u0E31\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E42\u0E04\u0E49\u0E14\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19 \u0E40\u0E01\u0E48\u0E32\u0E01\u0E27\u0E48\u0E32\u0E17\u0E35\u0E48\u0E41\u0E01\u0E49\u0E44\u0E27\u0E49\u0E43\u0E19 server-gas/Code.gs (\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 Deploy > Manage deployments > New version) \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E1A\u0E31\u0E4A\u0E01\u0E08\u0E32\u0E01\u0E1D\u0E31\u0E48\u0E07 frontend \u2014 \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E08\u0E32\u0E01 server \u0E40\u0E14\u0E34\u0E21: "${String(legacyMessage != null ? legacyMessage : "")}"`);
    }
    if (typeof parsed !== "object" || parsed === null || !("success" in parsed)) {
      const preview = raw.slice(0, 300).replace(/\s+/g, " ").trim();
      throw new Error(`Google Apps Script \u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A\u0E40\u0E1B\u0E47\u0E19 JSON \u0E41\u0E15\u0E48\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E04\u0E32\u0E14\u0E44\u0E27\u0E49 (action: ${action}) \u2014 \u0E04\u0E27\u0E23\u0E21\u0E35 key "success" \u0E40\u0E2A\u0E21\u0E2D \u0E41\u0E15\u0E48\u0E44\u0E21\u0E48\u0E21\u0E35 \u0E21\u0E31\u0E01\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01 Apps Script deployment \u0E40\u0E1B\u0E47\u0E19\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19\u0E40\u0E01\u0E48\u0E32 (\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 deploy \u0E42\u0E04\u0E49\u0E14\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14) \u0E2B\u0E23\u0E37\u0E2D Google \u0E15\u0E2D\u0E1A error \u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E40\u0E2D\u0E07 (quota/permission) \u0E41\u0E17\u0E19 \u2014 response \u0E08\u0E23\u0E34\u0E07\u0E17\u0E35\u0E48\u0E44\u0E14\u0E49: "${preview}${raw.length > 300 ? "..." : ""}"`);
    }
    return parsed;
  }
  function checkMember(values) {
    return callApi("checkMember", { ...values });
  }
  function registerMember(values, auth) {
    return callApi("register", {
      ...values,
      ...buildLineFields(auth)
    });
  }
  function loginMember(values, auth) {
    return callApi("login", {
      ...values,
      ...buildLineFields(auth)
    });
  }
  function updateMember(memberId, fields) {
    return callApi("updateMember", {
      memberId,
      ...fields
    });
  }
  function getMember(memberId) {
    return callApi("getMember", { memberId });
  }
  function loginByLine(lineUserId) {
    return callApi("loginByLine", { lineUserId });
  }
  async function syncMember(values, auth) {
    const checkResult = await checkMember(values);
    if (!checkResult.success) throw new Error(checkResult.error || "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08");
    return checkResult.found ? loginMember(values, auth) : registerMember(values, auth);
  }
  function checkin(payload) {
    return callApi("checkin", { ...payload });
  }
  function getJourney(userId) {
    return callApi("getJourney", { userId });
  }
  function getScore(userId) {
    return callApi("getScore", { userId });
  }
  function roundStart(payload) {
    return callApi("roundStart", { ...payload });
  }
  function roundEnd(roundId, userId) {
    return callApi("roundEnd", {
      roundId,
      userId
    });
  }
  function getRound(userId) {
    return callApi("getRound", { userId });
  }
  function confirmRound(roundId, userId) {
    return callApi("confirmRound", {
      roundId,
      userId
    });
  }
  function submitSurvey(payload) {
    return callApi("submitSurvey", { ...payload });
  }
  function listStations() {
    return callApi("listStations", {});
  }
  function verifyStationQr(qrToken) {
    return callApi("verifyStationQr", { qrToken });
  }
  function listSideQuests() {
    return callApi("listSideQuests", {});
  }
  function listPhotoQuests() {
    return callApi("listPhotoQuests", {});
  }
  function completePhotoQuest(payload) {
    return callApi("completePhotoQuest", payload);
  }
  function listQuestions(stationId) {
    return callApi("listQuestions", stationId ? { stationId } : {});
  }
  function submitAnswer(payload) {
    return callApi("submitAnswer", payload);
  }
  function getRoundAnswers(userId, roundId) {
    return callApi("getRoundAnswers", {
      userId,
      roundId
    });
  }
  function listStationMissions(stationId, roundId, userId) {
    return callApi("listStationMissions", {
      stationId,
      roundId,
      userId
    });
  }
  function verifyMissionQr(payload) {
    return callApi("verifyMissionQr", { ...payload });
  }
  function submitMissionAnswers(payload) {
    return callApi("submitMissionAnswers", { ...payload });
  }
  function getRewardStatus(roundId, userId) {
    return callApi("getRewardStatus", {
      roundId,
      userId
    });
  }
  function claimReward(roundId, userId, displayName) {
    return callApi("claimReward", {
      roundId,
      userId,
      displayName
    });
  }
  function getRoundScores(roundId, userId) {
    return callApi("getRoundScores", {
      roundId,
      userId
    });
  }
  return {
    checkMember,
    registerMember,
    loginMember,
    updateMember,
    getMember,
    loginByLine,
    syncMember,
    checkin,
    getJourney,
    getScore,
    roundStart,
    roundEnd,
    getRound,
    confirmRound,
    submitSurvey,
    listStations,
    verifyStationQr,
    listSideQuests,
    listPhotoQuests,
    completePhotoQuest,
    listQuestions,
    submitAnswer,
    getRoundAnswers,
    listStationMissions,
    verifyMissionQr,
    submitMissionAnswers,
    getRewardStatus,
    claimReward,
    getRoundScores
  };
}

export { useMemberApi as u };
//# sourceMappingURL=useMemberApi-DKl7a10r.mjs.map
