# ระบบ Login ด้วย Google Sheet เป็นฐานข้อมูลสมาชิก

## 1. สรุป Flow

1. ผู้ใช้เลือก **Login ด้วย LINE** (ผ่าน LIFF SDK) หรือ **Login แบบไม่ใช้ LINE** (Guest)
2. ไม่ว่าจะเลือกทางไหน ระบบพาไปหน้ากรอกข้อมูลเสมอ (ชื่อ, นามสกุล, เบอร์โทรศัพท์) — ไม่มีหน้า Register แยก
3. กดปุ่ม "ยืนยัน" → frontend ส่งข้อมูลไป **backend API** เดียว (ไม่เรียก Google Sheet ตรงจาก client เพราะจะหลุด credentials)
4. Backend ตรวจสอบใน Google Sheet ด้วย `ชื่อ + นามสกุล + เบอร์โทรศัพท์` (normalize: trim + ตัดช่องว่างซ้ำ + lower-case ภาษาอังกฤษถ้ามี)
   - **พบแถวที่ตรงกัน** → ไม่สร้างสมาชิกใหม่ อัปเดต `LastLoginAt`, `LoginType`, และข้อมูล LINE (ถ้ามี) ในแถวเดิม แล้วส่งข้อมูลสมาชิกกลับ
   - **ไม่พบ** → สร้างแถวใหม่ พร้อม `MemberID` ที่รันอัตโนมัติ แล้วส่งข้อมูลสมาชิกกลับ
5. Frontend เก็บผลลัพธ์ไว้ใน state/localStorage (เป็น cache สำหรับเปิดแอปซ้ำ ไม่ใช่ source of truth) แล้วพาไปหน้า Home

ผู้ใช้เห็นแค่ 2 ปุ่ม Login + ฟอร์มกรอกข้อมูล + ปุ่มยืนยันเท่านั้น ตรงตามสเปก

## 2. ทำไมต้องมี Backend คั่นกลาง (ไม่ยิง Google Sheets API จาก mobile app ตรง ๆ)

- Google Sheets API ต้องใช้ **Service Account credentials** (private key) — ถ้าฝังใน mobile app/frontend code จะรั่วทันที ใครก็ดึงออกมาเขียนสมาชิกปลอมได้
- Logic การ "หาแล้วอัปเดต หรือสร้างใหม่" ต้องทำแบบ atomic ที่เดียว ไม่ให้ client แข่งกันสร้าง MemberID ซ้ำ
- จึงต้องมี API layer (Nuxt server route ก็ได้ เพราะโปรเจกต์นี้เป็น Nuxt 4 ที่มี server ในตัวอยู่แล้ว) ทำหน้าที่เป็นตัวกลางเดียวที่คุย Google Sheets API

สถาปัตยกรรม:

```
Mobile App (Nuxt/Vue)  →  POST /api/members/verify  →  Nuxt Server (service account)  →  Google Sheets API  →  Google Sheet "Members"
```

ทางเลือกอื่นที่เป็นไปได้ (ระบุไว้เผื่อไม่สะดวกตั้งค่า GCP service account): ใช้ **Google Apps Script Web App** (`doPost`) ผูกกับ Sheet โดยตรง แล้วให้ frontend ยิง `fetch()` ไปที่ URL ของ Apps Script แทน — ตั้งค่าง่ายกว่า ไม่ต้องมี GCP project แต่ควบคุม rate limit/security ได้น้อยกว่า และ cold start ช้ากว่า service account ทาง REST API ปกติ เหมาะกับ MVP/งานเล็ก ส่วนแนวทางหลักที่ implement ในโปรเจกต์นี้เลือกใช้ **Nuxt server route + googleapis (service account)** เพราะโปรเจกต์มี server อยู่แล้วและปลอดภัยกว่าสำหรับ production

## 3. โครงสร้าง Google Sheet

Sheet ชื่อ `Members`, แถวแรกเป็น header:

| Column | Field | ตัวอย่าง | หมายเหตุ |
|---|---|---|---|
| A | MemberID | `M000001` | สร้างอัตโนมัติ, unique, ห้ามซ้ำ |
| B | FirstName | สมชาย | |
| C | LastName | ใจดี | |
| D | Phone | 0812345678 | ใช้เป็น key หลักร่วมกับชื่อ-นามสกุล |
| E | LoginType | line / guest | ค่าล่าสุดที่ใช้ login |
| F | LineUserId | Uxxxxxxxx | ว่างได้ถ้าไม่เคยผูก LINE |
| G | LineDisplayName | สมชาย (LINE) | |
| H | LinePictureUrl | https://... | |
| I | CreatedAt | 2026-07-30T10:00:00Z | ตั้งครั้งเดียวตอนสร้างสมาชิก |
| J | LastLoginAt | 2026-07-30T10:00:00Z | อัปเดตทุกครั้งที่ login สำเร็จ |
| K | UpdatedAt | 2026-07-30T10:00:00Z | อัปเดตทุกครั้งที่แก้ไขแถว |

**Matching key**: `normalize(FirstName) + "|" + normalize(LastName) + "|" + normalize(Phone)` โดย `normalize()` = trim + ยุบช่องว่างซ้ำ + lower-case (ตัวอักษรอังกฤษ)

> หมายเหตุความเสี่ยง: คนชื่อ-นามสกุล-เบอร์ตรงกันเป๊ะจริง ๆ มีโอกาสต่ำมากในกรณีใช้เบอร์โทรจริงเป็นส่วนหนึ่งของ key แต่ถ้าต้องการความแม่นยำ 100% แนะนำใช้ **เบอร์โทรศัพท์เป็น primary key เพียงตัวเดียว** (ชื่อ-นามสกุลไว้ตรวจสอบ/แสดงผลเสริม) เพราะเบอร์โทรไม่ซ้ำกันในทางปฏิบัติมากกว่าชื่อ-นามสกุล ระบบที่ทำไว้ในโปรเจกต์นี้ยึดตามสเปกที่ให้มา (เช็คทั้ง 3 ฟิลด์) แต่เขียนโค้ดแยกฟังก์ชัน `findMember()` ไว้จุดเดียว เปลี่ยน key ทีหลังได้ง่าย

## 4. API Contract

### `POST /api/members/verify`

Request body:
```json
{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "phone": "0812345678",
  "auth": {
    "loginType": "line",
    "uid": "U1234567890abcdef",
    "displayName": "Somchai",
    "pictureUrl": "https://..."
  }
}
```

Response body (ทั้งกรณีพบและไม่พบข้อมูลเดิม):
```json
{
  "isNewMember": false,
  "member": {
    "memberId": "M000001",
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "phone": "0812345678",
    "loginType": "line",
    "lineUserId": "U1234567890abcdef",
    "lineDisplayName": "Somchai",
    "linePictureUrl": "https://...",
    "createdAt": "2026-07-28T03:10:00.000Z",
    "lastLoginAt": "2026-07-30T09:00:00.000Z"
  }
}
```

Error responses: `400` (validation ไม่ผ่าน), `502` (คุย Google Sheets ไม่สำเร็จ)

## 5. ขั้นตอนภายใน backend (`verify.post.ts`)

1. Validate body ด้วย Zod (firstName/lastName ≥1 ตัวอักษร, phone regex `0\d{9}`)
2. อ่านข้อมูลทั้งหมดใน sheet `Members!A2:K` ด้วย `spreadsheets.values.get`
3. หาแถวที่ normalize(firstName+lastName+phone) ตรงกัน
4. **ถ้าพบ** → อัปเดตเฉพาะคอลัมน์ E (LoginType), F–H (ข้อมูล LINE ถ้ามี ไม่เขียนทับด้วยค่าว่างถ้า login แบบ guest), J (LastLoginAt), K (UpdatedAt) ด้วย `spreadsheets.values.update` ที่แถวนั้น
5. **ถ้าไม่พบ** → สร้าง MemberID ใหม่ (นับจากจำนวนแถวที่มี + 1 หรือหา MemberID สูงสุดปัจจุบัน +1 กันกรณีมีการลบแถวกลาง) แล้ว `spreadsheets.values.append` แถวใหม่ทั้งหมด
6. ส่งข้อมูลสมาชิก (ทุกฟิลด์) กลับไปให้ frontend

**เรื่อง concurrency**: Google Sheets ไม่มี transaction ในตัว ถ้ามีคนกดยืนยันพร้อมกันสองคนด้วยข้อมูลเดียวกันในเสี้ยววินาทีเดียวกัน อาจสร้างซ้ำได้ในทางทฤษฎี ซึ่งสำหรับสเกลของแอปนี้ (สมัครทีละคนผ่านฟอร์ม) ความเสี่ยงต่ำมาก ถ้าต้องการความชัวร์ 100% ค่อยขยับไปใช้ฐานข้อมูลจริง (Firestore/Postgres) ในอนาคตโดยที่ frontend ไม่ต้องแก้ เพราะคุยผ่าน API เดียวกันอยู่แล้ว

## 6. การเปลี่ยนแปลงฝั่ง Frontend (โปรเจกต์ Nuxt ที่แนบมา)

จากโค้ดเดิมที่เก็บทุกอย่างใน LocalStorage ล้วน ๆ ปรับเป็น:

- `components/ProfileForm.vue` — ตัดฟิลด์เพศ/ปีเกิดออก เหลือ ชื่อ, นามสกุล, เบอร์โทรศัพท์ ตามสเปกใหม่ เมื่อกด "ยืนยัน" จะเรียก `POST /api/members/verify` แทนการบันทึกลง LocalStorage ตรง ๆ
- `composables/useProfile.ts` — เพิ่มฟังก์ชัน `verifyMember()` ที่ยิง API แล้วเก็บผลลัพธ์ทั้งใน state และ LocalStorage (เป็น cache สำหรับเปิดแอปซ้ำแบบเร็ว โดยยังคง sync กับ Sheet ทุกครั้งที่ login ใหม่)
- `server/api/members/verify.post.ts` — endpoint ใหม่ตามหัวข้อ 4–5
- `server/utils/googleSheets.ts` — ตัวช่วย auth + อ่าน/เขียน Google Sheet ด้วย service account
- `types/member.ts` — type ของ Member ที่ตรงกับคอลัมน์ใน Sheet
- `.env` — เพิ่ม `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`

## 7. การตั้งค่า Google Sheets API (Service Account)

1. สร้างโปรเจกต์ใน Google Cloud Console → เปิดใช้งาน **Google Sheets API**
2. สร้าง **Service Account** → สร้างคีย์แบบ JSON → เก็บ `client_email` และ `private_key`
3. เปิด Google Sheet ที่จะใช้เป็นฐานข้อมูล → กด **Share** → เพิ่มอีเมลของ Service Account เป็น **Editor**
4. คัดลอก Spreadsheet ID จาก URL ของ Sheet (ส่วนระหว่าง `/d/` กับ `/edit`)
5. ใส่ค่าใน `.env`:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
   ```
   (`GOOGLE_PRIVATE_KEY` ต้องเก็บ `\n` เป็น literal string แล้วโค้ด `.replace(/\\n/g, '\n')` ตอนใช้งาน — ทำให้แล้วใน `server/utils/googleSheets.ts`)

## 8. ความปลอดภัยและข้อควรระวัง

- Private key อยู่ฝั่ง server เท่านั้น (`server/` ของ Nuxt ไม่ถูก bundle ไปที่ client) — ห้ามใส่ค่าพวกนี้ใน `runtimeConfig.public`
- ควรเพิ่ม rate limiting หรือ basic App Check/secret header ระหว่าง mobile app กับ API เพื่อกัน bot ยิง endpoint นี้รัว ๆ (สร้างสมาชิกปลอมจำนวนมาก) — ยังไม่ implement ในโค้ดตัวอย่างนี้ แนะนำให้เพิ่มก่อนขึ้น production จริง
- เบอร์โทรศัพท์และชื่อ-นามสกุลถือเป็นข้อมูลส่วนบุคคล ควรพิจารณาเรื่อง PDPA เช่น แจ้งวัตถุประสงค์การเก็บข้อมูล และจำกัดสิทธิ์การเข้าถึง Sheet เฉพาะคนที่จำเป็น
