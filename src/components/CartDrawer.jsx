import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { usePageTransition } from "../context/PageTransitionContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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

  // Modern GSAP Animations for Checkout — triggered via useEffect for reliability
  useEffect(() => {
    if (!isCheckingOut) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // 1. Full page slide in from right
      tl.fromTo(
        '#checkout-root',
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.65, ease: 'expo.out' }
      );
      // 2. Header drops in from top
      tl.fromTo(
        '#checkout-root header',
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.35'
      );
      // 3. Headline reveal
      tl.fromTo(
        '#checkout-root .checkout-headline',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
        '-=0.3'
      );
      // 4. Cards stagger up
      tl.fromTo(
        '#checkout-root .checkout-stagger-item',
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'expo.out' },
        '-=0.25'
      );
    });
    return () => ctx.revert();
  }, [isCheckingOut]);

  // Modern GSAP Animation for Order Confirmed
  useEffect(() => {
    if (!orderConfirmed) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        '#order-confirmed-root',
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'expo.out' }
      );
      tl.fromTo(
        '#order-confirmed-root .receipt-stagger',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
        '-=0.3'
      );
    });
    return () => ctx.revert();
  }, [orderConfirmed]);

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

    let paymentLabel = "UPI Direct";
    if (paymentTab === "card") {
      const last4 = cardData.number
        ? cardData.number.replace(/\s+/g, "").slice(-4)
        : "8921";
      paymentLabel = `Card (•••• ${last4})`;
    } else if (paymentTab === "netbanking") {
      paymentLabel = `Net Banking (${bankNames[selectedBank] || "HDFC Bank"})`;
    } else if (paymentTab === "cod") {
      paymentLabel = "Cash on Delivery";
    } else if (paymentTab === "wallets") {
      paymentLabel = `Wallet (${walletNames[selectedWallet] || "Paytm Wallet"})`;
    } else {
      const selectedAppObj = UPI_APPS.find((a) => a.id === selectedUpiApp);
      const appName = selectedAppObj?.name || "UPI";
      const vpaStr = customUpiId.trim();
      paymentLabel = vpaStr ? `UPI (${selectedAppObj?.shortName || "UPI"} - ${vpaStr})` : `UPI (${selectedAppObj?.shortName || "UPI"})`;
    }

    setIsProcessingPayment(true);
    if (paymentTab === "netbanking") {
      setProcessingMessage(
        `Connecting securely to ${bankNames[selectedBank] || "Bank"} NetBanking portal...`,
      );
    } else if (paymentTab === "card") {
      setProcessingMessage("Authenticating 3D-Secure 2.0 with bank issuer...");
    } else if (paymentTab === "cod") {
      setProcessingMessage("Generating Instant Cash-On-Delivery Order Verification...");
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
    }, 850);
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

      {/* Square-like Web UI Payment Interface */}
      {isCheckingOut && (
        <div
          id="checkout-root"
          ref={checkoutContainerRef}
          onScroll={handleCheckoutScroll}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-60 w-full h-dvh bg-[#0D0D0D] text-white overflow-y-auto flex flex-col justify-between select-none"
        >
          {/* Top Real-time Scroll Progress Bar */}
          <div
            ref={checkoutScrollProgressRef}
            className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-70 pointer-events-none scale-x-0"
          />

          {isProcessingPayment && (
            <div className="fixed inset-0 bg-[#FAF5EA]/95 backdrop-blur-xs z-80 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-none animate-spin mb-4" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-1 font-asul">
                Processing Payment
              </h4>
              <p className="text-xs text-neutral-600 font-mono tracking-wider">
                {processingMessage || "Connecting securely to payment gateway..."}
              </p>
            </div>
          )}

          {/* Top Minimal Header Bar with Brand Logo & Square Return Button */}
          <header className="w-full px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-sm z-10 shrink-0">
            {/* Left: Square Return Button */}
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => triggerTransition(() => setIsCheckingOut(false))}
                className="flex items-center gap-2 text-xs font-asul font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-200 cursor-pointer bg-white/10 border border-white/20 px-3.5 py-2 rounded-none active:scale-95"
              >
                <span className="font-light text-sm">&larr;</span>
                <span>Return to Cart</span>
              </button>
            </div>

            {/* Center: Brand Logo with authentic leaf icon */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-asul text-xl sm:text-2xl tracking-wide text-white font-bold uppercase">
                zesty
              </span>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-emerald-800 shrink-0 self-center -translate-y-0.5"
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

            {/* Right: Empty spacer for flex alignment */}
            <div className="flex items-center justify-end">
            </div>
          </header>

          {/* Main Stage: Square-like Web Checkout Grid */}
          <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-center">
            {/* Title Header matching Web UI Editorial Vagnola */}
            <div ref={checkoutHeadlineRef} className="checkout-headline mb-6 pb-4 border-b border-white/15 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="font-poppins text-xs uppercase tracking-widest text-white/50 block mb-1">
                  CHECKOUT STEP 2 OF 2
                </span>
                <h1 className="font-vagnola text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight leading-none">
                  Secure Payment
                </h1>
              </div>
              <p className="font-poppins text-xs text-white/50 sm:text-right max-w-xs leading-relaxed">
                Review your order and select your payment method to complete checkout.
              </p>
            </div>

            {/* Two-Column Clean Square Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* LEFT COLUMN: Square Payment Options & Inputs (7 cols) */}
              <div ref={checkoutCardRef} className="lg:col-span-7 w-full bg-white border border-neutral-300 rounded-none p-5 sm:p-7 shadow-xs">
                <div className="mb-5 pb-3 border-b border-neutral-200">
                  <span className="font-asul font-bold text-xs uppercase tracking-wider text-neutral-500 block mb-1">
                    Select Payment Method
                  </span>
                  <p className="font-poppins text-xs text-neutral-600">
                    Encrypted and securely processed. Choose how you would like to pay.
                  </p>
                </div>

                {/* Square Segmented Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 checkout-stagger-item">
                  {[
                    { id: 'card', label: 'Card' },
                    { id: 'upi', label: 'UPI Direct' },
                    { id: 'netbanking', label: 'Net Banking' },
                    { id: 'cod', label: 'Cash on Del.' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentTab(tab.id)}
                      className={`py-3 px-2 text-xs font-bricage font-bold uppercase tracking-wider rounded-none border text-center transition-all cursor-pointer ${
                        paymentTab === tab.id
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-[#FAF8F5] text-neutral-700 border-neutral-300 hover:border-black hover:bg-neutral-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Body */}
                <div className="checkout-tab-body">
                  {/* TAB 1: CARD PAYMENT */}
                  {paymentTab === 'card' && (
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div className="space-y-1.5 checkout-stagger-item">
                        <label className="block text-xs font-asul font-bold uppercase text-neutral-700 tracking-wider">
                          Card Number
                        </label>
                        <div className="flex items-center border border-neutral-300 focus-within:border-black bg-white rounded-none px-3.5 py-3 transition-colors">
                          <div className="flex items-center -space-x-1 mr-3 shrink-0">
                            <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block opacity-90" />
                            <span className="w-4 h-4 rounded-full bg-[#F79E1B] inline-block opacity-90" />
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
                            className="w-full bg-transparent font-mono text-sm tracking-wider text-neutral-900 focus:outline-none placeholder:text-neutral-400 tabular-nums"
                          />
                          {cardData.number && (
                            <button
                              type="button"
                              onClick={() => setCardData({ ...cardData, number: '' })}
                              className="text-xs font-mono font-bold text-neutral-400 hover:text-black shrink-0 ml-2 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expiry Date & CVV */}
                      <div className="grid grid-cols-2 gap-4 checkout-stagger-item">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-asul font-bold uppercase text-neutral-700 tracking-wider">
                            Expiry (MM / YY)
                          </label>
                          <div className="flex items-center border border-neutral-300 focus-within:border-black bg-white rounded-none px-3.5 py-3 transition-colors">
                            <input
                              type="text"
                              maxLength={2}
                              value={cardData.expiryMM}
                              onChange={(e) =>
                                setCardData({ ...cardData, expiryMM: e.target.value.replace(/\D/g, '').slice(0, 2) })
                              }
                              placeholder="MM"
                              className="w-1/2 text-center font-mono text-sm text-neutral-900 focus:outline-none tabular-nums"
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
                              className="w-1/2 text-center font-mono text-sm text-neutral-900 focus:outline-none tabular-nums"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-asul font-bold uppercase text-neutral-700 tracking-wider">
                            CVV
                          </label>
                          <div className="flex items-center border border-neutral-300 focus-within:border-black bg-white rounded-none px-3.5 py-3 transition-colors">
                            <input
                              type="password"
                              maxLength={4}
                              value={cardData.cvv}
                              onChange={(e) =>
                                setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                              }
                              placeholder="•••"
                              className="w-full bg-transparent font-mono text-sm tracking-widest text-neutral-900 focus:outline-none tabular-nums"
                            />
                            <svg className="w-4 h-4 text-neutral-400 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div className="space-y-1.5 checkout-stagger-item">
                        <label className="block text-xs font-asul font-bold uppercase text-neutral-700 tracking-wider">
                          Cardholder Full Name
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          placeholder="Name on card"
                          className="w-full bg-white border border-neutral-300 focus:border-black px-3.5 py-3 text-sm text-neutral-900 focus:outline-none rounded-none transition-colors font-poppins"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: UPI DIRECT */}
                  {paymentTab === 'upi' && (
                    <div className="space-y-4">
                      {/* UPI App Selection */}
                      <div className="space-y-1.5 checkout-stagger-item">
                        <label className="block text-xs font-asul font-bold uppercase text-neutral-700 tracking-wider">
                          Choose UPI Application
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.id)}
                              className={`p-3 flex flex-col items-center justify-center gap-2 rounded-none border transition-all cursor-pointer min-h-[70px] ${
                                selectedUpiApp === app.id
                                  ? 'bg-[#FAF8F5] border-black ring-1 ring-black shadow-xs'
                                  : 'bg-white border-neutral-200 hover:border-neutral-400'
                              }`}
                            >
                              <div className="w-8 h-8 flex items-center justify-center pointer-events-none shrink-0">
                                {app.icon}
                              </div>
                              <span className={`text-xs font-bricage font-bold uppercase tracking-wider text-center ${
                                selectedUpiApp === app.id ? 'text-black' : 'text-neutral-600'
                              }`}>
                                {app.shortName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Real-time UPI ID Input */}
                      <div className="space-y-1.5 checkout-stagger-item">
                        <label className="block text-xs font-bricage font-bold uppercase text-neutral-700 tracking-wider">
                          Enter UPI ID / VPA
                        </label>
                        <div className="flex items-center border border-neutral-300 focus-within:border-black bg-white rounded-none px-3.5 py-3 transition-colors">
                          <input
                            type="text"
                            value={customUpiId}
                            onChange={(e) => setCustomUpiId(e.target.value)}
                            placeholder={
                              selectedUpiApp === 'gpay'
                                ? 'e.g. mobile@okhdfcbank'
                                : selectedUpiApp === 'phonepe'
                                ? 'e.g. mobile@ybl'
                                : selectedUpiApp === 'paytm'
                                ? 'e.g. mobile@paytm'
                                : 'e.g. username@upi'
                            }
                            className="w-full bg-transparent font-mono text-sm text-neutral-900 focus:outline-none placeholder:text-neutral-400"
                          />
                          {customUpiId.trim().length > 3 && customUpiId.includes('@') && (
                            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase shrink-0 ml-2 px-1.5 py-0.5 bg-emerald-50 border border-emerald-300">
                              Verified ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: NET BANKING */}
                  {paymentTab === 'netbanking' && (
                    <div className="space-y-3 checkout-stagger-item">
                      <label className="block text-xs font-asul font-bold uppercase text-neutral-700 tracking-wider">
                        Select Your Bank
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {BANK_OPTIONS.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => setSelectedBank(bank.id)}
                            className={`p-3 flex items-center gap-2.5 rounded-none border text-left transition-all cursor-pointer ${
                              selectedBank === bank.id
                                ? 'bg-[#FAF8F5] border-black ring-1 ring-black shadow-xs'
                                : 'bg-white border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                              {bank.logo}
                            </div>
                            <span className="text-xs font-asul font-bold uppercase tracking-wider text-neutral-900 truncate">
                              {bank.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CASH ON DELIVERY */}
                  {paymentTab === 'cod' && (
                    <div className="p-4 bg-[#FAF8F5] border border-neutral-300 rounded-none space-y-2 checkout-stagger-item">
                      <div className="flex items-center gap-2 text-neutral-900 font-asul font-bold text-xs uppercase tracking-wider">
                        <svg className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Cash or UPI on Delivery</span>
                      </div>
                      <p className="font-poppins text-xs text-neutral-600 leading-relaxed">
                        Pay ₹{finalTotal || 99} in cash or via instant QR scan directly to our cold-chain delivery executive upon doorstep arrival.
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery Information Review Strip */}
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <div className="p-3.5 bg-[#FAF8F5] border border-neutral-200 rounded-none flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Delivering To
                      </span>
                      {userProfile?.fullName || userProfile?.phone ? (
                        <>
                          <p className="font-bricage font-bold uppercase text-neutral-900">
                            {userProfile?.fullName || 'Customer'} &bull; {userProfile?.phone}
                          </p>
                          <p className="font-poppins text-neutral-600 text-[11px]">
                            {userProfile?.address || ''}, {userProfile?.city || 'Bengaluru'} {userProfile?.pincode ? `- ${userProfile.pincode}` : ''}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-500">
                            Slot: Dawn Express (6 AM - 9 AM)
                          </p>
                        </>
                      ) : (
                        <p className="font-poppins text-neutral-500 text-[11px] italic py-1">
                          No delivery details provided. Please add an address to continue.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAccountOpen(true)}
                      className="text-[10px] font-bricage font-bold uppercase tracking-wider text-neutral-600 hover:text-black border-b border-neutral-400 shrink-0 cursor-pointer"
                    >
                      {userProfile?.fullName || userProfile?.phone ? 'Change' : 'Add Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Square Order Summary & Confirmation (5 cols) */}
              <div className="lg:col-span-5 w-full space-y-4">
                <div className="bg-white border border-neutral-300 rounded-none p-5 sm:p-7 shadow-xs space-y-4">
                  {/* Order Summary Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <span className="font-asul font-bold text-sm uppercase tracking-wider text-neutral-900">
                      Order Summary
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {items.length || 1} {items.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>

                  {/* Selected Items List with Square Thumbnails */}
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {(items.length > 0 ? items : [{ id: 'orange', title: 'Valencia Orange', pack: 'single', packName: '500ml Single Can', totalPrice: 99, image: '/assets/orange-can-hero.png' }]).map((item, idx) => (
                      <div key={`${item.id}-${item.pack}-${idx}`} className="p-2.5 bg-[#FAF8F5] border border-neutral-200 rounded-none flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 bg-white border border-neutral-200 rounded-none p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={item.image || "/assets/orange-can-hero.png"}
                              alt={item.title || "Juice"}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bricage font-bold text-xs uppercase text-neutral-900 truncate">
                              {item.title}
                            </p>
                            <span className="font-poppins text-[11px] text-neutral-500 block">
                              {item.packName || item.pack || "500ml Single Can"} {item.quantity ? `× ${item.quantity}` : ''}
                            </span>
                          </div>
                        </div>
                        <span className="font-asul font-bold text-sm text-neutral-900 shrink-0 tabular-nums">
                          ₹{item.totalPrice || item.price || 99}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200 text-xs font-poppins">
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-mono font-medium text-neutral-900">₹{subtotal || 99}</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Express Chilled Shipping</span>
                      <span className="font-mono font-medium text-neutral-900">
                        {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Estimated Taxes (5% GST)</span>
                      <span className="font-mono font-medium text-neutral-900">₹{taxAmount || 5}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-emerald-700 font-medium">
                        <span>Promo Discount ({discountPercent}%)</span>
                        <span className="font-mono">-₹{discountAmount}</span>
                      </div>
                    )}

                    {/* Total Row */}
                    <div className="flex justify-between items-baseline pt-3 border-t-2 border-black">
                      <span className="font-asul font-bold uppercase text-neutral-900 text-sm">
                        Total Amount
                      </span>
                      <span className="font-asul text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums">
                        ₹{finalTotal || 104}
                      </span>
                    </div>
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    disabled={isProcessingPayment}
                    className="w-full py-4 px-6 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-asul font-bold uppercase tracking-widest text-xs sm:text-sm rounded-none shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    <span>{paymentTab === 'cod' ? 'CONFIRM ORDER' : 'PAY'}</span>
                    <span className="tabular-nums">₹{finalTotal || 104}</span>
                    <span>{paymentTab === 'cod' ? '(CASH ON DELIVERY)' : 'NOW'}</span>
                    <span className="text-base font-light">&rarr;</span>
                  </button>

                  {/* Trust Signals */}
                  <div className="pt-2 text-[11px] font-poppins text-neutral-500 space-y-1 text-center border-t border-neutral-100">
                    <p className="flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>100% Secure Checkout &bull; Encrypted via 3D Secure</span>
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Cold-pressed within 4 hours of shipment &bull; Zero preservatives
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      )}

      {/* Square-like Payment Successful Screen (Receipt Layout) */}
      {orderConfirmed && (
        <div
          id="order-confirmed-root"
          className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-[480px] bg-white border border-neutral-300 rounded-none shadow-2xl flex flex-col text-left overflow-hidden text-neutral-900">
            {/* Receipt Header Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF8F5] border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="font-asul text-base font-bold uppercase tracking-wide text-neutral-900">
                  zesty
                </span>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider">
                  // ORDER CONFIRMATION
                </span>
              </div>
              <button
                type="button"
                onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); }}
                aria-label="Close"
                className="w-7 h-7 rounded-none border border-neutral-300 bg-white hover:bg-black hover:text-white flex items-center justify-center text-neutral-700 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                &#10005;
              </button>
            </div>

            {/* Hero Success Badge */}
            <div className="px-6 py-5 border-b border-neutral-200 bg-white">
              <div className="w-11 h-11 rounded-none bg-[#EAF7EE] border border-emerald-400 text-emerald-800 flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-vagnola text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 leading-none">
                Payment Successful
              </h2>
              <p className="font-poppins text-xs text-neutral-600 mt-1.5 leading-relaxed">
                Your order is placed and confirmed. We've started cold-pressing and packing your signature bottles.
              </p>

              {/* Order Reference Box */}
              <div className="bg-[#FAF8F5] border border-neutral-200 rounded-none p-3 mt-3 flex items-center justify-between font-mono text-xs text-neutral-700">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Order Number</span>
                  <span className="font-bold text-neutral-900">#{orderConfirmed.orderId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block uppercase">Status</span>
                  <span className="font-bold text-emerald-700 uppercase">Confirmed ✓</span>
                </div>
              </div>
            </div>

            {/* Order Items List */}
            <div className="px-6 py-3.5 max-h-40 overflow-y-auto space-y-2 border-b border-neutral-200 bg-[#FAF8F5]/30">
              <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Items Ordered
              </span>
              {(orderConfirmed.items && orderConfirmed.items.length > 0 ? orderConfirmed.items : [{ id: 'juice', title: 'Valencia Orange', packName: '500ml Single Can', price: 99 }]).map((item, idx) => (
                <div key={idx} className="p-2 bg-white border border-neutral-200 rounded-none flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 bg-[#FAF8F5] border border-neutral-200 rounded-none p-0.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || '/assets/orange-can-hero.png'}
                        alt={item.title || 'Juice'}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-asul text-xs font-bold uppercase text-neutral-900 truncate">
                        {item.title || item.name}
                      </p>
                      <span className="font-poppins text-[10px] text-neutral-500 block">
                        {item.packName || item.pack || '500ml Single Can'} {item.quantity ? `× ${item.quantity}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-asul font-bold text-xs text-neutral-900 shrink-0 tabular-nums">
                    ₹{item.totalPrice || item.price || 99}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment & Delivery Summary */}
            <div className="px-6 py-3.5 space-y-2 text-xs font-poppins border-b border-neutral-200 bg-[#FAF8F5]">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Payment Method:</span>
                <span className="font-mono font-medium text-neutral-900">{orderConfirmed.customerDetails?.paymentLabel || 'Card / UPI'}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Delivery Slot:</span>
                <span className="font-mono font-medium text-neutral-900">{orderConfirmed.deliverySlot || 'Dawn Express (6 AM - 9 AM)'}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Recipient:</span>
                <span className="font-mono font-medium text-neutral-900 truncate max-w-[220px]">
                  {orderConfirmed.customerDetails?.fullName || 'Customer'} ({orderConfirmed.customerDetails?.phone || '+91 98765 43210'})
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-300">
                <span className="font-asul font-bold uppercase text-neutral-900">Total Paid:</span>
                <span className="font-asul text-base font-bold text-neutral-900 tabular-nums">
                  ₹{orderConfirmed.customerDetails?.finalTotal || orderConfirmed.subtotal || 99}
                </span>
              </div>
            </div>

            {/* Square Action Buttons */}
            <div className="px-6 py-4 bg-white flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); setIsAccountOpen(true); }}
                className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-asul font-bold text-xs uppercase tracking-wider rounded-none border border-neutral-300 text-center transition-colors cursor-pointer"
              >
                Track in Account
              </button>
              <button
                type="button"
                onClick={() => { setOrderConfirmed(null); setIsCartOpen(false); setIsCheckingOut(false); }}
                className="flex-1 py-3 px-4 bg-black hover:bg-neutral-800 text-white font-asul font-bold text-xs uppercase tracking-wider rounded-none text-center transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Square Promo Unlock Popup */}
      {showPromoPopup && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            ref={promoPopupRef}
            className="relative w-full max-w-[420px] bg-white border border-neutral-300 rounded-none z-10 text-center shadow-2xl text-neutral-900 overflow-hidden flex flex-col p-6 sm:p-8"
          >
            {/* Square Close Button */}
            <button
              type="button"
              onClick={() => setShowPromoPopup(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-7 h-7 rounded-none border border-neutral-300 bg-white hover:bg-black hover:text-white flex items-center justify-center text-xs font-mono font-bold transition-colors cursor-pointer z-20"
            >
              &#10005;
            </button>

            {/* Top Square Promo Badge */}
            <div className="pt-2 pb-1 flex items-center justify-center">
              <span className="px-3 py-1 rounded-none bg-[#FAF8F5] border border-neutral-300 text-neutral-900 text-xs font-mono font-bold uppercase tracking-wider">
                {discountPercent}% OFF APPLIED
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-vagnola text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-tight mt-2 mb-1">
              Discount Unlocked!
            </h3>

            {/* Subtitle */}
            <p className="font-poppins text-xs text-neutral-600 font-medium mb-3">
              Promo code <span className="font-bold text-neutral-900 uppercase">{appliedPromoCode}</span> is active
            </p>

            {/* Central Product Delivery Box Illustration */}
            <div className="relative w-full py-1 flex flex-col items-center justify-center">
              <img
                src="/empty-cart-box.png"
                alt="Zesty Fresh Delivery Box"
                className="w-44 sm:w-48 max-h-[160px] object-contain drop-shadow-md mx-auto select-none pointer-events-none"
              />
            </div>

            {/* Full-width Square Button at Bottom */}
            <div className="pt-4 w-full">
              <button
                type="button"
                onClick={() => setShowPromoPopup(false)}
                className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-asul font-bold text-xs uppercase tracking-widest rounded-none transition-all cursor-pointer shadow-xs text-center"
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
