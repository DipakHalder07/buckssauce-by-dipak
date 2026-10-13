const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function extractParallaxFoods(url, port) {
  const tmpDir = path.join(process.env.TEMP, 'chrome_pfoods_' + port + '_' + Date.now());
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-extensions',
    '--no-first-run',
    `--user-data-dir=${tmpDir}`,
    '--window-size=1440,900',
    `--remote-debugging-port=${port}`,
    url
  ]);

  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const pages = await res.json();
        const target = pages.find(p => p.type === 'page' || p.url.includes('buckssauce'));
        const ws = new WebSocket(target.webSocketDebuggerUrl);

        let id = 100;
        const send = (m, p) => new Promise(r => {
          const cur = ++id;
          const h = e => {
            const d = JSON.parse(e.data);
            if (d.id === cur) { ws.removeEventListener('message', h); r(d.result); }
          };
          ws.addEventListener('message', h);
          ws.send(JSON.stringify({ id: cur, method: m, params: p }));
        });

        ws.onopen = async () => {
          await send('Runtime.enable');
          await new Promise(r => setTimeout(r, 4500)); // wait for loader to end and page to render

          const r = await send('Runtime.evaluate', {
            expression: `
              (function() {
                const items = Array.from(document.querySelectorAll('[data-parallax-food]'));
                return items.map((el, i) => {
                  const img = el.querySelector('img');
                  const inner = el.querySelector('[data-parallax-food-inner]');
                  const parentSection = el.closest('section');
                  const rect = el.getBoundingClientRect();
                  return {
                    index: i,
                    section: parentSection ? parentSection.getAttribute('data-section') || parentSection.className.slice(0, 30) : 'none',
                    outerClass: el.className,
                    dataAttrs: {
                      shouldAnimate: el.getAttribute('data-should-animate'),
                      speed: el.getAttribute('data-parallax-speed'),
                      amplitude: el.getAttribute('data-parallax-float-amplitude'),
                      mouseForce: el.getAttribute('data-parallax-mouse-force'),
                      distance: el.getAttribute('data-parallax-distance')
                    },
                    rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
                    computedOuter: {
                      width: window.getComputedStyle(el).width,
                      height: window.getComputedStyle(el).height,
                      position: window.getComputedStyle(el).position
                    },
                    img: img ? {
                      src: img.getAttribute('src'),
                      className: img.className,
                      widthAttr: img.getAttribute('width'),
                      heightAttr: img.getAttribute('height'),
                      computedWidth: window.getComputedStyle(img).width,
                      computedHeight: window.getComputedStyle(img).height
                    } : null
                  };
                });
              })()
            `,
            returnByValue: true
          });

          chrome.kill();
          resolve(r.result?.value || []);
        };
      } catch(e) {
        chrome.kill();
        resolve({ error: e.message });
      }
    }, 1500);
  });
}

(async () => {
  console.log('Extracting live parallax foods...');
  const live = await extractParallaxFoods('https://buckssauce.com/', 9350);
  console.log('Extracting local parallax foods...');
  const local = await extractParallaxFoods('http://localhost:3000/', 9351);

  fs.writeFileSync('compare_parallax_foods.json', JSON.stringify({ live, local }, null, 2));
  console.log('Saved compare_parallax_foods.json, live count:', live.length, 'local count:', local.length);
})();
