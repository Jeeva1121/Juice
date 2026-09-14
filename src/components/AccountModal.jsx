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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAccountOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#FAF5EA] border border-black/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-(--color-ink) max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-(--color-coral)/15 text-(--color-coral)">
              Clean Club VIP
            </span>
            <span className="text-xs text-neutral-500 font-mono">ID: #CJ-8429</span>
          </div>

          <button
            type="button"
            onClick={() => setIsAccountOpen(false)}
            aria-label="Close Account Modal"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Member Profile Hero */}
        <div className="pt-6 pb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#FF9F1C] to-(--color-coral) flex items-center justify-center text-white font-display text-xl font-black shadow-md">
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
        <div className="p-4 rounded-2xl bg-white/80 border border-black/5 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-500">Clean Points Balance</span>
            <span className="text-xs font-bold text-(--color-coral)">₹450 Credit Available</span>
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
        <div className="p-4 rounded-2xl bg-white/60 border border-black/5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase">Active Subscription</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">Weekly Dawn Delivery</span>
          </div>
          <p className="text-sm font-bold text-neutral-800">4-Pack Discovery Bundle</p>
          <p className="text-xs text-neutral-600 mt-0.5">Next Drop: Tomorrow, 6:00 AM – 9:00 AM • Cold-Chain Direct</p>
        </div>

        {/* Quick Order History */}
        <div className="mb-6">
          <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-500 mb-3">Recent Cold-Pressed Drops</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-black/5 text-xs">
              <div>
                <p className="font-semibold text-neutral-800">Order #CJ-8921</p>
                <p className="text-neutral-500 text-[11px]">4x Valencia Orange (Edition 01)</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Delivered</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-black/5 text-xs">
              <div>
                <p className="font-semibold text-neutral-800">Order #CJ-8740</p>
                <p className="text-neutral-500 text-[11px]">2x Wild Strawberry, 2x Black Cherry</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Delivered</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={scrollToFlavors}
            className="flex-1 py-3 px-4 rounded-full bg-(--color-ink) text-white hover:bg-(--color-coral) text-xs font-bold tracking-widest uppercase transition-all duration-300 text-center cursor-pointer shadow-sm hover:shadow-md active:scale-98"
          >
            Order New Flavors
          </button>
          <button
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className="py-3 px-5 rounded-full border border-black/10 hover:bg-black/5 text-xs font-bold tracking-widest uppercase transition-colors text-center cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
