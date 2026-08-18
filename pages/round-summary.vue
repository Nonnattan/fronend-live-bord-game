<script setup lang="ts">
/**
 * pages/round-summary.vue
 * ---------------------------------------------------------------------------
 * หน้าสรุปผล "หลังจบเกม" — เข้ามาจาก pages/scan.vue เท่านั้น (ทั้ง 2 ทาง):
 *   1) ฝั่ง Online: กด "จบเกม" ที่ Popup ฐานนม -> endGameAfterFinalStation()
 *   2) ฝั่ง Offline: สแกนครบทั้ง 4 ฐาน -> completeStationVisit() (branch Offline Mode)
 * ทั้ง 2 จุด ปิดกล้อง (stopCamera) ก่อน navigateTo หน้านี้เรียบร้อยแล้ว — หน้านี้
 * แสดง "สำเนาสรุปผล" ที่ถูกเก็บไว้ (ดู composables/useRoundSummary.ts)
 *
 * [แก้ไข] หน้านี้ "ไม่ reset อะไรเองอีกต่อไปเด็ดขาด" — เดิมปุ่ม "ติดต่อเจ้าหน้าที่
 * แล้ว / กลับสู่หน้าหลัก" กด reset ทันที (resetJourney/resetAnswered/
 * clearAllTimers/clearRoundSummary) โดยไม่สนใจว่าเจ้าหน้าที่ยืนยันมอบรางวัลจริง
 * หรือยัง — ตามสเปกใหม่ "RoundId เป็นตัวอ้างอิงหลัก + RewardStatus (Pending/
 * Claimed/Confirmed)" การ reset ต้องเกิด "หลังจากผู้เล่นกด OK ที่หน้า
 * pages/reward-received.vue สำเร็จเท่านั้น" หน้านี้จึงเหลือหน้าที่แค่:
 *   1) เช็ค API (getRewardStatus) ทันที 1 ครั้ง แล้ว Poll ซ้ำทุก 10 วินาที
 *      (เทียบ round.rewardStatus ของ RoundId ปัจจุบันเท่านั้น — ไม่ใช้ UserId
 *      ตัดสินเด็ดขาด เพราะ User คนเดียวมีหลาย Round ได้)
 *   2) เจอ 'Claimed' (หรือ 'Confirmed' เผื่อกรณี Refresh มาเจอทีหลัง) -> หยุด
 *      Poll แล้ว navigateTo('/reward-received') ทันที (อัตโนมัติ ไม่ต้องกดปุ่ม)
 * ระบบรางวัลนี้ผูกกับ RoundId ฝั่ง Online เท่านั้น (Offline Mode ไม่มี Round ฝั่ง
 * Backend ให้ Poll ตั้งแต่ต้น — ดู server-gas/RewardService.gs หัวไฟล์) จึงยังคง
 * ปุ่ม "ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก" เดิมไว้ "เฉพาะฝั่ง Offline" เท่านั้น
 * (ไม่กระทบ Flow เดิมของ Offline Mode ที่ไม่เกี่ยวกับรางวัลเลย)
 * ยังคงมีแบนเนอร์เตือนค้างไว้ด้านบนเสมอ + ดักการออกจากหน้า (ปุ่ม Back/ปิดแท็บ)
 * ด้วย onBeforeRouteLeave + beforeunload เหมือนเดิมทุกประการ (ยกเว้นตอน redirect
 * ไป /reward-received เอง ซึ่งตั้ง confirmedLeave ก่อนเสมอ กันไม่ให้ Guard เด้ง
 * ถามซ้ำตอนที่ระบบพาไปเอง ไม่ใช่ผู้เล่นกดออกเอง)
 *
 * ไม่ใช้ useRequireProfile() (Guard ปกติของทุกหน้า) เพราะ Guard นั้นเรียก
 * ensureRoundStarted() ทุกครั้งที่หน้า mount ซึ่งจะไปเริ่ม "รอบใหม่" ทันทีที่เข้า
 * หน้านี้ ขัดกับเจตนาที่อยากให้เห็นสรุปของรอบที่เพิ่ง "จบ" ไปแล้วเท่านั้น (รอบใหม่
 * ควรเริ่มก็ต่อเมื่อกลับไปหน้า Home/Map/Scan อีกครั้ง) — เช็คแค่ว่ามีโปรไฟล์อยู่
 * แล้วหรือไม่ (เด้งกลับ "/" ถ้าไม่มี) เหมือน Guard เดิม ตัดแค่ ensureRoundStarted()
 * ออกไปเท่านั้น ไม่แตะ Logic Round/Journey/Score อื่นใดเลย
 *
 * Refresh หน้านี้กลางคัน: loadRoundSummary() อ่าน RoundId เดิมจาก LocalStorage
 * เสมอ (ไม่สร้าง Round ใหม่) แล้วเริ่ม Poll ใหม่จาก RoundId เดิมนั้นต่อทันที
 */

definePageMeta({ layout: false });

const { profile, initProfile, hasProfile } = useProfile();
const { roundSummary, loadRoundSummary, clearRoundSummary } = useRoundSummary();
// [เดิม — คงไว้เฉพาะสำหรับปุ่ม "กลับสู่หน้าหลัก" ของ empty-state (ไม่พบข้อมูลสรุปผล
// เลย) ด้านล่างเท่านั้น] ไม่ถูกเรียกจาก Flow หลักอีกต่อไป (ดู confirmAndGoHome())
const { resetJourney } = useAdventure();
const { resetAnswered } = useQuestion();
const { isOfflineMode, startRound } = useOfflineMode();
// [ใหม่] ระบบแลกของรางวัล — เช็คสถานะ (getRewardStatus) ทันที 1 ครั้ง + Poll ทุก
// 10 วินาที (ดู pollRewardStatus() ด้านล่าง) ไม่มีปุ่มยืนยันรับในหน้านี้ (เจ้าหน้าที่
// กดที่หน้า pages/redeem.vue, ผู้เล่นกด OK ที่หน้า pages/reward-received.vue)
const {
  status: rewardStatus,
  isChecking: isCheckingReward,
  checkRewardStatus,
} = useReward();
const { clearAllTimers } = useRoundTimer();
// [ใหม่] คะแนนแยกรายฐานของรอบนี้ "จาก Backend เท่านั้น" (getRoundScores) — ห้ามใช้
// roundSummary.stations/totalPoint (Snapshot ฝั่ง Client เดิม) เป็นคะแนนของรอบอีก
// ต่อไปตามสเปก ใช้แสดงเฉพาะฝั่ง Online เท่านั้น (ดู loadScores() ด้านล่าง) — ฝั่ง
// Offline ยังคงแสดงชื่อฐานจาก Snapshot เดิมต่อไป (ไม่มีคะแนนอยู่แล้วตามกติกาเดิม)
const {
  stations: roundScoreStations,
  totalPoint: backendTotalPoint,
  totalQuestionPoint: backendTotalQuestionPoint,
  totalScore: backendTotalScore,
  isLoading: isLoadingScores,
  error: scoresError,
  loaded: scoresLoaded,
  fetchRoundScores,
  resetRoundScores,
} = useRoundScores();

const isReady = ref(false);

/** ข้อความหัวเรื่อง — ปรับให้ตรงสาเหตุจริงที่จบรอบ (ตามที่ scan.vue บันทึกไว้ผ่าน
 * endedReason ดู composables/useForceEndRound.ts) ไม่ใช่ "จบการเล่น" เสมอไป */
const resultTitle = computed(() => {
  const reason = roundSummary.value?.endedReason;
  if (reason === "round-timeout") return "หมดเวลารอบเล่น";
  if (reason === "station-timeout") return "หมดเวลาทำภารกิจ";
  return "จบการเล่น";
});
/** true เมื่อระบบพาออกจากหน้านี้เอง (Poll เจอ Claimed แล้ว redirect ไป
 * /reward-received) หรือกดปุ่มของ empty-state — จุดเดียวที่อนุญาตให้ออกจากหน้า
 * นี้ได้โดยไม่มีคำเตือนซ้ำ (ผู้เล่นเองไม่มีปุ่มกดออกด้วยตัวเองแล้วในกรณีปกติ) */
const confirmedLeave = ref(false);

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** ปุ่ม "กลับสู่หน้าหลัก" ของ empty-state เท่านั้น (ไม่พบข้อมูลสรุปผลของรอบนี้
 * เลย — ไม่มี Round ให้ Poll/รอรางวัลอะไรอยู่แล้ว) ไม่ได้ใช้จาก Flow หลักอีก
 * ต่อไป (ดู pollRewardStatus() ด้านล่าง ที่เป็นคนพาไป /reward-received แทน) */
async function confirmAndGoHome(): Promise<void> {
  confirmedLeave.value = true;
  resetJourney();
  resetAnswered();
  clearAllTimers();
  resetRoundScores();
  if (isOfflineMode.value && profile.value?.uid) {
    startRound(profile.value.uid);
  }
  clearRoundSummary();

  await navigateTo("/home");
}

/** [ใหม่] โหลด/ลองโหลดใหม่ (ปุ่ม "ลองอีกครั้ง") คะแนนแยกรายฐานของรอบนี้จาก
 * Backend — เฉพาะฝั่ง Online เท่านั้น (ต้องมี roundId จริง) */
function loadScores(): void {
  if (isOfflineMode.value) return;
  void fetchRoundScores(
    roundSummary.value?.roundId,
    roundSummary.value?.userId,
  );
}

/** ดักปุ่ม Back ของเบราว์เซอร์/มือถือ (กลับไปหน้า Scan เดิม) — เตือนก่อนออกเสมอ
 * ยกเว้นระบบพาออกไปเอง (Poll เจอ Claimed) หรือ empty-state เท่านั้น */
onBeforeRouteLeave(() => {
  if (confirmedLeave.value || !import.meta.client) return true;
  return window.confirm(
    "ยังไม่เสร็จสิ้นขั้นตอนรับรางวัล — ต้องการออกจากหน้านี้เลยหรือไม่?",
  );
});

/** ดักปิดแท็บ/รีเฟรชหน้า — เบราว์เซอร์ส่วนใหญ่จะโชว์กล่องเตือนมาตรฐานของตัวเอง
 * (ข้อความกำหนดเองไม่ได้ตามสเปกเบราว์เซอร์ แต่ยังกันการปิดโดยไม่ตั้งใจได้) */
function handleBeforeUnload(event: BeforeUnloadEvent): void {
  if (confirmedLeave.value) return;
  event.preventDefault();
  event.returnValue = "";
}

/**
 * [ใหม่] Poll สถานะรางวัลของ RoundId ปัจจุบันทุก 10 วินาที — เช็คทันที 1 ครั้ง
 * ก่อนเสมอ (ตอน onMounted) แล้วค่อยเริ่ม setInterval ต่อ เจอ round.rewardStatus
 * เป็น 'Claimed' (เจ้าหน้าที่ยืนยันมอบรางวัลแล้ว) หรือ 'Confirmed' (เผื่อ Refresh
 * มาเจอทีหลัง) -> หยุด Poll ทันทีแล้วพาไปหน้า /reward-received โดยอัตโนมัติ
 * (ไม่ต้องกดปุ่มใด ๆ) 'Pending' -> อยู่หน้าเดิมต่อไป
 *
 * pollTimer/pollInFlight เป็นตัวแปรระดับ component (ไม่ใช่ module-level) กัน
 * สร้าง Interval ซ้อนหลายตัวข้ามการ mount ของหน้านี้คนละครั้ง + pollInFlight กัน
 * เรียกซ้อนกันเองถ้า Network ตอบช้ากว่า 10 วินาที (ไม่น่าเกิดขึ้นแต่กันไว้)
 */
let pollTimer: ReturnType<typeof setInterval> | null = null;
let pollInFlight = false;
const POLL_INTERVAL_MS = 10_000;

function stopPolling(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function pollRewardStatus(): Promise<void> {
  if (pollInFlight) return;
  const roundId = roundSummary.value?.roundId;
  const userId = roundSummary.value?.userId;
  if (!roundId || !userId) return;

  // [ใหม่ — ชั่วคราว/Demo] ส่งคะแนนที่ค้างอยู่ใน LocalStorage (สแนปช็อตตอนจบรอบ —
  // roundSummary.totalPoint = คะแนนฐาน, roundSummary.questionPoints = คะแนน
  // คำถามตอบถูก) ไปให้ server "เชื่อตรง ๆ" แทนการรอ Journey/Answers sync ครบ —
  // ดูคำเตือนเรื่องความปลอดภัยที่ server-gas/RewardService.gs หัวไฟล์ (เหมาะกับ
  // ช่วง Demo/ทดสอบเท่านั้น) ลบท่อนนี้ทิ้งได้เมื่อพร้อมกลับไปเชื่อ server ล้วน ๆ
  const localScore =
    (roundSummary.value?.totalPoint ?? 0) +
    (roundSummary.value?.questionPoints ?? 0);

  pollInFlight = true;
  try {
    const result = await checkRewardStatus(roundId, userId, localScore);
    const status = result?.round?.rewardStatus;
    if (status === "Claimed" || status === "Confirmed") {
      stopPolling();
      confirmedLeave.value = true;
      await navigateTo("/reward-received");
    }
  } finally {
    pollInFlight = false;
  }
}

onMounted(() => {
  // [Fix] ครอบ try/catch — กันหน้านี้ค้างที่ Loading Spinner ตลอดไปถ้า
  // initProfile()/loadRoundSummary() (อ่าน LocalStorage) throw โดยไม่คาดคิด
  // (ดูเหตุผลเดียวกับที่แก้ pages/scan.vue + composables/useRoundSummary.ts)
  try {
    initProfile();
    if (!hasProfile.value) {
      // [Fix] ตั้ง confirmedLeave ก่อนเสมอ ไม่งั้น onBeforeRouteLeave guard ด้านล่าง
      // จะดัก navigateTo() อัตโนมัตินี้ไว้ด้วย (โชว์ confirm() ถามซ้ำโดยไม่จำเป็น
      // ทั้งที่เป็นแค่ Guard เด้งกลับเพราะไม่มีโปรไฟล์ ไม่ใช่ผู้เล่นกดออกเอง)
      confirmedLeave.value = true;
      void navigateTo("/");
      return;
    }
    loadRoundSummary();
  } catch (err) {
    console.error("[round-summary] failed to load profile/summary", err);
  }
  isReady.value = true;
  window.addEventListener("beforeunload", handleBeforeUnload);

  // [ใหม่] ตรวจสอบสิทธิ์รางวัลของรอบนี้ทันที 1 ครั้ง แล้ว Poll ซ้ำทุก 10 วินาที
  // ต่อ — ต้องมี roundId จริง (Online เท่านั้น — Offline Mode ไม่มี Round ฝั่ง
  // Backend ให้ตรวจสอบ ดูเหตุผลเต็ม ๆ ที่ server-gas/RewardService.gs)
  if (roundSummary.value?.roundId && roundSummary.value?.userId) {
    void pollRewardStatus();
    pollTimer = setInterval(() => {
      void pollRewardStatus();
    }, POLL_INTERVAL_MS);
  }

  // [ใหม่] โหลดคะแนนแยกรายฐานจาก Backend ครั้งเดียว (ไม่ผูกกับ Poll ทุก 10 วินาที
  // ด้านบน — คนละเรื่องกับสถานะรางวัล) เฉพาะฝั่ง Online เท่านั้น (ดู loadScores())
  loadScores();
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  stopPolling();
});
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame">
      <div v-if="!isReady" class="loading">
        <UIcon name="i-lucide-loader-2" class="loading__spinner" />
      </div>

      <div v-else class="summary">
        <div class="summary__scroll">
          <div class="warning-banner">
            <UIcon
              name="i-lucide-triangle-alert"
              class="warning-banner__icon"
            />
            <p class="warning-banner__text">
              กรุณาอย่าออกจากหน้านี้
              จนกว่าท่านจะติดต่อเจ้าหน้าที่เพื่อยืนยันผลการเล่น
            </p>
          </div>

          <div class="result-hero">
            <UIcon name="i-lucide-party-popper" class="result-hero__icon" />
            <h1 class="result-hero__title">{{ resultTitle }}</h1>
            <p class="result-hero__prize">
              กรุณาติดต่อเจ้าหน้าที่เพื่อรับรางวัล
            </p>
            <p v-if="profile" class="result-hero__subtitle">
              {{ profile.firstName }} {{ profile.lastName }}
            </p>
          </div>

          <!-- [ใหม่] ข้อมูลอ้างอิงของรอบนี้ — ไว้ให้เจ้าหน้าที่อ่านไปกรอกที่หน้า
               จุดแลกรางวัล (pages/redeem.vue) ตามสเปก "Login: ใคร, รหัสรอบ,
               รหัสลูกค้า" -->
          <div v-if="roundSummary" class="info-card">
            <div class="info-card__row">
              <UIcon name="i-lucide-badge-check" class="info-card__icon" />
              <div class="info-card__text">
                <p class="info-card__label">รหัสรอบ (roundId)</p>
                <p class="info-card__value">
                  {{ roundSummary.roundId ?? "-" }}
                </p>
              </div>
            </div>
            <div class="info-card__row">
              <UIcon name="i-lucide-user-round" class="info-card__icon" />
              <div class="info-card__text">
                <p class="info-card__label">รหัสลูกค้า (userId)</p>
                <p class="info-card__value">{{ roundSummary.userId ?? "-" }}</p>
              </div>
            </div>
          </div>

          <div v-if="!roundSummary" class="empty-state">
            <p class="empty-state__desc">ไม่พบข้อมูลสรุปผลของรอบนี้</p>
            <UButton block color="primary" @click="confirmAndGoHome"
              >กลับสู่หน้าหลัก</UButton
            >
          </div>

          <template v-else>
            <div class="info-card">
              <div class="info-card__row">
                <UIcon name="i-lucide-play" class="info-card__icon" />
                <div class="info-card__text">
                  <p class="info-card__label">เวลาที่เริ่มเล่น</p>
                  <p class="info-card__value">
                    {{ formatDateTime(roundSummary.startTime) }}
                  </p>
                </div>
              </div>
              <div class="info-card__row">
                <UIcon name="i-lucide-flag" class="info-card__icon" />
                <div class="info-card__text">
                  <p class="info-card__label">เวลาที่จบเกม</p>
                  <p class="info-card__value">
                    {{ formatDateTime(roundSummary.endTime) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- [ใหม่] Offline: แสดงชื่อฐานจาก Snapshot เดิมเหมือนเดิมทุกประการ (ไม่มี
                 คะแนน — Offline Mode ไม่มี Round ฝั่ง Backend ให้ดึงคะแนนเลย) -->
            <div v-if="roundSummary.mode === 'offline'" class="info-card">
              <!-- <p class="info-card__list-title">ฐานที่ท่านเล่น</p>
              <ul v-if="roundSummary.stations.length" class="station-list">
                <li
                  v-for="(station, index) in roundSummary.stations"
                  :key="`${station.name}-${index}`"
                  class="station-list__item"
                >
                  <span class="station-list__index">{{ index + 1 }}</span>
                  <span class="station-list__name">{{ station.name }}</span>
                </li>
              </ul>
              <p v-else class="empty-state__desc">
                ยังไม่ได้เข้าฐานใดเลยในรอบนี้
              </p> -->
            </div>

            <!-- [ใหม่] Online: คะแนนต้อง "มาจาก Backend เท่านั้น" (getRoundScores)
                 ห้ามใช้ Snapshot ฝั่ง Client คำนวณเอง — loading/error/retry ครบ -->
            <template v-else>
              <div
                v-if="isLoadingScores"
                class="reward-card reward-card--loading"
              >
                <UIcon name="i-lucide-clock" class="reward-card__spinner-static" />
                รอเจ้าหน้าที่ตรวจสอบคะแนน
              </div>
              <div v-else-if="scoresError" class="empty-state">
                <p class="empty-state__desc">{{ scoresError }}</p>
                <UButton
                  block
                  color="primary"
                  variant="soft"
                  @click="loadScores"
                  >ลองอีกครั้ง</UButton
                >
              </div>
              <template v-else-if="scoresLoaded">
                <div class="info-card">
                  <p class="info-card__list-title">ฐานที่ท่านเล่น</p>
                  <ul v-if="roundScoreStations.length" class="station-list">
                    <li
                      v-for="(station, index) in roundScoreStations"
                      :key="station.stationId"
                      class="station-list__item"
                    >
                      <span class="station-list__index">{{ index + 1 }}</span>
                      <span class="station-list__name">{{
                        station.stationName
                      }}</span>
                      <span class="station-list__points"
                        >+{{ station.point + station.questionPoint }}</span
                      >
                    </li>
                  </ul>
                  <p v-else class="empty-state__desc">
                    ยังไม่ได้เข้าฐานใดเลยในรอบนี้
                  </p>
                </div>

                <div class="total-card">
                  <p class="total-card__label">คะแนนรวมของรอบนี้</p>
                  <p class="total-card__value">
                    <span class="total-card__value-num">{{
                      backendTotalScore
                    }}</span>
                    <span class="total-card__unit">Point</span>
                  </p>
                  <!-- [ใหม่] แยกให้เห็นว่าคะแนนมาจาก 2 ทาง — สแกนฐาน + ตอบคำถามถูก
                       (ตามกติกาที่ตกลงกันไว้ "ได้ทั้งสแกนและตอบถูก") -->
                  <p
                    v-if="backendTotalQuestionPoint"
                    class="total-card__breakdown"
                  >
                    (ฐาน {{ backendTotalPoint }} + ตอบคำถามถูก +{{
                      backendTotalQuestionPoint
                    }})
                  </p>
                </div>
              </template>
            </template>

            <!-- [ใหม่] สถานะสิทธิ์รางวัล — แสดงอย่างเดียว ไม่มีปุ่มยืนยันในหน้านี้
                 (เจ้าหน้าที่กดยืนยันที่หน้า /redeem เท่านั้น ตามที่ตกลงกันไว้) -->
            <div
              v-if="isCheckingReward"
              class="reward-card reward-card--loading"
            >
              <UIcon name="i-lucide-loader-2" class="reward-card__spinner" />
              กำลังตรวจสอบสิทธิ์รางวัล...
            </div>
            <div v-else-if="rewardStatus?.reward" class="reward-card">
              <UIcon name="i-lucide-gift" class="reward-card__icon" />
              <p class="reward-card__label">รางวัลของคุณ</p>
              <p class="reward-card__name">{{ rewardStatus.reward.name }}</p>
              <p
                v-if="rewardStatus.alreadyClaimed"
                class="reward-card__status reward-card__status--done"
              >
                <UIcon name="i-lucide-check-circle-2" />
                รับแล้ว {{ formatDateTime(rewardStatus.claimedAt) }}
              </p>
              <p v-else class="reward-card__status">
                กรุณาแจ้งเจ้าหน้าที่ที่จุดแลกรางวัลเพื่อรับของรางวัล
              </p>
            </div>

            <!-- [ใหม่] ระบบรางวัล (Pending/Claimed/Confirmed) ผูกกับ RoundId ฝั่ง
                 Online เท่านั้น (Offline Mode ไม่มี Round ฝั่ง Backend ให้ Poll
                 เลยตั้งแต่ต้น — ดู server-gas/RewardService.gs หัวไฟล์) จึงคง
                 ปุ่มเดิมไว้ "เฉพาะฝั่ง Offline" เท่านั้น (ไม่กระทบ Flow เดิมของ
                 Offline Mode ที่ไม่เกี่ยวกับรางวัลเลย) ฝั่ง Online แทนที่ด้วย
                 Indicator รอ Poll (round.rewardStatus เจอ Claimed จะพาไปหน้า
                 /reward-received ให้อัตโนมัติทันที ไม่ต้องกดอะไรที่นี่แล้ว) -->
            <UButton
              v-if="isOfflineMode"
              block
              size="xl"
              color="primary"
              icon="i-lucide-check-circle-2"
              @click="confirmAndGoHome"
            >
              ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก
            </UButton>
            <div v-else class="waiting-indicator">
              <UIcon
                name="i-lucide-loader-2"
                class="waiting-indicator__spinner"
              />
              <p class="waiting-indicator__text">
                กำลังรอเจ้าหน้าที่ยืนยันการรับรางวัล...
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-shell {
  min-height: 100dvh;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    var(--farm-sky-top) 0%,
    var(--farm-sky-bottom) 40%,
    var(--farm-cream) 75%
  );
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading__spinner {
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

.summary {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.summary__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem 1.1rem 2rem;
}

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.85rem;
  background: #fdecea;
  border: 2px solid #d97a5f;
}

.warning-banner__icon {
  width: 1.3rem;
  height: 1.3rem;
  color: #a8442b;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.warning-banner__text {
  font-size: 0.78rem;
  font-weight: 700;
  color: #a8442b;
  margin: 0;
  line-height: 1.4;
}

.result-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.15rem;
  padding: 0.5rem 0 0.25rem;
}

.result-hero__icon {
  width: 2.75rem;
  height: 2.75rem;
  color: var(--farm-accent-dark);
}

.result-hero__title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0.15rem 0 0;
}

.result-hero__prize {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
  margin: 0.15rem 0 0;
}

.result-hero__subtitle {
  font-size: 0.85rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  text-align: center;
}

.empty-state__desc {
  font-size: 0.82rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.info-card__row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.info-card__icon {
  width: 1.35rem;
  height: 1.35rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.info-card__text {
  min-width: 0;
}

.info-card__label {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.info-card__value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.1rem 0 0;
}

.info-card__list-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.station-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
}

.station-list__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid var(--farm-wood);
}

.station-list__index {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  background: var(--farm-accent-dark);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.station-list__name {
  flex: 1;
  min-width: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--farm-text-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.station-list__points {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.total-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.2rem;
  padding: 1rem;
  border-radius: 1rem;
  background: linear-gradient(
    160deg,
    var(--farm-cream) 0%,
    var(--farm-cream-dark) 100%
  );
  border: 2px solid var(--farm-accent-dark);
}

.total-card__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--farm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.total-card__value {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  margin: 0.15rem 0 0;
}

.total-card__value-num {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.total-card__unit {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--farm-text-muted);
}

.total-card__breakdown {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  color: var(--farm-text-muted);
}

/* --------------------------- Reward Card (ใหม่) --------------------------- */

.reward-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: 1rem;
  background: linear-gradient(160deg, #fff8e6 0%, #ffe9b3 100%);
  border: 2px solid var(--farm-accent-dark);
}

.reward-card--loading {
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  color: var(--farm-text-muted);
  font-size: 0.82rem;
  background: var(--farm-cream);
  border-color: var(--farm-wood);
}

.reward-card__spinner {
  width: 1.1rem;
  height: 1.1rem;
  animation: spin 1s linear infinite;
}

.reward-card__spinner-static {
  width: 1.1rem;
  height: 1.1rem;
}

.reward-card__icon {
  width: 2rem;
  height: 2rem;
  color: var(--farm-accent-dark);
}

.reward-card__label {
  margin: 0;
  font-size: 0.72rem;
  color: var(--farm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.reward-card__name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.reward-card__status {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: var(--farm-wood-dark);
  font-weight: 600;
}

.reward-card__status--done {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--farm-accent-dark);
}

/* --------------------------- Waiting Indicator (ใหม่) --------------------------- */

.waiting-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.waiting-indicator__spinner {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
  color: var(--farm-accent-dark);
  animation: spin 1s linear infinite;
}

.waiting-indicator__text {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--farm-text-dark);
}
</style>
