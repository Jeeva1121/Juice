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
    bgColor: '#FF5722',
    bottleImage: '/assets/orange-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed orange juice can',
    manifestoTitle: 'Your healthy life starts here with us',
    manifestoHighlight: 'healthy life',
    highlightColor: '#FFFFFF',
    textColor: 'text-white',
    bodyTextColor: 'text-white/90',
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
    bgColor: '#E53935',
    bottleImage: '/assets/straw-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed strawberry juice can',
    manifestoTitle: 'Wild field strawberries picked at dawn',
    manifestoHighlight: 'picked at dawn',
    highlightColor: '#FFFFFF',
    textColor: 'text-white',
    bodyTextColor: 'text-white/90',
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
    bgColor: '#9B111E',
    bottleImage: '/assets/cherry-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed cherry juice can',
    manifestoTitle: 'Dark orchard cherries picked at peak ripeness',
    manifestoHighlight: 'peak ripeness',
    highlightColor: '#FFFFFF',
    textColor: 'text-white',
    bodyTextColor: 'text-white/90',
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
    bgColor: '#CDDC39',
    bottleImage: '/assets/lemon-can-hero.png',
    bottleAlt: 'Zesty 100% natural cold-pressed lemon juice can',
    manifestoTitle: 'Brighten your day with citrus vitality',
    manifestoHighlight: 'citrus vitality',
    highlightColor: '#1A1A1A',
    textColor: 'text-neutral-900',
    bodyTextColor: 'text-neutral-800',
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
    currentSlideRef.current = currentIndex
  }, [currentIndex])

  // Dispatch event for Navbar color adaptation
  useEffect(() => {
    const isLight = HERO_SLIDES[currentIndex].id === 'lemon'
    window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { isLight } }))
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

        // Ultra-Modern Kinetic GSAP Typography & Element Entrance
        enterTl
          .fromTo(
            bottleRef.current,
            { y: 80, scale: 0.8, rotation: 5, opacity: 0 },
            { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.7)' },
            0
          )
          .fromTo(
            giantTextRef.current,
            { y: 120, scale: 0.85, opacity: 0, rotationX: 45, transformPerspective: 800 },
            { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 1.2, ease: 'power4.out' },
            0.1
          )
          .fromTo(
            counterRef.current,
            { x: -40, opacity: 0, scale: 0.5 },
            { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2.5)' },
            0.2
          )
          .fromTo(
            manifestoRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
            0.25
          )
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

    // Dynamic Kinetic GSAP Exit
    exitTl
      .to(bottleRef.current, { y: -60, scale: 0.8, rotation: -5, opacity: 0, duration: 0.5, ease: 'power3.in' }, 0)
      .to(giantTextRef.current, { y: -80, scale: 0.9, opacity: 0, rotationX: -45, transformPerspective: 800, duration: 0.45, ease: 'power3.in' }, 0)
      .to(manifestoRef.current, { y: -20, opacity: 0, scale: 0.95, duration: 0.35, ease: 'power3.in' }, 0)
      .to(counterRef.current, { x: 40, opacity: 0, scale: 0.5, duration: 0.35, ease: 'power3.in' }, 0)
  }, [])

  // Auto-advance every 4.5 seconds when user is at top of page
  const startAutoTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!isAnimatingRef.current && window.scrollY < 80) {
        const nextIdx = (currentSlideRef.current + 1) % HERO_SLIDES.length
        goToSlide(nextIdx)
      }
    }, 5500)
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

      // Hardware acceleration for mobile performance
      gsap.set([
        piece1Ref.current, piece2Ref.current, piece3Ref.current, piece5Ref.current,
        strawPiece1Ref.current, strawPiece2Ref.current, strawPiece3Ref.current, strawPiece4Ref.current, strawPiece5Ref.current,
        cherryPiece1Ref.current, cherryPiece2Ref.current, cherryPiece3Ref.current, cherryPiece4Ref.current, cherryPiece5Ref.current,
        lemonPiece1Ref.current, lemonPiece2Ref.current, lemonPiece3Ref.current, lemonPiece5Ref.current,
        bottleRef.current, giantTextRef.current
      ], { willChange: 'transform' })

      // Page Load Intro: Cinematic kinetic GSAP typography & physical bottle entrance
      const introTl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      introTl
        .fromTo(
          bottleRef.current,
          { y: 100, scale: 0.7, rotation: 8, opacity: 0 },
          { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.7)' },
          0.1
        )
        .fromTo(
          giantTextRef.current,
          { y: 150, scale: 0.8, opacity: 0, rotationX: 60, transformPerspective: 800 },
          { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 1.4, ease: 'power4.out' },
          0.2
        )
        .fromTo(
          [piece1Ref.current, piece2Ref.current, piece3Ref.current, piece5Ref.current],
          { scale: 0.5, opacity: 0, y: 50, rotation: 45 },
          { scale: 1, opacity: 1, y: 0, rotation: 0, stagger: 0.1, duration: 1.2, ease: 'back.out(2)' },
          0.35
        )
        .fromTo(
          manifestoRef.current,
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
          0.45
        )
        .fromTo(
          bottomLeftBtnRef.current,
          { scale: 0.8, opacity: 0, x: -30 },
          { scale: 1, opacity: 1, x: 0, duration: 0.8, ease: 'back.out(2.5)' },
          0.5
        )

      const mm = gsap.matchMedia()

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          const isLight = HERO_SLIDES[currentSlideRef.current]?.id === 'lemon'
          window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { isLight } }))
        },
        onEnterBack: () => {
          const isLight = HERO_SLIDES[currentSlideRef.current]?.id === 'lemon'
          window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { isLight } }))
        }
      })

      // Desktop (>= 768px): Luxury Pinned Scrub
      mm.add('(min-width: 768px)', () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=80%',
            pin: pinWrapperRef.current,
            scrub: 0.4,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        })

        const startState = { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 };

        // 1. Orange pieces drift outward (4 pristine corner pieces)
        scrollTl
          .fromTo(piece1Ref.current, startState, { xPercent: -85, yPercent: -75, rotation: -35, scale: 1.25, ease: 'power3.out', duration: 1, force3D: true }, 0)
          .fromTo(piece2Ref.current, startState, { xPercent: -95, yPercent: 70, rotation: 28, scale: 1.18, ease: 'power3.out', duration: 1, force3D: true }, 0)
          .fromTo(piece3Ref.current, startState, { xPercent: 90, yPercent: -70, rotation: 38, scale: 1.25, ease: 'power3.out', duration: 1, force3D: true }, 0)
          .fromTo(piece5Ref.current, startState, { xPercent: 85, yPercent: 80, rotation: -30, scale: 1.2, ease: 'power3.out', duration: 1, force3D: true }, 0)

        // 2. Strawberry pieces drift outward
        scrollTl
          .fromTo(strawPiece1Ref.current, startState, { xPercent: -85, yPercent: -75, rotation: -30, scale: 1.25, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece2Ref.current, startState, { xPercent: -95, yPercent: 70, rotation: 25, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece3Ref.current, startState, { xPercent: 90, yPercent: -70, rotation: 35, scale: 1.25, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece4Ref.current, startState, { xPercent: 100, yPercent: 20, rotation: -20, scale: 1.12, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece5Ref.current, startState, { xPercent: 85, yPercent: 80, rotation: -28, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)

        // 3. Cherry pieces drift outward
        scrollTl
          .fromTo(cherryPiece1Ref.current, startState, { xPercent: -85, yPercent: -75, rotation: -30, scale: 1.25, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece2Ref.current, startState, { xPercent: -95, yPercent: 70, rotation: 25, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece3Ref.current, startState, { xPercent: 90, yPercent: -70, rotation: 35, scale: 1.25, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece4Ref.current, startState, { xPercent: 100, yPercent: 20, rotation: -20, scale: 1.12, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece5Ref.current, startState, { xPercent: 85, yPercent: 80, rotation: -28, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)

        // 4. Lemon pieces drift outward (4 pristine corner pieces)
        scrollTl
          .fromTo(lemonPiece1Ref.current, startState, { xPercent: -85, yPercent: -75, rotation: -30, scale: 1.25, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(lemonPiece2Ref.current, startState, { xPercent: -95, yPercent: 70, rotation: 25, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(lemonPiece3Ref.current, startState, { xPercent: 90, yPercent: -70, rotation: 35, scale: 1.25, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(lemonPiece5Ref.current, startState, { xPercent: 85, yPercent: 80, rotation: -28, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)

        scrollTl.fromTo(bottleRef.current, { scale: 1, yPercent: 0 }, { scale: 1.05, yPercent: 0, ease: 'power2.out', duration: 0.7 }, 0)
        scrollTl.fromTo(giantTextRef.current, { scale: 1, yPercent: 0 }, { yPercent: 0, scale: 1.02, ease: 'power2.out', duration: 1, force3D: true }, 0)
        scrollTl.fromTo([bottomLeftBtnRef.current, manifestoRef.current], { yPercent: 0 }, { yPercent: -25, ease: 'power2.in', duration: 0.5 }, 0)
        scrollTl.to(bottleRef.current, { scale: 1.0, yPercent: 0, ease: 'power2.in', duration: 0.3 }, 0.7)
      })

      // Mobile (< 768px): Luxury Pinned Scrub matching Web View (relaxed pace)
      mm.add('(max-width: 767px)', () => {
        const mobileScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=85%',
            pin: pinWrapperRef.current,
            scrub: 0.25,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        })

        const mStartState = { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 };

        // 1. Orange pieces drift outward to corners
        mobileScrollTl
          .fromTo(piece1Ref.current, mStartState, { xPercent: -65, yPercent: -55, rotation: -25, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(piece2Ref.current, mStartState, { xPercent: -70, yPercent: 55, rotation: 20, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(piece3Ref.current, mStartState, { xPercent: 70, yPercent: -55, rotation: 25, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(piece5Ref.current, mStartState, { xPercent: 65, yPercent: 60, rotation: -20, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)

        // 2. Strawberry pieces drift outward
        mobileScrollTl
          .fromTo(strawPiece1Ref.current, mStartState, { xPercent: -65, yPercent: -55, rotation: -22, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece2Ref.current, mStartState, { xPercent: -70, yPercent: 55, rotation: 18, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece3Ref.current, mStartState, { xPercent: 70, yPercent: -55, rotation: 24, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(strawPiece5Ref.current, mStartState, { xPercent: 65, yPercent: 60, rotation: -20, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)

        // 3. Cherry pieces drift outward
        mobileScrollTl
          .fromTo(cherryPiece1Ref.current, mStartState, { xPercent: -65, yPercent: -55, rotation: -22, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece2Ref.current, mStartState, { xPercent: -70, yPercent: 55, rotation: 18, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece3Ref.current, mStartState, { xPercent: 70, yPercent: -55, rotation: 24, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(cherryPiece5Ref.current, mStartState, { xPercent: 65, yPercent: 60, rotation: -20, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)

        // 4. Lemon pieces drift outward
        mobileScrollTl
          .fromTo(lemonPiece1Ref.current, mStartState, { xPercent: -65, yPercent: -55, rotation: -22, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(lemonPiece2Ref.current, mStartState, { xPercent: -70, yPercent: 55, rotation: 18, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(lemonPiece3Ref.current, mStartState, { xPercent: 70, yPercent: -55, rotation: 24, scale: 1.2, ease: 'power2.out', duration: 1, force3D: true }, 0)
          .fromTo(lemonPiece5Ref.current, mStartState, { xPercent: 65, yPercent: 60, rotation: -20, scale: 1.18, ease: 'power2.out', duration: 1, force3D: true }, 0)

        // Bottle stays centered and expands like web view
        mobileScrollTl.fromTo(bottleRef.current, { scale: 1, yPercent: 0 }, { scale: 1.08, yPercent: 0, ease: 'power2.out', duration: 0.8, force3D: true }, 0)
        mobileScrollTl.fromTo(giantTextRef.current, { scale: 1, yPercent: 0 }, { yPercent: 0, scale: 1.04, ease: 'power2.out', duration: 1, force3D: true }, 0)
        mobileScrollTl.fromTo([bottomLeftBtnRef.current, manifestoRef.current], { yPercent: 0 }, { yPercent: -15, ease: 'power2.in', duration: 0.45 }, 0)
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
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#FF5722]"
        style={{ zIndex: 0 }}
      >
      </div>

      {/* 2. STRAWBERRY RED THEME BACKGROUND */}
      <div 
        ref={bgStrawRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#E53935]"
        style={{ zIndex: 0, opacity: 0 }}
      >
      </div>

      {/* 3. BLACK CHERRY THEME BACKGROUND */}
      <div 
        ref={bgCherryRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#9B111E]"
        style={{ zIndex: 0, opacity: 0 }}
      >
      </div>

      {/* 4. LEMON GREEN THEME BACKGROUND */}
      <div 
        ref={bgLemonRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[#CDDC39]"
        style={{ zIndex: 0, opacity: 0 }}
      >
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
            className={`absolute inset-x-0 text-center font-asul ${activeSlide.wordSize} font-bold uppercase text-white/95 leading-none tracking-tight whitespace-nowrap max-w-full px-2 pointer-events-none select-none`}
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
              className="absolute top-[13%] sm:top-[-1%] md:top-[3%] left-[4%] sm:left-[1%] md:left-[1%] lg:left-[3%] w-20 sm:w-56 md:w-64 lg:w-72 pointer-events-none"
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
              className="absolute top-[13%] sm:top-[0%] md:top-[3%] right-[4%] sm:right-[1%] md:right-[3%] lg:right-[5%] w-20 sm:w-56 md:w-64 lg:w-72 pointer-events-none"
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
            {/* Cherry Piece 1: Top Left (shifted up on web alone) */}
            <div
              ref={cherryPiece1Ref}
              className="absolute top-[16%] sm:top-[14%] md:top-[12%] lg:top-[13%] left-[4%] sm:left-[2%] md:left-[3%] lg:left-[4%] w-22 sm:w-48 md:w-36 lg:w-40 pointer-events-none"
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
              className="absolute top-[13%] sm:top-[1%] md:top-[6%] right-[4%] sm:right-[1%] md:right-[12%] lg:right-[15%] w-22 sm:w-36 md:w-48 lg:w-52 pointer-events-none"
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
              className={`w-full h-full object-contain object-center drop-shadow-xl md:drop-shadow-2xl transition-transform duration-500 ${activeSlide.bottleImgClass || ''}`}
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
            <h2 className={`font-asul text-xs sm:text-base md:text-lg font-bold ${activeSlide.textColor} leading-tight mb-1`}>
              {activeSlide.manifestoTitle.split(activeSlide.manifestoHighlight)[0]}
              <span style={{ color: activeSlide.highlightColor }}>
                {activeSlide.manifestoHighlight}
              </span>
              {activeSlide.manifestoTitle.split(activeSlide.manifestoHighlight)[1]}
            </h2>
            <p className={`font-poppins text-[11px] sm:text-xs font-normal tracking-tight sm:tracking-normal ${activeSlide.bodyTextColor} leading-snug max-w-[310px] sm:max-w-md mx-auto sm:mx-0`} style={{ fontFamily: "'Poppins', sans-serif" }}>
              {activeSlide.manifestoBody}
            </p>
          </div>

          {/* Bottom on mobile / Left on desktop: CTA Square Button */}
          <div ref={bottomLeftBtnRef} className="flex justify-center sm:justify-start mt-1 sm:mt-0 order-2 sm:order-1 mb-1 sm:mb-0">
            <a
              href="#flavors"
              className="touch-target-44 inline-flex items-center justify-center bg-(--color-ink) text-white font-poppins font-semibold uppercase tracking-[0.16em] text-[11px] sm:text-xs px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-none transition-colors hover:bg-(--color-coral) shadow-md cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "'Poppins', sans-serif" }}
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

