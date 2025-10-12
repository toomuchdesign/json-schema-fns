import type { Merge, SetRequired } from 'type-fest';

import { isJSONSchemaObjectType } from './utils';
import type {
  JSONSchemaObject,
  JSONSchemaObjectOutput,
  OmitFromTuple,
} from './utils/types';

type OmitSchemaProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
> = Merge<
  Schema,
  {
    properties: Omit<Schema['properties'], Keys[number]>;
    required: OmitFromTuple<Schema['required'], Keys[number]>;
  }
>;

/**
 * Omit specific `properties` from an object JSON schema.
 *
 * @example
 * ```ts
 * omitProps(schema, ['key1', 'key2']);
 * ```
 */
export function omitProps<
  const Schema extends SetRequired<JSONSchemaObject, 'properties'>,
  const Keys extends (keyof Schema['properties'])[],
>(
  schema: Schema,
  keys: Keys,
): JSONSchemaObjectOutput<OmitSchemaProperties<Schema, Keys>> {
  isJSONSchemaObjectType(schema);

  const required = schema.required
    ? schema.required.filter((key) => !keys.includes(key))
    : [];
  const properties = Object.fromEntries(
    Object.entries(schema.properties).filter(([key]) => !keys.includes(key)),
  );

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}

/**
 * Omit specific `properties` from an object JSON schema.
 * Wraps `optionalProps` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeOmitProps(['key1', 'key2']));
 * ```
 */
export function pipeOmitProps<
  const Schema extends SetRequired<JSONSchemaObject, 'properties'>,
  const Keys extends (keyof Schema['properties'])[],
>(keys: Keys) {
  return (schema: Schema) => omitProps<Schema, Keys>(schema, keys);
}
