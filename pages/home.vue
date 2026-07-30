<script setup lang="ts">
/**
 * pages/home.vue
 * ---------------------------------------------------------------------------
 * หน้า Home หลักของระบบ (เข้าถึงได้หลัง Login + กรอกโปรไฟล์ครบเท่านั้น)
 * แสดงข้อมูลสมาชิกจาก Session (LocalStorage ผ่าน useProfile) แล้วรีเฟรช
 * point/totalVisit ล่าสุดจาก Google Sheet แบบเงียบ ๆ ผ่าน useRequireProfile()
 *
 * ประกอบด้วยตามสเปก: Banner โปรโมชั่น, ข่าวสาร/กิจกรรม, เมนู (Info, Map,
 * Reservation, Profile, History), ปุ่ม Scan QR แบบ Floating (รวมอยู่ใน
 * BottomNav กลางจอ), และ Bottom Navigation
 */

definePageMeta({ layout: 'app' })

const { profile, isReady } = useRequireProfile()

const banners = [
  {
    title: 'โปรโมชั่นสมาชิกใหม่',
    subtitle: 'รับคะแนนสะสมพิเศษ 2 เท่า สัปดาห์นี้เท่านั้น',
    color: 'linear-gradient(135deg, #ffb84c 0%, #ff7a59 100%)',
    icon: 'i-lucide-sparkles',
  },
  {
    title: 'สะสมแต้ม แลกของรางวัล',
    subtitle: 'ครบ 100 คะแนน แลกส่วนลดได้ทันที',
    color: 'linear-gradient(135deg, #5ec6ba 0%, #3a8fae 100%)',
    icon: 'i-lucide-gift',
  },
  {
    title: 'จองล่วงหน้า ลดคิวรอ',
    subtitle: 'จองผ่านแอปวันนี้ รับสิทธิ์คิวด่วน',
    color: 'linear-gradient(135deg, #8fc74e 0%, #457a26 100%)',
    icon: 'i-lucide-calendar-check',
  },
]

const news = [
  { title: 'เปิดให้บริการสาขาใหม่', date: '28 ก.ค. 2569', desc: 'พบกับสาขาใหม่ พร้อมกิจกรรมเปิดตัวสุดพิเศษ' },
  { title: 'กิจกรรมสะสมแต้มพิเศษ', date: '20 ก.ค. 2569', desc: 'เข้าใช้บริการครบ 5 ครั้ง รับคะแนนโบนัสทันที' },
  { title: 'ปรับปรุงระบบสมาชิก', date: '10 ก.ค. 2569', desc: 'ระบบสมาชิกใหม่ใช้งานง่ายขึ้น เชื่อม LINE ได้แล้ว' },
]

const menuItems = [
  { label: 'Info', icon: 'i-lucide-info', to: '/info', color: '#5ec6ba' },
  { label: 'Map', icon: 'i-lucide-map-pin', to: '/map', color: '#ff7a59' },
  { label: 'Reservation', icon: 'i-lucide-calendar-check', to: '/reservation', color: '#ffb84c' },
  { label: 'Profile', icon: 'i-lucide-user-round', to: '/profile', color: '#8fc74e' },
  { label: 'History', icon: 'i-lucide-history', to: '/history', color: '#b083d9' },
] as const
</script>

<template>
  <div v-if="!isReady" class="home-loading">
    <UIcon name="i-lucide-loader-2" class="home-loading__spinner" />
  </div>

  <div v-else class="home-page">
    <!-- Header: ข้อมูลสมาชิกจาก Session -->
    <section class="member-card">
      <UAvatar
        v-if="profile?.pictureUrl"
        :src="profile.pictureUrl"
        size="xl"
        class="member-card__avatar"
      />
      <div v-else class="member-card__avatar-fallback">
        <UIcon name="i-lucide-user-round" class="member-card__avatar-icon" />
      </div>

      <div class="member-card__info">
        <p class="member-card__greeting">สวัสดี, {{ profile?.firstName }} 👋</p>
        <code v-if="profile?.memberId" class="member-card__id">{{ profile.memberId }}</code>
      </div>

      <div class="member-card__stats">
        <div class="member-card__stat">
          <span class="member-card__stat-value">{{ profile?.point ?? 0 }}</span>
          <span class="member-card__stat-label">คะแนนสะสม</span>
        </div>
        <div class="member-card__stat-divider" />
        <div class="member-card__stat">
          <span class="member-card__stat-value">{{ profile?.totalVisit ?? 0 }}</span>
          <span class="member-card__stat-label">ครั้งที่ใช้บริการ</span>
        </div>
      </div>
    </section>

    <!-- Banner โปรโมชั่น -->
    <section class="section">
      <div class="banner-scroll">
        <div
          v-for="banner in banners"
          :key="banner.title"
          class="banner-card"
          :style="{ background: banner.color }"
        >
          <UIcon :name="banner.icon" class="banner-card__icon" />
          <p class="banner-card__title">{{ banner.title }}</p>
          <p class="banner-card__subtitle">{{ banner.subtitle }}</p>
        </div>
      </div>
    </section>

    <!-- เมนู -->
    <section class="section">
      <h2 class="section__title">เมนู</h2>
      <div class="menu-grid">
        <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to" class="menu-item">
          <span class="menu-item__icon-wrap" :style="{ background: item.color }">
            <UIcon :name="item.icon" class="menu-item__icon" />
          </span>
          <span class="menu-item__label">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ข่าวสาร / กิจกรรม -->
    <section class="section">
      <h2 class="section__title">ข่าวสาร / กิจกรรม</h2>
      <div class="news-list">
        <article v-for="item in news" :key="item.title" class="news-item">
          <div class="news-item__icon">
            <UIcon name="i-lucide-megaphone" />
          </div>
          <div class="news-item__body">
            <p class="news-item__title">{{ item.title }}</p>
            <p class="news-item__desc">{{ item.desc }}</p>
            <p class="news-item__date">{{ item.date }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-loading {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-loading__spinner {
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

.home-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem 1.1rem 0.5rem;
}

.member-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1.1rem;
  background: var(--farm-cream);
  border: 3px solid var(--farm-wood);
  box-shadow: 0 8px 0 -4px var(--farm-wood-dark);
}

.member-card__avatar,
.member-card__avatar-fallback {
  border: 2px solid var(--farm-accent);
  flex-shrink: 0;
}

.member-card__avatar-fallback {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
}

.member-card__avatar-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--farm-cream);
}

.member-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.member-card__greeting {
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
  font-size: 0.95rem;
}

.member-card__id {
  font-size: 0.7rem;
  color: var(--farm-text-muted);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

.member-card__stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.member-card__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 3.6rem;
}

.member-card__stat-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.member-card__stat-label {
  font-size: 0.6rem;
  color: var(--farm-text-muted);
  white-space: nowrap;
}

.member-card__stat-divider {
  width: 1px;
  height: 1.75rem;
  background: var(--farm-wood);
  opacity: 0.4;
}

.section__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0 0 0.65rem;
}

.banner-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scroll-snap-type: x mandatory;
}

.banner-card {
  flex: 0 0 82%;
  scroll-snap-align: start;
  border-radius: 1rem;
  padding: 1.1rem;
  color: #fff;
  position: relative;
  min-height: 6.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.25);
}

.banner-card__icon {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.85;
}

.banner-card__title {
  font-weight: 800;
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
}

.banner-card__subtitle {
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.92;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-decoration: none;
}

.menu-item__icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.3);
}

.menu-item__icon {
  width: 1.3rem;
  height: 1.3rem;
  color: #fff;
}

.menu-item__label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--farm-text-dark);
  text-align: center;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.news-item {
  display: flex;
  gap: 0.65rem;
  padding: 0.75rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.news-item__icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--farm-cream-dark);
  color: var(--farm-accent-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.news-item__body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.news-item__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.news-item__desc {
  font-size: 0.75rem;
  color: var(--farm-text-muted);
  margin: 0;
}

.news-item__date {
  font-size: 0.68rem;
  color: var(--farm-text-muted);
  opacity: 0.8;
  margin: 0.1rem 0 0;
}
</style>
