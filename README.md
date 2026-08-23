# Sparkelody — Meadow vs Bloop (Phase 2 / v0.2)

K–1 reading RPG stub: top-down meadow walk → talk to NPCs → reading-gated CVC fights → persistent powers.

## Play

Open `index.html` on GitHub Pages / raw / local (CSS inlined; loads `app.js`). Modular fallback: `index.modular.html` + `styles.css` + `app.js`.

1. Walk with **arrows / WASD / on-screen D-pad**.
2. Talk to **Meadow Elder** (south path) → unlock **Star**.
3. Talk to **Path Kid** → unlock **Leaf** (after Star).
4. Step on encounter spots: tall grass (1-hit Bloop), bridge (2-hit Fluff Wolf), hill (3-hit Sleepy Drake + chest).
5. Reading gate: giant CVC + **Confirm** or **Pick word**. Miss = Almost, same word.
6. Win a bridge fight → unlock **Wind**. Powers persist on the overworld.

## Stack

Static HTML/CSS/JS. No build step. Vercel optional (`vercel.json`); GitHub static hosting works.
