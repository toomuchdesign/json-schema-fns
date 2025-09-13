import type { Merge, SetRequired } from 'type-fest';

import { isJSONSchemaObjectType } from './utils';
import type {
  JSONSchemaObject,
  JSONSchemaObjectOutput,
  PickFromTuple,
} from './utils/types';

type PickSchemaProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
> = Merge<
  Schema,
  {
    properties: Pick<Schema['properties'], Keys[number]>;
    required: PickFromTuple<Schema['required'], Keys[number]>;
  }
>;

/**
 * Pick only specific properties from an object schema.
 *
 * @example
 * ```ts
 * pickProps(schema, ['key1', 'key2']);
 * ```
 */
export function pickProps<
  Schema extends SetRequired<JSONSchemaObject, 'properties'>,
  Keys extends (keyof Schema['properties'])[],
>(
  schema: Schema,
  keys: Keys,
): JSONSchemaObjectOutput<PickSchemaProperties<Schema, Keys>> {
  isJSONSchemaObjectType(schema);

  const required = schema.required
    ? schema.required.filter((key) => keys.includes(key))
    : [];

  const properties = Object.fromEntries(
    Object.entries(schema.properties).filter(([key]) => keys.includes(key)),
  );

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}
