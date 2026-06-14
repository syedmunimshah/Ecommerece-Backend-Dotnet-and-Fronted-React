"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Shield, User, Store, Loader2, Check, X } from "lucide-react";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input } from "@/components/ui/Input";
import { bffApi } from "@/services/api";
import { ROLE_IDS } from "@/types/auth";
import type { UserDto, Role } from "@/types/auth";

export function UsersManager({
  initialUsers,
}: {
  initialUsers: UserDto[];
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Edit form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [isActive, setIsActive] = useState(true);

  const toast = (message: string, tone: "success" | "error" = "success") =>
    dispatch(pushToast({ tone, message }));

  const openEditModal = (u: UserDto) => {
    setEditingUser(u);
    setFullName(u.FullName);
    setEmail(u.Email);
    setRole(u.RoleName);
    setIsActive(u.IsActive);
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      await bffApi.put(`/admin/users/${editingUser.Id}`, {
        FullName: fullName.trim(),
        Email: email.trim(),
        IsActive: isActive,
        RoleId: ROLE_IDS[role],
      });
      toast("User updated successfully");
      setModalOpen(false);
      router.refresh();
    } catch {
      toast("Failed to update user", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      setDeletingId(id);
      try {
        await bffApi.delete(`/admin/users/${id}`);
        toast("User deleted successfully");
        router.refresh();
      } catch {
        toast("Failed to delete user", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "Admin":
        return <Shield className="h-3.5 w-3.5 text-primary" />;
      case "Seller":
        return <Store className="h-3.5 w-3.5 text-accent" />;
      default:
        return <User className="h-3.5 w-3.5 text-muted" />;
    }
  };

  return (
    <div>
      <Card className="p-0 overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-elevated/40">
              <tr>
                {["ID", "Name", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold text-muted uppercase tracking-wider text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialUsers.map((u) => (
                <tr key={u.Id} className="hover:bg-elevated/20 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-muted">#{u.Id}</td>
                  <td className="px-5 py-4 font-semibold text-foreground">{u.FullName}</td>
                  <td className="px-5 py-4 text-muted">{u.Email}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-surface border border-border shadow-sm">
                      {getRoleIcon(u.RoleName)}
                      {u.RoleName}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={u.IsActive ? "success" : "destructive"}>
                      {u.IsActive ? "Active" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(u)}
                        aria-label={`Edit ${u.FullName}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        loading={deletingId === u.Id}
                        onClick={() => handleDelete(u.Id)}
                        aria-label={`Delete ${u.FullName}`}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit User Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit User Account"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <FormField label="Full Name *">
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormField>

          <FormField label="Email *">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Assigned Role *">
            <select
              className="input-base w-full bg-surface"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="User">User</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
          </FormField>

          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              className="rounded border-border bg-surface text-accent focus:ring-accent"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm font-medium">User account is active</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
