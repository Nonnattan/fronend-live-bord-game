# Register App (Nuxt 4 + Nuxt UI) — พร้อม LINE Login จริง

## ⚠️ ข้อควรรู้ก่อนเริ่ม: LINE Login บังคับ HTTPS

LINE Login **ไม่ยอมรับ Callback URL ที่เป็น `http://`** แม้แต่ `http://localhost`
(ต่างจาก Google/บาง provider ที่มีข้อยกเว้นให้ localhost) ดังนั้นตอน dev บนเครื่อง
ตัวเอง ต้องมีการเจาะ tunnel ให้ localhost มี URL แบบ `https://` ชั่วคราวก่อน

## 1) เปิด HTTPS tunnel ด้วย ngrok (สำหรับ dev)

```bash
# ติดตั้งครั้งแรก: https://ngrok.com/download
ngrok http 3000
```

จะได้ URL ประมาณ `https://abcd1234.ngrok-free.app` — คัดลอกเก็บไว้
(ต้องเปิด ngrok ทิ้งไว้ตลอดตอน dev/ทดสอบ LINE Login)

## 2) ตั้งค่า Environment

```bash
cp .env.example .env
```

แล้วใส่ค่าจาก **LINE Developers Console** (Channel type: LINE Login):

```
LINE_CHANNEL_ID=...
LINE_CHANNEL_SECRET=...
LINE_REDIRECT_URI=https://abcd1234.ngrok-free.app/callback   # ใช้ URL จาก ngrok
```

จากนั้นเข้า **LINE Developers Console > ช่องแชนแนลของคุณ > แท็บ LINE Login >
Callback URL** แล้วใส่ URL เดียวกันเป๊ะ ๆ กับที่ตั้งใน `.env`
(ต้องตรงกันทุกตัวอักษร ไม่งั้นจะเจอ error `Invalid redirect_uri`)

ตอน production ให้เปลี่ยน `LINE_REDIRECT_URI` เป็นโดเมนจริงของคุณ
(`https://yourdomain.com/callback`) และเพิ่ม URL นั้นใน LINE Console ด้วย
(ตั้งได้มากกว่า 1 Callback URL ต่อ 1 แชนแนล เก็บทั้ง ngrok และ production ไว้พร้อมกันได้)

## 3) รันโปรเจกต์

```bash
npm install
npm run dev
```

แล้วเปิดผ่าน **URL ของ ngrok** (ไม่ใช่ `localhost:3000` ตรงๆ) เพื่อให้ flow
LINE Login ทำงานได้ครบ เช่น `https://abcd1234.ngrok-free.app`

## โครงสร้างไฟล์

```
composables/useAuth.ts           → logic ทั้งหมด (login, getUid, saveUid, logout)
pages/index.vue                  → หน้า Register
pages/callback.vue               → รับ redirect กลับจาก LINE แล้วแลกเป็น uid
server/api/auth/line-token.post.ts → Server route แลก code → token → profile
types/auth.ts                    → type ที่ใช้ร่วมกัน
```

## Flow การ Login จริง

1. ผู้ใช้กด **"เข้าสู่ระบบด้วย LINE"** → `loginWithLine()` สร้างค่า `state`
   แบบสุ่ม (ป้องกัน CSRF) แล้ว redirect ทั้งหน้าไปที่ LINE authorize endpoint
2. ผู้ใช้ login/ยินยอมบน LINE → LINE redirect กลับมาที่ `/callback?code=...&state=...`
3. `pages/callback.vue` ตรวจสอบ `state` แล้วเรียก `completeLineLogin(code, state)`
4. `completeLineLogin` ยิงไปที่ `POST /api/auth/line-token` (server route)
   ซึ่งใช้ **Channel Secret** (เก็บฝั่ง server เท่านั้น ไม่หลุดไปถึง browser)
   แลก `code` เป็น `access_token` แล้วเรียก LINE profile API ต่อเพื่อดึง
   `userId` (คือ LINE UID จริง เช่น `U123456789ABCDEFG`)
5. ได้ uid กลับมา → เก็บลง `LocalStorage` (key: `uid`) → กลับไปหน้า Register
   ซึ่งจะแสดง Badge "Registered" ทันที

## ปุ่ม "เข้าใช้งานแบบไม่ผูก LINE (ทดสอบ)"

เผื่อกรณีทดสอบ UI เร็ว ๆ โดยไม่ต้องผ่าน LINE จริง จะสร้าง uid ชั่วคราวจาก
Unix Timestamp (10 หลัก) ด้วย `registerAsGuest()` — ลบออกได้ถ้าไม่ต้องการ

## ต่อยอดเป็น LINE LIFF ในอนาคต

แก้เฉพาะ `loginWithLine()` ใน `useAuth.ts` ให้เรียก LIFF SDK แทนการ redirect
ไป authorize endpoint ตรง ๆ เช่น:

```ts
async function loginWithLine() {
  await liff.init({ liffId: 'YOUR_LIFF_ID' })
  if (!liff.isLoggedIn()) {
    liff.login()
    return
  }
  const profile = await liff.getProfile()
  saveUid(profile.userId)
}
```

ไม่ต้องแก้ `pages/index.vue`, `pages/callback.vue` หรือ type ใด ๆ เพราะทุกจุด
เรียกผ่าน `useAuth()` composable เพียงจุดเดียวอยู่แล้ว
