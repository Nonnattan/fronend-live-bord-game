# Register App (Nuxt 4 + Nuxt UI) — LINE LIFF + Guest

## Flow

**Step 1 — Welcome page**: ผู้ใช้เลือกอย่างใดอย่างหนึ่งเสมอ

- 🟢 **เข้าสู่ระบบด้วย LINE** → เปิด LIFF SDK จริง (`liff.login()` + `liff.getProfile()`)
- ⚪ **เข้าใช้งานโดยไม่เชื่อม LINE** → สร้าง Anonymous ID จาก Unix Timestamp 10 หลักทันที (ไม่มี network call)

ไม่ว่าจะเลือกทางไหน ผลลัพธ์จะถูกเก็บชั่วคราวใน LocalStorage (key `authData`)
แล้วพาไป **Step 2** เสมอ

**Step 2 — Profile Form**: ฟอร์มเต็มจอ บังคับกรอก ปิด/ข้ามไม่ได้
(ชื่อ, นามสกุล, เพศ, ปีเกิด → คำนวณอายุ/ช่วงอายุอัตโนมัติ) ถ้ามาจาก LINE และมี
`displayName` จะเติมช่อง "ชื่อ" ให้ล่วงหน้า (แก้ไขได้) เมื่อกด "เริ่มใช้งาน" จะรวม
`authData` + ค่าฟอร์ม เป็น `UserProfile` ก้อนเดียว บันทึกลง LocalStorage
(key `userProfile`) แล้วลบ `authData` ชั่วคราวทิ้ง จากนั้นเข้าหน้า **Home**

**ครั้งถัดไป**: ถ้าพบ `userProfile` ใน LocalStorage อยู่แล้ว จะข้ามทั้ง Welcome
และ Profile Form เข้าหน้า Home ทันที

## ตั้งค่า LIFF (สำหรับ LINE Login)

1. เปิด HTTPS tunnel สำหรับ dev (LIFF บังคับ HTTPS):
   ```bash
   ngrok http 3000
   ```
2. ไป [LINE Developers Console](https://developers.line.biz) > ช่องแชนแนล
   ประเภท "LINE Login" > แท็บ **LIFF** > สร้าง LIFF app ใหม่ > ตั้ง
   **Endpoint URL** เป็น URL จาก ngrok (เช่น `https://abcd1234.ngrok-free.app`)
   > คัดลอก **LIFF ID** ที่ได้
3. ตั้งค่า Environment:
   ```bash
   cp .env.example .env
   ```
   แล้วใส่ `LIFF_ID=...` ที่ได้จากขั้นตอนที่ 2
4. รันโปรเจกต์:
   ```bash
   npm install
   npm run dev
   ```
   แล้วเปิดผ่าน **URL ของ ngrok** (ไม่ใช่ `localhost:3000` ตรง ๆ) เพื่อให้
   LIFF login ทำงานได้ครบ

หากยังไม่ได้ตั้งค่า `LIFF_ID` ปุ่ม "เข้าสู่ระบบด้วย LINE" จะแสดง error แต่ปุ่ม
"เข้าใช้งานโดยไม่เชื่อม LINE" (Guest) ยังใช้งานได้ตามปกติ ไม่ต้องพึ่ง LIFF เลย

## โครงสร้างไฟล์

```
components/WelcomePage.vue    → Step 1: หน้าแรก โลโก้ + ข้อความต้อนรับ + LoginButtons
components/LoginButtons.vue   → ปุ่ม "เข้าสู่ระบบด้วย LINE" / "เข้าใช้งานโดยไม่เชื่อม LINE"
components/ProfileForm.vue    → Step 2: ฟอร์มกรอกโปรไฟล์แบบ fullscreen บังคับ (ห้ามข้าม)
composables/useAuth.ts        → logic Step 1 ทั้งหมด (LIFF login จริง + Guest ID)
composables/useProfile.ts     → logic Step 2: รวม authData + ฟอร์ม → UserProfile, บันทึก/อ่าน LocalStorage
utils/profileSchema.ts        → Zod schema + คำนวณอายุ/ช่วงอายุ/ตัวเลือกปีเกิด
pages/index.vue               → Controller: Welcome -> ProfileForm -> Home
types/auth.ts                 → type ที่ใช้ร่วมกัน (Step 1 / authData)
types/profile.ts              → type ที่ใช้ร่วมกัน (Step 2 / UserProfile)
```

## โครงสร้างข้อมูลใน LocalStorage

**`authData`** (ชั่วคราว — ถูกลบทิ้งทันทีที่บันทึก `userProfile` สำเร็จ)

```json
{ "loginType": "line", "uid": "Uxxxxxxxx", "displayName": "...", "pictureUrl": "..." }
```

หรือ

```json
{ "loginType": "guest", "uid": "1722305521" }
```

**`userProfile`** (ถาวร — ผลลัพธ์สุดท้ายหลังกรอกฟอร์ม)

```json
{
  "loginType": "line",
  "uid": "Uxxxxxxxx",
  "displayName": "...",
  "pictureUrl": "...",
  "firstName": "...",
  "lastName": "...",
  "gender": "male",
  "birthYear": 1999,
  "age": 27,
  "ageRange": "20-30",
  "createdAt": 1722305521000
}
```

## หมายเหตุการออกแบบ

- **ไม่มี uid ใด ๆ ถูกสร้างอัตโนมัติตอนเปิดเว็บอีกต่อไป** — ผู้ใช้ต้องกดเลือก
  Step 1 ก่อนเสมอ (ยกเว้นกรณีมี `authData`/`userProfile` เดิมอยู่แล้ว หรือ
  กำลังถูก LINE redirect กลับมาหลัง login สำเร็จ)
- LIFF login ใช้ `liff.login()` ซึ่ง redirect ทั้งหน้าไปเข้า LINE แล้ว
  redirect กลับมาที่ URL เดิมของ LIFF app เอง **ไม่มี callback route แยก**
  — `useAuth().initAuth()` จะดักจับตอนโหลดหน้าใหม่ด้วย `liff.isLoggedIn()`
  แล้วดึงโปรไฟล์ให้อัตโนมัติ
- ไม่มี server route / Channel Secret หลงเหลืออยู่ในโปรเจกต์นี้อีกต่อไป เพราะ
  LIFF SDK ทำงานฝั่ง client ล้วน ๆ (ต่างจาก OAuth redirect แบบเดิมที่ต้องแลก
  code เป็น token ผ่าน server) หากในอนาคตต้องการเชื่อม Backend จริง
  (เช่น verify ID token ฝั่ง server) ให้เพิ่ม server route ใหม่โดยเรียกผ่าน
  `useAuth()` composable จุดเดียวเหมือนเดิม ไม่ต้องแก้ pages/component อื่น
