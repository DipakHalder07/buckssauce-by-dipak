const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_loader_anim_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9261',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9261/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

      // Snapshot 1: At 400ms (Circles starting to expand)
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 400);

      // Snapshot 2: At 800ms (Concentric circles mid expansion)
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 11,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 800);

      // Snapshot 3: At 1500ms (Logo and fruits present)
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 12,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 1500);

      // Snapshot 4: At 2200ms (Hold state)
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 13,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 2200);

      // Snapshot 5: At 3200ms (Hero revealed)
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 14,
          method: 'Page.captureScreenshot',
          params: { format: 'png' }
        }));
      }, 3200);
    };

    let count = 0;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id >= 10 && msg.id <= 14) {
        const names = {
          10: 'loader_stage_1_circles_start.png',
          11: 'loader_stage_2_circles_mid.png',
          12: 'loader_stage_3_logo_fruits.png',
          13: 'loader_stage_4_hold.png',
          14: 'loader_stage_5_hero_revealed.png'
        };
        fs.writeFileSync(names[msg.id], Buffer.from(msg.result.data, 'base64'));
        console.log('Saved', names[msg.id]);
        count++;
        if (count === 5) {
          chrome.kill();
          process.exit(0);
        }
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1500);
