const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_find_y_def_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9345',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9345/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let id = 100;
    const send = (m, p) => new Promise(r => {
      const cur = ++id;
      const h = e => {
        const d = JSON.parse(e.data);
        if (d.id === cur) { ws.removeEventListener('message', h); r(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    ws.onopen = async () => {
      await send('Runtime.enable');
      const r = await send('Runtime.evaluate', {
        expression: `
          (async function() {
            const url = 'https://buckssauce.com/_next/static/chunks/388c8b79f4bf6619.js?dpl=dpl_9ZZA3NxAiGDkunrFn3uhJ92DoT2i';
            const text = await (await fetch(url)).text();
            const idx = text.indexOf('B.current.map(y)');
            // Search backwards for y= or function y
            const before = text.slice(Math.max(0, idx - 4000), idx);
            return before;
          })()
        `,
        awaitPromise: true,
        returnByValue: true
      });

      fs.writeFileSync('before_y.txt', r.result?.value || '');
      console.log('Saved before_y.txt');
      chrome.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1000);
