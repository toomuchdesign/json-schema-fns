import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type RequireProps<
  Schema extends JSONSchemaObject,
  Keys = (keyof Schema['properties'])[],
> = Merge<Schema, { required: Readonly<UnionToTuple<TupleToUnion<Keys>>> }>;

/**
 * Mark all properties in an object schema as required.
 *
 * @example
 * ```ts
 * requireProps(schema);
 * ```
 */
export function requireProps<Schema extends JSONSchemaObject>(
  schema: Schema,
): JSONSchemaObjectOutput<RequireProps<Schema>> {
  isJSONSchemaObjectType(schema);

  const required = schema.properties ? Object.keys(schema.properties) : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}
