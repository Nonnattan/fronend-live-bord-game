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

/* ------------------------------- Actions --------------------------------- */

/**
 * action 'getRewardStatus' — ตรวจสอบสิทธิ์รางวัลของรอบที่ระบุ (ไม่เขียนข้อมูล)
 * ใช้จากหน้าสรุปผลของผู้เล่นเอง (pages/round-summary.vue) เพื่อโชว์ว่ามีสิทธิ์
 * รางวัลอะไร + เจ้าหน้าที่ยืนยันให้แล้วหรือยัง — "ไม่มีปุ่มยืนยันในนี้"
 *
 * ไม่รับ score จาก payload อีกต่อไป — คำนวณใหม่จาก Journey+Answers เสมอ (ดู
 * computeRoundScore_ ด้านบน) Payload: { action, roundId, userId }
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
