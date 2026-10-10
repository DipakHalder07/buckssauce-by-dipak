const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_loader_' + Date.now());

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

    let reqId = 300;
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

      // Navigate to localhost
      await sendCmd('Page.navigate', { url: 'http://localhost:5173/' });

      // Frame 1: at 600ms (Fruits orbiting around logo)
      await new Promise(r => setTimeout(r, 600));
      let shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/loader_stage_1.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/loader_stage_1.png');

      // Frame 2: at 1700ms (Revealers expanding)
      await new Promise(r => setTimeout(r, 1100));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/loader_stage_2.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/loader_stage_2.png');

      // Frame 3: at 2700ms (Hero entrance completed)
      await new Promise(r => setTimeout(r, 1000));
      shot = await sendCmd('Page.captureScreenshot');
      fs.writeFileSync('tools/loader_stage_3.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved tools/loader_stage_3.png');

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
