const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_local_timeline_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9250',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9250/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

      const checkpoints = [50, 150, 300, 500, 800, 1200, 1600, 2000];
      checkpoints.forEach((ms, idx) => {
        setTimeout(() => {
          ws.send(JSON.stringify({ id: 100 + idx, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, ms);
      });

      setTimeout(() => {
        chrome.kill();
        process.exit(0);
      }, 2600);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id >= 100 && msg.result?.data) {
        const idx = msg.id - 100;
        const filename = `local_timeline_${idx}.png`;
        fs.writeFileSync(path.join(__dirname, filename), Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved ${filename}`);
      }
    };
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 1500);
