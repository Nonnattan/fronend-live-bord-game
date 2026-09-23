import { c as navigateTo } from "./error-CeCQlnc5.js";
import { D as _sfc_main, a as _sfc_main$1, n as _plugin_vue_export_helper_default, r as _sfc_main$2 } from "../server.mjs";
import { t as useRoundTimer } from "./useRoundTimer-CHUCPQ34.js";
import { t as definePageMeta } from "./pages-Cs7lFyjE.js";
import { t as useRequireProfile } from "./useRequireProfile-lZ7eJIgL.js";
import { i as useAdventure, n as ADVENTURE_STATION_POSITIONS, r as STATION_TYPE_META } from "./useAdventure-oyoryhV9.js";
import { n as useStationMissions } from "./useStationMissions-DyKPx7bx.js";
import { n as useStationQuest } from "./useStationQuest-Bji0iII9.js";
import { t as useForceEndRound } from "./useForceEndRound-Dv22McEm.js";
import { t as _virtual_public__2Fimages_2Fadventure_map_bg_default } from "./_virtual_public-BGzBxMwg.js";
import { computed, createTextVNode, defineComponent, mergeProps, unref, useSSRContext, watch, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region components/map/MiniMap.vue?vue&type=script&setup=true&lang.ts
var MiniMap_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "MiniMap",
	__ssrInlineRender: true,
	props: {
		stations: {},
		visitedIds: {}
	},
	emits: ["open"],
	setup(__props, { emit: __emit }) {
		/**
		* components/map/MiniMap.vue
		* ---------------------------------------------------------------------------
		* Adventure Map แบบย่อสำหรับหน้า Home — สูงประมาณ 250px พื้นหลังเป็นภาพเกาะลอย
		* ฟาร์มที่มีตึก/หมุด/ป้ายชื่อฐานทั้ง 4 วาดอยู่ในภาพเลย เดียวกับหน้า Map เต็ม
		* (public/images/adventure-map-bg.jpg) ไม่ใช้ Leaflet/OpenStreetMap/GPS ใด ๆ
		*
		* เป็น "หน้าอ้างอิงตำแหน่งฐาน" ย่อ ๆ ที่รับ visitedIds จาก useAdventure()
		* ผ่าน props เดียวกับ Main Map เพื่อแสดง ✓ ที่จุดเดียวกันโดยไม่สร้าง scanned state
		* แยกเอง แล้ว emit "open" ออกไป
		* ให้หน้า (page) เป็นผู้สั่ง navigateTo('/map') เอง
		*
		* [แก้ไข — ตามที่แก้ใน AdventureMap.vue] พื้นหลังภาพเดียวมีครบทั้งตึก/หมุด/
		* ป้ายชื่อ/ไอคอนตกแต่งอยู่แล้ว ตัดการวาดหมุดทับ (บับเบิลกรอบแดง+เด้ง) ออกทั้งหมด
		* เหลือไว้แค่ "ติ๊กถูกสีเขียว" ทับตำแหน่งฐานที่ผ่านแล้วเท่านั้น
		*/
		const props = __props;
		function isVisited(stationId) {
			return props.visitedIds.includes(stationId);
		}
		function positionOf(station) {
			return ADVENTURE_STATION_POSITIONS[station.id] ?? {
				x: 50,
				y: 50
			};
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main;
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "mini-map",
				role: "button",
				tabindex: "0",
				"aria-label": "ดูแผนที่แบบเต็ม"
			}, _attrs))} data-v-e03123d9><div class="mini-map__canvas" data-v-e03123d9><img class="mini-map__bg"${ssrRenderAttr("src", _virtual_public__2Fimages_2Fadventure_map_bg_default)} alt="แผนที่ฟาร์ม Adventure" draggable="false" data-v-e03123d9><!--[-->`);
			ssrRenderList(props.stations, (station) => {
				_push(`<span class="mini-map__check-slot" style="${ssrRenderStyle({
					left: `${positionOf(station).x}%`,
					top: `${positionOf(station).y}%`
				})}" data-v-e03123d9>`);
				if (isVisited(station.id)) {
					_push(`<span class="mini-map__check"${ssrRenderAttr("aria-label", `${station.name}: ผ่านแล้ว`)} data-v-e03123d9>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-check",
						class: "mini-map__check-icon"
					}, null, _parent));
					_push(`</span>`);
				} else _push(`<!---->`);
				_push(`</span>`);
			});
			_push(`<!--]--></div><div class="mini-map__footer" data-v-e03123d9><div class="mini-map__footer-text" data-v-e03123d9><p class="mini-map__title" data-v-e03123d9>Adventure Map</p><p class="mini-map__desc" data-v-e03123d9>แตะเพื่อเปิดแผนที่เต็ม</p></div>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-chevron-right",
				class: "mini-map__chevron"
			}, null, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region components/map/MiniMap.vue
var _sfc_setup$1 = MiniMap_vue_vue_type_script_setup_true_lang_default.setup;
MiniMap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/map/MiniMap.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var MiniMap_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(MiniMap_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e03123d9"]]), { __name: "MapMiniMap" });
//#endregion
//#region pages/home.vue?vue&type=script&setup=true&lang.ts
var home_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "home",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* pages/home.vue
		* ---------------------------------------------------------------------------
		* หน้า Home หลักของระบบ — หน้าแรกของแอปหลัง Login + กรอกโปรไฟล์ครบ (guard ผ่าน
		* useRequireProfile() เหมือนทุกหน้าในแอป ไม่ได้แก้ logic เดิมของ guard นี้เลย)
		*
		* ประกอบด้วย:
		* 1) MiniMap ของ Adventure Game Map (พื้นหลังภาพ PNG สูง ~250px ไม่ใช้
		*    Leaflet/OpenStreetMap/GPS) กดแล้วไปหน้า Map เต็มที่ /map
		* 2) Summary Card ด้านล่าง — เข้าฐานแล้ว X/Y + รายการฐานทั้งหมด
		*    ข้อมูล/สถานะทั้งหมดมาจาก useAdventure() (composables/useAdventure.ts)
		*    เพียงจุดเดียว ทำให้ในอนาคตสลับไปใช้ข้อมูลจริงได้โดยไม่ต้องแก้หน้านี้
		*
		* [Fix] Summary Card แสดง "คะแนน" กลับมาอีกครั้งคู่กับ "เข้าฐานแล้ว X/Y" — ใช้
		* totalPoint จาก useAdventure() ตรง ๆ (ของเดิมมีอยู่แล้ว แค่ไม่เคยถูกดึงมาวาดใน
		* template หน้านี้เท่านั้น ไม่ได้แก้ Logic การคำนวณใน useAdventure.ts เลย)
		* [แก้ไข — แยก Initial/Master State] totalPoint = Initial/Master State (ดึงจาก
		* Backend "ครั้งเดียวตอน Login" แช่แข็งไว้ตลอด session ไม่เปลี่ยนระหว่างเล่น — ดู
		* useAdventure.ts::initInitialScore()) + คะแนนที่ทำได้ใน "รอบปัจจุบัน" เท่านั้น
		* (visitedIds ในเครื่อง เช่น ฐาน 1 +10 -> Initial+10, ฐาน 2 +20 -> Initial+30) แล้ว
		* กลับไปเท่ากับ Initial/Master State ให้เองทันทีที่ resetJourney() ล้าง visitedIds
		* ตอนกด "จบเกม" (ดู pages/scan.vue::endGameAfterFinalStation +
		* pages/round-summary.vue::confirmAndGoHome ซึ่งเป็นจุดที่เรียก resetJourney()
		* จริง) — คะแนนของรอบที่เพิ่งจบยังคงดูได้ที่หน้าสรุปผล /round-summary ตามเดิม
		* (อ่านจาก roundSummary:last ที่บันทึก "สำเนา" คะแนนรอบนั้นไว้ก่อน resetJourney()
		* จะล้างทิ้งเสมอ — ดู composables/useRoundSummary.ts)
		*/
		definePageMeta({ layout: "app" });
		const { profile, isReady } = useRequireProfile();
		const { stations, totalStations, initAdventure } = useAdventure();
		const { getStationMissions, isStationMissionComplete, missionProgressCount, totalPointsEarned, initStationMissions } = useStationMissions();
		const { initStationQuest } = useStationQuest();
		const { roundRemainingLabel, hasActiveRoundTimer, isRoundExpired } = useRoundTimer();
		const { forceEndRoundDueToTimeout } = useForceEndRound();
		/** จำนวนฐานที่ทำภารกิจครบ 3/3 แล้ว (แทน visitedCount เดิมจาก useAdventure) */
		const completedStationCount = computed(() => stations.value.filter((s) => isStationMissionComplete(s.type)).length);
		/** ให้ MiniMap ติ๊ก ✓ ตรงกับการ์ดฐานด้านล่างเป๊ะ ๆ (ที่มาเดียวกัน — ไม่ใช้
		* visitedIds เดิมจาก useAdventure() ซึ่งเป็นระบบเช็คอินคนละอันที่ Flow นี้ไม่แตะ) */
		const miniMapVisitedIds = computed(() => stations.value.filter((s) => isStationMissionComplete(s.type)).map((s) => s.id));
		watch(isRoundExpired, (expired) => {
			if (expired) forceEndRoundDueToTimeout("round");
		});
		/** ปุ่ม "GO" — [ใหม่] ตอนนี้ไม่เปิดรอบตรงนี้ในหน้า Home อีกต่อไป แค่พาไปหน้า
		* /starting (หน้าโหลดเต็มจอแยกต่างหาก) ซึ่งเป็นจุดที่เรียก
		* ensureRoundStarted()/startRound() + startRoundTimer() จริง แล้วค่อยพากลับมา
		* หน้านี้เองเมื่อเสร็จ (ดู pages/starting.vue) — ทำให้ระหว่างรอ Network Call
		* (อาจช้าบนเน็ตมือถือกลางแปลง) ผู้เล่นเห็นเป็นหน้าเต็มจอแยกจริง ๆ แทนการ์ดเล็ก ๆ
		* ในหน้า Home เหมือนเดิม */
		function pressGo() {
			navigateTo("/starting");
		}
		function goToMapPage() {
			navigateTo("/map");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main;
			const _component_UAvatar = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-313869fd>`);
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-313869fd>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="home" data-v-313869fd><div class="greeting" data-v-313869fd>`);
				if (unref(profile)?.pictureUrl) _push(ssrRenderComponent(_component_UAvatar, {
					src: unref(profile).pictureUrl,
					size: "md",
					class: "greeting__avatar"
				}, null, _parent));
				else {
					_push(`<div class="greeting__avatar-fallback" data-v-313869fd>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-user-round",
						class: "greeting__avatar-icon"
					}, null, _parent));
					_push(`</div>`);
				}
				_push(`<div class="greeting__text" data-v-313869fd><p class="greeting__hello" data-v-313869fd>สวัสดี</p><p class="greeting__name" data-v-313869fd>${ssrInterpolate(unref(profile)?.firstName)} ${ssrInterpolate(unref(profile)?.lastName)}</p></div>`);
				if (unref(hasActiveRoundTimer)) {
					_push(`<div class="greeting__timer" data-v-313869fd>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-timer",
						class: "greeting__timer-icon"
					}, null, _parent));
					_push(` ${ssrInterpolate(unref(roundRemainingLabel))}</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
				if (!unref(hasActiveRoundTimer)) {
					_push(`<section class="go-gate" data-v-313869fd>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-flag-triangle-right",
						class: "go-gate__icon"
					}, null, _parent));
					_push(`<p class="go-gate__title" data-v-313869fd>พร้อมเริ่มผจญภัยหรือยัง?</p><p class="go-gate__desc" data-v-313869fd> กดปุ่ม GO เพื่อเปิดรอบเล่น — มีเวลา 2 ชั่วโมงในการเก็บฐานให้ครบทุกเผ่า </p>`);
					_push(ssrRenderComponent(_component_UButton, {
						size: "xl",
						color: "primary",
						class: "go-gate__button",
						onClick: pressGo
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` GO `);
							else return [createTextVNode(" GO ")];
						}),
						_: 1
					}, _parent));
					_push(`</section>`);
				} else {
					_push(`<!--[--><section class="summary-card" data-v-313869fd><div class="summary-card__top" data-v-313869fd><div class="summary-card__stat" data-v-313869fd><p class="summary-card__label" data-v-313869fd>เข้าฐานแล้ว</p><p class="summary-card__value" data-v-313869fd><span class="summary-card__value-num" data-v-313869fd>${ssrInterpolate(unref(completedStationCount))}/${ssrInterpolate(unref(totalStations))}</span></p></div><div class="summary-card__divider" data-v-313869fd></div><div class="summary-card__stat" data-v-313869fd><p class="summary-card__label" data-v-313869fd>คะแนน</p><p class="summary-card__value" data-v-313869fd><span class="summary-card__value-num" data-v-313869fd>${ssrInterpolate(unref(totalPointsEarned))}</span></p></div></div><div class="station-grid" data-v-313869fd><!--[-->`);
					ssrRenderList(unref(stations), (station) => {
						_push(`<div class="${ssrRenderClass([{ "station-chip--visited": unref(isStationMissionComplete)(station.type) }, "station-chip"])}" data-v-313869fd><span class="station-chip__icon-wrap" data-v-313869fd>`);
						if (unref(isStationMissionComplete)(station.type)) _push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-check",
							class: "station-chip__icon"
						}, null, _parent));
						else _push(`<span class="station-chip__emoji" data-v-313869fd>${ssrInterpolate(unref(STATION_TYPE_META)[station.type].icon)}</span>`);
						_push(`</span><span class="station-chip__name" data-v-313869fd>${ssrInterpolate(station.name)}</span>`);
						if (!unref(isStationMissionComplete)(station.type) && unref(getStationMissions)(station.type).length > 0) _push(`<span class="station-chip__progress" data-v-313869fd>${ssrInterpolate(unref(missionProgressCount)(station.type))}/${ssrInterpolate(unref(getStationMissions)(station.type).length)}</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--></div></section>`);
					_push(ssrRenderComponent(MiniMap_default, {
						stations: unref(stations),
						"visited-ids": unref(miniMapVisitedIds),
						onOpen: goToMapPage
					}, null, _parent));
					_push(`<!--]-->`);
				}
				_push(`</div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/home.vue
var _sfc_setup = home_vue_vue_type_script_setup_true_lang_default.setup;
home_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var home_default = /*#__PURE__*/ _plugin_vue_export_helper_default(home_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-313869fd"]]);
//#endregion
export { home_default as default };

//# sourceMappingURL=home-VgRzosnP.js.map