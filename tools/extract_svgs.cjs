const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
const svgs = [];
let match;
while ((match = svgRegex.exec(html)) !== null) {
  const s = match[0];
  const aria = s.match(/aria-label=["']([^"']+)["']/i);
  const cls = s.match(/class=["']([^"']+)["']/i);
  const viewBox = s.match(/viewBox=["']([^"']+)["']/i);
  svgs.push({
    length: s.length,
    viewBox: viewBox ? viewBox[1] : '',
    aria: aria ? aria[1] : '',
    cls: cls ? cls[1] : '',
    raw: s
  });
}

console.log(`Found ${svgs.length} SVG elements.`);

// Save icons to a dedicated icons component or json
fs.writeFileSync('extracted_svgs.json', JSON.stringify(svgs, null, 2));

// Let's identify key SVGs
const uniqueByViewBox = {};
svgs.forEach(s => {
  if (!uniqueByViewBox[s.viewBox] || uniqueByViewBox[s.viewBox].length < s.length) {
    uniqueByViewBox[s.viewBox] = s;
  }
});
console.log('Unique viewBoxes:', Object.keys(uniqueByViewBox));
