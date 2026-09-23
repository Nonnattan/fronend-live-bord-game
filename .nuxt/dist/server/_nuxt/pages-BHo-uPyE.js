import { c as navigateTo } from "./error-CeCQlnc5.js";
import { a as focusFirst, c as VisuallyHiddenInput_default, d as useDirection, i as EVENT_OPTIONS, l as useCollection, n as _sfc_main$2, o as getFocusIntent, r as ENTRY_FOCUS, s as wrapArray, t as _sfc_main$3, u as useFormControl } from "./Badge--gAvyuw3.js";
import { c as useId$1, f as handleAndDispatchCustomEvent, s as Presence_default } from "./usePortal-CFE28n6Q.js";
import { t as useForwardExpose } from "./useForwardExpose-lTVrimVg.js";
import { t as _sfc_main$4 } from "./Modal-Bf6V9eIc.js";
import { n as Label_default, t as _sfc_main$5 } from "./FormField-DIM7HDnG.js";
import { C as get, D as _sfc_main$7, N as createContext, O as Primitive, P as useAppConfig, a as _sfc_main$8, b as useForwardProps, c as formBusInjectionKey, d as formInputsInjectionKey, f as formLoadingInjectionKey, g as useFormField, l as formErrorsInjectionKey, m as formStateInjectionKey, n as _plugin_vue_export_helper_default, p as formOptionsInjectionKey, r as _sfc_main$6, s as tv, t as useOfflineMode, x as useComponentProps } from "../server.mjs";
import { a as calculateAge, c as profileSchema, i as birthYearRangeValueFor, n as GENDER_OPTIONS, o as calculateAgeRange, r as ageRangeLabel, s as getAgeRangeOptions, t as useProfile } from "./useProfile-Di4CdYil.js";
import { t as useMemberApi } from "./useMemberApi-DKl7a10r.js";
import { t as useAuth } from "./useAuth-mwKCwQRs.js";
import { t as _sfc_main$9 } from "./Input-03a9B_yA.js";
import { Fragment, Transition, computed, createBlock, createCommentVNode, createElementBlock, createSlots, createTextVNode, createVNode, defineComponent, getCurrentInstance, inject, isRef, mergeProps, nextTick, openBlock, provide, reactive, readonly, ref, renderList, renderSlot, resolveDynamicComponent, toDisplayString, toRefs, unref, useId, useSSRContext, useSlots, useTemplateRef, watch, withCtx, withKeys, withModifiers } from "vue";
import { isEqual } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/index.mjs";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderVNode } from "vue/server-renderer";
import { reactivePick, useEventBus, useEventListener, useVModel } from "@vueuse/core";
//#region node_modules/reka-ui/dist/shared/useForwardScopeId.js
/**
* Returns the parent component's `<style scoped>` id (e.g. `data-v-xxxxxxx`) as a
* bindable attribute object, so it can be manually forwarded onto the chosen root
* element of a multi-root component.
*
* Vue only auto-applies the parent's scope id to a **single-root** component's root.
* When a component renders multiple root nodes (e.g. an interactive control plus a
* sibling hidden form input), that fallthrough is dropped and the parent's scoped
* styles can no longer reach the component. Spread the returned object onto the
* element that should stay styleable by the parent.
*
* @example
* ```ts
* const scopeIdAttrs = useForwardScopeId()
* // <Primitive v-bind="{ ...$attrs, ...scopeIdAttrs }" />
* ```
*/
function useForwardScopeId() {
	const scopeId = (getCurrentInstance()?.vnode)?.scopeId;
	return scopeId ? { [scopeId]: "" } : {};
}
//#endregion
//#region node_modules/reka-ui/dist/RovingFocus/RovingFocusGroup.js
var [injectRovingFocusGroupContext, provideRovingFocusGroupContext] = /*#__PURE__*/ createContext("RovingFocusGroup");
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
//#endregion
//#region node_modules/reka-ui/dist/RovingFocus/RovingFocusItem.js
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
//#endregion
//#region node_modules/reka-ui/dist/RadioGroup/utils.js
var RADIO_SELECT = "radio.select";
function handleSelect(event, value, callback) {
	handleAndDispatchCustomEvent(RADIO_SELECT, callback, {
		originalEvent: event,
		value
	});
}
//#endregion
//#region node_modules/reka-ui/dist/RadioGroup/Radio.js
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
		const ariaLabel = computed(() => props.id && triggerElement.value ? (void 0).querySelector(`[for="${props.id}"]`)?.innerText ?? props.value : void 0);
		function handleClick(event) {
			if (props.disabled) return;
			handleSelect(event, props.value, (ev) => {
				emits("select", ev);
				if (ev?.defaultPrevented) return;
				checked.value = true;
				if (isFormControl.value) ev.stopPropagation();
			});
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createVNode(unref(Primitive), mergeProps({
				id: _ctx.id,
				ref: unref(forwardRef),
				role: "radio",
				type: _ctx.as === "button" ? "button" : void 0,
				as: _ctx.as,
				"aria-checked": unref(checked) ?? false,
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
//#endregion
//#region node_modules/reka-ui/dist/RadioGroup/RadioGroupRoot.js
var [injectRadioGroupRootContext, provideRadioGroupRootContext] = /*#__PURE__*/ createContext("RadioGroupRoot");
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
			name: name?.value,
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
//#endregion
//#region node_modules/reka-ui/dist/RadioGroup/RadioGroupItem.js
var [injectRadioGroupItemContext, provideRadiogroupItemContext] = /*#__PURE__*/ createContext("RadioGroupItem");
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
		const checked = computed(() => isEqual(rootContext.modelValue?.value, props.value));
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
				/**
				* Our `RovingFocusGroup` will focus the radio when navigating with arrow keys
				* and we need to 'check' it in that case. We click it to 'check' it (instead
				* of updating `context.value`) so that the radio change event fires.
				*/
				if (isArrowKeyPressed.value) currentElement.value?.click();
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
					onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers(() => {}, ["prevent"]), ["enter"])),
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
//#endregion
//#region node_modules/reka-ui/dist/RadioGroup/RadioGroupIndicator.js
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
//#endregion
//#region components/LoginButtons.vue?vue&type=script&setup=true&lang.ts
var LoginButtons_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "LoginButtons",
	__ssrInlineRender: true,
	props: {
		lineLoading: { type: Boolean },
		offlineMode: { type: Boolean }
	},
	emits: ["select-line", "select-guest"],
	setup(__props, { emit: __emit }) {
		/**
		* components/LoginButtons.vue
		* ---------------------------------------------------------------------------
		* ปุ่ม 2 ปุ่มของหน้า Welcome (Step 1) — เป็น presentational component ล้วน ๆ
		* ไม่มี logic การ login อยู่ในนี้เลย แค่ emit event ให้ parent (WelcomePage)
		* ตัดสินใจว่าจะเรียก useAuth().loginWithLine() หรือ loginAsGuest()
		*/
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$6;
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
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` เข้าสู่ระบบด้วย LINE `);
					else return [createTextVNode(" เข้าสู่ระบบด้วย LINE ")];
				}),
				_: 2
			}, [!__props.lineLoading ? {
				name: "leading",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UIcon, { name: "i-simple-icons-line" }, null, _parent, _scopeId));
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
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` เข้าใช้งานโดยไม่เชื่อม LINE `);
					else return [createTextVNode(" เข้าใช้งานโดยไม่เชื่อม LINE ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/LoginButtons.vue
var _sfc_setup$6 = LoginButtons_vue_vue_type_script_setup_true_lang_default.setup;
LoginButtons_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoginButtons.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var LoginButtons_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(LoginButtons_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c3a2c2ff"]]), { __name: "LoginButtons" });
//#endregion
//#region components/WelcomePage.vue?vue&type=script&setup=true&lang.ts
var WelcomePage_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "WelcomePage",
	__ssrInlineRender: true,
	props: {
		lineLoading: { type: Boolean },
		lineError: {},
		offlineMode: { type: Boolean }
	},
	emits: ["select-line", "select-guest"],
	setup(__props, { emit: __emit }) {
		/**
		* components/WelcomePage.vue
		* ---------------------------------------------------------------------------
		* Step 1 ของ Flow ใหม่: หน้าแรกสุดที่ผู้ใช้เห็นเสมอเมื่อยังไม่เคยเลือกวิธีเข้าใช้งาน
		* (ไม่มี authData และไม่มี userProfile ใน LocalStorage)
		*
		* มี Logo + ข้อความต้อนรับ + ปุ่มเลือก 2 ทาง (ผ่าน <LoginButtons />)
		* ไม่มี logic การ login เอง แค่ forward event ให้ pages/index.vue เรียก
		* useAuth().loginWithLine() / loginAsGuest() ต่อ
		*/
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			const _component_LoginButtons = LoginButtons_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "welcome-page" }, _attrs))} data-v-9a65e05b><div class="welcome-page__scroll" data-v-9a65e05b><div class="brand-mark" data-v-9a65e05b>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-shield-check",
				class: "brand-mark__icon"
			}, null, _parent));
			_push(`</div><h1 class="title" data-v-9a65e05b>ยินดีต้อนรับ 👋</h1><p class="subtitle" data-v-9a65e05b>เลือกวิธีเข้าใช้งานเพื่อเริ่มต้น</p>`);
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
//#endregion
//#region components/WelcomePage.vue
var _sfc_setup$5 = WelcomePage_vue_vue_type_script_setup_true_lang_default.setup;
WelcomePage_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WelcomePage.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var WelcomePage_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(WelcomePage_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9a65e05b"]]), { __name: "WelcomePage" });
//#endregion
//#region virtual:nuxt:.nuxt%2Fui%2Fradio-group.ts
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
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue
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
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("radioGroup", _props);
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "as", "loop", "required"), emits);
		const { emitFormChange, emitFormInput, color, name, size, highlight, id: _id, disabled, ariaAttrs } = useFormField(_props, { bind: false });
		const id = _id.value ?? useId();
		const ui = computed(() => tv({
			extend: virtual_nuxt__nuxt_2Fui_2Fradio_group_default,
			...appConfig.ui?.radioGroup || {}
		})({
			size: size.value ?? props.size,
			color: color.value ?? props.color,
			highlight: highlight.value ?? props.highlight,
			disabled: disabled.value,
			required: props.required,
			orientation: props.orientation,
			variant: props.variant,
			indicator: props.indicator
		}));
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
			_push(ssrRenderComponent(unref(RadioGroupRoot_default), mergeProps({ id: unref(id) }, unref(rootProps), {
				"model-value": unref(props).modelValue,
				"default-value": unref(props).defaultValue,
				orientation: unref(props).orientation,
				name: unref(name),
				disabled: unref(disabled),
				"data-slot": "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] }),
				"onUpdate:modelValue": onUpdate
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<fieldset${ssrRenderAttrs(mergeProps({
							"data-slot": "fieldset",
							class: ui.value.fieldset({ class: unref(props).ui?.fieldset })
						}, unref(ariaAttrs)))}${_scopeId}>`);
						if (unref(props).legend || !!slots.legend) {
							_push(`<legend data-slot="legend" class="${ssrRenderClass(ui.value.legend({ class: unref(props).ui?.legend }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "legend", {}, () => {
								_push(`${ssrInterpolate(unref(props).legend)}`);
							}, _push, _parent, _scopeId);
							_push(`</legend>`);
						} else _push(`<!---->`);
						_push(`<!--[-->`);
						ssrRenderList(normalizedItems.value, (item) => {
							ssrRenderVNode(_push, createVNode(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? "div" : unref(Label_default)), {
								key: item.value,
								"data-slot": "item",
								class: ui.value.item({
									class: [
										unref(props).ui?.item,
										item.ui?.item,
										item.class
									],
									disabled: item.disabled || unref(disabled)
								})
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div data-slot="container" class="${ssrRenderClass(ui.value.container({ class: [unref(props).ui?.container, item.ui?.container] }))}"${_scopeId}>`);
										_push(ssrRenderComponent(unref(RadioGroupItem_default), {
											id: item.id,
											value: item.value,
											disabled: item.disabled || unref(disabled),
											"data-slot": "base",
											class: ui.value.base({
												class: [unref(props).ui?.base, item.ui?.base],
												disabled: item.disabled || unref(disabled)
											})
										}, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) _push(ssrRenderComponent(unref(RadioGroupIndicator_default), {
													"data-slot": "indicator",
													class: ui.value.indicator({ class: [unref(props).ui?.indicator, item.ui?.indicator] })
												}, null, _parent, _scopeId));
												else return [createVNode(unref(RadioGroupIndicator_default), {
													"data-slot": "indicator",
													class: ui.value.indicator({ class: [unref(props).ui?.indicator, item.ui?.indicator] })
												}, null, 8, ["class"])];
											}),
											_: 2
										}, _parent, _scopeId));
										_push(`</div>`);
										if (item.label || !!slots.label || item.description || !!slots.description) {
											_push(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: [unref(props).ui?.wrapper, item.ui?.wrapper] }))}"${_scopeId}>`);
											if (item.label || !!slots.label) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? unref(Label_default) : "p"), {
												for: item.id,
												"data-slot": "label",
												class: ui.value.label({
													class: [unref(props).ui?.label, item.ui?.label],
													disabled: item.disabled || unref(disabled)
												})
											}, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) ssrRenderSlot(_ctx.$slots, "label", {
														item,
														modelValue: unref(props).modelValue
													}, () => {
														_push(`${ssrInterpolate(item.label)}`);
													}, _push, _parent, _scopeId);
													else return [renderSlot(_ctx.$slots, "label", {
														item,
														modelValue: unref(props).modelValue
													}, () => [createTextVNode(toDisplayString(item.label), 1)])];
												}),
												_: 2
											}), _parent, _scopeId);
											else _push(`<!---->`);
											if (item.description || !!slots.description) {
												_push(`<p data-slot="description" class="${ssrRenderClass(ui.value.description({
													class: [unref(props).ui?.description, item.ui?.description],
													disabled: item.disabled || unref(disabled)
												}))}"${_scopeId}>`);
												ssrRenderSlot(_ctx.$slots, "description", {
													item,
													modelValue: unref(props).modelValue
												}, () => {
													_push(`${ssrInterpolate(item.description)}`);
												}, _push, _parent, _scopeId);
												_push(`</p>`);
											} else _push(`<!---->`);
											_push(`</div>`);
										} else _push(`<!---->`);
									} else return [createVNode("div", {
										"data-slot": "container",
										class: ui.value.container({ class: [unref(props).ui?.container, item.ui?.container] })
									}, [createVNode(unref(RadioGroupItem_default), {
										id: item.id,
										value: item.value,
										disabled: item.disabled || unref(disabled),
										"data-slot": "base",
										class: ui.value.base({
											class: [unref(props).ui?.base, item.ui?.base],
											disabled: item.disabled || unref(disabled)
										})
									}, {
										default: withCtx(() => [createVNode(unref(RadioGroupIndicator_default), {
											"data-slot": "indicator",
											class: ui.value.indicator({ class: [unref(props).ui?.indicator, item.ui?.indicator] })
										}, null, 8, ["class"])]),
										_: 2
									}, 1032, [
										"id",
										"value",
										"disabled",
										"class"
									])], 2), item.label || !!slots.label || item.description || !!slots.description ? (openBlock(), createBlock("div", {
										key: 0,
										"data-slot": "wrapper",
										class: ui.value.wrapper({ class: [unref(props).ui?.wrapper, item.ui?.wrapper] })
									}, [item.label || !!slots.label ? (openBlock(), createBlock(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? unref(Label_default) : "p"), {
										key: 0,
										for: item.id,
										"data-slot": "label",
										class: ui.value.label({
											class: [unref(props).ui?.label, item.ui?.label],
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
											class: [unref(props).ui?.description, item.ui?.description],
											disabled: item.disabled || unref(disabled)
										})
									}, [renderSlot(_ctx.$slots, "description", {
										item,
										modelValue: unref(props).modelValue
									}, () => [createTextVNode(toDisplayString(item.description), 1)])], 2)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true)];
								}),
								_: 2
							}), _parent, _scopeId);
						});
						_push(`<!--]--></fieldset>`);
					} else return [createVNode("fieldset", mergeProps({
						"data-slot": "fieldset",
						class: ui.value.fieldset({ class: unref(props).ui?.fieldset })
					}, unref(ariaAttrs)), [unref(props).legend || !!slots.legend ? (openBlock(), createBlock("legend", {
						key: 0,
						"data-slot": "legend",
						class: ui.value.legend({ class: unref(props).ui?.legend })
					}, [renderSlot(_ctx.$slots, "legend", {}, () => [createTextVNode(toDisplayString(unref(props).legend), 1)])], 2)) : createCommentVNode("", true), (openBlock(true), createBlock(Fragment, null, renderList(normalizedItems.value, (item) => {
						return openBlock(), createBlock(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? "div" : unref(Label_default)), {
							key: item.value,
							"data-slot": "item",
							class: ui.value.item({
								class: [
									unref(props).ui?.item,
									item.ui?.item,
									item.class
								],
								disabled: item.disabled || unref(disabled)
							})
						}, {
							default: withCtx(() => [createVNode("div", {
								"data-slot": "container",
								class: ui.value.container({ class: [unref(props).ui?.container, item.ui?.container] })
							}, [createVNode(unref(RadioGroupItem_default), {
								id: item.id,
								value: item.value,
								disabled: item.disabled || unref(disabled),
								"data-slot": "base",
								class: ui.value.base({
									class: [unref(props).ui?.base, item.ui?.base],
									disabled: item.disabled || unref(disabled)
								})
							}, {
								default: withCtx(() => [createVNode(unref(RadioGroupIndicator_default), {
									"data-slot": "indicator",
									class: ui.value.indicator({ class: [unref(props).ui?.indicator, item.ui?.indicator] })
								}, null, 8, ["class"])]),
								_: 2
							}, 1032, [
								"id",
								"value",
								"disabled",
								"class"
							])], 2), item.label || !!slots.label || item.description || !!slots.description ? (openBlock(), createBlock("div", {
								key: 0,
								"data-slot": "wrapper",
								class: ui.value.wrapper({ class: [unref(props).ui?.wrapper, item.ui?.wrapper] })
							}, [item.label || !!slots.label ? (openBlock(), createBlock(resolveDynamicComponent(!unref(props).variant || unref(props).variant === "list" ? unref(Label_default) : "p"), {
								key: 0,
								for: item.id,
								"data-slot": "label",
								class: ui.value.label({
									class: [unref(props).ui?.label, item.ui?.label],
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
									class: [unref(props).ui?.description, item.ui?.description],
									disabled: item.disabled || unref(disabled)
								})
							}, [renderSlot(_ctx.$slots, "description", {
								item,
								modelValue: unref(props).modelValue
							}, () => [createTextVNode(toDisplayString(item.description), 1)])], 2)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true)]),
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
//#endregion
//#region components/MissingFieldsForm.vue?vue&type=script&setup=true&lang.ts
var MissingFieldsForm_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "MissingFieldsForm",
	__ssrInlineRender: true,
	props: {
		member: {},
		auth: {}
	},
	emits: ["completed"],
	setup(__props, { emit: __emit }) {
		/**
		* components/MissingFieldsForm.vue
		* ---------------------------------------------------------------------------
		* แสดงเมื่อ Login ด้วย LINE แล้วพบสมาชิกเดิมใน Google Sheet (lineUserId ตรงกัน)
		* แต่แถวเดิมยังขาด Birth Year และ/หรือ Gender (เช่น สมัครไว้ตั้งแต่ก่อนมีฟีเจอร์นี้ หรือ
		* เคย Login จากเครื่องอื่นที่ไม่มี LocalStorage เดิม) — ให้กรอก "เฉพาะฟิลด์ที่ขาด"
		* เท่านั้น (ไม่ถามชื่อ/นามสกุล/เบอร์ซ้ำ เพราะมีอยู่แล้ว) แล้วอัปเดตแถวเดิมด้วย
		* memberId ผ่าน action 'updateMember' — ห้ามสร้างแถวใหม่เด็ดขาด
		*/
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
				submitError.value = "กรุณากรอกข้อมูลให้ครบ";
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
					submitError.value = result.error || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
					return;
				}
				emit("completed", result.member);
			} catch (err) {
				submitError.value = err instanceof Error ? err.message : "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
			} finally {
				isSubmitting.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UModal = _sfc_main$4;
			const _component_UAvatar = _sfc_main$8;
			const _component_UIcon = _sfc_main$7;
			const _component_UFormField = _sfc_main$5;
			const _component_URadioGroup = _sfc_main$1;
			const _component_USelectMenu = _sfc_main$2;
			const _component_UButton = _sfc_main$6;
			_push(ssrRenderComponent(_component_UModal, mergeProps({
				open: unref(open),
				"onUpdate:open": ($event) => isRef(open) ? open.value = $event : null,
				fullscreen: "",
				dismissible: false,
				close: false,
				title: "กรอกข้อมูลเพิ่มเติม",
				description: "กรุณากรอกข้อมูลที่ขาดให้ครบก่อนเริ่มใช้งาน"
			}, _attrs), {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="missing-fields-form" data-v-43b92180${_scopeId}><div class="missing-fields-form__scroll" data-v-43b92180${_scopeId}><div class="missing-fields-form__header" data-v-43b92180${_scopeId}>`);
						if (__props.member.pictureUrl) _push(ssrRenderComponent(_component_UAvatar, {
							src: __props.member.pictureUrl,
							size: "3xl",
							class: "brand-avatar"
						}, null, _parent, _scopeId));
						else {
							_push(`<div class="brand-mark" data-v-43b92180${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-user-round-plus",
								class: "brand-mark__icon"
							}, null, _parent, _scopeId));
							_push(`</div>`);
						}
						_push(`<h1 class="title" data-v-43b92180${_scopeId}>สวัสดีอีกครั้ง, ${ssrInterpolate(__props.member.firstName)}</h1><p class="subtitle" data-v-43b92180${_scopeId}>กรุณากรอกข้อมูลเพิ่มเติมอีกเล็กน้อยก่อนเริ่มใช้งาน</p></div><form class="missing-fields-form__body" data-v-43b92180${_scopeId}>`);
						if (unref(missingGender)) _push(ssrRenderComponent(_component_UFormField, {
							label: "เพศ",
							required: ""
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_URadioGroup, {
									modelValue: unref(gender),
									"onUpdate:modelValue": ($event) => isRef(gender) ? gender.value = $event : null,
									items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
									orientation: "horizontal",
									variant: "card",
									class: "gender-grid"
								}, null, _parent, _scopeId));
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
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (unref(missingAge)) _push(ssrRenderComponent(_component_UFormField, {
							label: "ช่วงอายุ",
							required: ""
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
									modelValue: unref(birthYear),
									"onUpdate:modelValue": ($event) => isRef(birthYear) ? birthYear.value = $event : null,
									items: unref(ageRangeOptions),
									"value-key": "value",
									placeholder: "เลือกช่วงอายุ",
									size: "xl",
									class: "w-full"
								}, null, _parent, _scopeId));
								else return [createVNode(_component_USelectMenu, {
									modelValue: unref(birthYear),
									"onUpdate:modelValue": ($event) => isRef(birthYear) ? birthYear.value = $event : null,
									items: unref(ageRangeOptions),
									"value-key": "value",
									placeholder: "เลือกช่วงอายุ",
									size: "xl",
									class: "w-full"
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"items"
								])];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (unref(previewAge) !== null) _push(`<div class="age-preview" data-v-43b92180${_scopeId}><span class="age-preview__label" data-v-43b92180${_scopeId}>อายุของคุณ</span><span class="age-preview__value" data-v-43b92180${_scopeId}>${ssrInterpolate(unref(previewAgeRange))}</span></div>`);
						else _push(`<!---->`);
						if (unref(submitError)) _push(`<p class="submit-error" data-v-43b92180${_scopeId}>${ssrInterpolate(unref(submitError))}</p>`);
						else _push(`<!---->`);
						_push(ssrRenderComponent(_component_UButton, {
							type: "submit",
							block: "",
							size: "xl",
							color: "primary",
							class: "submit-button",
							loading: unref(isSubmitting),
							disabled: unref(isSubmitting)
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` เริ่มใช้งาน `);
								else return [createTextVNode(" เริ่มใช้งาน ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</form></div></div>`);
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
						createVNode("h1", { class: "title" }, "สวัสดีอีกครั้ง, " + toDisplayString(__props.member.firstName), 1),
						createVNode("p", { class: "subtitle" }, "กรุณากรอกข้อมูลเพิ่มเติมอีกเล็กน้อยก่อนเริ่มใช้งาน")
					]), createVNode("form", {
						class: "missing-fields-form__body",
						onSubmit: withModifiers(onSubmit, ["prevent"])
					}, [
						unref(missingGender) ? (openBlock(), createBlock(_component_UFormField, {
							key: 0,
							label: "เพศ",
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
							label: "ช่วงอายุ",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_USelectMenu, {
								modelValue: unref(birthYear),
								"onUpdate:modelValue": ($event) => isRef(birthYear) ? birthYear.value = $event : null,
								items: unref(ageRangeOptions),
								"value-key": "value",
								placeholder: "เลือกช่วงอายุ",
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
							}, [createVNode("span", { class: "age-preview__label" }, "อายุของคุณ"), createVNode("span", { class: "age-preview__value" }, toDisplayString(unref(previewAgeRange)), 1)])) : createCommentVNode("", true)]),
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
							default: withCtx(() => [createTextVNode(" เริ่มใช้งาน ")]),
							_: 1
						}, 8, ["loading", "disabled"])
					], 32)])])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region components/MissingFieldsForm.vue
var _sfc_setup$3 = MissingFieldsForm_vue_vue_type_script_setup_true_lang_default.setup;
MissingFieldsForm_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MissingFieldsForm.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var MissingFieldsForm_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(MissingFieldsForm_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-43b92180"]]), { __name: "MissingFieldsForm" });
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/utils/form.js
function isSuperStructSchema(schema) {
	return "schema" in schema && typeof schema.coercer === "function" && typeof schema.validator === "function" && typeof schema.refiner === "function";
}
function isStandardSchema(schema) {
	return "~standard" in schema;
}
async function validateStandardSchema(state, schema) {
	const result = await schema["~standard"].validate(state);
	if (result.issues) return {
		errors: result.issues?.map((issue) => ({
			name: issue.path?.map((item) => typeof item === "object" ? item.key : item).join(".") || "",
			message: issue.message
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
	return path.split(".").reduce((value2, key) => value2?.[key], data);
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
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/types/form.js
var FormValidationException = class FormValidationException extends Error {
	formId;
	errors;
	constructor(formId, errors) {
		super("Form validation exception");
		this.formId = formId;
		this.errors = errors;
		Object.setPrototypeOf(this, FormValidationException.prototype);
	}
};
//#endregion
//#region virtual:nuxt:.nuxt%2Fui%2Fform.ts
var virtual_nuxt__nuxt_2Fui_2Fform_default = { "base": "" };
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Form.vue
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
		const _props = __props;
		const emits = __emit;
		const props = useComponentProps("form", _props);
		const appConfig = useAppConfig();
		const ui = computed(() => tv({
			extend: virtual_nuxt__nuxt_2Fui_2Fform_default,
			...appConfig.ui?.form || {}
		}));
		const formId = props.id ?? useId();
		const formRef = useTemplateRef("formRef");
		const bus = useEventBus(`form-${formId}`);
		const parentBus = props.nested === true && inject(formBusInjectionKey, void 0);
		const parentState = props.nested === true ? inject(formStateInjectionKey, void 0) : void 0;
		const state = computed(() => {
			if (parentState?.value) return props.name ? getAtPath(parentState.value, props.name) : parentState.value;
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
			return errs.map((err) => ({
				...err,
				id: err?.name ? inputs.value[err.name]?.id : void 0
			}));
		}
		const transformedState = ref(null);
		async function getErrors() {
			let errs = props.validate ? await props.validate(state.value) ?? [] : [];
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
			if (errors.value?.length) {
				if (opts.silent) return false;
				throw new FormValidationException(formId, errors.value);
			}
			if (opts.transform) {
				nestedResults.forEach((result) => {
					if (result.name) setAtPath(transformedState.value, result.name, result.output);
					else Object.assign(transformedState.value, result.output);
				});
				return transformedState.value ?? state.value;
			}
			return state.value;
		}
		const loading = ref(false);
		provide(formLoadingInjectionKey, readonly(loading));
		async function onSubmitWrapper(payload) {
			loading.value = !!props.loadingAuto;
			const event = payload;
			try {
				event.data = await _validate({
					nested: true,
					transform: props.transform
				});
				await props.onSubmit?.(event);
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
			const prefix = formPath + ".";
			const name = error?.name?.startsWith(prefix) ? error.name.substring(prefix.length) : error.name;
			return {
				...error,
				name
			};
		}
		function filterFormErrors(errors2, formPath) {
			if (!formPath) return errors2;
			return errors2.filter((e) => e?.name?.startsWith(formPath + ".")).map((e) => stripFormPath(e, formPath));
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
			const patterns = names.map((name) => inputs.value?.[name]?.pattern).filter(Boolean);
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
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(parentBus) ? "div" : "form"), mergeProps({
				id: unref(formId),
				ref_key: "formRef",
				ref: formRef,
				name: unref(parentBus) ? void 0 : unref(props).name,
				method: "post",
				class: ui.value({ class: [unref(props).ui?.base, unref(props).class] }),
				onSubmit: onSubmitWrapper
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {
						errors: errors.value,
						loading: loading.value
					}, null, _push, _parent, _scopeId);
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
//#endregion
//#region components/ProfileForm.vue?vue&type=script&setup=true&lang.ts
var ProfileForm_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ProfileForm",
	__ssrInlineRender: true,
	props: {
		auth: {},
		offlineMode: { type: Boolean }
	},
	emits: ["registered"],
	setup(__props, { emit: __emit }) {
		/**
		* components/ProfileForm.vue
		* ---------------------------------------------------------------------------
		* Step 2 ของ Flow ใหม่: ฟอร์มกรอกโปรไฟล์ — แสดงเป็น UModal แบบ fullscreen
		* (บังคับ, ห้ามข้าม) ไม่ว่า Step 1 จะมาจาก LINE หรือ Guest ก็ต้องเจอฟอร์มนี้เสมอ
		*
		* - รับ authData ของ Step 1 มาเป็น prop (uid/loginType/displayName/pictureUrl)
		* - ถ้ามาจาก LINE และมี displayName -> เติมในช่อง "ชื่อ" ให้อัตโนมัติ (แก้ไขได้)
		* - ช่วงอายุ: เลือกจาก USelectMenu เป็นช่วง (เช่น "1996 - 2006 (20-30 ปี)")
		*   คำนวณช่วงปีเกิดสดจากปีปัจจุบันเสมอ (ไม่ hardcode) -> ได้ birthYearRange ที่จะบันทึก
		*   ลง Google Sheet อัตโนมัติ (ดู birthYearRangeValueFor() ใน utils/profileSchema.ts)
		* - Validate ด้วย Zod (utils/profileSchema.ts) ผ่าน UForm
		* - ปิด modal ด้วยปุ่ม X / คลิกนอกกรอบ / กด Esc ไม่ได้ ต้องกรอกให้ครบก่อนเท่านั้น
		* - บันทึกสำเร็จ -> รวมเข้ากับ authData เป็น UserProfile เดียว แล้ว emit "registered"
		*/
		const props = __props;
		const emit = __emit;
		const { saveProfile } = useProfile();
		const { syncMember } = useMemberApi();
		const open = ref(true);
		const ageRangeOptions = getAgeRangeOptions();
		const state = reactive({
			firstName: props.auth.loginType === "line" ? props.auth.displayName ?? "" : "",
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
					submitError.value = result.error || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
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
				submitError.value = err instanceof Error ? err.message : "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
			} finally {
				isSubmitting.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UModal = _sfc_main$4;
			const _component_UAvatar = _sfc_main$8;
			const _component_UIcon = _sfc_main$7;
			const _component_UBadge = _sfc_main$3;
			const _component_UForm = _sfc_main;
			const _component_UFormField = _sfc_main$5;
			const _component_UInput = _sfc_main$9;
			const _component_URadioGroup = _sfc_main$1;
			const _component_USelectMenu = _sfc_main$2;
			const _component_UButton = _sfc_main$6;
			_push(ssrRenderComponent(_component_UModal, mergeProps({
				open: unref(open),
				"onUpdate:open": ($event) => isRef(open) ? open.value = $event : null,
				fullscreen: "",
				dismissible: false,
				close: false,
				title: "กรอกข้อมูลผู้ใช้",
				description: "กรุณากรอกข้อมูลให้ครบก่อนเริ่มใช้งาน"
			}, _attrs), {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="profile-form" data-v-3bad5844${_scopeId}><div class="profile-form__scroll" data-v-3bad5844${_scopeId}><div class="profile-form__header" data-v-3bad5844${_scopeId}>`);
						if (__props.auth.pictureUrl) _push(ssrRenderComponent(_component_UAvatar, {
							src: __props.auth.pictureUrl,
							size: "3xl",
							class: "brand-avatar"
						}, null, _parent, _scopeId));
						else {
							_push(`<div class="brand-mark" data-v-3bad5844${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-user-round-plus",
								class: "brand-mark__icon"
							}, null, _parent, _scopeId));
							_push(`</div>`);
						}
						_push(`<h1 class="title" data-v-3bad5844${_scopeId}>กรอกข้อมูลผู้ใช้</h1><p class="subtitle" data-v-3bad5844${_scopeId}>กรอกข้อมูลของคุณให้ครบเพื่อเริ่มใช้งานแอปพลิเคชัน</p>`);
						if (__props.auth.loginType === "line" && __props.auth.displayName) _push(ssrRenderComponent(_component_UBadge, {
							color: "success",
							variant: "subtle",
							size: "md",
							class: "line-badge"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_component_UIcon, {
										name: "i-simple-icons-line",
										class: "line-badge__icon"
									}, null, _parent, _scopeId));
									_push(` เข้าสู่ระบบด้วย LINE: ${ssrInterpolate(__props.auth.displayName)}`);
								} else return [createVNode(_component_UIcon, {
									name: "i-simple-icons-line",
									class: "line-badge__icon"
								}), createTextVNode(" เข้าสู่ระบบด้วย LINE: " + toDisplayString(__props.auth.displayName), 1)];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div>`);
						_push(ssrRenderComponent(_component_UForm, {
							schema: "profileSchema" in _ctx ? _ctx.profileSchema : unref(profileSchema),
							state: unref(state),
							class: "profile-form__body",
							onSubmit
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_component_UFormField, {
										label: "ชื่อ",
										name: "firstName",
										required: ""
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_UInput, {
												modelValue: unref(state).firstName,
												"onUpdate:modelValue": ($event) => unref(state).firstName = $event,
												placeholder: "กรอกชื่อของคุณ",
												size: "xl",
												class: "w-full"
											}, null, _parent, _scopeId));
											else return [createVNode(_component_UInput, {
												modelValue: unref(state).firstName,
												"onUpdate:modelValue": ($event) => unref(state).firstName = $event,
												placeholder: "กรอกชื่อของคุณ",
												size: "xl",
												class: "w-full"
											}, null, 8, ["modelValue", "onUpdate:modelValue"])];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(_component_UFormField, {
										label: "นามสกุล",
										name: "lastName",
										required: ""
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_UInput, {
												modelValue: unref(state).lastName,
												"onUpdate:modelValue": ($event) => unref(state).lastName = $event,
												placeholder: "กรอกนามสกุลของคุณ",
												size: "xl",
												class: "w-full"
											}, null, _parent, _scopeId));
											else return [createVNode(_component_UInput, {
												modelValue: unref(state).lastName,
												"onUpdate:modelValue": ($event) => unref(state).lastName = $event,
												placeholder: "กรอกนามสกุลของคุณ",
												size: "xl",
												class: "w-full"
											}, null, 8, ["modelValue", "onUpdate:modelValue"])];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(_component_UFormField, {
										label: "เบอร์โทรศัพท์",
										name: "phone",
										required: ""
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_UInput, {
												modelValue: unref(state).phone,
												"onUpdate:modelValue": ($event) => unref(state).phone = $event,
												type: "tel",
												inputmode: "numeric",
												placeholder: "กรอกเบอร์โทรศัพท์ เช่น 0812345678",
												maxlength: "10",
												size: "xl",
												class: "w-full"
											}, null, _parent, _scopeId));
											else return [createVNode(_component_UInput, {
												modelValue: unref(state).phone,
												"onUpdate:modelValue": ($event) => unref(state).phone = $event,
												type: "tel",
												inputmode: "numeric",
												placeholder: "กรอกเบอร์โทรศัพท์ เช่น 0812345678",
												maxlength: "10",
												size: "xl",
												class: "w-full"
											}, null, 8, ["modelValue", "onUpdate:modelValue"])];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(ssrRenderComponent(_component_UFormField, {
										label: "เพศ",
										name: "gender",
										required: ""
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_URadioGroup, {
												modelValue: unref(state).gender,
												"onUpdate:modelValue": ($event) => unref(state).gender = $event,
												items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
												orientation: "horizontal",
												variant: "card",
												class: "gender-grid"
											}, null, _parent, _scopeId));
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
									}, _parent, _scopeId));
									_push(ssrRenderComponent(_component_UFormField, {
										label: "ช่วงอายุ",
										name: "birthYear",
										required: ""
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_component_USelectMenu, {
												modelValue: unref(state).birthYear,
												"onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
												items: unref(ageRangeOptions),
												"value-key": "value",
												placeholder: "เลือกช่วงอายุ",
												size: "xl",
												class: "w-full"
											}, null, _parent, _scopeId));
											else return [createVNode(_component_USelectMenu, {
												modelValue: unref(state).birthYear,
												"onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
												items: unref(ageRangeOptions),
												"value-key": "value",
												placeholder: "เลือกช่วงอายุ",
												size: "xl",
												class: "w-full"
											}, null, 8, [
												"modelValue",
												"onUpdate:modelValue",
												"items"
											])];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(``);
									if (unref(previewAge) !== null) _push(`<div class="age-preview" data-v-3bad5844${_scopeId}><span class="age-preview__label" data-v-3bad5844${_scopeId}>อายุของคุณ</span><span class="age-preview__value" data-v-3bad5844${_scopeId}>${ssrInterpolate(unref(previewAgeRange))}</span></div>`);
									else _push(`<!---->`);
									_push(``);
									if (unref(submitError)) _push(`<p class="submit-error" data-v-3bad5844${_scopeId}>${ssrInterpolate(unref(submitError))}</p>`);
									else _push(`<!---->`);
									_push(ssrRenderComponent(_component_UButton, {
										type: "submit",
										block: "",
										size: "xl",
										color: "primary",
										class: "submit-button",
										loading: unref(isSubmitting),
										disabled: unref(isSubmitting)
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(` เริ่มใช้งาน `);
											else return [createTextVNode(" เริ่มใช้งาน ")];
										}),
										_: 1
									}, _parent, _scopeId));
								} else return [
									createVNode(_component_UFormField, {
										label: "ชื่อ",
										name: "firstName",
										required: ""
									}, {
										default: withCtx(() => [createVNode(_component_UInput, {
											modelValue: unref(state).firstName,
											"onUpdate:modelValue": ($event) => unref(state).firstName = $event,
											placeholder: "กรอกชื่อของคุณ",
											size: "xl",
											class: "w-full"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									createVNode(_component_UFormField, {
										label: "นามสกุล",
										name: "lastName",
										required: ""
									}, {
										default: withCtx(() => [createVNode(_component_UInput, {
											modelValue: unref(state).lastName,
											"onUpdate:modelValue": ($event) => unref(state).lastName = $event,
											placeholder: "กรอกนามสกุลของคุณ",
											size: "xl",
											class: "w-full"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									createVNode(_component_UFormField, {
										label: "เบอร์โทรศัพท์",
										name: "phone",
										required: ""
									}, {
										default: withCtx(() => [createVNode(_component_UInput, {
											modelValue: unref(state).phone,
											"onUpdate:modelValue": ($event) => unref(state).phone = $event,
											type: "tel",
											inputmode: "numeric",
											placeholder: "กรอกเบอร์โทรศัพท์ เช่น 0812345678",
											maxlength: "10",
											size: "xl",
											class: "w-full"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									createVNode(_component_UFormField, {
										label: "เพศ",
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
										label: "ช่วงอายุ",
										name: "birthYear",
										required: ""
									}, {
										default: withCtx(() => [createVNode(_component_USelectMenu, {
											modelValue: unref(state).birthYear,
											"onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
											items: unref(ageRangeOptions),
											"value-key": "value",
											placeholder: "เลือกช่วงอายุ",
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
										}, [createVNode("span", { class: "age-preview__label" }, "อายุของคุณ"), createVNode("span", { class: "age-preview__value" }, toDisplayString(unref(previewAgeRange)), 1)])) : createCommentVNode("", true)]),
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
										default: withCtx(() => [createTextVNode(" เริ่มใช้งาน ")]),
										_: 1
									}, 8, ["loading", "disabled"])
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
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
						createVNode("h1", { class: "title" }, "กรอกข้อมูลผู้ใช้"),
						createVNode("p", { class: "subtitle" }, "กรอกข้อมูลของคุณให้ครบเพื่อเริ่มใช้งานแอปพลิเคชัน"),
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
							}), createTextVNode(" เข้าสู่ระบบด้วย LINE: " + toDisplayString(__props.auth.displayName), 1)]),
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
								label: "ชื่อ",
								name: "firstName",
								required: ""
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(state).firstName,
									"onUpdate:modelValue": ($event) => unref(state).firstName = $event,
									placeholder: "กรอกชื่อของคุณ",
									size: "xl",
									class: "w-full"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormField, {
								label: "นามสกุล",
								name: "lastName",
								required: ""
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(state).lastName,
									"onUpdate:modelValue": ($event) => unref(state).lastName = $event,
									placeholder: "กรอกนามสกุลของคุณ",
									size: "xl",
									class: "w-full"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormField, {
								label: "เบอร์โทรศัพท์",
								name: "phone",
								required: ""
							}, {
								default: withCtx(() => [createVNode(_component_UInput, {
									modelValue: unref(state).phone,
									"onUpdate:modelValue": ($event) => unref(state).phone = $event,
									type: "tel",
									inputmode: "numeric",
									placeholder: "กรอกเบอร์โทรศัพท์ เช่น 0812345678",
									maxlength: "10",
									size: "xl",
									class: "w-full"
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							createVNode(_component_UFormField, {
								label: "เพศ",
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
								label: "ช่วงอายุ",
								name: "birthYear",
								required: ""
							}, {
								default: withCtx(() => [createVNode(_component_USelectMenu, {
									modelValue: unref(state).birthYear,
									"onUpdate:modelValue": ($event) => unref(state).birthYear = $event,
									items: unref(ageRangeOptions),
									"value-key": "value",
									placeholder: "เลือกช่วงอายุ",
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
								}, [createVNode("span", { class: "age-preview__label" }, "อายุของคุณ"), createVNode("span", { class: "age-preview__value" }, toDisplayString(unref(previewAgeRange)), 1)])) : createCommentVNode("", true)]),
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
								default: withCtx(() => [createTextVNode(" เริ่มใช้งาน ")]),
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
//#endregion
//#region components/ProfileForm.vue
var _sfc_setup$1 = ProfileForm_vue_vue_type_script_setup_true_lang_default.setup;
ProfileForm_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProfileForm.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ProfileForm_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(ProfileForm_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3bad5844"]]), { __name: "ProfileForm" });
//#endregion
//#region pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* pages/index.vue
		* ---------------------------------------------------------------------------
		* Controller ของ Step 1-2 (Login + กรอกโปรไฟล์): ตัดสินใจว่าจะแสดงหน้าไหนใน
		* 2 หน้าแรก แล้ว "เข้าสู่หน้า Home ทันที" (หน้าแรกของแอปหลัง Login) ด้วย
		* navigateTo('/home') ทันทีที่มีโปรไฟล์ครบ — ตัวหน้า Home เองอยู่ที่
		* pages/home.vue แยกต่างหาก
		*
		* ลำดับการทำงานตอนเปิดเว็บ (แก้ไขลำดับข้อ 1-2 แล้ว — ดูเหตุผลเต็ม ๆ ที่ onMounted ด้านล่าง):
		* 1) initProfile() -> โหลดโปรไฟล์เดิมจาก LocalStorage ก่อนเสมอ (ไม่แตะเน็ตเวิร์กเลย)
		* 2) มี userProfile ครบแล้ว -> ข้ามทุกอย่างรวมถึง initAuth()/LIFF เข้าหน้า Home ทันที
		*    (Offline First: ผู้ใช้ที่เคย Login ค้างไว้แล้วเปิดแอปได้แม้ไม่มีอินเทอร์เน็ต)
		* 3) initAuth()    -> เช็ค authData เดิม หรือเช็คว่าเพิ่งถูก LINE redirect กลับมา
		*    (ทำเฉพาะกรณียังไม่มีโปรไฟล์เท่านั้น — ขั้นตอนนี้ต้องใช้เน็ตเวิร์กจริง ๆ)
		* 4) เพิ่งได้ authData แบบ LINE ใหม่ (ยังไม่มีโปรไฟล์) -> resolveLineMember():
		*    เช็ค lineUserId กับ Google Sheet ก่อนเสมอ (สเปกใหม่)
		*      - พบ และมี Birth Year/Gender ครบแล้ว -> Login ทันที (loginFromMember) ข้ามฟอร์มไปเลย เข้าหน้า Home
		*      - พบ แต่ Birth Year/Gender ขาดอย่างใดอย่างหนึ่ง -> แสดง <MissingFieldsForm /> ให้กรอก
		*        เฉพาะฟิลด์ที่ขาด แล้วอัปเดตแถวเดิม (ห้ามสร้างแถวใหม่) ก่อนเข้าหน้า Home
		*      - ไม่พบ -> ปล่อยผ่านไปแสดง <ProfileForm /> (Step 2, สมัครสมาชิกใหม่)
		* 5) ยังไม่มีโปรไฟล์ แต่มี authData (Guest หรือ LINE ที่เช็คแล้วไม่พบ) -> แสดง <ProfileForm />
		* 6) ยังไม่มีทั้งคู่ -> แสดง <WelcomePage /> (Step 1)
		*
		* หมายเหตุ: ข้อ 4 กรณี "พบ และครบแล้ว" คือ Logic Login อัตโนมัติเดิมที่ทำงานถูกต้องอยู่แล้ว
		* ไม่ได้ถูกแก้ — เพิ่มแค่การเช็ค Birth Year/Gender ก่อนตัดสินใจนำทางไป /home เท่านั้น
		*
		* หมายเหตุ Offline First: ขั้นตอน 3-6 (initAuth/LIFF, loginByLine, ProfileForm,
		* MissingFieldsForm) ทั้งหมดเกิดขึ้นเฉพาะตอน "ยังไม่เคย Login ให้เสร็จสมบูรณ์"
		* เท่านั้น ซึ่งเป็นขั้นตอนยืนยันตัวตนครั้งแรกที่จำเป็นต้องใช้อินเทอร์เน็ตอยู่แล้ว
		* โดยธรรมชาติ (ไม่ว่าจะ Login ผ่าน LINE จริงหรือสร้างสมาชิกใหม่ผ่าน Google Sheet)
		* — เมื่อ Login สำเร็จครั้งแรกและมี userProfile ใน LocalStorage แล้ว (ข้อ 2)
		* การเปิดแอปครั้งต่อ ๆ ไปจะไม่แตะเน็ตเวิร์กจากไฟล์นี้อีกเลย
		*/
		const { authData, hasAuth, isLineLoading, lineError, initAuth, loginWithLine, loginAsGuest } = useAuth();
		const { profile, hasProfile, initProfile, loginFromMember } = useProfile();
		const { loginByLine } = useMemberApi();
		const { isOfflineMode, startRound } = useOfflineMode();
		const isReady = ref(false);
		const pendingMember = ref(null);
		/** true ถ้าสมาชิกคนนี้ยังขาด Birth Year หรือ Gender อย่างใดอย่างหนึ่งใน Google Sheet */
		function hasMissingFields(member) {
			return !member.birthYear || !member.gender;
		}
		/**
		* ตรวจสอบ lineUserId กับ Google Sheet ก่อนเสมอเวลามี authData แบบ LINE ใหม่ ๆ
		* (สเปก: "Login ผ่าน LINE ให้ตรวจสอบ lineUserId ใน Google Sheet ก่อน พบ -> Login
		* ทันที ไม่พบ -> ไปหน้าสมัครสมาชิก") — ถ้าพบแต่ Birth Year/Gender ยังขาด จะพักไว้ที่
		* pendingMember แทนการนำทางไป /home ทันที (ให้ <MissingFieldsForm /> จัดการต่อ)
		*/
		async function resolveLineMember() {
			if (authData.value?.loginType !== "line" || hasProfile.value) return;
			const lineUserId = authData.value.uid;
			console.log("[resolveLineMember] เรียก loginByLine ด้วย lineUserId:", lineUserId);
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
				if (!result.success) console.error("[resolveLineMember] loginByLine ตอบ error:", result.error, "| response ทั้งก้อน:", result);
			} catch (err) {
				console.error("[resolveLineMember] loginByLine เรียกไม่สำเร็จ:", err);
			}
		}
		/** Step 1: กด "เข้าสู่ระบบด้วย LINE" — ครอบ loginWithLine() เดิม แล้วเช็ค lineUserId ต่อทันที */
		async function handleSelectLine() {
			if (isOfflineMode.value) return;
			await loginWithLine();
			if (authData.value?.loginType === "line" && !hasProfile.value) {
				isReady.value = false;
				await resolveLineMember();
				isReady.value = true;
			}
		}
		function handleRegistered() {
			if (isOfflineMode.value && profile.value?.uid) startRound(profile.value.uid);
			navigateTo("/home");
		}
		/** MissingFieldsForm อัปเดตแถวเดิมสำเร็จแล้ว (Birth Year/Gender ครบแล้ว) -> Login เข้าหน้า Home ทันที */
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
//#endregion
//#region pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-db64fc9f"]]);
//#endregion
export { pages_default as default };

//# sourceMappingURL=pages-BHo-uPyE.js.map