"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";

export default function ChangePasswordPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPassword = fd.get("newPassword") as string;
    const confirm = fd.get("confirm") as string;
    if (newPassword !== confirm) {
      dispatch(pushToast({ tone: "error", message: "Passwords do not match." }));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bff/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) throw new Error();
      dispatch(pushToast({ tone: "success", message: "Password updated successfully." }));
      e.currentTarget.reset();
    } catch {
      dispatch(pushToast({ tone: "error", message: "Failed to update password." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Change Password</h1>
      <Card className="max-w-md p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="New Password">
            <Input name="newPassword" type="password" required minLength={6} />
          </FormField>
          <FormField label="Confirm Password">
            <Input name="confirm" type="password" required minLength={6} />
          </FormField>
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
