import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const STORY_MILESTONES = [
  {
    year: '2018',
    title: 'The Generational Grove',
    tag: 'Foundation',
    desc: 'Founded in our family’s generational citrus groves with a singular conviction: fruit should never be boiled, pasteurized with heat, or adulterated with artificial sweeteners.',
    accentColor: '#F59E0B', // Amber
    image: '/assets/timeline-1.png',
    alt: 'Fresh organic citrus harvest',
  },
  {
    year: '2020',
    title: 'Zero Thermal Extraction',
    tag: 'Proprietary Press',
    desc: 'Traditional juicing destroys nutrients through heat. We pioneered a proprietary cold-centrifuge extraction method that operates entirely below 4°C, preserving 100% of the raw vitamins, enzymes, and delicate flavor profiles.',
    accentColor: '#10B981', // Emerald
    image: '/assets/timeline-2.png',
    alt: 'Cold micro-pressure extraction',
    imgClass: 'scale-125 sm:scale-150',
  },
  {
    year: '2022',
    title: 'Certified Cellular Hydration',
    tag: 'Electrolyte Matrix',
    desc: "We weren't just making juice; we were making functional hydration. By infusing ionic rock salts and pure young coconut water, we created a cellular-level hydration matrix that standard juices couldn't match.",
    accentColor: '#EF4444', // Red
    image: '/assets/timeline-3.png',
    alt: 'Cellular hydration matrix',
    imgClass: 'scale-125 sm:scale-150',
  },
  {
    year: '2024',
    title: 'Unbroken Cold-Chain',
    tag: 'Express Delivery',
    desc: 'Expanded our temperature-controlled cold-chain logistics across metropolitan hubs. Juiced at dawn, nitrogen chilled, and delivered directly within 24 to 48 hours.',
    accentColor: '#3B82F6', // Blue
    image: '/assets/timeline-4.png',
    alt: 'Cold-chain dispatch fleet',
    imgClass: 'scale-125 sm:scale-150',
  },
  {
    year: '2026',
    title: 'The 4 Signature Editions',
    tag: 'Present Day',
    desc: 'Today, we offer four uncompromising flavors. No shortcuts. No pasteurization. Just pure, living vitality. We’ve proven that convenience doesn’t have to compromise cellular health.',
    accentColor: '#EA580C', // Orange
    image: '/assets/timeline-5.png',
    alt: 'Clean Juice iconic lineup',
    imgClass: 'scale-110 sm:scale-125',
  },
]

export default function About() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const imagesRef = useRef([])
  const titleRefs = useRef([])

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      // Header entrance (Clip-path reveal)
      gsap.fromTo(
        headerRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 50 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      )

      cardsRef.current.forEach((card, i) => {
        if (!card) return

        // 1. Clip-path wipe reveal for the images when they enter
        const img = imagesRef.current[i]
        if (img) {
          gsap.fromTo(
            img,
            { clipPath: 'inset(100% 0 0 0)', scale: 1.3, opacity: 0 },
            {
              clipPath: 'inset(0% 0 0 0)',
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        // 2. Skew-on-scroll and Parallax for the content block inside the card
        const contentBlock = card.querySelector('.card-content')
        if (contentBlock) {
          // Skew velocity based
          let skewSetter = gsap.quickSetter(contentBlock, "skewY", "deg")
          let proxy = { skew: 0 }
          
          ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              // Get velocity and clamp it
              let skew = gsap.utils.clamp(-5, 5, self.getVelocity() / -150)
              
              // Only apply if the change is significant enough to avoid micro-jitters
              if (Math.abs(skew - proxy.skew) > 0.1) {
                proxy.skew = skew
                gsap.to(proxy, {
                  skew: 0,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: true,
                  onUpdate: () => skewSetter(proxy.skew)
                })
              }
            }
          })

          // Simple Parallax Y scrub
          gsap.fromTo(
            contentBlock,
            { y: 50 },
            {
              y: -30,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        }

        // 3. Sticky-Stack Cards: Scale and Blur effect when the next card covers this one
        if (i < cardsRef.current.length - 1) {
          const nextCard = cardsRef.current[i + 1]
          
          // As the next card scrolls up to cover the current pinned card,
          // the current card scales down, blurs, and fades.
          gsap.fromTo(
            card,
            { scale: 1, filter: 'blur(0px)', opacity: 1, y: 0 },
            {
              scale: 0.92,
              filter: 'blur(8px)',
              opacity: 0.3,
              y: -20, // push slightly up for 3D depth
              ease: 'none',
              scrollTrigger: {
                trigger: nextCard,
                start: 'top 80%',       // when the next card starts entering the viewport
                end: 'top 20%',         // when the next card is near its sticky position
                scrub: true,
              },
            }
          )
        }
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#FAF5EA] text-neutral-900 py-24 sm:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <header ref={headerRef} className="text-center max-w-3xl mx-auto mb-20 sm:mb-32">
          <div className="inline-flex items-center px-4 py-1.5 bg-neutral-900 border border-neutral-700 text-xs font-poppins font-semibold tracking-[0.2em] text-[#E5E5E5] uppercase mb-6 rounded-full">
            <span>Our Journey</span>
          </div>
          <h2 className="text-center font-display text-5xl sm:text-7xl lg:text-8xl font-black mb-16 sm:mb-24 text-neutral-900 drop-shadow-sm">
            Our Story
          </h2>
        </header>

        {/* Sticky Stacking Cards Container */}
        <div className="relative w-full flex flex-col gap-12 sm:gap-24 pb-32">
          {STORY_MILESTONES.map((milestone, idx) => {
            const isEven = idx % 2 === 0
            return (
              <div
                key={milestone.year}
                ref={(el) => (cardsRef.current[idx] = el)}
                // CSS Sticky is the magic here. It pins to top-20 automatically.
                className="sticky top-20 sm:top-28 w-full origin-top will-change-transform"
              >
                {/* The Card Body */}
                <div 
                  className="w-full min-h-[60vh] sm:h-[70vh] rounded-4xl sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 shadow-xl relative overflow-hidden bg-white border border-black/5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid rgba(0,0,0,0.04)`,
                    boxShadow: `0 20px 40px -15px rgba(0,0,0,0.05)`
                  }}
                >
                  {/* Subtle Accent Glow based on Milestone Color */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background: `radial-gradient(circle at ${isEven ? '0%' : '100%'} 50%, ${milestone.accentColor}, transparent 70%)`
                    }}
                  />

                  {/* Image Block */}
                  <div className={`w-full md:w-1/2 flex items-center justify-center relative z-10 ${!isEven ? 'md:order-2' : ''}`}>
                    <div className="relative w-full flex items-center justify-center">
                      <img 
                        ref={(el) => (imagesRef.current[idx] = el)}
                        src={milestone.image}
                        alt={milestone.alt}
                        className={`clip-image w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto object-contain drop-shadow-2xl will-change-transform ${milestone.imgClass || ''}`}
                      />
                    </div>
                  </div>

                  {/* Content Block with Skew and Parallax classes applied via GSAP */}
                  <div className={`card-content relative z-10 w-full md:w-1/2 flex flex-col justify-center will-change-transform ${!isEven ? 'md:order-1' : ''}`}>
                    
                    {/* Big Watermark Year */}
                    <div 
                      className="absolute -top-16 sm:-top-24 -left-4 sm:-left-10 font-asal text-[120px] sm:text-[180px] leading-none text-black/5 select-none pointer-events-none tracking-tight font-normal"
                    >
                      {milestone.year}
                    </div>

                    <div className="relative z-10">
                      {/* Eyebrow / Tag */}
                      <div className="flex items-center mb-4 sm:mb-6">
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 text-white text-[9px] sm:text-[10px] font-poppins font-semibold uppercase tracking-[0.25em] rounded-none">
                          {milestone.year} &mdash; {milestone.tag}
                        </span>
                      </div>
                      
                      <h3 
                        ref={(el) => (titleRefs.current[idx] = el)}
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 text-neutral-900 leading-[1.1]"
                      >
                        {milestone.title}
                      </h3>
                      
                      <p className="font-poppins text-base sm:text-lg text-neutral-600 leading-relaxed font-light max-w-lg">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
