import { env } from "@/configs/environment";
import type { AuthSession } from "../types/auth.types";

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${env.AUTH_SERVICE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return (await response.json()) as AuthSession;
}

export async function logoutRemote(): Promise<void> {
  await fetch(`${env.AUTH_SERVICE_URL}/logout`, { method: "POST" });
}
