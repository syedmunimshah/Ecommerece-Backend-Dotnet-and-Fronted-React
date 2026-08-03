"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { useForgotPasswordMutation } from "@/lib/store/api/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword({ email });
  };

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader
          title="Forgot password"
          subtitle="Enter your email and we'll send a 4-digit OTP (max 5 per day)."
        />

        {isSuccess ? (
          <>
            <AuthAlert variant="success">
              If an account exists for this email, a 4-digit OTP has been sent. It is valid for
              10 minutes (max 5 requests per day). In development, check the API console for the
              OTP.
            </AuthAlert>
            <div className="mt-6">
              <MotionButton
                type="button"
                className="w-full"
                onClick={() =>
                  router.push(`/reset-password?email=${encodeURIComponent(email)}`)
                }
              >
                Enter OTP & reset password
              </MotionButton>
            </div>
          </>
        ) : (
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

            <motion.div variants={staggerItem}>
              <MotionButton type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </MotionButton>
            </motion.div>
          </AuthForm>
        )}

        <AuthFooter>
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Back to sign in
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthShell>
  );
}
