import { f as useState } from '../virtual/entry.mjs';
import { computed, readonly } from 'vue';
import { z } from 'zod';

//#region utils/profileSchema.ts
/**
* utils/profileSchema.ts
* ---------------------------------------------------------------------------
* Zod schema + pure helper functions ล้วน ๆ สำหรับฟอร์ม Register โปรไฟล์
* อยู่ใน utils/ เพื่อให้ Nuxt auto-import ได้ทั้งใน component และ composable
* โดยไม่ต้องเขียน import ซ้ำทุกที่ (ตามธรรมชาติของ Nuxt 4)
*
* แยกออกจาก composable เพราะเป็น "pure logic" ล้วน ๆ ไม่ผูกกับ state/localStorage
* ทำให้ทดสอบ (unit test) ได้ง่ายและ reuse ได้ทั้งฝั่ง client/server
*/
/** ปีปัจจุบัน ใช้เป็นฐานคำนวณอายุเสมอ (ไม่ hardcode) */
function getCurrentYear() {
	return (/* @__PURE__ */ new Date()).getFullYear();
}
/**
* นิยาม "ช่วงอายุ" ทั้งหมดที่ให้เลือก — เรียงจากอายุน้อยไปมาก
* เริ่มตั้งแต่ 10 ขวบ ไปจนถึง 51 ปีขึ้นไป ("50 ++")
* maxAge ของช่วงสุดท้ายเป็นแค่เพดานสมมติ (100 ปี) ไว้คำนวณปีเกิดเก่าสุดเท่านั้น
* ไม่ได้ตัดสิทธิ์ผู้ที่อายุเกิน 100 ปีแต่อย่างใด
*/
var AGE_BRACKETS = [
	{
		code: "10-19",
		minAge: 10,
		maxAge: 19,
		label: "10-19 ปี"
	},
	{
		code: "20-30",
		minAge: 20,
		maxAge: 30,
		label: "20-30 ปี"
	},
	{
		code: "31-40",
		minAge: 31,
		maxAge: 40,
		label: "31-40 ปี"
	},
	{
		code: "41-50",
		minAge: 41,
		maxAge: 50,
		label: "41-50 ปี"
	},
	{
		code: "51+",
		minAge: 51,
		maxAge: 100,
		label: "51 ปีขึ้นไป"
	}
];
/**
* ตัวเลือกช่วงอายุที่ให้เลือกใน Select — คำนวณช่วงปีเกิดที่ตรงกันสดใหม่ทุกครั้ง
* จากปีปัจจุบัน (ห้าม hardcode ปี พ.ศ./ค.ศ. ตายตัว)
* label ที่ได้จะออกมาแบบ "1996 - 2006 (20-30 ปี)" คือช่วงปีเกิดคู่กับช่วงอายุ
* ส่วน value คือปีเกิดตัวแทนกลาง ๆ ของช่วงนั้น ใช้คำนวณ age/ageRange ย้อนกลับ
* แล้วได้ผลลัพธ์เป็นช่วงเดิมเสมอ (ไม่กระทบความถูกต้องของข้อมูล)
*
* rangeValue คือค่าช่วงปีเกิด ค.ศ. แบบข้อความล้วน ๆ ไม่มีช่องว่าง/ไม่มีข้อความ
* ภาษาไทยต่อท้าย เช่น "1996-2006" — ใช้ค่านี้ตรง ๆ เวลาบันทึกลง Google Sheet
* (คอลัมน์ Birth Year) แทนการคำนวณอายุเป็นตัวเลขแล้วส่งไป
*/
function getAgeRangeOptions() {
	const currentYear = getCurrentYear();
	return AGE_BRACKETS.map(({ code, minAge, maxAge, label }) => {
		const minBirthYear = currentYear - maxAge;
		const maxBirthYear = currentYear - minAge;
		const representativeBirthYear = Math.round((minBirthYear + maxBirthYear) / 2);
		return {
			code,
			label: `${minBirthYear} - ${maxBirthYear} (${label})`,
			value: representativeBirthYear,
			rangeValue: `${minBirthYear}-${maxBirthYear}`
		};
	});
}
/**
* แปลง "ปีเกิดตัวแทน" (ค่าที่เลือกใน USelectMenu ของ getAgeRangeOptions()) กลับเป็น
* ค่าช่วงปีเกิดแบบข้อความ (rangeValue) เพื่อส่งไปบันทึกลง Google Sheet ตรง ๆ
* คืนค่าว่าง '' ถ้าไม่พบตัวเลือกที่ตรงกัน (ไม่ควรเกิดขึ้นจริงเพราะ dropdown คุมค่าไว้แล้ว)
*/
function birthYearRangeValueFor(representativeBirthYear) {
	const match = getAgeRangeOptions().find((option) => option.value === representativeBirthYear);
	return match ? match.rangeValue : "";
}
/** คำนวณอายุจากปีเกิด โดยอิงปีปัจจุบันเสมอ */
function calculateAge(birthYear) {
	return getCurrentYear() - birthYear;
}
/**
* คำนวณช่วงอายุ (Age Range) จากอายุ
* ขอบเขต:
*   10 - 19     -> 10-19
*   20 - 30     -> 20-30
*   31 - 40     -> 31-40
*   41 - 50     -> 41-50
*   >= 51       -> 51+
*/
function calculateAgeRange(age) {
	if (age <= 19) return "10-19";
	if (age <= 30) return "20-30";
	if (age <= 40) return "31-40";
	if (age <= 50) return "41-50";
	return "51+";
}
/** แปลงรหัสช่วงอายุเป็น label ภาษาไทยไว้แสดงผลในฟอร์ม/หน้า Home — คืนค่าว่างถ้าไม่มีข้อมูล (เช่น Login LINE ซ้ำคนละเครื่อง ไม่มีเพศ/อายุ cache ไว้) */
function ageRangeLabel(range) {
	if (!range) return "-";
	return {
		"10-19": "10-19 ปี",
		"20-30": "20-30 ปี",
		"31-40": "31-40 ปี",
		"41-50": "41-50 ปี",
		"51+": "51 ปีขึ้นไป"
	}[range];
}
/** ตัวเลือกเพศที่ใช้ใน URadioGroup — ลำดับตามที่ระบุในสเปก */
var GENDER_OPTIONS = [
	{
		label: "ชาย",
		value: "male"
	},
	{
		label: "หญิง",
		value: "female"
	},
	{
		label: "LGBTQ+",
		value: "lgbtq"
	},
	{
		label: "ไม่ระบุ",
		value: "unspecified"
	}
];
/**
* Zod schema สำหรับ Validate ฟอร์ม Register โปรไฟล์ (ข้อ 7 ในสเปก)
* หมายเหตุ: birthYear ที่รับจริงคือ "ปีเกิดตัวแทน" ของช่วงอายุที่ผู้ใช้เลือก
* (มาจาก getAgeRangeOptions() ที่คุมตัวเลือกทั้งหมดไว้ที่ UI แทน)
* แต่ยังกันค่าที่ผิดปกติ (เช่น อนาคต หรือเก่าเกินจริง) ไว้เป็นชั้นความปลอดภัยสุดท้าย
*/
var profileSchema = z.object({
	firstName: z.string({ required_error: "กรุณากรอกชื่อ" }).trim().min(1, "กรุณากรอกชื่อ").min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร"),
	lastName: z.string({ required_error: "กรุณากรอกนามสกุล" }).trim().min(1, "กรุณากรอกนามสกุล").min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร").max(50, "นามสกุลต้องไม่เกิน 50 ตัวอักษร"),
	gender: z.enum([
		"male",
		"female",
		"lgbtq",
		"unspecified"
	], {
		required_error: "กรุณาเลือกเพศ",
		invalid_type_error: "กรุณาเลือกเพศ"
	}),
	birthYear: z.number({
		required_error: "กรุณาเลือกช่วงอายุ",
		invalid_type_error: "กรุณาเลือกช่วงอายุ"
	}).int().min(getCurrentYear() - 100, "ช่วงอายุไม่ถูกต้อง").max(getCurrentYear() - 10, "ช่วงอายุไม่ถูกต้อง"),
	/** เบอร์โทรศัพท์ไทย: รับเฉพาะตัวเลข 0XXXXXXXXX (10 หลัก ขึ้นต้นด้วย 0) */
	phone: z.string({ required_error: "กรุณากรอกเบอร์โทรศัพท์" }).trim().min(1, "กรุณากรอกเบอร์โทรศัพท์").regex(/^0\d{9}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก ขึ้นต้นด้วย 0)")
});
//#endregion
//#region composables/useProfile.ts
function useProfile() {
	const profile = useState("user-profile", () => null);
	const hasProfile = computed(() => !!profile.value);
	/**
	* เริ่มต้นตรวจสอบว่ามีโปรไฟล์อยู่แล้วหรือไม่ (เรียกตอน mounted ของหน้าแรก)
	* ถ้ามีข้อมูลครบแล้ว ให้ข้ามทั้งหน้า Welcome และ Profile Form เข้าหน้า Home ทันที
	*/
	function initProfile() {
	}
	/**
	* บันทึกโปรไฟล์ใหม่ลง LocalStorage หลังจาก Validate ผ่านแล้ว
	* รวม auth (ผลลัพธ์ Step 1: loginType/uid/displayName/pictureUrl) เข้ากับ
	* values (ผลลัพธ์ Step 2: ที่ผู้ใช้กรอกในฟอร์มจริง) เป็น UserProfile เดียวจบ
	* ส่วน birthYearRange/createdAt คำนวณ/สร้างที่นี่เสมอ ไม่รับจากภายนอก
	* เพื่อป้องกันข้อมูลไม่ตรงกัน (เช่น ผู้ใช้เปลี่ยนช่วงปีเกิดแต่ birthYearRange ไม่อัปเดต)
	*
	* birthYearRange มาจาก member?.birthYear (ค่าที่ Google Sheet ยืนยันแล้ว) ก่อนเสมอ
	* ถ้าไม่มี (เช่น sync ไม่สำเร็จ) ค่อย fallback ไปคำนวณจาก values.birthYear ในเครื่อง
	*/
	function saveProfile(values, auth, member) {
		const birthYearRange = member?.birthYear || birthYearRangeValueFor(values.birthYear) || void 0;
		const fullProfile = {
			loginType: auth.loginType,
			uid: auth.uid,
			displayName: member?.displayName || auth.displayName,
			pictureUrl: member?.pictureUrl || auth.pictureUrl,
			firstName: values.firstName,
			lastName: values.lastName,
			gender: values.gender,
			birthYear: values.birthYear,
			phone: values.phone,
			birthYearRange,
			createdAt: Date.now(),
			memberId: member?.memberId,
			registerDate: member?.registerDate,
			lastLogin: member?.lastLogin,
			point: member?.point ?? 0,
			totalVisit: member?.totalVisit ?? 1
		};
		profile.value = fullProfile;
		return fullProfile;
	}
	/**
	* Login ทันทีด้วยข้อมูลสมาชิกที่พบจาก lineUserId เดิมใน Google Sheet
	* (ไม่ต้องผ่านฟอร์ม ProfileForm เลย) — ใช้ตอน Login LINE แล้วระบบตรวจพบว่า
	* lineUserId นี้เคยสมัครสมาชิกไว้แล้ว (composables/useMemberApi.ts -> loginByLine())
	*
	* ดึง Birth Year/Gender กลับมาจาก Google Sheet ตรง ๆ (member.birthYear / member.gender)
	* แทนที่จะทิ้งไปเสมอเหมือนเดิม — ถ้าสมาชิกคนนี้เคยกรอก Birth Year/Gender ไว้แล้ว
	* (ไม่ว่าจะกรอกจากเครื่องไหนก็ตาม) จะได้ค่าคืนมาครบทันที ไม่ต้องกรอกซ้ำ ถ้ายังไม่มี
	* (member.birthYear เป็น null หรือ member.gender เป็นค่าว่าง) ปล่อยเป็น undefined ไว้ —
	* หน้า index.vue จะเช็คแล้วพาไปกรอกเฉพาะฟิลด์ที่ขาดต่อ (ดู hasMissingFields() ใน pages/index.vue)
	*/
	function loginFromMember(member, auth) {
		const birthYearRange = member.birthYear ?? void 0;
		const gender = member.gender || void 0;
		const fullProfile = {
			loginType: auth.loginType,
			uid: auth.uid,
			displayName: member.displayName || auth.displayName,
			pictureUrl: member.pictureUrl || auth.pictureUrl,
			firstName: member.firstName,
			lastName: member.lastName,
			phone: member.phone,
			gender,
			birthYear: void 0,
			birthYearRange,
			createdAt: Date.now(),
			memberId: member.memberId,
			registerDate: member.registerDate,
			lastLogin: member.lastLogin,
			point: member.point,
			totalVisit: member.totalVisit
		};
		profile.value = fullProfile;
		return fullProfile;
	}
	/**
	* อัปเดตเฉพาะข้อมูลที่มาจาก Google Sheet (point, totalVisit, lastLogin, รูป/ชื่อ LINE)
	* ทับลงในโปรไฟล์ปัจจุบัน — ใช้ตอนหน้า Home ดึงข้อมูลล่าสุดผ่าน getMember() โดยไม่ต้อง
	* ให้ผู้ใช้กรอกฟอร์มใหม่ และไม่กระทบ field อื่น (firstName, lastName ฯลฯ)
	*/
	function refreshFromMember(member) {
		if (!profile.value) return;
		const merged = {
			...profile.value,
			displayName: member.displayName || profile.value.displayName,
			pictureUrl: member.pictureUrl || profile.value.pictureUrl,
			lastLogin: member.lastLogin,
			point: member.point,
			totalVisit: member.totalVisit
		};
		profile.value = merged;
	}
	/**
	* อัปเดตเฉพาะ "ข้อมูลที่ผู้ใช้แก้ไขเองในหน้า Profile" (ชื่อ/นามสกุล/เบอร์โทร/เพศ/ช่วงปีเกิด)
	* ทับลงในโปรไฟล์ปัจจุบัน — ใช้หลังเรียก useMemberApi().updateMember() สำเร็จแล้ว
	* เท่านั้น (member คือแถวเดิมที่ Google Sheet ยืนยันกลับมาหลังอัปเดต ไม่ใช่แถวใหม่)
	* ไม่กระทบ field อื่นเลย (uid, memberId, point, totalVisit, loginType ฯลฯ)
	* เพื่อไม่ให้กระทบระบบ Login/Member/Round/Journey เดิม — เขียนกลับ LocalStorage +
	* useState ทันทีเพื่อให้หน้า Home/Profile เห็นค่าใหม่ทันทีโดยไม่ต้อง reload
	*/
	function updateEditableFields(member) {
		if (!profile.value) return;
		const gender = member.gender || profile.value.gender;
		const merged = {
			...profile.value,
			firstName: member.firstName || profile.value.firstName,
			lastName: member.lastName || profile.value.lastName,
			phone: member.phone || profile.value.phone,
			gender,
			birthYearRange: member.birthYear || profile.value.birthYearRange
		};
		profile.value = merged;
	}
	/** ล้างโปรไฟล์ออกจาก LocalStorage (ไว้ใช้ตอนทดสอบ / reset) */
	function resetProfile() {
		profile.value = null;
	}
	return {
		profile: readonly(profile),
		hasProfile,
		initProfile,
		saveProfile,
		loginFromMember,
		refreshFromMember,
		updateEditableFields,
		resetProfile
	};
}

export { GENDER_OPTIONS as G, ageRangeLabel as a, birthYearRangeValueFor as b, calculateAge as c, calculateAgeRange as d, getAgeRangeOptions as g, profileSchema as p, useProfile as u };
//# sourceMappingURL=useProfile-Di4CdYil.mjs.map
