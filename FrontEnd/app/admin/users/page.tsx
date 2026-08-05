"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useActivateAdminUserMutation,
} from "@/lib/store/api/api";
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
import { formatRoleLabel, resolveRoleId } from "@/lib/utils/role";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getApiErrorMessage } from "@/lib/utils/apiError";

const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" },
  { id: 3, name: "Seller" },
];

export default function AdminUsersPage() {
  const [page] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const { skipAdminApi } = useRoleApiSkip();
  const { data, isLoading, isError } = useGetAdminUsersQuery(
    { pageNumber: page, pageSize: 20 },
    { skip: skipAdminApi },
  );
  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteAdminUserMutation();
  const [activateUser] = useActivateAdminUserMutation();

  const users = data?.data ?? [];

  const handleDeactivate = async (id: number) => {
    setActionError(null);
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not deactivate user."));
    }
  };

  const handleActivate = async (id: number) => {
    setActionError(null);
    try {
      await activateUser(id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not activate user."));
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Users" }]} />
      <PageHeader title="Users" subtitle={`${data?.totalRecords ?? 0} registered users`} />

      {actionError ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {actionError}
        </p>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load users.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const roleId = resolveRoleId(user);

            return (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-[var(--card-bg)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar fullName={user.fullName} image={user.image} size="md" />
                <div className="min-w-0">
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-muted">{user.email}</p>
                {user.roleName ? (
                  <span className="mt-1 inline-block rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {formatRoleLabel(user.roleName)}
                  </span>
                ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  key={`${user.id}-${roleId ?? user.roleName ?? "unknown"}`}
                  defaultValue={roleId ?? ""}
                  disabled={!roleId}
                  onChange={(e) =>
                    updateUser({
                      id: user.id,
                      data: {
                        fullName: user.fullName,
                        email: user.email,
                        isActive: user.isActive,
                        roleId: Number(e.target.value),
                      },
                    })
                  }
                  className="h-9 rounded-lg border border-border bg-surface px-2 text-sm disabled:opacity-50"
                >
                  {!roleId ? <option value="">Unknown role</option> : null}
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {/* Deactivating is reversible — the account row is kept and IsActive is
                    flipped — so this is a checkbox, not the trash icon it used to be. */}
                <label
                  className="flex items-center gap-2 text-sm text-muted"
                  title={user.isActive ? "Uncheck to deactivate this account" : "Check to reactivate this account"}
                >
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={(e) =>
                      e.target.checked ? handleActivate(user.id) : handleDeactivate(user.id)
                    }
                  />
                  Active
                </label>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </>
  );
}
