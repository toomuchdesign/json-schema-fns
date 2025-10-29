import { isRecord } from './utils';
import type {
  JSONSchema,
  MergeRecords,
  Simplify,
  UnknownArray,
  UnknownRecord,
} from './utils/types';

// https://json-schema.org/understanding-json-schema/reference/combining
const arrayCombinators = ['allOf', 'anyOf', 'oneOf'] as const;
const objectCombinators = ['not'] as const;

type ArrayCombinators = (typeof arrayCombinators)[number];
type ObjectCombinators = (typeof objectCombinators)[number];

type SealSchemaDeep<
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
    : Simplify<
        MergeRecords<
          {
            [Key in keyof Value]: SealSchemaDeep<Value[Key], Key>;
          },
          { readonly additionalProperties: false }
        >
      >
  : Value extends UnknownRecord
    ? // Value is any other object
      {
        [Key in keyof Value]: SealSchemaDeep<Value[Key], Key>;
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
            [Key in keyof Value]: SealSchemaDeep<Value[Key], Key>;
          }
      : // Value is any other primitive
        Value;

function disableAdditionalPropertiesDeep(
  item: unknown,
  itemPropName?: string,
): unknown {
  if (isRecord(item)) {
    if (item.type === 'object') {
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

      item = { ...item, additionalProperties: false };
    }

    return Object.fromEntries(
      // @ts-expect-error couldn't get generics to work with json schema
      Object.entries(item).map(([key, value]) => {
        return [key, disableAdditionalPropertiesDeep(value, key)];
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

    return item.map((item) =>
      disableAdditionalPropertiesDeep(item, itemPropName),
    );
  }

  return item;
}

/**
 * Recursively set `additionalProperties: false` on all object JSON schema schemas.
 *
 * It does not modify [JSON Schema combinators](https://json-schema.org/understanding-json-schema/reference/combining) such as `allOf`, `anyOf`, `oneOf`, or `not`.
 * This ensures that the logical combination of schemas remains intact and that the semantics of the schema are not altered in any way.
 *
 * @example
 * ```ts
 * sealSchemaDeep(schema);
 * ```
 */
export function sealSchemaDeep<const Schema extends JSONSchema>(
  schema: Schema,
): SealSchemaDeep<Schema, undefined> {
  // @ts-expect-error not relying on natural type flow
  return disableAdditionalPropertiesDeep(schema);
}

/**
 * Recursively set `additionalProperties: false` on all object JSON schema schemas.
 * Wraps `sealSchemaDeep` to support function piping
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeSealSchemaDeep());
 * ```
 */
export function pipeSealSchemaDeep<const Schema extends JSONSchema>() {
  return (schema: Schema) => sealSchemaDeep<Schema>(schema);
}
