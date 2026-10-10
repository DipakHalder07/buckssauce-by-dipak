const fs = require('fs');
const cheerio = require('cheerio');

// 1. Update src/index.css
let css = fs.readFileSync('src/index.css', 'utf8');

const preloaderCss = `/* =========================================================================
   PRELOADER INITIAL STATE & ANIMATION (Match buckssauce.com)
   ========================================================================= */
#bucks-preloader {
  clip-path: inset(0);
  background-color: #100b06 !important;
  opacity: 1;
}

[data-circles-wrapper] {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

[data-circle] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  border-radius: 9999px;
  aspect-ratio: 1 / 1;
  width: 280vw;
  height: 280vw;
  max-width: none;
  max-height: none;
  pointer-events: none;
  transform-origin: center center;
}

@media (min-width: 1024px) {
  [data-circle] {
    width: 200vw;
    height: 200vw;
  }
}

[data-circle-gold] {
  background-color: #be8d3f !important;
}

[data-circle-orange] {
  background-color: #f15726 !important;
}

[data-circle-red] {
  background-color: #da1f27 !important;
}

[data-circle-background] {
  background-color: #100b06 !important;
  width: 400vw;
  height: 400vw;
}

@media (min-width: 1024px) {
  [data-circle-background] {
    width: 200vw;
    height: 200vw;
  }
}

/* Preloader logo exact sizing (Tailwind h-75 = 18.75rem = 300px) */
.h-75 {
  height: 18.75rem !important;
}

#bucks-preloader [data-logo] {
  opacity: 0;
  transform: scale(0);
  transform-origin: 50% 50%;
}

#bucks-preloader [data-logo] svg {
  height: 18.75rem !important;
  width: auto !important;
  max-height: 300px !important;
}

#bucks-preloader [data-food] {
  opacity: 0;
  transform: scale(0);
  transform-origin: 50% 50%;
}
`;

// Replace preloader section in src/index.css
css = css.replace(/\/\* =+[\s\S]*?PRELOADER[\s\S]*?@media \(min-width: 1024px\) \{\s*\[data-circle-background\] \{\s*width: 200vw;\s*height: 200vw;\s*\}\s*\}/g, preloaderCss.trim());
fs.writeFileSync('src/index.css', css);
console.log('Updated src/index.css');

// 2. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Update <style> inside index.html
html = html.replace(/\/\* =+[\s\S]*?PRELOADER[\s\S]*?@media \(min-width: 1024px\) \{\s*\[data-circle-background\] \{\s*width: 200vw;\s*height: 200vw;\s*\}\s*\}/g, preloaderCss.trim());

const $ = cheerio.load(html, { decodeEntities: false });

// Update #bucks-preloader
const preloader = $('#bucks-preloader');
preloader.attr('style', 'opacity: 1; pointer-events: all; display: block; background-color: #100b06;');

// Update circles to initial scale(0)
preloader.find('[data-circle]').each((i, el) => {
  $(el).attr('style', 'transform: translate(-50%, -50%) scale(0); transform-origin: center center;');
});

// Update preloader logo
const logo = preloader.find('[data-logo]');
logo.attr('style', 'opacity: 0; transform: scale(0); transform-origin: 50% 50%;');
logo.find('svg').attr('class', 'h-75 w-auto').attr('style', 'height: 300px; width: auto;');

// Update horns and letters
logo.find('#left-horn').attr('style', 'opacity: 0; transform: rotate(-25deg); transform-origin: bottom right;');
logo.find('#right-horn').attr('style', 'opacity: 0; transform: rotate(25deg); transform-origin: bottom left;');
logo.find('#bucks > path, #sauce > path').each((i, el) => {
  $(el).attr('style', 'opacity: 0; transform: scale(0.2) translateY(4px); transform-origin: 50% 100%;');
});

// Update foods to initial opacity 0, scale 0
preloader.find('[data-food]').each((i, el) => {
  $(el).attr('style', 'opacity: 0; transform: scale(0); transform-origin: 50% 50%;');
});

fs.writeFileSync('index.html', $.html());
console.log('Updated index.html with clean preloader initial state and 300px logo!');
