# World 1 art hot-swap (Pixel Art Director)

Decode each `.b64` file to PNG (base64) at the same path without the `.b64` suffix.

```bash
base64 -d assets/sparkelody/walk/sheet.png.b64 > assets/sparkelody/walk/sheet.png
```

## Paths
- `assets/sparkelody/walk/sheet.png` — 4-dir walk + Star strike (cream/peach Sparkelody, gold spark-charm)
- `assets/sparkelody/cast/sheet.png` — all 7 elemental cast poses
- `assets/powers/icons-sheet.png` — Star Ice Fire Leaf Wind Water Electric
- `assets/powers/vfx-sheet.png` — one-frame cast bursts
- `assets/worlds/meadow/tiles.png` — Meadow tileset
- `assets/foes/bloop-fluff-sheet.png` — Bloop + Fluff skins
- `assets/bosses/star_bloom.png` — Star Bloom super boss (bigger than foes)
- `assets/ui/cvc-panel.png` — giant outlined CVC + Confirm + Almost + Star unlock flash

## Unlock order / colors
Star → Leaf → Wind → Ice → Fire → Water → Electric
Keys: gold / green / teal / cyan / orange / blue / yellow-bolt

World 1 ship: meadow tiles + bloop/fluff + star_bloom + Sparkelody walk + star icon/vfx + CVC UI.
Loop unchanged — wire hot-swap only.
