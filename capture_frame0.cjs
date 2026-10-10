const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_frame0_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9255'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9255/json');
    const pages = await res.json();
    const target = pages[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));
    };

    let count = 0;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.frameNavigated') {
        // Take screenshot at 10ms, 50ms, 100ms
        [10, 30, 60, 100].forEach((delay, i) => {
          setTimeout(() => {
            ws.send(JSON.stringify({ id: 100 + i, method: 'Page.captureScreenshot', params: { format: 'png' } }));
          }, delay);
        });
      }
      if (msg.id >= 100 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, `frame_init_${msg.id - 100}.png`), Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved frame_init_${msg.id - 100}.png`);
        count++;
        if (count >= 4) {
          chrome.kill();
          process.exit(0);
        }
      }
    };
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 1000);
