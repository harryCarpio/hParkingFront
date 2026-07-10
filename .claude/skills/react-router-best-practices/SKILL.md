---
name: react-router-best-practices
description: Best practices for routing with React Router DOM v7 in this project (hParkingFront). Use when adding/editing routes in src/App.jsx, working on src/router/ProtectedRoute.jsx, navigation via useNavigate/useLocation, or the sidebar menu config in src/services/menuItems.jsx.
---

# React Router DOM v7 best practices for hParkingFront

This project uses the **classic `<BrowserRouter>` / `<Routes>` / `<Route>` element-based API** (not the v6.4+ data router / `createBrowserRouter` API, and not file-based routing). Stay consistent with that choice — see [App.jsx](../../../src/App.jsx).

## Route structure

- All routes are declared in one place: `src/App.jsx`. Don't scatter `<Route>` definitions across other files.
- Public routes (currently just `/`, the login page) are declared directly under `<Routes>`.
- Authenticated routes are nested under a single parent `<Route>` whose `element` is `<ProtectedRoute><MainLayout /></ProtectedRoute>`, so any new authenticated page is added as a child `<Route path="..." element={<Page />} />` inside that block — never wrap an individual page's element in `ProtectedRoute` itself.
- Always end the route list with a catch-all `<Route path="*" element={<Navigate to="/" replace />} />` — keep it last.
- Route paths use lowercase, hyphenless-where-existing-convention-allows segments matching the Spanish domain names already in use (e.g. `/estacionamientos/listado`, `/estacionamientos/:id/sistemas`, `/usuarios-sistema/listado`). Match the existing pattern for a domain rather than inventing a new casing/style.

## Adding a new page

1. Create the page component under `src/pages/<dominio>/`.
2. Add a `<Route path="..." element={<TuPagina />} />` inside the protected block in `App.jsx`.
3. If the page should appear in the sidebar, add an entry to `src/services/menuItems.jsx` — either a new top-level item (`id`, `label`, `icon`, `children: []`, `path`) or a child under an existing `children` array (`{ label, path }`). Menu items with `children` should not also carry a top-level `path` (see the accordion logic in `Sidebar.jsx`, which navigates to `children[0].path` when a parent with children is clicked).
4. If the route needs a dynamic segment, follow the existing `:id` param convention (e.g. `/estacionamientos/:id/sistemas`) and read it with `useParams()`.

## Protected routes / auth

- Route-level auth gating goes through the single `ProtectedRoute` component ([ProtectedRoute.jsx](../../../src/router/ProtectedRoute.jsx)), which reads `usuario`/`cargando` from `useAuth()` and either shows a `Spinner`, redirects to `/`, or renders `children`. Don't duplicate this auth-check logic inside individual pages.
- Role-based checks (e.g. requiring `ROLE_ADMIN`) currently happen at login time in `AuthContext.login`, not per-route. If a future route needs a different role, extend `ProtectedRoute` to accept a `roles` prop rather than hand-rolling a check in the page.

## Navigation

- Use `useNavigate()` for programmatic navigation (button clicks, post-submit redirects) and `useLocation()` for reading the current path (e.g. to highlight the active sidebar item by comparing `location.pathname`).
- Use `<Navigate to="..." replace />` for redirects rendered during render (auth guards, catch-all), not `useNavigate` inside a `useEffect`, to avoid an extra render/history entry.
- Don't introduce `<Link>` where the existing codebase uses `<button onClick={() => navigate(...)}>` for sidebar/menu items — that's the established pattern here (menu items are buttons for the accordion behavior, not links).

## Things to avoid

- Don't migrate to `createBrowserRouter`/data APIs (loaders, actions, `useLoaderData`) without discussing it first — the whole app's data-fetching pattern (services + `useEffect`) assumes the classic API.
- Don't add route-level code splitting (`React.lazy`) unless asked; the app currently imports every page eagerly in `App.jsx`.
