/**
 * types/auth.ts
 * ---------------------------------------------------------------------------
 * ชนิดข้อมูลสำหรับ Step 1 ของ Flow ใหม่: ผู้ใช้เลือก "เข้าสู่ระบบด้วย LINE" (LIFF)
 * หรือ "เข้าใช้งานโดยไม่เชื่อม LINE" (Guest) อย่างใดอย่างหนึ่งเสมอ
 *
 * แยกออกจาก types/profile.ts เพราะคนละความรับผิดชอบ:
 * - auth.ts    ดูแลเรื่อง "ผู้ใช้เลือกเข้าใช้งานวิธีไหน + ได้ uid อะไรมา"
 * - profile.ts ดูแลเรื่อง "ผู้ใช้คนนี้กรอกข้อมูลอะไรไว้ในฟอร์ม"
 */

/** วิธีที่ผู้ใช้เลือกเข้าใช้งานในหน้า Welcome (Step 1) */
export type LoginType = 'line' | 'guest'

/**
 * ข้อมูลที่ได้หลัง Step 1 เสร็จสิ้น (ไม่ว่าจะมาจาก LINE หรือ Guest)
 * เก็บไว้ "ชั่วคราว" ใน LocalStorage (key: "authData") ระหว่างรอผู้ใช้กรอก
 * หน้ากรอกข้อมูลผู้ใช้ (Step 2) ให้ครบ — จำเป็นต้องเก็บลง LocalStorage จริง ๆ
 * (ไม่ใช่แค่ state ในหน่วยความจำ) เพราะ liff.login() จะ redirect ออกจากหน้าเว็บ
 * ไปเข้า LINE แล้ว redirect กลับมาใหม่ ทำให้ state เดิมในหน่วยความจำหายไป
 */
export interface AuthData {
  loginType: LoginType
  uid: string
  /** มีเฉพาะกรณี loginType === 'line' และ LINE ส่งมาให้ */
  displayName?: string
  /** มีเฉพาะกรณี loginType === 'line' และ LINE ส่งมาให้ */
  pictureUrl?: string
}

/** รูปร่างข้อมูลที่ได้จาก liff.getProfile() หลัง login สำเร็จ */
export interface LiffProfileResult {
  userId: string
  displayName?: string
  pictureUrl?: string
}
