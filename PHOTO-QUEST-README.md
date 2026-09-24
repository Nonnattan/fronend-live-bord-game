# Photo Detection Quest — README (ไฟล์ใหม่)

ระบบเควสถ่ายรูปที่เพิ่มเข้ามาในโฟลเดอร์นี้ **ไม่แก้ไฟล์เดิมของระบบ QR/Station/
Score/Offline First เลย** (มีแก้เพิ่ม 2 ไฟล์แบบ additive-only: `useMemberApi.ts`
เพิ่มฟังก์ชันใหม่ต่อท้าย, `Code.gs` เพิ่ม case ใหม่ใน switch — ไม่มีบรรทัดเดิม
ถูกลบ/แก้ไข)

## ไฟล์ที่เพิ่มเข้ามาทั้งหมด

```
types/photoQuest.ts
services/detection/types.ts
services/detection/detectionEngine.ts
services/detection/providers/colorProvider.ts
services/detection/providers/objectDetectionProvider.ts
composables/usePhotoQuest.ts
composables/useOfflinePhotoQuestSync.ts
components/photo-quest/QuestCard.vue
components/photo-quest/CameraCapture.vue
components/photo-quest/ResultFeedback.vue
pages/photo-quest.vue
pages/photo-quest/[id].vue
server-gas/PhotoQuestService.gs
```

## ก่อนใช้งานจริง

1. **Deploy server-gas ใหม่**: เปิด Google Apps Script Editor ของโปรเจกต์เดิม
   วางเนื้อหาไฟล์ `server-gas/PhotoQuestService.gs` เป็นไฟล์ใหม่ในโปรเจกต์
   (เหมือน SideQuestsService.gs เดิม) แล้ว copy ส่วนที่แก้ใน `Code.gs` (case
   `listPhotoQuests` / `completePhotoQuest` / ฯลฯ ใน `handleRequest_()` และ
   บรรทัด `photoQuestServiceLoaded` ใน ping) เข้าไปทับของเดิม จากนั้น
   **Deploy > Manage deployments > Edit > Version: New version > Deploy**
   (จุดนี้เคยเป็นสาเหตุบั๊กใหญ่ของระบบเดิมมาก่อน — ดู README เดิมของ
   `server-gas/README.md` หัวข้อ Deploy)

2. **สร้างข้อมูลเควสในชีต "PhotoQuests"**: ชีตจะถูกสร้างอัตโนมัติพร้อม header
   ตอนเรียก action ครั้งแรก แต่ยังไม่มีแถวข้อมูล — ต้องเพิ่มแถวเองใน Google
   Sheet ตามคอลัมน์: `Id | Name | Description | Points | Active |
   DetectionType | Target | Confidence | Provider | ExampleImageUrl |
   UpdatedAt`

   ตัวอย่างแถวที่ใช้งานได้จริงทันที (detectionType ที่ implement แล้วใน Phase 1
   คือ `color` และ `image_condition` เท่านั้น — ดูหัวข้อถัดไป):

   ```
   PQ-DEMO-001 | ถ่ายท้องฟ้าสีฟ้า | ถ่ายรูปท้องฟ้าให้เห็นสีฟ้าชัดเจน | 100 | TRUE | color | #4a90d9 | 0.55 | | |
   ```

3. **เพิ่มทางเข้าเมนู**: ยังไม่ได้แก้ `components/BottomNav.vue` หรือ
   `pages/home.vue` เพราะเป็น UI ที่ผู้ใช้ต้องเลือกเองว่าจะวางปุ่มตรงไหน
   (นำทางไปหน้า `/photo-quest`) — เพิ่มลิงก์/ปุ่มเดียวชี้ไปที่นั่นได้เลย เช่น
   `<NuxtLink to="/photo-quest">เควสถ่ายรูป</NuxtLink>` ไม่กระทบเมนูเดิม

## Detection Type ที่ทำงานได้จริง (อัปเดตหลัง Phase 2)

| detectionType | สถานะ |
|---|---|
| `color` | ✅ ทำงานจริง offline 100% (canvas pixel analysis — `services/detection/providers/colorProvider.ts`) |
| `image_condition` (target: `min-brightness`) | ✅ ทำงานจริง offline 100% |
| `object` / `specific_object` / `person` | ✅ **ทำงานจริงแล้ว** — TensorFlow.js + COCO-SSD (`services/detection/providers/cocoSsdProvider.ts`) ต้องมีเน็ต "ครั้งแรกครั้งเดียว" เพื่อโหลดโมเดล ~6 MB จากนั้นออฟไลน์ได้ตลอด |
| `ocr` | ยังไม่ได้ลงทะเบียน provider เลย — เพิ่มได้ทันทีตามสัญญาใน `services/detection/types.ts` |

---

# Phase 2 — Object Detection จริง (TensorFlow.js + COCO-SSD)

## ไฟล์ที่เพิ่ม/แก้ในรอบนี้

```
services/detection/providers/cocoSsdProvider.ts   (ใหม่)  ตัวตรวจจับจริง
services/detection/providers/cocoLabels.ts        (ใหม่)  ตารางแปลง label ไทย <-> อังกฤษ + กลุ่มหมวดหมู่
services/photoQuestMockData.ts                    (ใหม่)  เควสตัวอย่างช่วงพัฒนา (ลบทิ้งได้เมื่อชีตพร้อม)
services/detection/detectionEngine.ts             (แก้)   ลงทะเบียน provider ใหม่ + export preload/init
services/detection/providers/objectDetectionProvider.ts (แก้เฉพาะคอมเมนต์) stub เดิม ยังอยู่ครบ
composables/usePhotoQuest.ts                      (แก้)   mock fallback + preload โมเดล + usingMockData
pages/photo-quest.vue                             (แก้)   ป้ายเตือน "กำลังใช้ข้อมูลตัวอย่าง"
service-worker/sw.ts                              (แก้)   route ใหม่ข้อ 5.1 cache ไฟล์โมเดลถาวร
nuxt.config.ts                                    (แก้)   prerender /photo-quest + globPatterns + ขยายลิมิตไฟล์
```

Dependency ที่เพิ่ม: `@tensorflow/tfjs-core`, `@tensorflow/tfjs-converter`,
`@tensorflow/tfjs-backend-webgl`, `@tensorflow/tfjs-backend-cpu`,
`@tensorflow-models/coco-ssd` (จงใจ **ไม่ใช้** `@tensorflow/tfjs` ตัวเต็ม เพราะ
ลากทุก backend/ops ที่ไม่ได้ใช้มาด้วย ทำให้ bundle ใหญ่เกินจำเป็น)

## 80 สิ่งที่ตรวจได้ + วิธีกรอก `Target` ในชีต

โมเดล COCO-SSD รู้จัก 80 คลาส (คน, วัว, แกะ, ม้า, นก, หมา, แมว, ช้าง, ต้นไม้ใน
กระถาง, ขวด, แก้ว, รถ, จักรยาน, กล้วย, แอปเปิล, เก้าอี้, โทรศัพท์, หนังสือ ฯลฯ)
ช่อง `Target` กรอกได้ 3 แบบ — ดูรายชื่อเต็มที่ `services/detection/providers/cocoLabels.ts`

| แบบ | ตัวอย่าง | ความหมาย |
|---|---|---|
| ชื่อเดี่ยว (ไทยหรืออังกฤษก็ได้) | `วัว` / `cow` / `ขวดน้ำ` | ต้องเจอสิ่งนั้น |
| ชื่อกลุ่ม | `สัตว์ในฟาร์ม` / `animal` / `ผลไม้` / `any` | เจออะไรก็ได้ในกลุ่มนั้น |
| หลายค่าคั่น `,` หรือ `|` | `วัว\|แกะ\|ม้า` | เจออย่างใดอย่างหนึ่ง |

`Confidence` แนะนำ **0.5–0.6** สำหรับวัตถุทั่วไป (สูงเกิน 0.75 ผู้เล่นจะถ่ายไม่ผ่าน
บ่อยมากในสภาพแสงกลางแจ้งจริง) ส่วน `person` ใช้ 0.6 ได้สบาย ๆ เพราะโมเดลแม่นกับคนมาก

## ข้อจำกัดที่ต้องรู้ก่อนออกแบบเควสจริง

- **ไม่มีคลาส "ต้นไม้ใหญ่"** — COCO มีแค่ `potted plant` (ต้นไม้ในกระถาง)
  เควสแนว "ถ่ายต้นไม้ในสวน" จะไม่ผ่าน ให้ใช้ `color` (เขียว) แทน หรือขยับไป
  Teachable Machine (ดูหัวข้อถัดไป)
- **ไม่มีคลาสเฉพาะของฟาร์ม** — ป้ายฐาน, แปลงผักเฉพาะ, ผลผลิตท้องถิ่น ไม่มีในโมเดลนี้
- **ควาย** ถูกโมเดลมองเป็น `cow` (แมปให้แล้วใน `cocoLabels.ts`)
- ครั้งแรกต้องมีเน็ตเพื่อโหลดโมเดล — `usePhotoQuest.initPhotoQuest()` จะ preload
  ให้อัตโนมัติตั้งแต่เข้าหน้ารายการเควส (เฉพาะตอนออนไลน์ และเฉพาะเมื่อมีเควสที่
  ใช้โมเดลจริง) ผู้เล่นจึงไม่ต้องรอตอนกดถ่าย

## ถ้าต้องการตรวจของเฉพาะในฟาร์ม (Phase 3)

ใช้ [Teachable Machine](https://teachablemachine.withgoogle.com/) ถ่ายรูปตัวอย่าง
คลาสละ 30–50 รูป → Export เป็น TensorFlow.js → วางไฟล์ที่ `public/models/<ชื่อ>/`
→ เขียน provider ใหม่ 1 ไฟล์ (ก็อป `cocoSsdProvider.ts` มาแก้ `modelUrl`) →
เพิ่มใน `PROVIDERS` 1 บรรทัด — โมเดลจะถูก precache ตั้งแต่ตอน build เลย
(globPatterns/ลิมิตขนาดไฟล์ใน `nuxt.config.ts` เตรียมรองรับไว้แล้ว) ไม่ต้อง
พึ่ง CDN ภายนอกอีก และใช้ออฟไลน์ได้ตั้งแต่ครั้งแรก

## ข้อมูลตัวอย่าง (Mock) ช่วงพัฒนา

ถ้าชีต "PhotoQuests" ยังว่าง/ยังไม่ deploy แอปจะแสดงเควสตัวอย่าง 6 ตัวจาก
`services/photoQuestMockData.ts` พร้อมป้ายกำกับ "กำลังแสดงเควสตัวอย่าง (Mock)"
ที่หัวหน้ารายการ — **ข้อมูลจริงจากชีตชนะเสมอ** ไม่ต้องแก้โค้ดตอนสลับไปใช้ของจริง
เมื่อพร้อมแล้วลบไฟล์ mock + บล็อก `applyMockFallback()` ใน `usePhotoQuest.ts` ได้เลย
(คัดลอกค่าในไฟล์ mock ไปวางเป็นแถวในชีตได้ตรง ๆ คอลัมน์ตรงกันทุกช่อง)

## เพิ่ม Detection Type ใหม่ในอนาคต

1. สร้างไฟล์ใหม่ใน `services/detection/providers/` ที่ implement
   `DetectionProvider` interface (ดู `services/detection/types.ts`)
2. เพิ่มเข้า array `PROVIDERS` ใน `services/detection/detectionEngine.ts`
   บรรทัดเดียว
3. ไม่ต้องแก้ `usePhotoQuest.ts`, หน้า UI, หรือ `PhotoQuestService.gs` เลย —
   แค่ใส่ค่า `detectionType`/`target`/`confidence`/`provider` ที่ถูกต้องในชีต
   "PhotoQuests" เท่านั้น
