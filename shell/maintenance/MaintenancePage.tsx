export function MaintenancePage({ scope = "platform" }: { scope?: string }) {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <h1>{scope === "platform" ? "Platform under maintenance" : `${scope} is under maintenance`}</h1>
      <p>Please check back shortly.</p>
    </div>
  );
}
