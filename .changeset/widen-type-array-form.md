---
'@toomuchdesign/json-schema-fns': minor
---

Accept the array form of `type` (e.g. `type: ['object', 'null']`) at the top level of input schemas. Object-shaped functions (`omitProps`, `pickProps`, …) still require the literal `type: 'object'` form.
