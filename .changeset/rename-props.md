---
'@toomuchdesign/json-schema-fns': minor
---

Add `renameProps` and `pipeRenameProps` — rename specific properties in an object JSON schema via an `{ oldKey: newKey }` map. Source keys must exist in `schema.properties` (compile error on unknown keys); target keys are arbitrary strings. Position in `required` is preserved. Shallow only.
