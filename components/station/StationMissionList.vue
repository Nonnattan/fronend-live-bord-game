<script setup lang="ts">
/**
 * components/station/StationMissionList.vue
 * ---------------------------------------------------------------------------
 * [แก้ไข] เนื้อหาหลักของหน้า "ภารกิจฐาน___" (pages/station/[stationId].vue) —
 * รับ StationMission[] จริงจาก Backend (listStationMissions) แทน
 * StationMissionMap ตายตัว 3 คีย์แบบ Mock เดิม — จำนวนภารกิจที่แสดง (Progress
 * X/N + จำนวนการ์ด) มาจาก missions.length จริงเสมอ ไม่ hardcode เป็น 3 อีกต่อไป
 * เรียงการ์ดตาม mission.order ที่ Backend กำหนด เมื่อครบทุกใบแสดงข้อความฉลอง
 * เพิ่ม (ฐานนมมี CTA พิเศษเพิ่มเติมที่ตัวหน้าเต็มเอง ไม่ใช่ Component นี้ — ดู
 * hideCelebration)
 */
import type { StationMission } from "~/types/mission";
import StationMissionCard from "./StationMissionCard.vue";

const props = defineProps<{
  missions: StationMission[];
  /** ซ่อนข้อความฉลองครบภารกิจทั่วไป — ใช้กับฐานนมที่มี CTA จบเกม/เล่นต่อของตัวเองแทน */
  hideCelebration?: boolean;
}>();

const emit = defineEmits<{
  openMission: [mission: StationMission];
}>();

const sortedMissions = computed(() =>
  [...props.missions].sort((a, b) => a.order - b.order),
);
const progressCount = computed(
  () => sortedMissions.value.filter((m) => m.completed).length,
);
const isAllComplete = computed(
  () =>
    sortedMissions.value.length > 0 &&
    progressCount.value === sortedMissions.value.length,
);
</script>

<template>
  <div class="mission-list">
    <p class="mission-list__progress">
      {{ progressCount }} / {{ sortedMissions.length }} ภารกิจ
    </p>

    <div v-if="isAllComplete && !hideCelebration" class="mission-list__done">
      🎉 ทำภารกิจฐานนี้ครบแล้ว
    </div>

    <div class="mission-list__cards">
      <StationMissionCard
        v-for="mission in sortedMissions"
        :key="mission.id"
        :mission="mission"
        @open="emit('openMission', mission)"
      />
    </div>
  </div>
</template>

<style scoped>
.mission-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.mission-list__progress {
  margin: 0;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.mission-list__done {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
  padding: 0.6rem;
  border-radius: 0.75rem;
  background: var(--farm-cream-dark);
  border: 1.5px dashed var(--farm-accent-dark);
}

.mission-list__cards {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
</style>
