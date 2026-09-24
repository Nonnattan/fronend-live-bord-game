/**
 * RoundService.gs
 * ---------------------------------------------------------------------------
 * Service แยกต่างหากสำหรับชีต "Round" — เก็บ "รอบการเล่น" ของผู้เล่นแต่ละคน
 * (1 แถว = 1 รอบการเล่น ตั้งแต่เริ่ม (Round Start) จนจบ (Round End))
 *
 * ไฟล์นี้ไม่รู้จัก/ไม่แตะต้องชีต "Members", "Journey", "Score" เลย — เป็น
 * service เฉพาะของชีต Round เท่านั้น (แยก concern เหมือน JourneyService.gs/
 * ScoreService.gs เดิม)
 *
 * โครงสร้างชีต "Round" (สร้างอัตโนมัติเมื่อเรียกใช้งานครั้งแรก ไม่ต้องสร้างมือ):
 * RoundId | UserId | FirstName | StartTime | EndTime | Status | RewardStatus
 *
 * FirstName: ชื่อจริงจากฟอร์มโปรไฟล์ (profile.firstName ฝั่ง frontend) — ใช้แทน
 * DisplayName (LINE profile) เดิม เพราะผู้ใช้ที่ไม่ได้ Login ผ่าน LINE (Guest/
 * กรอกฟอร์มเอง) ไม่มีค่า DisplayName เลย แต่ firstName เป็นฟิลด์บังคับกรอกของ
 * ทุกคนเสมอ (ดู types/profile.ts -> UserProfile.firstName)
 *
 * Status: 'Started' (เริ่มรอบแล้ว ยังไม่จบ) / 'Ended' (จบรอบแล้ว) — ห้ามเปลี่ยน
 * ความหมายเดิมนี้เด็ดขาด (RewardStatus ด้านล่างเป็นคนละแกนที่แยกต่างหากทั้งหมด)
 *
 * [ใหม่] RewardStatus: 'Pending' (จบเกมแล้ว แต่ยังไม่ได้รับรางวัล) / 'Claimed'
 * (เจ้าหน้าที่ยืนยันว่าผู้เล่นได้รับรางวัลแล้ว — ดู actionClaimReward_ ใน
 * RewardService.gs) / 'Confirmed' (ผู้เล่นกด OK ยืนยันแล้วที่หน้า
 * pages/reward-received.vue — ดู actionConfirmRound_ ด้านล่าง ปิดรอบสมบูรณ์)
 * ตั้งค่าเริ่มต้นเป็น 'Pending' ตอน actionRoundEnd_ จบรอบครั้งแรกเท่านั้น
 *
 * ข้อมูลเก่าที่ไม่มีคอลัมน์นี้เลย (แถวสั้นกว่า ROUND_HEADERS.length) จะอ่านได้
 * ค่าว่างเปล่าจาก getValues() เสมอ — rowToRoundEntry_() ด้านล่าง treat ค่าว่าง
 * เป็น 'Pending' โดยอัตโนมัติ ไม่ต้อง migrate ข้อมูลเก่าทั้งหมดแบบ destructive
 *
 * กันข้อมูลซ้ำ (Duplicate) ด้วย RoundId เป็น idempotency key — RoundId สร้าง
 * ฝั่ง client เพียงครั้งเดียวต่อ 1 รอบ (UUID) แล้วใช้ซ้ำตลอดทั้งรอบ (ทั้งตอน
 * Start และ End) เรียก roundStart_/roundEnd_ ซ้ำกี่ครั้งด้วย RoundId เดิมก็
 * ไม่มีการเขียนแถวใหม่/เขียนทับซ้ำอีก (ปลอดภัยเผื่อ retry ตอน sync จากเน็ตหลุด
 * กลางคัน หรือกดปุ่ม Sync มือซ้ำ)
 */

const ROUND_SHEET_NAME = 'Round'
const ROUND_HEADERS = ['RoundId', 'UserId', 'FirstName', 'StartTime', 'EndTime', 'Status', 'RewardStatus']

/** คืนค่าชีต "Round" — สร้างชีตใหม่ + ใส่หัวตารางให้อัตโนมัติถ้ายังไม่มี
 * (ไม่แตะต้องชีตอื่นใดในสเปรดชีตเดียวกันเลย) */
function getRoundSheet_() {
  // ⚠️ FIX: openById(SPREADSHEET_ID) แทน getActiveSpreadsheet() — เหมือนที่แก้ไว้ใน
  // Code.gs::getSheet_() (SPREADSHEET_ID เป็น global const ที่ประกาศใน Code.gs เดียวกัน
  // ในโปรเจกต์ Apps Script) getActiveSpreadsheet() คืน null เวลาเรียกผ่าน Web App
  // นอก container-bound context -> ทำให้ .getSheetByName() พังด้วย "Cannot read
  // properties of null" แบบเดียวกับที่เคยเจอตอน Members sheet
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(ROUND_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(ROUND_SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ROUND_HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

function getAllRoundRows_(sheet) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, ROUND_HEADERS.length).getValues()
}

function rowToRoundEntry_(row) {
  return {
    roundId: row[0],
    userId: row[1],
    firstName: row[2],
    startTime: row[3],
    endTime: row[4] || null,
    status: row[5],
    // [ใหม่] ข้อมูลเก่า/แถวที่ยังไม่เคยจบรอบเลย ไม่มีค่านี้ -> ถือเป็น 'Pending' เสมอ
    rewardStatus: row[6] || 'Pending',
  }
}

/** คืนค่า row number จริงบนชีต (1-indexed) ที่ RoundId ตรงกัน หรือ -1 ถ้าไม่พบ */
function findRoundRowIndexById_(sheet, roundId) {
  const rid = normalize_(roundId)
  if (!rid) return -1
  const rows = getAllRoundRows_(sheet)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === rid) return i + 2
  }
  return -1
}

/**
 * action 'roundStart' — บันทึก "Round Start" ของ 1 รอบการเล่น
 * Payload: { roundId, userId, firstName }
 *
 * RoundId ซ้ำกับแถวเดิม (เคย Sync สำเร็จมาแล้ว/กด Sync ซ้ำ) -> "ห้ามเขียนซ้ำ"
 * คืนค่า alreadyStarted: true พร้อมแถวเดิมทันที ไม่เขียนข้อมูลเพิ่ม
 */
function actionRoundStart_(payload) {
  if (!payload || !normalize_(payload.roundId) || !normalize_(payload.userId)) {
    return { success: false, error: 'roundId และ userId จำเป็นต้องส่งมา' }
  }

  const sheet = getRoundSheet_()
  const existingRow = findRoundRowIndexById_(sheet, payload.roundId)
  if (existingRow !== -1) {
    const row = sheet.getRange(existingRow, 1, 1, ROUND_HEADERS.length).getValues()[0]
    return { success: true, alreadyStarted: true, round: rowToRoundEntry_(row) }
  }

  const now = bangkokNow_()
  const row = [
    normalize_(payload.roundId),
    normalize_(payload.userId),
    normalize_(payload.firstName),
    now,
    '',
    'Started',
  ]
  sheet.appendRow(row)
  return { success: true, alreadyStarted: false, round: rowToRoundEntry_(row) }
}

/**
 * action 'roundEnd' — บันทึก "Round End" ของรอบเดิม (RoundId เดิม เท่านั้น —
 * ไม่มีการสร้างรอบใหม่ที่นี่เด็ดขาด)
 * Payload: { roundId, userId }
 *
 * ไม่พบ RoundId นี้เลย (ยังไม่เคย Sync 'roundStart' สำเร็จมาก่อน) -> error
 * (กันไม่ให้เผลอสร้างรอบใหม่แทน)
 * พบแล้วแต่มี EndTime อยู่แล้ว (เคยจบไปแล้ว/Sync ซ้ำ) -> "ห้ามเขียนซ้ำ" คืนค่า
 * alreadyEnded: true พร้อมแถวเดิมทันที
 */
function actionRoundEnd_(payload) {
  if (!payload || !normalize_(payload.roundId)) {
    return { success: false, error: 'roundId จำเป็นต้องส่งมา' }
  }

  const sheet = getRoundSheet_()
  const rowIndex = findRoundRowIndexById_(sheet, payload.roundId)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบ roundId นี้ — ต้อง Sync roundStart ให้สำเร็จก่อนเสมอ' }
  }

  const row = sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).getValues()[0]
  if (normalize_(row[4])) {
    return { success: true, alreadyEnded: true, round: rowToRoundEntry_(row) }
  }

  row[4] = bangkokNow_()
  row[5] = 'Ended'
  // [ใหม่] เริ่มสถานะรางวัลของรอบนี้เป็น 'Pending' ตอนจบรอบครั้งแรกเท่านั้น (ไม่มี
  // ทางเข้าเงื่อนไขนี้ซ้ำอีกจาก branch alreadyEnded ด้านบน จึงไม่มีวันเขียนทับ
  // RewardStatus ที่อาจเดินหน้าไปเป็น Claimed/Confirmed แล้วโดยไม่ตั้งใจ)
  row[6] = 'Pending'
  sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).setValues([row])
  return { success: true, alreadyEnded: false, round: rowToRoundEntry_(row) }
}

/**
 * action 'confirmRound' — ผู้เล่นกด "OK" ที่หน้า pages/reward-received.vue เพื่อ
 * ยืนยันว่าได้รับรางวัลจริงแล้ว ปิดรอบให้สมบูรณ์ (RewardStatus: Claimed -> Confirmed)
 * Payload: { roundId, userId }
 *
 * ใช้ RoundId เป็นตัวอ้างอิงหลักเสมอ (ห้ามค้นหาด้วย UserId อย่างเดียว เพราะ User
 * คนเดียวมีหลาย Round ได้) userId ที่ส่งมาต้องตรงกับเจ้าของ RoundId นี้ด้วย (กัน
 * ส่ง roundId ของคนอื่นมายืนยันมั่ว ๆ)
 *
 * Idempotent: เรียกซ้ำตอน RewardStatus เป็น 'Confirmed' อยู่แล้ว (เช่น กด OK ซ้ำ/
 * เน็ตหลุดแล้ว retry) -> ถือว่า success ทันที ไม่เขียนทับซ้ำ
 *
 * Validate ตามลำดับก่อนยอมเปลี่ยนสถานะจริง: ต้องพบ RoundId นี้ + Status ต้องเป็น
 * 'Ended' (ยังไม่จบรอบเลย ไม่ให้ยืนยันข้าม) + RewardStatus ต้องเป็น 'Claimed' มา
 * ก่อนแล้ว (เจ้าหน้าที่ยังไม่ได้ยืนยันมอบรางวัลเลย ไม่ให้ผู้เล่นยืนยันเองได้)
 * ไม่มีทางสร้าง Round ใหม่/ไม่มีทางเปลี่ยน Status กลับเป็น 'Started' จากที่นี่เลย
 */
function actionConfirmRound_(payload) {
  if (!payload || !normalize_(payload.roundId) || !normalize_(payload.userId)) {
    return { success: false, error: 'roundId และ userId จำเป็นต้องส่งมา' }
  }

  const sheet = getRoundSheet_()
  const rowIndex = findRoundRowIndexById_(sheet, payload.roundId)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบ roundId นี้' }
  }

  const row = sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).getValues()[0]
  const entry = rowToRoundEntry_(row)

  if (normalize_(entry.userId) !== normalize_(payload.userId)) {
    return { success: false, error: 'userId ไม่ตรงกับเจ้าของ roundId นี้' }
  }
  if (entry.rewardStatus === 'Confirmed') {
    return { success: true, alreadyConfirmed: true, round: entry }
  }
  if (entry.status !== 'Ended') {
    return { success: false, error: 'Round นี้ยังไม่จบ (Status ต้องเป็น Ended ก่อน)' }
  }
  if (entry.rewardStatus !== 'Claimed') {
    return {
      success: false,
      error: 'เจ้าหน้าที่ยังไม่ได้ยืนยันมอบรางวัล (RewardStatus ต้องเป็น Claimed ก่อน)',
    }
  }

  row[6] = 'Confirmed'
  sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).setValues([row])
  return { success: true, alreadyConfirmed: false, round: rowToRoundEntry_(row) }
}

/** action 'getRound' — ดึงรอบล่าสุดของผู้เล่น 1 คน (ไม่เขียนข้อมูล) เผื่อใช้
 * เช็คว่ามีรอบที่ยังไม่จบ (Status: 'Started') ค้างอยู่บน Google Sheet หรือไม่ */
function actionGetRound_(payload) {
  if (!payload || !normalize_(payload.userId)) {
    return { success: false, error: 'userId จำเป็นต้องส่งมา' }
  }
  const sheet = getRoundSheet_()
  const uid = normalize_(payload.userId)
  const rows = getAllRoundRows_(sheet)
  let latest = null
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][1]) === uid) latest = rowToRoundEntry_(rows[i])
  }
  return { success: true, round: latest }
}
