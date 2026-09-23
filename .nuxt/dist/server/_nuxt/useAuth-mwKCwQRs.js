import "./nuxt-B_uYz8OD.js";
import { F as useState } from "../server.mjs";
import { computed, readonly } from "vue";
//#region composables/useAuth.ts
/**
* สร้าง Anonymous ID จาก Unix Timestamp แบบ 10 หลัก (วินาที ไม่ใช่มิลลิวินาที)
* ตามสเปก เช่น 1722305521
*/
function generateTemporaryUid() {
	return String(Math.floor(Date.now() / 1e3));
}
function useAuth() {
	const authData = useState("auth-data", () => null);
	const hasAuth = computed(() => !!authData.value);
	const isAnonymous = computed(() => authData.value?.loginType === "guest");
	const isLineLoading = useState("auth-line-loading", () => false);
	const lineError = useState("auth-line-error", () => "");
	function persistAuth(data) {
		authData.value = data;
	}
	/**
	* เรียกครั้งเดียวตอน mounted ของหน้าแรก (ก่อนตัดสินใจว่าจะแสดงหน้าไหน)
	*
	* ตามสเปกล่าสุด: ทุกครั้งที่เข้าแอป (ที่ยังไม่มี userProfile ครบ) ต้องเห็นหน้า
	* Welcome ก่อนเสมอ — จะ "ไม่" ดึง authData เก่าที่ค้างจาก localStorage (เช่น
	* เคยเลือกวิธีเข้าใช้งานไปแล้วแต่ยังกรอกฟอร์มไม่เสร็จ แล้วปิด/รีเฟรชหน้าไปก่อน)
	* มาข้ามหน้า Welcome อีกต่อไป
	*
	* ข้อยกเว้นเดียวคือกรณีเพิ่งกด "เข้าสู่ระบบด้วย LINE" แล้วถูก liff.login()
	* redirect ออกไปเข้า LINE และกำลังถูก redirect กลับมาที่หน้าเดิมพอดี — กรณีนี้
	* ต้อง init LIFF เพื่อเช็ค liff.isLoggedIn() แล้วดึงโปรไฟล์ให้อัตโนมัติ (ไม่งั้น
	* ผู้ใช้จะต้องกดปุ่ม LINE ซ้ำอีกรอบหลังถูก redirect กลับมา) กรณีนี้ไม่ได้พึ่ง
	* authData เดิมใน localStorage เลย จึงไม่ขัดกับกติกาด้านบน
	*/
	async function initAuth() {}
	/**
	* Step 1 — กด "เข้าสู่ระบบด้วย LINE"
	* - init LIFF แล้วเช็คว่า login อยู่แล้วหรือยัง
	* - ยังไม่ login -> liff.login() ซึ่งจะ redirect ทั้งหน้าออกไปที่ LINE ทันที
	*   (พอ login เสร็จ LINE จะ redirect ผู้ใช้กลับมาที่ URL เดิมของ LIFF app เอง
	*   ไม่ต้องมี callback route แยก — initAuth() ด้านบนจะดักจับตอนโหลดหน้าใหม่)
	* - login อยู่แล้ว (เช่น เปิดผ่าน LINE app ที่ login ค้างไว้) -> ดึงโปรไฟล์ได้ทันที
	*/
	async function loginWithLine() {}
	/**
	* Step 1 — กด "เข้าใช้งานโดยไม่เชื่อม LINE"
	* สร้าง Anonymous ID จาก Unix Timestamp 10 หลักทันที ไม่ต้องเปิด LINE Login เลย
	*/
	function loginAsGuest() {
		persistAuth({
			loginType: "guest",
			uid: generateTemporaryUid()
		});
	}
	/** ล้าง authData ออกจาก LocalStorage (ไว้ใช้ตอนทดสอบ / reset ทั้ง flow) */
	function resetAuth() {
		authData.value = null;
	}
	/**
	* Logout ออกจาก LINE (LIFF session) จริง ๆ ถ้ามี session ค้างอยู่ — ใช้ตอนกด
	* "รีเซ็ตข้อมูล (ทดสอบ)" เพื่อให้รอบถัดไปที่เปิดแอป initAuth() จะไม่เจอ
	* liff.isLoggedIn() === true แล้ว auto-login ซ้ำจาก session เดิมทันที (ต้องเห็น
	* หน้า Welcome เหมือนเปิดระบบครั้งแรกจริง ๆ ไม่ใช่แค่ authData ในเครื่องถูกล้าง)
	* ปลอดภัยแม้ไม่เคย login ด้วย LINE เลย หรือ init ไม่สำเร็จ (เช่น เน็ตหลุด/ยังไม่
	* ตั้งค่า LIFF ID) — ปล่อยผ่านเงียบ ๆ ไม่ block การ reset ส่วนอื่น
	*/
	async function logoutLine() {}
	return {
		authData: readonly(authData),
		hasAuth,
		isAnonymous,
		isLineLoading: readonly(isLineLoading),
		lineError: readonly(lineError),
		initAuth,
		loginWithLine,
		loginAsGuest,
		resetAuth,
		logoutLine
	};
}
//#endregion
export { useAuth as t };

//# sourceMappingURL=useAuth-mwKCwQRs.js.map