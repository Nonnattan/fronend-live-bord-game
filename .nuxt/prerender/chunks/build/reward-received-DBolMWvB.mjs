import { _ as _plugin_vue_export_helper_default, c as _sfc_main$2, b as _sfc_main$7, n as navigateTo } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { u as useProfile } from './useProfile-Di4CdYil.mjs';
import { u as useAdventure } from './useAdventure-oyoryhV9.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { a as useQuestion, d as clearStationMissionsProgress } from './useStationMissions-DyKPx7bx.mjs';
import { c as clearStationQuestProgress } from './useStationQuest-Bji0iII9.mjs';
import { u as useAuth } from './useAuth-mwKCwQRs.mjs';
import { u as useReward } from './useReward-B60qp5Js.mjs';
import { u as useRoundScores } from './useRoundScores-CsCNUZ5E.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { onBeforeRouteLeave } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue-router/vue-router.node.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nostics/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nostics/dist/formatters/ansi.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/hookable/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/unctx/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/h3/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ufo/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/defu/dist/defu.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nuxt/node_modules/unhead/dist/utils.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'node:async_hooks';
import '../_/nitro.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/destr/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nitropack/node_modules/hookable/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/node-mock-http/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/unstorage/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/unstorage/drivers/fs.mjs';
import 'file:///C:/xampp/htdocs/fronend-live-bord-game/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/klona/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/scule/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/pathe/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@iconify/utils/lib/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/consola/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@nuxt/nitro-server/node_modules/unhead/dist/server.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nuxt/node_modules/unhead/dist/legacy.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nuxt/node_modules/unhead/dist/plugins.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/devalue/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@iconify/vue/dist/iconify.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/tailwindcss/dist/colors.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@iconify/utils/lib/css/icon.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/utils/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/tailwind-variants/dist/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/zod/index.js';
import './useMemberApi-DKl7a10r.mjs';
import './useRound-BmAVHypg.mjs';

var reward_received_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
    const confirmedLeave = ref(false);
    const hasValidRound = computed(() => {
      var _a, _b;
      return !!((_a = roundSummary.value) == null ? void 0 : _a.roundId) && !!((_b = roundSummary.value) == null ? void 0 : _b.userId);
    });
    const rewardName = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = status.value) == null ? void 0 : _a.reward) == null ? void 0 : _b.name) != null ? _c : "-";
    });
    onBeforeRouteLeave(() => {
      if (confirmedLeave.value || true) return true;
    });
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
    async function handleGoHomeFromEmptyState() {
      confirmedLeave.value = true;
      await navigateTo("/");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = _sfc_main$2;
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "phone-shell" }, _attrs))} data-v-951f6e47><div class="phone-frame" data-v-951f6e47>`);
      if (!unref(isReady)) _push(`<div class="loading" data-v-951f6e47><p class="loading__text" data-v-951f6e47>\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48...</p></div>`);
      else {
        _push(`<div class="content" data-v-951f6e47>`);
        if (!unref(hasValidRound)) {
          _push(`<div class="empty-state" data-v-951f6e47><p class="empty-state__desc" data-v-951f6e47>\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25\u0E02\u0E2D\u0E07\u0E23\u0E2D\u0E1A\u0E19\u0E35\u0E49</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "primary",
            onClick: handleGoHomeFromEmptyState
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(`\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01`);
              else return [createTextVNode("\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!--[--><div class="result-hero" data-v-951f6e47>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-party-popper",
            class: "result-hero__icon"
          }, null, _parent));
          _push(`<h1 class="result-hero__title" data-v-951f6e47>\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25\u0E41\u0E25\u0E49\u0E27</h1>`);
          if (unref(profile)) _push(`<p class="result-hero__subtitle" data-v-951f6e47>${ssrInterpolate(unref(profile).firstName)} ${ssrInterpolate(unref(profile).lastName)}</p>`);
          else _push(`<!---->`);
          _push(`</div><div class="info-card" data-v-951f6e47><div class="info-card__row" data-v-951f6e47>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-gift",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-951f6e47><p class="info-card__label" data-v-951f6e47>\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25\u0E17\u0E35\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A</p><p class="info-card__value info-card__value--reward" data-v-951f6e47>${ssrInterpolate(unref(rewardName))}</p></div></div><div class="info-card__row" data-v-951f6e47>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-badge-check",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-951f6e47><p class="info-card__label" data-v-951f6e47>\u0E23\u0E2B\u0E31\u0E2A\u0E23\u0E2D\u0E1A (roundId)</p><p class="info-card__value" data-v-951f6e47>${ssrInterpolate((_a = unref(roundSummary)) == null ? void 0 : _a.roundId)}</p></div></div><div class="info-card__row" data-v-951f6e47>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-check-circle-2",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-951f6e47><p class="info-card__label" data-v-951f6e47>\u0E2A\u0E16\u0E32\u0E19\u0E30</p><p class="info-card__value" data-v-951f6e47> \u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E21\u0E2D\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25\u0E41\u0E25\u0E49\u0E27 \u2014 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E14 OK \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25 </p></div></div></div><div class="info-card" data-v-951f6e47><p class="info-card__list-title" data-v-951f6e47>\u0E04\u0E30\u0E41\u0E19\u0E19\u0E23\u0E27\u0E21\u0E02\u0E2D\u0E07\u0E23\u0E2D\u0E1A\u0E19\u0E35\u0E49</p>`);
          if (unref(roundScoreStations).length) {
            _push(`<ul class="station-list" data-v-951f6e47><!--[-->`);
            ssrRenderList(unref(roundScoreStations), (station) => {
              _push(`<li class="station-list__item" data-v-951f6e47><span class="station-list__name" data-v-951f6e47>${ssrInterpolate(station.stationName)}</span><span class="station-list__points" data-v-951f6e47>+${ssrInterpolate(station.point + station.questionPoint + station.missionQrPoint)}</span></li>`);
            });
            _push(`<!--]--></ul>`);
          } else _push(`<!---->`);
          _push(`<p class="score-card__total" data-v-951f6e47><span class="score-card__total-num" data-v-951f6e47>${ssrInterpolate(unref(totalScore))}</span><span class="score-card__total-unit" data-v-951f6e47>Point</span></p></div>`);
          if (unref(error)) _push(`<p class="error-text" data-v-951f6e47>${ssrInterpolate(unref(error))}</p>`);
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
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(`${ssrInterpolate(unref(error) ? "\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07" : "OK")}`);
              else return [createTextVNode(toDisplayString(unref(error) ? "\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07" : "OK"), 1)];
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
var _sfc_setup = reward_received_vue_vue_type_script_setup_true_lang_default.setup;
reward_received_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reward-received.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var reward_received_default = /* @__PURE__ */ _plugin_vue_export_helper_default(reward_received_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-951f6e47"]]);

export { reward_received_default as default };
//# sourceMappingURL=reward-received-DBolMWvB.mjs.map
