/**
 * Sparkelody Phase 3 — Worlds 1-9 ladder + closet (Pixel-only).
 * Official literacy banks W1-W9. One Pixel fluff foe path. Do not GREEN.
 */
(function () {
  "use strict";
  if (window.__MVB_BOOTED) return;
  window.__MVB_BOOTED = true;

  // URL is source of truth — set before any draw. ?w2=1 never starts as meadow.
  var BOOT_FROST = false;
  try {
    BOOT_FROST = !!(typeof window !== "undefined" && window.MEADOW_START_FROST) ||
      (typeof location !== "undefined" && /[?&](w2|frost)=1/.test(location.search));
  } catch (eBootFrost) {}

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

  const WORLD2_BANK = "beg bet bib big bin bit cub den dim dip fed fig fin fit fog gem get hen hid him hip hit jig jet kid kit led leg lid lip lit men met mid mix net nip peg pen pep pet pig pin pit red rib rid rim rip set sip sit ten tin tip vet web wed wet wig win yet zip".split(" ");
  const ICE_CASTS = ["tip", "nip", "cub"];
  const STAR_CASTS = ["zap", "pop", "sun", "bat", "jam"];
  const FIRE_CASTS = ["hot", "red", "ash"];
  // World 3 bank: all-short CVC, no blends. Fire casts (hot/red/ash) are in-bank.
  const WORLD3_BANK = "ash bag bug cap cop cot cub cut dad dot fan fox gas gum hop hot hug hut jam job jog jug lap log lot mad mug nap nod nut pan pat pod pop pot pug ram rat red rod rot rub rug sad sap sob sub sum tab tag tap tub tug van wag wax wet yum zap".split(" ");

  const FOE_SKINS = [
    { artKey: "bloop", name: "Bloop" },
    { artKey: "bloop", name: "Sunny Bloop" },
    { artKey: "bloop", name: "Moss Bloop" },
    { artKey: "bloop", name: "Puddle Bloop" },
    { artKey: "bloop", name: "Puff Bloop" },
    { artKey: "bloop", name: "Petal Bloop" },
    { artKey: "bloop", name: "Daisy Bloop" },
    { artKey: "bloop", name: "Clover Bloop" },
    { artKey: "bloop", name: "Berry Bloop" },
    { artKey: "bloop", name: "Cloud Bloop" },
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
    { artKey: "bloop", name: "Ice Bloop" },
    { artKey: "bloop", name: "Frost Bloop" },
    { artKey: "bloop", name: "Snow Bloop" },
    { artKey: "bloop", name: "Chill Bloop" },
    { artKey: "bloop", name: "Glaze Bloop" },
    { artKey: "bloop", name: "Crystal Bloop" },
    { artKey: "bloop", name: "Puff Ice" },
    { artKey: "bloop", name: "Rime Bloop" },
    { artKey: "bloop", name: "Hail Bloop" },
    { artKey: "bloop", name: "Shiver Bloop" },
    { artKey: "bloop", name: "Nip Bloop" },
    { artKey: "bloop", name: "Mint Bloop" },
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
    { artKey: "bloop", name: "Ember Bloop" },
    { artKey: "bloop", name: "Cinder Bloop" },
    { artKey: "bloop", name: "Spark Bloop" },
    { artKey: "bloop", name: "Coal Bloop" },
    { artKey: "bloop", name: "Flame Bloop" },
    { artKey: "bloop", name: "Heat Bloop" },
    { artKey: "bloop", name: "Glow Bloop" },
    { artKey: "bloop", name: "Ash Bloop" },
    { artKey: "bloop", name: "Soot Bloop" },
    { artKey: "bloop", name: "Torch Bloop" },
    { artKey: "bloop", name: "Chili Bloop" },
    { artKey: "bloop", name: "Magma Bloop" },
    { artKey: "bloop", name: "Forge Bloop" },
    { artKey: "bloop", name: "Camp Bloop" },
    { artKey: "bloop", name: "Kindle Bloop" },
    { artKey: "bloop", name: "Blaze Bloop" },
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

  const LEAF_CASTS = ["pad", "bud", "fog"];
  const WIND_CASTS = ["fan", "sun", "hop"];
  const WATER_CASTS = ["wet", "mud", "hop"];
  const ELEC_CASTS = ["zap", "zip", "run"];
  const SHINE_CASTS = ["and", "on", "up"];
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
      a.push({ artKey: i < Math.ceil(n / 2) ? "bloop" : "fluff_lite", name: theme + (i < Math.ceil(n / 2) ? " Bloop" : " Fluff") });
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
    { id: "shine-charm", world: "harmony", name: "Shine Charm", frame: 0 },
    { id: "melody-book", world: "story", name: "Melody Book", frame: 3 },
  ];
  const OUTFIT_FRAMES = [
    [59, 414, 151, 214],
    [210, 414, 151, 214],
    [363, 414, 151, 214],
    [516, 414, 151, 214],
    [669, 414, 151, 214],
    [822, 414, 151, 214],
    [970, 414, 151, 214],
  ];
  const WEAR_BTN_SRC = [1119, 414, 379, 214];
  const LADDER_TILE_SRC = {
    ember: { size: 96, src: { 0: [16, 24], 1: [16, 408], 2: [208, 408], 3: [16, 656], 4: [656, 24], 5: [1000, 648], 6: [1184, 160] } },
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
    story: { id: "story", num: 9, title: "Sparkelody · World 9 Story Gate", hint: "Story Gate · story lines · Melody Gate on the east", map: STORY_MAP, spots: STORY_SPOTS, npcs: STORY_NPCS, bank: WORLD9_BANK, skins: STORY_FOE_SKINS, prefix: "y:", next: null, prev: "harmony", power: "story", bossId: "melody_gate", bossName: "Melody Gate", nextName: null, appClass: "world-story", foeTint: [80, 90, 140] },
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
    btnWear: document.getElementById("btn-wear"),
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

  const ctx = el.canvas.getContext("2d");

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
    bloop: { idle: [1, 0], hit: [1, 1] },
    fluff_lite: { idle: [1, 0], hit: [1, 1] },
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

  var artLoadInFlight = false;
  var ART_WORLD_IDS = ["ember", "leaf", "wind", "tide", "storm", "harmony", "story"];
  async function preloadArt() {
    if (artLoadInFlight) return;
    artLoadInFlight = true;
    try {
    if (!ART.walk || !ART.foes || !ART.meadowTiles) {
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
        loadImage(assetUrl("foes/frost-bloop-fluff-sheet.png")),
        loadImage(assetUrl("outfits/sheet.png")),
      ]);
      const walk = packed[0], cast = packed[1], foes = packed[2], boss = packed[3], tiles = packed[4], icons = packed[5], vfx = packed[6], panel = packed[7], npcs = packed[8], iceHowl = packed[9], frostTiles = packed[10], frostFoes = packed[11], outfitImg = packed[12];
      ART.walk = walk ? keySheet(walk, CHROMA.walk) || walk : (ART.walk || null);
      ART.cast = cast ? keySheet(cast, CHROMA.cast) || cast : (ART.cast || null);
      ART.foes = foes ? keySheet(foes, CHROMA.foes) || foes : (ART.foes || null);
      ART.boss = boss ? keySheet(boss, CHROMA.boss) || boss : (ART.boss || null);
      ART.meadowTiles = tiles && (tiles.naturalWidth || tiles.width) ? tiles : (ART.meadowTiles || null);
      ART.tiles = ART.meadowTiles;
      ART.icons = icons && (icons.naturalWidth || icons.width) ? icons : null;
      ART.vfx = vfx && (vfx.naturalWidth || vfx.width) ? vfx : null;
      ART.panel = panel && (panel.naturalWidth || panel.width) ? panel : null;
      ART.npcs = npcs ? keySheet(npcs, CHROMA.npcs) || npcs : (ART.npcs || null);
      ART.iceHowl = iceHowl ? keySheet(iceHowl, CHROMA.boss) || iceHowl : null;
      ART.frostTiles = frostTiles && (frostTiles.naturalWidth || frostTiles.width) ? frostTiles : (ART.frostTiles || null);
      ART.frostFoes = frostFoes ? keySheet(frostFoes, CHROMA.foes) || frostFoes : (ART.frostFoes || null);
      ART.outfits = outfitImg ? keyChroma(outfitImg, [140, 158, 113], 48) : (ART.outfits || null);
      ART.worldTiles = ART.worldTiles || {};
      ART.worldFoes = ART.worldFoes || {};
      ART.worldBoss = ART.worldBoss || {};
    }
    if (BOOT_FROST || wantFrost()) {
      ART.tiles = ART.frostTiles || ART.tiles;
      ART.ready = !!(ART.walk && ART.frostTiles && (ART.frostFoes || ART.foes));
    } else if (laterWorld()) {
      ART.tiles = currentTiles() || ART.tiles;
      ART.ready = !!(ART.walk && currentTiles() && (currentFoeSheet() || ART.foes));
    } else {
      ART.tiles = ART.meadowTiles || ART.tiles;
      ART.ready = !!(ART.walk && ART.tiles && ART.foes);
    }
    if (ART.locked) artEverLocked = true;
    ART.locked = ART.locked || ART.ready || artEverLocked;
    if (ART.locked) artEverLocked = true;
    if (ART.walk) applyDomArt();
    if (ART.locked) {
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
      if (artKey === "ice_howl") {
        el.bloop.style.setProperty("width", "144px", "important");
        el.bloop.style.setProperty("height", "96px", "important");
      }
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
    el.bloop.style.backgroundSize = dispW * 2 + "px " + dispH * 2 + "px";
    el.bloop.style.backgroundPosition = -(cx * dispW) + "px " + -(cy * dispH) + "px";
    el.bloop.style.backgroundRepeat = "no-repeat";
  }

  function drawSheetFrame(sheet, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (!sheet) return false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sheet, sx, sy, sw, sh, dx, dy, dw, dh);
    return true;
  }


  const state = {
    scene: "overworld",
    mode: "confirm",
    px: 16,
    py: 14,
    facing: "up",
    camX: 0,
    camY: 0,
    powers: { star: false, leaf: false, wind: false, ice: false, fire: false, water: false, electric: false, shine: false },
    world: BOOT_FROST ? "frost" : "meadow",
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
  function wantFrost() {
    if (state.world === "meadow" || laterWorld()) return false;
    if (BOOT_FROST) return true;
    if (state.world === "frost") return true;
    try {
      if (typeof window !== "undefined" && window.MEADOW_START_FROST) return true;
    } catch (e0) {}
    try {
      if (typeof location !== "undefined" && /[?&](w2|frost)=1/.test(location.search)) return true;
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
    if (id === "meadow") return ART.meadowTiles || ART.tiles;
    return ART.worldTiles[id] || null;
  }
  function currentFoeSheet() {
    const id = worldDef().id;
    if (id === "frost") return ART.frostFoes || ART.foes || null;
    if (id === "meadow") return ART.foes;
    ART.worldFoes = ART.worldFoes || {};
    if (!ART.worldFoes[id]) {
      const d = WORLD_DEFS[id];
      const base = id === "storm" ? (ART.frostFoes || ART.foes) : ART.foes;
      ART.worldFoes[id] = d && d.foeTint && base ? tintSheet(base, d.foeTint, 0.4) : base;
    }
    return ART.worldFoes[id] || ART.foes;
  }
  function currentBossSheet(artKey) {
    if (artKey === "star_bloom") return ART.boss;
    if (artKey === "ice_howl") return ART.iceHowl;
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
      el.prompt.textContent =
        mode === "confirm" ? "Sound it out! Parent taps Confirm." : "Sound it out! Pick the matching word.";
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
    if (name === "overworld" && ART.locked) drawWorld();
  }

  function updateCamera() {
    state.camX = Math.max(0, Math.min(COLS - VIEW_COLS, state.px - Math.floor(VIEW_COLS / 2)));
    state.camY = Math.max(0, Math.min(ROWS - VIEW_ROWS, state.py - Math.floor(VIEW_ROWS / 2)));
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
      }
      if (el.canvas) el.canvas.classList.add("art-wait");
    } else {
      if (n) n.classList.add("hidden");
      if (el.canvas) el.canvas.classList.remove("art-wait");
    }
  }

  function drawWorld() {
    // URL wins: a warm Meadow tab that lands on ?w2=1 must never keep meadow tiles.
    try {
      if (state.world !== "meadow" && !laterWorld() &&
          ((typeof window !== "undefined" && window.MEADOW_START_FROST) ||
          (typeof location !== "undefined" && /[?&](w2|frost)=1/.test(location.search)))) {
        if (state.world !== "frost") {
          state.world = "frost";
          const app = document.getElementById("app");
          if (app) app.classList.add("world-frost");
          const title = document.querySelector(".title");
          if (title) title.textContent = "Sparkelody · World 2 Frost Path";
          if (el.worldHint) el.worldHint.textContent = "Frost Path";
        }
      }
    } catch (eDrawFrost) {}
    updateCamera();
    if (artEverLocked) ART.locked = true;
    const w = VIEW_COLS * TILE;
    const h = VIEW_ROWS * TILE;
    const sheetsOk = !!(ART.walk && currentTiles() && (currentFoeSheet() || ART.foes));
    if (sheetsOk) { ART.locked = true; artEverLocked = true; }
    if (el.canvas.width !== w || el.canvas.height !== h) {
      el.canvas.width = w;
      el.canvas.height = h;
    } else {
      ctx.clearRect(0, 0, w, h);
    }
    if (!sheetsOk) {
      // Ember tiles pending: show loader, never fall back to meadow/frost blit or procedural tiles.
      if (wantEmber() && !ART.emberTiles) {
        showArtLoader(true);
        return;
      }
      if (artEverLocked) return;
      showArtLoader(true);
      return;
    }
    showArtLoader(false);

    for (let vy = 0; vy < VIEW_ROWS; vy++) {
      for (let vx = 0; vx < VIEW_COLS; vx++) {
        const x = vx + state.camX;
        const y = vy + state.camY;
        const t = currentMap()[y] && currentMap()[y][x];
        const sx = vx * TILE;
        const sy = vy * TILE;
        let usedTile = false;
        let tilesheet = currentTiles();
        if (wantFrost()) tilesheet = ART.frostTiles || null;
        else if (!laterWorld() && ART.locked && tilesheet === ART.frostTiles) tilesheet = ART.meadowTiles || null;
        const atlas = tileAtlas();
        const srcMap = atlas.src;
        const srcSize = atlas.size;
        const frostSheetOk = !!(tilesheet && (tilesheet.naturalWidth || tilesheet.width) && srcMap[t] != null);
        if (frostSheetOk) {
          const src = srcMap[t];
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tilesheet, src[0], src[1], srcSize, srcSize, sx, sy, TILE, TILE);
          usedTile = true;
        }
        if (!usedTile) {
          if (ART.locked && !wantFrost()) {
            const mt = ART.meadowTiles;
            const srcLocked = TILE_SRC[t];
            if (mt && mt !== ART.frostTiles && (mt.naturalWidth || mt.width) && srcLocked != null) {
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(mt, srcLocked[0], srcLocked[1], 32, 32, sx, sy, TILE, TILE);
              usedTile = true;
            }
          }
        }
        /* no procedural tiles — skip cell if sheets miss */
        if (t === T.GATE) {
          if (!usedTile) {
            let open = state.world2Open;
            if (isEmber()) open = x <= 1 || state.powers.fire;
            else if (isFrost()) open = x <= 1 || state.powers.ice;
            ctx.fillStyle = open ? "#bbdefb" : "#546e7a";
            ctx.fillRect(sx + 6, sy + 4, TILE - 12, TILE - 8);
          }
          ctx.fillStyle = "#fff";
          ctx.font = "bold 10px sans-serif";
          const gd = worldDef();
          let glabel = "gate";
          if (x <= 1 && gd.prev) glabel = gd.prev === "meadow" ? "W1" : gd.prev === "frost" ? "W2" : ("W" + Math.max(1, gd.num - 1));
          else if (gd.next) glabel = gd.power === "story" ? (state.wonStory ? "END" : "lock") : (state.powers[gd.power] ? ("W" + (gd.num + 1)) : "lock");
          else glabel = state.wonStory ? "END" : "lock";
          ctx.fillText(glabel, sx + 6, sy + 20);
        }
      }
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
        const howl = (spot.id === "ice_howl" || worldDef().bossId === "ice_howl");
        const bh = howl ? 48 : 32;
        const bw = howl ? 48 : 32;
        drawSheetFrame(bossSheet, 0, 0, bossSheet.width, bossSheet.height, cx - bw / 2, cy + TILE / 2 - bh - 2, bw, bh);
      } else if (spot.type === "foe" && currentFoeSheet()) {
        const cell = FOE_CELLS.fluff_lite;
        const [ccx, ccy] = cell.idle;
        const fs = currentFoeSheet();
        const fw = fs.width / 2;
        const fh = fs.height / 2;
        const dh = 30;
        const dw = 28;
        drawSheetFrame(fs, ccx * fw, ccy * fh, fw, fh, cx - dw / 2, cy + TILE / 2 - dh - 2, dw, dh);
      }
    });

    currentNpcs().forEach((npc) => {
      const vx = npc.x - state.camX;
      const vy = npc.y - state.camY;
      if (vx < -1 || vy < -1 || vx >= VIEW_COLS || vy >= VIEW_ROWS) return;
      const nx = vx * TILE + 2;
      const ny = vy * TILE;
      const fr = NPC_FRAMES[npc.id];
      if (ART.npcs && fr) {
        const dw = 28;
        const dh = 36;
        drawSheetFrame(ART.npcs, fr[0], fr[1], fr[2], fr[3], nx + (TILE - dw) / 2, ny + (TILE - dh) / 2 - 4, dw, dh);
      }
      ctx.fillStyle = "#1e3a28";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText(npc.name.split(" ")[1] || npc.name, nx - 2, ny + 38);
    });

    drawSparkelody((state.px - state.camX) * TILE, (state.py - state.camY) * TILE);
  }

  function drawSparkelody(px, py) {
    const dw = 28;
    const dh = 30;
    const dx = px + (TILE - dw) / 2;
    const dy = py + (TILE - dh) / 2 - 2;
    if (state.wearIndex >= 0 && ART.outfits) {
      const of = OUTFIT_FRAMES[state.wearIndex];
      if (of) {
        drawSheetFrame(ART.outfits, of[0], of[1], of[2], of[3], dx, dy - 6, dw, dh + 8);
        return;
      }
    }
    const face =
      state.facing === "up"
        ? "up"
        : state.facing === "down"
          ? "down"
          : state.facing === "left"
            ? "left"
            : "right";
    if (!ART.walk) return;
    const fr = WALK_FRAMES[face][0];
    drawSheetFrame(ART.walk, fr[0], fr[1], fr[2], fr[3], dx, dy, dw, dh);
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
      } else if (d.power === "story") {
        return !!state.wonStory;
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
    state.px = nx;
    state.py = ny;
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
    if (spawn === "east") {
      state.px = 17;
      state.py = 2;
      state.facing = "left";
    } else {
      state.px = 2;
      state.py = 14;
      state.facing = "up";
    }
    applyWorldChrome();
    closeDialogueQuiet();
    const silent = !!(opts && opts.silent);
    if (silent) return;
    if (ART.frostTiles) drawWorld();
    else {
      showArtLoader(true);
      preloadArt();
    }
  }
  function enterMeadow() {
    state.world = "meadow";
    state.px = 17;
    state.py = 2;
    state.facing = "left";
    applyWorldChrome();
    closeDialogueQuiet();
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
    state.px = 2;
    state.py = 14;
    state.facing = "up";
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
    const silent = !!(opts && opts.silent);
    if (silent) return;
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
    if (spawn === "east") {
      state.px = 17;
      state.py = 2;
      state.facing = "left";
    } else {
      state.px = 2;
      state.py = 14;
      state.facing = "up";
    }
    applyWorldChrome();
    closeDialogueQuiet();
    const silent = !!(opts && opts.silent);
    if (silent) return;
    if (currentTiles()) drawWorld();
    else {
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
    if (d.power === "story") {
      if (!state.wonStory) {
        el.worldHint.textContent = "Beat Melody Gate first!";
        return;
      }
      el.dialogueName.textContent = "Story Gate";
      el.dialogueText.textContent = "You read the whole path! What a tale.";
      el.dialogue.classList.remove("hidden");
      el.dpad.classList.add("hidden");
      drawWorld();
      return;
    }
    if (d.power && !state.powers[d.power]) {
      el.worldHint.textContent = (d.nextName || "Next") + " locked — beat " + d.bossName + " first!";
      return;
    }
    if (d.next) enterWorld(d.next, { spawn: "west" });
  }
  function unlockWearForWorld(wid) {
    const c = COSMETICS.filter(function (x) { return x.world === wid; })[0];
    if (!c) return;
    state.unlockedWear[c.id] = true;
    if (state.wearIndex < 0) state.wearIndex = c.frame;
    applyWearArt();
    updatePowerHud();
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
    if (state.scene === "overworld") drawWorld();
  }
  function applyWearArt() {
    if (!el.hero || state.wearIndex < 0 || !ART.outfits) return;
    const of = OUTFIT_FRAMES[state.wearIndex];
    if (!of) return;
    const url = ART.outfits.toDataURL ? ART.outfits.toDataURL("image/png") : ART.outfits.src;
    el.hero.classList.add("art-sprite", "wear-look");
    el.hero.style.setProperty("--hero-sheet", 'url("' + url + '")');
    const sw = ART.outfits.naturalWidth || ART.outfits.width || 1536;
    const sh = ART.outfits.naturalHeight || ART.outfits.height || 1024;
    el.hero.style.setProperty("--hero-sheet-w", sw + "px");
    el.hero.style.setProperty("--hero-sheet-h", sh + "px");
    el.hero.style.setProperty("--hero-sx", -of[0] + "px");
    el.hero.style.setProperty("--hero-sy", -of[1] + "px");
    el.hero.style.setProperty("--hero-sw", of[2] + "px");
    el.hero.style.setProperty("--hero-sh", of[3] + "px");
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
    return !!(p.star || p.ice || p.fire || p.leaf || p.wind || p.water || p.electric || p.shine);
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
    if (state.selectedPower === "star") {
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
    if (hi == null || hi < 0 || words.length < 2) {
      el.cvcWord.textContent = raw.toUpperCase();
      return;
    }
    el.cvcWord.innerHTML = words.map(function (w, i) {
      const t = w.toUpperCase();
      return i === hi ? '<span class="stall-hi">' + t + "</span>" : t;
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
    if (el.prompt) el.prompt.textContent = phrase ? "Read the line!" : "Sound it out!";
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
    spark.className = "spark" + (usingFire ? "" : usingIce ? " ice-fx" : usingStar ? " star-fx" : "");
    if (ART.vfx) {
      spark.classList.add("art-vfx");
      spark.style.backgroundImage = 'url("' + ART.vfx.src + '")';
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
      if (enc.id === "melody_gate" || d.power === "story") state.wonStory = true;
      else if (d.power) state.powers[d.power] = true;
      if (enc.id === "star_bloom") state.world2Open = true;
      if (enc.id === "ice_howl") state.world3Open = true;
      updatePowerHud();
      el.chest.classList.remove("hidden");
      el.chest.classList.add("open");
      const pname = d.power === "story" ? "the tale" : (d.power.charAt(0).toUpperCase() + d.power.slice(1));
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
    await wait(450);
    el.winOverlay.classList.remove("hidden");
    state.busy = false;
  }

  function endFightToOverworld() {
    clearStall();
    state.busy = false;
    state.won = false;
    state.encounter = null;
    el.winOverlay.classList.add("hidden");
    showScene("overworld");
    updatePowerHud();
    applyWearArt();
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
    }
  })();
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
    });
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
      tryMove(map[e.key][0], map[e.key][1]);
    }
    if ((e.key === "e" || e.key === "E" || e.key === " ") && state.scene === "overworld") {
      e.preventDefault();
      interact();
    }
    if ((e.key === "q" || e.key === "Q") && state.scene === "overworld") {
      e.preventDefault();
      cycleWear();
    }
  });

  showArtLoader(true);
  // Parse w2/frost=1 FIRST — before HUD/hints/showScene. Not inside a try that can skip enterFrost.
  var frostBoot = false;
  try {
    frostBoot = !!(typeof window !== "undefined" && window.MEADOW_START_FROST);
  } catch (eBoot0) {}
  try {
    if (!frostBoot && typeof location !== "undefined" && /[?&](w2|frost)=1/.test(location.search)) {
      frostBoot = true;
    }
  } catch (eBoot1) {}
  if (frostBoot) {
    state.powers.star = true;
    state.world2Open = true;
    enterFrost({ silent: true });
  }
  try {
    const qs = new URLSearchParams(location.search);
    const bootMap = { w3: "ember", ember: "ember", w4: "leaf", leaf: "leaf", w5: "wind", wind: "wind", w6: "tide", tide: "tide", w7: "storm", storm: "storm", w8: "harmony", harmony: "harmony", w9: "story", story: "story" };
    let bootId = null;
    Object.keys(bootMap).forEach(function (k) { if (qs.get(k) === "1") bootId = bootMap[k]; });
    if (bootId && !frostBoot) {
      const order = ["meadow", "frost", "ember", "leaf", "wind", "tide", "storm", "harmony", "story"];
      const idx = order.indexOf(bootId);
      for (let i = 0; i < idx; i++) {
        const pd = WORLD_DEFS[order[i]];
        if (pd && pd.power && pd.power !== "story") state.powers[pd.power] = true;
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
      state.px = 17;
      state.py = 1;
      state.facing = "right";
    }
  } catch (eQs) {}
  updatePowerHud();
  setMode("confirm");
  showScene("overworld");
  applyWorldChrome();
  function ensureFrostFromUrl() {
    if (!wantFrost()) return;
    enterFrost({ silent: true });
    if (!ART.frostTiles) {
      showArtLoader(true);
      preloadArt();
      return;
    }
    ART.ready = !!(ART.walk && ART.npcs && ART.foes && ART.frostTiles);
    if (ART.locked) artEverLocked = true;
    ART.locked = ART.locked || ART.ready || artEverLocked;
    if (ART.locked) artEverLocked = true;
    if (!ART.locked) {
      showArtLoader(true);
      preloadArt();
      return;
    }
    applyDomArt();
    if (state.scene === "overworld") drawWorld();
    showArtLoader(false);
  }
  window.addEventListener("pageshow", function (ev) {
    // bfcache can restore Meadow canvas under a Frost URL — hard reload.
    if (ev && ev.persisted && wantFrost()) {
      location.reload();
      return;
    }
    ensureFrostFromUrl();
  });
  window.addEventListener("popstate", function () {
    ensureFrostFromUrl();
  });
  setInterval(function () {
    if (!wantFrost()) return;
    state.world = "frost";
    ART.tiles = ART.frostTiles || ART.tiles;
    var _ap = document.getElementById("app");
    if (_ap) _ap.classList.add("world-frost");
    if (!ART.frostTiles) {
      if (!ART.locked) preloadArt();
      return;
    }
    if (state.scene === "overworld") drawWorld();
  }, 400);
  preloadArt();
})();
