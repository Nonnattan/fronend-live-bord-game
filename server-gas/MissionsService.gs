/**
 * MissionsService.gs
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Backend Contract ของ "ภารกิจของฐาน" (Mission) ตาม Flow ใหม่:
 *
 *   Scan Station QR -> verifyStationQr -> ได้ stationId -> Frontend ปลดล็อคฐาน
 *   -> ผู้เล่นกดเข้าฐาน -> listStationMissions(stationId) -> ได้ 3 ภารกิจ
 *      (smell/question/qr) -> เล่นภารกิจ:
 *        - smell/question ใช้ระบบคำถามเดิม (listQuestions/submitAnswer ของ
 *          QuestionService.gs) คะแนนมาจาก Question เท่านั้น
 *        - qr ใช้ verifyMissionQr ด้านล่าง (ไม่มีคะแนน — ตรวจสอบอย่างเดียว)
 *
 * *** ไม่สร้างชีตใหม่ *** — Mission ไม่ใช่ entity ที่มีแถวของตัวเองในสเปรดชีต
 * ทุกฐานที่ active มี 3 ภารกิจตายตัวเสมอ (smell/question/qr เรียง order 1/2/3
 * ข้อความเดียวกับที่ frontend ใช้อยู่แล้วใน utils/stationMissionMeta.ts) จึง
 * "คำนวณสด" จากข้อมูลฐาน (StationsService.gs) ทุกครั้งที่เรียก ไม่ persist เป็น
 * แถวแยก — Id ของ mission คำนวณได้เสมอ (deterministic) รูปแบบ "<stationId>-<kind>"
 * เช่น "STN-ABC123-smell" ไม่ใช่ id สุ่มที่ต้องเก็บไว้ที่ไหน
 *
 * *** ไม่แตะไฟล์ service เดิมเลยสักไฟล์ *** — อ่านข้อมูลฐานผ่าน
 * getStationsSheet_()/getStationById_() ที่มีอยู่แล้วใน StationsService.gs
 * เท่านั้น (เหมือนที่ CheckinService.gs เรียกใช้ RoundService.gs) เชื่อมเข้าระบบ
 * เดิมแค่จุดเดียวคือเพิ่ม 2 case ใหม่ใน router ของ Code.gs
 *
 * คะแนน: ไฟล์นี้ "ไม่รู้จัก" ชีต Score/Journey/Answers เลย และไม่เรียก
 * upsertScore_()/actionCheckin_() ใด ๆ ทั้งสิ้น — ภารกิจ qr (verifyMissionQr)
 * ไม่มีคะแนนตามสเปก (คะแนนของภารกิจ smell/question มาจาก submitAnswer() ของ
 * QuestionService.gs เพียงทางเดียวเท่านั้น — ดู Questions.Points)
 *
 * Mission QR แยกจาก Station QR เด็ดขาด: Station QR ใช้คอลัมน์ "QrToken" ของเดิม
 * (ผูกกับ action 'verifyStationQr' — ยืนยันตัวฐาน) ส่วน Mission QR (เฉพาะภารกิจ
 * type 'qr') ใช้คอลัมน์ใหม่ "MissionQrToken" (เพิ่มใน StationsService.gs — ดู
 * generateMissionQrToken_/backfillMissingMissionQrTokens_) คนละค่ากันเสมอต่อให้
 * เป็นฐานเดียวกัน — พิมพ์ QR 2 ใบแยกกันติดหน้างาน (ป้ายฐาน vs จุดภารกิจสแกน QR
 * ภายในฐาน)
 *
 * Mission Completion (roundId/missionId/completedAt/userId): "ยังไม่บันทึก" ใน
 * รอบนี้ตามสเปก — actionVerifyMissionQr_ ตรวจสอบแล้วตอบผลกลับไปเฉย ๆ ไม่เขียน
 * ข้อมูลใด ๆ ทั้งสิ้น ส่วนการบันทึกค่อยเพิ่มเป็น Step ถัดไปเมื่อกำหนด Storage แล้ว
 */

/** ข้อความ/ลำดับของภารกิจ 3 ชนิด — ใช้ชุดเดียวกับที่ frontend แสดงผลอยู่แล้ว (ดู
 * utils/stationMissionMeta.ts ของฝั่ง Frontend) เพื่อไม่ให้ข้อความเพี้ยนกันระหว่าง
 * Mock UI ปัจจุบันกับ Backend Contract ที่เตรียมไว้รอบนี้ — รอบถัดไปตอนเปลี่ยนจาก
 * Mock มาเรียก API จริง ข้อความจะตรงกันทุกตัวอักษรทันที ไม่ต้องแก้ Component ฝั่ง
 * UI เลย */
var MISSION_KIND_ORDER_ = ["smell", "question", "qr"];
var MISSION_META_ = {
  smell: {
    order: 1,
    title: "ภารกิจดมกลิ่น",
    description: "ลองดมกลิ่นจากจุดกิจกรรม แล้วตอบคำถาม",
  },
  question: {
    order: 2,
    title: "ภารกิจตอบคำถาม",
    description: "ตอบคำถามเกี่ยวกับฐานนี้",
  },
  qr: {
    order: 3,
    title: "ภารกิจสแกน QR",
    description: "ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ",
  },
};

/** สร้าง missionId แบบ deterministic จาก stationId+kind — ใช้ทั้งตอนสร้างลิสต์
 * (actionListStationMissions_) และตอนตรวจสอบ (actionVerifyMissionQr_) เพื่อการันตี
 * ว่าเทียบกันตรงเสมอ โดยไม่ต้อง persist ไว้ที่ไหนเลย */
function buildMissionId_(stationId, kind) {
  return stationId + "-" + kind;
}

/**
 * action 'listStationMissions' — คืนภารกิจทั้ง 3 ของฐานที่ระบุ (ไม่เขียนข้อมูล)
 * Payload: { stationId }
 *
 * ตรวจสอบว่า stationId มีอยู่จริงในชีต Stations ก่อนเสมอ (ไม่เชื่อค่าจาก Frontend
 * ตรง ๆ) — ไม่พบ/ฐานปิดใช้งานอยู่ -> success:false (เหมือน actionVerifyStationQr_
 * ทุกประการ: ฐานที่ปิดใช้งานไม่ควรเปิดดูภารกิจได้)
 */
function actionListStationMissions_(payload) {
  const stationId = normalize_(payload && payload.stationId);
  if (!stationId) {
    return { success: false, error: "stationId จำเป็นต้องส่งมา" };
  }

  const sheet = getStationsSheet_();
  const station = getStationById_(sheet, stationId);
  if (!station) {
    return { success: false, error: "ไม่พบฐานตาม stationId ที่ระบุ" };
  }
  if (!station.active) {
    return { success: false, error: "ฐานนี้ปิดใช้งานอยู่ในขณะนี้" };
  }

  const missions = MISSION_KIND_ORDER_.map(function (kind) {
    const meta = MISSION_META_[kind];
    const mission = {
      id: buildMissionId_(station.id, kind),
      stationId: station.id,
      order: meta.order,
      type: kind,
      title: meta.title,
      description: meta.description,
      active: true,
    };
    // เฉพาะภารกิจ 'qr' เท่านั้นที่มี QR token ให้ตรวจสอบ (ดู verifyMissionQr) —
    // แนบมาด้วยเพื่อให้ทดสอบ/ตรวจสอบได้ตรงจาก API ในรอบนี้ (ยังไม่มีหน้า Admin ให้
    // พิมพ์ QR ภารกิจ) เป็น field เสริมเพิ่มเติม ไม่กระทบ field ที่สเปกกำหนดไว้เดิม
    if (kind === "qr") mission.qrToken = station.missionQrToken;
    return mission;
  });

  return { success: true, stationId: station.id, missions: missions };
}

/**
 * action 'verifyMissionQr' — ตรวจสอบ QR ของภารกิจ "สแกน QR ภายในฐาน" (คนละ QR กับ
 * Station QR ของ verifyStationQr เด็ดขาด — ดูหัวไฟล์) ไม่เขียนข้อมูลใด ๆ ไม่เพิ่ม
 * คะแนนทั้งสิ้น (ตามสเปก QR Mission ต้องไม่ให้คะแนน)
 *
 * Payload: { qrToken, stationId, missionId }
 *
 * ตรวจตามลำดับ (ไม่เชื่อค่าจาก Frontend ตรง ๆ สักจุด):
 *   1) มี stationId/missionId/qrToken ครบหรือไม่
 *   2) stationId มีฐานอยู่จริงหรือไม่ + ฐาน active อยู่หรือไม่
 *   3) missionId ที่ส่งมาตรงกับภารกิจ 'qr' ของฐานนี้จริงหรือไม่ (กัน missionId ของ
 *      ฐานอื่น/ของภารกิจ smell-question ปนมา — ตรงข้อกำหนด "Mission อยู่ใน Station
 *      เดียวกัน" และ "เป็นของ Mission ที่ระบุ")
 *   4) qrToken ตรงกับ MissionQrToken ที่บันทึกไว้ของฐานนี้หรือไม่ (ไม่ใช่
 *      Stations.qrToken เด็ดขาด)
 */
function actionVerifyMissionQr_(payload) {
  const stationId = normalize_(payload && payload.stationId);
  const missionId = normalize_(payload && payload.missionId);
  const qrToken = normalize_(payload && payload.qrToken);

  if (!stationId || !missionId || !qrToken) {
    return {
      success: false,
      error: "qrToken, stationId และ missionId จำเป็นต้องส่งมาทั้งหมด",
    };
  }

  const sheet = getStationsSheet_();
  const station = getStationById_(sheet, stationId);
  if (!station) {
    return { success: false, error: "ไม่พบฐานตาม stationId ที่ระบุ" };
  }
  if (!station.active) {
    return { success: false, error: "ฐานนี้ปิดใช้งานอยู่ในขณะนี้" };
  }

  const expectedMissionId = buildMissionId_(station.id, "qr");
  if (missionId !== expectedMissionId) {
    return {
      success: false,
      error: "missionId นี้ไม่ใช่ภารกิจสแกน QR ของฐานนี้",
    };
  }

  if (
    !station.missionQrToken ||
    qrToken !== normalize_(station.missionQrToken)
  ) {
    return {
      success: false,
      error: "QR ภารกิจนี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ",
    };
  }

  // *** ห้ามเพิ่มคะแนน/บันทึกอะไรทั้งสิ้นตรงนี้ *** ตามสเปก QR Mission ต้องไม่ให้
  // คะแนน และยังไม่กำหนด Storage สำหรับ Mission Completion ในรอบนี้ (ดูหัวไฟล์ +
  // README.md) — คืนแค่ผลตรวจสอบเฉย ๆ ให้ Frontend เก็บสถานะ completed เอง (Mock
  // State เหมือน composables/useStationQuest.ts ปัจจุบัน) จนกว่าจะออกแบบ Storage
  // ฝั่ง Backend ใน Step ถัดไป
  return {
    success: true,
    stationId: station.id,
    missionId: missionId,
    completed: true,
  };
}
