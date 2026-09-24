<script setup lang="ts">
/**
 * components/BottomNav.vue
 * ---------------------------------------------------------------------------
 * Bottom Navigation ของแอป: Home | Map | Scan QR | Profile | Info
 * ปุ่ม "Scan QR" อยู่ตรงกลางแบบยกลอยขึ้น (Floating) ทับแถบเมนูเสมอ จัดด้วย
 * position: absolute ให้อยู่กึ่งกลางแนวนอนของแถบจริง ๆ (ไม่ใช่แค่กึ่งกลางของ
 * flex ฝั่งที่เหลือ) ทำหน้าที่เป็นทั้ง 1 ใน 5 เมนูของ Bottom Navigation และ
 * "ปุ่ม Scan QR Code แบบ Floating Button" ในเวลาเดียวกัน
 */

const route = useRoute()

const sideItems = [
  { label: 'หน้าแรก', icon: 'i-lucide-house', to: '/home' },
  { label: 'แผนที่', icon: 'i-lucide-map-pin', to: '/map' },
] as const

const sideItemsRight = [
  { label: 'โปรไฟล์', icon: 'i-lucide-user-round', to: '/profile' },
  { label: 'Info', icon: 'i-lucide-info', to: '/info' },
] as const

function isActive(to: string): boolean {
  return route.path === to
}
</script>

<template>
  <nav class="bottom-nav">
    <div class="bottom-nav__side bottom-nav__side--left">
      <NuxtLink
        v-for="item in sideItems"
        :key="item.to"
        :to="item.to"
        class="bottom-nav__item"
        :class="{ 'bottom-nav__item--active': isActive(item.to) }"
      >
        <UIcon :name="item.icon" class="bottom-nav__icon" />
        <span class="bottom-nav__label">{{ item.label }}</span>
      </NuxtLink>
    </div>

    <NuxtLink to="/scan" class="bottom-nav__scan-wrap">
      <span class="bottom-nav__scan" :class="{ 'bottom-nav__scan--active': isActive('/scan') }">
        <UIcon name="i-lucide-scan-line" class="bottom-nav__scan-icon" />
      </span>
      <span class="bottom-nav__label bottom-nav__label--scan">Scan QR</span>
    </NuxtLink>

    <div class="bottom-nav__side bottom-nav__side--right">
      <NuxtLink
        v-for="item in sideItemsRight"
        :key="item.to"
        :to="item.to"
        class="bottom-nav__item"
        :class="{ 'bottom-nav__item--active': isActive(item.to) }"
      >
        <UIcon :name="item.icon" class="bottom-nav__icon" />
        <span class="bottom-nav__label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem 0.5rem calc(0.6rem + env(safe-area-inset-bottom, 0px));
  background: var(--farm-cream);
  border-top: 3px solid var(--farm-wood);
  box-shadow: 0 -6px 20px -8px rgba(74, 47, 24, 0.35);
  z-index: 20;
}

.bottom-nav__side {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.bottom-nav__side--left {
  justify-content: flex-start;
}

.bottom-nav__side--right {
  justify-content: flex-end;
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.3rem 0.75rem;
  color: var(--farm-text-muted);
  text-decoration: none;
  border-radius: 0.75rem;
  transition: color 0.15s ease;
}

.bottom-nav__item--active {
  color: var(--farm-accent-dark);
}

.bottom-nav__icon {
  width: 1.35rem;
  height: 1.35rem;
}

.bottom-nav__label {
  font-size: 0.65rem;
  font-weight: 600;
}

/* ปุ่ม Scan อยู่กึ่งกลางแนวนอนของแถบจริง ๆ เสมอ ไม่ขึ้นกับจำนวนเมนูฝั่งซ้าย/ขวา */
.bottom-nav__scan-wrap {
  position: absolute;
  left: 50%;
  bottom: calc(0.6rem + env(safe-area-inset-bottom, 0px));
  transform: translate(-50%, -0.9rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-decoration: none;
}

.bottom-nav__scan {
  width: 3.4rem;
  height: 3.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  border: 3px solid var(--farm-cream);
  box-shadow: 0 8px 20px -6px rgba(90, 158, 51, 0.7);
}

.bottom-nav__scan--active {
  outline: 2px solid var(--farm-accent-dark);
  outline-offset: 2px;
}

.bottom-nav__scan-icon {
  width: 1.6rem;
  height: 1.6rem;
  color: var(--farm-cream);
}

.bottom-nav__label--scan {
  color: var(--farm-accent-dark);
  font-weight: 700;
}
</style>
