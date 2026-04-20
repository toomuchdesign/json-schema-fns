import { isRecord } from './utils';
import type {
  JSONSchema,
  Simplify,
  UnknownArray,
  UnknownRecord,
} from './utils/types';

// Children are dispatched from the parent's mapped type — no `Key` param is
// threaded through, so every `UnsealSchemaDeep<X>` instantiation is keyed by
// `X` alone, maximizing the compiler's instantiation cache hits.
type UnsealSchemaDeep<Schema> = Schema extends UnknownArray
  ? { [Index in keyof Schema]: UnsealSchemaDeep<Schema[Index]> }
  : Schema extends { type: 'object' }
    ? Simplify<{
        [Keyword in keyof Omit<
          Schema,
          'additionalProperties' | 'unevaluatedProperties'
        >]: UnsealChild<Keyword, Schema[Keyword]>;
      }>
    : Schema extends UnknownRecord
      ? {
          [Keyword in keyof Schema]: UnsealChild<Keyword, Schema[Keyword]>;
        }
      : Schema;

// Dispatch recursion based on the JSON Schema keyword — see docs/combinators.md.
type UnsealChild<Keyword, Value> = Keyword extends 'not' | 'oneOf'
  ? Value // skip — unsealing would alter combinator semantics
  : Keyword extends 'properties' | 'patternProperties'
    ? Value extends UnknownRecord
      ? {
          [PropertyName in keyof Value]: UnsealSchemaDeep<Value[PropertyName]>;
        }
      : Value
    : UnsealSchemaDeep<Value>;

function unsealSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(unsealSchema);
  if (isRecord(schema)) {
    const walked: Record<string, unknown> = {};
    const isObjectSchema = schema.type === 'object';
    for (const [k, v] of Object.entries(schema)) {
      if (
        isObjectSchema &&
        (k === 'additionalProperties' || k === 'unevaluatedProperties')
      ) {
        continue;
      }
      walked[k] = unsealChild(k, v);
    }
    return walked;
  }
  return schema;
}

function unsealChild(key: string, value: unknown): unknown {
  if (key === 'not' || key === 'oneOf') return value;
  if (key === 'properties' || key === 'patternProperties') {
    if (!isRecord(value)) return value;
    const result: Record<string, unknown> = {};
    for (const [p, pv] of Object.entries(value)) result[p] = unsealSchema(pv);
    return result;
  }
  return unsealSchema(value);
}

/**
 * Recursively remove `additionalProperties` and `unevaluatedProperties` from object JSON schemas.
 *
 * JSON Schema [combinators](https://json-schema.org/understanding-json-schema/reference/combining) are handled selectively to preserve semantics:
 * - `allOf` / `anyOf`: each option is unsealed
 * - `oneOf` / `not`: left untouched (unsealing would alter validation meaning)
 *
 * See [docs/combinators.md](../docs/combinators.md) for the full rationale.
 *
 * @example
 * ```ts
 * unsealSchemaDeep(schema);
 * ```
 */
export function unsealSchemaDeep<const Schema extends JSONSchema>(
  schema: Schema,
): UnsealSchemaDeep<Schema> {
  return unsealSchema(schema) as UnsealSchemaDeep<Schema>;
}

/**
 * Recursively remove `additionalProperties` from all object JSON schema schemas.
 * Wraps `unsealSchemaDeep` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeUnsealSchemaDeep());
 * ```
 */
export function pipeUnsealSchemaDeep<const Schema extends JSONSchema>(): (
  schema: Schema,
) => UnsealSchemaDeep<Schema> {
  return (schema) => unsealSchemaDeep<Schema>(schema);
}
