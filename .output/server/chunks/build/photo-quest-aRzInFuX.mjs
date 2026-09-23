import { _ as _plugin_vue_export_helper_default, c as _sfc_main$2, b as _sfc_main$7, n as navigateTo } from '../virtual/entry.mjs';
import { B as BottomNav_default } from './BottomNav-CqvoaBRR.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { u as useOfflineSync } from './useOfflineSync-D8-RD8DK.mjs';
import { u as usePhotoQuest, a as useOfflinePhotoQuestSync } from './usePhotoQuest-CBaHJuZ3.mjs';
import { defineComponent, computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
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
import './useRound-Vyr0MdjD.mjs';

//#region components/photo-quest/QuestCard.vue?vue&type=script&setup=true&lang.ts
var QuestCard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "QuestCard",
	__ssrInlineRender: true,
	props: {
		quest: {},
		completed: { type: Boolean },
		offlineCapable: { type: Boolean },
		isOnline: { type: Boolean }
	},
	emits: ["open"],
	setup(__props, { emit: __emit }) {
		/**
		* components/photo-quest/QuestCard.vue
		* ---------------------------------------------------------------------------
		* การ์ด 1 ใบ = 1 Photo Quest ใน pages/photo-quest.vue — แสดงชื่อ/คำอธิบาย/
		* คะแนน/สถานะ (ทำสำเร็จแล้ว/ยังไม่ทำ/ทำตอนออฟไลน์ไม่ได้) ไม่มี logic ตรวจจับ
		* ใด ๆ ในไฟล์นี้เลย เป็น presentational component ล้วน ๆ
		*/
		const props = __props;
		const disabled = computed(() => !props.isOnline && !props.offlineCapable);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			_push(`<button${ssrRenderAttrs(mergeProps({
				type: "button",
				class: ["quest-card", {
					"quest-card--done": __props.completed,
					"quest-card--disabled": unref(disabled)
				}],
				disabled: unref(disabled)
			}, _attrs))} data-v-5005acc0><div class="quest-card__icon" data-v-5005acc0>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: __props.completed ? "i-lucide-check-circle-2" : "i-lucide-camera",
				class: "quest-card__icon-svg"
			}, null, _parent));
			_push(`</div><div class="quest-card__body" data-v-5005acc0><p class="quest-card__name" data-v-5005acc0>${ssrInterpolate(__props.quest.name)}</p><p class="quest-card__desc" data-v-5005acc0>${ssrInterpolate(__props.quest.description)}</p>`);
			if (unref(disabled)) _push(`<p class="quest-card__offline-note" data-v-5005acc0>ต้องมีอินเทอร์เน็ตสำหรับเควสนี้</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="quest-card__points" data-v-5005acc0>+${ssrInterpolate(__props.quest.points)}</div></button>`);
		};
	}
});
//#endregion
//#region components/photo-quest/QuestCard.vue
var _sfc_setup$1 = QuestCard_vue_vue_type_script_setup_true_lang_default.setup;
QuestCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-quest/QuestCard.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var QuestCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(QuestCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5005acc0"]]), { __name: "PhotoQuestCard" });
//#endregion
//#region pages/photo-quest.vue?vue&type=script&setup=true&lang.ts
var photo_quest_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "photo-quest",
	__ssrInlineRender: true,
	setup(__props) {
		const { isReady } = useRequireProfile();
		const { quests, completedCount, totalQuests, isLoadingQuests, loadError, usingMockData, isCompleted, canPlayOffline } = usePhotoQuest();
		const { isOnline } = useOfflineSync();
		const { hasPending, pendingCount, isSyncing, syncNow} = useOfflinePhotoQuestSync();
		const activeQuests = computed(() => quests.value.filter((q) => q.active));
		function openQuest(questId) {
			navigateTo(`/photo-quest/${questId}`);
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UButton = _sfc_main$2;
			const _component_UIcon = _sfc_main$7;
			const _component_BottomNav = BottomNav_default;
			if (unref(isReady)) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-quest-page" }, _attrs))} data-v-b1d4dac7>`);
				_push(ssrRenderComponent(_component_PageHeader, { title: "เควสถ่ายรูป" }, null, _parent));
				_push(`<div class="photo-quest-page__content" data-v-b1d4dac7><div class="photo-quest-page__summary" data-v-b1d4dac7><p class="photo-quest-page__summary-text" data-v-b1d4dac7>ทำสำเร็จแล้ว ${ssrInterpolate(unref(completedCount))}/${ssrInterpolate(unref(totalQuests))}</p>`);
				if (unref(hasPending)) _push(ssrRenderComponent(_component_UButton, {
					size: "xs",
					variant: "outline",
					loading: unref(isSyncing),
					onClick: unref(syncNow)
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Sync (${ssrInterpolate(unref(pendingCount))}) `);
						else return [createTextVNode(" Sync (" + toDisplayString(unref(pendingCount)) + ") ", 1)];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</div>`);
				if (unref(usingMockData)) {
					_push(`<p class="photo-quest-page__mock" data-v-b1d4dac7>`);
					_push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-flask-conical" }, null, _parent));
					_push(` กำลังแสดงเควสตัวอย่าง (Mock) — ยังไม่มีข้อมูลจริงจากชีต PhotoQuests </p>`);
				} else _push(`<!---->`);
				if (unref(loadError)) _push(`<p class="photo-quest-page__error" data-v-b1d4dac7>${ssrInterpolate(unref(loadError))}</p>`);
				else _push(`<!---->`);
				if (unref(isLoadingQuests)) _push(`<p class="photo-quest-page__loading" data-v-b1d4dac7>กำลังโหลดรายการเควส...</p>`);
				else _push(`<!---->`);
				if (!unref(isLoadingQuests) && unref(activeQuests).length === 0 && !unref(loadError)) _push(`<div class="photo-quest-page__empty" data-v-b1d4dac7> ยังไม่มีเควสถ่ายรูปในขณะนี้ </div>`);
				else _push(`<!---->`);
				_push(`<div class="photo-quest-page__list" data-v-b1d4dac7><!--[-->`);
				ssrRenderList(unref(activeQuests), (quest) => {
					_push(ssrRenderComponent(QuestCard_default, {
						key: quest.id,
						quest,
						completed: unref(isCompleted)(quest.id),
						"offline-capable": unref(canPlayOffline)(quest),
						"is-online": unref(isOnline),
						onOpen: ($event) => openQuest(quest.id)
					}, null, _parent));
				});
				_push(`<!--]--></div></div>`);
				_push(ssrRenderComponent(_component_BottomNav, null, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region pages/photo-quest.vue
var _sfc_setup = photo_quest_vue_vue_type_script_setup_true_lang_default.setup;
photo_quest_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/photo-quest.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var photo_quest_default = /*#__PURE__*/ _plugin_vue_export_helper_default(photo_quest_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b1d4dac7"]]);

export { photo_quest_default as default };
//# sourceMappingURL=photo-quest-aRzInFuX.mjs.map
