import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <h1>404 — Page not found</h1>
      <Link href="/">Return home</Link>
    </div>
  );
}
