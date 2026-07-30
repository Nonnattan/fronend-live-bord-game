<script setup lang="ts">
/**
 * pages/index.vue
 * ---------------------------------------------------------------------------
 * Controller เดียวของแอป: ตัดสินใจว่าจะแสดงหน้าไหนใน 3 หน้า
 *
 * ลำดับการทำงานตอนเปิดเว็บ:
 * 1) initAuth()    -> เช็ค authData เดิม หรือเช็คว่าเพิ่งถูก LINE redirect กลับมา
 * 2) initProfile() -> โหลดโปรไฟล์เดิมจาก LocalStorage (ถ้ามี)
 * 3) มี userProfile ครบแล้ว          -> ข้ามทุกอย่าง เข้าหน้า Home ทันที
 * 4) ยังไม่มีโปรไฟล์ แต่มี authData   -> แสดง <ProfileForm /> (Step 2, บังคับกรอก)
 * 5) ยังไม่มีทั้งคู่                  -> แสดง <WelcomePage /> (Step 1)
 */

const { authData, hasAuth, isAnonymous, isLineLoading, lineError, initAuth, loginWithLine, loginAsGuest, resetAuth } = useAuth()
const { profile, hasProfile, initProfile, resetProfile } = useProfile()

// ใช้กันไม่ให้ flash เนื้อหาผิดจังหวะระหว่างที่ยังไม่ได้เช็ค LocalStorage/LIFF
const isReady = ref(false)

onMounted(async () => {
  await initAuth()
  initProfile()
  isReady.value = true
})

function handleRegistered() {
  // ฟอร์มบันทึกโปรไฟล์สำเร็จแล้ว -> hasProfile จะกลาย true อัตโนมัติ (reactive)
  // ไม่ต้องทำอะไรเพิ่ม แค่ให้ template อัปเดตตาม state
}

function handleResetForTesting() {
  resetProfile()
  resetAuth()
}
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame">
      <!-- ยังไม่พร้อม (กำลังเช็ค LocalStorage / LIFF) -->
      <div v-if="!isReady" class="loading">
        <UIcon name="i-lucide-loader-2" class="loading__spinner" />
      </div>

      <!-- Step 1: ยังไม่เคยเลือกวิธีเข้าใช้งานเลย -->
      <WelcomePage
        v-else-if="!hasProfile && !hasAuth"
        :line-loading="isLineLoading"
        :line-error="lineError"
        @select-line="loginWithLine"
        @select-guest="loginAsGuest"
      />

      <!-- Step 2: เลือกวิธีแล้ว (LINE หรือ Guest) แต่ยังกรอกโปรไฟล์ไม่ครบ -->
      <ProfileForm
        v-else-if="!hasProfile && hasAuth && authData"
        :auth="authData"
        @registered="handleRegistered"
      />

      <!-- มีโปรไฟล์ครบแล้ว -> หน้า Home -->
      <UCard v-else class="home-card" :ui="{ body: 'p-6 sm:p-8' }">
        <div class="home-card__content">
          <UAvatar
            v-if="profile?.pictureUrl"
            :src="profile.pictureUrl"
            size="3xl"
            class="brand-avatar"
          />
          <div v-else class="brand-mark">
            <UIcon name="i-lucide-shield-check" class="brand-mark__icon" />
          </div>

          <h1 class="title">ยินดีต้อนรับ, {{ profile?.firstName }} 👋</h1>

          <UBadge color="success" variant="subtle" size="lg" class="status-badge">
            <UIcon name="i-lucide-check-circle-2" class="status-badge__icon" />
            Registered
          </UBadge>

          <div class="profile-box">
            <div class="profile-box__row">
              <span class="profile-box__label">ชื่อ-นามสกุล</span>
              <span class="profile-box__value">{{ profile?.firstName }} {{ profile?.lastName }}</span>
            </div>
            <div class="profile-box__row">
              <span class="profile-box__label">เพศ</span>
              <span class="profile-box__value">{{ GENDER_OPTIONS.find(g => g.value === profile?.gender)?.label }}</span>
            </div>
            <div class="profile-box__row">
              <span class="profile-box__label">ปีเกิด / อายุ</span>
              <span class="profile-box__value">{{ profile?.birthYear }} ({{ profile?.age }} ปี)</span>
            </div>
            <div class="profile-box__row">
              <span class="profile-box__label">ช่วงอายุ</span>
              <span class="profile-box__value">{{ profile ? ageRangeLabel(profile.ageRange) : '' }}</span>
            </div>
            <div class="profile-box__row">
              <span class="profile-box__label">เข้าใช้งานด้วย</span>
              <span class="profile-box__value">{{ profile?.loginType === 'line' ? 'LINE' : 'Guest' }}</span>
            </div>
            <div class="profile-box__row">
              <span class="profile-box__label">UID</span>
              <code class="profile-box__value profile-box__value--mono">{{ profile?.uid }}</code>
            </div>
          </div>

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
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.phone-shell {
  min-height: 100dvh;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 0%, #0f2a1f 0%, #08110d 55%, #05080a 100%);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading__spinner {
  width: 2rem;
  height: 2rem;
  color: #06c755;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.home-card {
  position: relative;
  width: 100%;
  border-radius: 1.25rem;
  background: rgba(15, 20, 18, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.home-card__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.brand-mark {
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #06c755 0%, #049645 100%);
  margin-bottom: 0.75rem;
  box-shadow: 0 8px 24px -8px rgba(6, 199, 85, 0.6);
}

.brand-mark__icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #05130b;
}

.brand-avatar {
  margin-bottom: 0.75rem;
  border: 2px solid rgba(6, 199, 85, 0.6);
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f4faf7;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.5rem 0 1.25rem;
  font-weight: 600;
}

.status-badge__icon {
  width: 1rem;
  height: 1rem;
}

.profile-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1.5rem;
  text-align: left;
}

.profile-box__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.profile-box__label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6e8279;
  white-space: nowrap;
}

.profile-box__value {
  font-size: 0.88rem;
  color: #e8f5ee;
  text-align: right;
}

.profile-box__value--mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  word-break: break-all;
}

.line-link-button {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.reset-link {
  background: none;
  border: none;
  font-size: 0.78rem;
  color: #6e8279;
  text-decoration: underline;
  cursor: pointer;
}

.reset-link:hover {
  color: #9fb3aa;
}
</style>
