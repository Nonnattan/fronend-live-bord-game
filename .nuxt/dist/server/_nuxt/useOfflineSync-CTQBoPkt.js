import { F as useState } from "../server.mjs";
import "./useProfile-Di4CdYil.js";
import "./useMemberApi-DKl7a10r.js";
import "./useAdventure-oyoryhV9.js";
import { t as useRound } from "./useRound-BmAVHypg.js";
import "./useAuth-mwKCwQRs.js";
import { computed, readonly } from "vue";
//#region composables/useOfflineSync.ts
var PENDING_KEY = "offlineSync:pendingCheckins";
var LAST_SYNC_KEY = "offlineSync:lastSyncAt";
/** สร้าง UUID สำหรับ 1 รายการใน Queue — ใช้ crypto.randomUUID() ถ้ามี (เบราว์เซอร์ยุคใหม่/HTTPS)
* ไม่มี (เช่น เบราว์เซอร์เก่า/เปิดผ่าน http บนเครื่อง LAN ตอน dev) -> fallback เป็นการสุ่มเองแทน */
function genUuid() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function readJson(key, fallback) {
	return fallback;
}
function useOfflineSync() {
	const isOnline = useState("offline-sync-is-online", () => true);
	const pendingCheckins = useState("offline-sync-pending", () => []);
	const initialized = useState("offline-sync-initialized", () => false);
	const isSyncing = useState("offline-sync-syncing", () => false);
	const lastSyncAt = useState("offline-sync-last-at", () => null);
	const lastMessage = useState("offline-sync-last-message", () => "");
	const pendingCount = computed(() => pendingCheckins.value.length);
	const hasPending = computed(() => pendingCount.value > 0);
	/** เรียกครั้งเดียวตอน mounted ของหน้า Scan เพื่อโหลด queue ล่าสุดจาก LocalStorage */
	function initOfflineSync() {
		if (initialized.value) return;
		pendingCheckins.value = readJson(PENDING_KEY, []);
		lastSyncAt.value = readJson(LAST_SYNC_KEY, null);
		initialized.value = true;
	}
	function persistQueue(next) {
		pendingCheckins.value = next;
	}
	function isQueued(stationId) {
		return pendingCheckins.value.some((item) => item.stationId === stationId);
	}
	/**
	* บันทึกฐานที่ผ่านสำเร็จลง LocalStorage (ไม่ยิง Google Sheet ทันที)
	* ผู้เรียก (pages/scan.vue) ต้องเช็คเองก่อนแล้วว่ายังไม่เคยผ่านฐานนี้
	* (ดู useAdventure().isVisited) — ฟังก์ชันนี้กันซ้ำอีกชั้นในระดับ queue เอง
	*/
	function queueCheckin(station, point) {
		if (isQueued(station.id)) return;
		const { currentRoundId } = useRound();
		persistQueue([...pendingCheckins.value, {
			uuid: genUuid(),
			stationId: station.id,
			stationName: station.name,
			point,
			visitedAt: Date.now(),
			roundId: currentRoundId.value
		}]);
	}
	/**
	* Sync ขึ้น Google Sheet จริง — เรียกเฉพาะตอนผ่านฐาน "นม" หรือกดปุ่ม Sync เอง
	* ทำตามลำดับ: Login LINE (ถ้ายังไม่ Login) -> Sync Members -> Sync Journey ->
	* Sync Score หากไม่มี Internet จะคืนค่า reason: 'offline' ทันที ไม่แตะ queue เลย
	*/
	async function syncNow() {
		return {
			success: false,
			reason: "offline",
			syncedCount: 0,
			remainingCount: pendingCount.value,
			message: "ไม่มีอินเทอร์เน็ต ข้อมูลจะ Sync อัตโนมัติเมื่อมีอินเทอร์เน็ต"
		};
	}
	return {
		isOnline,
		pendingCheckins: readonly(pendingCheckins),
		pendingCount,
		hasPending,
		isSyncing: readonly(isSyncing),
		lastSyncAt: readonly(lastSyncAt),
		lastMessage: readonly(lastMessage),
		initOfflineSync,
		isQueued,
		queueCheckin,
		syncNow
	};
}
//#endregion
export { useOfflineSync as t };

//# sourceMappingURL=useOfflineSync-CTQBoPkt.js.map