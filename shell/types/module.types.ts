export interface ModuleDescriptor {
  id: string;
  displayName: string;
  route: string;
  bffUrl: string;
  requiresAuth: boolean;
  permissions: string[];
  status: "enabled" | "disabled" | "maintenance";
  icon?: string;
}
