import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { usePageTransition } from "../context/PageTransitionContext";
import gsap from "gsap";
import { GsapCounter } from "./GsapText";
import confetti from "canvas-confetti";

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
          fontFamily="'Poppins', sans-serif"
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
          fontFamily="'Poppins', sans-serif"
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
          fontFamily="'Poppins', sans-serif"
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
          fontFamily="'Poppins', sans-serif"
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
          fontFamily="'Poppins', sans-serif"
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
          fontFamily="'Poppins', sans-serif"
          fontWeight="900"
          fontSize="11"
        >
          M
        </text>
        <text
          x="24"
          y="15.5"
          fill="#FFFFFF"
          fontFamily="'Poppins', sans-serif"
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
  const isClosingRef = useRef(false);

  // Checkout Modal GSAP Animation Refs
  const checkoutModalRef = useRef(null);
  const checkoutContainerRef = useRef(null);
  const checkoutScrollProgressRef = useRef(null);
  const checkoutHeadlineRef = useRef(null);
  const checkoutCanRef = useRef(null);
  const checkoutCardRef = useRef(null);
  const checkoutBlueCardRef = useRef(null);

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

  // High-performance GSAP Close Animation (Smooth return from Cart to Hero page with NO LAG)
  const closeCartWithAnimation = (callback) => {
    if (isClosingRef.current) return;
    if (drawerPanelRef.current) {
      isClosingRef.current = true;
      const tl = gsap.timeline({
        onComplete: () => {
          setIsCartOpen(false);
          setIsCheckingOut(false);
          isClosingRef.current = false;
          if (callback && typeof callback === "function") callback();
        },
      });

      if (backdropRef.current) {
        tl.to(
          backdropRef.current,
          { opacity: 0, duration: 0.25, ease: "power2.in" },
          0,
        );
      }

      tl.to(
        drawerPanelRef.current,
        {
          x: "100%",
          duration: 0.3,
          ease: "power3.in",
          force3D: true,
        },
        0,
      );
    } else {
      setIsCartOpen(false);
      setIsCheckingOut(false);
      if (callback && typeof callback === "function") callback();
    }
  };

  // GSAP Opening Entrance Animations - Silky 60/120fps with NO LAG
  useEffect(() => {
    if (isCartOpen && drawerPanelRef.current) {
      isClosingRef.current = false;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (backdropRef.current) {
        tl.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.28 },
          0,
        );
      }

      tl.fromTo(
        drawerPanelRef.current,
        { x: "100%" },
        {
          x: "0%",
          duration: 0.32,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );
      // NOTE: stagger on .cart-stagger-item removed — it triggered DOM query +
      // multi-element paint on every open causing visible lag on mobile & desktop.
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
    name: userProfile?.fullName || "",
    expiryMM: "",
    expiryYY: "",
    cvv: "",
  });

  useEffect(() => {
    if (userProfile?.fullName) {
      setCardData((prev) => ({
        ...prev,
        name: prev.name ? prev.name : userProfile.fullName,
      }));
    }
  }, [userProfile?.fullName]);

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

  // Realtime Checkout Scroll Handler driving GSAP progress bar and subtle can parallax
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

    if (checkoutCanRef.current) {
      gsap.to(checkoutCanRef.current, {
        y: scrollTop * 0.12,
        duration: 0.25,
        ease: "power1.out",
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

        // 1. Headline reveal
        if (checkoutHeadlineRef.current) {
          tl.fromTo(
            checkoutHeadlineRef.current,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }
          );
        }

        // 2. 3D Juice Can entrance + Continuous Ambient Float
        if (checkoutCanRef.current) {
          tl.fromTo(
            checkoutCanRef.current,
            { scale: 0.82, y: 70, rotation: -5, opacity: 0 },
            {
              scale: 1,
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 1.1,
              ease: "elastic.out(1, 0.75)",
              onComplete: () => {
                gsap.to(checkoutCanRef.current, {
                  y: -14,
                  rotation: 1.5,
                  duration: 3.2,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              },
            },
            "-=0.5"
          );
        }

        // 3. Main Payment Card entrance
        if (checkoutCardRef.current) {
          tl.fromTo(
            checkoutCardRef.current,
            { y: 40, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8 },
            "-=0.7"
          );
        }

        // 4. Stagger internal elements
        tl.fromTo(
          ".checkout-stagger-item",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.04 },
          "-=0.4"
        );

      });
      return () => ctx.revert();
    }
  }, [isCheckingOut]);

  // GSAP Tab Content Switch Transition
  useEffect(() => {
    if (isCheckingOut) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".checkout-tab-body",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" },
      );
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
        closeCartWithAnimation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Promo code submission with birthday celebration confetti
  const applyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    const triggerBirthdayEffects = () => {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#FF69B4", "#7B2CBF", "#00B4D8", "#FF4757", "#2ECC71"],
          disableForReducedMotion: true,
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.65 },
            colors: ["#FFD700", "#FF69B4", "#7B2CBF"],
            disableForReducedMotion: true,
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.65 },
            colors: ["#00B4D8", "#FF4757", "#2ECC71"],
            disableForReducedMotion: true,
          });
        }, 220);
      } catch {
        // Fallback gracefully if canvas is blocked
      }
    };

    if (code === "CLEAN10") {
      setDiscountPercent(10);
      setAppliedPromoCode("CLEAN10");
      setShowPromoPopup(true);
      setPromoInputOpen(false);
      triggerBirthdayEffects();
    } else if (code === "ORGANIC") {
      setDiscountPercent(15);
      setAppliedPromoCode("ORGANIC");
      setShowPromoPopup(true);
      setPromoInputOpen(false);
      triggerBirthdayEffects();
    } else if (code === "FRESH") {
      setDiscountPercent(20);
      setAppliedPromoCode("FRESH");
      setShowPromoPopup(true);
      setPromoInputOpen(false);
      triggerBirthdayEffects();
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
  const shippingFee = isFreeShipping ? 0 : 29;
  const taxAmount = Math.round(subtotal * 0.05);
  const finalTotal = Math.max(
    0,
    subtotal - discountAmount + shippingFee + taxAmount,
  );

  const handleCardPaymentSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsProcessingPayment(true);
    setProcessingMessage("Authenticating secure card transaction with 3D Secure...");

    const last4 = cardData.number ? cardData.number.replace(/\s+/g, "").slice(-4) : "";
    const paymentLabel = last4 ? `Card (•••• ${last4})` : "Card Payment";

    setTimeout(() => {
      setProcessingMessage("Payment Authorized: Verified by Card Network!");
      setTimeout(() => {
        triggerTransition(() => {
          setIsProcessingPayment(false);
          completeOrder({
            ...formData,
            fullName: cardData.name || userProfile?.fullName || formData.fullName || "Customer",
            paymentLabel,
            paymentMethod: "card",
            finalTotal: finalTotal || 488,
            discountAmount: discountAmount || 0,
          });
        });
      }, 500);
    }, 1000);
  };

  const handleUpiPaymentSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsProcessingPayment(true);
    const selectedAppObj = UPI_APPS.find((a) => a.id === selectedUpiApp);
    const appName = selectedAppObj?.name || "UPI";
    const vpaStr = customUpiId.trim();
    setProcessingMessage(`Authorizing instant payment request via ${appName}...`);

    setTimeout(() => {
      setProcessingMessage("NPCI Gateway: Instant payment approved ✓");
      setTimeout(() => {
        triggerTransition(() => {
          setIsProcessingPayment(false);
          completeOrder({
            ...formData,
            fullName: userProfile?.fullName || cardData.name || formData.fullName || "Customer",
            paymentLabel: vpaStr ? `UPI (${selectedAppObj?.shortName || "UPI"} - ${vpaStr})` : `UPI (${selectedAppObj?.shortName || "UPI"})`,
            paymentMethod: "upi",
            finalTotal: finalTotal || 488,
            discountAmount: discountAmount || 0,
          });
        });
      }, 500);
    }, 1000);
  };

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
            onClick={() => closeCartWithAnimation()}
            style={{ opacity: 0, willChange: "opacity" }}
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Drawer Panel - Light Theme Organic Artisanal Aesthetic */}
          <div
            ref={drawerPanelRef}
            style={{ transform: "translateX(100%)", willChange: "transform" }}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-[580px] h-full bg-[#FAF8F5] border-l border-neutral-200 flex flex-col z-10 overscroll-contain overflow-hidden text-neutral-900 shadow-2xl"
          >
            {/* Header: Square Back Button on Left, Centered 'Your Cart' Title, Balanced Spacer on Right */}
            <div
              ref={headerRef}
              className="relative z-10 px-4 sm:px-6 pt-[calc(var(--sat)+0.75rem)] sm:pt-[calc(var(--sat)+1rem)] pb-3.5 sm:pb-4 flex items-center justify-between border-b border-black/5 bg-[#FAF8F5]/95 sm:bg-[#FAF8F5]/80 sm:backdrop-blur-md shrink-0"
            >
              {/* Back Arrow Button */}
              <button
                type="button"
                onClick={() => closeCartWithAnimation()}
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

              {/* Centered Title: font-vagnola */}
              <div className="text-center">
                <h3 className="font-vagnola text-2xl sm:text-3xl font-bold tracking-wide text-neutral-900">
                  Your Cart
                </h3>
              </div>

              {/* Balancing spacer (Edit option removed) */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 pointer-events-none" aria-hidden="true" />
            </div>

            {/* Scrollable Content Container */}
            <div
              ref={scrollContainerRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              onWheel={(e) => e.stopPropagation()}
              className={`relative z-10 flex-1 overflow-y-auto overflow-x-hidden ${items.length === 0 ? "px-4 sm:px-6 pt-3 sm:pt-6 pb-8 sm:pb-12 flex flex-col items-center justify-start" : "px-4 sm:px-6 py-4 sm:py-5 pb-10 space-y-3.5 sm:space-y-4.5"} scroll-smooth overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-none hover:[&::-webkit-scrollbar-thumb]:bg-black/20`}
            >
              {items.length === 0 ? (
                /* Empty Cart Screen: Clean Organic Artisanal Aesthetic with Vagnola & Asul */
                <div className="relative w-full flex flex-col items-center pt-2 sm:pt-4">
                  {/* Subtle warm ambient backlight glow */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-200/35 rounded-full blur-3xl pointer-events-none -z-10" />

                  {/* Center Content Section */}
                  <div className="w-full flex flex-col items-center text-center relative z-10">
                    <div className="relative w-64 sm:w-80 md:w-[340px] max-w-[90%] mb-3 sm:mb-4 flex flex-col items-center justify-center">
                      <img
                        src="/empty-cart-box.png"
                        alt="Empty Zesty Box"
                        className="w-full h-auto max-h-[270px] sm:max-h-[320px] object-contain drop-shadow-lg select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    {/* Headline in Vagnola & Description in Poppins */}
                    <h4 className="font-vagnola text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mt-2 mb-2">
                      Your cart is empty
                    </h4>
                    <p className="font-poppins text-xs sm:text-sm text-neutral-500 max-w-[280px] sm:max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Discover cold-pressed organic formulations from our 4
                      signature editions.
                    </p>

                    {/* Explore 4 Editions Button */}
                    <button
                      type="button"
                      onClick={() => {
                        closeCartWithAnimation(() => {
                          const el = document.querySelector("#flavors");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        });
                      }}
                      className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-3.5 bg-black hover:bg-neutral-800 text-white font-asul font-bold text-xs sm:text-sm uppercase tracking-wider rounded-none shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
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
                  {/* Clean Minimalist Free Delivery Bar */}
                  <div className="cart-stagger-item bg-white border border-neutral-200 rounded-none shadow-xs px-4 sm:px-5 py-3.5 sm:py-4 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                      <p className="font-asul text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">
                        {isFreeShipping ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4 text-emerald-600 shrink-0"
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
                            <span className="font-bricolage font-extrabold text-sm sm:text-base text-neutral-950 tabular-nums">
                              ₹{freeShippingLeft}
                            </span>{" "}
                            away from{" "}
                            <span className="font-bold text-neutral-950">
                              Free Chilled Delivery
                            </span>
                          </span>
                        )}
                      </p>
                      <span className="font-poppins text-xs sm:text-[13px] font-semibold text-neutral-600 tabular-nums bg-neutral-100 px-2 py-0.5 rounded-none shrink-0">
                        {Math.round(
                          Math.min(
                            100,
                            (subtotal / freeShippingThreshold) * 100,
                          ),
                        )}
                        %
                      </span>
                    </div>

                    {/* Minimalist Continuous Progress Bar - Pure smooth track with NO DOTS and NO ICONS */}
                    <div className="w-full h-1.5 sm:h-2 bg-neutral-100 rounded-full overflow-hidden relative">
                      <div
                        ref={progressBarRef}
                        className="h-full bg-neutral-950 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                        }}
                      />
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
                        className="cart-stagger-item cart-product-item bg-white border border-neutral-200 rounded-none shadow-xs p-3.5 sm:p-5 flex gap-4 sm:gap-5 items-center transition-all duration-200"
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
                          {/* Title in Vagnola & Delete button row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-vagnola font-bold text-sm sm:text-base uppercase tracking-wider text-neutral-900 leading-snug">
                                {item.title}
                              </h4>
                              <p className="font-poppins text-[10px] sm:text-[11px] text-neutral-500 font-medium uppercase tracking-widest mt-1 truncate">
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
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                            {/* Price in Bricolage numerals */}
                            <div>
                              <span className="tabular-nums font-bricolage font-extrabold text-sm sm:text-base text-neutral-900">
                                ₹{item.totalPrice * item.qty}
                              </span>
                              {item.qty > 1 && (
                                <span className="tabular-nums font-bricolage block text-[10px] sm:text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
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
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs sm:text-sm font-poppins font-bold border border-black/5 transition-colors cursor-pointer"
                              >
                                &minus;
                              </button>

                              {/* Number */}
                              <span className="qty-display-number w-5 sm:w-7 text-center font-bricolage text-xs sm:text-sm font-bold text-neutral-900 inline-block tabular-nums">
                                {item.qty}
                              </span>

                              {/* Square Plus Button */}
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleQtyClick(item.id, item.pack, 1, e)
                                }
                                aria-label="Increase quantity"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-xs sm:text-sm font-poppins font-bold border border-black/5 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Add-ons Section */}
                  <div ref={addonsRef} className="cart-stagger-item pt-1.5 sm:pt-2">
                    <span className="font-vagnola text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-800 block mb-2.5">
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
                          <h5 className="font-asul text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-900 truncate">
                            Wild Strawberry
                          </h5>
                          <span className="font-bricolage tabular-nums text-xs sm:text-[13px] font-bold text-neutral-500 block mt-0.5">
                            ₹99
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
                          className={`font-poppins px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-none border text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer shrink-0 ${
                            addedAddons["strawberry"]
                              ? "bg-black text-white rounded-none border-neutral-900"
                              : "bg-white hover:bg-black hover:text-white border-black/15 text-black"
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
                          <h5 className="font-asul text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-900 truncate">
                            Black Cherry
                          </h5>
                          <span className="font-bricolage tabular-nums text-xs sm:text-[13px] font-bold text-neutral-500 block mt-0.5">
                            ₹99
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
                          className={`font-poppins px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-none border text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer shrink-0 ${
                            addedAddons["cherry"]
                              ? "bg-black text-white rounded-none border-neutral-900"
                              : "bg-white hover:bg-black hover:text-white border-black/15 text-black"
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

            {/* Drawer Footer & Checkout Controls */}
            {items.length > 0 && (
              <div
                ref={footerRef}
                className="cart-stagger-item relative z-10 px-4 sm:px-6 py-4 sm:py-5 border-t border-black/5 bg-white sm:bg-white/95 sm:backdrop-blur-md space-y-3 sm:space-y-4 shrink-0 shadow-lg"
              >
                {/* Bill Breakdown */}
                <div className="space-y-2 text-xs sm:text-[13px] uppercase tracking-wider font-semibold text-neutral-600 font-poppins">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-black font-extrabold tabular-nums font-bricolage text-xs sm:text-sm">
                      ₹{subtotal}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-extrabold tabular-nums font-bricolage text-xs sm:text-sm">
                        -₹{discountAmount}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-black font-extrabold tabular-nums font-bricolage text-xs sm:text-sm">
                      {isFreeShipping ? "₹0.00" : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Chilled Logistics</span>
                    <span className="text-black font-extrabold tabular-nums font-bricolage text-xs sm:text-sm">
                      ₹{taxAmount}
                    </span>
                  </div>

                  {/* Total row */}
                  <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-black/10 mt-1">
                    <span className="font-vagnola text-base sm:text-lg font-bold text-black tracking-wider uppercase">
                      Total
                    </span>
                    <span className="tabular-nums font-bricolage text-2xl sm:text-3xl font-black text-black">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Promo Code Box */}
                {!promoInputOpen ? (
                  <button
                    type="button"
                    onClick={() => setPromoInputOpen(true)}
                    className="w-full py-3 px-4 sm:px-5 rounded-none bg-neutral-100 hover:bg-neutral-200 border-none flex items-center justify-between text-black text-xs sm:text-[13px] font-poppins font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <svg
                        className="w-4 h-4"
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
                    className="relative flex items-center gap-2 font-poppins"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ENTER CODE"
                        className="w-full px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-none text-xs sm:text-[13px] font-poppins font-medium text-black uppercase tracking-wider outline-none focus:border-black"
                        autoFocus
                      />
                    </div>
                    {/* Square Apply Button */}
                    <button
                      type="submit"
                      className="px-4 sm:px-5 py-2.5 sm:py-3 bg-black hover:bg-neutral-800 text-white text-xs sm:text-[13px] font-asul font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer shrink-0 shadow-sm"
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

                {/* Primary PROCEED TO CHECKOUT CTA */}
                <div className="pt-0.5 sm:pt-1 pb-[calc(var(--sab)+0.5rem)]">
                  <button
                    ref={checkoutBtnRef}
                    type="button"
                    onClick={() =>
                      triggerTransition(() => setIsCheckingOut(true))
                    }
                    className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-1.5 sm:pr-2 rounded-none bg-neutral-950 hover:bg-black text-white flex items-center justify-between transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl active:scale-98"
                  >
                    <span className="font-vagnola text-sm sm:text-base font-bold tracking-wider uppercase text-white">
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

      {/* Modern High-Impact Payment Interface matching User's Mockup */}
      {isCheckingOut && (
        <div
          id="checkout-root"
          ref={checkoutContainerRef}
          onScroll={handleCheckoutScroll}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-60 w-full h-dvh bg-linear-to-br from-[#EBF5FB] via-[#E1EEF8] to-[#D5E6F5] text-[#0A1931] overflow-y-auto flex flex-col justify-between select-none"
        >
          {/* Top Real-time Scroll Progress Bar driven by GSAP */}
          <div
            ref={checkoutScrollProgressRef}
            className="fixed top-0 left-0 right-0 h-1 bg-[#1E25E8] origin-left z-70 pointer-events-none scale-x-0"
          />

          {isProcessingPayment && (
            <div className="fixed inset-0 bg-[#EBF5FB]/90 backdrop-blur-md z-80 flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 border-4 border-blue-200 border-t-[#1E25E8] rounded-none animate-spin mb-4" />
              <h4 className="text-base font-bold uppercase tracking-wider text-[#0A1931] mb-1 font-poppins">
                Processing Payment
              </h4>
              <p className="text-xs text-neutral-500 font-mono tracking-wider">
                {processingMessage || "Connecting securely to payment gateway..."}
              </p>
            </div>
          )}

          {/* Top Minimal Bar with Center Logo & Return Button */}
          <header className="w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between z-10 shrink-0">
            {/* Left: Return Button */}
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => triggerTransition(() => setIsCheckingOut(false))}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-neutral-700 hover:text-black transition-colors cursor-pointer bg-white/90 hover:bg-white border border-neutral-300/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-xs font-poppins shrink-0 active:scale-95"
              >
                <span className="font-light text-xs sm:text-sm">&larr;</span>
                <span className="font-medium tracking-wide">Return</span>
              </button>
            </div>

            {/* Center: Brand Logo centered with neat leaf */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-asal text-xl sm:text-2xl lg:text-3xl tracking-wide text-neutral-900 font-normal">
                zesty
              </span>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-700 shrink-0 self-center -translate-y-0.5"
                fill="none"
              >
                <path
                  d="M19.8 4.2C15.4 3.8 10.2 5.8 7.1 8.9C4.3 11.7 3.5 16.6 4.4 19.6C7.4 20.5 12.3 19.7 15.1 16.9C18.2 13.8 20.2 8.6 19.8 4.2Z"
                  fill="currentColor"
                />
                <path
                  d="M6.5 17.5C9.5 14.5 13.2 12.3 17.5 11.5"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Right: Balance spacer */}
            <div className="w-[72px] sm:w-[90px] shrink-0" aria-hidden="true" />
          </header>

          {/* Main Stage Grid: Left Brand + Can Showcase, Right Mobile Responsive Payment Card */}
          <main className="flex-1 w-full max-w-[1580px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6 flex items-center justify-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-center">
              
              {/* LEFT COLUMN: Brand Statement & 3D Juice Can Spotlight */}
              <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col justify-between items-start h-full py-4 relative">
                <div ref={checkoutHeadlineRef} className="space-y-3 z-10 pt-2">
                  <h1 className="text-4xl xl:text-5xl font-light text-[#0A1931]/60 uppercase tracking-wide leading-[1.15] font-asul">
                    Good<br />Things<br />Deliver<br />Happiness
                  </h1>
                </div>

                {/* 3D Juice Can Spotlight with GSAP Idle Float & Parallax (Shifted slightly left) */}
                <div 
                  ref={checkoutCanRef}
                  className="relative w-full max-w-sm mr-auto flex items-center justify-start -translate-x-6 sm:-translate-x-10 lg:-translate-x-12 my-auto pt-6 will-change-transform"
                >
                  <img
                    src={items[0]?.image || "/assets/orange-can-hero.png"}
                    alt="Zesty Valencia Orange Juice Can"
                    className="w-auto h-[350px] xl:h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 will-change-transform"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Mobile Responsive White Payment Card */}
              <div className="lg:col-span-8 xl:col-span-9 w-full">
                <div 
                  ref={checkoutCardRef}
                  className="w-full bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-7 lg:p-10 xl:p-12 text-neutral-900 font-jakarta flex flex-col justify-between"
                >
                  {/* CARD HEADER */}
                  <div className="mb-4 pb-3 sm:mb-6 sm:pb-4 border-b border-neutral-100 checkout-stagger-item">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1 font-jakarta">
                      CHECKOUT
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-[2.65rem] font-bold text-[#0A1931] tracking-tight uppercase leading-tight sm:leading-none font-asul">
                      Secure <span className="text-[#1E25E8]">Payment</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1 sm:mt-2 leading-relaxed font-jakarta">
                      Your order is almost done. Complete the payment to confirm.
                    </p>
                  </div>

                  {/* TWO-COLUMN GRID: LEFT FORM, RIGHT SUMMARY */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start">
                    
                    {/* SUB-COL 1 (6 cols on lg/xl): SECURE PAYMENT FORM */}
                    <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between">
                      {/* Minimal Payment Mode Tabs */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6 checkout-stagger-item">
                        <button
                          type="button"
                          onClick={() => setPaymentTab("card")}
                          className={`py-2.5 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer rounded-xl sm:rounded-none border text-center font-jakarta ${
                            paymentTab === "card"
                              ? "bg-[#1E25E8] text-white border-[#1E25E8] shadow-xs"
                              : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          Card Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentTab("upi")}
                          className={`py-2.5 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer rounded-xl sm:rounded-none border text-center font-jakarta ${
                            paymentTab === "upi"
                              ? "bg-[#1E25E8] text-white border-[#1E25E8] shadow-xs"
                              : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          UPI Direct
                        </button>
                      </div>

                      {/* TAB CONTENT WRAPPER */}
                      <div className="checkout-tab-body">
                        {/* TAB 1: CARD PAYMENT */}
                        {paymentTab === "card" && (
                          <div className="space-y-3 sm:space-y-4">
                            {/* Card Number Input */}
                            <div className="space-y-1.5 checkout-stagger-item">
                              <label className="block text-[11px] sm:text-xs font-medium text-neutral-600 font-outfit uppercase tracking-wider">
                                Card Number
                              </label>
                              <div className="relative flex items-center border border-neutral-300 focus-within:border-[#1E25E8] bg-white rounded-lg sm:rounded-none px-3 sm:px-4 py-2.5 sm:py-3.5 transition-colors">
                                <div className="flex items-center -space-x-1.5 mr-2.5 sm:mr-3.5 shrink-0">
                                  <span className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-[#EB001B] inline-block" />
                                  <span className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-[#F79E1B]/90 inline-block" />
                                </div>
                                <input
                                  type="text"
                                  maxLength={19}
                                  value={cardData.number}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    val = val.replace(/(\d{4})/g, '$1 ').trim();
                                    setCardData({ ...cardData, number: val });
                                  }}
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full bg-transparent font-bricolage text-xs sm:text-sm md:text-base tracking-wider text-neutral-900 focus:outline-none placeholder:text-neutral-400 tabular-nums"
                                />
                                {cardData.number && (
                                  <button
                                    type="button"
                                    onClick={() => setCardData({ ...cardData, number: '' })}
                                    className="text-[10px] sm:text-xs font-medium text-neutral-400 hover:text-neutral-700 shrink-0 ml-2 cursor-pointer font-outfit uppercase tracking-wider"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Expiry Date & CVV Row */}
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 checkout-stagger-item">
                              <div className="space-y-1.5">
                                <label className="block text-[11px] sm:text-xs font-medium text-neutral-600 font-outfit uppercase tracking-wider">
                                  Expiry Date
                                </label>
                                <div className="flex items-center border border-neutral-300 focus-within:border-[#1E25E8] bg-white rounded-lg sm:rounded-none px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 transition-colors">
                                  <input
                                    type="text"
                                    maxLength={2}
                                    value={cardData.expiryMM}
                                    onChange={(e) =>
                                      setCardData({ ...cardData, expiryMM: e.target.value.replace(/\D/g, '').slice(0, 2) })
                                    }
                                    placeholder="MM"
                                    className="w-1/2 text-center font-bricolage text-xs sm:text-sm md:text-base text-neutral-900 focus:outline-none tabular-nums"
                                  />
                                  <span className="text-neutral-400 font-mono px-1">/</span>
                                  <input
                                    type="text"
                                    maxLength={2}
                                    value={cardData.expiryYY}
                                    onChange={(e) =>
                                      setCardData({ ...cardData, expiryYY: e.target.value.replace(/\D/g, '').slice(0, 2) })
                                    }
                                    placeholder="YY"
                                    className="w-1/2 text-center font-bricolage text-xs sm:text-sm md:text-base text-neutral-900 focus:outline-none tabular-nums"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[11px] sm:text-xs font-medium text-neutral-600 font-outfit uppercase tracking-wider">
                                  CVV
                                </label>
                                <div className="relative flex items-center border border-neutral-300 focus-within:border-[#1E25E8] bg-white rounded-lg sm:rounded-none px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 transition-colors">
                                  <input
                                    type="password"
                                    maxLength={4}
                                    value={cardData.cvv}
                                    onChange={(e) =>
                                      setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                                    }
                                    placeholder="CVV"
                                    className="w-full bg-transparent font-bricolage text-xs sm:text-sm md:text-base tracking-widest text-neutral-900 focus:outline-none tabular-nums"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Cardholder Name */}
                            <div className="space-y-1.5 checkout-stagger-item">
                              <label className="block text-[11px] sm:text-xs font-medium text-neutral-600 font-outfit uppercase tracking-wider">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                placeholder="Enter cardholder full name"
                                className="w-full bg-white border border-neutral-300 focus:border-[#1E25E8] px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm md:text-base text-neutral-900 focus:outline-none rounded-lg sm:rounded-none transition-colors font-outfit"
                              />
                            </div>
                          </div>
                        )}

                        {/* TAB 2: UPI PAYMENT WITH NEAT GPAY & AUTHENTIC APP LOGOS */}
                        {paymentTab === "upi" && (
                          <div className="space-y-3 sm:space-y-4">
                            {/* UPI App Selection */}
                            <div className="space-y-1.5 checkout-stagger-item">
                              <label className="block text-[11px] sm:text-xs font-medium text-neutral-600 font-outfit uppercase tracking-wider">
                                Select UPI App
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                {[
                                  { id: 'gpay', name: 'Google Pay', shortLabel: 'GPay', logo: '/gpay-logo.png' },
                                  { id: 'phonepe', name: 'PhonePe', shortLabel: 'PhonePe', logo: '/phonepe-logo.png' },
                                  { id: 'paytm', name: 'Paytm', shortLabel: 'Paytm', logo: '/paytm-logo.png' },
                                  { id: 'bhim', name: 'BHIM', shortLabel: 'BHIM', logo: '/bhim-logo.png' },
                                ].map((app) => (
                                  <button
                                    key={app.id}
                                    type="button"
                                    onClick={() => setSelectedUpiApp(app.id)}
                                    className={`py-2 sm:py-3 px-2 sm:px-3 flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-none border transition-all cursor-pointer min-h-[64px] sm:min-h-[78px] group ${
                                      selectedUpiApp === app.id
                                        ? 'bg-blue-50/70 border-[#1E25E8] ring-1 ring-[#1E25E8] shadow-xs'
                                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                    }`}
                                  >
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center pointer-events-none shrink-0">
                                      <img
                                        src={app.logo}
                                        alt={app.name}
                                        className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                                      />
                                    </div>
                                    <span className={`text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-center whitespace-nowrap font-outfit ${
                                      selectedUpiApp === app.id ? 'text-[#1E25E8]' : 'text-neutral-700'
                                    }`}>
                                      {app.shortLabel}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Real-time UPI ID Input */}
                            <div className="space-y-1.5 checkout-stagger-item">
                              <label className="block text-[11px] sm:text-xs font-medium text-neutral-600 font-outfit uppercase tracking-wider">
                                UPI ID / VPA
                              </label>
                              <div className="relative flex items-center border border-neutral-300 focus-within:border-[#1E25E8] bg-white rounded-lg sm:rounded-none px-3 sm:px-4 py-2.5 sm:py-3.5 transition-colors">
                                <input
                                  type="text"
                                  value={customUpiId}
                                  onChange={(e) => setCustomUpiId(e.target.value)}
                                  placeholder={
                                    selectedUpiApp === 'gpay'
                                      ? 'Enter GPay UPI ID (e.g. mobile@okhdfcbank)'
                                      : selectedUpiApp === 'phonepe'
                                      ? 'Enter PhonePe UPI ID (e.g. mobile@ybl)'
                                      : selectedUpiApp === 'paytm'
                                      ? 'Enter Paytm UPI ID (e.g. mobile@paytm)'
                                      : 'Enter UPI ID (e.g. username@upi)'
                                  }
                                  className="w-full bg-transparent font-bricolage text-xs sm:text-sm md:text-base text-neutral-900 focus:outline-none placeholder:text-neutral-400 placeholder:font-outfit"
                                />
                                {customUpiId.trim().length > 3 && customUpiId.includes('@') && (
                                  <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase font-outfit shrink-0 ml-2">
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* SUB-COL 2 (6 cols on lg/xl): ORDER SUMMARY */}
                    <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between space-y-4 sm:space-y-6 border-t md:border-t-0 md:border-l border-neutral-100 md:pl-6 lg:pl-8 pt-4 md:pt-0 font-jakarta">
                      
                      {/* Order Summary Header */}
                      <div className="space-y-3 sm:space-y-4 checkout-stagger-item">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="font-bold text-sm sm:text-base text-neutral-900 font-jakarta">Your Order</span>
                          </div>
                          <span className="text-[11px] sm:text-xs text-neutral-400 font-jakarta font-medium">
                            {items.length || 1} {items.length === 1 ? 'Item' : 'Items'}
                          </span>
                        </div>

                        {/* Selected Items List */}
                        <div className="space-y-2 max-h-[160px] sm:max-h-[220px] overflow-y-auto pr-0.5">
                          {(items.length > 0 ? items : [{ id: 'orange', title: 'Valencia Orange', pack: 'single', packName: '500ml Single Can', totalPrice: 99, image: '/assets/orange-can-hero.png' }]).map((item, idx) => (
                            <div key={`${item.id}-${item.pack}-${idx}`} className="p-2.5 sm:p-3 bg-neutral-50 border border-neutral-200 rounded-lg sm:rounded-none flex items-center justify-between gap-2.5 sm:gap-3.5">
                              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-neutral-200 p-1 shrink-0 rounded-md sm:rounded-none flex items-center justify-center">
                                  <img
                                    src={item.image || "/assets/orange-can-hero.png"}
                                    alt={item.title || "Valencia Orange"}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-bold uppercase tracking-tight text-neutral-900 leading-snug whitespace-nowrap font-poppins">
                                    {item.title}
                                  </p>
                                  <span className="text-[10px] sm:text-[11px] text-neutral-500 font-poppins whitespace-nowrap block mt-0.5">
                                    {item.packName || item.pack || "500ml Single Can"}
                                    {item.quantity ? ` × ${item.quantity}` : ''}
                                  </span>
                                </div>
                              </div>
                              <span className="font-bricolage font-bold text-xs sm:text-sm md:text-base text-neutral-900 shrink-0 tabular-nums pl-2">
                                &#8377;{item.totalPrice || item.price || 99}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-2 pt-1 sm:pt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-outfit text-xs sm:text-sm font-medium tracking-wide text-neutral-500 uppercase">Subtotal</span>
                            <span className="font-bricolage text-neutral-900 font-bold tabular-nums text-xs sm:text-sm md:text-base">&#8377;{subtotal || 99}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-outfit text-xs sm:text-sm font-medium tracking-wide text-neutral-500 uppercase">Shipping</span>
                            <span className="font-bricolage text-neutral-900 font-bold tabular-nums text-xs sm:text-sm md:text-base">
                              {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-outfit text-xs sm:text-sm font-medium tracking-wide text-neutral-500 uppercase">Taxes</span>
                            <span className="font-bricolage text-neutral-900 font-bold tabular-nums text-xs sm:text-sm md:text-base">&#8377;{taxAmount || 5}</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-2 sm:pt-3 border-t border-neutral-200">
                            <span className="font-outfit text-xs sm:text-base font-bold uppercase tracking-wider text-neutral-900">Total</span>
                            <span className="font-bricolage text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E25E8] tabular-nums">
                              &#8377;{finalTotal || 104}
                            </span>
                          </div>
                        </div>

                        {/* PRIMARY PAY BUTTON */}
                        <button
                          type="button"
                          onClick={paymentTab === "card" ? handleCardPaymentSubmit : handleUpiPaymentSubmit}
                          disabled={isProcessingPayment}
                          className="w-full py-3.5 sm:py-4.5 px-4 sm:px-6 bg-[#1E25E8] hover:bg-[#1217B0] active:scale-[0.99] text-white font-bold uppercase tracking-wider text-xs sm:text-sm md:text-base rounded-xl sm:rounded-none shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 font-outfit mt-4 sm:mt-5"
                        >
                          <span className="tracking-wider">
                            {paymentTab === "card" ? 'PAY ' : 'PAY '}
                          </span>
                          <span className="font-bricolage font-extrabold text-sm sm:text-lg tracking-normal tabular-nums">
                            ₹{finalTotal || 488}
                          </span>
                          <span className="tracking-wider">
                            {paymentTab === "card" ? ' NOW' : ' VIA UPI'}
                          </span>
                          <span className="text-base sm:text-lg ml-1 font-light">&rarr;</span>
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </main>
        </div>
      )}

      {/* Order Confirmed Screen - Compact Card in Mobile & Desktop View */}
      {orderConfirmed && (
        <div
          id="order-confirmed-root"
          className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-[350px] sm:max-w-[420px] bg-[#F9F9F8] border border-neutral-200 rounded-2xl z-10 text-neutral-900 shadow-2xl flex flex-col text-left overflow-hidden">

            {/* Header bar: checkmark + title + close */}
            <div className="flex items-center justify-between px-3.5 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-2.5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#2D6A4F]" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-poppins text-[9px] text-neutral-400 font-mono leading-none mb-0.5">Order #{orderConfirmed.orderId}</p>
                  <h2 className="font-poppins text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                    Order <span className="text-[#2D6A4F]">placed</span> — congrats!
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); }}
                aria-label="Close"
                className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 text-[9px] font-bold"
              >
                &#10005;
              </button>
            </div>

            {/* Body */}
            <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 space-y-2 sm:space-y-2.5">
              {/* While waiting card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-2.5 sm:p-3">
                <p className="font-poppins text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">While you're waiting</p>
                <div className="space-y-1">
                  {["Cold-pressed organic extraction", "Chilled nitrogen packaging", "Express delivery in 25–35 mins"].map((txt) => (
                    <div key={txt} className="flex items-center gap-1.5">
                      <svg className="w-2.5 h-2.5 text-[#2D6A4F] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-poppins text-[10px] sm:text-[11px] text-neutral-700">{txt}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); setIsAccountOpen(true); }}
                  className="mt-2 px-2.5 py-0.5 bg-[#D8F3DC] hover:bg-[#B7E4C7] text-[#1B4332] text-[9px] font-poppins font-semibold rounded-full transition-colors cursor-pointer inline-block"
                >
                  View in Account
                </button>
              </div>

              {/* CTA row */}
              <div>
                <p className="font-poppins text-[10px] sm:text-[11px] font-semibold text-neutral-700 mb-1.5">Questions about your order?</p>
                <div className="flex gap-2">
                  <a
                    href="#footer"
                    onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); }}
                    className="flex-1 text-center px-2 py-1.5 sm:py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-poppins font-medium text-[10px] sm:text-[11px] rounded-full transition-colors cursor-pointer"
                  >
                    Contact Support
                  </a>
                  <button
                    type="button"
                    onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); }}
                    className="flex-1 px-2 py-1.5 sm:py-2 bg-black hover:bg-neutral-800 text-white font-poppins font-semibold text-[10px] sm:text-[11px] rounded-full transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {showPromoPopup && (
        <div
          className="fixed inset-0 z-80 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-xs"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            ref={promoPopupRef}
            className="relative w-full max-w-[400px] bg-linear-to-b from-[#4C1D95] via-[#5B21B6] to-[#6D28D9] rounded-t-[28px] sm:rounded-[28px] z-10 text-center shadow-2xl text-white overflow-hidden flex flex-col p-6 sm:p-7"
          >
            {/* Top Right Circular Close 'X' Button */}
            <button
              type="button"
              onClick={() => setShowPromoPopup(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer z-20 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Top Clean Promo Badge */}
            <div className="pt-2 pb-1 flex items-center justify-center">
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bricolage font-extrabold uppercase tracking-wider">
                {discountPercent}% OFF APPLIED
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-vagnola text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2 mb-1">
              {discountPercent}% Discount Unlocked!
            </h3>

            {/* Subtitle */}
            <p className="font-poppins text-xs text-purple-200/90 font-medium mb-3">
              Promo code <span className="font-bold text-amber-300 uppercase">{appliedPromoCode}</span> is active
            </p>

            {/* Central 3D Box Illustration (Clean, NO BASE SHADOW LINE) */}
            <div className="relative w-full py-1 flex flex-col items-center justify-center">
              <img
                src="/empty-cart-box.png"
                alt="Zesty Fresh Delivery Box"
                className="w-48 sm:w-56 max-h-[170px] sm:max-h-[190px] object-contain drop-shadow-2xl mx-auto select-none pointer-events-none"
              />
            </div>

            {/* Full-width Black Pill Button at Bottom */}
            <div className="pt-4 w-full">
              <button
                type="button"
                onClick={() => setShowPromoPopup(false)}
                className="w-full py-3.5 bg-black hover:bg-neutral-900 text-white font-poppins font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-xl active:scale-98 text-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
