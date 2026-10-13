const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_dl_lotties_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9265',
  'https://buckssauce.com/'
]);

const lotties = [
  'heart_eyes.lottie',
  'sassy.lottie',
  'grinning.lottie',
  'spiral_eyes.lottie',
  'cool.lottie',
  'sweating.lottie',
  'fire_breathing.lottie'
];

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9265/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      setTimeout(async () => {
        const outDir = path.join(__dirname, 'public', 'lotties');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        for (const name of lotties) {
          await new Promise(resolve => {
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === 100 && msg.result?.result?.value) {
                const b64 = msg.result.result.value;
                const buf = Buffer.from(b64, 'base64');
                fs.writeFileSync(path.join(outDir, name), buf);
                console.log(`Saved ${name}, size: ${buf.length} bytes`);
                ws.removeEventListener('message', handler);
                resolve();
              } else if (msg.id === 100) {
                console.log(`Failed ${name}:`, msg.result);
                ws.removeEventListener('message', handler);
                resolve();
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({
              id: 100,
              method: 'Runtime.evaluate',
              params: {
                expression: `
                  (async function() {
                    const r = await fetch('/lotties/${name}');
                    if (!r.ok) return null;
                    const ab = await r.arrayBuffer();
                    const bytes = new Uint8Array(ab);
                    let binary = '';
                    for (let i = 0; i < bytes.byteLength; i++) {
                      binary += String.fromCharCode(bytes[i]);
                    }
                    return btoa(binary);
                  })()
                `,
                awaitPromise: true,
                returnByValue: true
              }
            }));
          });
          // small pause
          await new Promise(r => setTimeout(r, 300));
        }

        chrome.kill();
        process.exit(0);
      }, 5000);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
