import { _ as _plugin_vue_export_helper_default, c as _sfc_main$2, b as _sfc_main$7, n as navigateTo } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-Dx2_uv0V.mjs';
import { u as useProfile } from './useProfile-Di4CdYil.mjs';
import { u as useAdventure } from './useAdventure-OrKGgcht.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { c as clearStationMissionsProgress } from './useStationMissions-CjHnM2MF.mjs';
import { c as clearStationQuestProgress } from './useStationQuest-DdT4jEnZ.mjs';
import { u as useAuth } from './useAuth-CqLYPeWu.mjs';
import { u as useReward } from './useReward-ig_NYST5.mjs';
import { u as useQuestion } from './useQuestion-C6pjnTg1.mjs';
import { u as useRoundScores } from './useRoundScores-DGBK9ToW.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
import 'zod';
import './useMemberApi-CZogIGln.mjs';
import './useRound-Vyr0MdjD.mjs';

//#region pages/reward-received.vue?vue&type=script&setup=true&lang.ts
var reward_received_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "reward-received",
	__ssrInlineRender: true,
	setup(__props) {
		const { profile, resetProfile } = useProfile();
		const { resetAuth } = useAuth();
		const { roundSummary, clearRoundSummary } = useRoundSummary();
		const { status, isConfirming, error, confirmRoundReceived } = useReward();
		const { resetJourney } = useAdventure();
		const { resetAnswered } = useQuestion();
		const { clearAllTimers } = useRoundTimer();
		const { stations: roundScoreStations, totalScore} = useRoundScores();
		const isReady = ref(false);
		/** true เฉพาะหลังกด OK สำเร็จเท่านั้น — จุดเดียวที่อนุญาตให้ออกจากหน้านี้ได้
		* โดยไม่มีคำเตือนซ้ำ (เหมือน pages/round-summary.vue ทุกประการ) */
		const confirmedLeave = ref(false);
		const hasValidRound = computed(() => !!roundSummary.value?.roundId && !!roundSummary.value?.userId);
		const rewardName = computed(() => status.value?.reward?.name ?? "-");
		/** ดักปุ่ม Back ของเบราว์เซอร์/มือถือ — เตือนก่อนออกเสมอ ยกเว้นกด OK สำเร็จแล้ว */
		onBeforeRouteLeave(() => {
			if (confirmedLeave.value || true) return true;
		});
		/**
		* ปุ่ม "OK" — เรียก confirmRoundReceived() ก่อนเสมอ (Backend validate เองว่า
		* Status=Ended + RewardStatus=Claimed จริง) รอผลสำเร็จ "ก่อน" เท่านั้นถึงจะ
		* reset State ของรอบปัจจุบัน (resetJourney/resetAnswered/clearAllTimers/
		* clearStationQuestProgress/clearRoundSummary — ไม่ใช้ localStorage.clear()
		* เด็ดขาด แตะเฉพาะ Key ของรอบปัจจุบันเท่านั้น) ไม่สำเร็จ -> แสดง error ค้างอยู่
		* หน้านี้ต่อ ไม่ reset อะไรทั้งสิ้น ผู้เล่นกดซ้ำได้ (Backend idempotent อยู่แล้ว)
		*
		* [แก้ไข] จบเกมแล้วต้องกลับหน้า Login ("/") ไม่ใช่ "/home" อีกต่อไป — ล้าง Profile/
		* Auth ที่จำเป็นสำหรับกลับเข้าใหม่ด้วย (กัน "/" เด้งกลับ "/home" ทันทีเพราะ
		* hasProfile ยังเป็น true ค้างอยู่ — ดู pages/index.vue) ไม่เพิ่ม logout LINE จริง
		* (logoutLine()) เพราะไม่ใช่สิ่งที่ Flow เดิมเคยทำ — มี LINE Session ค้างอยู่จริงจะ
		* Auto-login กลับเข้า Home ตามพฤติกรรมเดิมของระบบ (ดู pages/index.vue) ซึ่งเป็น
		* เรื่องที่ตั้งใจคงไว้
		*/
		async function handleOk() {
			if (!hasValidRound.value || isConfirming.value) return;
			if (!await confirmRoundReceived(roundSummary.value.roundId, roundSummary.value.userId)) return;
			confirmedLeave.value = true;
			resetJourney();
			resetAnswered();
			clearAllTimers();
			clearStationQuestProgress();
			clearStationMissionsProgress();
			clearRoundSummary();
			resetProfile();
			resetAuth();
			await navigateTo("/");
		}
		/** ปุ่ม "กลับสู่หน้าหลัก" ของ empty-state เท่านั้น (ไม่พบข้อมูลรางวัลของรอบนี้
		* เลย — ไม่มีอะไรให้ยืนยัน/reset) ต้องตั้ง confirmedLeave ก่อนเสมอเช่นกัน ไม่งั้น
		* onBeforeRouteLeave guard จะดักถามซ้ำโดยไม่จำเป็น (Guard นั้นมีไว้ป้องกันเคส
		* มีรางวัลจริงแต่ยังไม่กด OK เท่านั้น ไม่เกี่ยวกับเคสนี้เลย)
		*
		* [แก้ไข] เปลี่ยนปลายทางเป็น "/" แทน "/home" เพื่อไม่ให้มีจุดใดในหน้านี้พากลับ
		* "/home" ตรง ๆ อีกเลย — ไม่มีรอบให้ยืนยัน/reset ในเคสนี้ (ไม่พบข้อมูลรางวัลเลย)
		* จึงไม่แตะ Profile/Auth (ต่างจาก handleOk() ด้านบน) ปล่อยให้ Logic เดิมของ
		* pages/index.vue ตัดสินใจต่อเอง */
		async function handleGoHomeFromEmptyState() {
			confirmedLeave.value = true;
			await navigateTo("/");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$2;
			const _component_UIcon = _sfc_main$7;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "phone-shell" }, _attrs))} data-v-24e67fad><div class="phone-frame" data-v-24e67fad>`);
			if (!unref(isReady)) _push(`<div class="loading" data-v-24e67fad><p class="loading__text" data-v-24e67fad>กรุณารอสักครู่...</p></div>`);
			else {
				_push(`<div class="content" data-v-24e67fad>`);
				if (!unref(hasValidRound)) {
					_push(`<div class="empty-state" data-v-24e67fad><p class="empty-state__desc" data-v-24e67fad>ไม่พบข้อมูลรางวัลของรอบนี้</p>`);
					_push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "primary",
						onClick: handleGoHomeFromEmptyState
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`กลับสู่หน้าหลัก`);
							else return [createTextVNode("กลับสู่หน้าหลัก")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else {
					_push(`<!--[--><div class="result-hero" data-v-24e67fad>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-party-popper",
						class: "result-hero__icon"
					}, null, _parent));
					_push(`<h1 class="result-hero__title" data-v-24e67fad>ได้รับรางวัลแล้ว</h1>`);
					if (unref(profile)) _push(`<p class="result-hero__subtitle" data-v-24e67fad>${ssrInterpolate(unref(profile).firstName)} ${ssrInterpolate(unref(profile).lastName)}</p>`);
					else _push(`<!---->`);
					_push(`</div><div class="info-card" data-v-24e67fad><div class="info-card__row" data-v-24e67fad>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-gift",
						class: "info-card__icon"
					}, null, _parent));
					_push(`<div class="info-card__text" data-v-24e67fad><p class="info-card__label" data-v-24e67fad>รางวัลที่ได้รับ</p><p class="info-card__value info-card__value--reward" data-v-24e67fad>${ssrInterpolate(unref(rewardName))}</p></div></div><div class="info-card__row" data-v-24e67fad>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-badge-check",
						class: "info-card__icon"
					}, null, _parent));
					_push(`<div class="info-card__text" data-v-24e67fad><p class="info-card__label" data-v-24e67fad>รหัสรอบ (roundId)</p><p class="info-card__value" data-v-24e67fad>${ssrInterpolate(unref(roundSummary)?.roundId)}</p></div></div><div class="info-card__row" data-v-24e67fad>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-check-circle-2",
						class: "info-card__icon"
					}, null, _parent));
					_push(`<div class="info-card__text" data-v-24e67fad><p class="info-card__label" data-v-24e67fad>สถานะ</p><p class="info-card__value" data-v-24e67fad> เจ้าหน้าที่ยืนยันมอบรางวัลแล้ว — กรุณากด OK เพื่อยืนยันรับรางวัล </p></div></div></div><div class="info-card" data-v-24e67fad><p class="info-card__list-title" data-v-24e67fad>คะแนนรวมของรอบนี้</p>`);
					if (unref(roundScoreStations).length) {
						_push(`<ul class="station-list" data-v-24e67fad><!--[-->`);
						ssrRenderList(unref(roundScoreStations), (station) => {
							_push(`<li class="station-list__item" data-v-24e67fad><span class="station-list__name" data-v-24e67fad>${ssrInterpolate(station.stationName)}</span><span class="station-list__points" data-v-24e67fad>+${ssrInterpolate(station.point + station.questionPoint + station.missionPoint)}</span></li>`);
						});
						_push(`<!--]--></ul>`);
					} else _push(`<!---->`);
					_push(`<p class="score-card__total" data-v-24e67fad><span class="score-card__total-num" data-v-24e67fad>${ssrInterpolate(unref(totalScore))}</span><span class="score-card__total-unit" data-v-24e67fad>Point</span></p></div>`);
					if (unref(error)) _push(`<p class="error-text" data-v-24e67fad>${ssrInterpolate(unref(error))}</p>`);
					else _push(`<!---->`);
					_push(ssrRenderComponent(_component_UButton, {
						block: "",
						size: "xl",
						color: "primary",
						icon: unref(error) ? "i-lucide-rotate-cw" : "i-lucide-check-circle-2",
						loading: unref(isConfirming),
						disabled: unref(isConfirming),
						onClick: handleOk
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(unref(error) ? "ลองอีกครั้ง" : "OK")}`);
							else return [createTextVNode(toDisplayString(unref(error) ? "ลองอีกครั้ง" : "OK"), 1)];
						}),
						_: 1
					}, _parent));
					_push(`<!--]-->`);
				}
				_push(`</div>`);
			}
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region pages/reward-received.vue
var _sfc_setup = reward_received_vue_vue_type_script_setup_true_lang_default.setup;
reward_received_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reward-received.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var reward_received_default = /*#__PURE__*/ _plugin_vue_export_helper_default(reward_received_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-24e67fad"]]);

export { reward_received_default as default };
//# sourceMappingURL=reward-received-BiQBJE7-.mjs.map
