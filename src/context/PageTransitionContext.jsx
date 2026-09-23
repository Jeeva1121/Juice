import { createContext, useContext, useState, useCallback, useRef } from 'react'
import gsap from 'gsap'

const PageTransitionContext = createContext(null)

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTriggerRef = useRef(null)

  const setTransitionTrigger = useCallback((triggerFn) => {
    transitionTriggerRef.current = triggerFn
  }, [])

  const triggerTransition = useCallback((callback, options = {}) => {
    if (transitionTriggerRef.current) {
      return transitionTriggerRef.current(callback, options)
    }

    // High quality editorial fallback transition
    return new Promise((resolve) => {
      setIsTransitioning(true)
      const mainContent = document.getElementById('main-content') || document.body
      
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false)
          resolve()
        }
      })

      tl.to(mainContent, {
        opacity: 0,
        scale: 0.985,
        filter: 'blur(4px)',
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (typeof callback === 'function') callback()
        }
      })

      tl.to(mainContent, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power3.out'
      })
    })
  }, [])

  return (
    <PageTransitionContext.Provider
      value={{
        triggerTransition,
        setTransitionTrigger,
        isTransitioning,
        setIsTransitioning,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)
  if (!context) {
    return {
      triggerTransition: (cb) => {
        if (typeof cb === 'function') cb()
      },
      setTransitionTrigger: () => {},
      isTransitioning: false,
      setIsTransitioning: () => {},
    }
  }
  return context
}
