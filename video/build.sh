#!/bin/bash
# Rebuilds the X3 demo video: trims the start, adds captions and an end card.
# Captions are HTML rendered to transparent PNGs by headless Chrome (this ffmpeg build has no drawtext filter).
set -euo pipefail
cd "$(dirname "$0")"
SRC=${1:-$HOME/Downloads/PXL_20261004_204346109.mp4}
OUT=../public/posts/muse-x3/x3-muse-demo.mp4
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

# name | start | end | label | headline | sub   (times are seconds in the output video)
CAPS='title|0.3|3.8|DEMO|Muse on a pocket e‑ink reader|Xteink X3 · ESP32-C3 · 321 KB RAM
p1|6.6|8.6|01 / PRIORITIES|“Put my priorities on my X3”|
p2|8.9|10.6|02 / TODAY|“Show my day on my X3”|
p3|10.9|12.6|03 / WORKOUT|“Put today’s workout on my X3”|
p4|13.0|14.8|04 / NOTE|“Write a note on my X3”|
p5|15.2|17.6|05 / E-PAPER|Pages stay on screen with the power off|
end|19.2|99|CODE AND GUIDE|Muse on Xteink X3|github.com/Exorust/muse-gadget-xteink-x3<br>charoori.com'

inputs=(); graph="[0:v]trim=start=3,setpts=PTS-STARTPTS,fps=30,scale=1080:1920,tpad=stop_mode=clone:stop_duration=2.6[v0]"; n=0
while IFS='|' read -r name a b label head sub; do
  bg=transparent; [ "$name" = end ] && bg="#f4f4f2"
  cat > "$TMP/$name.html" <<HTML
<meta charset="utf-8"><style>
html,body{margin:0;width:1080px;height:1920px;background:$bg;color:#111;overflow:hidden}
.c{position:absolute;left:54px;right:54px;top:$([ "$name" = end ] && echo 760 || echo 110)px}
.l{font:500 30px "JetBrains Mono",monospace;letter-spacing:.06em;border-top:2px solid #111;padding-top:18px}
.h{font:500 $([ "$name" = title -o "$name" = end ] && echo 104 || echo 76)px/0.95 "Helvetica Neue",Helvetica,sans-serif;letter-spacing:-.04em;margin-top:22px}
.s{font:400 30px/1.5 "JetBrains Mono",monospace;margin-top:28px}
</style><div class="c"><div class="l">$label</div><div class="h">$head</div><div class="s">$sub</div></div>
HTML
  "$CHROME" --headless=new --hide-scrollbars --default-background-color=00000000 --window-size=1080,1920 \
    --screenshot="$TMP/$name.png" "file://$TMP/$name.html" >/dev/null 2>&1
  n=$((n+1)); inputs+=(-loop 1 -t 23 -i "$TMP/$name.png")
  fo=""; [ "$b" != 99 ] && fo=",fade=out:st=$(echo "$b-0.25" | bc):d=0.25:alpha=1"
  graph+=";[$n:v]format=rgba,fade=in:st=$a:d=$([ "$name" = end ] && echo 0.6 || echo 0.25):alpha=1$fo[c$n];[v$((n-1))][c$n]overlay=enable='between(t,$a,$b)'[v$n]"
done <<< "$CAPS"

ffmpeg -v error -y -i "$SRC" "${inputs[@]}" -filter_complex "$graph" -map "[v$n]" -an -t 22 \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT"
ffmpeg -v error -y -ss 7.5 -i "$OUT" -frames:v 1 -q:v 3 ../public/posts/muse-x3/x3-demo-poster.jpg
ls -la "$OUT"
