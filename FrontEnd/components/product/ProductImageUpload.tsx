"use client";

import { ProductImage } from "@/components/product/ProductImage";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useUploadProductImageMutation } from "@/lib/store/api/api";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_MB = 5;

export function ProductImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [upload, { isLoading, error }] = useUploadProductImageMutation();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setLocalError("Only JPG, PNG, WEBP, GIF allowed.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setLocalError(`Max file size is ${MAX_MB} MB.`);
      return;
    }

    setLocalError(null);
    try {
      const result = await upload(file).unwrap();
      onChange(result.url);
    } catch {
      setLocalError("Upload failed. Try again.");
    }
  };

  const errMsg = localError ?? (error ? "Upload failed." : null);

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-8 transition-colors hover:border-accent">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted" />
            <span className="mt-2 text-sm font-medium">Click to upload image</span>
            <span className="mt-1 text-xs text-muted">JPG, PNG, WEBP, GIF — max 5 MB</span>
          </>
        )}
        <input type="file" accept={ALLOWED.join(",")} className="hidden" onChange={handleFile} />
      </label>

      {errMsg && (
        <p className="text-sm text-red-600">{errMsg}</p>
      )}

      {value && (
        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border">
          <ProductImage src={value} alt="Product preview" fill className="object-cover" />
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs text-muted">Or paste image URL</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </div>
  );
}
