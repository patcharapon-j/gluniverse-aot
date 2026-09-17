#!/bin/sh
# Copies the approved generated art (foundry/art-src, read-only; ADR-0027, asset-inventory.md) into
# static/assets. Run by hand after an art change; the build never reads art-src. Needs cwebp.
#   Action Catalog icons   128 px webp   assets/icons/action-*.webp
#   Token status icons     256 px webp   assets/icons/status-*.webp (read at 24 to 64 px on a token)
#   Soldier portraits      512 px webp   assets/portraits/portrait-<specialty>.webp
#   Foe plates             512 px webp   assets/plates/plate-foe-<kind>.webp
#   Setup background       1920 px webp  assets/plates/setup-sortie-dawn.webp
#   Dice So Nice faces     assets/dice: labels as lossless webp (alpha kept exactly), bump maps as
#                          greyscale PNG, identical faces stored once; textures as webp + PNG bump
set -eu
HERE=$(cd "$(dirname "$0")/.." && pwd)
ART="$HERE/art-src"
B1="$ART/batch-1/web"
SL="$ART/style-lock"
DICE="$SL/dice/final"
OUT="$HERE/static/assets"
mkdir -p "$OUT/icons" "$OUT/portraits" "$OUT/plates" "$OUT/dice"

lossy() { cwebp -quiet -q "${Q:-82}" -alpha_q 100 -m 6 "$@"; }

# Action icons: batch 1 (picks already applied by finalize.py) and the four style-lock v2 icons.
for f in "$B1"/action-*.webp; do lossy -resize 128 128 "$f" -o "$OUT/icons/$(basename "$f")"; done
for n in nape-strike fly dodge rally; do lossy -resize 128 128 "$SL/icons/v2/action-$n.png" -o "$OUT/icons/action-$n.webp"; done

# Status icons: 11 from batch 1, Down and Grabbed from the style lock.
for f in "$B1"/status-*.webp; do lossy -resize 256 256 "$f" -o "$OUT/icons/$(basename "$f")"; done
for n in down grabbed; do lossy -resize 256 256 "$SL/icons/v2/status-$n.png" -o "$OUT/icons/status-$n.webp"; done

# Portraits: eight from batch 1, the Slayer from the style lock.
for f in "$B1"/portrait-*.webp; do cp "$f" "$OUT/portraits/"; done
lossy -resize 0 512 "$SL/originals/plate-soldier-slayer.png" -o "$OUT/portraits/portrait-slayer.webp"

# Foe plates: two from batch 1, the bandit from the style lock.
for f in "$B1"/foe-*.webp; do cp "$f" "$OUT/plates/plate-$(basename "$f")"; done
lossy -resize 0 512 "$SL/originals/plate-foe-bandit.png" -o "$OUT/plates/plate-foe-bandit.webp"

# Website icons the site keeps at 1024 px and the system shows at 128 (2f: an Origin's icon).
SITE="$HERE/../site/src/assets/icons"
for n in gear-rations; do lossy -resize 128 128 "$SITE/$n.webp" -o "$OUT/icons/$n.webp"; done

# Setup background.
cp "$B1/setup-sortie-dawn.webp" "$OUT/plates/setup-sortie-dawn.webp"

# Dice So Nice faces (asset-inventory.md, Dice So Nice presets).
label() { cwebp -quiet -lossless -z 9 -exact "$1" -o "$OUT/dice/$2.webp"; }
label "$DICE/db/face-1-label.png" blank-label
cp "$DICE/db/face-1-bump.png" "$OUT/dice/blank-bump.png"
cp "$DICE/db/face-6-bump.png" "$OUT/dice/emblem-bump.png"
label "$DICE/db/face-6-label.png" db-6-label
label "$DICE/dg/face-6-label.png" dg-6-label
label "$DICE/dg/face-1-label.png" dg-1-label
cp "$DICE/dg/face-1-bump.png" "$OUT/dice/dg-1-bump.png"
label "$DICE/ds/face-6-label.png" ds-6-label
label "$DICE/ds/face-1-label.png" ds-1-label
cp "$DICE/ds/face-1-bump.png" "$OUT/dice/ds-1-bump.png"
label "$DICE/dt/face-6-label.png" dt-fang-label
cp "$DICE/dt/face-6-bump.png" "$OUT/dice/dt-fang-bump.png"
for t in bone flesh; do
  Q=90 lossy "$DICE/textures/$t-texture.png" -o "$OUT/dice/$t-texture.webp"
  cp "$DICE/textures/$t-bump.png" "$OUT/dice/$t-bump.png"
done
echo "art imported into $OUT"
