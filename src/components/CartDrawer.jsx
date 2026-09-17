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
  const [upiError, setUpiError] = useState('')
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
        <div className="fixed bottom-6 right-6 z-60 max-w-sm w-full bg-neutral-950 text-white shadow-2xl rounded-none p-3 pr-4 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 fade-in duration-300 border border-black/10">
          {toastMessage.image && (
            <div className="w-12 h-12 shrink-0 bg-white/10 rounded-none p-1.5 flex items-center justify-center border border-white/10">
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
            className="font-poppins px-3.5 py-1.5 bg-white/15 hover:bg-(--color-coral) text-white text-xs font-semibold rounded-none transition-colors cursor-pointer shrink-0"
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
            className="relative w-full max-w-[540px] h-full bg-white border-l border-neutral-200 flex flex-col z-10 overscroll-contain overflow-hidden text-neutral-900 shadow-2xl"
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
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-800 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Centered Title: font-vagnola with 'Your' and 'Cart' - Reduced size on mobile */}
              <div className="text-center">
                <h3 className="font-vagnola text-lg sm:text-xl font-normal tracking-wide text-neutral-900">
                  Your <span className="text-neutral-900">Cart</span>
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
              className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden ${items.length === 0 ? 'px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center items-center' : 'px-4 sm:px-6 py-4 sm:py-5 pb-10 space-y-3.5 sm:space-y-4.5'} scroll-smooth overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-none hover:[&::-webkit-scrollbar-thumb]:bg-black/20`}
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
                    <h4 className="font-vagnola text-2xl sm:text-4xl font-normal text-neutral-900 tracking-normal mt-2 mb-1.5">
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
                      className="group inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-2.5 sm:py-3.5 bg-black hover:bg-neutral-800 text-white font-vagnola font-medium text-sm sm:text-lg tracking-wide rounded-none shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
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
                  <div className="bg-white border border-neutral-200 rounded-none shadow-sm px-4 sm:px-5 py-3 sm:py-4 shadow-2xs transition-all overflow-hidden relative">
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
                      <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 font-vagnola bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded-md">
                        {Math.round(Math.min(100, (subtotal / freeShippingThreshold) * 100))}%
                      </span>
                    </div>

                    {/* Animated Delivery Road Track with Van */}
                    <div className="relative pt-2.5 pb-1">
                      {/* Base road track */}
                      <div className="w-full h-1.5 bg-neutral-100 rounded-none overflow-hidden relative">
                        <div 
                          ref={progressBarRef}
                          className="h-full bg-neutral-950 rounded-none transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                        />
                      </div>

                      {/* Animated Chilled Delivery Van driving smoothly along the track */}
                      <div 
                        ref={deliveryVanRef}
                        className="absolute -top-3.5 transition-all duration-500 ease-out pointer-events-none z-10"
                        style={{ left: `calc(${Math.min(94, Math.max(0, Math.round((subtotal / freeShippingThreshold) * 100)))}% - 14px)` }}
                      >
                        <div className="w-4 h-4 rounded-none bg-neutral-900 border-2 border-white shadow-sm"></div>
                      </div>

                      {/* Destination Finish Point */}
                      <div className="absolute -right-0.5 -top-2.5 flex items-center justify-center pointer-events-none">
                        {isFreeShipping ? (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-none bg-emerald-600 text-white flex items-center justify-center text-[8px] sm:text-[9px] font-medium shadow-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-none border border-neutral-400 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-none bg-white0" />
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
                        className="cart-product-item bg-white border border-neutral-200 rounded-none shadow-sm p-3 sm:p-4 flex gap-3 sm:gap-4 items-center transition-all duration-200"
                      >
                        {/* Square Image Box */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-neutral-100/70 border border-black/5 flex items-center justify-center p-1.5 sm:p-2 shrink-0 relative overflow-hidden">
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
                              <h4 className="font-vagnola font-normal text-xs sm:text-sm text-neutral-900 leading-snug tracking-wide truncate">
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
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-neutral-100/80 hover:bg-red-50 text-neutral-400 hover:text-red-500 border border-black/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
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
                              <span className="font-vagnola font-normal text-xs sm:text-sm text-neutral-900">
                                <span className="font-sans">₹</span>{item.totalPrice * item.qty}
                              </span>
                              {item.qty > 1 && (
                                <span className="font-poppins block text-[9px] sm:text-[10px] text-neutral-400 font-normal">
                                  <span className="font-sans">₹</span>{item.totalPrice} each
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper with SQUARE BUTTONS */}
                            <div className="qty-stepper-container flex items-center gap-0.5 sm:gap-1 bg-neutral-100/90 border border-black/10 rounded-none p-0.5 sm:p-1">
                              {/* Square Minus Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQtyClick(item.id, item.pack, -1, e)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs sm:text-sm font-semibold border border-black/5 transition-colors cursor-pointer"
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
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs sm:text-sm font-semibold border border-black/5 transition-colors cursor-pointer"
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
                    <span className="font-vagnola text-xs sm:text-sm font-normal uppercase tracking-wider text-neutral-600 block mb-2.5">
                      Recommended Add-ons
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* Wild Strawberry Addon */}
                      <div className="bg-white border border-neutral-200 rounded-none shadow-sm p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 transition-all">
                        <img 
                          src="/assets/straw-can-hero.png" 
                          alt="Wild Strawberry" 
                          className="w-7 h-9 sm:w-9 sm:h-11 object-contain shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-vagnola text-xs sm:text-sm font-normal text-neutral-900 truncate">
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
                          className={`font-poppins px-2 sm:px-3 py-1 sm:py-1.5 rounded-none border text-[10px] sm:text-xs font-semibold transition-all cursor-pointer shrink-0 normal-case ${
                            addedAddons['strawberry']
                              ? 'bg-black text-white rounded-none border-neutral-900'
                              : 'bg-white hover:bg-neutral-900 hover:text-white border-black/15 text-neutral-900'
                          }`}
                        >
                          {addedAddons['strawberry'] ? 'Added ✓' : 'Add'}
                        </button>
                      </div>

                      {/* Black Cherry Addon */}
                      <div className="bg-white border border-neutral-200 rounded-none shadow-sm p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 transition-all">
                        <img 
                          src="/assets/cherry-can-hero.png" 
                          alt="Black Cherry" 
                          className="w-7 h-9 sm:w-9 sm:h-11 object-contain shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-vagnola text-xs sm:text-sm font-normal text-neutral-900 truncate">
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
                          className={`font-poppins px-2 sm:px-3 py-1 sm:py-1.5 rounded-none border text-[10px] sm:text-xs font-semibold transition-all cursor-pointer shrink-0 normal-case ${
                            addedAddons['cherry']
                              ? 'bg-black text-white rounded-none border-neutral-900'
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
                    <span className="font-vagnola text-xs sm:text-base font-normal text-neutral-900">
                      Total
                    </span>
                    <span className="font-vagnola text-lg sm:text-xl font-normal text-neutral-950">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Promo Code Box: Clean Light Pill with Tag Icon */}
                {!promoInputOpen ? (
                  <button
                    type="button"
                    onClick={() => setPromoInputOpen(true)}
                    className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-none bg-neutral-100 hover:bg-neutral-200/80 border border-black/5 flex items-center justify-between text-neutral-600 text-[10px] sm:text-[11px] font-poppins font-medium transition-all cursor-pointer"
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
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-none text-[10px] sm:text-[11px] font-poppins font-medium text-neutral-900 uppercase tracking-wider outline-none focus:ring-1 focus:ring-neutral-900"
                        autoFocus
                      />
                    </div>
                    {/* Square Apply Button */}
                    <button
                      type="submit"
                      className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-neutral-950 hover:bg-black text-white text-[10px] sm:text-[11px] font-poppins font-semibold rounded-none transition-all cursor-pointer shrink-0 normal-case shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoError && (
                  <p ref={errorRef} className="font-poppins text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-none">
                    {promoError}
                  </p>
                )}

                {/* Primary PROCEED TO CHECKOUT CTA in Luxury Deep Charcoal with Square Arrow Button */}
                <div className="pt-0.5 sm:pt-1 pb-[calc(var(--sab)+0.5rem)]">
                  <button
                    ref={checkoutBtnRef}
                    type="button"
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-1.5 sm:pr-2 rounded-none bg-neutral-950 hover:bg-black text-white flex items-center justify-between transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-98"
                  >
                    <span className="font-vagnola text-xs sm:text-sm font-normal tracking-wide text-white">
                      PROCEED TO CHECKOUT
                    </span>
                    {/* Square Arrow Button */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
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

      
      
      
      {/* Full Page Checkout */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-60 bg-white flex flex-col font-sans overflow-hidden w-full h-full">
          {/* Header - Navbar & Progress */}
          <div className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 py-4 border-b border-neutral-200 bg-white shrink-0 gap-4 md:gap-0">
            {/* Zesty Logo */}
            <div className="w-full md:w-auto flex items-center justify-between md:block">
              <div>
                <h1 className="font-display font-bold text-3xl tracking-tighter text-[#0F763F] flex items-center gap-1">
                  Zesty<span className="text-emerald-500 w-3 h-3 rounded-full inline-block rounded-tr-none -translate-y-1.5 rotate-45"></span>
                </h1>
                <p className="text-[8px] text-neutral-500 font-medium tracking-widest uppercase -mt-1.5 ml-0.5">Pure Juice. Real Good.</p>
              </div>
              
              {/* Mobile Back button that appears only on mobile instead of the main nav links */}
              <button onClick={() => setIsCheckingOut(false)} className="md:hidden flex items-center gap-1 text-neutral-500 hover:text-neutral-900 font-medium transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
            </div>
          </div>
          {/* Progress Stepper Banner */}
          <div className="w-full bg-white border-b border-neutral-200 py-3 flex justify-center shadow-sm z-10 relative">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 text-[#0F763F]">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-none bg-[#0F763F] text-white flex items-center justify-center text-xs">1</div>
                Checkout
              </div>
              <div className="w-8 sm:w-12 h-px bg-neutral-200"></div>
              <div className="flex items-center gap-2 text-neutral-500">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-none bg-neutral-400 text-white flex items-center justify-center text-xs">2</div>
                Payment
              </div>
              <div className="w-8 sm:w-12 h-px bg-neutral-200"></div>
              <div className="flex items-center gap-2 text-neutral-400">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-none bg-neutral-300 text-white flex items-center justify-center text-xs">3</div>
                Order Placed
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
            
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-neutral-200 border-t-[#0F763F] rounded-none animate-spin mb-4" />
                <h4 className="font-semibold text-xl text-neutral-900 mb-2">Processing Payment...</h4>
                <p className="text-sm text-neutral-600 max-w-xs">Please do not close this page or press back.</p>
              </div>
            )}

            {/* Left Column: Summary & Address */}
            <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#F9F9F9] border-r border-neutral-200 p-6 sm:p-8 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="mb-6">
                <h3 className="font-bold text-neutral-900 text-xl sm:text-2xl tracking-tight">Order Summary</h3>
                <p className="text-sm text-neutral-500 mt-1">Review your items and delivery details</p>
              </div>

              <div className="space-y-4 mb-6 border-b border-neutral-200 pb-6">
                {items.map((it) => (
                  <div key={it.id + it.pack} className="flex justify-between items-center bg-[#F9F9F9]">
                    <div className="flex items-center gap-4">
                      {it.image && <img src={it.image} alt={it.title} className="w-8 h-12 object-contain shrink-0 drop-shadow-sm" />}
                      <div>
                        <span className="text-neutral-900 font-semibold text-sm block">{it.title}</span>
                        <span className="text-neutral-500 text-xs">{it.volume || '350ml'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-neutral-200 bg-white rounded-none">
                        <button type="button" onClick={(e) => handleQtyClick(it.id, it.pack, -1, e)} className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900">&minus;</button>
                        <span className="w-6 text-center text-xs font-semibold">{it.qty}</span>
                        <button type="button" onClick={(e) => handleQtyClick(it.id, it.pack, 1, e)} className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900">+</button>
                      </div>
                      <span className="text-neutral-900 font-bold shrink-0 text-sm"><span className="font-sans mr-0.5">₹</span>{it.totalPrice * it.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 border-b border-neutral-200 pb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-neutral-900 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    Delivery Details
                  </h4>
                  <button onClick={() => setIsAddressEditing(!isAddressEditing)} className="text-sm font-semibold text-[#0F763F] hover:text-[#0C5E32] underline">
                    {isAddressEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {!isAddressEditing ? (
                  <div className="text-sm text-neutral-600 pl-6 space-y-1">
                    <p className="font-medium text-neutral-900 text-sm">{formData.fullName || 'User'}</p>
                    <p>{formData.phone || 'Phone not provided'}</p>
                    <p>{formData.address ? `${formData.address}, ${formData.city} - ${formData.pincode}` : 'Address not provided'}</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm pl-6 mt-3">
                    <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-none focus:border-[#0F763F] outline-none" />
                    <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-none focus:border-[#0F763F] outline-none" />
                    <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-none focus:border-[#0F763F] outline-none" />
                    <div className="flex gap-3">
                      <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-1/2 px-3 py-2 bg-white border border-neutral-200 rounded-none focus:border-[#0F763F] outline-none" />
                      <input type="text" placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-1/2 px-3 py-2 bg-white border border-neutral-200 rounded-none focus:border-[#0F763F] outline-none" />
                    </div>
                    <button onClick={() => setIsAddressEditing(false)} className="px-4 py-2 bg-[#0F763F] hover:bg-[#0C5E32] text-white font-medium text-xs rounded-none mt-2">Save</button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-neutral-600 border-b border-neutral-200 pb-6 mb-6">
                <div className="flex justify-between font-medium"><span>Subtotal</span><span className="text-neutral-900 font-semibold"><span className="font-sans mr-0.5">₹</span>{subtotal}</span></div>
                <div className="flex justify-between font-medium"><span>Shipping</span><span className="text-[#0F763F] font-bold">Free</span></div>
                <div className="flex justify-between font-medium"><span>Taxes (5%)</span><span className="text-neutral-900 font-semibold"><span className="font-sans mr-0.5">₹</span>{taxAmount}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-[#0F763F] font-medium"><span>Discount ({appliedPromoCode})</span><span>-<span className="font-sans mr-0.5">₹</span>{discountAmount}</span></div>}
              </div>

              <div className="flex justify-between font-bold text-lg text-neutral-900">
                <span>Total Amount</span><span className="text-[#0F763F] text-3xl tracking-tight"><span className="font-sans text-2xl mr-1">₹</span>{finalTotal}</span>
              </div>

            </div>

            {/* Right Column: Payment */}
            <div className="flex-1 p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="mb-10">
                <h3 className="font-bold text-3xl md:text-4xl text-neutral-900 tracking-tight">Payment Method</h3>
                <p className="text-sm text-neutral-500 mt-2 font-medium">Choose a payment option to complete your order</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-200 mb-8 w-full">
                {[
                  {id: 'upi', label: 'UPI / QR'}, 
                  {id: 'netbanking', label: 'Net Banking'}, 
                  {id: 'card', label: 'Cards'}, 
                  {id: 'wallets', label: 'Wallets'}
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentTab(tab.id)}
                    className={`flex-1 pb-4 text-sm font-semibold transition-all flex items-center justify-center ${paymentTab === tab.id ? 'border-b-[3px] border-[#0F763F] text-[#0F763F]' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 w-full max-w-[600px]">
                {paymentTab === 'upi' && (
                  <div className="animate-in fade-in duration-300">
                    
                    {/* Re-designed QR Box to exactly match mockup */}
                    <div className="border border-neutral-200 rounded-none bg-white p-6 sm:p-8 mb-8 shadow-sm">
                      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-4">
                        
                        {/* Left Side: Amount and Apps */}
                        <div className="flex-1 w-full">
                          <p className="text-sm text-neutral-800 font-medium mb-2">Scan QR and Pay</p>
                          <p className="text-5xl font-bold text-neutral-900 mb-4 tracking-tight"><span className="font-sans font-medium text-4xl mr-1">₹</span>{finalTotal}</p>
                          
                          <div className="inline-block bg-[#EBF5ED] text-[#0F763F] text-xs font-semibold px-4 py-2 mb-8 rounded-none border border-[#0F763F]/20">
                            Open any UPI app and scan the QR code
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            {[
                              { id: 'gpay', name: 'GPay', icon: <img src="/assets/gpay.svg" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="GPay" onError={(e) => {e.target.onerror = null; e.target.src = '/assets/gpay.png'}}/> },
                              { id: 'phonepe', name: 'PhonePe', icon: <img src="/assets/phonepe.svg" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="PhonePe" onError={(e) => {e.target.onerror = null; e.target.src = '/assets/phonepe.png'}}/> },
                              { id: 'paytm', name: 'Paytm', icon: <img src="/assets/paytm.svg" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="Paytm" onError={(e) => {e.target.onerror = null; e.target.src = '/assets/paytm.png'}}/> },
                              { id: 'bhim', name: 'BHIM', icon: <img src="/assets/bhim.svg" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="BHIM" onError={(e) => {e.target.onerror = null; e.target.src = '/assets/bhim.png'}}/> },
                              { id: 'cred', name: 'CRED', icon: <img src="/assets/cred.svg" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="CRED" onError={(e) => {e.target.onerror = null; e.target.src = '/assets/cred.png'}}/> },
                            ].map((app) => (
                              <button
                                key={app.id}
                                onClick={() => setSelectedUpiApp(app.id)}
                                className={`w-14 h-16 sm:w-16 sm:h-20 bg-white border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${selectedUpiApp === app.id ? 'border-[#0F763F] shadow-sm' : 'border-neutral-200 hover:border-neutral-300'}`}
                              >
                                {app.icon}
                                <span className="text-[10px] text-neutral-500 font-medium">{app.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Right Side: QR Code */}
                        <div className="w-full md:w-[280px] flex flex-col items-center justify-center pl-0 md:pl-8 border-l-0 md:border-l border-neutral-200 shrink-0">
                          <div className="w-48 h-48 bg-white p-2 border border-neutral-200 shadow-sm mb-4 relative">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="UPI QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                            {/* Little leaf logo in the center of QR (Mockup style) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="bg-white p-1 rounded-sm border border-neutral-200 shadow-sm">
                                <svg className="w-4 h-4 text-[#0F763F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                              </div>
                            </div>
                          </div>
                          
                          <span className="text-xs text-neutral-500 font-medium mb-3">Scan with any UPI app</span>
                          
                          <div className="bg-[#EBF5ED] px-4 py-2 w-full text-center">
                            <span className="text-[#0F763F] text-[11px] font-bold">QR expires in {formatCountdown(qrCountdown)}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    <label className="block text-sm font-bold text-neutral-900 mb-3">Or Enter UPI ID</label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={customUpiId}
                        onChange={(e) => {
                          setCustomUpiId(e.target.value)
                          setUpiError('')
                        }}
                        placeholder="Enter UPI ID (e.g. name@bank)"
                        className="flex-1 px-4 py-3 border border-neutral-300 rounded-none focus:outline-none focus:border-[#0F763F] text-sm"
                      />
                      <button
                        onClick={handleVerifyUpi}
                        className={`px-8 py-3 rounded-none text-sm font-medium transition-colors w-32 ${upiVerifying ? 'bg-[#0F763F] text-white' : upiVerified ? 'bg-[#EBF5ED] text-[#0F763F] border border-[#0F763F]' : 'bg-[#0F763F] text-white hover:bg-[#0C5E32]'}`}
                      >
                        {upiVerifying ? 'Verifying...' : upiVerified ? '✓ Verified' : 'Verify'}
                      </button>
                    </div>
                    {upiError && <p className="text-red-500 text-xs mt-2 font-medium">{upiError}</p>}
                  </div>
                )}

                {paymentTab === 'netbanking' && (
                  <div className="animate-in fade-in duration-300">
                    <label className="block text-sm font-bold text-neutral-900 mb-3">Select your bank</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {['hdfc', 'sbi', 'icici', 'axis', 'kotak', 'pnb'].map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`px-4 py-4 rounded-none border text-sm font-medium transition-all ${selectedBank === bank ? 'border-[#0F763F] bg-[#EBF5ED] text-[#0F763F]' : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700'}`}
                        >
                          {bank.toUpperCase()} Bank
                        </button>
                      ))}
                    </div>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-none focus:outline-none focus:border-[#0F763F] text-sm bg-white"
                    >
                      <option value="" disabled>Search other banks...</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="union">Union Bank of India</option>
                      <option value="indusind">IndusInd Bank</option>
                      <option value="yes">Yes Bank</option>
                      <option value="idfc">IDFC FIRST Bank</option>
                      <option value="federal">Federal Bank</option>
                    </select>
                  </div>
                )}

                {paymentTab === 'card' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <label className="block text-sm font-bold text-neutral-900 mb-1">Enter Card Details</label>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-none focus:outline-none focus:border-[#0F763F] text-sm"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-1/2 px-4 py-3 border border-neutral-300 rounded-none focus:outline-none focus:border-[#0F763F] text-sm"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-1/2 px-4 py-3 border border-neutral-300 rounded-none focus:outline-none focus:border-[#0F763F] text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-none focus:outline-none focus:border-[#0F763F] text-sm"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" id="save-card" className="w-4 h-4 accent-[#0F763F]" />
                      <label htmlFor="save-card" className="text-xs text-neutral-600">Save this card securely for future purchases</label>
                    </div>
                  </div>
                )}

                {paymentTab === 'wallets' && (
                  <div className="animate-in fade-in duration-300">
                    <label className="block text-sm font-bold text-neutral-900 mb-3">Select a Wallet</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['paytm', 'amazonpay', 'phonepe', 'mobikwik'].map((wallet) => (
                        <button
                          key={wallet}
                          onClick={() => setSelectedWallet(wallet)}
                          className={`px-4 py-4 rounded-none border text-sm font-medium transition-all ${selectedWallet === wallet ? 'border-[#0F763F] bg-[#EBF5ED] text-[#0F763F]' : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700'}`}
                        >
                          {wallet === 'amazonpay' ? 'Amazon Pay' : wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Proceed Button */}
              <div className="mt-12 w-full max-w-[600px]">
                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  disabled={isProcessingPayment}
                  className="group w-full py-4 bg-[#0F763F] hover:bg-[#0C5E32] text-white font-semibold text-lg rounded-none transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-none animate-spin" />
                  ) : (
                    <>
                      <span>Pay <span className="font-sans mr-0.5">₹</span>{finalTotal}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Colorful Success Page */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-70 flex flex-col bg-neutral-100 font-poppins w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-center px-6 py-5 border-b border-neutral-200 bg-white shrink-0 shadow-sm">
            <h2 className="text-2xl font-vagnola font-medium text-neutral-900 tracking-wide">Order Confirmation</h2>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-4 sm:p-8">
            <div className="w-full max-w-2xl bg-white rounded-none shadow-md border border-neutral-200 overflow-hidden flex flex-col">
              
              {/* Top Color Banner */}
              <div className="bg-emerald-50 border-b border-emerald-100 p-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-none flex items-center justify-center mb-5 shadow-sm">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-4xl font-vagnola font-medium text-neutral-900 mb-2">Payment Successful!</h3>
                <p className="text-base text-neutral-600 font-medium">Your organic juice box is being packed.</p>
              </div>

              {/* Generated Delivery Box Image inside Success Page */}
              <div className="w-full h-64 bg-neutral-100 border-b border-neutral-200 relative overflow-hidden">
                <img src="/images/success_delivery_box.jpg" alt="Your Clean Juice Box" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-none text-xs font-medium text-neutral-800 shadow-md border border-neutral-200 uppercase tracking-wide">
                  Preparing for Dispatch
                </div>
              </div>
              
              <div className="p-8 bg-white">
                <div className="bg-white border border-neutral-200 rounded-none p-6 mb-8 text-left">
                  <div className="flex justify-between text-base mb-3 items-center">
                    <span className="text-neutral-700 font-medium uppercase tracking-wider">Amount Paid</span>
                    <span className="font-semibold text-2xl text-neutral-900"><span className="font-sans mr-1">₹</span>{orderConfirmed.customerDetails.finalTotal}</span>
                  </div>
                  <div className="flex justify-between text-base items-center">
                    <span className="text-neutral-700 font-medium uppercase tracking-wider">Order ID</span>
                    <span className="font-mono font-medium text-neutral-900 bg-white px-3 py-1 border border-neutral-200 text-lg tracking-wide">{orderConfirmed.orderId}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setOrderConfirmed(null)
                      setIsCartOpen(false)
                      setIsAccountOpen(true)
                    }}
                    className="flex-1 py-4 bg-neutral-900 hover:bg-black text-white font-medium tracking-wide uppercase rounded-none text-sm transition-colors border-2 border-black"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() => setOrderConfirmed(null)}
                    className="flex-1 py-4 bg-white border-2 border-neutral-300 hover:border-neutral-500 text-neutral-900 font-medium tracking-wide uppercase rounded-none text-sm transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
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
            className="relative w-full max-w-[340px] bg-white rounded-none p-7 z-10 text-center border border-black/10 shadow-2xl text-neutral-900"
          >
            <div className="w-12 h-12 rounded-none bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-[#1E5BF7]">
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
              className="font-poppins w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs font-semibold rounded-none transition-all cursor-pointer shadow-md normal-case"
            >
              Apply Coupons
            </button>
          </div>
        </div>
      )}
    </>
  )
}
