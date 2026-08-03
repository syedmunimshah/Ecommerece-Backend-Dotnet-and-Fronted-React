"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/lib/store/api/api";
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
import type { RoleDto } from "@/lib/types/api";

export default function AdminRolesPage() {
  const [page] = useState(1);
  const { skipAdminApi } = useRoleApiSkip();
  const { data, isLoading, isError, refetch } = useGetRolesQuery(
    {
      pageNumber: page,
      pageSize: 20,
    },
    { skip: skipAdminApi },
  );
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [newName, setNewName] = useState("");

  const roles = data?.data ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createRole({ name: newName.trim() }).unwrap();
    setNewName("");
    refetch();
  };

  const handleDelete = async (role: RoleDto) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;
    await deleteRole(role.id).unwrap();
    refetch();
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Roles" }]} />
      <PageHeader title="Roles" subtitle="Manage system roles" />

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New role name..."
          className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load roles.</p>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between rounded-xl border border-border bg-[var(--card-bg)] p-4"
            >
              <input
                defaultValue={role.name}
                onBlur={(e) => {
                  if (e.target.value !== role.name) {
                    updateRole({
                      id: role.id,
                      data: { name: e.target.value, isActive: role.isActive },
                    });
                  }
                }}
                className="flex-1 bg-transparent font-medium outline-none"
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    defaultChecked={role.isActive}
                    onChange={(e) =>
                      updateRole({
                        id: role.id,
                        data: { name: role.name, isActive: e.target.checked },
                      })
                    }
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(role)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                  aria-label={`Delete ${role.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
