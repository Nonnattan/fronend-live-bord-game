<script setup lang="ts">
/**
 * pages/home.vue
 * ---------------------------------------------------------------------------
 * หน้า Home หลักของระบบ — หน้าแรกของแอปหลัง Login + กรอกโปรไฟล์ครบ (guard ผ่าน
 * useRequireProfile() เหมือนทุกหน้าในแอป ไม่ได้แก้ logic เดิมของ guard นี้เลย)
 *
 * ประกอบด้วย:
 * 1) MiniMap ของ Adventure Game Map (พื้นหลังภาพ PNG สูง ~250px ไม่ใช้
 *    Leaflet/OpenStreetMap/GPS) กดแล้วไปหน้า Map เต็มที่ /map
 * 2) Summary Card ด้านล่าง — เข้าฐานแล้ว X/Y + รายการฐานทั้งหมด
 *    ข้อมูล/สถานะทั้งหมดมาจาก useAdventure() (composables/useAdventure.ts)
 *    เพียงจุดเดียว ทำให้ในอนาคตสลับไปใช้ข้อมูลจริงได้โดยไม่ต้องแก้หน้านี้
 *
 * [Fix] Summary Card แสดง "คะแนน" กลับมาอีกครั้งคู่กับ "เข้าฐานแล้ว X/Y" — ใช้
 * totalPoint จาก useAdventure() ตรง ๆ (ของเดิมมีอยู่แล้ว แค่ไม่เคยถูกดึงมาวาดใน
 * template หน้านี้เท่านั้น ไม่ได้แก้ Logic การคำนวณใน useAdventure.ts เลย)
 * [แก้ไข — แยก Initial/Master State] totalPoint = Initial/Master State (ดึงจาก
 * Backend "ครั้งเดียวตอน Login" แช่แข็งไว้ตลอด session ไม่เปลี่ยนระหว่างเล่น — ดู
 * useAdventure.ts::initInitialScore()) + คะแนนที่ทำได้ใน "รอบปัจจุบัน" เท่านั้น
 * (visitedIds ในเครื่อง เช่น ฐาน 1 +10 -> Initial+10, ฐาน 2 +20 -> Initial+30) แล้ว
 * กลับไปเท่ากับ Initial/Master State ให้เองทันทีที่ resetJourney() ล้าง visitedIds
 * ตอนกด "จบเกม" (ดู pages/scan.vue::endGameAfterFinalStation +
 * pages/round-summary.vue::confirmAndGoHome ซึ่งเป็นจุดที่เรียก resetJourney()
 * จริง) — คะแนนของรอบที่เพิ่งจบยังคงดูได้ที่หน้าสรุปผล /round-summary ตามเดิม
 * (อ่านจาก roundSummary:last ที่บันทึก "สำเนา" คะแนนรอบนั้นไว้ก่อน resetJourney()
 * จะล้างทิ้งเสมอ — ดู composables/useRoundSummary.ts)
 */

import MiniMap from "~/components/map/MiniMap.vue";
import { STATION_TYPE_META } from "~/composables/useAdventure";

definePageMeta({ layout: "app" });

const { profile, isReady } = useRequireProfile();
const {
  stations,
  totalStations,
  visitedCount,
  visitedIds,
  totalPoint,
  isVisited,
  initAdventure,
} = useAdventure();
// [Debug — ชั่วคราว] ใช้ยืนยันว่ามือถือ/คอมเห็น Round + สถานะฐานตรงกันจริงหลังจบรอบ
// (ดู composables/useAdventure.ts::refreshFromBackend สำหรับ Fix ตัวจริง) — ลบออก
// ได้เมื่อยืนยันบั๊ก "มือถือค้าง 1/4" หายแล้ว
const { currentRoundId, ensureRoundStarted } = useRound();
// [ใหม่] Flow ใหม่ — ปุ่ม GO เปิดรอบ (แทนที่การเปิดรอบเงียบ ๆ ตอนสแกนฐานแรก) +
// Timer 2 ชั่วโมง ดู composables/useRoundTimer.ts / useForceEndRound.ts
const { isOfflineMode, startRound } = useOfflineMode();
const {
  initRoundTimer,
  startRoundTimer,
  roundRemainingLabel,
  hasActiveRoundTimer,
  isRoundExpired,
} = useRoundTimer();
const { forceEndRoundDueToTimeout } = useForceEndRound();

// ส่ง memberId เข้าไปด้วย (ถ้ามี) เพื่อดึงฐานที่ผ่านจริง + คะแนนสะสมจริงจาก
// Google Sheet (getJourney/getScore) มาทับ LocalStorage — ดู useAdventure.ts
onMounted(async () => {
  await initAdventure(profile.value?.memberId);
  initRoundTimer();
  if (import.meta.client) {
    // eslint-disable-next-line no-console
    console.log("[HOME ROUND STATE]", {
      currentRoundId: currentRoundId.value,
      visitedIds: visitedIds.value,
      visitedCount: visitedCount.value,
      totalPoint: totalPoint.value,
    });
  }
});

// [ใหม่] เวลารอบหมดระหว่างที่ผู้เล่นอยู่หน้า Home พอดี (ไม่ได้ไปหน้า Scan) — ก็ต้อง
// บังคับจบรอบเหมือนกัน ไม่รอให้ไปหน้า Scan ก่อนถึงจะทำงาน (ดู pages/scan.vue ที่มี
// watch เดียวกันนี้ สำหรับตอนที่ผู้เล่นอยู่หน้านั้นแทน)
watch(isRoundExpired, (expired) => {
  if (expired) void forceEndRoundDueToTimeout("round");
});

/** ปุ่ม "GO" — เริ่มรอบใหม่จริง (เปิด Round ฝั่ง Backend/Offline + เริ่มนับเวลา
 * 2 ชั่วโมง) ก่อนหน้านี้ Round จะถูกเปิดเงียบ ๆ ตอนสแกนฐานแรกแทน (ยังคงเป็น
 * fallback อยู่ใน pages/scan.vue เผื่อกรณีที่ไม่ได้ผ่านหน้านี้ก่อน) */
const isPressingGo = ref(false);
async function pressGo(): Promise<void> {
  if (isPressingGo.value) return;
  isPressingGo.value = true;
  try {
    if (isOfflineMode.value) {
      startRound(profile.value?.uid ?? "");
    } else if (profile.value?.memberId) {
      await ensureRoundStarted(profile.value.memberId, profile.value.firstName);
    }
    startRoundTimer();
  } finally {
    isPressingGo.value = false;
  }
}

function goToMapPage() {
  navigateTo("/map");
}
</script>

<template>
  <div class="page">
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>

    <div v-else class="home">
      <!-- Greeting แบบกระชับ -->
      <div class="greeting">
        <UAvatar
          v-if="profile?.pictureUrl"
          :src="profile.pictureUrl"
          size="md"
          class="greeting__avatar"
        />
        <div v-else class="greeting__avatar-fallback">
          <UIcon name="i-lucide-user-round" class="greeting__avatar-icon" />
        </div>
        <div class="greeting__text">
          <p class="greeting__hello">สวัสดี</p>
          <p class="greeting__name">
            {{ profile?.firstName }} {{ profile?.lastName }}
          </p>
        </div>
        <!-- [ใหม่] ป้ายเวลารอบที่เหลือ — แสดงเฉพาะตอนกด GO แล้วเท่านั้น -->
        <div v-if="hasActiveRoundTimer" class="greeting__timer">
          <UIcon name="i-lucide-timer" class="greeting__timer-icon" />
          {{ roundRemainingLabel }}
        </div>
      </div>

      <!-- [ใหม่] Go Gate — ยังไม่กด GO เลย (ยังไม่มี Round/Timer เริ่ม) แสดงปุ่ม
           GO แทนเนื้อหาปกติทั้งหมด (Summary Card/เควสถ่ายรูป/แผนที่) ตาม Flow ใหม่:
           Login -> หน้านี้ (มีปุ่ม GO) -> กด GO -> เปิด Round + รับเวลา 2 ชม. ->
           เข้าเนื้อหาปกติ (สแกน QR เข้าฐานได้)
           [ใหม่] กด GO แล้วสลับไปแสดงหน้าโหลดแบบเต็มพื้นที่แทนปุ่ม GO ทันที
           (isPressingGo) — ระหว่างรอ ensureRoundStarted()/startRound() ซึ่งเป็น
           Network Call ที่อาจช้าได้จริงบนเน็ตมือถือกลางแปลง กันผู้เล่นกด GO ซ้ำ/
           สงสัยว่าปุ่มทำงานหรือไม่ (เดิมมีแค่ Spinner เล็ก ๆ ในปุ่มเท่านั้น) -->
      <section v-if="isPressingGo" class="go-gate go-gate--loading">
        <UIcon name="i-lucide-loader-2" class="go-gate__loading-spinner" />
        <p class="go-gate__title">กำลังเปิดรอบผจญภัย...</p>
        <p class="go-gate__desc">กรุณารอสักครู่</p>
      </section>

      <section v-else-if="!hasActiveRoundTimer" class="go-gate">
        <UIcon name="i-lucide-flag-triangle-right" class="go-gate__icon" />
        <p class="go-gate__title">พร้อมเริ่มผจญภัยหรือยัง?</p>
        <p class="go-gate__desc">
          กดปุ่ม GO เพื่อเปิดรอบเล่น — มีเวลา 2 ชั่วโมงในการเก็บฐานให้ครบทุกเผ่า
        </p>
        <UButton
          size="xl"
          color="primary"
          class="go-gate__button"
          @click="pressGo"
        >
          GO
        </UButton>
      </section>

      <template v-else>
      <!-- Summary Card: เข้าฐานแล้ว + คะแนน "ของรอบปัจจุบัน" เท่านั้น (totalPoint
           จาก useAdventure() — ไม่ใช่คะแนนสะสมจาก Google Sheet/Members.Point)
           ค่านี้ถูกคำนวณจากฐานที่ผ่านแล้วในรอบนี้เท่านั้นอยู่แล้ว (ดู totalPoint
           computed ใน composables/useAdventure.ts) จึง reset กลับเป็น 0 ให้เอง
           ทันทีที่ resetJourney() ล้าง visitedIds ตอนกด "จบเกม"/กลับ Home — คะแนน
           ของรอบที่เพิ่งจบยังดูได้ที่หน้าสรุปผล /round-summary (อ่านจาก
           roundSummary:last ที่บันทึกไว้ก่อน resetJourney() เสมอ ไม่เกี่ยวกับ
           totalPoint ตัวนี้แล้ว) -->
      <section class="summary-card">
        <div class="summary-card__top">
          <div class="summary-card__stat">
            <p class="summary-card__label">เข้าฐานแล้ว</p>
            <p class="summary-card__value">
              <span class="summary-card__value-num"
                >{{ visitedCount }}/{{ totalStations }}</span
              >
            </p>
          </div>

          <div class="summary-card__divider" />

          <div class="summary-card__stat">
            <p class="summary-card__label">คะแนน</p>
            <p class="summary-card__value">
              <span class="summary-card__value-num">{{ totalPoint }}</span>
            </p>
          </div>
        </div>

        <div class="station-grid">
          <div
            v-for="station in stations"
            :key="station.id"
            class="station-chip"
            :class="{ 'station-chip--visited': isVisited(station.id) }"
          >
            <span class="station-chip__icon-wrap">
              <UIcon
                v-if="isVisited(station.id)"
                name="i-lucide-check"
                class="station-chip__icon"
              />
              <span v-else class="station-chip__emoji">{{
                STATION_TYPE_META[station.type].icon
              }}</span>
            </span>
            <span class="station-chip__name">{{ station.name }}</span>
          </div>
        </div>
      </section>

      <!-- [เพิ่มใหม่] ทางเข้าระบบ "เควสถ่ายรูป" (Photo Detection Quest) — เดิม
           หน้า /photo-quest ไม่มีปุ่มเข้าจากที่ไหนเลยในแอป ต้องพิมพ์ URL เอง
           วางไว้ตรงนี้แทนการเพิ่มเมนูที่ 6 ใน BottomNav.vue เพราะแถบล่างมีครบ 5
           เมนูแล้ว (หน้าแรก/แผนที่/Scan QR/โปรไฟล์/Info) การยัดเพิ่มจะทำให้
           ปุ่มเบียดกันจนกดยากบนจอเล็ก — ไม่ได้แตะ BottomNav.vue เลยสักบรรทัด -->
      <!-- <NuxtLink to="/photo-quest" class="quest-entry">
        <span class="quest-entry__icon-wrap">
          <UIcon name="i-lucide-camera" class="quest-entry__icon" />
        </span>
        <span class="quest-entry__text">
          <span class="quest-entry__title">เควสถ่ายรูป</span>
          <span class="quest-entry__desc">ถ่ายภาพให้ AI ตรวจ รับแต้มพิเศษ</span>
        </span>
        <UIcon name="i-lucide-chevron-right" class="quest-entry__arrow" />
      </NuxtLink> -->

      <!-- Mini Adventure Map: แผนที่อ้างอิงตำแหน่งฐานย่อ ๆ ไม่มี Progress/สถานะผ่านฐาน
           (ดูสรุปเข้าฐานแล้วได้จาก Summary Card ด้านบนแทน) กดทั้ง Card
           เพื่อไปหน้า Map เต็ม -->
      <MiniMap
        :stations="stations"
        :visited-ids="visitedIds"
        @open="goToMapPage"
      />
      </template>
    </div>
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

.home {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem 1.1rem 1.25rem;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.greeting__avatar {
  border: 2px solid var(--farm-accent);
}

.greeting__avatar-fallback {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--farm-grass) 0%,
    var(--farm-accent-dark) 100%
  );
  border: 2px solid var(--farm-cream);
  flex-shrink: 0;
}

.greeting__avatar-icon {
  width: 1.35rem;
  height: 1.35rem;
  color: var(--farm-cream);
}

.greeting__text {
  min-width: 0;
}

.greeting__hello {
  font-size: 0.72rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.greeting__name {
  font-size: 1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0.05rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ------------------------- Round Timer Badge (ใหม่) ------------------------- */

.greeting__timer {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  color: var(--farm-accent-dark);
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.greeting__timer-icon {
  width: 1rem;
  height: 1rem;
}

/* ------------------------------ Go Gate (ใหม่) ------------------------------ */

.go-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  padding: 2.5rem 1.5rem;
  border-radius: 1.25rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 24px -16px rgba(74, 47, 24, 0.45);
}

.go-gate__icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--farm-accent-dark);
}

.go-gate__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.go-gate__desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--farm-text-muted);
  max-width: 22rem;
}

.go-gate__button {
  margin-top: 0.5rem;
  min-width: 8rem;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

/* [ใหม่] หน้าโหลดตอนกด GO — การ์ดเดียวกับ go-gate ปกติ แค่สลับเนื้อหาข้างในเป็น
   Spinner กลาง ๆ ให้พื้นที่สูงใกล้เคียงกัน กันหน้าโหย่งตอนสลับ state ไปมา */
.go-gate--loading {
  min-height: 14rem;
  justify-content: center;
}

.go-gate__loading-spinner {
  width: 2.75rem;
  height: 2.75rem;
  color: var(--farm-accent-dark);
  animation: spin 1s linear infinite;
}

/* ---------------------------- Summary Card ---------------------------- */

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.1rem;
  border-radius: 1.25rem;
  background: linear-gradient(
    160deg,
    var(--farm-cream) 0%,
    var(--farm-cream-dark) 100%
  );
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 24px -16px rgba(74, 47, 24, 0.45);
}

.summary-card__top {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
}

.summary-card__stat {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.15rem;
}

.summary-card__divider {
  width: 1.5px;
  align-self: stretch;
  background: var(--farm-wood);
  opacity: 0.35;
  flex-shrink: 0;
}

.summary-card__label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--farm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.summary-card__value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.15rem 0 0;
  max-width: 100%;
}

.summary-card__value-num {
  color: var(--farm-accent-dark);
  font-size: 1.3rem;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-card__value-unit {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--farm-text-muted);
  flex-shrink: 0;
}

/* ------------------- ปุ่มเข้าเควสถ่ายรูป (เพิ่มใหม่) ------------------- */

.quest-entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-radius: 1.1rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 24px -16px rgba(74, 47, 24, 0.45);
  text-decoration: none;
  transition: transform 0.15s ease;
}

.quest-entry:active {
  transform: scale(0.985);
}

.quest-entry__icon-wrap {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  border: 2px solid var(--farm-cream);
  flex-shrink: 0;
}

.quest-entry__icon {
  width: 1.3rem;
  height: 1.3rem;
  color: var(--farm-cream);
}

.quest-entry__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.quest-entry__title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.quest-entry__desc {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quest-entry__arrow {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--farm-text-muted);
  flex-shrink: 0;
}

.station-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
}

.station-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.4rem 0.15rem;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px dashed var(--farm-wood);
}

.station-chip--visited {
  border-style: solid;
  border-color: var(--farm-accent-dark);
  background: rgba(143, 199, 78, 0.22);
}

.station-chip__icon-wrap {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--farm-cream-dark);
  color: var(--farm-text-muted);
  flex-shrink: 0;
  font-size: 0.85rem;
}

.station-chip--visited .station-chip__icon-wrap {
  background: var(--farm-accent-dark);
  color: #fff;
}

.station-chip__icon {
  width: 0.8rem;
  height: 0.8rem;
}

.station-chip__emoji {
  line-height: 1;
}

.station-chip__name {
  font-size: 0.56rem;
  font-weight: 600;
  color: var(--farm-text-dark);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.station-chip__points {
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
}

@media (max-width: 360px) {
  .station-chip__name {
    font-size: 0.52rem;
  }

  .station-chip__points {
    font-size: 0.46rem;
  }

  .summary-card__value-num {
    font-size: 1.15rem;
  }
}
</style>
