"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { MotionButton } from "@/components/motion/MotionButton";
import {
  AuthShell,
  AuthCard,
  AuthHeader,
  AuthField,
  AuthFooter,
  AuthForm,
  AuthAlert,
  authInputClass,
} from "@/components/auth/AuthShell";
import { staggerItem } from "@/lib/motion";
import { useResetPasswordMutation } from "@/lib/store/api/api";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) return;
    try {
      await resetPassword({ email, otp, newPassword }).unwrap();
      router.push("/login?reset=success");
    } catch {
      /* error state */
    }
  };

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader
          title="Reset password"
          subtitle="Enter the 4-digit OTP from your email and choose a new password."
        />

        {error && (
          <AuthAlert>Invalid or expired OTP. Request a new one.</AuthAlert>
        )}

        <AuthForm onSubmit={handleSubmit}>
          <AuthField label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
            />
          </AuthField>

          <AuthField label="4-digit OTP">
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{4}"
              maxLength={4}
              placeholder="4829"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className={`${authInputClass} font-mono tracking-[0.4em]`}
            />
          </AuthField>

          <AuthField label="New password">
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={authInputClass}
            />
          </AuthField>

          <AuthField label="Confirm password">
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={authInputClass}
            />
            {confirm && newPassword !== confirm && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords do not match.</p>
            )}
          </AuthField>

          <motion.div variants={staggerItem}>
            <MotionButton type="submit" className="w-full" disabled={isLoading || otp.length !== 4}>
              {isLoading ? "Resetting..." : "Reset password"}
            </MotionButton>
          </motion.div>
        </AuthForm>

        <AuthFooter>
          <Link href="/forgot-password" className="font-semibold text-accent hover:underline">
            Request new OTP
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
