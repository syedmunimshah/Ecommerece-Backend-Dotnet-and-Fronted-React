"use client";

import { useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeStore, type AppStore } from "@/lib/reduxStore";
import { makeQueryClient } from "@/lib/queryClient";
import { setUser } from "@/features/auth/authSlice";
import type { AppUser } from "@/types/auth";

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AppUser | null;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    if (initialUser) storeRef.current.dispatch(setUser(initialUser));
  }
  const queryRef = useRef<ReturnType<typeof makeQueryClient> | null>(null);
  if (!queryRef.current) queryRef.current = makeQueryClient();

  return (
    <ReduxProvider store={storeRef.current}>
      <QueryClientProvider client={queryRef.current}>
        {children}
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
