const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_net_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Network.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.reload' }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Network.responseReceived') {
        const u = msg.params.response.url;
        if (u.includes('interactive') || u.includes('.js')) {
          console.log('NET RES:', msg.params.response.status, u);
        }
      }
      if (msg.method === 'Network.loadingFailed') {
        console.log('NET FAILED:', msg.params.errorText, msg.params.requestId);
      }
    };

    setTimeout(() => {
      chrome.kill();
      process.exit(0);
    }, 4000);
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1500);
