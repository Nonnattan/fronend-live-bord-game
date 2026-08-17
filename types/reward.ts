/**
 * types/reward.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — Data Model ของระบบ "แลกของรางวัลตามเงื่อนไขคะแนน"
 *
 *   คะแนนรวม -> ตรวจสอบเงื่อนไขของรางวัล -> มีสิทธิ์รับรางวัล? -> ใช่ ->
 *   เจ้าหน้าที่ยืนยันรับรางวัลที่จุดแลกรางวัล -> แสดงสถานะ "รับแล้ว [เวลา]"
 *
 * เนื้อหาของรางวัล (ชื่อ/เงื่อนไขคะแนน) มาจาก Google Sheet ("Rewards" ผ่าน
 * server-gas/RewardService.gs) ทั้งหมด ไม่ hard-code ไว้ฝั่ง frontend
 */

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
  /** null = คะแนนยังไม่ถึงเกณฑ์รางวัลใดเลย */
  reward: { id: string; name: string } | null
  alreadyClaimed: boolean
  /** เวลา Asia/Bangkok ที่เจ้าหน้าที่ยืนยันรับรางวัล — null ถ้ายังไม่เคยแลก */
  claimedAt: string | null
}
