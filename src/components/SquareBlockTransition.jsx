import { useEffect, useRef, useImperativeHandle, useCallback } from 'react'
import gsap from 'gsap'
import { usePageTransition } from '../context/PageTransitionContext'

const COLS = 6
const ROWS = 4
const TOTAL_BLOCKS = COLS * ROWS

export default function SquareBlockTransition() {
  const { transitionRef, setIsTransitioning } = usePageTransition()
  const containerRef = useRef(null)
  const blocksRef = useRef([])
  const timelineRef = useRef(null)

  const executeTransition = useCallback((callback, options = {}) => {
    return new Promise((resolve) => {
      setIsTransitioning(true)

      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: 'none' })
          setIsTransitioning(false)
          resolve()
        }
      })

      timelineRef.current = tl

      // Activate container overlay with GSAP autoAlpha
      tl.set(containerRef.current, { autoAlpha: 1, pointerEvents: 'auto' })
      tl.set(blocksRef.current, { scale: 0, opacity: 0, transformOrigin: '50% 50%' })

      // 1. Blocks cascade IN - Large, bold, cinematic geometric square blocks
      tl.to(blocksRef.current, {
        scale: 1.02,
        opacity: 1,
        duration: 0.52,
        ease: 'power3.inOut',
        stagger: {
          grid: [ROWS, COLS],
          from: options.from || 'start',
          amount: 0.46,
        }
      })

      // 2. Callback fires at peak coverage (seamless state switch)
      tl.call(() => {
        if (typeof callback === 'function') {
          callback()
        }
      })

      // Graceful hold moment at full coverage
      tl.to({}, { duration: 0.12 })

      // 3. Blocks cascade OUT toward opposite edge
      tl.to(blocksRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.52,
        ease: 'power3.inOut',
        stagger: {
          grid: [ROWS, COLS],
          from: options.exitFrom || 'end',
          amount: 0.46,
        }
      })
    })
  }, [setIsTransitioning])

  useImperativeHandle(transitionRef, () => ({
    startTransition: executeTransition
  }), [executeTransition])

  // Register global window helper for easy testing from anywhere
  useEffect(() => {
    window.triggerSquareBlocks = (cb, opts) => executeTransition(cb, opts)
    return () => {
      delete window.triggerSquareBlocks
    }
  }, [executeTransition])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-999999 pointer-events-none w-screen h-screen overflow-hidden select-none"
      style={{
        visibility: 'hidden',
        opacity: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (blocksRef.current[index] = el)}
          className="w-full h-full bg-[#050505] border-[0.5px] border-neutral-900/60"
          style={{ willChange: 'transform, opacity' }}
        />
      ))}
    </div>
  )
}
