# Register App (Nuxt 4 + Nuxt UI)

## รันโปรเจกต์

```bash
npm install
npm run dev
```

## โครงสร้างไฟล์

```
composables/useAuth.ts   → logic ทั้งหมด (register, getUid, saveUid, logout)
pages/index.vue          → หน้า Register (มี Card เดียว)
types/auth.ts            → type ที่ใช้ร่วมกัน (LineUid, AuthState, LoginProvider)
```

## วิธีทดสอบ 2 กรณีของ LINE Login

เปิดไฟล์ `composables/useAuth.ts` แล้วแก้ค่าใน `mockLineLogin()`:

```ts
// กรณีที่ 1: มี LINE UID
const lineUid: LineUid = 'U123456789ABCDEFG'

// กรณีที่ 2: ไม่มี LINE UID → ระบบจะสร้าง uid ชั่วคราวจาก Unix Timestamp (10 หลัก)
const lineUid: LineUid = null
```

## ต่อยอดเป็น LINE LIFF ในอนาคต

แก้เฉพาะเนื้อหาใน `mockLineLogin()` ให้เรียก LIFF SDK จริง เช่น:

```ts
async function mockLineLogin(): Promise<LineUid> {
  await liff.init({ liffId: 'YOUR_LIFF_ID' })
  if (!liff.isLoggedIn()) {
    liff.login()
    return null
  }
  const profile = await liff.getProfile()
  return profile.userId
}
```

**ไม่ต้องแก้ไฟล์อื่นเลย** เพราะ `register()` ใน `useAuth.ts` เรียกผ่าน
function นี้เพียงจุดเดียว (return type ยังเป็น `LineUid` เหมือนเดิม) —
UI ใน `pages/index.vue` ก็ไม่ต้องแก้เช่นกัน เนื่องจากเรียกผ่าน
`register()` ที่ composable export ออกมาให้แล้ว
