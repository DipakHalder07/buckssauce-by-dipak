const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_check_circles_eval_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9263',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9263/json');
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
                const circles = Array.from(document.querySelectorAll('[data-circle]')).map(c => ({
                  cls: c.className,
                  w: window.getComputedStyle(c).width,
                  h: window.getComputedStyle(c).height,
                  bg: window.getComputedStyle(c).backgroundColor,
                  opacity: window.getComputedStyle(c).opacity,
                  transform: window.getComputedStyle(c).transform,
                  zIndex: window.getComputedStyle(c).zIndex
                }));
                const wrapper = document.querySelector('[data-circles-wrapper]');
                const preloader = document.getElementById('bucks-preloader');
                return {
                  preloaderZ: window.getComputedStyle(preloader).zIndex,
                  preloaderBg: window.getComputedStyle(preloader).backgroundColor,
                  wrapperMask: wrapper ? wrapper.style.maskImage : null,
                  wrapperW: wrapper ? window.getComputedStyle(wrapper).width : null,
                  wrapperH: wrapper ? window.getComputedStyle(wrapper).height : null,
                  circles
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
        console.log('Circles Animation at 500ms:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 1000);
