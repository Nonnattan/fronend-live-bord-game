<script setup lang="ts">
/**
 * components/WelcomePage.vue
 * ---------------------------------------------------------------------------
 * Step 1 ของ Flow ใหม่: หน้าแรกสุดที่ผู้ใช้เห็นเสมอเมื่อยังไม่เคยเลือกวิธีเข้าใช้งาน
 * (ไม่มี authData และไม่มี userProfile ใน LocalStorage)
 *
 * มี Logo + ข้อความต้อนรับ + ปุ่มเลือก 2 ทาง (ผ่าน <LoginButtons />)
 * ไม่มี logic การ login เอง แค่ forward event ให้ pages/index.vue เรียก
 * useAuth().loginWithLine() / loginAsGuest() ต่อ
 */

defineProps<{
  lineLoading?: boolean
  lineError?: string
}>()

const emit = defineEmits<{
  'select-line': []
  'select-guest': []
}>()
</script>

<template>
  <div class="welcome-page">
    <div class="welcome-page__scroll">
      <div class="brand-mark">
        <UIcon name="i-lucide-shield-check" class="brand-mark__icon" />
      </div>

      <h1 class="title">ยินดีต้อนรับ 👋</h1>
      <p class="subtitle">เลือกวิธีเข้าใช้งานเพื่อเริ่มต้น</p>

      <Transition name="fade">
        <p v-if="lineError" class="welcome-page__error">
          {{ lineError }}
        </p>
      </Transition>

      <LoginButtons
        :line-loading="lineLoading"
        class="welcome-page__buttons"
        @select-line="emit('select-line')"
        @select-guest="emit('select-guest')"
      />
    </div>
  </div>
</template>

<style scoped>
.welcome-page {
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--farm-sky-top) 0%, var(--farm-sky-bottom) 55%, var(--farm-grass) 100%);
}

.welcome-page__scroll {
  width: 100%;
  max-width: 420px;
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--farm-cream);
  border: 3px solid var(--farm-wood);
  border-radius: 1.5rem;
  box-shadow: 0 12px 0 -4px var(--farm-wood-dark), 0 20px 32px -12px rgba(74, 47, 24, 0.35);
}

.brand-mark {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px -8px rgba(90, 158, 51, 0.6);
  border: 3px solid var(--farm-cream);
}

.brand-mark__icon {
  width: 2.1rem;
  height: 2.1rem;
  color: var(--farm-cream);
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--farm-text-dark);
  margin: 0;
}

.subtitle {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--farm-text-muted);
  margin: 0.4rem 0 2rem;
}

.welcome-page__error {
  font-size: 0.8rem;
  color: #b3441f;
  margin: -1.25rem 0 1.25rem;
}

.welcome-page__buttons {
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
