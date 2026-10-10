const { spawn } = require('child_process');
const path = require('path');

const tmpDir = path.join(process.env.TEMP, 'chrome_live_inspect2_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9224',
  'https://buckssauce.com/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9224/json');
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
              (function() {
                // Check GSAP ScrollTriggers
                const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
                  trigger: st.trigger?.tagName + (st.trigger?.className ? '.' + st.trigger?.className.slice(0, 30) : ''),
                  start: st.start,
                  end: st.end,
                  vars: Object.keys(st.vars || {})
                })) : 'No window.ScrollTrigger';

                // Check card antler animation styles
                const firstCard = document.querySelector('[data-listing-card]');
                const antlers = firstCard ? {
                  left: firstCard.querySelector('[data-left-antler]')?.getAttribute('style'),
                  right: firstCard.querySelector('[data-right-antler]')?.getAttribute('style')
                } : null;

                // Check parallax food styles
                const parallaxFood = Array.from(document.querySelectorAll('[data-parallax-food]')).slice(0, 3).map(el => ({
                  speed: el.getAttribute('data-parallax-speed'),
                  style: el.getAttribute('style')
                }));

                // Check title on scroll
                const titles = Array.from(document.querySelectorAll('[data-gsap-title-on-scroll]')).map(t => ({
                  text: t.innerText?.trim(),
                  style: t.getAttribute('style')
                }));

                // Check header elements
                const header = document.querySelector('header');
                const navLinks = Array.from(header?.querySelectorAll('a, button') || []).map(a => a.innerText?.trim());

                return { triggers, antlers, parallaxFood, titles, navLinks };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 4000);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2) {
        console.log('Live site inspection result:\n', JSON.stringify(msg.result?.result?.value, null, 2));
        chrome.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 3000);
