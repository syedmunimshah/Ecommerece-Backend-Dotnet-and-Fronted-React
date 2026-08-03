"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser } from "@/features/auth/authSlice";
import { useGetProfileQuery } from "@/lib/store/api/api";
import { resolveUserRole } from "@/lib/utils/role";
import { normalizeUserDto } from "@/lib/utils/user";
import type { UserDto } from "@/lib/types/api";

/** Keeps Redux user in sync with /api/user/profile when a token exists. */
export function AuthProfileSync() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!profile && !token) return;

    const roleName = profile ? resolveUserRole(profile, token) : null;
    const merged: UserDto | null = profile
      ? normalizeUserDto({
          ...profile,
          roleName: roleName ?? profile.roleName,
        })
      : null;

    if (
      merged &&
      (!user ||
        user.id !== merged.id ||
        user.roleId !== merged.roleId ||
        user.roleName !== merged.roleName)
    ) {
      dispatch(setUser(merged));
    }
  }, [profile, user, token, dispatch]);

  return null;
}
