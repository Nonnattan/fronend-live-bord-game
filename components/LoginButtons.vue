<script setup lang="ts">
/**
 * components/LoginButtons.vue
 * ---------------------------------------------------------------------------
 * ปุ่ม 2 ปุ่มของหน้า Welcome (Step 1) — เป็น presentational component ล้วน ๆ
 * ไม่มี logic การ login อยู่ในนี้เลย แค่ emit event ให้ parent (WelcomePage)
 * ตัดสินใจว่าจะเรียก useAuth().loginWithLine() หรือ loginAsGuest()
 */

defineProps<{
  /** true ระหว่างกำลัง init/login กับ LIFF อยู่ (โชว์ spinner + disable ปุ่ม guest) */
  lineLoading?: boolean
}>()

const emit = defineEmits<{
  'select-line': []
  'select-guest': []
}>()
</script>

<template>
  <div class="login-buttons">
    <UButton
      block
      size="xl"
      color="success"
      class="login-buttons__line"
      :loading="lineLoading"
      :disabled="lineLoading"
      @click="emit('select-line')"
    >
      <template v-if="!lineLoading" #leading>
        <UIcon name="i-simple-icons-line" />
      </template>
      เข้าสู่ระบบด้วย LINE
    </UButton>

    <UButton
      block
      size="xl"
      color="neutral"
      variant="outline"
      class="login-buttons__guest"
      :disabled="lineLoading"
      @click="emit('select-guest')"
    >
      เข้าใช้งานโดยไม่เชื่อม LINE
    </UButton>
  </div>
</template>

<style scoped>
.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.login-buttons__line {
  font-weight: 600;
}

.login-buttons__guest {
  font-weight: 500;
  color: var(--farm-text-muted);
  border-color: var(--farm-wood);
}
</style>
