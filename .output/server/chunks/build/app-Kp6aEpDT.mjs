import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { B as BottomNav_default } from './BottomNav-CqvoaBRR.mjs';
import { u as useRoundTimer } from './useRoundTimer-Dx2_uv0V.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
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

//#region layouts/app.vue?vue&type=script&setup=true&lang.ts
var app_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* layouts/app.vue
		* ---------------------------------------------------------------------------
		* Layout กลางของทุกหน้าในแอปหลัง Login (Home, Reservation, Scan QR, History,
		* Profile) — คุม "phone frame" เดียวกับหน้า Welcome/ProfileForm ให้ดูเป็นแอป
		* เดียวกัน ต่างกันแค่หน้านี้มี Bottom Navigation ติดอยู่ด้านล่างเสมอ และพื้นที่
		* เนื้อหา (slot) เลื่อน (scroll) ได้อิสระด้านในกรอบ
		*
		* ใช้กับหน้าไหนก็ตั้ง `definePageMeta({ layout: 'app' })`
		*
		* [ใหม่] ซ่อน Bottom Navigation ทั้งหมดตราบใดที่ยังไม่กดปุ่ม GO (ยังไม่มี Round
		* Timer เริ่ม — ดู composables/useRoundTimer.ts::hasActiveRoundTimer) ตามสเปก
		* "อยู่หน้า Go จะกดอะไรไม่ได้เลยนอกจาก Go" — ผู้เล่นจะสลับไปหน้าอื่น (แผนที่/
		* สแกน/โปรไฟล์) ผ่านปุ่มเมนูล่างไม่ได้จนกว่าจะกด GO เริ่มรอบก่อนเสมอ เช็คจาก
		* Layout ที่นี่จุดเดียว (ใช้ร่วมกันทุกหน้าที่ตั้ง layout: 'app') ไม่ต้องไปเพิ่ม
		* Logic ซ้ำในแต่ละหน้า — hasActiveRoundTimer เป็น useState กลาง เห็นค่าเดียวกัน
		* ทุกหน้าอยู่แล้ว ไม่กระทบการเช็ค isReady/useRequireProfile เดิมของแต่ละหน้าเลย
		*/
		const { hasActiveRoundTimer } = useRoundTimer();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_BottomNav = BottomNav_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "app-shell" }, _attrs))} data-v-33474d44><div class="app-frame" data-v-33474d44><main class="${ssrRenderClass([{ "app-content--no-nav": !unref(hasActiveRoundTimer) }, "app-content"])}" data-v-33474d44>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main>`);
			if (unref(hasActiveRoundTimer)) _push(ssrRenderComponent(_component_BottomNav, null, null, _parent));
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region layouts/app.vue
var _sfc_setup = app_vue_vue_type_script_setup_true_lang_default.setup;
app_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/app.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var app_default = /*#__PURE__*/ _plugin_vue_export_helper_default(app_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-33474d44"]]);

export { app_default as default };
//# sourceMappingURL=app-Kp6aEpDT.mjs.map
