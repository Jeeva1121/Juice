import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * GsapText - Kinetic typography component for award-winning text reveals.
 * Splits text into masked units (words or characters) with staggered blur-slide reveals.
 */
export default function GsapText({
  text,
  children,
  className = '',
  as: Component = 'span',
  type = 'words', // 'words' | 'chars'
  delay = 0,
  duration = 0.75,
  stagger = 0.05,
  triggerKey,
}) {
  const containerRef = useRef(null)
  const content = text || (typeof children === 'string' ? children : '')

  useEffect(() => {
    if (!containerRef.current) return

    const units = containerRef.current.querySelectorAll('.gsap-text-unit')
    if (units.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        units,
        {
          yPercent: 115,
          opacity: 0,
          filter: 'blur(6px)',
          rotateX: 20,
        },
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          rotateX: 0,
          duration,
          stagger,
          delay,
          ease: 'power4.out',
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [content, triggerKey, delay, duration, stagger])

  if (type === 'chars') {
    const chars = content.split('')
    return (
      <Component ref={containerRef} className={`inline-flex flex-wrap overflow-hidden ${className}`}>
        {chars.map((ch, idx) => (
          <span key={idx} className="inline-block overflow-hidden">
            <span className="inline-block gsap-text-unit will-change-transform">
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          </span>
        ))}
      </Component>
    )
  }

  // Word-level kinetic reveal
  const words = content.split(' ')
  return (
    <Component ref={containerRef} className={`inline-flex flex-wrap gap-x-[0.28em] overflow-hidden ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden">
          <span className="inline-block gsap-text-unit will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  )
}

/**
 * GsapCounter - Kinetic rolling numeral counter for monetary totals & live metrics
 */
export function GsapCounter({
  value,
  prefix = '₹',
  suffix = '',
  className = '',
  duration = 0.9,
  triggerKey,
}) {
  const numRef = useRef(null)
  const prevValRef = useRef(0)

  useEffect(() => {
    if (!numRef.current) return
    const targetNum = typeof value === 'number' ? value : parseFloat(value) || 0
    const startVal = prevValRef.current || 0
    const animObj = { val: startVal }

    const tween = gsap.to(animObj, {
      val: targetNum,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${prefix}${Math.round(animObj.val).toLocaleString()}${suffix}`
        }
      },
    })
    prevValRef.current = targetNum

    return () => tween.kill()
  }, [value, prefix, suffix, duration, triggerKey])

  return (
    <span ref={numRef} className={className}>
      {prefix}{value}{suffix}
    </span>
  )
}
