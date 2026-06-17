import type { ReactNode } from "react";
import { usePermissions } from "../state/selectors/auth.selectors";

export function PermissionGuard({
  required,
  children,
  fallback = null,
}: {
  required: string[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const permissions = usePermissions();
  const allowed = required.every((perm) => permissions.includes(perm));
  return <>{allowed ? children : fallback}</>;
}
