import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';

const products = [
  {
    id: 'peach-chipotle',
    number: '01',
    name: 'Smoked Peach Chipotle',
    color: '#ef8f4a',
    bgRgb: 'rgb(239, 143, 74)',
    bottleImg: '/images/img_10.avif',
    price: 12.00,
    frontFruits: [
      { img: '/images/img_11.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-3/10 left-0' },
      { img: '/images/img_12.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-7/10 left-1/10' }
    ],
    backFruits: [
      { img: '/images/img_13.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-2/10 right-0' },
      { img: '/images/img_14.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-6/10 right-1/10' }
    ]
  },
  {
    id: 'pineapple-sriracha',
    number: '02',
    name: 'Crushed Pineapple Sriracha',
    color: '#be8d3f',
    bgRgb: 'rgb(190, 141, 63)',
    bottleImg: '/images/img_7.avif',
    price: 12.00,
    frontFruits: [
      { img: '/images/img_15.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-3/10 left-0' },
      { img: '/images/img_16.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-7/10 left-1/10' }
    ],
    backFruits: [
      { img: '/images/img_17.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-2/10 right-0' },
      { img: '/images/img_11.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-6/10 right-1/10' }
    ]
  },
  {
    id: 'habanero-garlic',
    number: '03',
    name: 'Crushed Habanero Garlic',
    color: '#f15726',
    bgRgb: 'rgb(241, 87, 38)',
    bottleImg: '/images/img_8.avif',
    price: 12.00,
    frontFruits: [
      { img: '/images/img_12.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-3/10 left-0' },
      { img: '/images/img_13.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-7/10 left-1/10' }
    ],
    backFruits: [
      { img: '/images/img_14.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-2/10 right-0' },
      { img: '/images/img_15.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-6/10 right-1/10' }
    ]
  },
  {
    id: 'cherry-garlic',
    number: '04',
    name: 'Crushed Cherry Garlic',
    color: '#da1f27',
    bgRgb: 'rgb(218, 31, 39)',
    bottleImg: '/images/img_9.avif',
    price: 12.00,
    frontFruits: [
      { img: '/images/img_16.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-3/10 left-0' },
      { img: '/images/img_17.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-7/10 left-1/10' }
    ],
    backFruits: [
      { img: '/images/img_11.avif', className: 'absolute -translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 top-2/10 right-0' },
      { img: '/images/img_12.avif', className: 'absolute -translate-y-1/2 w-16 h-16 lg:w-28 lg:h-28 top-6/10 right-1/10' }
    ]
  }
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart, setActiveTheme } = useCart();
  const heroRef = useRef(null);
  const bottleRef = useRef(null);
  const circleRef = useRef(null);

  const activeProduct = products[currentIndex];

  useEffect(() => {
    setActiveTheme({
      name: activeProduct.name,
      color: activeProduct.color,
      bgRgb: activeProduct.bgRgb
    });
  }, [currentIndex, setActiveTheme, activeProduct]);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 35;
      const y = (clientY / innerHeight - 0.5) * 35;

      if (bottleRef.current) {
        gsap.to(bottleRef.current, {
          x: x * 0.35,
          y: y * 0.35,
          rotationY: x * 0.25,
          rotationX: -y * 0.25,
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      const parallaxItems = heroRef.current?.querySelectorAll('[data-parallax-food]');
      parallaxItems?.forEach((el, idx) => {
        const factor = (idx % 2 === 0 ? 1 : -1) * (0.6 + idx * 0.2);
        gsap.to(el, {
          x: x * factor,
          y: y * factor,
          duration: 1.2,
          ease: 'power2.out'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
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
      className="p-container flex flex-col items-center pt-2 lg:pt-6 overflow-hidden relative"
    >
      {/* Hero Headline */}
      <div className="text-center w-full max-w-6xl mx-auto z-20">
        <h1
          data-title="true"
          className="text-4xl sm:text-60 lg:text-100 uppercase font-serif tracking-tight leading-none"
        >
          <span className="block font-normal text-background [-webkit-text-stroke:2px_var(--color-foreground)] transition-all">
            The BBQ sauce
          </span>
          <span className="block text-foreground mt-1">
            that makes other sauces
          </span>
          <span className="block text-foreground italic font-serif">
            insecure
          </span>
        </h1>
      </div>

      {/* Product Odometer Counter & Title Bar */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mt-6 z-20 px-4">
        {/* Number Ticker */}
        <div className="flex items-center gap-1 font-serif text-2xl font-bold">
          <span className="text-foreground/50">0</span>
          <span className="text-theme transition-colors duration-500">
            {currentIndex + 1}
          </span>
          <span className="text-foreground/30 text-base font-normal">/ 04</span>
        </div>

        {/* Product Name Display */}
        <div className="text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-foreground/10 text-small font-bold uppercase tracking-widest text-foreground transition-all duration-300">
            {activeProduct.name}
          </span>
        </div>

        {/* Heat Badge */}
        <div className="text-small font-bold tracking-wider text-theme uppercase">
          ★ SMALL BATCH
        </div>
      </div>

      {/* Main Interactive Carousel Stage */}
      <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] lg:h-[520px] flex items-center justify-center my-4">
        {/* Horizontal Dotted Guide Line across arrows */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px border-t border-foreground/20 border-dashed z-0 pointer-events-none" />

        {/* Rotating Circular Halo Backdrop */}
        <div
          ref={circleRef}
          data-bg-circle="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] lg:w-[440px] aspect-square rounded-full flex items-center justify-center pointer-events-none z-0"
        >
          <div
            data-bg-circle-inner="true"
            className="w-full h-full rounded-full transition-colors duration-700 opacity-90 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            style={{ backgroundColor: activeProduct.color }}
          />
        </div>

        {/* Floating Back Ingredients */}
        <div className="absolute inset-0 pointer-events-none z-5">
          {activeProduct.backFruits.map((fruit, idx) => (
            <div
              key={idx}
              data-parallax-food="true"
              className={`${fruit.className} transition-opacity duration-700`}
            >
              <img
                src={fruit.img}
                alt="Floating ingredient"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Sauce"
          className="group absolute left-2 sm:left-6 lg:left-8 z-30 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-foreground/30 bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer shadow-xl hover:scale-110"
        >
          <span className="text-2xl font-serif leading-none -translate-x-0.5">←</span>
        </button>

        {/* Central Bottle Container */}
        <div
          ref={bottleRef}
          data-bottle-shell="true"
          className="relative z-10 w-36 sm:w-48 lg:w-56 h-[340px] sm:h-[420px] lg:h-[460px] flex items-center justify-center pointer-events-none select-none transition-transform duration-500"
        >
          <img
            key={activeProduct.id}
            src={activeProduct.bottleImg}
            alt={activeProduct.name}
            className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in duration-500"
            draggable={false}
          />
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next Sauce"
          className="group absolute right-2 sm:right-6 lg:right-8 z-30 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-foreground/30 bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer shadow-xl hover:scale-110"
        >
          <span className="text-2xl font-serif leading-none translate-x-0.5">→</span>
        </button>

        {/* Floating Front Ingredients */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {activeProduct.frontFruits.map((fruit, idx) => (
            <div
              key={idx}
              data-parallax-food="true"
              className={`${fruit.className} transition-opacity duration-700`}
            >
              <img
                src={fruit.img}
                alt="Floating ingredient front"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar with Quick Add */}
      <div
        data-bottom-bar="true"
        className="relative flex items-center justify-center w-full max-w-xl z-20 my-4"
      >
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px border-t border-foreground/30 border-dashed -z-1" />

        <button
          onClick={handleQuickAdd}
          className="group/button relative cursor-pointer flex items-center justify-center px-8 py-4 font-serif uppercase text-xl rounded-xl text-background bg-foreground hover:bg-theme transition-all duration-300 shadow-2xl hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider">ADD TO CART</span>
            <span className="text-small font-sans opacity-60">•</span>
            <span className="font-bold font-sans">${activeProduct.price.toFixed(2)}</span>
          </div>
        </button>
      </div>
    </section>
  );
};
