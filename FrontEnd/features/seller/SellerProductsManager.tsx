"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Tag, Loader2, PackageOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/useAuth";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, FormField, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { bffApi } from "@/services/api";
import { formatCurrency } from "@/lib/format";
import type { ProductDto } from "@/types/product";
import type { CategoryDto } from "@/types/category";

const productSchema = z.object({
  Name: z.string().min(2, "At least 2 characters required"),
  Description: z.string().optional().nullable(),
  Price: z.coerce.number().gt(0.01, "Price must be greater than 0.01"),
  Stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  Image: z.string().url("Must be a valid URL").or(z.string().length(0)).optional().nullable(),
  CategoryId: z.coerce.number().int().positive("Please select a category"),
  IsActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function SellerProductsManager() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { IsActive: true },
  });

  const toast = (message: string, tone: "success" | "error" = "success") =>
    dispatch(pushToast({ tone, message }));

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        bffApi.get<{ Data: ProductDto[] }>("/products"),
        bffApi.get<{ Data: CategoryDto[] }>("/categories"),
      ]);
      
      // Filter products belonging to this seller
      const sellerProducts = (prodRes.data?.Data || []).filter(
        (p) => p.SellerId === user?.id
      );
      setProducts(sellerProducts);
      setCategories(catRes.data?.Data || []);
    } catch {
      toast("Failed to load products or categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const openCreateModal = () => {
    setEditingProduct(null);
    reset({
      Name: "",
      Description: "",
      Price: 0.99,
      Stock: 10,
      Image: "",
      CategoryId: categories[0]?.Id || 0,
      IsActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: ProductDto) => {
    setEditingProduct(product);
    reset({
      Name: product.Name,
      Description: product.Description,
      Price: product.Price,
      Stock: product.Stock,
      Image: product.Image,
      CategoryId: product.CategoryId || 0,
      IsActive: product.IsActive,
    });
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        Image: values.Image || null,
        Description: values.Description || null,
      };

      if (editingProduct) {
        await bffApi.put(`/products/${editingProduct.Id}`, payload);
        toast("Product updated successfully");
      } else {
        await bffApi.post("/products", payload);
        toast("Product created successfully");
      }
      setModalOpen(false);
      fetchData();
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save product";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  });

  const onDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await bffApi.delete(`/products/${id}`);
      toast("Product deleted successfully");
      fetchData();
      router.refresh();
    } catch {
      toast("Failed to delete product", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Products</h2>
        <Button size="sm" onClick={openCreateModal} className="gap-1">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {!products.length ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border">
          <PackageOpen className="h-12 w-12 text-muted/40 mb-3" />
          <h3 className="text-lg font-semibold mb-1">No products listed</h3>
          <p className="text-sm text-muted mb-4 max-w-sm">
            You haven't listed any products in your store yet. Click the button below to add your first item!
          </p>
          <Button size="sm" onClick={openCreateModal}>
            List Your First Product
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.Id} className="flex flex-col p-4 border border-border relative overflow-hidden bg-surface/40 hover:bg-surface/60 transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base line-clamp-1">{product.Name}</h3>
                  <Badge tone={product.IsActive ? "success" : "default"}>
                    {product.IsActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                {product.Description && (
                  <p className="text-xs text-muted line-clamp-2">{product.Description}</p>
                )}
                
                <div className="pt-2 flex justify-between items-center text-sm">
                  <div>
                    <span className="text-xs text-muted block">Price</span>
                    <span className="font-bold text-accent">{formatCurrency(product.Price)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted block">Stock</span>
                    <span className={`font-semibold ${product.Stock === 0 ? "text-destructive" : "text-foreground"}`}>
                      {product.Stock} units
                    </span>
                  </div>
                </div>

                {product.CategoryName && (
                  <div className="pt-1 flex items-center gap-1 text-xs text-muted">
                    <Tag className="h-3 w-3" />
                    <span>{product.CategoryName}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditModal(product)}
                  className="gap-1"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  loading={deletingId === product.Id}
                  onClick={() => onDelete(product.Id)}
                  className="gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" /> <span className="text-destructive">Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="Product Name *" error={errors.Name?.message}>
            <Input placeholder="E.g., Wireless Headset" {...register("Name")} />
          </FormField>

          <FormField label="Description" error={errors.Description?.message}>
            <Textarea
              placeholder="Describe features, size, warranty details…"
              {...register("Description")}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price ($) *" error={errors.Price?.message}>
              <Input type="number" step="0.01" {...register("Price")} />
            </FormField>

            <FormField label="Stock Qty *" error={errors.Stock?.message}>
              <Input type="number" {...register("Stock")} />
            </FormField>
          </div>

          <FormField label="Category *" error={errors.CategoryId?.message}>
            <select
              className="input-base w-full bg-surface"
              {...register("CategoryId")}
            >
              {categories.map((c) => (
                <option key={c.Id} value={c.Id}>
                  {c.Name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Image URL (Optional)" error={errors.Image?.message}>
            <Input placeholder="https://example.com/image.jpg" {...register("Image")} />
          </FormField>

          {editingProduct && (
            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                className="rounded border-border bg-surface text-accent focus:ring-accent"
                {...register("IsActive")}
              />
              <span className="text-sm font-medium">Product is available for sale (Active)</span>
            </label>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
