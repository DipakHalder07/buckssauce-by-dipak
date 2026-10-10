const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_loader_anim_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9245',
  'https://buckssauce.com/'
]);

const samples = [];
let startTime = 0;

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9245/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('buckssauce.com'));
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      startTime = Date.now();

      let checkCount = 0;
      const timer = setInterval(() => {
        checkCount++;
        const elapsed = Date.now() - startTime;
        if (elapsed > 2800) {
          clearInterval(timer);
          fs.writeFileSync(path.join(__dirname, 'loader_animation_samples.json'), JSON.stringify(samples, null, 2));
          console.log(`Saved ${samples.length} animation samples!`);
          chrome.kill();
          process.exit(0);
          return;
        }

        ws.send(JSON.stringify({
          id: 1000 + checkCount,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const loader = document.querySelector('.z-9999');
                if (!loader) return { removed: true };
                const circles = Array.from(loader.querySelectorAll('[data-circle]')).map(c => ({
                  cls: c.className.slice(0, 30),
                  transform: c.style.transform
                }));
                const logo = loader.querySelector('[data-logo]');
                const foods = Array.from(loader.querySelectorAll('[data-food]')).map(f => ({
                  transform: f.style.transform,
                  opacity: f.style.opacity
                }));
                return {
                  loaderOpacity: loader.style.opacity,
                  circles,
                  logo: {
                    transform: logo?.style.transform,
                    opacity: logo?.style.opacity
                  },
                  foods
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 100);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id >= 1000) {
        samples.push({ id: msg.id - 1000, time: Date.now() - startTime, value: msg.result?.result?.value });
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
