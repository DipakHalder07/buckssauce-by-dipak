import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import lottie from 'lottie-web';

const products = [
  {
    id: 'peach-chipotle',
    number: '01',
    name: 'Smoked Peach Chipotle',
    color: '#ef8f4a',
    bgRgb: 'rgb(239, 143, 74)',
    bottleImg: '/images/img_7.avif',
    price: 12.00,
    frontFruit: {
      img: '/images/img_11.avif',
      className: 'absolute -translate-y-1/2 w-25 h-25 lg:w-55 lg:h-55 top-6/10 left-0',
      lottie: '/lotties/heart_eyes.json',
      faceStyle: { top: '16%', left: '0%', width: '100%', aspectRatio: '1', transform: 'rotate(0deg) scaleX(1)' }
    },
    backFruit: {
      img: '/images/img_17.avif',
      className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-45 lg:h-45 top-4/10 lg:top-2/10 -right-1/10'
    }
  },
  {
    id: 'pineapple-sriracha',
    number: '02',
    name: 'Crushed Pineapple Sriracha',
    color: '#be8d3f',
    bgRgb: 'rgb(190, 141, 63)',
    bottleImg: '/images/img_8.avif',
    price: 12.00,
    frontFruit: {
      img: '/images/img_12.avif',
      className: 'absolute -translate-y-1/2 w-25 h-25 lg:w-55 lg:h-55 top-6/10 left-0',
      lottie: '/lotties/cool.json',
      faceStyle: { top: '10%', left: '0%', width: '105%', aspectRatio: '1', transform: 'rotate(7deg) scaleX(1)' }
    },
    backFruit: {
      img: '/images/img_15.avif',
      className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-45 lg:h-45 top-4/10 lg:top-2/10 -right-1/10'
    }
  },
  {
    id: 'habanero-garlic',
    number: '03',
    name: 'Crushed Habanero Garlic',
    color: '#f15726',
    bgRgb: 'rgb(241, 87, 38)',
    bottleImg: '/images/img_9.avif',
    price: 12.00,
    frontFruit: {
      img: '/images/img_13.avif',
      className: 'absolute -translate-y-1/2 w-30 h-30 lg:w-70 lg:h-70 top-6/10 left-8/10 -translate-x-1/2',
      lottie: '/lotties/fire_breathing.json',
      faceStyle: { top: '20%', left: '0%', width: '70%', aspectRatio: '1', transform: 'rotate(10deg) scaleX(-1)' }
    },
    backFruit: {
      img: '/images/img_16.avif',
      className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-45 lg:h-45 top-3/10 lg:top-2/10 left-0/10'
    }
  },
  {
    id: 'cherry-garlic',
    number: '04',
    name: 'Crushed Cherry Garlic',
    color: '#da1f27',
    bgRgb: 'rgb(218, 31, 39)',
    bottleImg: '/images/img_10.avif',
    price: 12.00,
    frontFruit: {
      img: '/images/img_14.avif',
      className: 'absolute -translate-y-1/2 w-25 h-25 lg:w-50 lg:h-50 top-6/10 left-0',
      lottie: '/lotties/sassy.json',
      faceStyle: { top: '40%', left: '0%', width: '110%', aspectRatio: '1', transform: 'rotate(0deg) scaleX(1)' }
    },
    backFruit: {
      img: '/images/img_17.avif',
      className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-45 lg:h-45 top-4/10 lg:top-2/10 -right-1/10'
    }
  }
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToCart, setActiveTheme } = useCart();

  const heroRef = useRef(null);
  const bottleRef = useRef(null);
  const circleRef = useRef(null);
  const circleInnerRef = useRef(null);
  const frontFruitRef = useRef(null);
  const backFruitRef = useRef(null);
  const faceHostRef = useRef(null);
  const lottieAnimRef = useRef(null);
  const bottleFloatRef = useRef(null);

  const activeProduct = products[currentIndex];

  useEffect(() => {
    setActiveTheme({
      name: activeProduct.name,
      color: activeProduct.color,
      bgRgb: activeProduct.bgRgb
    });
    document.documentElement.style.setProperty('--color-theme', activeProduct.color);
  }, [currentIndex, setActiveTheme, activeProduct]);

  // Load Lottie Face Animation on active fruit
  useEffect(() => {
    if (faceHostRef.current) {
      if (lottieAnimRef.current) {
        lottieAnimRef.current.destroy();
      }
      try {
        const anim = lottie.loadAnimation({
          container: faceHostRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: activeProduct.frontFruit.lottie
        });
        lottieAnimRef.current = anim;
      } catch (err) {
        console.warn('Lottie failed to load in React HeroSection:', err);
      }
    }
    return () => {
      if (lottieAnimRef.current) {
        lottieAnimRef.current.destroy();
      }
    };
  }, [currentIndex, activeProduct]);

  // Idle floating animation on bottle
  useEffect(() => {
    if (bottleRef.current) {
      if (bottleFloatRef.current) bottleFloatRef.current.kill();
      bottleFloatRef.current = gsap.to(bottleRef.current, {
        y: '+=10',
        rotate: '+=1.5',
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }
    return () => {
      if (bottleFloatRef.current) bottleFloatRef.current.kill();
    };
  }, [currentIndex]);

  // Background halo breathing pulse
  useEffect(() => {
    if (circleRef.current) {
      const pulse = gsap.to(circleRef.current, {
        scale: 0.94,
        ease: 'sine.inOut',
        duration: 2.2,
        repeat: -1,
        yoyo: true
      });
      return () => pulse.kill();
    }
  }, []);

  // Mouse Parallax Effect for Bottle, Front Fruit and Back Fruit
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isAnimating) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xNorm = (clientX / innerWidth - 0.5) * 2;
      const yNorm = (clientY / innerHeight - 0.5) * 2;

      if (bottleRef.current) {
        gsap.to(bottleRef.current, {
          x: xNorm * 18,
          y: yNorm * 14,
          rotationY: xNorm * 12,
          rotationX: -yNorm * 9,
          duration: 0.7,
          ease: 'power2.out'
        });
      }

      if (frontFruitRef.current) {
        gsap.to(frontFruitRef.current, {
          x: -xNorm * 16,
          y: -yNorm * 12,
          duration: 0.85,
          ease: 'power2.out'
        });
      }

      if (backFruitRef.current) {
        gsap.to(backFruitRef.current, {
          x: xNorm * 22,
          y: yNorm * 16,
          duration: 1.0,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % products.length;
        slideTo(nextIdx, 1);
      } else if (e.key === 'ArrowLeft') {
        const nextIdx = (currentIndex - 1 + products.length) % products.length;
        slideTo(nextIdx, -1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating]);

  const slideTo = (nextIdx, direction) => {
    if (isAnimating || nextIdx === currentIndex) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIdx);
        setIsAnimating(false);
      }
    });

    // 1. Circle compresses inward
    if (circleRef.current) {
      tl.to(circleRef.current, { scale: 0.5, duration: 0.35, ease: 'back.in(1.1)' }, 0);
      tl.to(circleRef.current, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.35);
    }

    // 2. Old bottle exits
    if (bottleRef.current) {
      tl.to(bottleRef.current, {
        scale: 0.25,
        xPercent: 100 * direction,
        rotate: 15 * direction,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in'
      }, 0);
    }

    // 3. Old fruits exit
    if (frontFruitRef.current) {
      tl.to(frontFruitRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0);
    }
    if (backFruitRef.current) {
      tl.to(backFruitRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0);
    }
  };

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + products.length) % products.length;
    slideTo(nextIdx, -1);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % products.length;
    slideTo(nextIdx, 1);
  };

  const handleQuickAdd = () => {
    addToCart({
      id: activeProduct.id,
      title: activeProduct.name,
      price: activeProduct.price,
      image: activeProduct.bottleImg
    });
  };

  return (
    <section
      ref={heroRef}
      data-home-hero="true"
      className="p-container mt-25! flex flex-col items-center overflow-hidden relative"
    >
      {/* Hero Headline (Exact live site typography) */}
      <div className="text-center lg:w-col-8 mx-auto z-20">
        <h1
          data-title="true"
          className="font-serif uppercase text-40 lg:text-100 leading-none tracking-tight"
        >
          <span className="block">
            <span>The</span> <span>BBQ</span> <span>sauce</span>
          </span>
          <span className="block text-foreground [-webkit-text-stroke:2px_var(--color-background)] mt-1">
            <span>that</span> <span>makes</span> <span>other</span> <span>sauces</span>
          </span>
          <span className="block italic font-serif mt-1">
            <span>insecure</span>
          </span>
        </h1>
      </div>

      {/* Hero Main Slider Stage */}
      <div className="w-full flex flex-col gap-2 h-[60vh] lg:h-[90vh] xl:h-[80vh] mt-26 overflow-x-clip">
        {/* Ticker & Indicators Bar */}
        <div className="relative flex items-center justify-center lg:justify-between lg:px-col-1 w-full">
          <div
            data-middle-bar="true"
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px border-t border-foreground/30 border-dashed -z-1"
          />
          <div className="flex items-center gap-1 font-serif text-small uppercase">
            <span className="inline-block whitespace-nowrap bg-background px-1">
              Product No.{activeProduct.number}
            </span>
          </div>

          <div className="hidden lg:flex items-center">
            <span className="inline-block whitespace-nowrap bg-background px-1 uppercase font-serif text-small">
              {activeProduct.name}
            </span>
          </div>
        </div>

        {/* Central Slider Row */}
        <div className="relative z-10 flex items-center justify-between px-4 lg:px-col-1 w-full grow">
          <div
            data-middle-bar="true"
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px border-t border-foreground/30 border-dashed -z-1"
          />

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Sauce"
            className="relative group/arrow shrink-0 flex items-center justify-center size-10 lg:size-[2.7em] cursor-pointer rounded-full bg-foreground border border-background text-background hover:bg-background hover:text-foreground transition-all duration-300 shadow-xl hover:scale-110 z-30"
          >
            <span className="text-xl font-serif leading-none -translate-x-0.5">←</span>
          </button>

          {/* Center Stage: Circle, Bottle, and Floating Animated Fruits */}
          <div
            data-slider="true"
            className="relative flex items-center justify-center w-full h-full"
          >
            <div className="relative w-full md:w-75 lg:w-125 xl:w-176 h-full flex items-center justify-center">
              {/* Halo Circle Backdrop */}
              <div
                ref={circleRef}
                data-bg-circle="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto aspect-square p-5 lg:p-10 flex items-center justify-center pointer-events-none will-change-transform z-0"
              >
                <div
                  ref={circleInnerRef}
                  data-bg-circle-inner="true"
                  className="w-9/10 aspect-square h-auto lg:w-full lg:h-full rounded-full transition-colors duration-700 shadow-[0_0_90px_rgba(0,0,0,0.65)]"
                  style={{ backgroundColor: activeProduct.color }}
                />
              </div>

              {/* Floating Back Fruit */}
              <div
                ref={backFruitRef}
                key={`back-${currentIndex}`}
                className={`${activeProduct.backFruit.className} pointer-events-none z-5 transition-transform duration-500`}
              >
                <img
                  src={activeProduct.backFruit.img}
                  alt="Back ingredient"
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                  draggable={false}
                />
              </div>

              {/* Central Bottle */}
              <div
                ref={bottleRef}
                key={`bottle-${currentIndex}`}
                className="relative z-10 w-6/10 lg:w-7/10 h-full flex items-center justify-center pointer-events-none select-none transition-transform duration-500"
                style={{ transform: 'rotate(5deg)' }}
              >
                <img
                  src={activeProduct.bottleImg}
                  alt={activeProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in duration-500"
                  draggable={false}
                />
              </div>

              {/* Floating Front Fruit with LIVE LOTTIE FACE ANIMATION */}
              <div
                ref={frontFruitRef}
                key={`front-${currentIndex}`}
                className={`${activeProduct.frontFruit.className} z-20 cursor-pointer transition-transform duration-500 group`}
                onMouseEnter={() => {
                  if (lottieAnimRef.current) lottieAnimRef.current.setSpeed(1.5);
                }}
                onMouseLeave={() => {
                  if (lottieAnimRef.current) lottieAnimRef.current.setSpeed(1.0);
                }}
              >
                <div className="relative w-full h-full object-contain select-none">
                  <img
                    src={activeProduct.frontFruit.img}
                    alt="Front ingredient"
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
                    draggable={false}
                  />

                  {/* Lottie Face Container with exact positioning */}
                  <div
                    className="absolute pointer-events-none"
                    style={activeProduct.frontFruit.faceStyle}
                  >
                    <div
                      ref={faceHostRef}
                      className="w-full h-full flex items-center justify-center overflow-visible"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Sauce"
            className="relative group/arrow shrink-0 flex items-center justify-center size-10 lg:size-[2.7em] cursor-pointer rounded-full bg-foreground border border-background text-background hover:bg-background hover:text-foreground transition-all duration-300 shadow-xl hover:scale-110 z-30"
          >
            <span className="text-xl font-serif leading-none translate-x-0.5">→</span>
          </button>
        </div>

        {/* Bottom CTA Bar (Shop Now) */}
        <div
          data-bottom-bar="true"
          className="relative flex items-center justify-center lg:px-col-1 w-full z-20"
        >
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px border-t border-foreground/30 border-dashed -z-1" />

          <a
            className="px-1 bg-background"
            href={`https://buckssauce.com/shop/${activeProduct.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleQuickAdd();
            }}
          >
            <div className="group/button relative cursor-pointer flex items-center lg:min-w-48 lg:min-h-18 justify-center px-3 lg:px-5 py-4 lg:py-3 font-serif uppercase text-xl rounded-xl text-background text-26! w-75 overflow-hidden">
              <div
                data-button-bg="true"
                className="absolute inset-0 overflow-hidden border-2 rounded-xl bg-foreground border-foreground transition-colors group-hover/button:bg-background group-hover/button:text-foreground"
              />
              <div className="relative z-20 font-bold tracking-wider">
                <span className="relative">
                  <span
                    className="relative inline-flex items-center justify-center text-current group-hover/button:-translate-y-full group-hover/button:opacity-0 transition-all duration-300"
                    data-text-first="true"
                  >
                    Shop Now
                  </span>
                  <span
                    className="absolute inline-flex items-center justify-center inset-0 opacity-0 translate-y-full group-hover/button:translate-y-0 group-hover/button:opacity-100 text-current transition-all duration-300"
                    data-text-second="true"
                  >
                    Shop Now
                  </span>
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
