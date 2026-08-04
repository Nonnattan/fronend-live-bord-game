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

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
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
  event.waitUntil(self.clients.claim())
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

// Fallback สุดท้ายจริง ๆ: ไม่มีทั้ง Network และไม่มีใน Cache เลย -> หน้า Offline
// ที่ถูก Precache ไว้ตั้งแต่ตอน build (ดู nuxt.config.ts -> nitro.prerender)
setCatchHandler(async ({ request }) => {
  if (request.mode === 'navigate') {
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

const gasCacheKeyPlugin: WorkboxPlugin = {
  async cacheKeyWillBeUsed({ request, mode }) {
    try {
      const body = await request.clone().text()
      const payload = JSON.parse(body) as Record<string, unknown>
      const action = String(payload.action ?? 'unknown')
      const idKey = String(payload.userId ?? payload.memberId ?? payload.lineUserId ?? '')
      const url = new URL(request.url)
      url.searchParams.set('__swAction', action)
      if (idKey) url.searchParams.set('__swId', idKey)
      // mode 'read' ใช้ตอนหา Cache เดิม, 'write' ใช้ตอนจะบันทึก Cache ใหม่ —
      // ใช้ Key เดียวกันทั้งคู่พอ (แค่ต้องการ URL คงที่ต่อ Action+ผู้ใช้)
      void mode
      return url.toString()
    } catch {
      // Body อ่าน/parse ไม่ได้ -> ใช้ Request เดิมไปเลย (จะไม่ match Cache ใด ๆ)
      return request
    }
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
    try {
      const body = await params.request.clone().text()
      action = String((JSON.parse(body) as Record<string, unknown>).action ?? '')
    } catch {
      // อ่าน body ไม่ได้ -> ถือว่าไม่ทราบ action ปฏิบัติแบบปลอดภัยที่สุด
      // (ไม่ Cache) ปล่อยผ่าน Network ตามปกติ
    }
    const handler = READ_ONLY_ACTIONS.has(action) ? apiNetworkFirst : apiNetworkOnly
    return handler.handle(params)
  },
  'POST',
)
