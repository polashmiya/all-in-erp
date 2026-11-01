# myErp — Configurable ERP

One ERP codebase whose screens and data shape are driven by configuration, per **Account › Business Unit**.

| App | Who uses it | Dev URL |
|---|---|---|
| **Panel** (`apps/panel-web`) | Internal team (Super Admin, Implementer): accounts, business units, fields, layouts | http://localhost:5173 |
| **ERP** (`apps/erp-web`) | Client users; UI rendered from the business unit's resolved configuration | http://localhost:5174 |
| **API** (`backend/src/Erp.Api`) | Both apps: `/api/panel/*` and `/api/erp/*` | http://localhost:5000 (docs: `/docs`) |

## Prerequisites

- .NET SDK 10 (`dotnet --list-sdks`)
- Node.js 22+ and pnpm 10 (`npm i -g pnpm@10`)
- SQL Server LocalDB with a database named **`myErp`** (`(localdb)\MSSQLLocalDB`). Docker is not required.

## Getting started

```powershell
pnpm install                  # frontend workspace
pnpm dev:api                  # API on :5000 (runs against LocalDB / myErp)
pnpm dev                      # Panel on :5173 and ERP on :5174
```

Check the API at http://localhost:5000/health (it reports database health) and http://localhost:5000/docs (Scalar).

The connection string is in [appsettings.Development.json](backend/src/Erp.Api/appsettings.Development.json).
Override it without editing files via `ConnectionStrings__Erp`.

### Database and demo sign-in

In Development the API **applies pending EF migrations and seeds demo data on startup**
(`Database:MigrateOnStartup` / `Database:SeedDemoData`). Seeding only fills in missing rows, so restarting is safe.

| App | Email | Password | What you get |
|---|---|---|---|
| Panel | `superadmin@myerp.local` | `Admin@12345` | Super Admin |
| ERP | `admin@demopharma.com` | `Demo@12345` | Primary admin of **Demo Pharma Ltd**, with access to Dhaka Depot and Chattogram Depot |

These are development-only values from `appsettings.Development.json`. The login pages show a "Fill in" helper
in dev builds only.

Migrations live in `backend/src/Erp.Infrastructure/Persistence/Migrations` (`dotnet-ef` is a local tool):

```powershell
dotnet tool restore
dotnet ef migrations add <Name> --project backend/src/Erp.Infrastructure --startup-project backend/src/Erp.Api --output-dir Persistence/Migrations
dotnet ef database update      --project backend/src/Erp.Infrastructure --startup-project backend/src/Erp.Api
```

### Panel: accounts and account setup

- **The Panel sidebar is read from the `PanelMenuItems` table** (`GET /api/panel/navigation`): any depth, EN/বাংলা
  labels, an icon name from the shared icon registry, path and sort order. Startup only *inserts* missing default
  items (currently just **Accounts**) and never overwrites edited rows. Menu entries without a built screen show a
  placeholder.
- **Accounts** (`/accounts`) has totals, a server-paged table (status tabs, search, sort) and a detail drawer with
  the business unit → office → warehouse tree.
- **New account setup** (`/accounts/new`) is one page with five steps: account info → business units → offices and
  branches per unit → warehouses per unit, either at unit level or under an office → ERP admin and review. Nothing is
  stored until **Create account**. `POST /api/panel/accounts/setup` then saves the whole tree, the system roles
  (Administrator, Viewer) and a **primary ERP admin** in one transaction. Leave the password empty and a secure one is
  generated, then shown once.
- Validation errors come back keyed by JSON path (e.g. `businessUnits[1].warehouses[0].officeCode`), and the form
  jumps to that step and field.
- Data model: `Account` (profile, base currency, time zone) → `BusinessUnit` → `Office` → `Warehouse`
  (`Warehouse.OfficeId` is optional). Offices and warehouses are business-unit-owned, so in the ERP they are filtered
  to the selected unit.

### Authentication model

- **Two surfaces, two audiences.** Panel tokens (`aud=panel`) only work on `/api/panel/*`, and ERP tokens
  (`aud=erp`) only on `/api/erp/*`. Each surface has its own bearer scheme, so a token for one gets **401** on the other.
- **ERP tokens are account-scoped.** The active business unit travels in the **`X-Business-Unit`** header and is
  validated on every request against `UserBusinessUnit` (the account's primary admin may use every active unit).
  Switching units therefore needs no new token.
- **Tenant isolation is a global EF query filter.** Entities implementing `IAccountOwned` / `IBusinessUnitOwned`
  are filtered to the current account and unit. With no tenant in context the filter matches nothing, so
  code that must cross tenants (login, seeding, Panel) uses `IgnoreQueryFilters()` explicitly.
- **Permissions** are `{module}.{feature}.{action}` codes contributed by modules through `IPermissionProvider`
  and synced to the `Permissions` table at startup. Endpoints declare `.RequirePermission("inventory.item.create")`:
  a missing business unit returns 400, and a missing permission returns 403. The UI hides what a role can't do,
  but the API is the actual protection.
- Login endpoints are rate-limited per IP (`RateLimiting:LoginPerMinute`, default 10). Unknown email, wrong
  password and disabled users all get the same 401.
- The JWT signing key in `appsettings.Development.json` is for development only. Set `Jwt__SigningKey`
  (≥ 32 characters) in every other environment.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Both frontends with HMR |
| `pnpm dev:api` | ASP.NET Core API (`http` launch profile, port 5000) |
| `pnpm gen:api` | Regenerates `packages/api-client` from `http://localhost:5000/openapi/v1.json` (**API must be running**) |
| `pnpm test` | Vitest (all packages) + `dotnet test` |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | Static checks |
| `pnpm build` | Production build of both apps |

API integration tests boot the real API (migrations and seed included) against a throwaway **`myErp_Test`**
LocalDB database. Tenant-filter tests use **`myErp_Test_Tenancy`**. Both are created and dropped by the tests,
so your `myErp` database is never touched. Set `ERP_TEST_CONNECTION` to use a different server.

## Repository layout

```
backend/
  Erp.sln, Directory.Build.props, Directory.Packages.props   (central package versions)
  src/Erp.Api               Minimal API host: Serilog, ProblemDetails, CORS, OpenAPI + Scalar, /health
  src/Erp.Core              Domain primitives, tenancy and permission abstractions
  src/Erp.Metadata          Manifests, field definitions, screen resolver, dynamic entity service
  src/Erp.Infrastructure    EF Core (ErpDbContext), migrations, persistence
  src/Modules/Inventory     Inventory module; features live in Features/<Feature>/ with a *.manifest.json
  tests/Erp.Tests           xUnit + WebApplicationFactory against LocalDB
apps/
  panel-web                 Panel (Vite + React 19 + AntD 5 + ProLayout)
  erp-web                   ERP client
packages/
  ui                        Theme tokens (light/dark/compact), i18n (EN/বাংলা), AppShell, shared components
  api-client                orval-generated TanStack Query hooks + fetch client (token, X-Business-Unit)
  metadata-schema           zod schemas/types for manifests and layouts (Phase 2)
  metadata-engine           Generic recursive screen renderer (Phase 4)
```

Project references: `Api → all`, `Modules → Core, Metadata`, `Infrastructure → Core, Metadata`, `Metadata → Core`.

## Theme system

Both apps share one theme engine in `packages/ui/src/theme`:

- **Presets** (`presets.ts`) are a primary + accent pair: **Teal & Amber** (default), Ocean, Indigo, Emerald, Violet,
  Rose, Sunset, Graphite and Royal. Every primary carries white text at WCAG AA contrast.
- **`buildBrand(preset, mode, sidebarStyle)`** derives every other colour: page background and sidebar tints,
  borders, table header and hover rows, menu hover and selected states, the hero gradient, and accent shades for
  icons. Unit tests check text contrast in **every preset × light/dark × sidebar style**.
- **Appearance panel** (header): the colour preset, Light / Dark / System mode, sidebar style (**Tinted** = light
  tint of the primary, Light, Dark, Brand) and compact density. Choices are saved per browser.
- Components read colours with `useBrand()` (or AntD tokens). To add a preset, append a `{ key, name, primary, accent }`
  entry. The contrast test fails if the primary is too light for white text.

## Conventions

- **Navigation is three levels:** Module › Sub-module › Feature (e.g. Inventory › Master Data › Item Profile),
  plus top-level entries (Dashboard, Reports Center, Settings, Help). Menu nodes are `MenuNode` objects in
  `packages/ui`. Only leaves have routes.
- **Feature key** = `{module}.{feature}` (e.g. `inventory.item`); route = `/app/{module}/{feature}`.
- **Permission code** = `{module}.{feature}.{action}` (e.g. `inventory.item.create`), enforced by the API.
- No industry-specific branches in code; behaviour differences come from configuration only.
- `packages/metadata-engine` must stay generic; it never references a concrete feature.
- Labels that come from metadata are `LocalizedText` (`{ en, bn }`); UI strings use i18next keys.

## Version pins and machine notes

- **antd 5** (not 6), because `@ant-design/pro-components` 2.x supports only antd 5. React 19 support comes from
  `@ant-design/v5-patch-for-react-19`, which `packages/ui` imports.
- **React Router 7**, **TypeScript 6.0** (typescript-eslint does not support TS 7 yet).
- pnpm is also a root devDependency, so nested `pnpm` calls inside scripts use `node_modules/.bin`. Windows
  user-profile paths containing `&` break npm's global `pnpm.cmd` shim.
- Stop the running API before `dotnet build` or `dotnet test`, because the running process locks `Erp.Api.dll`.

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 | Repo skeleton, API host, LocalDB health, shared UI shell (3-level menu, dark mode, EN/বাংলা) | ✅ Done |
| 1 | Core domain, migrations, JWT auth (panel/erp audiences), tenant context, login + BU picker | ✅ Done |
| 2 | Metadata schema, manifests, screen resolver, bootstrap endpoint | ⏳ |
| 3 | Dynamic data API (JSON attributes, query builder, CRUD, import/export) | ⏳ |
| 4 | Frontend metadata-engine (DynamicPage/Table/Filter/Form/View, rules) | ⏳ |
| 5 | ERP wiring: Item Profile end-to-end from configuration | ⏳ |
| 6 | Panel: accounts, business units, entitlements, field manager | ⏳ |
| 7 | Panel: visual layout builder + live preview, draft/publish | ⏳ |
| 8 | Hardening: E2E, caching, audit log, docs | ⏳ |
