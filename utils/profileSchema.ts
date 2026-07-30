/**
 * utils/profileSchema.ts
 * ---------------------------------------------------------------------------
 * Zod schema + pure helper functions ล้วน ๆ สำหรับฟอร์ม Register โปรไฟล์
 * อยู่ใน utils/ เพื่อให้ Nuxt auto-import ได้ทั้งใน component และ composable
 * โดยไม่ต้องเขียน import ซ้ำทุกที่ (ตามธรรมชาติของ Nuxt 4)
 *
 * แยกออกจาก composable เพราะเป็น "pure logic" ล้วน ๆ ไม่ผูกกับ state/localStorage
 * ทำให้ทดสอบ (unit test) ได้ง่ายและ reuse ได้ทั้งฝั่ง client/server
 */

import { z } from 'zod'
import type { AgeRangeCode, Gender } from '~/types/profile'

/** ปีปัจจุบัน ใช้เป็นฐานคำนวณอายุเสมอ (ไม่ hardcode) */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * นิยาม "ช่วงอายุ" ทั้งหมดที่ให้เลือก — เรียงจากอายุน้อยไปมาก
 * เริ่มตั้งแต่ 10 ขวบ ไปจนถึง 51 ปีขึ้นไป ("50 ++")
 * maxAge ของช่วงสุดท้ายเป็นแค่เพดานสมมติ (100 ปี) ไว้คำนวณปีเกิดเก่าสุดเท่านั้น
 * ไม่ได้ตัดสิทธิ์ผู้ที่อายุเกิน 100 ปีแต่อย่างใด
 */
const AGE_BRACKETS: { code: AgeRangeCode; minAge: number; maxAge: number; label: string }[] = [
  { code: '10-19', minAge: 10, maxAge: 19, label: '10-19 ปี' },
  { code: '20-30', minAge: 20, maxAge: 30, label: '20-30 ปี' },
  { code: '31-40', minAge: 31, maxAge: 40, label: '31-40 ปี' },
  { code: '41-50', minAge: 41, maxAge: 50, label: '41-50 ปี' },
  { code: '51+', minAge: 51, maxAge: 100, label: '51 ปีขึ้นไป' },
]

/**
 * ตัวเลือกช่วงอายุที่ให้เลือกใน Select — คำนวณช่วงปีเกิดที่ตรงกันสดใหม่ทุกครั้ง
 * จากปีปัจจุบัน (ห้าม hardcode ปี พ.ศ./ค.ศ. ตายตัว)
 * label ที่ได้จะออกมาแบบ "1996 - 2006 (20-30 ปี)" คือช่วงปีเกิดคู่กับช่วงอายุ
 * ส่วน value คือปีเกิดตัวแทนกลาง ๆ ของช่วงนั้น ใช้คำนวณ age/ageRange ย้อนกลับ
 * แล้วได้ผลลัพธ์เป็นช่วงเดิมเสมอ (ไม่กระทบความถูกต้องของข้อมูล)
 */
export function getAgeRangeOptions(): { label: string; value: number; code: AgeRangeCode }[] {
  const currentYear = getCurrentYear()

  return AGE_BRACKETS.map(({ code, minAge, maxAge, label }) => {
    const minBirthYear = currentYear - maxAge
    const maxBirthYear = currentYear - minAge
    const representativeBirthYear = Math.round((minBirthYear + maxBirthYear) / 2)

    return {
      code,
      label: `${minBirthYear} - ${maxBirthYear} (${label})`,
      value: representativeBirthYear,
    }
  })
}

/** คำนวณอายุจากปีเกิด โดยอิงปีปัจจุบันเสมอ */
export function calculateAge(birthYear: number): number {
  return getCurrentYear() - birthYear
}

/**
 * คำนวณช่วงอายุ (Age Range) จากอายุ
 * ขอบเขต:
 *   10 - 19     -> 10-19
 *   20 - 30     -> 20-30
 *   31 - 40     -> 31-40
 *   41 - 50     -> 41-50
 *   >= 51       -> 51+
 */
export function calculateAgeRange(age: number): AgeRangeCode {
  if (age <= 19) return '10-19'
  if (age <= 30) return '20-30'
  if (age <= 40) return '31-40'
  if (age <= 50) return '41-50'
  return '51+'
}

/** แปลงรหัสช่วงอายุเป็น label ภาษาไทยไว้แสดงผลในฟอร์ม/หน้า Home */
export function ageRangeLabel(range: AgeRangeCode): string {
  const labels: Record<AgeRangeCode, string> = {
    '10-19': '10-19 ปี',
    '20-30': '20-30 ปี',
    '31-40': '31-40 ปี',
    '41-50': '41-50 ปี',
    '51+': '51 ปีขึ้นไป',
  }
  return labels[range]
}

/** ตัวเลือกเพศที่ใช้ใน URadioGroup — ลำดับตามที่ระบุในสเปก */
export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'ชาย', value: 'male' },
  { label: 'หญิง', value: 'female' },
  { label: 'LGBTQ+', value: 'lgbtq' },
  { label: 'ไม่ระบุ', value: 'unspecified' },
]

/**
 * Zod schema สำหรับ Validate ฟอร์ม Register โปรไฟล์ (ข้อ 7 ในสเปก)
 * หมายเหตุ: birthYear ที่รับจริงคือ "ปีเกิดตัวแทน" ของช่วงอายุที่ผู้ใช้เลือก
 * (มาจาก getAgeRangeOptions() ที่คุมตัวเลือกทั้งหมดไว้ที่ UI แทน)
 * แต่ยังกันค่าที่ผิดปกติ (เช่น อนาคต หรือเก่าเกินจริง) ไว้เป็นชั้นความปลอดภัยสุดท้าย
 */
export const profileSchema = z.object({
  firstName: z
    .string({ required_error: 'กรุณากรอกชื่อ' })
    .trim()
    .min(1, 'กรุณากรอกชื่อ')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
  lastName: z
    .string({ required_error: 'กรุณากรอกนามสกุล' })
    .trim()
    .min(1, 'กรุณากรอกนามสกุล')
    .min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'นามสกุลต้องไม่เกิน 50 ตัวอักษร'),
  gender: z.enum(['male', 'female', 'lgbtq', 'unspecified'], {
    required_error: 'กรุณาเลือกเพศ',
    invalid_type_error: 'กรุณาเลือกเพศ',
  }),
  birthYear: z
    .number({ required_error: 'กรุณาเลือกช่วงอายุ', invalid_type_error: 'กรุณาเลือกช่วงอายุ' })
    .int()
    .min(getCurrentYear() - 100, 'ช่วงอายุไม่ถูกต้อง')
    .max(getCurrentYear() - 10, 'ช่วงอายุไม่ถูกต้อง'),
})

export type ProfileSchemaOutput = z.output<typeof profileSchema>
