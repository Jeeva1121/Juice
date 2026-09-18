import { createContext, useContext, useState, useRef, useCallback } from 'react'

const PageTransitionContext = createContext(null)

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionRef = useRef(null)

  const triggerTransition = useCallback((callback, options = {}) => {
    if (transitionRef.current?.startTransition) {
      return transitionRef.current.startTransition(callback, options)
    } else {
      if (typeof callback === 'function') callback()
      return Promise.resolve()
    }
  }, [])

  return (
    <PageTransitionContext.Provider value={{ triggerTransition, isTransitioning, setIsTransitioning, transitionRef }}>
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
      isTransitioning: false,
    }
  }
  return context
}
