<script setup lang="ts">
/**
 * pages/profile.vue
 * ---------------------------------------------------------------------------
 * เมนู Profile — แสดงรายละเอียดสมาชิกแบบเต็ม (ย้ายมาจากการ์ด Home เดิม)
 * + ปุ่มเชื่อมบัญชี LINE (เฉพาะ Guest) และปุ่มรีเซ็ตข้อมูลไว้ทดสอบ
 */

import { STATION_TYPE_META, type StationType } from '~/composables/useAdventure'

definePageMeta({ layout: 'app' })

const { profile, isReady } = useRequireProfile()
const { isAnonymous, loginWithLine, resetAuth, logoutLine } = useAuth()
const { resetProfile } = useProfile()
const { stations } = useAdventure()

// Offline Mode (ใหม่): ห้ามแสดงคะแนน (ซ่อน stat-box คะแนนสะสมด้านล่าง) +
// แสดง Card สรุปการเล่นแบบออฟไลน์ (ข้อ 11) ใต้ Profile Card — โหลดข้อมูลรอบ
// การเล่นล่าสุดจาก LocalStorage ตรงนี้เสมอ (ไม่ใช่แค่ตอน Session ปัจจุบันถูก
// ล็อก Offline Mode) เพื่อให้เห็นประวัติรอบก่อนหน้าด้วยแม้ตอนนี้จะกลับมามีเน็ต
// แล้วก็ตาม (ข้อมูลอยู่ใน LocalStorage ถาวรอยู่แล้ว)
const { isOfflineMode, roundData, loadRoundData } = useOfflineMode()
onMounted(() => {
  loadRoundData()
})

/** รายชื่อฐานที่เล่นแล้ว เรียงตามลำดับที่สแกนสำเร็จจริง (ข้อ 8: ลำดับฐาน) */
const playedStationNames = computed(() => {
  if (!roundData.value) return []
  return [...roundData.value.stations]
    .sort((a, b) => a.order - b.order)
    .map((s) => s.stationName)
})

/** รายชื่อฐานที่เหลือ (ยังไม่ได้สแกนใน Log ของรอบ Offline Mode นี้) */
const remainingStationNames = computed(() => {
  if (!roundData.value) return []
  const playedIds = new Set(roundData.value.stations.map((s) => s.stationId))
  return stations.value.filter((s) => !playedIds.has(s.id)).map((s) => s.name)
})

/**
 * Online Game Summary Card (ใหม่) — สรุปการเล่นแบบ "ออนไลน์" ใต้ Profile Card
 * reuse API/Service เดิมทั้งหมดผ่าน useMemberApi() (getRound/getJourney/getScore)
 * ไม่แตะ Map/QR/Journey(useJourney.ts)/Round(useRound.ts) หรือ Offline Mode เลย
 * ห้ามใช้ข้อมูล Offline (roundData/OfflineSummaryCard ด้านบน) มาแสดงในการ์ดนี้
 * เด็ดขาดตามสเปก — ข้อมูลหลักคือ "Journey ของ Round ปัจจุบัน" (กรองด้วย roundId
 * ที่ได้จาก getRound() สด ๆ ทุกครั้งที่โหลด ไม่ใช่แค่ currentRoundId ในหน่วยความจำ
 * ของ useRound() เพราะอยากได้ Status ล่าสุดจริงจาก Sheet เสมอ)
 */
const { getRound, getJourney, getScore } = useMemberApi()

/** ลำดับ+ชื่อฐานตายตัวตามสเปก (ข้าวโพด -> วัว -> ดิน -> นม) — ดึงชื่อจริงจาก
 * useAdventure().stations (ผูกกับชีต "Stations" ผ่าน listStations() อยู่แล้ว)
 * เพื่อไม่สร้างรายชื่อฐานซ้ำอีกชุด ถ้าหาไม่เจอ (ยังไม่ได้ initAdventure()) ค่อย
 * fallback ไปใช้ label ใน STATION_TYPE_META */
const ONLINE_STATION_TYPES: StationType[] = ['corn', 'cow', 'soil', 'milk']

const onlineRoundStatus = ref<'Started' | 'Ended' | null>(null)
const onlineDoneStationIds = ref<Set<string>>(new Set())
const onlinePoint = ref<number | null>(null)
const onlineSummaryLoading = ref(false)
const onlineSummaryError = ref(false)
const onlineSummaryLoaded = ref(false)

const onlineStations = computed(() =>
  ONLINE_STATION_TYPES.map((type) => {
    const adminStation = stations.value.find((s) => s.type === type)
    return {
      type,
      name: adminStation?.name || STATION_TYPE_META[type].label,
      done: onlineDoneStationIds.value.has(adminStation?.id ?? type),
    }
  }),
)

/** ดึงข้อมูล Online Summary ล่าสุดจาก server-gas — เรียกได้ซ้ำได้เสมอ (ปุ่มรีเฟรช
 * ในการ์ด + เรียกอัตโนมัติทุกครั้งที่หน้า Profile mount/กลับมา active หลัง Scan) */
async function loadOnlineSummary(): Promise<void> {
  const memberId = profile.value?.memberId
  if (!memberId || isOfflineMode.value) return

  onlineSummaryLoading.value = true
  onlineSummaryError.value = false
  try {
    const roundRes = await getRound(memberId)
    if (!roundRes.success) throw new Error(roundRes.error || 'getRound failed')

    const round = roundRes.round ?? null
    onlineRoundStatus.value = round ? (round.status === 'Ended' ? 'Ended' : 'Started') : null

    if (!round) {
      onlineDoneStationIds.value = new Set()
    } else {
      const journeyRes = await getJourney(memberId)
      if (journeyRes.success && journeyRes.journey) {
        onlineDoneStationIds.value = new Set(
          journeyRes.journey
            .filter((entry) => entry.roundId === round.roundId)
            .map((entry) => entry.stationId),
        )
      } else {
        onlineDoneStationIds.value = new Set()
      }
    }

    const scoreRes = await getScore(memberId)
    onlinePoint.value = scoreRes.success && scoreRes.score ? scoreRes.score.totalPoint : null

    onlineSummaryLoaded.value = true
  } catch {
    onlineSummaryError.value = true
  } finally {
    onlineSummaryLoading.value = false
  }
}

// โหลดครั้งแรกทันทีที่ Profile พร้อม (isReady มาจาก useRequireProfile ด้านบน) —
// ใช้ watch แทน onMounted ตรง ๆ เพราะ isReady เป็น async (ต้องรอ initProfile()/
// guard เสร็จก่อนถึงจะรู้ memberId จริง) + คอยรีเฟรชอัตโนมัติทุกครั้งที่กลับมา
// หน้า Profile (เช่นสแกนฐานเสร็จแล้วกดกลับมาดู) ผ่าน visibilitychange
watch(isReady, (ready) => {
  if (ready) void loadOnlineSummary()
})

function handleVisibilityChange(): void {
  if (document.visibilityState === 'visible' && isReady.value) {
    void loadOnlineSummary()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

/**
 * รีเซ็ตข้อมูลทดสอบแบบเต็มรูปแบบ:
 * 1) Logout LINE (LIFF session) จริง ๆ ก่อนเสมอ — ต้องทำก่อนเคลียร์ storage เพราะ
 *    ใช้ LIFF SDK เช็ค session ปัจจุบัน (ไม่งั้นรอบหน้า initAuth() จะ auto-login
 *    ซ้ำจาก session เดิมทันที ไม่เห็นหน้า Welcome จริง ๆ)
 * 2) resetProfile()/resetAuth() — ล้าง state ในหน่วยความจำ (useState) ให้ null ทันที
 * 3) ล้าง LocalStorage + SessionStorage ทั้งหมด (กันเหนียวเผื่อมี key อื่นค้างอยู่
 *    เช่น ข้อมูลฐาน/checkpoint ที่เก็บแยกไว้) — ไม่มีการเรียก API ไป Google Sheet
 *    เลยในขั้นตอนนี้ จึงไม่มีทางสร้างข้อมูลใหม่ในชีตจากการกดปุ่มนี้
 * 4) Redirect ไปหน้า index — initAuth()/initProfile() จะรันใหม่ทั้งหมดแล้วเจอว่า
 *    ไม่มีทั้ง authData และ LIFF session ค้างอยู่เลย จึงแสดงหน้า Welcome เหมือน
 *    เปิดระบบครั้งแรกจริง ๆ
 */
async function handleResetForTesting() {
  await logoutLine()
  resetProfile()
  resetAuth()
  if (import.meta.client) {
    localStorage.clear()
    sessionStorage.clear()
  }
  await navigateTo('/')
}
</script>

<template>
  <div class="profile-page">
    <PageHeader title="โปรไฟล์" />

    <div v-if="!isReady" class="profile-loading">
      <UIcon name="i-lucide-loader-2" class="profile-loading__spinner" />
    </div>

    <div v-else class="profile-content">
      <div class="profile-hero">
        <UAvatar
          v-if="profile?.pictureUrl"
          :src="profile.pictureUrl"
          size="3xl"
          class="profile-hero__avatar"
        />
        <div v-else class="profile-hero__avatar-fallback">
          <UIcon name="i-lucide-user-round" class="profile-hero__avatar-icon" />
        </div>
        <h2 class="profile-hero__name">{{ profile?.firstName }} {{ profile?.lastName }}</h2>
        <UBadge color="success" variant="subtle" size="md">
          <UIcon name="i-lucide-check-circle-2" class="profile-hero__badge-icon" />
          Registered
        </UBadge>
      </div>

      <div class="stat-row">
        <div v-if="!isOfflineMode" class="stat-box">
          <span class="stat-box__value">{{ profile?.point ?? 0 }}</span>
          <span class="stat-box__label">คะแนนสะสม</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__value">{{ profile?.totalVisit ?? 0 }}</span>
          <span class="stat-box__label">ครั้งที่ใช้บริการ</span>
        </div>
      </div>

      <div class="info-box">
        <div class="info-box__row">
          <span class="info-box__label">ชื่อ-นามสกุล</span>
          <span class="info-box__value">{{ profile?.firstName }} {{ profile?.lastName }}</span>
        </div>
        <div class="info-box__row">
          <span class="info-box__label">เบอร์โทรศัพท์</span>
          <span class="info-box__value">{{ profile?.phone }}</span>
        </div>
        <div class="info-box__row">
          <span class="info-box__label">เพศ</span>
          <span class="info-box__value">{{ GENDER_OPTIONS.find(g => g.value === profile?.gender)?.label ?? '-' }}</span>
        </div>
        <div class="info-box__row">
          <span class="info-box__label">ช่วงปีเกิด</span>
          <span class="info-box__value">{{ profile?.birthYearRange || '-' }}</span>
        </div>
        <div class="info-box__row">
          <span class="info-box__label">เข้าใช้งานด้วย</span>
          <span class="info-box__value">{{ profile?.loginType === 'line' ? 'LINE' : 'Guest' }}</span>
        </div>
        <div v-if="profile?.memberId" class="info-box__row">
          <span class="info-box__label">Member ID</span>
          <code class="info-box__value info-box__value--mono">{{ profile.memberId }}</code>
        </div>
        <div v-if="profile?.registerDate" class="info-box__row">
          <span class="info-box__label">วันที่สมัคร</span>
          <span class="info-box__value">{{ new Date(profile.registerDate).toLocaleDateString('th-TH') }}</span>
        </div>
        <div v-if="profile?.lastLogin" class="info-box__row">
          <span class="info-box__label">เข้าใช้งานล่าสุด</span>
          <span class="info-box__value">{{ new Date(profile.lastLogin).toLocaleString('th-TH') }}</span>
        </div>
      </div>

      <!-- Online Game Summary Card (ใหม่) — แสดงเฉพาะตอนไม่ได้อยู่ใน Offline Mode
           เท่านั้น (ห้ามใช้ Offline data แทน Online data ตามสเปก) ข้อมูลหลักคือ
           Journey ของ Round ปัจจุบัน ดึงสด ๆ จาก server-gas ทุกครั้งที่หน้านี้
           mount/กลับมา active หรือกดปุ่มรีเฟรชในการ์ด -->
      <OnlineSummaryCard
        v-if="!isOfflineMode"
        :round-status="onlineRoundStatus"
        :stations="onlineStations"
        :point="onlinePoint"
        :loading="onlineSummaryLoading"
        :error="onlineSummaryError"
        @refresh="loadOnlineSummary"
      />

      <!-- Offline Mode (ใหม่, ข้อ 11): Card สรุปการเล่นแบบออฟไลน์ ใต้ Profile Card
           เดิม — แสดงเฉพาะตอนมีข้อมูลรอบ Offline Mode อยู่จริงใน LocalStorage
           เท่านั้น (ไม่กระทบ UI ผู้เล่นที่ไม่เคยเล่นแบบออฟไลน์เลย) -->
      <OfflineSummaryCard
        v-if="roundData"
        :uid="roundData.uid"
        :started-at="roundData.startedAt"
        :ended-at="roundData.endedAt"
        :played-station-names="playedStationNames"
        :remaining-station-names="remainingStationNames"
      />

      <UButton
        v-if="isAnonymous"
        block
        size="lg"
        color="success"
        class="line-link-button"
        @click="loginWithLine"
      >
        <template #leading>
          <UIcon name="i-simple-icons-line" />
        </template>
        เชื่อมบัญชี LINE
      </UButton>

      <button type="button" class="reset-link" @click="handleResetForTesting">
        รีเซ็ตข้อมูล (ทดสอบ)
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
}

.profile-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.profile-loading__spinner {
  width: 2rem;
  height: 2rem;
  color: var(--farm-accent-dark);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 1.1rem 1rem;
}

.profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.profile-hero__avatar {
  border: 3px solid var(--farm-accent);
}

.profile-hero__avatar-fallback {
  width: 5rem;
  height: 5rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  border: 3px solid var(--farm-cream);
}

.profile-hero__avatar-icon {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--farm-cream);
}

.profile-hero__name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0;
}

.profile-hero__badge-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.2rem;
}

.stat-row {
  display: flex;
  gap: 0.75rem;
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.85rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.stat-box__value {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.stat-box__label {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
}

.info-box {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.info-box__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.info-box__label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--farm-text-muted);
  white-space: nowrap;
}

.info-box__value {
  font-size: 0.85rem;
  color: var(--farm-text-dark);
  text-align: right;
}

.info-box__value--mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.75rem;
  word-break: break-all;
}

.line-link-button {
  font-weight: 600;
}

.reset-link {
  background: none;
  border: none;
  font-size: 0.78rem;
  color: var(--farm-text-muted);
  text-decoration: underline;
  cursor: pointer;
  align-self: center;
}
</style>
