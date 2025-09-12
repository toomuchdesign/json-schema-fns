import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type ObjectKeys = string | number | symbol;

type RequireProps<
  Schema extends JSONSchemaObject,
  Keys extends ObjectKeys[] | undefined = undefined,
  PropertiesKeys = (keyof Schema['properties'])[],
> = Merge<
  Schema,
  {
    required: Readonly<
      UnionToTuple<
        Keys extends undefined
          ? // If no keys:
            TupleToUnion<PropertiesKeys>
          : // If keys provided:
            TupleToUnion<Schema['required']> | TupleToUnion<Keys>
      >
    >;
  }
>;

/**
 * Mark specific properties in an object schema as required.
 * If no keys provided, all properties become required
 *
 * @example
 * ```ts
 * requireProps(schema, ['key1', 'key2']);
 * ```
 */
export function requireProps<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[] | undefined = undefined,
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
