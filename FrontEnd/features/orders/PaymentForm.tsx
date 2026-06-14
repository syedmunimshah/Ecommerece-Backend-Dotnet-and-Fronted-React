"use client";

import { useState } from "react";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField, Input } from "@/components/ui/Input";
import { bffApi } from "@/services/api";
import { formatCurrency } from "@/lib/format";
import type { PaymentDto } from "@/types/payment";

const PAYMENT_METHODS = [
  { id: "CreditCard", label: "Credit / Debit Card", icon: CreditCard },
  { id: "PayPal", label: "PayPal", icon: Wallet },
  { id: "Cash", label: "Cash on Delivery", icon: Banknote },
] as const;

export function PaymentForm({
  orderId,
  amount,
  onSuccess,
}: {
  orderId: number;
  amount: number;
  onSuccess: (payment: PaymentDto) => void;
}) {
  const dispatch = useAppDispatch();
  const [method, setMethod] = useState<string>("CreditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pay = async () => {
    if (method === "CreditCard" && cardNumber.replace(/\s/g, "").length < 12) {
      dispatch(pushToast({ tone: "error", message: "Enter a valid card number." }));
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await bffApi.post<PaymentDto>("/payments", {
        OrderId: orderId,
        Amount: amount,
        PaymentMethod: method,
      });
      dispatch(pushToast({ tone: "success", message: "Payment completed!" }));
      onSuccess(data);
    } catch {
      dispatch(pushToast({ tone: "error", message: "Payment failed. Try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-1 text-lg font-semibold">Payment</h2>
      <p className="mb-6 text-sm text-muted">
        Order #{orderId} · {formatCurrency(amount)}
      </p>

      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
              method === id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-elevated text-muted hover:border-primary/50"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {method === "CreditCard" && (
        <div className="mb-6 space-y-4">
          <FormField label="Cardholder name">
            <Input
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </FormField>
          <FormField label="Card number">
            <Input
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Expiry">
              <Input placeholder="MM/YY" />
            </FormField>
            <FormField label="CVV">
              <Input placeholder="123" maxLength={4} />
            </FormField>
          </div>
        </div>
      )}

      {method === "PayPal" && (
        <p className="mb-6 text-sm text-muted">
          You will be redirected to PayPal to complete payment (simulated in demo).
        </p>
      )}

      {method === "Cash" && (
        <p className="mb-6 text-sm text-muted">
          Pay with cash when your order is delivered.
        </p>
      )}

      <Button className="w-full" size="lg" loading={submitting} onClick={pay}>
        Pay {formatCurrency(amount)}
      </Button>
    </Card>
  );
}
