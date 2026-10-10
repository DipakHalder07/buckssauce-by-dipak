import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'No Corn Syrup',
    tag: 'CLEAN SWEETNESS',
    desc: 'Sweet is fine. Sugar-lab sweet is not. So we left the high fructose corn syrup on the bottom shelf where it belongs.',
    icon: '/images/img_26_no_hfc.svg',
    rotation: 'rotate-2',
    color: 'from-amber-900/30 to-background'
  },
  {
    title: 'No Seed Oils',
    tag: 'REAL FATS ONLY',
    desc: 'We skip the ultra-processed seed oils and use ingredients that actually belong in food. If it reads like a chemistry project, it’s not in this bottle.',
    icon: '/images/img_27_no_seed_oils_loading_lazy_widt.svg',
    rotation: '-rotate-2',
    color: 'from-orange-900/30 to-background'
  },
  {
    title: 'No Additives',
    tag: 'ZERO JUNK',
    desc: 'No preservatives. No artificial nonsense. No “what is that?” ingredients hiding behind words you can’t pronounce.',
    icon: '/images/img_28_no_additives_loading_lazy_widt.svg',
    rotation: 'rotate-3',
    color: 'from-red-900/30 to-background'
  },
  {
    title: 'Gluten Free',
    tag: 'PURE PERFORMANCE',
    desc: 'No gluten. No thickening tricks. No drama. Just sauce that plays nice with your diet and acts up on the grill.',
    icon: '/images/img_29_gluten_free_loading_lazy_width.svg',
    rotation: '-rotate-1',
    color: 'from-yellow-900/30 to-background'
  }
];

export const FeaturesSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-feature-card]', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative p-container py-24 my-16 overflow-hidden"
    >
      {/* Background Floating Food Ingredients */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-40">
        <img
          src="/images/img_18_food_loading_lazy_width_400_he.webp"
          alt="Ingredient background"
          className="absolute top-10 left-4 w-44 lg:w-64 rotate-12 filter blur-[1px]"
        />
        <img
          src="/images/img_19_food_loading_lazy_width_400_he.webp"
          alt="Ingredient background"
          className="absolute top-1/2 right-6 w-48 lg:w-72 -rotate-15 filter blur-[1px]"
        />
        <img
          src="/images/img_20_food_loading_lazy_width_400_he.webp"
          alt="Ingredient background"
          className="absolute bottom-10 left-1/3 w-40 lg:w-60 rotate-45 filter blur-[1px]"
        />
      </div>

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-small font-bold uppercase tracking-widest text-theme">
          THE BUCKS PHILOSOPHY
        </span>
        <h2 className="text-3xl sm:text-50 font-serif uppercase tracking-tight mt-2">
          MADE FOR TASTE, NOT SILLY SHELF LIFE
        </h2>
        <p className="text-foreground/70 mt-4 text-base sm:text-lg">
          We refused to make sauce the grocery store way. Here is our non-negotiable checklist.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feat, idx) => (
          <div
            key={idx}
            data-feature-card="true"
            className={`group relative p-8 rounded-2xl border border-foreground/20 bg-background/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-theme hover:shadow-2xl flex flex-col justify-between min-h-[340px] ${feat.rotation}`}
          >
            {/* Top Icon & Tag */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-tiny font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-foreground/10 text-theme">
                  {feat.tag}
                </span>
                <div className="w-14 h-14 rounded-full bg-foreground/5 p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={feat.icon}
                    alt={feat.title}
                    className="w-full h-full object-contain filter invert opacity-90"
                  />
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold uppercase tracking-tight mb-3">
                {feat.title}
              </h3>

              <p className="text-small leading-relaxed text-foreground/80">
                {feat.desc}
              </p>
            </div>

            {/* Bottom Accent line */}
            <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center justify-between text-tiny uppercase tracking-wider text-foreground/50">
              <span>CHECKED &amp; VERIFIED</span>
              <span className="text-theme font-bold">✓</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
