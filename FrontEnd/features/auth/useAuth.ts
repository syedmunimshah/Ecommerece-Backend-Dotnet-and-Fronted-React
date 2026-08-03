"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { useGetProfileQuery } from "@/lib/store/api/api";
import { resolveUserRole } from "@/lib/utils/role";

export function useAuth() {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = Boolean(token);
  const role = resolveUserRole(user, token);

  const { isLoading: profileLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  return {
    token,
    user,
    role,
    isAuthenticated,
    isLoading: isAuthenticated && profileLoading && !user,
    isAdmin: role === "Admin",
    isSeller: role === "Seller",
    isUser: role === "User",
  };
}
