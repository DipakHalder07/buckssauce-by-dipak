const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_cycle_' + Date.now());

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

    let reqId = 100;
    const sendCmd = (method, params) => {
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

      // Click arrow once
      let res = await sendCmd('Runtime.evaluate', {
        expression: `
          (() => {
            const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
            arrows[1].click();
            return 'Clicked 1st time';
          })()
        `,
        returnByValue: true
      });
      console.log('1st click:', res.result?.value);

      // Wait 800ms
      await new Promise(r => setTimeout(r, 800));

      // Click arrow second time
      res = await sendCmd('Runtime.evaluate', {
        expression: `
          (() => {
            const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
            arrows[1].click();
            return 'Clicked 2nd time';
          })()
        `,
        returnByValue: true
      });
      console.log('2nd click:', res.result?.value);

      // Wait 800ms and capture screenshot
      await new Promise(r => setTimeout(r, 800));
      let shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/hero_prod_2_fixed.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/hero_prod_2_fixed.png');

      // Click arrow third time
      res = await sendCmd('Runtime.evaluate', {
        expression: `
          (() => {
            const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
            arrows[1].click();
            return 'Clicked 3rd time';
          })()
        `,
        returnByValue: true
      });
      console.log('3rd click:', res.result?.value);

      // Wait 800ms and capture screenshot
      await new Promise(r => setTimeout(r, 800));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/hero_prod_3_fixed.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/hero_prod_3_fixed.png');

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
