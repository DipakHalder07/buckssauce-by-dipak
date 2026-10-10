const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_header_scroll_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9226',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9226/json');
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
                const banner = document.querySelector('[data-banner]');
                const logo = header?.querySelector('svg, img, [data-logo]');
                const nav = header?.querySelector('[data-desktop-nav]');

                const state0 = {
                  scrollY: window.scrollY,
                  headerClass: header?.className,
                  headerStyle: header?.getAttribute('style'),
                  headerComputed: window.getComputedStyle(header).backgroundColor,
                  headerTransform: window.getComputedStyle(header).transform
                };

                window.scrollTo({ top: 400, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));

                const stateDown400 = {
                  scrollY: window.scrollY,
                  headerStyle: header?.getAttribute('style'),
                  headerTransform: window.getComputedStyle(header).transform,
                  headerTop: window.getComputedStyle(header).top
                };

                window.scrollTo({ top: 1200, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));

                const stateDown1200 = {
                  scrollY: window.scrollY,
                  headerStyle: header?.getAttribute('style'),
                  headerTransform: window.getComputedStyle(header).transform,
                  headerTop: window.getComputedStyle(header).top
                };

                window.scrollTo({ top: 900, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));

                const stateUp900 = {
                  scrollY: window.scrollY,
                  headerStyle: header?.getAttribute('style'),
                  headerTransform: window.getComputedStyle(header).transform,
                  headerTop: window.getComputedStyle(header).top
                };

                return { state0, stateDown400, stateDown1200, stateUp900 };
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
        console.log('Header scroll result:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
