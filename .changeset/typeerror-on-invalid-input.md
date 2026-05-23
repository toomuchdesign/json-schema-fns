---
'@toomuchdesign/json-schema-fns': patch
---

Throw `TypeError` (instead of `Error`) when a public function is invoked with a non-object JSON Schema. Consumers can now discriminate library input-shape failures via `e instanceof TypeError`.
