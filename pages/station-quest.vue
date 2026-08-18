<script setup lang="ts">
/**
 * pages/station-quest.vue
 * ---------------------------------------------------------------------------
 * Flow ใหม่ "ปลดล็อคฐาน + ภารกิจ" เวอร์ชัน Mockup (เน้น UX/UI + State ฝั่ง
 * Frontend ให้สมบูรณ์ก่อน — ยังไม่บันทึกคะแนน/เขียน Backend ใด ๆ) หน้านี้แยกขาด
 * จาก pages/scan.vue โดยตั้งใจ 100% (ห้ามแก้ไข/ใช้ปนกันตามสเปก "ห้ามรื้อระบบเดิม"
 * — Existing Scanner ของเดิมยังทำงานตามปกติทุกประการ ไม่ถูกแตะแม้แต่บรรทัดเดียว)
 * มีกล้องสแกน QR ของตัวเอง (คนละ instance/HTML id กับ scan.vue) + ระบบปลดล็อค/
 * ภารกิจของตัวเองทั้งหมด (ดู composables/useStationQuest.ts)
 *
 * กติกาสำคัญที่สุด: การสแกน QR ฐานที่นี่มีหน้าที่ "ปลดล็อค" (unlockStation)
 * เท่านั้น — "ห้าม" เรียก checkin/submitAnswer/toggleStation/queueCheckin หรือ
 * API ใด ๆ ที่ทำให้คะแนนจริงเปลี่ยนเด็ดขาด คะแนนทั้งหมดในหน้านี้เป็น mockScore
 * ฝั่งเครื่องอย่างเดียว (ทดลอง UI เท่านั้น) และไม่ใช้ station.points เป็นรางวัล
 * จากการสแกนเด็ดขาด (คะแนนเกิดจากตอบคำถามภารกิจถูกเท่านั้น)
 */
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode'
import { STATION_TYPE_META, type StationType } from '~/composables/useAdventure'
import type { MissionAnswerResult, MissionKind, MissionMockQuestion, StationCardStatus } from '~/types/stationMission'
import { getMissionQuestion } from '~/services/stationMissionMockData'
import StationUnlockModal from '~/components/station/StationUnlockModal.vue'
import StationMissionList from '~/components/station/StationMissionList.vue'
import StationMissionQuestion from '~/components/station/StationMissionQuestion.vue'
import StationMissionQr from '~/components/station/StationMissionQr.vue'

definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

const {
  mockScore,
  initStationQuest,
  stationStatus,
  getStationMissions,
  getMissionState,
  unlockStation,
  answerMission,
  completeQrMission,
} = useStationQuest()

/** 4 ฐานเสมอ เรียงตามสเปก: ข้าวโพด/วัว/ดิน/นม — ใช้ชื่อ/ไอคอนจาก STATION_TYPE_META
 * เดิมของโปรเจกต์ (composables/useAdventure.ts) ให้ตรงกับฐานจริงบนกระดานเกม
 * ภายหลังพร้อมเปลี่ยนมาใช้รายชื่อจาก listStations() ได้ทันที (แทนที่ตัวแปรนี้ด้วย
 * ผลลัพธ์ที่ map เป็นรูปแบบเดียวกัน — { id, name, icon } — โดยไม่ต้องแก้ Component
 * ใด ๆ เลย) */
const STATION_ORDER: StationType[] = ['corn', 'cow', 'soil', 'milk']
const STATION_LIST = STATION_ORDER.map((id) => ({
  id,
  name: STATION_TYPE_META[id].label,
  icon: STATION_TYPE_META[id].icon,
}))

const stationStatuses = computed<Record<StationType, StationCardStatus>>(() => {
  const map = {} as Record<StationType, StationCardStatus>
  for (const id of STATION_ORDER) map[id] = stationStatus(id)
  return map
})

// ---------------------------------------------------------------------------
// Popup orchestration — เลือกฐาน -> ลิสต์ภารกิจ -> ภารกิจย่อย (คำถาม/QR)
// ปิดป็อปอัพเดิมแล้ว nextTick() ก่อนเปิดป็อปอัพถัดไปเสมอ (กัน UModal ชนกันตอน
// Teleport/Focus-trap ปิด-เปิดพร้อมกัน — บั๊กเดิมที่เจอแล้วใน pages/scan.vue)
// ---------------------------------------------------------------------------
const unlockModalOpen = ref(false)
const missionListOpen = ref(false)
const questionPopupOpen = ref(false)
const qrPopupOpen = ref(false)
const activeStationId = ref<StationType | null>(null)
const activeMissionKind = ref<MissionKind | null>(null)

const isAnyPopupOpen = computed(
  () => unlockModalOpen.value || missionListOpen.value || questionPopupOpen.value || qrPopupOpen.value,
)

const activeStationMeta = computed(() =>
  activeStationId.value ? STATION_LIST.find((s) => s.id === activeStationId.value) ?? null : null,
)
const activeStationMissions = computed(() => (activeStationId.value ? getStationMissions(activeStationId.value) : null))
const activeQuestion = computed<MissionMockQuestion | null>(() => {
  if (!activeStationId.value) return null
  if (activeMissionKind.value !== 'smell' && activeMissionKind.value !== 'question') return null
  return getMissionQuestion(activeStationId.value, activeMissionKind.value) ?? null
})
const activeAnswer = computed<MissionAnswerResult | null>(() => {
  if (!activeStationId.value || activeMissionKind.value === null || activeMissionKind.value === 'qr') return null
  return getMissionState(activeStationId.value, activeMissionKind.value).answer
})
const activeQrCompleted = computed(() => (activeStationId.value ? getMissionState(activeStationId.value, 'qr').completed : false))

function openStationSelection(): void {
  scanFeedback.value = null
  unlockModalOpen.value = true
}

async function openMissionList(stationId: StationType): Promise<void> {
  activeStationId.value = stationId
  unlockModalOpen.value = false
  await nextTick()
  missionListOpen.value = true
}

async function openMission(kind: MissionKind): Promise<void> {
  activeMissionKind.value = kind
  missionListOpen.value = false
  await nextTick()
  if (kind === 'qr') qrPopupOpen.value = true
  else questionPopupOpen.value = true
}

async function backToMissionList(): Promise<void> {
  questionPopupOpen.value = false
  qrPopupOpen.value = false
  activeMissionKind.value = null
  await nextTick()
  missionListOpen.value = true
}

function handleAnswerSubmit(choiceId: string): void {
  if (!activeStationId.value || !activeQuestion.value) return
  answerMission(activeStationId.value, activeQuestion.value, choiceId)
}

function handleQrConfirm(): void {
  if (!activeStationId.value) return
  completeQrMission(activeStationId.value)
}

// ---------------------------------------------------------------------------
// กล้องสแกน QR ฐาน (instance/HTML id ของตัวเอง — ไม่แชร์อะไรกับ pages/scan.vue)
// ---------------------------------------------------------------------------
const QR_ELEMENT_ID = 'quest-qr-reader'
type ScanState = 'idle' | 'starting' | 'running' | 'error' | 'stopped'
const scanState = ref<ScanState>('idle')
const cameraErrorMessage = ref('')
let html5Qrcode: Html5QrcodeType | null = null
let Html5QrcodeCtor: typeof import('html5-qrcode').Html5Qrcode | null = null

const manualCode = ref('')
const lastScannedText = ref('')
const scanFeedback = ref<{ kind: 'success' | 'duplicate' | 'invalid'; text: string } | null>(null)
const isProcessingScan = ref(false)

/**
 * [Mockup] แปลงข้อความที่สแกน/กรอกมาเป็น stationId — ตอนนี้ map ในเครื่องก่อน
 * (รองรับรหัสสไตล์ CORN001/COW001/SOIL001/MILK001 แบบเดียวกับ pages/scan.vue
 * และพิมพ์ชื่อฐานตรง ๆ เช่น corn/cow/soil/milk) ภายหลังเปลี่ยนจุดนี้จุดเดียวให้
 * เรียก `await useMemberApi().verifyStationQr(qrToken)` แทนได้ทันที (จับคู่
 * ผลลัพธ์กลับเข้า StationType ด้วย backendId/type เหมือน
 * pages/scan.vue::processScannedStationQr) โดยไม่ต้องแก้ UI/Component อื่นเลย
 * สักไฟล์ — ดู handleStationQrScan() ด้านล่าง ซึ่งเป็นจุดเดียวที่เรียกฟังก์ชันนี้
 */
const QUEST_STATION_CODE_MAP: Record<string, StationType> = {
  CORN001: 'corn',
  COW001: 'cow',
  SOIL001: 'soil',
  MILK001: 'milk',
}

function resolveStationFromScannedText(raw: string): StationType | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const upper = trimmed.toUpperCase()
  if (QUEST_STATION_CODE_MAP[upper]) return QUEST_STATION_CODE_MAP[upper]
  const lower = trimmed.toLowerCase()
  if (STATION_ORDER.includes(lower as StationType)) return lower as StationType
  return null
}

async function handleStationQrScan(raw: string): Promise<void> {
  if (isProcessingScan.value || isAnyPopupOpen.value) return
  isProcessingScan.value = true
  try {
    const stationId = resolveStationFromScannedText(raw)
    if (!stationId) {
      scanFeedback.value = { kind: 'invalid', text: `ไม่พบฐานสำหรับรหัส "${raw}" กรุณาตรวจสอบอีกครั้ง` }
      return
    }

    const meta = STATION_TYPE_META[stationId]
    const isNewlyUnlocked = unlockStation(stationId)
    scanFeedback.value = isNewlyUnlocked
      ? { kind: 'success', text: `ปลดล็อค${meta.label}สำเร็จ!` }
      : { kind: 'duplicate', text: `${meta.label}ปลดล็อคอยู่แล้ว` }

    unlockModalOpen.value = true
  } finally {
    isProcessingScan.value = false
  }
}

function simulateScan(stationId: StationType): void {
  if (isProcessingScan.value || isAnyPopupOpen.value) return
  void handleStationQrScan(stationId.toUpperCase())
}

async function submitManualCode(): Promise<void> {
  if (!manualCode.value.trim() || isProcessingScan.value || isAnyPopupOpen.value) return
  await handleStationQrScan(manualCode.value)
  manualCode.value = ''
}

// ปิดป็อปอัพ "เลือกฐาน" แล้ว -> เคลียร์ผลสแกนเดิม พร้อมให้สแกนฐานถัดไปได้ทันที
watch(unlockModalOpen, (open) => {
  if (!open) {
    lastScannedText.value = ''
    scanFeedback.value = null
  }
})

async function startCamera(): Promise<void> {
  if (!Html5QrcodeCtor) return
  scanState.value = 'starting'
  cameraErrorMessage.value = ''
  try {
    if (!html5Qrcode) {
      html5Qrcode = new Html5QrcodeCtor(QR_ELEMENT_ID, { verbose: false })
    }
    await html5Qrcode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
      (decodedText) => {
        // html5-qrcode เรียก callback นี้ซ้ำทุกเฟรมตราบใดที่ QR ยังอยู่ในกล้อง —
        // เช็ค lastScannedText ก่อนกันประมวลผลรหัสเดิมซ้ำ ๆ (เคลียร์ตอนปิด
        // ป็อปอัพ "เลือกฐาน" ด้านบนแล้ว)
        if (lastScannedText.value || isAnyPopupOpen.value || isProcessingScan.value) return
        lastScannedText.value = decodedText
        void handleStationQrScan(decodedText)
      },
      () => {
        // ยังไม่เจอ QR ในเฟรมนี้ — ปกติ ไม่ต้องแจ้งเตือน
      },
    )
    scanState.value = 'running'
  } catch (err) {
    scanState.value = 'error'
    cameraErrorMessage.value = err instanceof Error ? err.message : 'ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง'
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

async function retryCamera(): Promise<void> {
  await startCamera()
}

onMounted(async () => {
  initStationQuest()

  const mod = await import('html5-qrcode')
  Html5QrcodeCtor = mod.Html5Qrcode
  await startCamera()
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
    <PageHeader title="ภารกิจฐาน" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="quest">
      <div class="quest__score">
        <UIcon name="i-lucide-sparkles" class="quest__score-icon" />
        <span>คะแนนทดลอง (Mockup): {{ mockScore }}</span>
      </div>

      <div
        class="quest__viewport"
        :class="{ 'quest__viewport--hidden': scanState !== 'running' && scanState !== 'starting' }"
      >
        <div :id="QR_ELEMENT_ID" class="quest__reader" />
      </div>

      <div v-if="scanState === 'starting'" class="quest__frame">
        <UIcon name="i-lucide-loader-2" class="quest__icon quest__icon--spin" />
        <p class="quest__title">กำลังเปิดกล้อง...</p>
      </div>

      <div v-else-if="scanState === 'error'" class="quest__frame">
        <UIcon name="i-lucide-camera-off" class="quest__icon" />
        <p class="quest__title">เปิดกล้องไม่สำเร็จ</p>
        <p class="quest__desc">{{ cameraErrorMessage }}</p>
        <UButton color="primary" icon="i-lucide-rotate-cw" @click="retryCamera">ลองใหม่อีกครั้ง</UButton>
      </div>

      <div v-else-if="scanState === 'stopped'" class="quest__frame">
        <UIcon name="i-lucide-scan-line" class="quest__icon" />
        <p class="quest__title">ปิดกล้องแล้ว</p>
        <UButton color="primary" icon="i-lucide-camera" @click="retryCamera">เปิดกล้อง</UButton>
      </div>

      <template v-else>
        <p class="quest__title">วางกล้องให้ตรง QR Code ของฐาน</p>
        <p class="quest__desc">สแกน QR เพื่อปลดล็อคฐาน แล้วเลือกทำภารกิจได้ทันที</p>
      </template>

      <div v-if="scanFeedback" class="quest__result">
        <UIcon
          :name="
            scanFeedback.kind === 'success'
              ? 'i-lucide-badge-check'
              : scanFeedback.kind === 'duplicate'
                ? 'i-lucide-info'
                : 'i-lucide-triangle-alert'
          "
          class="quest__result-icon"
        />
        <p class="quest__result-text">{{ scanFeedback.text }}</p>
      </div>

      <section class="quest__simulate">
        <p class="quest__simulate-title">จำลองสแกน (สำหรับทดสอบ)</p>
        <div class="quest__simulate-grid">
          <button
            v-for="s in STATION_LIST"
            :key="s.id"
            type="button"
            class="quest__simulate-btn"
            @click="simulateScan(s.id)"
          >
            <span>{{ s.icon }}</span>
            <span>{{ s.name }}</span>
          </button>
        </div>
        <form class="manual-code" @submit.prevent="submitManualCode">
          <UInput
            v-model="manualCode"
            placeholder="หรือกรอกรหัสฐาน เช่น CORN001"
            size="lg"
            class="manual-code__input"
          />
          <UButton type="submit" color="primary" size="lg" :disabled="!manualCode.trim()">ยืนยัน</UButton>
        </form>
      </section>

      <UButton block variant="soft" color="primary" icon="i-lucide-layout-grid" @click="openStationSelection">
        ดูฐานทั้งหมด
      </UButton>
    </div>

    <!--
      [Fix] v-if บน "ทุก" popup ต่อไปนี้ (ผูกกับตัวแปร open ของมันเองโดยตรง หรือ
      ร่วมกับข้อมูลที่ต้องใช้) ไม่ใช่แค่ควบคุมด้วย :open เฉย ๆ — เหตุผล: UModal
      ทุกตัว Teleport เนื้อหาไปแปะไว้ที่ตำแหน่งเดิมใน DOM ตั้งแต่ครั้งแรกที่ mount
      (ปิด/เปิดซ้ำด้วย :open เฉย ๆ ไม่ทำให้ตำแหน่งใน DOM ขยับ) เมื่อไม่มีตัวไหนมี
      z-index สูงกว่ากันเลย (ทุกตัว "auto") การ์ดที่ "mount ล่าสุด" จะวาดทับอยู่บนสุด
      เสมอไม่ว่าจะเปิดหรือปิดอยู่ก็ตาม — เจอบั๊กจริงตอนทดสอบ: ปิด "เลือกฐาน" +
      เปิด "ภารกิจฐาน" ตามด้วยเปิดป็อปอัพ QR ภารกิจ แล้วปุ่ม "จำลองการสแกนสำเร็จ"
      กดไม่ติดเลย เพราะพื้นหลัง (backdrop) ที่ "ปิดไปแล้ว" ของป็อปอัพ "ภารกิจฐาน"
      (mount ทีหลังสุดตอนนั้น) บังทับปุ่มอยู่ (ตรวจสอบด้วย document.elementsFromPoint
      เจอ backdrop data-state="closed" ทับอยู่บนสุดจริง) — v-if บังคับ unmount
      จริงทุกครั้งที่ปิด ทำให้เปิดครั้งถัดไป Teleport ใหม่ไปต่อท้ายสุดเสมอ (mount
      ล่าสุด = อยู่บนสุดจริง) เหมือน StationMissionQuestion ที่ v-if="activeQuestion"
      อยู่แล้วแต่แรกและไม่เคยเจอปัญหานี้เลย
    -->
    <StationUnlockModal
      v-if="unlockModalOpen"
      v-model:open="unlockModalOpen"
      :stations="STATION_LIST"
      :statuses="stationStatuses"
      @select="openMissionList"
    />

    <StationMissionList
      v-if="missionListOpen && activeStationMissions"
      v-model:open="missionListOpen"
      :station="activeStationMeta"
      :missions="activeStationMissions"
      @open-mission="openMission"
    />

    <StationMissionQuestion
      v-if="activeQuestion"
      v-model:open="questionPopupOpen"
      :question="activeQuestion"
      :answer="activeAnswer"
      @submit="handleAnswerSubmit"
      @close="backToMissionList"
    />

    <StationMissionQr
      v-if="qrPopupOpen"
      v-model:open="qrPopupOpen"
      :completed="activeQrCompleted"
      @confirm="handleQrConfirm"
      @close="backToMissionList"
    />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page__spinner {
  width: 2.5rem;
  height: 2.5rem;
  animation: quest-spin 1s linear infinite;
  color: var(--farm-accent-dark);
}

.quest {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  padding: 1.25rem 1rem 2rem;
  text-align: center;
}

.quest__score {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  border: 1.5px solid var(--farm-wood);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
}

.quest__score-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.quest__viewport {
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 1;
  border-radius: 1rem;
  overflow: hidden;
  border: 3px solid var(--farm-wood);
  background: #000;
}

.quest__viewport--hidden {
  display: none;
}

.quest__reader {
  width: 100%;
  height: 100%;
}

.quest__frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.5rem 1rem;
}

.quest__icon {
  width: 3rem;
  height: 3rem;
  color: var(--farm-accent-dark);
}

.quest__icon--spin {
  animation: quest-spin 1s linear infinite;
}

.quest__title {
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.25rem 0 0;
}

.quest__desc {
  font-size: 0.8rem;
  color: var(--farm-text-muted);
  margin: 0;
  max-width: 22rem;
}

.quest__result {
  width: 100%;
  max-width: 20rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-accent);
}

.quest__result-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.quest__result-text {
  margin: 0;
  font-size: 0.82rem;
  color: var(--farm-text-dark);
  text-align: left;
}

.quest__simulate {
  width: 100%;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.85rem;
  border-radius: 1rem;
  background: var(--farm-cream);
  border: 1.5px dashed var(--farm-wood);
}

.quest__simulate-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--farm-text-muted);
}

.quest__simulate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.quest__simulate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 0.4rem;
  border-radius: 0.75rem;
  border: 2px solid var(--farm-wood);
  background: var(--farm-cream-dark);
  color: var(--farm-text-dark);
  font-size: 0.78rem;
  font-weight: 700;
}

.manual-code {
  display: flex;
  gap: 0.5rem;
}

.manual-code__input {
  flex: 1;
  min-width: 0;
}

@keyframes quest-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
