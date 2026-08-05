"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/store/api/api";
import { asArray } from "@/lib/utils/paged";
import type { CategoryDto } from "@/lib/types/api";

type Status = { kind: "success" | "error"; text: string } | null;

export default function AdminCategoriesPage() {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [newName, setNewName] = useState("");

  // Pending edits, keyed by category id. A row is "dirty" while its draft differs
  // from the saved name, which is what enables its Update button.
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const categories = asArray<CategoryDto>(data);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory({ name: newName.trim() }).unwrap();
      setNewName("");
      setStatus({ kind: "success", text: `Category "${newName.trim()}" added.` });
      refetch();
    } catch {
      setStatus({ kind: "error", text: "Could not add the category. Please try again." });
    }
  };

  const save = async (cat: CategoryDto, name: string, isActive: boolean) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setStatus({ kind: "error", text: "Category name cannot be empty." });
      return;
    }
    setSavingId(cat.id);
    try {
      await updateCategory({ id: cat.id, name: trimmed, isActive }).unwrap();
      setDrafts((d) => {
        const next = { ...d };
        delete next[cat.id];
        return next;
      });
      setStatus({ kind: "success", text: `"${trimmed}" saved.` });
      refetch();
    } catch {
      setStatus({ kind: "error", text: `Could not save "${trimmed}". Please try again.` });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (cat: CategoryDto) => {
    try {
      await deleteCategory(cat.id).unwrap();
      setStatus({ kind: "success", text: `"${cat.name}" removed.` });
      refetch();
    } catch {
      setStatus({ kind: "error", text: `Could not remove "${cat.name}".` });
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]} />
      <PageHeader title="Categories" subtitle="Create and manage product categories" />

      <form onSubmit={handleCreate} className="mb-4 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {status && (
        <p
          role="status"
          className={
            status.kind === "success"
              ? "mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700"
              : "mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-700"
          }
        >
          {status.text}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load categories.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const draft = drafts[cat.id] ?? cat.name;
            const dirty = draft.trim() !== cat.name;
            const saving = savingId === cat.id;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[var(--card-bg)] p-4"
              >
                <input
                  value={draft}
                  onChange={(e) => setDrafts((d) => ({ ...d, [cat.id]: e.target.value }))}
                  className="flex-1 bg-transparent font-medium text-foreground outline-none"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => save(cat, draft, cat.isActive)}
                    disabled={!dirty || saving}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-orange-500 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Update
                  </button>

                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={cat.isActive}
                      onChange={(e) => save(cat, draft, e.target.checked)}
                    />
                    Active
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="text-muted hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
