import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, n as navigateTo } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as useAdventure, S as STATION_TYPE_META } from './useAdventure-oyoryhV9.mjs';
import { u as useStationMissions } from './useStationMissions-DyKPx7bx.mjs';
import { u as useStationQuest } from './useStationQuest-Bji0iII9.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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

var StationSelectionCard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "StationSelectionCard",
  __ssrInlineRender: true,
  props: {
    station: {},
    cardState: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
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
      if (__props.cardState.totalMissions > 0) _push(`<span class="station-card__progress" data-v-2eb686da> \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08 ${ssrInterpolate(__props.cardState.completedMissions)}/${ssrInterpolate(__props.cardState.totalMissions)}</span>`);
      else _push(`<!---->`);
      _push(`<span class="station-card__status" data-v-2eb686da>`);
      if (unref(variant) === "completed") _push(`<!--[-->\u2713 \u0E17\u0E33\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27<!--]-->`);
      else if (unref(variant) === "accessible") _push(`<!--[-->\u{1F513} \u0E40\u0E02\u0E49\u0E32\u0E44\u0E14\u0E49<!--]-->`);
      else _push(`<!--[-->\u{1F512} \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1B\u0E25\u0E14\u0E25\u0E47\u0E2D\u0E04<!--]-->`);
      _push(`</span>`);
      if (unref(variant) === "needs-rescan") _push(`<span class="station-card__hint" data-v-2eb686da> \u0E2A\u0E41\u0E01\u0E19 QR \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E02\u0E49\u0E32\u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D </span>`);
      else _push(`<!---->`);
      _push(`</button>`);
    };
  }
});
var _sfc_setup$2 = StationSelectionCard_vue_vue_type_script_setup_true_lang_default.setup;
StationSelectionCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationSelectionCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var StationSelectionCard_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(StationSelectionCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2eb686da"]]), { __name: "StationSelectionCard" });
var StationSelectionGrid_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "StationSelectionGrid",
  __ssrInlineRender: true,
  props: {
    stations: {},
    cardStates: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
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
var _sfc_setup$1 = StationSelectionGrid_vue_vue_type_script_setup_true_lang_default.setup;
StationSelectionGrid_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationSelectionGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var StationSelectionGrid_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(StationSelectionGrid_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ac3fe301"]]), { __name: "StationSelectionGrid" });
var stations_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "stations",
  __ssrInlineRender: true,
  setup(__props) {
    const { isReady } = useRequireProfile();
    const { stations} = useAdventure();
    const { getStationCardState} = useStationQuest();
    useStationMissions();
    const STATION_ORDER = [
      "corn",
      "cow",
      "soil",
      "milk"
    ];
    const stationList = computed(() => STATION_ORDER.map((id) => {
      var _a, _b;
      return {
        id,
        name: (_b = (_a = stations.value.find((s) => s.id === id)) == null ? void 0 : _a.name) != null ? _b : STATION_TYPE_META[id].label,
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
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-edfed618>`);
      _push(ssrRenderComponent(_component_PageHeader, { title: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E10\u0E32\u0E19" }, null, _parent));
      if (!unref(isReady)) {
        _push(`<div class="page__loading" data-v-edfed618>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "page__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="page__content" data-v-edfed618><p class="page__hint" data-v-edfed618>\u0E41\u0E15\u0E30\u0E10\u0E32\u0E19\u0E17\u0E35\u0E48\u0E1B\u0E25\u0E14\u0E25\u0E47\u0E2D\u0E04\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E17\u0E33\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08</p>`);
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
var _sfc_setup = stations_vue_vue_type_script_setup_true_lang_default.setup;
stations_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var stations_default = /* @__PURE__ */ _plugin_vue_export_helper_default(stations_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-edfed618"]]);

export { stations_default as default };
//# sourceMappingURL=stations-CoE-K6EP.mjs.map
