"use client";

import { Plus, Trash2 } from "lucide-react";
import type { SaveProductVariantDto } from "@/lib/types/api";
import { cn } from "@/lib/cn";

/**
 * Lets a seller define the options a product is sold in — "Small / Medium / Large",
 * "50ml / 100ml", "Red / M". Each option carries its own price and stock, because those
 * genuinely differ and running out of one says nothing about the others.
 *
 * Leaving the list empty sells the product in a single form, using the price and stock
 * fields on the form above. That is the default, so nothing changes for sellers who don't
 * need options.
 */
export function ProductVariantsEditor({
  variants,
  onChange,
  disabled,
}: {
  variants: SaveProductVariantDto[];
  onChange: (next: SaveProductVariantDto[]) => void;
  disabled?: boolean;
}) {
  const update = (index: number, patch: Partial<SaveProductVariantDto>) =>
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  const add = () =>
    onChange([
      ...variants,
      {
        // 0 marks a new option — the API creates it rather than updating an existing one.
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        isActive: true,
        sortOrder: variants.length + 1,
      },
    ]);

  const remove = (index: number) =>
    onChange(variants.filter((_, i) => i !== index));

  const duplicateNames = new Set(
    variants
      .map((v) => v.name.trim().toLowerCase())
      .filter((name, i, all) => name && all.indexOf(name) !== i),
  );

  return (
    <div className="rounded-2xl border border-border bg-[var(--card-bg)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Options</h2>
          <p className="mt-1 text-sm text-muted">
            Sizes, colours, flavours — anything sold at its own price or stock. Leave empty to
            sell this product in one form.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-accent disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Add option
        </button>
      </div>

      {variants.length > 0 && (
        <div className="mt-4 space-y-3">
          {variants.map((variant, index) => {
            const isDuplicate =
              variant.name.trim() !== "" &&
              duplicateNames.has(variant.name.trim().toLowerCase());

            return (
              <div
                key={variant.id || `new-${index}`}
                className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_7rem_6rem_auto] sm:items-end"
              >
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted">Name</span>
                  <input
                    value={variant.name}
                    onChange={(e) => update(index, { name: e.target.value })}
                    placeholder="Large"
                    disabled={disabled}
                    className={cn(
                      "h-10 w-full rounded-lg border bg-surface px-3 text-sm text-foreground outline-none focus:border-accent",
                      isDuplicate ? "border-red-500" : "border-border",
                    )}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted">Price</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => update(index, { price: Number(e.target.value) })}
                    disabled={disabled}
                    className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-accent"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted">Stock</span>
                  <input
                    type="number"
                    min={0}
                    value={variant.stock}
                    onChange={(e) => update(index, { stock: Number(e.target.value) })}
                    disabled={disabled}
                    className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-accent"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={disabled}
                  aria-label={`Remove ${variant.name || "option"}`}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted transition hover:border-red-500 hover:text-red-500 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {isDuplicate && (
                  <p className="text-xs text-red-600 sm:col-span-4">
                    Two options cannot share a name.
                  </p>
                )}
              </div>
            );
          })}

          <p className="text-xs text-muted">
            Removing an option hides it from the shop but keeps it on past orders, so your sales
            history stays intact.
          </p>
        </div>
      )}
    </div>
  );
}

/** True when the editor holds something the API would reject. */
export function findVariantProblem(variants: SaveProductVariantDto[]): string | null {
  if (variants.length === 0) return null;

  if (variants.some((v) => !v.name.trim())) {
    return "Every option needs a name.";
  }

  const names = variants.map((v) => v.name.trim().toLowerCase());
  if (new Set(names).size !== names.length) {
    return "Two options cannot share a name.";
  }

  if (variants.some((v) => v.price <= 0)) {
    return "Every option needs a price above 0.";
  }

  if (variants.some((v) => v.stock < 0)) {
    return "Stock cannot be negative.";
  }

  return null;
}
