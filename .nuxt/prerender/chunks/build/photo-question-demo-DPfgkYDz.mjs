import { _ as _plugin_vue_export_helper_default, b as _sfc_main$7, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useOfflineSync } from './useOfflineSync-CTQBoPkt.mjs';
import { defineComponent, ref, mergeProps, unref, computed, resolveComponent, withCtx, createTextVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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
import './useRound-BmAVHypg.mjs';

var PhotoQuestion_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "PhotoQuestion",
  __ssrInlineRender: true,
  props: {
    questionId: {},
    question: {},
    points: {},
    config: { default: () => ({}) }
  },
  emits: ["confirmed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const state = ref("idle");
    const capturedPhoto = ref(null);
    const cameraErrorMessage = ref("");
    const { isOnline } = useOfflineSync();
    const allowRetakeAfterConfirm = computed(() => {
      var _a, _b;
      return (_b = (_a = props.config) == null ? void 0 : _a.allowRetakeAfterConfirm) != null ? _b : true;
    });
    function openCamera() {
      cameraErrorMessage.value = "";
      state.value = "camera";
    }
    function handleCapture(photoDataUrl) {
      capturedPhoto.value = photoDataUrl;
      state.value = "preview";
    }
    function handleCameraCancel() {
      state.value = "idle";
    }
    function handleRetake() {
      capturedPhoto.value = null;
      state.value = "camera";
    }
    function handleConfirm() {
      if (!capturedPhoto.value) return;
      state.value = "confirmed";
      emit("confirmed", {
        questionId: props.questionId,
        photoDataUrl: capturedPhoto.value,
        capturedAt: Date.now()
      });
    }
    function handleRetakeAfterConfirm() {
      capturedPhoto.value = null;
      state.value = "camera";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      const _component_PhotoCamera = resolveComponent("PhotoCamera");
      const _component_PhotoPreview = resolveComponent("PhotoPreview");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-question" }, _attrs))} data-v-06e921d9>`);
      if (unref(state) === "idle") {
        _push(`<div class="photo-question__idle" data-v-06e921d9><p class="photo-question__question" data-v-06e921d9>${ssrInterpolate(__props.question)}</p>`);
        if ((_a = __props.config) == null ? void 0 : _a.hint) _push(`<p class="photo-question__hint" data-v-06e921d9>${ssrInterpolate(__props.config.hint)}</p>`);
        else _push(`<!---->`);
        if (!unref(isOnline)) {
          _push(`<p class="photo-question__offline-note" data-v-06e921d9>`);
          _push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-wifi-off" }, null, _parent));
          _push(` \u0E2D\u0E2D\u0E1F\u0E44\u0E25\u0E19\u0E4C\u0E2D\u0E22\u0E39\u0E48 \u2014 \u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E1B\u0E01\u0E15\u0E34 \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E40\u0E01\u0E47\u0E1A\u0E44\u0E27\u0E49\u0E01\u0E48\u0E2D\u0E19 </p>`);
        } else _push(`<!---->`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-camera",
          size: "xl",
          onClick: openCamera
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(` \u{1F4F7} \u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B `);
            else return [createTextVNode(" \u{1F4F7} \u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B ")];
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(state) === "camera") {
        _push(`<div class="photo-question__camera" data-v-06e921d9>`);
        _push(ssrRenderComponent(_component_PhotoCamera, {
          onCapture: handleCapture,
          onCancel: handleCameraCancel
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(state) === "preview" && unref(capturedPhoto)) {
        _push(`<div class="photo-question__preview" data-v-06e921d9>`);
        _push(ssrRenderComponent(_component_PhotoPreview, {
          "photo-data-url": unref(capturedPhoto),
          onRetake: handleRetake,
          onConfirm: handleConfirm
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(state) === "confirmed") {
        _push(`<div class="photo-question__confirmed" data-v-06e921d9>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-check-circle-2",
          class: "photo-question__confirmed-icon"
        }, null, _parent));
        _push(`<p class="photo-question__confirmed-title" data-v-06e921d9>\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E41\u0E25\u0E49\u0E27</p><p class="photo-question__confirmed-note" data-v-06e921d9>\u0E23\u0E2D\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E43\u0E19\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E16\u0E31\u0E14\u0E44\u0E1B</p>`);
        if (unref(capturedPhoto)) _push(`<img${ssrRenderAttr("src", unref(capturedPhoto))} alt="\u0E23\u0E39\u0E1B\u0E17\u0E35\u0E48\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27" class="photo-question__confirmed-thumb" data-v-06e921d9>`);
        else _push(`<!---->`);
        if (unref(allowRetakeAfterConfirm)) _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          size: "sm",
          onClick: handleRetakeAfterConfirm
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(` \u0E16\u0E48\u0E32\u0E22\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07 `);
            else return [createTextVNode(" \u0E16\u0E48\u0E32\u0E22\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07 ")];
          }),
          _: 1
        }, _parent));
        else _push(`<!---->`);
        _push(`</div>`);
      } else if (unref(state) === "error") {
        _push(`<div class="photo-question__error" data-v-06e921d9>`);
        _push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-triangle-alert" }, null, _parent));
        _push(`<p data-v-06e921d9>${ssrInterpolate(unref(cameraErrorMessage) || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07")}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          onClick: ($event) => state.value = "idle"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(`\u0E01\u0E25\u0E31\u0E1A`);
            else return [createTextVNode("\u0E01\u0E25\u0E31\u0E1A")];
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else _push(`<!---->`);
      _push(`</div>`);
    };
  }
});
var _sfc_setup$1 = PhotoQuestion_vue_vue_type_script_setup_true_lang_default.setup;
PhotoQuestion_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-question/PhotoQuestion.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PhotoQuestion_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(PhotoQuestion_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-06e921d9"]]), { __name: "PhotoQuestion" });
var photo_question_demo_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "photo-question-demo",
  __ssrInlineRender: true,
  setup(__props) {
    const mockQuestion = {
      questionId: "demo-photo-q-1",
      question: "\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E43\u0E19\u0E1F\u0E32\u0E23\u0E4C\u0E21\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E40\u0E2B\u0E47\u0E19 \u0E13 \u0E10\u0E32\u0E19\u0E19\u0E35\u0E49",
      points: 50,
      config: { hint: "\u0E16\u0E48\u0E32\u0E22\u0E43\u0E2B\u0E49\u0E40\u0E2B\u0E47\u0E19\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E0A\u0E31\u0E14\u0E40\u0E08\u0E19\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E20\u0E32\u0E1E" }
    };
    const lastConfirmed = ref(null);
    function handleConfirmed(payload) {
      lastConfirmed.value = payload;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = PageHeader_default;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-question-demo" }, _attrs))} data-v-56a1c440>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "\u0E17\u0E14\u0E2A\u0E2D\u0E1A Photo Question",
        "back-to": "/home"
      }, null, _parent));
      _push(`<div class="photo-question-demo__content" data-v-56a1c440><p class="photo-question-demo__badge" data-v-56a1c440>\u{1F9EA} \u0E2B\u0E19\u0E49\u0E32\u0E17\u0E14\u0E2A\u0E2D\u0E1A \u2014 Phase 1 (UI/Flow \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35 AI Detection)</p><div class="photo-question-demo__card" data-v-56a1c440>`);
      _push(ssrRenderComponent(PhotoQuestion_default, {
        "question-id": mockQuestion.questionId,
        question: mockQuestion.question,
        points: mockQuestion.points,
        config: mockQuestion.config,
        onConfirmed: handleConfirmed
      }, null, _parent));
      _push(`</div>`);
      if (unref(lastConfirmed)) _push(`<div class="photo-question-demo__debug" data-v-56a1c440><p class="photo-question-demo__debug-title" data-v-56a1c440>Payload \u0E17\u0E35\u0E48 emit \u0E2D\u0E2D\u0E01\u0E21\u0E32 (\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A Phase \u0E16\u0E31\u0E14\u0E44\u0E1B):</p><pre data-v-56a1c440>${ssrInterpolate(JSON.stringify({
        questionId: unref(lastConfirmed).questionId,
        capturedAt: unref(lastConfirmed).capturedAt
      }, null, 2))}</pre></div>`);
      else _push(`<!---->`);
      _push(`</div></div>`);
    };
  }
});
var _sfc_setup = photo_question_demo_vue_vue_type_script_setup_true_lang_default.setup;
photo_question_demo_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/photo-question-demo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var photo_question_demo_default = /* @__PURE__ */ _plugin_vue_export_helper_default(photo_question_demo_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-56a1c440"]]);

export { photo_question_demo_default as default };
//# sourceMappingURL=photo-question-demo-DPfgkYDz.mjs.map
