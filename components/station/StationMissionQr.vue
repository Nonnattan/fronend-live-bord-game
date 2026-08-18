<script setup lang="ts">
/**
 * components/station/StationMissionQr.vue
 * ---------------------------------------------------------------------------
 * ป็อปอัพภารกิจ "สแกน QR" — Mockup รอบนี้ใช้ปุ่ม "จำลองการสแกนสำเร็จ" แทนกล้อง
 * จริง (ไม่มีคะแนนเสมอ — ดู composables/useStationQuest.ts::completeQrMission)
 */
defineProps<{
  open: boolean
  completed: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  close: []
}>()
</script>

<template>
  <UModal
    :open="open"
    :title="completed ? '✓ ทำสำเร็จ' : '📱 ภารกิจสแกน QR'"
    :dismissible="false"
    :close="false"
    @update:open="(v) => emit('update:open', v)"
  >
    <template #body>
      <div class="mission-qr">
        <template v-if="!completed">
          <UIcon name="i-lucide-scan-line" class="mission-qr__icon" />
          <p class="mission-qr__text">ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ</p>
        </template>
        <template v-else>
          <UIcon name="i-lucide-check-circle-2" class="mission-qr__icon mission-qr__icon--done" />
          <p class="mission-qr__text">ผ่านภารกิจสแกน QR แล้ว (ไม่มีคะแนนจากภารกิจนี้)</p>
        </template>
      </div>
    </template>

    <template #footer>
      <UButton v-if="!completed" block color="primary" @click="emit('confirm')">จำลองการสแกนสำเร็จ</UButton>
      <UButton v-else block color="primary" @click="emit('close')">ปิด</UButton>
    </template>
  </UModal>
</template>

<style scoped>
.mission-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
  padding: 0.5rem 0 0.25rem;
}

.mission-qr__icon {
  width: 3rem;
  height: 3rem;
  color: var(--farm-accent-dark);
}

.mission-qr__text {
  margin: 0;
  font-size: 0.92rem;
  color: var(--farm-text-dark);
  font-weight: 600;
}
</style>
