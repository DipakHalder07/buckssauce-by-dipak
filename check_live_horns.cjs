const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_horns_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9325',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9325/json');
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
      await new Promise(r => setTimeout(r, 2200));

      const r = await send('Runtime.evaluate', {
        expression: `
          (function() {
            const svg = document.querySelector('.z-9999 [data-logo] svg') || document.querySelector('#bucks-preloader [data-logo] svg');
            const leftHorn = svg ? svg.querySelector('#left-horn') : null;
            const rightHorn = svg ? svg.querySelector('#right-horn') : null;
            const head = svg ? svg.querySelector('#head') : null;
            const bucks = svg ? svg.querySelector('#bucks') : null;
            const sauce = svg ? svg.querySelector('#sauce') : null;

            return {
              svgOuter: svg ? svg.outerHTML.slice(0, 300) : null,
              leftHorn: leftHorn ? {
                styleAttr: leftHorn.getAttribute('style'),
                opacity: window.getComputedStyle(leftHorn).opacity,
                transform: window.getComputedStyle(leftHorn).transform
              } : null,
              rightHorn: rightHorn ? {
                styleAttr: rightHorn.getAttribute('style'),
                opacity: window.getComputedStyle(rightHorn).opacity,
                transform: window.getComputedStyle(rightHorn).transform
              } : null
            };
          })()
        `,
        returnByValue: true
      });

      console.log('LIVE Horns in browser:\n', JSON.stringify(r.result?.value, null, 2));
      chrome.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1000);
