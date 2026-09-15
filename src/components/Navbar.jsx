import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen, setIsSearchOpen, setIsAccountOpen } = useCart()
  
  const navRef = useRef(null)
  const linksRef = useRef([])
  const logoRef = useRef(null)
  const rightIconsRef = useRef(null)
  
  // Hover effect refs
  const searchIconRef = useRef(null)
  const accountIconRef = useRef(null)
  const cartIconRef = useRef(null)

  // Watch scroll for background blur/pill
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll if mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault()
    closeMobileMenu()
    const target = document.querySelector(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // --- GSAP Animations ---
  
  // 1. Initial Load Drop-in
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } })
    
    // Animate Navbar down
    tl.fromTo(navRef.current, { yPercent: -150 }, { yPercent: 0 }, 0.2)
    
    // Stagger links and logo
    tl.fromTo(
      linksRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1 },
      0.6
    )
    tl.fromTo(
      logoRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1 },
      0.8
    )
    tl.fromTo(
      rightIconsRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1 },
      0.9
    )
  }, { scope: navRef })

  // 2. Mobile Menu Reveal (using CSS instead of GSAP to ensure reliability)
  // Removed GSAP logic for mobile menu to prevent sticking state


  // Removed GSAP trigger since we use CSS


  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // 3. Elastic Magnetic Hover for links and icons
  const applyMagnetic = (el) => {
    if (!el) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'elastic.out(1, 0.4)' })
    
    const mouseMove = (e) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = el.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      xTo(x * 0.28)
      yTo(y * 0.28)
    }
    const mouseLeave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', mouseMove)
    el.addEventListener('mouseleave', mouseLeave)
    return () => {
      el.removeEventListener('mousemove', mouseMove)
      el.removeEventListener('mouseleave', mouseLeave)
    }
  }

  useEffect(() => {
    const cleanups = []
    if (searchIconRef.current) cleanups.push(applyMagnetic(searchIconRef.current))
    if (accountIconRef.current) cleanups.push(applyMagnetic(accountIconRef.current))
    if (cartIconRef.current) cleanups.push(applyMagnetic(cartIconRef.current))
    linksRef.current.forEach((el) => {
      if (el) cleanups.push(applyMagnetic(el))
    })
    return () => cleanups.forEach(c => c && c())
  }, [])

  // 4. Cart Pop on item count update
  useEffect(() => {
    if (totalItems > 0 && cartIconRef.current) {
      gsap.fromTo(
        cartIconRef.current,
        { scale: 0.75, rotate: -15 },
        { scale: 1, rotate: 0, duration: 0.7, ease: 'elastic.out(1.4, 0.3)' }
      )
    }
  }, [totalItems])

  // GSAP Hover Handlers for Links
  const onLinkEnter = (index) => {
    const el = linksRef.current[index]
    if (!el) return
    gsap.to(el, { letterSpacing: '0.28em', duration: 0.3, ease: 'power2.out' })
    const line = el.querySelector('.nav-line')
    if (line) gsap.to(line, { width: '100%', duration: 0.3, ease: 'power2.out' })
  }

  const onLinkLeave = (index) => {
    const el = linksRef.current[index]
    if (!el) return
    gsap.to(el, { letterSpacing: '0.2em', duration: 0.35, ease: 'power2.out' })
    const line = el.querySelector('.nav-line')
    if (line) gsap.to(line, { width: '0%', duration: 0.25, ease: 'power2.in' })
  }

  // GSAP Hover Handlers for Icons
  const onSearchEnter = () => {
    const svg = searchIconRef.current?.querySelector('svg')
    if (svg) gsap.to(svg, { rotate: 20, scale: 1.18, duration: 0.3, ease: 'back.out(2.2)' })
  }
  const onSearchLeave = () => {
    const svg = searchIconRef.current?.querySelector('svg')
    if (svg) gsap.to(svg, { rotate: 0, scale: 1, duration: 0.35, ease: 'power2.out' })
  }

  const onAccountEnter = () => {
    const svg = accountIconRef.current?.querySelector('svg')
    if (svg) gsap.to(svg, { y: -2.5, scale: 1.15, duration: 0.3, ease: 'back.out(2)' })
  }
  const onAccountLeave = () => {
    const svg = accountIconRef.current?.querySelector('svg')
    if (svg) gsap.to(svg, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out' })
  }

  const onBagEnter = () => {
    const svg = cartIconRef.current?.querySelector('svg')
    if (svg) {
      gsap.timeline()
        .to(svg, { rotate: -12, scale: 1.15, duration: 0.12, ease: 'power1.out' })
        .to(svg, { rotate: 10, duration: 0.15, ease: 'power1.inOut' })
        .to(svg, { rotate: 0, duration: 0.2, ease: 'power2.out' })
    }
  }
  const onBagLeave = () => {
    const svg = cartIconRef.current?.querySelector('svg')
    if (svg) gsap.to(svg, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  // Button click compress animation
  const onBtnClick = (ref, callback) => {
    const el = ref.current
    if (el) {
      gsap.timeline()
        .to(el, { scale: 0.86, duration: 0.08, ease: 'power2.in' })
        .to(el, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
    }
    callback()
  }

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out landscape-compact-nav ${
          isScrolled 
            ? 'pt-[calc(var(--sat)+0.4rem)] px-3 sm:px-6' 
            : 'pt-[calc(var(--sat)+0.75rem)] px-3 sm:px-12'
        }`}
      >
      {/* Floating Pill Container */}
      <div 
        className={`mx-auto w-full max-w-7xl flex items-center justify-between transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#FAF5EA]/85 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-3.5 sm:px-7 py-1.5 sm:py-2.5' 
            : 'bg-transparent border-transparent shadow-none px-0 py-0'
        }`}
      >
        {/* Left Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-[11px] font-normal tracking-[0.22em] uppercase text-neutral-800 w-1/3"
        >
          {['#flavors', '#about'].map((link, i) => (
            <a
              key={link}
              ref={el => linksRef.current[i] = el}
              href={link}
              onClick={(e) => scrollToSection(e, link)}
              onMouseEnter={() => onLinkEnter(i)}
              onMouseLeave={() => onLinkLeave(i)}
              className="relative py-1 hover:text-(--color-coral) transition-colors duration-300 inline-block cursor-pointer"
            >
              <span>{link === '#flavors' ? 'Our Menu' : 'Our Story'}</span>
              <span className="nav-line absolute bottom-0 left-0 w-0 h-[2px] bg-(--color-coral) rounded-full pointer-events-none" />
            </a>
          ))}
        </nav>

        {/* Center Logo */}
        <div className="flex-1 md:flex-none flex justify-start md:justify-center md:w-1/3 min-w-0 pr-1">
          <a
            ref={logoRef}
            href="#"
            onClick={(e) => scrollToSection(e, '#root')}
            className="flex flex-col items-start lg:items-center justify-center hover:opacity-80 transition-opacity cursor-pointer group py-1"
            aria-label="Zesty Clean Juice Homepage"
          >
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-asal text-2xl sm:text-3xl lg:text-4xl text-neutral-900 tracking-wide font-normal">
                zesty
              </span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-800 -rotate-12 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17 3c-5.523 0-10 4.477-10 10 0 1.25.23 2.45.65 3.55C4.24 18.25 2 21 2 21s6.25-1.25 10.45-3.65c1.1.42 2.3.65 3.55.65 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
              </svg>
            </div>
          </a>
        </div>

        {/* Right Actions: Minimalist Luxury Editorial Icons with 44px Touch Targets */}
        <div ref={rightIconsRef} className="flex items-center justify-end gap-0.5 sm:gap-2 shrink-0 md:w-1/3 text-(--color-ink)">
          {/* 1. Quick Search */}
          <button
            ref={searchIconRef}
            type="button"
            onClick={() => onBtnClick(searchIconRef, () => setIsSearchOpen(true))}
            onMouseEnter={onSearchEnter}
            onMouseLeave={onSearchLeave}
            aria-label="Search Flavors & Story"
            className="touch-target-44 w-11 h-11 rounded-full flex items-center justify-center hover:bg-black/5 hover:text-(--color-coral) transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* 2. Account */}
          <button
            ref={accountIconRef}
            type="button"
            onClick={() => onBtnClick(accountIconRef, () => setIsAccountOpen(true))}
            onMouseEnter={onAccountEnter}
            onMouseLeave={onAccountLeave}
            aria-label="Clean Club VIP Account"
            className="touch-target-44 w-11 h-11 rounded-full flex items-center justify-center hover:bg-black/5 hover:text-(--color-coral) transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7 0 3.75 3.75 0 017 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>

          {/* 3. Cart / Bag */}
          <button
            ref={cartIconRef}
            type="button"
            onClick={() => onBtnClick(cartIconRef, () => setIsCartOpen(true))}
            onMouseEnter={onBagEnter}
            onMouseLeave={onBagLeave}
            aria-label={`View Bag (${totalItems} items)`}
            className="touch-target-44 relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-black/5 hover:text-(--color-coral) transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-(--color-coral) text-white text-[9px] font-semibold rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="touch-target-44 md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[4.5px] p-2 text-(--color-ink) z-50 cursor-pointer rounded-full hover:bg-black/5 transition-colors"
          >
            <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMobileMenuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
            <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMobileMenuOpen ? 'translate-y-[-6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      </header>

      {/* Full Screen Mobile Overlay Menu (Safe-Area & Scroll-Safe) */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAF5EA] flex flex-col justify-between items-center px-6 sm:px-10 pt-[calc(var(--sat)+5rem)] pb-[calc(var(--sab)+2rem)] overflow-y-auto landscape-scrollable md:hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className={`w-full max-w-sm my-auto flex flex-col transition-all duration-500 delay-100 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          {/* Clean Editorial Navigation List with Reduced Font Weight */}
          <ul className="w-full border-t border-black/10">
            {[
              { num: '01', label: 'Our Menu', href: '#flavors' },
              { num: '02', label: 'Our Story', href: '#about' },
              { num: '03', label: 'The Artisans', href: '#about' },
              { num: '04', label: 'Contact & Press', href: '#footer' },
            ].map((item) => (
              <li key={item.label} className="w-full border-b border-black/10">
                <a
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="group flex items-center justify-between py-4 sm:py-5 text-neutral-800 hover:text-(--color-coral) transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono font-light text-neutral-400 group-hover:text-(--color-coral) transition-colors">
                      {item.num}
                    </span>
                    <span className="text-base sm:text-lg font-light uppercase tracking-[0.2em] group-hover:tracking-[0.24em] transition-all duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-light text-neutral-400 group-hover:text-(--color-coral) group-hover:translate-x-1 transition-all duration-300">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
