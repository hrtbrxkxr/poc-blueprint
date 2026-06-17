import { loadSecretsFromVault } from "./shell/services/secrets.service";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await loadSecretsFromVault();
  }
}
