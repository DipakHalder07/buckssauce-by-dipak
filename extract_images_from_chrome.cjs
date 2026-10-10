const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_extract_imgs_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9243',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9243/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async function() {
                const getBase64 = (img) => {
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    return canvas.toDataURL('image/webp');
                  } catch (e) {
                    return null;
                  }
                };

                const loaderImgs = Array.from(document.querySelectorAll('.z-9999 img'));
                const results = {};
                for (const img of loaderImgs) {
                  const src = img.src;
                  if (src.includes('pineapple')) results.pineapple = getBase64(img);
                  if (src.includes('habanero')) results.habanero = getBase64(img);
                  if (src.includes('cherry')) results.cherry = getBase64(img);
                  if (src.includes('peach')) results.peach = getBase64(img);
                }
                return results;
              })()
            `,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      }, 1000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        const val = msg.result?.result?.value || {};
        console.log('Got base64 results:', Object.keys(val));
        const outPath = path.join(__dirname, 'loader_fruits_base64.json');
        fs.writeFileSync(outPath, JSON.stringify(val, null, 2));
        console.log('Saved loader_fruits_base64.json!');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
