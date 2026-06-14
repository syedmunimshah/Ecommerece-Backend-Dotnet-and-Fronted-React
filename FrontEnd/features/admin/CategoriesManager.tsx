"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { bffApi } from "@/services/api";
import type { CategoryDto } from "@/types/category";

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryDto[] }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState<number | "new" | null>(null);

  const toast = (message: string, tone: "success" | "error" = "success") =>
    dispatch(pushToast({ tone, message }));

  const onCreate = async () => {
    if (!newName.trim()) return;
    setLoading("new");
    try {
      await bffApi.post("/categories", { Name: newName.trim() });
      toast("Category created");
      setAdding(false);
      setNewName("");
      router.refresh();
    } catch {
      toast("Failed to create category", "error");
    } finally {
      setLoading(null);
    }
  };

  const onUpdate = async (id: number) => {
    if (!editName.trim()) return;
    setLoading(id);
    try {
      await bffApi.put(`/categories/${id}`, { Name: editName.trim() });
      toast("Category updated");
      setEditId(null);
      router.refresh();
    } catch {
      toast("Failed to update", "error");
    } finally {
      setLoading(null);
    }
  };

  const onDelete = async (id: number) => {
    setLoading(id);
    try {
      await bffApi.delete(`/categories/${id}`);
      toast("Category deleted");
      router.refresh();
    } catch {
      toast("Cannot delete — products may be using this category", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> New category
        </Button>
      </div>

      {adding && (
        <Card className="flex items-center gap-2 p-3">
          <Input
            className="flex-1"
            placeholder="Category name"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onCreate(); if (e.key === "Escape") setAdding(false); }}
          />
          <Button size="sm" loading={loading === "new"} onClick={onCreate}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {initialCategories.map((cat) => (
        <Card key={cat.Id} className="flex items-center gap-3 p-3">
          {editId === cat.Id ? (
            <>
              <Input
                className="flex-1"
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onUpdate(cat.Id); if (e.key === "Escape") setEditId(null); }}
              />
              <Button size="sm" loading={loading === cat.Id} onClick={() => onUpdate(cat.Id)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <span className="flex-1 font-medium">{cat.Name}</span>
              <Badge tone={cat.IsActive ? "success" : "default"}>
                {cat.IsActive ? "Active" : "Inactive"}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditId(cat.Id); setEditName(cat.Name); }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                loading={loading === cat.Id}
                onClick={() => onDelete(cat.Id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
