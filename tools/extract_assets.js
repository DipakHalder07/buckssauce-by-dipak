const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('home.html', 'utf8');

// Find all data:image/ or data:font/
console.log('Extracting assets...');

// Create assets directory
const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(publicDir, 'images');
const fontsDir = path.join(publicDir, 'fonts');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

// Extract fonts
const fontRegex = /@font-face\s*\{([^}]+)\}/gi;
let fMatch;
let fontIdx = 0;
while ((fMatch = fontRegex.exec(html)) !== null) {
  const content = fMatch[1];
  const nameMatch = content.match(/font-family:\s*['"]?([^'";}]+)['"]?/i);
  const urlMatch = content.match(/url\((data:font\/[^;]+;base64,([^)]+))\)/i);
  if (urlMatch) {
    fontIdx++;
    const fontName = (nameMatch ? nameMatch[1] : `font_${fontIdx}`).replace(/\s+/g, '_');
    const ext = urlMatch[1].includes('woff2') ? 'woff2' : 'woff';
    const fontPath = path.join(fontsDir, `${fontName}.${ext}`);
    const buffer = Buffer.from(urlMatch[2], 'base64');
    fs.writeFileSync(fontPath, buffer);
    console.log(`Saved font: ${fontName}.${ext} (${buffer.length} bytes)`);
  }
}

// Find all unique images
const imgMatches = html.matchAll(/(data:image\/([a-zA-Z0-9+]+);base64,([A-Za-z0-9+/=]+))/gi);
const uniqueImages = new Map();
let imgCounter = 0;
for (const m of imgMatches) {
  const raw = m[1];
  const type = m[2];
  const b64 = m[3];
  if (!uniqueImages.has(raw)) {
    imgCounter++;
    uniqueImages.set(raw, { id: imgCounter, type, b64 });
  }
}
console.log(`Found ${uniqueImages.size} unique data:image strings`);

