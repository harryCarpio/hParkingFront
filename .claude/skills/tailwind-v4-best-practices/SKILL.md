---
name: tailwind-v4-best-practices
description: Best practices for styling with Tailwind CSS v4 in this project (hParkingFront). Use whenever writing or editing className strings, src/index.css, or src/styles/temas.js, or making any visual/UI/color change.
---

# Tailwind CSS v4 best practices for hParkingFront

This project uses **Tailwind CSS v4** via the CSS-first `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**. Do not create one; v4 configuration lives in CSS (`@import`, `@theme`, custom classes) inside [src/index.css](../../../src/index.css). See [vite.config.js](../../../vite.config.js) for the plugin wiring.

## The `temas.js` design-token layer

Before writing raw Tailwind classes for anything sidebar/navbar/table/pagination/text/grid-related, check [src/styles/temas.js](../../../src/styles/temas.js) first — it centralizes the reusable class strings for:

- `temas.sidebar.*` — sidebar background, hover, active, borders, child item states
- `temas.navbar.*` — navbar background/button/user text
- `temas.paginador.*` — pagination button/active/select styles
- `temas.tabla.acciones.*` — table row action button styles (`ver`/`editar`/`eliminar`, each a soft-colored pill: `bg-blue-50`/`bg-green-50`/`bg-red-50` with darker `-100` hover)
- `temas.texto.*` — heading/error text styles
- `temas.inputColumnas.*` — grid layouts for form rows (`dos`, `tres`, `cuatro` columns)

**Reuse an existing `temas` entry instead of hand-writing equivalent classes.** If a new pattern is needed repeatedly (3+ places), add it to `temas.js` rather than duplicating a long class string across components.

## Color palette

- **Neutral/structural base**: `slate` (slate-700/800/600/100) for sidebar, navbar, primary buttons, and headings.
- **Brand accent**: a custom blue, `rgb(32, 114, 185)`, exposed as utility classes `.bg-celestevr`, `.text-celestevr`, `.accent-celestevr` (defined in `index.css`, each with a `:hover` variant) — use these for brand-colored accents instead of an arbitrary `blue-*` shade.
- **Semantic colors**: `blue` = view/info, `green` = edit/success, `red` = delete/danger/errors, `gray` = secondary/borders/disabled. Follow this mapping for any new action buttons or status indicators — don't invent a different color meaning for the same action type.
- Page background is `slate-100` (set globally on `body` in `index.css`) — don't override it per-page.

## Conventions to follow

- Buttons/cards/inputs use `rounded-lg` (or `rounded-md`/`rounded-xl` for larger cards) — stay consistent with the radius already used for that component tier; don't mix `rounded-sm` into the primary button/card scale.
- Interactive elements get `transition` (and often `transition-colors` / `duration-200`) plus a `hover:` state; icon-button actions in tables additionally use `hover:scale-105 active:scale-95` for a tactile click effect (see `temas.tabla.acciones.base`).
- Disabled states: `disabled:opacity-50 disabled:cursor-not-allowed` (see `Button.jsx`).
- Icons come from `lucide-react`, sized via the `size` prop (typically `16`–`20`), not Tailwind width/height classes.
- For custom one-off brand-color needs in inline SVG/chart code (e.g. Recharts `stroke`/`fill`), use the raw `rgb(32, 114, 185)` value to match `.celestevr`, since SVG props can't consume Tailwind classes.

## Things to avoid

- Don't add `tailwind.config.js` — v4 in this project is configured purely via `@import "tailwindcss"` in `index.css`. If a genuine `@theme` token (e.g. a new named color) is needed, add it inside `index.css` using v4's CSS-based `@theme` block, not a JS config file.
- Don't hardcode the brand blue as a literal Tailwind arbitrary value (`bg-[rgb(32,114,185)]`) in components — use the `.bg-celestevr`/`.text-celestevr` classes so the color stays in one place.
- Don't pull in a component library (MUI, Chakra, shadcn/ui, DaisyUI) — this project's UI kit is hand-rolled in `src/components/ui/` on top of plain Tailwind.
