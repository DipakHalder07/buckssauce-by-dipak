const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function inspectLogo(url, port) {
  const tmpDir = path.join(process.env.TEMP, 'chrome_logo_' + port + '_' + Date.now());
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
          // Wait 2000ms so preloader logo has appeared and settled
          await new Promise(r => setTimeout(r, 2000));

          const r = await send('Runtime.evaluate', {
            expression: `
              (function() {
                const preloader = document.querySelector('.z-9999') || document.querySelector('#bucks-preloader');
                const logoContainer = preloader ? preloader.querySelector('[data-logo]') : null;
                const svg = logoContainer ? logoContainer.querySelector('svg') : null;
                const foods = preloader ? Array.from(preloader.querySelectorAll('[data-food]')) : [];
                
                return {
                  preloaderRect: preloader ? preloader.getBoundingClientRect() : null,
                  logoContainer: logoContainer ? {
                    className: logoContainer.className,
                    styleAttr: logoContainer.getAttribute('style'),
                    rect: logoContainer.getBoundingClientRect(),
                    computed: {
                      display: window.getComputedStyle(logoContainer).display,
                      position: window.getComputedStyle(logoContainer).position,
                      top: window.getComputedStyle(logoContainer).top,
                      left: window.getComputedStyle(logoContainer).left,
                      width: window.getComputedStyle(logoContainer).width,
                      height: window.getComputedStyle(logoContainer).height,
                      transform: window.getComputedStyle(logoContainer).transform,
                      transformOrigin: window.getComputedStyle(logoContainer).transformOrigin
                    }
                  } : null,
                  svg: svg ? {
                    className: svg.getAttribute('class'),
                    widthAttr: svg.getAttribute('width'),
                    heightAttr: svg.getAttribute('height'),
                    viewBox: svg.getAttribute('viewBox'),
                    styleAttr: svg.getAttribute('style'),
                    rect: svg.getBoundingClientRect(),
                    computed: {
                      width: window.getComputedStyle(svg).width,
                      height: window.getComputedStyle(svg).height,
                      maxHeight: window.getComputedStyle(svg).maxHeight
                    }
                  } : null,
                  foods: foods.map((f, i) => {
                    const img = f.querySelector('img');
                    return {
                      index: i,
                      className: f.className,
                      rect: f.getBoundingClientRect(),
                      computed: {
                        width: window.getComputedStyle(f).width,
                        height: window.getComputedStyle(f).height,
                        top: window.getComputedStyle(f).top,
                        bottom: window.getComputedStyle(f).bottom,
                        left: window.getComputedStyle(f).left,
                        right: window.getComputedStyle(f).right
                      },
                      img: img ? {
                        src: img.getAttribute('src'),
                        rect: img.getBoundingClientRect(),
                        widthAttr: img.getAttribute('width'),
                        heightAttr: img.getAttribute('height'),
                        computedWidth: window.getComputedStyle(img).width,
                        computedHeight: window.getComputedStyle(img).height
                      } : null
                    };
                  })
                };
              })()
            `,
            returnByValue: true
          });

          chrome.kill();
          resolve(r.result?.value);
        };
      } catch(e) {
        chrome.kill();
        resolve({ error: e.message });
      }
    }, 1500);
  });
}

(async () => {
  console.log('Inspecting live site...');
  const live = await inspectLogo('https://buckssauce.com/', 9310);
  console.log('Inspecting local site...');
  const local = await inspectLogo('http://localhost:3000/', 9311);

  fs.writeFileSync('compare_loader_logo_and_foods.json', JSON.stringify({ live, local }, null, 2));
  console.log('Saved compare_loader_logo_and_foods.json');
})();
