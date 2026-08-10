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

const { stations, isVisited, isComplete, toggleStation, initAdventure } =
  useAdventure();
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
const { isOfflineMode, logStationScan, endRound } = useOfflineMode();
// Online Round (ใหม่): ใช้เฉพาะปุ่ม "จบเกม" ของ Popup ฐานนมด้านล่าง (endGameAfterFinalStation)
// เพื่อปิด Round ปัจจุบันด้วย roundEnd() — reuse composables/useRound.ts ที่จัดการ
// Round ทั้งหมดอยู่แล้ว (roundStart ถูกเรียกไปแล้วครั้งเดียวตอน useRequireProfile guard
// ทำงาน ไม่เกี่ยวกับหน้านี้) ไม่แตะ Logic การสแกน/กล้อง/Map/Journey อื่นใดในไฟล์นี้เลย
const { endCurrentRound } = useRound();

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
/** true ระหว่างที่มี Popup ผลลัพธ์ค้างอยู่ — ใช้กันการสแกน/กรอกรหัสซ้ำซ้อน */
const isResultPopupOpen = computed(
  () => successPopupOpen.value || finalPopupOpen.value,
);

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

  // บันทึกลง LocalStorage ก่อนเสมอ (Offline First) — ไม่ยิง Google Sheet ตรงนี้
  toggleStation(stationId);

  // -------------------------------------------------------------------
  // Offline Mode (ใหม่): ห้ามแตะระบบ Online/Sync เดิมเลย (queueCheckin/
  // runSync) — บันทึก stationId/stationName/scanTime/ลำดับฐาน ลง Log ของ
  // ตัวเองแทน (ข้อ 8) และ "ห้ามแสดงคะแนน" ในข้อความ feedback (ข้อ 9) —
  // เมื่อผ่านครบทุกฐานแล้ว (isComplete) ให้บันทึก round_datetime.end (ข้อ 10)
  // Popup ใหม่ (เข้าฐานสำเร็จ/ถึงฐานนม) ใช้เฉพาะฝั่ง Online เท่านั้น จึงไม่
  // เปิด Popup ใน Branch นี้เลย — ไม่แตะพฤติกรรม Offline Mode เดิมแม้แต่บรรทัดเดียว
  // -------------------------------------------------------------------
  if (isOfflineMode.value) {
    logStationScan(stationId, station.name);
    checkinFeedback.value = {
      kind: "success",
      text: `ผ่าน${station.name}สำเร็จ (บันทึกในเครื่องแล้ว)`,
    };
    if (isComplete.value) {
      endRound();
    }
    return;
  }

  queueCheckin(station, stationPoint);
  checkinFeedback.value = {
    kind: "success",
    text: `ผ่าน${station.name}สำเร็จ +${stationPoint} Point (บันทึกในเครื่องแล้ว)`,
  };

  // แสดง Popup ผลลัพธ์ — ฐาน 1-3 ใช้ Success Popup ปกติ ("เข้าฐานสำเร็จ!"),
  // ฐานสุดท้าย (นม) ใช้ Popup พิเศษ ("ยินดีด้วย! คุณมาถึงฐานนมแล้ว" + เล่นต่อ/จบเกม)
  scannedStation.value = { name: station.name, points: stationPoint };
  if (stationId === FINAL_STATION_ID) {
    finalPopupOpen.value = true;
  } else {
    successPopupOpen.value = true;
  }

  // Sync ขึ้น Google Sheet เฉพาะตอนผ่านฐานสุดท้าย ("นม") และต้องมีเน็ตเท่านั้น
  if (stationId === FINAL_STATION_ID) {
    await runSync();
  }
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

/** ปุ่ม "จบเกม" ของ Popup ฐานนม — ปิด Round ปัจจุบันด้วย roundEnd() (RoundId เดิม,
 * reuse composables/useRound.ts) ก่อนออกจากหน้า แล้วค่อยทำ UI/action เดิมต่อ
 * (ปิดกล้องด้วย stopCamera() เดิม + เด้งกลับหน้าแรกด้วย navigateTo ปกติของ Nuxt)
 * ไม่แตะ Logic การสแกน/กล้อง/Map/Journey อื่นใดในไฟล์นี้เลยนอกจากบรรทัด roundEnd นี้ */
async function endGameAfterFinalStation(): Promise<void> {
  finalPopupOpen.value = false;
  resetScanResult();
  if (!isOfflineMode.value && profile.value?.memberId) {
    await endCurrentRound(profile.value.memberId);
  }
  await stopCamera();
  await navigateTo("/home");
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
});

onBeforeUnmount(async () => {
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
          <UButton block color="primary" @click="endGameAfterFinalStation"
            >จบเกม</UButton
          >
        </div>
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
</style>
