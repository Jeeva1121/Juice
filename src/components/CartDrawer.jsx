import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    freeShippingLeft,
    isFreeShipping,
    freeShippingThreshold,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    removeItem,
    toastMessage,
    isCheckingOut,
    setIsCheckingOut,
    orderConfirmed,
    setOrderConfirmed,
    completeOrder,
    addToCart,
  } = useCart()

  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  // Checkout form state
  const [formData, setFormData] = useState({
    fullName: 'Jeeva Kumar',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Greens, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    slot: 'Dawn Express (Juiced at 4 AM • Delivered 6 AM - 9 AM)',
    paymentMethod: 'upi',
  })

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false)
        setIsCheckingOut(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsCartOpen, setIsCheckingOut])

  const applyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')
    const code = promoCode.trim().toUpperCase()
    if (code === 'CLEAN10') {
      setDiscountPercent(10)
      setPromoSuccess('10% discount applied to your order!')
    } else if (code === 'ORGANIC') {
      setDiscountPercent(15)
      setPromoSuccess('15% Organic harvest discount applied!')
    } else if (code === 'FRESH') {
      setDiscountPercent(20)
      setPromoSuccess('20% Flash discount applied!')
    } else {
      setPromoError('Invalid promo code. Try CLEAN10 or ORGANIC')
    }
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const finalTotal = Math.max(0, subtotal - discountAmount)

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    completeOrder({
      ...formData,
      finalTotal,
      discountAmount,
    })
  }

  return (
    <>
      {/* Toast Notification (only shown when cart drawer is not currently open) */}
      {toastMessage && !isCartOpen && (
        <div className="fixed bottom-6 right-6 z-60 max-w-sm w-full bg-neutral-950/95 text-white backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-3 pr-4 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toastMessage.image && (
            <div className="w-11 h-11 shrink-0 bg-white/10 rounded-xl p-1.5 flex items-center justify-center border border-white/10">
              <img src={toastMessage.image} alt={toastMessage.title} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-coral) block">
              Added to Harvest Bag
            </span>
            <p className="text-xs font-semibold text-white truncate mt-0.5">
              {toastMessage.title}
            </p>
            <p className="text-[11px] text-neutral-400 truncate">
              {toastMessage.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-3 py-1.5 bg-white/15 hover:bg-(--color-coral) text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => {
              setIsCartOpen(false)
              setIsCheckingOut(false)
            }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg h-full bg-[#FAF5EA] border-l border-black/10 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header with Safe Area Top */}
            <div className="p-4 sm:p-6 pt-[calc(var(--sat)+1rem)] sm:pt-6 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="font-display text-xl font-black uppercase tracking-tight text-neutral-900">
                  Your Harvest Bag
                </span>
                <span className="px-2.5 py-0.5 bg-(--color-coral) text-white text-xs font-bold rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckingOut(false)
                }}
                aria-label="Close Bag"
                className="touch-target-44 w-11 h-11 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chilled Free Shipping Progress */}
            <div className="px-6 py-4 bg-white/70 backdrop-blur-md border-b border-black/5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-800">
                  {isFreeShipping ? (
                    <span className="text-neutral-900 font-bold flex items-center gap-1.5">
                      <span className="text-xs text-(--color-coral)">✦</span> Complimentary Chilled Nitrogen Dispatch Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <span className="font-bold text-(--color-coral)">₹{freeShippingLeft}</span> for Complimentary Delivery
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-mono font-medium text-neutral-400">
                  {Math.round(Math.min(100, (subtotal / freeShippingThreshold) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#FF9F1C] to-(--color-coral) rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#E8DEC8]/60">
              {items.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-neutral-900 rounded-none flex items-center justify-center mb-5 text-white">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-lg font-bold text-neutral-800 mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6">
                    Add single-origin organic formulations from our 4 iconic editions.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false)
                      const el = document.querySelector('#flavors')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-(--color-coral) transition-colors cursor-pointer rounded-none"
                  >
                    Explore 4 Editions
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.pack}`} className="py-4 bg-transparent border-b border-black/10 flex gap-4 items-start">
                    {/* Bottle thumbnail */}
                    <div className="w-16 h-20 bg-neutral-100/60 rounded-none flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative border border-black/5">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider block"
                            style={{ color: item.tagColor }}
                          >
                            {item.edition}
                          </span>
                          <h4 className="font-bold text-sm text-neutral-900 leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-xs text-neutral-500 font-medium">
                            {item.packName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.pack)}
                          aria-label="Remove item"
                          className="touch-target-44 text-neutral-400 hover:text-(--color-coral) transition-colors p-2 rounded-full hover:bg-black/5 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-black rounded-none bg-white p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.pack, -1)}
                            aria-label="Decrease quantity"
                            className="touch-target-44 w-8 h-8 rounded-none flex items-center justify-center text-neutral-600 hover:bg-black/5 transition-colors cursor-pointer text-sm font-bold"
                          >
                            &minus;
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-neutral-900">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.pack, 1)}
                            aria-label="Increase quantity"
                            className="touch-target-44 w-8 h-8 rounded-none flex items-center justify-center text-neutral-600 hover:bg-black/5 transition-colors cursor-pointer text-sm font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-bold text-sm text-neutral-900">
                            ₹{item.totalPrice * item.qty}
                          </span>
                          {item.qty > 1 && (
                            <span className="block text-[10px] text-neutral-400">
                              ₹{item.totalPrice} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Quick Upsell Strip */}
              {items.length > 0 && (
                <div className="pt-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-3">
                    Recommended Add-ons
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/90 rounded-2xl border border-black/5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
                      <img src="/assets/straw-can-hero.png" alt="Strawberry" className="w-8 h-10 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[11px] font-bold text-neutral-900 truncate">Wild Strawberry</h5>
                        <span className="text-[10px] text-neutral-500">₹350</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: 'strawberry',
                            title: 'Wild Strawberry',
                            badgeText: 'Edition 02',
                            image: '/assets/straw-can-hero.png',
                            tagColor: '#D90429',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold uppercase hover:bg-(--color-coral) transition-colors cursor-pointer shrink-0"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="p-3 bg-white/90 rounded-2xl border border-black/5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs transition-shadow">
                      <img src="/assets/cherry-can-hero.png" alt="Cherry" className="w-8 h-10 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[11px] font-bold text-neutral-900 truncate">Black Cherry</h5>
                        <span className="text-[10px] text-neutral-500">₹350</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: 'cherry',
                            title: 'Black Cherry',
                            badgeText: 'Edition 03',
                            image: '/assets/cherry-can-hero.png',
                            tagColor: '#9B111E',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold uppercase hover:bg-(--color-coral) transition-colors cursor-pointer shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout Controls */}
            {items.length > 0 && (
              <div className="p-6 border-t border-black/5 bg-white/90 backdrop-blur-md space-y-4">
                {/* Promo Code Input */}
                <form onSubmit={applyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE (e.g. CLEAN10)"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-100/80 border border-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-900 placeholder:opacity-40 focus:outline-hidden focus:ring-1 focus:ring-(--color-coral)"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-(--color-coral) transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {promoSuccess && (
                  <p className="text-[11px] font-bold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-lg">{promoSuccess}</p>
                )}
                {promoError && (
                  <p className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">{promoError}</p>
                )}

                {/* Subtotals breakdown */}
                <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-(--color-coral)">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Chilled Cold-Chain Logistics</span>
                    <span className="font-bold text-neutral-900">
                      {isFreeShipping ? (
                        <span className="text-neutral-900 font-bold uppercase">COMPLIMENTARY</span>
                      ) : (
                        '₹120'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-900 pt-2.5 border-t border-neutral-200">
                    <span>Estimated Total</span>
                    <span className="text-base text-(--color-coral)">
                      ₹{isFreeShipping ? finalTotal : finalTotal + 120}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger with Safe Area Bottom */}
                <div className="pt-2 pb-[calc(var(--sab)+0.75rem)]">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(true)}
                    className="touch-target-44 w-full min-h-[48px] py-3.5 rounded-full bg-(--color-ink) text-white hover:bg-(--color-coral) text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-98"
                  >
                    <span>Proceed to Chilled Dispatch</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal (Full-sheet on mobile with Safe Area scrolling) */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div
            onClick={() => setIsCheckingOut(false)}
            className="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-xl bg-[#FAF5EA] border border-[#E8DEC8] shadow-2xl z-10 max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-none overflow-y-auto pb-[calc(var(--sab)+1.5rem)] animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-[#E8DEC8] flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-(--color-coral) uppercase block">
                  Secure Cold-Chain Dispatch
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Chilled Checkout
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                aria-label="Close Checkout"
                className="touch-target-44 w-11 h-11 flex items-center justify-center text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6">
              {/* Delivery Address */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">1</span>
                  Delivery Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8DEC8] font-medium focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8DEC8] font-medium focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8DEC8] font-medium focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8DEC8] font-medium focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E8DEC8] font-medium focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Slot */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">2</span>
                  Cold-Chain Delivery Window
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    'Dawn Express (Juiced at 4 AM • Delivered 6 AM - 9 AM)',
                    'Midday Chilled Dispatch (12 PM - 3 PM)',
                    'Evening Cellular Hydration (6 PM - 9 PM)',
                  ].map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                        formData.slot === slot
                          ? 'bg-white border-(--color-coral) text-neutral-900 font-bold'
                          : 'bg-white/60 border-[#E8DEC8] text-neutral-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        checked={formData.slot === slot}
                        onChange={() => setFormData({ ...formData, slot })}
                        className="text-(--color-coral)"
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center">3</span>
                  Payment Preference
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'upi', label: 'UPI / GPay / PhonePe' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'cod', label: 'Cash on Chilled Delivery' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-3 border text-center font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors ${
                        formData.paymentMethod === method.id
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-[#E8DEC8] hover:border-neutral-400'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary and Complete */}
              <div className="pt-4 border-t border-[#E8DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-neutral-500 block">Payable Total</span>
                  <span className="font-display text-2xl font-black text-(--color-coral)">
                    ₹{isFreeShipping ? finalTotal : finalTotal + 120}
                  </span>
                </div>
                <button
                  type="submit"
                  className="touch-target-44 w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-(--color-coral) hover:bg-(--color-coral-dark) text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
                >
                  Place Chilled Order &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmed Success Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={() => setOrderConfirmed(null)}
            className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-[#FAF5EA] border border-[#E8DEC8] shadow-2xl p-8 text-center z-10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-700">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block mb-3">
              Order Confirmed // {orderConfirmed.orderId}
            </span>

            <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight mb-2">
              Fresh Harvest Dispatched!
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto mb-6">
              Thank you, <span className="font-bold text-neutral-900">{orderConfirmed.customerDetails.fullName}</span>. Your cold-pressed bottles are being freshly nitrogen-chilled for your selected slot:
            </p>

            <div className="p-4 bg-white border border-[#E8DEC8] text-left text-xs space-y-2 mb-6 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Delivery Slot:</span>
                <span className="font-bold text-neutral-900">{orderConfirmed.deliverySlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Destination:</span>
                <span className="font-bold text-neutral-900 truncate max-w-[200px]">{orderConfirmed.customerDetails.address}, {orderConfirmed.customerDetails.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Amount Paid:</span>
                <span className="font-bold text-(--color-coral)">₹{orderConfirmed.customerDetails.finalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Cold-Chain Status:</span>
                <span className="font-bold text-emerald-700">Chilled at 2°C</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOrderConfirmed(null)}
              className="w-full py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-(--color-coral) transition-colors cursor-pointer"
            >
              Continue Exploring Juices
            </button>
          </div>
        </div>
      )}
    </>
  )
}
