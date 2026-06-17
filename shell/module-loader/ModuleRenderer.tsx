"use client";

import { Suspense, lazy } from "react";
import { Loader } from "@platform/shared-ui";
import { getModule } from "./registry";
import { loadModule } from "./loadModule";
import { useModuleResolution } from "./moduleResolver";
import { ModuleErrorBoundary } from "../boundaries/ModuleErrorBoundary";
import { AuthGuard } from "../auth/AuthGuard";
import { MaintenancePage } from "../maintenance/MaintenancePage";

export function ModuleRenderer({ moduleId }: { moduleId: string }) {
  const resolution = useModuleResolution(moduleId);
  const module = getModule(moduleId);

  if (resolution.status === "not-found" || resolution.status === "disabled") return null;
  if (resolution.status === "maintenance") return <MaintenancePage scope={moduleId} />;
  if (resolution.status === "forbidden") return <p>You do not have access to this module.</p>;
  if (!module) return null;

  const loader = loadModule(moduleId);
  if (!loader) return null;

  const LazyModule = lazy(loader);
  const content = (
    <Suspense fallback={<Loader />}>
      <ModuleErrorBoundary moduleId={moduleId}>
        <LazyModule bffUrl={module.bffUrl} />
      </ModuleErrorBoundary>
    </Suspense>
  );

  return module.requiresAuth ? <AuthGuard>{content}</AuthGuard> : content;
}
