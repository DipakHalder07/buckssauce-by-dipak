const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_hero_' + Date.now());

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

      // Helper function to evaluate code and wait
      const evalAndShot = (expr, filename, delay = 1200) => {
        return new Promise(resolve => {
          if (expr) {
            ws.send(JSON.stringify({
              id: 10,
              method: 'Runtime.evaluate',
              params: { expression: expr, returnByValue: true }
            }));
          }
          setTimeout(() => {
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === 20 && msg.result?.data) {
                fs.writeFileSync(`tools/${filename}`, Buffer.from(msg.result.data, 'base64'));
                console.log(`Saved tools/${filename}`);
                ws.removeEventListener('message', handler);
                resolve();
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot' }));
          }, delay);
        });
      };

      (async () => {
        // Initial hero
        await evalAndShot(null, 'hero_prod_0.png', 500);

        // Click next arrow -> Product 1 (Pineapple Sriracha)
        await evalAndShot(`
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `, 'hero_prod_1.png', 1200);

        // Click next arrow -> Product 2 (Habanero Garlic)
        await evalAndShot(`
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `, 'hero_prod_2.png', 1200);

        // Click next arrow -> Product 3 (Cherry Garlic)
        await evalAndShot(`
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `, 'hero_prod_3.png', 1200);

        console.log('All hero product transitions tested!');
        chrome.kill();
        process.exit(0);
      })();
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
