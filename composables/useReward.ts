/**
 * composables/useReward.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ตัวช่วยเรียก API ของระบบ "แลกของรางวัลตามเงื่อนไขคะแนน" (ดู
 * server-gas/RewardService.gs) ใช้จาก 2 ที่:
 *   - pages/round-summary.vue : เรียก checkRewardStatus() (อ่านอย่างเดียว) เพื่อ
 *     โชว์ผู้เล่นว่ามีสิทธิ์รางวัลอะไร + เจ้าหน้าที่ยืนยันให้แล้วหรือยัง
 *   - pages/redeem.vue        : เรียกทั้ง checkRewardStatus() (ค้นหาก่อน) และ
 *     confirmClaim() (เจ้าหน้าที่กดยืนยันรับจริง)
 *
 * เป็น Online-only (ไม่มี Offline Queue) ตามธรรมชาติของ Flow นี้ — การแลกรางวัล
 * ต้องมีเจ้าหน้าที่ + เน็ตเสมอ (ดูเหตุผลเต็ม ๆ ที่หัวไฟล์ RewardService.gs)
 */

import type { RewardStatus } from '~/types/reward'

export function useReward() {
  const status = useState<RewardStatus | null>('reward-status', () => null)
  const isChecking = useState<boolean>('reward-checking', () => false)
  const isClaiming = useState<boolean>('reward-claiming', () => false)
  const error = useState<string>('reward-error', () => '')

  /** ตรวจสอบสิทธิ์รางวัลของรอบที่ระบุ (ไม่เขียนข้อมูล) — roundId เป็น null ได้
   * (Offline Mode ไม่มี Round ฝั่ง Backend) แต่จะไม่มีทางมีสิทธิ์รางวัลเลย เพราะ
   * ระบบรางวัลผูกกับ roundId เสมอ (ดู server-gas/RewardService.gs) คะแนนคำนวณ
   * จาก Journey+Answers ฝั่ง server เอง ไม่ต้องส่งมาจากที่นี่ */
  async function checkRewardStatus(roundId: string | null, userId: string): Promise<RewardStatus | null> {
    if (!import.meta.client || !roundId || !userId) {
      status.value = null
      return null
    }
    isChecking.value = true
    error.value = ''
    try {
      const { getRewardStatus } = useMemberApi()
      const res = await getRewardStatus(roundId, userId)
      if (res.success) {
        status.value = { reward: res.reward ?? null, alreadyClaimed: !!res.alreadyClaimed, claimedAt: res.claimedAt ?? null }
        return status.value
      }
      error.value = res.error || 'ตรวจสอบสิทธิ์รางวัลไม่สำเร็จ'
      return null
    } catch {
      error.value = 'ไม่สามารถตรวจสอบสิทธิ์รางวัลได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
      return null
    } finally {
      isChecking.value = false
    }
  }

  /** เจ้าหน้าที่กดยืนยันรับรางวัลจริง — ใช้จาก pages/redeem.vue เท่านั้น */
  async function confirmClaim(roundId: string, userId: string, displayName: string): Promise<RewardStatus | null> {
    if (!import.meta.client) return null
    isClaiming.value = true
    error.value = ''
    try {
      const { claimReward } = useMemberApi()
      const res = await claimReward(roundId, userId, displayName)
      if (res.success) {
        status.value = { reward: res.reward ?? null, alreadyClaimed: !!res.alreadyClaimed, claimedAt: res.claimedAt ?? null }
        return status.value
      }
      error.value = res.error || 'ยืนยันรับรางวัลไม่สำเร็จ'
      return null
    } catch {
      error.value = 'ไม่สามารถยืนยันรับรางวัลได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
      return null
    } finally {
      isClaiming.value = false
    }
  }

  return {
    status: readonly(status),
    isChecking: readonly(isChecking),
    isClaiming: readonly(isClaiming),
    error: readonly(error),
    checkRewardStatus,
    confirmClaim,
  }
}
