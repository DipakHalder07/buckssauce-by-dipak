const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_frame_timeline_' + Date.now());

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
    const delays = [100, 300, 600, 1000, 1500, 2000, 2500];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.frameNavigated') {
        delays.forEach((delay, i) => {
          setTimeout(() => {
            ws.send(JSON.stringify({ id: 100 + i, method: 'Page.captureScreenshot', params: { format: 'png' } }));
          }, delay);
        });
      }
      if (msg.id >= 100 && msg.result?.data) {
        const frameIdx = msg.id - 100;
        fs.writeFileSync(path.join(__dirname, `timeline_shot_${frameIdx}.png`), Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved timeline_shot_${frameIdx}.png (delay: ${delays[frameIdx]}ms)`);
        count++;
        if (count >= delays.length) {
          setTimeout(() => {
            chrome.kill();
            process.exit(0);
          }, 300);
        }
      }
    };
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 1000);
