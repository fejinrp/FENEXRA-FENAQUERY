# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

FenaQuery is a **Next.js 14 (App Router)** developer toolkit that performs all transformations 100% client-side — no backend, no API calls, no data sent to any server.

### Layer structure

```
src/app/           # Pages (one route per tool)
src/components/ui/ # Shared UI components
src/lib/tools/     # Pure transformation logic (no side effects)
```

### How a tool is wired

Each tool route (e.g. `app/sql-to-mongo/page.tsx`) renders a `ToolLayout` with an `EditorPanel` (split input/output). User triggers conversion → page calls the corresponding `lib/tools/*.ts` function → output rendered in the panel. All logic lives in `lib/tools/`, pages are thin wrappers.

### Key components

- **`Sidebar.tsx`** — navigation; collapsible, responsive
- **`ToolLayout.tsx`** — standard chrome (title, controls slot, content)
- **`EditorPanel.tsx`** — split input/output pane; `Ctrl+Enter` triggers conversion; copy/download buttons
- **`ExamplesGrid.tsx`** — pre-built examples loaded into input
- **`ThemeProvider.tsx`** — dark/light mode context; persists to localStorage

### Active tools & their lib files

| Route | Lib file | Notes |
|---|---|---|
| `/sql-to-mongo` | `sqlToMongo.ts` | SELECT/INSERT/UPDATE/DELETE + JOINs → MongoDB aggregation pipelines |
| `/json-to-types` | `jsonToTypes.ts` | JSON → TypeScript / C# / Python / Go type definitions |
| `/json-to-sql` | `jsonToSql.ts` | JSON → INSERT statements; batch inserts for PostgreSQL |
| `/json-beautifier` | `jsonBeautifier.ts` | Pretty-print + validate JSON |
| `/json-minifier` | — (inline) | Compact JSON |
| `/encrypt` | `encrypt.ts` | AES-GCM-256/128, AES-CBC-256 via Web Crypto API; Base64, ROT13, URL encoding |

### Styling

- **Tailwind CSS** with a custom theme defined in `tailwind.config.ts`
- CSS variables for theming (light/dark) declared in `globals.css` — accent green `#00c37a`, surface layers, syntax highlight colors
- Fonts: Geist Sans (UI) + Geist Mono (code editors)

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
