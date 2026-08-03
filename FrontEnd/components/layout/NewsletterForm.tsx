"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-foreground">Join our newsletter</p>
      {submitted ? (
        <p className="text-sm text-muted">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-[var(--card-bg)] px-3 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-lg bg-[var(--product-btn-bg)] px-4 text-sm font-semibold text-[var(--product-btn-text)] transition-opacity hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
