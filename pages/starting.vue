<script setup lang="ts">
/**
 * pages/starting.vue
 * ---------------------------------------------------------------------------
 * [ใหม่] หน้าโหลดเต็มจอแยกต่างหาก — แสดงระหว่างเปิดรอบจริง (เปิด Round ฝั่ง
 * Backend/Offline ผ่าน ensureRoundStarted()/startRound() + เริ่มนับเวลา 2
 * ชั่วโมงด้วย startRoundTimer()) แทนที่การ์ดเล็ก ๆ ในหน้า Home เดิม
 *
 * Flow: Home (ปุ่ม GO) -> navigateTo('/starting') -> หน้านี้ mount แล้วเริ่ม
 * เปิดรอบทันที -> เสร็จแล้ว navigateTo('/home') กลับไปอัตโนมัติ (Home จะเห็น
 * hasActiveRoundTimer เป็น true แล้วเลยแสดงเนื้อหาปกติแทนปุ่ม GO ทันที)
 *
 * Guard ด้วย useRequireProfile() เหมือนทุกหน้าในแอป — กันเข้าตรง ๆ โดยไม่ได้
 * Login/กรอกโปรไฟล์มาก่อน เหมือนหน้าอื่น ๆ ทั้งหมด
 *
 * ใช้ layout: 'app' เหมือนเดิม (ได้พื้นหลังท้องฟ้าไล่สี app-frame ฟรีจาก
 * layouts/app.vue) แต่ซ่อน BottomNav อยู่แล้วเพราะ hasActiveRoundTimer ยังเป็น
 * false ระหว่างที่หน้านี้กำลังทำงานอยู่ (ตาม logic เดิมใน layouts/app.vue)
 */

definePageMeta({ layout: "app" });

const { profile, isReady } = useRequireProfile();
const { ensureRoundStarted } = useRound();
const { isOfflineMode, startRound } = useOfflineMode();
const { startRoundTimer, hasActiveRoundTimer } = useRoundTimer();

const GO_LOADING_ICONS = ["🌽", "🐄", "🌱", "🥛"] as const;
const GO_LOADING_MESSAGES = [
  "กำลังเปิดประตูฟาร์ม...",
  "กำลังปลุกวัวให้ตื่น...",
  "กำลังเตรียมฐานผจญภัยทั้ง 4 จุด...",
  "กำลังนับเวลาถอยหลัง 2 ชั่วโมง...",
] as const;
const loadingMessageIndex = ref(0);
let loadingMessageTimer: ReturnType<typeof setInterval> | undefined;
// [กันเคส navigate ออกจากหน้านี้ก่อน onMounted ทำงานเสร็จ เช่น ไม่มีโปรไฟล์แล้ว
// useRequireProfile() เด้งไป "/" เอง] หยุด poll/ไม่เปิดรอบต่อถ้าหน้านี้ถูก unmount
// ไปแล้วระหว่างรอ isReady
let isPageMounted = true;

onMounted(async () => {
  loadingMessageTimer = setInterval(() => {
    loadingMessageIndex.value =
      (loadingMessageIndex.value + 1) % GO_LOADING_MESSAGES.length;
  }, 1400);

  // รอ Guard ให้พร้อมก่อน (โปรไฟล์โหลดจาก LocalStorage เสร็จ) ก่อนเริ่มเปิดรอบจริง
  // — useRequireProfile() เซ็ต isReady/เด้งไป "/" เองถ้าไม่มีโปรไฟล์ (ดูคอมเมนต์
  // ในไฟล์นั้น) ที่นี่แค่ poll รอสั้น ๆ ไม่ได้เพิ่ม Logic guard ซ้ำ
  while (isPageMounted && !isReady.value) {
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  if (!isPageMounted) return;

  // [กันเคสเข้าหน้านี้ตรง ๆ ทั้งที่เปิดรอบไปแล้ว เช่น กด Back มา] ไม่เปิดซ้ำ
  if (!hasActiveRoundTimer.value) {
    if (isOfflineMode.value) {
      startRound(profile.value?.uid ?? "");
    } else if (profile.value?.memberId) {
      await ensureRoundStarted(profile.value.memberId, profile.value.firstName);
    }
    startRoundTimer();
  }

  if (isPageMounted) await navigateTo("/home");
});

onUnmounted(() => {
  isPageMounted = false;
  if (loadingMessageTimer) clearInterval(loadingMessageTimer);
});
</script>

<template>
  <div class="starting">
    <div class="starting__sky">
      <span class="starting__cloud starting__cloud--1">☁️</span>
      <span class="starting__cloud starting__cloud--2">☁️</span>
      <span class="starting__cloud starting__cloud--3">☁️</span>
      <span class="starting__sun">☀️</span>
    </div>

    <div class="starting__content">
      <div class="starting__icons">
        <span
          v-for="(icon, i) in GO_LOADING_ICONS"
          :key="icon"
          class="starting__icon"
          :style="{ animationDelay: `${i * 0.15}s` }"
        >
          {{ icon }}
        </span>
      </div>

      <p class="starting__title">กำลังเปิดรอบผจญภัย...</p>

      <Transition name="starting-fade" mode="out-in">
        <p :key="loadingMessageIndex" class="starting__message">
          {{ GO_LOADING_MESSAGES[loadingMessageIndex] }}
        </p>
      </Transition>

      <div class="starting__bar">
        <div class="starting__bar-fill" />
      </div>
    </div>

    <div class="starting__ground" />
  </div>
</template>

<style scoped>
.starting {
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem 1.5rem;
}

.starting__sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.starting__cloud {
  position: absolute;
  font-size: 2.4rem;
  opacity: 0.85;
  animation: starting-drift 14s ease-in-out infinite;
}

.starting__cloud--1 {
  top: 12%;
  left: -10%;
  animation-duration: 16s;
}

.starting__cloud--2 {
  top: 22%;
  left: 55%;
  font-size: 1.8rem;
  animation-duration: 19s;
  animation-delay: -6s;
}

.starting__cloud--3 {
  top: 6%;
  left: 30%;
  font-size: 1.5rem;
  animation-duration: 12s;
  animation-delay: -2s;
}

.starting__sun {
  position: absolute;
  top: 8%;
  right: 10%;
  font-size: 3rem;
  animation: starting-spin 14s linear infinite;
}

.starting__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.9rem;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-wood);
  box-shadow: 0 16px 32px -18px rgba(74, 47, 24, 0.5);
  max-width: 22rem;
  width: 100%;
}

.starting__icons {
  display: flex;
  gap: 1rem;
}

.starting__icon {
  display: inline-block;
  font-size: 2.75rem;
  line-height: 1;
  filter: drop-shadow(0 6px 8px rgba(74, 47, 24, 0.35));
  animation: starting-bounce 1.1s ease-in-out infinite;
}

.starting__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--farm-text-dark);
}

.starting__message {
  margin: 0;
  min-height: 1.3em;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--farm-accent-dark);
}

.starting-fade-enter-active,
.starting-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.starting-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.starting-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.starting__bar {
  position: relative;
  width: 100%;
  max-width: 16rem;
  height: 0.6rem;
  margin-top: 0.5rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  border: 1.5px solid var(--farm-wood);
  overflow: hidden;
}

.starting__bar-fill {
  position: absolute;
  inset: 0;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--farm-accent), var(--farm-accent-dark));
  animation: starting-bar 1.3s ease-in-out infinite;
}

.starting__ground {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 18%;
  background: linear-gradient(180deg, transparent 0%, var(--farm-grass) 55%, var(--farm-grass-dark) 100%);
  opacity: 0.55;
  pointer-events: none;
}

@keyframes starting-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-14px) scale(1.08);
  }
}

@keyframes starting-drift {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(24px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes starting-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes starting-bar {
  0% {
    left: -40%;
  }
  100% {
    left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .starting__icon,
  .starting__cloud,
  .starting__sun,
  .starting__bar-fill {
    animation: none;
  }
}
</style>
