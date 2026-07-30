/**
 * composables/useAuth.ts
 * ---------------------------------------------------------------------------
 * Logic ทั้งหมดของ Step 1 (หน้า Welcome): ผู้ใช้เลือก
 *   1) เข้าสู่ระบบด้วย LINE (ผ่าน LIFF SDK จริง)
 *   2) เข้าใช้งานโดยไม่เชื่อม LINE (Guest) -> สร้าง Anonymous ID จาก Unix Timestamp
 *
 * ต่างจากเวอร์ชันเดิม: จะ "ไม่มี" uid ใด ๆ ถูกสร้างขึ้นเองอัตโนมัติตอนเปิดเว็บอีกต่อไป
 * ผู้ใช้ต้องกดปุ่มเลือกวิธีก่อนเสมอ (ยกเว้นกรณี localStorage มี authData/userProfile
 * เดิมอยู่แล้วจากการใช้งานครั้งก่อน หรือกำลังถูก LINE redirect กลับมาหลัง login)
 *
 * LocalStorage เป็น single source of truth ฝั่ง client (ยังไม่มี Database)
 * - key "authData"    : ผลลัพธ์ Step 1 (ชั่วคราว จนกว่าจะกรอกฟอร์มโปรไฟล์เสร็จ)
 * - key "userProfile" : ผลลัพธ์สุดท้ายหลังกรอกฟอร์ม (ดูแลใน useProfile.ts)
 */

import type { AuthData, LiffProfileResult, LoginType } from '~/types/auth'

const STORAGE_KEY = 'authData'

/**
 * สร้าง Anonymous ID จาก Unix Timestamp แบบ 10 หลัก (วินาที ไม่ใช่มิลลิวินาที)
 * ตามสเปก เช่น 1722305521
 */
function generateTemporaryUid(): string {
  return String(Math.floor(Date.now() / 1000))
}

/**
 * โหลด LIFF SDK แบบ dynamic import เท่านั้น (ห้าม import ตรง ๆ ที่หัวไฟล์)
 * เพราะ @line/liff แตะ `window` ทันทีที่ import ซึ่งจะทำให้ SSR พัง
 */
async function loadLiff() {
  const liffModule = await import('@line/liff')
  return liffModule.default
}

export function useAuth() {
  // Global reactive state (SSR-safe) — ค่าเริ่มต้นเป็น null เสมอ
  // แล้วค่อย sync จาก LocalStorage / LIFF ใน initAuth() ซึ่งทำงานฝั่ง client เท่านั้น
  const authData = useState<AuthData | null>('auth-data', () => null)
  const hasAuth = computed(() => !!authData.value)
  const isAnonymous = computed(() => authData.value?.loginType === 'guest')

  // สถานะ UI เฉพาะตอนกำลังคุยกับ LIFF (แสดง loading/error บนปุ่ม "เข้าสู่ระบบด้วย LINE")
  const isLineLoading = useState<boolean>('auth-line-loading', () => false)
  const lineError = useState<string>('auth-line-error', () => '')

  function getStoredAuth(): AuthData | null {
    if (!import.meta.client) return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthData
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  }

  function persistAuth(data: AuthData): void {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    authData.value = data
  }

  function buildAuthDataFromLiff(profile: LiffProfileResult, loginType: LoginType = 'line'): AuthData {
    return {
      loginType,
      uid: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    }
  }

  /**
   * เรียกครั้งเดียวตอน mounted ของหน้าแรก (ก่อนตัดสินใจว่าจะแสดงหน้าไหน)
   *
   * 1) มี authData เดิมอยู่แล้ว (เคยเลือกวิธีเข้าใช้งานไปแล้ว แต่ยังกรอกฟอร์มไม่เสร็จ
   *    หรือมี userProfile ครบแล้ว) -> ใช้ค่าเดิม ไม่ต้องยุ่งกับ LIFF เลย (เร็ว)
   * 2) ไม่มี -> อาจเป็นเพราะเพิ่งกด "เข้าสู่ระบบด้วย LINE" แล้วถูก liff.login()
   *    redirect ออกไปเข้า LINE และกำลังถูก redirect กลับมาที่หน้าเดิมพอดี
   *    -> ต้อง init LIFF เพื่อเช็ค liff.isLoggedIn() แล้วดึงโปรไฟล์ให้อัตโนมัติ
   *    ถ้าไม่ใช่กรณีนี้ (เปิดเว็บครั้งแรกจริง ๆ) จะไม่ login และปล่อยผ่านไปแสดง
   *    หน้า Welcome ให้ผู้ใช้กดเลือกเองตามปกติ
   */
  async function initAuth(): Promise<void> {
    const stored = getStoredAuth()
    if (stored) {
      authData.value = stored
      return
    }

    if (!import.meta.client) return

    const config = useRuntimeConfig()
    if (!config.public.liffId) return // ยังไม่ได้ตั้งค่า LIFF ID (เช่น ตอน dev เริ่มต้น) ข้ามไปเลย

    try {
      const liff = await loadLiff()
      await liff.init({ liffId: config.public.liffId })
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile()
        persistAuth(buildAuthDataFromLiff(profile))
      }
    } catch {
      // init/getProfile ล้มเหลว (เช่น เปิดนอกแอป LINE ไม่มี network หรือ liffId ผิด)
      // ปล่อยผ่านเงียบ ๆ — ผู้ใช้ยังกดปุ่ม Guest เพื่อใช้งานต่อได้ตามปกติ
    }
  }

  /**
   * Step 1 — กด "เข้าสู่ระบบด้วย LINE"
   * - init LIFF แล้วเช็คว่า login อยู่แล้วหรือยัง
   * - ยังไม่ login -> liff.login() ซึ่งจะ redirect ทั้งหน้าออกไปที่ LINE ทันที
   *   (พอ login เสร็จ LINE จะ redirect ผู้ใช้กลับมาที่ URL เดิมของ LIFF app เอง
   *   ไม่ต้องมี callback route แยก — initAuth() ด้านบนจะดักจับตอนโหลดหน้าใหม่)
   * - login อยู่แล้ว (เช่น เปิดผ่าน LINE app ที่ login ค้างไว้) -> ดึงโปรไฟล์ได้ทันที
   */
  async function loginWithLine(): Promise<void> {
    if (!import.meta.client) return

    const config = useRuntimeConfig()
    if (!config.public.liffId) {
      lineError.value = 'ยังไม่ได้ตั้งค่า LIFF ID กรุณาตั้งค่า NUXT_PUBLIC_LIFF_ID'
      return
    }

    isLineLoading.value = true
    lineError.value = ''
    try {
      const liff = await loadLiff()
      await liff.init({ liffId: config.public.liffId })

      if (!liff.isLoggedIn()) {
        liff.login()
        return // หน้าเว็บกำลังจะถูก redirect ออกไป ไม่ต้องทำอะไรต่อจากตรงนี้
      }

      const profile = await liff.getProfile()
      persistAuth(buildAuthDataFromLiff(profile))
    } catch (err) {
      lineError.value = err instanceof Error ? err.message : 'เข้าสู่ระบบด้วย LINE ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
    } finally {
      isLineLoading.value = false
    }
  }

  /**
   * Step 1 — กด "เข้าใช้งานโดยไม่เชื่อม LINE"
   * สร้าง Anonymous ID จาก Unix Timestamp 10 หลักทันที ไม่ต้องเปิด LINE Login เลย
   */
  function loginAsGuest(): void {
    persistAuth({
      loginType: 'guest',
      uid: generateTemporaryUid(),
    })
  }

  /** ล้าง authData ออกจาก LocalStorage (ไว้ใช้ตอนทดสอบ / reset ทั้ง flow) */
  function resetAuth(): void {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
    authData.value = null
  }

  return {
    // state
    authData: readonly(authData),
    hasAuth,
    isAnonymous,
    isLineLoading: readonly(isLineLoading),
    lineError: readonly(lineError),
    // actions
    initAuth,
    loginWithLine,
    loginAsGuest,
    resetAuth,
  }
}
