# PWA — สรุปสิ่งที่เพิ่มเข้ามา

ไม่มีการแก้ไข UI/Component เดิมแม้แต่ไฟล์เดียว และไม่แตะ Logic เดิมของ
`useAuth.ts` / `useProfile.ts` / `useOfflineSync.ts` / `useMemberApi.ts` เลย
— ของใหม่ทั้งหมดคือไฟล์เพิ่มเติม บวกกับการเติมค่า config ใน `nuxt.config.ts`
เท่านั้น

## ทำไมต้องเขียน Service Worker เอง (injectManifest) แทนโหมด Auto (generateSW)

API หลักของแอปนี้คือ Google Apps Script Web App ตัวเดียว เรียกด้วย **POST**
ทุก action (`checkMember` / `register` / `login` / `checkin` / `getMember` /
`getJourney` / `getScore` ฯลฯ — ดู `composables/useMemberApi.ts`) แต่
Cache Storage API มาตรฐานของเบราว์เซอร์ **เก็บ Request ที่เป็น POST ไม่ได้**
(Spec บังคับ throw TypeError) ทำให้ `runtimeCaching` แบบอัตโนมัติของโหมด
`generateSW` ใช้กับ API นี้ไม่ได้เลย จึงเลือกโหมด `injectManifest` เพื่อเขียน
Service Worker เอง (`service-worker/sw.ts`) และคุม Cache Key ของ POST เองผ่าน
`cacheKeyWillBeUsed` (แปลง POST เป็น Cache Key แบบ GET URL ปลอมโดยอิง
`action` + user id ที่อยู่ใน body แทน)

## ไฟล์ใหม่ที่เพิ่มเข้ามา

| ไฟล์ | เหตุผล |
|---|---|
| **`service-worker/sw.ts`** | Service Worker หลัก คุม Cache Strategy ทั้งหมดตามสเปก: HTML = Network First (timeout 8s), JS/CSS = Stale While Revalidate, รูปภาพ (รวม Leaflet/OpenStreetMap map tiles) = Cache First, Font = Cache First, API = Network First เฉพาะ action ที่ "อ่านอย่างเดียว" (`getMember`/`getJourney`/`getScore`) ส่วน action ที่เขียนข้อมูล (`checkMember`/`register`/`login`/`loginByLine`/`updateMember`/`checkin`) เป็น **Network Only เสมอ** — เหตุผล: ถ้า Cache POST ที่มีผลข้างเคียงไว้ แล้วเสิร์ฟตอนออฟไลน์ แอปจะเข้าใจผิดว่าบันทึกสำเร็จทั้งที่ยังไม่ได้ส่งขึ้น Server จริง จึงปล่อยให้ Fail ตามปกติแล้วให้ระบบคิว `useOfflineSync.ts` ที่มีอยู่แล้วเดิมจัดการ Retry ต่อ (ดูหัวข้อถัดไป) — นอกจากนี้ยังมี: precache ไฟล์ Build ทั้งหมด, `cleanupOutdatedCaches()` กัน Cache รุ่นเก่าค้างหลัง Deploy, `self.skipWaiting()`/`clients.claim()` สำหรับ Auto Update, และ `setCatchHandler` ที่ Fallback ไปหน้า `/offline` เมื่อไม่มีอินเทอร์เน็ตและไม่เคย Cache หน้านั้นไว้เลย |
| **`pages/offline.vue`** | Offline Fallback Page — หน้า Static ล้วน ไม่พึ่งพา Store/Composable ใด ๆ (กันพังซ้อนตอนออฟไลน์จริง) ถูกตั้งให้ Prerender เป็นไฟล์ HTML แน่นอนผ่าน `nitro.prerender.routes` เพื่อให้ Service Worker Precache ไปใช้เป็น Fallback ได้ |
| **`app.vue`** (root) | โปรเจกต์เดิม**ไม่มี**ไฟล์นี้เลย (Nuxt ใช้ default ภายในให้เอง เทียบเท่า `<NuxtLayout><NuxtPage /></NuxtLayout>` ทุกประการ) — ต้องเพิ่มไฟล์นี้ขึ้นมา (คัดลอกพฤติกรรม default มาทั้งหมด ไม่เปลี่ยนอะไรเลย) เพียงเพื่อแทรก `<VitePwaManifest />` (Component จาก `@vite-pwa/nuxt`) ซึ่งจำเป็นต้องมีอยู่ใน App tree จริง ๆ ถึงจะฝัง `<link rel="manifest">` ให้ได้ — ไม่มีทางเลี่ยงอื่นที่ไม่แตะโครงสร้างเลย |
| **`plugins/pwa-update-notify.client.ts`** | ฟัง `$pwa.needRefresh` (มี Service Worker เวอร์ชันใหม่) แล้วแสดงแบนเนอร์แจ้งเตือนสั้น ๆ ก่อน Reload อัตโนมัติให้เอง (ไม่ต้องรอผู้ใช้กด) ตามสเปก "แจ้งผู้ใช้และ Reload อัตโนมัติ" และแจ้ง Toast สั้น ๆ ตอน `$pwa.offlineReady` (Cache ครบพร้อมใช้งานออฟไลน์ครั้งแรก) — สร้าง DOM เอง (vanilla) ไม่พึ่ง Component/Layout ของแอปเลย เพื่อไม่ให้กระทบ UI เดิมแม้แต่น้อย |
| **`public/pwa-192x192.png`, `public/pwa-512x512.png`** | ไอคอนแอปตามสเปก (192x192, 512x512) |
| **`public/pwa-maskable-192x192.png`, `public/pwa-maskable-512x512.png`** | ไอคอนแบบ Maskable (เผื่อขอบถูก Crop เป็นวงกลม/ทรงอื่นบน Android) |
| **`public/apple-touch-icon.png`** | ไอคอนสำหรับ iOS "Add to Home Screen" (180x180) |
| **`public/favicon.ico`, `public/favicon-64x64.png`** | Favicon |

ไอคอนทั้งหมด Generate ขึ้นใหม่ (ลาย Sprout สีเขียว `#5a9e33` ให้เข้ากับธีม
"ฟาร์มสดใส" เดิมของแอปตาม `assets/css/main.css`) เพราะโปรเจกต์เดิมไม่มีไฟล์
ไอคอนอยู่เลยแม้แต่ไฟล์เดียว

## ไฟล์ที่แก้ไข (เติมเพิ่มเท่านั้น ไม่ลบของเดิม)

| ไฟล์ | สิ่งที่เพิ่ม |
|---|---|
| **`nuxt.config.ts`** | เพิ่ม module `@vite-pwa/nuxt`, ตั้งค่า `pwa` (strategy `injectManifest`, `registerType: 'autoUpdate'`, manifest, devOptions ให้ทดสอบได้ตอน `npm run dev`), เพิ่ม `nitro.prerender.routes: ['/offline']`, เพิ่ม `meta`/`link` สำหรับ iOS Add to Home Screen (`apple-touch-icon`, `apple-mobile-web-app-capable` ฯลฯ) และ `theme-color` — ของเดิมทุกบรรทัด (`css`, `runtimeConfig`, `vite.server.allowedHosts`) ไม่ถูกแก้แม้แต่บรรทัดเดียว |
| **`package.json`** | เพิ่ม devDependencies: `@vite-pwa/nuxt`, `workbox-precaching`, `workbox-routing`, `workbox-strategies`, `workbox-expiration`, `workbox-cacheable-response`, `workbox-core` — ไม่แก้ dependencies เดิมเลย |

## Offline First / Background Sync — จงใจ "ไม่แตะ" ของเดิม

โจทย์ระบุให้ใช้ IndexedDB + Background Sync สำหรับข้อมูลที่ต้องส่งขึ้น Server
แต่โปรเจกต์นี้**มีระบบนี้อยู่แล้วสมบูรณ์** ใน `composables/useOfflineSync.ts`
+ `plugins/offline-sync.client.ts` (เก็บคิวใน LocalStorage + Sync อัตโนมัติ
ตอนกลับมาออนไลน์ผ่าน `window.addEventListener('online', ...)`) — ตัดสินใจ
**คงของเดิมไว้ทั้งหมด** โดยไม่ย้ายไป IndexedDB หรือ Background Sync API
ด้วยเหตุผล 2 ข้อ:

1. **Background Sync API (`SyncManager`) ไม่รองรับบน iOS Safari เลย** — ซึ่ง
   เป็นแพลตฟอร์มหลักที่โจทย์ต้องการให้ติดตั้งเป็นแอปได้ (Add to Home Screen)
   ระบบเดิมที่ใช้ `online` event แทน ใช้งานได้บนทุกแพลตฟอร์มรวม iOS PWA
   จึงเหมาะกับโจทย์นี้มากกว่า
2. **"ไม่ทำให้ฟังก์ชันเดิมเสีย"** — ระบบคิวเดิมทำงานถูกต้องสมบูรณ์อยู่แล้ว
   (มีการกันบันทึกซ้ำทั้งฝั่ง Client และ Server) การย้าย Storage Backend มี
   ความเสี่ยงสูงที่จะทำให้ Flow การเช็คอิน/Sync คะแนนที่ทดสอบแล้วพังโดยไม่มี
   ประโยชน์เพิ่มที่จำเป็นจริง ๆ

หน้าที่ของ Service Worker ในเรื่องนี้จึงจำกัดอยู่แค่ "Cache หน้าเว็บ/
Asset/ผลลัพธ์ API ที่อ่านอย่างเดียว ให้เปิดแอปได้ตอนออฟไลน์" ส่วนการเขียน
ข้อมูลขึ้น Server ทั้งหมดยังเป็นหน้าที่ของระบบคิวเดิม 100%

## ตรวจสอบแล้ว (Build จริง)

- `npm run build` ผ่าน — Precache 68 ไฟล์ (~1.5 MB): ทุกหน้า (Home/Map/
  History/Scan/Reservation/Info/Profile/Offline), JS/CSS ทั้งหมด, ไอคอน,
  manifest.webmanifest
- `<link rel="manifest">`, `<meta name="theme-color">`,
  `<link rel="apple-touch-icon">` ปรากฏใน SSR HTML จริงของทุกหน้า (ตรวจผ่าน
  `curl` กับ Nitro server ที่ build แล้ว)
- `/sw.js`, `/manifest.webmanifest`, `/offline`, ไอคอนทุกไฟล์ ตอบ HTTP 200
- `vue-tsc --noEmit` ไม่มี Type Error จากไฟล์ที่เพิ่ม/แก้ไขในงานนี้เลย
  (มี Error เดิมที่ไม่เกี่ยวข้องหลงเหลืออยู่ใน `LeafletMap.vue` /
  `MapCanvas.vue` / `StationMarker.vue` ซึ่งมีอยู่ก่อนแล้วในโปรเจกต์ ไม่ได้
  เกิดจากงานนี้ และไม่ได้แก้ไขตามขอบเขตงาน)

## อัปเดต — แก้ไอคอน PWA ไม่แสดง / ขึ้นไอคอนเริ่มต้นของ Browser

ตรวจสอบทั้งโปรเจกต์ (ไฟล์ไอคอนจริง, `manifest.webmanifest` ที่ build ออกมาจริง,
HTML `<head>` ที่ SSR ออกมาจริง, และ output สำหรับ deploy จริง) พบ 3 สาเหตุ
แก้ไขแบบเพิ่มเติม/เจาะจงเท่านั้น ไม่กระทบ Logic เดิม:

1. **`public/apple-touch-icon.png` มีพื้นหลังโปร่งใส + มุมโค้งฝังมาในรูปเอง**
   (ตรวจด้วยการอ่านค่า Alpha channel ที่มุมภาพ: `(0,0,0,0)` = โปร่งใสเต็มๆ)
   — iOS **ไม่รองรับความโปร่งใสใน apple-touch-icon** (Apple กำหนดไว้ชัดเจนว่า
   ต้องเป็นภาพสี่เหลี่ยมเต็มพื้นที่ ไม่มี Alpha เลย เพราะ iOS จะไปใส่มุมโค้ง/เงา
   ให้เองอัตโนมัติอยู่แล้ว) ถ้าส่งภาพที่มีมุมโค้ง+โปร่งใสไปเอง iOS จะ Render
   มุมที่โปร่งใสเป็นสีดำ/ผิดเพี้ยน หรือบางเวอร์ชันปฏิเสธไม่ใช้เลยแล้ว fallback
   เป็นภาพหน้าจอ (screenshot) แทน — **แก้โดย Generate ไฟล์ใหม่**: เอาลาย
   Sprout เดิม (จาก `pwa-512x512.png`) มา flatten พื้นหลังโปร่งใสให้เป็นสีเขียว
   ทึบ `#5a9e33` เต็มพื้นที่สี่เหลี่ยมจัตุรัส (ไม่มีมุมโค้ง ไม่มี Alpha) แล้ว resize
   เหลือ 180×180 ตามสเปก Apple เดิม — ลายภาพเหมือนเดิมทุกประการ เปลี่ยนแค่
   พื้นหลังให้ทึบ

2. **ไม่มี `<link rel="icon">` ระบุ Favicon ตรงๆ ใน `<head>` เลย** (ตรวจสอบด้วย
   `grep` บน HTML ที่ build จริง พบแค่ `apple-touch-icon` กับ `manifest` เท่านั้น)
   — แม้จะมีไฟล์ `favicon.ico`/`favicon-64x64.png` อยู่ใน `public/` แล้วก็ตาม
   Browser บางตัว (Firefox, Safari Desktop, Chrome บางเวอร์ชัน) ไม่ได้ Fallback
   ไปหา `/favicon.ico` ที่ root เองเสมอไปถ้าไม่มี `<link rel="icon">` ระบุตรงๆ
   ทำให้ Tab ขึ้นไอคอนเริ่มต้นของ Browser แทน — แก้โดยเพิ่ม `<link rel="icon">`
   2 บรรทัดใน `nuxt.config.ts` -> `app.head.link` (ชี้ไปที่ `favicon.ico` และ
   `favicon-64x64.png` สำหรับจอความละเอียดสูง)

3. **`manifest.webmanifest` เสี่ยงถูกตอบ Content-Type ผิดตอน Production
   (Cloudflare Pages)** — นามสกุล `.webmanifest` ไม่ใช่นามสกุลไฟล์มาตรฐานที่
   ทุก Static Host จะรู้จักเสมอไป ถ้า Host ตอบ Content-Type เป็น
   `application/octet-stream` แทนที่จะเป็น `application/manifest+json` ตามสเปก
   Chrome/Edge/Android จะ "เงียบๆ ไม่ยอมใช้" ไฟล์ Manifest นั้นเลย (ไม่มี Error
   ให้เห็นใน Console ด้วย) ผลคือกด "Add to Home Screen"/ติดตั้งเป็น PWA แล้ว
   ไอคอนที่กำหนดไว้ใน `icons[]` จะไม่ถูกใช้ ตกไปใช้ไอคอนเริ่มต้นแทน — ปัญหานี้
   จะไม่เกิดตอน `npm run dev`/`preview` บนเครื่อง (Nitro dev server รู้จัก
   นามสกุลนี้อยู่แล้ว) แต่เกิดได้จริงตอน Deploy ขึ้น Cloudflare Pages ขึ้นกับ
   mime-db เวอร์ชันที่ใช้ ณ ขณะนั้น ตรงกับอาการที่ใช้งานได้ปกติตอน Dev แต่ไม่
   แสดงไอคอนตอน Production พอดี — **แก้โดยเพิ่มไฟล์ `public/_headers` ใหม่**
   บังคับ `Content-Type: application/manifest+json` ให้กับ `/manifest.webmanifest`
   ตรงๆ (Cloudflare Pages อ่านไฟล์ชื่อ `_headers` จาก root ของ Output โดย
   อัตโนมัติเสมอตามเอกสารทางการ ไม่ต้องตั้งค่าเพิ่มที่ Dashboard) — ไฟล์นี้ถูก
   ก็อปจาก `public/` ไปที่ output ตรงๆ เหมือนไฟล์ static อื่นทุกไฟล์ ใช้ได้ทั้ง
   Deploy แบบ Static ล้วน (เอา `.output/public` ไป deploy ตรงๆ) และแบบตั้ง
   `NITRO_PRESET=cloudflare-pages` ตอน build (Nitro จะ merge กฎจากไฟล์นี้
   เข้ากับ `_headers` ที่ auto-generate ให้เองอีกที ไม่ทับกัน — ทดสอบแล้วทั้ง 2
   แบบ) — เผื่อไว้ด้วยกันเหนียว เพิ่ม `Cache-Control: immutable` ให้ไฟล์ไอคอน
   ทุกไฟล์ในตัวเดียวกันนี้เลย (ไอคอนพวกนี้แทบไม่เปลี่ยน ถ้าจะเปลี่ยนควรเปลี่ยน
   ชื่อไฟล์ใหม่อยู่แล้ว)

**จุดเล็กๆ ที่แก้ไปด้วยระหว่างตรวจ (ไม่ใช่สาเหตุหลัก แต่เจอระหว่างตรวจสอบ):**
`injectManifest.globPatterns` ใน `nuxt.config.ts` เอา `webmanifest` ออกจาก
ลิสต์นามสกุลที่ Scan เอง — เพราะ `@vite-pwa/nuxt` เติม `manifest.webmanifest`
เข้า Precache list ให้อัตโนมัติอยู่แล้วเสมอ (คนละกลไกกับ `globPatterns` ที่
Scan จากไฟล์ใน `public/` ตรงๆ) การมี `webmanifest` อยู่ในลิสต์ทั้งสองทาง
ทำให้ไฟล์เดียวกันถูก Precache ซ้ำ 2 รายการ (คนละต้นทาง ค่า url/revision
เดียวกัน — Workbox dedupe ให้เองตอน Runtime ไม่ได้ error แต่ก็ไม่มีประโยชน์
เพิ่ม) ตรวจสอบด้วย build จริงแล้วว่าหลังตัดออก `manifest.webmanifest` ยังถูก
Precache อยู่ปกติ เหลือแค่ 1 รายการเหมือนเดิม

**ตรวจสอบแล้ว (Build จริงหลังแก้ทั้งหมด):**
- `apple-touch-icon.png` ที่ output: RGB ล้วน (ไม่มี Alpha channel เลย) 180×180
- `<head>` มี `<link rel="icon" href="/favicon.ico">`,
  `<link rel="icon" ... href="/favicon-64x64.png">`,
  `<link rel="apple-touch-icon" ... href="/apple-touch-icon.png">`,
  `<link rel="manifest" href="/manifest.webmanifest">` ครบทุกหน้า
- `.output/public/_headers` มีกฎ `Content-Type: application/manifest+json`
  สำหรับ `/manifest.webmanifest` (ทดสอบแล้วว่าไฟล์นี้ถูกก็อปไป output จริง
  ทั้งตอน build ปกติและตอนตั้ง `NITRO_PRESET=cloudflare-pages`)
- `manifest.webmanifest` ที่ output มี icons ครบ 4 รายการ (192/512 `purpose:
  "any"` + 192/512 `purpose: "maskable"`) เหมือนเดิม ไม่ได้แก้ค่าพวกนี้เลย
  เพราะตรวจสอบแล้วว่าถูกต้องตามสเปกอยู่แล้ว (Maskable icon ทั้ง 2 ขนาดมีพื้น
  หลังทึบเต็มโดยไม่มี Alpha ที่ขอบอยู่แล้วตั้งแต่ต้น ตรงตามข้อกำหนด Maskable
  Icon — จุดที่พังจริงๆ มีแค่ apple-touch-icon เพียงไฟล์เดียว)
- Service Worker precache: ไอคอนทุกไฟล์ + `manifest.webmanifest` (ครั้งเดียว
  ไม่ซ้ำแล้ว) ยังอยู่ใน Precache list ปกติ
- `nuxt typecheck` ไม่มี Error ใหม่จากการแก้รอบนี้ (Error เดิมที่ไม่เกี่ยวข้อง
  ใน `LeafletMap.vue`/`MapCanvas.vue`/`StationMarker.vue` ยังคงอยู่เหมือนเดิม
  ไม่ได้เกิดจากงานนี้และไม่ได้อยู่ในขอบเขตงานที่ขอ)

## วิธีทดสอบ Offline จริง

1. `npm run build && npm run preview` (หรือ `node .output/server/index.mjs`)
2. เปิดเบราว์เซอร์ไปที่แอป กด "Add to Home Screen" / ติดตั้งเป็น App ได้ทันที
3. ไล่เปิดทุกหน้าอย่างน้อย 1 ครั้งตอนออนไลน์ (เพื่อให้ Network First
   ของหน้า HTML เก็บ Cache ไว้)
4. ปิดอินเทอร์เน็ต (DevTools > Network > Offline) แล้วรีเฟรช — ทุกหน้าที่เคย
   เปิดแล้วต้องใช้งานได้ตามปกติ, หน้าที่ไม่เคยเปิดมาก่อนจะเห็นหน้า `/offline`
5. `npm run build` ใหม่อีกรอบ (จำลอง Deploy เวอร์ชันใหม่) แล้วเปิดแอปเดิมค้าง
   ไว้ในเบราว์เซอร์ — ควรเห็นแบนเนอร์แจ้งเวอร์ชันใหม่แล้ว Reload ให้อัตโนมัติ
   ภายในไม่กี่วินาที
