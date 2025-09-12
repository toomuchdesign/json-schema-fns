import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type ObjectKeys = string | number | symbol;

type OptionalProps<
  Schema extends JSONSchemaObject,
  Keys extends ObjectKeys[] | never[] | undefined = undefined,
> =
  // No keys
  Keys extends undefined
    ? Omit<Schema, 'required'>
    : // Empty array keys
      Keys extends never[]
      ? Schema
      : Merge<
          Schema,
          {
            required: Readonly<
              UnionToTuple<
                Exclude<TupleToUnion<Schema['required']>, TupleToUnion<Keys>>
              >
            >;
          }
        >;
/**
 * Make specific properties in an object schema optional.
 * If no keys are provided, all properties become optional.
 *
 * @example
 * ```ts
 * optionalProps(schema, ['key1', 'key2']);
 * ```
 */
export function optionalProps<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[] | undefined = undefined,
>(
  schema: Schema,
  keys?: Keys,
): JSONSchemaObjectOutput<OptionalProps<Schema, Keys>> {
  isJSONSchemaObjectType(schema);

  const currentRequired = schema.required ?? [];
  const required = keys
    ? currentRequired.filter(
        (key) =>
          !keys.includes(
            // @ts-expect-error
            key,
          ),
      )
    : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}
