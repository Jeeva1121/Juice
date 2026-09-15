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
    imgClass: 'scale-110',
  },
  {
    year: '2020',
    title: 'Zero Thermal Extraction',
    tag: 'Proprietary Press',
    desc: 'Traditional juicing destroys nutrients through heat. We pioneered a proprietary cold-centrifuge extraction method that operates entirely below 4°C, preserving 100% of the raw vitamins, enzymes, and delicate flavor profiles.',
    accentColor: '#10B981', // Emerald
    image: '/assets/timeline-2.png',
    alt: 'Cold micro-pressure extraction',
    imgClass: 'scale-110 sm:scale-125',
  },
  {
    year: '2022',
    title: 'Certified Cellular Hydration',
    tag: 'Electrolyte Matrix',
    desc: "We weren't just making juice; we were making functional hydration. By infusing ionic rock salts and pure young coconut water, we created a cellular-level hydration matrix that standard juices couldn't match.",
    accentColor: '#EF4444', // Red
    image: '/assets/timeline-3.png',
    alt: 'Cellular hydration matrix',
    imgClass: 'scale-110 sm:scale-125',
  },
  {
    year: '2024',
    title: 'Unbroken Cold-Chain',
    tag: 'Express Delivery',
    desc: 'Expanded our temperature-controlled cold-chain logistics across metropolitan hubs. Juiced at dawn, nitrogen chilled, and delivered directly within 24 to 48 hours.',
    accentColor: '#3B82F6', // Blue
    image: '/assets/timeline-4.png',
    alt: 'Cold-chain dispatch fleet',
    imgClass: 'scale-110 sm:scale-125',
  },
  {
    year: '2026',
    title: 'The 4 Signature Editions',
    tag: 'Present Day',
    desc: 'Today, we offer four uncompromising flavors. No shortcuts. No pasteurization. Just pure, living vitality. We’ve proven that convenience doesn’t have to compromise cellular health.',
    accentColor: '#EA580C', // Orange
    image: '/assets/timeline-5.png',
    alt: 'Clean Juice iconic lineup',
    imgClass: 'scale-100 sm:scale-110',
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

        const contentBlock = card.querySelector('.card-content')
        const imgBlock = card.querySelector('.img-block-3d')
        
        // Single flattened 3D layer for performance
        gsap.set(card, { force3D: true })

        const isEven = i % 2 === 0;

        // Entrance: scrub into view until fully visible
        gsap.fromTo(card, 
          { rotationX: 18, rotationY: isEven ? -6 : 6, z: -150, opacity: 0 },
          { 
            rotationX: 0, rotationY: 0, z: 0, opacity: 1, ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 35%", // Finishes animating when top of card reaches upper third
              scrub: 1,
            }
          }
        );

        // Exit: scrub out of view when scrolling past
        gsap.fromTo(card, 
          { rotationX: 0, rotationY: 0, z: 0, opacity: 1 },
          { 
            rotationX: -18, rotationY: isEven ? 6 : -6, z: -150, opacity: 0, ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "bottom 65%", // Starts animating when bottom of card leaves lower third
              end: "bottom 5%",
              scrub: 1,
            }
          }
        );
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-neutral-950 text-white py-16 sm:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 relative z-10">
        {/* Section Header */}
        <header ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 sm:mb-28">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/5 border border-white/10 text-xs font-poppins font-semibold tracking-[0.2em] text-white uppercase mb-4 sm:mb-6 rounded-full">
            <span>Our Journey</span>
          </div>
          <h2 className="text-center font-display text-4xl sm:text-6xl lg:text-8xl font-black mb-10 sm:mb-20 text-white drop-shadow-sm">
            Our Story
          </h2>
        </header>

        {/* 3D Scrolling Cards Container */}
        <div className="relative w-full flex flex-col gap-16 sm:gap-32 pb-24 sm:pb-32" style={{ perspective: '1200px' }}>
          {STORY_MILESTONES.map((milestone, idx) => {
            const isEven = idx % 2 === 0
            return (
              <div
                key={milestone.year}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="w-full origin-center will-change-transform"
              >
                {/* The Card Body */}
                <div 
                  className="w-full min-h-[520px] sm:min-h-[65vh] md:h-[75vh] rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 lg:p-16 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 sm:gap-10 md:gap-16 shadow-2xl relative overflow-hidden border border-white/5"
                  style={{
                    backgroundColor: '#000000',
                    boxShadow: `0 20px 40px -15px rgba(0,0,0,0.8)`
                  }}
                >

                  {/* Image Block */}
                  <div className={`img-block-3d w-full md:w-1/2 flex items-center justify-center relative z-10 ${!isEven ? 'md:order-2' : ''}`}>
                    <div className="relative w-full flex items-center justify-center">
                      <img 
                        ref={(el) => (imagesRef.current[idx] = el)}
                        src={milestone.image}
                        alt={milestone.alt}
                        className={`w-full max-w-[280px] sm:max-w-md lg:max-w-lg h-auto object-contain will-change-transform ${milestone.imgClass || 'scale-110'}`}
                      />
                    </div>
                  </div>

                  {/* Content Block with Skew and Parallax classes applied via GSAP */}
                  <div className={`card-content relative z-10 w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left will-change-transform ${!isEven ? 'md:order-1' : ''}`}>
                    
                    {/* Big Watermark Year */}
                    <div 
                      className="absolute -top-6 sm:-top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-10 font-asal text-[90px] sm:text-[140px] md:text-[180px] leading-none text-white/5 select-none pointer-events-none tracking-tight font-normal"
                    >
                      {milestone.year}
                    </div>

                    <div className="relative z-10 w-full flex flex-col items-center md:items-start">
                      {/* Eyebrow / Tag */}
                      <div className="flex items-center justify-center md:justify-start mb-4 sm:mb-6">
                        <span className="px-4 sm:px-5 py-1.5 sm:py-2 bg-white text-black text-[10px] sm:text-[11px] font-poppins font-semibold uppercase tracking-[0.25em] rounded-none">
                          {milestone.year} &mdash; {milestone.tag}
                        </span>
                      </div>
                      
                      <h3 
                        ref={(el) => (titleRefs.current[idx] = el)}
                        className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 text-white leading-[1.1]"
                      >
                        {milestone.title}
                      </h3>
                      
                      <p className="font-poppins text-[13px] sm:text-base md:text-lg text-neutral-400 leading-relaxed font-light max-w-lg mx-auto md:mx-0">
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
