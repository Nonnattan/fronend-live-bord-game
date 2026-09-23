import { _ as _sfc_main } from './FormField-B0YOn4C3.mjs';
import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$1 } from './Input-D4Sia_6G.mjs';
import { u as useReward } from './useReward-ig_NYST5.mjs';
import { defineComponent, ref, mergeProps, withCtx, isRef, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import './useForwardExpose-lTVrimVg.mjs';
import '@vueuse/core';
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
import '@iconify/utils/lib/css/icon';
import 'tailwind-variants';

//#region pages/redeem.vue?vue&type=script&setup=true&lang.ts
var redeem_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "redeem",
	__ssrInlineRender: true,
	setup(__props) {
		const { confirmClaim, status, isChecking, isClaiming, error } = useReward();
		const roundIdInput = ref("");
		const userIdInput = ref("");
		const displayNameInput = ref("");
		const searched = ref(false);
		function formatDateTime(value) {
			if (!value) return "-";
			const date = new Date(value.replace(" ", "T"));
			if (Number.isNaN(date.getTime())) return value;
			return date.toLocaleString("th-TH", {
				dateStyle: "medium",
				timeStyle: "short"
			});
		}
		async function handleClaim() {
			const roundId = roundIdInput.value.trim();
			const userId = userIdInput.value.trim();
			if (!roundId || !userId) return;
			await confirmClaim(roundId, userId, displayNameInput.value.trim());
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			const _component_UFormField = _sfc_main;
			const _component_UInput = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-f5a90402><div class="page__header" data-v-f5a90402>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-gift",
				class: "page__header-icon"
			}, null, _parent));
			_push(`<h1 class="page__title" data-v-f5a90402>จุดแลกรางวัล</h1><p class="page__subtitle" data-v-f5a90402>สำหรับเจ้าหน้าที่ — กรอกรหัสรอบ/รหัสลูกค้าจากหน้าจอผู้เล่น</p></div><div class="page__content" data-v-f5a90402><form class="search-form" data-v-f5a90402>`);
			_push(ssrRenderComponent(_component_UFormField, { label: "รหัสรอบ (roundId)" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UInput, {
						modelValue: unref(roundIdInput),
						"onUpdate:modelValue": ($event) => isRef(roundIdInput) ? roundIdInput.value = $event : null,
						placeholder: "เช่น 3f2a1b9c-...",
						size: "lg"
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UInput, {
						modelValue: unref(roundIdInput),
						"onUpdate:modelValue": ($event) => isRef(roundIdInput) ? roundIdInput.value = $event : null,
						placeholder: "เช่น 3f2a1b9c-...",
						size: "lg"
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UFormField, { label: "รหัสลูกค้า (userId)" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UInput, {
						modelValue: unref(userIdInput),
						"onUpdate:modelValue": ($event) => isRef(userIdInput) ? userIdInput.value = $event : null,
						placeholder: "เช่น M-XXXXXXXX",
						size: "lg"
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UInput, {
						modelValue: unref(userIdInput),
						"onUpdate:modelValue": ($event) => isRef(userIdInput) ? userIdInput.value = $event : null,
						placeholder: "เช่น M-XXXXXXXX",
						size: "lg"
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UFormField, { label: "ชื่อผู้เล่น (ไม่บังคับ — ไว้บันทึกอ้างอิง)" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UInput, {
						modelValue: unref(displayNameInput),
						"onUpdate:modelValue": ($event) => isRef(displayNameInput) ? displayNameInput.value = $event : null,
						placeholder: "ชื่อ-นามสกุล",
						size: "lg"
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UInput, {
						modelValue: unref(displayNameInput),
						"onUpdate:modelValue": ($event) => isRef(displayNameInput) ? displayNameInput.value = $event : null,
						placeholder: "ชื่อ-นามสกุล",
						size: "lg"
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				type: "submit",
				block: "",
				size: "lg",
				color: "primary",
				loading: unref(isChecking)
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` ค้นหา `);
					else return [createTextVNode(" ค้นหา ")];
				}),
				_: 1
			}, _parent));
			_push(`</form>`);
			if (unref(error)) _push(`<p class="page__error" data-v-f5a90402>${ssrInterpolate(unref(error))}</p>`);
			else _push(`<!---->`);
			if (unref(searched) && unref(status) && !unref(error)) {
				_push(`<div class="result-card" data-v-f5a90402>`);
				if (!unref(status).reward) {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-frown",
						class: "result-card__icon"
					}, null, _parent));
					_push(`<p class="result-card__title" data-v-f5a90402>ยังไม่ถึงเกณฑ์รับรางวัล</p><!--]-->`);
				} else {
					_push(`<!--[--><p class="result-card__user" data-v-f5a90402>${ssrInterpolate(unref(userIdInput))}</p><p class="result-card__reward" data-v-f5a90402>${ssrInterpolate(unref(status).reward.name)}</p>`);
					if (unref(status).alreadyClaimed) {
						_push(`<p class="result-card__claimed" data-v-f5a90402>`);
						_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-check-circle-2" }, null, _parent));
						_push(` รับแล้ว ${ssrInterpolate(formatDateTime(unref(status).claimedAt))}</p>`);
					} else _push(ssrRenderComponent(_component_UButton, {
						size: "xl",
						color: "primary",
						loading: unref(isClaiming),
						onClick: handleClaim
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` ยืนยันรับรางวัล `);
							else return [createTextVNode(" ยืนยันรับรางวัล ")];
						}),
						_: 1
					}, _parent));
					_push(`<!--]-->`);
				}
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region pages/redeem.vue
var _sfc_setup = redeem_vue_vue_type_script_setup_true_lang_default.setup;
redeem_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/redeem.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var redeem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(redeem_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f5a90402"]]);

export { redeem_default as default };
//# sourceMappingURL=redeem-DPqWW6T0.mjs.map
