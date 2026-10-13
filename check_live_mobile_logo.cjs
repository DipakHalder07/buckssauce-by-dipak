const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_mobile_logo_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=390,844',
  '--remote-debugging-port=9330',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9330/json');
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
      await new Promise(r => setTimeout(r, 2000));

      const r = await send('Runtime.evaluate', {
        expression: `
          (function() {
            const svg = document.querySelector('.z-9999 [data-logo] svg') || document.querySelector('#bucks-preloader [data-logo] svg');
            return svg ? {
              className: svg.getAttribute('class'),
              style: svg.getAttribute('style'),
              computedWidth: window.getComputedStyle(svg).width,
              computedHeight: window.getComputedStyle(svg).height,
              rect: svg.getBoundingClientRect()
            } : null;
          })()
        `,
        returnByValue: true
      });

      console.log('Mobile LIVE logo:\n', JSON.stringify(r.result?.value, null, 2));
      chrome.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1000);
