import { useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const STORY_MILESTONES = [
  {
    id: 'grove',
    num: '01',
    year: '2018',
    title: 'Valencia Groves',
    desc: 'Grown under the Mediterranean sun in our family citrus groves. Picked fresh at dawn and cold-pressed within hours. Never boiled, never pasteurized, zero added sugar.',
    image: '/assets/timeline-1.png',
    alt: 'Organic citrus harvest in generational orchards',
    theme: {
      primary: '#FF5722',
      leftBg: '#FFF9F5',
      rightGradient: 'from-[#FF8A00] via-[#FF5722] to-[#D84315]',
      statBorder: '#FF5722',
    },
    stats: [
      { val: '100%', label: 'Raw Single Grove' },
      { val: '0%', label: 'Added Sugar' },
    ],
  },
  {
    id: 'extraction',
    num: '02',
    year: '2020',
    title: 'Zero Heat Press',
    desc: 'Heat pasteurization destroys living vitamins and enzymes. We press raw fruit gently below 4°C to preserve 100% of organic vitamins and vital plant nutrients.',
    image: '/assets/timeline-2.png',
    alt: 'Cold micro-pressure extraction equipment',
    theme: {
      primary: '#059669',
      leftBg: '#F2FDF6',
      rightGradient: 'from-[#10B981] via-[#059669] to-[#047857]',
      statBorder: '#059669',
    },
    stats: [
      { val: '< 4°C', label: 'Extraction Temp' },
      { val: '100%', label: 'Active Enzymes' },
    ],
  },
  {
    id: 'matrix',
    num: '03',
    year: '2022',
    title: 'Coconut & Minerals',
    desc: 'Infusing pure young coconut water with natural pink mineral salt creates an isotonic balance that delivers fast, deep cellular hydration without sugar spikes.',
    image: '/assets/timeline-3.png',
    alt: 'Cellular electrolyte hydration balance',
    theme: {
      primary: '#0284C7',
      leftBg: '#F0F9FF',
      rightGradient: 'from-[#38BDF8] via-[#0284C7] to-[#0369A1]',
      statBorder: '#0284C7',
    },
    stats: [
      { val: '240mg', label: 'Plant Minerals' },
      { val: '15 Cal', label: 'Clean Refresh' },
    ],
  },
  {
    id: 'coldchain',
    num: '04',
    year: '2024',
    title: '24-Hour Cold Chain',
    desc: 'Juiced in the morning, nitrogen-chilled, and shipped straight to your door in recyclable insulated cartons within 24 hours of harvest.',
    image: '/assets/timeline-4.png',
    alt: 'Refrigerated cold-chain delivery',
    theme: {
      primary: '#4F46E5',
      leftBg: '#F5F6FF',
      rightGradient: 'from-[#6366F1] via-[#4F46E5] to-[#312E81]',
      statBorder: '#4F46E5',
    },
    stats: [
      { val: '24h', label: 'Harvest to Door' },
      { val: '100%', label: 'Recyclable Box' },
    ],
  },
  {
    id: 'editions',
    num: '05',
    year: '2026',
    title: '4 Pure Editions',
    desc: 'Valencia Orange, Wild Strawberry, Black Cherry, and Crisp Meyer Lemon. 100% unpasteurized living juice crafted to fuel your vitality every day.',
    image: '/assets/timeline-5.png',
    alt: 'Clean Juice four signature edition bottles',
    theme: {
      primary: '#E11D48',
      leftBg: '#FFF1F4',
      rightGradient: 'from-[#FB7185] via-[#E11D48] to-[#881337]',
      statBorder: '#E11D48',
    },
    stats: [
      { val: '4', label: 'Raw Editions' },
      { val: '0', label: 'Preservatives' },
    ],
  },
]

export default function About() {
  const containerRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const progressBarRef = useRef(null)
  const scrollTriggerRef = useRef(null)
  const slideRefs = useRef([])
  const imgRefs = useRef([])

  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndexRef = useRef(0)

  // 120fps GPU Hardware-Accelerated Staggered Text & Parallax GSAP Engine
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
      if (prefersReducedMotion) return

      const slides = slideRefs.current.filter(Boolean)
      const totalSlides = slides.length
      if (totalSlides === 0) return

      const isMobile = window.innerWidth < 768
      const scrollMultiplier = isMobile ? 1.5 : 1.1
      const scrubSpeed = isMobile ? 0.2 : 0.4

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (totalSlides - 1) * scrollMultiplier}`,
          pin: pinWrapperRef.current,
          scrub: scrubSpeed,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`
            }
            const idx = Math.min(
              totalSlides - 1,
              Math.floor(self.progress * (totalSlides - 1) + 0.35)
            )
            if (idx !== lastIndexRef.current) {
              lastIndexRef.current = idx
              setActiveIndex(idx)
            }
          },
        },
      })

      scrollTriggerRef.current = masterTl.scrollTrigger

      // Cinematic entrance for Slide 0 on initial reveal
      const slide0 = slides[0]
      if (slide0) {
        const s0Title = slide0.querySelector('.slide-title')
        const s0Desc = slide0.querySelector('.slide-desc')
        const s0Stats = slide0.querySelector('.slide-stats')
        const s0Image = slide0.querySelector('.slide-image')
        const s0Num = slide0.querySelector('.slide-watermark')

        if (s0Title) gsap.from(s0Title, { y: 45, opacity: 0, duration: 1.1, ease: 'power3.out' })
        if (s0Desc) gsap.from(s0Desc, { y: 30, opacity: 0, duration: 1.0, ease: 'power3.out', delay: 0.15 })
        if (s0Stats) gsap.from(s0Stats, { y: 25, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 })
        if (s0Image) gsap.from(s0Image, { scale: 0.9, opacity: 0, duration: 1.2, ease: 'power3.out' })
        if (s0Num) gsap.from(s0Num, { x: 40, opacity: 0, duration: 1.2, ease: 'power2.out' })
      }

      // Staggered transitions across slides: Exit previous content smoothly, sweep incoming slide up
      slides.forEach((slide, index) => {
        if (index === 0) return

        const prevSlide = slides[index - 1]
        const stepTime = (index - 1) * 1.5

        // Previous slide exit: Title, desc, and image glide upward with subtle parallax fade
        const prevContent = prevSlide.querySelector('.slide-content')
        const prevImage = prevSlide.querySelector('.slide-image')
        const prevNum = prevSlide.querySelector('.slide-watermark')

        if (prevContent) {
          masterTl.to(
            prevContent,
            { y: -50, opacity: 0, duration: 0.8, ease: 'power2.in' },
            stepTime
          )
        }
        if (prevImage) {
          masterTl.to(
            prevImage,
            { scale: 0.92, y: -30, opacity: 0.2, duration: 0.8, ease: 'power2.in' },
            stepTime
          )
        }
        if (prevNum) {
          masterTl.to(
            prevNum,
            { x: -30, opacity: 0, duration: 0.8, ease: 'power2.in' },
            stepTime
          )
        }

        // Incoming slide sweeps up from bottom edge: start at yPercent: 102 with autoAlpha: 0 to guarantee 0px green sliver bleed
        masterTl.fromTo(
          slide,
          {
            yPercent: 102,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: 'none',
            duration: 1.4,
          },
          stepTime
        )

        // Incoming slide kinetic text & image reveals
        const nextTitle = slide.querySelector('.slide-title')
        const nextDesc = slide.querySelector('.slide-desc')
        const nextStats = slide.querySelector('.slide-stats')
        const nextImage = slide.querySelector('.slide-image')
        const nextNum = slide.querySelector('.slide-watermark')

        if (nextTitle) {
          masterTl.fromTo(
            nextTitle,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
            stepTime + 0.3
          )
        }
        if (nextDesc) {
          masterTl.fromTo(
            nextDesc,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
            stepTime + 0.45
          )
        }
        if (nextStats) {
          masterTl.fromTo(
            nextStats,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            stepTime + 0.6
          )
        }
        if (nextImage) {
          masterTl.fromTo(
            nextImage,
            { scale: 0.88, rotation: -2.5, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
            stepTime + 0.2
          )
        }
        if (nextNum) {
          masterTl.fromTo(
            nextNum,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 0.12, duration: 1.0, ease: 'power2.out' },
            stepTime + 0.3
          )
        }
      })

      // Gentle floating animation on images (desktop only to keep mobile 60-120fps smooth)
      if (!isMobile) {
        imgRefs.current.forEach((img, idx) => {
          if (!img) return
          gsap.to(img, {
            y: idx % 2 === 0 ? -10 : 10,
            duration: 4.2 + idx * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        })
      }
    },
    { scope: containerRef }
  )

  const currentTheme = STORY_MILESTONES[activeIndex]?.theme || STORY_MILESTONES[0].theme

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-white text-black selection:bg-black selection:text-white"
      aria-label="Clean Juice Heritage Story"
    >
      {/* Pinned Full-Page Viewport Stage */}
      <div
        ref={pinWrapperRef}
        className="w-full h-screen relative overflow-hidden bg-white flex flex-col justify-between"
      >
        {/* Minimalist Top Navigation Bar */}
        <header className="w-full border-b border-black/10 px-6 sm:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center justify-between bg-white relative z-30 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <h2
              className="font-vagnola text-2xl sm:text-3xl text-black tracking-wide font-normal"
              style={{ fontFamily: "'Vagnola', 'Vagnola Demo', serif", fontWeight: 400 }}
            >
              Our Story
            </h2>
          </div>
        </header>

        {/* Live Dynamic Progress Scrubber Line */}
        <div className="w-full h-[3px] bg-neutral-200 relative z-30 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full transition-colors duration-300"
            style={{
              width: '0%',
              backgroundColor: currentTheme.primary,
            }}
          />
        </div>

        {/* Full-Page Stage: Completely Fills the Screen with Rich Vibrant Colors & Zero Bleed */}
        <div className="relative w-full flex-1 overflow-hidden z-20">
          {STORY_MILESTONES.map((slide, idx) => {
            return (
              <article
                key={slide.id}
                ref={(el) => (slideRefs.current[idx] = el)}
                className="absolute inset-0 w-full h-full flex flex-col lg:flex-row overflow-hidden will-change-transform"
                style={{
                  zIndex: 10 + idx,
                }}
              >
                {/* Left Column: Clean Editorial Storyboard with Reduced Font Weight */}
                <div
                  className="relative z-10 w-full lg:w-1/2 h-full flex flex-col justify-center px-6 sm:px-14 lg:px-20 xl:px-24 py-8 sm:py-12 border-b lg:border-b-0 lg:border-r border-black/10 overflow-hidden"
                  style={{ backgroundColor: slide.theme.leftBg }}
                >
                  {/* Subtle Giant Background Number Watermark */}
                  <span
                    className="slide-watermark absolute right-6 top-1/2 -translate-y-1/2 font-vagnola text-[22vw] sm:text-[18vw] lg:text-[16vw] select-none pointer-events-none leading-none tracking-tighter opacity-12 will-change-transform"
                    style={{
                      color: slide.theme.primary,
                      fontFamily: "'Vagnola', 'Vagnola Demo', serif",
                      fontWeight: 400,
                    }}
                  >
                    {slide.num}
                  </span>

                  {/* Animated Content Container */}
                  <div className="slide-content relative z-10 will-change-transform">
                    {/* Main Headline in Reduced-Weight Vagnola Custom Font */}
                    <h3
                      className="slide-title font-vagnola text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-black mb-4 sm:mb-6 leading-[1.06] tracking-tight font-normal will-change-transform"
                      style={{
                        fontFamily: "'Vagnola', 'Vagnola Demo', serif",
                        fontWeight: 400,
                      }}
                    >
                      {slide.title}
                    </h3>

                    {/* Clean Narrative Body - Reduced Light Weight */}
                    <p
                      className="slide-desc text-sm sm:text-base lg:text-lg text-neutral-600 font-light leading-relaxed max-w-lg mb-6 sm:mb-8 will-change-transform"
                      style={{ fontWeight: 300 }}
                    >
                      {slide.desc}
                    </p>

                    {/* Stat Callouts with Refined Typography */}
                    <div className="slide-stats grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-black/10 max-w-lg will-change-transform">
                      {slide.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="pl-3 sm:pl-4 py-1 border-l-3"
                          style={{ borderColor: slide.theme.primary }}
                        >
                          <div
                            className="font-vagnola text-3xl sm:text-4xl lg:text-5xl leading-none font-normal"
                            style={{
                              color: slide.theme.primary,
                              fontFamily: "'Vagnola', 'Vagnola Demo', serif",
                              fontWeight: 400,
                            }}
                          >
                            {stat.val}
                          </div>
                          <div className="text-[11px] sm:text-xs font-mono font-light tracking-wider text-neutral-500 uppercase mt-1">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Full-Height Vibrant Saturated Visual Showcase with No Clutter Badges */}
                <div
                  className={`relative z-10 w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-hidden bg-linear-to-br ${slide.theme.rightGradient}`}
                >
                  {/* Subtle Ambient Radial Glow */}
                  <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/15 pointer-events-none" />

                  {/* Staged Fruit / Product Image - Clean & Prominently Enlarged with Smooth GSAP Entry */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <img
                      ref={(el) => (imgRefs.current[idx] = el)}
                      src={slide.image}
                      alt={slide.alt}
                      className="slide-image w-full max-w-[520px] sm:max-w-[640px] lg:max-w-[760px] xl:max-w-[840px] max-h-[74vh] sm:max-h-[78vh] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)] will-change-transform transform-gpu"
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
