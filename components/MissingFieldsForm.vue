<script setup lang="ts">
/**
 * components/MissingFieldsForm.vue
 * ---------------------------------------------------------------------------
 * แสดงเมื่อ Login ด้วย LINE แล้วพบสมาชิกเดิมใน Google Sheet (lineUserId ตรงกัน)
 * แต่แถวเดิมยังขาด Birth Year และ/หรือ Gender (เช่น สมัครไว้ตั้งแต่ก่อนมีฟีเจอร์นี้ หรือ
 * เคย Login จากเครื่องอื่นที่ไม่มี LocalStorage เดิม) — ให้กรอก "เฉพาะฟิลด์ที่ขาด"
 * เท่านั้น (ไม่ถามชื่อ/นามสกุล/เบอร์ซ้ำ เพราะมีอยู่แล้ว) แล้วอัปเดตแถวเดิมด้วย
 * memberId ผ่าน action 'updateMember' — ห้ามสร้างแถวใหม่เด็ดขาด
 */

import type { AuthData } from '~/types/auth'
import type { Gender } from '~/types/profile'
import type { MemberRecord } from '~/composables/useMemberApi'

const props = defineProps<{
  member: MemberRecord
  auth: AuthData
}>()
const emit = defineEmits<{ completed: [MemberRecord] }>()

const { updateMember } = useMemberApi()

const open = ref(true)
const ageRangeOptions = getAgeRangeOptions()

const missingAge = computed(() => !props.member.birthYear)
const missingGender = computed(() => !props.member.gender)

const gender = ref<Gender | undefined>(undefined)
const birthYear = ref<number | undefined>(undefined)

const previewAge = computed(() => {
  if (!birthYear.value) return null
  return calculateAge(birthYear.value)
})
const previewAgeRange = computed(() => {
  if (previewAge.value === null) return null
  return ageRangeLabel(calculateAgeRange(previewAge.value))
})

const isSubmitting = ref(false)
const submitError = ref('')

const canSubmit = computed(() => {
  if (missingGender.value && !gender.value) return false
  if (missingAge.value && !birthYear.value) return false
  return true
})

async function onSubmit() {
  if (!canSubmit.value) {
    submitError.value = 'กรุณากรอกข้อมูลให้ครบ'
    return
  }

  isSubmitting.value = true
  submitError.value = ''
  try {
    // ส่งเฉพาะฟิลด์ที่ขาดจริง ๆ ไปอัปเดต — ไม่แตะฟิลด์อื่นในแถวเดิม (backend
    // จะไม่เขียนทับด้วยค่าว่างถ้าฟิลด์นั้นไม่ได้ส่งมา ดู updateMemberRow_ ใน Code.gs)
    // birthYear ที่ส่งไปคือช่วงปีเกิด ค.ศ. แบบข้อความตรงตามตัวเลือกที่เลือก เช่น "1996-2006"
    const fields: { gender?: string; birthYear?: string } = {}
    if (missingGender.value && gender.value) fields.gender = gender.value
    if (missingAge.value && birthYear.value) fields.birthYear = birthYearRangeValueFor(birthYear.value)

    const result = await updateMember(props.member.memberId, fields)

    if (!result.success || !result.member) {
      submitError.value = result.error || 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      return
    }

    emit('completed', result.member)
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    :dismissible="false"
    :close="false"
    title="กรอกข้อมูลเพิ่มเติม"
    description="กรุณากรอกข้อมูลที่ขาดให้ครบก่อนเริ่มใช้งาน"
  >
    <template #content>
      <div class="missing-fields-form">
        <div class="missing-fields-form__scroll">
          <div class="missing-fields-form__header">
            <UAvatar
              v-if="member.pictureUrl"
              :src="member.pictureUrl"
              size="3xl"
              class="brand-avatar"
            />
            <div v-else class="brand-mark">
              <UIcon name="i-lucide-user-round-plus" class="brand-mark__icon" />
            </div>
            <h1 class="title">สวัสดีอีกครั้ง, {{ member.firstName }}</h1>
            <p class="subtitle">กรุณากรอกข้อมูลเพิ่มเติมอีกเล็กน้อยก่อนเริ่มใช้งาน</p>
          </div>

          <form class="missing-fields-form__body" @submit.prevent="onSubmit">
            <UFormField v-if="missingGender" label="เพศ" required>
              <URadioGroup
                v-model="gender"
                :items="GENDER_OPTIONS"
                orientation="horizontal"
                variant="card"
                class="gender-grid"
              />
            </UFormField>

            <UFormField v-if="missingAge" label="ช่วงอายุ" required>
              <USelectMenu
                v-model="birthYear"
                :items="ageRangeOptions"
                value-key="value"
                placeholder="เลือกช่วงอายุ"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <Transition name="fade">
              <div v-if="previewAge !== null" class="age-preview">
                <span class="age-preview__label">อายุของคุณ</span>
                <span class="age-preview__value">{{ previewAgeRange }}</span>
              </div>
            </Transition>

            <Transition name="fade">
              <p v-if="submitError" class="submit-error">
                {{ submitError }}
              </p>
            </Transition>

            <UButton
              type="submit"
              block
              size="xl"
              color="primary"
              class="submit-button"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              เริ่มใช้งาน
            </UButton>
          </form>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.missing-fields-form {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: black;
}

.missing-fields-form__scroll {
  width: 100%;
  max-width: 480px;
  padding: 2rem 1.25rem 3rem;
  overflow-y: auto;
  background: var(--farm-cream);
  border-left: 3px solid var(--farm-wood);
  border-right: 3px solid var(--farm-wood);
}

.missing-fields-form__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.35rem;
  margin-bottom: 1.75rem;
}

.brand-mark {
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  margin-bottom: 0.5rem;
  box-shadow: 0 8px 24px -8px rgba(90, 158, 51, 0.6);
  border: 3px solid var(--farm-cream);
}

.brand-mark__icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--farm-cream);
}

.brand-avatar {
  margin-bottom: 0.5rem;
  border: 2px solid var(--farm-accent);
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--farm-text-dark);
  margin: 0;
}

.subtitle {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--farm-text-muted);
  margin: 0;
}

.missing-fields-form__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.gender-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}

.age-preview {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background: var(--farm-cream-dark);
  border: 1px solid var(--farm-wood);
}

.age-preview__label {
  font-size: 0.78rem;
  color: var(--farm-text-muted);
}

.age-preview__value {
  font-weight: 700;
  color: var(--farm-text-dark);
  margin-left: auto;
}

.submit-error {
  font-size: 0.8rem;
  color: #b3441f;
  margin: -0.5rem 0 0;
  text-align: center;
}

.submit-button {
  font-weight: 600;
  margin-top: 0.25rem;
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
