const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_cycle_clicks_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9267',
  'http://localhost:3000/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9267/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let reqId = 1000;
    const sendCmd = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = ++reqId;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    ws.onopen = async () => {
      await sendCmd('Runtime.enable');
      await new Promise(r => setTimeout(r, 5200));

      for (let step = 0; step < 4; step++) {
        const check = await sendCmd('Runtime.evaluate', {
          expression: `
            (() => {
              const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
              const numSpan = document.querySelector('[data-product-number]');
              const activeBottle = Array.from(document.querySelectorAll('[data-bottle]')).findIndex(b => Number(getComputedStyle(b).opacity) > 0.5);
              arrows[1].click();
              return { activeBottle, numSpan: numSpan?.innerText };
            })()
          `,
          returnByValue: true
        });
        console.log(`Step ${step} click:`, check.result?.value);
        await new Promise(r => setTimeout(r, 1600));

        let shot = await sendCmd('Page.captureScreenshot');
        fs.writeFileSync(`cycle_step_${step}.png`, Buffer.from(shot.data, 'base64'));
      }

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
