const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);
const assets = JSON.parse(fs.readFileSync('tools/loader_assets.json', 'utf8'));

const loaderHtml = `
<div id="bucks-preloader" class="fixed inset-0 w-screen h-screen z-9999 flex items-center justify-center overflow-hidden bg-[#13100e] pointer-events-auto" style="will-change: opacity;">
  <!-- Concentric Circular Revealer Waves -->
  <div class="loader-revealer-1 absolute inset-0 bg-[#ef8f4a] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-2 absolute inset-0 bg-[#be8d3f] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-3 absolute inset-0 bg-[#da1f27] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-4 absolute inset-0 bg-[#13100e] pointer-events-none" style="clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>

  <!-- Stage Container -->
  <div class="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none w-full h-full">
    <!-- Floating Ingredients -->
    <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
      <img src="${assets.fruit0}" alt="Peach" class="loader-fruit-peach absolute w-24 h-24 lg:w-32 lg:h-32 object-contain" style="will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit1}" alt="Pineapple" class="loader-fruit-pineapple absolute w-24 h-24 lg:w-32 lg:h-32 object-contain" style="will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit2}" alt="Habanero" class="loader-fruit-habanero absolute w-20 h-20 lg:w-28 lg:h-28 object-contain" style="will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit3}" alt="Cherry" class="loader-fruit-cherry absolute w-24 h-24 lg:w-32 lg:h-32 object-contain scale-125" style="will-change: transform, opacity; opacity: 0;" />
    </div>

    <!-- Center Logo & Badge -->
    <div class="loader-logo relative z-20 flex flex-col items-center justify-center" style="will-change: transform, opacity;">
      <div class="w-28 h-36 lg:w-36 lg:h-44 text-[#f5e4c7] flex items-center justify-center">
        ${assets.logoSvg}
      </div>
      <div class="loader-badge font-serif text-lg lg:text-xl tracking-[0.3em] uppercase mt-4 text-[#f5e4c7]/90 font-bold">
        SMALL BATCH BBQ
      </div>
    </div>
  </div>
</div>
`;

$('#bucks-preloader').replaceWith(loaderHtml);

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Updated refined preloader in index.html!');
