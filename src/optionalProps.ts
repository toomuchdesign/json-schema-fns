import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type OptionalProps<
  Schema extends JSONSchemaObject,
  Keys = keyof Schema['properties'],
> = Keys extends any[]
  ? Merge<
      Schema,
      {
        required: Readonly<
          UnionToTuple<
            Exclude<TupleToUnion<Schema['required']>, TupleToUnion<Keys>>
          >
        >;
      }
    >
  : Omit<Schema, 'required'>;

/**
 * Make specific properties in an object schema optional.
 * If no keys are provided, all properties become optional.
 *
 * @example
 * ```ts
 * optionalProps(schema);
 * ```
 */
export function optionalProps<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
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
