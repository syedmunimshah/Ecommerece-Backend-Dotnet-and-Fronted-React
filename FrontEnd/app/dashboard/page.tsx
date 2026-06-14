import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { getUserProfile } from "@/services/user.service";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UpdateProfileForm } from "@/features/auth/UpdateProfileForm";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/dashboard");

  const token = (await getServerToken())!;
  const profile = await getUserProfile(token).catch(() => null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My profile</h1>

      <Card>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">Email</dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">Role</dt>
            <dd className="mt-1">
              <Badge tone={user.role === "Admin" ? "primary" : "default"}>
                {user.role}
              </Badge>
            </dd>
          </div>
          {profile && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">Full name</dt>
              <dd className="mt-1 font-medium">{profile.FullName}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">User ID</dt>
            <dd className="mt-1 text-muted">#{user.id}</dd>
          </div>
        </dl>
      </Card>

      {profile && <UpdateProfileForm initialProfile={profile} />}
    </div>
  );
}
