import type { Simplify, JSONSchemaObject } from './types';

type PickFromTuple<
  Tuple extends readonly unknown[],
  EntriesToKeep extends readonly unknown[],
> = Tuple extends readonly [infer First, ...infer Rest]
  ? First extends EntriesToKeep[number]
    ? readonly [First, ...PickFromTuple<Rest, EntriesToKeep>]
    : PickFromTuple<Rest, EntriesToKeep>
  : readonly [];

type PickSchemaProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
  RequiredField = undefined extends Schema['required']
    ? undefined
    : PickFromTuple<
        // @ts-expect-error extends doesn't narrow type
        Schema['required'],
        Keys
      >,
> = Omit<Schema, 'properties' | 'required'> & {
  readonly properties: Pick<Schema['properties'], Keys[number]>;
  readonly required: RequiredField extends readonly []
    ? undefined
    : RequiredField;
};

export function pickObjectProperties<
  Schema extends JSONSchemaObject,
  Keys extends (keyof Schema['properties'])[],
>(
  schema: Schema,
  keysToPick: Keys,
): Simplify<PickSchemaProperties<Schema, Keys>> {
  if (schema.type !== 'object') {
    // @ts-expect-error types don't allow non-object schemas
    return schema;
  }

  const required = schema.required
    ? schema.required.filter((key) => keysToPick.includes(key))
    : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    properties: Object.fromEntries(
      Object.entries(schema.properties).filter(([key]) =>
        keysToPick.includes(key),
      ),
    ),
    required: required.length > 0 ? required : undefined,
  };
}
