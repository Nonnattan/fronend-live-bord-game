import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7, c as _sfc_main$2, n as navigateTo } from '../virtual/entry.mjs';
import { _ as _sfc_main$1 } from './Modal-BIBajBOZ.mjs';
import { u as useRoundTimer } from './useRoundTimer-Dx2_uv0V.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useMemberApi } from './useMemberApi-CZogIGln.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { u as useAdventure } from './useAdventure-OrKGgcht.mjs';
import { u as useRound } from './useRound-Vyr0MdjD.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { u as useStationQuest } from './useStationQuest-DdT4jEnZ.mjs';
import { u as useOfflineSync } from './useOfflineSync-D8-RD8DK.mjs';
import { u as useForceEndRound } from './useForceEndRound-BKPtYIoi.mjs';
import { _ as _sfc_main } from './Input-D4Sia_6G.mjs';
import { u as useQuestion, a as useOfflineAnswerSync } from './useQuestion-C6pjnTg1.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, isRef, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, nextTick, withKeys, useSSRContext } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@iconify/vue';
import 'tailwindcss/colors';
import '@vueuse/core';
import '@iconify/utils/lib/css/icon';
import 'tailwind-variants';
import './usePortal-CFE28n6Q.mjs';
import './useForwardExpose-lTVrimVg.mjs';
import '@vueuse/shared';
import 'aria-hidden';
import './useProfile-Di4CdYil.mjs';
import 'zod';
import './useStationMissions-CjHnM2MF.mjs';

//#region components/mission/MissionQuestionPopup.vue?vue&type=script&setup=true&lang.ts
var MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "MissionQuestionPopup",
	__ssrInlineRender: true,
	props: {
		open: { type: Boolean },
		stationName: {},
		question: {},
		answered: {}
	},
	emits: [
		"update:open",
		"submit",
		"continue"
	],
	setup(__props, { emit: __emit }) {
		/**
		* components/mission/MissionQuestionPopup.vue
		* ---------------------------------------------------------------------------
		* Popup "ภารกิจ + คำถามประจำฐาน" ตาม Flow ใหม่ — เปิดทันทีหลังสแกน QR เข้าฐาน
		* สำเร็จ (ก่อนหน้า Popup "เข้าฐานสำเร็จ!" เดิม) แสดง:
		*   1) ข้อความภารกิจ (mission) ของฐานนั้น
		*   2) คำถามให้ตอบ (question) — เลือกได้ตามชนิด (choice/text/number)
		*   3) ผลลัพธ์หลังตอบ (ถูก = ได้คะแนน / ผิด = ไม่ได้คะแนน) + ปุ่ม "ไปต่อ"
		*
		* ใช้ UModal เหมือน Popup อื่น ๆ ในหน้า pages/scan.vue ทุกประการ (dismissible
		* false, close false — บังคับกดปุ่มในนี้เท่านั้น) แต่แยกเป็น component ของ
		* ตัวเองต่างหาก ไม่ยัดเข้าไปในไฟล์ scan.vue ที่ใหญ่และละเอียดอ่อนอยู่แล้ว —
		* scan.vue แค่ import มาวาง + ส่ง props/ฟัง event เท่านั้น (ดู pages/scan.vue
		* ส่วน "Popup ภารกิจ + คำถาม")
		*
		* Component นี้ "ไม่เรียก" useMemberApi()/API ใด ๆ เอง — รับ `question` +
		* `answered` (ผลที่ตอบไปแล้วถ้ามี) เป็น props แล้ว emit `submit` ให้ผู้เรียกใช้
		* (scan.vue) เป็นคนเรียก useQuestion().submitAnswer() เอง คล้ายรูปแบบ
		* CameraCapture.vue (emit เฉยๆ ไม่ยุ่งกับ business logic เอง)
		*/
		const props = __props;
		const emit = __emit;
		const answerValue = ref("");
		const submitting = ref(false);
		const validationError = ref("");
		watch(() => props.question.id, () => {
			answerValue.value = "";
			validationError.value = "";
			submitting.value = false;
		});
		const hasResult = computed(() => !!props.answered);
		function selectChoice(choice) {
			if (hasResult.value) return;
			answerValue.value = choice;
			validationError.value = "";
		}
		async function handleSubmit() {
			if (hasResult.value) return;
			if (!answerValue.value.trim()) {
				validationError.value = "กรุณาตอบคำถามก่อนกดยืนยัน";
				return;
			}
			submitting.value = true;
			try {
				emit("submit", answerValue.value.trim());
			} finally {
				submitting.value = false;
			}
		}
		function handleContinue() {
			emit("continue");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UModal = _sfc_main$1;
			const _component_UIcon = _sfc_main$7;
			const _component_UInput = _sfc_main;
			const _component_UButton = _sfc_main$2;
			_push(ssrRenderComponent(_component_UModal, mergeProps({
				open: __props.open,
				title: unref(hasResult) ? "ผลคำตอบ" : `ภารกิจประจำ${__props.stationName}`,
				dismissible: false,
				close: false,
				"onUpdate:open": (v) => emit("update:open", v)
			}, _attrs), {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!unref(hasResult)) {
							_push(`<div class="mission-question" data-v-f74ce135${_scopeId}><div class="mission-question__mission" data-v-f74ce135${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-map-pinned",
								class: "mission-question__mission-icon"
							}, null, _parent, _scopeId));
							_push(`<p class="mission-question__mission-text" data-v-f74ce135${_scopeId}>${ssrInterpolate(__props.question.mission)}</p></div><p class="mission-question__question" data-v-f74ce135${_scopeId}>${ssrInterpolate(__props.question.question)}</p>`);
							if (__props.question.answerType === "choice") {
								_push(`<div class="mission-question__choices" data-v-f74ce135${_scopeId}><!--[-->`);
								ssrRenderList(__props.question.choices, (choice) => {
									_push(`<button type="button" class="${ssrRenderClass([{ "mission-question__choice--selected": unref(answerValue) === choice }, "mission-question__choice"])}" data-v-f74ce135${_scopeId}>${ssrInterpolate(choice)}</button>`);
								});
								_push(`<!--]--></div>`);
							} else _push(ssrRenderComponent(_component_UInput, {
								modelValue: unref(answerValue),
								"onUpdate:modelValue": ($event) => isRef(answerValue) ? answerValue.value = $event : null,
								type: __props.question.answerType === "number" ? "number" : "text",
								size: "xl",
								placeholder: "พิมพ์คำตอบที่นี่",
								onKeyup: handleSubmit
							}, null, _parent, _scopeId));
							if (unref(validationError)) _push(`<p class="mission-question__error" data-v-f74ce135${_scopeId}>${ssrInterpolate(unref(validationError))}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else {
							_push(`<div class="mission-question__result" data-v-f74ce135${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-sparkles",
								class: "mission-question__result-icon"
							}, null, _parent, _scopeId));
							_push(`<p class="mission-question__result-answer" data-v-f74ce135${_scopeId}>คำตอบของคุณ: ${ssrInterpolate(__props.answered.answer)}</p><p class="mission-question__result-points" data-v-f74ce135${_scopeId}>ได้ ${ssrInterpolate(__props.answered.pointsEarned)} คะแนน</p></div>`);
						}
					} else return [!unref(hasResult) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "mission-question"
					}, [
						createVNode("div", { class: "mission-question__mission" }, [createVNode(_component_UIcon, {
							name: "i-lucide-map-pinned",
							class: "mission-question__mission-icon"
						}), createVNode("p", { class: "mission-question__mission-text" }, toDisplayString(__props.question.mission), 1)]),
						createVNode("p", { class: "mission-question__question" }, toDisplayString(__props.question.question), 1),
						__props.question.answerType === "choice" ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mission-question__choices"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(__props.question.choices, (choice) => {
							return openBlock(), createBlock("button", {
								key: choice,
								type: "button",
								class: ["mission-question__choice", { "mission-question__choice--selected": unref(answerValue) === choice }],
								onClick: ($event) => selectChoice(choice)
							}, toDisplayString(choice), 11, ["onClick"]);
						}), 128))])) : (openBlock(), createBlock(_component_UInput, {
							key: 1,
							modelValue: unref(answerValue),
							"onUpdate:modelValue": ($event) => isRef(answerValue) ? answerValue.value = $event : null,
							type: __props.question.answerType === "number" ? "number" : "text",
							size: "xl",
							placeholder: "พิมพ์คำตอบที่นี่",
							onKeyup: withKeys(handleSubmit, ["enter"])
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"type"
						])),
						unref(validationError) ? (openBlock(), createBlock("p", {
							key: 2,
							class: "mission-question__error"
						}, toDisplayString(unref(validationError)), 1)) : createCommentVNode("", true)
					])) : (openBlock(), createBlock("div", {
						key: 1,
						class: "mission-question__result"
					}, [
						createVNode(_component_UIcon, {
							name: "i-lucide-sparkles",
							class: "mission-question__result-icon"
						}),
						createVNode("p", { class: "mission-question__result-answer" }, "คำตอบของคุณ: " + toDisplayString(__props.answered.answer), 1),
						createVNode("p", { class: "mission-question__result-points" }, "ได้ " + toDisplayString(__props.answered.pointsEarned) + " คะแนน", 1)
					]))];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!unref(hasResult)) _push(ssrRenderComponent(_component_UButton, {
							block: "",
							color: "primary",
							loading: unref(submitting),
							onClick: handleSubmit
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` ยืนยันคำตอบ `);
								else return [createTextVNode(" ยืนยันคำตอบ ")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(ssrRenderComponent(_component_UButton, {
							block: "",
							color: "primary",
							onClick: handleContinue
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` เดินทางไปเผ่าต่อไป `);
								else return [createTextVNode(" เดินทางไปเผ่าต่อไป ")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [!unref(hasResult) ? (openBlock(), createBlock(_component_UButton, {
						key: 0,
						block: "",
						color: "primary",
						loading: unref(submitting),
						onClick: handleSubmit
					}, {
						default: withCtx(() => [createTextVNode(" ยืนยันคำตอบ ")]),
						_: 1
					}, 8, ["loading"])) : (openBlock(), createBlock(_component_UButton, {
						key: 1,
						block: "",
						color: "primary",
						onClick: handleContinue
					}, {
						default: withCtx(() => [createTextVNode(" เดินทางไปเผ่าต่อไป ")]),
						_: 1
					}))];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/mission/MissionQuestionPopup.vue
var _sfc_setup$1 = MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default.setup;
MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/mission/MissionQuestionPopup.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var MissionQuestionPopup_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f74ce135"]]), { __name: "MissionQuestionPopup" });
//#endregion
//#region pages/scan.vue?vue&type=script&setup=true&lang.ts
var QR_ELEMENT_ID = "qr-reader";
var scan_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "scan",
	__ssrInlineRender: true,
	setup(__props) {
		const { profile, isReady } = useRequireProfile();
		const scanState = ref("idle");
		const errorMessage = ref("");
		const lastResult = ref("");
		const cameras = ref([]);
		const activeCameraIndex = ref(0);
		/**
		* ------------------------------------------------------------------------
		* Offline First: บันทึกฐานลง LocalStorage ก่อนเสมอ Google Sheet ใช้ Sync
		* เท่านั้น (ดู composables/useAdventure.ts + composables/useOfflineSync.ts)
		* ------------------------------------------------------------------------
		*/
		const { stations, isVisited, toggleStation, totalPoint } = useAdventure();
		const { isOnline, hasPending, pendingCount, isSyncing, queueCheckin, syncNow} = useOfflineSync();
		const { isOfflineMode, logStationScan, endRound, roundData } = useOfflineMode();
		const { saveRoundSummary } = useRoundSummary();
		const { endCurrentRound, currentRoundId } = useRound();
		const { submitSurvey } = useMemberApi();
		const { submitAnswer: submitQuestionAnswer, totalQuestionPoints, totalCorrect: totalQuestionCorrect } = useQuestion();
		const { syncNow: syncAnswersNow } = useOfflineAnswerSync();
		const { clearStationTimer, stationRemainingLabel, isRoundExpired, isStationExpired } = useRoundTimer();
		const { forceEndRoundDueToTimeout } = useForceEndRound();
		useStationQuest();
		const checkinFeedback = ref(null);
		const syncMessage = ref("");
		const manualCode = ref("");
		ref(false);
		const successPopupOpen = ref(false);
		const finalPopupOpen = ref(false);
		const scannedStation = ref(null);
		/**
		* [ใหม่] Popup "ภารกิจ + คำถามประจำฐาน" — เปิดก่อน Popup ผลลัพธ์ด้านบนเสมอ ถ้าฐาน
		* ที่เพิ่งสแกนมีคำถามกำหนดไว้ในชีต "Questions" (ไม่มี/ตอบไปแล้ว = ข้ามไปเปิด
		* Popup ผลลัพธ์เดิมทันที — ดู presentMission() ด้านล่าง)
		*/
		const missionPopupOpen = ref(false);
		const activeMissionQuestion = ref(null);
		const activeMissionAnswer = ref(null);
		/** Popup ที่ "รอเปิดต่อ" หลังปิด Popup ภารกิจ+คำถาม — 'success' = Popup เข้าฐาน
		* สำเร็จฐาน 1-3 เดิม, 'final' = Popup ฐานนมเดิม, null = ไม่ต้องเปิดต่ออะไรเลย
		* (กรณี Offline Mode ฐาน 1-3 ที่ใช้ checkinFeedback ข้อความแทน ไม่ใช้ Popup) */
		const pendingResultPopup = ref(null);
		/**
		* แบบประเมินก่อนจบเกม (ใหม่, ข้อ 1 ก่อน — เผื่อเพิ่มข้อถัดไปทีหลัง):
		* "ท่านชอบด่านไหนมากที่สุด" ให้คะแนน 1-5 (5=มากที่สุด ... 1=น้อยที่สุด) — บังคับ
		* ตอบก่อนออกจากหน้านี้เท่านั้น (ปุ่ม "จบเกม" ที่ Popup ฐานนมด้านล่างจะเปิด Popup
		* นี้แทนที่จะเรียก endGameAfterFinalStation() ตรง ๆ) บันทึกลง Google Sheet ผ่าน
		* submitSurvey() (ชีต "Survey" ฝั่ง server-gas) ก่อนค่อยจบเกมจริงตามปกติ
		*
		* เฉพาะฝั่ง Online เท่านั้น (Offline Mode ไม่มีอินเทอร์เน็ตให้บันทึกขึ้นชีตอยู่แล้ว
		* — ปุ่ม "จบเกม" ฝั่ง Offline ยังคงจบเกมทันทีเหมือนเดิมทุกประการ ไม่ผ่าน Popup นี้)
		*/
		const surveyPopupOpen = ref(false);
		const selectedRating = ref(null);
		const surveySubmitting = ref(false);
		const surveyError = ref("");
		const SURVEY_RATING_OPTIONS = [
			{
				value: 4,
				label: "นม"
			},
			{
				value: 3,
				label: "วัว"
			},
			{
				value: 2,
				label: "ดิน"
			},
			{
				value: 1,
				label: "ข้าวโพด"
			}
		];
		/** true ระหว่างที่มี Popup ผลลัพธ์ค้างอยู่ — ใช้กันการสแกน/กรอกรหัสซ้ำซ้อน
		* (เพิ่ม missionPopupOpen เข้ามาด้วย — กันสแกนฐานถัดไปซ้อนระหว่างยังไม่ได้ตอบ
		* คำถามของฐานปัจจุบันให้เสร็จก่อน) */
		const isResultPopupOpen = computed(() => successPopupOpen.value || finalPopupOpen.value || missionPopupOpen.value);
		/** ชื่อฐานของคำถามที่กำลังแสดงใน Popup ภารกิจ+คำถาม (ใหม่) — ใช้แสดงหัวข้อ Popup */
		const activeMissionStationName = computed(() => stations.value.find((s) => s.id === activeMissionQuestion.value?.stationId)?.name ?? "");
		computed(() => surveyPopupOpen.value || isResultPopupOpen.value);
		onBeforeRouteLeave(() => {
			if (!surveyPopupOpen.value) return true;
			return false;
		});
		/** ผู้เล่นกดส่งคำตอบใน MissionQuestionPopup — ตัดสินบนเครื่องทันที (Offline
		* First ผ่าน useQuestion().submitAnswer()) แล้วอัปเดต activeMissionAnswer ให้
		* Popup เปลี่ยนไปแสดงผลลัพธ์เอง มีเน็ตอยู่แล้ว (และไม่ใช่ Offline Mode) ลอง Sync
		* คำตอบนี้ขึ้น Backend ทันทีแบบไม่บล็อก UI (เหมือนแนวทาง Offline Queue อื่น ๆ) */
		function handleMissionSubmit(value) {
			if (!activeMissionQuestion.value) return;
			const userId = profile.value?.memberId || profile.value?.uid || "";
			const result = submitQuestionAnswer(activeMissionQuestion.value, value, {
				userId,
				firstName: profile.value?.firstName,
				roundId: currentRoundId.value
			});
			activeMissionAnswer.value = result;
			if (!isOfflineMode.value && isOnline.value && userId) syncAnswersNow(userId, profile.value?.firstName);
		}
		/** ผู้เล่นกด "เดินทางไปเผ่าต่อไป" หลังเห็นผลลัพธ์คำถามแล้ว — ปิด Popup ภารกิจ+
		* คำถาม แล้วเปิด Popup ผลลัพธ์เดิมที่ค้างไว้ต่อ (ถ้ามี — ดู pendingResultPopup
		* ใน presentMission() ด้านบน) */
		function handleMissionContinue() {
			clearStationTimer();
			missionPopupOpen.value = false;
			activeMissionQuestion.value = null;
			activeMissionAnswer.value = null;
			if (pendingResultPopup.value === "success") successPopupOpen.value = true;
			else if (pendingResultPopup.value === "final") finalPopupOpen.value = true;
			pendingResultPopup.value = null;
		}
		/**
		* [Fix] Commit ฐาน 4 (นม) "จริง" — เรียกเฉพาะตอนผู้เล่นตัดสินใจกด "จบเกม" แล้ว
		* เงื่อนไขที่เหลือผ่านครบเท่านั้น (Offline: เรียกทันทีจาก endGameOfflineAfterFinalStation()
		* / Online: เรียกหลัง Survey Submit สำเร็จจาก confirmSurveyAndEndGame() เท่านั้น —
		* ห้ามเรียกจุดอื่นเด็ดขาด) ทำหน้าที่เดียวกับ Commit ฐาน 1-3 เดิมทุกประการ (toggleStation
		* ก่อนเสมอ + offline -> logStationScan / online -> queueCheckin + runSync) แค่แยก
		* ออกมาเป็นฟังก์ชันเพื่อ "หน่วงเวลา" การ Commit ไว้จนกว่าจะผ่าน Popup ตัดสินใจ (และ
		* Survey ฝั่ง Online) มาก่อนเท่านั้น ไม่มี Logic ใหม่ที่ต่างจากฐาน 1-3 เดิมเลย
		*/
		async function commitFinalStationVisit() {
			const station = stations.value.find((s) => s.isFinal);
			const stationPoint = station.points ?? 250;
			toggleStation(station.id, currentRoundId.value);
			if (isOfflineMode.value) {
				logStationScan(station.id, station.name);
				checkinFeedback.value = {
					kind: "success",
					text: `ผ่าน${station.name}สำเร็จ (บันทึกในเครื่องแล้ว)`
				};
				return;
			}
			queueCheckin(station, stationPoint);
			checkinFeedback.value = {
				kind: "success",
				text: `ผ่าน${station.name}สำเร็จ +${stationPoint} Point (บันทึกในเครื่องแล้ว)`
			};
			await runSync();
		}
		/** ปุ่ม "Sync ข้อมูลตอนนี้" — ผู้ใช้กดเองเมื่อไหร่ก็ได้ถ้ามีเน็ต */
		async function runSync() {
			if (!isOnline.value) {
				syncMessage.value = "ไม่มีอินเทอร์เน็ต ข้อมูลจะ Sync อัตโนมัติเมื่อมีอินเทอร์เน็ต";
				return;
			}
			const result = await syncNow();
			syncMessage.value = result.message;
		}
		/** เคลียร์ผลสแกนเดิม — เรียกหลังปิด Popup ผลลัพธ์เสมอ เพื่อให้สแกนฐานถัดไปได้ */
		function resetScanResult() {
			lastResult.value = "";
			checkinFeedback.value = null;
			scannedStation.value = null;
		}
		/** ปุ่ม "ตกลง" ของ Success Popup (ฐาน 1-3) — ปิด Popup แล้วพร้อมสแกนฐานถัดไป */
		function closeSuccessPopup() {
			successPopupOpen.value = false;
			resetScanResult();
		}
		/** ปุ่ม "เล่นต่อ" ของ Popup ฐานนม — ปิด Popup แล้วพร้อมสแกนต่อ (ไม่แตะ Round logic) */
		function continuePlayingAfterFinalStation() {
			finalPopupOpen.value = false;
			resetScanResult();
		}
		/**
		* ปุ่ม "จบเกม" ของ Popup ฐานนม (Popup ตัดสินใจ) — Online: เปิด Popup แบบประเมิน
		* (บังคับตอบ) เท่านั้น "ยังไม่ Commit ฐาน 4 ใด ๆ ทั้งสิ้น" (ย้าย toggleStation/
		* queueCheckin ออกไปที่ commitFinalStationVisit() แล้ว เรียกเฉพาะหลัง Survey
		* Submit สำเร็จใน confirmSurveyAndEndGame() เท่านั้น) — Offline: ไม่มี Survey ให้
		* บันทึกขึ้น Google Sheet (ไม่มีอินเทอร์เน็ตอยู่แล้ว) จึง Commit + จบเกมทันทีผ่าน
		* endGameOfflineAfterFinalStation() ด้านล่าง (Flow เดียวกับ Online ทุกขั้นตอน
		* ยกเว้นไม่มี Survey — Scan ฐาน 4 -> Popup -> จบเกม -> Commit -> Mark visited ->
		* End Round -> Save Summary -> /round-summary)
		*
		* [Fix — root cause ของ "กดจบเกมแล้วเงียบไปเลย ไม่เห็น Popup แบบประเมิน ไม่ไป
		* /round-summary ด้วย"] เดิมปิด Popup ฐานนม (finalPopupOpen = false) แล้วเปิด
		* Popup แบบประเมิน (surveyPopupOpen = true) "ในติ๊กเดียวกัน" — UModal ทั้ง 2 ตัว
		* แชร์กลไก Teleport/Focus-trap เดียวกันของ Nuxt UI พอปิด-เปิดพร้อมกันแบบนี้บาง
		* จังหวะตัวที่เพิ่งเปิดจะถูกกลไกปิด Modal ตัวเดิมที่กำลัง unmount แทรกแซงจน "ปิด
		* ตามไปด้วยทันที" (เห็นเหมือนกดจบเกมแล้วไม่มีอะไรเกิดขึ้นเลย ทั้งที่ Logic ฝั่ง
		* Component ทำงานถูกต้องทุกจุด) — แก้โดยรอ nextTick() ให้ Popup ฐานนมปิด/เคลียร์
		* DOM เสร็จสมบูรณ์ก่อน ค่อยเปิด Popup แบบประเมินอีกที กันการชนกันนี้
		*/
		async function handleEndGameButtonClick() {
			if (isOfflineMode.value) {
				await endGameOfflineAfterFinalStation();
				return;
			}
			finalPopupOpen.value = false;
			surveyError.value = "";
			selectedRating.value = null;
			await nextTick();
			surveyPopupOpen.value = true;
		}
		/**
		* [Fix] จบเกมฝั่ง Offline หลังกด "จบเกม" ที่ Popup ตัดสินใจฐานนม — ไม่มี Survey
		* (ไม่มีอินเทอร์เน็ตให้บันทึกขึ้น Google Sheet อยู่แล้ว) จึง Commit ฐาน 4 ทันที
		* (commitFinalStationVisit() — toggleStation + logStationScan เดิมทุกประการ)
		* ตามด้วย endRound()/saveRoundSummary()/navigate เดิมที่เคยอยู่ใน isComplete()
		* Branch ของ completeStationVisit() (ย้ายมาไว้ที่นี่ทั้งดุ้น ไม่มี Logic ใหม่ที่
		* ต่างจากเดิม แค่เปลี่ยนจุดเรียกจาก "Auto เมื่อ isComplete" เป็น "เรียกตอนกด
		* จบเกมเท่านั้น" ตามสเปก) ครอบ try/finally เหมือนเดิม กันเคส saveRoundSummary()
		* throw (LocalStorage เต็ม/Private Browsing) ไม่ให้ stopCamera()/navigateTo()
		* ไม่ถูกเรียก
		*/
		const isEndingGameOffline = ref(false);
		async function endGameOfflineAfterFinalStation() {
			if (isEndingGameOffline.value) return;
			isEndingGameOffline.value = true;
			finalPopupOpen.value = false;
			resetScanResult();
			try {
				await commitFinalStationVisit();
				endRound();
				const playedStations = (roundData.value?.stations ?? []).slice().sort((a, b) => a.order - b.order).map((s) => ({
					name: s.stationName,
					points: 0
				}));
				saveRoundSummary({
					mode: "offline",
					startTime: roundData.value?.startedAt ? new Date(roundData.value.startedAt).toISOString() : null,
					endTime: new Date(roundData.value?.endedAt ?? Date.now()).toISOString(),
					stations: playedStations,
					totalPoint: null,
					roundId: null,
					userId: profile.value?.uid ?? null,
					questionPoints: totalQuestionPoints.value,
					questionCorrectCount: totalQuestionCorrect.value
				});
			} catch (err) {
				console.error("[endGameOfflineAfterFinalStation] failed to build offline round summary", err);
			} finally {
				await stopCamera();
				await navigateTo("/round-summary");
				isEndingGameOffline.value = false;
			}
		}
		/**
		* ปุ่ม "ยืนยัน" ของ Popup แบบประเมิน — บันทึกคำตอบ (submitSurvey ผูกกับ roundId
		* ปัจจุบันที่ยังไม่ปิด) แล้วค่อย Commit ฐาน 4 จริง (commitFinalStationVisit())
		* ก่อนเรียก endGameAfterFinalStation() เดิมต่อทันที
		*
		* [Fix — เปลี่ยนพฤติกรรมตามสเปกใหม่] เดิมถ้า submitSurvey() พัง จะ "ไม่บล็อก"
		* การจบเกม (log error เฉย ๆ แล้วปล่อยจบเกมต่อตามปกติ) — ตอนนี้ตามสเปก "ถ้า Survey
		* Submit ไม่สำเร็จ: ห้าม Commit ฐาน 4, ห้ามเพิ่มคะแนน, ห้าม End Round, ห้ามออกจาก
		* Survey, ให้ลองใหม่ได้" จึงต้อง "บล็อก" แทน: เจอ error -> ตั้ง surveyError ไว้
		* แสดงผล แล้ว return ทันที (ไม่ปิด surveyPopupOpen, ไม่ commit, ไม่เรียก
		* endGameAfterFinalStation()) ปล่อยให้ผู้เล่นกด "ยืนยัน" ซ้ำได้ (selectedRating
		* ยังเลือกค้างไว้เหมือนเดิม) — Commit ฐาน 4 (toggleStation/queueCheckin/Google
		* Sheet/เพิ่มคะแนน) เกิดขึ้น "หลัง" Survey Submit สำเร็จเท่านั้น ตรงตามลำดับ Flow
		* ที่ต้องการ: Scan ฐาน 4 -> Popup -> จบเกม -> Survey -> Submit สำเร็จ -> Commit
		* ฐาน 4 -> Google Sheet -> เพิ่มคะแนน -> Mark visited/✓ -> End Round -> Save
		* Summary -> /round-summary (endGameAfterFinalStation() เดิมด้านล่างจัดการตั้งแต่
		* "End Round" เป็นต้นไปอยู่แล้ว ไม่มีการแก้ไข Logic ส่วนนั้นเลย)
		*/
		async function confirmSurveyAndEndGame() {
			if (!selectedRating.value || surveySubmitting.value) return;
			surveySubmitting.value = true;
			surveyError.value = "";
			try {
				if (!isOfflineMode.value && profile.value?.memberId && currentRoundId.value) try {
					await submitSurvey({
						roundId: currentRoundId.value,
						userId: profile.value.memberId,
						firstName: profile.value.firstName,
						favoriteStationRating: selectedRating.value
					});
				} catch (err) {
					console.error("[confirmSurveyAndEndGame] submitSurvey failed", err);
					surveyError.value = "บันทึกแบบประเมินไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง";
					return;
				}
				surveyPopupOpen.value = false;
				selectedRating.value = null;
				await commitFinalStationVisit();
				await endGameAfterFinalStation();
			} finally {
				surveySubmitting.value = false;
			}
		}
		/** ปุ่ม "จบเกม" ของ Popup ฐานนม — ปิด Round ปัจจุบันด้วย roundEnd() (RoundId เดิม,
		* reuse composables/useRound.ts) ก่อนออกจากหน้า แล้วค่อยทำ UI/action เดิมต่อ
		* (ปิดกล้องด้วย stopCamera() เดิม + เด้งกลับหน้าแรกด้วย navigateTo ปกติของ Nuxt)
		*
		* [Fix] เพิ่ม resetJourney() (ของเดิมใน composables/useAdventure.ts ที่มีอยู่แล้ว
		* แต่ไม่เคยถูกเรียกใช้ที่ไหนเลย) — ล้างสถานะ "ฐานที่ผ่านแล้ว/คะแนน" ฝั่งเครื่องนี้
		* ทั้งหมด เพื่อให้เริ่มเล่น "รอบใหม่" ได้ทันที (ไม่ต้องรอกลับมาหน้านี้ใหม่) ไม่แตะ/
		* ไม่ลบข้อมูล Round หรือ Journey เดิมใน Database เลยแม้แต่บรรทัดเดียว — Round เดิม
		* ยังถูกปิดด้วย roundEnd() (RoundId เดิม) ตามปกติ ส่วน Round/Journey ใหม่ของรอบถัดไป
		* (RoundId ใหม่ = "timesection" ใหม่ แยกจากรอบเก่า) จะถูกสร้างให้อัตโนมัติทันทีที่
		* เข้าหน้า Home/Map/Scan หน้าใดหน้าหนึ่ง ผ่าน ensureRoundStarted() เดิม (ดู
		* composables/useRequireProfile.ts) ไม่ต้องเพิ่ม logic ใหม่ตรงนี้เลย
		*
		* [Fix] ก่อน resetJourney() ล้างสถานะทิ้ง — เก็บ "สำเนา" ของรอบนี้ไว้ก่อนเสมอ
		* (เวลาเริ่ม/จบจริงจาก roundEnd(), รายชื่อฐานที่ผ่าน, คะแนนรวม) ผ่าน
		* useRoundSummary().saveRoundSummary() แล้วพาไปหน้า /round-summary แทน /home
		* เดิม (ปิดกล้องทันทีเหมือนเดิมด้วย stopCamera()) หน้านั้นจะเป็นคนแสดงผลสรุป +
		* เตือนไม่ให้ออกจนกว่าจะติดต่อเจ้าหน้าที่ (ดู pages/round-summary.vue) — คะแนน
		* ระหว่างเล่น (ก่อนจบเกม) ไม่โชว์ที่หน้า Home อีกต่อไปแล้ว (ดู pages/home.vue)
		*
		* [Fix — root cause ของ "กด จบเกม แล้วไม่ไปหน้า /round-summary"] เดิม
		* saveRoundSummary()/endCurrentRound()/resetJourney() ไม่ได้ครอบ try/catch เลย
		* สักจุด — ถ้าขั้นตอนไหน throw (พบว่า saveRoundSummary() เดิม throw ได้จริงจาก
		* localStorage.setItem() ที่ไม่มี try/catch — ดู composables/useRoundSummary.ts —
		* เช่นตอน Safari Private Browsing หรือพื้นที่เก็บข้อมูลเต็มบนเครื่องที่ใช้เล่นเกม
		* กลางแจ้ง) ฟังก์ชัน async นี้จะหยุดทำงานเงียบ ๆ กลางคัน (unhandled rejection ไม่มี
		* UI แจ้งเตือน) ทำให้ stopCamera()/navigateTo('/round-summary') "ไม่ถูกเรียกเลย"
		* ทั้งที่ finalPopupOpen.value = false ไปแล้วตั้งแต่บรรทัดแรก (Popup เลยดูเหมือน
		* ปิดไปเฉย ๆ ไม่เกิดอะไรต่อ) — แก้โดยครอบ try/finally: ไม่ว่าขั้นตอนเก็บสรุปผล/
		* ปิด Round จะสำเร็จหรือไม่ ก็ต้องปิดกล้อง + navigateTo('/round-summary') เสมอใน
		* finally (saveRoundSummary() เองก็แก้ให้ไม่ throw แล้วเช่นกัน ที่นี่ครอบอีกชั้น
		* เผื่อ error อื่นที่ไม่คาดคิดจาก endCurrentRound()/resetJourney()) */
		const isEndingGame = ref(false);
		async function endGameAfterFinalStation() {
			if (isEndingGame.value) return;
			isEndingGame.value = true;
			finalPopupOpen.value = false;
			resetScanResult();
			try {
				const playedStations = stations.value.filter((s) => isVisited(s.id)).map((s) => ({
					name: s.name,
					points: s.points ?? 250
				}));
				const roundTotalPoint = totalPoint.value;
				const roundIdForSummary = currentRoundId.value;
				const userIdForSummary = profile.value?.memberId || profile.value?.uid || null;
				let startTimeIso = null;
				let endTimeIso = (/* @__PURE__ */ new Date()).toISOString();
				if (!isOfflineMode.value && profile.value?.memberId) {
					if (isOnline.value) await runSync();
					const endedRound = await endCurrentRound(profile.value.memberId);
					if (endedRound) {
						startTimeIso = endedRound.startTime || null;
						endTimeIso = endedRound.endTime || endTimeIso;
					}
				}
				saveRoundSummary({
					mode: isOfflineMode.value ? "offline" : "online",
					startTime: startTimeIso,
					endTime: endTimeIso,
					stations: playedStations,
					totalPoint: isOfflineMode.value ? null : roundTotalPoint,
					roundId: isOfflineMode.value ? null : roundIdForSummary,
					userId: userIdForSummary,
					questionPoints: totalQuestionPoints.value,
					questionCorrectCount: totalQuestionCorrect.value
				});
			} catch (err) {
				console.error("[endGameAfterFinalStation] failed to build round summary", err);
			} finally {
				await stopCamera();
				await navigateTo("/round-summary");
				isEndingGame.value = false;
			}
		}
		async function startCamera(cameraId) {}
		async function stopCamera() {
			scanState.value = "stopped";
		}
		async function retryCamera() {
			lastResult.value = "";
			await startCamera(cameras.value[activeCameraIndex.value]?.id);
		}
		/**
		* [ใหม่] เวลารอบ (2 ชม.) หรือเวลาเผ่า (30 นาที) หมด ระหว่างที่ผู้เล่นอยู่หน้านี้
		* พอดี — ตามกติกา "หมดเวลา = บังคับจบรอบ" ปิด Popup/กล้องของหน้านี้ก่อนเสมอ
		* (forceEndRoundDueToTimeout() ไม่รู้จัก UI ของหน้านี้เลย) แล้วค่อยเรียกจบรอบจริง
		* ผ่าน composables/useForceEndRound.ts (เหมือนกด "จบเกม" แต่ไม่มี Survey/ไม่
		* Commit ฐานนม — ดูเหตุผลเต็ม ๆ ในไฟล์นั้น)
		*/
		watch([isRoundExpired, isStationExpired], async ([roundExpired, stationExpired]) => {
			if (!roundExpired && !stationExpired) return;
			missionPopupOpen.value = false;
			successPopupOpen.value = false;
			finalPopupOpen.value = false;
			surveyPopupOpen.value = false;
			await stopCamera();
			await forceEndRoundDueToTimeout(roundExpired ? "round" : "station");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			const _component_UButton = _sfc_main$2;
			const _component_UInput = _sfc_main;
			const _component_UModal = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-697c5923>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "Scan QR Code" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-697c5923>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="scan" data-v-697c5923>`);
				if (unref(stationRemainingLabel)) {
					_push(`<div class="scan__station-timer" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-hourglass" }, null, _parent));
					_push(` เวลาทำภารกิจฐานนี้เหลือ ${ssrInterpolate(unref(stationRemainingLabel))}</div>`);
				} else _push(`<!---->`);
				_push(`<div class="${ssrRenderClass([{ "scan__viewport--hidden": unref(scanState) !== "running" && unref(scanState) !== "starting" }, "scan__viewport"])}" data-v-697c5923><div${ssrRenderAttr("id", QR_ELEMENT_ID)} class="scan__reader" data-v-697c5923></div></div>`);
				if (unref(scanState) === "starting") {
					_push(`<div class="scan__frame" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-loader-2",
						class: "scan__icon scan__icon--spin"
					}, null, _parent));
					_push(`<p class="scan__title" data-v-697c5923>กำลังเปิดกล้อง...</p></div>`);
				} else if (unref(scanState) === "error") {
					_push(`<div class="scan__frame" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-camera-off",
						class: "scan__icon"
					}, null, _parent));
					_push(`<p class="scan__title" data-v-697c5923>เปิดกล้องไม่สำเร็จ</p><p class="scan__desc" data-v-697c5923>${ssrInterpolate(unref(errorMessage))}</p>`);
					_push(ssrRenderComponent(_component_UButton, {
						color: "primary",
						icon: "i-lucide-rotate-cw",
						onClick: retryCamera
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`ลองใหม่อีกครั้ง`);
							else return [createTextVNode("ลองใหม่อีกครั้ง")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else if (unref(scanState) === "stopped") {
					_push(`<div class="scan__frame" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-scan-line",
						class: "scan__icon"
					}, null, _parent));
					_push(`<p class="scan__title" data-v-697c5923>ปิดกล้องแล้ว</p><p class="scan__desc" data-v-697c5923>กดเปิดกล้องอีกครั้งเพื่อสแกน QR Code</p>`);
					_push(ssrRenderComponent(_component_UButton, {
						color: "primary",
						icon: "i-lucide-camera",
						onClick: retryCamera
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`เปิดกล้อง`);
							else return [createTextVNode("เปิดกล้อง")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(`<!--[--><p class="scan__title" data-v-697c5923>วางกล้องให้ตรง QR Code</p><p class="scan__desc" data-v-697c5923> ใช้สแกน QR Code เพื่อสะสมคะแนน หรือรับสิทธิพิเศษหน้าร้าน </p><!--]-->`);
				if (unref(lastResult)) {
					_push(`<div class="scan__result" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: unref(checkinFeedback)?.kind === "success" ? "i-lucide-badge-check" : unref(checkinFeedback)?.kind === "duplicate" ? "i-lucide-info" : "i-lucide-triangle-alert",
						class: "scan__result-icon"
					}, null, _parent));
					_push(`<div class="scan__result-body" data-v-697c5923><p class="scan__result-label" data-v-697c5923>${ssrInterpolate(unref(checkinFeedback)?.kind === "invalid" ? "สแกนไม่สำเร็จ" : "สแกนสำเร็จ")}</p><p class="scan__result-value" data-v-697c5923>${ssrInterpolate(unref(checkinFeedback)?.text || unref(lastResult))}</p></div>`);
					_push(ssrRenderComponent(_component_UButton, {
						size: "xs",
						variant: "soft",
						onClick: ($event) => {
							lastResult.value = "";
							checkinFeedback.value = null;
						}
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`สแกนอีกครั้ง`);
							else return [createTextVNode("สแกนอีกครั้ง")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(`<!---->`);
				if (unref(scanState) === "running" || unref(scanState) === "starting") {
					_push(`<div class="scan__controls" data-v-697c5923><button type="button" class="scan__control-btn"${ssrIncludeBooleanAttr(unref(cameras).length < 2) ? " disabled" : ""} data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-refresh-ccw",
						class: "scan__control-icon"
					}, null, _parent));
					_push(`<span data-v-697c5923>สลับกล้อง</span></button><button type="button" class="scan__control-btn scan__control-btn--danger" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-camera-off",
						class: "scan__control-icon"
					}, null, _parent));
					_push(`<span data-v-697c5923>ปิดกล้อง</span></button></div>`);
				} else _push(`<!---->`);
				_push(`<form class="manual-code" data-v-697c5923>`);
				_push(ssrRenderComponent(_component_UInput, {
					modelValue: unref(manualCode),
					"onUpdate:modelValue": ($event) => isRef(manualCode) ? manualCode.value = $event : null,
					placeholder: "หรือกรอกรหัส QR ของฐาน",
					size: "lg",
					class: "manual-code__input"
				}, null, _parent));
				_push(ssrRenderComponent(_component_UButton, {
					type: "submit",
					color: "primary",
					size: "lg",
					disabled: !unref(manualCode).trim()
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`ยืนยัน`);
						else return [createTextVNode("ยืนยัน")];
					}),
					_: 1
				}, _parent));
				_push(`</form>`);
				_push(ssrRenderComponent(_component_UButton, {
					block: "",
					variant: "soft",
					color: "primary",
					icon: "i-lucide-layout-grid",
					to: "/stations"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` ดูฐานทั้งหมด `);
						else return [createTextVNode(" ดูฐานทั้งหมด ")];
					}),
					_: 1
				}, _parent));
				if (unref(isOfflineMode)) {
					_push(`<section class="sync-card" data-v-697c5923><div class="sync-card__row" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-wifi-off",
						class: "sync-card__icon sync-card__icon--offline"
					}, null, _parent));
					_push(`<div class="sync-card__text" data-v-697c5923><p class="sync-card__title" data-v-697c5923>โหมดออฟไลน์</p><p class="sync-card__desc" data-v-697c5923> ข้อมูลบันทึกในเครื่องเท่านั้น ไม่มีการเชื่อมต่ออินเทอร์เน็ต </p></div></div></section>`);
				} else {
					_push(`<section class="sync-card" data-v-697c5923><div class="sync-card__row" data-v-697c5923>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: unref(isOnline) ? "i-lucide-wifi" : "i-lucide-wifi-off",
						class: ["sync-card__icon", { "sync-card__icon--offline": !unref(isOnline) }]
					}, null, _parent));
					_push(`<div class="sync-card__text" data-v-697c5923><p class="sync-card__title" data-v-697c5923>${ssrInterpolate(unref(isOnline) ? "ออนไลน์" : "ออฟไลน์")}</p><p class="sync-card__desc" data-v-697c5923>${ssrInterpolate(unref(hasPending) ? `มี ${unref(pendingCount)} ฐานรอ Sync ขึ้น Google Sheet` : "Sync ข้อมูลล่าสุดแล้ว")}</p></div>`);
					_push(ssrRenderComponent(_component_UButton, {
						size: "sm",
						variant: "soft",
						loading: unref(isSyncing),
						disabled: !unref(hasPending) || !unref(isOnline) || unref(isSyncing),
						onClick: runSync
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` Sync ตอนนี้ `);
							else return [createTextVNode(" Sync ตอนนี้ ")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
					if (unref(syncMessage)) _push(`<p class="sync-card__message" data-v-697c5923>${ssrInterpolate(unref(syncMessage))}</p>`);
					else if (unref(hasPending) && !unref(isOnline)) _push(`<p class="sync-card__message" data-v-697c5923> ข้อมูลจะ Sync อัตโนมัติเมื่อมีอินเทอร์เน็ต </p>`);
					else _push(`<!---->`);
					_push(`</section>`);
				}
				_push(`</div>`);
			}
			if (unref(activeMissionQuestion)) _push(ssrRenderComponent(MissionQuestionPopup_default, {
				open: unref(missionPopupOpen),
				"onUpdate:open": ($event) => isRef(missionPopupOpen) ? missionPopupOpen.value = $event : null,
				"station-name": unref(activeMissionStationName),
				question: unref(activeMissionQuestion),
				answered: unref(activeMissionAnswer),
				onSubmit: handleMissionSubmit,
				onContinue: handleMissionContinue
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(successPopupOpen),
				"onUpdate:open": ($event) => isRef(successPopupOpen) ? successPopupOpen.value = $event : null,
				title: "เข้าฐานสำเร็จ!",
				dismissible: false,
				close: false
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="result-popup" data-v-697c5923${_scopeId}>`);
						_push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-party-popper",
							class: "result-popup__icon"
						}, null, _parent, _scopeId));
						_push(`<p class="result-popup__station" data-v-697c5923${_scopeId}>${ssrInterpolate(unref(scannedStation)?.name)}</p>`);
						if (unref(scannedStation)) _push(`<p class="result-popup__points" data-v-697c5923${_scopeId}> +${ssrInterpolate(unref(scannedStation).points)} Point </p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "result-popup" }, [
						createVNode(_component_UIcon, {
							name: "i-lucide-party-popper",
							class: "result-popup__icon"
						}),
						createVNode("p", { class: "result-popup__station" }, toDisplayString(unref(scannedStation)?.name), 1),
						unref(scannedStation) ? (openBlock(), createBlock("p", {
							key: 0,
							class: "result-popup__points"
						}, " +" + toDisplayString(unref(scannedStation).points) + " Point ", 1)) : createCommentVNode("", true)
					])];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "primary",
						onClick: closeSuccessPopup
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`ตกลง`);
							else return [createTextVNode("ตกลง")];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UButton, {
						block: "",
						color: "primary",
						onClick: closeSuccessPopup
					}, {
						default: withCtx(() => [createTextVNode("ตกลง")]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(finalPopupOpen),
				"onUpdate:open": ($event) => isRef(finalPopupOpen) ? finalPopupOpen.value = $event : null,
				title: "ยินดีด้วย! คุณมาถึงฐานนมแล้ว",
				dismissible: false,
				close: false
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="result-popup" data-v-697c5923${_scopeId}>`);
						_push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-milk",
							class: "result-popup__icon"
						}, null, _parent, _scopeId));
						_push(`<p class="result-popup__station" data-v-697c5923${_scopeId}>${ssrInterpolate(unref(scannedStation)?.name)}</p>`);
						if (unref(scannedStation)) _push(`<p class="result-popup__points" data-v-697c5923${_scopeId}> +${ssrInterpolate(unref(scannedStation).points)} Point </p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "result-popup" }, [
						createVNode(_component_UIcon, {
							name: "i-lucide-milk",
							class: "result-popup__icon"
						}),
						createVNode("p", { class: "result-popup__station" }, toDisplayString(unref(scannedStation)?.name), 1),
						unref(scannedStation) ? (openBlock(), createBlock("p", {
							key: 0,
							class: "result-popup__points"
						}, " +" + toDisplayString(unref(scannedStation).points) + " Point ", 1)) : createCommentVNode("", true)
					])];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="result-popup__actions" data-v-697c5923${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							block: "",
							color: "neutral",
							variant: "soft",
							onClick: continuePlayingAfterFinalStation
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`เล่นต่อ`);
								else return [createTextVNode("เล่นต่อ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							block: "",
							color: "primary",
							loading: unref(isEndingGame) || unref(isEndingGameOffline),
							disabled: unref(isEndingGame) || unref(isEndingGameOffline),
							onClick: handleEndGameButtonClick
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`จบเกม`);
								else return [createTextVNode("จบเกม")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "result-popup__actions" }, [createVNode(_component_UButton, {
						block: "",
						color: "neutral",
						variant: "soft",
						onClick: continuePlayingAfterFinalStation
					}, {
						default: withCtx(() => [createTextVNode("เล่นต่อ")]),
						_: 1
					}), createVNode(_component_UButton, {
						block: "",
						color: "primary",
						loading: unref(isEndingGame) || unref(isEndingGameOffline),
						disabled: unref(isEndingGame) || unref(isEndingGameOffline),
						onClick: handleEndGameButtonClick
					}, {
						default: withCtx(() => [createTextVNode("จบเกม")]),
						_: 1
					}, 8, ["loading", "disabled"])])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(surveyPopupOpen),
				"onUpdate:open": ($event) => isRef(surveyPopupOpen) ? surveyPopupOpen.value = $event : null,
				title: "แบบประเมิน",
				dismissible: false,
				close: false
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="survey-popup" data-v-697c5923${_scopeId}><p class="survey-popup__question" data-v-697c5923${_scopeId}>ท่านชอบด่านไหนมากที่สุด</p><div class="survey-popup__scale" data-v-697c5923${_scopeId}><!--[-->`);
						ssrRenderList(SURVEY_RATING_OPTIONS, (option) => {
							_push(`<button type="button" class="${ssrRenderClass([{ "survey-popup__option--selected": unref(selectedRating) === option.value }, "survey-popup__option"])}" data-v-697c5923${_scopeId}><span class="survey-popup__option-value" data-v-697c5923${_scopeId}>${ssrInterpolate(option.value)}</span><span class="survey-popup__option-label" data-v-697c5923${_scopeId}>${ssrInterpolate(option.label)}</span></button>`);
						});
						_push(`<!--]--></div>`);
						if (unref(surveyError)) _push(`<p class="survey-popup__error" data-v-697c5923${_scopeId}>${ssrInterpolate(unref(surveyError))}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "survey-popup" }, [
						createVNode("p", { class: "survey-popup__question" }, "ท่านชอบด่านไหนมากที่สุด"),
						createVNode("div", { class: "survey-popup__scale" }, [(openBlock(), createBlock(Fragment, null, renderList(SURVEY_RATING_OPTIONS, (option) => {
							return createVNode("button", {
								key: option.value,
								type: "button",
								class: ["survey-popup__option", { "survey-popup__option--selected": unref(selectedRating) === option.value }],
								onClick: ($event) => selectedRating.value = option.value
							}, [createVNode("span", { class: "survey-popup__option-value" }, toDisplayString(option.value), 1), createVNode("span", { class: "survey-popup__option-label" }, toDisplayString(option.label), 1)], 10, ["onClick"]);
						}), 64))]),
						unref(surveyError) ? (openBlock(), createBlock("p", {
							key: 0,
							class: "survey-popup__error"
						}, toDisplayString(unref(surveyError)), 1)) : createCommentVNode("", true)
					])];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "primary",
						loading: unref(surveySubmitting),
						disabled: !unref(selectedRating) || unref(surveySubmitting),
						onClick: confirmSurveyAndEndGame
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` ยืนยัน `);
							else return [createTextVNode(" ยืนยัน ")];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UButton, {
						block: "",
						color: "primary",
						loading: unref(surveySubmitting),
						disabled: !unref(selectedRating) || unref(surveySubmitting),
						onClick: confirmSurveyAndEndGame
					}, {
						default: withCtx(() => [createTextVNode(" ยืนยัน ")]),
						_: 1
					}, 8, ["loading", "disabled"])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/scan.vue
var _sfc_setup = scan_vue_vue_type_script_setup_true_lang_default.setup;
scan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/scan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var scan_default = /*#__PURE__*/ _plugin_vue_export_helper_default(scan_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-697c5923"]]);

export { scan_default as default };
//# sourceMappingURL=scan-D84BwqU-.mjs.map
