<script setup lang="ts">
/**
 * pages/profile.vue
 * ---------------------------------------------------------------------------
 * เมนู Profile — แสดงรายละเอียดสมาชิกแบบเต็ม (ย้ายมาจากการ์ด Home เดิม)
 * + ปุ่มเชื่อมบัญชี LINE (เฉพาะ Guest) และปุ่มรีเซ็ตข้อมูลไว้ทดสอบ
 */

definePageMeta({ layout: 'app' })

const { profile, isReady } = useRequireProfile()
const { isAnonymous, loginWithLine, resetAuth } = useAuth()
const { resetProfile } = useProfile()

async function handleResetForTesting() {
  resetProfile()
  resetAuth()
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
        <div class="stat-box">
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
          <span class="info-box__value">{{ GENDER_OPTIONS.find(g => g.value === profile?.gender)?.label }}</span>
        </div>
        <div class="info-box__row">
          <span class="info-box__label">ช่วงอายุ</span>
          <span class="info-box__value">{{ profile ? ageRangeLabel(profile.ageRange) : '' }} ({{ profile?.age }} ปี)</span>
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
