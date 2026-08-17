/**
 * server-gas/QuestionService.gs
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ระบบ "ภารกิจ + คำถามประจำฐาน (เผ่า)" ตาม Flow ใหม่
 *
 *   Scan QR เข้าฐาน -> แสดงภารกิจของฐานนั้น -> ลูกค้าปฏิบัติตามภารกิจ ->
 *   ตอบคำถามบนระบบ (1 คำถาม 1 คำตอบ) -> ถูก = ได้คะแนน / ผิด = ไม่ได้คะแนน
 *
 * จัดการ 2 ชีต (สร้างอัตโนมัติพร้อมหัวตารางเมื่อเรียก action ครั้งแรก):
 *   - "Questions" : คลังคำถาม 1 แถว = 1 คำถาม ผูกกับ 1 ฐาน
 *   - "Answers"   : ประวัติการตอบ 1 แถว = ผู้เล่น 1 คน ตอบคำถาม 1 ข้อ 1 ครั้ง
 *
 * *** ไม่แตะไฟล์ service เดิมเลยสักไฟล์ *** — เชื่อมเข้าระบบเดิมแค่ 2 จุด:
 *   1) เพิ่ม case ใหม่ใน router ของ Code.gs (เหมือนที่ทุก service ทำ)
 *   2) เรียก upsertScore_() ของ ScoreService.gs เพื่อบวกแต้มคำถามเข้าคะแนนสะสม
 *      ก้อนเดียวกับแต้มฐาน (addStation = 0 เพราะไม่ใช่การผ่านฐานใหม่)
 *
 * กติกา "ตอบได้ครั้งเดียว ผิดแล้วผิดเลย" บังคับที่ฝั่ง Backend ด้วย ไม่ใช่แค่ UI:
 * actionSubmitAnswer_ เช็คก่อนเสมอว่า (roundId + userId + questionId) นี้เคยมี
 * แถวใน "Answers" แล้วหรือยัง เคยแล้ว -> คืนผลเดิม ไม่บันทึกซ้ำ ไม่บวกแต้มซ้ำ
 * (idempotent เหมือน actionCheckin_ ของระบบเดิมทุกประการ)
 */

const QUESTIONS_SHEET_NAME = "Questions";
const ANSWERS_SHEET_NAME = "Answers";

const QUESTIONS_HEADERS = [
  "Id",
  "StationId",
  "Mission",
  "Question",
  "AnswerType",
  "Choices",
  "CorrectAnswer",
  "Points",
  "Active",
  "Explanation",
  "Order",
  "UpdatedAt",
];

const ANSWERS_HEADERS = [
  "AnswerId",
  "RoundId",
  "UserId",
  "StationId",
  "QuestionId",
  "Answer",
  "IsCorrect",
  "PointsEarned",
  "AnsweredAt",
  "ClientId",
];

/* ------------------------------- Sheets ---------------------------------- */

function getQuestionsSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(QUESTIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(QUESTIONS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(QUESTIONS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getAnswersSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(ANSWERS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ANSWERS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ANSWERS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getAllQuestionRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, QUESTIONS_HEADERS.length).getValues();
}

function getAllAnswerRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, ANSWERS_HEADERS.length).getValues();
}

/* ------------------------------ Mapping ---------------------------------- */

/** แปลงค่าในคอลัมน์ Active ให้เป็น boolean — ชีตอาจเก็บเป็น TRUE/true/1/"ใช่"
 * แล้วแต่คนกรอก ค่าว่างถือว่า "เปิดใช้งาน" (ไม่บังคับให้ต้องกรอกทุกแถว) */
function questionActiveToBool_(value) {
  if (value === "" || value === null || value === undefined) return true;
  if (typeof value === "boolean") return value;
  const s = String(value).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "ใช่";
}

/** แยกตัวเลือกที่กรอกมาในช่องเดียว — รองรับทั้งคั่นด้วย | และ , (เลือก | ก่อน
 * เพราะตัวเลือกภาษาไทยมักมีลูกน้ำอยู่ในข้อความเอง) */
function parseChoices_(value) {
  const raw = normalize_(value);
  if (!raw) return [];
  const sep = raw.indexOf("|") !== -1 ? "|" : ",";
  return raw
    .split(sep)
    .map(function (s) {
      return s.trim();
    })
    .filter(function (s) {
      return s !== "";
    });
}

function rowToQuestion_(row) {
  return {
    id: normalize_(row[0]),
    stationId: normalize_(row[1]),
    mission: normalize_(row[2]),
    question: normalize_(row[3]),
    answerType: normalize_(row[4]) || "choice",
    choices: parseChoices_(row[5]),
    correctAnswer: normalize_(row[6]),
    points: Number(row[7]) || 0,
    active: questionActiveToBool_(row[8]),
    explanation: normalize_(row[9]),
    order: Number(row[10]) || 0,
    updatedAt: normalize_(row[11]),
  };
}

function rowToAnswer_(row) {
  return {
    answerId: normalize_(row[0]),
    roundId: normalize_(row[1]),
    userId: normalize_(row[2]),
    stationId: normalize_(row[3]),
    questionId: normalize_(row[4]),
    answer: normalize_(row[5]),
    isCorrect: questionActiveToBool_(row[6]) && normalize_(row[6]) !== "",
    pointsEarned: Number(row[7]) || 0,
    answeredAt: normalize_(row[8]),
    clientId: normalize_(row[9]),
  };
}

/* ------------------------------- Actions --------------------------------- */

/**
 * action 'listQuestions' — ดึงคำถามทั้งหมด (ไม่เขียนข้อมูล)
 * ส่ง stationId มาด้วยได้เพื่อกรองเฉพาะฐานนั้น (ไม่ส่ง = เอาทุกฐาน ให้ frontend
 * cache ไว้ทั้งก้อนตั้งแต่ต้นรอบ เพื่อให้เล่นต่อได้ตอนสัญญาณหลุดกลางแปลง)
 *
 * *** ส่ง correctAnswer ลงไปด้วย *** ตามที่ออกแบบไว้ใน types/question.ts
 * (Offline First — ตัดสินถูก/ผิดบนเครื่องได้เลยไม่ต้องรอเน็ต) อ่านเหตุผลเต็ม
 * และวิธีเปลี่ยนไปตัดสินฝั่ง server ได้ที่ท้ายไฟล์ types/question.ts
 */
function actionListQuestions_(payload) {
  const sheet = getQuestionsSheet_();
  const stationId = normalize_(payload && payload.stationId);
  const rows = getAllQuestionRows_(sheet);

  const questions = [];
  for (let i = 0; i < rows.length; i++) {
    const q = rowToQuestion_(rows[i]);
    if (!q.id) continue;
    if (stationId && q.stationId !== stationId) continue;
    questions.push(q);
  }

  questions.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });

  return { success: true, questions: questions };
}

/** หาแถวคำตอบเดิมของ (roundId + userId + questionId) — หัวใจของกติกา
 * "ตอบได้ครั้งเดียว" ถ้า roundId ว่าง (เล่นแบบไม่มีรอบ) จะเทียบแค่ userId+questionId */
function findExistingAnswerRow_(rows, roundId, userId, questionId) {
  for (let i = 0; i < rows.length; i++) {
    const a = rowToAnswer_(rows[i]);
    if (a.userId !== userId || a.questionId !== questionId) continue;
    if (roundId && a.roundId !== roundId) continue;
    return { rowIndex: i + 2, answer: a };
  }
  return null;
}

/** เทียบคำตอบตามชนิด — normalize ทั้งสองฝั่งก่อนเสมอ (ตัดช่องว่าง/ตัวพิมพ์
 * เล็กใหญ่) เพื่อไม่ให้ผู้เล่นตอบถูกแต่ระบบบอกผิดเพราะพิมพ์เว้นวรรคเกิน */
function isAnswerCorrect_(question, answer) {
  const given = normalize_(answer).toLowerCase();
  const expected = normalize_(question.correctAnswer).toLowerCase();
  if (!expected) return false;

  if (question.answerType === "number") {
    const g = Number(String(given).replace(/[^\d.-]/g, ""));
    const e = Number(String(expected).replace(/[^\d.-]/g, ""));
    if (isNaN(g) || isNaN(e)) return false;
    return g === e;
  }

  return given === expected;
}

/**
 * action 'submitAnswer' — บันทึกคำตอบ 1 ครั้ง + บวกแต้มถ้าตอบถูก
 *
 * idempotent: ถ้า (roundId + userId + questionId) เคยตอบแล้ว จะคืนผลเดิมทันที
 * พร้อม alreadyAnswered: true โดย **ไม่บันทึกซ้ำและไม่บวกแต้มซ้ำ** — ปลอดภัยกับ
 * ระบบ Offline Queue ฝั่ง frontend ที่อาจ retry ส่งซ้ำได้หลายครั้ง
 *
 * Payload: { action, roundId, userId, firstName, stationId, questionId,
 *            answer, clientId }
 *
 * หมายเหตุ: ตัดสินถูก/ผิด "ใหม่ฝั่ง server เสมอ" จากเฉลยในชีต ไม่เชื่อค่า
 * isCorrect ที่ frontend ส่งมา (frontend ตัดสินเองได้เพื่อแสดงผลทันทีตอน
 * ออฟไลน์ แต่ตัวเลขที่ลงชีตจริงต้องมาจากเฉลยฝั่ง server เท่านั้น)
 */
function actionSubmitAnswer_(payload) {
  if (!payload || !payload.userId) {
    return { success: false, error: "userId จำเป็นต้องส่งมา" };
  }
  if (!payload.questionId) {
    return { success: false, error: "questionId จำเป็นต้องส่งมา" };
  }

  const userId = normalize_(payload.userId);
  const questionId = normalize_(payload.questionId);
  const roundId = normalize_(payload.roundId);
  const answer = normalize_(payload.answer);

  // 1) หาคำถามจากคลังก่อน — ไม่มีคำถามนี้ในชีต = ข้อมูลไม่ตรงกัน ไม่บันทึกอะไรเลย
  const qSheet = getQuestionsSheet_();
  const qRows = getAllQuestionRows_(qSheet);
  let question = null;
  for (let i = 0; i < qRows.length; i++) {
    const q = rowToQuestion_(qRows[i]);
    if (q.id === questionId) {
      question = q;
      break;
    }
  }
  if (!question) {
    return { success: false, error: 'ไม่พบคำถาม id="' + questionId + '" ในชีต Questions' };
  }

  // 2) เคยตอบข้อนี้ในรอบนี้แล้วหรือยัง (กติกา "ตอบได้ครั้งเดียว")
  const aSheet = getAnswersSheet_();
  const aRows = getAllAnswerRows_(aSheet);
  const existing = findExistingAnswerRow_(aRows, roundId, userId, questionId);
  if (existing) {
    return {
      success: true,
      alreadyAnswered: true,
      isCorrect: existing.answer.isCorrect,
      pointsEarned: existing.answer.pointsEarned,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }

  // 3) ตัดสินถูก/ผิดจากเฉลยในชีตเท่านั้น
  const correct = isAnswerCorrect_(question, answer);
  const pointsEarned = correct ? question.points : 0;
  const now = bangkokNow_();
  const answerId = "A-" + Date.now().toString(36).toUpperCase();

  aSheet.appendRow([
    answerId,
    roundId,
    userId,
    normalize_(payload.stationId) || question.stationId,
    questionId,
    answer,
    correct,
    pointsEarned,
    now,
    normalize_(payload.clientId),
  ]);

  // 4) ตอบถูก -> บวกแต้มเข้าคะแนนสะสมก้อนเดียวกับแต้มฐาน
  //    addStation = 0 เพราะ "ตอบคำถาม" ไม่ใช่ "ผ่านฐานใหม่" (จำนวนฐานที่ผ่าน
  //    ยังนับจาก actionCheckin_ ของระบบเดิมจุดเดียวเหมือนเดิมทุกประการ)
  let score = null;
  if (pointsEarned > 0) {
    const scoreSheet = getScoreSheet_();
    score = upsertScore_(
      scoreSheet,
      userId,
      normalize_(payload.firstName),
      pointsEarned,
      0,
      now,
    );
  }

  return {
    success: true,
    alreadyAnswered: false,
    isCorrect: correct,
    pointsEarned: pointsEarned,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    score: score,
  };
}

/**
 * action 'getRoundAnswers' — ดึงคำตอบทั้งหมดของผู้เล่นในรอบที่ระบุ (ไม่เขียนข้อมูล)
 * ใช้ที่หน้าสรุปคะแนน และใช้ให้ frontend กู้สถานะ "ข้อไหนตอบไปแล้วบ้าง" กลับมา
 * ได้ถ้าผู้เล่นเปลี่ยนเครื่อง/ล้าง LocalStorage กลางรอบ
 */
function actionGetRoundAnswers_(payload) {
  if (!payload || !payload.userId) {
    return { success: false, error: "userId จำเป็นต้องส่งมา" };
  }
  const userId = normalize_(payload.userId);
  const roundId = normalize_(payload.roundId);

  const rows = getAllAnswerRows_(getAnswersSheet_());
  const answers = [];
  let totalCorrect = 0;
  let totalQuestionPoints = 0;

  for (let i = 0; i < rows.length; i++) {
    const a = rowToAnswer_(rows[i]);
    if (a.userId !== userId) continue;
    if (roundId && a.roundId !== roundId) continue;
    answers.push(a);
    if (a.isCorrect) totalCorrect++;
    totalQuestionPoints += a.pointsEarned;
  }

  return {
    success: true,
    answers: answers,
    summary: {
      totalAnswered: answers.length,
      totalCorrect: totalCorrect,
      totalQuestionPoints: totalQuestionPoints,
    },
  };
}
