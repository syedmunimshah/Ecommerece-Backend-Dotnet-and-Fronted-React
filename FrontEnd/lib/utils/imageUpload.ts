const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function isAllowedImageFile(file: File): boolean {
  if (file.type && IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
    return true;
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  return Boolean(ext && IMAGE_EXTENSIONS.has(ext));
}

export const IMAGE_UPLOAD_MAX_MB = 5;

export function isWithinImageSizeLimit(file: File, maxMb = IMAGE_UPLOAD_MAX_MB): boolean {
  return file.size > 0 && file.size <= maxMb * 1024 * 1024;
}
