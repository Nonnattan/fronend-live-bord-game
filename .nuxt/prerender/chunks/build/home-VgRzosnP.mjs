import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, d as _sfc_main$5, c as _sfc_main$2, n as navigateTo } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as useAdventure, S as STATION_TYPE_META, A as ADVENTURE_STATION_POSITIONS } from './useAdventure-oyoryhV9.mjs';
import { u as useStationMissions } from './useStationMissions-DyKPx7bx.mjs';
import { u as useStationQuest } from './useStationQuest-Bji0iII9.mjs';
import { u as useForceEndRound } from './useForceEndRound-Dv22McEm.mjs';
import { _ as _virtual_public__2Fimages_2Fadventure_map_bg_default } from './_virtual_public-BGzBxMwg.mjs';
import { defineComponent, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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
import './useMemberApi-DKl7a10r.mjs';
import './useRound-BmAVHypg.mjs';
import './useRoundSummary-C3F2b7Ya.mjs';
import './useOfflineSync-CTQBoPkt.mjs';

var MiniMap_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MiniMap",
  __ssrInlineRender: true,
  props: {
    stations: {},
    visitedIds: {}
  },
  emits: ["open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    function isVisited(stationId) {
      return props.visitedIds.includes(stationId);
    }
    function positionOf(station) {
      var _a;
      return (_a = ADVENTURE_STATION_POSITIONS[station.id]) != null ? _a : {
        x: 50,
        y: 50
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "mini-map",
        role: "button",
        tabindex: "0",
        "aria-label": "\u0E14\u0E39\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A\u0E40\u0E15\u0E47\u0E21"
      }, _attrs))} data-v-e03123d9><div class="mini-map__canvas" data-v-e03123d9><img class="mini-map__bg"${ssrRenderAttr("src", _virtual_public__2Fimages_2Fadventure_map_bg_default)} alt="\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E1F\u0E32\u0E23\u0E4C\u0E21 Adventure" draggable="false" data-v-e03123d9><!--[-->`);
      ssrRenderList(props.stations, (station) => {
        _push(`<span class="mini-map__check-slot" style="${ssrRenderStyle({
          left: `${positionOf(station).x}%`,
          top: `${positionOf(station).y}%`
        })}" data-v-e03123d9>`);
        if (isVisited(station.id)) {
          _push(`<span class="mini-map__check"${ssrRenderAttr("aria-label", `${station.name}: \u0E1C\u0E48\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27`)} data-v-e03123d9>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-check",
            class: "mini-map__check-icon"
          }, null, _parent));
          _push(`</span>`);
        } else _push(`<!---->`);
        _push(`</span>`);
      });
      _push(`<!--]--></div><div class="mini-map__footer" data-v-e03123d9><div class="mini-map__footer-text" data-v-e03123d9><p class="mini-map__title" data-v-e03123d9>Adventure Map</p><p class="mini-map__desc" data-v-e03123d9>\u0E41\u0E15\u0E30\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E34\u0E14\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E40\u0E15\u0E47\u0E21</p></div>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-chevron-right",
        class: "mini-map__chevron"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
var _sfc_setup$1 = MiniMap_vue_vue_type_script_setup_true_lang_default.setup;
MiniMap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/map/MiniMap.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var MiniMap_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(MiniMap_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e03123d9"]]), { __name: "MapMiniMap" });
var home_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "home",
  __ssrInlineRender: true,
  setup(__props) {
    const { profile, isReady } = useRequireProfile();
    const { stations, totalStations} = useAdventure();
    const { getStationMissions, isStationMissionComplete, missionProgressCount, totalPointsEarned} = useStationMissions();
    useStationQuest();
    const { roundRemainingLabel, hasActiveRoundTimer, isRoundExpired } = useRoundTimer();
    const { forceEndRoundDueToTimeout } = useForceEndRound();
    const completedStationCount = computed(() => stations.value.filter((s) => isStationMissionComplete(s.type)).length);
    const miniMapVisitedIds = computed(() => stations.value.filter((s) => isStationMissionComplete(s.type)).map((s) => s.id));
    watch(isRoundExpired, (expired) => {
      if (expired) forceEndRoundDueToTimeout("round");
    });
    function pressGo() {
      navigateTo("/starting");
    }
    function goToMapPage() {
      navigateTo("/map");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_UIcon = _sfc_main$7;
      const _component_UAvatar = _sfc_main$5;
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
        if ((_a = unref(profile)) == null ? void 0 : _a.pictureUrl) _push(ssrRenderComponent(_component_UAvatar, {
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
        _push(`<div class="greeting__text" data-v-313869fd><p class="greeting__hello" data-v-313869fd>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35</p><p class="greeting__name" data-v-313869fd>${ssrInterpolate((_b = unref(profile)) == null ? void 0 : _b.firstName)} ${ssrInterpolate((_c = unref(profile)) == null ? void 0 : _c.lastName)}</p></div>`);
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
          _push(`<p class="go-gate__title" data-v-313869fd>\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E23\u0E34\u0E48\u0E21\u0E1C\u0E08\u0E0D\u0E20\u0E31\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07?</p><p class="go-gate__desc" data-v-313869fd> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 GO \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E34\u0E14\u0E23\u0E2D\u0E1A\u0E40\u0E25\u0E48\u0E19 \u2014 \u0E21\u0E35\u0E40\u0E27\u0E25\u0E32 2 \u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07\u0E43\u0E19\u0E01\u0E32\u0E23\u0E40\u0E01\u0E47\u0E1A\u0E10\u0E32\u0E19\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E40\u0E1C\u0E48\u0E32 </p>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xl",
            color: "primary",
            class: "go-gate__button",
            onClick: pressGo
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` GO `);
              else return [createTextVNode(" GO ")];
            }),
            _: 1
          }, _parent));
          _push(`</section>`);
        } else {
          _push(`<!--[--><section class="summary-card" data-v-313869fd><div class="summary-card__top" data-v-313869fd><div class="summary-card__stat" data-v-313869fd><p class="summary-card__label" data-v-313869fd>\u0E40\u0E02\u0E49\u0E32\u0E10\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27</p><p class="summary-card__value" data-v-313869fd><span class="summary-card__value-num" data-v-313869fd>${ssrInterpolate(unref(completedStationCount))}/${ssrInterpolate(unref(totalStations))}</span></p></div><div class="summary-card__divider" data-v-313869fd></div><div class="summary-card__stat" data-v-313869fd><p class="summary-card__label" data-v-313869fd>\u0E04\u0E30\u0E41\u0E19\u0E19</p><p class="summary-card__value" data-v-313869fd><span class="summary-card__value-num" data-v-313869fd>${ssrInterpolate(unref(totalPointsEarned))}</span></p></div></div><div class="station-grid" data-v-313869fd><!--[-->`);
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
var _sfc_setup = home_vue_vue_type_script_setup_true_lang_default.setup;
home_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var home_default = /* @__PURE__ */ _plugin_vue_export_helper_default(home_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-313869fd"]]);

export { home_default as default };
//# sourceMappingURL=home-VgRzosnP.mjs.map
