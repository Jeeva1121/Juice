import React, { useState, useRef } from 'react'
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
    tagColor: '#000000',
    bgColor: '#FF5722',
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
      single: { name: 'Single 500ml Can', price: 99, display: '₹99' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 349, display: '₹349', badge: 'Save ₹47' },
      '12-pack': { name: '12-Pack Orchard Case', price: 899, display: '₹899', badge: 'Save ₹289' },
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
    tagColor: '#000000',
    bgColor: '#E53935',
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
      single: { name: 'Single 500ml Can', price: 99, display: '₹99' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 349, display: '₹349', badge: 'Save ₹47' },
      '12-pack': { name: '12-Pack Orchard Case', price: 899, display: '₹899', badge: 'Save ₹289' },
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
    tagColor: '#000000',
    bgColor: '#9B111E',
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
      single: { name: 'Single 500ml Can', price: 99, display: '₹99' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 349, display: '₹349', badge: 'Save ₹47' },
      '12-pack': { name: '12-Pack Orchard Case', price: 899, display: '₹899', badge: 'Save ₹289' },
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
    tagColor: '#000000',
    bgColor: '#CDDC39',
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
      single: { name: 'Single 500ml Can', price: 99, display: '₹99' },
      '4-pack': { name: '4-Pack Discovery Bundle', price: 349, display: '₹349', badge: 'Save ₹47' },
      '12-pack': { name: '12-Pack Orchard Case', price: 899, display: '₹899', badge: 'Save ₹289' },
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
  const floatWrapRefs = useRef([])
  const bottleWrapRefs = useRef([])
  const ghostNumRefs = useRef([])

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
      rotateY: x * 18,
      rotateX: -y * 14,
      duration: 0.25,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleMouseLeave = (index) => {
    const img = imgRefs.current[index]
    if (!img) return

    gsap.to(img, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power2.out',
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

        const ghost = ghostNumRefs.current[index]
        const isEven = index % 2 === 0

        // A. Continuous Gentle Idle Floating Breathing Loop on dedicated float wrapper
        const floatEl = floatWrapRefs.current[index]
        if (floatEl) {
          gsap.to(floatEl, {
            y: isEven ? -10 : 10,
            rotation: isEven ? 1.5 : -1.5,
            duration: 3.2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }

        // B. Giant Edition Ghost Numeral Parallax Scrub (Pure GPU transform, no opacity scrub)
        if (ghost) {
          gsap.fromTo(
            ghost,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          )
        }

        // C. Clean Can Entrance Animation (Hardware compositor accelerated, no wheel scrub)
        const wrap = bottleWrapRefs.current[index]
        if (wrap) {
          gsap.fromTo(
            wrap,
            { scale: 0.94, opacity: 0, y: 30 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
                onEnter: () => window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { isLight: flavor.id === 'lemon' } })),
                onEnterBack: () => window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { isLight: flavor.id === 'lemon' } })),
              },
            }
          )
        }

        // D. Animated Live Stat Number Counters (0 -> actual value)
        const statEls = section.querySelectorAll('.stat-counter-val')
        statEls.forEach((statEl) => {
          const targetNum = parseFloat(statEl.getAttribute('data-val') || '0')
          const suffix = statEl.getAttribute('data-suffix') || ''

          const counterObj = { value: 0 }
          gsap.to(counterObj, {
            value: targetNum,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statEl,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
            onUpdate: () => {
              statEl.textContent = `${Math.round(counterObj.value)}${suffix}`
            },
          })
        })

        // E. 3D Flip Stagger for Tasting Notes Pills
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

        // F. Kinetic Typography & Element Entrance (Compositor-accelerated, zero blur overhead)
        const badgeRow = section.querySelector('.flavor-badge-row')
        if (badgeRow) {
          gsap.fromTo(
            badgeRow,
            { opacity: 0, x: isEven ? -50 : 50, scale: 0.92 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        const titleWords = section.querySelectorAll('.flavor-title-word')
        if (titleWords.length > 0) {
          gsap.fromTo(
            titleWords,
            {
              yPercent: 100,
              rotateZ: isEven ? 4 : -4,
              opacity: 0,
            },
            {
              yPercent: 0,
              rotateZ: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        const subtitleEl = section.querySelector('.flavor-subtitle-text')
        if (subtitleEl) {
          gsap.fromTo(
            subtitleEl,
            { opacity: 0, y: 24, letterSpacing: '0.22em' },
            {
              opacity: 1,
              y: 0,
              letterSpacing: '0.12em',
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

        const descEl = section.querySelector('.flavor-desc-text')
        if (descEl) {
          gsap.fromTo(
            descEl,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
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
      className="relative w-full overflow-hidden border-t-0"
    >
      <div className="w-full bg-black pt-16 sm:pt-36 pb-12 sm:pb-24">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-8 md:px-12">
          {/* Section Header */}
          <header ref={headerRef}>
            <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-white border border-neutral-800 text-[9px] sm:text-xs font-bold tracking-wider text-black uppercase mb-4 shadow-2xs overflow-hidden">
              <span className="font-normal tracking-wide whitespace-nowrap">The Botanical Lineup / 4 Single-Origin Editions</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
              <div>
                <h2
                  ref={titleRef}
                  className="font-asul text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight"
                >
                  Our Flavors
                </h2>
                <p className="text-base sm:text-xl text-neutral-400 font-medium mt-2">
                  Pure single-origin fruit essence, cold-extracted with organic ionic electrolytes.
                </p>
              </div>
              <p
                ref={introRef}
                className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal"
              >
                Crafted in daily limited batches. Every can is unheated, raw, and delivered chilled directly to preserve live active enzymes and restorative cellular hydration.
              </p>
            </div>
          </header>
        </div>
      </div>

      {/* Flavors Showcase Articles (Full Bleed Sections) */}
      <div className="flex flex-col w-full">
        {FLAVORS.map((flavor, index) => {
          const isEven = index % 2 === 0
          const currentPackKey = selectedPacks[flavor.id] || 'single'
          const currentPack = flavor.packs[currentPackKey]

          return (
            <React.Fragment key={flavor.id}>
              <article
                id={`flavor-${flavor.id}`}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="relative min-h-[85vh] sm:min-h-screen flex flex-col justify-center select-none py-16 sm:py-24"
                style={{ backgroundColor: flavor.bgColor, zIndex: 10 - index }}
              >
                <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-8 md:px-12 h-full flex flex-col justify-center relative">
                  {/* Giant Ghost Numeral for Parallax Depth */}
                  <div
                    ref={(el) => (ghostNumRefs.current[index] = el)}
                    className="ghost-number absolute select-none pointer-events-none font-asul font-bold text-[24vw] sm:text-[22vw] lg:text-[20vw] text-black/10 leading-none tracking-tighter will-change-transform z-0"
                    style={{ [isEven ? 'left' : 'right']: '2%', top: '5%' }}
                    aria-hidden="true"
                  >
                    {flavor.editionNum}
                  </div>

                  {/* Main Grid: Alternating Layout */}
                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* 3D Interactive Can Column */}
                    <div className={`lg:col-span-5 flex items-center justify-center relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div
                        ref={(el) => (bottleWrapRefs.current[index] = el)}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-[45vh] sm:h-[55vh] md:h-[68vh] max-h-[520px] flex items-center justify-center cursor-grab perspective-1000"
                      >
                        <div
                          ref={(el) => (floatWrapRefs.current[index] = el)}
                          className="w-full h-full flex items-center justify-center will-change-transform"
                        >
                          <img
                            ref={(el) => (imgRefs.current[index] = el)}
                            src={flavor.image}
                            alt={flavor.alt}
                            className={`w-full h-full object-contain object-center will-change-transform drop-shadow-xl ${flavor.imgScale}`}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content & Ordering Column */}
                    <div className={`lg:col-span-7 flex flex-col justify-center flavor-content-block ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      {/* Top Metadata Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/20 flavor-badge-row will-change-transform">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span
                            className="px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white shadow-xs font-vagnola"
                            style={{ backgroundColor: flavor.tagColor }}
                          >
                            {flavor.badgeText}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-black font-mono">
                            {flavor.origin}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-black bg-white/50 px-2 py-0.5 border border-black/20 font-mono">
                          Cold-Chain Dispatch
                        </span>
                      </div>

                      {/* Flavor Title */}
                      <div className="mt-4 sm:mt-5 overflow-hidden">
                        <h3 className="font-vagnola text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight flavor-title-text will-change-transform flex flex-wrap gap-x-3.5 drop-shadow-md">
                          {flavor.title.split(' ').map((word, wIdx) => (
                            <span key={wIdx} className="overflow-hidden inline-block py-0.5">
                              <span className="flavor-title-word inline-block will-change-transform">{word}</span>
                            </span>
                          ))}
                        </h3>
                        <p className="flavor-subtitle-text text-[11px] sm:text-sm font-bold uppercase tracking-widest text-black/80 mt-1.5 font-vagnola will-change-transform">
                          {flavor.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="flavor-desc-text will-change-transform">
                        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-white/90 leading-relaxed font-normal font-poppins">
                          {flavor.desc}
                        </p>
                      </div>

                      {/* Tasting Notes */}
                      <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-black/70 mr-1">Flavor Notes:</span>
                        {flavor.tasteNotes.map((note) => (
                          <span key={note} className="taste-pill-anim px-2.5 py-1 bg-white border border-black text-[10px] sm:text-xs font-medium text-black uppercase tracking-wide shadow-2xs">
                            {note}
                          </span>
                        ))}
                      </div>

                      {/* Nutritional Counters */}
                      <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-5 bg-white border border-black/20 shadow-xs">
                        <div>
                          <span className="stat-counter-val font-asul text-lg sm:text-3xl md:text-4xl font-bold text-black block" data-val={flavor.stat1Numeric} data-suffix={flavor.stat1Suffix}>0{flavor.stat1Suffix}</span>
                          <span className="text-[9px] sm:text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mt-0.5 sm:mt-1">{flavor.stat1Label}</span>
                        </div>
                        <div className="border-l border-black/20 pl-2 sm:pl-4">
                          <span className="stat-counter-val font-asul text-lg sm:text-3xl md:text-4xl font-bold block" style={{ color: flavor.bgColor }} data-val={flavor.stat2Numeric} data-suffix={flavor.stat2Suffix}>0{flavor.stat2Suffix}</span>
                          <span className="text-[9px] sm:text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mt-0.5 sm:mt-1">{flavor.stat2Label}</span>
                        </div>
                        <div className="border-l border-black/20 pl-2 sm:pl-4">
                          <span className="stat-counter-val font-asul text-lg sm:text-3xl md:text-4xl font-bold text-black block" data-val={flavor.stat3Numeric} data-suffix={flavor.stat3Suffix}>0{flavor.stat3Suffix}</span>
                          <span className="text-[9px] sm:text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mt-0.5 sm:mt-1">{flavor.stat3Label}</span>
                        </div>
                      </div>

                      {/* Pack Selector */}
                      <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-white/20 border border-white/40">
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-black block mb-2 sm:mb-3">Select Harvest Packaging:</span>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {Object.entries(flavor.packs).map(([key, pack]) => {
                            const isSelected = currentPackKey === key
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => handlePackChange(flavor.id, key)}
                                className={`p-2 sm:p-2.5 min-h-[44px] border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs relative ${isSelected ? 'bg-black text-white border-black ring-2 ring-black/20' : 'bg-white text-black border-black/20 hover:border-black'}`}
                              >
                                {pack.badge && (
                                  <span className="absolute -top-2 right-1 sm:right-2 px-1 py-0.5 bg-black text-white text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider rounded-none shadow-xs">{pack.badge}</span>
                                )}
                                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">{key === 'single' ? '1 Can' : key === '4-pack' ? '4-Pack' : '12-Case'}</span>
                                <span className={`text-[11px] sm:text-xs font-bold mt-0.5 sm:mt-1 ${isSelected ? 'text-white' : 'text-black'}`}>{pack.display}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* CTA Row */}
                      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                          <span className="text-[10px] sm:text-[11px] text-white/70 font-medium uppercase tracking-wider block">Total Price ({currentPack.name})</span>
                          <span id={`price-${flavor.id}`} className="font-asul text-2xl sm:text-4xl font-bold text-white drop-shadow-sm">{currentPack.display}</span>
                        </div>
                        <div className="flex items-center w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleAddToCartClick(flavor, index)}
                            className="touch-target-44 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-black text-black hover:text-white text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 shadow-md active:scale-95 border border-transparent hover:border-white"
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
                </div>
              </article>

              {/* Fluid Splash Divider — sits between sections, slides down beneath */}
              {index !== FLAVORS.length - 1 && (
                <div
                  className="relative w-full pointer-events-none select-none overflow-hidden"
                  style={{ height: '140px', marginTop: '-100px', zIndex: 20 }}
                >
                  <img
                    src={flavor.splashDivider}
                    alt={`${flavor.title} splash`}
                    className="absolute bottom-0 left-0 w-full h-auto"
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </section>
  )
}