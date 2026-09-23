import { $ as $fetch$2, I as useRuntimeConfig } from '../virtual/entry.mjs';

//#region composables/useMemberApi.ts
/** ดึงข้อมูล LINE จาก authData มาแนบไปด้วย เฉพาะกรณี login ผ่าน LINE เท่านั้น */
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
		if (!apiUrl) throw new Error("ยังไม่ได้ตั้งค่า API_BASE_URL (Google Apps Script Web App URL) ใน .env");
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
			throw new Error(`Google Apps Script ไม่ได้ตอบกลับเป็น JSON (action: ${action}) — มักเกิดจาก Deployment ตั้ง "Who has access" ไม่ใช่ "Anyone" หรือยังไม่ได้ Deploy เวอร์ชันล่าสุด หรือ API_BASE_URL ผิด/เป็น URL /dev แทน /exec ดู server-gas/README.md หัวข้อ Deploy — ตัวอย่าง response ที่ได้กลับมา: "${preview}${raw.length > 200 ? "..." : ""}"`);
		}
		if (typeof parsed === "object" && parsed !== null && "status" in parsed && !("success" in parsed)) {
			const legacyMessage = parsed.message;
			throw new Error(`Google Apps Script ตอบกลับด้วยรูปแบบเก่า { status: "..." } แทน { success: ... } (action: ${action}) — แปลว่า Deployment ที่ API_BASE_URL ชี้ไปอยู่ ยังเป็นโค้ดเวอร์ชัน เก่ากว่าที่แก้ไว้ใน server-gas/Code.gs (ยังไม่ได้ Deploy > Manage deployments > New version) ไม่ใช่บั๊กจากฝั่ง frontend — ข้อความจาก server เดิม: "${String(legacyMessage ?? "")}"`);
		}
		if (typeof parsed !== "object" || parsed === null || !("success" in parsed)) {
			const preview = raw.slice(0, 300).replace(/\s+/g, " ").trim();
			throw new Error(`Google Apps Script ตอบกลับเป็น JSON แต่ไม่ตรงรูปแบบที่คาดไว้ (action: ${action}) — ควรมี key "success" เสมอ แต่ไม่มี มักเกิดจาก Apps Script deployment เป็นเวอร์ชันเก่า (ยังไม่ได้ deploy โค้ดล่าสุด) หรือ Google ตอบ error ของตัวเอง (quota/permission) แทน — response จริงที่ได้: "${preview}${raw.length > 300 ? "..." : ""}"`);
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
	/** ใช้อัปเดตข้อมูลสมาชิกเดิมด้วย memberId โดยตรง — เช่น เติมเฉพาะ Birth Year/Gender ที่ยังขาด
	* (ส่งมาเฉพาะฟิลด์ที่ต้องการอัปเดต ฝั่ง backend จะไม่แตะฟิลด์อื่นที่ไม่ได้ส่งมา และไม่มีการสร้างแถวใหม่) */
	function updateMember(memberId, fields) {
		return callApi("updateMember", {
			memberId,
			...fields
		});
	}
	/** ดึงข้อมูลสมาชิกล่าสุด (point, totalVisit, ...) ด้วย memberId — ใช้รีเฟรชหน้า Home */
	function getMember(memberId) {
		return callApi("getMember", { memberId });
	}
	/**
	* ตรวจสอบ lineUserId ใน Google Sheet ก่อนเสมอเวลา Login ด้วย LINE (สเปกใหม่):
	*   - พบ lineUserId เดิม -> Login ทันที (อัปเดต Last Login/Total Visit ในแถวเดิม
	*     ให้เรียบร้อยแล้วในฝั่ง backend) ไม่ต้องพาไปหน้ากรอกฟอร์มสมัครสมาชิกอีก
	*   - ไม่พบ -> found: false เท่านั้น (ไม่มีการเขียนข้อมูลใด ๆ) ให้ frontend
	*     พาไปหน้าสมัครสมาชิก (ProfileForm) ต่อตามปกติ
	*/
	function loginByLine(lineUserId) {
		return callApi("loginByLine", { lineUserId });
	}
	/**
	* Flow หลักตามสเปก — เรียกตอนกดปุ่ม "ยืนยัน" ในฟอร์ม
	* คืนค่า MemberRecord ที่ Google Sheet ยืนยันแล้ว (มี memberId/registerDate/lastLogin จริง)
	*/
	async function syncMember(values, auth) {
		const checkResult = await checkMember(values);
		if (!checkResult.success) throw new Error(checkResult.error || "ตรวจสอบข้อมูลสมาชิกไม่สำเร็จ");
		return checkResult.found ? loginMember(values, auth) : registerMember(values, auth);
	}
	/**
	* action 'checkin' — ส่งผลการสแกน QR ผ่านฐาน 1 ฐานไป Google Sheet (ชีต Journey + Score)
	* ฝั่ง server-gas เป็นผู้ตัดสินเรื่อง "ห้ามบันทึกซ้ำ" ที่ปลายทางอีกชั้นหนึ่ง
	* (ดู server-gas/CheckinService.gs -> hasVisitedStation_) เผื่อกรณี Sync จาก
	* หลายเครื่อง/หลายรอบของผู้เล่นคนเดียวกัน — ใช้คู่กับ composables/useOfflineSync.ts
	* ที่เป็นตัวคุม queue ฝั่ง client (LocalStorage) ก่อน Sync ขึ้นมาที่นี่อีกที
	*/
	function checkin(payload) {
		return callApi("checkin", { ...payload });
	}
	/** action 'getJourney' — ดึงประวัติการเข้าฐานทั้งหมดของผู้เล่นคนเดียวจาก Google Sheet */
	function getJourney(userId) {
		return callApi("getJourney", { userId });
	}
	/** action 'getScore' — ดึงคะแนนสะสมปัจจุบันของผู้เล่นคนเดียวจาก Google Sheet */
	function getScore(userId) {
		return callApi("getScore", { userId });
	}
	/** action 'roundStart' — บันทึก "Round Start" ของ 1 รอบการเล่น (ดู server-gas/RoundService.gs)
	* roundId ซ้ำกับรอบที่เคย Sync สำเร็จมาแล้ว -> backend คืน alreadyStarted:true เฉย ๆ
	* ไม่เขียนซ้ำ (idempotent) ใช้คู่กับ composables/useRound.ts ที่คุมไม่ให้เรียกซ้ำจาก
	* refresh/re-render ฝั่ง client อีกชั้นหนึ่ง */
	function roundStart(payload) {
		return callApi("roundStart", { ...payload });
	}
	/** action 'roundEnd' — บันทึก "Round End" ของรอบเดิม (roundId เดิมเท่านั้น) */
	function roundEnd(roundId, userId) {
		return callApi("roundEnd", {
			roundId,
			userId
		});
	}
	/** action 'getRound' — ดึงรอบล่าสุดของผู้เล่น 1 คน (ไม่เขียนข้อมูล) */
	function getRound(userId) {
		return callApi("getRound", { userId });
	}
	/** [ใหม่] action 'confirmRound' — ผู้เล่นกด "OK" ที่หน้า pages/reward-received.vue
	* ยืนยันว่าได้รับรางวัลจริงแล้ว (RewardStatus: Claimed -> Confirmed) idempotent
	* ด้วย roundId (เรียกซ้ำตอน Confirmed ไปแล้ว -> คืน alreadyConfirmed: true เฉย ๆ
	* ไม่เขียนทับซ้ำ) ใช้ roundId เป็นตัวอ้างอิงหลักเสมอ ไม่ใช้ userId ค้นหาอย่างเดียว */
	function confirmRound(roundId, userId) {
		return callApi("confirmRound", {
			roundId,
			userId
		});
	}
	/** action 'submitSurvey' — บันทึกแบบประเมินหลังจบเกม (ดู server-gas/SurveyService.gs)
	* เรียกจาก pages/scan.vue ตอนกดยืนยันแบบประเมิน ก่อนออกจาก Popup ฐานนม/ฐานสุดท้าย
	* roundId เดิมส่งมาซ้ำ (เช่น กดยืนยันซ้ำ/เน็ตหลุดแล้ว retry) -> backend อัปเดต
	* คำตอบเดิมให้ ไม่สร้างแถวซ้ำ (idempotent เหมือน roundStart/roundEnd) */
	function submitSurvey(payload) {
		return callApi("submitSurvey", { ...payload });
	}
	/** action 'listStations' — ดึงรายชื่อฐานทั้งหมด (เรียงตาม Order) จากชีต "Stations"
	* ที่จัดการผ่านหน้า Admin — ใช้แทนรายชื่อฐาน mock ที่ hardcode ไว้ในอนาคตได้
	* (กรอง active:false ออกเองฝั่งผู้เรียก ถ้าต้องการโชว์เฉพาะฐานที่เปิดใช้งาน) */
	function listStations() {
		return callApi("listStations", {});
	}
	/** action 'verifyStationQr' — ส่ง qrToken ที่อ่านได้จากกล้องตอนสแกน QR ไปตรวจสอบ
	* กับ Google Sheet โดยตรง (ONLINE เท่านั้น ไม่มี fallback offline) ก่อนเอา Station
	* ที่ backend ยืนยันกลับมาเข้า Check-in flow เดิม (ดู pages/scan.vue) — ไม่เขียน
	* ข้อมูลใด ๆ ทั้งสิ้น เหมือน listStations */
	function verifyStationQr(qrToken) {
		return callApi("verifyStationQr", { qrToken });
	}
	/** action 'listSideQuests' — ดึงรายการเควสเสริมทั้งหมดจากชีต "SideQuests" */
	function listSideQuests() {
		return callApi("listSideQuests", {});
	}
	/** ไฟล์ใหม่ (Photo Detection Quest) — action 'listPhotoQuests' ดึงรายการ
	* เควสถ่ายรูปทั้งหมดจากชีต "PhotoQuests" (ไม่เขียนข้อมูลใด ๆ) */
	function listPhotoQuests() {
		return callApi("listPhotoQuests", {});
	}
	/** ไฟล์ใหม่ (Photo Detection Quest) — action 'completePhotoQuest' บันทึกว่า
	* สมาชิกคนนี้ทำเควสถ่ายรูปนี้สำเร็จแล้ว (server-gas กันบันทึกซ้ำด้วย
	* userId+questId เหมือน checkin เดิม) */
	function completePhotoQuest(payload) {
		return callApi("completePhotoQuest", payload);
	}
	/** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — action 'listQuestions' ดึงคำถาม
	* ทั้งหมดจากชีต "Questions" (ไม่ระบุ stationId = เอาทุกฐานมาทีเดียว แนะนำให้
	* เรียกครั้งเดียวตอนเริ่มรอบแล้ว cache ไว้ฝั่ง client เพื่อให้ตอบคำถามได้แม้
	* สัญญาณหลุดกลางแปลง — ดู composables/useQuestion.ts) */
	function listQuestions(stationId) {
		return callApi("listQuestions", stationId ? { stationId } : {});
	}
	/** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — action 'submitAnswer' ส่งคำตอบไป
	* ให้ Backend ตัดสินและบันทึก (idempotent ด้วย roundId+userId+questionId —
	* เรียกซ้ำได้ปลอดภัยเสมอ ดู server-gas/QuestionService.gs) */
	function submitAnswer(payload) {
		return callApi("submitAnswer", payload);
	}
	/** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — action 'getRoundAnswers' ดึงคำตอบ
	* ทั้งหมดของผู้เล่นในรอบที่ระบุ (ไม่เขียนข้อมูล) ใช้กู้สถานะ "ตอบไปแล้วบ้าง"
	* กลับมาถ้าผู้เล่นเปลี่ยนเครื่อง/ล้าง LocalStorage กลางรอบ */
	function getRoundAnswers(userId, roundId) {
		return callApi("getRoundAnswers", {
			userId,
			roundId
		});
	}
	/** action 'listStationMissions' — ดึงด่านย่อยทั้งหมดของฐาน (รวมที่ปิดใช้งาน +
	* เฉลยเต็ม) ใช้เฉพาะฝั่ง Admin เท่านั้น (ไม่เขียนข้อมูล) — หน้าเกมของผู้เล่นต้อง
	* เรียก getStationMissions() ด้านล่างแทน ห้ามใช้ตัวนี้ */
	function listStationMissions(stationId) {
		return callApi("listStationMissions", { stationId });
	}
	/** action 'getStationMissions' — ดึงด่านย่อยที่เปิดใช้งานของฐาน (ตัดเฉลย/QR
	* token ออกแล้ว) พร้อมสถานะ completed ต่อด่านของ roundId+userId ที่ระบุ — นี่คือ
	* action ที่หน้าเกมของผู้เล่นต้องเรียก (ดู pages/station/[stationId].vue) ส่ง
	* roundId+userId มาด้วย (ถ้ามี Round แล้ว) เพื่อให้ Backend แนบสถานะ completed
	* ของแต่ละด่านกลับมาด้วยเลย (ไม่ต้องคำนวณเองฝั่ง Client) */
	function getStationMissions(stationId, roundId, userId) {
		return callApi("getStationMissions", {
			stationId,
			roundId,
			userId
		});
	}
	/** action 'getMission' — ดึงด่านย่อย 1 ด่านด้วย id (เฉลยเต็ม) ใช้โดยหน้า Admin
	* ตอนเปิดฟอร์มแก้ไขเท่านั้น */
	function getMission(id) {
		return callApi("getMission", { id });
	}
	/** action 'createStationMission' — สร้างด่านย่อยใหม่ (ใช้โดยหน้า Admin) */
	function createStationMission(payload) {
		return callApi("createStationMission", { ...payload });
	}
	/** action 'updateStationMission' — แก้ไขด่านย่อยด้วย id (รวมถึงสลับ active เปิด/ปิด) */
	function updateStationMission(id, payload) {
		return callApi("updateStationMission", {
			id,
			...payload
		});
	}
	/** action 'deleteStationMission' — ลบด่านย่อยด้วย id */
	function deleteStationMission(id) {
		return callApi("deleteStationMission", { id });
	}
	/** action 'reorderStationMissions' — เปลี่ยนลำดับด่านย่อยทั้งหมดของฐานเดียว
	* orderedIds ต้องตรงกับเซ็ตด่านย่อยปัจจุบันของฐานนี้เป๊ะ (ครบ ไม่ขาด ไม่เกิน) */
	function reorderStationMissions(stationId, orderedIds) {
		return callApi("reorderStationMissions", {
			stationId,
			orderedIds
		});
	}
	/** action 'submitMissionAnswer' — ตอบด่านประเภท SINGLE_QUESTION ด้วย index ของ
	* ตัวเลือกที่เลือก (idempotent ด้วย roundId+userId+missionId — เคยผ่านด่านนี้
	* แล้ว จะได้ alreadyCompleted:true กลับมาเฉย ๆ ไม่บวกคะแนนซ้ำ) */
	function submitMissionAnswer(payload) {
		return callApi("submitMissionAnswer", { ...payload });
	}
	/** action 'submitMultiMission' — ตอบด่านประเภท MULTI_QUESTION ด้วย array ของ
	* index (ตำแหน่งต้องตรงกับ mission.questions[] เป๊ะ) — Backend ตรวจถูก/ผิด
	* ทีละข้อเอง แล้วตัดสิน passed จาก minimumCorrect (idempotent เหมือน
	* submitMissionAnswer) */
	function submitMultiMission(payload) {
		return callApi("submitMultiMission", { ...payload });
	}
	/** action 'verifyMissionQr' — ตรวจสอบ QR ของด่านประเภท QR_SCORE (คนละ QR/
	* handler กับ verifyStationQr เด็ดขาด — ดู types/mission.ts) ผ่านแล้ว Backend
	* บันทึก+ให้คะแนนจริงทันที (idempotent ด้วย roundId+userId+missionId เรียกซ้ำ
	* ได้ปลอดภัยเสมอ) */
	function verifyMissionQr(payload) {
		return callApi("verifyMissionQr", { ...payload });
	}
	/** action 'getMissionStatus' — สถานะด่านย่อยที่ทำสำเร็จแล้วของ roundId+userId
	* (ไม่เขียนข้อมูล) — ระบุ stationId มาด้วยได้ (ไม่บังคับ) เพื่อกรองเฉพาะฐานนั้น */
	function getMissionStatus(roundId, userId, stationId) {
		return callApi("getMissionStatus", {
			roundId,
			userId,
			stationId
		});
	}
	/** ไฟล์ใหม่ (ระบบแลกของรางวัล) — action 'getRewardStatus' ตรวจสอบสิทธิ์รางวัล
	* ของรอบที่ระบุ (ไม่เขียนข้อมูล) ใช้จากหน้าสรุปผลของผู้เล่นเอง (ดู
	* pages/round-summary.vue) เพื่อโชว์ว่ามีสิทธิ์รางวัลอะไร + เจ้าหน้าที่ยืนยัน
	* ให้แล้วหรือยัง — ไม่มีปุ่มยืนยันในหน้านั้น (ดู claimReward ด้านล่าง)
	*
	* [แก้ไข] ไม่รับ/ไม่ส่ง `score` จาก Client อีกต่อไป — server-gas เดิมมีทางลัด
	* "เชื่อ score จาก client ตรง ๆ" ซึ่งกลายเป็นช่องโหว่จริง (pages/round-summary.vue
	* เคยส่ง mockScore ของระบบภารกิจ Mock เดิมมาที่นี่) ตอนนี้ Backend คำนวณจาก
	* Journey+Answers+MissionCompletions เองเสมอ ไม่มีทางลัดแล้ว (ดู
	* server-gas/RewardService.gs::actionGetRewardStatus_) */
	function getRewardStatus(roundId, userId) {
		return callApi("getRewardStatus", {
			roundId,
			userId
		});
	}
	/** ไฟล์ใหม่ (ระบบแลกของรางวัล) — action 'claimReward' เจ้าหน้าที่กดยืนยันรับ
	* รางวัลที่จุดแลกรางวัล (ดู pages/redeem.vue) idempotent ด้วย roundId+userId
	* เรียกซ้ำได้ปลอดภัยเสมอ (ไม่สร้างประวัติซ้ำ ไม่ให้แลกซ้ำ) */
	function claimReward(roundId, userId, displayName) {
		return callApi("claimReward", {
			roundId,
			userId,
			displayName
		});
	}
	/** ไฟล์ใหม่ (ระบบแลกของรางวัล) — action 'getRoundScores' คะแนนแยกรายฐานของ
	* รอบที่ระบุ (ไม่เขียนข้อมูล) ใช้จากหน้าสรุปผล/หน้ารับรางวัลของผู้เล่นเอง (ดู
	* pages/round-summary.vue, pages/reward-received.vue ผ่าน composables/useRoundScores.ts)
	* แทนการอ่านคะแนนจาก Snapshot ฝั่ง Client — คะแนนคำนวณจาก Journey+Answers
	* ฝั่ง server เอง (ดู server-gas/RewardService.gs::getRoundScoresBreakdown_) */
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
		getStationMissions,
		getMission,
		createStationMission,
		updateStationMission,
		deleteStationMission,
		reorderStationMissions,
		submitMissionAnswer,
		submitMultiMission,
		verifyMissionQr,
		getMissionStatus,
		getRewardStatus,
		claimReward,
		getRoundScores
	};
}

export { useMemberApi as u };
//# sourceMappingURL=useMemberApi-CZogIGln.mjs.map
