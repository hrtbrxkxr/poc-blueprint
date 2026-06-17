import { jwtVerify, createRemoteJWKSet, type JWTVerifyGetKey } from "jose";
import { getEnv } from "@/configs/environment";

let jwks: JWTVerifyGetKey | undefined;

function getJwks(): JWTVerifyGetKey {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(process.env.JWT_PUBLIC_KEY_URL ?? "http://localhost:8080/auth/.well-known/jwks.json"),
    );
  }
  return jwks;
}

export async function verifyAccessToken(token: string) {
  const env = getEnv();
  const { payload } = await jwtVerify(token, getJwks(), {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });
  return payload;
}
