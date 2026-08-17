<script setup lang="ts">
/**
 * components/photo-question/PhotoCamera.vue
 * ---------------------------------------------------------------------------
 * เปิดกล้องของเครื่อง (getUserMedia ตรง ๆ ผ่าน <video>/<canvas> — แบบเดียวกับ
 * components/photo-quest/CameraCapture.vue ของระบบ Photo Quest เดิม) เพื่อใช้
 * กับระบบ "Photo Question" ใหม่ที่ผูกกับ Station/Question โดยเฉพาะ — เป็น
 * component อิสระ คนละ <video> instance คนละ lifecycle จาก CameraCapture.vue
 * เดิมและจาก pages/scan.vue (QR Scanner) ไม่แชร์ state ใด ๆ กันเลย
 *
 * Phase นี้ทำแค่ UI/Flow การถ่ายรูปเท่านั้น — ไม่มี AI Detection ใด ๆ ในไฟล์นี้
 *
 * จัดการ Error ตามสเปก:
 *  - ผู้ใช้ไม่อนุญาต Camera (NotAllowedError / PermissionDeniedError)
 *  - Browser ไม่มี Camera (NotFoundError / DevicesNotFoundError)
 *  - Camera เปิดไม่ได้ (NotReadableError / OverconstrainedError ฯลฯ)
 *  - Browser ไม่รองรับ getUserMedia เลย (เช่น Safari เก่ามาก ๆ / non-secure context)
 */

type CameraState = 'starting' | 'running' | 'error'

const state = ref<CameraState>('starting')
const errorMessage = ref('')
const canRetry = ref(true)
const videoEl = ref<HTMLVideoElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
let stream: MediaStream | null = null

const emit = defineEmits<{
  /** ถ่ายรูปสำเร็จ — ส่ง dataURL ของภาพกลับไปให้ PhotoQuestion.vue เก็บใน State */
  capture: [photoDataUrl: string]
  /** ผู้ใช้กดปิด/ยกเลิกกล้องระหว่างที่ยังไม่ได้ถ่าย (กลับไปหน้าคำถาม) */
  cancel: []
}>()

function describeError(err: unknown): { message: string; retryable: boolean } {
  const name = err instanceof DOMException ? err.name : ''

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return {
      message: 'ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการเข้าถึงกล้องในเบราว์เซอร์ แล้วลองอีกครั้ง',
      retryable: true,
    }
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return {
      message: 'ไม่พบกล้องบนอุปกรณ์นี้ ไม่สามารถถ่ายรูปได้',
      retryable: false,
    }
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return {
      message: 'เปิดกล้องไม่สำเร็จ อาจมีแอปอื่นกำลังใช้กล้องอยู่ ลองปิดแอปอื่นแล้วลองใหม่',
      retryable: true,
    }
  }
  if (name === 'OverconstrainedError') {
    return {
      message: 'กล้องของอุปกรณ์นี้ไม่รองรับการตั้งค่าที่ต้องการ',
      retryable: false,
    }
  }
  return {
    message: 'เปิดกล้องไม่สำเร็จ กรุณาลองอีกครั้ง',
    retryable: true,
  }
}

async function startCamera(): Promise<void> {
  state.value = 'starting'
  errorMessage.value = ''

  if (!import.meta.client) return

  if (!navigator.mediaDevices?.getUserMedia) {
    state.value = 'error'
    errorMessage.value = 'เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง กรุณาใช้เบราว์เซอร์รุ่นใหม่ หรืออัปเดตเบราว์เซอร์'
    canRetry.value = false
    return
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
    }
    state.value = 'running'
  } catch (err) {
    const { message, retryable } = describeError(err)
    state.value = 'error'
    errorMessage.value = message
    canRetry.value = retryable
  }
}

function stopCamera(): void {
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
  if (videoEl.value) {
    videoEl.value.srcObject = null
  }
}

function capturePhoto(): void {
  if (!videoEl.value || !canvasEl.value || state.value !== 'running') return

  const video = videoEl.value
  const canvas = canvasEl.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  stopCamera()
  emit('capture', dataUrl)
}

function handleCancel(): void {
  stopCamera()
  emit('cancel')
}

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<template>
  <div class="photo-camera">
    <div v-if="state === 'starting'" class="photo-camera__status">
      <UIcon name="i-lucide-loader-2" class="photo-camera__spinner" />
      <p>กำลังเปิดกล้อง...</p>
      <UButton variant="ghost" size="sm" @click="handleCancel">ยกเลิก</UButton>
    </div>

    <div v-else-if="state === 'error'" class="photo-camera__status photo-camera__status--error">
      <UIcon name="i-lucide-camera-off" class="photo-camera__error-icon" />
      <p>{{ errorMessage }}</p>
      <div class="photo-camera__error-actions">
        <UButton v-if="canRetry" @click="startCamera">ลองอีกครั้ง</UButton>
        <UButton variant="outline" @click="handleCancel">กลับ</UButton>
      </div>
    </div>

    <div v-show="state === 'running'" class="photo-camera__viewport">
      <button type="button" class="photo-camera__close" aria-label="ปิดกล้อง" @click="handleCancel">
        <UIcon name="i-lucide-x" />
      </button>
      <video ref="videoEl" class="photo-camera__video" playsinline muted />
      <button type="button" class="photo-camera__shutter" aria-label="ถ่ายรูป" @click="capturePhoto">
        <span class="photo-camera__shutter-inner" />
      </button>
    </div>

    <canvas ref="canvasEl" class="photo-camera__canvas-hidden" />
  </div>
</template>

<style scoped>
.photo-camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.photo-camera__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem 1rem;
  color: var(--farm-text-muted);
  text-align: center;
}

.photo-camera__status--error {
  color: var(--farm-wood-dark);
}

.photo-camera__error-icon {
  width: 2.25rem;
  height: 2.25rem;
}

.photo-camera__error-actions {
  display: flex;
  gap: 0.5rem;
}

.photo-camera__spinner {
  width: 1.75rem;
  height: 1.75rem;
  animation: photo-camera-spin 1s linear infinite;
}

@keyframes photo-camera-spin {
  to {
    transform: rotate(360deg);
  }
}

.photo-camera__viewport {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 3 / 4;
  border-radius: 1rem;
  overflow: hidden;
  background: #000;
  border: 3px solid var(--farm-wood);
}

.photo-camera__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-camera__close {
  position: absolute;
  right: 0.6rem;
  top: 0.6rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.photo-camera__shutter {
  position: absolute;
  left: 50%;
  bottom: 0.9rem;
  transform: translateX(-50%);
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  border: 3px solid var(--farm-cream);
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-camera__shutter-inner {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 999px;
  background: var(--farm-cream);
}

.photo-camera__canvas-hidden {
  display: none;
}
</style>
