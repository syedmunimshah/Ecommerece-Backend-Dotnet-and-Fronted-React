"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField, Input } from "@/components/ui/Input";
import { bffApi } from "@/services/api";
import type { UserDto } from "@/types/auth";

const profileSchema = z.object({
  FullName: z.string().min(2, "At least 2 characters required"),
  NewPassword: z.string().min(6, "Password must be at least 6 characters").or(z.string().length(0)).optional().nullable(),
  ConfirmPassword: z.string().optional().nullable(),
}).refine((data) => {
  if (data.NewPassword && data.NewPassword.length > 0) {
    return data.NewPassword === data.ConfirmPassword;
  }
  return true;
}, {
  message: "Passwords must match",
  path: ["ConfirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UpdateProfileForm({ initialProfile }: { initialProfile: UserDto }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      FullName: initialProfile.FullName,
      NewPassword: "",
      ConfirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload: { FullName: string; NewPassword?: string } = {
        FullName: values.FullName.trim(),
      };
      if (values.NewPassword && values.NewPassword.trim().length >= 6) {
        payload.NewPassword = values.NewPassword.trim();
      }
      
      await bffApi.put("/user/profile", payload);
      dispatch(pushToast({ tone: "success", message: "Profile updated successfully!" }));
      setValue("NewPassword", "");
      setValue("ConfirmPassword", "");
      router.refresh();
    } catch {
      dispatch(pushToast({ tone: "error", message: "Failed to update profile." }));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card className="border border-border p-6 bg-surface/40 backdrop-blur-sm shadow-sm">
      <h2 className="text-lg font-bold mb-4">Edit Profile Info</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Full Name *" error={errors.FullName?.message}>
          <Input placeholder="Enter your full name" {...register("FullName")} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="New Password (optional)" error={errors.NewPassword?.message} hint="Min 6 characters">
            <Input type="password" placeholder="••••••" {...register("NewPassword")} />
          </FormField>
          
          <FormField label="Confirm New Password" error={errors.ConfirmPassword?.message}>
            <Input type="password" placeholder="••••••" {...register("ConfirmPassword")} />
          </FormField>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={submitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
