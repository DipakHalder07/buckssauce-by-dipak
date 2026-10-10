const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_vis_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9236',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9236/json');
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
                window.scrollTo({ top: 400, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 800));

                const header = document.querySelector('header');
                const gNav = document.querySelector('[data-global-nav]');
                const getSauce = gNav?.querySelector('a');
                const cart = document.querySelector('[data-cart-button]');
                const burger = document.querySelector('[data-hamburger]');

                return {
                  headerOpacity: window.getComputedStyle(header).opacity,
                  headerVisibility: window.getComputedStyle(header).visibility,
                  headerDisplay: window.getComputedStyle(header).display,
                  gNavOpacity: window.getComputedStyle(gNav).opacity,
                  gNavVisibility: window.getComputedStyle(gNav).visibility,
                  gNavTransform: window.getComputedStyle(gNav).transform,
                  getSauceHTML: getSauce?.outerHTML?.slice(0, 300),
                  getSauceRect: getSauce?.getBoundingClientRect(),
                  cartRect: cart?.getBoundingClientRect(),
                  burgerRect: burger?.getBoundingClientRect()
                };
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
        console.log('Visibility details:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
