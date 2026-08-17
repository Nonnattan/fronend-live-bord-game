/**
 * services/questionMockData.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — คำถามตัวอย่าง (Mock) สำหรับทดสอบระบบ "ภารกิจ + คำถามประจำฐาน"
 * ก่อนที่ชีต "Questions" ฝั่ง Google Apps Script จะมีข้อมูลจริง
 *
 * *** ไฟล์นี้เป็นของชั่วคราวสำหรับช่วงพัฒนาเท่านั้น *** (แนวทางเดียวกับ
 * services/photoQuestMockData.ts ที่ทำไว้ก่อนหน้า) — composables/useQuestion.ts
 * จะใช้ข้อมูลชุดนี้ "ก็ต่อเมื่อ" โหลดจาก Backend แล้วไม่ได้คำถามจริงมาเลยสักข้อ
 * (API ล่ม / ยังไม่ deploy / ชีตว่าง) เท่านั้น — ถ้าชีตมีข้อมูลแล้ว ข้อมูลจริงชนะเสมอ
 *
 * วิธีเอาออกเมื่อชีตพร้อมใช้งานจริง: ลบไฟล์นี้ + ลบบล็อก `applyMockFallback()`
 * ใน useQuestion.ts (มีจุดเดียว มีคอมเมนต์กำกับไว้) ไม่มีที่อื่นอ้างถึงอีก
 *
 * ค่าที่ใส่ในแต่ละแถวตรงกับคอลัมน์ของชีตจริงทุกช่อง (Id | StationId | Mission |
 * Question | AnswerType | Choices | CorrectAnswer | Points | Active |
 * Explanation | Order) จึงคัดลอกไปวางในชีตเพื่อใช้งานจริงได้ทันที
 *
 * stationId ใช้ id ฝั่งกระดานเกม (corn/cow/soil/milk — ดู
 * composables/useAdventure.ts::MOCK_ADVENTURE_STATIONS) ไม่ใช่ id ของ Admin
 * ในชีต "Stations" (ฐานบนกระดานมีแค่ 4 ฐานตายตัวตามสเปกเดิม)
 */

import type { StationQuestion } from '~/types/question'

export const MOCK_STATION_QUESTIONS: StationQuestion[] = [
  {
    id: 'Q-MOCK-CORN',
    stationId: 'corn',
    mission: 'ตามหาความหอมของข้าวโพดเผ่านี้ — สูดกลิ่นแล้วสังเกตให้ดี',
    question: 'ข้าวโพดที่สุกพร้อมเก็บเกี่ยว เปลือกเมล็ดจะมีสีอะไร?',
    answerType: 'choice',
    choices: ['สีเขียวอ่อน', 'สีเหลืองทอง', 'สีขาว', 'สีน้ำตาลเข้ม'],
    correctAnswer: 'สีเหลืองทอง',
    points: 50,
    active: true,
    explanation: 'ข้าวโพดสุกเต็มที่เมล็ดจะเปลี่ยนเป็นสีเหลืองทองและแข็งขึ้น',
    order: 1,
  },
  {
    id: 'Q-MOCK-COW',
    stationId: 'cow',
    mission: 'สังเกตวัวในฟาร์มแล้วนับจำนวนกระเพาะของมัน',
    question: 'วัวมีกระเพาะทั้งหมดกี่ห้อง?',
    answerType: 'number',
    choices: [],
    correctAnswer: '4',
    points: 50,
    active: true,
    explanation: 'วัวเป็นสัตว์เคี้ยวเอื้อง มีกระเพาะ 4 ห้อง',
    order: 1,
  },
  {
    id: 'Q-MOCK-SOIL',
    stationId: 'soil',
    mission: 'ลองสัมผัสดินที่เผ่านี้ดูว่าเหมาะกับการปลูกพืชแบบไหน',
    question: 'ดินชนิดใดที่ระบายน้ำดีและเหมาะกับการปลูกผักสวนครัวที่สุด?',
    answerType: 'choice',
    choices: ['ดินเหนียว', 'ดินร่วน', 'ดินทราย', 'ดินลูกรัง'],
    correctAnswer: 'ดินร่วน',
    points: 50,
    active: true,
    explanation: 'ดินร่วนมีการระบายน้ำและอากาศดี อุ้มน้ำและธาตุอาหารได้พอเหมาะ',
    order: 1,
  },
  {
    id: 'Q-MOCK-MILK',
    stationId: 'milk',
    mission: 'ก่อนเดินทางออกจากเผ่านม ลองทบทวนความรู้เรื่องนมที่ได้เรียนมา',
    question: 'นมสดพาสเจอร์ไรส์ต้องเก็บรักษาด้วยวิธีใด?',
    answerType: 'choice',
    choices: ['แช่เย็น', 'แช่แข็ง', 'วางอุณหภูมิห้อง', 'ตากแดด'],
    correctAnswer: 'แช่เย็น',
    points: 50,
    active: true,
    explanation: 'นมพาสเจอร์ไรส์ต้องแช่เย็นตลอดเวลาเพื่อชะลอการเจริญของเชื้อจุลินทรีย์',
    order: 1,
  },
]
