import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your account</p>
        </div>
        <Card className="p-6">
          <LoginForm />
        </Card>
        <p className="text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
