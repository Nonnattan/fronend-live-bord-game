/**
 * types/profile.ts
 * ---------------------------------------------------------------------------
 * ชนิดข้อมูลสำหรับ "โปรไฟล์ผู้ใช้" — ผลลัพธ์สุดท้ายหลังรวม authData (Step 1)
 * เข้ากับค่าที่กรอกในฟอร์ม (Step 2) เข้าด้วยกันเป็น object เดียว
 */

import type { LoginType } from '~/types/auth'

/** ตัวเลือกเพศทั้งหมดที่ฟอร์มรองรับ */
export type Gender = 'male' | 'female' | 'lgbtq' | 'unspecified'

/**
 * รหัสช่วงอายุ — ผู้ใช้เลือกช่วงอายุตรง ๆ ("ปีเกิด" ที่แสดงในตัวเลือกเป็นแค่การ
 * คำนวณช่วงปีเกิดที่สอดคล้องกับช่วงอายุนี้ให้ดูประกอบเท่านั้น เช่น
 * "1996 - 2006 (20-30 ปี)" ไม่ใช่การให้เลือกปีเกิดทีละปีอีกต่อไป)
 * เริ่มตั้งแต่ 10 ขวบ ไปจนถึง 51 ปีขึ้นไป ("50 ++")
 */
export type AgeRangeCode = '10-19' | '20-30' | '31-40' | '41-50' | '51+'

/**
 * ค่าที่ผู้ใช้กรอกในฟอร์มจริง ๆ (ก่อนแปลงเป็น birthYearRange และก่อนรวมกับ authData)
 * ตรงกับ field ที่ Validate ด้วย Zod ใน utils/profileSchema.ts
 */
export interface ProfileFormValues {
  firstName: string
  lastName: string
  gender?: Gender
  birthYear?: number
  phone?: string
}

/**
 * โครงสร้างข้อมูลโปรไฟล์แบบสมบูรณ์ที่บันทึกลง LocalStorage (key: "userProfile")
 * = authData (Step 1: loginType, uid, displayName, pictureUrl)
 * + ค่าที่กรอกในฟอร์ม (Step 2: firstName, lastName, gender, birthYear)
 * + ค่าที่คำนวณอัตโนมัติ (birthYearRange, createdAt)
 */
export interface UserProfile {
  loginType: LoginType
  uid: string
  displayName?: string
  pictureUrl?: string

  firstName: string
  lastName: string
  /**
   * เพศ/ปีเกิด/อายุ — เป็น optional เพราะ Google Sheet (ฐานข้อมูลสมาชิกจริง)
   * ไม่ได้เก็บฟิลด์เหล่านี้เลย (เก็บแค่ชื่อ-นามสกุล-เบอร์-LINE) กรอกครั้งแรกตอน
   * สมัครสมาชิกใหม่เท่านั้น ถ้า Login ซ้ำด้วย LINE ที่เจอ lineUserId เดิมใน Sheet
   * (คนละเครื่อง ไม่มี LocalStorage เดิม) จะไม่มีค่าเหล่านี้ — ปล่อยว่างไว้ได้
   * ไม่บังคับกรอกซ้ำ
   */
  gender?: Gender
  birthYear?: number
  phone: string
  /**
   * ช่วงปีเกิด ค.ศ. แบบข้อความตรงตามที่บันทึกลง Google Sheet (คอลัมน์ Birth Year)
   * เช่น "1996-2006" — ไม่เก็บอายุเป็นตัวเลขอีกต่อไป (ดู utils/profileSchema.ts ->
   * birthYearRangeValueFor()) ค่านี้คือ source of truth สำหรับแสดงผลในหน้า Profile
   */
  birthYearRange?: string

  createdAt: number

  /**
   * ข้อมูลที่มาจาก Google Sheet ผ่าน Google Apps Script API (composables/useMemberApi.ts)
   * มีค่าเฉพาะเมื่อ sync กับ backend สำเร็จแล้วเท่านั้น (ไม่บังคับ เพื่อไม่ให้พังของเดิม
   * ถ้ายังไม่ได้ตั้งค่า API_BASE_URL)
   */
  memberId?: string
  registerDate?: string
  lastLogin?: string
  /** คะแนนสะสม — ใช้แสดงในหน้า Home/Profile รีเฟรชได้ผ่าน useMemberApi().getMember() */
  point?: number
  /** จำนวนครั้งที่เข้าใช้บริการ (นับทุกครั้งที่ login/register สำเร็จ) */
  totalVisit?: number
}
