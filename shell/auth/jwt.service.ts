import { jwtVerify, createRemoteJWKSet } from "jose";
import { env } from "@/configs/environment";

const jwks = createRemoteJWKSet(new URL(process.env.JWT_PUBLIC_KEY_URL ?? "http://localhost:8080/auth/.well-known/jwks.json"));

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });
  return payload;
}
