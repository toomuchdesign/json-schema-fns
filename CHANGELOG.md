# @toomuchdesign/json-schema-fns

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
