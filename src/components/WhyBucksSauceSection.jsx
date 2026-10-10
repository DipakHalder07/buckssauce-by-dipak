import React, { useState } from 'react';
import { BucksCircularText, BucksLogo } from './Icons';

const reasons = [
  {
    number: '01',
    title: 'Small Batches',
    subtitle: 'KETTLE CRAFTED',
    copy: 'Cooked in small kettles, not industrial silos. Every batch is tasted and adjusted by our team to ensure peak quality, consistency, and depth.'
  },
  {
    number: '02',
    title: 'Real Ingredients',
    subtitle: 'NATURE’S BEST',
    copy: 'Fresh crushed pineapple, dark Michigan cherries, and ripe Georgia peaches. Real fruit creates real sweetness—no industrial syrups required.'
  },
  {
    number: '03',
    title: 'Oh, This?',
    subtitle: 'ANYTHING GOES',
    copy: 'Versatility is our superpower. Glaze low-and-slow ribs, finish hot wings, toss with crispy fries, marinate flank steak, or dunk grilled cheese.'
  }
];

export const WhyBucksSauceSection = () => {
  const [activeReason, setActiveReason] = useState(0);

  return (
    <section id="why-bucks" className="relative p-container py-24 my-16 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Rotating Badge & Bottle */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Circular Rotating Arched Text */}
          <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center animate-[spin_25s_linear_infinite]">
            <BucksCircularText className="w-full h-full text-foreground/40" />
          </div>

          {/* Center Emblem inside the Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full border border-theme/40 bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <BucksLogo className="w-14 h-auto text-theme" />
            </div>
          </div>
        </div>

        {/* Right Column: Reasons Carousel & Dial */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-small font-bold uppercase tracking-widest text-theme">
              THE BUCKS DIFFERENCE
            </span>
            <h2 className="text-3xl sm:text-50 font-serif uppercase tracking-tight mt-1">
              WHY BUCKS SAUCE?
            </h2>
          </div>

          {/* Reason Tabs Selector */}
          <div className="flex gap-4 mb-8 border-b border-foreground/15 pb-4">
            {reasons.map((r, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReason(idx)}
                className={`flex items-center gap-2 pb-2 text-lg font-serif font-bold transition-all cursor-pointer ${
                  activeReason === idx
                    ? 'text-theme border-b-2 border-theme'
                    : 'text-foreground/40 hover:text-foreground'
                }`}
              >
                <span>{r.number}</span>
                <span className="hidden sm:inline">{r.title}</span>
              </button>
            ))}
          </div>

          {/* Active Reason Display */}
          <div className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-tiny font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-theme/20 text-theme">
                {reasons[activeReason].subtitle}
              </span>
              <span className="text-4xl font-serif font-bold text-foreground/20">
                {reasons[activeReason].number}
              </span>
            </div>

            <h3 className="text-2xl sm:text-36 font-serif uppercase tracking-tight mb-3">
              {reasons[activeReason].title}
            </h3>

            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
              {reasons[activeReason].copy}
            </p>
          </div>

          {/* Interactive Dial Next / Prev Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setActiveReason((prev) => (prev === 0 ? reasons.length - 1 : prev - 1))}
              className="px-5 py-2.5 rounded-xl border border-foreground/30 text-small font-bold font-serif uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer"
            >
              ← PREV
            </button>
            <button
              onClick={() => setActiveReason((prev) => (prev === reasons.length - 1 ? 0 : prev + 1))}
              className="px-5 py-2.5 rounded-xl border border-foreground/30 text-small font-bold font-serif uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer"
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
