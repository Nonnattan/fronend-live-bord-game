import { g as useComponentProps, h as useAppConfig, j as useFormField, v as useFieldGroup, w as useComponentIcons, t as tv, P as Primitive, b as _sfc_main$7, d as _sfc_main$5, A as looseToNumber } from '../virtual/entry.mjs';
import { useSlots, computed, useTemplateRef, unref, mergeProps, withCtx, createVNode, renderSlot, openBlock, createBlock, createCommentVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderSlot, ssrRenderClass } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import { useVModel } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';

var virtual_nuxt__nuxt_2Fui_2Finput_default = {
  "slots": {
    "root": "relative inline-flex items-center",
    "base": ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
      },
      "vertical": {
        "root": "group has-focus-visible:z-[1]",
        "base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
      }
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-sm/4 gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-base/5 gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "lg": {
        "base": "px-3 py-2 text-base/5 gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent focus:outline-none"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "leading": { "true": "" },
    "trailing": { "true": "" },
    "loading": { "true": "" },
    "highlight": { "true": "" },
    "fixed": { "false": "" },
    "type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": ["outline", "subtle"],
      "class": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": ["outline", "subtle"],
      "class": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": ["outline", "subtle"],
      "class": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": ["outline", "subtle"],
      "class": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": ["outline", "subtle"],
      "class": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": ["outline", "subtle"],
      "class": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
    },
    {
      "color": "primary",
      "variant": ["soft", "ghost"],
      "class": "outline-primary/25 focus-visible:outline-3"
    },
    {
      "color": "secondary",
      "variant": ["soft", "ghost"],
      "class": "outline-secondary/25 focus-visible:outline-3"
    },
    {
      "color": "success",
      "variant": ["soft", "ghost"],
      "class": "outline-success/25 focus-visible:outline-3"
    },
    {
      "color": "info",
      "variant": ["soft", "ghost"],
      "class": "outline-info/25 focus-visible:outline-3"
    },
    {
      "color": "warning",
      "variant": ["soft", "ghost"],
      "class": "outline-warning/25 focus-visible:outline-3"
    },
    {
      "color": "error",
      "variant": ["soft", "ghost"],
      "class": "outline-error/25 focus-visible:outline-3"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": ["outline", "subtle"],
      "class": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "variant": ["soft", "ghost"],
      "class": "outline-inverted/25 focus-visible:outline-3"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": { "leadingIcon": "animate-spin" }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": { "trailingIcon": "animate-spin" }
    },
    {
      "fixed": false,
      "size": "xs",
      "class": "md:text-xs"
    },
    {
      "fixed": false,
      "size": "sm",
      "class": "md:text-xs"
    },
    {
      "fixed": false,
      "size": "md",
      "class": "md:text-sm"
    },
    {
      "fixed": false,
      "size": "lg",
      "class": "md:text-sm"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
var _sfc_main = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UInput",
  __ssrInlineRender: true,
  props: {
    as: {
      type: null,
      required: false
    },
    id: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    type: {
      type: null,
      required: false,
      default: "text"
    },
    placeholder: {
      type: String,
      required: false
    },
    color: {
      type: null,
      required: false
    },
    variant: {
      type: null,
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
    autocomplete: {
      type: [String, Object],
      required: false,
      default: "off"
    },
    autofocus: {
      type: Boolean,
      required: false
    },
    autofocusDelay: {
      type: Number,
      required: false,
      default: 0
    },
    disabled: {
      type: Boolean,
      required: false
    },
    highlight: {
      type: Boolean,
      required: false
    },
    fixed: {
      type: Boolean,
      required: false
    },
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    modelModifiers: {
      type: null,
      required: false
    },
    class: {
      type: null,
      required: false
    },
    ui: {
      type: Object,
      required: false
    },
    icon: {
      type: null,
      required: false
    },
    avatar: {
      type: Object,
      required: false
    },
    leading: {
      type: Boolean,
      required: false
    },
    leadingIcon: {
      type: null,
      required: false
    },
    trailing: {
      type: Boolean,
      required: false
    },
    trailingIcon: {
      type: null,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    },
    loadingIcon: {
      type: null,
      required: false
    }
  },
  emits: [
    "update:modelValue",
    "blur",
    "change"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("input", _props);
    const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
    const appConfig = useAppConfig();
    const { emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField(_props, { deferInputValidation: true });
    const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
    const ui = computed(() => {
      var _a, _b, _c, _d;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Finput_default,
        ...((_a = appConfig.ui) == null ? void 0 : _a.input) || {}
      })({
        type: props.type,
        color: (_b = color.value) != null ? _b : props.color,
        variant: props.variant,
        size: (_c = inputSize == null ? void 0 : inputSize.value) != null ? _c : props.size,
        loading: props.loading,
        highlight: (_d = highlight.value) != null ? _d : props.highlight,
        fixed: props.fixed,
        leading: isLeading.value || !!props.avatar || !!slots.leading,
        trailing: isTrailing.value || !!slots.trailing,
        fieldGroup: orientation.value
      });
    });
    const inputRef = useTemplateRef("inputRef");
    function updateInput(value) {
      var _a, _b, _c, _d, _e, _f;
      if (((_a = props.modelModifiers) == null ? void 0 : _a.trim) && (typeof value === "string" || value === null || value === void 0)) value = (_b = value == null ? void 0 : value.trim()) != null ? _b : null;
      if (((_c = props.modelModifiers) == null ? void 0 : _c.number) || props.type === "number") value = looseToNumber(value);
      if ((_d = props.modelModifiers) == null ? void 0 : _d.nullable) value || (value = null);
      if (((_e = props.modelModifiers) == null ? void 0 : _e.optional) && !((_f = props.modelModifiers) == null ? void 0 : _f.nullable) && value !== null) value || (value = void 0);
      modelValue.value = value;
      emitFormInput();
    }
    function onInput(event) {
      var _a;
      if (!((_a = props.modelModifiers) == null ? void 0 : _a.lazy)) updateInput(event.target.value);
    }
    function onChange(event) {
      var _a, _b;
      const value = event.target.value;
      if ((_a = props.modelModifiers) == null ? void 0 : _a.lazy) updateInput(value);
      if ((_b = props.modelModifiers) == null ? void 0 : _b.trim) event.target.value = value.trim();
      emitFormChange();
      emits("change", event);
    }
    function onBlur(event) {
      emitFormBlur();
      emits("blur", event);
    }
    __expose({ inputRef });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: unref(props).as,
        "data-slot": (_a = _ctx.$attrs["data-slot"]) != null ? _a : "root",
        class: ui.value.root({ class: [(_b = unref(props).ui) == null ? void 0 : _b.root, unref(props).class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<input${ssrRenderAttrs(mergeProps({
              id: unref(id),
              ref_key: "inputRef",
              ref: inputRef,
              type: unref(props).type,
              value: unref(modelValue),
              name: unref(name),
              placeholder: unref(props).placeholder,
              class: ui.value.base({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.base }),
              disabled: unref(disabled),
              required: unref(props).required,
              autocomplete: unref(props).autocomplete
            }, {
              ..._ctx.$attrs,
              ...unref(ariaAttrs)
            }, { "data-slot": "base" }))}${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, null, _push2, _parent2, _scopeId);
            if (unref(isLeading) || !!unref(props).avatar || !!slots.leading) {
              _push2(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.leading }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
                var _a3, _b3, _c2;
                if (unref(isLeading) && unref(leadingIconName)) _push2(ssrRenderComponent(_sfc_main$7, {
                  name: unref(leadingIconName),
                  "data-slot": "leadingIcon",
                  class: ui.value.leadingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.leadingIcon })
                }, null, _parent2, _scopeId));
                else if (!!unref(props).avatar) _push2(ssrRenderComponent(_sfc_main$5, mergeProps({ size: ((_b3 = unref(props).ui) == null ? void 0 : _b3.leadingAvatarSize) || ui.value.leadingAvatarSize() }, unref(props).avatar, {
                  "data-slot": "leadingAvatar",
                  class: ui.value.leadingAvatar({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.leadingAvatar })
                }), null, _parent2, _scopeId));
                else _push2(`<!---->`);
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else _push2(`<!---->`);
            if (unref(isTrailing) || !!slots.trailing) {
              _push2(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: (_c = unref(props).ui) == null ? void 0 : _c.trailing }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
                var _a3;
                if (unref(trailingIconName)) _push2(ssrRenderComponent(_sfc_main$7, {
                  name: unref(trailingIconName),
                  "data-slot": "trailingIcon",
                  class: ui.value.trailingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.trailingIcon })
                }, null, _parent2, _scopeId));
                else _push2(`<!---->`);
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else _push2(`<!---->`);
          } else return [
            createVNode("input", mergeProps({
              id: unref(id),
              ref_key: "inputRef",
              ref: inputRef,
              type: unref(props).type,
              value: unref(modelValue),
              name: unref(name),
              placeholder: unref(props).placeholder,
              class: ui.value.base({ class: (_d = unref(props).ui) == null ? void 0 : _d.base }),
              disabled: unref(disabled),
              required: unref(props).required,
              autocomplete: unref(props).autocomplete
            }, {
              ..._ctx.$attrs,
              ...unref(ariaAttrs)
            }, {
              "data-slot": "base",
              onInput,
              onBlur,
              onChange,
              onFocus: unref(emitFormFocus)
            }), null, 16, [
              "id",
              "type",
              "value",
              "name",
              "placeholder",
              "disabled",
              "required",
              "autocomplete",
              "onFocus"
            ]),
            renderSlot(_ctx.$slots, "default", { ui: ui.value }),
            unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
              key: 0,
              "data-slot": "leading",
              class: ui.value.leading({ class: (_e = unref(props).ui) == null ? void 0 : _e.leading })
            }, [renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
              var _a3, _b3, _c2;
              return [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                key: 0,
                name: unref(leadingIconName),
                "data-slot": "leadingIcon",
                class: ui.value.leadingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.leadingIcon })
              }, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                key: 1,
                size: ((_b3 = unref(props).ui) == null ? void 0 : _b3.leadingAvatarSize) || ui.value.leadingAvatarSize()
              }, unref(props).avatar, {
                "data-slot": "leadingAvatar",
                class: ui.value.leadingAvatar({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.leadingAvatar })
              }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
            })], 2)) : createCommentVNode("", true),
            unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
              key: 1,
              "data-slot": "trailing",
              class: ui.value.trailing({ class: (_f = unref(props).ui) == null ? void 0 : _f.trailing })
            }, [renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
              var _a3;
              return [unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                key: 0,
                name: unref(trailingIconName),
                "data-slot": "trailingIcon",
                class: ui.value.trailingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.trailingIcon })
              }, null, 8, ["name", "class"])) : createCommentVNode("", true)];
            })], 2)) : createCommentVNode("", true)
          ];
        }),
        _: 3
      }, _parent));
    };
  }
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Input.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Input-03a9B_yA.mjs.map
