/**
 * composables/useQrScanner.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — ห่อ Logic เปิด/ปิด/สลับกล้องสแกน QR ด้วย html5-qrcode ให้เรียกใช้ซ้ำ
 * ได้ (สกัดแนวทางเดียวกับที่ pages/scan.vue ใช้อยู่แล้วออกมาเป็น Composable) ใช้
 * เป็นครั้งแรกโดย components/station/StationMissionQr.vue (ภารกิจสแกน QR จริง
 * แทนปุ่ม "จำลองการสแกนสำเร็จ" เดิม)
 *
 * *** ไม่แก้ pages/scan.vue เลยแม้แต่บรรทัดเดียว *** — หน้านั้นมี Logic กล้องของ
 * ตัวเองอยู่แล้วที่ทำงานถูกต้องดีอยู่แล้ว (ผ่านการทดสอบมาหลายรอบ) การย้ายมาเรียก
 * Composable นี้ร่วมกันมีความเสี่ยงทำให้ Flow เดิมพังโดยไม่จำเป็น — ยอมรับโค้ดซ้ำ
 * เล็กน้อยแทนเพื่อความปลอดภัย (Component ใหม่นี้เท่านั้นที่ใช้ Composable นี้)
 *
 * ผู้เรียกต้องส่ง elementId (id ของ div ที่จะ mount กล้อง — ต้องไม่ซ้ำกับ
 * "qr-reader" ของ pages/scan.vue ถ้าทั้งสองมีสิทธิ์ mount พร้อมกันในอนาคต) และ
 * onDecode(text) callback มาเอง (ตัดสินใจว่าจะประมวลผลอย่างไร — Composable นี้แค่
 * ดูแล Lifecycle ของกล้องล้วน ๆ ไม่รู้จัก Business Logic ใด ๆ ทั้งสิ้น)
 */

import type { Html5Qrcode as Html5QrcodeType, CameraDevice } from 'html5-qrcode'

export type QrScanState = 'idle' | 'starting' | 'running' | 'error' | 'stopped'

export function useQrScanner(elementId: string, onDecode: (text: string) => void) {
  const scanState = ref<QrScanState>('idle')
  const errorMessage = ref('')
  const cameras = ref<CameraDevice[]>([])
  const activeCameraIndex = ref(0)

  let html5Qrcode: Html5QrcodeType | null = null
  let Html5QrcodeCtor: typeof import('html5-qrcode').Html5Qrcode | null = null

  function pickDefaultCameraIndex(list: CameraDevice[]): number {
    // มือถือส่วนใหญ่กล้องหลัง (back/environment) จะช่วยสแกน QR ได้ง่ายกว่า
    const backIndex = list.findIndex((cam) => /back|rear|environment/i.test(cam.label))
    return backIndex >= 0 ? backIndex : 0
  }

  async function startCamera(cameraId?: string): Promise<void> {
    if (!Html5QrcodeCtor) return
    scanState.value = 'starting'
    errorMessage.value = ''

    try {
      if (!html5Qrcode) {
        html5Qrcode = new Html5QrcodeCtor(elementId, { verbose: false })
      }

      const targetCameraId = cameraId ?? cameras.value[activeCameraIndex.value]?.id

      await html5Qrcode.start(
        targetCameraId ? { deviceId: { exact: targetCameraId } } : { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        (decodedText) => {
          onDecode(decodedText)
        },
        () => {
          // ยังไม่เจอ QR ในเฟรมนี้ — เป็นเรื่องปกติระหว่างสแกน ไม่ต้องแจ้งเตือน
        },
      )

      scanState.value = 'running'
    } catch (err) {
      scanState.value = 'error'
      errorMessage.value =
        err instanceof Error ? err.message : 'ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง'
    }
  }

  async function stopCamera(): Promise<void> {
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

  async function switchCamera(): Promise<void> {
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

  /** โหลด html5-qrcode (dynamic import — โค้ดหนัก ไม่ควรอยู่ใน bundle หลัก) +
   * enumerate กล้อง + เปิดกล้องอัตโนมัติ เรียกครั้งเดียวตอน mounted ของ Component */
  async function initAndStart(): Promise<void> {
    const mod = await import('html5-qrcode')
    Html5QrcodeCtor = mod.Html5Qrcode

    try {
      const list = await mod.Html5Qrcode.getCameras()
      cameras.value = list
      activeCameraIndex.value = pickDefaultCameraIndex(list)
    } catch {
      // ถ้า enumerate กล้องไม่ได้ ยังลองเปิดด้วย facingMode: environment ต่อได้อยู่
    }

    await startCamera(cameras.value[activeCameraIndex.value]?.id)
  }

  return {
    scanState: readonly(scanState),
    errorMessage: readonly(errorMessage),
    cameras: readonly(cameras),
    hasMultipleCameras: computed(() => cameras.value.length > 1),
    initAndStart,
    startCamera,
    stopCamera,
    switchCamera,
  }
}
