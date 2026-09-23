import { a as useOfflineMode, n as navigateTo } from '../virtual/entry.mjs';
import { u as useRoundTimer } from './useRoundTimer-Dx2_uv0V.mjs';
import { u as useProfile } from './useProfile-Di4CdYil.mjs';
import { u as useAdventure } from './useAdventure-OrKGgcht.mjs';
import { u as useRound } from './useRound-Vyr0MdjD.mjs';
import { u as useRoundSummary } from './useRoundSummary-C3F2b7Ya.mjs';
import { u as useStationMissions } from './useStationMissions-CjHnM2MF.mjs';
import { u as useOfflineSync } from './useOfflineSync-D8-RD8DK.mjs';
import { ref, readonly } from 'vue';

//#region composables/useForceEndRound.ts
function useForceEndRound() {
	const { stations } = useAdventure();
	const { isStationMissionComplete } = useStationMissions();
	const { isOnline, syncNow } = useOfflineSync();
	const { isOfflineMode, roundData, endRound } = useOfflineMode();
	const { endCurrentRound, currentRoundId } = useRound();
	const { saveRoundSummary } = useRoundSummary();
	const { clearAllTimers } = useRoundTimer();
	const { profile } = useProfile();
	const isForceEnding = ref(false);
	/**
	* เรียกเมื่อเห็น isRoundExpired/isStationExpired เป็น true — ปิด Round/บันทึก
	* สรุปผลด้วยความคืบหน้าจริงตอนนั้น แล้วพาไปหน้า /round-summary เสมอ (เหมือนกด
	* "จบเกม" เอง แต่ไม่มี Survey/ไม่ Commit ฐานนม) ผู้เรียก (pages/scan.vue) ควรปิด
	* Popup/กล้องของตัวเองก่อนเรียกฟังก์ชันนี้ (ฟังก์ชันนี้ไม่รู้จัก UI ของหน้าเรียก)
	*/
	async function forceEndRoundDueToTimeout(reason) {
		if (isForceEnding.value) return;
		isForceEnding.value = true;
		const endedReason = reason === "round" ? "round-timeout" : "station-timeout";
		try {
			const playedStations = stations.value.filter((s) => isStationMissionComplete(s.id)).map((s) => ({
				name: s.name,
				points: 0
			}));
			if (isOfflineMode.value) {
				endRound();
				saveRoundSummary({
					mode: "offline",
					startTime: roundData.value?.startedAt ? new Date(roundData.value.startedAt).toISOString() : null,
					endTime: new Date(roundData.value?.endedAt ?? Date.now()).toISOString(),
					stations: playedStations,
					totalPoint: null,
					roundId: null,
					userId: profile.value?.uid ?? null,
					endedReason
				});
			} else {
				const memberId = profile.value?.memberId;
				const roundIdForSummary = currentRoundId.value;
				if (memberId && isOnline.value) await syncNow().catch(() => null);
				let startTimeIso = null;
				let endTimeIso = (/* @__PURE__ */ new Date()).toISOString();
				if (memberId) {
					const ended = await endCurrentRound(memberId).catch(() => null);
					if (ended) {
						startTimeIso = ended.startTime || null;
						endTimeIso = ended.endTime || endTimeIso;
					}
				}
				saveRoundSummary({
					mode: "online",
					startTime: startTimeIso,
					endTime: endTimeIso,
					stations: playedStations,
					totalPoint: null,
					roundId: roundIdForSummary,
					userId: memberId || profile.value?.uid || null,
					endedReason
				});
			}
		} catch (err) {
			console.error("[forceEndRoundDueToTimeout] failed to build round summary", err);
		} finally {
			clearAllTimers();
			isForceEnding.value = false;
			await navigateTo("/round-summary");
		}
	}
	return {
		isForceEnding: readonly(isForceEnding),
		forceEndRoundDueToTimeout
	};
}

export { useForceEndRound as u };
//# sourceMappingURL=useForceEndRound-BKPtYIoi.mjs.map
