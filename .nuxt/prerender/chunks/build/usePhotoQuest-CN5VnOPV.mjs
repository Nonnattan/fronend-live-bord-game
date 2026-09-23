import { f as useState } from '../virtual/entry.mjs';
import { computed, readonly } from 'file://C:/xampp/htdocs/fronend-live-bord-game/node_modules/vue/index.mjs';

var PENDING_KEY = "photoQuestSync:pendingAttempts";
function readJson(key, fallback) {
  return fallback;
}
function useOfflinePhotoQuestSync() {
  const pendingAttempts = useState("photo-quest-sync-pending", () => []);
  const initialized = useState("photo-quest-sync-initialized", () => false);
  const isSyncing = useState("photo-quest-sync-syncing", () => false);
  const lastMessage = useState("photo-quest-sync-last-message", () => "");
  const pendingCount = computed(() => pendingAttempts.value.length);
  const hasPending = computed(() => pendingCount.value > 0);
  function initOfflinePhotoQuestSync() {
    if (initialized.value) return;
    pendingAttempts.value = readJson(PENDING_KEY, []);
    initialized.value = true;
  }
  function persistQueue(next) {
    pendingAttempts.value = next;
  }
  function queuePhotoQuestAttempt(attempt) {
    if (pendingAttempts.value.some((item) => item.questId === attempt.questId)) return;
    persistQueue([...pendingAttempts.value, attempt]);
  }
  async function syncNow() {
    return {
      success: false,
      syncedCount: 0,
      message: "\u0E01\u0E33\u0E25\u0E31\u0E07 Sync \u0E2D\u0E22\u0E39\u0E48 \u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E19 client"
    };
  }
  return {
    pendingAttempts: readonly(pendingAttempts),
    pendingCount,
    hasPending,
    isSyncing: readonly(isSyncing),
    lastMessage: readonly(lastMessage),
    initOfflinePhotoQuestSync,
    queuePhotoQuestAttempt,
    syncNow
  };
}
function hexToRgb(hex) {
  const clean = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}
function analyzeImage(image) {
  var _a, _b, _c;
  const canvas = (void 0).createElement("canvas");
  const maxSize = 200;
  const srcW = "width" in image ? image.width : 0;
  const srcH = "height" in image ? image.height : 0;
  const scale = Math.min(1, maxSize / Math.max(srcW, srcH, 1));
  canvas.width = Math.max(1, Math.round(srcW * scale));
  canvas.height = Math.max(1, Math.round(srcH * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E23\u0E49\u0E32\u0E07 Canvas 2D Context \u0E44\u0E14\u0E49 (\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A)");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    sumR += (_a = data[i]) != null ? _a : 0;
    sumG += (_b = data[i + 1]) != null ? _b : 0;
    sumB += (_c = data[i + 2]) != null ? _c : 0;
    count += 1;
  }
  const avgR = sumR / count;
  const avgG = sumG / count;
  const avgB = sumB / count;
  return {
    avgR,
    avgG,
    avgB,
    avgBrightness: (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255
  };
}
function detectColor(input) {
  const target = hexToRgb(input.rule.target);
  if (!target) return {
    passed: false,
    confidence: 0,
    reason: `target \u0E02\u0E2D\u0E07\u0E40\u0E04\u0E27\u0E2A\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E2A\u0E35 hex \u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 ("${input.rule.target}")`,
    providerId: "canvas-color-v1"
  };
  const { avgR, avgG, avgB } = analyzeImage(input.image);
  const maxDistance = Math.sqrt(255 ** 2 * 3);
  const similarity = 1 - Math.sqrt((avgR - target.r) ** 2 + (avgG - target.g) ** 2 + (avgB - target.b) ** 2) / maxDistance;
  const passed = similarity >= input.rule.confidence;
  return {
    passed,
    confidence: Number(similarity.toFixed(3)),
    reason: passed ? void 0 : `\u0E2A\u0E35\u0E43\u0E19\u0E20\u0E32\u0E1E\u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E2A\u0E35\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 (\u0E04\u0E27\u0E32\u0E21\u0E04\u0E25\u0E49\u0E32\u0E22 ${(similarity * 100).toFixed(0)}%)`,
    providerId: "canvas-color-v1"
  };
}
function detectImageCondition(input) {
  const { avgBrightness } = analyzeImage(input.image);
  switch (input.rule.target) {
    case "min-brightness": {
      const passed = avgBrightness >= input.rule.confidence;
      return {
        passed,
        confidence: Number(avgBrightness.toFixed(3)),
        reason: passed ? void 0 : "\u0E20\u0E32\u0E1E\u0E21\u0E37\u0E14\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B \u0E01\u0E23\u0E38\u0E13\u0E32\u0E16\u0E48\u0E32\u0E22\u0E43\u0E19\u0E17\u0E35\u0E48\u0E17\u0E35\u0E48\u0E21\u0E35\u0E41\u0E2A\u0E07\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D",
        providerId: "canvas-color-v1"
      };
    }
    default:
      return {
        passed: false,
        confidence: 0,
        reason: `\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02 image_condition target="${input.rule.target}"`,
        providerId: "canvas-color-v1"
      };
  }
}
var colorProvider = {
  id: "canvas-color-v1",
  supports: ["color", "image_condition"],
  isOfflineCapable: true,
  async detect(input) {
    if (input.rule.detectionType === "color") return detectColor(input);
    if (input.rule.detectionType === "image_condition") return detectImageCondition(input);
    throw new Error(`colorProvider \u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A detectionType="${input.rule.detectionType}"`);
  }
};
var COCO_LABEL_TH = {
  person: "\u0E04\u0E19",
  bicycle: "\u0E08\u0E31\u0E01\u0E23\u0E22\u0E32\u0E19",
  car: "\u0E23\u0E16\u0E22\u0E19\u0E15\u0E4C",
  motorcycle: "\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E44\u0E0B\u0E04\u0E4C",
  airplane: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E1A\u0E34\u0E19",
  bus: "\u0E23\u0E16\u0E1A\u0E31\u0E2A",
  train: "\u0E23\u0E16\u0E44\u0E1F",
  truck: "\u0E23\u0E16\u0E1A\u0E23\u0E23\u0E17\u0E38\u0E01",
  boat: "\u0E40\u0E23\u0E37\u0E2D",
  "traffic light": "\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E44\u0E1F\u0E08\u0E23\u0E32\u0E08\u0E23",
  "fire hydrant": "\u0E2B\u0E31\u0E27\u0E08\u0E48\u0E32\u0E22\u0E19\u0E49\u0E33\u0E14\u0E31\u0E1A\u0E40\u0E1E\u0E25\u0E34\u0E07",
  "stop sign": "\u0E1B\u0E49\u0E32\u0E22\u0E2B\u0E22\u0E38\u0E14",
  "parking meter": "\u0E21\u0E34\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E08\u0E2D\u0E14\u0E23\u0E16",
  bench: "\u0E21\u0E49\u0E32\u0E19\u0E31\u0E48\u0E07",
  bird: "\u0E19\u0E01",
  cat: "\u0E41\u0E21\u0E27",
  dog: "\u0E2A\u0E38\u0E19\u0E31\u0E02",
  horse: "\u0E21\u0E49\u0E32",
  sheep: "\u0E41\u0E01\u0E30",
  cow: "\u0E27\u0E31\u0E27",
  elephant: "\u0E0A\u0E49\u0E32\u0E07",
  bear: "\u0E2B\u0E21\u0E35",
  zebra: "\u0E21\u0E49\u0E32\u0E25\u0E32\u0E22",
  giraffe: "\u0E22\u0E35\u0E23\u0E32\u0E1F",
  backpack: "\u0E40\u0E1B\u0E49\u0E2A\u0E30\u0E1E\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07",
  umbrella: "\u0E23\u0E48\u0E21",
  handbag: "\u0E01\u0E23\u0E30\u0E40\u0E1B\u0E4B\u0E32\u0E16\u0E37\u0E2D",
  tie: "\u0E40\u0E19\u0E01\u0E44\u0E17",
  suitcase: "\u0E01\u0E23\u0E30\u0E40\u0E1B\u0E4B\u0E32\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07",
  frisbee: "\u0E08\u0E32\u0E19\u0E23\u0E48\u0E2D\u0E19",
  skis: "\u0E2A\u0E01\u0E35",
  snowboard: "\u0E2A\u0E42\u0E19\u0E27\u0E4C\u0E1A\u0E2D\u0E23\u0E4C\u0E14",
  "sports ball": "\u0E25\u0E39\u0E01\u0E1A\u0E2D\u0E25",
  kite: "\u0E27\u0E48\u0E32\u0E27",
  "baseball bat": "\u0E44\u0E21\u0E49\u0E40\u0E1A\u0E2A\u0E1A\u0E2D\u0E25",
  "baseball glove": "\u0E16\u0E38\u0E07\u0E21\u0E37\u0E2D\u0E40\u0E1A\u0E2A\u0E1A\u0E2D\u0E25",
  skateboard: "\u0E2A\u0E40\u0E01\u0E47\u0E15\u0E1A\u0E2D\u0E23\u0E4C\u0E14",
  surfboard: "\u0E01\u0E23\u0E30\u0E14\u0E32\u0E19\u0E42\u0E15\u0E49\u0E04\u0E25\u0E37\u0E48\u0E19",
  "tennis racket": "\u0E44\u0E21\u0E49\u0E40\u0E17\u0E19\u0E19\u0E34\u0E2A",
  bottle: "\u0E02\u0E27\u0E14",
  "wine glass": "\u0E41\u0E01\u0E49\u0E27\u0E44\u0E27\u0E19\u0E4C",
  cup: "\u0E41\u0E01\u0E49\u0E27\u0E19\u0E49\u0E33",
  fork: "\u0E2A\u0E49\u0E2D\u0E21",
  knife: "\u0E21\u0E35\u0E14",
  spoon: "\u0E0A\u0E49\u0E2D\u0E19",
  bowl: "\u0E0A\u0E32\u0E21",
  banana: "\u0E01\u0E25\u0E49\u0E27\u0E22",
  apple: "\u0E41\u0E2D\u0E1B\u0E40\u0E1B\u0E34\u0E25",
  sandwich: "\u0E41\u0E0B\u0E19\u0E14\u0E4C\u0E27\u0E34\u0E0A",
  orange: "\u0E2A\u0E49\u0E21",
  broccoli: "\u0E1A\u0E23\u0E2D\u0E01\u0E42\u0E04\u0E25\u0E35",
  carrot: "\u0E41\u0E04\u0E23\u0E2D\u0E17",
  "hot dog": "\u0E2E\u0E2D\u0E17\u0E14\u0E2D\u0E01",
  pizza: "\u0E1E\u0E34\u0E0B\u0E0B\u0E48\u0E32",
  donut: "\u0E42\u0E14\u0E19\u0E31\u0E17",
  cake: "\u0E40\u0E04\u0E49\u0E01",
  chair: "\u0E40\u0E01\u0E49\u0E32\u0E2D\u0E35\u0E49",
  couch: "\u0E42\u0E0B\u0E1F\u0E32",
  "potted plant": "\u0E15\u0E49\u0E19\u0E44\u0E21\u0E49\u0E43\u0E19\u0E01\u0E23\u0E30\u0E16\u0E32\u0E07",
  bed: "\u0E40\u0E15\u0E35\u0E22\u0E07",
  "dining table": "\u0E42\u0E15\u0E4A\u0E30\u0E2D\u0E32\u0E2B\u0E32\u0E23",
  toilet: "\u0E42\u0E16\u0E2A\u0E38\u0E02\u0E20\u0E31\u0E13\u0E11\u0E4C",
  tv: "\u0E42\u0E17\u0E23\u0E17\u0E31\u0E28\u0E19\u0E4C",
  laptop: "\u0E42\u0E19\u0E49\u0E15\u0E1A\u0E38\u0E4A\u0E01",
  mouse: "\u0E40\u0E21\u0E32\u0E2A\u0E4C",
  remote: "\u0E23\u0E35\u0E42\u0E21\u0E15",
  keyboard: "\u0E04\u0E35\u0E22\u0E4C\u0E1A\u0E2D\u0E23\u0E4C\u0E14",
  "cell phone": "\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D",
  microwave: "\u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F",
  oven: "\u0E40\u0E15\u0E32\u0E2D\u0E1A",
  toaster: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E1B\u0E34\u0E49\u0E07\u0E02\u0E19\u0E21\u0E1B\u0E31\u0E07",
  sink: "\u0E2D\u0E48\u0E32\u0E07\u0E25\u0E49\u0E32\u0E07\u0E21\u0E37\u0E2D",
  refrigerator: "\u0E15\u0E39\u0E49\u0E40\u0E22\u0E47\u0E19",
  book: "\u0E2B\u0E19\u0E31\u0E07\u0E2A\u0E37\u0E2D",
  clock: "\u0E19\u0E32\u0E2C\u0E34\u0E01\u0E32",
  vase: "\u0E41\u0E08\u0E01\u0E31\u0E19",
  scissors: "\u0E01\u0E23\u0E23\u0E44\u0E01\u0E23",
  "teddy bear": "\u0E15\u0E38\u0E4A\u0E01\u0E15\u0E32\u0E2B\u0E21\u0E35",
  "hair drier": "\u0E44\u0E14\u0E23\u0E4C\u0E40\u0E1B\u0E48\u0E32\u0E1C\u0E21",
  toothbrush: "\u0E41\u0E1B\u0E23\u0E07\u0E2A\u0E35\u0E1F\u0E31\u0E19"
};
var EXTRA_ALIASES = {
  \u0E21\u0E19\u0E38\u0E29\u0E22\u0E4C: "person",
  \u0E1A\u0E38\u0E04\u0E04\u0E25: "person",
  \u0E1C\u0E39\u0E49\u0E04\u0E19: "person",
  \u0E19\u0E31\u0E01\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27: "person",
  \u0E2B\u0E21\u0E32: "dog",
  \u0E2B\u0E21\u0E32\u0E19\u0E49\u0E2D\u0E22: "dog",
  \u0E41\u0E21\u0E27\u0E40\u0E2B\u0E21\u0E35\u0E22\u0E27: "cat",
  \u0E42\u0E04: "cow",
  \u0E27\u0E31\u0E27\u0E04\u0E27\u0E32\u0E22: "cow",
  \u0E04\u0E27\u0E32\u0E22: "cow",
  \u0E01\u0E23\u0E30\u0E1A\u0E37\u0E2D: "cow",
  \u0E15\u0E49\u0E19\u0E44\u0E21\u0E49: "potted plant",
  \u0E01\u0E23\u0E30\u0E16\u0E32\u0E07\u0E15\u0E49\u0E19\u0E44\u0E21\u0E49: "potted plant",
  \u0E44\u0E21\u0E49\u0E01\u0E23\u0E30\u0E16\u0E32\u0E07: "potted plant",
  \u0E1E\u0E37\u0E0A: "potted plant",
  \u0E23\u0E16: "car",
  \u0E23\u0E16\u0E01\u0E23\u0E30\u0E1A\u0E30: "truck",
  \u0E08\u0E22\u0E22: "motorcycle",
  \u0E21\u0E2D\u0E44\u0E0B\u0E04\u0E4C: "motorcycle",
  \u0E02\u0E27\u0E14\u0E19\u0E49\u0E33: "bottle",
  \u0E41\u0E01\u0E49\u0E27: "cup",
  \u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D: "cell phone",
  \u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C: "cell phone",
  \u0E19\u0E32\u0E2C\u0E34\u0E01\u0E32\u0E41\u0E02\u0E27\u0E19: "clock",
  \u0E2B\u0E19\u0E31\u0E07\u0E2A\u0E37\u0E2D\u0E40\u0E25\u0E48\u0E21: "book"
};
var COCO_LABEL_GROUPS = {
  any: [],
  \u0E43\u0E14\u0E01\u0E47\u0E44\u0E14\u0E49: [],
  \u0E2D\u0E30\u0E44\u0E23\u0E01\u0E47\u0E44\u0E14\u0E49: [],
  animal: [
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe"
  ],
  \u0E2A\u0E31\u0E15\u0E27\u0E4C: [
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe"
  ],
  "farm-animal": [
    "cow",
    "sheep",
    "horse",
    "bird",
    "dog",
    "cat"
  ],
  \u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E43\u0E19\u0E1F\u0E32\u0E23\u0E4C\u0E21: [
    "cow",
    "sheep",
    "horse",
    "bird",
    "dog",
    "cat"
  ],
  vehicle: [
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat"
  ],
  \u0E22\u0E32\u0E19\u0E1E\u0E32\u0E2B\u0E19\u0E30: [
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat"
  ],
  food: [
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake"
  ],
  \u0E2D\u0E32\u0E2B\u0E32\u0E23: [
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake"
  ],
  fruit: [
    "banana",
    "apple",
    "orange"
  ],
  \u0E1C\u0E25\u0E44\u0E21\u0E49: [
    "banana",
    "apple",
    "orange"
  ],
  vegetable: ["broccoli", "carrot"],
  \u0E1C\u0E31\u0E01: ["broccoli", "carrot"],
  plant: ["potted plant"],
  furniture: [
    "chair",
    "couch",
    "bed",
    "dining table",
    "bench"
  ],
  \u0E40\u0E1F\u0E2D\u0E23\u0E4C\u0E19\u0E34\u0E40\u0E08\u0E2D\u0E23\u0E4C: [
    "chair",
    "couch",
    "bed",
    "dining table",
    "bench"
  ]
};
var LOOKUP = (() => {
  const map = {};
  for (const en of Object.keys(COCO_LABEL_TH)) {
    map[normalizeKey(en)] = en;
    map[normalizeKey(COCO_LABEL_TH[en])] = en;
  }
  for (const [alias, en] of Object.entries(EXTRA_ALIASES)) map[normalizeKey(alias)] = en;
  return map;
})();
function normalizeKey(value) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function resolveTargetLabels(target) {
  var _a;
  const raw = (target != null ? target : "").trim();
  if (!raw) return [];
  const group = (_a = COCO_LABEL_GROUPS[normalizeKey(raw)]) != null ? _a : COCO_LABEL_GROUPS[raw.trim().toLowerCase()];
  if (group) return [...group];
  const parts = raw.split(/[,|]/).map((p) => p.trim()).filter(Boolean);
  const labels = [];
  for (const part of parts) {
    const partGroup = COCO_LABEL_GROUPS[normalizeKey(part)];
    if (partGroup) {
      if (partGroup.length === 0) return [];
      labels.push(...partGroup);
      continue;
    }
    const label = LOOKUP[normalizeKey(part)];
    if (label) labels.push(label);
  }
  if (labels.length === 0) return null;
  return [...new Set(labels)];
}
function toThaiLabel(label) {
  var _a;
  return (_a = COCO_LABEL_TH[label]) != null ? _a : label;
}
var PROVIDER_ID = "tfjs-coco-ssd-v1";
var MAX_INPUT_SIZE = 640;
var DEFAULT_MAX_BOXES = 20;
var MODEL_MIN_SCORE = 0.2;
async function loadModel() {
  throw new Error("Object Detection \u0E17\u0E33\u0E07\u0E32\u0E19\u0E44\u0E14\u0E49\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E1D\u0E31\u0E48\u0E07 Browser \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19");
}
var cachedOfflineCapable = false;
function toModelInput(image) {
  const srcW = image.width || 1;
  const srcH = image.height || 1;
  const scale = Math.min(1, MAX_INPUT_SIZE / Math.max(srcW, srcH));
  const canvas = (void 0).createElement("canvas");
  canvas.width = Math.max(1, Math.round(srcW * scale));
  canvas.height = Math.max(1, Math.round(srcH * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E23\u0E49\u0E32\u0E07 Canvas 2D Context \u0E44\u0E14\u0E49 (\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A)");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
function describeFound(predictions) {
  if (predictions.length === 0) return "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E27\u0E31\u0E15\u0E16\u0E38\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E44\u0E14\u0E49\u0E43\u0E19\u0E20\u0E32\u0E1E\u0E40\u0E25\u0E22";
  return `\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E15\u0E23\u0E27\u0E08\u0E1E\u0E1A\u0E43\u0E19\u0E20\u0E32\u0E1E: ${predictions.slice(0, 3).map((p) => `${toThaiLabel(p.class)} ${(p.score * 100).toFixed(0)}%`).join(", ")}`;
}
var PROVIDERS = [
  colorProvider,
  {
    id: PROVIDER_ID,
    supports: [
      "object",
      "specific_object",
      "person"
    ],
    get isOfflineCapable() {
      return cachedOfflineCapable;
    },
    async detect(input) {
      var _a, _b;
      const { rule } = input;
      const targetLabels = rule.detectionType === "person" ? ["person"] : resolveTargetLabels(rule.target);
      if (targetLabels === null) return {
        passed: false,
        confidence: 0,
        reason: `target \u0E02\u0E2D\u0E07\u0E40\u0E04\u0E27\u0E2A\u0E19\u0E35\u0E49 ("${rule.target}") \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E42\u0E21\u0E40\u0E14\u0E25\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01 \u2014 \u0E42\u0E1B\u0E23\u0E14\u0E41\u0E01\u0E49\u0E04\u0E48\u0E32\u0E43\u0E19\u0E0A\u0E35\u0E15 PhotoQuests`,
        providerId: PROVIDER_ID
      };
      const canvas = toModelInput(input.image);
      let model;
      try {
        model = await loadModel();
      } catch (err) {
        const detail = err instanceof Error ? err.message : "";
        throw new Error(`\u0E22\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E42\u0E21\u0E40\u0E14\u0E25\u0E15\u0E23\u0E27\u0E08\u0E08\u0E31\u0E1A\u0E20\u0E32\u0E1E\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E42\u0E2B\u0E25\u0E14\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01 (\u0E04\u0E23\u0E31\u0E49\u0E07\u0E15\u0E48\u0E2D\u0E44\u0E1B\u0E43\u0E0A\u0E49\u0E44\u0E14\u0E49\u0E41\u0E1A\u0E1A\u0E2D\u0E2D\u0E1F\u0E44\u0E25\u0E19\u0E4C)${detail ? ` [${detail}]` : ""}`);
      }
      const maxBoxes = Number((_b = (_a = rule.options) == null ? void 0 : _a.maxNumBoxes) != null ? _b : DEFAULT_MAX_BOXES);
      const predictions = await model.detect(canvas, maxBoxes, MODEL_MIN_SCORE);
      const best = (targetLabels.length === 0 ? predictions : predictions.filter((p) => targetLabels.includes(p.class))).reduce((acc, p) => acc === null || p.score > acc.score ? p : acc, null);
      const confidence = best ? Number(best.score.toFixed(3)) : 0;
      if (!!best && best.score >= rule.confidence) return {
        passed: true,
        confidence,
        providerId: PROVIDER_ID
      };
      const wanted = targetLabels.length === 0 ? "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E43\u0E14 \u0E46" : targetLabels.map(toThaiLabel).slice(0, 4).join(" \u0E2B\u0E23\u0E37\u0E2D ");
      return {
        passed: false,
        confidence,
        reason: best ? `\u0E40\u0E08\u0E2D${wanted}\u0E43\u0E19\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E49\u0E27 \u0E41\u0E15\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E0A\u0E31\u0E14\u0E40\u0E08\u0E19\u0E1E\u0E2D (${(best.score * 100).toFixed(0)}% \u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 ${(rule.confidence * 100).toFixed(0)}%) \u0E25\u0E2D\u0E07\u0E40\u0E02\u0E49\u0E32\u0E43\u0E01\u0E25\u0E49\u0E02\u0E36\u0E49\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E16\u0E48\u0E32\u0E22\u0E43\u0E19\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E07\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E01\u0E27\u0E48\u0E32\u0E19\u0E35\u0E49` : `\u0E15\u0E23\u0E27\u0E08\u0E44\u0E21\u0E48\u0E1E\u0E1A${wanted}\u0E43\u0E19\u0E20\u0E32\u0E1E \u2014 ${describeFound(predictions)}`,
        providerId: PROVIDER_ID
      };
    }
  },
  {
    id: "object-detection-stub-v1",
    supports: [
      "object",
      "specific_object",
      "person"
    ],
    isOfflineCapable: false,
    async detect(_input) {
      return {
        passed: false,
        confidence: 0,
        reason: "Detection Type \u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07\u0E43\u0E19\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E19\u0E19\u0E35\u0E49 (\u0E23\u0E2D Phase 2 \u2014 \u0E1C\u0E39\u0E01 TensorFlow.js/MediaPipe) \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48",
        providerId: "object-detection-stub-v1"
      };
    }
  }
];
function findProvider(detectionType, explicitProviderId) {
  var _a, _b;
  if (explicitProviderId) return (_a = PROVIDERS.find((p) => p.id === explicitProviderId)) != null ? _a : null;
  return (_b = PROVIDERS.find((p) => p.supports.includes(detectionType))) != null ? _b : null;
}
function isDetectionAvailableOffline(detectionType, providerId) {
  const provider = findProvider(detectionType, providerId);
  return !!provider && provider.isOfflineCapable;
}
async function runDetection(input) {
  const provider = findProvider(input.rule.detectionType, input.rule.provider);
  if (!provider) return {
    passed: false,
    confidence: 0,
    reason: `\u0E44\u0E21\u0E48\u0E1E\u0E1A Detection Provider \u0E17\u0E35\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A detectionType="${input.rule.detectionType}"`,
    providerId: "none"
  };
  try {
    return await provider.detect(input);
  } catch (err) {
    return {
      passed: false,
      confidence: 0,
      reason: err instanceof Error ? err.message : "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E20\u0E32\u0E1E \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07",
      providerId: provider.id
    };
  }
}
function usePhotoQuest() {
  const quests = useState("photo-quest-list", () => []);
  const completedIds = useState("photo-quest-completed", () => []);
  const isLoadingQuests = useState("photo-quest-loading", () => false);
  const loadError = useState("photo-quest-load-error", () => "");
  const usingMockData = useState("photo-quest-using-mock", () => false);
  const completedCount = computed(() => completedIds.value.length);
  const totalQuests = computed(() => quests.value.filter((q) => q.active).length);
  function getStoredCompleted() {
    return [];
  }
  function persistCompleted(next) {
    completedIds.value = next;
  }
  function isCompleted(questId) {
    return completedIds.value.includes(questId);
  }
  async function initPhotoQuest() {
    completedIds.value = getStoredCompleted();
  }
  function findQuest(questId) {
    return quests.value.find((q) => q.id === questId);
  }
  function canPlayOffline(quest) {
    return isDetectionAvailableOffline(quest.rule.detectionType, quest.rule.provider);
  }
  async function attemptQuest(quest, image) {
    const result = await runDetection({
      image,
      rule: quest.rule
    });
    if (result.passed && !isCompleted(quest.id)) {
      persistCompleted([...completedIds.value, quest.id]);
      const attempt = {
        clientId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        questId: quest.id,
        questName: quest.name,
        points: quest.points,
        result,
        attemptedAt: Date.now(),
        synced: false
      };
      const { queuePhotoQuestAttempt } = useOfflinePhotoQuestSync();
      queuePhotoQuestAttempt(attempt);
    }
    return result;
  }
  return {
    quests: readonly(quests),
    completedIds: readonly(completedIds),
    completedCount,
    totalQuests,
    isLoadingQuests: readonly(isLoadingQuests),
    loadError: readonly(loadError),
    usingMockData: readonly(usingMockData),
    initPhotoQuest,
    findQuest,
    isCompleted,
    canPlayOffline,
    attemptQuest
  };
}

export { useOfflinePhotoQuestSync as a, usePhotoQuest as u };
//# sourceMappingURL=usePhotoQuest-CN5VnOPV.mjs.map
