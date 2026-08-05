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

/** 1 แถวประวัติการเข้าฐาน (ชีต "Journey" ฝั่ง server-gas) */
export interface JourneyEntry {
  timestamp: string
  userId: string
  displayName: string
  stationId: string
  stationName: string
  point: number
  status: string
}

/** คะแนนสะสมของผู้เล่น 1 คน (ชีต "Score" ฝั่ง server-gas) */
export interface ScoreEntry {
  userId: string
  displayName: string
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

/** Payload ที่ส่งไปกับ action 'checkin' — 1 ฐานที่ผ่านสำเร็จ 1 ครั้ง
 * clientId: UUID ที่สร้างฝั่ง client ตอนบันทึกลง Offline Queue (ดู
 * composables/useOfflineSync.ts -> genUuid()) ไม่บังคับ ฝั่ง server-gas ปัจจุบัน
 * ยังไม่ได้ใช้ค่านี้ (dedup ด้วย userId+stationId อยู่แล้ว) แต่ส่งแนบไปด้วยเผื่อ
 * อนาคตอยากใช้เป็น idempotency key เพิ่มเติม/ไว้ตรวจสอบย้อนหลังฝั่ง Sheet */
export interface CheckinPayload {
  userId: string
  displayName?: string
  stationId: string
  stationName?: string
  point?: number
  clientId?: string
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
    const apiUrl = config.public.apiBaseUrl
    if (!apiUrl) {
      throw new Error('ยังไม่ได้ตั้งค่า API_BASE_URL (Google Apps Script Web App URL) ใน .env')
    }

    return await $fetch<T>(apiUrl, {
      method: 'POST',
      // ดูหมายเหตุ CORS ด้านบน — ห้ามเปลี่ยนเป็น application/json
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
    })
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

  /** action 'listStations' — ดึงรายชื่อฐานทั้งหมด (เรียงตาม Order) จากชีต "Stations"
   * ที่จัดการผ่านหน้า Admin — ใช้แทนรายชื่อฐาน mock ที่ hardcode ไว้ในอนาคตได้
   * (กรอง active:false ออกเองฝั่งผู้เรียก ถ้าต้องการโชว์เฉพาะฐานที่เปิดใช้งาน) */
  function listStations(): Promise<ListStationsResponse> {
    return callApi<ListStationsResponse>('listStations', {})
  }

  /** action 'listSideQuests' — ดึงรายการเควสเสริมทั้งหมดจากชีต "SideQuests" */
  function listSideQuests(): Promise<ListSideQuestsResponse> {
    return callApi<ListSideQuestsResponse>('listSideQuests', {})
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
    listStations,
    listSideQuests,
  }
}
