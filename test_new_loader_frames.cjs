const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_loader_new_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9246',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9246/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));

      // Frame 1: at 0.5s (Entrance)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 500);

      // Frame 2: at 1.2s (Hold / Floating)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 20, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1200);

      // Frame 3: at 2.2s (Burst exit)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 30, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2200);

      // Frame 4: at 2.8s (Hero landing)
      setTimeout(() => {
        ws.send(JSON.stringify({ id: 40, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 2800);

      setTimeout(() => {
        chrome.kill();
        process.exit(0);
      }, 3500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'new_loader_stage_entrance.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved new_loader_stage_entrance.png');
      }
      if (msg.id === 20 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'new_loader_stage_hold.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved new_loader_stage_hold.png');
      }
      if (msg.id === 30 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'new_loader_stage_burst.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved new_loader_stage_burst.png');
      }
      if (msg.id === 40 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'new_loader_stage_hero.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved new_loader_stage_hero.png');
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1500);
