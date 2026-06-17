export interface AuthUser {
  id: string;
  email: string;
  permissions: string[];
}

export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
}
