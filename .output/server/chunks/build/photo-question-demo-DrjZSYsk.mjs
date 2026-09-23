import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useOfflineSync } from './useOfflineSync-D8-RD8DK.mjs';
import { defineComponent, ref, mergeProps, unref, computed, resolveComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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
import './useRound-Vyr0MdjD.mjs';

//#region components/photo-question/PhotoQuestion.vue?vue&type=script&setup=true&lang.ts
var PhotoQuestion_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PhotoQuestion",
	__ssrInlineRender: true,
	props: {
		questionId: {},
		question: {},
		points: {},
		config: { default: () => ({}) }
	},
	emits: ["confirmed"],
	setup(__props, { emit: __emit }) {
		/**
		* components/photo-question/PhotoQuestion.vue
		* ---------------------------------------------------------------------------
		* Component หลักของระบบ "Photo Question" — รับคำถามที่ answerType === 'photo'
		* แล้วพา flow ทั้งหมด: idle (แสดงคำถาม) -> camera (เปิดกล้อง) -> preview
		* (ตรวจสอบรูป) -> confirmed (ยืนยันแล้ว) รวมถึง error state ระหว่างทาง
		*
		* Phase นี้ทำแค่ UI/Flow การถ่ายรูปเท่านั้น — "ยังไม่ต้องตรวจว่ารูปถูกหรือผิด"
		* ไม่มี AI Detection / ไม่ Train Model / ไม่เรียก AI API ใด ๆ ในไฟล์นี้
		*
		* เป็น component แยกอิสระจากระบบ Photo Quest เดิม (components/photo-quest/*)
		* โดยสมบูรณ์ — ไม่แชร์ state/logic กัน คนละ concept กัน:
		*   - photo-quest (เดิม)  = เควสถ่ายรูปแบบมีหน้าของตัวเอง + AI detection ทันที
		*   - photo-question (ใหม่, ไฟล์นี้) = คำถามชนิดหนึ่งภายในระบบ Question/Station
		*     (answerType: 'photo') ที่ยัง "ไม่" ตรวจอะไรทั้งสิ้นใน Phase นี้ — แค่เก็บ
		*     รูปที่ยืนยันแล้วไว้ใน State เตรียมส่งต่อให้ Detection Engine ใน Phase ถัดไป
		*
		* การเชื่อมกับระบบ Station/Question จริงจะทำใน Phase ถัดไป (ตอนนี้เป็น mockup —
		* ดู pages/photo-question-demo.vue สำหรับตัวอย่างการใช้งาน/ทดสอบบนมือถือ)
		*/
		const props = __props;
		const emit = __emit;
		const state = ref("idle");
		const capturedPhoto = ref(null);
		const cameraErrorMessage = ref("");
		const { isOnline } = useOfflineSync();
		const allowRetakeAfterConfirm = computed(() => props.config?.allowRetakeAfterConfirm ?? true);
		function openCamera() {
			cameraErrorMessage.value = "";
			state.value = "camera";
		}
		function handleCapture(photoDataUrl) {
			capturedPhoto.value = photoDataUrl;
			state.value = "preview";
		}
		function handleCameraCancel() {
			state.value = "idle";
		}
		function handleRetake() {
			capturedPhoto.value = null;
			state.value = "camera";
		}
		function handleConfirm() {
			if (!capturedPhoto.value) return;
			state.value = "confirmed";
			emit("confirmed", {
				questionId: props.questionId,
				photoDataUrl: capturedPhoto.value,
				capturedAt: Date.now()
			});
		}
		function handleRetakeAfterConfirm() {
			capturedPhoto.value = null;
			state.value = "camera";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			const _component_UButton = _sfc_main$2;
			const _component_PhotoCamera = resolveComponent("PhotoCamera");
			const _component_PhotoPreview = resolveComponent("PhotoPreview");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-question" }, _attrs))} data-v-06e921d9>`);
			if (unref(state) === "idle") {
				_push(`<div class="photo-question__idle" data-v-06e921d9><p class="photo-question__question" data-v-06e921d9>${ssrInterpolate(__props.question)}</p>`);
				if (__props.config?.hint) _push(`<p class="photo-question__hint" data-v-06e921d9>${ssrInterpolate(__props.config.hint)}</p>`);
				else _push(`<!---->`);
				if (!unref(isOnline)) {
					_push(`<p class="photo-question__offline-note" data-v-06e921d9>`);
					_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-wifi-off" }, null, _parent));
					_push(` ออฟไลน์อยู่ — ถ่ายรูปได้ตามปกติ ระบบจะเก็บไว้ก่อน </p>`);
				} else _push(`<!---->`);
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-camera",
					size: "xl",
					onClick: openCamera
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` 📷 ถ่ายรูป `);
						else return [createTextVNode(" 📷 ถ่ายรูป ")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else if (unref(state) === "camera") {
				_push(`<div class="photo-question__camera" data-v-06e921d9>`);
				_push(ssrRenderComponent(_component_PhotoCamera, {
					onCapture: handleCapture,
					onCancel: handleCameraCancel
				}, null, _parent));
				_push(`</div>`);
			} else if (unref(state) === "preview" && unref(capturedPhoto)) {
				_push(`<div class="photo-question__preview" data-v-06e921d9>`);
				_push(ssrRenderComponent(_component_PhotoPreview, {
					"photo-data-url": unref(capturedPhoto),
					onRetake: handleRetake,
					onConfirm: handleConfirm
				}, null, _parent));
				_push(`</div>`);
			} else if (unref(state) === "confirmed") {
				_push(`<div class="photo-question__confirmed" data-v-06e921d9>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-check-circle-2",
					class: "photo-question__confirmed-icon"
				}, null, _parent));
				_push(`<p class="photo-question__confirmed-title" data-v-06e921d9>ถ่ายรูปแล้ว</p><p class="photo-question__confirmed-note" data-v-06e921d9>รอตรวจสอบในขั้นตอนถัดไป</p>`);
				if (unref(capturedPhoto)) _push(`<img${ssrRenderAttr("src", unref(capturedPhoto))} alt="รูปที่ยืนยันแล้ว" class="photo-question__confirmed-thumb" data-v-06e921d9>`);
				else _push(`<!---->`);
				if (unref(allowRetakeAfterConfirm)) _push(ssrRenderComponent(_component_UButton, {
					variant: "outline",
					size: "sm",
					onClick: handleRetakeAfterConfirm
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` ถ่ายใหม่อีกครั้ง `);
						else return [createTextVNode(" ถ่ายใหม่อีกครั้ง ")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</div>`);
			} else if (unref(state) === "error") {
				_push(`<div class="photo-question__error" data-v-06e921d9>`);
				_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-triangle-alert" }, null, _parent));
				_push(`<p data-v-06e921d9>${ssrInterpolate(unref(cameraErrorMessage) || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")}</p>`);
				_push(ssrRenderComponent(_component_UButton, {
					variant: "outline",
					onClick: ($event) => state.value = "idle"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`กลับ`);
						else return [createTextVNode("กลับ")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/photo-question/PhotoQuestion.vue
var _sfc_setup$1 = PhotoQuestion_vue_vue_type_script_setup_true_lang_default.setup;
PhotoQuestion_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-question/PhotoQuestion.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PhotoQuestion_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(PhotoQuestion_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-06e921d9"]]), { __name: "PhotoQuestion" });
//#endregion
//#region pages/photo-question-demo.vue?vue&type=script&setup=true&lang.ts
var photo_question_demo_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "photo-question-demo",
	__ssrInlineRender: true,
	setup(__props) {
		const mockQuestion = {
			questionId: "demo-photo-q-1",
			question: "ถ่ายรูปสัตว์เลี้ยงในฟาร์มที่คุณเห็น ณ ฐานนี้",
			points: 50,
			config: { hint: "ถ่ายให้เห็นสัตว์ชัดเจนในกรอบภาพ" }
		};
		const lastConfirmed = ref(null);
		function handleConfirmed(payload) {
			lastConfirmed.value = payload;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-question-demo" }, _attrs))} data-v-56a1c440>`);
			_push(ssrRenderComponent(_component_PageHeader, {
				title: "ทดสอบ Photo Question",
				"back-to": "/home"
			}, null, _parent));
			_push(`<div class="photo-question-demo__content" data-v-56a1c440><p class="photo-question-demo__badge" data-v-56a1c440>🧪 หน้าทดสอบ — Phase 1 (UI/Flow เท่านั้น ยังไม่มี AI Detection)</p><div class="photo-question-demo__card" data-v-56a1c440>`);
			_push(ssrRenderComponent(PhotoQuestion_default, {
				"question-id": mockQuestion.questionId,
				question: mockQuestion.question,
				points: mockQuestion.points,
				config: mockQuestion.config,
				onConfirmed: handleConfirmed
			}, null, _parent));
			_push(`</div>`);
			if (unref(lastConfirmed)) _push(`<div class="photo-question-demo__debug" data-v-56a1c440><p class="photo-question-demo__debug-title" data-v-56a1c440>Payload ที่ emit ออกมา (สำหรับ Phase ถัดไป):</p><pre data-v-56a1c440>${ssrInterpolate(JSON.stringify({
				questionId: unref(lastConfirmed).questionId,
				capturedAt: unref(lastConfirmed).capturedAt
			}, null, 2))}</pre></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region pages/photo-question-demo.vue
var _sfc_setup = photo_question_demo_vue_vue_type_script_setup_true_lang_default.setup;
photo_question_demo_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/photo-question-demo.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var photo_question_demo_default = /*#__PURE__*/ _plugin_vue_export_helper_default(photo_question_demo_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-56a1c440"]]);

export { photo_question_demo_default as default };
//# sourceMappingURL=photo-question-demo-DrjZSYsk.mjs.map
