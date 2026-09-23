import { f as useState, a as useOfflineMode } from '../virtual/entry.mjs';
import { u as useMemberApi } from './useMemberApi-DKl7a10r.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { computed, watch, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

var PENDING_KEY$1 = "answerSync:pendingAnswers";
function readJson$1(key, fallback) {
  return fallback;
}
function useOfflineAnswerSync() {
  const pendingAnswers = useState("answer-sync-pending", () => []);
  const initialized = useState("answer-sync-initialized", () => false);
  const isSyncing = useState("answer-sync-syncing", () => false);
  const lastMessage = useState("answer-sync-last-message", () => "");
  const pendingCount = computed(() => pendingAnswers.value.length);
  const hasPending = computed(() => pendingCount.value > 0);
  function initOfflineAnswerSync() {
    if (initialized.value) return;
    pendingAnswers.value = readJson$1(PENDING_KEY$1, []);
    initialized.value = true;
  }
  function persistQueue(next) {
    pendingAnswers.value = next;
  }
  function queueAnswer(answer) {
    if (pendingAnswers.value.some((item) => item.questionId === answer.questionId && item.roundId === answer.roundId)) return;
    persistQueue([...pendingAnswers.value, answer]);
  }
  async function syncNow(userId, firstName) {
    return {
      success: false,
      syncedCount: 0,
      message: "\u0E01\u0E33\u0E25\u0E31\u0E07 Sync \u0E2D\u0E22\u0E39\u0E48 \u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E19 client"
    };
  }
  return {
    pendingAnswers: readonly(pendingAnswers),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastMessage: readonly(lastMessage),
    initOfflineAnswerSync,
    queueAnswer,
    syncNow
  };
}
function genClientId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function judgeAnswer(answerType, given, expected) {
  const g = given.trim().toLowerCase();
  const e = expected.trim().toLowerCase();
  if (!e) return false;
  if (answerType === "number") {
    const gn = Number(g.replace(/[^\d.-]/g, ""));
    const en = Number(e.replace(/[^\d.-]/g, ""));
    if (Number.isNaN(gn) || Number.isNaN(en)) return false;
    return gn === en;
  }
  return g === e;
}
function useQuestion() {
  const questions = useState("question-list", () => []);
  const answeredList = useState("question-answered", () => []);
  const answeredRoundId = useState("question-answered-round-id", () => null);
  const isLoadingQuestions = useState("question-loading", () => false);
  const loadError = useState("question-load-error", () => "");
  const usingMockData = useState("question-using-mock", () => false);
  const totalQuestionPoints = computed(() => answeredList.value.reduce((sum, a) => sum + a.pointsEarned, 0));
  const totalCorrect = computed(() => answeredList.value.filter((a) => a.isCorrect).length);
  async function initQuestions() {
  }
  function initAnsweredState(roundId) {
    answeredList.value = [];
    answeredRoundId.value = roundId;
  }
  function getQuestionForStation(stationId) {
    return questions.value.filter((q) => q.stationId === stationId && q.active).sort((a, b) => {
      var _a, _b;
      return ((_a = a.order) != null ? _a : 0) - ((_b = b.order) != null ? _b : 0);
    })[0];
  }
  function getQuestionsForMission(questionIds) {
    const byId = new Map(questions.value.map((q) => [q.id, q]));
    return questionIds.map((id) => byId.get(id)).filter((q) => !!q).sort((a, b) => {
      var _a, _b;
      return ((_a = a.order) != null ? _a : 0) - ((_b = b.order) != null ? _b : 0);
    });
  }
  function findAnswered(questionId) {
    return answeredList.value.find((a) => a.questionId === questionId);
  }
  function isQuestionAnswered(questionId) {
    return !!findAnswered(questionId);
  }
  function isStationQuestionDone(stationId) {
    const q = getQuestionForStation(stationId);
    if (!q) return true;
    return isQuestionAnswered(q.id);
  }
  function persistAndSet(next, roundId) {
    answeredList.value = next;
    answeredRoundId.value = roundId;
  }
  function submitAnswer(question, answerValue, ctx) {
    const existing = findAnswered(question.id);
    if (existing) return existing;
    const isCorrect = judgeAnswer(question.answerType, answerValue, question.correctAnswer);
    const pointsEarned = isCorrect ? question.points : 0;
    const answer = {
      clientId: genClientId(),
      questionId: question.id,
      stationId: question.stationId,
      roundId: ctx.roundId,
      answer: answerValue,
      isCorrect,
      pointsEarned,
      answeredAt: Date.now(),
      synced: false,
      locked: true
    };
    persistAndSet([...answeredList.value, answer], ctx.roundId);
    const { queueAnswer } = useOfflineAnswerSync();
    queueAnswer(answer);
    return answer;
  }
  function resetAnswered() {
    answeredList.value = [];
    answeredRoundId.value = null;
  }
  return {
    questions: readonly(questions),
    isLoadingQuestions: readonly(isLoadingQuestions),
    loadError: readonly(loadError),
    usingMockData: readonly(usingMockData),
    totalQuestionPoints,
    totalCorrect,
    initQuestions,
    initAnsweredState,
    getQuestionForStation,
    getQuestionsForMission,
    isQuestionAnswered,
    isStationQuestionDone,
    findAnswered,
    submitAnswer,
    resetAnswered,
    judgeAnswer
  };
}
var PENDING_KEY = "missionAnswerSync:pendingBatches";
function genUuid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function readJson(key, fallback) {
  return fallback;
}
function useOfflineMissionAnswerSync() {
  const pendingBatches = useState("mission-answer-sync-pending", () => []);
  const initialized = useState("mission-answer-sync-initialized", () => false);
  const isSyncing = useState("mission-answer-sync-syncing", () => false);
  const lastMessage = useState("mission-answer-sync-last-message", () => "");
  const pendingCount = computed(() => pendingBatches.value.length);
  const hasPending = computed(() => pendingCount.value > 0);
  function initOfflineMissionAnswerSync() {
    if (initialized.value) return;
    pendingBatches.value = readJson(PENDING_KEY, []);
    initialized.value = true;
  }
  function persistQueue(next) {
    pendingBatches.value = next;
  }
  function queueMissionAnswers(batch) {
    if (pendingBatches.value.some((item) => item.missionId === batch.missionId && item.roundId === batch.roundId)) return;
    persistQueue([...pendingBatches.value, {
      ...batch,
      clientBatchId: genUuid(),
      queuedAt: Date.now()
    }]);
  }
  async function syncNow() {
    return {
      success: false,
      syncedCount: 0,
      message: "\u0E01\u0E33\u0E25\u0E31\u0E07 Sync \u0E2D\u0E22\u0E39\u0E48 \u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E19 client"
    };
  }
  return {
    pendingBatches: readonly(pendingBatches),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastMessage: readonly(lastMessage),
    initOfflineMissionAnswerSync,
    queueMissionAnswers,
    syncNow
  };
}
function clearStationMissionsProgress() {
  const byStation = useState("station-missions-by-station", () => ({}));
  const roundKey = useState("station-missions-round-key", () => "no-round");
  byStation.value = {};
  roundKey.value = "no-round";
}
function useStationMissions() {
  const byStation = useState("station-missions-by-station", () => ({}));
  const roundKey = useState("station-missions-round-key", () => "no-round");
  const initialized = useState("station-missions-initialized", () => false);
  const isLoading = useState("station-missions-loading", () => false);
  const loadError = useState("station-missions-load-error", () => "");
  const { currentRoundId } = useRound();
  const { isOfflineMode, roundData } = useOfflineMode();
  const effectiveRoundKey = computed(() => {
    var _a;
    if (currentRoundId.value) return `online:${currentRoundId.value}`;
    if (isOfflineMode.value && ((_a = roundData.value) == null ? void 0 : _a.startedAt)) return `offline:${roundData.value.startedAt}`;
    return "no-round";
  });
  function resetForCurrentRound() {
    byStation.value = {};
    roundKey.value = effectiveRoundKey.value;
    roundKey.value;
  }
  function initStationMissions() {
  }
  watch(effectiveRoundKey, (next) => {
    if (!initialized.value || roundKey.value === next) return;
    if (next === "no-round") return;
    resetForCurrentRound();
  });
  function getStationMissions(stationId) {
    var _a;
    return (_a = byStation.value[stationId]) != null ? _a : [];
  }
  function missionProgressCount(stationId) {
    return getStationMissions(stationId).filter((m) => m.completed).length;
  }
  function isStationMissionComplete(stationId) {
    const missions = getStationMissions(stationId);
    return missions.length > 0 && missions.every((m) => m.completed);
  }
  const totalPointsEarned = computed(() => Object.values(byStation.value).reduce((sum, missions) => sum + missions.reduce((s, m) => s + m.pointsEarned, 0), 0));
  function setStationMissions(stationId, missions) {
    byStation.value = {
      ...byStation.value,
      [stationId]: missions
    };
    roundKey.value, byStation.value;
  }
  function updateMissionFromResult(stationId, missionId, patch) {
    setStationMissions(stationId, getStationMissions(stationId).map((m) => m.id === missionId ? {
      ...m,
      ...patch
    } : m));
  }
  async function loadStationMissions(stationId, roundId, userId) {
    return false;
  }
  function submitSingleQuestion(stationId, mission, question, answerValue, ctx) {
    const { submitAnswer } = useQuestion();
    const result = submitAnswer(question, answerValue, ctx);
    updateMissionFromResult(stationId, mission.id, {
      completed: true,
      pointsEarned: result.pointsEarned
    });
    return result;
  }
  function submitMultiQuestion(stationId, mission, answers, ctx) {
    var _a;
    const { judgeAnswer: judgeAnswer2, getQuestionsForMission } = useQuestion();
    const byId = new Map(getQuestionsForMission((_a = mission.questionIds) != null ? _a : []).map((q) => [q.id, q]));
    let correctCount = 0;
    let totalPoints = 0;
    const perQuestion = answers.map(({ questionId, answer }) => {
      const question = byId.get(questionId);
      if (!question) return {
        questionId,
        error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21\u0E19\u0E35\u0E49\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48"
      };
      const isCorrect = judgeAnswer2(question.answerType, answer, question.correctAnswer);
      const pointsEarned = isCorrect ? question.points : 0;
      if (isCorrect) correctCount += 1;
      totalPoints += pointsEarned;
      return {
        questionId,
        isCorrect,
        pointsEarned,
        alreadyAnswered: false
      };
    });
    updateMissionFromResult(stationId, mission.id, {
      completed: true,
      pointsEarned: totalPoints
    });
    const { queueMissionAnswers } = useOfflineMissionAnswerSync();
    queueMissionAnswers({
      stationId,
      missionId: mission.id,
      roundId: ctx.roundId,
      userId: ctx.userId,
      firstName: ctx.firstName,
      answers: answers.map((a) => ({ ...a }))
    });
    return {
      missionId: mission.id,
      correctCount,
      totalCount: answers.length,
      totalPoints,
      perQuestion
    };
  }
  async function verifyQrMission(stationId, mission, qrToken, ctx) {
    var _a;
    const { verifyMissionQr } = useMemberApi();
    try {
      const res = await verifyMissionQr({
        qrToken,
        stationId,
        missionId: mission.id,
        roundId: ctx.roundId,
        userId: ctx.userId,
        firstName: ctx.firstName
      });
      if (!res.success) return {
        success: false,
        pointsEarned: 0,
        error: res.error || "QR \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
      };
      const pointsEarned = (_a = res.pointsEarned) != null ? _a : 0;
      updateMissionFromResult(stationId, mission.id, {
        completed: true,
        pointsEarned
      });
      return {
        success: true,
        pointsEarned
      };
    } catch (err) {
      return {
        success: false,
        pointsEarned: 0,
        error: err instanceof Error ? err.message : "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A QR \u0E01\u0E31\u0E1A\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48"
      };
    }
  }
  return {
    isLoading: readonly(isLoading),
    loadError: readonly(loadError),
    totalPointsEarned,
    getStationMissions,
    missionProgressCount,
    isStationMissionComplete,
    initStationMissions,
    loadStationMissions,
    submitSingleQuestion,
    submitMultiQuestion,
    verifyQrMission
  };
}

export { useQuestion as a, useOfflineAnswerSync as b, useOfflineMissionAnswerSync as c, clearStationMissionsProgress as d, useStationMissions as u };
//# sourceMappingURL=useStationMissions-DyKPx7bx.mjs.map
