const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace preloader opening tag
html = html.replace(
  /<div class="fixed top-0 left-0 w-full h-dvh z-9999 \[clip-path:inset\(0\)\] bg-\[#100b06\]" style="[^"]*" aria-hidden="true" id="bucks-preloader">/i,
  '<div class="fixed top-0 left-0 w-full h-dvh z-9999 [clip-path:inset(0)]" style="opacity: 1; pointer-events: all; display: block;" aria-hidden="true" id="bucks-preloader">'
);

// Replace circles-wrapper and circles
const oldCirclesWrapper = /<div data-circles-wrapper="true"[^>]*>[\s\S]*?<\/div><div pointer-events-none/i;

const newCirclesWrapper = `<div data-circles-wrapper="true" class="absolute inset-0">` +
  `<div data-circle="true" data-circle-gold="true" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[280%] lg:w-[200%] aspect-square bg-gold"></div>` +
  `<div data-circle="true" data-circle-orange="true" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[280%] lg:w-[200%] aspect-square bg-orange"></div>` +
  `<div data-circle="true" data-circle-red="true" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[280%] lg:w-[200%] aspect-square bg-red"></div>` +
  `<div data-circle="true" data-circle-background="true" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[400%] lg:w-[200%] aspect-square bg-background"></div>` +
  `</div><div pointer-events-none`;

html = html.replace(oldCirclesWrapper, newCirclesWrapper);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated preloader markup in index.html!');
