<script setup lang="ts">
/**
 * pages/index.vue
 * ---------------------------------------------------------------------------
 * หน้า Register เดียวของแอป (Mobile First)
 *
 * Flow:
 * 1) เมื่อ mounted -> initAuth() ตรวจสอบ LocalStorage key "uid"
 * 2) ถ้ามี uid อยู่แล้ว -> แสดงสถานะ "Registered" พร้อม uid
 * 3) ถ้ายังไม่มี -> แสดงปุ่ม "เข้าสู่ระบบด้วย LINE" -> redirect ไป LINE จริง
 *    -> กลับมาที่ /callback -> แลกเป็น uid -> กลับมาหน้านี้อีกครั้ง
 *
 * หน้านี้ทำหน้าที่แค่ "แสดงผล" เท่านั้น ส่วน logic ทั้งหมดอยู่ใน useAuth()
 * เพื่อให้ UI แยกออกจาก business logic อย่างชัดเจน
 */

const { uid, isRegistered, initAuth, loginWithLine, registerAsGuest, logout } = useAuth()

const isLoading = ref(false)

function handleLineLogin() {
  isLoading.value = true
  loginWithLine() // redirect ออกจากหน้านี้ทันที ไปที่ LINE
}

function handleGuestLogin() {
  registerAsGuest()
}

onMounted(() => {
  initAuth()
})
</script>

<template>
  <!-- phone-shell: พื้นหลังดำเต็มจอ ใช้จำลองกรอบมือถือเวลาดูบนจอกว้าง -->
  <div class="phone-shell">
    <!-- phone-frame: คอลัมน์กว้างเท่ามือถือ อยู่กึ่งกลางเสมอ เนื้อหาจริงทั้งหมดอยู่ในนี้ -->
    <div class="phone-frame">
      <UCard class="auth-card" :ui="{ body: 'p-6 sm:p-8' }">
        <div class="auth-card__content">
          <!-- โลโก้/สัญลักษณ์แอป -->
          <div class="brand-mark">
            <UIcon name="i-lucide-shield-check" class="brand-mark__icon" />
          </div>

          <template v-if="!isRegistered">
            <h1 class="title">Register</h1>
            <p class="subtitle">
              เข้าสู่ระบบด้วยบัญชี LINE ของคุณ<br />
              เพื่อเริ่มใช้งานแอปพลิเคชัน
            </p>

            <UButton
              block
              size="xl"
              color="success"
              class="line-button"
              :loading="isLoading"
              @click="handleLineLogin"
            >
              <template #leading>
                <UIcon name="i-simple-icons-line" class="line-button__icon" />
              </template>
              เข้าสู่ระบบด้วย LINE
            </UButton>

            <button type="button" class="guest-link" @click="handleGuestLogin">
              เข้าใช้งานแบบไม่ผูก LINE (ทดสอบ)
            </button>
          </template>

          <template v-else>
            <h1 class="title">ยินดีต้อนรับกลับ</h1>

            <UBadge color="success" variant="subtle" size="lg" class="status-badge">
              <UIcon name="i-lucide-check-circle-2" class="status-badge__icon" />
              Registered
            </UBadge>

            <div class="uid-box">
              <span class="uid-box__label">UID ของคุณ</span>
              <code class="uid-box__value">{{ uid }}</code>
            </div>

            <UButton
              block
              size="lg"
              color="neutral"
              variant="outline"
              @click="logout"
            >
              ออกจากระบบ
            </UButton>
          </template>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* ----------------------------------------------------------------------- */
/* Layout — จำลองกรอบมือถือ: เนื้อหาจำกัดความกว้างแบบ mobile เสมอ           */
/* ด้านข้าง (ตอนจอกว้าง) เป็นพื้นดำล้วน ไม่มี glow/ลวดลายรบกวนสายตา         */
/* ----------------------------------------------------------------------- */
.phone-shell {
  min-height: 100dvh;
  width: 100%;
  background: #000;
  display: flex;
  justify-content: center;
}

.phone-frame {
  width: 100%;
  max-width: 430px; /* ความกว้างอ้างอิงมือถือทั่วไป (เช่น iPhone Pro Max) */
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 0%, #0f2a1f 0%, #08110d 55%, #05080a 100%);
}

.auth-card {
  position: relative;
  width: 100%;
  border-radius: 1.25rem;
  background: rgba(15, 20, 18, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.auth-card__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

/* ----------------------------------------------------------------------- */
/* Brand mark                                                              */
/* ----------------------------------------------------------------------- */
.brand-mark {
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #06c755 0%, #049645 100%);
  margin-bottom: 0.75rem;
  box-shadow: 0 8px 24px -8px rgba(6, 199, 85, 0.6);
}

.brand-mark__icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #05130b;
}

/* ----------------------------------------------------------------------- */
/* Typography                                                              */
/* ----------------------------------------------------------------------- */
.title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f4faf7;
  margin: 0;
}

.subtitle {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #9fb3aa;
  margin: 0.25rem 0 1.25rem;
}

/* ----------------------------------------------------------------------- */
/* LINE Login button + guest fallback                                      */
/* ----------------------------------------------------------------------- */
.line-button {
  font-weight: 600;
}

.line-button__icon {
  width: 1.15rem;
  height: 1.15rem;
}

.guest-link {
  margin-top: 0.9rem;
  background: none;
  border: none;
  font-size: 0.78rem;
  color: #6e8279;
  text-decoration: underline;
  cursor: pointer;
}

.guest-link:hover {
  color: #9fb3aa;
}

/* ----------------------------------------------------------------------- */
/* Registered state                                                        */
/* ----------------------------------------------------------------------- */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.5rem 0 1.25rem;
  font-weight: 600;
}

.status-badge__icon {
  width: 1rem;
  height: 1rem;
}

.uid-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1.5rem;
}

.uid-box__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6e8279;
}

.uid-box__value {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 1rem;
  color: #e8f5ee;
  word-break: break-all;
}
</style>
