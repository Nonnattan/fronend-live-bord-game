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
    // ---- Server-only: ห้ามหลุดไปถึง client เด็ดขาด ----
    lineChannelSecret: process.env.LINE_CHANNEL_SECRET || '',
    // ---- Public: ใช้ได้ทั้ง client และ server ----
    public: {
      lineChannelId: process.env.LINE_CHANNEL_ID || '',
      // ไม่มี fallback เป็น localhost เพราะ LINE ไม่ยอมรับ http://
      // ต้องตั้งค่า LINE_REDIRECT_URI ใน .env เป็น https (ดู .env.example)
      lineRedirectUri: process.env.LINE_REDIRECT_URI || '',
    },
  },
  vite: {
    server: {
      // Vite บล็อก host แปลกปลอมโดย default (dev server security)
      // ".ngrok-free.app" คือ wildcard อนุญาตทุก subdomain แบบสุ่มของ ngrok
      // (เปลี่ยนใหม่ทุกครั้งที่เปิด ngrok ใหม่ แต่ domain หลักเหมือนเดิม)
      allowedHosts: ['.ngrok-free.app'],
    },
  },
})
