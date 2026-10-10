const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find all corrupt style attributes with images=""
console.log('Broken attributes before fix:');
const matches = [...html.matchAll(/background:url\([^\)]*\)[^"']*/g)];
matches.forEach(m => console.log(m[0].slice(0, 80)));

// Clean fix: background:url(/images/img_X_bg.png) center center / 100% 100% no-repeat scroll content-box rgba(0,0,0,0) !important;
// Inside style attributes in HTML, quotes should either be single quotes or no quotes in url(...)
html = html.replace(/background:url\([^\)]*img_46_bg\.png[^\)]*\)[^"]*/g, 'background:url(/images/img_46_bg.png) center center / 100% 100% no-repeat scroll content-box rgba(0,0,0,0) !important;');
html = html.replace(/background:url\([^\)]*img_47_bg\.png[^\)]*\)[^"]*/g, 'background:url(/images/img_47_bg.png) center center / 100% 100% no-repeat scroll content-box rgba(0,0,0,0) !important;');
html = html.replace(/background:url\([^\)]*img_48_bg\.png[^\)]*\)[^"]*/g, 'background:url(/images/img_48_bg.png) center center / 100% 100% no-repeat scroll content-box rgba(0,0,0,0) !important;');
html = html.replace(/background:url\([^\)]*img_49_bg\.png[^\)]*\)[^"]*/g, 'background:url(/images/img_49_bg.png) center center / 100% 100% no-repeat scroll content-box rgba(0,0,0,0) !important;');
html = html.replace(/background:url\([^\)]*img_50_bg\.png[^\)]*\)[^"]*/g, 'background:url(/images/img_50_bg.png) center center / 100% 100% no-repeat scroll content-box rgba(0,0,0,0) !important;');

// Check for any remaining '=""' or invalid quotes
html = html.replace(/images=""/g, '');
html = html.replace(/center=""/g, '');
html = html.replace(/100%=""/g, '');
html = html.replace(/100%no-repeat=""/g, '');
html = html.replace(/scroll=""/g, '');
html = html.replace(/content-box=""/g, '');
html = html.replace(/rgba\(0,0,0,0\)!important"=""/g, '');

fs.writeFileSync('index.html', html);
console.log('Fixed broken attributes in index.html');
