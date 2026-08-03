import type { UserDto } from "@/lib/types/api";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop";

export function normalizeUserDto(raw: unknown): UserDto {
  const user = raw as UserDto & { imgae?: string | null };
  return {
    ...user,
    image: user.image ?? user.imgae ?? null,
  };
}

export function getUserAvatarUrl(user?: { image?: string | null } | null): string | null {
  return user?.image ?? null;
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export { DEFAULT_AVATAR };
