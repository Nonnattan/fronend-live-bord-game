/**
 * types/stationMission.ts
 * ---------------------------------------------------------------------------
 * Type ของ Flow "ปลดล็อคฐาน + ภารกิจ" เวอร์ชัน Mockup (Frontend UX/State ล้วน ๆ
 * ยังไม่เขียนคะแนนจริงลง Backend) — ใช้โดย composables/useStationQuest.ts +
 * components/station/* + pages/stations.vue + pages/station/[stationId].vue +
 * pages/evaluation.vue
 *
 * แยกขาดจาก types/question.ts โดยตั้งใจ (นั่นคือระบบคำถามจริงต่อฐานที่ผูกกับ
 * useQuestion.ts/submitAnswer() และมีคะแนนจริงอยู่แล้ว) ห้ามนำมาปนกัน — ไฟล์นี้
 * ออกแบบ field ให้ใกล้เคียงของจริงที่สุด (questionId/stationId/answerType/
 * choices/points) เพื่อให้ภายหลังเปลี่ยนมาผูกกับ Backend จริงได้โดยไม่ต้องรื้อ
 * UI/Component ใหม่ทั้งหมด
 *
 * [แก้ไข] กติกาการเข้าฐานเปลี่ยนจาก "ปลดล็อคแล้วค้างตลอดไป" (unlockedStations[])
 * เป็น "สิทธิ์เข้าฐานแบบใช้ครั้งเดียวจากการสแกนล่าสุด" (currentScanStationId) —
 * ดูเหตุผลเต็ม ๆ ที่ composables/useStationQuest.ts
 */

import type { StationType } from '~/composables/useAdventure'

/** ทุกฐานมี 3 ภารกิจเสมอ: ดมกลิ่น / ตอบคำถาม / สแกน QR */
export type MissionKind = 'smell' | 'question' | 'qr'

/** ตอนนี้รองรับแบบปรนัยอย่างเดียว (ขยายเป็น text/number ทีหลังได้ตาม AnswerType จริง) */
export type MissionAnswerType = 'choice'

export interface MissionChoice {
  id: string
  label: string
}

/** โจทย์ของภารกิจ "ดมกลิ่น"/"ตอบคำถาม" (Mock) — คนละก้อนกับ StationQuestion จริง */
export interface MissionMockQuestion {
  questionId: string
  stationId: StationType
  kind: Extract<MissionKind, 'smell' | 'question'>
  answerType: MissionAnswerType
  text: string
  choices: MissionChoice[]
  correctChoiceId: string
  points: number
}

/** ผลตอบภารกิจ "ดมกลิ่น"/"ตอบคำถาม" 1 ครั้ง — ตอบได้ครั้งเดียวต่อฐาน/ภารกิจ */
export interface MissionAnswerResult {
  choiceId: string
  isCorrect: boolean
  pointsEarned: number
  /** กุญแจของรอบที่ตอบ ณ ตอนนั้น (ดู useStationQuest.ts::effectiveRoundKey) —
   * ไว้เผื่อภายหลังต้องผูกกับ submitAnswer() ที่ต้องการ roundId จริง */
  roundKey: string | null
  answeredAt: number
}

/** สถานะของภารกิจ 1 ใบ — ใช้ร่วมกันทั้ง 3 ชนิด (ภารกิจ qr ไม่มีคำตอบ ใช้แค่ completed) */
export interface MissionState {
  completed: boolean
  answer: MissionAnswerResult | null
}

export type StationMissionMap = Record<MissionKind, MissionState>

/**
 * สถานะการ์ดฐานที่หน้า "เลือกฐาน" (pages/stations.vue) ต้องใช้แสดงผล — progress
 * (จำนวนภารกิจ) กับ "สิทธิ์เข้าฐานตอนนี้" เป็นคนละแกนกัน (ฐานที่เคยเล่นค้างไว้
 * 2/3 แล้วสิทธิ์หมดไปแล้ว ยังต้องเห็น 2/3 อยู่ แต่กดเข้าไม่ได้จนกว่าจะสแกนใหม่)
 */
export interface StationCardState {
  completedMissions: number
  isCompleted: boolean
  /** true = กดเข้าได้ตอนนี้ (ทำครบแล้ว หรือเพิ่งได้สิทธิ์จากการสแกนล่าสุด) */
  isAccessible: boolean
}

/** โครง LocalStorage ที่ persist ไว้ — ผูกกับ roundKey เสมอ กันรอบเก่าปนรอบใหม่ */
export interface StationQuestProgress {
  roundKey: string
  /** สิทธิ์เข้าฐาน "จากการสแกนล่าสุด" เท่านั้น (ค่าเดียว ไม่ใช่ Array) — ถูกเคลียร์
   * เป็น null ทันทีที่ผู้เล่นกดเข้าฐานนั้น (ดู consumeScanAccess()) ต้องสแกน QR
   * ฐานนั้นใหม่อีกครั้งถึงจะได้สิทธิ์กลับมา (ไม่นับฐานที่ completedMissions ครบ
   * 3 แล้ว — ฐานนั้นเข้าดูได้เสมอโดยไม่ต้องมีสิทธิ์นี้) */
  currentScanStationId: StationType | null
  missions: Partial<Record<StationType, StationMissionMap>>
  /** คะแนนทดลองฝั่งเครื่องอย่างเดียว (Mockup) — ยังไม่เขียนเข้า Score/Google Sheet */
  mockScore: number
  /** ฐานที่ผู้เล่นเลือกในหน้าแบบประเมิน (pages/evaluation.vue) — null จนกว่าจะเลือก */
  selectedFavoriteStationId: StationType | null
  /** กด "จบเกม" ที่ฐานนมแล้ว (ไม่ว่า Progress จะอยู่ 0/3-3/3 ก็ตาม) — true = ไปหน้า
   * แบบประเมินแล้ว ไม่กระทบ missions/mockScore ใด ๆ ทั้งสิ้น (ดู markGameCompleted()
   * ใน composables/useStationQuest.ts) รีเซ็ตเป็น false เองอัตโนมัติเมื่อ Round
   * เปลี่ยน (ส่วนหนึ่งของ createEmptyProgress() เหมือน field อื่นทุกตัว) */
  gameCompleted: boolean
}
