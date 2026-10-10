const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('loader_fruits_base64.json', 'utf8'));
const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true });

Object.keys(data).forEach(key => {
  const base64Str = data[key];
  const b64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
  const buf = Buffer.from(b64Data, 'base64');
  const filePath = path.join(publicImagesDir, `${key}-loader.webp`);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved ${filePath} (${buf.length} bytes)`);
});
