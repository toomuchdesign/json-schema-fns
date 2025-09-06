import type { Simplify, JSONSchemaObject } from './types';
import { isObjectType } from './utils';

type OmitFromTuple<
  Tuple extends readonly unknown[],
  EntriesToRemove extends readonly unknown[],
> = Tuple extends readonly [infer First, ...infer Rest]
  ? First extends EntriesToRemove[number]
    ? OmitFromTuple<Rest, EntriesToRemove>
    : readonly [First, ...OmitFromTuple<Rest, EntriesToRemove>]
  : readonly [];

type OmitSchemaProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
  RequiredField = undefined extends Schema['required']
    ? undefined
    : OmitFromTuple<
        // @ts-expect-error extends doesn't narrow type
        Schema['required'],
        Keys
      >,
> = Omit<Schema, 'properties' | 'required'> & {
  readonly properties: Omit<Schema['properties'], Keys[number]>;
  readonly required: RequiredField extends readonly []
    ? undefined
    : RequiredField;
};

/**
 * Remove specified properties from a JSON Schema object definition.
 */
export function omitObjectProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
>(
  schema: Schema,
  keysToRemove: Keys,
): Simplify<OmitSchemaProperties<Schema, Keys>> {
  isObjectType(schema);

  const required = schema.required
    ? schema.required.filter((key) => !keysToRemove.includes(key))
    : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    properties: Object.fromEntries(
      Object.entries(schema.properties).filter(
        ([key]) => !keysToRemove.includes(key),
      ),
    ),
    required: required.length > 0 ? required : undefined,
  };
}
