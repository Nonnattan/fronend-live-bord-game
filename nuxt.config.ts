export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],

  fonts: {
  providers: {
    google: false,
  },
},

  app: {
    head: {
      title: 'Register',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      // ---- Favicon + iOS "Add to Home Screen" ----
      // แก้ไขจุดนี้ (PWA Icon Fix): เดิมมีแค่ apple-touch-icon อย่างเดียว ไม่มี
      // <link rel="icon"> ระบุตรง ๆ เลยสักบรรทัด ทำให้บาง Browser (โดยเฉพาะ
      // Firefox/Safari desktop และบางเวอร์ชันของ Chrome) ไม่ยอม fallback ไปหา
      // /favicon.ico ที่ root เองเสมอไป (พฤติกรรมนี้ไม่ได้มาตรฐานบังคับ) จึงขึ้น
      // เป็นไอคอนเริ่มต้นของ Browser แทนที่ Tab จนกว่าจะประกาศ <link rel="icon">
      // ตรง ๆ — เพิ่ม favicon.ico (ทุก browser เก่า/ใหม่) และ favicon-64x64.png
      // (ความละเอียดสูงกว่าสำหรับจอ Retina/HiDPI) เข้าไปทั้งคู่
      // ส่วน Safari ไม่อ่านค่า display/theme_color จาก web app manifest ครบทุก
      // ตัว จึงต้องประกาศ meta/link เหล่านี้ตรง ๆ เพิ่มเติมจาก manifest.webmanifest
      // (ที่ @vite-pwa/nuxt สร้างให้อัตโนมัติจาก pwa.manifest ด้านล่าง)
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64x64.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#5a9e33' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Register App' },
      ],
    },
  },
  // Prerender หน้าเปลือก (Shell) ของทุกหน้าในแอปให้เป็นไฟล์ static เสมอ (แก้ไข
  // จุดนี้ — เดิมมีแค่ '/offline' หน้าเดียว) เพื่อให้ Service Worker precache เป็น
  // ไฟล์ HTML จริงตั้งแต่ตอน build (ผ่าน injectManifest -> self.__WB_MANIFEST)
  // ไม่ต้องรอให้ผู้ใช้เข้าแต่ละหน้าตอนออนไลน์ก่อนถึงจะถูก Cache แบบเดิม (ที่พึ่ง
  // NetworkFirst runtime caching ของ html-cache ใน service-worker/sw.ts เพียง
  // อย่างเดียว) — ทุกหน้าปลอดภัยที่จะ Prerender เพราะ Logic ที่ต้องพึ่ง Browser
  // จริง ๆ (LocalStorage/LIFF/Leaflet/html5-qrcode) ทั้งหมดอยู่หลัง
  // `import.meta.client` guard หรือถูกเรียกใน onMounted()/dynamic import()
  // เท่านั้น ไม่มีการแตะ window/document ที่ top-level ของ <script setup> เลย
  // สักหน้า (ตรวจสอบแล้วทุกไฟล์ใน pages/) — เนื้อหาจริงที่ Prerender ได้จะเป็น
  // แค่ Loading Shell เปล่า ๆ (เพราะ useRequireProfile()/useAdventure() ฯลฯ
  // อ่านค่าจริงจาก LocalStorage ใน onMounted() ฝั่ง client เท่านั้น) แล้วให้
  // Client เข้าไป Hydrate ต่อตามปกติเหมือนตอนออนไลน์ทุกประการ
  nitro: {
    // แก้ไขจุดนี้ (Cloudflare Pages Preset Mismatch — สาเหตุหลักของปัญหา
    // "ออฟไลน์แล้วขึ้นหน้าไดโนเสาร์"): เดิมไม่ได้ตั้งค่า `preset` เลย ทำให้
    // Nitro ใช้ค่า default 'node-server' เสมอไม่ว่าจะ build ที่ไหน — ตอน
    // Deploy ขึ้น Cloudflare Pages จริง ถ้า Dashboard ตั้ง "Framework preset:
    // Nuxt" ไว้ (ค่าที่ Cloudflare แนะนำ/ตั้งอัตโนมัติให้เอง) Cloudflare จะ Inject
    // ตัวแปรแวดล้อม `CF_PAGES=1` เข้ามาตอน Build แต่ตัว Nuxt/Nitro เอง**ไม่ได้
    // อ่านค่านี้มาเปลี่ยน preset ให้อัตโนมัติ** ต้องตั้งเองใน nuxt.config.ts
    // เท่านั้น — ผลคือ Build จริงบน Cloudflare ก็ยังได้ output แบบ 'node-server'
    // (โฟลเดอร์ .output/public + .output/server สำหรับรัน Node.js) ซึ่ง
    // Cloudflare Pages (Static/Edge hosting เท่านั้น ไม่มี Node.js runtime ให้)
    // เอาไปใช้ตรง ๆ ไม่ได้เต็มรูปแบบ — ต้องแปลงเป็น Cloudflare Worker
    // (`_worker.js`) ก่อน ผ่าน preset 'cloudflare-pages' หรือ 'cloudflare_pages'
    // เท่านั้น ไม่งั้น Routing/Header/แม้แต่การเสิร์ฟ sw.js ที่ Edge อาจไม่ตรงกับ
    // ที่ทดสอบไว้ตอน Dev (อาการ "หน้าแรกออนไลน์ใช้ได้ปกติ" แต่ "ปิดเน็ตแล้วเปิด
    // ใหม่พังเป็นหน้า Chrome เอง" ตรงกับเคสนี้พอดี เพราะ Service Worker/Cache
    // อาจไม่ได้ถูก Deploy ไปที่ Edge ในรูปแบบที่ถูกต้องตามที่ตั้งใจ)
    // แก้โดยเช็ค `CF_PAGES` (ตัวแปรที่ Cloudflare Pages Inject ให้เองเสมอเวลา
    // Build จริงบน Cloudflare — ดูเอกสาร Cloudflare Pages) แล้วค่อยสลับไปใช้
    // preset 'cloudflare-pages' เฉพาะตอน Build บน Cloudflare เท่านั้น — ตอน
    // Build บนเครื่อง (`npm run build`/`npm run preview` ปกติ) ยัง fallback
    // เป็น 'node-server' เหมือนเดิมทุกประการ ไม่กระทบ Flow ทดสอบเดิม
    preset: process.env.NITRO_PRESET || (process.env.CF_PAGES ? 'cloudflare-pages' : undefined),
    prerender: {
      routes: ['/', '/offline', '/home', '/map', '/scan', '/profile', '/info', '/history', '/reservation'],
      failOnError: false,
      // Crawl ลิงก์จากหน้าที่ Prerender ไว้ต่อเองด้วย (กันตกหล่นถ้ามีหน้าใหม่
      // ถูกเพิ่มมาทีหลังแล้วลืมเติมใน routes ด้านบน) ไม่กระทบของเดิมเพราะทุก
      // Route หลักอยู่ใน List แล้วอยู่ดี แค่เพิ่มความปลอดภัย
      crawlLinks: true,
    },
  },
  // ---------------------------------------------------------------------
  // PWA (@vite-pwa/nuxt -> vite-plugin-pwa -> Workbox)
  // ---------------------------------------------------------------------
  // ใช้ strategy 'injectManifest' (ไม่ใช่ 'generateSW' ค่า default) เพราะ API
  // หลักของแอปนี้ (Google Apps Script) รับเฉพาะ POST ที่ Cache Storage มาตรฐาน
  // เก็บให้ไม่ได้ (รองรับแค่ GET) — ต้องเขียน Service Worker เองใน
  // service-worker/sw.ts เพื่อคุม Cache Strategy ของ API แบบละเอียด (อ่านอย่าง
  // เดียว cache ได้, เขียน/บันทึกข้อมูลปล่อยผ่านเสมอให้ระบบคิว Offline เดิม
  // (useOfflineSync.ts) จัดการ) ดูรายละเอียดเหตุผลเต็ม ๆ ในไฟล์ sw.ts
  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    // ให้ Service Worker ทำงานได้ตอน `npm run dev` ด้วย เพื่อให้ทดสอบ
    // Offline/Cache ได้จริงระหว่างพัฒนา ไม่ต้อง build ทุกครั้ง
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true,
    },
    injectManifest: {
      // ไฟล์ที่ต้อง Precache ตอน build: หน้าเว็บ (HTML), JS/CSS ที่ Build แล้ว,
      // Font, ไอคอน/รูปภาพ static ทั้งหมดใน public/ ตามที่โจทย์ระบุ
      // หมายเหตุ: ไม่ต้องใส่ 'webmanifest' ในลิสต์นี้เอง — @vite-pwa/nuxt เติม
      // manifest.webmanifest เข้า precache list ให้อัตโนมัติอยู่แล้วเสมอ (คนละ
      // ขั้นตอนกับ globPatterns ที่ scan จาก public/ ตรงนี้) เคยลองใส่ 'webmanifest'
      // เพิ่มเข้ามาด้วยมาก่อน (รอบแก้ไขก่อนหน้า) แต่ตรวจสอบแล้วพบว่าทำให้
      // manifest.webmanifest ถูก precache ซ้ำ 2 รายการ (คนละต้นทาง ค่า
      // revision/url เดียวกัน — Workbox ไม่ error เพราะ dedupe ให้เองตอน runtime
      // แต่ก็ไม่มีประโยชน์ เปลืองพื้นที่ Cache โดยไม่จำเป็น) แก้โดยตัด 'webmanifest'
      // ออกจาก globPatterns กลับ — manifest.webmanifest ยังถูก precache อยู่
      // ครบเหมือนเดิมทุกประการ (ตรวจสอบด้วย build จริงแล้ว เหลือแค่ 1 รายการ)
      // เพิ่ม jpg/jpeg/webp/gif เข้าไปด้วย (แก้ไขจุดนี้ — เดิมมีแค่ png/svg)
      // เผื่ออนาคตมีการเพิ่มรูปภาพฟอร์แมตอื่นใน public/ ที่ต้องถูก Precache
      // ด้วย ไม่กระทบไฟล์ปัจจุบันที่มีอยู่ (ยังเป็น png ทั้งหมดเหมือนเดิม)
      globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,webp,gif,svg,woff,woff2,json}'],
      globIgnores: ['**/node_modules/**/*'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
    manifest: {
      id: '/',
      name: 'Register App - Farm Adventure',
      short_name: 'Register App',
      description: 'เกมผจญภัยฟาร์ม สแกน QR เก็บฐาน สะสมแต้ม เชื่อม LINE Login',
      lang: 'th',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#fff8e6',
      theme_color: '#5a9e33',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/pwa-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
  },
  runtimeConfig: {
    // ---- Public: ใช้ได้ทั้ง client และ server ----
    public: {
      // LIFF ID จาก LINE Developers Console > ช่องแชนแนล LINE Login > แท็บ LIFF
      // ไม่มี Channel Secret อยู่ในโปรเจกต์นี้อีกต่อไป เพราะ LIFF SDK ทำงานฝั่ง
      // client ล้วน ๆ (liff.login() + liff.getProfile()) ไม่ต้องแลก token ผ่าน
      // server เอง เหมือน OAuth redirect แบบเดิม
      liffId: process.env.LIFF_ID || '',
      // Web App URL ของ Google Apps Script (ลงท้ายด้วย /exec)
      // ดูวิธี deploy ได้ที่ server-gas/README.md
      apiBaseUrl: process.env.API_BASE_URL || '',
    },
  },
vite: {
  server: {
    allowedHosts: true,
  },
},
})
