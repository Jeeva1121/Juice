import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Footer({ onScrollTop }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const textColRef = useRef(null)
  const fruitBannerRef = useRef(null)
  const fruitImgRef = useRef(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) return

      // Title & Text entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        textColRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textColRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Wide Fruit Parade Banner Entrance & Parallax Scrub
      if (fruitBannerRef.current && fruitImgRef.current) {
        // Entrance spring
        gsap.fromTo(
          fruitBannerRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: fruitBannerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Parallax depth scrub as you scroll through the footer
        gsap.fromTo(
          fruitImgRef.current,
          { yPercent: 12, scale: 1.05 },
          {
            yPercent: -8,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: fruitBannerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        )
      }
    },
    { scope: containerRef }
  )

  const handleBackToTop = (e) => {
    e.preventDefault()
    if (onScrollTop) {
      onScrollTop()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer
      id="footer"
      ref={containerRef}
      className="relative w-full bg-[#141210] text-(--color-surface) pt-16 sm:pt-32 pb-[calc(var(--sab)+2.5rem)] overflow-hidden border-t border-[#292524]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Header Row with Back to Top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 sm:pb-8 mb-8 sm:mb-12 border-b border-neutral-800">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[11px] sm:text-xs font-body font-normal tracking-wider text-(--color-coral) uppercase">
            <span>CLEAN JUICE • PRIVATE HARVEST DISPATCH</span>
          </div>
          <button
            type="button"
            onClick={handleBackToTop}
            className="touch-target-44 px-5 py-2.5 bg-neutral-900 hover:bg-(--color-coral) text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-800"
          >
            Back to Top &uarr;
          </button>
        </div>

        {/* Huge Typographic Headline with Blackbold Font */}
        <div className="pb-12 sm:pb-16 mb-8 sm:mb-12">
          <h2
            ref={titleRef}
            className="font-blackbold text-3xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.95] text-(--color-surface) mb-6 sm:mb-8 will-change-transform"
          >
            Hydrate With <br />
            <span className="text-(--color-coral)">Intention.</span>
          </h2>

          <div
            ref={textColRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start justify-between"
          >
            <p className="lg:col-span-6 text-sm sm:text-lg text-(--color-ink-muted) leading-relaxed font-normal max-w-lg">
              Clean Juice is cold-pressed from single-origin organic orchards and delivered direct to your doorstep in temperature-controlled, recyclable chilled cartons.
            </p>

            {/* Newsletter Dispatch Signup with Square Button */}
            <div className="lg:col-span-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Thank you for subscribing to Clean Juice Private Harvest Releases.')
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL FOR PRIVATE DROPS"
                  className="flex-1 px-4 py-3.5 bg-neutral-900 border border-neutral-800 text-xs font-body text-neutral-100 outline-none focus:ring-1 focus:ring-neutral-400 min-h-[44px]"
                />
                <button
                  type="submit"
                  className="touch-target-44 px-8 py-3.5 bg-(--color-coral) hover:bg-(--color-coral-dark) text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-none shadow-sm"
                >
                  Join Roster
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Wide Panoramic Fruit & Can Parade Banner (Replaces Stockists & Text Grid) */}
        <div
          ref={fruitBannerRef}
          className="relative w-full overflow-hidden my-8 sm:my-12 pt-4 sm:pt-8 pb-4 will-change-transform"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] rounded-full blur-3xl pointer-events-none opacity-20 -z-10"
            style={{
              background: 'radial-gradient(ellipse, rgba(245, 166, 35, 0.45) 0%, rgba(224, 62, 38, 0.25) 50%, transparent 80%)',
            }}
          />

          <figure className="relative w-full flex items-center justify-center">
            <img
              ref={fruitImgRef}
              src="/assets/footer-fruit-parade.png"
              alt="Clean Juice full panoramic showcase of fresh tropical fruit splashes, cold-pressed cans, and vibrant botanical slices"
              className="w-full max-w-6xl h-auto object-contain object-center drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] will-change-transform transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
          </figure>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-(--color-ink-subtle) text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} CLEAN JUICE CO. 100% ORGANIC RAW COLD-PRESSED. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="touch-target-44 py-1.5 hover:text-(--color-surface) transition-colors">
              Privacy Protocol
            </a>
            <a href="#" className="touch-target-44 py-1.5 hover:text-(--color-surface) transition-colors">
              Terms of Supply
            </a>
            <a href="#" className="touch-target-44 py-1.5 hover:text-(--color-surface) transition-colors">
              Cold-Chain Guarantee
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
