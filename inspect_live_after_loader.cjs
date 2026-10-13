const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_after_loader_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9260',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9260/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      // Wait 4.5 seconds for complete animation
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const preloader = document.querySelector('.z-9999');
                const hero = document.querySelector('[data-home-hero]');
                const header = document.querySelector('header');
                const title = document.querySelector('[data-title]');
                const bottle = document.querySelector('[data-bottle]');
                const banner = document.querySelector('[data-top-banner], [data-announcement-bar], a[href*="3-pack"]');
                return {
                  preloader: preloader ? {
                    display: window.getComputedStyle(preloader).display,
                    opacity: window.getComputedStyle(preloader).opacity,
                    pointerEvents: window.getComputedStyle(preloader).pointerEvents,
                    styleAttr: preloader.getAttribute('style')
                  } : null,
                  header: header ? {
                    display: window.getComputedStyle(header).display,
                    opacity: window.getComputedStyle(header).opacity,
                    transform: window.getComputedStyle(header).transform,
                    top: window.getComputedStyle(header).top,
                    pointerEvents: window.getComputedStyle(header).pointerEvents,
                    styleAttr: header.getAttribute('style')
                  } : null,
                  hero: hero ? {
                    opacity: window.getComputedStyle(hero).opacity,
                    transform: window.getComputedStyle(hero).transform,
                    styleAttr: hero.getAttribute('style')
                  } : null,
                  title: title ? {
                    opacity: window.getComputedStyle(title).opacity,
                    transform: window.getComputedStyle(title).transform,
                    styleAttr: title.getAttribute('style')
                  } : null,
                  bottle: bottle ? {
                    opacity: window.getComputedStyle(bottle).opacity,
                    transform: window.getComputedStyle(bottle).transform,
                    styleAttr: bottle.getAttribute('style')
                  } : null
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 5000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live styles AFTER loader finishes:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
