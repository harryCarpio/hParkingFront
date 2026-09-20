---
name: vite-best-practices
description: Best practices for Vite build/dev config in this project (hParkingFront). Use when editing vite.config.js, adding env vars, dealing with the dev proxy, or diagnosing build/dev-server issues.
---

# Vite 7 best practices for hParkingFront

Config lives in [vite.config.js](../../../vite.config.js): the `@vitejs/plugin-react` and `@tailwindcss/vite` plugins, plus a dev-only API proxy.

## How the API URL is resolved (the proxy is currently NOT in the path)

Two mechanisms exist; only one is active at a time, decided in [axiosInstance.js](../../../src/utils/axiosInstance.js), not here.

1. **Runtime config — active today.** `axiosInstance.js` uses `baseURL: window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_HPARKING_API_URL`. `window.__APP_CONFIG__` is set by [public/config.js](../../../public/config.js) (a tracked file, loaded via `<script src="/config.js">` in `index.html` before the bundle), currently `https://hparking-api.vrsoluciones.net/api`. Because that base is **absolute**, the browser never requests a relative `/api/*` path, so **the `server.proxy` block below does nothing in this mode** — `npm run dev` hits the production API directly. This runtime-config indirection is deliberate: it lets ops repoint a built `dist/` without a rebuild.
2. **Dev proxy — only if you re-enable it.** The commented-out block in `axiosInstance.js` (`baseURL: '/api'`) makes calls relative, at which point `server.proxy['/api']` in [vite.config.js](../../../vite.config.js) forwards them to **`http://192.168.100.250:8080`** (a LAN backend), with `changeOrigin: true` and an explicit `Origin` header the backend requires. Note `secure: true` is a no-op against an `http://` target; it only matters for HTTPS targets.

The proxy also has a `configure` hook that catches connection errors (backend down, bad TLS) and answers `502` with the app's own error shape (`{ errors: [{ issue }] }`) so a dead backend doesn't take down the dev server — keep that behavior if you touch the proxy.

- Whichever mode you use, the resolved base **ends in `/api`**, so service paths start at `/v1/...` or `/auth/...`.
- Switching modes, or pointing `public/config.js` at a local backend, is a **local-only** change — don't commit it (`git diff src/utils/axiosInstance.js public/config.js` before committing).
- Env vars consumed in client code must be prefixed `VITE_` (Vite only exposes `import.meta.env.VITE_*` to the client) and go in an untracked `.env`/`.env.local` file — never commit real API URLs/secrets to a tracked `.env`. `VITE_HPARKING_API_URL` is only the fallback for when `window.__APP_CONFIG__` is absent; since `config.js` is tracked and always loaded, it rarely takes effect.

## Plugin/config changes

- Keep `plugins: [react(), tailwindcss()]` order as-is; both are required (React JSX transform + Tailwind v4's Vite integration) and there's no CSS post-processing step beyond Tailwind, so don't add a separate PostCSS config unless a real need arises.
- If adding a new proxy path (e.g. for a second backend service or websockets), follow the existing object shape (`target`, `changeOrigin: true`, `secure: true`, explicit `Origin` header) rather than a shorthand string proxy — the current backend requires an explicit `Origin` header to accept the proxied request.

## Scripts

- `npm run dev` — dev server. The proxy above is configured but inactive while `axiosInstance.js` uses the absolute runtime-config base URL, so this currently talks to the production API.
- `npm run build` — production build (`vite build`); output goes to `dist/` (already excluded from ESLint via `globalIgnores(['dist'])`).
- `npm run preview` — serves the production build locally. Note the proxy config only applies to `vite dev`, not `vite preview`/production — a real deployment needs its own reverse-proxy or the runtime `__APP_CONFIG__` mechanism described above to reach the API.

## Things to avoid

- Don't write a literal hardcoded host into `axiosInstance.js` or into a service. An absolute base URL is fine — that is what the active runtime-config mode produces — but it must come from `window.__APP_CONFIG__.API_URL` / `VITE_HPARKING_API_URL` so a built `dist/` stays repointable without a rebuild.
- Don't "fix" a failing local request by editing the proxy target in `vite.config.js` if the app is in runtime-config mode — the proxy isn't in the request path there, so the change will have no effect. Check which `axios.create` block is active first.
- Don't add a bundler-level env-based branching (`if (import.meta.env.PROD)`) for things the runtime config object is meant to solve — prefer extending `window.__APP_CONFIG__` usage for anything that needs to change post-build (i.e., without a rebuild).
