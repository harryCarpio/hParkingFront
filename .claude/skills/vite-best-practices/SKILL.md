---
name: vite-best-practices
description: Best practices for Vite build/dev config in this project (hParkingFront). Use when editing vite.config.js, adding env vars, dealing with the dev proxy, or diagnosing build/dev-server issues.
---

# Vite 7 best practices for hParkingFront

Config lives in [vite.config.js](../../../vite.config.js): the `@vitejs/plugin-react` and `@tailwindcss/vite` plugins, plus a dev-only API proxy.

## Dev API proxy

- In development, `/api/*` requests are proxied to `https://hparking-api.vrsoluciones.net` (see the `server.proxy` block). The frontend's [axiosInstance.js](../../../src/utils/axiosInstance.js) is hardcoded to `baseURL: '/api'` for this reason — it relies on the Vite proxy locally.
- There is a commented-out production `baseURL` in `axiosInstance.js` that reads `window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_HPARKING_API_URL`. When wiring up a real production build, follow that existing pattern (runtime-injected config object first, falling back to a Vite env var) rather than inventing a new mechanism — this project intentionally supports overriding the API URL at runtime (e.g. via a config file served alongside `dist/`), not just at build time.
- Env vars consumed in client code must be prefixed `VITE_` (Vite only exposes `import.meta.env.VITE_*` to the client) and go in an untracked `.env`/`.env.local` file — never commit real API URLs/secrets to a tracked `.env`.

## Plugin/config changes

- Keep `plugins: [react(), tailwindcss()]` order as-is; both are required (React JSX transform + Tailwind v4's Vite integration) and there's no CSS post-processing step beyond Tailwind, so don't add a separate PostCSS config unless a real need arises.
- If adding a new proxy path (e.g. for a second backend service or websockets), follow the existing object shape (`target`, `changeOrigin: true`, `secure: true`, explicit `Origin` header) rather than a shorthand string proxy — the current backend requires an explicit `Origin` header to accept the proxied request.

## Scripts

- `npm run dev` — dev server with the proxy above.
- `npm run build` — production build (`vite build`); output goes to `dist/` (already excluded from ESLint via `globalIgnores(['dist'])`).
- `npm run preview` — serves the production build locally. Note the proxy config only applies to `vite dev`, not `vite preview`/production — a real deployment needs its own reverse-proxy or the runtime `__APP_CONFIG__` mechanism described above to reach the API.

## Things to avoid

- Don't switch the API base URL to an absolute hardcoded production URL in `axiosInstance.js` — that breaks the dev proxy and bypasses the intended runtime-config override.
- Don't add a bundler-level env-based branching (`if (import.meta.env.PROD)`) for things the runtime config object is meant to solve — prefer extending `window.__APP_CONFIG__` usage for anything that needs to change post-build (i.e., without a rebuild).
