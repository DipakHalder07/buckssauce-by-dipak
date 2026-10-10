const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_header_els_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9231',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9231/json');
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
              (async function() {
                const header = document.querySelector('header');
                const getHeaderEls = () => {
                  return Array.from(header.querySelectorAll('a, button, [data-desktop-nav], [data-hamburger]')).map(el => ({
                    tag: el.tagName,
                    text: el.innerText.trim().slice(0, 30),
                    classes: el.className?.slice(0, 40),
                    style: el.getAttribute('style'),
                    display: window.getComputedStyle(el).display,
                    opacity: window.getComputedStyle(el).opacity,
                    transform: window.getComputedStyle(el).transform
                  }));
                };

                const at0 = getHeaderEls();
                window.scrollTo(0, 400);
                await new Promise(r => setTimeout(r, 600));
                const at400 = getHeaderEls();

                return { at0, at400 };
              })()
            `,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      }, 4000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live header elements at 0 vs 400:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
