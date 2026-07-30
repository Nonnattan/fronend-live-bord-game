/**
 * types/member.ts
 * ---------------------------------------------------------------------------
 * ชนิดข้อมูล "สมาชิก" ที่เก็บใน Google Sheet (sheet: "Members")
 * ต่างจาก types/profile.ts เดิม (LocalStorage ล้วน ๆ) — ตอนนี้ Google Sheet
 * คือ source of truth ส่วน LocalStorage ทำหน้าที่แค่ cache ฝั่ง client
 */

import type { LoginType } from '~/types/auth'

export interface Member {
  memberId: string
  firstName: string
  lastName: string
  phone: string
  loginType: LoginType
  lineUserId?: string
  lineDisplayName?: string
  linePictureUrl?: string
  createdAt: string
  lastLoginAt: string
}

/** ข้อมูลที่ frontend ส่งไปให้ POST /api/members/verify */
export interface VerifyMemberPayload {
  firstName: string
  lastName: string
  phone: string
  auth: {
    loginType: LoginType
    uid: string
    displayName?: string
    pictureUrl?: string
  }
}

export interface VerifyMemberResponse {
  isNewMember: boolean
  member: Member
}
