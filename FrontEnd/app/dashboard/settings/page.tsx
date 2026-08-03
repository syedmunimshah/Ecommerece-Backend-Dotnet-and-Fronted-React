"use client";

import { useEffect, useState } from "react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/lib/store/api/api";
import { useAuth } from "@/features/auth/useAuth";
import { ProfileImageUpload } from "@/components/user/ProfileImageUpload";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/features/auth/authSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [updateProfile, { isLoading: saving, isSuccess }] = useUpdateProfileMutation();
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (profile) setFullName(profile.fullName);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({
        fullName,
        ...(newPassword ? { newPassword } : {}),
      }).unwrap();
      dispatch(setUser(updated));
      setNewPassword("");
    } catch {
      /* mutation error state */
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]} />
      <PageHeader title="Account Settings" subtitle="Update your profile and preferences" />
      <AnimateIn>
        {isLoading ? (
          <p className="text-muted">Loading profile...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-lg space-y-6 rounded-2xl border border-border bg-[var(--card-bg)] p-6"
          >
            {profile && (
              <ProfileImageUpload fullName={profile.fullName} image={profile.image} />
            )}

            {isSuccess && (
              <p className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700">
                Profile updated successfully.
              </p>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                readOnly
                value={profile?.email ?? ""}
                className="h-11 w-full rounded-xl border border-border bg-surface/50 px-4 text-sm text-muted"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">New Password (optional)</label>
              <input
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <MotionButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </MotionButton>
          </form>
        )}
      </AnimateIn>
    </>
  );
}
