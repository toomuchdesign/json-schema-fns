import type { UnionToTuple } from 'type-fest';

import { isJSONSchemaObjectType } from './utils';
import type {
  JSONSchemaObject,
  JSONSchemaObjectOutput,
  MergeOptionalTuples,
  MergeRecords,
} from './utils/types';

type RequireProps<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[] | undefined = undefined,
> = MergeRecords<
  Schema,
  {
    required: Readonly<
      Keys extends readonly string[]
        ? // If keys provided:
          MergeOptionalTuples<Schema['required'], Keys>
        : // If no keys:
          UnionToTuple<keyof Schema['properties']>
    >;
  }
>;

/**
 * Mark specific properties in a object JSON schema as required.
 * If no keys provided, all properties become required
 *
 * @example
 * ```ts
 * requireProps(schema, ['key1', 'key2']);
 * ```
 */
export function requireProps<
  const Schema extends JSONSchemaObject,
  const Keys extends (keyof Schema['properties'])[] | undefined = undefined,
>(
  schema: Schema,
  keys?: Keys,
): JSONSchemaObjectOutput<RequireProps<Schema, Keys>> {
  isJSONSchemaObjectType(schema);

  let required = keys
    ? [...new Set([...(schema.required ?? []), ...keys])]
    : Object.keys(schema.properties);

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}

/**
 * Mark specific properties in a object JSON schema as required.
 * If no keys provided, all properties become required.
 * Wraps `sealSchemaDeep` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeRequireProps(['key1', 'key2']));
 * ```
 */
export function pipeRequireProps<
  const Schema extends JSONSchemaObject,
  const Keys extends (keyof Schema['properties'])[] | undefined = undefined,
>(keys?: Keys) {
  return (schema: Schema) => requireProps<Schema, Keys>(schema, keys);
}
