const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_circle_burst_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9265',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9265/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

      [150, 300, 450, 650].forEach((t, idx) => {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20 + idx,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, t);
      });
    };

    let count = 0;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id >= 20 && msg.id <= 23) {
        const ms = [150, 300, 450, 650][msg.id - 20];
        fs.writeFileSync(`circle_anim_${ms}ms.png`, Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved circle_anim_${ms}ms.png`);
        count++;
        if (count === 4) {
          chrome.kill();
          process.exit(0);
        }
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1000);
