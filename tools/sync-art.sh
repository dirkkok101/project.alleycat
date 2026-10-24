#!/bin/sh
# Copy finished art from art/out into the game's public assets.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/assets
for f in art/out/*/*.png art/out/*/*.jpg; do
  [ -f "$f" ] && cp "$f" public/assets/
done
ls public/assets | wc -l
