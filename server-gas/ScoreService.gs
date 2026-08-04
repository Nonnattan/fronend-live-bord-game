/**
 * ScoreService.gs
 * ---------------------------------------------------------------------------
 * Service แยกต่างหากสำหรับชีต "Score" — เก็บ "คะแนนสะสม" ของผู้เล่นแต่ละคน
 * (1 แถว = ผู้เล่น 1 คน ไม่มีแถวซ้ำ user เดียวกัน)
 *
 * ไฟล์นี้ไม่รู้จัก/ไม่แตะต้องชีต "Members" หรือ "Journey" เลย — เป็น service
 * เฉพาะของชีต Score เท่านั้น (แยก concern ตามชีต) ธุรกิจ logic ที่ต้องประสาน
 * งานกับ Journey (เช่น "เพิ่มคะแนนเมื่อผ่านฐานใหม่เท่านั้น") อยู่ที่
 * CheckinService.gs แทน ไฟล์นี้เปิดเผยแค่ primitive operations ของชีต Score
 *
 * โครงสร้างชีต "Score" (สร้างอัตโนมัติเมื่อเรียกใช้งานครั้งแรก ไม่ต้องสร้างมือ):
 * UserId | DisplayName | TotalPoint | TotalStation | UpdatedAt
 */

const SCORE_SHEET_NAME = 'Score'
const SCORE_HEADERS = [
  'UserId',
  'DisplayName',
  'TotalPoint',
  'TotalStation',
  'UpdatedAt',
]

/** คืนค่าชีต "Score" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีต "Members" หรือชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getScoreSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SCORE_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SCORE_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SCORE_HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

function getAllScoreRows_(sheet) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, SCORE_HEADERS.length).getValues()
}

function rowToScoreEntry_(row) {
  return {
    userId: row[0],
    displayName: row[1],
    totalPoint: Number(row[2]) || 0,
    totalStation: Number(row[3]) || 0,
    updatedAt: row[4],
  }
}

/** คืนค่า row number จริงบนชีต (1-indexed) ของผู้เล่น (userId) หรือ -1 ถ้ายังไม่มีแถว */
function findScoreRowIndexByUserId_(sheet, userId) {
  const uid = normalize_(userId)
  if (!uid) return -1
  const rows = getAllScoreRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === uid) return i + 2
  }
  return -1
}

/** ดึงคะแนนสะสมปัจจุบันของผู้เล่นคนเดียว (ไม่มีการเขียนข้อมูล) คืนค่า null
 * ถ้ายังไม่เคยมีแถวของผู้เล่นคนนี้ (แปลว่ายังไม่เคยผ่านฐานใดเลย) */
function getScoreByUserId_(sheet, userId) {
  const rowIndex = findScoreRowIndexByUserId_(sheet, userId)
  if (rowIndex === -1) return null
  const row = sheet.getRange(rowIndex, 1, 1, SCORE_HEADERS.length).getValues()[0]
  return rowToScoreEntry_(row)
}

/**
 * เพิ่มคะแนนสะสม + จำนวนฐานที่ผ่านให้ผู้เล่น 1 คน:
 *   - ยังไม่มีแถวของผู้เล่นคนนี้ -> สร้างแถวใหม่ (TotalPoint/TotalStation เริ่มต้น
 *     ตามค่าที่ส่งมาในครั้งนี้)
 *   - มีแถวอยู่แล้ว -> อัปเดตแถวเดิม (TotalPoint/TotalStation บวกเพิ่มจากค่าเดิม)
 * ไม่เช็คเรื่อง "ผ่านฐานซ้ำหรือยัง" ในนี้ — เป็นหน้าที่ของ CheckinService.gs ที่
 * ต้องเรียกฟังก์ชันนี้เฉพาะตอนยืนยันแล้วว่าเป็นการผ่านฐาน "ใหม่" เท่านั้น
 * (addPoint/addStation ควรเป็นค่าบวกของรอบนี้รอบเดียว ไม่ใช่ค่ารวมสะสม)
 */
function upsertScore_(sheet, userId, displayName, addPoint, addStation, now) {
  const uid = normalize_(userId)
  const rowIndex = findScoreRowIndexByUserId_(sheet, uid)

  if (rowIndex === -1) {
    const newRow = [
      uid,
      normalize_(displayName),
      Number(addPoint) || 0,
      Number(addStation) || 0,
      now,
    ]
    sheet.appendRow(newRow)
    return rowToScoreEntry_(newRow)
  }

  const current = sheet.getRange(rowIndex, 1, 1, SCORE_HEADERS.length).getValues()[0]
  const updatedRow = [
    uid,
    // ถ้ารอบนี้ส่ง displayName มาใหม่ ใช้ค่าล่าสุดแทน (เผื่อผู้เล่นเปลี่ยนชื่อ) ไม่ส่งมา = คงชื่อเดิมไว้
    displayName ? normalize_(displayName) : current[1],
    (Number(current[2]) || 0) + (Number(addPoint) || 0),
    (Number(current[3]) || 0) + (Number(addStation) || 0),
    now,
  ]
  sheet.getRange(rowIndex, 1, 1, SCORE_HEADERS.length).setValues([updatedRow])
  return rowToScoreEntry_(updatedRow)
}

/** ดึงตารางคะแนนทั้งหมด เรียงจากคะแนนมาก -> น้อย (ใช้ทำ Leaderboard ในอนาคต) */
function getLeaderboard_(sheet) {
  const rows = getAllScoreRows_(sheet)
  return rows
    .map(rowToScoreEntry_)
    .sort(function (a, b) { return b.totalPoint - a.totalPoint })
}
