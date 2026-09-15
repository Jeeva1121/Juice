import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Showcase() {
  const containerRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const imageFrameRef = useRef(null)
  const imageRef = useRef(null)
  const headlineRef = useRef(null)
  const callout1Ref = useRef(null)
  const callout2Ref = useRef(null)
  const callout3Ref = useRef(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) return

      // Pinned Cinematic Showcase with scrub: 1
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: pinWrapperRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Stage 1: Entry - image scales 1.18 -> 1.0 with inset clip-path reveal
      tl.fromTo(
        imageFrameRef.current,
        {
          clipPath: 'inset(15% 15% 15% 15% round 20px)',
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'power3.out',
          duration: 0.4,
        },
        0
      )
        .fromTo(
          imageRef.current,
          {
            scale: 1.18,
            yPercent: -4,
          },
          {
            scale: 1.0,
            yPercent: 4,
            ease: 'power3.out',
            duration: 0.4,
          },
          0
        )
        .fromTo(
          headlineRef.current,
          {
            yPercent: 30,
            opacity: 0.4,
          },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 0.4,
          },
          0
        )

      // Stage 2: Mid-scroll - Callouts slide in sequentially with stagger ease
      tl.fromTo(
        callout1Ref.current,
        { xPercent: -30, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.3 },
        0.3
      )
        .fromTo(
          callout2Ref.current,
          { xPercent: 30, opacity: 0 },
          { xPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.3 },
          0.45
        )
        .fromTo(
          callout3Ref.current,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.3 },
          0.6
        )

      // Stage 3: Continuous Exit - Callouts fade out, image scales down with blur
      tl.to(
        [callout1Ref.current, callout2Ref.current, callout3Ref.current, headlineRef.current],
        {
          opacity: 0,
          yPercent: -20,
          ease: 'power3.in',
          duration: 0.3,
        },
        0.8
      ).to(
        imageRef.current,
        {
          scale: 0.94,
          filter: 'blur(8px)',
          opacity: 0.3,
          ease: 'power3.in',
          duration: 0.3,
        },
        0.8
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative w-full bg-(--color-surface) border-b border-(--color-border) overflow-hidden"
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full min-h-screen sm:h-screen flex flex-col justify-between p-4 sm:p-10 md:p-14 overflow-hidden landscape-compact-hero"
      >
        {/* Background Visual Box with Clip Reveal */}
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-12 md:p-16 pointer-events-none">
          <figure
            ref={imageFrameRef}
            className="relative w-full max-w-4xl h-[55vh] sm:h-[78vh] overflow-hidden bg-(--color-surface-sand) border border-(--color-border) shadow-xl"
          >
            <img
              ref={imageRef}
              src="/assets/hero-bottles.jpg"
              alt="Anatomy of MUSE enhanced water bottles"
              className="w-full h-full object-cover object-center will-change-transform"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-(--color-ink)/20 pointer-events-none" />
          </figure>
        </div>

        {/* Top Header */}
        <header
          ref={headlineRef}
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 will-change-transform pt-12 sm:pt-0"
        >
          <div>
            <span className="inline-block text-[10px] sm:text-xs font-body font-bold tracking-widest text-(--color-coral) uppercase mb-1 sm:mb-2">
              [ANALYSIS // SPECIFICATION]
            </span>
            <h2 className="font-display text-2xl sm:text-5xl font-black uppercase tracking-tight text-(--color-ink)">
              Anatomy of the Bottle
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] sm:text-xs font-body text-(--color-ink-muted) uppercase tracking-wider block">
              Formulation 03
            </span>
            <span className="text-xs sm:text-sm font-bold text-(--color-ink) uppercase">
              16.9 FL OZ (500ML)
            </span>
          </div>
        </header>

        {/* Mid-level Technical Annotation Cards */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-6 pointer-events-none my-2 sm:my-0">
          {/* Card 1 */}
          <div
            ref={callout1Ref}
            className="p-3 sm:p-5 bg-(--color-surface)/95 backdrop-blur-xs border border-(--color-border) shadow-md pointer-events-auto will-change-transform"
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="font-body text-xs font-bold text-(--color-coral)">
                01
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-(--color-ink)">
                Spring Base
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-(--color-ink-muted) leading-normal sm:leading-relaxed">
              Filtered through geologic limestone beds for crisp mineral purity and natural 7.4 pH alkalinity.
            </p>
          </div>

          {/* Card 2 */}
          <div
            ref={callout2Ref}
            className="p-3 sm:p-5 bg-(--color-surface)/95 backdrop-blur-xs border border-(--color-border) shadow-md pointer-events-auto will-change-transform md:translate-y-8"
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="font-body text-xs font-bold text-(--color-coral)">
                02
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-(--color-ink)">
                Real Puree Infusion
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-(--color-ink-muted) leading-normal sm:leading-relaxed">
              Whole organic fruits gently cold-extracted into cloud-free essence with zero added sweeteners.
            </p>
          </div>

          {/* Card 3 */}
          <div
            ref={callout3Ref}
            className="p-3 sm:p-5 bg-(--color-surface)/95 backdrop-blur-xs border border-(--color-border) shadow-md pointer-events-auto will-change-transform"
          >
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="font-body text-xs font-bold text-(--color-coral)">
                03
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-(--color-ink)">
                Ionic Electrolytes
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-(--color-ink-muted) leading-normal sm:leading-relaxed">
              Precision blend of sodium, potassium, and magnesium to balance hydration at the cellular layer.
            </p>
          </div>
        </div>

        {/* Bottom Pinned Footer Info */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs font-body text-(--color-ink-muted) uppercase pt-1">
          <span>Certified USDA Organic</span>
          <span>15 Calories Total</span>
        </div>
      </div>
    </section>
  )
}
