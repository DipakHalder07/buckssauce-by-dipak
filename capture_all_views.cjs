const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_profile_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      const capture = (scrollY, filename) => {
        return new Promise(resolve => {
          ws.send(JSON.stringify({
            id: 10,
            method: 'Runtime.evaluate',
            params: { expression: `window.scrollTo(0, ${scrollY});` }
          }));
          setTimeout(() => {
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === 20 && msg.result?.data) {
                fs.writeFileSync(`tools/${filename}`, Buffer.from(msg.result.data, 'base64'));
                ws.removeEventListener('message', handler);
                resolve();
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot' }));
          }, 600);
        });
      };

      (async () => {
        await capture(0, 'view_0_hero.png');
        await capture(1600, 'view_1_ingredients.png');
        await capture(2800, 'view_2_weapons.png');
        await capture(4200, 'view_3_bundle.png');
        await capture(5400, 'view_4_whybucks.png');
        await capture(6600, 'view_5_reviews.png');
        console.log('All section screenshots captured successfully!');
        chrome.kill();
        process.exit(0);
      })();
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
