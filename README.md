# StackForm

Headless form component library for React and Next.js. Bridges shadcn/ui with React Hook Form, TanStack Form, and native React state.

## Packages

| Package | Description |
|---|---|
| `@stackform/core` | Core field components and slot system |
| `@stackform/ui` | shadcn/ui-based default slot implementations |
| `@stackform/rhf` | React Hook Form adapter |
| `@stackform/tanstack` | TanStack Form adapter |
| `@stackform/native` | Native React state adapter |
| `@stackform/zod` | Zod schema adapter |
| `@stackform/valibot` | Valibot schema adapter |

## Installation (Alpha)

```bash
npm install @stackform/core @stackform/ui @stackform/rhf
```

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## Publishing (Maintainers)

Releases are automated via [Changesets](https://github.com/changesets/changesets) and GitHub Actions.

### How it works

1. Open a PR with your changes and run `pnpm changeset` to add a changeset file
2. Merge the PR — the Release workflow creates a "Version Packages" PR automatically
3. Merge the "Version Packages" PR — all `@stackform/*` packages publish to npm under the `alpha` tag

### Required GitHub secret

Add the following secret to your GitHub repository (`Settings → Secrets and variables → Actions`):

| Secret | Description |
|---|---|
| `NPM_TOKEN` | npm access token with `Automation` type from [npmjs.com](https://www.npmjs.com) — requires publish permission for all `@stackform/*` packages |

### Dry-run locally

```bash
pnpm build
pnpm changeset publish --tag alpha --dry-run
```
