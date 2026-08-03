<script setup lang="ts">
/**
 * pages/info.vue
 * ---------------------------------------------------------------------------
 * หน้า Info — ปรับ UI ใหม่ตามสเปก (ไม่มี Logic ผูกกับระบบใด ๆ ทั้งสิ้น เนื้อหา
 * เป็น Static Content ล้วน ๆ):
 * 1) Card ของแต่ละฐานทั้ง 4 (ข้าวโพด/วัว/ดิน/นม) เน้นไอคอนใหญ่ + คำอธิบายสั้น
 * 2) เวลาทำการ — คงไว้เป็นแถบข้อมูลสั้น ๆ ด้านบน
 * 3) ช่องทางติดต่อ — ย้ายไปเป็น Section "ติดต่อเรา" ปิดท้ายสุดของหน้า
 */
definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

/** เวลาทำการ — แสดงเป็นแถบสั้น ๆ ด้านบนสุดของเนื้อหา */
const openingHours = { icon: 'i-lucide-clock', title: 'เวลาทำการ', desc: 'ทุกวัน 10:00 - 21:00 น.' }

/** ข้อมูล 4 ฐาน — เน้นไอคอน/รูปมากกว่าข้อความ คำอธิบายสั้น 2-3 บรรทัด */
const stationInfoCards = [
  {
    id: 'corn',
    icon: '🌽',
    name: 'ฐานข้าวโพด',
    desc: 'เรียนรู้เส้นทางข้าวโพดตั้งแต่ไร่ถึงจาน สัมผัสแปลงปลูกจริงและร่วมกิจกรรมเก็บเกี่ยว',
    color: '#f2b134',
  },
  {
    id: 'cow',
    icon: '🐄',
    name: 'ฐานวัว',
    desc: 'ใกล้ชิดฝูงวัวนมของฟาร์ม เรียนรู้วิถีการเลี้ยงดูและให้อาหารแบบมืออาชีพ',
    color: '#c98a12',
  },
  {
    id: 'soil',
    icon: '🌱',
    name: 'ฐานดิน',
    desc: 'ทำความรู้จักดินอุดมสมบูรณ์ที่หล่อเลี้ยงฟาร์ม พร้อมกิจกรรมปลูกและปั้นดินสนุก ๆ',
    color: '#5a9e33',
  },
  {
    id: 'milk',
    icon: '🥛',
    name: 'ฐานนม',
    desc: 'ตามรอยนมสดจากฟาร์มสู่ขวด ชิมผลิตภัณฑ์นมสด ๆ และเก็บภาพความประทับใจ',
    color: '#5cb8e0',
  },
]

/** ช่องทางติดต่อ — Section ปิดท้ายสุดของหน้า */
const contactChannels = [
  { icon: 'i-lucide-phone', label: 'โทรหาเรา', value: '02-123-4567', href: 'tel:021234567' },
  { icon: 'i-simple-icons-facebook', label: 'Facebook', value: 'facebook.com/ourbrand', href: 'https://facebook.com/ourbrand' },
  { icon: 'i-simple-icons-instagram', label: 'Instagram', value: '@ourbrand', href: 'https://instagram.com/ourbrand' },
  { icon: 'i-simple-icons-line', label: 'LINE', value: 'เพิ่มเพื่อนทางไลน์', href: 'https://line.me/' },
]
</script>

<template>
  <div class="page">
    <PageHeader title="Info" />
    <div v-if="!isReady" class="page__loading">
      <UIcon name="i-lucide-loader-2" class="page__spinner" />
    </div>
    <div v-else class="page__content">
      <!-- เวลาทำการ -->
      <div class="hours-row">
        <UIcon :name="openingHours.icon" class="hours-row__icon" />
        <div>
          <p class="hours-row__title">{{ openingHours.title }}</p>
          <p class="hours-row__desc">{{ openingHours.desc }}</p>
        </div>
      </div>

      <!-- Card ของแต่ละฐานทั้ง 4 -->
      <section class="stations-section">
        <h2 class="section-title">ฐานกิจกรรมทั้งหมด</h2>
        <div class="station-grid">
          <article
            v-for="station in stationInfoCards"
            :key="station.id"
            class="station-card"
            :style="{ '--station-color': station.color }"
          >
            <div class="station-card__icon-wrap">
              <span class="station-card__icon">{{ station.icon }}</span>
            </div>
            <h3 class="station-card__name">{{ station.name }}</h3>
            <p class="station-card__desc">{{ station.desc }}</p>
          </article>
        </div>
      </section>

      <!-- ช่องทางติดต่อ — ปิดท้ายสุดของหน้า -->
      <section class="contact-section">
        <h2 class="section-title">ติดต่อเรา</h2>
        <div class="contact-grid">
          <a
            v-for="channel in contactChannels"
            :key="channel.label"
            :href="channel.href"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-btn"
          >
            <span class="contact-btn__icon-wrap">
              <UIcon :name="channel.icon" class="contact-btn__icon" />
            </span>
            <span class="contact-btn__text">
              <span class="contact-btn__label">{{ channel.label }}</span>
              <span class="contact-btn__value">{{ channel.value }}</span>
            </span>
          </a>
        </div>
      </section>
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

.page__content {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 1.1rem 1.5rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0 0 0.7rem;
}

/* ------------------------------- เวลาทำการ ------------------------------- */

.hours-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  border-radius: 0.85rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
}

.hours-row__icon {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.hours-row__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.hours-row__desc {
  font-size: 0.75rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}

/* -------------------------- Card ของแต่ละฐาน (4 ฐาน) -------------------------- */

.station-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.station-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  padding: 1.1rem 0.75rem 1rem;
  border-radius: 1.1rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 20px -14px rgba(74, 47, 24, 0.45);
  min-width: 0;
}

.station-card__icon-wrap {
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--station-color) 25%, var(--farm-cream));
  border: 2px solid var(--station-color);
}

.station-card__icon {
  font-size: 1.7rem;
  line-height: 1;
}

.station-card__name {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0.1rem 0 0;
}

.station-card__desc {
  font-size: 0.72rem;
  line-height: 1.45;
  color: var(--farm-text-muted);
  margin: 0;
}

/* --------------------------------- ติดต่อเรา --------------------------------- */

.contact-section {
  padding-top: 0.2rem;
  border-top: 2px dashed var(--farm-wood);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.8rem;
  border-radius: 0.9rem;
  background: var(--farm-cream);
  border: 2px solid var(--farm-wood);
  text-decoration: none;
  min-width: 0;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
}

.contact-btn:hover {
  background: var(--farm-wood);
}

.contact-btn:hover .contact-btn__label,
.contact-btn:hover .contact-btn__value {
  color: #fff;
}

.contact-btn:active {
  transform: scale(0.97);
}

.contact-btn__icon-wrap {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--farm-accent-dark);
  flex-shrink: 0;
}

.contact-btn__icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #fff;
}

.contact-btn__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.contact-btn__label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.contact-btn__value {
  font-size: 0.68rem;
  color: var(--farm-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 340px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
