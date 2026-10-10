const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const preloaderCSS = `
/* =========================================================================
   PRELOADER EXPANDING CONCENTRIC CIRCLES (Match buckssauce.com)
   ========================================================================= */
#bucks-preloader {
  clip-path: inset(0);
  background: transparent !important;
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
  transform: translate(-50%, -50%);
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
`;

if (!css.includes('PRELOADER EXPANDING CONCENTRIC CIRCLES')) {
  css += preloaderCSS;
  fs.writeFileSync('src/index.css', css, 'utf8');
  console.log('Successfully appended preloader CSS to src/index.css!');
} else {
  console.log('Already in src/index.css');
}
