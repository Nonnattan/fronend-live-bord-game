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

## การจับคู่สมาชิกเดิม (แก้บั๊กข้อมูลซ้ำ)

เดิมระบบเทียบ `firstName + lastName + phone` ต้องตรงกันทั้ง 3 ค่าเป๊ะถึงจะถือว่า
เป็นสมาชิกเดิม ทำให้ถ้าพิมพ์ชื่อ-นามสกุลสะกดต่างจากรอบก่อนเล็กน้อยก็หาไม่เจอ
แล้ว **สร้างแถวใหม่ซ้ำ** ทั้งที่เบอร์โทรหรือ LINE User ID ตรงกับสมาชิกเดิมอยู่แล้ว

ตอนนี้แก้เป็น: เช็ค **LINE User ID ก่อนเสมอ** (ถ้ามีส่งมา) แล้ว fallback ไปเช็ค
**เบอร์โทรศัพท์** — ตรงอย่างใดอย่างหนึ่งก็ถือว่าเป็นสมาชิกเดิม ไม่สร้างแถวใหม่
(ไม่ใช้ firstName/lastName ในการจับคู่อีกต่อไป)

## Actions (ส่งเป็น JSON body ผ่าน POST, key `action`)

### `checkMember`
ตรวจสอบว่ามีสมาชิกอยู่แล้วหรือไม่ (ไม่เขียนข้อมูล) — จับคู่ด้วย `lineUserId` (ถ้ามี) หรือ `phone`
```json
{ "action": "checkMember", "firstName": "สมชาย", "lastName": "ใจดี", "phone": "0812345678" }
```
Response:
```json
{ "success": true, "found": true, "member": { "memberId": "M-...", "...": "..." } }
```

### `register`
สร้างสมาชิกใหม่ ถ้ามีอยู่แล้ว (เบอร์โทรหรือ lineUserId ตรงกับแถวเดิม) จะไม่สร้างซ้ำ
(จะอัปเดต Last Login/LINE fields แทน)
```json
{
  "action": "register",
  "firstName": "สมชาย", "lastName": "ใจดี", "phone": "0812345678",
  "lineUserId": "U1234...", "displayName": "Somchai", "pictureUrl": "https://..."
}
```

### `login`
ถ้าพบสมาชิก (เบอร์โทรหรือ lineUserId ตรงกัน) -> อัปเดต Last Login + Total Visit (+1) (+ ข้อมูล LINE ถ้ามี)
ถ้าไม่พบ -> สร้างใหม่ให้อัตโนมัติ (login-or-register ตาม flow ของสเปก, Total Visit เริ่มที่ 1)
Payload เหมือน `register`

### `loginByLine` (ใหม่ — ตามสเปก Login ด้วย LINE ต้องเช็ค lineUserId ก่อนเสมอ)
ตรวจสอบ **เฉพาะ lineUserId** เท่านั้น พบแล้ว Login ทันที (อัปเดต Last Login/Total
Visit) ไม่พบจะคืน `found: false` เท่านั้น **ไม่มีการเขียนข้อมูลใด ๆ** — ให้
frontend พาไปหน้าสมัครสมาชิกต่อ แล้วค่อยเรียก `register`
```json
{ "action": "loginByLine", "lineUserId": "U1234..." }
```
Response (พบ):
```json
{ "success": true, "found": true, "member": { "memberId": "M-...", "...": "..." } }
```
Response (ไม่พบ):
```json
{ "success": true, "found": false }
```

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
