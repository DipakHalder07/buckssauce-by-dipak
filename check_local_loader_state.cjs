const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'test_loader_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9258',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9258/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (() => {
                const p = document.getElementById("bucks-preloader");
                const c = Array.from(p.querySelectorAll("[data-circle]")).map(el => ({
                  cls: el.className,
                  style: el.getAttribute("style"),
                  transform: window.getComputedStyle(el).transform,
                  rect: el.getBoundingClientRect()
                }));
                return {
                  pStyle: p.getAttribute("style"),
                  pBg: window.getComputedStyle(p).backgroundColor,
                  circles: c
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 400);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 2) {
        console.log(JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 1000);
