/**
 * composables/useAuth.ts
 * ---------------------------------------------------------------------------
 * รวม Logic ทั้งหมดของระบบ Register/Auth ไว้ในที่เดียว
 *
 * แนวคิดการออกแบบ:
 * - LocalStorage เป็น "single source of truth" ของ uid ฝั่ง client (ยังไม่มี Database)
 * - การแลก LINE authorization code เป็น access token ต้องทำฝั่ง server เท่านั้น
 *   (เพราะต้องใช้ Channel Secret) จึงเรียกผ่าน server route "/api/auth/line-token"
 *   ที่มากับ Nuxt เอง (Nitro) — ไม่ใช่ backend แยก ไม่มี database
 * - แยก "การ login" (loginWithLine / completeLineLogin) ออกจาก "การจัดการ uid"
 *   (getUid/saveUid/logout) เพื่อให้ภายหลังสามารถสลับไปใช้ LIFF Login ได้
 *   โดยไม่ต้องแตะ logic ส่วนอื่นเลย (Dependency ไหลทางเดียว)
 * - ใช้ useState() ของ Nuxt เพื่อให้ state เป็น reactive และใช้ร่วมกันได้ทั้งแอป
 *   (SSR-safe) ส่วนการอ่าน/เขียนจริงลง LocalStorage จะทำเฉพาะฝั่ง client เท่านั้น
 */

import type { AuthState, LineTokenExchangeResult } from '~/types/auth'

const STORAGE_KEY = 'uid'
const STATE_KEY = 'line_oauth_state' // เก็บชั่วคราวใน sessionStorage เพื่อป้องกัน CSRF

/**
 * สร้าง uid ชั่วคราวจาก Unix Timestamp แบบ 10 หลัก
 * ห้ามใช้ Date.now() ตรง ๆ เพราะจะได้ 13 หลัก (มิลลิวินาที)
 * จึงต้องหารด้วย 1000 แล้วปัดเศษทิ้งด้วย Math.floor
 *
 * ใช้เป็น fallback กรณีที่ไม่ต้องการผูก LINE จริง (เช่น ตอนพัฒนา/ทดสอบ)
 */
function generateTemporaryUid(): string {
  return String(Math.floor(Date.now() / 1000))
}

export function useAuth() {
  // Global reactive state (SSR-safe) — ค่าเริ่มต้นเป็น null เสมอ
  // แล้วค่อย sync จาก LocalStorage ใน initAuth() ซึ่งทำงานบน client เท่านั้น
  const uid = useState<string | null>('auth-uid', () => null)
  const isRegistered = computed(() => !!uid.value)

  /**
   * อ่านค่า uid ปัจจุบันจาก LocalStorage (client only)
   */
  function getUid(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem(STORAGE_KEY)
  }

  /**
   * บันทึก uid ลง LocalStorage และอัปเดต reactive state
   */
  function saveUid(value: string): void {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, value)
    }
    uid.value = value
  }

  /**
   * เริ่มต้นตรวจสอบสถานะ Login เมื่อเปิดเว็บ
   * เรียกใช้ตอน mounted ของหน้า index.vue
   */
  function initAuth(): void {
    const existingUid = getUid()
    if (existingUid) {
      uid.value = existingUid
    }
  }

  /**
   * ขั้นตอนที่ 1: พาผู้ใช้ไปหน้า Login ของ LINE (OAuth ปกติผ่าน browser)
   * - สร้าง "state" แบบสุ่มเพื่อป้องกัน CSRF แล้วเก็บไว้ใน sessionStorage
   * - สร้าง URL ไป LINE authorize endpoint แล้ว redirect ทั้งหน้า
   *
   * TODO (Future Ready): หากเปลี่ยนไปใช้ LIFF ในอนาคต ให้แทนที่ function นี้ด้วย
   *   await liff.init({ liffId })
   *   if (!liff.isLoggedIn()) liff.login()
   * โดยยังคงหน้าที่เดิมคือ "เริ่มกระบวนการ login" และให้ completeLineLogin()
   * หรือ logic ที่ตามมาทำหน้าที่ดึง uid ต่อ โดยไม่ต้องแก้ pages/index.vue
   */
  function loginWithLine(): void {
    if (!import.meta.client) return

    const config = useRuntimeConfig()
    const state = crypto.randomUUID()
    sessionStorage.setItem(STATE_KEY, state)

    const authorizeUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
    authorizeUrl.searchParams.set('response_type', 'code')
    authorizeUrl.searchParams.set('client_id', config.public.lineChannelId)
    authorizeUrl.searchParams.set('redirect_uri', config.public.lineRedirectUri)
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('scope', 'profile openid')

    window.location.href = authorizeUrl.toString()
  }

  /**
   * ขั้นตอนที่ 2: เรียกหลังจาก LINE redirect กลับมาที่หน้า Callback พร้อม
   * query "code" และ "state" — ตรวจสอบ state ว่าตรงกับที่เก็บไว้หรือไม่
   * แล้วส่ง code ไปแลก access token + profile ผ่าน server route
   * เมื่อสำเร็จจะได้ LINE UID จริง (เช่น U123456789ABCDEFG) แล้วบันทึกลง LocalStorage
   */
  async function completeLineLogin(code: string, state: string): Promise<string> {
    if (import.meta.client) {
      const savedState = sessionStorage.getItem(STATE_KEY)
      sessionStorage.removeItem(STATE_KEY)
      if (!savedState || savedState !== state) {
        throw new Error('Invalid state: possible CSRF or expired session')
      }
    }

    const result = await $fetch<LineTokenExchangeResult>('/api/auth/line-token', {
      method: 'POST',
      body: { code },
    })

    saveUid(result.uid)
    return result.uid
  }

  /**
   * ทางเลือกสำรอง: สร้าง uid ชั่วคราวโดยไม่ผ่าน LINE จริง
   * (เผื่อกรณีทดสอบ หรือยังไม่พร้อมเชื่อม LINE Login)
   */
  function registerAsGuest(): string {
    const newUid = generateTemporaryUid()
    saveUid(newUid)
    return newUid
  }

  /**
   * ลบข้อมูล Login ออกจาก LocalStorage และรีเซ็ต state
   * เพื่อกลับสู่หน้า Register
   */
  function logout(): void {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
    uid.value = null
  }

  const state = computed<AuthState>(() => ({
    uid: uid.value,
    isRegistered: isRegistered.value,
  }))

  return {
    // state
    uid: readonly(uid),
    isRegistered,
    state,
    // actions
    initAuth,
    loginWithLine,
    completeLineLogin,
    registerAsGuest,
    getUid,
    saveUid,
    logout,
  }
}
