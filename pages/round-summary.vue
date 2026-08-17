<script setup lang="ts">
/**
 * pages/round-summary.vue
 * ---------------------------------------------------------------------------
 * หน้าสรุปผล "หลังจบเกม" — เข้ามาจาก pages/scan.vue เท่านั้น (ทั้ง 2 ทาง):
 *   1) ฝั่ง Online: กด "จบเกม" ที่ Popup ฐานนม -> endGameAfterFinalStation()
 *   2) ฝั่ง Offline: สแกนครบทั้ง 4 ฐาน -> completeStationVisit() (branch Offline Mode)
 * ทั้ง 2 จุด ปิดกล้อง (stopCamera) + resetJourney() (รีเซ็ตฐาน/คะแนนกลับเป็น 0
 * ทันที) ก่อน navigateTo หน้านี้เรียบร้อยแล้ว — หน้านี้มีหน้าที่แค่ "แสดงสำเนา
 * สรุปผล" ที่ถูกเก็บไว้ก่อนรีเซ็ต (ดู composables/useRoundSummary.ts) เท่านั้น
 *
 * ตั้งใจ "ไม่ใช้ Layout 'app'" (ไม่มี BottomNav ติดจอ) เพื่อไม่ให้ผู้เล่นกดเปลี่ยน
 * หน้าเล่นต่อโดยไม่ตั้งใจก่อนติดต่อเจ้าหน้าที่ ตามที่ขอ — มีแบนเนอร์เตือนค้างไว้
 * ด้านบนเสมอ + ดักการออกจากหน้า (ปุ่ม Back/ปิดแท็บ) ด้วย onBeforeRouteLeave +
 * beforeunload ให้เตือนซ้ำอีกชั้น ทางออกปกติมีทางเดียวคือกดปุ่ม "ติดต่อเจ้าหน้าที่
 * แล้ว" ด้านล่างเท่านั้น
 *
 * ไม่ใช้ useRequireProfile() (Guard ปกติของทุกหน้า) เพราะ Guard นั้นเรียก
 * ensureRoundStarted() ทุกครั้งที่หน้า mount ซึ่งจะไปเริ่ม "รอบใหม่" ทันทีที่เข้า
 * หน้านี้ ขัดกับเจตนาที่อยากให้เห็นสรุปของรอบที่เพิ่ง "จบ" ไปแล้วเท่านั้น (รอบใหม่
 * ควรเริ่มก็ต่อเมื่อกลับไปหน้า Home/Map/Scan อีกครั้ง) — เช็คแค่ว่ามีโปรไฟล์อยู่
 * แล้วหรือไม่ (เด้งกลับ "/" ถ้าไม่มี) เหมือน Guard เดิม ตัดแค่ ensureRoundStarted()
 * ออกไปเท่านั้น ไม่แตะ Logic Round/Journey/Score อื่นใดเลย
 */

definePageMeta({ layout: false });

const { profile, initProfile, hasProfile } = useProfile();
const { roundSummary, loadRoundSummary, clearRoundSummary } = useRoundSummary();
// [Fix] ล้าง Current Round Frontend ทั้งหมด (visitedIds/roundId/score/progress/
// station ticks — ดู composables/useAdventure.ts::resetJourney()) "ที่นี่เท่านั้น"
// ตอนกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว" — ย้ายมาจาก pages/scan.vue ตามสเปก "หลังจบเกม
// ห้ามล้างข้อมูลก่อนหน้า /round-summary" หน้านี้เองอ่านจาก roundSummary:last
// (สแนปช็อต) เท่านั้นอยู่แล้ว ไม่กระทบการแสดงผลของหน้านี้แม้แต่น้อย
const { resetJourney } = useAdventure();
// [ใหม่] ล้างสถานะ "ตอบคำถามไปแล้วบ้าง" ของระบบภารกิจ+คำถาม (ระบบขนาน — ดู
// composables/useQuestion.ts) คู่กับ resetJourney() เดิมเสมอ ที่จุดเดียวกันนี้
// เพื่อไม่ให้คำตอบของรอบที่จบไปแล้วค้างข้ามมารอบใหม่ ไม่แตะ useAdventure.ts เลย
const { resetAnswered } = useQuestion();
// [Fix] รอบ Offline Mode ก็ต้องเริ่ม Round Data ใหม่ (composables/useOfflineMode.ts)
// ตรงจุดเดียวกันนี้เช่นกัน (เดิม startRound() ถูกเรียกทันทีหลังจบเกมที่ scan.vue —
// ย้ายมาไว้ที่นี่ให้สอดคล้องกับจุด reset เดียวของทั้งแอป)
const { isOfflineMode, startRound } = useOfflineMode();
// [ใหม่] ระบบแลกของรางวัล — ดูสถานะอย่างเดียว (ไม่มีปุ่มยืนยันรับในหน้านี้ ตามที่
// ตกลงกันไว้ว่าเจ้าหน้าที่เป็นคนกดที่หน้า pages/redeem.vue เท่านั้น)
const { status: rewardStatus, isChecking: isCheckingReward, checkRewardStatus } = useReward();
// [ใหม่] เคลียร์ Timer รอบ/เผ่า (composables/useRoundTimer.ts) คู่กับ resetJourney()
// เสมอ ที่จุดเดียวกันนี้ — ตามสเปก "จบเกมแล้วต้องกลับไปเจอหน้า GO อีกครั้ง" (ดู
// pages/home.vue::go-gate ที่โชว์ตาม hasActiveRoundTimer) เดิมไม่มีจุดไหนเรียก
// clearAllTimers() เลยสักที่ ทำให้ roundEndsAt ค้างอยู่ใน LocalStorage ข้ามรอบ
// กลับไปหน้า Home แล้วเห็นเนื้อหาปกติ (Summary Card ฯลฯ) ทันทีแทนที่จะเจอปุ่ม GO
const { clearAllTimers } = useRoundTimer();

const isReady = ref(false);

/** คะแนนรวม "ของรอบนี้" ที่แสดงผลจริง — รวมแต้มฐาน (totalPoint) + แต้มคำถามถูก
 * (questionPoints ระบบใหม่ คนละก้อนกับ totalPoint) เข้าด้วยกัน null เฉพาะกรณี
 * Offline Mode (ตามกติกาเดิม "ห้ามแสดงคะแนน" เท่านั้น) */
const combinedTotalPoint = computed(() => {
  if (!roundSummary.value || roundSummary.value.totalPoint === null) return null;
  return roundSummary.value.totalPoint + (roundSummary.value.questionPoints ?? 0);
});

/** ข้อความหัวเรื่อง — ปรับให้ตรงสาเหตุจริงที่จบรอบ (ตามที่ scan.vue บันทึกไว้ผ่าน
 * endedReason ดู composables/useForceEndRound.ts) ไม่ใช่ "จบการเล่น" เสมอไป */
const resultTitle = computed(() => {
  const reason = roundSummary.value?.endedReason;
  if (reason === "round-timeout") return "หมดเวลารอบเล่น";
  if (reason === "station-timeout") return "หมดเวลาทำภารกิจ";
  return "จบการเล่น";
});
/** true เฉพาะตอนกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว" เท่านั้น — จุดเดียวที่อนุญาตให้
 * ออกจากหน้านี้ได้โดยไม่มีคำเตือนซ้ำ */
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

/** ปุ่ม "ติดต่อเจ้าหน้าที่แล้ว" — ล้างสแนปช็อตทิ้ง (ใช้ครั้งเดียวจบต่อ 1 รอบ)
 * แล้วพากลับหน้า Home ตามปกติ (Home/Map/Scan จะเริ่มรอบใหม่ให้อัตโนมัติเองผ่าน
 * ensureRoundStarted() เดิมตอนเข้าไปครั้งถัดไป) */
async function confirmAndGoHome(): Promise<void> {
  confirmedLeave.value = true;

  // [Fix] ล้าง Current Round Frontend ทั้งหมดที่นี่ "จุดเดียว" ก่อนกลับ Home เสมอ
  // (adventureVisitedStations/roundId ผ่าน resetJourney() ซึ่งครอบคะแนน/progress/
  // station ticks ให้อัตโนมัติเพราะทุกอย่างคำนวณจาก visitedIds เดียวกัน) — ไม่ใช้
  // localStorage.clear() เด็ดขาด (จะล้าง Login/Profile ไปด้วย) แตะเฉพาะ key ของ
  // Current Round เท่านั้น
  resetJourney();
  resetAnswered();
  clearAllTimers();
  if (isOfflineMode.value && profile.value?.uid) {
    startRound(profile.value.uid);
  }
  clearRoundSummary();

  await navigateTo("/home");
}

/** ดักปุ่ม Back ของเบราว์เซอร์/มือถือ (กลับไปหน้า Scan เดิม) — เตือนก่อนออกเสมอ
 * ยกเว้นออกผ่านปุ่ม "ติดต่อเจ้าหน้าที่แล้ว" ด้านบนเท่านั้น */
onBeforeRouteLeave(() => {
  if (confirmedLeave.value || !import.meta.client) return true;
  return window.confirm(
    "คุณยังไม่ได้ติดต่อเจ้าหน้าที่ — ต้องการออกจากหน้านี้เลยหรือไม่?",
  );
});

/** ดักปิดแท็บ/รีเฟรชหน้า — เบราว์เซอร์ส่วนใหญ่จะโชว์กล่องเตือนมาตรฐานของตัวเอง
 * (ข้อความกำหนดเองไม่ได้ตามสเปกเบราว์เซอร์ แต่ยังกันการปิดโดยไม่ตั้งใจได้) */
function handleBeforeUnload(event: BeforeUnloadEvent): void {
  if (confirmedLeave.value) return;
  event.preventDefault();
  event.returnValue = "";
}

onMounted(() => {
  // [Fix] ครอบ try/catch — กันหน้านี้ค้างที่ Loading Spinner ตลอดไปถ้า
  // initProfile()/loadRoundSummary() (อ่าน LocalStorage) throw โดยไม่คาดคิด
  // (ดูเหตุผลเดียวกับที่แก้ pages/scan.vue + composables/useRoundSummary.ts)
  try {
    initProfile();
    if (!hasProfile.value) {
      void navigateTo("/");
      return;
    }
    loadRoundSummary();
  } catch (err) {
    console.error("[round-summary] failed to load profile/summary", err);
  }
  isReady.value = true;
  window.addEventListener("beforeunload", handleBeforeUnload);

  // [ใหม่] ตรวจสอบสิทธิ์รางวัลของรอบนี้ (อ่านอย่างเดียว ไม่บล็อกหน้าถ้าล้มเหลว) —
  // ต้องมี roundId จริง (Online เท่านั้น — Offline Mode ไม่มี Round ฝั่ง Backend
  // ให้ตรวจสอบ ดูเหตุผลเต็ม ๆ ที่ server-gas/RewardService.gs)
  if (roundSummary.value?.roundId && roundSummary.value?.userId) {
    void checkRewardStatus(roundSummary.value.roundId, roundSummary.value.userId);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
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
              กรุณาอย่าออกจากหน้านี้ จนกว่าท่านจะติดต่อเจ้าหน้าที่เพื่อยืนยันผลการเล่น
            </p>
          </div>

          <div class="result-hero">
            <UIcon
              name="i-lucide-party-popper"
              class="result-hero__icon"
            />
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
                <p class="info-card__value">{{ roundSummary.roundId ?? "-" }}</p>
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

            <div class="info-card">
              <p class="info-card__list-title">ฐานที่ท่านเล่น</p>
              <ul v-if="roundSummary.stations.length" class="station-list">
                <li
                  v-for="(station, index) in roundSummary.stations"
                  :key="`${station.name}-${index}`"
                  class="station-list__item"
                >
                  <span class="station-list__index">{{ index + 1 }}</span>
                  <span class="station-list__name">{{ station.name }}</span>
                  <span
                    v-if="roundSummary.totalPoint !== null"
                    class="station-list__points"
                    >+{{ station.points }}</span
                  >
                </li>
              </ul>
              <p v-else class="empty-state__desc">
                ยังไม่ได้เข้าฐานใดเลยในรอบนี้
              </p>
            </div>

            <div v-if="combinedTotalPoint !== null" class="total-card">
              <p class="total-card__label">คะแนนรวมของรอบนี้</p>
              <p class="total-card__value">
                <span class="total-card__value-num">{{ combinedTotalPoint }}</span>
                <span class="total-card__unit">Point</span>
              </p>
              <!-- [ใหม่] แยกให้เห็นว่าคะแนนมาจาก 2 ทาง — สแกนฐาน + ตอบคำถามถูก
                   (ตามกติกาที่ตกลงกันไว้ "ได้ทั้งสแกนและตอบถูก") -->
              <p
                v-if="roundSummary.questionPoints"
                class="total-card__breakdown"
              >
                (ฐาน {{ roundSummary.totalPoint }} + ตอบคำถามถูก
                {{ roundSummary.questionCorrectCount ?? 0 }} ข้อ +{{ roundSummary.questionPoints }})
              </p>
            </div>

            <!-- [ใหม่] สถานะสิทธิ์รางวัล — แสดงอย่างเดียว ไม่มีปุ่มยืนยันในหน้านี้
                 (เจ้าหน้าที่กดยืนยันที่หน้า /redeem เท่านั้น ตามที่ตกลงกันไว้) -->
            <div v-if="isCheckingReward" class="reward-card reward-card--loading">
              <UIcon name="i-lucide-loader-2" class="reward-card__spinner" />
              กำลังตรวจสอบสิทธิ์รางวัล...
            </div>
            <div v-else-if="rewardStatus?.reward" class="reward-card">
              <UIcon name="i-lucide-gift" class="reward-card__icon" />
              <p class="reward-card__label">รางวัลของคุณ</p>
              <p class="reward-card__name">{{ rewardStatus.reward.name }}</p>
              <p v-if="rewardStatus.alreadyClaimed" class="reward-card__status reward-card__status--done">
                <UIcon name="i-lucide-check-circle-2" />
                รับแล้ว {{ formatDateTime(rewardStatus.claimedAt) }}
              </p>
              <p v-else class="reward-card__status">
                กรุณาแจ้งเจ้าหน้าที่ที่จุดแลกรางวัลเพื่อรับของรางวัล
              </p>
            </div>

            <UButton
              block
              size="xl"
              color="primary"
              icon="i-lucide-check-circle-2"
              @click="confirmAndGoHome"
            >
              ติดต่อเจ้าหน้าที่แล้ว / กลับสู่หน้าหลัก
            </UButton>
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
</style>
