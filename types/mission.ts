/**
 * types/mission.ts
 * ---------------------------------------------------------------------------
 * Type ของ "ภารกิจของฐาน" เวอร์ชันจริง — ผูกกับ server-gas/MissionsService.gs
 * เต็มรูปแบบ (จำนวนภารกิจ/คะแนน/สถานะ completed มาจาก Backend เท่านั้น ไม่มี
 * Mock/การตัดสินคะแนนเองฝั่ง Client เลยสักจุด) แทนที่ระบบ Mock 3 ภารกิจตายตัวเดิม
 * ใน types/stationMission.ts (MissionKind/StationMissionMap ถูกลบไปแล้ว)
 *
 * เป็น Array เสมอ (StationMission[]) ไม่ใช่ Record ตายตัวตามจำนวนคีย์คงที่ — ฐาน
 * หนึ่งอาจมีภารกิจกี่ใบก็ได้ตามจำนวนกลุ่มคำถามจริงในชีต "Questions" + ภารกิจ
 * QR_SCORE เสมอ 1 ใบ (ถ้าฐานมี MissionQrToken) — Component ห้าม hardcode จำนวน/
 * ลำดับภารกิจ ต้อง map ตาม array ที่ได้จริงจาก listStationMissions เท่านั้น
 *
 * ไม่มีเนื้อคำถาม/ตัวเลือก/เฉลยอยู่ในนี้ (ดู questionIds ด้านล่าง) — Frontend ต้อง
 * cross-reference กับ useQuestion().questions ที่ cache ไว้แล้วจาก listQuestions()
 * (ระบบเดิม) กันคำถามซ้ำสองที่/หลุดไม่ตรงกัน
 */

export type MissionType = "SINGLE_QUESTION" | "MULTI_QUESTION" | "QR_SCORE";

/** ภารกิจ 1 ใบของฐานหนึ่ง */
export interface StationMission {
  /** deterministic จาก Backend เสมอ (รูปแบบ "<stationId>-<key>") */
  id: string;
  stationId: string;
  /** ลำดับการแสดงผล — เรียงตามนี้เสมอ (ภารกิจ QR_SCORE จะได้ค่ามากสุด อยู่ท้ายสุด) */
  order: number;
  type: MissionType;
  title: string;
  description: string;
  /** คะแนนเต็มของภารกิจนี้ — SINGLE_QUESTION/MULTI_QUESTION = รวมคะแนนคำถามใน
   * กลุ่ม, QR_SCORE = MissionQrPoints ของฐาน (Admin ปรับได้จากหน้า Admin) */
  points: number;
  active: boolean;
  /** ทำสำเร็จแล้วหรือยัง — มาจาก Backend เท่านั้น (เช็คจากชีต Answers สำหรับ
   * ภารกิจคำถาม, ชีต MissionCompletions สำหรับภารกิจ QR) undefined ถ้ายังไม่เคย
   * โหลดสถานะ (เรียก listStationMissions โดยไม่ส่ง roundId/userId มา) */
  completed: boolean;
  /** คะแนนที่ได้จริง (0 ถ้ายังไม่ทำ/ตอบผิดทั้งหมด) */
  pointsEarned: number;
  /** เฉพาะ SINGLE_QUESTION (ยาว 1)/MULTI_QUESTION (ยาว N) — เรียงตามลำดับที่ต้อง
   * ตอบ ไม่มีค่านี้สำหรับ QR_SCORE (ไม่มีคำถาม) */
  questionIds?: string[];
}

/** ผลลัพธ์ของ action 'submitMissionAnswers' — ใช้กับภารกิจ MULTI_QUESTION
 * (ตอบหลายคำถามพร้อมกันในคำขอเดียว) */
export interface MissionAnswersResult {
  missionId: string;
  correctCount: number;
  totalCount: number;
  totalPoints: number;
  perQuestion: Array<{
    questionId: string;
    isCorrect?: boolean;
    pointsEarned?: number;
    alreadyAnswered?: boolean;
    error?: string;
  }>;
}

/** ผลลัพธ์ของ action 'verifyMissionQr' — ใช้กับภารกิจ QR_SCORE */
export interface MissionQrResult {
  stationId: string;
  missionId: string;
  completed: boolean;
  pointsEarned: number;
  alreadyCompleted: boolean;
}
