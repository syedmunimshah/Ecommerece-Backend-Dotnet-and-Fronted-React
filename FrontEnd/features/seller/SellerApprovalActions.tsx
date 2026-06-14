"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { bffApi } from "@/services/api";

export function SellerApprovalActions({ sellerId }: { sellerId: number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const act = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      await bffApi.post(`/seller-profiles/${sellerId}/${action}`);
      dispatch(
        pushToast({
          tone: action === "approve" ? "success" : "info",
          message: action === "approve" ? "Seller approved" : "Seller rejected",
        }),
      );
      router.refresh();
    } catch {
      dispatch(pushToast({ tone: "error", message: "Action failed. Try again." }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        loading={loading === "approve"}
        disabled={!!loading}
        onClick={() => act("approve")}
      >
        <CheckCircle2 className="h-4 w-4 text-success" /> Approve
      </Button>
      <Button
        size="sm"
        variant="secondary"
        loading={loading === "reject"}
        disabled={!!loading}
        onClick={() => act("reject")}
      >
        <XCircle className="h-4 w-4 text-destructive" /> Reject
      </Button>
    </div>
  );
}
