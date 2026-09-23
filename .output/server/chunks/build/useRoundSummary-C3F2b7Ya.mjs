import { f as useState } from '../virtual/entry.mjs';
import { readonly } from 'vue';

//#region composables/useRoundSummary.ts
function useRoundSummary() {
	const roundSummary = useState("round-summary-last", () => null);
	/**
	* [Fix — root cause] เดิม localStorage.setItem() ตรงนี้ไม่มี try/catch เลย —
	* ถ้า throw (เช่น Safari Private Browsing ที่ throw QuotaExceededError แม้พื้นที่
	* ว่างเหลือเยอะ, พื้นที่เก็บข้อมูลเต็มจริงบนเครื่องเก่า/ราคาประหยัดที่ใช้เล่นเกม
	* กลางแจ้ง, หรือผู้ใช้ปิด Site Data ในเบราว์เซอร์) จะทำให้ saveRoundSummary()
	* throw ขึ้นไปหาผู้เรียก (pages/scan.vue::endGameAfterFinalStation() และ branch
	* Offline Mode ใน completeStationVisit()) ทันที — ฟังก์ชันฝั่งนั้นเป็น async
	* function ที่ throw กลางคันจะ "หยุดทำงานเงียบ ๆ" (unhandled promise rejection
	* ที่ไม่มี UI ไหนโชว์ให้ผู้เล่นเห็นเลย) ทำให้ทุกบรรทัดหลังจากนี้ — รวมถึง
	* stopCamera() และ navigateTo('/round-summary') — "ไม่ถูกเรียกเลย" นี่คือสาเหตุจริง
	* ที่กด "จบเกม" แล้วไม่ไปหน้า /round-summary (Popup ปิดไปแล้วเพราะบรรทัดนั้นรัน
	* ก่อน throw แต่ที่เหลือค้างเงียบ) — ครอบ try/catch กันไว้ที่นี่แทน เพื่อให้
	* saveRoundSummary() "ไม่มีวัน throw" อีกต่อไป: บันทึกลง useState (roundSummary.value)
	* ได้เสมอ (ใช้แสดงผลในเซสชันปัจจุบันได้ทันทีแม้ LocalStorage ใช้ไม่ได้เลย) ส่วน
	* LocalStorage เป็นแค่ชั้นเสริมกันข้อมูลหายตอน refresh เท่านั้น พังแล้วไม่กระทบ
	* Flow หลัก
	*/
	function saveRoundSummary(data) {
		roundSummary.value = data;
	}
	/** อ่านสแนปช็อตล่าสุด — เช็คหน่วยความจำก่อนเสมอ (เร็วกว่า) ไม่เจอค่อย fallback
	* ไป LocalStorage (เผื่อหน้า /round-summary โดน refresh ไปแล้ว) — ครอบ
	* localStorage.getItem() ด้วย try/catch เช่นกัน (เหตุผลเดียวกับ saveRoundSummary
	* ด้านบน) กันหน้า /round-summary ค้างที่ Loading Spinner ตลอดไปถ้า Storage
	* เข้าถึงไม่ได้ (isReady.value = true ที่ onMounted ของหน้านั้นจะไปไม่ถึงถ้า
	* ฟังก์ชันนี้ throw ขึ้นไปก่อน) */
	function loadRoundSummary() {
		if (roundSummary.value) return roundSummary.value;
		return null;
	}
	/** เรียกหลังผู้เล่นกดปุ่ม "ติดต่อเจ้าหน้าที่แล้ว" ที่หน้า /round-summary เท่านั้น
	* — เคลียร์สแนปช็อตทิ้ง (ใช้ครั้งเดียวจบต่อ 1 รอบ) — ครอบ try/catch เหมือนกัน
	* (เหตุผลเดียวกับ saveRoundSummary ด้านบน) กัน localStorage.removeItem() throw
	* แล้วบล็อก confirmAndGoHome() ไม่ให้ navigateTo('/home') ต่อได้ */
	function clearRoundSummary() {
		roundSummary.value = null;
	}
	return {
		roundSummary: readonly(roundSummary),
		saveRoundSummary,
		loadRoundSummary,
		clearRoundSummary
	};
}

export { useRoundSummary as u };
//# sourceMappingURL=useRoundSummary-C3F2b7Ya.mjs.map
