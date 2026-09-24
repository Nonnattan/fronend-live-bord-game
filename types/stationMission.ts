/**
 * types/stationMission.ts
 * ---------------------------------------------------------------------------
 * [แก้ไข] เดิมไฟล์นี้เก็บ Type ของระบบภารกิจ Mock ทั้งหมด (MissionKind/
 * StationMissionMap/MissionState/MissionMockQuestion/MissionAnswerResult) —
 * ย้ายไปเป็นระบบจริงที่ types/mission.ts (StationMission แบบ Array ไม่ตายตัว
 * ผูกกับ Backend เต็มรูปแบบ) แล้ว ไฟล์นี้เหลือแค่ Type ของ "สิทธิ์เข้าฐาน" ที่
 * composables/useStationQuest.ts ยังดูแลอยู่ (คนละความรับผิดชอบกับเนื้อหา/คะแนน
 * ภารกิจ) — ดู useStationQuest.ts หัวไฟล์สำหรับรายละเอียดการแบ่งความรับผิดชอบ
 */

import type { StationType } from '~/composables/useAdventure'

/**
 * สถานะการ์ดฐานที่หน้า "เลือกฐาน" (pages/stations.vue) ต้องใช้แสดงผล — progress
 * (จำนวนภารกิจ) กับ "สิทธิ์เข้าฐานตอนนี้" เป็นคนละแกนกัน (ฐานที่เคยเล่นค้างไว้
 * บางส่วนแล้วสิทธิ์หมดไปแล้ว ยังต้องเห็น Progress เดิมอยู่ แต่กดเข้าไม่ได้จนกว่า
 * จะสแกนใหม่)
 */
export interface StationCardState {
  completedMissions: number
  /** จำนวนภารกิจทั้งหมดของฐานนี้ — 0 ถ้ายังไม่เคยเข้าฐานนี้เลยในรอบนี้ (ยังไม่รู้
   * จำนวนจริงจาก Backend) Component ต้องซ่อน Progress ตัวเลขไปก่อนในกรณีนั้น
   * (ห้าม hardcode เป็นค่าคงที่แทน — ดู types/mission.ts) */
  totalMissions: number
  isCompleted: boolean
  /** true = กดเข้าได้ตอนนี้ (ทำครบแล้ว หรือเพิ่งได้สิทธิ์จากการสแกนล่าสุด) */
  isAccessible: boolean
}

/** โครง LocalStorage ที่ persist ไว้ — ผูกกับ roundKey เสมอ กันรอบเก่าปนรอบใหม่ */
export interface StationQuestProgress {
  roundKey: string
  /** สิทธิ์เข้าฐาน "จากการสแกนล่าสุด" เท่านั้น (ค่าเดียว ไม่ใช่ Array) — ถูกเคลียร์
   * เป็น null ทันทีที่ผู้เล่นกดเข้าฐานนั้น (ดู consumeScanAccess()) ต้องสแกน QR
   * ฐานนั้นใหม่อีกครั้งถึงจะได้สิทธิ์กลับมา (ไม่นับฐานที่ทำภารกิจครบแล้ว — ฐานนั้น
   * เข้าไปดูซ้ำได้เสมอโดยไม่ต้องมีสิทธิ์นี้) */
  currentScanStationId: StationType | null
  /** ฐานที่ผู้เล่นเลือกในหน้าแบบประเมิน (pages/evaluation.vue) — null จนกว่าจะเลือก */
  selectedFavoriteStationId: StationType | null
  /** กด "จบเกม" ที่ฐานนมแล้ว — true = ไปหน้าแบบประเมินแล้ว ไม่กระทบภารกิจ/คะแนน
   * ใด ๆ ทั้งสิ้น (ดู markGameCompleted() ใน composables/useStationQuest.ts)
   * รีเซ็ตเป็น false เองอัตโนมัติเมื่อ Round เปลี่ยน */
  gameCompleted: boolean
}
