import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Menu, X } from 'lucide-react'

const NAV_ITEMS = ['About Us', 'Programs', 'Reviews', 'FAQ', 'Contacts']

export default function TinyTrails404({ onBackHome }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scaleY, setScaleY] = useState(1)
  const textRef = useRef(null)

  // Measure text element's offsetHeight and calculate scaleY
  useEffect(() => {
    const updateScale = () => {
      if (textRef.current && textRef.current.offsetHeight > 0) {
        const measuredHeight = textRef.current.offsetHeight
        const computedScale = window.innerHeight / measuredHeight
        setScaleY(computedScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleBackToHome = (e) => {
    e.preventDefault()
    setIsMenuOpen(false)
    if (onBackHome) {
      onBackHome()
    } else {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col font-poppins"
      style={{
        background: 'linear-gradient(to bottom, #FF8233, #FDAC55)',
      }}
    >
      {/* BACKGROUND "404" TEXT EFFECT + OVAL */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
        style={{
          opacity: 0.8,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Centered 404 Text */}
          <span
            ref={textRef}
            className="text-white font-black leading-none tracking-tighter whitespace-nowrap inline-block will-change-transform"
            style={{
              fontSize: 'clamp(200px, 48vw, 800px)',
              transform: `scale(1.15, ${scaleY * 1.4})`,
              transformOrigin: 'center',
            }}
          >
            404
          </span>

          {/* Overlaid White Oval */}
          <div
            className="absolute rounded-full bg-white will-change-transform h-[22vh] sm:h-[26vh] md:h-[50vh]"
            style={{
              width: 'clamp(120px, 20vw, 400px)',
              transform: `scaleY(${scaleY})`,
              transformOrigin: 'center',
            }}
          />
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <header className="relative z-20 flex flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5">
        {/* Logo (left): 2x2 grid of white circles + "TinyTrails" */}
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
          </div>
          <span className="text-white font-bold text-lg sm:text-xl ml-1 tracking-tight">
            TinyTrails
          </span>
        </div>

        {/* Desktop nav links (center/right) */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-white hover:opacity-90 transition-colors"
              style={{ color: '#F16524' }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Menu button (right) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-white inline-flex items-center gap-2 hover:opacity-90 transition-colors cursor-pointer"
          style={{ backgroundColor: '#F16524' }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Menu</span>
        </button>
      </header>

      {/* CENTER VIDEO */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ marginTop: 'calc(-6vh - 40px)' }}
      >
        <div className="w-[120vw] h-[85vh] sm:w-[70vw] sm:h-[70vh] md:w-[62vw] md:h-[78vh] flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain pointer-events-none mix-blend-darken"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_234424_b1332b69-2e69-4302-8dbc-40f86846afbd.mp4"
          />
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <footer className="relative z-30 mt-auto pb-8 sm:pb-16 flex flex-col items-center text-center px-4">
        <h2 className="text-white text-lg sm:text-xl md:text-2xl font-medium mb-3 sm:mb-4 drop-shadow-sm">
          Oops, something went wrong!
        </h2>
        <a
          href="/"
          onClick={handleBackToHome}
          className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
          style={{ backgroundColor: '#F16524' }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Home</span>
        </a>
      </footer>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Slide-in Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full sm:w-[380px] p-6 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: 'linear-gradient(135deg, #FF6B1A 0%, #FF9642 100%)',
          }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                TinyTrails
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Staggered Menu Items */}
          <div className="flex flex-col gap-3 my-auto py-6">
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-4 text-lg font-semibold text-white rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300"
                style={{
                  transitionDelay: isMenuOpen ? `${150 + i * 60}ms` : '0ms',
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(16px)',
                  opacity: isMenuOpen ? 1 : 0,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="w-full pt-4 transition-all duration-300"
            style={{
              transitionDelay: isMenuOpen ? '450ms' : '0ms',
              opacity: isMenuOpen ? 1 : 0,
            }}
          >
            <a
              href="/"
              onClick={handleBackToHome}
              className="w-full py-4 rounded-full bg-white font-semibold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md cursor-pointer"
              style={{ color: '#F16524' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
