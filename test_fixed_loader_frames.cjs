const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_fixed_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9277',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9277/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

      // Checkpoint 1: 50ms (open moment)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 50);

      // Checkpoint 2: 400ms (circles expanding)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 400);

      // Checkpoint 3: 1300ms (logo in center)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 30, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1300);

      // Checkpoint 4: 1800ms (hold / floating with fruits)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 40, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1800);

      // Checkpoint 5: 3200ms (revealed hero & header)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 50, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 3200);

      setTimeout(() => {
        chrome.kill();
        process.exit(0);
      }, 3800);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'fix_frame_1_open.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved fix_frame_1_open.png');
      }
      if (msg.id === 20 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'fix_frame_2_circles.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved fix_frame_2_circles.png');
      }
      if (msg.id === 30 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'fix_frame_3_logo.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved fix_frame_3_logo.png');
      }
      if (msg.id === 40 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'fix_frame_4_hold.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved fix_frame_4_hold.png');
      }
      if (msg.id === 50 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'fix_frame_5_hero.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved fix_frame_5_hero.png');
      }
    };
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 1200);
