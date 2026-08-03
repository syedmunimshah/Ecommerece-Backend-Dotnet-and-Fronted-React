"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import type { UserRole } from "@/lib/types/api";

export function RoleGuard({
  allowed,
  children,
  redirectTo = "/login",
}: {
  allowed: UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (role && !allowed.includes(role)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, role, allowed, router, redirectTo]);

  if (isLoading || !isAuthenticated || (role && !allowed.includes(role))) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
