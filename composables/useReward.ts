/**
 * composables/useReward.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ตัวช่วยเรียก API ของระบบ "แลกของรางวัลตามเงื่อนไขคะแนน" (ดู
 * server-gas/RewardService.gs) ใช้จาก 3 ที่:
 *   - pages/round-summary.vue  : เรียก checkRewardStatus() (อ่านอย่างเดียว) ทันที
 *     1 ครั้งแล้ว Poll ทุก 10 วินาที เพื่อตรวจ round.rewardStatus ของ RoundId
 *     ปัจจุบัน (Pending -> อยู่หน้าเดิม, Claimed -> redirect ไป /reward-received)
 *   - pages/reward-received.vue: เรียก checkRewardStatus() (โหลดชื่อรางวัล/สถานะ
 *     ซ้ำแบบ hard-refresh-safe) และ confirmRoundReceived() (ผู้เล่นกด OK เอง)
 *   - หน้า "จุดแลกรางวัล" ของเจ้าหน้าที่ (checkRewardStatus + ยืนยันรับรางวัล)
 *     ถูกย้ายไปอยู่ที่แอป Admin (backend-liveboradgame) แล้ว ไม่ได้อยู่ใน
 *     โปรเจกต์นี้อีกต่อไป — composable นี้จึงเหลือแค่ 2 อย่างที่ยังใช้จริงใน
 *     โปรเจกต์นี้ (checkRewardStatus สำหรับอ่านสถานะอย่างเดียว +
 *     confirmRoundReceived สำหรับผู้เล่นกด OK) ไม่มีฟังก์ชันยืนยันรับรางวัล
 *     (claimReward) เหลืออยู่ที่นี่แล้ว
 *
 * เป็น Online-only (ไม่มี Offline Queue) ตามธรรมชาติของ Flow นี้ — การแลกรางวัล
 * ต้องมีเจ้าหน้าที่ + เน็ตเสมอ (ดูเหตุผลเต็ม ๆ ที่หัวไฟล์ RewardService.gs)
 */

import type { RewardStatus } from '~/types/reward'

export function useReward() {
  const status = useState<RewardStatus | null>('reward-status', () => null)
  const isChecking = useState<boolean>('reward-checking', () => false)
  const isConfirming = useState<boolean>('reward-confirming', () => false)
  const error = useState<string>('reward-error', () => '')

  /** ตรวจสอบสิทธิ์รางวัลของรอบที่ระบุ (ไม่เขียนข้อมูล) — roundId เป็น null ได้
   * (Offline Mode ไม่มี Round ฝั่ง Backend) แต่จะไม่มีทางมีสิทธิ์รางวัลเลย เพราะ
   * ระบบรางวัลผูกกับ roundId เสมอ (ดู server-gas/RewardService.gs) คะแนนคำนวณ
   * จาก Journey+Answers ฝั่ง server เอง ไม่ต้องส่งมาจากที่นี่
   *
   * [ใหม่] result.round (roundId/status/rewardStatus จากชีต "Round" โดยตรง) ถูก
   * เก็บไว้ใน status.value ด้วย — pages/round-summary.vue ใช้ค่านี้ตัดสินใจ
   * Poll ต่อ/redirect (ดู doc comment ด้านบนไฟล์) */
  /** [ใหม่ — ชั่วคราว/Demo] `score` (ไม่บังคับ) = คะแนนที่คำนวณจาก LocalStorage
   * ฝั่งเครื่อง (ผู้เรียก — pages/round-summary.vue — เป็นคนรวม totalPoint (ฐาน)
   * + questionPoints (คำถามตอบถูก) มาให้) ส่งต่อไป getRewardStatus() เฉย ๆ ดู
   * คำเตือนเรื่องความปลอดภัยที่ server-gas/RewardService.gs หัวไฟล์ */
  async function checkRewardStatus(roundId: string | null, userId: string, score?: number): Promise<RewardStatus | null> {
    if (!import.meta.client || !roundId || !userId) {
      status.value = null
      return null
    }
    isChecking.value = true
    error.value = ''
    try {
      const { getRewardStatus } = useMemberApi()
      const res = await getRewardStatus(roundId, userId, score)
      if (res.success) {
        status.value = {
          round: res.round ?? null,
          reward: res.reward ?? null,
          alreadyClaimed: !!res.alreadyClaimed,
          claimedAt: res.claimedAt ?? null,
        }
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

  /**
   * [ใหม่] ผู้เล่นกด "OK" ที่หน้า pages/reward-received.vue ยืนยันว่าได้รับ
   * รางวัลจริงแล้ว (RewardStatus: Claimed -> Confirmed) — เป็นจุดเดียวที่อนุญาต
   * ให้ reset State ของรอบปัจจุบันได้ (ผู้เรียกต้องรอ true กลับมาก่อนเสมอ ห้าม
   * reset ล่วงหน้า/auto-confirm) idempotent ฝั่ง Backend อยู่แล้ว (เรียกซ้ำตอน
   * Confirmed ไปแล้วก็ยังคืน true ปลอดภัย ไม่มีผลข้างเคียง)
   */
  async function confirmRoundReceived(roundId: string, userId: string): Promise<boolean> {
    if (!import.meta.client) return false
    isConfirming.value = true
    error.value = ''
    try {
      const { confirmRound } = useMemberApi()
      const res = await confirmRound(roundId, userId)
      if (res.success) {
        if (res.round) status.value = status.value ? { ...status.value, round: res.round } : null
        return true
      }
      error.value = res.error || 'ยืนยันรับรางวัลไม่สำเร็จ'
      return false
    } catch {
      error.value = 'ไม่สามารถยืนยันรับรางวัลได้ในขณะนี้ (ไม่มีอินเทอร์เน็ต หรือ Backend ไม่ตอบสนอง)'
      return false
    } finally {
      isConfirming.value = false
    }
  }

  return {
    status: readonly(status),
    isChecking: readonly(isChecking),
    isConfirming: readonly(isConfirming),
    error: readonly(error),
    checkRewardStatus,
    confirmRoundReceived,
  }
}
