import { _ as _plugin_vue_export_helper_default, a as useOfflineMode } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-Dx2_uv0V.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { u as useRound } from './useRound-Vyr0MdjD.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
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

//#region pages/starting.vue?vue&type=script&setup=true&lang.ts
var starting_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "starting",
	__ssrInlineRender: true,
	setup(__props) {
		useRequireProfile();
		useRound();
		useOfflineMode();
		useRoundTimer();
		const GO_LOADING_ICONS = [
			"🌽",
			"🐄",
			"🌱",
			"🥛"
		];
		const GO_LOADING_MESSAGES = [
			"กำลังเปิดประตูฟาร์ม...",
			"กำลังปลุกวัวให้ตื่น...",
			"กำลังเตรียมฐานผจญภัยทั้ง 4 จุด...",
			"กำลังนับเวลาถอยหลัง 2 ชั่วโมง..."
		];
		const loadingMessageIndex = ref(0);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "starting" }, _attrs))} data-v-b4caee1f><div class="starting__sky" data-v-b4caee1f><span class="starting__cloud starting__cloud--1" data-v-b4caee1f>☁️</span><span class="starting__cloud starting__cloud--2" data-v-b4caee1f>☁️</span><span class="starting__cloud starting__cloud--3" data-v-b4caee1f>☁️</span><span class="starting__sun" data-v-b4caee1f>☀️</span></div><div class="starting__content" data-v-b4caee1f><div class="starting__icons" data-v-b4caee1f><!--[-->`);
			ssrRenderList(GO_LOADING_ICONS, (icon, i) => {
				_push(`<span class="starting__icon" style="${ssrRenderStyle({ animationDelay: `${i * .15}s` })}" data-v-b4caee1f>${ssrInterpolate(icon)}</span>`);
			});
			_push(`<!--]--></div><p class="starting__title" data-v-b4caee1f>กำลังเปิดรอบผจญภัย...</p><p class="starting__message" data-v-b4caee1f>${ssrInterpolate(GO_LOADING_MESSAGES[unref(loadingMessageIndex)])}</p><div class="starting__bar" data-v-b4caee1f><div class="starting__bar-fill" data-v-b4caee1f></div></div></div><div class="starting__ground" data-v-b4caee1f></div></div>`);
		};
	}
});
//#endregion
//#region pages/starting.vue
var _sfc_setup = starting_vue_vue_type_script_setup_true_lang_default.setup;
starting_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/starting.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var starting_default = /*#__PURE__*/ _plugin_vue_export_helper_default(starting_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b4caee1f"]]);

export { starting_default as default };
//# sourceMappingURL=starting-3SIngOdn.mjs.map
