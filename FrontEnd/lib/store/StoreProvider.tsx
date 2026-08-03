"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { hydrateAuth } from "@/features/auth/authSlice";
import { useGetProfileQuery } from "@/lib/store/api/api";
import { setUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const { data: profile } = useGetProfileQuery(undefined, { skip: !token });

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (profile) dispatch(setUser(profile));
  }, [profile, dispatch]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
