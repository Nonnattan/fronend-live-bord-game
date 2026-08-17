/**
 * PhotoQuestService.gs
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Service แยกต่างหากสำหรับระบบ "Photo Detection Quest" ใช้ 2 ชีต:
 *
 * 1) "PhotoQuests" — รายการเควสถ่ายรูปทั้งหมด (คล้าย SideQuests แต่มี rule
 *    ของ Detection Engine ผูกมาด้วย) โครงสร้าง:
 *    Id | Name | Description | Points | Active | DetectionType | Target |
 *    Confidence | Provider | ExampleImageUrl | UpdatedAt
 *
 * 2) "PhotoQuestCompletions" — ประวัติว่าสมาชิกคนไหนทำเควสไหนสำเร็จแล้วบ้าง
 *    (กันบันทึกซ้ำด้วย MemberId+QuestId เหมือนแนวทาง Journey/Checkin เดิม)
 *    โครงสร้าง: MemberId | QuestId | Points | Confidence | ClientId | CompletedAt
 *
 * ไฟล์นี้ไม่แตะต้องชีต "Members", "Journey", "Score", "Stations", "SideQuests"
 * เลย — แยก concern ตามชีตเหมือนไฟล์ Service อื่น ๆ ในโปรเจกต์นี้ทุกประการ
 * ห้ามใช้ SpreadsheetApp.getActiveSpreadsheet() — ต้องใช้ openById(SPREADSHEET_ID)
 * เหมือนที่แก้ไว้แล้วในทุก Service อื่นของโปรเจกต์นี้ (ดู Code.gs::getSheet_())
 */

const PHOTO_QUESTS_SHEET_NAME = 'PhotoQuests'
const PHOTO_QUESTS_HEADERS = [
  'Id',
  'Name',
  'Description',
  'Points',
  'Active',
  'DetectionType',
  'Target',
  'Confidence',
  'Provider',
  'ExampleImageUrl',
  'UpdatedAt',
]

const PHOTO_QUEST_COMPLETIONS_SHEET_NAME = 'PhotoQuestCompletions'
const PHOTO_QUEST_COMPLETIONS_HEADERS = [
  'MemberId',
  'QuestId',
  'Points',
  'Confidence',
  'ClientId',
  'CompletedAt',
]

/** คืนค่าชีต "PhotoQuests" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี */
function getPhotoQuestsSheet_() {
  requireSheetName_(PHOTO_QUESTS_SHEET_NAME, 'PHOTO_QUESTS_SHEET_NAME')
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(PHOTO_QUESTS_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(PHOTO_QUESTS_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PHOTO_QUESTS_HEADERS)
    sheet.setFrozenRows(1)
  }
  return assertSheetReady_(sheet, PHOTO_QUESTS_SHEET_NAME, ss)
}

/** คืนค่าชีต "PhotoQuestCompletions" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี */
function getPhotoQuestCompletionsSheet_() {
  requireSheetName_(PHOTO_QUEST_COMPLETIONS_SHEET_NAME, 'PHOTO_QUEST_COMPLETIONS_SHEET_NAME')
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(PHOTO_QUEST_COMPLETIONS_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(PHOTO_QUEST_COMPLETIONS_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PHOTO_QUEST_COMPLETIONS_HEADERS)
    sheet.setFrozenRows(1)
  }
  return assertSheetReady_(sheet, PHOTO_QUEST_COMPLETIONS_SHEET_NAME, ss)
}

function getAllPhotoQuestRows_(sheet) {
  if (!sheet) {
    throw new Error('getAllPhotoQuestRows_ ถูกเรียกด้วย sheet เป็น null/undefined')
  }
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, PHOTO_QUESTS_HEADERS.length).getValues()
}

function getAllCompletionRows_(sheet) {
  if (!sheet) {
    throw new Error('getAllCompletionRows_ ถูกเรียกด้วย sheet เป็น null/undefined')
  }
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, PHOTO_QUEST_COMPLETIONS_HEADERS.length).getValues()
}

/** แปลง 1 แถวในชีต "PhotoQuests" ให้อยู่ในรูปที่ frontend ใช้ตรง ๆ ได้เลย —
 * รูปแบบตรงกับ types/photoQuest.ts::PhotoQuest ทุกประการ (rule เป็น object
 * ซ้อน ไม่ใช่ flat fields เหมือนในชีต — ประกอบร่างตรงนี้ที่เดียว) */
function rowToPhotoQuest_(row) {
  return {
    id: row[0],
    type: 'photo_detection',
    name: row[1],
    description: row[2],
    points: Number(row[3]) || 0,
    active: row[4] === true || String(row[4]).toUpperCase() === 'TRUE',
    rule: {
      detectionType: row[5],
      target: row[6],
      confidence: Number(row[7]) || 0,
      provider: row[8] ? row[8] : undefined,
    },
    exampleImageUrl: row[9] ? row[9] : undefined,
    updatedAt: row[10],
  }
}

function generatePhotoQuestId_() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return 'PQ-' + ts + '-' + rand
}

function findPhotoQuestRowIndexById_(sheet, id) {
  const target = normalize_(id)
  if (!target) return -1
  const rows = getAllPhotoQuestRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === target) return i + 2
  }
  return -1
}

/** true ถ้าสมาชิกคนนี้เคยทำเควสนี้สำเร็จไปแล้ว (กันบันทึกซ้ำ — เหมือนแนวทาง
 * alreadyVisited ของระบบ Station/Journey เดิม) */
function hasCompletedPhotoQuest_(completionsSheet, memberId, questId) {
  const rows = getAllCompletionRows_(completionsSheet)
  const targetMember = normalize_(memberId)
  const targetQuest = normalize_(questId)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === targetMember && normalize_(rows[i][1]) === targetQuest) {
      return true
    }
  }
  return false
}

/* ------------------------------ Action handlers (เรียกจาก router ใน Code.gs) ------------------------------ */

/** action 'listPhotoQuests' — ดึง Photo Quest ทั้งหมด (ไม่เขียนข้อมูล) เหมือน
 * listStations_/listSideQuests_ เดิม ส่งกลับทั้งเควส active/inactive ให้ฝั่ง
 * frontend กรองเอง (เหมือนแนวทาง Stations เดิม) */
function actionListPhotoQuests_() {
  const sheet = getPhotoQuestsSheet_()
  const rows = getAllPhotoQuestRows_(sheet)
  return { success: true, quests: rows.map(rowToPhotoQuest_) }
}

/** action 'completePhotoQuest' — บันทึกว่าสมาชิกคนนี้ทำเควสถ่ายรูปนี้สำเร็จแล้ว
 * รับ payload: { userId, questId, points, confidence, clientId } — Detection
 * ทำบนเครื่อง (frontend) เสร็จสมบูรณ์แล้วก่อนเรียก action นี้เสมอ ฝั่งนี้แค่
 * บันทึกผลลัพธ์ ไม่ตรวจภาพซ้ำ (ยังไม่มี Backend Vision ผูกไว้ตามสเปก Phase 1) */
function actionCompletePhotoQuest_(payload) {
  if (!payload || !normalize_(payload.userId) || !normalize_(payload.questId)) {
    return { success: false, error: 'userId และ questId จำเป็นต้องส่งมา' }
  }

  const completionsSheet = getPhotoQuestCompletionsSheet_()

  if (hasCompletedPhotoQuest_(completionsSheet, payload.userId, payload.questId)) {
    return { success: true, alreadyCompleted: true }
  }

  completionsSheet.appendRow([
    normalize_(payload.userId),
    normalize_(payload.questId),
    Number(payload.points) || 0,
    Number(payload.confidence) || 0,
    payload.clientId ? normalize_(payload.clientId) : '',
    bangkokNow_(),
  ])

  return { success: true, alreadyCompleted: false }
}

/** action 'createPhotoQuest' — สร้าง Photo Quest ใหม่ (สำหรับหน้า Admin ในอนาคต
 * ถ้าต้องการ — ยังไม่มี UI เรียกใช้จริงในเวอร์ชันนี้ เตรียมไว้ให้ครบตามแนวทาง
 * เดียวกับ Stations/SideQuests เพื่อให้ Admin จัดการเควสได้โดยไม่ต้องแก้โค้ด) */
function actionCreatePhotoQuest_(payload) {
  if (!payload || !normalize_(payload.name) || !normalize_(payload.detectionType)) {
    return { success: false, error: 'name และ detectionType จำเป็นต้องส่งมา' }
  }
  const sheet = getPhotoQuestsSheet_()
  const id = generatePhotoQuestId_()
  const now = bangkokNow_()
  const newRow = [
    id,
    normalize_(payload.name),
    normalize_(payload.description),
    Number(payload.points) || 0,
    payload.active !== false,
    normalize_(payload.detectionType),
    normalize_(payload.target),
    Number(payload.confidence) || 0,
    payload.provider ? normalize_(payload.provider) : '',
    payload.exampleImageUrl ? normalize_(payload.exampleImageUrl) : '',
    now,
  ]
  sheet.appendRow(newRow)
  return { success: true, quest: rowToPhotoQuest_(newRow) }
}

/** action 'updatePhotoQuest' — แก้ไข Photo Quest ด้วย id (รวมถึงสลับ active เปิด/ปิด) */
function actionUpdatePhotoQuest_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: 'id จำเป็นต้องส่งมา' }
  }
  const sheet = getPhotoQuestsSheet_()
  const rowIndex = findPhotoQuestRowIndexById_(sheet, payload.id)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบ Photo Quest ตาม id ที่ระบุ' }
  }
  const current = sheet.getRange(rowIndex, 1, 1, PHOTO_QUESTS_HEADERS.length).getValues()[0]
  const updatedRow = [
    current[0],
    payload.name !== undefined ? normalize_(payload.name) : current[1],
    payload.description !== undefined ? normalize_(payload.description) : current[2],
    payload.points !== undefined ? Number(payload.points) || 0 : current[3],
    payload.active !== undefined ? !!payload.active : current[4],
    payload.detectionType !== undefined ? normalize_(payload.detectionType) : current[5],
    payload.target !== undefined ? normalize_(payload.target) : current[6],
    payload.confidence !== undefined ? Number(payload.confidence) || 0 : current[7],
    payload.provider !== undefined ? normalize_(payload.provider) : current[8],
    payload.exampleImageUrl !== undefined ? normalize_(payload.exampleImageUrl) : current[9],
    bangkokNow_(),
  ]
  sheet.getRange(rowIndex, 1, 1, PHOTO_QUESTS_HEADERS.length).setValues([updatedRow])
  return { success: true, quest: rowToPhotoQuest_(updatedRow) }
}

/** action 'deletePhotoQuest' — ลบ Photo Quest ด้วย id */
function actionDeletePhotoQuest_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: 'id จำเป็นต้องส่งมา' }
  }
  const sheet = getPhotoQuestsSheet_()
  const rowIndex = findPhotoQuestRowIndexById_(sheet, payload.id)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบ Photo Quest ตาม id ที่ระบุ' }
  }
  sheet.deleteRow(rowIndex)
  return { success: true }
}
