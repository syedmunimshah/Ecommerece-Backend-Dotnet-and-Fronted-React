"use client";

import { useAuth } from "@/features/auth/useAuth";

/** RTK Query `skip` flags aligned with backend role rules (see docs/Latest-Changes-Handoff.md). */
export function useRoleApiSkip() {
  const { isAuthenticated, isUser, isAdmin, isSeller } = useAuth();

  return {
    skipUserApi: !isAuthenticated || !isUser,
    skipAdminApi: !isAuthenticated || !isAdmin,
    skipSellerApi: !isAuthenticated || !isSeller,
  };
}
