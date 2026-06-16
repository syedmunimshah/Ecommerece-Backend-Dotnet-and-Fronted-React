import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { getUserProfile } from "@/services/user.service";
import { UpdateProfileForm } from "@/features/auth/UpdateProfileForm";

export const metadata: Metadata = { title: "Edit Profile" };

export default async function EditProfilePage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/dashboard/profile/edit");

  const token = (await getServerToken())!;
  const profile = await getUserProfile(token).catch(() => null);
  if (!profile) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <UpdateProfileForm initialProfile={profile} />
    </div>
  );
}
