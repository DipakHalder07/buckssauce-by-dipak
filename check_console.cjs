const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_console_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9247',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9247/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    const logs = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Let page run 4 seconds
      setTimeout(() => {
        console.log('Console check complete, collected logs:', logs.length);
        logs.forEach(l => console.log('LOG:', l));
        chrome.kill();
        process.exit(0);
      }, 4500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        logs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value || a.description).join(' ') });
      }
      if (msg.method === 'Log.entryAdded') {
        logs.push({ level: msg.params.entry.level, text: msg.params.entry.text });
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
