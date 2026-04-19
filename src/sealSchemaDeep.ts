import { isRecord } from './utils';
import type {
  JSONSchema,
  MergeRecords,
  Simplify,
  UnknownArray,
  UnknownRecord,
} from './utils/types';

// Children are dispatched from the parent's mapped type — no `Key` param is
// threaded through, so every `SealSchemaDeep<X>` instantiation is keyed by `X`
// alone, maximizing the compiler's instantiation cache hits.
type SealSchemaDeep<Schema> = Schema extends UnknownArray
  ? { [Index in keyof Schema]: SealSchemaDeep<Schema[Index]> }
  : Schema extends { type: 'object' }
    ? Simplify<
        MergeRecords<
          { [Keyword in keyof Schema]: SealChild<Keyword, Schema[Keyword]> },
          { readonly additionalProperties: false }
        >
      >
    : Schema extends UnknownRecord
      ? { [Keyword in keyof Schema]: SealChild<Keyword, Schema[Keyword]> }
      : Schema;

// Dispatch recursion based on the JSON Schema keyword — see docs/combinators.md.
type SealChild<Keyword, Value> = Keyword extends 'not' | 'allOf'
  ? Value // skip — sealing would alter combinator semantics
  : Keyword extends 'properties' | 'patternProperties'
    ? Value extends UnknownRecord
      ? { [PropertyName in keyof Value]: SealSchemaDeep<Value[PropertyName]> }
      : Value
    : SealSchemaDeep<Value>;

function sealSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(sealSchema);
  if (isRecord(schema)) {
    const walked: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(schema)) {
      walked[k] = sealChild(k, v);
    }
    return schema.type === 'object'
      ? { ...walked, additionalProperties: false }
      : walked;
  }
  return schema;
}

function sealChild(key: string, value: unknown): unknown {
  if (key === 'not' || key === 'allOf') return value;
  if (key === 'properties' || key === 'patternProperties') {
    if (!isRecord(value)) return value;
    const result: Record<string, unknown> = {};
    for (const [p, pv] of Object.entries(value)) result[p] = sealSchema(pv);
    return result;
  }
  return sealSchema(value);
}

/**
 * Recursively set `additionalProperties: false` on object JSON schemas.
 *
 * JSON Schema [combinators](https://json-schema.org/understanding-json-schema/reference/combining) are handled selectively to preserve semantics:
 * - `anyOf` / `oneOf`: each option is sealed
 * - `allOf` / `not`: left untouched (sealing would alter validation meaning)
 *
 * See [docs/combinators.md](../docs/combinators.md) for the full rationale.
 *
 * @example
 * ```ts
 * sealSchemaDeep(schema);
 * ```
 */
export function sealSchemaDeep<const Schema extends JSONSchema>(
  schema: Schema,
): SealSchemaDeep<Schema> {
  return sealSchema(schema) as SealSchemaDeep<Schema>;
}

/**
 * Recursively set `additionalProperties: false` on all object JSON schema schemas.
 * Wraps `sealSchemaDeep` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeSealSchemaDeep());
 * ```
 */
export function pipeSealSchemaDeep<const Schema extends JSONSchema>(): (
  schema: Schema,
) => SealSchemaDeep<Schema> {
  return (schema) => sealSchemaDeep<Schema>(schema);
}
