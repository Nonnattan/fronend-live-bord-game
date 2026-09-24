# Offline Mode (ใหม่) — สรุปสิ่งที่เพิ่ม/แก้ไข

ระบบนี้แยกขาดจาก `OFFLINE-SYNC.md` เดิมโดยสิ้นเชิง (ระบบเดิม = เล่นออฟไลน์ได้
แล้วแอบ sync ขึ้น Google Sheet ทันทีที่มีเน็ต) — Offline Mode ใหม่นี้คือ
**"ล็อกทั้ง Session ห้ามสลับกลับ Online เด็ดขาด"** ตามสเปกที่ขอมา ไม่แตะ/ไม่
เรียกใช้ระบบเดิม หรือ Backend (`server-gas/*`) เลยแม้แต่จุดเดียว

## ไฟล์ใหม่

- **`composables/useOfflineMode.ts`** — หัวใจของระบบ
  - `checkAndLockOfflineMode()` — เช็ค Internet ทันทีตอนเข้าเว็บ
    - เคยล็อก Offline Mode ไว้แล้วใน Session นี้ (`sessionStorage`) -> ล็อกต่อ
      ทันที ไม่เช็ค `navigator.onLine` ซ้ำอีก (กันสลับกลับ Online แม้เน็ตจะ
      กลับมาระหว่างใช้งาน) ไม่ต้องแสดงหน้ายืนยันซ้ำ
    - ยังไม่เคยล็อก + ไม่มี Internet -> **ยังไม่ล็อกทันที** แค่ตั้ง
      `offlineGatePending = true` เพื่อให้ `app.vue` แสดง
      `<OfflineGateScreen />` เพียงหน้าเดียว (ข้อ 2-4) รอผู้ใช้กดปุ่มยืนยัน
      ก่อน
  - `confirmOfflineMode()` — เรียกเมื่อผู้ใช้กดปุ่ม "เข้าโหมด Offline" ที่
    `<OfflineGateScreen />` เท่านั้น (ข้อ 5) เป็นจุดเดียวที่เขียน
    `sessionStorage` ล็อก Session เข้า Offline Mode จริง
  - `startRound(uid)` / `logStationScan(stationId, stationName)` / `endRound()`
    — บันทึก `round_datetime.start/end` + Log การสแกน (stationId, stationName,
    scanTime, ลำดับฐาน) ลง LocalStorage (key: `offlineMode:roundData`)
- **`plugins/offline-mode.client.ts`** — เรียก `checkAndLockOfflineMode()`
  ครั้งเดียวตอนแอปเริ่มทำงาน (ก่อนหน้าไหน ๆ mount)
- **`components/OfflineGateScreen.vue`** — หน้ายืนยันก่อนเข้า Offline Mode
  (ข้อ 2-4) แสดงข้อความ "ขณะนี้คุณกำลังใช้งานในโหมด Offline" อธิบายว่าข้อมูล
  จะถูกเก็บไว้ในเครื่องและยังไม่มีการส่งข้อมูล/คำนวณคะแนน พร้อมปุ่มเดียวคือ
  "เข้าโหมด Offline" — `app.vue` แสดง Component นี้แทน `<NuxtLayout>`/
  `<NuxtPage>` ทั้งหมดตราบใดที่ `offlineGatePending` เป็น `true` (บล็อกทุก
  หน้า/ทุก URL จนกว่าจะกดยืนยัน)
- **`components/OfflineSummaryCard.vue`** — Card สรุปการเล่น (ข้อ 11) แสดงใน
  หน้า Profile: Offline Mode, UID, เวลาเริ่ม/จบ, จำนวน+รายชื่อฐานที่เล่น,
  ฐานที่เหลือ

## ไฟล์ที่แก้ไข (แบบเพิ่มเติมเท่านั้น ไม่ลบของเดิม)

- **`app.vue`** — เพิ่มการเช็ค `offlineGatePending` ที่จุดสูงสุดของแอป (เหนือ
  ทุก Route/Layout) แสดง `<OfflineGateScreen />` แทนทุกอย่างเมื่อยังไม่ได้
  ยืนยันเข้า Offline Mode (ข้อ 2)
- **`pages/index.vue`** — ถ้าอยู่ Offline Mode (ยืนยันผ่าน Gate แล้ว): ข้าม
  `initAuth()`/LIFF ทั้งหมด (ไม่มีเน็ตอยู่แล้ว), ส่ง `offline-mode` prop ให้
  `<ProfileForm>`, เรียก `startRound(uid)` ทันทีหลังลงทะเบียนเสร็จ (ข้อ 6-7)
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
