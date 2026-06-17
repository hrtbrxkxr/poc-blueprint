import { useAuthStore } from "../state/stores/auth.store";
import { useIsAuthenticated, usePermissions } from "../state/selectors/auth.selectors";

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useIsAuthenticated();
  const permissions = usePermissions();
  return { session, isAuthenticated, permissions };
}
