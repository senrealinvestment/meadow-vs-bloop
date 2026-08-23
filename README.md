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
