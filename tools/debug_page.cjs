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
    if (!page) {
      console.log('No page found');
      chrome.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: '({ root: document.getElementById("root")?.innerHTML, title: document.title })', returnByValue: true }
      }));
    };

    ws.onmessage = (event) => {
      console.log('CDP message:', event.data);
      chrome.kill();
      process.exit(0);
    };
  } catch (e) {
    console.error('Error:', e);
    chrome.kill();
  }
}, 2000);
