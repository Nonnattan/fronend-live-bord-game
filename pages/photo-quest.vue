<script setup lang="ts">
/**
 * pages/photo-quest.vue
 * ---------------------------------------------------------------------------
 * หน้ารายการ Photo Detection Quest — guard ด้วย useRequireProfile() เหมือน
 * ทุกหน้าในแอป (ไม่แก้ logic เดิมของ guard) แต่เป็นระบบขนานที่ไม่แตะ
 * useAdventure/useOfflineSync/useRound ของระบบ Station-QR เดิมเลยสักฟังก์ชัน
 */

import QuestCard from '~/components/photo-quest/QuestCard.vue'

definePageMeta({ layout: 'app' })
const { isReady } = useRequireProfile()

const {
  quests,
  completedCount,
  totalQuests,
  isLoadingQuests,
  loadError,
  usingMockData,
  initPhotoQuest,
  isCompleted,
  canPlayOffline,
} = usePhotoQuest()

const { isOnline } = useOfflineSync()
const { hasPending, pendingCount, isSyncing, syncNow, initOfflinePhotoQuestSync } =
  useOfflinePhotoQuestSync()

onMounted(async () => {
  initOfflinePhotoQuestSync()
  await initPhotoQuest()
})

const activeQuests = computed(() => quests.value.filter((q) => q.active))

function openQuest(questId: string) {
  navigateTo(`/photo-quest/${questId}`)
}
</script>

<template>
  <div v-if="isReady" class="photo-quest-page">
    <PageHeader title="เควสถ่ายรูป" />

    <div class="photo-quest-page__content">
      <div class="photo-quest-page__summary">
        <p class="photo-quest-page__summary-text">ทำสำเร็จแล้ว {{ completedCount }}/{{ totalQuests }}</p>
        <UButton
          v-if="hasPending"
          size="xs"
          variant="outline"
          :loading="isSyncing"
          @click="syncNow"
        >
          Sync ({{ pendingCount }})
        </UButton>
      </div>

      <!-- ป้ายเตือนช่วงพัฒนา: กำลังใช้เควสตัวอย่างเพราะชีต PhotoQuests ยังว่าง
           (ลบออกพร้อมกับ services/photoQuestMockData.ts ได้เมื่อมีข้อมูลจริง) -->
      <p v-if="usingMockData" class="photo-quest-page__mock">
        <UIcon name="i-lucide-flask-conical" />
        กำลังแสดงเควสตัวอย่าง (Mock) — ยังไม่มีข้อมูลจริงจากชีต PhotoQuests
      </p>

      <p v-if="loadError" class="photo-quest-page__error">{{ loadError }}</p>
      <p v-if="isLoadingQuests" class="photo-quest-page__loading">กำลังโหลดรายการเควส...</p>

      <div v-if="!isLoadingQuests && activeQuests.length === 0 && !loadError" class="photo-quest-page__empty">
        ยังไม่มีเควสถ่ายรูปในขณะนี้
      </div>

      <div class="photo-quest-page__list">
        <QuestCard
          v-for="quest in activeQuests"
          :key="quest.id"
          :quest="quest"
          :completed="isCompleted(quest.id)"
          :offline-capable="canPlayOffline(quest)"
          :is-online="isOnline"
          @open="openQuest(quest.id)"
        />
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
.photo-quest-page {
  position: relative;
  min-height: 100%;
  padding-bottom: 5.5rem;
}

.photo-quest-page__content {
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.photo-quest-page__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.photo-quest-page__error {
  color: var(--farm-wood-dark);
  font-size: 0.85rem;
}

.photo-quest-page__mock {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--farm-text-muted);
  background: rgba(0, 0, 0, 0.04);
  border-radius: 0.5rem;
  padding: 0.5rem 0.7rem;
  margin: 0;
}

.photo-quest-page__loading,
.photo-quest-page__empty {
  color: var(--farm-text-muted);
  text-align: center;
  padding: 1.5rem 0;
}

.photo-quest-page__list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
</style>
