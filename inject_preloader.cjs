const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);
const assets = JSON.parse(fs.readFileSync('tools/loader_assets.json', 'utf8'));

const loaderHtml = `
<div id="bucks-preloader" class="fixed inset-0 w-screen h-screen z-9999 flex items-center justify-center overflow-hidden bg-background pointer-events-auto" style="will-change: opacity;">
  <!-- Concentric Circular Revealer Waves -->
  <div class="loader-revealer-1 absolute inset-0 bg-[#ef8f4a] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-2 absolute inset-0 bg-[#be8d3f] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-3 absolute inset-0 bg-[#da1f27] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-4 absolute inset-0 bg-[#13100e] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>

  <!-- Stage Container -->
  <div class="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none w-full h-full">
    <!-- Floating Ingredients -->
    <div class="absolute inset-0 pointer-events-none">
      <img src="${assets.fruit0}" alt="Peach" class="loader-fruit-peach absolute w-28 h-28 lg:w-44 lg:h-44 object-contain -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" style="will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit1}" alt="Pineapple" class="loader-fruit-pineapple absolute w-24 h-24 lg:w-40 lg:h-40 object-contain -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" style="will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit2}" alt="Habanero" class="loader-fruit-habanero absolute w-24 h-24 lg:w-40 lg:h-40 object-contain -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" style="will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit3}" alt="Cherry" class="loader-fruit-cherry absolute w-20 h-20 lg:w-36 lg:h-36 object-contain -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" style="will-change: transform, opacity; opacity: 0;" />
    </div>

    <!-- Center Logo & Badge -->
    <div class="loader-logo relative z-20 flex flex-col items-center justify-center" style="will-change: transform, opacity;">
      <div class="w-32 lg:w-44 h-auto text-foreground flex items-center justify-center">
        ${assets.logoSvg}
      </div>
      <div class="loader-badge font-serif text-lg lg:text-2xl tracking-[0.25em] uppercase mt-5 text-foreground/90 font-bold">
        SMALL BATCH BBQ
      </div>
    </div>
  </div>
</div>
`;

// Replace main > div.fixed.top-0.left-0.w-full.h-dvh with new loader
const oldLoader = $('main > div.fixed.top-0.left-0.w-full.h-dvh');
if (oldLoader.length > 0) {
  oldLoader.replaceWith(loaderHtml);
} else {
  $('main').prepend(loaderHtml);
}

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Injected preloader into index.html successfully!');
