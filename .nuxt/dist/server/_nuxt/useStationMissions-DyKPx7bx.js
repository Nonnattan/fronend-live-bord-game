import { F as useState, t as useOfflineMode } from "../server.mjs";
import { t as useMemberApi } from "./useMemberApi-DKl7a10r.js";
import { t as useRound } from "./useRound-BmAVHypg.js";
import { computed, readonly, watch } from "vue";
//#region composables/useOfflineAnswerSync.ts
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
	/** เรียกจาก useQuestion.ts ทันทีที่ตัดสินคำตอบบนเครื่องเสร็จ — เก็บลง
	* LocalStorage ก่อนเสมอ ไม่ยิง Backend ตรงนี้ (กันซ้ำด้วย questionId+roundId) */
	function queueAnswer(answer) {
		if (pendingAnswers.value.some((item) => item.questionId === answer.questionId && item.roundId === answer.roundId)) return;
		persistQueue([...pendingAnswers.value, answer]);
	}
	/** Sync ขึ้น Backend — เรียกตอนมีเน็ต (ตอนตอบเสร็จทันที ถ้ามีเน็ตอยู่แล้ว หรือ
	* ปุ่ม Sync มือ/auto sync ตอนกลับมามีเน็ตในอนาคต) */
	async function syncNow(userId, firstName) {
		return {
			success: false,
			syncedCount: 0,
			message: "กำลัง Sync อยู่ หรือไม่ได้อยู่บน client"
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
//#endregion
//#region composables/useQuestion.ts
function readStoredAnswered() {
	return null;
}
function genClientId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
/** ตัดสินถูก/ผิดบนเครื่อง — normalize ทั้งสองฝั่งก่อนเสมอ (ตัดช่องว่าง/ตัวพิมพ์
* เล็กใหญ่) ให้ตรงกับ isAnswerCorrect_() ฝั่ง server-gas/QuestionService.gs
* ทุกประการ (ผลลัพธ์ที่แสดงผลทันทีตอนออฟไลน์ต้องตรงกับที่ server จะตัดสินภายหลัง)
* [ใหม่] export ตรง ๆ ด้วย (นอกจากคืนผ่าน useQuestion() แล้ว) ให้
* composables/useStationMissions.ts เอาไปใช้ตัดสินภารกิจ MULTI_QUESTION แบบ
* Offline First เดียวกันได้โดยไม่ต้อง copy logic ซ้ำ */
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
	/** true = กำลังแสดงคำถามตัวอย่าง (Mock) เพราะยังไม่มีข้อมูลจริงจากชีต —
	* หน้า UI เอาไปขึ้นป้ายเตือนได้ (แนวทางเดียวกับ usePhotoQuest.ts) */
	const usingMockData = useState("question-using-mock", () => false);
	const totalQuestionPoints = computed(() => answeredList.value.reduce((sum, a) => sum + a.pointsEarned, 0));
	const totalCorrect = computed(() => answeredList.value.filter((a) => a.isCorrect).length);
	/** เรียกตอน mounted ของหน้า Map/Scan (ครั้งเดียวพอ ก่อนเริ่มเดินเล่น) — โหลด
	* คำถามทั้งหมดของทุกฐานมา cache ไว้ล่วงหน้า เพื่อให้ตอบคำถามได้แม้สัญญาณหลุด
	* กลางแปลง (ไม่ต้องรอโหลดทีละฐานตอนสแกน) */
	async function initQuestions() {}
	/**
	* โหลดสถานะ "ตอบไปแล้วบ้าง" ของรอบปัจจุบัน — เรียกคู่กับ initQuestions() เสมอ
	* ต้องรู้ roundId ก่อน (จาก useRound().currentRoundId) เพื่อเทียบว่าของที่ค้าง
	* อยู่ใน LocalStorage เป็นของรอบนี้จริงหรือของรอบเก่า (แนวทางเดียวกับ
	* useAdventure.ts::visitedRoundId — กันคำตอบรอบเก่าค้างข้ามมารอบใหม่)
	*
	* [Fix — บั๊กคะแนนคำถามหายตอนถึงหน้าสรุปผล] เดิม roundId ไม่ตรงกัน = ล้าง
	* answeredList ทิ้งทันทีเสมอ — แต่ถ้าฐานแรกของรอบถูกสแกนตอน ensureRoundStarted()
	* (pages/scan.vue) ยังไม่ resolve roundId จริง (เน็ตมือถือกลางแปลงหลุด/ช้า)
	* initAnsweredState(null) จะถูกเรียกก่อน แล้วคำตอบฐานแรกถูก persist ด้วย
	* roundId: null ไปก่อน — พอฐานถัดไปเรียกซ้ำด้วย roundId จริงที่เพิ่ง resolve ได้
	* (ไม่ใช่ null แล้ว) จะเจอว่า "ไม่ตรงกับที่เคย persist ไว้ (null)" ทั้งที่เป็นรอบ
	* เดียวกันอยู่ ทำให้คำตอบ/คะแนนของฐานแรกหายไปทันที
	*
	* แก้โดยเพิ่มเงื่อนไข: roundId เดิมที่เคย persist ไว้เป็น null แต่ roundId ใหม่ที่
	* ได้ตอนนี้ "ไม่ใช่ null" -> ถือว่าเป็นรอบเดียวกัน (แค่เพิ่งรู้ roundId จริงช้า) ->
	* ย้ายคำตอบเดิมมาผูกกับ roundId จริงแทน ไม่ทิ้ง — กรณีอื่น (roundId จริงสองค่า
	* ต่างกัน, หรือไม่เคยมีข้อมูลมาก่อนเลย) ยังคงล้างว่างใหม่เหมือนเดิมทุกประการ
	*/
	function initAnsweredState(roundId) {
		const stored = readStoredAnswered();
		if (stored) {
			if (stored.roundId === roundId) {
				answeredList.value = stored.answers;
				answeredRoundId.value = roundId;
				return;
			}
			if (stored.roundId === null && roundId !== null) {
				answeredList.value = stored.answers;
				answeredRoundId.value = roundId;
				stored.answers;
				return;
			}
		}
		answeredList.value = [];
		answeredRoundId.value = roundId;
	}
	/** เลือกคำถาม 1 ข้อของฐานที่ระบุ — คำถามแรก (order น้อยสุด) ที่ active เท่านั้น
	* ไม่มีคำถามของฐานนี้เลย -> คืน undefined (ฝั่ง UI ต้องข้ามขั้นตอนถามคำถามไป
	* เข้าฐานตามปกติ ไม่บังคับว่าทุกฐานต้องมีคำถาม) */
	function getQuestionForStation(stationId) {
		return questions.value.filter((q) => q.stationId === stationId && q.active).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
	}
	/** [ใหม่] คำถามทั้งหมดของภารกิจหนึ่ง (SINGLE_QUESTION ยาว 1/MULTI_QUESTION ยาว
	* N) เรียงตาม order — ใช้โดย composables/useStationMissions.ts เพื่อ
	* cross-reference questionIds ที่ได้จาก listStationMissions() (Backend ไม่ส่ง
	* เนื้อคำถามมาซ้ำในนั้น — ดู types/mission.ts) กับคำถามจริงที่ cache ไว้แล้ว
	* ที่นี่ (โหลดครั้งเดียวตอนเริ่มรอบผ่าน initQuestions() อยู่แล้ว) กันคำถามสอง
	* ที่มาขัดแย้งกัน — ต้องเรียก initQuestions() ให้เสร็จก่อนเสมอ ไม่มีคำถามตรง
	* questionId ไหนใน cache -> ข้ามไปเฉย ๆ (ผู้เรียกต้องรองรับ array สั้นกว่าที่ขอ) */
	function getQuestionsForMission(questionIds) {
		const byId = new Map(questions.value.map((q) => [q.id, q]));
		return questionIds.map((id) => byId.get(id)).filter((q) => !!q).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	}
	function findAnswered(questionId) {
		return answeredList.value.find((a) => a.questionId === questionId);
	}
	function isQuestionAnswered(questionId) {
		return !!findAnswered(questionId);
	}
	/** ฐานนี้ "จบภารกิจคำถามแล้ว" หรือยัง — true ทั้งกรณีตอบแล้ว (ไม่ว่าถูกหรือผิด)
	* และกรณีฐานนี้ไม่มีคำถามเลย (ไม่บล็อกการเดินเรื่องต่อ) */
	function isStationQuestionDone(stationId) {
		const q = getQuestionForStation(stationId);
		if (!q) return true;
		return isQuestionAnswered(q.id);
	}
	/**
	* [Fix] เดิมใช้ answeredRoundId.value (ค่าที่ cache ไว้ตอน initAnsweredState()
	* ครั้งล่าสุด) เป็น roundId ตอนเขียนลง LocalStorage เสมอ — ถ้า initAnsweredState()
	* เคยถูกเรียกตอน currentRoundId ฝั่ง useRound.ts ยังไม่นิ่ง (เช่น เพิ่ง mount
	* หน้า Scan แล้ว ensureRoundStarted() ยังไม่ resolve) ค่านี้จะค้างเป็นค่าเก่า/null
	* ไปตลอด แม้ภายหลัง Round จะได้ roundId จริงมาแล้วก็ตาม ทำให้คำตอบที่ตอบไปถูก
	* บันทึกผูกกับ roundId ผิด (หรือ null) และ "หายไป" ตอนฐานถัดไปเรียก
	* initAnsweredState(roundId จริง) เพราะเทียบไม่ตรงกับที่เคย persist ไว้ ->
	* ตัดสินว่าเป็นคนละรอบ -> เคลียร์ answeredList ทิ้งทั้งหมด (นี่คือสาเหตุที่คะแนน
	* คำถามจากฐานก่อน ๆ "ดึงผิด"/หายไปตอนถึงหน้าสรุปผล)
	*
	* แก้โดยรับ roundId ที่ "สดจริง ๆ" จากผู้เรียก (submitAnswer() ส่ง ctx.roundId
	* ที่ผู้เรียกอ่านจาก useRound().currentRoundId ตรง ๆ ทุกครั้งที่ตอบ ไม่ใช่ค่า
	* cache) มาเขียนทับ answeredRoundId.value ทุกครั้งที่บันทึกคำตอบ — ทำให้ระบบ
	* "ซ่อมตัวเองได้" แม้ initAnsweredState() ครั้งแรกจะเจอ roundId ที่ยังไม่นิ่งก็ตาม
	*/
	function persistAndSet(next, roundId) {
		answeredList.value = next;
		answeredRoundId.value = roundId;
	}
	/**
	* ตอบคำถาม 1 ข้อ — ตัดสินบนเครื่องทันที (Offline First) แล้ว queue ไป sync
	* ขึ้น Backend ต่อ คืนค่าผลลัพธ์เสมอ (ไม่ throw) ให้หน้า UI ไปแสดงผลต่อ
	*
	* "ตอบได้ครั้งเดียว ผิดแล้วผิดเลย": ถ้าข้อนี้เคยตอบไปแล้ว (ในรอบเดียวกัน)
	* จะคืนผลเดิมทันที ไม่ตัดสินซ้ำ ไม่บันทึกซ้ำ ไม่ว่าจะส่งคำตอบใหม่มาต่างจากเดิม
	* แค่ไหนก็ตาม (ป้องกันการยิงซ้ำจาก UI/double-submit)
	*/
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
	/** ล้างสถานะ "ตอบไปแล้วบ้าง" ของรอบปัจจุบันทิ้งทั้งหมด — เรียกคู่กับ
	* useAdventure().resetJourney() เสมอ (ที่ pages/round-summary.vue::confirmAndGoHome
	* จุดเดียวที่ resetJourney() ถูกเรียก — ดูคอมเมนต์ในไฟล์นั้น) เพื่อไม่ให้คำตอบ
	* ของรอบที่จบไปแล้วค้างข้ามมารอบใหม่ ไม่แตะ useAdventure.ts เลยแม้แต่บรรทัดเดียว */
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
//#endregion
//#region composables/useOfflineMissionAnswerSync.ts
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
	/** เรียกจาก useStationMissions.ts::submitMultiQuestion() ทันทีที่ตัดสินคำตอบ
	* ทั้งชุดบนเครื่องเสร็จ — เก็บลง LocalStorage ก่อนเสมอ ไม่ยิง Backend ตรงนี้
	* (กันคิวซ้ำด้วย missionId+roundId — ภารกิจนี้ตอบได้ครั้งเดียวต่อรอบอยู่แล้ว) */
	function queueMissionAnswers(batch) {
		if (pendingBatches.value.some((item) => item.missionId === batch.missionId && item.roundId === batch.roundId)) return;
		persistQueue([...pendingBatches.value, {
			...batch,
			clientBatchId: genUuid(),
			queuedAt: Date.now()
		}]);
	}
	/** Sync ขึ้น Google Sheet จริง — เรียกตอนมีเน็ต (ตอบเสร็จทันทีถ้ามีเน็ตอยู่แล้ว
	* หรือปุ่ม Sync มือ/auto sync ตอนกลับมามีเน็ตในอนาคต) */
	async function syncNow() {
		return {
			success: false,
			syncedCount: 0,
			message: "กำลัง Sync อยู่ หรือไม่ได้อยู่บน client"
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
//#endregion
//#region composables/useStationMissions.ts
/** [ใหม่] ล้าง Cache ภารกิจของฐานทั้งหมดทิ้ง (LocalStorage + State ในหน่วยความจำ)
* — ใช้คู่กับ composables/useStationQuest.ts::clearStationQuestProgress() เสมอ
* ที่ 2 จุดเดียวกัน: (1) ผู้เล่นกดยืนยันรับรางวัลสำเร็จจริง (pages/
* reward-received.vue::handleOk()) หรือกด "ติดต่อเจ้าหน้าที่แล้ว" ฝั่ง Offline
* (pages/round-summary.vue::confirmAndGoHome()), (2) Session หมดอายุเกิน 24 ชม.
* (composables/useSessionExpiry.ts) ไม่ใช่การ Reset ตามรอบปกติ (นั่นเป็นหน้าที่
* ของ resetForCurrentRound()/watch(effectiveRoundKey) ในไฟล์นี้อยู่แล้ว) */
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
	/** กุญแจของ "รอบปัจจุบัน" — แนวทางเดียวกับ useStationQuest.ts::effectiveRoundKey
	* เป๊ะ ๆ (อ่านอย่างเดียว ไม่เรียกฟังก์ชันเปิด/ปิด Round ใด ๆ จากที่นี่เลย) */
	const effectiveRoundKey = computed(() => {
		if (currentRoundId.value) return `online:${currentRoundId.value}`;
		if (isOfflineMode.value && roundData.value?.startedAt) return `offline:${roundData.value.startedAt}`;
		return "no-round";
	});
	function resetForCurrentRound() {
		byStation.value = {};
		roundKey.value = effectiveRoundKey.value;
		roundKey.value;
	}
	/** เรียกก่อนเสมอทุกหน้าที่ใช้ Mission (เหมือน useStationQuest.ts::
	* initStationQuest()/useQuestion.ts::initAnsweredState()) — restore Cache ของ
	* รอบปัจจุบันจาก LocalStorage (เผื่อ Hard Refresh) ก่อนจะไปเรียก
	* loadStationMissions() ของฐานใดฐานหนึ่งต่อ ไม่มีผลข้างเคียงถ้าเรียกซ้ำ */
	function initStationMissions() {}
	watch(effectiveRoundKey, (next) => {
		if (!initialized.value || roundKey.value === next) return;
		if (next === "no-round") return;
		resetForCurrentRound();
	});
	function getStationMissions(stationId) {
		return byStation.value[stationId] ?? [];
	}
	function missionProgressCount(stationId) {
		return getStationMissions(stationId).filter((m) => m.completed).length;
	}
	/** ฐานนี้ "ทำภารกิจครบทุกใบแล้ว" หรือยัง — false ถ้ายังไม่เคยโหลดภารกิจของฐานนี้
	* เลย (missions.length === 0) กันเข้าใจผิดว่า "ครบแล้ว" ทั้งที่ยังไม่รู้ว่ามี
	* ภารกิจอะไรบ้าง */
	function isStationMissionComplete(stationId) {
		const missions = getStationMissions(stationId);
		return missions.length > 0 && missions.every((m) => m.completed);
	}
	/** คะแนนรวมที่ทำได้จริงข้ามทุกฐานที่เคยโหลดภารกิจมาแล้วในรอบนี้ — ใช้แสดงที่
	* pages/home.vue (แทน mockScore เดิม) เป็นผลรวมที่ค่อย ๆ โตขึ้นตามฐานที่ผู้เล่น
	* เข้าไปเล่นจริง (ไม่ต่างจาก mockScore เดิมที่โตขึ้นทีละฐานเหมือนกัน) */
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
	/**
	* โหลดภารกิจของฐานนี้จาก Backend (action 'listStationMissions') — ต้องมี
	* internet เสมอ (ไม่มี Offline Fallback ให้ดึงรายการภารกิจใหม่ — ตรงกับ
	* verifyStationQr/listQuestions ที่ก็ต้องออนไลน์เหมือนกันตอนโหลดครั้งแรก) ยิงไม่
	* สำเร็จ -> ใช้ Cache ล่าสุดที่มีอยู่ต่อไปได้ (คืน true ถ้ามี Cache ให้แสดงอยู่แล้ว)
	* ให้เล่นภารกิจ SINGLE_QUESTION/MULTI_QUESTION ต่อแบบ Offline First ได้ (ภารกิจ
	* QR_SCORE จะกันเองอีกชั้นที่ verifyQrMission เพราะต้องออนไลน์เสมอ)
	*/
	async function loadStationMissions(stationId, roundId, userId) {
		return false;
	}
	/** ภารกิจ SINGLE_QUESTION — ตอบ 1 คำถามผ่าน action 'submitAnswer' เดิม (reuse
	* ระบบคำถามจริงทั้งหมด — useQuestion().submitAnswer() ตัดสิน/บันทึก Offline
	* First แล้ว queue ไป sync จริงผ่าน useOfflineAnswerSync.ts อยู่แล้ว) แค่เอาผล
	* ลัพธ์มาอัปเดตสถานะภารกิจต่อ ไม่ตัดสิน/คำนวณคะแนนเองที่นี่เลย */
	function submitSingleQuestion(stationId, mission, question, answerValue, ctx) {
		const { submitAnswer } = useQuestion();
		const result = submitAnswer(question, answerValue, ctx);
		updateMissionFromResult(stationId, mission.id, {
			completed: true,
			pointsEarned: result.pointsEarned
		});
		return result;
	}
	/**
	* ภารกิจ MULTI_QUESTION — ตอบหลายคำถามพร้อมกัน ส่งครั้งเดียว ตัดสินบนเครื่อง
	* ก่อนทันที (Offline First เหมือน SINGLE_QUESTION — ใช้ judgeAnswer() ตัวเดียว
	* กับที่ useQuestion.ts ใช้ตัดสิน SINGLE_QUESTION เพื่อให้ผลลัพธ์ตรงกับที่
	* Backend จะตัดสินภายหลังเป๊ะ ๆ) แล้ว queue ไป sync จริงผ่าน
	* useOfflineMissionAnswerSync.ts — คืนผลลัพธ์ (X/N ถูก + คะแนนรวม) ให้ Component
	* แสดงผลได้ทันทีไม่ต้องรอเน็ต
	*/
	function submitMultiQuestion(stationId, mission, answers, ctx) {
		const { judgeAnswer, getQuestionsForMission } = useQuestion();
		const byId = new Map(getQuestionsForMission(mission.questionIds ?? []).map((q) => [q.id, q]));
		let correctCount = 0;
		let totalPoints = 0;
		const perQuestion = answers.map(({ questionId, answer }) => {
			const question = byId.get(questionId);
			if (!question) return {
				questionId,
				error: "ไม่พบคำถามนี้ในเครื่อง กรุณาลองใหม่"
			};
			const isCorrect = judgeAnswer(question.answerType, answer, question.correctAnswer);
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
	/**
	* ภารกิจ QR_SCORE — ตรวจสอบ QR ของภารกิจ (คนละ QR/handler กับ verifyStationQr
	* เด็ดขาด — ดู types/mission.ts) ต้องมีอินเทอร์เน็ตเสมอ ไม่มี Offline Fallback
	* (เหมือน verifyStationQr) ผ่านแล้ว Backend ให้คะแนนจริงทันที — ที่นี่แค่รับผล
	* มาอัปเดตสถานะภารกิจต่อ ไม่ถือว่าสำเร็จ/ได้คะแนนเองก่อนได้รับคำตอบจาก Backend
	*/
	async function verifyQrMission(stationId, mission, qrToken, ctx) {
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
				error: res.error || "QR ภารกิจนี้ไม่ถูกต้อง"
			};
			const pointsEarned = res.pointsEarned ?? 0;
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
				error: err instanceof Error ? err.message : "ตรวจสอบ QR กับระบบไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่"
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
//#endregion
export { useOfflineAnswerSync as a, useQuestion as i, useStationMissions as n, useOfflineMissionAnswerSync as r, clearStationMissionsProgress as t };

//# sourceMappingURL=useStationMissions-DyKPx7bx.js.map