# @toomuchdesign/json-schema-fns

## 0.9.0

### Minor Changes

- [#204](https://github.com/toomuchdesign/json-schema-fns/pull/204) [`7058be1`](https://github.com/toomuchdesign/json-schema-fns/commit/7058be1ccf9c2a10e28e65adbbc4e68dea6db074) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `omitPropsDeep` and `pipeOmitPropsDeep` — deep variants of `omitProps` that accept dot-notation paths and drop nested `properties` (and matching `required` entries) at every level. Mirrors `pickPropsDeep`: bare keys drop the whole sub-schema, dotted paths drill in, and bare-key drops win over sub-path drills when both target the same key.

- [#206](https://github.com/toomuchdesign/json-schema-fns/pull/206) [`a3ead21`](https://github.com/toomuchdesign/json-schema-fns/commit/a3ead21721072b6695e9f0ffdb006498729ba198) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `renamePropsDeep` and `pipeRenamePropsDeep` — rename specific nested properties in an object JSON schema using dot-notation paths. Source paths must resolve to existing properties (compile error on unknown paths); target names are arbitrary strings (renames don't move properties between levels). Bare and dotted entries can coexist: `{ user: 'account', 'user.id': 'userId' }` renames `user` at the top level and `id` within it. Position in each level's `required` is preserved.

- [#205](https://github.com/toomuchdesign/json-schema-fns/pull/205) [`d0d00c4`](https://github.com/toomuchdesign/json-schema-fns/commit/d0d00c4480b1afde8b9d441e2fc8d95d3283887d) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `renameProps` and `pipeRenameProps` — rename specific properties in an object JSON schema via an `{ oldKey: newKey }` map. Source keys must exist in `schema.properties` (compile error on unknown keys); target keys are arbitrary strings. Position in `required` is preserved. Shallow only.

- [#199](https://github.com/toomuchdesign/json-schema-fns/pull/199) [`0f14940`](https://github.com/toomuchdesign/json-schema-fns/commit/0f14940aa3e8967975fc5a24754de43b63738548) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Preserve `if` / `then` / `else` conditional branches in `sealSchemaDeep` and `unsealSchemaDeep` (previously these branches were mutated, silently changing which values triggered `then` vs `else`).

- [#199](https://github.com/toomuchdesign/json-schema-fns/pull/199) [`0f14940`](https://github.com/toomuchdesign/json-schema-fns/commit/0f14940aa3e8967975fc5a24754de43b63738548) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Accept the array form of `type` (e.g. `type: ['object', 'null']`) at the top level of input schemas. Object-shaped functions (`omitProps`, `pickProps`, …) still require the literal `type: 'object'` form.

### Patch Changes

- [#207](https://github.com/toomuchdesign/json-schema-fns/pull/207) [`12cccdb`](https://github.com/toomuchdesign/json-schema-fns/commit/12cccdbcba095af4ed09ae7023e95c90d4123581) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Drop the "experimental" label from the composition / `pipe*` API. Pipelines of at least 9 transformations are now verified across all four endorsed pipe libraries (pipe-ts, remeda, effect, ts-functional-pipe) — limited by pipe-ts's typed-overload cap of 9; the other three libraries support deeper pipelines. See `test/composition-pipe-depth-ceiling.test.ts` for per-library ceilings.

- [#202](https://github.com/toomuchdesign/json-schema-fns/pull/202) [`feb8cca`](https://github.com/toomuchdesign/json-schema-fns/commit/feb8cca8f3391fc676e586fe0b3755cdc50fdd49) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Throw `TypeError` (instead of `Error`) when a public function is invoked with a non-object JSON Schema. Consumers can now discriminate library input-shape failures via `e instanceof TypeError`.

## 0.8.0

### Minor Changes

- [#181](https://github.com/toomuchdesign/json-schema-fns/pull/181) [`f1fd0bf`](https://github.com/toomuchdesign/json-schema-fns/commit/f1fd0bf493c933f03b8f660579c32061f0aac86a) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Improve `MergeTuples` perf

- [#103](https://github.com/toomuchdesign/json-schema-fns/pull/103) [`efab04d`](https://github.com/toomuchdesign/json-schema-fns/commit/efab04d0e6ffc6325f0f7c11ebdc0e9bdd97f381) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Handle JSON schema `allOf`, `anyOf`, `oneOf`, `not` combinators with `sealSchemaDeep`

- [#180](https://github.com/toomuchdesign/json-schema-fns/pull/180) [`661cada`](https://github.com/toomuchdesign/json-schema-fns/commit/661cada270f745bf03059dbf121097ff93b01726) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `pickPropsDeep` function

- [#102](https://github.com/toomuchdesign/json-schema-fns/pull/102) [`8cdde3c`](https://github.com/toomuchdesign/json-schema-fns/commit/8cdde3c3719de7bc3d6bde068604349509fa369b) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Remove `type-fest` dependency

- [#181](https://github.com/toomuchdesign/json-schema-fns/pull/181) [`f1fd0bf`](https://github.com/toomuchdesign/json-schema-fns/commit/f1fd0bf493c933f03b8f660579c32061f0aac86a) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add explicit return type to all pipe functions

- [#103](https://github.com/toomuchdesign/json-schema-fns/pull/103) [`efab04d`](https://github.com/toomuchdesign/json-schema-fns/commit/efab04d0e6ffc6325f0f7c11ebdc0e9bdd97f381) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Handle JSON schema `allOf`, `anyOf`, `oneOf`, `not` combinators with `unsealSchemaDeep`

## 0.7.0

### Minor Changes

- [#92](https://github.com/toomuchdesign/json-schema-fns/pull/92) [`00cf318`](https://github.com/toomuchdesign/json-schema-fns/commit/00cf3180e3c63c31b2c8bf418393add84a2ceca3) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - `unsealSchemaDeep`: Remove `unevaluatedProperties` along with `additionalProperties`

### Patch Changes

- [#89](https://github.com/toomuchdesign/json-schema-fns/pull/89) [`6e223f9`](https://github.com/toomuchdesign/json-schema-fns/commit/6e223f9c3dd024bc1505e37b693f97c7e272bdd7) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - `unsealSchemaDeep`: properly discriminate `not` properties being used as JSON schema combinators or object property definitions

- [#89](https://github.com/toomuchdesign/json-schema-fns/pull/89) [`6e223f9`](https://github.com/toomuchdesign/json-schema-fns/commit/6e223f9c3dd024bc1505e37b693f97c7e272bdd7) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - `sealSchemaDeep`: properly discriminate `not` properties being used as JSON schema combinators or object property definitions

## 0.6.1

### Patch Changes

- [#85](https://github.com/toomuchdesign/json-schema-fns/pull/85) [`452602c`](https://github.com/toomuchdesign/json-schema-fns/commit/452602cc43e72df1b790d969799dae60a81c7ab6) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - `unsealSchemaDeep`: do not modify `allOf`, `anyOf`, `oneOf`, or `not` values

- [#85](https://github.com/toomuchdesign/json-schema-fns/pull/85) [`452602c`](https://github.com/toomuchdesign/json-schema-fns/commit/452602cc43e72df1b790d969799dae60a81c7ab6) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - `sealSchemaDeep`: do not modify `allOf`, `anyOf`, `oneOf`, or `not` values

## 0.6.0

### Minor Changes

- [#76](https://github.com/toomuchdesign/json-schema-fns/pull/76) [`9fd6d31`](https://github.com/toomuchdesign/json-schema-fns/commit/9fd6d318d85287eb9022dc115058e44010c2cc83) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Remove unnecessary `Readonly` invocations

- [#78](https://github.com/toomuchdesign/json-schema-fns/pull/78) [`6291bc5`](https://github.com/toomuchdesign/json-schema-fns/commit/6291bc51dcfe5d84bd9c2baaf0e4e9d5022afd90) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Simplify `sealSchemaDeep` output type

- [#78](https://github.com/toomuchdesign/json-schema-fns/pull/78) [`6291bc5`](https://github.com/toomuchdesign/json-schema-fns/commit/6291bc51dcfe5d84bd9c2baaf0e4e9d5022afd90) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Remove unnecessary `JSONSchemaObjectOutput` invoceations

- [#76](https://github.com/toomuchdesign/json-schema-fns/pull/76) [`9fd6d31`](https://github.com/toomuchdesign/json-schema-fns/commit/9fd6d318d85287eb9022dc115058e44010c2cc83) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Remove unnecessary `Simplify` invocations

### Patch Changes

- [`c37c539`](https://github.com/toomuchdesign/json-schema-fns/commit/c37c539a19819ebcb71a4a466d7aba1e462fddc1) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Fix type output simplification

## 0.5.0

### Minor Changes

- [#69](https://github.com/toomuchdesign/json-schema-fns/pull/69) [`7ab3ea6`](https://github.com/toomuchdesign/json-schema-fns/commit/7ab3ea68cad4a7e14f02135e4331cac8f4c7d9b0) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Refactor types by reducing complexity and recursion

## 0.4.0

### Minor Changes

- [#62](https://github.com/toomuchdesign/json-schema-fns/pull/62) [`e56d85e`](https://github.com/toomuchdesign/json-schema-fns/commit/e56d85e73e38f8e6b820cb32a130742fd15c726d) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Rename `unsealSchema` as `unsealSchemaDeep`

- [#65](https://github.com/toomuchdesign/json-schema-fns/pull/65) [`bb22f66`](https://github.com/toomuchdesign/json-schema-fns/commit/bb22f66d84ff66be86b62d2e4432cb5f092fc68a) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add pipe-friendly fns:
  - `pipeOmitProps`
  - `pipePickProps`
  - `pipeMergeProps`
  - `pipeRequireProps`
  - `pipeOptionalProps`
  - `pipeSealSchemaDeep`
  - `pipeUnsealSchemaDeep`

- [#62](https://github.com/toomuchdesign/json-schema-fns/pull/62) [`e56d85e`](https://github.com/toomuchdesign/json-schema-fns/commit/e56d85e73e38f8e6b820cb32a130742fd15c726d) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Rename `sealSchema` as `sealSchemaDeep`

## 0.3.0

### Minor Changes

- [#50](https://github.com/toomuchdesign/json-schema-fns/pull/50) [`b320542`](https://github.com/toomuchdesign/json-schema-fns/commit/b32054214f4d93dc28c6bf9eb4a34c299236d481) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Refactor API:
  - `omitObjectProperties` --> `omitProps`
  - `pickObjectProperties` --> `pickProps`
  - `mergeObjectProperties` --> `mergeProps`
  - `requireObjectProperties` --> `requireProps`
  - `closeObjectDeep` --> `sealSchema`
  - `openObjectDeep` --> `unsealSchema`

- [#51](https://github.com/toomuchdesign/json-schema-fns/pull/51) [`6ac9270`](https://github.com/toomuchdesign/json-schema-fns/commit/6ac9270200ff526cdb44a12341a833a19b8783e8) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `optionalProps` function

- [#47](https://github.com/toomuchdesign/json-schema-fns/pull/47) [`8400b7d`](https://github.com/toomuchdesign/json-schema-fns/commit/8400b7d187f0c8b42d9a799eb5d1dad421697f3c) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `requireProps` function

- [#53](https://github.com/toomuchdesign/json-schema-fns/pull/53) [`1077dd7`](https://github.com/toomuchdesign/json-schema-fns/commit/1077dd7e57d0613fd58e0a924defa80e6c341dbe) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - `requireProps` accept an optional `keys` argument

## 0.2.0

### Minor Changes

- [#24](https://github.com/toomuchdesign/json-schema-fns/pull/24) [`d67c00a`](https://github.com/toomuchdesign/json-schema-fns/commit/d67c00a206a8a4fde1b08e79e205325a9f316286) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Add `unsealSchema`

## 0.1.3

### Patch Changes

- [#14](https://github.com/toomuchdesign/json-schema-fns/pull/14) [`7431399`](https://github.com/toomuchdesign/json-schema-fns/commit/7431399cfeb0f8c4091b19cf0652cbd770e18a6e) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Release with GitHub actions

## 0.1.2

### Patch Changes

- [#11](https://github.com/toomuchdesign/json-schema-fns/pull/11) [`c25bb10`](https://github.com/toomuchdesign/json-schema-fns/commit/c25bb109f9054d9fef67554669f35aca36903898) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Release with GitHub actions

## 0.1.1

### Patch Changes

- [#9](https://github.com/toomuchdesign/json-schema-fns/pull/9) [`4214e7e`](https://github.com/toomuchdesign/json-schema-fns/commit/4214e7eb4882ae982c6e38910a1ba2e166bc112c) Thanks [@toomuchdesign](https://github.com/toomuchdesign)! - Release with GitHub actions

## 0.1.0

### Minor Changes

- 52d8fa0: Initial release
