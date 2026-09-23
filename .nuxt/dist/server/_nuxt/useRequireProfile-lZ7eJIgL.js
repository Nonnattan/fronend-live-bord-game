import "./error-CeCQlnc5.js";
import { t as useOfflineMode } from "../server.mjs";
import { t as useProfile } from "./useProfile-Di4CdYil.js";
import { t as useMemberApi } from "./useMemberApi-DKl7a10r.js";
import { ref } from "vue";
//#region composables/useRequireProfile.ts
/**
* composables/useRequireProfile.ts
* ---------------------------------------------------------------------------
* Guard ฝั่ง client สำหรับทุกหน้าในแอปที่ต้อง Login + กรอกโปรไฟล์ครบก่อนเท่านั้น
* (Home, Map, Reservation, Scan QR, History, Profile, Info) — ถ้ายังไม่มีโปรไฟล์
* ให้เด้งกลับไปหน้า "/" (Welcome/Login) ทันที
*
* ใช้ client-side check ล้วน ๆ (ไม่ใช่ Nuxt route middleware ทั่วไป) เพราะ
* สถานะ Login ทั้งหมดอยู่ใน LocalStorage เท่านั้น (ไม่มี server session/cookie)
* จึงต้องรอ onMounted ฝั่ง client ก่อนตัดสินใจเสมอ เหมือน pages/index.vue เดิม
*/
function useRequireProfile() {
	const { profile, hasProfile, initProfile, refreshFromMember } = useProfile();
	const { getMember } = useMemberApi();
	const { isOfflineMode } = useOfflineMode();
	return {
		profile,
		isReady: ref(false)
	};
}
//#endregion
export { useRequireProfile as t };

//# sourceMappingURL=useRequireProfile-lZ7eJIgL.js.map