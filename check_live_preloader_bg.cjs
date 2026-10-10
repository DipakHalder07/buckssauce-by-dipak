const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_preloader_bg_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9262',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9262/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

      // Immediately check preloader in first 100ms
      ws.send(JSON.stringify({
        id: 3,
        method: 'Runtime.evaluate',
        params: {
          expression: `
            (function() {
              const p = document.getElementById('bucks-preloader') || document.querySelector('[aria-hidden=\"true\"].z-9999');
              const cw = p?.querySelector('[data-circles-wrapper]');
              const cGold = p?.querySelector('[data-circle-gold]');
              return {
                pClass: p?.className,
                pStyle: p?.getAttribute('style'),
                pBg: p ? window.getComputedStyle(p).backgroundColor : null,
                cwBg: cw ? window.getComputedStyle(cw).backgroundColor : null,
                cGoldW: cGold ? window.getComputedStyle(cGold).width : null,
                cGoldH: cGold ? window.getComputedStyle(cGold).height : null,
                cGoldTransform: cGold ? window.getComputedStyle(cGold).transform : null,
              };
            })()
          `,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 3) {
        console.log('Live Preloader Initial:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 500);
