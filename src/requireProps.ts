import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type requireProps<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[] = (keyof Schema['properties'])[],
> = Keys extends []
  ? Schema
  : // No schema.properties
    Keys extends never[]
    ? Schema
    : Merge<Schema, { required: Readonly<UnionToTuple<TupleToUnion<Keys>>> }>;

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
): JSONSchemaObjectOutput<requireProps<Schema>> {
  isJSONSchemaObjectType(schema);

  const required = schema.properties ? Object.keys(schema.properties) : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}
