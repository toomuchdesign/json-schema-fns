import type { Merge, SetRequired, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

type OmitFromTuple<Tuple extends readonly unknown[], EntriesToOmit> = Readonly<
  UnionToTuple<Exclude<TupleToUnion<Tuple>, EntriesToOmit>>
>;

type OmitSchemaProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
> = Merge<
  Schema,
  {
    properties: Omit<Schema['properties'], Keys[number]>;
    required: undefined extends Schema['required']
      ? undefined
      : OmitFromTuple<
          // @ts-expect-error extends doesn't narrow type
          Schema['required'],
          Keys[number]
        >;
  }
>;

/**
 * Omit specific properties from an object schema.
 *
 * @example
 * ```ts
 * omitProps(schema, ['key1', 'key2']);
 * ```
 */
export function omitProps<
  Schema extends SetRequired<JSONSchemaObject, 'properties'>,
  Keys extends (keyof Schema['properties'])[],
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
