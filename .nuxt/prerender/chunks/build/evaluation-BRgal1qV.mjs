import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7, c as _sfc_main$2, n as navigateTo } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useMemberApi } from './useMemberApi-DKl7a10r.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as useAdventure, S as STATION_TYPE_META } from './useAdventure-oyoryhV9.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { u as useStationMissions } from './useStationMissions-DyKPx7bx.mjs';
import { u as useStationQuest } from './useStationQuest-Bji0iII9.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nostics/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nostics/dist/formatters/ansi.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/hookable/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/unctx/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/h3/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ufo/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue-router/vue-router.node.mjs';
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
import './useProfile-Di4CdYil.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/zod/index.js';

var evaluation_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "evaluation",
  __ssrInlineRender: true,
  setup(__props) {
    const { profile, isReady } = useRequireProfile();
    const { stations } = useAdventure();
    const { isOfflineMode, endRound } = useOfflineMode();
    const { currentRoundId, endCurrentRound } = useRound();
    const { submitSurvey } = useMemberApi();
    const { saveRoundSummary } = useRoundSummary();
    const { setFavoriteStation} = useStationQuest();
    const { isStationMissionComplete} = useStationMissions();
    const STATION_ORDER = [
      "corn",
      "cow",
      "soil",
      "milk"
    ];
    const RATING_BY_STATION = {
      corn: 1,
      soil: 2,
      cow: 3,
      milk: 4
    };
    const stationChoices = computed(() => STATION_ORDER.map((id) => {
      var _a, _b;
      return {
        id,
        name: (_b = (_a = stations.value.find((s) => s.id === id)) == null ? void 0 : _a.name) != null ? _b : STATION_TYPE_META[id].label,
        icon: STATION_TYPE_META[id].icon
      };
    }));
    const selectedFavoriteStationId = ref(null);
    const submitting = ref(false);
    async function handleSubmit() {
      var _a, _b, _c;
      if (!selectedFavoriteStationId.value || submitting.value) return;
      submitting.value = true;
      try {
        setFavoriteStation(selectedFavoriteStationId.value);
        const roundIdForSummary = currentRoundId.value;
        const userIdForSummary = ((_a = profile.value) == null ? void 0 : _a.memberId) || ((_b = profile.value) == null ? void 0 : _b.uid) || null;
        let startTimeIso = null;
        let endTimeIso = (/* @__PURE__ */ new Date()).toISOString();
        const completedStations = STATION_ORDER.filter((id) => isStationMissionComplete(id)).map((id) => {
          var _a2, _b2;
          return {
            name: (_b2 = (_a2 = stationChoices.value.find((s) => s.id === id)) == null ? void 0 : _a2.name) != null ? _b2 : id,
            points: 0
          };
        });
        if (isOfflineMode.value) endRound();
        else if (((_c = profile.value) == null ? void 0 : _c.memberId) && roundIdForSummary) {
          try {
            await submitSurvey({
              roundId: roundIdForSummary,
              userId: profile.value.memberId,
              firstName: profile.value.firstName,
              favoriteStationRating: RATING_BY_STATION[selectedFavoriteStationId.value]
            });
          } catch (err) {
            console.error("[evaluation] submitSurvey failed", err);
          }
          const ended = await endCurrentRound(profile.value.memberId);
          if (ended) {
            startTimeIso = ended.startTime || null;
            endTimeIso = ended.endTime || endTimeIso;
          }
        }
        saveRoundSummary({
          mode: isOfflineMode.value ? "offline" : "online",
          startTime: startTimeIso,
          endTime: endTimeIso,
          stations: completedStations,
          totalPoint: null,
          roundId: isOfflineMode.value ? null : roundIdForSummary,
          userId: userIdForSummary,
          endedReason: "manual"
        });
      } finally {
        submitting.value = false;
      }
      await navigateTo("/round-summary");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = PageHeader_default;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-d5180d09>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19",
        "back-to": "/stations"
      }, null, _parent));
      if (!unref(isReady)) {
        _push(`<div class="page__loading" data-v-d5180d09>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "page__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="page__content" data-v-d5180d09><p class="page__question" data-v-d5180d09>\u0E17\u0E48\u0E32\u0E19\u0E0A\u0E2D\u0E1A\u0E10\u0E32\u0E19\u0E43\u0E14\u0E21\u0E32\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14?</p><div class="choice-list" data-v-d5180d09><!--[-->`);
        ssrRenderList(unref(stationChoices), (choice) => {
          _push(`<button type="button" class="${ssrRenderClass([{ "choice--selected": unref(selectedFavoriteStationId) === choice.id }, "choice"])}" data-v-d5180d09><span class="choice__icon" data-v-d5180d09>${ssrInterpolate(choice.icon)}</span><span class="choice__name" data-v-d5180d09>${ssrInterpolate(choice.name)}</span></button>`);
        });
        _push(`<!--]--></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          block: "",
          size: "xl",
          color: "primary",
          loading: unref(submitting),
          disabled: !unref(selectedFavoriteStationId) || unref(submitting),
          onClick: handleSubmit
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(` \u0E2A\u0E48\u0E07\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19 `);
            else return [createTextVNode(" \u0E2A\u0E48\u0E07\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19 ")];
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
var _sfc_setup = evaluation_vue_vue_type_script_setup_true_lang_default.setup;
evaluation_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/evaluation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var evaluation_default = /* @__PURE__ */ _plugin_vue_export_helper_default(evaluation_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-d5180d09"]]);

export { evaluation_default as default };
//# sourceMappingURL=evaluation-BRgal1qV.mjs.map
