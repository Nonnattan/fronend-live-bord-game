<script setup lang="ts">
/**
 * components/station/StationUnlockModal.vue
 * ---------------------------------------------------------------------------
 * ป็อปอัพ "เลือกฐาน" (Base Selection) — เปิดทันทีหลังปลดล็อคฐานสำเร็จ หรือเปิดเอง
 * ได้ทุกเมื่อผ่านปุ่ม "ดูฐานทั้งหมด" ที่ pages/station-quest.vue แสดง 4 ฐานเสมอ
 * (ข้าวโพด/วัว/ดิน/นม) พร้อมสถานะ Locked/Unlocked/Completed ต่อฐาน ปิดได้อิสระ
 * (ไม่ใช่ป็อปอัพบังคับตัดสินใจ) กดใหม่เพื่อดูฐานอื่นซ้ำได้ตลอด
 */
import type { StationType } from '~/composables/useAdventure'
import type { StationCardStatus } from '~/types/stationMission'
import StationSelectionCard from './StationSelectionCard.vue'

defineProps<{
  open: boolean
  stations: { id: StationType; name: string; icon: string }[]
  statuses: Record<StationType, StationCardStatus>
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [stationId: StationType]
}>()
</script>

<template>
  <UModal title="เลือกฐาน" :open="open" @update:open="(v) => emit('update:open', v)">
    <template #body>
      <div class="station-unlock-grid">
        <StationSelectionCard
          v-for="station in stations"
          :key="station.id"
          :station="station"
          :status="statuses[station.id]"
          @select="emit('select', $event)"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.station-unlock-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
</style>
