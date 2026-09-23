import { f as useState } from '../virtual/entry.mjs';
import { computed, watch, readonly } from 'vue';

/**
* ตำแหน่ง % (X-Y) ของฐานบนภาพพื้นหลัง (เกาะลอยฟาร์ม แบบมีตึก/หมุด/ป้ายชื่อวาดอยู่
* ในภาพเลย — public/images/adventure-map-bg.jpg) — ใช้ร่วมกันทั้งหน้า Map เต็มจอ
* (components/map/AdventureMap.vue) และ Mini Map บนหน้า Home (MiniMap.vue)
*
* [แก้ไข — เลิกผูกกับ id/type ฐานตายตัว] เดิม ADVENTURE_STATION_POSITIONS เป็น
* Record คีย์ด้วย id ฐาน mock (corn/cow/soil/milk) ตรง ๆ — เปลี่ยนเป็น "pool"
* ตำแหน่งที่จับคู่ด้วย "ลำดับ (index หลังเรียง order)" ล้วน ๆ แทน ยังคงพิกัดเดิม
* 4 ตำแหน่งไว้ (pixel -> % ของภาพ 1139x1437 ที่ตัดรูปหมุดออกมาแล้ว) ทำให้ระบบ
* 4 ฐานปัจจุบันหน้าตาเหมือนเดิมทุกประการ — ฐานที่ 5 เป็นต้นไป (เกินจำนวน pool)
* ใช้ getStationPosition() คำนวณตำแหน่ง fallback สดแทน (ดูด้านล่าง)
*/
var DEFAULT_POSITION_POOL = [
	{
		x: 73,
		y: 33
	},
	{
		x: 29,
		y: 56
	},
	{
		x: 47,
		y: 67
	},
	{
		x: 47,
		y: 80
	}
];
/** คืนตำแหน่ง % (x,y) ของฐานตามลำดับ (index หลังเรียง order น้อย -> มาก, 0-based)
* — ใช้ pool ตำแหน่งที่ตั้งใจวาดไว้ก่อน ถ้า index เกิน pool (ฐานที่ 5 เป็นต้นไป)
* จะกระจายตำแหน่ง fallback เพิ่มแถวใหม่ใต้ pool เดิมแทน (ไม่ทับซ้อนที่จุดเดียว
* เหมือน fallback แบบเดิม ไม่ล้ม ไม่ผูกกับจำนวนฐานตายตัว) */
function getStationPosition(index) {
	const pooled = DEFAULT_POSITION_POOL[index];
	if (pooled) return pooled;
	const overflowIndex = index - DEFAULT_POSITION_POOL.length;
	const columns = 4;
	const col = overflowIndex % columns;
	const row = Math.floor(overflowIndex / columns);
	return {
		x: 15 + col * 22,
		y: 90 - row * 8
	};
}
var GENERIC_VISUAL_PALETTE = [
	{
		icon: "📍",
		color: "#f2b134",
		colorDark: "#c98a12"
	},
	{
		icon: "📍",
		color: "#8fc74e",
		colorDark: "#5a9e33"
	},
	{
		icon: "📍",
		color: "#eaf6ff",
		colorDark: "#5cb8e0"
	},
	{
		icon: "📍",
		color: "#f6f1e7",
		colorDark: "#4a2f18"
	}
];
function getStationVisual(index) {
	return GENERIC_VISUAL_PALETTE[index % GENERIC_VISUAL_PALETTE.length];
}
/**
* [ใหม่] ตำแหน่ง % (X-Y) ของ "จุดเริ่มต้น" — จุดคงที่จุดเดียวบนภาพพื้นหลัง
* เดียวกับ DEFAULT_POSITION_POOL ด้านบน แสดงตลอดเวลาไม่ว่าจะผ่านฐานไหนมาแล้วหรือ
* ยัง (ไม่ใช่ ✓ ที่โผล่ตามสถานะเหมือนฐาน) ใช้บอกผู้เล่นว่าเดินเริ่มจากจุดไหนของ
* เกาะ — วางไว้บริเวณโซนคอกสัตว์/ทางเข้าด้านล่างซ้ายของภาพ */
var ADVENTURE_START_POINT = {
	x: 12,
	y: 90
};
var DEFAULT_VISITED = [];
function useAdventure() {
	const visitedIds = useState("adventure-visited-stations", () => []);
	const initialized = useState("adventure-initialized", () => false);
	const visitedRoundId = useState("adventure-visited-round-id", () => null);
	const backendTotalPoint = useState("adventure-backend-total-point", () => null);
	const isSyncingFromBackend = useState("adventure-syncing-from-backend", () => false);
	const initialScore = useState("adventure-initial-score", () => null);
	useState("adventure-initial-score-initialized", () => false);
	/** [Fix — root cause ของ "adventureVisitedStations เป็น [\"milk\"] หลัง reset"]
	* ตัวนับรุ่น (epoch) — resetJourney() บวกเลขนี้ทุกครั้งที่ล้างรอบ ส่วน
	* refreshFromBackend() จะจำเลขนี้ไว้ตอนเริ่มทำงาน (startEpoch) แล้วเช็คซ้ำก่อน
	* เขียน visitedIds/persist() ทุกจุด */
	const resetEpoch = useState("adventure-reset-epoch", () => 0);
	const stationsState = useState("adventure-stations", () => []);
	const stationsInitialized = useState("adventure-stations-initialized", () => false);
	const stations = computed(() => stationsState.value.filter((s) => s.active !== false).sort((a, b) => a.order - b.order));
	const totalStations = computed(() => stations.value.length);
	const visitedCount = computed(() => visitedIds.value.length);
	/**
	* totalPoint คำนวณจาก "ฐานที่ผ่านแล้วในรอบปัจจุบัน" (visitedIds ในเครื่อง ซึ่ง
	* ถูก resetJourney() ล้างเป็น [] ทุกครั้งที่จบรอบ) เพียงอย่างเดียวเสมอ — ไม่บวก
	* คะแนนสะสมจาก Backend (getScore()/backendTotalPoint) เข้ามาอีกต่อไป เพราะเป็น
	* คนละความหมายกัน (คะแนนสะสมข้ามรอบ ≠ คะแนนของรอบที่กำลังเล่นอยู่)
	*/
	const totalPoint = computed(() => {
		return visitedIds.value.reduce((sum, id) => {
			return sum + (stationsState.value.find((s) => s.id === id)?.points ?? 250);
		}, 0);
	});
	const isComplete = computed(() => visitedCount.value >= totalStations.value);
	function isVisited(stationId) {
		return visitedIds.value.includes(stationId);
	}
	function getStoredRoundId() {
		return null;
	}
	watch(totalPoint, (score) => {});
	async function initAdventure(userId) {
		if (initialized.value) return;
		visitedIds.value = DEFAULT_VISITED;
		visitedRoundId.value = getStoredRoundId();
		initialized.value = true;
		await Promise.all([refreshFromBackend(), refreshStationsFromBackend()]);
	}
	/**
	* ดึงรายชื่อฐานทั้งหมดจากชีต "Stations" (จัดการผ่านหน้า Admin) — จำนวน/id ฐาน
	* มาจาก Backend ทั้งหมด ไม่มี mock/ฐานตายตัวให้จับคู่อีกต่อไป (ดูคอมเมนต์หัวไฟล์)
	* isFinal คำนวณจาก order สูงสุดในบรรดาฐาน active (แทนการ hardcode id ฐาน
	* สุดท้ายตายตัว) ดึงไม่สำเร็จ (ออฟไลน์/API ล่ม) -> เงียบไว้ ใช้ค่าล่าสุดที่มีอยู่
	* ต่อไป ไม่กระทบการใช้งานหน้าปัจจุบัน
	*/
	async function refreshStationsFromBackend() {
		if (stationsInitialized.value) return;
	}
	/**
	* ดึงฐานที่ผ่านจริง (getJourney) + คะแนนสะสมจริง (getScore) จาก Google Sheet
	* มา merge ทับ state ปัจจุบัน — แยกออกมาจาก initAdventure() เพื่อให้เรียกซ้ำ
	* ได้อีกครั้งหลัง Sync สำเร็จ (ดู useOfflineSync.ts -> syncNow()) โดยไม่ติด
	* เงื่อนไข "initialized ครั้งเดียว" ของ initAdventure()
	*/
	async function refreshFromBackend(userId) {}
	/**
	* แตะ Marker -> Toggle ผ่านฐาน/ยกเลิก พร้อมอัปเดต Point และ Polyline (ผ่าน computed)
	*/
	function toggleStation(stationId, roundId) {
		const next = visitedIds.value.includes(stationId) ? visitedIds.value.filter((id) => id !== stationId) : [...visitedIds.value, stationId];
		visitedIds.value = next;
		if (roundId !== void 0) visitedRoundId.value = roundId;
	}
	/** เรียกตอนกด "จบเกม" — ล้างฐานที่ผ่านแล้ว/คะแนนของรอบที่เพิ่งจบทิ้ง ไม่มีการ
	* ลบ/แก้ข้อมูลใน Database ใด ๆ ทั้งสิ้น — ล้างแค่ LocalStorage/State ฝั่งเครื่อง
	* นี้เท่านั้น (Round/Journey/Score เก่าในชีตยังอยู่ครบเหมือนเดิม) */
	function resetJourney() {
		resetEpoch.value += 1;
		visitedIds.value = [];
		visitedRoundId.value = null;
		backendTotalPoint.value = null;
		initialScore.value = 0;
	}
	return {
		stations,
		totalStations,
		visitedIds: readonly(visitedIds),
		visitedCount,
		totalPoint,
		initialScore: readonly(initialScore),
		isComplete,
		isSyncingFromBackend: readonly(isSyncingFromBackend),
		isVisited,
		initAdventure,
		refreshFromBackend,
		refreshStationsFromBackend,
		toggleStation,
		resetJourney
	};
}

export { ADVENTURE_START_POINT as A, getStationPosition as a, getStationVisual as g, useAdventure as u };
//# sourceMappingURL=useAdventure-OrKGgcht.mjs.map
