"use client";

import { useState, FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    dispatch(pushToast({ tone: "success", message: "Thanks for subscribing!" }));
    setEmail("");
  };

  return (
    <AnimateIn as="section" className="container-page py-16" variant="scale-in">
      <div className="card mx-auto max-w-2xl p-8 text-center motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-glow-lg">
        <Mail className="mx-auto mb-4 h-10 w-10 text-accent motion-safe:animate-bounce-soft" />
        <h2 className="text-2xl font-bold">Subscribe to our newsletter</h2>
        <p className="mt-2 text-sm text-muted">
          Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-base flex-1"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </AnimateIn>
  );
}
