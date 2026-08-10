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
 *
 * RoundId ของ Journey: ไฟล์นี้ "reuse" ฟังก์ชันที่มีอยู่แล้วใน RoundService.gs
 * (actionGetRound_ / actionRoundStart_) ตรง ๆ โดยไม่แก้ไข Round logic เดิมเลย
 * สักบรรทัด — แค่เรียกใช้เพื่อ resolve ว่า "Round ปัจจุบันของผู้ใช้" คือ Round ไหน
 * (ดู resolveCurrentRoundId_ ด้านล่าง) แล้วส่ง roundId นั้นให้ JourneyService.gs
 * ใช้เป็นส่วนหนึ่งของ key กันข้อมูลซ้ำ (roundId + userId + stationId)
 */

/** หา "Round ปัจจุบัน" ของผู้เล่น (userId) คนนี้ เพื่อใช้เป็น RoundId ของ Journey:
 *   - มี Round ล่าสุดอยู่แล้วและยังไม่ End (Status: 'Started') -> ใช้ RoundId เดิม
 *     (กรณีกด "เล่นต่อ" แล้วกลับมาสแกนฐานเดิมซ้ำ ยังถือว่าอยู่ Round เดิมเสมอ)
 *   - ไม่มี Round เลย หรือ Round ล่าสุด End ไปแล้ว -> เริ่ม Round ใหม่ให้อัตโนมัติ
 *     ผ่าน actionRoundStart_ ที่มีอยู่แล้ว (ไม่ได้เพิ่ม logic ใหม่ แค่เรียกใช้ของเดิม)
 * ฟังก์ชันนี้ไม่แตะ/ไม่แก้ RoundService.gs แม้แต่บรรทัดเดียว เป็นแค่ตัวประสานงาน
 * (coordinator) เหมือนที่ actionCheckin_ ประสานงาน Journey กับ Score อยู่แล้ว */
function resolveCurrentRoundId_(userId, displayName) {
  const existing = actionGetRound_({ userId: userId })
  if (existing.success && existing.round && normalize_(existing.round.status) === 'Started') {
    return existing.round.roundId
  }

  const newRoundId = Utilities.getUuid()
  actionRoundStart_({ roundId: newRoundId, userId: userId, displayName: displayName })
  return newRoundId
}

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
 *   1) หา Round ปัจจุบันของ userId นี้ (resolveCurrentRoundId_ — reuse RoundService.gs)
 *   2) เช็คในชีต Journey ว่า Round + userId คู่นี้เคยเข้า stationId นี้มาก่อนหรือยัง
 *   3) เคยแล้ว (ใน Round เดียวกัน) -> "ห้ามบันทึกซ้ำ" คืนค่า alreadyVisited: true ทันที
 *      ไม่แตะ Journey/Score เลย (สแกนฐานเดิมซ้ำในรอบเดิม เช่นกด "เล่นต่อ" แล้วกลับมา
 *      เข้าฐานเดิม จะเข้า branch นี้เสมอ ไม่สร้างแถวใหม่)
 *   4) ยังไม่เคย -> บันทึกแถวใหม่ลง Journey (Status: Completed, พร้อม RoundId) แล้ว
 *      อัปเดต Score (สร้างแถวใหม่ถ้ายังไม่มีข้อมูลผู้เล่น หรือบวกเพิ่มจากแถวเดิมถ้ามีแล้ว)
 */
function actionCheckin_(payload) {
  const fieldError = requireCheckinFields_(payload)
  if (fieldError) return { success: false, error: fieldError }

  const journeySheet = getJourneySheet_()
  const userId = normalize_(payload.userId)
  const stationId = normalize_(payload.stationId)
  const roundId = resolveCurrentRoundId_(userId, payload.displayName)

  if (hasVisitedStation_(journeySheet, userId, stationId, roundId)) {
    return { success: true, alreadyVisited: true }
  }

  const now = bangkokNow_()
  const point = Number(payload.point) || 0

  const journeyEntry = appendJourneyEntry_(journeySheet, {
    timestamp: now,
    roundId: roundId,
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
