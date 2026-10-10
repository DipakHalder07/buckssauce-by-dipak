const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_main_style_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9248',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9248/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const hero = document.querySelector('[data-home-hero]');
                const main = document.querySelector('main');
                const title = document.querySelector('[data-title]');
                const bottle = document.querySelector('[data-bottle]');
                return {
                  mainOpacity: main ? window.getComputedStyle(main).opacity : null,
                  heroOpacity: hero ? window.getComputedStyle(hero).opacity : null,
                  titleOpacity: title ? window.getComputedStyle(title).opacity : null,
                  bottleOpacity: bottle ? window.getComputedStyle(bottle).opacity : null,
                  loaderZIndex: window.getComputedStyle(document.querySelector('.z-9999')).zIndex
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 500);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live initial hero styles during loader:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
