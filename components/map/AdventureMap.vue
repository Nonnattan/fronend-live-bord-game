<script setup lang="ts">
/**
 * components/map/AdventureMap.vue
 * ---------------------------------------------------------------------------
 * แผนที่ Adventure Map แบบเต็มจอ (ใช้ในหน้า /map) — OpenStreetMap จริงผ่าน
 * Leaflet รองรับ Zoom / Pan เต็มรูปแบบ (ลาก, scroll wheel, บีบสองนิ้ว,
 * ปุ่ม +/- ของ Leaflet เอง) 4 ฐานวางเป็นรูปสี่เหลี่ยม (Board Game Layout)
 * แตะฐานไหนก่อนก็ได้เพื่อ Toggle ผ่าน/ไม่ผ่าน ไม่บังคับลำดับ
 *
 * เป็น "Presentational component": รับ stations/visitedIds ผ่าน props แล้ว
 * emit toggle ออกไปให้หน้า (page) ตัดสินใจอัปเดต state จริง (ผ่าน
 * composables/useAdventure.ts) ทำให้ในอนาคตสลับไปใช้ข้อมูลจริงได้โดยไม่ต้อง
 * แก้ไฟล์นี้เลย
 */

import type { AdventureStation } from '~/composables/useAdventure'
import LeafletMap from './LeafletMap.vue'

defineProps<{
  stations: AdventureStation[]
  visitedIds: readonly string[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()

const leafletMapRef = ref<InstanceType<typeof LeafletMap> | null>(null)

function recenter() {
  leafletMapRef.value?.fitToStations()
}
</script>

<template>
  <div class="adventure-map">
    <ClientOnly>
      <LeafletMap
        ref="leafletMapRef"
        :stations="stations"
        :visited-ids="visitedIds"
        :interactive="true"
        height="100%"
        @toggle="(id) => emit('toggle', id)"
      />
      <template #fallback>
        <div class="adventure-map__loading">
          <UIcon name="i-lucide-loader-2" class="adventure-map__loading-icon" />
        </div>
      </template>
    </ClientOnly>

    <!-- ปุ่มจัดกึ่งกลางแผนที่ให้เห็นครบทั้ง 4 ฐาน -->
    <button type="button" class="adventure-map__recenter" aria-label="แสดงทุกฐานในมุมมองเดียว" @click="recenter">
      <UIcon name="i-lucide-locate-fixed" class="adventure-map__recenter-icon" />
    </button>

    <p class="adventure-map__hint">ลาก/บีบสองนิ้วเพื่อซูม • แตะฐานไหนก่อนก็ได้เพื่อ Toggle ผ่านฐาน</p>
  </div>
</template>

<style scoped>
.adventure-map {
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 3px solid var(--farm-wood);
  box-shadow: 0 14px 30px -14px rgba(74, 47, 24, 0.5);
  background: var(--farm-cream-dark);
  height: 65dvh;
  min-height: 20rem;
  max-height: 34rem;
}

.adventure-map :deep(.leaflet-container) {
  width: 100%;
  max-width: 100%;
}

.adventure-map__loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adventure-map__loading-icon {
  width: 2rem;
  height: 2rem;
  color: var(--farm-accent-dark);
  animation: adventure-map-spin 1s linear infinite;
}

@keyframes adventure-map-spin {
  to {
    transform: rotate(360deg);
  }
}

.adventure-map__recenter {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 500;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--farm-accent-dark);
  border: 2px solid var(--farm-accent-dark);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 14px -8px rgba(74, 47, 24, 0.6);
}

.adventure-map__recenter:active {
  transform: scale(0.94);
}

.adventure-map__recenter-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.adventure-map__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.6rem;
  z-index: 500;
  margin: 0;
  text-align: center;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--farm-text-dark);
  background: rgba(255, 248, 230, 0.85);
  padding: 0.3rem 0.6rem;
  pointer-events: none;
  width: fit-content;
  margin-inline: auto;
  border-radius: 999px;
}
</style>
