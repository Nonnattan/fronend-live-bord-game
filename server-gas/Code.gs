/**
 * Code.gs
 * ---------------------------------------------------------------------------
 * Google Apps Script REST API สำหรับระบบ Login/Register ของแอป
 * ใช้ Google Sheet เป็นฐานข้อมูล (ชื่อชีต: "Members")
 *
 * วิธี Deploy:
 * 1) เปิด Google Sheet ที่จะใช้เป็นฐานข้อมูล -> Extensions > Apps Script
 * 2) วางไฟล์นี้ทับ Code.gs เดิม แล้ว Save
 * 3) Deploy > New deployment > เลือกประเภท "Web app"
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4) คัดลอก Web app URL ที่ได้ (ลงท้ายด้วย /exec) ไปใส่ใน .env ของ Frontend
 *    เป็นค่า API_BASE_URL
 * 5) ทุกครั้งที่แก้โค้ดแล้วต้อง Deploy ใหม่ ให้เลือก "Manage deployments" >
 *    แก้ deployment เดิม (เวอร์ชันใหม่) ไม่ต้องสร้าง URL ใหม่
 *
 * โครงสร้างชีต "Members" (แถวหัวตารางถูกสร้างอัตโนมัติถ้ายังไม่มี):
 * Member ID | First Name | Last Name | Phone Number | LINE User ID |
 * Display Name | Profile Picture | Register Date | Last Login | Point | Total Visit |
 * Birth Year | Gender
 *
 * Birth Year/Gender (คอลัมน์ L, M) — เพิ่มใหม่: บันทึกทุกครั้งที่ register/login ถ้า
 * frontend ส่งมา (ไม่บังคับ ไม่เขียนทับด้วยค่าว่างถ้าไม่ได้ส่งมาในรอบนั้น) ใช้
 * action 'updateMember' (ระบุ memberId) เพื่ออัปเดตเฉพาะ Birth Year/Gender ที่ยังขาด
 * ในแถวเดิมได้โดยไม่ต้องส่งฟิลด์อื่นมาด้วย และ "ห้ามสร้างแถวใหม่" เด็ดขาด
 *
 * Birth Year (คอลัมน์ L) เก็บเป็น "ช่วงปีเกิด ค.ศ." แบบข้อความตรงตามที่ผู้ใช้เลือก
 * จากหน้า Register เช่น "1996-2006" (ไม่ใช่อายุเป็นตัวเลขอีกต่อไป) — frontend
 * เป็นฝ่ายกำหนดค่าช่วงปีที่จะส่งมาให้ทั้งหมด ฝั่งนี้แค่เก็บค่าที่ได้รับตรง ๆ
 *
 * Register Date/Last Login: เก็บเป็นวันที่-เวลาโซน Asia/Bangkok (UTC+7) รูปแบบ
 * "yyyy-MM-dd HH:mm:ss" เช่น "2026-07-31 14:24:27" (ไม่ใช่ ISO string แบบเดิม
 * ที่เป็น UTC "2026-07-31T07:24:27.667Z") ดู bangkokNow_()
 *
 * Actions ที่รองรับ (ส่งมาใน body เป็น JSON, key "action"):
 *   - ping         : Diagnostics ล้วน ๆ (ไม่มีการเขียนข้อมูล) — ตอบกลับว่า deployment
 *                    นี้ผูกกับสเปรดชีต/ชีต Members ไหน, header ตรงกับที่โค้ดคาดหวังไหม,
 *                    deploy โค้ดเวอร์ชันไหนอยู่ — เรียกผ่าน URL ตรง ๆ ได้เลย เช่น
 *                    {WebAppURL}?action=ping — ใช้ตรวจก่อนว่า deployment ที่กำลังใช้
 *                    งานอยู่จริงชี้ไปสเปรดชีตที่ถูกต้องหรือเปล่า ก่อนไล่ debug จุดอื่น
 *   - checkMember  : ค้นหาสมาชิกจาก lineUserId หรือ phone (ไม่มีการเขียนข้อมูล)
 *   - register     : สร้างสมาชิกใหม่ (ถ้ามีอยู่แล้ว — เบอร์โทรหรือ lineUserId ตรงกับ
 *                    แถวเดิม — จะไม่สร้างซ้ำ จะอัปเดต Last Login + Total Visit แทน)
 *   - login        : ถ้าพบสมาชิก (เบอร์โทรหรือ lineUserId ตรงกัน) -> อัปเดต Last
 *                    Login + Total Visit (+1) (+ ข้อมูล LINE ถ้ามี)
 *                    ถ้าไม่พบ -> สร้างสมาชิกใหม่ให้อัตโนมัติ (login-or-register)
 *   - loginByLine  : Login ด้วย LINE ตามสเปกใหม่ — ตรวจสอบ lineUserId ก่อนเสมอ
 *                    พบ -> Login ทันที (อัปเดต Last Login/Total Visit) ไม่พบ ->
 *                    found:false เท่านั้น (ไม่เขียนข้อมูล) ให้ frontend พาไปหน้า
 *                    สมัครสมาชิกต่อ แล้วค่อยเรียก 'register'
 *   - updateMember : แก้ไขข้อมูลสมาชิกด้วย memberId โดยตรง (แก้ point ได้ด้วย)
 *   - getMember    : ดึงข้อมูลสมาชิกล่าสุดด้วย memberId (ไม่มีการเขียนข้อมูล) — ใช้รีเฟรชหน้า Home
 *
 * การจับคู่สมาชิกเดิม (findExistingRowIndex_): ใช้ lineUserId ก่อนเสมอถ้ามีส่งมา
 * (ID เฉพาะตัวจริง แม่นยำสุด) แล้วค่อย fallback ไปเทียบเบอร์โทรศัพท์ — "ไม่ใช้"
 * firstName+lastName ในการจับคู่อีกต่อไป (ของเดิมเทียบชื่อ-นามสกุล-เบอร์ตรงกัน
 * ทั้ง 3 ค่าเป๊ะ ทำให้พิมพ์ชื่อสะกดต่างจากเดิมนิดเดียวก็หาไม่เจอ แล้วสร้างแถวใหม่
 * ซ้ำทั้งที่เบอร์โทร/LINE ตรงกับสมาชิกเดิมอยู่แล้ว — เป็นสาเหตุหลักของบั๊กข้อมูลซ้ำ)
 *
 * หมายเหตุ CORS: Google Apps Script Web App ไม่รองรับ CORS preflight (OPTIONS)
 * ฝั่ง Frontend จึงต้องเรียกด้วย Content-Type: "text/plain;charset=utf-8"
 * (ไม่ใช่ "application/json") เพื่อให้ browser ส่งเป็น simple request ไม่ trigger
 * preflight — ฝั่งนี้ยังคง JSON.parse(e.postData.contents) ได้ตามปกติ ไม่สนใจ
 * ว่า header ประกาศเป็น content-type อะไร
 *
 * ---------------------------------------------------------------------------
 * Audit เพิ่มเติม (loginByLine หาสมาชิกเดิมไม่เจอ): ตรวจ Logic การจับคู่ lineUserId
 * ทั้งหมดแล้ว (findRowIndexByLineUserId_, actionLoginByLine_, การ Mapping คอลัมน์
 * ตาม HEADERS) พบว่า Logic ถูกต้องตามสเปกทุกจุด — ไม่พบบั๊กใน Logic การเปรียบเทียบเอง
 * แต่เพิ่มการป้องกัน/มองเห็นปัญหา 3 อย่างที่เป็นสาเหตุที่พบบ่อยที่สุดของอาการนี้ใน
 * โปรเจกต์ลักษณะนี้ (ดูรายละเอียดที่ฟังก์ชันนั้น ๆ):
 *   1) normalize_() ตอนนี้ตัดอักขระที่มองไม่เห็น (zero-width space/BOM) ออกด้วย ไม่ใช่
 *      แค่ .trim() เฉย ๆ — กันกรณี LINE User ID ที่พิมพ์/วางมือลงชีตมีอักขระแฝงติดมา
 *   2) getSheet_()/findRowIndexByLineUserId_()/actionLoginByLine_() log รายละเอียด
 *      ทุก request ไว้ใน Executions log (lineUserId ที่รับมา, เจอหรือไม่, แถวไหน,
 *      สเปรดชีต/ชีตที่ผูกอยู่จริง) — เปิด Apps Script Editor > Executions ดูได้ทันที
 *   3) เพิ่ม action 'ping' (diagnostics ล้วน ๆ ไม่เขียนข้อมูล) ให้เช็คได้ทันทีว่า
 *      deployment ที่กำลังใช้งานอยู่จริงผูกกับสเปรดชีต/ชีต Members อันไหน, header ตรง
 *      กับที่โค้ดคาดหวังไหม (เผื่อ deployment ผูกผิดสเปรดชีต ซึ่งเป็นสาเหตุคลาสสิกที่สุด
 *      ของอาการ "มีสมาชิกอยู่จริงแต่ระบบหาไม่เจอเลยสักครั้ง")
 * ---------------------------------------------------------------------------
 * ส่วนต่อขยาย: ระบบ Journey (ประวัติการเข้าฐาน) + Score (คะแนนสะสม)
 * ---------------------------------------------------------------------------
 * ทุกอย่างข้างบนนี้ (ชีต "Members", action checkMember/register/login/
 * loginByLine/updateMember/getMember) "ไม่ถูกแก้ไข" เลยแม้แต่บรรทัดเดียว —
 * ของใหม่ (ชีต "Journey", "Score") อยู่แยกไฟล์ทั้งหมด และต่อเชื่อมเข้ามาที่นี่
 * แค่จุดเดียวคือเพิ่ม case ใหม่ใน switch ของ handleRequest_() ด้านล่าง:
 *   - JourneyService.gs  : CRUD ของชีต "Journey" ล้วน ๆ (ไม่รู้จักชีต Score)
 *   - ScoreService.gs    : CRUD ของชีต "Score" ล้วน ๆ (ไม่รู้จักชีต Journey)
 *   - CheckinService.gs  : ประสานงาน Journey+Score เข้าด้วยกัน (action handlers)
 * ดูรายละเอียด action ใหม่ (checkin/getJourney/getScore/getLeaderboard) และ
 * โครงสร้างชีตทั้งสองได้ใน server-gas/README.md
 *
 * ---------------------------------------------------------------------------
 * ส่วนต่อขยาย 2: Stations (รายชื่อฐาน) + SideQuests (เควสเสริม)
 * ---------------------------------------------------------------------------
 * เช่นเดียวกับ Journey/Score ด้านบน — ไม่แตะ logic เดิมของ Members/Journey/
 * Score แม้แต่บรรทัดเดียว ของใหม่อยู่แยกไฟล์ทั้งหมด ต่อเชื่อมเข้ามาที่นี่แค่
 * จุดเดียวคือเพิ่ม case ใหม่ใน switch ของ handleRequest_() ด้านล่าง:
 *   - StationsService.gs   : CRUD ของชีต "Stations" ล้วน ๆ
 *   - SideQuestsService.gs : CRUD ของชีต "SideQuests" ล้วน ๆ
 * Action ใหม่: listStations/createStation/updateStation/deleteStation,
 * listSideQuests/createSideQuest/updateSideQuest/deleteSideQuest — ใช้ที่มาจาก
 * แอป Admin (backend-liveboradgame) ผ่าน server/utils/appsScriptClient.ts
 */

const SHEET_NAME = "Members";
const HEADERS = [
  "Member ID",
  "First Name",
  "Last Name",
  "Phone Number",
  "LINE User ID",
  "Display Name",
  "Profile Picture",
  "Register Date",
  "Last Login",
  "Point",
  "Total Visit",
  "Birth Year",
  "Gender",
];

/** ค่าเริ่มต้นตอน migrate สำหรับคอลัมน์ที่เพิ่งเพิ่มใหม่ (คีย์ = ชื่อ header ใน HEADERS)
 * ไม่ระบุในนี้ = เติมด้วยค่าว่าง '' (เช่น Birth Year, Gender ที่ยังไม่เคยกรอกมาก่อน) */
const MIGRATION_DEFAULTS_ = {
  Point: 0,
  "Total Visit": 1,
};

/* ------------------------------- Helpers -------------------------------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  const existedBefore = !!sheet;
  if (!sheet) {
    // ไม่พบชีตชื่อ "Members" ในสเปรดชีตที่ Web App นี้ผูกอยู่ -> สร้างชีตเปล่าใหม่ให้
    // อัตโนมัติ (พฤติกรรมเดิม) แต่ "นี่คือสัญญาณอันตราย" ถ้าเกิดขึ้นทั้งที่ผู้ใช้ยืนยันว่า
    // มีข้อมูลสมาชิกอยู่แล้วจริง — แปลว่า Web App Deployment นี้ผูก (bound) อยู่กับคนละ
    // Spreadsheet กับที่ผู้ใช้เปิดดูอยู่ (เช่น Deploy จาก Apps Script ที่แนบอยู่กับ
    // สเปรดชีตคนละไฟล์ หรือชื่อแท็บสะกดต่างกัน เช่น "Members " มีช่องว่างท้าย, "member"
    // ตัวเล็ก, "สมาชิก") ทำให้ทุก login/loginByLine หาสมาชิกเดิมไม่เจอเสมอ (สร้างชีต
    // ใหม่ว่าง ๆ ซ้ำไปเรื่อย ๆ ทุกครั้งที่ deploy ใหม่ที่ไหนก็ตาม) -> log ไว้ให้เห็นชัดเจน
    // ใน Executions log (Apps Script Editor > Executions) เพื่อ debug ได้ทันที
    console.error(
      '[getSheet_] ไม่พบชีตชื่อ "' +
      SHEET_NAME +
      '" ในสเปรดชีตนี้ -> กำลังสร้างชีตใหม่ว่าง ๆ. ' +
      "ถ้าคุณคิดว่ามีสมาชิกอยู่แล้ว ให้ตรวจสอบว่า Web App deployment นี้ผูกอยู่กับ " +
      "สเปรดชีต (Spreadsheet ID: " +
      ss.getId() +
      ', ชื่อไฟล์: "' +
      ss.getName() +
      '") ' +
      'ตรงกับไฟล์ที่คุณเปิดดูข้อมูลสมาชิกอยู่จริงหรือไม่ และชื่อแท็บสะกดว่า "' +
      SHEET_NAME +
      '" ' +
      "เป๊ะ ๆ หรือไม่ (ตัวพิมพ์เล็ก-ใหญ่ และช่องว่างมีผล)",
    );
  } else {
    console.log(
      '[getSheet_] พบชีต "' +
      SHEET_NAME +
      '" แล้ว (Spreadsheet ID: ' +
      ss.getId() +
      ', ชื่อไฟล์: "' +
      ss.getName() +
      '", แถวข้อมูลปัจจุบัน: ' +
      Math.max(sheet.getLastRow() - 1, 0) +
      ")",
    );
  }
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    if (existedBefore) {
      // พบชีต "Members" แล้วแต่ไม่มีข้อมูลเลยแม้แต่หัวตาราง (แถวว่างสนิท) — log ไว้เผื่อ
      // เป็นชีตผิดที่ถูก insert ไว้เฉย ๆ ไม่ใช่ชีตสมาชิกจริง
      console.warn(
        '[getSheet_] ชีต "' +
        SHEET_NAME +
        '" มีอยู่แล้วแต่ไม่มีข้อมูลเลย (แถวว่างสนิท) -> กำลังใส่หัวตาราง',
      );
    }
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else {
    migrateSheetIfNeeded_(sheet);
  }
  return sheet;
}

/**
 * Migration: เผื่อชีตถูกสร้างจากเวอร์ชันเก่าที่ยังมีคอลัมน์ไม่ครบ HEADERS ปัจจุบัน
 * (เช่น ชีตเก่ามีแค่ 9 คอลัมน์ถึง Last Login, หรือ 11 คอลัมน์ที่ยังไม่มี Birth Year/Gender)
 * — เติมหัวตารางที่ขาดทั้งหมดในคราวเดียว พร้อมค่าเริ่มต้นที่ถูกต้องต่อคอลัมน์
 * (ดู MIGRATION_DEFAULTS_ — ไม่ระบุ = เติมค่าว่าง '' เช่น Birth Year/Gender ที่ยังไม่เคย
 * กรอกมาก่อน) ให้ทุกแถวข้อมูลเดิมโดยอัตโนมัติ ไม่ต้องแก้มือ ไม่ว่าจะขาดกี่คอลัมน์
 */
function migrateSheetIfNeeded_(sheet) {
  const currentCols = sheet.getLastColumn();
  if (currentCols >= HEADERS.length) return;

  const missingHeaders = HEADERS.slice(currentCols);
  sheet
    .getRange(1, currentCols + 1, 1, missingHeaders.length)
    .setValues([missingHeaders]);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const numRows = lastRow - 1;
  const defaultsRow = missingHeaders.map(function (h) {
    return Object.prototype.hasOwnProperty.call(MIGRATION_DEFAULTS_, h)
      ? MIGRATION_DEFAULTS_[h]
      : "";
  });
  const defaults = [];
  for (let i = 0; i < numRows; i++) defaults.push(defaultsRow.slice());
  sheet
    .getRange(2, currentCols + 1, numRows, missingHeaders.length)
    .setValues(defaults);
}

/** วันที่-เวลาปัจจุบัน โซน Asia/Bangkok (UTC+7) รูปแบบ "yyyy-MM-dd HH:mm:ss"
 * เช่น "2026-07-31 14:24:27" — ใช้แทน ISO string (UTC) เดิมสำหรับ Register Date
 * และ Last Login ทุกจุดที่เขียนลงชีต (ไม่กระทบ createdAt ฝั่ง client ใน LocalStorage) */
function bangkokNow_() {
  return Utilities.formatDate(
    new Date(),
    "Asia/Bangkok",
    "yyyy-MM-dd HH:mm:ss",
  );
}

/** ตัดอักขระที่มองไม่เห็น (zero-width space/joiner, BOM ฯลฯ) ออก — อักขระเหล่านี้
 * ไม่ถูกตัดด้วย .trim() ธรรมดา แต่หลุดติดเข้ามาได้ง่ายเวลาพิมพ์/วางค่า (เช่น LINE
 * User ID หรือเบอร์โทร) ลงในเซลล์ Google Sheet ด้วยมือ หรือ copy มาจากที่อื่น ทำให้
 * ค่าที่ "ดูเหมือนตรงกันเป๊ะบนหน้าจอ" กลับเทียบไม่ตรงกัน (=== ไม่ผ่าน) และหาแถวเดิมไม่เจอ */
function stripInvisibleChars_(str) {
  return str.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "");
}

function normalize_(value) {
  if (value === undefined || value === null) return "";
  return stripInvisibleChars_(value.toString().trim()).trim();
}

/** Normalize ค่า Birth Year (ช่วงปีเกิด) ที่รับมาจาก payload — เก็บเป็นข้อความตรง ๆ
 * ตามที่ frontend ส่งมา (เช่น "1996-2006") ไม่แปลงเป็นตัวเลข/คำนวณอายุใด ๆ ทั้งสิ้น
 * คืนค่าว่าง '' ถ้าไม่ได้ส่งมาหรือส่งมาเป็นค่าว่าง (แปลว่า "ยังไม่มีข้อมูล") */
function normalizeBirthYear_(value) {
  return normalize_(value);
}

/** สร้าง Member ID อัตโนมัติ ไม่ซ้ำกัน เช่น M-LXQK3F-A1B */
function generateMemberId_() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return "M-" + ts + "-" + rand;
}

function getAllDataRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
}

function rowToMember_(row) {
  const birthYearRaw = normalize_(row[11]);
  return {
    memberId: row[0],
    firstName: row[1],
    lastName: row[2],
    phone: row[3],
    lineUserId: row[4],
    displayName: row[5],
    pictureUrl: row[6],
    registerDate: row[7],
    lastLogin: row[8],
    point: Number(row[9]) || 0,
    totalVisit: Number(row[10]) || 0,
    // birthYear: null = ยังไม่มีข้อมูล — เป็นข้อความช่วงปีเกิด เช่น "1996-2006" ไม่ใช่ตัวเลขอายุ
    birthYear: birthYearRaw === "" ? null : birthYearRaw,
    gender: normalize_(row[12]),
  };
}

/** คืนค่า row number จริงบนชีต (1-indexed) ที่ LINE User ID (คอลัมน์ E) ตรงกัน หรือ -1 ถ้าไม่พบ */
function findRowIndexByLineUserId_(sheet, lineUserId) {
  const id = normalize_(lineUserId);
  if (!id) return -1;
  const rows = getAllDataRows_(sheet);
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][4]) === id) {
      console.log(
        '[findRowIndexByLineUserId_] รับ lineUserId="' +
        id +
        '" -> พบที่แถว ' +
        (i + 2) +
        " (สแกนทั้งหมด " +
        rows.length +
        " แถว)",
      );
      return i + 2;
    }
  }
  console.log(
    '[findRowIndexByLineUserId_] รับ lineUserId="' +
    id +
    '" -> ไม่พบ (สแกนทั้งหมด ' +
    rows.length +
    " แถว)",
  );
  return -1;
}

/** คืนค่า row number จริงบนชีต (1-indexed) ที่เบอร์โทรศัพท์ (คอลัมน์ D) ตรงกัน หรือ -1 ถ้าไม่พบ */
function findRowIndexByPhone_(sheet, phone) {
  const ph = normalize_(phone);
  if (!ph) return -1;
  const rows = getAllDataRows_(sheet);
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][3]) === ph) return i + 2;
  }
  return -1;
}

/**
 * หาแถวสมาชิกเดิมที่ "เป็นตัวตนเดียวกันจริง ๆ" ก่อน Insert/Login ทุกครั้ง
 * ---------------------------------------------------------------------------
 * เดิม (findRowIndexByIdentity_) เช็คด้วย firstName+lastName+phone ต้องตรงกัน
 * ทั้ง 3 ค่าเป๊ะเท่านั้น ทำให้ถ้าผู้ใช้คนเดิมพิมพ์ชื่อ/นามสกุลสะกดต่างจากรอบก่อน
 * เล็กน้อย (เผลอเว้นวรรค, ใส่คำนำหน้า, พิมพ์ตัวเล็ก/ใหญ่ผิด) ระบบจะหาไม่เจอ และ
 * "สร้างแถวใหม่ซ้ำ" ทั้งที่เบอร์โทรหรือ LINE User ID ตรงกับสมาชิกเดิมอยู่แล้ว
 * -> เป็นสาเหตุหลักของข้อมูลซ้ำใน Sheet
 *
 * แก้ไขใหม่: ใช้ "LINE User ID" หรือ "เบอร์โทรศัพท์" เป็น key หลักแทน (ตรงอย่างใด
 * อย่างหนึ่งก็ถือว่าเป็นสมาชิกเดิม) โดยเช็ค LINE User ID ก่อนเสมอถ้ามีส่งมา
 * (เป็น ID เฉพาะตัวจริง แม่นยำกว่า) แล้วค่อย fallback ไปเช็คเบอร์โทรศัพท์
 */
function findExistingRowIndex_(sheet, payload) {
  const byLine = findRowIndexByLineUserId_(
    sheet,
    payload && payload.lineUserId,
  );
  if (byLine !== -1) return byLine;
  return findRowIndexByPhone_(sheet, payload && payload.phone);
}

function findRowIndexByMemberId_(sheet, memberId) {
  const rows = getAllDataRows_(sheet);
  const id = normalize_(memberId);
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === id) return i + 2;
  }
  return -1;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function errorResponse_(message) {
  return jsonOutput_({ success: false, error: message });
}

function requireIdentityFields_(payload) {
  if (!payload || !payload.firstName || !payload.lastName || !payload.phone) {
    return "firstName, lastName และ phone จำเป็นต้องส่งมาทั้งหมด";
  }
  return null;
}

/** สร้างแถวใหม่และคืนค่า member object กลับไป (Point เริ่มที่ 0, Total Visit เริ่มที่ 1)
 * บันทึก Birth Year/Gender ด้วยถ้า payload ส่งมา (ไม่บังคับ — ถ้าไม่ส่งมาจะเก็บเป็นค่าว่าง)
 * Birth Year เก็บเป็นข้อความช่วงปีเกิดตรงตามที่ frontend ส่งมา เช่น "1996-2006" */
function createMemberRow_(sheet, payload, now) {
  const memberId = generateMemberId_();
  const newRow = [
    memberId,
    normalize_(payload.firstName),
    normalize_(payload.lastName),
    normalize_(payload.phone),
    normalize_(payload.lineUserId),
    normalize_(payload.displayName),
    normalize_(payload.pictureUrl),
    now,
    now,
    0,
    1,
    normalizeBirthYear_(payload.birthYear),
    normalize_(payload.gender),
  ];
  sheet.appendRow(newRow);
  return rowToMember_(newRow);
}

/**
 * อัปเดตแถวที่มีอยู่แล้ว: อัปเดต Last Login เสมอ + LINE fields ถ้ามีค่าส่งมา
 * + เพิ่ม Total Visit ทีละ 1 ทุกครั้งที่ login/register สำเร็จ (bumpVisit = false
 *   เพื่อใช้กับ updateMember ที่ไม่ควรนับเป็นการเข้าใช้บริการใหม่)
 * + Birth Year/Gender: อัปเดตเฉพาะเมื่อ payload ส่งค่ามาจริง ๆ เท่านั้น (ไม่เขียนทับด้วย
 *   ค่าว่างถ้ารอบนี้ไม่ได้ส่งมา เช่น ตอน loginByLine ที่ส่งแค่ lineUserId) —
 *   ทำให้เรียก updateMember ด้วย memberId + { birthYear, gender } เพื่อเติมเฉพาะฟิลด์ที่
 *   ยังขาดในแถวเดิมได้โดยไม่กระทบฟิลด์อื่น และไม่มีการสร้างแถวใหม่ Birth Year เก็บเป็น
 *   ข้อความช่วงปีเกิดตรงตามที่ frontend ส่งมา เช่น "1996-2006"
 */
function updateMemberRow_(sheet, rowIndex, payload, now, bumpVisit) {
  const current = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];

  const lineUserId = payload.lineUserId
    ? normalize_(payload.lineUserId)
    : current[4];
  const displayName = payload.displayName
    ? normalize_(payload.displayName)
    : current[5];
  const pictureUrl = payload.pictureUrl
    ? normalize_(payload.pictureUrl)
    : current[6];
  const totalVisit = bumpVisit
    ? (Number(current[10]) || 0) + 1
    : Number(current[10]) || 0;
  const birthYear =
    payload.birthYear !== undefined &&
      payload.birthYear !== null &&
      payload.birthYear !== ""
      ? normalizeBirthYear_(payload.birthYear)
      : current[11];
  const gender = payload.gender ? normalize_(payload.gender) : current[12];

  // E:G = LINE User ID, Display Name, Profile Picture
  sheet
    .getRange(rowIndex, 5, 1, 3)
    .setValues([[lineUserId, displayName, pictureUrl]]);
  // I = Last Login, K = Total Visit
  sheet.getRange(rowIndex, 9).setValue(now);
  sheet.getRange(rowIndex, 11).setValue(totalVisit);
  // L:M = Birth Year, Gender
  sheet.getRange(rowIndex, 12, 1, 2).setValues([[birthYear, gender]]);

  const updated = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];
  return rowToMember_(updated);
}

/* --------------------------- Action handlers ----------------------------- */

function actionCheckMember_(payload) {
  const fieldError = requireIdentityFields_(payload);
  if (fieldError) return { success: false, error: fieldError };

  const sheet = getSheet_();
  const rowIndex = findExistingRowIndex_(sheet, payload);

  if (rowIndex === -1) {
    return { success: true, found: false };
  }
  const row = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];
  return { success: true, found: true, member: rowToMember_(row) };
}

function actionRegister_(payload) {
  const fieldError = requireIdentityFields_(payload);
  if (fieldError) return { success: false, error: fieldError };

  const sheet = getSheet_();
  const now = bangkokNow_();
  const rowIndex = findExistingRowIndex_(sheet, payload);

  if (rowIndex !== -1) {
    // มีอยู่แล้ว (เบอร์โทรหรือ LINE User ID ตรงกับแถวเดิม) -> ห้ามสร้างซ้ำ
    // ทำเหมือน login (อัปเดต Last Login + Total Visit แทน)
    const member = updateMemberRow_(sheet, rowIndex, payload, now, true);
    return { success: true, isNewMember: false, member: member };
  }

  const member = createMemberRow_(sheet, payload, now);
  return { success: true, isNewMember: true, member: member };
}

function actionLogin_(payload) {
  const fieldError = requireIdentityFields_(payload);
  if (fieldError) return { success: false, error: fieldError };

  const sheet = getSheet_();
  const now = bangkokNow_();
  const rowIndex = findExistingRowIndex_(sheet, payload);

  if (rowIndex === -1) {
    // ไม่พบสมาชิก -> สร้างใหม่ให้อัตโนมัติ (login-or-register ตาม flow ข้อ 3-5)
    const member = createMemberRow_(sheet, payload, now);
    return { success: true, isNewMember: true, member: member };
  }

  const member = updateMemberRow_(sheet, rowIndex, payload, now, true);
  return { success: true, isNewMember: false, member: member };
}

/**
 * Login ผ่าน LINE — ตรวจสอบ lineUserId ก่อนเสมอ (สเปกใหม่)
 *   - พบ lineUserId เดิม -> ถือว่า Login สำเร็จทันที อัปเดต Last Login +
 *     Total Visit ในแถวเดิม แล้วส่งข้อมูลสมาชิกกลับ (ไม่ต้องพากลับไปกรอกฟอร์ม)
 *   - ไม่พบ -> found: false เท่านั้น ไม่มีการเขียนข้อมูลใด ๆ ทั้งสิ้น (ไม่สร้างแถว
 *     ใหม่ที่นี่) ปล่อยให้ frontend พาไปหน้าสมัครสมาชิกเพื่อกรอกชื่อ-นามสกุล-เบอร์
 *     ก่อน แล้วค่อยเรียก action 'register' ตามปกติ
 */
function actionLoginByLine_(payload) {
  const rawLineUserId = payload && payload.lineUserId;
  const lineUserId = normalize_(rawLineUserId);
  console.log(
    "[actionLoginByLine_] เริ่มทำงาน — payload.lineUserId ที่ได้รับ (ดิบ): " +
    JSON.stringify(rawLineUserId),
  );
  if (!lineUserId) {
    return { success: false, error: "lineUserId จำเป็นต้องส่งมา" };
  }

  const sheet = getSheet_();
  const rowIndex = findRowIndexByLineUserId_(sheet, lineUserId);
  if (rowIndex === -1) {
    console.log(
      '[actionLoginByLine_] lineUserId="' +
      lineUserId +
      '" -> found:false, ตอบกลับให้ frontend พาไปหน้าสมัครสมาชิก',
    );
    return {
      success: true,
      found: false,
      // ฟิลด์เสริมไว้ debug เท่านั้น (ไม่กระทบ frontend เดิม ซึ่งอ่านแค่ success/found)
      _debug: { receivedLineUserId: lineUserId, matchedRow: null },
    };
  }

  const now = bangkokNow_();
  const member = updateMemberRow_(
    sheet,
    rowIndex,
    { lineUserId: lineUserId },
    now,
    true,
  );
  console.log(
    '[actionLoginByLine_] lineUserId="' +
    lineUserId +
    '" -> found:true ที่แถว ' +
    rowIndex +
    " (memberId=" +
    member.memberId +
    ") ตอบกลับ found:true พร้อมข้อมูลสมาชิก",
  );
  return {
    success: true,
    found: true,
    member: member,
    _debug: { receivedLineUserId: lineUserId, matchedRow: rowIndex },
  };
}

function actionGetMember_(payload) {
  if (!payload || !payload.memberId) {
    return { success: false, error: "memberId จำเป็นต้องส่งมา" };
  }
  const sheet = getSheet_();
  const rowIndex = findRowIndexByMemberId_(sheet, payload.memberId);
  if (rowIndex === -1) {
    return { success: false, error: "ไม่พบสมาชิกตาม memberId ที่ระบุ" };
  }
  const row = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];
  return { success: true, member: rowToMember_(row) };
}

function actionUpdateMember_(payload) {
  if (!payload || !payload.memberId) {
    return { success: false, error: "memberId จำเป็นต้องส่งมา" };
  }

  const sheet = getSheet_();
  const rowIndex = findRowIndexByMemberId_(sheet, payload.memberId);
  if (rowIndex === -1) {
    return { success: false, error: "ไม่พบสมาชิกตาม memberId ที่ระบุ" };
  }

  const current = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0];
  const merged = [
    current[0],
    payload.firstName !== undefined
      ? normalize_(payload.firstName)
      : current[1],
    payload.lastName !== undefined ? normalize_(payload.lastName) : current[2],
    payload.phone !== undefined ? normalize_(payload.phone) : current[3],
    payload.lineUserId !== undefined
      ? normalize_(payload.lineUserId)
      : current[4],
    payload.displayName !== undefined
      ? normalize_(payload.displayName)
      : current[5],
    payload.pictureUrl !== undefined
      ? normalize_(payload.pictureUrl)
      : current[6],
    current[7],
    bangkokNow_(),
    payload.point !== undefined ? Number(payload.point) || 0 : current[9],
    payload.totalVisit !== undefined
      ? Number(payload.totalVisit) || 0
      : current[10],
    payload.birthYear !== undefined
      ? normalizeBirthYear_(payload.birthYear)
      : current[11],
    payload.gender !== undefined ? normalize_(payload.gender) : current[12],
  ];
  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([merged]);
  return { success: true, member: rowToMember_(merged) };
}

/**
 * action 'ping' — Diagnostics เท่านั้น (ไม่มีการเขียนข้อมูลใด ๆ ทั้งสิ้น) ไว้ตรวจสอบตรง ๆ
 * ว่า Web App deployment ที่กำลังเรียกอยู่นี้ผูกกับ (bound to) สเปรดชีตไหน มีชีต
 * "Members" ที่ header/จำนวนแถวตรงกับที่เห็นในหน้า Google Sheet จริงหรือไม่ — เรียกดูได้
 * ตรง ๆ ผ่าน URL Web App เช่น:
 *   https://script.google.com/macros/s/XXX/exec?action=ping
 * ใช้แก้ปัญหา 2 เรื่องที่พบบ่อยที่สุดของบั๊ก "หาสมาชิกเดิมไม่เจอ":
 *   1) deploy ผิด/ไม่ได้ deploy เวอร์ชันล่าสุด (ดู deployedCodeVersion ด้านล่าง)
 *   2) Web App ผูกอยู่กับคนละสเปรดชีตกับที่ผู้ใช้เปิดดูข้อมูลสมาชิกอยู่จริง
 *      (ดู spreadsheetId/spreadsheetName เทียบกับ URL ของ Google Sheet ที่เปิดอยู่)
 */
const DEPLOYED_CODE_VERSION_ = "2026-08-07-loginByLine-audit-1";

function actionPing_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const info = {
    deployedCodeVersion: DEPLOYED_CODE_VERSION_,
    spreadsheetId: ss.getId(),
    spreadsheetName: ss.getName(),
    spreadsheetUrl: ss.getUrl(),
    membersSheetFound: !!sheet,
  };
  if (sheet) {
    info.membersSheetName = sheet.getName();
    info.membersLastRow = sheet.getLastRow();
    info.membersLastColumn = sheet.getLastColumn();
    info.membersRowCount = Math.max(sheet.getLastRow() - 1, 0);
    info.headerRow =
      sheet.getLastRow() >= 1
        ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
        : [];
    info.expectedHeaders = HEADERS;
    info.headersMatchExpected =
      JSON.stringify(info.headerRow) === JSON.stringify(HEADERS);
  }
  return { success: true, ping: info };
}

/* ------------------------------ Entry points ------------------------------ */

function handleRequest_(payload) {
  const action = payload && payload.action;

  try {
    switch (action) {
      case "ping":
        return jsonOutput_(actionPing_());
      case "checkMember":
        return jsonOutput_(actionCheckMember_(payload));
      case "register":
        return jsonOutput_(actionRegister_(payload));
      case "login":
        return jsonOutput_(actionLogin_(payload));
      case "loginByLine":
        return jsonOutput_(actionLoginByLine_(payload));
      case "updateMember":
        return jsonOutput_(actionUpdateMember_(payload));
      case "getMember":
        return jsonOutput_(actionGetMember_(payload));
      // --- ส่วนต่อขยาย: Journey/Score (ดู JourneyService.gs / ScoreService.gs / CheckinService.gs) ---
      case "checkin":
        return jsonOutput_(actionCheckin_(payload));
      case "getJourney":
        return jsonOutput_(actionGetJourney_(payload));
      case "getScore":
        return jsonOutput_(actionGetScore_(payload));
      case "getLeaderboard":
        return jsonOutput_(actionGetLeaderboard_(payload));
      // --- ส่วนต่อขยาย 2: Stations/SideQuests (ดู StationsService.gs / SideQuestsService.gs) ---
      case "listStations":
        return jsonOutput_(actionListStations_());
      case "createStation":
        return jsonOutput_(actionCreateStation_(payload));
      case "updateStation":
        return jsonOutput_(actionUpdateStation_(payload));
      case "deleteStation":
        return jsonOutput_(actionDeleteStation_(payload));
      case "listSideQuests":
        return jsonOutput_(actionListSideQuests_());
      case "createSideQuest":
        return jsonOutput_(actionCreateSideQuest_(payload));
      case "updateSideQuest":
        return jsonOutput_(actionUpdateSideQuest_(payload));
      case "deleteSideQuest":
        return jsonOutput_(actionDeleteSideQuest_(payload));
      default:
        return errorResponse_(
          "action ไม่ถูกต้องหรือไม่ได้ระบุ ต้องเป็นหนึ่งใน: ping, checkMember, register, login, loginByLine, updateMember, getMember, checkin, getJourney, getScore, getLeaderboard, listStations, createStation, updateStation, deleteStation, listSideQuests, createSideQuest, updateSideQuest, deleteSideQuest",
        );
    }
  } catch (err) {
    return errorResponse_(err && err.message ? err.message : String(err));
  }
}

function doPost(e) {
  let payload = {};
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return errorResponse_("Body ที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง");
  }
  return handleRequest_(payload);
}

/** รองรับ GET ด้วย เผื่อทดสอบผ่าน URL โดยตรง เช่น
 * ?action=checkMember&firstName=สมชาย&lastName=ใจดี&phone=0812345678
 */
function doGet(e) {
  const payload = Object.assign({}, e.parameter);
  return handleRequest_(payload);
}
