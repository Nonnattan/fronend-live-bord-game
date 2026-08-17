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
 * ส่วนต่อขยาย 1b: Round (รอบการเล่น)
 * ---------------------------------------------------------------------------
 * RoundService.gs มีอยู่แล้วก่อนหน้านี้แต่ยังไม่เคยต่อเชื่อมเข้า handleRequest_()
 * เลย (ไม่มี action เรียกใช้ได้จริงฝั่ง Web App) — เพิ่ม 3 action ใหม่ที่นี่
 * (roundStart/roundEnd/getRound) โดย "ไม่แก้" RoundService.gs แม้แต่บรรทัดเดียว
 * แค่เรียกใช้ actionRoundStart_/actionRoundEnd_/actionGetRound_ ที่มีอยู่แล้ว
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

// ⚠️ FIX: ระบุ SPREADSHEET_ID ตรง ๆ (เหมือน project เก่า/ระบบ Check-in ที่ใช้
// SpreadsheetApp.openById(SPREADSHEET_ID) เสมอ) แทนการพึ่ง SpreadsheetApp.getActiveSpreadsheet()
// เพียงอย่างเดียว — getActiveSpreadsheet() จะชี้ไปสเปรดชีตที่ถูกต้อง "ก็ต่อเมื่อ" สคริปต์นี้
// ถูกสร้างแบบ bound (container-bound) อยู่กับสเปรดชีตนั้นโดยตรงเท่านั้น ถ้าโปรเจกต์ Apps Script
// ถูกคัดลอก/แยกเป็นโปรเจกต์ใหม่ หรือ deploy จากที่ผูกผิดไฟล์ getActiveSpreadsheet() จะคืนค่า
// null หรือชี้ผิดสเปรดชีตทันที (เป็นสาเหตุคลาสสิกของ error "Cannot read properties of null")
// การ hardcode ID ไว้ตรงนี้ทำให้ไม่ว่าจะรันจากที่ไหน ก็เขียน/อ่านสเปรดชีตตัวเดียวกันเสมอ
const SPREADSHEET_ID = "1TxxTM1O7Lo74buYoFjtpAPtrXXe_EJj7iXCkd-sDjTI";

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

/** [Audit] ตรวจว่าค่าคงที่ชื่อชีต (SHEET_NAME / JOURNEY_SHEET_NAME / ฯลฯ) ไม่เป็น
 * undefined/null/ค่าว่าง ก่อนนำไปใช้เรียก getSheetByName() ทุกครั้ง — ถ้าค่าคงที่
 * เพี้ยน (เช่น พิมพ์ผิดตอนแก้โค้ด/ลบทิ้งโดยไม่ตั้งใจ) จะโยน Error ที่ชี้ชัดเจนทันที
 * แทนที่จะปล่อยให้ getSheetByName(undefined) คืน null แล้วไปพังทีหลังแบบเดาสาเหตุยาก */
function requireSheetName_(name, constantLabel) {
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new Error(
      "[Config Error] ค่าคงที่ " +
        constantLabel +
        " เป็น undefined/null/ค่าว่าง (ได้รับ: " +
        JSON.stringify(name) +
        ") ตรวจสอบว่ามีการประกาศค่าคงที่นี้ถูกต้องอยู่ตอนบนไฟล์ .gs ที่เกี่ยวข้อง",
    );
  }
}

/** [Audit] Assertion สุดท้ายก่อนคืนค่า sheet ออกจากฟังก์ชัน getXSheet_() ทุกตัว —
 * แม้ปัจจุบัน getSheet_()/getJourneySheet_()/ฯลฯ จะ insertSheet() ให้อัตโนมัติเมื่อ
 * getSheetByName() คืน null (ทำให้ทางทฤษฎี sheet ที่คืนออกไปจะไม่มีวันเป็น null) แต่ยังคง
 * เช็คซ้ำอีกชั้นไว้เป็น "แนวป้องกันสุดท้าย" (defense in depth) กันกรณีมีคนมาแก้โค้ด
 * getXSheet_() ในอนาคตแล้วเผลอเอา insertSheet() ออก — ถ้าเกิดกรณีนั้นจริง จะได้ Error
 * ข้อความชัดเจนทันที (เช่น "Members sheet not found") แทนที่จะไปพังแบบ
 * "Cannot read properties of null (reading 'getDataRange')" ที่ไล่หาสาเหตุยาก */
function assertSheetReady_(sheet, sheetName, spreadsheet) {
  if (!sheet) {
    throw new Error(
      '"' +
        sheetName +
        '" sheet not found ในสเปรดชีต (Spreadsheet ID: ' +
        (spreadsheet ? spreadsheet.getId() : "?") +
        ', ชื่อไฟล์: "' +
        (spreadsheet ? spreadsheet.getName() : "?") +
        '") — ตรวจสอบว่า deployment นี้ผูกกับสเปรดชีตที่ถูกต้อง และชื่อแท็บสะกดตรงกับ "' +
        sheetName +
        '" เป๊ะ (ตัวพิมพ์เล็ก-ใหญ่/ช่องว่างมีผล)',
    );
  }
  return sheet;
}

function getSheet_() {
  requireSheetName_(SHEET_NAME, "SHEET_NAME");
  // ⚠️ FIX: openById(SPREADSHEET_ID) แทน getActiveSpreadsheet() — ดูคำอธิบายที่ประกาศ
  // ค่าคงที่ SPREADSHEET_ID ด้านบนไฟล์
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  Logger.log(
    "[getSheet_] Spreadsheet ID=%s, Sheet Name=%s, Sheet Object=%s",
    ss.getId(),
    SHEET_NAME,
    sheet ? "found" : "null (not found yet)",
  );
  const existedBefore = !!sheet;
  if (!sheet) {
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
  ensurePhoneColumnIsText_(sheet);
  return assertSheetReady_(sheet, SHEET_NAME, ss);
}

/**
 * [Fix] บังคับให้คอลัมน์ "Phone Number" ทั้งคอลัมน์เป็น Plain Text format ('@')
 * เสมอ ก่อนจะมีการเขียนค่าใด ๆ ลงไป
 *
 * เหตุผล: ปกติ appendRow()/setValues() ของ Google Sheets จะ "เดา" ชนิดข้อมูล
 * ของค่าที่เขียนเองอัตโนมัติ ถ้าค่าที่ส่งเข้าไปเป็น string ที่หน้าตาเหมือนตัวเลข
 * ล้วน ๆ (เช่น "0812345678") Sheets จะตีความเป็นตัวเลข 812345678 ทันที ตัดเลข 0
 * นำหน้าทิ้งไปเลย แม้ในโค้ด JavaScript ฝั่งนี้ค่าที่ส่งเข้า setValues() จะเป็น
 * string อยู่แล้วก็ตาม (ปัญหานี้เกิดที่ "การแสดงผล/จัดเก็บของตัวชีตเอง" ไม่ใช่
 * โค้ด) วิธีแก้ที่ถูกต้องคือบังคับ "รูปแบบเซลล์" (number format) ของคอลัมน์นี้
 * ให้เป็น '@' (Plain Text) ไว้ล่วงหน้าเสมอ ก่อนเขียนค่าลงไป — เมื่อเซลล์ถูก
 * ฟอร์แมตเป็น Text แล้ว Sheets จะเก็บค่าตามที่ส่งมาตรง ๆ ไม่แปลงเป็นตัวเลขอีก
 *
 * ครอบคลุมทั้งคอลัมน์ (ไม่ใช่แค่แถวที่มีข้อมูลอยู่แล้ว) เพื่อกันแถวใหม่ที่จะ
 * appendRow() เข้ามาในอนาคตด้วย เรียกทุกครั้งที่ getSheet_() ถูกเรียก (ทุก action)
 * เป็น idempotent (เรียกซ้ำได้ไม่มีผลข้างเคียง ไม่ทำให้ค่าที่มีอยู่แล้วเปลี่ยน)
 *
 * หมายเหตุ: การแก้นี้ป้องกัน "ข้อมูลใหม่ที่จะบันทึกต่อจากนี้" เท่านั้น เบอร์โทร
 * แถวเก่าที่เคยถูกตัดเลข 0 นำหน้าไปแล้วก่อนแก้โค้ดนี้ จะไม่ถูกกู้คืนอัตโนมัติ
 * (ต้องแก้ไขด้วยมือในชีตสำหรับแถวที่ได้รับผลกระทบไปแล้ว)
 */
function ensurePhoneColumnIsText_(sheet) {
  const phoneCol = HEADERS.indexOf("Phone Number") + 1;
  if (phoneCol <= 0) return;
  const maxRows = Math.max(sheet.getMaxRows(), 2);
  sheet.getRange(2, phoneCol, maxRows - 1, 1).setNumberFormat("@");
}

/**
 * [Fix รอบนี้ — ต้นเหตุจริงที่ ensurePhoneColumnIsText_ ด้านบนแก้ไม่หมด]
 * เขียนเบอร์โทรลงเซลล์เดียวแบบบังคับให้เป็น Text จริง ๆ
 *
 * *** ทำไมของเดิมยังพัง ***
 * `ensurePhoneColumnIsText_()` ตั้ง number format เป็น '@' ไว้ล่วงหน้าแล้วก็จริง
 * แต่ `sheet.appendRow()` ที่ใช้ตอน "สมัคร/Login ครั้งแรก" (createMemberRow_)
 * **ไม่เคารพ number format ของเซลล์** — มันตีความค่าเหมือนผู้ใช้พิมพ์เองในชีต
 * ("0812345678" จึงกลายเป็นตัวเลข 812345678 ทันที เลข 0 หาย) ต่างจาก
 * `setValue()`/`setValues()` ที่เคารพ format '@' และเก็บ string ตามที่ส่งไปจริง
 * — ตรงกับอาการที่พบพอดี: **สมัครครั้งแรกเลข 0 หาย แต่ตอนกดแก้ไขโปรไฟล์
 * (actionUpdateMember_ ซึ่งใช้ setValues) เลข 0 อยู่ครบ**
 *
 * ฟังก์ชันนี้จึงตั้ง format '@' ที่ "เซลล์นั้นเซลล์เดียว" แล้วเขียนทับด้วย
 * setValue() อีกรอบ — ปลอดภัยกับทุก path ที่เรียกใช้ และ idempotent
 */
function writePhoneAsText_(sheet, rowIndex, phone) {
  const phoneCol = HEADERS.indexOf("Phone Number") + 1;
  if (phoneCol <= 0 || rowIndex < 2) return;
  const cell = sheet.getRange(rowIndex, phoneCol);
  cell.setNumberFormat("@");
  cell.setValue(normalizePhone_(phone));
}

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

function bangkokNow_() {
  return Utilities.formatDate(
    new Date(),
    "Asia/Bangkok",
    "yyyy-MM-dd HH:mm:ss",
  );
}

function stripInvisibleChars_(str) {
  return str.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "");
}

function normalize_(value) {
  if (value === undefined || value === null) return "";
  return stripInvisibleChars_(value.toString().trim()).trim();
}

function normalizeBirthYear_(value) {
  return normalize_(value);
}

/**
 * [Fix เบอร์โทรเป็นตัวเลข / เลข 0 นำหน้าหาย] แปลงเบอร์โทรให้เป็น "string รูปแบบ
 * มาตรฐานเดียว" เสมอ ไม่ว่าค่าที่รับเข้ามาจะเป็นอะไร
 *
 * ทำไมต้องมีฟังก์ชันนี้แยกจาก normalize_():
 *   normalize_() แค่ .toString().trim() เฉย ๆ — ถ้าเซลล์ในชีตถูกเก็บเป็น "ตัวเลข"
 *   (Number) มาแล้ว เช่น 812345678 จะได้ string "812345678" ที่ยัง**ขาดเลข 0
 *   นำหน้า**อยู่ดี ทำให้เกิดปัญหาต่อเนื่อง 3 อย่าง:
 *     1) แอปแสดงเบอร์ผิด (ขาด 0)
 *     2) findRowIndexByPhone_() หาสมาชิกเดิมไม่เจอ เพราะฝั่งแอปส่ง "0812345678"
 *        มาเทียบกับ "812345678" ในชีต -> ระบบสร้างสมาชิกซ้ำเป็นแถวใหม่
 *     3) Zod ฝั่งแอป (utils/profileSchema.ts) บังคับ /^0\d{9}$/ ค่าที่ขาด 0 จึง
 *        validate ไม่ผ่านตอนผู้ใช้กดแก้ไขโปรไฟล์
 *
 * สิ่งที่ทำ: ตัดทุกอย่างที่ไม่ใช่ตัวเลขทิ้ง (เผื่อมีเว้นวรรค/ขีด เช่น "081-234-5678")
 * แล้ว "เติมเลข 0 นำหน้ากลับ" ถ้าเหลือ 9 หลัก (เบอร์มือถือไทยคือ 0 + 9 หลัก = 10
 * หลักเสมอ ดังนั้น 9 หลักแปลว่าโดนชีตตัด 0 ทิ้งไปแน่นอน) — ใช้ได้ทั้งกับข้อมูล
 * ใหม่และ**กู้ข้อมูลแถวเก่า**ที่เคยเสียไปแล้วให้อ่านออกถูกต้องโดยอัตโนมัติ
 */
function normalizePhone_(value) {
  const raw = normalize_(value);
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // เติม 0 กลับเฉพาะกรณีที่ "เหลือ 9 หลัก และยังไม่ได้ขึ้นต้นด้วย 0" เท่านั้น —
  // เงื่อนไข `charAt(0) !== "0"` สำคัญมาก: ถ้าไม่เช็ค เบอร์บ้าน 9 หลักที่ขึ้นต้น
  // ด้วย 0 อยู่แล้ว (เช่น "021234567") จะโดนเติมซ้ำกลายเป็น "0021234567"
  return digits.length === 9 && digits.charAt(0) !== "0" ? "0" + digits : digits;
}

function generateMemberId_() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return "M-" + ts + "-" + rand;
}

function getAllDataRows_(sheet) {
  if (!sheet) {
    throw new Error(
      "getAllDataRows_ ถูกเรียกด้วย sheet เป็น null/undefined — ผู้เรียกต้องได้ sheet มาจาก getSheet_() เท่านั้น",
    );
  }
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
    // [Fix] เดิมส่ง row[3] ดิบ ๆ ออกไป — ถ้าเซลล์นั้นถูกเก็บเป็น Number มาก่อน
    // (ข้อมูลเก่าที่บันทึกไว้ก่อนแก้บั๊กนี้) แอปจะได้ค่าเป็น "ตัวเลข" ที่ขาดเลข 0
    // นำหน้าไปแสดงผล/เก็บลง LocalStorage ต่อ normalizePhone_ เติม 0 กลับให้เอง
    // จึงกู้ข้อมูลแถวเก่าให้ "อ่านออกถูกต้อง" ได้ทันทีโดยไม่ต้องไล่แก้ในชีต
    phone: normalizePhone_(row[3]),
    lineUserId: row[4],
    displayName: row[5],
    pictureUrl: row[6],
    registerDate: row[7],
    lastLogin: row[8],
    point: Number(row[9]) || 0,
    totalVisit: Number(row[10]) || 0,
    birthYear: birthYearRaw === "" ? null : birthYearRaw,
    gender: normalize_(row[12]),
  };
}

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

function findRowIndexByPhone_(sheet, phone) {
  // [Fix] เทียบด้วย normalizePhone_ ทั้งสองฝั่ง (ไม่ใช่ normalize_ เฉย ๆ) เพื่อให้
  // แถวเก่าที่เบอร์ถูกเก็บเป็นตัวเลข (812345678) ยัง match กับค่าที่แอปส่งมา
  // ("0812345678") ได้ — เดิมเทียบไม่ติด ระบบจึงเข้าใจผิดว่าเป็นสมาชิกใหม่แล้ว
  // **สร้างแถวซ้ำ** ทุกครั้งที่คนเดิม login เข้ามา (บั๊กเงียบที่ทำให้ข้อมูลบาน)
  const ph = normalizePhone_(phone);
  if (!ph) return -1;
  const rows = getAllDataRows_(sheet);
  for (let i = 0; i < rows.length; i++) {
    if (normalizePhone_(rows[i][3]) === ph) return i + 2;
  }
  return -1;
}

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

function normalizeApiResponse_(result) {
  if (!result || typeof result !== "object") {
    result = { success: false, error: "Invalid response from action handler" };
  }
  const success = result.success === true;
  const message =
    typeof result.message === "string" && result.message
      ? result.message
      : success
        ? "OK"
        : result.error || "Unknown error";

  const data = {};
  Object.keys(result).forEach(function (key) {
    if (key !== "success" && key !== "message") data[key] = result[key];
  });

  return Object.assign(
    { success: success, message: message, data: data },
    result,
  );
}

function jsonOutput_(obj) {
  Logger.log("[LOGIN DEBUG 12] creating JSON response");
  const output = ContentService.createTextOutput(
    JSON.stringify(normalizeApiResponse_(obj)),
  ).setMimeType(ContentService.MimeType.JSON);
  Logger.log("[LOGIN DEBUG 13] returning response");
  return output;
}

function errorResponse_(message) {
  return jsonOutput_({ success: false, error: message, message: message });
}

function requireIdentityFields_(payload) {
  if (!payload || !payload.firstName || !payload.lastName || !payload.phone) {
    return "firstName, lastName และ phone จำเป็นต้องส่งมาทั้งหมด";
  }
  return null;
}

function createMemberRow_(sheet, payload, now) {
  const memberId = generateMemberId_();
  const newRow = [
    memberId,
    normalize_(payload.firstName),
    normalize_(payload.lastName),
    normalizePhone_(payload.phone),
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
  // [Fix] appendRow() แปลง "0812345678" เป็นตัวเลข 812345678 ทิ้งเลข 0 นำหน้าเสมอ
  // (ไม่เคารพ number format '@' ที่ตั้งไว้ล่วงหน้า — ดูคำอธิบายเต็มที่
  // writePhoneAsText_) จึงต้องเขียนทับเซลล์เบอร์โทรของแถวที่เพิ่ง append ด้วย
  // setValue() อีกครั้งทันที ซึ่งเคารพ format '@' และเก็บเป็น string จริง
  writePhoneAsText_(sheet, sheet.getLastRow(), newRow[3]);
  return rowToMember_(newRow);
}

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

  sheet
    .getRange(rowIndex, 5, 1, 3)
    .setValues([[lineUserId, displayName, pictureUrl]]);
  sheet.getRange(rowIndex, 9).setValue(now);
  sheet.getRange(rowIndex, 11).setValue(totalVisit);
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
    const member = createMemberRow_(sheet, payload, now);
    return { success: true, isNewMember: true, member: member };
  }

  const member = updateMemberRow_(sheet, rowIndex, payload, now, true);
  return { success: true, isNewMember: false, member: member };
}

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

  Logger.log("[LOGIN DEBUG 5] entering getSheet_");
  const sheet = getSheet_();
  Logger.log("[LOGIN DEBUG 6] getSheet_ completed");
  Logger.log(
    "[actionLoginByLine_] ใช้ Spreadsheet ID=%s เดียวกับ actionRegister_/actionLogin_ (ผ่าน getSheet_() ร่วมกัน), Sheet Name=%s",
    SPREADSHEET_ID,
    sheet.getName(),
  );
  Logger.log("[LOGIN DEBUG 7] entering findRowIndexByLineUserId_");
  const rowIndex = findRowIndexByLineUserId_(sheet, lineUserId);
  Logger.log("[LOGIN DEBUG 8] find row completed");
  Logger.log("[LOGIN DEBUG 9] rowIndex = " + rowIndex);
  if (rowIndex === -1) {
    console.log(
      '[actionLoginByLine_] lineUserId="' +
        lineUserId +
        '" -> found:false, ตอบกลับให้ frontend พาไปหน้าสมัครสมาชิก',
    );
    return {
      success: true,
      found: false,
      _debug: { receivedLineUserId: lineUserId, matchedRow: null },
    };
  }

  const now = bangkokNow_();
  Logger.log("[LOGIN DEBUG 10] entering updateMemberRow_");
  const member = updateMemberRow_(
    sheet,
    rowIndex,
    { lineUserId: lineUserId },
    now,
    true,
  );
  Logger.log("[LOGIN DEBUG 11] updateMemberRow_ completed");
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
    // [Fix] ใช้ normalizePhone_ ทั้งค่าใหม่และค่าเดิม — ค่าเดิม (current[3]) อาจ
    // เป็น Number จากข้อมูลเก่า ถ้าเขียนกลับดิบ ๆ เลข 0 จะหายซ้ำอีกรอบ
    payload.phone !== undefined
      ? normalizePhone_(payload.phone)
      : normalizePhone_(current[3]),
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
  // [Fix] บังคับ format '@' ที่เซลล์เบอร์โทร "ก่อน" setValues เสมอ — กันกรณีแถวนี้
  // อยู่นอกช่วงที่ ensurePhoneColumnIsText_() เคยฟอร์แมตไว้ (เช่นชีตถูกขยายแถว
  // เพิ่มภายหลัง) ซึ่งจะทำให้ Sheets ตีความเป็นตัวเลขแล้วตัดเลข 0 นำหน้าอีก
  writePhoneAsText_(sheet, rowIndex, merged[3]);
  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([merged]);
  return { success: true, member: rowToMember_(merged) };
}

/**
 * [เครื่องมือซ่อมข้อมูลเก่า — รันมือเท่านั้น ไม่มี action ไหนเรียกใช้]
 *
 * ไล่แก้เบอร์โทรทุกแถวในชีต Members ที่เคยถูกบันทึกเป็น "ตัวเลข" (เลข 0 นำหน้าหาย)
 * ให้กลับมาเป็น string 10 หลักที่ถูกต้อง แล้วบังคับ format เซลล์เป็น Text
 *
 * วิธีใช้: เปิด Apps Script Editor > เลือกฟังก์ชัน `repairPhoneNumbers` จาก
 * dropdown ด้านบน > กด Run > ดูผลใน Execution log
 *
 * ปลอดภัย: แก้เฉพาะแถวที่ค่าปัจจุบัน "ต่างจาก" ค่าที่ normalize แล้วเท่านั้น
 * (แถวที่ถูกต้องอยู่แล้วจะถูกข้าม ไม่มีการเขียนทับ) รันซ้ำได้ไม่มีผลข้างเคียง
 *
 * *** แนะนำให้ก๊อปปี้ชีตสำรองไว้ก่อนรันครั้งแรก (File > Make a copy) ***
 */
function repairPhoneNumbers() {
  const sheet = getSheet_();
  const rows = getAllDataRows_(sheet);
  const phoneCol = HEADERS.indexOf("Phone Number") + 1;
  let fixed = 0;
  const changes = [];

  for (let i = 0; i < rows.length; i++) {
    const rowIndex = i + 2;
    const before = rows[i][3];
    const after = normalizePhone_(before);
    // เทียบแบบ string เพื่อจับทั้งกรณี "เป็น Number" และ "เป็น string ที่ขาด 0"
    if (after !== "" && String(before) !== after) {
      writePhoneAsText_(sheet, rowIndex, after);
      changes.push("แถว " + rowIndex + ": " + String(before) + " -> " + after);
      fixed++;
    }
  }

  const summary =
    "[repairPhoneNumbers] ตรวจ " +
    rows.length +
    " แถว, แก้ไข " +
    fixed +
    " แถว" +
    (changes.length ? "\n" + changes.join("\n") : "");
  Logger.log(summary);
  console.log(summary);
  return summary;
}

const DEPLOYED_CODE_VERSION_ = "2026-08-09-hardcoded-spreadsheet-id";

function actionPing_() {
  // ⚠️ FIX: openById(SPREADSHEET_ID) แทน getActiveSpreadsheet() — ดูคำอธิบายที่ประกาศ
  // ค่าคงที่ SPREADSHEET_ID ด้านบนไฟล์. ถ้า spreadsheetId ที่ ping คืนมา "ไม่ตรง" กับ
  // ID ของ Google Sheet ที่คุณเปิดดูอยู่จริง ให้ตรวจสอบว่าใส่ SPREADSHEET_ID ผิดหรือไม่
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const info = {
    deployedCodeVersion: DEPLOYED_CODE_VERSION_,
    configuredSpreadsheetId: SPREADSHEET_ID,
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

  info.stationsServiceLoaded = typeof actionListStations_ === "function";
  info.sideQuestsServiceLoaded = typeof actionListSideQuests_ === "function";
  info.stationsSheetFound = !!ss.getSheetByName("Stations");
  info.sideQuestsSheetFound = !!ss.getSheetByName("SideQuests");
  // ไฟล์ใหม่: Photo Detection Quest — ดู PhotoQuestService.gs
  info.photoQuestServiceLoaded = typeof actionListPhotoQuests_ === "function";
  info.photoQuestsSheetFound = !!ss.getSheetByName("PhotoQuests");
  info.photoQuestCompletionsSheetFound = !!ss.getSheetByName("PhotoQuestCompletions");
  // ไฟล์ใหม่: ระบบภารกิจ + คำถามประจำฐาน — ดู QuestionService.gs
  info.questionServiceLoaded = typeof actionListQuestions_ === "function";
  info.questionsSheetFound = !!ss.getSheetByName("Questions");
  info.answersSheetFound = !!ss.getSheetByName("Answers");
  // ไฟล์ใหม่: ระบบแลกของรางวัล — ดู RewardService.gs
  info.rewardServiceLoaded = typeof actionGetRewardStatus_ === "function";
  info.rewardsSheetFound = !!ss.getSheetByName("Rewards");
  info.rewardClaimsSheetFound = !!ss.getSheetByName("RewardClaims");

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
        Logger.log("[LOGIN DEBUG 3] action = loginByLine");
        Logger.log("[LOGIN DEBUG 4] entering actionLoginByLine_");
        return jsonOutput_(actionLoginByLine_(payload));
      case "updateMember":
        return jsonOutput_(actionUpdateMember_(payload));
      case "getMember":
        return jsonOutput_(actionGetMember_(payload));
      case "checkin":
        return jsonOutput_(actionCheckin_(payload));
      case "getJourney":
        return jsonOutput_(actionGetJourney_(payload));
      case "getScore":
        return jsonOutput_(actionGetScore_(payload));
      case "getLeaderboard":
        return jsonOutput_(actionGetLeaderboard_(payload));
      case "roundStart":
        return jsonOutput_(actionRoundStart_(payload));
      case "roundEnd":
        return jsonOutput_(actionRoundEnd_(payload));
      case "getRound":
        return jsonOutput_(actionGetRound_(payload));
      case "listStations":
        return jsonOutput_(actionListStations_());
      case "createStation":
        return jsonOutput_(actionCreateStation_(payload));
      case "updateStation":
        return jsonOutput_(actionUpdateStation_(payload));
      case "deleteStation":
        return jsonOutput_(actionDeleteStation_(payload));
      // ไฟล์ใหม่: action 'verifyStationQr' — Frontend สแกน QR ของฐานจริง (ONLINE
      // เท่านั้น) แล้วส่ง qrToken มาตรวจสอบตรงนี้ ก่อนเอาไป Check-in/บันทึก Journey
      // ต่อ (ดู actionVerifyStationQr_ ใน StationsService.gs — ไม่เขียนข้อมูลใด ๆ)
      case "verifyStationQr":
        return jsonOutput_(actionVerifyStationQr_(payload));
      case "listSideQuests":
        return jsonOutput_(actionListSideQuests_());
      case "createSideQuest":
        return jsonOutput_(actionCreateSideQuest_(payload));
      case "updateSideQuest":
        return jsonOutput_(actionUpdateSideQuest_(payload));
      case "deleteSideQuest":
        return jsonOutput_(actionDeleteSideQuest_(payload));
      // ไฟล์ใหม่: action 'submitSurvey' — บันทึกแบบประเมินหลังจบเกม (ดู
      // actionSubmitSurvey_ ใน SurveyService.gs) ข้อ 1: "ท่านชอบด่านไหนมากที่สุด"
      // ให้คะแนน 1-5 — เรียกจาก pages/scan.vue ตอนกดยืนยันแบบประเมินก่อนออกจาก
      // Popup ฐานนม/ฐานสุดท้าย
      case "submitSurvey":
        return jsonOutput_(actionSubmitSurvey_(payload));
      // ไฟล์ใหม่: ระบบ Photo Detection Quest — ดู PhotoQuestService.gs
      // (ชีต "PhotoQuests" + "PhotoQuestCompletions" แยกต่างหากจากทุกชีตเดิม
      // ไม่แตะ Stations/SideQuests/Journey/Score/Round เลย)
      case "listPhotoQuests":
        return jsonOutput_(actionListPhotoQuests_());
      case "completePhotoQuest":
        return jsonOutput_(actionCompletePhotoQuest_(payload));
      case "createPhotoQuest":
        return jsonOutput_(actionCreatePhotoQuest_(payload));
      case "updatePhotoQuest":
        return jsonOutput_(actionUpdatePhotoQuest_(payload));
      case "deletePhotoQuest":
        return jsonOutput_(actionDeletePhotoQuest_(payload));
      // ไฟล์ใหม่: ระบบ "ภารกิจ + คำถามประจำฐาน" ตาม Flow ใหม่ — ดู
      // QuestionService.gs (ชีต "Questions" + "Answers" แยกต่างหาก) แต้มที่ตอบ
      // ถูกจะถูกบวกเข้าชีต "Score" ก้อนเดียวกับแต้มฐาน ผ่าน upsertScore_() เดิม
      // ของ ScoreService.gs (ไม่แก้ ScoreService.gs เลยสักบรรทัด)
      case "listQuestions":
        return jsonOutput_(actionListQuestions_(payload));
      case "submitAnswer":
        return jsonOutput_(actionSubmitAnswer_(payload));
      case "getRoundAnswers":
        return jsonOutput_(actionGetRoundAnswers_(payload));
      // ไฟล์ใหม่: ระบบแลกของรางวัลตามเงื่อนไขคะแนน — ดู RewardService.gs (ชีต
      // "Rewards" + "RewardClaims" แยกต่างหาก) claimReward ตั้งใจให้เรียกจากหน้า
      // เจ้าหน้าที่ (pages/redeem.vue) เท่านั้น ไม่มีปุ่มนี้ในหน้าผู้เล่นเอง
      case "getRewardStatus":
        return jsonOutput_(actionGetRewardStatus_(payload));
      case "claimReward":
        return jsonOutput_(actionClaimReward_(payload));
      case "listRewards":
        return jsonOutput_(actionListRewards_());
      default:
        return errorResponse_(
          "action ไม่ถูกต้องหรือไม่ได้ระบุ ต้องเป็นหนึ่งใน: ping, checkMember, register, login, loginByLine, updateMember, getMember, checkin, getJourney, getScore, getLeaderboard, roundStart, roundEnd, getRound, listStations, createStation, updateStation, deleteStation, verifyStationQr, listSideQuests, createSideQuest, updateSideQuest, deleteSideQuest, submitSurvey, listPhotoQuests, completePhotoQuest, createPhotoQuest, updatePhotoQuest, deletePhotoQuest, listQuestions, submitAnswer, getRoundAnswers, getRewardStatus, claimReward, listRewards",
        );
    }
  } catch (err) {
    return errorResponse_(err && err.message ? err.message : String(err));
  }
}

function doPost(e) {
  // [POST DEBUG] บล็อกนี้เป็น diagnostic logging ล้วน ๆ เพิ่มเข้ามาเพื่อพิสูจน์ว่า
  // POST จาก Production เข้าถึง doPost(e) ของ deployment เวอร์ชันนี้จริงหรือไม่
  // ไม่เปลี่ยน logic เดิมของ doPost แม้แต่บรรทัดเดียว (ยังคง parse -> handleRequest_
  // ตามเดิมทุกประการ) — ดูผลได้ที่ Apps Script Editor > Executions
  Logger.log("[POST DEBUG] doPost ENTERED");
  Logger.log("[LOGIN DEBUG 1] doPost entered");
  try {
    const contentType =
      e && e.postData && e.postData.type
        ? e.postData.type
        : "(no postData.type)";
    Logger.log("[POST DEBUG] content type: " + contentType);

    const rawContents =
      e && e.postData && e.postData.contents
        ? e.postData.contents
        : "(no postData.contents)";
    Logger.log("[POST DEBUG] raw contents: " + rawContents);
  } catch (logErr) {
    Logger.log(
      "[POST DEBUG] error while logging content type/raw contents: " + logErr,
    );
  }

  let payload = {};
  try {
    payload = JSON.parse(e.postData.contents);
    Logger.log("[LOGIN DEBUG 2] JSON parsed");
  } catch (err) {
    Logger.log("[POST DEBUG] JSON.parse failed: " + err);
    return errorResponse_("Body ที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง");
  }

  try {
    Logger.log("[POST DEBUG] parsed action: " + (payload && payload.action));
    Logger.log(
      "[POST DEBUG] parsed lineUserId: " + (payload && payload.lineUserId),
    );
  } catch (logErr2) {
    Logger.log(
      "[POST DEBUG] error while logging parsed action/lineUserId: " + logErr2,
    );
  }

  Logger.log("[POST DEBUG] calling handleRequest_");
  return handleRequest_(payload);
}

function doGet(e) {
  const payload = Object.assign({}, e.parameter);
  return handleRequest_(payload);
}
