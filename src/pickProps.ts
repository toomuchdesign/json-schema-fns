import { Simplify } from 'type-fest';

import { isJSONSchemaObjectType } from './utils';
import type {
  JSONSchemaObject,
  JSONSchemaObjectOutput,
  MergeRecords,
  PickFromTuple,
} from './utils/types';

type PickSchemaProperties<
  Schema extends JSONSchemaObject,
  Keys extends readonly (keyof Schema['properties'])[],
> = MergeRecords<
  Schema,
  {
    properties: Simplify<Pick<Schema['properties'], Keys[number]>>;
    required: Schema['required'] extends readonly string[]
      ? PickFromTuple<Schema['required'], Keys[number]>
      : undefined;
  }
>;

/**
 * Pick only specific `properties` from an object JSON schema.
 *
 * @example
 * ```ts
 * pickProps(schema, ['key1', 'key2']);
 * ```
 */
export function pickProps<
  const Schema extends JSONSchemaObject,
  const Keys extends (keyof Schema['properties'])[],
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

/**
 * Pick only specific `properties` from an object JSON schema.
 * Wraps `pickProps` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipePickProps(['key1', 'key2']));
 * ```
 */
export function pipePickProps<
  const Schema extends JSONSchemaObject,
  const Keys extends (keyof Schema['properties'])[],
>(keys: Keys) {
  return (schema: Schema) => pickProps<Schema, Keys>(schema, keys);
}
