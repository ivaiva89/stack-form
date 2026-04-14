# Bundle Size

Measured with [`size-limit`](https://github.com/ai/size-limit) — minified + brotli compressed, including all bundled dependencies. Peer dependencies (React, react-hook-form, Radix UI, etc.) are excluded since they live in the host app.

Run `pnpm size` to check sizes locally.

## Baseline (2026-04-15)

| Package | Format | Size |
| --- | --- | --- |
| `@stackform/core` | ESM | 7.55 kB |
| `@stackform/core` | CJS | 7.68 kB |
| `@stackform/ui` | ESM | 18.16 kB |
| `@stackform/ui` | CJS | 19.62 kB |
| `@stackform/rhf` | ESM | 16.98 kB |
| `@stackform/rhf` | CJS | 19.25 kB |

## CI

The CI workflow runs `size-limit` on every PR and posts a comment showing the size diff against the base branch. CI does **not** fail on size increases — the report is informational only. Hard budgets will be added once baseline numbers are stable.
