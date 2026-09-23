import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7, c as _sfc_main$2, n as navigateTo } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { u as useProfile } from './useProfile-Di4CdYil.mjs';
import { u as useAdventure } from './useAdventure-oyoryhV9.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { a as useQuestion, d as clearStationMissionsProgress } from './useStationMissions-DyKPx7bx.mjs';
import { c as clearStationQuestProgress } from './useStationQuest-Bji0iII9.mjs';
import { u as useAuth } from './useAuth-mwKCwQRs.mjs';
import { u as useReward } from './useReward-B60qp5Js.mjs';
import { u as useRoundScores } from './useRoundScores-CsCNUZ5E.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
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

var round_summary_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "round-summary",
  __ssrInlineRender: true,
  setup(__props) {
    const { profile, resetProfile } = useProfile();
    const { resetAuth } = useAuth();
    const { roundSummary, clearRoundSummary } = useRoundSummary();
    const { resetJourney } = useAdventure();
    const { resetAnswered } = useQuestion();
    const { isOfflineMode, clearRoundData } = useOfflineMode();
    const { status: rewardStatus, isChecking: isCheckingReward} = useReward();
    const { clearAllTimers } = useRoundTimer();
    const { stations: roundScoreStations, totalScore} = useRoundScores();
    const isReady = ref(false);
    const resultTitle = computed(() => {
      var _a;
      const reason = (_a = roundSummary.value) == null ? void 0 : _a.endedReason;
      if (reason === "round-timeout") return "\u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E23\u0E2D\u0E1A\u0E40\u0E25\u0E48\u0E19";
      if (reason === "station-timeout") return "\u0E2B\u0E21\u0E14\u0E40\u0E27\u0E25\u0E32\u0E17\u0E33\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08";
      return "\u0E08\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E25\u0E48\u0E19";
    });
    const confirmedLeave = ref(false);
    function formatDateTime(value) {
      if (!value) return "-";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "-";
      return date.toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
    async function confirmAndGoHome() {
      confirmedLeave.value = true;
      resetJourney();
      resetAnswered();
      clearAllTimers();
      clearStationQuestProgress();
      clearStationMissionsProgress();
      if (isOfflineMode.value) clearRoundData();
      clearRoundSummary();
      resetProfile();
      resetAuth();
      await navigateTo("/");
    }
    onBeforeRouteLeave(() => {
      if (confirmedLeave.value || true) return true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "phone-shell" }, _attrs))} data-v-35fbc17a><div class="phone-frame" data-v-35fbc17a>`);
      if (!unref(isReady)) {
        _push(`<div class="loading" data-v-35fbc17a>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "loading__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="summary" data-v-35fbc17a><div class="summary__scroll" data-v-35fbc17a><div class="warning-banner" data-v-35fbc17a>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-triangle-alert",
          class: "warning-banner__icon"
        }, null, _parent));
        _push(`<p class="warning-banner__text" data-v-35fbc17a> \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 \u0E08\u0E19\u0E01\u0E27\u0E48\u0E32\u0E17\u0E48\u0E32\u0E19\u0E08\u0E30\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E40\u0E25\u0E48\u0E19 </p></div><div class="result-hero" data-v-35fbc17a>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-party-popper",
          class: "result-hero__icon"
        }, null, _parent));
        _push(`<h1 class="result-hero__title" data-v-35fbc17a>${ssrInterpolate(unref(resultTitle))}</h1><p class="result-hero__prize" data-v-35fbc17a> \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25 </p>`);
        if (unref(profile)) _push(`<p class="result-hero__subtitle" data-v-35fbc17a>${ssrInterpolate(unref(profile).firstName)} ${ssrInterpolate(unref(profile).lastName)}</p>`);
        else _push(`<!---->`);
        _push(`</div>`);
        if (unref(roundSummary)) {
          _push(`<div class="info-card" data-v-35fbc17a><div class="info-card__row" data-v-35fbc17a>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-badge-check",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-35fbc17a><p class="info-card__label" data-v-35fbc17a>\u0E23\u0E2B\u0E31\u0E2A\u0E23\u0E2D\u0E1A (roundId)</p><p class="info-card__value" data-v-35fbc17a>${ssrInterpolate((_a = unref(roundSummary).roundId) != null ? _a : "-")}</p></div></div><div class="info-card__row" data-v-35fbc17a>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-user-round",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-35fbc17a><p class="info-card__label" data-v-35fbc17a>\u0E23\u0E2B\u0E31\u0E2A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 (userId)</p><p class="info-card__value" data-v-35fbc17a>${ssrInterpolate((_b = unref(roundSummary).userId) != null ? _b : "-")}</p></div></div></div>`);
        } else _push(`<!---->`);
        if (!unref(roundSummary)) {
          _push(`<div class="empty-state" data-v-35fbc17a><p class="empty-state__desc" data-v-35fbc17a>\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E23\u0E38\u0E1B\u0E1C\u0E25\u0E02\u0E2D\u0E07\u0E23\u0E2D\u0E1A\u0E19\u0E35\u0E49</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "primary",
            onClick: confirmAndGoHome
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(`\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01`);
              else return [createTextVNode("\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!--[--><div class="info-card" data-v-35fbc17a><div class="info-card__row" data-v-35fbc17a>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-play",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-35fbc17a><p class="info-card__label" data-v-35fbc17a>\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E40\u0E25\u0E48\u0E19</p><p class="info-card__value" data-v-35fbc17a>${ssrInterpolate(formatDateTime(unref(roundSummary).startTime))}</p></div></div><div class="info-card__row" data-v-35fbc17a>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-flag",
            class: "info-card__icon"
          }, null, _parent));
          _push(`<div class="info-card__text" data-v-35fbc17a><p class="info-card__label" data-v-35fbc17a>\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E08\u0E1A\u0E40\u0E01\u0E21</p><p class="info-card__value" data-v-35fbc17a>${ssrInterpolate(formatDateTime(unref(roundSummary).endTime))}</p></div></div></div>`);
          if (unref(roundSummary).mode === "offline") _push(`<div class="info-card" data-v-35fbc17a></div>`);
          else {
            _push(`<!--[--><div class="info-card" data-v-35fbc17a><p class="info-card__list-title" data-v-35fbc17a>\u0E10\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E48\u0E32\u0E19\u0E40\u0E25\u0E48\u0E19</p>`);
            if (unref(roundScoreStations).length) {
              _push(`<ul class="station-list" data-v-35fbc17a><!--[-->`);
              ssrRenderList(unref(roundScoreStations), (station) => {
                _push(`<li class="station-list__item" data-v-35fbc17a><span class="station-list__name" data-v-35fbc17a>${ssrInterpolate(station.stationName)}</span><span class="station-list__points" data-v-35fbc17a>+${ssrInterpolate(station.point + station.questionPoint + station.missionQrPoint)}</span></li>`);
              });
              _push(`<!--]--></ul>`);
            } else _push(`<p class="empty-state__desc" data-v-35fbc17a> \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E02\u0E49\u0E32\u0E10\u0E32\u0E19\u0E43\u0E14\u0E40\u0E25\u0E22\u0E43\u0E19\u0E23\u0E2D\u0E1A\u0E19\u0E35\u0E49 </p>`);
            _push(`</div><div class="total-card" data-v-35fbc17a><p class="total-card__label" data-v-35fbc17a>\u0E04\u0E30\u0E41\u0E19\u0E19\u0E23\u0E27\u0E21\u0E02\u0E2D\u0E07\u0E23\u0E2D\u0E1A\u0E19\u0E35\u0E49</p><p class="total-card__value" data-v-35fbc17a><span class="total-card__value-num" data-v-35fbc17a>${ssrInterpolate(unref(totalScore))}</span><span class="total-card__unit" data-v-35fbc17a>Point</span></p></div><!--]-->`);
          }
          if (unref(isCheckingReward)) {
            _push(`<div class="reward-card reward-card--loading" data-v-35fbc17a>`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-loader-2",
              class: "reward-card__spinner"
            }, null, _parent));
            _push(` \u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25... </div>`);
          } else if ((_c = unref(rewardStatus)) == null ? void 0 : _c.reward) {
            _push(`<div class="reward-card" data-v-35fbc17a>`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-gift",
              class: "reward-card__icon"
            }, null, _parent));
            _push(`<p class="reward-card__label" data-v-35fbc17a>\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13</p><p class="reward-card__name" data-v-35fbc17a>${ssrInterpolate(unref(rewardStatus).reward.name)}</p>`);
            if (unref(rewardStatus).alreadyClaimed) {
              _push(`<p class="reward-card__status reward-card__status--done" data-v-35fbc17a>`);
              _push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-check-circle-2" }, null, _parent));
              _push(` \u0E23\u0E31\u0E1A\u0E41\u0E25\u0E49\u0E27 ${ssrInterpolate(formatDateTime(unref(rewardStatus).claimedAt))}</p>`);
            } else _push(`<p class="reward-card__status" data-v-35fbc17a> \u0E01\u0E23\u0E38\u0E13\u0E32\u0E41\u0E08\u0E49\u0E07\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E17\u0E35\u0E48\u0E08\u0E38\u0E14\u0E41\u0E25\u0E01\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E23\u0E31\u0E1A\u0E02\u0E2D\u0E07\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25 </p>`);
            _push(`</div>`);
          } else _push(`<!---->`);
          if (unref(isOfflineMode)) _push(ssrRenderComponent(_component_UButton, {
            block: "",
            size: "xl",
            color: "primary",
            icon: "i-lucide-check-circle-2",
            onClick: confirmAndGoHome
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` \u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27 / \u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01 `);
              else return [createTextVNode(" \u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27 / \u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01 ")];
            }),
            _: 1
          }, _parent));
          else {
            _push(`<div class="waiting-indicator" data-v-35fbc17a>`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-loader-2",
              class: "waiting-indicator__spinner"
            }, null, _parent));
            _push(`<p class="waiting-indicator__text" data-v-35fbc17a> \u0E01\u0E33\u0E25\u0E31\u0E07\u0E23\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25... </p></div>`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
var _sfc_setup = round_summary_vue_vue_type_script_setup_true_lang_default.setup;
round_summary_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/round-summary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var round_summary_default = /* @__PURE__ */ _plugin_vue_export_helper_default(round_summary_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-35fbc17a"]]);

export { round_summary_default as default };
//# sourceMappingURL=round-summary-BiVCuPlw.mjs.map
