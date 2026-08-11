/**
 * composables/useRoundSummary.ts
 * ---------------------------------------------------------------------------
 * เก็บ "สรุปผลของรอบล่าสุดที่เพิ่งจบ" ไว้ชั่วคราว เพื่อส่งต่อจากหน้า Scan
 * (ตอนกด "จบเกม" ที่ Popup ฐานนม ฝั่ง Online หรือสแกนครบ 4 ฐานฝั่ง Offline)
 * ไปแสดงที่หน้า /round-summary โดยไม่ต้องพึ่ง query string (ข้อมูลอาจยาวเกินไป)
 *
 * เก็บลง LocalStorage ด้วย (ไม่ใช่แค่ useState ในหน่วยความจำ) กันข้อมูลหาย
 * ถ้าหน้า /round-summary โดน refresh ระหว่างที่ผู้เล่นยังไม่ได้กดปุ่ม "ติดต่อ
 * เจ้าหน้าที่แล้ว" (ดู pages/round-summary.vue)
 *
 * ไม่เกี่ยวข้องกับ Round/Journey/Score ใน Google Sheet ใด ๆ ทั้งสิ้น — เป็นแค่
 * "สำเนา" ข้อมูลที่คำนวณ/ดึงมาแล้วตอนจบเกม (pages/scan.vue) เพื่อไม่ต้องยิง API
 * ซ้ำตอนเปิดหน้า Round Summary และไม่กระทบ resetJourney()/roundEnd() เดิมเลย
 */

const STORAGE_KEY = 'roundSummary:last'

export interface RoundSummaryStation {
  name: string
  /** คะแนนของฐานนี้ — ไม่แสดงผลถ้า totalPoint เป็น null (Offline Mode) */
  points: number
}

export interface RoundSummaryData {
  /** 'online' แสดงคะแนนรวมได้ตามปกติ, 'offline' ต้อง "ห้ามแสดงคะแนน" เสมอ
   * (ตามกติกา Offline Mode เดิม — ดู composables/useOfflineMode.ts) */
  mode: 'online' | 'offline'
  /** ISO string จาก server-gas (Online) หรือแปลงจาก epoch ms (Offline) */
  startTime: string | null
  endTime: string | null
  /** ฐานที่ผ่านในรอบนี้ เรียงตามลำดับที่สแกนสำเร็จ */
  stations: RoundSummaryStation[]
  /** null = ไม่แสดงแถวคะแนนรวมเลย (Offline Mode ตามสเปก หรือดึงคะแนนไม่สำเร็จ) */
  totalPoint: number | null
}

export function useRoundSummary() {
  const roundSummary = useState<RoundSummaryData | null>('round-summary-last', () => null)

  /**
   * [Fix — root cause] เดิม localStorage.setItem() ตรงนี้ไม่มี try/catch เลย —
   * ถ้า throw (เช่น Safari Private Browsing ที่ throw QuotaExceededError แม้พื้นที่
   * ว่างเหลือเยอะ, พื้นที่เก็บข้อมูลเต็มจริงบนเครื่องเก่า/ราคาประหยัดที่ใช้เล่นเกม
   * กลางแจ้ง, หรือผู้ใช้ปิด Site Data ในเบราว์เซอร์) จะทำให้ saveRoundSummary()
   * throw ขึ้นไปหาผู้เรียก (pages/scan.vue::endGameAfterFinalStation() และ branch
   * Offline Mode ใน completeStationVisit()) ทันที — ฟังก์ชันฝั่งนั้นเป็น async
   * function ที่ throw กลางคันจะ "หยุดทำงานเงียบ ๆ" (unhandled promise rejection
   * ที่ไม่มี UI ไหนโชว์ให้ผู้เล่นเห็นเลย) ทำให้ทุกบรรทัดหลังจากนี้ — รวมถึง
   * stopCamera() และ navigateTo('/round-summary') — "ไม่ถูกเรียกเลย" นี่คือสาเหตุจริง
   * ที่กด "จบเกม" แล้วไม่ไปหน้า /round-summary (Popup ปิดไปแล้วเพราะบรรทัดนั้นรัน
   * ก่อน throw แต่ที่เหลือค้างเงียบ) — ครอบ try/catch กันไว้ที่นี่แทน เพื่อให้
   * saveRoundSummary() "ไม่มีวัน throw" อีกต่อไป: บันทึกลง useState (roundSummary.value)
   * ได้เสมอ (ใช้แสดงผลในเซสชันปัจจุบันได้ทันทีแม้ LocalStorage ใช้ไม่ได้เลย) ส่วน
   * LocalStorage เป็นแค่ชั้นเสริมกันข้อมูลหายตอน refresh เท่านั้น พังแล้วไม่กระทบ
   * Flow หลัก
   */
  function saveRoundSummary(data: RoundSummaryData): void {
    roundSummary.value = data
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        // เพิกเฉย — roundSummary.value (useState) ยังมีข้อมูลอยู่ครบ พอสำหรับ
        // หน้า /round-summary แสดงผลได้ในเซสชันนี้ต่อทันที (ดูเหตุผลเต็ม ๆ ด้านบน)
      }
    }
  }

  /** อ่านสแนปช็อตล่าสุด — เช็คหน่วยความจำก่อนเสมอ (เร็วกว่า) ไม่เจอค่อย fallback
   * ไป LocalStorage (เผื่อหน้า /round-summary โดน refresh ไปแล้ว) — ครอบ
   * localStorage.getItem() ด้วย try/catch เช่นกัน (เหตุผลเดียวกับ saveRoundSummary
   * ด้านบน) กันหน้า /round-summary ค้างที่ Loading Spinner ตลอดไปถ้า Storage
   * เข้าถึงไม่ได้ (isReady.value = true ที่ onMounted ของหน้านั้นจะไปไม่ถึงถ้า
   * ฟังก์ชันนี้ throw ขึ้นไปก่อน) */
  function loadRoundSummary(): RoundSummaryData | null {
    if (roundSummary.value) return roundSummary.value
    if (!import.meta.client) return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as RoundSummaryData
      roundSummary.value = parsed
      return parsed
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // เพิกเฉย
      }
      return null
    }
  }

  /** เรียกหลังผู้เล่นกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว" ที่หน้า /round-summary เท่านั้น
   * — เคลียร์สแนปช็อตทิ้ง (ใช้ครั้งเดียวจบต่อ 1 รอบ) — ครอบ try/catch เหมือนกัน
   * (เหตุผลเดียวกับ saveRoundSummary ด้านบน) กัน localStorage.removeItem() throw
   * แล้วบล็อก confirmAndGoHome() ไม่ให้ navigateTo('/home') ต่อได้ */
  function clearRoundSummary(): void {
    roundSummary.value = null
    if (import.meta.client) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // เพิกเฉย
      }
    }
  }

  return {
    roundSummary: readonly(roundSummary),
    saveRoundSummary,
    loadRoundSummary,
    clearRoundSummary,
  }
}
