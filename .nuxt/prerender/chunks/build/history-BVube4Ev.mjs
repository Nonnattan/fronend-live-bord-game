import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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

var history_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  setup(__props) {
    const { profile, isReady } = useRequireProfile();
    const { isOfflineMode } = useOfflineMode();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_PageHeader = PageHeader_default;
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-1837476b>`);
      _push(ssrRenderComponent(_component_PageHeader, { title: "History" }, null, _parent));
      if (!unref(isReady)) {
        _push(`<div class="page__loading" data-v-1837476b>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "page__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="page__content" data-v-1837476b><div class="summary-card" data-v-1837476b><div class="summary-card__item" data-v-1837476b><span class="summary-card__value" data-v-1837476b>${ssrInterpolate((_b = (_a = unref(profile)) == null ? void 0 : _a.totalVisit) != null ? _b : 0)}</span><span class="summary-card__label" data-v-1837476b>\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</span></div>`);
        if (!unref(isOfflineMode)) _push(`<div class="summary-card__item" data-v-1837476b><span class="summary-card__value" data-v-1837476b>${ssrInterpolate((_d = (_c = unref(profile)) == null ? void 0 : _c.point) != null ? _d : 0)}</span><span class="summary-card__label" data-v-1837476b>\u0E04\u0E30\u0E41\u0E19\u0E19\u0E2A\u0E30\u0E2A\u0E21\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19</span></div>`);
        else _push(`<!---->`);
        _push(`</div><div class="timeline" data-v-1837476b>`);
        if ((_e = unref(profile)) == null ? void 0 : _e.registerDate) {
          _push(`<div class="timeline__item" data-v-1837476b>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-user-round-plus",
            class: "timeline__icon"
          }, null, _parent));
          _push(`<div data-v-1837476b><p class="timeline__title" data-v-1837476b>\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01</p><p class="timeline__date" data-v-1837476b>${ssrInterpolate(new Date(unref(profile).registerDate).toLocaleString("th-TH"))}</p></div></div>`);
        } else _push(`<!---->`);
        if ((_f = unref(profile)) == null ? void 0 : _f.lastLogin) {
          _push(`<div class="timeline__item" data-v-1837476b>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-log-in",
            class: "timeline__icon"
          }, null, _parent));
          _push(`<div data-v-1837476b><p class="timeline__title" data-v-1837476b>\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14</p><p class="timeline__date" data-v-1837476b>${ssrInterpolate(new Date(unref(profile).lastLogin).toLocaleString("th-TH"))}</p></div></div>`);
        } else _push(`<!---->`);
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
var _sfc_setup = history_vue_vue_type_script_setup_true_lang_default.setup;
history_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var history_default = /* @__PURE__ */ _plugin_vue_export_helper_default(history_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1837476b"]]);

export { history_default as default };
//# sourceMappingURL=history-BVube4Ev.mjs.map
