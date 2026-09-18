import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'

export default function AccountModal() {
  const { isAccountOpen, setIsAccountOpen, userProfile, updateUserProfile, orders } = useCart()
  const panelRef = useRef(null)
  const backdropRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [savedFeedback, setSavedFeedback] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        pincode: userProfile.pincode || '',
      })
    }
  }, [userProfile, isAccountOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAccountOpen) setIsAccountOpen(false)
    }
    if (isAccountOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      setIsEditing(false)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountOpen, setIsAccountOpen])

  useEffect(() => {
    if (isAccountOpen && panelRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!prefersReducedMotion) {
        gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power3.out' })
      }
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      }
    }
  }, [isAccountOpen])

  if (!isAccountOpen) return null

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUserProfile(editForm)
    setIsEditing(false)
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2500)
  }

  const getInitials = (name) => {
    if (!name || !name.trim()) return 'ZY'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.customerDetails?.finalTotal || o.subtotal || 0), 0)
  const realTimePoints = Math.round(totalSpent * 0.5) + 200
  const creditValue = Math.round(realTimePoints * 0.5)
  const nextTierGoal = 1000
  const tierProgress = Math.min(100, Math.round((realTimePoints / nextTierGoal) * 100))

  const scrollToFlavors = () => {
    setIsAccountOpen(false)
    const target = document.querySelector('#flavors')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-70 flex justify-end bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) setIsAccountOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-[480px] h-full bg-[#1A1816] flex flex-col overflow-hidden shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 pt-[calc(var(--sat,0px)+1.25rem)] pb-5 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-dacomment text-[10px] tracking-[0.25em] uppercase text-[#F5A623]">
              Clean Club
            </span>
            <span className="w-px h-3.5 bg-white/15" />
            <span className="font-mono text-[10px] text-white/30 tracking-widest">
              {userProfile.membershipId || '#CJ-8429'}
            </span>
          </div>
          <button
            id="account-modal-close-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            aria-label="Close account panel"
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-8 [&::-webkit-scrollbar]:w-0">

          {/* IDENTITY */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 bg-[#E03E26] flex items-center justify-center">
                <span className="font-dacomment text-xl text-white leading-none">
                  {getInitials(userProfile.fullName)}
                </span>
              </div>
              <div>
                <h2
                  id="account-modal-title"
                  className="font-dacomment text-2xl sm:text-3xl text-white leading-none tracking-tight"
                >
                  {userProfile.fullName || 'Guest'}
                </h2>
                <p className="font-poppins text-[11px] text-white/40 mt-1 tracking-wider">
                  {userProfile.phone ? `+91 ${userProfile.phone}` : 'No phone'} · {userProfile.city || 'India'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="font-poppins text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors cursor-pointer pt-1 shrink-0"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {savedFeedback && (
            <div className="flex items-center gap-2 py-2.5 px-4 bg-[#E03E26]/10 border border-[#E03E26]/20 text-[#E03E26] text-xs font-poppins">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Profile saved and synced.
            </div>
          )}

          {/* EDIT FORM */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="space-y-4 border-t border-white/8 pt-6">
              <p className="font-dacomment text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Edit Profile</p>
              {[
                { label: 'Full Name', key: 'fullName', type: 'text' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Address', key: 'address', type: 'text' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'PIN Code', key: 'pincode', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full bg-transparent border-b border-white/12 focus:border-white/40 py-2 font-poppins text-sm text-white outline-none transition-colors"
                    placeholder={label}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white text-[#1A1816] font-poppins text-xs font-semibold uppercase tracking-widest hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-3 px-5 border border-white/12 text-white/40 font-poppins text-xs uppercase tracking-widest hover:text-white hover:border-white/25 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* REWARDS */}
          <div className="border-t border-white/8 pt-6">
            <p className="font-dacomment text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">Rewards</p>
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="font-dacomment text-5xl sm:text-6xl text-white leading-none tabular-nums">
                  {realTimePoints.toLocaleString()}
                </span>
                <span className="font-poppins text-[10px] tracking-widest uppercase text-white/30 ml-2">pts</span>
              </div>
              <div className="text-right">
                <span className="font-dacomment text-2xl text-[#F5A623] leading-none">
                  &#8377;{creditValue}
                </span>
                <p className="font-poppins text-[9px] text-white/25 uppercase tracking-widest mt-0.5">Wallet Credit</p>
              </div>
            </div>
            <div className="w-full h-px bg-white/8 relative overflow-visible mb-3">
              <div
                className="absolute top-0 left-0 h-px bg-[#E03E26] transition-all duration-700 ease-out"
                style={{ width: `${tierProgress}%` }}
              />
              <div
                className="absolute -top-[3px] w-1.5 h-1.5 bg-[#E03E26] transition-all duration-700 ease-out"
                style={{ left: `calc(${tierProgress}% - 3px)` }}
              />
            </div>
            <div className="flex justify-between font-poppins text-[9px] text-white/20 tracking-widest uppercase">
              <span>{Math.max(0, nextTierGoal - realTimePoints)} pts to Platinum</span>
              <span>{tierProgress}%</span>
            </div>
          </div>

          {/* ORDER HISTORY */}
          <div className="border-t border-white/8 pt-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-dacomment text-[10px] tracking-[0.2em] uppercase text-white/30">Orders</p>
              <span className="font-mono text-[9px] text-white/15 tracking-widest">{orders.length} total</span>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-dacomment text-5xl text-white/8 mb-4 tracking-widest">EMPTY</p>
                <p className="font-poppins text-xs text-white/20 leading-relaxed mb-6 max-w-[220px] mx-auto">
                  Your cold-pressed orders will appear here after checkout.
                </p>
                <button
                  type="button"
                  onClick={scrollToFlavors}
                  className="font-poppins text-[10px] uppercase tracking-widest text-[#E03E26] hover:text-white transition-colors cursor-pointer"
                >
                  Browse Flavors &#8594;
                </button>
              </div>
            ) : (
              <div className="space-y-px">
                {orders.map((order, idx) => (
                  <div
                    key={order.orderId || idx}
                    className="bg-white/4 hover:bg-white/6 transition-colors p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white font-bold tracking-wider">
                          {order.orderId}
                        </span>
                        {order.date && (
                          <span className="font-poppins text-[9px] text-white/20">
                            {order.date}{order.time ? ` · ${order.time}` : ''}
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-poppins text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest ${
                          order.status === 'Delivered'
                            ? 'text-emerald-400 bg-emerald-400/8'
                            : 'text-[#F5A623] bg-[#F5A623]/8'
                        }`}
                      >
                        {order.status || 'In Transit'}
                      </span>
                    </div>

                    {order.items && (
                      <div className="space-y-1.5 border-t border-white/6 pt-2.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.image && (
                                <img src={item.image} alt={item.title} className="w-4 h-6 object-contain shrink-0" />
                              )}
                              <span className="font-poppins text-[11px] text-white/50 truncate">
                                <span className="text-white/80">{item.qty || 1}&times;</span>{' '}
                                {item.title || item.name}
                              </span>
                            </div>
                            <span className="font-dacomment text-sm text-white/60 shrink-0 ml-3">
                              &#8377;{item.totalPrice || item.price || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white/6 pt-2.5">
                      <span className="font-poppins text-[9px] text-white/20 uppercase tracking-widest truncate max-w-[55%]">
                        {order.customerDetails?.city || userProfile.city || '&#8212;'}
                      </span>
                      <span className="font-dacomment text-lg text-white">
                        &#8377;{order.customerDetails?.finalTotal || order.subtotal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="shrink-0 px-6 py-5 border-t border-white/8 bg-[#1A1816] flex gap-3 pb-[calc(var(--sab,0px)+1.25rem)]">
          <button
            id="account-order-flavors-btn"
            type="button"
            onClick={scrollToFlavors}
            className="flex-1 py-3.5 bg-[#E03E26] hover:bg-[#C83318] text-white font-poppins text-[10px] font-semibold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Order Now
          </button>
          <button
            id="account-done-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className="py-3.5 px-6 border border-white/10 hover:border-white/25 text-white/35 hover:text-white font-poppins text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
