/**
 * server-gas/RewardService.gs
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ระบบ "แลกของรางวัลตามเงื่อนไขคะแนน" ตาม Flow ใหม่:
 *
 *   คะแนนรวม -> ตรวจสอบเงื่อนไขของรางวัล -> มีสิทธิ์รับรางวัล? -> ใช่ ->
 *   ระบบยืนยันรับรางวัล (เจ้าหน้าที่กด) -> แสดงสถานะ "รับรางวัลแล้ว [เวลา]"
 *
 * จัดการ 2 ชีต (สร้างอัตโนมัติพร้อมหัวตารางเมื่อเรียก action ครั้งแรก):
 *   - "Rewards"      : คลังของรางวัล (Admin กรอกเงื่อนไขคะแนน) 1 แถว = 1 ระดับ
 *   - "RewardClaims" : ประวัติการรับรางวัลจริง 1 แถว = ผู้เล่น 1 คน รับรางวัล
 *                      ของ 1 รอบ (กันรับซ้ำด้วย RoundId+UserId)
 *
 * *** เจตนาสำคัญ: การ "ยืนยันรับรางวัล" เป็นหน้าที่เจ้าหน้าที่เท่านั้น ***
 * (ตามที่ตกลงกันไว้) — action `claimReward` จึงถูกออกแบบให้เรียกจากหน้า
 * เจ้าหน้าที่ (pages/redeem.vue) เท่านั้น ไม่มีปุ่มนี้ในหน้าของผู้เล่นเอง
 * (pages/round-summary.vue เรียกแค่ `getRewardStatus` ซึ่งไม่เขียนข้อมูลใด ๆ
 * เพื่อโชว์ "คุณมีสิทธิ์รับรางวัลอะไร/รับไปหรือยัง" ให้ผู้เล่นเห็นเฉย ๆ)
 *
 * *** ไม่แตะไฟล์ service เดิมเลยสักไฟล์ *** — เชื่อมเข้าระบบเดิมแค่จุดเดียว:
 * เพิ่ม case ใหม่ใน router ของ Code.gs (เหมือนที่ทุก service ทำ)
 *
 * *** จำกัดเฉพาะ Online เท่านั้น *** — การแลกรางวัลต้องมีเจ้าหน้าที่ + เน็ต
 * เสมอ (เจ้าหน้าที่ต้องเปิดหน้า /redeem ซึ่งต้องยิง API) ไม่มี Offline Fallback
 * เหมือนระบบอื่น (ตรงตามธรรมชาติของ Flow นี้ — ผู้เล่น Offline Mode จะไม่เห็น
 * ส่วนรางวัลที่หน้าสรุปผลเลย ดู pages/round-summary.vue)
 */

const REWARDS_SHEET_NAME = "Rewards";
const REWARD_CLAIMS_SHEET_NAME = "RewardClaims";

const REWARDS_HEADERS = [
  "Id",
  "Name",
  "MinScore",
  "MaxScore",
  "Active",
  "UpdatedAt",
];

const REWARD_CLAIMS_HEADERS = [
  "RoundId",
  "UserId",
  "DisplayName",
  "RewardId",
  "RewardName",
  "Score",
  "ClaimedAt",
];

/* ------------------------------- Sheets ---------------------------------- */

function getRewardsSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(REWARDS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(REWARDS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(REWARDS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getRewardClaimsSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(REWARD_CLAIMS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(REWARD_CLAIMS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(REWARD_CLAIMS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getAllRewardRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, REWARDS_HEADERS.length).getValues();
}

function getAllRewardClaimRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet
    .getRange(2, 1, lastRow - 1, REWARD_CLAIMS_HEADERS.length)
    .getValues();
}

/* ------------------------------ Mapping ---------------------------------- */

function rewardActiveToBool_(value) {
  if (value === "" || value === null || value === undefined) return true;
  if (typeof value === "boolean") return value;
  const s = String(value).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "ใช่";
}

function rowToRewardTier_(row) {
  return {
    id: normalize_(row[0]),
    name: normalize_(row[1]),
    minScore: Number(row[2]) || 0,
    maxScore: row[3] === "" || row[3] === null || row[3] === undefined ? null : Number(row[3]),
    active: rewardActiveToBool_(row[4]),
  };
}

function rowToRewardClaim_(row) {
  return {
    roundId: normalize_(row[0]),
    userId: normalize_(row[1]),
    displayName: normalize_(row[2]),
    rewardId: normalize_(row[3]),
    rewardName: normalize_(row[4]),
    score: Number(row[5]) || 0,
    claimedAt: normalize_(row[6]),
  };
}

/**
 * หาระดับรางวัลที่ "คะแนน" นี้เข้าเงื่อนไข — ในบรรดาทุกระดับที่คะแนนผ่านเกณฑ์
 * (score >= minScore และ (maxScore ไม่กำหนด หรือ score <= maxScore)) เลือกอันที่
 * minScore สูงที่สุด (ระดับที่ "ดีที่สุด" ที่คะแนนนี้ไปถึง) ไม่มีเลยสักระดับ ->
 * คืน null (ยังไม่ถึงเกณฑ์รางวัลใดเลย)
 */
function findQualifyingRewardTier_(tiers, score) {
  let best = null;
  for (const tier of tiers) {
    if (!tier.active) continue;
    if (score < tier.minScore) continue;
    if (tier.maxScore !== null && score > tier.maxScore) continue;
    if (!best || tier.minScore > best.minScore) best = tier;
  }
  return best;
}

/** หา Claim เดิมของ (roundId + userId) คู่นี้ — roundId ว่าง (Offline) ถือว่าไม่มี
 * ทางแลกรางวัลได้เลย (ดูเหตุผลที่หัวไฟล์) คืน null ทันที ไม่ค้นหาต่อ */
function findExistingRewardClaim_(rows, roundId, userId) {
  if (!roundId || !userId) return null;
  for (let i = 0; i < rows.length; i++) {
    const c = rowToRewardClaim_(rows[i]);
    if (c.roundId === roundId && c.userId === userId) return c;
  }
  return null;
}

/**
 * [ใหม่] อ่านแถวชีต "Round" (RoundService.gs) ตรง ๆ ด้วย RoundId — ใช้ RoundId
 * เป็นตัวอ้างอิงหลักเสมอตามสเปก (ห้ามค้นหาด้วย UserId อย่างเดียว เพราะ User คน
 * เดียวมีหลาย Round ได้) เรียกใช้ getRoundSheet_/findRoundRowIndexById_/
 * rowToRoundEntry_ ของ RoundService.gs ตรง ๆ (ไฟล์เดียวกันในโปรเจกต์ Apps Script
 * เห็น function ของกันและกันได้เสมอ ไม่ต้อง import) ไม่แก้ RoundService.gs
 * เพิ่มเติมสำหรับจุดนี้เลยแม้แต่บรรทัดเดียว คืน null ถ้าไม่พบ/ไม่มี roundId ส่งมา
 */
function getRoundEntryById_(roundId) {
  const rid = normalize_(roundId);
  if (!rid) return null;
  const sheet = getRoundSheet_();
  const rowIndex = findRoundRowIndexById_(sheet, rid);
  if (rowIndex === -1) return null;
  const row = sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).getValues()[0];
  return rowToRoundEntry_(row);
}

/**
 * [ใหม่] ตั้ง Round.RewardStatus เป็น 'Claimed' — เรียกจาก actionClaimReward_
 * ด้านล่างเท่านั้น (เจ้าหน้าที่ยืนยันรับรางวัลจริงที่หน้า pages/redeem.vue) ไม่
 * เคย "ลด" สถานะกลับจาก 'Confirmed' เด็ดขาด (เผื่อกรณีเจ้าหน้าที่กดยืนยันซ้ำหลัง
 * ผู้เล่นกด OK ที่หน้า reward-received ไปแล้ว) roundId ไม่พบแถวเลย -> เงียบไว้
 * (เช่น Offline Mode ที่ไม่มี Round ฝั่ง Backend ตั้งแต่ต้น)
 */
function markRoundRewardClaimed_(roundId) {
  const rid = normalize_(roundId);
  if (!rid) return;
  const sheet = getRoundSheet_();
  const rowIndex = findRoundRowIndexById_(sheet, rid);
  if (rowIndex === -1) return;
  const row = sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).getValues()[0];
  if (normalize_(row[6]) === 'Confirmed') return;
  row[6] = 'Claimed';
  sheet.getRange(rowIndex, 1, 1, ROUND_HEADERS.length).setValues([row]);
}

/**
 * [สำคัญ] คำนวณ "คะแนนรวมของรอบนี้" ใหม่ฝั่ง server เสมอ จากแหล่งข้อมูลจริง 2 ที่
 * — ไม่รับค่าคะแนนจาก client มาเชื่อตรง ๆ เด็ดขาด (กันเจ้าหน้าที่/ผู้เล่นปลอมตัวเลข
 * คะแนนเพื่อรับรางวัลเกินสิทธิ์ — หลักการเดียวกับ actionSubmitAnswer_ ใน
 * QuestionService.gs ที่ไม่เชื่อ isCorrect จาก client):
 *   1) ชีต "Journey" (JourneyService.gs) — ผลรวมคอลัมน์ Point ของฐานที่ผ่านในรอบนี้
 *   2) ชีต "Answers" (QuestionService.gs) — ผลรวมคอลัมน์ PointsEarned ของรอบนี้
 * ผลรวมทั้งสองก้อน = คะแนนรวมที่ใช้ตัดสินสิทธิ์รางวัล ตรงกับที่หน้า
 * pages/round-summary.vue แสดง "คะแนนรวม" ให้ผู้เล่นเห็นทุกประการ (totalPoint +
 * questionPoints) จึงไม่ต้องให้เจ้าหน้าที่พิมพ์คะแนนเองที่หน้า /redeem เลย
 * (กรอกแค่ roundId + userId ที่อ่านจากหน้าจอผู้เล่นก็พอ)
 */
function computeRoundScore_(roundId, userId) {
  const rid = normalize_(roundId);
  const uid = normalize_(userId);
  if (!rid || !uid) return 0;

  let total = 0;

  const journeyRows = getAllJourneyRows_(getJourneySheet_());
  for (let i = 0; i < journeyRows.length; i++) {
    const entry = rowToJourneyEntry_(journeyRows[i]);
    if (entry.roundId === rid && entry.userId === uid) total += entry.point;
  }

  const answerRows = getAllAnswerRows_(getAnswersSheet_());
  for (let i = 0; i < answerRows.length; i++) {
    const answer = rowToAnswer_(answerRows[i]);
    if (answer.roundId === rid && answer.userId === uid) total += answer.pointsEarned;
  }

  return total;
}

/**
 * [ใหม่] คะแนนแยกรายฐานของรอบที่ระบุ — คนละรูปแบบผลลัพธ์กับ computeRoundScore_
 * ด้านบน (ตัวเลขรวมตัวเดียว) แต่ใช้แหล่งข้อมูลจริงชุดเดียวกันทุกประการ (Journey
 * สำหรับแต้มฐาน "Point" + Answers สำหรับแต้มคำถาม "QuestionPoint") กลุ่มตาม
 * stationId — 1 ฐานอาจมีทั้ง 2 ก้อนพร้อมกัน (เช่นในอนาคตที่ระบบคำถามจริงต่อฐาน
 * ผูกกับ backend แล้ว) หรือมีแค่ก้อนเดียว (ปัจจุบัน: มีแต่ Journey เพราะระบบภารกิจ
 * มินิเกม/ดมกลิ่น-ตอบคำถาม ที่หน้า pages/station/[stationId].vue ยังเป็น Mockup
 * ฝั่งเครื่องล้วน ๆ ไม่เคยเขียน Answers เลย — questionPoint จึงเป็น 0 เสมอไปก่อน
 * จนกว่าจะย้ายเนื้อหามาผูกกับชีต "Questions" จริง)
 *
 * เรียงลำดับฐานตาม "ลำดับที่ปรากฏครั้งแรก" ใน Journey/Answers (ซึ่งเป็นลำดับที่
 * บันทึกลงชีตจริง = ลำดับที่ผ่านฐานจริง) ไม่ใช้ลำดับ/ชื่อฐานจาก Stations sheet มา
 * เรียงเอง เพื่อให้ตรงกับสิ่งที่ผู้เล่นทำจริงในรอบนี้เป๊ะ ๆ
 */
function getRoundScoresBreakdown_(roundId, userId) {
  const rid = normalize_(roundId);
  const uid = normalize_(userId);
  if (!rid || !uid) return { stations: [], totalPoint: 0, totalQuestionPoint: 0, totalScore: 0 };

  const byStation = {};
  const order = [];

  function ensureStation_(stationId, stationName) {
    if (!byStation[stationId]) {
      byStation[stationId] = { stationId: stationId, stationName: stationName || stationId, point: 0, questionPoint: 0 };
      order.push(stationId);
    } else if (stationName && !byStation[stationId].stationName) {
      byStation[stationId].stationName = stationName;
    }
    return byStation[stationId];
  }

  const journeyRows = getAllJourneyRows_(getJourneySheet_());
  for (let i = 0; i < journeyRows.length; i++) {
    const entry = rowToJourneyEntry_(journeyRows[i]);
    if (entry.roundId !== rid || entry.userId !== uid) continue;
    const row = ensureStation_(entry.stationId, entry.stationName);
    row.point += entry.point;
  }

  const answerRows = getAllAnswerRows_(getAnswersSheet_());
  for (let i = 0; i < answerRows.length; i++) {
    const answer = rowToAnswer_(answerRows[i]);
    if (answer.roundId !== rid || answer.userId !== uid) continue;
    const row = ensureStation_(answer.stationId, null);
    row.questionPoint += answer.pointsEarned;
  }

  const stations = order.map(function (id) { return byStation[id]; });
  const totalPoint = stations.reduce(function (sum, s) { return sum + s.point; }, 0);
  const totalQuestionPoint = stations.reduce(function (sum, s) { return sum + s.questionPoint; }, 0);

  return {
    stations: stations,
    totalPoint: totalPoint,
    totalQuestionPoint: totalQuestionPoint,
    totalScore: totalPoint + totalQuestionPoint,
  };
}

/* ------------------------------- Actions --------------------------------- */

/**
 * action 'getRewardStatus' — ตรวจสอบสิทธิ์รางวัลของรอบที่ระบุ (ไม่เขียนข้อมูล)
 * ใช้จากหน้าสรุปผลของผู้เล่นเอง (pages/round-summary.vue — Poll ทุก 10 วินาที)
 * และหน้า pages/reward-received.vue เพื่อโชว์ว่ามีสิทธิ์รางวัลอะไร + สถานะ
 * RewardStatus ของ Round ปัจจุบันอยู่ขั้นไหนแล้ว (Pending/Claimed/Confirmed) —
 * "ไม่มีปุ่มยืนยันในนี้"
 *
 * ไม่รับ score จาก payload อีกต่อไป — คำนวณใหม่จาก Journey+Answers เสมอ (ดู
 * computeRoundScore_ ด้านบน) Payload: { action, roundId, userId }
 *
 * [ใหม่] เพิ่ม `round` ในผลลัพธ์ (roundId/userId/status/rewardStatus ฯลฯ จากชีต
 * "Round" โดยตรง ผ่าน RoundId เป็นตัวอ้างอิงหลัก) — ใช้ตัดสิน Pending/Claimed/
 * Confirmed ที่ frontend ต้อง Poll เช็ค ไม่ใช่ตัดสินจาก UserId อย่างเดียวอีก
 * ต่อไป (User คนเดียวมีหลาย Round ได้) ไม่พบ roundId นี้ในชีต Round เลย -> null
 */
function actionGetRewardStatus_(payload) {
  if (!payload || !payload.userId) {
    return { success: false, error: "userId จำเป็นต้องส่งมา" };
  }
  const roundId = normalize_(payload.roundId);
  const userId = normalize_(payload.userId);
  const score = computeRoundScore_(roundId, userId);

  const tiers = getAllRewardRows_(getRewardsSheet_()).map(rowToRewardTier_);
  const tier = findQualifyingRewardTier_(tiers, score);

  const claimRows = getAllRewardClaimRows_(getRewardClaimsSheet_());
  const existing = findExistingRewardClaim_(claimRows, roundId, userId);

  return {
    success: true,
    round: getRoundEntryById_(roundId),
    reward: tier ? { id: tier.id, name: tier.name } : null,
    alreadyClaimed: !!existing,
    claimedAt: existing ? existing.claimedAt : null,
    score: score,
  };
}

/**
 * action 'claimReward' — เจ้าหน้าที่กดยืนยันรับรางวัลที่จุดแลกรางวัล (ดู
 * pages/redeem.vue) idempotent ด้วย (roundId + userId): เคยแลกไปแล้ว -> คืนผล
 * เดิมทันที (alreadyClaimed: true) ไม่สร้างแถวซ้ำ ไม่ให้แลกซ้ำ
 *
 * ตัดสินระดับรางวัล "ใหม่ฝั่ง server เสมอ" จากคะแนนที่คำนวณเอง (ไม่รับ score จาก
 * payload อีกต่อไป — ดู computeRoundScore_ ด้านบน) และไม่เชื่อ rewardId ใด ๆ ที่
 * client อาจส่งมาเอง (กันการปลอมค่าเพื่อรับรางวัลเกินสิทธิ์) เจ้าหน้าที่จึงกรอก
 * แค่ roundId + userId ที่อ่านจากหน้าจอผู้เล่นเท่านั้น
 *
 * [ใหม่] ทุก path ที่ตอบ success (ทั้งเคย Claim ไปแล้วและเพิ่ง Claim ใหม่) จะเรียก
 * markRoundRewardClaimed_() ตั้ง Round.RewardStatus = 'Claimed' เสมอ (เว้นแต่
 * เป็น 'Confirmed' ไปแล้ว — ไม่มีวันลดสถานะกลับ) เพื่อให้หน้า round-summary.vue ที่
 * Poll อยู่ตรวจพบแล้ว redirect ไป /reward-received ได้ทันที
 *
 * Payload: { action, roundId, userId, displayName }
 */
function actionClaimReward_(payload) {
  if (!payload || !payload.userId) {
    return { success: false, error: "userId จำเป็นต้องส่งมา" };
  }
  const roundId = normalize_(payload.roundId);
  const userId = normalize_(payload.userId);
  if (!roundId) {
    return {
      success: false,
      error: "roundId จำเป็นต้องส่งมา (แลกรางวัลได้เฉพาะรอบที่เล่นแบบออนไลน์เท่านั้น)",
    };
  }
  const score = computeRoundScore_(roundId, userId);

  const claimsSheet = getRewardClaimsSheet_();
  const claimRows = getAllRewardClaimRows_(claimsSheet);
  const existing = findExistingRewardClaim_(claimRows, roundId, userId);
  if (existing) {
    markRoundRewardClaimed_(roundId);
    return {
      success: true,
      alreadyClaimed: true,
      reward: existing.rewardId
        ? { id: existing.rewardId, name: existing.rewardName }
        : null,
      claimedAt: existing.claimedAt,
    };
  }

  const tiers = getAllRewardRows_(getRewardsSheet_()).map(rowToRewardTier_);
  const tier = findQualifyingRewardTier_(tiers, score);
  if (!tier) {
    return { success: false, error: "คะแนนยังไม่ถึงเกณฑ์รับรางวัลใดเลย" };
  }

  const now = bangkokNow_();
  claimsSheet.appendRow([
    roundId,
    userId,
    normalize_(payload.displayName),
    tier.id,
    tier.name,
    score,
    now,
  ]);
  markRoundRewardClaimed_(roundId);

  return {
    success: true,
    alreadyClaimed: false,
    reward: { id: tier.id, name: tier.name },
    claimedAt: now,
  };
}

/** action 'listRewards' — ดึงคลังของรางวัลทั้งหมด (ไม่เขียนข้อมูล) เผื่อใช้ทำ
 * หน้า Admin จัดการรางวัลในอนาคต */
function actionListRewards_() {
  const tiers = getAllRewardRows_(getRewardsSheet_()).map(rowToRewardTier_);
  return { success: true, rewards: tiers };
}

/**
 * [ใหม่] action 'getRoundScores' — คะแนนแยกรายฐานของรอบที่ระบุ (ไม่เขียนข้อมูล)
 * ใช้จากหน้าสรุปผล/หน้ารับรางวัลของผู้เล่นเอง (pages/round-summary.vue,
 * pages/reward-received.vue) เพื่อแสดง "ฐานที่ผ่าน + คะแนนแต่ละฐาน" โดย Client
 * ไม่ต้องคำนวณ/ปะติดปะต่อเอง (ดู getRoundScoresBreakdown_ ด้านบน) ตรงกับหลักการ
 * เดียวกับ getRewardStatus/claimReward ด้านบน — คะแนนมาจาก server เสมอ
 *
 * Payload: { action, roundId, userId }
 */
function actionGetRoundScores_(payload) {
  if (!payload || !normalize_(payload.roundId) || !normalize_(payload.userId)) {
    return { success: false, error: "roundId และ userId จำเป็นต้องส่งมา" };
  }
  const roundId = normalize_(payload.roundId);
  const userId = normalize_(payload.userId);
  const breakdown = getRoundScoresBreakdown_(roundId, userId);

  return {
    success: true,
    roundId: roundId,
    userId: userId,
    stations: breakdown.stations,
    totalPoint: breakdown.totalPoint,
    totalQuestionPoint: breakdown.totalQuestionPoint,
    totalScore: breakdown.totalScore,
  };
}
