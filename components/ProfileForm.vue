<script setup lang="ts">
/**
 * components/ProfileForm.vue
 * ---------------------------------------------------------------------------
 * Step 2 ของ Flow ใหม่: ฟอร์มกรอกโปรไฟล์ — แสดงเป็น UModal แบบ fullscreen
 * (บังคับ, ห้ามข้าม) ไม่ว่า Step 1 จะมาจาก LINE หรือ Guest ก็ต้องเจอฟอร์มนี้เสมอ
 *
 * - รับ authData ของ Step 1 มาเป็น prop (uid/loginType/displayName/pictureUrl)
 * - ถ้ามาจาก LINE และมี displayName -> เติมในช่อง "ชื่อ" ให้อัตโนมัติ (แก้ไขได้)
 * - ช่วงอายุ: เลือกจาก USelectMenu เป็นช่วง (เช่น "1996 - 2006 (20-30 ปี)")
 *   คำนวณช่วงปีเกิดสดจากปีปัจจุบันเสมอ (ไม่ hardcode) -> ได้ age + ageRange อัตโนมัติ
 * - Validate ด้วย Zod (utils/profileSchema.ts) ผ่าน UForm
 * - ปิด modal ด้วยปุ่ม X / คลิกนอกกรอบ / กด Esc ไม่ได้ ต้องกรอกให้ครบก่อนเท่านั้น
 * - บันทึกสำเร็จ -> รวมเข้ากับ authData เป็น UserProfile เดียว แล้ว emit "registered"
 */

import type { FormSubmitEvent } from '@nuxt/ui'
import type { AuthData } from '~/types/auth'
import type { Gender } from '~/types/profile'
import type { ProfileSchemaOutput } from '~/utils/profileSchema'

const props = defineProps<{ auth: AuthData }>()
const emit = defineEmits<{ registered: [] }>()

const { saveProfile } = useProfile()
const { syncMember } = useMemberApi()

// เปิดค้างไว้เสมอ (ฟอร์มบังคับ ยังไม่ยอมให้ปิดจนกว่าจะบันทึกสำเร็จ)
const open = ref(true)

const ageRangeOptions = getAgeRangeOptions()

// state ของฟอร์ม — gender/birthYear เป็น undefined ตอนเริ่ม เพื่อบังคับให้ผู้ใช้เลือกเอง
// firstName เติมจาก LINE displayName ให้ล่วงหน้าถ้ามี (แก้ไขได้อิสระ)
const state = reactive<{
  firstName: string
  lastName: string
  gender: Gender | undefined
  birthYear: number | undefined
  phone: string
}>({
  firstName: props.auth.loginType === 'line' ? (props.auth.displayName ?? '') : '',
  lastName: '',
  gender: undefined,
  birthYear: undefined,
  phone: '',
})

// คำนวณอายุ/ช่วงอายุแบบ real-time ตามปีเกิดที่เลือก เพื่อแสดงผลให้ผู้ใช้เห็นทันที
const previewAge = computed(() => {
  if (!state.birthYear) return null
  return calculateAge(state.birthYear)
})

const previewAgeRange = computed(() => {
  if (previewAge.value === null) return null
  return ageRangeLabel(calculateAgeRange(previewAge.value))
})

const isSubmitting = ref(false)
const submitError = ref('')

async function onSubmit(event: FormSubmitEvent<ProfileSchemaOutput>) {
  isSubmitting.value = true
  submitError.value = ''
  try {
    // ข้อ 3-5 ในสเปก: ส่งไปตรวจสอบ/บันทึกที่ Google Sheet ผ่าน Google Apps Script
    // ก่อนเสมอ (checkMember -> login หรือ register) แล้วค่อยรวมผลลัพธ์ที่ backend
    // ยืนยันแล้ว (memberId, registerDate, lastLogin) เข้ากับโปรไฟล์ในเครื่อง
    const result = await syncMember(
      {
        firstName: event.data.firstName,
        lastName: event.data.lastName,
        phone: event.data.phone,
      },
      props.auth,
    )

    if (!result.success || !result.member) {
      submitError.value = result.error || 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      return
    }

    saveProfile(
      {
        firstName: event.data.firstName,
        lastName: event.data.lastName,
        gender: event.data.gender,
        birthYear: event.data.birthYear,
        phone: event.data.phone,
      },
      props.auth,
      result.member,
    )
    emit('registered')
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
    title="กรอกข้อมูลผู้ใช้"
    description="กรุณากรอกข้อมูลให้ครบก่อนเริ่มใช้งาน"
  >
    <template #content>
      <div class="profile-form">
        <div class="profile-form__scroll">
          <div class="profile-form__header">
            <UAvatar
              v-if="auth.pictureUrl"
              :src="auth.pictureUrl"
              size="3xl"
              class="brand-avatar"
            />
            <div v-else class="brand-mark">
              <UIcon name="i-lucide-user-round-plus" class="brand-mark__icon" />
            </div>
            <h1 class="title">กรอกข้อมูลผู้ใช้</h1>
            <p class="subtitle">กรอกข้อมูลของคุณให้ครบเพื่อเริ่มใช้งานแอปพลิเคชัน</p>

            <UBadge
              v-if="auth.loginType === 'line' && auth.displayName"
              color="success"
              variant="subtle"
              size="md"
              class="line-badge"
            >
              <UIcon name="i-simple-icons-line" class="line-badge__icon" />
              เข้าสู่ระบบด้วย LINE: {{ auth.displayName }}
            </UBadge>
          </div>

          <UForm
            :schema="profileSchema"
            :state="state"
            class="profile-form__body"
            @submit="onSubmit"
          >
            <UFormField label="ชื่อ" name="firstName" required>
              <UInput
                v-model="state.firstName"
                placeholder="กรอกชื่อของคุณ"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UFormField label="นามสกุล" name="lastName" required>
              <UInput
                v-model="state.lastName"
                placeholder="กรอกนามสกุลของคุณ"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UFormField label="เบอร์โทรศัพท์" name="phone" required>
              <UInput
                v-model="state.phone"
                type="tel"
                inputmode="numeric"
                placeholder="กรอกเบอร์โทรศัพท์ เช่น 0812345678"
                maxlength="10"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UFormField label="เพศ" name="gender" required>
              <URadioGroup
                v-model="state.gender"
                :items="GENDER_OPTIONS"
                orientation="horizontal"
                variant="card"
                class="gender-grid"
              />
            </UFormField>

            <UFormField label="ช่วงอายุ" name="birthYear" required>
              <USelectMenu
                v-model="state.birthYear"
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
          </UForm>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.profile-form {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, var(--farm-sky-top) 0%, var(--farm-sky-bottom) 55%, var(--farm-grass) 100%);
}

.profile-form__scroll {
  width: 100%;
  max-width: 480px;
  padding: 2rem 1.25rem 3rem;
  overflow-y: auto;
  background: var(--farm-cream);
  border-left: 3px solid var(--farm-wood);
  border-right: 3px solid var(--farm-wood);
}

.profile-form__header {
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

.line-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
  font-weight: 600;
}

.line-badge__icon {
  width: 0.9rem;
  height: 0.9rem;
}

.profile-form__body {
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
