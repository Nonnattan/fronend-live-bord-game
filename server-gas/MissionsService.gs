/**
 * MissionsService.gs
 * ---------------------------------------------------------------------------
 * [แก้ไข — Missions กลายเป็น Content-Driven จากชีต "Questions" จริง]
 * เดิมไฟล์นี้คำนวณภารกิจตายตัว 3 อัน (smell/question/qr) จาก MISSION_KIND_ORDER_/
 * MISSION_META_ เท่านั้น (ไม่มีที่มาจากข้อมูลจริงเลย) ตามสเปกใหม่ "ห้าม hardcode
 * จำนวนด่าน" — เปลี่ยนเป็นอ่านคำถามของฐานนั้นจากชีต "Questions" (QuestionService.gs)
 * มา "จัดกลุ่ม" ด้วยคอลัมน์ใหม่ "MissionKey" (เพิ่มใน QuestionService.gs — ดู
 * คอมเมนต์ที่นั่นสำหรับเหตุผลที่ไม่ใช้คอลัมน์ "Mission" เดิม) แทน:
 *   - กลุ่มที่มี 1 คำถาม -> ภารกิจ SINGLE_QUESTION (คะแนน = คะแนนคำถามนั้น)
 *   - กลุ่มที่มี 2+ คำถาม -> ภารกิจ MULTI_QUESTION (คะแนน = รวมคะแนนทุกคำถามในกลุ่ม)
 * แล้วต่อท้ายด้วยภารกิจ QR_SCORE เสมอ 1 อัน (ถ้าฐานมี MissionQrToken) — คะแนนจาก
 * คอลัมน์ใหม่ "MissionQrPoints" ในชีต Stations (Admin ปรับได้โดยไม่ต้อง Deploy ใหม่)
 *
 * วันนี้ข้อมูลจริงอาจมีแค่ 2 กลุ่มคำถาม + QR = 3 ภารกิจ (เหมือนเดิม) แต่ตัวโค้ด
 * "ไม่ยึดติดกับเลข 3" อีกต่อไป — เพิ่มคำถามกลุ่มใหม่ในชีตพรุ่งนี้ก็ได้ภารกิจที่ 4
 * ทันทีโดยไม่ต้องแก้/deploy โค้ดใหม่เลย
 *
 * response ส่งกลับแค่ questionIds ของแต่ละภารกิจ (ไม่ส่งเนื้อคำถาม/ตัวเลือก/เฉลย
 * ซ้ำ) — Frontend ใช้ questionIds ไป cross-reference กับ useQuestion().questions
 * ที่โหลด+cache ไว้อยู่แล้วจาก listQuestions() (ระบบเดิม) กันคำถามซ้ำสองที่/หลุด
 * ไม่ตรงกัน
 *
 * *** ไม่แตะไฟล์ service เดิมเลยสักไฟล์ *** — อ่านข้อมูลฐานผ่าน
 * getStationsSheet_()/getStationById_() (StationsService.gs) และอ่าน/บันทึกคำตอบ
 * ผ่าน getQuestionsSheet_()/getAllQuestionRows_()/rowToQuestion_()/
 * findQuestionById_()/judgeAndRecordAnswer_() (QuestionService.gs) ทั้งหมด —
 * เชื่อมเข้าระบบเดิมแค่จุดเดียวคือ router ใน Code.gs (listStationMissions/
 * verifyMissionQr มีอยู่แล้ว เพิ่มอีก 1 case ใหม่คือ submitMissionAnswers)
 *
 * คะแนน: SINGLE_QUESTION/MULTI_QUESTION มาจากชีต "Answers" (QuestionService.gs)
 * เพียงทางเดียว (ไม่มีคะแนนซ้ำซ้อนที่นี่) ส่วน QR_SCORE เท่านั้นที่มีชีตของตัวเอง
 * ("MissionCompletions" ด้านล่าง) เพราะไม่มีคำถามให้ผูกกับ Answers ได้ — ทั้งสอง
 * ก้อนถูกรวมเข้ากับคะแนนรวมของรอบที่ server-gas/RewardService.gs::computeRoundScore_/
 * getRoundScoresBreakdown_ คำนวณ (แก้เพิ่มผลรวมที่สามที่ไฟล์นั้นแล้ว)
 *
 * [แก้ไข] เดิมภารกิจ QR ไม่มีคะแนนตามสเปกเก่า — สเปกใหม่ระบุชัดว่า QR_SCORE ต้อง
 * ให้คะแนนจริง (ชื่อ type ก็บอกอยู่แล้ว) จึงเปลี่ยนพฤติกรรมนี้โดยตั้งใจ
 *
 * Mission QR แยกจาก Station QR เด็ดขาด: Station QR ใช้คอลัมน์ "QrToken" ของเดิม
 * (ผูกกับ action 'verifyStationQr' — ยืนยันตัวฐาน) ส่วน Mission QR (เฉพาะภารกิจ
 * type 'QR_SCORE') ใช้คอลัมน์ "MissionQrToken" คนละค่ากันเสมอต่อให้เป็นฐานเดียวกัน
 */

const MISSION_COMPLETIONS_SHEET_NAME = "MissionCompletions";
const MISSION_COMPLETIONS_HEADERS = [
  "CompletionId",
  "RoundId",
  "UserId",
  "StationId",
  "MissionId",
  "PointsEarned",
  "CompletedAt",
];

function getMissionCompletionsSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(MISSION_COMPLETIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(MISSION_COMPLETIONS_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(MISSION_COMPLETIONS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getAllMissionCompletionRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet
    .getRange(2, 1, lastRow - 1, MISSION_COMPLETIONS_HEADERS.length)
    .getValues();
}

function rowToMissionCompletion_(row) {
  return {
    completionId: normalize_(row[0]),
    roundId: normalize_(row[1]),
    userId: normalize_(row[2]),
    stationId: normalize_(row[3]),
    missionId: normalize_(row[4]),
    pointsEarned: Number(row[5]) || 0,
    completedAt: normalize_(row[6]),
  };
}

/** หา completion เดิมของ (roundId+userId+missionId) นี้ — คู่ขนานกับ
 * findExistingAnswerRow_ ของ QuestionService.gs ทุกประการ (หัวใจของกติกา
 * "ทำภารกิจ QR ได้คะแนนครั้งเดียวต่อรอบเท่านั้น") */
function findExistingMissionCompletion_(rows, roundId, userId, missionId) {
  for (let i = 0; i < rows.length; i++) {
    const c = rowToMissionCompletion_(rows[i]);
    if (
      c.roundId === roundId &&
      c.userId === userId &&
      c.missionId === missionId
    ) {
      return c;
    }
  }
  return null;
}

/** สร้าง missionId แบบ deterministic จาก stationId+key — key เป็นได้ทั้ง
 * MissionKey ของกลุ่มคำถาม (SINGLE_QUESTION/MULTI_QUESTION — ดู
 * QuestionService.gs::rowToQuestion_) หรือคำว่า "qr" คงที่ (QR_SCORE) — ใช้ทั้ง
 * ที่นี่และ QuestionService.gs เพื่อการันตีว่าเทียบกันตรงเสมอ โดยไม่ต้อง persist
 * ไว้ที่ไหนเลย (คำนวณสดได้ทุกครั้ง) */
function buildMissionId_(stationId, key) {
  return stationId + "-" + key;
}

/** จัดกลุ่มคำถาม active ของฐานนี้ตาม MissionKey แล้วคืนเป็น array ของกลุ่ม —
 * เรียงกลุ่มตาม order น้อยที่สุดในกลุ่มก่อน-หลัง (ไม่ใช้ MissionKey มาเรียงเอง
 * เพราะเป็นแค่ป้ายกำกับกลุ่ม ไม่ได้มีความหมายเรื่องลำดับการแสดงผล) */
function groupStationQuestionsByMission_(stationId) {
  const rows = getAllQuestionRows_(getQuestionsSheet_());
  const groups = {};
  const groupOrder = [];
  for (let i = 0; i < rows.length; i++) {
    const q = rowToQuestion_(rows[i]);
    if (!q.id || q.stationId !== stationId || !q.active) continue;
    if (!groups[q.missionKey]) {
      groups[q.missionKey] = [];
      groupOrder.push(q.missionKey);
    }
    groups[q.missionKey].push(q);
  }
  return groupOrder
    .map(function (key) {
      const questions = groups[key].slice().sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
      return { missionKey: key, questions: questions };
    })
    .sort(function (a, b) {
      const aOrder = Math.min.apply(
        null,
        a.questions.map(function (q) {
          return q.order || 0;
        }),
      );
      const bOrder = Math.min.apply(
        null,
        b.questions.map(function (q) {
          return q.order || 0;
        }),
      );
      return aOrder - bOrder;
    });
}

/** ภารกิจ 1 กลุ่มคำถาม -> SINGLE_QUESTION (1 คำถาม) หรือ MULTI_QUESTION (2+) —
 * ไม่ส่งเนื้อคำถาม/ตัวเลือก/เฉลยมาด้วย (ดูหัวไฟล์) มีแค่ questionIds ให้ Frontend
 * ไป cross-reference กับ useQuestion().questions ที่ cache ไว้แล้วเอง */
function buildQuestionMission_(station, group) {
  const questions = group.questions;
  const isSingle = questions.length === 1;
  const totalPoints = questions.reduce(function (sum, q) {
    return sum + q.points;
  }, 0);
  const minOrder = Math.min.apply(
    null,
    questions.map(function (q) {
      return q.order || 0;
    }),
  );
  return {
    id: buildMissionId_(station.id, group.missionKey),
    stationId: station.id,
    order: minOrder,
    type: isSingle ? "SINGLE_QUESTION" : "MULTI_QUESTION",
    title: isSingle ? "ตอบคำถาม" : "ตอบคำถาม " + questions.length + " ข้อ",
    description: questions[0].mission || "ตอบคำถามเกี่ยวกับฐานนี้",
    points: totalPoints,
    active: true,
    questionIds: questions.map(function (q) {
      return q.id;
    }),
  };
}

/** ภารกิจสแกน QR — เสมอ 1 อันต่อฐาน (ถ้ามี MissionQrToken) อยู่ท้ายสุดเสมอ
 * (order = ต่อจากภารกิจคำถามอันสุดท้าย) */
function buildQrMission_(station, order) {
  return {
    id: buildMissionId_(station.id, "qr"),
    stationId: station.id,
    order: order,
    type: "QR_SCORE",
    title: "สแกน QR",
    description: "ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ",
    points: station.missionQrPoints || 0,
    active: true,
  };
}

/**
 * action 'listStationMissions' — คืนภารกิจทั้งหมดของฐานที่ระบุ (ไม่เขียนข้อมูล)
 * Payload: { stationId, roundId?, userId? }
 *
 * ตรวจสอบว่า stationId มีอยู่จริงในชีต Stations ก่อนเสมอ (ไม่เชื่อค่าจาก Frontend
 * ตรง ๆ) — ไม่พบ/ฐานปิดใช้งานอยู่ -> success:false (เหมือน actionVerifyStationQr_)
 *
 * roundId+userId ส่งมาด้วย -> แนบ completed/pointsEarned ต่อภารกิจให้เลย (เช็ค
 * จากชีต Answers สำหรับภารกิจคำถาม, ชีต MissionCompletions สำหรับภารกิจ QR — ทั้ง
 * สองอย่างนี้คือความจริงจาก Backend เท่านั้น ไม่เชื่อสถานะที่ Client อ้างมาเลย)
 * ไม่ส่งมา -> ทุกภารกิจได้ completed:false เสมอ
 */
function actionListStationMissions_(payload) {
  const stationId = normalize_(payload && payload.stationId);
  if (!stationId) {
    return { success: false, error: "stationId จำเป็นต้องส่งมา" };
  }

  const sheet = getStationsSheet_();
  const station = getStationById_(sheet, stationId);
  if (!station) {
    return { success: false, error: "ไม่พบฐานตาม stationId ที่ระบุ" };
  }
  if (!station.active) {
    return { success: false, error: "ฐานนี้ปิดใช้งานอยู่ในขณะนี้" };
  }

  const groups = groupStationQuestionsByMission_(station.id);
  const missions = groups.map(function (group) {
    return buildQuestionMission_(station, group);
  });
  if (station.missionQrToken) {
    const lastOrder = missions.length ? missions[missions.length - 1].order : 0;
    missions.push(buildQrMission_(station, lastOrder + 1));
  }

  const roundId = normalize_(payload.roundId);
  const userId = normalize_(payload.userId);
  if (roundId && userId) {
    const answerRows = getAllAnswerRows_(getAnswersSheet_());
    const completionRows = getAllMissionCompletionRows_(
      getMissionCompletionsSheet_(),
    );
    for (let i = 0; i < missions.length; i++) {
      const mission = missions[i];
      if (mission.type === "QR_SCORE") {
        const completion = findExistingMissionCompletion_(
          completionRows,
          roundId,
          userId,
          mission.id,
        );
        mission.completed = !!completion;
        mission.pointsEarned = completion ? completion.pointsEarned : 0;
      } else {
        let pointsEarned = 0;
        let answeredCount = 0;
        for (let j = 0; j < mission.questionIds.length; j++) {
          const existing = findExistingAnswerRow_(
            answerRows,
            roundId,
            userId,
            mission.questionIds[j],
          );
          if (existing) {
            answeredCount++;
            pointsEarned += existing.answer.pointsEarned;
          }
        }
        mission.completed = answeredCount === mission.questionIds.length;
        mission.pointsEarned = pointsEarned;
      }
    }
  } else {
    missions.forEach(function (mission) {
      mission.completed = false;
      mission.pointsEarned = 0;
    });
  }

  return { success: true, stationId: station.id, missions: missions };
}

/**
 * action 'verifyMissionQr' — ตรวจสอบ QR ของภารกิจ "สแกน QR ภายในฐาน" (คนละ QR กับ
 * Station QR ของ verifyStationQr เด็ดขาด — ดูหัวไฟล์) ตรวจสอบผ่านแล้วบันทึก +
 * ให้คะแนนจริง (ครั้งแรกต่อ roundId+userId+missionId เท่านั้น — เรียกซ้ำคืนผลเดิม
 * ทันที ไม่บวกคะแนนซ้ำ)
 *
 * Payload: { qrToken, stationId, missionId, roundId, userId, firstName }
 *
 * ตรวจตามลำดับ (ไม่เชื่อค่าจาก Frontend ตรง ๆ สักจุด):
 *   1) มี qrToken/stationId/missionId/roundId/userId ครบหรือไม่ (roundId/userId
 *      เพิ่มใหม่ — จำเป็นเสมอตอนนี้เพราะต้องบันทึก+ให้คะแนนจริงแล้ว ต่างจากเดิมที่
 *      แค่ตรวจแล้วตอบเฉย ๆ ไม่ต้องรู้ว่าใคร/รอบไหน)
 *   2) stationId มีฐานอยู่จริงหรือไม่ + ฐาน active อยู่หรือไม่
 *   3) missionId ที่ส่งมาตรงกับภารกิจ 'qr' ของฐานนี้จริงหรือไม่ (กัน missionId ของ
 *      ฐานอื่น/ของภารกิจคำถามปนมา)
 *   4) qrToken ตรงกับ MissionQrToken ที่บันทึกไว้ของฐานนี้หรือไม่ (ไม่ใช่
 *      Stations.qrToken เด็ดขาด)
 *   5) เคยผ่านภารกิจนี้ในรอบนี้ไปแล้วหรือยัง (idempotent)
 */
function actionVerifyMissionQr_(payload) {
  const stationId = normalize_(payload && payload.stationId);
  const missionId = normalize_(payload && payload.missionId);
  const qrToken = normalize_(payload && payload.qrToken);
  const roundId = normalize_(payload && payload.roundId);
  const userId = normalize_(payload && payload.userId);

  if (!stationId || !missionId || !qrToken || !roundId || !userId) {
    return {
      success: false,
      error:
        "qrToken, stationId, missionId, roundId และ userId จำเป็นต้องส่งมาทั้งหมด",
    };
  }

  const sheet = getStationsSheet_();
  const station = getStationById_(sheet, stationId);
  if (!station) {
    return { success: false, error: "ไม่พบฐานตาม stationId ที่ระบุ" };
  }
  if (!station.active) {
    return { success: false, error: "ฐานนี้ปิดใช้งานอยู่ในขณะนี้" };
  }

  const expectedMissionId = buildMissionId_(station.id, "qr");
  if (missionId !== expectedMissionId) {
    return {
      success: false,
      error: "missionId นี้ไม่ใช่ภารกิจสแกน QR ของฐานนี้",
    };
  }

  if (
    !station.missionQrToken ||
    qrToken !== normalize_(station.missionQrToken)
  ) {
    return {
      success: false,
      error: "QR ภารกิจนี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ",
    };
  }

  const completionsSheet = getMissionCompletionsSheet_();
  const completionRows = getAllMissionCompletionRows_(completionsSheet);
  const existing = findExistingMissionCompletion_(
    completionRows,
    roundId,
    userId,
    missionId,
  );
  if (existing) {
    return {
      success: true,
      stationId: station.id,
      missionId: missionId,
      completed: true,
      pointsEarned: existing.pointsEarned,
      alreadyCompleted: true,
    };
  }

  const points = station.missionQrPoints || 0;
  const now = bangkokNow_();
  const completionId =
    "MC-" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  completionsSheet.appendRow([
    completionId,
    roundId,
    userId,
    station.id,
    missionId,
    points,
    now,
  ]);

  if (points > 0) {
    upsertScore_(
      getScoreSheet_(),
      userId,
      normalize_(payload.firstName),
      points,
      0,
      now,
    );
  }

  return {
    success: true,
    stationId: station.id,
    missionId: missionId,
    completed: true,
    pointsEarned: points,
    alreadyCompleted: false,
  };
}

/**
 * action 'submitMissionAnswers' — ส่งคำตอบของภารกิจ MULTI_QUESTION (หลายคำถาม
 * พร้อมกัน) ครั้งเดียว — ใช้ judgeAndRecordAnswer_() ของ QuestionService.gs ต่อ
 * คำถาม (ตัวเดียวกับที่ actionSubmitAnswer_ ใช้ ไม่ซ้ำ logic กัน) แต่ละคำถามยัง
 * idempotent ด้วย roundId+userId+questionId เหมือนเดิมทุกประการ (ตอบซ้ำข้อที่เคย
 * ตอบแล้ว -> คืนผลเดิม ไม่บวกคะแนนซ้ำ) — ใช้ได้กับภารกิจ SINGLE_QUESTION เช่นกัน
 * (answers ยาว 1 ข้อ) แม้ปกติฝั่ง Frontend จะใช้ submitAnswer เดิมสำหรับกรณีนั้น
 *
 * Payload: { userId, firstName, roundId, stationId, missionId,
 *            answers: [{ questionId, answer, clientId? }] }
 *
 * missionId ต้องตรงกับ missionId ที่คำนวณได้จริงของทุก questionId ที่ส่งมา (กัน
 * ยิงคำตอบของภารกิจอื่น/ฐานอื่นมาปนภารกิจนี้ — เทียบกับ actionVerifyMissionQr_'s
 * expectedMissionId check ด้านบน)
 */
function actionSubmitMissionAnswers_(payload) {
  if (!payload || !payload.userId) {
    return { success: false, error: "userId จำเป็นต้องส่งมา" };
  }
  if (!payload.stationId || !payload.missionId) {
    return { success: false, error: "stationId และ missionId จำเป็นต้องส่งมา" };
  }
  if (!payload.answers || !payload.answers.length) {
    return { success: false, error: "answers จำเป็นต้องส่งมาอย่างน้อย 1 ข้อ" };
  }

  const userId = normalize_(payload.userId);
  const firstName = normalize_(payload.firstName);
  const roundId = normalize_(payload.roundId);
  const stationId = normalize_(payload.stationId);
  const missionId = normalize_(payload.missionId);

  const perQuestion = [];
  let correctCount = 0;
  let totalPoints = 0;

  for (let i = 0; i < payload.answers.length; i++) {
    const item = payload.answers[i] || {};
    const questionId = normalize_(item.questionId);
    const question = questionId ? findQuestionById_(questionId) : null;
    if (!question) {
      perQuestion.push({
        questionId: questionId,
        error: "ไม่พบคำถามนี้ในชีต Questions",
      });
      continue;
    }
    if (question.stationId !== stationId) {
      perQuestion.push({
        questionId: questionId,
        error: "คำถามนี้ไม่ใช่ของฐานที่ระบุ",
      });
      continue;
    }
    const expectedMissionId = buildMissionId_(
      question.stationId,
      question.missionKey,
    );
    if (expectedMissionId !== missionId) {
      perQuestion.push({
        questionId: questionId,
        error: "คำถามนี้ไม่ใช่ของภารกิจที่ระบุ",
      });
      continue;
    }

    const result = judgeAndRecordAnswer_(question, {
      roundId: roundId,
      userId: userId,
      firstName: firstName,
      answer: normalize_(item.answer),
      clientId: normalize_(item.clientId),
    });
    perQuestion.push({
      questionId: question.id,
      isCorrect: result.isCorrect,
      pointsEarned: result.pointsEarned,
      alreadyAnswered: result.alreadyAnswered,
    });
    if (result.isCorrect) correctCount++;
    totalPoints += result.pointsEarned;
  }

  return {
    success: true,
    missionId: missionId,
    correctCount: correctCount,
    totalCount: payload.answers.length,
    totalPoints: totalPoints,
    perQuestion: perQuestion,
  };
}
