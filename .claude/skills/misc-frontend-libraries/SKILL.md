---
name: misc-frontend-libraries
description: Best practices for the smaller supporting libraries in this project (hParkingFront) — lucide-react icons, jwt-decode, and Recharts charts. Use when adding icons, decoding/reading JWT claims, or building/editing dashboard charts.
---

# Misc frontend libraries for hParkingFront

## lucide-react (icons)

- Import icons individually by name: `import { Eye, Pencil, Trash2 } from 'lucide-react'`. Never import the whole library as a namespace.
- Size via the `size` prop (a number, in px), not Tailwind `w-*`/`h-*` classes — matches every existing usage (`<X size={20} />`, `<Plus size={15} />`). Common sizes in this codebase: `15`–`16` for inline/table-action icons, `18` for sidebar menu icons, `20` for header/close icons.
- Color icons via the parent's text color (`text-white`, `text-celestevr`, etc.) or Tailwind color utilities on the icon itself — icons inherit `currentColor` by default, so prefer setting color via a wrapping `className` rather than a `color` prop, to stay consistent with existing components.
- Pick icons for semantic consistency with existing usage: `Eye` = view/detail, `Pencil` = edit, `Trash2` = delete, `Plus` = create/add, `X` = close. Reuse these for the same action elsewhere instead of picking a different icon for the same concept.

## jwt-decode

- Only used in [AuthContext.jsx](../../../src/context/AuthContext.jsx) to read claims out of the **access token** right after login or refresh — never to validate/trust the token (decoding is not verification; the backend is the source of truth for whether a token is valid).
- Current claim shape: `sub` = email, `roles` = array of `{ authority: string }` objects, mapped to a flat string array via `decodificado.roles.map((r) => r.authority)`. Reuse this exact mapping if reading roles elsewhere rather than re-deriving it.
- Don't decode the token on every render or inside a component render body — decode once (on login/refresh) and store the derived fields (`email`, `roles`) in `AuthContext` state, as the existing code does. Components should read `usuario` from `useAuth()`, not decode tokens themselves.
- Don't use `jwt-decode` to check expiry client-side as a substitute for the 401-triggered refresh flow already implemented in `axiosInstance.js` — that interceptor is the mechanism for handling expired tokens.

## Recharts

- Dashboard charts live in `src/components/dashboard/` (see [ParkingAvailabilityChart.jsx](../../../src/components/dashboard/ParkingAvailabilityChart.jsx)) and follow this shape:
  - Wrap the chart in `<ResponsiveContainer width="100%" height={...}>` — never a fixed-pixel `<AreaChart>`/`<LineChart>` outside a `ResponsiveContainer`, so it stays responsive inside the card grid.
  - Card wrapper: `bg-white rounded-xl shadow p-4 flex flex-col gap-2`, with a small header row (`flex justify-between items-center`) showing a title and a summary stat — match this for any new chart card.
  - Custom tooltips are a separate component (`CustomTooltip`) receiving `{ active, payload, label, ...extraProps }`, early-returning `null` when `!active || !payload?.length`, and styled as `bg-white border border-gray-200 rounded p-2 text-sm shadow`. Reuse this shape instead of the default Recharts tooltip when a custom tooltip is needed.
  - Use the brand blue `rgb(32, 114, 185)` for the primary/positive series and a soft red (`#f87171`) for a negative/occupied series, each with a matching `<linearGradient>` (id'd per-instance, e.g. `` `gradDisp-${parkingName}` ``, to avoid SVG id collisions when the same chart renders multiple times on one page) fading from `stopOpacity={0.3}` to `0`.
  - Format axis ticks/tooltips with small dedicated formatter functions (`formatHour`, `formatPercent`) rather than inline JSX logic, and pass them via `tickFormatter`.
- Keep `tick={{ fontSize: 11 }}` (or similarly small) on axes — charts here are compact dashboard cards, not full-page visualizations.
- Don't add a second charting library (Chart.js, Nivo, Victory, etc.) — Recharts is the established choice; extend the existing chart component patterns instead.
