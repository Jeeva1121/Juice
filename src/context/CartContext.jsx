import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'clean_juice_cart_v1'

const INITIAL_ITEMS = [
  {
    id: 'orange',
    title: 'Valencia Orange',
    edition: 'Edition 01',
    pack: '4-pack',
    packName: '4-Pack Discovery Bundle',
    pricePerUnit: 300, // ₹1200 / 4
    totalPrice: 1200,
    qty: 1,
    image: '/assets/orange-can-hero.png',
    tagColor: '#E03E26',
    volume: '4 x 500ML',
  },
]

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_ITEMS
    } catch {
      return INITIAL_ITEMS
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
  const freeShippingThreshold = 1000
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal)
  const isFreeShipping = subtotal >= freeShippingThreshold

  const showToast = (title, subtitle, image) => {
    setToastMessage({ title, subtitle, image, id: Date.now() })
  }

  const addToCart = (product, pack = 'single', quantity = 1) => {
    let packName = 'Single 500ml Can'
    let unitPrice = 350
    let packPrice = 350
    let volumeStr = '500ML'

    if (pack === '4-pack') {
      packName = '4-Pack Discovery Bundle'
      unitPrice = 300
      packPrice = 1200
      volumeStr = '4 x 500ML'
    } else if (pack === '12-pack') {
      packName = '12-Pack Orchard Case'
      unitPrice = 283
      packPrice = 3400
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
      deliverySlot: customerDetails.slot || 'Dawn Express (6 AM - 9 AM)',
    }
    setOrderConfirmed(orderData)
    setIsCheckingOut(false)
    clearCart()
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
