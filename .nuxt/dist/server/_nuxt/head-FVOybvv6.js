import { a as useNuxtApp, d as docsBase, f as prodReporters } from "./nuxt-B_uYz8OD.js";
import { defineProdDiagnostics } from "nostics";
import { hasInjectionContext, inject } from "vue";
import { headSymbol, useHead } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/nuxt/node_modules/@unhead/vue/dist/index.mjs";
//#region node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject(headSymbol);
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead$1(input, options = {}) {
	const head = options.head || injectHead(options.nuxt);
	return useHead(input, {
		head,
		...options
	});
}
//#endregion
export { useHead$1 as t };

//# sourceMappingURL=head-FVOybvv6.js.map