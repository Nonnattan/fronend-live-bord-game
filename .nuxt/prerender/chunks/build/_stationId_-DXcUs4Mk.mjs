import { _ as _plugin_vue_export_helper_default, u as useRoute, a as useOfflineMode, b as _sfc_main$7, c as _sfc_main$2, n as navigateTo } from '../virtual/entry.mjs';
import { _ as _sfc_main } from './Modal-Bf6V9eIc.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as useAdventure, S as STATION_TYPE_META } from './useAdventure-oyoryhV9.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { u as useStationMissions, a as useQuestion, b as useOfflineAnswerSync, c as useOfflineMissionAnswerSync } from './useStationMissions-DyKPx7bx.mjs';
import { u as useStationQuest } from './useStationQuest-Bji0iII9.mjs';
import { u as useOfflineSync } from './useOfflineSync-CTQBoPkt.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, isRef, watch, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, createVNode, withDirectives, vModelDynamic, readonly, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderDynamicModel, ssrRenderAttr } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/index.mjs';
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
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/core/dist/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@iconify/utils/lib/css/icon.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/utils/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/tailwind-variants/dist/index.js';
import './usePortal-CFE28n6Q.mjs';
import './useForwardExpose-lTVrimVg.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/@vueuse/shared/dist/index.js';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/aria-hidden/dist/es5/index.js';
import './useProfile-Di4CdYil.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/zod/index.js';
import './useMemberApi-DKl7a10r.mjs';

var StationMissionCard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "StationMissionCard",
  __ssrInlineRender: true,
  props: { mission: {} },
  emits: ["open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const MISSION_TYPE_ICON = {
      SINGLE_QUESTION: "\u2753",
      MULTI_QUESTION: "\u{1F4DD}",
      QR_SCORE: "\u{1F4F1}"
    };
    const icon = computed(() => MISSION_TYPE_ICON[props.mission.type]);
    const pointsLabel = computed(() => props.mission.completed ? `+${props.mission.pointsEarned} \u0E04\u0E30\u0E41\u0E19\u0E19` : `${props.mission.points} \u0E04\u0E30\u0E41\u0E19\u0E19`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$7;
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: ["mission-card", { "mission-card--completed": __props.mission.completed }]
      }, _attrs))} data-v-2dbc6d5a><span class="mission-card__icon" data-v-2dbc6d5a>${ssrInterpolate(unref(icon))}</span><span class="mission-card__body" data-v-2dbc6d5a><span class="mission-card__title" data-v-2dbc6d5a>${ssrInterpolate(__props.mission.title)}</span><span class="mission-card__desc" data-v-2dbc6d5a>${ssrInterpolate(__props.mission.description)}</span><span class="mission-card__points" data-v-2dbc6d5a>${ssrInterpolate(unref(pointsLabel))}</span></span>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.mission.completed ? "i-lucide-check-circle-2" : "i-lucide-chevron-right",
        class: ["mission-card__chevron", { "mission-card__chevron--done": __props.mission.completed }]
      }, null, _parent));
      _push(`</button>`);
    };
  }
});
var _sfc_setup$4 = StationMissionCard_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionCard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var StationMissionCard_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(StationMissionCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2dbc6d5a"]]), { __name: "StationMissionCard" });
var StationMissionList_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "StationMissionList",
  __ssrInlineRender: true,
  props: {
    missions: {},
    hideCelebration: { type: Boolean }
  },
  emits: ["openMission"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const sortedMissions = computed(() => [...props.missions].sort((a, b) => a.order - b.order));
    const progressCount = computed(() => sortedMissions.value.filter((m) => m.completed).length);
    const isAllComplete = computed(() => sortedMissions.value.length > 0 && progressCount.value === sortedMissions.value.length);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mission-list" }, _attrs))} data-v-b417ad4e><p class="mission-list__progress" data-v-b417ad4e>${ssrInterpolate(unref(progressCount))} / ${ssrInterpolate(unref(sortedMissions).length)} \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08 </p>`);
      if (unref(isAllComplete) && !__props.hideCelebration) _push(`<div class="mission-list__done" data-v-b417ad4e> \u{1F389} \u0E17\u0E33\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E10\u0E32\u0E19\u0E19\u0E35\u0E49\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27 </div>`);
      else _push(`<!---->`);
      _push(`<div class="mission-list__cards" data-v-b417ad4e><!--[-->`);
      ssrRenderList(unref(sortedMissions), (mission) => {
        _push(ssrRenderComponent(StationMissionCard_default, {
          key: mission.id,
          mission,
          onOpen: ($event) => emit("openMission", mission)
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
var _sfc_setup$3 = StationMissionList_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionList_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var StationMissionList_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(StationMissionList_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b417ad4e"]]), { __name: "StationMissionList" });
var StationMissionQuestion_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "StationMissionQuestion",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    questions: {},
    result: {}
  },
  emits: [
    "update:open",
    "submit",
    "close"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const localAnswers = ref({});
    watch(() => props.questions.map((q) => q.id).join(","), () => {
      localAnswers.value = {};
    });
    const hasResult = computed(() => !!props.result);
    const isMulti = computed(() => props.questions.length > 1);
    const allAnswered = computed(() => props.questions.every((q) => {
      var _a;
      return ((_a = localAnswers.value[q.id]) != null ? _a : "").trim() !== "";
    }));
    function selectChoice(questionId, choice) {
      if (hasResult.value) return;
      localAnswers.value = {
        ...localAnswers.value,
        [questionId]: choice
      };
    }
    function handleSubmit() {
      if (hasResult.value || !allAnswered.value) return;
      emit("submit", props.questions.map((q) => {
        var _a;
        return {
          questionId: q.id,
          answer: (_a = localAnswers.value[q.id]) != null ? _a : ""
        };
      }));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: __props.open,
        dismissible: false,
        close: false,
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(hasResult)) {
              _push2(`<div class="mission-question" data-v-ec3966fe${_scopeId}><!--[-->`);
              ssrRenderList(__props.questions, (question, idx) => {
                _push2(`<div class="mission-question__item" data-v-ec3966fe${_scopeId}>`);
                if (unref(isMulti)) _push2(`<p class="mission-question__index" data-v-ec3966fe${_scopeId}> \u0E02\u0E49\u0E2D ${ssrInterpolate(idx + 1)} / ${ssrInterpolate(__props.questions.length)}</p>`);
                else _push2(`<!---->`);
                _push2(`<p class="mission-question__text" data-v-ec3966fe${_scopeId}>${ssrInterpolate(question.question)}</p>`);
                if (question.answerType === "choice") {
                  _push2(`<div class="mission-question__choices" data-v-ec3966fe${_scopeId}><!--[-->`);
                  ssrRenderList(question.choices, (c) => {
                    _push2(`<button type="button" class="${ssrRenderClass([{ "mission-question__choice--selected": unref(localAnswers)[question.id] === c }, "mission-question__choice"])}" data-v-ec3966fe${_scopeId}>${ssrInterpolate(c)}</button>`);
                  });
                  _push2(`<!--]--></div>`);
                } else _push2(`<input${ssrRenderDynamicModel(question.answerType === "number" ? "number" : "text", unref(localAnswers)[question.id], null)} class="mission-question__input"${ssrRenderAttr("type", question.answerType === "number" ? "number" : "text")}${ssrRenderAttr("placeholder", question.answerType === "number" ? "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A" : "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E33\u0E15\u0E2D\u0E1A")} data-v-ec3966fe${_scopeId}>`);
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="mission-question__result" data-v-ec3966fe${_scopeId}>`);
              if (__props.result.correctCount > 0) _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-check-circle-2",
                class: "mission-question__result-icon mission-question__result-icon--correct"
              }, null, _parent2, _scopeId));
              else _push2(`<!---->`);
              if (__props.result.totalCount > 1) _push2(`<p class="mission-question__result-summary" data-v-ec3966fe${_scopeId}> \u0E15\u0E2D\u0E1A\u0E16\u0E39\u0E01 ${ssrInterpolate(__props.result.correctCount)} / ${ssrInterpolate(__props.result.totalCount)} \u0E02\u0E49\u0E2D </p>`);
              else _push2(`<!---->`);
              if (__props.result.totalPoints > 0) _push2(`<p class="mission-question__result-points" data-v-ec3966fe${_scopeId}> +${ssrInterpolate(__props.result.totalPoints)} \u0E04\u0E30\u0E41\u0E19\u0E19 </p>`);
              else _push2(`<p class="mission-question__result-points mission-question__result-points--wrong" data-v-ec3966fe${_scopeId}> 0 \u0E04\u0E30\u0E41\u0E19\u0E19 </p>`);
              _push2(`</div>`);
            }
          } else return [!unref(hasResult) ? (openBlock(), createBlock("div", {
            key: 0,
            class: "mission-question"
          }, [(openBlock(true), createBlock(Fragment, null, renderList(__props.questions, (question, idx) => {
            return openBlock(), createBlock("div", {
              key: question.id,
              class: "mission-question__item"
            }, [
              unref(isMulti) ? (openBlock(), createBlock("p", {
                key: 0,
                class: "mission-question__index"
              }, " \u0E02\u0E49\u0E2D " + toDisplayString(idx + 1) + " / " + toDisplayString(__props.questions.length), 1)) : createCommentVNode("", true),
              createVNode("p", { class: "mission-question__text" }, toDisplayString(question.question), 1),
              question.answerType === "choice" ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mission-question__choices"
              }, [(openBlock(true), createBlock(Fragment, null, renderList(question.choices, (c) => {
                return openBlock(), createBlock("button", {
                  key: c,
                  type: "button",
                  class: ["mission-question__choice", { "mission-question__choice--selected": unref(localAnswers)[question.id] === c }],
                  onClick: ($event) => selectChoice(question.id, c)
                }, toDisplayString(c), 11, ["onClick"]);
              }), 128))])) : withDirectives((openBlock(), createBlock("input", {
                key: 2,
                "onUpdate:modelValue": ($event) => unref(localAnswers)[question.id] = $event,
                class: "mission-question__input",
                type: question.answerType === "number" ? "number" : "text",
                placeholder: question.answerType === "number" ? "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A" : "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E33\u0E15\u0E2D\u0E1A"
              }, null, 8, [
                "onUpdate:modelValue",
                "type",
                "placeholder"
              ])), [[vModelDynamic, unref(localAnswers)[question.id]]])
            ]);
          }), 128))])) : (openBlock(), createBlock("div", {
            key: 1,
            class: "mission-question__result"
          }, [
            __props.result.correctCount > 0 ? (openBlock(), createBlock(_component_UIcon, {
              key: 0,
              name: "i-lucide-check-circle-2",
              class: "mission-question__result-icon mission-question__result-icon--correct"
            })) : createCommentVNode("", true),
            __props.result.totalCount > 1 ? (openBlock(), createBlock("p", {
              key: 1,
              class: "mission-question__result-summary"
            }, " \u0E15\u0E2D\u0E1A\u0E16\u0E39\u0E01 " + toDisplayString(__props.result.correctCount) + " / " + toDisplayString(__props.result.totalCount) + " \u0E02\u0E49\u0E2D ", 1)) : createCommentVNode("", true),
            __props.result.totalPoints > 0 ? (openBlock(), createBlock("p", {
              key: 2,
              class: "mission-question__result-points"
            }, " +" + toDisplayString(__props.result.totalPoints) + " \u0E04\u0E30\u0E41\u0E19\u0E19 ", 1)) : (openBlock(), createBlock("p", {
              key: 3,
              class: "mission-question__result-points mission-question__result-points--wrong"
            }, " 0 \u0E04\u0E30\u0E41\u0E19\u0E19 "))
          ]))];
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(hasResult)) _push2(ssrRenderComponent(_component_UButton, {
              block: "",
              color: "primary",
              disabled: !unref(allAnswered),
              onClick: handleSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(` \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A `);
                else return [createTextVNode(" \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A ")];
              }),
              _: 1
            }, _parent2, _scopeId));
            else _push2(ssrRenderComponent(_component_UButton, {
              block: "",
              color: "primary",
              onClick: ($event) => emit("close")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(`\u0E1B\u0E34\u0E14`);
                else return [createTextVNode("\u0E1B\u0E34\u0E14")];
              }),
              _: 1
            }, _parent2, _scopeId));
          } else return [!unref(hasResult) ? (openBlock(), createBlock(_component_UButton, {
            key: 0,
            block: "",
            color: "primary",
            disabled: !unref(allAnswered),
            onClick: handleSubmit
          }, {
            default: withCtx(() => [createTextVNode(" \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A ")]),
            _: 1
          }, 8, ["disabled"])) : (openBlock(), createBlock(_component_UButton, {
            key: 1,
            block: "",
            color: "primary",
            onClick: ($event) => emit("close")
          }, {
            default: withCtx(() => [createTextVNode("\u0E1B\u0E34\u0E14")]),
            _: 1
          }, 8, ["onClick"]))];
        }),
        _: 1
      }, _parent));
    };
  }
});
var _sfc_setup$2 = StationMissionQuestion_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionQuestion_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionQuestion.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var StationMissionQuestion_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(StationMissionQuestion_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ec3966fe"]]), { __name: "StationMissionQuestion" });
function useQrScanner(elementId, onDecode) {
  const scanState = ref("idle");
  const errorMessage = ref("");
  const cameras = ref([]);
  const activeCameraIndex = ref(0);
  let html5Qrcode = null;
  let Html5QrcodeCtor = null;
  function pickDefaultCameraIndex(list) {
    const backIndex = list.findIndex((cam) => /back|rear|environment/i.test(cam.label));
    return backIndex >= 0 ? backIndex : 0;
  }
  async function startCamera(cameraId) {
    var _a;
    if (!Html5QrcodeCtor) return;
    scanState.value = "starting";
    errorMessage.value = "";
    try {
      if (!html5Qrcode) html5Qrcode = new Html5QrcodeCtor(elementId, { verbose: false });
      const targetCameraId = cameraId != null ? cameraId : (_a = cameras.value[activeCameraIndex.value]) == null ? void 0 : _a.id;
      await html5Qrcode.start(targetCameraId ? { deviceId: { exact: targetCameraId } } : { facingMode: "environment" }, {
        fps: 10,
        qrbox: {
          width: 240,
          height: 240
        },
        aspectRatio: 1
      }, (decodedText) => {
        onDecode(decodedText);
      }, () => {
      });
      scanState.value = "running";
    } catch (err) {
      scanState.value = "error";
      errorMessage.value = err instanceof Error ? err.message : "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E44\u0E14\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E01\u0E25\u0E49\u0E2D\u0E07";
    }
  }
  async function stopCamera() {
    if (html5Qrcode && scanState.value === "running") try {
      await html5Qrcode.stop();
      html5Qrcode.clear();
    } catch {
    }
    scanState.value = "stopped";
  }
  async function switchCamera() {
    var _a;
    if (cameras.value.length < 2) return;
    if (html5Qrcode && scanState.value === "running") try {
      await html5Qrcode.stop();
      html5Qrcode.clear();
    } catch {
    }
    activeCameraIndex.value = (activeCameraIndex.value + 1) % cameras.value.length;
    await startCamera((_a = cameras.value[activeCameraIndex.value]) == null ? void 0 : _a.id);
  }
  async function initAndStart() {
    var _a;
    const mod = await import('file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/html5-qrcode/cjs/index.js');
    Html5QrcodeCtor = mod.Html5Qrcode;
    try {
      const list = await mod.Html5Qrcode.getCameras();
      cameras.value = list;
      activeCameraIndex.value = pickDefaultCameraIndex(list);
    } catch {
    }
    await startCamera((_a = cameras.value[activeCameraIndex.value]) == null ? void 0 : _a.id);
  }
  return {
    scanState: readonly(scanState),
    errorMessage: readonly(errorMessage),
    cameras: readonly(cameras),
    hasMultipleCameras: computed(() => cameras.value.length > 1),
    initAndStart,
    startCamera,
    stopCamera,
    switchCamera
  };
}
var QR_ELEMENT_ID = "mission-qr-reader";
var StationMissionQr_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "StationMissionQr",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    completed: { type: Boolean },
    pointsEarned: {},
    isOnline: { type: Boolean },
    verifying: { type: Boolean },
    errorMessage: {}
  },
  emits: [
    "update:open",
    "scanned",
    "close"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const lastScanned = ref("");
    function handleDecode(text) {
      if (lastScanned.value || props.verifying || props.completed) return;
      lastScanned.value = text;
      emit("scanned", text);
    }
    const { scanState, errorMessage: cameraError, initAndStart, stopCamera } = useQrScanner(QR_ELEMENT_ID, handleDecode);
    watch(() => [
      props.open,
      props.isOnline,
      props.completed
    ], async ([open, isOnline, completed]) => {
      if (open && isOnline && !completed) {
        lastScanned.value = "";
        await initAndStart();
      } else await stopCamera();
    }, {
      immediate: true,
      flush: "post"
    });
    watch(() => props.errorMessage, (message) => {
      if (message) lastScanned.value = "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: __props.open,
        title: __props.completed ? "\u2713 \u0E17\u0E33\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u{1F4F1} \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E2A\u0E41\u0E01\u0E19 QR",
        dismissible: false,
        close: false,
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mission-qr" data-v-db194a17${_scopeId}>`);
            if (__props.completed) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-check-circle-2",
                class: "mission-qr__icon mission-qr__icon--done"
              }, null, _parent2, _scopeId));
              _push2(`<p class="mission-qr__text" data-v-db194a17${_scopeId}>\u0E1C\u0E48\u0E32\u0E19\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E2A\u0E41\u0E01\u0E19 QR \u0E41\u0E25\u0E49\u0E27 (+${ssrInterpolate(__props.pointsEarned)} \u0E04\u0E30\u0E41\u0E19\u0E19)</p><!--]-->`);
            } else if (!__props.isOnline) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-wifi-off",
                class: "mission-qr__icon"
              }, null, _parent2, _scopeId));
              _push2(`<p class="mission-qr__text" data-v-db194a17${_scopeId}> \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E19\u0E35\u0E49\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48 </p><!--]-->`);
            } else {
              _push2(`<!--[--><p class="mission-qr__hint" data-v-db194a17${_scopeId}>\u0E04\u0E49\u0E19\u0E2B\u0E32 QR Code \u0E17\u0E35\u0E48\u0E08\u0E38\u0E14\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E49\u0E27\u0E2A\u0E41\u0E01\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1C\u0E48\u0E32\u0E19\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08</p><div${ssrRenderAttr("id", QR_ELEMENT_ID)} class="mission-qr__camera" data-v-db194a17${_scopeId}></div>`);
              if (unref(scanState) === "starting") _push2(`<p class="mission-qr__status" data-v-db194a17${_scopeId}>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07...</p>`);
              else _push2(`<!---->`);
              if (__props.verifying) _push2(`<p class="mission-qr__status" data-v-db194a17${_scopeId}>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A QR...</p>`);
              else _push2(`<!---->`);
              if (unref(scanState) === "error") _push2(`<p class="mission-qr__status mission-qr__status--error" data-v-db194a17${_scopeId}>${ssrInterpolate(unref(cameraError))}</p>`);
              else _push2(`<!---->`);
              if (__props.errorMessage) _push2(`<p class="mission-qr__status mission-qr__status--error" data-v-db194a17${_scopeId}>${ssrInterpolate(__props.errorMessage)}</p>`);
              else _push2(`<!---->`);
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else return [createVNode("div", { class: "mission-qr" }, [__props.completed ? (openBlock(), createBlock(Fragment, { key: 0 }, [createVNode(_component_UIcon, {
            name: "i-lucide-check-circle-2",
            class: "mission-qr__icon mission-qr__icon--done"
          }), createVNode("p", { class: "mission-qr__text" }, "\u0E1C\u0E48\u0E32\u0E19\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E2A\u0E41\u0E01\u0E19 QR \u0E41\u0E25\u0E49\u0E27 (+" + toDisplayString(__props.pointsEarned) + " \u0E04\u0E30\u0E41\u0E19\u0E19)", 1)], 64)) : !__props.isOnline ? (openBlock(), createBlock(Fragment, { key: 1 }, [createVNode(_component_UIcon, {
            name: "i-lucide-wifi-off",
            class: "mission-qr__icon"
          }), createVNode("p", { class: "mission-qr__text" }, " \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E19\u0E35\u0E49\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48 ")], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
            createVNode("p", { class: "mission-qr__hint" }, "\u0E04\u0E49\u0E19\u0E2B\u0E32 QR Code \u0E17\u0E35\u0E48\u0E08\u0E38\u0E14\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E49\u0E27\u0E2A\u0E41\u0E01\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1C\u0E48\u0E32\u0E19\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08"),
            createVNode("div", {
              id: QR_ELEMENT_ID,
              class: "mission-qr__camera"
            }),
            unref(scanState) === "starting" ? (openBlock(), createBlock("p", {
              key: 0,
              class: "mission-qr__status"
            }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07...")) : createCommentVNode("", true),
            __props.verifying ? (openBlock(), createBlock("p", {
              key: 1,
              class: "mission-qr__status"
            }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A QR...")) : createCommentVNode("", true),
            unref(scanState) === "error" ? (openBlock(), createBlock("p", {
              key: 2,
              class: "mission-qr__status mission-qr__status--error"
            }, toDisplayString(unref(cameraError)), 1)) : createCommentVNode("", true),
            __props.errorMessage ? (openBlock(), createBlock("p", {
              key: 3,
              class: "mission-qr__status mission-qr__status--error"
            }, toDisplayString(__props.errorMessage), 1)) : createCommentVNode("", true)
          ], 64))])];
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "primary",
            onClick: ($event) => emit("close")
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) _push3(`${ssrInterpolate(__props.completed ? "\u0E1B\u0E34\u0E14" : "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E19\u0E35\u0E49")}`);
              else return [createTextVNode(toDisplayString(__props.completed ? "\u0E1B\u0E34\u0E14" : "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E19\u0E35\u0E49"), 1)];
            }),
            _: 1
          }, _parent2, _scopeId));
          else return [createVNode(_component_UButton, {
            block: "",
            color: "primary",
            onClick: ($event) => emit("close")
          }, {
            default: withCtx(() => [createTextVNode(toDisplayString(__props.completed ? "\u0E1B\u0E34\u0E14" : "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E19\u0E35\u0E49"), 1)]),
            _: 1
          }, 8, ["onClick"])];
        }),
        _: 1
      }, _parent));
    };
  }
});
var _sfc_setup$1 = StationMissionQr_vue_vue_type_script_setup_true_lang_default.setup;
StationMissionQr_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/station/StationMissionQr.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var StationMissionQr_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(StationMissionQr_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-db194a17"]]), { __name: "StationMissionQr" });
var FINAL_STATION_ID = "milk";
var _stationId__vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "[stationId]",
  __ssrInlineRender: true,
  setup(__props) {
    const { profile, isReady } = useRequireProfile();
    const route = useRoute();
    const VALID_STATION_IDS = [
      "corn",
      "cow",
      "soil",
      "milk"
    ];
    const rawId = computed(() => {
      var _a;
      return String((_a = route.params.stationId) != null ? _a : "");
    });
    const stationId = computed(() => VALID_STATION_IDS.includes(rawId.value) ? rawId.value : null);
    const { stations } = useAdventure();
    const stationName = computed(() => {
      var _a, _b;
      if (!stationId.value) return "";
      return (_b = (_a = stations.value.find((s) => s.id === stationId.value)) == null ? void 0 : _a.name) != null ? _b : STATION_TYPE_META[stationId.value].label;
    });
    const { markGameCompleted } = useStationQuest();
    const { getStationMissions, isStationMissionComplete, loadStationMissions, submitSingleQuestion, submitMultiQuestion, verifyQrMission, loadError: missionsLoadError } = useStationMissions();
    const { getQuestionsForMission} = useQuestion();
    const { isOnline} = useOfflineSync();
    const { syncNow: syncAnswersNow} = useOfflineAnswerSync();
    const { syncNow: syncMissionAnswersNow} = useOfflineMissionAnswerSync();
    const { isOfflineMode, startRound } = useOfflineMode();
    const { currentRoundId, endCurrentRound } = useRound();
    const { clearAllTimers } = useRoundTimer();
    const canShowContent = ref(false);
    const loadingMissions = ref(false);
    async function loadMissionsForCurrentStation() {
      var _a, _b;
      if (!stationId.value) return;
      loadingMissions.value = true;
      await loadStationMissions(stationId.value, currentRoundId.value, ((_a = profile.value) == null ? void 0 : _a.memberId) || ((_b = profile.value) == null ? void 0 : _b.uid));
      loadingMissions.value = false;
    }
    const missions = computed(() => stationId.value ? getStationMissions(stationId.value) : []);
    const isComplete = computed(() => stationId.value ? isStationMissionComplete(stationId.value) : false);
    const isFinalStation = computed(() => stationId.value === FINAL_STATION_ID);
    const activeMission = ref(null);
    const questionPopupOpen = ref(false);
    const qrPopupOpen = ref(false);
    const activeQuestionResult = ref(null);
    const qrVerifying = ref(false);
    const qrError = ref("");
    const activeQuestions = computed(() => {
      var _a;
      if (!((_a = activeMission.value) == null ? void 0 : _a.questionIds)) return [];
      return getQuestionsForMission(activeMission.value.questionIds);
    });
    function openMission(mission) {
      activeMission.value = mission;
      activeQuestionResult.value = mission.completed ? {
        correctCount: 0,
        totalCount: 0,
        totalPoints: mission.pointsEarned
      } : null;
      qrError.value = "";
      if (mission.type === "QR_SCORE") qrPopupOpen.value = true;
      else questionPopupOpen.value = true;
    }
    function closeMissionPopup() {
      questionPopupOpen.value = false;
      qrPopupOpen.value = false;
      activeMission.value = null;
      activeQuestionResult.value = null;
      qrError.value = "";
    }
    function currentCtx() {
      var _a, _b, _c;
      return {
        userId: ((_a = profile.value) == null ? void 0 : _a.memberId) || ((_b = profile.value) == null ? void 0 : _b.uid) || "",
        firstName: (_c = profile.value) == null ? void 0 : _c.firstName,
        roundId: currentRoundId.value
      };
    }
    function handleQuestionSubmit(answers) {
      var _a, _b;
      if (!stationId.value || !activeMission.value) return;
      const ctx = currentCtx();
      if (activeMission.value.type === "SINGLE_QUESTION") {
        const question = activeQuestions.value[0];
        if (!question) return;
        const result = submitSingleQuestion(stationId.value, activeMission.value, question, (_b = (_a = answers[0]) == null ? void 0 : _a.answer) != null ? _b : "", ctx);
        activeQuestionResult.value = {
          correctCount: result.isCorrect ? 1 : 0,
          totalCount: 1,
          totalPoints: result.pointsEarned
        };
        if (!isOfflineMode.value && isOnline.value && ctx.userId) syncAnswersNow(ctx.userId, ctx.firstName);
      } else {
        const result = submitMultiQuestion(stationId.value, activeMission.value, answers, ctx);
        activeQuestionResult.value = {
          correctCount: result.correctCount,
          totalCount: result.totalCount,
          totalPoints: result.totalPoints
        };
        if (!isOfflineMode.value && isOnline.value) syncMissionAnswersNow();
      }
    }
    async function handleQrScanned(qrToken) {
      if (!stationId.value || !activeMission.value || !currentRoundId.value) {
        qrError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 GO \u0E17\u0E35\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E40\u0E25\u0E48\u0E19\u0E04\u0E23\u0E31\u0E1A";
        return;
      }
      qrVerifying.value = true;
      qrError.value = "";
      try {
        const result = await verifyQrMission(stationId.value, activeMission.value, qrToken, {
          ...currentCtx(),
          roundId: currentRoundId.value
        });
        if (!result.success) {
          qrError.value = result.error || "QR \u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48";
          return;
        }
        activeMission.value = {
          ...activeMission.value,
          completed: true,
          pointsEarned: result.pointsEarned
        };
      } finally {
        qrVerifying.value = false;
      }
    }
    const isStartingNewRound = ref(false);
    async function handlePlayAgain() {
      var _a, _b, _c;
      if (isStartingNewRound.value) return;
      isStartingNewRound.value = true;
      try {
        if (isOfflineMode.value) startRound((_b = (_a = profile.value) == null ? void 0 : _a.uid) != null ? _b : "");
        else if ((_c = profile.value) == null ? void 0 : _c.memberId) await endCurrentRound(profile.value.memberId);
        clearAllTimers();
        await navigateTo("/starting");
      } finally {
        isStartingNewRound.value = false;
      }
    }
    function handleEndGame() {
      markGameCompleted();
      navigateTo("/evaluation");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = PageHeader_default;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-8dfe83d1>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: unref(stationId) ? `\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08${unref(stationName)}` : "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E10\u0E32\u0E19",
        "back-to": "/stations"
      }, null, _parent));
      if (!unref(isReady) || !unref(canShowContent)) {
        _push(`<div class="page__loading" data-v-8dfe83d1>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "page__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="page__content" data-v-8dfe83d1>`);
        if (unref(loadingMissions) && unref(missions).length === 0) {
          _push(`<div class="page__loading" data-v-8dfe83d1>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-loader-2",
            class: "page__spinner"
          }, null, _parent));
          _push(`</div>`);
        } else if (unref(missionsLoadError) && unref(missions).length === 0) {
          _push(`<div class="mission-error" data-v-8dfe83d1><p class="mission-error__text" data-v-8dfe83d1>${ssrInterpolate(unref(missionsLoadError))}</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "neutral",
            variant: "soft",
            icon: "i-lucide-rotate-cw",
            onClick: loadMissionsForCurrentStation
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` \u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48 `);
              else return [createTextVNode(" \u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48 ")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else _push(ssrRenderComponent(StationMissionList_default, {
          missions: unref(missions),
          "hide-celebration": unref(isFinalStation),
          onOpenMission: openMission
        }, null, _parent));
        if (unref(isFinalStation)) {
          _push(`<div class="endgame-cta" data-v-8dfe83d1><p class="endgame-cta__title" data-v-8dfe83d1>${ssrInterpolate(unref(isComplete) ? "\u0E17\u0E33\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E10\u0E32\u0E19\u0E19\u0E21\u0E04\u0E23\u0E1A\u0E41\u0E25\u0E49\u0E27!" : "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E08\u0E1A\u0E40\u0E01\u0E21\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E40\u0E25\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?")}</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            block: "",
            size: "xl",
            color: "neutral",
            variant: "soft",
            disabled: unref(isStartingNewRound),
            onClick: handleEndGame
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` \u0E08\u0E1A\u0E40\u0E01\u0E21 `);
              else return [createTextVNode(" \u0E08\u0E1A\u0E40\u0E01\u0E21 ")];
            }),
            _: 1
          }, _parent));
          if (unref(isComplete)) _push(ssrRenderComponent(_component_UButton, {
            block: "",
            size: "xl",
            color: "primary",
            loading: unref(isStartingNewRound),
            disabled: unref(isStartingNewRound),
            onClick: handlePlayAgain
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` \u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D `);
              else return [createTextVNode(" \u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D ")];
            }),
            _: 1
          }, _parent));
          else _push(`<!---->`);
          _push(`</div>`);
        } else _push(`<!---->`);
        _push(`</div>`);
      }
      if (unref(activeMission) && unref(activeMission).type !== "QR_SCORE") _push(ssrRenderComponent(StationMissionQuestion_default, {
        open: unref(questionPopupOpen),
        "onUpdate:open": ($event) => isRef(questionPopupOpen) ? questionPopupOpen.value = $event : null,
        questions: unref(activeQuestions),
        result: unref(activeQuestionResult),
        onSubmit: handleQuestionSubmit,
        onClose: closeMissionPopup
      }, null, _parent));
      else _push(`<!---->`);
      if (unref(activeMission) && unref(activeMission).type === "QR_SCORE") _push(ssrRenderComponent(StationMissionQr_default, {
        open: unref(qrPopupOpen),
        "onUpdate:open": ($event) => isRef(qrPopupOpen) ? qrPopupOpen.value = $event : null,
        completed: unref(activeMission).completed,
        "points-earned": unref(activeMission).pointsEarned,
        "is-online": unref(isOnline),
        verifying: unref(qrVerifying),
        "error-message": unref(qrError),
        onScanned: handleQrScanned,
        onClose: closeMissionPopup
      }, null, _parent));
      else _push(`<!---->`);
      _push(`</div>`);
    };
  }
});
var _sfc_setup = _stationId__vue_vue_type_script_setup_true_lang_default.setup;
_stationId__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/station/[stationId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _stationId__default = /* @__PURE__ */ _plugin_vue_export_helper_default(_stationId__vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8dfe83d1"]]);

export { _stationId__default as default };
//# sourceMappingURL=_stationId_-DXcUs4Mk.mjs.map
