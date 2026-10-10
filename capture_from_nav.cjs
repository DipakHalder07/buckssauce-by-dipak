const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_local_timeline_nav_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9277',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9277/json');
    const pages = await res.json();
    const ws = new WebSocket(pages[0].webSocketDebuggerUrl);

    let id = 1;
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      ws.send(JSON.stringify({
        id: id++,
        method: 'Page.navigate',
        params: { url: 'http://localhost:5173/' }
      }));
    };

    let count = 0;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.frameNavigated' && !msg.params.frame.parentId) {
        console.log('Navigated, starting rapid capture...');
        const timer = setInterval(() => {
          if (count >= 16) {
            clearInterval(timer);
            setTimeout(() => {
              chrome.kill();
              process.exit(0);
            }, 500);
            return;
          }
          const c = count++;
          ws.send(JSON.stringify({
            id: 200 + c,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 150);
      }
      if (msg.id >= 200 && msg.id < 300 && msg.result?.data) {
        const idx = msg.id - 200;
        const filename = `nav_frame_${idx.toString().padStart(2, '0')}.png`;
        fs.writeFileSync(path.join(__dirname, filename), Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved ${filename}`);
      }
    };
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 800);
