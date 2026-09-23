import { c as navigateTo } from "./error-CeCQlnc5.js";
import { D as _sfc_main, n as _plugin_vue_export_helper_default } from "../server.mjs";
import { t as PageHeader_default } from "./PageHeader-D2G5O0y5.js";
import { t as definePageMeta } from "./pages-Cs7lFyjE.js";
import { t as useRequireProfile } from "./useRequireProfile-lZ7eJIgL.js";
import { i as useAdventure, r as STATION_TYPE_META } from "./useAdventure-oyoryhV9.js";
import { n as useStationMissions } from "./useStationMissions-DyKPx7bx.js";
import { n as useStationQuest } from "./useStationQuest-Bji0iII9.js";
import { computed, defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region components/station/StationSelectionCard.vue?vue&type=script&setup=true&lang.ts
var StationSelectionCard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StationSelectionCard",
	__ssrInlineRender: true,
	props: {
		station: {},
		cardState: {}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		/**
		* components/station/StationSelectionCard.vue
		* ---------------------------------------------------------------------------
		* การ์ด 1 ใบในหน้า "เลือกฐาน" (pages/stations.vue) — 4 สถานะที่แสดงผล (มาจาก
		* StationCardState — ดู composables/useStationQuest.ts::getStationCardState):
		*   completed        ทำครบ 3/3 แล้ว — "✓ ทำครบแล้ว" กดเข้าดูซ้ำได้เสมอ
		*   accessible       ยังไม่ครบ แต่มีสิทธิ์จากการสแกนล่าสุด — "🔓 เข้าได้" กดเข้าได้
		*   needs-rescan     ยังไม่ครบ + เคยเล่นมาก่อน (มี Progress) แต่สิทธิ์หมดแล้ว —
		*                     "🔒" + คำแนะนำ "สแกน QR เพื่อเข้าเล่นต่อ" กดไม่ได้
		*   locked           ยังไม่ครบ + ไม่เคยเล่นเลย (0/3) — "🔒 ยังไม่ปลดล็อค" กดไม่ได้
		*/
		const props = __props;
		const variant = computed(() => {
			if (props.cardState.isCompleted) return "completed";
			if (props.cardState.isAccessible) return "accessible";
			return props.cardState.completedMissions > 0 ? "needs-rescan" : "locked";
		});
		const isClickable = computed(() => props.cardState.isAccessible);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				type: "button",
				class: ["station-card", `station-card--${unref(variant)}`],
				disabled: !unref(isClickable)
			}, _attrs))} data-v-2eb686da><span class="station-card__icon" data-v-2eb686da>${ssrInterpolate(__props.station.icon)}</span><span class="station-card__name" data-v-2eb686da>${ssrInterpolate(__props.station.name)}</span>`);
			if (__props.cardState.totalMissions > 0) _push(`<span class="station-card__progress" data-v-2eb686da> ภารกิจ ${ssrInterpolate(__props.cardState.completedMissions)}/${ssrInterpolate(__props.cardState.totalMissions)}</span>`);
			else _push(`<!---->`);
			_push(`<span class="station-card__status" data-v-2eb686da>`);
			if (unref(variant) === "completed") _push(`<!--[-->✓ ทำครบแล้ว<!--]-->`);
			else if (unref(variant) === "accessible") _push(`<!--[-->🔓 เข้าได้<!--]-->`);
			else _push(`<!--[-->🔒 ยังไม่ปลดล็อค<!--]-->`);
			_push(`</span>`);
			if (unref(variant) === "needs-rescan") _push(`<span class="station-card__hint" data-v-2eb686da> สแกน QR เพื่อเข้าเล่นต่อ </span>`);
			else _push(`<!---->`);
			_push(`</button>`);
		};
	}
});
//#endregion
//#region components/station/StationSelectionCard.vue
var _sfc_setup$2 = StationSelectionCard_vue_vue_type_script_setup_true_lang_default.setup;
StationSelectionCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationSelectionCard.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var StationSelectionCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StationSelectionCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2eb686da"]]), { __name: "StationSelectionCard" });
//#endregion
//#region components/station/StationSelectionGrid.vue?vue&type=script&setup=true&lang.ts
var StationSelectionGrid_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StationSelectionGrid",
	__ssrInlineRender: true,
	props: {
		stations: {},
		cardStates: {}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		/**
		* components/station/StationSelectionGrid.vue
		* ---------------------------------------------------------------------------
		* เนื้อหาหลักของหน้า "เลือกฐาน" (pages/stations.vue) — เดิมเคยเป็นป็อปอัพ
		* (StationUnlockModal.vue) แต่ตามสเปกล่าสุด "ห้ามใช้ Popup เป็นหน้าเลือกฐาน"
		* จึงเปลี่ยนเป็น Component เนื้อหาธรรมดา (ไม่มี UModal ห่อ) ให้หน้าเต็ม
		* pages/stations.vue เป็นคนคุม Layout/Header เอง แสดง 4 ฐานเสมอ (ข้าวโพด/วัว/
		* ดิน/นม) พร้อมสถานะ + Progress ต่อฐาน (ดู StationSelectionCard.vue)
		*/
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "station-grid" }, _attrs))} data-v-ac3fe301><!--[-->`);
			ssrRenderList(__props.stations, (station) => {
				_push(ssrRenderComponent(StationSelectionCard_default, {
					key: station.id,
					station,
					"card-state": __props.cardStates[station.id],
					onSelect: ($event) => emit("select", $event)
				}, null, _parent));
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region components/station/StationSelectionGrid.vue
var _sfc_setup$1 = StationSelectionGrid_vue_vue_type_script_setup_true_lang_default.setup;
StationSelectionGrid_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationSelectionGrid.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var StationSelectionGrid_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StationSelectionGrid_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ac3fe301"]]), { __name: "StationSelectionGrid" });
//#endregion
//#region pages/stations.vue?vue&type=script&setup=true&lang.ts
var stations_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "stations",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* pages/stations.vue
		* ---------------------------------------------------------------------------
		* หน้าเต็ม "เลือกฐาน" — เข้ามาหลังสแกน QR ฐานสำเร็จจาก pages/scan.vue (ดู
		* unlockStationFromScan() ที่นั้น) ตามสเปก "ห้ามใช้ Popup เป็นหน้าเลือกฐาน"
		* แสดง 4 ฐานเสมอ (ข้าวโพด/วัว/ดิน/นม) พร้อม Progress ต่อฐาน (จำนวนภารกิจจริงจาก
		* Backend — ไม่ hardcode เป็น 3 อีกต่อไป ดู types/mission.ts) — กดเข้าได้เฉพาะ
		* ฐานที่ทำภารกิจครบแล้ว (ดูซ้ำได้เสมอ) หรือฐานที่เพิ่งได้สิทธิ์จากการสแกนล่าสุด
		* เท่านั้น (ดู composables/useStationQuest.ts::canEnterStation)
		*/
		definePageMeta({ layout: "app" });
		const { profile, isReady } = useRequireProfile();
		const { stations, initAdventure } = useAdventure();
		const { getStationCardState, initStationQuest } = useStationQuest();
		const { initStationMissions } = useStationMissions();
		/** เรียงตามสเปกเสมอ: ข้าวโพด/วัว/ดิน/นม — ใช้ชื่อจริงจาก stations (Admin แก้ผ่าน
		* Backend ได้) + ไอคอนจาก STATION_TYPE_META (ของเดิม ไม่ Admin-configurable) */
		const STATION_ORDER = [
			"corn",
			"cow",
			"soil",
			"milk"
		];
		const stationList = computed(() => STATION_ORDER.map((id) => {
			return {
				id,
				name: stations.value.find((s) => s.id === id)?.name ?? STATION_TYPE_META[id].label,
				icon: STATION_TYPE_META[id].icon
			};
		}));
		const cardStates = computed(() => {
			const map = {};
			for (const id of STATION_ORDER) map[id] = getStationCardState(id);
			return map;
		});
		function handleSelect(stationId) {
			navigateTo(`/station/${stationId}`);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-edfed618>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "เลือกฐาน" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-edfed618>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="page__content" data-v-edfed618><p class="page__hint" data-v-edfed618>แตะฐานที่ปลดล็อคเพื่อเริ่มทำภารกิจ</p>`);
				_push(ssrRenderComponent(StationSelectionGrid_default, {
					stations: unref(stationList),
					"card-states": unref(cardStates),
					onSelect: handleSelect
				}, null, _parent));
				_push(`</div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/stations.vue
var _sfc_setup = stations_vue_vue_type_script_setup_true_lang_default.setup;
stations_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stations.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var stations_default = /*#__PURE__*/ _plugin_vue_export_helper_default(stations_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-edfed618"]]);
//#endregion
export { stations_default as default };

//# sourceMappingURL=stations-CoE-K6EP.js.map