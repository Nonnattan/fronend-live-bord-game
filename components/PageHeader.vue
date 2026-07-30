<script setup lang="ts">
/**
 * components/PageHeader.vue
 * ---------------------------------------------------------------------------
 * Header กลางของหน้าย่อยทุกหน้าในแอป (Reservation, History, Profile, Scan QR, Info, Map)
 * ปุ่มย้อนกลับ (default -> /map ซึ่งเป็นหน้าแรก/แลนดิ้งของแอปหลัง Login) + ชื่อหน้า
 * ตั้ง :show-back="false" เพื่อซ่อนปุ่มย้อนกลับ (ใช้กับหน้า Map ที่เป็นหน้าแรก)
 */

withDefaults(defineProps<{
  title: string
  backTo?: string
  showBack?: boolean
}>(), {
  backTo: '/map',
  showBack: true,
})
</script>

<template>
  <header class="page-header">
    <NuxtLink v-if="showBack" :to="backTo" class="page-header__back" aria-label="ย้อนกลับ">
      <UIcon name="i-lucide-chevron-left" class="page-header__back-icon" />
    </NuxtLink>
    <span v-else class="page-header__back-spacer" />
    <h1 class="page-header__title">{{ title }}</h1>
    <span class="page-header__spacer" />
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1rem 0.75rem;
  position: sticky;
  top: 0;
  background: var(--farm-sky-top);
  z-index: 10;
}

.page-header__back {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  color: var(--farm-text-dark);
  flex-shrink: 0;
}

.page-header__back-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.page-header__back-spacer {
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
}

.page-header__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
  flex: 1;
  text-align: center;
  padding-right: 2.25rem;
}

.page-header__spacer {
  width: 0;
}
</style>
