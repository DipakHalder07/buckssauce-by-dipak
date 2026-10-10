const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update logo tag style
html = html.replace(
  '<a data-logo="true" class="relative block z-20 w-auto h-20 shrink-0 lg:w-40 lg:h-fit text-foreground pointer-events-auto" style="will-change:transform,opacity;translate:none;rotate:none;scale:none;transform:scale(0.9,0.9);height:50px;opacity:1"',
  '<a data-logo="true" class="relative block z-20 w-auto h-20 shrink-0 lg:w-40 lg:h-fit text-foreground pointer-events-auto" style="will-change: transform, opacity; translate: none; rotate: none; scale: none; transform: translate(0px, 0px); height: auto; opacity: 1;"'
);

// 2. Update SVG style in header
html = html.replace(
  '<svg width="118" height="142" viewBox="0 0 118 142" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto" style="translate:none;rotate:none;scale:none;transform:translate(0%,-26.0563%)">',
  '<svg width="118" height="142" viewBox="0 0 118 142" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px);">'
);

// 3. Update text in header logo
html = html.replace(
  '<g id="text" style="opacity:0">',
  '<g id="text" style="opacity: 1;">'
);

// 4. Update head in header logo
html = html.replace(
  '<g id="head" style="opacity:0">',
  '<g id="head" style="opacity: 1;">'
);

// 5. Update right-horn in header logo
html = html.replace(
  '<g id="right-horn" style="translate:none;rotate:none;scale:none;transform-origin:0px 0px" data-svg-origin="74.9833755493164 37.707801818847656" transform="matrix(1,0,0,1,-24,0)">',
  '<g id="right-horn" data-svg-origin="74.9833755493164 37.707801818847656" transform="matrix(1,0,0,1,0,0)" style="translate: none; rotate: none; scale: none; transform-origin: 0px 0px;">'
);

// 6. Update global-nav
html = html.replace(
  '<div data-global-nav="true" class="relative w-full justify-end lg:absolute lg:top-0 lg:right-0 z-10 flex h-12 lg:h-15 items-center gap-1 pointer-events-none" style="will-change:transform,opacity;translate:none;rotate:none;scale:none;opacity:1;transform:translate(0px,0px)">',
  '<div data-global-nav="true" class="relative w-full justify-end lg:absolute lg:top-0 lg:right-0 z-10 flex h-12 lg:h-15 items-center gap-1 pointer-events-none" style="will-change: transform, opacity; translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, -150px);">'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html initial header styles!');
