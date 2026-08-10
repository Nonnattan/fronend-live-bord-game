/**
 * JourneyService.gs
 * ---------------------------------------------------------------------------
 * Service แยกต่างหากสำหรับชีต "Journey" — เก็บ "ประวัติการเข้าฐาน" ของผู้เล่น
 * (1 แถว = 1 ครั้งที่ผู้เล่นสแกน QR ผ่านฐานใดฐานหนึ่งสำเร็จ)
 *
 * ไฟล์นี้ไม่รู้จัก/ไม่แตะต้องชีต "Members" หรือ "Score" เลย — เป็น service
 * เฉพาะของชีต Journey เท่านั้น (แยก concern ตามชีต ให้แก้/ทดสอบแยกจากกันได้)
 * ธุรกิจ logic ที่ต้องประสานงานกับ Score (เช่น flow "checkin") อยู่ที่
 * CheckinService.gs แทน ไฟล์นี้เปิดเผยแค่ primitive operations ของชีต Journey
 *
 * โครงสร้างชีต "Journey" (สร้างอัตโนมัติเมื่อเรียกใช้งานครั้งแรก ไม่ต้องสร้างมือ):
 * Timestamp | UserId | DisplayName | StationId | StationName | Point | Status
 *
 * รองรับการเพิ่มฐานในอนาคตโดยอัตโนมัติ: StationId/StationName เป็นค่าที่ frontend
 * ส่งมาตรง ๆ ไม่มีชีต/ตารางรายชื่อฐานตายตัวที่ต้องแก้ทุกครั้งที่เพิ่มฐานใหม่ —
 * เพิ่มฐานใหม่ฝั่ง frontend (เช่นใน useStations.ts) แล้วส่ง stationId ใหม่มาได้เลย
 * โดยไม่ต้องแก้โค้ดฝั่งนี้แม้แต่บรรทัดเดียว
 */

const JOURNEY_SHEET_NAME = 'Journey'
const JOURNEY_HEADERS = [
  'Timestamp',
  'UserId',
  'DisplayName',
  'StationId',
  'StationName',
  'Point',
  'Status',
]

/** คืนค่าชีต "Journey" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีต "Members" หรือชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getJourneySheet_() {
  // [Audit] เช็คค่าคงที่ชื่อชีตไม่เป็น undefined/null/ว่าง ก่อนใช้งาน (ใช้ requireSheetName_
  // ที่ประกาศไว้ใน Code.gs — ไฟล์เดียวกันใน Apps Script project แชร์ global scope กัน)
  requireSheetName_(JOURNEY_SHEET_NAME, 'JOURNEY_SHEET_NAME')
  // ⚠️ FIX: openById(SPREADSHEET_ID) แทน getActiveSpreadsheet() — เหมือนที่แก้ไว้ใน
  // Code.gs::getSheet_() (SPREADSHEET_ID เป็น global const ที่ประกาศใน Code.gs เดียวกัน
  // ในโปรเจกต์ Apps Script) ถ้าไม่แก้ ฟังก์ชันนี้จะพังด้วย error เดียวกับที่ getSheet_()
  // เคยพัง เวลาเรียกผ่าน Web App (getActiveSpreadsheet() คืน null นอก container-bound context)
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(JOURNEY_SHEET_NAME)
  Logger.log(
    '[getJourneySheet_] Spreadsheet ID=%s, Sheet Name=%s, Sheet Object=%s',
    ss.getId(), JOURNEY_SHEET_NAME, sheet ? 'found' : 'null (not found yet)',
  )
  if (!sheet) {
    sheet = ss.insertSheet(JOURNEY_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(JOURNEY_HEADERS)
    sheet.setFrozenRows(1)
  }
  return assertSheetReady_(sheet, JOURNEY_SHEET_NAME, ss)
}

function getAllJourneyRows_(sheet) {
  // [Audit] เช็ค !sheet ก่อนเรียก .getLastRow()/.getRange() ทุกครั้ง
  if (!sheet) {
    throw new Error('getAllJourneyRows_ ถูกเรียกด้วย sheet เป็น null/undefined — ผู้เรียกต้องได้ sheet มาจาก getJourneySheet_() เท่านั้น')
  }
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, JOURNEY_HEADERS.length).getValues()
}

function rowToJourneyEntry_(row) {
  return {
    timestamp: row[0],
    userId: row[1],
    displayName: row[2],
    stationId: row[3],
    stationName: row[4],
    point: Number(row[5]) || 0,
    status: row[6],
  }
}

/** เช็คว่าผู้เล่น (userId) เคยเข้าฐานนี้ (stationId) มาก่อนหรือยัง — key คู่
 * userId + stationId เทียบตรง ๆ (ตัดช่องว่างหัวท้ายด้วย normalize_ จาก Code.gs) */
function hasVisitedStation_(sheet, userId, stationId) {
  const uid = normalize_(userId)
  const sid = normalize_(stationId)
  if (!uid || !sid) return false

  const rows = getAllJourneyRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][1]) === uid && normalize_(rows[i][3]) === sid) return true
  }
  return false
}

/** บันทึกการเข้าฐานใหม่ 1 แถว (ไม่เช็คซ้ำในนี้ — ผู้เรียกต้องเช็ค
 * hasVisitedStation_ ก่อนเองเสมอ เพื่อให้ไฟล์นี้ทำหน้าที่แค่ "เขียนข้อมูล"
 * ล้วน ๆ ไม่ตัดสินใจเรื่อง business rule ว่าห้ามซ้ำ) status ค่าเริ่มต้นคือ
 * 'Completed' ตามสเปก (สแกน QR ผ่านฐานสำเร็จ) */
function appendJourneyEntry_(sheet, entry) {
  const row = [
    entry.timestamp,
    normalize_(entry.userId),
    normalize_(entry.displayName),
    normalize_(entry.stationId),
    normalize_(entry.stationName),
    Number(entry.point) || 0,
    entry.status || 'Completed',
  ]
  sheet.appendRow(row)
  return rowToJourneyEntry_(row)
}

/** ดึงประวัติการเข้าฐานทั้งหมดของผู้เล่นคนเดียว เรียงตามลำดับเวลาที่บันทึก
 * (เก่า -> ใหม่ ตามลำดับแถวในชีต) ใช้แสดงหน้า History/Journey บนฝั่ง frontend */
function getJourneyEntriesByUser_(sheet, userId) {
  const uid = normalize_(userId)
  if (!uid) return []
  const rows = getAllJourneyRows_(sheet)
  const result = []
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][1]) === uid) result.push(rowToJourneyEntry_(rows[i]))
  }
  return result
}
