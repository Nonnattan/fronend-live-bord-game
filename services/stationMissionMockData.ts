/**
 * services/stationMissionMockData.ts
 * ---------------------------------------------------------------------------
 * โจทย์ Mock ของภารกิจ "ดมกลิ่น" + "ตอบคำถาม" ประจำแต่ละฐาน (Flow ปลดล็อคฐาน +
 * ภารกิจ เวอร์ชัน Mockup — ดู composables/useStationQuest.ts) คนละชุดกับ
 * services/questionMockData.ts เดิม (ระบบคำถามจริงที่ผูกกับคะแนน Backend อยู่แล้ว
 * ผ่าน useQuestion.ts) ห้ามนำมาปนกัน — ไฟล์นี้ใช้แสดงผล UI ทดลองเท่านั้น ยังไม่มี
 * การดึงจาก Backend จริง (ภายหลังค่อยเปลี่ยนมาเรียก listQuestions-สไตล์เดียวกัน
 * แล้ว map เข้า MissionMockQuestion shape นี้แทนได้)
 */

import type { StationType } from '~/composables/useAdventure'
import type { MissionMockQuestion } from '~/types/stationMission'

function choice(id: string, label: string) {
  return { id, label }
}

export const MOCK_MISSION_QUESTIONS: MissionMockQuestion[] = [
  // --------------------------------------------------------------- ฐานข้าวโพด
  {
    questionId: 'corn-smell-1',
    stationId: 'corn',
    kind: 'smell',
    answerType: 'choice',
    text: 'กลิ่นที่คุณได้จากภารกิจนี้ใกล้เคียงกับอะไรที่สุด?',
    choices: [choice('grass', 'หญ้า'), choice('milk', 'นม'), choice('corn', 'ข้าวโพด'), choice('soil', 'ดิน')],
    correctChoiceId: 'corn',
    points: 10,
  },
  {
    questionId: 'corn-question-1',
    stationId: 'corn',
    kind: 'question',
    answerType: 'choice',
    text: 'ข้าวโพดที่ปลูกในฟาร์มส่วนใหญ่ใช้เป็นวัตถุดิบสำหรับอะไร?',
    choices: [
      choice('feed', 'อาหารสัตว์'),
      choice('oil', 'น้ำมันเครื่อง'),
      choice('silk', 'ผ้าไหม'),
      choice('cement', 'ปูนซีเมนต์'),
    ],
    correctChoiceId: 'feed',
    points: 10,
  },
  // -------------------------------------------------------------------- ฐานวัว
  {
    questionId: 'cow-smell-1',
    stationId: 'cow',
    kind: 'smell',
    answerType: 'choice',
    text: 'กลิ่นที่คุณได้จากภารกิจนี้ใกล้เคียงกับอะไรที่สุด?',
    choices: [choice('hay', 'หญ้าแห้ง'), choice('manure', 'มูลวัว'), choice('milk', 'นมสด'), choice('mud', 'ดินโคลน')],
    correctChoiceId: 'hay',
    points: 10,
  },
  {
    questionId: 'cow-question-1',
    stationId: 'cow',
    kind: 'question',
    answerType: 'choice',
    text: 'วัวนมให้ผลผลิตหลักคืออะไร?',
    choices: [choice('milk', 'นม'), choice('egg', 'ไข่'), choice('wool', 'ขนสัตว์'), choice('honey', 'น้ำผึ้ง')],
    correctChoiceId: 'milk',
    points: 10,
  },
  // -------------------------------------------------------------------- ฐานดิน
  {
    questionId: 'soil-smell-1',
    stationId: 'soil',
    kind: 'smell',
    answerType: 'choice',
    text: 'กลิ่นที่คุณได้จากภารกิจนี้ใกล้เคียงกับอะไรที่สุด?',
    choices: [
      choice('wet-soil', 'ดินชื้น'),
      choice('compost', 'ปุ๋ยหมัก'),
      choice('corn', 'ข้าวโพด'),
      choice('milk', 'นมสด'),
    ],
    correctChoiceId: 'wet-soil',
    points: 10,
  },
  {
    questionId: 'soil-question-1',
    stationId: 'soil',
    kind: 'question',
    answerType: 'choice',
    text: 'ดินที่ดีต่อการเพาะปลูกควรมีลักษณะอย่างไร?',
    choices: [
      choice('loose', 'ร่วนซุย ระบายน้ำดี'),
      choice('rock', 'แข็งเป็นก้อนหิน'),
      choice('salty', 'เค็มจัด'),
      choice('dry', 'แห้งแตกระแหง'),
    ],
    correctChoiceId: 'loose',
    points: 10,
  },
  // --------------------------------------------------------------------- ฐานนม
  {
    questionId: 'milk-smell-1',
    stationId: 'milk',
    kind: 'smell',
    answerType: 'choice',
    text: 'กลิ่นที่คุณได้จากภารกิจนี้ใกล้เคียงกับอะไรที่สุด?',
    choices: [choice('milk', 'นมสด'), choice('hay', 'หญ้าแห้ง'), choice('soil', 'ดิน'), choice('corn', 'ข้าวโพด')],
    correctChoiceId: 'milk',
    points: 10,
  },
  {
    questionId: 'milk-question-1',
    stationId: 'milk',
    kind: 'question',
    answerType: 'choice',
    text: 'นมโคสดอุดมไปด้วยสารอาหารชนิดใดมากที่สุด?',
    choices: [
      choice('calcium', 'แคลเซียม'),
      choice('vitc', 'วิตามินซี'),
      choice('fiber', 'ไฟเบอร์'),
      choice('sodium', 'โซเดียม'),
    ],
    correctChoiceId: 'calcium',
    points: 10,
  },
]

export function getMissionQuestion(
  stationId: StationType,
  kind: Extract<MissionMockQuestion['kind'], 'smell' | 'question'>,
): MissionMockQuestion | undefined {
  return MOCK_MISSION_QUESTIONS.find((q) => q.stationId === stationId && q.kind === kind)
}
