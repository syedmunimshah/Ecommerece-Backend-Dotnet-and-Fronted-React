import type { ProductDto } from "@/lib/types/api";
import type { Product } from "@/lib/catalog";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";

export const PRODUCT_PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGE;

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productDtoToProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.categoryName ?? "GENERAL",
    categorySlug: slugifyCategory(dto.categoryName ?? "general"),
    image: dto.image ?? PLACEHOLDER_IMAGE,
    rating: 4,
    reviewCount: 0,
    price: dto.price,
    description: dto.description ?? "",
    stock: dto.stock,
    seller: dto.sellerName ?? "EdgeCart",
    variants: dto.variants ?? [],
  };
}

export function productDtosToProducts(dtos: ProductDto[]): Product[] {
  return dtos.filter((p) => p.isActive).map(productDtoToProduct);
}
