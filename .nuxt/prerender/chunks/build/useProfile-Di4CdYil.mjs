import { f as useState } from '../virtual/entry.mjs';
import { computed, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';
import { z } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/zod/index.js';

function getCurrentYear() {
  return (/* @__PURE__ */ new Date()).getFullYear();
}
var AGE_BRACKETS = [
  {
    code: "10-19",
    minAge: 10,
    maxAge: 19,
    label: "10-19 \u0E1B\u0E35"
  },
  {
    code: "20-30",
    minAge: 20,
    maxAge: 30,
    label: "20-30 \u0E1B\u0E35"
  },
  {
    code: "31-40",
    minAge: 31,
    maxAge: 40,
    label: "31-40 \u0E1B\u0E35"
  },
  {
    code: "41-50",
    minAge: 41,
    maxAge: 50,
    label: "41-50 \u0E1B\u0E35"
  },
  {
    code: "51+",
    minAge: 51,
    maxAge: 100,
    label: "51 \u0E1B\u0E35\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B"
  }
];
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
function birthYearRangeValueFor(representativeBirthYear) {
  const match = getAgeRangeOptions().find((option) => option.value === representativeBirthYear);
  return match ? match.rangeValue : "";
}
function calculateAge(birthYear) {
  return getCurrentYear() - birthYear;
}
function calculateAgeRange(age) {
  if (age <= 19) return "10-19";
  if (age <= 30) return "20-30";
  if (age <= 40) return "31-40";
  if (age <= 50) return "41-50";
  return "51+";
}
function ageRangeLabel(range) {
  if (!range) return "-";
  return {
    "10-19": "10-19 \u0E1B\u0E35",
    "20-30": "20-30 \u0E1B\u0E35",
    "31-40": "31-40 \u0E1B\u0E35",
    "41-50": "41-50 \u0E1B\u0E35",
    "51+": "51 \u0E1B\u0E35\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B"
  }[range];
}
var GENDER_OPTIONS = [
  {
    label: "\u0E0A\u0E32\u0E22",
    value: "male"
  },
  {
    label: "\u0E2B\u0E0D\u0E34\u0E07",
    value: "female"
  },
  {
    label: "LGBTQ+",
    value: "lgbtq"
  },
  {
    label: "\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38",
    value: "unspecified"
  }
];
var profileSchema = z.object({
  firstName: z.string({ required_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D" }).trim().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D").min(2, "\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 2 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23").max(50, "\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 50 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23"),
  lastName: z.string({ required_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25" }).trim().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25").min(2, "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 2 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23").max(50, "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 50 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23"),
  gender: z.enum([
    "male",
    "female",
    "lgbtq",
    "unspecified"
  ], {
    required_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E1E\u0E28",
    invalid_type_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E1E\u0E28"
  }),
  birthYear: z.number({
    required_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38",
    invalid_type_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38"
  }).int().min(getCurrentYear() - 100, "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07").max(getCurrentYear() - 10, "\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E32\u0E22\u0E38\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"),
  /** เบอร์โทรศัพท์ไทย: รับเฉพาะตัวเลข 0XXXXXXXXX (10 หลัก ขึ้นต้นด้วย 0) */
  phone: z.string({ required_error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C" }).trim().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C").regex(/^0\d{9}$/, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E43\u0E2B\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (10 \u0E2B\u0E25\u0E31\u0E01 \u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 0)")
});
function useProfile() {
  const profile = useState("user-profile", () => null);
  const hasProfile = computed(() => !!profile.value);
  function initProfile() {
  }
  function saveProfile(values, auth, member) {
    var _a, _b;
    const birthYearRange = (member == null ? void 0 : member.birthYear) || birthYearRangeValueFor(values.birthYear) || void 0;
    const fullProfile = {
      loginType: auth.loginType,
      uid: auth.uid,
      displayName: (member == null ? void 0 : member.displayName) || auth.displayName,
      pictureUrl: (member == null ? void 0 : member.pictureUrl) || auth.pictureUrl,
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      birthYear: values.birthYear,
      phone: values.phone,
      birthYearRange,
      createdAt: Date.now(),
      memberId: member == null ? void 0 : member.memberId,
      registerDate: member == null ? void 0 : member.registerDate,
      lastLogin: member == null ? void 0 : member.lastLogin,
      point: (_a = member == null ? void 0 : member.point) != null ? _a : 0,
      totalVisit: (_b = member == null ? void 0 : member.totalVisit) != null ? _b : 1
    };
    profile.value = fullProfile;
    return fullProfile;
  }
  function loginFromMember(member, auth) {
    var _a;
    const birthYearRange = (_a = member.birthYear) != null ? _a : void 0;
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
