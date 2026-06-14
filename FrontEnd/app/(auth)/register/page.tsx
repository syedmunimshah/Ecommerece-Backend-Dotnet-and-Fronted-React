import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Start shopping in seconds</p>
        </div>
        <Card className="p-6">
          <RegisterForm />
        </Card>
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
