import { _ as _plugin_vue_export_helper_default, u as useRoute, b as _sfc_main$7, n as navigateTo, c as _sfc_main$2 } from '../virtual/entry.mjs';
import { P as PageHeader_default } from './PageHeader-D2G5O0y5.mjs';
import { u as useRequireProfile } from './useRequireProfile-lZ7eJIgL.mjs';
import { u as usePhotoQuest } from './usePhotoQuest-CN5VnOPV.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';
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
import './useProfile-Di4CdYil.mjs';
import 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/zod/index.js';

var CameraCapture_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "CameraCapture",
  __ssrInlineRender: true,
  emits: ["capture"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const state = ref("idle");
    const errorMessage = ref("");
    const videoEl = ref(null);
    const canvasEl = ref(null);
    let stream = null;
    const emit = __emit;
    async function startCamera() {
      state.value = "starting";
      errorMessage.value = "";
      try {
        stream = await (void 0).mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false
        });
        if (videoEl.value) {
          videoEl.value.srcObject = stream;
          await videoEl.value.play();
        }
        state.value = "running";
      } catch (err) {
        state.value = "error";
        errorMessage.value = err instanceof Error ? err.message : "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E44\u0E14\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E01\u0E25\u0E49\u0E2D\u0E07";
      }
    }
    function stopCamera() {
      stream == null ? void 0 : stream.getTracks().forEach((track) => track.stop());
      stream = null;
      if (videoEl.value) videoEl.value.srcObject = null;
      state.value = "idle";
    }
    function capturePhoto() {
      if (!videoEl.value || !canvasEl.value || state.value !== "running") return;
      const video = videoEl.value;
      const canvas = canvasEl.value;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const img = new Image();
      img.onload = () => emit("capture", img);
      img.src = dataUrl;
    }
    __expose({
      startCamera,
      stopCamera,
      capturePhoto
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$2;
      const _component_UIcon = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "camera-capture" }, _attrs))} data-v-a3794553>`);
      if (unref(state) === "idle") {
        _push(`<div class="camera-capture__prompt" data-v-a3794553>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-lucide-camera",
          size: "lg",
          onClick: startCamera
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(`\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B`);
            else return [createTextVNode("\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B")];
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(state) === "starting") {
        _push(`<div class="camera-capture__status" data-v-a3794553>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-loader-2",
          class: "camera-capture__spinner"
        }, null, _parent));
        _push(`<p data-v-a3794553>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E01\u0E25\u0E49\u0E2D\u0E07...</p></div>`);
      } else if (unref(state) === "error") {
        _push(`<div class="camera-capture__status camera-capture__status--error" data-v-a3794553>`);
        _push(ssrRenderComponent(_component_UIcon, { name: "i-lucide-camera-off" }, null, _parent));
        _push(`<p data-v-a3794553>${ssrInterpolate(unref(errorMessage))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          onClick: startCamera
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) _push2(`\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07`);
            else return [createTextVNode("\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07")];
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else _push(`<!---->`);
      _push(`<div class="camera-capture__viewport" style="${ssrRenderStyle(unref(state) === "running" ? null : { display: "none" })}" data-v-a3794553><video class="camera-capture__video" playsinline muted data-v-a3794553></video><button type="button" class="camera-capture__shutter" aria-label="\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B" data-v-a3794553><span class="camera-capture__shutter-inner" data-v-a3794553></span></button></div><canvas class="camera-capture__canvas-hidden" data-v-a3794553></canvas></div>`);
    };
  }
});
var _sfc_setup$2 = CameraCapture_vue_vue_type_script_setup_true_lang_default.setup;
CameraCapture_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-quest/CameraCapture.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var CameraCapture_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(CameraCapture_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a3794553"]]), { __name: "PhotoQuestCameraCapture" });
var ResultFeedback_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "ResultFeedback",
  __ssrInlineRender: true,
  props: {
    result: {},
    points: {}
  },
  emits: ["retry", "done"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$7;
      const _component_UButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: ["result-feedback", __props.result.passed ? "result-feedback--pass" : "result-feedback--fail"] }, _attrs))} data-v-5c567f9f>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.result.passed ? "i-lucide-party-popper" : "i-lucide-circle-x",
        class: "result-feedback__icon"
      }, null, _parent));
      _push(`<p class="result-feedback__title" data-v-5c567f9f>${ssrInterpolate(__props.result.passed ? "\u0E40\u0E04\u0E27\u0E2A\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08!" : "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")}</p>`);
      if (__props.result.passed) _push(`<p class="result-feedback__points" data-v-5c567f9f>+${ssrInterpolate(__props.points)} \u0E04\u0E30\u0E41\u0E19\u0E19</p>`);
      else _push(`<!---->`);
      if (__props.result.reason) _push(`<p class="result-feedback__reason" data-v-5c567f9f>${ssrInterpolate(__props.result.reason)}</p>`);
      else _push(`<!---->`);
      if (__props.result.passed) _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        onClick: ($event) => emit("done")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(`\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E04\u0E27\u0E2A`);
          else return [createTextVNode("\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E04\u0E27\u0E2A")];
        }),
        _: 1
      }, _parent));
      else _push(ssrRenderComponent(_component_UButton, {
        size: "lg",
        variant: "outline",
        onClick: ($event) => emit("retry")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) _push2(`\u0E16\u0E48\u0E32\u0E22\u0E43\u0E2B\u0E21\u0E48`);
          else return [createTextVNode("\u0E16\u0E48\u0E32\u0E22\u0E43\u0E2B\u0E21\u0E48")];
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
var _sfc_setup$1 = ResultFeedback_vue_vue_type_script_setup_true_lang_default.setup;
ResultFeedback_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/photo-quest/ResultFeedback.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ResultFeedback_default = /* @__PURE__ */ Object.assign(_plugin_vue_export_helper_default(ResultFeedback_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5c567f9f"]]), { __name: "PhotoQuestResultFeedback" });
var _id__vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const { isReady } = useRequireProfile();
    const questId = useRoute().params.id;
    const { findQuest, attemptQuest, isCompleted } = usePhotoQuest();
    const isChecking = ref(false);
    const result = ref(null);
    const cameraRef = ref(null);
    const quest = computed(() => findQuest(questId));
    const alreadyCompleted = computed(() => quest.value ? isCompleted(quest.value.id) : false);
    async function handleCapture(image) {
      if (!quest.value) return;
      isChecking.value = true;
      result.value = null;
      try {
        result.value = await attemptQuest(quest.value, image);
      } finally {
        isChecking.value = false;
      }
    }
    function retry() {
      var _a;
      result.value = null;
      (_a = cameraRef.value) == null ? void 0 : _a.startCamera();
    }
    function done() {
      navigateTo("/photo-quest");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_PageHeader = PageHeader_default;
      const _component_UIcon = _sfc_main$7;
      if (unref(isReady)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "photo-quest-detail" }, _attrs))} data-v-7c585574>`);
        _push(ssrRenderComponent(_component_PageHeader, {
          title: (_b = (_a = unref(quest)) == null ? void 0 : _a.name) != null ? _b : "\u0E40\u0E04\u0E27\u0E2A\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B",
          "back-to": "/photo-quest"
        }, null, _parent));
        if (!unref(quest)) _push(`<div class="photo-quest-detail__missing" data-v-7c585574>\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E40\u0E04\u0E27\u0E2A\u0E19\u0E35\u0E49</div>`);
        else {
          _push(`<div class="photo-quest-detail__content" data-v-7c585574><p class="photo-quest-detail__desc" data-v-7c585574>${ssrInterpolate(unref(quest).description)}</p>`);
          if (unref(quest).exampleImageUrl) _push(`<img${ssrRenderAttr("src", unref(quest).exampleImageUrl)} alt="\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E20\u0E32\u0E1E\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E16\u0E48\u0E32\u0E22" class="photo-quest-detail__example" data-v-7c585574>`);
          else _push(`<!---->`);
          if (unref(alreadyCompleted) && !unref(result)) {
            _push(`<div class="photo-quest-detail__done" data-v-7c585574>`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-check-circle-2",
              class: "photo-quest-detail__done-icon"
            }, null, _parent));
            _push(`<p data-v-7c585574>\u0E17\u0E33\u0E40\u0E04\u0E27\u0E2A\u0E19\u0E35\u0E49\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27</p></div>`);
          } else if (!unref(result)) {
            _push(`<!--[-->`);
            if (unref(isChecking)) {
              _push(`<div class="photo-quest-detail__checking" data-v-7c585574>`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-2",
                class: "photo-quest-detail__spinner"
              }, null, _parent));
              _push(`<p data-v-7c585574>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E20\u0E32\u0E1E...</p></div>`);
            } else _push(ssrRenderComponent(CameraCapture_default, {
              ref_key: "cameraRef",
              ref: cameraRef,
              onCapture: handleCapture
            }, null, _parent));
            _push(`<!--]-->`);
          } else _push(ssrRenderComponent(ResultFeedback_default, {
            result: unref(result),
            points: unref(quest).points,
            onRetry: retry,
            onDone: done
          }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
      } else _push(`<!---->`);
    };
  }
});
var _sfc_setup = _id__vue_vue_type_script_setup_true_lang_default.setup;
_id__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/photo-quest/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = /* @__PURE__ */ _plugin_vue_export_helper_default(_id__vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7c585574"]]);

export { _id__default as default };
//# sourceMappingURL=_id_-DRxSf1AT.mjs.map
