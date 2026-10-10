const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_header_children_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9228',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9228/json');
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
                function getInfo() {
                  const logo = document.querySelector('[data-logo]');
                  const logoSvg = logo ? logo.querySelector('svg') : null;
                  const logoText = logo ? logo.querySelector('#text') : null;
                  const desktopNav = document.querySelector('[data-desktop-nav]');
                  const globalNav = document.querySelector('[data-global-nav]');
                  const cartBtn = document.querySelector('[data-cart-button]');
                  const hamburger = document.querySelector('[data-hamburger]');

                  return {
                    scrollY: window.scrollY,
                    logo: {
                      style: logo?.getAttribute('style'),
                      computedH: logo ? window.getComputedStyle(logo).height : null,
                      computedTransform: logo ? window.getComputedStyle(logo).transform : null,
                      svgTransform: logoSvg ? window.getComputedStyle(logoSvg).transform : null,
                      textOpacity: logoText ? window.getComputedStyle(logoText).opacity : null,
                    },
                    desktopNav: {
                      style: desktopNav?.getAttribute('style'),
                      computedOpacity: desktopNav ? window.getComputedStyle(desktopNav).opacity : null,
                      computedTransform: desktopNav ? window.getComputedStyle(desktopNav).transform : null,
                      display: desktopNav ? window.getComputedStyle(desktopNav).display : null,
                    },
                    globalNav: {
                      style: globalNav?.getAttribute('style'),
                      computedOpacity: globalNav ? window.getComputedStyle(globalNav).opacity : null,
                      computedTransform: globalNav ? window.getComputedStyle(globalNav).transform : null,
                    },
                    cartBtn: {
                      style: cartBtn?.getAttribute('style'),
                      computedOpacity: cartBtn ? window.getComputedStyle(cartBtn).opacity : null,
                    },
                    hamburger: {
                      style: hamburger?.getAttribute('style'),
                      computedOpacity: hamburger ? window.getComputedStyle(hamburger).opacity : null,
                    }
                  };
                }

                const at0 = getInfo();
                window.scrollTo({ top: 400, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));
                const at400 = getInfo();

                window.scrollTo({ top: 0, behavior: 'instant' });
                await new Promise(r => setTimeout(r, 600));
                const backAt0 = getInfo();

                return { at0, at400, backAt0 };
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
        console.log('Result:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
