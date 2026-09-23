import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-Dx2_uv0V.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { u as useAdventure, a as getStationPosition, A as ADVENTURE_START_POINT } from './useAdventure-OrKGgcht.mjs';
import { u as useStationMissions } from './useStationMissions-CjHnM2MF.mjs';
import { _ as _virtual_public__2Fimages_2Fadventure_map_bg_default } from './_virtual_public-BGzBxMwg.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
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
import './useMemberApi-CZogIGln.mjs';
import './useRound-Vyr0MdjD.mjs';

//#region components/map/AdventureMap.vue?vue&type=script&setup=true&lang.ts
var AdventureMap_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdventureMap",
	__ssrInlineRender: true,
	props: {
		stations: {},
		visitedIds: {}
	},
	setup(__props) {
		/**
		* components/map/AdventureMap.vue
		* ---------------------------------------------------------------------------
		* แผนที่ Adventure Map แบบเต็มจอ (ใช้ในหน้า /map เท่านั้น) — พื้นหลังเป็นภาพ
		* เกาะลอยฟาร์มที่มีตึก/หมุด/ป้ายชื่อฐานทั้ง 4 วาดอยู่ในภาพเลย
		* (public/images/adventure-map-bg.jpg) ไม่ใช้ Leaflet/OpenStreetMap/GPS ใด ๆ
		*
		* เป็น "Presentational component" ล้วน ๆ: รับ stations และ visitedIds จาก
		* useAdventure() ผ่าน props — ไม่มี state สแกนแยกของตัวเอง เพื่อให้เครื่องหมาย ✓
		* ซิงก์กับ MiniMap และหน้าสรุปตลอดเวลา การบันทึกผ่านฐานจริงยังทำผ่านการสแกน QR
		* (ดู pages/scan.vue) เท่านั้น ไม่ใช่จากหน้านี้
		*
		* [แก้ไข — ผู้ใช้ยืนยันให้ใช้ภาพที่มีหมุด/ตึก/ป้ายชื่ออยู่ในภาพเลย] เดิมวาดหมุด
		* บับเบิลกรอบแดง (เด้งได้) + ไอคอนตกแต่งทับพื้นหลังเปล่าด้วย CSS/รูปแยก —
		* ตอนนี้พื้นหลังภาพเดียวมีครบทั้งตึก/หมุด/ป้ายชื่อ/ไอคอนตกแต่งอยู่แล้ว จึงตัด
		* ส่วนวาดทับทั้งหมดออก (รวมถึง Animation เด้ง — ทำกับรูปนิ่งภาพเดียวไม่ได้ ผู้ใช้
		* ยอมรับข้อจำกัดนี้แล้ว) เหลือไว้แค่ "ติ๊กถูกสีเขียว" ทับตำแหน่งฐานที่ผ่านแล้ว
		* เท่านั้น เพื่อให้ยังเห็นความคืบหน้าได้ — เป็นสิ่งเดียวที่รูปนิ่งทำเองไม่ได้
		*
		* [แก้ไข] ตำแหน่งคำนวณจาก "ลำดับ (index หลังเรียง order)" ของฐานผ่าน
		* getStationPosition() แทนการ lookup ด้วย id ฐานตายตัว (ADVENTURE_STATION_POSITIONS
		* เดิมคีย์ด้วย corn/cow/soil/milk ตรง ๆ) — จำนวน/id ฐานจึงไม่ผูกติดกับ 4 ตัวอีก
		* ต่อไป (ดูคอมเมนต์เต็มที่ composables/useAdventure.ts::getStationPosition)
		*/
		const props = __props;
		function isVisited(stationId) {
			return props.visitedIds.includes(stationId);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "adventure-map" }, _attrs))} data-v-1cf1bda3><img class="adventure-map__bg"${ssrRenderAttr("src", _virtual_public__2Fimages_2Fadventure_map_bg_default)} alt="แผนที่ฟาร์ม Adventure" draggable="false" data-v-1cf1bda3><!--[-->`);
			ssrRenderList(props.stations, (station, index) => {
				_push(`<div class="station-check-slot" style="${ssrRenderStyle({
					left: `${unref(getStationPosition)(index).x}%`,
					top: `${unref(getStationPosition)(index).y}%`
				})}" data-v-1cf1bda3>`);
				if (isVisited(station.id)) {
					_push(`<span class="station-check"${ssrRenderAttr("aria-label", `${station.name}: ผ่านแล้ว`)} data-v-1cf1bda3>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-check",
						class: "station-check__icon"
					}, null, _parent));
					_push(`</span>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--><div class="start-point" style="${ssrRenderStyle({
				left: `${unref(ADVENTURE_START_POINT).x}%`,
				top: `${unref(ADVENTURE_START_POINT).y}%`
			})}" data-v-1cf1bda3><span class="start-point__badge" aria-label="จุดที่ท่านเริ่มเล่น" data-v-1cf1bda3>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-flag",
				class: "start-point__icon"
			}, null, _parent));
			_push(`</span><span class="start-point__label" data-v-1cf1bda3>จุดเริ่มต้น</span></div></div>`);
		};
	}
});
//#endregion
//#region components/map/AdventureMap.vue
var _sfc_setup$1 = AdventureMap_vue_vue_type_script_setup_true_lang_default.setup;
AdventureMap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/map/AdventureMap.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AdventureMap_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AdventureMap_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1cf1bda3"]]), { __name: "MapAdventureMap" });
//#endregion
//#region pages/map.vue?vue&type=script&setup=true&lang.ts
var map_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "map",
	__ssrInlineRender: true,
	setup(__props) {
		const { isReady } = useRequireProfile();
		const { stations} = useAdventure();
		const { isStationMissionComplete } = useStationMissions();
		const visitedIds = computed(() => stations.value.filter((s) => isStationMissionComplete(s.id)).map((s) => s.id));
		useRoundTimer();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-76ee7cb4>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "Adventure Map" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-76ee7cb4>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="map-page" data-v-76ee7cb4>`);
				_push(ssrRenderComponent(AdventureMap_default, {
					stations: unref(stations),
					"visited-ids": unref(visitedIds)
				}, null, _parent));
				_push(`</div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/map.vue
var _sfc_setup = map_vue_vue_type_script_setup_true_lang_default.setup;
map_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/map.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var map_default = /*#__PURE__*/ _plugin_vue_export_helper_default(map_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-76ee7cb4"]]);

export { map_default as default };
//# sourceMappingURL=map-DeGhOYM1.mjs.map
