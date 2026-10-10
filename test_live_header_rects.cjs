const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_rect_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9234',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9234/json');
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
                function getRects() {
                  const header = document.querySelector('header');
                  const logo = document.querySelector('[data-logo]');
                  const gNav = document.querySelector('[data-global-nav]');
                  const dNav = document.querySelector('[data-desktop-nav]');
                  const banner = document.querySelector('[data-banner]');
                  return {
                    scrollY: window.scrollY,
                    headerRect: header?.getBoundingClientRect(),
                    logoRect: logo?.getBoundingClientRect(),
                    gNavRect: gNav?.getBoundingClientRect(),
                    dNavRect: dNav?.getBoundingClientRect(),
                    bannerRect: banner?.getBoundingClientRect(),
                  };
                }

                const at0 = getRects();
                window.scrollTo({ top: 300, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));
                const at300 = getRects();

                return { at0, at300 };
              })()
            `,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      }, 5000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live Rects:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
