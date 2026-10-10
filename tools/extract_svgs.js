const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

// Find all unique SVGs
const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
const svgs = [];
let match;
while ((match = svgRegex.exec(html)) !== null) {
  const s = match[0];
  // extract class, id or aria-label
  const aria = s.match(/aria-label=["']([^"']+)["']/i);
  const cls = s.match(/class=["']([^"']+)["']/i);
  const w = s.match(/width=["']([^"']+)["']/i);
  const h = s.match(/height=["']([^"']+)["']/i);
  svgs.push({
    length: s.length,
    snippet: s.slice(0, 100),
    aria: aria ? aria[1] : '',
    cls: cls ? cls[1] : '',
    w: w ? w[1] : '',
    h: h ? h[1] : '',
    raw: s
  });
}

console.log(`Found ${svgs.length} SVG elements.`);

// Group or find important SVGs:
// 1. Logo
const logo = svgs.find(s => s.cls.includes('w-15') || s.raw.includes('Bucks') || s.raw.includes('data-logo') || s.length > 5000);
if (logo) console.log('Logo SVG found, length:', logo.length);

fs.writeFileSync('extracted_svgs.json', JSON.stringify(svgs.map(s => ({
  snippet: s.snippet,
  length: s.length,
  cls: s.cls,
  raw: s.raw
})), null, 2));

