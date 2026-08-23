# Sparkelody — Meadow vs Bloop (Phase 3 / World 1)

K–1 reading RPG: expanded Meadow overworld → 20 cute Bloop/Fluff encounters → **Star Bloom** boss (20 CVC reads) → unlock **Star** → World 2 Frost Path gate (placeholder).

## Play

Open the deployed Vercel URL, or open `index.html` locally.

1. Walk with **arrows / WASD / D-pad**. Talk to **Meadow Elder** (teaches Star Bloom → Star → World 2).
2. Clear **20** meadow foes (basic read-to-hit; no Star yet).
3. Beat **Star Bloom** on the hill (**20** successful CVC reads). Miss = Almost, same word.
4. Unlock **Star** (zap/pop/sun/bat/jam). East gate opens for Frost Path (coming soon).
5. Modes: **Confirm** or **Pick word**. Reading is the only cast/hit.

## Literacy

CVC-only `WORLD1_BANK`. Word picker enforces ≤2 uses of the same word in any window of 10 foe reads or 10 boss reads.

## Stack

Static HTML/CSS/JS. Source: `app.readable.js` → minify `app.js`. Production: CDN-backed `index.html` (jsDelivr from GitHub) + `vercel.json`.
