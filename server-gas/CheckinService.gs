/**
 * CheckinService.gs
 * ---------------------------------------------------------------------------
 * "Business logic" ของ flow เช็คอินฐาน (สแกน QR ที่ฐานสำเร็จ) — ไฟล์เดียวที่
 * รู้จักทั้งชีต "Journey" และ "Score" พร้อมกัน (ประสานงาน 2 service เข้าด้วยกัน)
 * ตัว JourneyService.gs / ScoreService.gs เองไม่รู้จักกันเลย เพื่อให้แต่ละไฟล์
 * แก้/ทดสอบแยกจากกันได้ และเผื่ออนาคตอยากเพิ่ม service อื่นมาประสานงานร่วมด้วย
 * (เช่น badge/achievement) ก็เพิ่มไฟล์แบบนี้ได้อีกโดยไม่ต้องแก้ 2 ไฟล์นั้นเลย
 *
 * ไม่แตะต้องชีต "Members" หรือ MemberService ใด ๆ ในไฟล์นี้ — userId ที่ส่งมา
 * ควรเป็น memberId เดิมจากระบบ Login (ดู types/auth.ts / useAuth.ts) แต่ไฟล์นี้
 * ไม่ผูก/ไม่ validate กับชีต Members โดยตรง (รับค่ามาใช้เป็น key เฉย ๆ) —
 * เพื่อไม่ให้ไปแตะระบบ Login เดิมตามที่กำหนดไว้
 *
 * รองรับการเพิ่มฐานในอนาคต: ไม่มี "รายชื่อฐานที่อนุญาต" ตายตัวฝั่ง backend เลย
 * ฐานใหม่ที่เพิ่มฝั่ง frontend (เช่น STATIONS ใน useStations.ts) ส่ง stationId/
 * stationName/point มาตรง ๆ ได้ทันที ไม่ต้องแก้โค้ดฝั่งนี้แม้แต่บรรทัดเดียว
 */

/** ตรวจฟิลด์ที่จำเป็นสำหรับ action 'checkin' — คืนค่า error message หรือ null ถ้าผ่าน */
function requireCheckinFields_(payload) {
  if (!payload || !normalize_(payload.userId) || !normalize_(payload.stationId)) {
    return 'userId และ stationId จำเป็นต้องส่งมา'
  }
  return null
}

/**
 * action 'checkin' — เรียกตอนสแกน QR ที่ฐานสำเร็จ
 * Payload: { userId, displayName, stationId, stationName, point }
 *   - point ไม่บังคับส่งมา (default 0 ถ้าไม่ส่ง) เป็นคะแนนของ "ฐานนี้ฐานเดียว"
 *
 * Flow:
 *   1) เช็คในชีต Journey ว่า userId คู่นี้เคยเข้า stationId นี้มาก่อนหรือยัง
 *   2) เคยแล้ว -> "ห้ามบันทึกซ้ำ" คืนค่า alreadyVisited: true ทันที ไม่แตะ Journey/Score เลย
 *   3) ยังไม่เคย -> บันทึกแถวใหม่ลง Journey (Status: Completed) แล้วอัปเดต Score
 *      (สร้างแถวใหม่ถ้ายังไม่มีข้อมูลผู้เล่น หรือบวกเพิ่มจากแถวเดิมถ้ามีแล้ว)
 */
function actionCheckin_(payload) {
  const fieldError = requireCheckinFields_(payload)
  if (fieldError) return { success: false, error: fieldError }

  const journeySheet = getJourneySheet_()
  const userId = normalize_(payload.userId)
  const stationId = normalize_(payload.stationId)

  if (hasVisitedStation_(journeySheet, userId, stationId)) {
    return { success: true, alreadyVisited: true }
  }

  const now = bangkokNow_()
  const point = Number(payload.point) || 0

  const journeyEntry = appendJourneyEntry_(journeySheet, {
    timestamp: now,
    userId: userId,
    displayName: payload.displayName,
    stationId: stationId,
    stationName: payload.stationName,
    point: point,
    status: 'Completed',
  })

  const scoreSheet = getScoreSheet_()
  const score = upsertScore_(scoreSheet, userId, payload.displayName, point, 1, now)

  return { success: true, alreadyVisited: false, journeyEntry: journeyEntry, score: score }
}

/** action 'getJourney' — ดึงประวัติการเข้าฐานทั้งหมดของผู้เล่นคนเดียว (ไม่เขียนข้อมูล) */
function actionGetJourney_(payload) {
  if (!payload || !normalize_(payload.userId)) {
    return { success: false, error: 'userId จำเป็นต้องส่งมา' }
  }
  const journeySheet = getJourneySheet_()
  const entries = getJourneyEntriesByUser_(journeySheet, payload.userId)
  return { success: true, journey: entries }
}

/** action 'getScore' — ดึงคะแนนสะสมปัจจุบันของผู้เล่นคนเดียว (ไม่เขียนข้อมูล)
 * ยังไม่เคยผ่านฐานใดเลย -> score: null (ให้ frontend ตีความเป็น 0/0 เอง) */
function actionGetScore_(payload) {
  if (!payload || !normalize_(payload.userId)) {
    return { success: false, error: 'userId จำเป็นต้องส่งมา' }
  }
  const scoreSheet = getScoreSheet_()
  const score = getScoreByUserId_(scoreSheet, payload.userId)
  return { success: true, score: score }
}

/** action 'getLeaderboard' — ดึงตารางคะแนนทั้งหมด เรียงคะแนนมาก -> น้อย (ไม่เขียนข้อมูล) */
function actionGetLeaderboard_(payload) {
  const scoreSheet = getScoreSheet_()
  return { success: true, leaderboard: getLeaderboard_(scoreSheet) }
}
