import Link from "next/link";
import { brandingConfig } from "@/configs/branding";
import { listModules } from "@/shell/module-loader/registry";

export default function HomePage() {
  const modules = listModules();

  return (
    <div>
      <h1>Welcome to {brandingConfig.displayName}</h1>
      <p>Enabled modules:</p>
      <ul>
        {modules.map((module) => (
          <li key={module.id}>
            <Link href={module.route}>{module.displayName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
