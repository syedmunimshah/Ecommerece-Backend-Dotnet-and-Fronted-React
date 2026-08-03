import Link from "next/link";
import { MotionButton } from "@/components/motion/MotionButton";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-bold text-muted">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <MotionButton href="/">Go Home</MotionButton>
        <Link
          href="/products"
          className="inline-flex h-11 items-center rounded-xl border border-border px-6 text-sm font-semibold hover:bg-[var(--chip-bg)]"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
