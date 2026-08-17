<script setup lang="ts">
/**
 * pages/scan.vue
 * ---------------------------------------------------------------------------
 * หน้า Scan QR Code — ใช้กล้องจริงของเครื่อง (html5-qrcode ครอบ Camera API/
 * getUserMedia ให้อีกที) เปิดกล้องอัตโนมัติเมื่อเข้าหน้านี้ รองรับมือถือ
 * (เลือกกล้องหลังก่อนเป็นค่าเริ่มต้น) มีปุ่มสลับกล้องหน้า/หลัง และปุ่มปิดกล้อง
 *
 * หมายเหตุ: ไม่แตะต้อง Logic เดิมของหน้านี้ (useRequireProfile guard เดิม
 * ยังทำงานเหมือนเดิมทุกประการ) — ส่วนที่เพิ่มคือ Logic การเปิด/ปิด/สลับกล้อง
 * และการอ่านค่า QR เท่านั้น ซึ่งเป็นของใหม่ทั้งหมด ไม่ได้ไปแก้ของเดิมที่มีอยู่
 */

import type {
  Html5Qrcode as Html5QrcodeType,
  CameraDevice,
} from "html5-qrcode";
import {
  POINTS_PER_STATION,
  type StationType,
} from "~/composables/useAdventure";
// ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — ดู components/mission/MissionQuestionPopup.vue
import type { StationQuestion, StationAnswer } from "~/types/question";
import MissionQuestionPopup from "~/components/mission/MissionQuestionPopup.vue";

definePageMeta({ layout: "app" });
const { profile, isReady } = useRequireProfile();

const QR_ELEMENT_ID = "qr-reader";

/** สถานะกล้อง: 'idle' ยังไม่เริ่ม, 'starting' กำลังขอสิทธิ์/เปิดกล้อง, 'running' กำลังสแกน, 'error' เปิดกล้องไม่สำเร็จ, 'stopped' ผู้ใช้ปิดกล้องเอง */
type ScanState = "idle" | "starting" | "running" | "error" | "stopped";

const scanState = ref<ScanState>("idle");
const errorMessage = ref("");
const lastResult = ref("");
const cameras = ref<CameraDevice[]>([]);
const activeCameraIndex = ref(0);

let html5Qrcode: Html5QrcodeType | null = null;
let Html5QrcodeCtor: typeof import("html5-qrcode").Html5Qrcode | null = null;

/**
 * ------------------------------------------------------------------------
 * Offline First: บันทึกฐานลง LocalStorage ก่อนเสมอ Google Sheet ใช้ Sync
 * เท่านั้น (ดู composables/useAdventure.ts + composables/useOfflineSync.ts)
 * ------------------------------------------------------------------------
 * รองรับทั้งสแกน QR และกรอกรหัสฐานเอง เช่น CORN001, COW001, SOIL001, MILK001
 * (ตัวพิมพ์เล็ก/ใหญ่ไม่สำคัญ, เว้นวรรคหัวท้ายตัดให้อัตโนมัติ) หรือจะเข้ารหัส QR
 * เป็นชื่อฐานตรง ๆ (corn/cow/soil/milk) ก็ได้เช่นกัน
 */
const STATION_CODE_MAP: Record<string, StationType> = {
  CORN001: "corn",
  COW001: "cow",
  SOIL001: "soil",
  MILK001: "milk",
};

/** ฐานสุดท้ายของเส้นทาง — ผ่านฐานนี้แล้วให้ลอง Sync ขึ้น Google Sheet ทันที (ถ้ามีเน็ต) */
const FINAL_STATION_ID: StationType = "milk";

const {
  stations,
  isVisited,
  isComplete,
  toggleStation,
  initAdventure,
  totalPoint,
} = useAdventure();
const {
  isOnline,
  hasPending,
  pendingCount,
  isSyncing,
  queueCheckin,
  syncNow,
  initOfflineSync,
} = useOfflineSync();
// Offline Mode (ใหม่): ถ้า Session นี้ถูกล็อกเข้า Offline Mode ไว้แล้ว ห้ามแตะ
// ระบบ Online/Sync เดิมข้างบนเลยสักฟังก์ชัน (queueCheckin/syncNow) — ใช้ log
// ของตัวเองแยกต่างหากแทน (ดู composables/useOfflineMode.ts)
const { isOfflineMode, logStationScan, endRound, roundData } =
  useOfflineMode();
// [Fix] หน้าสรุปผลหลังจบเกม (ดู pages/round-summary.vue) — ใช้เก็บ "สำเนา"
// เวลาที่เริ่ม/จบ + ฐานที่เล่น + คะแนนรวมของรอบนี้ ไว้ก่อน resetJourney() ล้างทิ้ง
const { saveRoundSummary } = useRoundSummary();
// Online Round (ใหม่): ใช้เฉพาะปุ่ม "จบเกม" ของ Popup ฐานนมด้านล่าง (endGameAfterFinalStation)
// เพื่อปิด Round ปัจจุบันด้วย roundEnd() — reuse composables/useRound.ts ที่จัดการ
// Round ทั้งหมดอยู่แล้ว (roundStart ถูกเรียกไปแล้วครั้งเดียวตอน useRequireProfile guard
// ทำงาน ไม่เกี่ยวกับหน้านี้) ไม่แตะ Logic การสแกน/กล้อง/Map/Journey อื่นใดในไฟล์นี้เลย
const { endCurrentRound, ensureRoundStarted, currentRoundId } = useRound();
// แบบประเมินหลังจบเกม (ใหม่) — ใช้ submitSurvey() เดิมที่เพิ่งเพิ่มใน
// composables/useMemberApi.ts (action 'submitSurvey' -> server-gas/SurveyService.gs)
const { submitSurvey } = useMemberApi();
// ไฟล์ใหม่ (ระบบภารกิจ + คำถามประจำฐาน) — ระบบขนานทั้งหมด ไม่แตะ/ไม่เรียกใช้
// ฟังก์ชันของ useAdventure/useOfflineSync/useRound ข้างต้นเลยสักฟังก์ชัน อ่านแค่
// currentRoundId ที่มีอยู่แล้วมาแนบไปกับคำตอบเท่านั้น (ดู composables/useQuestion.ts)
const {
  initQuestions,
  initAnsweredState,
  getQuestionForStation,
  isStationQuestionDone,
  findAnswered,
  submitAnswer: submitQuestionAnswer,
  resetAnswered,
  totalQuestionPoints,
  totalCorrect: totalQuestionCorrect,
} = useQuestion();
const { initOfflineAnswerSync, syncNow: syncAnswersNow } =
  useOfflineAnswerSync();
// [ใหม่] Flow ใหม่ — Timer เวลารอบ 2 ชม./เวลาเผ่า 30 นาที + จบรอบบังคับตอนหมดเวลา
// (ระบบขนานเช่นกัน ดู composables/useRoundTimer.ts / useForceEndRound.ts)
const {
  initRoundTimer,
  startStationTimer,
  clearStationTimer,
  stationRemainingLabel,
  hasActiveRoundTimer,
  isRoundExpired,
  isStationExpired,
} = useRoundTimer();
const { forceEndRoundDueToTimeout } = useForceEndRound();

type CheckinFeedbackKind = "success" | "duplicate" | "invalid";
const checkinFeedback = ref<{ kind: CheckinFeedbackKind; text: string } | null>(
  null,
);
const syncMessage = ref("");
const manualCode = ref("");

// ป้องกัน Popup เปิดซ้อน/ยิง request ซ้ำ — กันทั้ง Callback ของกล้อง (เรียกซ้ำ
// ทุกเฟรมได้) และปุ่มกรอกรหัสฐานเอง ไม่ให้ processStationCode() ทำงานซ้อนกัน
const isProcessingScan = ref(false);

// Popup "เข้าฐานสำเร็จ!" (ฐาน 1-3) — เก็บชื่อฐาน + คะแนนที่ได้รับไว้แสดงใน Popup
const successPopupOpen = ref(false);
// Popup พิเศษฐานสุดท้าย (นม) — "ยินดีด้วย! คุณมาถึงฐานนมแล้ว" + ปุ่มเล่นต่อ/จบเกม
const finalPopupOpen = ref(false);
const scannedStation = ref<{ name: string; points: number } | null>(null);

/**
 * [ใหม่] Popup "ภารกิจ + คำถามประจำฐาน" — เปิดก่อน Popup ผลลัพธ์ด้านบนเสมอ ถ้าฐาน
 * ที่เพิ่งสแกนมีคำถามกำหนดไว้ในชีต "Questions" (ไม่มี/ตอบไปแล้ว = ข้ามไปเปิด
 * Popup ผลลัพธ์เดิมทันที — ดู presentMission() ด้านล่าง)
 */
const missionPopupOpen = ref(false);
const activeMissionQuestion = ref<StationQuestion | null>(null);
const activeMissionAnswer = ref<StationAnswer | null>(null);
/** Popup ที่ "รอเปิดต่อ" หลังปิด Popup ภารกิจ+คำถาม — 'success' = Popup เข้าฐาน
 * สำเร็จฐาน 1-3 เดิม, 'final' = Popup ฐานนมเดิม, null = ไม่ต้องเปิดต่ออะไรเลย
 * (กรณี Offline Mode ฐาน 1-3 ที่ใช้ checkinFeedback ข้อความแทน ไม่ใช้ Popup) */
const pendingResultPopup = ref<"success" | "final" | null>(null);

/**
 * แบบประเมินก่อนจบเกม (ใหม่, ข้อ 1 ก่อน — เผื่อเพิ่มข้อถัดไปทีหลัง):
 * "ท่านชอบด่านไหนมากที่สุด" ให้คะแนน 1-5 (5=มากที่สุด ... 1=น้อยที่สุด) — บังคับ
 * ตอบก่อนออกจากหน้านี้เท่านั้น (ปุ่ม "จบเกม" ที่ Popup ฐานนมด้านล่างจะเปิด Popup
 * นี้แทนที่จะเรียก endGameAfterFinalStation() ตรง ๆ) บันทึกลง Google Sheet ผ่าน
 * submitSurvey() (ชีต "Survey" ฝั่ง server-gas) ก่อนค่อยจบเกมจริงตามปกติ
 *
 * เฉพาะฝั่ง Online เท่านั้น (Offline Mode ไม่มีอินเทอร์เน็ตให้บันทึกขึ้นชีตอยู่แล้ว
 * — ปุ่ม "จบเกม" ฝั่ง Offline ยังคงจบเกมทันทีเหมือนเดิมทุกประการ ไม่ผ่าน Popup นี้)
 */
const surveyPopupOpen = ref(false);
const selectedRating = ref<number | null>(null);
const surveySubmitting = ref(false);
const surveyError = ref("");
const SURVEY_RATING_OPTIONS: { value: number; label: string }[] = [
  { value: 4, label: "นม" },
  { value: 3, label: "วัว" },
  { value: 2, label: "ดิน" },
  { value: 1, label: "ข้าวโพด" },
];
/** true ระหว่างที่มี Popup ผลลัพธ์ค้างอยู่ — ใช้กันการสแกน/กรอกรหัสซ้ำซ้อน
 * (เพิ่ม missionPopupOpen เข้ามาด้วย — กันสแกนฐานถัดไปซ้อนระหว่างยังไม่ได้ตอบ
 * คำถามของฐานปัจจุบันให้เสร็จก่อน) */
const isResultPopupOpen = computed(
  () =>
    successPopupOpen.value || finalPopupOpen.value || missionPopupOpen.value,
);

/** ชื่อฐานของคำถามที่กำลังแสดงใน Popup ภารกิจ+คำถาม (ใหม่) — ใช้แสดงหัวข้อ Popup */
const activeMissionStationName = computed(
  () =>
    stations.value.find((s) => s.id === activeMissionQuestion.value?.stationId)
      ?.name ?? "",
);

/**
 * [Fix] บั๊ก "Popup แบบประเมินขึ้นมาแล้วยังกดออกจากหน้านี้ได้" — เดิม UModal
 * ของแบบประเมิน (surveyPopupOpen) ตั้ง :dismissible="false" + :close="false"
 * ไว้แล้วก็จริง แต่ 2 ค่านี้กัน "ปิด Modal เอง" ได้แค่ทาง Backdrop/ESC เท่านั้น —
 * ไม่ได้กันการ "เปลี่ยนหน้า" ทั้งหน้า เพราะ pages/scan.vue ใช้ layout: 'app'
 * (มี BottomNav ติดจอเสมอ ดู layouts/app.vue + components/BottomNav.vue) ที่มี
 * NuxtLink ไปหน้าอื่น (หน้าแรก/แผนที่/โปรไฟล์/Info) ซ้อนอยู่นอก Modal ตลอด —
 * ผู้เล่นกดเมนูด้านล่างระหว่าง Popup แบบประเมินเปิดอยู่ได้ตามปกติ ทำให้หลุดออก
 * จากหน้านี้ไปได้ทั้งที่ยังไม่ได้ประเมิน (Modal ก็หายไปพร้อมกับหน้าเลย)
 *
 * แก้โดย reuse pattern เดียวกับ pages/round-summary.vue (onBeforeRouteLeave +
 * beforeunload) ดักการเปลี่ยนหน้าในแอป (BottomNav/ปุ่ม Back) และปิด/รีเฟรชแท็บ
 * ไว้ตราบใดที่ surveyPopupOpen ยังเป็น true อยู่ — "บล็อกจริง" (ไม่ใช่แค่เตือนแล้ว
 * ให้ออกได้) ตามสเปก "ไม่สามารถกดออกจากหน้านี้ได้จนกว่าจะประเมิน" ส่วน Popup
 * ผลลัพธ์อื่น ๆ (เข้าฐานสำเร็จ/ถึงฐานนม) กันไว้เผื่อเช่นกัน กันเคสเดียวกันที่ผู้เล่น
 * หลุดออกจากหน้ากลางคันตอนกำลังจะบันทึกผลสแกน (ไม่แตะ Logic การสแกน/แสดงผล/
 * ปุ่มภายใน Popup เดิมเลยแม้แต่บรรทัดเดียว)
 */
const isBlockingPopupOpen = computed(
  () => surveyPopupOpen.value || isResultPopupOpen.value,
);

onBeforeRouteLeave(() => {
  if (!surveyPopupOpen.value) return true;
  if (import.meta.client) {
    // eslint-disable-next-line no-alert
    window.alert("กรุณาตอบแบบประเมินก่อนออกจากหน้านี้ครับ");
  }
  return false;
});

function handleScanPageBeforeUnload(event: BeforeUnloadEvent): void {
  if (!isBlockingPopupOpen.value) return;
  event.preventDefault();
  event.returnValue = "";
}

/** แปลงรหัส/ข้อความที่สแกน/กรอกมาให้เป็น stationId ที่ระบบรู้จัก หรือ null ถ้าไม่รู้จัก
 * (เช็คเทียบกับ stations.value เพราะตอนนี้เป็น computed — กรองฐานที่ Admin
 * ปิดใช้งาน (active:false) ออกไปแล้ว สแกนฐานที่ปิดอยู่จะถือว่า "ไม่พบรหัสฐาน") */
function resolveStationId(raw: string): StationType | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (
    STATION_CODE_MAP[upper] &&
    stations.value.some((s) => s.id === STATION_CODE_MAP[upper])
  ) {
    return STATION_CODE_MAP[upper];
  }
  const lower = trimmed.toLowerCase() as StationType;
  if (stations.value.some((s) => s.id === lower)) return lower;
  return null;
}

/**
 * จุดที่จัดการ "กรอกรหัสฐานเอง" เท่านั้น (ปุ่ม/ฟอร์ม submitManualCode — เผื่อกล้อง
 * ใช้ไม่ได้/QR ชำรุด) — ใช้ resolveStationId()/STATION_CODE_MAP เดิมตามปกติ
 * ไม่เกี่ยวกับการสแกน QR ด้วยกล้องอีกต่อไป (ดู processScannedStationQr() ด้านล่าง
 * ซึ่งเป็นจุดที่กล้องเรียกโดยตรง ส่ง qrToken ไปตรวจกับ Backend แทน)
 * 1) หาไม่เจอ -> แจ้งรหัสไม่ถูกต้อง ไม่แตะ LocalStorage/Sync เลย
 * 2) เจอ -> ส่งต่อเข้า completeStationVisit() ที่ใช้ร่วมกับฝั่งกล้อง
 *
 * ป้องกัน Popup เปิดซ้อน/ยิง request ซ้ำ (กันกดปุ่ม "ยืนยัน" ซ้ำระหว่างกำลัง
 * ประมวลผลอยู่) — ครอบด้วย isProcessingScan lock คืนค่าใน finally เสมอไม่ว่าจะ
 * return จากจุดไหนก็ตาม (Logic เดิมของแต่ละ Branch ด้านในไม่ถูกแก้ไขเลยสักบรรทัด)
 */
async function processStationCode(raw: string): Promise<void> {
  if (isProcessingScan.value || isResultPopupOpen.value) return;
  isProcessingScan.value = true;
  try {
    syncMessage.value = "";
    const stationId = resolveStationId(raw);

    if (!stationId) {
      checkinFeedback.value = {
        kind: "invalid",
        text: `ไม่พบรหัสฐาน "${raw}" กรุณาตรวจสอบรหัส/QR อีกครั้ง`,
      };
      return;
    }

    await completeStationVisit(stationId);
  } finally {
    isProcessingScan.value = false;
  }
}

/**
 * จุดใหม่: สแกน QR ด้วยกล้อง -> ส่ง qrToken ที่อ่านได้ตรงไปตรวจกับ Backend ผ่าน
 * action 'verifyStationQr' (ดู composables/useMemberApi.ts) โดยตรง "ห้ามผ่าน"
 * resolveStationId()/STATION_CODE_MAP เดิมเด็ดขาด (นั่นสำหรับกรอกรหัสฐานเอง
 * เท่านั้น — ดู submitManualCode) เพราะ QR ที่ติดหน้าฐานจริงเข้ารหัสมาจาก
 * station.qrToken ของ Google Sheet โดยตรง ไม่ใช่รหัส CORN001/COW001/... เดิม
 *
 * ต้องมีอินเทอร์เน็ตเสมอ (ไม่มี fallback offline สำหรับขั้นตอนตรวจ QR นี้ —
 * ตรงตามที่ actionVerifyStationQr_ ฝั่ง server-gas ออกแบบไว้) ตรวจสอบผ่านแล้ว
 * ค่อยจับคู่ Station ที่ backend ส่งกลับมาเข้ากับฐานบนกระดานเกม (corn/cow/soil/
 * milk) ด้วย backendId เป็นหลัก (ดูรายละเอียดการจับคู่ในฟังก์ชันด้านล่าง) แล้ว
 * ส่งต่อเข้า completeStationVisit() เดิม ทุกอย่างหลังจากนี้ (Check-in/Offline
 * logic) เหมือนเดิมทุกประการ ไม่มีการแก้ไข
 */
async function processScannedStationQr(qrToken: string): Promise<void> {
  if (isProcessingScan.value || isResultPopupOpen.value) return;
  isProcessingScan.value = true;
  try {
    syncMessage.value = "";
    const { verifyStationQr } = useMemberApi();

    let verifyResult: Awaited<ReturnType<typeof verifyStationQr>>;
    try {
      verifyResult = await verifyStationQr(qrToken);
    } catch (err) {
      checkinFeedback.value = {
        kind: "invalid",
        text:
          err instanceof Error
            ? err.message
            : "ตรวจสอบ QR กับระบบไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่",
      };
      return;
    }

    if (!verifyResult.success || !verifyResult.station) {
      checkinFeedback.value = {
        kind: "invalid",
        text: verifyResult.error || "QR นี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ",
      };
      return;
    }

    // จับคู่ Station ที่ backend ยืนยันแล้วเข้ากับฐานบนกระดานเกม (corn/cow/soil/milk)
    // ลำดับความแม่นยำจากมากไปน้อย:
    //   1) backendId ตรงกันเป๊ะ (id แถวจริงในชีต Stations — ผูกไว้ตอน
    //      refreshStationsFromBackend() ใน useAdventure.ts เข้ากับฐานกระดานอยู่แล้ว
    //      ไม่ว่า Admin จะตั้งค่า Type/ชื่อไว้ตรงกับกระดานหรือไม่ก็ตาม จึงใช้ได้แม้
    //      Admin ยังไม่ได้ตั้งค่า Type/ตำแหน่งบนแผนที่เลย)
    //   2) Type ตรงกัน (เผื่อกรณี refreshStationsFromBackend ยังไม่เคย sync สำเร็จ
    //      ในเครื่องนี้ เช่น เพิ่งเปิดแอปแล้วออฟไลน์ตอนโหลดหน้า)
    //   3) ชื่อฐานตรงกันเป๊ะ (fallback สุดท้าย)
    const backendStation = verifyResult.station;
    const backendType = backendStation.type?.trim().toLowerCase();
    const backendName = backendStation.name?.trim();
    const matched =
      stations.value.find((s) => s.backendId === backendStation.id) ??
      (backendType
        ? stations.value.find((s) => s.type === backendType)
        : undefined) ??
      (backendName
        ? stations.value.find((s) => s.name.trim() === backendName)
        : undefined);

    if (!matched) {
      checkinFeedback.value = {
        kind: "invalid",
        text: `พบฐาน "${verifyResult.station.name}" ในระบบ แต่ยังจับคู่กับฐานบนกระดานเกมไม่ได้ กรุณาลองสแกนใหม่อีกครั้ง (ตรวจสอบอินเทอร์เน็ต) หรือติดต่อผู้ดูแลระบบ`,
      };
      return;
    }

    await completeStationVisit(matched.id as StationType);
  } finally {
    isProcessingScan.value = false;
  }
}

/**
 * [ใหม่] จุดกลางที่ตัดสินใจว่าจะโชว์ Popup "ภารกิจ + คำถาม" ก่อน หรือข้ามไปที่
 * Popup ผลลัพธ์เดิมเลย — เรียกแทนที่ "successPopupOpen.value = true" /
 * "finalPopupOpen.value = true" ตรง ๆ ในทุกจุดที่เคยเปิด Popup เดิม (ดูจุดเรียกใช้
 * ใน completeStationVisit() ด้านล่าง) ไม่แก้ Logic ก่อนหน้านั้นเลยสักบรรทัด —
 * toggleStation/queueCheckin/logStationScan ยังทำงานเหมือนเดิมทุกประการก่อนจะมา
 * ถึงจุดนี้เสมอ
 *
 * ไม่มีคำถามของฐานนี้เลย (Admin ยังไม่ได้กรอกในชีต "Questions") หรือเคยตอบไปแล้ว
 * (เช่นแอปถูกปิดแล้วเปิดใหม่กลางฐาน) -> ข้าม Popup ภารกิจ+คำถามไปเปิด Popup
 * ผลลัพธ์ที่ระบุใน `after` ทันที (พฤติกรรมเดิมก่อนมีระบบนี้ทุกประการ — Backward
 * Compatible เสมอ) `after: null` ใช้กับ Offline Mode ฐาน 1-3 ที่ใช้ข้อความ
 * checkinFeedback แทน Popup อยู่แล้ว (ไม่ต้องเปิดอะไรต่อ)
 */
function presentMission(
  stationId: StationType,
  after: "success" | "final" | null,
): void {
  initAnsweredState(currentRoundId.value);
  const question = getQuestionForStation(stationId);

  if (!question || isStationQuestionDone(stationId)) {
    // ไม่มีคำถามให้ตอบ/ตอบไปแล้ว -> ภารกิจของฐานนี้ถือว่า "จบ" ทันที เคลียร์เวลา
    // เผ่าทิ้ง (กันเวลานับต่อไปเรื่อย ๆ ทั้งที่ไม่มีอะไรให้ทำต่อแล้ว)
    clearStationTimer();
    if (after === "success") successPopupOpen.value = true;
    else if (after === "final") finalPopupOpen.value = true;
    return;
  }

  activeMissionQuestion.value = question;
  activeMissionAnswer.value = findAnswered(question.id) ?? null;
  pendingResultPopup.value = after;
  missionPopupOpen.value = true;
}

/** ผู้เล่นกดส่งคำตอบใน MissionQuestionPopup — ตัดสินบนเครื่องทันที (Offline
 * First ผ่าน useQuestion().submitAnswer()) แล้วอัปเดต activeMissionAnswer ให้
 * Popup เปลี่ยนไปแสดงผลลัพธ์เอง มีเน็ตอยู่แล้ว (และไม่ใช่ Offline Mode) ลอง Sync
 * คำตอบนี้ขึ้น Backend ทันทีแบบไม่บล็อก UI (เหมือนแนวทาง Offline Queue อื่น ๆ) */
function handleMissionSubmit(value: string): void {
  if (!activeMissionQuestion.value) return;
  const userId = profile.value?.memberId || profile.value?.uid || "";
  const result = submitQuestionAnswer(activeMissionQuestion.value, value, {
    userId,
    firstName: profile.value?.firstName,
    roundId: currentRoundId.value,
  });
  activeMissionAnswer.value = result;

  if (!isOfflineMode.value && isOnline.value && userId) {
    void syncAnswersNow(userId, profile.value?.firstName);
  }
}

/** ผู้เล่นกด "เดินทางไปเผ่าต่อไป" หลังเห็นผลลัพธ์คำถามแล้ว — ปิด Popup ภารกิจ+
 * คำถาม แล้วเปิด Popup ผลลัพธ์เดิมที่ค้างไว้ต่อ (ถ้ามี — ดู pendingResultPopup
 * ใน presentMission() ด้านบน) */
function handleMissionContinue(): void {
  // ตอบคำถามเสร็จแล้ว (ไม่ว่าถูกหรือผิด — "ตอบได้ครั้งเดียว") -> ภารกิจของฐานนี้จบ
  clearStationTimer();
  missionPopupOpen.value = false;
  activeMissionQuestion.value = null;
  activeMissionAnswer.value = null;
  if (pendingResultPopup.value === "success") successPopupOpen.value = true;
  else if (pendingResultPopup.value === "final") finalPopupOpen.value = true;
  pendingResultPopup.value = null;
}

/**
 * จุดเดียวที่จัดการ "ผ่านฐานสำเร็จ" หลังได้ stationId ที่ยืนยันแล้ว (ไม่ว่าจะมาจาก
 * resolveStationId() ของการกรอกรหัสเอง หรือจาก verifyStationQr() ของกล้องสแกน QR)
 * 1) เคยผ่านฐานนี้แล้ว -> "ห้ามบันทึกซ้ำ ห้ามส่งไป Google Sheet" ทันที
 * 2) ยังไม่เคยผ่าน -> บันทึกลง LocalStorage (useAdventure จะอัปเดต Point/
 *    Journey/Polyline ให้อัตโนมัติเพราะทุก Component อ่านจาก state เดียวกัน)
 *    แล้วเข้าคิวรอ Sync — ถ้าเป็นฐาน "นม" (ฐานสุดท้าย) หรือมีเน็ตอยู่แล้วให้
 *    ลอง Sync ทันทีตามสเปก (Sync จริงเกิดแค่ตอนผ่านฐานนมหรือกดปุ่ม Sync เท่านั้น)
 * 3) ผ่านสำเร็จ (ฝั่ง Online เท่านั้น) -> เปิด Popup ผลลัพธ์ (เข้าฐานสำเร็จ/ถึงฐานนม)
 *
 * (Logic เดิมของแต่ละ Branch ด้านในไม่ถูกแก้ไขเลยสักบรรทัด — ย้ายมาจาก
 * processStationCode() เดิมทั้งดุ้นเพื่อให้ processScannedStationQr() เรียกใช้ร่วมกันได้)
 */
async function completeStationVisit(stationId: StationType): Promise<void> {
  const station = stations.value.find((s) => s.id === stationId)!;
  // คะแนนของฐานนี้ — ใช้ค่าจากชีต Stations (Admin) ถ้ามี ไม่มี -> fallback ค่าคงที่เดิม
  const stationPoint = station.points ?? POINTS_PER_STATION;

  if (isVisited(stationId)) {
    checkinFeedback.value = {
      kind: "duplicate",
      text: `เคยผ่าน${station.name}แล้ว ไม่ต้องสแกนซ้ำ`,
    };
    return;
  }

  // [ใหม่] ต้องกดปุ่ม GO ที่หน้า Home ก่อนเสมอ (เปิด Round + เริ่มนับเวลารอบ 2 ชม.
  // — ดู pages/home.vue::pressGo()) ถึงจะสแกนฐานได้ — กันเคสผู้เล่นเข้า /scan
  // ตรง ๆ (พิมพ์ URL/เคย bookmark) โดยไม่ผ่านหน้า Home เลย
  if (!hasActiveRoundTimer.value) {
    checkinFeedback.value = {
      kind: "invalid",
      text: "กรุณากดปุ่ม GO ที่หน้าหลักก่อนเริ่มเล่นครับ",
    };
    return;
  }

  // [ใหม่] เริ่มนับเวลาเผ่า 30 นาทีใหม่ทุกครั้งที่เข้าฐานใหม่ (ก่อน Commit ใด ๆ
  // เผื่อ ensureRoundStarted() ด้านล่างช้า/ไม่สำเร็จ ก็ยังนับเวลาให้ถูกต้องจากจุด
  // ที่สแกนสำเร็จจริง ๆ) presentMission()/handleMissionContinue() ด้านล่างเป็นคน
  // เคลียร์ Timer นี้ทิ้งเมื่อทำภารกิจของฐานนี้เสร็จแล้ว
  startStationTimer();

  // [Fix — เปิด Round ตรงนี้เท่านั้น] ตามสเปก "Scan ฐานแรกเท่านั้นที่เปิด Round" —
  // ต้องรอให้ยืนยันแล้วว่านี่คือฐานที่ยังไม่เคยผ่าน (ผ่านเงื่อนไข isVisited ด้านบน
  // มาแล้ว) ก่อนค่อยเปิด Round เสมอ ไม่เปิดตอน Login/เข้าหน้า Home/Map เฉย ๆ อีก
  // ต่อไป (ย้ายออกจาก composables/useRequireProfile.ts มาไว้ที่นี่แทน) —
  // ensureRoundStarted() เองมี logic กันเรียกซ้ำอยู่แล้ว (ดู composables/useRound.ts)
  // ฐานที่ 2-4 ของรอบเดียวกันเรียกซ้ำได้อย่างปลอดภัย จะไม่สร้าง Round ใหม่ซ้ำ —
  // ไม่เรียกตอน Offline Mode (ไม่มี Round ฝั่ง Backend ให้เปิดอยู่แล้ว) — เรียกก่อน
  // เสมอไม่ว่าจะเป็นฐาน 1-3 หรือฐาน 4 (แค่ "เปิด Round" เท่านั้น ไม่ใช่การ Commit/
  // จบเกม จึงไม่ขัดกับสเปก "ฐาน 4 เป็นจุดตัดสินใจ ห้าม Auto End" ด้านล่าง)
  if (!isOfflineMode.value && profile.value?.memberId) {
    await ensureRoundStarted(profile.value.memberId, profile.value.firstName);
  }

  /**
   * [Fix — Root Cause] ฐาน 4 (นม/FINAL_STATION_ID) คือ "จุดตัดสินใจ" ไม่ใช่จุดจบ
   * เกมอัตโนมัติ — เดิมโค้ด Commit (toggleStation/queueCheckin/logStationScan)
   * "ทันที" ตอนสแกน ก่อนเปิด Popup ถามด้วยซ้ำ ทำให้กด "เล่นต่อ" แล้ว ✓/คะแนน/
   * Google Sheet record ยังค้างอยู่ (ไม่มีการ Rollback ใด ๆ) และสแกนฐาน 4 ซ้ำไม่ได้
   * อีกเลยเพราะ isVisited() เป็น true ไปแล้ว (เจอ "duplicate" ทันที ไม่มีทาง Popup
   * ขึ้นใหม่) — ฝั่ง Offline เดิมแย่กว่านั้นคือไม่มี Popup ถามเลย ใช้ isComplete()
   * (ครบ 4 ฐาน) เป็นเงื่อนไข Auto End ตรง ๆ ซึ่งขัดสเปกเรื่อง "ห้ามใช้ isComplete/
   * ครบจำนวนฐานเป็นเงื่อนไขจบเกม" โดยตรง
   *
   * แก้โดยแยก Branch ฐาน 4 ออกมาต่างหาก: "ห้าม" toggleStation/queueCheckin/
   * logStationScan/endRound/saveRoundSummary/navigate ใด ๆ ทั้งสิ้นตรงนี้ — แค่เก็บ
   * ชื่อ/คะแนนฐานไว้แสดงผล แล้วเปิด Popup ถาม "ต้องการจบเกมหรือไม่?" เท่านั้น (เหมือน
   * กันทั้ง Online/Offline) การ Commit จริง (ตาม stationId === FINAL_STATION_ID)
   * ถูกย้ายไปที่ commitFinalStationVisit() ด้านล่าง เรียกเฉพาะตอนผู้เล่นกด "จบเกม"
   * แล้วเงื่อนไขที่เหลือผ่านครบเท่านั้น (Online: หลัง Survey Submit สำเร็จ ดู
   * confirmSurveyAndEndGame() / Offline: ทันทีที่กด เพราะไม่มี Survey ให้บันทึกขึ้น
   * ชีตอยู่แล้ว ดู endGameOfflineAfterFinalStation() ด้านล่าง) กด "เล่นต่อ" จึงไม่มี
   * อะไรให้ Rollback เลยตั้งแต่แรก (ดู continuePlayingAfterFinalStation() — ของเดิม
   * ไม่ต้องแก้) และสแกนฐาน 4 ซ้ำได้ Popup ใหม่เสมอเพราะ isVisited(milk) ยังเป็น
   * false อยู่จนกว่าจะ Commit จริง
   */
  if (stationId === FINAL_STATION_ID) {
    scannedStation.value = { name: station.name, points: stationPoint };
    presentMission(stationId, "final");
    return;
  }

  // ฐาน 1-3: Logic เดิมทั้งหมด ไม่มีการแก้ไข (Commit ทันทีเหมือนเดิมทุกประการ)
  // บันทึกลง LocalStorage ก่อนเสมอ (Offline First) — ไม่ยิง Google Sheet ตรงนี้
  // [Fix] ส่ง currentRoundId.value (สดจริง ๆ ณ ตอนนี้ หลัง ensureRoundStarted()
  // ด้านบนพยายามแล้ว) ให้ toggleStation() แนบไปด้วยเสมอ — กันบั๊กคะแนนฐานหายตอน
  // ถึงหน้าสรุปผล (ดูคำอธิบายเต็ม ๆ ที่ useAdventure.ts::toggleStation())
  toggleStation(stationId, currentRoundId.value);

  // -------------------------------------------------------------------
  // Offline Mode (ใหม่): ห้ามแตะระบบ Online/Sync เดิมเลย (queueCheckin/
  // runSync) — บันทึก stationId/stationName/scanTime/ลำดับฐาน ลง Log ของ
  // ตัวเองแทน (ข้อ 8) และ "ห้ามแสดงคะแนน" ในข้อความ feedback (ข้อ 9) — จุดจบเกม
  // ของฐาน 4 ("นม") ไม่ใช้ isComplete() ที่นี่อีกต่อไป (ย้ายไป Branch ฐาน 4
  // ด้านบนทั้งหมดแล้ว) — Branch นี้เหลือแค่ฐาน 1-3 เท่านั้น ไม่แตะพฤติกรรม Offline
  // Mode เดิมของฐาน 1-3 แม้แต่บรรทัดเดียว
  // -------------------------------------------------------------------
  if (isOfflineMode.value) {
    logStationScan(stationId, station.name);
    checkinFeedback.value = {
      kind: "success",
      text: `ผ่าน${station.name}สำเร็จ (บันทึกในเครื่องแล้ว)`,
    };
    // [ใหม่] เปิด Popup ภารกิจ+คำถามด้วย ถ้าฐานนี้มีคำถามกำหนดไว้ (ตัดสิน/บันทึก
    // บนเครื่องได้เต็มรูปแบบแม้ไม่มีเน็ต — ดู useQuestion.ts) after: null เพราะ
    // Offline Mode ใช้ข้อความ checkinFeedback ด้านบนแสดงผลอยู่แล้ว ไม่มี Popup
    // ผลลัพธ์อื่นให้เปิดต่อ
    presentMission(stationId, null);
    return;
  }

  queueCheckin(station, stationPoint);
  checkinFeedback.value = {
    kind: "success",
    text: `ผ่าน${station.name}สำเร็จ +${stationPoint} Point (บันทึกในเครื่องแล้ว)`,
  };

  // แสดง Popup ผลลัพธ์ — ฐาน 1-3 ใช้ Success Popup ปกติ ("เข้าฐานสำเร็จ!") เท่านั้น
  // (ฐานสุดท้าย/นม ไม่มีทางมาถึงบรรทัดนี้อีกต่อไป — return ไปที่ Branch ด้านบนแล้ว)
  // [ใหม่] ผ่าน presentMission() แทนการเปิด successPopupOpen ตรง ๆ — จะแสดง Popup
  // ภารกิจ+คำถามก่อน (ถ้าฐานนี้มีคำถาม) แล้วค่อยเปิด Popup นี้ต่อตอนกด "เดินทางไป
  // เผ่าต่อไป" (ดู handleMissionContinue()) ไม่มีคำถาม = เปิด Popup นี้ทันทีเหมือนเดิม
  scannedStation.value = { name: station.name, points: stationPoint };
  presentMission(stationId, "success");
}

/**
 * [Fix] Commit ฐาน 4 (นม) "จริง" — เรียกเฉพาะตอนผู้เล่นตัดสินใจกด "จบเกม" แล้ว
 * เงื่อนไขที่เหลือผ่านครบเท่านั้น (Offline: เรียกทันทีจาก endGameOfflineAfterFinalStation()
 * / Online: เรียกหลัง Survey Submit สำเร็จจาก confirmSurveyAndEndGame() เท่านั้น —
 * ห้ามเรียกจุดอื่นเด็ดขาด) ทำหน้าที่เดียวกับ Commit ฐาน 1-3 เดิมทุกประการ (toggleStation
 * ก่อนเสมอ + offline -> logStationScan / online -> queueCheckin + runSync) แค่แยก
 * ออกมาเป็นฟังก์ชันเพื่อ "หน่วงเวลา" การ Commit ไว้จนกว่าจะผ่าน Popup ตัดสินใจ (และ
 * Survey ฝั่ง Online) มาก่อนเท่านั้น ไม่มี Logic ใหม่ที่ต่างจากฐาน 1-3 เดิมเลย
 */
async function commitFinalStationVisit(): Promise<void> {
  const station = stations.value.find((s) => s.id === FINAL_STATION_ID)!;
  const stationPoint = station.points ?? POINTS_PER_STATION;

  // [Fix] เหตุผลเดียวกับฐาน 1-3 ใน completeStationVisit() — ดู
  // useAdventure.ts::toggleStation()
  toggleStation(FINAL_STATION_ID, currentRoundId.value);

  if (isOfflineMode.value) {
    logStationScan(FINAL_STATION_ID, station.name);
    checkinFeedback.value = {
      kind: "success",
      text: `ผ่าน${station.name}สำเร็จ (บันทึกในเครื่องแล้ว)`,
    };
    return;
  }

  queueCheckin(station, stationPoint);
  checkinFeedback.value = {
    kind: "success",
    text: `ผ่าน${station.name}สำเร็จ +${stationPoint} Point (บันทึกในเครื่องแล้ว)`,
  };
  // Sync ขึ้น Google Sheet ทันทีหลัง Commit ฐานสุดท้าย ("นม") เหมือนเดิมทุกประการ
  await runSync();
}

/** ปุ่ม "Sync ข้อมูลตอนนี้" — ผู้ใช้กดเองเมื่อไหร่ก็ได้ถ้ามีเน็ต */
async function runSync(): Promise<void> {
  if (!isOnline.value) {
    syncMessage.value =
      "ไม่มีอินเทอร์เน็ต ข้อมูลจะ Sync อัตโนมัติเมื่อมีอินเทอร์เน็ต";
    return;
  }
  const result = await syncNow();
  syncMessage.value = result.message;
}

/** เคลียร์ผลสแกนเดิม — เรียกหลังปิด Popup ผลลัพธ์เสมอ เพื่อให้สแกนฐานถัดไปได้ */
function resetScanResult(): void {
  lastResult.value = "";
  checkinFeedback.value = null;
  scannedStation.value = null;
}

/** ปุ่ม "ตกลง" ของ Success Popup (ฐาน 1-3) — ปิด Popup แล้วพร้อมสแกนฐานถัดไป */
function closeSuccessPopup(): void {
  successPopupOpen.value = false;
  resetScanResult();
}

/** ปุ่ม "เล่นต่อ" ของ Popup ฐานนม — ปิด Popup แล้วพร้อมสแกนต่อ (ไม่แตะ Round logic) */
function continuePlayingAfterFinalStation(): void {
  finalPopupOpen.value = false;
  resetScanResult();
}

/**
 * ปุ่ม "จบเกม" ของ Popup ฐานนม (Popup ตัดสินใจ) — Online: เปิด Popup แบบประเมิน
 * (บังคับตอบ) เท่านั้น "ยังไม่ Commit ฐาน 4 ใด ๆ ทั้งสิ้น" (ย้าย toggleStation/
 * queueCheckin ออกไปที่ commitFinalStationVisit() แล้ว เรียกเฉพาะหลัง Survey
 * Submit สำเร็จใน confirmSurveyAndEndGame() เท่านั้น) — Offline: ไม่มี Survey ให้
 * บันทึกขึ้น Google Sheet (ไม่มีอินเทอร์เน็ตอยู่แล้ว) จึง Commit + จบเกมทันทีผ่าน
 * endGameOfflineAfterFinalStation() ด้านล่าง (Flow เดียวกับ Online ทุกขั้นตอน
 * ยกเว้นไม่มี Survey — Scan ฐาน 4 -> Popup -> จบเกม -> Commit -> Mark visited ->
 * End Round -> Save Summary -> /round-summary)
 *
 * [Fix — root cause ของ "กดจบเกมแล้วเงียบไปเลย ไม่เห็น Popup แบบประเมิน ไม่ไป
 * /round-summary ด้วย"] เดิมปิด Popup ฐานนม (finalPopupOpen = false) แล้วเปิด
 * Popup แบบประเมิน (surveyPopupOpen = true) "ในติ๊กเดียวกัน" — UModal ทั้ง 2 ตัว
 * แชร์กลไก Teleport/Focus-trap เดียวกันของ Nuxt UI พอปิด-เปิดพร้อมกันแบบนี้บาง
 * จังหวะตัวที่เพิ่งเปิดจะถูกกลไกปิด Modal ตัวเดิมที่กำลัง unmount แทรกแซงจน "ปิด
 * ตามไปด้วยทันที" (เห็นเหมือนกดจบเกมแล้วไม่มีอะไรเกิดขึ้นเลย ทั้งที่ Logic ฝั่ง
 * Component ทำงานถูกต้องทุกจุด) — แก้โดยรอ nextTick() ให้ Popup ฐานนมปิด/เคลียร์
 * DOM เสร็จสมบูรณ์ก่อน ค่อยเปิด Popup แบบประเมินอีกที กันการชนกันนี้
 */
async function handleEndGameButtonClick(): Promise<void> {
  if (isOfflineMode.value) {
    await endGameOfflineAfterFinalStation();
    return;
  }
  finalPopupOpen.value = false;
  surveyError.value = "";
  selectedRating.value = null;
  await nextTick();
  surveyPopupOpen.value = true;
}

/**
 * [Fix] จบเกมฝั่ง Offline หลังกด "จบเกม" ที่ Popup ตัดสินใจฐานนม — ไม่มี Survey
 * (ไม่มีอินเทอร์เน็ตให้บันทึกขึ้น Google Sheet อยู่แล้ว) จึง Commit ฐาน 4 ทันที
 * (commitFinalStationVisit() — toggleStation + logStationScan เดิมทุกประการ)
 * ตามด้วย endRound()/saveRoundSummary()/navigate เดิมที่เคยอยู่ใน isComplete()
 * Branch ของ completeStationVisit() (ย้ายมาไว้ที่นี่ทั้งดุ้น ไม่มี Logic ใหม่ที่
 * ต่างจากเดิม แค่เปลี่ยนจุดเรียกจาก "Auto เมื่อ isComplete" เป็น "เรียกตอนกด
 * จบเกมเท่านั้น" ตามสเปก) ครอบ try/finally เหมือนเดิม กันเคส saveRoundSummary()
 * throw (LocalStorage เต็ม/Private Browsing) ไม่ให้ stopCamera()/navigateTo()
 * ไม่ถูกเรียก
 */
const isEndingGameOffline = ref(false);
async function endGameOfflineAfterFinalStation(): Promise<void> {
  if (isEndingGameOffline.value) return;
  isEndingGameOffline.value = true;

  finalPopupOpen.value = false;
  resetScanResult();

  try {
    await commitFinalStationVisit();
    endRound();

    const playedStations = (roundData.value?.stations ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ name: s.stationName, points: 0 }));
    saveRoundSummary({
      mode: "offline",
      startTime: roundData.value?.startedAt
        ? new Date(roundData.value.startedAt).toISOString()
        : null,
      endTime: new Date(
        roundData.value?.endedAt ?? Date.now(),
      ).toISOString(),
      stations: playedStations,
      totalPoint: null,
      // [ใหม่] Offline Mode ไม่มี Round ฝั่ง Backend เลย (roundId: null เสมอ) แต่
      // คำถาม/คำตอบยังตัดสินบนเครื่องได้ตามปกติ (useQuestion.ts เป็น Offline First
      // อยู่แล้ว) จึงยังมี questionPoints/questionCorrectCount ให้แสดงที่หน้าสรุปผล
      roundId: null,
      userId: profile.value?.uid ?? null,
      questionPoints: totalQuestionPoints.value,
      questionCorrectCount: totalQuestionCorrect.value,
    });
  } catch (err) {
    console.error(
      "[endGameOfflineAfterFinalStation] failed to build offline round summary",
      err,
    );
  } finally {
    await stopCamera();
    await navigateTo("/round-summary");
    isEndingGameOffline.value = false;
  }
}

/**
 * ปุ่ม "ยืนยัน" ของ Popup แบบประเมิน — บันทึกคำตอบ (submitSurvey ผูกกับ roundId
 * ปัจจุบันที่ยังไม่ปิด) แล้วค่อย Commit ฐาน 4 จริง (commitFinalStationVisit())
 * ก่อนเรียก endGameAfterFinalStation() เดิมต่อทันที
 *
 * [Fix — เปลี่ยนพฤติกรรมตามสเปกใหม่] เดิมถ้า submitSurvey() พัง จะ "ไม่บล็อก"
 * การจบเกม (log error เฉย ๆ แล้วปล่อยจบเกมต่อตามปกติ) — ตอนนี้ตามสเปก "ถ้า Survey
 * Submit ไม่สำเร็จ: ห้าม Commit ฐาน 4, ห้ามเพิ่มคะแนน, ห้าม End Round, ห้ามออกจาก
 * Survey, ให้ลองใหม่ได้" จึงต้อง "บล็อก" แทน: เจอ error -> ตั้ง surveyError ไว้
 * แสดงผล แล้ว return ทันที (ไม่ปิด surveyPopupOpen, ไม่ commit, ไม่เรียก
 * endGameAfterFinalStation()) ปล่อยให้ผู้เล่นกด "ยืนยัน" ซ้ำได้ (selectedRating
 * ยังเลือกค้างไว้เหมือนเดิม) — Commit ฐาน 4 (toggleStation/queueCheckin/Google
 * Sheet/เพิ่มคะแนน) เกิดขึ้น "หลัง" Survey Submit สำเร็จเท่านั้น ตรงตามลำดับ Flow
 * ที่ต้องการ: Scan ฐาน 4 -> Popup -> จบเกม -> Survey -> Submit สำเร็จ -> Commit
 * ฐาน 4 -> Google Sheet -> เพิ่มคะแนน -> Mark visited/✓ -> End Round -> Save
 * Summary -> /round-summary (endGameAfterFinalStation() เดิมด้านล่างจัดการตั้งแต่
 * "End Round" เป็นต้นไปอยู่แล้ว ไม่มีการแก้ไข Logic ส่วนนั้นเลย)
 */
async function confirmSurveyAndEndGame(): Promise<void> {
  if (!selectedRating.value || surveySubmitting.value) return;
  surveySubmitting.value = true;
  surveyError.value = "";
  try {
    if (
      !isOfflineMode.value &&
      profile.value?.memberId &&
      currentRoundId.value
    ) {
      try {
        await submitSurvey({
          roundId: currentRoundId.value,
          userId: profile.value.memberId,
          firstName: profile.value.firstName,
          favoriteStationRating: selectedRating.value,
        });
      } catch (err) {
        console.error(
          "[confirmSurveyAndEndGame] submitSurvey failed",
          err,
        );
        surveyError.value =
          "บันทึกแบบประเมินไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง";
        return;
      }
    }

    surveyPopupOpen.value = false;
    selectedRating.value = null;
    await commitFinalStationVisit();
    await endGameAfterFinalStation();
  } finally {
    surveySubmitting.value = false;
  }
}

/** ปุ่ม "จบเกม" ของ Popup ฐานนม — ปิด Round ปัจจุบันด้วย roundEnd() (RoundId เดิม,
 * reuse composables/useRound.ts) ก่อนออกจากหน้า แล้วค่อยทำ UI/action เดิมต่อ
 * (ปิดกล้องด้วย stopCamera() เดิม + เด้งกลับหน้าแรกด้วย navigateTo ปกติของ Nuxt)
 *
 * [Fix] เพิ่ม resetJourney() (ของเดิมใน composables/useAdventure.ts ที่มีอยู่แล้ว
 * แต่ไม่เคยถูกเรียกใช้ที่ไหนเลย) — ล้างสถานะ "ฐานที่ผ่านแล้ว/คะแนน" ฝั่งเครื่องนี้
 * ทั้งหมด เพื่อให้เริ่มเล่น "รอบใหม่" ได้ทันที (ไม่ต้องรอกลับมาหน้านี้ใหม่) ไม่แตะ/
 * ไม่ลบข้อมูล Round หรือ Journey เดิมใน Database เลยแม้แต่บรรทัดเดียว — Round เดิม
 * ยังถูกปิดด้วย roundEnd() (RoundId เดิม) ตามปกติ ส่วน Round/Journey ใหม่ของรอบถัดไป
 * (RoundId ใหม่ = "timesection" ใหม่ แยกจากรอบเก่า) จะถูกสร้างให้อัตโนมัติทันทีที่
 * เข้าหน้า Home/Map/Scan หน้าใดหน้าหนึ่ง ผ่าน ensureRoundStarted() เดิม (ดู
 * composables/useRequireProfile.ts) ไม่ต้องเพิ่ม logic ใหม่ตรงนี้เลย
 *
 * [Fix] ก่อน resetJourney() ล้างสถานะทิ้ง — เก็บ "สำเนา" ของรอบนี้ไว้ก่อนเสมอ
 * (เวลาเริ่ม/จบจริงจาก roundEnd(), รายชื่อฐานที่ผ่าน, คะแนนรวม) ผ่าน
 * useRoundSummary().saveRoundSummary() แล้วพาไปหน้า /round-summary แทน /home
 * เดิม (ปิดกล้องทันทีเหมือนเดิมด้วย stopCamera()) หน้านั้นจะเป็นคนแสดงผลสรุป +
 * เตือนไม่ให้ออกจนกว่าจะติดต่อเจ้าหน้าที่ (ดู pages/round-summary.vue) — คะแนน
 * ระหว่างเล่น (ก่อนจบเกม) ไม่โชว์ที่หน้า Home อีกต่อไปแล้ว (ดู pages/home.vue)
 *
 * [Fix — root cause ของ "กด จบเกม แล้วไม่ไปหน้า /round-summary"] เดิม
 * saveRoundSummary()/endCurrentRound()/resetJourney() ไม่ได้ครอบ try/catch เลย
 * สักจุด — ถ้าขั้นตอนไหน throw (พบว่า saveRoundSummary() เดิม throw ได้จริงจาก
 * localStorage.setItem() ที่ไม่มี try/catch — ดู composables/useRoundSummary.ts —
 * เช่นตอน Safari Private Browsing หรือพื้นที่เก็บข้อมูลเต็มบนเครื่องที่ใช้เล่นเกม
 * กลางแจ้ง) ฟังก์ชัน async นี้จะหยุดทำงานเงียบ ๆ กลางคัน (unhandled rejection ไม่มี
 * UI แจ้งเตือน) ทำให้ stopCamera()/navigateTo('/round-summary') "ไม่ถูกเรียกเลย"
 * ทั้งที่ finalPopupOpen.value = false ไปแล้วตั้งแต่บรรทัดแรก (Popup เลยดูเหมือน
 * ปิดไปเฉย ๆ ไม่เกิดอะไรต่อ) — แก้โดยครอบ try/finally: ไม่ว่าขั้นตอนเก็บสรุปผล/
 * ปิด Round จะสำเร็จหรือไม่ ก็ต้องปิดกล้อง + navigateTo('/round-summary') เสมอใน
 * finally (saveRoundSummary() เองก็แก้ให้ไม่ throw แล้วเช่นกัน ที่นี่ครอบอีกชั้น
 * เผื่อ error อื่นที่ไม่คาดคิดจาก endCurrentRound()/resetJourney()) */
const isEndingGame = ref(false);
async function endGameAfterFinalStation(): Promise<void> {
  // กันกด "จบเกม" ซ้ำเร็ว ๆ (ดับเบิลคลิก/แตะซ้อน) ยิง navigateTo ซ้อนกัน
  if (isEndingGame.value) return;
  isEndingGame.value = true;

  finalPopupOpen.value = false;
  resetScanResult();

  try {
    const playedStations = stations.value
      .filter((s) => isVisited(s.id))
      .map((s) => ({ name: s.name, points: s.points ?? POINTS_PER_STATION }));
    const roundTotalPoint = totalPoint.value;
    // [ใหม่] จับค่า roundId ไว้ "ก่อน" endCurrentRound() ด้านล่าง — endCurrentRound()
    // เคลียร์ currentRoundId.value เป็น null ใน finally ของมันเองเสมอ (ดู
    // composables/useRound.ts) ถ้าไปอ่านค่าหลังเรียกจะได้ null ผิดพลาด ต้องจับสด ๆ
    // ตรงนี้ก่อนเสมอ เพื่อบันทึกเป็น "รหัสรอบ" ที่หน้าสรุปผลได้ถูกต้อง
    const roundIdForSummary = currentRoundId.value;
    const userIdForSummary = profile.value?.memberId || profile.value?.uid || null;

    let startTimeIso: string | null = null;
    let endTimeIso = new Date().toISOString();

    if (!isOfflineMode.value && profile.value?.memberId) {
      // [Fix — root cause ของ "มือถือกลับ Home แล้วเป็น 1/4 ฐานนมยัง ✓"] เดิมฐาน
      // ที่ผ่านระหว่างเล่น (queueCheckin) จะถูกลอง Sync ขึ้น Google Sheet แค่ครั้งเดียว
      // ตอนสแกนผ่านฐานนมสำเร็จ (บรรทัด "await runSync()" ด้านบนใน completeStationVisit)
      // ถ้าจังหวะนั้นเน็ตมือถือกระตุก/หลุดชั่วคราว (พบบ่อยกว่าฝั่งคอม/Wi-Fi) จะมีบางฐาน
      // ค้างอยู่ใน queue (useOfflineSync -> pendingCheckins) โดยไม่มีการลองใหม่อีกจนกว่า
      // จะถึงรอบ Retry อัตโนมัติ 45 วินาที (plugins/offline-sync.client.ts) — resetJourney()
      // ด้านล่างล้างแค่ visitedIds/roundId ของรอบนี้ในเครื่อง แต่ "ไม่ได้แตะ queue ค้างนี้เลย"
      // พอผู้เล่นกด "กลับ Home" แล้วรอบใหม่เริ่มไปแล้ว (Round ใหม่บน backend) ตัว Retry 45
      // วินาทีค่อยส่งฐานที่ค้างขึ้นชีตสำเร็จทีหลัง — แต่ server (resolveCurrentRoundId_ ใน
      // CheckinService.gs) ผูกฐานนั้นเข้ากับ "Round ที่ Active อยู่ ณ ตอนนั้น" เสมอ (ไม่รู้จัก
      // Round เดิมที่ค้างแล้ว) เลยกลายเป็นฐานของรอบเก่าไปโผล่ในรอบใหม่แทน แล้ว
      // refreshFromBackend() (ที่ syncNow() เรียกต่อท้ายเสมอ) ก็ merge กลับเข้า visitedIds
      // ของรอบใหม่ให้ถูกต้องตามข้อมูล backend จริง (Merge ถูก Logic) แต่ข้อมูลตั้งต้นผิดตั้งแต่
      // ชั้น Sync แล้ว — หน้า Home เลยเห็นฐานนม (หรือฐานอื่นที่ค้าง sync) ติ๊ก ✓ ค้างมาทั้งที่
      // เพิ่งกด "จบเกม"/reset ไปหมาดๆ
      //
      // แก้ที่ต้นเหตุ: บังคับให้ลอง Sync queue ที่เหลือ "อีกครั้ง" ตรงนี้ (ก่อน endCurrentRound()
      // ปิด Round) ขณะที่ Round เดิมยังคง Active อยู่บน backend เสมอ — ให้ฐานที่ค้างจาก
      // ความกระตุกของเน็ตช่วงสแกนฐานนม มีโอกาสถูกผูกเข้ากับ Round เดิมที่ถูกต้องก่อนที่ Round
      // จะปิดจริง ปิดช่องโหว่จังหวะ (race) ที่ทำให้ฐานเก่าไปโผล่ในรอบใหม่ได้เกือบทั้งหมด (เน็ต
      // มือถือหลุดแค่ชั่วครู่ระหว่างสแกน มักจะกลับมาใช้ได้แล้วภายในไม่กี่วินาทีที่ผู้เล่นกด "จบเกม")
      // ไม่ยิงซ้ำถ้าไม่มีอะไรค้างอยู่แล้ว (syncNow() เช็ค pendingCheckins ว่างแล้ว return
      // ทันทีโดยไม่ทำอะไรต่อ) และไม่แตะ Logic คะแนน/การคำนวณใด ๆ ใน Google Sheet เลย — ใช้
      // ฟังก์ชัน syncNow() เดิมที่มีอยู่แล้วเท่านั้น
      if (isOnline.value) {
        await runSync();
      }

      const endedRound = await endCurrentRound(profile.value.memberId);
      if (endedRound) {
        startTimeIso = endedRound.startTime || null;
        endTimeIso = endedRound.endTime || endTimeIso;
      }
      // [Fix — ตามสเปก "หลังจบเกมห้ามล้างข้อมูลก่อนหน้า /round-summary"] resetJourney()
      // "ย้ายออกไป" ที่ปุ่ม "ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก" ของหน้า
      // /round-summary แทน (ดู confirmAndGoHome() ในไฟล์นั้น) — endCurrentRound()
      // ด้านบนยังปิด Round ฝั่ง Backend ทันทีตอนกด "จบเกม" เหมือนเดิมทุกประการ
      // (แค่ backend Round record ปิด ไม่ใช่ Current Round Frontend state) ส่วน
      // visitedIds/currentRoundId ฝั่งเครื่องนี้ยังคงอยู่ครบจนกว่าจะกดยืนยันที่หน้า
      // /round-summary — กันเคส "backend ปิด Round ไปแล้วแต่ Frontend ยังเห็นฐาน
      // ผ่านครบ" ไม่ตรงกัน โดยยึดว่าหน้า /round-summary อ่านจาก roundSummary:last
      // (สแนปช็อตที่เก็บไว้ด้านล่างนี้) เท่านั้น ไม่ได้อ่านจาก visitedIds สด ๆ อยู่แล้ว
    }

    // saveRoundSummary() ต้อง "สำเร็จก่อนเสมอ" ก่อนค่อย navigate ไปหน้า
    // /round-summary (เก็บข้อมูลรอบนี้ให้ครบก่อนเปลี่ยนหน้าเสมอ)
    saveRoundSummary({
      mode: isOfflineMode.value ? "offline" : "online",
      startTime: startTimeIso,
      endTime: endTimeIso,
      stations: playedStations,
      totalPoint: isOfflineMode.value ? null : roundTotalPoint,
      // [ใหม่] roundId/userId ไว้แสดงเป็น "รหัสรอบ"/"รหัสลูกค้า" ที่หน้าสรุปผล +
      // ใช้อ้างอิงตอนแลกของรางวัล — questionPoints/questionCorrectCount คนละก้อน
      // กับ totalPoint (คะแนนจากตอบคำถามถูก ไม่ใช่จากสแกนฐาน — ดู useQuestion.ts)
      roundId: isOfflineMode.value ? null : roundIdForSummary,
      userId: userIdForSummary,
      questionPoints: totalQuestionPoints.value,
      questionCorrectCount: totalQuestionCorrect.value,
    });
  } catch (err) {
    console.error(
      "[endGameAfterFinalStation] failed to build round summary",
      err,
    );
  } finally {
    await stopCamera();
    await navigateTo("/round-summary");
    isEndingGame.value = false;
  }
}

/** ปุ่ม/ฟอร์ม "กรอกรหัสฐาน" — รองรับกรณีสแกน QR ไม่ได้ (กล้องเสีย/QR ชำรุด) */
async function submitManualCode(): Promise<void> {
  if (
    !manualCode.value.trim() ||
    isResultPopupOpen.value ||
    isProcessingScan.value
  )
    return;
  await processStationCode(manualCode.value);
  manualCode.value = "";
}

function pickDefaultCameraIndex(list: CameraDevice[]): number {
  // มือถือส่วนใหญ่กล้องหลัง (back/environment) จะช่วยสแกน QR ได้ง่ายกว่า
  const backIndex = list.findIndex((cam) =>
    /back|rear|environment/i.test(cam.label),
  );
  return backIndex >= 0 ? backIndex : 0;
}

async function startCamera(cameraId?: string) {
  if (!Html5QrcodeCtor) return;
  scanState.value = "starting";
  errorMessage.value = "";

  try {
    if (!html5Qrcode) {
      html5Qrcode = new Html5QrcodeCtor(QR_ELEMENT_ID, { verbose: false });
    }

    const targetCameraId =
      cameraId ?? cameras.value[activeCameraIndex.value]?.id;

    await html5Qrcode.start(
      targetCameraId
        ? { deviceId: { exact: targetCameraId } }
        : { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1,
      },
      (decodedText) => {
        // html5-qrcode จะเรียก callback นี้ซ้ำทุกเฟรมตราบใดที่ QR ยังอยู่ในกล้อง
        // เช็ค lastResult ก่อนกันไม่ให้ประมวลผลรหัสเดิมซ้ำ ๆ ระหว่างยังไม่ได้กด
        // "สแกนอีกครั้ง" — ผู้ใช้ต้องกดล้างผลลัพธ์เดิมก่อนสแกนฐานถัดไปเสมอ
        if (
          lastResult.value ||
          isResultPopupOpen.value ||
          isProcessingScan.value
        )
          return;
        lastResult.value = decodedText;
        void processScannedStationQr(decodedText);
      },
      () => {
        // ยังไม่เจอ QR ในเฟรมนี้ — เป็นเรื่องปกติระหว่างสแกน ไม่ต้องแจ้งเตือน
      },
    );

    scanState.value = "running";
  } catch (err) {
    scanState.value = "error";
    errorMessage.value =
      err instanceof Error
        ? err.message
        : "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง";
  }
}

async function stopCamera() {
  if (html5Qrcode && scanState.value === "running") {
    try {
      await html5Qrcode.stop();
      html5Qrcode.clear();
    } catch {
      // เพิกเฉยถ้าปิดซ้ำ/ปิดตอนที่ยังไม่ทันเริ่ม
    }
  }
  scanState.value = "stopped";
}

async function switchCamera() {
  if (cameras.value.length < 2) return;
  if (html5Qrcode && scanState.value === "running") {
    try {
      await html5Qrcode.stop();
      html5Qrcode.clear();
    } catch {
      // ignore
    }
  }
  activeCameraIndex.value =
    (activeCameraIndex.value + 1) % cameras.value.length;
  await startCamera(cameras.value[activeCameraIndex.value]?.id);
}

async function retryCamera() {
  lastResult.value = "";
  await startCamera(cameras.value[activeCameraIndex.value]?.id);
}

onMounted(async () => {
  // ส่ง memberId เข้าไปด้วย (ถ้ามี) เพื่อดึงฐานที่ผ่านจริงจาก Google Sheet มา
  // กันซ้ำได้แม่นยำขึ้น (เผื่อผ่านฐานนี้จากเครื่อง/รอบก่อนหน้าที่ sync ไปแล้ว)
  await initAdventure(profile.value?.memberId);
  initOfflineSync();
  // [ใหม่] โหลดคำถามทุกฐานมา cache ไว้ล่วงหน้า + เตรียมคิว sync คำตอบ (ระบบขนาน
  // ของ useQuestion.ts/useOfflineAnswerSync.ts — ไม่กระทบ initAdventure/
  // initOfflineSync ข้างบนเลย) initAnsweredState() เรียกจริงใน presentMission()
  // อีกที (ต้องรอ currentRoundId พร้อมก่อนเสมอ — ที่นี่แค่โหลดคลังคำถามพอ)
  await initQuestions();
  initOfflineAnswerSync();
  // [ใหม่] โหลดค่า Timer ที่ค้างจาก LocalStorage กลับมา (เผื่อ Refresh หน้ากลาง
  // ฐาน) — เริ่มนับต่อทันที ไม่รีเซ็ตค่าใด ๆ (ดู composables/useRoundTimer.ts)
  initRoundTimer();

  const mod = await import("html5-qrcode");
  Html5QrcodeCtor = mod.Html5Qrcode;

  try {
    const list = await mod.Html5Qrcode.getCameras();
    cameras.value = list;
    activeCameraIndex.value = pickDefaultCameraIndex(list);
  } catch {
    // ถ้า enumerate กล้องไม่ได้ ยังลองเปิดด้วย facingMode: environment ต่อได้อยู่
  }

  // เปิดกล้องอัตโนมัติทันทีที่เข้าหน้านี้
  await startCamera(cameras.value[activeCameraIndex.value]?.id);

  window.addEventListener("beforeunload", handleScanPageBeforeUnload);
});

/**
 * [ใหม่] เวลารอบ (2 ชม.) หรือเวลาเผ่า (30 นาที) หมด ระหว่างที่ผู้เล่นอยู่หน้านี้
 * พอดี — ตามกติกา "หมดเวลา = บังคับจบรอบ" ปิด Popup/กล้องของหน้านี้ก่อนเสมอ
 * (forceEndRoundDueToTimeout() ไม่รู้จัก UI ของหน้านี้เลย) แล้วค่อยเรียกจบรอบจริง
 * ผ่าน composables/useForceEndRound.ts (เหมือนกด "จบเกม" แต่ไม่มี Survey/ไม่
 * Commit ฐานนม — ดูเหตุผลเต็ม ๆ ในไฟล์นั้น)
 */
watch([isRoundExpired, isStationExpired], async ([roundExpired, stationExpired]) => {
  if (!roundExpired && !stationExpired) return;

  missionPopupOpen.value = false;
  successPopupOpen.value = false;
  finalPopupOpen.value = false;
  surveyPopupOpen.value = false;
  await stopCamera();
  await forceEndRoundDueToTimeout(roundExpired ? "round" : "station");
});

onBeforeUnmount(async () => {
  window.removeEventListener("beforeunload", handleScanPageBeforeUnload);

  if (html5Qrcode && scanState.value === "running") {
    try {
      await html5Qrcode.stop();
      html5Qrcode.clear();
    } catch {
      // ignore
    }
  }
});
</script>

<template>
  <div class="page">
    <PageHeader title="Scan QR Code" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="scan">
      <!-- [ใหม่] ป้ายเวลาเผ่าที่เหลือ — แสดงเฉพาะระหว่างกำลังทำภารกิจของฐานหนึ่งอยู่ -->
      <div v-if="stationRemainingLabel" class="scan__station-timer">
        <UIcon name="i-lucide-hourglass" />
        เวลาทำภารกิจฐานนี้เหลือ {{ stationRemainingLabel }}
      </div>

      <div
        class="scan__viewport"
        :class="{
          'scan__viewport--hidden':
            scanState !== 'running' && scanState !== 'starting',
        }"
      >
        <div :id="QR_ELEMENT_ID" class="scan__reader" />
      </div>

      <div v-if="scanState === 'starting'" class="scan__frame">
        <UIcon name="i-lucide-loader-2" class="scan__icon scan__icon--spin" />
        <p class="scan__title">กำลังเปิดกล้อง...</p>
      </div>

      <div v-else-if="scanState === 'error'" class="scan__frame">
        <UIcon name="i-lucide-camera-off" class="scan__icon" />
        <p class="scan__title">เปิดกล้องไม่สำเร็จ</p>
        <p class="scan__desc">{{ errorMessage }}</p>
        <UButton color="primary" icon="i-lucide-rotate-cw" @click="retryCamera"
          >ลองใหม่อีกครั้ง</UButton
        >
      </div>

      <div v-else-if="scanState === 'stopped'" class="scan__frame">
        <UIcon name="i-lucide-scan-line" class="scan__icon" />
        <p class="scan__title">ปิดกล้องแล้ว</p>
        <p class="scan__desc">กดเปิดกล้องอีกครั้งเพื่อสแกน QR Code</p>
        <UButton color="primary" icon="i-lucide-camera" @click="retryCamera"
          >เปิดกล้อง</UButton
        >
      </div>

      <template v-else>
        <p class="scan__title">วางกล้องให้ตรง QR Code</p>
        <p class="scan__desc">
          ใช้สแกน QR Code เพื่อสะสมคะแนน หรือรับสิทธิพิเศษหน้าร้าน
        </p>
      </template>

      <div v-if="lastResult" class="scan__result">
        <UIcon
          :name="
            checkinFeedback?.kind === 'success'
              ? 'i-lucide-badge-check'
              : checkinFeedback?.kind === 'duplicate'
                ? 'i-lucide-info'
                : 'i-lucide-triangle-alert'
          "
          class="scan__result-icon"
        />
        <div class="scan__result-body">
          <p class="scan__result-label">
            {{
              checkinFeedback?.kind === "invalid"
                ? "สแกนไม่สำเร็จ"
                : "สแกนสำเร็จ"
            }}
          </p>
          <p class="scan__result-value">
            {{ checkinFeedback?.text || lastResult }}
          </p>
        </div>
        <UButton
          size="xs"
          variant="soft"
          @click="
            lastResult = '';
            checkinFeedback = null;
          "
          >สแกนอีกครั้ง</UButton
        >
      </div>

      <div
        v-if="scanState === 'running' || scanState === 'starting'"
        class="scan__controls"
      >
        <button
          type="button"
          class="scan__control-btn"
          :disabled="cameras.length < 2"
          @click="switchCamera"
        >
          <UIcon name="i-lucide-refresh-ccw" class="scan__control-icon" />
          <span>สลับกล้อง</span>
        </button>
        <button
          type="button"
          class="scan__control-btn scan__control-btn--danger"
          @click="stopCamera"
        >
          <UIcon name="i-lucide-camera-off" class="scan__control-icon" />
          <span>ปิดกล้อง</span>
        </button>
      </div>

      <!-- กรอกรหัสฐานเอง — เผื่อกล้องใช้ไม่ได้ หรือ QR ชำรุด (รองรับ CORN001/COW001/SOIL001/MILK001) -->
      <form class="manual-code" @submit.prevent="submitManualCode">
        <UInput
          v-model="manualCode"
          placeholder="หรือกรอกรหัสฐาน เช่น CORN001"
          size="lg"
          class="manual-code__input"
        />
        <UButton
          type="submit"
          color="primary"
          size="lg"
          :disabled="!manualCode.trim()"
          >ยืนยัน</UButton
        >
      </form>

      <!-- Offline Mode (ใหม่): ล็อกทั้ง Session แล้ว ไม่มีการ Sync ขึ้น Google Sheet
           เลย จึงไม่แสดงการ์ด Sync เดิม (จะสับสน เพราะเดิมอ้างอิง navigator.onLine
           สด ๆ ซึ่งอาจกลับมาออนไลน์ได้ระหว่างเล่น แต่แอปยังคงล็อก Offline Mode
           อยู่) แสดง Badge ง่าย ๆ แทนว่ากำลังอยู่ในโหมดออฟไลน์ -->
      <section v-if="isOfflineMode" class="sync-card">
        <div class="sync-card__row">
          <UIcon
            name="i-lucide-wifi-off"
            class="sync-card__icon sync-card__icon--offline"
          />
          <div class="sync-card__text">
            <p class="sync-card__title">โหมดออฟไลน์</p>
            <p class="sync-card__desc">
              ข้อมูลบันทึกในเครื่องเท่านั้น ไม่มีการเชื่อมต่ออินเทอร์เน็ต
            </p>
          </div>
        </div>
      </section>

      <!-- สถานะ Offline Sync (ระบบเดิม): ข้อมูลค้าง Sync กี่ฐาน + ปุ่ม Sync มือ -->
      <section v-else class="sync-card">
        <div class="sync-card__row">
          <UIcon
            :name="isOnline ? 'i-lucide-wifi' : 'i-lucide-wifi-off'"
            class="sync-card__icon"
            :class="{ 'sync-card__icon--offline': !isOnline }"
          />
          <div class="sync-card__text">
            <p class="sync-card__title">
              {{ isOnline ? "ออนไลน์" : "ออฟไลน์" }}
            </p>
            <p class="sync-card__desc">
              {{
                hasPending
                  ? `มี ${pendingCount} ฐานรอ Sync ขึ้น Google Sheet`
                  : "Sync ข้อมูลล่าสุดแล้ว"
              }}
            </p>
          </div>
          <UButton
            size="sm"
            variant="soft"
            :loading="isSyncing"
            :disabled="!hasPending || !isOnline || isSyncing"
            @click="runSync"
          >
            Sync ตอนนี้
          </UButton>
        </div>
        <p v-if="syncMessage" class="sync-card__message">{{ syncMessage }}</p>
        <p v-else-if="hasPending && !isOnline" class="sync-card__message">
          ข้อมูลจะ Sync อัตโนมัติเมื่อมีอินเทอร์เน็ต
        </p>
      </section>
    </div>

    <!-- [ใหม่] Popup "ภารกิจ + คำถามประจำฐาน" — เปิดก่อน Popup ผลลัพธ์ด้านล่างเสมอ
         (ถ้าฐานนี้มีคำถามกำหนดไว้ — ดู presentMission() ในสคริปต์ด้านบน) -->
    <MissionQuestionPopup
      v-if="activeMissionQuestion"
      v-model:open="missionPopupOpen"
      :station-name="activeMissionStationName"
      :question="activeMissionQuestion"
      :answered="activeMissionAnswer"
      @submit="handleMissionSubmit"
      @continue="handleMissionContinue"
    />

    <!-- Popup "เข้าฐานสำเร็จ!" — ฐาน 1-3 (ไม่ใช่ฐานนม/ฐานสุดท้าย) -->
    <UModal
      v-model:open="successPopupOpen"
      title="เข้าฐานสำเร็จ!"
      :dismissible="false"
      :close="false"
    >
      <template #body>
        <div class="result-popup">
          <UIcon name="i-lucide-party-popper" class="result-popup__icon" />
          <p class="result-popup__station">{{ scannedStation?.name }}</p>
          <p v-if="scannedStation" class="result-popup__points">
            +{{ scannedStation.points }} Point
          </p>
        </div>
      </template>
      <template #footer>
        <UButton block color="primary" @click="closeSuccessPopup">ตกลง</UButton>
      </template>
    </UModal>

    <!-- Popup พิเศษฐานสุดท้าย (นม) — "ยินดีด้วย! คุณมาถึงฐานนมแล้ว" + เล่นต่อ/จบเกม -->
    <UModal
      v-model:open="finalPopupOpen"
      title="ยินดีด้วย! คุณมาถึงฐานนมแล้ว"
      :dismissible="false"
      :close="false"
    >
      <template #body>
        <div class="result-popup">
          <UIcon name="i-lucide-milk" class="result-popup__icon" />
          <p class="result-popup__station">{{ scannedStation?.name }}</p>
          <p v-if="scannedStation" class="result-popup__points">
            +{{ scannedStation.points }} Point
          </p>
        </div>
      </template>
      <template #footer>
        <div class="result-popup__actions">
          <UButton
            block
            color="neutral"
            variant="soft"
            @click="continuePlayingAfterFinalStation"
            >เล่นต่อ</UButton
          >
          <UButton
            block
            color="primary"
            :loading="isEndingGame || isEndingGameOffline"
            :disabled="isEndingGame || isEndingGameOffline"
            @click="handleEndGameButtonClick"
            >จบเกม</UButton
          >
        </div>
      </template>
    </UModal>

    <!-- Popup แบบประเมิน (ใหม่) — บังคับตอบก่อนออกจากเกม (Online เท่านั้น) เปิดแทน
         การเรียก endGameAfterFinalStation() ตรง ๆ ตอนกด "จบเกม" ที่ Popup ฐานนม -->
    <UModal
      v-model:open="surveyPopupOpen"
      title="แบบประเมิน"
      :dismissible="false"
      :close="false"
    >
      <template #body>
        <div class="survey-popup">
          <p class="survey-popup__question">ท่านชอบด่านไหนมากที่สุด</p>
          <div class="survey-popup__scale">
            <button
              v-for="option in SURVEY_RATING_OPTIONS"
              :key="option.value"
              type="button"
              class="survey-popup__option"
              :class="{
                'survey-popup__option--selected': selectedRating === option.value,
              }"
              @click="selectedRating = option.value"
            >
              <span class="survey-popup__option-value">{{ option.value }}</span>
              <span class="survey-popup__option-label">{{ option.label }}</span>
            </button>
          </div>
          <p v-if="surveyError" class="survey-popup__error">{{ surveyError }}</p>
        </div>
      </template>
      <template #footer>
        <UButton
          block
          color="primary"
          :loading="surveySubmitting"
          :disabled="!selectedRating || surveySubmitting"
          @click="confirmSurveyAndEndGame"
        >
          ยืนยัน
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}
.page__spinner {
  width: 2rem;
  height: 2rem;
  color: var(--farm-accent-dark);
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.scan {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 1.5rem 1.25rem 2rem;
  text-align: center;
}

.scan__station-timer {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  color: var(--farm-wood-dark);
  font-weight: 700;
  font-size: 0.82rem;
}

.scan__viewport {
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 1 / 1;
  border-radius: 1.25rem;
  overflow: hidden;
  position: relative;
  border: 3px solid var(--farm-wood);
  background: #000;
  box-shadow: 0 8px 0 -4px var(--farm-wood-dark);
}

.scan__viewport--hidden {
  display: none;
}

.scan__reader {
  width: 100%;
  height: 100%;
}

.scan__reader :deep(video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

.scan__frame {
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 1 / 1;
  border-radius: 1.25rem;
  border: 3px dashed var(--farm-wood);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.4);
  padding: 1.5rem;
}

.scan__icon {
  width: 3rem;
  height: 3rem;
  color: var(--farm-accent-dark);
}

.scan__icon--spin {
  animation: spin 1s linear infinite;
}

.scan__title {
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.25rem 0 0;
}

.scan__desc {
  font-size: 0.8rem;
  color: var(--farm-text-muted);
  margin: 0;
  max-width: 22rem;
}

.scan__result {
  width: 100%;
  max-width: 20rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-accent);
  text-align: left;
}

.scan__result-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.scan__result-body {
  flex: 1;
  min-width: 0;
}

.scan__result-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
  margin: 0;
}

.scan__result-value {
  font-size: 0.8rem;
  color: var(--farm-text-dark);
  margin: 0.1rem 0 0;
  word-break: break-all;
}

.scan__controls {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 20rem;
}

.scan__control-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 0.5rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  color: var(--farm-text-dark);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
}

.scan__control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.scan__control-btn--danger {
  border-color: #d97a5f;
  color: #a8442b;
}

.scan__control-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.manual-code {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 20rem;
}

.manual-code__input {
  flex: 1;
  min-width: 0;
}

.sync-card {
  width: 100%;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 1.5px solid var(--farm-wood);
  text-align: left;
}

.sync-card__row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sync-card__icon {
  width: 1.35rem;
  height: 1.35rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.sync-card__icon--offline {
  color: #a8442b;
}

.sync-card__text {
  flex: 1;
  min-width: 0;
}

.sync-card__title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.sync-card__desc {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}

.sync-card__message {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.result-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  padding: 0.5rem 0 1rem;
}

.result-popup__icon {
  width: 3rem;
  height: 3rem;
  color: var(--farm-accent-dark);
}

.result-popup__station {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0;
}

.result-popup__points {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
  margin: 0;
}

.result-popup__actions {
  display: flex;
  gap: 0.6rem;
  width: 100%;
}

.survey-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.9rem;
  padding: 0.5rem 0 0.5rem;
}

.survey-popup__question {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.survey-popup__scale {
  display: flex;
  gap: 0.4rem;
  width: 100%;
}

.survey-popup__option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.6rem 0.25rem;
  border-radius: 0.75rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  color: var(--farm-text-dark);
  cursor: pointer;
}

.survey-popup__option--selected {
  border-color: var(--farm-accent-dark);
  background: var(--farm-accent);
  color: var(--farm-cream);
}

.survey-popup__option-value {
  font-size: 1.05rem;
  font-weight: 800;
}

.survey-popup__option-label {
  font-size: 0.62rem;
  line-height: 1.2;
}

.survey-popup__error {
  font-size: 0.78rem;
  color: #b3441f;
  margin: 0;
}
</style>
