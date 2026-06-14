import type { Metadata } from "next";
import { BecomeSellerForm } from "@/features/seller/BecomeSellerForm";

export const metadata: Metadata = { title: "Become a Seller" };

export default function BecomeSellerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Become a seller</h1>
        <p className="mt-1 text-muted text-sm">
          Submit your store profile for admin review. You can start listing products once
          your profile is approved.
        </p>
      </div>
      <BecomeSellerForm />
    </div>
  );
}
