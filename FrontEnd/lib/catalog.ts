import {
  FEATURED_PRODUCTS,
  FLASH_SALE_PRODUCTS,
  BEST_SELLERS,
  HOME_CATEGORIES,
} from "@/lib/content/home";

export interface Product {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  description: string;
  stock: number;
  seller: string;
}

function inferSlug(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("phone") || n.includes("lens") || n.includes("mobile")) return "mobile";
  if (n.includes("laptop") || n.includes("monitor")) return "laptops";
  if (n.includes("headphone") || n.includes("earbud") || n.includes("audio") || n.includes("candle"))
    return n.includes("candle") ? "fashion" : "audio";
  if (n.includes("keyboard") || n.includes("mouse") || n.includes("gaming") || n.includes("console"))
    return "gaming";
  if (n.includes("backpack") || n.includes("fashion")) return "fashion";
  return "laptops";
}

function buildCatalog(): Product[] {
  const map = new Map<number, Product>();

  const add = (p: Partial<Product> & Pick<Product, "id" | "name" | "price" | "image">) => {
    if (map.has(p.id)) return;
    const slug = p.categorySlug ?? inferSlug(p.name);
    map.set(p.id, {
      id: p.id,
      name: p.name,
      category: p.category ?? "ELECTRONICS",
      categorySlug: slug,
      image: p.image,
      rating: p.rating ?? 4,
      reviewCount: p.reviewCount ?? 12,
      price: p.price,
      originalPrice: p.originalPrice,
      badge: p.badge,
      description:
        p.description ??
        `Premium quality ${p.name} available on EdgeCart Pakistan. Fast delivery, authentic products, and easy returns.`,
      stock: p.stock ?? 25,
      seller: p.seller ?? "EdgeCart Official",
    });
  };

  FEATURED_PRODUCTS.forEach((p) =>
    add({
      id: p.id,
      name: p.name,
      category: p.category,
      image: p.image,
      rating: p.rating,
      reviewCount: p.reviewCount,
      price: p.price,
      originalPrice: p.originalPrice,
      badge: p.badge,
    }),
  );

  FLASH_SALE_PRODUCTS.forEach((p) =>
    add({
      id: p.id,
      name: p.name,
      category: p.category,
      image: p.image,
      rating: p.rating,
      reviewCount: p.reviewCount,
      price: p.price,
      originalPrice: p.originalPrice,
      badge: p.badge,
    }),
  );

  BEST_SELLERS.forEach((p) =>
    add({ id: p.id, name: p.name, price: p.price, image: p.image, rating: 5, reviewCount: 20 }),
  );

  return Array.from(map.values());
}

const CATALOG = buildCatalog();

export function getAllProducts() {
  return CATALOG;
}

export function getProductById(id: number) {
  return CATALOG.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string) {
  return CATALOG.filter((p) => p.categorySlug === slug);
}

export function getCategoryBySlug(slug: string) {
  return HOME_CATEGORIES.find((c) => c.slug === slug);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase();
  return CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}

export function getOfferProducts() {
  return CATALOG.filter((p) => p.originalPrice && p.originalPrice > p.price);
}
