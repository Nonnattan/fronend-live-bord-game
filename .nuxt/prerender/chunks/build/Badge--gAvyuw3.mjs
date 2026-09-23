import { a as useLocale, b as usePortal, F as FocusScope_default, u as useId$1, T as Teleport_default, P as Presence_default, i as injectConfigProviderContext, c as useBodyScrollLock, d as useHideOthers, D as DismissableLayer_default, g as getActiveElement, h as handleAndDispatchCustomEvent, V as VisuallyHidden_default } from './usePortal-CFE28n6Q.mjs';
import { u as useForwardExpose } from './useForwardExpose-lTVrimVg.mjs';
import { g as useComponentProps, h as useAppConfig, v as useFieldGroup, w as useComponentIcons, t as tv, P as Primitive, b as _sfc_main$7, d as _sfc_main$5, i as useForwardProps, j as useFormField, x as isArrayOfArray, y as compare$1, r as get, z as _sfc_main$6, c as _sfc_main$2, F as FieldGroupReset, A as looseToNumber, B as getDisplayValue, s as createContext, C as useForwardProps$1, D as useEmitAsProps, S as Slot } from '../virtual/entry.mjs';
import { _ as _sfc_main$3 } from './Input-03a9B_yA.mjs';
import { useSlots, computed, unref, mergeProps, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, useModel, toRef, useTemplateRef, ref, watch, nextTick, createVNode, createTextVNode, withModifiers, Fragment, renderList, mergeModels, defineComponent, withMemo, normalizeProps, guardReactiveProps, toRefs, getCurrentInstance, isRef, toRaw, withKeys, watchPostEffect, resolveDynamicComponent, watchSyncEffect, cloneVNode, createElementBlock, normalizeStyle, provide, inject, toValue, watchEffect, mergeDefaults, markRaw, h, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { defu } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/defu/dist/defu.mjs';
import { isEqual } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/index.mjs';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import { reactivePick, createReusableTemplate, useVModel, createEventHook, unrefElement, useParentElement } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';
import { refAutoReset, isClient } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/shared/dist/index.js';
import { useVirtualizer } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@tanstack/vue-virtual/dist/esm/index.js';
import { offset, flip, shift, limitShift, size, arrow, hide, useFloating, autoUpdate } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@floating-ui/vue/dist/floating-ui.vue.mjs';

function findValuesBetween(array, start, end) {
  const startIndex = array.findIndex((i) => isEqual(i, start));
  const endIndex = array.findIndex((i) => isEqual(i, end));
  if (startIndex === -1 || endIndex === -1) return [];
  const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);
  return array.slice(minIndex, maxIndex + 1);
}
function useComposing(onEnd) {
  const isComposing = ref(false);
  function handleCompositionStart() {
    isComposing.value = true;
  }
  function handleCompositionEnd(event) {
    nextTick(() => {
      isComposing.value = false;
      onEnd == null ? void 0 : onEnd(event);
    });
  }
  return {
    isComposing,
    handleCompositionStart,
    handleCompositionEnd
  };
}
function useDirection(dir) {
  const context = injectConfigProviderContext({ dir: ref("ltr") });
  return computed(() => {
    var _a;
    return (dir == null ? void 0 : dir.value) || ((_a = context.dir) == null ? void 0 : _a.value) || "ltr";
  });
}
function useFilter$1(options) {
  const computedOptions = computed(() => unref(options));
  const collator = computed(() => new Intl.Collator("en", {
    usage: "search",
    ...computedOptions.value
  }));
  const startsWith = (string, substring) => {
    if (substring.length === 0) return true;
    string = string.normalize("NFC");
    substring = substring.normalize("NFC");
    return collator.value.compare(string.slice(0, substring.length), substring) === 0;
  };
  const endsWith = (string, substring) => {
    if (substring.length === 0) return true;
    string = string.normalize("NFC");
    substring = substring.normalize("NFC");
    return collator.value.compare(string.slice(-substring.length), substring) === 0;
  };
  const contains = (string, substring) => {
    if (substring.length === 0) return true;
    string = string.normalize("NFC");
    substring = substring.normalize("NFC");
    let scan = 0;
    const sliceLen = substring.length;
    for (; scan + sliceLen <= string.length; scan++) {
      const slice = string.slice(scan, scan + sliceLen);
      if (collator.value.compare(substring, slice) === 0) return true;
    }
    return false;
  };
  return {
    startsWith,
    endsWith,
    contains
  };
}
var count = 0;
function useFocusGuards() {
  watchEffect((cleanupFn) => {
    var _a, _b;
    if (!isClient) return;
    const edgeGuards = (void 0).querySelectorAll("[data-reka-focus-guard]");
    (void 0).body.insertAdjacentElement("afterbegin", (_a = edgeGuards[0]) != null ? _a : createFocusGuard());
    (void 0).body.insertAdjacentElement("beforeend", (_b = edgeGuards[1]) != null ? _b : createFocusGuard());
    count++;
    cleanupFn(() => {
      if (count === 1) (void 0).querySelectorAll("[data-reka-focus-guard]").forEach((node) => node.remove());
      count--;
    });
  });
}
function createFocusGuard() {
  const element = (void 0).createElement("span");
  element.setAttribute("data-reka-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}
function useFormControl(el) {
  return computed(() => {
    var _a;
    return toValue(el) ? Boolean((_a = unrefElement(el)) == null ? void 0 : _a.closest("form")) : true;
  });
}
function useForwardPropsEmits(props, emit) {
  const parsedProps = useForwardProps$1(props);
  const emitsAsProps = emit ? useEmitAsProps(emit) : {};
  return computed(() => ({
    ...parsedProps.value,
    ...emitsAsProps
  }));
}
function useKbd() {
  return {
    ALT: "Alt",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ARROW_UP: "ArrowUp",
    BACKSPACE: "Backspace",
    CAPS_LOCK: "CapsLock",
    CONTROL: "Control",
    DELETE: "Delete",
    END: "End",
    ENTER: "Enter",
    ESCAPE: "Escape",
    F1: "F1",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    HOME: "Home",
    META: "Meta",
    PAGE_DOWN: "PageDown",
    PAGE_UP: "PageUp",
    SHIFT: "Shift",
    SPACE: " ",
    TAB: "Tab",
    CTRL: "Control",
    ASTERISK: "*",
    SPACE_CODE: "Space"
  };
}
function useSize(element) {
  const size2 = ref();
  return {
    width: computed(() => {
      var _a, _b;
      return (_b = (_a = size2.value) == null ? void 0 : _a.width) != null ? _b : 0;
    }),
    height: computed(() => {
      var _a, _b;
      return (_b = (_a = size2.value) == null ? void 0 : _a.height) != null ? _b : 0;
    })
  };
}
function useTypeahead(callback) {
  const search = refAutoReset("", 1e3);
  const handleTypeaheadSearch = (key, items) => {
    search.value = search.value + key;
    {
      const currentItem = getActiveElement();
      const itemsWithTextValue = items.map((item) => {
        var _a, _b, _c, _d;
        return {
          ...item,
          textValue: (_d = (_c = (_a = item.value) == null ? void 0 : _a.textValue) != null ? _c : (_b = item.ref.textContent) == null ? void 0 : _b.trim()) != null ? _d : ""
        };
      });
      const currentMatch = itemsWithTextValue.find((item) => item.ref === currentItem);
      const nextMatch = getNextMatch(itemsWithTextValue.map((item) => item.textValue), search.value, currentMatch == null ? void 0 : currentMatch.textValue);
      const newItem = itemsWithTextValue.find((item) => item.textValue === nextMatch);
      if (newItem) newItem.ref.focus();
      return newItem == null ? void 0 : newItem.ref;
    }
  };
  const resetTypeahead = () => {
    search.value = "";
  };
  return {
    search,
    handleTypeaheadSearch,
    resetTypeahead
  };
}
function wrapArray$1(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
  const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray$1(values, Math.max(currentMatchIndex, 0));
  if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function usePrimitiveElement() {
  const primitiveElement = ref();
  return {
    primitiveElement,
    currentElement: computed(() => {
      var _a, _b;
      return ["#text", "#comment"].includes((_a = primitiveElement.value) == null ? void 0 : _a.$el.nodeName) ? (_b = primitiveElement.value) == null ? void 0 : _b.$el.nextElementSibling : unrefElement(primitiveElement);
    })
  };
}
var ITEM_DATA_ATTR = "data-reka-collection-item";
function useCollection(options = {}) {
  const { key = "", isProvider = false } = options;
  const injectionKey = `${key}CollectionProvider`;
  let context;
  if (isProvider) {
    const itemMap = ref(/* @__PURE__ */ new Map());
    context = {
      collectionRef: ref(),
      itemMap
    };
    provide(injectionKey, context);
  } else context = inject(injectionKey);
  const getItems = (includeDisabledItem = false) => {
    const collectionNode = context.collectionRef.value;
    if (!collectionNode) return [];
    const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
    const orderMap = new Map(orderedNodes.map((node, index) => [node, index]));
    const orderedItems = Array.from(context.itemMap.value.values()).sort((a, b) => {
      var _a, _b;
      return ((_a = orderMap.get(a.ref)) != null ? _a : -1) - ((_b = orderMap.get(b.ref)) != null ? _b : -1);
    });
    if (includeDisabledItem) return orderedItems;
    else return orderedItems.filter((i) => i.ref.dataset.disabled !== "");
  };
  const CollectionSlot = /* @__PURE__ */ defineComponent({
    name: "CollectionSlot",
    inheritAttrs: false,
    setup(_, { slots, attrs }) {
      const { primitiveElement, currentElement } = usePrimitiveElement();
      watch(currentElement, () => {
        context.collectionRef.value = currentElement.value;
      });
      return () => h(Slot, {
        ref: primitiveElement,
        ...attrs
      }, slots);
    }
  });
  const CollectionItem = /* @__PURE__ */ defineComponent({
    name: "CollectionItem",
    inheritAttrs: false,
    props: { value: { validator: () => true } },
    setup(props, { slots, attrs }) {
      const { primitiveElement, currentElement } = usePrimitiveElement();
      watchEffect((cleanupFn) => {
        if (currentElement.value) {
          const key$1 = markRaw(currentElement.value);
          context.itemMap.value.set(key$1, {
            ref: currentElement.value,
            value: props.value
          });
          cleanupFn(() => context.itemMap.value.delete(key$1));
        }
      });
      return () => h(Slot, {
        ...attrs,
        [ITEM_DATA_ATTR]: "",
        ref: primitiveElement
      }, slots);
    }
  });
  return {
    getItems,
    reactiveItems: computed(() => Array.from(context.itemMap.value.values())),
    itemMapSize: computed(() => context.itemMap.value.size),
    CollectionSlot,
    CollectionItem
  };
}
var VisuallyHiddenInputBubble_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInputBubble",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    required: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    feature: {
      type: String,
      required: false,
      default: "fully-hidden"
    }
  },
  setup(__props) {
    const props = __props;
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const valueState = computed(() => {
      var _a;
      return (_a = props.checked) != null ? _a : props.value;
    });
    watch(valueState, (cur, prev) => {
      if (!currentElement.value) return;
      const input = currentElement.value;
      const inputProto = (void 0).HTMLInputElement.prototype;
      const setValue = Object.getOwnPropertyDescriptor(inputProto, "value").set;
      if (setValue && cur !== prev) {
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        setValue.call(input, cur);
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(VisuallyHidden_default, mergeProps({
        ref_key: "primitiveElement",
        ref: primitiveElement
      }, {
        ...props,
        ..._ctx.$attrs
      }, { as: "input" }), null, 16);
    };
  }
});
var VisuallyHiddenInput_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "VisuallyHiddenInput",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      required: true
    },
    checked: {
      type: Boolean,
      required: false,
      default: void 0
    },
    required: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    feature: {
      type: String,
      required: false,
      default: "fully-hidden"
    }
  },
  setup(__props) {
    const props = __props;
    const isFormArrayEmptyAndRequired = computed(() => typeof props.value === "object" && Array.isArray(props.value) && props.value.length === 0 && props.required);
    const parsedValue = computed(() => {
      if (typeof props.value === "string" || typeof props.value === "number" || typeof props.value === "boolean" || props.value === null || props.value === void 0) return [{
        name: props.name,
        value: props.value
      }];
      else if (typeof props.value === "object" && Array.isArray(props.value)) return props.value.flatMap((obj, index) => {
        if (typeof obj === "object") return Object.entries(obj).map(([key, value]) => ({
          name: `${props.name}[${index}][${key}]`,
          value
        }));
        else return {
          name: `${props.name}[${index}]`,
          value: obj
        };
      });
      else if (props.value !== null && typeof props.value === "object" && !Array.isArray(props.value)) return Object.entries(props.value).map(([key, value]) => ({
        name: `${props.name}[${key}]`,
        value
      }));
      return [];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [createCommentVNode(" We render single input if it's required "), isFormArrayEmptyAndRequired.value ? (openBlock(), createBlock(VisuallyHiddenInputBubble_default, mergeProps({ key: _ctx.name }, {
        ...props,
        ..._ctx.$attrs
      }, {
        name: _ctx.name,
        value: _ctx.value
      }), null, 16, ["name", "value"])) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(parsedValue.value, (parsed) => {
        return openBlock(), createBlock(VisuallyHiddenInputBubble_default, mergeProps({ key: parsed.name }, { ref_for: true }, {
          ...props,
          ..._ctx.$attrs
        }, {
          name: parsed.name,
          value: parsed.value
        }), null, 16, ["name", "value"]);
      }), 128))], 2112);
    };
  }
});
function queryCheckedElement(parentEl) {
  return parentEl == null ? void 0 : parentEl.querySelector("[data-state=checked]");
}
function valueComparator(value, currentValue, comparator) {
  if (value === void 0) return false;
  else if (Array.isArray(value)) return value.some((val) => compare(val, currentValue, comparator));
  else return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
  if (value === void 0 || currentValue === void 0) return false;
  if (typeof value === "string") return value === currentValue;
  if (typeof comparator === "function") return comparator(value, currentValue);
  if (typeof comparator === "string") return (value == null ? void 0 : value[comparator]) === (currentValue == null ? void 0 : currentValue[comparator]);
  return isEqual(value, currentValue);
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
  bubbles: false,
  cancelable: true
};
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = getActiveElement();
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (getActiveElement() !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var [injectListboxRootContext, provideListboxRootContext] = /* @__PURE__ */ createContext("ListboxRoot");
var ListboxRoot_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxRoot",
  props: {
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    orientation: {
      type: String,
      required: false,
      default: "vertical"
    },
    dir: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    selectionBehavior: {
      type: String,
      required: false,
      default: "toggle"
    },
    highlightOnHover: {
      type: Boolean,
      required: false
    },
    by: {
      type: [String, Function],
      required: false
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
      required: false
    }
  },
  emits: [
    "update:modelValue",
    "highlight",
    "entryFocus",
    "leave"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const props = __props;
    const emits = __emit;
    const { multiple, highlightOnHover, orientation, disabled, selectionBehavior, dir: propDir } = toRefs(props);
    const { getItems } = useCollection({ isProvider: true });
    const { handleTypeaheadSearch } = useTypeahead();
    const { primitiveElement, currentElement } = usePrimitiveElement();
    const kbd = useKbd();
    const dir = useDirection(propDir);
    const isFormControl = useFormControl(currentElement);
    const firstValue = ref();
    const isUserAction = ref(false);
    const focusable = ref(true);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: (_a = props.defaultValue) != null ? _a : multiple.value ? [] : void 0,
      passive: props.modelValue === void 0,
      deep: true
    });
    function onValueChange(val) {
      isUserAction.value = true;
      if (props.multiple) {
        const modelArray = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
        const index = modelArray.findIndex((i) => compare(i, val, props.by));
        if (props.selectionBehavior === "toggle") {
          index === -1 ? modelArray.push(val) : modelArray.splice(index, 1);
          modelValue.value = modelArray;
        } else {
          modelValue.value = [val];
          firstValue.value = val;
        }
      } else if (props.selectionBehavior === "toggle") if (compare(modelValue.value, val, props.by)) modelValue.value = void 0;
      else modelValue.value = val;
      else modelValue.value = val;
      setTimeout(() => {
        isUserAction.value = false;
      }, 1);
    }
    const highlightedElement = ref(null);
    const previousElement = ref(null);
    const isVirtual = ref(false);
    const isComposing = ref(false);
    const virtualFocusHook = createEventHook();
    const virtualKeydownHook = createEventHook();
    const virtualHighlightHook = createEventHook();
    function getCollectionItem() {
      return getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
    }
    function changeHighlight(el, scrollIntoView = true, focus) {
      if (!el) return;
      highlightedElement.value = el;
      if (focus != null ? focus : focusable.value) highlightedElement.value.focus();
      if (scrollIntoView) highlightedElement.value.scrollIntoView({ block: "nearest" });
      const highlightedItem = getItems().find((i) => i.ref === el);
      emits("highlight", highlightedItem);
    }
    function highlightItem(value) {
      if (isVirtual.value) virtualHighlightHook.trigger(value);
      else {
        const item = getItems().find((i) => compare(i.value, value, props.by));
        if (item) {
          highlightedElement.value = item.ref;
          changeHighlight(item.ref);
        }
      }
    }
    function onKeydownEnter(event) {
      if (highlightedElement.value && highlightedElement.value.isConnected) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        event.preventDefault();
        event.stopPropagation();
        if (!isComposing.value) highlightedElement.value.click();
      }
    }
    function onKeydownTypeAhead(event) {
      if (!focusable.value) return;
      isUserAction.value = true;
      if (isVirtual.value) virtualKeydownHook.trigger(event);
      else {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
        if (isMetaKey && event.key === "a" && multiple.value) {
          const collection = getItems();
          const values = collection.map((i) => i.value);
          modelValue.value = [...values];
          event.preventDefault();
          const lastItem = collection.at(-1);
          if (lastItem) changeHighlight(lastItem.ref);
        } else if (!isMetaKey) {
          const el = handleTypeaheadSearch(event.key, getItems());
          if (el) changeHighlight(el);
        }
      }
      setTimeout(() => {
        isUserAction.value = false;
      }, 1);
    }
    function onCompositionStart() {
      isComposing.value = true;
    }
    function onCompositionEnd() {
      nextTick(() => {
        isComposing.value = false;
      });
    }
    function highlightFirstItem() {
      nextTick(() => {
        onKeydownNavigation(new KeyboardEvent("keydown", { key: "PageUp" }));
      });
    }
    function onLeave(event) {
      const el = highlightedElement.value;
      if (el == null ? void 0 : el.isConnected) previousElement.value = el;
      highlightedElement.value = null;
      emits("leave", event);
    }
    function onEnter(event) {
      var _a2, _b;
      const entryFocusEvent = new CustomEvent("listbox.entryFocus", {
        bubbles: false,
        cancelable: true
      });
      (_a2 = event.currentTarget) == null ? void 0 : _a2.dispatchEvent(entryFocusEvent);
      emits("entryFocus", entryFocusEvent);
      if (entryFocusEvent.defaultPrevented) return;
      if (previousElement.value) changeHighlight(previousElement.value);
      else {
        const el = (_b = getCollectionItem()) == null ? void 0 : _b[0];
        changeHighlight(el);
      }
    }
    function onKeydownNavigation(event) {
      const intent = getFocusIntent(event, orientation.value, dir.value);
      if (!intent) return;
      let collection = getCollectionItem();
      if (highlightedElement.value) {
        if (intent === "last") collection.reverse();
        else if (intent === "prev" || intent === "next") {
          if (intent === "prev") collection.reverse();
          const currentIndex = collection.indexOf(highlightedElement.value);
          collection = collection.slice(currentIndex + 1);
        }
        handleMultipleReplace(event, collection[0]);
      }
      if (collection.length) {
        const index = !highlightedElement.value && intent === "prev" ? collection.length - 1 : 0;
        changeHighlight(collection[index]);
      }
      if (isVirtual.value) return virtualKeydownHook.trigger(event);
    }
    function handleMultipleReplace(event, targetEl) {
      var _a2, _b, _c;
      if (isVirtual.value || props.selectionBehavior !== "replace" || !multiple.value || !Array.isArray(modelValue.value)) return;
      if ((event.altKey || event.ctrlKey || event.metaKey) && !event.shiftKey) return;
      if (event.shiftKey) {
        const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
        let lastValue = (_a2 = collection.find((i) => i.ref === targetEl)) == null ? void 0 : _a2.value;
        if (event.key === kbd.END) lastValue = (_b = collection.at(-1)) == null ? void 0 : _b.value;
        else if (event.key === kbd.HOME) lastValue = (_c = collection[0]) == null ? void 0 : _c.value;
        if (!lastValue || !firstValue.value) return;
        const values = findValuesBetween(collection.map((i) => i.value), firstValue.value, lastValue);
        modelValue.value = values;
      }
    }
    async function highlightSelected(event, scroll = true) {
      if (!isClient) return;
      await nextTick();
      if (isVirtual.value) virtualFocusHook.trigger({
        event,
        scroll
      });
      else {
        const collection = getCollectionItem();
        const item = collection.find((i) => i.dataset.state === "checked");
        const focus = scroll ? void 0 : false;
        if (item) changeHighlight(item, scroll, focus);
        else if (collection.length) changeHighlight(collection[0], scroll, focus);
      }
    }
    let hasHighlightedOnMount = false;
    watch(modelValue, () => {
      if (!isUserAction.value) {
        const scroll = hasHighlightedOnMount;
        hasHighlightedOnMount = true;
        nextTick(() => {
          highlightSelected(void 0, scroll);
        });
      }
    }, {
      immediate: true,
      deep: true
    });
    __expose({
      highlightedElement,
      highlightItem,
      highlightFirstItem,
      highlightSelected,
      getItems
    });
    provideListboxRootContext({
      modelValue,
      onValueChange,
      multiple,
      orientation,
      dir,
      disabled,
      highlightOnHover,
      highlightedElement,
      isVirtual,
      virtualFocusHook,
      virtualKeydownHook,
      virtualHighlightHook,
      by: props.by,
      firstValue,
      selectionBehavior,
      focusable,
      onLeave,
      onEnter,
      changeHighlight,
      onKeydownEnter,
      onKeydownNavigation,
      onKeydownTypeAhead,
      onCompositionStart,
      onCompositionEnd,
      highlightFirstItem
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        dir: unref(dir),
        "data-disabled": unref(disabled) ? "" : void 0,
        onPointerleave: onLeave,
        onFocusout: _cache[0] || (_cache[0] = async (event) => {
          const target = event.relatedTarget || event.target;
          await nextTick();
          if (highlightedElement.value && unref(currentElement) && !unref(currentElement).contains(target)) onLeave(event);
        })
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) }), unref(isFormControl) && _ctx.name ? (openBlock(), createBlock(unref(VisuallyHiddenInput_default), {
          key: 0,
          name: _ctx.name,
          value: unref(modelValue),
          disabled: unref(disabled),
          required: _ctx.required
        }, null, 8, [
          "name",
          "value",
          "disabled",
          "required"
        ])) : createCommentVNode("v-if", true)]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "dir",
        "data-disabled"
      ]);
    };
  }
});
var ListboxContent_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxContent",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const { CollectionSlot } = useCollection();
    const rootContext = injectListboxRootContext();
    const isClickFocus = refAutoReset(false, 10);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionSlot), null, {
        default: withCtx(() => [createVNode(unref(Primitive), {
          role: "listbox",
          as: _ctx.as,
          "as-child": _ctx.asChild,
          tabindex: unref(rootContext).focusable.value ? unref(rootContext).highlightedElement.value ? "-1" : "0" : "-1",
          "aria-orientation": unref(rootContext).orientation.value,
          "aria-multiselectable": !!unref(rootContext).multiple.value,
          "data-orientation": unref(rootContext).orientation.value,
          onMousedown: _cache[0] || (_cache[0] = withModifiers(($event) => isClickFocus.value = true, ["left"])),
          onFocus: _cache[1] || (_cache[1] = (ev) => {
            if (unref(isClickFocus)) return;
            unref(rootContext).onEnter(ev);
          }),
          onKeydown: [
            _cache[2] || (_cache[2] = withKeys((event) => {
              if (unref(rootContext).orientation.value === "vertical" && (event.key === "ArrowLeft" || event.key === "ArrowRight") || unref(rootContext).orientation.value === "horizontal" && (event.key === "ArrowUp" || event.key === "ArrowDown")) return;
              event.preventDefault();
              unref(rootContext).focusable.value && unref(rootContext).onKeydownNavigation(event);
            }, [
              "down",
              "up",
              "left",
              "right",
              "home",
              "end"
            ])),
            withKeys(unref(rootContext).onKeydownEnter, ["enter"]),
            unref(rootContext).onKeydownTypeAhead
          ]
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 8, [
          "as",
          "as-child",
          "tabindex",
          "aria-orientation",
          "aria-multiselectable",
          "data-orientation",
          "onKeydown"
        ])]),
        _: 3
      });
    };
  }
});
var ListboxFilter_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxFilter",
  props: {
    modelValue: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
    },
    disabled: {
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
      default: "input"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const modelValue = useVModel(props, "modelValue", __emit, {
      defaultValue: "",
      passive: props.modelValue === void 0
    });
    const rootContext = injectListboxRootContext();
    const { primitiveElement} = usePrimitiveElement();
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false);
    const activedescendant = ref();
    watchSyncEffect(() => {
      var _a;
      return activedescendant.value = (_a = rootContext.highlightedElement.value) == null ? void 0 : _a.id;
    });
    const { isComposing, handleCompositionStart, handleCompositionEnd } = useComposing((event) => {
      modelValue.value = event.target.value;
      rootContext.onCompositionEnd();
      rootContext.highlightFirstItem();
    });
    function onCompositionStart() {
      rootContext.onCompositionStart();
      handleCompositionStart();
    }
    function handleInput(event) {
      if (isComposing.value) return;
      modelValue.value = event.target.value;
      rootContext.highlightFirstItem();
    }
    function handleKeydownNavigation(event) {
      if (isComposing.value) return;
      event.preventDefault();
      rootContext.onKeydownNavigation(event);
    }
    function handleKeydownEnter(event) {
      if (isComposing.value) return;
      rootContext.onKeydownEnter(event);
    }
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createBlock(unref(Primitive), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        as: _ctx.as,
        "as-child": _ctx.asChild,
        value: unref(modelValue),
        disabled: disabled.value ? "" : void 0,
        "data-disabled": disabled.value ? "" : void 0,
        "aria-disabled": (_a = disabled.value) != null ? _a : void 0,
        "aria-activedescendant": activedescendant.value,
        type: "text",
        onKeydown: [withKeys(handleKeydownNavigation, [
          "down",
          "up",
          "home",
          "end"
        ]), withKeys(handleKeydownEnter, ["enter"])],
        onInput: handleInput,
        onCompositionstart: onCompositionStart,
        onCompositionend: unref(handleCompositionEnd)
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "value",
        "disabled",
        "data-disabled",
        "aria-disabled",
        "aria-activedescendant",
        "onCompositionend"
      ]);
    };
  }
});
var [injectListboxGroupContext, provideListboxGroupContext] = /* @__PURE__ */ createContext("ListboxGroup");
var ListboxGroup_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxGroup",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const id = useId$1(void 0, "reka-listbox-group");
    provideListboxGroupContext({ id });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ role: "group" }, props, { "aria-labelledby": unref(id) }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["aria-labelledby"]);
    };
  }
});
var LISTBOX_SELECT = "listbox.select";
var [injectListboxItemContext, provideListboxItemContext] = /* @__PURE__ */ createContext("ListboxItem");
var ListboxItem_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxItem",
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
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
      default: "div"
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const id = useId$1(void 0, "reka-listbox-item");
    const { CollectionItem } = useCollection();
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectListboxRootContext();
    const isHighlighted = computed(() => currentElement.value != null && currentElement.value === rootContext.highlightedElement.value);
    const isSelected = computed(() => valueComparator(rootContext.modelValue.value, props.value, rootContext.by));
    const disabled = computed(() => rootContext.disabled.value || props.disabled);
    async function handleSelect(ev) {
      emits("select", ev);
      if (ev == null ? void 0 : ev.defaultPrevented) return;
      if (!disabled.value && ev) {
        rootContext.onValueChange(props.value);
        rootContext.changeHighlight(currentElement.value);
      }
    }
    function handleSelectCustomEvent(ev) {
      const eventDetail = {
        originalEvent: ev,
        value: props.value
      };
      handleAndDispatchCustomEvent(LISTBOX_SELECT, handleSelect, eventDetail);
    }
    provideListboxItemContext({ isSelected });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(CollectionItem), { value: _ctx.value }, {
        default: withCtx(() => [withMemo([
          isHighlighted.value,
          isSelected.value,
          disabled.value,
          unref(rootContext).focusable.value
        ], () => createVNode(unref(Primitive), mergeProps({ id: unref(id) }, _ctx.$attrs, {
          ref: unref(forwardRef),
          role: "option",
          tabindex: unref(rootContext).focusable.value ? isHighlighted.value ? "0" : "-1" : -1,
          "aria-selected": isSelected.value,
          as: _ctx.as,
          "as-child": _ctx.asChild,
          disabled: disabled.value ? "" : void 0,
          "data-disabled": disabled.value ? "" : void 0,
          "data-highlighted": isHighlighted.value ? "" : void 0,
          "data-state": isSelected.value ? "checked" : "unchecked",
          onClick: handleSelectCustomEvent,
          onKeydown: withKeys(withModifiers(handleSelectCustomEvent, ["prevent"]), ["space"]),
          onPointermove: _cache[0] || (_cache[0] = () => {
            if (unref(rootContext).highlightedElement.value === unref(currentElement)) return;
            if (unref(rootContext).highlightOnHover.value) unref(rootContext).changeHighlight(unref(currentElement), false, false);
          })
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "tabindex",
          "aria-selected",
          "as",
          "as-child",
          "disabled",
          "data-disabled",
          "data-highlighted",
          "data-state",
          "onKeydown"
        ]), _cache, 1)]),
        _: 3
      }, 8, ["value"]);
    };
  }
});
var ListboxItemIndicator_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxItemIndicator",
  props: {
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
    useForwardExpose();
    const itemContext = injectListboxItemContext();
    return (_ctx, _cache) => {
      return unref(itemContext).isSelected.value ? (openBlock(), createBlock(unref(Primitive), mergeProps({
        key: 0,
        "aria-hidden": "true"
      }, props), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var ListboxVirtualizer_default = /* @__PURE__ */ defineComponent({
  __name: "ListboxVirtualizer",
  props: {
    options: {
      type: Array,
      required: true
    },
    overscan: {
      type: Number,
      required: false
    },
    estimateSize: {
      type: [Number, Function],
      required: false
    },
    textContent: {
      type: Function,
      required: false
    }
  },
  setup(__props) {
    var _a;
    const props = __props;
    const slots = useSlots();
    const rootContext = injectListboxRootContext();
    const parentEl = useParentElement();
    const { getItems } = useCollection();
    rootContext.isVirtual.value = true;
    const padding = computed(() => {
      const el = parentEl.value;
      if (!el) return {
        start: 0,
        end: 0
      };
      else {
        const styles = (void 0).getComputedStyle(el);
        return {
          start: Number.parseFloat(styles.paddingBlockStart || styles.paddingTop),
          end: Number.parseFloat(styles.paddingBlockEnd || styles.paddingBottom)
        };
      }
    });
    const virtualizer = useVirtualizer({
      get scrollPaddingStart() {
        return padding.value.start;
      },
      get scrollPaddingEnd() {
        return padding.value.end;
      },
      get count() {
        return props.options.length;
      },
      get horizontal() {
        return rootContext.orientation.value === "horizontal";
      },
      estimateSize(index) {
        var _a2;
        if (typeof props.estimateSize === "function") return props.estimateSize(index);
        return (_a2 = props.estimateSize) != null ? _a2 : 28;
      },
      getScrollElement() {
        return parentEl.value;
      },
      overscan: (_a = props.overscan) != null ? _a : 12
    });
    const virtualizedItems = computed(() => virtualizer.value.getVirtualItems().map((item) => {
      const defaultNode = slots.default({
        option: props.options[item.index],
        virtualizer: virtualizer.value,
        virtualItem: item
      })[0];
      const targetNode = defaultNode.type === Fragment && Array.isArray(defaultNode.children) ? defaultNode.children.find((child) => typeof child.type !== "symbol") : defaultNode;
      return {
        item,
        is: cloneVNode(targetNode, {
          "key": `${item.key}`,
          "data-index": item.index,
          "aria-setsize": props.options.length,
          "aria-posinset": item.index + 1,
          "style": {
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translateY(${item.start}px)`,
            overflowAnchor: "none"
          }
        })
      };
    }));
    rootContext.virtualFocusHook.on(({ event, scroll }) => {
      const index = props.options.findIndex((option) => {
        if (Array.isArray(rootContext.modelValue.value)) return compare(option, rootContext.modelValue.value[0], rootContext.by);
        else return compare(option, rootContext.modelValue.value, rootContext.by);
      });
      if (index !== -1) {
        event == null ? void 0 : event.preventDefault();
        virtualizer.value.scrollToIndex(index, { align: "start" });
        requestAnimationFrame(() => {
          const item = queryCheckedElement(parentEl.value);
          if (item) {
            rootContext.changeHighlight(item, scroll, scroll ? void 0 : false);
            if (event) item == null ? void 0 : item.focus();
          }
        });
      } else if (scroll) rootContext.highlightFirstItem();
      else requestAnimationFrame(() => {
        var _a2;
        const item = (_a2 = getItems().find((i) => i.ref.dataset.disabled !== "")) == null ? void 0 : _a2.ref;
        if (item) rootContext.changeHighlight(item, false, false);
      });
    });
    rootContext.virtualHighlightHook.on((value) => {
      const index = props.options.findIndex((option) => {
        return compare(option, value, rootContext.by);
      });
      virtualizer.value.scrollToIndex(index, { align: "start" });
      requestAnimationFrame(() => {
        const item = queryCheckedElement(parentEl.value);
        if (item) rootContext.changeHighlight(item);
      });
    });
    const search = refAutoReset("", 1e3);
    const optionsWithMetadata = computed(() => {
      const parseTextContent = (option) => {
        if (props.textContent) return props.textContent(option);
        else return option == null ? void 0 : option.toString().toLowerCase();
      };
      return props.options.map((option, index) => ({
        index,
        textContent: parseTextContent(option)
      }));
    });
    function handleMultipleReplace(event, intent) {
      var _a2, _b, _c;
      if (!((_a2 = rootContext.firstValue) == null ? void 0 : _a2.value) || !rootContext.multiple.value || !Array.isArray(rootContext.modelValue.value)) return;
      const lastValue = (_b = getItems().filter((i) => i.ref.dataset.disabled !== "").find((i) => i.ref === rootContext.highlightedElement.value)) == null ? void 0 : _b.value;
      if (!lastValue) return;
      let value = null;
      switch (intent) {
        case "prev":
        case "next":
          value = findValuesBetween(props.options, rootContext.firstValue.value, lastValue);
          break;
        case "first":
          value = findValuesBetween(props.options, rootContext.firstValue.value, (_c = props.options) == null ? void 0 : _c[0]);
          break;
        case "last":
          value = findValuesBetween(props.options, rootContext.firstValue.value, props.options.at(-1));
      }
      rootContext.modelValue.value = value;
    }
    rootContext.virtualKeydownHook.on((event) => {
      var _a2;
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
      if (event.key === "Tab" && !isMetaKey) return;
      let intent = MAP_KEY_TO_FOCUS_INTENT[event.key];
      if (isMetaKey && event.key === "a" && rootContext.multiple.value) {
        event.preventDefault();
        rootContext.modelValue.value = [...props.options];
        intent = "last";
      } else if (event.shiftKey && intent) handleMultipleReplace(event, intent);
      if (["first", "last"].includes(intent)) {
        event.preventDefault();
        const index = intent === "first" ? 0 : props.options.length - 1;
        virtualizer.value.scrollToIndex(index);
        requestAnimationFrame(() => {
          const items = getItems();
          const item = intent === "first" ? items[0] : items.at(-1);
          if (item) rootContext.changeHighlight(item.ref);
        });
      } else if (!intent && !isMetaKey) {
        search.value += event.key;
        const currentIndex = Number((_a2 = getActiveElement()) == null ? void 0 : _a2.getAttribute("data-index"));
        const currentMatch = optionsWithMetadata.value[currentIndex].textContent;
        const next = getNextMatch(optionsWithMetadata.value.map((i) => {
          var _a3;
          return (_a3 = i.textContent) != null ? _a3 : "";
        }), search.value, currentMatch);
        const nextMatch = optionsWithMetadata.value.find((option) => option.textContent === next);
        if (nextMatch) {
          virtualizer.value.scrollToIndex(nextMatch.index, { align: "start" });
          requestAnimationFrame(() => {
            const item = parentEl.value.querySelector(`[data-index="${nextMatch.index}"]`);
            if (item instanceof HTMLElement) rootContext.changeHighlight(item);
          });
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "data-reka-virtualizer": "",
        style: normalizeStyle({
          position: "relative",
          width: "100%",
          height: `${unref(virtualizer).getTotalSize()}px`
        })
      }, [(openBlock(true), createElementBlock(Fragment, null, renderList(virtualizedItems.value, ({ is, item }) => {
        return openBlock(), createBlock(resolveDynamicComponent(is), { key: item.index });
      }), 128))], 4);
    };
  }
});
var [injectPopperRootContext, providePopperRootContext] = /* @__PURE__ */ createContext("PopperRoot");
var PopperRoot_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "PopperRoot",
  setup(__props) {
    const anchor = ref();
    providePopperRootContext({
      anchor,
      onAnchorChange: (element) => anchor.value = element
    });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
});
var PopperAnchor_default = /* @__PURE__ */ defineComponent({
  __name: "PopperAnchor",
  props: {
    reference: {
      type: null,
      required: false
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
  setup(__props) {
    const props = __props;
    const { forwardRef, currentElement } = useForwardExpose();
    const rootContext = injectPopperRootContext();
    watchPostEffect(() => {
      var _a;
      rootContext.onAnchorChange((_a = props.reference) != null ? _a : currentElement.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        ref: unref(forwardRef),
        as: _ctx.as,
        "as-child": _ctx.asChild
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, ["as", "as-child"]);
    };
  }
});
var _hoisted_1$1 = {
  key: 0,
  d: "M0 0L6 6L12 0"
};
var _hoisted_2 = {
  key: 1,
  d: "M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0"
};
var Arrow_default = /* @__PURE__ */ defineComponent({
  __name: "Arrow",
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    height: {
      type: Number,
      required: false,
      default: 5
    },
    rounded: {
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
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        width: _ctx.width,
        height: _ctx.height,
        viewBox: _ctx.asChild ? void 0 : "0 0 12 6",
        preserveAspectRatio: _ctx.asChild ? void 0 : "none"
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [!_ctx.rounded ? (openBlock(), createElementBlock("path", _hoisted_1$1)) : (openBlock(), createElementBlock("path", _hoisted_2))])]),
        _: 3
      }, 16, [
        "width",
        "height",
        "viewBox",
        "preserveAspectRatio"
      ]);
    };
  }
});
function isNotNull(value) {
  return value !== null;
}
function transformOrigin(options) {
  return {
    name: "transformOrigin",
    options,
    fn(data) {
      var _a, _b, _c, _d, _e;
      const { placement, rects, middlewareData } = data;
      const isArrowHidden = ((_a = middlewareData.arrow) == null ? void 0 : _a.centerOffset) !== 0;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlignX = {
        start: options.dir === "rtl" ? "100%" : "0%",
        center: "50%",
        end: options.dir === "rtl" ? "0%" : "100%"
      }[placedAlign];
      const noArrowAlignY = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[placedAlign];
      const arrowXCenter = ((_c = (_b = middlewareData.arrow) == null ? void 0 : _b.x) != null ? _c : 0) + arrowWidth / 2;
      const arrowYCenter = ((_e = (_d = middlewareData.arrow) == null ? void 0 : _d.y) != null ? _e : 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
      }
      return { data: {
        x,
        y
      } };
    }
  };
}
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var _hoisted_1 = ["dir"];
var PopperContentPropsDefaultValue = {
  side: "bottom",
  sideOffset: 0,
  sideFlip: true,
  align: "center",
  alignOffset: 0,
  alignFlip: true,
  arrowPadding: 0,
  hideShiftedArrow: true,
  avoidCollisions: true,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: false,
  positionStrategy: "fixed",
  updatePositionStrategy: "optimized",
  prioritizePosition: false
};
var [injectPopperContentContext, providePopperContentContext] = /* @__PURE__ */ createContext("PopperContent");
var PopperContent_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "PopperContent",
  props: /* @__PURE__ */ mergeDefaults({
    memoDependencies: {
      type: Array,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  }, { ...PopperContentPropsDefaultValue }),
  emits: ["placed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectPopperRootContext();
    const { forwardRef, currentElement: contentElement } = useForwardExpose();
    const dir = useDirection(computed(() => props.dir));
    const floatingRef = ref();
    const arrow$1 = ref();
    const { width: arrowWidth, height: arrowHeight } = useSize();
    const desiredPlacement = computed(() => props.side + (props.align !== "center" ? `-${props.align}` : ""));
    const collisionPadding = computed(() => {
      return typeof props.collisionPadding === "number" ? props.collisionPadding : {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...props.collisionPadding
      };
    });
    const boundary = computed(() => {
      return Array.isArray(props.collisionBoundary) ? props.collisionBoundary : [props.collisionBoundary];
    });
    const detectOverflowOptions = computed(() => {
      return {
        padding: collisionPadding.value,
        boundary: boundary.value.filter(isNotNull),
        altBoundary: boundary.value.length > 0
      };
    });
    const flipOptions = computed(() => {
      return {
        mainAxis: props.sideFlip,
        crossAxis: props.alignFlip
      };
    });
    const computedMiddleware = computed(() => {
      return [
        offset({
          mainAxis: props.sideOffset + arrowHeight.value,
          alignmentAxis: props.alignOffset
        }),
        props.prioritizePosition && props.avoidCollisions && flip({
          ...detectOverflowOptions.value,
          ...flipOptions.value
        }),
        props.avoidCollisions && shift({
          mainAxis: true,
          crossAxis: !!props.prioritizePosition,
          limiter: props.sticky === "partial" ? limitShift() : void 0,
          ...detectOverflowOptions.value
        }),
        !props.prioritizePosition && props.avoidCollisions && flip({
          ...detectOverflowOptions.value,
          ...flipOptions.value
        }),
        size({
          ...detectOverflowOptions.value,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--reka-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--reka-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--reka-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--reka-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow$1.value && arrow({
          element: arrow$1.value,
          padding: props.arrowPadding
        }),
        transformOrigin({
          arrowWidth: arrowWidth.value,
          arrowHeight: arrowHeight.value,
          dir: dir.value
        }),
        props.hideWhenDetached && hide({
          strategy: "referenceHidden",
          ...detectOverflowOptions.value
        })
      ];
    });
    const reference = computed(() => {
      var _a;
      return (_a = props.reference) != null ? _a : rootContext.anchor.value;
    });
    const { floatingStyles, placement, isPositioned, middlewareData, update } = useFloating(reference, floatingRef, {
      strategy: props.positionStrategy,
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        return autoUpdate(...args, {
          layoutShift: !props.disableUpdateOnLayoutShift,
          animationFrame: props.updatePositionStrategy === "always"
        });
      },
      middleware: computedMiddleware
    });
    const placedSide = computed(() => getSideAndAlignFromPlacement(placement.value)[0]);
    const placedAlign = computed(() => getSideAndAlignFromPlacement(placement.value)[1]);
    watchPostEffect(() => {
      if (isPositioned.value) emits("placed");
    });
    const shouldHideArrow = computed(() => {
      var _a;
      const cannotCenterArrow = ((_a = middlewareData.value.arrow) == null ? void 0 : _a.centerOffset) !== 0;
      return props.hideShiftedArrow && cannotCenterArrow;
    });
    const contentZIndex = ref("");
    watchEffect(() => {
      if (contentElement.value) contentZIndex.value = (void 0).getComputedStyle(contentElement.value).zIndex;
    });
    providePopperContentContext({
      placedSide,
      onArrowChange: (element) => arrow$1.value = element,
      arrowX: computed(() => {
        var _a, _b;
        return (_b = (_a = middlewareData.value.arrow) == null ? void 0 : _a.x) != null ? _b : 0;
      }),
      arrowY: computed(() => {
        var _a, _b;
        return (_b = (_a = middlewareData.value.arrow) == null ? void 0 : _a.y) != null ? _b : 0;
      }),
      shouldHideArrow
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return openBlock(), createElementBlock("div", {
        ref_key: "floatingRef",
        ref: floatingRef,
        "data-reka-popper-content-wrapper": "",
        dir: unref(dir),
        style: normalizeStyle({
          ...unref(floatingStyles),
          transform: unref(isPositioned) ? unref(floatingStyles).transform : "translate(0, -200%)",
          minWidth: "max-content",
          zIndex: contentZIndex.value,
          ["--reka-popper-transform-origin"]: [(_a = unref(middlewareData).transformOrigin) == null ? void 0 : _a.x, (_b = unref(middlewareData).transformOrigin) == null ? void 0 : _b.y].join(" "),
          ...((_c = unref(middlewareData).hide) == null ? void 0 : _c.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        })
      }, [props.memoDependencies ? withMemo([
        props.asChild,
        props.as,
        placedSide.value,
        placedAlign.value,
        unref(isPositioned),
        ...Object.values(_ctx.$attrs),
        ...props.memoDependencies
      ], () => (openBlock(), createBlock(unref(Primitive), mergeProps({
        key: 0,
        ref: unref(forwardRef)
      }, _ctx.$attrs, {
        "as-child": props.asChild,
        as: props.as,
        "data-side": placedSide.value,
        "data-align": placedAlign.value,
        style: { animation: !unref(isPositioned) ? "none" : void 0 }
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "as-child",
        "as",
        "data-side",
        "data-align",
        "style"
      ])), _cache, 0) : (openBlock(), createBlock(unref(Primitive), mergeProps({
        key: 1,
        ref: unref(forwardRef)
      }, _ctx.$attrs, {
        "as-child": props.asChild,
        as: props.as,
        "data-side": placedSide.value,
        "data-align": placedAlign.value,
        dir: unref(dir),
        style: { animation: !unref(isPositioned) ? "none" : void 0 }
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "as-child",
        "as",
        "data-side",
        "data-align",
        "dir",
        "style"
      ]))], 12, _hoisted_1);
    };
  }
});
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "PopperArrow",
  props: {
    width: {
      type: Number,
      required: false
    },
    height: {
      type: Number,
      required: false
    },
    rounded: {
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
      default: "svg"
    }
  },
  setup(__props) {
    const { forwardRef } = useForwardExpose();
    const contentContext = injectPopperContentContext();
    const baseSide = computed(() => OPPOSITE_SIDE[contentContext.placedSide.value]);
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return openBlock(), createElementBlock("span", {
        ref: (el) => {
          unref(contentContext).onArrowChange(el != null ? el : void 0);
        },
        style: normalizeStyle({
          position: "absolute",
          left: ((_a = unref(contentContext).arrowX) == null ? void 0 : _a.value) ? `${(_b = unref(contentContext).arrowX) == null ? void 0 : _b.value}px` : void 0,
          top: ((_c = unref(contentContext).arrowY) == null ? void 0 : _c.value) ? `${(_d = unref(contentContext).arrowY) == null ? void 0 : _d.value}px` : void 0,
          [baseSide.value]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[unref(contentContext).placedSide.value],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[unref(contentContext).placedSide.value],
          visibility: unref(contentContext).shouldHideArrow.value ? "hidden" : void 0
        })
      }, [createVNode(Arrow_default, mergeProps(_ctx.$attrs, {
        ref: unref(forwardRef),
        style: { display: "block" },
        as: _ctx.as,
        "as-child": _ctx.asChild,
        rounded: _ctx.rounded,
        width: _ctx.width,
        height: _ctx.height
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "as",
        "as-child",
        "rounded",
        "width",
        "height"
      ])], 4);
    };
  }
});
var [injectComboboxRootContext, provideComboboxRootContext] = /* @__PURE__ */ createContext("ComboboxRoot");
var ComboboxRoot_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: false
    },
    resetSearchTermOnBlur: {
      type: Boolean,
      required: false,
      default: true
    },
    resetSearchTermOnSelect: {
      type: Boolean,
      required: false,
      default: true
    },
    openOnFocus: {
      type: Boolean,
      required: false,
      default: false
    },
    openOnClick: {
      type: Boolean,
      required: false,
      default: false
    },
    ignoreFilter: {
      type: Boolean,
      required: false
    },
    resetModelValueOnClear: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: null,
      required: false
    },
    defaultValue: {
      type: null,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    highlightOnHover: {
      type: Boolean,
      required: false,
      default: true
    },
    by: {
      type: [String, Function],
      required: false
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
      required: false
    }
  },
  emits: [
    "update:modelValue",
    "highlight",
    "update:open"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a, _b, _c, _d;
    const props = __props;
    const emits = __emit;
    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement();
    const { multiple, disabled, ignoreFilter, resetSearchTermOnSelect, openOnFocus, openOnClick, dir: propDir, resetModelValueOnClear, highlightOnHover } = toRefs(props);
    const dir = useDirection(propDir);
    const modelValue = useVModel(props, "modelValue", emits, {
      defaultValue: (_a = props.defaultValue) != null ? _a : multiple.value ? [] : void 0,
      passive: props.modelValue === void 0,
      deep: true
    });
    const open = useVModel(props, "open", emits, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    async function onOpenChange(val) {
      var _a2, _b2;
      open.value = val;
      filterSearch.value = "";
      if (val) {
        await nextTick();
        (_a2 = primitiveElement.value) == null ? void 0 : _a2.highlightSelected();
        isUserInputted.value = true;
        (_b2 = inputElement.value) == null ? void 0 : _b2.focus();
      } else {
        isUserInputted.value = false;
        setTimeout(() => {
          if (!val && props.resetSearchTermOnBlur) resetSearchTerm.trigger();
        }, 1);
      }
    }
    const resetSearchTerm = createEventHook();
    const isUserInputted = ref(false);
    const isVirtual = ref(false);
    const inputElement = ref();
    const triggerElement = ref();
    const highlightedElement = computed(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = primitiveElement.value) == null ? void 0 : _a2.highlightedElement) != null ? _b2 : void 0;
    });
    const allItems = ref(/* @__PURE__ */ new Map());
    const allGroups = ref(/* @__PURE__ */ new Map());
    const { contains } = useFilter$1({ sensitivity: "base" });
    const filterSearch = ref("");
    const filterState = computed((oldValue) => {
      var _a2, _b2;
      if (!filterSearch.value || props.ignoreFilter || isVirtual.value) return {
        count: allItems.value.size,
        items: (_a2 = oldValue == null ? void 0 : oldValue.items) != null ? _a2 : /* @__PURE__ */ new Map(),
        groups: (_b2 = oldValue == null ? void 0 : oldValue.groups) != null ? _b2 : new Set(allGroups.value.keys())
      };
      let itemCount = 0;
      const filteredItems = /* @__PURE__ */ new Map();
      const filteredGroups = /* @__PURE__ */ new Set();
      for (const [id, value] of allItems.value) {
        const score = contains(value, filterSearch.value);
        filteredItems.set(id, score ? 1 : 0);
        if (score) itemCount++;
      }
      for (const [groupId, group] of allGroups.value) for (const itemId of group) if (filteredItems.get(itemId) > 0) {
        filteredGroups.add(groupId);
        break;
      }
      return {
        count: itemCount,
        items: filteredItems,
        groups: filteredGroups
      };
    });
    getCurrentInstance();
    __expose({
      filtered: filterState,
      highlightedElement,
      highlightItem: (_b = primitiveElement.value) == null ? void 0 : _b.highlightItem,
      highlightFirstItem: (_c = primitiveElement.value) == null ? void 0 : _c.highlightFirstItem,
      highlightSelected: (_d = primitiveElement.value) == null ? void 0 : _d.highlightSelected
    });
    provideComboboxRootContext({
      modelValue,
      multiple,
      disabled,
      open,
      onOpenChange,
      contentId: "",
      isUserInputted,
      isVirtual,
      inputElement,
      highlightedElement,
      onInputElementChange: (val) => inputElement.value = val,
      triggerElement,
      onTriggerElementChange: (val) => triggerElement.value = val,
      parentElement,
      resetSearchTermOnSelect,
      onResetSearchTerm: resetSearchTerm.on,
      allItems,
      allGroups,
      filterSearch,
      filterState,
      ignoreFilter,
      openOnFocus,
      openOnClick,
      resetModelValueOnClear
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperRoot_default), null, {
        default: withCtx(() => [createVNode(unref(ListboxRoot_default), mergeProps({
          ref_key: "primitiveElement",
          ref: primitiveElement
        }, _ctx.$attrs, {
          modelValue: unref(modelValue),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(modelValue) ? modelValue.value = $event : null),
          style: { pointerEvents: unref(open) ? "auto" : void 0 },
          as: _ctx.as,
          "as-child": _ctx.asChild,
          dir: unref(dir),
          multiple: unref(multiple),
          name: _ctx.name,
          required: _ctx.required,
          disabled: unref(disabled),
          "highlight-on-hover": unref(highlightOnHover),
          by: props.by,
          onHighlight: _cache[1] || (_cache[1] = ($event) => emits("highlight", $event))
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
            open: unref(open),
            modelValue: unref(modelValue)
          })]),
          _: 3
        }, 16, [
          "modelValue",
          "style",
          "as",
          "as-child",
          "dir",
          "multiple",
          "name",
          "required",
          "disabled",
          "highlight-on-hover",
          "by"
        ])]),
        _: 3
      });
    };
  }
});
var ComboboxAnchor_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxAnchor",
  props: {
    reference: {
      type: null,
      required: false
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
  setup(__props) {
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(PopperAnchor_default), {
        "as-child": "",
        reference: _ctx.reference
      }, {
        default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
          ref: unref(forwardRef),
          "as-child": _ctx.asChild,
          as: _ctx.as
        }, _ctx.$attrs), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, ["as-child", "as"])]),
        _: 3
      }, 8, ["reference"]);
    };
  }
});
var [injectComboboxContentContext, provideComboboxContentContext] = /* @__PURE__ */ createContext("ComboboxContent");
var ComboboxContentImpl_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxContentImpl",
  props: {
    position: {
      type: String,
      required: false,
      default: "inline"
    },
    bodyLock: {
      type: Boolean,
      required: false
    },
    hideWhenEmpty: {
      type: Boolean,
      required: false
    },
    memoDependencies: {
      type: Array,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { position } = toRefs(props);
    const rootContext = injectComboboxRootContext();
    const isEmpty = computed(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
    const { forwardRef} = useForwardExpose();
    useBodyScrollLock(props.bodyLock);
    useFocusGuards();
    useHideOthers(rootContext.parentElement);
    const pickedProps = computed(() => {
      if (props.position === "popper") return props;
      else return {};
    });
    const forwardedProps = useForwardProps$1(pickedProps.value);
    const popperStyle = {
      "boxSizing": "border-box",
      "--reka-combobox-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-combobox-content-available-width": "var(--reka-popper-available-width)",
      "--reka-combobox-content-available-height": "var(--reka-popper-available-height)",
      "--reka-combobox-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-combobox-trigger-height": "var(--reka-popper-anchor-height)"
    };
    provideComboboxContentContext({ position });
    ref(false);
    function isEventTargetWithinCombobox(target) {
      var _a, _b, _c;
      if ((_a = rootContext.parentElement.value) == null ? void 0 : _a.contains(target)) return true;
      const control = (_b = target instanceof Element ? target.closest("label") : null) == null ? void 0 : _b.control;
      return !!control && !!((_c = rootContext.parentElement.value) == null ? void 0 : _c.contains(control));
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxContent_default), { "as-child": "" }, {
        default: withCtx(() => [createVNode(unref(FocusScope_default), {
          "as-child": "",
          onMountAutoFocus: _cache[5] || (_cache[5] = withModifiers(() => {
          }, ["prevent"])),
          onUnmountAutoFocus: _cache[6] || (_cache[6] = withModifiers(() => {
          }, ["prevent"]))
        }, {
          default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
            "as-child": "",
            "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
            onDismiss: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false)),
            onFocusOutside: _cache[1] || (_cache[1] = (ev) => {
              if (isEventTargetWithinCombobox(ev.target)) ev.preventDefault();
              emits("focusOutside", ev);
            }),
            onInteractOutside: _cache[2] || (_cache[2] = ($event) => emits("interactOutside", $event)),
            onEscapeKeyDown: _cache[3] || (_cache[3] = ($event) => emits("escapeKeyDown", $event)),
            onPointerDownOutside: _cache[4] || (_cache[4] = (ev) => {
              if (isEventTargetWithinCombobox(ev.target)) ev.preventDefault();
              emits("pointerDownOutside", ev);
            })
          }, {
            default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(unref(position) === "popper" ? unref(PopperContent_default) : unref(Primitive)), mergeProps({
              ..._ctx.$attrs,
              ...unref(forwardedProps)
            }, {
              id: unref(rootContext).contentId,
              ref: unref(forwardRef),
              "memo-dependencies": unref(position) === "popper" ? [unref(rootContext).filterSearch.value, unref(rootContext).filterState.value] : void 0,
              "data-state": unref(rootContext).open.value ? "open" : "closed",
              "data-empty": isEmpty.value ? "" : void 0,
              style: {
                display: props.hideWhenEmpty && isEmpty.value ? "none" : "flex",
                flexDirection: "column",
                outline: "none",
                ...unref(position) === "popper" ? popperStyle : {}
              }
            }), {
              default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
              _: 3
            }, 16, [
              "id",
              "memo-dependencies",
              "data-state",
              "data-empty",
              "style"
            ]))]),
            _: 3
          }, 8, ["disable-outside-pointer-events"])]),
          _: 3
        })]),
        _: 3
      });
    };
  }
});
var ComboboxArrow_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxArrow",
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    height: {
      type: Number,
      required: false,
      default: 5
    },
    rounded: {
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
      default: "svg"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectComboboxRootContext();
    const contentContext = injectComboboxContentContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return unref(rootContext).open.value && unref(contentContext).position.value === "popper" ? (openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(mergeProps({ key: 0 }, props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var ComboboxCancel_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxCancel",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectComboboxRootContext();
    function handleClick() {
      var _a;
      rootContext.filterSearch.value = "";
      if (rootContext.inputElement.value) {
        rootContext.inputElement.value.value = "";
        rootContext.inputElement.value.focus();
      }
      if ((_a = rootContext.resetModelValueOnClear) == null ? void 0 : _a.value) rootContext.modelValue.value = rootContext.multiple.value ? [] : null;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps({ type: _ctx.as === "button" ? "button" : void 0 }, props, {
        tabindex: "-1",
        onClick: handleClick
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["type"]);
    };
  }
});
var ComboboxContent_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    position: {
      type: String,
      required: false
    },
    bodyLock: {
      type: Boolean,
      required: false
    },
    hideWhenEmpty: {
      type: Boolean,
      required: false
    },
    memoDependencies: {
      type: Array,
      required: false
    },
    side: {
      type: null,
      required: false
    },
    sideOffset: {
      type: Number,
      required: false
    },
    sideFlip: {
      type: Boolean,
      required: false
    },
    align: {
      type: null,
      required: false
    },
    alignOffset: {
      type: Number,
      required: false
    },
    alignFlip: {
      type: Boolean,
      required: false
    },
    avoidCollisions: {
      type: Boolean,
      required: false
    },
    collisionBoundary: {
      type: null,
      required: false
    },
    collisionPadding: {
      type: [Number, Object],
      required: false
    },
    arrowPadding: {
      type: Number,
      required: false
    },
    hideShiftedArrow: {
      type: Boolean,
      required: false
    },
    sticky: {
      type: String,
      required: false
    },
    hideWhenDetached: {
      type: Boolean,
      required: false
    },
    positionStrategy: {
      type: String,
      required: false
    },
    updatePositionStrategy: {
      type: String,
      required: false
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: false
    },
    prioritizePosition: {
      type: Boolean,
      required: false
    },
    reference: {
      type: null,
      required: false
    },
    dir: {
      type: String,
      required: false
    },
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside"
  ],
  setup(__props, { emit: __emit }) {
    const forwarded = useForwardPropsEmits(__props, __emit);
    const { forwardRef } = useForwardExpose();
    const rootContext = injectComboboxRootContext();
    rootContext.contentId || (rootContext.contentId = useId$1(void 0, "reka-combobox-content"));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(rootContext).open.value }, {
        default: withCtx(() => [createVNode(ComboboxContentImpl_default, mergeProps({
          ...unref(forwarded),
          ..._ctx.$attrs
        }, { ref: unref(forwardRef) }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16)]),
        _: 3
      }, 8, ["present"]);
    };
  }
});
var ComboboxEmpty_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxEmpty",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectComboboxRootContext();
    const isRender = computed(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
    return (_ctx, _cache) => {
      return isRender.value ? (openBlock(), createBlock(unref(Primitive), normalizeProps(mergeProps({ key: 0 }, props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createTextVNode("No options"))])]),
        _: 3
      }, 16)) : createCommentVNode("v-if", true);
    };
  }
});
var [injectComboboxGroupContext, provideComboboxGroupContext] = /* @__PURE__ */ createContext("ComboboxGroup");
var ComboboxGroup_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxGroup",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const id = useId$1(void 0, "reka-combobox-group");
    const rootContext = injectComboboxRootContext();
    const isRender = computed(() => rootContext.ignoreFilter.value ? true : !rootContext.filterSearch.value ? true : rootContext.filterState.value.groups.has(id));
    const context = provideComboboxGroupContext({
      id,
      labelId: ""
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxGroup_default), mergeProps({
        id: unref(id),
        "aria-labelledby": unref(context).labelId
      }, props, { hidden: isRender.value ? void 0 : true }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "aria-labelledby",
        "hidden"
      ]);
    };
  }
});
var ComboboxInput_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxInput",
  props: {
    displayValue: {
      type: Function,
      required: false
    },
    modelValue: {
      type: String,
      required: false
    },
    autoFocus: {
      type: Boolean,
      required: false
    },
    disabled: {
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
      default: "input"
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectComboboxRootContext();
    const listboxContext = injectListboxRootContext();
    const { primitiveElement} = usePrimitiveElement();
    const modelValue = useVModel(props, "modelValue", emits, { passive: props.modelValue === void 0 });
    const { isComposing, handleCompositionStart, handleCompositionEnd } = useComposing((event) => {
      const el = event.target;
      if (el) processInputValue(el.value);
    });
    function handleKeyDown(ev) {
      if (isComposing.value) return;
      ev.preventDefault();
      if (!rootContext.open.value) rootContext.onOpenChange(true);
    }
    function processInputValue(value) {
      if (!rootContext.open.value) {
        rootContext.onOpenChange(true);
        nextTick(() => {
          if (value) {
            rootContext.filterSearch.value = value;
            listboxContext.highlightFirstItem();
          }
        });
      } else rootContext.filterSearch.value = value;
    }
    function handleInput(event) {
      if (isComposing.value) return;
      processInputValue(event.target.value);
    }
    function handleFocus() {
      if (rootContext.openOnFocus.value && !rootContext.open.value) rootContext.onOpenChange(true);
    }
    function handleBlur(ev) {
      var _a, _b;
      if (!rootContext.open.value) return;
      const nextFocus = ev.relatedTarget;
      if (!nextFocus) return;
      const isInsideRoot = (_a = rootContext.parentElement.value) == null ? void 0 : _a.contains(nextFocus);
      const isInsideContent = (_b = (void 0).getElementById(rootContext.contentId)) == null ? void 0 : _b.contains(nextFocus);
      if (!isInsideRoot && !isInsideContent) requestAnimationFrame(() => {
        var _a2, _b2;
        if (!rootContext.open.value) return;
        const active = (void 0).activeElement;
        if (!((_a2 = rootContext.parentElement.value) == null ? void 0 : _a2.contains(active)) && !((_b2 = (void 0).getElementById(rootContext.contentId)) == null ? void 0 : _b2.contains(active))) rootContext.onOpenChange(false);
      });
    }
    function handleClick() {
      if (rootContext.openOnClick.value && !rootContext.open.value) rootContext.onOpenChange(true);
    }
    function resetSearchTerm() {
      const rootModelValue = rootContext.modelValue.value;
      if (props.displayValue) modelValue.value = props.displayValue(rootModelValue);
      else if (!rootContext.multiple.value && rootModelValue && !Array.isArray(rootModelValue)) if (typeof rootModelValue !== "object") modelValue.value = rootModelValue.toString();
      else modelValue.value = "";
      else modelValue.value = "";
      nextTick(() => {
        modelValue.value = modelValue.value;
      });
    }
    rootContext.onResetSearchTerm(() => {
      resetSearchTerm();
    });
    watch(rootContext.modelValue, async () => {
      if (!rootContext.isUserInputted.value && rootContext.resetSearchTermOnSelect.value) resetSearchTerm();
    }, {
      immediate: true,
      deep: true
    });
    watch(rootContext.filterState, (_newValue, oldValue) => {
      if (!rootContext.isVirtual.value && oldValue.count === 0) listboxContext.highlightFirstItem();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxFilter_default), {
        ref_key: "primitiveElement",
        ref: primitiveElement,
        modelValue: unref(modelValue),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(modelValue) ? modelValue.value = $event : null),
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "auto-focus": _ctx.autoFocus,
        disabled: _ctx.disabled,
        "aria-expanded": unref(rootContext).open.value,
        "aria-controls": unref(rootContext).contentId,
        "aria-autocomplete": "list",
        role: "combobox",
        autocomplete: "off",
        onClick: handleClick,
        onInput: handleInput,
        onKeydown: withKeys(handleKeyDown, ["down", "up"]),
        onFocus: handleFocus,
        onBlur: handleBlur,
        onCompositionstart: unref(handleCompositionStart),
        onCompositionend: unref(handleCompositionEnd)
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "modelValue",
        "as",
        "as-child",
        "auto-focus",
        "disabled",
        "aria-expanded",
        "aria-controls",
        "onCompositionstart",
        "onCompositionend"
      ]);
    };
  }
});
var ComboboxItem_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxItem",
  props: {
    textValue: {
      type: String,
      required: false
    },
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
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
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const id = useId$1(void 0, "reka-combobox-item");
    const rootContext = injectComboboxRootContext();
    injectComboboxGroupContext(null);
    const { primitiveElement} = usePrimitiveElement();
    if (props.value === "") throw new Error("A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.");
    const isRender = computed(() => {
      if (rootContext.isVirtual.value || rootContext.ignoreFilter.value || !rootContext.filterSearch.value) return true;
      else {
        const filteredCurrentItem = rootContext.filterState.value.items.get(id);
        if (filteredCurrentItem === void 0) return true;
        return filteredCurrentItem > 0;
      }
    });
    return (_ctx, _cache) => {
      return isRender.value ? withMemo([
        isRender.value,
        unref(rootContext).filterSearch.value,
        unref(rootContext).disabled.value,
        _ctx.disabled,
        props.value,
        props.as,
        props.asChild,
        ...Object.values(_ctx.$attrs)
      ], () => (openBlock(), createBlock(unref(ListboxItem_default), mergeProps({ key: 0 }, props, {
        id: unref(id),
        ref_key: "primitiveElement",
        ref: primitiveElement,
        disabled: unref(rootContext).disabled.value || _ctx.disabled,
        onSelect: _cache[0] || (_cache[0] = (event) => {
          var _a;
          emits("select", event);
          if (event.defaultPrevented) return;
          if (!unref(rootContext).multiple.value && !_ctx.disabled && !unref(rootContext).disabled.value) {
            event.preventDefault();
            unref(rootContext).onOpenChange(false);
            unref(rootContext).modelValue.value = props.value;
          } else if (unref(rootContext).multiple.value) (_a = unref(rootContext).inputElement.value) == null ? void 0 : _a.focus();
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.value), 1)])]),
        _: 3
      }, 16, ["id", "disabled"])), _cache, 1) : createCommentVNode("v-if", true);
    };
  }
});
var ComboboxItemIndicator_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxItemIndicator",
  props: {
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
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ListboxItemIndicator_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var ComboboxLabel_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxLabel",
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
      default: "div"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const groupContext = injectComboboxGroupContext({
      id: "",
      labelId: ""
    });
    groupContext.labelId || (groupContext.labelId = useId$1(void 0, "reka-combobox-group-label"));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).labelId }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var ComboboxPortal_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxPortal",
  props: {
    to: {
      type: null,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    defer: {
      type: Boolean,
      required: false
    },
    forceMount: {
      type: Boolean,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var ComboboxSeparator_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxSeparator",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { "aria-hidden": "true" }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16);
    };
  }
});
var ComboboxTrigger_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxTrigger",
  props: {
    disabled: {
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
      default: "button"
    }
  },
  setup(__props) {
    const props = __props;
    const { forwardRef} = useForwardExpose();
    const rootContext = injectComboboxRootContext();
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false);
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        ref: unref(forwardRef),
        type: _ctx.as === "button" ? "button" : void 0,
        tabindex: "-1",
        "aria-label": "Show popup",
        "aria-haspopup": "listbox",
        "aria-expanded": unref(rootContext).open.value,
        "aria-controls": unref(rootContext).contentId,
        "data-state": unref(rootContext).open.value ? "open" : "closed",
        disabled: disabled.value,
        "data-disabled": disabled.value ? "" : void 0,
        "aria-disabled": (_a = disabled.value) != null ? _a : void 0,
        onClick: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(!unref(rootContext).open.value))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "type",
        "aria-expanded",
        "aria-controls",
        "data-state",
        "disabled",
        "data-disabled",
        "aria-disabled"
      ]);
    };
  }
});
var ComboboxVirtualizer_default = /* @__PURE__ */ defineComponent({
  __name: "ComboboxVirtualizer",
  props: {
    options: {
      type: Array,
      required: true
    },
    overscan: {
      type: Number,
      required: false
    },
    estimateSize: {
      type: [Number, Function],
      required: false
    },
    textContent: {
      type: Function,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectComboboxRootContext();
    rootContext.isVirtual.value = true;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ListboxVirtualizer_default, normalizeProps(guardReactiveProps(props)), {
        default: withCtx((slotProps) => [renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps)))]),
        _: 3
      }, 16);
    };
  }
});
function useFilter() {
  const { contains, startsWith } = useFilter$1({ sensitivity: "base" });
  function score(value, searchTerm) {
    if (!contains(value, searchTerm)) return null;
    if (contains(searchTerm, value)) return 0;
    if (startsWith(value, searchTerm)) return 1;
    return 2;
  }
  function scoreItem(item, searchTerm, fields) {
    if (typeof item !== "object" || item === null) return score(String(item), searchTerm);
    let bestScore = null;
    for (const field of fields) {
      const value = get(item, field);
      if (value == null) continue;
      const values = Array.isArray(value) ? value.map(String) : [String(value)];
      for (const v of values) {
        const s = score(v, searchTerm);
        if (s !== null && (bestScore === null || s < bestScore)) bestScore = s;
        if (bestScore === 0) return 0;
      }
    }
    return bestScore;
  }
  function filter(items, searchTerm, fields) {
    if (!searchTerm) return items;
    const scored = [];
    for (const item of items) {
      const s = scoreItem(item, searchTerm, fields);
      if (s !== null) scored.push({
        item,
        score: s
      });
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.map(({ item }) => item);
  }
  function filterGroups(groups, searchTerm, options) {
    if (!searchTerm) return groups;
    return groups.map((group) => {
      var _a;
      const result = [];
      for (const item of group) {
        if (item === void 0 || item === null) continue;
        if ((_a = options.isStructural) == null ? void 0 : _a.call(options, item)) {
          result.push({
            item,
            score: -1
          });
          continue;
        }
        const s = scoreItem(item, searchTerm, options.fields);
        if (s !== null) result.push({
          item,
          score: s
        });
      }
      result.sort((a, b) => a.score - b.score);
      return result.map(({ item }) => item);
    }).filter((group) => group.some((item) => {
      var _a;
      return !((_a = options.isStructural) == null ? void 0 : _a.call(options, item));
    }));
  }
  return {
    score,
    scoreItem,
    filter,
    filterGroups
  };
}
function itemHasDescription(item, descriptionKey) {
  if (typeof item !== "object" || item === null) return false;
  const value = get(item, descriptionKey);
  return value !== void 0 && value !== null && value !== "";
}
function getSize(size2, hasDescription) {
  if (hasDescription) return {
    xs: 44,
    sm: 48,
    md: 52,
    lg: 56,
    xl: 60
  }[size2];
  return {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40
  }[size2];
}
function getEstimateSize(items, size2, descriptionKey, hasDescriptionSlot) {
  const sizeWithDescription = getSize(size2, true);
  const sizeWithoutDescription = getSize(size2, false);
  if (hasDescriptionSlot) return () => sizeWithDescription;
  if (!descriptionKey) return () => sizeWithoutDescription;
  return (index) => {
    return itemHasDescription(items[index], descriptionKey) ? sizeWithDescription : sizeWithoutDescription;
  };
}
var virtual_nuxt__nuxt_2Fui_2Fselect_menu_default = {
  "slots": {
    "base": ["relative group rounded-md inline-flex items-center disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed",
    "value": "truncate pointer-events-none",
    "placeholder": "truncate text-dimmed",
    "arrow": "fill-bg stroke-default",
    "content": ["max-h-[min(15rem,var(--reka-select-content-available-height,15rem))] w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col", "max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"],
    "viewport": "relative scroll-py-1 overflow-y-auto flex-1",
    "group": "p-1 isolate",
    "empty": "text-center text-muted",
    "label": "font-semibold text-highlighted",
    "separator": "-mx-1 my-1 h-px bg-border",
    "item": ["group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", "transition-colors before:transition-colors"],
    "itemLeadingIcon": ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", "transition-colors"],
    "itemLeadingAvatar": "shrink-0",
    "itemLeadingAvatarSize": "",
    "itemLeadingChip": "shrink-0",
    "itemLeadingChipSize": "",
    "itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
    "itemTrailingIcon": "shrink-0",
    "itemWrapper": "flex-1 flex flex-col min-w-0",
    "itemLabel": "truncate",
    "itemDescription": "truncate text-muted",
    "input": "border-b border-default",
    "focusScope": "flex flex-col min-h-0",
    "trailingClear": "p-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1 text-[10px]/3 gap-1",
        "item": "p-1 text-xs gap-1",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-2 text-xs"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1.5 text-[10px]/3 gap-1.5",
        "item": "p-1.5 text-xs gap-1.5",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-2.5 text-xs"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-1.5 text-xs gap-1.5",
        "item": "p-1.5 text-sm gap-1.5",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-2.5 text-sm"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-2 text-xs gap-2",
        "item": "p-2 text-sm gap-2",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-3 text-sm"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6",
        "label": "p-2 text-sm gap-2",
        "item": "p-2 text-base gap-2",
        "itemLeadingIcon": "size-6",
        "itemLeadingAvatarSize": "xs",
        "itemLeadingChip": "size-6",
        "itemLeadingChipSize": "lg",
        "itemTrailingIcon": "size-6",
        "empty": "p-3 text-base"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented hover:bg-elevated disabled:bg-default",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented hover:bg-accented/75 disabled:bg-elevated",
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
    "type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" },
    "position": {
      "popper": { "content": "data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]" },
      "item-aligned": { "content": "" }
    },
    "multiple": { "true": "" },
    "virtualize": {
      "true": { "viewport": "p-1 isolate" },
      "false": { "viewport": "divide-y divide-default" }
    }
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
    "variant": "outline",
    "position": "popper"
  }
};
var _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USelectMenu",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: false
    },
    searchInput: {
      type: [Boolean, Object],
      required: false,
      default: true
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
    trailingIcon: {
      type: null,
      required: false
    },
    selectedIcon: {
      type: null,
      required: false
    },
    clear: {
      type: [Boolean, Object],
      required: false
    },
    clearIcon: {
      type: null,
      required: false
    },
    content: {
      type: Object,
      required: false
    },
    arrow: {
      type: [Boolean, Object],
      required: false
    },
    portal: {
      type: [Boolean, String],
      required: false,
      skipCheck: true,
      default: true
    },
    virtualize: {
      type: [Boolean, Object],
      required: false,
      default: false
    },
    valueKey: {
      type: null,
      required: false
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
    defaultValue: {
      type: null,
      required: false
    },
    modelValue: {
      type: null,
      required: false
    },
    modelModifiers: {
      type: null,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    highlight: {
      type: Boolean,
      required: false
    },
    createItem: {
      type: [
        Boolean,
        String,
        Object
      ],
      required: false
    },
    filterFields: {
      type: Array,
      required: false
    },
    ignoreFilter: {
      type: Boolean,
      required: false
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
    class: {
      type: null,
      required: false
    },
    ui: {
      type: Object,
      required: false
    },
    open: {
      type: Boolean,
      required: false
    },
    defaultOpen: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    resetSearchTermOnBlur: {
      type: Boolean,
      required: false,
      default: true
    },
    resetSearchTermOnSelect: {
      type: Boolean,
      required: false,
      default: true
    },
    resetModelValueOnClear: {
      type: Boolean,
      required: false,
      default: true
    },
    highlightOnHover: {
      type: Boolean,
      required: false
    },
    by: {
      type: [String, Function],
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
    loading: {
      type: Boolean,
      required: false
    },
    loadingIcon: {
      type: null,
      required: false
    }
  }, {
    "searchTerm": {
      type: String,
      default: ""
    },
    "searchTermModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels([
    "change",
    "blur",
    "focus",
    "create",
    "clear",
    "highlight",
    "update:modelValue",
    "update:open"
  ], ["update:searchTerm"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("selectMenu", _props);
    const searchTerm = useModel(__props, "searchTerm", {
      type: String,
      default: ""
    });
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const { filterGroups } = useFilter();
    const rootProps = useForwardProps(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "resetModelValueOnClear", "highlightOnHover", "by"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, {
      side: "bottom",
      sideOffset: 8,
      collisionPadding: 8,
      position: "popper"
    }));
    const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
    const clearProps = computed(() => typeof props.clear === "object" ? props.clear : {});
    const virtualizerProps = toRef(() => {
      if (!props.virtualize) return false;
      return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, { estimateSize: getEstimateSize(filteredItems.value, selectSize.value || "md", props.descriptionKey, !!slots["item-description"]) });
    });
    const searchInputProps = toRef(() => defu(props.searchInput, {
      placeholder: t("selectMenu.search"),
      variant: "none"
    }));
    const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(_props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
    const selectSize = computed(() => fieldGroupSize.value || formFieldSize.value);
    const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
    const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({ props: {
      item: {
        type: [
          Object,
          String,
          Number,
          Boolean
        ],
        required: true
      },
      index: {
        type: Number,
        required: false
      }
    } });
    const ui = computed(() => {
      var _a, _b, _c, _d;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Fselect_menu_default,
        ...((_a = appConfig.ui) == null ? void 0 : _a.selectMenu) || {}
      })({
        color: (_b = color.value) != null ? _b : props.color,
        variant: props.variant,
        size: (_c = selectSize == null ? void 0 : selectSize.value) != null ? _c : props.size,
        loading: props.loading,
        highlight: (_d = highlight.value) != null ? _d : props.highlight,
        leading: isLeading.value || !!props.avatar || !!slots.leading,
        trailing: isTrailing.value || !!slots.trailing,
        fieldGroup: orientation.value,
        virtualize: !!props.virtualize,
        multiple: props.multiple
      });
    });
    function displayValue(value) {
      if (props.multiple && Array.isArray(value)) {
        const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
          labelKey: props.labelKey,
          valueKey: props.valueKey,
          by: props.by
        })).filter((v) => v != null && v !== "");
        return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
      }
      return getDisplayValue(items.value, value, {
        labelKey: props.labelKey,
        valueKey: props.valueKey,
        by: props.by
      });
    }
    const groups = computed(() => {
      var _a;
      return ((_a = props.items) == null ? void 0 : _a.length) ? isArrayOfArray(props.items) ? props.items : [props.items] : [];
    });
    const items = computed(() => groups.value.flatMap((group) => group));
    const filteredGroups = computed(() => {
      if (props.ignoreFilter || !searchTerm.value) return groups.value;
      const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
      return filterGroups(groups.value, searchTerm.value, {
        fields,
        isStructural: (item) => isSelectItem(item) && !!item.type && ["label", "separator"].includes(item.type)
      });
    });
    const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));
    const createItem = computed(() => {
      if (!props.createItem || !searchTerm.value) return false;
      const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
      if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") return !filteredItems.value.find((item) => {
        var _a;
        return compare$1(item, newItem, (_a = props.by) != null ? _a : props.valueKey);
      });
      return !filteredItems.value.length;
    });
    const createItemPosition = computed(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
    const triggerRef = useTemplateRef("triggerRef");
    function onUpdate(value) {
      var _a, _b, _c, _d, _e, _f;
      if (toRaw(props.modelValue) === value) return;
      if (((_a = props.modelModifiers) == null ? void 0 : _a.trim) && (typeof value === "string" || value === null || value === void 0)) value = (_b = value == null ? void 0 : value.trim()) != null ? _b : null;
      if ((_c = props.modelModifiers) == null ? void 0 : _c.number) value = looseToNumber(value);
      if ((_d = props.modelModifiers) == null ? void 0 : _d.nullable) value != null ? value : value = null;
      if (((_e = props.modelModifiers) == null ? void 0 : _e.optional) && !((_f = props.modelModifiers) == null ? void 0 : _f.nullable) && value !== null) value != null ? value : value = void 0;
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
      if (props.resetSearchTermOnSelect) searchTerm.value = "";
    }
    const isOpen = ref(false);
    function onUpdateOpen(value) {
      isOpen.value = value;
      let timeoutId;
      if (!value) {
        const event = new FocusEvent("blur");
        emits("blur", event);
        emitFormBlur();
        if (props.resetSearchTermOnBlur) timeoutId = setTimeout(() => {
          searchTerm.value = "";
        }, 100);
      } else {
        const event = new FocusEvent("focus");
        emits("focus", event);
        emitFormFocus();
        clearTimeout(timeoutId);
      }
    }
    function onCreate(e) {
      e.preventDefault();
      e.stopPropagation();
      emits("create", searchTerm.value);
    }
    function onSelect(e, item) {
      var _a;
      if (!isSelectItem(item)) return;
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      (_a = item.onSelect) == null ? void 0 : _a.call(item, e);
    }
    function isSelectItem(item) {
      return typeof item === "object" && item !== null;
    }
    function isModelValueEmpty(modelValue) {
      if (props.multiple && Array.isArray(modelValue)) return modelValue.length === 0;
      return modelValue === void 0 || modelValue === null || modelValue === "";
    }
    function onClear() {
      emits("clear");
    }
    const viewportRef = useTemplateRef("viewportRef");
    const comboboxRootRef = useTemplateRef("comboboxRootRef");
    watch(() => props.items, async () => {
      var _a, _b;
      if (!isOpen.value || !props.createItem) return;
      await nextTick();
      (_b = (_a = comboboxRootRef.value) == null ? void 0 : _a.highlightFirstItem) == null ? void 0 : _b.call(_a);
    }, { flush: "post" });
    __expose({
      triggerRef: toRef(() => {
        var _a;
        return (_a = triggerRef.value) == null ? void 0 : _a.$el;
      }),
      viewportRef: toRef(() => viewportRef.value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineCreateItemTemplate), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) _push2(ssrRenderComponent(unref(ComboboxItem_default), {
            "data-slot": "item",
            class: ui.value.item({ class: (_a = unref(props).ui) == null ? void 0 : _a.item }),
            value: searchTerm.value,
            onSelect: onCreate
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              var _a2, _b2;
              if (_push3) {
                _push3(`<span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.itemLabel }))}"${_scopeId2}>`);
                ssrRenderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => {
                  _push3(`${ssrInterpolate(unref(t)("selectMenu.create", { label: searchTerm.value }))}`);
                }, _push3, _parent3, _scopeId2);
                _push3(`</span>`);
              } else return [createVNode("span", {
                "data-slot": "itemLabel",
                class: ui.value.itemLabel({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.itemLabel })
              }, [renderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [createTextVNode(toDisplayString(unref(t)("selectMenu.create", { label: searchTerm.value })), 1)])], 2)];
            }),
            _: 3
          }, _parent2, _scopeId));
          else return [createVNode(unref(ComboboxItem_default), {
            "data-slot": "item",
            class: ui.value.item({ class: (_b = unref(props).ui) == null ? void 0 : _b.item }),
            value: searchTerm.value,
            onSelect: onCreate
          }, {
            default: withCtx(() => {
              var _a2;
              return [createVNode("span", {
                "data-slot": "itemLabel",
                class: ui.value.itemLabel({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.itemLabel })
              }, [renderSlot(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [createTextVNode(toDisplayString(unref(t)("selectMenu.create", { label: searchTerm.value })), 1)])], 2)];
            }),
            _: 3
          }, 8, ["class", "value"])];
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(DefineItemTemplate), null, {
        default: withCtx(({ item, index }, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            if (isSelectItem(item) && item.type === "label") _push2(ssrRenderComponent(unref(ComboboxLabel_default), {
              "data-slot": "label",
              class: ui.value.label({ class: [
                (_a = unref(props).ui) == null ? void 0 : _a.label,
                (_b = item.ui) == null ? void 0 : _b.label,
                item.class
              ] })
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(`${ssrInterpolate(unref(get)(item, unref(props).labelKey))}`);
                else return [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)];
              }),
              _: 2
            }, _parent2, _scopeId));
            else if (isSelectItem(item) && item.type === "separator") _push2(ssrRenderComponent(unref(ComboboxSeparator_default), {
              "data-slot": "separator",
              class: ui.value.separator({ class: [
                (_c = unref(props).ui) == null ? void 0 : _c.separator,
                (_d = item.ui) == null ? void 0 : _d.separator,
                item.class
              ] })
            }, null, _parent2, _scopeId));
            else _push2(ssrRenderComponent(unref(ComboboxItem_default), {
              "data-slot": "item",
              class: ui.value.item({ class: [
                (_e = unref(props).ui) == null ? void 0 : _e.item,
                isSelectItem(item) && ((_f = item.ui) == null ? void 0 : _f.item),
                isSelectItem(item) && item.class
              ] }),
              disabled: isSelectItem(item) && item.disabled,
              value: unref(props).valueKey && isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
              onSelect: ($event) => onSelect($event, item)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) ssrRenderSlot(_ctx.$slots, "item", {
                  item,
                  index,
                  ui: ui.value
                }, () => {
                  var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
                  ssrRenderSlot(_ctx.$slots, "item-leading", {
                    item,
                    index,
                    ui: ui.value
                  }, () => {
                    var _a3, _b3, _c3, _d3, _e3, _f3, _g3, _h3, _i2, _j2;
                    if (isSelectItem(item) && item.icon) _push3(ssrRenderComponent(_sfc_main$7, {
                      name: item.icon,
                      "data-slot": "itemLeadingIcon",
                      class: ui.value.itemLeadingIcon({ class: [(_a3 = unref(props).ui) == null ? void 0 : _a3.itemLeadingIcon, (_b3 = item.ui) == null ? void 0 : _b3.itemLeadingIcon] })
                    }, null, _parent3, _scopeId2));
                    else if (isSelectItem(item) && item.avatar) _push3(ssrRenderComponent(_sfc_main$5, mergeProps({ size: ((_c3 = item.ui) == null ? void 0 : _c3.itemLeadingAvatarSize) || ((_d3 = unref(props).ui) == null ? void 0 : _d3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize() }, item.avatar, {
                      "data-slot": "itemLeadingAvatar",
                      class: ui.value.itemLeadingAvatar({ class: [(_e3 = unref(props).ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                    }), null, _parent3, _scopeId2));
                    else if (isSelectItem(item) && item.chip) _push3(ssrRenderComponent(_sfc_main$6, mergeProps({
                      size: ((_g3 = item.ui) == null ? void 0 : _g3.itemLeadingChipSize) || ((_h3 = unref(props).ui) == null ? void 0 : _h3.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                      inset: "",
                      standalone: ""
                    }, item.chip, {
                      "data-slot": "itemLeadingChip",
                      class: ui.value.itemLeadingChip({ class: [(_i2 = unref(props).ui) == null ? void 0 : _i2.itemLeadingChip, (_j2 = item.ui) == null ? void 0 : _j2.itemLeadingChip] })
                    }), null, _parent3, _scopeId2));
                    else _push3(`<!---->`);
                  }, _push3, _parent3, _scopeId2);
                  _push3(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [(_a2 = unref(props).ui) == null ? void 0 : _a2.itemWrapper, isSelectItem(item) && ((_b2 = item.ui) == null ? void 0 : _b2.itemWrapper)] }))}"${_scopeId2}><span data-slot="itemLabel" class="${ssrRenderClass(ui.value.itemLabel({ class: [(_c2 = unref(props).ui) == null ? void 0 : _c2.itemLabel, isSelectItem(item) && ((_d2 = item.ui) == null ? void 0 : _d2.itemLabel)] }))}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "item-label", {
                    item,
                    index
                  }, () => {
                    _push3(`${ssrInterpolate(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item)}`);
                  }, _push3, _parent3, _scopeId2);
                  _push3(`</span>`);
                  if (isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"])) {
                    _push3(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [(_e2 = unref(props).ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] }))}"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "item-description", {
                      item,
                      index
                    }, () => {
                      _push3(`${ssrInterpolate(unref(get)(item, unref(props).descriptionKey))}`);
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</span>`);
                  } else _push3(`<!---->`);
                  _push3(`</span><span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [(_g2 = unref(props).ui) == null ? void 0 : _g2.itemTrailing, isSelectItem(item) && ((_h2 = item.ui) == null ? void 0 : _h2.itemTrailing)] }))}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "item-trailing", {
                    item,
                    index,
                    ui: ui.value
                  }, null, _push3, _parent3, _scopeId2);
                  _push3(ssrRenderComponent(unref(ComboboxItemIndicator_default), { "as-child": "" }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      var _a3, _b3, _c3, _d3;
                      if (_push4) _push4(ssrRenderComponent(_sfc_main$7, {
                        name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
                        "data-slot": "itemTrailingIcon",
                        class: ui.value.itemTrailingIcon({ class: [(_a3 = unref(props).ui) == null ? void 0 : _a3.itemTrailingIcon, isSelectItem(item) && ((_b3 = item.ui) == null ? void 0 : _b3.itemTrailingIcon)] })
                      }, null, _parent4, _scopeId3));
                      else return [createVNode(_sfc_main$7, {
                        name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
                        "data-slot": "itemTrailingIcon",
                        class: ui.value.itemTrailingIcon({ class: [(_c3 = unref(props).ui) == null ? void 0 : _c3.itemTrailingIcon, isSelectItem(item) && ((_d3 = item.ui) == null ? void 0 : _d3.itemTrailingIcon)] })
                      }, null, 8, ["name", "class"])];
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</span>`);
                }, _push3, _parent3, _scopeId2);
                else return [renderSlot(_ctx.$slots, "item", {
                  item,
                  index,
                  ui: ui.value
                }, () => {
                  var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
                  return [
                    renderSlot(_ctx.$slots, "item-leading", {
                      item,
                      index,
                      ui: ui.value
                    }, () => {
                      var _a3, _b3, _c3, _d3, _e3, _f3, _g3, _h3, _i2, _j2;
                      return [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$7, {
                        key: 0,
                        name: item.icon,
                        "data-slot": "itemLeadingIcon",
                        class: ui.value.itemLeadingIcon({ class: [(_a3 = unref(props).ui) == null ? void 0 : _a3.itemLeadingIcon, (_b3 = item.ui) == null ? void 0 : _b3.itemLeadingIcon] })
                      }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                        key: 1,
                        size: ((_c3 = item.ui) == null ? void 0 : _c3.itemLeadingAvatarSize) || ((_d3 = unref(props).ui) == null ? void 0 : _d3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                      }, item.avatar, {
                        "data-slot": "itemLeadingAvatar",
                        class: ui.value.itemLeadingAvatar({ class: [(_e3 = unref(props).ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                      }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$6, mergeProps({
                        key: 2,
                        size: ((_g3 = item.ui) == null ? void 0 : _g3.itemLeadingChipSize) || ((_h3 = unref(props).ui) == null ? void 0 : _h3.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                        inset: "",
                        standalone: ""
                      }, item.chip, {
                        "data-slot": "itemLeadingChip",
                        class: ui.value.itemLeadingChip({ class: [(_i2 = unref(props).ui) == null ? void 0 : _i2.itemLeadingChip, (_j2 = item.ui) == null ? void 0 : _j2.itemLeadingChip] })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
                    }),
                    createVNode("span", {
                      "data-slot": "itemWrapper",
                      class: ui.value.itemWrapper({ class: [(_a2 = unref(props).ui) == null ? void 0 : _a2.itemWrapper, isSelectItem(item) && ((_b2 = item.ui) == null ? void 0 : _b2.itemWrapper)] })
                    }, [createVNode("span", {
                      "data-slot": "itemLabel",
                      class: ui.value.itemLabel({ class: [(_c2 = unref(props).ui) == null ? void 0 : _c2.itemLabel, isSelectItem(item) && ((_d2 = item.ui) == null ? void 0 : _d2.itemLabel)] })
                    }, [renderSlot(_ctx.$slots, "item-label", {
                      item,
                      index
                    }, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])], 2), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "itemDescription",
                      class: ui.value.itemDescription({ class: [(_e2 = unref(props).ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                    }, [renderSlot(_ctx.$slots, "item-description", {
                      item,
                      index
                    }, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
                    createVNode("span", {
                      "data-slot": "itemTrailing",
                      class: ui.value.itemTrailing({ class: [(_g2 = unref(props).ui) == null ? void 0 : _g2.itemTrailing, isSelectItem(item) && ((_h2 = item.ui) == null ? void 0 : _h2.itemTrailing)] })
                    }, [renderSlot(_ctx.$slots, "item-trailing", {
                      item,
                      index,
                      ui: ui.value
                    }), createVNode(unref(ComboboxItemIndicator_default), { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a3, _b3;
                        return [createVNode(_sfc_main$7, {
                          name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
                          "data-slot": "itemTrailingIcon",
                          class: ui.value.itemTrailingIcon({ class: [(_a3 = unref(props).ui) == null ? void 0 : _a3.itemTrailingIcon, isSelectItem(item) && ((_b3 = item.ui) == null ? void 0 : _b3.itemTrailingIcon)] })
                        }, null, 8, ["name", "class"])];
                      }),
                      _: 2
                    }, 1024)], 2)
                  ];
                })];
              }),
              _: 2
            }, _parent2, _scopeId));
          } else return [isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(ComboboxLabel_default), {
            key: 0,
            "data-slot": "label",
            class: ui.value.label({ class: [
              (_g = unref(props).ui) == null ? void 0 : _g.label,
              (_h = item.ui) == null ? void 0 : _h.label,
              item.class
            ] })
          }, {
            default: withCtx(() => [createTextVNode(toDisplayString(unref(get)(item, unref(props).labelKey)), 1)]),
            _: 2
          }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(ComboboxSeparator_default), {
            key: 1,
            "data-slot": "separator",
            class: ui.value.separator({ class: [
              (_i = unref(props).ui) == null ? void 0 : _i.separator,
              (_j = item.ui) == null ? void 0 : _j.separator,
              item.class
            ] })
          }, null, 8, ["class"])) : (openBlock(), createBlock(unref(ComboboxItem_default), {
            key: 2,
            "data-slot": "item",
            class: ui.value.item({ class: [
              (_k = unref(props).ui) == null ? void 0 : _k.item,
              isSelectItem(item) && ((_l = item.ui) == null ? void 0 : _l.item),
              isSelectItem(item) && item.class
            ] }),
            disabled: isSelectItem(item) && item.disabled,
            value: unref(props).valueKey && isSelectItem(item) ? unref(get)(item, unref(props).valueKey) : item,
            onSelect: ($event) => onSelect($event, item)
          }, {
            default: withCtx(() => [renderSlot(_ctx.$slots, "item", {
              item,
              index,
              ui: ui.value
            }, () => {
              var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
              return [
                renderSlot(_ctx.$slots, "item-leading", {
                  item,
                  index,
                  ui: ui.value
                }, () => {
                  var _a3, _b3, _c3, _d3, _e3, _f3, _g3, _h3, _i2, _j2;
                  return [isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$7, {
                    key: 0,
                    name: item.icon,
                    "data-slot": "itemLeadingIcon",
                    class: ui.value.itemLeadingIcon({ class: [(_a3 = unref(props).ui) == null ? void 0 : _a3.itemLeadingIcon, (_b3 = item.ui) == null ? void 0 : _b3.itemLeadingIcon] })
                  }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                    key: 1,
                    size: ((_c3 = item.ui) == null ? void 0 : _c3.itemLeadingAvatarSize) || ((_d3 = unref(props).ui) == null ? void 0 : _d3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                  }, item.avatar, {
                    "data-slot": "itemLeadingAvatar",
                    class: ui.value.itemLeadingAvatar({ class: [(_e3 = unref(props).ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                  }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$6, mergeProps({
                    key: 2,
                    size: ((_g3 = item.ui) == null ? void 0 : _g3.itemLeadingChipSize) || ((_h3 = unref(props).ui) == null ? void 0 : _h3.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                    inset: "",
                    standalone: ""
                  }, item.chip, {
                    "data-slot": "itemLeadingChip",
                    class: ui.value.itemLeadingChip({ class: [(_i2 = unref(props).ui) == null ? void 0 : _i2.itemLeadingChip, (_j2 = item.ui) == null ? void 0 : _j2.itemLeadingChip] })
                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
                }),
                createVNode("span", {
                  "data-slot": "itemWrapper",
                  class: ui.value.itemWrapper({ class: [(_a2 = unref(props).ui) == null ? void 0 : _a2.itemWrapper, isSelectItem(item) && ((_b2 = item.ui) == null ? void 0 : _b2.itemWrapper)] })
                }, [createVNode("span", {
                  "data-slot": "itemLabel",
                  class: ui.value.itemLabel({ class: [(_c2 = unref(props).ui) == null ? void 0 : _c2.itemLabel, isSelectItem(item) && ((_d2 = item.ui) == null ? void 0 : _d2.itemLabel)] })
                }, [renderSlot(_ctx.$slots, "item-label", {
                  item,
                  index
                }, () => [createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, unref(props).labelKey) : item), 1)])], 2), isSelectItem(item) && (unref(get)(item, unref(props).descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                  key: 0,
                  "data-slot": "itemDescription",
                  class: ui.value.itemDescription({ class: [(_e2 = unref(props).ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                }, [renderSlot(_ctx.$slots, "item-description", {
                  item,
                  index
                }, () => [createTextVNode(toDisplayString(unref(get)(item, unref(props).descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2),
                createVNode("span", {
                  "data-slot": "itemTrailing",
                  class: ui.value.itemTrailing({ class: [(_g2 = unref(props).ui) == null ? void 0 : _g2.itemTrailing, isSelectItem(item) && ((_h2 = item.ui) == null ? void 0 : _h2.itemTrailing)] })
                }, [renderSlot(_ctx.$slots, "item-trailing", {
                  item,
                  index,
                  ui: ui.value
                }), createVNode(unref(ComboboxItemIndicator_default), { "as-child": "" }, {
                  default: withCtx(() => {
                    var _a3, _b3;
                    return [createVNode(_sfc_main$7, {
                      name: unref(props).selectedIcon || unref(appConfig).ui.icons.check,
                      "data-slot": "itemTrailingIcon",
                      class: ui.value.itemTrailingIcon({ class: [(_a3 = unref(props).ui) == null ? void 0 : _a3.itemTrailingIcon, isSelectItem(item) && ((_b3 = item.ui) == null ? void 0 : _b3.itemTrailingIcon)] })
                    }, null, 8, ["name", "class"])];
                  }),
                  _: 2
                }, 1024)], 2)
              ];
            })]),
            _: 2
          }, 1032, [
            "class",
            "disabled",
            "value",
            "onSelect"
          ]))];
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(unref(ComboboxRoot_default), mergeProps({
        ref_key: "comboboxRootRef",
        ref: comboboxRootRef
      }, unref(rootProps), {
        "ignore-filter": "",
        "as-child": "",
        name: unref(name),
        disabled: unref(disabled),
        "onUpdate:modelValue": onUpdate,
        "onUpdate:open": onUpdateOpen
      }), {
        default: withCtx(({ modelValue, open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ComboboxAnchor_default), { "as-child": "" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b;
                if (_push3) _push3(ssrRenderComponent(unref(ComboboxTrigger_default), mergeProps({
                  id: unref(id),
                  ref_key: "triggerRef",
                  ref: triggerRef,
                  "data-slot": "base",
                  class: ui.value.base({ class: [(_a = unref(props).ui) == null ? void 0 : _a.base, unref(props).class] }),
                  tabindex: "0"
                }, {
                  ..._ctx.$attrs,
                  ...unref(ariaAttrs)
                }), {
                  default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                    var _a2, _b2, _c, _d;
                    if (_push4) {
                      if (unref(isLeading) || !!unref(props).avatar || !!slots.leading) {
                        _push4(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.leading }))}"${_scopeId3}>`);
                        ssrRenderSlot(_ctx.$slots, "leading", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => {
                          var _a3, _b3, _c2;
                          if (unref(isLeading) && unref(leadingIconName)) _push4(ssrRenderComponent(_sfc_main$7, {
                            name: unref(leadingIconName),
                            "data-slot": "leadingIcon",
                            class: ui.value.leadingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.leadingIcon })
                          }, null, _parent4, _scopeId3));
                          else if (!!unref(props).avatar) _push4(ssrRenderComponent(_sfc_main$5, mergeProps({ size: ((_b3 = unref(props).ui) == null ? void 0 : _b3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize() }, unref(props).avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.itemLeadingAvatar })
                          }), null, _parent4, _scopeId3));
                          else _push4(`<!---->`);
                        }, _push4, _parent4, _scopeId3);
                        _push4(`</span>`);
                      } else _push4(`<!---->`);
                      ssrRenderSlot(_ctx.$slots, "default", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        _push4(`<!--[-->`);
                        ssrRenderList([displayValue(modelValue)], (displayedModelValue) => {
                          var _a3, _b3, _c2;
                          _push4(`<!--[-->`);
                          if (displayedModelValue !== void 0 && displayedModelValue !== null) _push4(`<span data-slot="value" class="${ssrRenderClass(ui.value.value({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.value }))}"${_scopeId3}>${ssrInterpolate(displayedModelValue)}</span>`);
                          else _push4(`<span data-slot="placeholder" class="${ssrRenderClass(ui.value.placeholder({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.placeholder }))}"${_scopeId3}>${ssrInterpolate((_c2 = unref(props).placeholder) != null ? _c2 : "\xA0")}</span>`);
                          _push4(`<!--]-->`);
                        });
                        _push4(`<!--]-->`);
                      }, _push4, _parent4, _scopeId3);
                      if (unref(isTrailing) || !!slots.trailing || !!unref(props).clear) {
                        _push4(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.trailing }))}"${_scopeId3}>`);
                        ssrRenderSlot(_ctx.$slots, "trailing", {
                          modelValue,
                          open,
                          ui: ui.value
                        }, () => {
                          var _a3;
                          if (!!unref(props).clear && !isModelValueEmpty(modelValue)) _push4(ssrRenderComponent(unref(ComboboxCancel_default), { "as-child": "" }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              var _a4, _b3;
                              if (_push5) _push5(ssrRenderComponent(_sfc_main$2, mergeProps({
                                as: "span",
                                icon: unref(props).clearIcon || unref(appConfig).ui.icons.close,
                                size: selectSize.value,
                                variant: "link",
                                color: "neutral",
                                tabindex: "-1"
                              }, clearProps.value, {
                                "data-slot": "trailingClear",
                                class: ui.value.trailingClear({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.trailingClear }),
                                onClick: onClear
                              }), null, _parent5, _scopeId4));
                              else return [createVNode(_sfc_main$2, mergeProps({
                                as: "span",
                                icon: unref(props).clearIcon || unref(appConfig).ui.icons.close,
                                size: selectSize.value,
                                variant: "link",
                                color: "neutral",
                                tabindex: "-1"
                              }, clearProps.value, {
                                "data-slot": "trailingClear",
                                class: ui.value.trailingClear({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.trailingClear }),
                                onClick: withModifiers(onClear, ["stop"])
                              }), null, 16, [
                                "icon",
                                "size",
                                "class"
                              ])];
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          else if (unref(trailingIconName)) _push4(ssrRenderComponent(_sfc_main$7, {
                            name: unref(trailingIconName),
                            "data-slot": "trailingIcon",
                            class: ui.value.trailingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.trailingIcon })
                          }, null, _parent4, _scopeId3));
                          else _push4(`<!---->`);
                        }, _push4, _parent4, _scopeId3);
                        _push4(`</span>`);
                      } else _push4(`<!---->`);
                    } else return [
                      unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                        key: 0,
                        "data-slot": "leading",
                        class: ui.value.leading({ class: (_c = unref(props).ui) == null ? void 0 : _c.leading })
                      }, [renderSlot(_ctx.$slots, "leading", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a3, _b3, _c2;
                        return [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                          key: 0,
                          name: unref(leadingIconName),
                          "data-slot": "leadingIcon",
                          class: ui.value.leadingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.leadingIcon })
                        }, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                          key: 1,
                          size: ((_b3 = unref(props).ui) == null ? void 0 : _b3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                        }, unref(props).avatar, {
                          "data-slot": "itemLeadingAvatar",
                          class: ui.value.itemLeadingAvatar({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.itemLeadingAvatar })
                        }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
                      })], 2)) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "default", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => [(openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                        var _a3, _b3, _c2;
                        return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                          key: 0,
                          "data-slot": "value",
                          class: ui.value.value({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.value })
                        }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                          key: 1,
                          "data-slot": "placeholder",
                          class: ui.value.placeholder({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.placeholder })
                        }, toDisplayString((_c2 = unref(props).placeholder) != null ? _c2 : "\xA0"), 3))], 64);
                      }), 128))]),
                      unref(isTrailing) || !!slots.trailing || !!unref(props).clear ? (openBlock(), createBlock("span", {
                        key: 1,
                        "data-slot": "trailing",
                        class: ui.value.trailing({ class: (_d = unref(props).ui) == null ? void 0 : _d.trailing })
                      }, [renderSlot(_ctx.$slots, "trailing", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a3;
                        return [!!unref(props).clear && !isModelValueEmpty(modelValue) ? (openBlock(), createBlock(unref(ComboboxCancel_default), {
                          key: 0,
                          "as-child": ""
                        }, {
                          default: withCtx(() => {
                            var _a4;
                            return [createVNode(_sfc_main$2, mergeProps({
                              as: "span",
                              icon: unref(props).clearIcon || unref(appConfig).ui.icons.close,
                              size: selectSize.value,
                              variant: "link",
                              color: "neutral",
                              tabindex: "-1"
                            }, clearProps.value, {
                              "data-slot": "trailingClear",
                              class: ui.value.trailingClear({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.trailingClear }),
                              onClick: withModifiers(onClear, ["stop"])
                            }), null, 16, [
                              "icon",
                              "size",
                              "class"
                            ])];
                          }),
                          _: 1
                        })) : unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                          key: 1,
                          name: unref(trailingIconName),
                          "data-slot": "trailingIcon",
                          class: ui.value.trailingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.trailingIcon })
                        }, null, 8, ["name", "class"])) : createCommentVNode("", true)];
                      })], 2)) : createCommentVNode("", true)
                    ];
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                else return [createVNode(unref(ComboboxTrigger_default), mergeProps({
                  id: unref(id),
                  ref_key: "triggerRef",
                  ref: triggerRef,
                  "data-slot": "base",
                  class: ui.value.base({ class: [(_b = unref(props).ui) == null ? void 0 : _b.base, unref(props).class] }),
                  tabindex: "0"
                }, {
                  ..._ctx.$attrs,
                  ...unref(ariaAttrs)
                }), {
                  default: withCtx(() => {
                    var _a2, _b2;
                    return [
                      unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                        key: 0,
                        "data-slot": "leading",
                        class: ui.value.leading({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.leading })
                      }, [renderSlot(_ctx.$slots, "leading", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a3, _b3, _c;
                        return [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                          key: 0,
                          name: unref(leadingIconName),
                          "data-slot": "leadingIcon",
                          class: ui.value.leadingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.leadingIcon })
                        }, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                          key: 1,
                          size: ((_b3 = unref(props).ui) == null ? void 0 : _b3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                        }, unref(props).avatar, {
                          "data-slot": "itemLeadingAvatar",
                          class: ui.value.itemLeadingAvatar({ class: (_c = unref(props).ui) == null ? void 0 : _c.itemLeadingAvatar })
                        }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
                      })], 2)) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "default", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => [(openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                        var _a3, _b3, _c;
                        return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                          key: 0,
                          "data-slot": "value",
                          class: ui.value.value({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.value })
                        }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                          key: 1,
                          "data-slot": "placeholder",
                          class: ui.value.placeholder({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.placeholder })
                        }, toDisplayString((_c = unref(props).placeholder) != null ? _c : "\xA0"), 3))], 64);
                      }), 128))]),
                      unref(isTrailing) || !!slots.trailing || !!unref(props).clear ? (openBlock(), createBlock("span", {
                        key: 1,
                        "data-slot": "trailing",
                        class: ui.value.trailing({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.trailing })
                      }, [renderSlot(_ctx.$slots, "trailing", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a3;
                        return [!!unref(props).clear && !isModelValueEmpty(modelValue) ? (openBlock(), createBlock(unref(ComboboxCancel_default), {
                          key: 0,
                          "as-child": ""
                        }, {
                          default: withCtx(() => {
                            var _a4;
                            return [createVNode(_sfc_main$2, mergeProps({
                              as: "span",
                              icon: unref(props).clearIcon || unref(appConfig).ui.icons.close,
                              size: selectSize.value,
                              variant: "link",
                              color: "neutral",
                              tabindex: "-1"
                            }, clearProps.value, {
                              "data-slot": "trailingClear",
                              class: ui.value.trailingClear({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.trailingClear }),
                              onClick: withModifiers(onClear, ["stop"])
                            }), null, 16, [
                              "icon",
                              "size",
                              "class"
                            ])];
                          }),
                          _: 1
                        })) : unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                          key: 1,
                          name: unref(trailingIconName),
                          "data-slot": "trailingIcon",
                          class: ui.value.trailingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.trailingIcon })
                        }, null, 8, ["name", "class"])) : createCommentVNode("", true)];
                      })], 2)) : createCommentVNode("", true)
                    ];
                  }),
                  _: 2
                }, 1040, ["id", "class"])];
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ComboboxPortal_default), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                  default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                    var _a, _b;
                    if (_push4) _push4(ssrRenderComponent(unref(ComboboxContent_default), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: (_a = unref(props).ui) == null ? void 0 : _a.content })
                    }, contentProps.value), {
                      default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                        var _a2, _b2, _c, _d;
                        if (_push5) {
                          _push5(ssrRenderComponent(unref(FocusScope_default), {
                            trapped: "",
                            "data-slot": "focusScope",
                            class: ui.value.focusScope({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.focusScope })
                          }, {
                            default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                              var _a3, _b3, _c2, _d2, _e, _f, _g, _h;
                              if (_push6) {
                                ssrRenderSlot(_ctx.$slots, "content-top", {}, null, _push6, _parent6, _scopeId5);
                                if (!!unref(props).searchInput) _push6(ssrRenderComponent(unref(ComboboxInput_default), {
                                  modelValue: searchTerm.value,
                                  "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                  "display-value": () => searchTerm.value,
                                  "as-child": ""
                                }, {
                                  default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                    var _a4, _b4, _c3, _d3;
                                    if (_push7) _push7(ssrRenderComponent(_sfc_main$3, mergeProps({
                                      autofocus: "",
                                      autocomplete: "off",
                                      size: selectSize.value
                                    }, searchInputProps.value, {
                                      "model-modifiers": { trim: (_a4 = unref(props).modelModifiers) == null ? void 0 : _a4.trim },
                                      "data-slot": "input",
                                      class: ui.value.input({ class: (_b4 = unref(props).ui) == null ? void 0 : _b4.input }),
                                      onChange: () => {
                                      }
                                    }), null, _parent7, _scopeId6));
                                    else return [createVNode(_sfc_main$3, mergeProps({
                                      autofocus: "",
                                      autocomplete: "off",
                                      size: selectSize.value
                                    }, searchInputProps.value, {
                                      "model-modifiers": { trim: (_c3 = unref(props).modelModifiers) == null ? void 0 : _c3.trim },
                                      "data-slot": "input",
                                      class: ui.value.input({ class: (_d3 = unref(props).ui) == null ? void 0 : _d3.input }),
                                      onChange: withModifiers(() => {
                                      }, ["stop"])
                                    }), null, 16, [
                                      "size",
                                      "model-modifiers",
                                      "class",
                                      "onChange"
                                    ])];
                                  }),
                                  _: 2
                                }, _parent6, _scopeId5));
                                else _push6(`<!---->`);
                                _push6(ssrRenderComponent(unref(ComboboxEmpty_default), {
                                  "data-slot": "empty",
                                  class: ui.value.empty({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.empty })
                                }, {
                                  default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                    if (_push7) ssrRenderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => {
                                      _push7(`${ssrInterpolate(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData"))}`);
                                    }, _push7, _parent7, _scopeId6);
                                    else return [renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)])];
                                  }),
                                  _: 2
                                }, _parent6, _scopeId5));
                                _push6(`<div role="presentation" data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.viewport }))}"${_scopeId5}>`);
                                if (!!unref(props).virtualize) {
                                  _push6(`<!--[-->`);
                                  if (createItem.value && createItemPosition.value === "top") _push6(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent6, _scopeId5));
                                  else _push6(`<!---->`);
                                  _push6(ssrRenderComponent(unref(ComboboxVirtualizer_default), mergeProps({
                                    options: filteredItems.value,
                                    "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, unref(props).labelKey) : String(item2)
                                  }, virtualizerProps.value), {
                                    default: withCtx(({ option: item, virtualItem }, _push7, _parent7, _scopeId6) => {
                                      if (_push7) _push7(ssrRenderComponent(unref(ReuseItemTemplate), {
                                        item,
                                        index: virtualItem.index
                                      }, null, _parent7, _scopeId6));
                                      else return [createVNode(unref(ReuseItemTemplate), {
                                        item,
                                        index: virtualItem.index
                                      }, null, 8, ["item", "index"])];
                                    }),
                                    _: 2
                                  }, _parent6, _scopeId5));
                                  if (createItem.value && createItemPosition.value === "bottom") _push6(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent6, _scopeId5));
                                  else _push6(`<!---->`);
                                  _push6(`<!--]-->`);
                                } else {
                                  _push6(`<!--[-->`);
                                  if (createItem.value && createItemPosition.value === "top") _push6(ssrRenderComponent(unref(ComboboxGroup_default), {
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.group })
                                  }, {
                                    default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                      if (_push7) _push7(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent7, _scopeId6));
                                      else return [createVNode(unref(ReuseCreateItemTemplate))];
                                    }),
                                    _: 2
                                  }, _parent6, _scopeId5));
                                  else _push6(`<!---->`);
                                  _push6(`<!--[-->`);
                                  ssrRenderList(filteredGroups.value, (group, groupIndex) => {
                                    var _a4;
                                    _push6(ssrRenderComponent(unref(ComboboxGroup_default), {
                                      key: `group-${groupIndex}`,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.group })
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(group, (item, index) => {
                                            _push7(ssrRenderComponent(unref(ReuseItemTemplate), {
                                              key: `group-${groupIndex}-${index}`,
                                              item,
                                              index
                                            }, null, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else return [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                          return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                            key: `group-${groupIndex}-${index}`,
                                            item,
                                            index
                                          }, null, 8, ["item", "index"]);
                                        }), 128))];
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  });
                                  _push6(`<!--]-->`);
                                  if (createItem.value && createItemPosition.value === "bottom") _push6(ssrRenderComponent(unref(ComboboxGroup_default), {
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_d2 = unref(props).ui) == null ? void 0 : _d2.group })
                                  }, {
                                    default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                      if (_push7) _push7(ssrRenderComponent(unref(ReuseCreateItemTemplate), null, null, _parent7, _scopeId6));
                                      else return [createVNode(unref(ReuseCreateItemTemplate))];
                                    }),
                                    _: 2
                                  }, _parent6, _scopeId5));
                                  else _push6(`<!---->`);
                                  _push6(`<!--]-->`);
                                }
                                _push6(`</div>`);
                                ssrRenderSlot(_ctx.$slots, "content-bottom", {}, null, _push6, _parent6, _scopeId5);
                              } else return [
                                renderSlot(_ctx.$slots, "content-top"),
                                !!unref(props).searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                  key: 0,
                                  modelValue: searchTerm.value,
                                  "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                  "display-value": () => searchTerm.value,
                                  "as-child": ""
                                }, {
                                  default: withCtx(() => {
                                    var _a4, _b4;
                                    return [createVNode(_sfc_main$3, mergeProps({
                                      autofocus: "",
                                      autocomplete: "off",
                                      size: selectSize.value
                                    }, searchInputProps.value, {
                                      "model-modifiers": { trim: (_a4 = unref(props).modelModifiers) == null ? void 0 : _a4.trim },
                                      "data-slot": "input",
                                      class: ui.value.input({ class: (_b4 = unref(props).ui) == null ? void 0 : _b4.input }),
                                      onChange: withModifiers(() => {
                                      }, ["stop"])
                                    }), null, 16, [
                                      "size",
                                      "model-modifiers",
                                      "class",
                                      "onChange"
                                    ])];
                                  }),
                                  _: 1
                                }, 8, [
                                  "modelValue",
                                  "onUpdate:modelValue",
                                  "display-value"
                                ])) : createCommentVNode("", true),
                                createVNode(unref(ComboboxEmpty_default), {
                                  "data-slot": "empty",
                                  class: ui.value.empty({ class: (_e = unref(props).ui) == null ? void 0 : _e.empty })
                                }, {
                                  default: withCtx(() => [renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)])]),
                                  _: 3
                                }, 8, ["class"]),
                                createVNode("div", {
                                  ref_key: "viewportRef",
                                  ref: viewportRef,
                                  role: "presentation",
                                  "data-slot": "viewport",
                                  class: ui.value.viewport({ class: (_f = unref(props).ui) == null ? void 0 : _f.viewport })
                                }, [!!unref(props).virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                  createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                  createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                    options: filteredItems.value,
                                    "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, unref(props).labelKey) : String(item2)
                                  }, virtualizerProps.value), {
                                    default: withCtx(({ option: item, virtualItem }) => [createVNode(unref(ReuseItemTemplate), {
                                      item,
                                      index: virtualItem.index
                                    }, null, 8, ["item", "index"])]),
                                    _: 1
                                  }, 16, ["options", "text-content"]),
                                  createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: 0,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_g = unref(props).ui) == null ? void 0 : _g.group })
                                  }, {
                                    default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                    _: 1
                                  }, 8, ["class"])) : createCommentVNode("", true),
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                    var _a4;
                                    return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                      key: `group-${groupIndex}`,
                                      "data-slot": "group",
                                      class: ui.value.group({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.group })
                                    }, {
                                      default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                        return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                          key: `group-${groupIndex}-${index}`,
                                          item,
                                          index
                                        }, null, 8, ["item", "index"]);
                                      }), 128))]),
                                      _: 2
                                    }, 1032, ["class"]);
                                  }), 128)),
                                  createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: 1,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_h = unref(props).ui) == null ? void 0 : _h.group })
                                  }, {
                                    default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                    _: 1
                                  }, 8, ["class"])) : createCommentVNode("", true)
                                ], 64))], 2),
                                renderSlot(_ctx.$slots, "content-bottom")
                              ];
                            }),
                            _: 2
                          }, _parent5, _scopeId4));
                          if (!!unref(props).arrow) _push5(ssrRenderComponent(unref(ComboboxArrow_default), mergeProps(arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.arrow })
                          }), null, _parent5, _scopeId4));
                          else _push5(`<!---->`);
                        } else return [createVNode(unref(FocusScope_default), {
                          trapped: "",
                          "data-slot": "focusScope",
                          class: ui.value.focusScope({ class: (_c = unref(props).ui) == null ? void 0 : _c.focusScope })
                        }, {
                          default: withCtx(() => {
                            var _a3, _b3, _c2, _d2;
                            return [
                              renderSlot(_ctx.$slots, "content-top"),
                              !!unref(props).searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                key: 0,
                                modelValue: searchTerm.value,
                                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                "display-value": () => searchTerm.value,
                                "as-child": ""
                              }, {
                                default: withCtx(() => {
                                  var _a4, _b4;
                                  return [createVNode(_sfc_main$3, mergeProps({
                                    autofocus: "",
                                    autocomplete: "off",
                                    size: selectSize.value
                                  }, searchInputProps.value, {
                                    "model-modifiers": { trim: (_a4 = unref(props).modelModifiers) == null ? void 0 : _a4.trim },
                                    "data-slot": "input",
                                    class: ui.value.input({ class: (_b4 = unref(props).ui) == null ? void 0 : _b4.input }),
                                    onChange: withModifiers(() => {
                                    }, ["stop"])
                                  }), null, 16, [
                                    "size",
                                    "model-modifiers",
                                    "class",
                                    "onChange"
                                  ])];
                                }),
                                _: 1
                              }, 8, [
                                "modelValue",
                                "onUpdate:modelValue",
                                "display-value"
                              ])) : createCommentVNode("", true),
                              createVNode(unref(ComboboxEmpty_default), {
                                "data-slot": "empty",
                                class: ui.value.empty({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.empty })
                              }, {
                                default: withCtx(() => [renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)])]),
                                _: 3
                              }, 8, ["class"]),
                              createVNode("div", {
                                ref_key: "viewportRef",
                                ref: viewportRef,
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.viewport })
                              }, [!!unref(props).virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                  options: filteredItems.value,
                                  "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, unref(props).labelKey) : String(item2)
                                }, virtualizerProps.value), {
                                  default: withCtx(({ option: item, virtualItem }) => [createVNode(unref(ReuseItemTemplate), {
                                    item,
                                    index: virtualItem.index
                                  }, null, 8, ["item", "index"])]),
                                  _: 1
                                }, 16, ["options", "text-content"]),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                  key: 0,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.group })
                                }, {
                                  default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                  var _a4;
                                  return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: `group-${groupIndex}`,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.group })
                                  }, {
                                    default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                      return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                        key: `group-${groupIndex}-${index}`,
                                        item,
                                        index
                                      }, null, 8, ["item", "index"]);
                                    }), 128))]),
                                    _: 2
                                  }, 1032, ["class"]);
                                }), 128)),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                  key: 1,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: (_d2 = unref(props).ui) == null ? void 0 : _d2.group })
                                }, {
                                  default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ], 64))], 2),
                              renderSlot(_ctx.$slots, "content-bottom")
                            ];
                          }),
                          _: 3
                        }, 8, ["class"]), !!unref(props).arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: (_d = unref(props).ui) == null ? void 0 : _d.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)];
                      }),
                      _: 2
                    }, _parent4, _scopeId3));
                    else return [createVNode(unref(ComboboxContent_default), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: (_b = unref(props).ui) == null ? void 0 : _b.content })
                    }, contentProps.value), {
                      default: withCtx(() => {
                        var _a2, _b2;
                        return [createVNode(unref(FocusScope_default), {
                          trapped: "",
                          "data-slot": "focusScope",
                          class: ui.value.focusScope({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.focusScope })
                        }, {
                          default: withCtx(() => {
                            var _a3, _b3, _c, _d;
                            return [
                              renderSlot(_ctx.$slots, "content-top"),
                              !!unref(props).searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                key: 0,
                                modelValue: searchTerm.value,
                                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                "display-value": () => searchTerm.value,
                                "as-child": ""
                              }, {
                                default: withCtx(() => {
                                  var _a4, _b4;
                                  return [createVNode(_sfc_main$3, mergeProps({
                                    autofocus: "",
                                    autocomplete: "off",
                                    size: selectSize.value
                                  }, searchInputProps.value, {
                                    "model-modifiers": { trim: (_a4 = unref(props).modelModifiers) == null ? void 0 : _a4.trim },
                                    "data-slot": "input",
                                    class: ui.value.input({ class: (_b4 = unref(props).ui) == null ? void 0 : _b4.input }),
                                    onChange: withModifiers(() => {
                                    }, ["stop"])
                                  }), null, 16, [
                                    "size",
                                    "model-modifiers",
                                    "class",
                                    "onChange"
                                  ])];
                                }),
                                _: 1
                              }, 8, [
                                "modelValue",
                                "onUpdate:modelValue",
                                "display-value"
                              ])) : createCommentVNode("", true),
                              createVNode(unref(ComboboxEmpty_default), {
                                "data-slot": "empty",
                                class: ui.value.empty({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.empty })
                              }, {
                                default: withCtx(() => [renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)])]),
                                _: 3
                              }, 8, ["class"]),
                              createVNode("div", {
                                ref_key: "viewportRef",
                                ref: viewportRef,
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.viewport })
                              }, [!!unref(props).virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                  options: filteredItems.value,
                                  "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, unref(props).labelKey) : String(item2)
                                }, virtualizerProps.value), {
                                  default: withCtx(({ option: item, virtualItem }) => [createVNode(unref(ReuseItemTemplate), {
                                    item,
                                    index: virtualItem.index
                                  }, null, 8, ["item", "index"])]),
                                  _: 1
                                }, 16, ["options", "text-content"]),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                  key: 0,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: (_c = unref(props).ui) == null ? void 0 : _c.group })
                                }, {
                                  default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                  var _a4;
                                  return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: `group-${groupIndex}`,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.group })
                                  }, {
                                    default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                      return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                        key: `group-${groupIndex}-${index}`,
                                        item,
                                        index
                                      }, null, 8, ["item", "index"]);
                                    }), 128))]),
                                    _: 2
                                  }, 1032, ["class"]);
                                }), 128)),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                  key: 1,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: (_d = unref(props).ui) == null ? void 0 : _d.group })
                                }, {
                                  default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ], 64))], 2),
                              renderSlot(_ctx.$slots, "content-bottom")
                            ];
                          }),
                          _: 3
                        }, 8, ["class"]), !!unref(props).arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)];
                      }),
                      _: 3
                    }, 16, ["class"])];
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                else return [createVNode(unref(FieldGroupReset), null, {
                  default: withCtx(() => {
                    var _a;
                    return [createVNode(unref(ComboboxContent_default), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: (_a = unref(props).ui) == null ? void 0 : _a.content })
                    }, contentProps.value), {
                      default: withCtx(() => {
                        var _a2, _b;
                        return [createVNode(unref(FocusScope_default), {
                          trapped: "",
                          "data-slot": "focusScope",
                          class: ui.value.focusScope({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.focusScope })
                        }, {
                          default: withCtx(() => {
                            var _a3, _b2, _c, _d;
                            return [
                              renderSlot(_ctx.$slots, "content-top"),
                              !!unref(props).searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                                key: 0,
                                modelValue: searchTerm.value,
                                "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                                "display-value": () => searchTerm.value,
                                "as-child": ""
                              }, {
                                default: withCtx(() => {
                                  var _a4, _b3;
                                  return [createVNode(_sfc_main$3, mergeProps({
                                    autofocus: "",
                                    autocomplete: "off",
                                    size: selectSize.value
                                  }, searchInputProps.value, {
                                    "model-modifiers": { trim: (_a4 = unref(props).modelModifiers) == null ? void 0 : _a4.trim },
                                    "data-slot": "input",
                                    class: ui.value.input({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.input }),
                                    onChange: withModifiers(() => {
                                    }, ["stop"])
                                  }), null, 16, [
                                    "size",
                                    "model-modifiers",
                                    "class",
                                    "onChange"
                                  ])];
                                }),
                                _: 1
                              }, 8, [
                                "modelValue",
                                "onUpdate:modelValue",
                                "display-value"
                              ])) : createCommentVNode("", true),
                              createVNode(unref(ComboboxEmpty_default), {
                                "data-slot": "empty",
                                class: ui.value.empty({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.empty })
                              }, {
                                default: withCtx(() => [renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)])]),
                                _: 3
                              }, 8, ["class"]),
                              createVNode("div", {
                                ref_key: "viewportRef",
                                ref: viewportRef,
                                role: "presentation",
                                "data-slot": "viewport",
                                class: ui.value.viewport({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.viewport })
                              }, [!!unref(props).virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                                createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                                  options: filteredItems.value,
                                  "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, unref(props).labelKey) : String(item2)
                                }, virtualizerProps.value), {
                                  default: withCtx(({ option: item, virtualItem }) => [createVNode(unref(ReuseItemTemplate), {
                                    item,
                                    index: virtualItem.index
                                  }, null, 8, ["item", "index"])]),
                                  _: 1
                                }, 16, ["options", "text-content"]),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                  key: 0,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: (_c = unref(props).ui) == null ? void 0 : _c.group })
                                }, {
                                  default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                                  var _a4;
                                  return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                    key: `group-${groupIndex}`,
                                    "data-slot": "group",
                                    class: ui.value.group({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.group })
                                  }, {
                                    default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                      return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                        key: `group-${groupIndex}-${index}`,
                                        item,
                                        index
                                      }, null, 8, ["item", "index"]);
                                    }), 128))]),
                                    _: 2
                                  }, 1032, ["class"]);
                                }), 128)),
                                createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                                  key: 1,
                                  "data-slot": "group",
                                  class: ui.value.group({ class: (_d = unref(props).ui) == null ? void 0 : _d.group })
                                }, {
                                  default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                                  _: 1
                                }, 8, ["class"])) : createCommentVNode("", true)
                              ], 64))], 2),
                              renderSlot(_ctx.$slots, "content-bottom")
                            ];
                          }),
                          _: 3
                        }, 8, ["class"]), !!unref(props).arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                          "data-slot": "arrow",
                          class: ui.value.arrow({ class: (_b = unref(props).ui) == null ? void 0 : _b.arrow })
                        }), null, 16, ["class"])) : createCommentVNode("", true)];
                      }),
                      _: 3
                    }, 16, ["class"])];
                  }),
                  _: 3
                })];
              }),
              _: 2
            }, _parent2, _scopeId));
          } else return [createVNode(unref(ComboboxAnchor_default), { "as-child": "" }, {
            default: withCtx(() => {
              var _a;
              return [createVNode(unref(ComboboxTrigger_default), mergeProps({
                id: unref(id),
                ref_key: "triggerRef",
                ref: triggerRef,
                "data-slot": "base",
                class: ui.value.base({ class: [(_a = unref(props).ui) == null ? void 0 : _a.base, unref(props).class] }),
                tabindex: "0"
              }, {
                ..._ctx.$attrs,
                ...unref(ariaAttrs)
              }), {
                default: withCtx(() => {
                  var _a2, _b;
                  return [
                    unref(isLeading) || !!unref(props).avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "leading",
                      class: ui.value.leading({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.leading })
                    }, [renderSlot(_ctx.$slots, "leading", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => {
                      var _a3, _b2, _c;
                      return [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                        key: 0,
                        name: unref(leadingIconName),
                        "data-slot": "leadingIcon",
                        class: ui.value.leadingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.leadingIcon })
                      }, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                        key: 1,
                        size: ((_b2 = unref(props).ui) == null ? void 0 : _b2.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                      }, unref(props).avatar, {
                        "data-slot": "itemLeadingAvatar",
                        class: ui.value.itemLeadingAvatar({ class: (_c = unref(props).ui) == null ? void 0 : _c.itemLeadingAvatar })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
                    })], 2)) : createCommentVNode("", true),
                    renderSlot(_ctx.$slots, "default", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => [(openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                      var _a3, _b2, _c;
                      return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                        key: 0,
                        "data-slot": "value",
                        class: ui.value.value({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.value })
                      }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                        key: 1,
                        "data-slot": "placeholder",
                        class: ui.value.placeholder({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.placeholder })
                      }, toDisplayString((_c = unref(props).placeholder) != null ? _c : "\xA0"), 3))], 64);
                    }), 128))]),
                    unref(isTrailing) || !!slots.trailing || !!unref(props).clear ? (openBlock(), createBlock("span", {
                      key: 1,
                      "data-slot": "trailing",
                      class: ui.value.trailing({ class: (_b = unref(props).ui) == null ? void 0 : _b.trailing })
                    }, [renderSlot(_ctx.$slots, "trailing", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => {
                      var _a3;
                      return [!!unref(props).clear && !isModelValueEmpty(modelValue) ? (openBlock(), createBlock(unref(ComboboxCancel_default), {
                        key: 0,
                        "as-child": ""
                      }, {
                        default: withCtx(() => {
                          var _a4;
                          return [createVNode(_sfc_main$2, mergeProps({
                            as: "span",
                            icon: unref(props).clearIcon || unref(appConfig).ui.icons.close,
                            size: selectSize.value,
                            variant: "link",
                            color: "neutral",
                            tabindex: "-1"
                          }, clearProps.value, {
                            "data-slot": "trailingClear",
                            class: ui.value.trailingClear({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.trailingClear }),
                            onClick: withModifiers(onClear, ["stop"])
                          }), null, 16, [
                            "icon",
                            "size",
                            "class"
                          ])];
                        }),
                        _: 1
                      })) : unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                        key: 1,
                        name: unref(trailingIconName),
                        "data-slot": "trailingIcon",
                        class: ui.value.trailingIcon({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.trailingIcon })
                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)];
                    })], 2)) : createCommentVNode("", true)
                  ];
                }),
                _: 2
              }, 1040, ["id", "class"])];
            }),
            _: 2
          }, 1024), createVNode(unref(ComboboxPortal_default), unref(portalProps), {
            default: withCtx(() => [createVNode(unref(FieldGroupReset), null, {
              default: withCtx(() => {
                var _a;
                return [createVNode(unref(ComboboxContent_default), mergeProps({
                  "data-slot": "content",
                  class: ui.value.content({ class: (_a = unref(props).ui) == null ? void 0 : _a.content })
                }, contentProps.value), {
                  default: withCtx(() => {
                    var _a2, _b;
                    return [createVNode(unref(FocusScope_default), {
                      trapped: "",
                      "data-slot": "focusScope",
                      class: ui.value.focusScope({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.focusScope })
                    }, {
                      default: withCtx(() => {
                        var _a3, _b2, _c, _d;
                        return [
                          renderSlot(_ctx.$slots, "content-top"),
                          !!unref(props).searchInput ? (openBlock(), createBlock(unref(ComboboxInput_default), {
                            key: 0,
                            modelValue: searchTerm.value,
                            "onUpdate:modelValue": ($event) => searchTerm.value = $event,
                            "display-value": () => searchTerm.value,
                            "as-child": ""
                          }, {
                            default: withCtx(() => {
                              var _a4, _b3;
                              return [createVNode(_sfc_main$3, mergeProps({
                                autofocus: "",
                                autocomplete: "off",
                                size: selectSize.value
                              }, searchInputProps.value, {
                                "model-modifiers": { trim: (_a4 = unref(props).modelModifiers) == null ? void 0 : _a4.trim },
                                "data-slot": "input",
                                class: ui.value.input({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.input }),
                                onChange: withModifiers(() => {
                                }, ["stop"])
                              }), null, 16, [
                                "size",
                                "model-modifiers",
                                "class",
                                "onChange"
                              ])];
                            }),
                            _: 1
                          }, 8, [
                            "modelValue",
                            "onUpdate:modelValue",
                            "display-value"
                          ])) : createCommentVNode("", true),
                          createVNode(unref(ComboboxEmpty_default), {
                            "data-slot": "empty",
                            class: ui.value.empty({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.empty })
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [createTextVNode(toDisplayString(searchTerm.value ? unref(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : unref(t)("selectMenu.noData")), 1)])]),
                            _: 3
                          }, 8, ["class"]),
                          createVNode("div", {
                            ref_key: "viewportRef",
                            ref: viewportRef,
                            role: "presentation",
                            "data-slot": "viewport",
                            class: ui.value.viewport({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.viewport })
                          }, [!!unref(props).virtualize ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 0 })) : createCommentVNode("", true),
                            createVNode(unref(ComboboxVirtualizer_default), mergeProps({
                              options: filteredItems.value,
                              "text-content": (item2) => isSelectItem(item2) ? unref(get)(item2, unref(props).labelKey) : String(item2)
                            }, virtualizerProps.value), {
                              default: withCtx(({ option: item, virtualItem }) => [createVNode(unref(ReuseItemTemplate), {
                                item,
                                index: virtualItem.index
                              }, null, 8, ["item", "index"])]),
                              _: 1
                            }, 16, ["options", "text-content"]),
                            createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ReuseCreateItemTemplate), { key: 1 })) : createCommentVNode("", true)
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createItem.value && createItemPosition.value === "top" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                              key: 0,
                              "data-slot": "group",
                              class: ui.value.group({ class: (_c = unref(props).ui) == null ? void 0 : _c.group })
                            }, {
                              default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                              _: 1
                            }, 8, ["class"])) : createCommentVNode("", true),
                            (openBlock(true), createBlock(Fragment, null, renderList(filteredGroups.value, (group, groupIndex) => {
                              var _a4;
                              return openBlock(), createBlock(unref(ComboboxGroup_default), {
                                key: `group-${groupIndex}`,
                                "data-slot": "group",
                                class: ui.value.group({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.group })
                              }, {
                                default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                  return openBlock(), createBlock(unref(ReuseItemTemplate), {
                                    key: `group-${groupIndex}-${index}`,
                                    item,
                                    index
                                  }, null, 8, ["item", "index"]);
                                }), 128))]),
                                _: 2
                              }, 1032, ["class"]);
                            }), 128)),
                            createItem.value && createItemPosition.value === "bottom" ? (openBlock(), createBlock(unref(ComboboxGroup_default), {
                              key: 1,
                              "data-slot": "group",
                              class: ui.value.group({ class: (_d = unref(props).ui) == null ? void 0 : _d.group })
                            }, {
                              default: withCtx(() => [createVNode(unref(ReuseCreateItemTemplate))]),
                              _: 1
                            }, 8, ["class"])) : createCommentVNode("", true)
                          ], 64))], 2),
                          renderSlot(_ctx.$slots, "content-bottom")
                        ];
                      }),
                      _: 3
                    }, 8, ["class"]), !!unref(props).arrow ? (openBlock(), createBlock(unref(ComboboxArrow_default), mergeProps({ key: 0 }, arrowProps.value, {
                      "data-slot": "arrow",
                      class: ui.value.arrow({ class: (_b = unref(props).ui) == null ? void 0 : _b.arrow })
                    }), null, 16, ["class"])) : createCommentVNode("", true)];
                  }),
                  _: 3
                }, 16, ["class"])];
              }),
              _: 3
            })]),
            _: 3
          }, 16)];
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var virtual_nuxt__nuxt_2Fui_2Fbadge_default = {
  "slots": {
    "base": "font-medium inline-flex items-center",
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
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
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "xs": {
        "base": "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "sm": {
        "base": "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
        "leadingIcon": "size-3",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-3"
      },
      "md": {
        "base": "text-xs px-2 py-1 gap-1 rounded-md",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "lg": {
        "base": "text-sm px-2 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "text-base px-2.5 py-1 gap-1.5 rounded-md",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-6"
      }
    },
    "square": { "true": "" }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "bg-primary text-inverted"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "bg-secondary text-inverted"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "bg-success text-inverted"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "bg-info text-inverted"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "bg-warning text-inverted"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "bg-error text-inverted"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "text-primary ring ring-inset ring-primary/50"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "text-secondary ring ring-inset ring-secondary/50"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "text-success ring ring-inset ring-success/50"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "text-info ring ring-inset ring-info/50"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "text-warning ring ring-inset ring-warning/50"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "text-error ring ring-inset ring-error/50"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "bg-primary/10 text-primary"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "bg-secondary/10 text-secondary"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "bg-success/10 text-success"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "bg-info/10 text-info"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "bg-warning/10 text-warning"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "bg-error/10 text-error"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "bg-primary/10 text-primary ring ring-inset ring-primary/25"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "bg-success/10 text-success ring ring-inset ring-success/25"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "bg-info/10 text-info ring ring-inset ring-info/25"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "bg-warning/10 text-warning ring ring-inset ring-warning/25"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "bg-error/10 text-error ring ring-inset ring-error/25"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated"
    },
    {
      "size": "xs",
      "square": true,
      "class": "p-0.5"
    },
    {
      "size": "sm",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "md",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "lg",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "xl",
      "square": true,
      "class": "p-1"
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid",
    "size": "md"
  }
};
var _sfc_main = {
  __name: "UBadge",
  __ssrInlineRender: true,
  props: {
    as: {
      type: null,
      required: false,
      default: "span"
    },
    label: {
      type: [String, Number],
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
    square: {
      type: Boolean,
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
    }
  },
  setup(__props) {
    const _props = __props;
    const slots = useSlots();
    const props = useComponentProps("badge", _props);
    const appConfig = useAppConfig();
    const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
    const ui = computed(() => {
      var _a, _b;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Fbadge_default,
        ...((_a = appConfig.ui) == null ? void 0 : _a.badge) || {}
      })({
        color: props.color,
        variant: props.variant,
        size: (_b = fieldGroupSize.value) != null ? _b : props.size,
        square: props.square || !slots.default && !props.label,
        fieldGroup: orientation.value
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: unref(props).as,
        "data-slot": "base",
        class: ui.value.base({ class: [(_a = unref(props).ui) == null ? void 0 : _a.base, unref(props).class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
              var _a2, _b, _c;
              if (unref(isLeading) && unref(leadingIconName)) _push2(ssrRenderComponent(_sfc_main$7, {
                name: unref(leadingIconName),
                "data-slot": "leadingIcon",
                class: ui.value.leadingIcon({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.leadingIcon })
              }, null, _parent2, _scopeId));
              else if (!!unref(props).avatar) _push2(ssrRenderComponent(_sfc_main$5, mergeProps({ size: ((_b = unref(props).ui) == null ? void 0 : _b.leadingAvatarSize) || ui.value.leadingAvatarSize() }, unref(props).avatar, {
                "data-slot": "leadingAvatar",
                class: ui.value.leadingAvatar({ class: (_c = unref(props).ui) == null ? void 0 : _c.leadingAvatar })
              }), null, _parent2, _scopeId));
              else _push2(`<!---->`);
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
              var _a2;
              if (unref(props).label !== void 0 && unref(props).label !== null) _push2(`<span data-slot="label" class="${ssrRenderClass(ui.value.label({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.label }))}"${_scopeId}>${ssrInterpolate(unref(props).label)}</span>`);
              else _push2(`<!---->`);
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
              var _a2;
              if (unref(isTrailing) && unref(trailingIconName)) _push2(ssrRenderComponent(_sfc_main$7, {
                name: unref(trailingIconName),
                "data-slot": "trailingIcon",
                class: ui.value.trailingIcon({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.trailingIcon })
              }, null, _parent2, _scopeId));
              else _push2(`<!---->`);
            }, _push2, _parent2, _scopeId);
          } else return [
            renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
              var _a2, _b, _c;
              return [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                key: 0,
                name: unref(leadingIconName),
                "data-slot": "leadingIcon",
                class: ui.value.leadingIcon({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.leadingIcon })
              }, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
                key: 1,
                size: ((_b = unref(props).ui) == null ? void 0 : _b.leadingAvatarSize) || ui.value.leadingAvatarSize()
              }, unref(props).avatar, {
                "data-slot": "leadingAvatar",
                class: ui.value.leadingAvatar({ class: (_c = unref(props).ui) == null ? void 0 : _c.leadingAvatar })
              }), null, 16, ["size", "class"])) : createCommentVNode("", true)];
            }),
            renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
              var _a2;
              return [unref(props).label !== void 0 && unref(props).label !== null ? (openBlock(), createBlock("span", {
                key: 0,
                "data-slot": "label",
                class: ui.value.label({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.label })
              }, toDisplayString(unref(props).label), 3)) : createCommentVNode("", true)];
            }),
            renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
              var _a2;
              return [unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
                key: 0,
                name: unref(trailingIconName),
                "data-slot": "trailingIcon",
                class: ui.value.trailingIcon({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.trailingIcon })
              }, null, 8, ["name", "class"])) : createCommentVNode("", true)];
            })
          ];
        }),
        _: 3
      }, _parent));
    };
  }
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Badge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { ENTRY_FOCUS as E, VisuallyHiddenInput_default as V, _sfc_main as _, _sfc_main$1 as a, useFormControl as b, useCollection as c, EVENT_OPTIONS as d, focusFirst as f, getFocusIntent as g, useDirection as u, wrapArray as w };
//# sourceMappingURL=Badge--gAvyuw3.mjs.map
