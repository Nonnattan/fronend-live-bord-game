import { _ as _plugin_vue_export_helper_default, u as useRoute, b as _sfc_main$7, n as navigateTo, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { u as usePhotoQuest } from './usePhotoQuest-CBaHJuZ3.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
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
import 'vue-router';
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
import './useProfile-Di4CdYil.mjs';
import 'zod';

//#region components/photo-quest/CameraCapture.vue?vue&type=script&setup=true&lang.ts
var CameraCapture_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "CameraCapture",
	__ssrInlineRender: true,
	emits: ["capture"],
	setup(__props, { expose: __expose, emit: __emit }) {
		/**
		* components/photo-quest/CameraCapture.vue
		* ---------------------------------------------------------------------------
		* เปิดกล้องเพื่อ "ถ่ายรูป" (ไม่ใช่ QR Scanner) — ใช้ getUserMedia ตรง ๆ ผ่าน
		* <video>/<canvas> เท่านั้น ไม่ใช้ html5-qrcode (ไลบรารีนั้นออกแบบมาสำหรับอ่าน
		* QR โดยเฉพาะ ไม่เหมาะกับงานถ่ายรูปทั่วไป) — เป็น component แยกอิสระจาก
		* pages/scan.vue โดยสมบูรณ์ คนละ <video> instance คนละ lifecycle ไม่แชร์
		* state ใด ๆ กันเลย ตามสถาปัตยกรรมที่ตกลงกันไว้
		*/
		const state = ref("idle");
		const errorMessage = ref("");
		const videoEl = ref(null);
		const canvasEl = ref(null);
		let stream = null;
		const emit = __emit;
		async function startCamera() {
			state.value = "starting";
			errorMessage.value = "";
			try {
				stream = await (void 0).mediaDevices.getUserMedia({
					video: { facingMode: { ideal: "environment" } },
					audio: false
				});
				if (videoEl.value) {
					videoEl.value.srcObject = stream;
					await videoEl.value.play();
				}
				state.value = "running";
			} catch (err) {
				state.value = "error";
				errorMessage.value = err instanceof Error ? err.message : "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง";
			}
		}
		function stopCamera() {
			stream?.getTracks().forEach((track) => track.stop());
			stream = null;
			if (videoEl.value) videoEl.value.srcObject = null;
			state.value = "idle";
		}
		/** ถ่ายเฟรมปัจจุบันจาก <video> ลง <canvas> แล้วแปลงเป็น HTMLImageElement ส่งออก
		* ให้หน้าเรียกใช้ (pages/photo-quest/[id].vue) ส่งต่อเข้า Detection Engine */
		function capturePhoto() {
			if (!videoEl.value || !canvasEl.value || state.value !== "running") return;
			const video = videoEl.value;
			const canvas = canvasEl.value;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL("image/jpeg", .9);
			const img = new Image();
			img.onload = () => emit("capture", img);
			img.src = dataUrl;
		}
		__expose({
			startCamera,
			stopCamera,
			capturePhoto
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$2;
			const _component_UIcon = _sfc_main$7;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "camera-capture" }, _attrs))} data-v-a3794553>`);
			if (unref(state) === "idle") {
				_push(`<div class="camera-capture__prompt" data-v-a3794553>`);
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-camera",
					size: "lg",
					onClick: startCamera
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`เปิดกล้องเพื่อถ่ายรูป`);
						else return [createTextVNode("เปิดกล้องเพื่อถ่ายรูป")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else if (unref(state) === "starting") {
				_push(`<div class="camera-capture__status" data-v-a3794553>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "camera-capture__spinner"
				}, null, _parent));
				_push(`<p data-v-a3794553>กำลังเปิดกล้อง...</p></div>`);
			} else if (unref(state) === "error") {
				_push(`<div class="camera-capture__status camera-capture__status--error" data-v-a3794553>`);
				_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-camera-off" }, null, _parent));
				_push(`<p data-v-a3794553>${ssrInterpolate(unref(errorMessage))}</p>`);
				_push(ssrRenderComponent(_component_UButton, {
					variant: "outline",
					onClick: startCamera
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`ลองอีกครั้ง`);
						else return [createTextVNode("ลองอีกครั้ง")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`<div class="camera-capture__viewport" style="${ssrRenderStyle(unref(state) === "running" ? null : { display: "none" })}" data-v-a3794553><video class="camera-capture__video" playsinline muted data-v-a3794553></video><button type="button" class="camera-capture__shutter" aria-label="ถ่ายรูป" data-v-a3794553><span class="camera-capture__shutter-inner" data-v-a3794553></span></button></div><canvas class="camera-capture__canvas-hidden" data-v-a3794553></canvas></div>`);
		};
	}
});
//#endregion
//#region components/photo-quest/CameraCapture.vue
var _sfc_setup$2 = CameraCapture_vue_vue_type_script_setup_true_lang_default.setup;
CameraCapture_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-quest/CameraCapture.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var CameraCapture_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(CameraCapture_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a3794553"]]), { __name: "PhotoQuestCameraCapture" });
//#endregion
//#region components/photo-quest/ResultFeedback.vue?vue&type=script&setup=true&lang.ts
var ResultFeedback_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ResultFeedback",
	__ssrInlineRender: true,
	props: {
		result: {},
		points: {}
	},
	emits: ["retry", "done"],
	setup(__props, { emit: __emit }) {
		/**
		* components/photo-quest/ResultFeedback.vue
		* ---------------------------------------------------------------------------
		* แสดงผลลัพธ์หลัง Detection Engine ตรวจภาพเสร็จ 1 ครั้ง — ผ่าน -> แสดงคะแนน +
		* ปุ่มกลับไปหน้ารายการเควส, ไม่ผ่าน -> แสดงเหตุผล + ปุ่มถ่ายใหม่ ตามสเปกข้อ
		* "ถ้าไม่ผ่าน → แจ้งเหตุผลและให้ถ่ายใหม่"
		*/
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["result-feedback", __props.result.passed ? "result-feedback--pass" : "result-feedback--fail"] }, _attrs))} data-v-5c567f9f>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: __props.result.passed ? "i-lucide-party-popper" : "i-lucide-circle-x",
				class: "result-feedback__icon"
			}, null, _parent));
			_push(`<p class="result-feedback__title" data-v-5c567f9f>${ssrInterpolate(__props.result.passed ? "เควสสำเร็จ!" : "ยังไม่ผ่านเงื่อนไข")}</p>`);
			if (__props.result.passed) _push(`<p class="result-feedback__points" data-v-5c567f9f>+${ssrInterpolate(__props.points)} คะแนน</p>`);
			else _push(`<!---->`);
			if (__props.result.reason) _push(`<p class="result-feedback__reason" data-v-5c567f9f>${ssrInterpolate(__props.result.reason)}</p>`);
			else _push(`<!---->`);
			if (__props.result.passed) _push(ssrRenderComponent(_component_UButton, {
				size: "lg",
				onClick: ($event) => emit("done")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`กลับไปหน้าเควส`);
					else return [createTextVNode("กลับไปหน้าเควส")];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(_component_UButton, {
				size: "lg",
				variant: "outline",
				onClick: ($event) => emit("retry")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`ถ่ายใหม่`);
					else return [createTextVNode("ถ่ายใหม่")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/photo-quest/ResultFeedback.vue
var _sfc_setup$1 = ResultFeedback_vue_vue_type_script_setup_true_lang_default.setup;
ResultFeedback_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-quest/ResultFeedback.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ResultFeedback_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(ResultFeedback_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5c567f9f"]]), { __name: "PhotoQuestResultFeedback" });
//#endregion
//#region pages/photo-quest/[id].vue?vue&type=script&setup=true&lang.ts
var _id__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[id]",
	__ssrInlineRender: true,
	setup(__props) {
		const { isReady } = useRequireProfile();
		const questId = useRoute().params.id;
		const { findQuest, attemptQuest, isCompleted } = usePhotoQuest();
		const isChecking = ref(false);
		const result = ref(null);
		const cameraRef = ref(null);
		const quest = computed(() => findQuest(questId));
		const alreadyCompleted = computed(() => quest.value ? isCompleted(quest.value.id) : false);
		async function handleCapture(image) {
			if (!quest.value) return;
			isChecking.value = true;
			result.value = null;
			try {
				result.value = await attemptQuest(quest.value, image);
			} finally {
				isChecking.value = false;
			}
		}
		function retry() {
			result.value = null;
			cameraRef.value?.startCamera();
		}
		function done() {
			navigateTo("/photo-quest");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			if (unref(isReady)) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-quest-detail" }, _attrs))} data-v-7c585574>`);
				_push(ssrRenderComponent(_component_PageHeader, {
					title: unref(quest)?.name ?? "เควสถ่ายรูป",
					"back-to": "/photo-quest"
				}, null, _parent));
				if (!unref(quest)) _push(`<div class="photo-quest-detail__missing" data-v-7c585574>ไม่พบเควสนี้</div>`);
				else {
					_push(`<div class="photo-quest-detail__content" data-v-7c585574><p class="photo-quest-detail__desc" data-v-7c585574>${ssrInterpolate(unref(quest).description)}</p>`);
					if (unref(quest).exampleImageUrl) _push(`<img${ssrRenderAttr("src", unref(quest).exampleImageUrl)} alt="ตัวอย่างภาพที่ต้องถ่าย" class="photo-quest-detail__example" data-v-7c585574>`);
					else _push(`<!---->`);
					if (unref(alreadyCompleted) && !unref(result)) {
						_push(`<div class="photo-quest-detail__done" data-v-7c585574>`);
						_push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-check-circle-2",
							class: "photo-quest-detail__done-icon"
						}, null, _parent));
						_push(`<p data-v-7c585574>ทำเควสนี้สำเร็จแล้ว</p></div>`);
					} else if (!unref(result)) {
						_push(`<!--[-->`);
						if (unref(isChecking)) {
							_push(`<div class="photo-quest-detail__checking" data-v-7c585574>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-loader-2",
								class: "photo-quest-detail__spinner"
							}, null, _parent));
							_push(`<p data-v-7c585574>กำลังตรวจสอบภาพ...</p></div>`);
						} else _push(ssrRenderComponent(CameraCapture_default, {
							ref_key: "cameraRef",
							ref: cameraRef,
							onCapture: handleCapture
						}, null, _parent));
						_push(`<!--]-->`);
					} else _push(ssrRenderComponent(ResultFeedback_default, {
						result: unref(result),
						points: unref(quest).points,
						onRetry: retry,
						onDone: done
					}, null, _parent));
					_push(`</div>`);
				}
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region pages/photo-quest/[id].vue
var _sfc_setup = _id__vue_vue_type_script_setup_true_lang_default.setup;
_id__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/photo-quest/[id].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_id__vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7c585574"]]);

export { _id__default as default };
//# sourceMappingURL=_id_-Bs2JEOFj.mjs.map
