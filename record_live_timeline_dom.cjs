const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_record_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9265',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9265/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let id = 100;
    const send = (m, p) => new Promise(r => {
      const cur = ++id;
      const h = e => {
        const d = JSON.parse(e.data);
        if (d.id === cur) {
          ws.removeEventListener('message', h);
          r(d.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    ws.onopen = async () => {
      await send('Runtime.enable');
      console.log('Connected to live site, recording state at intervals...');

      const sample = async (timeLabel) => {
        const r = await send('Runtime.evaluate', {
          expression: `
            (function() {
              const preloader = document.querySelector('.z-9999') || document.querySelector('#bucks-preloader');
              const wrapper = preloader ? preloader.querySelector('[data-circles-wrapper]') : null;
              const logo = preloader ? preloader.querySelector('[data-logo]') : null;
              const foods = preloader ? Array.from(preloader.querySelectorAll('[data-food]')) : [];
              const hero = document.querySelector('[data-home-hero]');
              const header = document.querySelector('header');
              const title = document.querySelector('[data-title]');
              const bottle = document.querySelector('[data-bottle]');

              return {
                time: "${timeLabel}",
                preloader: preloader ? {
                  className: preloader.className,
                  styleAttr: preloader.getAttribute('style'),
                  computedOpacity: window.getComputedStyle(preloader).opacity,
                  computedDisplay: window.getComputedStyle(preloader).display,
                  computedPointerEvents: window.getComputedStyle(preloader).pointerEvents
                } : null,
                wrapperMask: wrapper ? {
                  mask: wrapper.style.maskImage || wrapper.style.webkitMaskImage
                } : null,
                logo: logo ? {
                  styleAttr: logo.getAttribute('style'),
                  computedTransform: window.getComputedStyle(logo).transform,
                  computedOpacity: window.getComputedStyle(logo).opacity
                } : null,
                foods: foods.map(f => ({
                  styleAttr: f.getAttribute('style'),
                  computedTransform: window.getComputedStyle(f).transform,
                  computedTop: window.getComputedStyle(f).top,
                  computedLeft: window.getComputedStyle(f).left,
                  computedOpacity: window.getComputedStyle(f).opacity
                })),
                header: header ? {
                  styleAttr: header.getAttribute('style'),
                  computedTop: window.getComputedStyle(header).top,
                  computedOpacity: window.getComputedStyle(header).opacity,
                  computedTransform: window.getComputedStyle(header).transform
                } : null,
                hero: hero ? {
                  styleAttr: hero.getAttribute('style'),
                  computedOpacity: window.getComputedStyle(hero).opacity,
                  computedTransform: window.getComputedStyle(hero).transform
                } : null
              };
            })()
          `,
          returnByValue: true
        });
        return r?.result?.value;
      };

      await new Promise(r => setTimeout(r, 1200));
      const t1 = await sample('1200ms');
      console.log('--- 1200ms ---');
      console.log(JSON.stringify(t1, null, 2));

      await new Promise(r => setTimeout(r, 1200));
      const t2 = await sample('2400ms');
      console.log('--- 2400ms ---');
      console.log(JSON.stringify(t2, null, 2));

      await new Promise(r => setTimeout(r, 1000));
      const t3 = await sample('3400ms');
      console.log('--- 3400ms ---');
      console.log(JSON.stringify(t3, null, 2));

      await new Promise(r => setTimeout(r, 1000));
      const t4 = await sample('4400ms');
      console.log('--- 4400ms ---');
      console.log(JSON.stringify(t4, null, 2));

      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 1000);
