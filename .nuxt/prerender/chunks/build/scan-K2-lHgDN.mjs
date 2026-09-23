import { _ as _plugin_vue_export_helper_default, a as useOfflineMode, b as _sfc_main$7, c as _sfc_main$2, n as navigateTo } from '../virtual/entry.mjs';
import { _ as _sfc_main$1 } from './Modal-Bf6V9eIc.mjs';
import { u as useRoundTimer } from './useRoundTimer-CHUCPQ34.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useMemberApi } from './useMemberApi-DKl7a10r.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as useAdventure } from './useAdventure-oyoryhV9.mjs';
import { u as useRound } from './useRound-BmAVHypg.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { a as useQuestion, b as useOfflineAnswerSync } from './useStationMissions-DyKPx7bx.mjs';
import { u as useStationQuest } from './useStationQuest-Bji0iII9.mjs';
import { u as useOfflineSync } from './useOfflineSync-CTQBoPkt.mjs';
import { u as useForceEndRound } from './useForceEndRound-Dv22McEm.mjs';
import { _ as _sfc_main } from './Input-03a9B_yA.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, isRef, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, nextTick, withKeys, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { onBeforeRouteLeave } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue-router/vue-router.node.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nostics/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/nostics/dist/formatters/ansi.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/hookable/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/unctx/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/h3/dist/index.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/ufo/dist/index.mjs';
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

var MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "MissionQuestionPopup",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    stationName: {},
    question: {},
    answered: {}
  },
  emits: [
    "update:open",
    "submit",
    "continue"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const answerValue = ref("");
    const submitting = ref(false);
    const validationError = ref("");
    watch(() => props.question.id, () => {
      answerValue.value = "";
      validationError.value = "";
      submitting.value = false;
    });
    const hasResult = computed(() => !!props.answered);
    function selectChoice(choice) {
      if (hasResult.value) return;
      answerValue.value = choice;
      validationError.value = "";
    }
    async function handleSubmit() {
      if (hasResult.value) return;
      if (!answerValue.value.trim()) {
        validationError.value = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E2D\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21\u0E01\u0E48\u0E2D\u0E19\u0E01\u0E14\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19";
        return;
      }
      submitting.value = true;
      try {
        emit("submit", answerValue.value.trim());
      } finally {
        submitting.value = false;
      }
    }
    function handleContinue() {
      emit("continue");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$1;
      const _component_UIcon = _sfc_main$7;
      const _component_UInput = _sfc_main;
      const _component_UButton = _sfc_main$2;
      _push(ssrRenderComponent(_component_UModal, mergeProps({
        open: __props.open,
        title: unref(hasResult) ? "\u0E1C\u0E25\u0E04\u0E33\u0E15\u0E2D\u0E1A" : `\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E1B\u0E23\u0E30\u0E08\u0E33${__props.stationName}`,
        dismissible: false,
        close: false,
        "onUpdate:open": (v) => emit("update:open", v)
      }, _attrs), {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(hasResult)) {
              _push2(`<div class="mission-question" data-v-f74ce135${_scopeId}><div class="mission-question__mission" data-v-f74ce135${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-map-pinned",
                class: "mission-question__mission-icon"
              }, null, _parent2, _scopeId));
              _push2(`<p class="mission-question__mission-text" data-v-f74ce135${_scopeId}>${ssrInterpolate(__props.question.mission)}</p></div><p class="mission-question__question" data-v-f74ce135${_scopeId}>${ssrInterpolate(__props.question.question)}</p>`);
              if (__props.question.answerType === "choice") {
                _push2(`<div class="mission-question__choices" data-v-f74ce135${_scopeId}><!--[-->`);
                ssrRenderList(__props.question.choices, (choice) => {
                  _push2(`<button type="button" class="${ssrRenderClass([{ "mission-question__choice--selected": unref(answerValue) === choice }, "mission-question__choice"])}" data-v-f74ce135${_scopeId}>${ssrInterpolate(choice)}</button>`);
                });
                _push2(`<!--]--></div>`);
              } else _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(answerValue),
                "onUpdate:modelValue": ($event) => isRef(answerValue) ? answerValue.value = $event : null,
                type: __props.question.answerType === "number" ? "number" : "text",
                size: "xl",
                placeholder: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48",
                onKeyup: handleSubmit
              }, null, _parent2, _scopeId));
              if (unref(validationError)) _push2(`<p class="mission-question__error" data-v-f74ce135${_scopeId}>${ssrInterpolate(unref(validationError))}</p>`);
              else _push2(`<!---->`);
              _push2(`</div>`);
            } else {
              _push2(`<div class="mission-question__result" data-v-f74ce135${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-sparkles",
                class: "mission-question__result-icon"
              }, null, _parent2, _scopeId));
              _push2(`<p class="mission-question__result-answer" data-v-f74ce135${_scopeId}>\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13: ${ssrInterpolate(__props.answered.answer)}</p><p class="mission-question__result-points" data-v-f74ce135${_scopeId}>\u0E44\u0E14\u0E49 ${ssrInterpolate(__props.answered.pointsEarned)} \u0E04\u0E30\u0E41\u0E19\u0E19</p></div>`);
            }
          } else return [!unref(hasResult) ? (openBlock(), createBlock("div", {
            key: 0,
            class: "mission-question"
          }, [
            createVNode("div", { class: "mission-question__mission" }, [createVNode(_component_UIcon, {
              name: "i-lucide-map-pinned",
              class: "mission-question__mission-icon"
            }), createVNode("p", { class: "mission-question__mission-text" }, toDisplayString(__props.question.mission), 1)]),
            createVNode("p", { class: "mission-question__question" }, toDisplayString(__props.question.question), 1),
            __props.question.answerType === "choice" ? (openBlock(), createBlock("div", {
              key: 0,
              class: "mission-question__choices"
            }, [(openBlock(true), createBlock(Fragment, null, renderList(__props.question.choices, (choice) => {
              return openBlock(), createBlock("button", {
                key: choice,
                type: "button",
                class: ["mission-question__choice", { "mission-question__choice--selected": unref(answerValue) === choice }],
                onClick: ($event) => selectChoice(choice)
              }, toDisplayString(choice), 11, ["onClick"]);
            }), 128))])) : (openBlock(), createBlock(_component_UInput, {
              key: 1,
              modelValue: unref(answerValue),
              "onUpdate:modelValue": ($event) => isRef(answerValue) ? answerValue.value = $event : null,
              type: __props.question.answerType === "number" ? "number" : "text",
              size: "xl",
              placeholder: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48",
              onKeyup: withKeys(handleSubmit, ["enter"])
            }, null, 8, [
              "modelValue",
              "onUpdate:modelValue",
              "type"
            ])),
            unref(validationError) ? (openBlock(), createBlock("p", {
              key: 2,
              class: "mission-question__error"
            }, toDisplayString(unref(validationError)), 1)) : createCommentVNode("", true)
          ])) : (openBlock(), createBlock("div", {
            key: 1,
            class: "mission-question__result"
          }, [
            createVNode(_component_UIcon, {
              name: "i-lucide-sparkles",
              class: "mission-question__result-icon"
            }),
            createVNode("p", { class: "mission-question__result-answer" }, "\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13: " + toDisplayString(__props.answered.answer), 1),
            createVNode("p", { class: "mission-question__result-points" }, "\u0E44\u0E14\u0E49 " + toDisplayString(__props.answered.pointsEarned) + " \u0E04\u0E30\u0E41\u0E19\u0E19", 1)
          ]))];
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(hasResult)) _push2(ssrRenderComponent(_component_UButton, {
              block: "",
              color: "primary",
              loading: unref(submitting),
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
              onClick: handleContinue
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(` \u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E44\u0E1B\u0E40\u0E1C\u0E48\u0E32\u0E15\u0E48\u0E2D\u0E44\u0E1B `);
                else return [createTextVNode(" \u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E44\u0E1B\u0E40\u0E1C\u0E48\u0E32\u0E15\u0E48\u0E2D\u0E44\u0E1B ")];
              }),
              _: 1
            }, _parent2, _scopeId));
          } else return [!unref(hasResult) ? (openBlock(), createBlock(_component_UButton, {
            key: 0,
            block: "",
            color: "primary",
            loading: unref(submitting),
            onClick: handleSubmit
          }, {
            default: withCtx(() => [createTextVNode(" \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A ")]),
            _: 1
          }, 8, ["loading"])) : (openBlock(), createBlock(_component_UButton, {
            key: 1,
            block: "",
            color: "primary",
            onClick: handleContinue
          }, {
            default: withCtx(() => [createTextVNode(" \u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E44\u0E1B\u0E40\u0E1C\u0E48\u0E32\u0E15\u0E48\u0E2D\u0E44\u0E1B ")]),
            _: 1
          }))];
        }),
        _: 1
      }, _parent));
    };
  }
});
var _sfc_setup$1 = MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default.setup;
MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/mission/MissionQuestionPopup.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var MissionQuestionPopup_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(MissionQuestionPopup_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f74ce135"]]), { __name: "MissionQuestionPopup" });
var QR_ELEMENT_ID = "qr-reader";
var FINAL_STATION_ID = "milk";
var scan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "scan",
  __ssrInlineRender: true,
  setup(__props) {
    const { profile, isReady } = useRequireProfile();
    const scanState = ref("idle");
    const errorMessage = ref("");
    const lastResult = ref("");
    const cameras = ref([]);
    const activeCameraIndex = ref(0);
    const { stations, isVisited, toggleStation, totalPoint } = useAdventure();
    const { isOnline, hasPending, pendingCount, isSyncing, queueCheckin, syncNow} = useOfflineSync();
    const { isOfflineMode, logStationScan, endRound, roundData } = useOfflineMode();
    const { saveRoundSummary } = useRoundSummary();
    const { endCurrentRound, currentRoundId } = useRound();
    const { submitSurvey } = useMemberApi();
    const { submitAnswer: submitQuestionAnswer, totalQuestionPoints, totalCorrect: totalQuestionCorrect } = useQuestion();
    const { syncNow: syncAnswersNow } = useOfflineAnswerSync();
    const { clearStationTimer, stationRemainingLabel, isRoundExpired, isStationExpired } = useRoundTimer();
    const { forceEndRoundDueToTimeout } = useForceEndRound();
    useStationQuest();
    const checkinFeedback = ref(null);
    const syncMessage = ref("");
    const manualCode = ref("");
    ref(false);
    const successPopupOpen = ref(false);
    const finalPopupOpen = ref(false);
    const scannedStation = ref(null);
    const missionPopupOpen = ref(false);
    const activeMissionQuestion = ref(null);
    const activeMissionAnswer = ref(null);
    const pendingResultPopup = ref(null);
    const surveyPopupOpen = ref(false);
    const selectedRating = ref(null);
    const surveySubmitting = ref(false);
    const surveyError = ref("");
    const SURVEY_RATING_OPTIONS = [
      {
        value: 4,
        label: "\u0E19\u0E21"
      },
      {
        value: 3,
        label: "\u0E27\u0E31\u0E27"
      },
      {
        value: 2,
        label: "\u0E14\u0E34\u0E19"
      },
      {
        value: 1,
        label: "\u0E02\u0E49\u0E32\u0E27\u0E42\u0E1E\u0E14"
      }
    ];
    const isResultPopupOpen = computed(() => successPopupOpen.value || finalPopupOpen.value || missionPopupOpen.value);
    const activeMissionStationName = computed(() => {
      var _a, _b;
      return (_b = (_a = stations.value.find((s) => {
        var _a2;
        return s.id === ((_a2 = activeMissionQuestion.value) == null ? void 0 : _a2.stationId);
      })) == null ? void 0 : _a.name) != null ? _b : "";
    });
    computed(() => surveyPopupOpen.value || isResultPopupOpen.value);
    onBeforeRouteLeave(() => {
      if (!surveyPopupOpen.value) return true;
      return false;
    });
    function handleMissionSubmit(value) {
      var _a, _b, _c, _d;
      if (!activeMissionQuestion.value) return;
      const userId = ((_a = profile.value) == null ? void 0 : _a.memberId) || ((_b = profile.value) == null ? void 0 : _b.uid) || "";
      const result = submitQuestionAnswer(activeMissionQuestion.value, value, {
        userId,
        firstName: (_c = profile.value) == null ? void 0 : _c.firstName,
        roundId: currentRoundId.value
      });
      activeMissionAnswer.value = result;
      if (!isOfflineMode.value && isOnline.value && userId) syncAnswersNow(userId, (_d = profile.value) == null ? void 0 : _d.firstName);
    }
    function handleMissionContinue() {
      clearStationTimer();
      missionPopupOpen.value = false;
      activeMissionQuestion.value = null;
      activeMissionAnswer.value = null;
      if (pendingResultPopup.value === "success") successPopupOpen.value = true;
      else if (pendingResultPopup.value === "final") finalPopupOpen.value = true;
      pendingResultPopup.value = null;
    }
    async function commitFinalStationVisit() {
      var _a;
      const station = stations.value.find((s) => s.id === FINAL_STATION_ID);
      const stationPoint = (_a = station.points) != null ? _a : 250;
      toggleStation(FINAL_STATION_ID, currentRoundId.value);
      if (isOfflineMode.value) {
        logStationScan(FINAL_STATION_ID, station.name);
        checkinFeedback.value = {
          kind: "success",
          text: `\u0E1C\u0E48\u0E32\u0E19${station.name}\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 (\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27)`
        };
        return;
      }
      queueCheckin(station, stationPoint);
      checkinFeedback.value = {
        kind: "success",
        text: `\u0E1C\u0E48\u0E32\u0E19${station.name}\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 +${stationPoint} Point (\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27)`
      };
      await runSync();
    }
    async function runSync() {
      if (!isOnline.value) {
        syncMessage.value = "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E30 Sync \u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15";
        return;
      }
      const result = await syncNow();
      syncMessage.value = result.message;
    }
    function resetScanResult() {
      lastResult.value = "";
      checkinFeedback.value = null;
      scannedStation.value = null;
    }
    function closeSuccessPopup() {
      successPopupOpen.value = false;
      resetScanResult();
    }
    function continuePlayingAfterFinalStation() {
      finalPopupOpen.value = false;
      resetScanResult();
    }
    async function handleEndGameButtonClick() {
      if (isOfflineMode.value) {
        await endGameOfflineAfterFinalStation();
        return;
      }
      finalPopupOpen.value = false;
      surveyError.value = "";
      selectedRating.value = null;
      await nextTick();
      surveyPopupOpen.value = true;
    }
    const isEndingGameOffline = ref(false);
    async function endGameOfflineAfterFinalStation() {
      var _a, _b, _c, _d, _e, _f, _g;
      if (isEndingGameOffline.value) return;
      isEndingGameOffline.value = true;
      finalPopupOpen.value = false;
      resetScanResult();
      try {
        await commitFinalStationVisit();
        endRound();
        const playedStations = ((_b = (_a = roundData.value) == null ? void 0 : _a.stations) != null ? _b : []).slice().sort((a, b) => a.order - b.order).map((s) => ({
          name: s.stationName,
          points: 0
        }));
        saveRoundSummary({
          mode: "offline",
          startTime: ((_c = roundData.value) == null ? void 0 : _c.startedAt) ? new Date(roundData.value.startedAt).toISOString() : null,
          endTime: new Date((_e = (_d = roundData.value) == null ? void 0 : _d.endedAt) != null ? _e : Date.now()).toISOString(),
          stations: playedStations,
          totalPoint: null,
          roundId: null,
          userId: (_g = (_f = profile.value) == null ? void 0 : _f.uid) != null ? _g : null,
          questionPoints: totalQuestionPoints.value,
          questionCorrectCount: totalQuestionCorrect.value
        });
      } catch (err) {
        console.error("[endGameOfflineAfterFinalStation] failed to build offline round summary", err);
      } finally {
        await stopCamera();
        await navigateTo("/round-summary");
        isEndingGameOffline.value = false;
      }
    }
    async function confirmSurveyAndEndGame() {
      var _a;
      if (!selectedRating.value || surveySubmitting.value) return;
      surveySubmitting.value = true;
      surveyError.value = "";
      try {
        if (!isOfflineMode.value && ((_a = profile.value) == null ? void 0 : _a.memberId) && currentRoundId.value) try {
          await submitSurvey({
            roundId: currentRoundId.value,
            userId: profile.value.memberId,
            firstName: profile.value.firstName,
            favoriteStationRating: selectedRating.value
          });
        } catch (err) {
          console.error("[confirmSurveyAndEndGame] submitSurvey failed", err);
          surveyError.value = "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
          return;
        }
        surveyPopupOpen.value = false;
        selectedRating.value = null;
        await commitFinalStationVisit();
        await endGameAfterFinalStation();
      } finally {
        surveySubmitting.value = false;
      }
    }
    const isEndingGame = ref(false);
    async function endGameAfterFinalStation() {
      var _a, _b, _c;
      if (isEndingGame.value) return;
      isEndingGame.value = true;
      finalPopupOpen.value = false;
      resetScanResult();
      try {
        const playedStations = stations.value.filter((s) => isVisited(s.id)).map((s) => {
          var _a2;
          return {
            name: s.name,
            points: (_a2 = s.points) != null ? _a2 : 250
          };
        });
        const roundTotalPoint = totalPoint.value;
        const roundIdForSummary = currentRoundId.value;
        const userIdForSummary = ((_a = profile.value) == null ? void 0 : _a.memberId) || ((_b = profile.value) == null ? void 0 : _b.uid) || null;
        let startTimeIso = null;
        let endTimeIso = (/* @__PURE__ */ new Date()).toISOString();
        if (!isOfflineMode.value && ((_c = profile.value) == null ? void 0 : _c.memberId)) {
          if (isOnline.value) await runSync();
          const endedRound = await endCurrentRound(profile.value.memberId);
          if (endedRound) {
            startTimeIso = endedRound.startTime || null;
            endTimeIso = endedRound.endTime || endTimeIso;
          }
        }
        saveRoundSummary({
          mode: isOfflineMode.value ? "offline" : "online",
          startTime: startTimeIso,
          endTime: endTimeIso,
          stations: playedStations,
          totalPoint: isOfflineMode.value ? null : roundTotalPoint,
          roundId: isOfflineMode.value ? null : roundIdForSummary,
          userId: userIdForSummary,
          questionPoints: totalQuestionPoints.value,
          questionCorrectCount: totalQuestionCorrect.value
        });
      } catch (err) {
        console.error("[endGameAfterFinalStation] failed to build round summary", err);
      } finally {
        await stopCamera();
        await navigateTo("/round-summary");
        isEndingGame.value = false;
      }
    }
    async function startCamera(cameraId) {
    }
    async function stopCamera() {
      scanState.value = "stopped";
    }
    async function retryCamera() {
      var _a;
      lastResult.value = "";
      await startCamera((_a = cameras.value[activeCameraIndex.value]) == null ? void 0 : _a.id);
    }
    watch([isRoundExpired, isStationExpired], async ([roundExpired, stationExpired]) => {
      if (!roundExpired && !stationExpired) return;
      missionPopupOpen.value = false;
      successPopupOpen.value = false;
      finalPopupOpen.value = false;
      surveyPopupOpen.value = false;
      await stopCamera();
      await forceEndRoundDueToTimeout(roundExpired ? "round" : "station");
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_PageHeader = PageHeader_default;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      const _component_UInput = _sfc_main;
      const _component_UModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-fb12b376>`);
      _push(ssrRenderComponent(_component_PageHeader, { title: "Scan QR Code" }, null, _parent));
      if (!unref(isReady)) {
        _push(`<div class="page__loading" data-v-fb12b376>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "page__spinner"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="scan" data-v-fb12b376>`);
        if (unref(stationRemainingLabel)) {
          _push(`<div class="scan__station-timer" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-hourglass" }, null, _parent));
          _push(` \u0E40\u0E27\u0E25\u0E32\u0E17\u0E33\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E10\u0E32\u0E19\u0E19\u0E35\u0E49\u0E40\u0E2B\u0E25\u0E37\u0E2D ${ssrInterpolate(unref(stationRemainingLabel))}</div>`);
        } else _push(`<!---->`);
        _push(`<div class="${ssrRenderClass([{ "scan__viewport--hidden": unref(scanState) !== "running" && unref(scanState) !== "starting" }, "scan__viewport"])}" data-v-fb12b376><div${ssrRenderAttr("id", QR_ELEMENT_ID)} class="scan__reader" data-v-fb12b376></div></div>`);
        if (unref(scanState) === "starting") {
          _push(`<div class="scan__frame" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-loader-2",
            class: "scan__icon scan__icon--spin"
          }, null, _parent));
          _push(`<p class="scan__title" data-v-fb12b376>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07...</p></div>`);
        } else if (unref(scanState) === "error") {
          _push(`<div class="scan__frame" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-camera-off",
            class: "scan__icon"
          }, null, _parent));
          _push(`<p class="scan__title" data-v-fb12b376>\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08</p><p class="scan__desc" data-v-fb12b376>${ssrInterpolate(unref(errorMessage))}</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            icon: "i-lucide-rotate-cw",
            onClick: retryCamera
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(`\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07`);
              else return [createTextVNode("\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else if (unref(scanState) === "stopped") {
          _push(`<div class="scan__frame" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-scan-line",
            class: "scan__icon"
          }, null, _parent));
          _push(`<p class="scan__title" data-v-fb12b376>\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27</p><p class="scan__desc" data-v-fb12b376>\u0E01\u0E14\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E41\u0E01\u0E19 QR Code</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            icon: "i-lucide-camera",
            onClick: retryCamera
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(`\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07`);
              else return [createTextVNode("\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else _push(`<!--[--><p class="scan__title" data-v-fb12b376>\u0E27\u0E32\u0E07\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E43\u0E2B\u0E49\u0E15\u0E23\u0E07 QR Code</p><p class="scan__desc" data-v-fb12b376> \u0E43\u0E0A\u0E49\u0E2A\u0E41\u0E01\u0E19 QR Code \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E30\u0E2A\u0E21\u0E04\u0E30\u0E41\u0E19\u0E19 \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E1E\u0E34\u0E40\u0E28\u0E29\u0E2B\u0E19\u0E49\u0E32\u0E23\u0E49\u0E32\u0E19 </p><!--]-->`);
        if (unref(lastResult)) {
          _push(`<div class="scan__result" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: ((_a = unref(checkinFeedback)) == null ? void 0 : _a.kind) === "success" ? "i-lucide-badge-check" : ((_b = unref(checkinFeedback)) == null ? void 0 : _b.kind) === "duplicate" ? "i-lucide-info" : "i-lucide-triangle-alert",
            class: "scan__result-icon"
          }, null, _parent));
          _push(`<div class="scan__result-body" data-v-fb12b376><p class="scan__result-label" data-v-fb12b376>${ssrInterpolate(((_c = unref(checkinFeedback)) == null ? void 0 : _c.kind) === "invalid" ? "\u0E2A\u0E41\u0E01\u0E19\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E2A\u0E41\u0E01\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08")}</p><p class="scan__result-value" data-v-fb12b376>${ssrInterpolate(((_d = unref(checkinFeedback)) == null ? void 0 : _d.text) || unref(lastResult))}</p></div>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            variant: "soft",
            onClick: ($event) => {
              lastResult.value = "";
              checkinFeedback.value = null;
            }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(`\u0E2A\u0E41\u0E01\u0E19\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07`);
              else return [createTextVNode("\u0E2A\u0E41\u0E01\u0E19\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else _push(`<!---->`);
        if (unref(scanState) === "running" || unref(scanState) === "starting") {
          _push(`<div class="scan__controls" data-v-fb12b376><button type="button" class="scan__control-btn"${ssrIncludeBooleanAttr(unref(cameras).length < 2) ? " disabled" : ""} data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-refresh-ccw",
            class: "scan__control-icon"
          }, null, _parent));
          _push(`<span data-v-fb12b376>\u0E2A\u0E25\u0E31\u0E1A\u0E01\u0E25\u0E49\u0E2D\u0E07</span></button><button type="button" class="scan__control-btn scan__control-btn--danger" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-camera-off",
            class: "scan__control-icon"
          }, null, _parent));
          _push(`<span data-v-fb12b376>\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07</span></button></div>`);
        } else _push(`<!---->`);
        _push(`<form class="manual-code" data-v-fb12b376>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(manualCode),
          "onUpdate:modelValue": ($event) => isRef(manualCode) ? manualCode.value = $event : null,
          placeholder: "\u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E10\u0E32\u0E19 \u0E40\u0E0A\u0E48\u0E19 CORN001",
          size: "lg",
          class: "manual-code__input"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          type: "submit",
          color: "primary",
          size: "lg",
          disabled: !unref(manualCode).trim()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(`\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19`);
            else return [createTextVNode("\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19")];
          }),
          _: 1
        }, _parent));
        _push(`</form>`);
        _push(ssrRenderComponent(_component_UButton, {
          block: "",
          variant: "soft",
          color: "primary",
          icon: "i-lucide-layout-grid",
          to: "/stations"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(` \u0E14\u0E39\u0E10\u0E32\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 `);
            else return [createTextVNode(" \u0E14\u0E39\u0E10\u0E32\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ")];
          }),
          _: 1
        }, _parent));
        if (unref(isOfflineMode)) {
          _push(`<section class="sync-card" data-v-fb12b376><div class="sync-card__row" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-wifi-off",
            class: "sync-card__icon sync-card__icon--offline"
          }, null, _parent));
          _push(`<div class="sync-card__text" data-v-fb12b376><p class="sync-card__title" data-v-fb12b376>\u0E42\u0E2B\u0E21\u0E14\u0E2D\u0E2D\u0E1F\u0E44\u0E25\u0E19\u0E4C</p><p class="sync-card__desc" data-v-fb12b376> \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E43\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E44\u0E21\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15 </p></div></div></section>`);
        } else {
          _push(`<section class="sync-card" data-v-fb12b376><div class="sync-card__row" data-v-fb12b376>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: unref(isOnline) ? "i-lucide-wifi" : "i-lucide-wifi-off",
            class: ["sync-card__icon", { "sync-card__icon--offline": !unref(isOnline) }]
          }, null, _parent));
          _push(`<div class="sync-card__text" data-v-fb12b376><p class="sync-card__title" data-v-fb12b376>${ssrInterpolate(unref(isOnline) ? "\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C" : "\u0E2D\u0E2D\u0E1F\u0E44\u0E25\u0E19\u0E4C")}</p><p class="sync-card__desc" data-v-fb12b376>${ssrInterpolate(unref(hasPending) ? `\u0E21\u0E35 ${unref(pendingCount)} \u0E10\u0E32\u0E19\u0E23\u0E2D Sync \u0E02\u0E36\u0E49\u0E19 Google Sheet` : "Sync \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E41\u0E25\u0E49\u0E27")}</p></div>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "sm",
            variant: "soft",
            loading: unref(isSyncing),
            disabled: !unref(hasPending) || !unref(isOnline) || unref(isSyncing),
            onClick: runSync
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) _push2(` Sync \u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49 `);
              else return [createTextVNode(" Sync \u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49 ")];
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (unref(syncMessage)) _push(`<p class="sync-card__message" data-v-fb12b376>${ssrInterpolate(unref(syncMessage))}</p>`);
          else if (unref(hasPending) && !unref(isOnline)) _push(`<p class="sync-card__message" data-v-fb12b376> \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E08\u0E30 Sync \u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15 </p>`);
          else _push(`<!---->`);
          _push(`</section>`);
        }
        _push(`</div>`);
      }
      if (unref(activeMissionQuestion)) _push(ssrRenderComponent(MissionQuestionPopup_default, {
        open: unref(missionPopupOpen),
        "onUpdate:open": ($event) => isRef(missionPopupOpen) ? missionPopupOpen.value = $event : null,
        "station-name": unref(activeMissionStationName),
        question: unref(activeMissionQuestion),
        answered: unref(activeMissionAnswer),
        onSubmit: handleMissionSubmit,
        onContinue: handleMissionContinue
      }, null, _parent));
      else _push(`<!---->`);
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(successPopupOpen),
        "onUpdate:open": ($event) => isRef(successPopupOpen) ? successPopupOpen.value = $event : null,
        title: "\u0E40\u0E02\u0E49\u0E32\u0E10\u0E32\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08!",
        dismissible: false,
        close: false
      }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`<div class="result-popup" data-v-fb12b376${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-party-popper",
              class: "result-popup__icon"
            }, null, _parent2, _scopeId));
            _push2(`<p class="result-popup__station" data-v-fb12b376${_scopeId}>${ssrInterpolate((_a2 = unref(scannedStation)) == null ? void 0 : _a2.name)}</p>`);
            if (unref(scannedStation)) _push2(`<p class="result-popup__points" data-v-fb12b376${_scopeId}> +${ssrInterpolate(unref(scannedStation).points)} Point </p>`);
            else _push2(`<!---->`);
            _push2(`</div>`);
          } else return [createVNode("div", { class: "result-popup" }, [
            createVNode(_component_UIcon, {
              name: "i-lucide-party-popper",
              class: "result-popup__icon"
            }),
            createVNode("p", { class: "result-popup__station" }, toDisplayString((_b2 = unref(scannedStation)) == null ? void 0 : _b2.name), 1),
            unref(scannedStation) ? (openBlock(), createBlock("p", {
              key: 0,
              class: "result-popup__points"
            }, " +" + toDisplayString(unref(scannedStation).points) + " Point ", 1)) : createCommentVNode("", true)
          ])];
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "primary",
            onClick: closeSuccessPopup
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) _push3(`\u0E15\u0E01\u0E25\u0E07`);
              else return [createTextVNode("\u0E15\u0E01\u0E25\u0E07")];
            }),
            _: 1
          }, _parent2, _scopeId));
          else return [createVNode(_component_UButton, {
            block: "",
            color: "primary",
            onClick: closeSuccessPopup
          }, {
            default: withCtx(() => [createTextVNode("\u0E15\u0E01\u0E25\u0E07")]),
            _: 1
          })];
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(finalPopupOpen),
        "onUpdate:open": ($event) => isRef(finalPopupOpen) ? finalPopupOpen.value = $event : null,
        title: "\u0E22\u0E34\u0E19\u0E14\u0E35\u0E14\u0E49\u0E27\u0E22! \u0E04\u0E38\u0E13\u0E21\u0E32\u0E16\u0E36\u0E07\u0E10\u0E32\u0E19\u0E19\u0E21\u0E41\u0E25\u0E49\u0E27",
        dismissible: false,
        close: false
      }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`<div class="result-popup" data-v-fb12b376${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-milk",
              class: "result-popup__icon"
            }, null, _parent2, _scopeId));
            _push2(`<p class="result-popup__station" data-v-fb12b376${_scopeId}>${ssrInterpolate((_a2 = unref(scannedStation)) == null ? void 0 : _a2.name)}</p>`);
            if (unref(scannedStation)) _push2(`<p class="result-popup__points" data-v-fb12b376${_scopeId}> +${ssrInterpolate(unref(scannedStation).points)} Point </p>`);
            else _push2(`<!---->`);
            _push2(`</div>`);
          } else return [createVNode("div", { class: "result-popup" }, [
            createVNode(_component_UIcon, {
              name: "i-lucide-milk",
              class: "result-popup__icon"
            }),
            createVNode("p", { class: "result-popup__station" }, toDisplayString((_b2 = unref(scannedStation)) == null ? void 0 : _b2.name), 1),
            unref(scannedStation) ? (openBlock(), createBlock("p", {
              key: 0,
              class: "result-popup__points"
            }, " +" + toDisplayString(unref(scannedStation).points) + " Point ", 1)) : createCommentVNode("", true)
          ])];
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="result-popup__actions" data-v-fb12b376${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              block: "",
              color: "neutral",
              variant: "soft",
              onClick: continuePlayingAfterFinalStation
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(`\u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D`);
                else return [createTextVNode("\u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D")];
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              block: "",
              color: "primary",
              loading: unref(isEndingGame) || unref(isEndingGameOffline),
              disabled: unref(isEndingGame) || unref(isEndingGameOffline),
              onClick: handleEndGameButtonClick
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) _push3(`\u0E08\u0E1A\u0E40\u0E01\u0E21`);
                else return [createTextVNode("\u0E08\u0E1A\u0E40\u0E01\u0E21")];
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else return [createVNode("div", { class: "result-popup__actions" }, [createVNode(_component_UButton, {
            block: "",
            color: "neutral",
            variant: "soft",
            onClick: continuePlayingAfterFinalStation
          }, {
            default: withCtx(() => [createTextVNode("\u0E40\u0E25\u0E48\u0E19\u0E15\u0E48\u0E2D")]),
            _: 1
          }), createVNode(_component_UButton, {
            block: "",
            color: "primary",
            loading: unref(isEndingGame) || unref(isEndingGameOffline),
            disabled: unref(isEndingGame) || unref(isEndingGameOffline),
            onClick: handleEndGameButtonClick
          }, {
            default: withCtx(() => [createTextVNode("\u0E08\u0E1A\u0E40\u0E01\u0E21")]),
            _: 1
          }, 8, ["loading", "disabled"])])];
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(surveyPopupOpen),
        "onUpdate:open": ($event) => isRef(surveyPopupOpen) ? surveyPopupOpen.value = $event : null,
        title: "\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19",
        dismissible: false,
        close: false
      }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="survey-popup" data-v-fb12b376${_scopeId}><p class="survey-popup__question" data-v-fb12b376${_scopeId}>\u0E17\u0E48\u0E32\u0E19\u0E0A\u0E2D\u0E1A\u0E14\u0E48\u0E32\u0E19\u0E44\u0E2B\u0E19\u0E21\u0E32\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14</p><div class="survey-popup__scale" data-v-fb12b376${_scopeId}><!--[-->`);
            ssrRenderList(SURVEY_RATING_OPTIONS, (option) => {
              _push2(`<button type="button" class="${ssrRenderClass([{ "survey-popup__option--selected": unref(selectedRating) === option.value }, "survey-popup__option"])}" data-v-fb12b376${_scopeId}><span class="survey-popup__option-value" data-v-fb12b376${_scopeId}>${ssrInterpolate(option.value)}</span><span class="survey-popup__option-label" data-v-fb12b376${_scopeId}>${ssrInterpolate(option.label)}</span></button>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(surveyError)) _push2(`<p class="survey-popup__error" data-v-fb12b376${_scopeId}>${ssrInterpolate(unref(surveyError))}</p>`);
            else _push2(`<!---->`);
            _push2(`</div>`);
          } else return [createVNode("div", { class: "survey-popup" }, [
            createVNode("p", { class: "survey-popup__question" }, "\u0E17\u0E48\u0E32\u0E19\u0E0A\u0E2D\u0E1A\u0E14\u0E48\u0E32\u0E19\u0E44\u0E2B\u0E19\u0E21\u0E32\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14"),
            createVNode("div", { class: "survey-popup__scale" }, [(openBlock(), createBlock(Fragment, null, renderList(SURVEY_RATING_OPTIONS, (option) => {
              return createVNode("button", {
                key: option.value,
                type: "button",
                class: ["survey-popup__option", { "survey-popup__option--selected": unref(selectedRating) === option.value }],
                onClick: ($event) => selectedRating.value = option.value
              }, [createVNode("span", { class: "survey-popup__option-value" }, toDisplayString(option.value), 1), createVNode("span", { class: "survey-popup__option-label" }, toDisplayString(option.label), 1)], 10, ["onClick"]);
            }), 64))]),
            unref(surveyError) ? (openBlock(), createBlock("p", {
              key: 0,
              class: "survey-popup__error"
            }, toDisplayString(unref(surveyError)), 1)) : createCommentVNode("", true)
          ])];
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(ssrRenderComponent(_component_UButton, {
            block: "",
            color: "primary",
            loading: unref(surveySubmitting),
            disabled: !unref(selectedRating) || unref(surveySubmitting),
            onClick: confirmSurveyAndEndGame
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) _push3(` \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19 `);
              else return [createTextVNode(" \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19 ")];
            }),
            _: 1
          }, _parent2, _scopeId));
          else return [createVNode(_component_UButton, {
            block: "",
            color: "primary",
            loading: unref(surveySubmitting),
            disabled: !unref(selectedRating) || unref(surveySubmitting),
            onClick: confirmSurveyAndEndGame
          }, {
            default: withCtx(() => [createTextVNode(" \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19 ")]),
            _: 1
          }, 8, ["loading", "disabled"])];
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
var _sfc_setup = scan_vue_vue_type_script_setup_true_lang_default.setup;
scan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/scan.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var scan_default = /* @__PURE__ */ _plugin_vue_export_helper_default(scan_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-fb12b376"]]);

export { scan_default as default };
//# sourceMappingURL=scan-K2-lHgDN.mjs.map
