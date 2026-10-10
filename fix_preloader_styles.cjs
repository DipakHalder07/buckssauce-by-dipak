const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);
const assets = JSON.parse(fs.readFileSync('tools/loader_assets.json', 'utf8'));

const loaderHtml = `
<div id="bucks-preloader" class="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden pointer-events-auto" style="background-color: #13100e; z-index: 99999; will-change: opacity;">
  <!-- Concentric Circular Revealer Waves -->
  <div class="loader-revealer-1 absolute inset-0 pointer-events-none" style="background-color: #ef8f4a; clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-2 absolute inset-0 pointer-events-none" style="background-color: #be8d3f; clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-3 absolute inset-0 pointer-events-none" style="background-color: #da1f27; clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>
  <div class="loader-revealer-4 absolute inset-0 pointer-events-none" style="background-color: #13100e; clip-path: circle(0% at 50% 50%); will-change: clip-path;"></div>

  <!-- Stage Container -->
  <div class="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none w-full h-full">
    <!-- Floating Ingredients -->
    <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
      <img src="${assets.fruit0}" alt="Peach" class="loader-fruit-peach absolute" style="width: 130px; height: 130px; object-fit: contain; will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit1}" alt="Pineapple" class="loader-fruit-pineapple absolute" style="width: 120px; height: 120px; object-fit: contain; will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit2}" alt="Habanero" class="loader-fruit-habanero absolute" style="width: 110px; height: 110px; object-fit: contain; will-change: transform, opacity; opacity: 0;" />
      <img src="${assets.fruit3}" alt="Cherry" class="loader-fruit-cherry absolute" style="width: 125px; height: 125px; object-fit: contain; will-change: transform, opacity; opacity: 0;" />
    </div>

    <!-- Center Logo & Badge -->
    <div class="loader-logo relative z-20 flex flex-col items-center justify-center" style="will-change: transform, opacity;">
      <div style="width: 140px; height: 140px; color: #f5e4c7; display: flex; align-items: center; justify-content: center;">
        ${assets.logoSvg}
      </div>
      <div class="loader-badge font-serif text-xl tracking-[0.3em] uppercase mt-4 text-[#f5e4c7] font-bold">
        SMALL BATCH BBQ
      </div>
    </div>
  </div>
</div>
`;

$('#bucks-preloader').replaceWith(loaderHtml);

fs.writeFileSync('index.html', $.html(), 'utf8');
console.log('Fixed preloader styling with explicit inline styles!');
