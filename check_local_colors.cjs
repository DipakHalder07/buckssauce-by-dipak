const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_local_colors_' + Date.now());

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
              (function() {
                const test = (cls) => {
                  const div = document.createElement('div');
                  div.className = cls;
                  document.body.appendChild(div);
                  const color = window.getComputedStyle(div).backgroundColor;
                  div.remove();
                  return color;
                };
                const circles = Array.from(document.querySelectorAll('[data-circle]')).map(c => ({
                  tag: c.className,
                  color: window.getComputedStyle(c).backgroundColor,
                  width: window.getComputedStyle(c).width,
                  height: window.getComputedStyle(c).height,
                  transform: window.getComputedStyle(c).transform
                }));
                return {
                  gold: test('bg-gold'),
                  orange: test('bg-orange'),
                  red: test('bg-red'),
                  background: test('bg-background'),
                  circles
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 1000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Local Colors:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
