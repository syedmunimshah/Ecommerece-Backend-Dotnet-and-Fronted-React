"use client";

import { useEffect, useState } from "react";
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
  // One store per mount — a lazy useState initialiser runs exactly once, which is what
  // the App Router needs (a request must never reuse another request's store). A ref
  // does the same job but has to be read during render, which React now warns about.
  const [store] = useState<AppStore>(makeStore);

  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
