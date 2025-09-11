import type { JSONSchema, JSONSchemaObjectOutput } from './types';
import { isObject } from './utils';

type OmitAdditionalProperty<Value extends object> = 'type' extends keyof Value
  ? Value['type'] extends 'object'
    ? Omit<Value, 'additionalProperties'>
    : Value
  : Value;

type OmitAdditionalPropertiesDeep<
  _Value extends object,
  Value = OmitAdditionalProperty<_Value>,
> = {
  [Key in keyof Value]: Value[Key] extends object
    ? OmitAdditionalPropertiesDeep<Value[Key]>
    : Value[Key];
};

function omitAdditionalPropertiesDeep(item: unknown): unknown {
  if (isObject(item)) {
    if (item.type === 'object') {
      if ('additionalProperties' in item) {
        const { additionalProperties, ...rest } = item;
        item = rest;
      }
    }

    return Object.fromEntries(
      // @ts-expect-error couldn't get generics to work with json schema
      Object.entries(item).map(([key, value]) => {
        return [key, omitAdditionalPropertiesDeep(value)];
      }),
    );
  }

  if (Array.isArray(item)) {
    return item.map(omitAdditionalPropertiesDeep);
  }

  return item;
}

/**
 * Recursively remove `additionalProperties` from all object schemas.
 */
export function openObjectDeep<Schema extends JSONSchema>(
  schema: Schema,
): JSONSchemaObjectOutput<OmitAdditionalPropertiesDeep<Schema>> {
  // @ts-expect-error not relying on natural type flow
  return omitAdditionalPropertiesDeep(schema);
}
