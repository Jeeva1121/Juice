import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'


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
    userProfile,
    setIsAccountOpen,
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

  // Checkout Modal GSAP Animation Refs
  const checkoutModalRef = useRef(null)
  const checkoutBackdropRef = useRef(null)
  const strawCanRef = useRef(null)
  const strawPiece1Ref = useRef(null)
  const strawPiece2Ref = useRef(null)
  const strawPiece3Ref = useRef(null)
  const qrBeamRef = useRef(null)

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

  // GSAP Opening Entrance Animations - High-performance 60fps on mobile without layout thrashing
  useEffect(() => {
    if (isCartOpen && drawerPanelRef.current) {
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        )
      }

      gsap.fromTo(
        drawerPanelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.32, ease: 'power2.out', clearProps: 'transform' }
      )
    }
  }, [isCartOpen])
 
  // Dynamic progress bar width animation
  useEffect(() => {
    if (progressBarRef.current && isCartOpen) {
      const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      gsap.to(progressBarRef.current, {
        width: `${progressPercent}%`,
        duration: 0.5,
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
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }, [subtotal, freeShippingThreshold, isCartOpen])

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

  // Real-time Checkout form state - NO hardcoded predefined data
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    pincode: userProfile?.pincode || '',
    slot: 'Dawn Express (Juiced at 4 AM • Delivered 6 AM - 9 AM)',
    paymentMethod: 'upi',
  })

  // Sync formData whenever userProfile updates
  useEffect(() => {
    if (userProfile && (userProfile.fullName || userProfile.phone || userProfile.address)) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || userProfile.fullName || '',
        phone: prev.phone || userProfile.phone || '',
        address: prev.address || userProfile.address || '',
        city: prev.city || userProfile.city || '',
        pincode: prev.pincode || userProfile.pincode || '',
      }))
    }
  }, [userProfile])

  // Payment states for Real-Time Checkout UI
  const [paymentTab, setPaymentTab] = useState('upi') // 'upi', 'netbanking', 'card', 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay') // 'gpay', 'phonepe', 'paytm', 'cred', 'bhim'
  const [customUpiId, setCustomUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)
  const [upiVerifying, setUpiVerifying] = useState(false)
  const [qrCountdown, setQrCountdown] = useState(299) // 4 min 59 sec
  const [selectedBank, setSelectedBank] = useState('hdfc') // 'hdfc', 'icici', 'sbi', 'axis', 'kotak', 'pnb'
  const [selectedWallet, setSelectedWallet] = useState('paytm') // 'paytm', 'amazonpay', 'phonepe', 'mobikwik'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [copiedOrderId, setCopiedOrderId] = useState(false)
  const [isAddressEditing, setIsAddressEditing] = useState(false)

  // Real-time ticking countdown for UPI QR
  useEffect(() => {
    let timer
    if (isCheckingOut && paymentTab === 'upi') {
      timer = setInterval(() => {
        setQrCountdown(prev => (prev > 0 ? prev - 1 : 300))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isCheckingOut, paymentTab])

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyUpi = (e) => {
    e.preventDefault()
    if (!customUpiId || !customUpiId.includes('@')) return
    setUpiVerifying(true)
    setTimeout(() => {
      setUpiVerifying(false)
      setUpiVerified(true)
    }, 600)
  }

  // GSAP Modern Animations for Checkout Modal
  useEffect(() => {
    if (isCheckingOut) {
      const ctx = gsap.context(() => {
        // Smooth Backdrop Entrance
        if (checkoutBackdropRef.current) {
          gsap.fromTo(
            checkoutBackdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
          )
        }
        // Smooth Modal Entrance
        if (checkoutModalRef.current) {
          gsap.fromTo(
            checkoutModalRef.current,
            { scale: 0.95, y: 18, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.38, ease: 'power3.out' }
          )
        }
      })
      return () => ctx.revert()
    }
  }, [isCheckingOut])

  
  const handleUpiAppClick = (appId, e) => {
    setSelectedUpiApp(appId)
    if (e?.currentTarget) {
      gsap.timeline()
        .to(e.currentTarget, { scale: 0.92, duration: 0.08 })
        .to(e.currentTarget, { scale: 1, duration: 0.16, ease: 'back.out(2)' })
    }
  }

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
    if (e && e.preventDefault) e.preventDefault()

    const bankNames = {
      hdfc: 'HDFC Bank',
      sbi: 'State Bank of India',
      icici: 'ICICI Bank',
      axis: 'Axis Bank',
      kotak: 'Kotak Mahindra Bank',
      pnb: 'Punjab National Bank',
      bob: 'Bank of Baroda',
      canara: 'Canara Bank',
      union: 'Union Bank of India',
      indusind: 'IndusInd Bank',
      yes: 'Yes Bank',
      idfc: 'IDFC FIRST Bank',
      federal: 'Federal Bank',
    }

    const walletNames = {
      paytm: 'Paytm Wallet',
      amazonpay: 'Amazon Pay',
      phonepe: 'PhonePe Wallet',
      mobikwik: 'MobiKwik ZIP',
    }

    let paymentLabel = 'UPI (Instant Verified ✓)'
    if (paymentTab === 'card') {
      const last4 = cardData.number ? cardData.number.replace(/\s+/g, '').slice(-4) : '8921'
      paymentLabel = `Card (•••• ${last4})`
    } else if (paymentTab === 'netbanking') {
      paymentLabel = `Net Banking (${bankNames[selectedBank] || 'HDFC Bank'})`
    } else if (paymentTab === 'wallets') {
      paymentLabel = `Wallet (${walletNames[selectedWallet] || 'Paytm Wallet'})`
    }

    setIsProcessingPayment(true)
    if (paymentTab === 'netbanking') {
      setProcessingMessage(`Connecting securely to ${bankNames[selectedBank] || 'Bank'} NetBanking portal...`)
    } else if (paymentTab === 'card') {
      setProcessingMessage('Authenticating 3D-Secure 2.0 with bank issuer...')
    } else if (paymentTab === 'wallets') {
      setProcessingMessage(`Authorizing payment with ${walletNames[selectedWallet] || 'Wallet'}...`)
    } else {
      setProcessingMessage('Awaiting instant UPI payment verification from NPCI...')
    }

    setTimeout(() => {
      setIsProcessingPayment(false)
      completeOrder({
        ...formData,
        paymentLabel,
        paymentMethod: paymentTab,
        finalTotal,
        discountAmount,
      })
    }, 1100)
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
              className="relative z-10 px-4 sm:px-6 pt-[calc(var(--sat)+0.75rem)] sm:pt-[calc(var(--sat)+1rem)] pb-3.5 sm:pb-4 flex items-center justify-between border-b border-black/5 bg-white/95 sm:bg-white/70 sm:backdrop-blur-md shrink-0"
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
              </button>

              {/* Centered Title: font-asul with 'Your' and 'Cart' - Reduced size on mobile */}
              <div className="text-center">
                <h3 className="font-asul text-lg sm:text-xl font-normal tracking-wide text-neutral-900">
                  Your <span className="text-orange-600">Cart</span>
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
              className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden ${items.length === 0 ? 'px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center items-center' : 'px-4 sm:px-6 py-4 sm:py-5 pb-10 space-y-3.5 sm:space-y-4.5'} scroll-smooth overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20`}
            >
              {items.length === 0 ? (
                /* Empty Cart Screen: Clean Organic Artisanal Aesthetic with Asul & Zesty Splashing Box (Reduced on Mobile) */
                <div className="relative w-full flex flex-col justify-center items-center my-auto py-4 sm:py-6">
                  {/* Center Content Section */}
                  <div className="w-full flex flex-col items-center text-center relative z-10">
                    {/* Handwritten Callout: Looks a little empty around here! */}
                    <div className="relative w-full max-w-[280px] sm:max-w-[360px] flex flex-col items-center">
                      

                      {/* Zesty Box Artwork with Splashing Citrus & Drops */}
                      
                    </div>

                    {/* Headline & Description in Asul - Reduced on mobile */}
                    <h4 className="font-asul text-2xl sm:text-4xl font-normal text-neutral-900 tracking-normal mt-2 mb-1.5">
                      Your cart is empty
                    </h4>
                    <p className="font-poppins text-[11px] sm:text-[13px] text-neutral-500 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed mb-5 font-normal">
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
                      className="group inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-2.5 sm:py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-asul font-medium text-sm sm:text-lg tracking-wide rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      <span>Explore 4 Editions</span>
                      {/* Right Arrow */}
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Luxury Delivery Status Bar with Animated Chilled Van */}
                  <div className="apple-light-card rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-2xs transition-all overflow-hidden relative">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-poppins mb-2.5 sm:mb-3">
                      <span className="font-medium text-neutral-800 flex items-center gap-1.5">
                        {isFreeShipping ? (
                          <span className="text-neutral-950 font-semibold flex items-center gap-1 sm:gap-1.5">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Complimentary Chilled Delivery Unlocked!
                          </span>
                        ) : (
                          <span>
                            You're <span className="font-semibold text-neutral-950 font-dacomment text-xs sm:text-[13px]"><span className="font-sans">₹</span>{freeShippingLeft}</span> away from <span className="font-semibold text-neutral-950">Free Chilled Delivery</span>
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 font-asul bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded-md">
                        {Math.round(Math.min(100, (subtotal / freeShippingThreshold) * 100))}%
                      </span>
                    </div>

                    {/* Animated Delivery Road Track with Van */}
                    <div className="relative pt-2.5 pb-1">
                      {/* Base road track */}
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden relative">
                        <div 
                          ref={progressBarRef}
                          className="h-full bg-neutral-950 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                        />
                      </div>

                      {/* Animated Chilled Delivery Van driving smoothly along the track */}
                      <div 
                        ref={deliveryVanRef}
                        className="absolute -top-3.5 transition-all duration-500 ease-out pointer-events-none z-10"
                        style={{ left: `calc(${Math.min(94, Math.max(0, Math.round((subtotal / freeShippingThreshold) * 100)))}% - 14px)` }}
                      >
                        <div className="w-4 h-4 rounded-full bg-neutral-900 border-2 border-white shadow-sm"></div>
                      </div>

                      {/* Destination Finish Point */}
                      <div className="absolute -right-0.5 -top-2.5 flex items-center justify-center pointer-events-none">
                        {isFreeShipping ? (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] sm:text-[9px] font-bold shadow-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-neutral-400 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cart Product Items Container - Clean Light Cards with Asul Font (Reduced on mobile) */}
                  <div ref={itemsContainerRef} className="space-y-2.5 sm:space-y-3">
                    {items.map((item) => (
                      <div 
                        key={`${item.id}-${item.pack}`} 
                        className="cart-product-item apple-light-card rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 items-center transition-all duration-200"
                      >
                        {/* Square Image Box */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-100/70 border border-black/5 flex items-center justify-center p-1.5 sm:p-2 shrink-0 relative overflow-hidden">
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
                              <h4 className="font-asul font-normal text-xs sm:text-sm text-neutral-900 leading-snug tracking-wide truncate">
                                {item.title}
                              </h4>
                              <p className="font-poppins text-[10px] sm:text-[11px] text-neutral-500 font-normal mt-0.5 truncate">
                                {item.packName || '500ml Single Can'} • {item.edition}
                              </p>
                            </div>

                            {/* Trash Icon Button (Square Button) */}
                            <button
                              type="button"
                              onClick={(e) => handleAnimatedRemove(item.id, item.pack, e)}
                              aria-label="Remove item"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100/80 hover:bg-red-50 text-neutral-400 hover:text-red-500 border border-black/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Price & Quantity Stepper row */}
                          <div className="flex items-center justify-between mt-2.5 sm:mt-3 pt-1 border-t border-black/5">
                            {/* Price in Asul with reduced font size on mobile */}
                            <div>
                              <span className="font-asul font-normal text-xs sm:text-sm text-neutral-900">
                                <span className="font-sans">₹</span>{item.totalPrice * item.qty}
                              </span>
                              {item.qty > 1 && (
                                <span className="font-poppins block text-[9px] sm:text-[10px] text-neutral-400 font-normal">
                                  <span className="font-sans">₹</span>{item.totalPrice} each
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper with SQUARE BUTTONS */}
                            <div className="qty-stepper-container flex items-center gap-0.5 sm:gap-1 bg-neutral-100/90 border border-black/10 rounded-xl p-0.5 sm:p-1">
                              {/* Square Minus Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQtyClick(item.id, item.pack, -1, e)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs sm:text-sm font-semibold border border-black/5 transition-colors cursor-pointer"
                              >
                                &minus;
                              </button>

                              {/* Number */}
                              <span className="qty-display-number w-5 sm:w-7 text-center font-poppins text-[10px] sm:text-[11px] font-semibold text-neutral-900 inline-block">
                                {item.qty}
                              </span>

                              {/* Square Plus Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQtyClick(item.id, item.pack, 1, e)}
                                aria-label="Increase quantity"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs sm:text-sm font-semibold border border-black/5 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Add-ons Section - Scaled down for mobile */}
                  <div ref={addonsRef} className="pt-1.5 sm:pt-2">
                    <span className="font-asul text-xs sm:text-sm font-normal uppercase tracking-wider text-neutral-600 block mb-2.5">
                      Recommended Add-ons
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* Wild Strawberry Addon */}
                      <div className="apple-light-card rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 transition-all">
                        <img 
                          src="/assets/straw-can-hero.png" 
                          alt="Wild Strawberry" 
                          className="w-7 h-9 sm:w-9 sm:h-11 object-contain shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-asul text-xs sm:text-sm font-normal text-neutral-900 truncate">
                            Wild Strawberry
                          </h5>
                          <span className="font-dacomment text-[10px] sm:text-[11px] font-semibold text-neutral-600 block">
                            <span className="font-sans">₹</span>350
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
                          className={`font-poppins px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold transition-all cursor-pointer shrink-0 normal-case ${
                            addedAddons['strawberry']
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white hover:bg-neutral-900 hover:text-white border-black/15 text-neutral-900'
                          }`}
                        >
                          {addedAddons['strawberry'] ? 'Added ✓' : 'Add'}
                        </button>
                      </div>

                      {/* Black Cherry Addon */}
                      <div className="apple-light-card rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 transition-all">
                        <img 
                          src="/assets/cherry-can-hero.png" 
                          alt="Black Cherry" 
                          className="w-7 h-9 sm:w-9 sm:h-11 object-contain shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-asul text-xs sm:text-sm font-normal text-neutral-900 truncate">
                            Black Cherry
                          </h5>
                          <span className="font-dacomment text-[10px] sm:text-[11px] font-semibold text-neutral-600 block">
                            <span className="font-sans">₹</span>350
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
                          className={`font-poppins px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold transition-all cursor-pointer shrink-0 normal-case ${
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

            {/* Drawer Footer & Checkout Controls (Clean Light Theme) - Scaled font sizes for mobile */}
            {items.length > 0 && (
              <div 
                ref={footerRef}
                className="relative z-10 px-4 sm:px-6 py-4 sm:py-5 border-t border-black/5 bg-white sm:bg-white/95 sm:backdrop-blur-md space-y-3 sm:space-y-4 shrink-0 shadow-lg"
              >
                {/* Bill Breakdown - Reduced font size on mobile */}
                <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-[11px]">
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
                  <div className="flex justify-between items-center pt-2 sm:pt-2.5 border-t border-neutral-200">
                    <span className="font-asul text-xs sm:text-base font-normal text-neutral-900">
                      Total
                    </span>
                    <span className="font-asul text-lg sm:text-xl font-normal text-neutral-950">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Promo Code Box: Clean Light Pill with Tag Icon */}
                {!promoInputOpen ? (
                  <button
                    type="button"
                    onClick={() => setPromoInputOpen(true)}
                    className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 border border-black/5 flex items-center justify-between text-neutral-600 text-[10px] sm:text-[11px] font-poppins font-medium transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{appliedPromoCode ? `Promo Applied: ${appliedPromoCode}` : 'Add promo code'}</span>
                    </div>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl text-[10px] sm:text-[11px] font-poppins font-medium text-neutral-900 uppercase tracking-wider outline-none focus:ring-1 focus:ring-neutral-900"
                        autoFocus
                      />
                    </div>
                    {/* Square Apply Button */}
                    <button
                      type="submit"
                      className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-neutral-950 hover:bg-black text-white text-[10px] sm:text-[11px] font-poppins font-semibold rounded-xl transition-all cursor-pointer shrink-0 normal-case shadow-sm"
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
                <div className="pt-0.5 sm:pt-1 pb-[calc(var(--sab)+0.5rem)]">
                  <button
                    ref={checkoutBtnRef}
                    type="button"
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-1.5 sm:pr-2 rounded-2xl bg-neutral-950 hover:bg-black text-white flex items-center justify-between transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-98"
                  >
                    <span className="font-asul text-xs sm:text-sm font-normal tracking-wide text-white">
                      Proceed to Checkout
                    </span>
                    {/* Square Arrow Button */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
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

      
      
      {/* Clean Colorful Checkout Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4">
          <div onClick={() => setIsCheckingOut(false)} className="fixed inset-0 bg-neutral-900/70 transition-opacity" />
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row max-h-[92vh] z-10 overflow-hidden font-poppins">
            
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4" />
                <h4 className="font-semibold text-xl text-neutral-900 mb-2">Processing Payment...</h4>
                <p className="text-sm text-neutral-600 max-w-xs">{processingMessage}</p>
              </div>
            )}

            {/* Left Column: Summary & Address (Light Orange/Warm Background) */}
            <div className="w-full lg:w-[340px] bg-orange-50/50 border-b lg:border-b-0 lg:border-r border-orange-100 p-5 sm:p-6 flex flex-col overflow-y-auto">
              <h3 className="font-semibold text-neutral-900 mb-4 text-lg">Order Summary</h3>
              <div className="space-y-3 mb-5 bg-white p-3 rounded-xl border border-orange-100">
                {items.map((it) => (
                  <div key={it.id + it.pack} className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {it.image && <img src={it.image} alt={it.title} className="w-6 h-8 object-contain shrink-0" />}
                      <span className="text-neutral-700 truncate pr-2 font-medium text-xs">{it.qty}x {it.title}</span>
                    </div>
                    <span className="text-neutral-900 font-semibold shrink-0"><span className="font-sans">₹</span>{it.totalPrice * it.qty}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-xl border border-orange-100 mb-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-neutral-900 text-sm flex items-center gap-1.5">
                    <span className="text-orange-500">📍</span> Delivery Details
                  </h4>
                  <button onClick={() => setIsAddressEditing(!isAddressEditing)} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                    {isAddressEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {!isAddressEditing ? (
                  <div className="text-xs text-neutral-600 space-y-0.5">
                    <p className="font-semibold text-neutral-900 text-sm">{formData.fullName || 'User'}</p>
                    <p>{formData.phone || 'Phone not provided'}</p>
                    <p className="pt-1">{formData.address ? `${formData.address}, ${formData.city} - ${formData.pincode}` : 'Address not provided'}</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 bg-orange-50/30 border border-orange-200 rounded-lg focus:border-orange-500 outline-none" />
                    <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-orange-50/30 border border-orange-200 rounded-lg focus:border-orange-500 outline-none" />
                    <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 bg-orange-50/30 border border-orange-200 rounded-lg focus:border-orange-500 outline-none" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-1/2 px-3 py-2 bg-orange-50/30 border border-orange-200 rounded-lg focus:border-orange-500 outline-none" />
                      <input type="text" placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-1/2 px-3 py-2 bg-orange-50/30 border border-orange-200 rounded-lg focus:border-orange-500 outline-none" />
                    </div>
                    <button onClick={() => setIsAddressEditing(false)} className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors mt-1">Save Address</button>
                  </div>
                )}
              </div>

              <div className="mt-auto bg-white p-4 rounded-xl border border-orange-100 space-y-1.5 text-xs font-medium text-neutral-600">
                <div className="flex justify-between"><span>Subtotal</span><span><span className="font-sans">₹</span>{subtotal}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className={isFreeShipping ? 'text-green-600' : ''}>{isFreeShipping ? 'Free' : <><span className="font-sans">₹</span>{shippingFee}</>}</span></div>
                <div className="flex justify-between"><span>Taxes (5%)</span><span><span className="font-sans">₹</span>{taxAmount}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount ({appliedPromoCode})</span><span>-<span className="font-sans">₹</span>{discountAmount}</span></div>}
                <div className="flex justify-between font-bold text-lg text-neutral-900 pt-2.5 border-t border-neutral-100 mt-1.5">
                  <span>Total</span><span className="text-orange-600"><span className="font-sans text-base">₹</span>{finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col bg-white">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-semibold text-2xl text-neutral-900">Payment</h3>
                  <p className="text-xs text-neutral-500 mt-1">Securely complete your order</p>
                </div>
                <button onClick={() => setIsCheckingOut(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Colorful Tabs */}
              <div className="flex space-x-1 border-b border-neutral-200 mb-6 bg-neutral-50 p-1 rounded-lg">
                {[{id: 'upi', label: 'UPI / QR', icon: '📱'}, {id: 'netbanking', label: 'Net Banking', icon: '🏦'}, {id: 'card', label: 'Cards', icon: '💳'}, {id: 'wallets', label: 'Wallets', icon: '👛'}].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentTab(tab.id)}
                    className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${paymentTab === tab.id ? 'bg-white text-orange-600 shadow-sm border border-black/5' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    <span>{tab.icon}</span> <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Content */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4">
                {paymentTab === 'upi' && (
                  <div className="space-y-6">
                    {/* QR Code Section */}
                    <div className="p-4 rounded-xl flex items-center justify-between gap-6 bg-blue-50 border border-blue-100">
                      <div>
                        <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider mb-1">Instant Scan & Pay</p>
                        <p className="text-3xl font-bold text-neutral-900 mb-1"><span className="font-sans text-2xl">₹</span>{finalTotal}</p>
                        <p className="text-xs font-medium text-blue-700 bg-blue-100 inline-block px-2 py-0.5 rounded-full">QR expires in {formatCountdown(qrCountdown)}</p>
                      </div>
                      <div className="w-24 h-24 bg-white p-2 border border-blue-200 rounded-xl shrink-0 shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="UPI QR Code" className="w-full h-full mix-blend-multiply opacity-90" />
                      </div>
                    </div>
                    
                    {/* Real UPI Apps SVGs */}
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Or Pay via UPI Apps</p>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                        {[
                          { id: 'gpay', name: 'GPay', svg: '<svg viewBox="0 0 24 24" class="w-6 h-6"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>' },
                          { id: 'phonepe', name: 'PhonePe', svg: '<div class="w-6 h-6 rounded-full bg-[#5F259F] text-white font-bold text-xs flex items-center justify-center">पे</div>' },
                          { id: 'paytm', name: 'Paytm', svg: '<span class="text-xs font-black text-[#002970]">Pay<span class="text-[#00B9F5]">tm</span></span>' },
                          { id: 'bhim', name: 'BHIM', svg: '<svg viewBox="0 0 24 24" class="w-6 h-6"><polygon points="4,2 14,2 8,22 2,22" fill="#00A652" /><polygon points="12,2 22,2 16,22 10,22" fill="#F37021" /></svg>' },
                          { id: 'cred', name: 'CRED', svg: '<div class="w-6 h-6 rounded-md bg-black text-white font-black text-[10px] flex items-center justify-center">C</div>' }
                        ].map(app => (
                          <button
                            key={app.id}
                            onClick={() => setSelectedUpiApp(app.id)}
                            className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${selectedUpiApp === app.id ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
                          >
                            <div dangerouslySetInnerHTML={{ __html: app.svg }} />
                            <span className="text-[10px] font-semibold text-neutral-800">{app.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Pay via UPI ID</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter UPI ID (e.g. name@bank)" value={customUpiId} onChange={e => setCustomUpiId(e.target.value)} className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm bg-white" />
                        <button onClick={handleVerifyUpi} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${upiVerified ? 'bg-green-100 text-green-700' : 'bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 text-neutral-900'}`}>
                          {upiVerifying ? 'Verifying...' : upiVerified ? '✓ Verified' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentTab === 'netbanking' && (
                  <div className="space-y-5">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Popular Indian Banks</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'hdfc', name: 'HDFC Bank', svg: '<svg viewBox="0 0 24 24" class="w-5 h-5"><rect width="24" height="24" fill="#004C8F" rx="3" /><rect x="3" y="10" width="18" height="4" fill="#ED232A" /><rect x="10" y="3" width="4" height="18" fill="#ED232A" /><rect x="7" y="7" width="10" height="10" fill="#004C8F" /></svg>' },
                        { id: 'sbi', name: 'State Bank', svg: '<svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="12" r="11" fill="#008CD0"/><circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/><rect x="10.8" y="12" width="2.4" height="9" fill="#008CD0"/></svg>' },
                        { id: 'icici', name: 'ICICI Bank', svg: '<div class="w-5 h-5 rounded-md bg-[#B02A30] text-white font-black text-xs flex items-center justify-center">I</div>' },
                        { id: 'axis', name: 'Axis Bank', svg: '<div class="w-5 h-5 rounded-md bg-[#97144D] text-white font-black text-xs flex items-center justify-center">▲</div>' }
                      ].map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBank(b.id)}
                          className={`p-3 border rounded-xl flex items-center gap-3 transition-colors ${selectedBank === b.id ? 'border-orange-500 bg-orange-50 font-semibold text-orange-900' : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'}`}
                        >
                          <div dangerouslySetInnerHTML={{ __html: b.svg }} />
                          <span className="text-sm">{b.name}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Other Banks</label>
                      <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="w-full p-3.5 border border-neutral-300 rounded-xl text-sm outline-none bg-white focus:border-orange-500">
                        <option value="hdfc">HDFC Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="bob">Bank of Baroda</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentTab === 'card' && (
                  <div className="space-y-4 text-sm">
                    {/* Visual Card Wrapper for Color */}
                    <div className="p-4 bg-slate-800 text-white rounded-xl mb-4 shadow-sm border border-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-600 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="w-8 h-6 bg-yellow-400 rounded-sm opacity-80"></div>
                        <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">{cardData.number?.startsWith('4') ? 'VISA' : cardData.number?.startsWith('5') ? 'MASTERCARD' : 'CARD'}</span>
                      </div>
                      <div className="font-mono text-lg tracking-widest mb-2 relative z-10">{cardData.number || '•••• •••• •••• ••••'}</div>
                      <div className="flex justify-between text-xs text-slate-300 relative z-10">
                        <span className="uppercase">{cardData.name || 'CARDHOLDER NAME'}</span>
                        <span className="font-mono">{cardData.expiry || 'MM/YY'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold text-xs uppercase tracking-wider mb-1.5">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-mono bg-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-600 font-semibold text-xs uppercase tracking-wider mb-1.5">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block text-neutral-600 font-semibold text-xs uppercase tracking-wider mb-1.5">CVV</label>
                        <input type="password" placeholder="123" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-600 font-semibold text-xs uppercase tracking-wider mb-1.5">Name on Card</label>
                      <input type="text" placeholder="Cardholder Name" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white" />
                    </div>
                  </div>
                )}

                {paymentTab === 'wallets' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Select Wallet</label>
                    {[
                      {id: 'paytm', name: 'Paytm Wallet', icon: '🔵'}, 
                      {id: 'amazon', name: 'Amazon Pay', icon: '🛒'}, 
                      {id: 'phonepe', name: 'PhonePe', icon: '🟣'}
                    ].map(w => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWallet(w.id)}
                        className={`w-full p-4 border rounded-xl flex items-center justify-between transition-colors ${selectedWallet === w.id ? 'border-orange-500 bg-orange-50 text-orange-900 font-semibold' : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{w.icon}</span>
                          <span>{w.name}</span>
                        </div>
                        {selectedWallet === w.id && <span className="text-orange-500">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 shrink-0">
                <button onClick={handleCheckoutSubmit} className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors text-base flex items-center justify-center gap-2">
                  <span>Pay <span className="font-sans">₹</span>{finalTotal}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Colorful Success Page */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div onClick={() => setOrderConfirmed(null)} className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm transition-opacity" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 text-center font-poppins overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Top Color Banner & Image */}
            <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">Payment Successful!</h3>
              <p className="text-sm text-neutral-600">Your organic juice box is being packed.</p>
            </div>

            {/* Generated Delivery Box Image inside Success Page */}
            <div className="w-full h-48 bg-neutral-100 border-b border-neutral-100 relative overflow-hidden">
              <img src="/images/success_delivery_box.jpg" alt="Your Clean Juice Box" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-neutral-700 shadow-sm">
                Preparing for Dispatch...
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5 text-left">
                <div className="flex justify-between text-sm mb-2.5 items-center">
                  <span className="text-neutral-600 font-medium">Amount Paid</span>
                  <span className="font-bold text-xl text-neutral-900"><span className="font-sans">₹</span>{orderConfirmed.customerDetails.finalTotal}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-neutral-600 font-medium">Order ID</span>
                  <span className="font-mono text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200">{orderConfirmed.orderId}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setOrderConfirmed(null)
                    setIsCartOpen(false)
                    setIsAccountOpen(true)
                  }}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Track Order
                </button>
                <button
                  onClick={() => setOrderConfirmed(null)}
                  className="flex-1 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-semibold rounded-xl text-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
