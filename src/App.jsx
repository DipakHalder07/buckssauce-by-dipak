import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { MenuDrawer } from './components/MenuDrawer';
import { CartDrawer } from './components/CartDrawer';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ProductGridSection } from './components/ProductGridSection';
import { BundleBuilderSection } from './components/BundleBuilderSection';
import { WhyBucksSauceSection } from './components/WhyBucksSauceSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export const App = () => {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <CartProvider>
      <div className="relative min-h-screen bg-background text-foreground selection:bg-theme selection:text-background font-sans overflow-x-hidden">
        {/* Navigation & Drawers */}
        <Header />
        <MenuDrawer />
        <CartDrawer />

        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <ProductGridSection />
          <BundleBuilderSection />
          <WhyBucksSauceSection />
          <ReviewsSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
