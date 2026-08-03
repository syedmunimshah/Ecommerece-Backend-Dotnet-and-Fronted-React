"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/features/auth/authSlice";
import { useUploadProfileImageMutation } from "@/lib/store/api/api";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import {
  IMAGE_UPLOAD_MAX_MB,
  isAllowedImageFile,
  isWithinImageSizeLimit,
} from "@/lib/utils/imageUpload";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_MB = IMAGE_UPLOAD_MAX_MB;

export function ProfileImageUpload({
  fullName,
  image,
}: {
  fullName: string;
  image?: string | null;
}) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, { isLoading }] = useUploadProfileImageMutation();
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!isAllowedImageFile(file)) {
      setError("Only JPG, PNG, WEBP, or GIF allowed.");
      return;
    }
    if (!isWithinImageSizeLimit(file, MAX_MB)) {
      setError(`Max file size is ${MAX_MB} MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
      return;
    }

    setError(null);
    try {
      const updated = await upload(file).unwrap();
      dispatch(setUser(updated));
    } catch (err) {
      setError(getApiErrorMessage(err, "Upload failed. Try again."));
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <div className="relative">
        <UserAvatar fullName={fullName} image={image} size="xl" />
        {isLoading ? (
          <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </span>
        ) : null}
      </div>
      <div className="text-center sm:text-left">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium transition-colors hover:bg-[var(--chip-bg)] disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
          {isLoading ? "Uploading..." : "Change photo"}
        </button>
        <p className="mt-2 text-xs text-muted">JPG, PNG, WEBP, GIF — max {MAX_MB} MB</p>
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
