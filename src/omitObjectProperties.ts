import type { Merge, UnionToTuple, TupleToUnion } from 'type-fest';
import type {
  JSONSchemaObject,
  RequiredField,
  JSONSchemaObjectOutput,
} from './types';
import { isObjectType } from './utils';

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
    required: RequiredField<
      undefined extends Schema['required']
        ? undefined
        : OmitFromTuple<
            // @ts-expect-error extends doesn't narrow type
            Schema['required'],
            Keys[number]
          >
    >;
  }
>;

/**
 * Remove specified properties from a JSON Schema object definition.
 */
export function omitObjectProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
>(
  schema: Schema,
  keysToOmit: Keys,
): JSONSchemaObjectOutput<OmitSchemaProperties<Schema, Keys>> {
  isObjectType(schema);

  const required = schema.required
    ? schema.required.filter((key) => !keysToOmit.includes(key))
    : [];
  const properties = Object.fromEntries(
    Object.entries(schema.properties).filter(
      ([key]) => !keysToOmit.includes(key),
    ),
  );

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}
