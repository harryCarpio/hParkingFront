# CLAUDE.md — hParkingFront (admin web panel)

Admin/back-office SPA for the hParking platform (package name `paneladmhparking`). Only users with `ROLE_ADMIN` can log in
(checked in `AuthContext.login`). It talks to `hParkingServer` (see the workspace-root `CLAUDE.md` for the platform overview).

## Stack
React 19 · Vite 7 · Tailwind CSS v4 (CSS-first, **no `tailwind.config.js`**) · react-router-dom 7 (classic `<Routes>` API) · axios ·
Recharts · lucide-react · jwt-decode. **Plain JavaScript/JSX — no TypeScript, no test runner.** Node 20.19.

## Commands
```bash
npm install
npm run dev        # Vite dev server (see "Gotchas" for the API base URL)
npm run lint       # eslint . — the ONLY automated correctness check; run it before calling anything done
npm run build      # vite build → dist/ (never hand-edit dist/)
npm run preview
```

## Layout (`src/`)
```
App.jsx                  all routes (single place); authed routes nested under <ProtectedRoute><MainLayout/></ProtectedRoute>
router/ProtectedRoute.jsx
context/                 AuthContext (login/refresh, roles from JWT), ThemeContext/ThemeProvider
hooks/                   useAuth, useTema, useDiccionarioDatos (enum labels from backend params)
services/                one <dominio>Service.js per backend domain (plain functions over `api`), menuItems.jsx, breadcrumbs.js, diccionarioDatos.js
utils/axiosInstance.js   the ONE axios instance (`api`) + in-memory access token + 401 refresh interceptor
styles/temas.js          design-token class strings (sidebar, navbar, paginador, tabla, texto, inputColumnas)
components/ui/           dumb, reusable primitives (Button, Table, Pagination, Spinner, ModalWrapper, ModalConfirmacion, Input, ...)
components/<dominio>/    domain forms/modals/cards (estacionamientos, usos, facturas, usuariosAPP, dashboard, layout, login, ...)
pages/<dominio>/         Listado<Entidad>.jsx list/CRUD pages, Usos.jsx, Facturas.jsx, PanelAdministracion.jsx, Login.jsx
```
Reference implementation for a CRUD page: `pages/estacionamientos/ListadoEstacionamientos.jsx` (+ `services/parkingService.js`,
`components/estacionamientos/ModalFormCrearEditarEstacionamientos.jsx`).

## Conventions (details live in `.claude/skills/*`; they load automatically by topic)
- **Spanish** for identifiers, comments and UI text (`cargando`, `handleEliminar`, `crearX/editarX/eliminarX/consultarXById`).
- Always call the backend through `api` from `utils/axiosInstance.js` — never `axios` directly, never set `Authorization` manually.
  Service functions return the axios promise; pages `await` and destructure `{ data }`.
- Access token lives **in memory only**; only `refreshToken` (+ `usuario`) go to `sessionStorage`. Don't move the access token to storage.
- New page = component under `pages/<dominio>/` + `<Route>` in `App.jsx` (inside the protected block) + entry in `services/menuItems.jsx` if it should be in the sidebar.
- Style with `styles/temas.js` entries and Tailwind v4 utilities; brand blue is `rgb(32, 114, 185)` (`.bg-celestevr` etc. in `index.css`). Icons: lucide-react via the `size` prop.
- Backend errors arrive as `error.response?.data?.errors[].issue` — show them with the established `errores.map(e => e.issue).join(', ')` pattern.
- Enum/select labels: use `useDiccionarioDatos` / `Diccionario*` components (backed by `/v1/hparking/param/values/ordered`) instead of hard-coding options.
- Don't add dependencies (another chart lib, state lib, TS, Prettier, router data APIs, `React.lazy`) without asking.

## Gotchas
- **API base URL — `npm run dev` currently hits PRODUCTION.** `src/utils/axiosInstance.js` has the runtime-config block active
  (`window.__APP_CONFIG__?.API_URL || import.meta.env.VITE_HPARKING_API_URL`); `window.__APP_CONFIG__` comes from `public/config.js`, which is **tracked in git** and set to
  `https://hparking-api.vrsoluciones.net/api`, and `index.html` loads it before the bundle. Since that base is absolute, no relative `/api/*` request is ever made and
  **the Vite proxy is bypassed** — a dev server writes to production data. Point `API_URL` at a local/LAN backend (or uncomment the `baseURL: '/api'` proxy block) before testing mutations,
  and **don't commit that switch**: check `git diff src/utils/axiosInstance.js public/config.js` first. Note the deployed `config.js` on Nginx is server-owned — don't overwrite it when uploading `dist/`.
- The configured base ends with `/api`, so services call `/v1/...` and `/auth/login` — never repeat the `/api` prefix.
- The proxy in `vite.config.js` (only used in `baseURL: '/api'` mode) targets a LAN backend, `http://192.168.100.250:8080`, and has a `configure` hook that turns backend-connection failures into a `502` with the app's `{ errors: [{ issue }] }` shape.
- In production (Nginx) `config.js` on the server holds the real env values — do **not** overwrite it when deploying `dist/`.
- Folder naming is not fully consistent (`pages/estacionamiento/` for Usos/Facturas vs `pages/estacionamientos/` for the CRUD). Match the neighbours; don't rename in unrelated changes.
- `dist/` and `node_modules/` are build/install output — never edit or grep them for context.

## Project agents & skills
Agents (`.claude/agents/`): `react-panel-developer` (builds pages/modals/services, preloads the skills), `frontend-reviewer` (lint + convention review).
Skills (`.claude/skills/`): axios, eslint, misc libraries (lucide/jwt-decode/Recharts), react, react-router, tailwind v4, vite best practices.
For backend contract changes run the root-level `api-contract-auditor`.
