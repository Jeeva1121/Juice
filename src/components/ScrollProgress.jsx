import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProgress() {
  const barRef = useRef(null)

  useGSAP(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      scrub: 0.15,
      onUpdate: (self) => {
        if (barRef.current) {
          gsap.set(barRef.current, {
            scaleX: self.progress,
            transformOrigin: 'left center',
          })
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [])

  return (
    <aside
      aria-label="Scroll Progress"
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[3px] bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-(--color-coral) origin-left scale-x-0 transition-none"
      />
    </aside>
  )
}
