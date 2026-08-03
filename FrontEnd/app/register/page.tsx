"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { useRegisterMutation } from "@/lib/store/api/api";
import { useAuth } from "@/features/auth/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ fullName: name, email, password }).unwrap();
      router.push("/login");
    } catch {
      /* shown via error state */
    }
  };

  const errorMessage =
    error && "data" in error ? "Registration failed. Please check your details." : null;

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader title="Create account" subtitle="Join EdgeCart Pakistan today" />

        {errorMessage && <AuthAlert>{errorMessage}</AuthAlert>}

        <AuthForm onSubmit={handleSubmit}>
          <AuthField label="Full Name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={authInputClass}
            />
          </AuthField>

          <AuthField label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
            />
          </AuthField>

          <AuthField label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputClass}
            />
          </AuthField>

          <motion.div variants={staggerItem}>
            <MotionButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </MotionButton>
          </motion.div>
        </AuthForm>

        <AuthFooter>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthShell>
  );
}
