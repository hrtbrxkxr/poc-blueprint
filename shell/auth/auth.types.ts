export interface AccessTokenPayload {
  sub: string;
  email: string;
  permissions: string[];
  exp: number;
}
