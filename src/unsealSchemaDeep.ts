import { isRecord } from './utils';
import type { JSONSchema, UnknownArray, UnknownRecord } from './utils/types';

// https://json-schema.org/understanding-json-schema/reference/combining
const arrayCombinators = ['allOf', 'anyOf', 'oneOf'] as const;
const objectCombinators = ['not'] as const;

type ArrayCombinators = (typeof arrayCombinators)[number];
type ObjectCombinators = (typeof objectCombinators)[number];

type UnsealSchemaDeep<
  Value,
  ItemPropName extends PropertyKey | undefined,
> = Value extends { type: 'object' }
  ? // Value is JSON schema object
    /**
     * Skip JSON schema object combinators (stop iteration)
     * @TODO consider skipping additionalProperties only on root child object
     */
    ItemPropName extends ObjectCombinators
    ? Value
    : {
        [Key in keyof Omit<Value, 'additionalProperties'>]: UnsealSchemaDeep<
          Value[Key],
          Key
        >;
      }
  : Value extends UnknownRecord
    ? // Value is any other object
      {
        [Key in keyof Value]: UnsealSchemaDeep<Value[Key], Key>;
      }
    : Value extends UnknownArray
      ? // Value is array
        /**
         * Skip JSON schema array combinators (stop iteration)
         * @TODO consider skipping additionalProperties only on root child object
         */
        ItemPropName extends ArrayCombinators
        ? Value
        : {
            [Key in keyof Value]: UnsealSchemaDeep<Value[Key], Key>;
          }
      : // Value is any other primitive
        Value;

function omitAdditionalPropertiesDeep(
  item: unknown,
  itemPropName?: string,
): unknown {
  if (isRecord(item)) {
    if (item.type === 'object') {
      if ('additionalProperties' in item) {
        /**
         * Skip JSON schema object combinators (stop iteration)
         * @TODO consider skipping additionalProperties only on root child object
         */
        if (
          itemPropName &&
          objectCombinators.includes(itemPropName as ObjectCombinators)
        ) {
          return item;
        }

        const { additionalProperties, ...rest } = item;
        item = rest;
      }
    }

    return Object.fromEntries(
      // @ts-expect-error couldn't get generics to work with json schema
      Object.entries(item).map(([key, value]) => {
        return [key, omitAdditionalPropertiesDeep(value, key)];
      }),
    );
  }

  if (Array.isArray(item)) {
    /**
     * Skip JSON schema array combinators (stop iteration)
     * @TODO consider skipping additionalProperties only on root child object
     */
    if (
      itemPropName &&
      arrayCombinators.includes(itemPropName as ArrayCombinators)
    ) {
      return item;
    }

    return item.map((item) => omitAdditionalPropertiesDeep(item, itemPropName));
  }

  return item;
}

/**
 * Recursively remove `additionalProperties` from all object JSON schema schemas.
 *
 * It does not modify [JSON Schema combinators](https://json-schema.org/understanding-json-schema/reference/combining) such as `allOf`, `anyOf`, `oneOf`, or `not`.
 * This ensures that the logical combination of schemas remains intact and that the semantics of the schema are not altered in any way.
 *
 * @example
 * ```ts
 * unsealSchemaDeep(schema);
 * ```
 */
export function unsealSchemaDeep<const Schema extends JSONSchema>(
  schema: Schema,
): UnsealSchemaDeep<Schema, undefined> {
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
