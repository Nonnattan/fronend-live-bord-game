/**
 * services/detection/providers/cocoSsdProvider.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ (Phase 2) — Object Detection **จริง** ด้วย TensorFlow.js + โมเดล
 * COCO-SSD (ssdlite_mobilenet_v2) รองรับ detectionType 'object',
 * 'specific_object' และ 'person'
 *
 * มาแทนที่ `objectDetectionProvider.ts` (stub เดิมของ Phase 1) โดย **ไม่ลบไฟล์
 * เดิมทิ้ง** — ไฟล์ stub ยังอยู่ครบ เรียกใช้ได้อยู่ถ้าระบุ
 * `rule.provider = 'object-detection-stub-v1'` ตรง ๆ ในชีต (เผื่ออยากปิดการ
 * ตรวจจับจริงชั่วคราวโดยไม่ต้องแก้โค้ด) ดูลำดับการเลือก provider ที่
 * `detectionEngine.ts` -> PROVIDERS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * เรื่อง Offline (สำคัญมากสำหรับแอปนี้ที่เล่นกลางแจ้ง สัญญาณไม่แน่นอน)
 * ─────────────────────────────────────────────────────────────────────────
 * ตัวโค้ด TFJS ถูก bundle ไปกับแอป (precache โดย Service Worker อยู่แล้วเหมือน
 * JS ก้อนอื่น) แต่ **ไฟล์น้ำหนักของโมเดล (~5-6 MB) โหลดจาก
 * storage.googleapis.com ตอนใช้งานครั้งแรก** จึงต้องมีเน็ต "ครั้งแรกครั้งเดียว"
 * — หลังจากนั้น Service Worker (`service-worker/sw.ts` ข้อ 5.1) เก็บไว้แบบ
 * CacheFirst ถาวร ใช้งานออฟไลน์ได้ 100% ตลอดไป
 *
 * จึงตั้ง `isOfflineCapable` เป็นค่า **ไดนามิก** ตามสถานะจริงของ Cache
 * (ดู `refreshOfflineCapability()` ท้ายไฟล์) ไม่ใช่ค่าคงที่ที่โกหก UI ว่า
 * "ทำงานได้เสมอ" ทั้งที่ยังไม่เคยโหลดโมเดล
 *
 * แนะนำให้เรียก `preloadObjectDetectionModel()` ตั้งแต่หน้ารายการเควส
 * (`pages/photo-quest.vue`) ตอนที่ยังออนไลน์อยู่ ผู้เล่นจะได้ไม่ต้องรอโหลด
 * โมเดลตอนกดถ่ายรูปจริงกลางแปลง
 */

import type { DetectionProvider, DetectionInput } from '../types'
import type { DetectionResult } from '~/types/photoQuest'
import { resolveTargetLabels, toThaiLabel } from './cocoLabels'

const PROVIDER_ID = 'tfjs-coco-ssd-v1'

/** URL ของโมเดลที่ TFJS โหลดจริง — ใช้เช็คใน Cache Storage ว่าเคยโหลดครบหรือยัง
 * (ต้องตรงกับ base ที่ส่งให้ cocoSsd.load() ด้านล่างเสมอ) */
const MODEL_BASE = 'lite_mobilenet_v2' as const
const MODEL_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json'

/** ย่อภาพก่อนเข้าโมเดล — รูปจากกล้องมือถือมักกว้าง 3000px+ ซึ่งเกินความจำเป็น
 * (COCO-SSD ย่อเป็น 300x300 ภายในอยู่แล้ว) ย่อเองก่อนช่วยลดเวลา/หน่วยความจำ
 * บนมือถือรุ่นกลางได้มาก โดยความแม่นยำแทบไม่ต่าง */
const MAX_INPUT_SIZE = 640

/** จำนวนกล่องสูงสุดที่ให้โมเดลคืนมาต่อ 1 ภาพ */
const DEFAULT_MAX_BOXES = 20

/** คะแนนขั้นต่ำที่โมเดลจะรายงานผลออกมาเลย (คนละค่ากับ rule.confidence ที่ใช้
 * ตัดสิน "ผ่าน/ไม่ผ่าน") ตั้งต่ำไว้เพื่อให้เอาไปแสดงเป็นคำใบ้ตอนไม่ผ่านได้ด้วย */
const MODEL_MIN_SCORE = 0.2

interface CocoPrediction {
  bbox: [number, number, number, number]
  class: string
  score: number
}

interface CocoModel {
  detect(
    img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageData,
    maxNumBoxes?: number,
    minScore?: number,
  ): Promise<CocoPrediction[]>
}

// ---------------------------------------------------------------------------
// การโหลดโมเดล (ทำครั้งเดียวต่อ 1 session แล้วเก็บไว้ใช้ซ้ำ)
// ---------------------------------------------------------------------------

let modelPromise: Promise<CocoModel> | null = null

/**
 * โหลด TFJS + โมเดล COCO-SSD แบบ lazy (dynamic import) — จงใจไม่ import ไว้
 * ที่ top-level ของไฟล์ เพราะ:
 *   1) TFJS แตะ window/WebGL ตอน import ใช้ตอน SSR/prerender ไม่ได้
 *   2) ผู้เล่นที่ไม่ได้เข้าหน้าเควสถ่ายรูปเลย ไม่ควรต้องโหลด JS ก้อนนี้
 */
async function loadModel(): Promise<CocoModel> {
  if (!import.meta.client) {
    throw new Error('Object Detection ทำงานได้เฉพาะฝั่ง Browser เท่านั้น')
  }

  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import('@tensorflow/tfjs-core')
      await import('@tensorflow/tfjs-converter')

      // เลือก Backend: WebGL ก่อนเสมอ (เร็วกว่ามากบนมือถือ) ถ้าเครื่อง/เบราว์เซอร์
      // ไม่รองรับ (WebGL ถูกปิด, โหมดประหยัดพลังงานบางรุ่น) ค่อยถอยไป CPU ซึ่ง
      // ช้ากว่าแต่ยังใช้งานได้จริง — ไม่ปล่อยให้แอปพังเพราะไม่มี WebGL
      let ready = false
      try {
        await import('@tensorflow/tfjs-backend-webgl')
        ready = await tf.setBackend('webgl')
      } catch {
        ready = false
      }
      if (!ready) {
        await import('@tensorflow/tfjs-backend-cpu')
        ready = await tf.setBackend('cpu')
      }
      if (!ready) {
        throw new Error('อุปกรณ์นี้ไม่รองรับการประมวลผลภาพ (ทั้ง WebGL และ CPU backend)')
      }
      await tf.ready()

      const cocoSsd = await import('@tensorflow-models/coco-ssd')
      return (await cocoSsd.load({ base: MODEL_BASE })) as unknown as CocoModel
    })()

    // โหลดพลาด (เช่น ออฟไลน์ตั้งแต่ครั้งแรก) -> ล้าง promise ทิ้งเพื่อให้ครั้ง
    // ถัดไปลองใหม่ได้ ไม่ใช่ค้าง error เดิมไปตลอด session
    modelPromise.catch(() => {
      modelPromise = null
    })
  }

  return modelPromise
}

/**
 * โหลดโมเดลล่วงหน้าตอนที่ยังออนไลน์อยู่ (เรียกจากหน้ารายการเควสได้เลย) —
 * ไม่ throw ออกไปข้างนอก คืน true/false พอ เพราะเป็นงานเบื้องหลังที่ล้มเหลว
 * ได้เป็นปกติ (ไม่มีเน็ต) และไม่ควรทำให้หน้าเว็บพัง
 */
export async function preloadObjectDetectionModel(): Promise<boolean> {
  try {
    await loadModel()
    cachedOfflineCapable = true
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// สถานะ "ใช้งานออฟไลน์ได้หรือยัง" — ขึ้นกับว่าไฟล์โมเดลอยู่ใน Cache แล้วหรือยัง
// ---------------------------------------------------------------------------

/** โมเดลโหลดเข้าหน่วยความจำแล้ว หรือเคยถูก Service Worker cache ไว้แล้ว */
let cachedOfflineCapable = false

/**
 * เช็คใน Cache Storage ว่าไฟล์ model.json ถูกเก็บไว้แล้วหรือยัง — เรียกครั้งเดียว
 * ตอนแอปเริ่มทำงานก็พอ (`detectionEngine.initDetectionCapabilities()`)
 * ไม่ throw ถ้าเบราว์เซอร์ไม่มี Cache API (แค่คืน false)
 */
export async function refreshOfflineCapability(): Promise<boolean> {
  if (modelPromise) {
    cachedOfflineCapable = true
    return true
  }
  try {
    if (typeof caches === 'undefined') return false
    const hit = await caches.match(MODEL_URL, { ignoreSearch: true })
    cachedOfflineCapable = !!hit
    return cachedOfflineCapable
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// เตรียมภาพ
// ---------------------------------------------------------------------------

/** วาดภาพลง canvas พร้อมย่อขนาด — คืน HTMLCanvasElement เสมอ เพื่อให้รองรับทั้ง
 * HTMLImageElement และ ImageBitmap ด้วยเส้นทางเดียวกัน (coco-ssd รับ canvas ได้) */
function toModelInput(image: HTMLImageElement | ImageBitmap): HTMLCanvasElement {
  const srcW = image.width || 1
  const srcH = image.height || 1
  const scale = Math.min(1, MAX_INPUT_SIZE / Math.max(srcW, srcH))

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(srcW * scale))
  canvas.height = Math.max(1, Math.round(srcH * scale))

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('ไม่สามารถสร้าง Canvas 2D Context ได้ (เบราว์เซอร์ไม่รองรับ)')
  }
  ctx.drawImage(image as CanvasImageSource, 0, 0, canvas.width, canvas.height)
  return canvas
}

/** สรุปสิ่งที่โมเดลเจอในภาพเป็นข้อความไทยสั้น ๆ ไว้บอกผู้เล่นตอนตรวจไม่ผ่าน
 * (ช่วยให้รู้ว่าควรเล็งกล้องใหม่ยังไง แทนที่จะบอกแค่ "ไม่ผ่าน") */
function describeFound(predictions: CocoPrediction[]): string {
  if (predictions.length === 0) return 'ไม่พบวัตถุที่ระบุได้ในภาพเลย'
  const top = predictions
    .slice(0, 3)
    .map((p) => `${toThaiLabel(p.class)} ${(p.score * 100).toFixed(0)}%`)
    .join(', ')
  return `สิ่งที่ตรวจพบในภาพ: ${top}`
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const cocoSsdProvider: DetectionProvider = {
  id: PROVIDER_ID,
  supports: ['object', 'specific_object', 'person'],

  // ค่านี้ถูกอ่านแบบ property ธรรมดาโดย detectionEngine — ใช้ getter เพื่อให้
  // สะท้อนสถานะ Cache จริง ณ เวลานั้น (ดูหัวข้อ Offline ด้านบนของไฟล์)
  get isOfflineCapable(): boolean {
    return cachedOfflineCapable
  },

  async detect(input: DetectionInput): Promise<DetectionResult> {
    const { rule } = input

    // 'person' ไม่ต้องใช้ target (ตามสเปกใน types/photoQuest.ts) — บังคับเป็น
    // คลาส person เสมอ ส่วนอีก 2 ประเภทแปล target จากชีตเป็น label ของโมเดล
    const targetLabels =
      rule.detectionType === 'person' ? ['person'] : resolveTargetLabels(rule.target)

    if (targetLabels === null) {
      return {
        passed: false,
        confidence: 0,
        reason: `target ของเควสนี้ ("${rule.target}") ไม่ตรงกับสิ่งที่โมเดลรู้จัก — โปรดแก้ค่าในชีต PhotoQuests`,
        providerId: PROVIDER_ID,
      }
    }

    const canvas = toModelInput(input.image)

    let model: CocoModel
    try {
      model = await loadModel()
    } catch (err) {
      // แยกข้อความให้ชัดว่าเป็นปัญหา "โหลดโมเดลไม่ได้" ไม่ใช่ "ถ่ายรูปไม่ผ่าน"
      // ผู้เล่นจะได้รู้ว่าต้องต่อเน็ตครั้งแรก ไม่ใช่ถ่ายใหม่ไปเรื่อย ๆ
      const detail = err instanceof Error ? err.message : ''
      throw new Error(
        `ยังโหลดโมเดลตรวจจับภาพไม่สำเร็จ กรุณาเชื่อมต่ออินเทอร์เน็ตสักครู่เพื่อโหลดครั้งแรก (ครั้งต่อไปใช้ได้แบบออฟไลน์)${detail ? ` [${detail}]` : ''}`,
      )
    }

    const maxBoxes = Number(rule.options?.maxNumBoxes ?? DEFAULT_MAX_BOXES)
    const predictions = await model.detect(canvas, maxBoxes, MODEL_MIN_SCORE)

    // ยอมรับทุก label เมื่อ targetLabels ว่าง (กลุ่ม 'any')
    const matches =
      targetLabels.length === 0
        ? predictions
        : predictions.filter((p) => targetLabels.includes(p.class))

    const best = matches.reduce<CocoPrediction | null>(
      (acc, p) => (acc === null || p.score > acc.score ? p : acc),
      null,
    )

    const confidence = best ? Number(best.score.toFixed(3)) : 0
    const passed = !!best && best.score >= rule.confidence

    if (passed) {
      return { passed: true, confidence, providerId: PROVIDER_ID }
    }

    const wanted =
      targetLabels.length === 0
        ? 'วัตถุใด ๆ'
        : targetLabels.map(toThaiLabel).slice(0, 4).join(' หรือ ')

    // แยก 2 กรณีให้ผู้เล่นเข้าใจต่างกัน: "ไม่เจอเลย" กับ "เจอแต่ยังไม่ชัดพอ"
    const reason = best
      ? `เจอ${wanted}ในภาพแล้ว แต่ยังไม่ชัดเจนพอ (${(best.score * 100).toFixed(0)}% ต้องการ ${(rule.confidence * 100).toFixed(0)}%) ลองเข้าใกล้ขึ้นหรือถ่ายในที่แสงสว่างกว่านี้`
      : `ตรวจไม่พบ${wanted}ในภาพ — ${describeFound(predictions)}`

    return { passed: false, confidence, reason, providerId: PROVIDER_ID }
  },
}
