import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const HERO_SLIDES = [
  {
    id: 'orange',
    name: 'Orange',
    wordmark: 'ORANGE',
    wordSize: 'text-[clamp(2.5rem,8.8vw,7.5rem)]',
    counter: '2',
    bgColor: '#FAF5EA',
    bottleImage: '/assets/orange-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed orange juice can with fresh orange slices and pure water splash',
    manifestoTitle: 'Your healthy life starts here with us',
    manifestoHighlight: 'healthy life',
    highlightColor: '#3A7D44',
    manifestoBody: 'A family owned company founded to give your family access to clean, organic cold-pressed products on the go.',
    ctaText: 'show all the juices',
    bottleContainerClass: 'max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg h-[34vh] sm:h-[48vh] md:h-[60vh] max-h-[460px] translate-y-1 sm:translate-y-0',
    bottleImgClass: 'scale-[0.88] sm:scale-[0.84] md:scale-[0.88] lg:scale-[0.92]',
    buttonWrapperClass: '',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    wordmark: 'STRAWBERRY',
    wordSize: 'text-[clamp(2.1rem,7.5vw,6.5rem)]',
    counter: '1',
    bgColor: '#FAF0EE',
    bottleImage: '/assets/straw-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed strawberry juice can with ruby splash and fresh strawberries',
    manifestoTitle: 'Wild field strawberries picked at dawn',
    manifestoHighlight: 'picked at dawn',
    highlightColor: '#D90429',
    manifestoBody: 'Slow cold-pressed ruby strawberries blended with organic coconut water and key lime essence for cellular restoration.',
    ctaText: 'explore strawberry',
    bottleContainerClass: 'max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg h-[34vh] sm:h-[48vh] md:h-[60vh] max-h-[460px] translate-y-1 sm:translate-y-0',
    bottleImgClass: 'scale-[0.86] sm:scale-[0.82] md:scale-[0.86] lg:scale-[0.90]',
    buttonWrapperClass: '',
  },
  {
    id: 'cherry',
    name: 'Black Cherry',
    wordmark: 'CHERRY',
    wordSize: 'text-[clamp(2.5rem,8.8vw,7.5rem)]',
    counter: '3',
    bgColor: '#F8EDF1',
    bottleImage: '/assets/cherry-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed cherry juice can with splash and fresh cherries',
    manifestoTitle: 'Dark orchard cherries picked at peak ripeness',
    manifestoHighlight: 'peak ripeness',
    highlightColor: '#9B111E',
    manifestoBody: 'Slow cold-extracted Montmorency cherries packed with natural anthocyanins and melatonin for deep cellular recovery.',
    ctaText: 'discover black cherry',
    bottleContainerClass: 'max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg h-[34vh] sm:h-[48vh] md:h-[60vh] max-h-[460px] translate-y-1 sm:translate-y-0',
    bottleImgClass: 'scale-[0.86] sm:scale-[0.82] md:scale-[0.86] lg:scale-[0.90]',
    buttonWrapperClass: '',
  },
  {
    id: 'lemon',
    name: 'Lemon',
    wordmark: 'LEMON',
    wordSize: 'text-[clamp(2.5rem,8.8vw,7.5rem)]',
    counter: '4',
    bgColor: '#F4FAEA',
    bottleImage: '/assets/lemon-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed lemon juice can with fresh lemon slices and pure water splash',
    manifestoTitle: 'Brighten your day with citrus vitality',
    manifestoHighlight: 'citrus vitality',
    highlightColor: '#65a30d',
    manifestoBody: 'Sun-ripened organic lemons cold-extracted to deliver an invigorating burst of natural vitamin C and pure hydration.',
    ctaText: 'explore lemon',
    bottleContainerClass: 'max-w-[240px] sm:max-w-sm md:max-w-lg lg:max-w-lg h-[34vh] sm:h-[48vh] md:h-[60vh] max-h-[460px] translate-y-1 sm:translate-y-0',
    bottleImgClass: 'scale-[0.86] sm:scale-[0.82] md:scale-[0.86] lg:scale-[0.90]',
    buttonWrapperClass: '',
  },
]

export default function Hero() {
  const containerRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Animated DOM refs
  const bottleRef = useRef(null)
  const giantTextRef = useRef(null)
  const counterRef = useRef(null)
  const manifestoRef = useRef(null)
  const bottomLeftBtnRef = useRef(null)

  // Theme Background Layer Refs (Orange, Strawberry Red, Cherry, Lemon)
  const bgOrangeRef = useRef(null)
  const bgStrawRef = useRef(null)
  const bgCherryRef = useRef(null)
  const bgLemonRef = useRef(null)

  // 5 Floating Juicy Orange Pieces refs
  const orangeLayerRef = useRef(null)
  const piece1Ref = useRef(null) // Top Left slice with droplets
  const piece2Ref = useRef(null) // Bottom Left wedge with droplets
  const piece3Ref = useRef(null) // Top Right half orange with dripping juice
  const piece5Ref = useRef(null) // Bottom Right large slice with droplets

  // 5 Floating Juicy Strawberry Pieces refs
  const strawLayerRef = useRef(null)
  const strawPiece1Ref = useRef(null) // Top Left strawberry with splash & droplets
  const strawPiece2Ref = useRef(null) // Bottom Left slice wave & droplets
  const strawPiece3Ref = useRef(null) // Top Right half slice explosion & droplets
  const strawPiece4Ref = useRef(null) // Mid Right strawberry & droplets
  const strawPiece5Ref = useRef(null) // Bottom Right strawberry with splash & dewy leaf

  // 5 Floating Juicy Cherry Pieces refs
  const cherryLayerRef = useRef(null)
  const cherryPiece1Ref = useRef(null) // Top Left cherry with stem & droplets
  const cherryPiece2Ref = useRef(null) // Bottom Left cherries in splash wave
  const cherryPiece3Ref = useRef(null) // Top Right cherry with splash explosion
  const cherryPiece4Ref = useRef(null) // Mid Right halved cherry & droplets
  const cherryPiece5Ref = useRef(null) // Bottom Right halved cherry with pit & leaf

  // 5 Floating Juicy Lemon Pieces refs
  const lemonLayerRef = useRef(null)
  const lemonPiece1Ref = useRef(null)
  const lemonPiece2Ref = useRef(null)
  const lemonPiece3Ref = useRef(null)
  const lemonPiece5Ref = useRef(null)

  const isAnimatingRef = useRef(false)
  const currentSlideRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    // Add the hardware-accelerated CSS classes to all pieces exactly once.
    // This offloads the massive animation overhead from GSAP to the browser's CSS engine.
    const pieceMappings = [
      { ref: piece1Ref, class: 'fruit-piece-1' },
      { ref: piece2Ref, class: 'fruit-piece-2' },
      { ref: piece3Ref, class: 'fruit-piece-3' },
      { ref: piece5Ref, class: 'fruit-piece-5' },
      
      { ref: strawPiece1Ref, class: 'fruit-piece-1' },
      { ref: strawPiece2Ref, class: 'fruit-piece-2' },
      { ref: strawPiece3Ref, class: 'fruit-piece-3' },
      { ref: strawPiece4Ref, class: 'fruit-piece-4' },
      { ref: strawPiece5Ref, class: 'fruit-piece-5' },
      
      { ref: cherryPiece1Ref, class: 'fruit-piece-1' },
      { ref: cherryPiece2Ref, class: 'fruit-piece-2' },
      { ref: cherryPiece3Ref, class: 'fruit-piece-3' },
      { ref: cherryPiece4Ref, class: 'fruit-piece-4' },
      { ref: cherryPiece5Ref, class: 'fruit-piece-5' },
      
      { ref: lemonPiece1Ref, class: 'fruit-piece-1' },
      { ref: lemonPiece2Ref, class: 'fruit-piece-2' },
      { ref: lemonPiece3Ref, class: 'fruit-piece-3' },
      { ref: lemonPiece5Ref, class: 'fruit-piece-5' }
    ]

    pieceMappings.forEach(mapping => {
      if (mapping.ref.current) {
        mapping.ref.current.classList.add('hero-fruit-piece', mapping.class)
      }
    })
  }, [])

  useEffect(() => {
    currentSlideRef.current = currentIndex
  }, [currentIndex])

  // GSAP Transition between slides
  const goToSlide = useCallback((nextIndex) => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    const prevIndex = currentSlideRef.current
    const nextSlide = HERO_SLIDES[nextIndex]
    if (!nextSlide) {
      isAnimatingRef.current = false
      return
    }

    const layers = [orangeLayerRef.current, strawLayerRef.current, cherryLayerRef.current, lemonLayerRef.current]
    const bgLayers = [bgOrangeRef.current, bgStrawRef.current, bgCherryRef.current, bgLemonRef.current]

    // GSAP Exit Timeline
    const exitTl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        setCurrentIndex(nextIndex)
        currentSlideRef.current = nextIndex

        // GSAP Entry Timeline
        const enterTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            isAnimatingRef.current = false
          },
        })

        // Toggle background layers smoothly
        bgLayers.forEach((bg, idx) => {
          if (!bg) return
          if (idx === nextIndex) {
            gsap.set(bg, { opacity: 1 })
            enterTl.to(bg, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0)
          } else {
            gsap.set(bg, { opacity: 0 })
          }
        })

        // Toggle fruit pieces layer visibility smoothly
        layers.forEach((layer, idx) => {
          if (!layer) return
          if (idx === nextIndex) {
            gsap.set(layer, { display: 'block', autoAlpha: 1 })
            enterTl.to(layer, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0)
          } else {
            gsap.set(layer, { display: 'none', autoAlpha: 0 })
          }
        })

        enterTl
          .fromTo(bottleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
          .fromTo(giantTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4')
          .fromTo(counterRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '-=0.3')
          .fromTo(manifestoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 }, '-=0.3')
      },
    })

    // Exit currently active fruit pieces and background layer
    const currentActiveLayer = layers[prevIndex]
    if (currentActiveLayer) {
      exitTl.to(currentActiveLayer, { autoAlpha: 0, duration: 0.3 }, 0)
      exitTl.set(currentActiveLayer, { display: 'none' }, '>')
    }

    const currentActiveBg = bgLayers[prevIndex]
    if (currentActiveBg) {
      exitTl.to(currentActiveBg, { opacity: 0, duration: 0.3 }, 0)
    }

    exitTl
      .to(bottleRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
      .to(giantTextRef.current, { opacity: 0, duration: 0.2 }, 0)
      .to(manifestoRef.current, { opacity: 0, duration: 0.2 }, 0)
      .to(counterRef.current, { opacity: 0, duration: 0.2 }, 0)
  }, [])

  // Auto-advance every 4.5 seconds when user is at top of page
  const startAutoTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!isAnimatingRef.current && window.scrollY < 80) {
        const nextIdx = (currentSlideRef.current + 1) % HERO_SLIDES.length
        goToSlide(nextIdx)
      }
    }, 4500)
  }, [goToSlide])

  useEffect(() => {
    startAutoTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startAutoTimer])

  // Trackpad / touch gesture listener - strictly horizontal swipes only, never interferes with vertical scrolling
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let lastWheelTime = 0

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX
      const diffY = e.changedTouches[0].clientY - touchStartY
      // Must be a deliberate horizontal swipe (diffX > 55 and at least 2.5x greater than vertical diffY)
      // Never triggers during normal vertical scrolling
      if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 2.5 && window.scrollY < 20) {
        if (diffX < 0) {
          goToSlide((currentSlideRef.current + 1) % HERO_SLIDES.length)
        } else {
          goToSlide((currentSlideRef.current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
        }
        startAutoTimer()
      }
    }

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > 45 && Math.abs(e.deltaX) > Math.abs(e.deltaY) && window.scrollY < 80) {
        const now = Date.now()
        if (now - lastWheelTime > 650) {
          lastWheelTime = now
          if (e.deltaX > 0) {
            goToSlide((currentSlideRef.current + 1) % HERO_SLIDES.length)
          } else {
            goToSlide((currentSlideRef.current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          startAutoTimer()
        }
      }
    }

    const el = containerRef.current
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: true })
      el.addEventListener('touchend', handleTouchEnd, { passive: true })
      el.addEventListener('wheel', handleWheel, { passive: true })
    }
    return () => {
      if (el) {
        el.removeEventListener('touchstart', handleTouchStart)
        el.removeEventListener('touchend', handleTouchEnd)
        el.removeEventListener('wheel', handleWheel)
      }
    }
  }, [goToSlide, startAutoTimer])

  // Responsive GSAP MatchMedia
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      // Set initial states
      gsap.set(bgOrangeRef.current, { opacity: 1 })
      gsap.set(bgStrawRef.current, { opacity: 0 })
      gsap.set(bgCherryRef.current, { opacity: 0 })
      gsap.set(bgLemonRef.current, { opacity: 0 })

      gsap.set(orangeLayerRef.current, { opacity: 1 })
      gsap.set(strawLayerRef.current, { opacity: 0 })
      gsap.set(cherryLayerRef.current, { opacity: 0 })
      gsap.set(lemonLayerRef.current, { opacity: 0 })

      // Page Load Intro: Smooth clean fade in without jumping
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      introTl
        .fromTo(bottleRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 })
        .fromTo(giantTextRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.6')
        .fromTo(
          [piece1Ref.current, piece2Ref.current, piece3Ref.current, piece5Ref.current],
          { opacity: 0 },
          { opacity: 1, stagger: 0.06, duration: 0.6 },
          '-=0.5'
        )
        .fromTo(
          [bottomLeftBtnRef.current, manifestoRef.current],
          { opacity: 0 },
          { opacity: 1, stagger: 0.06, duration: 0.5 },
          '-=0.4'
        )

      const mm = gsap.matchMedia(containerRef)

      // Desktop (>= 768px): Luxury Pinned Scrub
      mm.add('(min-width: 768px)', () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=120%',
            pin: pinWrapperRef.current,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (containerRef.current) {
                // Apply a buttery power2.out ease to the progress value itself for a smooth fluttery feel
                const p = gsap.parseEase('power2.out')(self.progress)
                containerRef.current.style.setProperty('--hero-scroll', p)
              }
            }
          },
        })

        scrollTl.to(bottleRef.current, { scale: 1.05, yPercent: 0, ease: 'power2.out', duration: 0.7 }, 0)
        scrollTl.to(giantTextRef.current, { yPercent: 0, scale: 1.02, ease: 'power2.out', duration: 1 }, 0)
        scrollTl.to([bottomLeftBtnRef.current, manifestoRef.current], { yPercent: -25, ease: 'power2.in', duration: 0.5 }, 0)
        scrollTl.to(bottleRef.current, { scale: 1.0, yPercent: 0, ease: 'power2.in', duration: 0.3 }, 0.7)
      })

      // Mobile (< 768px): No pin. Scrub only the LAYER opacity (1 element, not 18).
      // This is the minimum possible work — opacity is GPU-composited, never causes layout.
      mm.add('(max-width: 767px)', () => {
        const allLayers = [
          orangeLayerRef.current,
          strawLayerRef.current,
          cherryLayerRef.current,
          lemonLayerRef.current
        ]

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            // Only touch visible layers — skip hidden ones
            allLayers.forEach(layer => {
              if (layer && layer.style.display !== 'none') {
                layer.style.opacity = String(1 - self.progress * 1.6)
              }
            })
          },
          onLeave: () => {
            allLayers.forEach(layer => {
              if (layer && layer.style.display !== 'none') layer.style.opacity = '0'
            })
          },
          onEnterBack: () => {
            allLayers.forEach(layer => {
              if (layer && layer.style.display !== 'none') layer.style.opacity = '1'
            })
          }
        })

        return () => st.kill()
      })
    },
    { scope: containerRef }
  )

  const activeSlide = HERO_SLIDES[currentIndex]

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: activeSlide.bgColor }}
    >
      {/* 1. ORANGE CITRUS WARM THEME BACKGROUND */}
      <div 
        ref={bgOrangeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#FAF5EA]"
        style={{ zIndex: 0 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 95% 65% at 50% -5%, rgba(250, 182, 47, 0.45) 0%, rgba(253, 235, 195, 0.55) 45%, rgba(250, 245, 234, 1) 100%)',
          }}
        />
        <div
          className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, rgba(245, 158, 11, 0.15) 55%, transparent 75%)',
          }}
        />
      </div>

      {/* 2. STRAWBERRY RED THEME BACKGROUND */}
      <div 
        ref={bgStrawRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#FAF0EE]"
        style={{ zIndex: 0, opacity: 0 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 95% 65% at 50% -5%, rgba(224, 62, 38, 0.52) 0%, rgba(254, 218, 218, 0.7) 45%, rgba(250, 240, 238, 1) 100%)',
          }}
        />
        <div
          className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-3xl opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(224, 62, 38, 0.55) 0%, rgba(217, 4, 41, 0.22) 55%, transparent 75%)',
          }}
        />
      </div>

      {/* 3. BLACK CHERRY THEME BACKGROUND */}
      <div 
        ref={bgCherryRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#F8EDF1]"
        style={{ zIndex: 0, opacity: 0 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 95% 65% at 50% -5%, rgba(155, 17, 30, 0.52) 0%, rgba(246, 205, 218, 0.7) 45%, rgba(248, 237, 241, 1) 100%)',
          }}
        />
        <div
          className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-3xl opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(155, 17, 30, 0.55) 0%, rgba(110, 5, 20, 0.22) 55%, transparent 75%)',
          }}
        />
      </div>

      {/* 4. LEMON GREEN THEME BACKGROUND */}
      <div 
        ref={bgLemonRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#F4FAEA]"
        style={{ zIndex: 0, opacity: 0 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 95% 65% at 50% -5%, rgba(132, 204, 22, 0.45) 0%, rgba(217, 249, 157, 0.55) 45%, rgba(244, 250, 234, 1) 100%)',
          }}
        />
        <div
          className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(163, 230, 53, 0.5) 0%, rgba(101, 163, 13, 0.15) 55%, transparent 75%)',
          }}
        />
      </div>

      <div
        ref={pinWrapperRef}
        className="relative w-full min-h-svh sm:min-h-screen flex flex-col justify-between items-center px-3 sm:px-12 md:px-16 pt-[calc(var(--sat)+3.5rem)] sm:pt-[calc(var(--sat)+4.25rem)] pb-[calc(var(--sab)+1.25rem)] sm:pb-[calc(var(--sab)+1.5rem)] overflow-hidden select-none landscape-compact-hero"
      >
        {/* Center Stage: Giant Wordmark + 5 Juicy Fruit Pieces + Crisp Center Bottle */}
        <div className="relative z-10 w-full max-w-7xl flex-1 flex items-center justify-center my-auto min-h-[40vh] sm:min-h-[55vh] landscape-compact-stage">
          {/* Giant Background Wordmark */}
          <h1
            ref={giantTextRef}
            className={`absolute inset-x-0 text-center font-display ${activeSlide.wordSize} font-black uppercase text-(--color-ink) leading-none tracking-tight whitespace-nowrap max-w-full px-2 pointer-events-none select-none drop-shadow-xs`}
            style={{ zIndex: 1 }}
          >
            {activeSlide.wordmark}
          </h1>

          {/* ORANGE PIECES LAYER (4 Crisp Corner Pieces with Leaves & Drops) */}
          <div
            ref={orangeLayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5 }}
          >
            {/* Orange Piece 1: Top Left */}
            <div
              ref={piece1Ref}
              className="absolute top-[13%] sm:top-[-1%] md:top-[3%] left-[4%] sm:left-[1%] md:left-[5%] lg:left-[7%] w-20 sm:w-56 md:w-64 lg:w-72 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/orange-piece-1.png"
                  alt="Fresh juicy orange slice with dewy green leaves and droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Orange Piece 2: Bottom Left */}
            <div
              ref={piece2Ref}
              className="absolute bottom-[16%] sm:bottom-[-2%] md:bottom-[4%] left-[4%] sm:left-[0%] md:left-[4%] lg:left-[6%] w-24 sm:w-64 md:w-72 lg:w-80 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/orange-piece-2.png"
                  alt="Juicy halved orange and slice with leaves and droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Orange Piece 3: Top Right */}
            <div
              ref={piece3Ref}
              className="absolute top-[13%] sm:top-[0%] md:top-[3%] right-[4%] sm:right-[1%] md:right-[5%] lg:right-[7%] w-20 sm:w-56 md:w-64 lg:w-72 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/orange-piece-3.png"
                  alt="Halved orange and slice with dewy leaves and dripping juice"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Orange Piece 5: Bottom Right */}
            <div
              ref={piece5Ref}
              className="absolute bottom-[16%] sm:bottom-[-2%] md:bottom-[4%] right-[4%] sm:right-[1%] md:right-[4%] lg:right-[6%] w-24 sm:w-64 md:w-72 lg:w-80 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/orange-piece-5.png"
                  alt="Large juicy orange slice with dewy green leaves and bursting droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* STRAWBERRY PIECES LAYER */}
          <div
            ref={strawLayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5, opacity: 0, display: 'none' }}
          >
            {/* Straw Piece 1: Top Left */}
            <div
              ref={strawPiece1Ref}
              className="absolute top-[13%] sm:top-[-2%] md:top-[2%] left-[4%] sm:left-[0%] md:left-[5%] lg:left-[7%] w-22 sm:w-48 md:w-48 lg:w-56 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/straw-piece-1.png"
                  alt="Fresh strawberry in ruby splash with droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Straw Piece 2: Bottom Left */}
            <div
              ref={strawPiece2Ref}
              className="absolute bottom-[16%] sm:bottom-[0%] md:bottom-[4%] left-[4%] sm:left-[0%] md:left-[4%] lg:left-[6%] w-26 sm:w-64 md:w-80 lg:w-96 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/straw-piece-2.png"
                  alt="Juicy strawberry slice resting in juice wave"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Straw Piece 3: Top Right */}
            <div
              ref={strawPiece3Ref}
              className="absolute top-[13%] sm:top-[0%] right-[4%] sm:right-[1%] md:right-[2%] w-22 sm:w-48 md:w-64 lg:w-72 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/straw-piece-3.png"
                  alt="Halved strawberry bursting with ruby splash"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Straw Piece 4: Mid Right */}
            <div
              ref={strawPiece4Ref}
              className="hidden md:block absolute top-[34%] right-[-2%] sm:right-[0%] md:right-[1%] w-18 sm:w-26 md:w-34 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/straw-piece-4.png"
                  alt="Ruby strawberry with sparkling droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Straw Piece 5: Bottom Right (UNHIDDEN & VISIBLE ON MOBILE) */}
            <div
              ref={strawPiece5Ref}
              className="absolute bottom-[16%] sm:bottom-[0%] md:bottom-[4%] right-[4%] sm:right-[1%] md:right-[4%] lg:right-[6%] w-24 sm:w-56 md:w-72 lg:w-[24rem] pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/straw-piece-5.png"
                  alt="Fresh strawberry with splash and dewy green leaf"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* CHERRY PIECES LAYER */}
          <div
            ref={cherryLayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5, opacity: 0, display: 'none' }}
          >
            {/* Cherry Piece 1: Top Left */}
            <div
              ref={cherryPiece1Ref}
              className="absolute top-[13%] sm:top-[0%] md:top-[3%] left-[4%] sm:left-[2%] md:left-[8%] lg:left-[10%] w-22 sm:w-48 md:w-48 lg:w-56 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/cherry-piece-1.png"
                  alt="Fresh black cherry with stem and droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Cherry Piece 2: Bottom Left */}
            <div
              ref={cherryPiece2Ref}
              className="absolute bottom-[16%] sm:bottom-[0%] md:bottom-[4%] left-[4%] sm:left-[0%] md:left-[4%] lg:left-[6%] w-24 sm:w-56 md:w-72 lg:w-80 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/cherry-piece-2.png"
                  alt="Pair of cherries in ruby splash wave"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Cherry Piece 3: Top Right */}
            <div
              ref={cherryPiece3Ref}
              className="absolute top-[13%] sm:top-[1%] right-[4%] sm:right-[1%] md:right-[2%] w-22 sm:w-36 md:w-48 lg:w-52 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/cherry-piece-3.png"
                  alt="Black cherry bursting with ruby juice splash"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Cherry Piece 4: Mid Right */}
            <div
              ref={cherryPiece4Ref}
              className="hidden md:block absolute top-[34%] right-[-2%] sm:right-[0%] md:right-[1%] w-18 sm:w-26 md:w-34 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/cherry-piece-4.png"
                  alt="Halved cherry with glowing ruby droplets"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Cherry Piece 5: Bottom Right (UNHIDDEN & VISIBLE ON MOBILE) */}
            <div
              ref={cherryPiece5Ref}
              className="absolute bottom-[16%] sm:bottom-[0%] md:bottom-[4%] right-[4%] sm:right-[1%] md:right-[4%] lg:right-[6%] w-24 sm:w-52 md:w-64 lg:w-88 pointer-events-none"
            >
              <div className="">
                <img
                  src="/assets/cherry-piece-5.png"
                  alt="Halved cherry showing pit with dewy green leaf"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* LEMON PIECES LAYER */}
          <div
            ref={lemonLayerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5, opacity: 0, display: 'none' }}
          >
            {/* Lemon Piece 1 */}
            <div
              ref={lemonPiece1Ref}
              className="absolute top-[13%] sm:top-[0%] md:top-[3%] left-[4%] sm:left-[1%] md:left-[5%] lg:left-[7%] w-22 sm:w-56 md:w-56 lg:w-64 pointer-events-none"
            >
              <div className="">
                <img src="/assets/lemon-piece-1.png" alt="Fresh lemon slice" className="w-full h-auto object-contain" />
              </div>
            </div>
            {/* Lemon Piece 2 */}
            <div
              ref={lemonPiece2Ref}
              className="absolute bottom-[16%] sm:bottom-[2%] md:bottom-[6%] left-[4%] sm:left-[0%] md:left-[3%] lg:left-[5%] w-26 sm:w-60 md:w-80 lg:w-104 pointer-events-none"
            >
              <div className="">
                <img src="/assets/lemon-piece-2.png" alt="Fresh lemon slice" className="w-full h-auto object-contain" />
              </div>
            </div>
            {/* Lemon Piece 3 */}
            <div
              ref={lemonPiece3Ref}
              className="absolute top-[13%] sm:top-[0%] right-[4%] sm:right-[1%] md:right-[2%] w-22 sm:w-56 md:w-72 lg:w-80 pointer-events-none"
            >
              <div className="">
                <img src="/assets/lemon-piece-3.png" alt="Fresh lemon slice" className="w-full h-auto object-contain" />
              </div>
            </div>
            {/* Lemon Piece 5 */}
            <div
              ref={lemonPiece5Ref}
              className="absolute bottom-[16%] sm:bottom-[2%] md:bottom-[6%] right-[4%] sm:right-[1%] md:right-[4%] lg:right-[6%] w-26 sm:w-64 md:w-80 lg:w-md pointer-events-none"
            >
              <div className="">
                <img src="/assets/lemon-piece-5.png" alt="Fresh lemon slice" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Crisp Center Bottle */}
          <div
            ref={bottleRef}
            className={`relative w-full ${activeSlide.bottleContainerClass} flex items-center justify-center`}
            style={{ zIndex: 10 }}
          >
            <img
              src={activeSlide.bottleImage}
              alt={activeSlide.bottleAlt}
              className={`w-full h-full object-contain object-center drop-shadow-2xl transition-transform duration-500 ${activeSlide.bottleImgClass || ''}`}
              loading="eager"
            />
          </div>
        </div>

        {/* Bottom Editorial Bar: Manifesto text + CTA Button */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-2.5 sm:gap-6 pt-0 sm:pt-2 pointer-events-auto pb-0.5 sm:pb-0">
          {/* Top on mobile / Right on desktop: Manifesto Block */}
          <div
            ref={manifestoRef}
            className="w-full sm:max-w-md md:max-w-lg text-center sm:text-right flex flex-col items-center sm:items-end mt-0.5 sm:mt-0 order-1 sm:order-2"
          >
            <h2 className="font-display text-xs sm:text-base md:text-lg font-bold text-neutral-900 leading-tight mb-1">
              {activeSlide.manifestoTitle.split(activeSlide.manifestoHighlight)[0]}
              <span style={{ color: activeSlide.highlightColor }}>
                {activeSlide.manifestoHighlight}
              </span>
              {activeSlide.manifestoTitle.split(activeSlide.manifestoHighlight)[1]}
            </h2>
            <p className="font-body text-[11px] sm:text-xs font-normal tracking-tight sm:tracking-normal text-neutral-600 leading-snug max-w-[310px] sm:max-w-md mx-auto sm:mx-0">
              {activeSlide.manifestoBody}
            </p>
          </div>

          {/* Bottom on mobile / Left on desktop: CTA Square Button */}
          <div ref={bottomLeftBtnRef} className="flex justify-center sm:justify-start mt-1 sm:mt-0 order-2 sm:order-1 mb-1 sm:mb-0">
            <a
              href="#flavors"
              className="touch-target-44 inline-flex items-center justify-center bg-(--color-ink) text-white font-body font-medium uppercase tracking-[0.16em] text-[11px] sm:text-xs px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-none transition-colors hover:bg-(--color-coral) shadow-md cursor-pointer whitespace-nowrap"
            >
              {activeSlide.ctaText}
            </a>
          </div>
        </div>
      </div>

      {/* Organic Paper-Tear Transition */}
      <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-none w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 sm:h-8 transition-colors duration-700 fill-current" style={{ color: activeSlide.bgColor }}>
          <path d="M0 32H1440V10C1380 20 1315 6 1235 16C1155 26 1095 8 1015 14C935 20 875 28 795 18C715 8 655 22 575 16C495 10 435 24 355 18C275 12 215 26 135 18C75 12 25 22 0 14V32Z"/>
        </svg>
      </div>
    </section>
  )
}

