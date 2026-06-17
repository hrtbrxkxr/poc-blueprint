import { useAuthStore } from "../stores/auth.store";
import type { AuthSession } from "../../types/auth.types";

export function loginSuccess(session: AuthSession) {
  useAuthStore.getState().setSession(session);
}

export function logout() {
  useAuthStore.getState().clearSession();
}
