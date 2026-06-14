"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/reduxStore";
import { setUser } from "@/features/auth/authSlice";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Input";
import { bffApi } from "@/services/api";
import { ApiError } from "@/types/api";
import type { AppUser } from "@/types/auth";

const schema = z.object({
  Email: z.string().email("Enter a valid email"),
  Password: z.string().min(6, "At least 6 characters"),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const { data } = await bffApi.post<{ user: AppUser }>("/auth/login", values);
      dispatch(setUser(data.user));
      qc.clear();
      dispatch(pushToast({ tone: "success", message: `Welcome back, ${data.user.email}` }));
      const dest = params.get("from") ?? (data.user.role === "Admin" ? "/admin" : "/");
      router.push(dest);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Login failed";
      dispatch(pushToast({ tone: "error", message }));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Email" error={errors.Email?.message}>
        <Input type="email" autoComplete="email" {...register("Email")} />
      </FormField>
      <FormField label="Password" error={errors.Password?.message}>
        <Input type="password" autoComplete="current-password" {...register("Password")} />
      </FormField>
      <Button type="submit" loading={submitting} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
