const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_burst_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9251',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9251/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

      // Capture at exactly 2050ms (during burst)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2050);

      setTimeout(() => {
        chrome.kill();
        process.exit(0);
      }, 2600);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'exact_burst_moment.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved exact_burst_moment.png!');
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1500);
