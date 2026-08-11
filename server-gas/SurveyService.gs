/**
 * SurveyService.gs
 * ---------------------------------------------------------------------------
 * Service แยกต่างหากสำหรับชีต "Survey" — เก็บ "แบบประเมิน" หลังจบเกม (กด "จบเกม"
 * ที่ Popup ฐานนม/ฐานสุดท้าย บนหน้า /scan) ตอนนี้มี 1 ข้อก่อนตามสเปก:
 *   "ท่านชอบด่านไหนมากที่สุด" ให้คะแนน 1-5 (5=มากที่สุด, 1=น้อยที่สุด)
 * ออกแบบให้เพิ่มคำถามข้อถัดไปในอนาคตได้ง่าย (เพิ่มคอลัมน์ใหม่ + field ใน payload
 * โดยไม่กระทบคำถามข้อเดิม) ไฟล์นี้ไม่รู้จัก/ไม่แตะต้องชีตอื่นเลย (Members/Round/
 * Journey/Score) เป็น service เฉพาะของชีต Survey เท่านั้น เหมือน RoundService.gs
 *
 * โครงสร้างชีต "Survey" (สร้างอัตโนมัติเมื่อเรียกใช้งานครั้งแรก ไม่ต้องสร้างมือ):
 * SurveyId | RoundId | UserId | FirstName | FavoriteStationRating | SubmittedAt
 *
 * FavoriteStationRating: ตัวเลข 1-5 เท่านั้น (5=มากที่สุด, 4=มาก, 3=ปานกลาง,
 * 2=น้อย, 1=น้อยที่สุด) — validate ที่นี่อีกชั้นแม้ frontend จะบังคับเลือกจาก
 * ปุ่ม 1-5 อยู่แล้วก็ตาม (กันกรณีเรียก API ตรง ๆ ข้ามหน้าฟอร์ม)
 *
 * กันข้อมูลซ้ำ (Duplicate) ด้วย RoundId — 1 รอบการเล่นตอบแบบประเมินได้แค่ 1 ครั้ง
 * (roundId เดิมส่งมาซ้ำ เช่น กดยืนยันซ้ำ/เน็ตหลุดแล้ว retry -> "อัปเดตแถวเดิม"
 * แทนการสร้างแถวใหม่ซ้ำ ไม่ error เหมือนกันข้อมูลซ้ำของ RoundService.gs)
 */

const SURVEY_SHEET_NAME = 'Survey'
const SURVEY_HEADERS = [
  'SurveyId',
  'RoundId',
  'UserId',
  'FirstName',
  'FavoriteStationRating',
  'SubmittedAt',
]

/** คืนค่าชีต "Survey" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getSurveySheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(SURVEY_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SURVEY_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SURVEY_HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

function getAllSurveyRows_(sheet) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, SURVEY_HEADERS.length).getValues()
}

/** คืนค่า row number จริงบนชีต (1-indexed) ที่ RoundId ตรงกัน หรือ -1 ถ้าไม่พบ
 * (ใช้กันคำตอบซ้ำต่อ 1 รอบการเล่น — RoundId เดิมมาอีกครั้ง -> อัปเดตแทนเพิ่มแถวใหม่) */
function findSurveyRowIndexByRoundId_(sheet, roundId) {
  const rid = normalize_(roundId)
  if (!rid) return -1
  const rows = getAllSurveyRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][1]) === rid) return i + 2
  }
  return -1
}

function rowToSurveyEntry_(row) {
  return {
    surveyId: row[0],
    roundId: row[1],
    userId: row[2],
    firstName: row[3],
    favoriteStationRating: Number(row[4]) || 0,
    submittedAt: row[5],
  }
}

/**
 * action 'submitSurvey' — บันทึกคำตอบแบบประเมินของ 1 รอบการเล่น
 * Payload: { roundId, userId, firstName, favoriteStationRating }
 *
 * favoriteStationRating ต้องเป็นจำนวนเต็ม 1-5 เท่านั้น (5=มากที่สุด ... 1=น้อยที่สุด)
 * roundId ซ้ำกับแถวเดิม (เคยตอบไปแล้ว/กดยืนยันซ้ำ) -> "อัปเดตคำตอบเดิม" ด้วยค่าล่าสุด
 * ไม่สร้างแถวซ้ำ (ต่างจาก RoundService.gs ที่ roundId ซ้ำ = ห้ามเขียนทับ เพราะที่นี่
 * ผู้เล่นอาจแก้คำตอบก่อนออกจากหน้าจริง ๆ ได้ ไม่ถือเป็นข้อผิดพลาด)
 */
function actionSubmitSurvey_(payload) {
  if (!payload || !normalize_(payload.roundId) || !normalize_(payload.userId)) {
    return { success: false, error: 'roundId และ userId จำเป็นต้องส่งมา' }
  }

  const rating = Number(payload.favoriteStationRating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'favoriteStationRating ต้องเป็นจำนวนเต็ม 1-5 เท่านั้น' }
  }

  const sheet = getSurveySheet_()
  const existingRowIndex = findSurveyRowIndexByRoundId_(sheet, payload.roundId)
  const now = bangkokNow_()

  if (existingRowIndex !== -1) {
    const current = sheet.getRange(existingRowIndex, 1, 1, SURVEY_HEADERS.length).getValues()[0]
    const updated = [
      current[0],
      current[1],
      normalize_(payload.userId),
      normalize_(payload.firstName) || current[3],
      rating,
      now,
    ]
    sheet.getRange(existingRowIndex, 1, 1, SURVEY_HEADERS.length).setValues([updated])
    return { success: true, alreadySubmitted: true, survey: rowToSurveyEntry_(updated) }
  }

  const row = [
    Utilities.getUuid(),
    normalize_(payload.roundId),
    normalize_(payload.userId),
    normalize_(payload.firstName),
    rating,
    now,
  ]
  sheet.appendRow(row)
  return { success: true, alreadySubmitted: false, survey: rowToSurveyEntry_(row) }
}
