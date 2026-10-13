import './index.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// 1. Lenis Smooth Scrolling with GSAP ScrollTrigger Integration
// =========================================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// =========================================================================
// 2. Hero 4-Product Carousel
// =========================================================================
const products = [
  {
    index: 0,
    number: '1',
    name: 'Smoked Peach Chipotle',
    color: '#ef8f4a',
    bgRgb: 'rgb(239, 143, 74)',
    url: 'https://buckssauce.com/shop/smoked-peach-chipotle'
  },
  {
    index: 1,
    number: '2',
    name: 'Crushed Pineapple Sriracha',
    color: '#be8d3f',
    bgRgb: 'rgb(190, 141, 63)',
    url: 'https://buckssauce.com/shop/crushed-pineapple-sriracha'
  },
  {
    index: 2,
    number: '3',
    name: 'Crushed Habanero Garlic',
    color: '#f15726',
    bgRgb: 'rgb(241, 87, 38)',
    url: 'https://buckssauce.com/shop/crushed-habanero-garlic'
  },
  {
    index: 3,
    number: '4',
    name: 'Crushed Cherry Garlic',
    color: '#da1f27',
    bgRgb: 'rgb(218, 31, 39)',
    url: 'https://buckssauce.com/shop/crushed-cherry-garlic'
  }
];

let currentIndex = 0;
let isAnimatingHero = false;
let sliderTimeline = null;

// Hero DOM Elements
const heroSection = document.querySelector('[data-home-hero]');
const bottleShells = heroSection ? heroSection.querySelectorAll('[data-bottle-shell]') : [];
const bottles = Array.from(bottleShells).map(shell => shell.querySelector('[data-bottle]'));

const frontFruitsContainer = heroSection ? heroSection.querySelector('[data-front-fruits]') : null;
const frontFruits = frontFruitsContainer ? Array.from(frontFruitsContainer.children) : [];

const backFruitsContainer = heroSection ? heroSection.querySelector('[data-back-fruits]') : null;
const backFruits = backFruitsContainer ? Array.from(backFruitsContainer.children) : [];

const pNumContainer = heroSection ? heroSection.querySelector('[data-product-numbers]') : null;
const numSpans = pNumContainer ? Array.from(pNumContainer.querySelectorAll('[data-product-number]')) : [];

const pNameContainer = heroSection ? heroSection.querySelector('[data-product-names]') : null;
const nameSpans = pNameContainer ? Array.from(pNameContainer.querySelectorAll('[data-product-name]')) : [];

const bgCircle = heroSection ? heroSection.querySelector('[data-bg-circle]') : null;
const bgCircleInner = heroSection ? heroSection.querySelector('[data-bg-circle-inner]') : null;
const heroCtaLink = heroSection ? heroSection.querySelector('[data-bottom-bar] a') : null;

// Select only Hero slider arrows
const allSliderArrows = document.querySelectorAll('[data-slider-arrow]');
const heroArrows = Array.from(allSliderArrows).filter(arrow => arrow.closest('[data-home-hero]'));

// Background circle idle breathing animation (exact match from buckssauce.com)
const bgCircleTween = bgCircle ? gsap.to(bgCircle, {
  scale: 0.9,
  ease: 'sine.inOut',
  duration: 2,
  repeat: -1,
  yoyo: true,
  paused: true
}) : null;

// Initialize Hero DOM state
function initHero() {
  document.documentElement.style.setProperty('--color-theme', products[0].color);

  // Set all shells to flex pointer-events none
  bottleShells.forEach((shell) => {
    shell.style.display = 'flex';
    shell.style.pointerEvents = 'none';
  });

  // Set bottles: index 0 visible with rotate(5deg), others hidden with scale 0.25
  bottles.forEach((bottle, i) => {
    if (bottle) {
      gsap.set(bottle, {
        opacity: i === 0 ? 1 : 0,
        scale: i === 0 ? 1 : 0.25,
        xPercent: 0,
        rotate: 5,
        transformOrigin: '50% 50%'
      });
    }
  });

  // Set initial fruits
  frontFruits.forEach((fruit, i) => {
    if (fruit) {
      gsap.set(fruit, {
        opacity: i === 0 ? 1 : 0,
        scale: i === 0 ? 1 : 0,
        transformOrigin: '50% 50%'
      });
    }
  });

  backFruits.forEach((fruit, i) => {
    if (fruit) {
      gsap.set(fruit, {
        opacity: i === 0 ? 1 : 0,
        scale: i === 0 ? 1 : 0,
        transformOrigin: '50% 50%'
      });
    }
  });

  // Set initial tickers
  if (pNumContainer) gsap.set(pNumContainer, { yPercent: 0, opacity: 1 });
  numSpans.forEach((span, i) => {
    gsap.set(span, { opacity: i === 0 ? 1 : 0 });
  });

  if (pNameContainer) gsap.set(pNameContainer, { yPercent: 0, opacity: 1 });
  nameSpans.forEach((span, i) => {
    gsap.set(span, { opacity: i === 0 ? 1 : 0 });
  });

  if (bgCircle) {
    gsap.set(bgCircle, { scale: 1, transformOrigin: '50% 50%' });
  }

  if (bgCircleInner) {
    bgCircleInner.style.backgroundColor = products[0].color;
  }

  // Set hero arrows initial state
  heroArrows.forEach((arrow) => {
    gsap.set(arrow, { scale: 1, opacity: 1, transformOrigin: '50% 50%' });
  });

  // Set initial header and banner state (hidden during preloader)
  const header = document.querySelector('header') || document.querySelector('[data-nav]');
  const banner = document.querySelector('aside[data-banner]');
  if (header) {
    header.style.opacity = '0';
    header.style.pointerEvents = 'none';
    header.style.top = banner ? '2.25rem' : '0px';
  }
  if (banner) {
    banner.style.display = 'none';
    banner.style.opacity = '0';
    banner.style.pointerEvents = 'none';
  }
}

// Transition to specific product index (100% exact match from buckssauce.com)
function goToProduct(nextIndex, direction = 1) {
  if (isAnimatingHero || nextIndex === currentIndex) return;
  if (sliderTimeline) sliderTimeline.kill();
  if (bgCircleTween) bgCircleTween.pause();

  const currentCircleScale = bgCircle ? Number(gsap.getProperty(bgCircle, 'scale')) : 1;
  const startCircleScale = Number.isFinite(currentCircleScale) ? currentCircleScale : 1;

  const prevIndex = currentIndex;
  currentIndex = nextIndex;
  const prod = products[currentIndex];

  const oldBottle = bottles[prevIndex];
  const oldFrontFruit = frontFruits[prevIndex];
  const oldBackFruit = backFruits[prevIndex];
  const oldName = nameSpans[prevIndex];
  const oldNum = numSpans[prevIndex];

  const newBottle = bottles[currentIndex];
  const newFrontFruit = frontFruits[currentIndex];
  const newBackFruit = backFruits[currentIndex];
  const newName = nameSpans[currentIndex];
  const newNum = numSpans[currentIndex];

  const P = gsap.timeline({
    delay: 0,
    onStart: () => {
      isAnimatingHero = true;
      document.documentElement.style.setProperty('--color-theme', prod.color);
      if (heroCtaLink) {
        heroCtaLink.href = prod.url;
      }
    },
    onComplete: () => {
      isAnimatingHero = false;
      if (bgCircleTween) bgCircleTween.restart(true);
    }
  });

  sliderTimeline = P;

  // 1. Arrows pop down to scale 0
  if (heroArrows.length) {
    P.to(heroArrows, { scale: 0, duration: 0.45, ease: 'power2.out' }, 'start');
  }

  // 2. Old bottle exits horizontally with scale down and tilt
  if (oldBottle) {
    P.to(oldBottle, {
      scale: 0.25,
      xPercent: 100 * direction,
      rotate: 15 * direction,
      duration: 0.9,
      ease: 'power2.out'
    }, 'start');
    P.to(oldBottle, { opacity: 0, duration: 0.45 }, 'start+=0.25');
  }

  // 3. Background circle compresses inward
  if (bgCircle) {
    P.fromTo(bgCircle,
      { scale: startCircleScale },
      { scale: 0.5, duration: 0.36, ease: 'back.in(1.1)' },
      'start'
    );
  }

  // 4. Old fruits scale down to 0 and fade out
  const oldFruits = [oldBackFruit, oldFrontFruit].filter(Boolean);
  if (oldFruits.length) {
    P.to(oldFruits, {
      scale: 0,
      opacity: 0,
      duration: 0.72,
      stagger: 0,
      ease: 'power2.out'
    }, '<');
  }

  // 5. Old ticker text fades out
  const oldText = [oldName, oldNum].filter(Boolean);
  if (oldText.length) {
    P.to(oldText, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 'start');
  }

  // 6. New bottle enters horizontally from opposite direction
  if (newBottle) {
    P.to(newBottle, { opacity: 1, duration: 0.45 }, 'start');
    P.fromTo(newBottle,
      { scale: 0.25, xPercent: -100 * direction, rotate: -15 * direction },
      { scale: 1, xPercent: 0, rotate: 5, duration: 0.9, ease: 'power2.out' },
      '<'
    );
  }

  // 7. Background circle pops out with juicy spring
  if (bgCircle) {
    P.to(bgCircle, { scale: 1, duration: 0.54, ease: 'back.out(2)' }, 'start+=0.36');
  }

  // 8. Background circle inner background color morphs
  if (bgCircleInner) {
    P.to(bgCircleInner, { backgroundColor: prod.color, ease: 'power2.out', duration: 0.9 }, '<');
  }

  // 9. New fruits spring in with stagger
  const newFruits = [newFrontFruit, newBackFruit].filter(Boolean);
  if (newFruits.length) {
    P.fromTo(newFruits,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.72, stagger: 0.12, ease: 'power2.out' },
      '<'
    );
  }

  // 10. New ticker text fades in
  const newText = [newName, newNum].filter(Boolean);
  if (newText.length) {
    P.fromTo(newText, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 'start');
  }

  // 11. Tickers vertical shift by yPercent
  const tickerContainers = [pNameContainer, pNumContainer].filter(Boolean);
  if (tickerContainers.length) {
    P.to(tickerContainers, {
      yPercent: -100 * currentIndex,
      duration: 0.9,
      ease: 'power2.out'
    }, '<');
  }

  // 12. Arrows pop back up with bouncy ease
  if (heroArrows.length) {
    P.to(heroArrows, { scale: 1, duration: 0.45, ease: 'back.out(2.5)' });
  }

  // Release lock slightly early so responsive clicks are immediately honored
  P.call(() => { isAnimatingHero = false; }, null, 0.85);

  P.play();
}

// Attach Arrow Listeners
if (heroArrows.length >= 2) {
  // Arrow 0 = Prev (Left)
  heroArrows[0].style.cursor = 'pointer';
  heroArrows[0].addEventListener('click', (e) => {
    e.preventDefault();
    const nextIdx = (currentIndex - 1 + products.length) % products.length;
    goToProduct(nextIdx, -1);
  });

  // Arrow 1 = Next (Right)
  heroArrows[1].style.cursor = 'pointer';
  heroArrows[1].addEventListener('click', (e) => {
    e.preventDefault();
    const nextIdx = (currentIndex + 1) % products.length;
    goToProduct(nextIdx, 1);
  });

  // Hover feedback on arrows
  heroArrows.forEach(arrow => {
    arrow.addEventListener('mouseenter', () => {
      if (!isAnimatingHero) {
        gsap.to(arrow, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
      }
    });
    arrow.addEventListener('mouseleave', () => {
      if (!isAnimatingHero) {
        gsap.to(arrow, { scale: 1, duration: 0.2, ease: 'power2.out' });
      }
    });
  });
}

// Keyboard Navigation for Hero
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    goToProduct((currentIndex + 1) % products.length, 1);
  } else if (e.key === 'ArrowLeft') {
    goToProduct((currentIndex - 1 + products.length) % products.length, -1);
  }
});

// Hero Mouse Parallax Effect (Bottle 3D Tilt; food parallax handled by initParallaxFood)
if (heroSection) {
  window.addEventListener('mousemove', (e) => {
    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

    const currentBottle = bottles[currentIndex];
    if (currentBottle && !isAnimatingHero) {
      gsap.to(currentBottle, {
        x: xNorm * 16,
        y: yNorm * 12,
        rotationY: xNorm * 10,
        rotationX: -yNorm * 8,
        duration: 0.7,
        ease: 'power2.out'
      });
    }
  });
}

// Split-Text Hover Effects for Buttons
document.querySelectorAll('.group\\/button').forEach(btn => {
  const firstText = btn.querySelector('[data-text-first]');
  const secondText = btn.querySelector('[data-text-second]');
  if (firstText && secondText) {
    btn.addEventListener('mouseenter', () => {
      gsap.to(firstText, { y: -16, opacity: 0, duration: 0.25, ease: 'power2.out' });
      gsap.to(secondText, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(firstText, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.to(secondText, { y: 16, opacity: 0, duration: 0.25, ease: 'power2.out' });
    });
  }
});

// =========================================================================
// PAGE LOADER & HERO ENTRANCE (Exact Live Match from buckssauce.com)
// =========================================================================
function getRandomRotation() {
  return 0.5 > Math.random() ? -90 : 90;
}

function runPageLoader() {
  initHero();

  const preloaderEl = document.getElementById('bucks-preloader') || document.querySelector('.z-9999');
  if (!preloaderEl) {
    animateHeroEntrance();
    return;
  }

  const circlesWrapper = preloaderEl.querySelector('[data-circles-wrapper]');
  const heroSection = document.querySelector('[data-home-hero]');
  const circles = Array.from(preloaderEl.querySelectorAll('[data-circle]'));
  const foods = Array.from(preloaderEl.querySelectorAll('[data-food]'));
  const logo = preloaderEl.querySelector('[data-logo]');
  const logoSvg = logo ? logo.querySelector('svg') : null;
  const leftHorn = logoSvg ? logoSvg.querySelector('#left-horn') : null;
  const rightHorn = logoSvg ? logoSvg.querySelector('#right-horn') : null;
  const bucksLetters = logoSvg ? Array.from(logoSvg.querySelectorAll('#bucks > path')) : [];
  const sauceLetters = logoSvg ? Array.from(logoSvg.querySelectorAll('#sauce > path')) : [];

  // Lock scrolling during preloader
  lenis.stop();
  document.body.style.overflow = 'hidden';

  const maskCircles = (pct) => {
    if (circlesWrapper) {
      const mask = `radial-gradient(circle, transparent ${pct}%, black ${pct}%)`;
      circlesWrapper.style.maskImage = mask;
      circlesWrapper.style.webkitMaskImage = mask;
    }
  };

  // 1. Initial GSAP Setups (Concentric circles start at scale 0)
  gsap.set(preloaderEl, { opacity: 1, pointerEvents: 'all', display: 'block' });
  maskCircles(0);
  if (heroSection) {
    gsap.set(heroSection, { y: 0.2 * window.innerHeight, opacity: 0 });
  }
  gsap.set(circles, {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    scale: 0,
    transformOrigin: '50% 50%',
    force3D: true
  });
  if (logo) {
    gsap.set(logo, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
  }
  if (leftHorn) {
    gsap.set(leftHorn, { opacity: 0, rotation: -25, transformOrigin: 'bottom right' });
  }
  if (rightHorn) {
    gsap.set(rightHorn, { opacity: 0, rotation: 25, transformOrigin: 'bottom left' });
  }
  if (bucksLetters.length || sauceLetters.length) {
    gsap.set([...bucksLetters, ...sauceLetters], { opacity: 0, scale: 0.2, y: 4, rotation: 0, transformOrigin: '50% 100%' });
  }

  // 2. Geometry calculations for 4 food items
  const rect = preloaderEl.getBoundingClientRect();
  const center = { x: rect.width / 2, y: rect.height / 2 };
  const isMobile = window.innerWidth < 1024;

  const foodCoords = foods.map((el, i) => {
    const t = el.getBoundingClientRect();
    let width = t.width;
    let height = t.height;
    let left = t.left - rect.left;
    let top = t.top - rect.top;

    // Robust fallback to exact responsive design specs if layout is not yet rendered
    if (width === 0 || (top === 0 && left === 0)) {
      if (i === 0) { // Pineapple (bottom-left)
        width = isMobile ? 100 : 160;
        height = width;
        left = isMobile ? rect.width * 0.10 : rect.width * 0.15;
        top = isMobile ? rect.height - height - rect.height * 0.04 : rect.height - height - rect.height * 0.10;
      } else if (i === 1) { // Habanero (top-left)
        width = isMobile ? 100 : 140;
        height = width;
        left = isMobile ? rect.width * 0.10 : rect.width * 0.30;
        top = isMobile ? rect.height * 0.06 : rect.height * 0.12;
      } else if (i === 2) { // Cherry (top-right)
        width = isMobile ? 100 : 140;
        height = width;
        left = isMobile ? rect.width - width - rect.width * 0.05 : rect.width - width - rect.width * 0.15;
        top = isMobile ? rect.height * 0.05 : rect.height * 0.20;
      } else if (i === 3) { // Peach (bottom-right)
        width = isMobile ? 100 : 180;
        height = width;
        left = isMobile ? rect.width - width - rect.width * 0.10 : rect.width - width - rect.width * 0.25;
        top = isMobile ? rect.height - height - rect.height * 0.05 : rect.height - height - rect.height * 0.10;
      }
    }

    const centerX = left + width / 2;
    const centerY = top + height / 2;
    return {
      el,
      top,
      left,
      centerX,
      centerY,
      width,
      height
    };
  });




  const initialRotations = foods.map(getRandomRotation);

  const exitVectors = foodCoords.map(item => {
    let dx = item.centerX - center.x;
    let dy = item.centerY - center.y;
    if (dx === 0 && dy === 0) dx = 1;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const distToEdge = (Math.max(
      nx > 0 ? (rect.width - item.centerX) / nx : nx < 0 ? -item.centerX / nx : 0,
      ny > 0 ? (rect.height - item.centerY) / ny : ny < 0 ? -item.centerY / ny : 0
    ) + 12 * Math.max(item.width, item.height) * 0.5) * (isMobile ? 1.8 : 1.4);
    return { x: nx * distToEdge, y: ny * distToEdge };
  });

  if (foods.length) {
    gsap.set(foods, {
      opacity: 0,
      scale: 0,
      rotation: (i) => initialRotations[i] ?? 0,
      transformOrigin: '50% 50%',
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: 'auto',
      xPercent: -50,
      yPercent: -50
    });
  }

  let isCompleted = false;
  const onLoaderComplete = () => {
    if (isCompleted) return;
    isCompleted = true;
    const maskProgress = { pct: 0 };
    gsap.to(maskProgress, {
      pct: 150,
      duration: 0.5,
      ease: 'power3.inOut',
      onUpdate: () => maskCircles(maskProgress.pct),
      onComplete: () => {
        preloaderEl.style.pointerEvents = 'none';
        preloaderEl.style.opacity = '0';
        preloaderEl.style.display = 'none';
        lenis.start();
        document.body.style.overflow = '';
      }
    });

    if (heroSection) {
      gsap.to(heroSection, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
    animateHeroEntrance();
  };

  // Master Timeline (matching exact live site timings and easing)
  const tl = gsap.timeline({ paused: true, onComplete: onLoaderComplete });

  // 1. Concentric Circles Expand (Gold, Orange, Red, Dark Background)
  tl.to(circles, {
    scale: 1,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    duration: 1.6,
    ease: 'power2.inOut',
    stagger: 0.2
  });

  // 2. Logo entrance at 1.0s
  tl.add('logoStart', 1);
  if (logo) {
    tl.to(logo, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, 'logoStart');
  }

  // 3. Horns pop out
  if (leftHorn && rightHorn) {
    tl.to([leftHorn, rightHorn], {
      opacity: 1,
      rotation: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.05
    }, '<15%');
  }

  // 4. Bucks & Sauce text letter stagger
  if (bucksLetters.length) {
    const firstLetter = bucksLetters[0] ?? null;
    const lastLetter = bucksLetters[bucksLetters.length - 1] ?? null;
    tl.to(bucksLetters, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out'
    }, '<35%');
    if (firstLetter) tl.fromTo(firstLetter, { rotation: -5 }, { rotation: 0, duration: 0.6, ease: 'power2.out' }, '<');
    if (lastLetter && lastLetter !== firstLetter) tl.fromTo(lastLetter, { rotation: 5 }, { rotation: 0, duration: 0.6, ease: 'power2.out' }, '<');
  }
  if (sauceLetters.length) {
    tl.to(sauceLetters, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out'
    }, '<');
  }

  // 5. Fruits fly in from center to designated target positions
  if (foods.length) {
    tl.to(foods, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      top: (i) => foodCoords[i]?.top ?? '50%',
      left: (i) => foodCoords[i]?.left ?? '50%',
      xPercent: 0,
      yPercent: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.out'
    }, '<');
  }

  // 6. Hold 1s, then explosive flyout
  tl.add('flyout', '+=1.0');

  if (isMobile) {
    const mobileCircles = Array.from(preloaderEl.querySelectorAll('[data-circle-gold], [data-circle-orange], [data-circle-red]'));
    tl.to(mobileCircles, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 'flyout');
  }

  // Logo shoots upward
  if (logo) {
    tl.to(logo, {
      y: -2000,
      scale: 5,
      duration: 1,
      ease: 'power2.inOut'
    }, 'flyout');
  }

  // Fruits blast outward past viewport edges
  if (foods.length) {
    tl.to(foods, {
      scale: 12,
      x: (i) => exitVectors[i]?.x ?? 0,
      y: (i) => exitVectors[i]?.y ?? 0,
      duration: 0.9,
      ease: 'power2.inOut',
      stagger: 0.04
    }, 'flyout+=0.03');
  }

  // Trigger hero reveal through expanding radial mask
  tl.call(onLoaderComplete, undefined, 'flyout+=0.21');

  tl.play();
}

function animateHeroEntrance() {
  const heroSection = document.querySelector('[data-home-hero]');
  if (heroSection) {
    gsap.to(heroSection, { opacity: 1, duration: 0.6, ease: 'power2.out' });
  }

  const header = document.querySelector('header') || document.querySelector('[data-nav]');
  const title = document.querySelector('[data-title]');
  const bottle0 = bottles[0];
  const bgCircle = document.querySelector('[data-bg-circle]');
  const frontFruit0 = frontFruits[0];
  const backFruit0 = backFruits[0];
  const middleBar = document.querySelector('[data-middle-bar]');
  const bottomBar = document.querySelector('[data-bottom-bar]');

  // Banner drops in smoothly
  const banner = document.querySelector('aside[data-banner]');
  if (banner) {
    banner.style.display = 'flex';
    banner.style.pointerEvents = 'auto';
    gsap.fromTo(banner,
      { y: -36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );
    const closeBtn = banner.querySelector('div.cursor-pointer');
    if (closeBtn && !closeBtn._hasListener) {
      closeBtn._hasListener = true;
      closeBtn.addEventListener('click', () => {
        gsap.to(banner, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            banner.style.display = 'none';
            if (header) {
              gsap.to(header, { top: '0px', duration: 0.3, ease: 'power2.out' });
            }
          }
        });
      });
    }
  }

  // Header drops in smoothly
  if (header) {
    header.style.top = banner ? '2.25rem' : '0px';
    header.style.pointerEvents = 'auto';
    gsap.fromTo(header,
      { y: -36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }

  // Title words bounce up letter/word-by-word
  if (title) {
    const words = title.querySelectorAll('span > span');
    if (words.length > 0) {
      gsap.fromTo(words,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, stagger: 0.04, duration: 0.7, ease: 'back.out(1.2)' }
      );
    } else {
      gsap.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' });
    }
  }

  // Background circle expands
  if (bgCircle) {
    gsap.fromTo(bgCircle,
      { scale: 0.4, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.75,
        ease: 'back.out(1.1)',
        onComplete: () => {
          if (bgCircleTween) bgCircleTween.play();
        }
      }
    );
  }

  // Hero bottle rises from below with spring
  if (bottle0) {
    gsap.fromTo(bottle0,
      { y: 150, scale: 0.85, opacity: 0, rotation: 15 },
      { y: 0, scale: 1, opacity: 1, rotation: 5, duration: 0.85, ease: 'back.out(1.3)' }
    );
  }

  // Floating fruits pop in
  if (frontFruit0) {
    gsap.fromTo(frontFruit0,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.65, delay: 0.15, ease: 'back.out(1.4)' }
    );
  }
  if (backFruit0) {
    gsap.fromTo(backFruit0,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.65, delay: 0.2, ease: 'back.out(1.4)' }
    );
  }

  // Tickers & bottom CTA bar fade in
  if (middleBar) {
    gsap.fromTo(middleBar, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' });
  }
  if (bottomBar) {
    gsap.fromTo(bottomBar, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' });
  }
}

runPageLoader();

// =========================================================================
// PARALLAX FOOD INTERACTIVE PHYSICS (Authentic GSAP Match from buckssauce.com)
// Continuous floating waves + Mouse repulsion within 1000px radius
// =========================================================================
function initParallaxFood() {
  const getDistanceMult = (distAttr) => {
    const d = Number.parseInt(distAttr ?? '', 10);
    return d === 2 ? 0.65 : d === 3 ? 0.3 : 1;
  };

  const parallaxItems = [];
  const foodElements = document.querySelectorAll('[data-parallax-food]');

  foodElements.forEach((el) => {
    const inner = el.querySelector('[data-parallax-food-inner]');
    if (!inner) return;

    const randomFactor = Number.parseFloat((Math.random()).toFixed(2));
    const distMult = getDistanceMult(el.getAttribute('data-parallax-distance'));

    // 1. Idle Gentle Floating Wave Animation (Sine wave oscillation)
    const floatAmp = Number.parseFloat(el.getAttribute('data-parallax-float-amplitude') || randomFactor) * distMult;
    const duration = 3 + 2 * Math.random();
    const yDisplacement = 25 * floatAmp;
    const rotDisplacement = 5 * floatAmp;

    gsap.fromTo(el,
      { yPercent: -yDisplacement, rotation: -rotDisplacement },
      { yPercent: yDisplacement, rotation: rotDisplacement, duration: duration, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );

    // 2. ScrollTrigger Scrub Parallax (for page sections outside preloader)
    if (!el.closest('#bucks-preloader')) {
      const speed = Number.parseFloat(el.getAttribute('data-parallax-speed') || randomFactor) * distMult;
      const scrubSpeed = 2.5 * speed;
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
        animation: gsap.to(inner, { yPercent: -50 * scrubSpeed, ease: 'none' })
      });
    }

    // 3. Mouse displacement physics
    const mouseForce = Number.parseFloat(el.getAttribute('data-parallax-mouse-force') || randomFactor) * distMult;
    const maxDisplacement = 80 * (mouseForce || 0.2);

    parallaxItems.push({
      el,
      inner,
      maxDisplacement,
      quickMouseX: gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power2.out' }),
      quickMouseY: gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power2.out' })
    });
  });

  // Global mousemove handler with quadratic falloff within 1000px
  if (parallaxItems.length) {
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      for (let i = 0; i < parallaxItems.length; i++) {
        const item = parallaxItems[i];
        const rect = item.el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const dist = Math.hypot(dx, dy);

        // Falloff over 1000px radius
        const proximity = Math.max(0, 1 - dist / 1000);
        const displacement = proximity * proximity * item.maxDisplacement;

        if (displacement > 0.1) {
          const angle = Math.atan2(dy, dx);
          item.quickMouseX(Math.cos(angle) * displacement);
          item.quickMouseY(Math.sin(angle) * displacement);
        } else {
          item.quickMouseX(0);
          item.quickMouseY(0);
        }
      }
    });
  }
}

initParallaxFood();

// =========================================================================
// HEADER SCROLL ANIMATION & DESKTOP NAV (Authentic GSAP Match from buckssauce.com)
// =========================================================================
const headerEl = document.querySelector('header') || document.querySelector('[data-nav]');
const headerLogoEl = headerEl ? headerEl.querySelector('[data-logo]') : null;
const logoSvg = headerLogoEl ? headerLogoEl.querySelector('svg') : null;
const logoHead = headerLogoEl ? headerLogoEl.querySelector('#head') : null;
const logoText = headerLogoEl ? headerLogoEl.querySelector('#text') : null;
const logoLeftHorn = headerLogoEl ? headerLogoEl.querySelector('#left-horn') : null;
const logoRightHorn = headerLogoEl ? headerLogoEl.querySelector('#right-horn') : null;

const desktopNavEl = headerEl ? headerEl.querySelector('[data-desktop-nav]') : null;
const globalNavEl = headerEl ? headerEl.querySelector('[data-global-nav]') : null;
const cartDrawer = document.querySelector('[data-cart]');
const menuDrawer = document.querySelector('[data-menu]');

const U = (37 / 142) * 100; // 26.056338% - exact mascot crop offset
const isDesktop = () => window.innerWidth >= 1024;

let isHeaderScrolled = false;

// 1. Initial State Setup
if (isDesktop()) {
  if (globalNavEl) gsap.set(globalNavEl, { y: -150 });
  if (desktopNavEl) gsap.set(desktopNavEl, { y: 0 });
  if (headerLogoEl) gsap.set(headerLogoEl, { height: 'auto', scale: 1 });
  if (logoSvg) gsap.set(logoSvg, { yPercent: 0 });
  if (logoHead && logoText) gsap.set([logoHead, logoText], { opacity: 1 });
  if (logoRightHorn) gsap.set(logoRightHorn, { x: 0 });
  if (logoLeftHorn) gsap.set(logoLeftHorn, { x: 0 });
} else {
  if (globalNavEl) gsap.set(globalNavEl, { y: 0 });
  if (headerLogoEl) gsap.set(headerLogoEl, { height: 50, scale: 1 });
  if (logoSvg) gsap.set(logoSvg, { yPercent: -U });
  if (logoHead && logoText) gsap.set([logoHead, logoText], { opacity: 0 });
  if (logoRightHorn) gsap.set(logoRightHorn, { x: -24 });
}

// 2. Responsive Scroll Transition
function onScrollUpdate(currentY) {
  if (!headerEl) return;
  const shouldBeScrolled = currentY > 64;
  const banner = document.querySelector('aside[data-banner]');
  const isBannerOpen = banner && banner.style.display !== 'none';

  const targetTop = (shouldBeScrolled || !isBannerOpen) ? '0px' : '2.25rem';
  if (headerEl.style.top !== targetTop) {
    gsap.to(headerEl, { top: targetTop, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  }

  if (shouldBeScrolled && !isHeaderScrolled) {
    isHeaderScrolled = true;
    const tl = gsap.timeline({ defaults: { duration: 0.45, ease: 'power2.out' } });

    if (isDesktop()) {
      if (desktopNavEl) {
        tl.to(desktopNavEl, { y: -100, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (globalNavEl) {
        tl.to(globalNavEl, { y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (headerLogoEl) {
        tl.to(headerLogoEl, { height: 50, scale: 0.9, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoSvg) {
        tl.to(logoSvg, { yPercent: -U, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoHead && logoText) {
        tl.to([logoHead, logoText], { opacity: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoRightHorn) {
        tl.to(logoRightHorn, { x: -24, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoLeftHorn) {
        tl.to(logoLeftHorn, { x: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
    }
  } else if (!shouldBeScrolled && isHeaderScrolled) {
    isHeaderScrolled = false;
    const tl = gsap.timeline({ defaults: { duration: 0.45, ease: 'power2.out' } });

    if (isDesktop()) {
      if (desktopNavEl) {
        tl.to(desktopNavEl, { y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (globalNavEl) {
        tl.to(globalNavEl, { y: -150, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (headerLogoEl) {
        tl.to(headerLogoEl, { height: 'auto', scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoSvg) {
        tl.to(logoSvg, { yPercent: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoHead && logoText) {
        tl.to([logoHead, logoText], { opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoRightHorn) {
        tl.to(logoRightHorn, { x: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
      if (logoLeftHorn) {
        tl.to(logoLeftHorn, { x: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }, 0);
      }
    }
  }
}

lenis.on('scroll', (e) => {
  onScrollUpdate(e.scroll);
});
window.addEventListener('scroll', () => {
  onScrollUpdate(window.scrollY);
}, { passive: true });

// 3. Desktop Nav Links Character Roll Hover Animation
if (desktopNavEl) {
  const navLinks = desktopNavEl.querySelectorAll('li a, li button');
  navLinks.forEach(link => {
    const firstChars = link.querySelectorAll('[data-first-text] .char');
    const secondChars = link.querySelectorAll('[data-second-text] .char');

    if (firstChars.length > 0 && secondChars.length > 0) {
      link.addEventListener('mouseenter', () => {
        gsap.to(firstChars, {
          yPercent: -105,
          duration: 0.4,
          stagger: 0.02,
          ease: 'back.out(1)',
          overwrite: 'auto'
        });
        gsap.to(secondChars, {
          yPercent: -105,
          duration: 0.4,
          stagger: 0.02,
          ease: 'back.out(1)',
          overwrite: 'auto'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(firstChars, {
          yPercent: 0,
          duration: 0.4,
          stagger: { amount: 0.02, from: 'end' },
          ease: 'back.out(1)',
          overwrite: 'auto'
        });
        gsap.to(secondChars, {
          yPercent: 0,
          duration: 0.4,
          stagger: { amount: 0.02, from: 'end' },
          ease: 'back.out(1)',
          overwrite: 'auto'
        });
      });
    }
  });

  // Desktop cart trigger
  const dCartBtn = desktopNavEl.querySelector('button');
  if (dCartBtn) {
    dCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }
}

// 4. Global Nav Buttons Hover & Click
if (globalNavEl) {
  // "GET SAUCE" pill button
  const getSauceLink = globalNavEl.querySelector('a');
  if (getSauceLink) {
    const firstText = getSauceLink.querySelector('[data-text-first]');
    const secondText = getSauceLink.querySelector('[data-text-second]');
    const btnBg = getSauceLink.querySelector('[data-button-bg]');

    getSauceLink.addEventListener('mouseenter', () => {
      if (firstText) gsap.to(firstText, { y: -16, opacity: 0, duration: 0.28, ease: 'power2.out' });
      if (secondText) gsap.to(secondText, { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' });
      if (btnBg) gsap.to(btnBg, { scale: 1.04, duration: 0.28, ease: 'power2.out' });
    });
    getSauceLink.addEventListener('mouseleave', () => {
      if (firstText) gsap.to(firstText, { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' });
      if (secondText) gsap.to(secondText, { y: 16, opacity: 0, duration: 0.28, ease: 'power2.out' });
      if (btnBg) gsap.to(btnBg, { scale: 1, duration: 0.28, ease: 'power2.out' });
    });
  }

  // Cart Button
  const gCartBtn = globalNavEl.querySelector('[data-cart-button]');
  if (gCartBtn) {
    const firstIcon = gCartBtn.querySelector('[data-right-icon-first]');
    const secondIcon = gCartBtn.querySelector('[data-right-icon-second]');
    gCartBtn.addEventListener('mouseenter', () => {
      if (firstIcon) gsap.to(firstIcon, { x: 16, opacity: 0, duration: 0.25, ease: 'power2.out' });
      if (secondIcon) gsap.to(secondIcon, { x: 0, scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
    });
    gCartBtn.addEventListener('mouseleave', () => {
      if (firstIcon) gsap.to(firstIcon, { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
      if (secondIcon) gsap.to(secondIcon, { x: -16, scale: 0, opacity: 0, duration: 0.25, ease: 'power2.out' });
    });
    gCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }

  // Hamburger Button
  const gBurgerBtn = globalNavEl.querySelector('[data-hamburger]');
  if (gBurgerBtn) {
    const firstIcon = gBurgerBtn.querySelector('[data-right-icon-first]');
    const secondIcon = gBurgerBtn.querySelector('[data-right-icon-second]');
    gBurgerBtn.addEventListener('mouseenter', () => {
      if (firstIcon) gsap.to(firstIcon, { x: 16, opacity: 0, duration: 0.25, ease: 'power2.out' });
      if (secondIcon) gsap.to(secondIcon, { x: 0, scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
    });
    gBurgerBtn.addEventListener('mouseleave', () => {
      if (firstIcon) gsap.to(firstIcon, { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
      if (secondIcon) gsap.to(secondIcon, { x: -16, scale: 0, opacity: 0, duration: 0.25, ease: 'power2.out' });
    });
    gBurgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
    });
  }
}

// =========================================================================
// 3. Section 1 ("Clean Ingredients") Stacked Cards Animation
// =========================================================================
const sec1 = document.querySelector('section.relative.p-container.pt-18');
const cards = document.querySelectorAll('[data-card]');
if (sec1 && cards.length === 4) {
  gsap.timeline({
    scrollTrigger: {
      trigger: sec1,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: 1.2
    }
  })
  .fromTo(cards[1],
    { y: 120, rotation: 0, x: 0 },
    { y: 0, rotation: 5, x: -25, ease: 'power2.out' }, 0
  )
  .fromTo(cards[2],
    { y: 200, rotation: 0, x: 0 },
    { y: 0, rotation: -5, x: 25, ease: 'power2.out' }, 0.1
  )
  .fromTo(cards[3],
    { y: 280, rotation: 0, x: 0 },
    { y: 0, rotation: 5, x: -20, ease: 'power2.out' }, 0.2
  );
}

// =========================================================================
// 4. Section 2 ("Choose Your Weapon") Titles, Cards & Antler Animations
// =========================================================================
const listingCards = document.querySelectorAll('[data-listing-card]');
listingCards.forEach(card => {
  const bottleImg = card.querySelector('img');
  const leftAntler = card.querySelector('[data-left-antler]');
  const rightAntler = card.querySelector('[data-right-antler]');

  // Antlers initial scale
  if (leftAntler) gsap.set(leftAntler, { scale: 0, transformOrigin: 'bottom right' });
  if (rightAntler) gsap.set(rightAntler, { scale: 0, transformOrigin: 'bottom left' });

  // Antler pop-out hover effects
  card.addEventListener('mouseenter', () => {
    if (bottleImg) {
      gsap.to(bottleImg, { y: -12, scale: 1.05, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    }
    if (leftAntler) {
      gsap.to(leftAntler, { scale: 1, duration: 0.45, ease: 'back.out(1.8)', overwrite: 'auto' });
    }
    if (rightAntler) {
      gsap.to(rightAntler, { scale: 1, duration: 0.45, ease: 'back.out(1.8)', overwrite: 'auto' });
    }
  });

  card.addEventListener('mouseleave', () => {
    if (bottleImg) {
      gsap.to(bottleImg, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }
    if (leftAntler) {
      gsap.to(leftAntler, { scale: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
    }
    if (rightAntler) {
      gsap.to(rightAntler, { scale: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
    }
  });

  const addBtn = card.querySelector('button, [data-button-bg]');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      openCart();
    });
  }
});

// Section 2 Title ("Choose your weapon") Scroll Reveal
const sec2Titles = document.querySelectorAll('section:nth-of-type(3) [data-gsap-title-on-scroll]');
sec2Titles.forEach((t, i) => {
  gsap.fromTo(t,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: t,
        start: 'top 85%'
      }
    }
  );
});

// Section 2 Listing Cards Stagger Entrance on Scroll
if (listingCards.length > 0) {
  gsap.fromTo(listingCards,
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: listingCards[0].closest('div') || listingCards[0],
        start: 'top 82%'
      }
    }
  );
}

// =========================================================================
// 5. Section 3 ("Build Your 3-Pack & Save $4.00") Bundle Builder & Reveals
// =========================================================================
const bundleSection = document.querySelectorAll('section')[3];
if (bundleSection) {
  // Title reveal
  const bundleTitle = bundleSection.querySelector('[data-gsap-title-on-scroll]');
  if (bundleTitle) {
    gsap.fromTo(bundleTitle,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bundleTitle,
          start: 'top 85%'
        }
      }
    );
  }

  // Bottle list items slide in
  const packList = bundleSection.querySelector('[data-gsap-slide-in-on-scroll]');
  if (packList && packList.children.length > 0) {
    gsap.fromTo(packList.children,
      { y: 50, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.75,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: packList,
          start: 'top 82%'
        }
      }
    );
  }

  const packPlusButtons = bundleSection.querySelectorAll('button:not([data-button-bg] button)');
  const mainPackBtn = bundleSection.querySelector('[data-button-bg]')?.closest('button') || bundleSection.querySelectorAll('button')[4];
  let packCount = 0;

  packPlusButtons.forEach((btn, idx) => {
    if (idx < 4) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        packCount = (packCount + 1) % 4;
        if (packCount === 0) packCount = 1;

        gsap.fromTo(btn, { scale: 0.8 }, { scale: 1.15, duration: 0.18, yoyo: true, repeat: 1 });

        if (mainPackBtn) {
          const remaining = 3 - (packCount % 3);
          if (remaining === 0 || packCount === 3) {
            mainPackBtn.innerText = 'Add 3-Pack to Cart ($32.00)';
            confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
          } else {
            mainPackBtn.innerText = `Add ${remaining} more`;
          }
        }
      });
    }
  });

  if (mainPackBtn) {
    mainPackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      openCart();
    });
  }
}

// =========================================================================
// Floating Ingredients Parallax Scroll ([data-parallax-food])
// =========================================================================
const parallaxFoods = document.querySelectorAll('[data-parallax-food]');
parallaxFoods.forEach(food => {
  const speed = parseFloat(food.getAttribute('data-parallax-speed'));
  if (isNaN(speed) || speed === 0) return;
  const parent = food.closest('section') || food.parentElement;

  gsap.to(food, {
    y: -90 * speed,
    rotation: speed * 6,
    ease: 'none',
    scrollTrigger: {
      trigger: parent,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2
    }
  });
});

// =========================================================================
// 6. Section 4 ("Why Bucks Sauce") Interactive Reasons
// =========================================================================
const whyBucksSec = document.querySelector('[data-why-bucks-sauce]');
if (whyBucksSec) {
  const reasons = Array.from(whyBucksSec.querySelectorAll('[data-reason]'));
  const whyArrows = Array.from(allSliderArrows).filter(arrow => !arrow.closest('[data-home-hero]'));
  let activeReasonIdx = 0;

  function showReason(idx) {
    activeReasonIdx = idx;
    reasons.forEach((r, i) => {
      if (i === activeReasonIdx) {
        gsap.to(r, {
          opacity: 1,
          scale: 1,
          x: 0,
          pointerEvents: 'auto',
          duration: 0.5,
          ease: 'power2.out'
        });
      } else {
        const dir = i < activeReasonIdx ? -1 : 1;
        gsap.to(r, {
          opacity: 0,
          scale: 0.85,
          x: dir * 70,
          pointerEvents: 'none',
          duration: 0.4,
          ease: 'power2.in'
        });
      }
    });
  }

  // Setup reasons positioning
  reasons.forEach((r, i) => {
    r.style.position = 'absolute';
    r.style.left = '50%';
    r.style.top = '12%';
    r.style.transform = 'translateX(-50%)';
    if (i === 0) {
      r.style.opacity = '1';
      r.style.pointerEvents = 'auto';
    } else {
      r.style.opacity = '0';
      r.style.pointerEvents = 'none';
    }
  });

  if (whyArrows.length >= 2) {
    whyArrows[0].style.cursor = 'pointer';
    whyArrows[0].addEventListener('click', (e) => {
      e.preventDefault();
      const next = (activeReasonIdx - 1 + reasons.length) % reasons.length;
      showReason(next);
    });

    whyArrows[1].style.cursor = 'pointer';
    whyArrows[1].addEventListener('click', (e) => {
      e.preventDefault();
      const next = (activeReasonIdx + 1) % reasons.length;
      showReason(next);
    });
  }
}

// =========================================================================
// 7. Section 5 ("Reviews") Smooth Infinite Marquee
// =========================================================================
const reviewsSection = document.querySelectorAll('section')[5];
const reviewsContainer = reviewsSection ? reviewsSection.querySelector('[data-gsap-slide-in-on-scroll]') : null;
if (reviewsContainer) {
  const marqueeTrack = reviewsContainer.parentElement;
  if (marqueeTrack) {
    marqueeTrack.style.overflow = 'hidden';
  }

  let marqueeX = 0;
  let marqueeSpeed = 0.85;
  let isReviewsHovered = false;

  reviewsContainer.addEventListener('mouseenter', () => { isReviewsHovered = true; });
  reviewsContainer.addEventListener('mouseleave', () => { isReviewsHovered = false; });

  function tickMarquee() {
    if (!isReviewsHovered) {
      marqueeX -= marqueeSpeed;
      if (marqueeX <= -(reviewsContainer.scrollWidth / 2)) {
        marqueeX = 0;
      }
      reviewsContainer.style.transform = `translateX(${marqueeX}px)`;
    }
    requestAnimationFrame(tickMarquee);
  }
  requestAnimationFrame(tickMarquee);
}

// =========================================================================
// 8. Cart Drawer & Menu Drawer
// =========================================================================

export function openCart() {
  if (cartDrawer) {
    cartDrawer.style.pointerEvents = 'auto';
    gsap.to(cartDrawer, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
    const inner = cartDrawer.querySelector('[data-cart-inner]');
    if (inner) {
      gsap.fromTo(inner, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
    const emptyMsg = cartDrawer.querySelectorAll('[data-is-empty], [data-cart-content], .flex-col.gap-10');
    emptyMsg.forEach(el => {
      gsap.to(el, { opacity: 1, duration: 0.3, delay: 0.1 });
    });
  }
}

export function closeCart() {
  if (cartDrawer) {
    cartDrawer.style.pointerEvents = 'none';
    gsap.to(cartDrawer, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in'
    });
  }
}

function openMenu() {
  if (menuDrawer) {
    menuDrawer.style.pointerEvents = 'auto';
    gsap.to(menuDrawer, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
    const menuItems = menuDrawer.querySelectorAll('[data-menu-items] li, a');
    gsap.to(menuItems, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.35,
      ease: 'power2.out'
    });
  }
}

function closeMenu() {
  if (menuDrawer) {
    menuDrawer.style.pointerEvents = 'none';
    gsap.to(menuDrawer, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in'
    });
  }
}

// Global Cart Buttons
document.querySelectorAll('[data-cart-button]').forEach(btn => {
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
});

cartDrawer?.querySelector('[data-close]')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeCart();
});

cartDrawer?.querySelector('[data-backdrop]')?.addEventListener('click', () => {
  closeCart();
});

// Menu Drawer Toggles
document.querySelector('[data-hamburger]')?.addEventListener('click', (e) => {
  e.preventDefault();
  openMenu();
});

menuDrawer?.querySelector('[data-close]')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeMenu();
});

// Checkout confetti
document.querySelectorAll('[data-checkout-button]').forEach((btn) => {
  btn.addEventListener('click', () => {
    confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 } });
  });
});

console.log('Bucks Sauce animations & interactions fully initialized!');
