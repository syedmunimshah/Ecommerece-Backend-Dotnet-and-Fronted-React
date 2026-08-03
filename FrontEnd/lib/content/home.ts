import type { LucideIcon } from "lucide-react";
import {
  Truck,
  ShieldCheck,
  Headphones,
  Zap,
  Gamepad2,
  Smartphone,
  Laptop,
  Shirt,
  Home,
  AudioLines,
} from "lucide-react";

export interface ServiceHighlight {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  desktopTitle?: string;
  desktopSubtitle?: string;
}

export interface HomeCategory {
  slug: string;
  name: string;
  productCount: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const SERVICE_HIGHLIGHTS: ServiceHighlight[] = [
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Across 50+ Cities",
    desktopTitle: "Free Delivery",
    desktopSubtitle: "On all orders above Rs. 3,500",
  },
  {
    icon: ShieldCheck,
    title: "Secure Pay",
    subtitle: "100% Protection",
    desktopTitle: "Secure Payments",
    desktopSubtitle: "100% protection with SafePay",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Dedicated Assistance",
    desktopTitle: "24/7 Support",
    desktopSubtitle: "Human assistance anytime",
  },
  {
    icon: Zap,
    title: "Instant Deals",
    subtitle: "Exclusive Discounts",
    desktopTitle: "Global Sourcing",
    desktopSubtitle: "Directly from authorized brands",
  },
];

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    slug: "gaming",
    name: "Gaming",
    productCount: "1.2k Products",
    icon: Gamepad2,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100 dark:bg-violet-500/15",
  },
  {
    slug: "mobile",
    name: "Mobile",
    productCount: "3.5k Products",
    icon: Smartphone,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-500/15",
  },
  {
    slug: "laptops",
    name: "Laptops",
    productCount: "850 Products",
    icon: Laptop,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
  },
  {
    slug: "fashion",
    name: "Fashion",
    productCount: "12k Products",
    icon: Shirt,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-100 dark:bg-pink-500/15",
  },
  {
    slug: "home",
    name: "Home",
    productCount: "4.2k Products",
    icon: Home,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-500/15",
  },
  {
    slug: "audio",
    name: "Audio",
    productCount: "2.1k Products",
    icon: AudioLines,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/15",
  },
];

export interface FlashSaleProduct {
  id: number;
  badge: string;
  category: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
}

export const FLASH_SALE_PRODUCTS: FlashSaleProduct[] = [
  {
    id: 1,
    badge: "50% OFF",
    category: "ELECTRONICS",
    name: "Wireless Over-Ear Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 5,
    reviewCount: 42,
    price: 4500,
    originalPrice: 9000,
  },
  {
    id: 2,
    badge: "SALE",
    category: "ELECTRONICS",
    name: "Lumia G Lens",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    rating: 4,
    reviewCount: 28,
    price: 12500,
    originalPrice: 18000,
  },
  {
    id: 3,
    badge: "HOT",
    category: "ELECTRONICS",
    name: "Ergo Mouse X",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 5,
    reviewCount: 67,
    price: 3200,
    originalPrice: 5500,
  },
];

export type FeaturedTab = "best-sellers" | "new-arrivals" | "on-offer";

export interface FeaturedProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  tabs: FeaturedTab[];
}

export const FEATURED_TABS: { id: FeaturedTab; label: string }[] = [
  { id: "best-sellers", label: "Best Sellers" },
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "on-offer", label: "On Offer" },
];

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 1,
    name: "Atlas X1 Pro Phone",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    rating: 5,
    reviewCount: 47,
    price: 174999,
    badge: "New",
    tabs: ["best-sellers", "new-arrivals"],
  },
  {
    id: 2,
    name: "Aurora Smartwatch Gen 4",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 5,
    reviewCount: 32,
    price: 34999,
    badge: "Popular",
    tabs: ["best-sellers"],
  },
  {
    id: 3,
    name: "Zenith ANC Headphones",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
    rating: 4,
    reviewCount: 18,
    price: 12499,
    tabs: ["best-sellers", "new-arrivals"],
  },
  {
    id: 4,
    name: "Vortex Mechanical Keyboard",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
    rating: 5,
    reviewCount: 56,
    price: 8999,
    originalPrice: 11500,
    tabs: ["best-sellers", "on-offer"],
  },
  {
    id: 5,
    name: 'Titan 4K Monitor 27"',
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1527443224154-c4a70b163753?w=500&h=500&fit=crop",
    rating: 4,
    reviewCount: 24,
    price: 45000,
    badge: "Limited",
    tabs: ["best-sellers", "new-arrivals"],
  },
  {
    id: 6,
    name: "Swift Air Laptop 13",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    rating: 5,
    reviewCount: 41,
    price: 155000,
    tabs: ["best-sellers"],
  },
  {
    id: 7,
    name: "Nova DSLR Camera",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    rating: 5,
    reviewCount: 29,
    price: 89999,
    originalPrice: 99000,
    tabs: ["best-sellers", "on-offer"],
  },
  {
    id: 8,
    name: "Pulse Gaming Console",
    category: "ELECTRONICS",
    image: "https://images.unsplash.com/photo-1486401897018-8660f802993b?w=500&h=500&fit=crop",
    rating: 4,
    reviewCount: 63,
    price: 68000,
    tabs: ["best-sellers", "new-arrivals"],
  },
];

export interface BestSellerItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const BEST_SELLERS: BestSellerItem[] = [
  {
    id: 201,
    name: "Camera Lens X",
    price: 45000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
  },
  {
    id: 202,
    name: "Scented Candle",
    price: 1200,
    image: "https://images.unsplash.com/photo-1602607505831-360cf09a4987?w=400&h=400&fit=crop",
  },
  {
    id: 203,
    name: "Tech Backpack",
    price: 8500,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  },
  {
    id: 204,
    name: "Wireless Earbuds",
    price: 5999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
  },
];

export const TRUSTED_BRANDS = [
  "Samsung",
  "Apple",
  "Dell",
  "Sony",
  "HP",
  "Nike",
] as const;

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "EdgeCart has revolutionized my gadgets shopping. Fast delivery and authentic items always.",
    name: "Ahmed Khan",
    role: "Tech Enthusiast",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    quote:
      "The flash sales are incredible. I saved 40% on my kitchen appliances last month. Customer support is great.",
    name: "Sara Malik",
    role: "Home Maker",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    quote:
      "Easy navigation and secure payment methods. SafePay really gives peace of mind for high-value items.",
    name: "Usman Ali",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
  },
];

export const MOBILE_TESTIMONIALS = [
  {
    id: 1,
    name: "Ahmed Ali",
    quote:
      "The delivery was incredibly fast and the quality exceeded my expectations. Pakistan's best marketplace hands down.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "Sara Malik",
    quote:
      "The flash sales are incredible. I saved 40% on my kitchen appliances last month. Customer support is great.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Usman Ali",
    quote:
      "Easy navigation and secure payment methods. SafePay really gives peace of mind for high-value items.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
  },
];
