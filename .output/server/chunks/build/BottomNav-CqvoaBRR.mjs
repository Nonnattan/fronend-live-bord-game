import { _ as _plugin_vue_export_helper_default, u as useRoute, N as NuxtLink, b as _sfc_main$7 } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

//#region components/BottomNav.vue?vue&type=script&setup=true&lang.ts
var BottomNav_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "BottomNav",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* components/BottomNav.vue
		* ---------------------------------------------------------------------------
		* Bottom Navigation ของแอป: Home | Map | Scan QR | Profile | Info
		* ปุ่ม "Scan QR" อยู่ตรงกลางแบบยกลอยขึ้น (Floating) ทับแถบเมนูเสมอ จัดด้วย
		* position: absolute ให้อยู่กึ่งกลางแนวนอนของแถบจริง ๆ (ไม่ใช่แค่กึ่งกลางของ
		* flex ฝั่งที่เหลือ) ทำหน้าที่เป็นทั้ง 1 ใน 5 เมนูของ Bottom Navigation และ
		* "ปุ่ม Scan QR Code แบบ Floating Button" ในเวลาเดียวกัน
		*/
		const route = useRoute();
		const sideItems = [{
			label: "หน้าแรก",
			icon: "i-lucide-house",
			to: "/home"
		}, {
			label: "แผนที่",
			icon: "i-lucide-map-pin",
			to: "/map"
		}];
		const sideItemsRight = [{
			label: "โปรไฟล์",
			icon: "i-lucide-user-round",
			to: "/profile"
		}, {
			label: "Info",
			icon: "i-lucide-info",
			to: "/info"
		}];
		function isActive(to) {
			return route.path === to;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_UIcon = _sfc_main$7;
			_push(`<nav${ssrRenderAttrs(mergeProps({ class: "bottom-nav" }, _attrs))} data-v-a939cb35><div class="bottom-nav__side bottom-nav__side--left" data-v-a939cb35><!--[-->`);
			ssrRenderList(sideItems, (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.to,
					to: item.to,
					class: ["bottom-nav__item", { "bottom-nav__item--active": isActive(item.to) }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(_component_UIcon, {
								name: item.icon,
								class: "bottom-nav__icon"
							}, null, _parent, _scopeId));
							_push(`<span class="bottom-nav__label" data-v-a939cb35${_scopeId}>${ssrInterpolate(item.label)}</span>`);
						} else return [createVNode(_component_UIcon, {
							name: item.icon,
							class: "bottom-nav__icon"
						}, null, 8, ["name"]), createVNode("span", { class: "bottom-nav__label" }, toDisplayString(item.label), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/scan",
				class: "bottom-nav__scan-wrap"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<span class="${ssrRenderClass([{ "bottom-nav__scan--active": isActive("/scan") }, "bottom-nav__scan"])}" data-v-a939cb35${_scopeId}>`);
						_push(ssrRenderComponent(_component_UIcon, {
							name: "i-lucide-scan-line",
							class: "bottom-nav__scan-icon"
						}, null, _parent, _scopeId));
						_push(`</span><span class="bottom-nav__label bottom-nav__label--scan" data-v-a939cb35${_scopeId}>Scan QR</span>`);
					} else return [createVNode("span", { class: ["bottom-nav__scan", { "bottom-nav__scan--active": isActive("/scan") }] }, [createVNode(_component_UIcon, {
						name: "i-lucide-scan-line",
						class: "bottom-nav__scan-icon"
					})], 2), createVNode("span", { class: "bottom-nav__label bottom-nav__label--scan" }, "Scan QR")];
				}),
				_: 1
			}, _parent));
			_push(`<div class="bottom-nav__side bottom-nav__side--right" data-v-a939cb35><!--[-->`);
			ssrRenderList(sideItemsRight, (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.to,
					to: item.to,
					class: ["bottom-nav__item", { "bottom-nav__item--active": isActive(item.to) }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(_component_UIcon, {
								name: item.icon,
								class: "bottom-nav__icon"
							}, null, _parent, _scopeId));
							_push(`<span class="bottom-nav__label" data-v-a939cb35${_scopeId}>${ssrInterpolate(item.label)}</span>`);
						} else return [createVNode(_component_UIcon, {
							name: item.icon,
							class: "bottom-nav__icon"
						}, null, 8, ["name"]), createVNode("span", { class: "bottom-nav__label" }, toDisplayString(item.label), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></nav>`);
		};
	}
});
//#endregion
//#region components/BottomNav.vue
var _sfc_setup = BottomNav_vue_vue_type_script_setup_true_lang_default.setup;
BottomNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomNav.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var BottomNav_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(BottomNav_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a939cb35"]]), { __name: "BottomNav" });

export { BottomNav_default as B };
//# sourceMappingURL=BottomNav-CqvoaBRR.mjs.map
