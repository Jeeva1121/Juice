import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { usePageTransition } from '../context/PageTransitionContext'

export default function ModernPageTransition() {
  const { setTransitionTrigger } = usePageTransition()
  const overlayRef = useRef(null)
  const pathFrontRef = useRef(null)
  const pathBackRef = useRef(null)
  const brandRef = useRef(null)
  const isAnimatingRef = useRef(false)

  // Fluid SVG curve coordinates (viewBox="0 0 100 100" preserveAspectRatio="none")
  // 1. Initial: completely below screen
  const PATH_INITIAL = 'M 0 100 V 100 Q 50 100 100 100 V 100 Z'
  // 2. Rising: organic liquid wave dome arching up
  const PATH_RISING_MID = 'M 0 100 V 30 Q 50 -25 100 30 V 100 Z'
  // 3. Flat: completely covers full viewport
  const PATH_FLAT_COVER = 'M 0 100 V 0 Q 50 0 100 0 V 100 Z'
  // 4. Leaving: bottom edge arches upward
  const PATH_LEAVING_MID = 'M 0 0 V 0 Q 50 125 100 0 V 0 Z'
  // 5. Cleared: completely above screen
  const PATH_CLEARED = 'M 0 0 V 0 Q 50 0 100 0 V 0 Z'

  const executeTransition = useCallback((callback) => {
    return new Promise((resolve) => {
      if (isAnimatingRef.current) {
        if (typeof callback === 'function') callback()
        resolve()
        return
      }

      // Check prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        if (typeof callback === 'function') callback()
        resolve()
        return
      }

      isAnimatingRef.current = true
      const mainContent = document.getElementById('main-content') || document.body

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' })
          isAnimatingRef.current = false
          resolve()
        },
      })

      // Reset paths & activate overlay
      tl.set(overlayRef.current, { autoAlpha: 1, pointerEvents: 'auto' })
      tl.set(pathBackRef.current, { attr: { d: PATH_INITIAL } })
      tl.set(pathFrontRef.current, { attr: { d: PATH_INITIAL } })
      tl.set(brandRef.current, { opacity: 0, y: 15, scale: 0.96 })

      // Subtle editorial scale-down & blur on active page content
      tl.to(
        mainContent,
        {
          scale: 0.985,
          filter: 'blur(3px)',
          duration: 0.35,
          ease: 'power2.inOut',
        },
        0
      )

      // 1. First accent wave (Citrus Sun Amber) sweeps up
      tl.to(
        pathBackRef.current,
        {
          attr: { d: PATH_RISING_MID },
          duration: 0.32,
          ease: 'power3.in',
        },
        0
      )
      tl.to(
        pathBackRef.current,
        {
          attr: { d: PATH_FLAT_COVER },
          duration: 0.22,
          ease: 'power2.out',
        },
        0.32
      )

      // 2. Primary Luxury Espresso Wave sweeps closely behind
      tl.to(
        pathFrontRef.current,
        {
          attr: { d: PATH_RISING_MID },
          duration: 0.34,
          ease: 'power3.in',
        },
        0.06
      )
      tl.to(
        pathFrontRef.current,
        {
          attr: { d: PATH_FLAT_COVER },
          duration: 0.24,
          ease: 'power2.out',
        },
        0.4
      )

      // 3. Peak moment: Reveal minimalist glowing brand mark & fire callback
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.18,
          ease: 'power2.out',
        },
        0.44
      )

      tl.call(() => {
        if (typeof callback === 'function') {
          callback()
        }
      }, null, 0.48)

      // 4. Brand mark gently fades out
      tl.to(
        brandRef.current,
        {
          opacity: 0,
          y: -12,
          duration: 0.16,
          ease: 'power2.in',
        },
        0.58
      )

      // 5. Waves scoop upward into the sky
      tl.to(
        pathFrontRef.current,
        {
          attr: { d: PATH_LEAVING_MID },
          duration: 0.24,
          ease: 'power2.in',
        },
        0.62
      )
      tl.to(
        pathFrontRef.current,
        {
          attr: { d: PATH_CLEARED },
          duration: 0.26,
          ease: 'power3.out',
        },
        0.86
      )

      tl.to(
        pathBackRef.current,
        {
          attr: { d: PATH_LEAVING_MID },
          duration: 0.24,
          ease: 'power2.in',
        },
        0.68
      )
      tl.to(
        pathBackRef.current,
        {
          attr: { d: PATH_CLEARED },
          duration: 0.26,
          ease: 'power3.out',
        },
        0.92
      )

      // Settle new page content with a fresh, crisp entrance
      tl.fromTo(
        mainContent,
        { scale: 0.985, filter: 'blur(3px)' },
        {
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: 'power3.out',
        },
        0.7
      )
    })
  }, [])

  // Register transition execution handler in context
  useEffect(() => {
    if (setTransitionTrigger) {
      setTransitionTrigger(() => executeTransition)
    }
  }, [setTransitionTrigger, executeTransition])

  // Global window testing hook
  useEffect(() => {
    window.triggerWaveTransition = (cb) => executeTransition(cb)
    return () => {
      delete window.triggerWaveTransition
    }
  }, [executeTransition])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999999] pointer-events-none w-screen h-screen overflow-hidden select-none"
      style={{ visibility: 'hidden', opacity: 0 }}
      aria-hidden="true"
    >
      {/* Dynamic Layer 1: Warm Citrus Accent Wave */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathBackRef}
          d={PATH_INITIAL}
          fill="var(--color-sun-amber, #F5A623)"
        />
      </svg>

      {/* Dynamic Layer 2: Artisanal Dark Espresso Silk Wave */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathFrontRef}
          d={PATH_INITIAL}
          fill="var(--color-surface-dark, #1A1816)"
        />
      </svg>

      {/* Center Minimalist Brand Insignia (Appears at peak liquid crest) */}
      <div
        ref={brandRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-6"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="w-6 h-[1.5px] bg-(--color-sun-amber) opacity-80" />
          <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-(--color-sun-amber)">
            Cold Pressed
          </span>
          <span className="w-6 h-[1.5px] bg-(--color-sun-amber) opacity-80" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.18em] text-[#FAF5EA] font-poppins uppercase drop-shadow-sm">
          Zesty
        </h2>
        <p className="mt-2 text-xs tracking-[0.25em] uppercase text-[#FAF5EA]/60 font-medium">
          Organic Botanical Juices
        </p>
      </div>
    </div>
  )
}
