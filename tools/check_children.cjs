const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_profile_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--user-data-dir=${tmpDir}`,
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const pages = await res.json();
    const page = pages.find(p => p.url.includes('localhost:5173'));

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: 'document.getElementById("root")?.children?.length',
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      console.log('Children count:', JSON.parse(event.data).result?.result?.value);
      chrome.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error('Error:', e);
    chrome.kill();
  }
}, 3000);
