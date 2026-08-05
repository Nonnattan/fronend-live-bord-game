/**
 * SideQuestsService.gs
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Service แยกต่างหากสำหรับชีต "SideQuests" ใช้จัดการ "คะแนนพิเศษ"
 * ที่ไม่ผูกกับฐานใดฐานหนึ่ง (เช่น กิจกรรมเสริม/ภารกิจพิเศษหน้างาน)
 *
 * ไฟล์นี้ไม่รู้จัก/ไม่แตะต้องชีต "Members", "Journey", "Score", "Stations"
 * เลย — เป็น service เฉพาะของชีต SideQuests เท่านั้น (แยก concern ตามชีต
 * เหมือนไฟล์ StationsService.gs/JourneyService.gs เดิม) ไม่มีแนวคิดเรื่อง
 * "ลำดับ" เหมือน Stations โดยเจตนา
 *
 * โครงสร้างชีต "SideQuests" (สร้างอัตโนมัติเมื่อเรียกใช้งานครั้งแรก ไม่ต้องสร้างมือ):
 * Id | Name | Points | Description | Active | UpdatedAt
 */

const SIDE_QUESTS_SHEET_NAME = 'SideQuests'
const SIDE_QUESTS_HEADERS = [
  'Id',
  'Name',
  'Points',
  'Description',
  'Active',
  'UpdatedAt',
]

/** คืนค่าชีต "SideQuests" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getSideQuestsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SIDE_QUESTS_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SIDE_QUESTS_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SIDE_QUESTS_HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

function getAllSideQuestRows_(sheet) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, SIDE_QUESTS_HEADERS.length).getValues()
}

function rowToSideQuest_(row) {
  return {
    id: row[0],
    name: row[1],
    points: Number(row[2]) || 0,
    description: row[3],
    active: row[4] === true || String(row[4]).toUpperCase() === 'TRUE',
    updatedAt: row[5],
  }
}

/** สร้างรหัส Side Quest ใหม่ ไม่ซ้ำกัน เช่น SQ-LXQK3F-A1B */
function generateSideQuestId_() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return 'SQ-' + ts + '-' + rand
}

/** คืนค่า row number จริงบนชีต (1-indexed) ของ side quest (id) หรือ -1 ถ้าไม่พบ */
function findSideQuestRowIndexById_(sheet, id) {
  const target = normalize_(id)
  if (!target) return -1
  const rows = getAllSideQuestRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === target) return i + 2
  }
  return -1
}

/** ดึงรายการ Side Quest ทั้งหมด — ใช้ทั้งฝั่ง Admin (แสดงตาราง) และฝั่งเกม */
function listSideQuests_(sheet) {
  const rows = getAllSideQuestRows_(sheet)
  return rows.map(rowToSideQuest_)
}

/** สร้าง Side Quest ใหม่ 1 แถว — id/updatedAt กำหนดโดยฝั่งนี้เสมอ */
function createSideQuest_(sheet, input, now) {
  const id = generateSideQuestId_()
  const newRow = [
    id,
    normalize_(input.name),
    Number(input.points) || 0,
    normalize_(input.description),
    input.active !== false,
    now,
  ]
  sheet.appendRow(newRow)
  return rowToSideQuest_(newRow)
}

/** แก้ไข Side Quest ที่มีอยู่แล้วด้วย id — อัปเดตเฉพาะฟิลด์ที่ส่งมา (undefined = คงค่าเดิมไว้) */
function updateSideQuest_(sheet, rowIndex, input, now) {
  const current = sheet.getRange(rowIndex, 1, 1, SIDE_QUESTS_HEADERS.length).getValues()[0]
  const updatedRow = [
    current[0],
    input.name !== undefined ? normalize_(input.name) : current[1],
    input.points !== undefined ? Number(input.points) || 0 : current[2],
    input.description !== undefined ? normalize_(input.description) : current[3],
    input.active !== undefined ? !!input.active : current[4],
    now,
  ]
  sheet.getRange(rowIndex, 1, 1, SIDE_QUESTS_HEADERS.length).setValues([updatedRow])
  return rowToSideQuest_(updatedRow)
}

/** ลบ Side Quest 1 แถวด้วย id */
function deleteSideQuestRow_(sheet, rowIndex) {
  sheet.deleteRow(rowIndex)
}

/* ------------------------------ Action handlers (เรียกจาก router ใน Code.gs) ------------------------------ */

/** action 'listSideQuests' — ดึง Side Quest ทั้งหมด (ไม่เขียนข้อมูล) */
function actionListSideQuests_() {
  const sheet = getSideQuestsSheet_()
  return { success: true, sideQuests: listSideQuests_(sheet) }
}

/** action 'createSideQuest' — สร้าง Side Quest ใหม่ (ใช้โดยหน้า Admin > Side Quests) */
function actionCreateSideQuest_(payload) {
  if (!payload || !normalize_(payload.name)) {
    return { success: false, error: 'name จำเป็นต้องส่งมา' }
  }
  const sheet = getSideQuestsSheet_()
  const sideQuest = createSideQuest_(sheet, payload, bangkokNow_())
  return { success: true, sideQuest: sideQuest }
}

/** action 'updateSideQuest' — แก้ไข Side Quest ด้วย id (รวมถึงสลับ active เปิด/ปิด) */
function actionUpdateSideQuest_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: 'id จำเป็นต้องส่งมา' }
  }
  const sheet = getSideQuestsSheet_()
  const rowIndex = findSideQuestRowIndexById_(sheet, payload.id)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบ Side Quest ตาม id ที่ระบุ' }
  }
  const sideQuest = updateSideQuest_(sheet, rowIndex, payload, bangkokNow_())
  return { success: true, sideQuest: sideQuest }
}

/** action 'deleteSideQuest' — ลบ Side Quest ด้วย id */
function actionDeleteSideQuest_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: 'id จำเป็นต้องส่งมา' }
  }
  const sheet = getSideQuestsSheet_()
  const rowIndex = findSideQuestRowIndexById_(sheet, payload.id)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบ Side Quest ตาม id ที่ระบุ' }
  }
  deleteSideQuestRow_(sheet, rowIndex)
  return { success: true }
}
