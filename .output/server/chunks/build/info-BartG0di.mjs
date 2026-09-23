import { _ as _sfc_main } from './Modal-BIBajBOZ.mjs';
import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, isRef, createVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import './usePortal-CFE28n6Q.mjs';
import './useForwardExpose-lTVrimVg.mjs';
import '@vueuse/core';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import '@vueuse/shared';
import 'aria-hidden';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue-router';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@iconify/vue';
import 'tailwindcss/colors';
import '@iconify/utils/lib/css/icon';
import 'tailwind-variants';
import './useProfile-Di4CdYil.mjs';
import 'zod';

//#region pages/info.vue?vue&type=script&setup=true&lang.ts
/** ข้อมูล 4 ฐาน — บนหน้าหลักโชว์แค่ icon/name/summary ส่วนที่เหลือไปอยู่ใน Modal */
var info_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "info",
	__ssrInlineRender: true,
	setup(__props) {
		const { isReady } = useRequireProfile();
		/** เวลาทำการ — แสดงเป็นแถบสั้น ๆ ด้านบนสุดของเนื้อหา */
		const openingHours = {
			icon: "i-lucide-clock",
			title: "เวลาทำการ",
			desc: "ทุกวัน 10:00 - 21:00 น."
		};
		const stationInfoCards = [
			{
				id: "corn",
				icon: "🌽",
				name: "ฐานข้าวโพด",
				summary: "เรียนรู้เส้นทางข้าวโพดตั้งแต่ไร่ถึงจาน สัมผัสแปลงปลูกจริงและร่วมกิจกรรมเก็บเกี่ยว",
				color: "#f2b134",
				history: "ฐานข้าวโพดตั้งอยู่กลางแปลงปลูกจริงของฟาร์ม ปลูกข้าวโพดหวานพันธุ์พื้นเมืองมากว่า 20 ปี เป็นจุดเริ่มต้นของเส้นทางผลิตอาหารสัตว์ให้ฟาร์มโคนม",
				highlights: [
					"แปลงข้าวโพดจริงกลางแจ้ง ให้เดินชมและถ่ายรูปได้ทั่วบริเวณ",
					"มีป้ายให้ความรู้เรื่องวงจรชีวิตข้าวโพดตลอดเส้นทาง",
					"อากาศโปร่งสบาย เหมาะกับการเดินเล่นช่วงเช้า-เย็น"
				],
				activities: [
					"ร่วมกิจกรรมเก็บเกี่ยวข้าวโพดตามฤดูกาล",
					"ทดลองปอกเปลือกและแกะเมล็ดข้าวโพดด้วยตัวเอง",
					"สแกน QR Code ที่ป้ายประจำฐานเพื่อสะสมคะแนน"
				]
			},
			{
				id: "cow",
				icon: "🐄",
				name: "ฐานวัว",
				summary: "ใกล้ชิดฝูงวัวนมของฟาร์ม เรียนรู้วิถีการเลี้ยงดูและให้อาหารแบบมืออาชีพ",
				color: "#c98a12",
				history: "โรงเลี้ยงวัวนมของฟาร์มดูแลฝูงวัวพันธุ์นมคุณภาพดีมากกว่า 50 ตัว ภายใต้มาตรฐานสวัสดิภาพสัตว์ เป็นแหล่งน้ำนมดิบหลักของผลิตภัณฑ์ทั้งหมดในฟาร์ม",
				highlights: [
					"ฝูงวัวนมสุขภาพดี เลี้ยงแบบปล่อยในคอกโปร่งอากาศถ่ายเทดี",
					"เจ้าหน้าที่ประจำฐานพร้อมให้ความรู้ตลอดเวลา",
					"จุดถ่ายรูปกับวัวนมแบบใกล้ชิดปลอดภัย"
				],
				activities: [
					"ร่วมกิจกรรมป้อนอาหารวัวภายใต้การดูแลของเจ้าหน้าที่",
					"ชมสาธิตขั้นตอนการรีดนมวัวแบบย่อ",
					"สแกน QR Code ที่ป้ายประจำฐานเพื่อสะสมคะแนน"
				]
			},
			{
				id: "soil",
				icon: "🌱",
				name: "ฐานดิน",
				summary: "ทำความรู้จักดินอุดมสมบูรณ์ที่หล่อเลี้ยงฟาร์ม พร้อมกิจกรรมปลูกและปั้นดินสนุก ๆ",
				color: "#5a9e33",
				history: "ฐานดินอยู่บริเวณแปลงทดลองปุ๋ยหมักของฟาร์ม ใช้มูลวัวจากฐานวัวมาหมักเป็นปุ๋ยอินทรีย์หมุนเวียนกลับไปบำรุงแปลงข้าวโพด ครบวงจรฟาร์มยั่งยืน",
				highlights: [
					"ดินอุดมสมบูรณ์จากการหมักปุ๋ยอินทรีย์ของฟาร์มเอง",
					"มีจุดสาธิตการหมักปุ๋ยแบบครบวงจร",
					"เหมาะสำหรับเด็ก ๆ ที่อยากเรียนรู้เรื่องธรรมชาติแบบลงมือทำ"
				],
				activities: [
					"ลงมือปลูกต้นกล้าลงกระถางกลับบ้านได้",
					"ทดลองปั้นดิน/กระถางจากดินเหนียวของฟาร์ม",
					"สแกน QR Code ที่ป้ายประจำฐานเพื่อสะสมคะแนน"
				]
			},
			{
				id: "milk",
				icon: "🥛",
				name: "ฐานนม",
				summary: "ตามรอยนมสดจากฟาร์มสู่ขวด ชิมผลิตภัณฑ์นมสด ๆ และเก็บภาพความประทับใจ",
				color: "#5cb8e0",
				history: "ฐานนมคือปลายทางของเส้นทางผลิตนมทั้งหมด ตั้งแต่วัตถุดิบอาหารสัตว์ การเลี้ยงดู จนถึงกระบวนการแปรรูปเป็นผลิตภัณฑ์นมพร้อมดื่มของฟาร์ม",
				highlights: [
					"ได้ชิมนมสดแปรรูปใหม่จากฟาร์มโดยตรง",
					"จุดถ่ายรูปธีมฟาร์มนมสวยงามหลายมุม",
					"เป็นฐานสุดท้ายของเส้นทาง เข้าฐานนี้ถือว่าครบเส้นทางทั้งหมด"
				],
				activities: [
					"ชิมผลิตภัณฑ์นมสดของฟาร์มฟรี 1 แก้วต่อคน",
					"เลือกซื้อผลิตภัณฑ์นมกลับบ้านที่ร้านค้าประจำฐาน",
					"สแกน QR Code ที่ป้ายประจำฐานเพื่อสรุปคะแนนและ Sync ข้อมูล"
				]
			}
		];
		/** ช่องทางติดต่อ — Section ปิดท้ายสุดของหน้า */
		const contactChannels = [
			{
				icon: "i-lucide-phone",
				label: "โทรหาเรา",
				value: "02-123-4567",
				href: "tel:021234567"
			},
			{
				icon: "i-simple-icons-facebook",
				label: "Facebook",
				value: "facebook.com/ourbrand",
				href: "https://facebook.com/ourbrand"
			},
			{
				icon: "i-simple-icons-instagram",
				label: "Instagram",
				value: "@ourbrand",
				href: "https://instagram.com/ourbrand"
			},
			{
				icon: "i-simple-icons-line",
				label: "LINE",
				value: "เพิ่มเพื่อนทางไลน์",
				href: "https://line.me/"
			}
		];
		const isDetailOpen = ref(false);
		const selectedStation = ref(null);
		function openStationDetail(station) {
			selectedStation.value = station;
			isDetailOpen.value = true;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			const _component_UButton = _sfc_main$2;
			const _component_UModal = _sfc_main;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-db07947c>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "Info" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="page__loading" data-v-db07947c>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "page__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="page__content" data-v-db07947c><div class="hours-row" data-v-db07947c>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: openingHours.icon,
					class: "hours-row__icon"
				}, null, _parent));
				_push(`<div data-v-db07947c><p class="hours-row__title" data-v-db07947c>${ssrInterpolate(openingHours.title)}</p><p class="hours-row__desc" data-v-db07947c>${ssrInterpolate(openingHours.desc)}</p></div></div><section class="stations-section" data-v-db07947c><h2 class="section-title" data-v-db07947c>ฐานกิจกรรมทั้งหมด</h2><div class="station-list" data-v-db07947c><!--[-->`);
				ssrRenderList(stationInfoCards, (station) => {
					_push(`<article class="station-card" style="${ssrRenderStyle({ "--station-color": station.color })}" data-v-db07947c><div class="station-card__top" data-v-db07947c><div class="station-card__icon-wrap" data-v-db07947c><span class="station-card__icon" data-v-db07947c>${ssrInterpolate(station.icon)}</span></div><div class="station-card__body" data-v-db07947c><h3 class="station-card__name" data-v-db07947c>${ssrInterpolate(station.name)}</h3><p class="station-card__desc" data-v-db07947c>${ssrInterpolate(station.summary)}</p></div></div>`);
					_push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "primary",
						variant: "soft",
						size: "sm",
						class: "station-card__btn",
						onClick: ($event) => openStationDetail(station)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` ดูรายละเอียด `);
							else return [createTextVNode(" ดูรายละเอียด ")];
						}),
						_: 2
					}, _parent));
					_push(`</article>`);
				});
				_push(`<!--]--></div></section><section class="contact-section" data-v-db07947c><h2 class="section-title" data-v-db07947c>ติดต่อเรา</h2><div class="contact-grid" data-v-db07947c><!--[-->`);
				ssrRenderList(contactChannels, (channel) => {
					_push(`<a${ssrRenderAttr("href", channel.href)} target="_blank" rel="noopener noreferrer" class="contact-btn" data-v-db07947c><span class="contact-btn__icon-wrap" data-v-db07947c>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: channel.icon,
						class: "contact-btn__icon"
					}, null, _parent));
					_push(`</span><span class="contact-btn__text" data-v-db07947c><span class="contact-btn__label" data-v-db07947c>${ssrInterpolate(channel.label)}</span><span class="contact-btn__value" data-v-db07947c>${ssrInterpolate(channel.value)}</span></span></a>`);
				});
				_push(`<!--]--></div></section></div>`);
			}
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(isDetailOpen),
				"onUpdate:open": ($event) => isRef(isDetailOpen) ? isDetailOpen.value = $event : null,
				title: unref(selectedStation)?.name ?? ""
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(selectedStation)) {
							_push(`<div class="station-detail" style="${ssrRenderStyle({ "--station-color": unref(selectedStation).color })}" data-v-db07947c${_scopeId}><div class="station-detail__hero" data-v-db07947c${_scopeId}><span class="station-detail__icon" data-v-db07947c${_scopeId}>${ssrInterpolate(unref(selectedStation).icon)}</span></div><section class="station-detail__block" data-v-db07947c${_scopeId}><h4 class="station-detail__heading" data-v-db07947c${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-scroll-text",
								class: "station-detail__heading-icon"
							}, null, _parent, _scopeId));
							_push(` ประวัติโดยสรุป </h4><p class="station-detail__text" data-v-db07947c${_scopeId}>${ssrInterpolate(unref(selectedStation).history)}</p></section><section class="station-detail__block" data-v-db07947c${_scopeId}><h4 class="station-detail__heading" data-v-db07947c${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-badge-star",
								class: "station-detail__heading-icon"
							}, null, _parent, _scopeId));
							_push(` จุดเด่นของฐาน </h4><ul class="station-detail__list" data-v-db07947c${_scopeId}><!--[-->`);
							ssrRenderList(unref(selectedStation).highlights, (item) => {
								_push(`<li data-v-db07947c${_scopeId}>${ssrInterpolate(item)}</li>`);
							});
							_push(`<!--]--></ul></section><section class="station-detail__block" data-v-db07947c${_scopeId}><h4 class="station-detail__heading" data-v-db07947c${_scopeId}>`);
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-gamepad-2",
								class: "station-detail__heading-icon"
							}, null, _parent, _scopeId));
							_push(` กิจกรรม/วิธีเล่น </h4><ul class="station-detail__list" data-v-db07947c${_scopeId}><!--[-->`);
							ssrRenderList(unref(selectedStation).activities, (item) => {
								_push(`<li data-v-db07947c${_scopeId}>${ssrInterpolate(item)}</li>`);
							});
							_push(`<!--]--></ul></section></div>`);
						} else _push(`<!---->`);
					} else return [unref(selectedStation) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "station-detail",
						style: { "--station-color": unref(selectedStation).color }
					}, [
						createVNode("div", { class: "station-detail__hero" }, [createVNode("span", { class: "station-detail__icon" }, toDisplayString(unref(selectedStation).icon), 1)]),
						createVNode("section", { class: "station-detail__block" }, [createVNode("h4", { class: "station-detail__heading" }, [createVNode(_component_UIcon, {
							name: "i-lucide-scroll-text",
							class: "station-detail__heading-icon"
						}), createTextVNode(" ประวัติโดยสรุป ")]), createVNode("p", { class: "station-detail__text" }, toDisplayString(unref(selectedStation).history), 1)]),
						createVNode("section", { class: "station-detail__block" }, [createVNode("h4", { class: "station-detail__heading" }, [createVNode(_component_UIcon, {
							name: "i-lucide-badge-star",
							class: "station-detail__heading-icon"
						}), createTextVNode(" จุดเด่นของฐาน ")]), createVNode("ul", { class: "station-detail__list" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(selectedStation).highlights, (item) => {
							return openBlock(), createBlock("li", { key: item }, toDisplayString(item), 1);
						}), 128))])]),
						createVNode("section", { class: "station-detail__block" }, [createVNode("h4", { class: "station-detail__heading" }, [createVNode(_component_UIcon, {
							name: "i-lucide-gamepad-2",
							class: "station-detail__heading-icon"
						}), createTextVNode(" กิจกรรม/วิธีเล่น ")]), createVNode("ul", { class: "station-detail__list" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(selectedStation).activities, (item) => {
							return openBlock(), createBlock("li", { key: item }, toDisplayString(item), 1);
						}), 128))])])
					], 4)) : createCommentVNode("", true)];
				}),
				footer: withCtx(({ close }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UButton, {
						block: "",
						color: "neutral",
						variant: "subtle",
						onClick: close
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`ปิด`);
							else return [createTextVNode("ปิด")];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(_component_UButton, {
						block: "",
						color: "neutral",
						variant: "subtle",
						onClick: close
					}, {
						default: withCtx(() => [createTextVNode("ปิด")]),
						_: 1
					}, 8, ["onClick"])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/info.vue
var _sfc_setup = info_vue_vue_type_script_setup_true_lang_default.setup;
info_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/info.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var info_default = /*#__PURE__*/ _plugin_vue_export_helper_default(info_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-db07947c"]]);

export { info_default as default };
//# sourceMappingURL=info-BartG0di.mjs.map
