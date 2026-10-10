const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const images = [
  'pineapple-2.webp',
  'habanero-2.webp',
  'cherry-2.webp',
  'peach-2.webp'
];

async function download() {
  for (const img of images) {
    const url = `https://buckssauce.com/images/${img}`;
    console.log(`Downloading ${url}...`);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const dest = path.join(publicDir, img);
        fs.writeFileSync(dest, Buffer.from(buf));
        console.log(`Saved ${dest} (${buf.byteLength} bytes)`);
      } else {
        console.error(`Failed ${url}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`Error downloading ${img}:`, err.message);
    }
  }
}

download();
