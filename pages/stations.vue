<script setup lang="ts">
/**
 * pages/stations.vue
 * ---------------------------------------------------------------------------
 * หน้าเต็ม "เลือกฐาน" — เข้ามาหลังสแกน QR ฐานสำเร็จจาก pages/scan.vue (ดู
 * unlockStationFromScan() ที่นั้น) ตามสเปก "ห้ามใช้ Popup เป็นหน้าเลือกฐาน"
 * แสดง 4 ฐานเสมอ (ข้าวโพด/วัว/ดิน/นม) พร้อม Progress X/3 ต่อฐาน — กดเข้าได้เฉพาะ
 * ฐานที่ทำครบ 3/3 แล้ว (ดูซ้ำได้เสมอ) หรือฐานที่เพิ่งได้สิทธิ์จากการสแกนล่าสุด
 * เท่านั้น (ดู composables/useStationQuest.ts::canEnterStation)
 */
import { STATION_TYPE_META, type StationType } from "~/composables/useAdventure";
import type { StationCardState } from "~/types/stationMission";
import StationSelectionGrid from "~/components/station/StationSelectionGrid.vue";

definePageMeta({ layout: "app" });
const { profile, isReady } = useRequireProfile();
const { stations, initAdventure } = useAdventure();
const { getStationCardState, initStationQuest } = useStationQuest();

/** เรียงตามสเปกเสมอ: ข้าวโพด/วัว/ดิน/นม — ใช้ชื่อจริงจาก stations (Admin แก้ผ่าน
 * Backend ได้) + ไอคอนจาก STATION_TYPE_META (ของเดิม ไม่ Admin-configurable) */
const STATION_ORDER: StationType[] = ["corn", "cow", "soil", "milk"];
const stationList = computed(() =>
  STATION_ORDER.map((id) => {
    const found = stations.value.find((s) => s.id === id);
    return {
      id,
      name: found?.name ?? STATION_TYPE_META[id].label,
      icon: STATION_TYPE_META[id].icon,
    };
  }),
);

const cardStates = computed<Record<StationType, StationCardState>>(() => {
  const map = {} as Record<StationType, StationCardState>;
  for (const id of STATION_ORDER) map[id] = getStationCardState(id);
  return map;
});

function handleSelect(stationId: StationType): void {
  navigateTo(`/station/${stationId}`);
}

/** [Fix — เหตุผลเดียวกับ pages/home.vue] initStationQuest() ต้องเรียกก่อน
 * initAdventure() (Network Call) เสมอ ไม่งั้น layouts/app.vue จะซ่อน BottomNav
 * ไปชั่วคราว/ค้างนาน (hasActiveRoundTimer อ่านค่าเดียวกัน ยังไม่ถูก restore) ตอน
 * Hard Refresh หน้านี้ตรง ๆ ทั้งที่ Round จริงยังไม่จบ */
onMounted(async () => {
  await initStationQuest();
  await initAdventure(profile.value?.memberId);
});
</script>

<template>
  <div class="page">
    <PageHeader title="เลือกฐาน" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__content">
      <p class="page__hint">แตะฐานที่ปลดล็อคเพื่อเริ่มทำภารกิจ</p>
      <StationSelectionGrid :stations="stationList" :card-states="cardStates" @select="handleSelect" />
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
}

.page__spinner {
  width: 2.5rem;
  height: 2.5rem;
  animation: stations-spin 1s linear infinite;
  color: var(--farm-accent-dark);
}

.page__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 1.1rem 2rem;
}

.page__hint {
  margin: 0;
  text-align: center;
  font-size: 0.82rem;
  color: var(--farm-text-muted);
}

@keyframes stations-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
