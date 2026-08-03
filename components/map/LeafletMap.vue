<script setup lang="ts">
/**
 * components/map/LeafletMap.vue
 * ---------------------------------------------------------------------------
 * แผนที่จริงด้วย Leaflet + OpenStreetMap (ฟรี 100%, ไม่มีค่าใช้จ่าย/ไม่ต้องใช้
 * API Key) Theme สีอ่อนใช้ CartoDB Voyager tiles — เป็น "Presentational
 * component" ใช้ร่วมกันทั้ง MiniMap.vue (interactive=false) และ
 * AdventureMap.vue (interactive=true) รับข้อมูลผ่าน props ล้วน ๆ แล้ว emit
 * "toggle" ออกไปให้หน้า (page) เป็นผู้สั่งอัปเดต state จริงผ่าน useAdventure()
 *
 * ฐานทั้ง 4 วางเป็นรูปสี่เหลี่ยม (Board Game Layout) ตามลำดับใน
 * useAdventure.ts (ข้าวโพด -> วัว -> นม -> ดิน ตามเข็มนาฬิกา) — drawPolylines()
 * เชื่อมฐาน i กับฐาน i+1 แล้ววนกลับฐานแรกในตอนท้าย ได้ Polyline ครบ 4 ด้าน
 * ของสี่เหลี่ยมพอดี ผู้เล่นกดฐานไหนก่อนก็ได้ไม่บังคับลำดับ (toggleStation ใน
 * useAdventure.ts ไม่สนใจลำดับอยู่แล้ว) สีเขียวจะขึ้นเฉพาะด้านที่ฐานปลายทาง
 * ทั้งสองผ่านแล้วเท่านั้น
 *
 * หมายเหตุ: Leaflet ต้องทำงานฝั่ง client เท่านั้น (ใช้ window/document) จึง
 * import แบบ dynamic ใน onMounted() และปิด SSR ของ component นี้ผ่าน
 * <ClientOnly> ที่ฝั่งผู้เรียกใช้เสมอ
 */
import type { AdventureStation } from '~/composables/useAdventure'
import { STATION_TYPE_META } from '~/composables/useAdventure'
import type { Map as LeafletMapInstance, Marker, Polyline } from 'leaflet'

const props = withDefaults(
  defineProps<{
    stations: AdventureStation[]
    visitedIds: readonly string[]
    /** true = แตะ Marker เพื่อ Toggle ได้ + ซูม/แพนได้ (หน้า Map เต็ม) */
    interactive?: boolean
    /** ความสูงของกล่องแผนที่ เช่น '250px' หรือ '100%' */
    height?: string
  }>(),
  { interactive: true, height: '100%' }
)

const emit = defineEmits<{
  toggle: [id: string]
  ready: []
}>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: LeafletMapInstance | null = null
let markers: Marker[] = []
let polylines: Polyline[] = []

const visitedSet = computed(() => new Set(props.visitedIds))
function isVisited(id: string): boolean {
  return visitedSet.value.has(id)
}

/** สร้าง HTML ของ Marker แบบโทเค็นเกมกระดาน (หมุดวงกลม + ไอคอนอีโมจิของฐาน) */
function buildPinHtml(station: AdventureStation, visited: boolean): string {
  const meta = STATION_TYPE_META[station.type]
  const finalBadge = station.isFinal
    ? '<span class="station-pin__final-badge">🏁</span>'
    : ''
  return `
    <div class="station-pin${visited ? ' station-pin--visited' : ''}${station.isFinal ? ' station-pin--final' : ''}" style="--pin-color:${meta.color};--pin-color-dark:${meta.colorDark}">
      <span class="station-pin__label">${station.name}</span>
      <span class="station-pin__glow"></span>
      <span class="station-pin__bounce">
        <span class="station-pin__body">
          <span class="station-pin__icon">${visited ? '✓' : meta.icon}</span>
          ${finalBadge}
        </span>
      </span>
    </div>
  `
}

async function buildDivIcon(L: typeof import('leaflet'), station: AdventureStation, visited: boolean) {
  return L.divIcon({
    className: 'station-div-icon',
    html: buildPinHtml(station, visited),
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

/**
 * วาด/อัปเดตเส้นทางรอบสี่เหลี่ยม (Board Game Path) — เชื่อมฐาน i กับฐาน i+1
 * แล้ววนกลับฐานแรกในตอนท้าย (i === length-1 -> 0) ทำให้ได้ Polyline ครบ 4
 * ด้านของสี่เหลี่ยมพอดี ไม่ใช่เส้นตรงแบบเดิม แต่ละด้านเป็นสีเขียวเฉพาะเมื่อ
 * ฐานทั้งสองปลายของด้านนั้นผ่านแล้ว (ผู้เล่นกดฐานไหนก่อนก็ได้ ไม่บังคับลำดับ)
 */
function drawPolylines(L: typeof import('leaflet')) {
  if (!map) return
  polylines.forEach((line) => line.remove())
  polylines = []

  const total = props.stations.length
  for (let i = 0; i < total; i++) {
    const from = props.stations[i]
    const to = props.stations[(i + 1) % total]
    const passed = isVisited(from.id) && isVisited(to.id)

    const line = L.polyline(
      [
        [from.lat, from.lng],
        [to.lat, to.lng],
      ],
      {
        color: passed ? '#5a9e33' : '#b9a98a',
        weight: passed ? 5 : 4,
        opacity: passed ? 0.95 : 0.7,
        dashArray: passed ? undefined : '1 12',
        lineCap: 'round',
      }
    ).addTo(map)
    polylines.push(line)
  }
}

/** วาด/อัปเดต Marker ของทุกฐาน */
async function drawMarkers(L: typeof import('leaflet')) {
  if (!map) return
  markers.forEach((marker) => marker.remove())
  markers = []

  for (const station of props.stations) {
    const icon = await buildDivIcon(L, station, isVisited(station.id))
    const marker = L.marker([station.lat, station.lng], {
      icon,
      keyboard: props.interactive,
      alt: station.name,
    }).addTo(map)

    if (props.interactive) {
      marker.on('click', () => emit('toggle', station.id))
    }

    markers.push(marker)
  }
}

function fitToStations() {
  if (!map || props.stations.length === 0) return
  const bounds = props.stations.map((s) => [s.lat, s.lng] as [number, number])
  map.fitBounds(bounds, { padding: [42, 42], maxZoom: 16 })
}

defineExpose({ fitToStations })

onMounted(async () => {
  if (!mapEl.value) return
  const L = await import('leaflet')

  map = L.map(mapEl.value, {
    zoomControl: props.interactive,
    dragging: props.interactive,
    scrollWheelZoom: props.interactive,
    doubleClickZoom: props.interactive,
    boxZoom: props.interactive,
    touchZoom: props.interactive,
    keyboard: props.interactive,
    tap: props.interactive,
    attributionControl: true,
  })

  // CartoDB Voyager — Theme แผนที่สีอ่อน อ่านง่าย เข้ากับธีม Farm Adventure
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  drawPolylines(L)
  await drawMarkers(L)
  fitToStations()

  emit('ready')
})

onBeforeUnmount(() => {
  markers.forEach((marker) => marker.remove())
  polylines.forEach((line) => line.remove())
  map?.remove()
  map = null
})

// อัปเดต Marker + Polyline ทุกครั้งที่ visitedIds เปลี่ยน (Toggle ฐาน/Reset Journey)
watch(
  () => props.visitedIds,
  async () => {
    if (!map) return
    const L = await import('leaflet')
    drawPolylines(L)
    await drawMarkers(L)
  },
  { deep: true }
)
</script>

<template>
  <div ref="mapEl" class="leaflet-map" :style="{ height }" />
</template>

<style scoped>
.leaflet-map {
  width: 100%;
  background: var(--farm-cream-dark);
}
</style>
