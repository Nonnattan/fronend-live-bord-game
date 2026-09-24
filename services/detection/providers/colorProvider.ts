/**
 * services/detection/providers/colorProvider.ts
 * ---------------------------------------------------------------------------
 * Provider สำหรับ detectionType 'color' และ 'image_condition' — ใช้ Canvas API
 * ล้วน ๆ (getImageData + pixel math) ไม่ใช้ AI/Model ใด ๆ เลย จึงทำงาน Offline
 * ได้ 100% เร็วมาก (เสร็จภายในไม่กี่มิลลิวินาที) เหมาะเป็น detection type แรก
 * ที่ implement จริง (Phase 1) ตามที่สเปกระบุว่า "ยังไม่ต้องสร้าง/train AI Model
 * จริง" ในรอบนี้
 *
 * 'color': เทียบสีเฉลี่ยของภาพ (หรือของบริเวณกลางภาพ) กับ rule.target (hex)
 * 'image_condition': รองรับเงื่อนไขทั่วไปที่ระบุผ่าน rule.target เช่น
 *   'min-brightness' — ภาพต้องสว่างพอ (กันถ่ายรูปมืด/ปิดเลนส์)
 */

import type { DetectionProvider, DetectionInput } from '../types'
import type { DetectionResult } from '~/types/photoQuest'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

/** คำนวณสีเฉลี่ย + ความสว่างเฉลี่ยของภาพ โดยสุ่มตัวอย่างพิกเซล (ไม่ต้องอ่านทุก
 * พิกเซลเพื่อความเร็ว — สุ่มทุก ๆ N พิกเซลก็แม่นยำพอสำหรับงานนี้) */
function analyzeImage(image: HTMLImageElement | ImageBitmap): {
  avgR: number
  avgG: number
  avgB: number
  avgBrightness: number
} {
  const canvas = document.createElement('canvas')
  // ลดขนาดลงก่อนวิเคราะห์เพื่อความเร็ว (ไม่ต้องการความละเอียดสูงสำหรับสีเฉลี่ย)
  const maxSize = 200
  const srcW = 'width' in image ? image.width : 0
  const srcH = 'height' in image ? image.height : 0
  const scale = Math.min(1, maxSize / Math.max(srcW, srcH, 1))
  canvas.width = Math.max(1, Math.round(srcW * scale))
  canvas.height = Math.max(1, Math.round(srcH * scale))

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('ไม่สามารถสร้าง Canvas 2D Context ได้ (เบราว์เซอร์ไม่รองรับ)')
  }
  ctx.drawImage(image as CanvasImageSource, 0, 0, canvas.width, canvas.height)

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let sumR = 0
  let sumG = 0
  let sumB = 0
  let count = 0

  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i] ?? 0
    sumG += data[i + 1] ?? 0
    sumB += data[i + 2] ?? 0
    count += 1
  }

  const avgR = sumR / count
  const avgG = sumG / count
  const avgB = sumB / count
  // สูตรความสว่างมาตรฐาน (perceived luminance)
  const avgBrightness = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255

  return { avgR, avgG, avgB, avgBrightness }
}

function detectColor(input: DetectionInput): DetectionResult {
  const target = hexToRgb(input.rule.target)
  if (!target) {
    return {
      passed: false,
      confidence: 0,
      reason: `target ของเควสนี้ไม่ใช่รูปแบบสี hex ที่ถูกต้อง ("${input.rule.target}")`,
      providerId: 'canvas-color-v1',
    }
  }

  const { avgR, avgG, avgB } = analyzeImage(input.image)
  // ระยะห่างสีแบบ Euclidean ใน RGB space — normalize เป็น 0-1 (0 = ต่างกันสุด, 1 = สีตรงกันเป๊ะ)
  const maxDistance = Math.sqrt(255 ** 2 * 3)
  const distance = Math.sqrt((avgR - target.r) ** 2 + (avgG - target.g) ** 2 + (avgB - target.b) ** 2)
  const similarity = 1 - distance / maxDistance

  const passed = similarity >= input.rule.confidence
  return {
    passed,
    confidence: Number(similarity.toFixed(3)),
    reason: passed ? undefined : `สีในภาพไม่ตรงกับสีที่กำหนด (ความคล้าย ${(similarity * 100).toFixed(0)}%)`,
    providerId: 'canvas-color-v1',
  }
}

function detectImageCondition(input: DetectionInput): DetectionResult {
  const { avgBrightness } = analyzeImage(input.image)

  switch (input.rule.target) {
    case 'min-brightness': {
      const passed = avgBrightness >= input.rule.confidence
      return {
        passed,
        confidence: Number(avgBrightness.toFixed(3)),
        reason: passed ? undefined : 'ภาพมืดเกินไป กรุณาถ่ายในที่ที่มีแสงสว่างเพียงพอ',
        providerId: 'canvas-color-v1',
      }
    }
    default:
      return {
        passed: false,
        confidence: 0,
        reason: `ยังไม่รองรับเงื่อนไข image_condition target="${input.rule.target}"`,
        providerId: 'canvas-color-v1',
      }
  }
}

export const colorProvider: DetectionProvider = {
  id: 'canvas-color-v1',
  supports: ['color', 'image_condition'],
  isOfflineCapable: true,
  async detect(input: DetectionInput): Promise<DetectionResult> {
    if (input.rule.detectionType === 'color') {
      return detectColor(input)
    }
    if (input.rule.detectionType === 'image_condition') {
      return detectImageCondition(input)
    }
    throw new Error(`colorProvider ไม่รองรับ detectionType="${input.rule.detectionType}"`)
  },
}
