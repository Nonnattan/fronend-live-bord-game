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
})
