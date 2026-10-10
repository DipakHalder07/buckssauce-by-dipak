const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_wave_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9222',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const pages = await res.json();
    const target = pages.find(p => p.type === 'page');

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let reqId = 400;
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
      await sendCmd('Page.enable');

      await sendCmd('Page.navigate', { url: 'http://localhost:5173/' });

      // Wave shot at 1750ms
      await new Promise(r => setTimeout(r, 1750));
      let shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/loader_wave.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/loader_wave.png');

      // Hero landing shot at 2400ms
      await new Promise(r => setTimeout(r, 650));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/loader_hero_landing.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/loader_hero_landing.png');

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
