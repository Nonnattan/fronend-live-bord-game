<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()
</script>

<template>
  <div class="page">
    <PageHeader title="Scan QR Code" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="scan">
      <div class="scan__frame">
        <UIcon name="i-lucide-scan-line" class="scan__icon" />
      </div>
      <p class="scan__title">วางกล้องให้ตรง QR Code</p>
      <p class="scan__desc">ใช้สแกน QR Code เพื่อสะสมคะแนน หรือรับสิทธิพิเศษหน้าร้าน</p>
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

.scan {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  text-align: center;
}

.scan__frame {
  width: 12rem;
  height: 12rem;
  border-radius: 1.25rem;
  border: 3px dashed var(--farm-wood);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
}

.scan__icon {
  width: 3.5rem;
  height: 3.5rem;
  color: var(--farm-accent-dark);
}

.scan__title {
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.5rem 0 0;
}

.scan__desc {
  font-size: 0.8rem;
  color: var(--farm-text-muted);
  margin: 0;
  max-width: 22rem;
}
</style>
