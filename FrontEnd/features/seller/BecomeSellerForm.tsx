"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField, Input, Textarea } from "@/components/ui/Input";
import { bffApi } from "@/services/api";
import { ApiError } from "@/types/api";
import type { SellerProfileDto } from "@/types/seller";

const schema = z.object({
  StoreName: z.string().min(2, "At least 2 characters"),
  StoreDescription: z.string().optional(),
  StoreAddress: z.string().optional(),
  PhoneNumber: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function BecomeSellerForm() {
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await bffApi.post<SellerProfileDto>("/seller-profiles", values);
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Could not submit application";
      dispatch(pushToast({ tone: "error", message }));
    } finally {
      setSubmitting(false);
    }
  });

  if (submitted) {
    return (
      <Card className="py-10 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-success" />
        <p className="text-lg font-semibold">Application submitted</p>
        <p className="mt-1 text-sm text-muted">
          Your seller profile is pending admin review. We&apos;ll notify you when it&apos;s approved.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Store name *" error={errors.StoreName?.message}>
          <Input placeholder="My Awesome Store" {...register("StoreName")} />
        </FormField>
        <FormField label="Description" error={errors.StoreDescription?.message}>
          <Textarea
            placeholder="Tell buyers what you sell…"
            {...register("StoreDescription")}
          />
        </FormField>
        <FormField label="Store address" error={errors.StoreAddress?.message}>
          <Input placeholder="City, Country" {...register("StoreAddress")} />
        </FormField>
        <FormField label="Phone number" error={errors.PhoneNumber?.message}>
          <Input type="tel" placeholder="+1 555 000 0000" {...register("PhoneNumber")} />
        </FormField>
        <Button type="submit" loading={submitting}>
          Submit application
        </Button>
      </form>
    </Card>
  );
}
