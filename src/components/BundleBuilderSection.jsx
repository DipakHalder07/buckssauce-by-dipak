import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

const bundleFlavors = [
  { id: 'pineapple-sriracha', name: 'Pineapple Sriracha', img: '/images/img_38.webp' },
  { id: 'habanero-garlic', name: 'Habanero Garlic', img: '/images/img_39.webp' },
  { id: 'cherry-garlic', name: 'Cherry Garlic', img: '/images/img_40.webp' },
  { id: 'peach-chipotle', name: 'Peach Chipotle', img: '/images/img_41.webp' }
];

export const BundleBuilderSection = () => {
  const { addToCart } = useCart();
  const [selectedBottles, setSelectedBottles] = useState([
    bundleFlavors[0],
    bundleFlavors[1]
  ]); // Start with 2 pre-filled so the user easily understands!

  const handleAddFlavor = (flavor) => {
    if (selectedBottles.length < 3) {
      setSelectedBottles([...selectedBottles, flavor]);
    }
  };

  const handleRemoveSlot = (index) => {
    setSelectedBottles(selectedBottles.filter((_, i) => i !== index));
  };

  const handleAddBundleToCart = () => {
    if (selectedBottles.length !== 3) return;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 }
    });

    const bundleTitle = `Custom 3-Pack (${selectedBottles.map((b) => b.name).join(', ')})`;
    addToCart({
      id: `bundle-${Date.now()}`,
      title: bundleTitle,
      price: 32.00,
      image: '/images/img_38.webp'
    });
  };

  const isComplete = selectedBottles.length === 3;
  const remaining = 3 - selectedBottles.length;

  return (
    <section id="bundle" className="relative p-container py-24 my-10 bg-foreground/5 rounded-3xl border border-foreground/15">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-theme/20 text-theme text-small font-bold uppercase tracking-wider mb-3">
            SAVE $4.00 ON EVERY 3-PACK
          </div>
          <h2 className="text-3xl sm:text-60 font-serif uppercase tracking-tight leading-none">
            BUILD YOUR 3 PACK
          </h2>
          <p className="text-foreground/70 mt-3 text-base sm:text-lg">
            Pick your favorites or mix and match all three. Discount automatically applied.
          </p>
        </div>

        {/* 3 Slots Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
          {[0, 1, 2].map((slotIdx) => {
            const bottle = selectedBottles[slotIdx];
            return (
              <div
                key={slotIdx}
                className={`relative h-72 rounded-2xl border-2 flex flex-col items-center justify-center p-6 transition-all duration-300 ${
                  bottle
                    ? 'border-theme/60 bg-background/80 shadow-xl'
                    : 'border-dashed border-foreground/30 bg-background/30'
                }`}
              >
                {bottle ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-between">
                    <button
                      onClick={() => handleRemoveSlot(slotIdx)}
                      className="absolute top-0 right-0 w-8 h-8 rounded-full bg-foreground/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-small font-bold transition-colors cursor-pointer"
                      title="Remove sauce"
                    >
                      ✕
                    </button>
                    <div className="flex-1 w-full flex items-center justify-center py-2">
                      <img
                        src={bottle.img}
                        alt={bottle.name}
                        className="h-44 w-auto object-contain filter drop-shadow-md transition-transform hover:scale-105"
                      />
                    </div>
                    <span className="font-serif text-lg font-bold text-center leading-tight">
                      {bottle.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <img
                      src="/images/img_42.svg"
                      alt="Empty bottle slot"
                      className="h-28 w-auto opacity-30 mb-3"
                    />
                    <span className="text-small font-bold uppercase tracking-wider text-foreground/50">
                      Slot {slotIdx + 1} Empty
                    </span>
                    <span className="text-tiny text-theme mt-1">Tap a flavor below</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Flavor Selection Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto mb-10">
          {bundleFlavors.map((flavor) => {
            const count = selectedBottles.filter((b) => b.id === flavor.id).length;
            return (
              <button
                key={flavor.id}
                onClick={() => handleAddFlavor(flavor)}
                disabled={selectedBottles.length >= 3}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-small font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedBottles.length >= 3
                    ? 'opacity-50 cursor-not-allowed border-foreground/20'
                    : 'border-foreground/30 hover:border-theme hover:bg-foreground/10 hover:scale-105'
                }`}
              >
                <span>+ {flavor.name}</span>
                {count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-theme text-background text-tiny flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pricing Bar & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto p-6 rounded-2xl bg-background border border-foreground/20 shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif font-bold text-theme">$32.00</span>
              <span className="text-lg line-through text-foreground/40 font-serif">$36.00</span>
              <span className="px-2.5 py-0.5 rounded-full bg-theme text-background text-tiny font-bold uppercase">
                Save $4
              </span>
            </div>
            <p className="text-tiny text-foreground/60 mt-1">
              {isComplete ? 'Ready to pack and ship!' : `Add ${remaining} more sauce${remaining > 1 ? 's' : ''} to complete`}
            </p>
          </div>

          <button
            onClick={handleAddBundleToCart}
            disabled={!isComplete}
            className={`px-8 py-4 rounded-xl font-serif text-lg font-bold uppercase tracking-wider transition-all duration-300 ${
              isComplete
                ? 'bg-foreground text-background hover:bg-theme cursor-pointer shadow-lg hover:scale-105'
                : 'bg-foreground/20 text-foreground/40 cursor-not-allowed'
            }`}
          >
            {isComplete ? 'ADD 3-PACK TO CART' : `ADD ${remaining} MORE`}
          </button>
        </div>
      </div>
    </section>
  );
};
