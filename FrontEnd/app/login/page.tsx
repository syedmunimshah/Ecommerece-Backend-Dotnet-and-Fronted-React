"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { MotionButton } from "@/components/motion/MotionButton";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/motion";
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
import { useLoginMutation, useGetProfileQuery } from "@/lib/store/api/api";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials, setUser } from "@/features/auth/authSlice";
import { useAuth } from "@/features/auth/useAuth";
import { getApiErrorMessage } from "@/lib/utils/apiError";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const resetSuccess = searchParams.get("reset") === "success";

  const { data: profile } = useGetProfileQuery(undefined, { skip: !pendingToken });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(searchParams.get("redirect") ?? "/dashboard");
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    if (profile && pendingToken) {
      dispatch(setUser(profile));
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.replace(redirect);
    }
  }, [profile, pendingToken, dispatch, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: result.token }));
      setPendingToken(result.token);
    } catch {
      /* shown via error state */
    }
  };

  const errorMessage =
    error ? getApiErrorMessage(error, "Invalid email or password.") : null;

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader title="Sign in" subtitle="Welcome back to EdgeCart" />

        {resetSuccess && (
          <AuthAlert variant="success">
            Password reset successfully. Sign in with your new password.
          </AuthAlert>
        )}

        {errorMessage && <AuthAlert>{errorMessage}</AuthAlert>}

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

          <AuthField
            label="Password"
            action={
              <Link href="/forgot-password" className="text-xs font-medium text-accent hover:underline">
                Forgot password?
              </Link>
            }
          >
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputClass}
            />
          </AuthField>

          <motion.div variants={staggerItem}>
            <MotionButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </MotionButton>
          </motion.div>
        </AuthForm>

        <AuthFooter>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Create one
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
