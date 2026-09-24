<script setup lang="ts">
/**
 * components/photo-quest/CameraCapture.vue
 * ---------------------------------------------------------------------------
 * เปิดกล้องเพื่อ "ถ่ายรูป" (ไม่ใช่ QR Scanner) — ใช้ getUserMedia ตรง ๆ ผ่าน
 * <video>/<canvas> เท่านั้น ไม่ใช้ html5-qrcode (ไลบรารีนั้นออกแบบมาสำหรับอ่าน
 * QR โดยเฉพาะ ไม่เหมาะกับงานถ่ายรูปทั่วไป) — เป็น component แยกอิสระจาก
 * pages/scan.vue โดยสมบูรณ์ คนละ <video> instance คนละ lifecycle ไม่แชร์
 * state ใด ๆ กันเลย ตามสถาปัตยกรรมที่ตกลงกันไว้
 */

type CameraState = 'idle' | 'starting' | 'running' | 'error'

const state = ref<CameraState>('idle')
const errorMessage = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
let stream: MediaStream | null = null

const emit = defineEmits<{ capture: [image: HTMLImageElement] }>()

async function startCamera(): Promise<void> {
  state.value = 'starting'
  errorMessage.value = ''
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
    state.value = 'error'
    errorMessage.value =
      err instanceof Error ? err.message : 'ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง'
  }
}

function stopCamera(): void {
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
  if (videoEl.value) {
    videoEl.value.srcObject = null
  }
  state.value = 'idle'
}

/** ถ่ายเฟรมปัจจุบันจาก <video> ลง <canvas> แล้วแปลงเป็น HTMLImageElement ส่งออก
 * ให้หน้าเรียกใช้ (pages/photo-quest/[id].vue) ส่งต่อเข้า Detection Engine */
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
  const img = new Image()
  img.onload = () => emit('capture', img)
  img.src = dataUrl
}

onBeforeUnmount(() => {
  stopCamera()
})

defineExpose({ startCamera, stopCamera, capturePhoto })
</script>

<template>
  <div class="camera-capture">
    <div v-if="state === 'idle'" class="camera-capture__prompt">
      <UButton icon="i-lucide-camera" size="lg" @click="startCamera">เปิดกล้องเพื่อถ่ายรูป</UButton>
    </div>

    <div v-else-if="state === 'starting'" class="camera-capture__status">
      <UIcon name="i-lucide-loader-2" class="camera-capture__spinner" />
      <p>กำลังเปิดกล้อง...</p>
    </div>

    <div v-else-if="state === 'error'" class="camera-capture__status camera-capture__status--error">
      <UIcon name="i-lucide-camera-off" />
      <p>{{ errorMessage }}</p>
      <UButton variant="outline" @click="startCamera">ลองอีกครั้ง</UButton>
    </div>

    <div v-show="state === 'running'" class="camera-capture__viewport">
      <video ref="videoEl" class="camera-capture__video" playsinline muted />
      <button type="button" class="camera-capture__shutter" aria-label="ถ่ายรูป" @click="capturePhoto">
        <span class="camera-capture__shutter-inner" />
      </button>
    </div>

    <canvas ref="canvasEl" class="camera-capture__canvas-hidden" />
  </div>
</template>

<style scoped>
.camera-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.camera-capture__prompt,
.camera-capture__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  color: var(--farm-text-muted);
}

.camera-capture__status--error {
  color: var(--farm-wood-dark);
}

.camera-capture__spinner {
  width: 1.75rem;
  height: 1.75rem;
  animation: camera-capture-spin 1s linear infinite;
}

@keyframes camera-capture-spin {
  to {
    transform: rotate(360deg);
  }
}

.camera-capture__viewport {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 3 / 4;
  border-radius: 1rem;
  overflow: hidden;
  background: #000;
  border: 3px solid var(--farm-wood);
}

.camera-capture__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-capture__shutter {
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

.camera-capture__shutter-inner {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 999px;
  background: var(--farm-cream);
}

.camera-capture__canvas-hidden {
  display: none;
}
</style>
