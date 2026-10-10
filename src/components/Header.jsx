import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { BucksLogo, CartBagIcon, HamburgerIcon } from './Icons';

export const Header = () => {
  const { totalCount, openCart, openMenu } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Notification Banner */}
      <div
        data-banner="true"
        className="w-full bg-theme text-background py-2 text-center text-small font-bold uppercase tracking-wider transition-colors duration-500 z-50 relative"
      >
        <div className="flex items-center justify-center gap-2">
          <span>FREE SHIPPING ON ORDERS OVER $50</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">100% REAL INGREDIENTS</span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        data-nav="true"
        className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 pointer-events-none ${
          isScrolled ? 'py-2 bg-background/90 backdrop-blur-md border-b border-foreground/10 shadow-lg' : 'py-3 bg-transparent'
        }`}
      >
        <div className="p-container flex items-center justify-between pointer-events-auto">
          {/* Left: Hamburger Menu Button */}
          <button
            onClick={openMenu}
            aria-label="Open Menu"
            className="group/button relative cursor-pointer flex items-center justify-center px-4 py-2 font-serif uppercase text-small rounded-xl text-foreground hover:text-background transition-colors"
          >
            <div
              data-button-bg="true"
              className="absolute inset-0 border border-foreground/30 rounded-xl bg-background/60 group-hover/button:bg-foreground transition-all duration-300"
            />
            <div className="relative z-10 flex items-center gap-2">
              <HamburgerIcon className="w-5 h-3 text-current transition-colors" />
              <span className="hidden sm:inline font-bold tracking-wider">MENU</span>
            </div>
          </button>

          {/* Center: Bucks Sauce Antler Logo */}
          <a
            href="/"
            className="group flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-300"
            aria-label="Bucks Sauce Home"
          >
            <BucksLogo className="w-12 sm:w-16 h-auto text-foreground transition-colors group-hover:text-theme" />
          </a>

          {/* Right: Desktop Links + Cart Button */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-small font-bold uppercase tracking-wider text-foreground/90">
              <a href="#sauces" className="hover:text-theme transition-colors">
                Sauces
              </a>
              <a href="#features" className="hover:text-theme transition-colors">
                Our Secret
              </a>
              <a href="#bundle" className="hover:text-theme transition-colors">
                Bundle & Save
              </a>
              <a href="#why-bucks" className="hover:text-theme transition-colors">
                Why Bucks
              </a>
              <a href="#reviews" className="hover:text-theme transition-colors">
                Reviews
              </a>
            </nav>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              aria-label="Open Cart"
              className="group/button relative cursor-pointer flex items-center justify-center px-4 py-2 font-serif uppercase text-small rounded-xl text-foreground hover:text-background transition-colors"
            >
              <div
                data-button-bg="true"
                className="absolute inset-0 border border-foreground/30 rounded-xl bg-background/60 group-hover/button:bg-foreground transition-all duration-300"
              />
              <div className="relative z-10 flex items-center gap-2">
                <CartBagIcon className="w-5 h-5 text-current transition-colors" />
                <span className="font-bold tracking-wider">CART</span>
                <span className="ml-1 w-5 h-5 rounded-full bg-theme text-background text-tiny flex items-center justify-center font-bold">
                  {totalCount}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
