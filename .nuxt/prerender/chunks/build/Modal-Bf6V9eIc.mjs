import { a as useLocale, b as usePortal, V as VisuallyHidden_default, P as Presence_default, u as useId$1, T as Teleport_default, d as useHideOthers, c as useBodyScrollLock, F as FocusScope_default, D as DismissableLayer_default } from './usePortal-CFE28n6Q.mjs';
import { u as useForwardExpose } from './useForwardExpose-lTVrimVg.mjs';
import { g as useComponentProps, h as useAppConfig, i as useForwardProps, t as tv, c as _sfc_main$2, F as FieldGroupReset, D as useEmitAsProps, P as Primitive, s as createContext } from '../virtual/entry.mjs';
import { useSlots, toRef, computed, unref, mergeProps, withCtx, toHandlers, renderSlot, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, createVNode, Fragment, defineComponent, ref, toRefs, withDirectives, vShow, normalizeProps, guardReactiveProps, watch, withModifiers, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderClass } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import { reactivePick, createReusableTemplate, useVModel } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';

var [injectDialogRootContext, provideDialogRootContext] = /* @__PURE__ */ createContext("DialogRoot");
var DialogRoot_default = /* @__PURE__ */ defineComponent({
  inheritAttrs: false,
  __name: "DialogRoot",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    modal: {
      type: Boolean,
      required: false,
      default: true
    },
    unmountOnHide: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const open = useVModel(props, "open", __emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === void 0
    });
    const triggerElement = ref();
    const contentElement = ref();
    const { modal, unmountOnHide } = toRefs(props);
    provideDialogRootContext({
      open,
      modal,
      unmountOnHide,
      openModal: () => {
        open.value = true;
      },
      onOpenChange: (value) => {
        open.value = value;
      },
      onOpenToggle: () => {
        open.value = !open.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement,
      contentElement
    });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default", {
        open: unref(open),
        close: () => open.value = false
      });
    };
  }
});
var DialogClose_default = /* @__PURE__ */ defineComponent({
  __name: "DialogClose",
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
    const rootContext = injectDialogRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        type: _ctx.as === "button" ? "button" : void 0,
        onClick: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false))
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["type"]);
    };
  }
});
function getOpenState(open) {
  return open ? "open" : "closed";
}
var DialogContentImpl_default = /* @__PURE__ */ defineComponent({
  __name: "DialogContentImpl",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
    },
    present: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const { forwardRef} = useForwardExpose();
    rootContext.titleId || (rootContext.titleId = useId$1(void 0, "reka-dialog-title"));
    rootContext.descriptionId || (rootContext.descriptionId = useId$1(void 0, "reka-dialog-description"));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(FocusScope_default), {
        "as-child": "",
        loop: "",
        trapped: props.trapFocus,
        present: props.present,
        onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
        onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
      }, {
        default: withCtx(() => [createVNode(unref(DismissableLayer_default), mergeProps({
          id: unref(rootContext).contentId,
          ref: unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          present: props.present,
          "disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
          role: "dialog",
          "aria-describedby": unref(rootContext).descriptionId,
          "aria-labelledby": unref(rootContext).titleId,
          "data-state": unref(getOpenState)(unref(rootContext).open.value)
        }, _ctx.$attrs, {
          onDismiss: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false)),
          onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
          onFocusOutside: _cache[2] || (_cache[2] = ($event) => emits("focusOutside", $event)),
          onInteractOutside: _cache[3] || (_cache[3] = ($event) => emits("interactOutside", $event)),
          onPointerDownOutside: _cache[4] || (_cache[4] = ($event) => emits("pointerDownOutside", $event))
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16, [
          "id",
          "as",
          "as-child",
          "present",
          "disable-outside-pointer-events",
          "aria-describedby",
          "aria-labelledby",
          "data-state"
        ])]),
        _: 3
      }, 8, ["trapped", "present"]);
    };
  }
});
var DialogContentModal_default = /* @__PURE__ */ defineComponent({
  __name: "DialogContentModal",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
    present: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const emitsAsProps = useEmitAsProps(emits);
    const { forwardRef, currentElement } = useForwardExpose();
    const ariaHiddenTarget = computed(() => props.present ? currentElement.value : void 0);
    useHideOthers(ariaHiddenTarget);
    const forwardedProps = computed(() => {
      const { present: _, ...rest } = props;
      return rest;
    });
    watch(() => props.present, (isPresent, wasPresent) => {
      var _a;
      if (!isPresent && wasPresent) (_a = rootContext.triggerElement.value) == null ? void 0 : _a.focus();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(DialogContentImpl_default, mergeProps({
        ...forwardedProps.value,
        ...unref(emitsAsProps)
      }, {
        ref: unref(forwardRef),
        present: _ctx.present,
        "trap-focus": unref(rootContext).open.value,
        "disable-outside-pointer-events": props.disableOutsidePointerEvents,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          var _a;
          if (!event.defaultPrevented) {
            event.preventDefault();
            (_a = unref(rootContext).triggerElement.value) == null ? void 0 : _a.focus();
          }
        }),
        onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
        }),
        onFocusOutside: _cache[2] || (_cache[2] = (event) => {
          event.preventDefault();
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "present",
        "trap-focus",
        "disable-outside-pointer-events"
      ]);
    };
  }
});
var DialogContentNonModal_default = /* @__PURE__ */ defineComponent({
  __name: "DialogContentNonModal",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    trapFocus: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
    },
    present: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emitsAsProps = useEmitAsProps(__emit);
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    const hasInteractedOutsideRef = ref(false);
    const hasPointerDownOutsideRef = ref(false);
    const forwardedProps = computed(() => {
      const { present: _, ...rest } = props;
      return rest;
    });
    watch(() => props.present, (isPresent, wasPresent) => {
      var _a;
      if (!isPresent && wasPresent) {
        if (!hasInteractedOutsideRef.value) (_a = rootContext.triggerElement.value) == null ? void 0 : _a.focus();
        hasInteractedOutsideRef.value = false;
        hasPointerDownOutsideRef.value = false;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(DialogContentImpl_default, mergeProps({
        ...forwardedProps.value,
        ...unref(emitsAsProps)
      }, {
        present: _ctx.present,
        "trap-focus": false,
        "disable-outside-pointer-events": false,
        onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
          var _a;
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.value) (_a = unref(rootContext).triggerElement.value) == null ? void 0 : _a.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.value = false;
          hasPointerDownOutsideRef.value = false;
        }),
        onInteractOutside: _cache[1] || (_cache[1] = (event) => {
          var _a;
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.value = true;
            if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
          }
          const target = event.target;
          if ((_a = unref(rootContext).triggerElement.value) == null ? void 0 : _a.contains(target)) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
        })
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["present"]);
    };
  }
});
var DialogContent_default = /* @__PURE__ */ defineComponent({
  __name: "DialogContent",
  props: {
    forceMount: {
      type: Boolean,
      required: false
    },
    disableOutsidePointerEvents: {
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
      required: false
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const rootContext = injectDialogRootContext();
    const emitsAsProps = useEmitAsProps(emits);
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Presence_default), {
        present: _ctx.forceMount || unref(rootContext).open.value,
        "force-mount": _ctx.forceMount || !unref(rootContext).unmountOnHide.value
      }, {
        default: withCtx(({ present }) => [unref(rootContext).modal.value ? withDirectives((openBlock(), createBlock(DialogContentModal_default, mergeProps({
          key: 0,
          ref: unref(forwardRef),
          present: unref(rootContext).unmountOnHide.value || present
        }, {
          ...props,
          ...unref(emitsAsProps),
          ..._ctx.$attrs
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, ["present"])), [[vShow, unref(rootContext).unmountOnHide.value || present]]) : withDirectives((openBlock(), createBlock(DialogContentNonModal_default, mergeProps({
          key: 1,
          ref: unref(forwardRef),
          present: unref(rootContext).unmountOnHide.value || present
        }, {
          ...props,
          ...unref(emitsAsProps),
          ..._ctx.$attrs
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, ["present"])), [[vShow, unref(rootContext).unmountOnHide.value || present]])]),
        _: 3
      }, 8, ["present", "force-mount"]);
    };
  }
});
var DialogDescription_default = /* @__PURE__ */ defineComponent({
  __name: "DialogDescription",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "p"
    }
  },
  setup(__props) {
    const props = __props;
    useForwardExpose();
    const rootContext = injectDialogRootContext();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(rootContext).descriptionId }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var DialogOverlayImpl_default = /* @__PURE__ */ defineComponent({
  __name: "DialogOverlayImpl",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false
    },
    present: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectDialogRootContext();
    const scrollLocked = useBodyScrollLock(props.present);
    watch(() => props.present, (val) => scrollLocked.value = val);
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), {
        as: _ctx.as,
        "as-child": _ctx.asChild,
        "data-state": unref(rootContext).open.value ? "open" : "closed",
        style: { "pointer-events": "auto" },
        onPointerdown: _cache[0] || (_cache[0] = withModifiers(() => {
        }, [
          "left",
          "self",
          "prevent"
        ]))
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "data-state"
      ]);
    };
  }
});
var DialogOverlay_default = /* @__PURE__ */ defineComponent({
  __name: "DialogOverlay",
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
      required: false
    }
  },
  setup(__props) {
    const rootContext = injectDialogRootContext();
    const { forwardRef } = useForwardExpose();
    return (_ctx, _cache) => {
      var _a;
      return ((_a = unref(rootContext)) == null ? void 0 : _a.modal.value) ? (openBlock(), createBlock(unref(Presence_default), {
        key: 0,
        present: _ctx.forceMount || unref(rootContext).open.value,
        "force-mount": _ctx.forceMount || !unref(rootContext).unmountOnHide.value
      }, {
        default: withCtx(({ present }) => [withDirectives(createVNode(DialogOverlayImpl_default, mergeProps(_ctx.$attrs, {
          ref: unref(forwardRef),
          as: _ctx.as,
          "as-child": _ctx.asChild,
          present: unref(rootContext).unmountOnHide.value || present
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 2
        }, 1040, [
          "as",
          "as-child",
          "present"
        ]), [[vShow, unref(rootContext).unmountOnHide.value || present]])]),
        _: 3
      }, 8, ["present", "force-mount"])) : createCommentVNode("v-if", true);
    };
  }
});
var DialogPortal_default = /* @__PURE__ */ defineComponent({
  __name: "DialogPortal",
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
var DialogTitle_default = /* @__PURE__ */ defineComponent({
  __name: "DialogTitle",
  props: {
    asChild: {
      type: Boolean,
      required: false
    },
    as: {
      type: null,
      required: false,
      default: "h2"
    }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectDialogRootContext();
    useForwardExpose();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(rootContext).titleId }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, ["id"]);
    };
  }
});
var DialogTrigger_default = /* @__PURE__ */ defineComponent({
  __name: "DialogTrigger",
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
    const rootContext = injectDialogRootContext();
    const { forwardRef} = useForwardExpose();
    rootContext.contentId || (rootContext.contentId = useId$1(void 0, "reka-dialog-content"));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
        ref: unref(forwardRef),
        type: _ctx.as === "button" ? "button" : void 0,
        "aria-haspopup": "dialog",
        "aria-expanded": unref(rootContext).open.value || false,
        "aria-controls": unref(rootContext).open.value ? unref(rootContext).contentId : void 0,
        "data-state": unref(rootContext).open.value ? "open" : "closed",
        onClick: unref(rootContext).onOpenToggle
      }), {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3
      }, 16, [
        "type",
        "aria-expanded",
        "aria-controls",
        "data-state",
        "onClick"
      ]);
    };
  }
});
function pointerDownOutside(e, options = {}) {
  const originalEvent = e.detail.originalEvent;
  const target = originalEvent.target;
  if (!(target == null ? void 0 : target.isConnected)) {
    e.preventDefault();
    return;
  }
  if (options.scrollable) {
    if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) e.preventDefault();
  }
}
var virtual_nuxt__nuxt_2Fui_2Fmodal_default = {
  "slots": {
    "overlay": "fixed inset-0",
    "content": "bg-default divide-y divide-default flex flex-col focus:outline-none",
    "header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
    "wrapper": "",
    "body": "flex-1 p-4 sm:p-6",
    "footer": "flex items-center gap-1.5 p-4 sm:px-6",
    "title": "text-highlighted font-semibold",
    "description": "mt-1 text-muted text-sm",
    "close": "absolute top-4 end-4"
  },
  "variants": {
    "transition": { "true": {
      "overlay": "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
      "content": "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]"
    } },
    "fullscreen": {
      "true": { "content": "inset-0" },
      "false": { "content": "w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default" }
    },
    "overlay": { "true": { "overlay": "bg-elevated/75" } },
    "scrollable": {
      "true": {
        "overlay": "overflow-y-auto",
        "content": "relative"
      },
      "false": {
        "content": "fixed",
        "body": "overflow-y-auto"
      }
    }
  },
  "compoundVariants": [{
    "scrollable": true,
    "fullscreen": false,
    "class": { "overlay": "grid place-items-center p-4 sm:py-8" }
  }, {
    "scrollable": false,
    "fullscreen": false,
    "class": { "content": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden" }
  }]
};
var _sfc_main = {
  __name: "UModal",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    content: {
      type: Object,
      required: false
    },
    overlay: {
      type: Boolean,
      required: false,
      default: true
    },
    scrollable: {
      type: Boolean,
      required: false
    },
    transition: {
      type: Boolean,
      required: false,
      default: true
    },
    fullscreen: {
      type: Boolean,
      required: false
    },
    portal: {
      type: [Boolean, String],
      required: false,
      skipCheck: true,
      default: true
    },
    close: {
      type: [Boolean, Object],
      required: false,
      default: true
    },
    closeIcon: {
      type: null,
      required: false
    },
    dismissible: {
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
    open: {
      type: Boolean,
      required: false
    },
    defaultOpen: {
      type: Boolean,
      required: false
    },
    modal: {
      type: Boolean,
      required: false,
      default: true
    },
    unmountOnHide: {
      type: Boolean,
      required: false
    }
  },
  emits: [
    "leave",
    "after:leave",
    "enter",
    "after:enter",
    "close:prevent",
    "update:open"
  ],
  setup(__props, { emit: __emit }) {
    const _props = __props;
    const emits = __emit;
    const slots = useSlots();
    const props = useComponentProps("modal", _props);
    const { t } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardProps(reactivePick(props, "open", "defaultOpen", "modal", "unmountOnHide"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => props.content);
    const contentEvents = computed(() => {
      if (!props.dismissible) return ["interactOutside", "escapeKeyDown"].reduce((acc, curr) => {
        acc[curr] = (e) => {
          e.preventDefault();
          emits("close:prevent");
        };
        return acc;
      }, {});
      return { pointerDownOutside: (e) => pointerDownOutside(e, { scrollable: props.scrollable }) };
    });
    const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
    const ui = computed(() => {
      var _a;
      return tv({
        extend: virtual_nuxt__nuxt_2Fui_2Fmodal_default,
        ...((_a = appConfig.ui) == null ? void 0 : _a.modal) || {}
      })({
        transition: props.transition,
        fullscreen: props.fullscreen,
        overlay: props.overlay,
        scrollable: props.scrollable
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot_default), mergeProps(unref(rootProps), _attrs), {
        default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DefineContentTemplate), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b;
                if (_push3) _push3(ssrRenderComponent(unref(DialogContent_default), mergeProps({
                  "data-slot": "content",
                  class: ui.value.content({ class: [!slots.default && unref(props).class, (_a = unref(props).ui) == null ? void 0 : _a.content] })
                }, contentProps.value, {
                  onEnter: ($event) => emits("enter"),
                  onAfterEnter: ($event) => emits("after:enter"),
                  onLeave: ($event) => emits("leave"),
                  onAfterLeave: ($event) => emits("after:leave")
                }, toHandlers(contentEvents.value)), {
                  default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      if (!unref(props).title && !slots.title || !unref(props).description && !slots.description || !!slots.content) _push4(ssrRenderComponent(unref(VisuallyHidden_default), null, {
                        default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                          if (_push5) {
                            if (!unref(props).title && !slots.title) _push5(ssrRenderComponent(unref(DialogTitle_default), null, null, _parent5, _scopeId4));
                            else if (!!slots.content) _push5(ssrRenderComponent(unref(DialogTitle_default), null, {
                              default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                if (_push6) ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                  _push6(`${ssrInterpolate(unref(props).title)}`);
                                }, _push6, _parent6, _scopeId5);
                                else return [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])];
                              }),
                              _: 2
                            }, _parent5, _scopeId4));
                            else _push5(`<!---->`);
                            if (!unref(props).description && !slots.description) _push5(ssrRenderComponent(unref(DialogDescription_default), null, null, _parent5, _scopeId4));
                            else if (!!slots.content) _push5(ssrRenderComponent(unref(DialogDescription_default), null, {
                              default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                if (_push6) ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                  _push6(`${ssrInterpolate(unref(props).description)}`);
                                }, _push6, _parent6, _scopeId5);
                                else return [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])];
                              }),
                              _: 2
                            }, _parent5, _scopeId4));
                            else _push5(`<!---->`);
                          } else return [!unref(props).title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                            _: 3
                          })) : createCommentVNode("", true), !unref(props).description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                            _: 3
                          })) : createCommentVNode("", true)];
                        }),
                        _: 2
                      }, _parent4, _scopeId3));
                      else _push4(`<!---->`);
                      ssrRenderSlot(_ctx.$slots, "content", { close }, () => {
                        var _a2, _b2, _c;
                        if (!!slots.header || unref(props).title || !!slots.title || unref(props).description || !!slots.description || unref(props).close || !!slots.close) {
                          _push4(`<div data-slot="header" class="${ssrRenderClass(ui.value.header({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.header }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "header", { close }, () => {
                            var _a3, _b3, _c2;
                            if (unref(props).title || !!slots.title || unref(props).description || !!slots.description) {
                              _push4(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.wrapper }))}"${_scopeId3}>`);
                              if (unref(props).title || !!slots.title) _push4(ssrRenderComponent(unref(DialogTitle_default), {
                                "data-slot": "title",
                                class: ui.value.title({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.title })
                              }, {
                                default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                  if (_push5) ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                                    _push5(`${ssrInterpolate(unref(props).title)}`);
                                  }, _push5, _parent5, _scopeId4);
                                  else return [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])];
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                              else _push4(`<!---->`);
                              if (unref(props).description || !!slots.description) _push4(ssrRenderComponent(unref(DialogDescription_default), {
                                "data-slot": "description",
                                class: ui.value.description({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.description })
                              }, {
                                default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                  if (_push5) ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                                    _push5(`${ssrInterpolate(unref(props).description)}`);
                                  }, _push5, _parent5, _scopeId4);
                                  else return [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])];
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                              else _push4(`<!---->`);
                              _push4(`</div>`);
                            } else _push4(`<!---->`);
                            ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push4, _parent4, _scopeId3);
                            if (unref(props).close || !!slots.close) _push4(ssrRenderComponent(unref(DialogClose_default), { "as-child": "" }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                                  var _a4;
                                  if (unref(props).close) _push5(ssrRenderComponent(_sfc_main$2, mergeProps({
                                    icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
                                    color: "neutral",
                                    variant: "ghost",
                                    "aria-label": unref(t)("modal.close")
                                  }, typeof unref(props).close === "object" ? unref(props).close : {}, {
                                    "data-slot": "close",
                                    class: ui.value.close({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.close })
                                  }), null, _parent5, _scopeId4));
                                  else _push5(`<!---->`);
                                }, _push5, _parent5, _scopeId4);
                                else return [renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                                  var _a4;
                                  return [unref(props).close ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                    key: 0,
                                    icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
                                    color: "neutral",
                                    variant: "ghost",
                                    "aria-label": unref(t)("modal.close")
                                  }, typeof unref(props).close === "object" ? unref(props).close : {}, {
                                    "data-slot": "close",
                                    class: ui.value.close({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.close })
                                  }), null, 16, [
                                    "icon",
                                    "aria-label",
                                    "class"
                                  ])) : createCommentVNode("", true)];
                                })];
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            else _push4(`<!---->`);
                          }, _push4, _parent4, _scopeId3);
                          _push4(`</div>`);
                        } else _push4(`<!---->`);
                        if (!!slots.body) {
                          _push4(`<div data-slot="body" class="${ssrRenderClass(ui.value.body({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.body }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "body", { close }, null, _push4, _parent4, _scopeId3);
                          _push4(`</div>`);
                        } else _push4(`<!---->`);
                        if (!!slots.footer) {
                          _push4(`<div data-slot="footer" class="${ssrRenderClass(ui.value.footer({ class: (_c = unref(props).ui) == null ? void 0 : _c.footer }))}"${_scopeId3}>`);
                          ssrRenderSlot(_ctx.$slots, "footer", { close }, null, _push4, _parent4, _scopeId3);
                          _push4(`</div>`);
                        } else _push4(`<!---->`);
                      }, _push4, _parent4, _scopeId3);
                    } else return [!unref(props).title && !slots.title || !unref(props).description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                      default: withCtx(() => [!unref(props).title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                        default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                        _: 3
                      })) : createCommentVNode("", true), !unref(props).description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                        default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                        _: 3
                      })) : createCommentVNode("", true)]),
                      _: 3
                    })) : createCommentVNode("", true), renderSlot(_ctx.$slots, "content", { close }, () => {
                      var _a2, _b2, _c;
                      return [
                        !!slots.header || unref(props).title || !!slots.title || unref(props).description || !!slots.description || unref(props).close || !!slots.close ? (openBlock(), createBlock("div", {
                          key: 0,
                          "data-slot": "header",
                          class: ui.value.header({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.header })
                        }, [renderSlot(_ctx.$slots, "header", { close }, () => {
                          var _a3, _b3, _c2;
                          return [
                            unref(props).title || !!slots.title || unref(props).description || !!slots.description ? (openBlock(), createBlock("div", {
                              key: 0,
                              "data-slot": "wrapper",
                              class: ui.value.wrapper({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.wrapper })
                            }, [unref(props).title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                              key: 0,
                              "data-slot": "title",
                              class: ui.value.title({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.title })
                            }, {
                              default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                              _: 3
                            }, 8, ["class"])) : createCommentVNode("", true), unref(props).description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                              key: 1,
                              "data-slot": "description",
                              class: ui.value.description({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.description })
                            }, {
                              default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                              _: 3
                            }, 8, ["class"])) : createCommentVNode("", true)], 2)) : createCommentVNode("", true),
                            renderSlot(_ctx.$slots, "actions"),
                            unref(props).close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                              key: 1,
                              "as-child": ""
                            }, {
                              default: withCtx(() => [renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                                var _a4;
                                return [unref(props).close ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                  key: 0,
                                  icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
                                  color: "neutral",
                                  variant: "ghost",
                                  "aria-label": unref(t)("modal.close")
                                }, typeof unref(props).close === "object" ? unref(props).close : {}, {
                                  "data-slot": "close",
                                  class: ui.value.close({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.close })
                                }), null, 16, [
                                  "icon",
                                  "aria-label",
                                  "class"
                                ])) : createCommentVNode("", true)];
                              })]),
                              _: 2
                            }, 1024)) : createCommentVNode("", true)
                          ];
                        })], 2)) : createCommentVNode("", true),
                        !!slots.body ? (openBlock(), createBlock("div", {
                          key: 1,
                          "data-slot": "body",
                          class: ui.value.body({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.body })
                        }, [renderSlot(_ctx.$slots, "body", { close })], 2)) : createCommentVNode("", true),
                        !!slots.footer ? (openBlock(), createBlock("div", {
                          key: 2,
                          "data-slot": "footer",
                          class: ui.value.footer({ class: (_c = unref(props).ui) == null ? void 0 : _c.footer })
                        }, [renderSlot(_ctx.$slots, "footer", { close })], 2)) : createCommentVNode("", true)
                      ];
                    })];
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                else return [createVNode(unref(DialogContent_default), mergeProps({
                  "data-slot": "content",
                  class: ui.value.content({ class: [!slots.default && unref(props).class, (_b = unref(props).ui) == null ? void 0 : _b.content] })
                }, contentProps.value, {
                  onEnter: ($event) => emits("enter"),
                  onAfterEnter: ($event) => emits("after:enter"),
                  onLeave: ($event) => emits("leave"),
                  onAfterLeave: ($event) => emits("after:leave")
                }, toHandlers(contentEvents.value)), {
                  default: withCtx(() => [!unref(props).title && !slots.title || !unref(props).description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                    default: withCtx(() => [!unref(props).title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                      default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                      _: 3
                    })) : createCommentVNode("", true), !unref(props).description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                      default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                      _: 3
                    })) : createCommentVNode("", true)]),
                    _: 3
                  })) : createCommentVNode("", true), renderSlot(_ctx.$slots, "content", { close }, () => {
                    var _a2, _b2, _c;
                    return [
                      !!slots.header || unref(props).title || !!slots.title || unref(props).description || !!slots.description || unref(props).close || !!slots.close ? (openBlock(), createBlock("div", {
                        key: 0,
                        "data-slot": "header",
                        class: ui.value.header({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.header })
                      }, [renderSlot(_ctx.$slots, "header", { close }, () => {
                        var _a3, _b3, _c2;
                        return [
                          unref(props).title || !!slots.title || unref(props).description || !!slots.description ? (openBlock(), createBlock("div", {
                            key: 0,
                            "data-slot": "wrapper",
                            class: ui.value.wrapper({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.wrapper })
                          }, [unref(props).title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                            key: 0,
                            "data-slot": "title",
                            class: ui.value.title({ class: (_b3 = unref(props).ui) == null ? void 0 : _b3.title })
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                            _: 3
                          }, 8, ["class"])) : createCommentVNode("", true), unref(props).description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                            key: 1,
                            "data-slot": "description",
                            class: ui.value.description({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.description })
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                            _: 3
                          }, 8, ["class"])) : createCommentVNode("", true)], 2)) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "actions"),
                          unref(props).close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                            key: 1,
                            "as-child": ""
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                              var _a4;
                              return [unref(props).close ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                key: 0,
                                icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
                                color: "neutral",
                                variant: "ghost",
                                "aria-label": unref(t)("modal.close")
                              }, typeof unref(props).close === "object" ? unref(props).close : {}, {
                                "data-slot": "close",
                                class: ui.value.close({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.close })
                              }), null, 16, [
                                "icon",
                                "aria-label",
                                "class"
                              ])) : createCommentVNode("", true)];
                            })]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true)
                        ];
                      })], 2)) : createCommentVNode("", true),
                      !!slots.body ? (openBlock(), createBlock("div", {
                        key: 1,
                        "data-slot": "body",
                        class: ui.value.body({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.body })
                      }, [renderSlot(_ctx.$slots, "body", { close })], 2)) : createCommentVNode("", true),
                      !!slots.footer ? (openBlock(), createBlock("div", {
                        key: 2,
                        "data-slot": "footer",
                        class: ui.value.footer({ class: (_c = unref(props).ui) == null ? void 0 : _c.footer })
                      }, [renderSlot(_ctx.$slots, "footer", { close })], 2)) : createCommentVNode("", true)
                    ];
                  })]),
                  _: 2
                }, 1040, [
                  "class",
                  "onEnter",
                  "onAfterEnter",
                  "onLeave",
                  "onAfterLeave"
                ])];
              }),
              _: 2
            }, _parent2, _scopeId));
            if (!!slots.default) _push2(ssrRenderComponent(unref(DialogTrigger_default), {
              "as-child": "",
              class: unref(props).class
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) ssrRenderSlot(_ctx.$slots, "default", { open }, null, _push3, _parent3, _scopeId2);
                else return [renderSlot(_ctx.$slots, "default", { open })];
              }),
              _: 2
            }, _parent2, _scopeId));
            else _push2(`<!---->`);
            _push2(ssrRenderComponent(unref(DialogPortal_default), mergeProps(unref(portalProps), { "force-mount": unref(portalProps).disabled && unref(props).unmountOnHide === false || void 0 }), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(ssrRenderComponent(unref(FieldGroupReset), null, {
                  default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                    var _a, _b, _c, _d;
                    if (_push4) {
                      if (unref(props).scrollable) _push4(ssrRenderComponent(unref(DialogOverlay_default), {
                        "data-slot": "overlay",
                        class: ui.value.overlay({ class: (_a = unref(props).ui) == null ? void 0 : _a.overlay })
                      }, {
                        default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                          if (_push5) _push5(ssrRenderComponent(unref(ReuseContentTemplate), null, null, _parent5, _scopeId4));
                          else return [createVNode(unref(ReuseContentTemplate))];
                        }),
                        _: 2
                      }, _parent4, _scopeId3));
                      else {
                        _push4(`<!--[-->`);
                        if (unref(props).overlay) _push4(ssrRenderComponent(unref(DialogOverlay_default), {
                          "data-slot": "overlay",
                          class: ui.value.overlay({ class: (_b = unref(props).ui) == null ? void 0 : _b.overlay })
                        }, null, _parent4, _scopeId3));
                        else _push4(`<!---->`);
                        _push4(ssrRenderComponent(unref(ReuseContentTemplate), null, null, _parent4, _scopeId3));
                        _push4(`<!--]-->`);
                      }
                    } else return [unref(props).scrollable ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: (_c = unref(props).ui) == null ? void 0 : _c.overlay })
                    }, {
                      default: withCtx(() => [createVNode(unref(ReuseContentTemplate))]),
                      _: 1
                    }, 8, ["class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [unref(props).overlay ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: (_d = unref(props).ui) == null ? void 0 : _d.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true), createVNode(unref(ReuseContentTemplate))], 64))];
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                else return [createVNode(unref(FieldGroupReset), null, {
                  default: withCtx(() => {
                    var _a, _b;
                    return [unref(props).scrollable ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: (_a = unref(props).ui) == null ? void 0 : _a.overlay })
                    }, {
                      default: withCtx(() => [createVNode(unref(ReuseContentTemplate))]),
                      _: 1
                    }, 8, ["class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [unref(props).overlay ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                      key: 0,
                      "data-slot": "overlay",
                      class: ui.value.overlay({ class: (_b = unref(props).ui) == null ? void 0 : _b.overlay })
                    }, null, 8, ["class"])) : createCommentVNode("", true), createVNode(unref(ReuseContentTemplate))], 64))];
                  }),
                  _: 1
                })];
              }),
              _: 2
            }, _parent2, _scopeId));
          } else return [
            createVNode(unref(DefineContentTemplate), null, {
              default: withCtx(() => {
                var _a;
                return [createVNode(unref(DialogContent_default), mergeProps({
                  "data-slot": "content",
                  class: ui.value.content({ class: [!slots.default && unref(props).class, (_a = unref(props).ui) == null ? void 0 : _a.content] })
                }, contentProps.value, {
                  onEnter: ($event) => emits("enter"),
                  onAfterEnter: ($event) => emits("after:enter"),
                  onLeave: ($event) => emits("leave"),
                  onAfterLeave: ($event) => emits("after:leave")
                }, toHandlers(contentEvents.value)), {
                  default: withCtx(() => [!unref(props).title && !slots.title || !unref(props).description && !slots.description || !!slots.content ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
                    default: withCtx(() => [!unref(props).title && !slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 0 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogTitle_default), { key: 1 }, {
                      default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                      _: 3
                    })) : createCommentVNode("", true), !unref(props).description && !slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 2 })) : !!slots.content ? (openBlock(), createBlock(unref(DialogDescription_default), { key: 3 }, {
                      default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                      _: 3
                    })) : createCommentVNode("", true)]),
                    _: 3
                  })) : createCommentVNode("", true), renderSlot(_ctx.$slots, "content", { close }, () => {
                    var _a2, _b, _c;
                    return [
                      !!slots.header || unref(props).title || !!slots.title || unref(props).description || !!slots.description || unref(props).close || !!slots.close ? (openBlock(), createBlock("div", {
                        key: 0,
                        "data-slot": "header",
                        class: ui.value.header({ class: (_a2 = unref(props).ui) == null ? void 0 : _a2.header })
                      }, [renderSlot(_ctx.$slots, "header", { close }, () => {
                        var _a3, _b2, _c2;
                        return [
                          unref(props).title || !!slots.title || unref(props).description || !!slots.description ? (openBlock(), createBlock("div", {
                            key: 0,
                            "data-slot": "wrapper",
                            class: ui.value.wrapper({ class: (_a3 = unref(props).ui) == null ? void 0 : _a3.wrapper })
                          }, [unref(props).title || !!slots.title ? (openBlock(), createBlock(unref(DialogTitle_default), {
                            key: 0,
                            "data-slot": "title",
                            class: ui.value.title({ class: (_b2 = unref(props).ui) == null ? void 0 : _b2.title })
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(unref(props).title), 1)])]),
                            _: 3
                          }, 8, ["class"])) : createCommentVNode("", true), unref(props).description || !!slots.description ? (openBlock(), createBlock(unref(DialogDescription_default), {
                            key: 1,
                            "data-slot": "description",
                            class: ui.value.description({ class: (_c2 = unref(props).ui) == null ? void 0 : _c2.description })
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString(unref(props).description), 1)])]),
                            _: 3
                          }, 8, ["class"])) : createCommentVNode("", true)], 2)) : createCommentVNode("", true),
                          renderSlot(_ctx.$slots, "actions"),
                          unref(props).close || !!slots.close ? (openBlock(), createBlock(unref(DialogClose_default), {
                            key: 1,
                            "as-child": ""
                          }, {
                            default: withCtx(() => [renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                              var _a4;
                              return [unref(props).close ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                key: 0,
                                icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
                                color: "neutral",
                                variant: "ghost",
                                "aria-label": unref(t)("modal.close")
                              }, typeof unref(props).close === "object" ? unref(props).close : {}, {
                                "data-slot": "close",
                                class: ui.value.close({ class: (_a4 = unref(props).ui) == null ? void 0 : _a4.close })
                              }), null, 16, [
                                "icon",
                                "aria-label",
                                "class"
                              ])) : createCommentVNode("", true)];
                            })]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true)
                        ];
                      })], 2)) : createCommentVNode("", true),
                      !!slots.body ? (openBlock(), createBlock("div", {
                        key: 1,
                        "data-slot": "body",
                        class: ui.value.body({ class: (_b = unref(props).ui) == null ? void 0 : _b.body })
                      }, [renderSlot(_ctx.$slots, "body", { close })], 2)) : createCommentVNode("", true),
                      !!slots.footer ? (openBlock(), createBlock("div", {
                        key: 2,
                        "data-slot": "footer",
                        class: ui.value.footer({ class: (_c = unref(props).ui) == null ? void 0 : _c.footer })
                      }, [renderSlot(_ctx.$slots, "footer", { close })], 2)) : createCommentVNode("", true)
                    ];
                  })]),
                  _: 2
                }, 1040, [
                  "class",
                  "onEnter",
                  "onAfterEnter",
                  "onLeave",
                  "onAfterLeave"
                ])];
              }),
              _: 2
            }, 1024),
            !!slots.default ? (openBlock(), createBlock(unref(DialogTrigger_default), {
              key: 0,
              "as-child": "",
              class: unref(props).class
            }, {
              default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
              _: 2
            }, 1032, ["class"])) : createCommentVNode("", true),
            createVNode(unref(DialogPortal_default), mergeProps(unref(portalProps), { "force-mount": unref(portalProps).disabled && unref(props).unmountOnHide === false || void 0 }), {
              default: withCtx(() => [createVNode(unref(FieldGroupReset), null, {
                default: withCtx(() => {
                  var _a, _b;
                  return [unref(props).scrollable ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                    key: 0,
                    "data-slot": "overlay",
                    class: ui.value.overlay({ class: (_a = unref(props).ui) == null ? void 0 : _a.overlay })
                  }, {
                    default: withCtx(() => [createVNode(unref(ReuseContentTemplate))]),
                    _: 1
                  }, 8, ["class"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [unref(props).overlay ? (openBlock(), createBlock(unref(DialogOverlay_default), {
                    key: 0,
                    "data-slot": "overlay",
                    class: ui.value.overlay({ class: (_b = unref(props).ui) == null ? void 0 : _b.overlay })
                  }, null, 8, ["class"])) : createCommentVNode("", true), createVNode(unref(ReuseContentTemplate))], 64))];
                }),
                _: 1
              })]),
              _: 1
            }, 16, ["force-mount"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Modal-Bf6V9eIc.mjs.map
