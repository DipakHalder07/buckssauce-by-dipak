const { spawn } = require('child_process');
const path = require('path');

function measureUrl(url, port) {
  return new Promise(async (resolve, reject) => {
    const tmpDir = path.join(process.env.TEMP, 'chrome_measure_' + Date.now() + '_' + Math.random().toString(36).substring(7));
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless=new',
      '--disable-extensions',
      '--no-first-run',
      `--user-data-dir=${tmpDir}`,
      '--window-size=1440,900',
      `--remote-debugging-port=${port}`,
      url
    ]);

    setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const pages = await res.json();
        const target = pages[0];
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
                    const headerLogo = document.querySelector('header [data-logo]');
                    const headerSvg = headerLogo?.querySelector('svg');
                    const preloader = document.querySelector('#bucks-preloader') || document.querySelector('[data-preloader]');
                    const preloaderLogo = preloader?.querySelector('[data-logo]');
                    const preloaderSvg = preloaderLogo?.querySelector('svg');

                    return {
                      url: location.href,
                      headerLogoRect: headerLogo ? {
                        width: headerLogo.getBoundingClientRect().width,
                        height: headerLogo.getBoundingClientRect().height,
                        top: headerLogo.getBoundingClientRect().top,
                        left: headerLogo.getBoundingClientRect().left
                      } : null,
                      headerSvgRect: headerSvg ? {
                        width: headerSvg.getBoundingClientRect().width,
                        height: headerSvg.getBoundingClientRect().height
                      } : null,
                      headerLogoComputed: headerLogo ? {
                        width: getComputedStyle(headerLogo).width,
                        height: getComputedStyle(headerLogo).height,
                        transform: getComputedStyle(headerLogo).transform,
                        scale: getComputedStyle(headerLogo).scale
                      } : null,
                      headerSvgComputed: headerSvg ? {
                        width: getComputedStyle(headerSvg).width,
                        height: getComputedStyle(headerSvg).height
                      } : null,
                      preloaderLogoRect: preloaderLogo ? {
                        width: preloaderLogo.getBoundingClientRect().width,
                        height: preloaderLogo.getBoundingClientRect().height
                      } : null,
                      preloaderSvgRect: preloaderSvg ? {
                        width: preloaderSvg.getBoundingClientRect().width,
                        height: preloaderSvg.getBoundingClientRect().height
                      } : null,
                      preloaderSvgComputed: preloaderSvg ? {
                        width: getComputedStyle(preloaderSvg).width,
                        height: getComputedStyle(preloaderSvg).height
                      } : null
                    };
                  })()
                `,
                returnByValue: true
              }
            }));
          }, 3500);
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === 2) {
            chrome.kill();
            resolve(msg.result?.result?.value);
          }
        };
      } catch (err) {
        chrome.kill();
        reject(err);
      }
    }, 2500);
  });
}

async function run() {
  console.log('1. Measuring LIVE SITE...');
  try {
    const live = await measureUrl('https://buckssauce.com/', 9401);
    console.log('LIVE MEASUREMENT:', JSON.stringify(live, null, 2));
  } catch(e) {
    console.error('Live error:', e.message);
  }

  console.log('2. Measuring LOCAL SITE...');
  try {
    const local = await measureUrl('http://localhost:5173/', 9402);
    console.log('LOCAL MEASUREMENT:', JSON.stringify(local, null, 2));
  } catch(e) {
    console.error('Local error:', e.message);
  }
}

run();
