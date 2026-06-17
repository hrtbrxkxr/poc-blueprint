export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { loadSecretsFromVault } = await import("./shell/services/secrets.service");
    await loadSecretsFromVault();
  }
}
