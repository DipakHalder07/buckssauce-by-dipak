const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

const imgRegex = /<img\s+([^>]+)>/gi;
let match;
let i = 0;
while ((match = imgRegex.exec(html)) !== null) {
  i++;
  const attrs = match[1];
  const alt = attrs.match(/alt=([^\s>]+|"[^"]*")/i);
  const width = attrs.match(/width=([^\s>]+|"[^"]*")/i);
  const height = attrs.match(/height=([^\s>]+|"[^"]*")/i);
  const cls = attrs.match(/class=([^\s>]+|"[^"]*")/i);
  const src = attrs.match(/src=([^\s>]+|"[^"]*")/i);
  const srcType = src ? (src[1].startsWith('"data:image') || src[1].startsWith('data:image') ? src[1].slice(0, 30) : src[1]) : 'none';
  
  // Also look at parent or ancestor tags
  const start = Math.max(0, match.index - 150);
  const end = Math.min(html.length, match.index + match[0].length + 150);
  const context = html.substring(start, end).replace(/\n/g, ' ');

  console.log(`IMG #${i}: w=${width ? width[1] : ''} h=${height ? height[1] : ''} alt=${alt ? alt[1] : ''} class=${cls ? cls[1] : ''} src=${srcType}`);
}
