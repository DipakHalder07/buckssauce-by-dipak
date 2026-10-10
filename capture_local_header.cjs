const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_local_header_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9230',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9230/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Wait 3s for loader to finish
      setTimeout(async () => {
        // Screenshot at scroll 0
        ws.send(JSON.stringify({
          id: 10,
          method: 'Page.captureScreenshot',
          params: {
            clip: { x: 0, y: 0, width: 1440, height: 260, scale: 1 }
          }
        }));
      }, 3500);
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10) {
        fs.writeFileSync('local_header_scroll_0.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved local_header_scroll_0.png');

        // Scroll to 400
        ws.send(JSON.stringify({
          id: 11,
          method: 'Runtime.evaluate',
          params: { expression: 'window.scrollTo(0, 400);' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 12,
            method: 'Page.captureScreenshot',
            params: {
              clip: { x: 0, y: 0, width: 1440, height: 260, scale: 1 }
            }
          }));
        }, 800);
      } else if (msg.id === 12) {
        fs.writeFileSync('local_header_scroll_400.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved local_header_scroll_400.png');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
