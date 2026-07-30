export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Register',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
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
