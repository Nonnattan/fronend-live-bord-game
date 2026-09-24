<script setup lang="ts">
/**
 * pages/info.vue
 * ---------------------------------------------------------------------------
 * หน้า Info — ปรับ UI ใหม่ทั้งหมด (ยังเป็น Static Content ล้วน ๆ ไม่ผูก Logic/
 * API ใด ๆ เหมือนเดิม):
 * 1) Card ของแต่ละฐานทั้ง 4 (ข้าวโพด/วัว/ดิน/นม) วางเรียงแนวตั้งฐานละแถว (การ์ด
 *    เต็มความกว้าง) โชว์แค่ไอคอน + ชื่อ + คำอธิบายสั้น 2 บรรทัด บนหน้าหลัก
 * 2) กด "ดูรายละเอียด" -> เปิด UModal แสดงข้อมูลเต็ม (รูป/ไอคอนใหญ่, ประวัติ
 *    โดยสรุป, จุดเด่นเป็น Bullet, กิจกรรม/วิธีเล่น) รายละเอียดยาว ๆ ทั้งหมด
 *    ย้ายมาอยู่ตรงนี้จุดเดียว ไม่แสดงบนหน้าหลักอีกต่อไป
 * 3) เวลาทำการ + ช่องทางติดต่อ — คงพฤติกรรมเดิมไว้ทั้งหมด ไม่แตะ
 */
definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

/** เวลาทำการ — แสดงเป็นแถบสั้น ๆ ด้านบนสุดของเนื้อหา */
const openingHours = { icon: 'i-lucide-clock', title: 'เวลาทำการ', desc: 'ทุกวัน 10:00 - 21:00 น.' }

interface StationInfo {
  id: string
  icon: string
  name: string
  /** คำอธิบายสั้นบน Card หน้าหลัก (แสดงไม่เกิน 2 บรรทัด) */
  summary: string
  color: string
  /** ประวัติโดยสรุป — แสดงเฉพาะใน Modal รายละเอียดเท่านั้น */
  history: string
  /** จุดเด่นของฐาน — แสดงเป็น Bullet ใน Modal */
  highlights: string[]
  /** กิจกรรม/วิธีเล่นภายในฐาน — แสดงเป็น Bullet ใน Modal */
  activities: string[]
}

/** ข้อมูล 4 ฐาน — บนหน้าหลักโชว์แค่ icon/name/summary ส่วนที่เหลือไปอยู่ใน Modal */
const stationInfoCards: StationInfo[] = [
  {
    id: 'corn',
    icon: '🌽',
    name: 'ฐานข้าวโพด',
    summary: 'เรียนรู้เส้นทางข้าวโพดตั้งแต่ไร่ถึงจาน สัมผัสแปลงปลูกจริงและร่วมกิจกรรมเก็บเกี่ยว',
    color: '#f2b134',
    history: 'ฐานข้าวโพดตั้งอยู่กลางแปลงปลูกจริงของฟาร์ม ปลูกข้าวโพดหวานพันธุ์พื้นเมืองมากว่า 20 ปี เป็นจุดเริ่มต้นของเส้นทางผลิตอาหารสัตว์ให้ฟาร์มโคนม',
    highlights: [
      'แปลงข้าวโพดจริงกลางแจ้ง ให้เดินชมและถ่ายรูปได้ทั่วบริเวณ',
      'มีป้ายให้ความรู้เรื่องวงจรชีวิตข้าวโพดตลอดเส้นทาง',
      'อากาศโปร่งสบาย เหมาะกับการเดินเล่นช่วงเช้า-เย็น',
    ],
    activities: [
      'ร่วมกิจกรรมเก็บเกี่ยวข้าวโพดตามฤดูกาล',
      'ทดลองปอกเปลือกและแกะเมล็ดข้าวโพดด้วยตัวเอง',
      'สแกน QR Code ที่ป้ายประจำฐานเพื่อสะสมคะแนน',
    ],
  },
  {
    id: 'cow',
    icon: '🐄',
    name: 'ฐานวัว',
    summary: 'ใกล้ชิดฝูงวัวนมของฟาร์ม เรียนรู้วิถีการเลี้ยงดูและให้อาหารแบบมืออาชีพ',
    color: '#c98a12',
    history: 'โรงเลี้ยงวัวนมของฟาร์มดูแลฝูงวัวพันธุ์นมคุณภาพดีมากกว่า 50 ตัว ภายใต้มาตรฐานสวัสดิภาพสัตว์ เป็นแหล่งน้ำนมดิบหลักของผลิตภัณฑ์ทั้งหมดในฟาร์ม',
    highlights: [
      'ฝูงวัวนมสุขภาพดี เลี้ยงแบบปล่อยในคอกโปร่งอากาศถ่ายเทดี',
      'เจ้าหน้าที่ประจำฐานพร้อมให้ความรู้ตลอดเวลา',
      'จุดถ่ายรูปกับวัวนมแบบใกล้ชิดปลอดภัย',
    ],
    activities: [
      'ร่วมกิจกรรมป้อนอาหารวัวภายใต้การดูแลของเจ้าหน้าที่',
      'ชมสาธิตขั้นตอนการรีดนมวัวแบบย่อ',
      'สแกน QR Code ที่ป้ายประจำฐานเพื่อสะสมคะแนน',
    ],
  },
  {
    id: 'soil',
    icon: '🌱',
    name: 'ฐานดิน',
    summary: 'ทำความรู้จักดินอุดมสมบูรณ์ที่หล่อเลี้ยงฟาร์ม พร้อมกิจกรรมปลูกและปั้นดินสนุก ๆ',
    color: '#5a9e33',
    history: 'ฐานดินอยู่บริเวณแปลงทดลองปุ๋ยหมักของฟาร์ม ใช้มูลวัวจากฐานวัวมาหมักเป็นปุ๋ยอินทรีย์หมุนเวียนกลับไปบำรุงแปลงข้าวโพด ครบวงจรฟาร์มยั่งยืน',
    highlights: [
      'ดินอุดมสมบูรณ์จากการหมักปุ๋ยอินทรีย์ของฟาร์มเอง',
      'มีจุดสาธิตการหมักปุ๋ยแบบครบวงจร',
      'เหมาะสำหรับเด็ก ๆ ที่อยากเรียนรู้เรื่องธรรมชาติแบบลงมือทำ',
    ],
    activities: [
      'ลงมือปลูกต้นกล้าลงกระถางกลับบ้านได้',
      'ทดลองปั้นดิน/กระถางจากดินเหนียวของฟาร์ม',
      'สแกน QR Code ที่ป้ายประจำฐานเพื่อสะสมคะแนน',
    ],
  },
  {
    id: 'milk',
    icon: '🥛',
    name: 'ฐานนม',
    summary: 'ตามรอยนมสดจากฟาร์มสู่ขวด ชิมผลิตภัณฑ์นมสด ๆ และเก็บภาพความประทับใจ',
    color: '#5cb8e0',
    history: 'ฐานนมคือปลายทางของเส้นทางผลิตนมทั้งหมด ตั้งแต่วัตถุดิบอาหารสัตว์ การเลี้ยงดู จนถึงกระบวนการแปรรูปเป็นผลิตภัณฑ์นมพร้อมดื่มของฟาร์ม',
    highlights: [
      'ได้ชิมนมสดแปรรูปใหม่จากฟาร์มโดยตรง',
      'จุดถ่ายรูปธีมฟาร์มนมสวยงามหลายมุม',
      'เป็นฐานสุดท้ายของเส้นทาง เข้าฐานนี้ถือว่าครบเส้นทางทั้งหมด',
    ],
    activities: [
      'ชิมผลิตภัณฑ์นมสดของฟาร์มฟรี 1 แก้วต่อคน',
      'เลือกซื้อผลิตภัณฑ์นมกลับบ้านที่ร้านค้าประจำฐาน',
      'สแกน QR Code ที่ป้ายประจำฐานเพื่อสรุปคะแนนและ Sync ข้อมูล',
    ],
  },
]

/** ช่องทางติดต่อ — Section ปิดท้ายสุดของหน้า */
const contactChannels = [
  { icon: 'i-lucide-phone', label: 'โทรหาเรา', value: '02-123-4567', href: 'tel:021234567' },
  { icon: 'i-simple-icons-facebook', label: 'Facebook', value: 'facebook.com/ourbrand', href: 'https://facebook.com/ourbrand' },
  { icon: 'i-simple-icons-instagram', label: 'Instagram', value: '@ourbrand', href: 'https://instagram.com/ourbrand' },
  { icon: 'i-simple-icons-line', label: 'LINE', value: 'เพิ่มเพื่อนทางไลน์', href: 'https://line.me/' },
]

// --------------------------- Modal รายละเอียดฐาน ---------------------------
const isDetailOpen = ref(false)
const selectedStation = ref<StationInfo | null>(null)

function openStationDetail(station: StationInfo): void {
  selectedStation.value = station
  isDetailOpen.value = true
}
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

      <!-- Card ของแต่ละฐานทั้ง 4 — วางแนวตั้ง ฐานละแถว (1 การ์ดเต็มความกว้างต่อแถว) -->
      <section class="stations-section">
        <h2 class="section-title">ฐานกิจกรรมทั้งหมด</h2>
        <div class="station-list">
          <article
            v-for="station in stationInfoCards"
            :key="station.id"
            class="station-card"
            :style="{ '--station-color': station.color }"
          >
            <div class="station-card__top">
              <div class="station-card__icon-wrap">
                <span class="station-card__icon">{{ station.icon }}</span>
              </div>
              <div class="station-card__body">
                <h3 class="station-card__name">{{ station.name }}</h3>
                <p class="station-card__desc">{{ station.summary }}</p>
              </div>
            </div>
            <UButton
              block
              color="primary"
              variant="soft"
              size="sm"
              class="station-card__btn"
              @click="openStationDetail(station)"
            >
              ดูรายละเอียด
            </UButton>
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

    <!-- Modal รายละเอียดฐาน — เปิด/ปิดแบบ Fade + Slide (transition ของ UModal เอง) -->
    <UModal v-model:open="isDetailOpen" :title="selectedStation?.name ?? ''">
      <template #body>
        <div v-if="selectedStation" class="station-detail" :style="{ '--station-color': selectedStation.color }">
          <div class="station-detail__hero">
            <span class="station-detail__icon">{{ selectedStation.icon }}</span>
          </div>

          <section class="station-detail__block">
            <h4 class="station-detail__heading">
              <UIcon name="i-lucide-scroll-text" class="station-detail__heading-icon" />
              ประวัติโดยสรุป
            </h4>
            <p class="station-detail__text">{{ selectedStation.history }}</p>
          </section>

          <section class="station-detail__block">
            <h4 class="station-detail__heading">
              <UIcon name="i-lucide-badge-star" class="station-detail__heading-icon" />
              จุดเด่นของฐาน
            </h4>
            <ul class="station-detail__list">
              <li v-for="item in selectedStation.highlights" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section class="station-detail__block">
            <h4 class="station-detail__heading">
              <UIcon name="i-lucide-gamepad-2" class="station-detail__heading-icon" />
              กิจกรรม/วิธีเล่น
            </h4>
            <ul class="station-detail__list">
              <li v-for="item in selectedStation.activities" :key="item">{{ item }}</li>
            </ul>
          </section>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton block color="neutral" variant="subtle" @click="close">ปิด</UButton>
      </template>
    </UModal>
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
  padding: 0.5rem 0 1.5rem;
  overflow-x: hidden;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0 0 0.7rem;
  padding: 0 1.1rem;
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
  margin: 0 1.1rem;
}

.hours-row__icon {
  width: 1.4rem;
  height: 1.4rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.hours-row__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--farm-text-dark);
  margin: 0;
}

.hours-row__desc {
  font-size: 0.88rem;
  color: var(--farm-text-muted);
  margin: 0.1rem 0 0;
}

/* ------------------------ Card ของแต่ละฐาน — แนวตั้ง ฐานละแถว ------------------------ */

.station-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 0.2rem 1.1rem 0.2rem;
  width: 100%;
  box-sizing: border-box;
}

.station-card {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.1rem 1.15rem;
  border-radius: 1.25rem;
  background: linear-gradient(160deg, var(--farm-cream) 0%, var(--farm-cream-dark) 100%);
  border: 2px solid var(--farm-wood);
  box-shadow: 0 10px 20px -14px rgba(74, 47, 24, 0.45);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.station-card:hover,
.station-card:focus-within {
  transform: translateY(-0.2rem);
  box-shadow: 0 16px 26px -14px rgba(74, 47, 24, 0.55);
}

.station-card__top {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  text-align: left;
}

.station-card__icon-wrap {
  width: 3.9rem;
  height: 3.9rem;
  flex-shrink: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--station-color) 25%, var(--farm-cream));
  border: 2px solid var(--station-color);
}

.station-card__icon {
  font-size: 2rem;
  line-height: 1;
}

.station-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.station-card__name {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0;
}

.station-card__desc {
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--farm-text-muted);
  margin: 0;
  /* คำอธิบายสั้น ไม่เกิน 2 บรรทัด บนหน้าหลัก — รายละเอียดเต็มอยู่ใน Modal */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --------------------------------- ติดต่อเรา --------------------------------- */

.contact-section {
  padding: 0.2rem 1.1rem 0;
  border-top: 2px dashed var(--farm-wood);
  margin: 0 1.1rem;
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
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.contact-btn__value {
  font-size: 0.8rem;
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

/* ------------------------------ Modal รายละเอียดฐาน ------------------------------ */

.station-detail {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.station-detail__hero {
  align-self: center;
  width: 6rem;
  height: 6rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--station-color) 25%, var(--farm-cream));
  border: 3px solid var(--station-color);
}

.station-detail__icon {
  font-size: 3rem;
  line-height: 1;
}

.station-detail__block {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.station-detail__heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--farm-text-dark);
  margin: 0;
}

.station-detail__heading-icon {
  width: 1.05rem;
  height: 1.05rem;
  color: var(--farm-accent-dark);
  flex-shrink: 0;
}

.station-detail__text {
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--farm-text-muted);
  margin: 0;
}

.station-detail__list {
  margin: 0;
  padding-left: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--farm-text-muted);
}

.station-detail__list li {
  padding-left: 0.1rem;
}
</style>
