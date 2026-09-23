import { f as useState } from '../virtual/entry.mjs';
import { readonly } from 'vue';

//#region composables/useReward.ts
function useReward() {
	const status = useState("reward-status", () => null);
	const isChecking = useState("reward-checking", () => false);
	const isConfirming = useState("reward-confirming", () => false);
	const error = useState("reward-error", () => "");
	/** ตรวจสอบสิทธิ์รางวัลของรอบที่ระบุ (ไม่เขียนข้อมูล) — roundId เป็น null ได้
	* (Offline Mode ไม่มี Round ฝั่ง Backend) แต่จะไม่มีทางมีสิทธิ์รางวัลเลย เพราะ
	* ระบบรางวัลผูกกับ roundId เสมอ (ดู server-gas/RewardService.gs) คะแนนคำนวณ
	* จาก Journey+Answers+MissionCompletions ฝั่ง server เอง ไม่ต้องส่งมาจากที่นี่
	*
	* [ใหม่] result.round (roundId/status/rewardStatus จากชีต "Round" โดยตรง) ถูก
	* เก็บไว้ใน status.value ด้วย — pages/round-summary.vue ใช้ค่านี้ตัดสินใจ
	* Poll ต่อ/redirect (ดู doc comment ด้านบนไฟล์)
	*
	* [แก้ไข] ไม่รับ/ไม่ส่ง `score` อีกต่อไป — เดิมเป็นช่องโหว่จริง (Backend เชื่อ
	* ค่านี้จาก Client ตรง ๆ และ pages/round-summary.vue เคยส่ง mockScore ของระบบ
	* ภารกิจ Mock เดิมมาที่นี่) server-gas ตอนนี้คำนวณคะแนนเองเสมอ ไม่มีทางลัดแล้ว
	* (ดู server-gas/RewardService.gs::actionGetRewardStatus_) */
	async function checkRewardStatus(roundId, userId) {
		status.value = null;
		return null;
	}
	/**
	* [ใหม่] ผู้เล่นกด "OK" ที่หน้า pages/reward-received.vue ยืนยันว่าได้รับ
	* รางวัลจริงแล้ว (RewardStatus: Claimed -> Confirmed) — เป็นจุดเดียวที่อนุญาต
	* ให้ reset State ของรอบปัจจุบันได้ (ผู้เรียกต้องรอ true กลับมาก่อนเสมอ ห้าม
	* reset ล่วงหน้า/auto-confirm) idempotent ฝั่ง Backend อยู่แล้ว (เรียกซ้ำตอน
	* Confirmed ไปแล้วก็ยังคืน true ปลอดภัย ไม่มีผลข้างเคียง)
	*/
	async function confirmRoundReceived(roundId, userId) {
		return false;
	}
	return {
		status: readonly(status),
		isChecking: readonly(isChecking),
		isConfirming: readonly(isConfirming),
		error: readonly(error),
		checkRewardStatus,
		confirmRoundReceived
	};
}

export { useReward as u };
//# sourceMappingURL=useReward-ig_NYST5.mjs.map
