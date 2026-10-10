import React from 'react';
import { useCart } from '../context/CartContext';
import { CloseIcon, BucksLogo } from './Icons';
import confetti from 'canvas-confetti';

export const CartDrawer = () => {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, subtotal, totalCount } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 50.0;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert('Thank you for ordering Bucks Sauce! Checkout simulated successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div className="relative z-10 w-full max-w-md h-full bg-background border-l border-foreground/20 flex flex-col justify-between p-6 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-foreground/10">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold uppercase tracking-wide">YOUR CART</span>
              <span className="w-6 h-6 rounded-full bg-theme text-background text-tiny flex items-center justify-center font-bold">
                {totalCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2.5 rounded-full border border-foreground/30 hover:bg-foreground hover:text-background transition-colors"
              aria-label="Close Cart"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="py-4 border-b border-foreground/10">
            <div className="flex justify-between text-small font-bold mb-2">
              <span>
                {remainingForFreeShipping > 0
                  ? `Add $${remainingForFreeShipping.toFixed(2)} for FREE SHIPPING`
                  : '🎉 FREE SHIPPING UNLOCKED!'}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full bg-theme transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-theme, #ef8f4a)' }}
              />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <img
                src="/images/img_6_empty_bottle.webp"
                alt="Empty Cart"
                className="w-32 h-auto opacity-70 mb-4"
              />
              <p className="font-serif text-xl mb-2">Your cart is feeling insecure.</p>
              <p className="text-small text-foreground/60 mb-6">Add some sauce to make things right.</p>
              <button
                onClick={closeCart}
                className="px-6 py-3 rounded-xl border border-foreground/40 font-serif uppercase text-small font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                BROWSE SAUCES
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-foreground/5 border border-foreground/10"
              >
                <div className="w-16 h-20 shrink-0 bg-background rounded-lg p-1 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-base font-bold leading-tight">{item.title}</h4>
                  <p className="text-small text-theme font-bold mt-0.5">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded border border-foreground/30 flex items-center justify-center text-small hover:bg-foreground hover:text-background transition-colors"
                    >
                      -
                    </button>
                    <span className="text-small font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded border border-foreground/30 flex items-center justify-center text-small hover:bg-foreground hover:text-background transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-tiny text-foreground/50 hover:text-red-500 uppercase font-bold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-foreground/10 flex flex-col gap-4">
            <div className="flex justify-between text-lg font-serif">
              <span>SUBTOTAL</span>
              <span className="font-bold font-sans">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-tiny text-foreground/60 text-center">
              Shipping & taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-foreground text-background font-serif text-xl font-bold uppercase tracking-wider hover:bg-theme hover:text-background transition-all duration-300 shadow-lg cursor-pointer"
            >
              PROCEED TO CHECKOUT (${subtotal.toFixed(2)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
