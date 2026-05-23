---
'@toomuchdesign/json-schema-fns': minor
---

Add `omitPropsDeep` and `pipeOmitPropsDeep` — deep variants of `omitProps` that accept dot-notation paths and drop nested `properties` (and matching `required` entries) at every level. Mirrors `pickPropsDeep`: bare keys drop the whole sub-schema, dotted paths drill in, and bare-key drops win over sub-path drills when both target the same key.
