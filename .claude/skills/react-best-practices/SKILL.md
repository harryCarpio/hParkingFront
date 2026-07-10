---
name: react-best-practices
description: Best practices for writing React 19 components/hooks in this project (hParkingFront). Use whenever creating or editing files under src/components/, src/pages/, src/hooks/, or src/context/ — i.e. any .jsx component, custom hook, or context provider.
---

# React 19 best practices for hParkingFront

This project uses **React 19** with function components and hooks only (no class components). Follow the conventions already established in `src/` rather than generic React boilerplate.

## Component structure

- One component per file, default-exported, named in PascalCase matching the filename (e.g. `Button.jsx` exports `Button`).
- List/CRUD pages live in `src/pages/<dominio>/Listado<Entidad>.jsx` and follow this shape (see [ListadoEstacionamientos.jsx](../../../src/pages/estacionamientos/ListadoEstacionamientos.jsx) as the reference implementation):
  1. Local `useState` for data, pagination (`paginaActual`, `totalPaginas`, `totalElementos`, `porPagina`), loading (`cargando`), and modal/selection state.
  2. An async `cargar(pagina, size)` function that calls the matching `services/*.js` function, sets state in a `try/finally`, and is invoked from a `useEffect`.
  3. Handler functions (`handleNuevo`, `handleEditar`, `handleEliminar`, `handleSubmit`, `handleConfirmarEliminar`) that open modals and re-call `cargar` after a successful mutation.
  4. A `columnas` array describing table columns (passed to the shared `Table` component), with a `render` function for custom cells (actions, formatted values, status labels).
  5. JSX composed from the shared `src/components/ui/*` primitives (`Button`, `Table`, `Pagination`, `Spinner`, `ModalWrapper`, `ModalConfirmacion`), never raw ad-hoc markup for things that already have a shared component.
- Reusable/dumb UI primitives live in `src/components/ui/`. Keep them prop-driven and free of data-fetching — they receive data and callbacks, they don't call services themselves.
- Domain-specific composite components (forms, modals) live in `src/components/<dominio>/`.

## Naming and language

- Variable/function names, comments, and user-facing strings are in **Spanish** throughout this codebase (`cargando`, `datos`, `guardandoEntidad`, `handleEliminar`). Match this — don't switch to English identifiers in new code.
- Keep JSDoc-less, single-line `//` comments only where the existing code does (explaining *why*, e.g. the accordion/state comment in `Sidebar.jsx`), not restating what the code does.

## State and effects

- Prefer several focused `useState` calls over one large state object, matching existing pages — don't introduce `useReducer` or a state library unless a page's state genuinely outgrows this pattern.
- Data fetching is always inside a named async function called from `useEffect`, never an inline async arrow directly passed to `useEffect` (effect callbacks can't be async themselves).
- Always guard fetches with `cargando` state and reset it in a `finally` block so the UI doesn't get stuck on error.
- Effect dependency arrays must be exhaustive — the ESLint config here does **not** currently enable `react-hooks/exhaustive-deps` explicitly beyond the plugin's recommended flat config, but keep effects honest anyway (e.g. `useEffect(() => cargar(0, porPagina), [porPagina])`).

## Context and hooks

- Auth state is exposed via `AuthContext` ([AuthContext.jsx](../../../src/context/AuthContext.jsx)) and consumed through the `useAuth()` hook ([useAuth.js](../../../src/hooks/useAuth.js)) — never `useContext(AuthContext)` directly in components; go through the hook.
- Custom hooks live in `src/hooks/` and are named `use*`. Follow `useDiccionarioDatos.js` as the pattern for a hook that wraps a service call plus loading/fallback state.
- Don't create a new context for state that only one page needs — lift state locally instead.

## Forms

- Form components (`ModalFormCrearEditar*.jsx`) are controlled components; validation/formatting helpers live in `src/utils/formUtils.js` — reuse them instead of duplicating parsing/formatting logic.
- Surface backend validation errors via `error.response?.data?.errors`, joined into a single message string (see `handleSubmit` in `ListadoEstacionamientos.jsx`), and pass it down as a `mensajeError` prop to the modal rather than using `alert()`.

## Things to watch for in this codebase specifically

- `StrictMode` is currently commented out in [main.jsx](../../../src/main.jsx). Don't rely on effects running twice in dev to catch bugs — write cleanup-safe effects regardless, and mention to the user if re-enabling `StrictMode` would be valuable rather than silently changing it.
- Don't add a global state manager (Redux/Zustand/Jotai) — this project intentionally uses Context + local state only. If a page's state truly needs sharing, propose it explicitly before introducing a dependency.
- No TypeScript — this is plain JSX. Don't introduce `.tsx` files or type-only syntax.
