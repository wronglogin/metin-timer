#!/bin/sh
# wraps app.html into the standalone index.html used by GitHub Pages and the Android app;
# stamps a build number into it and writes the same number to version.txt (open pages compare the two and reload)
cd "$(dirname "$0")"
V=$(date +%s)
{ printf '<!doctype html>\n<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0f1417">\n<title>Unity Timer</title>\n<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style></head><body>\n'; sed "s/const BUILD = \"__BUILD__\";/const BUILD = \"$V\";/" app.html; printf '\n</body></html>\n'; } > index.html
printf '%s\n' "$V" > version.txt
