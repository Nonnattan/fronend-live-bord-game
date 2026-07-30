<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { profile, isReady } = useRequireProfile()
</script>

<template>
  <div class="page">
    <PageHeader title="History" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__content">
      <div class="summary-card">
        <div class="summary-card__item">
          <span class="summary-card__value">{{ profile?.totalVisit ?? 0 }}</span>
          <span class="summary-card__label">ครั้งที่เข้าใช้บริการทั้งหมด</span>
        </div>
        <div class="summary-card__item">
          <span class="summary-card__value">{{ profile?.point ?? 0 }}</span>
          <span class="summary-card__label">คะแนนสะสมปัจจุบัน</span>
        </div>
      </div>

      <div class="timeline">
        <div v-if="profile?.registerDate" class="timeline__item">
          <UIcon name="i-lucide-user-round-plus" class="timeline__icon" />
          <div>
            <p class="timeline__title">สมัครสมาชิก</p>
            <p class="timeline__date">{{ new Date(profile.registerDate).toLocaleString('th-TH') }}</p>
          </div>
        </div>
        <div v-if="profile?.lastLogin" class="timeline__item">
          <UIcon name="i-lucide-log-in" class="timeline__icon" />
          <div>
            <p class="timeline__title">เข้าใช้งานล่าสุด</p>
            <p class="timeline__date">{{ new Date(profile.lastLogin).toLocaleString('th-TH') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100%; }
.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}
.page__spinner { width: 2rem; height: 2rem; color: var(--farm-accent-dark); animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.page__content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 1.1rem 1rem;
}

.summary-card {
  display: flex;
  gap: 0.75rem;
}

.summary-card__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.9rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  text-align: center;
}

.summary-card__value {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.summary-card__label {
  font-size: 0.68rem;
  color: var(--farm-text-muted);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.timeline__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.timeline__icon {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.timeline__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.timeline__date {
  font-size: 0.72rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}
</style>
