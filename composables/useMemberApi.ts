/**
 * composables/useMemberApi.ts
 * ---------------------------------------------------------------------------
 * เรียก Google Apps Script Web App (REST API) ที่ผูกกับ Google Sheet เป็น
 * ฐานข้อมูลสมาชิก — รวม action: checkMember / register / login / updateMember
 * ตามสเปก และมีฟังก์ชัน syncMember() ที่ทำ flow หลักให้ครบข้อ 3-5:
 *   1) checkMember ด้วย firstName/lastName/phone
 *   2) พบ    -> login  (อัปเดต Last Login + ข้อมูล LINE ถ้ามี)
 *   3) ไม่พบ -> register (สร้าง Member ID ใหม่)
 *
 * หมายเหตุ CORS: Google Apps Script Web App ไม่รองรับ CORS preflight (OPTIONS)
 * จึงต้องส่งแบบ "simple request" เท่านั้น -> ใช้ Content-Type:
 * "text/plain;charset=utf-8" แทน "application/json" (ฝั่ง Apps Script ยัง
 * JSON.parse(e.postData.contents) ได้ตามปกติ ไม่สนใจ header ที่ประกาศมา)
 */

import type { AuthData } from '~/types/auth'

/** โครงสร้างสมาชิกตามที่ Google Apps Script ส่งกลับมา (ตรงกับคอลัมน์ใน Sheet) */
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
}

export interface IdentityValues {
  firstName: string
  lastName: string
  phone: string
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

interface MemberPayload extends IdentityValues {
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

  function registerMember(values: IdentityValues, auth: AuthData): Promise<MemberActionResponse> {
    return callApi<MemberActionResponse>('register', { ...values, ...buildLineFields(auth) })
  }

  function loginMember(values: IdentityValues, auth: AuthData): Promise<MemberActionResponse> {
    return callApi<MemberActionResponse>('login', { ...values, ...buildLineFields(auth) })
  }

  function updateMember(memberId: string, fields: Partial<IdentityValues & { lineUserId: string; displayName: string; pictureUrl: string; point: number; totalVisit: number }>): Promise<MemberActionResponse> {
    return callApi<MemberActionResponse>('updateMember', { memberId, ...fields })
  }

  /** ดึงข้อมูลสมาชิกล่าสุด (point, totalVisit, ...) ด้วย memberId — ใช้รีเฟรชหน้า Home */
  function getMember(memberId: string): Promise<GetMemberResponse> {
    return callApi<GetMemberResponse>('getMember', { memberId })
  }

  /**
   * Flow หลักตามสเปก — เรียกตอนกดปุ่ม "ยืนยัน" ในฟอร์ม
   * คืนค่า MemberRecord ที่ Google Sheet ยืนยันแล้ว (มี memberId/registerDate/lastLogin จริง)
   */
  async function syncMember(values: IdentityValues, auth: AuthData): Promise<MemberActionResponse> {
    const checkResult = await checkMember(values)
    if (!checkResult.success) {
      throw new Error(checkResult.error || 'ตรวจสอบข้อมูลสมาชิกไม่สำเร็จ')
    }
    return checkResult.found ? loginMember(values, auth) : registerMember(values, auth)
  }

  return { checkMember, registerMember, loginMember, updateMember, getMember, syncMember }
}
