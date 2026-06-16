"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;
    if (password !== confirm) {
      dispatch(pushToast({ tone: "error", message: "Passwords do not match." }));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch(pushToast({ tone: "success", message: "Password updated successfully." }));
      router.push("/login");
    }, 800);
  };

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <Lock className="mx-auto mb-3 h-10 w-10 text-accent" />
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-muted">Enter your new password below.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="New Password">
            <Input name="password" type="password" required minLength={6} placeholder="••••••••" />
          </FormField>
          <FormField label="Confirm Password">
            <Input name="confirm" type="password" required minLength={6} placeholder="••••••••" />
          </FormField>
          <Button type="submit" className="w-full" loading={loading}>
            Update Password
          </Button>
          <p className="text-center text-sm text-muted">
            <Link href="/login" className="text-accent hover:underline">Back to login</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
