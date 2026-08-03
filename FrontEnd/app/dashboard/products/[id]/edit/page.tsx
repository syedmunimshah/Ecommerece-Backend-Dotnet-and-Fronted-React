"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/lib/store/api/api";
import { useCategoryList } from "@/lib/hooks/useCategoryList";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ProductImageUpload } from "@/components/product/ProductImageUpload";
import { useMounted } from "@/lib/hooks/useMounted";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  const mounted = useMounted();
  const { isSeller } = useAuth();
  const { categories } = useCategoryList();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !productId || Number.isNaN(productId),
  });
  const [updateProduct, { isLoading: saving, error }] = useUpdateProductMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!product || hydrated) return;
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setImage(product.image ?? "");
    setCategoryId(product.categoryId ? String(product.categoryId) : "");
    setHydrated(true);
  }, [product, hydrated]);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!isSeller) {
    return (
      <p className="text-muted">
        Seller access required.{" "}
        <Link href="/dashboard/become-seller" className="text-accent">
          Apply as seller
        </Link>
      </p>
    );
  }

  if (isLoading || !hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <p className="text-muted">
        Product not found.{" "}
        <Link href="/dashboard/products" className="text-accent">
          Back to products
        </Link>
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct({
        id: productId,
        data: {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          image: image || undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          isActive: product.isActive,
        },
      }).unwrap();
      router.push("/dashboard/products");
    } catch {
      /* error state */
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Edit Product" },
        ]}
      />
      <PageHeader title="Edit Product" subtitle={product.name} />
      <AnimateIn>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg space-y-4 rounded-2xl border border-border bg-[var(--card-bg)] p-6"
        >
          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">
              Failed to update product.
            </p>
          )}

          <ProductImageUpload value={image} onChange={setImage} />

          <div>
            <label className="mb-1.5 block text-sm font-medium">Product Name</label>
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Price (Rs.)</label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Stock</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <MotionButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </MotionButton>
            <Link
              href="/dashboard/products"
              className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium text-muted hover:bg-[var(--chip-bg)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </AnimateIn>
    </>
  );
}
