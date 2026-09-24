/**
 * composables/useMemberApi.ts
 * ---------------------------------------------------------------------------
 * เรียก Google Apps Script Web App (REST API) ที่ผูกกับ Google Sheet เป็น
 * ฐานข้อมูลสมาชิก — รวม action: checkMember / register / login / updateMember /
 * loginByLine ตามสเปก และมีฟังก์ชัน syncMember() ที่ทำ flow หลักให้ครบข้อ 3-5:
 *   1) checkMember ด้วย firstName/lastName/phone
 *   2) พบ    -> login  (อัปเดต Last Login + ข้อมูล LINE ถ้ามี)
 *   3) ไม่พบ -> register (สร้าง Member ID ใหม่)
 *
 * loginByLine() เป็นฟังก์ชันแยกสำหรับ flow ใหม่: Login ด้วย LINE ต้องตรวจสอบ
 * lineUserId ก่อนเสมอ พบแล้ว Login ทันที ไม่ต้องผ่านฟอร์มสมัครสมาชิกซ้ำ
 * (ดู pages/index.vue -> resolveLineMember()) ฝั่ง backend (server-gas/Code.gs)
 * แก้ให้จับคู่สมาชิกเดิมด้วย lineUserId หรือเบอร์โทรศัพท์แทนการเทียบ
 * firstName+lastName+phone แบบตรงเป๊ะทั้ง 3 ค่า เพื่อแก้ปัญหาสร้างข้อมูลซ้ำ
 *
 * หมายเหตุ CORS: Google Apps Script Web App ไม่รองรับ CORS preflight (OPTIONS)
 * จึงต้องส่งแบบ "simple request" เท่านั้น -> ใช้ Content-Type:
 * "text/plain;charset=utf-8" แทน "application/json" (ฝั่ง Apps Script ยัง
 * JSON.parse(e.postData.contents) ได้ตามปกติ ไม่สนใจ header ที่ประกาศมา)
 */

import type { AuthData } from '~/types/auth'
import type { RewardStatus } from '~/types/reward'
import type { MissionAnswersResult, MissionQrResult, StationMission } from '~/types/mission'

/** โครงสร้างสมาชิกตามที่ Google Apps Script ส่งกลับมา (ตรงกับคอลัมน์ใน Sheet)
 * birthYear: null = ยังไม่มีข้อมูลในชีต — เป็นข้อความช่วงปีเกิด ค.ศ. ตรงตามที่ผู้ใช้
 * เลือกในหน้า Register เช่น "1996-2006" (ไม่ใช่อายุตัวเลขอีกต่อไป)
 * gender: '' = ยังไม่มีข้อมูลในชีต */
export interface MemberRecord {
  memberId: string
  firstName: string
  lastName: string
  phone: string
  lineUserId: string
  displayName: string
  pictureUrl: string
  registerDate: string
  lastLogin: string
  point: number
  totalVisit: number
  birthYear: string | null
  gender: string
}

export interface IdentityValues {
  firstName: string
  lastName: string
  phone: string
}

/** Birth Year/Gender — ไม่บังคับส่งมาทุกครั้ง (เช่น checkMember ไม่ต้องใช้) แต่ register/login
 * ควรส่งมาด้วยเสมอเพื่อให้บันทึกลง Google Sheet ครบตามสเปก
 * birthYear คือข้อความช่วงปีเกิด ค.ศ. ตรงตามตัวเลือกที่ผู้ใช้เลือก เช่น "1996-2006"
 * (ไม่ใช่อายุตัวเลข — ดู utils/profileSchema.ts -> birthYearRangeValueFor()) */
export interface DemographicValues {
  gender?: string
  birthYear?: string
}

interface CheckMemberResponse {
  success: boolean
  found?: boolean
  member?: MemberRecord
  error?: string
}

interface MemberActionResponse {
  success: boolean
  isNewMember?: boolean
  member?: MemberRecord
  error?: string
}

interface GetMemberResponse {
  success: boolean
  member?: MemberRecord
  error?: string
}

/** ผลลัพธ์ของ action 'loginByLine' — ตรวจสอบ lineUserId ก่อนเสมอตามสเปกใหม่ */
interface LoginByLineResponse {
  success: boolean
  found?: boolean
  member?: MemberRecord
  error?: string
}

/** 1 แถวประวัติการเข้าฐาน (ชีต "Journey" ฝั่ง server-gas)
 * roundId: รอบการเล่นที่บันทึกแถวนี้ (ดู server-gas/RoundService.gs + CheckinService.gs)
 * ใช้กันข้อมูลซ้ำฝั่ง backend เท่านั้น ไม่ได้ใช้แสดงผลในหน้า History ปัจจุบัน
 * firstName: ชื่อจริงจากฟอร์มโปรไฟล์ (profile.firstName) — ใช้แทน displayName (LINE
 * profile) เดิม เพราะผู้ใช้ที่ไม่ได้ Login ผ่าน LINE (Guest/กรอกฟอร์มเอง) ไม่มีค่า
 * displayName เลย แต่ firstName เป็นฟิลด์บังคับกรอกของทุกคนเสมอ */
export interface JourneyEntry {
  timestamp: string
  roundId?: string
  userId: string
  firstName: string
  stationId: string
  stationName: string
  point: number
  status: string
}

/** คะแนนสะสมของผู้เล่น 1 คน (ชีต "Score" ฝั่ง server-gas)
 * firstName: ดูหมายเหตุเดียวกับ JourneyEntry ด้านบน */
export interface ScoreEntry {
  userId: string
  firstName: string
  totalPoint: number
  totalStation: number
  updatedAt: string
}

/** ผลลัพธ์ของ action 'checkin' — สแกน QR ผ่านฐานสำเร็จ (ดู server-gas/CheckinService.gs)
 * alreadyVisited: true = เคยผ่านฐานนี้มาก่อนแล้ว (คนละเครื่อง/คนละรอบ Sync) ไม่มีการเขียนซ้ำ */
interface CheckinResponse {
  success: boolean
  alreadyVisited?: boolean
  journeyEntry?: JourneyEntry
  score?: ScoreEntry
  error?: string
}

interface GetJourneyResponse {
  success: boolean
  journey?: JourneyEntry[]
  error?: string
}

interface GetScoreResponse {
  success: boolean
  score?: ScoreEntry | null
  error?: string
}

/** สถานะการรับรางวัลของ 1 รอบการเล่น — ดู server-gas/RoundService.gs
 * (คอลัมน์ RewardStatus ในชีต "Round"):
 *   Pending   = เกมจบแล้ว แต่ยังไม่ได้รับรางวัล
 *   Claimed   = เจ้าหน้าที่ยืนยันว่าผู้เล่นได้รับรางวัลแล้ว (ดู pages/redeem.vue)
 *   Confirmed = ผู้เล่นกด OK ยืนยันแล้วที่หน้า pages/reward-received.vue ปิดรอบสมบูรณ์ */
export type RoundRewardStatus = 'Pending' | 'Claimed' | 'Confirmed'

/** 1 รอบการเล่น (ชีต "Round" ฝั่ง server-gas — ดู server-gas/RoundService.gs)
 * status: 'Started' (เริ่มรอบแล้ว ยังไม่จบ) / 'Ended' (จบรอบแล้ว) — คนละแกนกับ
 * rewardStatus ด้านบนโดยสิ้นเชิง ห้ามสับสน/ปนกัน
 * firstName: ดูหมายเหตุเดียวกับ JourneyEntry ด้านบน (types/useMemberApi.ts) */
export interface RoundEntry {
  roundId: string
  userId: string
  firstName: string
  startTime: string
  endTime: string | null
  status: string
  /** [ใหม่] ข้อมูลรอบเก่าที่ backend ยังไม่เคยเขียนคอลัมน์นี้ จะได้ค่า 'Pending'
   * เสมอ (backend เป็นคน default ให้ ไม่ใช่ frontend) — ไม่มีวันเป็น undefined */
  rewardStatus: RoundRewardStatus
}

/** Payload ที่ส่งไปกับ action 'roundStart' — roundId สร้างฝั่ง client (UUID) ครั้งเดียว
 * ต่อ 1 รอบ แล้วใช้ซ้ำตลอดทั้งรอบ (ดู composables/useRound.ts) */
export interface RoundStartPayload {
  roundId: string
  userId: string
  firstName?: string
}

interface RoundStartResponse {
  success: boolean
  alreadyStarted?: boolean
  round?: RoundEntry
  error?: string
}

interface RoundEndResponse {
  success: boolean
  alreadyEnded?: boolean
  round?: RoundEntry
  error?: string
}

interface GetRoundResponse {
  success: boolean
  round?: RoundEntry | null
  error?: string
}

/** [ใหม่] response ของ action 'confirmRound' — ดู server-gas/RoundService.gs::actionConfirmRound_ */
interface ConfirmRoundResponse {
  success: boolean
  alreadyConfirmed?: boolean
  round?: RoundEntry
  error?: string
}

/** คำตอบแบบประเมินหลังจบเกม (ชีต "Survey" ฝั่ง server-gas — ดู server-gas/SurveyService.gs)
 * ตอนนี้มี 1 ข้อ: favoriteStationRating (1-5, 5=มากที่สุด ... 1=น้อยที่สุด) —
 * ออกแบบให้เพิ่มข้อถัดไปได้ในอนาคตโดยไม่กระทบข้อเดิม */
export interface SurveyEntry {
  surveyId: string
  roundId: string
  userId: string
  firstName: string
  favoriteStationRating: number
  submittedAt: string
}

/** Payload ที่ส่งไปกับ action 'submitSurvey' — roundId ต้องเป็นรอบที่ยังไม่ปิด
 * (หรือเพิ่งปิด) ของผู้เล่นคนนี้เท่านั้น (ดู pages/scan.vue -> endGameAfterFinalStation) */
export interface SubmitSurveyPayload {
  roundId: string
  userId: string
  firstName?: string
  /** 1-5 เท่านั้น (5=มากที่สุด, 4=มาก, 3=ปานกลาง, 2=น้อย, 1=น้อยที่สุด) */
  favoriteStationRating: number
}

interface SubmitSurveyResponse {
  success: boolean
  alreadySubmitted?: boolean
  survey?: SurveyEntry
  error?: string
}

/** 1 ฐานของเกม (ชีต "Stations" ฝั่ง server-gas) — จัดการรายชื่อ/คะแนน/เปิดปิดฐาน
 * ได้จากหน้า Admin โดยไม่ต้องแก้โค้ด/deploy frontend ใหม่ (ดู server-gas/StationsService.gs)
 * หมายเหตุ: ยังไม่มีพิกัด lat/lng หรือ "ประเภทฐาน" (ไอคอน/สี) ในชีตนี้ — ตำแหน่ง/
 * ไอคอนบนแผนที่ Leaflet ปัจจุบันยังคงมาจาก MOCK_ADVENTURE_STATIONS ใน useAdventure.ts */
export interface StationRecord {
  id: string
  order: number
  name: string
  points: number
  description: string
  active: boolean
  updatedAt: string
  imageUrl: string
  /** ประเภทฐานบนแผนที่ ('corn'/'cow'/'soil'/'milk') — ตั้งค่าได้จากหน้า Admin
   * ใช้จับคู่กับ MOCK_ADVENTURE_STATIONS เพื่อดึงไอคอน/สี Marker (ดู useAdventure.ts)
   * ค่าว่าง '' = Admin ยังไม่ได้กำหนด */
  type: string
  /** พิกัดภูมิศาสตร์จริงของฐาน — ตั้งค่าได้จากหน้า Admin เพื่อย้ายหมุดบนแผนที่
   * โดยไม่ต้องแก้โค้ด frontend เลย null = Admin ยังไม่ได้กำหนด (ใช้พิกัดตั้งต้นแทน) */
  lat: number | null
  lng: number | null
  /** รหัส QR เฉพาะของฐานนี้ (สร้าง/คงค่าโดยฝั่ง server-gas เท่านั้น — ดู
   * StationsService.gs) ใช้ตรวจสอบตอนสแกน QR ผ่าน action 'verifyStationQr'
   * ไม่บังคับต้องมีในทุก response (เช่น listStations เก่าก่อนเพิ่มคอลัมน์นี้) */
  qrToken?: string
}

/** ผลลัพธ์ของ action 'verifyStationQr' — ตรวจสอบว่า qrToken ที่สแกนได้จากกล้อง
 * ตรงกับฐานไหนในระบบจริงหรือไม่ (ดู server-gas/StationsService.gs ->
 * actionVerifyStationQr_) ไม่มีการเขียนข้อมูลใด ๆ ทั้งสิ้น */
export interface VerifyStationQrResponse {
  success: boolean
  station?: StationRecord
  error?: string
}

/** 1 เควสเสริม (ชีต "SideQuests" ฝั่ง server-gas) — คะแนนพิเศษที่ไม่ผูกกับฐานใดฐานหนึ่ง */
export interface SideQuestRecord {
  id: string
  name: string
  points: number
  description: string
  active: boolean
  updatedAt: string
}

interface ListStationsResponse {
  success: boolean
  stations?: StationRecord[]
  error?: string
}

interface ListSideQuestsResponse {
  success: boolean
  sideQuests?: SideQuestRecord[]
  error?: string
}

/** ไฟล์ใหม่ (Photo Detection Quest) — ดึงจากชีต "PhotoQuests" ผ่าน action
 * 'listPhotoQuests' รูปแบบตรงกับ types/photoQuest.ts::PhotoQuest ทุกประการ
 * (import ตรงมาจากที่นั่นเพื่อไม่ให้ type ซ้ำซ้อน/หลุดจากกัน) */
interface ListPhotoQuestsResponse {
  success: boolean
  quests?: import('~/types/photoQuest').PhotoQuest[]
  error?: string
}

/** Payload ที่ส่งไปกับ action 'completePhotoQuest' — แจ้ง Backend ว่าเควสนี้
 * ตรวจจับผ่านแล้ว (Detection ทำบนเครื่องเสร็จสมบูรณ์ก่อนเรียก action นี้เสมอ —
 * ดู composables/useOfflinePhotoQuestSync.ts) */
export interface CompletePhotoQuestPayload {
  userId: string
  questId: string
  points: number
  confidence: number
  /** uuid ฝั่ง client — กันบันทึกซ้ำเหมือน CheckinPayload.clientId เดิม */
  clientId?: string
  [key: string]: unknown
}

interface CompletePhotoQuestResponse {
  success: boolean
  alreadyCompleted?: boolean
  error?: string
}

/** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — ดึงจากชีต "Questions" ผ่าน action
 * 'listQuestions' รูปแบบตรงกับ types/question.ts::StationQuestion ทุกประการ */
interface ListQuestionsResponse {
  success: boolean
  questions?: import('~/types/question').StationQuestion[]
  error?: string
}

/** Payload ที่ส่งไปกับ action 'submitAnswer' — ตอบคำถาม 1 ข้อ 1 ครั้ง
 * (Backend เป็นคนตัดสินถูก/ผิด "ใหม่" เสมอจากเฉลยในชีต ไม่เชื่อค่าที่ client
 * คำนวณมา — ดูเหตุผลเต็มที่ types/question.ts) */
export interface SubmitAnswerPayload {
  userId: string
  firstName?: string
  roundId?: string
  stationId: string
  questionId: string
  answer: string
  /** uuid ฝั่ง client — กันบันทึกซ้ำเหมือน CheckinPayload.clientId เดิม */
  clientId?: string
  [key: string]: unknown
}

interface SubmitAnswerResponse {
  success: boolean
  alreadyAnswered?: boolean
  isCorrect?: boolean
  pointsEarned?: number
  correctAnswer?: string
  explanation?: string
  score?: unknown
  error?: string
}

/** รูปแบบ "ที่ Backend คืนมาจริง" ของคำตอบ 1 แถวในชีต "Answers" — คนละ shape
 * กับ types/question.ts::StationAnswer โดยเจตนา (StationAnswer คือ record ฝั่ง
 * client สำหรับคิว Offline มี synced/locked/answeredAt เป็น timestamp ตัวเลข
 * ส่วนอันนี้คือ wire format มี answerId และ answeredAt เป็น string เวลา
 * Asia/Bangkok จาก server ตรงกับแนวทางเดียวกับ RoundEntry ด้านบนในไฟล์นี้) */
export interface RemoteStationAnswer {
  answerId: string
  roundId: string
  userId: string
  stationId: string
  questionId: string
  answer: string
  isCorrect: boolean
  pointsEarned: number
  answeredAt: string
  clientId: string
}

interface GetRoundAnswersResponse {
  success: boolean
  answers?: RemoteStationAnswer[]
  summary?: import('~/types/question').QuestionRoundSummary
  error?: string
}

/** ไฟล์ใหม่ (ระบบแลกของรางวัล) — response ร่วมของทั้ง action 'getRewardStatus'
 * (อ่านอย่างเดียว) และ 'claimReward' (เจ้าหน้าที่ยืนยันรับจริง) รูปแบบเดียวกัน
 * ทั้งคู่ — ดู types/reward.ts::RewardStatus */
interface RewardStatusResponse extends RewardStatus {
  success: boolean
  error?: string
  /** คะแนนรวมของรอบนี้ที่ server คำนวณเอง (Journey + Answers) — ไว้แสดง Debug/
   * ยืนยันความถูกต้องที่หน้า /redeem ได้ ถ้าต้องการ */
  score?: number
}

/** [ใหม่] คะแนนของ 1 ฐานในรอบที่ระบุ — ดู server-gas/RewardService.gs::getRoundScoresBreakdown_
 * point: แต้มฐาน (จากชีต Journey — ปกติเป็น 0 เสมอตาม Flow ปลดล็อคฐาน+ภารกิจ
 * ปัจจุบันที่ "Station Scan ไม่ให้คะแนน" ไม่มีการเขียน Journey จาก Flow นี้แล้ว)
 * questionPoint: แต้มภารกิจ SINGLE_QUESTION/MULTI_QUESTION (จากชีต Answers)
 * missionQrPoint: แต้มภารกิจ QR_SCORE (จากชีต MissionCompletions) */
export interface RoundScoreStation {
  stationId: string
  stationName: string
  point: number
  questionPoint: number
  missionQrPoint: number
}

/** ไฟล์ใหม่ (ระบบแลกของรางวัล) — response ของ action 'getRoundScores' คะแนนแยก
 * รายฐานของรอบที่ระบุ (ไม่เขียนข้อมูล) — ใช้แสดงที่ pages/round-summary.vue +
 * pages/reward-received.vue "แทน" การอ่านคะแนนจาก Snapshot ฝั่ง Client เดิม
 * (composables/useRoundSummary.ts) เพื่อไม่ให้ Client เป็นคนคำนวณคะแนนของรอบเอง
 * totalScore = totalPoint + totalQuestionPoint เสมอ (ตรงกับ computeRoundScore_
 * ฝั่ง server-gas ที่ใช้ตัดสินสิทธิ์รางวัลจริง) */
interface GetRoundScoresResponse {
  success: boolean
  roundId?: string
  userId?: string
  stations?: RoundScoreStation[]
  totalPoint?: number
  totalQuestionPoint?: number
  totalMissionQrPoint?: number
  totalScore?: number
  error?: string
}

/** ไฟล์ใหม่ (ระบบภารกิจของฐานจริง) — response ของ action 'listStationMissions'
 * (ดู server-gas/MissionsService.gs) ภารกิจของฐานนั้น (Content-Driven จากชีต
 * "Questions" — จำนวน/ชนิดไม่ตายตัว) ส่ง roundId+userId มาด้วย -> แนบ completed/
 * pointsEarned ต่อภารกิจให้เลย (ไม่ส่งมา -> ทุกภารกิจ completed:false เสมอ) */
interface ListStationMissionsResponse {
  success: boolean
  stationId?: string
  missions?: StationMission[]
  error?: string
}

/** ไฟล์ใหม่ (ระบบภารกิจของฐานจริง) — payload ของ action 'verifyMissionQr' คนละ
 * QR กับ verifyStationQr เด็ดขาด (ดู types/mission.ts) roundId/userId จำเป็นต้อง
 * ส่งมาเสมอ (ต่างจาก Station QR) เพราะต้องบันทึก+ให้คะแนนจริงทันทีที่ตรวจผ่าน */
export interface VerifyMissionQrPayload {
  qrToken: string
  stationId: string
  missionId: string
  roundId: string
  userId: string
  firstName?: string
}

interface VerifyMissionQrResponse extends Partial<MissionQrResult> {
  success: boolean
  error?: string
}

/** ไฟล์ใหม่ (ระบบภารกิจของฐานจริง) — payload ของ action 'submitMissionAnswers'
 * ใช้กับภารกิจ MULTI_QUESTION (หลายคำถามพร้อมกัน ส่งครั้งเดียว) — clientId ต่อ
 * คำตอบ (ไม่บังคับ) เผื่ออนาคตอยากใช้เป็น idempotency key เสริม เหมือน
 * SubmitAnswerPayload.clientId เดิม */
export interface SubmitMissionAnswersPayload {
  userId: string
  firstName?: string
  roundId?: string
  stationId: string
  missionId: string
  answers: Array<{ questionId: string; answer: string; clientId?: string }>
}

interface SubmitMissionAnswersResponse extends Partial<MissionAnswersResult> {
  success: boolean
  error?: string
}

/** Payload ที่ส่งไปกับ action 'checkin' — 1 ฐานที่ผ่านสำเร็จ 1 ครั้ง
 * clientId: UUID ที่สร้างฝั่ง client ตอนบันทึกลง Offline Queue (ดู
 * composables/useOfflineSync.ts -> genUuid()) ไม่บังคับ ฝั่ง server-gas ปัจจุบัน
 * ยังไม่ได้ใช้ค่านี้ (dedup ด้วย userId+stationId อยู่แล้ว) แต่ส่งแนบไปด้วยเผื่อ
 * อนาคตอยากใช้เป็น idempotency key เพิ่มเติม/ไว้ตรวจสอบย้อนหลังฝั่ง Sheet */
export interface CheckinPayload {
  userId: string
  firstName?: string
  stationId: string
  stationName?: string
  point?: number
  clientId?: string
  /** [Fix] roundId ที่ Frontend LocalStorage เป็นเจ้าของอยู่ตอน queue รายการนี้
   * (ดู composables/useOfflineSync.ts -> PendingCheckin.roundId) — ต้องส่งมาเสมอ
   * เพื่อให้ server-gas ผูก Journey entry เข้ากับ Round "ที่ถูกต้องตอนสแกนจริง"
   * ไม่ใช่เดาเอาจาก Round ที่ Active ล่าสุด ณ ตอน sync (ดู resolveCurrentRoundId_ ใน
   * server-gas/CheckinService.gs) — ป้องกันเคส sync ช้า/ค้างคิวข้าม Round แล้วฐาน
   * ของรอบเก่าไปโผล่ในรอบใหม่ */
  roundId?: string
}

interface MemberPayload extends IdentityValues, DemographicValues {
  action: string
  lineUserId?: string
  displayName?: string
  pictureUrl?: string
}

/** ดึงข้อมูล LINE จาก authData มาแนบไปด้วย เฉพาะกรณี login ผ่าน LINE เท่านั้น */
function buildLineFields(auth: AuthData): Pick<MemberPayload, 'lineUserId' | 'displayName' | 'pictureUrl'> {
  if (auth.loginType !== 'line') return {}
  return {
    lineUserId: auth.uid,
    displayName: auth.displayName,
    pictureUrl: auth.pictureUrl,
  }
}

export function useMemberApi() {
  const config = useRuntimeConfig()

  async function callApi<T>(action: string, payload: Record<string, unknown>): Promise<T> {
    // หมายเหตุ (แก้บั๊ก Online พัง): เดิมเช็ค isBrowserOffline() (navigator.onLine) ที่นี่ก่อน
    // ยิง request ทุกครั้ง — navigator.onLine ไม่น่าเชื่อถือพอที่จะเอามาตัดสินใจไม่ยิง API
    // เลย (รายงานผิดพลาดได้บ่อย โดยเฉพาะใน LINE in-app browser) ทำให้ loginByLine()/
    // resolveLineMember() ล้มเหลวเงียบ ๆ ทั้งที่จริงมีเน็ต ผู้ใช้ที่มี Account อยู่แล้วจึง
    // ตรวจสอบ lineUserId ไม่ได้และถูกพาไปหน้าสมัครสมาชิกใหม่ผิด ๆ — ตัด logic Offline
    // ออกจากชั้น API นี้ทั้งหมด (แยก Online/Offline logic ตามสเปก) ให้ $fetch เป็นผู้ตัดสิน
    // เองตามธรรมชาติว่ายิงสำเร็จหรือไม่ ผู้เรียกทุกจุดมี try/catch ดักไว้อยู่แล้ว
    const apiUrl = config.public.apiBaseUrl
    if (!apiUrl) {
      throw new Error('ยังไม่ได้ตั้งค่า API_BASE_URL (Google Apps Script Web App URL) ใน .env')
    }

    // หมายเหตุ (แก้บั๊ก "ตอบ error: undefined"): เดิมใช้ $fetch<T>() ตรง ๆ แล้วเชื่อว่า
    // response จะเป็น JSON ตามรูปแบบที่ Code.gs ส่งกลับเสมอ — แต่ Google Apps Script
    // Web App จะไม่ตอบ JSON ในบางกรณี เช่น deployment ตั้ง "Who has access" ไม่ใช่
    // "Anyone" (ต้อง login Google ก่อน), หรือใช้ URL /dev แทน /exec — กรณีนี้ Google
    // จะตอบกลับเป็นหน้า HTML (login/authorization page) แทน ทำให้ $fetch parse ออกมา
    // เป็น string เปล่า ๆ แล้วโค้ดฝั่งเรียก (เช่น resolveLineMember) อ่าน .success/.error
    // จาก string นั้นได้ค่า undefined ทั้งคู่ -> ขึ้น log "ตอบ error: undefined" ที่ debug ไม่ออก
    // ว่าจริง ๆ แล้วปัญหาคืออะไร — เปลี่ยนมาดึงเป็น text ก่อนเสมอ แล้ว JSON.parse เอง
    // เพื่อดักกรณีนี้แล้วโยน Error ข้อความชัดเจนแทน
    // [API DEBUG] log URL สุดท้ายที่กำลังจะถูกส่งเข้า $fetch จริง ๆ (ไม่ใช่แค่ค่าที่อ่านจาก .env ตอน build) เพื่อพิสูจน์ว่า production
    // runtime กำลังใช้ apiBaseUrl ตัวไหนอยู่จริง — ถ้า URL ที่ log ออกมาไม่ตรงกับ deployment ที่ ?action=ping
    // ทดสอบผ่าน แปลว่า runtimeConfig.public.apiBaseUrl ที่ build/deploy ไว้เป็นค่าเก่า
    console.log('[API DEBUG] ' + action + ' URL =', apiUrl)

    const raw = await $fetch<string>(apiUrl, {
      method: 'POST',
      // ดูหมายเหตุ CORS ด้านบน — ห้ามเปลี่ยนเป็น application/json
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      responseType: 'text',
    })

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      const preview = raw.slice(0, 200).replace(/\s+/g, ' ').trim()
      throw new Error(
        `Google Apps Script ไม่ได้ตอบกลับเป็น JSON (action: ${action}) — มักเกิดจาก Deployment ` +
        `ตั้ง "Who has access" ไม่ใช่ "Anyone" หรือยังไม่ได้ Deploy เวอร์ชันล่าสุด หรือ API_BASE_URL ` +
        `ผิด/เป็น URL /dev แทน /exec ดู server-gas/README.md หัวข้อ Deploy ` +
        `— ตัวอย่าง response ที่ได้กลับมา: "${preview}${raw.length > 200 ? '...' : ''}"`,
      )
    }

    // หมายเหตุ (แก้บั๊ก "ตอบ error: undefined"): เดิม JSON.parse ผ่านแล้วก็ cast เป็น T ทันที
    // โดยไม่เช็คว่าโครงสร้างจริง ๆ ตรงตามที่คาดหวังไหม (ต้องมี key "success" เป็น boolean
    // เสมอ ตามสเปก Code.gs) — ถ้า parsed ออกมาเป็น JSON ที่ valid แต่หน้าตาไม่ตรงเลย
    // (เช่น Google ตอบ error page ของตัวเองในรูป {"error":{"code":500,...}} ตอน quota/
    // permission มีปัญหา, หรือ handler ฝั่ง Code.gs มีบั๊กแล้ว return ผิดรูปแบบ) โค้ดเดิม
    // จะปล่อยให้ผ่านไปเงียบ ๆ แล้วปลายทาง (resolveLineMember) อ่าน .success/.error จาก
    // object ที่หน้าตาไม่ตรงสเปกได้ค่า undefined ทั้งคู่ -> ขึ้น log "ตอบ error: undefined"
    // ที่ debug ไม่ออกว่าจริง ๆ แล้วได้อะไรกลับมา — เช็คโครงสร้างที่นี่แทน แล้วโยน Error
    // ที่มีข้อความ + เนื้อหา response จริงแนบมาด้วยเสมอ ไม่ปล่อยผ่านให้ปลายทางเจอ undefined เงียบ ๆ
    // [Audit] เคสเฉพาะที่พบจริง: deployment เก่าที่ยังไม่ได้อัปเดตโค้ด (ก่อนแก้ Code.gs)
    // ตอบกลับเป็น { "status": "error", "message": "..." } แทน { "success": ... } —
    // ตรวจแยกเคสนี้ก่อนเพื่อให้ error message ชี้สาเหตุตรงจุดทันที (deployment ไม่ใช่โค้ด)
    // แทนข้อความรวม ๆ ด้านล่างที่ต้องเดาเอง
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'status' in parsed &&
      !('success' in parsed)
    ) {
      const legacyMessage = (parsed as { message?: unknown }).message
      throw new Error(
        `Google Apps Script ตอบกลับด้วยรูปแบบเก่า { status: "..." } แทน { success: ... } ` +
        `(action: ${action}) — แปลว่า Deployment ที่ API_BASE_URL ชี้ไปอยู่ ยังเป็นโค้ดเวอร์ชัน ` +
        `เก่ากว่าที่แก้ไว้ใน server-gas/Code.gs (ยังไม่ได้ Deploy > Manage deployments > New version) ` +
        `ไม่ใช่บั๊กจากฝั่ง frontend — ข้อความจาก server เดิม: "${String(legacyMessage ?? '')}"`,
      )
    }

    if (typeof parsed !== 'object' || parsed === null || !('success' in parsed)) {
      const preview = raw.slice(0, 300).replace(/\s+/g, ' ').trim()
      throw new Error(
        `Google Apps Script ตอบกลับเป็น JSON แต่ไม่ตรงรูปแบบที่คาดไว้ (action: ${action}) ` +
        `— ควรมี key "success" เสมอ แต่ไม่มี มักเกิดจาก Apps Script deployment เป็นเวอร์ชันเก่า ` +
        `(ยังไม่ได้ deploy โค้ดล่าสุด) หรือ Google ตอบ error ของตัวเอง (quota/permission) แทน ` +
        `— response จริงที่ได้: "${preview}${raw.length > 300 ? '...' : ''}"`,
      )
    }

    return parsed as T
  }

  function checkMember(values: IdentityValues): Promise<CheckMemberResponse> {
    return callApi<CheckMemberResponse>('checkMember', { ...values })
  }

  function registerMember(values: IdentityValues & DemographicValues, auth: AuthData): Promise<MemberActionResponse> {
    return callApi<MemberActionResponse>('register', { ...values, ...buildLineFields(auth) })
  }

  function loginMember(values: IdentityValues & DemographicValues, auth: AuthData): Promise<MemberActionResponse> {
    return callApi<MemberActionResponse>('login', { ...values, ...buildLineFields(auth) })
  }

  /** ใช้อัปเดตข้อมูลสมาชิกเดิมด้วย memberId โดยตรง — เช่น เติมเฉพาะ Birth Year/Gender ที่ยังขาด
   * (ส่งมาเฉพาะฟิลด์ที่ต้องการอัปเดต ฝั่ง backend จะไม่แตะฟิลด์อื่นที่ไม่ได้ส่งมา และไม่มีการสร้างแถวใหม่) */
  function updateMember(memberId: string, fields: Partial<IdentityValues & DemographicValues & { lineUserId: string; displayName: string; pictureUrl: string; point: number; totalVisit: number }>): Promise<MemberActionResponse> {
    return callApi<MemberActionResponse>('updateMember', { memberId, ...fields })
  }

  /** ดึงข้อมูลสมาชิกล่าสุด (point, totalVisit, ...) ด้วย memberId — ใช้รีเฟรชหน้า Home */
  function getMember(memberId: string): Promise<GetMemberResponse> {
    return callApi<GetMemberResponse>('getMember', { memberId })
  }

  /**
   * ตรวจสอบ lineUserId ใน Google Sheet ก่อนเสมอเวลา Login ด้วย LINE (สเปกใหม่):
   *   - พบ lineUserId เดิม -> Login ทันที (อัปเดต Last Login/Total Visit ในแถวเดิม
   *     ให้เรียบร้อยแล้วในฝั่ง backend) ไม่ต้องพาไปหน้ากรอกฟอร์มสมัครสมาชิกอีก
   *   - ไม่พบ -> found: false เท่านั้น (ไม่มีการเขียนข้อมูลใด ๆ) ให้ frontend
   *     พาไปหน้าสมัครสมาชิก (ProfileForm) ต่อตามปกติ
   */
  function loginByLine(lineUserId: string): Promise<LoginByLineResponse> {
    return callApi<LoginByLineResponse>('loginByLine', { lineUserId })
  }

  /**
   * Flow หลักตามสเปก — เรียกตอนกดปุ่ม "ยืนยัน" ในฟอร์ม
   * คืนค่า MemberRecord ที่ Google Sheet ยืนยันแล้ว (มี memberId/registerDate/lastLogin จริง)
   */
  async function syncMember(values: IdentityValues & DemographicValues, auth: AuthData): Promise<MemberActionResponse> {
    const checkResult = await checkMember(values)
    if (!checkResult.success) {
      throw new Error(checkResult.error || 'ตรวจสอบข้อมูลสมาชิกไม่สำเร็จ')
    }
    return checkResult.found ? loginMember(values, auth) : registerMember(values, auth)
  }

  /**
   * action 'checkin' — ส่งผลการสแกน QR ผ่านฐาน 1 ฐานไป Google Sheet (ชีต Journey + Score)
   * ฝั่ง server-gas เป็นผู้ตัดสินเรื่อง "ห้ามบันทึกซ้ำ" ที่ปลายทางอีกชั้นหนึ่ง
   * (ดู server-gas/CheckinService.gs -> hasVisitedStation_) เผื่อกรณี Sync จาก
   * หลายเครื่อง/หลายรอบของผู้เล่นคนเดียวกัน — ใช้คู่กับ composables/useOfflineSync.ts
   * ที่เป็นตัวคุม queue ฝั่ง client (LocalStorage) ก่อน Sync ขึ้นมาที่นี่อีกที
   */
  function checkin(payload: CheckinPayload): Promise<CheckinResponse> {
    return callApi<CheckinResponse>('checkin', { ...payload })
  }

  /** action 'getJourney' — ดึงประวัติการเข้าฐานทั้งหมดของผู้เล่นคนเดียวจาก Google Sheet */
  function getJourney(userId: string): Promise<GetJourneyResponse> {
    return callApi<GetJourneyResponse>('getJourney', { userId })
  }

  /** action 'getScore' — ดึงคะแนนสะสมปัจจุบันของผู้เล่นคนเดียวจาก Google Sheet */
  function getScore(userId: string): Promise<GetScoreResponse> {
    return callApi<GetScoreResponse>('getScore', { userId })
  }

  /** action 'roundStart' — บันทึก "Round Start" ของ 1 รอบการเล่น (ดู server-gas/RoundService.gs)
   * roundId ซ้ำกับรอบที่เคย Sync สำเร็จมาแล้ว -> backend คืน alreadyStarted:true เฉย ๆ
   * ไม่เขียนซ้ำ (idempotent) ใช้คู่กับ composables/useRound.ts ที่คุมไม่ให้เรียกซ้ำจาก
   * refresh/re-render ฝั่ง client อีกชั้นหนึ่ง */
  function roundStart(payload: RoundStartPayload): Promise<RoundStartResponse> {
    return callApi<RoundStartResponse>('roundStart', { ...payload })
  }

  /** action 'roundEnd' — บันทึก "Round End" ของรอบเดิม (roundId เดิมเท่านั้น) */
  function roundEnd(roundId: string, userId: string): Promise<RoundEndResponse> {
    return callApi<RoundEndResponse>('roundEnd', { roundId, userId })
  }

  /** action 'getRound' — ดึงรอบล่าสุดของผู้เล่น 1 คน (ไม่เขียนข้อมูล) */
  function getRound(userId: string): Promise<GetRoundResponse> {
    return callApi<GetRoundResponse>('getRound', { userId })
  }

  /** [ใหม่] action 'confirmRound' — ผู้เล่นกด "OK" ที่หน้า pages/reward-received.vue
   * ยืนยันว่าได้รับรางวัลจริงแล้ว (RewardStatus: Claimed -> Confirmed) idempotent
   * ด้วย roundId (เรียกซ้ำตอน Confirmed ไปแล้ว -> คืน alreadyConfirmed: true เฉย ๆ
   * ไม่เขียนทับซ้ำ) ใช้ roundId เป็นตัวอ้างอิงหลักเสมอ ไม่ใช้ userId ค้นหาอย่างเดียว */
  function confirmRound(roundId: string, userId: string): Promise<ConfirmRoundResponse> {
    return callApi<ConfirmRoundResponse>('confirmRound', { roundId, userId })
  }

  /** action 'submitSurvey' — บันทึกแบบประเมินหลังจบเกม (ดู server-gas/SurveyService.gs)
   * เรียกจาก pages/scan.vue ตอนกดยืนยันแบบประเมิน ก่อนออกจาก Popup ฐานนม/ฐานสุดท้าย
   * roundId เดิมส่งมาซ้ำ (เช่น กดยืนยันซ้ำ/เน็ตหลุดแล้ว retry) -> backend อัปเดต
   * คำตอบเดิมให้ ไม่สร้างแถวซ้ำ (idempotent เหมือน roundStart/roundEnd) */
  function submitSurvey(payload: SubmitSurveyPayload): Promise<SubmitSurveyResponse> {
    return callApi<SubmitSurveyResponse>('submitSurvey', { ...payload })
  }

  /** action 'listStations' — ดึงรายชื่อฐานทั้งหมด (เรียงตาม Order) จากชีต "Stations"
   * ที่จัดการผ่านหน้า Admin — ใช้แทนรายชื่อฐาน mock ที่ hardcode ไว้ในอนาคตได้
   * (กรอง active:false ออกเองฝั่งผู้เรียก ถ้าต้องการโชว์เฉพาะฐานที่เปิดใช้งาน) */
  function listStations(): Promise<ListStationsResponse> {
    return callApi<ListStationsResponse>('listStations', {})
  }

  /** action 'verifyStationQr' — ส่ง qrToken ที่อ่านได้จากกล้องตอนสแกน QR ไปตรวจสอบ
   * กับ Google Sheet โดยตรง (ONLINE เท่านั้น ไม่มี fallback offline) ก่อนเอา Station
   * ที่ backend ยืนยันกลับมาเข้า Check-in flow เดิม (ดู pages/scan.vue) — ไม่เขียน
   * ข้อมูลใด ๆ ทั้งสิ้น เหมือน listStations */
  function verifyStationQr(qrToken: string): Promise<VerifyStationQrResponse> {
    return callApi<VerifyStationQrResponse>('verifyStationQr', { qrToken })
  }

  /** action 'listSideQuests' — ดึงรายการเควสเสริมทั้งหมดจากชีต "SideQuests" */
  function listSideQuests(): Promise<ListSideQuestsResponse> {
    return callApi<ListSideQuestsResponse>('listSideQuests', {})
  }

  /** ไฟล์ใหม่ (Photo Detection Quest) — action 'listPhotoQuests' ดึงรายการ
   * เควสถ่ายรูปทั้งหมดจากชีต "PhotoQuests" (ไม่เขียนข้อมูลใด ๆ) */
  function listPhotoQuests(): Promise<ListPhotoQuestsResponse> {
    return callApi<ListPhotoQuestsResponse>('listPhotoQuests', {})
  }

  /** ไฟล์ใหม่ (Photo Detection Quest) — action 'completePhotoQuest' บันทึกว่า
   * สมาชิกคนนี้ทำเควสถ่ายรูปนี้สำเร็จแล้ว (server-gas กันบันทึกซ้ำด้วย
   * userId+questId เหมือน checkin เดิม) */
  function completePhotoQuest(payload: CompletePhotoQuestPayload): Promise<CompletePhotoQuestResponse> {
    return callApi<CompletePhotoQuestResponse>('completePhotoQuest', payload)
  }

  /** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — action 'listQuestions' ดึงคำถาม
   * ทั้งหมดจากชีต "Questions" (ไม่ระบุ stationId = เอาทุกฐานมาทีเดียว แนะนำให้
   * เรียกครั้งเดียวตอนเริ่มรอบแล้ว cache ไว้ฝั่ง client เพื่อให้ตอบคำถามได้แม้
   * สัญญาณหลุดกลางแปลง — ดู composables/useQuestion.ts) */
  function listQuestions(stationId?: string): Promise<ListQuestionsResponse> {
    return callApi<ListQuestionsResponse>('listQuestions', stationId ? { stationId } : {})
  }

  /** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — action 'submitAnswer' ส่งคำตอบไป
   * ให้ Backend ตัดสินและบันทึก (idempotent ด้วย roundId+userId+questionId —
   * เรียกซ้ำได้ปลอดภัยเสมอ ดู server-gas/QuestionService.gs) */
  function submitAnswer(payload: SubmitAnswerPayload): Promise<SubmitAnswerResponse> {
    return callApi<SubmitAnswerResponse>('submitAnswer', payload)
  }

  /** ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — action 'getRoundAnswers' ดึงคำตอบ
   * ทั้งหมดของผู้เล่นในรอบที่ระบุ (ไม่เขียนข้อมูล) ใช้กู้สถานะ "ตอบไปแล้วบ้าง"
   * กลับมาถ้าผู้เล่นเปลี่ยนเครื่อง/ล้าง LocalStorage กลางรอบ */
  function getRoundAnswers(userId: string, roundId?: string): Promise<GetRoundAnswersResponse> {
    return callApi<GetRoundAnswersResponse>('getRoundAnswers', { userId, roundId })
  }

  /** ไฟล์ใหม่ (ระบบภารกิจของฐานจริง) — action 'listStationMissions' ดึงภารกิจ
   * ทั้งหมดของฐานที่ระบุ (ไม่เขียนข้อมูล) — ส่ง roundId+userId มาด้วย (ถ้ามี Round
   * แล้ว) เพื่อให้ Backend แนบสถานะ completed/pointsEarned ของแต่ละภารกิจกลับมา
   * ด้วยเลย (ไม่ต้องคำนวณเองฝั่ง Client) */
  function listStationMissions(
    stationId: string,
    roundId?: string | null,
    userId?: string,
  ): Promise<ListStationMissionsResponse> {
    return callApi<ListStationMissionsResponse>('listStationMissions', { stationId, roundId, userId })
  }

  /** ไฟล์ใหม่ (ระบบภารกิจของฐานจริง) — action 'verifyMissionQr' ตรวจสอบ QR ของ
   * ภารกิจ "สแกน QR ภายในฐาน" (คนละ QR/handler กับ verifyStationQr เด็ดขาด — ดู
   * types/mission.ts) ผ่านแล้ว Backend บันทึก+ให้คะแนนจริงทันที (idempotent ด้วย
   * roundId+userId+missionId เรียกซ้ำได้ปลอดภัยเสมอ) */
  function verifyMissionQr(payload: VerifyMissionQrPayload): Promise<VerifyMissionQrResponse> {
    return callApi<VerifyMissionQrResponse>('verifyMissionQr', { ...payload })
  }

  /** ไฟล์ใหม่ (ระบบภารกิจของฐานจริง) — action 'submitMissionAnswers' ส่งคำตอบของ
   * ภารกิจ MULTI_QUESTION (หลายคำถามพร้อมกัน) ครั้งเดียว — idempotent ต่อคำถาม
   * เหมือน submitAnswer เดิมทุกประการ (ตอบซ้ำข้อที่เคยตอบแล้วในชุดนี้ไม่บวกซ้ำ) */
  function submitMissionAnswers(payload: SubmitMissionAnswersPayload): Promise<SubmitMissionAnswersResponse> {
    return callApi<SubmitMissionAnswersResponse>('submitMissionAnswers', { ...payload })
  }

  /** ไฟล์ใหม่ (ระบบแลกของรางวัล) — action 'getRewardStatus' ตรวจสอบสิทธิ์รางวัล
   * ของรอบที่ระบุ (ไม่เขียนข้อมูล) ใช้จากหน้าสรุปผลของผู้เล่นเอง (ดู
   * pages/round-summary.vue) เพื่อโชว์ว่ามีสิทธิ์รางวัลอะไร + เจ้าหน้าที่ยืนยัน
   * ให้แล้วหรือยัง — ไม่มีปุ่มยืนยันในหน้านั้น (ดู claimReward ด้านล่าง)
   *
   * [แก้ไข] ไม่รับ/ไม่ส่ง `score` จาก Client อีกต่อไป — server-gas เดิมมีทางลัด
   * "เชื่อ score จาก client ตรง ๆ" ซึ่งกลายเป็นช่องโหว่จริง (pages/round-summary.vue
   * เคยส่ง mockScore ของระบบภารกิจ Mock เดิมมาที่นี่) ตอนนี้ Backend คำนวณจาก
   * Journey+Answers+MissionCompletions เองเสมอ ไม่มีทางลัดแล้ว (ดู
   * server-gas/RewardService.gs::actionGetRewardStatus_) */
  function getRewardStatus(roundId: string | null, userId: string): Promise<RewardStatusResponse> {
    return callApi<RewardStatusResponse>('getRewardStatus', { roundId, userId })
  }

  /** ไฟล์ใหม่ (ระบบแลกของรางวัล) — action 'claimReward' เจ้าหน้าที่กดยืนยันรับ
   * รางวัลที่จุดแลกรางวัล (ดู pages/redeem.vue) idempotent ด้วย roundId+userId
   * เรียกซ้ำได้ปลอดภัยเสมอ (ไม่สร้างประวัติซ้ำ ไม่ให้แลกซ้ำ) */
  function claimReward(roundId: string, userId: string, displayName: string): Promise<RewardStatusResponse> {
    return callApi<RewardStatusResponse>('claimReward', { roundId, userId, displayName })
  }

  /** ไฟล์ใหม่ (ระบบแลกของรางวัล) — action 'getRoundScores' คะแนนแยกรายฐานของ
   * รอบที่ระบุ (ไม่เขียนข้อมูล) ใช้จากหน้าสรุปผล/หน้ารับรางวัลของผู้เล่นเอง (ดู
   * pages/round-summary.vue, pages/reward-received.vue ผ่าน composables/useRoundScores.ts)
   * แทนการอ่านคะแนนจาก Snapshot ฝั่ง Client — คะแนนคำนวณจาก Journey+Answers
   * ฝั่ง server เอง (ดู server-gas/RewardService.gs::getRoundScoresBreakdown_) */
  function getRoundScores(roundId: string, userId: string): Promise<GetRoundScoresResponse> {
    return callApi<GetRoundScoresResponse>('getRoundScores', { roundId, userId })
  }

  return {
    checkMember,
    registerMember,
    loginMember,
    updateMember,
    getMember,
    loginByLine,
    syncMember,
    checkin,
    getJourney,
    getScore,
    roundStart,
    roundEnd,
    getRound,
    confirmRound,
    submitSurvey,
    listStations,
    verifyStationQr,
    listSideQuests,
    listPhotoQuests,
    completePhotoQuest,
    listQuestions,
    submitAnswer,
    getRoundAnswers,
    listStationMissions,
    verifyMissionQr,
    submitMissionAnswers,
    getRewardStatus,
    claimReward,
    getRoundScores,
  }
}
