const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_test_rect_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9235',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9235/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (async function() {
                function rectToObj(r) {
                  if (!r) return null;
                  return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, bottom: r.bottom };
                }
                function getRects() {
                  const header = document.querySelector('header');
                  const logo = document.querySelector('[data-logo]');
                  const gNav = document.querySelector('[data-global-nav]');
                  const dNav = document.querySelector('[data-desktop-nav]');
                  return {
                    scrollY: window.scrollY,
                    header: rectToObj(header?.getBoundingClientRect()),
                    logo: rectToObj(logo?.getBoundingClientRect()),
                    gNav: rectToObj(gNav?.getBoundingClientRect()),
                    dNav: rectToObj(dNav?.getBoundingClientRect()),
                  };
                }

                const at0 = getRects();
                window.scrollTo({ top: 400, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 800));
                const at400 = getRects();

                return { at0, at400 };
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
      if (msg.id === 3) {
        console.log('Live Rects:\n', JSON.stringify(msg.result?.result?.value, null, 2));

        // Take screenshot of live header at 400
        ws.send(JSON.stringify({
          id: 4,
          method: 'Page.captureScreenshot',
          params: {
            clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
          }
        }));
      } else if (msg.id === 4) {
        fs.writeFileSync('live_header_scrolled_visible.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved live_header_scrolled_visible.png');
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
