const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_scroll_fx_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9227',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9227/json');
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
                const results = {};

                // 1. Scroll to section 1 (Clean Ingredients stacked cards)
                const sec1 = document.querySelectorAll('section')[1];
                if (sec1) {
                  sec1.scrollIntoView();
                  await new Promise(r => setTimeout(r, 600));
                  const cards = Array.from(sec1.querySelectorAll('[data-card]')).map(c => ({
                    transform: c.style.transform,
                    computedTransform: window.getComputedStyle(c).transform
                  }));
                  results.sec1Cards = cards;
                }

                // 2. Scroll to section 2 (Choose your weapon)
                const sec2 = document.querySelectorAll('section')[2];
                if (sec2) {
                  sec2.scrollIntoView();
                  await new Promise(r => setTimeout(r, 600));
                  const titles = Array.from(sec2.querySelectorAll('[data-gsap-title-on-scroll]')).map(t => ({
                    text: t.innerText.trim(),
                    transform: t.style.transform,
                    opacity: t.style.opacity
                  }));
                  const cards = Array.from(sec2.querySelectorAll('[data-listing-card]')).map(c => ({
                    transform: c.style.transform,
                    opacity: c.style.opacity
                  }));
                  results.sec2 = { titles, cards };
                }

                // 3. Scroll to section 3 (Build your 3 pack)
                const sec3 = document.querySelectorAll('section')[3];
                if (sec3) {
                  sec3.scrollIntoView();
                  await new Promise(r => setTimeout(r, 600));
                  const title = sec3.querySelector('[data-gsap-title-on-scroll]');
                  results.sec3Title = {
                    text: title?.innerText?.trim(),
                    transform: title?.style.transform,
                    opacity: title?.style.opacity
                  };
                }

                return results;
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
        console.log('Scroll effects inspection result:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
