# Meadow vs Bloop — Sparkelody Phase 3 World 1

Literacy-first overworld + read-to-hit fights. CVC only.

## World 1 Meadow
- Expanded 20×16 map with camera
- 20 foe spots + **Star Bloom** boss (20 reads)
- WORLD1 CVC bank (~79 words), ≤2/10 repeat picker
- Star unlocks **only** after Star Bloom
- World 2 Frost Path gate placeholder (locked until boss)
- Pixel art hot-swap: Sparkelody / foes / boss / tiles / power icons / VFX

## Files
- `app.readable.js` — source
- `app.js` — shipped JS (synced from readable; CDN may use chunked loader)
- `styles.css` — styles
- `assets/` — Pixel Art Director PNGs
- `assets-embed.js` — keyed data-URL fallback for jsDelivr CDN shells
- Deploy: Vercel same-origin `assets/` or CDN shell + embed / jsDelivr


## Branch ladder (not GREEN)

`feat/full-ladder-cosmetics` — Worlds 1–9 playable with official banks. Same-origin `index.html` on this branch (not a production pin). Live vis pin on main stays `3337fad7`. GREEN hold remains `7179fc44`.

- W3 Ember Grove `?w3=1` — CVC mastery, Ember Maw, Fire
- W4 Leaf Hollow `?w4=1` — 4-letter closed, Thorn Crown, Leaf
- W5 Windy Ridge `?w5=1` — 2 CVC words, Gale Whisk, Wind
- W6 Tide Pools `?w6=1` — CVC+4-letter pairs, Tide Shell, Water
- W7 Storm Peak `?w7=1` — 3-word trios, Storm Fang, Electric
- W8 Harmony Hill `?w8=1` — 20 four-word lines, Shine Bell, Shine
- W9 Story Gate `?w9=1` — 20 five/six-word lines, Melody Gate
- Wear: clear a regular foe to auto-unlock that world's look; giant WEAR cycles
- Pixel-only foes (CSS slime stays hidden)
