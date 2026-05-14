# Contributing to StackForm

Thanks for your interest in contributing. This document covers everything you need to know — from reporting bugs to submitting code.

## Table of contents

- [Reporting bugs](#reporting-bugs)
- [Proposing features](#proposing-features)
- [Submitting a pull request](#submitting-a-pull-request)
- [Development setup](#development-setup)
- [Code conventions](#code-conventions)
- [Changeset requirements](#changeset-requirements)
- [Commit conventions](#commit-conventions)

---

## Reporting bugs

Open a [bug report issue](https://github.com/ivaiva89/stack-form/issues/new?template=bug_report.yml). Include:

- The package and version affected (`@stackform/core@1.0.0`)
- A minimal reproduction — a CodeSandbox or StackBlitz link is ideal
- What you expected vs what happened

Before opening, search existing issues to avoid duplicates.

---

## Proposing features

Open a [GitHub Discussion](https://github.com/ivaiva89/stack-form/discussions/new?category=ideas) in the **Ideas** category first. Describe the problem you're solving, not just the solution. If the feature is accepted, a tracking issue will be created and linked to a milestone.

Don't open a feature request issue directly — proposals go through Discussions so they can be evaluated before committing to implementation.

---

## Submitting a pull request

1. **Find or open an issue.** PRs without a linked issue may be closed. If you want to work on something, comment on the issue first so we can avoid duplicated effort.
2. **Fork the repo** and create a branch from `main`:
   ```bash
   git checkout -b feat/sf-123-your-feature
   ```
   Branch naming: `feat/sf-<issue>-slug`, `fix/sf-<issue>-slug`, `docs/sf-<issue>-slug`.
3. **Write your code.** Match the style and patterns already in the file you're editing.
4. **Add tests.** All new behavior needs tests. Bug fixes need a regression test.
5. **Add a changeset** for any public API change (see [Changeset requirements](#changeset-requirements)).
6. **Open the PR** against `main`. Fill out the PR template.

PRs require CI to pass (typecheck + lint + test + build) before merge.

---

## Development setup

**Prerequisites:** Node.js ≥ 18, pnpm ≥ 9.

```bash
# Clone and install
git clone https://github.com/ivaiva89/stack-form.git
cd stack-form
pnpm install

# Build all packages (required before running tests)
pnpm build

# Run tests
pnpm test

# Typecheck
pnpm typecheck

# Lint
pnpm lint
```

### Monorepo structure

```
packages/
  core/       — headless primitives, slot system, useField hook
  ui/         — shadcn-based default slot components
  rhf/        — React Hook Form adapter
  tanstack/   — TanStack Form adapter
  native/     — native useState/useReducer adapter
  zod/        — Zod schema adapter
  valibot/    — Valibot schema adapter
apps/
  docs/       — FumaDocs documentation site
  storybook/  — component stories
```

Changes to `@stackform/core` affect all packages. Run `pnpm build` in `packages/core` before testing other packages.

---

## Code conventions

- **TypeScript strict mode** — no `any`, no type assertions unless genuinely necessary
- **Match existing patterns** — look at an existing field component before writing a new one; don't invent new abstractions
- **No accidental peer dep imports** — `@stackform/core` must not import from `@stackform/rhf` or any form library
- **Slot keys are PascalCase** — `slots.Input`, `slots.Label`, `slots.Trigger`
- **Tests use the `TestFormProvider` harness** — don't wire up a real RHF form in unit tests

---

## Changeset requirements

Any PR that touches a public API (adds, changes, or removes an export) must include a changeset. Internal refactors, test changes, and docs-only PRs do not require one.

```bash
pnpm changeset add
```

Choose the affected packages and bump type:

- `patch` — bug fix, no API change
- `minor` — new feature, backward compatible
- `major` — **not used** — StackForm follows a no-major-bumps policy; breaking changes go through a deprecation cycle (2-version window) before removal

Changeset messages should be written for consumers, not maintainers. Describe what changed and why it matters to someone using the package.

---

## Commit conventions

Conventional commit format:

```
feat(core): add useFieldValue hook
fix(rhf): normalize undefined to empty string in text fields
docs(ui): add slot customization examples
chore: update pnpm lockfile
```

Scopes: `core`, `ui`, `rhf`, `tanstack`, `native`, `zod`, `valibot`, `cli`, `docs`.
