<script setup lang="ts">
/**
 * pages/profile.vue
 * ---------------------------------------------------------------------------
 * เมนู Profile — แสดงรายละเอียดสมาชิกแบบเต็ม (ย้ายมาจากการ์ด Home เดิม)
 * + ปุ่มเชื่อมบัญชี LINE (เฉพาะ Guest) และปุ่มรีเซ็ตข้อมูลไว้ทดสอบ
 */

import { STATION_TYPE_META, type StationType } from '~/composables/useAdventure'
import type { Gender } from '~/types/profile'

definePageMeta({ layout: 'app' })

const { profile, isReady } = useRequireProfile()
const { isAnonymous, loginWithLine, resetAuth, logoutLine } = useAuth()
const { resetProfile, updateEditableFields } = useProfile()
const { updateMember } = useMemberApi()
const { stations } = useAdventure()

/**
 * แก้ไขข้อมูลโปรไฟล์ (ข้อ Profile ใหม่): ชื่อ/นามสกุล/เบอร์โทร/เพศ/ช่วงปีเกิด — 5 รายการ
 * (ไม่แตะ UID/Point/Round/Journey เลย)
 * ใช้ "โหมดแก้ไข" เดียวคุมทั้ง 5 ฟิลด์พร้อมกัน (กดดินสอที่ชื่อ -> ชื่อ/นามสกุล/เบอร์โทร
 * กลายเป็น input, เพศ/ช่วงปีเกิดกลายเป็น Dropdown) แล้วกดปุ่ม "บันทึก"/"ยกเลิก"
 * ทีเดียวตามสเปก ("มีปุ่มบันทึกและยกเลิก ตอนอยู่ในโหมดแก้ไข")
 *
 * ส่งไปอัปเดตผ่าน action 'updateMember' เดิม (composables/useMemberApi.ts) ด้วย
 * memberId ของสมาชิกเดิมเท่านั้น — ฝั่ง server-gas (actionUpdateMember_) การันตี
 * "ห้ามสร้างแถวใหม่" อยู่แล้ว (หาแถวไม่เจอ -> คืน error ทันที ไม่ appendRow)
 *
 * เบอร์โทร: validate ด้วย regex เดียวกับตอนสมัคร (profileSchema.shape.phone ใน
 * utils/profileSchema.ts) เก็บเป็น string เสมอ (ไม่แปลงเป็นตัวเลข) เพื่อไม่ให้เลข 0
 * นำหน้าหาย — ฝั่ง server-gas ก็บังคับ format คอลัมน์ Phone Number เป็น Plain Text
 * ไว้แล้วเช่นกัน (ดู ensurePhoneColumnIsText_ ใน server-gas/Code.gs) กันชีตแปลงเป็น
 * ตัวเลขเองตอนบันทึก
 */
const ageRangeOptions = getAgeRangeOptions()

const isEditingProfile = ref(false)
const editFirstName = ref('')
const editLastName = ref('')
const editPhone = ref('')
const editGender = ref<Gender | undefined>(undefined)
/** ปีเกิดตัวแทน (ตรงกับ value ใน ageRangeOptions) — ไม่ใช่ birthYearRange ตรง ๆ
 * เพราะ USelectMenu ต้องผูกกับ value ที่เป็นตัวเลขเดียวไม่ซ้ำกันของแต่ละตัวเลือก */
const editBirthYearValue = ref<number | undefined>(undefined)
const editSubmitting = ref(false)
const editError = ref('')

/** หา value (ปีเกิดตัวแทน) ของ ageRangeOptions ที่ rangeValue ตรงกับ birthYearRange
 * ปัจจุบันของโปรไฟล์ — ใช้ pre-select ตัวเลือกเดิมตอนเปิดโหมดแก้ไข */
function findAgeRangeValueForRange(rangeValue?: string): number | undefined {
  if (!rangeValue) return undefined
  return ageRangeOptions.find((option) => option.rangeValue === rangeValue)?.value
}

function startEditProfile(): void {
  editFirstName.value = profile.value?.firstName ?? ''
  editLastName.value = profile.value?.lastName ?? ''
  editPhone.value = profile.value?.phone ?? ''
  editGender.value = profile.value?.gender
  editBirthYearValue.value = findAgeRangeValueForRange(profile.value?.birthYearRange)
  editError.value = ''
  isEditingProfile.value = true
}

/** ยกเลิกโหมดแก้ไข — ไม่มีการเรียก API ใด ๆ ทั้งสิ้น โปรไฟล์กลับไปแสดงค่าเดิมทันที */
function cancelEditProfile(): void {
  isEditingProfile.value = false
  editError.value = ''
}

async function saveEditProfile(): Promise<void> {
  const memberId = profile.value?.memberId
  if (!memberId) {
    editError.value = 'ไม่พบ Member ID ของสมาชิก กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง'
    return
  }

  const firstName = editFirstName.value.trim()
  const lastName = editLastName.value.trim()
  const phone = editPhone.value.trim()

  if (firstName.length < 2) {
    editError.value = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'
    return
  }
  if (lastName.length < 2) {
    editError.value = 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'
    return
  }
  // ใช้ regex เดียวกับตอนสมัคร (utils/profileSchema.ts) เก็บ/ส่งเป็น string เสมอ
  const phoneCheck = profileSchema.shape.phone.safeParse(phone)
  if (!phoneCheck.success) {
    editError.value = phoneCheck.error.issues[0]?.message || 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
    return
  }
  if (!editGender.value) {
    editError.value = 'กรุณาเลือกเพศ'
    return
  }
  if (!editBirthYearValue.value) {
    editError.value = 'กรุณาเลือกช่วงปีเกิด'
    return
  }

  editSubmitting.value = true
  editError.value = ''
  try {
    // ใช้ action 'updateMember' เดิมของระบบ Member — ระบุ memberId ตรง ๆ เท่านั้น
    // เพื่อให้อัปเดต "แถวเดิม" ใน Google Sheet (ไม่มีทางสร้างแถวใหม่)
    const result = await updateMember(memberId, {
      firstName,
      lastName,
      phone: phoneCheck.data,
      gender: editGender.value,
      birthYear: birthYearRangeValueFor(editBirthYearValue.value),
    })

    if (!result.success || !result.member) {
      editError.value = result.error || 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      return
    }

    // อัปเดต profile state + LocalStorage ทันที (ไม่ต้อง reload) -> หน้า Home
    // เห็นชื่อใหม่ทันทีเพราะ useState เป็น global reactive state ตัวเดียวกัน
    updateEditableFields(result.member)
    isEditingProfile.value = false
  } catch (err) {
    editError.value = err instanceof Error ? err.message : 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
  } finally {
    editSubmitting.value = false
  }
}

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
 * reuse API/Service เดิมทั้งหมดผ่าน useMemberApi() (getRound/getJourney) — [Fix]
 * ไม่ใช้ getScore() (คะแนนสะสมทั้งชีวิต) แล้ว เพราะสเปก Profile Card ต้องการ
 * "คะแนนสะสมของ Round" เท่านั้น ซึ่งคำนวณจาก Journey ที่กรอง roundId ด้านล่างได้
 * อยู่แล้วโดยไม่ต้องยิง API เพิ่ม ไม่แตะ Map/QR/Journey(useJourney.ts)/Round(useRound.ts) หรือ Offline Mode เลย
 * ห้ามใช้ข้อมูล Offline (roundData/OfflineSummaryCard ด้านบน) มาแสดงในการ์ดนี้
 * เด็ดขาดตามสเปก — ข้อมูลหลักคือ "Journey ของ Round ปัจจุบัน" (กรองด้วย roundId
 * ที่ได้จาก getRound() สด ๆ ทุกครั้งที่โหลด ไม่ใช่แค่ currentRoundId ในหน่วยความจำ
 * ของ useRound() เพราะอยากได้ Status ล่าสุดจริงจาก Sheet เสมอ)
 */
const { getRound, getJourney } = useMemberApi()

/** ลำดับ+ชื่อฐานตายตัวตามสเปก (ข้าวโพด -> วัว -> ดิน -> นม) — ดึงชื่อจริงจาก
 * useAdventure().stations (ผูกกับชีต "Stations" ผ่าน listStations() อยู่แล้ว)
 * เพื่อไม่สร้างรายชื่อฐานซ้ำอีกชุด ถ้าหาไม่เจอ (ยังไม่ได้ initAdventure()) ค่อย
 * fallback ไปใช้ label ใน STATION_TYPE_META */
const ONLINE_STATION_TYPES: StationType[] = ['corn', 'cow', 'soil', 'milk']

const onlineRoundStatus = ref<'Started' | 'Ended' | null>(null)
const onlineDoneStationIds = ref<Set<string>>(new Set())
// [Fix] เปลี่ยนจากคะแนนสะสม "ทั้งชีวิต" (เดิมดึงจาก getScore()/ชีต Score ซึ่งรวม
// ทุก Round ที่เคยเล่นมา) เป็นคะแนนสะสม "ของ Round ปัจจุบันเท่านั้น" ตามสเปก Profile
// Card — คำนวณจากผลรวม Point ของ Journey ที่กรอง roundId ตรงกับ Round ปัจจุบันแล้ว
// (ข้อมูลเดียวกับที่ใช้นับ onlineDoneStationIds ด้านล่าง ไม่ต้องยิง API เพิ่ม)
const onlineRoundScore = ref<number | null>(null)
/** ฐานล่าสุดที่สแกนผ่านในรอบปัจจุบัน (เรียงตาม Timestamp) — null = ยังไม่ผ่านฐานไหนเลย */
const onlineCurrentStationName = ref<string | null>(null)
/** เวลาเริ่ม/จบ Round ปัจจุบัน — มาจาก RoundEntry.startTime/endTime ตรง ๆ (ของเดิมที่
 * server-gas ส่งมาอยู่แล้วทุกครั้ง แค่ไม่เคยถูกนำมาแสดงผลในหน้านี้) */
const onlineRoundStartTime = ref<string | null>(null)
const onlineRoundEndTime = ref<string | null>(null)
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
    onlineRoundStartTime.value = round?.startTime ?? null
    onlineRoundEndTime.value = round?.endTime ?? null

    if (!round) {
      onlineDoneStationIds.value = new Set()
      onlineRoundScore.value = null
      onlineCurrentStationName.value = null
    } else {
      const journeyRes = await getJourney(memberId)
      if (journeyRes.success && journeyRes.journey) {
        // Journey เฉพาะของ "Round ปัจจุบัน" นี้เท่านั้น (roundId ตรงกัน) — Journey/
        // Round เก่าของรอบก่อน ๆ ยังอยู่ครบใน Database เหมือนเดิมทุกประการ แค่ไม่ถูก
        // นำมาปนกับการ์ดของรอบนี้ (ดู composables/useAdventure.ts::refreshFromBackend
        // ที่แก้ไขจุดเดียวกันแบบเดียวกัน)
        const roundJourney = journeyRes.journey.filter((entry) => entry.roundId === round.roundId)

        onlineDoneStationIds.value = new Set(roundJourney.map((entry) => entry.stationId))

        // คะแนนสะสม "ของ Round นี้" = ผลรวม Point ของ Journey ที่กรองไว้ด้านบน
        onlineRoundScore.value = roundJourney.reduce((sum, entry) => sum + (Number(entry.point) || 0), 0)

        // ฐานปัจจุบัน = ฐานล่าสุดที่สแกนผ่าน (Timestamp มากที่สุด) ในรอบนี้
        const latestEntry = [...roundJourney].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ).at(-1)
        onlineCurrentStationName.value = latestEntry?.stationName ?? null
      } else {
        onlineDoneStationIds.value = new Set()
        onlineRoundScore.value = 0
        onlineCurrentStationName.value = null
      }
    }

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
          <span class="info-box__label">ชื่อ</span>
          <div class="info-box__value-wrap">
            <span v-if="!isEditingProfile" class="info-box__value">{{ profile?.firstName }}</span>
            <UInput
              v-else
              v-model="editFirstName"
              size="sm"
              placeholder="ชื่อ"
              class="info-box__input"
            />
            <button
              v-if="!isEditingProfile"
              type="button"
              class="info-box__edit-btn"
              aria-label="แก้ไขข้อมูลโปรไฟล์"
              @click="startEditProfile"
            >
              <UIcon name="i-lucide-pencil" class="info-box__edit-icon" />
            </button>
          </div>
        </div>

        <div class="info-box__row">
          <span class="info-box__label">นามสกุล</span>
          <div class="info-box__value-wrap">
            <span v-if="!isEditingProfile" class="info-box__value">{{ profile?.lastName }}</span>
            <UInput
              v-else
              v-model="editLastName"
              size="sm"
              placeholder="นามสกุล"
              class="info-box__input"
            />
          </div>
        </div>

        <div class="info-box__row">
          <span class="info-box__label">เบอร์โทรศัพท์</span>
          <div class="info-box__value-wrap">
            <span v-if="!isEditingProfile" class="info-box__value">{{ profile?.phone }}</span>
            <UInput
              v-else
              v-model="editPhone"
              type="tel"
              inputmode="numeric"
              placeholder="เช่น 0812345678"
              maxlength="10"
              size="sm"
              class="info-box__input"
            />
          </div>
        </div>

        <div class="info-box__row">
          <span class="info-box__label">เพศ</span>
          <div class="info-box__value-wrap">
            <span v-if="!isEditingProfile" class="info-box__value">{{ GENDER_OPTIONS.find(g => g.value === profile?.gender)?.label ?? '-' }}</span>
            <USelectMenu
              v-else
              v-model="editGender"
              :items="GENDER_OPTIONS"
              value-key="value"
              placeholder="เลือกเพศ"
              size="sm"
              class="info-box__input"
            />
          </div>
        </div>

        <div class="info-box__row">
          <span class="info-box__label">ช่วงปีเกิด</span>
          <div class="info-box__value-wrap">
            <span v-if="!isEditingProfile" class="info-box__value">{{ profile?.birthYearRange || '-' }}</span>
            <USelectMenu
              v-else
              v-model="editBirthYearValue"
              :items="ageRangeOptions"
              value-key="value"
              placeholder="เลือกช่วงปีเกิด"
              size="sm"
              class="info-box__input"
            />
          </div>
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

        <Transition name="fade">
          <p v-if="editError" class="info-box__error">{{ editError }}</p>
        </Transition>

        <div v-if="isEditingProfile" class="info-box__actions">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            block
            :disabled="editSubmitting"
            @click="cancelEditProfile"
          >
            ยกเลิก
          </UButton>
          <UButton
            color="primary"
            size="sm"
            block
            :loading="editSubmitting"
            :disabled="editSubmitting"
            @click="saveEditProfile"
          >
            บันทึก
          </UButton>
        </div>
      </div>

      <!-- Online Game Summary Card (ใหม่) — แสดงเฉพาะตอนไม่ได้อยู่ใน Offline Mode
           เท่านั้น (ห้ามใช้ Offline data แทน Online data ตามสเปก) ข้อมูลหลักคือ
           Journey ของ Round ปัจจุบัน ดึงสด ๆ จาก server-gas ทุกครั้งที่หน้านี้
           mount/กลับมา active หรือกดปุ่มรีเฟรชในการ์ด -->
      <!-- <OnlineSummaryCard
        v-if="!isOfflineMode"
        :round-status="onlineRoundStatus"
        :stations="onlineStations"
        :current-station-name="onlineCurrentStationName"
        :point="onlineRoundScore"
        :start-time="onlineRoundStartTime"
        :end-time="onlineRoundEndTime"
        :loading="onlineSummaryLoading"
        :error="onlineSummaryError"
        @refresh="loadOnlineSummary"
      /> -->

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

      <!-- <UButton
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
      </UButton> -->

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

.info-box__value-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
}

.info-box__input {
  width: 100%;
  max-width: 11.5rem;
}

.info-box__edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 999px;
  border: none;
  background: var(--farm-cream-dark);
  color: var(--farm-accent-dark);
  cursor: pointer;
}

.info-box__edit-icon {
  width: 0.9rem;
  height: 0.9rem;
}

.info-box__error {
  font-size: 0.78rem;
  color: #b3441f;
  margin: 0;
  text-align: center;
}

.info-box__actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.2rem;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
