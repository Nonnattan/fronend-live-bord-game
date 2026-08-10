# เช็คลิสต์ก่อน Deploy (อ่านก่อนถามว่าทำไมยังเข้าไม่ได้)

สรุปจากการตรวจโค้ดทั้งฝั่ง frontend เกม (`fronend-live-bord-game`) และ backend
admin จัดการฐาน/เควส (`backend-liveboradgame`) แบบละเอียดแล้ว **โค้ดทั้งสอง
โปรเจกต์ไม่มีบั๊กครับ** ปัญหาที่เจอทุกครั้งจนถึงตอนนี้เกิดจากขั้นตอน deploy/ตั้งค่า
ที่อยู่ "นอกโค้ด" ล้วน ๆ — ไฟล์นี้สรุปทุกจุดที่ต้องเช็ครวมไว้ที่เดียว กันงงว่าต้องกลับมา
เช็คอะไรอีก

## สิ่งที่แก้ในรอบนี้ (โค้ดจริง ๆ)

- `server-gas/Code.gs`: เพิ่ม field ใหม่ในผลลัพธ์ของ `?action=ping` คือ
  `stationsServiceLoaded` / `sideQuestsServiceLoaded` (true/false) — เช็คได้
  ทันทีจาก ping ครั้งเดียวว่าไฟล์ `StationsService.gs`/`SideQuestsService.gs`
  ถูกเพิ่มเข้า Apps Script deployment ที่ใช้งานอยู่จริงหรือยัง ไม่ต้องเดา/ทดสอบ
  ยิง action อื่นแยกอีกต่อไป (ดูหัวข้อ 1 ด้านล่างวิธีใช้)
- อัปเดต `DEPLOYED_CODE_VERSION_` เป็น `2026-08-09-stations-sidequests-ping-diagnostics`
  เพื่อให้ ping แยกแยะได้ชัดว่า deployment ที่ใช้งานอยู่เป็นเวอร์ชันล่าสุดจริงไหม
- Sync ไฟล์ `Code.gs` เดียวกันนี้ไปไว้ที่ `backend-liveboradgame/apps-script/Code.gs`
  ด้วยแล้ว (ทั้งคู่ต้องเหมือนกันเป๊ะเสมอ เพราะเป็น Apps Script ตัวเดียวกัน)

## 1) เช็ค Apps Script (ตัวเดียว ใช้ร่วมกันทั้ง 2 โปรเจกต์)

เปิด URL นี้ในเบราว์เซอร์ (ใส่ `/exec` ของคุณเอง):

```
https://script.google.com/macros/s/XXXXXXXX/exec?action=ping
```

ต้องเห็นครบทุกข้อนี้ถึงจะพร้อมใช้งานจริง:

- [ ] `deployedCodeVersion` = `"2026-08-09-stations-sidequests-ping-diagnostics"`
- [ ] `membersSheetFound` = `true`
- [ ] `stationsServiceLoaded` = `true`
- [ ] `sideQuestsServiceLoaded` = `true`

ถ้าข้อไหนไม่ตรง แปลว่ายังไม่ได้:
1. เปิด Google Sheet ที่ใช้จริง → Extensions > Apps Script
2. วางไฟล์ `server-gas/Code.gs`, `StationsService.gs`, `SideQuestsService.gs`,
   `JourneyService.gs`, `ScoreService.gs`, `CheckinService.gs` (ทั้งหมดในโฟลเดอร์
   `server-gas/` ของโปรเจกต์นี้) เข้าไปใน Apps Script editor ให้ครบ (สร้างไฟล์ใหม่ถ้ายังไม่มี)
3. Deploy > **Manage deployments** (ห้ามกด "New deployment" เด็ดขาด เพราะจะได้ URL
   ใหม่ที่ไม่ตรงกับ `.env` เดิม) > คลิกไอคอนดินสอ > Version: **New version** > Deploy
4. Who has access ต้องเป็น **Anyone** ไม่ใช่ "Anyone with Google account"

## 2) เช็ค Frontend เกม (Cloudflare Workers)

โปรเจกต์นี้เป็น **static site** — Cloudflare ไม่ได้อ่าน `.env` เองตอน deploy
ค่าถูกฝังตอน build ในเครื่องเท่านั้น

- [ ] `.env` มี `API_BASE_URL` ตรงกับ URL ที่ ping ผ่านในข้อ 1
- [ ] รัน `npm run generate` ใหม่ในเครื่อง (Nuxt 4 เอาต์พุตออกที่ `.output/public`
      **ไม่ใช่** `dist`)
- [ ] เอาโฟลเดอร์ `.output/public` (ไม่ใช่ `dist`) ไปอัปโหลดใหม่ผ่านปุ่ม
      "New deployment" ใน Cloudflare Dashboard
- [ ] ทดสอบใน LINE: ปิดแอป LINE ให้สนิท (swipe ออก) ก่อนเปิดใหม่ทุกครั้งหลัง deploy
      (กัน cache หน้าเว็บเก่าค้าง)

## 3) เช็ค Backend Admin (backend-liveboradgame)

โปรเจกต์นี้เป็น Nuxt server app (มี `server/api/*`) ต้องรันบนโฮสติ้งที่รองรับ
Node.js server จริง (Vercel/Node hosting ฯลฯ) ใช้วิธีอัปโหลด static แบบ
frontend เกมไม่ได้

- [ ] `.env` มี `APPS_SCRIPT_URL` ตรงกับ URL เดียวกับข้อ 1 (`API_BASE_URL` ของ
      frontend เกม)
- [ ] ถ้า deploy ขึ้นโฮสติ้งจริงแล้ว ต้องไปตั้งค่า `APPS_SCRIPT_URL` เป็น
      **Environment Variable ในหน้า Dashboard ของโฮสติ้งนั้นเอง** ด้วย (ไม่ใช่
      แค่ไฟล์ `.env` ในเครื่อง) แล้ว redeploy ให้ค่าตัวแปรมีผลจริง
- [ ] ทดสอบเปิดหน้า `/admin/stations` แล้วลองกดเพิ่มฐานใหม่ดู ถ้าเขียนชีตไม่ได้
      ให้เช็ค error message ที่ขึ้นมา (โค้ดโยน error message ที่อ่านเข้าใจง่ายไว้แล้ว
      ทุกจุดใน `server/utils/appsScriptClient.ts`)
