"use client";

import { useState } from "react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { MotionButton } from "@/components/motion/MotionButton";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { CheckCircle2 } from "lucide-react";
import { useCreateSellerProfileMutation } from "@/lib/store/api/api";

export default function BecomeSellerPage() {
  const [createSeller, { isLoading, error }] = useCreateSellerProfileMutation();
  const [submitted, setSubmitted] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSeller({
        storeName,
        storeDescription,
        storeAddress,
        phoneNumber,
      }).unwrap();
      setSubmitted(true);
    } catch {
      /* error state */
    }
  };

  if (submitted) {
    return (
      <>
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Become a Seller" }]} />
        <div className="flex flex-col items-center rounded-2xl border border-border bg-[var(--card-bg)] px-6 py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <h2 className="mt-4 text-xl font-bold">Application Submitted</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            We&apos;ll review your seller profile within 24–48 hours. You&apos;ll receive an email once approved.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Become a Seller" }]} />
      <PageHeader title="Become a Seller" subtitle="Start selling on EdgeCart Pakistan" />
      <AnimateIn>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg space-y-4 rounded-2xl border border-border bg-[var(--card-bg)] p-6"
        >
          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">
              Failed to submit application. Please try again.
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Store Name</label>
            <input
              required
              minLength={2}
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Store Description</label>
            <textarea
              rows={3}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Store Address</label>
            <textarea
              required
              rows={2}
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <MotionButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </MotionButton>
        </form>
      </AnimateIn>
    </>
  );
}
