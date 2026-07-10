---
name: eslint-conventions
description: ESLint conventions and lint-clean coding practices for this project (hParkingFront). Use when writing or editing any .js/.jsx file, before considering a change finished, or when diagnosing lint errors.
---

# ESLint conventions for hParkingFront

Config is a flat config at [eslint.config.js](../../../eslint.config.js): `js.configs.recommended` + `eslint-plugin-react-hooks` (flat recommended) + `eslint-plugin-react-refresh` (vite preset), applied to `**/*.{js,jsx}`, with `dist` ignored.

## Run it

```
npm run lint
```

Run this after any non-trivial change before calling the task done — there's no separate type-checker (this is plain JS/JSX) or test suite in this project, so lint is the main automated correctness signal.

## Rules actually in effect

- **`no-unused-vars`** is set to `error`, with an exception: identifiers matching `^[A-Z_]` (PascalCase or ALL_CAPS) are allowed to be unused. This mainly exists so unused component imports used only as JSX types, or unused constant exports, don't fail — but don't rely on this to leave genuinely dead lowercase variables around; remove them instead.
- **react-hooks recommended rules** (`rules-of-hooks`, `exhaustive-deps` as configured by the plugin's flat recommended preset) — hooks must be called unconditionally at the top level, and effect dependency arrays should be complete. Where a dependency is intentionally omitted, that's a signal to double check the effect, not to silence the warning.
- **react-refresh/vite preset** — flags files that mix component exports with non-component exports in a way that breaks Fast Refresh. Keep component files exporting only the component (plus maybe a small tightly-coupled subcomponent), and put constants/helpers/services in their own files (as the project already does via `src/services/`, `src/utils/`, `src/styles/`).
- Parser targets `ecmaVersion: 'latest'` with JSX enabled and `sourceType: 'module'` — modern JS syntax is fine (optional chaining, nullish coalescing, etc., already used throughout, e.g. `error.response?.data?.errors`).
- `globals: globals.browser` — browser globals (`window`, `document`, `sessionStorage`) are recognized; there's no Node/test global set configured, so avoid assuming Node globals (`process`, `require`) in `src/`.

## Practical guidance

- Prefix intentionally-unused function parameters/destructured values with a capital letter or leave them out entirely (e.g. destructure only what's used) rather than adding `eslint-disable` comments.
- Don't add `// eslint-disable` comments to work around a real issue (missing dependency, genuinely unused var) — fix the underlying code. If a rule is truly wrong for a specific case, that's a conversation to have with the user about changing `eslint.config.js`, not a per-line disable.
- New files must be `.js`/`.jsx` (this config doesn't lint `.ts`/`.tsx`, consistent with the project having no TypeScript).
- Don't hand-edit `dist/` — it's build output and excluded from linting entirely.

## Things to avoid

- Don't add new ESLint plugins/rules (e.g. `eslint-plugin-import`, Prettier integration, `@typescript-eslint`) without discussing it — the current setup is intentionally minimal (just JS recommended + the two React plugins Vite's template ships with).
- Don't loosen `no-unused-vars` further or disable it project-wide to make a change "pass" — that exception pattern (`^[A-Z_]`) already covers the legitimate case.
