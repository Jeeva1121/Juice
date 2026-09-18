import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { usePageTransition } from "../context/PageTransitionContext";
import gsap from "gsap";
import { GsapCounter } from "./GsapText";

// Authentic brand vector logos for UPI payment apps
const UPI_APPS = [
  {
    id: "gpay",
    name: "Google Pay",
    shortName: "GPay",
    icon: (
      <img
        src="/gpay-logo.png"
        alt="Google Pay"
        className="max-h-7 max-w-[80%] object-contain"
      />
    ),
  },
  {
    id: "phonepe",
    name: "PhonePe",
    shortName: "PhonePe",
    icon: (
      <img
        src="/phonepe-logo.png"
        alt="PhonePe"
        className="max-h-7 max-w-[80%] object-contain"
      />
    ),
  },
  {
    id: "paytm",
    name: "Paytm",
    shortName: "Paytm",
    icon: (
      <img
        src="/paytm-logo.png"
        alt="Paytm"
        className="max-h-5 max-w-[85%] object-contain"
      />
    ),
  },
  {
    id: "bhim",
    name: "BHIM",
    shortName: "BHIM",
    icon: (
      <img
        src="/bhim-logo.png"
        alt="BHIM"
        className="max-h-7 max-w-[80%] object-contain"
      />
    ),
  },
];

const BANK_OPTIONS = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    popular: true,
    logo: (
      <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <rect width="36" height="36" rx="4" fill="#004C8F" />
        <rect x="13.5" y="13.5" width="9" height="9" fill="#ED232A" />
        <rect x="6.5" y="15.5" width="5" height="5" fill="#FFFFFF" />
        <rect x="24.5" y="15.5" width="5" height="5" fill="#FFFFFF" />
        <rect x="15.5" y="6.5" width="5" height="5" fill="#FFFFFF" />
        <rect x="15.5" y="24.5" width="5" height="5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "sbi",
    name: "State Bank of India",
    popular: true,
    logo: (
      <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <circle cx="18" cy="18" r="18" fill="#0072BC" />
        <circle cx="18" cy="14" r="5" fill="#FFFFFF" />
        <rect x="16.2" y="14" width="3.6" height="15" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "icici",
    name: "ICICI Bank",
    popular: true,
    logo: (
      <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <rect width="36" height="36" rx="4" fill="#B02A30" />
        <path
          d="M18 7c6.1 0 11 4.9 11 11s-4.9 11-11 11S7 24.1 7 18c0-2.2.6-4.2 1.8-5.9l3.5 2.3C11.4 15.4 11 16.6 11 18c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7v-4z"
          fill="#F58220"
        />
        <circle cx="18" cy="18" r="3.2" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "axis",
    name: "Axis Bank",
    popular: true,
    logo: (
      <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <rect width="36" height="36" rx="4" fill="#97144D" />
        <path
          d="M18 7L6.5 28.5h8.5l3-6 3 6h8.5L18 7zm0 8.5l3 6h-6l3-6z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: "kotak",
    name: "Kotak Mahindra",
    popular: true,
    logo: (
      <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <rect width="36" height="36" rx="4" fill="#ED1C24" />
        <path
          d="M11 12c-3.3 0-6 2.7-6 6s2.7 6 6 6c3.1 0 4.8-2 6-4.5 1.2 2.5 2.9 4.5 6 4.5 3.3 0 6-2.7 6-6s-2.7-6-6-6c-3.1 0-4.8 2-6 4.5-1.2-2.5-2.9-4.5-6-4.5zm0 3c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm14 0c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    popular: true,
    logo: (
      <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <rect width="36" height="36" rx="4" fill="#A20A27" />
        <circle cx="18" cy="18" r="12" fill="#F8B122" />
        <circle cx="18" cy="18" r="9" fill="#A20A27" />
        <text
          x="18"
          y="21.5"
          fill="#FFFFFF"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="7.5"
          letterSpacing="0.5"
        >
          PNB
        </text>
      </svg>
    ),
  },
];

// Authentic brand vector logos for digital wallets
const WALLET_OPTIONS = [
  {
    id: "paytm",
    name: "Paytm Wallet",
    logo: (
      <svg viewBox="0 0 64 24" className="w-10 h-5 shrink-0" fill="none">
        <rect width="64" height="24" rx="3" fill="#002970" />
        <text
          x="6"
          y="17"
          fill="#00BAF2"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="-0.5"
        >
          pay
        </text>
        <text
          x="36"
          y="17"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="-0.5"
        >
          tm
        </text>
      </svg>
    ),
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    logo: (
      <svg viewBox="0 0 64 24" className="w-10 h-5 shrink-0">
        <rect width="64" height="24" rx="3" fill="#131921" />
        <text
          x="7"
          y="14"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="9.5"
        >
          amazon
        </text>
        <path
          d="M7 18c6 3 17 3 23-1"
          stroke="#FF9900"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="30,16 32,17.5 29.5,18.5" fill="#FF9900" />
        <text
          x="36"
          y="15"
          fill="#FF9900"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="9.5"
        >
          pay
        </text>
      </svg>
    ),
  },
  {
    id: "phonepe",
    name: "PhonePe Wallet",
    logo: (
      <svg viewBox="0 0 36 36" className="w-6 h-6 shrink-0" fill="none">
        <circle cx="18" cy="18" r="18" fill="#5F259F" />
        <path
          d="M20.5 10a1.6 1.6 0 0 0-2 .7l-2.8 4.8h-1.8c-.7 0-1.2.5-1.2 1.2v2.4c0 .7.5 1.2 1.2 1.2h1.3v5.6c0 2.4 1.8 4.2 4.2 4.2h1c.7 0 1.2-.5 1.2-1.2v-2.4c0-.7-.5-1.2-1.2-1.2h-1c-.7 0-1.2-.5-1.2-1.2v-3.7h3c3.5 0 6.2-2.7 6.2-6.2 0-.7-.5-1.2-1.2-1.2h-3.3l1.5-2.7c.4-.6.2-1.4-.4-1.8z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: "mobikwik",
    name: "MobiKwik",
    logo: (
      <svg viewBox="0 0 64 24" className="w-10 h-5 shrink-0">
        <rect width="64" height="24" rx="3" fill="#152B52" />
        <circle cx="12" cy="12" r="7" fill="#00AEEF" />
        <text
          x="12"
          y="15.5"
          fill="#FFFFFF"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="11"
        >
          M
        </text>
        <text
          x="24"
          y="15.5"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="8.5"
          letterSpacing="0.2"
        >
          MobiKwik
        </text>
      </svg>
    ),
  },
];

export default function CartDrawer() {
  const { triggerTransition } = usePageTransition();
  const {
    items,
    subtotal,
    freeShippingLeft,
    isFreeShipping,
    freeShippingThreshold,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    removeItem,
    toastMessage,
    isCheckingOut,
    setIsCheckingOut,
    orderConfirmed,
    setOrderConfirmed,
    completeOrder,
    addToCart,
    userProfile,
    setIsAccountOpen,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [addedAddons, setAddedAddons] = useState({});
  const [isEditingCart, setIsEditingCart] = useState(false);
  const [promoInputOpen, setPromoInputOpen] = useState(false);

  // Animation Refs
  const backdropRef = useRef(null);
  const drawerPanelRef = useRef(null);
  const headerRef = useRef(null);
  const itemsContainerRef = useRef(null);
  const addonsRef = useRef(null);
  const footerRef = useRef(null);
  const checkoutBtnRef = useRef(null);
  const promoPopupRef = useRef(null);
  const errorRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const deliveryVanRef = useRef(null);

  // Checkout Modal GSAP Animation Refs
  const checkoutModalRef = useRef(null);
  const checkoutContainerRef = useRef(null);
  const checkoutScrollProgressRef = useRef(null);

  // Prevent background scroll & lock Lenis when Cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isCartOpen]);

  // Ensure scroll is 100% active and unblocked during checkout modal
  useEffect(() => {
    if (isCheckingOut) {
      document.body.classList.add("checkout-active");
      const container = checkoutContainerRef.current;
      if (container) {
        const onWheel = (e) => {
          e.stopPropagation();
        };
        const onTouch = (e) => {
          e.stopPropagation();
        };
        container.addEventListener("wheel", onWheel, { passive: true });
        container.addEventListener("touchmove", onTouch, { passive: true });
        return () => {
          document.body.classList.remove("checkout-active");
          container.removeEventListener("wheel", onWheel);
          container.removeEventListener("touchmove", onTouch);
        };
      }
    } else {
      document.body.classList.remove("checkout-active");
    }
  }, [isCheckingOut]);

  // GSAP Opening Entrance Animations - High-performance 60fps on mobile without layout thrashing
  useEffect(() => {
    if (isCartOpen && drawerPanelRef.current) {
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" },
        );
      }

      gsap.fromTo(
        drawerPanelRef.current,
        { x: "100%" },
        {
          x: "0%",
          duration: 0.32,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    }
  }, [isCartOpen]);

  // Dynamic progress bar width animation
  useEffect(() => {
    if (progressBarRef.current && isCartOpen) {
      const progressPercent = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100),
      );
      gsap.to(progressBarRef.current, {
        width: `${progressPercent}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [subtotal, freeShippingThreshold, isCartOpen]);

  // Animated Chilled Delivery Van position movement
  useEffect(() => {
    if (deliveryVanRef.current && isCartOpen) {
      const progressPercent = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100),
      );
      gsap.to(deliveryVanRef.current, {
        left: `calc(${Math.min(94, Math.max(0, progressPercent))}% - 14px)`,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [subtotal, freeShippingThreshold, isCartOpen]);

  // Promo Celebration Popup
  useEffect(() => {
    if (showPromoPopup && promoPopupRef.current) {
      gsap.set(promoPopupRef.current, { transformPerspective: 1000 });
      gsap.fromTo(
        promoPopupRef.current,
        { scale: 0.6, opacity: 0, y: 80, rotationX: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.6)",
        },
      );
    }
  }, [showPromoPopup]);

  // Real-time Checkout form state - NO hardcoded predefined data
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    city: userProfile?.city || "",
    pincode: userProfile?.pincode || "",
    slot: "Dawn Express (Juiced at 4 AM - Delivered 6 AM - 9 AM)",
    paymentMethod: "upi",
  });

  // Sync formData whenever userProfile updates
  useEffect(() => {
    if (userProfile?.fullName || userProfile?.phone || userProfile?.address) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || userProfile.fullName || "",
        phone: prev.phone || userProfile.phone || "",
        address: prev.address || userProfile.address || "",
        city: prev.city || userProfile.city || "",
        pincode: prev.pincode || userProfile.pincode || "",
      }));
    }
  }, [
    userProfile?.fullName,
    userProfile?.phone,
    userProfile?.address,
    userProfile?.city,
    userProfile?.pincode,
  ]);

  // Payment states for Real-Time Checkout UI
  const [paymentTab, setPaymentTab] = useState("upi"); // 'upi', 'netbanking', 'card', 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay"); // 'gpay', 'phonepe', 'paytm', 'cred', 'bhim'
  const [customUpiId, setCustomUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiVerifying, setUpiVerifying] = useState(false);
  const [upiError, setUpiError] = useState("");
  const [qrCountdown, setQrCountdown] = useState(299); // 4 min 59 sec
  const [selectedBank, setSelectedBank] = useState("hdfc"); // 'hdfc', 'icici', 'sbi', 'axis', 'kotak', 'pnb'
  const [selectedWallet, setSelectedWallet] = useState("paytm"); // 'paytm', 'amazonpay', 'phonepe', 'mobikwik'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isAddressEditing, setIsAddressEditing] = useState(false);

  // Real-time ticking countdown for UPI QR
  useEffect(() => {
    let timer;
    if (isCheckingOut && paymentTab === "upi") {
      timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCheckingOut, paymentTab]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyUpi = (e) => {
    e.preventDefault();
    if (!customUpiId || !customUpiId.includes("@")) return;
    setUpiVerifying(true);
    setTimeout(() => {
      setUpiVerifying(false);
      setUpiVerified(true);
    }, 600);
  };

  // Realtime Checkout Scroll Handler driving GSAP progress bar and subtle parallax
  const handleCheckoutScroll = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (checkoutScrollProgressRef.current) {
      gsap.to(checkoutScrollProgressRef.current, {
        scaleX: Math.min(Math.max(progress, 0), 1),
        duration: 0.1,
        ease: "none",
        overwrite: "auto",
      });
    }
  };

  // GSAP Modern Cinematic Animations for Checkout Page & Order Confirmation
  useEffect(() => {
    if (isCheckingOut) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Minimalist layout entrance stagger
        tl.fromTo(
          ".checkout-stagger",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
        );

        // Animate numbers scaling up
        tl.fromTo(
          ".checkout-number-anim",
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          "-=0.4",
        );
      });
      return () => ctx.revert();
    }
  }, [isCheckingOut]);

  // GSAP Tab Content Switch Transition - Instant, Crisp, Zero Blur Lag
  useEffect(() => {
    if (isCheckingOut) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".checkout-tab-content",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" },
      );

      if (paymentTab === "netbanking") {
        gsap.fromTo(
          ".checkout-bank-item",
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.025,
            ease: "power2.out",
          },
        );
      }

      if (paymentTab === "wallets") {
        gsap.fromTo(
          ".checkout-wallet-item",
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.025,
            ease: "power2.out",
          },
        );
      }
    }
  }, [paymentTab, isCheckingOut]);

  // Celebratory GSAP Entrance for Order Confirmation Screen
  useEffect(() => {
    if (orderConfirmed) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          ".order-confirm-badge",
          { scale: 0, rotation: -25 },
          { scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.2)" },
        );
        tl.fromTo(
          ".order-confirm-content",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          "-=0.3",
        );
        tl.fromTo(
          ".order-confirm-receipt",
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35 },
          "-=0.2",
        );
        tl.fromTo(
          ".order-confirm-btn",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.08 },
          "-=0.15",
        );
      });
      return () => ctx.revert();
    }
  }, [orderConfirmed]);

  const handleUpiAppClick = (appId, e) => {
    setSelectedUpiApp(appId);
    if (e?.currentTarget) {
      gsap
        .timeline()
        .to(e.currentTarget, { scale: 0.9, duration: 0.07 })
        .to(e.currentTarget, {
          scale: 1,
          duration: 0.16,
          ease: "back.out(2.5)",
        });
    }
  };

  const handleBankClick = (bankId, e) => {
    setSelectedBank(bankId);
    if (e?.currentTarget) {
      gsap
        .timeline()
        .to(e.currentTarget, { scale: 0.93, duration: 0.07 })
        .to(e.currentTarget, {
          scale: 1,
          duration: 0.18,
          ease: "back.out(2.2)",
        });
    }
  };

  const handleWalletClick = (walletId, e) => {
    setSelectedWallet(walletId);
    if (e?.currentTarget) {
      gsap
        .timeline()
        .to(e.currentTarget, { scale: 0.93, duration: 0.07 })
        .to(e.currentTarget, {
          scale: 1,
          duration: 0.18,
          ease: "back.out(2.2)",
        });
    }
  };

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsCheckingOut(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsCartOpen, setIsCheckingOut]);

  // Interactive micro-animation on quantity change
  const handleQtyClick = (id, pack, delta, e) => {
    const parent = e.currentTarget.closest(".qty-stepper-container");
    if (parent) {
      const numberEl = parent.querySelector(".qty-display-number");
      if (numberEl) {
        gsap
          .timeline()
          .to(numberEl, { scale: 1.3, color: "#E03E26", duration: 0.09 })
          .to(numberEl, {
            scale: 1,
            color: "#1A1816",
            duration: 0.18,
            ease: "back.out(2)",
          });
      }
    }
    updateQty(id, pack, delta);
  };

  // Interactive smooth exit animation on removing an item
  const handleAnimatedRemove = (id, pack, e) => {
    const itemCard = e.currentTarget.closest(".cart-product-item");
    if (itemCard) {
      gsap.to(itemCard, {
        x: 60,
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          removeItem(id, pack);
        },
      });
    } else {
      removeItem(id, pack);
    }
  };

  // Interactive Add-on addition animation with square button feedback
  const handleAddAddon = (addonItem, e) => {
    const btn = e.currentTarget;
    if (btn) {
      gsap.fromTo(
        btn,
        { scale: 0.88 },
        { scale: 1, duration: 0.25, ease: "back.out(2.2)" },
      );
    }
    setAddedAddons((prev) => ({ ...prev, [addonItem.id]: true }));
    addToCart(addonItem);
    setTimeout(() => {
      setAddedAddons((prev) => ({ ...prev, [addonItem.id]: false }));
    }, 1400);
  };

  // Promo code submission
  const applyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    if (code === "CLEAN10") {
      setDiscountPercent(10);
      setAppliedPromoCode("CLEAN10");
      setShowPromoPopup(true);
      setPromoInputOpen(false);
    } else if (code === "ORGANIC") {
      setDiscountPercent(15);
      setAppliedPromoCode("ORGANIC");
      setShowPromoPopup(true);
      setPromoInputOpen(false);
    } else if (code === "FRESH") {
      setDiscountPercent(20);
      setAppliedPromoCode("FRESH");
      setShowPromoPopup(true);
      setPromoInputOpen(false);
    } else {
      setPromoError("Invalid code. Try CLEAN10, ORGANIC, or FRESH");
      if (errorRef.current) {
        gsap.fromTo(
          errorRef.current,
          { x: -6 },
          { x: 6, duration: 0.07, repeat: 4, yoyo: true, ease: "power1.inOut" },
        );
      }
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = isFreeShipping ? 0 : 120;
  const taxAmount = Math.round(subtotal * 0.05);
  const finalTotal = Math.max(
    0,
    subtotal - discountAmount + shippingFee + taxAmount,
  );

  const handleCheckoutSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const bankNames = {
      hdfc: "HDFC Bank",
      sbi: "State Bank of India",
      icici: "ICICI Bank",
      axis: "Axis Bank",
      kotak: "Kotak Mahindra Bank",
      pnb: "Punjab National Bank",
      bob: "Bank of Baroda",
      canara: "Canara Bank",
      union: "Union Bank of India",
      indusind: "IndusInd Bank",
      yes: "Yes Bank",
      idfc: "IDFC FIRST Bank",
      federal: "Federal Bank",
    };

    const walletNames = {
      paytm: "Paytm Wallet",
      amazonpay: "Amazon Pay",
      phonepe: "PhonePe Wallet",
      mobikwik: "MobiKwik ZIP",
    };

    let paymentLabel = "UPI";
    if (paymentTab === "card") {
      const last4 = cardData.number
        ? cardData.number.replace(/\s+/g, "").slice(-4)
        : "8921";
      paymentLabel = `Card (**** ${last4})`;
    } else if (paymentTab === "netbanking") {
      paymentLabel = `Net Banking (${bankNames[selectedBank] || "HDFC Bank"})`;
    } else if (paymentTab === "wallets") {
      paymentLabel = `Wallet (${walletNames[selectedWallet] || "Paytm Wallet"})`;
    }

    setIsProcessingPayment(true);
    if (paymentTab === "netbanking") {
      setProcessingMessage(
        `Connecting securely to ${bankNames[selectedBank] || "Bank"} NetBanking portal...`,
      );
    } else if (paymentTab === "card") {
      setProcessingMessage("Authenticating 3D-Secure 2.0 with bank issuer...");
    } else if (paymentTab === "wallets") {
      setProcessingMessage(
        `Authorizing payment with ${walletNames[selectedWallet] || "Wallet"}...`,
      );
    } else {
      setProcessingMessage(
        "Awaiting instant UPI payment verification from NPCI...",
      );
    }

    setTimeout(() => {
      triggerTransition(() => {
        setIsProcessingPayment(false);
        completeOrder({
          ...formData,
          paymentLabel,
          paymentMethod: paymentTab,
          finalTotal,
          discountAmount,
        });
      });
    }, 1000);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && !isCartOpen && (
        <div className="fixed bottom-6 right-6 z-60 max-w-sm w-full bg-neutral-950 text-white shadow-2xl rounded-none p-3 pr-4 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 fade-in duration-300 border border-black/10">
          {toastMessage.image && (
            <div className="w-12 h-12 shrink-0 bg-white/10 rounded-none p-1.5 flex items-center justify-center border border-blue-900/10">
              <img
                src={toastMessage.image}
                alt={toastMessage.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="font-jakarta text-[10px] font-semibold uppercase tracking-wider text-white block">
              Added to Bag
            </span>
            <p className="font-jakarta text-xs font-semibold text-white truncate mt-0.5">
              {toastMessage.title}
            </p>
            <p className="font-jakarta text-[11px] text-neutral-400 truncate">
              {toastMessage.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="font-jakarta px-3.5 py-1.5 bg-white/15 hover:bg-white text-white hover:text-black text-[11px] font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer shrink-0"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Subtle Dark Backdrop */}
          <div
            ref={backdropRef}
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
            }}
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel - Light Theme Organic Artisanal Aesthetic (Extended Width, No Dark Theme, No Glow) */}
          <div
            ref={drawerPanelRef}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-[580px] h-full bg-white border-l border-neutral-200 flex flex-col z-10 overscroll-contain overflow-hidden text-neutral-900 shadow-2xl"
          >
            {/* Header: Square Back Button on Left, Centered 'Your Cart' Title, 'Edit' on Right */}
            <div
              ref={headerRef}
              className="relative z-10 px-4 sm:px-6 pt-[calc(var(--sat)+0.75rem)] sm:pt-[calc(var(--sat)+1rem)] pb-3.5 sm:pb-4 flex items-center justify-between border-b border-black/5 bg-white/95 sm:bg-white/70 sm:backdrop-blur-md shrink-0"
            >
              {/* Back Arrow Button (Square Glass Button - Reduced Compact Size) */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                }}
                aria-label="Back to store"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-white hover:bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-800 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.25}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Centered Title: font-ntsomic with 'Your' and 'Cart' - Reduced size on mobile */}
              <div className="text-center">
                <h3 className="font-ntsomic text-lg sm:text-xl font-normal tracking-wide text-neutral-900">
                  Your <span className="text-neutral-900">Cart</span>
                </h3>
              </div>

              {/* Edit / Done button on right */}
              <button
                type="button"
                onClick={() => setIsEditingCart(!isEditingCart)}
                className="font-poppins text-xs sm:text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer px-2 py-1"
              >
                {isEditingCart ? "Done" : "Edit"}
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div
              ref={scrollContainerRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              onWheel={(e) => e.stopPropagation()}
              className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden ${items.length === 0 ? "px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center items-center" : "px-4 sm:px-6 py-4 sm:py-5 pb-10 space-y-3.5 sm:space-y-4.5"} scroll-smooth overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-none hover:[&::-webkit-scrollbar-thumb]:bg-black/20`}
            >
              {items.length === 0 ? (
                /* Empty Cart Screen: Clean Organic Artisanal Aesthetic with Asul & Zesty Splashing Box (Reduced on Mobile) */
                <div className="relative w-full flex flex-col justify-center items-center my-auto py-4 sm:py-6">
                  {/* Center Content Section */}
                  <div className="w-full flex flex-col items-center text-center relative z-10">
                    {/* Handwritten Callout: Looks a little empty around here! */}
                    <div className="relative w-full max-w-[280px] sm:max-w-[360px] flex flex-col items-center">
                      {/* Zesty Box Artwork with Splashing Citrus & Drops */}
                    </div>

                    {/* Headline & Description in Asul - Reduced on mobile */}
                    <h4 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-2 mb-1.5">
                      Your cart is empty
                    </h4>
                    <p className="font-jakarta text-[11px] sm:text-xs text-neutral-500 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed mb-5 font-medium">
                      Discover cold-pressed organic formulations from our 4
                      signature editions.
                    </p>

                    {/* Explore 4 Editions Pill Button: Solid Original Orange, No Leaf, No Glow */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        const el = document.querySelector("#flavors");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="group inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-2.5 sm:py-3.5 bg-black hover:bg-neutral-800 text-white font-jakarta font-bold text-[11px] sm:text-xs uppercase tracking-widest rounded-none shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      <span>Explore 4 Editions</span>
                      {/* Right Arrow */}
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Luxury Delivery Status Bar with Animated Chilled Van */}
                  <div className="bg-white border border-neutral-200 rounded-none shadow-sm px-4 sm:px-5 py-3 sm:py-4 transition-all overflow-hidden relative">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-poppins mb-2.5 sm:mb-3">
                      <span className="font-medium text-neutral-800 flex items-center gap-1.5">
                        {isFreeShipping ? (
                          <span className="text-neutral-950 font-semibold flex items-center gap-1 sm:gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Complimentary Chilled Delivery Unlocked!
                          </span>
                        ) : (
                          <span>
                            You're{" "}
                            <span className="font-semibold text-neutral-950 font-dacomment text-xs sm:text-[13px]">
                              <span className="font-sans">₹</span>
                              {freeShippingLeft}
                            </span>{" "}
                            away from{" "}
                            <span className="font-semibold text-neutral-950">
                              Free Chilled Delivery
                            </span>
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 font-ntsomic bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded-md">
                        {Math.round(
                          Math.min(
                            100,
                            (subtotal / freeShippingThreshold) * 100,
                          ),
                        )}
                        %
                      </span>
                    </div>

                    {/* Animated Delivery Road Track with Van */}
                    <div className="relative pt-2.5 pb-1">
                      {/* Base road track */}
                      <div className="w-full h-1.5 bg-neutral-100 rounded-none overflow-hidden relative">
                        <div
                          ref={progressBarRef}
                          className="h-full bg-neutral-950 rounded-none transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                          }}
                        />
                      </div>

                      {/* Animated Chilled Delivery Van driving smoothly along the track */}
                      <div
                        ref={deliveryVanRef}
                        className="absolute -top-3.5 transition-all duration-500 ease-out pointer-events-none z-10"
                        style={{
                          left: `calc(${Math.min(94, Math.max(0, Math.round((subtotal / freeShippingThreshold) * 100)))}% - 14px)`,
                        }}
                      >
                        <div className="w-4 h-4 rounded-none bg-neutral-900 border-2 border-white shadow-sm"></div>
                      </div>

                      {/* Destination Finish Point */}
                      <div className="absolute -right-0.5 -top-2.5 flex items-center justify-center pointer-events-none">
                        {isFreeShipping ? (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-none bg-emerald-600 text-white flex items-center justify-center text-[8px] sm:text-[9px] font-medium shadow-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-none border border-neutral-400 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-none bg-white0" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cart Product Items Container - Clean Light Cards with Asul Font (Reduced on mobile) */}
                  <div
                    ref={itemsContainerRef}
                    className="space-y-3.5 sm:space-y-4"
                  >
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.pack}`}
                        className="cart-product-item bg-white border border-neutral-200 rounded-none shadow-xs p-3.5 sm:p-5 flex gap-4 sm:gap-5 items-center transition-all duration-200"
                      >
                        {/* Square Image Box */}
                        <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-none bg-neutral-50 border border-black/5 flex items-center justify-center p-1.5 sm:p-2.5 shrink-0 relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        {/* Product Info & Stepper */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          {/* Title & Delete button row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-jakarta font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-neutral-900 leading-snug truncate">
                                {item.title}
                              </h4>
                              <p className="font-jakarta text-[9px] sm:text-[10px] text-neutral-500 font-medium uppercase tracking-widest mt-1 truncate">
                                {item.packName || "500ml Single Can"} /{" "}
                                {item.edition}
                              </p>
                            </div>

                            {/* Trash Icon Button (Square Button) */}
                            <button
                              type="button"
                              onClick={(e) =>
                                handleAnimatedRemove(item.id, item.pack, e)
                              }
                              aria-label="Remove item"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-neutral-100/80 hover:bg-neutral-200 text-neutral-400 hover:text-black border border-black/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <svg
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Price & Quantity Stepper row */}
                          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 border-t border-black/5">
                            {/* Price in modern tabular Outfit numerals */}
                            <div>
                              <span className="font-jakarta tabular-nums font-bricolage font-extrabold text-xs sm:text-[13px] text-neutral-900">
                                ₹{item.totalPrice * item.qty}
                              </span>
                              {item.qty > 1 && (
                                <span className="font-jakarta tabular-nums font-bricolage block text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                                  ₹{item.totalPrice} each
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper with SQUARE BUTTONS */}
                            <div className="qty-stepper-container flex items-center gap-1 sm:gap-1.5 bg-neutral-100 border border-black/10 rounded-none p-0.5 sm:p-1">
                              {/* Square Minus Button */}
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleQtyClick(item.id, item.pack, -1, e)
                                }
                                aria-label="Decrease quantity"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px] sm:text-xs font-bold border border-black/5 transition-colors cursor-pointer"
                              >
                                &minus;
                              </button>

                              {/* Number */}
                              <span className="qty-display-number w-5 sm:w-7 text-center font-jakarta text-[10px] sm:text-[11px] font-bold text-neutral-900 inline-block tabular-nums font-bricolage">
                                {item.qty}
                              </span>

                              {/* Square Plus Button */}
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleQtyClick(item.id, item.pack, 1, e)
                                }
                                aria-label="Increase quantity"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px] sm:text-xs font-bold border border-black/5 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Add-ons Section - Scaled down for mobile */}
                  <div ref={addonsRef} className="pt-1.5 sm:pt-2">
                    <span className="font-jakarta text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2.5">
                      Recommended Add-ons
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* Wild Strawberry Addon */}
                      <div className="bg-white border border-neutral-200 rounded-none shadow-sm p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 transition-all">
                        <img
                          src="/assets/straw-can-hero.png"
                          alt="Wild Strawberry"
                          className="w-7 h-9 sm:w-9 sm:h-11 object-contain shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-jakarta text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-neutral-900 truncate">
                            Wild Strawberry
                          </h5>
                          <span className="font-jakarta text-[10px] sm:text-[11px] font-bold text-neutral-500 block mt-0.5">
                            ₹350
                          </span>
                        </div>
                        {/* Square Add Button */}
                        <button
                          type="button"
                          onClick={(e) =>
                            handleAddAddon(
                              {
                                id: "strawberry",
                                title: "Wild Strawberry",
                                badgeText: "Edition 02",
                                image: "/assets/straw-can-hero.png",
                                tagColor: "#D90429",
                              },
                              e,
                            )
                          }
                          className={`font-jakarta px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-none border text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shrink-0 ${
                            addedAddons["strawberry"]
                              ? "bg-black text-white rounded-none border-neutral-900"
                              : "bg-white hover:bg-black hover:text-blue-700 border-black/15 text-black"
                          }`}
                        >
                          {addedAddons["strawberry"] ? "Added" : "Add"}
                        </button>
                      </div>

                      {/* Black Cherry Addon */}
                      <div className="bg-white border border-neutral-200 rounded-none shadow-sm p-2.5 sm:p-3 flex items-center gap-2 sm:gap-2.5 transition-all">
                        <img
                          src="/assets/cherry-can-hero.png"
                          alt="Black Cherry"
                          className="w-7 h-9 sm:w-9 sm:h-11 object-contain shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-jakarta text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-neutral-900 truncate">
                            Black Cherry
                          </h5>
                          <span className="font-jakarta text-[10px] sm:text-[11px] font-bold text-neutral-500 block mt-0.5">
                            ₹350
                          </span>
                        </div>
                        {/* Square Add Button */}
                        <button
                          type="button"
                          onClick={(e) =>
                            handleAddAddon(
                              {
                                id: "cherry",
                                title: "Black Cherry",
                                badgeText: "Edition 03",
                                image: "/assets/cherry-can-hero.png",
                                tagColor: "#9B111E",
                              },
                              e,
                            )
                          }
                          className={`font-jakarta px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-none border text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shrink-0 ${
                            addedAddons["cherry"]
                              ? "bg-black text-white rounded-none border-neutral-900"
                              : "bg-white hover:bg-black hover:text-blue-700 border-black/15 text-black"
                          }`}
                        >
                          {addedAddons["cherry"] ? "Added" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer & Checkout Controls (Clean Light Theme) - Scaled font sizes for mobile */}
            {items.length > 0 && (
              <div
                ref={footerRef}
                className="relative z-10 px-4 sm:px-6 py-4 sm:py-5 border-t border-black/5 bg-white sm:bg-white/95 sm:backdrop-blur-md space-y-3 sm:space-y-4 shrink-0 shadow-lg"
              >
                {/* Bill Breakdown - Reduced font size on mobile */}
                <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-neutral-500 font-jakarta">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-black font-extrabold tabular-nums font-bricolage">
                      ₹{subtotal}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-extrabold tabular-nums font-bricolage">
                        -₹{discountAmount}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-black font-extrabold tabular-nums font-bricolage">
                      {isFreeShipping ? "₹0.00" : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Chilled Logistics</span>
                    <span className="text-black font-extrabold tabular-nums font-bricolage">
                      ₹{taxAmount}
                    </span>
                  </div>

                  {/* Total row in Clean Font */}
                  <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-black/10 mt-1">
                    <span className="font-jakarta text-xs sm:text-sm font-extrabold text-black tracking-widest uppercase">
                      Total
                    </span>
                    <span className="font-jakarta tabular-nums font-bricolage text-xl sm:text-2xl font-black text-black">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Promo Code Box: Clean Light Pill with Tag Icon */}
                {!promoInputOpen ? (
                  <button
                    type="button"
                    onClick={() => setPromoInputOpen(true)}
                    className="w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-none bg-neutral-100 hover:bg-black hover:text-blue-700 border-none flex items-center justify-between text-black text-[10px] sm:text-[11px] font-jakarta font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span>
                        {appliedPromoCode
                          ? `Promo Applied: ${appliedPromoCode}`
                          : "Add promo code"}
                      </span>
                    </div>
                  </button>
                ) : (
                  <form
                    onSubmit={applyPromo}
                    className="relative flex items-center gap-2 font-jakarta"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ENTER CODE"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-none text-[10px] sm:text-[11px] font-jakarta font-bold text-black uppercase tracking-widest outline-none focus:border-black"
                        autoFocus
                      />
                    </div>
                    {/* Square Apply Button */}
                    <button
                      type="submit"
                      className="px-4 sm:px-5 py-2.5 sm:py-3 bg-black hover:bg-neutral-800 text-white text-[10px] sm:text-[11px] font-jakarta font-bold uppercase tracking-widest rounded-none transition-all cursor-pointer shrink-0 shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoError && (
                  <p
                    ref={errorRef}
                    className="font-poppins text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-none"
                  >
                    {promoError}
                  </p>
                )}

                {/* Primary PROCEED TO CHECKOUT CTA in Luxury Deep Charcoal with Square Arrow Button */}
                <div className="pt-0.5 sm:pt-1 pb-[calc(var(--sab)+0.5rem)]">
                  <button
                    ref={checkoutBtnRef}
                    type="button"
                    onClick={() =>
                      triggerTransition(() => setIsCheckingOut(true))
                    }
                    className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-1.5 sm:pr-2 rounded-none bg-neutral-950 hover:bg-black text-white flex items-center justify-between transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-98"
                  >
                    <span className="font-jakarta text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                      PROCEED TO CHECKOUT
                    </span>
                    {/* Square Arrow Button */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.25}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Warm Editorial Checkout Page */}
      {isCheckingOut && (
        <div
          id="checkout-root"
          ref={checkoutContainerRef}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-60 w-full h-dvh bg-[#F5F2EB] text-[#1C1917] font-ntsomic overflow-y-auto selection:bg-[#D94814] selection:text-white flex flex-col"
        >
          {isProcessingPayment && (
            <div className="fixed inset-0 bg-[#F5F2EB]/90 backdrop-blur-md z-70 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 border-2 border-[#DFD7CA] border-t-[#D94814] rounded-full animate-spin mb-5" />
              <h4 className="text-base font-medium tracking-[0.2em] text-[#1C1917] uppercase mb-2">
                Processing Secure Order
              </h4>
              <p className="text-xs text-[#78716C] tracking-widest uppercase font-medium">
                {processingMessage || "Connecting to secure payment gateway..."}
              </p>
            </div>
          )}

          {/* Clean Header Bar - Removed SSL text as requested */}
          <header className="w-full border-b border-[#DFD7CA] bg-[#F5F2EB]/95 backdrop-blur-xs px-6 sm:px-12 py-5 flex items-center justify-between shrink-0 z-10">
            <button
              type="button"
              onClick={() => triggerTransition(() => setIsCheckingOut(false))}
              className="checkout-stagger group flex items-center gap-2 text-[#78716C] hover:text-[#D94814] transition-colors text-xs sm:text-sm font-medium uppercase tracking-widest cursor-pointer"
            >
              <span className="group-hover:-translate-x-1.5 transition-transform">←</span>
              <span>Return to Cart</span>
            </button>

            <div className="checkout-stagger">
              <h1 className="text-sm sm:text-base font-medium tracking-[0.3em] uppercase text-[#1C1917]">
                Checkout
              </h1>
            </div>

            {/* Symmetrical placeholder */}
            <div className="w-24 sm:w-32 hidden sm:block" />
          </header>

          {/* Full Page Canvas Grid - Like a page, NOT in cards! */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 lg:py-12 flex flex-col justify-start">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* 01: DELIVERY ADDRESS */}
              <section className="lg:col-span-4 flex flex-col gap-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#DFD7CA]">
                  <span className="checkout-stagger font-bricolage text-2xl sm:text-3xl text-[#D94814] font-medium leading-none tabular-nums">
                    01
                  </span>
                  <h2 className="checkout-stagger text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-[#1C1917]">
                    Delivery Address
                  </h2>
                </div>

                <div className="checkout-stagger">
                  {!isAddressEditing ? (
                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base sm:text-lg font-medium uppercase tracking-wide text-[#1C1917]">
                          {formData.fullName || "Jeevanantham S"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsAddressEditing(true)}
                          className="text-xs font-medium uppercase tracking-widest text-[#78716C] hover:text-[#D94814] transition-colors cursor-pointer"
                        >
                          [ Edit ]
                        </button>
                      </div>
                      <div className="text-sm sm:text-base text-[#78716C]">
                        +91{" "}
                        <span className="font-bricolage tabular-nums text-[#1C1917] font-medium">
                          {formData.phone || "8015797323"}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-[#57534E] pt-1">
                        {formData.address || "Thevur"},{" "}
                        {formData.city || "Salem"}
                        <br />
                        <span className="font-bricolage tabular-nums font-medium text-[#1C1917]">
                          {formData.pincode || "637104"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full bg-transparent border-b border-[#DFD7CA] focus:border-[#1C1917] py-2 text-sm sm:text-base text-[#1C1917] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full bg-transparent border-b border-[#DFD7CA] focus:border-[#1C1917] py-2 text-sm sm:text-base font-bricolage tabular-nums text-[#1C1917] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1">
                            Pincode
                          </label>
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) =>
                              setFormData({ ...formData, pincode: e.target.value })
                            }
                            className="w-full bg-transparent border-b border-[#DFD7CA] focus:border-[#1C1917] py-2 text-sm sm:text-base font-bricolage tabular-nums text-[#1C1917] outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1">
                          Address & City
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="w-full bg-transparent border-b border-[#DFD7CA] focus:border-[#1C1917] py-2 text-sm sm:text-base text-[#1C1917] outline-none mb-2"
                          placeholder="Street / Area"
                        />
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full bg-transparent border-b border-[#DFD7CA] focus:border-[#1C1917] py-2 text-sm sm:text-base text-[#1C1917] outline-none"
                          placeholder="City"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddressEditing(false)}
                        className="py-2.5 px-6 bg-[#1C1917] hover:bg-[#D94814] text-[#F5F2EB] text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer rounded-xs"
                      >
                        Confirm Address
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* 02: ORDER SUMMARY */}
              <section className="lg:col-span-4 flex flex-col gap-6 lg:border-x lg:border-[#DFD7CA] lg:px-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#DFD7CA]">
                  <div className="flex items-center gap-3">
                    <span className="checkout-stagger font-bricolage text-2xl sm:text-3xl text-[#D94814] font-medium leading-none tabular-nums">
                      02
                    </span>
                    <h2 className="checkout-stagger text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-[#1C1917]">
                      Order Summary
                    </h2>
                  </div>
                  <span className="checkout-stagger text-xs sm:text-sm text-[#78716C] tracking-wider uppercase">
                    <span className="font-bricolage tabular-nums font-medium text-[#1C1917]">
                      {items.reduce((s, it) => s + it.qty, 0)}
                    </span>{" "}
                    {items.reduce((s, it) => s + it.qty, 0) === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items list - Zero cards, clean editorial rows */}
                <div className="checkout-stagger max-h-[300px] overflow-y-auto space-y-4 pr-1">
                  {items.map((it) => (
                    <div
                      key={it.id + it.pack}
                      className="flex items-center justify-between gap-4 py-2 border-b border-[#DFD7CA]/40 last:border-0"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {it.image && (
                          <div className="w-12 h-12 bg-[#ECE7DF] rounded-xs p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex flex-col">
                          <span className="text-sm sm:text-base font-medium uppercase tracking-wide text-[#1C1917] truncate">
                            {it.title}
                          </span>
                          <span className="text-xs text-[#78716C] tracking-wider uppercase">
                            {it.pack || "500ML"} &times;{" "}
                            <span className="font-bricolage tabular-nums font-medium text-[#1C1917]">
                              {it.qty}
                            </span>
                          </span>
                        </div>
                      </div>
                      <span className="font-bricolage font-medium tabular-nums text-sm sm:text-base text-[#1C1917] shrink-0">
                        ₹{it.totalPrice * it.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Taxes breakdown */}
                <div className="checkout-stagger pt-4 border-t border-[#DFD7CA] space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm uppercase tracking-wider text-[#78716C]">
                    <span>Subtotal</span>
                    <span className="font-bricolage tabular-nums font-medium text-[#1C1917]">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm uppercase tracking-wider text-[#78716C]">
                    <span>Shipping</span>
                    <span className="font-bricolage tabular-nums font-medium text-[#D94814]">
                      {isFreeShipping ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm uppercase tracking-wider text-[#78716C]">
                    <span>Taxes</span>
                    <span className="font-bricolage tabular-nums font-medium text-[#1C1917]">
                      ₹{taxAmount}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm uppercase tracking-wider text-[#D94814]">
                      <span>Discount ({appliedPromoCode})</span>
                      <span className="font-bricolage tabular-nums font-medium">
                        -₹{discountAmount}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* 03: PAYMENT METHOD & TOTAL */}
              <section className="lg:col-span-4 flex flex-col gap-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#DFD7CA]">
                  <span className="checkout-stagger font-bricolage text-2xl sm:text-3xl text-[#D94814] font-medium leading-none tabular-nums">
                    03
                  </span>
                  <h2 className="checkout-stagger text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-[#1C1917]">
                    Payment Method
                  </h2>
                </div>

                {/* Payment Tabs */}
                <div className="checkout-stagger flex border-b border-[#DFD7CA] gap-6 sm:gap-8">
                  {[
                    { id: "upi", label: "UPI" },
                    { id: "card", label: "CARD" },
                    { id: "netbanking", label: "BANK" },
                    { id: "wallets", label: "WALLET" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentTab(tab.id)}
                      className={`pb-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest transition-all cursor-pointer relative ${
                        paymentTab === tab.id
                          ? "text-[#1C1917]"
                          : "text-[#78716C] hover:text-[#1C1917]"
                      }`}
                    >
                      {tab.label}
                      {paymentTab === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1C1917]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab 1: UPI */}
                {paymentTab === "upi" && (
                  <div className="checkout-tab-content space-y-5">
                    {/* Scan QR */}
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-2.5">
                        SCAN QR TO PAY
                      </span>
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-white p-1.5 border border-[#DFD7CA] rounded-xs shrink-0 shadow-2xs">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                            className="w-full h-full"
                            alt="Scan QR"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wider text-[#78716C]">
                            Scan with any UPI app
                          </span>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider text-[#1C1917]">
                            <span>Expires in:</span>
                            <span className="checkout-number-anim font-bricolage tabular-nums text-[#D94814] font-medium text-base sm:text-lg">
                              {formatCountdown(qrCountdown)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Pay with user's exact logos */}
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-2.5">
                        OR SELECT APP
                      </span>
                      <div className="grid grid-cols-4 gap-2.5">
                        {UPI_APPS.map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={(e) => handleUpiAppClick(app.id, e)}
                            className={`h-12 sm:h-14 flex items-center justify-center p-2 border transition-all cursor-pointer rounded-xs ${
                              selectedUpiApp === app.id
                                ? "border-[#1C1917] bg-[#ECE7DF]"
                                : "border-[#DFD7CA] hover:border-[#1C1917]/50 bg-[#FAF7F2]"
                            }`}
                            title={app.name}
                          >
                            {app.icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual UPI ID */}
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-2">
                        OR ENTER UPI ID
                      </span>
                      <div className="flex border border-[#DFD7CA] focus-within:border-[#1C1917] transition-colors rounded-xs bg-[#FAF7F2] overflow-hidden">
                        <input
                          type="text"
                          value={customUpiId}
                          onChange={(e) => {
                            setCustomUpiId(e.target.value);
                            setUpiError("");
                          }}
                          placeholder="username@upi"
                          className="flex-1 py-2.5 px-3.5 bg-transparent outline-none text-xs sm:text-sm text-[#1C1917]"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          className={`px-4 text-xs uppercase font-medium tracking-wider transition-colors cursor-pointer ${
                            upiVerifying
                              ? "bg-[#DFD7CA] text-[#78716C]"
                              : upiVerified
                              ? "bg-emerald-700 text-white"
                              : "bg-[#1C1917] text-[#F5F2EB] hover:bg-[#D94814]"
                          }`}
                        >
                          {upiVerifying ? "..." : upiVerified ? "VERIFIED" : "VERIFY"}
                        </button>
                      </div>
                      {upiError && (
                        <p className="text-[#D94814] text-xs mt-1 font-medium tracking-wide">
                          {upiError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Card */}
                {paymentTab === "card" && (
                  <div className="checkout-tab-content space-y-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1.5">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4000 1234 5678 9010"
                        value={cardData.number}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            number: e.target.value
                              .replace(/\D/g, "")
                              .replace(/(.{4})/g, "$1 ")
                              .trim(),
                          })
                        }
                        className="w-full bg-[#FAF7F2] border border-[#DFD7CA] px-3.5 py-2.5 text-sm font-bricolage tabular-nums text-[#1C1917] rounded-xs outline-none focus:border-[#1C1917]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1.5">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "");
                            if (v.length >= 2)
                              v = v.slice(0, 2) + "/" + v.slice(2, 4);
                            setCardData({ ...cardData, expiry: v });
                          }}
                          className="w-full bg-[#FAF7F2] border border-[#DFD7CA] px-3.5 py-2.5 text-sm font-bricolage tabular-nums text-[#1C1917] rounded-xs outline-none focus:border-[#1C1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1.5">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvv: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          className="w-full bg-[#FAF7F2] border border-[#DFD7CA] px-3.5 py-2.5 text-sm font-bricolage tabular-nums text-[#1C1917] rounded-xs outline-none focus:border-[#1C1917]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C] mb-1.5">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardData.name}
                        onChange={(e) =>
                          setCardData({ ...cardData, name: e.target.value })
                        }
                        className="w-full bg-[#FAF7F2] border border-[#DFD7CA] px-3.5 py-2.5 text-sm uppercase text-[#1C1917] rounded-xs outline-none focus:border-[#1C1917]"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 3: Net Banking */}
                {paymentTab === "netbanking" && (
                  <div className="checkout-tab-content space-y-3">
                    <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C]">
                      Select Bank
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {BANK_OPTIONS.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={(e) => handleBankClick(bank.id, e)}
                          className={`p-2.5 border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xs ${
                            selectedBank === bank.id
                              ? "border-[#1C1917] bg-[#ECE7DF]"
                              : "border-[#DFD7CA] hover:border-[#1C1917]/50 bg-[#FAF7F2]"
                          }`}
                        >
                          <div className="scale-75 origin-center">{bank.logo}</div>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#1C1917] truncate w-full text-center">
                            {bank.name.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Wallets */}
                {paymentTab === "wallets" && (
                  <div className="checkout-tab-content space-y-3">
                    <label className="block text-xs font-medium uppercase tracking-widest text-[#78716C]">
                      Select Wallet
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {WALLET_OPTIONS.map((wallet) => (
                        <button
                          key={wallet.id}
                          type="button"
                          onClick={(e) => handleWalletClick(wallet.id, e)}
                          className={`p-3.5 border transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs ${
                            selectedWallet === wallet.id
                              ? "border-[#1C1917] bg-[#ECE7DF]"
                              : "border-[#DFD7CA] hover:border-[#1C1917]/50 bg-[#FAF7F2]"
                          }`}
                        >
                          <div className="scale-75 origin-center">{wallet.logo}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & Place Order Button - Removed bottom text as requested */}
                <div className="checkout-stagger pt-6 border-t border-[#DFD7CA] space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[#78716C]">
                      TOTAL
                    </span>
                    <GsapCounter
                      value={finalTotal}
                      prefix="₹"
                      duration={0.8}
                      className="checkout-number-anim text-3xl sm:text-4xl tabular-nums font-bricolage font-medium text-[#D94814]"
                      triggerKey={finalTotal}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    disabled={isProcessingPayment}
                    className="group w-full py-4.5 sm:py-5 bg-[#1C1917] hover:bg-[#D94814] text-[#F5F2EB] text-xs sm:text-sm font-medium uppercase tracking-widest flex items-center justify-between px-6 sm:px-8 transition-all duration-300 disabled:opacity-50 cursor-pointer rounded-xs shadow-md"
                  >
                    <span>{isProcessingPayment ? "PROCESSING..." : "CONFIRM & PAY"}</span>
                    <span className="font-bricolage tabular-nums text-base sm:text-lg font-medium flex items-center gap-2">
                      ₹{finalTotal}
                      <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                    </span>
                  </button>
                </div>
              </section>

            </div>
          </main>
        </div>
      )}

      {/* Order Confirmed Success Screen - Artisanal Linen Aesthetic */}
      {orderConfirmed && (
        <div
          id="order-confirmed-root"
          className="fixed inset-0 z-70 bg-[#F5F2EB] text-[#1C1917] flex flex-col items-center justify-center font-ntsomic p-6"
        >
          <div className="w-full max-w-lg p-8 sm:p-10 border border-[#DFD7CA] bg-[#FAF7F2] rounded-sm shadow-sm flex flex-col items-center text-center">
            <div className="order-confirm-badge w-16 h-16 rounded-full bg-[#ECE7DF] flex items-center justify-center text-[#D94814] mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="order-confirm-content text-2xl sm:text-3xl font-medium uppercase tracking-[0.2em] mb-3 text-[#1C1917]">
              Order Confirmed
            </h2>

            <p className="order-confirm-content text-xs sm:text-sm text-[#78716C] mb-6 max-w-sm leading-relaxed tracking-wide">
              Your raw organic nectar order has been placed securely and queued for cold-chain dispatch.
            </p>

            <div className="order-confirm-receipt w-full bg-[#ECE7DF]/70 border border-[#DFD7CA] p-4 rounded-sm mb-6 flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78716C] uppercase tracking-wider">Reference ID</span>
                <span className="font-bricolage font-medium tabular-nums text-[#1C1917]">
                  {orderConfirmed.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C] uppercase tracking-wider">Amount Paid</span>
                <span className="font-bricolage font-medium tabular-nums text-[#D94814]">
                  ₹{orderConfirmed.finalTotal || finalTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C] uppercase tracking-wider">Payment Method</span>
                <span className="uppercase tracking-wider text-[#1C1917]">
                  {orderConfirmed.paymentLabel || "UPI Express"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setOrderConfirmed(null);
                setIsCartOpen(false);
                setIsCheckingOut(false);
              }}
              className="order-confirm-btn w-full py-3.5 bg-[#1C1917] hover:bg-[#D94814] text-[#F5F2EB] text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer rounded-sm shadow-xs"
            >
              Return to Store
            </button>
          </div>
        </div>
      )}
      
      {showPromoPopup && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            ref={promoPopupRef}
            className="relative w-full max-w-[340px] bg-white rounded-none p-7 z-10 text-center border border-black/10 shadow-2xl text-neutral-900 font-jakarta"
          >
            <div className="w-12 h-12 rounded-none bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>

            <h4 className="font-jakarta text-lg font-bold text-neutral-900 mb-1">
              Coupon Applied!
            </h4>
            <p className="font-jakarta text-xs text-neutral-500 mb-5">
              Code{" "}
              <span className="text-emerald-600 font-bold">
                {appliedPromoCode}
              </span>{" "}
              unlocked {discountPercent}% off your cart.
            </p>

            <button
              type="button"
              onClick={() => setShowPromoPopup(false)}
              className="font-jakarta w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer shadow-md"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
