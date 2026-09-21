import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'

export default function AccountModal() {
  const {
    isAccountOpen,
    setIsAccountOpen,
    userProfile,
    updateUserProfile,
    orders,
    clearOrders,
    items,
    subtotal,
    addToCart,
    setIsCartOpen,
  } = useCart()

  const panelRef = useRef(null)
  const backdropRef = useRef(null)
  const tabContentRef = useRef(null)

  // Tabs: 'profile' | 'orders' | 'bag'
  const [activeTab, setActiveTab] = useState('profile')

  // Real-time editable form state directly reflecting userProfile
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  })

  const [savedNotice, setSavedNotice] = useState(false)

  // Sync state from CartContext
  useEffect(() => {
    if (userProfile) {
      setForm({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        pincode: userProfile.pincode || '',
      })
    }
  }, [userProfile, isAccountOpen])

  // Real-time live auto-saver: updates parent context & localStorage immediately as user types
  const handleFieldChange = (key, value) => {
    const updated = { ...form, [key]: value }
    setForm(updated)
    updateUserProfile(updated)

    setSavedNotice(true)
    const timer = setTimeout(() => setSavedNotice(false), 1200)
    return () => clearTimeout(timer)
  }

  // Escape key & scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAccountOpen) setIsAccountOpen(false)
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

  // GSAP Smooth Slide-in & Stagger Entrance
  useEffect(() => {
    if (isAccountOpen && panelRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!prefersReducedMotion) {
        gsap.fromTo(
          panelRef.current,
          { x: '100%' },
          { x: '0%', duration: 0.35, ease: 'power3.out' }
        )
        if (backdropRef.current) {
          gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        }
        gsap.fromTo(
          '.account-fade-item',
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out', delay: 0.15 }
        )
      } else {
        gsap.set(panelRef.current, { x: '0%' })
        if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 1 })
      }
    }
  }, [isAccountOpen])

  // GSAP Tab Switching Animation
  useEffect(() => {
    if (tabContentRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!prefersReducedMotion) {
        gsap.fromTo(
          tabContentRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        )
      }
    }
  }, [activeTab])

  if (!isAccountOpen) return null

  const getInitials = (name) => {
    if (!name || !name.trim()) return 'CJ'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        addToCart(
          {
            id: item.id || 'orange',
            title: item.title || item.name || 'Cold-Pressed Juice',
            image: item.image || '/assets/orange-can-hero.png',
            tagColor: '#E03E26',
          },
          item.pack || 'single',
          item.qty || 1
        )
      })
      setIsAccountOpen(false)
      setIsCartOpen(true)
    }
  }

  const scrollToShop = () => {
    setIsAccountOpen(false)
    const target = document.querySelector('#gallery') || document.querySelector('#flavors')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpenCart = () => {
    setIsAccountOpen(false)
    setIsCartOpen(true)
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-70 flex justify-end bg-black/70 rounded-none backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAccountOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-[480px] h-full bg-black border-l border-white/10 flex flex-col overflow-hidden text-white rounded-none shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* TOP HEADER - FULLY BLACK WITH EDITORIAL VAGNOLA TYPOGRAPHY */}
        <header className="px-6 pt-[calc(var(--sat,0px)+1.25rem)] pb-4 border-b border-white/10 bg-black shrink-0 rounded-none account-fade-item">
          <div className="flex items-center justify-between">
            <h2
              id="account-modal-title"
              className="font-vagnola text-3xl sm:text-4xl font-bold uppercase text-white tracking-wide leading-none"
            >
              Account
            </h2>

            <button
              id="account-modal-close-btn"
              type="button"
              onClick={() => setIsAccountOpen(false)}
              aria-label="Close"
              className="w-10 h-10 border border-white/20 bg-white/5 hover:bg-white hover:text-black flex items-center justify-center text-white transition-colors cursor-pointer rounded-none text-xs font-mono font-bold"
            >
              &#10005;
            </button>
          </div>
        </header>

        {/* SEGMENTED TABS */}
        <div className="px-6 py-3 border-b border-white/10 bg-black shrink-0 account-fade-item">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'profile', label: 'DETAILS' },
              { id: 'orders', label: 'ORDERS' },
              { id: 'bag', label: 'BAG' },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-2 text-xs font-poppins font-bold tracking-[0.14em] uppercase text-center transition-all cursor-pointer rounded-none border ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-neutral-400 border-white/15 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div
          ref={tabContentRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-0"
        >
          {/* TAB 1: DETAILS (REAL-TIME EDITABLE PROFILE) */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Real-Time Live User Summary Card */}
              <div className="p-4 border border-white/15 bg-neutral-950 rounded-none flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 border border-white/20 shrink-0 rounded-none bg-neutral-900 shadow-md flex items-center justify-center text-white">
                    {form.fullName.trim() ? (
                      <span className="font-asul text-xl font-bold uppercase tracking-wider text-white">
                        {form.fullName.trim().charAt(0)}
                      </span>
                    ) : (
                      <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-vagnola text-lg font-bold uppercase tracking-wide text-white truncate">
                      {form.fullName.trim() || 'Guest Customer'}
                    </h3>
                    <p className="font-poppins text-xs text-neutral-400 truncate mt-1">
                      {form.email || form.phone ? (
                        <>
                          {form.email}
                          {form.email && form.phone ? ' / ' : ''}
                          {form.phone ? `+91 ${form.phone}` : ''}
                        </>
                      ) : (
                        'No contact details entered'
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-300 border border-white/20 bg-white/5 px-2.5 py-1 rounded-none block">
                    {savedNotice ? 'SYNCED' : 'REALTIME'}
                  </span>
                </div>
              </div>

              {/* Real-Time Form Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="font-vagnola text-sm font-bold uppercase tracking-wider text-white">
                    Personal Information
                  </h4>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                    {savedNotice ? 'SAVED TO LOCAL' : 'LIVE AUTO-SAVING'}
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-neutral-950 border border-white/20 focus:border-white py-3 px-3.5 font-poppins text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none rounded-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-950 border border-white/20 focus:border-white py-3 px-3.5 font-poppins text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none rounded-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Phone Number
                  </label>
                  <div className="flex border border-white/20 focus-within:border-white bg-neutral-950 rounded-none transition-colors">
                    <span className="px-3.5 py-3 font-mono text-xs text-neutral-400 border-r border-white/15 shrink-0 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-transparent py-3 px-3.5 font-poppins text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none rounded-none"
                    />
                  </div>
                </div>

                {/* Delivery Street Address */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="Flat / House / Street name"
                    className="w-full bg-neutral-950 border border-white/20 focus:border-white py-3 px-3.5 font-poppins text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none rounded-none transition-colors"
                  />
                </div>

                {/* City & PIN Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block font-poppins text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="City"
                      className="w-full bg-neutral-950 border border-white/20 focus:border-white py-3 px-3.5 font-poppins text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none rounded-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-poppins text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => handleFieldChange('pincode', e.target.value)}
                      placeholder="PIN Code"
                      className="w-full bg-neutral-950 border border-white/20 focus:border-white py-3 px-3.5 font-poppins text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none rounded-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS (REAL-TIME LIVE DATA ONLY) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-vagnola text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Verified Order History
                </span>
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={clearOrders}
                    className="font-mono text-[10px] text-neutral-500 hover:text-red-400 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="py-14 text-center border border-white/10 bg-neutral-950 p-6 rounded-none space-y-3">
                  <p className="font-vagnola text-2xl font-bold uppercase text-white tracking-wide">
                    No Orders Recorded
                  </p>
                  <p className="font-poppins text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                    You have not placed any orders yet. When you complete an order at checkout, your verified receipt will appear here in real time.
                  </p>
                  <button
                    type="button"
                    onClick={scrollToShop}
                    className="mt-2 py-3 px-6 bg-white hover:bg-neutral-200 text-black font-poppins text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer rounded-none inline-block"
                  >
                    Explore Flavors &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, idx) => (
                    <div
                      key={order.orderId || idx}
                      className="p-4 border border-white/15 bg-neutral-950 space-y-3 rounded-none"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <div>
                          <span className="font-mono text-xs font-bold text-white tracking-wider block">
                            {order.orderId}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400">
                            {order.date} {order.time ? `/ ${order.time}` : ''}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-white/20 bg-white/5 text-white rounded-none">
                          {order.status || 'CONFIRMED'}
                        </span>
                      </div>

                      {order.items && (
                        <div className="space-y-1.5 pt-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between font-mono text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-neutral-400 font-bold font-bricolage tabular-nums">{item.qty || 1}x</span>
                                <span className="text-white uppercase truncate">{item.title || item.name}</span>
                              </div>
                              <span className="text-neutral-300 ml-2 shrink-0 font-bricolage font-bold tabular-nums">
                                &#8377;{item.totalPrice || item.price || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="font-poppins text-xs text-neutral-400">
                          Total: <strong className="text-white font-bricolage text-base font-bold ml-1 tabular-nums">&#8377;{order.customerDetails?.finalTotal || order.subtotal}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="font-poppins text-xs uppercase tracking-wider py-1.5 px-4 border border-white/20 hover:bg-white hover:text-black text-white transition-colors cursor-pointer rounded-none font-semibold"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRENT BAG (REAL DATA ONLY) */}
          {activeTab === 'bag' && (
            <div className="space-y-4">
              <div className="border border-white/15 bg-neutral-950 p-4 rounded-none space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-vagnola text-sm font-bold uppercase tracking-[0.14em] text-white">
                    Current Bag
                  </span>
                  <span className="font-bricolage text-xs text-neutral-400 tabular-nums">
                    {items.length} {items.length === 1 ? 'flavor' : 'flavors'}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <p className="font-poppins text-xs text-neutral-400">Your bag is currently empty.</p>
                    <button
                      type="button"
                      onClick={scrollToShop}
                      className="py-2.5 px-5 bg-white text-black font-poppins text-xs uppercase tracking-[0.16em] font-bold rounded-none hover:bg-neutral-200 transition-colors cursor-pointer mt-2"
                    >
                      Browse Flavors &rarr;
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 pt-1">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between font-mono text-xs py-1.5 border-b border-white/5">
                          <div className="truncate">
                            <span className="text-neutral-400 font-bold font-bricolage tabular-nums">{item.qty}x</span>{' '}
                            <span className="text-white uppercase font-bold">{item.title}</span>{' '}
                            <span className="text-neutral-500 text-[10px]">({item.pack || 'single'})</span>
                          </div>
                          <span className="text-white font-bricolage text-sm font-bold ml-2 shrink-0 tabular-nums">
                            &#8377;{item.totalPrice * item.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="font-poppins text-xs uppercase tracking-wider text-neutral-400">Subtotal:</span>
                      <span className="font-bricolage text-2xl font-bold text-white tabular-nums">&#8377;{subtotal}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenCart}
                      className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-poppins text-xs uppercase tracking-[0.18em] font-bold rounded-none transition-colors cursor-pointer text-center block mt-3"
                    >
                      Open Cart & Checkout &rarr;
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <footer className="shrink-0 px-6 py-4 border-t border-white/10 bg-black flex items-center justify-between gap-3 pb-[calc(var(--sab,0px)+1.25rem)] rounded-none account-fade-item">
          <button
            type="button"
            onClick={scrollToShop}
            className="py-3 px-5 border border-white/20 hover:border-white hover:bg-white/10 text-white font-poppins text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer rounded-none"
          >
            Explore Flavors
          </button>

          <button
            id="account-done-btn"
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className="py-3 px-7 bg-white hover:bg-neutral-200 text-black font-poppins text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer rounded-none"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  )
}
