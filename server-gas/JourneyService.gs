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
 * Timestamp | RoundId | UserId | DisplayName | StationId | StationName | Point | Status
 *
 * RoundId: มาจาก Round ปัจจุบันของผู้ใช้ (ดู RoundService.gs — ไฟล์นี้ไม่แก้/ไม่รู้จัก
 * Round logic ใด ๆ เอง แค่รับค่า roundId ที่ผู้เรียก (CheckinService.gs) resolve มาให้
 * แล้วบันทึกเป็นคอลัมน์เฉย ๆ) ใช้กันข้อมูลซ้ำระดับ "รอบการเล่น" — ผู้เล่นที่ยังอยู่
 * ใน Round เดิม (เช่นกด "เล่นต่อ" หลังฐานสุดท้ายแล้วกลับมาสแกนฐานเดิมซ้ำ) จะไม่ถูก
 * บันทึกซ้ำ แต่ถ้าเป็นคนละ Round กันจะถือเป็นการเข้าฐานครั้งใหม่ที่ไม่ซ้ำกัน
 *
 * รองรับการเพิ่มฐานในอนาคตโดยอัตโนมัติ: StationId/StationName เป็นค่าที่ frontend
 * ส่งมาตรง ๆ ไม่มีชีต/ตารางรายชื่อฐานตายตัวที่ต้องแก้ทุกครั้งที่เพิ่มฐานใหม่ —
 * เพิ่มฐานใหม่ฝั่ง frontend (เช่นใน useStations.ts) แล้วส่ง stationId ใหม่มาได้เลย
 * โดยไม่ต้องแก้โค้ดฝั่งนี้แม้แต่บรรทัดเดียว
 *
 * หมายเหตุ (แถวเก่าก่อนมี RoundId): แถวเก่าที่บันทึกไว้ก่อนหน้านี้จะมีคอลัมน์ RoundId
 * ว่างเปล่า ไฟล์นี้ไม่ลบ/ไม่แก้ไขแถวเก่าเหล่านั้นเลย (อ่าน/เขียนต่อแถวใหม่ได้ตามปกติ)
 */

const JOURNEY_SHEET_NAME = 'Journey'
const JOURNEY_HEADERS = [
  'Timestamp',
  'RoundId',
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
  } else {
    migrateJourneySheetAddRoundId_(sheet)
  }
  return assertSheetReady_(sheet, JOURNEY_SHEET_NAME, ss)
}

/** Migration ครั้งเดียว: ชีต "Journey" เก่าที่สร้างไว้ก่อนมีคอลัมน์ RoundId จะมีหัวตาราง
 * เริ่มด้วย Timestamp | UserId | ... (ไม่มี RoundId) — ฟังก์ชันนี้แค่ "แทรก" คอลัมน์
 * RoundId ว่างเปล่าไว้ตำแหน่งที่ 2 (หลัง Timestamp) แล้วใส่หัวตารางใหม่ให้ตรงสเปก
 * ไม่ลบ/ไม่แก้ไขค่าที่มีอยู่เดิมในแถวไหนเลยสักค่าเดียว (ค่าทุกอย่างแค่เลื่อนคอลัมน์
 * เพื่อให้ RoundId ว่างสำหรับแถวเก่า — Journey เก่าที่ไม่มี RoundId ยังคงอ่านค่าที่เหลือ
 * ได้ถูกต้องครบทุกคอลัมน์เหมือนเดิม) ทำแค่ครั้งเดียว เช็คจากหัวตารางคอลัมน์ที่ 2 ว่า
 * เป็น 'RoundId' อยู่แล้วหรือยัง ถ้าใช่แล้วไม่ทำอะไรซ้ำอีก (idempotent) */
function migrateJourneySheetAddRoundId_(sheet) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0]
  if (normalize_(header[1]) === 'RoundId') return // migrate ไปแล้ว ไม่ต้องทำซ้ำ
  if (normalize_(header[0]) !== 'Timestamp') return // ไม่ใช่รูปแบบหัวตารางเก่าที่รู้จัก ไม่แตะ

  sheet.insertColumnAfter(1)
  sheet.getRange(1, 1, 1, JOURNEY_HEADERS.length).setValues([JOURNEY_HEADERS])
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
    roundId: row[1],
    userId: row[2],
    displayName: row[3],
    stationId: row[4],
    stationName: row[5],
    point: Number(row[6]) || 0,
    status: row[7],
  }
}

/** เช็คว่าผู้เล่น (userId) เคยเข้าฐานนี้ (stationId) มาก่อนแล้วใน Round นี้ (roundId)
 * หรือยัง — key 3 ส่วน roundId + userId + stationId เทียบตรง ๆ (ตัดช่องว่างหัวท้าย
 * ด้วย normalize_ จาก Code.gs) เปลี่ยนจากเดิมที่เช็คแค่ userId + stationId เพราะสเปก
 * ใหม่ต้องแยกซ้ำตามรอบการเล่น: กลับมาเข้าฐานเดิมได้ถ้าเป็นคนละ Round แต่ถ้ายังอยู่
 * Round เดิม (เช่นกด "เล่นต่อ" แล้วสแกนฐานเดิมซ้ำ) ต้องไม่สร้าง Journey ซ้ำ
 *
 * roundId ว่าง/ไม่ส่งมา -> fallback เทียบแบบ userId + stationId เหมือนเดิม (เผื่อ
 * เรียกจากที่อื่นที่ยังไม่รู้จัก Round หรือกรณี resolve roundId ไม่ได้จริง ๆ) */
function hasVisitedStation_(sheet, userId, stationId, roundId) {
  const uid = normalize_(userId)
  const sid = normalize_(stationId)
  const rid = normalize_(roundId)
  if (!uid || !sid) return false

  const rows = getAllJourneyRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    const rowUid = normalize_(rows[i][2])
    const rowSid = normalize_(rows[i][4])
    if (rowUid !== uid || rowSid !== sid) continue
    if (!rid) return true // ไม่รู้ roundId -> เทียบแบบเดิม (userId + stationId)
    if (normalize_(rows[i][1]) === rid) return true
  }
  return false
}

/** บันทึกการเข้าฐานใหม่ 1 แถว (ไม่เช็คซ้ำในนี้ — ผู้เรียกต้องเช็ค
 * hasVisitedStation_ ก่อนเองเสมอ เพื่อให้ไฟล์นี้ทำหน้าที่แค่ "เขียนข้อมูล"
 * ล้วน ๆ ไม่ตัดสินใจเรื่อง business rule ว่าห้ามซ้ำ) status ค่าเริ่มต้นคือ
 * 'Completed' ตามสเปก (สแกน QR ผ่านฐานสำเร็จ) roundId มาจาก Round ปัจจุบันของ
 * ผู้ใช้ที่ผู้เรียก (CheckinService.gs) resolve มาให้แล้วเสมอ */
function appendJourneyEntry_(sheet, entry) {
  const row = [
    entry.timestamp,
    normalize_(entry.roundId),
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
    if (normalize_(rows[i][2]) === uid) result.push(rowToJourneyEntry_(rows[i]))
  }
  return result
}
