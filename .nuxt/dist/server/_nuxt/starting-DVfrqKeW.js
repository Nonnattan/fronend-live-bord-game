import "./error-CeCQlnc5.js";
import { n as _plugin_vue_export_helper_default, t as useOfflineMode } from "../server.mjs";
import { t as useRoundTimer } from "./useRoundTimer-CHUCPQ34.js";
import { t as definePageMeta } from "./pages-Cs7lFyjE.js";
import { t as useRequireProfile } from "./useRequireProfile-lZ7eJIgL.js";
import { t as useRound } from "./useRound-BmAVHypg.js";
import { defineComponent, mergeProps, ref, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region pages/starting.vue?vue&type=script&setup=true&lang.ts
var starting_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "starting",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* pages/starting.vue
		* ---------------------------------------------------------------------------
		* [ใหม่] หน้าโหลดเต็มจอแยกต่างหาก — แสดงระหว่างเปิดรอบจริง (เปิด Round ฝั่ง
		* Backend/Offline ผ่าน ensureRoundStarted()/startRound() + เริ่มนับเวลา 2
		* ชั่วโมงด้วย startRoundTimer()) แทนที่การ์ดเล็ก ๆ ในหน้า Home เดิม
		*
		* Flow: Home (ปุ่ม GO) -> navigateTo('/starting') -> หน้านี้ mount แล้วเริ่ม
		* เปิดรอบทันที -> เสร็จแล้ว navigateTo('/home') กลับไปอัตโนมัติ (Home จะเห็น
		* hasActiveRoundTimer เป็น true แล้วเลยแสดงเนื้อหาปกติแทนปุ่ม GO ทันที)
		*
		* Guard ด้วย useRequireProfile() เหมือนทุกหน้าในแอป — กันเข้าตรง ๆ โดยไม่ได้
		* Login/กรอกโปรไฟล์มาก่อน เหมือนหน้าอื่น ๆ ทั้งหมด
		*
		* ใช้ layout: 'app' เหมือนเดิม (ได้พื้นหลังท้องฟ้าไล่สี app-frame ฟรีจาก
		* layouts/app.vue) แต่ซ่อน BottomNav อยู่แล้วเพราะ hasActiveRoundTimer ยังเป็น
		* false ระหว่างที่หน้านี้กำลังทำงานอยู่ (ตาม logic เดิมใน layouts/app.vue)
		*/
		definePageMeta({ layout: "app" });
		const { profile, isReady } = useRequireProfile();
		const { ensureRoundStarted } = useRound();
		const { isOfflineMode, startRound } = useOfflineMode();
		const { startRoundTimer, hasActiveRoundTimer } = useRoundTimer();
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
//#endregion
export { starting_default as default };

//# sourceMappingURL=starting-DVfrqKeW.js.map