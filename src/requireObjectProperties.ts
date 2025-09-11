import type { Merge, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type RequireObjectProperties<
  Schema extends JSONSchemaObject,
  ObjectProps = keyof Schema['properties'],
> = Merge<Schema, { required: Readonly<UnionToTuple<ObjectProps>> }>;

/**
 * Require all properties of a JSON Schema object definition.
 */
export function requireObjectProperties<Schema extends JSONSchemaObject>(
  schema: Schema,
): JSONSchemaObjectOutput<RequireObjectProperties<Schema>> {
  isJSONSchemaObjectType(schema);

  const required = schema.properties ? Object.keys(schema.properties) : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}
