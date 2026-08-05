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
 * Id | Order | Name | Points | Description | Active | UpdatedAt | ImageUrl
 *
 * - Id         : รหัสฐาน สร้างอัตโนมัติตอนสร้างใหม่ (generateStationId_) ไม่เปลี่ยนอีก
 * - Order      : ลำดับการแสดงผลบนแผนที่/หน้าเกม (เรียงน้อย -> มาก)
 * - Points     : คะแนนที่ได้รับเมื่อผ่านฐานนี้
 * - Active     : true/false — ฐานที่ active:false จะไม่แสดงในหน้าเกม (ปิดฐานชั่วคราวได้
 *                โดยไม่ต้องลบทิ้ง)
 * - UpdatedAt  : วันที่-เวลา Asia/Bangkok ล่าสุดที่มีการแก้ไขแถวนี้ (ดู bangkokNow_() ใน Code.gs)
 * - ImageUrl   : URL รูปภาพประจำฐาน (ไม่บังคับ, ค่าว่างได้) — ต่อท้ายสุดโดยตั้งใจ ไม่แทรกกลาง
 *                เพื่อไม่ให้กระทบตำแหน่งคอลัมน์ของแถวเดิมที่อาจมีอยู่แล้วก่อนเพิ่มฟีเจอร์นี้
 */

const STATIONS_SHEET_NAME = 'Stations'
const STATIONS_HEADERS = [
  'Id',
  'Order',
  'Name',
  'Points',
  'Description',
  'Active',
  'UpdatedAt',
  'ImageUrl',
]

/** คืนค่าชีต "Stations" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getStationsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(STATIONS_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(STATIONS_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(STATIONS_HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

function getAllStationRows_(sheet) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, STATIONS_HEADERS.length).getValues()
}

function rowToStation_(row) {
  return {
    id: row[0],
    order: Number(row[1]) || 0,
    name: row[2],
    points: Number(row[3]) || 0,
    description: row[4],
    active: row[5] === true || String(row[5]).toUpperCase() === 'TRUE',
    updatedAt: row[6],
    // row[7] อาจเป็น undefined สำหรับแถวเก่าก่อนเพิ่มคอลัมน์นี้ — ให้ fallback เป็นค่าว่าง
    imageUrl: row[7] ? String(row[7]) : '',
  }
}

/** สร้างรหัสฐานใหม่ ไม่ซ้ำกัน เช่น STN-LXQK3F-A1B (รูปแบบเดียวกับ generateMemberId_) */
function generateStationId_() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return 'STN-' + ts + '-' + rand
}

/** คืนค่า row number จริงบนชีต (1-indexed) ของฐาน (id) หรือ -1 ถ้าไม่พบ */
function findStationRowIndexById_(sheet, id) {
  const target = normalize_(id)
  if (!target) return -1
  const rows = getAllStationRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === target) return i + 2
  }
  return -1
}

/** ดึงรายชื่อฐานทั้งหมด เรียงตาม Order (น้อย -> มาก) — ใช้ทั้งฝั่ง Admin (แสดงตาราง)
 * และฝั่งเกม (โหลดฐานจริงแทน mock data เดิม) */
function listStations_(sheet) {
  const rows = getAllStationRows_(sheet)
  return rows.map(rowToStation_).sort(function (a, b) { return a.order - b.order })
}

/** สร้างฐานใหม่ 1 แถว — id/updatedAt กำหนดโดยฝั่งนี้เสมอ (ผู้เรียกส่งมาไม่มีผล) */
function createStation_(sheet, input, now) {
  const id = generateStationId_()
  const newRow = [
    id,
    Number(input.order) || 0,
    normalize_(input.name),
    Number(input.points) || 0,
    normalize_(input.description),
    input.active !== false,
    now,
    normalize_(input.imageUrl),
  ]
  sheet.appendRow(newRow)
  return rowToStation_(newRow)
}

/** แก้ไขฐานที่มีอยู่แล้วด้วย id — อัปเดตเฉพาะฟิลด์ที่ส่งมา (undefined = คงค่าเดิมไว้) */
function updateStation_(sheet, rowIndex, input, now) {
  const current = sheet.getRange(rowIndex, 1, 1, STATIONS_HEADERS.length).getValues()[0]
  const updatedRow = [
    current[0],
    input.order !== undefined ? Number(input.order) || 0 : current[1],
    input.name !== undefined ? normalize_(input.name) : current[2],
    input.points !== undefined ? Number(input.points) || 0 : current[3],
    input.description !== undefined ? normalize_(input.description) : current[4],
    input.active !== undefined ? !!input.active : current[5],
    now,
    input.imageUrl !== undefined ? normalize_(input.imageUrl) : current[7],
  ]
  sheet.getRange(rowIndex, 1, 1, STATIONS_HEADERS.length).setValues([updatedRow])
  return rowToStation_(updatedRow)
}

/** ลบฐาน 1 แถวด้วย id */
function deleteStationRow_(sheet, rowIndex) {
  sheet.deleteRow(rowIndex)
}

/* ------------------------------ Action handlers (เรียกจาก router ใน Code.gs) ------------------------------ */

/** action 'listStations' — ดึงฐานทั้งหมด (ไม่เขียนข้อมูล) ใช้ทั้งหน้า Admin และหน้าเกม */
function actionListStations_() {
  const sheet = getStationsSheet_()
  return { success: true, stations: listStations_(sheet) }
}

/** action 'createStation' — สร้างฐานใหม่ (ใช้โดยหน้า Admin > Stations) */
function actionCreateStation_(payload) {
  if (!payload || !normalize_(payload.name)) {
    return { success: false, error: 'name จำเป็นต้องส่งมา' }
  }
  const sheet = getStationsSheet_()
  const station = createStation_(sheet, payload, bangkokNow_())
  return { success: true, station: station }
}

/** action 'updateStation' — แก้ไขฐานด้วย id (รวมถึงสลับ active เปิด/ปิด) */
function actionUpdateStation_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: 'id จำเป็นต้องส่งมา' }
  }
  const sheet = getStationsSheet_()
  const rowIndex = findStationRowIndexById_(sheet, payload.id)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบฐานตาม id ที่ระบุ' }
  }
  const station = updateStation_(sheet, rowIndex, payload, bangkokNow_())
  return { success: true, station: station }
}

/** action 'deleteStation' — ลบฐานด้วย id */
function actionDeleteStation_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: 'id จำเป็นต้องส่งมา' }
  }
  const sheet = getStationsSheet_()
  const rowIndex = findStationRowIndexById_(sheet, payload.id)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบฐานตาม id ที่ระบุ' }
  }
  deleteStationRow_(sheet, rowIndex)
  return { success: true }
}
