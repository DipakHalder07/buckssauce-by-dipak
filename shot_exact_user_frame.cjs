const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_exact_user_view_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9268',
  'http://localhost:3000/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9268/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let reqId = 2000;
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

      // Click next to go to Pineapple Sriracha
      await sendCmd('Runtime.evaluate', {
        expression: `
          const arrows = Array.from(document.querySelectorAll('[data-slider-arrow]')).filter(a => a.closest('[data-home-hero]'));
          arrows[1].click();
        `
      });
      await new Promise(r => setTimeout(r, 1500));

      // Scroll so hero stage is centered like in the user screenshot
      await sendCmd('Runtime.evaluate', {
        expression: `
          const slider = document.querySelector('[data-slider]');
          slider.scrollIntoView({ behavior: 'instant', block: 'center' });
        `
      });
      await new Promise(r => setTimeout(r, 500));

      let shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('exact_user_framed_view.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved exact_user_framed_view.png');

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
