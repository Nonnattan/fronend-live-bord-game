import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

//#region pages/reservation.vue?vue&type=script&setup=true&lang.ts
var reservation_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "reservation",
	__ssrInlineRender: true,
	setup(__props) {
		const { isReady } = useRequireProfile();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-e0bc48b2>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "Reservation" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-e0bc48b2>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="page__empty" data-v-e0bc48b2>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-calendar-check",
					class: "page__empty-icon"
				}, null, _parent));
				_push(`<p class="page__empty-title" data-v-e0bc48b2>ยังไม่มีการจอง</p><p class="page__empty-desc" data-v-e0bc48b2>ระบบจองล่วงหน้าจะเปิดให้บริการเร็ว ๆ นี้</p></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/reservation.vue
var _sfc_setup = reservation_vue_vue_type_script_setup_true_lang_default.setup;
reservation_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reservation.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var reservation_default = /*#__PURE__*/ _plugin_vue_export_helper_default(reservation_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e0bc48b2"]]);

export { reservation_default as default };
//# sourceMappingURL=reservation-BlJxt7-S.mjs.map
