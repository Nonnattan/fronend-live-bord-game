# Backend: Google Apps Script + Google Sheet

ไฟล์นี้ไม่ได้เป็นส่วนหนึ่งของโปรเจกต์ Nuxt (ไม่ได้ build/deploy พร้อมกัน)
ใช้สำหรับวางลงใน Google Apps Script แยกต่างหาก

## ขั้นตอน Deploy

1. สร้าง Google Sheet ใหม่ (จะเป็นฐานข้อมูลสมาชิก + ประวัติเข้าฐาน + คะแนนสะสม)
2. เปิด **Extensions > Apps Script**
3. ลบโค้ดเดิมใน `Code.gs` ทั้งหมด แล้ววางโค้ดจาก `Code.gs` ในโฟลเดอร์นี้แทน
3.1. เพิ่มไฟล์สคริปต์ใหม่อีก 3 ไฟล์ในโปรเจกต์ Apps Script เดียวกัน (คลิก **+**
   ข้าง Files แล้วเลือก Script) ตั้งชื่อให้ตรงและวางโค้ดจากไฟล์ชื่อเดียวกันใน
   โฟลเดอร์นี้ให้ครบ — ทุกไฟล์ในโปรเจกต์เดียวกันแชร์ global scope กัน จึงเรียก
   ฟังก์ชันข้ามไฟล์ได้ปกติ ไม่ต้อง import:
   - `JourneyService.gs`
   - `ScoreService.gs`
   - `CheckinService.gs`
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

**ระบบ Login/Register เดิมและชีต "Members" ไม่ถูกแก้ไขเลย** — ของใหม่ด้านล่าง
(ชีต "Journey"/"Score") เป็นส่วนต่อขยายที่แยกไฟล์ทั้งหมด (ดู "สถาปัตยกรรม
Service" ท้ายไฟล์นี้) เชื่อมเข้ากับ `Code.gs` เดิมแค่จุดเดียวคือเพิ่ม 4 action
ใหม่ในตัว router — ไม่แตะ logic ของ Members แม้แต่บรรทัดเดียว

## โครงสร้างชีต "Journey" (สร้างอัตโนมัติเมื่อเรียก action ครั้งแรก)

เก็บ "ประวัติการเข้าฐาน" ของผู้เล่น 1 แถว = 1 ครั้งที่เข้าฐานสำเร็จ (ไม่มีแถวซ้ำ
userId+stationId คู่เดียวกัน — เข้าฐานเดิมซ้ำจะไม่ถูกบันทึกเพิ่ม)

| Timestamp | UserId | DisplayName | StationId | StationName | Point | Status |
|---|---|---|---|---|---|---|

- `Timestamp` : วันที่-เวลา Asia/Bangkok ตอนบันทึก (เหมือน Register Date/Last Login ของ Members)
- `UserId` : ควรเป็น `memberId` เดิมจากระบบ Login (ไม่ผูก/validate กับชีต Members โดยตรงในโค้ด)
- `Point` : คะแนนของฐานนี้ฐานเดียว (ไม่ใช่คะแนนสะสม)
- `Status` : ค่าเริ่มต้น `"Completed"` เสมอ (บันทึกก็ต่อเมื่อสแกน QR ผ่านฐานสำเร็จ)

## โครงสร้างชีต "Score" (สร้างอัตโนมัติเมื่อเรียก action ครั้งแรก)

เก็บ "คะแนนสะสม" ของผู้เล่นแต่ละคน — 1 แถวต่อผู้เล่น 1 คน (ไม่มีแถวซ้ำ userId เดียวกัน)

| UserId | DisplayName | TotalPoint | TotalStation | UpdatedAt |
|---|---|---|---|---|

- `TotalPoint`/`TotalStation` : สะสมบวกเพิ่มทุกครั้งที่ผ่านฐาน **ใหม่** เท่านั้น
  (เข้าฐานเดิมซ้ำจะไม่ถูกนับเพิ่ม — เช็คผ่านชีต Journey ก่อนเสมอ)
- `UpdatedAt` : เวลา Asia/Bangkok ล่าสุดที่มีการอัปเดตคะแนน

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

### `checkin` (ใหม่ — สแกน QR ผ่านฐานสำเร็จ)
บันทึกการเข้าฐาน 1 ครั้ง: เช็คก่อนว่าผู้เล่น (`userId`) เคยเข้าฐานนี้
(`stationId`) มาก่อนหรือยัง
- **ยังไม่เคย** -> บันทึกแถวใหม่ลง Journey (`Status: "Completed"`) แล้วบวก
  คะแนน/จำนวนฐานเพิ่มในชีต Score (สร้างแถวใหม่ถ้ายังไม่มีข้อมูลผู้เล่น หรือ
  อัปเดตแถวเดิมถ้ามีอยู่แล้ว)
- **เคยแล้ว** -> คืนค่า `alreadyVisited: true` ทันที **ไม่บันทึกซ้ำ** ทั้งใน
  Journey และ Score

รองรับฐานใหม่ในอนาคตได้ทันที เพราะ `stationId`/`stationName`/`point` เป็นค่าที่
frontend ส่งมาตรง ๆ ไม่มีตารางรายชื่อฐานตายตัวฝั่ง backend ที่ต้องแก้ทุกครั้งที่
เพิ่มฐานใหม่ (เพิ่มฐานใหม่ในแอปแล้วส่ง stationId ใหม่มาได้เลย)
```json
{
  "action": "checkin",
  "userId": "M-...", "displayName": "สมชาย",
  "stationId": "station-1", "stationName": "ฐานที่ 1",
  "point": 100
}
```
Response (ผ่านฐานใหม่):
```json
{
  "success": true, "alreadyVisited": false,
  "journeyEntry": { "timestamp": "2026-08-03 12:00:00", "userId": "M-...", "...": "..." },
  "score": { "userId": "M-...", "totalPoint": 100, "totalStation": 1, "...": "..." }
}
```
Response (เข้าฐานนี้ซ้ำ):
```json
{ "success": true, "alreadyVisited": true }
```

### `getJourney` (ใหม่)
ดึงประวัติการเข้าฐานทั้งหมดของผู้เล่นคนเดียว (ไม่มีการเขียนข้อมูล)
```json
{ "action": "getJourney", "userId": "M-..." }
```

### `getScore` (ใหม่)
ดึงคะแนนสะสมปัจจุบันของผู้เล่นคนเดียว (ไม่มีการเขียนข้อมูล) — ถ้ายังไม่เคยผ่าน
ฐานใดเลยจะได้ `"score": null`
```json
{ "action": "getScore", "userId": "M-..." }
```

### `getLeaderboard` (ใหม่)
ดึงตารางคะแนนทั้งหมด เรียงจากคะแนนมาก -> น้อย (ไม่มีการเขียนข้อมูล) — เตรียมไว้
ให้ใช้ทำหน้า Leaderboard ในอนาคต
```json
{ "action": "getLeaderboard" }
```

## สถาปัตยกรรม Service (แยกไฟล์ตามชีต)

- `Code.gs` — เดิมทั้งหมด (Members/Login) + จุดเดียวที่แก้: เพิ่ม 4 case ใหม่
  ใน router ของ `handleRequest_()`
- `JourneyService.gs` — CRUD ล้วน ๆ ของชีต Journey เท่านั้น ไม่รู้จักชีต Score
- `ScoreService.gs` — CRUD ล้วน ๆ ของชีต Score เท่านั้น ไม่รู้จักชีต Journey
- `CheckinService.gs` — ประสาน Journey+Score เข้าด้วยกันเป็น action handlers
  (`actionCheckin_`, `actionGetJourney_`, `actionGetScore_`,
  `actionGetLeaderboard_`) เป็นไฟล์เดียวที่รู้จักทั้งสองชีตพร้อมกัน

เพิ่ม service ใหม่ในอนาคต (เช่น Badge/Achievement) ทำได้โดยเพิ่มไฟล์ `.gs` ใหม่
แล้วเพิ่ม case ใน router ของ `Code.gs` เพิ่มอีกจุดเดียว โดยไม่ต้องแก้ไฟล์ที่
มีอยู่เดิมเลย

## หมายเหตุเรื่อง CORS

Google Apps Script Web App ไม่รองรับ CORS preflight (`OPTIONS`) ดังนั้นฝั่ง
Frontend ต้องเรียก `fetch`/`$fetch` โดยตั้ง header
`Content-Type: text/plain;charset=utf-8` (ไม่ใช่ `application/json`) เพื่อให้
browser ส่งเป็น "simple request" ไม่ trigger preflight — ฝั่ง Apps Script ยัง
`JSON.parse(e.postData.contents)` ได้ตามปกติ (ดูใน `composables/useMemberApi.ts`
ของฝั่ง Frontend ที่ทำแบบนี้ไว้แล้ว)
