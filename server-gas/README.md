# Backend: Google Apps Script + Google Sheet

ไฟล์นี้ไม่ได้เป็นส่วนหนึ่งของโปรเจกต์ Nuxt (ไม่ได้ build/deploy พร้อมกัน)
ใช้สำหรับวางลงใน Google Apps Script แยกต่างหาก

## ขั้นตอน Deploy

1. สร้าง Google Sheet ใหม่ (จะเป็นฐานข้อมูลสมาชิก)
2. เปิด **Extensions > Apps Script**
3. ลบโค้ดเดิมใน `Code.gs` ทั้งหมด แล้ววางโค้ดจาก `Code.gs` ในโฟลเดอร์นี้แทน
4. กด **Deploy > New deployment**
   - Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. กด Deploy แล้วอนุญาต permission ที่ขอ (accessing your spreadsheets)
6. คัดลอก **Web app URL** (ลงท้ายด้วย `/exec`)
7. นำ URL นั้นไปใส่ในไฟล์ `.env` ของฝั่ง Frontend เป็นค่า `API_BASE_URL`

ทุกครั้งที่แก้ `Code.gs` แล้วต้องการให้มีผลจริง ต้องกด
**Deploy > Manage deployments > แก้ไข (ปากกา) > Version: New > Deploy** ใหม่เสมอ
(แก้โค้ดอย่างเดียวไม่ redeploy จะไม่มีผลกับ URL เดิม)

## โครงสร้างชีต "Members" (สร้างอัตโนมัติเมื่อเรียก action ครั้งแรก)

| Member ID | First Name | Last Name | Phone Number | LINE User ID | Display Name | Profile Picture | Register Date | Last Login | Point | Total Visit |
|---|---|---|---|---|---|---|---|---|---|---|

> ถ้าเคย deploy เวอร์ชันเก่า (ไม่มีคอลัมน์ Point/Total Visit) มาก่อน ไม่ต้องทำ
> อะไรเพิ่ม — โค้ดใหม่จะเติมหัวตารางและค่าเริ่มต้น (Point=0, Total Visit=1)
> ให้ทุกแถวเดิมอัตโนมัติในการเรียก action ครั้งแรกหลัง deploy

## Actions (ส่งเป็น JSON body ผ่าน POST, key `action`)

### `checkMember`
ตรวจสอบว่ามีสมาชิกอยู่แล้วหรือไม่ (ไม่เขียนข้อมูล)
```json
{ "action": "checkMember", "firstName": "สมชาย", "lastName": "ใจดี", "phone": "0812345678" }
```
Response:
```json
{ "success": true, "found": true, "member": { "memberId": "M-...", "...": "..." } }
```

### `register`
สร้างสมาชิกใหม่ ถ้ามีอยู่แล้วจะไม่สร้างซ้ำ (จะอัปเดต Last Login/LINE fields แทน)
```json
{
  "action": "register",
  "firstName": "สมชาย", "lastName": "ใจดี", "phone": "0812345678",
  "lineUserId": "U1234...", "displayName": "Somchai", "pictureUrl": "https://..."
}
```

### `login`
ถ้าพบสมาชิก -> อัปเดต Last Login + Total Visit (+1) (+ ข้อมูล LINE ถ้ามี)
ถ้าไม่พบ -> สร้างใหม่ให้อัตโนมัติ (login-or-register ตาม flow ของสเปก, Total Visit เริ่มที่ 1)
Payload เหมือน `register`

### `updateMember`
แก้ไขข้อมูลด้วย `memberId` โดยตรง (แก้ `point`/`totalVisit` ได้ด้วย เช่น ใช้ตอนหน้าร้านให้แต้ม)
```json
{ "action": "updateMember", "memberId": "M-...", "point": 150 }
```

### `getMember`
ดึงข้อมูลสมาชิกล่าสุดด้วย `memberId` (ไม่มีการเขียนข้อมูล) — ใช้รีเฟรช point/totalVisit
ในหน้า Home ของแอปแบบเงียบ ๆ ทุกครั้งที่เปิดแอป
```json
{ "action": "getMember", "memberId": "M-..." }
```

## หมายเหตุเรื่อง CORS

Google Apps Script Web App ไม่รองรับ CORS preflight (`OPTIONS`) ดังนั้นฝั่ง
Frontend ต้องเรียก `fetch`/`$fetch` โดยตั้ง header
`Content-Type: text/plain;charset=utf-8` (ไม่ใช่ `application/json`) เพื่อให้
browser ส่งเป็น "simple request" ไม่ trigger preflight — ฝั่ง Apps Script ยัง
`JSON.parse(e.postData.contents)` ได้ตามปกติ (ดูใน `composables/useMemberApi.ts`
ของฝั่ง Frontend ที่ทำแบบนี้ไว้แล้ว)
