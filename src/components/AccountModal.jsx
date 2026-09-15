import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'

export default function AccountModal() {
  const { isAccountOpen, setIsAccountOpen } = useCart()
  const modalRef = useRef(null)

  // Escape key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAccountOpen) {
        setIsAccountOpen(false)
      }
    }

    if (isAccountOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountOpen, setIsAccountOpen])

  if (!isAccountOpen) return null

  const scrollToFlavors = () => {
    setIsAccountOpen(false)
    const target = document.querySelector('#flavors')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/40 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAccountOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white border border-neutral-900 shadow-2xl overflow-hidden p-5 sm:p-8 text-(--color-ink) max-h-[85vh] overflow-y-auto pb-[calc(var(--sab)+1.5rem)] sm:pb-8 rounded-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-black">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold tracking-widest uppercase bg-neutral-900 text-white rounded-none">
              Clean Club VIP
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-500 font-mono tracking-wider">ID: #CJ-8429</span>
          </div>

          <button
            id="account-modal-close-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            aria-label="Close Account Modal"
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-none flex items-center justify-center hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer border border-transparent hover:border-black/10 -mr-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Member Profile Hero */}
        <div className="pt-6 pb-6 flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-none bg-neutral-900 flex items-center justify-center text-white font-display text-xl sm:text-2xl font-black">
            JK
          </div>
          <div>
            <h2 id="account-modal-title" className="font-display text-xl sm:text-2xl font-black uppercase tracking-wide">
              Jeeva Kumar
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Gold Artisan Member • Joined Sept 2024
            </p>
          </div>
        </div>

        {/* Clean Rewards & Points Card */}
        <div className="p-5 rounded-none bg-[#FAF5EA] border border-black/10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-600">Points Balance</span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-(--color-coral) uppercase">₹450 Credit</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-display font-black text-(--color-ink)">450</span>
            <span className="text-xs text-neutral-500 font-semibold uppercase">Points</span>
          </div>
          {/* Tier Progress */}
          <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
            <div className="bg-(--color-coral) h-full rounded-full w-[90%] transition-all duration-500" />
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            50 points to unlock Platinum Tier (Free priority cold-chain express on every drop)
          </p>
        </div>

        {/* Active Cold-Chain Subscription */}
        <div className="p-5 rounded-none bg-white border border-black/10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Active Sub</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-none border border-emerald-200">Weekly Dawn</span>
          </div>
          <p className="text-sm font-bold text-neutral-900 tracking-wide uppercase">4-Pack Discovery Bundle</p>
          <p className="text-xs text-neutral-500 mt-1">Next Drop: Tomorrow, 6AM – 9AM</p>
        </div>

        {/* Quick Order History */}
        <div className="mb-6">
          <h3 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4 border-b border-black/10 pb-2">Recent Drops</h3>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-black/5 text-xs">
              <div>
                <p className="font-bold text-neutral-900 uppercase tracking-wide">#CJ-8921</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">4x Valencia Orange (Edition 01)</p>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">Delivered</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-black/5 text-xs">
              <div>
                <p className="font-bold text-neutral-900 uppercase tracking-wide">#CJ-8740</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">2x Wild Strawberry, 2x Cherry</p>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">Delivered</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="account-order-flavors-btn"
            type="button"
            onClick={scrollToFlavors}
            className="flex-1 py-3.5 px-4 min-h-[44px] rounded-full bg-(--color-ink) text-white hover:bg-(--color-coral) text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md active:scale-98"
          >
            Order New Flavors
          </button>
          <button
            id="account-done-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className="py-3.5 px-6 min-h-[44px] rounded-full border border-black/10 hover:bg-black/5 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
