/**
 * server/api/auth/line-token.post.ts
 * ---------------------------------------------------------------------------
 * Server route (Nitro) — ทำงานฝั่ง server เท่านั้น
 *
 * รับ authorization "code" จาก client แล้ว:
 * 1) แลกเป็น access token ผ่าน LINE token endpoint (ต้องใช้ Channel Secret
 *    ซึ่งเก็บไว้ใน runtimeConfig ฝั่ง server เท่านั้น ไม่หลุดไปถึง browser)
 * 2) เรียก LINE profile endpoint ด้วย access token เพื่อดึง userId (LINE UID)
 * 3) ส่งเฉพาะ uid (และข้อมูลที่ปลอดภัยจะแสดงผล) กลับไปให้ client
 *
 * หมายเหตุ: นี่ยังไม่ใช่ "Backend/Database" ตามความหมายเดิมของโปรเจกต์
 * เป็นเพียง server route ที่ Nuxt มีให้ในตัว (Nitro) ใช้แค่ส่งต่อ request
 * ไปยัง LINE เท่านั้น ไม่มีการเก็บข้อมูลใด ๆ ไว้ฝั่ง server
 */

interface LineTokenResponse {
  access_token: string
  id_token?: string
}

interface LineProfileResponse {
  userId: string
  displayName?: string
  pictureUrl?: string
}

export default defineEventHandler(async (event) => {
  const { code } = await readBody<{ code?: string }>(event)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Missing "code"' })
  }

  const config = useRuntimeConfig(event)

  // ---- ขั้นตอนที่ 1: แลก code เป็น access token -----------------------------
  let tokenData: LineTokenResponse
  try {
    tokenData = await $fetch<LineTokenResponse>('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.public.lineRedirectUri,
        client_id: config.public.lineChannelId,
        client_secret: config.lineChannelSecret,
      }),
    })
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Failed to exchange LINE authorization code' })
  }

  // ---- ขั้นตอนที่ 2: ใช้ access token ดึงโปรไฟล์ (เพื่อให้ได้ userId) ---------
  let profile: LineProfileResponse
  try {
    profile = await $fetch<LineProfileResponse>('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Failed to fetch LINE profile' })
  }

  return {
    uid: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
  }
})
