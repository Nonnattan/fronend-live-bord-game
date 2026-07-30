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
 * Display Name | Profile Picture | Register Date | Last Login | Point | Total Visit
 *
 * Actions ที่รองรับ (ส่งมาใน body เป็น JSON, key "action"):
 *   - checkMember  : ค้นหาสมาชิกจาก firstName/lastName/phone (ไม่มีการเขียนข้อมูล)
 *   - register     : สร้างสมาชิกใหม่ (ถ้ามีอยู่แล้วจะไม่สร้างซ้ำ จะอัปเดต Last Login + Total Visit แทน)
 *   - login        : ถ้าพบสมาชิก -> อัปเดต Last Login + Total Visit (+1) (+ ข้อมูล LINE ถ้ามี)
 *                    ถ้าไม่พบ -> สร้างสมาชิกใหม่ให้อัตโนมัติ (login-or-register)
 *   - updateMember : แก้ไขข้อมูลสมาชิกด้วย memberId โดยตรง (แก้ point ได้ด้วย)
 *   - getMember    : ดึงข้อมูลสมาชิกล่าสุดด้วย memberId (ไม่มีการเขียนข้อมูล) — ใช้รีเฟรชหน้า Home
 *
 * หมายเหตุ CORS: Google Apps Script Web App ไม่รองรับ CORS preflight (OPTIONS)
 * ฝั่ง Frontend จึงต้องเรียกด้วย Content-Type: "text/plain;charset=utf-8"
 * (ไม่ใช่ "application/json") เพื่อให้ browser ส่งเป็น simple request ไม่ trigger
 * preflight — ฝั่งนี้ยังคง JSON.parse(e.postData.contents) ได้ตามปกติ ไม่สนใจ
 * ว่า header ประกาศเป็น content-type อะไร
 */

const SHEET_NAME = 'Members'
const HEADERS = [
  'Member ID',
  'First Name',
  'Last Name',
  'Phone Number',
  'LINE User ID',
  'Display Name',
  'Profile Picture',
  'Register Date',
  'Last Login',
  'Point',
  'Total Visit',
]

/* ------------------------------- Helpers -------------------------------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
  } else {
    migrateSheetIfNeeded_(sheet)
  }
  return sheet
}

/**
 * Migration: เผื่อชีตถูกสร้างจากเวอร์ชันเก่าที่ยังไม่มีคอลัมน์ Point / Total Visit
 * (มีแค่ 9 คอลัมน์ ถึง Last Login) — เติมหัวตารางที่ขาดและค่าเริ่มต้น (0, 1)
 * ให้ทุกแถวข้อมูลเดิมโดยอัตโนมัติ ไม่ต้องแก้มือ
 */
function migrateSheetIfNeeded_(sheet) {
  const currentCols = sheet.getLastColumn()
  if (currentCols >= HEADERS.length) return

  const missingHeaders = HEADERS.slice(currentCols)
  sheet.getRange(1, currentCols + 1, 1, missingHeaders.length).setValues([missingHeaders])

  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return

  // เติม Point = 0, Total Visit = 1 ให้ทุกแถวข้อมูลเดิมที่ยังไม่มีค่า
  const numRows = lastRow - 1
  const defaults = []
  for (let i = 0; i < numRows; i++) defaults.push([0, 1])
  sheet.getRange(2, HEADERS.length - 1, numRows, 2).setValues(defaults)
}

function nowIso_() {
  return new Date().toISOString()
}

function normalize_(value) {
  return (value === undefined || value === null) ? '' : value.toString().trim()
}

/** สร้าง Member ID อัตโนมัติ ไม่ซ้ำกัน เช่น M-LXQK3F-A1B */
function generateMemberId_() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return 'M-' + ts + '-' + rand
}

function getAllDataRows_(sheet) {
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  return sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues()
}

function rowToMember_(row) {
  return {
    memberId: row[0],
    firstName: row[1],
    lastName: row[2],
    phone: row[3],
    lineUserId: row[4],
    displayName: row[5],
    pictureUrl: row[6],
    registerDate: row[7],
    lastLogin: row[8],
    point: Number(row[9]) || 0,
    totalVisit: Number(row[10]) || 0,
  }
}

/** คืนค่า row number จริงบนชีต (1-indexed, รวมแถวหัวตาราง) หรือ -1 ถ้าไม่พบ */
function findRowIndexByIdentity_(sheet, firstName, lastName, phone) {
  const rows = getAllDataRows_(sheet)
  const fn = normalize_(firstName).toLowerCase()
  const ln = normalize_(lastName).toLowerCase()
  const ph = normalize_(phone)

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (
      normalize_(row[1]).toLowerCase() === fn &&
      normalize_(row[2]).toLowerCase() === ln &&
      normalize_(row[3]) === ph
    ) {
      return i + 2
    }
  }
  return -1
}

function findRowIndexByMemberId_(sheet, memberId) {
  const rows = getAllDataRows_(sheet)
  const id = normalize_(memberId)
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === id) return i + 2
  }
  return -1
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

function errorResponse_(message) {
  return jsonOutput_({ success: false, error: message })
}

function requireIdentityFields_(payload) {
  if (!payload || !payload.firstName || !payload.lastName || !payload.phone) {
    return 'firstName, lastName และ phone จำเป็นต้องส่งมาทั้งหมด'
  }
  return null
}

/** สร้างแถวใหม่และคืนค่า member object กลับไป (Point เริ่มที่ 0, Total Visit เริ่มที่ 1) */
function createMemberRow_(sheet, payload, now) {
  const memberId = generateMemberId_()
  const newRow = [
    memberId,
    normalize_(payload.firstName),
    normalize_(payload.lastName),
    normalize_(payload.phone),
    normalize_(payload.lineUserId),
    normalize_(payload.displayName),
    normalize_(payload.pictureUrl),
    now,
    now,
    0,
    1,
  ]
  sheet.appendRow(newRow)
  return rowToMember_(newRow)
}

/**
 * อัปเดตแถวที่มีอยู่แล้ว: อัปเดต Last Login เสมอ + LINE fields ถ้ามีค่าส่งมา
 * + เพิ่ม Total Visit ทีละ 1 ทุกครั้งที่ login/register สำเร็จ (bumpVisit = false
 *   เพื่อใช้กับ updateMember ที่ไม่ควรนับเป็นการเข้าใช้บริการใหม่)
 */
function updateMemberRow_(sheet, rowIndex, payload, now, bumpVisit) {
  const current = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0]

  const lineUserId = payload.lineUserId ? normalize_(payload.lineUserId) : current[4]
  const displayName = payload.displayName ? normalize_(payload.displayName) : current[5]
  const pictureUrl = payload.pictureUrl ? normalize_(payload.pictureUrl) : current[6]
  const totalVisit = bumpVisit ? (Number(current[10]) || 0) + 1 : (Number(current[10]) || 0)

  // E:G = LINE User ID, Display Name, Profile Picture
  sheet.getRange(rowIndex, 5, 1, 3).setValues([[lineUserId, displayName, pictureUrl]])
  // I = Last Login, K = Total Visit
  sheet.getRange(rowIndex, 9).setValue(now)
  sheet.getRange(rowIndex, 11).setValue(totalVisit)

  const updated = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0]
  return rowToMember_(updated)
}

/* --------------------------- Action handlers ----------------------------- */

function actionCheckMember_(payload) {
  const fieldError = requireIdentityFields_(payload)
  if (fieldError) return { success: false, error: fieldError }

  const sheet = getSheet_()
  const rowIndex = findRowIndexByIdentity_(sheet, payload.firstName, payload.lastName, payload.phone)

  if (rowIndex === -1) {
    return { success: true, found: false }
  }
  const row = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0]
  return { success: true, found: true, member: rowToMember_(row) }
}

function actionRegister_(payload) {
  const fieldError = requireIdentityFields_(payload)
  if (fieldError) return { success: false, error: fieldError }

  const sheet = getSheet_()
  const now = nowIso_()
  const rowIndex = findRowIndexByIdentity_(sheet, payload.firstName, payload.lastName, payload.phone)

  if (rowIndex !== -1) {
    // มีอยู่แล้ว -> ไม่สร้างซ้ำ ทำเหมือน login (อัปเดต Last Login + Total Visit แทน)
    const member = updateMemberRow_(sheet, rowIndex, payload, now, true)
    return { success: true, isNewMember: false, member: member }
  }

  const member = createMemberRow_(sheet, payload, now)
  return { success: true, isNewMember: true, member: member }
}

function actionLogin_(payload) {
  const fieldError = requireIdentityFields_(payload)
  if (fieldError) return { success: false, error: fieldError }

  const sheet = getSheet_()
  const now = nowIso_()
  const rowIndex = findRowIndexByIdentity_(sheet, payload.firstName, payload.lastName, payload.phone)

  if (rowIndex === -1) {
    // ไม่พบสมาชิก -> สร้างใหม่ให้อัตโนมัติ (login-or-register ตาม flow ข้อ 3-5)
    const member = createMemberRow_(sheet, payload, now)
    return { success: true, isNewMember: true, member: member }
  }

  const member = updateMemberRow_(sheet, rowIndex, payload, now, true)
  return { success: true, isNewMember: false, member: member }
}

function actionGetMember_(payload) {
  if (!payload || !payload.memberId) {
    return { success: false, error: 'memberId จำเป็นต้องส่งมา' }
  }
  const sheet = getSheet_()
  const rowIndex = findRowIndexByMemberId_(sheet, payload.memberId)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบสมาชิกตาม memberId ที่ระบุ' }
  }
  const row = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0]
  return { success: true, member: rowToMember_(row) }
}

function actionUpdateMember_(payload) {
  if (!payload || !payload.memberId) {
    return { success: false, error: 'memberId จำเป็นต้องส่งมา' }
  }

  const sheet = getSheet_()
  const rowIndex = findRowIndexByMemberId_(sheet, payload.memberId)
  if (rowIndex === -1) {
    return { success: false, error: 'ไม่พบสมาชิกตาม memberId ที่ระบุ' }
  }

  const current = sheet.getRange(rowIndex, 1, 1, HEADERS.length).getValues()[0]
  const merged = [
    current[0],
    payload.firstName !== undefined ? normalize_(payload.firstName) : current[1],
    payload.lastName !== undefined ? normalize_(payload.lastName) : current[2],
    payload.phone !== undefined ? normalize_(payload.phone) : current[3],
    payload.lineUserId !== undefined ? normalize_(payload.lineUserId) : current[4],
    payload.displayName !== undefined ? normalize_(payload.displayName) : current[5],
    payload.pictureUrl !== undefined ? normalize_(payload.pictureUrl) : current[6],
    current[7],
    nowIso_(),
    payload.point !== undefined ? Number(payload.point) || 0 : current[9],
    payload.totalVisit !== undefined ? Number(payload.totalVisit) || 0 : current[10],
  ]
  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([merged])
  return { success: true, member: rowToMember_(merged) }
}

/* ------------------------------ Entry points ------------------------------ */

function handleRequest_(payload) {
  const action = payload && payload.action

  try {
    switch (action) {
      case 'checkMember':
        return jsonOutput_(actionCheckMember_(payload))
      case 'register':
        return jsonOutput_(actionRegister_(payload))
      case 'login':
        return jsonOutput_(actionLogin_(payload))
      case 'updateMember':
        return jsonOutput_(actionUpdateMember_(payload))
      case 'getMember':
        return jsonOutput_(actionGetMember_(payload))
      default:
        return errorResponse_('action ไม่ถูกต้องหรือไม่ได้ระบุ ต้องเป็นหนึ่งใน: checkMember, register, login, updateMember, getMember')
    }
  } catch (err) {
    return errorResponse_(err && err.message ? err.message : String(err))
  }
}

function doPost(e) {
  let payload = {}
  try {
    payload = JSON.parse(e.postData.contents)
  } catch (err) {
    return errorResponse_('Body ที่ส่งมาไม่ใช่ JSON ที่ถูกต้อง')
  }
  return handleRequest_(payload)
}

/** รองรับ GET ด้วย เผื่อทดสอบผ่าน URL โดยตรง เช่น
 * ?action=checkMember&firstName=สมชาย&lastName=ใจดี&phone=0812345678
 */
function doGet(e) {
  const payload = Object.assign({}, e.parameter)
  return handleRequest_(payload)
}
