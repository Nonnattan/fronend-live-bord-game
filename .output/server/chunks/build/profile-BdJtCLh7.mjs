import { _ as _sfc_main, a as _sfc_main$1$1 } from './Badge-TsOgYTPt.mjs';
import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7, d as _sfc_main$5, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useProfile, g as getAgeRangeOptions, G as GENDER_OPTIONS, p as profileSchema, b as birthYearRangeValueFor } from './useProfile-Di4CdYil.mjs';
import { u as useMemberApi } from './useMemberApi-CZogIGln.mjs';
import { u as useRequireProfile } from './useRequireProfile-DlhceP1F.mjs';
import { u as useAdventure } from './useAdventure-OrKGgcht.mjs';
import { u as useAuth } from './useAuth-CqLYPeWu.mjs';
import { _ as _sfc_main$1 } from './Input-D4Sia_6G.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
import '@tanstack/vue-virtual';
import '@floating-ui/vue';
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
import 'zod';

//#region components/OfflineSummaryCard.vue?vue&type=script&setup=true&lang.ts
var OfflineSummaryCard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "OfflineSummaryCard",
	__ssrInlineRender: true,
	props: {
		uid: {},
		startedAt: {},
		endedAt: {},
		playedStationNames: {},
		remainingStationNames: {}
	},
	setup(__props) {
		/**
		* components/OfflineSummaryCard.vue
		* ---------------------------------------------------------------------------
		* Card สรุปการเล่นแบบ Offline Mode (ข้อ 11 ในสเปก) — แสดงในหน้า Profile
		* ใต้ Profile Card เดิม (ดู pages/profile.vue) เป็น Presentational component
		* ล้วน ๆ รับข้อมูลทั้งหมดผ่าน props (อ่านจาก composables/useOfflineMode.ts)
		* ไม่มี Logic ของตัวเอง เพื่อให้ทดสอบ/ใช้ซ้ำได้ง่าย
		*/
		const props = __props;
		function formatDateTime(ms) {
			if (!ms) return "-";
			return new Date(ms).toLocaleString("th-TH");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "offline-summary-card" }, _attrs))} data-v-01dae1d2><div class="offline-summary-card__header" data-v-01dae1d2>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-wifi-off",
				class: "offline-summary-card__icon"
			}, null, _parent));
			_push(`<div data-v-01dae1d2><p class="offline-summary-card__title" data-v-01dae1d2>สรุปการเล่นแบบออฟไลน์</p><p class="offline-summary-card__subtitle" data-v-01dae1d2>Offline Mode</p></div></div><div class="offline-summary-card__rows" data-v-01dae1d2><div class="offline-summary-card__row" data-v-01dae1d2><span class="offline-summary-card__label" data-v-01dae1d2>UID</span><code class="offline-summary-card__value offline-summary-card__value--mono" data-v-01dae1d2>${ssrInterpolate(props.uid)}</code></div><div class="offline-summary-card__row" data-v-01dae1d2><span class="offline-summary-card__label" data-v-01dae1d2>เวลาเริ่ม</span><span class="offline-summary-card__value" data-v-01dae1d2>${ssrInterpolate(formatDateTime(props.startedAt))}</span></div><div class="offline-summary-card__row" data-v-01dae1d2><span class="offline-summary-card__label" data-v-01dae1d2>เวลาจบ</span><span class="offline-summary-card__value" data-v-01dae1d2>${ssrInterpolate(formatDateTime(props.endedAt))}</span></div><div class="offline-summary-card__row" data-v-01dae1d2><span class="offline-summary-card__label" data-v-01dae1d2>จำนวนฐานที่เล่น</span><span class="offline-summary-card__value" data-v-01dae1d2>${ssrInterpolate(props.playedStationNames.length)}</span></div></div><div class="offline-summary-card__list" data-v-01dae1d2><p class="offline-summary-card__list-title" data-v-01dae1d2>ฐานที่เล่นแล้ว</p>`);
			if (props.playedStationNames.length === 0) _push(`<p class="offline-summary-card__empty" data-v-01dae1d2> ยังไม่ได้เล่นฐานใดเลย </p>`);
			else {
				_push(`<ul class="offline-summary-card__chips" data-v-01dae1d2><!--[-->`);
				ssrRenderList(props.playedStationNames, (name, index) => {
					_push(`<li class="offline-summary-card__chip offline-summary-card__chip--done" data-v-01dae1d2>${ssrInterpolate(index + 1)}. ${ssrInterpolate(name)}</li>`);
				});
				_push(`<!--]--></ul>`);
			}
			_push(`</div><div class="offline-summary-card__list" data-v-01dae1d2><p class="offline-summary-card__list-title" data-v-01dae1d2>ฐานที่เหลือ</p>`);
			if (props.remainingStationNames.length === 0) _push(`<p class="offline-summary-card__empty" data-v-01dae1d2> เล่นครบทุกฐานแล้ว </p>`);
			else {
				_push(`<ul class="offline-summary-card__chips" data-v-01dae1d2><!--[-->`);
				ssrRenderList(props.remainingStationNames, (name) => {
					_push(`<li class="offline-summary-card__chip" data-v-01dae1d2>${ssrInterpolate(name)}</li>`);
				});
				_push(`<!--]--></ul>`);
			}
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region components/OfflineSummaryCard.vue
var _sfc_setup$1 = OfflineSummaryCard_vue_vue_type_script_setup_true_lang_default.setup;
OfflineSummaryCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OfflineSummaryCard.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var OfflineSummaryCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(OfflineSummaryCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-01dae1d2"]]), { __name: "OfflineSummaryCard" });
//#endregion
//#region pages/profile.vue?vue&type=script&setup=true&lang.ts
var profile_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "profile",
	__ssrInlineRender: true,
	setup(__props) {
		const { profile, isReady } = useRequireProfile();
		useAuth();
		const { updateEditableFields } = useProfile();
		const { updateMember } = useMemberApi();
		const { stations } = useAdventure();
		/**
		* แก้ไขข้อมูลโปรไฟล์ (ข้อ Profile ใหม่): ชื่อ/นามสกุล/เบอร์โทร/เพศ/ช่วงปีเกิด — 5 รายการ
		* (ไม่แตะ UID/Point/Round/Journey เลย)
		* ใช้ "โหมดแก้ไข" เดียวคุมทั้ง 5 ฟิลด์พร้อมกัน (กดดินสอที่ชื่อ -> ชื่อ/นามสกุล/เบอร์โทร
		* กลายเป็น input, เพศ/ช่วงปีเกิดกลายเป็น Dropdown) แล้วกดปุ่ม "บันทึก"/"ยกเลิก"
		* ทีเดียวตามสเปก ("มีปุ่มบันทึกและยกเลิก ตอนอยู่ในโหมดแก้ไข")
		*
		* ส่งไปอัปเดตผ่าน action 'updateMember' เดิม (composables/useMemberApi.ts) ด้วย
		* memberId ของสมาชิกเดิมเท่านั้น — ฝั่ง server-gas (actionUpdateMember_) การันตี
		* "ห้ามสร้างแถวใหม่" อยู่แล้ว (หาแถวไม่เจอ -> คืน error ทันที ไม่ appendRow)
		*
		* เบอร์โทร: validate ด้วย regex เดียวกับตอนสมัคร (profileSchema.shape.phone ใน
		* utils/profileSchema.ts) เก็บเป็น string เสมอ (ไม่แปลงเป็นตัวเลข) เพื่อไม่ให้เลข 0
		* นำหน้าหาย — ฝั่ง server-gas ก็บังคับ format คอลัมน์ Phone Number เป็น Plain Text
		* ไว้แล้วเช่นกัน (ดู ensurePhoneColumnIsText_ ใน server-gas/Code.gs) กันชีตแปลงเป็น
		* ตัวเลขเองตอนบันทึก
		*/
		const ageRangeOptions = getAgeRangeOptions();
		const isEditingProfile = ref(false);
		const editFirstName = ref("");
		const editLastName = ref("");
		const editPhone = ref("");
		const editGender = ref(void 0);
		/** ปีเกิดตัวแทน (ตรงกับ value ใน ageRangeOptions) — ไม่ใช่ birthYearRange ตรง ๆ
		* เพราะ USelectMenu ต้องผูกกับ value ที่เป็นตัวเลขเดียวไม่ซ้ำกันของแต่ละตัวเลือก */
		const editBirthYearValue = ref(void 0);
		const editSubmitting = ref(false);
		const editError = ref("");
		/** ยกเลิกโหมดแก้ไข — ไม่มีการเรียก API ใด ๆ ทั้งสิ้น โปรไฟล์กลับไปแสดงค่าเดิมทันที */
		function cancelEditProfile() {
			isEditingProfile.value = false;
			editError.value = "";
		}
		async function saveEditProfile() {
			const memberId = profile.value?.memberId;
			if (!memberId) {
				editError.value = "ไม่พบ Member ID ของสมาชิก กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง";
				return;
			}
			const firstName = editFirstName.value.trim();
			const lastName = editLastName.value.trim();
			const phone = editPhone.value.trim();
			if (firstName.length < 2) {
				editError.value = "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร";
				return;
			}
			if (lastName.length < 2) {
				editError.value = "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร";
				return;
			}
			const phoneCheck = profileSchema.shape.phone.safeParse(phone);
			if (!phoneCheck.success) {
				editError.value = phoneCheck.error.issues[0]?.message || "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง";
				return;
			}
			if (!editGender.value) {
				editError.value = "กรุณาเลือกเพศ";
				return;
			}
			if (!editBirthYearValue.value) {
				editError.value = "กรุณาเลือกช่วงปีเกิด";
				return;
			}
			editSubmitting.value = true;
			editError.value = "";
			try {
				const result = await updateMember(memberId, {
					firstName,
					lastName,
					phone: phoneCheck.data,
					gender: editGender.value,
					birthYear: birthYearRangeValueFor(editBirthYearValue.value)
				});
				if (!result.success || !result.member) {
					editError.value = result.error || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
					return;
				}
				updateEditableFields(result.member);
				isEditingProfile.value = false;
			} catch (err) {
				editError.value = err instanceof Error ? err.message : "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
			} finally {
				editSubmitting.value = false;
			}
		}
		const { isOfflineMode, roundData} = useOfflineMode();
		/** รายชื่อฐานที่เล่นแล้ว เรียงตามลำดับที่สแกนสำเร็จจริง (ข้อ 8: ลำดับฐาน) */
		const playedStationNames = computed(() => {
			if (!roundData.value) return [];
			return [...roundData.value.stations].sort((a, b) => a.order - b.order).map((s) => s.stationName);
		});
		/** รายชื่อฐานที่เหลือ (ยังไม่ได้สแกนใน Log ของรอบ Offline Mode นี้) */
		const remainingStationNames = computed(() => {
			if (!roundData.value) return [];
			const playedIds = new Set(roundData.value.stations.map((s) => s.stationId));
			return stations.value.filter((s) => !playedIds.has(s.id)).map((s) => s.name);
		});
		/**
		* Online Game Summary Card (ใหม่) — สรุปการเล่นแบบ "ออนไลน์" ใต้ Profile Card
		* reuse API/Service เดิมทั้งหมดผ่าน useMemberApi() (getRound/getJourney) — [Fix]
		* ไม่ใช้ getScore() (คะแนนสะสมทั้งชีวิต) แล้ว เพราะสเปก Profile Card ต้องการ
		* "คะแนนสะสมของ Round" เท่านั้น ซึ่งคำนวณจาก Journey ที่กรอง roundId ด้านล่างได้
		* อยู่แล้วโดยไม่ต้องยิง API เพิ่ม ไม่แตะ Map/QR/Journey(useJourney.ts)/Round(useRound.ts) หรือ Offline Mode เลย
		* ห้ามใช้ข้อมูล Offline (roundData/OfflineSummaryCard ด้านบน) มาแสดงในการ์ดนี้
		* เด็ดขาดตามสเปก — ข้อมูลหลักคือ "Journey ของ Round ปัจจุบัน" (กรองด้วย roundId
		* ที่ได้จาก getRound() สด ๆ ทุกครั้งที่โหลด ไม่ใช่แค่ currentRoundId ในหน่วยความจำ
		* ของ useRound() เพราะอยากได้ Status ล่าสุดจริงจาก Sheet เสมอ)
		*/
		const { getRound, getJourney } = useMemberApi();
		const onlineRoundStatus = ref(null);
		const onlineDoneStationIds = ref(/* @__PURE__ */ new Set());
		const onlineRoundScore = ref(null);
		/** ฐานล่าสุดที่สแกนผ่านในรอบปัจจุบัน (เรียงตาม Timestamp) — null = ยังไม่ผ่านฐานไหนเลย */
		const onlineCurrentStationName = ref(null);
		/** เวลาเริ่ม/จบ Round ปัจจุบัน — มาจาก RoundEntry.startTime/endTime ตรง ๆ (ของเดิมที่
		* server-gas ส่งมาอยู่แล้วทุกครั้ง แค่ไม่เคยถูกนำมาแสดงผลในหน้านี้) */
		const onlineRoundStartTime = ref(null);
		const onlineRoundEndTime = ref(null);
		const onlineSummaryLoading = ref(false);
		const onlineSummaryError = ref(false);
		const onlineSummaryLoaded = ref(false);
		computed(() => stations.value.map((s) => ({
			id: s.id,
			name: s.name,
			done: onlineDoneStationIds.value.has(s.id)
		})));
		/** ดึงข้อมูล Online Summary ล่าสุดจาก server-gas — เรียกได้ซ้ำได้เสมอ (ปุ่มรีเฟรช
		* ในการ์ด + เรียกอัตโนมัติทุกครั้งที่หน้า Profile mount/กลับมา active หลัง Scan) */
		async function loadOnlineSummary() {
			const memberId = profile.value?.memberId;
			if (!memberId || isOfflineMode.value) return;
			onlineSummaryLoading.value = true;
			onlineSummaryError.value = false;
			try {
				const roundRes = await getRound(memberId);
				if (!roundRes.success) throw new Error(roundRes.error || "getRound failed");
				const round = roundRes.round ?? null;
				onlineRoundStatus.value = round ? round.status === "Ended" ? "Ended" : "Started" : null;
				onlineRoundStartTime.value = round?.startTime ?? null;
				onlineRoundEndTime.value = round?.endTime ?? null;
				if (!round) {
					onlineDoneStationIds.value = /* @__PURE__ */ new Set();
					onlineRoundScore.value = null;
					onlineCurrentStationName.value = null;
				} else {
					const journeyRes = await getJourney(memberId);
					if (journeyRes.success && journeyRes.journey) {
						const roundJourney = journeyRes.journey.filter((entry) => entry.roundId === round.roundId);
						onlineDoneStationIds.value = new Set(roundJourney.map((entry) => entry.stationId));
						onlineRoundScore.value = roundJourney.reduce((sum, entry) => sum + (Number(entry.point) || 0), 0);
						const latestEntry = [...roundJourney].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).at(-1);
						onlineCurrentStationName.value = latestEntry?.stationName ?? null;
					} else {
						onlineDoneStationIds.value = /* @__PURE__ */ new Set();
						onlineRoundScore.value = 0;
						onlineCurrentStationName.value = null;
					}
				}
				onlineSummaryLoaded.value = true;
			} catch {
				onlineSummaryError.value = true;
			} finally {
				onlineSummaryLoading.value = false;
			}
		}
		watch(isReady, (ready) => {
			if (ready) loadOnlineSummary();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_PageHeader = PageHeader_default;
			const _component_UIcon = _sfc_main$7;
			const _component_UAvatar = _sfc_main$5;
			const _component_UBadge = _sfc_main;
			const _component_UInput = _sfc_main$1;
			const _component_USelectMenu = _sfc_main$1$1;
			const _component_UButton = _sfc_main$2;
			const _component_OfflineSummaryCard = OfflineSummaryCard_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-page" }, _attrs))} data-v-7df3fc27>`);
			_push(ssrRenderComponent(_component_PageHeader, { title: "โปรไฟล์" }, null, _parent));
			if (!unref(isReady)) {
				_push(`<div class="profile-loading" data-v-7df3fc27>`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-loader-2",
					class: "profile-loading__spinner"
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="profile-content" data-v-7df3fc27><div class="profile-hero" data-v-7df3fc27>`);
				if (unref(profile)?.pictureUrl) _push(ssrRenderComponent(_component_UAvatar, {
					src: unref(profile).pictureUrl,
					size: "3xl",
					class: "profile-hero__avatar"
				}, null, _parent));
				else {
					_push(`<div class="profile-hero__avatar-fallback" data-v-7df3fc27>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-user-round",
						class: "profile-hero__avatar-icon"
					}, null, _parent));
					_push(`</div>`);
				}
				_push(`<h2 class="profile-hero__name" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.firstName)} ${ssrInterpolate(unref(profile)?.lastName)}</h2>`);
				_push(ssrRenderComponent(_component_UBadge, {
					color: "success",
					variant: "subtle",
					size: "md"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(_component_UIcon, {
								name: "i-lucide-check-circle-2",
								class: "profile-hero__badge-icon"
							}, null, _parent, _scopeId));
							_push(` Registered `);
						} else return [createVNode(_component_UIcon, {
							name: "i-lucide-check-circle-2",
							class: "profile-hero__badge-icon"
						}), createTextVNode(" Registered ")];
					}),
					_: 1
				}, _parent));
				_push(`</div><div class="stat-row" data-v-7df3fc27>`);
				if (!unref(isOfflineMode)) _push(`<div class="stat-box" data-v-7df3fc27><span class="stat-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.point ?? 0)}</span><span class="stat-box__label" data-v-7df3fc27>คะแนนสะสม</span></div>`);
				else _push(`<!---->`);
				_push(`<div class="stat-box" data-v-7df3fc27><span class="stat-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.totalVisit ?? 0)}</span><span class="stat-box__label" data-v-7df3fc27>ครั้งที่ใช้บริการ</span></div></div><div class="info-box" data-v-7df3fc27><div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>ชื่อ</span><div class="info-box__value-wrap" data-v-7df3fc27>`);
				if (!unref(isEditingProfile)) _push(`<span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.firstName)}</span>`);
				else _push(ssrRenderComponent(_component_UInput, {
					modelValue: unref(editFirstName),
					"onUpdate:modelValue": ($event) => isRef(editFirstName) ? editFirstName.value = $event : null,
					size: "sm",
					placeholder: "ชื่อ",
					class: "info-box__input"
				}, null, _parent));
				if (!unref(isEditingProfile)) {
					_push(`<button type="button" class="info-box__edit-btn" aria-label="แก้ไขข้อมูลโปรไฟล์" data-v-7df3fc27>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-pencil",
						class: "info-box__edit-icon"
					}, null, _parent));
					_push(`</button>`);
				} else _push(`<!---->`);
				_push(`</div></div><div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>นามสกุล</span><div class="info-box__value-wrap" data-v-7df3fc27>`);
				if (!unref(isEditingProfile)) _push(`<span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.lastName)}</span>`);
				else _push(ssrRenderComponent(_component_UInput, {
					modelValue: unref(editLastName),
					"onUpdate:modelValue": ($event) => isRef(editLastName) ? editLastName.value = $event : null,
					size: "sm",
					placeholder: "นามสกุล",
					class: "info-box__input"
				}, null, _parent));
				_push(`</div></div><div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>เบอร์โทรศัพท์</span><div class="info-box__value-wrap" data-v-7df3fc27>`);
				if (!unref(isEditingProfile)) _push(`<span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.phone)}</span>`);
				else _push(ssrRenderComponent(_component_UInput, {
					modelValue: unref(editPhone),
					"onUpdate:modelValue": ($event) => isRef(editPhone) ? editPhone.value = $event : null,
					type: "tel",
					inputmode: "numeric",
					placeholder: "เช่น 0812345678",
					maxlength: "10",
					size: "sm",
					class: "info-box__input"
				}, null, _parent));
				_push(`</div></div><div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>เพศ</span><div class="info-box__value-wrap" data-v-7df3fc27>`);
				if (!unref(isEditingProfile)) _push(`<span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(("GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS)).find((g) => g.value === unref(profile)?.gender)?.label ?? "-")}</span>`);
				else _push(ssrRenderComponent(_component_USelectMenu, {
					modelValue: unref(editGender),
					"onUpdate:modelValue": ($event) => isRef(editGender) ? editGender.value = $event : null,
					items: "GENDER_OPTIONS" in _ctx ? _ctx.GENDER_OPTIONS : unref(GENDER_OPTIONS),
					"value-key": "value",
					placeholder: "เลือกเพศ",
					size: "sm",
					class: "info-box__input"
				}, null, _parent));
				_push(`</div></div><div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>ช่วงปีเกิด</span><div class="info-box__value-wrap" data-v-7df3fc27>`);
				if (!unref(isEditingProfile)) _push(`<span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.birthYearRange || "-")}</span>`);
				else _push(ssrRenderComponent(_component_USelectMenu, {
					modelValue: unref(editBirthYearValue),
					"onUpdate:modelValue": ($event) => isRef(editBirthYearValue) ? editBirthYearValue.value = $event : null,
					items: unref(ageRangeOptions),
					"value-key": "value",
					placeholder: "เลือกช่วงปีเกิด",
					size: "sm",
					class: "info-box__input"
				}, null, _parent));
				_push(`</div></div><div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>เข้าใช้งานด้วย</span><span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(unref(profile)?.loginType === "line" ? "LINE" : "Guest")}</span></div>`);
				if (unref(profile)?.memberId) _push(`<div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>Member ID</span><code class="info-box__value info-box__value--mono" data-v-7df3fc27>${ssrInterpolate(unref(profile).memberId)}</code></div>`);
				else _push(`<!---->`);
				if (unref(profile)?.registerDate) _push(`<div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>วันที่สมัคร</span><span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(new Date(unref(profile).registerDate).toLocaleDateString("th-TH"))}</span></div>`);
				else _push(`<!---->`);
				if (unref(profile)?.lastLogin) _push(`<div class="info-box__row" data-v-7df3fc27><span class="info-box__label" data-v-7df3fc27>เข้าใช้งานล่าสุด</span><span class="info-box__value" data-v-7df3fc27>${ssrInterpolate(new Date(unref(profile).lastLogin).toLocaleString("th-TH"))}</span></div>`);
				else _push(`<!---->`);
				if (unref(editError)) _push(`<p class="info-box__error" data-v-7df3fc27>${ssrInterpolate(unref(editError))}</p>`);
				else _push(`<!---->`);
				if (unref(isEditingProfile)) {
					_push(`<div class="info-box__actions" data-v-7df3fc27>`);
					_push(ssrRenderComponent(_component_UButton, {
						color: "neutral",
						variant: "outline",
						size: "sm",
						block: "",
						disabled: unref(editSubmitting),
						onClick: cancelEditProfile
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` ยกเลิก `);
							else return [createTextVNode(" ยกเลิก ")];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(_component_UButton, {
						color: "primary",
						size: "sm",
						block: "",
						loading: unref(editSubmitting),
						disabled: unref(editSubmitting),
						onClick: saveEditProfile
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` บันทึก `);
							else return [createTextVNode(" บันทึก ")];
						}),
						_: 1
					}, _parent));
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
				if (unref(roundData)) _push(ssrRenderComponent(_component_OfflineSummaryCard, {
					uid: unref(roundData).uid,
					"started-at": unref(roundData).startedAt,
					"ended-at": unref(roundData).endedAt,
					"played-station-names": unref(playedStationNames),
					"remaining-station-names": unref(remainingStationNames)
				}, null, _parent));
				else _push(`<!---->`);
				_push(`<button type="button" class="reset-link" data-v-7df3fc27> รีเซ็ตข้อมูล (ทดสอบ) </button></div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/profile.vue
var _sfc_setup = profile_vue_vue_type_script_setup_true_lang_default.setup;
profile_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var profile_default = /*#__PURE__*/ _plugin_vue_export_helper_default(profile_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7df3fc27"]]);

export { profile_default as default };
//# sourceMappingURL=profile-BdJtCLh7.mjs.map
