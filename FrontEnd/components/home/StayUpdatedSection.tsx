"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { MotionButton } from "@/components/motion/MotionButton";

export function StayUpdatedSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-[var(--section-muted)] px-4 py-10 lg:hidden">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--chip-bg)]">
          <Zap className="h-5 w-5 text-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Stay Updated</h2>
        <p className="mt-2 text-sm text-muted">
          Subscribe to get notified about new deals and exclusive flash sales.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-foreground">You&apos;re subscribed!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="h-12 w-full rounded-xl border border-border bg-[var(--card-bg)] px-4 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
            />
            <MotionButton type="submit" className="h-12 w-full rounded-xl">
              Subscribe Now
            </MotionButton>
          </form>
        )}
      </div>
    </section>
  );
}
