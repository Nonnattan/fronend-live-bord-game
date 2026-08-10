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

/** 1 แถวประวัติการเข้าฐาน (ชีต "Journey" ฝั่ง server-gas)
 * roundId: รอบการเล่นที่บันทึกแถวนี้ (ดู server-gas/RoundService.gs + CheckinService.gs)
 * ใช้กันข้อมูลซ้ำฝั่ง backend เท่านั้น ไม่ได้ใช้แสดงผลในหน้า History ปัจจุบัน */
export interface JourneyEntry {
  timestamp: string
  roundId?: string
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

/** 1 รอบการเล่น (ชีต "Round" ฝั่ง server-gas — ดู server-gas/RoundService.gs)
 * status: 'Started' (เริ่มรอบแล้ว ยังไม่จบ) / 'Ended' (จบรอบแล้ว) */
export interface RoundEntry {
  roundId: string
  userId: string
  displayName: string
  startTime: string
  endTime: string | null
  status: string
}

/** Payload ที่ส่งไปกับ action 'roundStart' — roundId สร้างฝั่ง client (UUID) ครั้งเดียว
 * ต่อ 1 รอบ แล้วใช้ซ้ำตลอดทั้งรอบ (ดู composables/useRound.ts) */
export interface RoundStartPayload {
  roundId: string
  userId: string
  displayName?: string
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
    listStations,
    verifyStationQr,
    listSideQuests,
  }
}
