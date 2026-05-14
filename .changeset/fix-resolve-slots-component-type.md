---
"@stackform/core": patch
---

Widen the `resolveSlots` generic constraint from `ComponentType<never>` to `ComponentType<object>` so custom slot implementations with any prop shape type-check correctly.
