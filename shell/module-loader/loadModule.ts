import { lazy, type ComponentType, type LazyExoticComponent } from "react";

type ModuleComponent = ComponentType<{ bffUrl: string }>;
type ModuleLoader = () => Promise<{ default: ModuleComponent }>;

const loaders: Record<string, ModuleLoader> = {
  "module-a": () =>
    import("../../modules/module-a/frontend").then((mod) => ({
      default: mod.ModuleAPage as ModuleComponent,
    })),
};

// Built once at module scope, not per-render: react-hooks/static-components forbids
// any function call whose result is used as a JSX tag inside a component body,
// since the call's result is never provably stable to the linter — even a getter
// that just does a lookup. Consumers must index into this map directly instead.
export const lazyModules: Record<string, LazyExoticComponent<ModuleComponent>> = Object.fromEntries(
  Object.entries(loaders).map(([id, loader]) => [id, lazy(loader)]),
);
