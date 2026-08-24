<script setup lang="ts">
/**
 * pages/reward-received.vue
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — หน้า "ได้รับรางวัลแล้ว" เข้ามาจาก pages/round-summary.vue เท่านั้น
 * (Poll round.rewardStatus ทุก 10 วินาที เจอ 'Claimed' แล้ว navigateTo มาที่นี่
 * ให้อัตโนมัติ — ดู pollRewardStatus() ที่ไฟล์นั้น)
 *
 * *** สำคัญที่สุด: ผู้เล่นต้องกด "OK" ก่อนเท่านั้น จึงถือว่ารอบสมบูรณ์ ***
 * ห้าม auto-confirm, ห้าม reset รอบ/สร้าง Round ใหม่ก่อนกด OK เด็ดขาด — reset
 * (resetJourney/resetAnswered/clearAllTimers/clearRoundSummary) เกิดขึ้น "หลัง"
 * Backend ตอบสำเร็จ (confirmRoundReceived คืน true) เท่านั้น ดู handleOk()
 *
 * โหลดข้อมูล (roundId/userId/ชื่อผู้เล่น) ผ่าน useRoundSummary() เดิม (อ่านจาก
 * LocalStorage key "roundSummary:last" — เดียวกับที่ pages/round-summary.vue
 * ใช้อยู่แล้ว) แทนการรับผ่าน query string หรือพึ่ง useState เพียงอย่างเดียว จึง
 * "ทนต่อ Hard Refresh" ได้เต็มที่ — Refresh หน้านี้ก่อนกด OK ต้องยังอยู่ในรอบเดิม
 * และกด OK ได้ตามปกติ (ไม่ reset อะไรทั้งสิ้นจนกว่าจะกด OK สำเร็จจริง)
 *
 * ถ้าเช็คสถานะแล้วพบว่า RewardStatus ยังเป็น 'Pending' อยู่ (เช่น พิมพ์ URL เข้ามา
 * ตรง ๆ ก่อนเจ้าหน้าที่ยืนยัน) ให้เด้งกลับไปหน้า /round-summary ให้ไป Poll ต่อ
 * แทน ไม่แสดงหน้านี้ค้างไว้ผิด ๆ
 *
 * ไม่ใช้ useRequireProfile() เหมือน pages/round-summary.vue (เหตุผลเดียวกัน —
 * ไม่อยากให้ ensureRoundStarted() เปิดรอบใหม่ทันทีที่หน้านี้ mount)
 *
 * [แก้ไข] คะแนนรวมที่แสดง (mockScoreDisplay) อ่านจาก LocalStorage key
 * "stationQuestMock:progress" (mockScore) โดยตรงผ่าน getMockScoreSnapshot() —
 * ไม่ใช้ roundSummary.totalPoint + questionPoints เดิมอีกต่อไป (ต้องตรงกับที่
 * pages/round-summary.vue แสดงเป๊ะ ๆ เสมอ อ่านจาก Key เดียวกัน)
 *
 * [แก้ไข] handleOk() สำเร็จแล้ว reset ข้อมูลเกมของรอบนี้ให้ครบ (เพิ่ม
 * clearStationQuestProgress()) + ล้าง Profile/Auth แล้วพาไป "/" (หน้า Login) แทน
 * "/home" เดิม — จบเกมแล้วต้องกลับไปเริ่มจาก Login เสมอ ไม่เปิด Round/คะแนนเดิม
 * ค้างมาให้ผู้เล่นคนถัดไปเห็น (ดู doc comment ที่ handleOk() เองสำหรับเหตุผลเต็ม ๆ)
 */

definePageMeta({ layout: false });

import { getMockScoreSnapshot, clearStationQuestProgress } from "~/composables/useStationQuest";

const { profile, initProfile, hasProfile, resetProfile } = useProfile();
const { resetAuth } = useAuth();
const { roundSummary, loadRoundSummary, clearRoundSummary } = useRoundSummary();
const { status, isConfirming, error, checkRewardStatus, confirmRoundReceived } =
  useReward();
const { resetJourney } = useAdventure();
const { resetAnswered } = useQuestion();
const { clearAllTimers } = useRoundTimer();

const isReady = ref(false);
/** true เฉพาะหลังกด OK สำเร็จเท่านั้น — จุดเดียวที่อนุญาตให้ออกจากหน้านี้ได้
 * โดยไม่มีคำเตือนซ้ำ (เหมือน pages/round-summary.vue ทุกประการ) */
const confirmedLeave = ref(false);

const hasValidRound = computed(
  () => !!roundSummary.value?.roundId && !!roundSummary.value?.userId,
);
const rewardName = computed(() => status.value?.reward?.name ?? "-");

// [แก้ไข] คะแนนรวมของรอบนี้ "อ่านจาก LocalStorage โดยตรง" (stationQuestMock:progress
// .mockScore ผ่าน getMockScoreSnapshot() — ดู composables/useStationQuest.ts) แทนการ
// อ่านจาก roundSummary.totalPoint + questionPoints เดิม — ค่าหลังนี้เป็นแค่สแนปช็อต
// ที่คัดลอกผ่านมาอีกทอด (เสี่ยงไม่ตรง/ผูกกับ field คนละความหมาย) ต้องอ่าน mockScore
// ตรง ๆ จาก Key เดียวกับที่ pages/round-summary.vue ใช้เท่านั้น ไม่บวกคะแนนฐาน/
// Backend ซ้ำอีก เพราะ mockScore เป็นคะแนนรวมอยู่แล้ว
const mockScoreDisplay = ref(0);
const localStations = computed(() => roundSummary.value?.stations ?? []);

onMounted(async () => {
  try {
    initProfile();
    if (!hasProfile.value) {
      confirmedLeave.value = true;
      await navigateTo("/");
      return;
    }
    loadRoundSummary();
    // [แก้ไข] อ่าน mockScore จาก LocalStorage โดยตรง (Passive, ดู getMockScoreSnapshot())
    // ทำงานได้ทันทีไม่ต้องรอเน็ต และยังอ่านค่าถูกต้องแม้หน้านี้ถูก Refresh ก่อนกด OK
    mockScoreDisplay.value = getMockScoreSnapshot();

    if (hasValidRound.value) {
      const result = await checkRewardStatus(
        roundSummary.value!.roundId!,
        roundSummary.value!.userId!,
      );
      // [Allowlist ไม่ใช่ Denylist] แสดงหน้านี้ "เฉพาะ" ตอนมีการยืนยันชัดเจนว่า
      // rewardStatus เป็น Claimed/Confirmed แล้วเท่านั้น — กรณีอื่นทั้งหมด (ยังเป็น
      // Pending, พิมพ์ URL เข้ามาตรง ๆ ก่อนเจ้าหน้าที่ยืนยัน, หรือ round เป็น
      // undefined เพราะ Backend ที่ deploy อยู่ยังไม่มี field นี้) ให้เด้งกลับไป
      // Poll ต่อที่หน้าเดิมเสมอ (ปลอดภัยกว่าเช็คแค่ === 'Pending' เพราะไม่พึ่งพา
      // สมมติฐานว่า Backend ต้องส่ง field นี้กลับมาเสมอ)
      const rewardStatus = result?.round?.rewardStatus;
      if (rewardStatus !== "Claimed" && rewardStatus !== "Confirmed") {
        // [Fix] ต้องตั้ง confirmedLeave ก่อนเสมอ ไม่งั้น onBeforeRouteLeave guard
        // ด้านล่าง (กันผู้เล่นออกก่อนกด OK) จะดัก navigateTo() อัตโนมัตินี้ไว้
        // เองด้วย (โชว์ confirm() ถามซ้ำ) ทำให้ค้างอยู่หน้านี้เป็นหน้าว่างเปล่า
        // ไปเลยถ้าผู้เล่นกด "ยกเลิก"/เบราว์เซอร์บล็อก dialog อัตโนมัติ
        confirmedLeave.value = true;
        await navigateTo("/round-summary", { replace: true });
        return;
      }
      // [ใหม่] มาถึงตรงนี้แปลว่ามี Round จริง + RewardStatus เป็น Claimed/Confirmed
      // แล้วแน่นอน — คะแนนอ่านจาก LocalStorage (mockScoreDisplay ด้านบน) โดยตรง
      // แล้ว ไม่ต้องยิง API เพิ่มอีกจุดนึงแล้ว
    }
  } catch (err) {
    console.error("[reward-received] failed to load", err);
  }
  isReady.value = true;
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

/** ดักปุ่ม Back ของเบราว์เซอร์/มือถือ — เตือนก่อนออกเสมอ ยกเว้นกด OK สำเร็จแล้ว */
onBeforeRouteLeave(() => {
  if (confirmedLeave.value || !import.meta.client) return true;
  return window.confirm(
    "คุณยังไม่ได้กด OK ยืนยันรับรางวัล — ต้องการออกจากหน้านี้เลยหรือไม่?",
  );
});

function handleBeforeUnload(event: BeforeUnloadEvent): void {
  if (confirmedLeave.value) return;
  event.preventDefault();
  event.returnValue = "";
}

/**
 * ปุ่ม "OK" — เรียก confirmRoundReceived() ก่อนเสมอ (Backend validate เองว่า
 * Status=Ended + RewardStatus=Claimed จริง) รอผลสำเร็จ "ก่อน" เท่านั้นถึงจะ
 * reset State ของรอบปัจจุบัน (resetJourney/resetAnswered/clearAllTimers/
 * clearStationQuestProgress/clearRoundSummary — ไม่ใช้ localStorage.clear()
 * เด็ดขาด แตะเฉพาะ Key ของรอบปัจจุบันเท่านั้น) ไม่สำเร็จ -> แสดง error ค้างอยู่
 * หน้านี้ต่อ ไม่ reset อะไรทั้งสิ้น ผู้เล่นกดซ้ำได้ (Backend idempotent อยู่แล้ว)
 *
 * [แก้ไข] จบเกมแล้วต้องกลับหน้า Login ("/") ไม่ใช่ "/home" อีกต่อไป — ล้าง Profile/
 * Auth ที่จำเป็นสำหรับกลับเข้าใหม่ด้วย (กัน "/" เด้งกลับ "/home" ทันทีเพราะ
 * hasProfile ยังเป็น true ค้างอยู่ — ดู pages/index.vue) ไม่เพิ่ม logout LINE จริง
 * (logoutLine()) เพราะไม่ใช่สิ่งที่ Flow เดิมเคยทำ — มี LINE Session ค้างอยู่จริงจะ
 * Auto-login กลับเข้า Home ตามพฤติกรรมเดิมของระบบ (ดู pages/index.vue) ซึ่งเป็น
 * เรื่องที่ตั้งใจคงไว้
 */
async function handleOk(): Promise<void> {
  if (!hasValidRound.value || isConfirming.value) return;
  const ok = await confirmRoundReceived(
    roundSummary.value!.roundId!,
    roundSummary.value!.userId!,
  );
  if (!ok) return;

  confirmedLeave.value = true;
  resetJourney();
  resetAnswered();
  clearAllTimers();
  clearStationQuestProgress();
  clearRoundSummary();
  resetProfile();
  resetAuth();
  await navigateTo("/");
}

/** ปุ่ม "กลับสู่หน้าหลัก" ของ empty-state เท่านั้น (ไม่พบข้อมูลรางวัลของรอบนี้
 * เลย — ไม่มีอะไรให้ยืนยัน/reset) ต้องตั้ง confirmedLeave ก่อนเสมอเช่นกัน ไม่งั้น
 * onBeforeRouteLeave guard จะดักถามซ้ำโดยไม่จำเป็น (Guard นั้นมีไว้ป้องกันเคส
 * มีรางวัลจริงแต่ยังไม่กด OK เท่านั้น ไม่เกี่ยวกับเคสนี้เลย)
 *
 * [แก้ไข] เปลี่ยนปลายทางเป็น "/" แทน "/home" เพื่อไม่ให้มีจุดใดในหน้านี้พากลับ
 * "/home" ตรง ๆ อีกเลย — ไม่มีรอบให้ยืนยัน/reset ในเคสนี้ (ไม่พบข้อมูลรางวัลเลย)
 * จึงไม่แตะ Profile/Auth (ต่างจาก handleOk() ด้านบน) ปล่อยให้ Logic เดิมของ
 * pages/index.vue ตัดสินใจต่อเอง */
async function handleGoHomeFromEmptyState(): Promise<void> {
  confirmedLeave.value = true;
  await navigateTo("/");
}
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame">
      <div v-if="!isReady" class="loading">
        <p class="loading__text">กรุณารอสักครู่...</p>
      </div>

      <div v-else class="content">
        <div v-if="!hasValidRound" class="empty-state">
          <p class="empty-state__desc">ไม่พบข้อมูลรางวัลของรอบนี้</p>
          <UButton block color="primary" @click="handleGoHomeFromEmptyState"
            >กลับสู่หน้าหลัก</UButton
          >
        </div>

        <template v-else>
          <div class="result-hero">
            <UIcon name="i-lucide-party-popper" class="result-hero__icon" />
            <h1 class="result-hero__title">ได้รับรางวัลแล้ว</h1>
            <p v-if="profile" class="result-hero__subtitle">
              {{ profile.firstName }} {{ profile.lastName }}
            </p>
          </div>

          <div class="info-card">
            <div class="info-card__row">
              <UIcon name="i-lucide-gift" class="info-card__icon" />
              <div class="info-card__text">
                <p class="info-card__label">รางวัลที่ได้รับ</p>
                <p class="info-card__value info-card__value--reward">
                  {{ rewardName }}
                </p>
              </div>
            </div>
            <div class="info-card__row">
              <UIcon name="i-lucide-badge-check" class="info-card__icon" />
              <div class="info-card__text">
                <p class="info-card__label">รหัสรอบ (roundId)</p>
                <p class="info-card__value">{{ roundSummary?.roundId }}</p>
              </div>
            </div>
            <!-- [ใหม่] สถานะว่าได้รับรางวัลแล้ว — ชัดเจนแยกจากหัวข้อหน้า -->
            <div class="info-card__row">
              <UIcon name="i-lucide-check-circle-2" class="info-card__icon" />
              <div class="info-card__text">
                <p class="info-card__label">สถานะ</p>
                <p class="info-card__value">
                  เจ้าหน้าที่ยืนยันมอบรางวัลแล้ว — กรุณากด OK
                  เพื่อยืนยันรับรางวัล
                </p>
              </div>
            </div>
          </div>

          <!-- [แก้ไข] คะแนนรวมของรอบนี้ "อ่านจาก LocalStorage โดยตรง" (mockScore —
               ดู getMockScoreSnapshot()) แสดงได้ทันที ไม่ต้องรอเน็ต/ไม่มีสถานะ
               Loading ให้สับสนอีกต่อไป (เดิมยิง getRoundScores ไปหา Backend ซึ่ง
               sync ช้ากว่า ทำให้บางครั้งขึ้น 0 ทั้งที่เล่นจริง) mockScore เป็น
               คะแนนรวมอยู่แล้ว ไม่บวกคะแนนฐาน/Backend ซ้ำอีก -->
          <div class="info-card">
            <p class="info-card__list-title">คะแนนรวมของรอบนี้</p>
            <ul v-if="localStations.length" class="station-list">
              <li
                v-for="(station, idx) in localStations"
                :key="idx"
                class="station-list__item"
              >
                <span class="station-list__name">{{ station.name }}</span>
                <span class="station-list__points">+{{ station.points }}</span>
              </li>
            </ul>
            <p class="score-card__total">
              <span class="score-card__total-num">{{ mockScoreDisplay }}</span>
              <span class="score-card__total-unit">Point</span>
            </p>
          </div>

          <p v-if="error" class="error-text">{{ error }}</p>

          <UButton
            block
            size="xl"
            color="primary"
            :icon="error ? 'i-lucide-rotate-cw' : 'i-lucide-check-circle-2'"
            :loading="isConfirming"
            :disabled="isConfirming"
            @click="handleOk"
          >
            {{ error ? "ลองอีกครั้ง" : "OK" }}
          </UButton>
        </template>
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

.loading__text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--farm-text-muted);
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 1.1rem 2rem;
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

.result-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.15rem;
  padding: 0.5rem 0 0.25rem;
}

.result-hero__icon {
  width: 3rem;
  height: 3rem;
  color: var(--farm-accent-dark);
}

.result-hero__title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0.25rem 0 0;
}

.result-hero__subtitle {
  font-size: 0.9rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1rem;
  background: linear-gradient(
    160deg,
    var(--farm-cream) 0%,
    var(--farm-cream-dark) 100%
  );
  border: 2px solid var(--farm-accent-dark);
}

.info-card__row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.info-card__icon {
  width: 1.5rem;
  height: 1.5rem;
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
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.1rem 0 0;
}

.info-card__value--reward {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.error-text {
  margin: 0;
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  background: rgba(180, 60, 40, 0.1);
  color: var(--farm-wood-dark);
  font-size: 0.82rem;
  text-align: center;
}

/* --------------------------- Score Card (ใหม่) --------------------------- */

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
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid var(--farm-wood);
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

.score-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  color: var(--farm-text-muted);
  font-size: 0.82rem;
}

.score-card__spinner {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  animation: spin 1s linear infinite;
}

.score-card__total {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.3rem;
  margin: 0.4rem 0 0;
}

.score-card__total-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.score-card__total-unit {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--farm-text-muted);
}

.total-card__breakdown {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  color: var(--farm-text-muted);
  text-align: center;
}
</style>
