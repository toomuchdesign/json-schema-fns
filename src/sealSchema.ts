import type { Merge } from 'type-fest';

import { isObject } from './utils';
import type { JSONSchema, JSONSchemaObjectOutput } from './utils/types';

type DisableAdditionalPropertiesDeep<Value> = Value extends object
  ? Value extends { type: 'object' }
    ? // JSON schema object type
      Readonly<
        Merge<
          {
            [Key in keyof Value]: DisableAdditionalPropertiesDeep<Value[Key]>;
          },
          { additionalProperties: false }
        >
      >
    : // Any other object/array
      Readonly<{
        [Key in keyof Value]: DisableAdditionalPropertiesDeep<Value[Key]>;
      }>
  : // Any other primitive
    Value;

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
 * Recursively set `additionalProperties: false` on all object schemas
 *
 * @example
 * ```ts
 * sealSchema(schema);
 * ```
 */
export function sealSchema<Schema extends JSONSchema>(
  schema: Schema,
): JSONSchemaObjectOutput<DisableAdditionalPropertiesDeep<Schema>> {
  // @ts-expect-error not relying on natural type flow
  return disableAdditionalPropertiesDeep(schema);
}
