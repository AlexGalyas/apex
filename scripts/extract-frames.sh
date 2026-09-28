#!/usr/bin/env bash
# Usage: [QUALITY=80] scripts/extract-frames.sh <video> <scene> [fps=30]
# Cuts a video into WebP frames for the scroll engine:
#   public/sequences/<scene>/{desktop,mobile}/0001.webp … + manifest.json
# ffmpeg decodes and scales to PNG, cwebp encodes (this ffmpeg build has no libwebp).
# Desktop is near the 2K source width: a Retina canvas is ~3000 device px wide, so
# 1920 frames were stretched ~1.8x. -sharp_yuv keeps neon edges crisp through 4:2:0.
set -euo pipefail

VIDEO=${1:?usage: extract-frames.sh <video> <scene> [fps]}
SCENE=${2:?usage: extract-frames.sh <video> <scene> [fps]}
FPS=${3:-30}
QUALITY=${QUALITY:-80}
DESKTOP_WIDTH=2560
MOBILE_WIDTH=960
JOBS=$(sysctl -n hw.ncpu 2>/dev/null || nproc)

command -v ffmpeg >/dev/null || { echo "ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }
command -v cwebp >/dev/null || { echo "cwebp not found (brew install webp)" >&2; exit 1; }
[[ -f "$VIDEO" ]] || { echo "no such video: $VIDEO" >&2; exit 1; }

OUT="public/sequences/$SCENE"
VERSION=$({ shasum "$VIDEO"; echo "$FPS $QUALITY $DESKTOP_WIDTH $MOBILE_WIDTH sharp"; } | shasum | cut -c1-10)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

rm -rf "$OUT"

extract() {
	local variant=$1 width=$2
	mkdir -p "$TMP/$variant" "$OUT/$variant"
	ffmpeg -hide_banner -loglevel error -i "$VIDEO" \
		-vf "fps=$FPS,scale=$width:-2:flags=lanczos" \
		"$TMP/$variant/%04d.png"
	find "$TMP/$variant" -name '*.png' -print0 |
		xargs -0 -P "$JOBS" -I{} sh -c \
			'cwebp -quiet -m 6 -sharp_yuv -q '"$QUALITY"' "$1" -o "'"$OUT/$variant"'/$(basename "${1%.png}").webp"' _ {}
}

extract desktop "$DESKTOP_WIDTH"
extract mobile "$MOBILE_WIDTH"

COUNT=$(find "$OUT/desktop" -name '*.webp' | wc -l | tr -d ' ')
size() { sips -g pixelWidth -g pixelHeight "$1" | awk '/pixel(Width|Height)/ {printf "%s ", $2}'; }
read -r DW DH <<<"$(size "$TMP/desktop/0001.png")"
read -r MW MH <<<"$(size "$TMP/mobile/0001.png")"

cat >"$OUT/manifest.json" <<JSON
{
  "scene": "$SCENE",
  "fps": $FPS,
  "frameCount": $COUNT,
  "ext": "webp",
  "placeholder": false,
  "version": "$VERSION",
  "variants": {
    "desktop": { "width": $DW, "height": $DH },
    "mobile": { "width": $MW, "height": $MH }
  }
}
JSON

echo "✓ $SCENE: $COUNT frames at ${FPS}fps → $OUT ($(du -sh "$OUT" | cut -f1))"
