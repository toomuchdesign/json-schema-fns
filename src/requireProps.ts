import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type ObjectKeys = string | number | symbol;

type RequireProps<
  Schema extends JSONSchemaObject,
  Keys extends ObjectKeys[] | undefined = undefined,
  PropertiesKeys = (keyof Schema['properties'])[],
> =
  // No keys
  Keys extends undefined
    ? Merge<
        Schema,
        {
          required: Readonly<UnionToTuple<TupleToUnion<PropertiesKeys>>>;
        }
      >
    : Merge<
        Schema,
        {
          required: Readonly<
            UnionToTuple<TupleToUnion<Schema['required']> | TupleToUnion<Keys>>
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

  let required: string[] = [];
  if (keys) {
    const currentRequired = schema.required ?? [];
    required.push(
      ...currentRequired,
      // @ts-expect-error ddd
      ...keys,
    );
  } else {
    required = schema.properties ? Object.keys(schema.properties) : [];
  }

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}
