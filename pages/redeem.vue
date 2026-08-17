<script setup lang="ts">
/**
 * pages/redeem.vue
 * ---------------------------------------------------------------------------
 * ไฟล์ใหม่ — หน้า "จุดแลกรางวัล" สำหรับ "เจ้าหน้าที่" เท่านั้น (ตามที่ตกลงกันไว้
 * — ผู้เล่นไม่มีปุ่มยืนยันรับรางวัลในหน้าของตัวเองเลย ดู pages/round-summary.vue
 * ที่แสดงแค่สถานะอ่านอย่างเดียว)
 *
 * วิธีใช้: เจ้าหน้าที่อ่าน "รหัสรอบ" + "รหัสลูกค้า" จากหน้าจอผู้เล่น (หน้าสรุปผล
 * หลังจบเกม) แล้วพิมพ์ใส่ที่นี่ -> กด "ค้นหา" -> ระบบคำนวณคะแนนรวมของรอบนั้น +
 * ตรวจสอบเงื่อนไขรางวัลเองฝั่ง Backend (ไม่เชื่อคะแนนจาก Client เลย ดู
 * server-gas/RewardService.gs::computeRoundScore_) -> ถ้ามีสิทธิ์และยังไม่เคย
 * แลก จะมีปุ่ม "ยืนยันรับรางวัล" ให้กด
 *
 * *** หมายเหตุสำคัญเรื่องความปลอดภัย ***: แอปนี้ไม่มีระบบ Login/สิทธิ์ของ
 * เจ้าหน้าที่แยกจากผู้เล่นเลย (ตรงกับทุกหน้า Admin เดิมในโปรเจกต์ เช่น
 * การจัดการฐาน/เควส ที่เปิดผ่าน URL เดียวกันไม่มีการยืนยันตัวตนเช่นกัน) จึงตั้งใจ
 * ไม่ใช้ useRequireProfile() guard (ไม่บังคับให้เจ้าหน้าที่ต้องมีโปรไฟล์ผู้เล่นก่อน)
 * และไม่ใช้ layout 'app' (ไม่มี BottomNav ของผู้เล่นปน) — ถ้าต้องการจำกัดการเข้าถึง
 * จริงจัง ควรเพิ่มการยืนยันตัวตนแยกต่างหากในอนาคต (นอกเหนือขอบเขตงานนี้)
 */

definePageMeta({ layout: false });

const { checkRewardStatus, confirmClaim, status, isChecking, isClaiming, error } = useReward();

const roundIdInput = ref("");
const userIdInput = ref("");
const displayNameInput = ref("");
const searched = ref(false);

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

async function handleSearch(): Promise<void> {
  const roundId = roundIdInput.value.trim();
  const userId = userIdInput.value.trim();
  if (!roundId || !userId) return;
  searched.value = true;
  await checkRewardStatus(roundId, userId);
}

async function handleClaim(): Promise<void> {
  const roundId = roundIdInput.value.trim();
  const userId = userIdInput.value.trim();
  if (!roundId || !userId) return;
  await confirmClaim(roundId, userId, displayNameInput.value.trim());
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <UIcon name="i-lucide-gift" class="page__header-icon" />
      <h1 class="page__title">จุดแลกรางวัล</h1>
      <p class="page__subtitle">สำหรับเจ้าหน้าที่ — กรอกรหัสรอบ/รหัสลูกค้าจากหน้าจอผู้เล่น</p>
    </div>

    <div class="page__content">
      <form class="search-form" @submit.prevent="handleSearch">
        <UFormField label="รหัสรอบ (roundId)">
          <UInput v-model="roundIdInput" placeholder="เช่น 3f2a1b9c-..." size="lg" />
        </UFormField>
        <UFormField label="รหัสลูกค้า (userId)">
          <UInput v-model="userIdInput" placeholder="เช่น M-XXXXXXXX" size="lg" />
        </UFormField>
        <UFormField label="ชื่อผู้เล่น (ไม่บังคับ — ไว้บันทึกอ้างอิง)">
          <UInput v-model="displayNameInput" placeholder="ชื่อ-นามสกุล" size="lg" />
        </UFormField>
        <UButton type="submit" block size="lg" color="primary" :loading="isChecking"> ค้นหา </UButton>
      </form>

      <p v-if="error" class="page__error">{{ error }}</p>

      <div v-if="searched && status && !error" class="result-card">
        <template v-if="!status.reward">
          <UIcon name="i-lucide-frown" class="result-card__icon" />
          <p class="result-card__title">ยังไม่ถึงเกณฑ์รับรางวัล</p>
        </template>

        <template v-else>
          <p class="result-card__user">{{ userIdInput }}</p>
          <p class="result-card__reward">{{ status.reward.name }}</p>

          <template v-if="status.alreadyClaimed">
            <p class="result-card__claimed">
              <UIcon name="i-lucide-check-circle-2" />
              รับแล้ว {{ formatDateTime(status.claimedAt) }}
            </p>
          </template>
          <template v-else>
            <UButton size="xl" color="primary" :loading="isClaiming" @click="handleClaim">
              ยืนยันรับรางวัล
            </UButton>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--farm-cream);
}

.page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.35rem;
  padding: 2rem 1.25rem 1.25rem;
  background: linear-gradient(160deg, var(--farm-grass) 0%, var(--farm-accent-dark) 100%);
  color: var(--farm-cream);
}

.page__header-icon {
  width: 2.25rem;
  height: 2.25rem;
}

.page__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
}

.page__subtitle {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.page__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  max-width: 26rem;
  width: 100%;
  margin: 0 auto;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.page__error {
  margin: 0;
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  background: rgba(180, 60, 40, 0.1);
  color: var(--farm-wood-dark);
  font-size: 0.82rem;
  text-align: center;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1.5rem 1.25rem;
  border-radius: 1.1rem;
  background: #fff;
  border: 2px solid var(--farm-wood);
}

.result-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--farm-text-muted);
}

.result-card__title {
  margin: 0;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.result-card__user {
  margin: 0;
  font-size: 0.8rem;
  color: var(--farm-text-muted);
}

.result-card__reward {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--farm-accent-dark);
}

.result-card__claimed {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-weight: 700;
  color: var(--farm-accent-dark);
}
</style>
