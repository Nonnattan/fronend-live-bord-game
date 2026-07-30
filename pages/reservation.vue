<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()
</script>

<template>
  <div class="page">
    <PageHeader title="Reservation" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__empty">
      <UIcon name="i-lucide-calendar-check" class="page__empty-icon" />
      <p class="page__empty-title">ยังไม่มีการจอง</p>
      <p class="page__empty-desc">ระบบจองล่วงหน้าจะเปิดให้บริการเร็ว ๆ นี้</p>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100%; }
.page__loading, .page__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1.5rem;
  text-align: center;
}
.page__spinner { width: 2rem; height: 2rem; color: var(--farm-accent-dark); animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.page__empty-icon { width: 2.75rem; height: 2.75rem; color: var(--farm-wood); }
.page__empty-title { font-weight: 700; color: var(--farm-text-dark); margin: 0; }
.page__empty-desc { font-size: 0.8rem; color: var(--farm-text-muted); margin: 0; }
</style>
