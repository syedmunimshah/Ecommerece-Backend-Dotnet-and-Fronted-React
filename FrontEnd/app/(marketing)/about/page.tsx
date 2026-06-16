import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Users, Award } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "About Us" }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold">About EdgeCart</h1>
        <p className="text-lg text-muted">
          EdgeCart is Pakistan&apos;s modern e-commerce marketplace, connecting buyers with verified sellers through a secure, role-based platform built on Next.js and .NET.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", body: "Make online shopping accessible, secure, and delightful for everyone." },
            { icon: Users, title: "Our Community", body: "Thousands of buyers and sellers trust EdgeCart every day." },
            { icon: Award, title: "Our Promise", body: "Verified sellers, secure payments, and responsive support." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6 text-center">
              <Icon className="mx-auto mb-3 h-8 w-8 text-accent" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products">
            <Button size="lg" className="gap-2">
              Start Shopping <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
