const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

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

// Add link to index.css if not present
if (!html.includes('/src/index.css')) {
  html = html.replace('</head>', '<link rel="stylesheet" href="/src/index.css">\n</head>');
}

// Also inject into <style data-precedence="next">
if (html.includes('data-precedence="next"')) {
  html = html.replace('</style>', preloaderCSS + '\n</style>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html with preloader CSS link & inline styles!');

// 2. Update src/interactive.js
let js = fs.readFileSync('src/interactive.js', 'utf8');
if (!js.includes("import './index.css';")) {
  js = "import './index.css';\n" + js;
  fs.writeFileSync('src/interactive.js', js, 'utf8');
  console.log('Added import "./index.css" to src/interactive.js!');
}
