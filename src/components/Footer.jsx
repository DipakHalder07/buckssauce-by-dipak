import React, { useState } from 'react';
import { BucksLargeBanner, BucksLogo } from './Icons';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="relative p-container pt-20 pb-12 overflow-hidden border-t border-foreground/15">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Newsletter Signup Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b border-foreground/10">
          <div className="lg:col-span-6">
            <span className="text-small font-bold uppercase tracking-widest text-theme">
              JOIN THE BUCKS CLUB
            </span>
            <h3 className="text-3xl sm:text-50 font-serif uppercase tracking-tight mt-1 leading-none">
              TASTE FIRST. HEAR FIRST.
            </h3>
            <p className="text-foreground/70 mt-3 max-w-md text-base">
              Get 10% off your first order, private small-batch flavor releases, and secret grill master recipes.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start lg:items-end">
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl border border-foreground/30 bg-background text-foreground placeholder:text-foreground/40 focus:border-theme focus:ring-1 focus:ring-theme transition-all outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-foreground text-background font-serif text-base font-bold uppercase tracking-wider hover:bg-theme transition-all duration-300 cursor-pointer whitespace-nowrap shadow-md"
              >
                {isSubscribed ? 'WELCOME! 🎉' : 'GET 10% OFF'}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-tiny text-theme mt-2 font-bold">
                You're officially in the Bucks Club! Use code BUCKS10 at checkout.
              </p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-small font-bold uppercase tracking-wider">
          <div>
            <h4 className="text-foreground/40 mb-4 font-sans text-tiny">SHOP</h4>
            <ul className="flex flex-col gap-3 text-foreground/80">
              <li>
                <a href="#sauces" className="hover:text-theme transition-colors">
                  All Sauces
                </a>
              </li>
              <li>
                <a href="#bundle" className="hover:text-theme transition-colors">
                  3-Pack Bundle
                </a>
              </li>
              <li>
                <a href="#sauces" className="hover:text-theme transition-colors">
                  Pineapple Sriracha
                </a>
              </li>
              <li>
                <a href="#sauces" className="hover:text-theme transition-colors">
                  Smoked Peach Chipotle
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground/40 mb-4 font-sans text-tiny">ABOUT</h4>
            <ul className="flex flex-col gap-3 text-foreground/80">
              <li>
                <a href="#features" className="hover:text-theme transition-colors">
                  Our Ingredients
                </a>
              </li>
              <li>
                <a href="#why-bucks" className="hover:text-theme transition-colors">
                  Small Batch Process
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-theme transition-colors">
                  Reviews & Press
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-theme transition-colors">
                  Wholesale & Food Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground/40 mb-4 font-sans text-tiny">HELP</h4>
            <ul className="flex flex-col gap-3 text-foreground/80">
              <li>
                <a href="#footer" className="hover:text-theme transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-theme transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-theme transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-theme transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground/40 mb-4 font-sans text-tiny">FOLLOW</h4>
            <ul className="flex flex-col gap-3 text-foreground/80">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-theme transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-theme transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-theme transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-theme transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Iconic Bucks Sauce Typography Banner */}
        <div className="w-full pt-8 pb-4 border-t border-foreground/10 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
          <BucksLargeBanner className="w-full max-w-5xl h-auto text-foreground" />
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-tiny text-foreground/50 pt-4 border-t border-foreground/10 gap-4">
          <div className="flex items-center gap-2">
            <BucksLogo className="w-6 h-auto text-theme" />
            <span>© 2026 Bucks Sauce LLC. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#terms" className="hover:text-foreground">
              Terms of Service
            </a>
            <a href="#privacy" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#do-not-sell" className="hover:text-foreground">
              Do Not Sell My Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
