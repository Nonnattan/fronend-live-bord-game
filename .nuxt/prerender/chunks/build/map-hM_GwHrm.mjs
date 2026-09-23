import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as useAdventure, a as ADVENTURE_START_POINT, A as ADVENTURE_STATION_POSITIONS } from './useAdventure-oyoryhV9.mjs';
import { u as useStationMissions } from './useStationMissions-DyKPx7bx.mjs';
import { _ as _virtual_public__2Fimages_2Fadventure_map_bg_default } from './_virtual_public-BGzBxMwg.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderStyle } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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

var AdventureMap_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "AdventureMap",
  __ssrInlineRender: true,
  props: {
    stations: {},
    visitedIds: {}
  },
  setup(__props) {
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "adventure-map" }, _attrs))} data-v-61816528><img class="adventure-map__bg"${ssrRenderAttr("src", _virtual_public__2Fimages_2Fadventure_map_bg_default)} alt="\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E1F\u0E32\u0E23\u0E4C\u0E21 Adventure" draggable="false" data-v-61816528><!--[-->`);
      ssrRenderList(props.stations, (station) => {
        _push(`<div class="station-check-slot" style="${ssrRenderStyle({
          left: `${positionOf(station).x}%`,
          top: `${positionOf(station).y}%`
        })}" data-v-61816528>`);
        if (isVisited(station.id)) {
          _push(`<span class="station-check"${ssrRenderAttr("aria-label", `${station.name}: \u0E1C\u0E48\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27`)} data-v-61816528>`);
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
      })}" data-v-61816528><span class="start-point__badge" aria-label="\u0E08\u0E38\u0E14\u0E17\u0E35\u0E48\u0E17\u0E48\u0E32\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E40\u0E25\u0E48\u0E19" data-v-61816528>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-flag",
        class: "start-point__icon"
      }, null, _parent));
      _push(`</span><span class="start-point__label" data-v-61816528>\u0E08\u0E38\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</span></div></div>`);
    };
  }
});
var _sfc_setup$1 = AdventureMap_vue_vue_type_script_setup_true_lang_default.setup;
AdventureMap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/map/AdventureMap.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AdventureMap_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(AdventureMap_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-61816528"]]), { __name: "MapAdventureMap" });
var map_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "map",
  __ssrInlineRender: true,
  setup(__props) {
    const { isReady } = useRequireProfile();
    const { stations} = useAdventure();
    const { isStationMissionComplete } = useStationMissions();
    const visitedIds = computed(() => stations.value.filter((s) => isStationMissionComplete(s.type)).map((s) => s.id));
    useRoundTimer();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = PageHeader_default;
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-0d123928>`);
      _push(ssrRenderComponent(_component_PageHeader, { title: "Adventure Map" }, null, _parent));
      if (!unref(isReady)) {
        _push(`<div class="page__loading" data-v-0d123928>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "page__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="map-page" data-v-0d123928>`);
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
var _sfc_setup = map_vue_vue_type_script_setup_true_lang_default.setup;
map_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/map.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var map_default = /* @__PURE__ */ _plugin_vue_export_helper_default(map_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0d123928"]]);

export { map_default as default };
//# sourceMappingURL=map-hM_GwHrm.mjs.map
