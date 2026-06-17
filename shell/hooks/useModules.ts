import { listModules } from "../module-loader/registry";

export function useModules() {
  return listModules();
}
