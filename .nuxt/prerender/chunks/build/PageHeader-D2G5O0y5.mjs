import { _ as _plugin_vue_export_helper_default, N as NuxtLink, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';

var PageHeader_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    backTo: { default: "/home" },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = NuxtLink;
      const _component_UIcon = _sfc_main$7;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "page-header" }, _attrs))} data-v-612c8e99>`);
      if (__props.showBack) _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.backTo,
        class: "page-header__back",
        "aria-label": "\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-chevron-left",
            class: "page-header__back-icon"
          }, null, _parent2, _scopeId));
          else return [createVNode(_component_UIcon, {
            name: "i-lucide-chevron-left",
            class: "page-header__back-icon"
          })];
        }),
        _: 1
      }, _parent));
      else _push(`<span class="page-header__back-spacer" data-v-612c8e99></span>`);
      _push(`<h1 class="page-header__title" data-v-612c8e99>${ssrInterpolate(__props.title)}</h1><span class="page-header__spacer" data-v-612c8e99></span></header>`);
    };
  }
});
var _sfc_setup = PageHeader_vue_vue_type_script_setup_true_lang_default.setup;
PageHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PageHeader_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(PageHeader_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-612c8e99"]]), { __name: "PageHeader" });

export { PageHeader_default as P };
//# sourceMappingURL=PageHeader-D2G5O0y5.mjs.map
