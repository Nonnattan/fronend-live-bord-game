/**
 * composables/useProfile.ts
 * ---------------------------------------------------------------------------
 * Logic การจัดการ "โปรไฟล์ผู้ใช้" (Step 2 — ฟอร์มกรอกข้อมูล) แยกออกจาก
 * useAuth() อย่างชัดเจน:
 * - useAuth()    ดูแล Step 1: "ผู้ใช้เลือกเข้าใช้งานวิธีไหน + ได้ uid อะไรมา"
 * - useProfile() ดูแล Step 2: "ผู้ใช้คนนั้นกรอกข้อมูลอะไรไว้บ้าง" แล้วรวมเข้ากับ
 *   authData ของ Step 1 เป็น UserProfile ตัวเดียวจบ
 *
 * LocalStorage เป็น single source of truth (ยังไม่มี Database) — เก็บภายใต้
 * key "userProfile" เป็น object เดียวจบ ไม่กระจาย key ย่อย
 */

import type { AuthData } from '~/types/auth'
import type { ProfileFormValues, UserProfile } from '~/types/profile'
import type { MemberRecord } from '~/composables/useMemberApi'

const STORAGE_KEY = 'userProfile'
// ต้องตรงกับ key ที่ useAuth.ts ใช้เก็บ authData ชั่วคราว เพื่อล้างทิ้งหลังรวมข้อมูลสำเร็จ
const AUTH_STORAGE_KEY = 'authData'

export function useProfile() {
  // Global reactive state (SSR-safe) — sync จริงจาก LocalStorage ใน initProfile()
  const profile = useState<UserProfile | null>('user-profile', () => null)
  const hasProfile = computed(() => !!profile.value)

  /**
   * อ่านโปรไฟล์ปัจจุบันจาก LocalStorage (client only)
   * มี try/catch กันกรณีข้อมูลเสีย (เช่น แก้ localStorage มือแล้ว JSON.parse ไม่ผ่าน)
   */
  function getStoredProfile(): UserProfile | null {
    if (!import.meta.client) return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as UserProfile
    } catch {
      // ข้อมูลเสีย -> ทิ้งไปเลย ให้ผู้ใช้กรอกใหม่ ดีกว่าแอปพังทั้งหน้า
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  }

  /**
   * เริ่มต้นตรวจสอบว่ามีโปรไฟล์อยู่แล้วหรือไม่ (เรียกตอน mounted ของหน้าแรก)
   * ถ้ามีข้อมูลครบแล้ว ให้ข้ามทั้งหน้า Welcome และ Profile Form เข้าหน้า Home ทันที
   */
  function initProfile(): void {
    const stored = getStoredProfile()
    if (stored) {
      profile.value = stored
    }
  }

  /**
   * บันทึกโปรไฟล์ใหม่ลง LocalStorage หลังจาก Validate ผ่านแล้ว
   * รวม auth (ผลลัพธ์ Step 1: loginType/uid/displayName/pictureUrl) เข้ากับ
   * values (ผลลัพธ์ Step 2: ที่ผู้ใช้กรอกในฟอร์มจริง) เป็น UserProfile เดียวจบ
   * ส่วน age/ageRange/createdAt คำนวณ/สร้างที่นี่เสมอ ไม่รับจากภายนอก
   * เพื่อป้องกันข้อมูลไม่ตรงกัน (เช่น ผู้ใช้เปลี่ยนปีเกิดแต่ age ไม่อัปเดต)
   */
  function saveProfile(values: Required<ProfileFormValues>, auth: AuthData, member?: MemberRecord): UserProfile {
    const age = calculateAge(values.birthYear)
    const ageRange = calculateAgeRange(age)

    const fullProfile: UserProfile = {
      loginType: auth.loginType,
      uid: auth.uid,
      // ถ้า sync กับ Google Sheet สำเร็จ ให้ใช้ค่าที่ backend ยืนยันแล้วเป็นหลัก
      // (เผื่อกรณี login ซ้ำด้วยชื่อ-นามสกุล-เบอร์เดิม แต่เชื่อม LINE คนละรอบ)
      displayName: member?.displayName || auth.displayName,
      pictureUrl: member?.pictureUrl || auth.pictureUrl,

      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      birthYear: values.birthYear,
      phone: values.phone,
      age,
      ageRange,

      createdAt: Date.now(),

      memberId: member?.memberId,
      registerDate: member?.registerDate,
      lastLogin: member?.lastLogin,
      point: member?.point ?? 0,
      totalVisit: member?.totalVisit ?? 1,
    }

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile))
      // authData ทำหน้าที่เสร็จแล้ว (ถูกรวมเข้า userProfile หมดแล้ว) ล้างทิ้งได้เลย
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    profile.value = fullProfile
    return fullProfile
  }

  /**
   * อัปเดตเฉพาะข้อมูลที่มาจาก Google Sheet (point, totalVisit, lastLogin, รูป/ชื่อ LINE)
   * ทับลงในโปรไฟล์ปัจจุบัน — ใช้ตอนหน้า Home ดึงข้อมูลล่าสุดผ่าน getMember() โดยไม่ต้อง
   * ให้ผู้ใช้กรอกฟอร์มใหม่ และไม่กระทบ field อื่น (firstName, lastName ฯลฯ)
   */
  function refreshFromMember(member: MemberRecord): void {
    if (!profile.value) return
    const merged: UserProfile = {
      ...profile.value,
      displayName: member.displayName || profile.value.displayName,
      pictureUrl: member.pictureUrl || profile.value.pictureUrl,
      lastLogin: member.lastLogin,
      point: member.point,
      totalVisit: member.totalVisit,
    }
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    }
    profile.value = merged
  }

  /** ล้างโปรไฟล์ออกจาก LocalStorage (ไว้ใช้ตอนทดสอบ / reset) */
  function resetProfile(): void {
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
    profile.value = null
  }

  return {
    // state
    profile: readonly(profile),
    hasProfile,
    // actions
    initProfile,
    saveProfile,
    refreshFromMember,
    resetProfile,
  }
}
