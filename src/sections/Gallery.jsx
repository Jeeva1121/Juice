import { useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

const FLAVORS = [
  {
    id: 'orange',
    editionNum: '01',
    badgeText: 'Edition 01',
    origin: 'Valencia, Spain',
    title: 'Valencia Orange',
    subtitle: 'Sun-Ripened Citrus / Cold-Pressed With Essential Citrus Rind',
    tagColor: '#E03E26',
    bgColor: '#FAF5EA',
    accentGrad: 'from-orange-500/20 via-amber-500/10 to-transparent',
    ambientAura: 'radial-gradient(circle, rgba(224, 62, 38, 0.22) 0%, rgba(245, 166, 35, 0.12) 50%, transparent 70%)',
    image: '/assets/orange-can-hero.png',
    alt: 'Clean Juice cold-pressed organic orange juice bottle with spiral peel and orange slices',
    desc: 'Whole organic Valencia oranges gently cold-extracted into pure, cloud-free essence. Delivers bioavailable electrolytes that hydrate at the cellular level without glucose spikes or stevia bitterness.',
    stat1Numeric: 100,
    stat1Suffix: '%',
    stat1Label: 'Cold-Pressed Raw',
    stat2Numeric: 220,
    stat2Suffix: 'mg',
    stat2Label: 'Plant Electrolytes',
    stat3Numeric: 15,
    stat3Suffix: ' Cal',
    stat3Label: 'Zero Added Sugar',
    tasteNotes: ['Valencia Peel', 'Key Lime Zest', 'Mineral Salt'],
    extraction: 'Micro-pressure extraction, never heated or boiled',
    electrolytes: '220mg Potassium, 50mg Sodium, 15mg Magnesium',
    packs: {
      single: { name: 'Single 500ml Can', price: 350, display: '₹350' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 1200, display: '₹1,200', badge: 'Save ₹200' },
      '12-pack': { name: '12-Pack Orchard Case', price: 3400, display: '₹3,400', badge: 'Save ₹800' },
    },
    imgScale: 'scale-95 sm:scale-105 md:scale-110',
    splashDivider: '/assets/splash-border.png',
  },
  {
    id: 'strawberry',
    editionNum: '02',
    badgeText: 'Edition 02',
    origin: 'Huasna Valley, California',
    title: 'Wild Strawberry',
    subtitle: 'Harvested at Peak Dawn / Cold-Extracted With Organic Coconut Water',
    tagColor: '#D90429',
    bgColor: '#FAF0EE',
    accentGrad: 'from-rose-500/20 via-red-500/10 to-transparent',
    ambientAura: 'radial-gradient(circle, rgba(217, 4, 41, 0.22) 0%, rgba(255, 107, 107, 0.12) 50%, transparent 70%)',
    image: '/assets/straw-can-hero.png',
    alt: 'Clean Juice cold-pressed organic strawberry juice bottle with fresh strawberries',
    desc: 'Slow cold-pressed ruby strawberries blended with pure organic young coconut water and key lime essence. Unpasteurized, light, thirst-quenching, and completely free of artificial cane sugar or synthetic sweeteners.',
    stat1Numeric: 100,
    stat1Suffix: '%',
    stat1Label: 'Cold-Pressed Raw',
    stat2Numeric: 240,
    stat2Suffix: 'mg',
    stat2Label: 'Plant Electrolytes',
    stat3Numeric: 15,
    stat3Suffix: ' Cal',
    stat3Label: 'Zero Added Sugar',
    tasteNotes: ['Ruby Strawberry', 'Key Lime', 'Pink Rock Salt'],
    extraction: 'Low-shear centrifugation, zero heat degradation',
    electrolytes: '240mg Potassium, 45mg Sodium, 18mg Magnesium',
    packs: {
      single: { name: 'Single 500ml Can', price: 350, display: '₹350' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 1200, display: '₹1,200', badge: 'Save ₹200' },
      '12-pack': { name: '12-Pack Orchard Case', price: 3400, display: '₹3,400', badge: 'Save ₹800' },
    },
    imgScale: 'scale-90 sm:scale-100 md:scale-105',
    splashDivider: '/assets/splash-strawberry.png',
  },
  {
    id: 'cherry',
    editionNum: '03',
    badgeText: 'Edition 03',
    origin: 'Traverse Bay, Michigan',
    title: 'Black Cherry',
    subtitle: 'Montmorency Tart Cherries / Pure Cellular Recovery & Natural Melatonin',
    tagColor: '#9B111E',
    bgColor: '#F8EDF1',
    accentGrad: 'from-pink-900/20 via-rose-700/10 to-transparent',
    ambientAura: 'radial-gradient(circle, rgba(155, 17, 30, 0.24) 0%, rgba(110, 5, 20, 0.12) 50%, transparent 70%)',
    image: '/assets/cherry-can-hero.png',
    alt: 'Clean Juice cold-pressed Black Cherry bottle with ruby splash and fresh orchard cherries',
    desc: 'Slow cold-extracted Montmorency tart and dark orchard cherries rich with natural phytonutrients, anthocyanin antioxidants, and organic electrolytes. Naturally aids cellular repair and restorative recovery with zero artificial sweeteners or concentrates.',
    stat1Numeric: 100,
    stat1Suffix: '%',
    stat1Label: 'Cold-Pressed Raw',
    stat2Numeric: 260,
    stat2Suffix: 'mg',
    stat2Label: 'Plant Electrolytes',
    stat3Numeric: 18,
    stat3Suffix: ' Cal',
    stat3Label: 'Zero Added Sugar',
    tasteNotes: ['Montmorency Tart', 'Sweet Dark Cherry', 'Sea Salt'],
    extraction: 'Cold-press maceration, preserves live polyphenols',
    electrolytes: '260mg Potassium, 40mg Sodium, 22mg Magnesium',
    packs: {
      single: { name: 'Single 500ml Can', price: 350, display: '₹350' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 1200, display: '₹1,200', badge: 'Save ₹200' },
      '12-pack': { name: '12-Pack Orchard Case', price: 3400, display: '₹3,400', badge: 'Save ₹800' },
    },
    imgScale: 'scale-90 sm:scale-100 md:scale-105',
    splashDivider: '/assets/splash-cherry.png',
  },
  {
    id: 'lemon',
    editionNum: '04',
    badgeText: 'Edition 04',
    origin: 'Amalfi Coast, Italy',
    title: 'Zesty Lemon',
    subtitle: 'Bright Citrus Vitality / Sun-Ripened Organic Lemons & Bergamot',
    tagColor: '#65A30D',
    bgColor: '#F4FAEA',
    accentGrad: 'from-lime-500/20 via-green-500/10 to-transparent',
    ambientAura: 'radial-gradient(circle, rgba(101, 163, 13, 0.22) 0%, rgba(132, 204, 22, 0.12) 50%, transparent 70%)',
    image: '/assets/lemon-can-hero.png',
    alt: 'Zesty 100% natural cold-pressed lemon juice can with fresh lemon slices and pure water splash',
    desc: 'Sun-ripened organic lemons cold-extracted with their essential aromatic rinds to deliver an invigorating burst of natural vitamin C and cellular hydration. Crisp, zesty, and instantly revitalizing with zero added cane sugar.',
    stat1Numeric: 100,
    stat1Suffix: '%',
    stat1Label: 'Cold-Pressed Raw',
    stat2Numeric: 240,
    stat2Suffix: 'mg',
    stat2Label: 'Plant Electrolytes',
    stat3Numeric: 15,
    stat3Suffix: ' Cal',
    stat3Label: 'Zero Added Sugar',
    tasteNotes: ['Amalfi Lemon', 'Bergamot Zest', 'Himalayan Salt'],
    extraction: 'Rind-infused cold-press, bioavailable Vitamin C',
    electrolytes: '240mg Potassium, 55mg Sodium, 22mg Magnesium',
    packs: {
      single: { name: 'Single 500ml Can', price: 350, display: '₹350' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 1200, display: '₹1,200', badge: 'Save ₹200' },
      '12-pack': { name: '12-Pack Orchard Case', price: 3400, display: '₹3,400', badge: 'Save ₹800' },
    },
    imgScale: 'scale-90 sm:scale-100 md:scale-105',
    splashDivider: '/assets/splash-lemon.png',
  },
]

export default function Gallery() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const titleRef = useRef(null)
  const introRef = useRef(null)

  const sectionRefs = useRef([])
  const imgRefs = useRef([])
  const bottleWrapRefs = useRef([])
  const ghostNumRefs = useRef([])
  const auraRefs = useRef([])

  const { addToCart } = useCart()

  // Selected pack state for each flavor
  const [selectedPacks, setSelectedPacks] = useState({
    orange: 'single',
    strawberry: '4-pack',
    cherry: 'single',
    lemon: 'single',
  })


  const handlePackChange = (flavorId, packKey) => {
    setSelectedPacks((prev) => ({ ...prev, [flavorId]: packKey }))
    // Animate price change with GSAP
    const priceEl = document.querySelector(`#price-${flavorId}`)
    if (priceEl) {
      gsap.fromTo(priceEl, { scale: 0.8, opacity: 0.5, y: -6 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)' })
    }
  }

  const handleAddToCartClick = (flavor, index) => {
    const packKey = selectedPacks[flavor.id] || 'single'
    addToCart(flavor, packKey, 1)

    // GSAP Can Pop Bounce Animation
    const img = imgRefs.current[index]
    if (img) {
      gsap.timeline()
        .to(img, { scale: 1.15, y: -18, duration: 0.18, ease: 'power2.out' })
        .to(img, { scale: 1, y: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' })
    }
  }

  // 3D Mouse Magnetic Tilt on Cans
  const handleMouseMove = (e, index) => {
    const wrap = bottleWrapRefs.current[index]
    const img = imgRefs.current[index]
    if (!wrap || !img) return

    const rect = wrap.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(img, {
      rotateY: x * 24,
      rotateX: -y * 20,
      translateZ: 40,
      x: x * 18,
      y: y * 18,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1000,
    })
  }

  const handleMouseLeave = (index) => {
    const img = imgRefs.current[index]
    if (!img) return

    gsap.to(img, {
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      x: 0,
      y: 0,
      duration: 0.85,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      // 1. Header Entrance with Stagger
      gsap.fromTo(
        [titleRef.current, introRef.current],
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: 'power3.out',
          duration: 0.9,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // 2. High-Impact ScrollTrigger & Idle Motions per Flavor
      FLAVORS.forEach((flavor, index) => {
        const section = sectionRefs.current[index]
        if (!section) return

        const img = imgRefs.current[index]
        const ghost = ghostNumRefs.current[index]
        const aura = auraRefs.current[index]
        const isEven = index % 2 === 0

        // A. Continuous Idle Floating Breathing Loop on Can
        if (img) {
          gsap.to(img, {
            y: isEven ? -10 : 10,
            rotation: isEven ? 2 : -2,
            duration: 3.2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }

        // B. Giant Edition Ghost Numeral Parallax Scrub
        if (ghost) {
          gsap.fromTo(
            ghost,
            { xPercent: isEven ? -20 : 20, yPercent: -15, opacity: 0.02 },
            {
              xPercent: isEven ? 20 : -20,
              yPercent: 15,
              opacity: 0.05,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            }
          )
        }

        // C. Ambient Pulsing Aura Scrub
        if (aura) {
          gsap.fromTo(
            aura,
            { scale: 0.75, opacity: 0.4 },
            {
              scale: 1.25,
              opacity: 0.85,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'center 40%',
                scrub: 1,
              },
            }
          )
        }

        // D. 3D Can Elevation & Scroll Scrub
        if (img) {
          gsap.fromTo(
            img,
            { scale: 0.9, opacity: 0.2 },
            {
              scale: 1.05,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'center 45%',
                scrub: 1.2,
              },
            }
          )
        }

        // E. Animated Live Stat Number Counters (0 -> actual value)
        const statEls = section.querySelectorAll('.stat-counter-val')
        statEls.forEach((statEl) => {
          const targetNum = parseFloat(statEl.getAttribute('data-val') || '0')
          const suffix = statEl.getAttribute('data-suffix') || ''

          const counterObj = { value: 0 }
          gsap.to(counterObj, {
            value: targetNum,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statEl,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              statEl.textContent = `${Math.round(counterObj.value)}${suffix}`
            },
          })
        })

        // F. 3D Flip Stagger for Tasting Notes Pills
        const pills = section.querySelectorAll('.taste-pill-anim')
        if (pills.length > 0) {
          gsap.fromTo(
            pills,
            { opacity: 0, y: 20, rotateX: 60 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'back.out(1.8)',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        // G. Content Section Fade & Slide Glide
        const contentEls = section.querySelectorAll('.flavor-content-block')
        if (contentEls.length > 0) {
          gsap.fromTo(
            contentEls,
            { opacity: 0, x: isEven ? 35 : -35 },
            {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        // H. Splash Divider Parallax Wave
        const splashImg = section.querySelector('.splash-divider-anim')
        if (splashImg) {
          gsap.fromTo(
            splashImg,
            { yPercent: -15, scale: 1.05 },
            {
              yPercent: 15,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'bottom 100%',
                end: 'bottom 0%',
                scrub: 1.5,
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
      id="flavors"
      ref={containerRef}
      className="relative w-full bg-[#FAF5EA] py-16 sm:py-36 overflow-hidden border-t border-[#E8DEC8]"
    >

      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 md:px-12">
        {/* Section Header */}
        <header ref={headerRef} className="mb-16 sm:mb-24">
          <div className="inline-flex items-center px-3 py-1 bg-white/80 border border-neutral-300 text-xs font-bold tracking-wider text-neutral-700 uppercase mb-4 shadow-2xs">
            <span>The Botanical Lineup // 4 Single-Origin Editions</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E8DEC8] pb-8">
            <div>
              <h2
                ref={titleRef}
                className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-neutral-900 tracking-tight"
              >
                Our Flavors
              </h2>
              <p className="text-base sm:text-xl text-neutral-500 font-medium mt-2">
                Pure single-origin fruit essence, cold-extracted with organic ionic electrolytes.
              </p>
            </div>
            <p
              ref={introRef}
              className="max-w-md text-sm sm:text-base text-neutral-600 leading-relaxed font-normal"
            >
              Crafted in daily limited batches. Every can is unheated, raw, and delivered chilled directly to preserve live active enzymes and restorative cellular hydration.
            </p>
          </div>
        </header>

        {/* Flavors Showcase Articles */}
        <div className="flex flex-col gap-28 sm:gap-40">
          {FLAVORS.map((flavor, index) => {
            const isEven = index % 2 === 0
            const currentPackKey = selectedPacks[flavor.id] || 'single'
            const currentPack = flavor.packs[currentPackKey]

            return (
              <article
                id={`flavor-${flavor.id}`}
                key={flavor.id}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="relative min-h-[75vh] flex flex-col justify-center select-none py-12 sm:py-20"
              >
                {/* Giant Ghost Numeral for Parallax Depth */}
                <div
                  ref={(el) => (ghostNumRefs.current[index] = el)}
                  className="ghost-number absolute select-none pointer-events-none font-display font-black text-[24vw] sm:text-[22vw] lg:text-[20vw] text-neutral-900/5 leading-none tracking-tighter will-change-transform z-0"
                  style={{
                    [isEven ? 'left' : 'right']: '2%',
                    top: '5%',
                  }}
                  aria-hidden="true"
                >
                  {flavor.editionNum}
                </div>

                {/* Ambient Soft Organic Glow */}
                <div
                  ref={(el) => (auraRefs.current[index] = el)}
                  className="absolute w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full blur-3xl pointer-events-none opacity-80 -z-10 will-change-transform"
                  style={{
                    background: flavor.ambientAura,
                    left: isEven ? '5%' : '45%',
                    top: '15%',
                  }}
                  aria-hidden="true"
                />

                {/* Main Grid: Alternating Layout */}
                <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* 3D Interactive Can Column */}
                  <div
                    className={`lg:col-span-5 flex items-center justify-center relative ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div
                      ref={(el) => (bottleWrapRefs.current[index] = el)}
                      onMouseMove={(e) => handleMouseMove(e, index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-[45vh] sm:h-[55vh] md:h-[68vh] max-h-[520px] flex items-center justify-center cursor-grab perspective-1000"
                    >
                      <img
                        ref={(el) => (imgRefs.current[index] = el)}
                        src={flavor.image}
                        alt={flavor.alt}
                        className={`w-full h-full object-contain object-center will-change-transform drop-shadow-[0_28px_44px_rgba(0,0,0,0.2)] transition-transform duration-300 ${flavor.imgScale}`}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Content & Ordering Column */}
                  <div
                    className={`lg:col-span-7 flex flex-col justify-center flavor-content-block ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    {/* Top Metadata Row: Clean Product Badge & Origin */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span
                          className="px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white shadow-2xs"
                          style={{ backgroundColor: flavor.tagColor }}
                        >
                          {flavor.badgeText}
                        </span>
                        <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-neutral-500">
                          {flavor.origin}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-neutral-600 bg-white/80 px-2 py-0.5 border border-neutral-200">
                        Cold-Chain Dispatch
                      </span>
                    </div>

                    {/* Flavor Title & Subtitle */}
                    <div className="mt-4 sm:mt-5">
                      <h3 className="font-display text-2xl sm:text-5xl md:text-6xl font-black text-neutral-900 tracking-tight leading-tight">
                        {flavor.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm font-medium uppercase tracking-widest text-neutral-500 mt-1.5">
                        {flavor.subtitle}
                      </p>
                    </div>

                    {/* Narrative Description */}
                    <p className="mt-3 sm:mt-4 text-xs sm:text-base text-neutral-600 leading-relaxed font-normal">
                      {flavor.desc}
                    </p>

                    {/* Tasting Notes Tag Cloud (Staggered 3D Flip) */}
                    <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-neutral-400 mr-1">
                        Flavor Notes:
                      </span>
                      {flavor.tasteNotes.map((note) => (
                        <span
                          key={note}
                          className="taste-pill-anim px-2.5 py-1 bg-white/90 border border-neutral-300 text-[10px] sm:text-xs font-medium text-neutral-800 uppercase tracking-wide shadow-2xs"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Live Animated Nutritional & Electrolyte Metric Counters */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-5 bg-white/90 border border-neutral-200 shadow-xs">
                      <div>
                        <span
                          className="stat-counter-val font-display text-lg sm:text-3xl md:text-4xl font-black text-neutral-900 block"
                          data-val={flavor.stat1Numeric}
                          data-suffix={flavor.stat1Suffix}
                        >
                          0{flavor.stat1Suffix}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mt-0.5 sm:mt-1">
                          {flavor.stat1Label}
                        </span>
                      </div>
                      <div className="border-l border-neutral-200 pl-2 sm:pl-4">
                        <span
                          className="stat-counter-val font-display text-lg sm:text-3xl md:text-4xl font-black block"
                          style={{ color: flavor.tagColor }}
                          data-val={flavor.stat2Numeric}
                          data-suffix={flavor.stat2Suffix}
                        >
                          0{flavor.stat2Suffix}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mt-0.5 sm:mt-1">
                          {flavor.stat2Label}
                        </span>
                      </div>
                      <div className="border-l border-neutral-200 pl-2 sm:pl-4">
                        <span
                          className="stat-counter-val font-display text-lg sm:text-3xl md:text-4xl font-black text-neutral-900 block"
                          data-val={flavor.stat3Numeric}
                          data-suffix={flavor.stat3Suffix}
                        >
                          0{flavor.stat3Suffix}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-medium text-neutral-500 uppercase tracking-wider block mt-0.5 sm:mt-1">
                          {flavor.stat3Label}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Pack Selector (Single / 4-Pack / 12-Pack) */}
                    <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-[#FAF2E3]/70 border border-[#E8DEC8]">
                      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-neutral-600 block mb-2 sm:mb-3">
                        Select Harvest Packaging:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {Object.entries(flavor.packs).map(([key, pack]) => {
                          const isSelected = currentPackKey === key
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handlePackChange(flavor.id, key)}
                              className={`p-2 sm:p-2.5 min-h-[44px] border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs relative ${
                                isSelected
                                  ? 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-neutral-900/20'
                                  : 'bg-white text-neutral-800 border-[#E8DEC8] hover:border-neutral-400'
                              }`}
                            >
                              {pack.badge && (
                                <span className="absolute -top-2 right-1 sm:right-2 px-1 py-0.5 bg-(--color-coral) text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-2xs shadow-xs">
                                  {pack.badge}
                                </span>
                              )}
                              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider truncate">
                                {key === 'single' ? '1 Can' : key === '4-pack' ? '4-Pack' : '12-Case'}
                              </span>
                              <span className={`text-[11px] sm:text-xs font-bold mt-0.5 sm:mt-1 ${isSelected ? 'text-(--color-coral)' : 'text-neutral-900'}`}>
                                {pack.display}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Bottom CTA Row: Animated Price Display + Direct "Add to Harvest Bag" Button */}
                    <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div>
                        <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">
                          Total Price ({currentPack.name})
                        </span>
                        <span
                          id={`price-${flavor.id}`}
                          className="font-display text-2xl sm:text-4xl font-black text-neutral-900"
                        >
                          {currentPack.display}
                        </span>
                      </div>

                      <div className="flex items-center w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleAddToCartClick(flavor, index)}
                          className="touch-target-44 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-(--color-ink) hover:bg-(--color-coral) text-(--color-surface) text-xs font-medium uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 shadow-md active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>Add to Harvest Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fluid Splash Divider (Appears between items) */}
                {index !== FLAVORS.length - 1 && (
                  <div className="absolute -bottom-16 sm:-bottom-24 left-1/2 -translate-x-1/2 w-screen pointer-events-none flex justify-center z-20 translate-y-1/2">
                    <img 
                      src={flavor.splashDivider} 
                      alt={`${flavor.title} Splash Divider`} 
                      className="splash-divider-anim w-full h-32 sm:h-48 md:h-64 object-cover object-center opacity-95 mix-blend-multiply"
                    />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>

      {/* 4. Final Final Lemon Splash Divider */}
      <div
        ref={finalDividerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen z-20 pointer-events-none select-none translate-y-1 sm:translate-y-2 overflow-hidden"
      >
        <img 
          src={FLAVORS[FLAVORS.length - 1].splashDivider} 
          alt="Final Splash Divider" 
          className="splash-divider-anim w-full h-32 sm:h-48 md:h-64 object-cover object-bottom opacity-95 mix-blend-multiply"
        />
      </div>
    </section>
  )
}
