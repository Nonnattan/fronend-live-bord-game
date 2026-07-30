/**
 * types/auth.ts
 * ---------------------------------------------------------------------------
 * ชนิดข้อมูลสำหรับระบบ Auth / Register
 * แยกออกมาต่างหากเพื่อให้ composable และ component อื่น ๆ import ใช้ร่วมกันได้
 * และเพื่อให้รองรับการต่อยอดเป็น LINE LIFF ในอนาคตโดยไม่ต้องแก้ signature เดิม
 */

/**
 * ผลลัพธ์จากขั้นตอน Login ด้วย LINE (หรือ mock)
 * - string  : ได้ LINE UID จริง เช่น "U123456789ABCDEFG"
 * - null    : ผู้ใช้ไม่มี LINE UID / ยกเลิก / login ไม่สำเร็จ
 */
export type LineUid = string | null

/**
 * แหล่งที่มาของ uid ที่ถูกสร้างขึ้น
 * - "line"      : มาจาก LINE Login (หรือ LIFF ในอนาคต)
 * - "temporary" : สร้างขึ้นเองจาก Unix Timestamp (กรณีไม่มี LINE UID)
 */
export type UidSource = 'line' | 'temporary'

/**
 * โครงสร้างข้อมูล Auth State ที่เก็บ/ใช้งานภายในแอป
 */
export interface AuthState {
  uid: string | null
  isRegistered: boolean
}

/**
 * Interface กลางสำหรับ "ผู้ให้บริการ Login"
 * ปัจจุบันใช้ LINE Login (OAuth ปกติ ผ่าน redirect) แต่ในอนาคตสามารถสลับเป็น
 * LIFF Login ได้โดยแค่เขียน implementation ใหม่ให้ตรงกับ interface นี้
 * โดยไม่ต้องแก้ logic ใน useAuth.ts เลย
 */
export interface LoginProvider {
  login: () => Promise<LineUid> | LineUid
}

/**
 * ผลลัพธ์ที่ server route (/api/auth/line-token) ส่งกลับมาให้ client
 * หลังจากแลก authorization code เป็น access token และดึงโปรไฟล์เรียบร้อย
 */
export interface LineTokenExchangeResult {
  uid: string
  displayName?: string
  pictureUrl?: string
}

