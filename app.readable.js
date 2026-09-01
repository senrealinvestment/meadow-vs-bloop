/**
 * Sparkelody Phase 3 — Worlds 1-9 ladder + closet (Pixel-only).
 * Official literacy banks W1-W9. One Pixel fluff foe path. Do not GREEN.
 */
(function () {
  "use strict";
  if (window.__MVB_BOOTED) return;
  try {
    Object.defineProperty(window, "__MVB_BOOTED", { value: true, writable: false, configurable: false });
  } catch (eBootLock) {
    window.__MVB_BOOTED = true;
  }
  window.__MVB_NO_QCHAIN = true;

  // URL is source of truth — set before any draw. ?w2=1 never starts as meadow.
  var BOOT_WORLD = "meadow";
  try {
    var _qs = (typeof location !== "undefined" && location.search) || "";
    if (typeof window !== "undefined" && window.MEADOW_START_WORLD) BOOT_WORLD = window.MEADOW_START_WORLD;
    if ((typeof window !== "undefined" && window.MEADOW_START_FROST) || /[?&](w2|frost)=1/.test(_qs)) BOOT_WORLD = "frost";
    else if (/[?&](w3|ember)=1/.test(_qs)) BOOT_WORLD = "ember";
    else if (/[?&](w4|leaf)=1/.test(_qs)) BOOT_WORLD = "leaf";
    else if (/[?&](w5|wind)=1/.test(_qs)) BOOT_WORLD = "wind";
    else if (/[?&](w6|tide)=1/.test(_qs)) BOOT_WORLD = "tide";
    else if (/[?&](w7|storm)=1/.test(_qs)) BOOT_WORLD = "storm";
    else if (/[?&](w8|harmony)=1/.test(_qs)) BOOT_WORLD = "harmony";
    else if (/[?&](w9|story)=1/.test(_qs)) BOOT_WORLD = "story";
  } catch (eBootWorld) {}
  var BOOT_FROST = BOOT_WORLD === "frost";

  // Local W3 stub only. Accidental pin of readable still needs this flag to open Ember.
  // Flip/leave true at ship time; q files are NOT rebuilt from this file.
  window.MEADOW_W3_STUB = true;

  const TILE = 32;
  const COLS = 20;
  const ROWS = 16;
  const VIEW_COLS = 15;
  const VIEW_ROWS = 11;

  const T = { GRASS: 0, PATH: 1, BRIDGE: 2, HILL: 3, WATER: 4, TALL: 5, GATE: 6 };

  // Expanded meadow ~2× stub: path, bridge corner, hill gate. One walkable area.
  // prettier-ignore
  const MAP = [
    [3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,6,6],
    [3,3,3,3,3,3,0,0,5,0,0,1,1,1,0,0,5,0,6,6],
    [3,3,3,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0],
    [3,3,0,0,5,0,0,1,1,1,1,0,0,1,1,1,0,5,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,5,0,1,1,1,0,0,0,4,4,4,0,0,0,1,1,0,0,0],
    [0,0,0,1,0,0,0,0,0,2,2,2,0,0,0,0,1,0,5,0],
    [0,0,1,1,0,0,5,0,0,4,4,4,0,5,0,0,1,1,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0,5,0,0,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,5,0,0,0,0,0,0,0,0,0,0,1,0,5,0,0,0,5,0],
    [0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,1,1,1,1,1,1,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const WORLD1_BANK = "ash bat bed bit box bud bug bus cab cap cat cub cup dad dig dog fan fig fin fog fox gas gum hat hen hid hop hot jam jet kid kit lap lid log man map mat mix mop mom mud nap net nip nod nut pad pan pen pet pig pin pop pot rat red rib rug run sad sit sob sun tag ten tip top tub van vet wag wax web wet win yum zap zip".split(" ");

  /* W2: short e/i CVC only. Keep fig (i). Drop cub/fog (u/o). */
  const WORLD2_BANK = "beg bet bib big bin bit den dim dip fed fig fin fit gem get hen hid him hip hit jig jet kid kit led leg lid lip lit men met mid mix net nip peg pen pep pet pig pin pit red rib rid rim rip set sip sit ten tin tip vet web wed wet wig win yet zip".split(" ");
  const ICE_CASTS = ["tip", "nip", "bit"];
  const STAR_CASTS = ["zap", "pop", "sun", "bat", "jam"];
  const FIRE_CASTS = ["hug", "cop", "dot"];
  /* W3 CVC mastery: remaining 3-letter CVC not in W1. No silent e / sh-ch-th / vowel teams. */
  const WORLD3_BANK = "bag bam ban bop cob cop cot cut dab dam dot dug gab gap got had ham hug hut job jog jug lab lad lag lob lot mad mob mug nab nag pal pat pod pug ram rob rod rot rub sag sap sub sum tab tad tan tap tug yam yap".split(" ");

  const FOE_SKINS = [
    { artKey: "fluff_lite", name: "Bloop" },
    { artKey: "fluff_lite", name: "Sunny Bloop" },
    { artKey: "fluff_lite", name: "Moss Bloop" },
    { artKey: "fluff_lite", name: "Puddle Bloop" },
    { artKey: "fluff_lite", name: "Puff Bloop" },
    { artKey: "fluff_lite", name: "Petal Bloop" },
    { artKey: "fluff_lite", name: "Daisy Bloop" },
    { artKey: "fluff_lite", name: "Clover Bloop" },
    { artKey: "fluff_lite", name: "Berry Bloop" },
    { artKey: "fluff_lite", name: "Cloud Bloop" },
    { artKey: "fluff_lite", name: "Fluff Pup" },
    { artKey: "fluff_lite", name: "Fluff Kit" },
    { artKey: "fluff_lite", name: "Fluff Cub" },
    { artKey: "fluff_lite", name: "Soft Fluff" },
    { artKey: "fluff_lite", name: "Fluff Bun" },
    { artKey: "fluff_lite", name: "Cozy Fluff" },
    { artKey: "fluff_lite", name: "Fluff Moth" },
    { artKey: "fluff_lite", name: "Fluff Fox" },
    { artKey: "fluff_lite", name: "Fluff Bee" },
    { artKey: "fluff_lite", name: "Fluff Owl" },
  ];

  // 20 foe spots; star_bloom spawns on W2 GATE only after all 20 foes are cleared
  const ENCOUNTER_SPOTS = [
    { x: 8, y: 2, type: "foe", foe: 0 },
    { x: 16, y: 2, type: "foe", foe: 1 },
    { x: 4, y: 4, type: "foe", foe: 2 },
    { x: 17, y: 4, type: "foe", foe: 3 },
    { x: 1, y: 6, type: "foe", foe: 4 },
    { x: 6, y: 8, type: "foe", foe: 5 },
    { x: 13, y: 8, type: "foe", foe: 6 },
    { x: 18, y: 7, type: "foe", foe: 7 },
    { x: 9, y: 10, type: "foe", foe: 8 },
    { x: 1, y: 12, type: "foe", foe: 9 },
    { x: 14, y: 12, type: "foe", foe: 10 },
    { x: 18, y: 12, type: "foe", foe: 11 },
    { x: 10, y: 6, type: "foe", foe: 12 },
    { x: 9, y: 6, type: "foe", foe: 13 },
    { x: 11, y: 6, type: "foe", foe: 14 },
    { x: 5, y: 2, type: "foe", foe: 15 },
    { x: 12, y: 2, type: "foe", foe: 16 },
    { x: 2, y: 8, type: "foe", foe: 17 },
    { x: 15, y: 4, type: "foe", foe: 18 },
    { x: 7, y: 12, type: "foe", foe: 19 },
    { x: 18, y: 1, type: "boss", id: "star_bloom" },
  ];

  const FROST_MAP = [
    [3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6],
    [3,3,3,0,0,0,1,1,1,0,0,5,0,0,1,1,0,0,6,6],
    [3,0,0,0,0,1,1,0,1,1,1,0,0,0,1,0,0,0,0,0],
    [0,0,5,0,1,1,0,0,0,0,1,1,1,0,1,1,0,5,0,0],
    [0,0,0,1,1,0,0,4,4,4,0,0,1,0,0,1,0,0,0,0],
    [0,5,0,1,0,0,0,4,4,4,0,0,1,1,0,1,1,0,0,0],
    [0,0,0,1,0,0,5,4,4,4,0,5,0,1,0,0,1,0,5,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0],
    [0,0,1,0,0,5,0,0,0,0,5,0,0,0,1,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1,0,0],
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0],
    [0,5,0,0,0,0,0,0,0,1,0,5,0,0,0,1,0,0,5,0],
    [0,0,0,1,1,1,1,1,0,1,1,1,1,0,0,1,0,0,0,0],
    [6,0,0,1,0,0,0,1,1,1,0,0,1,0,0,1,0,0,0,0],
    [6,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  const FROST_FOE_SKINS = [
    { artKey: "fluff_lite", name: "Ice Bloop" },
    { artKey: "fluff_lite", name: "Frost Bloop" },
    { artKey: "fluff_lite", name: "Snow Bloop" },
    { artKey: "fluff_lite", name: "Chill Bloop" },
    { artKey: "fluff_lite", name: "Glaze Bloop" },
    { artKey: "fluff_lite", name: "Crystal Bloop" },
    { artKey: "fluff_lite", name: "Puff Ice" },
    { artKey: "fluff_lite", name: "Rime Bloop" },
    { artKey: "fluff_lite", name: "Hail Bloop" },
    { artKey: "fluff_lite", name: "Shiver Bloop" },
    { artKey: "fluff_lite", name: "Nip Bloop" },
    { artKey: "fluff_lite", name: "Mint Bloop" },
    { artKey: "fluff_lite", name: "Snow Fluff" },
    { artKey: "fluff_lite", name: "Frost Pup" },
    { artKey: "fluff_lite", name: "Ice Kit" },
    { artKey: "fluff_lite", name: "Chill Cub" },
    { artKey: "fluff_lite", name: "Fluff Drift" },
    { artKey: "fluff_lite", name: "Powder Fluff" },
    { artKey: "fluff_lite", name: "Fluff Flake" },
    { artKey: "fluff_lite", name: "Fluff Rime" },
    { artKey: "fluff_lite", name: "Soft Snow" },
    { artKey: "fluff_lite", name: "Fluff Hail" },
    { artKey: "fluff_lite", name: "Cozy Ice" },
    { artKey: "fluff_lite", name: "Fluff Glacier" },
  ];
  const FROST_SPOTS = [
    { x: 8, y: 1, type: "foe", foe: 0 },
    { x: 16, y: 1, type: "foe", foe: 1 },
    { x: 4, y: 3, type: "foe", foe: 2 },
    { x: 17, y: 4, type: "foe", foe: 3 },
    { x: 1, y: 6, type: "foe", foe: 4 },
    { x: 6, y: 7, type: "foe", foe: 5 },
    { x: 13, y: 7, type: "foe", foe: 6 },
    { x: 18, y: 7, type: "foe", foe: 7 },
    { x: 9, y: 9, type: "foe", foe: 8 },
    { x: 1, y: 12, type: "foe", foe: 9 },
    { x: 14, y: 11, type: "foe", foe: 10 },
    { x: 18, y: 12, type: "foe", foe: 11 },
    { x: 10, y: 6, type: "foe", foe: 12 },
    { x: 7, y: 6, type: "foe", foe: 13 },
    { x: 11, y: 7, type: "foe", foe: 14 },
    { x: 5, y: 1, type: "foe", foe: 15 },
    { x: 12, y: 2, type: "foe", foe: 16 },
    { x: 2, y: 8, type: "foe", foe: 17 },
    { x: 15, y: 4, type: "foe", foe: 18 },
    { x: 7, y: 12, type: "foe", foe: 19 },
    { x: 4, y: 8, type: "foe", foe: 20 },
    { x: 16, y: 8, type: "foe", foe: 21 },
    { x: 8, y: 12, type: "foe", foe: 22 },
    { x: 17, y: 13, type: "foe", foe: 23 },
    { x: 18, y: 1, type: "boss", id: "ice_howl" },
  ];
  const FROST_NPCS = [
    {
      id: "scout",
      name: "Frost Scout",
      x: 5, y: 13,
      color: "#4fc3f7",
      talk: function (st) {
        if (st.powers.ice) return "Ice is yours! Walk the east gate into Ember Grove.";
        return "Clear every frost foe first. Then Ice Howl stands on the east World 3 gate. Twenty reads — Ice after you win.";
      },
    },
    {
      id: "pup",
      name: "Snow Pup",
      x: 12, y: 9,
      color: "#90caf9",
      talk: function (st) {
        if (st.powers.ice) return "You beat Ice Howl! Brr-avo. Ember Grove is east.";
        return "All 24 foes, then Ice Howl on the east gate. Twenty reads. No scary turns — just reading!";
      },
    },
  ];

  // Ember Grove map — tileset pending (Pixel has not painted Ember tiles). Clone of FROST_MAP layout.
  // prettier-ignore
  const EMBER_MAP = [
    [3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6],
    [3,3,3,0,0,0,1,1,1,0,0,5,0,0,1,1,0,0,6,6],
    [3,0,0,0,0,1,1,0,1,1,1,0,0,0,1,0,0,0,0,0],
    [0,0,5,0,1,1,0,0,0,0,1,1,1,0,1,1,0,5,0,0],
    [0,0,0,1,1,0,0,4,4,4,0,0,1,0,0,1,0,0,0,0],
    [0,5,0,1,0,0,0,4,4,4,0,0,1,1,0,1,1,0,0,0],
    [0,0,0,1,0,0,5,4,4,4,0,5,0,1,0,0,1,0,5,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0],
    [0,0,1,0,0,5,0,0,0,0,5,0,0,0,1,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1,0,0],
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0],
    [0,5,0,0,0,0,0,0,0,1,0,5,0,0,0,1,0,0,5,0],
    [0,0,0,1,1,1,1,1,0,1,1,1,1,0,0,1,0,0,0,0],
    [6,0,0,1,0,0,0,1,1,1,0,0,1,0,0,1,0,0,0,0],
    [6,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  // 28 placeholder skins — reuse bloop / fluff_lite until Ember foe sheets exist.
  const EMBER_FOE_SKINS = [
    { artKey: "fluff_lite", name: "Ember Bloop" },
    { artKey: "fluff_lite", name: "Cinder Bloop" },
    { artKey: "fluff_lite", name: "Spark Bloop" },
    { artKey: "fluff_lite", name: "Coal Bloop" },
    { artKey: "fluff_lite", name: "Flame Bloop" },
    { artKey: "fluff_lite", name: "Heat Bloop" },
    { artKey: "fluff_lite", name: "Glow Bloop" },
    { artKey: "fluff_lite", name: "Ash Bloop" },
    { artKey: "fluff_lite", name: "Soot Bloop" },
    { artKey: "fluff_lite", name: "Torch Bloop" },
    { artKey: "fluff_lite", name: "Chili Bloop" },
    { artKey: "fluff_lite", name: "Magma Bloop" },
    { artKey: "fluff_lite", name: "Forge Bloop" },
    { artKey: "fluff_lite", name: "Camp Bloop" },
    { artKey: "fluff_lite", name: "Kindle Bloop" },
    { artKey: "fluff_lite", name: "Blaze Bloop" },
    { artKey: "fluff_lite", name: "Ember Fluff" },
    { artKey: "fluff_lite", name: "Cinder Pup" },
    { artKey: "fluff_lite", name: "Spark Kit" },
    { artKey: "fluff_lite", name: "Coal Cub" },
    { artKey: "fluff_lite", name: "Flame Fluff" },
    { artKey: "fluff_lite", name: "Heat Fluff" },
    { artKey: "fluff_lite", name: "Glow Fluff" },
    { artKey: "fluff_lite", name: "Ash Fluff" },
    { artKey: "fluff_lite", name: "Soot Fluff" },
    { artKey: "fluff_lite", name: "Torch Fluff" },
    { artKey: "fluff_lite", name: "Magma Fluff" },
    { artKey: "fluff_lite", name: "Blaze Fluff" },
  ];
  // 28 foes + ember_maw on east W4-gate (18,1). W4 not shipping. Empty gate until last foe.
  const EMBER_SPOTS = [
    { x: 8, y: 1, type: "foe", foe: 0 },
    { x: 16, y: 1, type: "foe", foe: 1 },
    { x: 4, y: 3, type: "foe", foe: 2 },
    { x: 17, y: 3, type: "foe", foe: 3 },
    { x: 1, y: 5, type: "foe", foe: 4 },
    { x: 6, y: 7, type: "foe", foe: 5 },
    { x: 13, y: 7, type: "foe", foe: 6 },
    { x: 18, y: 6, type: "foe", foe: 7 },
    { x: 9, y: 9, type: "foe", foe: 8 },
    { x: 1, y: 11, type: "foe", foe: 9 },
    { x: 14, y: 11, type: "foe", foe: 10 },
    { x: 18, y: 11, type: "foe", foe: 11 },
    { x: 10, y: 6, type: "foe", foe: 12 },
    { x: 7, y: 6, type: "foe", foe: 13 },
    { x: 11, y: 6, type: "foe", foe: 14 },
    { x: 5, y: 1, type: "foe", foe: 15 },
    { x: 12, y: 2, type: "foe", foe: 16 },
    { x: 2, y: 8, type: "foe", foe: 17 },
    { x: 15, y: 4, type: "foe", foe: 18 },
    { x: 7, y: 12, type: "foe", foe: 19 },
    { x: 4, y: 8, type: "foe", foe: 20 },
    { x: 16, y: 8, type: "foe", foe: 21 },
    { x: 8, y: 12, type: "foe", foe: 22 },
    { x: 17, y: 13, type: "foe", foe: 23 },
    { x: 3, y: 2, type: "foe", foe: 24 },
    { x: 9, y: 4, type: "foe", foe: 25 },
    { x: 13, y: 10, type: "foe", foe: 26 },
    { x: 6, y: 14, type: "foe", foe: 27 },
    { x: 18, y: 1, type: "boss", id: "ember_maw" },
  ];
  const EMBER_NPCS = [
    {
      id: "ember_guide",
      name: "Ember Guide",
      x: 5, y: 13,
      color: "#ef6c00",
      talk: function (st) {
        if (st.powers.fire) return "Fire is yours! Walk the east gate into Leaf Hollow.";
        return "Clear every ember foe first. Then Ember Maw stands on the east World 4 gate. Twenty reads — Fire after you win.";
      },
    },
    {
      id: "cinder",
      name: "Cinder Pup",
      x: 12, y: 9,
      color: "#ff8a65",
      talk: function (st) {
        if (st.powers.fire) return "You beat Ember Maw! The Grove glows. Leaf Hollow is east.";
        return "All 28 foes, then Ember Maw on the east gate. Twenty reads. No scary turns — just reading!";
      },
    },
  ];
  const NPCS = [
    {
      id: "elder",
      name: "Meadow Elder",
      x: 4, y: 13,
      color: "#8d6e63",
      talk: function (st) {
        if (st.powers.star) {
          return st.world2Open
            ? "Star is yours! The Frost Path gate is open — World 2 awaits when ready."
            : "Star shines! Walk to the east gate for Frost Path (coming soon).";
        }
        return "Brave reader! Clear every Bloop first. Then Star Bloom appears on the east gate — beat it for Star.";
      },
    },
    {
      id: "kid",
      name: "Path Kid",
      x: 12, y: 9,
      color: "#42a5f5",
      talk: function (st) {
        if (st.powers.star) {
          return "You beat Star Bloom! Star power is so cool. The east Frost Path gate is open.";
        }
        return "Beat all the Bloops, then Star Bloom shows up on the east gate. Twenty reads for Star!";
      },
    },
  ];

  const LEAF_CASTS = ["belt", "camp", "nest"];
  const WIND_CASTS = ["fan", "sun", "hop"];
  const WATER_CASTS = ["wet", "mud", "hop"];
  const ELEC_CASTS = ["zap", "zip", "run"];
  const SHINE_CASTS = ["and", "on", "up"];
  const MELODY_CASTS = ["and", "on", "a"];
  const STRETCH_BANK = ["and", "on", "up", "a", "fast", "well", "him"];
  const WORLD4_BANK = "belt bump camp clap crib desk drip drum flag frog gift grab hand jump lamp land lift list milk nest plan pond rest sand sled slip spot stop swim tent trap vest wind".split(" ");
  const WORLD5_BANK = ["cat hop","sun run","wet mud","big fan","red hen","hot pot","sad pup","log hut","fox cub","pig pen","dog run","kid sip","bug hid","cup lid","hat box","net dip","map pin","bat hit","ten men","wet dog","big cat","red fox","hot sun","dad nap"];
  const WORLD6_BANK = ["frog hop","wet nest","jump top","stop van","gift box","lamp lit","pond mud","hand pot","sand pit","drip wet","drum tap","slip pad","tent nap","wind fan","nest egg","milk cup","desk top","grab hat","trap lid","camp log","bump van","lift cup","rest bed","rest hut"];
  const WORLD7_BANK = ["big cat ran","wet dog hid","red hen sat","hot sun set","sad pup ran","fox cub hid","kid can hop","dog can nap","hen can sit","cat can run","pig can dig","bus can run","cub can hop","man can jog","pup can run","mom can hug","dad can nap","ten men ran","big pig sat","red van ran","wet bug hid","bat can sit","log can rot","bug can zip"];
  const WORLD8_BANK = ["a big cat ran","big cat can hop","wet dog can run","red hen can sit","hot sun can set","sad pup can nap","fox cub can dig","ten men can jog","kid can hop fast","dog can run fast","a red hen sat","big pig can sit","wet bug can zip","dad can nap well","mom can hug him","a fox can run","big bus can run","cub can hop fast","hen can sit up","pup can run fast"];
  const WORLD9_BANK = ["a big cat can hop","wet dog can run fast","a big red hen sat","red hen sat on log","a fox cub can dig","big cat can hop fast","dad can nap on log","a big pig can sit","kid can hop and run","a sad pup can nap","ten men can jog fast","mom can hug a pup","a red van can run","big dog can run fast","hen can sit on log","a cat can hop fast","a big bus can run","pup can hop and run","wet bug can zip and hop","a cub can dig fast"];
  const LEAF_MAP = EMBER_MAP;
  const WIND_MAP = EMBER_MAP;
  const TIDE_MAP = EMBER_MAP;
  const STORM_MAP = EMBER_MAP;
  const HARMONY_MAP = EMBER_MAP;
  const STORY_MAP = EMBER_MAP;
  function makeSkins(theme, n) {
    const a = [];
    for (let i = 0; i < n; i++) {
      a.push({ artKey: "fluff_lite", name: theme + " Fluff" });
    }
    return a;
  }
  const LEAF_FOE_SKINS = makeSkins("Leaf", 24);
  const WIND_FOE_SKINS = makeSkins("Wind", 24);
  const TIDE_FOE_SKINS = makeSkins("Tide", 24);
  const STORM_FOE_SKINS = makeSkins("Storm", 24);
  const HARMONY_FOE_SKINS = makeSkins("Song", 20);
  const STORY_FOE_SKINS = makeSkins("Tale", 20);
  const LEAF_SPOTS = FROST_SPOTS.map(function (s) { return s.type === "boss" ? { x: s.x, y: s.y, type: "boss", id: "thorn_crown" } : { x: s.x, y: s.y, type: "foe", foe: s.foe }; });
  const WIND_SPOTS = FROST_SPOTS.map(function (s) { return s.type === "boss" ? { x: s.x, y: s.y, type: "boss", id: "gale_whisk" } : { x: s.x, y: s.y, type: "foe", foe: s.foe }; });
  const TIDE_SPOTS = FROST_SPOTS.map(function (s) { return s.type === "boss" ? { x: s.x, y: s.y, type: "boss", id: "tide_shell" } : { x: s.x, y: s.y, type: "foe", foe: s.foe }; });
  const STORM_SPOTS = FROST_SPOTS.map(function (s) { return s.type === "boss" ? { x: s.x, y: s.y, type: "boss", id: "storm_fang" } : { x: s.x, y: s.y, type: "foe", foe: s.foe }; });
  const HARMONY_SPOTS = ENCOUNTER_SPOTS.map(function (s) { return s.type === "boss" ? { x: s.x, y: s.y, type: "boss", id: "shine_bell" } : { x: s.x, y: s.y, type: "foe", foe: s.foe }; });
  const STORY_SPOTS = ENCOUNTER_SPOTS.map(function (s) { return s.type === "boss" ? { x: s.x, y: s.y, type: "boss", id: "melody_gate" } : { x: s.x, y: s.y, type: "foe", foe: s.foe }; });
  const LEAF_NPCS = [
    { id: "leaf_guide", name: "Leaf Guide", x: 5, y: 13, color: "#66bb6a", talk: function (st) { return st.powers.leaf ? "Leaf is yours! East is Windy Ridge." : "Clear every leaf foe first. Then Thorn Crown stands on the east gate. Twenty reads — Leaf after you win."; } },
    { id: "bud_pup", name: "Bud Pup", x: 12, y: 9, color: "#a5d6a7", talk: function (st) { return st.powers.leaf ? "You beat Thorn Crown! The hollow is calm." : "All 24 foes, then Thorn Crown on the east gate. Twenty reads."; } },
  ];
  const WIND_NPCS = [
    { id: "wind_guide", name: "Wind Guide", x: 5, y: 13, color: "#80cbc4", talk: function (st) { return st.powers.wind ? "Wind is yours! East is Tide Pools." : "Clear every wind foe first. Then Gale Whisk stands on the east gate. Twenty reads — Wind after you win."; } },
    { id: "gale_pup", name: "Gale Pup", x: 12, y: 9, color: "#b2dfdb", talk: function (st) { return st.powers.wind ? "You beat Gale Whisk! The ridge is still." : "All 24 pairs, then Gale Whisk on the east gate. Two words each. Twenty reads."; } },
  ];
  const TIDE_NPCS = [
    { id: "tide_guide", name: "Tide Guide", x: 5, y: 13, color: "#29b6f6", talk: function (st) { return st.powers.water ? "Water is yours! East is Storm Peak." : "Clear every tide foe first. Then Tide Shell stands on the east gate. Twenty reads — Water after you win."; } },
    { id: "shell_pup", name: "Shell Pup", x: 12, y: 9, color: "#81d4fa", talk: function (st) { return st.powers.water ? "You beat Tide Shell! The pools shine." : "All 24 pairs, then Tide Shell on the east gate. Mix CVC and 4-letter. Twenty reads."; } },
  ];
  const STORM_NPCS = [
    { id: "storm_guide", name: "Storm Guide", x: 5, y: 13, color: "#7e57c2", talk: function (st) { return st.powers.electric ? "Electric is yours! East is Harmony Hill." : "Clear every storm foe first. Then Storm Fang stands on the east gate. Twenty reads — Electric after you win."; } },
    { id: "spark_pup", name: "Spark Pup", x: 12, y: 9, color: "#b39ddb", talk: function (st) { return st.powers.electric ? "You beat Storm Fang! The peak is quiet." : "All 24 trios, then Storm Fang on the east gate. Three words. Twenty reads."; } },
  ];
  const HARMONY_NPCS = [
    { id: "song_guide", name: "Song Guide", x: 5, y: 13, color: "#f6c26b", talk: function (st) { return st.powers.shine ? "Shine is yours! East is Story Gate." : "Clear every song foe first. Then Shine Bell stands on the east gate. Four-word lines. Twenty reads — Shine after you win."; } },
    { id: "bell_pup", name: "Bell Pup", x: 12, y: 9, color: "#ce93d8", talk: function (st) { return st.powers.shine ? "You beat Shine Bell! The hill hums." : "All 20 four-word lines, then Shine Bell on the east gate. Twenty reads."; } },
  ];
  const STORY_NPCS = [
    { id: "tale_guide", name: "Tale Guide", x: 5, y: 13, color: "#5c6bc0", talk: function (st) { return st.wonStory ? "The Story Gate is open. You read the whole path!" : "Clear every tale foe first. Then Melody Gate stands on the east. Five- and six-word lines. Twenty reads."; } },
    { id: "book_pup", name: "Book Pup", x: 12, y: 9, color: "#9fa8da", talk: function (st) { return st.wonStory ? "What a tale!" : "All 20 story lines, then Melody Gate on the east gate. Twenty reads."; } },
  ];
  const COSMETICS = [
    { id: "daisy-bow", world: "meadow", name: "Daisy Bow", frame: 0 },
    { id: "frost-scarf", world: "frost", name: "Frost Scarf", frame: 1 },
    { id: "spark-hat", world: "ember", name: "Spark Hat", frame: 2 },
    { id: "clover-pin", world: "leaf", name: "Clover Pin", frame: 3 },
    { id: "wind-ribbon", world: "wind", name: "Wind Ribbon", frame: 4 },
    { id: "shell-clip", world: "tide", name: "Shell Clip", frame: 5 },
    { id: "bolt-bow", world: "storm", name: "Bolt Bow", frame: 6 },
    { id: "shine-charm", world: "harmony", name: "Shine Charm", frame: 7 },
    { id: "melody-book", world: "story", name: "Melody Book", frame: 8 },
  ];
  const OUTFIT_FRAMES = [
    [17, 213, 62, 85],
    [75, 213, 66, 85],
    [137, 213, 66, 85],
    [199, 213, 64, 85],
    [259, 213, 65, 85],
    [320, 213, 66, 85],
    [383, 213, 69, 85],
    [448, 213, 66, 85],
    [510, 213, 64, 85],
  ];
  const WEAR_BTN_SRC = [575, 208, 177, 98];
  const LADDER_TILE_SRC = {
    /* Ember: seamless dirt + pits only. Never the cave-door crop (that painted leftover W2 chips). */
    ember: { size: 96, src: { 0: [22, 28], 1: [145, 28], 2: [266, 28], 3: [385, 28], 4: [640, 31], 5: [22, 274], 6: [22, 28] } },
    leaf: { size: 96, src: { 0: [16, 16], 1: [1100, 480], 2: [1100, 560], 3: [16, 500], 4: [16, 850], 5: [400, 500], 6: [1000, 80] } },
    wind: { size: 96, src: { 0: [16, 16], 1: [400, 400], 2: [500, 400], 3: [16, 200], 4: [700, 700], 5: [16, 700], 6: [1100, 80] } },
    tide: { size: 96, src: { 0: [16, 16], 1: [200, 16], 2: [1100, 240], 3: [16, 200], 4: [400, 200], 5: [1200, 400], 6: [1100, 80] } },
    storm: { size: 96, src: { 0: [16, 400], 1: [16, 520], 2: [1200, 500], 3: [400, 80], 4: [400, 16], 5: [700, 300], 6: [1100, 80] } },
    harmony: { size: 96, src: { 0: [16, 300], 1: [200, 300], 2: [400, 300], 3: [16, 16], 4: [16, 880], 5: [16, 700], 6: [400, 16] } },
    story: { size: 96, src: { 0: [900, 520], 1: [1050, 520], 2: [900, 640], 3: [200, 700], 4: [16, 800], 5: [700, 80], 6: [1100, 80] } },
  };
  const WORLD_DEFS = {
    meadow: { id: "meadow", num: 1, title: "Sparkelody · World 1 Meadow", hint: "Talk to Elder · clear all Bloops · Star Bloom on the east gate", map: MAP, spots: ENCOUNTER_SPOTS, npcs: NPCS, bank: WORLD1_BANK, skins: FOE_SKINS, prefix: "", next: "frost", prev: null, power: "star", bossId: "star_bloom", bossName: "Star Bloom", nextName: "Frost Path", appClass: "", foeTint: null },
    frost: { id: "frost", num: 2, title: "Sparkelody · World 2 Frost Path", hint: "Frost Path · clear all foes, then Ice Howl on the east gate", map: FROST_MAP, spots: FROST_SPOTS, npcs: FROST_NPCS, bank: WORLD2_BANK, skins: FROST_FOE_SKINS, prefix: "f:", next: "ember", prev: "meadow", power: "ice", bossId: "ice_howl", bossName: "Ice Howl", nextName: "Ember Grove", appClass: "world-frost", foeTint: null },
    ember: { id: "ember", num: 3, title: "Sparkelody · World 3 Ember Grove", hint: "Ember Grove · clear all foes, then Ember Maw on the east gate", map: EMBER_MAP, spots: EMBER_SPOTS, npcs: EMBER_NPCS, bank: WORLD3_BANK, skins: EMBER_FOE_SKINS, prefix: "e:", next: "leaf", prev: "frost", power: "fire", bossId: "ember_maw", bossName: "Ember Maw", nextName: "Leaf Hollow", appClass: "world-ember", foeTint: [220, 90, 40] },
    leaf: { id: "leaf", num: 4, title: "Sparkelody · World 4 Leaf Hollow", hint: "Leaf Hollow · clear all foes, then Thorn Crown on the east gate", map: LEAF_MAP, spots: LEAF_SPOTS, npcs: LEAF_NPCS, bank: WORLD4_BANK, skins: LEAF_FOE_SKINS, prefix: "l:", next: "wind", prev: "ember", power: "leaf", bossId: "thorn_crown", bossName: "Thorn Crown", nextName: "Windy Ridge", appClass: "world-leaf", foeTint: [70, 140, 60] },
    wind: { id: "wind", num: 5, title: "Sparkelody · World 5 Windy Ridge", hint: "Windy Ridge · two words · Gale Whisk on the east gate", map: WIND_MAP, spots: WIND_SPOTS, npcs: WIND_NPCS, bank: WORLD5_BANK, skins: WIND_FOE_SKINS, prefix: "n:", next: "tide", prev: "leaf", power: "wind", bossId: "gale_whisk", bossName: "Gale Whisk", nextName: "Tide Pools", appClass: "world-wind", foeTint: [120, 180, 190] },
    tide: { id: "tide", num: 6, title: "Sparkelody · World 6 Tide Pools", hint: "Tide Pools · mix words · Tide Shell on the east gate", map: TIDE_MAP, spots: TIDE_SPOTS, npcs: TIDE_NPCS, bank: WORLD6_BANK, skins: TIDE_FOE_SKINS, prefix: "t:", next: "storm", prev: "wind", power: "water", bossId: "tide_shell", bossName: "Tide Shell", nextName: "Storm Peak", appClass: "world-tide", foeTint: [40, 120, 170] },
    storm: { id: "storm", num: 7, title: "Sparkelody · World 7 Storm Peak", hint: "Storm Peak · three words · Storm Fang on the east gate", map: STORM_MAP, spots: STORM_SPOTS, npcs: STORM_NPCS, bank: WORLD7_BANK, skins: STORM_FOE_SKINS, prefix: "s:", next: "harmony", prev: "tide", power: "electric", bossId: "storm_fang", bossName: "Storm Fang", nextName: "Harmony Hill", appClass: "world-storm", foeTint: [90, 60, 150] },
    harmony: { id: "harmony", num: 8, title: "Sparkelody · World 8 Harmony Hill", hint: "Harmony Hill · four-word lines · Shine Bell on the east gate", map: HARMONY_MAP, spots: HARMONY_SPOTS, npcs: HARMONY_NPCS, bank: WORLD8_BANK, skins: HARMONY_FOE_SKINS, prefix: "h:", next: "story", prev: "storm", power: "shine", bossId: "shine_bell", bossName: "Shine Bell", nextName: "Story Gate", appClass: "world-harmony", foeTint: [210, 170, 80] },
    story: { id: "story", num: 9, title: "Sparkelody · World 9 Story Gate", hint: "Story Gate · 5-6 word lines · Melody Gate on the east", map: STORY_MAP, spots: STORY_SPOTS, npcs: STORY_NPCS, bank: WORLD9_BANK, skins: STORY_FOE_SKINS, prefix: "y:", next: null, prev: "harmony", power: "melody", bossId: "melody_gate", bossName: "Melody Gate", nextName: null, appClass: "world-story", foeTint: [80, 90, 140] },
  };
  const BOSS_IDS = { star_bloom: 1, ice_howl: 1, ember_maw: 1, thorn_crown: 1, gale_whisk: 1, tide_shell: 1, storm_fang: 1, shine_bell: 1, melody_gate: 1 };

  const el = {
    viewOverworld: document.getElementById("view-overworld"),
    viewFight: document.getElementById("view-fight"),
    canvas: document.getElementById("world"),
    worldHint: document.getElementById("world-hint"),
    dialogue: document.getElementById("dialogue"),
    dialogueName: document.getElementById("dialogue-name"),
    dialogueText: document.getElementById("dialogue-text"),
    btnDialogue: document.getElementById("btn-dialogue"),
    dpad: document.getElementById("dpad"),
    btnInteract: document.getElementById("btn-interact"),
    modeConfirm: document.getElementById("mode-confirm"),
    modeMatch: document.getElementById("mode-match"),
    chipStar: document.getElementById("chip-star"),
    chipLeaf: document.getElementById("chip-leaf"),
    chipWind: document.getElementById("chip-wind"),
    chipIce: document.getElementById("chip-ice"),
    chipFire: document.getElementById("chip-fire"),
    chipWater: document.getElementById("chip-water"),
    chipElectric: document.getElementById("chip-electric"),
    chipShine: document.getElementById("chip-shine"),
    chipMelody: document.getElementById("chip-melody"),
    btnWear: document.getElementById("btn-wear"),
    btnNewgame: document.getElementById("btn-newgame"),
    saveStatus: document.getElementById("save-status"),
    btnContinue: document.getElementById("btn-continue"),
    cvcWord: document.getElementById("cvc-word"),
    cvcWrap: document.getElementById("cvc-wrap"),
    controlsConfirm: document.getElementById("controls-confirm"),
    controlsMatch: document.getElementById("controls-match"),
    btnConfirm: document.getElementById("btn-confirm"),
    choiceA: document.getElementById("choice-a"),
    choiceB: document.getElementById("choice-b"),
    feedback: document.getElementById("feedback"),
    flavor: document.getElementById("flavor"),
    prompt: document.getElementById("prompt"),
    hero: document.getElementById("hero"),
    bloop: document.getElementById("bloop"),
    foeLabel: document.getElementById("foe-label"),
    chest: document.getElementById("chest"),
    fx: document.getElementById("fx"),
    hitPips: document.getElementById("hit-pips"),
    sandglass: document.getElementById("sandglass"),
    sandFill: document.getElementById("sand-fill"),
    powerPicker: document.getElementById("power-picker"),
    powerChoices: document.getElementById("power-choices"),
    readPanel: document.getElementById("read-panel"),
    winOverlay: document.getElementById("win-overlay"),
    winTitle: document.getElementById("win-title"),
    winMsg: document.getElementById("win-msg"),
    btnReplay: document.getElementById("btn-replay"),
    btnFlee: document.getElementById("btn-flee"),
  };

  /* One live canvas. Steal #world back if a leftover IIFE swapped it. Never paint a detached node. */
  let ctx = null;
  function rebindLiveCanvas() {
    var live = document.getElementById("world");
    if (!live) return false;
    el.canvas = live;
    live.dataset.pixelLock = "1";
    live.classList.remove("art-wait");
    ctx = live.getContext("2d");
    return !!ctx;
  }
  (function lockPixelCanvas() {
    const old = el.canvas || document.getElementById("world");
    if (!old) return;
    if (old.dataset.pixelLock === "1") {
      rebindLiveCanvas();
      return;
    }
    const neu = old.cloneNode(false);
    neu.dataset.pixelLock = "1";
    neu.classList.add("art-wait");
    if (old.parentNode) old.parentNode.replaceChild(neu, old);
    el.canvas = neu;
    ctx = neu.getContext("2d");
  })();
  if (!ctx) rebindLiveCanvas();

  /** Hot-swap pixel art — relative assets/ or CDN base via window.MEADOW_ASSET_BASE */
  const ASSET_BASE = (typeof window !== "undefined" && window.MEADOW_ASSET_BASE) || "assets";
  function assetUrl(rel) {
    let key = String(rel).replace(/^\//, "");
    if (key.indexOf("assets/") === 0) key = key.slice(7);
    const embMap =
      typeof window !== "undefined" && window.MEADOW_ASSET_EMBED
        ? window.MEADOW_ASSET_EMBED
        : null;
    const emb = embMap ? (embMap[key] || embMap["assets/" + key]) : null;
    // Require a real data URL — empty string init must NOT win (falsy trap → assets/ 404)
    if (typeof emb === "string" && (emb.indexOf("data:image") === 0 || emb.indexOf("blob:") === 0) && emb.length > 5) {
      return emb;
    }
    const base = ASSET_BASE.replace(/\/$/, "");
    if (/^https?:/i.test(base)) {
      const root = /\/assets$/i.test(base) ? base : base + "/assets";
      return root + "/" + key;
    }
    return base + "/" + key;
  }

  const ART = {
    ready: false,
    locked: false,
    walk: null,
    cast: null,
    foes: null,
    boss: null,
    meadowTiles: null,
    tiles: null,
    icons: null,
    vfx: null,
    panel: null,
    npcs: null,
    iceHowl: null,
    frostTiles: null,
    frostFoes: null,
    emberTiles: null,
    emberFoes: null,
    emberMaw: null,
    vfxIce: null,
    vfxFire: null,
    worldTiles: {},
    worldFoes: {},
    worldBoss: {},
    outfits: null,
    keyed: {},
  };

  // Elder left, Kid right on 384×256 sheet
  const NPC_FRAMES = {
    elder: [0, 0, 192, 256],
    kid: [192, 0, 192, 256],
  };
  function npcFrameOf(npc) {
    const id = (npc && npc.id) || "";
    if (NPC_FRAMES[id]) return NPC_FRAMES[id];
    if (/guide|elder|scout/i.test(id)) return NPC_FRAMES.elder;
    return NPC_FRAMES.kid;
  }

  const WALK_FRAMES = {
    down: [
      [37, 8, 31, 40],
      [81, 8, 35, 41],
      [125, 8, 36, 41],
      [169, 8, 34, 41],
    ],
    up: [
      [37, 57, 30, 41],
      [80, 57, 31, 40],
      [121, 57, 34, 41],
      [169, 57, 34, 41],
    ],
    left: [
      [35, 106, 37, 37],
      [78, 106, 38, 37],
      [122, 105, 38, 38],
      [165, 106, 39, 37],
    ],
    right: [
      [33, 154, 36, 39],
      [76, 154, 38, 39],
      [120, 154, 38, 39],
      [164, 154, 38, 39],
    ],
    strike: [217, 100, 86, 32],
  };

  const FOE_CELLS = {
    bloop: { idle: [0, 0], hit: [0, 1] },
    fluff_lite: { idle: [0, 0], hit: [0, 1] },
  };

  // 32×32 samples from meadow tiles.png (fallback to flat colors if unloadable)
  const TILE_SRC = {
    0: [32, 64],
    1: [192, 64],
    2: [288, 64],
    3: [64, 128],
    4: [320, 64],
    5: [256, 160],
    6: [320, 160],
  };
  // Frost atlas is 768×512 = 2× the Meadow 32px sheet. Sample 64×64 cells.
  const FROST_TILE_SRC = {
    0: [64, 128],
    1: [384, 128],
    2: [576, 128],
    3: [128, 256],
    4: [640, 128],
    5: [512, 320],
    6: [640, 320],
  };

  const CHROMA = {
    walk: { r: 156, g: 196, b: 127, tol: 48 },
    cast: { r: 80, g: 118, b: 90, tol: 42 },
    foes: { r: 141, g: 160, b: 116, tol: 48 },
    boss: { r: 132, g: 158, b: 95, tol: 42 },
    npcs: { r: 156, g: 196, b: 127, tol: 48 },
    sheetGreen: { r: 106, g: 170, b: 90, tol: 52 }, /* #6aaa5a concept-sheet green */
    olive: { r: 138, g: 154, b: 110, tol: 40 },
    vfxMag: { r: 219, g: 24, b: 195, tol: 58 },
  };

  function loadImageDirect(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  async function loadImage(url) {
    if (!url) return null;
    if (String(url).startsWith("data:")) return loadImageDirect(url);
    let img = await loadImageDirect(url);
    if (img) return img;
    try {
      const r = await fetch(url + ".b64", { cache: "force-cache" });
      if (!r.ok) return null;
      const raw = (await r.text()).replace(/\s+/g, "");
      if (!raw) return null;
      return loadImageDirect("data:image/png;base64," + raw);
    } catch (e) {
      return null;
    }
  }

  function keySheet(img, chroma) {
    if (!img || !img.width) return null;
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    let data;
    try {
      data = g.getImageData(0, 0, c.width, c.height);
    } catch (e) {
      return img;
    }
    const d = data.data;
    const tol = chroma.tol || 40;
    const cr = d[0], cg = d[1], cb = d[2], ca = d[3];
    const cornerTol = 36;
    for (let i = 0; i < d.length; i += 4) {
      if (
        Math.abs(d[i] - chroma.r) <= tol &&
        Math.abs(d[i + 1] - chroma.g) <= tol &&
        Math.abs(d[i + 2] - chroma.b) <= tol
      ) {
        d[i + 3] = 0;
        continue;
      }
      if (
        ca > 8 &&
        Math.abs(d[i] - cr) <= cornerTol &&
        Math.abs(d[i + 1] - cg) <= cornerTol &&
        Math.abs(d[i + 2] - cb) <= cornerTol
      ) {
        d[i + 3] = 0;
      }
    }
    g.putImageData(data, 0, 0);
    return c;
  }

  function tintSheet(img, rgb, amount) {
    if (!img || !img.width) return img;
    if (!rgb) return img;
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    let data;
    try { data = g.getImageData(0, 0, c.width, c.height); } catch (e) { return img; }
    const d = data.data;
    const a = amount == null ? 0.42 : amount;
    const ia = 1 - a;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 8) continue;
      d[i] = Math.max(0, Math.min(255, d[i] * ia + rgb[0] * a));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] * ia + rgb[1] * a));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] * ia + rgb[2] * a));
    }
    g.putImageData(data, 0, 0);
    return c;
  }
  function keyChroma(img, rgb, tol) {
    return keySheet(img, { r: rgb[0], g: rgb[1], b: rgb[2], tol: tol || 36 });
  }
  function keyColors(img, chromas, opts) {
    if (!img || !(img.width || img.naturalWidth)) return null;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    let data;
    try { data = g.getImageData(0, 0, c.width, c.height); } catch (eK) { return img; }
    const d = data.data;
    const cr = d[0], cg = d[1], cb = d[2], ca = d[3];
    const cornerTol = (opts && opts.cornerTol) || 40;
    const mag = !!(opts && opts.magenta);
    const list = chromas || [];
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], gv = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (a < 8) continue;
      let hit = false;
      for (let k = 0; k < list.length; k++) {
        const ch = list[k];
        const tol = ch.tol || 40;
        if (Math.abs(r - ch.r) <= tol && Math.abs(gv - ch.g) <= tol && Math.abs(b - ch.b) <= tol) {
          hit = true;
          break;
        }
      }
      if (!hit && ca > 8 && Math.abs(r - cr) <= cornerTol && Math.abs(gv - cg) <= cornerTol && Math.abs(b - cb) <= cornerTol) {
        hit = true;
      }
      if (!hit && mag && r > 140 && b > 110 && gv < 110 && r > gv + 30 && b > gv + 30) {
        hit = true;
      }
      if (hit) d[i + 3] = 0;
    }
    g.putImageData(data, 0, 0);
    return c;
  }
  function keyConceptGreen(img) {
    return keyColors(img, [CHROMA.sheetGreen, CHROMA.olive, CHROMA.foes, CHROMA.boss]) || img;
  }
  function keyMagenta(img) {
    return keyColors(img, [CHROMA.vfxMag, { r: 205, g: 35, b: 183, tol: 48 }], { magenta: true, cornerTol: 48 }) || img;
  }
  function canvasSlice(img, sx, sy, sw, sh) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, sw);
    c.height = Math.max(1, sh);
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    return c;
  }
  function splitVfxCombo(img) {
    if (!img || !(img.width || img.naturalWidth)) return { ice: null, fire: null };
    const keyed = keyMagenta(img);
    const w = keyed.width || keyed.naturalWidth;
    const h = keyed.height || keyed.naturalHeight;
    const hw = Math.max(1, Math.floor(w / 2));
    return {
      ice: cropOpaqueSprite(canvasSlice(keyed, 0, 0, hw, h)),
      fire: cropOpaqueSprite(canvasSlice(keyed, hw, 0, w - hw, h)),
    };
  }
  function packFoeCells(col) {
    if (!col) return null;
    if (col._foeReady) return col;
    const w = col.width || col.naturalWidth || 0;
    const h = col.height || col.naturalHeight || 0;
    if (w < 8 || h < 8) return col;
    const mid = Math.max(1, Math.floor(h / 2));
    const idle = cropOpaqueSprite(canvasSlice(col, 0, 0, w, mid));
    const hit = cropOpaqueSprite(canvasSlice(col, 0, mid, w, h - mid));
    const ow = Math.max(idle.width || 1, hit.width || 1);
    const oh = Math.max(idle.height || 1, hit.height || 1);
    const out = document.createElement("canvas");
    out.width = ow;
    out.height = oh * 2;
    const g = out.getContext("2d");
    g.imageSmoothingEnabled = false;
    /* Bottom-align in each row so feet sit on the tile — no concept padding. */
    g.drawImage(idle, Math.floor((ow - idle.width) / 2), oh - idle.height, idle.width, idle.height);
    g.drawImage(hit, Math.floor((ow - hit.width) / 2), oh * 2 - hit.height, hit.width, hit.height);
    out._foeReady = true;
    out._fluffCrop = true;
    out._bossCrop = true;
    return out;
  }
  function prepareFoeSheet(img) {
    if (!img) return null;
    if (img._foeReady) return img;
    return packFoeCells(cropFluffColumn(keyConceptGreen(img)));
  }
  function prepareBossSheet(img) {
    if (!img) return null;
    return cropOpaqueSprite(keyConceptGreen(img));
  }
  function prepareVfxFrame(img) {
    if (!img) return null;
    return cropOpaqueSprite(keyMagenta(img));
  }
  function keyOutfitSheet(img) {
    /* Olive atlas only. Do not key cream — that erases white daisy petals. */
    return keyChroma(img, [140, 156, 117], 44) || img;
  }
  function cropOpaqueSprite(img) {
    if (!img || img._bossCrop) return img;
    const w = img.naturalWidth || img.width || 0;
    const h = img.naturalHeight || img.height || 0;
    if (w < 8 || h < 8) return img;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    let data;
    try { data = g.getImageData(0, 0, w, h); } catch (eC) { img._bossCrop = true; return img; }
    const d = data.data;
    let minx = w, miny = h, maxx = 0, maxy = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (d[(y * w + x) * 4 + 3] > 12) {
          if (x < minx) minx = x;
          if (y < miny) miny = y;
          if (x > maxx) maxx = x;
          if (y > maxy) maxy = y;
        }
      }
    }
    if (maxx <= minx || maxy <= miny) { img._bossCrop = true; return img; }
    const pad = 6;
    minx = Math.max(0, minx - pad);
    miny = Math.max(0, miny - pad);
    maxx = Math.min(w - 1, maxx + pad);
    maxy = Math.min(h - 1, maxy + pad);
    const cw = maxx - minx + 1;
    const ch = maxy - miny + 1;
    if (cw >= w - 2 && ch >= h - 2 && w * h < 40000) { img._bossCrop = true; return img; }
    const out = document.createElement("canvas");
    out.width = cw;
    out.height = ch;
    const og = out.getContext("2d");
    og.imageSmoothingEnabled = false;
    og.drawImage(c, minx, miny, cw, ch, 0, 0, cw, ch);
    out._bossCrop = true;
    return out;
  }

  /* Pixel-only: keep the RIGHT column of the 2×2 bloop/fluff sheet (fluff idle + hit).
     Never sample the left slime cells on the overworld. */
  function cropFluffColumn(img) {
    if (!img) return null;
    if (img._fluffCrop) return img;
    const w = img.naturalWidth || img.width || 0;
    const h = img.naturalHeight || img.height || 0;
    if (w < 8 || h < 8) return img;
    /* 2×2 sheet is wider than tall (1536×1024). Keep RIGHT fluff column only. */
    if (w <= h) { img._fluffCrop = true; return img; }
    const cw = Math.max(1, Math.floor(w / 2));
    const c = document.createElement("canvas");
    c.width = cw;
    c.height = h;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.drawImage(img, cw, 0, cw, h, 0, 0, cw, h);
    c._fluffCrop = true;
    return c;
  }

  var artLoadInFlight = false;
  var ART_WORLD_IDS = ["ember", "leaf", "wind", "tide", "storm", "harmony", "story"];
  async function preloadArt() {
    if (artLoadInFlight) return;
    artLoadInFlight = true;
    try {
    if (!ART.walk || !ART.foes || !ART.meadowTiles) {
      const bootId = BOOT_WORLD || "meadow";
      const packed = await Promise.all([
        loadImage(assetUrl("sparkelody/walk/sheet.png")),
        loadImage(assetUrl("sparkelody/cast/sheet.png")),
        loadImage(assetUrl("foes/bloop-fluff-sheet.png")),
        loadImage(assetUrl("bosses/star_bloom.png")),
        loadImage(assetUrl("worlds/meadow/tiles.png")),
        loadImage(assetUrl("powers/icons-sheet.png")),
        loadImage(assetUrl("powers/vfx-sheet.png")),
        loadImage(assetUrl("ui/cvc-panel.png")),
        loadImage(assetUrl("npcs/elder-kid-sheet.png")),
        loadImage(assetUrl("bosses/ice_howl.png")),
        loadImage(assetUrl("worlds/frost/tiles.png")),
        loadImage(assetUrl("foes/frost-foes.png")),
        loadImage(assetUrl("outfits/sheet.png")),
        (bootId !== "meadow" && bootId !== "frost") ? loadImage(assetUrl("worlds/" + bootId + "/tiles.png")) : Promise.resolve(null),
        loadImage(assetUrl("foes/ember-foes.png")),
        loadImage(assetUrl("powers/ice/vfx.png")),
        loadImage(assetUrl("powers/fire/vfx.png")),
        loadImage(assetUrl("bosses/ember_maw.png")),
        loadImage(assetUrl("powers/ice-fire-vfx.png")),
      ]);
      const walk = packed[0], cast = packed[1], foes = packed[2], boss = packed[3], tiles = packed[4], icons = packed[5], vfx = packed[6], panel = packed[7], npcs = packed[8], iceHowl = packed[9], frostTiles = packed[10], frostFoes = packed[11], outfitImg = packed[12], bootTiles = packed[13], emberFoesImg = packed[14], iceVfx = packed[15], fireVfx = packed[16], emberMawImg = packed[17], vfxCombo = packed[18];
      ART.walk = walk ? keySheet(walk, CHROMA.walk) || walk : (ART.walk || null);
      ART.cast = cast ? keySheet(cast, CHROMA.cast) || cast : (ART.cast || null);
      ART.foes = foes ? prepareFoeSheet(foes) : (ART.foes || null);
      ART.boss = boss ? prepareBossSheet(boss) : (ART.boss || null);
      ART.meadowTiles = tiles && (tiles.naturalWidth || tiles.width) ? tiles : (ART.meadowTiles || null);
      /* ART.tiles is set per-world below — never park meadow under frost/ember. */
      ART.icons = icons && (icons.naturalWidth || icons.width) ? icons : null;
      ART.vfx = vfx && (vfx.naturalWidth || vfx.width) ? vfx : null;
      ART.panel = panel && (panel.naturalWidth || panel.width) ? panel : null;
      ART.npcs = npcs ? keySheet(npcs, CHROMA.npcs) || npcs : (ART.npcs || null);
      ART.iceHowl = iceHowl ? prepareBossSheet(iceHowl) : null;
      ART.frostTiles = frostTiles && (frostTiles.naturalWidth || frostTiles.width) ? frostTiles : (ART.frostTiles || null);
      ART.frostFoes = frostFoes ? prepareFoeSheet(frostFoes) : (ART.frostFoes || null);
      ART.outfits = outfitImg ? keyOutfitSheet(outfitImg) : (ART.outfits || null);
      ART.emberFoes = emberFoesImg ? prepareFoeSheet(emberFoesImg) : (ART.emberFoes || null);
      ART.vfxIce = iceVfx ? prepareVfxFrame(iceVfx) : (ART.vfxIce || null);
      ART.vfxFire = fireVfx ? prepareVfxFrame(fireVfx) : (ART.vfxFire || null);
      ART.emberMaw = emberMawImg ? prepareBossSheet(emberMawImg) : (ART.emberMaw || null);
      if (vfxCombo && (!ART.vfxIce || !ART.vfxFire)) {
        const split = splitVfxCombo(vfxCombo);
        if (!ART.vfxIce) ART.vfxIce = split.ice;
        if (!ART.vfxFire) ART.vfxFire = split.fire;
      }
      ART.worldTiles = ART.worldTiles || {};
      ART.worldFoes = ART.worldFoes || {};
      ART.worldBoss = ART.worldBoss || {};
      if (bootTiles && (bootTiles.naturalWidth || bootTiles.width)) {
        ART.worldTiles[bootId] = bootTiles;
        if (bootId === "ember") ART.emberTiles = bootTiles;
      }
    }
    syncWorldFromUrl();
    if (BOOT_WORLD === "frost" || BOOT_FROST || wantFrost()) {
      ART.tiles = ART.frostTiles || null;
      ART.ready = !!(ART.walk && ART.frostTiles && ART.frostFoes);
    } else if (laterWorld() || (BOOT_WORLD && BOOT_WORLD !== "meadow" && BOOT_WORLD !== "frost")) {
      ART.tiles = currentTiles();
      ART.ready = !!(ART.walk && currentTiles() && (currentFoeSheet() || ART.foes));
    } else {
      ART.tiles = ART.meadowTiles || null;
      ART.ready = !!(ART.walk && ART.tiles && ART.foes);
    }
    ART.locked = !!ART.ready;
    if (ART.ready) artEverLocked = true;
    if (ART.walk) applyDomArt();
    if (ART.ready) {
      if (state.scene === "overworld") drawWorld();
      showArtLoader(false);
    } else {
      showArtLoader(true);
    }
    if (!ART.ladderLoaded) {
      const worldImgs = await Promise.all(ART_WORLD_IDS.map(function (id) {
        return loadImage(assetUrl("worlds/" + id + "/tiles.png"));
      }));
      ART.worldTiles = ART.worldTiles || {};
      ART_WORLD_IDS.forEach(function (id, i) {
        const im = worldImgs[i];
        ART.worldTiles[id] = im && (im.naturalWidth || im.width) ? im : ART.worldTiles[id] || null;
      });
      ART.emberTiles = ART.worldTiles.ember || ART.emberTiles;
      ART.ladderLoaded = true;
      if (laterWorld() && currentTiles() && state.scene === "overworld") drawWorld();
    }
    } finally {
      artLoadInFlight = false;
    }
  }

  function applyDomArt() {
    // Hero: sheet sprite via CSS background (keyed canvas → data URL if needed)
    if (ART.walk) {
      const url = ART.walk.toDataURL ? ART.walk.toDataURL("image/png") : ART.walk.src;
      el.hero.classList.add("art-sprite");
      el.hero.style.setProperty("--hero-sheet", 'url("' + url + '")');
      setHeroFrame("idle");
    }
    // Skip full CVC UI sheet — it duplicates Confirm/word DOM and stacks panels
    if (ART.panel) {
      el.readPanel.classList.remove("art-panel");
      el.readPanel.style.backgroundImage = "";
    }
    if (ART.icons) {
      const u = ART.icons.src;
      el.chipStar.classList.add("art-chip");
      el.chipLeaf.classList.add("art-chip");
      el.chipWind.classList.add("art-chip");
      el.chipStar.style.backgroundImage = 'url("' + u + '")';
      el.chipLeaf.style.backgroundImage = 'url("' + u + '")';
      el.chipWind.style.backgroundImage = 'url("' + u + '")';
    }
  }

  function setHeroFrame(kind) {
    // kind: idle | strike | cast
    if (!ART.walk) return;
    let fr;
    if (kind === "strike") fr = WALK_FRAMES.strike;
    else if (kind === "cast" && ART.cast) {
      const c = ART.cast;
      el.hero.style.setProperty(
        "--hero-sheet",
        'url("' + (c.toDataURL ? c.toDataURL("image/png") : c.src) + '")'
      );
      if (c.width) {
        el.hero.style.setProperty("--hero-sheet-w", c.width + "px");
        el.hero.style.setProperty("--hero-sheet-h", c.height + "px");
      }
      el.hero.style.setProperty("--hero-sx", "-10px");
      el.hero.style.setProperty("--hero-sy", "-20px");
      el.hero.style.setProperty("--hero-sw", "74px");
      el.hero.style.setProperty("--hero-sh", "64px");
      return;
    } else {
      const face = state.facing === "up" ? "up" : state.facing === "left" ? "left" : state.facing === "right" ? "right" : "down";
      fr = WALK_FRAMES[face][0];
      if (ART.walk.toDataURL) {
        el.hero.style.setProperty("--hero-sheet", 'url("' + ART.walk.toDataURL("image/png") + '")');
      }
    }
    const sheet = kind === "cast" && ART.cast ? ART.cast : ART.walk;
    if (sheet) {
      const sw = sheet.naturalWidth || sheet.width || 256;
      const sh = sheet.naturalHeight || sheet.height || 200;
      el.hero.style.setProperty("--hero-sheet-w", sw + "px");
      el.hero.style.setProperty("--hero-sheet-h", sh + "px");
    }
    el.hero.style.setProperty("--hero-sx", -fr[0] + "px");
    el.hero.style.setProperty("--hero-sy", -fr[1] + "px");
    el.hero.style.setProperty("--hero-sw", fr[2] + "px");
    el.hero.style.setProperty("--hero-sh", fr[3] + "px");
    if (state.wearIndex >= 0) applyWearArt();
  }

  function clearFoeArtBg() {
    el.bloop.style.backgroundImage = "";
    el.bloop.style.backgroundSize = "";
    el.bloop.style.backgroundPosition = "";
    el.bloop.style.backgroundRepeat = "";
  }

  function setFoeArt(artKey, hit) {
    // Only add art-sprite AFTER we have a sheet — otherwise procedural body stays visible
    el.bloop.classList.remove("boss-art");
    if (BOSS_IDS[artKey]) {
      const sheet = currentBossSheet(artKey);
      if (!sheet) {
        el.bloop.classList.add("art-sprite");
        clearFoeArtBg();
        return;
      }
      const url = sheet.toDataURL ? sheet.toDataURL("image/png") : sheet.src;
      el.bloop.classList.add("art-sprite", "boss-art");
      el.bloop.style.backgroundColor = "transparent";
      el.bloop.style.backgroundImage = 'url("' + url + '")';
      el.bloop.style.backgroundSize = "contain";
      el.bloop.style.backgroundRepeat = "no-repeat";
      el.bloop.style.backgroundPosition = "center bottom";
      el.bloop.style.setProperty("width", "144px", "important");
      el.bloop.style.setProperty("height", "96px", "important");
      return;
    }
    const foeSheet = currentFoeSheet();
    if (!foeSheet || !(foeSheet.naturalWidth || foeSheet.width)) {
      el.bloop.classList.add("art-sprite");
      clearFoeArtBg();
      return;
    }
    const cell = FOE_CELLS.fluff_lite;
    const [cx, cy] = hit ? cell.hit : cell.idle;
    const url = foeSheet.toDataURL ? foeSheet.toDataURL("image/png") : foeSheet.src;
    const dispH = 64;
    const dispW = 64;
    el.bloop.classList.add("art-sprite");
    el.bloop.classList.remove("boss-art");
    el.bloop.style.backgroundColor = "transparent";
    el.bloop.style.setProperty("width", dispW + "px", "important");
    el.bloop.style.setProperty("height", dispH + "px", "important");
    el.bloop.style.setProperty("overflow", "hidden", "important");
    el.bloop.style.backgroundImage = 'url("' + url + '")';
    /* Cropped fluff column: 1 col × 2 rows. Never 2×2 (that would show slime). */
    el.bloop.style.backgroundSize = dispW + "px " + dispH * 2 + "px";
    el.bloop.style.backgroundPosition = "0px " + -(cy * dispH) + "px";
    el.bloop.style.backgroundRepeat = "no-repeat";
  }

  function drawSheetFrame(sheet, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (!sheet) return false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, dw, dh);
    return true;
  }


  const SAVE_KEY = "mvb.kid.v1";
  let saveReady = false;
  let saveTimer = 0;
  function visWorldFlag() {
    try {
      var qs = (typeof location !== "undefined" && location.search) || "";
      return /[?&](w2|frost|w3|ember|w4|leaf|w5|wind|w6|tide|w7|storm|w8|harmony|w9|story)=1/i.test(qs);
    } catch (eVis) {
      return false;
    }
  }
  function saveWorldLabel(id) {
    const d = WORLD_DEFS[id] || WORLD_DEFS.meadow;
    const t = String(d.title || id);
    const cut = t.split("·");
    let name = (cut.length > 1 ? cut[cut.length - 1] : t).trim();
    name = name.replace(/^World\s+\d+\s+/i, "");
    return name || "Meadow";
  }
  function paintSaveHud(kind) {
    const status = el.saveStatus || document.getElementById("save-status");
    const cont = el.btnContinue || document.getElementById("btn-continue");
    const has = (function () { try { return !!readSave(); } catch (eH) { return false; } })();
    if (status) {
      if (kind === "empty") status.textContent = "";
      else if (kind === "saved") status.textContent = "Saved";
      else if (kind === "continue") status.textContent = "Continue · " + saveWorldLabel(state.world);
      else if (has) status.textContent = "Saved · " + saveWorldLabel(state.world);
      else status.textContent = "";
      status.classList.toggle("hidden", !status.textContent);
    }
    if (cont) {
      cont.classList.toggle("hidden", !has || visWorldFlag());
      if (has) cont.textContent = "Continue";
    }
  }
  const state = {
    scene: "overworld",
    mode: "confirm",
    px: 16,
    py: 14,
    facing: "up",
    /* Camera must match the hero from frame 0 — never start at 0,0 and snap on the first step. */
    camX: Math.max(0, Math.min(COLS - VIEW_COLS, 16 - Math.floor(VIEW_COLS / 2))),
    camY: Math.max(0, Math.min(ROWS - VIEW_ROWS, 14 - Math.floor(VIEW_ROWS / 2))),
    powers: { star: false, leaf: false, wind: false, ice: false, fire: false, water: false, electric: false, shine: false, melody: false },
    world: BOOT_WORLD || "meadow",
    world2Open: false,
    world3Open: false,
    wonStory: false,
    unlockedWear: {},
    wearIndex: -1,
    cleared: {},
    encounter: null,
    hits: 0,
    hitsNeeded: 1,
    selectedPower: null,
    current: null,
    busy: false,
    won: false,
    recentFoe: [],
    recentBoss: [],
    recentStar: [],
    recentIce: [],
    recentFire: [],
    recentLeaf: [],
    recentWind: [],
    recentWater: [],
    recentElec: [],
    keys: {},
  };
  let talkBlockUntil = 0;
  let artEverLocked = false;
  let stallTimer = 0;
  let stallWordIdx = 0;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function countInWindow(hist, word) {
    let n = 0;
    for (let i = 0; i < hist.length; i++) if (hist[i] === word) n++;
    return n;
  }

  function pushHist(hist, word) {
    hist.push(word);
    while (hist.length > 10) hist.shift();
  }

  /** Pick from pool with ≤2 uses in last 10 of hist. */
  function pickCapped(pool, hist) {
    const ok = pool.filter((w) => countInWindow(hist, w) < 2);
    const use = ok.length ? ok : pool;
    const word = use[Math.floor(Math.random() * use.length)];
    pushHist(hist, word);
    return word;
  }

  function worldDef() {
    return WORLD_DEFS[state.world] || WORLD_DEFS.meadow;
  }
  function laterWorld() {
    return !!(state.world && state.world !== "meadow" && state.world !== "frost");
  }
  function syncWorldFromUrl() {
    if (!BOOT_WORLD || BOOT_WORLD === "meadow") return;
    if (state.world === BOOT_WORLD) return;
    if (state.world === "meadow") state.world = BOOT_WORLD;
  }
  function wantFrost() {
    if (laterWorld() && state.world !== "frost") return false;
    if (BOOT_WORLD === "frost" || BOOT_FROST) return true;
    if (state.world === "frost") return true;
    try {
      if (typeof window !== "undefined" && window.MEADOW_START_FROST) return !laterWorld();
    } catch (e0) {}
    try {
      if (typeof location !== "undefined" && /[?&](w2|frost)=1/.test(location.search) && !laterWorld()) return true;
    } catch (e1) {}
    return false;
  }
  function isFrost() {
    if (laterWorld()) return false;
    return wantFrost();
  }
  function wantEmber() {
    return state.world === "ember";
  }
  function isEmber() {
    return state.world === "ember";
  }
  function currentMap() {
    return worldDef().map;
  }
  function currentSpots() {
    return worldDef().spots;
  }
  function currentNpcs() {
    return worldDef().npcs;
  }
  function currentBank() {
    const b = worldDef().bank;
    if (b && b.length) return b;
    return STRETCH_BANK;
  }
  function currentSkins() {
    return worldDef().skins;
  }
  function spotKey(spot) {
    return worldDef().prefix + spot.x + "," + spot.y;
  }
  function allFoesCleared() {
    return currentSpots()
      .filter((s) => s.type === "foe")
      .every((s) => state.cleared[spotKey(s)]);
  }
  function bossSpot() {
    return currentSpots().find((s) => s.type === "boss") || null;
  }
  function bossCleared() {
    const b = bossSpot();
    return !!(b && state.cleared[spotKey(b)]);
  }
  function bossActive() {
    return allFoesCleared() && !bossCleared();
  }
  function currentTiles() {
    const id = worldDef().id;
    if (id === "frost") return ART.frostTiles || null;
    if (id === "meadow") return ART.meadowTiles || null;
    return (ART.worldTiles && ART.worldTiles[id]) || null;
  }
  function currentFoeSheet() {
    const id = worldDef().id;
    let sheet = null;
    if (id === "meadow") sheet = ART.foes;
    else if (id === "frost") sheet = ART.frostFoes || null;
    else if (id === "ember") {
      if (!ART.emberFoes && ART.frostFoes) ART.emberFoes = tintSheet(ART.frostFoes, [220, 90, 40], 0.55);
      sheet = ART.emberFoes || null;
    } else {
      ART.worldFoes = ART.worldFoes || {};
      if (!ART.worldFoes[id]) {
        const d = WORLD_DEFS[id];
        const base = id === "storm" ? (ART.frostFoes || ART.emberFoes) : (ART.emberFoes || ART.frostFoes);
        ART.worldFoes[id] = d && d.foeTint && base ? tintSheet(base, d.foeTint, 0.4) : base;
      }
      sheet = ART.worldFoes[id] || ART.emberFoes || ART.frostFoes || null;
    }
    if (sheet && !sheet._foeReady && (sheet.width || 0) > (sheet.height || 0)) sheet = prepareFoeSheet(sheet);
    return sheet;
  }
  function currentBossSheet(artKey) {
    if (artKey === "star_bloom") return ART.boss;
    if (artKey === "ice_howl") return ART.iceHowl;
    if (artKey === "ember_maw" && ART.emberMaw) return ART.emberMaw;
    ART.worldBoss = ART.worldBoss || {};
    if (!ART.worldBoss[artKey]) {
      const tints = {
        ember_maw: [220, 90, 40],
        thorn_crown: [70, 140, 60],
        gale_whisk: [120, 180, 190],
        tide_shell: [40, 120, 170],
        storm_fang: [90, 60, 150],
        shine_bell: [210, 170, 80],
        melody_gate: [80, 90, 140],
      };
      const rgb = tints[artKey];
      const bbase = artKey === "thorn_crown" || artKey === "melody_gate" ? (ART.boss || ART.iceHowl) : (ART.iceHowl || ART.boss);
      ART.worldBoss[artKey] = rgb && bbase ? tintSheet(bbase, rgb, 0.48) : bbase;
      if (artKey === "ember_maw") ART.emberMaw = ART.worldBoss[artKey];
    }
    return ART.worldBoss[artKey] || ART.iceHowl || ART.boss;
  }
  function tileAtlas() {
    const id = worldDef().id;
    if (id === "frost") return { size: 64, src: FROST_TILE_SRC };
    if (id === "meadow") return { size: 32, src: TILE_SRC };
    return LADDER_TILE_SRC[id] || LADDER_TILE_SRC.ember;
  }
  function keyedWorldTiles() {
    const id = worldDef().id;
    ART.worldTilesKeyed = ART.worldTilesKeyed || {};
    if (ART.worldTilesKeyed[id]) return ART.worldTilesKeyed[id];
    const sheet = currentTiles();
    if (!sheet) return null;
    /* Pixel concept-sheet beige (not dirt, not pit). */
    ART.worldTilesKeyed[id] = keySheet(sheet, { r: 236, g: 196, b: 143, tol: 48 }) || sheet;
    return ART.worldTilesKeyed[id];
  }
  function distractorFor(word) {
    const bank = currentBank();
    const others = bank.filter((w) => w !== word);
    return others[Math.floor(Math.random() * others.length)] || STRETCH_BANK[0];
  }
  function applyWorldChrome() {
    const d = worldDef();
    const app = document.getElementById("app");
    if (app) {
      app.className = (app.className || "").replace(/\bworld-\w+\b/g, "").replace(/\s+/g, " ").trim();
      if (d.appClass) app.classList.add(d.appClass);
    }
    const title = document.querySelector(".title");
    if (title) title.textContent = d.title;
    if (el.worldHint) el.worldHint.textContent = d.hint;
  }

  function updatePowerHud() {
    el.chipStar.classList.toggle("locked", !state.powers.star);
    el.chipLeaf.classList.toggle("locked", !state.powers.leaf);
    el.chipWind.classList.toggle("locked", !state.powers.wind);
    if (el.chipIce) el.chipIce.classList.toggle("locked", !state.powers.ice);
    if (el.chipFire) el.chipFire.classList.toggle("locked", !state.powers.fire);
    if (el.chipWater) el.chipWater.classList.toggle("locked", !state.powers.water);
    if (el.chipElectric) el.chipElectric.classList.toggle("locked", !state.powers.electric);
    if (el.chipShine) el.chipShine.classList.toggle("locked", !state.powers.shine);
    if (el.chipMelody) el.chipMelody.classList.toggle("locked", !state.powers.melody);
    el.btnWear = document.getElementById("btn-wear") || el.btnWear;
    if (el.btnWear) el.btnWear.classList.toggle("locked", !Object.keys(state.unlockedWear).length);
  }

  function setMode(mode) {
    if (state.busy && state.scene === "fight") return;
    state.mode = mode;
    el.modeConfirm.classList.toggle("active", mode === "confirm");
    el.modeMatch.classList.toggle("active", mode === "match");
    el.modeConfirm.setAttribute("aria-selected", mode === "confirm" ? "true" : "false");
    el.modeMatch.setAttribute("aria-selected", mode === "match" ? "true" : "false");
    el.controlsConfirm.classList.toggle("hidden", mode !== "confirm");
    el.controlsMatch.classList.toggle("hidden", mode !== "match");
    if (state.scene === "fight" && state.current) {
      const phrase = /\s/.test(state.current.word);
      el.prompt.textContent = phrase
        ? (mode === "confirm" ? "Read the line! Parent taps Confirm." : "Read the line! Pick the matching line.")
        : (mode === "confirm" ? "Sound it out! Parent taps Confirm." : "Sound it out! Pick the matching word.");
      renderChoices();
    }
  }

  function setFeedback(text, kind) {
    el.feedback.textContent = text || "";
    el.feedback.className = "feedback" + (kind ? " " + kind : "");
  }

  function setFlavor(text) {
    el.flavor.textContent = text || "";
  }

  function setControlsEnabled(on) {
    el.btnConfirm.disabled = !on;
    el.choiceA.disabled = !on;
    el.choiceB.disabled = !on;
  }

  function showScene(name) {
    state.scene = name;
    el.viewOverworld.classList.toggle("hidden", name !== "overworld");
    el.viewFight.classList.toggle("hidden", name !== "fight");
    if (name === "overworld") {
      rebindLiveCanvas();
      updateCamera();
      if (ART.walk && currentTiles() && (currentFoeSheet() || ART.foes)) {
        ART.locked = true;
        drawWorld();
      }
    }
  }

  function updateCamera() {
    state.camX = Math.max(0, Math.min(COLS - VIEW_COLS, state.px - Math.floor(VIEW_COLS / 2)));
    state.camY = Math.max(0, Math.min(ROWS - VIEW_ROWS, state.py - Math.floor(VIEW_ROWS / 2)));
  }
  function placeHero(x, y, facing) {
    state.px = x;
    state.py = y;
    if (facing) state.facing = facing;
    updateCamera();
  }
  function clampTile(v, maxEx) {
    v = Math.round(Number(v));
    if (!isFinite(v)) return 0;
    return Math.max(0, Math.min(maxEx - 1, v));
  }
  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || s.v !== 1 || !s.world || !WORLD_DEFS[s.world]) return null;
      return s;
    } catch (eR) {
      return null;
    }
  }
  function writeSave() {
    if (!saveReady) return;
    if (visWorldFlag()) return;
    try {
      const payload = {
        v: 1,
        world: state.world,
        px: state.px,
        py: state.py,
        facing: state.facing,
        camX: state.camX,
        camY: state.camY,
        cleared: state.cleared,
        powers: state.powers,
        unlockedWear: state.unlockedWear,
        wearIndex: state.wearIndex,
        world2Open: state.world2Open,
        world3Open: state.world3Open,
        wonStory: state.wonStory,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
      paintSaveHud("saved");
    } catch (eW) {}
  }
  function scheduleSave() {
    if (!saveReady) return;
    if (visWorldFlag()) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(writeSave, 50);
  }
  function applySave(s) {
    state.world = s.world;
    state.px = clampTile(s.px, COLS);
    state.py = clampTile(s.py, ROWS);
    state.facing = s.facing === "left" || s.facing === "right" || s.facing === "down" || s.facing === "up" ? s.facing : "up";
    state.cleared = s.cleared && typeof s.cleared === "object" ? s.cleared : {};
    if (s.powers && typeof s.powers === "object") {
      Object.keys(state.powers).forEach(function (k) {
        if (s.powers[k]) state.powers[k] = true;
      });
    }
    state.unlockedWear = s.unlockedWear && typeof s.unlockedWear === "object" ? s.unlockedWear : {};
    state.wearIndex = typeof s.wearIndex === "number" ? s.wearIndex : -1;
    state.world2Open = !!s.world2Open;
    state.world3Open = !!s.world3Open;
    state.wonStory = !!s.wonStory;
    updateCamera();
  }
  function continueFromSave() {
    const s = readSave();
    if (!s) return;
    applySave(s);
    applyWorldChrome();
    updatePowerHud();
    applyWearArt();
    updateCamera();
    paintSaveHud("continue");
    if (!currentTiles()) {
      showArtLoader(true);
      preloadArt();
    } else if (state.scene === "overworld") {
      drawWorld();
    }
  }
  function confirmNewGame() {
    var ok = false;
    try {
      ok = window.confirm("Start over?\nYour stars and looks go away.");
    } catch (eC) {
      ok = true;
    }
    if (!ok) return;
    saveReady = false;
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (eRm) {}
    try {
      location.replace(location.pathname || "/");
    } catch (eGo) {
      location.href = "/";
    }
  }

  function showArtLoader(on) {
    let n = document.getElementById("art-loader");
    const wrap = el.viewOverworld && el.viewOverworld.querySelector(".world-wrap");
    if (on) {
      if (!n && wrap) {
        n = document.createElement("div");
        n.id = "art-loader";
        wrap.appendChild(n);
      }
      if (n) {
        n.textContent = "Loading " + (worldDef().title.replace("Sparkelody · ", "")) + "…";
        if (wantEmber()) {
          n.style.background = "#bf360c";
          n.style.color = "#fff3e0";
        } else if (wantFrost()) {
          n.style.background = "#90caf9";
          n.style.color = "#0d47a1";
        }
        n.classList.remove("hidden");
        n.style.display = "flex";
      }
      if (el.canvas) el.canvas.classList.add("art-wait");
    } else {
      if (n) {
        n.classList.add("hidden");
        n.style.display = "none";
      }
      if (el.canvas) el.canvas.classList.remove("art-wait");
    }
  }

  function drawWorld() {
    if (!rebindLiveCanvas() || !ctx) return;
    updateCamera();
    syncWorldFromUrl();
    updateCamera();
    const w = VIEW_COLS * TILE;
    const h = VIEW_ROWS * TILE;
    const tilesheetReady = currentTiles();
    const foeReady = currentFoeSheet() || ART.foes;
    const sheetsOk = !!(ART.walk && tilesheetReady && foeReady);
    if (sheetsOk) { ART.locked = true; artEverLocked = true; }
    if (el.canvas.width !== w || el.canvas.height !== h) {
      el.canvas.width = w;
      el.canvas.height = h;
    } else {
      ctx.clearRect(0, 0, w, h);
    }
    if (!sheetsOk) {
      /* One path: Pixel sheets for THIS world, or loader. Never meadow/slime fallback. */
      showArtLoader(true);
      return;
    }
    showArtLoader(false);

    function blitCell(vx, vy, fencePass) {
      const x = vx + state.camX;
      const y = vy + state.camY;
      const t = currentMap()[y] && currentMap()[y][x];
      const isFence = t === T.TALL;
      if (fencePass ? !isFence : isFence) return;
      const sx = vx * TILE;
      const sy = vy * TILE;
      let usedTile = false;
      let tilesheet = currentTiles();
      if (wantFrost()) tilesheet = ART.frostTiles || null;
      const atlas = tileAtlas();
      const srcMap = atlas.src;
      const srcSize = atlas.size;
      const frostSheetOk = !!(tilesheet && (tilesheet.naturalWidth || tilesheet.width) && srcMap[t] != null);
      if (frostSheetOk) {
        const src = srcMap[t];
        ctx.imageSmoothingEnabled = false;
        if (laterWorld()) {
          /* Concept sheets sit on beige. Lay dirt first, then keyed overlay. GATE stays dirt. */
          const dirt = srcMap[0] || src;
          ctx.drawImage(tilesheet, dirt[0], dirt[1], srcSize, srcSize, sx, sy, TILE, TILE);
          if (t !== T.GRASS && t !== T.GATE) {
            const keyed = keyedWorldTiles() || tilesheet;
            ctx.drawImage(keyed, src[0], src[1], srcSize, srcSize, sx, sy, TILE, TILE);
          }
        } else {
          ctx.drawImage(tilesheet, src[0], src[1], srcSize, srcSize, sx, sy, TILE, TILE);
        }
        usedTile = true;
      }
      /* no procedural tiles, no meadow substitute on frost/ember/w4-w9 */
      /* no W2/W1/lock fillText on the playfield */
      if (t === T.GATE && !usedTile) {
        let open = state.world2Open;
        if (isEmber()) open = x <= 1 || state.powers.fire;
        else if (isFrost()) open = x <= 1 || state.powers.ice;
        ctx.fillStyle = open ? "#bbdefb" : "#546e7a";
        ctx.fillRect(sx + 6, sy + 4, TILE - 12, TILE - 8);
      }
    }
    /* Draw order: ground tiles, then fences, then foes/npcs/hero on top. */
    for (let vy = 0; vy < VIEW_ROWS; vy++) {
      for (let vx = 0; vx < VIEW_COLS; vx++) blitCell(vx, vy, false);
    }
    for (let vy = 0; vy < VIEW_ROWS; vy++) {
      for (let vx = 0; vx < VIEW_COLS; vx++) blitCell(vx, vy, true);
    }

    currentSpots().forEach((spot) => {
      const key = spotKey(spot);
      if (state.cleared[key]) return;
      if (spot.type === "boss" && !allFoesCleared()) return;
      const vx = spot.x - state.camX;
      const vy = spot.y - state.camY;
      if (vx < 0 || vy < 0 || vx >= VIEW_COLS || vy >= VIEW_ROWS) return;
      const cx = vx * TILE + TILE / 2;
      const cy = vy * TILE + TILE / 2;
      const bossSheet = currentBossSheet(spot.id || worldDef().bossId);
      if (spot.type === "boss" && bossSheet) {
        /* 1.5× foe TILE. Never 8px / pit-sized / regular-foe 32. */
        const bh = 48;
        const aspect = (bossSheet.width || 1) / (bossSheet.height || 1);
        const bw = Math.max(48, Math.min(64, Math.round(bh * aspect)));
        drawSheetFrame(bossSheet, 0, 0, bossSheet.width, bossSheet.height, cx - bw / 2, cy + TILE / 2 - bh - 2, bw, bh);
      } else if (spot.type === "foe" && currentFoeSheet()) {
        const fs = currentFoeSheet();
        /* Cropped fluff column: full width × top half = idle fluff. Never slime. */
        const fw = fs.width;
        const fh = Math.max(1, Math.floor(fs.height / 2));
        const dh = TILE;
        const dw = TILE;
        drawSheetFrame(fs, 0, 0, fw, fh, cx - dw / 2, cy + TILE / 2 - dh, dw, dh);
      }
    });

    currentNpcs().forEach((npc) => {
      const vx = npc.x - state.camX;
      const vy = npc.y - state.camY;
      if (vx < -1 || vy < -1 || vx >= VIEW_COLS || vy >= VIEW_ROWS) return;
      const nx = vx * TILE + 2;
      const ny = vy * TILE;
      const fr = npcFrameOf(npc);
      if (ART.npcs && fr) {
        const dw = 28;
        const dh = 36;
        drawSheetFrame(ART.npcs, fr[0], fr[1], fr[2], fr[3], nx + (TILE - dw) / 2, ny + (TILE - dh) / 2 - 4, dw, dh);
      }
      /* no Pip/Guide/Pup name labels on the playfield */
    });

    drawSparkelody((state.px - state.camX) * TILE, (state.py - state.camY) * TILE);
  }

  function drawSparkelody(px, py) {
    const dw = 28;
    const dh = 30;
    const dx = px + (TILE - dw) / 2;
    const dy = py + (TILE - dh) / 2 - 2;
    const face =
      state.facing === "up"
        ? "up"
        : state.facing === "down"
          ? "down"
          : state.facing === "left"
            ? "left"
            : "right";
    if (ART.walk) {
      const fr = WALK_FRAMES[face][0];
      drawSheetFrame(ART.walk, fr[0], fr[1], fr[2], fr[3], dx, dy, dw, dh);
    }
    if (state.wearIndex >= 0 && ART.outfits) {
      const of = OUTFIT_FRAMES[state.wearIndex];
      if (of) {
        const padX = 18;
        const padY = 22;
        const sx = of[0] + padX;
        const sy = of[1] + padY;
        const sw = Math.max(8, of[2] - padX * 2);
        const sh = Math.max(8, of[3] - padY * 2);
        const aw = 22;
        const ah = 20;
        drawSheetFrame(ART.outfits, sx, sy, sw, sh, dx + (dw - aw) / 2, dy - 8, aw, ah);
      }
    }
  }

  function walkable(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    const t = currentMap()[y][x];
    // Frost 4 = ice (walkable). Meadow 4 = water (blocked).
    if (t === T.WATER && worldDef().id === "meadow") return false;
    if (t === T.GATE) {
      const d = worldDef();
      if (d.id === "meadow") {
        if (!state.world2Open) return false;
      } else if (x <= 1) {
        return true;
      } else {
        return !!state.powers[d.power];
      }
    }
    return true;
  }

  function npcAt(x, y) {
    return currentNpcs().find((n) => n.x === x && n.y === y) || null;
  }

  function spotAt(x, y) {
    return currentSpots().find((s) => s.x === x && s.y === y) || null;
  }

  function tryMove(dx, dy) {
    talkBlockUntil = Date.now() + 1000;
    if (state.scene !== "overworld") return;
    if (!el.dialogue.classList.contains("hidden")) return;

    if (dy < 0) state.facing = "up";
    else if (dy > 0) state.facing = "down";
    else if (dx < 0) state.facing = "left";
    else if (dx > 0) state.facing = "right";

    const nx = state.px + dx;
    const ny = state.py + dy;

    const bumped = npcAt(nx, ny);
    if (bumped) {
      // Talk only on a cardinal bump (never from 2 tiles away, never diagonal).
      if (Math.abs(state.px - bumped.x) + Math.abs(state.py - bumped.y) === 1) {
        openDialogue(bumped, "bump");
      }
      return;
    }

    if (nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && currentMap()[ny][nx] === T.GATE) {
      handleGate(nx, ny);
      return;
    }

    if (!walkable(nx, ny)) return;
    placeHero(nx, ny);
    scheduleSave();
    drawWorld();

    const spot = spotAt(nx, ny);
    if (spot) {
      const key = spotKey(spot);
      if (spot.type === "boss" && !allFoesCleared()) return;
      if (!state.cleared[key]) startEncounter(spot);
    }
  }

  function enterFrost(opts) {
    state.world = "frost";
    const spawn = opts && opts.spawn;
    if (spawn === "east") placeHero(17, 2, "left");
    else placeHero(2, 14, "up");
    applyWorldChrome();
    closeDialogueQuiet();
    scheduleSave();
    const silent = !!(opts && opts.silent);
    if (silent) {
      if (ART.frostTiles && state.scene === "overworld") drawWorld();
      return;
    }
    if (ART.frostTiles) drawWorld();
    else {
      showArtLoader(true);
      preloadArt();
    }
  }
  function enterMeadow() {
    state.world = "meadow";
    placeHero(17, 2, "left");
    applyWorldChrome();
    closeDialogueQuiet();
    scheduleSave();
    drawWorld();
  }
  function closeDialogueQuiet() {
    if (!el.dialogue) return;
    el.dialogue.classList.add("hidden");
    el.dpad.classList.remove("hidden");
  }
  function handleGate(nx, ny) {
    if (laterWorld() && !isEmber()) {
      handleLadderGate(nx, ny);
      return;
    }
    if (isEmber()) {
      handleEmberGate(nx, ny);
      return;
    }
    if (!isFrost()) {
      const b = bossSpot();
      if (b && !state.cleared[spotKey(b)]) {
        if (!allFoesCleared()) {
          el.worldHint.textContent = "Clear every Bloop first — then Star Bloom appears on this gate.";
          return;
        }
        startEncounter(b);
        return;
      }
      if (!state.world2Open) {
        el.worldHint.textContent = "Frost Path locked — beat Star Bloom for Star first!";
        return;
      }
      enterFrost();
      return;
    }
    if (nx <= 1) {
      enterMeadow();
      return;
    }
    const b = bossSpot();
    if (b && !state.cleared[spotKey(b)]) {
      if (!allFoesCleared()) {
        el.worldHint.textContent = "Clear every frost foe first — then Ice Howl appears on this gate.";
        return;
      }
      startEncounter(b);
      return;
    }
    if (!state.powers.ice) {
      el.worldHint.textContent = "World 3 locked — beat Ice Howl for Ice first!";
      return;
    }
    if (window.MEADOW_W3_STUB && state.powers.ice) {
      enterEmber();
      return;
    }
    openW3Message();
  }
  function enterEmber(opts) {
    if (!window.MEADOW_W3_STUB) {
      openW3Message();
      return;
    }
    if (!state.powers.ice) {
      el.worldHint.textContent = "World 3 locked — beat Ice Howl for Ice first!";
      return;
    }
    state.world = "ember";
    placeHero(2, 14, "up");
    const app = document.getElementById("app");
    if (app) {
      app.classList.remove("world-frost");
      app.classList.add("world-ember");
    }
    const title = document.querySelector(".title");
    if (title) title.textContent = "Sparkelody · World 3 Ember Grove";
    if (el.worldHint) el.worldHint.textContent = "Ember Grove · clear all foes, then Ember Maw on the east gate";
    applyWorldChrome();
    closeDialogueQuiet();
    scheduleSave();
    const silent = !!(opts && opts.silent);
    if (silent) {
      if (currentTiles() && state.scene === "overworld") drawWorld();
      return;
    }
    if (currentTiles()) {
      showArtLoader(false);
      drawWorld();
    } else {
      showArtLoader(true);
      preloadArt();
    }
  }
  function handleEmberGate(nx, ny) {
    if (nx <= 1) {
      enterFrost({ spawn: "east" });
      return;
    }
    const b = bossSpot();
    if (b && !state.cleared[spotKey(b)]) {
      if (!allFoesCleared()) {
        el.worldHint.textContent = "Clear every ember foe first — then Ember Maw appears on this gate.";
        return;
      }
      startEncounter(b);
      return;
    }
    if (!state.powers.fire) {
      el.worldHint.textContent = "World 4 locked — beat Ember Maw for Fire first!";
      return;
    }
    enterWorld("leaf", { spawn: "west" });
  }
  function enterWorld(id, opts) {
    const d = WORLD_DEFS[id];
    if (!d) return;
    state.world = id;
    const spawn = opts && opts.spawn;
    if (spawn === "east") placeHero(17, 2, "left");
    else placeHero(2, 14, "up");
    applyWorldChrome();
    closeDialogueQuiet();
    scheduleSave();
    const silent = !!(opts && opts.silent);
    if (silent) {
      if (currentTiles() && state.scene === "overworld") drawWorld();
      else if (!currentTiles()) {
        showArtLoader(true);
        preloadArt();
      }
      return;
    }
    if (currentTiles()) {
      showArtLoader(false);
      drawWorld();
    } else {
      showArtLoader(true);
      preloadArt();
    }
  }
  function handleLadderGate(nx, ny) {
    const d = worldDef();
    if (nx <= 1) {
      if (d.prev === "frost") enterFrost({ spawn: "east" });
      else if (d.prev === "meadow") enterMeadow();
      else if (d.prev) enterWorld(d.prev, { spawn: "east" });
      return;
    }
    const b = bossSpot();
    if (b && !state.cleared[spotKey(b)]) {
      if (!allFoesCleared()) {
        el.worldHint.textContent = "Clear every foe first — then " + d.bossName + " appears on this gate.";
        return;
      }
      startEncounter(b);
      return;
    }
    if (d.power && !state.powers[d.power]) {
      el.worldHint.textContent = (d.nextName || "Next") + " locked — beat " + d.bossName + " first!";
      return;
    }
    if (!d.next) {
      el.dialogueName.textContent = "Story Gate";
      el.dialogueText.textContent = "You read the whole path! What a tale.";
      el.dialogue.classList.remove("hidden");
      el.dpad.classList.add("hidden");
      drawWorld();
      return;
    }
    enterWorld(d.next, { spawn: "west" });
  }
  function unlockWearForWorld(wid) {
    const c = COSMETICS.filter(function (x) { return x.world === wid; })[0];
    if (!c) return;
    state.unlockedWear[c.id] = true;
    if (state.wearIndex < 0) state.wearIndex = c.frame;
    applyWearArt();
    updatePowerHud();
    scheduleSave();
  }
  function cycleWear() {
    const unlocked = COSMETICS.filter(function (c) { return state.unlockedWear[c.id]; });
    if (!unlocked.length) {
      if (el.worldHint) el.worldHint.textContent = "Clear a Bloop to unlock a look!";
      return;
    }
    const frames = unlocked.map(function (c) { return c.frame; });
    let i = frames.indexOf(state.wearIndex);
    i = (i + 1) % frames.length;
    state.wearIndex = frames[i];
    applyWearArt();
    scheduleSave();
    if (state.scene === "overworld") drawWorld();
  }
  function applyWearArt() {
    if (!el.hero || state.wearIndex < 0) return;
    /* Fight keeps the walk sprite. Closet look is painted on the overworld cat, not a floating hat plate. */
    el.hero.classList.add("art-sprite", "wear-look");
  }
  function openW3Message() {
    el.dialogueName.textContent = "World 3";
    el.dialogueText.textContent = "World 3 coming soon";
    el.dialogue.classList.remove("hidden");
    el.dpad.classList.add("hidden");
    el.worldHint.textContent = "World 3 gate — coming soon.";
    drawWorld();
  }
  function openW4Message() {
    el.dialogueName.textContent = "World 4";
    el.dialogueText.textContent = "World 4 coming soon";
    el.dialogue.classList.remove("hidden");
    el.dpad.classList.add("hidden");
    el.worldHint.textContent = "World 4 gate — coming soon.";
    drawWorld();
  }
  function openGateMessage() {
    handleGate(state.px, state.py);
  }

  function facingTile() {
    let x = state.px, y = state.py;
    if (state.facing === "up") y -= 1;
    else if (state.facing === "down") y += 1;
    else if (state.facing === "left") x -= 1;
    else if (state.facing === "right") x += 1;
    return { x, y };
  }

  function interact(e) {
    if (e && e.target && e.target.id !== "btn-interact") return;
    if (Date.now() < talkBlockUntil) return;
    if (state.scene !== "overworld") return;
    if (!el.dialogue.classList.contains("hidden")) {
      closeDialogue();
      return;
    }
    const f = facingTile();
    if (f.x >= 0 && f.y >= 0 && f.x < COLS && f.y < ROWS && currentMap()[f.y][f.x] === T.GATE) {
      handleGate(f.x, f.y);
      return;
    }
    const npc = npcAt(f.x, f.y);
    // Interact talks only if that facing tile is cardinal-adjacent. D-pad dirs never call this.
    if (npc && Math.abs(state.px - npc.x) + Math.abs(state.py - npc.y) === 1) openDialogue(npc, "talk");
  }

  function openDialogue(npc, why) {
    if (why !== "bump" && why !== "talk") return;
    if (!npc) return;
    if (Math.abs(state.px - npc.x) + Math.abs(state.py - npc.y) !== 1) return;
    const text = npc.talk(state);
    el.dialogueName.textContent = npc.name;
    el.dialogueText.textContent = text;
    el.dialogue.classList.remove("hidden");
    el.dpad.classList.add("hidden");
    drawWorld();
  }

  function closeDialogue() {
    el.dialogue.classList.add("hidden");
    el.dpad.classList.remove("hidden");
    el.worldHint.textContent = worldDef().hint;
    drawWorld();
  }

  function makeEncounterDef(spot) {
    if (spot.type === "boss") {
      const d = worldDef();
      const id = spot.id || d.bossId;
      return {
        id: id,
        artKey: id,
        name: d.bossName,
        hits: 20,
        bank: "boss",
        chest: true,
        isBoss: true,
      };
    }
    const skins = currentSkins();
    const skin = skins[spot.foe] || skins[0];
    const hits = skin.artKey === "fluff_lite" ? 2 : 1;
    return {
      id: "foe_" + spot.foe,
      artKey: skin.artKey,
      name: skin.name,
      hits: hits,
      bank: "foe",
      chest: false,
      isBoss: false,
    };
  }

  function startEncounter(spot) {
    if (!ART.locked) return;
    const enc = makeEncounterDef(spot);
    state.encounter = { spot: spot, def: enc };
    state.hits = 0;
    state.hitsNeeded = enc.hits;
    state.selectedPower = null;
    state.current = null;
    state.busy = false;
    state.won = false;

    el.bloop.className = "bloop art-sprite " + (enc.artKey || "");
    el.bloop.classList.remove("gone", "hit", "wiggle", "boss-art");
    el.bloop.style.backgroundImage = "";
    el.bloop.style.backgroundSize = "";
    el.bloop.style.backgroundPosition = "";
    setFoeArt(enc.artKey, false);
    setHeroFrame(enc.isBoss ? "idle" : state.powers.star ? "idle" : "idle");
    el.foeLabel.textContent = enc.name;
    el.chest.classList.toggle("hidden", !enc.chest);
    el.chest.classList.remove("open");
    el.winOverlay.classList.add("hidden");
    el.fx.innerHTML = "";
    el.fx.classList.remove("flash");
    el.sandglass.classList.add("hidden");
    buildPips(enc.hits);
    setFeedback("");
    setFlavor(enc.name + " appears!");

    showScene("fight");

    // Before Star: basic read-to-hit (no power picker). After Star: optional Star picker.
    if (!enc.isBoss && hasAnyPower()) {
      showPowerPicker();
    } else {
      state.selectedPower = null;
      el.powerPicker.classList.add("hidden");
      el.readPanel.classList.remove("hidden");
      nextWord();
    }
  }

  function buildPips(n) {
    el.hitPips.innerHTML = "";
    // Cap visual density for 20 pips
    const cls = n >= 12 ? "pip tiny" : "pip";
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = cls;
      s.dataset.hit = String(i);
      el.hitPips.appendChild(s);
    }
  }

  function updatePips() {
    el.hitPips.querySelectorAll(".pip").forEach((pip, i) => {
      pip.classList.toggle("filled", i < state.hits);
    });
  }

  function hasAnyPower() {
    const p = state.powers;
    return !!(p.star || p.ice || p.fire || p.leaf || p.wind || p.water || p.electric || p.shine || p.melody);
  }

  function showPowerPicker() {
    el.powerChoices.innerHTML = "";
    const catalog = [
      ["star", "star", "Star"],
      ["ice", "ice", "Ice"],
      ["fire", "fire", "Fire"],
      ["leaf", "leaf", "Leaf"],
      ["wind", "wind", "Wind"],
      ["water", "water", "Water"],
      ["electric", "electric", "Electric"],
      ["shine", "shine", "Shine"],
      ["melody", "melody", "Melody"],
    ];
    catalog.forEach(function (row) {
      const id = row[0];
      if (!state.powers[id]) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "power-pick-btn " + row[1];
      btn.textContent = row[2];
      btn.addEventListener("click", function () { pickPower(id); });
      el.powerChoices.appendChild(btn);
    });
    const basic = document.createElement("button");
    basic.type = "button";
    basic.className = "power-pick-btn basic";
    basic.textContent = "Read";
    basic.addEventListener("click", () => pickPower(null));
    el.powerChoices.appendChild(basic);

    el.powerPicker.classList.remove("hidden");
    el.readPanel.classList.add("hidden");
    el.prompt.textContent = "Pick a power or basic read";
  }

  function pickPower(id) {
    state.selectedPower = id;
    el.powerPicker.classList.add("hidden");
    el.readPanel.classList.remove("hidden");
    nextWord();
  }

  function pickWordEntry() {
    const enc = state.encounter.def;
    let word;
    if (worldDef().num >= 4) {
      word = pickCapped(currentBank(), enc.isBoss ? state.recentBoss : state.recentFoe);
    } else if (state.selectedPower === "star") {
      word = pickCapped(STAR_CASTS, state.recentStar);
    } else if (state.selectedPower === "ice") {
      word = pickCapped(ICE_CASTS, state.recentIce);
    } else if (state.selectedPower === "fire") {
      word = pickCapped(FIRE_CASTS, state.recentFire);
    } else if (state.selectedPower === "leaf") {
      word = pickCapped(LEAF_CASTS, state.recentLeaf);
    } else if (state.selectedPower === "wind") {
      word = pickCapped(WIND_CASTS, state.recentWind);
    } else if (state.selectedPower === "water") {
      word = pickCapped(WATER_CASTS, state.recentWater);
    } else if (state.selectedPower === "electric") {
      word = pickCapped(ELEC_CASTS, state.recentElec);
    } else if (state.selectedPower === "shine") {
      word = pickCapped(SHINE_CASTS, state.recentStar);
    } else if (state.selectedPower === "melody") {
      word = pickCapped(MELODY_CASTS, state.recentStar);
    } else if (enc.isBoss) {
      word = pickCapped(currentBank(), state.recentBoss);
    } else {
      word = pickCapped(currentBank(), state.recentFoe);
    }
    return { word: word, distractor: distractorFor(word) };
  }

  function nextWord() {
    state.current = pickWordEntry();
    showCurrentWord();
    setMode(state.mode);
    setControlsEnabled(true);
    setFeedback("");
    const enc = state.encounter.def;
    if (enc.isBoss) {
      setFlavor(enc.name + " — read " + (state.hits + 1) + "/" + state.hitsNeeded + "!");
    } else if (state.selectedPower === "star") {
      setFlavor("Star cast — sound it out!");
    } else if (state.selectedPower === "ice") {
      setFlavor("Ice cast — sound it out!");
    } else if (state.selectedPower === "fire") {
      setFlavor("Fire cast — sound it out!");
    } else if (/\s/.test(state.current.word)) {
      setFlavor("Read the whole line!");
    } else {
      setFlavor("Your turn — read to hit!");
    }
  }

  function clearStall() {
    if (stallTimer) {
      clearTimeout(stallTimer);
      stallTimer = 0;
    }
  }
  function paintPhrase(hi) {
    if (!state.current) return;
    const raw = state.current.word;
    const words = raw.split(/\s+/);
    if (words.length < 2) {
      el.cvcWord.textContent = raw.toUpperCase();
      return;
    }
    el.cvcWord.innerHTML = words.map(function (w, i) {
      const cls = i === hi ? ' class="stall-hi"' : "";
      return "<span" + cls + ">" + w.toUpperCase() + "</span>";
    }).join(" ");
  }
  function armStall() {
    clearStall();
    if (!state.current || !/\s/.test(state.current.word)) return;
    stallWordIdx = 0;
    stallTimer = setTimeout(function tick() {
      if (!state.current || state.busy || state.won || state.scene !== "fight") return;
      paintPhrase(stallWordIdx);
      const n = state.current.word.split(/\s+/).length;
      stallWordIdx = (stallWordIdx + 1) % n;
      stallTimer = setTimeout(tick, 850);
    }, 3200);
  }
  function showCurrentWord() {
    if (!state.current) return;
    const phrase = /\s/.test(state.current.word);
    el.cvcWord.classList.toggle("phrase", phrase);
    el.cvcWord.classList.remove("pop");
    el.cvcWrap.classList.remove("miss-shake");
    paintPhrase(-1);
    if (el.prompt) el.prompt.textContent = phrase ? "Read the line! Parent taps Confirm." : "Sound it out!";
    if (el.btnConfirm) el.btnConfirm.textContent = phrase ? "Confirm the line ✓" : "Confirm ✓";
    armStall();
    renderChoices();
  }

  function renderChoices() {
    if (state.mode !== "match" || !state.current) return;
    const target = state.current.word.toUpperCase();
    const distractor = state.current.distractor.toUpperCase();
    const leftFirst = Math.random() < 0.5;
    el.choiceA.textContent = leftFirst ? target : distractor;
    el.choiceB.textContent = leftFirst ? distractor : target;
    el.choiceA.dataset.word = (leftFirst ? target : distractor).toLowerCase();
    el.choiceB.dataset.word = (leftFirst ? distractor : target).toLowerCase();
  }

  async function onSuccess() {
    if (state.busy || state.won) return;
    state.busy = true;
    clearStall();
    setControlsEnabled(false);

    const pow = state.selectedPower;
    const usingStar = pow === "star";
    const usingIce = pow === "ice";
    const usingFire = pow === "fire";
    const usingCast = !!pow;
    setFeedback(pow ? ("Yes! " + pow.charAt(0).toUpperCase() + pow.slice(1) + "!") : "Yes!", "good");

    el.cvcWord.classList.add("pop");
    el.fx.classList.remove("flash");
    void el.fx.offsetWidth;
    el.fx.classList.add("flash");

    const spark = document.createElement("div");
    spark.className = "spark" + (usingFire ? " fire-fx" : usingIce ? " ice-fx" : usingStar ? " star-fx" : "");
    if (usingStar && ART.vfx) {
      spark.classList.add("art-vfx");
      spark.style.backgroundImage = 'url("' + ART.vfx.src + '")';
    } else if (usingIce && ART.vfxIce) {
      spark.classList.add("art-burst");
      const iceUrl = ART.vfxIce.toDataURL ? ART.vfxIce.toDataURL("image/png") : ART.vfxIce.src;
      spark.style.backgroundImage = 'url("' + iceUrl + '")';
    } else if (usingFire && ART.vfxFire) {
      spark.classList.add("art-burst");
      const fireUrl = ART.vfxFire.toDataURL ? ART.vfxFire.toDataURL("image/png") : ART.vfxFire.src;
      spark.style.backgroundImage = 'url("' + fireUrl + '")';
    }
    el.fx.appendChild(spark);

    el.hero.classList.add("strike");
    setHeroFrame(usingCast ? "cast" : "strike");
    await wait(180);
    el.bloop.classList.remove("hit");
    void el.bloop.offsetWidth;
    el.bloop.classList.add("hit");
    setFoeArt(state.encounter.def.artKey, true);
    await wait(320);
    el.hero.classList.remove("strike");
    setHeroFrame("idle");
    setFoeArt(state.encounter.def.artKey, false);
    spark.remove();

    state.hits += 1;
    updatePips();
    setFlavor((pow ? pow.charAt(0).toUpperCase() + pow.slice(1) : "Read") + " hits! (" + state.hits + "/" + state.hitsNeeded + ")");

    if (state.hits >= state.hitsNeeded) {
      await winFight();
      return;
    }

    await wait(350);
    state.busy = false;
    if (!state.encounter.def.isBoss && hasAnyPower()) {
      showPowerPicker();
    } else {
      nextWord();
    }
  }

  async function onMiss() {
    if (state.busy || state.won) return;
    state.busy = true;
    clearStall();
    setControlsEnabled(false);
    setFeedback("Almost! Try again", "soft");
    el.cvcWrap.classList.remove("miss-shake");
    void el.cvcWrap.offsetWidth;
    el.cvcWrap.classList.add("miss-shake");
    setFlavor("Foe waits patiently.");
    await wait(650);
    el.cvcWrap.classList.remove("miss-shake");
    setFeedback("");
    state.busy = false;
    setControlsEnabled(true);
    paintPhrase(-1);
    armStall();
  }

  async function winFight() {
    state.won = true;
    const enc = state.encounter.def;
    const key = spotKey(state.encounter.spot);
    state.cleared[key] = true;

    el.bloop.classList.add("gone");

    if (enc.isBoss) {
      const d = worldDef();
      if (enc.id === "melody_gate" || d.power === "melody") state.wonStory = true;
      if (d.power) state.powers[d.power] = true;
      if (enc.id === "star_bloom") state.world2Open = true;
      if (enc.id === "ice_howl") state.world3Open = true;
      updatePowerHud();
      el.chest.classList.remove("hidden");
      el.chest.classList.add("open");
      const pname = d.power ? (d.power.charAt(0).toUpperCase() + d.power.slice(1)) : "the tale";
      setFlavor(d.bossName + " calms! " + pname + " unlocked!");
      el.winTitle.textContent = d.bossName + " cleared!";
      el.winMsg.textContent = d.nextName
        ? ("You earned " + pname + "! Walk the east gate into " + d.nextName + ".")
        : "You read the whole path!";
    } else {
      unlockWearForWorld(worldDef().id);
      setFlavor("Foe scoots away. Nice reading!");
      el.winTitle.textContent = "You did it!";
      const d = worldDef();
      el.winMsg.textContent = allFoesCleared()
        ? (d.bossName + " appeared on the east gate!")
        : ("Great reading! Clear the rest, then " + d.bossName + " on the east gate.");
    }
    setFeedback("Win!", "good");
    scheduleSave();
    await wait(450);
    el.winOverlay.classList.remove("hidden");
    state.busy = false;
  }

  function endFightToOverworld() {
    clearStall();
    state.busy = false;
    state.won = false;
    state.encounter = null;
    if (el.winOverlay) el.winOverlay.classList.add("hidden");
    if (el.bloop) {
      el.bloop.classList.remove("gone", "hit", "wiggle");
      el.bloop.classList.add("art-sprite");
    }
    rebindLiveCanvas();
    updateCamera();
    /* Stay on the Pixel path. Never preload/eval a second IIFE after a fight. */
    ART.locked = !!(ART.walk && currentTiles() && (currentFoeSheet() || ART.foes));
    showScene("overworld");
    if (state.scene === "overworld") drawWorld();
    updatePowerHud();
    applyWearArt();
    scheduleSave();
  }

  el.modeConfirm.addEventListener("click", () => setMode("confirm"));
  el.modeMatch.addEventListener("click", () => setMode("match"));
  el.btnDialogue.addEventListener("click", closeDialogue);
  el.btnInteract.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    interact(e);
  });
  el.btnInteract.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); });
  if (el.btnWear) {
    el.btnWear.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      cycleWear();
    });
  }
  if (el.btnNewgame) {
    el.btnNewgame.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      confirmNewGame();
    });
  }
  if (el.btnContinue) {
    el.btnContinue.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      continueFromSave();
    });
  }
  el.btnFlee.addEventListener("click", () => {
    if (state.busy) return;
    endFightToOverworld();
  });
  el.btnReplay.addEventListener("click", endFightToOverworld);

  el.btnConfirm.addEventListener("click", () => {
    if (state.busy || state.won || state.mode !== "confirm" || state.scene !== "fight") return;
    if (el.readPanel.classList.contains("hidden")) return;
    onSuccess();
  });

  function onChoiceClick(btn) {
    if (state.busy || state.won || state.mode !== "match" || state.scene !== "fight") return;
    if (el.readPanel.classList.contains("hidden")) return;
    if (btn.dataset.word === state.current.word) onSuccess();
    else onMiss();
  }
  el.choiceA.addEventListener("click", () => onChoiceClick(el.choiceA));
  el.choiceB.addEventListener("click", () => onChoiceClick(el.choiceB));

  (function rebindPad() {
    var wrap = el.dpad && el.dpad.parentNode;
    if (wrap && wrap.classList && wrap.classList.contains("dpad-wrap")) {
      var fresh = wrap.cloneNode(true);
      wrap.parentNode.replaceChild(fresh, wrap);
      el.dpad = document.getElementById("dpad");
      el.btnInteract = document.getElementById("btn-interact");
      el.btnWear = document.getElementById("btn-wear");
    }
  })();
  if (el.btnInteract) {
    el.btnInteract.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      interact(e);
    });
    el.btnInteract.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); });
  }
  if (el.btnWear) {
    el.btnWear.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      cycleWear();
    });
  }
  el.dpad.querySelectorAll("[data-dir]").forEach((btn) => {
    const dir = btn.dataset.dir;
    const step = () => {
      if (dir === "up") tryMove(0, -1);
      else if (dir === "down") tryMove(0, 1);
      else if (dir === "left") tryMove(-1, 0);
      else if (dir === "right") tryMove(1, 0);
    };
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); });
    let holdDelay = null;
    let holdRepeat = null;
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      talkBlockUntil = Date.now() + 1000;
      try { btn.setPointerCapture(e.pointerId); } catch (eCap) {}
      step();
      holdDelay = setTimeout(function () {
        holdRepeat = setInterval(step, 180);
      }, 280);
    }, true);
    const clear = () => {
      if (holdDelay) { clearTimeout(holdDelay); holdDelay = null; }
      if (holdRepeat) { clearInterval(holdRepeat); holdRepeat = null; }
    };
    btn.addEventListener("pointerup", clear);
    btn.addEventListener("pointerleave", clear);
    btn.addEventListener("pointercancel", clear);
  });

  window.addEventListener("keydown", (e) => {
    if (state.scene === "overworld" && !el.dialogue.classList.contains("hidden")) {
      if (e.key === "Enter" || e.key === " " || e.key === "e" || e.key === "E") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeDialogue();
      }
      return;
    }
    const map = {
      ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
      ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
      ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
      ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
    };
    if (map[e.key] && state.scene === "overworld") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      tryMove(map[e.key][0], map[e.key][1]);
      return;
    }
    if ((e.key === "e" || e.key === "E" || e.key === " ") && state.scene === "overworld") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      interact();
      return;
    }
    if ((e.key === "q" || e.key === "Q") && state.scene === "overworld") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      cycleWear();
    }
  }, true);

  showArtLoader(true);
  // Kid save resumes on the same origin, including Frost/Ember/Leaf.
  // URL world flags (?w2=1 …) skip save so vis-QA still works.
  var resumed = false;
  if (!visWorldFlag()) {
    var saved = readSave();
    if (saved) {
      applySave(saved);
      BOOT_WORLD = saved.world;
      BOOT_FROST = saved.world === "frost";
      resumed = true;
    }
  }
  // Parse URL FIRST — before HUD/hints/showScene. Do not re-spawn over a resumed save.
  var frostBoot = !resumed && BOOT_FROST;
  if (frostBoot) {
    state.powers.star = true;
    state.world2Open = true;
    enterFrost({ silent: true });
  }
  try {
    const qs = new URLSearchParams(location.search);
    const bootMap = { w3: "ember", ember: "ember", w4: "leaf", leaf: "leaf", w5: "wind", wind: "wind", w6: "tide", tide: "tide", w7: "storm", storm: "storm", w8: "harmony", harmony: "harmony", w9: "story", story: "story" };
    let bootId = (BOOT_WORLD && BOOT_WORLD !== "meadow" && BOOT_WORLD !== "frost") ? BOOT_WORLD : null;
    Object.keys(bootMap).forEach(function (k) { if (qs.get(k) === "1") bootId = bootMap[k]; });
    if (!resumed && bootId && !frostBoot) {
      const order = ["meadow", "frost", "ember", "leaf", "wind", "tide", "storm", "harmony", "story"];
      const idx = order.indexOf(bootId);
      for (let i = 0; i < idx; i++) {
        const pd = WORLD_DEFS[order[i]];
        if (pd && pd.power) state.powers[pd.power] = true;
      }
      state.world2Open = idx >= 1;
      state.world3Open = idx >= 2;
      enterWorld(bootId, { silent: true, spawn: "west" });
    }
    if (qs.get("clearfoes") === "1") {
      currentSpots().forEach(function (s) {
        if (s.type === "foe") state.cleared[spotKey(s)] = true;
      });
    }
    if (qs.get("wear") === "1") {
      COSMETICS.forEach(function (c) { state.unlockedWear[c.id] = true; });
      state.wearIndex = 0;
    }
    if (qs.get("atgate") === "1") {
      placeHero(17, 1, "right");
    }
  } catch (eQs) {}
  updateCamera();
  updatePowerHud();
  setMode("confirm");
  showScene("overworld");
  applyWorldChrome();
  saveReady = true;
  if (visWorldFlag()) {
    paintSaveHud("empty");
  } else if (resumed) {
    applyWearArt();
    updatePowerHud();
    writeSave();
    paintSaveHud("continue");
  } else {
    paintSaveHud(readSave() ? "saved" : "empty");
  }
  try {
    window.__MVB_KID = function () {
      const fs = currentFoeSheet();
      const bs = currentBossSheet(worldDef().bossId);
      return { world: state.world, px: state.px, py: state.py, camX: state.camX, camY: state.camY, facing: state.facing, wearIndex: state.wearIndex, world2Open: !!state.world2Open, world3Open: !!state.world3Open, wearUnlocked: Object.keys(state.unlockedWear), bank0: currentBank()[0], bankN: currentBank().length, bankWord: currentBank()[0], foeSheet: fs ? [fs.width, fs.height] : null, bossSheet: bs ? [bs.width, bs.height] : null, vfxIce: ART.vfxIce ? [ART.vfxIce.width, ART.vfxIce.height] : null, vfxFire: ART.vfxFire ? [ART.vfxFire.width, ART.vfxFire.height] : null, saved: !!(function(){try{return localStorage.getItem(SAVE_KEY)}catch(e){return null}})(), saveHud: (el.saveStatus && el.saveStatus.textContent) || "" };
    };
  } catch (eKid) {}
  function ensureWorldFromUrl() {
    /* Vis-QA URL flags may snap world. Kid save must not be yanked back to BOOT_WORLD on pageshow. */
    if (visWorldFlag()) {
      if ((BOOT_WORLD === "frost" || wantFrost()) && state.world !== "frost") {
        enterFrost({ silent: true });
      } else if (BOOT_WORLD && BOOT_WORLD !== "meadow" && state.world !== BOOT_WORLD) {
        enterWorld(BOOT_WORLD, { silent: true, spawn: "west" });
      }
    }
    updateCamera();
    if (currentTiles() && (currentFoeSheet() || ART.foes) && ART.walk) {
      ART.locked = true;
      artEverLocked = true;
      applyDomArt();
      if (state.scene === "overworld") drawWorld();
      showArtLoader(false);
    }
  }
  window.addEventListener("pageshow", function () {
    ensureWorldFromUrl();
  });
  window.addEventListener("popstate", function () {
    ensureWorldFromUrl();
  });
  window.addEventListener("pagehide", function () {
    writeSave();
  });
  window.addEventListener("beforeunload", function () {
    writeSave();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") writeSave();
  });
  setTimeout(function () {
    /* Never leave #art-loader up forever — but only reveal a Pixel frame. */
    if (ART.walk && currentTiles() && (currentFoeSheet() || ART.foes)) {
      ART.locked = true;
      artEverLocked = true;
      if (state.scene === "overworld") drawWorld();
      showArtLoader(false);
    }
  }, 8000);
  preloadArt();
})();
