# Offline Mode (ใหม่) — สรุปสิ่งที่เพิ่ม/แก้ไข

ระบบนี้แยกขาดจาก `OFFLINE-SYNC.md` เดิมโดยสิ้นเชิง (ระบบเดิม = เล่นออฟไลน์ได้
แล้วแอบ sync ขึ้น Google Sheet ทันทีที่มีเน็ต) — Offline Mode ใหม่นี้คือ
**"ล็อกทั้ง Session ห้ามสลับกลับ Online เด็ดขาด"** ตามสเปกที่ขอมา ไม่แตะ/ไม่
เรียกใช้ระบบเดิม หรือ Backend (`server-gas/*`) เลยแม้แต่จุดเดียว

## ไฟล์ใหม่

- **`composables/useOfflineMode.ts`** — หัวใจของระบบ
  - `checkAndLockOfflineMode()` — เช็ค Internet ทันทีตอนเข้าเว็บ ไม่มี ->
    ล็อกเข้า Offline Mode + จำไว้ที่ `sessionStorage` (คนละ key กับ LocalStorage)
    เคยล็อกไว้แล้วใน Session นี้ -> ล็อกต่อทันที ไม่เช็ค `navigator.onLine`
    ซ้ำอีก (กันสลับกลับ Online แม้เน็ตจะกลับมาระหว่างใช้งาน)
  - `startRound(uid)` / `logStationScan(stationId, stationName)` / `endRound()`
    — บันทึก `round_datetime.start/end` + Log การสแกน (stationId, stationName,
    scanTime, ลำดับฐาน) ลง LocalStorage (key: `offlineMode:roundData`)
- **`plugins/offline-mode.client.ts`** — เรียก `checkAndLockOfflineMode()`
  ครั้งเดียวตอนแอปเริ่มทำงาน (ก่อนหน้าไหน ๆ mount)
- **`components/OfflineSummaryCard.vue`** — Card สรุปการเล่น (ข้อ 11) แสดงใน
  หน้า Profile: Offline Mode, UID, เวลาเริ่ม/จบ, จำนวน+รายชื่อฐานที่เล่น,
  ฐานที่เหลือ

## ไฟล์ที่แก้ไข (แบบเพิ่มเติมเท่านั้น ไม่ลบของเดิม)

- **`pages/index.vue`** — ถ้าอยู่ Offline Mode: ข้าม `initAuth()`/LIFF ทั้งหมด
  (ไม่มีเน็ตอยู่แล้ว), ส่ง `offline-mode` prop ให้ `<ProfileForm>`, เรียก
  `startRound(uid)` ทันทีหลังลงทะเบียนเสร็จ (ข้อ 6-7)
- **`components/ProfileForm.vue`** — ถ้า `offlineMode` prop เป็น true: ข้าม
  `syncMember()` (เรียก Backend) ทั้งหมด บันทึกด้วย `saveProfile()` ตรง ๆ
  ลง LocalStorage เท่านั้น (uid ใช้ค่าเดิมจาก `useAuth.ts -> loginAsGuest()`
  ซึ่งเป็น Unix Timestamp 10 หลักอยู่แล้ว ตรงสเปกข้อ 6 โดยไม่ต้องสร้างซ้ำ)
- **`pages/scan.vue`** — ถ้า Offline Mode: ข้าม `queueCheckin()`/`syncNow()`
  (ระบบ Online เดิม) ทั้งหมด ใช้ `logStationScan()` แทน (ข้อ 8), ข้อความ
  feedback ไม่โชว์ Point (ข้อ 9), เรียก `endRound()` เมื่อผ่านครบทุกฐาน
  (ข้อ 10), และซ่อนการ์ด Sync เดิม (แสดง Badge "โหมดออฟไลน์" แทน)
- **`pages/home.vue`**, **`pages/map.vue`**, **`components/map/MiniMap.vue`**,
  **`pages/profile.vue`**, **`pages/history.vue`** — ซ่อนตัวเลขคะแนน/Point
  ทุกจุดเมื่อ Offline Mode (ข้อ 9) ด้วย `v-if="!isOfflineMode"` ("เข้าฐานแล้ว
  X/Y" ยังแสดงได้ปกติ เพราะเป็น progress ไม่ใช่คะแนน)
- **`pages/profile.vue`** — เพิ่ม `<OfflineSummaryCard>` ใต้ Profile Card เดิม
  (แสดงเฉพาะตอนมีข้อมูลรอบ Offline Mode ใน LocalStorage จริงเท่านั้น —
  โหลดด้วย `loadRoundData()` ทุกครั้งที่เข้าหน้านี้ ไม่ผูกกับสถานะ Session
  ปัจจุบัน เพื่อให้เห็นประวัติรอบก่อนหน้าได้แม้ตอนนี้จะกลับมามีเน็ตแล้ว)

## จุดที่ตั้งใจไม่แก้ (ตามข้อกำหนด)

- **Backend** (`server-gas/*`) — ไม่แตะเลย
- **ระบบ Online เดิม** (`useOfflineSync.ts`, `plugins/offline-sync.client.ts`,
  `useMemberApi.ts`) — ไม่เรียกใช้ในเส้นทาง Offline Mode เลย เพราะไม่มีการ
  เรียก `queueCheckin()` ทำให้ Auto-sync เดิม (ที่เช็ค `hasPending` ก่อนเสมอ)
  ไม่มีอะไรให้ sync อยู่แล้วโดยอัตโนมัติ ไม่ต้องแก้ไฟล์นั้นเพิ่ม
- **LINE Login (LIFF)** — ยังต้องใช้ Internet เสมอโดยธรรมชาติของ OAuth ใน
  Offline Mode ปุ่ม LINE ยังแสดงตาม UI เดิม (ไม่ซ่อน) แต่กดแล้วจะไม่สำเร็จถ้า
  ไม่มีเน็ตจริง ๆ — ผู้เล่น Offline Mode ควรใช้ปุ่ม "เข้าใช้งานโดยไม่เชื่อม LINE"
  (Guest) ซึ่งทำงานได้ 100% โดยไม่พึ่งเน็ตอยู่แล้ว
