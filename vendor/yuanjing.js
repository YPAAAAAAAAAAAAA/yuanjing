"use strict";

var TAU = Math.PI * 2;
var STEM = "甲乙丙丁戊己庚辛壬癸";
var BRANCH = "子丑寅卯辰巳午未申酉戌亥";
var ELN = ["木", "火", "土", "金", "水"];
var EL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
var BEL = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
var HIDE = [
  [9],
  [5, 9, 7],
  [0, 2, 4],
  [1],
  [4, 1, 9],
  [2, 6, 4],
  [3, 5],
  [5, 3, 1],
  [6, 8, 4],
  [7],
  [4, 7, 3],
  [8, 0]
];
var GOD = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"];
var GOD_LINE = [
  "比肩多时，像身边站着同样步调的人。",
  "劫财显眼时，分享和争夺会一起出现。",
  "食神是日主缓缓生出的那一口气息。",
  "伤官是日主用更锐的方式把话说出来。",
  "偏财是从侧面伸手碰到的资源。",
  "正财是摆在明面上、可以照看的资源。",
  "七杀是同一种压力直接压到身上。",
  "正官是公开的规矩、角色和岗位。",
  "偏印是从侧门进来的滋养与想法。",
  "正印是正面盖下来的庇护与学习。"
];
var GOD_EN = [
  "Peers of the same charge stand beside the day stem.",
  "A rival of the same element shares the store.",
  "What the day stem produces gently.",
  "What the day stem produces in a sharper key.",
  "Wealth reached sideways.",
  "Wealth held in the open.",
  "Pressure of the same charge.",
  "An open role, rule, and post.",
  "Nourishment through a side door.",
  "Nourishment in the open, a seal of support."
];
var TIANYI = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [2, 6], [3, 5], [3, 5]];
var WENCHANG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
var LU = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
var YANGREN = [3, 4, 6, 7, 6, 7, 9, 10, 0, 1];
var YIMA = [2, 8, 11, 5];
var TAOHUA = [9, 3, 6, 0];
var HUAGAI = [4, 10, 1, 7];
var JIANG = [0, 6, 9, 3];
var SHEN = {
  "天乙贵人": ["天乙", "传统贵人星，由日干对照地支。", "A traditional noble mark matched from the day stem."],
  "文昌": ["文昌", "传统文昌，由日干对照地支。", "A traditional mark for study and writing."],
  "驿马": ["驿马", "传统驿马，由年支或日支的三合推出。", "A traditional mark for movement."],
  "桃花": ["桃花", "传统桃花，由年支或日支的三合推出。", "A traditional mark for attraction."],
  "华盖": ["华盖", "传统华盖，由年支或日支的三合推出。", "A traditional mark for solitude and craft."],
  "将星": ["将星", "传统将星，由年支或日支的三合推出。", "A traditional leading-star mark."],
  "羊刃": ["羊刃", "传统羊刃，由日干对照地支。", "A traditional keen-edge mark from the day stem."],
  "禄神": ["禄神", "传统禄神，日干所临之支。", "The traditional post of the day stem."],
  "红鸾": ["红鸾", "传统红鸾，由年支推出。", "A traditional mark for a celebratory meeting."],
  "天喜": ["天喜", "传统天喜，在红鸾对宫。", "A traditional joyful mark opposite the red-phoenix seat."]
};
var PLANETS = [
  ["日", "太阳", 280.46, 0.9856474],
  ["月", "太阴", 218.316, 13.176396],
  ["水", "水星", 252.251, 4.09233445],
  ["金", "金星", 181.98, 1.60213034],
  ["火", "火星", 355.433, 0.52402068],
  ["木", "木星", 34.351, 0.08308529],
  ["土", "土星", 50.077, 0.03344414]
];
var SIGNS = ["白羊", "金牛", "双子", "巨蟹", "狮子", "处女", "天秤", "天蝎", "射手", "摩羯", "水瓶", "双鱼"];
var ROLES = ["年柱", "月柱", "日柱", "时柱"];
var ROLE_EN = ["year", "month", "day", "hour"];

function mod(n, m) {
  return ((n % m) + m) % m;
}

function jdn(y, m, d) {
  var a = Math.floor((14 - m) / 12);
  var yy = y + 4800 - a;
  var mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function sunLon(jd) {
  var T = (jd - 2451545) / 36525;
  var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  var M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  var Mr = M * Math.PI / 180;
  var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
    + 0.000289 * Math.sin(3 * Mr);
  return mod(L0 + C, 360);
}

function dayIndex(y, m, d) {
  return mod(jdn(y, m, d) + 49, 60);
}

function hourBranch(h) {
  if (h === 23 || h === 0) return 0;
  return Math.floor((h + 1) / 2);
}

function godIndex(dayStem, other) {
  var de = EL[dayStem];
  var oe = EL[other];
  var same = (dayStem % 2) === (other % 2);
  if (de === oe) return same ? 0 : 1;
  if ((de + 1) % 5 === oe) return same ? 2 : 3;
  if ((de + 2) % 5 === oe) return same ? 4 : 5;
  if ((de + 3) % 5 === oe) return same ? 6 : 7;
  return same ? 8 : 9;
}

function godName(dayStem, other, isSelf) {
  if (isSelf) return "日主";
  return GOD[godIndex(dayStem, other)];
}

function groupOf(b) {
  if (b === 8 || b === 0 || b === 4) return 0;
  if (b === 2 || b === 6 || b === 10) return 1;
  if (b === 5 || b === 9 || b === 1) return 2;
  return 3;
}

function shenHits(pillars, dayStem) {
  var hits = [];
  function add(key, pi, branch) {
    for (var i = 0; i < hits.length; i++) {
      if (hits[i].key === key && hits[i].pi === pi) return;
    }
    hits.push({ key: key, pi: pi, branch: branch });
  }
  var tables = [
    ["天乙贵人", TIANYI[dayStem]],
    ["文昌", [WENCHANG[dayStem]]],
    ["禄神", [LU[dayStem]]],
    ["羊刃", [YANGREN[dayStem]]]
  ];
  for (var t = 0; t < tables.length; t++) {
    var arr = tables[t][1];
    for (var pi = 0; pi < 4; pi++) {
      var b = pillars[pi].branch;
      for (var k = 0; k < arr.length; k++) if (arr[k] === b) add(tables[t][0], pi, b);
    }
  }
  var refs = [pillars[0].branch, pillars[2].branch];
  var groups = [["驿马", YIMA], ["桃花", TAOHUA], ["华盖", HUAGAI], ["将星", JIANG]];
  for (var r = 0; r < refs.length; r++) {
    var g = groupOf(refs[r]);
    for (var u = 0; u < groups.length; u++) {
      var dest = groups[u][1][g];
      for (var pj = 0; pj < 4; pj++) if (pillars[pj].branch === dest) add(groups[u][0], pj, dest);
    }
  }
  var hl = mod(15 - pillars[0].branch, 12);
  var tx = mod(hl + 6, 12);
  for (var q = 0; q < 4; q++) {
    if (pillars[q].branch === hl) add("红鸾", q, hl);
    if (pillars[q].branch === tx) add("天喜", q, tx);
  }
  return hits;
}

function planetList(jd) {
  var day = jd - 2451545;
  var out = [];
  for (var i = 0; i < PLANETS.length; i++) {
    var p = PLANETS[i];
    out.push({ name: p[0], zh: p[1], lon: mod(p[2] + p[3] * day, 360) });
  }
  return out;
}

function cast(y, m, d, h, minute) {
  var jd = jdn(y, m, d) + (h - 12) / 24 + (minute || 0) / 1440;
  var lon = sunLon(jd);
  var yy = y;
  if (m < 3 && (m === 1 || lon < 315)) yy = y - 1;
  var yStem = mod(yy - 4, 10);
  var yBranch = mod(yy - 4, 12);
  var mBranch = mod(2 + Math.floor(mod(lon - 315, 360) / 30), 12);
  var mStem = mod((yStem % 5) * 2 + 2 + mod(mBranch - 2, 12), 10);
  var di = dayIndex(y, m, d);
  var dStem = di % 10;
  var dBranch = di % 12;
  var hb = hourBranch(h);
  var hStem = mod((dStem % 5) * 2 + hb, 10);
  var pillars = [
    { stem: yStem, branch: yBranch },
    { stem: mStem, branch: mBranch },
    { stem: dStem, branch: dBranch },
    { stem: hStem, branch: hb }
  ];
  return {
    y: y, m: m, d: d, h: h, min: minute || 0,
    jd: jd, lon: lon, pillars: pillars, dayStem: dStem,
    hits: shenHits(pillars, dStem),
    planets: planetList(jd)
  };
}

function godTally(chart) {
  var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var ds = chart.dayStem;
  for (var i = 0; i < 4; i++) {
    if (i !== 2) c[godIndex(ds, chart.pillars[i].stem)]++;
    var hs = HIDE[chart.pillars[i].branch];
    for (var k = 0; k < hs.length; k++) c[godIndex(ds, hs[k])]++;
  }
  return c;
}

function loudest(tally) {
  var bi = 0;
  var bv = -1;
  for (var i = 0; i < 10; i++) if (tally[i] > bv) { bv = tally[i]; bi = i; }
  return bi;
}

function elementTally(chart) {
  var c = [0, 0, 0, 0, 0];
  for (var i = 0; i < 4; i++) {
    var p = chart.pillars[i];
    c[EL[p.stem]]++;
    c[BEL[p.branch]]++;
    var hs = HIDE[p.branch];
    for (var k = 0; k < hs.length; k++) c[EL[hs[k]]]++;
  }
  return c;
}

function reading(chart, gender) {
  var ds = chart.dayStem;
  var li = loudest(godTally(chart));
  var yy = ds % 2 === 0 ? "阳" : "阴";
  var voice = "未指定传统排盘性别，不分男女的神煞不另算。";
  if (gender === "m") voice = "按乾造的口吻来读：官星更像职责与外界的规矩。";
  if (gender === "f") voice = "按坤造的口吻来读：官星更像关系里的边界与期待。";
  return STEM[ds] + ELN[EL[ds]] + "为日主（" + yy + ELN[EL[ds]] + "）。十神里" + GOD[li] + "最显眼。" + GOD_LINE[li] + voice + "星环在转，出生盘不改。这是娱乐图景，不是性格或命运的测量。";
}

/*__APP__*/

(function () {
  var FONT = '"Songti SC","Noto Serif CJK SC","Noto Sans CJK SC","PingFang SC",Palatino,serif';
  var TONE = ["#9ad7b4", "#ef8b72", "#e6c27a", "#f4f0e6", "#8ebbe8", "#d9b4f0", "#c5d7f2", "#fff6d8"];
  var CAM = 4.6;
  var FOC = 3.4;
  var BASE_F = FOC / CAM;
  var DISC = "Entertainment sky. Not a measure of character or fate.";
  var RINGS = [
    { r: 0.48, ax: 0.58, az: 0.16, speed: 0.08, rgb: "226,196,122", a: 0.92, spin: 0.35 },
    { r: 0.68, ax: 0.92, az: -0.4, speed: -0.055, rgb: "206,168,96", a: 0.78, spin: 1.55 },
    { r: 0.86, ax: 0.7, az: 0.52, speed: 0.06, rgb: "146,196,178", a: 0.74, spin: 0.7 },
    { r: 1.04, ax: 0.2, az: 0.06, speed: 0.03, rgb: "168,196,226", a: 0.66, spin: 0.2 }
  ];
  var WIRES = [
    { r: 0.94, ax: 1.42, az: 0.38, speed: 0, rgb: "226,196,122", a: 0.34, spin: 0.6 }
  ];

  var stage = document.getElementById("stage");
  var sky = document.getElementById("sky");
  var ctx = sky.getContext("2d", { alpha: false });
  var gear = document.getElementById("gear");
  var dock = document.getElementById("dock");
  var note = document.getElementById("note");
  var noteTitle = document.getElementById("note-title");
  var noteBody = document.getElementById("note-body");
  var noteClose = document.getElementById("note-close");
  var dateEl = document.getElementById("date");
  var timeEl = document.getElementById("time");
  var genderEl = document.getElementById("gender");
  var pillarsEl = document.getElementById("pillars");
  var elEl = document.getElementById("elcount");
  var shenEl = document.getElementById("shen");
  var readingEl = document.getElementById("reading");

  var chart = null;
  var marks = null;
  var chartDirty = true;
  var flowKey = -1;
  var nextFlow = 0;
  var yaw = 0.55;
  var pitch = 0.26;
  var zoom = 1;
  var spins = [];
  var wireSpins = [];
  var i;
  for (i = 0; i < RINGS.length; i++) spins.push(RINGS[i].spin);
  for (i = 0; i < WIRES.length; i++) wireSpins.push(WIRES[i].spin);

  var cssW = 0;
  var cssH = 0;
  var dpr = 1;
  var skyLayer = null;
  var tw = [];
  var glow = null;
  var fitR = 120;
  var cx = 0;
  var cy = 0;
  var sent = false;
  var lastT = 0;
  var cyaw = 1;
  var syaw = 0;
  var cpitch = 1;
  var spitch = 0;
  var loc = [0, 0, 0];
  var wor = [0, 0, 0];
  var pj = [0, 0, 0];
  var POOL = 64;
  var slots = [];
  var order = new Array(POOL);
  for (i = 0; i < POOL; i++) {
    slots.push({ sx: 0, sy: 0, z: 0, sc: 1, text: "", tone: 0, hit: 18, mi: -1 });
  }
  var slotN = 0;

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function blot(g, x, y, rad, color) {
    var rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, color);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, cssW, cssH);
  }

  function buildSky() {
    var c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(cssW * dpr));
    c.height = Math.max(1, Math.round(cssH * dpr));
    var g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var bg = g.createLinearGradient(0, 0, 0, cssH);
    bg.addColorStop(0, "#07051c");
    bg.addColorStop(0.4, "#140a24");
    bg.addColorStop(0.72, "#0c1020");
    bg.addColorStop(1, "#05040c");
    g.fillStyle = bg;
    g.fillRect(0, 0, cssW, cssH);
    var span = cssW > cssH ? cssW : cssH;
    blot(g, cssW * 0.5, cssH * 0.46, span * 0.46, "rgba(98, 52, 150, 0.40)");
    blot(g, cssW * 0.2, cssH * 0.26, span * 0.26, "rgba(36, 78, 120, 0.22)");
    blot(g, cssW * 0.8, cssH * 0.66, span * 0.22, "rgba(150, 78, 42, 0.14)");
    blot(g, cssW * 0.5, cssH * 0.48, span * 0.16, "rgba(220, 180, 110, 0.12)");
    var rnd = mulberry32(19980816);
    var n;
    g.fillStyle = "#ffffff";
    for (n = 0; n < 80; n++) {
      var t = rnd();
      g.globalAlpha = 0.12 + rnd() * 0.4;
      g.beginPath();
      g.arc(t * cssW, cssH * (0.16 + 0.58 * t) + (rnd() - 0.5) * cssH * 0.07, rnd() * 1.05 + 0.2, 0, TAU);
      g.fill();
    }
    for (n = 0; n < 150; n++) {
      var hot = rnd();
      g.globalAlpha = 0.35 + rnd() * 0.65;
      g.fillStyle = hot > 0.94 ? "#ffe6b0" : hot > 0.84 ? "#c5d4ff" : "#ffffff";
      g.beginPath();
      g.arc(rnd() * cssW, rnd() * cssH, rnd() * 1.2 + 0.25, 0, TAU);
      g.fill();
    }
    g.globalAlpha = 1;
    var vg = g.createRadialGradient(cssW * 0.5, cssH * 0.48, Math.min(cssW, cssH) * 0.2, cssW * 0.5, cssH * 0.5, span * 0.72);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.42)");
    g.fillStyle = vg;
    g.fillRect(0, 0, cssW, cssH);
    skyLayer = c;
    tw.length = 0;
    var rnd2 = mulberry32(816);
    for (n = 0; n < 22; n++) {
      tw.push({
        x: rnd2() * cssW,
        y: rnd2() * cssH,
        s: rnd2() * 1.4 + 0.4,
        k: 0.6 + rnd2() * 1.8,
        p: rnd2() * TAU,
        hot: rnd2() > 0.8
      });
    }
  }

  function makeGlow() {
    var c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    var g = c.getContext("2d");
    var rg = g.createRadialGradient(128, 136, 8, 128, 128, 126);
    rg.addColorStop(0, "rgba(16, 10, 26, 0.94)");
    rg.addColorStop(0.32, "rgba(54, 30, 72, 0.55)");
    rg.addColorStop(0.58, "rgba(190, 150, 78, 0.16)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 256, 256);
    return c;
  }

  function validDate(y, m, d) {
    if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return false;
    var probe = new Date(y, m - 1, d);
    return probe.getFullYear() === y && probe.getMonth() === m - 1 && probe.getDate() === d;
  }

  function applyForm() {
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateEl.value || "");
    var tm = /^(\d{2}):(\d{2})/.exec(timeEl.value || "");
    if (!dm) return;
    var y = +dm[1];
    var m = +dm[2];
    var d = +dm[3];
    var hh = tm ? +tm[1] : 12;
    var mi = tm ? +tm[2] : 0;
    if (!validDate(y, m, d)) return;
    chart = cast(y, m, d, hh, mi);
    chartDirty = true;
    note.hidden = true;
    fillDock();
  }

  function fillDock() {
    if (!chart) return;
    var bits = [];
    var names = ["年", "月", "日", "时"];
    for (var p = 0; p < 4; p++) {
      var col = chart.pillars[p];
      bits.push(STEM[col.stem] + BRANCH[col.branch] + names[p]);
    }
    pillarsEl.textContent = bits.join("  ");
    var tally = elementTally(chart);
    var ep = [];
    for (var e = 0; e < 5; e++) ep.push(ELN[e] + tally[e]);
    elEl.textContent = "干支藏干  " + ep.join("  ");
    if (!chart.hits.length) {
      shenEl.textContent = "这十种神煞未命中。";
    } else {
      var sb = [];
      for (var s = 0; s < chart.hits.length; s++) {
        var h = chart.hits[s];
        sb.push(h.key + "·" + names[h.pi]);
      }
      var line = sb.join("  ");
      if (chart.hits.length > 14) line += "  （星环画出前十四）";
      shenEl.textContent = line;
    }
    var li = loudest(godTally(chart));
    readingEl.textContent = reading(chart, genderEl.value) + " " + GOD_EN[li];
  }

  function buildMarks(flowDate) {
    var out = [];
    var ds = chart.dayStem;
    var pi;
    for (pi = 0; pi < 4; pi++) {
      var p = chart.pillars[pi];
      var self = pi === 2;
      var g = godName(ds, p.stem, self);
      out.push({
        ring: 0,
        ang: (pi / 4) * TAU,
        text: STEM[p.stem] + BRANCH[p.branch],
        tone: EL[p.stem],
        title: STEM[p.stem] + BRANCH[p.branch] + " · " + ROLES[pi],
        zh: ROLES[pi] + "。" + STEM[p.stem] + "为" + g + "，地支" + BRANCH[p.branch] + "属" + ELN[BEL[p.branch]] + "。藏干在下一环。",
        en: self ? "Day pillar. The day stem is also drawn on the figure." : ("Stem reads as a ten-god. " + GOD_EN[godIndex(ds, p.stem)])
      });
      var hs = HIDE[p.branch];
      for (var k = 0; k < hs.length; k++) {
        var st = hs[k];
        var gg = godName(ds, st, false);
        out.push({
          ring: 1,
          ang: 0,
          text: STEM[st],
          tone: EL[st],
          title: STEM[st] + " · " + gg,
          zh: ROLES[pi] + BRANCH[p.branch] + "的藏干" + (k === 0 ? "（本气）" : "") + "。相对日主为" + gg + "。",
          en: "Hidden stem. " + GOD_EN[godIndex(ds, st)]
        });
      }
    }
    var hn = 0;
    for (pi = 0; pi < out.length; pi++) if (out[pi].ring === 1) hn++;
    var hi = 0;
    for (pi = 0; pi < out.length; pi++) {
      if (out[pi].ring === 1) {
        out[pi].ang = (hi + 0.5) / hn * TAU;
        hi++;
      }
    }
    var nHit = chart.hits.length > 14 ? 14 : chart.hits.length;
    for (pi = 0; pi < nHit; pi++) {
      var hit = chart.hits[pi];
      var meta = SHEN[hit.key];
      out.push({
        ring: 2,
        ang: (pi + 0.5) / nHit * TAU,
        text: meta[0],
        tone: 5,
        title: hit.key + " · " + ROLES[hit.pi],
        zh: "落在" + ROLES[hit.pi] + BRANCH[hit.branch] + "。" + meta[1],
        en: meta[2]
      });
    }
    for (pi = 0; pi < chart.planets.length; pi++) {
      var pl = chart.planets[pi];
      var si = Math.floor(pl.lon / 30) % 12;
      out.push({
        ring: 3,
        ang: pl.lon * Math.PI / 180,
        text: pl.name,
        tone: 6,
        title: pl.zh,
        zh: "出生时刻的平黄经约 " + pl.lon.toFixed(0) + "°，靠近" + SIGNS[si] + "。大小与距离不做比例。",
        en: "Mean ecliptic longitude near " + SIGNS[si] + ". Not a scaled orrery."
      });
    }
    var fi = dayIndex(flowDate.getFullYear(), flowDate.getMonth() + 1, flowDate.getDate());
    var ang = (fi / 60) * TAU;
    var guard;
    for (guard = 0; guard < 8; guard++) {
      var hit = false;
      for (pi = 0; pi < chart.planets.length; pi++) {
        var diff = Math.abs(ang - chart.planets[pi].lon * Math.PI / 180);
        diff = mod(diff, TAU);
        if (diff > Math.PI) diff = TAU - diff;
        if (diff < 0.42) { ang += 0.55; hit = true; break; }
      }
      if (!hit) break;
    }
    out.push({
      ring: 3,
      ang: ang,
      text: "流",
      tone: 7,
      title: "流日 " + STEM[fi % 10] + BRANCH[fi % 12],
      zh: "今天的日柱，标出出生之后的运行，不改出生四柱。",
      en: "Today's day pillar, a transit mark. The birth chart stays put."
    });
    return out;
  }

  function ensureMarks(now) {
    if (marks && !chartDirty && now < nextFlow) return;
    nextFlow = now + 30000;
    var d = new Date();
    var key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    if (marks && !chartDirty && key === flowKey) return;
    flowKey = key;
    chartDirty = false;
    marks = buildMarks(d);
  }

  function layout() {
    var top = 50;
    var bot = 46;
    var cy0 = cssH * 0.47;
    var minCy = top + 36;
    var maxCy = cssH - bot - 36;
    cy = cy0 < minCy ? minCy : cy0 > maxCy ? maxCy : cy0;
    cx = cssW * 0.5;
    var roomX = cssW * 0.5 - 28;
    var above = cy - top;
    var below = cssH - bot - cy;
    var roomY = above < below ? above : below;
    var room = roomX < roomY ? roomX : roomY;
    if (room < 48) room = 48;
    fitR = room * zoom;
  }

  function scene(src, dst) {
    var x1 = src[0] * cyaw + src[2] * syaw;
    var z1 = -src[0] * syaw + src[2] * cyaw;
    dst[0] = x1;
    dst[1] = src[1] * cpitch - z1 * spitch;
    dst[2] = src[1] * spitch + z1 * cpitch;
  }

  function localRing(ang, radius, ax, az) {
    var x = Math.cos(ang) * radius;
    var z0 = Math.sin(ang) * radius;
    var sax = Math.sin(ax);
    var cax = Math.cos(ax);
    var y1 = -z0 * sax;
    var z1 = z0 * cax;
    var saz = Math.sin(az);
    var caz = Math.cos(az);
    loc[0] = x * caz - y1 * saz;
    loc[1] = x * saz + y1 * caz;
    loc[2] = z1;
  }

  function project(x, y, z) {
    var depth = CAM - z;
    if (depth < 0.35) depth = 0.35;
    var f = FOC / depth;
    var unit = fitR * CAM / FOC;
    pj[0] = cx + x * f * unit;
    pj[1] = cy - y * f * unit;
    pj[2] = f;
  }

  function strokeLoop(radius, ax, az, spin, rgb, alpha, width) {
    ctx.beginPath();
    var k;
    for (k = 0; k <= 64; k++) {
      localRing(spin + (k % 64) / 64 * TAU, radius, ax, az);
      scene(loc, wor);
      project(wor[0], wor[1], wor[2]);
      if (k === 0) ctx.moveTo(pj[0], pj[1]);
      else ctx.lineTo(pj[0], pj[1]);
    }
    ctx.strokeStyle = "rgba(" + rgb + "," + alpha + ")";
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawRing(ring, spin) {
    strokeLoop(ring.r, ring.ax, ring.az, spin, ring.rgb, ring.a * 0.28, 3.2);
    strokeLoop(ring.r, ring.ax, ring.az, spin, ring.rgb, ring.a, 1.15);
  }

  function drawTicks(ring, spin) {
    ctx.strokeStyle = "rgba(168,196,226,0.5)";
    ctx.lineWidth = 1;
    var t;
    for (t = 0; t < 12; t++) {
      var a = spin + t / 12 * TAU;
      localRing(a, ring.r * 0.96, ring.ax, ring.az);
      scene(loc, wor);
      project(wor[0], wor[1], wor[2]);
      var x0 = pj[0];
      var y0 = pj[1];
      localRing(a, ring.r * 1.045, ring.ax, ring.az);
      scene(loc, wor);
      project(wor[0], wor[1], wor[2]);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(pj[0], pj[1]);
      ctx.stroke();
    }
  }

  function roundRect(x, y, w, h, r) {
    var rr = r > h * 0.5 ? h * 0.5 : r;
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawSpirit() {
    var s = fitR * 0.5;
    var gx = s * 1.85;
    ctx.drawImage(glow, cx - gx * 0.5, cy - gx * 0.62, gx, gx * 1.15);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineWidth = s * 0.03 > 1.5 ? s * 0.03 : 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(246, 228, 186, 0.96)";
    ctx.fillStyle = "rgba(16, 10, 24, 0.78)";
    ctx.beginPath();
    ctx.ellipse(0, s * 0.42, s * 0.48, s * 0.1, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.44, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.02, s * 0.42, s * 0.38, s * 0.14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.44, s * 0.2);
    ctx.quadraticCurveTo(s * 0.02, s * 0.42, -s * 0.38, s * 0.14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.2);
    ctx.lineTo(-s * 0.22, s * 0.1);
    ctx.quadraticCurveTo(0, s * 0.22, s * 0.22, s * 0.1);
    ctx.lineTo(s * 0.15, -s * 0.2);
    ctx.quadraticCurveTo(0, -s * 0.08, -s * 0.15, -s * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.13, -s * 0.14);
    ctx.quadraticCurveTo(-s * 0.42, 0, -s * 0.32, s * 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.13, -s * 0.14);
    ctx.quadraticCurveTo(s * 0.42, 0, s * 0.32, s * 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.34);
    ctx.lineTo(0, -s * 0.24);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 0.46, s * 0.115, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    var ch = STEM[chart.dayStem];
    var size = Math.round(fitR * 0.12);
    if (size < 14) size = 14;
    if (size > 26) size = 26;
    ctx.font = "600 " + size + "px " + FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TONE[EL[chart.dayStem]];
    ctx.fillText(ch, cx, cy + s * 0.0);
    return s;
  }

  function placeMarks() {
    slotN = 0;
    var n = marks.length;
    if (n > POOL) n = POOL;
    var i;
    for (i = 0; i < n; i++) {
      var mk = marks[i];
      var ring = RINGS[mk.ring];
      localRing(mk.ang + spins[mk.ring], ring.r, ring.ax, ring.az);
      scene(loc, wor);
      project(wor[0], wor[1], wor[2]);
      var s = slots[slotN];
      s.hx = pj[0];
      s.hy = pj[1];
      s.sx = pj[0];
      s.sy = pj[1];
      s.z = wor[2];
      s.sc = pj[2];
      s.text = mk.text;
      s.tone = mk.tone;
      s.mi = i;
      measureSeal(s);
      slotN++;
    }
    relaxSeals();
    for (i = 0; i < slotN; i++) order[i] = i;
    for (i = 1; i < slotN; i++) {
      var key = order[i];
      var j = i - 1;
      while (j >= 0 && slots[order[j]].z > slots[key].z) {
        order[j + 1] = order[j];
        j--;
      }
      order[j + 1] = key;
    }
  }

  function measureSeal(s) {
    var size = 12.5 * (s.sc / BASE_F);
    if (size < 11) size = 11;
    if (size > 17) size = 17;
    var chars = s.text.length;
    s.size = size;
    if (chars > 1) {
      s.w = chars * size * 0.92 + 8;
      s.h = size + 8;
      s.hit = (s.w > s.h ? s.w : s.h) * 0.5;
    } else {
      s.w = size * 1.44;
      s.h = size * 1.44;
      s.hit = size * 0.72 + 5;
    }
  }

  function relaxSeals() {
    var iter, i, j;
    for (iter = 0; iter < 12; iter++) {
      for (i = 0; i < slotN; i++) {
        var a = slots[i];
        var dx = a.sx - cx;
        var dy = a.sy - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) { dx = 0; dy = 1; dist = 1; }
        var core = fitR * 0.34 + a.hit * 0.35;
        if (dist < core) {
          a.sx += (dx / dist) * (core - dist);
          a.sy += (dy / dist) * (core - dist);
        }
        var ox = a.sx - a.hx;
        var oy = a.sy - a.hy;
        var od = Math.sqrt(ox * ox + oy * oy);
        if (od > 34) {
          a.sx = a.hx + (ox / od) * 34;
          a.sy = a.hy + (oy / od) * 34;
        }
      }
      for (i = 0; i < slotN; i++) {
        for (j = i + 1; j < slotN; j++) {
          var p = slots[i];
          var q = slots[j];
          var ex = q.sx - p.sx;
          var ey = q.sy - p.sy;
          var ed = Math.sqrt(ex * ex + ey * ey);
          var need = (p.hit + q.hit) * 0.92;
          if (ed >= need) continue;
          if (ed < 0.01) { ex = 1; ey = 0; ed = 1; }
          var push = (need - ed) * 0.5;
          p.sx -= (ex / ed) * push;
          p.sy -= (ey / ed) * push;
          q.sx += (ex / ed) * push;
          q.sy += (ey / ed) * push;
        }
      }
    }
  }

  function drawSeals() {
    var i;
    for (i = 0; i < slotN; i++) {
      var s = slots[order[i]];
      var near = (s.z + 1.15) / 2.3;
      if (near < 0.35) near = 0.35;
      if (near > 1) near = 1;
      ctx.globalAlpha = 0.62 + 0.38 * near;
      ctx.fillStyle = "rgba(10,7,18,0.86)";
      ctx.strokeStyle = TONE[s.tone];
      ctx.lineWidth = 1.25;
      if (s.text.length > 1) {
        roundRect(s.sx - s.w * 0.5, s.sy - s.h * 0.5, s.w, s.h, s.h * 0.5);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(s.sx, s.sy, s.size * 0.72, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#f7f1e4";
      ctx.font = "600 " + s.size.toFixed(1) + "px " + FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.text, s.sx, s.sy + 0.5);
    }
    ctx.globalAlpha = 1;
  }

  function paint(now) {
    var w = stage.clientWidth || window.innerWidth;
    var h = stage.clientHeight || window.innerHeight;
    if (w < 8 || h < 8 || !chart) return false;
    var nd = window.devicePixelRatio || 1;
    if (nd > 1.5) nd = 1.5;
    if (nd < 1) nd = 1;
    if (!skyLayer || w !== cssW || h !== cssH || nd !== dpr) {
      cssW = w;
      cssH = h;
      dpr = nd;
      sky.width = Math.round(w * dpr);
      sky.height = Math.round(h * dpr);
      buildSky();
    }
    ensureMarks(now || 0);
    layout();
    cyaw = Math.cos(yaw);
    syaw = Math.sin(yaw);
    cpitch = Math.cos(pitch);
    spitch = Math.sin(pitch);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(skyLayer, 0, 0, cssW, cssH);
    var n;
    for (n = 0; n < tw.length; n++) {
      var star = tw[n];
      var a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(now * 0.001 * star.k + star.p));
      ctx.globalAlpha = a;
      ctx.fillStyle = star.hot ? "#ffe6b0" : "#ffffff";
      ctx.fillRect(star.x, star.y, star.s, star.s);
    }
    ctx.globalAlpha = 1;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (n = 0; n < WIRES.length; n++) drawRing(WIRES[n], wireSpins[n]);
    for (n = 0; n < RINGS.length; n++) drawRing(RINGS[n], spins[n]);
    drawTicks(RINGS[3], spins[3]);
    localRing(0, 0, 0, 0);
    loc[0] = 0;
    loc[1] = -1.08;
    loc[2] = 0;
    scene(loc, wor);
    project(wor[0], wor[1], wor[2]);
    var ax0 = pj[0];
    var ay0 = pj[1];
    loc[1] = 1.08;
    scene(loc, wor);
    project(wor[0], wor[1], wor[2]);
    ctx.beginPath();
    ctx.moveTo(ax0, ay0);
    ctx.lineTo(pj[0], pj[1]);
    ctx.strokeStyle = "rgba(226,196,122,0.32)";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawSpirit();
    placeMarks();
    drawSeals();
    return true;
  }

  function openMark(mk) {
    noteTitle.textContent = mk.title;
    noteBody.textContent = mk.zh + " " + mk.en + " " + DISC;
    note.hidden = false;
    bell(mk.tone);
  }

  function openDay() {
    var ds = chart.dayStem;
    var bits = [];
    var names = ["年", "月", "日", "时"];
    for (var p = 0; p < 4; p++) {
      var col = chart.pillars[p];
      bits.push(names[p] + STEM[col.stem] + BRANCH[col.branch]);
    }
    noteTitle.textContent = STEM[ds] + " · 日主";
    noteBody.textContent = (ds % 2 ? "阴" : "阳") + ELN[EL[ds]] + "，日柱天干，这张内景的中心。" + bits.join(" ") + "。 Day stem at the center of the sky. " + DISC;
    note.hidden = false;
    bell(EL[ds]);
  }

  function hitTest(px, py) {
    var best = -1;
    var bestD = 1e9;
    for (var i = 0; i < slotN; i++) {
      var s = slots[i];
      var dx = px - s.sx;
      var dy = py - s.sy;
      var d = dx * dx + dy * dy;
      var lim = s.hit * s.hit;
      if (d <= lim && d < bestD) {
        best = i;
        bestD = d;
      }
    }
    return best;
  }

  function tapAt(clientX, clientY) {
    var rect = sky.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var idx = hitTest(x, y);
    if (idx >= 0) {
      openMark(marks[slots[idx].mi]);
      return;
    }
    var dx = x - cx;
    var dy = y - cy;
    var spirit = fitR * 0.22;
    if (dx * dx + dy * dy <= spirit * spirit) {
      openDay();
      return;
    }
    note.hidden = true;
  }

  var actx = null;
  function unlock() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!actx) {
      try { actx = new AC(); } catch (err) { actx = null; }
    }
    if (actx && actx.state === "suspended") actx.resume();
  }
  function bell(tone) {
    if (!actx) return;
    if (actx.state === "suspended") actx.resume();
    var freqs = [392, 466, 349, 523, 311, 415, 440, 494];
    var o = actx.createOscillator();
    var g = actx.createGain();
    o.type = "sine";
    o.frequency.value = freqs[tone] || 440;
    var t0 = actx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.04, t0 + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    o.connect(g);
    g.connect(actx.destination);
    o.start(t0);
    o.stop(t0 + 0.34);
  }

  var pointers = new Map();
  var mode = "none";
  var lastX = 0;
  var lastY = 0;
  var moved = 0;
  var pinchDist = 0;
  var pinchZoom = 1;

  function pairDist() {
    var it = pointers.values();
    var a = it.next().value;
    var b = it.next().value;
    if (!a || !b) return 0;
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function clampZoom(v) {
    if (v < 0.72) return 0.72;
    if (v > 1) return 1;
    return v;
  }
  function clampPitch(v) {
    if (v < -1.05) return -1.05;
    if (v > 1.05) return 1.05;
    return v;
  }

  sky.addEventListener("pointerdown", function (e) {
    if (e.button != null && e.button !== 0) return;
    unlock();
    try { sky.setPointerCapture(e.pointerId); } catch (err) {}
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      mode = "drag";
      lastX = e.clientX;
      lastY = e.clientY;
      moved = 0;
    } else {
      mode = "pinch";
      pinchDist = pairDist();
      pinchZoom = zoom;
      moved = 40;
    }
  });
  sky.addEventListener("pointermove", function (e) {
    var p = pointers.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    if (mode === "pinch" && pointers.size >= 2) {
      var d = pairDist();
      if (pinchDist > 8) zoom = clampZoom(pinchZoom * (d / pinchDist));
      return;
    }
    if (mode === "drag") {
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * 0.0075;
      pitch = clampPitch(pitch + dy * 0.0055);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (mode !== "pinch" && pointers.size === 0 && moved < 10) tapAt(e.clientX, e.clientY);
    if (pointers.size === 0) mode = "none";
    else if (pointers.size === 1) {
      mode = "drag";
      var only = pointers.values().next().value;
      lastX = only.x;
      lastY = only.y;
      moved = 40;
    }
  }
  sky.addEventListener("pointerup", endPointer);
  sky.addEventListener("pointercancel", function (e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) mode = "none";
  });
  sky.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  function stop(e) { e.stopPropagation(); }
  var block = ["pointerdown", "pointermove", "pointerup", "touchstart", "touchmove", "click"];
  var bi;
  for (bi = 0; bi < block.length; bi++) {
    gear.addEventListener(block[bi], stop);
    dock.addEventListener(block[bi], stop);
    note.addEventListener(block[bi], stop);
  }
  gear.addEventListener("click", function () {
    var on = document.body.classList.toggle("open");
    if (on) note.hidden = true;
  });
  noteClose.addEventListener("click", function () { note.hidden = true; });
  dateEl.addEventListener("change", applyForm);
  timeEl.addEventListener("change", applyForm);
  genderEl.addEventListener("change", applyForm);
  dateEl.addEventListener("input", applyForm);
  timeEl.addEventListener("input", applyForm);

  function markReady() {
    if (sent) return;
    var gb = window.__gbSandbox;
    if (gb && typeof gb.ready === "function") {
      sent = true;
      gb.ready();
    }
  }

  function frame(now) {
    var dt = lastT ? (now - lastT) / 1000 : 0.016;
    if (dt > 0.05) dt = 0.05;
    if (dt < 0) dt = 0;
    lastT = now;
    yaw += dt * 0.12;
    var r;
    for (r = 0; r < RINGS.length; r++) spins[r] += dt * RINGS[r].speed;
    var drew = false;
    try { drew = paint(now); } catch (err) {
      drew = false;
      if (!window.__yjPaint) {
        window.__yjPaint = String(err && err.stack || err);
        console.error(window.__yjPaint);
      }
    }
    if (drew) markReady();
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", function () { skyLayer = null; });
  glow = makeGlow();
  applyForm();
  try { paint(0); } catch (err) {
    window.__yjPaint = String(err && err.stack || err);
    console.error(window.__yjPaint);
  }
  requestAnimationFrame(frame);
})();
