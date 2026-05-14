# StackForm Roadmap

StackForm follows **milestone-based releases** — versions ship when a milestone's acceptance criteria are fully met, not on a fixed calendar schedule. Alpha releases are cut freely during development for dogfooding and early feedback.

## Current milestone — v1.1.0 (First stable)

**Goal:** First production-ready release on the `latest` npm tag. All Tier 1 components, three adapters, two schema integrations, slot system locked. No breaking changes without a deprecation cycle. (The 1.0.x line lives on the `alpha` tag and is not coming to `latest` — v1.1.0 is the first stable cut.)

### What's included

- ✅ All 7 Tier 1 field components: `TextField`, `TextareaField`, `SelectField`, `CheckboxField`, `SwitchField`, `RadioGroupField`, `NumberField`
- ✅ Three adapters: `@stackform/rhf`, `@stackform/tanstack`, `@stackform/native`
- ✅ Two schema adapters: `@stackform/zod`, `@stackform/valibot`
- ✅ Slot-based customization system (3-layer: field → provider → core)
- ✅ `@stackform/ui` — shadcn-based default slot components
- ✅ Docs site at [stack-form-docs.vercel.app](https://stack-form-docs.vercel.app)
- ✅ TypeScript type fixes (`resolveSlots` constraint)
- ✅ `useTanstackField` public hook
- ✅ Typed `field.name()` helper on `useRHFForm`
- ✅ Per-package READMEs, `CONTRIBUTING.md`, release process documented
- 🔄 Dogfooding validated on real projects

### Install (alpha — current track)

```bash
npm install @stackform/core@alpha @stackform/ui@alpha @stackform/rhf@alpha
```

After v1.1.0 ships, install without a tag:

```bash
npm install @stackform/core @stackform/ui @stackform/rhf
```

---

## Next — v1.2.0

**Goal:** Cover the form patterns B2B SaaS apps need most — field arrays, dependent fields, and the first Tier 2 components.

- `useFieldArray` — add/remove/reorder rows, works with all 3 adapters
- `useFieldValue` — read other fields' values for dependent field logic
- `validateOn` — `blur | change | submit` at provider and field level
- `DatePickerField` — locale, min/max, range mode
- `ComboboxField` — searchable, async options, multi-select
- `@stackform/testing` — `renderWithForm` helper for writing field tests
- `examples/with-rhf/` — complete reference app

---

## v1.3.0

**Goal:** CLI and remaining Tier 2 components.

- `npx stackform init / add / diff / update` — copy-into-project workflow
- `MultiSelectField` — chips, async, creatable
- `FileUploadField` — drag-and-drop, preview, size validation
- `SliderField` — range, marks, formatted tooltip
- `DateRangeField` — two-calendar layout, presets
- Complete example apps (`with-tanstack`, `with-nextjs` App Router)

---

## Post-v1.x backlog

These are planned but not assigned to a milestone yet.

- Tier 3 components: `ArrayField`, `OTPField`, `PhoneField`, `RichTextField`, `ColorPickerField` — free and MIT like everything else
- Form wizard / multi-step primitives (`FormStep`, `useFormWizard`)
- DevTools / debug mode — form state inspector
- WCAG 2.1 AA accessibility audit
- i18n support — localized error messages, RTL
- Server-side validation integration
- Performance benchmarks — 100+ field forms
- Migration guide from raw RHF + shadcn/ui

---

## How releases work

1. All milestone acceptance criteria are met
2. CI is green on `main`
3. Changesets are versioned and published to npm under `latest`
4. GitHub Release is created with the changelog
5. This roadmap is updated

Have a feature idea? Open a [Discussion](https://github.com/ivaiva89/stack-form/discussions/new?category=ideas) — that's where proposals are evaluated before becoming issues.
