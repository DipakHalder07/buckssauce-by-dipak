const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_clean_timeline_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9280',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9280/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    if (!target) {
      console.error('Target not found');
      chrome.kill();
      process.exit(1);
    }
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      // Reload page now that WebSocket is attached so we catch the animation from 0ms!
      ws.send(JSON.stringify({ id: 2, method: 'Page.reload' }));
    };

    let count = 0;
    const delays = [150, 350, 600, 1000, 1500, 2000, 2600];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        // Page reload initiated, schedule frame captures from here!
        delays.forEach((delay, idx) => {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 100 + idx,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, delay);
        });
      }
      if (msg.id >= 100 && msg.result?.data) {
        const idx = msg.id - 100;
        const fname = `loader_clean_shot_${idx}.png`;
        fs.writeFileSync(path.join(__dirname, fname), Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved ${fname} at ${delays[idx]}ms`);
        count++;
        if (count >= delays.length) {
          setTimeout(() => {
            chrome.kill();
            process.exit(0);
          }, 300);
        }
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 800);
