import { _ as _sfc_main } from './FormField-DIM7HDnG.mjs';
import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$1 } from './Input-03a9B_yA.mjs';
import { u as useReward } from './useReward-B60qp5Js.mjs';
import { defineComponent, ref, mergeProps, withCtx, isRef, unref, createVNode, createTextVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import './useForwardExpose-lTVrimVg.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';
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
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@iconify/utils/lib/css/icon.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/utils/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/tailwind-variants/dist/index.js';

var redeem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "redeem",
  __ssrInlineRender: true,
  setup(__props) {
    const { confirmClaim, status, isChecking, isClaiming, error } = useReward();
    const roundIdInput = ref("");
    const userIdInput = ref("");
    const displayNameInput = ref("");
    const searched = ref(false);
    function formatDateTime(value) {
      if (!value) return "-";
      const date = new Date(value.replace(" ", "T"));
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
    async function handleClaim() {
      const roundId = roundIdInput.value.trim();
      const userId = userIdInput.value.trim();
      if (!roundId || !userId) return;
      await confirmClaim(roundId, userId, displayNameInput.value.trim());
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$7;
      const _component_UFormField = _sfc_main;
      const _component_UInput = _sfc_main$1;
      const _component_UButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-f5a90402><div class="page__header" data-v-f5a90402>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-gift",
        class: "page__header-icon"
      }, null, _parent));
      _push(`<h1 class="page__title" data-v-f5a90402>\u0E08\u0E38\u0E14\u0E41\u0E25\u0E01\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25</h1><p class="page__subtitle" data-v-f5a90402>\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48 \u2014 \u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E23\u0E2D\u0E1A/\u0E23\u0E2B\u0E31\u0E2A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E25\u0E48\u0E19</p></div><div class="page__content" data-v-f5a90402><form class="search-form" data-v-f5a90402>`);
      _push(ssrRenderComponent(_component_UFormField, { label: "\u0E23\u0E2B\u0E31\u0E2A\u0E23\u0E2D\u0E1A (roundId)" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UInput, {
            modelValue: unref(roundIdInput),
            "onUpdate:modelValue": ($event) => isRef(roundIdInput) ? roundIdInput.value = $event : null,
            placeholder: "\u0E40\u0E0A\u0E48\u0E19 3f2a1b9c-...",
            size: "lg"
          }, null, _parent2, _scopeId));
          else return [createVNode(_component_UInput, {
            modelValue: unref(roundIdInput),
            "onUpdate:modelValue": ($event) => isRef(roundIdInput) ? roundIdInput.value = $event : null,
            placeholder: "\u0E40\u0E0A\u0E48\u0E19 3f2a1b9c-...",
            size: "lg"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])];
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, { label: "\u0E23\u0E2B\u0E31\u0E2A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 (userId)" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UInput, {
            modelValue: unref(userIdInput),
            "onUpdate:modelValue": ($event) => isRef(userIdInput) ? userIdInput.value = $event : null,
            placeholder: "\u0E40\u0E0A\u0E48\u0E19 M-XXXXXXXX",
            size: "lg"
          }, null, _parent2, _scopeId));
          else return [createVNode(_component_UInput, {
            modelValue: unref(userIdInput),
            "onUpdate:modelValue": ($event) => isRef(userIdInput) ? userIdInput.value = $event : null,
            placeholder: "\u0E40\u0E0A\u0E48\u0E19 M-XXXXXXXX",
            size: "lg"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])];
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, { label: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E25\u0E48\u0E19 (\u0E44\u0E21\u0E48\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A \u2014 \u0E44\u0E27\u0E49\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07)" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UInput, {
            modelValue: unref(displayNameInput),
            "onUpdate:modelValue": ($event) => isRef(displayNameInput) ? displayNameInput.value = $event : null,
            placeholder: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25",
            size: "lg"
          }, null, _parent2, _scopeId));
          else return [createVNode(_component_UInput, {
            modelValue: unref(displayNameInput),
            "onUpdate:modelValue": ($event) => isRef(displayNameInput) ? displayNameInput.value = $event : null,
            placeholder: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25",
            size: "lg"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])];
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        block: "",
        size: "lg",
        color: "primary",
        loading: unref(isChecking)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(` \u0E04\u0E49\u0E19\u0E2B\u0E32 `);
          else return [createTextVNode(" \u0E04\u0E49\u0E19\u0E2B\u0E32 ")];
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
      if (unref(error)) _push(`<p class="page__error" data-v-f5a90402>${ssrInterpolate(unref(error))}</p>`);
      else _push(`<!---->`);
      if (unref(searched) && unref(status) && !unref(error)) {
        _push(`<div class="result-card" data-v-f5a90402>`);
        if (!unref(status).reward) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-frown",
            class: "result-card__icon"
          }, null, _parent));
          _push(`<p class="result-card__title" data-v-f5a90402>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E36\u0E07\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25</p><!--]-->`);
        } else {
          _push(`<!--[--><p class="result-card__user" data-v-f5a90402>${ssrInterpolate(unref(userIdInput))}</p><p class="result-card__reward" data-v-f5a90402>${ssrInterpolate(unref(status).reward.name)}</p>`);
          if (unref(status).alreadyClaimed) {
            _push(`<p class="result-card__claimed" data-v-f5a90402>`);
            _push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-check-circle-2" }, null, _parent));
            _push(` \u0E23\u0E31\u0E1A\u0E41\u0E25\u0E49\u0E27 ${ssrInterpolate(formatDateTime(unref(status).claimedAt))}</p>`);
          } else _push(ssrRenderComponent(_component_UButton, {
            size: "xl",
            color: "primary",
            loading: unref(isClaiming),
            onClick: handleClaim
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25 `);
              else return [createTextVNode(" \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E23\u0E31\u0E1A\u0E23\u0E32\u0E07\u0E27\u0E31\u0E25 ")];
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        }
        _push(`</div>`);
      } else _push(`<!---->`);
      _push(`</div></div>`);
    };
  }
});
var _sfc_setup = redeem_vue_vue_type_script_setup_true_lang_default.setup;
redeem_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/redeem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var redeem_default = /* @__PURE__ */ _plugin_vue_export_helper_default(redeem_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f5a90402"]]);

export { redeem_default as default };
//# sourceMappingURL=redeem-BIFRb9tb.mjs.map
