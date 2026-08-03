"use client";

import Link from "next/link";
import { Smartphone, Laptop, Headphones, Gamepad2, Shirt, Package } from "lucide-react";
import { useCategoryList } from "@/lib/hooks/useCategoryList";
import { slugifyCategory } from "@/lib/utils/product";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { Skeleton } from "@/components/ui/Skeleton";

const ICON_MAP: Record<string, { icon: typeof Package; iconColor: string; iconBg: string }> = {
  gaming: { icon: Gamepad2, iconColor: "text-purple-600", iconBg: "bg-purple-100 dark:bg-purple-900/30" },
  mobile: { icon: Smartphone, iconColor: "text-blue-600", iconBg: "bg-blue-100 dark:bg-blue-900/30" },
  laptops: { icon: Laptop, iconColor: "text-indigo-600", iconBg: "bg-indigo-100 dark:bg-indigo-900/30" },
  audio: { icon: Headphones, iconColor: "text-emerald-600", iconBg: "bg-emerald-100 dark:bg-emerald-900/30" },
  fashion: { icon: Shirt, iconColor: "text-pink-600", iconBg: "bg-pink-100 dark:bg-pink-900/30" },
};

function getCategoryStyle(slug: string) {
  return ICON_MAP[slug] ?? {
    icon: Package,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-100 dark:bg-gray-800",
  };
}

export function CategoriesPageClient() {
  const { categories, isLoading, isError } = useCategoryList();

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Categories" }]} />
      <PageHeader title="Explore Categories" subtitle="Quality essentials across every vertical" />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-muted">Could not load categories.</p>
      ) : (
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories
            .filter((c) => c.isActive)
            .map(({ id, name }) => {
              const slug = slugifyCategory(name);
              const { icon: Icon, iconColor, iconBg } = getCategoryStyle(slug);
              return (
                <StaggerItem key={id}>
                  <Link
                    href={`/categories/${slug}`}
                    className="flex flex-col items-center rounded-xl border border-border bg-[var(--card-bg)] px-4 py-8 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className={`mb-4 grid h-14 w-14 place-items-center rounded-full ${iconBg}`}>
                      <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.75} />
                    </div>
                    <p className="font-semibold">{name}</p>
                  </Link>
                </StaggerItem>
              );
            })}
        </StaggerContainer>
      )}
    </div>
  );
}
