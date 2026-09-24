/// <reference lib="webworker" />
/**
 * service-worker/sw.ts
 * ---------------------------------------------------------------------------
 * Service Worker หลักของแอป เขียนเอง (strategy: 'injectManifest') แทนการให้
 * @vite-pwa/nuxt สร้างให้อัตโนมัติ (strategy: 'generateSW') เพราะ API หลักของ
 * แอปนี้ (Google Apps Script Web App, ดู composables/useMemberApi.ts) รับคำขอ
 * เป็น POST ล้วน ๆ ทุก action (`checkMember` / `register` / `login` /
 * `checkin` / `getMember` / `getJourney` / `getScore` ฯลฯ) — แต่ Cache Storage
 * มาตรฐานของเบราว์เซอร์ "เก็บ Request ที่เป็น POST ไม่ได้" (throw TypeError)
 * generateSW/runtimeCaching ปกติจึงใช้ไม่ได้กับ API นี้ ต้องเขียน Service
 * Worker เองเพื่อคุม Cache Key ของ POST เอง (ดูฟังก์ชัน gasCacheKeyPlugin
 * ด้านล่าง) และเพื่อแยก Action ที่ "อ่านอย่างเดียว" (ปลอดภัยที่จะเสิร์ฟข้อมูล
 * เก่าตอนออฟไลน์) ออกจาก Action ที่ "เขียน/บันทึกข้อมูล" (ห้ามเสิร์ฟจาก Cache
 * เด็ดขาด เพราะจะทำให้แอปเข้าใจผิดว่าบันทึกสำเร็จทั้งที่จริงยังไม่ได้ส่งขึ้น
 * Server — ปล่อยให้ Fail ตามปกติแล้วให้ระบบคิวเดิม `useOfflineSync.ts` +
 * `plugins/offline-sync.client.ts` ที่มีอยู่แล้วในโปรเจกต์เป็นคนจัดการ Retry/
 * Background Sync ต่อ ไม่ได้แก้ไข Logic ส่วนนั้นเลย)
 */

import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute, setCatchHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import type { WorkboxPlugin } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

const CACHE_VERSION = 'v1'
const OFFLINE_URL = '/offline'

// -----------------------------------------------------------------------
// 1) Precache — ไฟล์ Build ทั้งหมดที่ @vite-pwa/nuxt รวบรวมมาให้ตอน build
//    (JS/CSS/Font/รูปภาพ/Manifest/หน้า HTML ที่ Prerender ไว้ — ตอนนี้ครอบคลุม
//    ทุกหน้าหลักของแอป ไม่ใช่แค่ /offline หน้าเดียวแล้ว ดู
//    nuxt.config.ts -> nitro.prerender.routes)
//    self.__WB_MANIFEST จะถูกแทนที่ด้วยรายการไฟล์จริงตอน build เท่านั้น
// -----------------------------------------------------------------------
precacheAndRoute(self.__WB_MANIFEST)

// ล้าง Cache เวอร์ชันเก่าที่ค้างจาก Deploy ครั้งก่อน ๆ ทันทีที่ SW ใหม่ Activate
// (ป้องกันข้อ "ป้องกันการ Cache ไฟล์ Build เก่าหลัง Deploy")
cleanupOutdatedCaches()

// -----------------------------------------------------------------------
// 2) Auto Update — SW ใหม่ข้าม "waiting" ทันทีที่พร้อม + เข้าคุม Client ทันที
//    คู่กับ registerType: 'autoUpdate' ฝั่ง nuxt.config.ts และ
//    plugins/pwa-update-notify.client.ts ที่จะแจ้งเตือนผู้ใช้ + สั่ง Reload
// -----------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim()
      // แก้ไขจุดนี้ (Storage Eviction — สาเหตุที่เป็นไปได้อีกจุดของปัญหา
      // "เปิดครั้งแรกใช้ได้ แต่ปิดเน็ตแล้วเปิดใหม่พัง"): Android Chrome จะ
      // พิจารณา Origin ที่ "ยังไม่ได้ขอ Persistent Storage" เป็น Best-effort
      // Storage เสมอ —ถ้าเครื่องผู้ใช้เจอ Storage Pressure (พื้นที่เครื่องเหลือ
      // น้อย) หรือผู้ใช้ไม่ได้ "Add to Home Screen"/เปิดแอปบ่อยพอ (Site
      // Engagement Score ต่ำ) ระบบอาจ Evict (ลบทิ้งเงียบ ๆ) ทั้ง Cache Storage
      // และ Service Worker Registration ของ Origin นั้นได้เองโดยไม่มี Error ใด ๆ
      // ให้เห็น — พอผู้ใช้เปิดแอปใหม่ตอนไม่มีเน็ต SW เลยไม่ได้ควบคุมหน้าอยู่
      // (หรือคุมอยู่แต่ Cache ว่างเปล่า) จึง Fallback ไปที่หน้า Error ของ Browser
      // เอง (หน้าไดโนเสาร์) ตรงตามอาการที่รายงานมา — ขอ Persistent Storage ตรงนี้
      // (Best-effort, ไม่ Block Activation ถ้าขอไม่ได้/ไม่รองรับ) เพื่อลดโอกาส
      // ถูก Evict ให้มากที่สุด — วิธีที่ "แน่นอนที่สุด" ที่เหลืออยู่นอกเหนือจากนี้
      // (นอกเหนือการควบคุมของโค้ดฝั่งเว็บได้) คือผู้ใช้กด "Add to Home Screen"
      // ติดตั้งเป็น PWA จริง ซึ่ง Android จะให้ Persistent Storage มาโดยอัตโนมัติเสมอ
      try {
        await self.navigator.storage?.persist?.()
      } catch {
        // ไม่รองรับ/ถูกปฏิเสธ — ปล่อยผ่าน ไม่ใช่ Error ที่ควร Block การ Activate
      }
    })(),
  )
})

// -----------------------------------------------------------------------
// 3) HTML (Navigation requests) — Network First
//    ลองโหลดจาก Network ก่อนเสมอ (ได้เนื้อหาล่าสุด) ถ้าช้าเกิน/ไม่มีเน็ต ค่อย
//    Fallback ไปหน้าที่ Cache ไว้ล่าสุด แล้วถ้าไม่เคย Cache หน้านั้นมาก่อนเลย
//    (เช่น เพิ่งติดตั้งแอปครั้งแรกแบบออฟไลน์) จะ Fallback ไปหน้า /offline อีกที
// -----------------------------------------------------------------------
const htmlHandler = new NetworkFirst({
  cacheName: `html-cache-${CACHE_VERSION}`,
  networkTimeoutSeconds: 8,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60 }),
  ],
})
registerRoute(new NavigationRoute(htmlHandler))

// Fallback สุดท้ายจริง ๆ เมื่อ Navigate แล้วไม่มีทั้ง Network และไม่มีใน
// html-cache-v1 เลย (ดู htmlHandler ด้านบน — NetworkFirst จะ throw มาที่นี่
// เฉพาะตอนที่ *ทั้ง* Network *และ* Cache ของตัวเองไม่มีคำตอบให้เท่านั้น)
//
// แก้ไขจุดนี้ (จุดสำคัญที่สุด — Root Cause ของ "ออฟไลน์แล้วขึ้นหน้า
// ไดโนเสาร์/หน้า Offline เอง ทั้งที่หน้านั้นถูก Precache ไว้แล้วจริง"):
// เดิม Fallback ไปหาแค่หน้า `/offline` อย่างเดียวเท่านั้น โดยไม่เคยลองหา
// หน้าที่ถูก Precache ไว้จริง (Home/Map/History ฯลฯ อยู่ใน Cache ชื่อ
// `workbox-precache-v2` ซึ่งเป็นคนละ Cache กับ `html-cache-v1` ที่
// NetworkFirst ใช้) มาก่อนเลย — ปกติแล้วจะไม่มีปัญหา เพราะ Route ของ
// precacheAndRoute() (บรรทัด 40) ถูกลงทะเบียนก่อน NavigationRoute (จึง
// เสิร์ฟจาก Precache ตรงได้เลยโดยไม่ผ่าน Handler นี้) — แต่ถ้าเกิดกรณีใด
// กรณีหนึ่งต่อไปนี้ (Trailing Slash ไม่ตรง / Query String แปลกที่ไม่อยู่ใน
// ignoreURLParametersMatching / Cache Entry บาง URL หลุดหาย/เสียหายบางส่วน
// จาก Storage Pressure ของ Android โดยไม่ได้ลบทั้ง Origin) มาถึง Handler นี้
// จริง ๆ — เดิมจะข้ามหน้าที่ Cache ไว้แล้วจริงไปโชว์หน้า `/offline` เฉย ๆ ทันที
// ทั้งที่จริงมีเนื้อหาให้ใช้งานได้ ผู้ใช้จึงเข้าใจผิดว่า "ออฟไลน์แล้วใช้งานไม่ได้"
// ทั้งที่ Cache มีข้อมูลอยู่ — แก้โดยลองหาใน Precache ทั่วไปก่อนเสมอ (ครอบคลุม
// ทั้ง Exact URL และ URL Variations เช่น '/', '/home' ที่ Workbox จัดการให้เอง)
// แล้วค่อย Fallback ไปหน้า `/offline` เป็นชั้นสุดท้ายจริง ๆ ถ้าไม่เจอเลย
setCatchHandler(async ({ request }) => {
  if (request.mode === 'navigate') {
    const precached = await matchPrecache(request)
    if (precached) return precached

    // เผื่อ URL ที่ขอมามีการเติม/ตัด Trailing Slash มาไม่ตรงกับ Precache Key
    // เป๊ะ ๆ (เช่นบาง Browser/Bookmark ส่ง '/home/' แทน '/home') — ลองอีกครั้ง
    // ด้วย Path ที่ตัด/เติม Trailing Slash สลับกันก่อนยอมแพ้ไปหน้า /offline
    const url = new URL(request.url)
    const altPath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : `${url.pathname}/`
    const altUrl = new URL(altPath || '/', url.origin)
    const precachedAlt = await matchPrecache(altUrl.href)
    if (precachedAlt) return precachedAlt

    const offlinePage = await self.caches.match(OFFLINE_URL, { ignoreSearch: true })
    if (offlinePage) return offlinePage
  }
  return Response.error()
})

// -----------------------------------------------------------------------
// 4) JS / CSS — Stale While Revalidate
//    เสิร์ฟจาก Cache ทันที (เร็ว + ใช้ได้ตอนออฟไลน์) แล้วค่อยไปโหลดของใหม่มา
//    อัปเดต Cache เงียบ ๆ เบื้องหลังสำหรับครั้งถัดไป
// -----------------------------------------------------------------------
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: `static-resources-${CACHE_VERSION}`,
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
)

// -----------------------------------------------------------------------
// 5) รูปภาพ (รวมถึง Leaflet/OpenStreetMap Map Tiles ที่โหลดข้ามโดเมน) — Cache First
// -----------------------------------------------------------------------
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: `images-cache-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true }),
    ],
  }),
)

// -----------------------------------------------------------------------
// 5.1) โมเดล AI ของ Photo Detection Quest (TensorFlow.js / COCO-SSD) — Cache First
// -----------------------------------------------------------------------
// เพิ่มใหม่ (Phase 2 — Object Detection จริง ดู
// services/detection/providers/cocoSsdProvider.ts): ตัวโค้ด TFJS ถูก Bundle ไป
// กับแอปและ Precache อยู่แล้วเหมือน JS ก้อนอื่น แต่ **ไฟล์น้ำหนักของโมเดล**
// (model.json + group1-shard*of* รวมประมาณ 5-6 MB) โหลดข้ามโดเมนจาก
// storage.googleapis.com ตอนใช้งานครั้งแรกเสมอ — ไฟล์พวกนี้ `destination` เป็น
// '' (fetch ธรรมดา ไม่ใช่ script/image/font) จึงไม่เข้าเงื่อนไข Route ข้อ 4-6
// ที่มีอยู่เดิมเลยสักข้อ ถ้าไม่เพิ่ม Route นี้ผู้เล่นจะต้องโหลดใหม่ทุกครั้งที่
// เปิดแอป และทำเควสตอนออฟไลน์ไม่ได้เลย (ขัดกับ Offline First ของทั้งแอป)
//
// ใช้ CacheFirst + อายุยาว 1 ปี เพราะไฟล์โมเดลเป็น Immutable จริง ๆ (เวอร์ชัน
// ใหม่ = URL ใหม่) และ maxEntries เผื่อไว้ 20 (model.json + shard หลายไฟล์)
// purgeOnQuotaError: true เพื่อให้ยอมสละ Cache ก้อนนี้ก่อนถ้าเครื่องพื้นที่เต็ม
// (ยอมให้เควสถ่ายรูปใช้ไม่ได้ ดีกว่าทำให้ทั้งแอปหลุด Cache จนเปิดออฟไลน์ไม่ได้)
registerRoute(
  ({ url }) => url.hostname === 'storage.googleapis.com' && url.pathname.startsWith('/tfjs-models/'),
  new CacheFirst({
    cacheName: `tfjs-model-cache-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60, purgeOnQuotaError: true }),
    ],
  }),
)

// -----------------------------------------------------------------------
// 6) Font — Cache First (ฟอนต์แทบไม่เปลี่ยนเลย เก็บไว้นานได้)
// -----------------------------------------------------------------------
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: `fonts-cache-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 }),
    ],
  }),
)

// -----------------------------------------------------------------------
// 7) API (Google Apps Script Web App) — Network First พร้อม Cache Backup
// -----------------------------------------------------------------------
// แอปนี้เรียก API เดียวกันทุก Action ผ่าน POST body: { action: '...', ...payload }
// (ดู composables/useMemberApi.ts -> callApi) จึงต้องแยกด้วยเนื้อหาใน body
// เอง ไม่ใช่แยกด้วย URL — และ Cache Storage เก็บ Request แบบ POST ตรง ๆ
// ไม่ได้ (Spec บังคับ throw) จึงต้องสร้าง Cache Key ปลอมเป็น GET URL แทน
// ผ่าน cacheKeyWillBeUsed (Workbox รองรับ Pattern นี้โดยตรง)
//
// Action ที่ Cache ได้ (อ่านอย่างเดียว ไม่เขียนข้อมูลอะไรเลย):
//   getMember / getJourney / getScore — ใช้แสดงแต้ม/ประวัติหน้า Home, History
// Action ที่ "ห้าม" Cache (มีผลข้างเคียง/ใช้ตัดสินใจ Flow Login-Register):
//   checkMember / register / login / loginByLine / updateMember / checkin
//   -> ปล่อยเป็น NetworkOnly เสมอ ถ้าออฟไลน์จะ Fail ตามปกติ แล้วให้
//      useOfflineSync.ts (คิวใน LocalStorage + Sync อัตโนมัติตอนกลับมาออนไลน์)
//      ที่มีอยู่แล้วในโปรเจกต์เป็นผู้จัดการต่อ เพื่อไม่ให้ UI เข้าใจผิดว่า
//      บันทึกสำเร็จทั้งที่ยังไม่ได้ส่งขึ้น Server จริง
const READ_ONLY_ACTIONS = new Set(['getMember', 'getJourney', 'getScore'])

/**
 * [Fix — TypeError: Failed to execute 'clone' on 'Request': Request body is
 * already used] เดิม cacheKeyWillBeUsed พยายาม request.clone().text() "ที่นี่"
 * เพื่ออ่าน action ทุกครั้งที่ถูกเรียก — ปัญหาคือ Workbox เรียก hook นี้ 2 จังหวะ
 * ต่อ 1 request เสมอ: mode 'read' (ก่อนลองหา Cache เดิม) และ mode 'write' (ตอน
 * cachePut หลัง fetch(request) สำเร็จแล้ว) จังหวะหลังนี้ตัว request เดิมถูก
 * fetch() ไปใช้งานจริงแล้ว (body stream ถูก "ใช้" ไปครั้งหนึ่งแล้วโดย fetch เอง)
 * เรียก .clone() ซ้ำบน request ตัวเดิมที่ body ถูกใช้ไปแล้วจึง throw ทันที
 * (Fetch API spec: clone() ต้องเรียกก่อน body ถูกอ่านเท่านั้น)
 *
 * แก้โดยย้ายการอ่าน body ไปทำ "ครั้งเดียว" ที่ route handler ด้านล่าง (ก่อน fetch
 * จริงเสมอ) แล้วฝัง action/idKey ลงใน URL ของ Request ตั้งแต่ตอนนั้นเลย —
 * cacheKeyWillBeUsed ที่นี่จึงแค่ "อ่าน request.url ตรง ๆ" พอ ไม่ต้องแตะ body
 * อีกเลยไม่ว่าจะถูกเรียกกี่ครั้ง/จังหวะไหนก็ตาม (ปลอดภัยทั้ง mode 'read'/'write')
 */
const gasCacheKeyPlugin: WorkboxPlugin = {
  async cacheKeyWillBeUsed({ request }) {
    return request.url
  },
}

const apiNetworkFirst = new NetworkFirst({
  cacheName: `api-cache-${CACHE_VERSION}`,
  networkTimeoutSeconds: 10,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 3 * 24 * 60 * 60 }),
    gasCacheKeyPlugin,
  ],
})

const apiNetworkOnly = new NetworkOnly()

registerRoute(
  ({ request, url }) => {
    if (request.method !== 'POST') return false
    // ต้องเป็นโดเมน Google Apps Script Web App เท่านั้น (apiBaseUrl ใน .env
    // ลงท้ายด้วย /exec เสมอ ดู server-gas/README.md) กันไม่ให้ไป Intercept
    // POST อื่นที่ไม่เกี่ยวข้อง (เช่น ของ Dev Tools/Extension)
    return url.hostname === 'script.google.com' || url.hostname === 'script.googleusercontent.com'
  },
  async (params) => {
    let action = ''
    let idKey = ''
    let bodyText = ''
    try {
      // อ่าน body "ครั้งเดียวที่นี่" ก่อน fetch จริงเสมอ (ปลอดภัยเพราะยังไม่มีใคร
      // แตะ body ของ request ตัวจริงเลย — .clone() ใช้ได้ปกติ) เก็บ bodyText ไว้
      // ใช้สร้าง Request ใหม่ด้านล่างด้วย ไม่ต้องอ่านซ้ำรอบสอง
      bodyText = await params.request.clone().text()
      const payload = JSON.parse(bodyText) as Record<string, unknown>
      action = String(payload.action ?? '')
      idKey = String(payload.userId ?? payload.memberId ?? payload.lineUserId ?? '')
    } catch {
      // อ่าน body ไม่ได้ -> ถือว่าไม่ทราบ action ปฏิบัติแบบปลอดภัยที่สุด
      // (ไม่ Cache) ปล่อยผ่าน Network ตามปกติ
    }

    if (!READ_ONLY_ACTIONS.has(action)) {
      // Action ที่ห้าม Cache (เขียนข้อมูล) — ไม่ต้องสร้าง Request ใหม่เลย ส่ง
      // params เดิมตรง ๆ (NetworkOnly ไม่เรียก cacheKeyWillBeUsed อยู่แล้ว)
      return apiNetworkOnly.handle(params)
    }

    // [Fix] ฝัง action/idKey ลงใน query string ของ Request ใหม่ "ตรงนี้ที่เดียว"
    // (ก่อน fetch จริง) แทนที่จะให้ cacheKeyWillBeUsed ไปอ่าน body เอาเองทีหลัง —
    // ดูเหตุผลเต็ม ๆ ที่คอมเมนต์ gasCacheKeyPlugin ด้านบน สร้าง body ใหม่จาก
    // bodyText ที่อ่านไปแล้ว ไม่ clone().text() ซ้ำรอบสอง
    const keyedUrl = new URL(params.request.url)
    keyedUrl.searchParams.set('__swAction', action)
    if (idKey) keyedUrl.searchParams.set('__swId', idKey)
    const keyedRequest = new Request(keyedUrl.toString(), {
      method: params.request.method,
      headers: params.request.headers,
      body: bodyText,
    })

    return apiNetworkFirst.handle({ ...params, request: keyedRequest })
  },
  'POST',
)
