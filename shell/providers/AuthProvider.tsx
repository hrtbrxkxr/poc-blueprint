"use client";

import { createTypedStorage } from "@platform/shared-utils";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../state/stores/auth.store";
import { AUTH_TOKEN_STORAGE_KEY } from "../constants";
import type { AuthSession } from "../types/auth.types";

const sessionStorage = createTypedStorage<AuthSession>(AUTH_TOKEN_STORAGE_KEY);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const existing = sessionStorage.get();
    if (existing && existing.expiresAt > Date.now()) {
      setSession(existing);
    }
  }, [setSession]);

  return <>{children}</>;
}
