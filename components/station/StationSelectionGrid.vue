<script setup lang="ts">
/**
 * components/station/StationSelectionGrid.vue
 * ---------------------------------------------------------------------------
 * เนื้อหาหลักของหน้า "เลือกฐาน" (pages/stations.vue) — เดิมเคยเป็นป็อปอัพ
 * (StationUnlockModal.vue) แต่ตามสเปกล่าสุด "ห้ามใช้ Popup เป็นหน้าเลือกฐาน"
 * จึงเปลี่ยนเป็น Component เนื้อหาธรรมดา (ไม่มี UModal ห่อ) ให้หน้าเต็ม
 * pages/stations.vue เป็นคนคุม Layout/Header เอง แสดง 4 ฐานเสมอ (ข้าวโพด/วัว/
 * ดิน/นม) พร้อมสถานะ + Progress ต่อฐาน (ดู StationSelectionCard.vue)
 */
import type { StationType } from '~/composables/useAdventure'
import type { StationCardState } from '~/types/stationMission'
import StationSelectionCard from './StationSelectionCard.vue'

defineProps<{
  stations: { id: StationType; name: string; icon: string }[]
  cardStates: Record<StationType, StationCardState>
}>()

const emit = defineEmits<{
  select: [stationId: StationType]
}>()
</script>

<template>
  <div class="station-grid">
    <StationSelectionCard
      v-for="station in stations"
      :key="station.id"
      :station="station"
      :card-state="cardStates[station.id]"
      @select="emit('select', $event)"
    />
  </div>
</template>

<style scoped>
.station-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
