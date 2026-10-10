const urls = [
  'http://localhost:5173/node_modules/.vite/deps/lenis.js?v=b6deb38f',
  'http://localhost:5173/node_modules/.vite/deps/gsap.js?v=0fd70613',
  'http://localhost:5173/node_modules/.vite/deps/gsap_ScrollTrigger.js?v=360bc9e8',
  'http://localhost:5173/node_modules/.vite/deps/canvas-confetti.js?v=cfb5a99e'
];

Promise.all(urls.map(async u => {
  const r = await fetch(u);
  console.log(u.split('/').pop().split('?')[0], 'status:', r.status);
})).then(() => console.log('Done testing deps'));
