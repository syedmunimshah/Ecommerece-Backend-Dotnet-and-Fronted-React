"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { DEFAULT_AVATAR, getUserAvatarUrl, getUserInitials } from "@/lib/utils/user";

const SIZE_CLASS = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-lg",
  xl: "h-24 w-24 text-2xl",
} as const;

export function UserAvatar({
  fullName,
  image,
  size = "md",
  className,
}: {
  fullName: string;
  image?: string | null;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  const avatarUrl = getUserAvatarUrl({ image });
  const sizeClass = SIZE_CLASS[size];

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={fullName}
        width={size === "xl" ? 96 : size === "lg" ? 56 : size === "md" ? 40 : 32}
        height={size === "xl" ? 96 : size === "lg" ? 56 : size === "md" ? 40 : 32}
        className={cn("rounded-full object-cover ring-2 ring-border", sizeClass, className)}
        unoptimized={avatarUrl.includes("localhost:5241")}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-accent font-bold text-white ring-2 ring-border",
        sizeClass,
        className,
      )}
      aria-hidden
    >
      {getUserInitials(fullName || "?")}
    </span>
  );
}

export function UserAvatarPlaceholder({ size = "md", className }: { size?: keyof typeof SIZE_CLASS; className?: string }) {
  return (
    <Image
      src={DEFAULT_AVATAR}
      alt=""
      width={40}
      height={40}
      className={cn("rounded-full object-cover ring-2 ring-border", SIZE_CLASS[size], className)}
    />
  );
}
