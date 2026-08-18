/**
 * types/reward.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Data Model ของระบบ "แลกของรางวัลตามเงื่อนไขคะแนน"
 *
 *   คะแนนรวม -> ตรวจสอบเงื่อนไขของรางวัล -> มีสิทธิ์รับรางวัล? -> ใช่ ->
 *   เจ้าหน้าที่ยืนยันรับรางวัลที่จุดแลกรางวัล (RewardStatus: Pending -> Claimed)
 *   -> ผู้เล่นกด OK ที่หน้า pages/reward-received.vue (RewardStatus: Claimed ->
 *   Confirmed) -> ปิดรอบสมบูรณ์
 *
 * เนื้อหาของรางวัล (ชื่อ/เงื่อนไขคะแนน) มาจาก Google Sheet ("Rewards" ผ่าน
 * server-gas/RewardService.gs) ทั้งหมด ไม่ hard-code ไว้ฝั่ง frontend
 */

import type { RoundEntry } from '~/composables/useMemberApi'

/** 1 ระดับรางวัลในคลัง (ชีต "Rewards") */
export interface RewardTier {
  id: string
  name: string
  minScore: number
  /** null = ไม่จำกัดเพดานบน ("ขึ้นไป") */
  maxScore: number | null
  active: boolean
}

/** ผลตรวจสอบสิทธิ์รางวัล — ใช้ทั้งตอน "ดูสถานะ" (getRewardStatus) และตอน
 * "ยืนยันรับจริง" (claimReward) รูปแบบ response เหมือนกัน */
export interface RewardStatus {
  /** [ใหม่] ข้อมูลรอบจากชีต "Round" โดยตรง (RoundId เป็นตัวอ้างอิงหลักเสมอ) —
   * ใช้ round.rewardStatus (Pending/Claimed/Confirmed) ตัดสินว่าจะ Poll ต่อหรือ
   * redirect ไป /reward-received ที่ pages/round-summary.vue — null = ไม่พบ
   * roundId นี้ในชีต Round เลย (เช่น Offline Mode ที่ไม่มี Round ฝั่ง Backend) */
  round: RoundEntry | null
  /** null = คะแนนยังไม่ถึงเกณฑ์รางวัลใดเลย */
  reward: { id: string; name: string } | null
  alreadyClaimed: boolean
  /** เวลา Asia/Bangkok ที่เจ้าหน้าที่ยืนยันรับรางวัล — null ถ้ายังไม่เคยแลก */
  claimedAt: string | null
}
