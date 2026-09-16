import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'

// GSAP High-Energy Confetti Celebration
const GSAPConfetti = ({ active }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (active && containerRef.current) {
      const colors = ['#E03E26', '#1E5BF7', '#F5A623', '#1C1917', '#FF6600', '#F6A374']
      const particles = []
      
      for (let i = 0; i < 70; i++) {
        const particle = document.createElement('div')
        const size = Math.random() * 7 + 4
        const isCircle = Math.random() > 0.4
        particle.className = `absolute top-1/2 left-1/2 pointer-events-none ${isCircle ? 'rounded-full' : 'rounded-xs'}`
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
        containerRef.current.appendChild(particle)
        particles.push(particle)
      }

      gsap.fromTo(particles, 
        {
          x: 0,
          y: 0,
          scale: 0,
          rotation: 0,
          opacity: 1
        },
        {
          x: () => (Math.random() - 0.5) * window.innerWidth * 0.85,
          y: () => (Math.random() - 0.5) * window.innerHeight * 0.85,
          scale: () => Math.random() * 1.5 + 0.5,
          rotation: () => Math.random() * 720 - 360,
          opacity: 0,
          duration: () => Math.random() * 1.4 + 1.1,
          ease: 'power3.out',
          stagger: {
            amount: 0.12,
            from: 'center'
          },
          onComplete: () => {
            particles.forEach(p => p.remove())
          }
        }
      )
    }
  }, [active])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-100" />
}

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
  const [showPromoPopup, setShowPromoPopup] = useState(false)
  const [appliedPromoCode, setAppliedPromoCode] = useState('')
  const [addedAddons, setAddedAddons] = useState({})
  const [isEditingCart, setIsEditingCart] = useState(false)
  const [promoInputOpen, setPromoInputOpen] = useState(false)

  // Animation Refs
  const backdropRef = useRef(null)
  const drawerPanelRef = useRef(null)
  const headerRef = useRef(null)
  const itemsContainerRef = useRef(null)
  const addonsRef = useRef(null)
  const footerRef = useRef(null)
  const checkoutBtnRef = useRef(null)
  const promoPopupRef = useRef(null)
  const errorRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const progressBarRef = useRef(null)
  const deliveryVanRef = useRef(null)

  // Prevent background scroll & lock Lenis when Cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (window.lenis) {
        window.lenis.stop()
      }
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (window.lenis) {
        window.lenis.start()
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (window.lenis) {
        window.lenis.start()
      }
    }
  }, [isCartOpen])

  // GSAP Opening Entrance Animations
  useEffect(() => {
    if (isCartOpen && drawerPanelRef.current) {
      const tl = gsap.timeline()

      // Backdrop fade-in
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' }
        )
      }

      // Drawer Panel slides in smoothly from right
      tl.fromTo(
        drawerPanelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.45, ease: 'power3.out' }
      )

      // Header drop down
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
          '-=0.25'
        )
      }

      // Cart Product Cards staggered reveal
      if (itemsContainerRef.current) {
        const cards = itemsContainerRef.current.querySelectorAll('.cart-product-item')
        if (cards.length > 0) {
          tl.fromTo(
            cards,
            { opacity: 0, y: 25, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
            '-=0.2'
          )
        }
      }

      // Recommended Add-ons Section
      if (addonsRef.current) {
        tl.fromTo(
          addonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
      }

      // Footer & Checkout Button slide up
      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.25'
        )
      }

      if (checkoutBtnRef.current) {
        tl.fromTo(
          checkoutBtnRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' },
          '-=0.15'
        )
      }
    }
  }, [isCartOpen])
 
  // Dynamic progress bar width animation
  useEffect(() => {
    if (progressBarRef.current && isCartOpen) {
      const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      gsap.to(progressBarRef.current, {
        width: `${progressPercent}%`,
        duration: 0.7,
        ease: 'power2.out'
      })
    }
  }, [subtotal, freeShippingThreshold, isCartOpen])

  // Animated Chilled Delivery Van position movement
  useEffect(() => {
    if (deliveryVanRef.current && isCartOpen) {
      const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      gsap.to(deliveryVanRef.current, {
        left: `calc(${Math.min(94, Math.max(0, progressPercent))}% - 14px)`,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
  }, [subtotal, freeShippingThreshold, isCartOpen])

  // Delivery Van suspension bounce & wheel vibration
  useEffect(() => {
    if (deliveryVanRef.current && isCartOpen) {
      const vanBody = deliveryVanRef.current.querySelector('.delivery-van-bounce')
      if (vanBody) {
        const tween = gsap.to(vanBody, {
          y: -1.5,
          duration: 0.28,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        return () => tween.kill()
      }
    }
  }, [isCartOpen])

  // Promo Celebration Popup
  useEffect(() => {
    if (showPromoPopup && promoPopupRef.current) {
      gsap.set(promoPopupRef.current, { transformPerspective: 1000 })
      gsap.fromTo(
        promoPopupRef.current,
        { scale: 0.6, opacity: 0, y: 80, rotationX: 40 },
        { scale: 1, opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' }
      )
    }
  }, [showPromoPopup])

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

  // Interactive micro-animation on quantity change
  const handleQtyClick = (id, pack, delta, e) => {
    const parent = e.currentTarget.closest('.qty-stepper-container')
    if (parent) {
      const numberEl = parent.querySelector('.qty-display-number')
      if (numberEl) {
        gsap.timeline()
          .to(numberEl, { scale: 1.3, color: '#1E5BF7', duration: 0.09 })
          .to(numberEl, { scale: 1, color: '#1A1816', duration: 0.18, ease: 'back.out(2)' })
      }
    }
    updateQty(id, pack, delta)
  }

  // Interactive smooth exit animation on removing an item
  const handleAnimatedRemove = (id, pack, e) => {
    const itemCard = e.currentTarget.closest('.cart-product-item')
    if (itemCard) {
      gsap.to(itemCard, {
        x: 60,
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: () => {
          removeItem(id, pack)
        }
      })
    } else {
      removeItem(id, pack)
    }
  }

  // Interactive Add-on addition animation with square button feedback
  const handleAddAddon = (addonItem, e) => {
    const btn = e.currentTarget
    if (btn) {
      gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.25, ease: 'back.out(2.2)' })
    }
    setAddedAddons(prev => ({ ...prev, [addonItem.id]: true }))
    addToCart(addonItem)
    setTimeout(() => {
      setAddedAddons(prev => ({ ...prev, [addonItem.id]: false }))
    }, 1400)
  }

  // Promo code submission
  const applyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')
    const code = promoCode.trim().toUpperCase()

    if (code === 'CLEAN10') {
      setDiscountPercent(10)
      setPromoSuccess('CLEAN10 discount active!')
      setAppliedPromoCode('CLEAN10')
      setShowPromoPopup(true)
      setPromoInputOpen(false)
    } else if (code === 'ORGANIC') {
      setDiscountPercent(15)
      setPromoSuccess('ORGANIC harvest discount active!')
      setAppliedPromoCode('ORGANIC')
      setShowPromoPopup(true)
      setPromoInputOpen(false)
    } else if (code === 'FRESH') {
      setDiscountPercent(20)
      setPromoSuccess('FRESH flash discount active!')
      setAppliedPromoCode('FRESH')
      setShowPromoPopup(true)
      setPromoInputOpen(false)
    } else {
      setPromoError('Invalid code. Try CLEAN10, ORGANIC, or FRESH')
      if (errorRef.current) {
        gsap.fromTo(
          errorRef.current,
          { x: -6 },
          { x: 6, duration: 0.07, repeat: 4, yoyo: true, ease: 'power1.inOut' }
        )
      }
    }
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const shippingFee = isFreeShipping ? 0 : 120
  const taxAmount = Math.round(subtotal * 0.05)
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount)

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
      {/* Toast Notification */}
      {toastMessage && !isCartOpen && (
        <div className="fixed bottom-6 right-6 z-60 max-w-sm w-full bg-neutral-950 text-white shadow-2xl rounded-2xl p-3 pr-4 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 fade-in duration-300 border border-black/10">
          {toastMessage.image && (
            <div className="w-12 h-12 shrink-0 bg-white/10 rounded-xl p-1.5 flex items-center justify-center border border-white/10">
              <img src={toastMessage.image} alt={toastMessage.title} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="font-poppins text-[10px] font-semibold uppercase tracking-wider text-(--color-coral) block">
              Added to Bag
            </span>
            <p className="font-poppins text-xs font-semibold text-white truncate mt-0.5">
              {toastMessage.title}
            </p>
            <p className="font-poppins text-[11px] text-neutral-400 truncate">
              {toastMessage.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="font-poppins px-3.5 py-1.5 bg-white/15 hover:bg-(--color-coral) text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Subtle Dark Backdrop */}
          <div
            ref={backdropRef}
            onClick={() => {
              setIsCartOpen(false)
              setIsCheckingOut(false)
            }}
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel - Light Theme Organic Artisanal Aesthetic (Extended Width, No Dark Theme, No Glow) */}
          <div 
            ref={drawerPanelRef}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-[540px] h-full apple-light-glass flex flex-col z-10 overscroll-contain overflow-hidden text-neutral-900 shadow-2xl"
          >
            {/* Header: Square Back Button on Left, Centered 'Your Cart' Title, 'Edit' on Right */}
            <div 
              ref={headerRef}
              className="relative z-10 px-5 sm:px-6 pt-[calc(var(--sat)+1rem)] pb-4 flex items-center justify-between border-b border-black/5 bg-white/70 backdrop-blur-md shrink-0"
            >
              {/* Back Arrow Button (Square Glass Button - Reduced Compact Size) */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckingOut(false)
                }}
                aria-label="Back to store"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-800 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>              {/* Centered Title: font-asul with 'Your' and 'Cart' */}
              <div className="text-center">
                <h3 className="font-asul text-2xl font-normal tracking-wide text-neutral-900">
                  Your <span className="text-[#F25C22]">Cart</span>
                </h3>
              </div>

              {/* Edit / Done button on right */}
              <button
                type="button"
                onClick={() => setIsEditingCart(!isEditingCart)}
                className="font-poppins text-xs sm:text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer px-2 py-1"
              >
                {isEditingCart ? 'Done' : 'Edit'}
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div 
              ref={scrollContainerRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              onWheel={(e) => e.stopPropagation()}
              className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden ${items.length === 0 ? 'px-4 sm:px-6 py-8 flex flex-col justify-center items-center' : 'px-5 sm:px-6 py-5 pb-10 space-y-4.5'} scroll-smooth overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20`}
            >
              {items.length === 0 ? (
                /* Empty Cart Screen: Clean Organic Artisanal Aesthetic with Asul & Zesty Splashing Box (No Leaf, No Glow, Solid Original Orange) */
                <div className="relative w-full flex flex-col justify-center items-center my-auto py-6">
                  {/* Center Content Section */}
                  <div className="w-full flex flex-col items-center text-center relative z-10">
                    {/* Handwritten Callout: Looks a little empty around here! */}
                    <div className="relative w-full max-w-[320px] sm:max-w-[360px] flex flex-col items-center">
                      <div className="absolute right-1 sm:right-3 -top-7 sm:-top-5 flex flex-col items-center pointer-events-none select-none z-20">
                        <span className="font-caveat text-neutral-600 text-lg sm:text-xl font-bold -rotate-6 tracking-wide drop-shadow-2xs whitespace-nowrap">
                          Looks a little empty<br />around here!
                        </span>
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-500/80 -mt-1 -rotate-6" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M38 6 C30 16, 18 24, 12 36" />
                          <path d="M12 28 L11 37 L20 36" />
                        </svg>
                      </div>

                      {/* Zesty Box Artwork with Splashing Citrus & Drops */}
                      <img 
                        src="/images/empty-cart-box.png" 
                        alt="Zesty Empty Cart Delivery Box" 
                        className="w-56 sm:w-64 md:w-72 h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-[0_12px_28px_rgba(242,92,34,0.18)] transform transition-transform duration-500 hover:scale-103" 
                      />
                    </div>

                    {/* Headline & Description in Asul */}
                    <h4 className="font-asul text-3xl sm:text-4xl font-normal text-neutral-900 tracking-normal mt-2 mb-2">
                      Your cart is empty
                    </h4>
                    <p className="font-poppins text-xs sm:text-[13px] text-neutral-500 max-w-[280px] sm:max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Discover cold-pressed organic formulations from our 4 signature editions.
                    </p>

                    {/* Explore 4 Editions Pill Button: Solid Original Orange, No Leaf, No Glow */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false)
                        const el = document.querySelector('#flavors')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="group inline-flex items-center justify-center gap-2 px-9 py-3.5 bg-[#F25C22] hover:bg-[#E04D15] text-white font-asul font-medium text-base sm:text-lg tracking-wide rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      <span>Explore 4 Editions</span>
                      {/* Right Arrow */}
                      <svg className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Luxury Delivery Status Bar with Animated Chilled Van */}
                  <div className="apple-light-card rounded-2xl px-5 py-4 shadow-2xs transition-all overflow-hidden relative">
                    <div className="flex items-center justify-between text-xs font-poppins mb-3">
                      <span className="font-medium text-neutral-800 flex items-center gap-1.5">
                        {isFreeShipping ? (
                          <span className="text-neutral-950 font-semibold flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Complimentary Chilled Delivery Unlocked!
                          </span>
                        ) : (
                          <span>
                            You're <span className="font-semibold text-neutral-950 font-dacomment text-[13px]">₹{freeShippingLeft}</span> away from <span className="font-semibold text-neutral-950">Free Chilled Delivery</span>
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-500 font-asul bg-neutral-100 px-2 py-0.5 rounded-md">
                        {Math.round(Math.min(100, (subtotal / freeShippingThreshold) * 100))}%
                      </span>
                    </div>

                    {/* Animated Delivery Road Track with Van */}
                    <div className="relative pt-2.5 pb-1">
                      {/* Base road track */}
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden relative">
                        <div 
                          ref={progressBarRef}
                          className="h-full bg-neutral-950 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                        />
                      </div>

                      {/* Animated Chilled Delivery Van driving smoothly along the track */}
                      <div 
                        ref={deliveryVanRef}
                        className="absolute -top-3.5 transition-all duration-700 ease-out pointer-events-none z-10"
                        style={{ left: `calc(${Math.min(94, Math.max(0, Math.round((subtotal / freeShippingThreshold) * 100)))}% - 14px)` }}
                      >
                        <div className="delivery-van-bounce relative flex items-center">
                          <svg className="w-7 h-5 text-neutral-900 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]" viewBox="0 0 28 20" fill="currentColor">
                            {/* Van Body */}
                            <path d="M1 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1a3 3 0 0 1-6 0H10a3 3 0 0 1-6 0H2a1 1 0 0 1-1-1V5z" />
                            {/* Front Windshield */}
                            <path d="M19 6h3.5l2.5 3H19V6z" fill="#FFFFFF" opacity="0.9" />
                            {/* Chilled Nitrogen 2°C Snowflake Badge on side */}
                            <path d="M8 6.5v4M6 8.5h4M6.5 7l3 3M9.5 7l-3 3" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                            {/* Rear Wheel */}
                            <circle cx="7" cy="15.5" r="2.5" fill="#FFFFFF" stroke="#171717" strokeWidth="1.5" />
                            {/* Front Wheel */}
                            <circle cx="19" cy="15.5" r="2.5" fill="#FFFFFF" stroke="#171717" strokeWidth="1.5" />
                          </svg>
                          {/* Small cold chill vapor puff */}
                          <span className="absolute -left-2 top-2.5 w-1 h-1 rounded-full bg-neutral-400/50 animate-ping" />
                        </div>
                      </div>

                      {/* Destination Finish Point */}
                      <div className="absolute -right-0.5 -top-2.5 flex items-center justify-center pointer-events-none">
                        {isFreeShipping ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cart Product Items Container - Clean Light Cards with Asul Font */}
                  <div ref={itemsContainerRef} className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={`${item.id}-${item.pack}`} 
                        className="cart-product-item apple-light-card rounded-[22px] p-4 flex gap-4 items-center transition-all duration-200"
                      >
                        {/* Square Image Box */}
                        <div className="w-20 h-20 rounded-xl bg-neutral-100/70 border border-black/5 flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" 
                          />
                        </div>

                        {/* Product Info & Stepper */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          {/* Title & Delete button row */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-asul font-normal text-base text-neutral-900 leading-snug tracking-wide truncate">
                                {item.title}
                              </h4>
                              <p className="font-poppins text-xs text-neutral-500 font-normal mt-0.5 truncate">
                                {item.packName || '500ml Single Can'} • {item.edition}
                              </p>
                            </div>

                            {/* Trash Icon Button (Square Button) */}
                            <button
                              type="button"
                              onClick={(e) => handleAnimatedRemove(item.id, item.pack, e)}
                              aria-label="Remove item"
                              className="w-8 h-8 rounded-lg bg-neutral-100/80 hover:bg-red-50 text-neutral-400 hover:text-red-500 border border-black/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Price & Quantity Stepper row */}
                          <div className="flex items-center justify-between mt-3 pt-1 border-t border-black/5">
                            {/* Price in Asul / Dacomment with reduced font weight */}
                            <div>
                              <span className="font-asul font-normal text-base text-neutral-900">
                                ₹{item.totalPrice * item.qty}
                              </span>
                              {item.qty > 1 && (
                                <span className="font-poppins block text-[10px] text-neutral-400 font-normal">
                                  ₹{item.totalPrice} each
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper with SQUARE BUTTONS */}
                            <div className="qty-stepper-container flex items-center gap-1 bg-neutral-100/90 border border-black/10 rounded-xl p-1">
                              {/* Square Minus Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQtyClick(item.id, item.pack, -1, e)}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-sm font-semibold border border-black/5 transition-colors cursor-pointer"
                              >
                                &minus;
                              </button>

                              {/* Number */}
                              <span className="qty-display-number w-7 text-center font-poppins text-xs font-semibold text-neutral-900 inline-block">
                                {item.qty}
                              </span>

                              {/* Square Plus Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQtyClick(item.id, item.pack, 1, e)}
                                aria-label="Increase quantity"
                                className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-sm font-semibold border border-black/5 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Add-ons Section */}
                  <div ref={addonsRef} className="pt-2">
                    <span className="font-asul text-sm font-normal uppercase tracking-wider text-neutral-600 block mb-3">
                      Recommended Add-ons
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Wild Strawberry Addon */}
                      <div className="apple-light-card rounded-2xl p-3 flex items-center gap-2.5 transition-all">
                        <img 
                          src="/assets/straw-can-hero.png" 
                          alt="Wild Strawberry" 
                          className="w-9 h-11 object-contain shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-asul text-sm font-normal text-neutral-900 truncate">
                            Wild Strawberry
                          </h5>
                          <span className="font-dacomment text-xs font-semibold text-neutral-600 block">
                            ₹350
                          </span>
                        </div>
                        {/* Square Add Button */}
                        <button
                          type="button"
                          onClick={(e) =>
                            handleAddAddon(
                              {
                                id: 'strawberry',
                                title: 'Wild Strawberry',
                                badgeText: 'Edition 02',
                                image: '/assets/straw-can-hero.png',
                                tagColor: '#D90429',
                              },
                              e
                            )
                          }
                          className={`font-poppins px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shrink-0 normal-case ${
                            addedAddons['strawberry']
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white hover:bg-neutral-900 hover:text-white border-black/15 text-neutral-900'
                          }`}
                        >
                          {addedAddons['strawberry'] ? 'Added ✓' : 'Add'}
                        </button>
                      </div>

                      {/* Black Cherry Addon */}
                      <div className="apple-light-card rounded-2xl p-3 flex items-center gap-2.5 transition-all">
                        <img 
                          src="/assets/cherry-can-hero.png" 
                          alt="Black Cherry" 
                          className="w-9 h-11 object-contain shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-asul text-sm font-normal text-neutral-900 truncate">
                            Black Cherry
                          </h5>
                          <span className="font-dacomment text-xs font-semibold text-neutral-600 block">
                            ₹350
                          </span>
                        </div>
                        {/* Square Add Button */}
                        <button
                          type="button"
                          onClick={(e) =>
                            handleAddAddon(
                              {
                                id: 'cherry',
                                title: 'Black Cherry',
                                badgeText: 'Edition 03',
                                image: '/assets/cherry-can-hero.png',
                                tagColor: '#9B111E',
                              },
                              e
                            )
                          }
                          className={`font-poppins px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shrink-0 normal-case ${
                            addedAddons['cherry']
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white hover:bg-neutral-900 hover:text-white border-black/15 text-neutral-900'
                          }`}
                        >
                          {addedAddons['cherry'] ? 'Added ✓' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer & Checkout Controls (Clean Light Theme) */}
            {items.length > 0 && (
              <div 
                ref={footerRef}
                className="relative z-10 px-5 sm:px-6 py-5 border-t border-black/5 bg-white/95 backdrop-blur-md space-y-4 shrink-0 shadow-lg"
              >
                {/* Bill Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-neutral-500 font-poppins font-normal">
                    <span>Subtotal</span>
                    <span className="text-neutral-900 font-medium">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-(--color-coral) font-poppins font-normal">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-medium">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-neutral-500 font-poppins font-normal">
                    <span>Shipping</span>
                    <span className="text-neutral-900 font-medium">
                      {isFreeShipping ? '₹0.00' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-neutral-500 font-poppins font-normal">
                    <span>Chilled Cold-Chain Logistics</span>
                    <span className="text-neutral-900 font-medium">₹{taxAmount}</span>
                  </div>

                  {/* Total row in Clean Asul Font */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-neutral-200">
                    <span className="font-asul text-base font-normal text-neutral-900">
                      Total
                    </span>
                    <span className="font-asul text-2xl font-normal text-neutral-950">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Promo Code Box: Clean Light Pill with Tag Icon */}
                {!promoInputOpen ? (
                  <button
                    type="button"
                    onClick={() => setPromoInputOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 border border-black/5 flex items-center justify-between text-neutral-600 text-xs font-poppins font-medium transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{appliedPromoCode ? `Promo Applied: ${appliedPromoCode}` : 'Add promo code'}</span>
                    </div>
                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <form onSubmit={applyPromo} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ENTER CODE (CLEAN10, ORGANIC)"
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs font-poppins font-medium text-neutral-900 uppercase tracking-wider outline-none focus:ring-1 focus:ring-neutral-900"
                        autoFocus
                      />
                    </div>
                    {/* Square Apply Button */}
                    <button
                      type="submit"
                      className="px-4 py-3 bg-neutral-950 hover:bg-black text-white text-xs font-poppins font-semibold rounded-xl transition-all cursor-pointer shrink-0 normal-case shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoError && (
                  <p ref={errorRef} className="font-poppins text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                    {promoError}
                  </p>
                )}

                {/* Primary Proceed to Checkout CTA in Luxury Deep Charcoal with Square Arrow Button */}
                <div className="pt-1 pb-[calc(var(--sab)+0.5rem)]">
                  <button
                    ref={checkoutBtnRef}
                    type="button"
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full h-14 pl-6 pr-2 rounded-2xl bg-neutral-950 hover:bg-black text-white flex items-center justify-between transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-98"
                  >
                    <span className="font-asul text-base font-normal tracking-wide text-white">
                      Proceed to Checkout
                    </span>
                    {/* Square Arrow Button */}
                    <div className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal in Clean Light Theme */}
      {isCheckingOut && (
        <div 
          className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-6"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            onClick={() => setIsCheckingOut(false)}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-xl bg-[#FAF5EA] border border-black/10 shadow-2xl z-10 max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto pb-[calc(var(--sab)+1.5rem)] text-neutral-900 animate-in slide-in-from-bottom-5 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-black/5 flex items-center justify-between bg-white">
              <div>
                <span className="font-poppins text-[10px] font-semibold tracking-widest text-(--color-coral) uppercase block">
                  Cold-Chain Dispatch
                </span>
                <h3 className="font-asul text-2xl font-normal text-neutral-900 tracking-tight mt-0.5">
                  Delivery Destination
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                aria-label="Close Checkout"
                className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-5">
              {/* Delivery Address */}
              <div>
                <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  Recipient & Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-poppins block text-[11px] font-medium text-neutral-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="font-poppins w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-normal outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="font-poppins block text-[11px] font-medium text-neutral-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="font-poppins w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-normal outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-poppins block text-[11px] font-medium text-neutral-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="font-poppins w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-normal outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="font-poppins block text-[11px] font-medium text-neutral-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="font-poppins w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-normal outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="font-poppins block text-[11px] font-medium text-neutral-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="font-poppins w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-normal outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Window */}
              <div>
                <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  Cold-Chain Window
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    'Dawn Express (Juiced at 4 AM • Delivered 6 AM - 9 AM)',
                    'Midday Chilled Dispatch (12 PM - 3 PM)',
                    'Evening Cellular Hydration (6 PM - 9 PM)',
                  ].map((slot) => (
                    <label
                      key={slot}
                      className={`font-poppins flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.slot === slot
                          ? 'bg-white border-neutral-900 text-neutral-900 font-semibold shadow-xs'
                          : 'bg-white/60 border-black/10 text-neutral-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        checked={formData.slot === slot}
                        onChange={() => setFormData({ ...formData, slot })}
                        className="accent-neutral-900"
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  Payment Preference
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'upi', label: 'UPI / GPay' },
                    { id: 'card', label: 'Credit / Debit' },
                    { id: 'cod', label: 'Cash on Delivery' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`font-poppins p-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                        formData.paymentMethod === method.id
                          ? 'bg-neutral-950 text-white border-neutral-950 font-semibold shadow-xs'
                          : 'bg-white text-neutral-700 border-black/10 hover:border-black/20'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary and Complete */}
              <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-poppins text-xs text-neutral-500 block font-normal">Payable Total</span>
                  <span className="font-dacomment text-2xl font-bold text-neutral-900">
                    ₹{finalTotal}
                  </span>
                </div>
                <button
                  type="submit"
                  className="font-poppins px-8 py-3.5 bg-neutral-950 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md active:scale-98"
                >
                  Confirm & Place Order &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmed Success Modal */}
      {orderConfirmed && (
        <div 
          className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            onClick={() => setOrderConfirmed(null)}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg bg-[#FAF5EA] border border-black/10 shadow-2xl p-8 text-center z-10 rounded-3xl text-neutral-900 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-700">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-block mb-3">
              Order Dispatched // {orderConfirmed.orderId}
            </span>

            <h3 className="font-asul text-3xl font-normal text-neutral-900 tracking-tight mb-2">
              Fresh Harvest Dispatched!
            </h3>

            <p className="font-poppins text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto mb-6">
              Thank you, <span className="text-neutral-900 font-semibold">{orderConfirmed.customerDetails.fullName}</span>. Your cold-pressed bottles are being freshly nitrogen-chilled at 2°C.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-black/10 text-left text-xs space-y-2 mb-6 font-poppins shadow-2xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery Window:</span>
                <span className="text-neutral-900 font-medium">{orderConfirmed.deliverySlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Destination:</span>
                <span className="text-neutral-900 font-medium truncate max-w-[220px]">{orderConfirmed.customerDetails.address}, {orderConfirmed.customerDetails.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount Paid:</span>
                <span className="font-dacomment text-base font-bold text-neutral-950">₹{orderConfirmed.customerDetails.finalTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOrderConfirmed(null)}
              className="font-poppins w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              Continue Exploring Juices
            </button>
          </div>
        </div>
      )}

      {/* GSAP Confetti for Promo Celebration */}
      <GSAPConfetti active={showPromoPopup} />

      {/* Promo Celebration Popup in Light Theme */}
      {showPromoPopup && (
        <div 
          className="fixed inset-0 z-80 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            ref={promoPopupRef}
            className="relative w-full max-w-[340px] bg-white rounded-3xl p-7 z-10 text-center border border-black/10 shadow-2xl text-neutral-900"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-[#1E5BF7]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>

            <h4 className="font-poppins text-lg font-semibold text-neutral-900 mb-1">
              Coupon Applied!
            </h4>
            <p className="font-poppins text-xs text-neutral-500 mb-5">
              Code <span className="text-[#1E5BF7] font-semibold">{appliedPromoCode}</span> unlocked {discountPercent}% off your cart.
            </p>

            <button
              type="button"
              onClick={() => setShowPromoPopup(false)}
              className="font-poppins w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md normal-case"
            >
              Apply Coupons
            </button>
          </div>
        </div>
      )}
    </>
  )
}
