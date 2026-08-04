export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  app: {
    head: {
      title: 'Register',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      // ---- iOS "Add to Home Screen" ----
      // Safari ไม่อ่านค่า display/theme_color จาก web app manifest ครบทุกตัว
      // จึงต้องประกาศ meta/link เหล่านี้ตรง ๆ เพิ่มเติมจาก manifest.webmanifest
      // (ที่ @vite-pwa/nuxt สร้างให้อัตโนมัติจาก pwa.manifest ด้านล่าง)
      link: [
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
    prerender: {
      routes: ['/', '/offline', '/home', '/map', '/scan', '/profile', '/info', '/history', '/reservation'],
      failOnError: false,
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
      // (เพิ่ม 'webmanifest' — แก้ไขจุดนี้: เดิมไม่มีนามสกุลนี้ในลิสต์ ทำให้ไฟล์
      // manifest.webmanifest ที่ @vite-pwa/nuxt สร้างให้อัตโนมัติ ไม่ถูก Precache
      // ไปด้วย ถ้าเปิดแอปครั้งแรกตอนออฟไลน์ (หรือเน็ตหลุดกลางทาง) ไฟล์นี้จะขาด
      // หายไปจาก Cache ทำให้ "Add to Home Screen"/PWA metadata บางส่วนไม่ครบ)
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,webmanifest}'],
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
