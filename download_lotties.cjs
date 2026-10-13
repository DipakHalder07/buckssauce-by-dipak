const fs = require('fs');
const path = require('path');

const lotties = [
  'heart_eyes.lottie',
  'sassy.lottie',
  'grinning.lottie',
  'spiral_eyes.lottie',
  'cool.lottie',
  'sweating.lottie',
  'fire_breathing.lottie'
];

async function downloadLotties() {
  const dir = path.join(__dirname, 'public', 'lotties');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const name of lotties) {
    const url = `https://buckssauce.com/lotties/${name}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(dir, name), buf);
        console.log(`Downloaded ${name}: ${buf.length} bytes`);
      } else {
        console.log(`Failed ${name}: status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${name}:`, e.message);
    }
  }
}

downloadLotties();
