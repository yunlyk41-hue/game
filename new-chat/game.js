const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  hpValue: document.getElementById("hpValue"),
  hpBar: document.getElementById("hpBar"),
  xpValue: document.getElementById("xpValue"),
  xpBar: document.getElementById("xpBar"),
  levelValue: document.getElementById("levelValue"),
  classValue: document.getElementById("classValue"),
  questValue: document.getElementById("questValue"),
  statStr: document.getElementById("statStr"),
  statAgi: document.getElementById("statAgi"),
  statVit: document.getElementById("statVit"),
  statSpi: document.getElementById("statSpi"),
  skill1Name: document.getElementById("skill1Name"),
  skill1Key: document.getElementById("skill1Key"),
  skill1Cooldown: document.getElementById("skill1Cooldown"),
  skill2Name: document.getElementById("skill2Name"),
  skill2Key: document.getElementById("skill2Key"),
  skill2Cooldown: document.getElementById("skill2Cooldown"),
  dialogue: document.getElementById("dialogueText"),
  story: document.getElementById("storyText"),
  inventoryToggle: document.getElementById("inventoryToggle"),
  inventoryModal: document.getElementById("inventoryModal"),
  inventoryClose: document.getElementById("inventoryClose"),
  inventoryList: document.getElementById("inventoryList"),
  weaponValue: document.getElementById("weaponValue"),
  charmValue: document.getElementById("charmValue"),
  bossPanel: document.getElementById("bossPanel"),
  bossName: document.getElementById("bossName"),
  bossBar: document.getElementById("bossBar"),
  startScreen: document.getElementById("startScreen"),
  startButton: document.getElementById("startButton"),
  classDescription: document.getElementById("classDescription"),
  classCards: Array.from(document.querySelectorAll(".character-card")),
  promotionScreen: document.getElementById("promotionScreen"),
  promotionGrid: document.getElementById("promotionGrid"),
};

const classTemplates = {
  exorcist: {
    label: "퇴마사 윤",
    description: "퇴마사 윤: 오래된 부적검과 함께 병동의 균열을 봉인하러 왔습니다.",
    color: "#9fd4ff",
    accent: "#d9efff",
    stats: { str: 6, agi: 4, vit: 5, spi: 7 },
    startingItems: [
      { id: "seal_blade", name: "부적검", slot: "weapon", description: "봉인 문양이 새겨진 검. 공격력 +4", bonus: { str: 4 } },
      { id: "prayer_bead", name: "기도 염주", slot: "charm", description: "정신을 붙잡는 염주. 정신력 +2", bonus: { spi: 2 } },
    ],
  },
  runaway: {
    label: "도망자 민",
    description: "도망자 민: 살아남기 위해 무엇이든 쥐고 달릴 준비가 되어 있습니다.",
    color: "#9bffd5",
    accent: "#ecfff6",
    stats: { str: 4, agi: 7, vit: 4, spi: 5 },
    startingItems: [
      { id: "rust_knife", name: "녹슨 단검", slot: "weapon", description: "짧지만 빠르다. 민첩 +3, 공격력 +2", bonus: { str: 2, agi: 3 } },
      { id: "runner_charm", name: "도주 부적", slot: "charm", description: "불길한 인기척을 흘려보낸다. 민첩 +1", bonus: { agi: 1 } },
    ],
  },
  nurse: {
    label: "야간 간호사 서",
    description: "야간 간호사 서: 병동에서 사라진 환자들을 찾아내기 위해 다시 돌아왔습니다.",
    color: "#ffc7cc",
    accent: "#fff0f2",
    stats: { str: 4, agi: 4, vit: 7, spi: 6 },
    startingItems: [
      { id: "silver_scalpel", name: "은빛 메스", slot: "weapon", description: "얇지만 깊게 파고든다. 공격력 +3", bonus: { str: 3 } },
      { id: "nurse_badge", name: "수간호사 배지", slot: "charm", description: "손을 떨지 않게 해준다. 체력 +2, 정신력 +1", bonus: { vit: 2, spi: 1 } },
    ],
  },
};

const advancementTemplates = {
  exorcist: [
    { id: "spirit_hunter", label: "영혼 사냥꾼", summary: "강공형. 영력 폭발과 검격이 강화됩니다.", description: "원혼을 베는 퇴마 검술에 각성합니다.", color: "#7ecbff", accent: "#eef9ff", bonus: { str: 3, agi: 1, vit: 1, spi: 4 } },
    { id: "seal_keeper", label: "봉인 수호자", summary: "안정형. 생존력과 봉인력이 강화됩니다.", description: "결계를 펼치는 수호형 퇴마사입니다.", color: "#9cb8ff", accent: "#f3f6ff", bonus: { str: 1, agi: 1, vit: 4, spi: 3 } },
  ],
  runaway: [
    { id: "shadow_runner", label: "그림자 질주자", summary: "속공형. 이동 속도와 연속 공격이 강해집니다.", description: "어둠을 밟고 질주하는 생존자입니다.", color: "#80ffd0", accent: "#ecfff8", bonus: { str: 2, agi: 4, vit: 1, spi: 2 } },
    { id: "graverobber", label: "무덤 약탈자", summary: "치명형. 난전과 장비 활용이 강해집니다.", description: "죽은 자의 물건을 전력으로 바꾸는 전투형 도주자입니다.", color: "#9de8b2", accent: "#f3fff2", bonus: { str: 3, agi: 3, vit: 2, spi: 1 } },
  ],
  nurse: [
    { id: "plague_sister", label: "역병 수녀", summary: "지속형. 체력과 정신력, 반격이 강해집니다.", description: "고통을 버티며 되돌려주는 생존 특화 전직입니다.", color: "#ffc1c7", accent: "#fff3f5", bonus: { str: 1, agi: 1, vit: 4, spi: 3 } },
    { id: "red_warden", label: "붉은 병동장", summary: "지휘형. 공격과 회복 밸런스가 좋아집니다.", description: "병동의 피 묻은 질서를 되찾는 강인한 간호사입니다.", color: "#ff9ba9", accent: "#fff0f1", bonus: { str: 2, agi: 2, vit: 3, spi: 2 } },
  ],
};

const skillTemplates = {
  exorcist: [
    { id: "spirit_slash", key: "q", name: "영혼 베기", cooldown: 240 },
    { id: "holy_barrier", key: "f", name: "성역 장막", cooldown: 360 },
  ],
  runaway: [
    { id: "shadow_dash", key: "q", name: "그림자 돌진", cooldown: 180 },
    { id: "knife_frenzy", key: "f", name: "난도질", cooldown: 300 },
  ],
  nurse: [
    { id: "first_aid", key: "q", name: "응급 처치", cooldown: 260 },
    { id: "needle_burst", key: "f", name: "메스 폭주", cooldown: 320 },
  ],
};

const audioState = {
  context: null,
  bgmStarted: false,
  nextBeatAt: 0,
};

const world = {
  width: 4200,
  height: canvas.height,
  gravity: 0.7,
  cameraX: 0,
  mode: "menu",
  currentBossId: null,
  storyStage: "intro",
  flash: 0,
  currentRound: 1,
  roundName: "Round 1",
  roundTheme: "dark_forest",
  useRoundFlow: true,
};

const state = {
  selectedClass: "exorcist",
  keys: {},
  inventoryOpen: false,
};

const respawnState = {
  x: 140,
  y: 520,
  round: 1,
  active: false,
  pulse: 0,
};

const combatEffects = [];

const player = {
  x: 180,
  y: 100,
  w: 44,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 4,
  jumpPower: 13,
  onGround: false,
  facing: 1,
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  xpNext: 40,
  invulnerable: 0,
  attackTimer: 0,
  attackHitbox: 0,
  archetypeColor: "#9fd4ff",
  archetypeAccent: "#eff7ff",
  storyFlags: {
    talkedToGhost: false,
    relicRecovered: false,
    minibossDefeated: false,
    finalBossUnlocked: false,
    finalBossDefeated: false,
  },
  baseStats: { str: 0, agi: 0, vit: 0, spi: 0 },
  totalStats: { str: 0, agi: 0, vit: 0, spi: 0 },
  advancementStats: { str: 0, agi: 0, vit: 0, spi: 0 },
  equipment: { weapon: null, charm: null },
  inventory: [],
  classLabel: "",
  advancementId: null,
  skillLoadout: [],
  skillCooldowns: {},
  barrierTimer: 0,
  visualClass: "exorcist",
  highestVisualTier: 0,
  castTimer: 0,
  castLagTimer: 0,
  pendingSkillId: null,
  pendingSkillKey: null,
};

const ghostNurse = { x: 420, y: 510, w: 38, h: 74, active: false };
const relic = { x: 1240, y: 250, w: 28, h: 28, taken: false, active: false };
const memoryFragment = { x: 2120, y: 268, w: 26, h: 26, taken: false, active: false };
const finalGate = { x: 3350, y: 470, w: 72, h: 110, active: false };

const bosses = [
  { id: "warden", name: "미니보스 · 병동 감시자", x: 1800, y: 488, w: 78, h: 92, maxHp: 160, hp: 160, speed: 1.45, damage: 15, active: false, alive: true, phase: 1, hitFlash: 0 },
  { id: "heart", name: "최종보스 · 병동의 심장", x: 3650, y: 428, w: 118, h: 152, maxHp: 280, hp: 280, speed: 1.12, damage: 18, active: false, alive: true, phase: 1, hitFlash: 0 },
];

const walkers = [
  { x: 980, y: 518, w: 40, h: 62, hp: 44, maxHp: 44, alive: true, speed: 1.2, damage: 10, kind: "wisp", attackCooldown: 0, hitFlash: 0 },
  { x: 1450, y: 518, w: 40, h: 62, hp: 54, maxHp: 54, alive: true, speed: 1.3, damage: 11, kind: "soldier", attackCooldown: 0, hitFlash: 0 },
  { x: 2550, y: 518, w: 40, h: 62, hp: 68, maxHp: 68, alive: true, speed: 1.42, damage: 12, kind: "robot", attackCooldown: 0, hitFlash: 0 },
];

const platforms = [
  { x: 0, y: 580, w: 900, h: 140 },
  { x: 930, y: 580, w: 890, h: 140 },
  { x: 1840, y: 580, w: 870, h: 140 },
  { x: 2730, y: 580, w: 1470, h: 140 },
  { x: 620, y: 460, w: 170, h: 20 },
  { x: 930, y: 360, w: 180, h: 20 },
  { x: 1170, y: 280, w: 180, h: 20 },
  { x: 1560, y: 410, w: 180, h: 20 },
  { x: 2010, y: 300, w: 190, h: 20 },
  { x: 2340, y: 400, w: 170, h: 20 },
  { x: 3000, y: 460, w: 230, h: 20 },
  { x: 3390, y: 350, w: 220, h: 20 },
];

const roundRewards = [];
const roundHazards = [];
const roundExit = {
  active: false,
  x: 0,
  y: 0,
  w: 72,
  h: 120,
  label: "다음 라운드",
};

const stageRounds = [
  {
    id: 1,
    key: "dark_forest",
    name: "Round 1 - Dark Start",
    skyTop: "#101827",
    skyMid: "#0a0f18",
    skyBottom: "#04060a",
    fogColor: "rgba(116, 100, 164, 0.12)",
    zoneColor: "rgba(134, 164, 255, 0.08)",
    worldWidth: 2200,
    start: { x: 140, y: 520 },
    exit: { x: 2036, y: 480, label: "출구" },
    platforms: [
      { x: 0, y: 600, w: 480, h: 120, type: "floor" },
      { x: 520, y: 600, w: 260, h: 120, type: "floor" },
      { x: 860, y: 600, w: 240, h: 120, type: "floor" },
      { x: 1160, y: 600, w: 320, h: 120, type: "floor" },
      { x: 1540, y: 600, w: 320, h: 120, type: "floor" },
      { x: 1920, y: 600, w: 280, h: 120, type: "exit_floor" },
      { x: 760, y: 500, w: 100, h: 20, type: "jump" },
      { x: 1240, y: 500, w: 140, h: 20, type: "branch_upper" },
      { x: 1220, y: 670, w: 160, h: 20, type: "hidden_lower" },
      { x: 1640, y: 470, w: 120, h: 20, type: "reward_jump" },
    ],
    enemies: [
      { x: 620, y: 538, kind: "wisp", role: "weak_melee" },
      { x: 980, y: 538, kind: "soldier", role: "weak_melee" },
    ],
    rewards: [
      { x: 1300, y: 620, color: "#9f7aff", label: "숨겨진 조각" },
      { x: 1680, y: 420, color: "#bde4ff", label: "치유 파편" },
    ],
    hazards: [],
    bosses: [],
  },
  {
    id: 2,
    key: "abandoned_city",
    name: "Round 2 - Flicker District",
    skyTop: "#17131d",
    skyMid: "#0b0e15",
    skyBottom: "#04050a",
    fogColor: "rgba(255, 144, 94, 0.08)",
    zoneColor: "rgba(255, 112, 76, 0.08)",
    worldWidth: 3400,
    start: { x: 140, y: 520 },
    exit: { x: 3220, y: 480, label: "미니보스 구역" },
    platforms: [
      { x: 0, y: 600, w: 520, h: 120, type: "floor" },
      { x: 580, y: 600, w: 380, h: 120, type: "floor" },
      { x: 1020, y: 600, w: 220, h: 120, type: "floor" },
      { x: 1280, y: 600, w: 260, h: 120, type: "floor" },
      { x: 1600, y: 600, w: 220, h: 120, type: "floor" },
      { x: 1900, y: 600, w: 220, h: 120, type: "floor" },
      { x: 2200, y: 600, w: 280, h: 120, type: "floor" },
      { x: 2540, y: 600, w: 280, h: 120, type: "floor" },
      { x: 2860, y: 600, w: 540, h: 120, type: "boss_floor" },
      { x: 1020, y: 480, w: 140, h: 20, type: "branch_upper" },
      { x: 1220, y: 430, w: 140, h: 20, type: "branch_upper" },
      { x: 1440, y: 380, w: 120, h: 20, type: "branch_upper" },
      { x: 1080, y: 540, w: 120, h: 20, type: "branch_mid" },
      { x: 1320, y: 520, w: 120, h: 20, type: "branch_mid" },
      { x: 1480, y: 670, w: 180, h: 20, type: "hidden_lower" },
      { x: 1700, y: 670, w: 180, h: 20, type: "hidden_lower" },
      { x: 1960, y: 490, w: 110, h: 20, type: "jump" },
      { x: 2220, y: 430, w: 110, h: 20, type: "jump" },
      { x: 2380, y: 350, w: 110, h: 20, type: "reward_jump" },
    ],
    enemies: [
      { x: 700, y: 538, kind: "wisp", role: "melee" },
      { x: 860, y: 538, kind: "soldier", role: "melee" },
      { x: 1180, y: 538, kind: "robot", role: "ranged" },
      { x: 1460, y: 318, kind: "wisp", role: "ranged" },
      { x: 2300, y: 538, kind: "robot", role: "melee" },
    ],
    rewards: [
      { x: 1760, y: 620, color: "#ffd38a", label: "강화 칩" },
      { x: 2420, y: 300, color: "#ffa784", label: "코어 파편" },
    ],
    hazards: [
      { x: 1820, y: 600, w: 80, h: 120, type: "gap" },
      { x: 2120, y: 690, w: 80, h: 20, type: "electric_floor" },
      { x: 2480, y: 600, w: 60, h: 120, type: "gap" },
    ],
    bosses: [
      { id: "round2_abomination", name: "변이 감시자", type: "round2_miniboss", x: 3120, y: 508, w: 92, h: 100, maxHp: 210, hp: 210, speed: 1.28, damage: 16, active: false, alive: true, phase: 1, hitFlash: 0 },
    ],
  },
  {
    id: 3,
    key: "cursed_hospital",
    name: "Round 3 - Crimson Ward",
    skyTop: "#180710",
    skyMid: "#0c0811",
    skyBottom: "#040307",
    fogColor: "rgba(255, 74, 74, 0.08)",
    zoneColor: "rgba(255, 54, 92, 0.08)",
    worldWidth: 4200,
    start: { x: 140, y: 520 },
    exit: { x: 3880, y: 480, label: "회복 구역" },
    platforms: [
      { x: 0, y: 600, w: 480, h: 120, type: "floor" },
      { x: 540, y: 600, w: 260, h: 120, type: "floor" },
      { x: 860, y: 600, w: 180, h: 120, type: "floor" },
      { x: 1100, y: 600, w: 180, h: 120, type: "floor" },
      { x: 1380, y: 600, w: 160, h: 120, type: "floor" },
      { x: 1660, y: 600, w: 140, h: 120, type: "floor" },
      { x: 1960, y: 600, w: 180, h: 120, type: "floor" },
      { x: 2240, y: 600, w: 180, h: 120, type: "floor" },
      { x: 2520, y: 600, w: 200, h: 120, type: "floor" },
      { x: 2820, y: 600, w: 260, h: 120, type: "floor" },
      { x: 3160, y: 600, w: 420, h: 120, type: "boss_floor" },
      { x: 3640, y: 600, w: 560, h: 120, type: "rest_floor" },
      { x: 900, y: 470, w: 100, h: 20, type: "narrow_jump" },
      { x: 1130, y: 420, w: 90, h: 20, type: "narrow_jump" },
      { x: 1360, y: 370, w: 90, h: 20, type: "narrow_jump" },
      { x: 1620, y: 340, w: 90, h: 20, type: "narrow_jump" },
      { x: 2060, y: 300, w: 120, h: 20, type: "reward_jump" },
      { x: 3780, y: 500, w: 140, h: 20, type: "rest" },
    ],
    enemies: [
      { x: 620, y: 538, kind: "wisp", role: "fast_melee" },
      { x: 760, y: 538, kind: "soldier", role: "fast_melee" },
      { x: 980, y: 408, kind: "robot", role: "ranged" },
      { x: 1180, y: 358, kind: "wisp", role: "fast_ranged" },
      { x: 1460, y: 538, kind: "soldier", role: "fast_melee" },
      { x: 1760, y: 538, kind: "robot", role: "ranged" },
      { x: 2140, y: 538, kind: "wisp", role: "fast_melee" },
      { x: 2680, y: 538, kind: "robot", role: "ranged" },
    ],
    rewards: [
      { x: 2120, y: 250, color: "#ff7b8f", label: "심장 코어" },
      { x: 2600, y: 540, color: "#ffb7d4", label: "붉은 앰플" },
    ],
    hazards: [
      { x: 800, y: 690, w: 60, h: 20, type: "red_laser_floor" },
      { x: 1040, y: 600, w: 60, h: 120, type: "gap" },
      { x: 1280, y: 690, w: 100, h: 20, type: "red_laser_floor" },
      { x: 1540, y: 600, w: 120, h: 120, type: "gap" },
      { x: 2420, y: 690, w: 100, h: 20, type: "electric_blood" },
    ],
    bosses: [
      { id: "round3_abomination", name: "과부하 감시자", type: "round3_miniboss", x: 3340, y: 508, w: 108, h: 112, maxHp: 280, hp: 280, speed: 1.42, damage: 20, active: false, alive: true, phase: 1, hitFlash: 0 },
    ],
  },
  {
    id: 4,
    key: "abyss_boss",
    name: "Final Round - Abyss Theatre",
    skyTop: "#09020b",
    skyMid: "#040206",
    skyBottom: "#020103",
    fogColor: "rgba(184, 46, 84, 0.12)",
    zoneColor: "rgba(255, 48, 86, 0.10)",
    worldWidth: 2800,
    start: { x: 140, y: 520 },
    exit: null,
    platforms: [
      { x: 0, y: 600, w: 500, h: 120, type: "entry_floor" },
      { x: 560, y: 600, w: 260, h: 120, type: "branch_floor" },
      { x: 880, y: 600, w: 260, h: 120, type: "branch_floor" },
      { x: 1220, y: 600, w: 1580, h: 120, type: "boss_floor" },
      { x: 740, y: 500, w: 120, h: 20, type: "branch_upper" },
    ],
    enemies: [],
    rewards: [
      { x: 800, y: 450, color: "#ffccd6", label: "정화 파편" },
    ],
    hazards: [],
    bosses: [
      { id: "abyss_heart", name: "심연의 근원", type: "final_abomination", x: 2080, y: 428, w: 132, h: 164, maxHp: 420, hp: 420, speed: 1.1, damage: 24, active: false, alive: true, phase: 1, hitFlash: 0 },
    ],
  },
];

function setDialogue(text) {
  ui.dialogue.textContent = text;
}

function setStory(text) {
  ui.story.textContent = text;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function currentRoundData() {
  return stageRounds.find((round) => round.id === world.currentRound) || stageRounds[0];
}

function createWalker(config) {
  const base = config.kind === "robot"
    ? { w: 42, h: 62, hp: 68, speed: 1.42, damage: 12 }
    : config.kind === "soldier"
      ? { w: 40, h: 62, hp: 54, speed: 1.3, damage: 11 }
      : { w: 38, h: 58, hp: 44, speed: 1.2, damage: 10 };
  const roundBoost = world.currentRound - 1;
  return {
    x: config.x,
    y: config.y,
    w: base.w,
    h: base.h,
    hp: base.hp + roundBoost * 12,
    maxHp: base.hp + roundBoost * 12,
    alive: true,
    speed: base.speed + roundBoost * 0.08,
    damage: base.damage + roundBoost * 2,
    kind: config.kind,
    role: config.role,
    attackCooldown: 0,
    hitFlash: 0,
  };
}

function loadRound(roundId) {
  const round = stageRounds.find((entry) => entry.id === roundId) || stageRounds[0];
  world.currentRound = round.id;
  world.roundName = round.name;
  world.roundTheme = round.key;
  world.width = round.worldWidth;
  world.currentBossId = null;
  world.storyStage = "roundIntro";
  world.flash = 0;

  platforms.length = 0;
  round.platforms.forEach((platform) => platforms.push({ ...platform }));

  walkers.length = 0;
  round.enemies.forEach((enemy) => walkers.push(createWalker(enemy)));

  bosses.length = 0;
  round.bosses.forEach((boss) => bosses.push({ ...boss }));

  roundRewards.length = 0;
  round.rewards.forEach((reward) => roundRewards.push({ ...reward }));

  roundHazards.length = 0;
  round.hazards.forEach((hazard) => roundHazards.push({ ...hazard }));

  roundExit.active = false;
  if (round.exit) {
    roundExit.x = round.exit.x;
    roundExit.y = round.exit.y;
    roundExit.label = round.exit.label;
  }

  player.x = round.start.x;
  player.y = round.start.y;
  player.vx = 0;
  player.vy = 0;

  ghostNurse.active = false;
  relic.active = false;
  memoryFragment.active = false;
  finalGate.active = false;
  respawnState.x = round.start.x;
  respawnState.y = round.start.y;
  respawnState.round = round.id;
  respawnState.active = true;
  respawnState.pulse = 90;

  const introText = round.id === 1
    ? "라운드 1: 그림자가 낮게 깔린 숲이 첫 걸음을 시험합니다."
    : round.id === 2
      ? "라운드 2: 깜빡이는 폐도시가 갈림길과 함정으로 압박합니다."
      : round.id === 3
        ? "라운드 3: 붉은 병동에서 시야와 생존이 동시에 흔들립니다."
        : "최종 라운드: 심연의 무대가 마지막 숨을 조여 옵니다.";
  setDialogue(introText);
  setStory(`${round.name} 진행 중. 적을 정리하고 오른쪽 끝까지 돌파하세요.`);
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function distanceTo(entity) {
  return Math.abs(player.x + player.w / 2 - (entity.x + entity.w / 2));
}

function totalBonus() {
  const sum = { str: 0, agi: 0, vit: 0, spi: 0 };
  for (const slot of Object.values(player.equipment)) {
    if (!slot) continue;
    for (const [key, value] of Object.entries(slot.bonus)) sum[key] += value;
  }
  return sum;
}

function recalcStats() {
  const bonus = totalBonus();
  player.totalStats = {
    str: player.baseStats.str + player.advancementStats.str + bonus.str + (player.level - 1),
    agi: player.baseStats.agi + player.advancementStats.agi + bonus.agi + Math.floor((player.level - 1) / 2),
    vit: player.baseStats.vit + player.advancementStats.vit + bonus.vit + (player.level - 1),
    spi: player.baseStats.spi + player.advancementStats.spi + bonus.spi + Math.floor((player.level - 1) / 2),
  };
  player.speed = 3.8 + player.totalStats.agi * 0.24;
  player.jumpPower = 11.8 + player.totalStats.agi * 0.16;
  const hpRatio = player.maxHp > 0 ? player.hp / player.maxHp : 1;
  player.maxHp = 72 + player.totalStats.vit * 8;
  player.hp = Math.max(1, Math.round(player.maxHp * hpRatio));
}

function updateHud() {
  ui.hpValue.textContent = `${Math.max(0, Math.ceil(player.hp))} / ${player.maxHp}`;
  ui.hpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
  ui.xpValue.textContent = `${player.xp} / ${player.xpNext}`;
  ui.xpBar.style.width = `${(player.xp / player.xpNext) * 100}%`;
  ui.levelValue.textContent = player.level;
  ui.classValue.textContent = player.classLabel || classTemplates[state.selectedClass].label;
  ui.statStr.textContent = player.totalStats.str;
  ui.statAgi.textContent = player.totalStats.agi;
  ui.statVit.textContent = player.totalStats.vit;
  ui.statSpi.textContent = player.totalStats.spi;
  ui.weaponValue.textContent = player.equipment.weapon ? player.equipment.weapon.name : "없음";
  ui.charmValue.textContent = player.equipment.charm ? player.equipment.charm.name : "없음";

  if (player.storyFlags.finalBossDefeated) ui.questValue.textContent = "병동의 심장 정화";
  else if (player.storyFlags.finalBossUnlocked) ui.questValue.textContent = "최종보스 처치";
  else if (player.storyFlags.minibossDefeated) ui.questValue.textContent = "예배당으로 이동";
  else if (player.storyFlags.relicRecovered) ui.questValue.textContent = "감시자 돌파";
  else if (player.storyFlags.talkedToGhost) ui.questValue.textContent = "성유물 회수";
  else ui.questValue.textContent = "병동 조사";

  const skill1 = player.skillLoadout[0];
  const skill2 = player.skillLoadout[1];
  if (skill1) {
    ui.skill1Name.textContent = skill1.name;
    ui.skill1Key.textContent = skill1.key.toUpperCase();
    ui.skill1Cooldown.textContent = player.skillCooldowns[skill1.id] > 0 ? `${Math.ceil(player.skillCooldowns[skill1.id] / 60)}초` : "준비";
  }
  if (skill2) {
    ui.skill2Name.textContent = skill2.name;
    ui.skill2Key.textContent = skill2.key.toUpperCase();
    ui.skill2Cooldown.textContent = player.skillCooldowns[skill2.id] > 0 ? `${Math.ceil(player.skillCooldowns[skill2.id] / 60)}초` : "준비";
  }
}

function renderInventory() {
  ui.inventoryList.innerHTML = "";
  if (player.inventory.length === 0) {
    const empty = document.createElement("div");
    empty.className = "inventory-item";
    empty.textContent = "아직 획득한 장비가 없습니다.";
    ui.inventoryList.appendChild(empty);
    return;
  }
  player.inventory.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "inventory-item";
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${item.name}`;
    const desc = document.createElement("div");
    desc.textContent = item.description;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${item.slot === "weapon" ? "무기" : "부적"} 장착`;
    button.addEventListener("click", () => equipItem(item.id));
    wrapper.append(title, desc, button);
    ui.inventoryList.appendChild(wrapper);
  });
}

function syncInventoryVisibility() {
  ui.inventoryModal.classList.toggle("inventory-modal--hidden", !state.inventoryOpen);
  ui.inventoryToggle.textContent = state.inventoryOpen ? "닫기" : "열기";
}

function initAudio() {
  if (!audioState.context) {
    audioState.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioState.context.state === "suspended") {
    audioState.context.resume();
  }
  if (!audioState.bgmStarted) {
    audioState.bgmStarted = true;
    audioState.nextBeatAt = audioState.context.currentTime;
  }
}

function playTone(type, frequency, duration, volume) {
  if (!audioState.context) return;
  const now = audioState.context.currentTime;
  const osc = audioState.context.createOscillator();
  const gain = audioState.context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(audioState.context.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function playAttackSound() {
  playTone("sawtooth", 240, 0.12, 0.03);
  playTone("triangle", 420, 0.08, 0.02);
}

function playHitSound() {
  playTone("square", 110, 0.16, 0.05);
}

function playFallSound() {
  playTone("sawtooth", 180, 0.08, 0.05);
  playTone("triangle", 90, 0.26, 0.04);
}

function playSkillSound() {
  playTone("triangle", 520, 0.22, 0.04);
}

function updateBgm() {
  if (!audioState.context || !audioState.bgmStarted) return;
  const now = audioState.context.currentTime;
  while (audioState.nextBeatAt < now + 0.2) {
    const beat = audioState.nextBeatAt;

    const bass = audioState.context.createOscillator();
    const bassGain = audioState.context.createGain();
    bass.type = "sine";
    bass.frequency.setValueAtTime(92, beat);
    bass.frequency.linearRampToValueAtTime(110, beat + 0.6);
    bassGain.gain.setValueAtTime(0.001, beat);
    bassGain.gain.linearRampToValueAtTime(0.02, beat + 0.05);
    bassGain.gain.linearRampToValueAtTime(0.001, beat + 1.2);
    bass.connect(bassGain).connect(audioState.context.destination);
    bass.start(beat);
    bass.stop(beat + 1.3);

    const high = audioState.context.createOscillator();
    const highGain = audioState.context.createGain();
    high.type = "triangle";
    high.frequency.setValueAtTime(184, beat + 0.5);
    highGain.gain.setValueAtTime(0.001, beat + 0.5);
    highGain.gain.linearRampToValueAtTime(0.012, beat + 0.58);
    highGain.gain.linearRampToValueAtTime(0.001, beat + 1.1);
    high.connect(highGain).connect(audioState.context.destination);
    high.start(beat + 0.5);
    high.stop(beat + 1.15);

    audioState.nextBeatAt += 1.4;
  }
}

function addItem(item) {
  if (player.inventory.some((entry) => entry.id === item.id)) return;
  player.inventory.push(item);
  renderInventory();
}

function equipItem(itemId) {
  const item = player.inventory.find((entry) => entry.id === itemId);
  if (!item) return;
  player.equipment[item.slot] = item;
  recalcStats();
  updateHud();
  renderInventory();
  setDialogue(`${item.name}을(를) 장착했습니다.`);
}

function gainXp(amount) {
  player.xp += amount;
  while (player.xp >= player.xpNext) {
    player.xp -= player.xpNext;
    player.level += 1;
    player.xpNext += 18;
    setDialogue("혈관을 타고 얼음 같은 힘이 흐릅니다. 레벨이 올랐습니다.");
    recalcStats();
    player.hp = player.maxHp;
  }
  if (player.level >= 3 && !player.advancementId) openPromotionScreen();
  const currentTier = getPromotionTier();
  if (currentTier > player.highestVisualTier) {
    player.highestVisualTier = currentTier;
    if (currentTier === 2) {
      setDialogue("전직의 힘이 한층 더 깊어졌습니다. 외형과 기운이 강화됩니다.");
      setStory("2차 각성 완료. 전투 이펙트와 실루엣이 더 강하게 변화합니다.");
    }
  }
  updateHud();
}

function setupSkills() {
  player.skillLoadout = skillTemplates[state.selectedClass].map((skill) => ({ ...skill }));
  player.skillCooldowns = {};
  player.skillLoadout.forEach((skill) => {
    player.skillCooldowns[skill.id] = 0;
  });
}

function getAttackDamage() {
  return 6 + player.totalStats.str * 0.9 + player.totalStats.spi * 0.25;
}

function getPromotionTier() {
  if (!player.advancementId) return 0;
  if (player.level >= 6) return 2;
  return 1;
}

function getAttackProfile() {
  const tier = getPromotionTier();
  if (player.visualClass === "exorcist") {
    return {
      type: "mid",
      range: 150 + tier * 35,
      vertical: 90,
      color: "rgba(138, 92, 255, 0.82)",
      hitColor: "rgba(194, 135, 255, 0.9)",
      label: "부적",
    };
  }
  if (player.visualClass === "runaway") {
    return {
      type: "melee",
      range: 70 + tier * 12,
      vertical: 75,
      color: "rgba(124, 255, 215, 0.82)",
      hitColor: "rgba(240, 255, 250, 0.92)",
      label: "단검",
    };
  }
  return {
    type: "support_mid",
    range: 125 + tier * 25,
    vertical: 85,
    color: "rgba(91, 177, 255, 0.8)",
    hitColor: "rgba(255, 122, 158, 0.9)",
    label: "주사기",
  };
}

function spawnCombatEffect(kind, x, y, options = {}) {
  combatEffects.push({
    kind,
    x,
    y,
    life: options.life ?? 24,
    maxLife: options.life ?? 24,
    radius: options.radius ?? 14,
    color: options.color ?? "rgba(255,255,255,0.8)",
    secondary: options.secondary ?? "rgba(255,255,255,0.18)",
    direction: options.direction ?? player.facing,
    text: options.text ?? "",
  });
}

function applyHitReaction(target, color) {
  target.hitFlash = 10;
  spawnCombatEffect("hit", target.x + target.w / 2, target.y + target.h / 2, {
    life: 18,
    radius: 18,
    color,
  });
}

function updateCombatEffects() {
  for (let i = combatEffects.length - 1; i >= 0; i -= 1) {
    combatEffects[i].life -= 1;
    if (combatEffects[i].life <= 0) {
      combatEffects.splice(i, 1);
    }
  }
}

function useSelectedClass(classId) {
  state.selectedClass = classId;
  const template = classTemplates[classId];
  ui.classDescription.textContent = template.description;
  ui.classCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.classId === classId);
  });
}

function executeSkill(skill) {
  player.skillCooldowns[skill.id] = skill.cooldown;
  playSkillSound();
  const tier = getPromotionTier();

  if (skill.id === "spirit_slash") {
    spawnCombatEffect("seal-burst", player.x + player.w / 2 + player.facing * 80, player.y + 34, {
      life: 24 + tier * 8,
      radius: 26 + tier * 12,
      color: "rgba(138, 92, 255, 0.85)",
      secondary: "rgba(255,255,255,0.18)",
    });
    walkers.forEach((walker) => {
      if (!walker.alive) return;
      if (Math.abs(walker.x - player.x) < 180) {
        walker.hp -= getAttackDamage() * 1.7;
        applyHitReaction(walker, "rgba(194, 135, 255, 0.95)");
      }
    });
    bosses.forEach((boss) => {
      if (!boss.alive || !boss.active) return;
      if (Math.abs(boss.x - player.x) < 190) {
        boss.hp -= getAttackDamage() * 1.5;
        applyHitReaction(boss, "rgba(194, 135, 255, 0.95)");
      }
    });
    setDialogue("영혼 베기가 복도를 가르며 푸른 잔광을 남깁니다.");
  }

  if (skill.id === "holy_barrier") {
    player.barrierTimer = 240;
    player.hp = Math.min(player.maxHp, player.hp + 16);
    spawnCombatEffect("barrier", player.x + player.w / 2, player.y + player.h / 2, {
      life: 36 + tier * 12,
      radius: 36 + tier * 10,
      color: "rgba(138, 92, 255, 0.72)",
    });
    setDialogue("성역 장막이 몸을 감싸며 통증을 밀어냅니다.");
  }

  if (skill.id === "shadow_dash") {
    player.x = clamp(player.x + player.facing * 150, 0, world.width - player.w);
    player.attackTimer = 10;
    spawnCombatEffect("dash", player.x + player.w / 2, player.y + 34, {
      life: 18 + tier * 6,
      radius: 18 + tier * 6,
      color: "rgba(124, 255, 215, 0.85)",
    });
    setDialogue("그림자 돌진으로 순식간에 거리를 좁혔습니다.");
  }

  if (skill.id === "knife_frenzy") {
    spawnCombatEffect("slash-frenzy", player.x + player.w / 2 + player.facing * 40, player.y + 30, {
      life: 18 + tier * 8,
      radius: 26 + tier * 8,
      color: "rgba(124, 255, 215, 0.85)",
    });
    walkers.forEach((walker) => {
      if (!walker.alive) return;
      if (Math.abs(walker.x - player.x) < 160) {
        walker.hp -= getAttackDamage() * 2.1;
        applyHitReaction(walker, "rgba(240, 255, 250, 0.95)");
      }
    });
    setDialogue("난도질이 번개처럼 이어집니다.");
  }

  if (skill.id === "first_aid") {
    player.hp = Math.min(player.maxHp, player.hp + 28);
    spawnCombatEffect("heal", player.x + player.w / 2, player.y + player.h / 2, {
      life: 34 + tier * 8,
      radius: 26 + tier * 10,
      color: "rgba(255, 122, 158, 0.78)",
      secondary: "rgba(91, 177, 255, 0.2)",
    });
    setDialogue("응급 처치로 호흡이 가라앉고 상처가 봉합됩니다.");
  }

  if (skill.id === "needle_burst") {
    spawnCombatEffect("support-burst", player.x + player.w / 2 + player.facing * 70, player.y + 30, {
      life: 24 + tier * 8,
      radius: 32 + tier * 10,
      color: "rgba(255, 122, 158, 0.82)",
      secondary: "rgba(91, 177, 255, 0.22)",
    });
    walkers.forEach((walker) => {
      if (!walker.alive) return;
      if (Math.abs(walker.x - player.x) < 220) {
        walker.hp -= getAttackDamage() * 1.9;
        applyHitReaction(walker, "rgba(255, 122, 158, 0.95)");
      }
    });
    bosses.forEach((boss) => {
      if (!boss.alive || !boss.active) return;
      if (Math.abs(boss.x - player.x) < 220) {
        boss.hp -= getAttackDamage() * 1.7;
        applyHitReaction(boss, "rgba(255, 122, 158, 0.95)");
      }
    });
    setDialogue("메스 폭주가 붉은 궤적과 함께 적을 밀어냅니다.");
  }

  walkers.forEach((walker) => {
    if (walker.alive && walker.hp <= 0) {
      walker.alive = false;
      gainXp(14);
    }
  });
  bosses.forEach((boss) => {
    if (boss.alive && boss.hp <= 0) {
      boss.hp = 0;
      boss.alive = false;
      boss.active = false;
      onBossDefeated(boss);
    }
  });
  updateHud();
}

function castSkill(key) {
  if (world.mode !== "playing") return;
  const skill = player.skillLoadout.find((entry) => entry.key === key);
  if (!skill || player.skillCooldowns[skill.id] > 0) return;
  if (player.castTimer > 0 || player.castLagTimer > 0) return;
  player.castTimer = 16;
  player.castLagTimer = 14;
  player.pendingSkillId = skill.id;
  player.pendingSkillKey = key;
  spawnCombatEffect("cast-ring", player.x + player.w / 2, player.y + player.h / 2, {
    life: 16,
    radius: 18 + getPromotionTier() * 6,
    color: player.visualClass === "exorcist"
      ? "rgba(138, 92, 255, 0.65)"
      : player.visualClass === "runaway"
        ? "rgba(124, 255, 215, 0.65)"
        : "rgba(255, 122, 158, 0.65)",
  });
}

function startGame() {
  const template = classTemplates[state.selectedClass];
  if (!template) return;

  initAudio();
  setupSkills();

  world.mode = "playing";
  world.storyStage = "roundIntro";
  ui.startScreen.classList.add("start-screen--hidden");
  ui.promotionScreen.classList.add("promotion-screen--hidden");

  player.x = 180;
  player.y = 100;
  player.vx = 0;
  player.vy = 0;
  player.level = 1;
  player.xp = 0;
  player.xpNext = 40;
  player.baseStats = { ...template.stats };
  player.advancementStats = { str: 0, agi: 0, vit: 0, spi: 0 };
  player.equipment = { weapon: null, charm: null };
  player.inventory = [];
  player.classLabel = template.label;
  player.advancementId = null;
  player.visualClass = state.selectedClass;
  player.highestVisualTier = 0;
  player.barrierTimer = 0;
  player.storyFlags = {
    talkedToGhost: false,
    relicRecovered: false,
    minibossDefeated: false,
    finalBossUnlocked: false,
    finalBossDefeated: false,
  };
  player.attackTimer = 0;
  player.attackHitbox = 0;
  player.invulnerable = 0;
  player.archetypeColor = template.color;
  player.archetypeAccent = template.accent;

  relic.taken = false;
  memoryFragment.taken = false;

  template.startingItems.forEach((item) => addItem(item));
  recalcStats();
  equipItem(template.startingItems[0].id);
  equipItem(template.startingItems[1].id);
  player.hp = player.maxHp;
  state.inventoryOpen = false;
  syncInventoryVisibility();
  updateHud();
  setDialogue("병동 문이 닫히는 소리와 함께 숨결이 낮아집니다.");
  setStory("유령 간호사를 찾아 사건의 시작을 들으세요.");
  loadRound(1);
  world.cameraX = 0;
}

function safeStartGame() {
  try {
    startGame();
  } catch (error) {
    console.error(error);
    setDialogue("시작 중 오류가 발생했습니다. 다시 눌러보세요.");
    setStory(`오류: ${error.message}`);
  }
}

function resetRun() {
  ui.startScreen.classList.remove("start-screen--hidden");
  ui.promotionScreen.classList.add("promotion-screen--hidden");
  world.mode = "menu";
  world.currentBossId = null;
  ui.bossPanel.classList.add("boss-panel--hidden");
  state.inventoryOpen = false;
  syncInventoryVisibility();
  setDialogue("다시 악몽의 입구로 돌아왔습니다.");
  setStory("캐릭터를 다시 선택하고 시작할 수 있습니다.");
}

function nearbyInteractive() {
  if (ghostNurse.active && distanceTo(ghostNurse) < 90 && Math.abs(player.y - ghostNurse.y) < 90) return "ghost";
  if (relic.active && !relic.taken && distanceTo(relic) < 75 && Math.abs(player.y - relic.y) < 90) return "relic";
  if (memoryFragment.active && !memoryFragment.taken && distanceTo(memoryFragment) < 75 && Math.abs(player.y - memoryFragment.y) < 90) return "memory";
  if (finalGate.active && player.storyFlags.minibossDefeated && !player.storyFlags.finalBossUnlocked && distanceTo(finalGate) < 95) return "gate";
  return null;
}

function handleInteraction() {
  if (world.mode !== "playing" && world.mode !== "victory") return;
  const target = nearbyInteractive();

  if (target === "ghost") {
    if (!player.storyFlags.talkedToGhost) {
      player.storyFlags.talkedToGhost = true;
      world.storyStage = "searchRelic";
      setDialogue("유령 간호사: 병동의 심장은 세 조각으로 갈라졌어. 첫 번째 성유물을 찾아줘.");
      setStory("위층의 붉은 성유물을 회수하세요.");
    } else if (player.storyFlags.relicRecovered && !player.storyFlags.minibossDefeated) {
      setDialogue("유령 간호사: 감시자가 깨어났어. 복도 중간의 문을 돌파해야 해.");
      setStory("미니보스 병동 감시자를 쓰러뜨리세요.");
    } else if (player.storyFlags.finalBossDefeated) {
      setDialogue("유령 간호사: 이제야 이 병동에서 누군가의 울음이 멎었어.");
      setStory("악몽 정화 완료. R 키로 다시 시작할 수 있습니다.");
    } else {
      setDialogue("유령 간호사: 뒤를 자주 보지 마. 이곳의 그림자는 이름을 기억해.");
    }
  }

  if (target === "relic") {
    relic.taken = true;
    player.storyFlags.relicRecovered = true;
    addItem({ id: "blood_lantern", name: "혈등", slot: "charm", description: "피처럼 붉은 등불. 정신력 +3, 공격력 보정", bonus: { spi: 3, str: 1 } });
    setDialogue("붉은 성유물을 손에 넣자 천장 너머로 무언가가 움직입니다.");
    setStory("중앙 병동의 문이 열렸습니다. 감시자를 상대할 준비를 하세요.");
    gainXp(18);
  }

  if (target === "memory") {
    memoryFragment.taken = true;
    addItem({ id: "pulse_coat", name: "맥박 코트", slot: "weapon", description: "심장 박동에 맞춰 진동하는 외투 칼날. 공격력 +5, 체력 +1", bonus: { str: 5, vit: 1 } });
    setDialogue("찢긴 기억 조각이 손바닥에 달라붙습니다. 마지막 방의 위치가 떠오릅니다.");
    setStory("최종 보스 방으로 가기 위한 예배당 문을 조사하세요.");
    gainXp(22);
  }

  if (target === "gate") {
    player.storyFlags.finalBossUnlocked = true;
    world.storyStage = "finalBoss";
    setDialogue("예배당 문이 열리며 병동 전체가 한 번 크게 맥동합니다.");
    setStory("최종보스 병동의 심장과 맞서세요.");
  }

  updateHud();
}

function renderPromotionChoices() {
  ui.promotionGrid.innerHTML = "";
  const choices = advancementTemplates[state.selectedClass];
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-card";
    button.innerHTML = `
      <span class="character-card__portrait character-card__portrait--exorcist"></span>
      <strong>${choice.label}</strong>
      <span>${choice.summary}</span>
      <span>${choice.description}</span>
    `;
    button.addEventListener("click", () => applyAdvancement(choice.id));
    ui.promotionGrid.appendChild(button);
  });
}

function openPromotionScreen() {
  if (world.mode !== "playing") return;
  world.mode = "promotion";
  renderPromotionChoices();
  ui.promotionScreen.classList.remove("promotion-screen--hidden");
  setDialogue("악몽이 당신의 이름을 다시 부릅니다. 전직을 선택하세요.");
  setStory("선택한 전직에 따라 이후 전투 성향이 달라집니다.");
}

function applyAdvancement(advancementId) {
  const choices = advancementTemplates[state.selectedClass];
  const selected = choices.find((choice) => choice.id === advancementId);
  if (!selected) return;
  player.advancementId = selected.id;
  player.advancementStats = { ...selected.bonus };
  player.classLabel = selected.label;
  player.archetypeColor = selected.color;
  player.archetypeAccent = selected.accent;
  player.highestVisualTier = 1;
  recalcStats();
  player.hp = player.maxHp;
  ui.promotionScreen.classList.add("promotion-screen--hidden");
  world.mode = "playing";
  setDialogue(`${selected.label}로 전직했습니다.`);
  setStory("각성한 힘으로 병동의 더 깊은 악몽을 밀어내세요.");
  updateHud();
}

function takeDamage(amount, line) {
  if (player.invulnerable > 0 || world.mode !== "playing") return;
  const actual = player.barrierTimer > 0 ? Math.max(1, Math.round(amount * 0.45)) : amount;
  player.hp -= actual;
  player.invulnerable = 40;
  world.flash = 7;
  playHitSound();
  setDialogue(line);
  if (player.hp <= 0) {
    player.hp = 0;
    reviveAtCheckpoint("치명상을 입었지만, 마지막 체크포인트의 기억이 몸을 붙잡습니다.");
    return;
  }
  updateHud();
}

function attackEntities() {
  if (player.attackHitbox > 0) return;
  player.attackHitbox = 1;
  const profile = getAttackProfile();
  const range = profile.range;
  const damage = getAttackDamage();
  playAttackSound();
  spawnCombatEffect("basic-attack", player.x + player.w / 2 + player.facing * (range * 0.5), player.y + 32, {
    life: 14 + getPromotionTier() * 4,
    radius: Math.max(14, range * 0.18),
    color: profile.color,
    secondary: profile.hitColor,
    direction: player.facing,
  });

  walkers.forEach((walker) => {
    if (!walker.alive) return;
    const inFront = player.facing === 1
      ? walker.x < player.x + player.w + range && walker.x > player.x
      : walker.x + walker.w > player.x - range && walker.x < player.x;
    if (inFront && Math.abs(walker.y - player.y) < profile.vertical) {
      walker.hp -= damage;
      applyHitReaction(walker, profile.hitColor);
      if (walker.hp <= 0) {
        walker.alive = false;
        gainXp(14);
      }
    }
  });

  bosses.forEach((boss) => {
    if (!boss.alive || !boss.active) return;
    const inFront = player.facing === 1
      ? boss.x < player.x + player.w + range && boss.x > player.x - 10
      : boss.x + boss.w > player.x - range && boss.x < player.x + player.w;
    if (inFront && Math.abs(boss.y - player.y) < profile.vertical + 30) {
      boss.hp -= damage;
      applyHitReaction(boss, profile.hitColor);
      state.inventoryOpen = false;
      syncInventoryVisibility();
      if (boss.hp <= 0) {
        boss.hp = 0;
        boss.alive = false;
        boss.active = false;
        world.currentBossId = null;
        ui.bossPanel.classList.add("boss-panel--hidden");
        onBossDefeated(boss);
      }
    }
  });
}

function onBossDefeated(boss) {
  if (world.useRoundFlow) {
    if (world.currentRound < 4) {
      const reward = world.currentRound === 2
        ? { id: "city_core", name: "도시 코어", slot: "charm", description: "깜빡이는 코어 조각. 민첩 +2, 정신력 +2", bonus: { agi: 2, spi: 2 } }
        : { id: "crimson_ampoule", name: "붉은 앰플", slot: "weapon", description: "응축된 생체 약액. 공격력 +4, 체력 +2", bonus: { str: 4, vit: 2 } };
      addItem(reward);
      gainXp(world.currentRound === 2 ? 40 : 56);
      roundExit.active = true;
      setDialogue(`${boss.name}가 무너졌습니다. 오른쪽 끝 통로가 열립니다.`);
      setStory(`라운드 ${world.currentRound} 돌파 완료. 출구로 이동하면 다음 라운드로 넘어갑니다.`);
    } else {
      player.storyFlags.finalBossDefeated = true;
      world.mode = "victory";
      gainXp(90);
      setDialogue("심연의 근원이 붕괴하며 병동 전체의 맥박이 멎습니다.");
      setStory("엔딩: 절망의 근원이 사라졌습니다. R 키로 다시 시작할 수 있습니다.");
    }
    updateHud();
    renderInventory();
    return;
  }

  if (boss.id === "warden") {
    player.storyFlags.minibossDefeated = true;
    addItem({ id: "iron_rosary", name: "철제 묵주", slot: "charm", description: "묵직한 기도로 몸을 붙든다. 체력 +4, 정신력 +2", bonus: { vit: 4, spi: 2 } });
    setDialogue("병동 감시자가 무너지며 열쇠 꾸러미를 떨어뜨립니다.");
    setStory("깊은 예배당으로 이어지는 문이 열렸습니다. 위층에서 기억 조각을 찾으세요.");
    gainXp(40);
  } else if (boss.id === "heart") {
    player.storyFlags.finalBossDefeated = true;
    world.mode = "victory";
    setDialogue("병동의 심장이 멎자 차가운 복도에 처음으로 정적이 내려앉습니다.");
    setStory("엔딩: 살아남은 자의 이름이 병동의 기록에서 지워집니다. R 키로 다시 시작하세요.");
    gainXp(80);
  }
  updateHud();
  renderInventory();
}

function updateRoundProgress() {
  if (!world.useRoundFlow || world.mode !== "playing") return;

  const allEnemiesDown = walkers.every((walker) => !walker.alive);
  const activeBoss = bosses.find((boss) => boss.alive);
  const checkpoints = [
    { x: world.width * 0.34, y: 520 },
    { x: world.width * 0.68, y: 520 },
  ];

  checkpoints.forEach((checkpoint) => {
    if (player.x >= checkpoint.x && checkpoint.x > respawnState.x) {
      respawnState.x = checkpoint.x;
      respawnState.y = checkpoint.y;
      respawnState.round = world.currentRound;
      respawnState.pulse = 90;
      setDialogue(`체크포인트 갱신: 라운드 ${world.currentRound}`);
    }
  });

  if (!activeBoss && allEnemiesDown && world.currentRound === 1) {
    roundExit.active = true;
    setStory("첫 구역이 잠잠해졌습니다. 오른쪽 출구로 이동하세요.");
  }

  if (roundExit.active && rectsOverlap(player, roundExit)) {
    const nextRound = world.currentRound + 1;
    if (nextRound <= stageRounds.length) {
      loadRound(nextRound);
      world.cameraX = 0;
      player.hp = Math.min(player.maxHp, player.hp + 18);
      updateHud();
    }
  }
}

function reviveAtCheckpoint(reasonText) {
  if (!respawnState.active) {
    world.mode = "gameover";
    updateHud();
    return;
  }
  player.hp = Math.max(1, Math.round(player.maxHp * 0.65));
  player.x = respawnState.x;
  player.y = respawnState.y;
  player.vx = 0;
  player.vy = 0;
  player.invulnerable = 90;
  player.attackTimer = 0;
  player.attackHitbox = 0;
  player.castTimer = 0;
  player.castLagTimer = 0;
  player.pendingSkillId = null;
  player.pendingSkillKey = null;
  world.mode = "playing";
  world.flash = 12;
  world.cameraX = clamp(player.x - canvas.width * 0.35, 0, world.width - canvas.width);
  spawnCombatEffect("fall-burst", player.x + player.w / 2, player.y + player.h / 2, {
    life: 28,
    radius: 34,
    color: "rgba(255, 96, 96, 0.85)",
    secondary: "rgba(224, 244, 255, 0.35)",
  });
  spawnCombatEffect("heal", player.x + player.w / 2, player.y + player.h / 2, {
    life: 24,
    radius: 28,
    color: "rgba(190, 235, 255, 0.8)",
  });
  setDialogue(reasonText);
  setStory(`체크포인트에서 부활했습니다. 현재 라운드 ${world.currentRound}.`);
  updateHud();
}

function applyHorizontalMovement() {
  const movingLeft = state.keys.a || state.keys.arrowleft;
  const movingRight = state.keys.d || state.keys.arrowright;

  if (movingLeft && !movingRight) {
    player.vx = -player.speed;
    player.facing = -1;
  } else if (movingRight && !movingLeft) {
    player.vx = player.speed;
    player.facing = 1;
  } else {
    player.vx *= 0.78;
    if (Math.abs(player.vx) < 0.12) player.vx = 0;
  }

  const wantsJump = state.keys.w || state.keys.arrowup || state.keys[" "];
  if (wantsJump && player.onGround) {
    player.vy = -player.jumpPower;
    player.onGround = false;
  }
}

function resolvePlatforms() {
  player.onGround = false;
  for (const platform of platforms) {
    const overlapsX = player.x + player.w > platform.x && player.x < platform.x + platform.w;
    const landing = player.y + player.h >= platform.y && player.y + player.h <= platform.y + 22 && player.vy >= 0;
    if (overlapsX && landing) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }
}

function updatePlayer() {
  if (player.castTimer <= 0 && player.castLagTimer <= 0) {
    applyHorizontalMovement();
  } else {
    player.vx *= 0.78;
    if (Math.abs(player.vx) < 0.12) player.vx = 0;
  }
  player.vy += world.gravity;
  player.x += player.vx;
  player.y += player.vy;
  player.x = clamp(player.x, 0, world.width - player.w);

  if (player.y > world.height + 40) {
    player.hp = 0;
    playFallSound();
    spawnCombatEffect("fall-burst", player.x + player.w / 2, world.height - 22, {
      life: 32,
      radius: 40,
      color: "rgba(255, 72, 92, 0.9)",
      secondary: "rgba(255, 255, 255, 0.28)",
    });
    reviveAtCheckpoint("발밑이 무너졌습니다. 차가운 충격과 함께 체크포인트로 되돌아옵니다.");
    return;
  }

  resolvePlatforms();

  if (world.useRoundFlow) {
    roundHazards.forEach((hazard) => {
      if (hazard.type.includes("gap")) return;
      if (rectsOverlap(player, hazard) && player.invulnerable <= 0) {
        takeDamage(8, "위험 구역이 살을 태우듯 스쳐 지나갑니다.");
      }
    });
  }

  if (player.attackTimer > 0) {
    player.attackTimer -= 1;
    if (player.attackTimer === 8) attackEntities();
  } else {
    player.attackHitbox = 0;
  }

  if (player.invulnerable > 0) player.invulnerable -= 1;
  if (player.barrierTimer > 0) player.barrierTimer -= 1;
  if (player.castTimer > 0) {
    player.castTimer -= 1;
    if (player.castTimer === 0 && player.pendingSkillId) {
      const skill = player.skillLoadout.find((entry) => entry.id === player.pendingSkillId);
      if (skill) executeSkill(skill);
      player.pendingSkillId = null;
      player.pendingSkillKey = null;
    }
  } else if (player.castLagTimer > 0) {
    player.castLagTimer -= 1;
  }
  player.skillLoadout.forEach((skill) => {
    if (player.skillCooldowns[skill.id] > 0) player.skillCooldowns[skill.id] -= 1;
  });
}

function updateWalkers() {
  walkers.forEach((walker) => {
    if (!walker.alive) return;
    const dx = player.x - walker.x;
    if (walker.hitFlash > 0) walker.hitFlash -= 1;
    if (walker.attackCooldown > 0) walker.attackCooldown -= 1;
    if (Math.abs(dx) < 300 && Math.abs(player.y - walker.y) < 110) {
      walker.x += Math.sign(dx) * walker.speed;
    }
    if (rectsOverlap(player, walker) && walker.attackCooldown === 0) {
      walker.attackCooldown = 36;
      takeDamage(walker.damage, "썩은 환자가 비명을 지르며 달려듭니다.");
    }
  });
}

function updateBosses() {
  if (world.useRoundFlow) {
    world.currentBossId = null;
    bosses.forEach((boss) => {
      if (!boss.alive) return;
      if (boss.hitFlash > 0) boss.hitFlash -= 1;
      if (distanceTo(boss) < 560) boss.active = true;
      if (!boss.active) return;

      world.currentBossId = boss.id;
      if (boss.hp < boss.maxHp * 0.5) boss.phase = 2;
      if (world.currentRound === 4 && boss.hp < boss.maxHp * 0.22) boss.phase = 3;

      const dx = player.x - boss.x;
      boss.x += Math.sign(dx) * (boss.speed + (boss.phase - 1) * 0.25);

      if (Math.abs(dx) < 220 && Math.random() < 0.014 + boss.phase * 0.003) {
        world.flash = 4 + boss.phase * 2;
        takeDamage(boss.damage + (boss.phase - 1) * 3, `${boss.name}의 패턴이 공간을 찢습니다.`);
      } else if (rectsOverlap(player, boss)) {
        takeDamage(boss.damage, `${boss.name}의 육탄 공격이 몸을 강타합니다.`);
      }
    });

    const activeBoss = bosses.find((boss) => boss.id === world.currentBossId && boss.alive);
    if (activeBoss) {
      ui.bossPanel.classList.remove("boss-panel--hidden");
      ui.bossName.textContent = activeBoss.name;
      ui.bossBar.style.width = `${(activeBoss.hp / activeBoss.maxHp) * 100}%`;
    } else {
      ui.bossPanel.classList.add("boss-panel--hidden");
    }
    return;
  }

  world.currentBossId = null;
  bosses.forEach((boss) => {
    if (!boss.alive) return;
    if (boss.hitFlash > 0) boss.hitFlash -= 1;
    if (boss.id === "warden" && player.storyFlags.relicRecovered && !player.storyFlags.minibossDefeated && distanceTo(boss) < 520) boss.active = true;
    if (boss.id === "heart" && player.storyFlags.finalBossUnlocked && distanceTo(boss) < 620) boss.active = true;
    if (!boss.active) return;

    world.currentBossId = boss.id;
    if (boss.hp < boss.maxHp * 0.5) boss.phase = 2;
    if (boss.id === "heart" && boss.hp < boss.maxHp * 0.22) boss.phase = 3;

    const dx = player.x - boss.x;
    boss.x += Math.sign(dx) * (boss.speed + (boss.phase - 1) * 0.35);

    if (boss.id === "warden") {
      if (Math.abs(dx) < 210 && Math.random() < 0.012) {
        world.flash = 4;
        setDialogue("감시자의 코어가 번쩍이며 전방을 노립니다.");
      }
      if (boss.phase === 2 && Math.abs(dx) < 190 && Math.random() < 0.016) {
        takeDamage(boss.damage + 5, `${boss.name}의 코어 파동이 복도를 찢습니다.`);
        world.flash = 8;
      } else if (rectsOverlap(player, boss)) {
        takeDamage(boss.damage, `${boss.name}의 둔중한 손아귀가 살점을 찢어냅니다.`);
      }
      return;
    }

    if (boss.phase === 3 && Math.random() < 0.02) {
      world.flash = 12;
      takeDamage(boss.damage + 8, `${boss.name}의 광역 맥동이 병동 전체를 흔듭니다.`);
    } else if (boss.phase === 2 && Math.abs(dx) < 160 && Math.random() < 0.015) {
      takeDamage(boss.damage + 5, `${boss.name}의 광폭한 일격이 갈비뼈를 울립니다.`);
    } else if (rectsOverlap(player, boss)) {
      takeDamage(boss.damage, `${boss.name}의 공격이 살점을 찢어냅니다.`);
    }
  });

  const activeBoss = bosses.find((boss) => boss.id === world.currentBossId && boss.alive);
  if (activeBoss) {
    ui.bossPanel.classList.remove("boss-panel--hidden");
    ui.bossName.textContent = activeBoss.name;
    ui.bossBar.style.width = `${(activeBoss.hp / activeBoss.maxHp) * 100}%`;
  } else {
    ui.bossPanel.classList.add("boss-panel--hidden");
  }
}

function updateStoryZones() {
  if (world.useRoundFlow) {
    const round = currentRoundData();
    if (player.x > world.width * 0.42 && world.storyStage === "roundIntro") {
      world.storyStage = "roundMid";
      setStory(`${round.name} 중반 구간입니다. 갈림길과 위험 구간이 가까워집니다.`);
    }
    if (player.x > world.width * 0.76 && world.storyStage === "roundMid") {
      world.storyStage = "roundLate";
      setStory(`${round.name} 후반입니다. 보스나 출구를 향해 밀고 나가세요.`);
    }
    return;
  }

  if (player.x > 890 && world.storyStage === "searchRelic") {
    setStory("살균등이 깜빡이는 위층에서 성유물의 빛이 느껴집니다.");
    world.storyStage = "searchRelicUpper";
  }
  if (player.x > 2140 && player.storyFlags.minibossDefeated && !memoryFragment.taken) {
    setStory("환자 기록이 찢겨 붙은 방에서 기억 조각이 반응합니다.");
  }
  if (player.x > 3320 && player.storyFlags.finalBossUnlocked && !player.storyFlags.finalBossDefeated) {
    setStory("예배당의 심장이 당신의 맥박과 같은 박자로 울립니다.");
  }
}

function updateCamera() {
  const target = player.x - canvas.width * 0.35;
  world.cameraX += (target - world.cameraX) * 0.08;
  world.cameraX = clamp(world.cameraX, 0, world.width - canvas.width);
}

function drawBackground() {
  const round = currentRoundData();
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, round.skyTop || "#12223a");
  gradient.addColorStop(0.5, round.skyMid || "#09101b");
  gradient.addColorStop(1, round.skyBottom || "#05070b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(244, 246, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(canvas.width - 180, 110, 52, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 7; i += 1) {
    const mx = (i * 240 - world.cameraX * 0.08) % 1700;
    ctx.fillStyle = world.currentRound >= 3 ? "rgba(34, 14, 22, 0.55)" : "rgba(20, 28, 44, 0.5)";
    ctx.beginPath();
    ctx.moveTo(mx, 280);
    ctx.lineTo(mx + 120, 110);
    ctx.lineTo(mx + 240, 280);
    ctx.closePath();
    ctx.fill();
  }

  for (let i = 0; i < 14; i += 1) {
    const x = ((i * 240) - world.cameraX * 0.18) % 1500;
    ctx.fillStyle = round.fogColor || "rgba(155, 196, 255, 0.08)";
    ctx.fillRect(x, 70, 90, 280);
    ctx.fillStyle = "rgba(255, 245, 180, 0.04)";
    ctx.fillRect(x + 18, 110, 14, 70);
    ctx.fillRect(x + 48, 145, 14, 60);
  }

  for (let i = 0; i < 30; i += 1) {
    const x = ((i * 170) - world.cameraX * 0.35) % 1500;
    const y = 90 + (i % 6) * 88;
    ctx.fillStyle = "rgba(230, 241, 255, 0.03)";
    ctx.beginPath();
    ctx.ellipse(x, y, 110, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const zoneX = -world.cameraX;
  ctx.fillStyle = round.zoneColor || "rgba(138, 178, 255, 0.08)";
  ctx.fillRect(zoneX + 1120, 0, 230, canvas.height);
  ctx.fillStyle = world.currentRound >= 3 ? "rgba(255, 66, 96, 0.08)" : "rgba(255, 116, 116, 0.06)";
  ctx.fillRect(zoneX + 3380, 0, 300, canvas.height);
}

function drawPlatforms() {
  platforms.forEach((platform) => {
    const zone = platform.type && platform.type.includes("boss")
      ? "#2d1724"
      : platform.type && (platform.type.includes("hidden") || platform.type.includes("branch"))
        ? "#1b2432"
        : platform.x < 1800
          ? "#1b2738"
          : platform.x < 3100
            ? "#202333"
            : "#261926";
    ctx.fillStyle = zone;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.fillStyle = "rgba(214, 232, 255, 0.08)";
    ctx.fillRect(platform.x, platform.y, platform.w, 8);
  });
}

function drawGhost() {
  if (!ghostNurse.active) return;
  ctx.fillStyle = "rgba(215, 231, 255, 0.92)";
  ctx.beginPath();
  ctx.arc(ghostNurse.x + 19, ghostNurse.y + 14, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(ghostNurse.x + 4, ghostNurse.y + 28, ghostNurse.w - 8, ghostNurse.h - 28);
  ctx.fillStyle = "#7fe6cf";
  ctx.fillRect(ghostNurse.x + 8, ghostNurse.y + 18, 22, 14);
  ctx.fillStyle = "rgba(127, 230, 207, 0.18)";
  ctx.beginPath();
  ctx.arc(ghostNurse.x + 18, ghostNurse.y + 14, 26, 0, Math.PI * 2);
  ctx.fill();
}

function drawPickup(item, color) {
  if (item.active === false) return;
  const pulse = 12 + Math.sin(Date.now() / 180) * 4;
  ctx.fillStyle = `${color}33`;
  ctx.beginPath();
  ctx.arc(item.x + item.w / 2, item.y + item.h / 2, pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillRect(item.x, item.y, item.w, item.h);
}

function drawRoundRewards() {
  roundRewards.forEach((reward) => {
    const pulse = 10 + Math.sin(Date.now() / 200 + reward.x) * 3;
    ctx.fillStyle = `${reward.color}33`;
    ctx.beginPath();
    ctx.arc(reward.x, reward.y, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = reward.color;
    ctx.fillRect(reward.x - 9, reward.y - 9, 18, 18);
  });
}

function drawRoundHazards() {
  roundHazards.forEach((hazard) => {
    ctx.fillStyle = hazard.type.includes("gap") ? "rgba(5, 6, 10, 0.88)" : "rgba(255, 74, 74, 0.18)";
    ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    if (!hazard.type.includes("gap")) {
      ctx.fillStyle = "rgba(255, 110, 110, 0.42)";
      ctx.fillRect(hazard.x, hazard.y, hazard.w, Math.min(8, hazard.h));
    }
  });
}

function drawRoundExit() {
  if (!roundExit.active) return;
  ctx.fillStyle = "rgba(206, 244, 255, 0.2)";
  ctx.fillRect(roundExit.x, roundExit.y, roundExit.w, roundExit.h);
  ctx.strokeStyle = "#c5eeff";
  ctx.lineWidth = 2;
  ctx.strokeRect(roundExit.x, roundExit.y, roundExit.w, roundExit.h);
  ctx.fillStyle = "#eff8ff";
  ctx.font = "16px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("E X I T", roundExit.x + roundExit.w / 2, roundExit.y - 10);
}

function drawCheckpointMarker() {
  if (!respawnState.active || world.mode === "menu") return;
  const alpha = respawnState.pulse > 0 ? 0.22 + (respawnState.pulse / 90) * 0.18 : 0.16;
  ctx.fillStyle = `rgba(189, 233, 255, ${alpha})`;
  ctx.beginPath();
  ctx.arc(respawnState.x + 22, respawnState.y + 54, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(225, 246, 255, 0.9)";
  ctx.fillRect(respawnState.x + 18, respawnState.y + 24, 8, 30);
}

function drawWalkers() {
  walkers.forEach((walker) => {
    if (!walker.alive) return;
    const oldAlpha = ctx.globalAlpha;
    if (walker.hitFlash > 0) ctx.globalAlpha = 0.6 + (walker.hitFlash % 2) * 0.35;
    const jitter = Math.sin(Date.now() / 120 + walker.x) * 1.5;
    const round = world.currentRound;
    if (round === 1) {
      if (walker.kind === "wisp") {
        ctx.fillStyle = "rgba(110, 84, 160, 0.18)";
        ctx.beginPath();
        ctx.arc(walker.x + walker.w / 2, walker.y + 24, 20 + jitter, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1d1828";
        ctx.beginPath();
        ctx.arc(walker.x + walker.w / 2, walker.y + 20, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8d6bff";
        ctx.fillRect(walker.x + 11, walker.y + 17, 5, 4);
        ctx.fillRect(walker.x + 21, walker.y + 17, 5, 4);
      } else {
        ctx.fillStyle = "#24272e";
        ctx.beginPath();
        ctx.arc(walker.x + walker.w / 2, walker.y + 12, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(walker.x + 8, walker.y + 24, walker.w - 16, walker.h - 24);
        ctx.fillStyle = "#7f5ba5";
        ctx.fillRect(walker.x + 11, walker.y + 15, 6, 4);
        ctx.fillRect(walker.x + 23, walker.y + 15, 6, 4);
      }
      ctx.fillStyle = "rgba(255, 143, 143, 0.18)";
      ctx.fillRect(walker.x, walker.y - 10, (walker.w * walker.hp) / walker.maxHp, 5);
      ctx.globalAlpha = oldAlpha;
      return;
    }

    if (round === 2) {
      ctx.fillStyle = walker.kind === "robot" ? "#352821" : "#2b2327";
      ctx.beginPath();
      ctx.ellipse(walker.x + walker.w / 2, walker.y + 18, 14, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(walker.x + 7, walker.y + 28, walker.w - 14, walker.h - 24);
      ctx.fillStyle = walker.kind === "robot" ? "#ff7c63" : "#c05f65";
      ctx.fillRect(walker.x + 8, walker.y + 33, 6, 20);
      ctx.fillRect(walker.x + walker.w - 14, walker.y + 24, 6, 28);
      ctx.fillStyle = "#d4b2a1";
      ctx.fillRect(walker.x + 12, walker.y + 15, 5, 4);
      ctx.fillRect(walker.x + 21, walker.y + 17, 5, 4);
      ctx.fillStyle = "rgba(255, 143, 143, 0.18)";
      ctx.fillRect(walker.x, walker.y - 10, (walker.w * walker.hp) / walker.maxHp, 5);
      ctx.globalAlpha = oldAlpha;
      return;
    }

    if (round === 3) {
      ctx.fillStyle = "#140709";
      ctx.beginPath();
      ctx.ellipse(walker.x + walker.w / 2, walker.y + 22, 16, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(walker.x + 10, walker.y + 30, walker.w - 20, walker.h - 24);
      ctx.strokeStyle = "#ff5252";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(walker.x + 10, walker.y + 30);
      ctx.lineTo(walker.x + walker.w - 10, walker.y + walker.h - 8);
      ctx.moveTo(walker.x + walker.w - 10, walker.y + 30);
      ctx.lineTo(walker.x + 8, walker.y + walker.h - 12);
      ctx.stroke();
      ctx.fillStyle = "#ff5d66";
      ctx.fillRect(walker.x + 11, walker.y + 17, 5, 4);
      ctx.fillRect(walker.x + 23, walker.y + 17, 5, 4);
      ctx.fillStyle = "rgba(255, 143, 143, 0.18)";
      ctx.fillRect(walker.x, walker.y - 10, (walker.w * walker.hp) / walker.maxHp, 5);
      ctx.globalAlpha = oldAlpha;
      return;
    }

    if (walker.kind === "wisp") {
      ctx.fillStyle = "rgba(110, 84, 160, 0.22)";
      ctx.beginPath();
      ctx.arc(walker.x + walker.w / 2, walker.y + 26, 20 + jitter, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#24172d";
      ctx.beginPath();
      ctx.arc(walker.x + walker.w / 2, walker.y + 22, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(walker.x + 12, walker.y + 30, 16, 18);
      ctx.fillStyle = "#9b71ff";
      ctx.fillRect(walker.x + 13, walker.y + 18, 5, 4);
      ctx.fillRect(walker.x + 22, walker.y + 18, 5, 4);
    } else if (walker.kind === "soldier") {
      ctx.fillStyle = "#2d2e33";
      ctx.beginPath();
      ctx.arc(walker.x + walker.w / 2, walker.y + 13, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(walker.x + 6, walker.y + 24, walker.w - 12, walker.h - 24);
      ctx.fillStyle = "#6b4f4f";
      ctx.fillRect(walker.x + 9, walker.y + 15, 7, 4);
      ctx.fillRect(walker.x + 23, walker.y + 15, 7, 4);
      ctx.fillStyle = "#4e5258";
      ctx.fillRect(walker.x + 30, walker.y + 33, 9, 3);
    } else {
      ctx.fillStyle = "#1e2228";
      ctx.fillRect(walker.x + 6, walker.y + 18, walker.w - 12, walker.h - 10);
      ctx.fillStyle = "#5f676f";
      ctx.fillRect(walker.x + 10, walker.y + 10, walker.w - 20, 11);
      ctx.fillStyle = "#ff6c6c";
      ctx.fillRect(walker.x + 12, walker.y + 24, 5, 5);
      ctx.fillRect(walker.x + 23, walker.y + 24, 5, 5);
      ctx.fillStyle = "#4ad9ff";
      ctx.fillRect(walker.x + 18, walker.y + 34, 4, 14);
    }
    ctx.fillStyle = "rgba(255, 143, 143, 0.18)";
    ctx.fillRect(walker.x, walker.y - 10, (walker.w * walker.hp) / walker.maxHp, 5);
    ctx.globalAlpha = oldAlpha;
  });
}

function drawBosses() {
  bosses.forEach((boss) => {
    if (!boss.alive) return;
    const oldAlpha = ctx.globalAlpha;
    if (boss.hitFlash > 0) ctx.globalAlpha = 0.65 + (boss.hitFlash % 2) * 0.3;
    if (world.useRoundFlow) {
      if (world.currentRound === 2) {
        const pulse = 16 + Math.sin(Date.now() / 150) * 4;
        ctx.fillStyle = "rgba(255, 111, 85, 0.15)";
        ctx.beginPath();
        ctx.arc(boss.x + boss.w / 2, boss.y + 42, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#221112";
        ctx.fillRect(boss.x + 10, boss.y + 28, boss.w - 20, boss.h - 20);
        ctx.fillStyle = "#ff7d6c";
        ctx.fillRect(boss.x + 16, boss.y + 18, 14, 6);
        ctx.fillRect(boss.x + boss.w - 30, boss.y + 18, 14, 6);
        ctx.beginPath();
        ctx.arc(boss.x + boss.w / 2, boss.y + 44, 12, 0, Math.PI * 2);
        ctx.fill();
      } else if (world.currentRound === 3) {
        const pulse = 18 + Math.sin(Date.now() / 130) * 5;
        ctx.fillStyle = "rgba(255, 72, 96, 0.16)";
        ctx.beginPath();
        ctx.arc(boss.x + boss.w / 2, boss.y + 48, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a060a";
        ctx.beginPath();
        ctx.ellipse(boss.x + boss.w / 2, boss.y + boss.h / 2, boss.w / 2, boss.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ff5b75";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boss.x + 18, boss.y + 34);
        ctx.lineTo(boss.x + boss.w - 16, boss.y + boss.h - 18);
        ctx.moveTo(boss.x + boss.w - 18, boss.y + 30);
        ctx.lineTo(boss.x + 20, boss.y + boss.h - 16);
        ctx.stroke();
      } else if (world.currentRound === 4) {
        const pulse = 1 + Math.sin(Date.now() / 150) * 0.1;
        ctx.save();
        ctx.translate(boss.x + boss.w / 2, boss.y + boss.h / 2);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = "rgba(255, 60, 110, 0.12)";
        ctx.beginPath();
        ctx.arc(0, 0, 92, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#12030a";
        ctx.beginPath();
        ctx.ellipse(0, 0, boss.w / 2, boss.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = boss.phase >= 3 ? "#a40036" : boss.phase >= 2 ? "#ff425e" : "#742248";
        ctx.beginPath();
        ctx.arc(0, 16, boss.phase >= 3 ? 26 : 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = oldAlpha;
      return;
    }

    if (boss.id === "warden") {
      const corePulse = 18 + Math.sin(Date.now() / 170) * 4;
      ctx.fillStyle = "rgba(255, 122, 159, 0.15)";
      ctx.beginPath();
      ctx.arc(boss.x + boss.w / 2, boss.y + 46, corePulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a0710";
      ctx.beginPath();
      ctx.arc(boss.x + boss.w / 2, boss.y + 18, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(boss.x + 8, boss.y + 28, boss.w - 16, boss.h - 28);
      ctx.fillStyle = "#ff7a9f";
      ctx.fillRect(boss.x + 16, boss.y + 16, 10, 5);
      ctx.fillRect(boss.x + 50, boss.y + 16, 10, 5);
      ctx.fillStyle = boss.phase >= 2 ? "#ffb0d0" : "#ff5e84";
      ctx.beginPath();
      ctx.arc(boss.x + boss.w / 2, boss.y + 48, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.strokeRect(boss.x + 24, boss.y + 38, 30, 22);
    } else {
      const pulse = 1 + Math.sin(Date.now() / 180) * 0.08;
      ctx.save();
      ctx.translate(boss.x + boss.w / 2, boss.y + boss.h / 2);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "rgba(255, 70, 110, 0.12)";
      ctx.beginPath();
      ctx.arc(0, 0, 78, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#18061c";
      ctx.beginPath();
      ctx.ellipse(0, 0, boss.w / 2, boss.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#ff7bc5";
      ctx.beginPath();
      ctx.arc(boss.x + boss.w / 2, boss.y + 58, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = boss.phase >= 2 ? "#ff4242" : "#6d0d3a";
      ctx.beginPath();
      ctx.arc(boss.x + boss.w / 2, boss.y + boss.h / 2 + 10, boss.phase >= 3 ? 22 : 16, 0, Math.PI * 2);
      ctx.fill();
      if (boss.phase >= 2) {
        ctx.strokeStyle = "rgba(255, 75, 140, 0.35)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boss.x + 20, boss.y + 90);
        ctx.lineTo(boss.x - 16, boss.y + 120);
        ctx.moveTo(boss.x + boss.w - 20, boss.y + 90);
        ctx.lineTo(boss.x + boss.w + 16, boss.y + 120);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = oldAlpha;
  });
}

function drawGate() {
  if (!finalGate.active) return;
  ctx.fillStyle = player.storyFlags.finalBossUnlocked ? "#7a395f" : "#263142";
  ctx.fillRect(finalGate.x, finalGate.y, finalGate.w, finalGate.h);
  ctx.fillStyle = "rgba(255, 220, 190, 0.14)";
  ctx.fillRect(finalGate.x + 14, finalGate.y + 18, 18, 30);
}

function drawPlayer() {
  if (player.invulnerable > 0 && Math.floor(player.invulnerable / 4) % 2 === 0) return;

  const t = Date.now() / 180;
  const idleWave = Math.sin(t) * 1.5;
  const coatSwing = Math.sin(t * 1.3) * (Math.abs(player.vx) > 0.5 ? 6 : 2.5);
  const hairSwing = Math.sin(t * 1.4) * 2;
  const facing = player.facing;
  const baseX = player.x;
  const baseY = player.y;
  const blink = Math.sin(Date.now() / 260) > 0.78;
  const visual = player.visualClass || state.selectedClass;
  const tier = getPromotionTier();
  const movingFast = Math.abs(player.vx) > 1.2;

  ctx.save();

  if (visual === "exorcist") {
    const black = "#1a1a1a";
    const deepNavy = "#2b2f5b";
    const purple = "#8a5cff";
    const gold = "#f5d742";
    const skin = "#dfd5e8";

    if (tier >= 1) {
      for (let i = 0; i < 8; i += 1) {
        const px = baseX + 4 + (i % 4) * 10 + Math.sin(t + i) * 2;
        const py = baseY + 8 + Math.cos(t * 1.1 + i) * 10 + i * 3;
        ctx.fillStyle = "rgba(194, 135, 255, 0.28)";
        ctx.fillRect(px, py, 2.5, 2.5);
      }
    }

    if (!player.onGround) {
      ctx.strokeStyle = "rgba(138, 92, 255, 0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(baseX + player.w / 2, baseY + player.h + 2, 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < (tier >= 1 ? 5 : 3); i += 1) {
      const offset = i * 14;
      const fx = baseX + 5 + offset;
      const fy = baseY + 34 + Math.sin(t + i) * 6;
      ctx.fillStyle = "rgba(138, 92, 255, 0.22)";
      ctx.fillRect(fx, fy, 6, 10);
      ctx.fillStyle = "rgba(245, 215, 66, 0.8)";
      ctx.fillRect(fx + 2, fy + 2, 2, 6);
    }

    ctx.fillStyle = "#201f34";
    ctx.fillRect(baseX + 12, baseY + 46, 10, 24);
    ctx.fillRect(baseX + 24, baseY + 46, 10, 24);
    ctx.fillStyle = black;
    ctx.fillRect(baseX + 10, baseY + 62, 12, 8);
    ctx.fillRect(baseX + 23, baseY + 62, 13, 8);
    ctx.fillStyle = deepNavy;
    ctx.fillRect(baseX + 12, baseY + 24, 20, tier >= 2 ? 28 : 24);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(baseX + 19, baseY + 26, 5, 18);
    if (tier >= 1) {
      ctx.strokeStyle = "rgba(194, 135, 255, 0.4)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(baseX + 16, baseY + 28);
      ctx.lineTo(baseX + 22, baseY + 38);
      ctx.lineTo(baseX + 28, baseY + 28);
      ctx.stroke();
    }

    ctx.fillStyle = black;
    ctx.beginPath();
    ctx.moveTo(baseX + 8, baseY + 28);
    ctx.lineTo(baseX + 4 + coatSwing, baseY + (tier >= 2 ? 66 : 60));
    ctx.lineTo(baseX + 18, baseY + 48);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(baseX + 36, baseY + 28);
    ctx.lineTo(baseX + 40 + coatSwing, baseY + (tier >= 2 ? 66 : 60));
    ctx.lineTo(baseX + 26, baseY + 48);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(245, 215, 66, 0.95)";
    ctx.fillRect(baseX + 6, baseY + 32, 4, 10);
    ctx.fillRect(baseX + 34, baseY + 36, 4, 10);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(baseX + 7, baseY + 34, 2, 5);
    ctx.fillRect(baseX + 35, baseY + 38, 2, 5);

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(baseX + 22, baseY + 14 + idleWave, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#171018";
    ctx.beginPath();
    ctx.moveTo(baseX + 10, baseY + 9);
    ctx.quadraticCurveTo(baseX + 24, baseY - 2, baseX + 34, baseY + 9);
    ctx.lineTo(baseX + 32, baseY + 24);
    ctx.quadraticCurveTo(baseX + 24, baseY + 18, baseX + 12, baseY + 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(138, 92, 255, 0.35)";
    ctx.fillRect(baseX + 14, baseY + 8, 14, 4);

    ctx.strokeStyle = "#25263c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(baseX + 30, baseY + 6);
    ctx.lineTo(baseX + 36, baseY + 24 + hairSwing);
    ctx.stroke();

    ctx.fillStyle = "#171018";
    ctx.beginPath();
    if (facing === 1) {
      ctx.moveTo(baseX + 30, baseY + 10);
      ctx.lineTo(baseX + 18, baseY + 8 + hairSwing);
      ctx.lineTo(baseX + 17, baseY + 27);
      ctx.lineTo(baseX + 31, baseY + 21);
    } else {
      ctx.moveTo(baseX + 14, baseY + 10);
      ctx.lineTo(baseX + 26, baseY + 8 + hairSwing);
      ctx.lineTo(baseX + 27, baseY + 27);
      ctx.lineTo(baseX + 13, baseY + 21);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = purple;
    ctx.beginPath();
    ctx.arc(facing === 1 ? baseX + 18 : baseX + 26, baseY + 15, 2.6, 0, Math.PI * 2);
    ctx.fill();

    if (player.skillCooldowns[player.skillLoadout[0]?.id] > 0 || player.attackTimer > 0) {
      ctx.strokeStyle = "rgba(138, 92, 255, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(facing === 1 ? baseX + 25 : baseX + 19, baseY + 15, 4.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (tier >= 2) {
      ctx.strokeStyle = "rgba(215, 195, 255, 0.28)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(baseX + 2, baseY + 34);
      ctx.quadraticCurveTo(baseX - 10, baseY + 10, baseX + 4, baseY - 6);
      ctx.moveTo(baseX + 42, baseY + 34);
      ctx.quadraticCurveTo(baseX + 54, baseY + 10, baseX + 40, baseY - 6);
      ctx.stroke();
    }
  } else if (visual === "runaway") {
    const gray = "#2b2b2b";
    const khaki = "#4a5a3a";
    const brown = "#5a453a";
    const mint = "#7cffd7";
    const skin = "#d4c3b8";

    if (tier >= 1 && movingFast) {
      for (let i = 0; i < 3; i += 1) {
        ctx.fillStyle = "rgba(124, 255, 215, 0.12)";
        ctx.fillRect(baseX - facing * (8 + i * 6), baseY + 18, 20 - i * 3, 36);
      }
    }

    ctx.fillStyle = "#3d3d3d";
    ctx.fillRect(baseX + 13, baseY + 47, tier >= 2 ? 8 : 10, 23);
    ctx.fillRect(baseX + 24, baseY + 47, tier >= 2 ? 8 : 10, 23);
    ctx.fillStyle = "#202020";
    ctx.fillRect(baseX + 10, baseY + 62, 12, 8);
    ctx.fillRect(baseX + 23, baseY + 62, 13, 8);

    if (movingFast) {
      ctx.fillStyle = "rgba(124, 255, 215, 0.18)";
      ctx.fillRect(baseX - facing * 8, baseY + 26, 12, 28);
    }

    ctx.fillStyle = khaki;
    ctx.fillRect(baseX + 11, baseY + 27, 22, 21);
    if (tier >= 1) {
      ctx.fillStyle = "#3f4635";
      ctx.fillRect(baseX + 28, baseY + 33, 9, 10);
      ctx.fillRect(baseX + 6, baseY + 37, 5, 9);
    }
    ctx.fillStyle = gray;
    ctx.beginPath();
    ctx.moveTo(baseX + 10, baseY + 27);
    ctx.lineTo(baseX + 4 + coatSwing, baseY + 42);
    ctx.lineTo(baseX + 12, baseY + 48);
    ctx.lineTo(baseX + 16, baseY + 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#56634b";
    ctx.fillRect(baseX + 26, baseY + 29, 8, 12);
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(baseX + 17, baseY + 45, 10, 4);

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(baseX + 22, baseY + 14 + idleWave, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = brown;
    ctx.beginPath();
    ctx.moveTo(baseX + 12, baseY + 8);
    ctx.quadraticCurveTo(baseX + 23, baseY + 2, baseX + 31, baseY + 10);
    ctx.lineTo(baseX + 30, baseY + 20);
    ctx.lineTo(baseX + 17, baseY + 17 + hairSwing);
    ctx.lineTo(baseX + 11, baseY + 20);
    ctx.closePath();
    ctx.fill();

    if (tier >= 1) {
      ctx.fillStyle = "#232323";
      ctx.beginPath();
      ctx.moveTo(baseX + 12, baseY + 8);
      ctx.lineTo(baseX + 32, baseY + 10);
      ctx.lineTo(baseX + 27, baseY + 23);
      ctx.lineTo(baseX + 15, baseY + 20);
      ctx.closePath();
      ctx.fill();
    }

    if (tier >= 2) {
      ctx.fillStyle = "rgba(18, 18, 18, 0.9)";
      if (facing === 1) ctx.fillRect(baseX + 20, baseY + 12, 9, 9);
      else ctx.fillRect(baseX + 15, baseY + 12, 9, 9);
      ctx.fillStyle = "rgba(124, 255, 215, 0.18)";
      ctx.beginPath();
      ctx.arc(baseX - facing * 8, baseY + 28, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#dbe2d5";
    ctx.fillRect(baseX + (facing === 1 ? 17 : 21), baseY + 14, 7, 2);
    ctx.fillStyle = mint;
    ctx.beginPath();
    ctx.arc(facing === 1 ? baseX + 26 : baseX + 18, baseY + 15, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const white = "#f5f5f5";
    const mint = "#8bd3c7";
    const red = "#ff3b3b";
    const blue = "#5bb1ff";
    const skin = "#f0d8c7";

    if (tier >= 1 && Math.sin(t * 0.8) > 0.1) {
      ctx.strokeStyle = "rgba(255, 111, 177, 0.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(baseX + 38, baseY + 25, 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "#d7ece8";
    ctx.fillRect(baseX + 12, baseY + 46, 10, 24);
    ctx.fillRect(baseX + 24, baseY + 46, 10, 24);
    ctx.fillStyle = white;
    ctx.fillRect(baseX + 11, baseY + 24, 22, 22);
    ctx.fillStyle = mint;
    ctx.fillRect(baseX + 18, baseY + 26, 7, 18);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(baseX + 9, baseY + 31, 6, 14);
    ctx.fillRect(baseX + 29, baseY + 31, 6, 14);
    ctx.fillStyle = "#c8d5dc";
    ctx.fillRect(baseX + 6, baseY + 24, 5, 28);
    ctx.fillRect(baseX + 33, baseY + 24, 5, 28);
    if (tier >= 1) {
      ctx.fillStyle = "#ff7a9e";
      ctx.fillRect(baseX + 4, baseY + 34, 4, 5);
      ctx.fillRect(baseX + 36, baseY + 34, 4, 5);
      ctx.fillRect(baseX + 28, baseY + 44, 10, 4);
    }

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(baseX + 22, baseY + 14 + idleWave, 11.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8d6047";
    ctx.beginPath();
    ctx.moveTo(baseX + 12, baseY + 8);
    ctx.quadraticCurveTo(baseX + 22, baseY + 0, baseX + 31, baseY + 9);
    ctx.lineTo(baseX + 29, baseY + 23);
    ctx.lineTo(baseX + 16, baseY + 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(baseX + 25, baseY + 6, 4, 14 + hairSwing);

    ctx.fillStyle = "#4f8d55";
    ctx.beginPath();
    ctx.arc(baseX + 18, baseY + 15, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseX + 25, baseY + 15, 2.3, 0, Math.PI * 2);
    ctx.fill();

    if (tier >= 2) {
      ctx.strokeStyle = "rgba(255, 59, 59, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(baseX + 15, baseY + 28);
      ctx.lineTo(baseX + 22, baseY + 33);
      ctx.lineTo(baseX + 29, baseY + 28);
      ctx.stroke();
      ctx.fillStyle = "rgba(91, 177, 255, 0.22)";
      ctx.beginPath();
      ctx.arc(baseX + 22, baseY + 36, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.sin(Date.now() / 260) > 0.3) {
      ctx.strokeStyle = "rgba(91, 177, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(baseX + 37, baseY + 26, 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = blue;
    ctx.fillRect(facing === 1 ? baseX + 34 : baseX + 2, baseY + 34, 8, 4);
    ctx.fillStyle = red;
    ctx.fillRect(facing === 1 ? baseX + 41 : baseX - 1, baseY + 35, 3, 2);
  }

  if (player.barrierTimer > 0) {
    ctx.strokeStyle = "rgba(123, 213, 255, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, 38, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (player.castTimer > 0) {
    ctx.strokeStyle = visual === "exorcist"
      ? "rgba(138, 92, 255, 0.75)"
      : visual === "runaway"
        ? "rgba(124, 255, 215, 0.75)"
        : "rgba(255, 122, 158, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(baseX + player.w / 2, baseY + player.h / 2, 18 + Math.sin(t * 2) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (player.attackTimer > 0) {
    const range = 26 + player.totalStats.spi * 1.8;
    if (visual === "exorcist") {
      ctx.strokeStyle = "rgba(138, 92, 255, 0.78)";
      ctx.lineWidth = tier >= 2 ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(facing === 1 ? baseX + 33 : baseX + 11, baseY + 34);
      ctx.quadraticCurveTo(
        facing === 1 ? baseX + range + 22 : baseX - range - 8,
        baseY + 12 + idleWave,
        facing === 1 ? baseX + range + 6 : baseX - range + 12,
        baseY + 42
      );
      ctx.stroke();
      if (tier >= 2) {
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.fillRect(facing === 1 ? baseX + range + 2 : baseX - range + 6, baseY + 18, 16, 24);
        ctx.fillStyle = "rgba(245, 215, 66, 0.8)";
        ctx.fillRect(facing === 1 ? baseX + range + 9 : baseX - range + 13, baseY + 22, 2, 12);
      }
    } else if (visual === "runaway") {
      ctx.strokeStyle = "rgba(124, 255, 215, 0.7)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(facing === 1 ? baseX + 30 : baseX + 14, baseY + 37);
      ctx.lineTo(facing === 1 ? baseX + range + 20 : baseX - range + 2, baseY + 28);
      ctx.stroke();
      if (tier >= 2) {
        ctx.fillStyle = "rgba(124, 255, 215, 0.1)";
        ctx.fillRect(baseX - facing * 18, baseY + 18, 18, 32);
      }
    } else {
      ctx.strokeStyle = "rgba(91, 177, 255, 0.76)";
      ctx.lineWidth = tier >= 2 ? 4 : 3;
      ctx.beginPath();
      ctx.moveTo(facing === 1 ? baseX + 34 : baseX + 10, baseY + 36);
      ctx.quadraticCurveTo(
        facing === 1 ? baseX + range + 10 : baseX - range,
        baseY + 20,
        facing === 1 ? baseX + range : baseX - range + 10,
        baseY + 40
      );
      ctx.stroke();
      if (tier >= 1) {
        ctx.fillStyle = "rgba(255, 111, 177, 0.16)";
        ctx.beginPath();
        ctx.arc(facing === 1 ? baseX + range : baseX - range + 10, baseY + 40, tier >= 2 ? 16 : 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

function drawMarkers() {
  ctx.font = "20px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillStyle = "#bfe8ff";
  const target = nearbyInteractive();
  if (roundExit.active) ctx.fillText(">", roundExit.x + roundExit.w / 2, roundExit.y - 18);
  if (target === "ghost") ctx.fillText("E", ghostNurse.x + ghostNurse.w / 2, ghostNurse.y - 18);
  if (target === "relic") ctx.fillText("E", relic.x + relic.w / 2, relic.y - 18);
  if (target === "memory") ctx.fillText("E", memoryFragment.x + memoryFragment.w / 2, memoryFragment.y - 18);
  if (target === "gate") ctx.fillText("E", finalGate.x + finalGate.w / 2, finalGate.y - 18);
}

function drawCombatEffects() {
  combatEffects.forEach((effect) => {
    const lifeRatio = effect.life / effect.maxLife;
    const radius = effect.radius * (1 + (1 - lifeRatio) * 0.35);
    ctx.save();
    ctx.globalAlpha = lifeRatio;

    if (effect.kind === "basic-attack") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(effect.x - effect.direction * radius * 0.5, effect.y + 6);
      ctx.lineTo(effect.x + effect.direction * radius, effect.y - 4);
      ctx.stroke();
    } else if (effect.kind === "hit") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI * 2 * i) / 6;
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + Math.cos(angle) * radius, effect.y + Math.sin(angle) * radius);
      }
      ctx.stroke();
    } else if (effect.kind === "seal-burst" || effect.kind === "support-burst") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = effect.secondary;
      ctx.beginPath();
      ctx.moveTo(effect.x - radius * 0.6, effect.y);
      ctx.lineTo(effect.x + radius * 0.6, effect.y);
      ctx.moveTo(effect.x, effect.y - radius * 0.6);
      ctx.lineTo(effect.x, effect.y + radius * 0.6);
      ctx.stroke();
    } else if (effect.kind === "barrier" || effect.kind === "cast-ring" || effect.kind === "heal") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.kind === "fall-burst") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = effect.secondary;
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8;
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + Math.cos(angle) * radius * 1.2, effect.y + Math.sin(angle) * radius * 1.2);
      }
      ctx.stroke();
    } else if (effect.kind === "dash" || effect.kind === "slash-frenzy") {
      ctx.fillStyle = effect.color;
      ctx.fillRect(effect.x - radius * 0.5, effect.y - 8, radius * 1.2, 16);
    }

    ctx.restore();
  });
}

function drawWorld() {
  ctx.save();
  ctx.translate(-world.cameraX, 0);
  drawPlatforms();
  drawRoundHazards();
  drawCheckpointMarker();
  drawGhost();
  if (!relic.taken) drawPickup(relic, "#ff6d79");
  if (!memoryFragment.taken) drawPickup(memoryFragment, "#8ae0ff");
  drawRoundRewards();
  drawGate();
  drawRoundExit();
  drawWalkers();
  drawBosses();
  drawPlayer();
  drawCombatEffects();
  drawMarkers();
  ctx.restore();

  if (world.flash > 0) {
    ctx.fillStyle = `rgba(255, 110, 110, ${world.flash * 0.03})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "rgba(239, 245, 255, 0.92)";
  ctx.font = "bold 18px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillText(world.roundName, 24, canvas.height - 24);
}

function drawOverlay() {
  if (world.mode !== "gameover" && world.mode !== "victory" && state.inventoryOpen === false) return;
  if (state.inventoryOpen) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (world.mode === "gameover" || world.mode === "victory") {
    ctx.fillStyle = "rgba(3, 5, 9, 0.62)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillStyle = "#eff5ff";
    ctx.font = "bold 48px Segoe UI";
    ctx.fillText(world.mode === "victory" ? "NIGHTMARE PURGED" : "YOU WERE CONSUMED", canvas.width / 2, canvas.height / 2 - 16);
    ctx.font = "24px Segoe UI";
    ctx.fillStyle = "#bcc7d8";
    ctx.fillText("R 키로 다시 시작", canvas.width / 2, canvas.height / 2 + 30);
  }
}

function updateGame() {
  updateBgm();
  updateCombatEffects();
  if (respawnState.pulse > 0) respawnState.pulse -= 1;
  if (world.mode !== "playing" && world.mode !== "victory") return;
  if (world.mode === "playing") {
    updatePlayer();
    updateWalkers();
    updateBosses();
    updateStoryZones();
    updateRoundProgress();
    updateCamera();
    if (world.flash > 0) world.flash -= 1;
  }
}

function gameLoop() {
  drawBackground();
  updateGame();
  drawWorld();
  drawOverlay();
  requestAnimationFrame(gameLoop);
}

ui.classCards.forEach((card) => {
  card.addEventListener("click", () => useSelectedClass(card.dataset.classId));
});

window.__startNightmare = safeStartGame;

ui.startButton.addEventListener("click", safeStartGame);
ui.startButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  safeStartGame();
});
ui.startButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    safeStartGame();
  }
});

ui.inventoryToggle.addEventListener("click", () => {
  state.inventoryOpen = !state.inventoryOpen;
  syncInventoryVisibility();
});

ui.inventoryClose.addEventListener("click", () => {
  state.inventoryOpen = false;
  syncInventoryVisibility();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  state.keys[key] = true;
  if (key === "e") handleInteraction();
  if (key === "q") castSkill("q");
  if (key === "f") castSkill("f");
  if (key === "j" && world.mode === "playing") {
    player.attackTimer = 12;
    player.attackHitbox = 0;
  }
  if (key === "i") {
    state.inventoryOpen = !state.inventoryOpen;
    syncInventoryVisibility();
  }
  if (key === "1" && player.inventory[0]) equipItem(player.inventory[0].id);
  if (key === "2" && player.inventory[1]) equipItem(player.inventory[1].id);
  if (key === "r") resetRun();
});

window.addEventListener("keyup", (event) => {
  state.keys[event.key.toLowerCase()] = false;
});

useSelectedClass(state.selectedClass);
renderInventory();
syncInventoryVisibility();
updateHud();
setDialogue("어둠이 깔린 복도는 아직 당신의 이름조차 모릅니다.");
setStory("캐릭터를 선택하고 악몽의 병동으로 들어가세요.");
requestAnimationFrame(gameLoop);
