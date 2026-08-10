<script setup lang="ts">
/**
 * components/OnlineSummaryCard.vue
 * ---------------------------------------------------------------------------
 * Card "สรุปการเล่นออนไลน์" — แสดงในหน้า Profile ใต้ Profile Card เดิม
 * (ดู pages/profile.vue) เป็น Presentational component ล้วน ๆ ไม่มี Logic/
 * เรียก API ของตัวเองเลย รับข้อมูลทั้งหมดผ่าน props (ฝั่ง pages/profile.vue
 * เป็นผู้ดึงข้อมูลจริงจาก server-gas ผ่าน composables/useMemberApi.ts +
 * composables/useRound.ts ที่มีอยู่แล้วเท่านั้น — ไม่มี Offline/LocalStorage
 * fallback ใด ๆ ในไฟล์นี้)
 *
 * ข้อมูลหลักมาจาก "Journey ของ Round ปัจจุบัน" เท่านั้น (กรอง roundId ฝั่งผู้เรียก
 * มาให้แล้ว) แสดงสถานะ 4 ฐานตายตัวตามสเปก: ข้าวโพด / วัว / ดิน / นม
 *
 * [Fix] เพิ่ม 3 อย่างตามสเปก Profile Card: ฐานปัจจุบัน (currentStationName),
 * เวลาเริ่ม Round (startTime), เวลาจบ Round (endTime) — รับมาเป็น props ล้วน ๆ
 * เหมือนเดิม (Presentational component ไม่มี logic/เรียก API เอง) ฝั่ง
 * pages/profile.vue เป็นผู้คำนวณ/ดึงข้อมูลจริงทั้งหมด ส่วน "point" เปลี่ยนความหมาย
 * จากคะแนนสะสมทั้งชีวิตเดิม เป็นคะแนนสะสม "ของ Round นี้เท่านั้น" ตามสเปก (ดู
 * pages/profile.vue::loadOnlineSummary สำหรับที่มาของค่าที่ส่งเข้ามา)
 */

export interface OnlineStationStatus {
  /** 'corn' | 'cow' | 'soil' | 'milk' — ดู useAdventure.ts StationType */
  type: string
  name: string
  done: boolean
}

const props = defineProps<{
  /** สถานะ Round ปัจจุบัน — null = ยังไม่มี Round เลย (เช่นเพิ่ง Login ครั้งแรก) */
  roundStatus: 'Started' | 'Ended' | null
  /** สถานะทั้ง 4 ฐาน เรียงลำดับตายตัว: ข้าวโพด -> วัว -> ดิน -> นม */
  stations: OnlineStationStatus[]
  /** ฐานล่าสุดที่ผ่านในรอบนี้ — null = ยังไม่ผ่านฐานไหนเลยในรอบนี้ */
  currentStationName: string | null
  /** คะแนนสะสม "ของ Round นี้" เท่านั้น — null = ยังไม่มี Round เลย/API ดึงไม่สำเร็จ (ซ่อนแถวนี้) */
  point: number | null
  /** เวลาเริ่ม Round (ISO string จาก server-gas) — null = ยังไม่มี Round เลย */
  startTime: string | null
  /** เวลาจบ Round — null = Round ยังไม่จบ/ยังไม่มี Round เลย */
  endTime: string | null
  loading: boolean
  /** ดึงข้อมูลครั้งล่าสุดไม่สำเร็จ (ออนไลน์แต่ API ล่ม) — ไม่ใช่ Offline Mode */
  error: boolean
}>()

const emit = defineEmits<{ refresh: [] }>()

const doneCount = computed(() => props.stations.filter((s) => s.done).length)
const totalCount = computed(() => props.stations.length)

const statusLabel = computed(() => {
  if (props.roundStatus === 'Ended') return 'จบเกม'
  if (props.roundStatus === 'Started') return 'กำลังเล่น'
  return 'ยังไม่เริ่มเล่น'
})

const statusColor = computed(() => (props.roundStatus === 'Ended' ? 'neutral' : 'success'))

/** แปลง ISO string จาก Backend เป็นรูปแบบวัน-เวลาไทยอ่านง่าย — คืนค่า '-' ถ้าไม่มี
 * ค่า/แปลงไม่ได้ (เช่นยังไม่จบ Round เลยไม่มี endTime) */
function formatDateTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('th-TH')
}
</script>

<template>
  <section class="online-summary-card">
    <div class="online-summary-card__header">
      <UIcon name="i-lucide-wifi" class="online-summary-card__icon" />
      <div>
        <p class="online-summary-card__title">สรุปการเล่นออนไลน์</p>
        <p class="online-summary-card__subtitle">{{ doneCount }} / {{ totalCount }} ฐาน</p>
      </div>
      <button
        type="button"
        class="online-summary-card__refresh"
        :disabled="props.loading"
        :aria-label="'รีเฟรชข้อมูลล่าสุด'"
        @click="emit('refresh')"
      >
        <UIcon
          name="i-lucide-refresh-cw"
          class="online-summary-card__refresh-icon"
          :class="{ 'online-summary-card__refresh-icon--spin': props.loading }"
        />
      </button>
    </div>

    <UBadge :color="statusColor" variant="subtle" size="md" class="online-summary-card__status">
      {{ statusLabel }}
    </UBadge>

    <ul class="online-summary-card__chips">
      <li
        v-for="station in props.stations"
        :key="station.type"
        class="online-summary-card__chip"
        :class="{ 'online-summary-card__chip--done': station.done }"
      >
        <span class="online-summary-card__chip-mark">{{ station.done ? '✓' : '○' }}</span>
        {{ station.name }}
      </li>
    </ul>

    <div class="online-summary-card__row">
      <span class="online-summary-card__label">ฐานปัจจุบัน</span>
      <span class="online-summary-card__value">{{ props.currentStationName ?? 'ยังไม่เริ่มเล่น' }}</span>
    </div>

    <div v-if="props.point !== null" class="online-summary-card__row">
      <span class="online-summary-card__label">คะแนนสะสม (รอบนี้)</span>
      <span class="online-summary-card__value">{{ props.point }}</span>
    </div>

    <div class="online-summary-card__row">
      <span class="online-summary-card__label">เวลาเริ่ม Round</span>
      <span class="online-summary-card__value">{{ formatDateTime(props.startTime) }}</span>
    </div>

    <div class="online-summary-card__row">
      <span class="online-summary-card__label">เวลาจบ Round</span>
      <span class="online-summary-card__value">{{ formatDateTime(props.endTime) }}</span>
    </div>

    <p v-if="props.error" class="online-summary-card__error">
      โหลดข้อมูลล่าสุดไม่สำเร็จ กดปุ่มรีเฟรชเพื่อลองใหม่
    </p>
  </section>
</template>

<style scoped>
.online-summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.online-summary-card__header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.online-summary-card__header > div {
  flex: 1;
  min-width: 0;
}

.online-summary-card__icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.online-summary-card__title {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0;
}

.online-summary-card__subtitle {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}

.online-summary-card__refresh {
  background: none;
  border: none;
  padding: 0.35rem;
  border-radius: 999px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-summary-card__refresh:disabled {
  cursor: default;
  opacity: 0.6;
}

.online-summary-card__refresh-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--farm-text-muted);
}

.online-summary-card__refresh-icon--spin {
  animation: online-summary-spin 0.9s linear infinite;
}

@keyframes online-summary-spin {
  to {
    transform: rotate(360deg);
  }
}

.online-summary-card__status {
  align-self: flex-start;
}

.online-summary-card__chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
}

.online-summary-card__chip {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.32rem 0.65rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  border: 1.5px solid var(--farm-wood);
  color: var(--farm-text-dark);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.online-summary-card__chip--done {
  background: var(--farm-grass);
  border-color: var(--farm-accent-dark);
  color: #fff;
}

.online-summary-card__chip-mark {
  font-weight: 800;
}

.online-summary-card__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.online-summary-card__label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--farm-text-muted);
  white-space: nowrap;
}

.online-summary-card__value {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.online-summary-card__error {
  font-size: 0.75rem;
  color: #a8442b;
  margin: 0;
}
</style>
