import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { CartProvider } from './context/CartContext'
import { PageTransitionProvider } from './context/PageTransitionContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import SearchModal from './components/SearchModal'
import AccountModal from './components/AccountModal'
import ScrollProgress from './components/ScrollProgress'
import TinyTrails404 from './components/TinyTrails404'
import ModernPageTransition from './components/ModernPageTransition'
import Hero from './sections/Hero'
import Gallery from './sections/Gallery'
import BrandManifesto from './sections/BrandManifesto'
import About from './sections/About'
import Footer from './sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef(null)
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768

    // Initialize Lenis smooth scrolling (only on non-touch desktop to preserve native silky 120fps touch scrolling on mobile)
    let lenis = null
    let tickerCallback = null

    if (!prefersReducedMotion && !isTouchDevice) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
        smoothWheel: true,
        wheelMultiplier: 1.0,
        prevent: (node) => {
          if (typeof document !== 'undefined') {
            if (
              document.body.classList.contains('checkout-active') ||
              document.body.classList.contains('modal-open')
            ) {
              return true
            }
          }
          const el = node && node.nodeType === 1 ? node : node?.parentElement
          return !!el?.closest?.('[data-lenis-prevent], .lenis-prevent, #checkout-root, #order-confirmed-root')
        },
      })

      lenisRef.current = lenis
      window.lenis = lenis

      // Synchronize Lenis scroll positions with ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      // Bind Lenis animation frame to GSAP ticker
      tickerCallback = (time) => {
        lenis.raf(time * 1000)
      }
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(500, 33)
    }

    // Window resize refresh
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    // Also refresh once fonts and images load
    window.addEventListener('load', handleResize)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleResize)

      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback)
      }
      if (lenis) {
        lenis.destroy()
        window.lenis = null
      }
      // Kill all ScrollTriggers cleanly on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleScrollTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isNotFound = currentPath !== '/' && currentPath !== '' && !currentPath.startsWith('/#')

  if (isNotFound) {
    return (
      <TinyTrails404
        onBackHome={() => {
          window.history.pushState({}, '', '/')
          setCurrentPath('/')
        }}
      />
    )
  }

  return (
    <PageTransitionProvider>
      <ModernPageTransition />
      <CartProvider>
        <div className="relative min-h-screen bg-(--color-surface) text-(--color-ink) selection:bg-(--color-coral) selection:text-white font-poppins">
          {/* Global Scroll Progress Bar */}
          <ScrollProgress />

          {/* Editorial Minimalist Navbar */}
          <Navbar />

          {/* Global Slide-over Cart Drawer & Checkout */}
          <CartDrawer />

          {/* Global Ultra-Modern Spotlight Search Modal */}
          <SearchModal />

          {/* Global Account Modal */}
          <AccountModal />

          {/* Main Full-Page Scroll Sequence */}
          <main id="main-content" className="relative w-full">
            {/* Section 1: Hero */}
            <Hero />

            {/* Section 2: Gallery (Interactive 3D Flavors with GSAP) */}
            <Gallery />

            {/* Section 2.5: Interactive Pixel Trail Brand Manifesto */}
            <BrandManifesto />

            {/* Section 3: About (Heritage & Timeline) */}
            <About />
          </main>

          {/* Section 4: Footer */}
          <Footer onScrollTop={handleScrollTop} />
        </div>
      </CartProvider>
    </PageTransitionProvider>
  )
}
