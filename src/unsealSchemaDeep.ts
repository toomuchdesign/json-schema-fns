import {
  isArrayCombinatorKeyword,
  isObjectCombinatorKeyword,
  isObjectPropertiesDefinitionKeyword,
  isRecord,
} from './utils';
import type {
  ArrayCombinators,
  JSONSchema,
  ObjectCombinators,
  ObjectPropertiesDefinitionKeyword,
  UnknownArray,
  UnknownRecord,
} from './utils/types';

type UnsealSchemaDeep<
  Value,
  ItemKey extends PropertyKey | undefined,
  ParentItemKey extends PropertyKey | undefined,
  // Check if current item is an object definition property
  IsObjectProperty = ParentItemKey extends ObjectPropertiesDefinitionKeyword
    ? true
    : false,
> = Value extends UnknownRecord
  ? ItemKey extends ObjectCombinators
    ? IsObjectProperty extends false
      ? // Value key is schema object combinators
        /**
         * Skip JSON schema object combinators (stop iteration)
         * @TODO consider skipping additionalProperties handling only on root child object
         */
        Value
      : // Value key is schema object combinator, but it’s being used in an object definition context
        {
          [Key in keyof Omit<Value, 'additionalProperties'>]: UnsealSchemaDeep<
            Value[Key],
            Key,
            ItemKey
          >;
        }
    : Value extends { type: 'object' }
      ? // Value is JSON schema object
        {
          [Key in keyof Omit<Value, 'additionalProperties'>]: UnsealSchemaDeep<
            Value[Key],
            Key,
            ItemKey
          >;
        }
      : // Value is any other object
        {
          [Key in keyof Value]: UnsealSchemaDeep<Value[Key], Key, ItemKey>;
        }
  : Value extends UnknownArray
    ? // Value is array
      /**
       * Skip JSON schema array combinators (stop iteration)
       * @TODO consider skipping additionalProperties handling only on root child object
       */
      ItemKey extends ArrayCombinators
      ? Value
      : {
          [Key in keyof Value]: UnsealSchemaDeep<Value[Key], Key, ItemKey>;
        }
    : // Value is any other primitive
      Value;

function omitAdditionalPropertiesDeep(
  item: unknown,
  itemKey = '',
  parentItemKey = '',
): unknown {
  if (isRecord(item)) {
    // Check if current item is an object definition property
    const isObjectProperty = isObjectPropertiesDefinitionKeyword(parentItemKey);

    /**
     * Skip JSON schema object combinators (stop iteration).
     * @TODO consider skipping additionalProperties handling only on root child object
     */
    if (isObjectCombinatorKeyword(itemKey) && !isObjectProperty) {
      return item;
    }

    if (item.type === 'object') {
      if ('additionalProperties' in item) {
        const { additionalProperties, ...rest } = item;
        item = rest;
      }
    }

    return Object.fromEntries(
      // @ts-expect-error couldn't get generics to work with json schema
      Object.entries(item).map(([key, value]) => {
        return [key, omitAdditionalPropertiesDeep(value, key, itemKey)];
      }),
    );
  }

  if (Array.isArray(item)) {
    /**
     * Skip JSON schema array combinators (stop iteration)
     * @TODO consider skipping additionalProperties handling only on root child object
     */
    if (isArrayCombinatorKeyword(itemKey)) {
      return item;
    }

    return item.map((item) =>
      omitAdditionalPropertiesDeep(item, 'index', itemKey),
    );
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
): UnsealSchemaDeep<Schema, undefined, undefined> {
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
