import { defineComponent, useSSRContext } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { ssrRenderAttrs } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/server-renderer/index.mjs';

var station_quest_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "station-quest",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
    };
  }
});
var _sfc_setup = station_quest_vue_vue_type_script_setup_true_lang_default.setup;
station_quest_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/station-quest.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var station_quest_default = station_quest_vue_vue_type_script_setup_true_lang_default;

export { station_quest_default as default };
//# sourceMappingURL=station-quest-uK7h1YzI.mjs.map
