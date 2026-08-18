/**
 * utils/stationMissionMeta.ts
 * ---------------------------------------------------------------------------
 * ข้อความ/ไอคอนของภารกิจ 3 ชนิด (ดมกลิ่น/ตอบคำถาม/สแกน QR) ใช้ร่วมกันระหว่าง
 * components/station/StationMissionList.vue และ
 * components/station/StationMissionQuestion.vue กันข้อความ/ลำดับภารกิจเพี้ยน
 * ไม่ตรงกันระหว่าง 2 จุด
 */

import type { MissionKind } from '~/types/stationMission'

export interface MissionMeta {
  icon: string
  title: string
  description: string
}

/** ลำดับภารกิจที่แสดงในหน้า "ภารกิจฐาน___" เสมอ */
export const MISSION_ORDER: MissionKind[] = ['smell', 'question', 'qr']

export const MISSION_META: Record<MissionKind, MissionMeta> = {
  smell: {
    icon: '👃',
    title: 'ภารกิจดมกลิ่น',
    description: 'ลองดมกลิ่นจากจุดกิจกรรม แล้วตอบคำถาม',
  },
  question: {
    icon: '❓',
    title: 'ภารกิจตอบคำถาม',
    description: 'ตอบคำถามเกี่ยวกับฐานนี้',
  },
  qr: {
    icon: '📱',
    title: 'ภารกิจสแกน QR',
    description: 'ค้นหา QR Code ที่จุดกิจกรรมแล้วสแกนเพื่อผ่านภารกิจ',
  },
}
