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
// [ใหม่ — ตามที่ตกลงกัน] ชีตแคช "คะแนนที่ Client รายงานมาเอง" (จาก LocalStorage
// ฝั่งเกม — รวมคะแนนฐาน (Journey) + คะแนนคำถามตอบถูก (Answers/questionAnswered
// ใน LocalStorage) ที่คำนวณไว้แล้วฝั่งเครื่อง) ใช้เป็น "ทางลัดชั่วคราว" แทนการ
// พึ่ง computeRoundScore_ (Journey+Answers sheet) ล้วน ๆ เผื่อกรณี Answers sheet
// ยัง sync ไม่ทัน/ไม่ครบตอนใช้งานจริง — เขียนทุกครั้งที่ actionGetRewardStatus_
// ถูกเรียกพร้อม payload.score (round-summary.vue โพลทุก 10 วิ) แล้ว
// actionClaimReward_/actionListPendingRewards_ อ่านค่านี้ก่อนเสมอถ้ามี ไม่มี ->
// fallback ไป computeRoundScore_ เหมือนเดิมทุกประการ (ไม่กระทบ path เดิม)
// *** ข้อควรระวัง: จุดนี้ "เชื่อคะแนนจาก client" ตรง ๆ — เหมาะสำหรับช่วง Demo/
// ทดสอบเท่านั้น ไม่แนะนำสำหรับ Production จริงที่มีการแจกของรางวัลมีมูลค่า เพราะ
// เปิดช่องให้แก้ค่าใน LocalStorage แล้วรับรางวัลเกินสิทธิ์ได้ ***
const ROUND_SCORE_CACHE_SHEET_NAME = "RoundScoreCache";
const ROUND_SCORE_CACHE_HEADERS = ["RoundId", "UserId", "Score", "UpdatedAt"];

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

function getRoundScoreCacheSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(ROUND_SCORE_CACHE_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ROUND_SCORE_CACHE_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ROUND_SCORE_CACHE_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** บันทึก/อัปเดตคะแนนที่ Client รายงานมาของ (roundId+userId) นี้ — 1 คู่ = 1 แถว
 * เสมอ (upsert) หา่ไม่เจอแถวเดิม -> เพิ่มแถวใหม่ */
function upsertRoundScoreCache_(roundId, userId, score, now) {
  const rid = normalize_(roundId);
  const uid = normalize_(userId);
  if (!rid || !uid) return;
  const sheet = getRoundScoreCacheSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const rows = sheet
      .getRange(2, 1, lastRow - 1, ROUND_SCORE_CACHE_HEADERS.length)
      .getValues();
    for (let i = 0; i < rows.length; i++) {
      if (normalize_(rows[i][0]) === rid && normalize_(rows[i][1]) === uid) {
        sheet
          .getRange(i + 2, 1, 1, ROUND_SCORE_CACHE_HEADERS.length)
          .setValues([[rid, uid, Number(score) || 0, now]]);
        return;
      }
    }
  }
  sheet.appendRow([rid, uid, Number(score) || 0, now]);
}

/** อ่านคะแนนที่ Client เคยรายงานไว้ล่าสุดของ (roundId+userId) นี้ — คืน null ถ้า
 * ไม่เคยมีการรายงานมาเลย (ให้ผู้เรียก fallback ไป computeRoundScore_ เอง) */
function readCachedRoundScore_(roundId, userId) {
  const rid = normalize_(roundId);
  const uid = normalize_(userId);
  if (!rid || !uid) return null;
  const sheet = getRoundScoreCacheSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const rows = sheet
    .getRange(2, 1, lastRow - 1, ROUND_SCORE_CACHE_HEADERS.length)
    .getValues();
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === rid && normalize_(rows[i][1]) === uid) {
      return Number(rows[i][2]) || 0;
    }
  }
  return null;
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
    maxScore:
      row[3] === "" || row[3] === null || row[3] === undefined
        ? null
        : Number(row[3]),
    active: rewardActiveToBool_(row[4]),
    updatedAt: normalize_(row[5]),
  };
}

/** สร้างรหัสระดับรางวัลใหม่ ไม่ซ้ำกัน เช่น RW-LXQK3F-A1B (รูปแบบเดียวกับ
 * generateSideQuestId_ ของ SideQuestsService.gs) */
function generateRewardId_() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return "RW-" + ts + "-" + rand;
}

/** คืนค่า row number จริงบนชีต "Rewards" (1-indexed) ของระดับรางวัล (id) หรือ -1
 * ถ้าไม่พบ */
function findRewardRowIndexById_(sheet, id) {
  const target = normalize_(id);
  if (!target) return -1;
  const rows = getAllRewardRows_(sheet);
  for (let i = 0; i < rows.length; i++) {
    if (normalize_(rows[i][0]) === target) return i + 2;
  }
  return -1;
}

/** สร้างระดับรางวัลใหม่ 1 แถวในชีต "Rewards" — id/updatedAt กำหนดโดยฝั่งนี้เสมอ */
function createRewardTier_(sheet, input, now) {
  const id = generateRewardId_();
  const newRow = [
    id,
    normalize_(input.name),
    Number(input.minScore) || 0,
    input.maxScore === undefined ||
    input.maxScore === null ||
    input.maxScore === ""
      ? ""
      : Number(input.maxScore),
    input.active !== false,
    now,
  ];
  sheet.appendRow(newRow);
  return rowToRewardTier_(newRow);
}

/** แก้ไขระดับรางวัลที่มีอยู่แล้วด้วย id — อัปเดตเฉพาะฟิลด์ที่ส่งมา (undefined = คงค่าเดิมไว้) */
function updateRewardTier_(sheet, rowIndex, input, now) {
  const current = sheet
    .getRange(rowIndex, 1, 1, REWARDS_HEADERS.length)
    .getValues()[0];
  const updatedRow = [
    current[0],
    input.name !== undefined ? normalize_(input.name) : current[1],
    input.minScore !== undefined ? Number(input.minScore) || 0 : current[2],
    input.maxScore !== undefined
      ? input.maxScore === null || input.maxScore === ""
        ? ""
        : Number(input.maxScore)
      : current[3],
    input.active !== undefined ? !!input.active : current[4],
    now,
  ];
  sheet
    .getRange(rowIndex, 1, 1, REWARDS_HEADERS.length)
    .setValues([updatedRow]);
  return rowToRewardTier_(updatedRow);
}

/** ลบระดับรางวัล 1 แถวด้วย id */
function deleteRewardRow_(sheet, rowIndex) {
  sheet.deleteRow(rowIndex);
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
  const row = sheet
    .getRange(rowIndex, 1, 1, ROUND_HEADERS.length)
    .getValues()[0];
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
  const row = sheet
    .getRange(rowIndex, 1, 1, ROUND_HEADERS.length)
    .getValues()[0];
  if (normalize_(row[6]) === "Confirmed") return;
  row[6] = "Claimed";
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
    if (answer.roundId === rid && answer.userId === uid)
      total += answer.pointsEarned;
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
  if (!rid || !uid)
    return {
      stations: [],
      totalPoint: 0,
      totalQuestionPoint: 0,
      totalScore: 0,
    };

  const byStation = {};
  const order = [];

  function ensureStation_(stationId, stationName) {
    if (!byStation[stationId]) {
      byStation[stationId] = {
        stationId: stationId,
        stationName: stationName || stationId,
        point: 0,
        questionPoint: 0,
      };
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

  const stations = order.map(function (id) {
    return byStation[id];
  });
  const totalPoint = stations.reduce(function (sum, s) {
    return sum + s.point;
  }, 0);
  const totalQuestionPoint = stations.reduce(function (sum, s) {
    return sum + s.questionPoint;
  }, 0);

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

  // [ใหม่] payload.score = คะแนนที่ Client คำนวณเอง (LocalStorage: ฐานที่ผ่าน +
  // คำถามตอบถูก) ส่งมาด้วย -> เชื่อค่านี้ตรง ๆ และแคชไว้ (upsertRoundScoreCache_)
  // ให้ actionClaimReward_/actionListPendingRewards_ อ่านต่อได้ทีหลัง ไม่ส่งมา
  // (undefined) -> พฤติกรรมเดิมทุกประการ (คำนวณจาก Journey+Answers ฝั่ง server)
  let score;
  if (typeof payload.score === "number" && !isNaN(payload.score)) {
    score = Math.max(0, Math.floor(payload.score));
    if (roundId && userId)
      upsertRoundScoreCache_(roundId, userId, score, bangkokNow_());
  } else {
    score = computeRoundScore_(roundId, userId);
  }

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
 * action 'claimReward' — เจ้าหน้าที่กดยืนยันที่จุดแลกรางวัล (ดู pages/redeem.vue)
 * idempotent ด้วย (roundId + userId): เคยกดยืนยันไปแล้ว -> คืนผลเดิมทันที
 * (alreadyClaimed: true) ไม่สร้างแถวซ้ำ ไม่ให้ยืนยันซ้ำ
 *
 * ตัดสินระดับรางวัล "ใหม่ฝั่ง server เสมอ" จากคะแนนที่คำนวณเอง (ไม่รับ score จาก
 * payload อีกต่อไป — ดู computeRoundScore_ ด้านบน) และไม่เชื่อ rewardId ใด ๆ ที่
 * client อาจส่งมาเอง (กันการปลอมค่าเพื่อรับรางวัลเกินสิทธิ์) เจ้าหน้าที่จึงกรอก
 * แค่ roundId + userId ที่อ่านจากหน้าจอผู้เล่นเท่านั้น
 *
 * [แก้ไข] เดิม: "ไม่มีระดับรางวัลใดเข้าเกณฑ์เลย" -> ตอบ error กลับไป ทำให้รอบนั้น
 * ค้างที่ RewardStatus='Pending' ตลอดไป (เจ้าหน้าที่กดยืนยันไม่ได้เลยสักครั้ง เพราะ
 * ทุกครั้งเจอ error) ผู้เล่นที่คะแนนไม่ถึงเกณฑ์รางวัลใดเลยจึงติดค้างที่หน้า
 * round-summary.vue (Poll รอ RewardStatus เปลี่ยนเป็น Claimed) ไปตลอดกาล ไม่มีทาง
 * ไปต่อได้ — ทั้งที่ "Pending" มีความหมายแค่ "จบเกมแล้ว รอเจ้าหน้าที่ยืนยัน" เท่านั้น
 * ไม่ได้แปลว่า "ต้องมีรางวัลเสมอ"
 *
 * ตอนนี้: ไม่มีระดับรางวัลเข้าเกณฑ์เลย -> ยัง "ยืนยันจบขั้นตอนได้" เหมือนเดิมทุก
 * ประการ เพียงแต่ reward เป็น null (ไม่มีรางวัลให้) — บันทึกแถวลง RewardClaims
 * ไว้เป็นหลักฐานเช่นกัน (RewardId/RewardName ว่างเปล่า = "ยืนยันแล้วแต่ไม่มีรางวัล")
 * แล้วเรียก markRoundRewardClaimed_() ต่อเหมือนกรณีมีรางวัลทุกประการ
 *
 * ทุก path ที่ตอบ success (เคย Claim ไปแล้ว/เพิ่ง Claim ใหม่ ไม่ว่าจะมีรางวัลหรือ
 * ไม่มีรางวัลก็ตาม) จะเรียก markRoundRewardClaimed_() ตั้ง Round.RewardStatus =
 * 'Claimed' เสมอ (เว้นแต่เป็น 'Confirmed' ไปแล้ว — ไม่มีวันลดสถานะกลับ) เพื่อให้
 * หน้า round-summary.vue ที่ Poll อยู่ตรวจพบแล้ว redirect ไป /reward-received ได้
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
      error:
        "roundId จำเป็นต้องส่งมา (แลกรางวัลได้เฉพาะรอบที่เล่นแบบออนไลน์เท่านั้น)",
    };
  }
  // [ใหม่] ใช้คะแนนที่ Client เคยรายงานไว้ (แคชผ่าน getRewardStatus) ก่อนเสมอ
  // ถ้ามี — ไม่มีเลย (ไม่เคยเรียก getRewardStatus พร้อม score มาก่อน) -> fallback
  // ไปคำนวณจาก Journey+Answers ฝั่ง server ตามเดิม (ไม่กระทบ Flow เดิม)
  const cachedScore = readCachedRoundScore_(roundId, userId);
  const score =
    cachedScore !== null ? cachedScore : computeRoundScore_(roundId, userId);

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
  // [แก้ไข] ไม่พบระดับรางวัลที่เข้าเกณฑ์ -> "ไม่ error อีกต่อไป" ยังคงบันทึกการ
  // ยืนยันจบขั้นตอนไว้ตามปกติ (tier.id/tier.name เป็นค่าว่างในแถว RewardClaims)
  const now = bangkokNow_();
  claimsSheet.appendRow([
    roundId,
    userId,
    normalize_(payload.displayName),
    tier ? tier.id : "",
    tier ? tier.name : "",
    score,
    now,
  ]);
  markRoundRewardClaimed_(roundId);

  return {
    success: true,
    alreadyClaimed: false,
    reward: tier ? { id: tier.id, name: tier.name } : null,
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
 * [ใหม่] action 'createReward' — สร้างระดับรางวัลใหม่ในชีต "Rewards" (ใช้โดย
 * หน้า Admin > รางวัล — pages/admin/rewards.vue) โครงสร้างเดียวกับ
 * actionCreateSideQuest_ ของ SideQuestsService.gs ทุกประการ ไม่ต้องกำหนด
 * maxScore ก็ได้ (แปลว่า "ไม่มีเพดานบน" — ดู findQualifyingRewardTier_ ด้านบน)
 */
function actionCreateReward_(payload) {
  if (!payload || !normalize_(payload.name)) {
    return { success: false, error: "name จำเป็นต้องส่งมา" };
  }
  const sheet = getRewardsSheet_();
  const reward = createRewardTier_(sheet, payload, bangkokNow_());
  return { success: true, reward: reward };
}

/** [ใหม่] action 'updateReward' — แก้ไขระดับรางวัลด้วย id (รวมถึงสลับ active เปิด/ปิด) */
function actionUpdateReward_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: "id จำเป็นต้องส่งมา" };
  }
  const sheet = getRewardsSheet_();
  const rowIndex = findRewardRowIndexById_(sheet, payload.id);
  if (rowIndex === -1) {
    return { success: false, error: "ไม่พบระดับรางวัลตาม id ที่ระบุ" };
  }
  const reward = updateRewardTier_(sheet, rowIndex, payload, bangkokNow_());
  return { success: true, reward: reward };
}

/** [ใหม่] action 'deleteReward' — ลบระดับรางวัลด้วย id (ไม่กระทบ RewardClaims
 * เดิมที่เคยแลกไปแล้วภายใต้ระดับนี้ — ประวัติการแลกยังอยู่ครบ เปลี่ยนแค่คลัง
 * รางวัลที่ใช้ตัดสินสิทธิ์ของรอบใหม่ ๆ ต่อจากนี้เท่านั้น) */
function actionDeleteReward_(payload) {
  if (!payload || !normalize_(payload.id)) {
    return { success: false, error: "id จำเป็นต้องส่งมา" };
  }
  const sheet = getRewardsSheet_();
  const rowIndex = findRewardRowIndexById_(sheet, payload.id);
  if (rowIndex === -1) {
    return { success: false, error: "ไม่พบระดับรางวัลตาม id ที่ระบุ" };
  }
  deleteRewardRow_(sheet, rowIndex);
  return { success: true };
}

/**
 * [ใหม่] action 'listPendingRewards' — รายชื่อ "รอบที่จบเกมแล้ว แต่ยังไม่ได้รับ
 * รางวัล" ทั้งหมด (Round.Status = 'Ended' และ Round.RewardStatus = 'Pending')
 * ไม่เขียนข้อมูลใด ๆ ใช้แทนการให้เจ้าหน้าที่พิมพ์ roundId/userId เองที่หน้า
 * pages/admin/redeem.vue — เจ้าหน้าที่เห็นชื่อผู้เล่นที่รอรับรางวัลเป็นรายการ
 * กดเลือกได้เลย
 *
 * สำหรับแต่ละรอบที่ตรงเงื่อนไข คำนวณคะแนนรวมใหม่ฝั่ง server เสมอ
 * (computeRoundScore_ เดียวกับ actionGetRewardStatus_/actionClaimReward_ —
 * ไม่มีทางเลขคะแนนเพี้ยนไปจากหน้า /redeem เดิม) แล้วหาระดับรางวัลที่เข้าเกณฑ์
 * (findQualifyingRewardTier_) ให้ทันที เพื่อให้เจ้าหน้าที่เห็นชื่อรางวัลในรายการ
 * โดยไม่ต้องกดเข้าไปดูทีละคน
 *
 * เรียงผลลัพธ์จาก "จบรอบล่าสุดก่อน" (endTime ใหม่สุดอยู่บนสุด) เพราะเป็นคนที่
 * กำลังรอเจ้าหน้าที่อยู่หน้าจุดแลกรางวัลตอนนี้พอดี — endTime เก็บเป็น string
 * รูปแบบ "yyyy-MM-dd HH:mm:ss" (bangkokNow_) เรียงด้วย string compare ตรงตาม
 * เวลาจริงได้เลยเพราะความยาวคงที่เท่ากันทุกแถว
 */
function actionListPendingRewards_() {
  const roundRows = getAllRoundRows_(getRoundSheet_());
  const tiers = getAllRewardRows_(getRewardsSheet_()).map(rowToRewardTier_);
  const claimRows = getAllRewardClaimRows_(getRewardClaimsSheet_());

  const pending = [];
  for (let i = 0; i < roundRows.length; i++) {
    const entry = rowToRoundEntry_(roundRows[i]);
    if (entry.status !== "Ended") continue;
    if (entry.rewardStatus !== "Pending") continue;

    // [ใหม่] เหมือน actionClaimReward_ — ใช้คะแนนแคชจาก Client ก่อนถ้ามี
    const cachedScore = readCachedRoundScore_(entry.roundId, entry.userId);
    const score =
      cachedScore !== null
        ? cachedScore
        : computeRoundScore_(entry.roundId, entry.userId);
    const tier = findQualifyingRewardTier_(tiers, score);
    const existing = findExistingRewardClaim_(
      claimRows,
      entry.roundId,
      entry.userId,
    );

    pending.push({
      roundId: entry.roundId,
      userId: entry.userId,
      firstName: entry.firstName,
      endTime: entry.endTime,
      score: score,
      reward: tier ? { id: tier.id, name: tier.name } : null,
      alreadyClaimed: !!existing,
    });
  }

  pending.sort(function (a, b) {
    if (a.endTime === b.endTime) return 0;
    return a.endTime < b.endTime ? 1 : -1;
  });

  return { success: true, pending: pending };
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
