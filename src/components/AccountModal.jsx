import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'

export default function AccountModal() {
  const { isAccountOpen, setIsAccountOpen, userProfile, updateUserProfile, orders } = useCart()
  const modalRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [savedFeedback, setSavedFeedback] = useState(false)

  // Sync edit form with real-time userProfile
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        pincode: userProfile.pincode || '',
      })
    }
  }, [userProfile, isAccountOpen])

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
      setIsEditing(false)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountOpen, setIsAccountOpen])

  if (!isAccountOpen) return null

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUserProfile(editForm)
    setIsEditing(false)
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2500)
  }

  // Calculate initials dynamically
  const getInitials = (name) => {
    if (!name || !name.trim()) return 'VIP'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Real-time points based on live orders
  const totalSpent = orders.reduce((sum, o) => sum + (o.customerDetails?.finalTotal || o.subtotal || 0), 0)
  const realTimePoints = Math.round(totalSpent * 0.5) + 200
  const creditValue = Math.round(realTimePoints * 0.5)
  const nextTierGoal = 1000
  const tierProgress = Math.min(100, Math.round((realTimePoints / nextTierGoal) * 100))

  const scrollToFlavors = () => {
    setIsAccountOpen(false)
    const target = document.querySelector('#flavors')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-3.5 sm:p-6 bg-black/40 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAccountOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#FAF5EA] border border-black/10 shadow-2xl p-5 sm:p-7 text-neutral-900 max-h-[88vh] overflow-y-auto overflow-x-hidden pb-[calc(var(--sab)+1.5rem)] sm:pb-7 rounded-3xl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-neutral-950 text-white rounded-md">
              Clean Club VIP
            </span>
            <span className="text-[11px] text-neutral-500 font-mono tracking-wider">
              {userProfile.membershipId || '#CJ-8429'}
            </span>
          </div>

          <button
            id="account-modal-close-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            aria-label="Close Account Modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-neutral-100 border border-black/10 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {savedFeedback && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-poppins font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Profile details updated and synchronized in real time!
          </div>
        )}

        {/* Member Profile Card */}
        <div className="pt-5 pb-5 flex items-center justify-between gap-4 border-b border-black/5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-neutral-950 flex items-center justify-center text-white font-asul text-xl font-normal shadow-sm">
              {getInitials(userProfile.fullName)}
            </div>
            <div>
              <h2 id="account-modal-title" className="font-asul text-2xl font-normal tracking-tight text-neutral-900">
                {userProfile.fullName || 'Artisan Guest'}
              </h2>
              <p className="text-xs text-neutral-500 font-poppins font-normal">
                {userProfile.phone || 'No phone added'} • {userProfile.city || 'India'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-black/10 hover:border-black/30 text-xs font-poppins font-medium text-neutral-800 hover:text-neutral-950 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Inline Real-Time Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="my-4 p-4 bg-white rounded-2xl border border-black/10 shadow-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-black/5">
              <span className="font-poppins text-xs font-semibold text-neutral-900">Live Profile Editor</span>
              <span className="text-[10px] text-neutral-400">Updates live across cart & checkout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-poppins">
              <div>
                <label className="block text-[11px] text-neutral-500 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-neutral-500 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 font-medium mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  value={editForm.pincode}
                  onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-xs font-poppins font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-neutral-950 text-white text-xs font-poppins font-semibold shadow-xs hover:bg-black transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Real-Time Live Rewards & Points Bento */}
        <div className="mt-4 p-5 rounded-2xl bg-white border border-black/10 shadow-xs mb-5 text-neutral-900 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-poppins font-bold tracking-widest uppercase text-neutral-500 block">Real-Time Points</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-asul font-normal text-neutral-950">{realTimePoints}</span>
                <span className="text-xs text-neutral-500 font-poppins font-semibold uppercase">Points</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-poppins font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                ₹{creditValue} Wallet Credit
              </span>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-neutral-950 h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${tierProgress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 font-poppins font-medium">
            <span>{Math.max(0, nextTierGoal - realTimePoints)} pts to Platinum Cold-Chain Tier</span>
            <span>{tierProgress}%</span>
          </div>
        </div>

        {/* Real-Time Live Order History */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2">
            <h3 className="text-xs font-poppins font-semibold uppercase tracking-wider text-neutral-900">
              Live Cold-Chain Orders ({orders.length})
            </h3>
            <span className="text-[11px] font-poppins text-neutral-500 font-medium">Real-time sync</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 bg-white/60 rounded-2xl border border-black/5 p-6">
              <p className="font-asul text-lg text-neutral-800 mb-1">No orders yet</p>
              <p className="font-poppins text-xs text-neutral-500 mb-4">
                Your cold-pressed bottles will be tracked here in real time once ordered.
              </p>
              <button
                type="button"
                onClick={scrollToFlavors}
                className="px-5 py-2.5 rounded-full bg-neutral-950 text-white font-poppins text-xs font-medium hover:bg-black transition-all cursor-pointer"
              >
                Order Harvest Edition
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, idx) => (
                <div key={order.orderId || idx} className="p-4 bg-white rounded-2xl border border-black/10 shadow-2xs font-poppins text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-950 text-sm font-mono">{order.orderId}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        {order.date} {order.time ? `• ${order.time}` : ''}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                    }`}>
                      {order.status || 'Cold-Chain In Transit'}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5 pt-1 border-t border-black/5">
                    {order.items && order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-neutral-700 text-[11px]">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img src={item.image} alt={item.title || item.name} className="w-5 h-7 object-contain" />
                          )}
                          <span>
                            <span className="font-semibold text-neutral-900">{item.qty || item.quantity || 1}x</span> {item.title || item.name} ({item.packName || item.pack || '1 Can'})
                          </span>
                        </div>
                        <span className="font-dacomment font-semibold text-neutral-900 text-xs">
                          ₹{item.totalPrice || item.price || 0}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Destination & Window */}
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="truncate max-w-[240px]">
                      📍 {order.customerDetails?.address || userProfile.address}, {order.customerDetails?.city || userProfile.city}
                    </span>
                    <span className="font-dacomment text-sm font-bold text-neutral-950">
                      ₹{order.customerDetails?.finalTotal || order.subtotal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            id="account-order-flavors-btn"
            type="button"
            onClick={scrollToFlavors}
            className="flex-1 py-3 px-4 min-h-[44px] rounded-full bg-[#F25C22] hover:bg-[#E04D15] text-white text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-98"
          >
            Order New Flavors
          </button>
          <button
            id="account-done-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className="py-3 px-6 min-h-[44px] rounded-full border border-black/10 hover:bg-black/5 text-xs font-poppins font-medium text-neutral-700 transition-colors flex items-center justify-center cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
