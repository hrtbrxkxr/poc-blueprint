# Diagrams

## 1. Architecture

See [architecture.md](./architecture.md#repository-structure).

## 2. Module Loading Flow

```mermaid
sequenceDiagram
    participant Route as app/modules/[moduleId]/page.tsx
    participant Renderer as ModuleRenderer
    participant Resolver as moduleResolver
    participant Registry as registry.ts
    participant Loader as loadModule.ts

    Route->>Renderer: render(moduleId)
    Renderer->>Registry: getModule(moduleId)
    Renderer->>Resolver: useModuleResolution(moduleId)
    Resolver-->>Renderer: ready | maintenance | forbidden | not-found
    alt ready
        Renderer->>Loader: loadModule(moduleId)
        Loader-->>Renderer: lazy(() => import module frontend/index.ts)
        Renderer->>Renderer: wrap in AuthGuard + ModuleErrorBoundary
    end
```

## 3. Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Shell as Shell (AuthProvider/AuthGuard)
    participant AuthSvc as Auth Service
    participant BFF as Module BFF

    User->>Shell: visit protected route
    Shell->>Shell: hydrate session from storage
    alt no valid session
        Shell->>User: redirect to /login
        User->>AuthSvc: POST /login
        AuthSvc-->>Shell: AuthSession (JWT)
        Shell->>Shell: persist + setSession
    end
    Shell->>BFF: request with Authorization: Bearer <JWT>
    BFF->>BFF: verifyAccessToken via JWKS
    BFF-->>Shell: 200 / 401
```

## 4. Theme Loading Flow

See [theme-system.md](./theme-system.md#flow).

## 5. Maintenance Flow

```mermaid
flowchart TD
    Start[MaintenanceProvider mounts] --> Poll[fetchMaintenanceState every 60s]
    Poll --> Global{global = true?}
    Global -- yes --> ShowGlobal[Render MaintenancePage scope=platform]
    Global -- no --> Context[Provide MaintenanceState via context]
    Context --> ModuleCheck{module flagged?}
    ModuleCheck -- yes --> ShowModule[ModuleRenderer renders MaintenancePage scope=moduleId]
    ModuleCheck -- no --> Render[Render module normally]
```

## 6. CI/CD Flow

```mermaid
flowchart LR
    Commit --> PR[Pull Request]
    PR --> Lint --> UnitTest[Unit Test] --> IntegrationTest[Integration Test] --> TypeCheck[Type Check] --> Build --> Artifact --> Deploy
```

## 7. Deployment Flow

See [deployment.md](./deployment.md#environment-strategy).

## 8. BFF Flow

```mermaid
flowchart LR
    FE[Module Frontend] --> BFF[Module BFF]
    BFF --> Backend[Backend Service]
    BFF -.x.-> OtherBFF[Another Module's BFF]
    style OtherBFF stroke:#ef4444,stroke-dasharray: 5 5
```

## 9. Git Submodule Flow

```mermaid
flowchart TD
    Source["Submodule source repo\n(e.g. shared-ui)"] -- git push --> SourceRemote[Remote]
    SourceRemote -- git submodule update --remote --> Consumer["Consumer repo\n(pinned commit in .gitmodules)"]
    Consumer -- git add + commit --> ConsumerRemote[Consumer remote]
```
