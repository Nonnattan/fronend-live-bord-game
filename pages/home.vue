<script setup lang="ts">
/**
 * pages/home.vue
 * ---------------------------------------------------------------------------
 * หน้า Home หลักของระบบ — หน้าแรกของแอปหลัง Login + กรอกโปรไฟล์ครบ (guard ผ่าน
 * useRequireProfile() เหมือนทุกหน้าในแอป ไม่ได้แก้ logic เดิมของ guard นี้เลย)
 *
 * ประกอบด้วยตามสเปกใหม่:
 * 1) Summary Card ด้านบน — แสดงความคืบหน้า "เข้าฐานแล้ว X/4" พร้อมแสดงฐานทั้ง
 *    4 ฐานเป็นรายการ อัปเดตตามข้อมูลจริงผ่าน useStations() (ดู composables/
 *    useStations.ts สำหรับหมายเหตุเรื่องแหล่งข้อมูล)
 * 2) Map Preview ด้านล่าง — ภาพตัวอย่างแผนที่ขนาดเล็ก กดแล้วไปหน้า Map เต็มที่
 *    /map (หน้า Map เดิมยังอยู่ ไม่ได้แก้ logic ของมัน)
 */

definePageMeta({ layout: 'app' })

const { profile, isReady } = useRequireProfile()
const { stations, totalStations, visitedCount, isVisited, initStations } = useStations()

onMounted(() => {
  initStations()
})

const progressPercent = computed(() => Math.round((visitedCount.value / totalStations) * 100))
</script>

<template>
  <div class="page">
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>

    <div v-else class="home">
      <!-- Greeting แบบกระชับ -->
      <div class="greeting">
        <UAvatar
          v-if="profile?.pictureUrl"
          :src="profile.pictureUrl"
          size="md"
          class="greeting__avatar"
        />
        <div v-else class="greeting__avatar-fallback">
          <UIcon name="i-lucide-user-round" class="greeting__avatar-icon" />
        </div>
        <div class="greeting__text">
          <p class="greeting__hello">สวัสดี</p>
          <p class="greeting__name">{{ profile?.firstName }} {{ profile?.lastName }}</p>
        </div>
      </div>

      <!-- Summary Card: ความคืบหน้าการเข้าฐาน -->
      <section class="summary-card">
        <div class="summary-card__top">
          <div>
            <p class="summary-card__label">ความคืบหน้า</p>
            <p class="summary-card__value">
              เข้าฐานแล้ว <span class="summary-card__value-num">{{ visitedCount }}/{{ totalStations }}</span>
            </p>
          </div>
          <div class="summary-card__ring" :style="{ '--pct': progressPercent + '%' }">
            <span class="summary-card__ring-text">{{ progressPercent }}%</span>
          </div>
        </div>

        <div class="summary-card__bar">
          <div class="summary-card__bar-fill" :style="{ width: progressPercent + '%' }" />
        </div>

        <div class="station-grid">
          <div
            v-for="station in stations"
            :key="station.id"
            class="station-chip"
            :class="{ 'station-chip--visited': isVisited(station.id) }"
          >
            <span class="station-chip__icon-wrap">
              <UIcon
                :name="isVisited(station.id) ? 'i-lucide-check' : station.icon"
                class="station-chip__icon"
              />
            </span>
            <span class="station-chip__name">{{ station.name }}</span>
          </div>
        </div>
      </section>

      <!-- Map Preview: กดเพื่อไปหน้า Map แบบเต็ม -->
      <NuxtLink to="/map" class="map-preview">
        <div class="map-preview__canvas">
          <div class="map-preview__grid" />
          <span
            v-for="station in stations"
            :key="station.id"
            class="map-preview__pin"
            :class="{ 'map-preview__pin--visited': isVisited(station.id) }"
            :style="{ left: station.x + '%', top: station.y + '%' }"
          >
            <UIcon name="i-lucide-map-pin" class="map-preview__pin-icon" />
          </span>
        </div>
        <div class="map-preview__footer">
          <div class="map-preview__footer-text">
            <p class="map-preview__title">แผนที่ฐานทั้งหมด</p>
            <p class="map-preview__desc">แตะเพื่อดูแผนที่แบบเต็ม</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="map-preview__chevron" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.page__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.page__spinner {
  width: 2rem;
  height: 2rem;
  color: var(--farm-accent-dark);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.home {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.1rem 1.25rem;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.greeting__avatar {
  border: 2px solid var(--farm-accent);
}

.greeting__avatar-fallback {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  border: 2px solid var(--farm-cream);
  flex-shrink: 0;
}

.greeting__avatar-icon {
  width: 1.35rem;
  height: 1.35rem;
  color: var(--farm-cream);
}

.greeting__text {
  min-width: 0;
}

.greeting__hello {
  font-size: 0.72rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.greeting__name {
  font-size: 1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0.05rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------------------------- Summary Card ---------------------------- */

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.1rem;
  border-radius: 1.25rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 24px -16px rgba(74, 47, 24, 0.45);
}

.summary-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.summary-card__label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--farm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.summary-card__value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0.2rem 0 0;
}

.summary-card__value-num {
  color: var(--farm-accent-dark);
  font-size: 1.3rem;
  font-weight: 800;
}

.summary-card__ring {
  --pct: 0%;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 999px;
  flex-shrink: 0;
  background: conic-gradient(var(--farm-accent-dark) var(--pct), rgba(90, 158, 51, 0.18) 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.summary-card__ring::before {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 999px;
  background: var(--farm-cream);
}

.summary-card__ring-text {
  position: relative;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.summary-card__bar {
  width: 100%;
  height: 0.5rem;
  border-radius: 999px;
  background: rgba(90, 158, 51, 0.18);
  overflow: hidden;
}

.summary-card__bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  transition: width 0.3s ease;
}

.station-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.station-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.55rem 0.25rem;
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px dashed var(--farm-wood);
}

.station-chip--visited {
  border-style: solid;
  border-color: var(--farm-accent-dark);
  background: rgba(143, 199, 78, 0.22);
}

.station-chip__icon-wrap {
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--farm-cream-dark);
  color: var(--farm-text-muted);
}

.station-chip--visited .station-chip__icon-wrap {
  background: var(--farm-accent-dark);
  color: #fff;
}

.station-chip__icon {
  width: 1rem;
  height: 1rem;
}

.station-chip__name {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--farm-text-dark);
  text-align: center;
  white-space: nowrap;
}

/* ----------------------------- Map Preview ----------------------------- */

.map-preview {
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 2px solid var(--farm-wood);
  text-decoration: none;
  box-shadow: 0 10px 24px -16px rgba(74, 47, 24, 0.45);
}

.map-preview__canvas {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(160deg, var(--farm-sky-top) 0%, var(--farm-sky-bottom) 55%, var(--farm-grass) 100%);
  overflow: hidden;
}

.map-preview__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.35) 1px, transparent 1px);
  background-size: 12.5% 25%;
  opacity: 0.6;
}

.map-preview__pin {
  position: absolute;
  transform: translate(-50%, -100%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 999px 999px 999px 0;
  background: var(--farm-wood-dark);
  border: 2px solid var(--farm-cream);
  box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.4);
  rotate: 45deg;
}

.map-preview__pin--visited {
  background: var(--farm-accent-dark);
}

.map-preview__pin-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: #fff;
  rotate: -45deg;
}

.map-preview__footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  background: var(--farm-cream);
}

.map-preview__footer-text {
  flex: 1;
  min-width: 0;
}

.map-preview__title {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--farm-text-dark);
  margin: 0;
}

.map-preview__desc {
  font-size: 0.72rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}

.map-preview__chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

@media (max-width: 360px) {
  .station-chip__name {
    font-size: 0.58rem;
  }
}
</style>
