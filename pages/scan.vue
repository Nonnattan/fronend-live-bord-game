<script setup lang="ts">
/**
 * pages/scan.vue
 * ---------------------------------------------------------------------------
 * หน้า Scan QR Code — ใช้กล้องจริงของเครื่อง (html5-qrcode ครอบ Camera API/
 * getUserMedia ให้อีกที) เปิดกล้องอัตโนมัติเมื่อเข้าหน้านี้ รองรับมือถือ
 * (เลือกกล้องหลังก่อนเป็นค่าเริ่มต้น) มีปุ่มสลับกล้องหน้า/หลัง และปุ่มปิดกล้อง
 *
 * หมายเหตุ: ไม่แตะต้อง Logic เดิมของหน้านี้ (useRequireProfile guard เดิม
 * ยังทำงานเหมือนเดิมทุกประการ) — ส่วนที่เพิ่มคือ Logic การเปิด/ปิด/สลับกล้อง
 * และการอ่านค่า QR เท่านั้น ซึ่งเป็นของใหม่ทั้งหมด ไม่ได้ไปแก้ของเดิมที่มีอยู่
 */

import type { Html5Qrcode as Html5QrcodeType, CameraDevice } from 'html5-qrcode'

definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

const QR_ELEMENT_ID = 'qr-reader'

/** สถานะกล้อง: 'idle' ยังไม่เริ่ม, 'starting' กำลังขอสิทธิ์/เปิดกล้อง, 'running' กำลังสแกน, 'error' เปิดกล้องไม่สำเร็จ, 'stopped' ผู้ใช้ปิดกล้องเอง */
type ScanState = 'idle' | 'starting' | 'running' | 'error' | 'stopped'

const scanState = ref<ScanState>('idle')
const errorMessage = ref('')
const lastResult = ref('')
const cameras = ref<CameraDevice[]>([])
const activeCameraIndex = ref(0)

let html5Qrcode: Html5QrcodeType | null = null
let Html5QrcodeCtor: typeof import('html5-qrcode').Html5Qrcode | null = null

function pickDefaultCameraIndex(list: CameraDevice[]): number {
  // มือถือส่วนใหญ่กล้องหลัง (back/environment) จะช่วยสแกน QR ได้ง่ายกว่า
  const backIndex = list.findIndex((cam) => /back|rear|environment/i.test(cam.label))
  return backIndex >= 0 ? backIndex : 0
}

async function startCamera(cameraId?: string) {
  if (!Html5QrcodeCtor) return
  scanState.value = 'starting'
  errorMessage.value = ''

  try {
    if (!html5Qrcode) {
      html5Qrcode = new Html5QrcodeCtor(QR_ELEMENT_ID, { verbose: false })
    }

    const targetCameraId = cameraId ?? cameras.value[activeCameraIndex.value]?.id

    await html5Qrcode.start(
      targetCameraId ? { deviceId: { exact: targetCameraId } } : { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1,
      },
      (decodedText) => {
        lastResult.value = decodedText
      },
      () => {
        // ยังไม่เจอ QR ในเฟรมนี้ — เป็นเรื่องปกติระหว่างสแกน ไม่ต้องแจ้งเตือน
      },
    )

    scanState.value = 'running'
  } catch (err) {
    scanState.value = 'error'
    errorMessage.value = err instanceof Error ? err.message : 'ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง'
  }
}

async function stopCamera() {
  if (html5Qrcode && scanState.value === 'running') {
    try {
      await html5Qrcode.stop()
      html5Qrcode.clear()
    } catch {
      // เพิกเฉยถ้าปิดซ้ำ/ปิดตอนที่ยังไม่ทันเริ่ม
    }
  }
  scanState.value = 'stopped'
}

async function switchCamera() {
  if (cameras.value.length < 2) return
  if (html5Qrcode && scanState.value === 'running') {
    try {
      await html5Qrcode.stop()
      html5Qrcode.clear()
    } catch {
      // ignore
    }
  }
  activeCameraIndex.value = (activeCameraIndex.value + 1) % cameras.value.length
  await startCamera(cameras.value[activeCameraIndex.value]?.id)
}

async function retryCamera() {
  lastResult.value = ''
  await startCamera(cameras.value[activeCameraIndex.value]?.id)
}

onMounted(async () => {
  const mod = await import('html5-qrcode')
  Html5QrcodeCtor = mod.Html5Qrcode

  try {
    const list = await mod.Html5Qrcode.getCameras()
    cameras.value = list
    activeCameraIndex.value = pickDefaultCameraIndex(list)
  } catch {
    // ถ้า enumerate กล้องไม่ได้ ยังลองเปิดด้วย facingMode: environment ต่อได้อยู่
  }

  // เปิดกล้องอัตโนมัติทันทีที่เข้าหน้านี้
  await startCamera(cameras.value[activeCameraIndex.value]?.id)
})

onBeforeUnmount(async () => {
  if (html5Qrcode && scanState.value === 'running') {
    try {
      await html5Qrcode.stop()
      html5Qrcode.clear()
    } catch {
      // ignore
    }
  }
})
</script>

<template>
  <div class="page">
    <PageHeader title="Scan QR Code" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="scan">
      <div class="scan__viewport" :class="{ 'scan__viewport--hidden': scanState !== 'running' && scanState !== 'starting' }">
        <div :id="QR_ELEMENT_ID" class="scan__reader" />
      </div>

      <div v-if="scanState === 'starting'" class="scan__frame">
        <UIcon name="i-lucide-loader-2" class="scan__icon scan__icon--spin" />
        <p class="scan__title">กำลังเปิดกล้อง...</p>
      </div>

      <div v-else-if="scanState === 'error'" class="scan__frame">
        <UIcon name="i-lucide-camera-off" class="scan__icon" />
        <p class="scan__title">เปิดกล้องไม่สำเร็จ</p>
        <p class="scan__desc">{{ errorMessage }}</p>
        <UButton color="primary" icon="i-lucide-rotate-cw" @click="retryCamera">ลองใหม่อีกครั้ง</UButton>
      </div>

      <div v-else-if="scanState === 'stopped'" class="scan__frame">
        <UIcon name="i-lucide-scan-line" class="scan__icon" />
        <p class="scan__title">ปิดกล้องแล้ว</p>
        <p class="scan__desc">กดเปิดกล้องอีกครั้งเพื่อสแกน QR Code</p>
        <UButton color="primary" icon="i-lucide-camera" @click="retryCamera">เปิดกล้อง</UButton>
      </div>

      <template v-else>
        <p class="scan__title">วางกล้องให้ตรง QR Code</p>
        <p class="scan__desc">ใช้สแกน QR Code เพื่อสะสมคะแนน หรือรับสิทธิพิเศษหน้าร้าน</p>
      </template>

      <div v-if="lastResult" class="scan__result">
        <UIcon name="i-lucide-badge-check" class="scan__result-icon" />
        <div class="scan__result-body">
          <p class="scan__result-label">สแกนสำเร็จ</p>
          <p class="scan__result-value">{{ lastResult }}</p>
        </div>
        <UButton size="xs" variant="soft" @click="lastResult = ''">สแกนอีกครั้ง</UButton>
      </div>

      <div v-if="scanState === 'running' || scanState === 'starting'" class="scan__controls">
        <button type="button" class="scan__control-btn" :disabled="cameras.length < 2" @click="switchCamera">
          <UIcon name="i-lucide-refresh-ccw" class="scan__control-icon" />
          <span>สลับกล้อง</span>
        </button>
        <button type="button" class="scan__control-btn scan__control-btn--danger" @click="stopCamera">
          <UIcon name="i-lucide-camera-off" class="scan__control-icon" />
          <span>ปิดกล้อง</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100%; }
.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}
.page__spinner { width: 2rem; height: 2rem; color: var(--farm-accent-dark); animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.scan {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 1.5rem 1.25rem 2rem;
  text-align: center;
}

.scan__viewport {
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 1 / 1;
  border-radius: 1.25rem;
  overflow: hidden;
  position: relative;
  border: 3px solid var(--farm-wood);
  background: #000;
  box-shadow: 0 8px 0 -4px var(--farm-wood-dark);
}

.scan__viewport--hidden {
  display: none;
}

.scan__reader {
  width: 100%;
  height: 100%;
}

.scan__reader :deep(video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

.scan__frame {
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 1 / 1;
  border-radius: 1.25rem;
  border: 3px dashed var(--farm-wood);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.4);
  padding: 1.5rem;
}

.scan__icon {
  width: 3rem;
  height: 3rem;
  color: var(--farm-accent-dark);
}

.scan__icon--spin {
  animation: spin 1s linear infinite;
}

.scan__title {
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.25rem 0 0;
}

.scan__desc {
  font-size: 0.8rem;
  color: var(--farm-text-muted);
  margin: 0;
  max-width: 22rem;
}

.scan__result {
  width: 100%;
  max-width: 20rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-accent);
  text-align: left;
}

.scan__result-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.scan__result-body {
  flex: 1;
  min-width: 0;
}

.scan__result-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
  margin: 0;
}

.scan__result-value {
  font-size: 0.8rem;
  color: var(--farm-text-dark);
  margin: 0.1rem 0 0;
  word-break: break-all;
}

.scan__controls {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 20rem;
}

.scan__control-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 0.5rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  color: var(--farm-text-dark);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
}

.scan__control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.scan__control-btn--danger {
  border-color: #d97a5f;
  color: #a8442b;
}

.scan__control-icon {
  width: 1.15rem;
  height: 1.15rem;
}
</style>
