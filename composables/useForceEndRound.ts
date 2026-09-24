/**
 * composables/useForceEndRound.ts
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — จบรอบ "แบบบังคับ" เพราะหมดเวลา (เวลารอบ 2 ชม. หรือเวลาเผ่า 30 นาที
 * ก็ตาม — ดู composables/useRoundTimer.ts) ตามกติกาที่ตกลงกันไว้ "หมดเวลา =
 * บังคับจบรอบ" เขียนเป็น composable กลางแยกต่างหาก (ไม่ใช่ฟังก์ชันใน
 * pages/scan.vue) เพื่อให้เรียกได้จากทุกหน้า (Home/Map/Scan) เพราะ Timer เดินอยู่
 * ตลอดเวลาไม่ว่าผู้เล่นจะอยู่หน้าไหนก็ตาม (ดู pages/home.vue + pages/scan.vue
 * ที่ต่าง watch() การหมดเวลานี้แล้วเรียกฟังก์ชันนี้เหมือนกัน)
 *
 * *** ไม่ Commit ฐานสุดท้าย (นม) ให้เด็ดขาด ***: ถ้าผู้เล่นยังไปไม่ถึงฐานนม การ
 * หมดเวลาจะจบรอบด้วยคะแนน/ฐานที่ทำได้จริงเท่านั้น (ไม่มีการเดาว่าเคยไปถึงฐาน
 * สุดท้ายแล้ว — ป้องกันการให้คะแนน/ทำเครื่องหมายฐานที่ไม่ได้สแกนจริง) ต่างจากปุ่ม
 * "จบเกม" ที่ Popup ฐานนม (pages/scan.vue::endGameAfterFinalStation() /
 * endGameOfflineAfterFinalStation()) ซึ่งมี Logic Commit ฐานนม + แบบประเมินของ
 * ตัวเอง — ยังคงอยู่ที่ pages/scan.vue เหมือนเดิมทุกประการ ไม่ได้ย้าย/แก้เลย
 *
 * [แก้ไข] "ฐานที่เล่นแล้ว" (playedStations) เปลี่ยนจาก useAdventure().isVisited
 * (ค้างเป็น false เสมอตาม Flow ปลดล็อคฐาน+ภารกิจปัจจุบัน — ไม่มีจุดไหนเรียก
 * toggleStation() จาก pages/scan.vue อีกต่อไป) เป็น useStationMissions().
 * isStationMissionComplete() แทน (ที่มาเดียวกับ pages/home.vue/pages/map.vue —
 * ดูคอมเมนต์ที่ไฟล์เหล่านั้น) และตัด totalPoint/questionPoints/questionCorrectCount
 * ออกจาก saveRoundSummary() (ค่าจาก useAdventure()/useQuestion() ที่ค้างเป็น 0
 * เสมอในทางปฏิบัติเช่นกัน — pages/round-summary.vue/pages/reward-received.vue
 * ดึงคะแนนจริงจาก useRoundScores() เอง ไม่อ่านจาก Snapshot นี้อีกต่อไปแล้ว)
 */

import type { RoundSummaryData } from '~/composables/useRoundSummary'

export function useForceEndRound() {
  const { stations } = useAdventure()
  const { isStationMissionComplete } = useStationMissions()
  const { isOnline, syncNow } = useOfflineSync()
  const { isOfflineMode, roundData, endRound } = useOfflineMode()
  const { endCurrentRound, currentRoundId } = useRound()
  const { saveRoundSummary } = useRoundSummary()
  const { clearAllTimers } = useRoundTimer()
  const { profile } = useProfile()

  const isForceEnding = ref(false)

  /**
   * เรียกเมื่อเห็น isRoundExpired/isStationExpired เป็น true — ปิด Round/บันทึก
   * สรุปผลด้วยความคืบหน้าจริงตอนนั้น แล้วพาไปหน้า /round-summary เสมอ (เหมือนกด
   * "จบเกม" เอง แต่ไม่มี Survey/ไม่ Commit ฐานนม) ผู้เรียก (pages/scan.vue) ควรปิด
   * Popup/กล้องของตัวเองก่อนเรียกฟังก์ชันนี้ (ฟังก์ชันนี้ไม่รู้จัก UI ของหน้าเรียก)
   */
  async function forceEndRoundDueToTimeout(
    reason: 'round' | 'station',
  ): Promise<void> {
    if (isForceEnding.value) return
    isForceEnding.value = true

    const endedReason: RoundSummaryData['endedReason'] =
      reason === 'round' ? 'round-timeout' : 'station-timeout'

    try {
      const playedStations = stations.value
        .filter((s) => isStationMissionComplete(s.id))
        .map((s) => ({ name: s.name, points: 0 }))

      if (isOfflineMode.value) {
        endRound()
        saveRoundSummary({
          mode: 'offline',
          startTime: roundData.value?.startedAt
            ? new Date(roundData.value.startedAt).toISOString()
            : null,
          endTime: new Date(roundData.value?.endedAt ?? Date.now()).toISOString(),
          stations: playedStations,
          totalPoint: null,
          roundId: null,
          userId: profile.value?.uid ?? null,
          endedReason,
        })
      } else {
        const memberId = profile.value?.memberId
        // จับค่า roundId ไว้ "ก่อน" endCurrentRound() เสมอ (มันเคลียร์ค่านี้เป็น
        // null ใน finally ของตัวเอง — ดู composables/useRound.ts)
        const roundIdForSummary = currentRoundId.value

        if (memberId && isOnline.value) {
          await syncNow().catch(() => null)
        }

        let startTimeIso: string | null = null
        let endTimeIso = new Date().toISOString()
        if (memberId) {
          const ended = await endCurrentRound(memberId).catch(() => null)
          if (ended) {
            startTimeIso = ended.startTime || null
            endTimeIso = ended.endTime || endTimeIso
          }
        }

        saveRoundSummary({
          mode: 'online',
          startTime: startTimeIso,
          endTime: endTimeIso,
          stations: playedStations,
          totalPoint: null,
          roundId: roundIdForSummary,
          userId: memberId || profile.value?.uid || null,
          endedReason,
        })
      }
    } catch (err) {
      console.error('[forceEndRoundDueToTimeout] failed to build round summary', err)
    } finally {
      clearAllTimers()
      isForceEnding.value = false
      await navigateTo('/round-summary')
    }
  }

  return {
    isForceEnding: readonly(isForceEnding),
    forceEndRoundDueToTimeout,
  }
}
