<script setup lang="ts">
/**
 * components/station/StationMissionList.vue
 * ---------------------------------------------------------------------------
 * เนื้อหาหลักของหน้า "ภารกิจฐาน___" (pages/station/[stationId].vue) — เดิมเคย
 * เป็นป็อปอัพ แต่ตามสเปกล่าสุด "ห้ามเปิดเป็น Modal" จึงเปลี่ยนเป็น Component
 * เนื้อหาธรรมดา (ไม่มี UModal ห่อ) หน้าเต็มเป็นคนคุม Header/ชื่อฐานเอง — Component
 * นี้แสดงแค่ Progress X/3 + การ์ดภารกิจ 3 ใบเรียงแนวตั้ง (ดมกลิ่น/ตอบคำถาม/สแกน QR)
 * เมื่อครบ 3/3 แสดงข้อความฉลองเพิ่ม (ฐานนมมี CTA พิเศษเพิ่มเติมที่ตัวหน้าเต็มเอง
 * ไม่ใช่ Component นี้ — ดู pages/station/[stationId].vue)
 */
import { MISSION_META, MISSION_ORDER } from '~/utils/stationMissionMeta'
import type { MissionKind, StationMissionMap } from '~/types/stationMission'
import StationMissionCard from './StationMissionCard.vue'

const props = defineProps<{
  missions: StationMissionMap
  /** ซ่อนข้อความฉลอง 3/3 ทั่วไป — ใช้กับฐานนมที่มี CTA จบเกม/เล่นต่อของตัวเองแทน */
  hideCelebration?: boolean
}>()

const emit = defineEmits<{
  openMission: [kind: MissionKind]
}>()

const progressCount = computed(() => MISSION_ORDER.filter((kind) => props.missions[kind].completed).length)
const isAllComplete = computed(() => progressCount.value === MISSION_ORDER.length)
</script>

<template>
  <div class="mission-list">
    <p class="mission-list__progress">{{ progressCount }} / {{ MISSION_ORDER.length }} ภารกิจ</p>

    <div v-if="isAllComplete && !hideCelebration" class="mission-list__done">
      🎉 ทำภารกิจฐานนี้ครบแล้ว
    </div>

    <div class="mission-list__cards">
      <StationMissionCard
        v-for="kind in MISSION_ORDER"
        :key="kind"
        :icon="MISSION_META[kind].icon"
        :title="MISSION_META[kind].title"
        :description="MISSION_META[kind].description"
        :completed="missions[kind].completed"
        @open="emit('openMission', kind)"
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
