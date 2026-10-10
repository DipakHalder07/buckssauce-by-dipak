const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<header data-nav="true" class="z-9990 fixed items-start top-0 left-0 w-full pointer-events-none opacity-0 -translate-y-[200px]" style="transform:translate(0px,0px);translate:none;rotate:none;scale:none;top:0px;opacity:1">',
  '<header data-nav="true" class="z-9990 fixed items-start top-0 left-0 w-full pointer-events-none opacity-0 -translate-y-[200px]" style="transform:translate(0px,0px);translate:none;rotate:none;scale:none;top:0px;opacity:0">'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated header initial style to opacity: 0 during preloader!');
