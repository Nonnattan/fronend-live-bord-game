/**
 * composables/useRoundScores.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ตัวช่วยเรียก action 'getRoundScores' (ดู server-gas/RewardService.gs)
 * ใช้จาก 2 ที่:
 *   - pages/round-summary.vue  : แสดง "ฐานที่ผ่าน + คะแนนแต่ละฐาน" ของรอบนี้
 *     (เฉพาะฝั่ง Online — Offline Mode ไม่มี Round ฝั่ง Backend ให้ดึงเลย)
 *   - pages/reward-received.vue: แสดงซ้ำอีกครั้ง (โหลดของตัวเองแบบ hard-refresh-safe
 *     เหมือน useReward.ts ไม่ได้พึ่งพา state ที่หน้าอื่นดึงไว้ก่อนหน้า)
 *
 * ตั้งใจแยกจาก composables/useRoundSummary.ts โดยสิ้นเชิง — ไฟล์นั้นเป็นแค่
 * "สำเนา" ข้อมูลฝั่ง Client ที่เก็บไว้ตอนจบเกม (ใช้แสดงชื่อฐาน/เวลาเริ่ม-จบ/
 * roundId/userId เท่านั้น) ส่วนไฟล์นี้คือคะแนน "จริง" ที่ต้องมาจาก Backend เสมอ
 * ตามสเปก "ห้ามใช้คะแนนสะสมจาก Client เป็นคะแนนของ Round" — ไม่มีวัน fallback
 * ไปใช้ค่าจาก useRoundSummary.ts เด็ดขาด แสดง Loading/Error/Retry แทนถ้าดึงไม่สำเร็จ
 */

import type { RoundScoreStation } from '~/composables/useMemberApi'

export function useRoundScores() {
  const stations = useState<RoundScoreStation[]>('round-scores-stations', () => [])
  const totalPoint = useState<number>('round-scores-total-point', () => 0)
  const totalQuestionPoint = useState<number>('round-scores-total-question-point', () => 0)
  const totalScore = useState<number>('round-scores-total-score', () => 0)
  const isLoading = useState<boolean>('round-scores-loading', () => false)
  const error = useState<string>('round-scores-error', () => '')
  /** true ทันทีที่เคยดึงสำเร็จอย่างน้อย 1 ครั้ง — แยกจาก isLoading เพื่อให้ UI
   * แยกเคส "กำลังโหลดครั้งแรก" กับ "ดึงสำเร็จแล้ว" ออกจากกันได้ */
  const loaded = useState<boolean>('round-scores-loaded', () => false)

  /** ดึงคะแนนแยกรายฐานของรอบที่ระบุ — roundId/userId เป็น null/ว่างได้ (เช่น
   * Offline Mode ไม่มี Round ฝั่ง Backend) จะไม่เรียก API เลย คืน false เฉย ๆ */
  async function fetchRoundScores(roundId: string | null | undefined, userId: string | null | undefined): Promise<boolean> {
    if (!import.meta.client || !roundId || !userId) return false
    isLoading.value = true
    error.value = ''
    try {
      const { getRoundScores } = useMemberApi()
      const res = await getRoundScores(roundId, userId)
      if (res.success) {
        stations.value = res.stations ?? []
        totalPoint.value = res.totalPoint ?? 0
        totalQuestionPoint.value = res.totalQuestionPoint ?? 0
        totalScore.value = res.totalScore ?? 0
        loaded.value = true
        return true
      }
      error.value = res.error || 'ดึงคะแนนของรอบนี้ไม่สำเร็จ'
      return false
    } catch {
      error.value = 'ไม่สามารถดึงคะแนนของรอบนี้ได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /** เรียกตอน reset รอบ (ดู pages/reward-received.vue::handleOk() และ
   * pages/round-summary.vue::confirmAndGoHome()) กันคะแนนของรอบที่เพิ่งจบค้าง
   * แสดงผลข้ามไปรอบใหม่ถัดไป (useState คงค่าข้ามหน้าอยู่แล้วถ้าไม่ล้างเอง) */
  function resetRoundScores(): void {
    stations.value = []
    totalPoint.value = 0
    totalQuestionPoint.value = 0
    totalScore.value = 0
    loaded.value = false
    error.value = ''
  }

  return {
    stations: readonly(stations),
    totalPoint: readonly(totalPoint),
    totalQuestionPoint: readonly(totalQuestionPoint),
    totalScore: readonly(totalScore),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loaded: readonly(loaded),
    fetchRoundScores,
    resetRoundScores,
  }
}
