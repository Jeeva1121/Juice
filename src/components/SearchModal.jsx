import { useState, useEffect, useRef, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'

const PRODUCTS = [
  {
    id: 'orange',
    editionNum: '01',
    word: 'ORANGE',
    title: 'Valencia Orange',
    flavorTag: 'Citrus Hydration',
    subtitle: 'Cold-pressed organic Valencia citrus with electrolytes.',
    price: '₹99',
    numericPrice: 99,
    image: '/assets/orange-can-hero.png',
    accentColor: '#EA580C',
    tags: ['orange', 'valencia', 'citrus', 'electrolytes', 'vitamin c', 'sun'],
  },
  {
    id: 'strawberry',
    editionNum: '02',
    word: 'BERRY',
    title: 'Wild Strawberry',
    flavorTag: 'Antioxidant Glow',
    subtitle: 'Mountain strawberries with young coconut nectar.',
    price: '₹99',
    numericPrice: 99,
    image: '/assets/straw-can-hero.png',
    accentColor: '#E11D48',
    tags: ['strawberry', 'wild strawberry', 'berry', 'antioxidants', 'coconut', 'sweet', 'ruby'],
  },
  {
    id: 'cherry',
    editionNum: '03',
    word: 'CHERRY',
    title: 'Black Cherry',
    flavorTag: 'Deep Recovery',
    subtitle: 'Montmorency tart cherries rich in restful antioxidants.',
    price: '₹99',
    numericPrice: 99,
    image: '/assets/cherry-can-hero.png',
    accentColor: '#881337',
    tags: ['cherry', 'black cherry', 'tart cherry', 'recovery', 'sleep', 'rest', 'deep'],
  },
  {
    id: 'lemon',
    editionNum: '04',
    word: 'LEMON',
    title: 'Zesty Lemon',
    flavorTag: 'Alkaline Immunity',
    subtitle: 'Cold-pressed Sorrento lemon pulp with vitamin C vitality.',
    price: '₹99',
    numericPrice: 99,
    image: '/assets/lemon-can-hero.png',
    accentColor: '#CA8A04',
    tags: ['lemon', 'zesty lemon', 'citrus', 'amalfi', 'immune', 'alkaline', 'zesty'],
  },
]

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [addedItem, setAddedItem] = useState(null)

  const modalRef = useRef(null)
  const bgTextRef = useRef(null)
  const centerCanRef = useRef(null)
  const leftCanRef = useRef(null)
  const rightCanRef = useRef(null)
  const detailsCardRef = useRef(null)
  const inputRef = useRef(null)
  const autoPlayTimerRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isTransitioningRef = useRef(false)
  const queuedSlideRef = useRef(null)
  const activeIndexRef = useRef(0)

  // Navigate to slide with GSAP animation
  const animateToSlide = useCallback(function navigateSlide(newIdx, direction = null) {
    if (newIdx === activeIndexRef.current) return
    if (isTransitioningRef.current) {
      queuedSlideRef.current = newIdx
      return
    }
    isTransitioningRef.current = true
    queuedSlideRef.current = null

    const dir = direction !== null ? direction : (newIdx > activeIndexRef.current ? 1 : -1)

    // GSAP Exit Timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setActiveIndex(newIdx)
        activeIndexRef.current = newIdx

        // React re-render tick
        setTimeout(() => {
          const inTl = gsap.timeline({
            defaults: { ease: 'power4.out' },
            onComplete: () => {
              isTransitioningRef.current = false
              if (queuedSlideRef.current !== null) {
                const nextIdx = queuedSlideRef.current
                queuedSlideRef.current = null
                if (nextIdx !== newIdx) {
                  navigateSlide(nextIdx)
                }
              }
            },
          })

          // Giant background word slides in
          if (bgTextRef.current) {
            inTl.fromTo(
              bgTextRef.current,
              { x: dir * 100, opacity: 0 },
              { x: 0, opacity: 0.65, duration: 0.6 },
              0
            )
          }

          // Center BIG can slides in and scales up
          if (centerCanRef.current) {
            inTl.fromTo(
              centerCanRef.current,
              { x: dir * 150, scale: 0.75, opacity: 0, rotate: dir * 8 },
              { x: 0, scale: 1, opacity: 1, rotate: 0, duration: 0.7 },
              0.05
            )
          }

          // Flanking mid-size cans slide in (Synchronized duration and momentum)
          if (leftCanRef.current) {
            inTl.fromTo(
              leftCanRef.current,
              { x: dir * 100, opacity: 0, scale: 0.6, rotate: dir * -8 },
              { x: 0, opacity: 0.7, scale: 0.8, rotate: 0, duration: 0.7 },
              0.05
            )
          }

          if (rightCanRef.current) {
            inTl.fromTo(
              rightCanRef.current,
              { x: dir * 100, opacity: 0, scale: 0.6, rotate: dir * 8 },
              { x: 0, opacity: 0.7, scale: 0.8, rotate: 0, duration: 0.7 },
              0.05
            )
          }

          // Details bar gently fades and slides up
          if (detailsCardRef.current) {
            inTl.fromTo(
              detailsCardRef.current,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5 },
              0.15
            )
          }
        }, 15)
      },
    })

    // Exit current elements
    if (centerCanRef.current) {
      tl.to(
        centerCanRef.current,
        { x: -dir * 120, scale: 0.75, opacity: 0, rotate: -dir * 8, duration: 0.35, ease: 'power3.in' },
        0
      )
    }

    if (leftCanRef.current) {
      tl.to(leftCanRef.current, { x: -dir * 60, opacity: 0, scale: 0.7, rotate: -dir * 8, duration: 0.25, ease: 'power3.in' }, 0)
    }

    if (rightCanRef.current) {
      tl.to(rightCanRef.current, { x: -dir * 60, opacity: 0, scale: 0.7, rotate: -dir * 8, duration: 0.25, ease: 'power3.in' }, 0)
    }

    if (bgTextRef.current) {
      tl.to(bgTextRef.current, { x: -dir * 80, opacity: 0, duration: 0.3 }, 0)
    }

    if (detailsCardRef.current) {
      tl.to(detailsCardRef.current, { y: 15, opacity: 0, duration: 0.25 }, 0)
    }
  }, [])

  const goToNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % PRODUCTS.length
    animateToSlide(nextIdx, 1)
  }, [activeIndex, animateToSlide])

  const goToPrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length
    animateToSlide(prevIdx, -1)
  }, [activeIndex, animateToSlide])

  // Automatic Smooth Carousel Scrolling
  useEffect(() => {
    if (!isSearchOpen) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      return
    }

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isTransitioningRef.current && !query) {
        goToNext()
      }
    }, 3000)

    autoPlayTimerRef.current = interval

    return () => clearInterval(interval)
  }, [isSearchOpen, goToNext, query])

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      } else if (isSearchOpen && e.key === 'ArrowRight') {
        goToNext()
      } else if (isSearchOpen && e.key === 'ArrowLeft') {
        goToPrev()
      }
    }

    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen, setIsSearchOpen, goToNext, goToPrev])

  // GSAP Initial Entrance
  useEffect(() => {
    if (!isSearchOpen || !modalRef.current) return

    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 150)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Small, sleek search bar drop-in
      tl.fromTo(
        '.compact-search-box',
        { y: -24, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.6)' },
        0.1
      )

      // Giant background word entrance
      if (bgTextRef.current) {
        tl.fromTo(
          bgTextRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 0.65, duration: 0.8 },
          0.2
        )
      }

      // BIG Center Can zoom in
      if (centerCanRef.current) {
        tl.fromTo(
          centerCanRef.current,
          { y: 60, scale: 0.75, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'back.out(1.6)' },
          0.28
        )
      }

      // Flanking mid-size cans
      tl.fromTo(
        '.flank-can',
        { y: 30, opacity: 0, scale: 0.65 },
        { y: 0, opacity: 0.7, scale: 0.8, stagger: 0.08, duration: 0.7 },
        0.36
      )

      // Bottom details card fade up
      if (detailsCardRef.current) {
        tl.fromTo(
          detailsCardRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          0.42
        )
      }
    }, modalRef)

    return () => ctx.revert()
  }, [isSearchOpen])

  // Handle Search Input: snaps automatically to matching can
  const handleSearchInput = (val) => {
    setQuery(val)
    const trimmed = val.trim().toLowerCase()
    if (!trimmed) return

    const matchIdx = PRODUCTS.findIndex(
      (p) =>
        p.title.toLowerCase().includes(trimmed) ||
        p.word.toLowerCase().includes(trimmed) ||
        p.tags.some((t) => t.includes(trimmed))
    )

    if (matchIdx !== -1 && matchIdx !== activeIndex) {
      animateToSlide(matchIdx, matchIdx > activeIndex ? 1 : -1)
    }
  }

  // Add to Bag with GSAP Tactile Bounce
  const handleOrderNow = (e, product) => {
    e.stopPropagation()
    const btn = e.currentTarget

    gsap.timeline()
      .to(btn, { scale: 0.9, duration: 0.08 })
      .to(btn, { scale: 1.08, duration: 0.16, ease: 'back.out(2.5)' })
      .to(btn, { scale: 1, duration: 0.14 })

    addToCart(product, 'single', 1)
    setAddedItem(product.id)
    setTimeout(() => setAddedItem(null), 1800)
  }

  const activeProduct = PRODUCTS[activeIndex]
  const prevProduct = PRODUCTS[(activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length]
  const nextProduct = PRODUCTS[(activeIndex + 1) % PRODUCTS.length]

  if (!isSearchOpen) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-heading"
       className="fixed inset-0 z-70 flex flex-col justify-between overflow-y-auto landscape-scrollable select-none bg-[#FAF6EE] pt-[calc(var(--sat)+0.4rem)] pb-[calc(var(--sab)+0.75rem)]"
    >
      {/* ========================================================= */}
      {/* 1. CRISP VISIBLE BACKGROUND IMAGE (image copy 19.png) */}
      {/* Background Image / Texture for the search modal */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/search-bg-mobile.png"
          alt=""
          className="w-full h-full object-cover opacity-90 scale-105 sm:hidden"
        />
        <img
          src="/assets/search-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-90 scale-105 hidden sm:block"
        />
        <div className="absolute inset-0 bg-[#FAF6EE]/30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-linear-to-b from-[#FAF6EE] via-transparent to-[#FAF6EE] opacity-60"></div>
      </div>

      {/* ========================================================= */}
      {/* 2. TOP HEADER: Refined Brand Mark + Close Button */}
      {/* ========================================================= */}
      <header className="relative z-30 w-full px-4 sm:px-12 pt-2 sm:pt-4 flex items-center justify-between">
        <div className="w-11" />

        {/* Center: Brand Mark in Refined Font */}
        <div
          onClick={() => setIsSearchOpen(false)}
          className="flex flex-col items-center mx-auto text-center cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-asul text-xl sm:text-3xl text-neutral-900 tracking-wide font-bold">
              zesty
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-emerald-700 shrink-0 self-center -translate-y-0.5"
              fill="none"
            >
              <path
                d="M19.8 4.2C15.4 3.8 10.2 5.8 7.1 8.9C4.3 11.7 3.5 16.6 4.4 19.6C7.4 20.5 12.3 19.7 15.1 16.9C18.2 13.8 20.2 8.6 19.8 4.2Z"
                fill="currentColor"
              />
              <path
                d="M6.5 17.5C9.5 14.5 13.2 12.3 17.5 11.5"
                stroke="#FFFFFF"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right: Minimalist Close Button (44px Touch Target) */}
        <div className="w-11 flex justify-end">
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="w-5 h-5 sm:w-7 sm:h-7 rounded-none bg-white/90 hover:bg-white text-neutral-800 border border-black/10 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. REDUCED COMPACT SLEEK SEARCH BAR (Redesigned & Scaled Down) */}
      {/* ========================================================= */}
      <div className="relative z-30 w-full flex justify-center px-4 my-1.5 sm:my-3">
        <div className="compact-search-box w-full max-w-[240px] sm:max-w-[360px] min-h-[32px] sm:min-h-[38px] bg-white/95 backdrop-blur-xl rounded-none border border-white/90 px-3 py-0 sm:px-4 sm:py-1 flex items-center gap-2 sm:gap-3 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          {/* Subtle Search Icon */}
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-3.5-3.5" />
          </svg>

          {/* Clean Input with Poppins Font */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsSearchOpen(false)
                const el = document.querySelector('#flavors')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            placeholder="Search flavor or fruit..."
            className="w-full h-full pl-1 sm:pl-2 pr-2 py-1.5 sm:py-2 bg-transparent text-xs sm:text-sm text-neutral-800 focus:outline-none placeholder:font-poppins placeholder:text-neutral-400 font-poppins tracking-normal font-normal"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              aria-label="Clear search"
              className="touch-target-44 w-7 h-7 rounded-none bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs cursor-pointer hover:bg-neutral-300 shrink-0"
            >
              &times;
            </button>
          )}

          {/* Minimalist Square-ish Submit Action Button */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false)
              const el = document.querySelector('#flavors')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label="Submit search"
            className="w-5 h-5 sm:w-7 sm:h-7 rounded-none bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer text-white flex items-center justify-center shadow-xs shrink-0"
          >
            <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. CAROUSEL STAGE: BIG CENTER CAN, HALF-SIZE FLANKS */}
      {/* ========================================================= */}
      <div
        onMouseEnter={() => (isHoveredRef.current = true)}
        onMouseLeave={() => (isHoveredRef.current = false)}
        className="relative z-20 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-center my-auto overflow-visible"
      >
        {/* 3-Can Stage: Left Half-Can, Center BIG Can, Right Half-Can */}
        <div className="relative z-10 w-full flex items-center justify-center gap-4 sm:gap-14 lg:gap-20 mb-1 sm:mb-6">
          
          {/* Giant Cutout Typography inside the stage */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span
              ref={bgTextRef}
              className="font-asul text-[18vw] sm:text-[14vw] text-white/80 drop-shadow-[0_2px_20px_rgba(0,0,0,0.04)] leading-none uppercase select-none tracking-tight will-change-transform font-bold"
            >
              {activeProduct.word}
            </span>
          </div>

          {/* Left Companion Can (MID-SIZE, clickable) */}
          <div
            onClick={goToPrev}
            className="flank-can relative z-10 hidden sm:flex flex-col items-center cursor-pointer group transition-all duration-300 opacity-60 hover:opacity-100 pb-3"
          >
            <div className="w-48 sm:w-72 h-64 sm:h-80 flex items-center justify-center">
              <img
                ref={leftCanRef}
                src={prevProduct.image}
                alt=""
                className="h-64 sm:h-72 w-auto object-contain drop-shadow-md -rotate-12 transition-transform group-hover:-translate-x-3"
              />
            </div>
          </div>

          {/* Center BIG Can */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <div className="relative w-full sm:w-[400px] lg:w-[450px] h-[36vh] sm:h-[45vh] lg:h-[480px] max-h-[420px] min-h-[220px] flex items-center justify-center -mt-2 sm:mt-0">
              <img
                ref={centerCanRef}
                src={activeProduct.image}
                alt={activeProduct.title}
                className="h-full max-h-[420px] w-auto object-contain drop-shadow-2xl will-change-transform cursor-pointer hover:scale-102 transition-transform duration-300"
                onClick={() => {
                  setIsSearchOpen(false)
                  const el = document.querySelector('#flavors')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              />
            </div>
          </div>

          {/* Right Companion Can */}
          <div
            onClick={goToNext}
            className="flank-can relative z-10 hidden sm:flex flex-col items-center cursor-pointer group transition-all duration-300 opacity-60 hover:opacity-100 pb-3"
          >
            <div className="w-48 sm:w-72 h-64 sm:h-80 flex items-center justify-center">
              <img
                ref={rightCanRef}
                src={nextProduct.image}
                alt=""
                className="h-64 sm:h-72 w-auto object-contain drop-shadow-md rotate-12 transition-transform group-hover:translate-x-3"
              />
            </div>
          </div>
        </div>

        {/* Details Shelf with font-asul titles & numbers, font-poppins description */}
        <div
          ref={detailsCardRef}
          className="relative z-30 mt-8 sm:-mt-2 w-[94%] sm:w-full max-w-xl mx-auto bg-white/95 border border-neutral-300 rounded-none p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center text-center sm:text-left justify-between gap-3 sm:gap-4"
        >
          {/* Flavor Details */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded-none text-[9.5px] sm:text-[10px] font-poppins font-semibold uppercase tracking-wider bg-black text-white">
                {activeProduct.flavorTag}
              </span>
              <span className="text-[11px] sm:text-xs font-poppins font-semibold tracking-wider text-neutral-600 uppercase">
                EDITION <span className="font-asul font-bold text-xs sm:text-sm text-neutral-900">{activeProduct.editionNum}</span>
              </span>
            </div>

            {/* Product Title in font-asul (slightly reduced size) */}
            <h3 className="font-asul text-lg sm:text-xl md:text-2xl font-bold text-neutral-950 uppercase tracking-tight mt-1 leading-tight">
              {activeProduct.title}
            </h3>
            {/* Description in font-poppins (clean, highly readable) */}
            <p className="text-xs sm:text-[13px] text-neutral-600 font-poppins font-normal max-w-sm mt-1 leading-relaxed">
              {activeProduct.subtitle}
            </p>
          </div>

          {/* SQUARE ORDERING BUTTON */}
          <div className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={(e) => handleOrderNow(e, activeProduct)}
              className="touch-target-44 w-full sm:w-auto min-h-[46px] justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-none bg-black hover:bg-neutral-800 text-white text-xs font-poppins font-semibold tracking-[0.14em] uppercase shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              {addedItem === activeProduct.id ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <span>Order Now</span>
                  <span className="text-neutral-400 font-poppins">/</span>
                  <span className="font-asul font-bold text-sm sm:text-base tracking-wide">{activeProduct.price}</span>
                  <span className="font-poppins">&rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
