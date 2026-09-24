<script setup lang="ts">
/**
 * components/photo-question/PhotoPreview.vue
 * ---------------------------------------------------------------------------
 * แสดงรูปที่เพิ่งถ่ายให้ผู้เล่นตรวจสอบก่อนยืนยัน — presentational component
 * ล้วน ๆ ไม่มี logic กล้อง/detection ใด ๆ ในไฟล์นี้ ตามสเปก:
 * "Preview รูป -> [ถ่ายใหม่] [ยืนยันรูป]"
 */

defineProps<{
  photoDataUrl: string
}>()

const emit = defineEmits<{ retake: []; confirm: [] }>()
</script>

<template>
  <div class="photo-preview">
    <p class="photo-preview__title">ตรวจสอบรูป</p>

    <div class="photo-preview__frame">
      <img :src="photoDataUrl" alt="รูปที่ถ่าย" class="photo-preview__image" />
    </div>

    <div class="photo-preview__actions">
      <UButton variant="outline" icon="i-lucide-rotate-ccw" size="lg" @click="emit('retake')">
        ถ่ายใหม่
      </UButton>
      <UButton icon="i-lucide-check" size="lg" @click="emit('confirm')"> ยืนยัน </UButton>
    </div>
  </div>
</template>

<style scoped>
.photo-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.photo-preview__title {
  margin: 0;
  font-weight: 700;
  color: var(--farm-text-dark);
}

.photo-preview__frame {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 3 / 4;
  border-radius: 1rem;
  overflow: hidden;
  background: #000;
  border: 3px solid var(--farm-wood);
}

.photo-preview__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-preview__actions {
  display: flex;
  gap: 0.75rem;
}
</style>
