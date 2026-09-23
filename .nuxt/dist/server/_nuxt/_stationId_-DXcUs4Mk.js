import { c as navigateTo, u as useRoute } from "./error-CeCQlnc5.js";
import { t as _sfc_main } from "./Modal-Bf6V9eIc.js";
import { D as _sfc_main$1, n as _plugin_vue_export_helper_default, r as _sfc_main$2, t as useOfflineMode } from "../server.mjs";
import { t as useRoundTimer } from "./useRoundTimer-CHUCPQ34.js";
import { t as PageHeader_default } from "./PageHeader-D2G5O0y5.js";
import { t as definePageMeta } from "./pages-Cs7lFyjE.js";
import { t as useRequireProfile } from "./useRequireProfile-lZ7eJIgL.js";
import { i as useAdventure, r as STATION_TYPE_META } from "./useAdventure-oyoryhV9.js";
import { t as useRound } from "./useRound-BmAVHypg.js";
import { a as useOfflineAnswerSync, i as useQuestion, n as useStationMissions, r as useOfflineMissionAnswerSync } from "./useStationMissions-DyKPx7bx.js";
import { n as useStationQuest } from "./useStationQuest-Bji0iII9.js";
import { t as useOfflineSync } from "./useOfflineSync-CTQBoPkt.js";
import { Fragment, computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, isRef, mergeProps, openBlock, readonly, ref, renderList, toDisplayString, unref, useSSRContext, vModelDynamic, watch, withCtx, withDirectives } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderDynamicModel, ssrRenderList } from "vue/server-renderer";
//#region components/station/StationMissionCard.vue?vue&type=script&setup=true&lang.ts
var StationMissionCard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StationMissionCard",
	__ssrInlineRender: true,
	props: { mission: {} },
	emits: ["open"],
	setup(__props, { emit: __emit }) {
		/**
		* components/station/StationMissionCard.vue
		* ---------------------------------------------------------------------------
		* [แก้ไข] การ์ด 1 ใบในลิสต์ภารกิจของฐาน — รับ StationMission จริงจาก Backend
		* (ไม่ใช่ icon/title/description แยกชิ้นแบบ Mock เดิมอีกต่อไป) กดเพื่อเปิดภารกิจ
		* นั้นต่อ ไอคอนเลือกจาก mission.type (SINGLE_QUESTION/MULTI_QUESTION/QR_SCORE —
		* ไม่ผูกกับ Mock 3 ชนิดตายตัวเดิมแล้ว)
		*/
		const props = __props;
		const MISSION_TYPE_ICON = {
			SINGLE_QUESTION: "❓",
			MULTI_QUESTION: "📝",
			QR_SCORE: "📱"
		};
		const icon = computed(() => MISSION_TYPE_ICON[props.mission.type]);
		const pointsLabel = computed(() => props.mission.completed ? `+${props.mission.pointsEarned} คะแนน` : `${props.mission.points} คะแนน`);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			_push(`<button${ssrRenderAttrs(mergeProps({
				type: "button",
				class: ["mission-card", { "mission-card--completed": __props.mission.completed }]
			}, _attrs))} data-v-2dbc6d5a><span class="mission-card__icon" data-v-2dbc6d5a>${ssrInterpolate(unref(icon))}</span><span class="mission-card__body" data-v-2dbc6d5a><span class="mission-card__title" data-v-2dbc6d5a>${ssrInterpolate(__props.mission.title)}</span><span class="mission-card__desc" data-v-2dbc6d5a>${ssrInterpolate(__props.mission.description)}</span><span class="mission-card__points" data-v-2dbc6d5a>${ssrInterpolate(unref(pointsLabel))}</span></span>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: __props.mission.completed ? "i-lucide-check-circle-2" : "i-lucide-chevron-right",
				class: ["mission-card__chevron", { "mission-card__chevron--done": __props.mission.completed }]
			}, null, _parent));
			_push(`</button>`);
		};
	}
});
//#endregion
//#region components/station/StationMissionCard.vue
var _sfc_setup$4 = StationMissionCard_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionCard.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var StationMissionCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StationMissionCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2dbc6d5a"]]), { __name: "StationMissionCard" });
//#endregion
//#region components/station/StationMissionList.vue?vue&type=script&setup=true&lang.ts
var StationMissionList_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StationMissionList",
	__ssrInlineRender: true,
	props: {
		missions: {},
		hideCelebration: { type: Boolean }
	},
	emits: ["openMission"],
	setup(__props, { emit: __emit }) {
		/**
		* components/station/StationMissionList.vue
		* ---------------------------------------------------------------------------
		* [แก้ไข] เนื้อหาหลักของหน้า "ภารกิจฐาน___" (pages/station/[stationId].vue) —
		* รับ StationMission[] จริงจาก Backend (listStationMissions) แทน
		* StationMissionMap ตายตัว 3 คีย์แบบ Mock เดิม — จำนวนภารกิจที่แสดง (Progress
		* X/N + จำนวนการ์ด) มาจาก missions.length จริงเสมอ ไม่ hardcode เป็น 3 อีกต่อไป
		* เรียงการ์ดตาม mission.order ที่ Backend กำหนด เมื่อครบทุกใบแสดงข้อความฉลอง
		* เพิ่ม (ฐานนมมี CTA พิเศษเพิ่มเติมที่ตัวหน้าเต็มเอง ไม่ใช่ Component นี้ — ดู
		* hideCelebration)
		*/
		const props = __props;
		const emit = __emit;
		const sortedMissions = computed(() => [...props.missions].sort((a, b) => a.order - b.order));
		const progressCount = computed(() => sortedMissions.value.filter((m) => m.completed).length);
		const isAllComplete = computed(() => sortedMissions.value.length > 0 && progressCount.value === sortedMissions.value.length);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mission-list" }, _attrs))} data-v-b417ad4e><p class="mission-list__progress" data-v-b417ad4e>${ssrInterpolate(unref(progressCount))} / ${ssrInterpolate(unref(sortedMissions).length)} ภารกิจ </p>`);
			if (unref(isAllComplete) && !__props.hideCelebration) _push(`<div class="mission-list__done" data-v-b417ad4e> 🎉 ทำภารกิจฐานนี้ครบแล้ว </div>`);
			else _push(`<!---->`);
			_push(`<div class="mission-list__cards" data-v-b417ad4e><!--[-->`);
			ssrRenderList(unref(sortedMissions), (mission) => {
				_push(ssrRenderComponent(StationMissionCard_default, {
					key: mission.id,
					mission,
					onOpen: ($event) => emit("openMission", mission)
				}, null, _parent));
			});
			_push(`<!--]--></div></div>`);
		};
	}
});
//#endregion
//#region components/station/StationMissionList.vue
var _sfc_setup$3 = StationMissionList_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionList_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionList.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var StationMissionList_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StationMissionList_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b417ad4e"]]), { __name: "StationMissionList" });
//#endregion
//#region components/station/StationMissionQuestion.vue?vue&type=script&setup=true&lang.ts
var StationMissionQuestion_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StationMissionQuestion",
	__ssrInlineRender: true,
	props: {
		open: { type: Boolean },
		questions: {},
		result: {}
	},
	emits: [
		"update:open",
		"submit",
		"close"
	],
	setup(__props, { emit: __emit }) {
		/**
		* components/station/StationMissionQuestion.vue
		* ---------------------------------------------------------------------------
		* [แก้ไข] ป็อปอัพคำถาม ใช้ร่วมกันทั้งภารกิจ SINGLE_QUESTION (1 คำถาม) และ
		* MULTI_QUESTION (N คำถาม — ไม่ hardcode จำนวน) — รับคำถามจริงจาก Backend ผ่าน
		* useQuestion().getQuestionsForMission() (ตัวหน้าเต็มเป็นคนดึงมาให้ ไม่ดึงเอง
		* ที่นี่) เป็น Component เดียวไม่ต้องมี mode prop/สร้างคู่แฝง — ตัวหน้าเต็มเป็น
		* คนเลือกว่าจะเรียก useStationMissions().submitSingleQuestion()/
		* submitMultiQuestion() ตัวไหนตอน @submit ไม่ตัดสิน/คำนวณคะแนนเองที่นี่เลย
		* แค่รับ `result` กลับมาแสดงผล — ตอบได้ครั้งเดียว มี result แล้วจะ Lock เป็นหน้า
		* ผลลัพธ์ถาวร
		*
		* รองรับ answerType ทั้ง 3 แบบต่อคำถาม (choice/text/number — ดู
		* types/question.ts) ไม่ใช่แค่ตัวเลือกปรนัยแบบ Mock เดิมอีกต่อไป
		*/
		const props = __props;
		const emit = __emit;
		const localAnswers = ref({});
		watch(() => props.questions.map((q) => q.id).join(","), () => {
			localAnswers.value = {};
		});
		const hasResult = computed(() => !!props.result);
		const isMulti = computed(() => props.questions.length > 1);
		const allAnswered = computed(() => props.questions.every((q) => (localAnswers.value[q.id] ?? "").trim() !== ""));
		function selectChoice(questionId, choice) {
			if (hasResult.value) return;
			localAnswers.value = {
				...localAnswers.value,
				[questionId]: choice
			};
		}
		function handleSubmit() {
			if (hasResult.value || !allAnswered.value) return;
			emit("submit", props.questions.map((q) => ({
				questionId: q.id,
				answer: localAnswers.value[q.id] ?? ""
			})));
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UModal = _sfc_main;
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(ssrRenderComponent(_component_UModal, mergeProps({
				open: __props.open,
				dismissible: false,
				close: false,
				"onUpdate:open": (v) => emit("update:open", v)
			}, _attrs), {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!unref(hasResult)) {
							_push(`<div class="mission-question" data-v-ec3966fe${_scopeId}><!--[-->`);
							ssrRenderList(__props.questions, (question, idx) => {
								_push(`<div class="mission-question__item" data-v-ec3966fe${_scopeId}>`);
								if (unref(isMulti)) _push(`<p class="mission-question__index" data-v-ec3966fe${_scopeId}> ข้อ ${ssrInterpolate(idx + 1)} / ${ssrInterpolate(__props.questions.length)}</p>`);
								else _push(`<!---->`);
								_push(`<p class="mission-question__text" data-v-ec3966fe${_scopeId}>${ssrInterpolate(question.question)}</p>`);
								if (question.answerType === "choice") {
									_push(`<div class="mission-question__choices" data-v-ec3966fe${_scopeId}><!--[-->`);
									ssrRenderList(question.choices, (c) => {
										_push(`<button type="button" class="${ssrRenderClass([{ "mission-question__choice--selected": unref(localAnswers)[question.id] === c }, "mission-question__choice"])}" data-v-ec3966fe${_scopeId}>${ssrInterpolate(c)}</button>`);
									});
									_push(`<!--]--></div>`);
								} else _push(`<input${ssrRenderDynamicModel(question.answerType === "number" ? "number" : "text", unref(localAnswers)[question.id], null)} class="mission-question__input"${ssrRenderAttr("type", question.answerType === "number" ? "number" : "text")}${ssrRenderAttr("placeholder", question.answerType === "number" ? "พิมพ์ตัวเลขคำตอบ" : "พิมพ์คำตอบ")} data-v-ec3966fe${_scopeId}>`);
								_push(`</div>`);
							});
							_push(`<!--]--></div>`);
						} else {
							_push(`<div class="mission-question__result" data-v-ec3966fe${_scopeId}>`);
							if (__props.result.correctCount > 0) _push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-check-circle-2",
								class: "mission-question__result-icon mission-question__result-icon--correct"
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
							if (__props.result.totalCount > 1) _push(`<p class="mission-question__result-summary" data-v-ec3966fe${_scopeId}> ตอบถูก ${ssrInterpolate(__props.result.correctCount)} / ${ssrInterpolate(__props.result.totalCount)} ข้อ </p>`);
							else _push(`<!---->`);
							if (__props.result.totalPoints > 0) _push(`<p class="mission-question__result-points" data-v-ec3966fe${_scopeId}> +${ssrInterpolate(__props.result.totalPoints)} คะแนน </p>`);
							else _push(`<p class="mission-question__result-points mission-question__result-points--wrong" data-v-ec3966fe${_scopeId}> 0 คะแนน </p>`);
							_push(`</div>`);
						}
					} else return [!unref(hasResult) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "mission-question"
					}, [(openBlock(true), createBlock(Fragment, null, renderList(__props.questions, (question, idx) => {
						return openBlock(), createBlock("div", {
							key: question.id,
							class: "mission-question__item"
						}, [
							unref(isMulti) ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mission-question__index"
							}, " ข้อ " + toDisplayString(idx + 1) + " / " + toDisplayString(__props.questions.length), 1)) : createCommentVNode("", true),
							createVNode("p", { class: "mission-question__text" }, toDisplayString(question.question), 1),
							question.answerType === "choice" ? (openBlock(), createBlock("div", {
								key: 1,
								class: "mission-question__choices"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(question.choices, (c) => {
								return openBlock(), createBlock("button", {
									key: c,
									type: "button",
									class: ["mission-question__choice", { "mission-question__choice--selected": unref(localAnswers)[question.id] === c }],
									onClick: ($event) => selectChoice(question.id, c)
								}, toDisplayString(c), 11, ["onClick"]);
							}), 128))])) : withDirectives((openBlock(), createBlock("input", {
								key: 2,
								"onUpdate:modelValue": ($event) => unref(localAnswers)[question.id] = $event,
								class: "mission-question__input",
								type: question.answerType === "number" ? "number" : "text",
								placeholder: question.answerType === "number" ? "พิมพ์ตัวเลขคำตอบ" : "พิมพ์คำตอบ"
							}, null, 8, [
								"onUpdate:modelValue",
								"type",
								"placeholder"
							])), [[vModelDynamic, unref(localAnswers)[question.id]]])
						]);
					}), 128))])) : (openBlock(), createBlock("div", {
						key: 1,
						class: "mission-question__result"
					}, [
						__props.result.correctCount > 0 ? (openBlock(), createBlock(_component_UIcon, {
							key: 0,
							name: "i-lucide-check-circle-2",
							class: "mission-question__result-icon mission-question__result-icon--correct"
						})) : createCommentVNode("", true),
						__props.result.totalCount > 1 ? (openBlock(), createBlock("p", {
							key: 1,
							class: "mission-question__result-summary"
						}, " ตอบถูก " + toDisplayString(__props.result.correctCount) + " / " + toDisplayString(__props.result.totalCount) + " ข้อ ", 1)) : createCommentVNode("", true),
						__props.result.totalPoints > 0 ? (openBlock(), createBlock("p", {
							key: 2,
							class: "mission-question__result-points"
						}, " +" + toDisplayString(__props.result.totalPoints) + " คะแนน ", 1)) : (openBlock(), createBlock("p", {
							key: 3,
							class: "mission-question__result-points mission-question__result-points--wrong"
						}, " 0 คะแนน "))
					]))];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!unref(hasResult)) _push(ssrRenderComponent(_component_UButton, {
							block: "",
							color: "primary",
							disabled: !unref(allAnswered),
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
							onClick: ($event) => emit("close")
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`ปิด`);
								else return [createTextVNode("ปิด")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [!unref(hasResult) ? (openBlock(), createBlock(_component_UButton, {
						key: 0,
						block: "",
						color: "primary",
						disabled: !unref(allAnswered),
						onClick: handleSubmit
					}, {
						default: withCtx(() => [createTextVNode(" ยืนยันคำตอบ ")]),
						_: 1
					}, 8, ["disabled"])) : (openBlock(), createBlock(_component_UButton, {
						key: 1,
						block: "",
						color: "primary",
						onClick: ($event) => emit("close")
					}, {
						default: withCtx(() => [createTextVNode("ปิด")]),
						_: 1
					}, 8, ["onClick"]))];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/station/StationMissionQuestion.vue
var _sfc_setup$2 = StationMissionQuestion_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionQuestion_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionQuestion.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var StationMissionQuestion_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StationMissionQuestion_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ec3966fe"]]), { __name: "StationMissionQuestion" });
//#endregion
//#region composables/useQrScanner.ts
function useQrScanner(elementId, onDecode) {
	const scanState = ref("idle");
	const errorMessage = ref("");
	const cameras = ref([]);
	const activeCameraIndex = ref(0);
	let html5Qrcode = null;
	let Html5QrcodeCtor = null;
	function pickDefaultCameraIndex(list) {
		const backIndex = list.findIndex((cam) => /back|rear|environment/i.test(cam.label));
		return backIndex >= 0 ? backIndex : 0;
	}
	async function startCamera(cameraId) {
		if (!Html5QrcodeCtor) return;
		scanState.value = "starting";
		errorMessage.value = "";
		try {
			if (!html5Qrcode) html5Qrcode = new Html5QrcodeCtor(elementId, { verbose: false });
			const targetCameraId = cameraId ?? cameras.value[activeCameraIndex.value]?.id;
			await html5Qrcode.start(targetCameraId ? { deviceId: { exact: targetCameraId } } : { facingMode: "environment" }, {
				fps: 10,
				qrbox: {
					width: 240,
					height: 240
				},
				aspectRatio: 1
			}, (decodedText) => {
				onDecode(decodedText);
			}, () => {});
			scanState.value = "running";
		} catch (err) {
			scanState.value = "error";
			errorMessage.value = err instanceof Error ? err.message : "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง";
		}
	}
	async function stopCamera() {
		if (html5Qrcode && scanState.value === "running") try {
			await html5Qrcode.stop();
			html5Qrcode.clear();
		} catch {}
		scanState.value = "stopped";
	}
	async function switchCamera() {
		if (cameras.value.length < 2) return;
		if (html5Qrcode && scanState.value === "running") try {
			await html5Qrcode.stop();
			html5Qrcode.clear();
		} catch {}
		activeCameraIndex.value = (activeCameraIndex.value + 1) % cameras.value.length;
		await startCamera(cameras.value[activeCameraIndex.value]?.id);
	}
	/** โหลด html5-qrcode (dynamic import — โค้ดหนัก ไม่ควรอยู่ใน bundle หลัก) +
	* enumerate กล้อง + เปิดกล้องอัตโนมัติ เรียกครั้งเดียวตอน mounted ของ Component */
	async function initAndStart() {
		const mod = await import("html5-qrcode");
		Html5QrcodeCtor = mod.Html5Qrcode;
		try {
			const list = await mod.Html5Qrcode.getCameras();
			cameras.value = list;
			activeCameraIndex.value = pickDefaultCameraIndex(list);
		} catch {}
		await startCamera(cameras.value[activeCameraIndex.value]?.id);
	}
	return {
		scanState: readonly(scanState),
		errorMessage: readonly(errorMessage),
		cameras: readonly(cameras),
		hasMultipleCameras: computed(() => cameras.value.length > 1),
		initAndStart,
		startCamera,
		stopCamera,
		switchCamera
	};
}
//#endregion
//#region components/station/StationMissionQr.vue?vue&type=script&setup=true&lang.ts
var QR_ELEMENT_ID = "mission-qr-reader";
var StationMissionQr_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StationMissionQr",
	__ssrInlineRender: true,
	props: {
		open: { type: Boolean },
		completed: { type: Boolean },
		pointsEarned: {},
		isOnline: { type: Boolean },
		verifying: { type: Boolean },
		errorMessage: {}
	},
	emits: [
		"update:open",
		"scanned",
		"close"
	],
	setup(__props, { emit: __emit }) {
		/**
		* components/station/StationMissionQr.vue
		* ---------------------------------------------------------------------------
		* [แก้ไข] ป็อปอัพภารกิจ "สแกน QR" — เปิดกล้องจริงสแกน QR ของภารกิจ (คนละ QR/
		* Handler กับ Station QR ของ pages/scan.vue เด็ดขาด — ดู types/mission.ts)
		* แทนปุ่ม "จำลองการสแกนสำเร็จ" เดิม ใช้ composables/useQrScanner.ts (สกัดแนวทาง
		* กล้องมาจาก pages/scan.vue แบบแยกอิสระ — ไม่แก้ไฟล์นั้นเลย) เปิดกล้องแล้ว emit
		* 'scanned' ให้ตัวหน้าเต็มเป็นคนเรียก useStationMissions().verifyQrMission()
		* ต่อ (ที่นี่ไม่รู้จัก Business Logic/Backend เลย แค่จับภาพ+ส่งค่าที่อ่านได้
		* ออกไปเท่านั้น — ไม่ถือว่าสำเร็จ/ได้คะแนนเองก่อนได้รับคำตอบจาก Backend)
		*
		* ต้องมีอินเทอร์เน็ตเสมอ (ไม่มี Offline Fallback — เหมือน verifyStationQr) —
		* ถ้าออฟไลน์อยู่ ไม่เปิดกล้องเลย แสดงข้อความแจ้งเตือนแทน
		*/
		const props = __props;
		const emit = __emit;
		const lastScanned = ref("");
		function handleDecode(text) {
			if (lastScanned.value || props.verifying || props.completed) return;
			lastScanned.value = text;
			emit("scanned", text);
		}
		const { scanState, errorMessage: cameraError, initAndStart, stopCamera } = useQrScanner(QR_ELEMENT_ID, handleDecode);
		/** เปิดกล้องเฉพาะตอน Popup เปิดจริง + มีอินเทอร์เน็ต + ยังไม่ทำสำเร็จ (ทำสำเร็จ
		* แล้วไม่ต้องเปิดกล้องซ้ำอีก) — ปิดกล้องทันทีที่ Popup ปิด/ทำสำเร็จ/ออฟไลน์
		* flush: 'post' เสมอ — รอให้ DOM ของ #mission-qr-reader render เสร็จก่อนเรียก
		* initAndStart() (ซึ่งต้องหา element นี้เจอ) กันปัญหา Race Condition ระหว่าง
		* Vue Reactivity กับ DOM จริง */
		watch(() => [
			props.open,
			props.isOnline,
			props.completed
		], async ([open, isOnline, completed]) => {
			if (open && isOnline && !completed) {
				lastScanned.value = "";
				await initAndStart();
			} else await stopCamera();
		}, {
			immediate: true,
			flush: "post"
		});
		/** ยิงไม่สำเร็จ (Backend ตอบ error เช่น QR ผิด/ไม่ใช่ของภารกิจนี้) — ปลดล็อคให้
		* สแกนใหม่ได้อีกครั้ง (ไม่ต้องปิด/เปิด Popup ใหม่) */
		watch(() => props.errorMessage, (message) => {
			if (message) lastScanned.value = "";
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UModal = _sfc_main;
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(ssrRenderComponent(_component_UModal, mergeProps({
				open: __props.open,
				title: __props.completed ? "✓ ทำสำเร็จ" : "📱 ภารกิจสแกน QR",
				dismissible: false,
				close: false,
				"onUpdate:open": (v) => emit("update:open", v)
			}, _attrs), {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="mission-qr" data-v-db194a17${_scopeId}>`);
						if (__props.completed) {
							_push(`<!--[-->`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-check-circle-2",
								class: "mission-qr__icon mission-qr__icon--done"
							}, null, _parent, _scopeId));
							_push(`<p class="mission-qr__text" data-v-db194a17${_scopeId}>ผ่านภารกิจสแกน QR แล้ว (+${ssrInterpolate(__props.pointsEarned)} คะแนน)</p><!--]-->`);
						} else if (!__props.isOnline) {
							_push(`<!--[-->`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-wifi-off",
								class: "mission-qr__icon"
							}, null, _parent, _scopeId));
							_push(`<p class="mission-qr__text" data-v-db194a17${_scopeId}> ภารกิจนี้ต้องมีอินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่ </p><!--]-->`);
						} else {
							_push(`<!--[--><p class="mission-qr__hint" data-v-db194a17${_scopeId}>ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ</p><div${ssrRenderAttr("id", QR_ELEMENT_ID)} class="mission-qr__camera" data-v-db194a17${_scopeId}></div>`);
							if (unref(scanState) === "starting") _push(`<p class="mission-qr__status" data-v-db194a17${_scopeId}>กำลังเปิดกล้อง...</p>`);
							else _push(`<!---->`);
							if (__props.verifying) _push(`<p class="mission-qr__status" data-v-db194a17${_scopeId}>กำลังตรวจสอบ QR...</p>`);
							else _push(`<!---->`);
							if (unref(scanState) === "error") _push(`<p class="mission-qr__status mission-qr__status--error" data-v-db194a17${_scopeId}>${ssrInterpolate(unref(cameraError))}</p>`);
							else _push(`<!---->`);
							if (__props.errorMessage) _push(`<p class="mission-qr__status mission-qr__status--error" data-v-db194a17${_scopeId}>${ssrInterpolate(__props.errorMessage)}</p>`);
							else _push(`<!---->`);
							_push(`<!--]-->`);
						}
						_push(`</div>`);
					} else return [createVNode("div", { class: "mission-qr" }, [__props.completed ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_UIcon, {
						name: "i-lucide-check-circle-2",
						class: "mission-qr__icon mission-qr__icon--done"
					}), createVNode("p", { class: "mission-qr__text" }, "ผ่านภารกิจสแกน QR แล้ว (+" + toDisplayString(__props.pointsEarned) + " คะแนน)", 1)], 64)) : !__props.isOnline ? (openBlock(), createBlock(Fragment, { key: 1 }, [createVNode(_component_UIcon, {
						name: "i-lucide-wifi-off",
						class: "mission-qr__icon"
					}), createVNode("p", { class: "mission-qr__text" }, " ภารกิจนี้ต้องมีอินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่ ")], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
						createVNode("p", { class: "mission-qr__hint" }, "ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ"),
						createVNode("div", {
							id: QR_ELEMENT_ID,
							class: "mission-qr__camera"
						}),
						unref(scanState) === "starting" ? (openBlock(), createBlock("p", {
							key: 0,
							class: "mission-qr__status"
						}, "กำลังเปิดกล้อง...")) : createCommentVNode("", true),
						__props.verifying ? (openBlock(), createBlock("p", {
							key: 1,
							class: "mission-qr__status"
						}, "กำลังตรวจสอบ QR...")) : createCommentVNode("", true),
						unref(scanState) === "error" ? (openBlock(), createBlock("p", {
							key: 2,
							class: "mission-qr__status mission-qr__status--error"
						}, toDisplayString(unref(cameraError)), 1)) : createCommentVNode("", true),
						__props.errorMessage ? (openBlock(), createBlock("p", {
							key: 3,
							class: "mission-qr__status mission-qr__status--error"
						}, toDisplayString(__props.errorMessage), 1)) : createCommentVNode("", true)
					], 64))])];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "primary",
						onClick: ($event) => emit("close")
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(__props.completed ? "ปิด" : "ปิดหน้าต่างนี้")}`);
							else return [createTextVNode(toDisplayString(__props.completed ? "ปิด" : "ปิดหน้าต่างนี้"), 1)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_UButton, {
						block: "",
						color: "primary",
						onClick: ($event) => emit("close")
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(__props.completed ? "ปิด" : "ปิดหน้าต่างนี้"), 1)]),
						_: 1
					}, 8, ["onClick"])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/station/StationMissionQr.vue
var _sfc_setup$1 = StationMissionQr_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionQr_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionQr.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var StationMissionQr_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StationMissionQr_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-db194a17"]]), { __name: "StationMissionQr" });
//#endregion
//#region pages/station/[stationId].vue?vue&type=script&setup=true&lang.ts
var FINAL_STATION_ID = "milk";
var _stationId__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[stationId]",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* pages/station/[stationId].vue
		* ---------------------------------------------------------------------------
		* [แก้ไข] หน้าเต็ม "ภารกิจฐาน___" — เนื้อหา/คะแนนภารกิจทั้งหมดตอนนี้มาจาก
		* composables/useStationMissions.ts (เรียก server-gas/MissionsService.gs จริง)
		* แล้ว ไม่ใช่ Mock 3 ภารกิจตายตัวเดิม — จำนวน/ชนิดภารกิจไม่ hardcode (ดู
		* types/mission.ts) สิทธิ์เข้าฐาน (canEnterStation/consumeScanAccess) ยังคงอยู่
		* ที่ composables/useStationQuest.ts เหมือนเดิมทุกประการ (คนละความรับผิดชอบ —
		* หน้านี้เรียกทั้งสอง Composable คู่กัน)
		*
		* เข้าได้เฉพาะฐานที่ทำภารกิจครบแล้ว (ดูซ้ำได้เสมอ) หรือฐานที่เพิ่งได้สิทธิ์จาก
		* การสแกน QR ล่าสุด (currentScanStationId ตรงกัน) เท่านั้น — เข้าทางอื่น (พิมพ์
		* URL/Bookmark/Back มาแบบไม่มีสิทธิ์) จะถูกเด้งกลับ /stations ทันทีใน onMounted
		*
		* ทันทีที่เข้าหน้านี้สำเร็จ สิทธิ์จากการสแกนล่าสุดจะถูก "ใช้ไป" ทันที (ดู
		* consumeScanAccess()) — กลับไปหน้า /stations แล้วฐานนี้จะกดเข้าไม่ได้อีกจนกว่า
		* จะสแกน QR ฐานนี้ใหม่ (Progress ที่ทำไปแล้วไม่หายไปไหน แค่ต้องสแกนใหม่ถึงจะ
		* เข้าเล่นต่อได้ — ตามสเปก "ต้อง Scan QR ใหม่ถึงจะกลับเข้า Base ได้")
		*
		* ฐาน "นม" (FINAL_STATION_ID) พิเศษ — แสดงปุ่มใหญ่ [จบเกม] เสมอไม่ว่าทำภารกิจได้
		* กี่ใบก็ตาม (แทนข้อความฉลองทั่วไป — ดู StationMissionList ที่ hideCelebration)
		* ส่วนปุ่ม [เล่นต่อ] โผล่มา "เพิ่ม" เฉพาะตอนทำครบทุกภารกิจแล้วเท่านั้น กด [จบเกม]
		* ไม่ว่า Progress เท่าไหร่ก็ตาม ต้องไม่แตะภารกิจ/คะแนนเลย (ดู markGameCompleted()
		* ใน composables/useStationQuest.ts)
		*/
		definePageMeta({ layout: "app" });
		const { profile, isReady } = useRequireProfile();
		const route = useRoute();
		const VALID_STATION_IDS = [
			"corn",
			"cow",
			"soil",
			"milk"
		];
		/** ฐานสุดท้ายของเส้นทาง — ทำภารกิจครบแล้วเป็นจุดตัดสินใจ จบเกม/เล่นต่อ (เหมือน
		* FINAL_STATION_ID เดิมใน pages/scan.vue แต่ระบบนี้แยกกันคนละ State ทั้งหมด) */
		const rawId = computed(() => String(route.params.stationId ?? ""));
		const stationId = computed(() => VALID_STATION_IDS.includes(rawId.value) ? rawId.value : null);
		const { stations } = useAdventure();
		const stationName = computed(() => {
			if (!stationId.value) return "";
			return stations.value.find((s) => s.id === stationId.value)?.name ?? STATION_TYPE_META[stationId.value].label;
		});
		const { canEnterStation, consumeScanAccess, markGameCompleted } = useStationQuest();
		const { getStationMissions, isStationMissionComplete, loadStationMissions, submitSingleQuestion, submitMultiQuestion, verifyQrMission, loadError: missionsLoadError } = useStationMissions();
		const { getQuestionsForMission, initAnsweredState } = useQuestion();
		const { isOnline, initOfflineSync } = useOfflineSync();
		const { syncNow: syncAnswersNow, initOfflineAnswerSync } = useOfflineAnswerSync();
		const { syncNow: syncMissionAnswersNow, initOfflineMissionAnswerSync } = useOfflineMissionAnswerSync();
		const { isOfflineMode, startRound } = useOfflineMode();
		const { currentRoundId, endCurrentRound } = useRound();
		const { clearAllTimers } = useRoundTimer();
		const canShowContent = ref(false);
		const loadingMissions = ref(false);
		/** ต้อง await ให้สิทธิ์เข้าฐาน (useStationQuest) พร้อมก่อนเสมอ (กันเคส Hard
		* Refresh ตรงหน้านี้เอง) แล้วค่อยโหลดภารกิจจริงจาก Backend ต่อ (useStationMissions)
		* — initOfflineSync/initOfflineAnswerSync/initOfflineMissionAnswerSync ต้องเรียก
		* ก่อนตอบภารกิจใด ๆ เสมอ (โหลดคิว Offline ที่ค้างจาก LocalStorage) */
		/** แยกออกมาให้ปุ่ม "ลองใหม่" (แสดงเมื่อโหลดภารกิจไม่สำเร็จ — เช่น ไม่มีเน็ต/
		* Backend ไม่ตอบสนอง) เรียกซ้ำได้โดยไม่ต้อง Refresh ทั้งหน้า */
		async function loadMissionsForCurrentStation() {
			if (!stationId.value) return;
			loadingMissions.value = true;
			await loadStationMissions(stationId.value, currentRoundId.value, profile.value?.memberId || profile.value?.uid);
			loadingMissions.value = false;
		}
		const missions = computed(() => stationId.value ? getStationMissions(stationId.value) : []);
		const isComplete = computed(() => stationId.value ? isStationMissionComplete(stationId.value) : false);
		const isFinalStation = computed(() => stationId.value === FINAL_STATION_ID);
		const activeMission = ref(null);
		const questionPopupOpen = ref(false);
		const qrPopupOpen = ref(false);
		const activeQuestionResult = ref(null);
		const qrVerifying = ref(false);
		const qrError = ref("");
		const activeQuestions = computed(() => {
			if (!activeMission.value?.questionIds) return [];
			return getQuestionsForMission(activeMission.value.questionIds);
		});
		function openMission(mission) {
			activeMission.value = mission;
			activeQuestionResult.value = mission.completed ? {
				correctCount: 0,
				totalCount: 0,
				totalPoints: mission.pointsEarned
			} : null;
			qrError.value = "";
			if (mission.type === "QR_SCORE") qrPopupOpen.value = true;
			else questionPopupOpen.value = true;
		}
		function closeMissionPopup() {
			questionPopupOpen.value = false;
			qrPopupOpen.value = false;
			activeMission.value = null;
			activeQuestionResult.value = null;
			qrError.value = "";
		}
		function currentCtx() {
			return {
				userId: profile.value?.memberId || profile.value?.uid || "",
				firstName: profile.value?.firstName,
				roundId: currentRoundId.value
			};
		}
		/** ผู้เล่นกดส่งคำตอบใน StationMissionQuestion — ตัดสินบนเครื่องทันที (Offline
		* First ผ่าน useStationMissions().submitSingleQuestion()/submitMultiQuestion())
		* แล้วอัปเดต activeQuestionResult ให้ Popup เปลี่ยนไปแสดงผลลัพธ์เอง มีเน็ตอยู่
		* แล้ว (และไม่ใช่ Offline Mode) ลอง Sync ทันทีแบบไม่บล็อก UI (เหมือนแนวทาง
		* Offline Queue อื่น ๆ ในโปรเจกต์นี้) */
		function handleQuestionSubmit(answers) {
			if (!stationId.value || !activeMission.value) return;
			const ctx = currentCtx();
			if (activeMission.value.type === "SINGLE_QUESTION") {
				const question = activeQuestions.value[0];
				if (!question) return;
				const result = submitSingleQuestion(stationId.value, activeMission.value, question, answers[0]?.answer ?? "", ctx);
				activeQuestionResult.value = {
					correctCount: result.isCorrect ? 1 : 0,
					totalCount: 1,
					totalPoints: result.pointsEarned
				};
				if (!isOfflineMode.value && isOnline.value && ctx.userId) syncAnswersNow(ctx.userId, ctx.firstName);
			} else {
				const result = submitMultiQuestion(stationId.value, activeMission.value, answers, ctx);
				activeQuestionResult.value = {
					correctCount: result.correctCount,
					totalCount: result.totalCount,
					totalPoints: result.totalPoints
				};
				if (!isOfflineMode.value && isOnline.value) syncMissionAnswersNow();
			}
		}
		/** ผู้เล่นสแกน QR ของภารกิจสำเร็จ (StationMissionQr ส่ง qrToken มาให้) — ต้อง
		* ออนไลน์เสมอ (ไม่มี Offline Fallback) ยิงไม่สำเร็จ (QR ผิด/ของฐานอื่น/หมดเน็ต)
		* -> แสดง error ให้สแกนใหม่ได้ ไม่ถือว่าสำเร็จ/ได้คะแนนก่อนได้รับคำตอบจริง */
		async function handleQrScanned(qrToken) {
			if (!stationId.value || !activeMission.value || !currentRoundId.value) {
				qrError.value = "กรุณากดปุ่ม GO ที่หน้าหลักก่อนเริ่มเล่นครับ";
				return;
			}
			qrVerifying.value = true;
			qrError.value = "";
			try {
				const result = await verifyQrMission(stationId.value, activeMission.value, qrToken, {
					...currentCtx(),
					roundId: currentRoundId.value
				});
				if (!result.success) {
					qrError.value = result.error || "QR ภารกิจนี้ไม่ถูกต้อง กรุณาลองใหม่";
					return;
				}
				activeMission.value = {
					...activeMission.value,
					completed: true,
					pointsEarned: result.pointsEarned
				};
			} finally {
				qrVerifying.value = false;
			}
		}
		/** ปุ่ม "เล่นต่อ" — เริ่ม Round ใหม่โดยใช้ Round Flow เดิมของระบบทั้งหมด (ไม่
		* ประดิษฐ์ Logic เปิดรอบเอง): จบ Round เดิม (Online) หรือเริ่ม Round Data ใหม่
		* (Offline) เหมือน pages/round-summary.vue::confirmAndGoHome() ทุกประการ แล้ว
		* เคลียร์ Timer เดิม ก่อนพาไปหน้า /starting เดิม (เปิดรอบใหม่ + เริ่ม Timer ใหม่
		* + พาไป /home ให้อัตโนมัติ) — Progress ของ useStationMissions.ts รีเซ็ตเอง
		* อัตโนมัติทันทีที่ roundId เปลี่ยน ไม่ต้องรีเซ็ตเองที่นี่ */
		const isStartingNewRound = ref(false);
		async function handlePlayAgain() {
			if (isStartingNewRound.value) return;
			isStartingNewRound.value = true;
			try {
				if (isOfflineMode.value) startRound(profile.value?.uid ?? "");
				else if (profile.value?.memberId) await endCurrentRound(profile.value.memberId);
				clearAllTimers();
				await navigateTo("/starting");
			} finally {
				isStartingNewRound.value = false;
			}
		}
		/** ปุ่ม "จบเกม" — กดได้ไม่ว่าทำภารกิจได้กี่ใบก็ตาม เปลี่ยนแค่ gameCompleted เป็น
		* true เท่านั้น (ดู markGameCompleted()) ไม่แตะภารกิจ/คะแนนเด็ดขาด แล้วพาไปหน้า
		* แบบประเมินเสมอ (ไม่จบรอบ/ไม่เขียนอะไรอื่นที่นี่ — ดู pages/evaluation.vue ที่
		* เป็นคนจบ Round จริงหลังส่งแบบประเมินแล้วเท่านั้น) */
		function handleEndGame() {
			markGameCompleted();
			navigateTo("/evaluation");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-8dfe83d1>`);
			_push(ssrRenderComponent(_component_PageHeader, {
				title: unref(stationId) ? `ภารกิจ${unref(stationName)}` : "ภารกิจฐาน",
				"back-to": "/stations"
			}, null, _parent));
			if (!unref(isReady) || !unref(canShowContent)) {
				_push(`<div class="page__loading" data-v-8dfe83d1>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="page__content" data-v-8dfe83d1>`);
				if (unref(loadingMissions) && unref(missions).length === 0) {
					_push(`<div class="page__loading" data-v-8dfe83d1>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-loader-2",
						class: "page__spinner"
					}, null, _parent));
					_push(`</div>`);
				} else if (unref(missionsLoadError) && unref(missions).length === 0) {
					_push(`<div class="mission-error" data-v-8dfe83d1><p class="mission-error__text" data-v-8dfe83d1>${ssrInterpolate(unref(missionsLoadError))}</p>`);
					_push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "neutral",
						variant: "soft",
						icon: "i-lucide-rotate-cw",
						onClick: loadMissionsForCurrentStation
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` ลองใหม่ `);
							else return [createTextVNode(" ลองใหม่ ")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(ssrRenderComponent(StationMissionList_default, {
					missions: unref(missions),
					"hide-celebration": unref(isFinalStation),
					onOpenMission: openMission
				}, null, _parent));
				if (unref(isFinalStation)) {
					_push(`<div class="endgame-cta" data-v-8dfe83d1><p class="endgame-cta__title" data-v-8dfe83d1>${ssrInterpolate(unref(isComplete) ? "ทำภารกิจฐานนมครบแล้ว!" : "ต้องการจบเกมตอนนี้เลยหรือไม่?")}</p>`);
					_push(ssrRenderComponent(_component_UButton, {
						block: "",
						size: "xl",
						color: "neutral",
						variant: "soft",
						disabled: unref(isStartingNewRound),
						onClick: handleEndGame
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` จบเกม `);
							else return [createTextVNode(" จบเกม ")];
						}),
						_: 1
					}, _parent));
					if (unref(isComplete)) _push(ssrRenderComponent(_component_UButton, {
						block: "",
						size: "xl",
						color: "primary",
						loading: unref(isStartingNewRound),
						disabled: unref(isStartingNewRound),
						onClick: handlePlayAgain
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` เล่นต่อ `);
							else return [createTextVNode(" เล่นต่อ ")];
						}),
						_: 1
					}, _parent));
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			}
			if (unref(activeMission) && unref(activeMission).type !== "QR_SCORE") _push(ssrRenderComponent(StationMissionQuestion_default, {
				open: unref(questionPopupOpen),
				"onUpdate:open": ($event) => isRef(questionPopupOpen) ? questionPopupOpen.value = $event : null,
				questions: unref(activeQuestions),
				result: unref(activeQuestionResult),
				onSubmit: handleQuestionSubmit,
				onClose: closeMissionPopup
			}, null, _parent));
			else _push(`<!---->`);
			if (unref(activeMission) && unref(activeMission).type === "QR_SCORE") _push(ssrRenderComponent(StationMissionQr_default, {
				open: unref(qrPopupOpen),
				"onUpdate:open": ($event) => isRef(qrPopupOpen) ? qrPopupOpen.value = $event : null,
				completed: unref(activeMission).completed,
				"points-earned": unref(activeMission).pointsEarned,
				"is-online": unref(isOnline),
				verifying: unref(qrVerifying),
				"error-message": unref(qrError),
				onScanned: handleQrScanned,
				onClose: closeMissionPopup
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/station/[stationId].vue
var _sfc_setup = _stationId__vue_vue_type_script_setup_true_lang_default.setup;
_stationId__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/station/[stationId].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _stationId__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_stationId__vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8dfe83d1"]]);
//#endregion
export { _stationId__default as default };

//# sourceMappingURL=_stationId_-DXcUs4Mk.js.map