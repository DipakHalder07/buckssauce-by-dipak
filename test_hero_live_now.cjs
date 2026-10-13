const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_hero_now_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9255',
  'http://localhost:3000/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9255/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:3000'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

      // Wait 6 seconds for preloader to finish, then take screenshot
      setTimeout(() => {
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === 20 && msg.result?.data) {
            fs.writeFileSync('hero_after_preloader.png', Buffer.from(msg.result.data, 'base64'));
            console.log('Saved hero_after_preloader.png');
            ws.removeEventListener('message', handler);
            chrome.kill();
            process.exit(0);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot' }));
      }, 6000);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
