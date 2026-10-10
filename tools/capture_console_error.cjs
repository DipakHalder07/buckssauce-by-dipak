const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_cdp_profile_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--user-data-dir=${tmpDir}`,
  '--remote-debugging-port=9222',
  'about:blank'
]);

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const data = await res.json();
      if (data && data[0] && data[0].webSocketDebuggerUrl) {
        return data[0].webSocketDebuggerUrl;
      }
    } catch (e) {}
  }
  return null;
}

getWsUrl().then(async (wsUrl) => {
  if (!wsUrl) {
    chrome.kill();
    return;
  }
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
    ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
    ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));
  };
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Log.entryAdded') {
      console.log('LOG:', msg.params.entry);
    }
  };

  setTimeout(() => {
    chrome.kill();
    process.exit(0);
  }, 4000);
});
