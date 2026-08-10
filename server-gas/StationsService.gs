/**
 * StationsService.gs
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Service แยกต่างหากสำหรับชีต "Stations" ใช้จัดการ "รายชื่อฐาน"
 * ของเกม (ที่ก่อนหน้านี้ hardcode ไว้ใน frontend เช่น useStations.ts) ให้แก้ไข
 * ได้จากหน้า Admin โดยไม่ต้องแก้โค้ด/deploy frontend ใหม่ทุกครั้ง
 *
 * ไฟล์นี้ไม่รู้จัก/ไม่แตะต้องชีต "Members", "Journey", "Score", "SideQuests"
 * เลย — เป็น service เฉพาะของชีต Stations เท่านั้น (แยก concern ตามชีต
 * เหมือนไฟล์ JourneyService.gs/ScoreService.gs เดิม)
 *
 * โครงสร้างชีต "Stations" (สร้างอัตโนมัติเมื่อเรียกใช้งานครั้งแรก ไม่ต้องสร้างมือ):
 * Id | Order | Name | Points | Description | Active | UpdatedAt | ImageUrl | Type | Lat | Lng
 *
 * - Id         : รหัสฐาน สร้างอัตโนมัติตอนสร้างใหม่ (generateStationId_) ไม่เปลี่ยนอีก
 * - Order      : ลำดับการแสดงผลบนแผนที่/หน้าเกม (เรียงน้อย -> มาก)
 * - Points     : คะแนนที่ได้รับเมื่อผ่านฐานนี้
 * - Active     : true/false — ฐานที่ active:false จะไม่แสดงในหน้าเกม (ปิดฐานชั่วคราวได้
 *                โดยไม่ต้องลบทิ้ง)
 * - UpdatedAt  : วันที่-เวลา Asia/Bangkok ล่าสุดที่มีการแก้ไขแถวนี้ (ดู bangkokNow_() ใน Code.gs)
 * - ImageUrl   : URL รูปภาพประจำฐาน (ไม่บังคับ, ค่าว่างได้) — ต่อท้ายสุดโดยตั้งใจ ไม่แทรกกลาง
 *                เพื่อไม่ให้กระทบตำแหน่งคอลัมน์ของแถวเดิมที่อาจมีอยู่แล้วก่อนเพิ่มฟีเจอร์นี้
 * - Type       : ประเภทฐานบนแผนที่ (ค่าที่รู้จัก: corn/cow/soil/milk — ใช้จับคู่ไอคอน/สี
 *                Marker ฝั่งเกม) ไม่บังคับ, ว่างได้ (ฝั่งเกมจะ fallback ไปใช้ค่าตั้งต้นเอง)
 * - Lat / Lng  : พิกัดภูมิศาสตร์จริงของฐานบนแผนที่ (Leaflet/OpenStreetMap) ไม่บังคับ,
 *                ว่างได้ (ฝั่งเกมจะ fallback ไปใช้พิกัดตั้งต้นถ้าไม่ได้ตั้งไว้) — เพิ่มมาเพื่อ
 *                ให้ Admin ปรับตำแหน่งหมุดบนแผนที่ได้จริงโดยไม่ต้องแก้โค้ด frontend
 * - QrToken    : รหัส QR ประจำฐาน ไม่ซ้ำกันในระบบ (สร้างอัตโนมัติตอนสร้างฐานใหม่ —
 *                generateStationQrToken_) ใช้พิมพ์ลง QR Code จริงติดหน้างาน — Frontend
 *                สแกนแล้วส่งค่านี้กลับมาตรวจสอบผ่าน action 'verifyStationQr' (ONLINE
 *                เท่านั้น ดู actionVerifyStationQr_ ด้านล่าง) — ต่อท้ายสุดโดยตั้งใจ
 *                เหมือน ImageUrl/Type/Lat/Lng เพื่อไม่กระทบตำแหน่งคอลัมน์เดิม
 */

const STATIONS_SHEET_NAME = "Stations";
const STATIONS_HEADERS = [
  "Id",
  "Order",
  "Name",
  "Points",
  "Description",
  "Active",
  "UpdatedAt",
  "ImageUrl",
  "Type",
  "Lat",
  "Lng",
  "QrToken",
];
// ตำแหน่งคอลัมน์ (0-indexed) ของ QrToken — ใช้ backfillMissingQrTokens_/rowToStation_
var STATIONS_QR_TOKEN_COL_INDEX = STATIONS_HEADERS.length - 1;

/** คืนค่าชีต "Stations" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getStationsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(STATIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(STATIONS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(STATIONS_HEADERS);
    sheet.setFrozenRows(1);
  } else {
    migrateStationsSheetIfNeeded_(sheet);
    // เติม QrToken ให้ฐานเก่าที่สร้างไว้ก่อนเพิ่มฟีเจอร์นี้ (คอลัมน์ว่าง) โดยอัตโนมัติ
    // ไม่กระทบฐานที่มี QrToken อยู่แล้วเลย (ข้ามแถวที่มีค่าอยู่แล้วทั้งหมด)
    backfillMissingQrTokens_(sheet);
  }
  return sheet;
}

/** Migration: เผื่อชีต "Stations" ถูกสร้างจากเวอร์ชันก่อนเพิ่มคอลัมน์ Type/Lat/Lng
 * (มีแค่ 8 คอลัมน์ถึง ImageUrl) — เติมหัวตารางที่ขาดให้ครบโดยอัตโนมัติ ไม่กระทบ
 * ข้อมูลแถวเดิมที่มีอยู่แล้วเลย (แถวเก่าจะมีค่า Type/Lat/Lng เป็นค่าว่างไปก่อน
 * จนกว่า Admin จะเข้าไปแก้ไขฐานนั้นแล้วตั้งค่าเอง) */
function migrateStationsSheetIfNeeded_(sheet) {
  const currentCols = sheet.getLastColumn();
  if (currentCols >= STATIONS_HEADERS.length) return;

  const missingHeaders = STATIONS_HEADERS.slice(currentCols);
  sheet
    .getRange(1, currentCols + 1, 1, missingHeaders.length)
    .setValues([missingHeaders]);
}

function getAllStationRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, STATIONS_HEADERS.length).getValues();
}

function rowToStation_(row) {
  return {
    id: row[0],
    order: Number(row[1]) || 0,
    name: row[2],
    points: Number(row[3]) || 0,
    description: row[4],
    active: row[5] === true || String(row[5]).toUpperCase() === "TRUE",
    updatedAt: row[6],
    // row[7] อาจเป็น undefined สำหรับแถวเก่าก่อนเพิ่มคอลัมน์นี้ — ให้ fallback เป็นค่าว่าง
    imageUrl: row[7] ? String(row[7]) : "",
    // row[8..10] อาจเป็น undefined สำหรับแถวเก่าก่อนเพิ่ม Type/Lat/Lng — fallback ค่าว่าง/null
    type: row[8] ? String(row[8]) : "",
    lat:
      row[9] === "" || row[9] === undefined || row[9] === null
        ? null
        : Number(row[9]),
    lng:
      row[10] === "" || row[10] === undefined || row[10] === null
        ? null
        : Number(row[10]),
    // row[11] อาจเป็น undefined สำหรับแถวเก่าก่อนเพิ่มคอลัมน์นี้ — ปกติจะไม่เกิดขึ้นเพราะ
    // getStationsSheet_() เรียก backfillMissingQrTokens_() ให้ทุกแถวมีค่าเสมอแล้ว
    // แต่กันไว้เผื่อเรียก rowToStation_() ตรง ๆ จากที่อื่นในอนาคต
    qrToken: row[11] ? String(row[11]) : "",
  };
}

/** สร้างรหัสฐานใหม่ ไม่ซ้ำกัน เช่น STN-LXQK3F-A1B (รูปแบบเดียวกับ generateMemberId_) */
function generateStationId_() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return "STN-" + ts + "-" + rand;
}

/** อ่านค่าคอลัมน์ QrToken ของทุกแถว คืนเป็น array ของ string ที่ normalize แล้ว
 * (ใช้เช็คความซ้ำก่อนสร้าง/backfill token ใหม่) */
function getAllStationQrTokens_(sheet) {
  const rows = getAllStationRows_(sheet);
  return rows.map(function (row) {
    return normalize_(row[STATIONS_QR_TOKEN_COL_INDEX]);
  });
}

/** สร้างรหัส QR ใหม่ ไม่ซ้ำกับที่มีอยู่แล้วในชีต (existingTokens) เช่น
 * QR-LXQK3F-A1B — วนสร้างซ้ำจนกว่าจะไม่ชนของเดิม (โอกาสชนต่ำมาก แต่กันไว้ให้ชัวร์
 * เพราะ QR token ต้อง unique จริงเพื่อความปลอดภัยตอน Frontend สแกนแล้วยิงมาตรวจสอบ) */
function generateStationQrToken_(existingTokens) {
  const used = {};
  for (let i = 0; i < existingTokens.length; i++) {
    if (existingTokens[i]) used[existingTokens[i]] = true;
  }
  let token;
  do {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    token = "QR-" + ts + "-" + rand;
  } while (used[token]);
  return token;
}

/** เติม QrToken ให้ทุกแถวที่ยังว่างอยู่ (ฐานเก่าก่อนเพิ่มฟีเจอร์นี้) แบบ batch เดียว
 * ไม่แตะแถวที่มี QrToken อยู่แล้วเลย — เรียกทุกครั้งที่ getStationsSheet_() เพื่อการันตี
 * ว่าฐานทุกตัว (รวมที่ถูกสร้างด้วยมือในชีตโดยตรง) จะมี QR token ให้ใช้งานได้เสมอ */
function backfillMissingQrTokens_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const qrCol = STATIONS_QR_TOKEN_COL_INDEX + 1; // 1-indexed สำหรับ Range
  const values = sheet.getRange(2, qrCol, lastRow - 1, 1).getValues();
  const existingTokens = getAllStationQrTokens_(sheet);

  let hasMissing = false;
  for (let i = 0; i < values.length; i++) {
    if (!normalize_(values[i][0])) {
      const token = generateStationQrToken_(existingTokens);
      existingTokens.push(token);
      values[i][0] = token;
      hasMissing = true;
    }
  }
  if (hasMissing) {
    sheet.getRange(2, qrCol, values.length, 1).setValues(values);
  }
}

/** คืนค่า row number จริงบนชีต (1-indexed) ของฐานที่ตรงกับ QR token ที่สแกนมา
 * หรือ -1 ถ้าไม่พบ (ใช้โดย actionVerifyStationQr_ เท่านั้น) */
function findStationRowIndexByQrToken_(sheet, qrToken) {
  const target = normalize_(qrToken);
  if (!target) return -1;
  const rows = getAllStationRows_(sheet);
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][STATIONS_QR_TOKEN_COL_INDEX]) === target)
      return i + 2;
  }
  return -1;
}

/** คืนค่า row number จริงบนชีต (1-indexed) ของฐาน (id) หรือ -1 ถ้าไม่พบ */
function findStationRowIndexById_(sheet, id) {
  const target = normalize_(id);
  if (!target) return -1;
  const rows = getAllStationRows_(sheet);
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === target) return i + 2;
  }
  return -1;
}

/** ดึงรายชื่อฐานทั้งหมด เรียงตาม Order (น้อย -> มาก) — ใช้ทั้งฝั่ง Admin (แสดงตาราง)
 * และฝั่งเกม (โหลดฐานจริงแทน mock data เดิม) */
function listStations_(sheet) {
  const rows = getAllStationRows_(sheet);
  return rows.map(rowToStation_).sort(function (a, b) {
    return a.order - b.order;
  });
}

/** สร้างฐานใหม่ 1 แถว — id/updatedAt/qrToken กำหนดโดยฝั่งนี้เสมอ (ผู้เรียกส่งมาไม่มีผล
 * สำหรับ qrToken — การันตีว่าไม่ซ้ำและสร้างจากฝั่ง server เท่านั้น) */
function createStation_(sheet, input, now) {
  const id = generateStationId_();
  const qrToken = generateStationQrToken_(getAllStationQrTokens_(sheet));
  const newRow = [
    id,
    Number(input.order) || 0,
    normalize_(input.name),
    Number(input.points) || 0,
    normalize_(input.description),
    input.active !== false,
    now,
    normalize_(input.imageUrl),
    normalize_(input.type),
    input.lat === undefined || input.lat === null || input.lat === ""
      ? ""
      : Number(input.lat),
    input.lng === undefined || input.lng === null || input.lng === ""
      ? ""
      : Number(input.lng),
    qrToken,
  ];
  sheet.appendRow(newRow);
  return rowToStation_(newRow);
}

/** แก้ไขฐานที่มีอยู่แล้วด้วย id — อัปเดตเฉพาะฟิลด์ที่ส่งมา (undefined = คงค่าเดิมไว้)
 * qrToken ปกติจะคงค่าเดิมไว้เสมอ (QR ที่พิมพ์ติดหน้างานไปแล้วต้องยังใช้ได้) — ส่ง
 * payload.regenerateQr = true มาเท่านั้นถึงจะสร้าง QR token ใหม่ทับของเดิม (เผื่อ QR
 * เดิมหลุด/รั่วไหลแล้วต้องออกใหม่) */
function updateStation_(sheet, rowIndex, input, now) {
  const current = sheet
    .getRange(rowIndex, 1, 1, STATIONS_HEADERS.length)
    .getValues()[0];
  const qrToken =
    input.regenerateQr === true
      ? generateStationQrToken_(getAllStationQrTokens_(sheet))
      : current[STATIONS_QR_TOKEN_COL_INDEX];
  const updatedRow = [
    current[0],
    input.order !== undefined ? Number(input.order) || 0 : current[1],
    input.name !== undefined ? normalize_(input.name) : current[2],
    input.points !== undefined ? Number(input.points) || 0 : current[3],
    input.description !== undefined
      ? normalize_(input.description)
      : current[4],
    input.active !== undefined ? !!input.active : current[5],
    now,
    input.imageUrl !== undefined ? normalize_(input.imageUrl) : current[7],
    input.type !== undefined ? normalize_(input.type) : current[8],
    input.lat !== undefined
      ? input.lat === null || input.lat === ""
        ? ""
        : Number(input.lat)
      : current[9],
    input.lng !== undefined
      ? input.lng === null || input.lng === ""
        ? ""
        : Number(input.lng)
      : current[10],
    qrToken,
  ];
  sheet
    .getRange(rowIndex, 1, 1, STATIONS_HEADERS.length)
    .setValues([updatedRow]);
  return rowToStation_(updatedRow);
}

/** ลบฐาน 1 แถวด้วย id */
function deleteStationRow_(sheet, rowIndex) {
  sheet.deleteRow(rowIndex);
}

/* ------------------------------ Action handlers (เรียกจาก router ใน Code.gs) ------------------------------ */

/** action 'listStations' — ดึงฐานทั้งหมด (ไม่เขียนข้อมูล) ใช้ทั้งหน้า Admin และหน้าเกม */
function actionListStations_() {
  const sheet = getStationsSheet_();
  return { success: true, stations: listStations_(sheet) };
}

/** action 'createStation' — สร้างฐานใหม่ (ใช้โดยหน้า Admin > Stations) */
function actionCreateStation_(payload) {
  if (!payload || !normalize_(payload.name)) {
    return { success: false, error: "name จำเป็นต้องส่งมา" };
  }
  const sheet = getStationsSheet_();
  const station = createStation_(sheet, payload, bangkokNow_());
  return { success: true, station: station };
}

/** action 'updateStation' — แก้ไขฐานด้วย id (รวมถึงสลับ active เปิด/ปิด) */
function actionUpdateStation_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: "id จำเป็นต้องส่งมา" };
  }
  const sheet = getStationsSheet_();
  const rowIndex = findStationRowIndexById_(sheet, payload.id);
  if (rowIndex === -1) {
    return { success: false, error: "ไม่พบฐานตาม id ที่ระบุ" };
  }
  const station = updateStation_(sheet, rowIndex, payload, bangkokNow_());
  return { success: true, station: station };
}

/** action 'deleteStation' — ลบฐานด้วย id */
function actionDeleteStation_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: "id จำเป็นต้องส่งมา" };
  }
  const sheet = getStationsSheet_();
  const rowIndex = findStationRowIndexById_(sheet, payload.id);
  if (rowIndex === -1) {
    return { success: false, error: "ไม่พบฐานตาม id ที่ระบุ" };
  }
  deleteStationRow_(sheet, rowIndex);
  return { success: true };
}

/** action 'verifyStationQr' — ไฟล์ใหม่: จุดเดียวที่ Frontend (ตอนสแกน QR ที่ติดหน้า
 * ฐานจริง, ONLINE เท่านั้น — ไม่มี logic ฝั่ง Offline ในไฟล์นี้) ยิงมาตรวจสอบว่า QR
 * token ที่สแกนได้ตรงกับฐานไหนในระบบจริงหรือไม่ ก่อนเอาไป Check-in/บันทึก Journey
 * ต่อ (คนละ action, ทำในรอบถัดไป — ไฟล์นี้แค่ "ตรวจสอบ QR แล้วคืนข้อมูลฐาน" เท่านั้น
 * ไม่เขียนข้อมูลใด ๆ ทั้งสิ้น เหมือน actionListStations_)
 *
 * payload ที่ต้องส่งมา: { action: 'verifyStationQr', qrToken: '<ค่าที่อ่านได้จาก QR>' }
 *
 * คืนค่า:
 *   - พบฐานและฐาน active     -> { success: true, station: { id, order, name, points,
 *                                  description, active, updatedAt, imageUrl, type,
 *                                  lat, lng, qrToken } } (โครงสร้างเดียวกับ action
 *                                  อื่น ๆ ของ Stations ทั้งหมด — Frontend ใช้
 *                                  station.id / station.name / station.points ต่อได้เลย)
 *   - ไม่ส่ง qrToken มา       -> { success: false, error: '...' }
 *   - หา qrToken นี้ไม่เจอ    -> { success: false, error: 'QR นี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ' }
 *   - เจอฐานแต่ปิดใช้งานอยู่  -> { success: false, error: 'ฐานนี้ปิดใช้งานอยู่ในขณะนี้' }
 */
function actionVerifyStationQr_(payload) {
  if (!payload || !normalize_(payload.qrToken)) {
    return { success: false, error: "qrToken จำเป็นต้องส่งมา" };
  }
  const sheet = getStationsSheet_();
  const rowIndex = findStationRowIndexByQrToken_(sheet, payload.qrToken);
  if (rowIndex === -1) {
    return { success: false, error: "QR นี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ" };
  }
  const row = sheet
    .getRange(rowIndex, 1, 1, STATIONS_HEADERS.length)
    .getValues()[0];
  const station = rowToStation_(row);
  if (!station.active) {
    return { success: false, error: "ฐานนี้ปิดใช้งานอยู่ในขณะนี้" };
  }
  return { success: true, station: station };
}
