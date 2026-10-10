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

const bgCircleInner = heroSection ? heroSection.querySelector('[data-bg-circle-inner]') : null;
const heroCtaLink = heroSection ? heroSection.querySelector('[data-bottom-bar] a') : null;

// Select only Hero slider arrows
const allSliderArrows = document.querySelectorAll('[data-slider-arrow]');
const heroArrows = Array.from(allSliderArrows).filter(arrow => arrow.closest('[data-home-hero]'));

// Initialize Hero DOM state
function initHero() {
  document.documentElement.style.setProperty('--color-theme', products[0].color);

  // Set initial shells & bottles
  bottleShells.forEach((shell, i) => {
    shell.style.display = i === 0 ? 'flex' : 'none';
    shell.style.pointerEvents = i === 0 ? 'auto' : 'none';
  });

  bottles.forEach((bottle, i) => {
    if (bottle) {
      bottle.style.opacity = i === 0 ? '1' : '0';
      bottle.style.transform = i === 0 ? 'rotate(5deg)' : 'scale(0.85)';
    }
  });

  // Set initial fruits
  frontFruits.forEach((fruit, i) => {
    fruit.style.opacity = i === 0 ? '1' : '0';
  });

  backFruits.forEach((fruit, i) => {
    fruit.style.opacity = i === 0 ? '1' : '0';
  });

  // Set initial tickers
  if (pNumContainer) gsap.set(pNumContainer, { y: 0 });
  numSpans.forEach((span, i) => {
    span.style.opacity = i === 0 ? '1' : '0';
  });

  if (pNameContainer) gsap.set(pNameContainer, { y: 0 });
  nameSpans.forEach((span, i) => {
    span.style.opacity = i === 0 ? '1' : '0';
  });

  if (bgCircleInner) {
    bgCircleInner.style.backgroundColor = products[0].color;
  }
}

// Transition to specific product index
function goToProduct(nextIndex, direction = 1) {
  if (isAnimatingHero || nextIndex === currentIndex) return;
  isAnimatingHero = true;

  const prevIndex = currentIndex;
  currentIndex = nextIndex;
  const prod = products[currentIndex];

  // 1. Theme Color & Background Circle
  document.documentElement.style.setProperty('--color-theme', prod.color);
  if (bgCircleInner) {
    gsap.to(bgCircleInner, {
      backgroundColor: prod.color,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  // 2. Bottles Transition
  const oldShell = bottleShells[prevIndex];
  const oldBottle = bottles[prevIndex];
  const newShell = bottleShells[currentIndex];
  const newBottle = bottles[currentIndex];

  if (oldBottle) {
    gsap.to(oldBottle, {
      opacity: 0,
      scale: 0.82,
      rotation: direction > 0 ? -12 : 12,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        if (oldShell) oldShell.style.display = 'none';
      }
    });
  }

  if (newShell && newBottle) {
    newShell.style.display = 'flex';
    newShell.style.pointerEvents = 'auto';
    gsap.fromTo(
      newBottle,
      { opacity: 0, scale: 0.82, rotation: direction > 0 ? 12 : -12 },
      { opacity: 1, scale: 1, rotation: 5, duration: 0.65, ease: 'back.out(1.25)' }
    );
  }

  // 3. Front Fruits Transition
  const oldFront = frontFruits[prevIndex];
  const newFront = frontFruits[currentIndex];
  if (oldFront) {
    gsap.to(oldFront, { opacity: 0, scale: 0.75, duration: 0.35, ease: 'power2.in' });
  }
  if (newFront) {
    gsap.fromTo(
      newFront,
      { opacity: 0, scale: 0.75 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' }
    );
  }

  // 4. Back Fruits Transition
  const oldBack = backFruits[prevIndex];
  const newBack = backFruits[currentIndex];
  if (oldBack) {
    gsap.to(oldBack, { opacity: 0, scale: 0.75, duration: 0.35, ease: 'power2.in' });
  }
  if (newBack) {
    gsap.fromTo(
      newBack,
      { opacity: 0, scale: 0.75 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' }
    );
  }

  // 5. Product Number Ticker
  if (pNumContainer) {
    gsap.to(pNumContainer, {
      y: -currentIndex * 16,
      duration: 0.45,
      ease: 'power2.out'
    });
  }
  numSpans.forEach((span, i) => {
    gsap.to(span, { opacity: i === currentIndex ? 1 : 0, duration: 0.35 });
  });

  // 6. Product Name Ticker
  if (pNameContainer) {
    gsap.to(pNameContainer, {
      y: -currentIndex * 16,
      duration: 0.45,
      ease: 'power2.out'
    });
  }
  nameSpans.forEach((span, i) => {
    gsap.to(span, { opacity: i === currentIndex ? 1 : 0, duration: 0.35 });
  });

  // 7. Update CTA Link URL
  if (heroCtaLink) {
    heroCtaLink.href = prod.url;
  }

  setTimeout(() => {
    isAnimatingHero = false;
  }, 480);
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
      gsap.to(arrow, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
    });
    arrow.addEventListener('mouseleave', () => {
      gsap.to(arrow, { scale: 1, duration: 0.2, ease: 'power2.out' });
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

// Hero Mouse Parallax Effect
if (heroSection) {
  window.addEventListener('mousemove', (e) => {
    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

    const currentBottle = bottles[currentIndex];
    if (currentBottle) {
      gsap.to(currentBottle, {
        x: xNorm * 16,
        y: yNorm * 12,
        rotationY: xNorm * 10,
        rotationX: -yNorm * 8,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    const floatingFoods = heroSection.querySelectorAll('[data-parallax-food]');
    floatingFoods.forEach((food, idx) => {
      const factor = (idx % 2 === 0 ? 1 : -1) * (14 + idx * 5);
      gsap.to(food, {
        x: xNorm * factor,
        y: yNorm * factor,
        duration: 1.1,
        ease: 'power2.out'
      });
    });
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
// PAGE LOADER & HERO ENTRANCE (Awwwards / CodeGrid Bucks Sauce Reveal)
// =========================================================================
const preloader = document.getElementById('bucks-preloader');

function runPageLoader() {
  initHero();

  if (!preloader) {
    animateHeroEntrance();
    return;
  }

  const logo = preloader.querySelector('.loader-logo');
  const badge = preloader.querySelector('.loader-badge');
  const peach = preloader.querySelector('.loader-fruit-peach');
  const pineapple = preloader.querySelector('.loader-fruit-pineapple');
  const habanero = preloader.querySelector('.loader-fruit-habanero');
  const cherry = preloader.querySelector('.loader-fruit-cherry');

  const rev1 = preloader.querySelector('.loader-revealer-1');
  const rev2 = preloader.querySelector('.loader-revealer-2');
  const rev3 = preloader.querySelector('.loader-revealer-3');
  const rev4 = preloader.querySelector('.loader-revealer-4');

  // Lock scrolling during preloader
  lenis.stop();
  document.body.style.overflow = 'hidden';

  // Master Loader Timeline
  const tl = gsap.timeline({
    onComplete: () => {
      lenis.start();
      document.body.style.overflow = '';
      preloader.style.display = 'none';
      preloader.style.pointerEvents = 'none';
    }
  });

  // 1. Logo & Badge entrance from center
  tl.fromTo(logo, 
    { scale: 0.65, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)' }
  );

  tl.fromTo(badge,
    { opacity: 0, letterSpacing: '0.45em' },
    { opacity: 1, letterSpacing: '0.25em', duration: 0.5, ease: 'power2.out' },
    '-=0.35'
  );

  // 2. 4 Fruits fly in from diagonal quadrants into orbital positions around logo
  tl.fromTo(peach,
    { x: -280, y: -220, rotation: -35, opacity: 0, scale: 0.5 },
    { x: -160, y: -95, rotation: -12, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' },
    0.25
  );

  tl.fromTo(pineapple,
    { x: 280, y: -220, rotation: 35, opacity: 0, scale: 0.5 },
    { x: 160, y: -90, rotation: 15, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' },
    0.3
  );

  tl.fromTo(habanero,
    { x: -280, y: 220, rotation: -30, opacity: 0, scale: 0.5 },
    { x: -150, y: 105, rotation: -8, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' },
    0.35
  );

  tl.fromTo(cherry,
    { x: 280, y: 220, rotation: 30, opacity: 0, scale: 0.5 },
    { x: 150, y: 105, rotation: 14, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' },
    0.4
  );

  // Subtle breathing float in place for 0.4s
  tl.to([peach, pineapple, habanero, cherry], {
    y: '+=8',
    rotation: '+=3',
    duration: 0.4,
    yoyo: true,
    repeat: 1,
    ease: 'sine.inOut'
  }, 0.9);

  // 3. Fruits & Logo exit (burst outward and fade)
  tl.to([peach, pineapple, habanero, cherry], {
    scale: 1.25,
    opacity: 0,
    duration: 0.35,
    stagger: 0.03,
    ease: 'power2.in'
  }, 1.35);

  tl.to(logo, {
    scale: 0.85,
    opacity: 0,
    duration: 0.35,
    ease: 'power2.in'
  }, 1.4);

  // 4. Concentric circular revealers expand outward in colored waves
  tl.to(rev1, { clipPath: 'circle(150% at 50% 50%)', duration: 0.75, ease: 'power3.inOut' }, 1.5);
  tl.to(rev2, { clipPath: 'circle(150% at 50% 50%)', duration: 0.75, ease: 'power3.inOut' }, 1.65);
  tl.to(rev3, { clipPath: 'circle(150% at 50% 50%)', duration: 0.75, ease: 'power3.inOut' }, 1.8);
  tl.to(rev4, { clipPath: 'circle(150% at 50% 50%)', duration: 0.8, ease: 'power3.inOut' }, 1.95);

  // 5. Trigger Hero Section Entrance as the reveal completes!
  tl.add(() => {
    animateHeroEntrance();
  }, 2.1);

  tl.to(preloader, {
    opacity: 0,
    duration: 0.35,
    ease: 'power2.out'
  }, 2.4);
}

function animateHeroEntrance() {
  const header = document.querySelector('header') || document.querySelector('[data-nav]');
  const title = document.querySelector('[data-title]');
  const bottle0 = bottles[0];
  const bgCircle = document.querySelector('[data-bg-circle]');
  const frontFruit0 = frontFruits[0];
  const backFruit0 = backFruits[0];
  const middleBar = document.querySelector('[data-middle-bar]');
  const bottomBar = document.querySelector('[data-bottom-bar]');

  // Header drops in smoothly
  if (header) {
    gsap.fromTo(header,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
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
      { scale: 0.934, opacity: 1, duration: 0.75, ease: 'back.out(1.1)' }
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
// HEADER SCROLL ANIMATION (Glassmorphism, Logo Scale & Directional Smart Nav)
// =========================================================================
const headerEl = document.querySelector('header') || document.querySelector('[data-nav]');
const headerLogoEl = headerEl ? headerEl.querySelector('[data-logo]') : null;

let lastScrollPosition = 0;
let isHeaderFrosted = false;
let isHeaderHidden = false;

function onScrollUpdate(currentY) {
  if (!headerEl) return;

  // 1. Frosted Glass Transition & Logo Shrink
  if (currentY > 40 && !isHeaderFrosted) {
    isHeaderFrosted = true;
    gsap.to(headerEl, {
      backgroundColor: 'rgba(19, 16, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      webkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(245, 228, 199, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      duration: 0.35,
      ease: 'power2.out'
    });
    if (headerLogoEl) {
      gsap.to(headerLogoEl, {
        scale: 0.85,
        duration: 0.35,
        ease: 'power2.out',
        transformOrigin: 'left center'
      });
    }
  } else if (currentY <= 40 && isHeaderFrosted) {
    isHeaderFrosted = false;
    gsap.to(headerEl, {
      backgroundColor: 'rgba(19, 16, 14, 0)',
      backdropFilter: 'blur(0px)',
      webkitBackdropFilter: 'blur(0px)',
      borderBottom: '1px solid transparent',
      boxShadow: 'none',
      duration: 0.35,
      ease: 'power2.out'
    });
    if (headerLogoEl) {
      gsap.to(headerLogoEl, {
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
        transformOrigin: 'left center'
      });
    }
  }

  // 2. Smart Directional Hide/Show (Show on scroll up, Hide on scroll down past 280px)
  const isDrawerOpen = (cartDrawer && cartDrawer.style.pointerEvents === 'auto') ||
                       (menuDrawer && menuDrawer.style.pointerEvents === 'auto');

  if (!isDrawerOpen) {
    const delta = currentY - lastScrollPosition;
    if (currentY > 280 && delta > 8 && !isHeaderHidden) {
      isHeaderHidden = true;
      gsap.to(headerEl, {
        y: '-100%',
        duration: 0.38,
        ease: 'power2.inOut',
        overwrite: 'auto'
      });
    } else if ((delta < -5 || currentY <= 50) && isHeaderHidden) {
      isHeaderHidden = false;
      gsap.to(headerEl, {
        y: '0%',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }

  lastScrollPosition = currentY;
}

lenis.on('scroll', (e) => {
  onScrollUpdate(e.scroll);
});
window.addEventListener('scroll', () => {
  onScrollUpdate(window.scrollY);
}, { passive: true });

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
const cartDrawer = document.querySelector('[data-cart]');
const menuDrawer = document.querySelector('[data-menu]');

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
