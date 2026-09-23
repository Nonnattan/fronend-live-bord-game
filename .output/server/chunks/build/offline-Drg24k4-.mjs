import { _ as _plugin_vue_export_helper_default, e as useHead$1 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

//#region pages/offline.vue?vue&type=script&setup=true&lang.ts
var offline_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "offline",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* pages/offline.vue
		* ---------------------------------------------------------------------------
		* หน้า Fallback ที่ Service Worker จะเสิร์ฟให้ "เฉพาะตอน" เปิดหน้าที่ไม่เคยถูก
		* Cache ไว้มาก่อนและไม่มีอินเทอร์เน็ต (ดู service-worker/sw.ts -> NavigationRoute
		* + setCatchHandler) ไม่เกี่ยวกับ UI หลักของแอป ไม่ได้ต่อ Layout 'app' เพื่อให้
		* แสดงผลได้เองโดยไม่พึ่งพา Component/State อื่นใดเลย (กันพังซ้อนตอนออฟไลน์จริง ๆ)
		*
		* หมายเหตุ: หน้านี้ถูกตั้งให้ Prerender เป็นไฟล์ static ตอน build เสมอ
		* (ดู nuxt.config.ts -> nitro.prerender.routes) เพื่อให้ Service Worker
		* Precache เป็นไฟล์ HTML ล้วน ใช้เป็น navigateFallback ได้แน่นอน
		*/
		useHead$1({ title: "ออฟไลน์ | Register App" });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "offline-shell" }, _attrs))} data-v-a2362b7b><div class="offline-card" data-v-a2362b7b><div class="offline-icon" data-v-a2362b7b>📡</div><h1 data-v-a2362b7b>ไม่มีการเชื่อมต่ออินเทอร์เน็ต</h1><p data-v-a2362b7b> หน้านี้ยังไม่เคยถูกเปิดตอนออนไลน์ จึงยังไม่มีข้อมูล Cache ไว้ให้ใช้งาน กรุณาตรวจสอบสัญญาณอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง </p><p class="offline-hint" data-v-a2362b7b> หน้าที่เคยเปิดมาก่อนแล้ว (เช่น หน้าแรก/แผนที่/ประวัติ) ยังสามารถใช้งาน แบบออฟไลน์ได้ตามปกติ </p><button type="button" class="offline-retry" data-v-a2362b7b> ลองใหม่อีกครั้ง </button></div></div>`);
		};
	}
});
//#endregion
//#region pages/offline.vue
var _sfc_setup = offline_vue_vue_type_script_setup_true_lang_default.setup;
offline_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/offline.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var offline_default = /*#__PURE__*/ _plugin_vue_export_helper_default(offline_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a2362b7b"]]);

export { offline_default as default };
//# sourceMappingURL=offline-Drg24k4-.mjs.map
