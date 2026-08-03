export const FOOTER_LINKS = {
  shop: [
    { label: "Mobile & Tablets", href: "/categories/mobile" },
    { label: "Audio & Gear", href: "/categories/audio" },
    { label: "Gaming", href: "/categories/gaming" },
    { label: "Fashion", href: "/categories/fashion" },
  ],
  sell: [
    { label: "Seller Dashboard", href: "/dashboard" },
    { label: "Merchant Terms", href: "/merchant-terms" },
    { label: "Selling Guide", href: "/selling-guide" },
    { label: "Success Stories", href: "/success-stories" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Order", href: "/track-order" },
    { label: "Returns", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
} as const;

export const FOOTER_LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;

export const FOOTER_SOCIAL = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" as const },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
] as const;
