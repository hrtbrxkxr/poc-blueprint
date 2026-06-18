"use client";

import { Suspense } from "react";
import { Spinner } from "@hrtbrxkxr/shared-ui";
import { getModule } from "./registry";
import { lazyModules } from "./loadModule";
import { useModuleResolution } from "./moduleResolver";
import { ModuleErrorBoundary } from "../boundaries/ModuleErrorBoundary";
import { AuthGuard } from "../auth/AuthGuard";
import { MaintenancePage } from "../maintenance/MaintenancePage";

export function ModuleRenderer({ moduleId }: { moduleId: string }) {
  const resolution = useModuleResolution(moduleId);
  const moduleConfig = getModule(moduleId);
  const LazyModule = lazyModules[moduleId];

  if (resolution.status === "not-found" || resolution.status === "disabled") return null;
  if (resolution.status === "maintenance") return <MaintenancePage scope={moduleId} />;
  if (resolution.status === "forbidden") return <p>You do not have access to this module.</p>;
  if (!moduleConfig || !LazyModule) return null;

  const content = (
    <Suspense fallback={<Spinner />}>
      <ModuleErrorBoundary moduleId={moduleId}>
        <LazyModule bffUrl={moduleConfig.bffUrl} />
      </ModuleErrorBoundary>
    </Suspense>
  );

  return moduleConfig.requiresAuth ? <AuthGuard>{content}</AuthGuard> : content;
}
