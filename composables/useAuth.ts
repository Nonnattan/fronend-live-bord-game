/**
 * composables/useAuth.ts
 * ---------------------------------------------------------------------------
 * รวม Logic ทั้งหมดของระบบ Register/Auth ไว้ในที่เดียว
 *
 * แนวคิดการออกแบบ:
 * - LocalStorage เป็น "single source of truth" ของ uid ในตอนนี้ (ยังไม่มี Backend)
 * - แยก "การ login" (mockLineLogin) ออกจาก "การจัดการ uid" (getUid/saveUid/logout)
 *   เพื่อให้ภายหลังสามารถเปลี่ยน mockLineLogin() เป็น LIFF Login จริง
 *   ได้โดยไม่ต้องแตะ logic ส่วนอื่นเลย (Dependency ไหลทางเดียว)
 * - ใช้ useState() ของ Nuxt เพื่อให้ state เป็น reactive และใช้ร่วมกันได้ทั้งแอป
 *   (SSR-safe) ส่วนการอ่าน/เขียนจริงลง LocalStorage จะทำเฉพาะฝั่ง client เท่านั้น
 */

import type { AuthState, LineUid } from '~/types/auth'

const STORAGE_KEY = 'uid'

/**
 * จำลอง LINE Login
 *
 * TODO (Future Ready): แทนที่ function นี้ด้วย LIFF Login จริง เช่น
 *   const profile = await liff.getProfile()
 *   return profile.userId
 * โดยยังคง return type เป็น LineUid (string | null) เหมือนเดิม
 * ทำให้ logic ใน register() ไม่ต้องแก้ไขใด ๆ ทั้งสิ้น
 */
function mockLineLogin(): LineUid {
  // ปรับค่านี้เพื่อจำลอง 2 กรณี:
  // - มี LINE UID:   const lineUid: LineUid = 'U123456789ABCDEFG'
  // - ไม่มี LINE UID: const lineUid: LineUid = null
  const lineUid: LineUid = null
  return lineUid
}

/**
 * สร้าง uid ชั่วคราวจาก Unix Timestamp แบบ 10 หลัก
 * ห้ามใช้ Date.now() ตรง ๆ เพราะจะได้ 13 หลัก (มิลลิวินาที)
 * จึงต้องหารด้วย 1000 แล้วปัดเศษทิ้งด้วย Math.floor
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
   * กระบวนการ Register หลัก
   * 1) เรียก mockLineLogin() (ในอนาคตคือ LIFF Login)
   * 2) ถ้ามี LINE UID -> ใช้ค่านั้นเลย
   *    ถ้าไม่มี -> สร้าง uid ชั่วคราวจาก Unix Timestamp
   * 3) บันทึกลง LocalStorage ผ่าน saveUid()
   */
  function register(): string {
    const lineUid = mockLineLogin()
    const newUid = lineUid ?? generateTemporaryUid()
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
    register,
    getUid,
    saveUid,
    logout,
  }
}
