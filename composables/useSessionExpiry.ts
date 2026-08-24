/**
 * composables/useSessionExpiry.ts
 * ---------------------------------------------------------------------------
 * [ใหม่] จำกัดอายุ "ข้อมูลการเล่น/Session" ของ Live Boardgame ไว้สูงสุด 24 ชั่วโมง
 * (round/session, progress, mockScore, station/mission progress, ฐานที่เลือก,
 * round summary ของรอบปัจจุบัน) โดยใช้ timestamp ที่มีอยู่แล้วเท่านั้น — ไม่สร้าง
 * Key ใหม่/ระบบคู่ขนานเพิ่ม: `roundTimer:roundEndsAt` (เขียนทับทุกครั้งที่กด GO ที่
 * pages/starting.vue::startRoundTimer() ทั้งฝั่ง Online/Offline — ดู
 * composables/useRoundTimer.ts) ลบด้วย ROUND_DURATION_MS (2 ชม.) คงที่ ก็ได้เวลาที่
 * Session นี้เริ่มเล่นจริง แล้วเทียบกับ Date.now() ว่าเกิน 24 ชม. หรือยัง
 *
 * ทำไมใช้ roundEndsAt แทนการเพิ่ม Key ใหม่: มันเป็น Timestamp เดียวที่ "คงอยู่ตลอด
 * ทั้ง Flow" ตั้งแต่กด GO จนกว่าจะกด "จบเกม"/รับรางวัลสำเร็จจริง (clearAllTimers()
 * ถูกเรียกเฉพาะตอนจบเกมสำเร็จ/หมดเวลาบังคับจบเท่านั้น — ดู pages/round-summary.vue,
 * pages/reward-received.vue, composables/useForceEndRound.ts) จึงครอบคลุมทั้งเคส
 * "เล่นค้างกลางเกมแล้วหาย" และ "เล่นจบแล้วแต่ยังไม่ได้กดรับรางวัลแล้วหาย" ทั้งคู่
 *
 * ตรวจตอนเริ่มแอป (เรียกจาก plugins/session-expiry.client.ts ครั้งเดียวก่อนหน้า
 * ไหนจะ mount) — เกิน 24 ชม. จริง ให้ล้าง "เฉพาะ" Key ที่เกี่ยวกับรอบ/การเล่น (ห้าม
 * localStorage.clear() เด็ดขาด — ไม่แตะ userProfile/authData/Key อื่นของระบบเลย)
 * แล้วเด้งไปหน้า Login "/" เสมอ ไม่เปิด Round เดิม/ไม่โชว์คะแนน-Progress ข้ามวัน
 */

import { ROUND_DURATION_MS } from '~/composables/useRoundTimer'
import { clearStationQuestProgress } from '~/composables/useStationQuest'

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000

export function useSessionExpiry() {
  /** เวลาที่ Session ปัจจุบัน (ถ้ามี) เริ่มเล่นจริง — null ถ้าไม่มี Session ค้างอยู่
   * เลย (ยังไม่เคยกด GO หรือเล่นจบ+เคลียร์ Timer ไปแล้วตามปกติ) กรณีนี้ไม่มีอะไร
   * ให้หมดอายุ ไม่ต้องทำอะไรต่อ */
  function getSessionStartedAt(): number | null {
    if (!import.meta.client) return null
    const raw = localStorage.getItem('roundTimer:roundEndsAt')
    if (!raw) return null
    const endsAt = Number(raw)
    if (!Number.isFinite(endsAt)) return null
    return endsAt - ROUND_DURATION_MS
  }

  function isSessionExpired(): boolean {
    const startedAt = getSessionStartedAt()
    if (startedAt === null) return false
    return Date.now() - startedAt > SESSION_MAX_AGE_MS
  }

  /** ล้างเฉพาะข้อมูลเกม/Session ที่เกี่ยวข้องทิ้ง (LocalStorage + State ในหน่วยความ
   * จำของแต่ละระบบให้ตรงกันด้วย) — ไม่แตะ userProfile/authData หรือ Key อื่นของ
   * ระบบที่ไม่เกี่ยวกับรอบการเล่นเลย */
  function clearExpiredSession(): void {
    const { clearAllTimers } = useRoundTimer()
    const { discardStaleRound } = useRound()
    const { clearRoundData } = useOfflineMode()
    const { clearRoundSummary } = useRoundSummary()

    clearAllTimers()
    discardStaleRound()
    clearRoundData()
    clearStationQuestProgress()
    clearRoundSummary()
  }

  /** เรียกตอนเริ่มแอป (ดู plugins/session-expiry.client.ts) — คืน true ถ้าเพิ่งล้าง
   * Session ที่หมดอายุไปจริง (ผู้เรียกไม่ต้องทำอะไรต่อ เพราะพาไป "/" ให้แล้ว) */
  async function checkAndClearIfExpired(): Promise<boolean> {
    if (!import.meta.client) return false
    if (!isSessionExpired()) return false

    clearExpiredSession()
    await navigateTo('/')
    return true
  }

  return {
    isSessionExpired,
    clearExpiredSession,
    checkAndClearIfExpired,
  }
}
