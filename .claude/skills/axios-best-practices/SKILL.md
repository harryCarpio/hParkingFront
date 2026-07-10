---
name: axios-best-practices
description: Best practices for HTTP calls with axios in this project (hParkingFront). Use whenever adding/editing files in src/services/, touching src/utils/axiosInstance.js, or writing any code that calls the backend API.
---

# Axios best practices for hParkingFront

All backend HTTP calls go through the single shared instance in [src/utils/axiosInstance.js](../../../src/utils/axiosInstance.js), exported as `api`. **Never call `axios` directly from a component, page, or service** — always import and use `api`.

## Service-layer pattern

- API calls are grouped by domain into `src/services/<dominio>Service.js` (e.g. `parkingService.js`, `authService.js`, `systemUsersService.js`), each exporting plain named functions that wrap `api.get/post/put/delete` calls and return the axios promise directly (don't `await`/unwrap inside the service — let the calling page `await` it and destructure `{ data }`).
- Follow the CRUD naming already established: `getX` / `consultarXById` / `crearX` / `editarX` / `eliminarX` (see [parkingService.js](../../../src/services/parkingService.js)). Match this Spanish naming for new services rather than `fetchX`/`createX`/`updateX`/`deleteX`.
- Paginated list endpoints take `(page = 0, size = 20, filtros = {})`, build a `params` object, and strip empty/null/undefined keys before the request:
  ```js
  Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
      }
  });
  ```
  Reuse this pattern (or extract it to `formUtils.js` if it starts repeating a lot) rather than sending empty filter params to the backend.
- Services should not know about React (no hooks, no component state) — they're plain functions callable from anywhere, including `AuthContext`.

## Auth token handling

- The access token lives **in memory only** (`tokenMemoria` closure in `axiosInstance.js`), not in `localStorage`/`sessionStorage` — only the `refreshToken` is persisted, in `sessionStorage`. Don't change this to store the access token in storage; it's a deliberate XSS-hardening choice.
- Use `setAccessToken`/`getAccessToken`/`clearAccessToken` (exported from `axiosInstance.js`) to manage the token — never read/write the closure variable directly, and never manually set the `Authorization` header on a one-off request (the request interceptor already attaches it).
- A response interceptor auto-refreshes on `401`: it skips retry for `/auth/*` routes, marks the failed request with `_retry` to prevent infinite refresh loops, calls `/auth/refresh` with the stored `refreshToken`, updates both tokens, and replays the original request. If a new auth-adjacent endpoint is added, make sure its URL contains `/auth/` if it should be exempted from this refresh-retry flow (matched via `config.url?.includes('/auth/')`).
- On refresh failure, it clears everything and hard-redirects to `/` (`window.location.href = "/"`) rather than using `navigate()` — this is intentional since the interceptor runs outside React/Router context.

## Error handling in callers

- Backend validation errors arrive as `error.response?.data?.errors`, an array of objects with an `issue` field. The established pattern is:
  ```js
  const errores = error.response?.data?.errors
  if (errores?.length) {
      setErrorMensaje(errores.map(e => e.issue).join(', '))
  }
  console.error(error.response?.data)
  ```
  Reuse this shape for any new form submit/delete handler rather than inventing a new error format or using `alert()`.
- Auth-specific errors are translated to friendlier messages at the `AuthContext.login` level (e.g. mapping `401` to `"Usuario no registrado, o credenciales inválidas"`) — do similar domain-specific translation in the service/context layer, not deep inside UI components.

## Things to avoid

- Don't create a second axios instance or bypass the interceptors for "simple" requests — every backend call should get the auth header and refresh handling for free.
- Don't put `baseURL` overrides per-call; the `/api` prefix + Vite dev proxy (see the Vite skill) is the single source of truth for where requests go.
- Don't swallow errors silently — every catch block should at least `console.error` and surface something actionable to the user via existing error-message state, matching the rest of the codebase.
