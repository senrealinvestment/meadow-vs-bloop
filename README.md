# Sparkelody — Meadow vs Bloop (Phase 2)

K–1 reading RPG stub: top-down meadow walk → talk to NPCs → reading-gated CVC fights → persistent powers.

## Play

Open the deployed Vercel URL, or open `index.html` locally (single-file build: CSS+JS inlined).

1. Walk with **arrows / WASD / on-screen D-pad**.
2. Talk to **Meadow Elder** (south path) → unlock **Star**.
3. Talk to **Path Kid** → unlock **Leaf** (after Star).
4. Step on encounter spots: tall grass (1-hit Bloop), bridge (2-hit Fluff Wolf), hill (3-hit Sleepy Drake + chest).
5. Reading gate: giant CVC + **Confirm** or **Pick word**. Miss = Almost, same word.
6. Win a bridge fight → unlock **Wind**. Powers persist on the overworld.

## Stack

Static single-file `index.html` (CSS+JS inlined) + `vercel.json`. No build step.
