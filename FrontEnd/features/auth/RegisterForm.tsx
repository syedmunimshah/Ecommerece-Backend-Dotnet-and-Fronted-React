"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Input";
import { bffApi } from "@/services/api";
import { ApiError } from "@/types/api";

const schema = z.object({
  FullName: z.string().min(2, "At least 2 characters"),
  Email: z.string().email("Enter a valid email"),
  Password: z.string().min(6, "At least 6 characters"),
});

type Values = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await bffApi.post("/auth/register", values);
      dispatch(
        pushToast({ tone: "success", message: "Account created — please sign in." }),
      );
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Registration failed";
      dispatch(pushToast({ tone: "error", message }));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Full name" error={errors.FullName?.message}>
        <Input autoComplete="name" {...register("FullName")} />
      </FormField>
      <FormField label="Email" error={errors.Email?.message}>
        <Input type="email" autoComplete="email" {...register("Email")} />
      </FormField>
      <FormField label="Password" error={errors.Password?.message}>
        <Input type="password" autoComplete="new-password" {...register("Password")} />
      </FormField>
      <Button type="submit" loading={submitting} className="w-full">
        Create account
      </Button>
    </form>
  );
}
