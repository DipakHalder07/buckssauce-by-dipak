import React from 'react';

const reviews = [
  {
    id: 1,
    handle: '@barrybites1',
    role: 'Food Creator & Grill Master',
    quote: 'Hands down the best pineapple sriracha I have ever put on wings. Sweet, sticky, and just the right kick.',
    product: 'Crushed Pineapple Sriracha'
  },
  {
    id: 2,
    handle: '@laurynclare_',
    role: 'Home Chef',
    quote: 'Finally a BBQ sauce without high fructose corn syrup that tastes like a luxury restaurant recipe.',
    product: 'Crushed Cherry Garlic'
  },
  {
    id: 3,
    handle: '@cool_bobb_bbq',
    role: 'Competitive Pitmaster',
    quote: 'Smoked Peach Chipotle made my brisket glaze the talk of the block. The smoke level is dialed in.',
    product: 'Smoked Peach Chipotle'
  },
  {
    id: 4,
    handle: '@munchies_with_melly',
    role: 'Culinary Reviewer',
    quote: 'The habanero garlic has real authentic pepper heat without burning away the savory garlic punch.',
    product: 'Crushed Habanero Garlic'
  },
  {
    id: 5,
    handle: '@whereismarcus__',
    role: 'BBQ Enthusiast',
    quote: 'Ordered the 3-pack and drained two bottles in a week. I put this on pizza, eggs, and smoked chicken.',
    product: 'Custom 3-Pack'
  },
  {
    id: 6,
    handle: '@smokey_dan',
    role: 'Pitmaster',
    quote: 'The ingredient quality is noticeably cleaner. No synthetic aftertaste, just pure wood-fired flavor.',
    product: 'Smoked Peach Chipotle'
  }
];

export const ReviewsSection = () => {
  return (
    <section id="reviews" className="relative py-24 overflow-hidden border-t border-b border-foreground/10 bg-foreground/2">
      {/* Title */}
      <div className="p-container text-center max-w-3xl mx-auto mb-14">
        <span className="text-small font-bold uppercase tracking-widest text-theme">
          COMMUNITY FEEDBACK
        </span>
        <h2 className="text-3xl sm:text-60 font-serif uppercase tracking-tight mt-2">
          REAL PEOPLE. REAL REVIEWS.
        </h2>
        <div className="flex items-center justify-center gap-1 mt-3 text-theme">
          {'★'.repeat(5)}
          <span className="ml-2 text-foreground/80 text-small font-bold">
            Over 2,400+ 5-Star Reviews
          </span>
        </div>
      </div>

      {/* Infinite Scrolling Ticker (Row 1) */}
      <div className="flex gap-6 w-max animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused] py-2">
        {[...reviews, ...reviews].map((rev, idx) => (
          <div
            key={idx}
            className="w-[340px] sm:w-[400px] shrink-0 p-8 rounded-2xl border border-foreground/15 bg-background shadow-lg flex flex-col justify-between hover:border-theme transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-theme text-sm">★★★★★</div>
                <span className="text-tiny font-bold uppercase tracking-wider text-theme bg-theme/10 px-2 py-0.5 rounded-full">
                  Verified Buyer
                </span>
              </div>
              <p className="text-base font-serif italic text-foreground/90 leading-relaxed mb-6">
                "{rev.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-foreground/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-small text-foreground block">{rev.handle}</span>
                <span className="text-tiny text-foreground/50">{rev.role}</span>
              </div>
              <span className="text-tiny font-serif text-theme font-bold">{rev.product}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
