import { F as useState } from "../server.mjs";
import "./useProfile-Di4CdYil.js";
import "./useMemberApi-DKl7a10r.js";
import { computed, readonly, watch } from "vue";
//#region composables/useAdventure.ts
var STATION_TYPE_META = {
	corn: {
		icon: "🌽",
		label: "ฐานข้าวโพด",
		color: "#f2b134",
		colorDark: "#c98a12"
	},
	cow: {
		icon: "🐄",
		label: "ฐานวัว",
		color: "#f6f1e7",
		colorDark: "#4a2f18"
	},
	soil: {
		icon: "🌱",
		label: "ฐานดิน",
		color: "#8fc74e",
		colorDark: "#5a9e33"
	},
	milk: {
		icon: "🥛",
		label: "ฐานนม",
		color: "#eaf6ff",
		colorDark: "#5cb8e0"
	}
};
/**
* ฐานทั้ง 4 วางเป็นรูปสี่เหลี่ยม (Board Game Layout) ไม่ใช่เส้นตรง:
*
*   🌱 ดิน   ──────── 🐄 วัว
*      │                    │
*      │                    │
*   🌽 ข้าวโพด ──────── 🥛 นม (ฐานสุดท้าย)
*
* เรียงลำดับใน array ตามเข็มนาฬิกา (ข้าวโพด -> วัว -> นม -> ดิน) เพื่อให้
* LeafletMap.vue วาด Polyline วนรอบครบ 4 ด้านของสี่เหลี่ยมได้เลยแค่เชื่อม
* ฐาน i กับฐาน i+1 แล้ววนกลับฐานแรก (ดู drawPolylines() ใน LeafletMap.vue)
* ผู้เล่นกดฐานไหนก่อนก็ได้ ไม่บังคับลำดับ — สีเขียวจะขึ้นเฉพาะ "ด้าน" ของ
* สี่เหลี่ยมที่ทั้งสองฐานปลายทางผ่านแล้วเท่านั้น
*
* พิกัดอยู่ในย่านฟาร์มโคนม อ.มวกเหล็ก จ.สระบุรี ให้สมจริงกับธีม Farm Adventure
*/
var MOCK_ADVENTURE_STATIONS = [
	{
		id: "corn",
		name: "ฐานข้าวโพด",
		type: "corn",
		lat: 14.647,
		lng: 101.121
	},
	{
		id: "cow",
		name: "ฐานวัว",
		type: "cow",
		lat: 14.647,
		lng: 101.126
	},
	{
		id: "milk",
		name: "ฐานนม",
		type: "milk",
		lat: 14.643,
		lng: 101.126,
		isFinal: true
	},
	{
		id: "soil",
		name: "ฐานดิน",
		type: "soil",
		lat: 14.643,
		lng: 101.121
	}
];
/**
* ตำแหน่ง % (X-Y) ของฐานทั้ง 4 บนภาพพื้นหลังใหม่ (เกาะลอยฟาร์ม แบบมีตึก/หมุด/
* ป้ายชื่อวาดอยู่ในภาพเลย — public/images/adventure-map-bg.jpg) — ใช้ร่วมกัน
* ทั้งหน้า Map เต็มจอ (components/map/AdventureMap.vue) และ Mini Map บนหน้า
* Home (components/map/MiniMap.vue) เพื่อไม่ต้อง hardcode พิกัดซ้ำ 2 ที่ เป็นแค่
* Layout ของ UI ล้วน ๆ (ไม่ใช่ข้อมูลจาก Google Sheet/Admin จึงไม่ผิดกติกา
* "ห้าม hardcode ข้อมูลใหม่")
*
* [แก้ไข — เปลี่ยนพื้นหลังเป็นภาพที่มีหมุด/ป้ายชื่ออยู่ในภาพเลย] เดิมพื้นหลัง
* เป็นภาพเกาะลอยเปล่า ๆ แล้ววาดหมุด+ป้ายชื่อทับด้วย CSS/รูปแยก (บับเบิลกรอบแดง
* เด้งได้) — ผู้ใช้ต้องการภาพที่มีหมุด/ตึก/ป้ายชื่อวาดอยู่ในพื้นหลังเลยแทน
* (ยอมรับแล้วว่าหมุดจะเด้งไม่ได้ เพราะติดอยู่ในภาพนิ่งภาพเดียว) ค่าพิกัดนี้จึง
* เหลือไว้ใช้แค่วางตำแหน่ง "ติ๊กถูกสีเขียว" ทับเมื่อผ่านฐานแล้วเท่านั้น (ดู
* components/map/AdventureMap.vue, MiniMap.vue) ไม่ได้ใช้วาดหมุดเองอีกต่อไป —
* ไม่กระทบ BOARD_POSITION_ORDER ด้านบนเลย (การจับคู่ฐาน backend ใช้ "ลำดับใน
* array" ของ BOARD_POSITION_ORDER ล้วน ๆ ไม่ได้อ้างอิงค่า x/y ตรงนี้แต่อย่างใด)
* ตัวเลขคำนวณจากตำแหน่งจริงที่ตัดรูปหมุดออกมา (พิกเซล -> % ของภาพ 1139x1437)
*/
var ADVENTURE_STATION_POSITIONS = {
	corn: {
		x: 73,
		y: 33
	},
	cow: {
		x: 29,
		y: 56
	},
	soil: {
		x: 47,
		y: 67
	},
	milk: {
		x: 47,
		y: 80
	}
};
/**
* [ใหม่] ตำแหน่ง % (X-Y) ของ "จุดเริ่มต้น" — จุดคงที่จุดเดียวบนภาพพื้นหลัง
* เดียวกับ ADVENTURE_STATION_POSITIONS ด้านบน แสดงตลอดเวลาไม่ว่าจะผ่านฐานไหน
* มาแล้วหรือยัง (ไม่ใช่ ✓ ที่โผล่ตามสถานะเหมือนฐาน) ใช้บอกผู้เล่นว่าเดินเริ่ม
* จากจุดไหนของเกาะ — วางไว้บริเวณโซนคอกสัตว์/ทางเข้าด้านล่างซ้ายของภาพ ปรับ
* พิกัดตรงนี้จุดเดียวได้เลยถ้าตำแหน่งจริงไม่ตรงกับจุดเริ่มบนพื้นที่จริง (ดู
* components/map/AdventureMap.vue สำหรับส่วนที่ render จุดนี้)
*/
var ADVENTURE_START_POINT = {
	x: 12,
	y: 90
};
/** ค่าตั้งต้นสำหรับ Demo Mockup: ผ่านฐานแรก (ข้าวโพด) แล้ว 1 ฐาน */
var DEFAULT_VISITED = [];
function useAdventure() {
	const visitedIds = useState("adventure-visited-stations", () => []);
	const initialized = useState("adventure-initialized", () => false);
	const visitedRoundId = useState("adventure-visited-round-id", () => null);
	const backendTotalPoint = useState("adventure-backend-total-point", () => null);
	const isSyncingFromBackend = useState("adventure-syncing-from-backend", () => false);
	/** [แก้ไข] คะแนนของ "รอบปัจจุบัน" ที่ sync ไว้ใน LocalStorage (key: adventureInitialScore)
	* — ไม่ใช่คะแนนสะสมจาก Backend อีกต่อไป (ดูคำอธิบายเต็ม ๆ ที่ INITIAL_SCORE_KEY
	* ด้านบนของไฟล์) แค่เป็นสำเนาสำรองของ roundEarned (คำนวณจาก visitedIds) กันไว้
	* เผื่อ refresh หน้ากลางรอบก่อนที่ stationsState จะโหลดคะแนนต่อฐานจาก backend
	* เสร็จ (ตอนนั้น roundEarned อาจคำนวณคลาดเคลื่อนชั่วคราวถ้าใช้ POINTS_PER_STATION
	* fallback ผิดจากที่ Admin ตั้งจริง) — ถูกล้างเป็น 0 ทุกครั้งที่จบรอบ (resetJourney())
	* เหมือนกับ visitedIds ทุกประการ ไม่ค้างข้ามรอบอีกต่อไป */
	const initialScore = useState("adventure-initial-score", () => null);
	useState("adventure-initial-score-initialized", () => false);
	/** [Fix — root cause ของ "adventureVisitedStations เป็น [\"milk\"] หลัง reset"]
	* ตัวนับรุ่น (epoch) — resetJourney() บวกเลขนี้ทุกครั้งที่ล้างรอบ ส่วน
	* refreshFromBackend() จะจำเลขนี้ไว้ตอนเริ่มทำงาน (startEpoch) แล้วเช็คซ้ำก่อน
	* เขียน visitedIds/persist() ทุกจุด — เหตุผล: refreshFromBackend() ถูกเรียกจาก
	* runSync() แบบ async ที่เริ่มทำงาน "ตอนสแกนผ่านฐานนม" (ก่อนกด "จบเกม") แต่กว่าจะ
	* ได้ผลตอบกลับจาก getRound()/getJourney() (เครือข่ายมือถือช้า) ผู้เล่นอาจกด
	* "จบเกม" เสร็จไปแล้ว (endCurrentRound() + resetJourney() ทำงานเร็วกว่าเพราะเป็น
	* request คนละตัว) — พอ response ของ refreshFromBackend() ที่ "ยิงไปก่อน reset"
	* แต่ "ตอบกลับมาหลัง reset" (stale response) มาถึง มันจะเห็น Round เดิมเป็น
	* 'Started' อยู่ (เพราะ getRound() ของมันเองอาจ race แซง roundEnd() ที่ยังไม่ทัน
	* commit) แล้ว merge ฐานที่เพิ่ง sync สำเร็จ (เช่น "นม") กลับเข้า visitedIds ทับ
	* ค่าที่เพิ่ง resetJourney() ล้างไปแล้ว — แก้โดยให้ response ที่ "เก่ากว่า reset
	* ล่าสุด" (epoch ไม่ตรงกับตอนเริ่ม) ถูกทิ้งไปเฉย ๆ ไม่เขียนทับ state ปัจจุบันอีก
	* ไม่กระทบ Google Sheet เลย เพราะ checkin() (ที่บันทึกคะแนนขึ้นชีตจริง) เสร็จไป
	* ก่อนหน้า refreshFromBackend() ในลำดับของ syncNow() อยู่แล้ว — แก้แค่ "การเขียน
	* กลับเข้า visitedIds/localStorage ฝั่งเครื่องนี้" ที่มาช้าเกินไปเท่านั้น */
	const resetEpoch = useState("adventure-reset-epoch", () => 0);
	const stationsState = useState("adventure-stations", () => MOCK_ADVENTURE_STATIONS.map((s) => ({
		...s,
		points: 250,
		active: true
	})));
	const stationsInitialized = useState("adventure-stations-initialized", () => false);
	const stations = computed(() => stationsState.value.filter((s) => s.active !== false));
	const totalStations = computed(() => stations.value.length);
	const visitedCount = computed(() => visitedIds.value.length);
	/**
	* [แก้ไข — adventureInitialScore ต้องเป็นคะแนน "ของรอบปัจจุบัน" เท่านั้น]
	* totalPoint คำนวณจาก "ฐานที่ผ่านแล้วในรอบปัจจุบัน" (visitedIds ในเครื่อง ซึ่ง
	* ถูก resetJourney() ล้างเป็น [] ทุกครั้งที่จบรอบ) เพียงอย่างเดียวเสมอ — ไม่บวก
	* คะแนนสะสมจาก Backend (getScore()/backendTotalPoint) เข้ามาอีกต่อไป เพราะเป็น
	* คนละความหมายกัน (คะแนนสะสมข้ามรอบ ≠ คะแนนของรอบที่กำลังเล่นอยู่)
	*
	* initialScore (localStorage key: adventureInitialScore) เป็นแค่ "สำเนาสำรอง"
	* ของค่านี้ sync ให้ตรงกันเสมอผ่าน watch ด้านล่าง (ไม่ได้ถูกบวกเข้ากับ roundEarned
	* ซ้ำ — กันปัญหา Double Count) มีไว้เผื่อ refresh หน้ากลางรอบก่อน stationsState
	* จะโหลดคะแนนต่อฐานจาก backend เสร็จ (ช่วง window สั้น ๆ ตอนเปิดแอปใหม่)
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
	function getStoredVisited() {
		return null;
	}
	/** [Fix] อ่าน roundId ที่ visitedIds ในเครื่องนี้ผูกอยู่ (คู่กับ STORAGE_ROUND_KEY) */
	function getStoredRoundId() {
		return null;
	}
	watch(totalPoint, (score) => {});
	async function initAdventure(userId) {
		if (initialized.value) return;
		const stored = getStoredVisited();
		visitedIds.value = stored ?? DEFAULT_VISITED;
		visitedRoundId.value = getStoredRoundId();
		initialized.value = true;
		await Promise.all([refreshFromBackend(userId), refreshStationsFromBackend()]);
	}
	/**
	* ดึงรายชื่อฐานจากชีต "Stations" (จัดการผ่านหน้า Admin) มาแปะทับ
	* name/points/active/description/imageUrl/lat/lng ของฐาน mock 4 อันเดิม —
	* ต้อง "จับคู่" กับ MOCK_ADVENTURE_STATIONS ทีละฐานก่อนเสมอ (เกมนี้เป็น Board
	* Game ผังคงที่ 4 ฐาน — corn/cow/soil/milk — ผูกกับ QR Code/ปุ่ม Scan ตายตัว
	* ดู pages/scan.vue STATION_CODE_MAP + FINAL_STATION_ID จึงไม่เปลี่ยน "จำนวน/id"
	* ฐานตามอำเภอใจจาก Admin ได้ แต่ "ตำแหน่งบนแผนที่ (lat/lng)" ปรับได้จาก Admin
	* แล้วผ่านคอลัมน์ Lat/Lng ในชีต Stations)
	*
	* จับคู่ด้วย "ลำดับ (order)" เท่านั้น — ห้ามใช้ Type/ชื่อฐานมาช่วยจัดลำดับ
	* เด็ดขาด: เรียงฐาน Backend ตาม order น้อย -> มาก แล้ว zip เข้ากับ
	* BOARD_POSITION_ORDER ทีละตำแหน่ง (order 1 = ตำแหน่งแรกในผัง [ซ้ายล่าง],
	* order 2 = ตำแหน่งที่สอง [ซ้ายบน], ...) ดูผัง/คำอธิบายเต็มที่คอมเมนต์เหนือ
	* BOARD_POSITION_ORDER ด้านบน
	* lat/lng: ใช้ค่าจาก Admin ถ้าตั้งไว้ (ไม่ null ทั้งคู่) ไม่งั้น fallback ไปใช้
	* พิกัดตั้งต้นของ mock เหมือนเดิม (ทำให้ Admin ย้ายหมุดบนแผนที่ได้จริงโดยไม่ต้อง
	* แก้โค้ด frontend เลย)
	* ฐานที่ Admin ปิดไว้ (active:false) จะไม่ถูกนับ/แสดงในหน้าเกมเลย (ดู `stations`
	* computed ด้านบนที่กรอง active ออก) ดึงไม่สำเร็จ (ออฟไลน์/API ล่ม) -> เงียบไว้
	* ใช้ค่า mock/ค่าล่าสุดที่มีอยู่ต่อไป ไม่กระทบการใช้งานหน้าปัจจุบัน
	*/
	async function refreshStationsFromBackend() {
		if (stationsInitialized.value) return;
	}
	/**
	* ดึงฐานที่ผ่านจริง (getJourney) + คะแนนสะสมจริง (getScore) จาก Google Sheet
	* มา merge ทับ state ปัจจุบัน — แยกออกมาจาก initAdventure() เพื่อให้เรียกซ้ำ
	* ได้อีกครั้งหลัง Sync สำเร็จ (ดู useOfflineSync.ts -> syncNow()) โดยไม่ติด
	* เงื่อนไข "initialized ครั้งเดียว" ของ initAdventure()
	*
	* [Fix — root cause ของ "มือถือค้าง 1/4 แต่คอมเป็น 0/4"] LocalStorage แยกกันคนละ
	* เครื่อง — เครื่องที่กด "จบเกม" (เช่นคอม) จะ resetJourney() ล้าง visitedIds ของ
	* ตัวเองถูกต้อง แต่เครื่องอื่น (มือถือ) ที่ไม่ได้กดจบเกม ไม่มีทางรู้เรื่องนี้เลยจนกว่า
	* จะเปิดแอปมาเช็คกับ backend เอง — เดิมโค้ดตรงนี้เช็ค backend ถูกต้องอยู่แล้วว่า
	* Round ปัจจุบันคือ Round ไหน (currentRoundId ด้านล่าง) แต่ตอน merge journey กลับ
	* ใช้วิธี "union" (เอาของเก่าในเครื่อง + ของจาก backend มารวมกันเสมอ) โดยไม่เคย
	* เทียบว่าของเก่าที่ค้างอยู่ในเครื่องนั้น "เป็นของ Round ที่ยัง Active จริงหรือไม่"
	* เลยสักครั้ง ทำให้ฐานจาก Round ที่จบไปแล้ว (จบโดยเครื่องอื่น) ค้างอยู่ในเครื่องนี้
	* ตลอดไป ไม่มีทางถูกล้างออกเอง — แก้โดยเทียบ currentRoundId (Round Active จริงจาก
	* backend) กับ visitedRoundId (Round ที่ visitedIds ในเครื่องนี้เป็นเจ้าของอยู่ตอนนี้
	* — ดู STORAGE_ROUND_KEY ด้านบน) ก่อนเสมอ: ไม่ตรงกัน (คนละ Round หรือไม่มี Round
	* Active เลย) -> ล้าง visitedIds ในเครื่องนี้ทิ้งก่อน (ไม่ merge ของเก่าเข้ามาอีก)
	* แล้วค่อย merge journey ที่ backend ยืนยันแล้วของ Round Active จริงเข้าไปแทน (รองรับ
	* เคสอีกเครื่องสแกนฐานของ Round ใหม่ไปก่อนหน้านี้แล้วด้วย) ไม่มีการลบ/แก้ Journey/
	* Round ใน Database ใด ๆ ทั้งสิ้น แก้แค่ฝั่งอ่าน/แสดงผลของเครื่องนี้เท่านั้น
	*/
	async function refreshFromBackend(userId) {}
	/**
	* แตะ Marker -> Toggle ผ่านฐาน/ยกเลิก พร้อมอัปเดต Point และ Polyline (ผ่าน computed)
	*
	* [Fix — บั๊กคะแนนฐานหายตอนถึงหน้าสรุปผล] เดิมฟังก์ชันนี้ไม่รับ/ไม่อัปเดต
	* visitedRoundId เลย — เรียก persist(next) โดยไม่ส่ง roundId ตามมาด้วย ทำให้
	* STORAGE_ROUND_KEY ใน LocalStorage "ไม่ถูกแตะเลย" ทุกครั้งที่สแกนฐาน ถ้า
	* ensureRoundStarted() (pages/scan.vue) เพิ่งได้ roundId จริงมาช้ากว่าการสแกน
	* ฐานแรก (เน็ตมือถือกลางแปลงหลุด/ช้า — เคสที่เกิดขึ้นได้จริงบ่อยกับเกมนี้)
	* visitedRoundId ในเครื่องจะค้างเป็นค่าเก่า/null ต่อไปเรื่อย ๆ ทั้งที่ visitedIds
	* มีฐานที่ผ่านจริงอยู่แล้ว — พอ refreshFromBackend() รอบถัดไป (เช่น เปลี่ยนหน้า
	* Scan -> Map) เทียบ currentRoundId (roundId จริงจาก backend) กับ visitedRoundId
	* เก่านี้แล้วเจอไม่ตรงกัน จะเข้าใจผิดว่า "เป็นข้อมูลของรอบเก่า" แล้วล้าง
	* visitedIds ทิ้งทั้งหมดทันที (ดู refreshFromBackend() ด้านบน) — นี่คือสาเหตุจริง
	* ที่คะแนนจากฐานที่สแกนไปแล้ว "หายไป" ก่อนถึงฐานสุดท้าย
	*
	* แก้โดยรับ roundId ที่ "สดจริง ๆ" จากผู้เรียก (pages/scan.vue ส่ง
	* currentRoundId.value ที่อ่านจาก useRound() ตรง ๆ ทุกครั้งที่ตอบ ไม่ใช่ค่า cache)
	* มาอัปเดต visitedRoundId.value ทันทีที่ toggleStation() ทำงาน — ทำให้ระบบ
	* "ซ่อมตัวเองได้" แม้ ensureRoundStarted() ครั้งแรกจะ resolve ช้า/ล้มเหลวชั่วคราว
	* ก็ตาม ไม่ส่ง roundId มา (undefined) = พฤติกรรมเดิมทุกประการ (ไม่แตะ
	* visitedRoundId/STORAGE_ROUND_KEY) เผื่อมีจุดเรียกอื่นที่ยังไม่พร้อมส่งค่านี้
	*/
	function toggleStation(stationId, roundId) {
		const next = visitedIds.value.includes(stationId) ? visitedIds.value.filter((id) => id !== stationId) : [...visitedIds.value, stationId];
		visitedIds.value = next;
		if (roundId !== void 0) visitedRoundId.value = roundId;
	}
	/**
	* [Fix] ตอนนี้เรียกจริงตอนกด "จบเกม" ที่ฐานนม (ดู pages/scan.vue ->
	* endGameAfterFinalStation) — เดิมฟังก์ชันนี้มีอยู่แล้วแต่ไม่เคยถูกเรียกใช้ที่ไหน
	* เลยสักจุด ทำให้ฐานที่ผ่านแล้ว/คะแนน ค้างอยู่ในเครื่องข้ามรอบ (Round เปลี่ยนไปแล้ว
	* แต่ Client state ไม่รีเซ็ต) เพิ่ม backendTotalPoint = null (เดิมไม่รีเซ็ต) ด้วย
	* เพื่อเคลียร์คะแนนที่ cache ไว้จากรอบก่อน ให้รอบใหม่คำนวณคะแนนใหม่ทั้งหมด
	* ไม่มีการลบ/แก้ข้อมูลใน Database ใด ๆ ทั้งสิ้น — ล้างแค่ LocalStorage/State ฝั่ง
	* เครื่องนี้เท่านั้น (Round/Journey/Score เก่าในชีตยังอยู่ครบเหมือนเดิม)
	*
	* [Fix] ล้าง visitedRoundId (แท็ก Round เจ้าของ visitedIds ในเครื่องนี้ — ดู
	* STORAGE_ROUND_KEY ด้านบน) ด้วย เพราะ Round ที่เพิ่งจบไปนี้ไม่ใช่ Round Active
	* แล้ว ให้ refreshFromBackend() ครั้งถัดไป (ตอนเริ่มรอบใหม่) รู้ว่าต้อง merge
	* journey ของ Round ใหม่จริง ๆ เท่านั้น ไม่ใช่ยึดแท็ก Round เก่าไว้เฉย ๆ
	*
	* [Debug — ชั่วคราว] log [ROUND RESET] เพื่อยืนยันว่าเครื่องนี้ reset จริงตอนกด
	* จบเกม (เทียบ previousVisited/previousScore ก่อน reset กับ resetVisited/
	* resetScore หลัง reset) — ลบออกได้เมื่อยืนยันบั๊กมือถือหายแล้ว
	*
	* [Fix — root cause ของ "adventureVisitedStations เป็น [\"milk\"] หลัง reset"]
	* บวก resetEpoch ทุกครั้งที่ reset — เพื่อบอก refreshFromBackend() ที่อาจกำลัง
	* รอ network ค้างอยู่ (ยิงไปตั้งแต่ตอนสแกนผ่านฐานนม ก่อนกด "จบเกม") ว่า response
	* ที่กำลังจะได้กลับมานั้น "เก่าเกินไป" แล้ว ห้ามเอามาเขียนทับ visitedIds ของรอบใหม่
	* ที่เพิ่ง reset นี้อีก (ดูคำอธิบายเต็ม ๆ ที่ resetEpoch ด้านบนของไฟล์)
	*/
	function resetJourney() {
		visitedIds.value;
		totalPoint.value;
		visitedRoundId.value;
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
//#endregion
export { useAdventure as i, ADVENTURE_STATION_POSITIONS as n, STATION_TYPE_META as r, ADVENTURE_START_POINT as t };

//# sourceMappingURL=useAdventure-oyoryhV9.js.map