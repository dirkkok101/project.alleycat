#!/bin/sh
# Copy finished art from art/out into the game's public assets, then put each
# character's frames on a shared canvas. Needs a python with Pillow + numpy
# (set PYTHON to override, e.g. a venv).
set -e
cd "$(dirname "$0")/.."
mkdir -p public/assets
for f in art/out/cat/*.png art/out/creatures/*.png art/out/props/*.png art/out/anim/*.png; do
  [ -f "$f" ] && cp "$f" public/assets/
done
# Prefer the 2x backgrounds when present.
for f in art/out/bg/*.jpg; do
  name=$(basename "$f")
  if [ -f "art/out/bg2x/$name" ]; then cp "art/out/bg2x/$name" public/assets/; else cp "$f" public/assets/; fi
done
"${PYTHON:-python3}" tools/normalize_sprites.py
ls public/assets | wc -l
