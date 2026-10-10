const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('home.html', 'utf8');
const assetsDir = path.join(__dirname, 'public', 'images');

// Parse all <img> elements and their surrounding context
const imgTagRegex = /<img([^>]+)>/gi;
let match;
let count = 0;
const imageMap = {};

while ((match = imgTagRegex.exec(html)) !== null) {
  count++;
  const tagAttrs = match[1];
  const srcMatch = tagAttrs.match(/src=[\"']?(data:image\/([a-zA-Z0-9+]+);base64,([A-Za-z0-9+/=]+))[\"']?/i);
  const altMatch = tagAttrs.match(/alt=[\"']?([^\"'>\s]*)[\"']?/i);
  const classMatch = tagAttrs.match(/class=[\"']?([^\"'>]+)[\"']?/i);
  const widthMatch = tagAttrs.match(/width=[\"']?(\d+)[\"']?/i);
  const heightMatch = tagAttrs.match(/height=[\"']?(\d+)[\"']?/i);

  // find surrounding 300 chars context before the img tag
  const startPos = Math.max(0, match.index - 300);
  const context = html.substring(startPos, match.index);
  const dataContext = context.match(/data-[a-z0-9-]+(?:=\"[^\"]*\")?/gi) || [];

  if (srcMatch) {
    const format = srcMatch[2];
    const b64 = srcMatch[3];
    const alt = altMatch ? altMatch[1] : '';
    const w = widthMatch ? widthMatch[1] : '';
    const h = heightMatch ? heightMatch[1] : '';
    const contextStr = dataContext.join(' ');

    const key = srcMatch[1].slice(0, 100);
    if (!imageMap[key]) {
      const imgId = Object.keys(imageMap).length + 1;
      let filename = `img_${imgId}.${format === 'jpeg' ? 'jpg' : format}`;
      
      // Determine descriptive name if possible
      let descriptive = '';
      if (alt) descriptive = alt.toLowerCase().replace(/[^a-z0-9]/g, '_');
      else if (contextStr.includes('bottle')) descriptive = `bottle_${imgId}`;
      else if (contextStr.includes('fruit')) descriptive = `fruit_${imgId}`;
      else if (contextStr.includes('card')) descriptive = `card_${imgId}`;
      else descriptive = `asset_${imgId}`;

      const finalName = `${imgId}_${descriptive}.${format === 'jpeg' ? 'jpg' : format}`;
      const filePath = path.join(assetsDir, finalName);
      fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));

      imageMap[key] = {
        id: imgId,
        fileName: finalName,
        alt,
        width: w,
        height: h,
        format,
        context: contextStr
      };
    }
  }
}

// Check CSS background images
const cssBgRegex = /(--sf-img-\d+|url\(["']?(data:image\/([a-zA-Z0-9+]+);base64,([A-Za-z0-9+/=]+))["']?\))/gi;
let bgMatch;
while ((bgMatch = cssBgRegex.exec(html)) !== null) {
  if (bgMatch[2]) {
    const key = bgMatch[2].slice(0, 100);
    if (!imageMap[key]) {
      const imgId = Object.keys(imageMap).length + 1;
      const format = bgMatch[3];
      const finalName = `${imgId}_bg.${format === 'jpeg' ? 'jpg' : format}`;
      fs.writeFileSync(path.join(assetsDir, finalName), Buffer.from(bgMatch[4], 'base64'));
      imageMap[key] = {
        id: imgId,
        fileName: finalName,
        format,
        context: 'css-background'
      };
    }
  }
}

console.log(`Saved ${Object.keys(imageMap).length} unique images to public/images/`);
fs.writeFileSync('extracted_images_meta.json', JSON.stringify(imageMap, null, 2));

