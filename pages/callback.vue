<script setup lang="ts">
/**
 * pages/callback.vue
 * ---------------------------------------------------------------------------
 * หน้านี้คือ Redirect URI ที่ต้องตั้งค่าไว้ใน LINE Developers Console
 * เช่น http://localhost:3000/callback
 *
 * เมื่อ LINE login สำเร็จ จะ redirect กลับมาที่หน้านี้พร้อม query
 * ?code=...&state=...  (หรือ ?error=... หากผู้ใช้กด "ไม่ยินยอม")
 *
 * หน้าที่ของหน้านี้มีแค่: แลก code เป็น uid ผ่าน useAuth().completeLineLogin()
 * แล้วพากลับไปหน้า Register (index.vue) — ไม่มี logic ธุรกิจใด ๆ อยู่ในนี้เลย
 */

const route = useRoute()
const { completeLineLogin } = useAuth()

const status = ref<'loading' | 'error'>('loading')
const errorMessage = ref('')

onMounted(async () => {
  const code = route.query.code as string | undefined
  const state = route.query.state as string | undefined
  const oauthError = route.query.error as string | undefined

  if (oauthError) {
    status.value = 'error'
    errorMessage.value = 'ผู้ใช้ยกเลิกการเข้าสู่ระบบ หรือ LINE ปฏิเสธคำขอ'
    return
  }

  if (!code || !state) {
    status.value = 'error'
    errorMessage.value = 'ไม่พบข้อมูลยืนยันตัวตนจาก LINE'
    return
  }

  try {
    await completeLineLogin(code, state)
    await navigateTo('/')
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ'
  }
})
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame">
      <div class="callback">
        <template v-if="status === 'loading'">
          <UIcon name="i-lucide-loader-2" class="callback__spinner" />
          <p class="callback__text">กำลังเข้าสู่ระบบด้วย LINE...</p>
        </template>

        <template v-else>
          <UIcon name="i-lucide-alert-circle" class="callback__error-icon" />
          <p class="callback__text">{{ errorMessage }}</p>
          <UButton to="/" color="neutral" variant="outline" class="mt-4">
            กลับสู่หน้า Register
          </UButton>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-shell {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  padding: 1.25rem;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.callback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: #e8f5ee;
}

.callback__spinner {
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
  color: #06c755;
}

.callback__error-icon {
  width: 2.25rem;
  height: 2.25rem;
  color: #f87171;
}

.callback__text {
  font-size: 0.9rem;
  color: #9fb3aa;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
