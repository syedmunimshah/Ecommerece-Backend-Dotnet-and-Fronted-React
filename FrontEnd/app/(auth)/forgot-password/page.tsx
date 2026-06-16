"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      dispatch(pushToast({ tone: "success", message: "Reset link sent to your email." }));
    }, 800);
  };

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <Breadcrumb items={[{ label: "Forgot Password" }]} className="mb-6" />
        <div className="mb-6 text-center">
          <Mail className="mx-auto mb-3 h-10 w-10 text-accent" />
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-sm text-foreground/80">
              Check your inbox for password reset instructions.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm text-accent hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Email">
              <Input name="email" type="email" required placeholder="you@example.com" />
            </FormField>
            <Button type="submit" className="w-full" loading={loading}>
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-muted">
              Remember your password?{" "}
              <Link href="/login" className="text-accent hover:underline">Login</Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
