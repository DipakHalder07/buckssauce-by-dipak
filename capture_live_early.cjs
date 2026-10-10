const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'live_early_frames');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const tmpDir = path.join(process.env.TEMP, 'chrome_live_early_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9265',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9265/json');
    const pages = await res.json();
    const ws = new WebSocket(pages[0].webSocketDebuggerUrl);

    let id = 1;
    ws.onopen = async () => {
      ws.send(JSON.stringify({ id: id++, method: 'Page.enable' }));
      
      // Navigate to buckssauce.com
      ws.send(JSON.stringify({
        id: id++,
        method: 'Page.navigate',
        params: { url: 'https://buckssauce.com/' }
      }));
    };

    let count = 0;
    ws.onmessage = async (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Page.frameNavigated' && !msg.params.frame.parentId) {
        console.log('Navigated! Starting rapid capture...');
        const timer = setInterval(() => {
          if (count >= 15) {
            clearInterval(timer);
            setTimeout(() => { chrome.kill(); process.exit(0); }, 500);
            return;
          }
          const c = count++;
          ws.send(JSON.stringify({
            id: 200 + c,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 120);
      }
      if (msg.id >= 200 && msg.id < 300 && msg.result?.data) {
        const idx = msg.id - 200;
        fs.writeFileSync(path.join(outDir, `early_${idx.toString().padStart(2, '0')}.png`), Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved early_${idx}.png`);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 800);
