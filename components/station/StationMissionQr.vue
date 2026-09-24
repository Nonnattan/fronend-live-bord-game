<script setup lang="ts">
/**
 * components/station/StationMissionQr.vue
 * ---------------------------------------------------------------------------
 * [แก้ไข] ป็อปอัพภารกิจ "สแกน QR" — เปิดกล้องจริงสแกน QR ของภารกิจ (คนละ QR/
 * Handler กับ Station QR ของ pages/scan.vue เด็ดขาด — ดู types/mission.ts)
 * แทนปุ่ม "จำลองการสแกนสำเร็จ" เดิม ใช้ composables/useQrScanner.ts (สกัดแนวทาง
 * กล้องมาจาก pages/scan.vue แบบแยกอิสระ — ไม่แก้ไฟล์นั้นเลย) เปิดกล้องแล้ว emit
 * 'scanned' ให้ตัวหน้าเต็มเป็นคนเรียก useStationMissions().verifyQrMission()
 * ต่อ (ที่นี่ไม่รู้จัก Business Logic/Backend เลย แค่จับภาพ+ส่งค่าที่อ่านได้
 * ออกไปเท่านั้น — ไม่ถือว่าสำเร็จ/ได้คะแนนเองก่อนได้รับคำตอบจาก Backend)
 *
 * ต้องมีอินเทอร์เน็ตเสมอ (ไม่มี Offline Fallback — เหมือน verifyStationQr) —
 * ถ้าออฟไลน์อยู่ ไม่เปิดกล้องเลย แสดงข้อความแจ้งเตือนแทน
 */
import { useQrScanner } from "~/composables/useQrScanner";

const QR_ELEMENT_ID = "mission-qr-reader";

const props = defineProps<{
  open: boolean;
  completed: boolean;
  pointsEarned: number;
  isOnline: boolean;
  verifying: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  scanned: [qrToken: string];
  close: [];
}>();

const lastScanned = ref("");

function handleDecode(text: string): void {
  if (lastScanned.value || props.verifying || props.completed) return;
  lastScanned.value = text;
  emit("scanned", text);
}

const {
  scanState,
  errorMessage: cameraError,
  initAndStart,
  stopCamera,
} = useQrScanner(QR_ELEMENT_ID, handleDecode);

/** เปิดกล้องเฉพาะตอน Popup เปิดจริง + มีอินเทอร์เน็ต + ยังไม่ทำสำเร็จ (ทำสำเร็จ
 * แล้วไม่ต้องเปิดกล้องซ้ำอีก) — ปิดกล้องทันทีที่ Popup ปิด/ทำสำเร็จ/ออฟไลน์
 * flush: 'post' เสมอ — รอให้ DOM ของ #mission-qr-reader render เสร็จก่อนเรียก
 * initAndStart() (ซึ่งต้องหา element นี้เจอ) กันปัญหา Race Condition ระหว่าง
 * Vue Reactivity กับ DOM จริง */
watch(
  () => [props.open, props.isOnline, props.completed] as const,
  async ([open, isOnline, completed]) => {
    if (open && isOnline && !completed) {
      lastScanned.value = "";
      await initAndStart();
    } else {
      await stopCamera();
    }
  },
  { immediate: true, flush: "post" },
);

/** ยิงไม่สำเร็จ (Backend ตอบ error เช่น QR ผิด/ไม่ใช่ของภารกิจนี้) — ปลดล็อคให้
 * สแกนใหม่ได้อีกครั้ง (ไม่ต้องปิด/เปิด Popup ใหม่) */
watch(
  () => props.errorMessage,
  (message) => {
    if (message) lastScanned.value = "";
  },
);

onBeforeUnmount(() => {
  void stopCamera();
});
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
        <template v-if="completed">
          <UIcon
            name="i-lucide-check-circle-2"
            class="mission-qr__icon mission-qr__icon--done"
          />
          <p class="mission-qr__text">ผ่านภารกิจสแกน QR แล้ว (+{{ pointsEarned }} คะแนน)</p>
        </template>
        <template v-else-if="!isOnline">
          <UIcon name="i-lucide-wifi-off" class="mission-qr__icon" />
          <p class="mission-qr__text">
            ภารกิจนี้ต้องมีอินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่
          </p>
        </template>
        <template v-else>
          <p class="mission-qr__hint">ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ</p>
          <div :id="QR_ELEMENT_ID" class="mission-qr__camera" />
          <p v-if="scanState === 'starting'" class="mission-qr__status">กำลังเปิดกล้อง...</p>
          <p v-if="verifying" class="mission-qr__status">กำลังตรวจสอบ QR...</p>
          <p v-if="scanState === 'error'" class="mission-qr__status mission-qr__status--error">
            {{ cameraError }}
          </p>
          <p v-if="errorMessage" class="mission-qr__status mission-qr__status--error">
            {{ errorMessage }}
          </p>
        </template>
      </div>
    </template>

    <template #footer>
      <UButton block color="primary" @click="emit('close')">
        {{ completed ? "ปิด" : "ปิดหน้าต่างนี้" }}
      </UButton>
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

.mission-qr__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--farm-text-muted);
}

.mission-qr__camera {
  width: 100%;
  min-height: 240px;
  border-radius: 0.85rem;
  overflow: hidden;
  background: #000;
}

.mission-qr__status {
  margin: 0;
  font-size: 0.8rem;
  color: var(--farm-text-muted);
}

.mission-qr__status--error {
  color: var(--farm-wood-dark);
  font-weight: 700;
}
</style>
