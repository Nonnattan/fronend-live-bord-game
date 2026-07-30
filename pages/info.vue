<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

const infoItems = [
  { icon: 'i-lucide-clock', title: 'เวลาทำการ', desc: 'ทุกวัน 10:00 - 21:00 น.' },
  { icon: 'i-lucide-phone', title: 'ติดต่อเรา', desc: '02-123-4567' },
  { icon: 'i-lucide-facebook', title: 'Facebook', desc: 'facebook.com/ourbrand' },
  { icon: 'i-lucide-instagram', title: 'Instagram', desc: '@ourbrand' },
]
</script>

<template>
  <div class="page">
    <PageHeader title="Info" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__content">
      <div v-for="item in infoItems" :key="item.title" class="info-row">
        <UIcon :name="item.icon" class="info-row__icon" />
        <div>
          <p class="info-row__title">{{ item.title }}</p>
          <p class="info-row__desc">{{ item.desc }}</p>
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
  gap: 0.6rem;
  padding: 0.5rem 1.1rem 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.info-row__icon {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.info-row__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.info-row__desc {
  font-size: 0.75rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}
</style>
