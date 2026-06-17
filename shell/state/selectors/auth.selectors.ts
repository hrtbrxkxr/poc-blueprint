import { useAuthStore } from "../stores/auth.store";

export const useIsAuthenticated = () => useAuthStore((state) => state.session !== null);
export const usePermissions = () => useAuthStore((state) => state.session?.user.permissions ?? []);
