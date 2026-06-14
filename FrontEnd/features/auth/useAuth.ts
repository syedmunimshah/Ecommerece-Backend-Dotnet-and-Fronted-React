"use client";

import { useAppSelector } from "@/lib/reduxStore";

export function useAuth() {
  const user = useAppSelector((s) => s.auth.user);
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "Admin",
    isSeller: user?.role === "Seller",
  };
}
