import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

//#region pages/history.vue?vue&type=script&setup=true&lang.ts
var history_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "history",
	__ssrInlineRender: true,
	setup(__props) {
		const { profile, isReady } = useRequireProfile();
		const { isOfflineMode } = useOfflineMode();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-1837476b>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "History" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-1837476b>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="page__content" data-v-1837476b><div class="summary-card" data-v-1837476b><div class="summary-card__item" data-v-1837476b><span class="summary-card__value" data-v-1837476b>${ssrInterpolate(unref(profile)?.totalVisit ?? 0)}</span><span class="summary-card__label" data-v-1837476b>ครั้งที่เข้าใช้บริการทั้งหมด</span></div>`);
				if (!unref(isOfflineMode)) _push(`<div class="summary-card__item" data-v-1837476b><span class="summary-card__value" data-v-1837476b>${ssrInterpolate(unref(profile)?.point ?? 0)}</span><span class="summary-card__label" data-v-1837476b>คะแนนสะสมปัจจุบัน</span></div>`);
				else _push(`<!---->`);
				_push(`</div><div class="timeline" data-v-1837476b>`);
				if (unref(profile)?.registerDate) {
					_push(`<div class="timeline__item" data-v-1837476b>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-user-round-plus",
						class: "timeline__icon"
					}, null, _parent));
					_push(`<div data-v-1837476b><p class="timeline__title" data-v-1837476b>สมัครสมาชิก</p><p class="timeline__date" data-v-1837476b>${ssrInterpolate(new Date(unref(profile).registerDate).toLocaleString("th-TH"))}</p></div></div>`);
				} else _push(`<!---->`);
				if (unref(profile)?.lastLogin) {
					_push(`<div class="timeline__item" data-v-1837476b>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-log-in",
						class: "timeline__icon"
					}, null, _parent));
					_push(`<div data-v-1837476b><p class="timeline__title" data-v-1837476b>เข้าใช้งานล่าสุด</p><p class="timeline__date" data-v-1837476b>${ssrInterpolate(new Date(unref(profile).lastLogin).toLocaleString("th-TH"))}</p></div></div>`);
				} else _push(`<!---->`);
				_push(`</div></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/history.vue
var _sfc_setup = history_vue_vue_type_script_setup_true_lang_default.setup;
history_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/history.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var history_default = /*#__PURE__*/ _plugin_vue_export_helper_default(history_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1837476b"]]);

export { history_default as default };
//# sourceMappingURL=history-D4zNxaoR.mjs.map
