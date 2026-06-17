import { useAuthStore } from "../stores/auth.store";

const NO_PERMISSIONS: string[] = [];

export const useIsAuthenticated = () => useAuthStore((state) => state.session !== null);
export const usePermissions = () => useAuthStore((state) => state.session?.user.permissions ?? NO_PERMISSIONS);
