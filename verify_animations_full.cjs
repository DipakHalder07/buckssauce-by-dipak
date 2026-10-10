const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const tmpDir = path.join(process.env.TEMP, 'chrome_verify_anim2_' + Date.now());

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-extensions',
  '--no-first-run',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,900',
  '--remote-debugging-port=9232',
  'http://localhost:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9232/json');
    const pages = await res.json();
    const target = pages.find(p => p.url.includes('localhost:5173'));
    if (!target) {
      console.error('Target not found!');
      chrome.kill();
      process.exit(1);
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    const consoleLogs = [];
    const jsErrors = [];

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));

      // Wait 3.2s for preloader to finish
      setTimeout(async () => {
        // Test 1: Check header & desktopNav at top (scrollY = 0)
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (function() {
                const header = document.querySelector('header');
                const banner = document.querySelector('[data-banner]');
                const logo = header?.querySelector('[data-logo]');
                const desktopNav = header?.querySelector('[data-desktop-nav]');
                return {
                  bannerPresent: !!banner,
                  headerTop: window.getComputedStyle(header).top,
                  headerBg: window.getComputedStyle(header).backgroundColor,
                  headerTransform: window.getComputedStyle(header).transform,
                  logoTransform: window.getComputedStyle(logo).transform,
                  desktopNavTransform: desktopNav ? window.getComputedStyle(desktopNav).transform : null,
                  desktopNavOpacity: desktopNav ? window.getComputedStyle(desktopNav).opacity : null,
                  scrollY: window.scrollY
                };
              })()
            `,
            returnByValue: true
          }
        }));

        // Take screenshot at scroll 0 with desktop nav and antlers logo
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 15,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 800);

        // Test 2: Scroll down 250px and check header glassmorphism & desktopNav tuck
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  window.scrollTo({ top: 250, behavior: 'instant' });
                  await new Promise(r => setTimeout(r, 600));
                  const header = document.querySelector('header');
                  const logo = header?.querySelector('[data-logo]');
                  const desktopNav = header?.querySelector('[data-desktop-nav]');
                  return {
                    scrollY: window.scrollY,
                    headerBg: window.getComputedStyle(header).backgroundColor,
                    headerBackdrop: window.getComputedStyle(header).backdropFilter,
                    headerBorder: window.getComputedStyle(header).borderBottomColor,
                    headerBoxShadow: window.getComputedStyle(header).boxShadow,
                    logoTransform: window.getComputedStyle(logo).transform,
                    desktopNavTransform: desktopNav ? window.getComputedStyle(desktopNav).transform : null,
                    desktopNavOpacity: desktopNav ? window.getComputedStyle(desktopNav).opacity : null
                  };
                })()
              `,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 1500);

        // Take screenshot of header with glassmorphism at scroll 250
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 25,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2200);

        // Test 3: Test Section 2 Listing Card antlers pop out on hover
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 30,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (async function() {
                  const card = document.querySelector('[data-listing-card]');
                  card.scrollIntoView();
                  await new Promise(r => setTimeout(r, 600));

                  const beforeHover = {
                    leftAntler: card.querySelector('[data-left-antler]').style.transform,
                    rightAntler: card.querySelector('[data-right-antler]').style.transform
                  };

                  card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                  await new Promise(r => setTimeout(r, 500));

                  const duringHover = {
                    leftAntler: card.querySelector('[data-left-antler]').style.transform,
                    rightAntler: card.querySelector('[data-right-antler]').style.transform,
                    bottleImg: card.querySelector('img')?.style.transform
                  };

                  card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                  await new Promise(r => setTimeout(r, 400));

                  const afterHover = {
                    leftAntler: card.querySelector('[data-left-antler]').style.transform,
                    rightAntler: card.querySelector('[data-right-antler]').style.transform
                  };

                  return { beforeHover, duringHover, duringHoverComputed: window.getComputedStyle(card.querySelector('[data-left-antler]')).transform, afterHover };
                })()
              `,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 3000);

        // Finish after 4.5s
        setTimeout(() => {
          console.log('\n--- Console Logs Recorded ---', consoleLogs);
          console.log('\n--- JS Errors Recorded ---', jsErrors);
          chrome.kill();
          process.exit(0);
        }, 4500);

      }, 3200);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        consoleLogs.push(text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        jsErrors.push(msg.params.exceptionDetails);
      }

      if (msg.id === 10) {
        console.log('\n[TEST 1] Header & DesktopNav at scroll 0:\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id === 15 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'header_at_top.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved header_at_top.png!');
      }
      if (msg.id === 20) {
        console.log('\n[TEST 2] Header after scroll 250px (Frosted glass & desktopNav tucked):\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id === 25 && msg.result?.data) {
        fs.writeFileSync(path.join(__dirname, 'header_scrolled_glass.png'), Buffer.from(msg.result.data, 'base64'));
        console.log('Saved header_scrolled_glass.png!');
      }
      if (msg.id === 30) {
        console.log('\n[TEST 3] Antlers hover test:\n', JSON.stringify(msg.result?.result?.value, null, 2));
      }
    };
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}, 2000);
