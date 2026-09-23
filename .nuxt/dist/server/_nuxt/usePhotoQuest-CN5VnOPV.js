import { F as useState } from "../server.mjs";
import "./useProfile-Di4CdYil.js";
import "./useMemberApi-DKl7a10r.js";
import { computed, readonly } from "vue";
//#region composables/useOfflinePhotoQuestSync.ts
var PENDING_KEY = "photoQuestSync:pendingAttempts";
function readJson(key, fallback) {
	return fallback;
}
function useOfflinePhotoQuestSync() {
	const pendingAttempts = useState("photo-quest-sync-pending", () => []);
	const initialized = useState("photo-quest-sync-initialized", () => false);
	const isSyncing = useState("photo-quest-sync-syncing", () => false);
	const lastMessage = useState("photo-quest-sync-last-message", () => "");
	const pendingCount = computed(() => pendingAttempts.value.length);
	const hasPending = computed(() => pendingCount.value > 0);
	function initOfflinePhotoQuestSync() {
		if (initialized.value) return;
		pendingAttempts.value = readJson(PENDING_KEY, []);
		initialized.value = true;
	}
	function persistQueue(next) {
		pendingAttempts.value = next;
	}
	/** เรียกจาก usePhotoQuest.ts ทันทีที่ตรวจจับผ่าน — เก็บลง LocalStorage ก่อน
	* เสมอ ไม่ยิง Backend ตรงนี้ */
	function queuePhotoQuestAttempt(attempt) {
		if (pendingAttempts.value.some((item) => item.questId === attempt.questId)) return;
		persistQueue([...pendingAttempts.value, attempt]);
	}
	/** Sync ขึ้น Backend — เรียกตอนมีเน็ต (จากปุ่ม Sync เองในหน้า list หรือ auto
	* sync ตอนกลับมามีเน็ต ถ้าต้องการเพิ่ม plugin แยกภายหลังแบบ
	* plugins/offline-sync.client.ts ของเดิม) */
	async function syncNow() {
		return {
			success: false,
			syncedCount: 0,
			message: "กำลัง Sync อยู่ หรือไม่ได้อยู่บน client"
		};
	}
	return {
		pendingAttempts: readonly(pendingAttempts),
		pendingCount,
		hasPending,
		isSyncing: readonly(isSyncing),
		lastMessage: readonly(lastMessage),
		initOfflinePhotoQuestSync,
		queuePhotoQuestAttempt,
		syncNow
	};
}
//#endregion
//#region services/detection/providers/colorProvider.ts
function hexToRgb(hex) {
	const clean = hex.trim().replace("#", "");
	if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
	return {
		r: parseInt(clean.slice(0, 2), 16),
		g: parseInt(clean.slice(2, 4), 16),
		b: parseInt(clean.slice(4, 6), 16)
	};
}
/** คำนวณสีเฉลี่ย + ความสว่างเฉลี่ยของภาพ โดยสุ่มตัวอย่างพิกเซล (ไม่ต้องอ่านทุก
* พิกเซลเพื่อความเร็ว — สุ่มทุก ๆ N พิกเซลก็แม่นยำพอสำหรับงานนี้) */
function analyzeImage(image) {
	const canvas = (void 0).createElement("canvas");
	const maxSize = 200;
	const srcW = "width" in image ? image.width : 0;
	const srcH = "height" in image ? image.height : 0;
	const scale = Math.min(1, maxSize / Math.max(srcW, srcH, 1));
	canvas.width = Math.max(1, Math.round(srcW * scale));
	canvas.height = Math.max(1, Math.round(srcH * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("ไม่สามารถสร้าง Canvas 2D Context ได้ (เบราว์เซอร์ไม่รองรับ)");
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let sumR = 0;
	let sumG = 0;
	let sumB = 0;
	let count = 0;
	for (let i = 0; i < data.length; i += 4) {
		sumR += data[i] ?? 0;
		sumG += data[i + 1] ?? 0;
		sumB += data[i + 2] ?? 0;
		count += 1;
	}
	const avgR = sumR / count;
	const avgG = sumG / count;
	const avgB = sumB / count;
	return {
		avgR,
		avgG,
		avgB,
		avgBrightness: (.299 * avgR + .587 * avgG + .114 * avgB) / 255
	};
}
function detectColor(input) {
	const target = hexToRgb(input.rule.target);
	if (!target) return {
		passed: false,
		confidence: 0,
		reason: `target ของเควสนี้ไม่ใช่รูปแบบสี hex ที่ถูกต้อง ("${input.rule.target}")`,
		providerId: "canvas-color-v1"
	};
	const { avgR, avgG, avgB } = analyzeImage(input.image);
	const maxDistance = Math.sqrt(255 ** 2 * 3);
	const similarity = 1 - Math.sqrt((avgR - target.r) ** 2 + (avgG - target.g) ** 2 + (avgB - target.b) ** 2) / maxDistance;
	const passed = similarity >= input.rule.confidence;
	return {
		passed,
		confidence: Number(similarity.toFixed(3)),
		reason: passed ? void 0 : `สีในภาพไม่ตรงกับสีที่กำหนด (ความคล้าย ${(similarity * 100).toFixed(0)}%)`,
		providerId: "canvas-color-v1"
	};
}
function detectImageCondition(input) {
	const { avgBrightness } = analyzeImage(input.image);
	switch (input.rule.target) {
		case "min-brightness": {
			const passed = avgBrightness >= input.rule.confidence;
			return {
				passed,
				confidence: Number(avgBrightness.toFixed(3)),
				reason: passed ? void 0 : "ภาพมืดเกินไป กรุณาถ่ายในที่ที่มีแสงสว่างเพียงพอ",
				providerId: "canvas-color-v1"
			};
		}
		default: return {
			passed: false,
			confidence: 0,
			reason: `ยังไม่รองรับเงื่อนไข image_condition target="${input.rule.target}"`,
			providerId: "canvas-color-v1"
		};
	}
}
var colorProvider = {
	id: "canvas-color-v1",
	supports: ["color", "image_condition"],
	isOfflineCapable: true,
	async detect(input) {
		if (input.rule.detectionType === "color") return detectColor(input);
		if (input.rule.detectionType === "image_condition") return detectImageCondition(input);
		throw new Error(`colorProvider ไม่รองรับ detectionType="${input.rule.detectionType}"`);
	}
};
//#endregion
//#region services/detection/providers/cocoLabels.ts
/**
* services/detection/providers/cocoLabels.ts
* ---------------------------------------------------------------------------
* ไฟล์ใหม่ (Phase 2 — Object Detection จริง) — ตารางแปลง Label ของโมเดล
* COCO-SSD (80 คลาส ชื่อเป็นภาษาอังกฤษล้วน) ให้ใช้งานกับข้อมูลเควสภาษาไทยได้
*
* ทำไมต้องแยกไฟล์: `cocoSsdProvider.ts` ควรมีแต่ Logic การตรวจจับล้วน ๆ ส่วน
* "ตารางคำ" เป็นข้อมูลที่แก้บ่อยกว่ามาก (เพิ่มคำเรียกใหม่ที่คนหน้างานใช้จริง)
* แยกออกมาให้แก้ได้โดยไม่ต้องอ่าน Logic เลย
*
* *** สำคัญ: ไฟล์นี้ "ไม่ใช่" การ hard-code เควส *** — เควสยังมาจากชีต
* "PhotoQuests" เหมือนเดิมทุกประการ (ดู types/photoQuest.ts) ไฟล์นี้แค่ช่วยให้
* คนกรอกชีตพิมพ์ target เป็นภาษาไทย ("วัว") แทนที่จะต้องจำ label อังกฤษของ
* โมเดล ("cow") เท่านั้น — กรอกเป็นอังกฤษตรง ๆ ก็ยังใช้ได้เหมือนเดิม
*/
/** 80 คลาสของโมเดล COCO-SSD + ชื่อภาษาไทยสำหรับแสดงผลให้ผู้เล่นอ่าน */
var COCO_LABEL_TH = {
	person: "คน",
	bicycle: "จักรยาน",
	car: "รถยนต์",
	motorcycle: "มอเตอร์ไซค์",
	airplane: "เครื่องบิน",
	bus: "รถบัส",
	train: "รถไฟ",
	truck: "รถบรรทุก",
	boat: "เรือ",
	"traffic light": "สัญญาณไฟจราจร",
	"fire hydrant": "หัวจ่ายน้ำดับเพลิง",
	"stop sign": "ป้ายหยุด",
	"parking meter": "มิเตอร์จอดรถ",
	bench: "ม้านั่ง",
	bird: "นก",
	cat: "แมว",
	dog: "สุนัข",
	horse: "ม้า",
	sheep: "แกะ",
	cow: "วัว",
	elephant: "ช้าง",
	bear: "หมี",
	zebra: "ม้าลาย",
	giraffe: "ยีราฟ",
	backpack: "เป้สะพายหลัง",
	umbrella: "ร่ม",
	handbag: "กระเป๋าถือ",
	tie: "เนกไท",
	suitcase: "กระเป๋าเดินทาง",
	frisbee: "จานร่อน",
	skis: "สกี",
	snowboard: "สโนว์บอร์ด",
	"sports ball": "ลูกบอล",
	kite: "ว่าว",
	"baseball bat": "ไม้เบสบอล",
	"baseball glove": "ถุงมือเบสบอล",
	skateboard: "สเก็ตบอร์ด",
	surfboard: "กระดานโต้คลื่น",
	"tennis racket": "ไม้เทนนิส",
	bottle: "ขวด",
	"wine glass": "แก้วไวน์",
	cup: "แก้วน้ำ",
	fork: "ส้อม",
	knife: "มีด",
	spoon: "ช้อน",
	bowl: "ชาม",
	banana: "กล้วย",
	apple: "แอปเปิล",
	sandwich: "แซนด์วิช",
	orange: "ส้ม",
	broccoli: "บรอกโคลี",
	carrot: "แครอท",
	"hot dog": "ฮอทดอก",
	pizza: "พิซซ่า",
	donut: "โดนัท",
	cake: "เค้ก",
	chair: "เก้าอี้",
	couch: "โซฟา",
	"potted plant": "ต้นไม้ในกระถาง",
	bed: "เตียง",
	"dining table": "โต๊ะอาหาร",
	toilet: "โถสุขภัณฑ์",
	tv: "โทรทัศน์",
	laptop: "โน้ตบุ๊ก",
	mouse: "เมาส์",
	remote: "รีโมต",
	keyboard: "คีย์บอร์ด",
	"cell phone": "โทรศัพท์มือถือ",
	microwave: "ไมโครเวฟ",
	oven: "เตาอบ",
	toaster: "เครื่องปิ้งขนมปัง",
	sink: "อ่างล้างมือ",
	refrigerator: "ตู้เย็น",
	book: "หนังสือ",
	clock: "นาฬิกา",
	vase: "แจกัน",
	scissors: "กรรไกร",
	"teddy bear": "ตุ๊กตาหมี",
	"hair drier": "ไดร์เป่าผม",
	toothbrush: "แปรงสีฟัน"
};
/** คำเรียกอื่น ๆ ที่คนกรอกชีตน่าจะพิมพ์จริง -> label ของโมเดล
* (ชื่อไทยหลักจาก COCO_LABEL_TH ถูกเติมให้อัตโนมัติด้านล่าง ไม่ต้องซ้ำที่นี่) */
var EXTRA_ALIASES = {
	มนุษย์: "person",
	บุคคล: "person",
	ผู้คน: "person",
	นักท่องเที่ยว: "person",
	หมา: "dog",
	หมาน้อย: "dog",
	แมวเหมียว: "cat",
	โค: "cow",
	วัวควาย: "cow",
	ควาย: "cow",
	กระบือ: "cow",
	ต้นไม้: "potted plant",
	กระถางต้นไม้: "potted plant",
	ไม้กระถาง: "potted plant",
	พืช: "potted plant",
	รถ: "car",
	รถกระบะ: "truck",
	จยย: "motorcycle",
	มอไซค์: "motorcycle",
	ขวดน้ำ: "bottle",
	แก้ว: "cup",
	มือถือ: "cell phone",
	โทรศัพท์: "cell phone",
	นาฬิกาแขวน: "clock",
	หนังสือเล่ม: "book"
};
/** กลุ่มหมวดหมู่กว้าง ๆ สำหรับ detectionType 'object' — ถ่ายอะไรก็ได้ที่อยู่ใน
* กลุ่มนี้ก็ผ่าน (เช่นเควส "ถ่ายสัตว์ในฟาร์ม" ไม่ควรบังคับว่าต้องเป็นวัวเท่านั้น)
* ค่าว่าง [] = ยอมรับทุก label ที่โมเดลตรวจเจอ */
var COCO_LABEL_GROUPS = {
	any: [],
	ใดก็ได้: [],
	อะไรก็ได้: [],
	animal: [
		"bird",
		"cat",
		"dog",
		"horse",
		"sheep",
		"cow",
		"elephant",
		"bear",
		"zebra",
		"giraffe"
	],
	สัตว์: [
		"bird",
		"cat",
		"dog",
		"horse",
		"sheep",
		"cow",
		"elephant",
		"bear",
		"zebra",
		"giraffe"
	],
	"farm-animal": [
		"cow",
		"sheep",
		"horse",
		"bird",
		"dog",
		"cat"
	],
	สัตว์ในฟาร์ม: [
		"cow",
		"sheep",
		"horse",
		"bird",
		"dog",
		"cat"
	],
	vehicle: [
		"bicycle",
		"car",
		"motorcycle",
		"airplane",
		"bus",
		"train",
		"truck",
		"boat"
	],
	ยานพาหนะ: [
		"bicycle",
		"car",
		"motorcycle",
		"airplane",
		"bus",
		"train",
		"truck",
		"boat"
	],
	food: [
		"banana",
		"apple",
		"sandwich",
		"orange",
		"broccoli",
		"carrot",
		"hot dog",
		"pizza",
		"donut",
		"cake"
	],
	อาหาร: [
		"banana",
		"apple",
		"sandwich",
		"orange",
		"broccoli",
		"carrot",
		"hot dog",
		"pizza",
		"donut",
		"cake"
	],
	fruit: [
		"banana",
		"apple",
		"orange"
	],
	ผลไม้: [
		"banana",
		"apple",
		"orange"
	],
	vegetable: ["broccoli", "carrot"],
	ผัก: ["broccoli", "carrot"],
	plant: ["potted plant"],
	furniture: [
		"chair",
		"couch",
		"bed",
		"dining table",
		"bench"
	],
	เฟอร์นิเจอร์: [
		"chair",
		"couch",
		"bed",
		"dining table",
		"bench"
	]
};
/** ตารางค้นหารวม (ไทย + อังกฤษ + alias) -> label จริงของโมเดล
* สร้างครั้งเดียวตอน import module ไม่ได้คำนวณซ้ำทุกครั้งที่ตรวจภาพ */
var LOOKUP = (() => {
	const map = {};
	for (const en of Object.keys(COCO_LABEL_TH)) {
		map[normalizeKey(en)] = en;
		map[normalizeKey(COCO_LABEL_TH[en])] = en;
	}
	for (const [alias, en] of Object.entries(EXTRA_ALIASES)) map[normalizeKey(alias)] = en;
	return map;
})();
/** ตัดช่องว่าง/ขีด/ขีดล่างและแปลงเป็นตัวพิมพ์เล็ก เพื่อให้ "Potted Plant",
* "potted_plant", "pottedplant" และ "ต้นไม้ ในกระถาง" ค้นเจอเหมือนกันหมด */
function normalizeKey(value) {
	return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}
/**
* แปลง `rule.target` จากชีต -> รายชื่อ label ของโมเดลที่ถือว่า "ผ่าน"
*
* รองรับ 3 รูปแบบในช่องเดียว (ผู้กรอกชีตเลือกใช้แบบไหนก็ได้):
*   1) ชื่อคลาสเดี่ยว  — "cow" / "วัว" / "สุนัข"
*   2) ชื่อกลุ่ม        — "animal" / "สัตว์ในฟาร์ม" / "any"
*   3) หลายค่าคั่นด้วย , หรือ | — "cow,sheep" / "วัว|แกะ|ม้า"
*
* คืน `[]` = ยอมรับทุก label (กรณีกลุ่ม 'any' หรือ target ว่าง)
* คืน `null` = แปลไม่ออกเลยสักค่า (ผู้กรอกชีตพิมพ์ผิด) ให้ provider แจ้ง error
*/
function resolveTargetLabels(target) {
	const raw = (target ?? "").trim();
	if (!raw) return [];
	const group = COCO_LABEL_GROUPS[normalizeKey(raw)] ?? COCO_LABEL_GROUPS[raw.trim().toLowerCase()];
	if (group) return [...group];
	const parts = raw.split(/[,|]/).map((p) => p.trim()).filter(Boolean);
	const labels = [];
	for (const part of parts) {
		const partGroup = COCO_LABEL_GROUPS[normalizeKey(part)];
		if (partGroup) {
			if (partGroup.length === 0) return [];
			labels.push(...partGroup);
			continue;
		}
		const label = LOOKUP[normalizeKey(part)];
		if (label) labels.push(label);
	}
	if (labels.length === 0) return null;
	return [...new Set(labels)];
}
/** ชื่อไทยสำหรับแสดงผล (ไม่รู้จัก label ไหนก็คืนค่าเดิมไป ไม่ throw) */
function toThaiLabel(label) {
	return COCO_LABEL_TH[label] ?? label;
}
//#endregion
//#region services/detection/providers/cocoSsdProvider.ts
var PROVIDER_ID = "tfjs-coco-ssd-v1";
/** ย่อภาพก่อนเข้าโมเดล — รูปจากกล้องมือถือมักกว้าง 3000px+ ซึ่งเกินความจำเป็น
* (COCO-SSD ย่อเป็น 300x300 ภายในอยู่แล้ว) ย่อเองก่อนช่วยลดเวลา/หน่วยความจำ
* บนมือถือรุ่นกลางได้มาก โดยความแม่นยำแทบไม่ต่าง */
var MAX_INPUT_SIZE = 640;
/** จำนวนกล่องสูงสุดที่ให้โมเดลคืนมาต่อ 1 ภาพ */
var DEFAULT_MAX_BOXES = 20;
/** คะแนนขั้นต่ำที่โมเดลจะรายงานผลออกมาเลย (คนละค่ากับ rule.confidence ที่ใช้
* ตัดสิน "ผ่าน/ไม่ผ่าน") ตั้งต่ำไว้เพื่อให้เอาไปแสดงเป็นคำใบ้ตอนไม่ผ่านได้ด้วย */
var MODEL_MIN_SCORE = .2;
/**
* โหลด TFJS + โมเดล COCO-SSD แบบ lazy (dynamic import) — จงใจไม่ import ไว้
* ที่ top-level ของไฟล์ เพราะ:
*   1) TFJS แตะ window/WebGL ตอน import ใช้ตอน SSR/prerender ไม่ได้
*   2) ผู้เล่นที่ไม่ได้เข้าหน้าเควสถ่ายรูปเลย ไม่ควรต้องโหลด JS ก้อนนี้
*/
async function loadModel() {
	throw new Error("Object Detection ทำงานได้เฉพาะฝั่ง Browser เท่านั้น");
}
/** โมเดลโหลดเข้าหน่วยความจำแล้ว หรือเคยถูก Service Worker cache ไว้แล้ว */
var cachedOfflineCapable = false;
/** วาดภาพลง canvas พร้อมย่อขนาด — คืน HTMLCanvasElement เสมอ เพื่อให้รองรับทั้ง
* HTMLImageElement และ ImageBitmap ด้วยเส้นทางเดียวกัน (coco-ssd รับ canvas ได้) */
function toModelInput(image) {
	const srcW = image.width || 1;
	const srcH = image.height || 1;
	const scale = Math.min(1, MAX_INPUT_SIZE / Math.max(srcW, srcH));
	const canvas = (void 0).createElement("canvas");
	canvas.width = Math.max(1, Math.round(srcW * scale));
	canvas.height = Math.max(1, Math.round(srcH * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("ไม่สามารถสร้าง Canvas 2D Context ได้ (เบราว์เซอร์ไม่รองรับ)");
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	return canvas;
}
/** สรุปสิ่งที่โมเดลเจอในภาพเป็นข้อความไทยสั้น ๆ ไว้บอกผู้เล่นตอนตรวจไม่ผ่าน
* (ช่วยให้รู้ว่าควรเล็งกล้องใหม่ยังไง แทนที่จะบอกแค่ "ไม่ผ่าน") */
function describeFound(predictions) {
	if (predictions.length === 0) return "ไม่พบวัตถุที่ระบุได้ในภาพเลย";
	return `สิ่งที่ตรวจพบในภาพ: ${predictions.slice(0, 3).map((p) => `${toThaiLabel(p.class)} ${(p.score * 100).toFixed(0)}%`).join(", ")}`;
}
//#endregion
//#region services/detection/detectionEngine.ts
/** รายชื่อ Provider ที่ระบบรู้จักทั้งหมด — เพิ่ม/เอาออกที่นี่จุดเดียว
*
* ลำดับมีความหมาย: `findProvider()` ใช้ตัวแรกที่ `supports` ตรงกับ detectionType
* — `cocoSsdProvider` (Phase 2, ตรวจจับจริง) จึงต้องมาก่อน `objectDetectionProvider`
* (stub เดิมของ Phase 1) เสมอ ส่วน stub ยังคงอยู่ในลิสต์เพื่อให้เรียกใช้ได้ถ้า
* ระบุ `provider: 'object-detection-stub-v1'` ตรง ๆ ในชีต PhotoQuests
* (เช่น อยากปิดการตรวจจับจริงชั่วคราวโดยไม่ต้อง deploy โค้ดใหม่) */
var PROVIDERS = [
	colorProvider,
	{
		id: PROVIDER_ID,
		supports: [
			"object",
			"specific_object",
			"person"
		],
		get isOfflineCapable() {
			return cachedOfflineCapable;
		},
		async detect(input) {
			const { rule } = input;
			const targetLabels = rule.detectionType === "person" ? ["person"] : resolveTargetLabels(rule.target);
			if (targetLabels === null) return {
				passed: false,
				confidence: 0,
				reason: `target ของเควสนี้ ("${rule.target}") ไม่ตรงกับสิ่งที่โมเดลรู้จัก — โปรดแก้ค่าในชีต PhotoQuests`,
				providerId: PROVIDER_ID
			};
			const canvas = toModelInput(input.image);
			let model;
			try {
				model = await loadModel();
			} catch (err) {
				const detail = err instanceof Error ? err.message : "";
				throw new Error(`ยังโหลดโมเดลตรวจจับภาพไม่สำเร็จ กรุณาเชื่อมต่ออินเทอร์เน็ตสักครู่เพื่อโหลดครั้งแรก (ครั้งต่อไปใช้ได้แบบออฟไลน์)${detail ? ` [${detail}]` : ""}`);
			}
			const maxBoxes = Number(rule.options?.maxNumBoxes ?? DEFAULT_MAX_BOXES);
			const predictions = await model.detect(canvas, maxBoxes, MODEL_MIN_SCORE);
			const best = (targetLabels.length === 0 ? predictions : predictions.filter((p) => targetLabels.includes(p.class))).reduce((acc, p) => acc === null || p.score > acc.score ? p : acc, null);
			const confidence = best ? Number(best.score.toFixed(3)) : 0;
			if (!!best && best.score >= rule.confidence) return {
				passed: true,
				confidence,
				providerId: PROVIDER_ID
			};
			const wanted = targetLabels.length === 0 ? "วัตถุใด ๆ" : targetLabels.map(toThaiLabel).slice(0, 4).join(" หรือ ");
			return {
				passed: false,
				confidence,
				reason: best ? `เจอ${wanted}ในภาพแล้ว แต่ยังไม่ชัดเจนพอ (${(best.score * 100).toFixed(0)}% ต้องการ ${(rule.confidence * 100).toFixed(0)}%) ลองเข้าใกล้ขึ้นหรือถ่ายในที่แสงสว่างกว่านี้` : `ตรวจไม่พบ${wanted}ในภาพ — ${describeFound(predictions)}`,
				providerId: PROVIDER_ID
			};
		}
	},
	{
		id: "object-detection-stub-v1",
		supports: [
			"object",
			"specific_object",
			"person"
		],
		isOfflineCapable: false,
		async detect(_input) {
			return {
				passed: false,
				confidence: 0,
				reason: "Detection Type นี้ยังไม่เปิดใช้งานจริงในเวอร์ชันนี้ (รอ Phase 2 — ผูก TensorFlow.js/MediaPipe) กรุณาติดต่อเจ้าหน้าที่",
				providerId: "object-detection-stub-v1"
			};
		}
	}
];
function findProvider(detectionType, explicitProviderId) {
	if (explicitProviderId) return PROVIDERS.find((p) => p.id === explicitProviderId) ?? null;
	return PROVIDERS.find((p) => p.supports.includes(detectionType)) ?? null;
}
/** true = มี provider ที่รองรับ detectionType นี้ และ provider นั้นทำงาน
* offline ได้ — ใช้ตัดสินใจฝั่ง UI ว่าควรอนุญาตให้ทำเควสนี้ตอนไม่มีเน็ตไหม */
function isDetectionAvailableOffline(detectionType, providerId) {
	const provider = findProvider(detectionType, providerId);
	return !!provider && provider.isOfflineCapable;
}
/**
* รันการตรวจจับ 1 ครั้งตาม DetectionRule ที่ระบุ — ฟังก์ชันเดียวที่
* composables/usePhotoQuest.ts ต้องรู้จัก ไม่ต้องรู้เรื่อง provider ภายในเลย
*/
async function runDetection(input) {
	const provider = findProvider(input.rule.detectionType, input.rule.provider);
	if (!provider) return {
		passed: false,
		confidence: 0,
		reason: `ไม่พบ Detection Provider ที่รองรับ detectionType="${input.rule.detectionType}"`,
		providerId: "none"
	};
	try {
		return await provider.detect(input);
	} catch (err) {
		return {
			passed: false,
			confidence: 0,
			reason: err instanceof Error ? err.message : "เกิดข้อผิดพลาดระหว่างตรวจสอบภาพ กรุณาลองใหม่อีกครั้ง",
			providerId: provider.id
		};
	}
}
//#endregion
//#region composables/usePhotoQuest.ts
function usePhotoQuest() {
	const quests = useState("photo-quest-list", () => []);
	const completedIds = useState("photo-quest-completed", () => []);
	const isLoadingQuests = useState("photo-quest-loading", () => false);
	const loadError = useState("photo-quest-load-error", () => "");
	/** true = กำลังแสดงเควสตัวอย่าง (Mock) เพราะยังไม่มีข้อมูลจริงจากชีต
	* — หน้า UI เอาไปขึ้นป้ายเตือนได้ ไม่ให้เข้าใจผิดว่าเป็นเควสจริง */
	const usingMockData = useState("photo-quest-using-mock", () => false);
	const completedCount = computed(() => completedIds.value.length);
	const totalQuests = computed(() => quests.value.filter((q) => q.active).length);
	function getStoredCompleted() {
		return [];
	}
	function persistCompleted(next) {
		completedIds.value = next;
	}
	function isCompleted(questId) {
		return completedIds.value.includes(questId);
	}
	/** เรียกตอน mounted ของหน้า list — โหลดทั้งสถานะที่ทำไปแล้ว (LocalStorage) และ
	* รายการเควสจาก Backend (ถ้ามีเน็ต) ไม่บล็อกกันเอง (โหลด LocalStorage ก่อนเสมอ
	* เพื่อให้หน้าเปิดใช้งานได้ทันทีแม้ไม่มีเน็ต) */
	async function initPhotoQuest() {
		completedIds.value = getStoredCompleted();
	}
	function findQuest(questId) {
		return quests.value.find((q) => q.id === questId);
	}
	/** true = เควสนี้ทำได้ตอนไม่มีเน็ต (ทั้งฝั่ง detection เองต้องทำ offline ได้
	* — การ "ยืนยันสำเร็จ" กับ Backend ค่อยไป sync ทีหลังผ่าน useOfflinePhotoQuestSync) */
	function canPlayOffline(quest) {
		return isDetectionAvailableOffline(quest.rule.detectionType, quest.rule.provider);
	}
	/**
	* รับรูปที่ถ่ายมา (HTMLImageElement/ImageBitmap) ของเควสที่ระบุ -> ส่งเข้า
	* Detection Engine -> ถ้าผ่าน บันทึกลง LocalStorage + คิว sync ทันที
	* คืนค่า DetectionResult เสมอ (ไม่ throw) ให้หน้า UI ไปแสดงผล/ให้ถ่ายใหม่เอง
	*/
	async function attemptQuest(quest, image) {
		const result = await runDetection({
			image,
			rule: quest.rule
		});
		if (result.passed && !isCompleted(quest.id)) {
			persistCompleted([...completedIds.value, quest.id]);
			const attempt = {
				clientId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
				questId: quest.id,
				questName: quest.name,
				points: quest.points,
				result,
				attemptedAt: Date.now(),
				synced: false
			};
			const { queuePhotoQuestAttempt } = useOfflinePhotoQuestSync();
			queuePhotoQuestAttempt(attempt);
		}
		return result;
	}
	return {
		quests: readonly(quests),
		completedIds: readonly(completedIds),
		completedCount,
		totalQuests,
		isLoadingQuests: readonly(isLoadingQuests),
		loadError: readonly(loadError),
		usingMockData: readonly(usingMockData),
		initPhotoQuest,
		findQuest,
		isCompleted,
		canPlayOffline,
		attemptQuest
	};
}
//#endregion
export { useOfflinePhotoQuestSync as n, usePhotoQuest as t };

//# sourceMappingURL=usePhotoQuest-CN5VnOPV.js.map