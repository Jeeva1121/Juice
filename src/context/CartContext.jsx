import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'clean_juice_cart_v1'
const PROFILE_KEY = 'zesty_user_profile_v1'
const ORDERS_KEY = 'zesty_orders_v1'

const DEFAULT_PROFILE = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
  avatarUrl: '/profile-user.png',
}

const DEFAULT_ORDERS = []

const INITIAL_ITEMS = []

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Clean out any stale fake orange item from previous hardcoded defaults
        if (
          Array.isArray(parsed) &&
          parsed.length === 1 &&
          parsed[0].id === 'orange' &&
          parsed[0].pack === '4-pack' &&
          !localStorage.getItem('user_has_manually_added')
        ) {
          return []
        }
        return Array.isArray(parsed) ? parsed : []
      }
      return []
    } catch {
      return []
    }
  })

  const [userProfile, setUserProfile] = useState(() => {
    try {
      if (!localStorage.getItem('zesty_real_data_strict_v4')) {
        localStorage.removeItem(PROFILE_KEY)
        localStorage.setItem('zesty_real_data_strict_v4', 'true')
        return DEFAULT_PROFILE
      }
      const saved = localStorage.getItem(PROFILE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
      return DEFAULT_PROFILE
    } catch {
      return DEFAULT_PROFILE
    }
  })

  // One-time purge of stale mock orders from previous versions
  const [orders, setOrders] = useState(() => {
    try {
      if (!localStorage.getItem('zesty_orders_purged_v2')) {
        localStorage.removeItem(ORDERS_KEY)
        localStorage.setItem('zesty_orders_purged_v2', 'true')
        return []
      }
      const saved = localStorage.getItem(ORDERS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Filter out any mock/dummy orders with prefix CJ-622186, CJ-522931, etc or CJ-8921
        if (Array.isArray(parsed)) {
          return parsed.filter(o => o.orderId !== 'CJ-8921')
        }
      }
      return DEFAULT_ORDERS
    } catch {
      return DEFAULT_ORDERS
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(null)

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage unavailable fallback
    }
  }, [items])

  // Clear toast timeout
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Calculate totals
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0)
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice * item.qty, 0)
  const freeShippingThreshold = 499
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal)
  const isFreeShipping = subtotal >= freeShippingThreshold

  const showToast = (title, subtitle, image) => {
    setToastMessage({ title, subtitle, image, id: Date.now() })
  }

  const addToCart = (product, pack = 'single', quantity = 1) => {
    let packName = 'Single 500ml Can'
    let unitPrice = 99
    let packPrice = 99
    let volumeStr = '500ML'

    if (pack === '4-pack') {
      packName = '4-Pack Discovery Bundle'
      unitPrice = 87
      packPrice = 349
      volumeStr = '4 x 500ML'
    } else if (pack === '12-pack') {
      packName = '12-Pack Orchard Case'
      unitPrice = 75
      packPrice = 899
      volumeStr = '12 x 500ML'
    }

    const itemKey = `${product.id}-${pack}`

    setItems((prev) => {
      const existing = prev.find((i) => i.itemKey === itemKey || (i.id === product.id && i.pack === pack))
      if (existing) {
        return prev.map((i) =>
          (i.itemKey === itemKey || (i.id === product.id && i.pack === pack))
            ? { ...i, qty: i.qty + quantity }
            : i
        )
      }
      return [
        ...prev,
        {
          itemKey,
          id: product.id,
          title: product.title,
          edition: product.badgeText || `Edition ${product.editionNum || '01'}`,
          pack,
          packName,
          pricePerUnit: unitPrice,
          totalPrice: packPrice,
          qty: quantity,
          image: product.image,
          tagColor: product.tagColor || '#E03E26',
          volume: volumeStr,
        },
      ]
    })

    showToast(
      `Added to Harvest Bag`,
      `${product.title} (${packName}) x${quantity}`,
      product.image
    )
    setIsCartOpen(true)
  }

  const updateQty = (id, pack, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.pack === pack) {
            const newQty = item.qty + delta
            return newQty > 0 ? { ...item, qty: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const removeItem = (id, pack) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.pack === pack)))
  }

  const clearCart = () => {
    setItems([])
  }

  const completeOrder = (customerDetails) => {
    const orderId = `CJ-${Math.floor(100000 + Math.random() * 900000)}`
    const orderData = {
      orderId,
      items: [...items],
      subtotal,
      customerDetails,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      deliverySlot: customerDetails.slot || 'Dawn Express (Juiced at 4 AM / Delivered 6 AM - 9 AM)',
      status: 'In Transit',
    }

    setOrders((prev) => {
      const updated = [orderData, ...prev]
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    if (customerDetails) {
      setUserProfile((prev) => {
        const updated = {
          ...prev,
          fullName: customerDetails.fullName || prev.fullName,
          phone: customerDetails.phone || prev.phone,
          address: customerDetails.address || prev.address,
          city: customerDetails.city || prev.city,
          pincode: customerDetails.pincode || prev.pincode,
        }
        try {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
          localStorage.setItem('zesty_profile_verified', 'true')
        } catch (e) {
          console.error(e)
        }
        return updated
      })
    }

    setOrderConfirmed(orderData)
    setIsCheckingOut(false)
    clearCart()
  }

  const clearOrders = () => {
    setOrders([])
    try {
      localStorage.removeItem(ORDERS_KEY)
    } catch (e) {
      console.error(e)
    }
  }

  const updateUserProfile = (newProfile) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...newProfile }
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
        localStorage.setItem('zesty_profile_verified', 'true')
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        freeShippingThreshold,
        freeShippingLeft,
        isFreeShipping,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        toastMessage,
        setToastMessage,
        isCheckingOut,
        setIsCheckingOut,
        orderConfirmed,
        setOrderConfirmed,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        completeOrder,
        userProfile,
        updateUserProfile,
        orders,
        clearOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
