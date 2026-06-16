import type { Metadata } from "next";
import Link from "next/link";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Blog Management" };
export default function Page() {
  return (
    <div className="space-y-6">
      <AdminPlaceholder title="Blog Management" description="Create and publish blog posts." />
      <Link href="/blog"><Button variant="outline">View public blog</Button></Link>
    </div>
  );
}
