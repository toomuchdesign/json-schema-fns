import { isObject } from './utils';
import type { JSONSchema, JSONSchemaObjectOutput } from './utils/types';

type OmitAdditionalPropertiesDeep<Value> = Value extends object
  ? Value extends { type: 'object' }
    ? // JSON schema object type
      {
        [Key in keyof Omit<
          Value,
          'additionalProperties'
        >]: OmitAdditionalPropertiesDeep<Value[Key]>;
      }
    : // Any other object/array
      {
        [Key in keyof Value]: OmitAdditionalPropertiesDeep<Value[Key]>;
      }
  : // Any other primitive
    Value;

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
 * Recursively remove `additionalProperties` from all object JSON schema schemas.
 *
 * @example
 * ```ts
 * unsealSchemaDeep(schema);
 * ```
 */
export function unsealSchemaDeep<const Schema extends JSONSchema>(
  schema: Schema,
): JSONSchemaObjectOutput<OmitAdditionalPropertiesDeep<Schema>> {
  // @ts-expect-error not relying on natural type flow
  return omitAdditionalPropertiesDeep(schema);
}

/**
 * Recursively remove `additionalProperties` from all object JSON schema schemas.
 * Wraps `unsealSchemaDeep` to support function piping
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeUnsealSchemaDeep());
 * ```
 */
export function pipeUnsealSchemaDeep<const Schema extends JSONSchema>() {
  return (schema: Schema) => unsealSchemaDeep<Schema>(schema);
}
