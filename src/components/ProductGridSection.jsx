import React from 'react';
import { useCart } from '../context/CartContext';
import { LeftAntlerBadge, RightAntlerBadge } from './Icons';

const sauces = [
  {
    id: 'pineapple-sriracha',
    title: 'Crushed Pineapple Sriracha',
    price: 12.00,
    tag: 'SWEET HEAT LEVEL: MEDIUM',
    desc: 'Sweet crushed pineapple upfront with balanced heat and a punchy garlic finish. Perfect on pulled pork, wings, grilled chicken, and pizza.',
    bottleImg: '/images/img_30_bottle.avif',
    frontFruit: '/images/img_31_pineapple_draggable_false_load.avif',
    backFruit: '/images/img_32_pineapple_draggable_false_load.avif',
    accentColor: '#be8d3f'
  },
  {
    id: 'habanero-garlic',
    title: 'Crushed Habanero Garlic',
    price: 12.00,
    tag: 'BOLD HEAT LEVEL: HOT',
    desc: 'Fiery habanero peppers roasted low and slow with sweet whole garlic cloves. Savory, bright, and intensely satisfying on ribs and smash burgers.',
    bottleImg: '/images/img_9.avif',
    frontFruit: '/images/img_33_habanero_draggable_false_loadi.avif',
    backFruit: '/images/img_34_habanero_draggable_false_loadi.avif',
    accentColor: '#f15726'
  },
  {
    id: 'cherry-garlic',
    title: 'Crushed Cherry Garlic',
    price: 12.00,
    tag: 'UMAMI HEAT LEVEL: MEDIUM-MILD',
    desc: 'Tart Michigan black cherries simmered with slow-roasted garlic and black peppercorn. Incredible glaze for brisket, venison, ribs, and duck.',
    bottleImg: '/images/img_10.avif',
    frontFruit: '/images/img_35_cherry_front.avif',
    backFruit: '/images/img_36_cherry_back.avif',
    accentColor: '#da1f27'
  },
  {
    id: 'peach-chipotle',
    title: 'Smoked Peach Chipotle',
    price: 12.00,
    tag: 'SMOKY HEAT LEVEL: BALANCED',
    desc: 'Juicy Georgia peaches hickory-smoked with crushed chipotle morita peppers. Warm campfire smoke meets caramelized stone fruit.',
    bottleImg: '/images/img_7.avif',
    frontFruit: '/images/img_37.avif',
    backFruit: '/images/img_11.avif',
    accentColor: '#ef8f4a'
  }
];

export const ProductGridSection = () => {
  const { addToCart } = useCart();

  return (
    <section id="sauces" className="relative p-container py-20 flex flex-col items-center">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-small font-bold uppercase tracking-widest text-theme">
          THE LINEUP
        </span>
        <h2 className="text-3xl sm:text-60 font-serif uppercase tracking-tight mt-2">
          CHOOSE YOUR WEAPON
        </h2>
        <p className="text-foreground/70 mt-3 text-base sm:text-lg">
          Four distinct profiles. Zero fillers. Built to elevate everything that comes off your grill.
        </p>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
        {sauces.map((sauce) => (
          <div
            key={sauce.id}
            data-listing-card="true"
            className="group relative rounded-3xl border border-foreground/20 bg-background/60 backdrop-blur-md p-8 lg:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-theme hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Background Antler Watermark */}
            <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
              <RightAntlerBadge className="w-24 h-auto text-foreground" />
            </div>

            {/* Top Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 10, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <span
                  style={{ backgroundColor: sauce.accentColor }}
                  className="text-tiny font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full text-background font-sans inline-block"
                >
                  {sauce.tag}
                </span>
                <span className="text-2xl font-serif font-bold text-foreground">
                  ${sauce.price.toFixed(2)}
                </span>
              </div>

              <h3 className="text-2xl sm:text-36 font-serif uppercase tracking-tight" style={{ lineHeight: 1.1, marginTop: '4px' }}>
                {sauce.title}
              </h3>

              <p className="text-small text-foreground/75 leading-relaxed" style={{ marginTop: '4px' }}>
                {sauce.desc}
              </p>
            </div>

            {/* Visual Bottle Container with Floating Fruit */}
            <div className="relative w-full h-64 sm:h-72 my-4 flex items-center justify-center">
              {/* Back Fruit cutout */}
              <div className="absolute top-4 left-10 w-24 h-24 pointer-events-none group-hover:-translate-x-4 group-hover:-translate-y-2 transition-transform duration-500">
                <img
                  src={sauce.backFruit}
                  alt="Ingredient"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>

              {/* Central Bottle */}
              <div className="relative z-10 h-full w-auto flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500">
                <img
                  src={sauce.bottleImg}
                  alt={sauce.title}
                  className="h-full w-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Front Fruit cutout */}
              <div className="absolute bottom-2 right-10 w-24 h-24 z-20 pointer-events-none group-hover:translate-x-4 group-hover:translate-y-2 transition-transform duration-500">
                <img
                  src={sauce.frontFruit}
                  alt="Ingredient"
                  className="w-full h-full object-contain filter drop-shadow-xl"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-foreground/10 flex items-center gap-4">
              <button
                onClick={() =>
                  addToCart({
                    id: sauce.id,
                    title: sauce.title,
                    price: sauce.price,
                    image: sauce.bottleImg
                  })
                }
                className="flex-1 py-3.5 rounded-xl font-serif text-lg font-bold uppercase tracking-wider bg-foreground text-background hover:bg-theme transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>QUICK ADD</span>
                <span>•</span>
                <span>${sauce.price.toFixed(2)}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
