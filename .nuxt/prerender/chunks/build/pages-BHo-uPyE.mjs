import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7, n as navigateTo, d as _sfc_main$5, c as _sfc_main$2$1, g as useComponentProps, h as useAppConfig, i as useForwardProps, j as useFormField, t as tv, k as formBusInjectionKey, l as formStateInjectionKey, m as formErrorsInjectionKey, o as formInputsInjectionKey, p as formLoadingInjectionKey, q as formOptionsInjectionKey, r as get, P as Primitive, s as createContext } from '../virtual/entry.mjs';
import { a as _sfc_main$1$1, _ as _sfc_main$4, u as useDirection, b as useFormControl, V as VisuallyHiddenInput_default, c as useCollection, f as focusFirst, g as getFocusIntent, w as wrapArray, E as ENTRY_FOCUS, d as EVENT_OPTIONS } from './Badge--gAvyuw3.mjs';
import { P as Presence_default, u as useId$1, h as handleAndDispatchCustomEvent } from './usePortal-CFE28n6Q.mjs';
import { u as useForwardExpose } from './useForwardExpose-lTVrimVg.mjs';
import { _ as _sfc_main$2 } from './Modal-Bf6V9eIc.mjs';
import { _ as _sfc_main$3, L as Label_default } from './FormField-DIM7HDnG.mjs';
import { u as useProfile, g as getAgeRangeOptions, c as calculateAge, a as ageRangeLabel, d as calculateAgeRange, G as GENDER_OPTIONS, p as profileSchema, b as birthYearRangeValueFor } from './useProfile-Di4CdYil.mjs';
import { u as useMemberApi } from './useMemberApi-DKl7a10r.mjs';
import { u as useAuth } from './useAuth-mwKCwQRs.mjs';
import { _ as _sfc_main$6 } from './Input-03a9B_yA.mjs';
import { defineComponent, ref, mergeProps, unref, computed, isRef, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, withModifiers, createCommentVNode, Transition, reactive, useSlots, useId, resolveDynamicComponent, renderSlot, Fragment, renderList, useTemplateRef, inject, provide, readonly, createSlots, toRefs, withKeys, getCurrentInstance, watch, createElementBlock, nextTick, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { isEqual } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderSlot, ssrRenderList, ssrRenderVNode } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import { reactivePick, useEventBus, useVModel, useEventListener } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';
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
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/shared/dist/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@tanstack/vue-virtual/dist/esm/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@floating-ui/vue/dist/floating-ui.vue.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/aria-hidden/dist/es5/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/zod/index.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function useForwardScopeId() {
  var _a, _b;
  const scopeId = (_b = (_a = getCurrentInstance()) == null ? void 0 : _a.vnode) == null ? void 0 : _b.scopeId;
  return scopeId ? { [scopeId]: "" } : {};
}
var [injectRovingFocusGroupContext, provideRovingFocusGroupContext] = /* @__PURE__ */ createContext("RovingFocusGroup");
var RovingFocusGroup_default = /* @__PURE__ */ defineComponent({
  __name: "RovingFocusGroup",
  props: {
    orientation: {
      type: String,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    loop: {
      type: Boolean,
      required: false,
      default: false
    },
    currentTabStopId: {
      type: [String, null],
      required: false
    },
    defaultCurrentTabStopId: {
      type: String,
      required: false
    },
    preventScrollOnEntryFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  emits: ["entryFocus", "update:currentTabStopId"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { loop, orientation, dir: propDir } = toRefs(props);
    const dir = useDirection(propDir);
    const currentTabStopId = useVModel(props, "currentTabStopId", emits, {
      defaultValue: props.defaultCurrentTabStopId,
      passive: props.currentTabStopId === void 0
    });
    const isTabbingBackOut = ref(false);
    const isClickFocus = ref(false);
    const focusableItemsCount = ref(0);
    const { getItems, CollectionSlot } = useCollection({ isProvider: true });
    function handleFocus(event) {
      const isKeyboardFocus = !isClickFocus.value;
      if (event.currentTarget && event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut.value) {
        const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
        event.currentTarget.dispatchEvent(entryFocusEvent);
        emits("entryFocus", entryFocusEvent);
        if (!entryFocusEvent.defaultPrevented) {
          const items = getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
          const candidateItems = [
            items.find((item) => item.getAttribute("data-active") === ""),
            items.find((item) => item.getAttribute("data-highlighted") === ""),
            items.find((item) => item.id === currentTabStopId.value),
            ...items
          ].filter(Boolean);
          focusFirst(candidateItems, props.preventScrollOnEntryFocus);
        }
      }
      isClickFocus.value = false;
    }
    function handleMouseUp() {
      setTimeout(() => {
        isClickFocus.value = false;
      }, 1);
    }
    __expose({ getItems });
    provideRovingFocusGroupContext({
      loop,
      dir,
      orientation,
      currentTabStopId,
      onItemFocus: (tabStopId) => {
        currentTabStopId.value = tabStopId;
      },
      onItemShiftTab: () => {
        isTabbingBackOut.value = true;
      },
      onFocusableItemAdd: () => {
        focusableItemsCount.value++;
      },
      onFocusableItemRemove: () => {
        focusableItemsCount.value--;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionSlot), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          tabindex: isTabbingBackOut.value || focusableItemsCount.value === 0 ? -1 : 0,
          "data-orientation": unref(orientation),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          dir: unref(dir),
          style: { "outline": "none" },
          onMousedown: _cache[0] || (_cache[0] = ($event) => isClickFocus.value = true),
          onMouseup: handleMouseUp,
          onFocus: handleFocus,
          onBlur: _cache[1] || (_cache[1] = ($event) => isTabbingBackOut.value = false)
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "tabindex",
          "data-orientation",
          "as",
          "as-child",
          "dir"
        ])]),
        _: 3
      });
    };
  }
});
var RovingFocusItem_default = /* @__PURE__ */ defineComponent({
  __name: "RovingFocusItem",
  props: {
    tabStopId: {
      type: String,
      required: false
    },
    focusable: {
      type: Boolean,
      required: false,
      default: true
    },
    active: {
      type: Boolean,
      required: false
    },
    allowShiftKey: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const props = __props;
    const context = injectRovingFocusGroupContext();
    const randomId = useId$1();
    const id = computed(() => props.tabStopId || randomId);
    const isCurrentTabStop = computed(() => context.currentTabStopId.value === id.value);
    const { getItems, CollectionItem } = useCollection();
    watch(() => props.focusable, (newVal, oldVal) => {
      if (newVal === oldVal) return;
      if (newVal) context.onFocusableItemAdd();
      else context.onFocusableItemRemove();
    });
    function handleKeydown(event) {
      if (event.key === "Tab" && event.shiftKey) {
        context.onItemShiftTab();
        return;
      }
      if (event.target !== event.currentTarget) return;
      const focusIntent = getFocusIntent(event, context.orientation.value, context.dir.value);
      if (focusIntent !== void 0) {
        if (event.metaKey || event.ctrlKey || event.altKey || (props.allowShiftKey ? false : event.shiftKey)) return;
        event.preventDefault();
        let candidateNodes = [...getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "")];
        if (focusIntent === "last") candidateNodes.reverse();
        else if (focusIntent === "prev" || focusIntent === "next") {
          if (focusIntent === "prev") candidateNodes.reverse();
          const currentIndex = candidateNodes.indexOf(event.currentTarget);
          candidateNodes = context.loop.value ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
        }
        nextTick(() => focusFirst(candidateNodes));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          tabindex: isCurrentTabStop.value ? 0 : -1,
          "data-orientation": unref(context).orientation.value,
          "data-active": _ctx.active ? "" : void 0,
          "data-disabled": !_ctx.focusable ? "" : void 0,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          onMousedown: _cache[0] || (_cache[0] = (event) => {
            if (!_ctx.focusable) event.preventDefault();
            else unref(context).onItemFocus(id.value);
          }),
          onFocus: _cache[1] || (_cache[1] = ($event) => unref(context).onItemFocus(id.value)),
          onKeydown: handleKeydown
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "tabindex",
          "data-orientation",
          "data-active",
          "data-disabled",
          "as",
          "as-child"
        ])]),
        _: 3
      });
    };
  }
});
var RADIO_SELECT = "radio.select";
function handleSelect(event, value, callback) {
  handleAndDispatchCustomEvent(RADIO_SELECT, callback, {
    originalEvent: event,
    value
  });
}
var Radio_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "Radio",
  props: {
    id: {
      type: String,
      required: false
    },
    value: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["update:checked", "select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const checked = useVModel(props, "checked", emits, { passive: props.checked === void 0 });
    const { value } = toRefs(props);
    const { forwardRef, currentElement: triggerElement } = useForwardExpose();
    const isFormControl = useFormControl(triggerElement);
    const scopeIdAttrs = useForwardScopeId();
    const ariaLabel = computed(() => {
      var _a, _b;
      return props.id && triggerElement.value ? (_b = (_a = (void 0).querySelector(`[for="${props.id}"]`)) == null ? void 0 : _a.innerText) != null ? _b : props.value : void 0;
    });
    function handleClick(event) {
      if (props.disabled) return;
      handleSelect(event, props.value, (ev) => {
        emits("select", ev);
        if (ev == null ? void 0 : ev.defaultPrevented) return;
        checked.value = true;
        if (isFormControl.value) ev.stopPropagation();
      });
    }
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock(Fragment, null, [createVNode(unref(Primitive), mergeProps({
        id: _ctx.id,
        ref: unref(forwardRef),
        role: "radio",
        type: _ctx.as === "button" ? "button" : void 0,
        as: _ctx.as,
        "aria-checked": (_a = unref(checked)) != null ? _a : false,
        "aria-label": ariaLabel.value,
        "as-child": _ctx.asChild,
        disabled: _ctx.disabled ? "" : void 0,
        "data-state": unref(checked) ? "checked" : "unchecked",
        "data-disabled": _ctx.disabled ? "" : void 0,
        value: unref(value),
        required: _ctx.required,
        name: _ctx.name
      }, {
        ...unref(scopeIdAttrs),
        ..._ctx.$attrs
      }, { onClick: withModifiers(handleClick, ["stop"]) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { checked: unref(checked) })]),
        _: 3
      }, 16, [
        "id",
        "type",
        "as",
        "aria-checked",
        "aria-label",
        "as-child",
        "disabled",
        "data-state",
        "data-disabled",
        "value",
        "required",
        "name"
      ]), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), mergeProps({
        key: 0,
        type: "radio",
        tabindex: "-1",
        value: unref(value),
        checked: !!unref(checked),
        name: _ctx.name,
        disabled: _ctx.disabled,
        required: _ctx.required
      }, unref(scopeIdAttrs)), null, 16, [
        "value",
        "checked",
        "name",
        "disabled",
        "required"
      ])) : createCommentVNode("v-if", true)], 64);
    };
  }
});
var [injectRadioGroupRootContext, provideRadioGroupRootContext] = /* @__PURE__ */ createContext("RadioGroupRoot");
var RadioGroupRoot_default = /* @__PURE__ */ defineComponent({
  __name: "RadioGroupRoot",
  props: {
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    orientation: {
      type: String,
      required: false,
      default: void 0
    },
    dir: {
      type: String,
      required: false
    },
    loop: {
      type: Boolean,
      required: false,
      default: true
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement } = useForwardExpose();
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: props.defaultValue,
      passive: props.modelValue === void 0
    });
    const { disabled, loop, orientation, name, required, dir: propDir } = toRefs(props);
    const dir = useDirection(propDir);
    const isFormControl = useFormControl(currentElement);
    provideRadioGroupRootContext({
      modelValue,
      changeModelValue: (value) => {
        modelValue.value = value;
      },
      disabled,
      loop,
      orientation,
      name: name == null ? void 0 : name.value,
      required
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(RovingFocusGroup_default), {
        "as-child": "",
        orientation: unref(orientation),
        dir: unref(dir),
        loop: unref(loop)
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          ref: unref(forwardRef),
          role: "radiogroup",
          "data-disabled": unref(disabled) ? "" : void 0,
          "as-child": _ctx.asChild,
          as: _ctx.as,
          "aria-orientation": unref(orientation),
          "aria-required": unref(required),
          dir: unref(dir)
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) }), unref(isFormControl) && unref(name) ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), {
            key: 0,
            required: unref(required),
            disabled: unref(disabled),
            value: unref(modelValue),
            name: unref(name)
          }, null, 8, [
            "required",
            "disabled",
            "value",
            "name"
          ])) : createCommentVNode("v-if", true)]),
          _: 3
        }, 8, [
          "data-disabled",
          "as-child",
          "as",
          "aria-orientation",
          "aria-required",
          "dir"
        ])]),
        _: 3
      }, 8, [
        "orientation",
        "dir",
        "loop"
      ]);
    };
  }
});
var [injectRadioGroupItemContext, provideRadiogroupItemContext] = /* @__PURE__ */ createContext("RadioGroupItem");
var RadioGroupItem_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "RadioGroupItem",
  props: {
    id: {
      type: String,
      required: false
    },
    value: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectRadioGroupRootContext();
    const disabled = computed(() => rootContext.disabled.value || props.disabled);
    const required = computed(() => rootContext.required.value || props.required);
    const checked = computed(() => {
      var _a;
      return isEqual((_a = rootContext.modelValue) == null ? void 0 : _a.value, props.value);
    });
    provideRadiogroupItemContext({
      disabled,
      checked
    });
    const isArrowKeyPressed = ref(false);
    const ARROW_KEYS = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight"
    ];
    useEventListener("keydown", (event) => {
      if (ARROW_KEYS.includes(event.key)) isArrowKeyPressed.value = true;
    });
    useEventListener("keyup", () => {
      isArrowKeyPressed.value = false;
    });
    function handleFocus() {
      setTimeout(() => {
        var _a;
        if (isArrowKeyPressed.value) (_a = currentElement.value) == null ? void 0 : _a.click();
      }, 0);
    }
    const scopeIdAttrs = useForwardScopeId();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(RovingFocusItem_default), {
        checked: checked.value,
        disabled: disabled.value,
        "as-child": "",
        focusable: !disabled.value,
        active: checked.value
      }, {
        default: withCtx(() => [createVNode(Radio_default, mergeProps({
          ...unref(scopeIdAttrs),
          ..._ctx.$attrs,
          ...props
        }, {
          ref: unref(forwardRef),
          checked: checked.value,
          required: required.value,
          disabled: disabled.value,
          "onUpdate:checked": _cache[0] || (_cache[0] = ($event) => unref(rootContext).changeModelValue(_ctx.value)),
          onSelect: _cache[1] || (_cache[1] = ($event) => emits("select", $event)),
          onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers(() => {
          }, ["prevent"]), ["enter"])),
          onFocus: handleFocus
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
            checked: checked.value,
            required: required.value,
            disabled: disabled.value
          })]),
          _: 3
        }, 16, [
          "checked",
          "required",
          "disabled"
        ])]),
        _: 3
      }, 8, [
        "checked",
        "disabled",
        "focusable",
        "active"
      ]);
    };
  }
});
var RadioGroupIndicator_default = /* @__PURE__ */ defineComponent({
  __name: "RadioGroupIndicator",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "span"
    }
  },
  setup(__props) {
    const { forwardRef } = useForwardExpose();
    const itemContext = injectRadioGroupItemContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(itemContext).checked.value }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          "data-state": unref(itemContext).checked.value ? "checked" : "unchecked",
          "data-disabled": unref(itemContext).disabled.value ? "" : void 0,
          "as-child": _ctx.asChild,
          as: _ctx.as
        }, _ctx.$attrs), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "data-state",
          "data-disabled",
          "as-child",
          "as"
        ])]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var LoginButtons_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "LoginButtons",
  __ssrInlineRender: true,
  props: {
    lineLoading: { type: Boolean },
    offlineMode: { type: Boolean }
  },
  emits: ["select-line", "select-guest"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$2$1;
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-buttons" }, _attrs))} data-v-c3a2c2ff>`);
      if (!__props.offlineMode) _push(ssrRenderComponent(_component_UButton, {
        block: "",
        size: "xl",
        color: "success",
        class: "login-buttons__line",
        loading: __props.lineLoading,
        disabled: __props.lineLoading,
        onClick: ($event) => emit("select-line")
      }, createSlots({
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(` \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 LINE `);
          else return [createTextVNode(" \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 LINE ")];
        }),
        _: 2
      }, [!__props.lineLoading ? {
        name: "leading",
        fn: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UIcon, { name: "i-simple-icons-line" }, null, _parent2, _scopeId));
          else return [createVNode(_component_UIcon, { name: "i-simple-icons-line" })];
        }),
        key: "0"
      } : void 0]), _parent));
      else _push(`<!---->`);
      _push(ssrRenderComponent(_component_UButton, {
        block: "",
        size: "xl",
        color: "neutral",
        variant: "outline",
        class: "login-buttons__guest",
        disabled: __props.lineLoading,
        onClick: ($event) => emit("select-guest")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(` \u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21 LINE `);
          else return [createTextVNode(" \u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21 LINE ")];
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
var _sfc_setup$6 = LoginButtons_vue_vue_type_script_setup_true_lang_default.setup;
LoginButtons_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoginButtons.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var LoginButtons_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(LoginButtons_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c3a2c2ff"]]), { __name: "LoginButtons" });
var WelcomePage_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "WelcomePage",
  __ssrInlineRender: true,
  props: {
    lineLoading: { type: Boolean },
    lineError: {},
    offlineMode: { type: Boolean }
  },
  emits: ["select-line", "select-guest"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$7;
      const _component_LoginButtons = LoginButtons_default;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "welcome-page" }, _attrs))} data-v-9a65e05b><div class="welcome-page__scroll" data-v-9a65e05b><div class="brand-mark" data-v-9a65e05b>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-shield-check",
        class: "brand-mark__icon"
      }, null, _parent));
      _push(`</div><h1 class="title" data-v-9a65e05b>\u0E22\u0E34\u0E19\u0E14\u0E35\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A \u{1F44B}</h1><p class="subtitle" data-v-9a65e05b>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E34\u0E18\u0E35\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</p>`);
      if (__props.lineError) _push(`<p class="welcome-page__error" data-v-9a65e05b>${ssrInterpolate(__props.lineError)}</p>`);
      else _push(`<!---->`);
      _push(ssrRenderComponent(_component_LoginButtons, {
        "line-loading": __props.lineLoading,
        "offline-mode": __props.offlineMode,
        class: "welcome-page__buttons",
        onSelectLine: ($event) => emit("select-line"),
        onSelectGuest: ($event) => emit("select-guest")
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
var _sfc_setup$5 = WelcomePage_vue_vue_type_script_setup_true_lang_default.setup;
WelcomePage_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WelcomePage.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var WelcomePage_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(WelcomePage_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9a65e05b"]]), { __name: "WelcomePage" });
var virtual_nuxt__nuxt_2Fui_2Fradio_group_default = {
  "slots": {
    "root": "relative",
    "fieldset": "flex gap-x-2",
    "legend": "mb-1 block font-medium text-default",
    "item": "flex items-start",
    "container": "flex items-center",
    "base": "rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-3",
    "indicator": "flex items-center justify-center size-full after:bg-default after:rounded-full",
    "wrapper": "w-full",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "outline-primary/25 focus-visible:ring-primary",
        "indicator": "bg-primary"
      },
      "secondary": {
        "base": "outline-secondary/25 focus-visible:ring-secondary",
        "indicator": "bg-secondary"
      },
      "success": {
        "base": "outline-success/25 focus-visible:ring-success",
        "indicator": "bg-success"
      },
      "info": {
        "base": "outline-info/25 focus-visible:ring-info",
        "indicator": "bg-info"
      },
      "warning": {
        "base": "outline-warning/25 focus-visible:ring-warning",
        "indicator": "bg-warning"
      },
      "error": {
        "base": "outline-error/25 focus-visible:ring-error",
        "indicator": "bg-error"
      },
      "neutral": {
        "base": "outline-inverted/25 focus-visible:ring-inverted",
        "indicator": "bg-inverted"
      }
    },
    "variant": {
      "list": { "item": "" },
      "card": { "item": "border border-muted rounded-lg" },
      "table": { "item": "border border-muted" }
    },
    "orientation": {
      "horizontal": { "fieldset": "flex-row" },
      "vertical": { "fieldset": "flex-col" }
    },
    "indicator": {
      "start": {
        "item": "flex-row",
        "wrapper": "ms-2"
      },
      "end": {
        "item": "flex-row-reverse",
        "wrapper": "me-2"
      },
      "hidden": {
        "base": "sr-only",
        "wrapper": "text-center"
      }
    },
    "size": {
      "xs": {
        "fieldset": "gap-y-0.5",
        "legend": "text-xs",
        "base": "size-3",
        "item": "text-xs",
        "container": "h-4",
        "indicator": "after:size-1"
      },
      "sm": {
        "fieldset": "gap-y-0.5",
        "legend": "text-xs",
        "base": "size-3.5",
        "item": "text-xs",
        "container": "h-4",
        "indicator": "after:size-1"
      },
      "md": {
        "fieldset": "gap-y-1",
        "legend": "text-sm",
        "base": "size-4",
        "item": "text-sm",
        "container": "h-5",
        "indicator": "after:size-1.5"
      },
      "lg": {
        "fieldset": "gap-y-1",
        "legend": "text-sm",
        "base": "size-4.5",
        "item": "text-sm",
        "container": "h-5",
        "indicator": "after:size-1.5"
      },
      "xl": {
        "fieldset": "gap-y-1.5",
        "legend": "text-base",
        "base": "size-5",
        "item": "text-base",
        "container": "h-6",
        "indicator": "after:size-2"
      }
    },
    "highlight": { "true": "" },
    "disabled": { "true": {
      "item": "opacity-75",
      "base": "cursor-not-allowed",
      "label": "cursor-not-allowed",
      "description": "cursor-not-allowed"
    } },
    "required": { "true": { "legend": "after:content-['*'] after:ms-0.5 after:text-error" } }
  },
  "compoundVariants": [
    {
      "size": "xs",
      "variant": ["card", "table"],
      "class": { "item": "p-2.5" }
    },
    {
      "size": "sm",
      "variant": ["card", "table"],
      "class": { "item": "p-3" }
    },
    {
      "size": "md",
      "variant": ["card", "table"],
      "class": { "item": "p-3.5" }
    },
    {
      "size": "lg",
      "variant": ["card", "table"],
      "class": { "item": "p-4" }
    },
    {
      "size": "xl",
      "variant": ["card", "table"],
      "class": { "item": "p-4.5" }
    },
    {
      "orientation": "horizontal",
      "variant": "table",
      "class": {
        "item": "first-of-type:rounded-s-lg last-of-type:rounded-e-lg",
        "fieldset": "gap-0 -space-x-px"
      }
    },
    {
      "orientation": "vertical",
      "variant": "table",
      "class": {
        "item": "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        "fieldset": "gap-0 -space-y-px"
      }
    },
    {
      "color": "primary",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-primary" }
    },
    {
      "color": "secondary",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-secondary" }
    },
    {
      "color": "success",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-success" }
    },
    {
      "color": "info",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-info" }
    },
    {
      "color": "warning",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-warning" }
    },
    {
      "color": "error",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-error" }
    },
    {
      "color": "neutral",
      "variant": "card",
      "class": { "item": "has-data-[state=checked]:border-inverted" }
    },
    {
      "color": "primary",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "color": "secondary",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-secondary/10 has-data-[state=checked]:border-secondary/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "color": "success",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-success/10 has-data-[state=checked]:border-success/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "color": "info",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-info/10 has-data-[state=checked]:border-info/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "color": "warning",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-warning/10 has-data-[state=checked]:border-warning/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "color": "error",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-error/10 has-data-[state=checked]:border-error/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "color": "neutral",
      "variant": "table",
      "class": { "item": "has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]" }
    },
    {
      "variant": ["card", "table"],
      "disabled": true,
      "class": { "item": "cursor-not-allowed" }
    },
    {
      "color": "primary",
      "highlight": true,
      "class": { "base": "ring-primary" }
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": { "base": "ring-secondary" }
    },
    {
      "color": "success",
      "highlight": true,
      "class": { "base": "ring-success" }
    },
    {
      "color": "info",
      "highlight": true,
      "class": { "base": "ring-info" }
    },
    {
      "color": "warning",
      "highlight": true,
      "class": { "base": "ring-warning" }
    },
    {
      "color": "error",
      "highlight": true,
      "class": { "base": "ring-error" }
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": { "base": "ring-inverted" }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "list",
    "indicator": "start"
  }
};
var _sfc_main$1 = {
  __name: "URadioGroup",
  __ssrInlineRender: true,
  props: {
    as: {
      type: null,
      required: false
    },
    legend: {
      type: String,
      required: false
    },
    valueKey: {
      type: null,
      required: false,
      default: "value"
    },
    labelKey: {
      type: null,
      required: false,
      default: "label"
    },
    descriptionKey: {
      type: null,
      required: false,
      default: "description"
    },
    items: {
      type: null,
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
    size: {
      type: null,
      required: false
    },
    variant: {
      type: null,
      required: false
    },
    color: {
      type: null,
      required: false
    },
    highlight: {
      type: Boolean,
      required: false
    },
    orientation: {
      type: null,
      required: false,
      default: "vertical"
    },
    indicator: {
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
    disabled: {
      type: Boolean,
      required: false
    },
    loop: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    }
  },
  emits: ["change", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    var _a;
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("radioGroup", _props);
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "as", "loop", "required"), emits);
    const { emitFormChange, emitFormInput, color, name, size, highlight, id: _id, disabled, ariaAttrs } = useFormField(_props, { bind: false });
    const id = (_a = _id.value) != null ? _a : useId();
    const ui = computed(() => {
      var _a2, _b, _c, _d;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Fradio_group_default,
        ...((_a2 = appConfig.ui) == null ? void 0 : _a2.radioGroup) || {}
      })({
        size: (_b = size.value) != null ? _b : props.size,
        color: (_c = color.value) != null ? _c : props.color,
        highlight: (_d = highlight.value) != null ? _d : props.highlight,
        disabled: disabled.value,
        required: props.required,
        orientation: props.orientation,
        variant: props.variant,
        indicator: props.indicator
      });
    });
    function normalizeItem(item) {
      if (item === null) return {
        id: `${id}:null`,
        value: void 0,
        label: void 0
      };
      if (typeof item === "string" || typeof item === "number" || typeof item === "bigint") return {
        id: `${id}:${item}`,
        value: String(item),
        label: String(item)
      };
      const value = get(item, props.valueKey);
      const label = get(item, props.labelKey);
      const description = get(item, props.descriptionKey);
      return {
        ...item,
        value,
        label,
        description,
        id: `${id}:${value}`
      };
    }
    const normalizedItems = computed(() => {
      if (!props.items) return [];
      return props.items.map(normalizeItem);
    });
    function onUpdate(value) {
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      _push(ssrRenderComponent(unref(RadioGroupRoot_default), mergeProps({ id: unref(id) }, unref(rootProps), {
        "model-value": unref(props).modelValue,
        "default-value": unref(props).defaultValue,
        orientation: unref(props).orientation,
        name: unref(name),
        disabled: unref(disabled),
        "data-slot": "root",
        class: ui.value.root({ class: [(_a2 = unref(props).ui) == null ? void 0 : _a2.root, unref(props).class] }),
        "onUpdate:modelValue": onUpdate
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a3, _b, _c, _d;
          if (_push2) {
            _push2(`<fieldset${ssrRenderAttrs(mergeProps({
              "data-slot": "fieldset",
              class: ui.value.fieldset({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.fieldset })
            }, unref(ariaAttrs)))}${_scopeId}>`);
            if (unref(props).legend || !!slots.legend) {
              _push2(`<legend data-slot="legend" class="${ssrRenderClass(ui.value.legend({ class: (_b = unref(props).ui) == null ? void 0 : _b.legend }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "legend", {}, () => {
                _push2(`${ssrInterpolate(unref(props).legend)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</legend>`);
            } else _push2(`<!---->`);
            _push2(`<!--[-->`);
            ssrRenderList(normalizedItems.value, (item) => {
              var _a4, _b2;
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? "div" : unref(Label_default)), {
                key: item.value,
                "data-slot": "item",
                class: ui.value.item({
                  class: [
                    (_a4 = unref(props).ui) == null ? void 0 : _a4.item,
                    (_b2 = item.ui) == null ? void 0 : _b2.item,
                    item.class
                  ],
                  disabled: item.disabled || unref(disabled)
                })
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a5, _b3, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
                  if (_push3) {
                    _push3(`<div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: [(_a5 = unref(props).ui) == null ? void 0 : _a5.container, (_b3 = item.ui) == null ? void 0 : _b3.container] }))}"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(RadioGroupItem_default), {
                      id: item.id,
                      value: item.value,
                      disabled: item.disabled || unref(disabled),
                      "data-slot": "base",
                      class: ui.value.base({
                        class: [(_c2 = unref(props).ui) == null ? void 0 : _c2.base, (_d2 = item.ui) == null ? void 0 : _d2.base],
                        disabled: item.disabled || unref(disabled)
                      })
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        var _a6, _b4, _c3, _d3;
                        if (_push4) _push4(ssrRenderComponent(unref(RadioGroupIndicator_default), {
                          "data-slot": "indicator",
                          class: ui.value.indicator({ class: [(_a6 = unref(props).ui) == null ? void 0 : _a6.indicator, (_b4 = item.ui) == null ? void 0 : _b4.indicator] })
                        }, null, _parent4, _scopeId3));
                        else return [createVNode(unref(RadioGroupIndicator_default), {
                          "data-slot": "indicator",
                          class: ui.value.indicator({ class: [(_c3 = unref(props).ui) == null ? void 0 : _c3.indicator, (_d3 = item.ui) == null ? void 0 : _d3.indicator] })
                        }, null, 8, ["class"])];
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    if (item.label || !!slots.label || item.description || !!slots.description) {
                      _push3(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: [(_e = unref(props).ui) == null ? void 0 : _e.wrapper, (_f = item.ui) == null ? void 0 : _f.wrapper] }))}"${_scopeId2}>`);
                      if (item.label || !!slots.label) ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? unref(Label_default) : "p"), {
                        for: item.id,
                        "data-slot": "label",
                        class: ui.value.label({
                          class: [(_g = unref(props).ui) == null ? void 0 : _g.label, (_h = item.ui) == null ? void 0 : _h.label],
                          disabled: item.disabled || unref(disabled)
                        })
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) ssrRenderSlot(_ctx.$slots, "label", {
                            item,
                            modelValue: unref(props).modelValue
                          }, () => {
                            _push4(`${ssrInterpolate(item.label)}`);
                          }, _push4, _parent4, _scopeId3);
                          else return [renderSlot(_ctx.$slots, "label", {
                            item,
                            modelValue: unref(props).modelValue
                          }, () => [createTextVNode(toDisplayString(item.label), 1)])];
                        }),
                        _: 2
                      }), _parent3, _scopeId2);
                      else _push3(`<!---->`);
                      if (item.description || !!slots.description) {
                        _push3(`<p data-slot="description" class="${ssrRenderClass(ui.value.description({
                          class: [(_i = unref(props).ui) == null ? void 0 : _i.description, (_j = item.ui) == null ? void 0 : _j.description],
                          disabled: item.disabled || unref(disabled)
                        }))}"${_scopeId2}>`);
                        ssrRenderSlot(_ctx.$slots, "description", {
                          item,
                          modelValue: unref(props).modelValue
                        }, () => {
                          _push3(`${ssrInterpolate(item.description)}`);
                        }, _push3, _parent3, _scopeId2);
                        _push3(`</p>`);
                      } else _push3(`<!---->`);
                      _push3(`</div>`);
                    } else _push3(`<!---->`);
                  } else return [createVNode("div", {
                    "data-slot": "container",
                    class: ui.value.container({ class: [(_k = unref(props).ui) == null ? void 0 : _k.container, (_l = item.ui) == null ? void 0 : _l.container] })
                  }, [createVNode(unref(RadioGroupItem_default), {
                    id: item.id,
                    value: item.value,
                    disabled: item.disabled || unref(disabled),
                    "data-slot": "base",
                    class: ui.value.base({
                      class: [(_m = unref(props).ui) == null ? void 0 : _m.base, (_n = item.ui) == null ? void 0 : _n.base],
                      disabled: item.disabled || unref(disabled)
                    })
                  }, {
                    default: withCtx(() => {
                      var _a6, _b4;
                      return [createVNode(unref(RadioGroupIndicator_default), {
                        "data-slot": "indicator",
                        class: ui.value.indicator({ class: [(_a6 = unref(props).ui) == null ? void 0 : _a6.indicator, (_b4 = item.ui) == null ? void 0 : _b4.indicator] })
                      }, null, 8, ["class"])];
                    }),
                    _: 2
                  }, 1032, [
                    "id",
                    "value",
                    "disabled",
                    "class"
                  ])], 2), item.label || !!slots.label || item.description || !!slots.description ? (openBlock(), createBlock("div", {
                    key: 0,
                    "data-slot": "wrapper",
                    class: ui.value.wrapper({ class: [(_o = unref(props).ui) == null ? void 0 : _o.wrapper, (_p = item.ui) == null ? void 0 : _p.wrapper] })
                  }, [item.label || !!slots.label ? (openBlock(), createBlock(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? unref(Label_default) : "p"), {
                    key: 0,
                    for: item.id,
                    "data-slot": "label",
                    class: ui.value.label({
                      class: [(_q = unref(props).ui) == null ? void 0 : _q.label, (_r = item.ui) == null ? void 0 : _r.label],
                      disabled: item.disabled || unref(disabled)
                    })
                  }, {
                    default: withCtx(() => [renderSlot(_ctx.$slots, "label", {
                      item,
                      modelValue: unref(props).modelValue
                    }, () => [createTextVNode(toDisplayString(item.label), 1)])]),
                    _: 2
                  }, 1032, ["for", "class"])) : createCommentVNode("", true), item.description || !!slots.description ? (openBlock(), createBlock("p", {
                    key: 1,
                    "data-slot": "description",
                    class: ui.value.description({
                      class: [(_s = unref(props).ui) == null ? void 0 : _s.description, (_t = item.ui) == null ? void 0 : _t.description],
                      disabled: item.disabled || unref(disabled)
                    })
                  }, [renderSlot(_ctx.$slots, "description", {
                    item,
                    modelValue: unref(props).modelValue
                  }, () => [createTextVNode(toDisplayString(item.description), 1)])], 2)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true)];
                }),
                _: 2
              }), _parent2, _scopeId);
            });
            _push2(`<!--]--></fieldset>`);
          } else return [createVNode("fieldset", mergeProps({
            "data-slot": "fieldset",
            class: ui.value.fieldset({ class: (_c = unref(props).ui) == null ? void 0 : _c.fieldset })
          }, unref(ariaAttrs)), [unref(props).legend || !!slots.legend ? (openBlock(), createBlock("legend", {
            key: 0,
            "data-slot": "legend",
            class: ui.value.legend({ class: (_d = unref(props).ui) == null ? void 0 : _d.legend })
          }, [renderSlot(_ctx.$slots, "legend", {}, () => [createTextVNode(toDisplayString(unref(props).legend), 1)])], 2)) : createCommentVNode("", true), (openBlock(true), createBlock(Fragment, null, renderList(normalizedItems.value, (item) => {
            var _a4, _b2;
            return openBlock(), createBlock(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? "div" : unref(Label_default)), {
              key: item.value,
              "data-slot": "item",
              class: ui.value.item({
                class: [
                  (_a4 = unref(props).ui) == null ? void 0 : _a4.item,
                  (_b2 = item.ui) == null ? void 0 : _b2.item,
                  item.class
                ],
                disabled: item.disabled || unref(disabled)
              })
            }, {
              default: withCtx(() => {
                var _a5, _b3, _c2, _d2, _e, _f, _g, _h, _i, _j;
                return [createVNode("div", {
                  "data-slot": "container",
                  class: ui.value.container({ class: [(_a5 = unref(props).ui) == null ? void 0 : _a5.container, (_b3 = item.ui) == null ? void 0 : _b3.container] })
                }, [createVNode(unref(RadioGroupItem_default), {
                  id: item.id,
                  value: item.value,
                  disabled: item.disabled || unref(disabled),
                  "data-slot": "base",
                  class: ui.value.base({
                    class: [(_c2 = unref(props).ui) == null ? void 0 : _c2.base, (_d2 = item.ui) == null ? void 0 : _d2.base],
                    disabled: item.disabled || unref(disabled)
                  })
                }, {
                  default: withCtx(() => {
                    var _a6, _b4;
                    return [createVNode(unref(RadioGroupIndicator_default), {
                      "data-slot": "indicator",
                      class: ui.value.indicator({ class: [(_a6 = unref(props).ui) == null ? void 0 : _a6.indicator, (_b4 = item.ui) == null ? void 0 : _b4.indicator] })
                    }, null, 8, ["class"])];
                  }),
                  _: 2
                }, 1032, [
                  "id",
                  "value",
                  "disabled",
                  "class"
                ])], 2), item.label || !!slots.label || item.description || !!slots.description ? (openBlock(), createBlock("div", {
                  key: 0,
                  "data-slot": "wrapper",
                  class: ui.value.wrapper({ class: [(_e = unref(props).ui) == null ? void 0 : _e.wrapper, (_f = item.ui) == null ? void 0 : _f.wrapper] })
                }, [item.label || !!slots.label ? (openBlock(), createBlock(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? unref(Label_default) : "p"), {
                  key: 0,
                  for: item.id,
                  "data-slot": "label",
                  class: ui.value.label({
                    class: [(_g = unref(props).ui) == null ? void 0 : _g.label, (_h = item.ui) == null ? void 0 : _h.label],
                    disabled: item.disabled || unref(disabled)
                  })
                }, {
                  default: withCtx(() => [renderSlot(_ctx.$slots, "label", {
                    item,
                    modelValue: unref(props).modelValue
                  }, () => [createTextVNode(toDisplayString(item.label), 1)])]),
                  _: 2
                }, 1032, ["for", "class"])) : createCommentVNode("", true), item.description || !!slots.description ? (openBlock(), createBlock("p", {
                  key: 1,
                  "data-slot": "description",
                  class: ui.value.description({
                    class: [(_i = unref(props).ui) == null ? void 0 : _i.description, (_j = item.ui) == null ? void 0 : _j.description],
                    disabled: item.disabled || unref(disabled)
                  })
                }, [renderSlot(_ctx.$slots, "description", {
                  item,
                  modelValue: unref(props).modelValue
                }, () => [createTextVNode(toDisplayString(item.description), 1)])], 2)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true)];
              }),
              _: 2
            }, 1032, ["class"]);
          }), 128))], 16)];
        }),
        _: 3
      }, _parent));
    };
  }
};
var _sfc_setup$4 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var MissingFieldsForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MissingFieldsForm",
  __ssrInlineRender: true,
  props: {
    member: {},
    auth: {}
  },
  emits: ["completed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { updateMember } = useMemberApi();
    const open = ref(true);
    const ageRangeOptions = getAgeRangeOptions();
    const missingAge = computed(() => !props.member.birthYear);
    const missingGender = computed(() => !props.member.gender);
    const gender = ref(void 0);
    const birthYear = ref(void 0);
    const previewAge = computed(() => {
      if (!birthYear.value) return null;
      return calculateAge(birthYear.value);
    });
    const previewAgeRange = computed(() => {
      if (previewAge.value === null) return null;
      return ageRangeLabel(calculateAgeRange(previewAge.value));
    });
    const isSubmitting = ref(false);
    const submitError = ref("");
    const canSubmit = computed(() => {
      if (missingGender.value && !gender.value) return false;
      if (missingAge.value && !birthYear.value) return false;
      return true;
    });
    async function onSubmit() {
      if (!canSubmit.value) {
        submitError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A";
        return;
      }
      isSubmitting.value = true;
      submitError.value = "";
      try {
        const fields = {};
        if (missingGender.value && gender.value) fields.gender = gender.value;
        if (missingAge.value && birthYear.value) fields.birthYear = birthYearRangeValueFor(birthYear.value);
        const result = await updateMember(props.member.memberId, fields);
        if (!result.success || !result.member) {
          submitError.value = result.error || "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
          return;
        }
        emit("completed", result.member);
      } catch (err) {
        submitError.value = err instanceof Error ? err.message : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UAvatar = _sfc_main$5;
      const _component_UIcon = _sfc_main$7;
      const _component_UFormField = _sfc_main$3;
      const _component_URadioGroup = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$1$1;
      const _component_UButton = _sfc_main$2$1;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: unref(open),
        "onUpdate:open": ($event) => isRef(open) ? open.value = $event : null,
        fullscreen: "",
        dismissible: false,
        close: false,
        title: "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21",
        description: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E02\u0E32\u0E14\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"
      }, _attrs), {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="missing-fields-form" data-v-43b92180${_scopeId}><div class="missing-fields-form__scroll" data-v-43b92180${_scopeId}><div class="missing-fields-form__header" data-v-43b92180${_scopeId}>`);
            if (__props.member.pictureUrl) _push2(ssrRenderComponent(_component_UAvatar, {
              src: __props.member.pictureUrl,
              size: "3xl",
              class: "brand-avatar"
            }, null, _parent2, _scopeId));
            else {
              _push2(`<div class="brand-mark" data-v-43b92180${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-user-round-plus",
                class: "brand-mark__icon"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`<h1 class="title" data-v-43b92180${_scopeId}>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07, ${ssrInterpolate(__props.member.firstName)}</h1><p class="subtitle" data-v-43b92180${_scopeId}>\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21\u0E2D\u0E35\u0E01\u0E40\u0E25\u0E47\u0E01\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</p></div><form class="missing-fields-form__body" data-v-43b92180${_scopeId}>`);
            if (unref(missingGender)) _push2(ssrRenderComponent(_component_UFormField, {
              label: "\u0E40\u0E1E\u0E28",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(ssrRenderComponent(_component_URadioGroup, {
                  modelValue: unref(gender),
                  "onUpdate:modelValue": ($event) => isRef(gender) ? gender.value = $event : null,
                  items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                  orientation: "horizontal",
                  variant: "card",
                  class: "gender-grid"
                }, null, _parent3, _scopeId2));
                else return [createVNode(_component_URadioGroup, {
                  modelValue: unref(gender),
                  "onUpdate:modelValue": ($event) => isRef(gender) ? gender.value = $event : null,
                  items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                  orientation: "horizontal",
                  variant: "card",
                  class: "gender-grid"
                }, null, 8, [
                  "modelValue",
                  "onUpdate:modelValue",
                  "items"
                ])];
              }),
              _: 1
            }, _parent2, _scopeId));
            else _push2(`<!---->`);
            if (unref(missingAge)) _push2(ssrRenderComponent(_component_UFormField, {
              label: "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(ssrRenderComponent(_component_USelectMenu, {
                  modelValue: unref(birthYear),
                  "onUpdate:modelValue": ($event) => isRef(birthYear) ? birthYear.value = $event : null,
                  items: unref(ageRangeOptions),
                  "value-key": "value",
                  placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                  size: "xl",
                  class: "w-full"
                }, null, _parent3, _scopeId2));
                else return [createVNode(_component_USelectMenu, {
                  modelValue: unref(birthYear),
                  "onUpdate:modelValue": ($event) => isRef(birthYear) ? birthYear.value = $event : null,
                  items: unref(ageRangeOptions),
                  "value-key": "value",
                  placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                  size: "xl",
                  class: "w-full"
                }, null, 8, [
                  "modelValue",
                  "onUpdate:modelValue",
                  "items"
                ])];
              }),
              _: 1
            }, _parent2, _scopeId));
            else _push2(`<!---->`);
            if (unref(previewAge) !== null) _push2(`<div class="age-preview" data-v-43b92180${_scopeId}><span class="age-preview__label" data-v-43b92180${_scopeId}>\u0E2D\u0E32\u0E22\u0E38\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13</span><span class="age-preview__value" data-v-43b92180${_scopeId}>${ssrInterpolate(unref(previewAgeRange))}</span></div>`);
            else _push2(`<!---->`);
            if (unref(submitError)) _push2(`<p class="submit-error" data-v-43b92180${_scopeId}>${ssrInterpolate(unref(submitError))}</p>`);
            else _push2(`<!---->`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              size: "xl",
              color: "primary",
              class: "submit-button",
              loading: unref(isSubmitting),
              disabled: unref(isSubmitting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(` \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 `);
                else return [createTextVNode(" \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 ")];
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form></div></div>`);
          } else return [createVNode("div", { class: "missing-fields-form" }, [createVNode("div", { class: "missing-fields-form__scroll" }, [createVNode("div", { class: "missing-fields-form__header" }, [
            __props.member.pictureUrl ? (openBlock(), createBlock(_component_UAvatar, {
              key: 0,
              src: __props.member.pictureUrl,
              size: "3xl",
              class: "brand-avatar"
            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
              key: 1,
              class: "brand-mark"
            }, [createVNode(_component_UIcon, {
              name: "i-lucide-user-round-plus",
              class: "brand-mark__icon"
            })])),
            createVNode("h1", { class: "title" }, "\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07, " + toDisplayString(__props.member.firstName), 1),
            createVNode("p", { class: "subtitle" }, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21\u0E2D\u0E35\u0E01\u0E40\u0E25\u0E47\u0E01\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19")
          ]), createVNode("form", {
            class: "missing-fields-form__body",
            onSubmit: withModifiers(onSubmit, ["prevent"])
          }, [
            unref(missingGender) ? (openBlock(), createBlock(_component_UFormField, {
              key: 0,
              label: "\u0E40\u0E1E\u0E28",
              required: ""
            }, {
              default: withCtx(() => [createVNode(_component_URadioGroup, {
                modelValue: unref(gender),
                "onUpdate:modelValue": ($event) => isRef(gender) ? gender.value = $event : null,
                items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                orientation: "horizontal",
                variant: "card",
                class: "gender-grid"
              }, null, 8, [
                "modelValue",
                "onUpdate:modelValue",
                "items"
              ])]),
              _: 1
            })) : createCommentVNode("", true),
            unref(missingAge) ? (openBlock(), createBlock(_component_UFormField, {
              key: 1,
              label: "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
              required: ""
            }, {
              default: withCtx(() => [createVNode(_component_USelectMenu, {
                modelValue: unref(birthYear),
                "onUpdate:modelValue": ($event) => isRef(birthYear) ? birthYear.value = $event : null,
                items: unref(ageRangeOptions),
                "value-key": "value",
                placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                size: "xl",
                class: "w-full"
              }, null, 8, [
                "modelValue",
                "onUpdate:modelValue",
                "items"
              ])]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(Transition, { name: "fade" }, {
              default: withCtx(() => [unref(previewAge) !== null ? (openBlock(), createBlock("div", {
                key: 0,
                class: "age-preview"
              }, [createVNode("span", { class: "age-preview__label" }, "\u0E2D\u0E32\u0E22\u0E38\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13"), createVNode("span", { class: "age-preview__value" }, toDisplayString(unref(previewAgeRange)), 1)])) : createCommentVNode("", true)]),
              _: 1
            }),
            createVNode(Transition, { name: "fade" }, {
              default: withCtx(() => [unref(submitError) ? (openBlock(), createBlock("p", {
                key: 0,
                class: "submit-error"
              }, toDisplayString(unref(submitError)), 1)) : createCommentVNode("", true)]),
              _: 1
            }),
            createVNode(_component_UButton, {
              type: "submit",
              block: "",
              size: "xl",
              color: "primary",
              class: "submit-button",
              loading: unref(isSubmitting),
              disabled: unref(isSubmitting)
            }, {
              default: withCtx(() => [createTextVNode(" \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 ")]),
              _: 1
            }, 8, ["loading", "disabled"])
          ], 32)])])];
        }),
        _: 1
      }, _parent));
    };
  }
});
var _sfc_setup$3 = MissingFieldsForm_vue_vue_type_script_setup_true_lang_default.setup;
MissingFieldsForm_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MissingFieldsForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var MissingFieldsForm_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(MissingFieldsForm_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-43b92180"]]), { __name: "MissingFieldsForm" });
function isSuperStructSchema(schema) {
  return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}
function isStandardSchema(schema) {
  return "~standard" in schema;
}
async function validateStandardSchema(state, schema) {
  var _a;
  const result = await schema["~standard"].validate(state);
  if (result.issues) return {
    errors: ((_a = result.issues) == null ? void 0 : _a.map((issue) => {
      var _a2;
      return {
        name: ((_a2 = issue.path) == null ? void 0 : _a2.map((item) => typeof item === "object" ? item.key : item).join(".")) || "",
        message: issue.message
      };
    })) || [],
    result: null
  };
  return {
    errors: null,
    result: result.value
  };
}
async function validateSuperstructSchema(state, schema) {
  const [err, result] = schema.validate(state);
  if (err) return {
    errors: err.failures().map((error) => ({
      message: error.message,
      name: error.path.join(".")
    })),
    result: null
  };
  return {
    errors: null,
    result
  };
}
function validateSchema(state, schema) {
  if (isStandardSchema(schema)) return validateStandardSchema(state, schema);
  else if (isSuperStructSchema(schema)) return validateSuperstructSchema(state, schema);
  else throw new Error("Form validation failed: Unsupported form schema");
}
function getAtPath(data, path) {
  if (!path) return data;
  return path.split(".").reduce((value2, key) => value2 == null ? void 0 : value2[key], data);
}
function setAtPath(data, path, value) {
  if (!path) return Object.assign(data, value);
  if (!data) return data;
  const keys = path.split(".");
  let current = data;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === void 0 || current[key] === null) {
      if (i + 1 < keys.length && !Number.isNaN(Number(keys[i + 1]))) current[key] = [];
      else current[key] = {};
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return data;
}
var FormValidationException = class FormValidationException2 extends Error {
  constructor(formId, errors) {
    super("Form validation exception");
    __publicField(this, "formId");
    __publicField(this, "errors");
    this.formId = formId;
    this.errors = errors;
    Object.setPrototypeOf(this, FormValidationException2.prototype);
  }
};
var virtual_nuxt__nuxt_2Fui_2Fform_default = { "base": "" };
var _sfc_main = {
  __name: "UForm",
  __ssrInlineRender: true,
  props: {
    id: {
      type: [String, Number],
      required: false
    },
    schema: {
      type: null,
      required: false
    },
    state: {
      type: null,
      required: false
    },
    validate: {
      type: Function,
      required: false
    },
    validateOn: {
      type: Array,
      required: false,
      default() {
        return [
          "input",
          "blur",
          "change"
        ];
      }
    },
    disabled: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    validateOnInputDelay: {
      type: Number,
      required: false,
      default: 300
    },
    transform: {
      type: null,
      required: false,
      default: () => true
    },
    nested: {
      type: Boolean,
      required: false
    },
    loadingAuto: {
      type: Boolean,
      required: false,
      default: true
    },
    class: {
      type: null,
      required: false
    },
    ui: {
      type: Object,
      required: false
    },
    onSubmit: {
      type: Function,
      required: false
    }
  },
  emits: ["submit", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const _props = __props;
    const emits = __emit;
    const props = useComponentProps("form", _props);
    const appConfig = useAppConfig();
    const ui = computed(() => {
      var _a2;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Fform_default,
        ...((_a2 = appConfig.ui) == null ? void 0 : _a2.form) || {}
      });
    });
    const formId = (_a = props.id) != null ? _a : useId();
    const formRef = useTemplateRef("formRef");
    const bus = useEventBus(`form-${formId}`);
    const parentBus = props.nested === true && inject(formBusInjectionKey, void 0);
    const parentState = props.nested === true ? inject(formStateInjectionKey, void 0) : void 0;
    const state = computed(() => {
      if (parentState == null ? void 0 : parentState.value) return props.name ? getAtPath(parentState.value, props.name) : parentState.value;
      return props.state;
    });
    provide(formBusInjectionKey, bus);
    provide(formStateInjectionKey, state);
    const nestedForms = ref(/* @__PURE__ */ new Map());
    const errors = ref([]);
    provide(formErrorsInjectionKey, errors);
    const inputs = ref({});
    provide(formInputsInjectionKey, inputs);
    const dirtyFields = reactive(/* @__PURE__ */ new Set());
    const touchedFields = reactive(/* @__PURE__ */ new Set());
    const blurredFields = reactive(/* @__PURE__ */ new Set());
    function resolveErrorIds(errs) {
      return errs.map((err) => {
        var _a2;
        return {
          ...err,
          id: (err == null ? void 0 : err.name) ? (_a2 = inputs.value[err.name]) == null ? void 0 : _a2.id : void 0
        };
      });
    }
    const transformedState = ref(null);
    async function getErrors() {
      var _a2;
      let errs = props.validate ? (_a2 = await props.validate(state.value)) != null ? _a2 : [] : [];
      if (props.schema) {
        const { errors: errors2, result } = await validateSchema(state.value, props.schema);
        if (errors2) errs = errs.concat(errors2);
        else transformedState.value = result;
      }
      return resolveErrorIds(errs);
    }
    async function _validate(opts = {
      silent: false,
      nested: false,
      transform: false
    }) {
      var _a2, _b;
      const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name;
      let nestedResults = [];
      let nestedErrors = [];
      if (!names && opts.nested) {
        const validations = Array.from(nestedForms.value.values()).map((form) => validateNestedForm(form, opts));
        const results = await Promise.all(validations);
        nestedErrors = results.filter((r) => r.error).flatMap((r) => r.error.errors.map((e) => addFormPath(e, r.name)));
        nestedResults = results.filter((r) => r.output !== void 0);
      }
      const allErrors = [...await getErrors(), ...nestedErrors];
      if (names) errors.value = filterErrorsByNames(allErrors, names);
      else errors.value = allErrors;
      if ((_a2 = errors.value) == null ? void 0 : _a2.length) {
        if (opts.silent) return false;
        throw new FormValidationException(formId, errors.value);
      }
      if (opts.transform) {
        nestedResults.forEach((result) => {
          if (result.name) setAtPath(transformedState.value, result.name, result.output);
          else Object.assign(transformedState.value, result.output);
        });
        return (_b = transformedState.value) != null ? _b : state.value;
      }
      return state.value;
    }
    const loading = ref(false);
    provide(formLoadingInjectionKey, readonly(loading));
    async function onSubmitWrapper(payload) {
      var _a2;
      loading.value = !!props.loadingAuto;
      const event = payload;
      try {
        event.data = await _validate({
          nested: true,
          transform: props.transform
        });
        await ((_a2 = props.onSubmit) == null ? void 0 : _a2.call(props, event));
        dirtyFields.clear();
      } catch (error) {
        if (!(error instanceof FormValidationException)) throw error;
        const errorEvent = {
          ...event,
          errors: error.errors
        };
        emits("error", errorEvent);
      } finally {
        loading.value = false;
      }
    }
    const disabled = computed(() => props.disabled || loading.value);
    provide(formOptionsInjectionKey, computed(() => ({
      disabled: disabled.value,
      validateOnInputDelay: props.validateOnInputDelay
    })));
    async function validateNestedForm(form, opts) {
      try {
        const result = await form.validate({
          ...opts,
          silent: false
        });
        return {
          name: form.name,
          output: result
        };
      } catch (error) {
        if (!(error instanceof FormValidationException)) throw error;
        return {
          name: form.name,
          error
        };
      }
    }
    function addFormPath(error, formPath) {
      if (!formPath || !error.name) return error;
      return {
        ...error,
        name: formPath + "." + error.name
      };
    }
    function stripFormPath(error, formPath) {
      var _a2;
      const prefix = formPath + ".";
      const name = ((_a2 = error == null ? void 0 : error.name) == null ? void 0 : _a2.startsWith(prefix)) ? error.name.substring(prefix.length) : error.name;
      return {
        ...error,
        name
      };
    }
    function filterFormErrors(errors2, formPath) {
      if (!formPath) return errors2;
      return errors2.filter((e) => {
        var _a2;
        return (_a2 = e == null ? void 0 : e.name) == null ? void 0 : _a2.startsWith(formPath + ".");
      }).map((e) => stripFormPath(e, formPath));
    }
    function getFormErrors(form) {
      return form.api.getErrors().map((e) => form.name ? {
        ...e,
        name: form.name + "." + e.name
      } : e);
    }
    function matchesTarget(target, path) {
      if (!target || !path) return true;
      if (target instanceof RegExp) return target.test(path);
      return path === target || typeof target === "string" && target.startsWith(path + ".");
    }
    function getNestedTarget(target, formPath) {
      if (!target || target instanceof RegExp) return target;
      if (formPath === target) return void 0;
      if (typeof target === "string" && target.startsWith(formPath + ".")) return target.substring(formPath.length + 1);
      return target;
    }
    function filterErrorsByNames(allErrors, names) {
      const nameSet = new Set(names);
      const patterns = names.map((name) => {
        var _a2, _b;
        return (_b = (_a2 = inputs.value) == null ? void 0 : _a2[name]) == null ? void 0 : _b.pattern;
      }).filter(Boolean);
      const matchesNames = (error) => {
        if (!error.name) return false;
        if (nameSet.has(error.name)) return true;
        return patterns.some((pattern) => pattern.test(error.name));
      };
      const keepErrors = errors.value.filter((error) => !matchesNames(error));
      const newErrors = allErrors.filter(matchesNames);
      return [...keepErrors, ...newErrors];
    }
    function filterErrorsByTarget(currentErrors, target) {
      return currentErrors.filter((err) => target instanceof RegExp ? !(err.name && target.test(err.name)) : !err.name || err.name !== target);
    }
    function isLocalError(error) {
      return !error.name || !!inputs.value[error.name];
    }
    __expose({
      validate: _validate,
      errors,
      setErrors(errs, name) {
        const localErrors = resolveErrorIds(errs.filter(isLocalError));
        const nestedErrors = [];
        for (const form of nestedForms.value.values()) if (matchesTarget(name, form.name)) {
          const formErrors = filterFormErrors(errs, form.name);
          form.api.setErrors(formErrors, getNestedTarget(name, form.name || ""));
          nestedErrors.push(...getFormErrors(form));
        }
        if (name) {
          const keepErrors = filterErrorsByTarget(errors.value, name);
          errors.value = [
            ...keepErrors,
            ...localErrors,
            ...nestedErrors
          ];
        } else errors.value = [...localErrors, ...nestedErrors];
      },
      async submit() {
        if (formRef.value instanceof HTMLFormElement && formRef.value.reportValidity() === false) return;
        await onSubmitWrapper(new Event("submit"));
      },
      getErrors(name) {
        if (!name) return errors.value;
        return errors.value.filter((err) => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name);
      },
      clear(name) {
        const localErrors = name ? errors.value.filter((err) => isLocalError(err) && (name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name)) : [];
        const nestedErrors = [];
        for (const form of nestedForms.value.values()) {
          if (matchesTarget(name, form.name)) form.api.clear();
          nestedErrors.push(...getFormErrors(form));
        }
        errors.value = [...localErrors, ...nestedErrors];
      },
      disabled,
      loading,
      dirty: computed(() => !!dirtyFields.size),
      dirtyFields: readonly(dirtyFields),
      blurredFields: readonly(blurredFields),
      touchedFields: readonly(touchedFields)
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(parentBus) ? "div" : "form"), mergeProps({
        id: unref(formId),
        ref_key: "formRef",
        ref: formRef,
        name: unref(parentBus) ? void 0 : unref(props).name,
        method: "post",
        class: ui.value({ class: [(_a2 = unref(props).ui) == null ? void 0 : _a2.base, unref(props).class] }),
        onSubmit: onSubmitWrapper
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) ssrRenderSlot(_ctx.$slots, "default", {
            errors: errors.value,
            loading: loading.value
          }, null, _push2, _parent2, _scopeId);
          else return [renderSlot(_ctx.$slots, "default", {
            errors: errors.value,
            loading: loading.value
          })];
        }),
        _: 3
      }), _parent);
    };
  }
};
var _sfc_setup$2 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Form.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ProfileForm_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ProfileForm",
  __ssrInlineRender: true,
  props: {
    auth: {},
    offlineMode: { type: Boolean }
  },
  emits: ["registered"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const { saveProfile } = useProfile();
    const { syncMember } = useMemberApi();
    const open = ref(true);
    const ageRangeOptions = getAgeRangeOptions();
    const state = reactive({
      firstName: props.auth.loginType === "line" ? (_a = props.auth.displayName) != null ? _a : "" : "",
      lastName: "",
      gender: void 0,
      birthYear: void 0,
      phone: ""
    });
    const previewAge = computed(() => {
      if (!state.birthYear) return null;
      return calculateAge(state.birthYear);
    });
    const previewAgeRange = computed(() => {
      if (previewAge.value === null) return null;
      return ageRangeLabel(calculateAgeRange(previewAge.value));
    });
    const isSubmitting = ref(false);
    const submitError = ref("");
    async function onSubmit(event) {
      isSubmitting.value = true;
      submitError.value = "";
      try {
        if (props.offlineMode) {
          saveProfile({
            firstName: event.data.firstName,
            lastName: event.data.lastName,
            gender: event.data.gender,
            birthYear: event.data.birthYear,
            phone: event.data.phone
          }, props.auth);
          emit("registered");
          return;
        }
        const result = await syncMember({
          firstName: event.data.firstName,
          lastName: event.data.lastName,
          phone: event.data.phone,
          gender: event.data.gender,
          birthYear: birthYearRangeValueFor(event.data.birthYear)
        }, props.auth);
        if (!result.success || !result.member) {
          submitError.value = result.error || "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
          return;
        }
        saveProfile({
          firstName: event.data.firstName,
          lastName: event.data.lastName,
          gender: event.data.gender,
          birthYear: event.data.birthYear,
          phone: event.data.phone
        }, props.auth, result.member);
        emit("registered");
      } catch (err) {
        submitError.value = err instanceof Error ? err.message : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
      } finally {
        isSubmitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UAvatar = _sfc_main$5;
      const _component_UIcon = _sfc_main$7;
      const _component_UBadge = _sfc_main$4;
      const _component_UForm = _sfc_main;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$6;
      const _component_URadioGroup = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$1$1;
      const _component_UButton = _sfc_main$2$1;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: unref(open),
        "onUpdate:open": ($event) => isRef(open) ? open.value = $event : null,
        fullscreen: "",
        dismissible: false,
        close: false,
        title: "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49",
        description: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"
      }, _attrs), {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="profile-form" data-v-3bad5844${_scopeId}><div class="profile-form__scroll" data-v-3bad5844${_scopeId}><div class="profile-form__header" data-v-3bad5844${_scopeId}>`);
            if (__props.auth.pictureUrl) _push2(ssrRenderComponent(_component_UAvatar, {
              src: __props.auth.pictureUrl,
              size: "3xl",
              class: "brand-avatar"
            }, null, _parent2, _scopeId));
            else {
              _push2(`<div class="brand-mark" data-v-3bad5844${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-user-round-plus",
                class: "brand-mark__icon"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`<h1 class="title" data-v-3bad5844${_scopeId}>\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49</h1><p class="subtitle" data-v-3bad5844${_scopeId}>\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E41\u0E2D\u0E1B\u0E1E\u0E25\u0E34\u0E40\u0E04\u0E0A\u0E31\u0E19</p>`);
            if (__props.auth.loginType === "line" && __props.auth.displayName) _push2(ssrRenderComponent(_component_UBadge, {
              color: "success",
              variant: "subtle",
              size: "md",
              class: "line-badge"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-simple-icons-line",
                    class: "line-badge__icon"
                  }, null, _parent3, _scopeId2));
                  _push3(` \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 LINE: ${ssrInterpolate(__props.auth.displayName)}`);
                } else return [createVNode(_component_UIcon, {
                  name: "i-simple-icons-line",
                  class: "line-badge__icon"
                }), createTextVNode(" \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 LINE: " + toDisplayString(__props.auth.displayName), 1)];
              }),
              _: 1
            }, _parent2, _scopeId));
            else _push2(`<!---->`);
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UForm, {
              schema: "profileSchema" in _ctx ? _ctx.profileSchema : unref(profileSchema),
              state: unref(state),
              class: "profile-form__body",
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0E0A\u0E37\u0E48\u0E2D",
                    name: "firstName",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) _push4(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(state).firstName,
                        "onUpdate:modelValue": ($event) => unref(state).firstName = $event,
                        placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                        size: "xl",
                        class: "w-full"
                      }, null, _parent4, _scopeId3));
                      else return [createVNode(_component_UInput, {
                        modelValue: unref(state).firstName,
                        "onUpdate:modelValue": ($event) => unref(state).firstName = $event,
                        placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                        size: "xl",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])];
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25",
                    name: "lastName",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) _push4(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(state).lastName,
                        "onUpdate:modelValue": ($event) => unref(state).lastName = $event,
                        placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                        size: "xl",
                        class: "w-full"
                      }, null, _parent4, _scopeId3));
                      else return [createVNode(_component_UInput, {
                        modelValue: unref(state).lastName,
                        "onUpdate:modelValue": ($event) => unref(state).lastName = $event,
                        placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                        size: "xl",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])];
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C",
                    name: "phone",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) _push4(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(state).phone,
                        "onUpdate:modelValue": ($event) => unref(state).phone = $event,
                        type: "tel",
                        inputmode: "numeric",
                        placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E40\u0E0A\u0E48\u0E19 0812345678",
                        maxlength: "10",
                        size: "xl",
                        class: "w-full"
                      }, null, _parent4, _scopeId3));
                      else return [createVNode(_component_UInput, {
                        modelValue: unref(state).phone,
                        "onUpdate:modelValue": ($event) => unref(state).phone = $event,
                        type: "tel",
                        inputmode: "numeric",
                        placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E40\u0E0A\u0E48\u0E19 0812345678",
                        maxlength: "10",
                        size: "xl",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])];
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0E40\u0E1E\u0E28",
                    name: "gender",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) _push4(ssrRenderComponent(_component_URadioGroup, {
                        modelValue: unref(state).gender,
                        "onUpdate:modelValue": ($event) => unref(state).gender = $event,
                        items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                        orientation: "horizontal",
                        variant: "card",
                        class: "gender-grid"
                      }, null, _parent4, _scopeId3));
                      else return [createVNode(_component_URadioGroup, {
                        modelValue: unref(state).gender,
                        "onUpdate:modelValue": ($event) => unref(state).gender = $event,
                        items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                        orientation: "horizontal",
                        variant: "card",
                        class: "gender-grid"
                      }, null, 8, [
                        "modelValue",
                        "onUpdate:modelValue",
                        "items"
                      ])];
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                    name: "birthYear",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) _push4(ssrRenderComponent(_component_USelectMenu, {
                        modelValue: unref(state).birthYear,
                        "onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
                        items: unref(ageRangeOptions),
                        "value-key": "value",
                        placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                        size: "xl",
                        class: "w-full"
                      }, null, _parent4, _scopeId3));
                      else return [createVNode(_component_USelectMenu, {
                        modelValue: unref(state).birthYear,
                        "onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
                        items: unref(ageRangeOptions),
                        "value-key": "value",
                        placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                        size: "xl",
                        class: "w-full"
                      }, null, 8, [
                        "modelValue",
                        "onUpdate:modelValue",
                        "items"
                      ])];
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(``);
                  if (unref(previewAge) !== null) _push3(`<div class="age-preview" data-v-3bad5844${_scopeId2}><span class="age-preview__label" data-v-3bad5844${_scopeId2}>\u0E2D\u0E32\u0E22\u0E38\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13</span><span class="age-preview__value" data-v-3bad5844${_scopeId2}>${ssrInterpolate(unref(previewAgeRange))}</span></div>`);
                  else _push3(`<!---->`);
                  _push3(``);
                  if (unref(submitError)) _push3(`<p class="submit-error" data-v-3bad5844${_scopeId2}>${ssrInterpolate(unref(submitError))}</p>`);
                  else _push3(`<!---->`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    block: "",
                    size: "xl",
                    color: "primary",
                    class: "submit-button",
                    loading: unref(isSubmitting),
                    disabled: unref(isSubmitting)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) _push4(` \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 `);
                      else return [createTextVNode(" \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 ")];
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else return [
                  createVNode(_component_UFormField, {
                    label: "\u0E0A\u0E37\u0E48\u0E2D",
                    name: "firstName",
                    required: ""
                  }, {
                    default: withCtx(() => [createVNode(_component_UInput, {
                      modelValue: unref(state).firstName,
                      "onUpdate:modelValue": ($event) => unref(state).firstName = $event,
                      placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                      size: "xl",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25",
                    name: "lastName",
                    required: ""
                  }, {
                    default: withCtx(() => [createVNode(_component_UInput, {
                      modelValue: unref(state).lastName,
                      "onUpdate:modelValue": ($event) => unref(state).lastName = $event,
                      placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                      size: "xl",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C",
                    name: "phone",
                    required: ""
                  }, {
                    default: withCtx(() => [createVNode(_component_UInput, {
                      modelValue: unref(state).phone,
                      "onUpdate:modelValue": ($event) => unref(state).phone = $event,
                      type: "tel",
                      inputmode: "numeric",
                      placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E40\u0E0A\u0E48\u0E19 0812345678",
                      maxlength: "10",
                      size: "xl",
                      class: "w-full"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0E40\u0E1E\u0E28",
                    name: "gender",
                    required: ""
                  }, {
                    default: withCtx(() => [createVNode(_component_URadioGroup, {
                      modelValue: unref(state).gender,
                      "onUpdate:modelValue": ($event) => unref(state).gender = $event,
                      items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                      orientation: "horizontal",
                      variant: "card",
                      class: "gender-grid"
                    }, null, 8, [
                      "modelValue",
                      "onUpdate:modelValue",
                      "items"
                    ])]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                    name: "birthYear",
                    required: ""
                  }, {
                    default: withCtx(() => [createVNode(_component_USelectMenu, {
                      modelValue: unref(state).birthYear,
                      "onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
                      items: unref(ageRangeOptions),
                      "value-key": "value",
                      placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                      size: "xl",
                      class: "w-full"
                    }, null, 8, [
                      "modelValue",
                      "onUpdate:modelValue",
                      "items"
                    ])]),
                    _: 1
                  }),
                  createVNode(Transition, { name: "fade" }, {
                    default: withCtx(() => [unref(previewAge) !== null ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "age-preview"
                    }, [createVNode("span", { class: "age-preview__label" }, "\u0E2D\u0E32\u0E22\u0E38\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13"), createVNode("span", { class: "age-preview__value" }, toDisplayString(unref(previewAgeRange)), 1)])) : createCommentVNode("", true)]),
                    _: 1
                  }),
                  createVNode(Transition, { name: "fade" }, {
                    default: withCtx(() => [unref(submitError) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "submit-error"
                    }, toDisplayString(unref(submitError)), 1)) : createCommentVNode("", true)]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    block: "",
                    size: "xl",
                    color: "primary",
                    class: "submit-button",
                    loading: unref(isSubmitting),
                    disabled: unref(isSubmitting)
                  }, {
                    default: withCtx(() => [createTextVNode(" \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 ")]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ];
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else return [createVNode("div", { class: "profile-form" }, [createVNode("div", { class: "profile-form__scroll" }, [createVNode("div", { class: "profile-form__header" }, [
            __props.auth.pictureUrl ? (openBlock(), createBlock(_component_UAvatar, {
              key: 0,
              src: __props.auth.pictureUrl,
              size: "3xl",
              class: "brand-avatar"
            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
              key: 1,
              class: "brand-mark"
            }, [createVNode(_component_UIcon, {
              name: "i-lucide-user-round-plus",
              class: "brand-mark__icon"
            })])),
            createVNode("h1", { class: "title" }, "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49"),
            createVNode("p", { class: "subtitle" }, "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E41\u0E2D\u0E1B\u0E1E\u0E25\u0E34\u0E40\u0E04\u0E0A\u0E31\u0E19"),
            __props.auth.loginType === "line" && __props.auth.displayName ? (openBlock(), createBlock(_component_UBadge, {
              key: 2,
              color: "success",
              variant: "subtle",
              size: "md",
              class: "line-badge"
            }, {
              default: withCtx(() => [createVNode(_component_UIcon, {
                name: "i-simple-icons-line",
                class: "line-badge__icon"
              }), createTextVNode(" \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 LINE: " + toDisplayString(__props.auth.displayName), 1)]),
              _: 1
            })) : createCommentVNode("", true)
          ]), createVNode(_component_UForm, {
            schema: "profileSchema" in _ctx ? _ctx.profileSchema : unref(profileSchema),
            state: unref(state),
            class: "profile-form__body",
            onSubmit
          }, {
            default: withCtx(() => [
              createVNode(_component_UFormField, {
                label: "\u0E0A\u0E37\u0E48\u0E2D",
                name: "firstName",
                required: ""
              }, {
                default: withCtx(() => [createVNode(_component_UInput, {
                  modelValue: unref(state).firstName,
                  "onUpdate:modelValue": ($event) => unref(state).firstName = $event,
                  placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                  size: "xl",
                  class: "w-full"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])]),
                _: 1
              }),
              createVNode(_component_UFormField, {
                label: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25",
                name: "lastName",
                required: ""
              }, {
                default: withCtx(() => [createVNode(_component_UInput, {
                  modelValue: unref(state).lastName,
                  "onUpdate:modelValue": ($event) => unref(state).lastName = $event,
                  placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
                  size: "xl",
                  class: "w-full"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])]),
                _: 1
              }),
              createVNode(_component_UFormField, {
                label: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C",
                name: "phone",
                required: ""
              }, {
                default: withCtx(() => [createVNode(_component_UInput, {
                  modelValue: unref(state).phone,
                  "onUpdate:modelValue": ($event) => unref(state).phone = $event,
                  type: "tel",
                  inputmode: "numeric",
                  placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E40\u0E0A\u0E48\u0E19 0812345678",
                  maxlength: "10",
                  size: "xl",
                  class: "w-full"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])]),
                _: 1
              }),
              createVNode(_component_UFormField, {
                label: "\u0E40\u0E1E\u0E28",
                name: "gender",
                required: ""
              }, {
                default: withCtx(() => [createVNode(_component_URadioGroup, {
                  modelValue: unref(state).gender,
                  "onUpdate:modelValue": ($event) => unref(state).gender = $event,
                  items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
                  orientation: "horizontal",
                  variant: "card",
                  class: "gender-grid"
                }, null, 8, [
                  "modelValue",
                  "onUpdate:modelValue",
                  "items"
                ])]),
                _: 1
              }),
              createVNode(_component_UFormField, {
                label: "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                name: "birthYear",
                required: ""
              }, {
                default: withCtx(() => [createVNode(_component_USelectMenu, {
                  modelValue: unref(state).birthYear,
                  "onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
                  items: unref(ageRangeOptions),
                  "value-key": "value",
                  placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
                  size: "xl",
                  class: "w-full"
                }, null, 8, [
                  "modelValue",
                  "onUpdate:modelValue",
                  "items"
                ])]),
                _: 1
              }),
              createVNode(Transition, { name: "fade" }, {
                default: withCtx(() => [unref(previewAge) !== null ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "age-preview"
                }, [createVNode("span", { class: "age-preview__label" }, "\u0E2D\u0E32\u0E22\u0E38\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13"), createVNode("span", { class: "age-preview__value" }, toDisplayString(unref(previewAgeRange)), 1)])) : createCommentVNode("", true)]),
                _: 1
              }),
              createVNode(Transition, { name: "fade" }, {
                default: withCtx(() => [unref(submitError) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "submit-error"
                }, toDisplayString(unref(submitError)), 1)) : createCommentVNode("", true)]),
                _: 1
              }),
              createVNode(_component_UButton, {
                type: "submit",
                block: "",
                size: "xl",
                color: "primary",
                class: "submit-button",
                loading: unref(isSubmitting),
                disabled: unref(isSubmitting)
              }, {
                default: withCtx(() => [createTextVNode(" \u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 ")]),
                _: 1
              }, 8, ["loading", "disabled"])
            ]),
            _: 1
          }, 8, ["schema", "state"])])])];
        }),
        _: 1
      }, _parent));
    };
  }
});
var _sfc_setup$1 = ProfileForm_vue_vue_type_script_setup_true_lang_default.setup;
ProfileForm_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProfileForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ProfileForm_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(ProfileForm_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3bad5844"]]), { __name: "ProfileForm" });
var index_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { authData, hasAuth, isLineLoading, lineError, loginWithLine, loginAsGuest } = useAuth();
    const { profile, hasProfile, loginFromMember } = useProfile();
    const { loginByLine } = useMemberApi();
    const { isOfflineMode, startRound } = useOfflineMode();
    const isReady = ref(false);
    const pendingMember = ref(null);
    function hasMissingFields(member) {
      return !member.birthYear || !member.gender;
    }
    async function resolveLineMember() {
      var _a;
      if (((_a = authData.value) == null ? void 0 : _a.loginType) !== "line" || hasProfile.value) return;
      const lineUserId = authData.value.uid;
      console.log("[resolveLineMember] \u0E40\u0E23\u0E35\u0E22\u0E01 loginByLine \u0E14\u0E49\u0E27\u0E22 lineUserId:", lineUserId);
      try {
        const result = await loginByLine(lineUserId);
        if (result.success && result.found && result.member) {
          if (hasMissingFields(result.member)) {
            pendingMember.value = result.member;
            return;
          }
          loginFromMember(result.member, authData.value);
          await navigateTo("/home");
          return;
        }
        if (!result.success) console.error("[resolveLineMember] loginByLine \u0E15\u0E2D\u0E1A error:", result.error, "| response \u0E17\u0E31\u0E49\u0E07\u0E01\u0E49\u0E2D\u0E19:", result);
      } catch (err) {
        console.error("[resolveLineMember] loginByLine \u0E40\u0E23\u0E35\u0E22\u0E01\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08:", err);
      }
    }
    async function handleSelectLine() {
      var _a;
      if (isOfflineMode.value) return;
      await loginWithLine();
      if (((_a = authData.value) == null ? void 0 : _a.loginType) === "line" && !hasProfile.value) {
        isReady.value = false;
        await resolveLineMember();
        isReady.value = true;
      }
    }
    function handleRegistered() {
      var _a;
      if (isOfflineMode.value && ((_a = profile.value) == null ? void 0 : _a.uid)) startRound(profile.value.uid);
      navigateTo("/home");
    }
    async function handleMissingFieldsCompleted(member) {
      if (!authData.value) return;
      loginFromMember(member, authData.value);
      pendingMember.value = null;
      await navigateTo("/home");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$7;
      const _component_WelcomePage = WelcomePage_default;
      const _component_MissingFieldsForm = MissingFieldsForm_default;
      const _component_ProfileForm = ProfileForm_default;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "phone-shell" }, _attrs))} data-v-db64fc9f><div class="phone-frame" data-v-db64fc9f>`);
      if (!unref(isReady)) {
        _push(`<div class="loading" data-v-db64fc9f>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "loading__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else if (!unref(hasAuth)) _push(ssrRenderComponent(_component_WelcomePage, {
        "line-loading": unref(isLineLoading),
        "line-error": unref(lineError),
        "offline-mode": unref(isOfflineMode),
        onSelectLine: handleSelectLine,
        onSelectGuest: unref(loginAsGuest)
      }, null, _parent));
      else if (unref(pendingMember) && unref(authData)) _push(ssrRenderComponent(_component_MissingFieldsForm, {
        member: unref(pendingMember),
        auth: unref(authData),
        onCompleted: handleMissingFieldsCompleted
      }, null, _parent));
      else if (unref(authData)) _push(ssrRenderComponent(_component_ProfileForm, {
        auth: unref(authData),
        "offline-mode": unref(isOfflineMode),
        onRegistered: handleRegistered
      }, null, _parent));
      else _push(`<!---->`);
      _push(`</div></div>`);
    };
  }
});
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /* @__PURE__ */ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-db64fc9f"]]);

export { pages_default as default };
//# sourceMappingURL=pages-BHo-uPyE.mjs.map
