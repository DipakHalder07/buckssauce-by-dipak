import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CloseIcon, BucksLogo } from './Icons';

const menuLinks = [
  { title: 'SHOP ALL SAUCES', href: '#sauces', image: '/images/img_1.avif' },
  { title: 'SMOKED PEACH CHIPOTLE', href: '#sauces', image: '/images/img_2.avif' },
  { title: 'CRUSHED PINEAPPLE SRIRACHA', href: '#sauces', image: '/images/img_3.avif' },
  { title: 'CRUSHED HABANERO GARLIC', href: '#sauces', image: '/images/img_4.avif' },
  { title: 'CRUSHED CHERRY GARLIC', href: '#sauces', image: '/images/img_5.avif' },
  { title: 'BUILD YOUR 3-PACK', href: '#bundle', image: '/images/img_1.avif' },
  { title: 'WHY BUCKS SAUCE', href: '#why-bucks', image: '/images/img_2.avif' },
  { title: 'CUSTOMER REVIEWS', href: '#reviews', image: '/images/img_3.avif' }
];

export const MenuDrawer = () => {
  const { isMenuOpen, closeMenu } = useCart();
  const [activeImage, setActiveImage] = useState(menuLinks[0].image);

  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
        onClick={closeMenu}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full h-full bg-background border-r border-foreground/20 flex flex-col justify-between p-6 lg:p-12 overflow-y-auto">
        {/* Top bar with Logo & Close */}
        <div className="flex items-center justify-between pb-8 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <BucksLogo className="w-10 h-auto text-foreground" />
            <span className="font-serif text-2xl font-bold tracking-tight">BUCKS SAUCE</span>
          </div>

          <button
            onClick={closeMenu}
            className="p-3 rounded-full border border-foreground/30 hover:bg-foreground hover:text-background transition-colors"
            aria-label="Close Menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8">
          {/* Navigation Links */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            {menuLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={closeMenu}
                onMouseEnter={() => setActiveImage(link.image)}
                className="group flex items-center justify-between py-2 text-3xl lg:text-50 font-serif uppercase tracking-tight text-foreground hover:text-theme transition-all duration-200"
              >
                <span className="group-hover:translate-x-3 transition-transform duration-300">
                  {link.title}
                </span>
                <span className="text-small font-sans opacity-0 group-hover:opacity-100 transition-opacity text-theme font-bold">
                  EXPLORE →
                </span>
              </a>
            ))}
          </div>

          {/* Hover Image Preview */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-foreground/20 shadow-2xl">
              <img
                src={activeImage}
                alt="Bucks sauce preview"
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-small uppercase tracking-widest text-theme font-bold">
                  SMALL-BATCH HANDCRAFTED
                </span>
                <p className="text-lg font-serif">Real Fruit. Bold Heat. Zero Shortcuts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in Menu */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-foreground/10 text-small text-foreground/70">
          <div className="flex gap-6 font-bold uppercase tracking-wider">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
              TikTok
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Facebook
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <span>© 2026 Bucks Sauce. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
