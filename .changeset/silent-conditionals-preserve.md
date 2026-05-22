---
'@toomuchdesign/json-schema-fns': minor
---

Preserve `if` / `then` / `else` conditional branches in `sealSchemaDeep` and `unsealSchemaDeep` (previously these branches were mutated, silently changing which values triggered `then` vs `else`).
