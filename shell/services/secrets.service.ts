import { hydrateEnvFromVault } from "@hrtbrxkxr/shared-utils";
import { createLogger } from "@hrtbrxkxr/shared-utils";

const logger = createLogger("secrets-bootstrap");

/**
 * Keys this consumer treats as sensitive enough to source from Vault in
 * staging/production rather than committing real values to .env. In local
 * dev (no VAULT_ADDR/VAULT_ROLE_ID/VAULT_SECRET_ID set) this is a no-op and
 * the values already in .env are used as-is.
 */
const VAULT_MANAGED_KEYS = [
  "THEME_SERVICE_URL",
  "AUTH_SERVICE_URL",
  "MAINTENANCE_SERVICE_URL",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
  "JWT_PUBLIC_KEY_URL",
] as const;

export async function loadSecretsFromVault(): Promise<void> {
  await hydrateEnvFromVault({
    keys: VAULT_MANAGED_KEYS,
    secretPath: process.env.VAULT_SECRET_PATH,
    logger,
  });
}
