const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'test_eval_' + Date.now());
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9270',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9270/json');
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
                const c = document.querySelector('[data-circle-gold]');
                gsap.set(c, { xPercent: -50, yPercent: -50, scale: 0.5, transformOrigin: '50% 50%' });
                const r = c.getBoundingClientRect();
                return {
                  style: c.getAttribute('style'),
                  rect: {
                    left: r.left,
                    top: r.top,
                    width: r.width,
                    height: r.height,
                    centerX: r.left + r.width / 2,
                    centerY: r.top + r.height / 2
                  }
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 1000);
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
}, 1500);
