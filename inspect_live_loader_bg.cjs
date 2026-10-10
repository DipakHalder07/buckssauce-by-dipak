const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_loader_bg_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9247',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9247/json');
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
                const loader = document.querySelector('.z-9999');
                const circles = loader?.querySelector('[data-circles-wrapper]');
                const bgCircle = loader?.querySelector('[data-circle-background]');
                return {
                  loaderBg: loader ? window.getComputedStyle(loader).backgroundColor : null,
                  circlesWrapperBg: circles ? window.getComputedStyle(circles).backgroundColor : null,
                  bgCircleBg: bgCircle ? window.getComputedStyle(bgCircle).backgroundColor : null,
                  bodyBg: window.getComputedStyle(document.body).backgroundColor,
                  htmlBg: window.getComputedStyle(document.documentElement).backgroundColor
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
        console.log('Live loader background result:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
