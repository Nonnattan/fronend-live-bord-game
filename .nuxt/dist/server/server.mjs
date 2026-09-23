import { a as useNuxtApp, c as nuxtLinkDefaults, d as docsBase, f as prodReporters, i as defineNuxtPlugin, n as createNuxtApp, o as useRuntimeConfig, r as defineAppConfig, s as asyncDataDefaults, t as applyPlugins, u as appDiagnostics } from "./_nuxt/nuxt-B_uYz8OD.js";
import { a as useError, c as navigateTo, d as useRouter, f as navigationDiagnostics, g as toArray$1, h as PageRouteSymbol, i as showError, l as resolveRouteObject, m as LayoutSymbol, n as createError$1, o as defineNuxtRouteMiddleware, p as LayoutMetaSymbol, r as isNuxtError, s as encodeRoutePath, t as _showErrorUnlessCrawler, u as useRoute } from "./_nuxt/error-CeCQlnc5.js";
import { a as useRoute$1, i as sanitizeTag, n as _wrapInTransition, r as isChangingPage, t as _mergeTransitionProps } from "./_nuxt/ready-AUws7oa4.js";
import { t as useHead$1 } from "./_nuxt/head-FVOybvv6.js";
import { defineProdDiagnostics } from "nostics";
import { Comment, Fragment, Suspense, camelize, cloneVNode, computed, createApp, createBlock, createCommentVNode, createElementBlock, createTextVNode, createVNode, defineAsyncComponent, defineComponent, getCurrentInstance, h, inject, isReactive, isReadonly, isRef, isShallow, isVNode, mergeModels, mergeProps, nextTick, onErrorCaptured, onServerPrefetch, openBlock, provide, queuePostFlushCb, reactive, readonly, ref, renderSlot, resolveComponent, resolveDynamicComponent, shallowReactive, shallowRef, toDisplayString, toHandlerKey, toRaw, toRef, toValue, unref, useModel, useSSRContext, useSlots, watch, withCtx } from "vue";
import { executeAsync } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/unctx/dist/index.mjs";
import { appendHeader } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/@nuxt/nitro-server/dist/h3.mjs";
import { hasProtocol, isScriptProtocol, joinURL, parseQuery, withTrailingSlash, withoutTrailingSlash } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/ufo/dist/index.mjs";
import { $fetch } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/ofetch/dist/node.mjs";
import { baseURL } from "#internal/nuxt/paths";
import { RouterView, START_LOCATION, createMemoryHistory, createRouter } from "vue-router";
import defu, { defu as defu$1, defuFn } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/defu/dist/defu.mjs";
import { klona } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/klona/dist/index.mjs";
import "C:/xampp/htdocs/fronend-live-bord-game/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import { hash } from "C:/xampp/htdocs/fronend-live-bord-game/node_modules/ohash/dist/index.mjs";
import { Icon, _api, addAPIProvider, addIcon, getIcon, loadIcon, setCustomIconsLoader } from "@iconify/vue";
import colors from "tailwindcss/colors";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrRenderSuspense, ssrRenderVNode } from "vue/server-renderer";
import { reactiveOmit, reactivePick, useDebounceFn } from "@vueuse/core";
import { getIconCSS } from "@iconify/utils/lib/css/icon";
import { diff, isEqual as isEqual$1 } from "ohash/utils";
import { cnMerge, createTV } from "tailwind-variants";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region virtual:nuxt:.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch.create({ baseURL: baseURL() });
var $fetch$2 = globalThis.$fetch;
//#endregion
//#region virtual:nuxt:.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$3 = defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = override ?? matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
/** @since 3.9.0 */
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(selector) {
	try {
		const elem = (void 0).querySelector(selector);
		if (elem) return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
	} catch {}
	return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt__nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	...router_options_default
};
Object.assign(Object.create(null), {});
var pageIslandRoutes = Object.assign(Object.create(null), {});
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/validate.js
var middleware$1 = defineNuxtRouteMiddleware(async (to) => {
	let __temp, __restore;
	if (!to.meta?.validate) return;
	const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
	if (result === true) return;
	return createError$1({
		fatal: false,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
}, 1);
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:.nuxt%2Froute-rules.mjs
var sensitiveMatcher = (m, p) => {
	return [];
};
var foldedMatcher = sensitiveMatcher;
var decodeRoutePath = function decodeRoutePath(path) {
	if (!path.includes("%")) return path;
	const queryIndex = path.indexOf("?");
	const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
	try {
		return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
	} catch {
		return path;
	}
};
var normalizePath = (path, fold) => {
	if (typeof path !== "string") return path;
	const decoded = decodeRoutePath(path);
	return fold ? decoded.toLowerCase() : decoded;
};
var virtual_nuxt__nuxt_2Froute_rules_default = (path) => virtual_nuxt__nuxt_2Frouter_options_default.sensitive ? defu$1({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu$1({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
//#endregion
//#region node_modules/nuxt/dist/app/composables/manifest.js
var routeRulesMatcher$2 = virtual_nuxt__nuxt_2Froute_rules_default;
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher$2(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region virtual:nuxt:.nuxt%2Fmiddleware.mjs
var globalMiddleware = [middleware$1, /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
var namedMiddleware = {};
//#endregion
//#region virtual:nuxt:.nuxt%2Froutes.mjs
var virtual_nuxt__nuxt_2Froutes_default = [
	{
		name: "station-stationId",
		path: "/station/:stationId()",
		meta: { layout: "app" },
		component: () => import("./_nuxt/_stationId_-DXcUs4Mk.js")
	},
	{
		name: "evaluation",
		path: "/evaluation",
		meta: { layout: "app" },
		component: () => import("./_nuxt/evaluation-BRgal1qV.js")
	},
	{
		name: "history",
		path: "/history",
		meta: { layout: "app" },
		component: () => import("./_nuxt/history-BVube4Ev.js")
	},
	{
		name: "home",
		path: "/home",
		meta: { layout: "app" },
		component: () => import("./_nuxt/home-VgRzosnP.js")
	},
	{
		name: "info",
		path: "/info",
		meta: { layout: "app" },
		component: () => import("./_nuxt/info-woEb0fxU.js")
	},
	{
		name: "map",
		path: "/map",
		meta: { layout: "app" },
		component: () => import("./_nuxt/map-hM_GwHrm.js")
	},
	{
		name: "offline",
		path: "/offline",
		component: () => import("./_nuxt/offline-Y5uLCA5V.js")
	},
	{
		name: "photo-quest",
		path: "/photo-quest",
		meta: { layout: "app" },
		component: () => import("./_nuxt/photo-quest-LJc1xJWG.js"),
		children: [{
			name: "photo-quest-id",
			path: ":id()",
			meta: { layout: "app" },
			component: () => import("./_nuxt/_id_-DRxSf1AT.js")
		}]
	},
	{
		name: "photo-question-demo",
		path: "/photo-question-demo",
		meta: { layout: "app" },
		component: () => import("./_nuxt/photo-question-demo-DPfgkYDz.js")
	},
	{
		name: "profile",
		path: "/profile",
		meta: { layout: "app" },
		component: () => import("./_nuxt/profile-DsrJP06U.js")
	},
	{
		name: "redeem",
		path: "/redeem",
		meta: { layout: false },
		component: () => import("./_nuxt/redeem-BIFRb9tb.js")
	},
	{
		name: "reservation",
		path: "/reservation",
		meta: { layout: "app" },
		component: () => import("./_nuxt/reservation-DwBvuiHC.js")
	},
	{
		name: "reward-received",
		path: "/reward-received",
		meta: { layout: false },
		component: () => import("./_nuxt/reward-received-DBolMWvB.js")
	},
	{
		name: "round-summary",
		path: "/round-summary",
		meta: { layout: false },
		component: () => import("./_nuxt/round-summary-BiVCuPlw.js")
	},
	{
		name: "scan",
		path: "/scan",
		meta: { layout: "app" },
		component: () => import("./_nuxt/scan-K2-lHgDN.js")
	},
	{
		name: "starting",
		path: "/starting",
		meta: { layout: "app" },
		component: () => import("./_nuxt/starting-DVfrqKeW.js")
	},
	{
		name: "station-quest",
		path: "/station-quest",
		meta: { layout: "app" },
		component: () => import("./_nuxt/station-quest-uK7h1YzI.js")
	},
	{
		name: "stations",
		path: "/stations",
		meta: { layout: "app" },
		component: () => import("./_nuxt/stations-CoE-K6EP.js")
	},
	{
		name: "index",
		path: "/",
		component: () => import("./_nuxt/pages-BHo-uPyE.js")
	}
];
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/plugins/router.js
var plugin$2 = defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let __temp, __restore;
		let routerBase = useRuntimeConfig().app.baseURL;
		const history = virtual_nuxt__nuxt_2Frouter_options_default.history?.(routerBase) ?? createMemoryHistory(routerBase);
		const routes = virtual_nuxt__nuxt_2Frouter_options_default.routes ? ([__temp, __restore] = executeAsync(() => virtual_nuxt__nuxt_2Frouter_options_default.routes(virtual_nuxt__nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt__nuxt_2Froutes_default : virtual_nuxt__nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt__nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in (void 0).history) {
						const unsub = router.beforeEach(() => {
							unsub();
							(void 0).history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		nuxtApp.vueApp.use(router);
		const previousRoute = shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = nuxtApp.ssrContext.url;
		const _route = shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = useError();
		const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
		if (!nuxtApp.ssrContext?.islandContext || isServerPage) router.afterEach(async (to, _from, failure) => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			if (failure) await nuxtApp.callHook("page:loading:end");
			if (failure?.type === 4) return;
			if (to.redirectedFrom && to.fullPath !== initialURL) await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
		});
		try {
			[__temp, __restore] = executeAsync(() => router.push(initialURL)), __temp = await __temp, __restore();
			[__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
		} catch (error) {
			[__temp, __restore] = executeAsync(() => _showErrorUnlessCrawler(nuxtApp, error)), await __temp, __restore();
		}
		const resolvedInitialRoute = router.currentRoute.value;
		syncCurrentRoute();
		if (nuxtApp.ssrContext?.islandContext && !isServerPage) return { provide: { router } };
		const initialLayout = nuxtApp.payload.state._layout;
		router.beforeEach(async (to, from) => {
			await nuxtApp.callHook("page:loading:start");
			to.meta = reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const result = await nuxtApp.runWithContext(() => middleware(to, from));
						if (result === false || result instanceof Error) {
							const error = result || createError$1({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`
							});
							await nuxtApp.runWithContext(() => showError(error));
							return false;
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) await nuxtApp.runWithContext(() => showError(result));
							return result;
						}
					} catch (err) {
						const error = createError$1(err);
						if (error.fatal) await nuxtApp.runWithContext(() => showError(error));
						return error;
					}
				}
			}
		});
		if (isServerPage) router.beforeResolve((to) => {
			const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
			const actual = to.matched.find((m) => (m.components?.default)?.__nuxt_island)?.components?.default;
			if (!expected || expected !== actual?.__nuxt_island) {
				nuxtApp.ssrContext["~renderResponse"] = {
					statusCode: 400,
					statusMessage: "Invalid island request path"
				};
				return false;
			}
		});
		router.onError(async () => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			await nuxtApp.callHook("page:loading:end");
		});
		router.afterEach((to) => {
			if (to.matched.length === 0 && !error.value) return nuxtApp.runWithContext(() => showError(createError$1({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
}, 1);
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/state.js
/**
* E7xxx
* Payload / state / cookie runtime diagnostics.
*/
var stateDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:server",
	setup() {
		for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/state.js
var useStateKeyPrefix = "$s";
function useState(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, init] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7009({ key: _key });
	if (init !== void 0 && typeof init !== "function") throw stateDiagnostics.NUXT_E7007({ type: typeof init });
	const key = useStateKeyPrefix + _key;
	const nuxtApp = useNuxtApp();
	const state = toRef(nuxtApp.payload.state, key);
	if (init) nuxtApp._state[key] ??= { _default: init };
	if (state.value === void 0 && init) {
		const initialValue = init();
		if (isRef(initialValue)) {
			nuxtApp.payload.state[key] = initialValue;
			return initialValue;
		}
		state.value = initialValue;
	}
	return state;
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/ssr.js
var $fetch$1 = $fetch$2;
/** @since 3.0.0 */
function useRequestEvent(nuxtApp) {
	nuxtApp ||= useNuxtApp();
	return nuxtApp.ssrContext?.event;
}
/** @since 3.2.0 */
function useRequestFetch() {
	return useRequestEvent()?.$fetch || $fetch$1;
}
/** @since 3.8.0 */
function prerenderRoutes(path) {
	if (!import.meta.prerender) return;
	const paths = toArray$1(path);
	appendHeader(useRequestEvent(), "x-nitro-prerender", paths.map((p) => encodeURIComponent(p)).join(", "));
}
//#endregion
//#region virtual:nuxt:.nuxt%2Fcolor-mode-options.mjs
var preference = "system";
//#endregion
//#region node_modules/@nuxtjs/color-mode/dist/runtime/plugin.server.js
var plugin_server_default = defineNuxtPlugin((nuxtApp) => {
	const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}).value : useState("color-mode", () => reactive({
		preference,
		value: preference,
		unknown: true,
		forced: false
	})).value;
	const htmlAttrs = {};
	useHead$1({ htmlAttrs });
	useRouter().afterEach((to) => {
		const forcedColorMode = to.meta.colorMode;
		if (forcedColorMode && forcedColorMode !== "system") {
			htmlAttrs["data-color-mode-forced"] = forcedColorMode;
			colorMode.value = forcedColorMode;
			colorMode.forced = true;
		} else if (forcedColorMode === "system") console.warn("You cannot force the colorMode to system at the page level.");
	});
	nuxtApp.provide("colorMode", colorMode);
});
//#endregion
//#region app.config.ts
var app_config_default = defineAppConfig({ ui: { colors: {
	primary: "green",
	neutral: "stone"
} } });
var virtual_nuxt__nuxt_2Fapp_config_default = /*@__PURE__*/ defuFn(app_config_default, {
	"nuxt": {},
	"ui": {
		"colors": {
			"primary": "green",
			"secondary": "blue",
			"success": "green",
			"info": "blue",
			"warning": "yellow",
			"error": "red",
			"neutral": "slate"
		},
		"icons": {
			"arrowDown": "i-lucide-arrow-down",
			"arrowLeft": "i-lucide-arrow-left",
			"arrowRight": "i-lucide-arrow-right",
			"arrowUp": "i-lucide-arrow-up",
			"caution": "i-lucide-circle-alert",
			"check": "i-lucide-check",
			"chevronDoubleLeft": "i-lucide-chevrons-left",
			"chevronDoubleRight": "i-lucide-chevrons-right",
			"chevronDown": "i-lucide-chevron-down",
			"chevronLeft": "i-lucide-chevron-left",
			"chevronRight": "i-lucide-chevron-right",
			"chevronUp": "i-lucide-chevron-up",
			"close": "i-lucide-x",
			"copy": "i-lucide-copy",
			"copyCheck": "i-lucide-copy-check",
			"dark": "i-lucide-moon",
			"drag": "i-lucide-grip-vertical",
			"ellipsis": "i-lucide-ellipsis",
			"error": "i-lucide-circle-x",
			"external": "i-lucide-arrow-up-right",
			"eye": "i-lucide-eye",
			"eyeOff": "i-lucide-eye-off",
			"file": "i-lucide-file",
			"folder": "i-lucide-folder",
			"folderOpen": "i-lucide-folder-open",
			"hash": "i-lucide-hash",
			"info": "i-lucide-info",
			"light": "i-lucide-sun",
			"loading": "i-lucide-loader-circle",
			"menu": "i-lucide-menu",
			"minus": "i-lucide-minus",
			"panelClose": "i-lucide-panel-left-close",
			"panelOpen": "i-lucide-panel-left-open",
			"plus": "i-lucide-plus",
			"reload": "i-lucide-rotate-ccw",
			"search": "i-lucide-search",
			"stop": "i-lucide-square",
			"star": "i-lucide-star",
			"success": "i-lucide-circle-check",
			"system": "i-lucide-monitor",
			"tip": "i-lucide-lightbulb",
			"upload": "i-lucide-upload",
			"warning": "i-lucide-triangle-alert"
		},
		"tv": { "twMergeConfig": {} }
	},
	"icon": {
		"provider": "iconify",
		"class": "",
		"aliases": {},
		"iconifyApiEndpoint": "https://api.iconify.design",
		"localApiEndpoint": "/api/_nuxt_icon",
		"fallbackToApi": true,
		"cssSelectorPrefix": "i-",
		"cssWherePseudo": true,
		"cssLayer": "base",
		"mode": "css",
		"attrs": { "aria-hidden": true },
		"collections": [
			"academicons",
			"akar-icons",
			"ant-design",
			"arcticons",
			"basil",
			"bi",
			"bitcoin-icons",
			"bpmn",
			"brandico",
			"bx",
			"bxl",
			"bxs",
			"bytesize",
			"carbon",
			"catppuccin",
			"cbi",
			"charm",
			"ci",
			"cib",
			"cif",
			"cil",
			"circle-flags",
			"circum",
			"clarity",
			"codex",
			"codicon",
			"covid",
			"cryptocurrency",
			"cryptocurrency-color",
			"cuida",
			"dashicons",
			"devicon",
			"devicon-plain",
			"dinkie-icons",
			"duo-icons",
			"ei",
			"el",
			"emojione",
			"emojione-monotone",
			"emojione-v1",
			"entypo",
			"entypo-social",
			"eos-icons",
			"ep",
			"et",
			"eva",
			"f7",
			"fa",
			"fa-brands",
			"fa-regular",
			"fa-solid",
			"fa6-brands",
			"fa6-regular",
			"fa6-solid",
			"fa7-brands",
			"fa7-regular",
			"fa7-solid",
			"fad",
			"famicons",
			"fe",
			"feather",
			"file-icons",
			"flag",
			"flagpack",
			"flat-color-icons",
			"flat-ui",
			"flowbite",
			"fluent",
			"fluent-color",
			"fluent-emoji",
			"fluent-emoji-flat",
			"fluent-emoji-high-contrast",
			"fluent-mdl2",
			"fontelico",
			"fontisto",
			"formkit",
			"foundation",
			"fxemoji",
			"gala",
			"game-icons",
			"garden",
			"geo",
			"gg",
			"gis",
			"gravity-ui",
			"gridicons",
			"grommet-icons",
			"guidance",
			"healthicons",
			"heroicons",
			"heroicons-outline",
			"heroicons-solid",
			"hugeicons",
			"humbleicons",
			"ic",
			"icomoon-free",
			"icon-park",
			"icon-park-outline",
			"icon-park-solid",
			"icon-park-twotone",
			"iconamoon",
			"iconoir",
			"icons8",
			"il",
			"ion",
			"iwwa",
			"ix",
			"jam",
			"la",
			"lets-icons",
			"line-md",
			"lineicons",
			"logos",
			"ls",
			"lsicon",
			"lucide",
			"lucide-lab",
			"mage",
			"majesticons",
			"maki",
			"map",
			"marketeq",
			"material-icon-theme",
			"material-symbols",
			"material-symbols-light",
			"mdi",
			"mdi-light",
			"medical-icon",
			"memory",
			"meteocons",
			"meteor-icons",
			"mi",
			"mingcute",
			"mono-icons",
			"mynaui",
			"nimbus",
			"nonicons",
			"noto",
			"noto-v1",
			"nrk",
			"octicon",
			"oi",
			"ooui",
			"openmoji",
			"oui",
			"pajamas",
			"pepicons",
			"pepicons-pencil",
			"pepicons-pop",
			"pepicons-print",
			"ph",
			"picon",
			"pixel",
			"pixelarticons",
			"prime",
			"proicons",
			"ps",
			"qlementine-icons",
			"quill",
			"radix-icons",
			"raphael",
			"ri",
			"rivet-icons",
			"roentgen",
			"si",
			"si-glyph",
			"sidekickicons",
			"simple-icons",
			"simple-line-icons",
			"skill-icons",
			"solar",
			"stash",
			"streamline",
			"streamline-block",
			"streamline-color",
			"streamline-cyber",
			"streamline-cyber-color",
			"streamline-emojis",
			"streamline-flex",
			"streamline-flex-color",
			"streamline-freehand",
			"streamline-freehand-color",
			"streamline-kameleon-color",
			"streamline-logos",
			"streamline-pixel",
			"streamline-plump",
			"streamline-plump-color",
			"streamline-sharp",
			"streamline-sharp-color",
			"streamline-stickies-color",
			"streamline-ultimate",
			"streamline-ultimate-color",
			"subway",
			"svg-spinners",
			"system-uicons",
			"tabler",
			"tdesign",
			"teenyicons",
			"temaki",
			"token",
			"token-branded",
			"topcoat",
			"twemoji",
			"typcn",
			"uil",
			"uim",
			"uis",
			"uit",
			"uiw",
			"unjs",
			"vaadin",
			"vs",
			"vscode-icons",
			"websymbol",
			"weui",
			"whh",
			"wi",
			"wpf",
			"zmdi",
			"zondicons"
		],
		"fetchTimeout": 1500
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/config.js
function useAppConfig() {
	const nuxtApp = useNuxtApp();
	nuxtApp._appConfig ||= klona(virtual_nuxt__nuxt_2Fapp_config_default);
	return nuxtApp._appConfig;
}
//#endregion
//#region node_modules/@nuxt/icon/dist/runtime/plugin.js
var plugin_default = defineNuxtPlugin({
	name: "@nuxt/icon",
	setup() {
		const configs = useRuntimeConfig();
		const options = useAppConfig().icon;
		const $fetch = useRequestFetch();
		_api.setFetch($fetch.native);
		const resources = [];
		if (options.provider === "server") {
			const baseURL = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
			resources.push(baseURL + (options.localApiEndpoint || "/api/_nuxt_icon"));
			if (options.fallbackToApi === true || options.fallbackToApi === "client-only") resources.push(options.iconifyApiEndpoint);
		} else if (options.provider === "none") _api.setFetch(() => Promise.resolve(new Response()));
		else resources.push(options.iconifyApiEndpoint);
		async function customIconLoader(icons, prefix) {
			try {
				const data = await $fetch(resources[0] + "/" + prefix + ".json", { query: { icons: icons.join(",") } });
				if (!data || data.prefix !== prefix || !data.icons) throw new Error("Invalid data" + JSON.stringify(data));
				return data;
			} catch (e) {
				console.error("Failed to load custom icons", e);
				return null;
			}
		}
		addAPIProvider("", { resources });
		for (const prefix of options.customCollections || []) if (prefix) setCustomIconsLoader(customIconLoader, prefix);
	}
});
//#endregion
//#region virtual:nuxt:.nuxt%2Fcomponents.plugin.mjs
var lazyGlobalComponents = [["Icon", defineAsyncComponent(() => Promise.resolve().then(() => components_exports).then((r) => r["default"] || r.default || r))]];
var virtual_nuxt__nuxt_2Fcomponents_plugin_default = defineNuxtPlugin({
	name: "nuxt:global-components",
	setup(nuxtApp) {
		for (const [name, component] of lazyGlobalComponents) {
			nuxtApp.vueApp.component(name, component);
			nuxtApp.vueApp.component("Lazy" + name, component);
		}
	}
});
//#endregion
//#region virtual:nuxt:.nuxt%2Fpwa-icons-plugin.ts
var virtual_nuxt__nuxt_2Fpwa_icons_plugin_default = defineNuxtPlugin(() => {
	return { provide: { pwaIcons: {
		transparent: {},
		maskable: {},
		favicon: {},
		apple: {},
		appleSplashScreen: {}
	} } };
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/plugins/colors.js
var shades = [
	50,
	100,
	200,
	300,
	400,
	500,
	600,
	700,
	800,
	900,
	950
];
function getColor(color, shade) {
	if (color in colors && typeof colors[color] === "object" && shade in colors[color]) return colors[color][shade];
	return "";
}
function generateShades(key, value, prefix) {
	const prefixStr = prefix ? `${prefix}-` : "";
	return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
	return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
var colors_default = defineNuxtPlugin(() => {
	const appConfig = useAppConfig();
	useNuxtApp();
	const root = computed(() => {
		const { neutral, ...colors2 } = appConfig.ui.colors;
		const prefix = appConfig.ui.prefix;
		return `@layer theme {
  :root, :host {
  ${Object.entries(appConfig.ui.colors).map(([key, value]) => generateShades(key, value, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
	});
	useHead$1({ style: [{
		innerHTML: root,
		tagPriority: "critical",
		id: "nuxt-ui-colors"
	}] });
});
var routes;
var plugin = defineNuxtPlugin(async () => {
	let __temp, __restore;
	if (!import.meta.prerender || false) return;
	if (routes && !routes.length) return;
	routes ||= Array.from(processRoutes(([__temp, __restore] = executeAsync(() => virtual_nuxt__nuxt_2Frouter_options_default.routes?.(virtual_nuxt__nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt__nuxt_2Froutes_default));
	prerenderRoutes(routes.splice(0, 10));
}, 1);
var OPTIONAL_PARAM_RE = /^\/?:.*(?:\?|\(\.\*\)\*)$/;
function shouldPrerender(path) {
	return true;
}
function processRoutes(routes, currentPath = "/", routesToPrerender = /* @__PURE__ */ new Set()) {
	for (const route of routes) {
		if (OPTIONAL_PARAM_RE.test(route.path) && !route.children?.length && shouldPrerender(currentPath)) routesToPrerender.add(currentPath);
		if (route.path.includes(":")) continue;
		const fullPath = joinURL(currentPath, route.path);
		if (shouldPrerender(fullPath)) routesToPrerender.add(fullPath);
		if (route.children) processRoutes(route.children, fullPath, routesToPrerender);
	}
	return routesToPrerender;
}
//#endregion
//#region virtual:nuxt:.nuxt%2Fplugins.server.mjs
var virtual_nuxt__nuxt_2Fplugins_server_default = [
	plugin$3,
	plugin$2,
	plugin$1,
	plugin_server_default,
	plugin_default,
	virtual_nuxt__nuxt_2Fcomponents_plugin_default,
	virtual_nuxt__nuxt_2Fpwa_icons_plugin_default,
	colors_default,
	plugin
];
//#endregion
//#region node_modules/reka-ui/dist/shared/createContext.js
/**
* @param providerComponentName - The name(s) of the component(s) providing the context.
*
* There are situations where context can come from multiple components. In such cases, you might need to give an array of component names to provide your context, instead of just a single string.
*
* @param contextName The description for injection key symbol.
*/
function createContext(providerComponentName, contextName) {
	const symbolDescription = typeof providerComponentName === "string" && !contextName ? `${providerComponentName}Context` : contextName;
	const injectionKey = Symbol(symbolDescription);
	/**
	* @param fallback The context value to return if the injection fails.
	*
	* @throws When context injection failed and no fallback is specified.
	* This happens when the component injecting the context is not a child of the root component providing the context.
	*/
	const injectContext = (fallback) => {
		const context = inject(injectionKey, fallback);
		if (context) return context;
		if (context === null) return context;
		throw new Error(`Injection \`${injectionKey.toString()}\` not found. Component must be used within ${Array.isArray(providerComponentName) ? `one of the following components: ${providerComponentName.join(", ")}` : `\`${providerComponentName}\``}`);
	};
	const provideContext = (contextValue) => {
		provide(injectionKey, contextValue);
		return contextValue;
	};
	return [injectContext, provideContext];
}
//#endregion
//#region node_modules/reka-ui/dist/shared/renderSlotFragments.js
function renderSlotFragments(children) {
	if (!children) return [];
	return children.flatMap((child) => {
		if (child.type === Fragment) return renderSlotFragments(child.children);
		return [child];
	});
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useEmitAsProps.js
/**
* The `useEmitAsProps` function is a TypeScript utility that converts emitted events into props for a
* Vue component.
*
* @template Name - The event name string union type.
* @template Fn - The emit function type.
*
* @param emit - The `emit` parameter is a function that is used to emit events from a component. It
*
* takes two parameters: `name` which is the name of the event to be emitted, and `...args` which are
* the arguments to be passed along with the event.
* @returns The function `useEmitAsProps` returns an object that maps event names to functions that
* call the `emit` function with the corresponding event name and arguments.
*/
function useEmitAsProps(emit) {
	const vm = getCurrentInstance();
	const events = vm?.type.emits;
	const result = {};
	if (!events?.length) console.warn(`No emitted event found. Please check component: ${vm?.type.__name}`);
	events?.forEach((ev) => {
		result[toHandlerKey(camelize(ev))] = (...arg) => emit(ev, ...arg);
	});
	return result;
}
//#endregion
//#region node_modules/reka-ui/dist/shared/useForwardProps.js
/**
* The `useForwardProps` function in TypeScript takes in a set of props and returns a computed value
* that combines default props with assigned props from the current instance.
* @param {T} props - The `props` parameter is an object that represents the props passed to a
* component.
* @returns computed value that combines the default props, preserved props, and assigned props.
*/
function useForwardProps$1(props) {
	const vm = getCurrentInstance();
	const defaultProps = Object.keys(vm?.type.props ?? {}).reduce((prev, curr) => {
		const defaultValue = (vm?.type.props[curr]).default;
		if (defaultValue !== void 0) prev[curr] = defaultValue;
		return prev;
	}, {});
	const refProps = toRef(props);
	return computed(() => {
		const preservedProps = {};
		const assignedProps = vm?.vnode.props ?? {};
		Object.keys(assignedProps).forEach((key) => {
			preservedProps[camelize(key)] = assignedProps[key];
		});
		return Object.keys({
			...defaultProps,
			...preservedProps
		}).reduce((prev, curr) => {
			if (refProps.value[curr] !== void 0) prev[curr] = refProps.value[curr];
			return prev;
		}, {});
	});
}
//#endregion
//#region node_modules/reka-ui/dist/Primitive/Slot.js
var Slot = /*#__PURE__*/ defineComponent({
	name: "PrimitiveSlot",
	inheritAttrs: false,
	setup(_, { attrs, slots }) {
		return () => {
			if (!slots.default) return null;
			const children = renderSlotFragments(slots.default());
			const firstNonCommentChildrenIndex = children.findIndex((child) => child.type !== Comment);
			if (firstNonCommentChildrenIndex === -1) return children;
			const firstNonCommentChildren = children[firstNonCommentChildrenIndex];
			delete firstNonCommentChildren.props?.ref;
			const mergedProps = firstNonCommentChildren.props ? mergeProps(attrs, firstNonCommentChildren.props) : attrs;
			const cloned = cloneVNode({
				...firstNonCommentChildren,
				props: {}
			}, mergedProps);
			if (children.length === 1) return cloned;
			children[firstNonCommentChildrenIndex] = cloned;
			return children;
		};
	}
});
//#endregion
//#region node_modules/reka-ui/dist/Primitive/Primitive.js
var SELF_CLOSING_TAGS = [
	"area",
	"img",
	"input"
];
var Primitive = /*#__PURE__*/ defineComponent({
	name: "Primitive",
	inheritAttrs: false,
	props: {
		asChild: {
			type: Boolean,
			default: false
		},
		as: {
			type: [String, Object],
			default: "div"
		}
	},
	setup(props, { attrs, slots }) {
		const asTag = props.asChild ? "template" : props.as;
		if (typeof asTag === "string" && SELF_CLOSING_TAGS.includes(asTag)) return () => h(asTag, attrs);
		if (asTag !== "template") return () => h(props.as, attrs, { default: slots.default });
		return () => h(Slot, attrs, { default: slots.default });
	}
});
//#endregion
//#region virtual:nuxt:.nuxt%2Fnuxt-icon-client-bundle.mjs
var _initialized = false;
function init(addIcon) {
	if (_initialized) return;
	const collections = JSON.parse("[{\"prefix\":\"lucide\",\"icons\":{\"arrow-down\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M12 5v14m7-7l-7 7l-7-7\\\"/>\"},\"arrow-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m12 19l-7-7l7-7m7 7H5\\\"/>\"},\"arrow-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M5 12h14m-7-7l7 7l-7 7\\\"/>\"},\"arrow-up\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m5 12l7-7l7 7m-7 7V5\\\"/>\"},\"arrow-up-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M7 7h10v10M7 17L17 7\\\"/>\"},\"check\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M20 6L9 17l-5-5\\\"/>\"},\"chevron-down\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 9l6 6l6-6\\\"/>\"},\"chevron-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m15 18l-6-6l6-6\\\"/>\"},\"chevron-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m9 18l6-6l-6-6\\\"/>\"},\"chevron-up\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m18 15l-6-6l-6 6\\\"/>\"},\"chevrons-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m11 17l-5-5l5-5m7 10l-5-5l5-5\\\"/>\"},\"chevrons-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 17l5-5l-5-5m7 10l5-5l-5-5\\\"/>\"},\"circle-alert\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"M12 8v4m0 4h.01\\\"/></g>\"},\"circle-check\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"m9 12l2 2l4-4\\\"/></g>\"},\"circle-x\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"m15 9l-6 6m0-6l6 6\\\"/></g>\"},\"copy\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"14\\\" height=\\\"14\\\" x=\\\"8\\\" y=\\\"8\\\" rx=\\\"2\\\" ry=\\\"2\\\"/><path d=\\\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\\\"/></g>\"},\"copy-check\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m12 15l2 2l4-4\\\"/><rect width=\\\"14\\\" height=\\\"14\\\" x=\\\"8\\\" y=\\\"8\\\" rx=\\\"2\\\" ry=\\\"2\\\"/><path d=\\\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\\\"/></g>\"},\"ellipsis\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"19\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"5\\\" cy=\\\"12\\\" r=\\\"1\\\"/></g>\"},\"eye\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0\\\"/><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"3\\\"/></g>\"},\"eye-off\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242\\\"/><path d=\\\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20\\\"/></g>\"},\"file\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\\\"/><path d=\\\"M14 2v5a1 1 0 0 0 1 1h5\\\"/></g>\"},\"folder\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\\\"/>\"},\"folder-open\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\\\"/>\"},\"grip-vertical\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"9\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"9\\\" cy=\\\"5\\\" r=\\\"1\\\"/><circle cx=\\\"9\\\" cy=\\\"19\\\" r=\\\"1\\\"/><circle cx=\\\"15\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"15\\\" cy=\\\"5\\\" r=\\\"1\\\"/><circle cx=\\\"15\\\" cy=\\\"19\\\" r=\\\"1\\\"/></g>\"},\"hash\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 9h16M4 15h16M10 3L8 21m8-18l-2 18\\\"/>\"},\"info\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"M12 16v-4m0-4h.01\\\"/></g>\"},\"lightbulb\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M15 14c.2-1 .7-1.7 1.5-2.5c1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5c.7.7 1.3 1.5 1.5 2.5m0 4h6m-5 4h4\\\"/>\"},\"loader-circle\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M21 12a9 9 0 1 1-6.219-8.56\\\"/>\"},\"menu\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 5h16M4 12h16M4 19h16\\\"/>\"},\"minus\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M5 12h14\\\"/>\"},\"monitor\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"20\\\" height=\\\"14\\\" x=\\\"2\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M8 21h8m-4-4v4\\\"/></g>\"},\"moon\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\\\"/>\"},\"panel-left-close\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M9 3v18m7-6l-3-3l3-3\\\"/></g>\"},\"panel-left-open\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M9 3v18m5-12l3 3l-3 3\\\"/></g>\"},\"plus\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M5 12h14m-7-7v14\\\"/>\"},\"rotate-ccw\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8\\\"/><path d=\\\"M3 3v5h5\\\"/></g>\"},\"search\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m21 21l-4.34-4.34\\\"/><circle cx=\\\"11\\\" cy=\\\"11\\\" r=\\\"8\\\"/></g>\"},\"square\":{\"width\":24,\"height\":24,\"body\":\"<rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" rx=\\\"2\\\"/>\"},\"star\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z\\\"/>\"},\"sun\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"4\\\"/><path d=\\\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\\\"/></g>\"},\"triangle-alert\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01\\\"/>\"},\"upload\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\\\"/>\"},\"x\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M18 6L6 18M6 6l12 12\\\"/>\"}}}]");
	for (const collection of collections) for (const [name, data] of Object.entries(collection.icons)) addIcon(collection.prefix ? collection.prefix + ":" + name : name, data);
	_initialized = true;
}
//#endregion
//#region node_modules/@nuxt/icon/dist/runtime/components/shared.js
async function loadIcon$1(name, timeout) {
	if (!name) return null;
	init(addIcon);
	const _icon = getIcon(name);
	if (_icon) return _icon;
	let timeoutWarn;
	const load = loadIcon(name).catch(() => {
		console.warn(`[Icon] failed to load icon \`${name}\``);
		return null;
	});
	if (timeout > 0) await Promise.race([load, new Promise((resolve) => {
		timeoutWarn = setTimeout(() => {
			console.warn(`[Icon] loading icon \`${name}\` timed out after ${timeout}ms`);
			resolve();
		}, timeout);
	})]).finally(() => clearTimeout(timeoutWarn));
	else await load;
	return getIcon(name);
}
function useResolvedName(getName) {
	const options = useAppConfig().icon;
	const collections = (options.collections || []).sort((a, b) => b.length - a.length);
	return computed(() => {
		const name = getName();
		const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
		const resolved = options.aliases?.[bare] || bare;
		if (!resolved.includes(":")) {
			const collection = collections.find((c) => resolved.startsWith(c + "-"));
			return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
		}
		return resolved;
	});
}
function resolveCustomizeFn(customize, globalCustomize) {
	if (customize === false) return void 0;
	if (customize === true || customize === null) return globalCustomize;
	return customize;
}
//#endregion
//#region node_modules/@nuxt/icon/dist/runtime/components/css.js
var SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
	return selector.replace(/([^\w-])/g, "\\$1");
}
var NuxtIconCss = /* @__PURE__ */ defineComponent({
	name: "NuxtIconCss",
	props: {
		name: {
			type: String,
			required: true
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			default: null,
			required: false
		}
	},
	setup(props) {
		const nuxt = useNuxtApp();
		const options = useAppConfig().icon;
		const cssClass = computed(() => {
			if (!props.name) return "";
			const base = options.cssSelectorPrefix + props.name;
			if (typeof props.customize === "function") return base + "--customized-" + hash(props.customize.toString());
			return base;
		});
		const selector = computed(() => "." + escapeCssSelector(cssClass.value));
		function getCSS(icon, withLayer = true) {
			let iconSelector = selector.value;
			if (options.cssWherePseudo) iconSelector = `:where(${iconSelector})`;
			const css = getIconCSS(icon, {
				iconSelector,
				format: "compressed",
				customise: resolveCustomizeFn(props.customize, options.customize)
			});
			if (options.cssLayer && withLayer) return `@layer ${options.cssLayer} { ${css} }`;
			return css;
		}
		onServerPrefetch(async () => {
			if (!(useRuntimeConfig().icon || {})?.serverKnownCssClasses?.includes(cssClass.value)) {
				const icon = await loadIcon$1(props.name, options.fetchTimeout).catch(() => null);
				if (!icon) return null;
				let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
				if (!ssrCSS) {
					ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
					nuxt.runWithContext(() => {
						useHead$1({ style: [() => {
							const sep = "";
							let css = Array.from(ssrCSS.values()).sort().join(sep);
							if (options.cssLayer) css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
							return { innerHTML: css };
						}] }, { tagPriority: "low" });
					});
				}
				if (cssClass.value && !ssrCSS.has(cssClass.value)) {
					const css = getCSS(icon, false);
					ssrCSS.set(cssClass.value, css);
				}
				return null;
			}
		});
		return () => h("span", { class: ["iconify", cssClass.value] });
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/utils/debounce-tick.js
/**
* Debounce an async function so that repeated calls within the same tick are
* collapsed into a single call (plus a trailing call if arguments arrived
* while the debounced call was still pending).
*
* Adapted from https://github.com/unjs/perfect-debounce with the timeout
* replaced by Vue's post-flush callback queue.
*/
function debounceTick(fn, options = {}) {
	let leadingValue;
	let active = false;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		const promise = _applyPromised(fn, _this, args);
		currentPromise = promise;
		promise.finally(() => {
			currentPromise = void 0;
			if (trailingArgs && !active) {
				const args = trailingArgs;
				trailingArgs = void 0;
				applyFn(_this, args);
			}
		});
		return promise;
	};
	return function(...args) {
		trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = options.leading && !active;
			if (!active) {
				active = true;
				queuePostFlushCb(() => {
					active = false;
					const flushArgs = trailingArgs ?? args;
					trailingArgs = void 0;
					const promise = options.leading ? leadingValue : applyFn(this, flushArgs);
					for (const _resolve of resolveList) _resolve(promise);
					resolveList = [];
				});
			}
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}
defineComponent({
	name: "ServerPlaceholder",
	render() {
		return createElementBlock("div");
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/components/client-only.js
var clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
	name: "ClientOnly",
	inheritAttrs: false,
	props: [
		"fallback",
		"placeholder",
		"placeholderTag",
		"fallbackTag"
	],
	setup(props, { slots, attrs }) {
		const mounted = shallowRef(false);
		const vm = getCurrentInstance();
		if (vm) vm._nuxtClientOnly = true;
		provide(clientOnlySymbol, true);
		return () => {
			if (mounted.value) {
				const vnodes = slots.default?.();
				if (vnodes && vnodes.length === 1) return [cloneVNode(vnodes[0], attrs)];
				return vnodes;
			}
			const slot = slots.fallback || slots.placeholder;
			if (slot) return h(slot);
			const fallbackStr = props.fallback || props.placeholder || "";
			const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
			return createElementBlock(fallbackTag, attrs, fallbackStr);
		};
	}
});
//#endregion
//#region node_modules/nuxt/dist/compiler/runtime/index.js
/**
* Define a factory for a function that should be registered for automatic key injection.
* @since 4.2.0
* @param factory
*/
function defineKeyedFunctionFactory(factory) {
	const placeholder = function() {
		throw appDiagnostics.NUXT_E1007({ name: factory.name });
	};
	return Object.defineProperty(placeholder, "__nuxt_factory", {
		enumerable: false,
		get: () => factory.factory
	});
}
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/data.js
/**
* E3xxx
* Data fetching (useFetch / useAsyncData) runtime diagnostics.
*/
var dataDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/asyncData.js
var createUseAsyncData = defineKeyedFunctionFactory({
	name: "createUseAsyncData",
	factory(options = {}) {
		function useAsyncData(...args) {
			const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
			if (_isAutoKeyNeeded(args[0], args[1])) args.unshift(autoKey);
			let [_key, _handler, opts = {}] = args;
			const key = isRef(_key) || typeof _key === "function" ? computed(() => toValue(_key)) : { value: _key };
			if (!key.value || typeof key.value !== "string") throw dataDiagnostics.NUXT_E3008();
			if (typeof _handler !== "function") throw dataDiagnostics.NUXT_E3009();
			const shouldFactoryOptionsOverride = typeof options === "function";
			const nuxtApp = useNuxtApp();
			const factoryOptions = shouldFactoryOptionsOverride ? options(opts) : options;
			if (!shouldFactoryOptionsOverride) for (const key in factoryOptions) {
				if (factoryOptions[key] === void 0) continue;
				if (opts[key] !== void 0) continue;
				opts[key] = factoryOptions[key];
			}
			opts.server ??= true;
			opts.default ??= getDefault;
			opts.getCachedData ??= getDefaultCachedData;
			opts.lazy ??= false;
			opts.immediate ??= true;
			opts.deep ??= asyncDataDefaults.deep;
			opts.dedupe ??= "cancel";
			opts.enabled ??= true;
			if (shouldFactoryOptionsOverride) for (const key in factoryOptions) {
				if (factoryOptions[key] === void 0) continue;
				opts[key] = factoryOptions[key];
			}
			nuxtApp._asyncData[key.value];
			function createInitialFetch() {
				const initialFetchOptions = {
					cause: "initial",
					dedupe: opts.dedupe
				};
				const existing = nuxtApp._asyncData[key.value];
				if (!existing?._init) {
					initialFetchOptions.cachedData = opts.getCachedData(key.value, nuxtApp, { cause: "initial" });
					nuxtApp._asyncData[key.value] = buildAsyncData(nuxtApp, key.value, _handler, opts, initialFetchOptions.cachedData);
					nuxtApp._asyncData[key.value]._initialCachedData = initialFetchOptions.cachedData;
				} else if (nuxtApp._asyncDataPromises[key.value]) initialFetchOptions.cachedData = existing._initialCachedData;
				return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
			}
			const initialFetch = createInitialFetch();
			const asyncData = nuxtApp._asyncData[key.value];
			asyncData._deps++;
			if (opts.server !== false && nuxtApp.payload.serverRendered && opts.immediate) {
				const promise = initialFetch();
				if (getCurrentInstance()) onServerPrefetch(() => promise);
				else nuxtApp.hook("app:created", async () => {
					await promise;
				});
			}
			const asyncReturn = {
				data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
				pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
				status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
				error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
				refresh: (...args) => {
					if (!nuxtApp._asyncData[key.value]?._init) return createInitialFetch()();
					return nuxtApp._asyncData[key.value].execute(...args);
				},
				execute: (...args) => asyncReturn.refresh(...args),
				clear: () => {
					const entry = nuxtApp._asyncData[key.value];
					if (entry?._abortController) try {
						entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
					} finally {
						entry._abortController = void 0;
					}
					clearNuxtDataByKey(nuxtApp, key.value);
				}
			};
			const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
			Object.assign(asyncDataPromise, asyncReturn);
			Object.defineProperties(asyncDataPromise, {
				then: {
					enumerable: true,
					value: asyncDataPromise.then.bind(asyncDataPromise)
				},
				catch: {
					enumerable: true,
					value: asyncDataPromise.catch.bind(asyncDataPromise)
				},
				finally: {
					enumerable: true,
					value: asyncDataPromise.finally.bind(asyncDataPromise)
				}
			});
			return asyncDataPromise;
		}
		return useAsyncData;
	}
});
var useAsyncData = createUseAsyncData.__nuxt_factory();
createUseAsyncData.__nuxt_factory({
	lazy: true,
	_functionName: "useLazyAsyncData"
});
function writableComputedRef(getter) {
	return computed({
		get() {
			return getter()?.value;
		},
		set(value) {
			const ref = getter();
			if (ref) ref.value = value;
		}
	});
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
	if (typeof keyOrFetcher === "string") return false;
	if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) return false;
	if (typeof keyOrFetcher === "function" && typeof fetcher === "function") return false;
	return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
	delete nuxtApp.payload.data[key];
	delete nuxtApp.payload._errors[key];
	if (nuxtApp._asyncData[key]) {
		nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
		nuxtApp._asyncData[key].error.value = void 0;
		nuxtApp._asyncData[key].status.value = "idle";
		nuxtApp._asyncData[key]._initialCachedData = void 0;
	}
	delete nuxtApp._asyncDataPromises[key];
}
function pick(obj, keys) {
	const newObj = {};
	for (const key of keys) newObj[key] = obj[key];
	return newObj;
}
function buildAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
	nuxtApp.payload._errors[key] ??= void 0;
	const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
	const handler = !import.meta.prerender || !nuxtApp.ssrContext?.["~sharedPrerenderCache"] ? _handler : (nuxtApp, options) => {
		const value = nuxtApp.ssrContext["~sharedPrerenderCache"].get(key);
		if (value) return value;
		const promise = Promise.resolve().then(() => nuxtApp.runWithContext(() => _handler(nuxtApp, options)));
		nuxtApp.ssrContext["~sharedPrerenderCache"].set(key, promise);
		return promise;
	};
	const _ref = options.deep ? ref : shallowRef;
	const hasCachedData = initialCachedData !== void 0;
	const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
		if (!keys || keys.includes(key)) await asyncData.execute({ cause: "refresh:hook" });
	});
	const asyncData = {
		data: _ref(hasCachedData ? initialCachedData : options.default()),
		pending: computed(() => asyncData.status.value === "pending"),
		error: toRef(nuxtApp.payload._errors, key),
		status: shallowRef("idle"),
		execute: (...args) => {
			const [_opts, newValue = void 0] = args;
			const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
			if (nuxtApp._asyncDataPromises[key]) {
				if ((opts.dedupe ?? options.dedupe) === "defer") return nuxtApp._asyncDataPromises[key];
			}
			{
				const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
				if (cachedData !== void 0) {
					nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
					asyncData.error.value = void 0;
					asyncData.status.value = "success";
					return Promise.resolve(cachedData);
				}
			}
			if (toValue(options.enabled) === false) return Promise.resolve(asyncData.data.value);
			if (asyncData._abortController) asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
			asyncData._abortController = new AbortController();
			asyncData.status.value = "pending";
			const cleanupController = new AbortController();
			const promise = new Promise((resolve, reject) => {
				try {
					const timeout = opts.timeout ?? options.timeout;
					const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
					if (mergedSignal.aborted) {
						const reason = mergedSignal.reason;
						reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
						return;
					}
					mergedSignal.addEventListener("abort", () => {
						const reason = mergedSignal.reason;
						reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
					}, {
						once: true,
						signal: cleanupController.signal
					});
					return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
				} catch (err) {
					reject(err);
				}
			}).then(async (_result) => {
				if (nuxtApp._asyncDataPromises[key] !== promise) return;
				let result = _result;
				if (options.transform) result = await options.transform(_result);
				if (options.pick) result = pick(result, options.pick);
				nuxtApp.payload.data[key] = result;
				asyncData.data.value = result;
				asyncData.error.value = void 0;
				asyncData.status.value = "success";
			}).catch((error) => {
				if (nuxtApp._asyncDataPromises[key] !== promise) return nuxtApp._asyncDataPromises[key];
				if (asyncData._abortController?.signal.aborted) return nuxtApp._asyncDataPromises[key];
				if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
					asyncData.status.value = "idle";
					return nuxtApp._asyncDataPromises[key];
				}
				asyncData.error.value = createError$1(error);
				asyncData.data.value = unref(options.default());
				asyncData.status.value = "error";
			}).finally(() => {
				cleanupController.abort();
				if (nuxtApp._asyncDataPromises[key] === promise) delete nuxtApp._asyncDataPromises[key];
			});
			nuxtApp._asyncDataPromises[key] = promise;
			return nuxtApp._asyncDataPromises[key];
		},
		_execute: debounceTick((...args) => asyncData.execute(...args)),
		_default: options.default,
		_deps: 0,
		_init: true,
		_hash: void 0,
		_off: () => {
			unsubRefreshAsyncData();
			if (nuxtApp._asyncData[key]?._init) nuxtApp._asyncData[key]._init = false;
			if (nuxtApp._asyncDataPromises[key]) {
				asyncData._abortController?.abort(new DOMException("AsyncData request cancelled by unmount", "AbortError"));
				delete nuxtApp._asyncDataPromises[key];
				if (asyncData.status.value === "pending") asyncData.status.value = "idle";
			}
			if (!hasCustomGetCachedData) nextTick(() => {
				if (!nuxtApp._asyncData[key]?._init) {
					clearNuxtDataByKey(nuxtApp, key);
					asyncData.execute = () => Promise.resolve();
				}
			});
		}
	};
	return asyncData;
}
var getDefault = () => void 0;
var getDefaultCachedData = (key, nuxtApp, ctx) => {
	if (nuxtApp.isHydrating) return nuxtApp.payload.data[key];
	if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") return nuxtApp.static.data[key];
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
	const list = signals.filter((s) => !!s);
	if (typeof timeout === "number" && timeout >= 0) {
		const timeoutSignal = AbortSignal.timeout?.(timeout);
		if (timeoutSignal) list.push(timeoutSignal);
	}
	if (AbortSignal.any) return AbortSignal.any(list);
	const controller = new AbortController();
	for (const sig of list) if (sig.aborted) {
		const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
		try {
			controller.abort(reason);
		} catch {
			controller.abort();
		}
		return controller.signal;
	}
	const onAbort = () => {
		const reason = list.find((s) => s.aborted)?.reason ?? new DOMException("Aborted", "AbortError");
		try {
			controller.abort(reason);
		} catch {
			controller.abort();
		}
	};
	for (const sig of list) sig.addEventListener?.("abort", onAbort, {
		once: true,
		signal: cleanupSignal
	});
	return controller.signal;
}
//#endregion
//#region node_modules/@nuxt/icon/dist/runtime/components/svg.js
var NuxtIconSvg = /* @__PURE__ */ defineComponent({
	name: "NuxtIconSvg",
	props: {
		name: {
			type: String,
			required: true
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			default: null,
			required: false
		}
	},
	setup(props, { slots }) {
		useNuxtApp();
		const options = useAppConfig().icon;
		const name = useResolvedName(() => props.name);
		const storeKey = "i-" + name.value;
		if (name.value) onServerPrefetch(async () => {
			await useAsyncData(storeKey, async () => await loadIcon$1(name.value, options.fetchTimeout), { deep: false });
		});
		return () => h(Icon, {
			icon: name.value,
			ssr: true,
			customise: resolveCustomizeFn(props.customize, options.customize)
		}, slots);
	}
});
//#endregion
//#region node_modules/@nuxt/icon/dist/runtime/components/index.js
var components_exports = /* @__PURE__ */ __exportAll({ default: () => components_default });
var components_default = defineComponent({
	name: "NuxtIcon",
	props: {
		name: {
			type: String,
			required: true
		},
		mode: {
			type: String,
			required: false,
			default: null
		},
		size: {
			type: [Number, String],
			required: false,
			default: null
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			default: null,
			required: false
		}
	},
	setup(props, { slots }) {
		const nuxtApp = useNuxtApp();
		const runtimeOptions = useAppConfig().icon;
		const name = useResolvedName(() => props.name);
		const component = computed(() => nuxtApp.vueApp?.component(name.value) || ((props.mode || runtimeOptions.mode) === "svg" ? NuxtIconSvg : NuxtIconCss));
		const style = computed(() => {
			const size = props.size || runtimeOptions.size;
			return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
		});
		return () => h(component.value, {
			...runtimeOptions.attrs,
			name: name.value,
			class: runtimeOptions.class,
			style: style.value,
			customize: props.customize
		}, slots);
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Icon.vue
var _sfc_main$7 = {
	__name: "UIcon",
	__ssrInlineRender: true,
	props: {
		name: {
			type: null,
			required: true
		},
		mode: {
			type: String,
			required: false
		},
		size: {
			type: [String, Number],
			required: false
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			required: false
		}
	},
	setup(__props) {
		const iconProps = useForwardProps$1(reactivePick(__props, "mode", "size", "customize"));
		return (_ctx, _push, _parent, _attrs) => {
			if (typeof __props.name === "string") _push(ssrRenderComponent(unref(components_default), mergeProps({ name: __props.name }, unref(iconProps), _attrs), null, _parent));
			else ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.name), _attrs, null), _parent);
		};
	}
};
var _sfc_setup$9 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Icon.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/utils/index.js
function omit(data, keys) {
	const result = { ...data };
	for (const key of keys) delete result[key];
	return result;
}
function get(object, path, defaultValue) {
	if (typeof path === "string") path = path.split(".").map((key) => {
		const numKey = Number(key);
		return Number.isNaN(numKey) ? key : numKey;
	});
	let result = object;
	for (const key of path) {
		if (result === void 0 || result === null) return defaultValue;
		result = result[key];
	}
	return result !== void 0 ? result : defaultValue;
}
function looseToNumber(val) {
	const n = Number.parseFloat(val);
	return Number.isNaN(n) ? val : n;
}
function compare(value, currentValue, comparator) {
	if (value === void 0 || currentValue === void 0) return false;
	if (typeof value === "string") return value === currentValue;
	if (typeof comparator === "function") return comparator(value, currentValue);
	if (typeof comparator === "string") return get(value, comparator) === get(currentValue, comparator);
	return isEqual$1(value, currentValue);
}
function isEmpty(value) {
	if (value == null) return true;
	if (typeof value === "boolean" || typeof value === "number") return false;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (value instanceof Map || value instanceof Set) return value.size === 0;
	if (value instanceof Date || value instanceof RegExp || typeof value === "function") return false;
	if (typeof value === "object") {
		for (const _ in value) if (Object.prototype.hasOwnProperty.call(value, _)) return false;
		return true;
	}
	return false;
}
function getDisplayValue(items, value, options = {}) {
	const { valueKey, labelKey, by } = options;
	const foundItem = items.find((item) => {
		return compare(typeof item === "object" && item !== null && valueKey ? get(item, valueKey) : item, value, by);
	});
	if (isEmpty(value) && foundItem) return labelKey ? get(foundItem, labelKey) : void 0;
	if (isEmpty(value)) return;
	const source = foundItem ?? value;
	if (source === null || source === void 0) return;
	if (typeof source === "object") return labelKey ? get(source, labelKey) : void 0;
	return String(source);
}
function isArrayOfArray(item) {
	return Array.isArray(item[0]);
}
function mergeClasses(appConfigClass, propClass) {
	if (!appConfigClass && !propClass) return "";
	return [...Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass], propClass].filter(Boolean);
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useComponentProps.js
var [_injectThemeContext, provideThemeContext] = createContext("UTheme", "RootContext");
var defaultThemeContext = { defaults: computed(() => ({})) };
function injectThemeContext(fallback = defaultThemeContext) {
	return _injectThemeContext(fallback);
}
function camelCase(str) {
	return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function kebabCase(str) {
	return str.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
function propIsDefined(vnode, prop) {
	if (!vnode || !vnode.props) return false;
	return vnode.props[camelCase(prop)] !== void 0 || vnode.props[kebabCase(prop)] !== void 0;
}
function useComponentProps(name, props) {
	const vm = getCurrentInstance();
	const { defaults } = injectThemeContext();
	const appConfig = useAppConfig();
	return new Proxy(props, {
		get(target, prop, receiver) {
			if (prop === "__v_isReactive") return true;
			if (prop === "__v_raw") return target;
			const raw = Reflect.get(target, prop, receiver);
			if (typeof prop !== "string") return raw;
			const themeEntry = name.includes(".") ? get(defaults.value, name) : defaults.value[name];
			if (prop === "ui") {
				const themeUi = themeEntry?.ui;
				if (!raw && !themeUi) return raw;
				return defu(raw ?? {}, themeUi ?? {});
			}
			if (vm && propIsDefined(vm.vnode, prop)) return raw;
			const themeValue = themeEntry?.[prop];
			if (themeValue !== void 0) return themeValue;
			const appConfigValue = (name.includes(".") ? get(appConfig.ui ?? {}, name) : appConfig.ui?.[name])?.defaultVariants?.[prop];
			if (appConfigValue !== void 0) return appConfigValue;
			const propDef = vm?.type?.props?.[prop];
			if (propDef && Object.prototype.hasOwnProperty.call(propDef, "default")) return raw;
		},
		has: (t, p) => Reflect.has(t, p),
		ownKeys: (t) => Reflect.ownKeys(t),
		getOwnPropertyDescriptor: (t, p) => Reflect.getOwnPropertyDescriptor(t, p)
	});
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useForwardProps.js
function useForwardProps(source, emits) {
	const emitAsProps = emits ? useEmitAsProps(emits) : {};
	return computed(() => {
		const src = isRef(source) ? source.value : source;
		const out = { ...emitAsProps };
		for (const key in src) {
			const value = src[key];
			if (value !== void 0) out[key] = value;
		}
		return out;
	});
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useComponentIcons.js
function useComponentIcons(componentProps) {
	const appConfig = useAppConfig();
	const props = computed(() => toValue(componentProps));
	const isLeading = computed(() => props.value.icon && props.value.leading || props.value.icon && !props.value.trailing || props.value.loading && !props.value.trailing || !!props.value.leadingIcon);
	return {
		isLeading,
		isTrailing: computed(() => props.value.icon && props.value.trailing || props.value.loading && props.value.trailing || !!props.value.trailingIcon && props.value.trailing !== false),
		leadingIconName: computed(() => {
			if (props.value.loading) return props.value.loadingIcon || appConfig.ui.icons.loading;
			return props.value.leadingIcon || props.value.icon;
		}),
		trailingIconName: computed(() => {
			if (props.value.loading && !isLeading.value) return props.value.loadingIcon || appConfig.ui.icons.loading;
			return props.value.trailingIcon || props.value.icon;
		})
	};
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useFieldGroup.js
var fieldGroupInjectionKey = Symbol("nuxt-ui.field-group");
function useFieldGroup(props) {
	const fieldGroup = inject(fieldGroupInjectionKey, void 0);
	return {
		orientation: computed(() => fieldGroup?.value.orientation),
		size: computed(() => props?.size ?? fieldGroup?.value.size)
	};
}
var FieldGroupReset = defineComponent({
	name: "FieldGroupReset",
	setup(_, { slots }) {
		provide(fieldGroupInjectionKey, computed(() => ({
			size: void 0,
			orientation: void 0
		})));
		return () => slots.default?.();
	}
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useFormField.js
var formOptionsInjectionKey = Symbol("nuxt-ui.form-options");
var formBusInjectionKey = Symbol("nuxt-ui.form-events");
var formStateInjectionKey = Symbol("nuxt-ui.form-state");
var formFieldInjectionKey = Symbol("nuxt-ui.form-field");
var inputIdInjectionKey = Symbol("nuxt-ui.input-id");
var formInputsInjectionKey = Symbol("nuxt-ui.form-inputs");
var formLoadingInjectionKey = Symbol("nuxt-ui.form-loading");
var formErrorsInjectionKey = Symbol("nuxt-ui.form-errors");
function useFormField(props, opts) {
	const formOptions = inject(formOptionsInjectionKey, void 0);
	const formBus = inject(formBusInjectionKey, void 0);
	const formField = inject(formFieldInjectionKey, void 0);
	const inputId = inject(inputIdInjectionKey, void 0);
	provide(formFieldInjectionKey, void 0);
	if (formField && inputId) {
		if (opts?.bind === false) inputId.value = void 0;
		else if (props?.id) inputId.value = props?.id;
	}
	function emitFormEvent(type, name, eager) {
		if (formBus && formField && name) formBus.emit({
			type,
			name,
			eager
		});
	}
	function emitFormBlur() {
		emitFormEvent("blur", formField?.value.name);
	}
	function emitFormFocus() {
		emitFormEvent("focus", formField?.value.name);
	}
	function emitFormChange() {
		emitFormEvent("change", formField?.value.name);
	}
	const emitFormInput = useDebounceFn(() => {
		emitFormEvent("input", formField?.value.name, !opts?.deferInputValidation || formField?.value.eagerValidation);
	}, formField?.value.validateOnInputDelay ?? formOptions?.value.validateOnInputDelay ?? 0);
	return {
		id: computed(() => props?.id ?? inputId?.value),
		name: computed(() => props?.name ?? formField?.value.name),
		size: computed(() => props?.size ?? formField?.value.size),
		color: computed(() => formField?.value.error ? "error" : props?.color),
		highlight: computed(() => formField?.value.error ? true : props?.highlight),
		disabled: computed(() => formOptions?.value.disabled || props?.disabled),
		emitFormBlur,
		emitFormInput,
		emitFormChange,
		emitFormFocus,
		ariaAttrs: computed(() => {
			if (!formField?.value) return;
			const descriptiveAttrs = [
				"error",
				"hint",
				"description",
				"help"
			].filter((type) => formField?.value?.[type]).map((type) => `${formField?.value.ariaId}-${type}`) || [];
			const attrs = { "aria-invalid": !!formField?.value.error };
			if (descriptiveAttrs.length > 0) attrs["aria-describedby"] = descriptiveAttrs.join(" ");
			return attrs;
		})
	};
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/utils/tv.js
var config = virtual_nuxt__nuxt_2Fapp_config_default.ui?.tv;
var baseTv = /* @__PURE__ */ createTV(config);
function findReplacer(value) {
	if (typeof value === "function") return value;
	if (Array.isArray(value)) for (let i = value.length - 1; i >= 0; i--) {
		const replacer = findReplacer(value[i]);
		if (replacer) return replacer;
	}
}
function plainClasses(value) {
	if (Array.isArray(value)) return value.flatMap((item) => plainClasses(item));
	if (typeof value === "function") return [];
	return [value];
}
function applyReplacer(replacer, slotProps, resolveDefaults) {
	return cnMerge(replacer(resolveDefaults()), ...plainClasses(slotProps.class), ...plainClasses(slotProps.className))(config) ?? "";
}
function wrapSlots(slots, directives) {
	return new Proxy(slots, { get(target, key) {
		const slot = target[key];
		if (typeof slot !== "function") return slot;
		return (slotProps = {}) => {
			const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className) ?? directives?.[key];
			if (!replacer) return slot(slotProps);
			return applyReplacer(replacer, slotProps, () => slot({
				...slotProps,
				class: void 0,
				className: void 0
			}));
		};
	} });
}
function extractDirectives(componentConfig) {
	if (!componentConfig || typeof componentConfig !== "object") return { config: componentConfig };
	let config2 = componentConfig;
	let directives;
	if (typeof componentConfig.base === "function") {
		directives = { base: componentConfig.base };
		config2 = {
			...config2,
			base: ""
		};
	}
	const slots = componentConfig.slots;
	if (slots && typeof slots === "object") {
		const replacers = Object.entries(slots).filter(([, value]) => typeof value === "function");
		if (replacers.length) {
			directives ??= {};
			const cleaned = { ...slots };
			for (const [slot, replacer] of replacers) {
				directives[slot] = replacer;
				cleaned[slot] = "";
			}
			config2 = {
				...config2,
				slots: cleaned
			};
		}
	}
	return {
		config: config2,
		directives
	};
}
var tv = ((componentConfig) => {
	const { config: cleanConfig, directives } = extractDirectives(componentConfig);
	const component = baseTv(cleanConfig);
	return new Proxy(component, { apply(target, thisArg, args) {
		const result = Reflect.apply(target, thisArg, args);
		if (result && typeof result === "object") return wrapSlots(result, directives);
		if (typeof result === "string") {
			const slotProps = args[0] ?? {};
			const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className) ?? directives?.base;
			if (replacer) return applyReplacer(replacer, slotProps, () => Reflect.apply(target, thisArg, [{
				...slotProps,
				class: void 0,
				className: void 0
			}]));
		}
		return result;
	} });
});
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/utils/link.js
var linkKeys = [
	"active",
	"activeClass",
	"ariaCurrentValue",
	"as",
	"disabled",
	"download",
	"exact",
	"exactActiveClass",
	"exactHash",
	"exactQuery",
	"external",
	"form",
	"formaction",
	"formenctype",
	"formmethod",
	"formnovalidate",
	"formtarget",
	"href",
	"hreflang",
	"inactiveClass",
	"locale",
	"media",
	"noPrefetch",
	"noRel",
	"onClick",
	"ping",
	"prefetch",
	"prefetchOn",
	"prefetchedClass",
	"referrerpolicy",
	"rel",
	"replace",
	"target",
	"title",
	"to",
	"trailingSlash",
	"type",
	"viewTransition"
];
function pickLinkProps(link) {
	const keys = Object.keys(link);
	const ariaKeys = keys.filter((key) => key.startsWith("aria-"));
	const dataKeys = keys.filter((key) => key.startsWith("data-"));
	const propsToInclude = [
		...linkKeys,
		...ariaKeys,
		...dataKeys
	];
	return reactivePick(link, ...propsToInclude);
}
function isPartiallyEqual(item1, item2) {
	const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
		if (q.type === "added") filtered.add(q.key);
		return filtered;
	}, /* @__PURE__ */ new Set());
	const item1Filtered = Object.fromEntries(Object.entries(item1).filter(([key]) => !diffedKeys.has(key)));
	const item2Filtered = Object.fromEntries(Object.entries(item2).filter(([key]) => !diffedKeys.has(key)));
	return isEqual$1(item1Filtered, item2Filtered);
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/composables/useAvatarGroup.js
var avatarGroupInjectionKey = Symbol("nuxt-ui.avatar-group");
function useAvatarGroup(props) {
	const avatarGroup = inject(avatarGroupInjectionKey, void 0);
	const size = computed(() => props.size ?? avatarGroup?.value.size);
	const color = computed(() => props.color ?? avatarGroup?.value.color);
	provide(avatarGroupInjectionKey, computed(() => ({
		size: size.value,
		color: color.value
	})));
	return {
		size,
		color
	};
}
//#endregion
//#region virtual:nuxt:.nuxt%2Fui%2Fchip.ts
var virtual_nuxt__nuxt_2Fui_2Fchip_default = {
	"slots": {
		"root": "relative inline-flex items-center justify-center shrink-0",
		"base": "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
	},
	"variants": {
		"color": {
			"primary": "bg-primary",
			"secondary": "bg-secondary",
			"success": "bg-success",
			"info": "bg-info",
			"warning": "bg-warning",
			"error": "bg-error",
			"neutral": "bg-inverted"
		},
		"size": {
			"3xs": "h-[4px] min-w-[4px] text-[4px]",
			"2xs": "h-[5px] min-w-[5px] text-[5px]",
			"xs": "h-[6px] min-w-[6px] text-[6px]",
			"sm": "h-[7px] min-w-[7px] text-[7px]",
			"md": "h-[8px] min-w-[8px] text-[8px]",
			"lg": "h-[9px] min-w-[9px] text-[9px]",
			"xl": "h-[10px] min-w-[10px] text-[10px]",
			"2xl": "h-[11px] min-w-[11px] text-[11px]",
			"3xl": "h-[12px] min-w-[12px] text-[12px]"
		},
		"position": {
			"top-right": "top-0 right-0",
			"bottom-right": "bottom-0 right-0",
			"top-left": "top-0 left-0",
			"bottom-left": "bottom-0 left-0"
		},
		"inset": { "false": "" },
		"standalone": { "false": "absolute" }
	},
	"compoundVariants": [
		{
			"position": "top-right",
			"inset": false,
			"class": "-translate-y-1/2 translate-x-1/2 transform"
		},
		{
			"position": "bottom-right",
			"inset": false,
			"class": "translate-y-1/2 translate-x-1/2 transform"
		},
		{
			"position": "top-left",
			"inset": false,
			"class": "-translate-y-1/2 -translate-x-1/2 transform"
		},
		{
			"position": "bottom-left",
			"inset": false,
			"class": "translate-y-1/2 -translate-x-1/2 transform"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"position": "top-right"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Chip.vue
var _sfc_main$6 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UChip",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		as: {
			type: null,
			required: false
		},
		text: {
			type: [String, Number],
			required: false
		},
		color: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		position: {
			type: null,
			required: false
		},
		inset: {
			type: Boolean,
			required: false,
			default: false
		},
		standalone: {
			type: Boolean,
			required: false,
			default: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	}, {
		"show": {
			type: Boolean,
			default: true
		},
		"showModifiers": {}
	}),
	emits: ["update:show"],
	setup(__props) {
		const _props = __props;
		const props = useComponentProps("chip", _props);
		const show = useModel(__props, "show", {
			type: Boolean,
			default: true
		});
		const { size } = useAvatarGroup(_props);
		const appConfig = useAppConfig();
		const ui = computed(() => tv({
			extend: virtual_nuxt__nuxt_2Fui_2Fchip_default,
			...appConfig.ui?.chip || {}
		})({
			color: props.color,
			size: size.value ?? props.size,
			position: props.position,
			inset: props.inset,
			standalone: props.standalone
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				as: unref(props).as,
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(Slot), {
							..._ctx.$attrs,
							"data-slot": void 0
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default")];
							}),
							_: 3
						}, _parent, _scopeId));
						if (show.value) {
							_push(`<span data-slot="base" class="${ssrRenderClass(ui.value.base({ class: unref(props).ui?.base }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "content", {}, () => {
								_push(`${ssrInterpolate(unref(props).text)}`);
							}, _push, _parent, _scopeId);
							_push(`</span>`);
						} else _push(`<!---->`);
					} else return [createVNode(unref(Slot), {
						..._ctx.$attrs,
						"data-slot": void 0
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16), show.value ? (openBlock(), createBlock("span", {
						key: 0,
						"data-slot": "base",
						class: ui.value.base({ class: unref(props).ui?.base })
					}, [renderSlot(_ctx.$slots, "content", {}, () => [createTextVNode(toDisplayString(unref(props).text), 1)])], 2)) : createCommentVNode("", true)];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$8 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Chip.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:.nuxt%2Fui%2Favatar.ts
var virtual_nuxt__nuxt_2Fui_2Favatar_default = {
	"slots": {
		"root": "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle",
		"image": "h-full w-full rounded-[inherit] object-cover",
		"fallback": "font-medium truncate",
		"icon": "shrink-0"
	},
	"variants": {
		"color": {
			"primary": {
				"root": "bg-primary/10",
				"fallback": "text-primary",
				"icon": "text-primary"
			},
			"secondary": {
				"root": "bg-secondary/10",
				"fallback": "text-secondary",
				"icon": "text-secondary"
			},
			"success": {
				"root": "bg-success/10",
				"fallback": "text-success",
				"icon": "text-success"
			},
			"info": {
				"root": "bg-info/10",
				"fallback": "text-info",
				"icon": "text-info"
			},
			"warning": {
				"root": "bg-warning/10",
				"fallback": "text-warning",
				"icon": "text-warning"
			},
			"error": {
				"root": "bg-error/10",
				"fallback": "text-error",
				"icon": "text-error"
			},
			"neutral": {
				"root": "bg-elevated",
				"fallback": "text-muted",
				"icon": "text-muted"
			}
		},
		"size": {
			"3xs": { "root": "size-4 text-[8px]" },
			"2xs": { "root": "size-5 text-[10px]" },
			"xs": { "root": "size-6 text-xs" },
			"sm": { "root": "size-7 text-sm" },
			"md": { "root": "size-8 text-base" },
			"lg": { "root": "size-9 text-lg" },
			"xl": { "root": "size-10 text-xl" },
			"2xl": { "root": "size-11 text-[22px]" },
			"3xl": { "root": "size-12 text-2xl" }
		}
	},
	"defaultVariants": {
		"size": "md",
		"color": "neutral"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue
var _sfc_main$5 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UAvatar",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		src: {
			type: String,
			required: false
		},
		alt: {
			type: String,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		text: {
			type: String,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		chip: {
			type: [Boolean, Object],
			required: false
		},
		class: {
			type: null,
			required: false
		},
		style: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const _props = __props;
		const props = useComponentProps("avatar", _props);
		const as = computed(() => {
			if (typeof props.as === "string" || typeof props.as?.render === "function") return { root: props.as };
			return defu$1(props.as, { root: "span" });
		});
		const fallback = computed(() => props.text || (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2));
		const appConfig = useAppConfig();
		const { size, color } = useAvatarGroup(_props);
		const ui = computed(() => tv({
			extend: virtual_nuxt__nuxt_2Fui_2Favatar_default,
			...appConfig.ui?.avatar || {}
		})({
			size: size.value ?? props.size,
			color: color.value ?? props.color
		}));
		const rootClass = computed(() => ui.value.root({ class: [props.ui?.root, props.class] }));
		const sizePx = computed(() => {
			const sizeClass = (rootClass.value || "").split(" ").find((c) => /^size-\d+$/.test(c));
			if (sizeClass) {
				const num = Number.parseFloat(sizeClass.split("-")[1] ?? "");
				if (!Number.isNaN(num)) return num * 4;
			}
			return null;
		});
		const error = ref(false);
		watch(() => props.src, () => {
			if (error.value) error.value = false;
		});
		function onError() {
			error.value = true;
		}
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(props).chip ? _sfc_main$6 : unref(Primitive)), mergeProps({ as: as.value.root }, unref(props).chip ? typeof unref(props).chip === "object" ? {
				inset: true,
				...unref(props).chip
			} : { inset: true } : {}, {
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: rootClass.value,
				style: unref(props).style
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(props).src && !error.value) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(as.value.img || unref("img")), mergeProps({
							src: unref(props).src,
							alt: unref(props).alt,
							width: sizePx.value,
							height: sizePx.value
						}, _ctx.$attrs, {
							"data-slot": "image",
							class: ui.value.image({ class: unref(props).ui?.image }),
							onError
						}), null), _parent, _scopeId);
						else _push(ssrRenderComponent(unref(Slot), {
							..._ctx.$attrs,
							"data-slot": void 0
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, () => {
									if (unref(props).icon) _push(ssrRenderComponent(_sfc_main$7, {
										name: unref(props).icon,
										"data-slot": "icon",
										class: ui.value.icon({ class: unref(props).ui?.icon })
									}, null, _parent, _scopeId));
									else _push(`<span data-slot="fallback" class="${ssrRenderClass(ui.value.fallback({ class: unref(props).ui?.fallback }))}"${_scopeId}>${ssrInterpolate(fallback.value || "\xA0")}</span>`);
								}, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default", {}, () => [unref(props).icon ? (openBlock(), createBlock(_sfc_main$7, {
									key: 0,
									name: unref(props).icon,
									"data-slot": "icon",
									class: ui.value.icon({ class: unref(props).ui?.icon })
								}, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
									key: 1,
									"data-slot": "fallback",
									class: ui.value.fallback({ class: unref(props).ui?.fallback })
								}, toDisplayString(fallback.value || "\xA0"), 3))])];
							}),
							_: 3
						}, _parent, _scopeId));
					} else return [unref(props).src && !error.value ? (openBlock(), createBlock(resolveDynamicComponent(as.value.img || unref("img")), mergeProps({
						key: 0,
						src: unref(props).src,
						alt: unref(props).alt,
						width: sizePx.value,
						height: sizePx.value
					}, _ctx.$attrs, {
						"data-slot": "image",
						class: ui.value.image({ class: unref(props).ui?.image }),
						onError
					}), null, 16, [
						"src",
						"alt",
						"width",
						"height",
						"class"
					])) : (openBlock(), createBlock(unref(Slot), mergeProps({ key: 1 }, {
						..._ctx.$attrs,
						"data-slot": void 0
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [unref(props).icon ? (openBlock(), createBlock(_sfc_main$7, {
							key: 0,
							name: unref(props).icon,
							"data-slot": "icon",
							class: ui.value.icon({ class: unref(props).ui?.icon })
						}, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
							key: 1,
							"data-slot": "fallback",
							class: ui.value.fallback({ class: unref(props).ui?.fallback })
						}, toDisplayString(fallback.value || "\xA0"), 3))])]),
						_: 3
					}, 16))];
				}),
				_: 3
			}), _parent);
		};
	}
});
var _sfc_setup$7 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-link.js
var firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
/**
* Reject URL strings that would resolve to a script-capable protocol when used as the
* `href` of an anchor element. Returns the value unchanged when safe, or `null`.
*
* The denylist is delegated to `ufo`'s `isScriptProtocol` so it stays in sync with the
* check used by `navigateTo` (currently `javascript:`, `data:`, `vbscript:`, `blob:`).
* ASCII whitespace and control characters are stripped first because browser URL
* parsers tolerate them before the scheme, and `view-source:` is peeled recursively
* because Chromium resolves it transparently to the inner URL.
*/
function sanitizeExternalHref(value) {
	let candidate = value.replace(/[\u0000-\u001F\s]+/g, "");
	while (candidate.toLowerCase().startsWith("view-source:")) candidate = candidate.slice(12);
	const colon = candidate.indexOf(":");
	if (colon > 0 && isScriptProtocol(candidate.slice(0, colon + 1))) return null;
	return value;
}
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtLink(options) {
	const componentName = options.componentName || "NuxtLink";
	function isHashLinkWithoutHashMode(link) {
		return typeof link === "string" && link.startsWith("#");
	}
	function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
		const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
		if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") return to;
		if (typeof to === "string") return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
		const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
		return {
			...to,
			name: void 0,
			path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
		};
	}
	function useNuxtLink(props) {
		const router = useRouter();
		const config = /* @__PURE__ */ useRuntimeConfig();
		const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
		const isAbsoluteUrl = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
		});
		const builtinRouterLink = resolveComponent("RouterLink");
		const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
		const isExternal = computed(() => {
			if (unref(props.external)) return true;
			const path = unref(props.to) || unref(props.href) || "";
			if (typeof path === "object") return false;
			return path === "" || isAbsoluteUrl.value;
		});
		const to = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			if (isExternal.value) return path;
			return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
		});
		const link = isExternal.value ? void 0 : useBuiltinLink?.({
			...props,
			to,
			viewTransition: unref(props.viewTransition)
		});
		const href = computed(() => {
			const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
			if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
				const raw = to.value;
				return typeof raw === "string" ? sanitizeExternalHref(raw) : raw;
			}
			if (isExternal.value) {
				const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
				const href = typeof path === "object" ? router.resolve(path).href : path;
				const safe = typeof href === "string" ? sanitizeExternalHref(href) : href;
				return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
			}
			if (typeof to.value === "object") return router.resolve(to.value)?.href ?? null;
			return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
		});
		return {
			to,
			hasTarget,
			isAbsoluteUrl,
			isExternal,
			href,
			isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
			isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
			route: link?.route ?? computed(() => router.resolve(to.value)),
			async navigate(_e) {
				if (href.value === null) return;
				await navigateTo(href.value, {
					replace: unref(props.replace),
					external: isExternal.value || hasTarget.value
				});
			}
		};
	}
	return defineComponent({
		name: componentName,
		props: {
			to: {
				type: [String, Object],
				default: void 0,
				required: false
			},
			href: {
				type: [String, Object],
				default: void 0,
				required: false
			},
			target: {
				type: String,
				default: void 0,
				required: false
			},
			rel: {
				type: String,
				default: void 0,
				required: false
			},
			noRel: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetchOn: {
				type: [String, Object],
				default: void 0,
				required: false
			},
			noPrefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			activeClass: {
				type: String,
				default: void 0,
				required: false
			},
			exactActiveClass: {
				type: String,
				default: void 0,
				required: false
			},
			prefetchedClass: {
				type: String,
				default: void 0,
				required: false
			},
			replace: {
				type: Boolean,
				default: void 0,
				required: false
			},
			ariaCurrentValue: {
				type: String,
				default: void 0,
				required: false
			},
			external: {
				type: Boolean,
				default: void 0,
				required: false
			},
			custom: {
				type: Boolean,
				default: void 0,
				required: false
			},
			trailingSlash: {
				type: String,
				default: void 0,
				required: false
			}
		},
		useLink: useNuxtLink,
		setup(props, { slots }) {
			const router = useRouter();
			const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
			const prefetched = shallowRef(false);
			const el = void 0;
			const elRef = void 0;
			function shouldPrefetch(mode) {
				return false;
			}
			async function prefetch(nuxtApp = useNuxtApp()) {}
			return () => {
				const target = props.target || null;
				const rel = firstNonUndefined(props.noRel ? "" : props.rel, options.externalRelAttribute, isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : "") || null;
				const getCustomSlotProps = (routerLinkSlotProps) => ({
					href: href.value,
					navigate,
					get route() {
						if (!href.value) return;
						const url = new URL(href.value, "http://localhost");
						return {
							path: url.pathname,
							fullPath: url.pathname,
							get query() {
								return parseQuery(url.search);
							},
							hash: url.hash,
							params: {},
							name: void 0,
							matched: [],
							redirectedFrom: void 0,
							meta: {},
							href: href.value
						};
					},
					rel,
					target,
					isExternal: isExternal.value || hasTarget.value,
					isActive: false,
					isExactActive: false,
					...routerLinkSlotProps,
					prefetch,
					prefetched: prefetched.value,
					shouldPrefetch
				});
				if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
					const routerLinkProps = {
						ref: elRef,
						to: to.value,
						activeClass: props.activeClass || options.activeClass,
						exactActiveClass: props.exactActiveClass || options.exactActiveClass,
						replace: props.replace,
						ariaCurrentValue: props.ariaCurrentValue,
						custom: props.custom
					};
					if (!props.custom) routerLinkProps.rel = props.rel || void 0;
					return h(resolveComponent("RouterLink"), routerLinkProps, props.custom && slots.default ? { default: (slotProps) => slots.default(getCustomSlotProps(slotProps)) } : slots.default);
				}
				if (props.custom) {
					if (!slots.default) return null;
					return slots.default(getCustomSlotProps());
				}
				return h("a", {
					ref: el,
					href: href.value || null,
					rel,
					target,
					onClick: async (event) => {
						if (isExternal.value || hasTarget.value) return;
						event.preventDefault();
						try {
							const encodedHref = encodeRoutePath(href.value ?? "");
							return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
						} finally {}
					}
				}, slots.default?.());
			};
		}
	});
}
var NuxtLink = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
	if (trailingSlash !== "append" && trailingSlash !== "remove") return to;
	const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
	if (hasProtocol(to) && !to.startsWith("http")) return to;
	return normalizeFn(to, true);
}
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue
var _sfc_main$4 = {
	__name: "ULinkBase",
	__ssrInlineRender: true,
	props: {
		as: {
			type: String,
			required: false,
			default: "button"
		},
		type: {
			type: String,
			required: false,
			default: "button"
		},
		disabled: {
			type: Boolean,
			required: false
		},
		onClick: {
			type: [Function, Array],
			required: false
		},
		href: {
			type: [String, null],
			required: false
		},
		navigate: {
			type: Function,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		active: {
			type: Boolean,
			required: false
		},
		isExternal: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		function onClickWrapper(e) {
			if (props.disabled) {
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			if (props.onClick) for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) onClick(e);
			if (props.href && props.navigate && !props.isExternal) props.navigate(e);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps(__props.href ? {
				"as": "a",
				"href": __props.disabled ? void 0 : __props.href,
				"aria-disabled": __props.disabled ? "true" : void 0,
				"role": __props.disabled ? "link" : void 0,
				"tabindex": __props.disabled ? -1 : void 0
			} : __props.as === "button" ? {
				as: __props.as,
				type: __props.type,
				disabled: __props.disabled
			} : { as: __props.as }, {
				rel: __props.rel,
				target: __props.target,
				onClick: onClickWrapper
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$6 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:.nuxt%2Fui%2Flink.ts
var virtual_nuxt__nuxt_2Fui_2Flink_default = {
	"base": "outline-primary/25 focus-visible:outline-3 rounded-md",
	"variants": {
		"active": {
			"true": "text-primary",
			"false": "text-muted"
		},
		"disabled": { "true": "cursor-not-allowed opacity-75" }
	},
	"compoundVariants": [{
		"active": false,
		"disabled": false,
		"class": ["hover:text-default", "transition-colors"]
	}]
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Link.vue
var _sfc_main$3 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "ULink",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false,
			default: "button"
		},
		type: {
			type: null,
			required: false,
			default: "button"
		},
		disabled: {
			type: Boolean,
			required: false
		},
		active: {
			type: Boolean,
			required: false,
			default: void 0
		},
		exact: {
			type: Boolean,
			required: false
		},
		exactQuery: {
			type: [Boolean, String],
			required: false
		},
		exactHash: {
			type: Boolean,
			required: false
		},
		inactiveClass: {
			type: String,
			required: false
		},
		custom: {
			type: Boolean,
			required: false
		},
		raw: {
			type: Boolean,
			required: false
		},
		locale: {
			type: [Boolean, String],
			required: false,
			default: void 0
		},
		class: {
			type: null,
			required: false
		},
		to: {
			type: null,
			required: false
		},
		href: {
			type: null,
			required: false
		},
		external: {
			type: Boolean,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		noRel: {
			type: Boolean,
			required: false
		},
		prefetchedClass: {
			type: String,
			required: false
		},
		prefetch: {
			type: Boolean,
			required: false
		},
		prefetchOn: {
			type: [String, Object],
			required: false
		},
		noPrefetch: {
			type: Boolean,
			required: false
		},
		trailingSlash: {
			type: String,
			required: false
		},
		activeClass: {
			type: String,
			required: false
		},
		exactActiveClass: {
			type: String,
			required: false
		},
		ariaCurrentValue: {
			type: String,
			required: false,
			default: "page"
		},
		viewTransition: {
			type: Boolean,
			required: false
		},
		replace: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const route = useRoute();
		const appConfig = useAppConfig();
		const nuxtApp = useNuxtApp();
		const nuxtLinkProps = useForwardProps$1(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "locale", "class"));
		const ui = computed(() => tv({
			extend: virtual_nuxt__nuxt_2Fui_2Flink_default,
			...defu$1({ variants: { active: {
				true: mergeClasses(appConfig.ui?.link?.variants?.active?.true, props.activeClass),
				false: mergeClasses(appConfig.ui?.link?.variants?.active?.false, props.inactiveClass)
			} } }, appConfig.ui?.link || {})
		}));
		const to = computed(() => {
			const path = props.to ?? props.href;
			if (!path) return path;
			if (typeof path !== "string") return path;
			if (props.external || hasProtocol(path, { acceptRelative: true })) return path;
			if (props.locale === false) return path;
			const localePath = nuxtApp.$localePath;
			if (!localePath) return path;
			const codes = nuxtApp.$i18n?.localeCodes?.value;
			if (codes?.length && new RegExp(`^/(${codes.join("|")})($|[/?#])`).test(path)) return path;
			return localePath(path, typeof props.locale === "string" ? props.locale : void 0) || path;
		});
		const isInternalLink = computed(() => {
			if (!to.value) return false;
			if (props.external) return false;
			if (typeof to.value !== "string") return true;
			if (hasProtocol(to.value, { acceptRelative: true })) return false;
			if (props.target && props.target !== "_self") return false;
			return true;
		});
		const rel = computed(() => {
			if (props.noRel) return null;
			if (props.rel !== void 0) return props.rel || null;
			if (!isInternalLink.value || props.target && props.target !== "_self") return "noopener noreferrer";
			return null;
		});
		function isLinkActive({ route: linkRoute, isActive, isExactActive } = {}) {
			if (props.active !== void 0) return props.active;
			if (!to.value) return false;
			if (props.exactQuery === "partial") {
				if (!isPartiallyEqual(linkRoute.query, route.query)) return false;
			} else if (props.exactQuery === true) {
				if (!isEqual$1(linkRoute.query, route.query)) return false;
			}
			if (props.exactHash && linkRoute.hash !== route.hash) return false;
			if (props.exact && isExactActive) return true;
			if (!props.exact && isActive) return true;
			return false;
		}
		function resolveLinkClass({ route: route2, isActive, isExactActive } = {}) {
			const active = isLinkActive({
				route: route2,
				isActive,
				isExactActive
			});
			if (props.raw) return [props.class, active ? props.activeClass : props.inactiveClass];
			return ui.value({
				class: props.class,
				active,
				disabled: props.disabled
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			if (isInternalLink.value) _push(ssrRenderComponent(_component_NuxtLink, mergeProps(unref(nuxtLinkProps), {
				to: to.value,
				custom: ""
			}, _attrs), {
				default: withCtx(({ href, navigate, route: linkRoute, isActive, isExactActive, ...rest }, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.custom) _push(ssrRenderComponent(unref(Slot), null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {
									..._ctx.$attrs,
									...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
									as: __props.as,
									type: __props.type,
									disabled: __props.disabled,
									href,
									navigate,
									rel: rel.value,
									target: rest.target,
									isExternal: rest.isExternal,
									active: isLinkActive({
										route: linkRoute,
										isActive,
										isExactActive
									})
								}, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default", {
									..._ctx.$attrs,
									...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
									as: __props.as,
									type: __props.type,
									disabled: __props.disabled,
									href,
									navigate,
									rel: rel.value,
									target: rest.target,
									isExternal: rest.isExternal,
									active: isLinkActive({
										route: linkRoute,
										isActive,
										isExactActive
									})
								})];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(ssrRenderComponent(_sfc_main$4, mergeProps({
							..._ctx.$attrs,
							...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
							as: __props.as,
							type: __props.type,
							disabled: __props.disabled,
							href,
							navigate,
							rel: rel.value,
							target: rest.target,
							isExternal: rest.isExternal
						}, { class: resolveLinkClass({
							route: linkRoute,
							isActive,
							isExactActive
						}) }), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", { active: isLinkActive({
									route: linkRoute,
									isActive,
									isExactActive
								}) }, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default", { active: isLinkActive({
									route: linkRoute,
									isActive,
									isExactActive
								}) })];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [__props.custom ? (openBlock(), createBlock(unref(Slot), { key: 0 }, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
							..._ctx.$attrs,
							...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
							as: __props.as,
							type: __props.type,
							disabled: __props.disabled,
							href,
							navigate,
							rel: rel.value,
							target: rest.target,
							isExternal: rest.isExternal,
							active: isLinkActive({
								route: linkRoute,
								isActive,
								isExactActive
							})
						})]),
						_: 2
					}, 1024)) : (openBlock(), createBlock(_sfc_main$4, mergeProps({ key: 1 }, {
						..._ctx.$attrs,
						...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
						as: __props.as,
						type: __props.type,
						disabled: __props.disabled,
						href,
						navigate,
						rel: rel.value,
						target: rest.target,
						isExternal: rest.isExternal
					}, { class: resolveLinkClass({
						route: linkRoute,
						isActive,
						isExactActive
					}) }), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", { active: isLinkActive({
							route: linkRoute,
							isActive,
							isExactActive
						}) })]),
						_: 2
					}, 1040, ["class"]))];
				}),
				_: 3
			}, _parent));
			else if (__props.custom) _push(ssrRenderComponent(unref(Slot), _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {
						..._ctx.$attrs,
						as: __props.as,
						type: __props.type,
						disabled: __props.disabled,
						...to.value ? {
							href: String(to.value),
							target: props.target,
							rel: rel.value,
							isExternal: true
						} : {},
						active: __props.active ?? false
					}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {
						..._ctx.$attrs,
						as: __props.as,
						type: __props.type,
						disabled: __props.disabled,
						...to.value ? {
							href: String(to.value),
							target: props.target,
							rel: rel.value,
							isExternal: true
						} : {},
						active: __props.active ?? false
					})];
				}),
				_: 3
			}, _parent));
			else _push(ssrRenderComponent(_sfc_main$4, mergeProps({
				..._ctx.$attrs,
				as: __props.as,
				type: __props.type,
				disabled: __props.disabled,
				...to.value ? {
					href: String(to.value),
					target: props.target,
					rel: rel.value,
					isExternal: true
				} : {}
			}, { class: resolveLinkClass() }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", { active: __props.active ?? false }, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", { active: __props.active ?? false })];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$5 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Link.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:.nuxt%2Fui%2Fbutton.ts
var virtual_nuxt__nuxt_2Fui_2Fbutton_default = {
	"slots": {
		"base": ["rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75", "transition-colors"],
		"label": "truncate",
		"leadingIcon": "shrink-0",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailingIcon": "shrink-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"variant": {
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": "",
			"ghost": "",
			"link": ""
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-xs gap-1",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-xs gap-1.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-sm gap-1.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-sm gap-2",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"block": { "true": {
			"base": "w-full justify-center",
			"trailingIcon": "ms-auto"
		} },
		"square": { "true": "" },
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"active": {
			"true": { "base": "" },
			"false": { "base": "" }
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "text-inverted bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "text-inverted bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "text-inverted bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "ring ring-inset ring-secondary/50 text-secondary hover:bg-secondary/10 active:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 outline-primary/25 focus-visible:outline-3 disabled:bg-primary/10 aria-disabled:bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 outline-secondary/25 focus-visible:outline-3 disabled:bg-secondary/10 aria-disabled:bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "text-success bg-success/10 hover:bg-success/15 active:bg-success/15 outline-success/25 focus-visible:outline-3 disabled:bg-success/10 aria-disabled:bg-success/10"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "text-info bg-info/10 hover:bg-info/15 active:bg-info/15 outline-info/25 focus-visible:outline-3 disabled:bg-info/10 aria-disabled:bg-info/10"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 outline-warning/25 focus-visible:outline-3 disabled:bg-warning/10 aria-disabled:bg-warning/10"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "text-error bg-error/10 hover:bg-error/15 active:bg-error/15 outline-error/25 focus-visible:outline-3 disabled:bg-error/10 aria-disabled:bg-error/10"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": "ghost",
			"class": "text-primary hover:bg-primary/10 active:bg-primary/10 outline-primary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "secondary",
			"variant": "ghost",
			"class": "text-secondary hover:bg-secondary/10 active:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "success",
			"variant": "ghost",
			"class": "text-success hover:bg-success/10 active:bg-success/10 outline-success/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "info",
			"variant": "ghost",
			"class": "text-info hover:bg-info/10 active:bg-info/10 outline-info/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "warning",
			"variant": "ghost",
			"class": "text-warning hover:bg-warning/10 active:bg-warning/10 outline-warning/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "error",
			"variant": "ghost",
			"class": "text-error hover:bg-error/10 active:bg-error/10 outline-error/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "primary",
			"variant": "link",
			"class": "text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": "link",
			"class": "text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": "link",
			"class": "text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": "link",
			"class": "text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": "link",
			"class": "text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": "link",
			"class": "text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated"
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": "ghost",
			"class": "text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
		},
		{
			"color": "neutral",
			"variant": "link",
			"class": "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3"
		},
		{
			"size": "xs",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "sm",
			"square": true,
			"class": "p-1.5"
		},
		{
			"size": "md",
			"square": true,
			"class": "p-1.5"
		},
		{
			"size": "lg",
			"square": true,
			"class": "p-2"
		},
		{
			"size": "xl",
			"square": true,
			"class": "p-2"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "solid",
		"size": "md"
	}
};
//#endregion
//#region node_modules/@nuxt/ui/dist/runtime/components/Button.vue
var _sfc_main$2 = {
	__name: "UButton",
	__ssrInlineRender: true,
	props: {
		label: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		activeColor: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		activeVariant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		square: {
			type: Boolean,
			required: false
		},
		block: {
			type: Boolean,
			required: false
		},
		loadingAuto: {
			type: Boolean,
			required: false
		},
		onClick: {
			type: [Function, Array],
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
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		type: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		active: {
			type: Boolean,
			required: false
		},
		exact: {
			type: Boolean,
			required: false
		},
		exactQuery: {
			type: [Boolean, String],
			required: false
		},
		exactHash: {
			type: Boolean,
			required: false
		},
		inactiveClass: {
			type: String,
			required: false
		},
		locale: {
			type: [Boolean, String],
			required: false
		},
		to: {
			type: null,
			required: false
		},
		href: {
			type: null,
			required: false
		},
		external: {
			type: Boolean,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		noRel: {
			type: Boolean,
			required: false
		},
		prefetchedClass: {
			type: String,
			required: false
		},
		prefetch: {
			type: Boolean,
			required: false
		},
		prefetchOn: {
			type: [String, Object],
			required: false
		},
		noPrefetch: {
			type: Boolean,
			required: false
		},
		trailingSlash: {
			type: String,
			required: false
		},
		activeClass: {
			type: String,
			required: false
		},
		exactActiveClass: {
			type: String,
			required: false
		},
		ariaCurrentValue: {
			type: String,
			required: false
		},
		viewTransition: {
			type: Boolean,
			required: false
		},
		replace: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const _props = __props;
		const slots = useSlots();
		const props = useComponentProps("button", _props);
		const appConfig = useAppConfig();
		const { orientation, size: buttonSize } = useFieldGroup(_props);
		const linkProps = useForwardProps(pickLinkProps(props));
		const loadingAutoState = ref(false);
		const formLoading = inject(formLoadingInjectionKey, void 0);
		async function onClickWrapper(event) {
			loadingAutoState.value = true;
			const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
			try {
				await Promise.all(callbacks.map((fn) => fn?.(event)));
			} finally {
				loadingAutoState.value = false;
			}
		}
		const isLoading = computed(() => {
			return props.loading || props.loadingAuto && (loadingAutoState.value || formLoading?.value && props.type === "submit");
		});
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(computed(() => ({
			...props,
			loading: isLoading.value
		})));
		const ui = computed(() => tv({
			extend: virtual_nuxt__nuxt_2Fui_2Fbutton_default,
			...defu$1({ variants: { active: {
				true: { base: mergeClasses(appConfig.ui?.button?.variants?.active?.true?.base, props.activeClass) },
				false: { base: mergeClasses(appConfig.ui?.button?.variants?.active?.false?.base, props.inactiveClass) }
			} } }, appConfig.ui?.button || {})
		})({
			color: props.color,
			variant: props.variant,
			size: buttonSize.value ?? props.size,
			loading: isLoading.value,
			block: props.block,
			square: props.square || !slots.default && !props.label,
			leading: isLeading.value,
			trailing: isTrailing.value,
			fieldGroup: orientation.value
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$3, mergeProps({
				type: unref(props).type,
				disabled: unref(props).disabled || isLoading.value
			}, unref(omit)(unref(linkProps), [
				"type",
				"disabled",
				"onClick"
			]), { custom: "" }, _attrs), {
				default: withCtx(({ active, ...slotProps }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$4, mergeProps({ "data-slot": "base" }, slotProps, {
						class: ui.value.base({
							class: [unref(props).ui?.base, unref(props).class],
							active,
							...active && unref(props).activeVariant ? { variant: unref(props).activeVariant } : {},
							...active && unref(props).activeColor ? { color: unref(props).activeColor } : {}
						}),
						onClick: onClickWrapper
					}), {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
									if (unref(isLeading) && unref(leadingIconName)) _push(ssrRenderComponent(_sfc_main$7, {
										name: unref(leadingIconName),
										"data-slot": "leadingIcon",
										class: ui.value.leadingIcon({
											class: unref(props).ui?.leadingIcon,
											active
										})
									}, null, _parent, _scopeId));
									else if (!!unref(props).avatar) _push(ssrRenderComponent(_sfc_main$5, mergeProps({ size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, unref(props).avatar, {
										"data-slot": "leadingAvatar",
										class: ui.value.leadingAvatar({
											class: unref(props).ui?.leadingAvatar,
											active
										})
									}), null, _parent, _scopeId));
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
								ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
									if (unref(props).label !== void 0 && unref(props).label !== null) _push(`<span data-slot="label" class="${ssrRenderClass(ui.value.label({
										class: unref(props).ui?.label,
										active
									}))}"${_scopeId}>${ssrInterpolate(unref(props).label)}</span>`);
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
								ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
									if (unref(isTrailing) && unref(trailingIconName)) _push(ssrRenderComponent(_sfc_main$7, {
										name: unref(trailingIconName),
										"data-slot": "trailingIcon",
										class: ui.value.trailingIcon({
											class: unref(props).ui?.trailingIcon,
											active
										})
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
							} else return [
								renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
									key: 0,
									name: unref(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({
										class: unref(props).ui?.leadingIcon,
										active
									})
								}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
									key: 1,
									size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
								}, unref(props).avatar, {
									"data-slot": "leadingAvatar",
									class: ui.value.leadingAvatar({
										class: unref(props).ui?.leadingAvatar,
										active
									})
								}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
								renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [unref(props).label !== void 0 && unref(props).label !== null ? (openBlock(), createBlock("span", {
									key: 0,
									"data-slot": "label",
									class: ui.value.label({
										class: unref(props).ui?.label,
										active
									})
								}, toDisplayString(unref(props).label), 3)) : createCommentVNode("", true)]),
								renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
									key: 0,
									name: unref(trailingIconName),
									"data-slot": "trailingIcon",
									class: ui.value.trailingIcon({
										class: unref(props).ui?.trailingIcon,
										active
									})
								}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
							];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(_sfc_main$4, mergeProps({ "data-slot": "base" }, slotProps, {
						class: ui.value.base({
							class: [unref(props).ui?.base, unref(props).class],
							active,
							...active && unref(props).activeVariant ? { variant: unref(props).activeVariant } : {},
							...active && unref(props).activeColor ? { color: unref(props).activeColor } : {}
						}),
						onClick: onClickWrapper
					}), {
						default: withCtx(() => [
							renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
								key: 0,
								name: unref(leadingIconName),
								"data-slot": "leadingIcon",
								class: ui.value.leadingIcon({
									class: unref(props).ui?.leadingIcon,
									active
								})
							}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$5, mergeProps({
								key: 1,
								size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
							}, unref(props).avatar, {
								"data-slot": "leadingAvatar",
								class: ui.value.leadingAvatar({
									class: unref(props).ui?.leadingAvatar,
									active
								})
							}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
							renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [unref(props).label !== void 0 && unref(props).label !== null ? (openBlock(), createBlock("span", {
								key: 0,
								"data-slot": "label",
								class: ui.value.label({
									class: unref(props).ui?.label,
									active
								})
							}, toDisplayString(unref(props).label), 3)) : createCommentVNode("", true)]),
							renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$7, {
								key: 0,
								name: unref(trailingIconName),
								"data-slot": "trailingIcon",
								class: ui.value.trailingIcon({
									class: unref(props).ui?.trailingIcon,
									active
								})
							}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
						]),
						_: 2
					}, 1040, ["class"])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$4 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Button.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region components/OfflineGateScreen.vue?vue&type=script&setup=true&lang.ts
var OfflineGateScreen_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "OfflineGateScreen",
	__ssrInlineRender: true,
	emits: ["confirm"],
	setup(__props, { emit: __emit }) {
		/**
		* components/OfflineGateScreen.vue
		* ---------------------------------------------------------------------------
		* หน้ายืนยันก่อนเข้า Offline Mode (ข้อ 2-5 ในสเปก) — แสดง "เพียงหน้านี้หน้า
		* เดียวเท่านั้น" (app.vue จะซ่อน <NuxtLayout>/<NuxtPage> ทั้งหมดตอนที่
		* offlineGatePending เป็น true) แจ้งผู้ใช้ชัดเจนว่ากำลังจะเข้าโหมด Offline
		* ข้อมูลเก็บไว้ในเครื่องเท่านั้น ยังไม่ส่งข้อมูล/คำนวณคะแนน และมีปุ่มเดียวคือ
		* "เข้าโหมด Offline" — กดแล้วเรียก useOfflineMode().confirmOfflineMode()
		* ซึ่งเป็นจุดเดียวที่ล็อก Session เข้า Offline Mode จริง (ห้ามสลับกลับ Online
		* ตลอด Session แม้ Internet จะกลับมา)
		*
		* ไม่ต่อ Layout 'app' เพื่อไม่ให้พึ่งพา Component/State อื่นของแอปหลัก (กันพัง
		* ซ้อนตอนออฟไลน์จริง ๆ เหมือนแนวทางเดียวกับ pages/offline.vue ที่มีอยู่แล้ว)
		* ใช้โทนสี/สไตล์ farm theme เดียวกับ components/WelcomePage.vue ทั้งหมด
		*/
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$7;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "offline-gate" }, _attrs))} data-v-08af5b8e><div class="offline-gate__card" data-v-08af5b8e><div class="offline-gate__icon-wrap" data-v-08af5b8e>`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-wifi-off",
				class: "offline-gate__icon"
			}, null, _parent));
			_push(`</div><h1 class="offline-gate__title" data-v-08af5b8e>ขณะนี้คุณกำลังใช้งานในโหมด Offline</h1><p class="offline-gate__desc" data-v-08af5b8e> ตรวจไม่พบการเชื่อมต่ออินเทอร์เน็ต ระบบจะเก็บข้อมูลการเล่นทั้งหมดไว้ ในเครื่องของคุณเท่านั้น (LocalStorage) </p><p class="offline-gate__desc" data-v-08af5b8e> ในโหมดนี้จะ<strong data-v-08af5b8e>ยังไม่มีการส่งข้อมูลขึ้นเซิร์ฟเวอร์ และยังไม่มีการ คำนวณคะแนน</strong>ใด ๆ จนกว่าจะกลับมาออนไลน์และเข้าสู่ระบบใหม่อีกครั้ง </p><p class="offline-gate__hint" data-v-08af5b8e> เมื่อกดเข้าสู่โหมด Offline แล้ว จะไม่สามารถสลับกลับเป็นโหมด Online ได้ตลอดการใช้งานครั้งนี้ แม้อินเทอร์เน็ตจะกลับมาระหว่างเล่นก็ตาม </p>`);
			_push(ssrRenderComponent(_component_UButton, {
				block: "",
				size: "xl",
				color: "warning",
				class: "offline-gate__button",
				onClick: ($event) => emit("confirm")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` เข้าโหมด Offline `);
					else return [createTextVNode(" เข้าโหมด Offline ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region components/OfflineGateScreen.vue
var _sfc_setup$3 = OfflineGateScreen_vue_vue_type_script_setup_true_lang_default.setup;
OfflineGateScreen_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OfflineGateScreen.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var OfflineGateScreen_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(OfflineGateScreen_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-08af5b8e"]]), { __name: "OfflineGateScreen" });
//#endregion
//#region node_modules/nuxt/dist/app/composables/layout.js
var routeRulesMatcher = virtual_nuxt__nuxt_2Froute_rules_default;
function resolveLayoutName(route, name) {
	return unref(name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path ?? "/").appLayout ?? "default";
}
//#endregion
//#region virtual:nuxt:.nuxt%2Flayouts.mjs
var virtual_nuxt__nuxt_2Flayouts_default = { app: defineAsyncComponent(() => import("./_nuxt/app-CwBo4V2Y.js").then((m) => m.default || m)) };
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-layout.js
var LayoutLoader = defineComponent({
	name: "LayoutLoader",
	inheritAttrs: false,
	props: {
		name: String,
		layoutProps: Object
	},
	setup(props, context) {
		return () => h(virtual_nuxt__nuxt_2Flayouts_default[props.name], props.layoutProps, context.slots);
	}
});
var nuxt_layout_default = defineComponent({
	name: "NuxtLayout",
	inheritAttrs: false,
	props: {
		name: {
			type: [
				String,
				Boolean,
				Object
			],
			default: null
		},
		fallback: {
			type: [String, Object],
			default: null
		}
	},
	setup(props, context) {
		const nuxtApp = useNuxtApp();
		const injectedRoute = inject(PageRouteSymbol);
		const route = !injectedRoute || injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
		const layout = computed(() => {
			let layout = resolveLayoutName(route, props.name);
			if (layout && !(layout in virtual_nuxt__nuxt_2Flayouts_default)) {
				if (props.fallback) layout = unref(props.fallback);
			}
			return layout;
		});
		provide(LayoutSymbol, layout);
		const layoutRef = shallowRef();
		context.expose({ layoutRef });
		const done = nuxtApp.deferHydration();
		let lastLayout;
		return () => {
			const hasTransition = !!layout.value && layout.value in virtual_nuxt__nuxt_2Flayouts_default && !!(route?.meta.layoutTransition ?? false);
			const transitionProps = hasTransition && _mergeTransitionProps([
				route?.meta.layoutTransition,
				false,
				{
					onBeforeLeave() {
						nuxtApp["~transitionPromise"] = new Promise((resolve) => {
							nuxtApp["~transitionFinish"] = resolve;
						});
					},
					onAfterLeave() {
						nuxtApp["~transitionFinish"]?.();
						delete nuxtApp["~transitionFinish"];
						delete nuxtApp["~transitionPromise"];
					}
				}
			]);
			const previouslyRenderedLayout = lastLayout;
			lastLayout = layout.value;
			return _wrapInTransition(transitionProps, { default: () => h(Suspense, {
				suspensible: true,
				onResolve: async () => {
					await nextTick(done);
				}
			}, { default: () => h(LayoutProvider, {
				layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
				key: layout.value || void 0,
				name: layout.value,
				shouldProvide: !props.name,
				isRenderingNewLayout: (name) => {
					return name !== previouslyRenderedLayout && name === layout.value;
				},
				hasTransition
			}, context.slots) }) }).default();
		};
	}
});
var LayoutProvider = defineComponent({
	name: "NuxtLayoutProvider",
	inheritAttrs: false,
	props: {
		name: { type: [String, Boolean] },
		layoutProps: { type: Object },
		hasTransition: { type: Boolean },
		shouldProvide: { type: Boolean },
		isRenderingNewLayout: {
			type: Function,
			required: true
		}
	},
	setup(props, context) {
		const name = props.name;
		if (props.shouldProvide) provide(LayoutMetaSymbol, { isCurrent: (route) => name === false || name === resolveLayoutName(route) });
		const injectedRoute = inject(PageRouteSymbol);
		const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
		const enclosingLayout = inject(LayoutMetaSymbol, null);
		if (isNotWithinNuxtPage) {
			const vueRouterRoute = useRoute$1();
			const reactiveChildRoute = {};
			for (const _key in vueRouterRoute) {
				const key = _key;
				Object.defineProperty(reactiveChildRoute, key, {
					enumerable: true,
					get: () => {
						return props.isRenderingNewLayout(props.name) && (!enclosingLayout || enclosingLayout.isCurrent(vueRouterRoute)) ? vueRouterRoute[key] : injectedRoute[key];
					}
				});
			}
			provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
		}
		return () => {
			if (!name || typeof name === "string" && !(name in virtual_nuxt__nuxt_2Flayouts_default)) return context.slots.default?.();
			return h(LayoutLoader, {
				key: name,
				layoutProps: props.layoutProps,
				name
			}, context.slots);
		};
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean,
		routeRecord: Object
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/page.js
var page_default = defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = ref();
		inject(PageRouteSymbol, null);
		expose({ pageRef });
		inject(LayoutMetaSymbol, null);
		nuxtApp.deferHydration();
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				return h(Suspense, { suspensible: true }, { default() {
					return h(RouteProvider, {
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						vnodeRef: pageRef
					});
				} });
			}) });
		};
	}
});
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
//#endregion
//#region \0virtual:pwa-info
var pwaInfo = {
	"pwaInDevEnvironment": false,
	"webManifest": {
		"href": "/manifest.webmanifest",
		"useCredentials": false,
		"linkTag": "<link rel=\"manifest\" href=\"/manifest.webmanifest\">"
	}
};
//#endregion
//#region node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest.js
var VitePwaManifest_default = defineComponent({ async setup() {
	if (pwaInfo) {
		const meta = ref({ link: [] });
		useHead$1(meta);
		const { webManifest } = pwaInfo;
		if (webManifest) {
			const { href, useCredentials } = webManifest;
			if (useCredentials) meta.value.link.push({
				rel: "manifest",
				href,
				crossorigin: "use-credentials"
			});
			else meta.value.link.push({
				rel: "manifest",
				href
			});
		}
	}
	return () => null;
} });
//#endregion
//#region composables/useOfflineMode.ts
var ROUND_DATA_KEY = "offlineMode:roundData";
function readJson(key) {
	return null;
}
function useOfflineMode() {
	const isOfflineMode = useState("offline-mode-locked", () => false);
	const offlineGatePending = useState("offline-mode-gate-pending", () => false);
	const roundData = useState("offline-mode-round-data", () => null);
	function loadRoundData() {
		roundData.value = readJson(ROUND_DATA_KEY);
	}
	/** เรียกครั้งเดียวจาก plugins/offline-mode.client.ts */
	function initConnectivityWatch(onBackOnline) {}
	/** กดปุ่ม "เข้าโหมด Offline" ที่ OfflineGateScreen */
	function confirmOfflineMode() {}
	function persistRoundData(next) {
		roundData.value = next;
	}
	function startRound(uid) {
		persistRoundData({
			uid,
			startedAt: Date.now(),
			endedAt: void 0,
			stations: []
		});
	}
	function logStationScan(stationId, stationName) {
		const current = roundData.value ?? {
			uid: "",
			stations: []
		};
		if (current.stations.some((s) => s.stationId === stationId)) return;
		persistRoundData({
			...current,
			stations: [...current.stations, {
				stationId,
				stationName,
				scanTime: Date.now(),
				order: current.stations.length + 1
			}]
		});
	}
	function endRound() {
		if (!roundData.value || roundData.value.endedAt) return;
		persistRoundData({
			...roundData.value,
			endedAt: Date.now()
		});
	}
	/** [ใหม่] ล้างข้อมูลรอบ Offline ทิ้ง (LocalStorage + State) โดยไม่สร้างรอบใหม่ให้
	* ทันที — ใช้ตอน "จบเกมสำเร็จ" (pages/round-summary.vue::confirmAndGoHome()) แทน
	* การเรียก startRound() เดิมที่เผื่อเตรียมรอบถัดไปไว้ล่วงหน้าทันที (ขัดกับสเปกใหม่
	* "ห้ามเริ่ม Round ใหม่อัตโนมัติ" — รอบถัดไปจะถูกสร้างตอนกด GO ที่ pages/starting.vue
	* ตามปกติอยู่แล้ว) และตอน Session หมดอายุเกิน 24 ชม. (ดู composables/useSessionExpiry.ts) */
	function clearRoundData() {
		roundData.value = null;
	}
	return {
		isOfflineMode: readonly(isOfflineMode),
		offlineGatePending: readonly(offlineGatePending),
		roundData: readonly(roundData),
		initConnectivityWatch,
		confirmOfflineMode,
		loadRoundData,
		startRound,
		logStationScan,
		endRound,
		clearRoundData
	};
}
//#endregion
//#region app.vue?vue&type=script&setup=true&lang.ts
var app_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* app.vue (root)
		* ---------------------------------------------------------------------------
		* โปรเจกต์นี้เดิมไม่มีไฟล์ app.vue ที่ root เลย (Nuxt ใช้ default ภายในให้เอง
		* โดยอัตโนมัติ เทียบเท่ากับ `<NuxtLayout><NuxtPage /></NuxtLayout>` ทุก
		* ประการ) — ไฟล์นี้เพิ่มเข้ามาเพื่อ "คงพฤติกรรมเดิมทุกอย่างไว้ครบ" แล้วแค่แทรก
		* <VitePwaManifest /> (Component จาก @vite-pwa/nuxt, Auto-import ให้แล้ว)
		* เพิ่มเข้ามาจุดเดียว เพื่อฝัง <link rel="manifest"> ของ Web App Manifest ลง
		* ใน <head> ของทุกหน้า (จำเป็นต้องมี Component นี้อยู่ในต้นไม้ของ App จริง ๆ
		* ถึงจะทำงาน — ตัว Module เองไม่ได้ฝังให้อัตโนมัติถ้าไม่มี Component นี้อยู่
		* ที่ไหนเลยในแอป) ไม่ได้แก้ไข Layout/UI ใด ๆ ทั้งสิ้น
		*
		* Offline Mode (ใหม่, ข้อ 2-5): เพิ่มการเช็ค offlineGatePending ที่จุดสูงสุด
		* ของแอป (เหนือทุก Route/Layout) — ถ้า plugins/offline-mode.client.ts ตรวจพบ
		* ว่าไม่มี Internet ตอนเข้าเว็บ ให้ "แสดงเฉพาะ <OfflineGateScreen />" แทน
		* <NuxtLayout>/<NuxtPage> ทั้งหมด (ตรงตามสเปกข้อ 2 "แสดงหน้าสำหรับ Offline
		* Mode เท่านั้น") ไม่ว่าผู้ใช้จะเปิด URL ไหนก็ตาม จนกว่าจะกดปุ่ม "เข้าโหมด
		* Offline" เรียก confirmOfflineMode() ซึ่งเป็นจุดเดียวที่ล็อก Session เข้า
		* Offline Mode จริง (ข้อ 5) จากนั้นจึงปล่อยให้ Flow เดิม (Login + Registration
		* Form ฯลฯ) ทำงานต่อตามปกติ (ข้อ 6) — ถ้ามี Internet ตอนเข้าเว็บ
		* offlineGatePending จะเป็น false เสมอ ไม่กระทบ Flow Online เดิมเลย
		*/
		const { offlineGatePending, confirmOfflineMode } = useOfflineMode();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_OfflineGateScreen = OfflineGateScreen_default;
			const _component_NuxtLayout = nuxt_layout_default;
			const _component_NuxtPage = page_default;
			const _component_VitePwaManifest = VitePwaManifest_default;
			if (unref(offlineGatePending)) _push(ssrRenderComponent(_component_OfflineGateScreen, mergeProps({ onConfirm: unref(confirmOfflineMode) }, _attrs), null, _parent));
			else {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(_component_NuxtLayout, null, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent, _scopeId));
						else return [createVNode(_component_NuxtPage)];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_VitePwaManifest, null, null, _parent));
				_push(`<!--]-->`);
			}
		};
	}
});
//#endregion
//#region app.vue
var _sfc_setup$2 = app_vue_vue_type_script_setup_true_lang_default.setup;
app_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var app_default = app_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-error-page.vue
var _sfc_main$1 = {
	__name: "nuxt-error-page",
	__ssrInlineRender: true,
	props: { error: Object },
	setup(__props) {
		const _error = __props.error;
		const status = Number(_error.statusCode || 500);
		const is404 = status === 404;
		const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
		const description = _error.message || _error.toString();
		const stack = void 0;
		const _Error404 = defineAsyncComponent(() => import("./_nuxt/error-404-DXxSVvUx.js"));
		const _Error = defineAsyncComponent(() => import("./_nuxt/error-500-CR1P3_A_.js"));
		const ErrorTemplate = is404 ? _Error404 : _Error;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({
				status: unref(status),
				statusText: unref(statusText),
				statusCode: unref(status),
				statusMessage: unref(statusText),
				description: unref(description),
				stack: unref(stack)
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/entry.js
var entry = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt__nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError$1(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry(ssrContext));
//#endregion
export { useForwardProps$1 as A, get as C, _sfc_main$7 as D, looseToNumber as E, useState as F, $fetch$2 as I, renderSlotFragments as M, createContext as N, Primitive as O, useAppConfig as P, compare as S, isArrayOfArray as T, FieldGroupReset as _, _sfc_main$5 as a, useForwardProps as b, formBusInjectionKey as c, formInputsInjectionKey as d, entry_default as default, formLoadingInjectionKey as f, useFormField as g, inputIdInjectionKey as h, NuxtLink as i, useEmitAsProps as j, Slot as k, formErrorsInjectionKey as l, formStateInjectionKey as m, _plugin_vue_export_helper_default as n, _sfc_main$6 as o, formOptionsInjectionKey as p, _sfc_main$2 as r, tv as s, useOfflineMode as t, formFieldInjectionKey as u, useFieldGroup as v, getDisplayValue as w, useComponentProps as x, useComponentIcons as y };

//# sourceMappingURL=server.mjs.map