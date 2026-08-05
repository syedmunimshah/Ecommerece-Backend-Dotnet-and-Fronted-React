"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/features/ui/ThemeToggle";
import { easeOut, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/cn";

function AuthBackground({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="auth-page-bg absolute inset-0" />

      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--auth-grid-opacity)",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        className="absolute h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: "var(--auth-glow)",
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          x: "-50%",
          y: "-50%",
        }}
        animate={{ left: `${mouse.x}%`, top: `${mouse.y}%` }}
        transition={{ type: "spring", stiffness: 40, damping: 24 }}
      />

      <motion.div
        className="absolute -left-28 top-[8%] h-[22rem] w-[22rem] rounded-full blur-3xl"
        style={{ background: "var(--auth-blob-1)" }}
        animate={{ x: [0, 50, 0], y: [0, -35, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-[30%] h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--auth-blob-2)" }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-[6%] left-[28%] h-72 w-72 rounded-full blur-3xl"
        style={{ background: "var(--auth-blob-3)" }}
        animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--auth-from)]/90 via-transparent to-[var(--auth-to)]/50" />
    </div>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <AuthBackground mouse={mouse} />

      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="rounded-full border border-[var(--auth-card-border)] bg-[var(--auth-card-bg)] px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md transition-colors hover:text-accent"
        >
          ← Back to shop
        </Link>
        <ThemeToggle className="border-[var(--auth-card-border)] bg-[var(--auth-card-bg)] backdrop-blur-md" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
        {children}
      </div>
    </div>
  );
}

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("w-full max-w-md", className)}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut }}
    >
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12, ease: easeOut }}
        className="mb-8 flex justify-center"
      >
        <Link href="/" className="transition-transform hover:scale-[1.02]">
          <Logo link={false} />
        </Link>
      </motion.div>

      <motion.div
        className="rounded-2xl border p-6 backdrop-blur-xl sm:p-8"
        style={{
          background: "var(--auth-card-bg)",
          borderColor: "var(--auth-card-border)",
          boxShadow: "var(--auth-card-shadow)",
        }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.18, ease: easeOut }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.28, ease: easeOut }}
    >
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
    </motion.div>
  );
}

export function AuthForm({
  children,
  className,
  onSubmit,
}: {
  children: React.ReactNode;
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <motion.form
      className={cn("mt-6 space-y-4", className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onSubmit={onSubmit}
    >
      {children}
    </motion.form>
  );
}

export function AuthField({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div variants={staggerItem}>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export function AuthAlert({
  children,
  variant = "error",
}: {
  children: React.ReactNode;
  variant?: "error" | "success";
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className={cn(
        "mt-4 rounded-lg px-4 py-2 text-sm",
        variant === "error"
          ? "bg-red-500/10 text-red-600 dark:text-red-400"
          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      )}
    >
      {children}
    </motion.p>
  );
}

export function AuthFooter({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      className="mt-6 text-center text-sm text-muted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.55, ease: easeOut }}
    >
      {children}
    </motion.p>
  );
}

// No opacity modifiers here: the theme colors are `var(--x)` hex values, and Tailwind 3
// emits invalid CSS for `bg-surface/90` on those, so the rule is dropped and the input
// falls back to the browser default white — unreadable on the dark card. Colors are set
// explicitly so both themes stay legible.
export const authInputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent";
