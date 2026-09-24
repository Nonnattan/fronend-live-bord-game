/**
 * plugins/pwa-update-notify.client.ts
 * ---------------------------------------------------------------------------
 * แจ้งเตือนผู้ใช้เมื่อมี Service Worker เวอร์ชันใหม่พร้อมใช้งาน (needRefresh)
 * แล้วสั่งอัปเดต + Reload หน้าให้อัตโนมัติ ตามสเปก "เมื่อมี Version ใหม่ให้
 * แจ้งผู้ใช้และ Reload อัตโนมัติ" — และแจ้งสั้น ๆ เมื่อพร้อมใช้งานออฟไลน์แล้ว
 * (offlineReady) ครั้งแรกที่ Service Worker Cache ข้อมูลครบ
 *
 * ตั้งใจไม่ใช้ Component/Layout ใด ๆ ของแอป (สร้าง DOM เองล้วน ๆ) เพื่อไม่ให้
 * กระทบ UI เดิมแม้แต่น้อย และทำงานได้แน่นอนไม่ว่าอยู่หน้าไหนของแอป
 * (`$pwa` มาจาก @vite-pwa/nuxt โดยอัตโนมัติ ดู nuxt.config.ts -> pwa)
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const maybePwa = (nuxtApp as unknown as { $pwa?: Record<string, any> }).$pwa
    if (!maybePwa) return
    const pwa: Record<string, any> = maybePwa

    let banner: HTMLElement | null = null

    function removeBanner() {
      banner?.remove()
      banner = null
    }

    function showUpdateBanner() {
      if (banner) return
      banner = document.createElement('div')
      banner.setAttribute(
        'style',
        'position:fixed;left:50%;bottom:1.25rem;transform:translateX(-50%);'
          + 'z-index:2147483647;max-width:92vw;width:360px;'
          + 'background:#4a2f18;color:#fff8e6;border-radius:14px;'
          + 'box-shadow:0 10px 30px rgba(0,0,0,.35);'
          + 'padding:.85rem 1rem;display:flex;align-items:center;gap:.75rem;'
          + 'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;'
          + 'font-size:.85rem;line-height:1.4;',
      )

      const text = document.createElement('span')
      text.textContent = 'มีเวอร์ชันใหม่ของแอป กำลังอัปเดตให้อัตโนมัติ...'
      text.style.flex = '1'

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = 'อัปเดตตอนนี้'
      btn.setAttribute(
        'style',
        'background:#5a9e33;color:#fff;border:none;border-radius:999px;'
          + 'padding:.45rem .9rem;font-weight:600;font-size:.8rem;cursor:pointer;'
          + 'white-space:nowrap;',
      )
      btn.addEventListener('click', () => {
        removeBanner()
        pwa.updateServiceWorker?.()
      })

      banner.append(text, btn)
      document.body.appendChild(banner)

      // ไม่ต้องรอผู้ใช้กด — อัปเดต + Reload ให้อัตโนมัติหลังแจ้งเตือนสั้น ๆ
      window.setTimeout(() => {
        if (!banner) return
        removeBanner()
        pwa.updateServiceWorker?.()
      }, 3000)
    }

    function showOfflineReadyToast() {
      const toast = document.createElement('div')
      toast.textContent = '✓ พร้อมใช้งานแบบออฟไลน์แล้ว'
      toast.setAttribute(
        'style',
        'position:fixed;left:50%;bottom:1.25rem;transform:translateX(-50%);'
          + 'z-index:2147483647;background:#457a26;color:#fff;border-radius:999px;'
          + 'padding:.6rem 1.1rem;font-size:.8rem;font-weight:600;'
          + 'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;'
          + 'box-shadow:0 8px 24px rgba(0,0,0,.25);',
      )
      document.body.appendChild(toast)
      window.setTimeout(() => toast.remove(), 3500)
    }

    watch(() => pwa.needRefresh, (val) => { if (val) showUpdateBanner() }, { immediate: true })
    watch(() => pwa.offlineReady, (val) => { if (val) showOfflineReadyToast() }, { immediate: true })
  })
})
