import type { Merge } from 'type-fest';

import type { JSONSchema, JSONSchemaObjectOutput } from './types';

type DisableAdditionalProperties<Value extends object> =
  'type' extends keyof Value
    ? Value['type'] extends 'object'
      ? Merge<Value, Readonly<{ additionalProperties: false }>>
      : Value
    : Value;

type DisableAdditionalPropertiesDeep<
  _Value extends object,
  Value = DisableAdditionalProperties<_Value>,
> = {
  [Key in keyof Value]: Value[Key] extends object
    ? DisableAdditionalPropertiesDeep<Value[Key]>
    : Value[Key];
};

function isObject(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === 'object' && input !== null && input.constructor === Object
  );
}

function disableAdditionalPropertiesDeep(item: unknown): unknown {
  if (isObject(item)) {
    if (item.type === 'object') {
      item = { ...item, additionalProperties: false };
    }

    return Object.fromEntries(
      // @ts-expect-error couldn't get generics to work with json schema
      Object.entries(item).map(([key, value]) => {
        return [key, disableAdditionalPropertiesDeep(value)];
      }),
    );
  }

  if (Array.isArray(item)) {
    return item.map(disableAdditionalPropertiesDeep);
  }

  return item;
}

/**
 * Close object by recursively setting `additionalProperties` to false
 */
export function closeObjectDeep<Schema extends JSONSchema>(
  schema: Schema,
): JSONSchemaObjectOutput<DisableAdditionalPropertiesDeep<Schema>> {
  // @ts-expect-error couldn't get generics to work with json schema
  return disableAdditionalPropertiesDeep(schema);
}
