---
'@toomuchdesign/json-schema-fns': minor
---

Add `renamePropsDeep` and `pipeRenamePropsDeep` — rename specific nested properties in an object JSON schema using dot-notation paths. Source paths must resolve to existing properties (compile error on unknown paths); target names are arbitrary strings (renames don't move properties between levels). Bare and dotted entries can coexist: `{ user: 'account', 'user.id': 'userId' }` renames `user` at the top level and `id` within it. Position in each level's `required` is preserved.
