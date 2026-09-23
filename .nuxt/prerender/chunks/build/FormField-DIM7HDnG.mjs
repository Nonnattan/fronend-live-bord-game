import { u as useForwardExpose } from './useForwardExpose-lTVrimVg.mjs';
import { g as useComponentProps, h as useAppConfig, t as tv, m as formErrorsInjectionKey, o as formInputsInjectionKey, E as inputIdInjectionKey, G as formFieldInjectionKey, P as Primitive } from '../virtual/entry.mjs';
import { useSlots, computed, inject, ref, useId, watch, provide, unref, mergeProps, withCtx, renderSlot, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, defineComponent, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderAttr } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';

var Label_default = /* @__PURE__ */ defineComponent({
  __name: "Label",
  props: {
    for: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "label"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { onMousedown: _cache[0] || (_cache[0] = (event) => {
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var virtual_nuxt__nuxt_2Fui_2Fform_field_default = {
  "slots": {
    "root": "",
    "wrapper": "",
    "labelWrapper": "flex content-center items-center justify-between gap-1",
    "label": "block font-medium text-default",
    "container": "relative",
    "description": "text-muted",
    "error": "mt-2 text-error",
    "hint": "text-muted",
    "help": "mt-2 text-muted"
  },
  "variants": {
    "size": {
      "xs": { "root": "text-xs" },
      "sm": { "root": "text-xs" },
      "md": { "root": "text-sm" },
      "lg": { "root": "text-sm" },
      "xl": { "root": "text-base" }
    },
    "required": { "true": { "label": "after:content-['*'] after:ms-0.5 after:text-error" } },
    "orientation": {
      "vertical": { "container": "mt-1" },
      "horizontal": { "root": "flex justify-between place-items-baseline gap-2" }
    }
  },
  "defaultVariants": { "size": "md" }
};
var _sfc_main = {
  __name: "UFormField",
  __ssrInlineRender: true,
  props: {
    as: {
      type: null,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    errorPattern: {
      type: null,
      required: false
    },
    label: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    help: {
      type: String,
      required: false
    },
    error: {
      type: [Boolean, String],
      required: false,
      default: void 0
    },
    hint: {
      type: String,
      required: false
    },
    size: {
      type: null,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    },
    eagerValidation: {
      type: Boolean,
      required: false
    },
    validateOnInputDelay: {
      type: Number,
      required: false
    },
    orientation: {
      type: null,
      required: false,
      default: "vertical"
    },
    class: {
      type: null,
      required: false
    },
    ui: {
      type: Object,
      required: false
    }
  },
  setup(__props) {
    const _props = __props;
    const slots = useSlots();
    const props = useComponentProps("formField", _props);
    const appConfig = useAppConfig();
    const ui = computed(() => {
      var _a;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Fform_field_default,
        ...((_a = appConfig.ui) == null ? void 0 : _a.formField) || {}
      })({
        size: props.size,
        required: props.required,
        orientation: props.orientation
      });
    });
    const formErrors = inject(formErrorsInjectionKey, null);
    const error = computed(() => {
      var _a, _b;
      return props.error || ((_b = (_a = formErrors == null ? void 0 : formErrors.value) == null ? void 0 : _a.find((error2) => {
        var _a2;
        return error2.name === props.name || props.errorPattern && ((_a2 = error2.name) == null ? void 0 : _a2.match(props.errorPattern));
      })) == null ? void 0 : _b.message);
    });
    const id = ref(useId());
    const ariaId = id.value;
    const formInputs = inject(formInputsInjectionKey, void 0);
    watch(id, () => {
      if (formInputs && props.name) formInputs.value[props.name] = {
        id: id.value,
        pattern: props.errorPattern
      };
    }, { immediate: true });
    provide(inputIdInjectionKey, id);
    provide(formFieldInjectionKey, computed(() => ({
      error: error.value,
      name: props.name,
      size: props.size,
      eagerValidation: props.eagerValidation,
      validateOnInputDelay: props.validateOnInputDelay,
      errorPattern: props.errorPattern,
      hint: props.hint,
      description: props.description,
      help: props.help,
      ariaId
    })));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: unref(props).as,
        "data-orientation": unref(props).orientation,
        "data-slot": "root",
        class: ui.value.root({ class: [(_a = unref(props).ui) == null ? void 0 : _a.root, unref(props).class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.wrapper }))}"${_scopeId}>`);
            if (unref(props).label || !!slots.label) {
              _push2(`<div data-slot="labelWrapper" class="${ssrRenderClass(ui.value.labelWrapper({ class: (_b = unref(props).ui) == null ? void 0 : _b.labelWrapper }))}"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Label_default), {
                for: id.value,
                "data-slot": "label",
                class: ui.value.label({ class: (_c = unref(props).ui) == null ? void 0 : _c.label })
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) ssrRenderSlot(_ctx.$slots, "label", { label: unref(props).label }, () => {
                    _push3(`${ssrInterpolate(unref(props).label)}`);
                  }, _push3, _parent3, _scopeId2);
                  else return [renderSlot(_ctx.$slots, "label", { label: unref(props).label }, () => [createTextVNode(toDisplayString(unref(props).label), 1)])];
                }),
                _: 3
              }, _parent2, _scopeId));
              if (unref(props).hint || !!slots.hint) {
                _push2(`<span${ssrRenderAttr("id", `${unref(ariaId)}-hint`)} data-slot="hint" class="${ssrRenderClass(ui.value.hint({ class: (_d = unref(props).ui) == null ? void 0 : _d.hint }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, "hint", { hint: unref(props).hint }, () => {
                  _push2(`${ssrInterpolate(unref(props).hint)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</span>`);
              } else _push2(`<!---->`);
              _push2(`</div>`);
            } else _push2(`<!---->`);
            if (unref(props).description || !!slots.description) {
              _push2(`<p${ssrRenderAttr("id", `${unref(ariaId)}-description`)} data-slot="description" class="${ssrRenderClass(ui.value.description({ class: (_e = unref(props).ui) == null ? void 0 : _e.description }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "description", { description: unref(props).description }, () => {
                _push2(`${ssrInterpolate(unref(props).description)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</p>`);
            } else _push2(`<!---->`);
            _push2(`</div><div class="${ssrRenderClass([(unref(props).label || !!slots.label || unref(props).description || !!slots.description) && ui.value.container({ class: (_f = unref(props).ui) == null ? void 0 : _f.container })])}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", { error: error.value }, null, _push2, _parent2, _scopeId);
            if (unref(props).error !== false && (typeof error.value === "string" && error.value || !!slots.error)) {
              _push2(`<div${ssrRenderAttr("id", `${unref(ariaId)}-error`)} data-slot="error" class="${ssrRenderClass(ui.value.error({ class: (_g = unref(props).ui) == null ? void 0 : _g.error }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "error", { error: error.value }, () => {
                _push2(`${ssrInterpolate(error.value)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else if (unref(props).help || !!slots.help) {
              _push2(`<div${ssrRenderAttr("id", `${unref(ariaId)}-help`)} data-slot="help" class="${ssrRenderClass(ui.value.help({ class: (_h = unref(props).ui) == null ? void 0 : _h.help }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "help", { help: unref(props).help }, () => {
                _push2(`${ssrInterpolate(unref(props).help)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else _push2(`<!---->`);
            _push2(`</div>`);
          } else return [createVNode("div", {
            "data-slot": "wrapper",
            class: ui.value.wrapper({ class: (_i = unref(props).ui) == null ? void 0 : _i.wrapper })
          }, [unref(props).label || !!slots.label ? (openBlock(), createBlock("div", {
            key: 0,
            "data-slot": "labelWrapper",
            class: ui.value.labelWrapper({ class: (_j = unref(props).ui) == null ? void 0 : _j.labelWrapper })
          }, [createVNode(unref(Label_default), {
            for: id.value,
            "data-slot": "label",
            class: ui.value.label({ class: (_k = unref(props).ui) == null ? void 0 : _k.label })
          }, {
            default: withCtx(() => [renderSlot(_ctx.$slots, "label", { label: unref(props).label }, () => [createTextVNode(toDisplayString(unref(props).label), 1)])]),
            _: 3
          }, 8, ["for", "class"]), unref(props).hint || !!slots.hint ? (openBlock(), createBlock("span", {
            key: 0,
            id: `${unref(ariaId)}-hint`,
            "data-slot": "hint",
            class: ui.value.hint({ class: (_l = unref(props).ui) == null ? void 0 : _l.hint })
          }, [renderSlot(_ctx.$slots, "hint", { hint: unref(props).hint }, () => [createTextVNode(toDisplayString(unref(props).hint), 1)])], 10, ["id"])) : createCommentVNode("", true)], 2)) : createCommentVNode("", true), unref(props).description || !!slots.description ? (openBlock(), createBlock("p", {
            key: 1,
            id: `${unref(ariaId)}-description`,
            "data-slot": "description",
            class: ui.value.description({ class: (_m = unref(props).ui) == null ? void 0 : _m.description })
          }, [renderSlot(_ctx.$slots, "description", { description: unref(props).description }, () => [createTextVNode(toDisplayString(unref(props).description), 1)])], 10, ["id"])) : createCommentVNode("", true)], 2), createVNode("div", { class: [(unref(props).label || !!slots.label || unref(props).description || !!slots.description) && ui.value.container({ class: (_n = unref(props).ui) == null ? void 0 : _n.container })] }, [renderSlot(_ctx.$slots, "default", { error: error.value }), unref(props).error !== false && (typeof error.value === "string" && error.value || !!slots.error) ? (openBlock(), createBlock("div", {
            key: 0,
            id: `${unref(ariaId)}-error`,
            "data-slot": "error",
            class: ui.value.error({ class: (_o = unref(props).ui) == null ? void 0 : _o.error })
          }, [renderSlot(_ctx.$slots, "error", { error: error.value }, () => [createTextVNode(toDisplayString(error.value), 1)])], 10, ["id"])) : unref(props).help || !!slots.help ? (openBlock(), createBlock("div", {
            key: 1,
            id: `${unref(ariaId)}-help`,
            "data-slot": "help",
            class: ui.value.help({ class: (_p = unref(props).ui) == null ? void 0 : _p.help })
          }, [renderSlot(_ctx.$slots, "help", { help: unref(props).help }, () => [createTextVNode(toDisplayString(unref(props).help), 1)])], 10, ["id"])) : createCommentVNode("", true)], 2)];
        }),
        _: 3
      }, _parent));
    };
  }
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/FormField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { Label_default as L, _sfc_main as _ };
//# sourceMappingURL=FormField-DIM7HDnG.mjs.map
